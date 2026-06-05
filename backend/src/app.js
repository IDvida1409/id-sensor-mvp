const {
  buildActivationPayload,
  buildDevicePayload,
  buildQrDataUrl,
  buildQrImageUrl,
  extractScannedCode
} = require('./utils/qr');
const fs = require('node:fs');
const path = require('node:path');
const { getDb } = require('./db/database');
const { seedDatabase } = require('./db/seed');
const { id, activationCode } = require('./utils/ids');
const { buildDeviceCard } = require('./services/deviceCard');
const { sendExpoPush } = require('./services/pushService');
const {
  advanceSimulationIfNeeded,
  getNocOccurrences,
  getSimulationState,
  runSimulationTick,
  serializeSimulationState,
  startSimulation,
  stopSimulation
} = require('./services/simulationService');
const { version } = require('./config');

const routes = [];
const panelDir = path.resolve(__dirname, '../../painel-original');
const staticMimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function nowIso() {
  return new Date().toISOString();
}

function addRoute(method, pattern, handler) {
  routes.push({ method, pattern, parts: pattern.split('/').filter(Boolean), handler });
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function ok(res, data, status = 200) {
  json(res, status, { ok: true, data });
}

function fail(res, status, message, details = null) {
  json(res, status, { ok: false, message, details });
}

function safePanelPath(urlPath) {
  const decoded = decodeURIComponent(String(urlPath || '/').split('?')[0]);
  const clean = decoded === '/' ? '/index.html' : decoded;
  const filePath = path.normalize(path.join(panelDir, clean));
  const relative = path.relative(panelDir, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return filePath;
}

function servePanelFile(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;

  const filePath = safePanelPath(pathname);
  if (!filePath) {
    fail(res, 403, 'Arquivo nao autorizado.');
    return true;
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return false;

  const contentType = staticMimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': 'no-store'
  });

  if (req.method === 'HEAD') {
    res.end();
    return true;
  }

  fs.createReadStream(filePath).pipe(res);
  return true;
}

function matchRoute(method, pathname) {
  const requestParts = pathname.split('/').filter(Boolean);

  for (const route of routes) {
    if (route.method !== method || route.parts.length !== requestParts.length) continue;

    const params = {};
    let matches = true;

    for (let index = 0; index < route.parts.length; index += 1) {
      const expected = route.parts[index];
      const actual = requestParts[index];

      if (expected.startsWith(':')) {
        params[expected.slice(1)] = actual;
      } else if (expected !== actual) {
        matches = false;
        break;
      }
    }

    if (matches) return { route, params };
  }

  return null;
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8').trim();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    const error = new Error('JSON invalido no corpo da requisicao.');
    error.statusCode = 400;
    throw error;
  }
}

function deviceSelectSql(where = '') {
  return `
    SELECT
      d.*,
      c.nome AS cliente_nome,
      u.nome AS unidade_nome,
      u.local AS unidade_local
    FROM dispositivos d
    JOIN clientes c ON c.id = d.cliente_id
    JOIN unidades u ON u.id = d.unidade_id
    ${where}
  `;
}

function getDeviceById(deviceId) {
  return getDb().prepare(deviceSelectSql('WHERE d.id = ?')).get(deviceId);
}

function alertSelectSql(where = '') {
  return `
    SELECT
      a.*,
      d.nome AS dispositivo_nome,
      d.local AS dispositivo_local,
      c.nome AS cliente_nome,
      u.nome AS unidade_nome,
      ad.modelo_aparelho AS reconhecido_por_modelo,
      ad.plataforma AS reconhecido_por_plataforma
    FROM alerts a
    JOIN dispositivos d ON d.id = a.dispositivo_id
    JOIN clientes c ON c.id = a.cliente_id
    JOIN unidades u ON u.id = a.unidade_id
    LEFT JOIN alert_acknowledgements ack ON ack.alert_id = a.id
    LEFT JOIN app_devices ad ON ad.id = ack.app_device_id
    ${where}
    ORDER BY a.criado_em DESC
  `;
}

function buildAlert(row) {
  return {
    id: row.id,
    cliente_id: row.cliente_id,
    unidade_id: row.unidade_id,
    dispositivo_id: row.dispositivo_id,
    tipo_alerta: row.tipo_alerta,
    mensagem: row.mensagem,
    temperatura_atual: row.temperatura_atual,
    faixa_minima: row.faixa_minima,
    faixa_maxima: row.faixa_maxima,
    severidade: row.severidade,
    status: row.status,
    criado_em: row.criado_em,
    reconhecido_em: row.reconhecido_em,
    encerrado_em: row.encerrado_em,
    dispositivo: {
      nome: row.dispositivo_nome,
      local: row.dispositivo_local
    },
    cliente: {
      nome: row.cliente_nome
    },
    unidade: {
      nome: row.unidade_nome
    },
    reconhecido_por: row.reconhecido_por_modelo
      ? {
          modelo_aparelho: row.reconhecido_por_modelo,
          plataforma: row.reconhecido_por_plataforma
        }
      : null
  };
}

addRoute('GET', '/health', async ({ res }) => {
  ok(res, {
    status: 'online',
    datetime: nowIso(),
    version
  });
});

addRoute('POST', '/seed', async ({ res }) => {
  ok(res, seedDatabase(), 201);
});

addRoute('GET', '/devices', async ({ res }) => {
  advanceSimulationIfNeeded(getDb());
  const rows = getDb().prepare(deviceSelectSql('ORDER BY d.nome ASC')).all();
  ok(res, rows.map(buildDeviceCard));
});

addRoute('GET', '/devices/by-code/:codigo', async ({ params, res }) => {
  const code = extractScannedCode(params.codigo);
  const db = getDb();

  const byQr = db.prepare(deviceSelectSql('WHERE d.qr_code = ?')).get(code);
  const byActivation = byQr ? null : db.prepare(deviceSelectSql(`
    JOIN activation_codes ac ON ac.dispositivo_id = d.id
    WHERE ac.codigo = ? AND ac.ativo = 1
  `)).get(code);
  const row = byQr || byActivation;

  if (!row) return fail(res, 404, 'Dispositivo nao encontrado para este QR Code.');

  const payload = buildDevicePayload(row.qr_code);
  const card = buildDeviceCard(row);
  return ok(res, {
    device: card,
    card,
    qr: {
      code: row.qr_code,
      payload
    }
  });
});

addRoute('GET', '/devices/:id', async ({ params, res }) => {
  const row = getDeviceById(params.id);
  if (!row) return fail(res, 404, 'Dispositivo nao encontrado.');
  ok(res, buildDeviceCard(row));
});

addRoute('POST', '/devices/:id/update-status', async ({ params, body, res }) => {
  const current = getDeviceById(params.id);
  if (!current) return fail(res, 404, 'Dispositivo nao encontrado.');

  const status = body.status || current.status;
  const temperatura = Object.prototype.hasOwnProperty.call(body, 'temperatura_atual')
    ? body.temperatura_atual
    : current.temperatura_atual;
  const ultimaComunicacao = body.ultima_comunicacao || 'agora';

  getDb().prepare(`
    UPDATE dispositivos
    SET temperatura_atual = ?, status = ?, ultima_comunicacao = ?, atualizado_em = ?
    WHERE id = ?
  `).run(temperatura, status, ultimaComunicacao, nowIso(), params.id);

  ok(res, buildDeviceCard(getDeviceById(params.id)));
});

addRoute('GET', '/simulation/status', async ({ res }) => {
  const db = getDb();
  advanceSimulationIfNeeded(db);
  ok(res, serializeSimulationState(getSimulationState(db)));
});

addRoute('POST', '/simulation/start', async ({ res }) => {
  ok(res, startSimulation(getDb()), 201);
});

addRoute('POST', '/simulation/stop', async ({ res }) => {
  ok(res, stopSimulation(getDb()));
});

addRoute('POST', '/simulation/tick', async ({ res }) => {
  ok(res, runSimulationTick(getDb()));
});

addRoute('GET', '/noc/occurrences/live', async ({ query, res }) => {
  ok(res, getNocOccurrences(getDb(), {
    mode: query.mode || 'area',
    filters: query.filters || 'all'
  }));
});

addRoute('POST', '/activation-code', async ({ body, res }) => {
  const db = getDb();
  const clienteId = body.cliente_id;
  const unidadeId = body.unidade_id;
  const dispositivoId = body.dispositivo_id || null;
  const tipoAtivacao = body.tipo_ativacao || 'app_alerta';

  if (!clienteId || !unidadeId) {
    return fail(res, 400, 'cliente_id e unidade_id sao obrigatorios.');
  }

  const prefix = tipoAtivacao === 'dispositivo_qrcode' ? 'DEV' : 'APP';
  const code = activationCode(prefix);
  const activationId = id('act');
  const createdAt = nowIso();

  db.prepare(`
    INSERT INTO activation_codes (
      id, codigo, cliente_id, unidade_id, dispositivo_id, tipo_ativacao, ativo, criado_em
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?)
  `).run(activationId, code, clienteId, unidadeId, dispositivoId, tipoAtivacao, createdAt);

  const payload = tipoAtivacao === 'dispositivo_qrcode'
    ? buildDevicePayload(code)
    : buildActivationPayload(code);

  ok(res, {
    id: activationId,
    codigo: code,
    cliente_id: clienteId,
    unidade_id: unidadeId,
    dispositivo_id: dispositivoId,
    tipo_ativacao: tipoAtivacao,
    qr_payload: payload,
    qr_code_data_url: await buildQrDataUrl(payload),
    qr_image_url: buildQrImageUrl(payload)
  }, 201);
});

addRoute('POST', '/activate', async ({ body, res }) => {
  const db = getDb();
  const codigo = extractScannedCode(body.codigo);
  const token = body.expo_push_token || null;
  const plataforma = body.plataforma || 'desconhecida';
  const modelo = body.modelo_aparelho || 'Aparelho de teste';

  if (!codigo) return fail(res, 400, 'Codigo de ativacao obrigatorio.');

  const activation = db.prepare(`
    SELECT ac.*, c.nome AS cliente_nome, u.nome AS unidade_nome
    FROM activation_codes ac
    JOIN clientes c ON c.id = ac.cliente_id
    JOIN unidades u ON u.id = ac.unidade_id
    WHERE ac.codigo = ? AND ac.ativo = 1 AND ac.tipo_ativacao = 'app_alerta'
  `).get(codigo);

  if (!activation) return fail(res, 404, 'Codigo invalido ou inativo.');

  const appDeviceId = id('appdev');
  const createdAt = nowIso();

  db.prepare(`
    INSERT INTO app_devices (
      id, activation_code_id, cliente_id, unidade_id, dispositivo_id,
      expo_push_token, plataforma, modelo_aparelho, ativo, criado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `).run(
    appDeviceId,
    activation.id,
    activation.cliente_id,
    activation.unidade_id,
    activation.dispositivo_id,
    token,
    plataforma,
    modelo,
    createdAt
  );

  db.prepare('UPDATE activation_codes SET usado_em = COALESCE(usado_em, ?) WHERE id = ?')
    .run(createdAt, activation.id);

  ok(res, {
    success: true,
    app_device_id: appDeviceId,
    cliente: {
      id: activation.cliente_id,
      nome: activation.cliente_nome
    },
    unidade: {
      id: activation.unidade_id,
      nome: activation.unidade_nome
    },
    dispositivo_id: activation.dispositivo_id
  }, 201);
});

addRoute('GET', '/app-devices', async ({ res }) => {
  const rows = getDb().prepare(`
    SELECT ad.*, c.nome AS cliente_nome, u.nome AS unidade_nome
    FROM app_devices ad
    JOIN clientes c ON c.id = ad.cliente_id
    JOIN unidades u ON u.id = ad.unidade_id
    ORDER BY ad.criado_em DESC
  `).all();

  ok(res, rows);
});

addRoute('POST', '/app-devices/:id/deactivate', async ({ params, res }) => {
  const result = getDb().prepare('UPDATE app_devices SET ativo = 0 WHERE id = ?').run(params.id);
  if (!result.changes) return fail(res, 404, 'Celular habilitado nao encontrado.');
  ok(res, { id: params.id, ativo: false });
});

addRoute('POST', '/alerts', async ({ body, res }) => {
  const db = getDb();
  const device = getDeviceById(body.dispositivo_id);
  if (!device) return fail(res, 404, 'Dispositivo nao encontrado.');

  const alertId = id('alert');
  const createdAt = nowIso();
  const tipoAlerta = body.tipo_alerta || 'temperatura';
  const severidade = body.severidade || (body.status === 'critico' ? 'critica' : 'alta');
  const temperatura = Object.prototype.hasOwnProperty.call(body, 'temperatura_atual')
    ? body.temperatura_atual
    : device.temperatura_atual;
  const mensagem = body.mensagem || `${device.nome} em alerta.`;

  db.prepare(`
    INSERT INTO alerts (
      id, cliente_id, unidade_id, dispositivo_id, tipo_alerta, mensagem,
      temperatura_atual, faixa_minima, faixa_maxima, severidade, status, criado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo', ?)
  `).run(
    alertId,
    device.cliente_id,
    device.unidade_id,
    device.id,
    tipoAlerta,
    mensagem,
    temperatura,
    device.faixa_minima,
    device.faixa_maxima,
    severidade,
    createdAt
  );

  const statusBySeverity = severidade === 'critica' ? 'critico' : 'atencao';
  db.prepare(`
    UPDATE dispositivos
    SET temperatura_atual = ?, status = ?, ultima_comunicacao = ?, atualizado_em = ?
    WHERE id = ?
  `).run(temperatura, statusBySeverity, 'agora', createdAt, device.id);

  const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(alertId);
  const recipients = db.prepare(`
    SELECT *
    FROM app_devices
    WHERE ativo = 1
      AND cliente_id = ?
      AND unidade_id = ?
      AND (dispositivo_id IS NULL OR dispositivo_id = ?)
  `).all(device.cliente_id, device.unidade_id, device.id);

  const logs = [];
  for (const recipient of recipients) {
    const pushResult = await sendExpoPush({
      token: recipient.expo_push_token,
      alert,
      device
    });

    const logId = id('notif');
    db.prepare(`
      INSERT INTO notification_logs (
        id, alert_id, app_device_id, expo_push_token, status_envio, resposta, criado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      logId,
      alertId,
      recipient.id,
      recipient.expo_push_token,
      pushResult.status_envio,
      pushResult.resposta,
      nowIso()
    );

    logs.push({ id: logId, app_device_id: recipient.id, ...pushResult });
  }

  if (!recipients.length) {
    db.prepare(`
      INSERT INTO notification_logs (
        id, alert_id, app_device_id, expo_push_token, status_envio, resposta, criado_em
      ) VALUES (?, ?, NULL, NULL, ?, ?, ?)
    `).run(id('notif'), alertId, 'no_recipients', 'Nenhum celular habilitado para esta unidade/dispositivo.', nowIso());
  }

  ok(res, {
    alert: buildAlert(db.prepare(alertSelectSql('WHERE a.id = ?')).get(alertId)),
    recipients_count: recipients.length,
    notification_logs: logs
  }, 201);
});

addRoute('GET', '/alerts/active', async ({ res }) => {
  const rows = getDb().prepare(alertSelectSql("WHERE a.status = 'ativo'")).all();
  ok(res, rows.map(buildAlert));
});

addRoute('GET', '/alerts/history', async ({ res }) => {
  const rows = getDb().prepare(alertSelectSql('')).all();
  ok(res, rows.map(buildAlert));
});

addRoute('GET', '/app/alerts/:app_device_id', async ({ params, res }) => {
  const appDevice = getDb().prepare('SELECT * FROM app_devices WHERE id = ? AND ativo = 1').get(params.app_device_id);
  if (!appDevice) return fail(res, 404, 'Celular habilitado nao encontrado.');

  const rows = getDb().prepare(alertSelectSql(`
    WHERE a.cliente_id = ?
      AND a.unidade_id = ?
      AND (? IS NULL OR a.dispositivo_id = ?)
  `)).all(appDevice.cliente_id, appDevice.unidade_id, appDevice.dispositivo_id, appDevice.dispositivo_id);

  ok(res, rows.map(buildAlert));
});

addRoute('GET', '/alerts/:id', async ({ params, res }) => {
  const row = getDb().prepare(alertSelectSql('WHERE a.id = ?')).get(params.id);
  if (!row) return fail(res, 404, 'Alerta nao encontrado.');
  ok(res, buildAlert(row));
});

addRoute('POST', '/alerts/:id/acknowledge', async ({ params, body, res }) => {
  const db = getDb();
  const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(params.id);
  if (!alert) return fail(res, 404, 'Alerta nao encontrado.');

  const appDeviceId = body.app_device_id;
  const appDevice = db.prepare('SELECT * FROM app_devices WHERE id = ? AND ativo = 1').get(appDeviceId);
  if (!appDevice) return fail(res, 404, 'Celular habilitado nao encontrado.');

  const createdAt = nowIso();
  db.prepare(`
    INSERT INTO alert_acknowledgements (id, alert_id, app_device_id, status, criado_em)
    VALUES (?, ?, ?, 'ciente', ?)
  `).run(id('ack'), alert.id, appDevice.id, createdAt);

  db.prepare(`
    UPDATE alerts
    SET status = 'reconhecido', reconhecido_em = ?
    WHERE id = ?
  `).run(createdAt, alert.id);

  ok(res, {
    success: true,
    alert: buildAlert(db.prepare(alertSelectSql('WHERE a.id = ?')).get(alert.id))
  });
});

addRoute('POST', '/alerts/:id/close', async ({ params, res }) => {
  const result = getDb().prepare(`
    UPDATE alerts
    SET status = 'encerrado', encerrado_em = ?
    WHERE id = ?
  `).run(nowIso(), params.id);

  if (!result.changes) return fail(res, 404, 'Alerta nao encontrado.');
  ok(res, { id: params.id, status: 'encerrado' });
});

addRoute('GET', '/notification-logs', async ({ res }) => {
  const rows = getDb().prepare('SELECT * FROM notification_logs ORDER BY criado_em DESC').all();
  ok(res, rows);
});

async function app(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const match = matchRoute(req.method, url.pathname);

    if (!match) {
      if (servePanelFile(req, res, url.pathname)) return;
      return fail(res, 404, 'Rota nao encontrada.');
    }

    const body = ['POST', 'PATCH', 'PUT'].includes(req.method) ? await readJsonBody(req) : {};

    await match.route.handler({
      req,
      res,
      params: match.params,
      query: Object.fromEntries(url.searchParams.entries()),
      body
    });
  } catch (error) {
    return fail(res, error.statusCode || 500, error.message || 'Erro interno no backend MVP.');
  }
}

module.exports = {
  app
};
