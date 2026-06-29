const fs = require('node:fs');
const path = require('node:path');
const { databasePath, databaseUrl } = require('../config');
const { PostgresSyncDatabase } = require('./postgresSyncDatabase');

let db;

function getDb() {
  if (!db) {
    if (databaseUrl) {
      db = new PostgresSyncDatabase(databaseUrl);
    } else {
      const { DatabaseSync } = require('node:sqlite');
      fs.mkdirSync(path.dirname(databasePath), { recursive: true });
      db = new DatabaseSync(databasePath);
      db.dialect = 'sqlite';
      db.exec('PRAGMA foreign_keys = ON');
    }
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

    CREATE TABLE IF NOT EXISTS telemetry_events (
      id TEXT PRIMARY KEY,
      dispositivo_id TEXT NOT NULL,
      tipo_evento TEXT NOT NULL,
      tom TEXT NOT NULL,
      titulo TEXT NOT NULL,
      detalhe TEXT,
      temperatura REAL,
      ocorrido_em TEXT NOT NULL,
      FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id)
    );

    CREATE TABLE IF NOT EXISTS panel_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      role TEXT NOT NULL,
      display_name TEXT NOT NULL,
      organization TEXT NOT NULL,
      cliente_id TEXT,
      cliente_nome TEXT,
      logo TEXT,
      avatar TEXT,
      ativo INTEGER NOT NULL DEFAULT 1,
      criado_em TEXT NOT NULL,
      atualizado_em TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS collector_readings (
      id TEXT PRIMARY KEY,
      ble_sensor_id TEXT,
      lorawan_device_id TEXT,
      lorawan_gateway_id TEXT,
      distance_mm REAL,
      fill_percentage REAL,
      status TEXT NOT NULL,
      battery REAL,
      battery_voltage_mv REAL,
      rssi_ble REAL,
      consecutive_critical_readings INTEGER NOT NULL DEFAULT 0,
      consecutive_lid_open_readings INTEGER NOT NULL DEFAULT 0,
      consecutive_lid_closed_readings INTEGER NOT NULL DEFAULT 0,
      confirmed_lid_state TEXT NOT NULL DEFAULT 'closed',
      confirmed_level_status TEXT,
      candidate_level_status TEXT,
      candidate_level_readings INTEGER NOT NULL DEFAULT 0,
      candidate_fill_percentage REAL,
      f_port INTEGER,
      raw_payload TEXT,
      received_at TEXT,
      created_at TEXT NOT NULL,
      original_payload_json TEXT
    );

    CREATE TABLE IF NOT EXISTS collector_calibrations (
      ble_sensor_id TEXT PRIMARY KEY,
      empty_distance_mm REAL NOT NULL,
      full_distance_mm REAL NOT NULL,
      red_percent REAL NOT NULL DEFAULT 50,
      open_margin_percent REAL NOT NULL DEFAULT 30,
      open_margin_min_mm REAL NOT NULL DEFAULT 250,
      confirmation_readings INTEGER NOT NULL DEFAULT 4,
      samples_json TEXT,
      updated_at TEXT NOT NULL
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
  ensureColumn(database, 'activation_codes', 'area_ids', 'TEXT');
  ensureColumn(database, 'activation_codes', 'usuario_perfil', 'TEXT');
  ensureColumn(database, 'activation_codes', 'email_status', 'TEXT');
  ensureColumn(database, 'activation_codes', 'email_erro', 'TEXT');
  ensureColumn(database, 'activation_codes', 'expira_em', 'TEXT');
  ensureColumn(database, 'app_devices', 'usuario_nome', 'TEXT');
  ensureColumn(database, 'app_devices', 'usuario_email', 'TEXT');
  ensureColumn(database, 'app_devices', 'area_nome', 'TEXT');
  ensureColumn(database, 'app_devices', 'area_ids', 'TEXT');
  ensureColumn(database, 'app_devices', 'usuario_perfil', 'TEXT');
  ensureColumn(database, 'collector_readings', 'consecutive_lid_open_readings', 'INTEGER NOT NULL DEFAULT 0');
  ensureColumn(database, 'collector_readings', 'consecutive_lid_closed_readings', 'INTEGER NOT NULL DEFAULT 0');
  ensureColumn(database, 'collector_readings', 'confirmed_lid_state', "TEXT NOT NULL DEFAULT 'closed'");
  ensureColumn(database, 'collector_readings', 'confirmed_level_status', 'TEXT');
  ensureColumn(database, 'collector_readings', 'candidate_level_status', 'TEXT');
  ensureColumn(database, 'collector_readings', 'candidate_level_readings', 'INTEGER NOT NULL DEFAULT 0');
  ensureColumn(database, 'collector_readings', 'candidate_fill_percentage', 'REAL');
  ensureColumn(database, 'collector_readings', 'battery_voltage_mv', 'REAL');
  ensureColumn(database, 'collector_calibrations', 'lid_detection_enabled', 'INTEGER NOT NULL DEFAULT 0');
  ensureColumn(database, 'panel_users', 'cliente_nome', 'TEXT');
  ensureColumn(database, 'panel_users', 'logo', 'TEXT');
  ensureColumn(database, 'panel_users', 'avatar', 'TEXT');
  ensureColumn(database, 'panel_users', 'ativo', 'INTEGER NOT NULL DEFAULT 1');
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_alert_ack_app_device
    ON alert_acknowledgements (app_device_id, alert_id);

    CREATE INDEX IF NOT EXISTS idx_telemetry_events_device_time
    ON telemetry_events (dispositivo_id, ocorrido_em DESC);

    CREATE INDEX IF NOT EXISTS idx_collector_readings_sensor_time
    ON collector_readings (ble_sensor_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_panel_users_cliente
    ON panel_users (cliente_id, ativo);
  `);
}

function ensureColumn(database, table, column, definition) {
  const columns = database.dialect === 'postgres'
    ? database.columns(table)
    : database.prepare(`PRAGMA table_info(${table})`).all();
  if (columns.some((item) => item.name === column)) return;
  database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

module.exports = {
  getDb,
  initDb
};
