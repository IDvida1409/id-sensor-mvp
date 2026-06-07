const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { databasePath } = require('../config');

let db;

function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    db = new DatabaseSync(databasePath);
    db.exec('PRAGMA foreign_keys = ON');
  }

  return db;
}

function initDb() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      criado_em TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS unidades (
      id TEXT PRIMARY KEY,
      cliente_id TEXT NOT NULL,
      nome TEXT NOT NULL,
      local TEXT NOT NULL,
      criado_em TEXT NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    );

    CREATE TABLE IF NOT EXISTS dispositivos (
      id TEXT PRIMARY KEY,
      cliente_id TEXT NOT NULL,
      unidade_id TEXT NOT NULL,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL,
      local TEXT NOT NULL,
      temperatura_atual REAL,
      faixa_minima REAL NOT NULL,
      faixa_maxima REAL NOT NULL,
      status TEXT NOT NULL,
      ultima_comunicacao TEXT NOT NULL,
      bateria INTEGER,
      umidade INTEGER,
      qr_code TEXT NOT NULL UNIQUE,
      chart_json TEXT,
      criado_em TEXT NOT NULL,
      atualizado_em TEXT NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (unidade_id) REFERENCES unidades(id)
    );

    CREATE TABLE IF NOT EXISTS activation_codes (
      id TEXT PRIMARY KEY,
      codigo TEXT NOT NULL UNIQUE,
      cliente_id TEXT NOT NULL,
      unidade_id TEXT NOT NULL,
      dispositivo_id TEXT,
      tipo_ativacao TEXT NOT NULL,
      ativo INTEGER NOT NULL DEFAULT 1,
      criado_em TEXT NOT NULL,
      expira_em TEXT,
      usado_em TEXT,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (unidade_id) REFERENCES unidades(id),
      FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id)
    );

    CREATE TABLE IF NOT EXISTS app_devices (
      id TEXT PRIMARY KEY,
      activation_code_id TEXT NOT NULL,
      cliente_id TEXT NOT NULL,
      unidade_id TEXT NOT NULL,
      dispositivo_id TEXT,
      expo_push_token TEXT,
      plataforma TEXT,
      modelo_aparelho TEXT,
      ativo INTEGER NOT NULL DEFAULT 1,
      criado_em TEXT NOT NULL,
      FOREIGN KEY (activation_code_id) REFERENCES activation_codes(id),
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (unidade_id) REFERENCES unidades(id),
      FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id)
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      cliente_id TEXT NOT NULL,
      unidade_id TEXT NOT NULL,
      dispositivo_id TEXT NOT NULL,
      tipo_alerta TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      temperatura_atual REAL,
      faixa_minima REAL,
      faixa_maxima REAL,
      severidade TEXT NOT NULL,
      status TEXT NOT NULL,
      criado_em TEXT NOT NULL,
      reconhecido_em TEXT,
      encerrado_em TEXT,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (unidade_id) REFERENCES unidades(id),
      FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id)
    );

    CREATE TABLE IF NOT EXISTS alert_acknowledgements (
      id TEXT PRIMARY KEY,
      alert_id TEXT NOT NULL,
      app_device_id TEXT NOT NULL,
      status TEXT NOT NULL,
      criado_em TEXT NOT NULL,
      FOREIGN KEY (alert_id) REFERENCES alerts(id),
      FOREIGN KEY (app_device_id) REFERENCES app_devices(id)
    );

    CREATE TABLE IF NOT EXISTS notification_logs (
      id TEXT PRIMARY KEY,
      alert_id TEXT NOT NULL,
      app_device_id TEXT,
      expo_push_token TEXT,
      status_envio TEXT NOT NULL,
      resposta TEXT,
      criado_em TEXT NOT NULL,
      FOREIGN KEY (alert_id) REFERENCES alerts(id),
      FOREIGN KEY (app_device_id) REFERENCES app_devices(id)
    );

    CREATE TABLE IF NOT EXISTS simulation_state (
      id TEXT PRIMARY KEY,
      enabled INTEGER NOT NULL DEFAULT 0,
      step INTEGER NOT NULL DEFAULT 0,
      interval_ms INTEGER NOT NULL DEFAULT 15000,
      started_at TEXT,
      last_tick_at TEXT,
      updated_em TEXT NOT NULL
    );
  `);

  ensureColumn(database, 'activation_codes', 'usuario_nome', 'TEXT');
  ensureColumn(database, 'activation_codes', 'usuario_email', 'TEXT');
  ensureColumn(database, 'activation_codes', 'area_nome', 'TEXT');
  ensureColumn(database, 'activation_codes', 'usuario_perfil', 'TEXT');
  ensureColumn(database, 'activation_codes', 'email_status', 'TEXT');
  ensureColumn(database, 'activation_codes', 'email_erro', 'TEXT');
  ensureColumn(database, 'activation_codes', 'expira_em', 'TEXT');
  ensureColumn(database, 'app_devices', 'usuario_nome', 'TEXT');
  ensureColumn(database, 'app_devices', 'usuario_email', 'TEXT');
  ensureColumn(database, 'app_devices', 'area_nome', 'TEXT');
  ensureColumn(database, 'app_devices', 'usuario_perfil', 'TEXT');
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_alert_ack_app_device
    ON alert_acknowledgements (app_device_id, alert_id);
  `);
}

function ensureColumn(database, table, column, definition) {
  const columns = database.prepare(`PRAGMA table_info(${table})`).all();
  if (columns.some((item) => item.name === column)) return;
  database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

module.exports = {
  getDb,
  initDb
};
