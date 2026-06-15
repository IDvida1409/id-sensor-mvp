const { getDb } = require('./database');

function nowIso() {
  return new Date().toISOString();
}

function chart(base) {
  return [
    base - 0.2,
    base - 0.1,
    base,
    base + 0.1,
    base,
    base - 0.1,
    base,
    base + 0.1,
    base + 0.2,
    base + 0.1,
    base,
    base
  ].map((value) => Number(value.toFixed(1)));
}

function normalTemp(index) {
  const values = [5.4, 3.2, 5.1, 4.8, 6.2, 7.4, 4.7, 5.9, 6.1, 2.8, 5.6, 6.8];
  return values[(index - 1) % values.length];
}

function geladeira(index) {
  const padded = String(index).padStart(2, '0');
  const temp = normalTemp(index);

  return {
    id: `disp_geladeira_${padded}`,
    nome: `Geladeira ${padded}`,
    tipo: 'geladeira',
    local: 'Banco IDvida',
    temperatura_atual: temp,
    status: 'normal',
    bateria: Math.max(42, 96 - index),
    umidade: 58 + (index % 12),
    qr_code: `DEV-GELADEIRA-${padded}`,
    chart_json: JSON.stringify(chart(temp))
  };
}

const DEMO_APP_ACTIVATION_CODES = [];

const DEACTIVATED_DEMO_CODES = [
  'APP-DEMO-11',
  'APP-850A76B2',
  'APP-607A8643',
  'APP-430E091F',
  'APP-2131C465'
];

function ensureAppActivationCode(db, activation, createdAt) {
  const current = db.prepare('SELECT id FROM activation_codes WHERE codigo = ?').get(activation.codigo);
  if (current) {
    db.prepare(`
      UPDATE activation_codes
      SET
        cliente_id = 'cliente_idvida',
        unidade_id = 'unidade_banco_sangue',
        dispositivo_id = NULL,
        tipo_ativacao = 'app_alerta',
        ativo = 1,
        usuario_nome = ?,
        area_nome = ?,
        usuario_perfil = ?
      WHERE codigo = ?
    `).run(activation.usuario_nome, activation.area_nome, activation.usuario_perfil, activation.codigo);
    return;
  }

  db.prepare(`
    INSERT INTO activation_codes (
      id, codigo, cliente_id, unidade_id, dispositivo_id, tipo_ativacao, ativo,
      criado_em, usuario_nome, usuario_email, area_nome, usuario_perfil
    ) VALUES (?, ?, 'cliente_idvida', 'unidade_banco_sangue', NULL, 'app_alerta', 1, ?, ?, NULL, ?, ?)
  `).run(
    activation.id,
    activation.codigo,
    createdAt,
    activation.usuario_nome,
    activation.area_nome,
    activation.usuario_perfil
  );
}

function seedDatabase() {
  const db = getDb();
  const createdAt = nowIso();

  db.exec('BEGIN');
  try {
    db.exec(`
      DELETE FROM notification_logs;
      DELETE FROM alert_acknowledgements;
      DELETE FROM alerts;
      DELETE FROM telemetry_events;
      DELETE FROM app_devices;
      DELETE FROM activation_codes;
      DELETE FROM dispositivos;
      DELETE FROM unidades;
      DELETE FROM clientes;
      DELETE FROM simulation_state;
    `);

    db.prepare('INSERT INTO clientes (id, nome, criado_em) VALUES (?, ?, ?)')
      .run('cliente_idvida', 'Laboratorio IDvida', createdAt);

    const insertUnit = db.prepare('INSERT INTO unidades (id, cliente_id, nome, local, criado_em) VALUES (?, ?, ?, ?, ?)');
    insertUnit.run('unidade_banco_sangue', 'cliente_idvida', 'Banco IDvida', 'Unidade Bela Vista', createdAt);
    insertUnit.run('unidade_laboratorio', 'cliente_idvida', 'Laboratorio', 'Unidade Bela Vista', createdAt);

    const insertDevice = db.prepare(`
      INSERT INTO dispositivos (
        id, cliente_id, unidade_id, nome, tipo, local, temperatura_atual,
        faixa_minima, faixa_maxima, status, ultima_comunicacao, bateria,
        umidade, qr_code, chart_json, criado_em, atualizado_em
      ) VALUES (
        @id, @cliente_id, @unidade_id, @nome, @tipo, @local, @temperatura_atual,
        @faixa_minima, @faixa_maxima, @status, @ultima_comunicacao, @bateria,
        @umidade, @qr_code, @chart_json, @criado_em, @atualizado_em
      )
    `);

    const devices = Array.from({ length: 24 }, (_, index) => geladeira(index + 1));

    devices.forEach((device) => {
      insertDevice.run({
        ...device,
        cliente_id: 'cliente_idvida',
        unidade_id: 'unidade_banco_sangue',
        faixa_minima: 2,
        faixa_maxima: 8,
        ultima_comunicacao: 'agora',
        criado_em: createdAt,
        atualizado_em: createdAt
      });
    });

    DEMO_APP_ACTIVATION_CODES.forEach((activation) => ensureAppActivationCode(db, activation, createdAt));
    DEACTIVATED_DEMO_CODES.forEach((code) => {
      db.prepare('UPDATE activation_codes SET ativo = 0 WHERE codigo = ?').run(code);
    });

    db.prepare(`
      INSERT INTO simulation_state (
        id, enabled, step, interval_ms, started_at, last_tick_at, updated_em
      ) VALUES ('main', 0, 0, 10000, NULL, NULL, ?)
    `).run(createdAt);

    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  return {
    cliente_id: 'cliente_idvida',
    unidade_id: 'unidade_banco_sangue',
    activation_code: null,
    devices_count: 24
  };
}

function seedDatabaseIfEmpty() {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) AS count FROM dispositivos').get();

  if (row.count > 0) {
    ensureDemoReferenceData(db);
    return {
      seeded: false,
      devices_count: row.count
    };
  }

  return {
    seeded: true,
    ...seedDatabase()
  };
}

function ensureDemoReferenceData(db = getDb()) {
  const createdAt = nowIso();
  const client = db.prepare('SELECT id FROM clientes WHERE id = ?').get('cliente_idvida');
  if (!client) return;

  const legacyAreaName = 'Banco ' + 'de Sangue';
  const currentAreaName = 'Banco IDvida';

  db.prepare('UPDATE unidades SET nome = ? WHERE id = ? OR nome = ?')
    .run(currentAreaName, 'unidade_banco_sangue', legacyAreaName);
  db.prepare('UPDATE dispositivos SET local = ? WHERE unidade_id = ? OR local = ?')
    .run(currentAreaName, 'unidade_banco_sangue', legacyAreaName);
  db.prepare('UPDATE activation_codes SET area_nome = ? WHERE area_nome = ?')
    .run(currentAreaName, legacyAreaName);
  db.prepare('UPDATE app_devices SET area_nome = ? WHERE area_nome = ?')
    .run(currentAreaName, legacyAreaName);

  const lab = db.prepare('SELECT id FROM unidades WHERE id = ?').get('unidade_laboratorio');
  if (!lab) {
    db.prepare('INSERT INTO unidades (id, cliente_id, nome, local, criado_em) VALUES (?, ?, ?, ?, ?)')
      .run('unidade_laboratorio', 'cliente_idvida', 'Laboratorio', 'Unidade Bela Vista', createdAt);
  }

  DEMO_APP_ACTIVATION_CODES.forEach((activation) => ensureAppActivationCode(db, activation, createdAt));
  DEACTIVATED_DEMO_CODES.forEach((code) => {
    db.prepare('UPDATE activation_codes SET ativo = 0 WHERE codigo = ?').run(code);
  });
}

module.exports = {
  seedDatabase,
  seedDatabaseIfEmpty,
  ensureDemoReferenceData
};
