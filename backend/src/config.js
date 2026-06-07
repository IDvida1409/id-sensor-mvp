const path = require('node:path');
const fs = require('node:fs');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.resolve(rootDir, '.env');

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index === -1) return;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
}

const defaultDatabasePath = process.env.LOCALAPPDATA
  ? path.join(process.env.LOCALAPPDATA, 'IDSensorMVP', 'id_sensor_mvp.db')
  : path.resolve(rootDir, './runtime/id_sensor_mvp.db');

module.exports = {
  port: Number(process.env.PORT || 4000),
  databasePath: process.env.DATABASE_PATH
    ? path.resolve(rootDir, process.env.DATABASE_PATH)
    : defaultDatabasePath,
  publicApiUrl: process.env.PUBLIC_API_URL || 'http://localhost:4000',
  expoPushEnabled: String(process.env.EXPO_PUSH_ENABLED || 'true') === 'true',
  emailEnabled: String(process.env.EMAIL_ENABLED || 'true') === 'true',
  emailFrom: process.env.EMAIL_FROM || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  appDeviceTokenSecret: process.env.APP_DEVICE_TOKEN_SECRET || 'idsensor-mvp-local-device-token-secret',
  autoSeedDemoData: String(process.env.AUTO_SEED_DEMO_DATA || 'true') === 'true',
  version: '0.1.0'
};
