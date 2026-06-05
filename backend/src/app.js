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
const { publicApiUrl, version } = require('./config');

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

function html(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function requestPublicBase(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (!host) return publicApiUrl;

  const protoHeader = req.headers['x-forwarded-proto'];
  const proto = Array.isArray(protoHeader)
    ? protoHeader[0]
    : String(protoHeader || '').split(',')[0].trim();

  const fallbackProto = String(host).includes('onrender.com') ? 'https' : 'http';
  return `${proto || fallbackProto}://${host}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function tempHtml(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '--';
  return `${number.toFixed(1)}&deg;C`;
}

function cardWebState(card) {
  if (card.online === false) return 'offline';
  if (card.state === 'crit') return 'crit';
  if (card.state === 'warn') return 'warn';
  return 'blue';
}

function cardWebLabel(card) {
  if (card.online === false) return 'SEM COMUNICACAO';
  if (card.state === 'crit') return 'CRITICO';
  if (card.state === 'warn') return 'ATENCAO';
  return 'NORMAL';
}

function thermometerPercent(card) {
  const temp = Number(card.temp);
  const min = Number(card.min ?? 2);
  const max = Number(card.max ?? 8);
  if (!Number.isFinite(temp)) return 18;
  const ratio = (temp - min) / Math.max(0.1, max - min);
  return Math.max(12, Math.min(100, Math.round(22 + ratio * 66)));
}

function renderDeviceQrPage(card, code) {
  const state = cardWebState(card);
  const status = cardWebLabel(card);
  const level = thermometerPercent(card);

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>IDsensor - ${escapeHtml(card.name)}</title>
  <style>
    :root { color-scheme: light; font-family: Inter, Arial, sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f4f8fc; color: #14243b; }
    main { min-height: 100vh; padding: 22px 16px 26px; }
    .shell { margin: 0 auto; max-width: 448px; }
    .brand { align-items: center; display: flex; justify-content: center; margin-bottom: 18px; }
    .brand-logo { display: block; height: auto; max-width: 282px; width: 78%; }
    .client { margin-bottom: 14px; text-align: left; }
    .client h1 { color: #10284a; font-size: 30px; line-height: 1.08; margin: 0; }
    .client p { color: #5c6f8d; font-size: 15px; font-weight: 800; margin: 6px 0 0; }
    .device-heading { align-items: center; background: #ffffff; border: 1px solid #d8e4f2; border-radius: 8px; box-shadow: 0 10px 26px rgba(9,35,67,0.08); color: #0b2f55; display: flex; font-size: 18px; font-weight: 900; justify-content: center; margin-bottom: 14px; min-height: 52px; padding: 12px 16px; text-align: center; }
    .device-card { border-radius: 8px; border: 1px solid rgba(255,255,255,0.22); box-shadow: 0 18px 38px rgba(9,35,67,0.18); color: white; min-height: 390px; padding: 25px 24px 22px; }
    .device-card.blue { background: #243f7d; }
    .device-card.warn { background: #d99135; }
    .device-card.crit, .device-card.offline { background: #b83246; }
    .card-top { align-items: flex-start; display: flex; justify-content: space-between; gap: 12px; }
    .device-name { font-size: 24px; font-weight: 900; margin: 0; }
    .sector { color: #d7e6ff; font-size: 14px; font-weight: 800; margin-top: 5px; }
    .dot { border: 2px solid rgba(255,255,255,0.65); border-radius: 50%; height: 22px; width: 22px; }
    .blue .dot, .blue .fill, .blue .bulb { background: #35a9ff; }
    .warn .dot, .warn .fill, .warn .bulb { background: #ffcf79; }
    .crit .dot, .crit .fill, .crit .bulb, .offline .dot, .offline .fill, .offline .bulb { background: #ff7480; }
    .reading { align-items: center; display: flex; justify-content: space-between; margin-top: 44px; }
    .temp { font-size: 74px; font-weight: 300; line-height: 1; }
    .status { background: rgba(255,255,255,0.16); border-radius: 6px; display: inline-block; font-size: 12px; font-weight: 900; margin-top: 12px; padding: 7px 10px; }
    .thermo { align-items: center; display: flex; flex-direction: column; justify-content: flex-end; margin-left: 16px; width: 52px; }
    .track { align-items: center; background: #e9edf4; border: 4px solid #bac7d8; border-radius: 16px; display: flex; height: 124px; justify-content: flex-end; overflow: hidden; width: 32px; }
    .fill { border-radius: 10px; width: 12px; }
    .bulb { border: 4px solid #cad7e6; border-radius: 50%; height: 48px; margin-top: -8px; width: 48px; }
    .metrics { display: grid; gap: 14px; grid-template-columns: 1fr 1fr; margin-top: 32px; }
    .metric { background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 15px; }
    .metric small { color: #d5e3f6; display: block; font-size: 11px; font-weight: 900; }
    .metric strong { color: white; display: block; font-size: 22px; font-weight: 900; margin-top: 4px; }
    .footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 22px; color: #f1f7ff; font-size: 15px; font-weight: 900; }
    .powered { align-items: center; color: #65758f; display: flex; gap: 10px; justify-content: center; margin-top: 20px; font-size: 12px; font-weight: 800; }
    .powered-logo { display: block; height: 31px; width: auto; }
    @media (max-width: 520px) {
      main { padding: 16px 12px 22px; }
      .brand-logo { max-width: 238px; width: 80%; }
      .client h1 { font-size: 24px; }
      .device-card { min-height: 356px; padding: 21px 18px 19px; }
      .temp { font-size: 64px; }
      .reading { margin-top: 34px; }
      .metrics { margin-top: 26px; }
    }
  </style>
</head>
<body>
  <main>
    <section class="shell">
      <div class="brand">
        <img class="brand-logo" src="/assets/idsensor-logo.png" alt="IDsensor">
      </div>
      <div class="client">
        <h1>${escapeHtml(card.clientName || 'Cliente')}</h1>
        <p>${escapeHtml(card.unitName || 'Unidade')} - ${escapeHtml(card.local || card.sector || 'Area monitorada')}</p>
      </div>
      <div id="pageDeviceName" class="device-heading">${escapeHtml(card.name || 'Equipamento')}</div>
      <article id="deviceCard" class="device-card ${state}">
        <div class="card-top">
          <div>
            <h2 id="deviceName" class="device-name">${escapeHtml(card.name || 'Equipamento')}</h2>
            <div id="sector" class="sector">${escapeHtml(card.sector || card.local || 'Banco de Sangue')}</div>
          </div>
          <div class="dot"></div>
        </div>
        <div class="reading">
          <div>
            <div id="temp" class="temp">${tempHtml(card.temp)}</div>
            <div id="status" class="status">${status}</div>
          </div>
          <div class="thermo">
            <div class="track"><div id="thermoFill" class="fill" style="height: ${level}%"></div></div>
            <div class="bulb"></div>
          </div>
        </div>
        <div class="metrics">
          <div class="metric"><small>MIN</small><strong id="minTemp">${tempHtml(card.dailyMin)}</strong></div>
          <div class="metric"><small>MAX</small><strong id="maxTemp">${tempHtml(card.dailyMax)}</strong></div>
        </div>
        <div class="footer">
          <span id="battery">Bateria ${escapeHtml(card.battery ?? '--')}%</span>
          <span id="humidity">Umidade ${escapeHtml(card.hum1 ?? '--')}%</span>
        </div>
      </article>
      <div class="powered">Powered by <img class="powered-logo" src="/assets/idvida-logo.png" alt="IDvida"></div>
    </section>
  </main>
  <script>
    const code = ${JSON.stringify(code)};
    const card = document.getElementById('deviceCard');
    const fields = {
      name: document.getElementById('deviceName'),
      pageName: document.getElementById('pageDeviceName'),
      sector: document.getElementById('sector'),
      temp: document.getElementById('temp'),
      status: document.getElementById('status'),
      min: document.getElementById('minTemp'),
      max: document.getElementById('maxTemp'),
      battery: document.getElementById('battery'),
      humidity: document.getElementById('humidity'),
      fill: document.getElementById('thermoFill')
    };

    function stateFor(item) {
      if (item.online === false) return 'offline';
      if (item.state === 'crit') return 'crit';
      if (item.state === 'warn') return 'warn';
      return 'blue';
    }

    function statusFor(item) {
      if (item.online === false) return 'SEM COMUNICACAO';
      if (item.state === 'crit') return 'CRITICO';
      if (item.state === 'warn') return 'ATENCAO';
      return 'NORMAL';
    }

    function temp(value) {
      const number = Number(value);
      return Number.isFinite(number) ? number.toFixed(1) + '\\u00b0C' : '--';
    }

    function levelFor(item) {
      const current = Number(item.temp);
      const min = Number(item.min || 2);
      const max = Number(item.max || 8);
      if (!Number.isFinite(current)) return 18;
      const ratio = (current - min) / Math.max(0.1, max - min);
      return Math.max(12, Math.min(100, Math.round(22 + ratio * 66)));
    }

    function render(item) {
      const state = stateFor(item);
      card.className = 'device-card ' + state;
      fields.pageName.textContent = item.name || 'Equipamento';
      fields.name.textContent = item.name || 'Equipamento';
      fields.sector.textContent = item.sector || item.local || 'Banco de Sangue';
      fields.temp.textContent = temp(item.temp);
      fields.status.textContent = statusFor(item);
      fields.min.textContent = temp(item.dailyMin);
      fields.max.textContent = temp(item.dailyMax);
      fields.battery.textContent = 'Bateria ' + (item.battery ?? '--') + '%';
      fields.humidity.textContent = 'Umidade ' + (item.hum1 ?? '--') + '%';
      fields.fill.style.height = levelFor(item) + '%';
    }

    async function refresh() {
      try {
        const response = await fetch('/devices/by-code/' + encodeURIComponent(code), { cache: 'no-store' });
        const payload = await response.json();
        if (payload.ok && payload.data && payload.data.card) render(payload.data.card);
      } catch (error) {
        console.warn('Nao foi possivel atualizar o card', error);
      }
    }

    setInterval(refresh, 60000);
    setTimeout(refresh, 500);
  </script>
</body>
</html>`;
}

function renderActivationQrPage(activation, code, appUrl = publicApiUrl) {
  const clientName = activation?.cliente_nome || 'Cliente vinculado';
  const unitName = activation?.unidade_nome || 'Unidade vinculada';

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>IDsensor - Ativacao</title>
  <style>
    :root { font-family: Inter, Arial, sans-serif; }
    body { background: #f4f8fc; color: #14243b; margin: 0; }
    main { min-height: 100vh; padding: 28px 18px; display: grid; place-items: center; }
    section { background: white; border: 1px solid #d8e4f2; border-radius: 8px; box-shadow: 0 18px 38px rgba(9,35,67,0.12); max-width: 440px; padding: 24px; width: 100%; }
    .logo { display: block; height: auto; margin: 0 auto 18px; max-width: 250px; width: 78%; }
    h1 { font-size: 25px; margin: 0 0 10px; }
    p { color: #65758f; font-size: 15px; font-weight: 700; line-height: 1.5; margin: 0 0 16px; }
    .code { background: #eaf2fb; border: 1px solid #d8e4f2; border-radius: 8px; color: #0b2f55; font-size: 23px; font-weight: 900; letter-spacing: 1px; padding: 14px; text-align: center; }
    .client { margin-top: 16px; }
    .powered { align-items: center; color: #65758f; display: flex; gap: 10px; justify-content: center; margin-top: 24px; font-size: 12px; font-weight: 800; }
    .powered img { display: block; height: 31px; width: auto; }
  </style>
</head>
<body>
  <main>
    <section>
      <img class="logo" src="/assets/idsensor-logo.png" alt="IDsensor">
      <h1>Ativar aparelho celular</h1>
      <p>Digite este codigo no app IDsensor para vincular o celular ao cliente. Esta tela tambem confirma que o QR abriu pelo navegador.</p>
      <div class="code">${escapeHtml(code)}</div>
      <p class="client">${escapeHtml(clientName)}<br>${escapeHtml(unitName)}</p>
      <p>Backend conectado em ${escapeHtml(appUrl)}.</p>
      <div class="powered">Powered by <img src="/assets/idvida-logo.png" alt="IDvida"></div>
    </section>
  </main>
</body>
</html>`;
}

function renderQrMessagePage(title, message, code) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>IDsensor - ${escapeHtml(title)}</title>
  <style>
    :root { font-family: Inter, Arial, sans-serif; }
    body { background: #f4f8fc; color: #14243b; margin: 0; }
    main { min-height: 100vh; padding: 28px 18px; display: grid; place-items: center; }
    section { background: white; border: 1px solid #d8e4f2; border-radius: 8px; box-shadow: 0 18px 38px rgba(9,35,67,0.12); max-width: 440px; padding: 24px; width: 100%; }
    .logo { display: block; height: auto; margin: 0 auto 18px; max-width: 250px; width: 78%; }
    h1 { font-size: 25px; margin: 0 0 10px; }
    p { color: #65758f; font-size: 15px; font-weight: 700; line-height: 1.5; margin: 0 0 16px; }
    .code { background: #eaf2fb; border: 1px solid #d8e4f2; border-radius: 8px; color: #0b2f55; font-size: 18px; font-weight: 900; padding: 14px; text-align: center; }
  </style>
</head>
<body>
  <main>
    <section>
      <img class="logo" src="/assets/idsensor-logo.png" alt="IDsensor">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <div class="code">${escapeHtml(code || '--')}</div>
    </section>
  </main>
</body>
</html>`;
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

function getDeviceByScannedCode(code) {
  const db = getDb();
  const byQr = db.prepare(deviceSelectSql('WHERE d.qr_code = ?')).get(code);
  if (byQr) return byQr;

  return db.prepare(deviceSelectSql(`
    JOIN activation_codes ac ON ac.dispositivo_id = d.id
    WHERE ac.codigo = ? AND ac.ativo = 1
  `)).get(code);
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

addRoute('GET', '/q/:codigo', async ({ params, res }) => {
  const code = extractScannedCode(params.codigo);
  const db = getDb();
  advanceSimulationIfNeeded(db);

  const row = getDeviceByScannedCode(code);
  if (!row) {
    return html(res, 404, renderQrMessagePage(
      'QR nao encontrado',
      'Nao encontramos um equipamento ativo para este QR Code.',
      code || 'QR NAO ENCONTRADO'
    ));
  }

  return html(res, 200, renderDeviceQrPage(buildDeviceCard(row), code));
});

addRoute('GET', '/a/:codigo', async ({ params, req, res }) => {
  const code = extractScannedCode(params.codigo);
  const activation = getDb().prepare(`
    SELECT ac.*, c.nome AS cliente_nome, u.nome AS unidade_nome
    FROM activation_codes ac
    JOIN clientes c ON c.id = ac.cliente_id
    JOIN unidades u ON u.id = ac.unidade_id
    WHERE ac.codigo = ? AND ac.ativo = 1 AND ac.tipo_ativacao = 'app_alerta'
  `).get(code);

  return html(res, activation ? 200 : 404, renderActivationQrPage(
    activation,
    code || 'CODIGO INVALIDO',
    requestPublicBase(req)
  ));
});

addRoute('GET', '/devices/by-code/:codigo', async ({ params, req, res }) => {
  const code = extractScannedCode(params.codigo);
  const db = getDb();
  advanceSimulationIfNeeded(db);
  const row = getDeviceByScannedCode(code);

  if (!row) return fail(res, 404, 'Dispositivo nao encontrado para este QR Code.');

  const payload = buildDevicePayload(row.qr_code, requestPublicBase(req));
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

addRoute('POST', '/activation-code', async ({ body, req, res }) => {
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

  const publicBase = requestPublicBase(req);
  const payload = tipoAtivacao === 'dispositivo_qrcode'
    ? buildDevicePayload(code, publicBase)
    : buildActivationPayload(code, publicBase);

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
