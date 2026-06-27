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

const defaultMqttHost = 'c0d66ad786a241bf91a20a7509b2ac7c.s1.eu.hivemq.cloud';
const defaultMqttUsername = 'mkgw4';
const defaultMqttClientId = 'idsensor-backend-einstein-01';
const defaultMqttTopic = 'idsensor/einstein/mkgw4-01/uplink';
const mqttPassword = process.env.MQTT_PASSWORD || '';
const mqttBridgeEnabledDefault = mqttPassword ? 'true' : 'false';

module.exports = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || '',
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
  mqttBridge: {
    enabled: String(process.env.MQTT_BRIDGE_ENABLED || mqttBridgeEnabledDefault) === 'true',
    host: process.env.MQTT_HOST || defaultMqttHost,
    port: Number(process.env.MQTT_PORT || 8883),
    username: process.env.MQTT_USERNAME || defaultMqttUsername,
    password: mqttPassword,
    clientId: process.env.MQTT_CLIENT_ID || defaultMqttClientId,
    topic: process.env.MQTT_TOPIC || defaultMqttTopic,
    rejectUnauthorized: String(process.env.MQTT_REJECT_UNAUTHORIZED || 'true') !== 'false'
  },
  version: '0.1.0'
};
