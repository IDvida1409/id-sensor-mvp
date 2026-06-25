const {
  buildActivationDeepLink,
  buildActivationPayload,
  buildDevicePayload,
  buildQrDataUrl,
  buildQrImageUrl,
  extractScannedCode
} = require('./utils/qr');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { getDb } = require('./db/database');
const { seedDatabase } = require('./db/seed');
const { id, activationCode } = require('./utils/ids');
const { buildDeviceCard } = require('./services/deviceCard');
const { sendActivationEmail } = require('./services/emailService');
const { sendExpoPush } = require('./services/pushService');
const { alertMessageForAlert } = require('./services/alertText');
const {
  OFFLINE_AFTER_MS,
  calculateFillPercentage,
  normalizeTtnCollectorPayloads
} = require('./integrations/ttn');
const {
  advanceSimulationIfNeeded,
  getNocOccurrences,
  getSimulationState,
  runSimulationTick,
  serializeSimulationState,
  startSimulation,
  stopSimulation
} = require('./services/simulationService');
const { appDeviceTokenSecret, publicApiUrl, version } = require('./config');

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

const CART_EMPTY_DISTANCE_MM = Number(process.env.CART_EMPTY_DISTANCE_MM || 720);
const CART_FULL_DISTANCE_MM = Number(process.env.CART_FULL_DISTANCE_MM || 140);
const CART_LID_OPEN_MARGIN_MM = Number(process.env.CART_LID_OPEN_MARGIN_MM || 250);
const CART_LID_OPEN_MARGIN_PERCENT = Number(process.env.CART_LID_OPEN_MARGIN_PERCENT || 30);
const CART_LID_CLOSE_MARGIN_MM = Number(process.env.CART_LID_CLOSE_MARGIN_MM || 120);
const CART_EMPTY_DEADBAND_MM = Number(process.env.CART_EMPTY_DEADBAND_MM || 40);
const CART_EMPTY_DEADBAND_PERCENT = Number(process.env.CART_EMPTY_DEADBAND_PERCENT || 8);
const CART_STABLE_EMPTY_PERCENT = Number(process.env.CART_STABLE_EMPTY_PERCENT || 10);
const CART_VALID_DISTANCE_MIN_MM = Number(process.env.CART_VALID_DISTANCE_MIN_MM || 80);
const CART_FILL_CHANGE_DEADBAND_PERCENT = Number(process.env.CART_FILL_CHANGE_DEADBAND_PERCENT || 5);
const CART_SUSPICIOUS_JUMP_PERCENT = Number(process.env.CART_SUSPICIOUS_JUMP_PERCENT || 75);
const CART_CRITICAL_PERCENT = Number(process.env.CART_CRITICAL_PERCENT || 90);
const CART_LEVEL_CONFIRM_READINGS = Number(process.env.CART_LEVEL_CONFIRM_READINGS || 4);
const CART_CRITICAL_CONFIRM_READINGS = Number(process.env.CART_CRITICAL_CONFIRM_READINGS || CART_LEVEL_CONFIRM_READINGS);
const CART_LID_OPEN_CONFIRM_READINGS = Number(process.env.CART_LID_OPEN_CONFIRM_READINGS || 4);
const CART_LID_CLOSE_CONFIRM_READINGS = Number(process.env.CART_LID_CLOSE_CONFIRM_READINGS || CART_LID_OPEN_CONFIRM_READINGS);
const COLLECTOR_LID_OPEN_STATUS = 'lid_open';
const COLLECTOR_LID_OPEN_STATE = 'open';
const COLLECTOR_LID_CLOSED_STATE = 'closed';
const COLLECTOR_EMPTY_LEVEL_STATUS = 'empty';
const COLLECTOR_NORMAL_LEVEL_STATUS = 'normal';
const COLLECTOR_ATTENTION_LEVEL_STATUS = 'attention';
const COLLECTOR_CRITICAL_LEVEL_STATUS = 'critical';
const DEFAULT_COLLECTOR_CALIBRATION = {
  emptyDistanceMm: CART_EMPTY_DISTANCE_MM,
  fullDistanceMm: CART_FULL_DISTANCE_MM,
  redPercent: 50,
  openMarginPercent: CART_LID_OPEN_MARGIN_PERCENT,
  openMarginMinMm: CART_LID_OPEN_MARGIN_MM,
  confirmationReadings: CART_LEVEL_CONFIRM_READINGS,
  samples: []
};
const KNOWN_COLLECTOR_CALIBRATIONS = {
  de08dbf47311: {
    emptyDistanceMm: 719,
    fullDistanceMm: 140,
    redPercent: 40,
    openMarginPercent: CART_LID_OPEN_MARGIN_PERCENT,
    openMarginMinMm: CART_LID_OPEN_MARGIN_MM,
    confirmationReadings: CART_LEVEL_CONFIRM_READINGS,
    samples: [719, 719, 719],
    updatedAt: 'known-c01-default'
  },
  c4894994a485: {
    emptyDistanceMm: 708,
    fullDistanceMm: 20,
    redPercent: 50,
    openMarginPercent: CART_LID_OPEN_MARGIN_PERCENT,
    openMarginMinMm: CART_LID_OPEN_MARGIN_MM,
    confirmationReadings: CART_LEVEL_CONFIRM_READINGS,
    samples: [708, 708, 708],
    updatedAt: 'known-c02-default'
  }
};
// C01/C02 are vertical ToF sensors. A stable distance far beyond calibration means the lid is open.

const ACTIVATION_CODE_TTL_MS = 24 * 60 * 60 * 1000;
const PANEL_AUTH_USERS = {
  'idvida.master': {
    password: process.env.PANEL_MASTER_PASSWORD || 'idvida816',
    role: 'master',
    username: 'idvida.master',
    displayName: 'IDvida Master',
    organization: 'ID sensor',
    logo: './assets/idsensor-symbol.png',
    avatar: './assets/idsensor-symbol.png',
    permissions: { fullAccess: true }
  },
  'idvida.einstein': {
    password: process.env.PANEL_EINSTEIN_PASSWORD || 'einstein123456',
    role: 'cart',
    username: 'idvida.einstein',
    displayName: 'Hospital Einstein',
    organization: 'Hospital Einstein',
    logo: './assets/einstein-logo.png',
    avatar: './assets/einstein-symbol.png',
    permissions: { cartOnly: true }
  }
};

function sanitizePanelUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function activationExpiresAt(createdAt = Date.now()) {
  return new Date(new Date(createdAt).getTime() + ACTIVATION_CODE_TTL_MS).toISOString();
}

function isExpiredIso(value) {
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) && timestamp <= Date.now();
}

function encodeTokenPayload(payload) {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

function signTokenPayload(encodedPayload) {
  return crypto.createHmac('sha256', appDeviceTokenSecret)
    .update(encodedPayload)
    .digest('base64url');
}

function createAppDeviceToken(appDevice, activation) {
  const payload = {
    v: 1,
    app_device_id: appDevice.id,
    activation_code_id: appDevice.activation_code_id,
    activation_codigo: activation.codigo,
    cliente_id: appDevice.cliente_id,
    unidade_id: appDevice.unidade_id,
    dispositivo_id: appDevice.dispositivo_id || null,
    usuario_nome: appDevice.usuario_nome || null,
    usuario_email: appDevice.usuario_email || null,
    area_nome: appDevice.area_nome || null,
    area_ids: serializeAreaIds(appDevice.area_ids),
    usuario_perfil: normalizeUserProfile(appDevice.usuario_perfil),
    criado_em: appDevice.criado_em,
    expira_em: activation.expira_em || null
  };
  const encodedPayload = encodeTokenPayload(payload);
  return `${encodedPayload}.${signTokenPayload(encodedPayload)}`;
}

function verifyAppDeviceToken(token) {
  const raw = String(token || '').trim();
  const [encodedPayload, signature] = raw.split('.');
  if (!encodedPayload || !signature) return null;

  const expected = signTokenPayload(encodedPayload);
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== receivedBuffer.length) return null;
  if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    return payload?.v === 1 && payload?.app_device_id ? payload : null;
  } catch {
    return null;
  }
}

function appDeviceTokenFromRequest(req, body = {}) {
  const authorization = req?.headers?.authorization || '';
  if (authorization.toLowerCase().startsWith('bearer ')) return authorization.slice(7).trim();
  return body.app_device_token || '';
}

function ensureRecoveredAppDevice(db, payload) {
  if (!payload?.app_device_id || !payload?.cliente_id || !payload?.unidade_id) return null;

  const existing = db.prepare('SELECT * FROM app_devices WHERE id = ?').get(payload.app_device_id);
  if (existing) return existing.ativo ? existing : null;

  const client = db.prepare('SELECT id FROM clientes WHERE id = ?').get(payload.cliente_id);
  const unit = db.prepare('SELECT id FROM unidades WHERE id = ?').get(payload.unidade_id);
  if (!client || !unit) return null;

  const createdAt = payload.criado_em || nowIso();
  const activationCode = payload.activation_codigo || `RECOVERED-${String(payload.app_device_id).slice(-8).toUpperCase()}`;
  let activationId = payload.activation_code_id || id('act_recovered');
  const activationById = db.prepare('SELECT id FROM activation_codes WHERE id = ?').get(activationId);
  const activationByCode = db.prepare('SELECT id FROM activation_codes WHERE codigo = ?').get(activationCode);

  if (activationById) {
    activationId = activationById.id;
  } else if (activationByCode) {
    activationId = activationByCode.id;
  } else {
    db.prepare(`
      INSERT INTO activation_codes (
        id, codigo, cliente_id, unidade_id, dispositivo_id, tipo_ativacao, ativo,
        criado_em, expira_em, usado_em, usuario_nome, usuario_email, area_nome, area_ids, usuario_perfil
      ) VALUES (?, ?, ?, ?, ?, 'app_alerta', 0, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      activationId,
      activationCode,
      payload.cliente_id,
      payload.unidade_id,
      payload.dispositivo_id || null,
      createdAt,
      payload.expira_em || createdAt,
      createdAt,
      payload.usuario_nome || null,
      payload.usuario_email || null,
      payload.area_nome || null,
      serializeAreaIds(payload.area_ids),
      normalizeUserProfile(payload.usuario_perfil)
    );
  }

  db.prepare(`
    INSERT INTO app_devices (
      id, activation_code_id, cliente_id, unidade_id, dispositivo_id,
      expo_push_token, plataforma, modelo_aparelho, usuario_nome,
      usuario_email, area_nome, area_ids, usuario_perfil, ativo, criado_em
    ) VALUES (?, ?, ?, ?, ?, NULL, 'restored', 'Sessão restaurada', ?, ?, ?, ?, ?, 1, ?)
  `).run(
    payload.app_device_id,
    activationId,
    payload.cliente_id,
    payload.unidade_id,
    payload.dispositivo_id || null,
    payload.usuario_nome || null,
    payload.usuario_email || null,
    payload.area_nome || null,
    serializeAreaIds(payload.area_ids),
    normalizeUserProfile(payload.usuario_perfil),
    createdAt
  );

  return db.prepare('SELECT * FROM app_devices WHERE id = ? AND ativo = 1').get(payload.app_device_id);
}

function getAuthorizedAppDevice(db, appDeviceId, req, body = {}) {
  const current = db.prepare('SELECT * FROM app_devices WHERE id = ? AND ativo = 1').get(appDeviceId);
  if (current) return current;

  const payload = verifyAppDeviceToken(appDeviceTokenFromRequest(req, body));
  if (!payload || payload.app_device_id !== appDeviceId) return null;
  return ensureRecoveredAppDevice(db, payload);
}

const ADMIN_PROFILES = new Set(['master', 'admin1', 'admin2']);

function normalizeUserProfile(value) {
  const profile = String(value || 'area').trim().toLowerCase();
  if (profile === 'area' || ADMIN_PROFILES.has(profile)) return profile;
  return 'area';
}

function isAdminProfile(profile) {
  return ADMIN_PROFILES.has(normalizeUserProfile(profile));
}

function normalizeAreaIds(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || '').trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    const raw = value.trim();
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return normalizeAreaIds(parsed);
    } catch {
      return raw.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }

  return [];
}

function serializeAreaIds(value) {
  const ids = normalizeAreaIds(value);
  return ids.length ? JSON.stringify(Array.from(new Set(ids))) : null;
}

function finiteNumberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function normalizeCollectorCalibration(value = {}) {
  const source = value && typeof value === 'object' ? value : {};
  const empty = finiteNumberOrNull(source.emptyDistanceMm ?? source.empty_distance_mm);
  const full = finiteNumberOrNull(source.fullDistanceMm ?? source.full_distance_mm);
  const redPercent = finiteNumberOrNull(source.redPercent ?? source.red_percent);
  const openMarginPercent = finiteNumberOrNull(source.openMarginPercent ?? source.open_margin_percent);
  const openMarginMinMm = finiteNumberOrNull(source.openMarginMinMm ?? source.open_margin_min_mm);
  const confirmationReadings = finiteNumberOrNull(source.confirmationReadings ?? source.confirmation_readings);
  let samples = source.samples;

  if (!Array.isArray(samples) && typeof source.samples_json === 'string') {
    try {
      const parsed = JSON.parse(source.samples_json);
      if (Array.isArray(parsed)) samples = parsed;
    } catch {}
  }

  const normalizedEmpty = empty !== null && empty > 0
    ? Math.round(empty)
    : DEFAULT_COLLECTOR_CALIBRATION.emptyDistanceMm;
  let normalizedFull = full !== null && full >= 0
    ? Math.round(full)
    : DEFAULT_COLLECTOR_CALIBRATION.fullDistanceMm;

  if (normalizedFull >= normalizedEmpty) {
    normalizedFull = Math.max(0, normalizedEmpty - 50);
  }

  return {
    emptyDistanceMm: normalizedEmpty,
    fullDistanceMm: normalizedFull,
    redPercent: redPercent !== null
      ? clampNumber(Math.round(redPercent), 1, 100)
      : DEFAULT_COLLECTOR_CALIBRATION.redPercent,
    openMarginPercent: openMarginPercent !== null
      ? clampNumber(openMarginPercent, 1, 200)
      : DEFAULT_COLLECTOR_CALIBRATION.openMarginPercent,
    openMarginMinMm: openMarginMinMm !== null
      ? Math.max(1, Math.round(openMarginMinMm))
      : DEFAULT_COLLECTOR_CALIBRATION.openMarginMinMm,
    confirmationReadings: confirmationReadings !== null
      ? Math.max(1, Math.round(confirmationReadings))
      : DEFAULT_COLLECTOR_CALIBRATION.confirmationReadings,
    samples: Array.isArray(samples)
      ? samples.map(Number).filter(Number.isFinite).slice(-10)
      : [],
    updatedAt: source.updatedAt ?? source.updated_at ?? null
  };
}

function collectorCalibrationForSensor(db, bleSensorId) {
  const sensorId = compactBleSensorId(bleSensorId);
  if (!sensorId) return normalizeCollectorCalibration();

  const row = db.prepare(`
    SELECT *
    FROM collector_calibrations
    WHERE ble_sensor_id = ?
  `).get(sensorId);

  return normalizeCollectorCalibration(row || KNOWN_COLLECTOR_CALIBRATIONS[sensorId] || {});
}

function saveCollectorCalibration(db, bleSensorId, calibration) {
  const sensorId = compactBleSensorId(bleSensorId);
  if (!sensorId) {
    const error = new Error('MAC do sensor invalido.');
    error.statusCode = 400;
    throw error;
  }

  const normalized = normalizeCollectorCalibration(calibration);
  const updatedAt = nowIso();

  db.prepare(`
    INSERT INTO collector_calibrations (
      ble_sensor_id, empty_distance_mm, full_distance_mm, red_percent,
      open_margin_percent, open_margin_min_mm, confirmation_readings,
      samples_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(ble_sensor_id) DO UPDATE SET
      empty_distance_mm = excluded.empty_distance_mm,
      full_distance_mm = excluded.full_distance_mm,
      red_percent = excluded.red_percent,
      open_margin_percent = excluded.open_margin_percent,
      open_margin_min_mm = excluded.open_margin_min_mm,
      confirmation_readings = excluded.confirmation_readings,
      samples_json = excluded.samples_json,
      updated_at = excluded.updated_at
  `).run(
    sensorId,
    normalized.emptyDistanceMm,
    normalized.fullDistanceMm,
    normalized.redPercent,
    normalized.openMarginPercent,
    normalized.openMarginMinMm,
    normalized.confirmationReadings,
    safeJsonStringify(normalized.samples),
    updatedAt
  );

  return {
    ...normalized,
    updatedAt
  };
}

function serializeCollectorCalibration(calibration) {
  return normalizeCollectorCalibration(calibration);
}

function collectorOpenDistanceLimit(calibration) {
  const normalized = normalizeCollectorCalibration(calibration);
  const empty = finiteNumberOrNull(normalized.emptyDistanceMm);
  if (empty === null) return null;
  const dynamicMargin = Math.round(empty * (normalized.openMarginPercent / 100));
  return empty + Math.max(normalized.openMarginMinMm, dynamicMargin);
}

function collectorCloseDistanceLimit(calibration) {
  const normalized = normalizeCollectorCalibration(calibration);
  const empty = finiteNumberOrNull(normalized.emptyDistanceMm);
  if (empty === null) return null;
  return empty + Math.max(CART_EMPTY_DEADBAND_MM, CART_LID_CLOSE_MARGIN_MM);
}

function collectorValidDistanceMin(calibration) {
  const normalized = normalizeCollectorCalibration(calibration);
  const range = Math.max(0, normalized.emptyDistanceMm - normalized.fullDistanceMm);
  const tolerance = Math.max(CART_EMPTY_DEADBAND_MM, Math.round(range * 0.1));
  return Math.max(0, normalized.fullDistanceMm - tolerance);
}

function isCollectorCalibratedDistance(distanceMm, calibration) {
  const distance = finiteNumberOrNull(distanceMm);
  const closeLimit = collectorCloseDistanceLimit(calibration);
  if (distance === null || closeLimit === null) return false;
  return distance >= collectorValidDistanceMin(calibration) && distance <= closeLimit;
}

function isCollectorEmptyDistance(distanceMm, calibration) {
  const normalized = normalizeCollectorCalibration(calibration);
  const distance = finiteNumberOrNull(distanceMm);
  if (distance === null) return false;
  return isCollectorCalibratedDistance(distance, normalized)
    && distance >= normalized.emptyDistanceMm - CART_EMPTY_DEADBAND_MM;
}

function isCollectorLidOpenDistance(distanceMm, calibration) {
  const distance = finiteNumberOrNull(distanceMm);
  const openLimit = collectorOpenDistanceLimit(calibration);
  if (distance === null || openLimit === null) return false;
  return distance > openLimit;
}

function isCollectorLidClosedDistance(distanceMm, calibration) {
  return isCollectorCalibratedDistance(distanceMm, calibration);
}

function normalizeCollectorFillPercentage(fillPercentage) {
  const fill = finiteNumberOrNull(fillPercentage);
  if (fill === null || fill < 0) return null;

  const normalized = Math.min(100, Math.max(0, fill));
  return normalized <= CART_EMPTY_DEADBAND_PERCENT ? 0 : normalized;
}

function calculateCollectorFillPercentage(distanceMm, calibration) {
  const normalized = normalizeCollectorCalibration(calibration);
  const distance = finiteNumberOrNull(distanceMm);
  if (distance === null) return null;
  if (!isCollectorCalibratedDistance(distance, normalized)) return null;

  const fillPercentage = calculateFillPercentage(
    normalized.emptyDistanceMm,
    normalized.fullDistanceMm,
    distance
  );

  if (fillPercentage === null) return null;

  if (isCollectorEmptyDistance(distance, normalized)) return 0;

  return normalizeCollectorFillPercentage(fillPercentage);
}

function collectorLevelForFillPercentage(fillPercentage, calibration = null) {
  const fill = normalizeCollectorFillPercentage(fillPercentage);
  if (fill === null) return null;
  const normalizedCalibration = normalizeCollectorCalibration(calibration);
  const criticalPercent = clampNumber(
    normalizedCalibration.redPercent || CART_CRITICAL_PERCENT,
    1,
    100
  );
  const attentionPercent = Math.max(CART_STABLE_EMPTY_PERCENT + 1, criticalPercent - 10);
  if (fill <= CART_STABLE_EMPTY_PERCENT) return COLLECTOR_EMPTY_LEVEL_STATUS;
  if (fill >= criticalPercent) return COLLECTOR_CRITICAL_LEVEL_STATUS;
  if (fill >= attentionPercent) return COLLECTOR_ATTENTION_LEVEL_STATUS;
  return COLLECTOR_NORMAL_LEVEL_STATUS;
}

function collectorStatusForLevel(levelStatus) {
  if (levelStatus === COLLECTOR_CRITICAL_LEVEL_STATUS) return 'critical_confirmed';
  if (levelStatus === COLLECTOR_ATTENTION_LEVEL_STATUS) return 'attention';
  return 'normal';
}

function isCollectorReadingOffline(createdAt) {
  const timestamp = new Date(createdAt || '').getTime();
  return Number.isFinite(timestamp) && Date.now() - timestamp > OFFLINE_AFTER_MS;
}

function collectorLidStateForRow(row) {
  if (!row) return COLLECTOR_LID_CLOSED_STATE;
  const storedStatus = String(row.status || '').trim().toLowerCase();
  if (
    storedStatus === COLLECTOR_LID_OPEN_STATUS
    && Number(row.consecutive_lid_open_readings || 0) >= CART_LID_OPEN_CONFIRM_READINGS
  ) {
    return COLLECTOR_LID_OPEN_STATE;
  }

  const storedLidState = String(row.confirmed_lid_state || '').trim().toLowerCase();
  if ([COLLECTOR_LID_OPEN_STATE, COLLECTOR_LID_CLOSED_STATE].includes(storedLidState)) {
    return storedLidState;
  }

  return COLLECTOR_LID_CLOSED_STATE;
}

function collectorLevelForRow(row, fillPercentage, calibration = null) {
  const storedLevel = String(row?.confirmed_level_status || '').trim().toLowerCase();
  if ([
    COLLECTOR_EMPTY_LEVEL_STATUS,
    COLLECTOR_NORMAL_LEVEL_STATUS,
    COLLECTOR_ATTENTION_LEVEL_STATUS,
    COLLECTOR_CRITICAL_LEVEL_STATUS
  ].includes(storedLevel)) {
    return storedLevel;
  }

  const storedStatus = String(row?.status || '').trim().toLowerCase();
  if (storedStatus === 'critical_confirmed' || storedStatus === 'critical') return COLLECTOR_CRITICAL_LEVEL_STATUS;
  if (storedStatus === 'attention') return COLLECTOR_ATTENTION_LEVEL_STATUS;

  return collectorLevelForFillPercentage(fillPercentage, calibration) || COLLECTOR_EMPTY_LEVEL_STATUS;
}

function collectorStatusForRow(row, fillPercentage, calibration = null) {
  if (isCollectorReadingOffline(row.created_at)) return 'offline';
  if (collectorLidStateForRow(row) === COLLECTOR_LID_OPEN_STATE) return COLLECTOR_LID_OPEN_STATUS;
  return collectorStatusForLevel(collectorLevelForRow(row, fillPercentage, calibration));
}

function compactBleSensorId(value) {
  const text = String(value || '');
  let decoded = text;
  try {
    decoded = decodeURIComponent(text);
  } catch {}
  return decoded.replace(/[^0-9a-f]/gi, '').toLowerCase().slice(0, 12);
}

function formatBleSensorId(value) {
  const compact = compactBleSensorId(value);
  return compact.match(/.{1,2}/g)?.join(':').toUpperCase() || '';
}

function safeJsonStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

function collectorPayloadReceivedAt(reading) {
  const timestamp = new Date(reading?.receivedAt || '').getTime();
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function isSameCollectorPayload(previous, normalizedReading, receivedAt) {
  if (!previous) return false;

  return String(previous.received_at || '') === String(receivedAt || '')
    && String(previous.raw_payload || '') === String(normalizedReading?.rawPayload || '')
    && String(previous.lorawan_device_id || '') === String(normalizedReading?.lorawanDeviceId || '');
}

function previousCollectorReading(db, bleSensorId) {
  if (!bleSensorId) return null;
  return db.prepare(`
    SELECT *
    FROM collector_readings
    WHERE ble_sensor_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `).get(bleSensorId);
}

function serializeCollectorReading(row, calibration = null) {
  const rowCalibration = serializeCollectorCalibration(calibration || row.calibration || {});
  const consecutiveCriticalReadings = Number(row.consecutive_critical_readings || 0);
  const consecutiveLidOpenReadings = Number(row.consecutive_lid_open_readings || 0);
  const consecutiveLidClosedReadings = Number(row.consecutive_lid_closed_readings || 0);
  const candidateLevelReadings = Number(row.candidate_level_readings || 0);
  const fillPercentage = normalizeCollectorFillPercentage(row.fill_percentage);
  const confirmedLidState = collectorLidStateForRow(row);
  const levelStatus = collectorLevelForRow(row, fillPercentage, rowCalibration);

  return {
    id: row.id,
    bleSensorId: row.ble_sensor_id,
    mac: formatBleSensorId(row.ble_sensor_id),
    lorawanDeviceId: row.lorawan_device_id,
    lorawanGatewayId: row.lorawan_gateway_id,
    distanceMm: finiteNumberOrNull(row.distance_mm),
    fillPercentage,
    status: collectorStatusForRow(row, fillPercentage, rowCalibration),
    levelStatus,
    confirmedLidState,
    lidOpen: confirmedLidState === COLLECTOR_LID_OPEN_STATE,
    battery: finiteNumberOrNull(row.battery),
    rssiBle: finiteNumberOrNull(row.rssi_ble),
    consecutiveCriticalReadings,
    consecutiveLidOpenReadings,
    consecutiveLidClosedReadings,
    candidateLevelStatus: row.candidate_level_status || null,
    candidateLevelReadings,
    candidateFillPercentage: normalizeCollectorFillPercentage(row.candidate_fill_percentage),
    fPort: row.f_port === null || row.f_port === undefined ? null : Number(row.f_port),
    rawPayload: row.raw_payload,
    receivedAt: row.received_at,
    createdAt: row.created_at,
    calibration: rowCalibration
  };
}

function selectLatestCollectorRow(rows) {
  const candidates = Array.isArray(rows) ? rows.filter(Boolean) : [];
  return candidates[0] || null;
}

function saveCollectorReading(db, normalizedReading) {
  const bleSensorId = compactBleSensorId(normalizedReading?.bleSensorId);
  if (!bleSensorId) return null;

  const createdAt = nowIso();
  const receivedAt = collectorPayloadReceivedAt(normalizedReading) || createdAt;
  const distanceMm = finiteNumberOrNull(normalizedReading.distanceMm);
  const calibration = collectorCalibrationForSensor(db, bleSensorId);
  const requiredReadings = Math.max(1, Number(calibration.confirmationReadings || CART_LEVEL_CONFIRM_READINGS));
  const previous = previousCollectorReading(db, bleSensorId);
  const previousFillPercentage = normalizeCollectorFillPercentage(previous?.fill_percentage);
  const previousConfirmedFill = previousFillPercentage !== null ? previousFillPercentage : 0;
  const previousConfirmedLevel = collectorLevelForRow(previous, previousFillPercentage, calibration);
  const previousLidState = collectorLidStateForRow(previous);
  const previousLidOpenReadings = Number(previous?.consecutive_lid_open_readings || 0);
  const previousLidClosedReadings = Number(previous?.consecutive_lid_closed_readings || 0);
  const samePayloadAsPrevious = isSameCollectorPayload(previous, normalizedReading, receivedAt);
  const lidOpenCandidate = isCollectorLidOpenDistance(distanceMm, calibration);
  const lidClosedCandidate = isCollectorLidClosedDistance(distanceMm, calibration);
  let confirmedLidState = previousLidState;
  let consecutiveLidOpenReadings = previousLidOpenReadings;
  let consecutiveLidClosedReadings = previousLidClosedReadings;

  if (previousLidState === COLLECTOR_LID_OPEN_STATE) {
    consecutiveLidOpenReadings = Math.max(previousLidOpenReadings, requiredReadings);

    if (lidClosedCandidate) {
      consecutiveLidClosedReadings = samePayloadAsPrevious
        ? previousLidClosedReadings
        : previousLidClosedReadings + 1;

      if (consecutiveLidClosedReadings >= requiredReadings) {
        confirmedLidState = COLLECTOR_LID_CLOSED_STATE;
        consecutiveLidOpenReadings = 0;
      }
    } else {
      consecutiveLidClosedReadings = 0;
    }
  } else if (lidOpenCandidate) {
    consecutiveLidOpenReadings = samePayloadAsPrevious
      ? previousLidOpenReadings
      : previousLidOpenReadings + 1;
    consecutiveLidClosedReadings = 0;

    if (consecutiveLidOpenReadings >= requiredReadings) {
      confirmedLidState = COLLECTOR_LID_OPEN_STATE;
    }
  } else {
    consecutiveLidOpenReadings = 0;
    consecutiveLidClosedReadings = lidClosedCandidate
      ? (samePayloadAsPrevious ? previousLidClosedReadings : previousLidClosedReadings + 1)
      : 0;
    confirmedLidState = COLLECTOR_LID_CLOSED_STATE;
  }

  const rawFillPercentage = calculateCollectorFillPercentage(distanceMm, calibration);
  const rawLevelStatus = collectorLevelForFillPercentage(rawFillPercentage, calibration);
  const previousCandidateLevel = String(previous?.candidate_level_status || '').trim().toLowerCase();
  const previousCandidateReadings = Number(previous?.candidate_level_readings || 0);
  let candidateLevelStatus = null;
  let candidateLevelReadings = 0;
  let candidateFillPercentage = null;
  let fillPercentage = previousConfirmedFill;
  let confirmedLevelStatus = previousConfirmedLevel;

  if (rawFillPercentage !== null && rawLevelStatus) {
    const materialLevelChange = rawLevelStatus !== previousConfirmedLevel;
    const materialFillChange = Math.abs(rawFillPercentage - previousConfirmedFill) >= CART_FILL_CHANGE_DEADBAND_PERCENT;

    if (materialLevelChange || materialFillChange || previousFillPercentage === null) {
      candidateLevelStatus = rawLevelStatus;
      candidateFillPercentage = rawFillPercentage;
      candidateLevelReadings = samePayloadAsPrevious
        ? previousCandidateReadings
        : (previousCandidateLevel === rawLevelStatus ? previousCandidateReadings + 1 : 1);

      if (candidateLevelReadings >= requiredReadings) {
        fillPercentage = rawFillPercentage;
        confirmedLevelStatus = rawLevelStatus;
      }
    }
  }

  const confirmedCritical = confirmedLevelStatus === COLLECTOR_CRITICAL_LEVEL_STATUS;
  const criticalCandidate = candidateLevelStatus === COLLECTOR_CRITICAL_LEVEL_STATUS;
  const consecutiveCriticalReadings = criticalCandidate
    ? candidateLevelReadings
    : (confirmedCritical ? Math.max(requiredReadings, Number(previous?.consecutive_critical_readings || 0)) : 0);
  const status = confirmedLidState === COLLECTOR_LID_OPEN_STATE
    ? COLLECTOR_LID_OPEN_STATUS
    : collectorStatusForLevel(confirmedLevelStatus);
  const row = {
    id: id('collector_reading'),
    bleSensorId,
    lorawanDeviceId: normalizedReading.lorawanDeviceId || null,
    lorawanGatewayId: normalizedReading.lorawanGatewayId || null,
    distanceMm,
    fillPercentage,
    status,
    battery: finiteNumberOrNull(normalizedReading.battery),
    rssiBle: finiteNumberOrNull(normalizedReading.rssiBle),
    consecutiveCriticalReadings,
    consecutiveLidOpenReadings,
    consecutiveLidClosedReadings,
    confirmedLidState,
    confirmedLevelStatus,
    candidateLevelStatus,
    candidateLevelReadings,
    candidateFillPercentage,
    fPort: finiteNumberOrNull(normalizedReading.fPort),
    rawPayload: normalizedReading.rawPayload || null,
    receivedAt,
    createdAt,
    originalPayloadJson: safeJsonStringify(normalizedReading.originalPayload)
  };

  db.prepare(`
    INSERT INTO collector_readings (
      id, ble_sensor_id, lorawan_device_id, lorawan_gateway_id,
      distance_mm, fill_percentage, status, battery, rssi_ble,
      consecutive_critical_readings, consecutive_lid_open_readings, consecutive_lid_closed_readings,
      confirmed_lid_state, confirmed_level_status, candidate_level_status, candidate_level_readings,
      candidate_fill_percentage, f_port, raw_payload, received_at,
      created_at, original_payload_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.id,
    row.bleSensorId,
    row.lorawanDeviceId,
    row.lorawanGatewayId,
    row.distanceMm,
    row.fillPercentage,
    row.status,
    row.battery,
    row.rssiBle,
    row.consecutiveCriticalReadings,
    row.consecutiveLidOpenReadings,
    row.consecutiveLidClosedReadings,
    row.confirmedLidState,
    row.confirmedLevelStatus,
    row.candidateLevelStatus,
    row.candidateLevelReadings,
    row.candidateFillPercentage,
    row.fPort,
    row.rawPayload,
    row.receivedAt,
    row.createdAt,
    row.originalPayloadJson
  );

  return serializeCollectorReading({
    id: row.id,
    ble_sensor_id: row.bleSensorId,
    lorawan_device_id: row.lorawanDeviceId,
    lorawan_gateway_id: row.lorawanGatewayId,
    distance_mm: row.distanceMm,
    fill_percentage: row.fillPercentage,
    status: row.status,
    battery: row.battery,
    rssi_ble: row.rssiBle,
    consecutive_critical_readings: row.consecutiveCriticalReadings,
    consecutive_lid_open_readings: row.consecutiveLidOpenReadings,
    consecutive_lid_closed_readings: row.consecutiveLidClosedReadings,
    confirmed_lid_state: row.confirmedLidState,
    confirmed_level_status: row.confirmedLevelStatus,
    candidate_level_status: row.candidateLevelStatus,
    candidate_level_readings: row.candidateLevelReadings,
    candidate_fill_percentage: row.candidateFillPercentage,
    f_port: row.fPort,
    raw_payload: row.rawPayload,
    received_at: row.receivedAt,
    created_at: row.createdAt
  }, calibration);
}

function latestCollectorReadings(db, options = {}) {
  const limit = Math.max(1, Math.min(500, Number(options.limit || 200)));
  const macFilters = Array.isArray(options.macFilters) ? options.macFilters.filter(Boolean) : [];
  const rows = db.prepare(`
    SELECT *
    FROM collector_readings
    ORDER BY created_at DESC
    LIMIT ?
  `).all(limit);
  const bySensor = new Map();

  for (const row of rows) {
    const sensorId = compactBleSensorId(row.ble_sensor_id);
    if (!sensorId) continue;
    if (macFilters.length && !macFilters.includes(sensorId)) continue;
    if (!bySensor.has(sensorId)) bySensor.set(sensorId, []);
    bySensor.get(sensorId).push(row);
  }

  return Array.from(bySensor.values())
    .map(selectLatestCollectorRow)
    .filter(Boolean)
    .map((row) => serializeCollectorReading(row, collectorCalibrationForSensor(db, row.ble_sensor_id)));
}

function collectorReadingsHistory(db, options = {}) {
  const limit = Math.max(1, Math.min(500, Number(options.limit || 100)));
  const macFilters = Array.isArray(options.macFilters) ? options.macFilters.filter(Boolean) : [];
  const rows = db.prepare(`
    SELECT *
    FROM collector_readings
    ORDER BY created_at DESC
    LIMIT ?
  `).all(limit);

  return rows
    .filter((row) => {
      const sensorId = compactBleSensorId(row.ble_sensor_id);
      return sensorId && (!macFilters.length || macFilters.includes(sensorId));
    })
    .map((row) => serializeCollectorReading(row, collectorCalibrationForSensor(db, row.ble_sensor_id)));
}

function areaIdsAllowAll(value) {
  return normalizeAreaIds(value).some((idValue) => idValue === 'all' || idValue === '*');
}

function allowedAreaIdsForAppDevice(appDevice) {
  const profile = normalizeUserProfile(appDevice?.usuario_perfil);
  if (isAdminProfile(profile) || areaIdsAllowAll(appDevice?.area_ids)) return null;

  const ids = normalizeAreaIds(appDevice?.area_ids)
    .filter((idValue) => idValue !== 'all' && idValue !== '*');
  if (ids.length) return Array.from(new Set(ids));
  return appDevice?.unidade_id ? [appDevice.unidade_id] : [];
}

function appDeviceCanAccessUnit(appDevice, unitId) {
  const allowedIds = allowedAreaIdsForAppDevice(appDevice);
  return allowedIds === null || allowedIds.includes(unitId);
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
  const level = thermometerPercent(card);
  const batteryValue = Number(card.battery);
  const batteryWidth = Number.isFinite(batteryValue) ? Math.max(6, Math.min(100, batteryValue)) : 6;
  const commIconSrc = card.online === false ? '/assets/comm-offline.png' : '/assets/comm-online.png';

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
    main { min-height: 100vh; padding: 18px 16px 24px; }
    .shell { margin: 0 auto; max-width: 474px; }
    .topbar { align-items: center; display: flex; justify-content: flex-start; margin-bottom: 14px; }
    .brand-logo { display: block; height: auto; width: 132px; }
    .client { margin-bottom: 14px; padding-left: 2px; text-align: left; }
    .client h1 { color: #10284a; font-size: 22px; line-height: 1.12; margin: 0; }
    .client p { color: #5c6f8d; font-size: 14px; font-weight: 800; margin: 4px 0 0; }
    .device-card { border: 1px solid rgba(255,255,255,.12); border-radius: 20px; box-shadow: 0 6px 16px rgba(31,42,55,.08); color: white; min-height: 390px; overflow: hidden; padding: 18px; position: relative; width: 100%; }
    .device-card.blue { background: radial-gradient(circle at 22% 18%, rgba(255,255,255,.08) 0%, transparent 30%), linear-gradient(180deg,#244180,#1d3162); }
    .device-card.warn { color: #4f5869; background: radial-gradient(circle at 78% 35%, rgba(196,131,55,.16) 0%, transparent 30%), linear-gradient(180deg,#d59645,#bf7628); }
    .device-card.crit, .device-card.offline { background: radial-gradient(circle at 74% 62%, rgba(255,104,104,.26) 0%, transparent 30%), linear-gradient(135deg,#7a2449,#c43b46); }
    .card-head { align-items: flex-start; display: flex; gap: 8px; justify-content: space-between; margin-bottom: 8px; }
    .device { font-size: 20px; font-weight: 900; line-height: 1.2; }
    .comm-badge { align-items: center; background: #fff; border-radius: 50%; box-shadow: 0 0 0 2px rgba(255,255,255,.2); display: flex; height: 38px; justify-content: center; overflow: hidden; position: absolute; right: 14px; top: 14px; width: 38px; }
    .comm-badge img { display: block; height: 100%; object-fit: cover; width: 100%; }
    .temp { font-size: 76px; font-weight: 300; line-height: 1; margin: 40px 66px 22px 0; text-align: center; }
    .middle { align-items: center; display: grid; gap: 12px; grid-template-columns: 1fr 58px; margin-top: -4px; }
    .metrics { display: grid; gap: 10px; grid-template-columns: repeat(2, 1fr); margin-top: -14px; }
    .metric-box { background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.10); border-radius: 10px; min-height: 72px; padding: 11px 12px; }
    .metric-label { font-size: 11px; font-weight: 900; margin-bottom: 7px; opacity: .85; text-transform: uppercase; }
    .metric-value { font-size: 21px; font-weight: 900; }
    .thermo { background: linear-gradient(180deg,rgba(255,255,255,.92),rgba(248,250,252,.88)); border: 3px solid rgba(188,198,212,.92); border-radius: 22px; box-shadow: inset 0 1px 0 rgba(255,255,255,.45); height: 132px; margin: 0 auto; position: relative; width: 34px; }
    .thermo-track { background: #c6ced8; border-radius: 12px; bottom: 20px; box-shadow: inset 0 0 0 1px rgba(158,168,183,.55); left: 50%; overflow: hidden; position: absolute; top: 6px; transform: translateX(-50%); width: 8px; }
    .thermo-fill { background: var(--thermo-fill,#35a9ff); border-radius: 12px; bottom: 0; box-shadow: inset 0 1px 0 rgba(255,255,255,.16); height: var(--thermo-level,0%); left: 0; position: absolute; right: 0; }
    .thermo-bulb { background: var(--thermo-bulb,#35a9ff); border: 3px solid rgba(188,198,212,.92); border-radius: 50%; bottom: -8px; box-shadow: inset 0 1px 0 rgba(255,255,255,.14); height: 42px; left: 50%; position: absolute; transform: translateX(-50%); width: 42px; }
    .blue { --thermo-fill: #35a9ff; --thermo-bulb: #35a9ff; }
    .warn { --thermo-fill: #f07d3b; --thermo-bulb: #f07d3b; }
    .crit, .offline { --thermo-fill: #ff4d55; --thermo-bulb: #ff4d55; }
    .bottom-meta { align-items: center; bottom: 18px; display: flex; font-size: 22px; font-weight: 800; gap: 8px; justify-content: space-between; left: 18px; position: absolute; right: 18px; }
    .left-meta, .right-meta, .battery { align-items: center; display: flex; gap: 7px; min-width: 0; }
    .battery-icon { background: transparent; border: 2px solid rgba(255,255,255,.9); border-radius: 4px; box-shadow: none; height: 12px; position: relative; width: 20px; }
    .battery-icon::after { background: rgba(255,255,255,.9); border-radius: 2px; content: ""; height: 4px; position: absolute; right: -4px; top: 2px; width: 3px; }
    .battery-level { background: linear-gradient(180deg,#b5ff9d,#53d769); border-radius: 2px; bottom: 2px; left: 2px; position: absolute; top: 2px; }
    .drop { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 18'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='%23dff6ff'/><stop offset='0.45' stop-color='%2389d8ff'/><stop offset='1' stop-color='%232d9cff'/></linearGradient></defs><path d='M7 0C4 4.1 1 7.1 1 11.1A6 6 0 0 0 13 11.1C13 7.1 10 4.1 7 0Z' fill='url(%23g)'/></svg>"); background-position: center; background-repeat: no-repeat; background-size: contain; display: inline-block; flex: 0 0 14px; height: 18px; width: 14px; }
    .powered { align-items: center; color: #65758f; display: flex; gap: 10px; justify-content: center; margin-top: 20px; font-size: 12px; font-weight: 800; }
    .powered-logo { display: block; height: 31px; width: auto; }
    @media (max-width: 520px) {
      main { padding: 14px 12px 22px; }
      .shell { max-width: 100%; }
      .brand-logo { width: 112px; }
      .client h1 { font-size: 19px; }
      .client p { font-size: 13px; }
      .device-card { min-height: 356px; padding: 16px; }
      .device { font-size: 18px; }
      .temp { font-size: 66px; margin: 34px 58px 20px 0; }
      .metric-box { min-height: 64px; padding: 9px 10px; }
      .metric-value { font-size: 18px; }
      .bottom-meta { bottom: 16px; font-size: 20px; left: 16px; right: 16px; }
    }
  </style>
</head>
<body>
  <main>
    <section class="shell">
      <div class="topbar">
        <img class="brand-logo" src="/assets/idsensor-logo.png" alt="IDsensor">
      </div>
      <div class="client">
        <h1>${escapeHtml(card.clientName || 'Cliente')}</h1>
        <p>${escapeHtml(card.unitName || 'Unidade')} - ${escapeHtml(card.local || card.sector || 'Area monitorada')}</p>
      </div>
      <article id="deviceCard" class="device-card ${state}">
        <div class="card-head">
          <div class="device-line"><div id="deviceName" class="device">${escapeHtml(card.name || 'Equipamento')}</div></div>
        </div>
        <div class="temp" id="temp">${tempHtml(card.temp)}</div>
        <div class="middle">
          <div class="metrics">
            <div class="metric-box"><div class="metric-label">MIN</div><div class="metric-value" id="minTemp">${tempHtml(card.dailyMin)}</div></div>
            <div class="metric-box"><div class="metric-label">MAX</div><div class="metric-value" id="maxTemp">${tempHtml(card.dailyMax)}</div></div>
          </div>
          <div class="thermo" aria-hidden="true" style="--thermo-level: ${level}%">
            <div class="thermo-track"><div id="thermoFill" class="thermo-fill"></div></div>
            <div class="thermo-bulb"></div>
          </div>
        </div>
        <div class="bottom-meta">
          <div class="left-meta"><div class="battery"><div class="battery-icon"><div id="batteryLevel" class="battery-level" style="width:${batteryWidth}%"></div></div><span id="batteryText">${escapeHtml(card.battery ?? '--')}%</span></div></div>
          <div class="right-meta"><span class="drop"></span><span id="humidityText">${escapeHtml(card.hum1 ?? '--')}%</span></div>
        </div>
        <div id="commBadge" class="comm-badge" aria-hidden="true"><img id="commIcon" src="${commIconSrc}" alt=""></div>
      </article>
      <div class="powered">Powered by <img class="powered-logo" src="/assets/idvida-logo.png" alt="IDvida"></div>
    </section>
  </main>
  <script>
    const code = ${JSON.stringify(code)};
    const card = document.getElementById('deviceCard');
    const fields = {
      name: document.getElementById('deviceName'),
      temp: document.getElementById('temp'),
      min: document.getElementById('minTemp'),
      max: document.getElementById('maxTemp'),
      batteryText: document.getElementById('batteryText'),
      batteryLevel: document.getElementById('batteryLevel'),
      humidityText: document.getElementById('humidityText'),
      commIcon: document.getElementById('commIcon'),
      fill: document.getElementById('thermoFill')
    };

    function stateFor(item) {
      if (item.online === false) return 'offline';
      if (item.state === 'crit') return 'crit';
      if (item.state === 'warn') return 'warn';
      return 'blue';
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
      fields.name.textContent = item.name || 'Equipamento';
      fields.temp.textContent = temp(item.temp);
      fields.min.textContent = temp(item.dailyMin);
      fields.max.textContent = temp(item.dailyMax);
      fields.batteryText.textContent = (item.battery ?? '--') + '%';
      fields.batteryLevel.style.width = Math.max(6, Math.min(100, Number(item.battery) || 6)) + '%';
      fields.humidityText.textContent = (item.hum1 ?? '--') + '%';
      fields.commIcon.src = item.online === false ? '/assets/comm-offline.png' : '/assets/comm-online.png';
      fields.fill.parentElement.parentElement.style.setProperty('--thermo-level', levelFor(item) + '%');
    }

    async function refresh() {
      try {
        const response = await fetch('/devices/by-code/' + encodeURIComponent(code), { cache: 'no-store' });
        const payload = await response.json();
        if (payload.ok && payload.data && payload.data.card) render(payload.data.card);
      } catch (error) {
        console.warn('Não foi possível atualizar o card', error);
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
  const deepLink = buildActivationDeepLink(code);

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>IDsensor - Ativação</title>
  <style>
    :root { font-family: Inter, Arial, sans-serif; }
    body { background: #f4f8fc; color: #14243b; margin: 0; }
    main { min-height: 100vh; padding: 28px 18px; display: grid; place-items: center; }
    section { background: white; border: 1px solid #d8e4f2; border-radius: 8px; box-shadow: 0 18px 38px rgba(9,35,67,0.12); max-width: 440px; padding: 24px; width: 100%; }
    .logo { display: block; height: auto; margin: 0 auto 18px; max-width: 250px; width: 78%; }
    h1 { font-size: 25px; margin: 0 0 10px; }
    p { color: #65758f; font-size: 15px; font-weight: 700; line-height: 1.5; margin: 0 0 16px; }
    .code { background: #eaf2fb; border: 1px solid #d8e4f2; border-radius: 8px; color: #0b2f55; font-size: 23px; font-weight: 900; letter-spacing: 1px; padding: 14px; text-align: center; }
    .open-app { background: #0b68d8; border-radius: 8px; color: white; display: block; font-size: 16px; font-weight: 900; margin: 18px 0 8px; padding: 14px; text-align: center; text-decoration: none; }
    .hint { font-size: 13px; }
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
      <p>Este link foi feito para abrir o app IDsensor e vincular o celular ao cliente.</p>
      <div class="code">${escapeHtml(code)}</div>
      <a class="open-app" href="${escapeHtml(deepLink)}">Abrir no app IDsensor</a>
      <p class="hint">No Expo Go, este botão pode não abrir o app. Abra o projeto no Expo Go e ative pelo scanner interno ou digitando o código.</p>
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
    fail(res, 403, 'Arquivo não autorizado.');
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
    const error = new Error('JSON inválido no corpo da requisição.');
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
      NULL AS reconhecido_por_modelo,
      NULL AS reconhecido_por_plataforma,
      0 AS visualizado,
      NULL AS visualizado_em
    FROM alerts a
    JOIN dispositivos d ON d.id = a.dispositivo_id
    JOIN clientes c ON c.id = a.cliente_id
    JOIN unidades u ON u.id = a.unidade_id
    ${where}
    ORDER BY a.criado_em DESC
  `;
}

function appAlertSelectSql(where = '') {
  return `
    SELECT
      a.*,
      d.nome AS dispositivo_nome,
      d.local AS dispositivo_local,
      c.nome AS cliente_nome,
      u.nome AS unidade_nome,
      ad.modelo_aparelho AS reconhecido_por_modelo,
      ad.plataforma AS reconhecido_por_plataforma,
      CASE WHEN ack.alert_id IS NULL THEN 0 ELSE 1 END AS visualizado,
      ack.criado_em AS visualizado_em
    FROM alerts a
    JOIN dispositivos d ON d.id = a.dispositivo_id
    JOIN clientes c ON c.id = a.cliente_id
    JOIN unidades u ON u.id = a.unidade_id
    LEFT JOIN (
      SELECT alert_id, app_device_id, MIN(criado_em) AS criado_em
      FROM alert_acknowledgements
      WHERE app_device_id = ?
      GROUP BY alert_id, app_device_id
    ) ack ON ack.alert_id = a.id
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
    visualizado: !!row.visualizado,
    visualizado_em: row.visualizado_em || null,
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

function formatTelemetryTime(value) {
  const date = value ? new Date(value) : new Date();
  if (!Number.isFinite(date.getTime())) return '--:--';

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
  });
}

function secondsSince(value) {
  const startedAt = value ? new Date(value).getTime() : Date.now();
  if (!Number.isFinite(startedAt)) return 0;
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}

function alertDurationSeconds(alert) {
  if (!alert?.criado_em) return 0;
  const startedAt = new Date(alert.criado_em).getTime();
  const endedAt = alert.encerrado_em ? new Date(alert.encerrado_em).getTime() : Date.now();
  if (!Number.isFinite(startedAt) || !Number.isFinite(endedAt)) return 0;
  return Math.max(0, Math.floor((endedAt - startedAt) / 1000));
}

function telemetryEventForAlert(alert) {
  const time = formatTelemetryTime(alert.criado_em);
  const type = String(alert.tipo_alerta || '').toLowerCase();
  const temp = Number(alert.temperatura_atual);
  const tempText = Number.isFinite(temp) ? `${temp.toFixed(1)}°C` : 'leitura registrada';

  if (type.includes('critico')) {
    return [
      {
        time,
        tone: 'critical',
        title: 'Crítico iniciado',
        detail: `Permanência fora do limite atingiu a regra configurada (${tempText}).`
      },
      {
        time,
        tone: 'alert',
        title: 'Primeiro alerta enviado',
        detail: 'Canais configurados foram acionados pela simulação.'
      }
    ];
  }

  if (type.includes('offline')) {
    return [{
      time,
      tone: 'offline',
      title: 'Comunicação interrompida',
      detail: 'Dispositivo ficou sem transmitir leituras ao painel.'
    }];
  }

  if (type.includes('atencao')) {
    return [{
      time,
      tone: 'attention',
      title: 'Temperatura saiu do limite configurado',
      detail: `Primeiro registro fora do intervalo permitido (${tempText}).`
    }];
  }

  return [{
    time,
    tone: alert.severidade === 'critica' ? 'critical' : 'attention',
    title: alert.mensagem || 'Evento registrado',
    detail: `Evento registrado pela simulação (${tempText}).`
  }];
}

function telemetryEventFromRow(event) {
  return {
    occurredAt: event.ocorrido_em,
    time: formatTelemetryTime(event.ocorrido_em),
    tone: event.tom || 'normal',
    title: event.titulo || 'Evento operacional',
    detail: event.detalhe || ''
  };
}

function buildOperationalTelemetry(db, row) {
  const status = String(row.status || 'normal').toLowerCase();
  const telemetryWindowStart = new Date(Date.now() - (24 * 60 * 60 * 1000)).toISOString();
  const alerts = db.prepare(`
    SELECT *
    FROM alerts
    WHERE dispositivo_id = ?
      AND criado_em >= ?
    ORDER BY criado_em DESC
    LIMIT 100
  `).all(row.id, telemetryWindowStart);

  const operationalEvents = db.prepare(`
    SELECT *
    FROM telemetry_events
    WHERE dispositivo_id = ?
      AND ocorrido_em >= ?
    ORDER BY ocorrido_em DESC, rowid DESC
    LIMIT 12
  `).all(row.id, telemetryWindowStart);

  const activeAlert = alerts.find((alert) => alert.status === 'ativo') || null;
  const events = [
    ...alerts.flatMap((alert) => telemetryEventForAlert(alert).map((event) => ({
      ...event,
      occurredAt: alert.criado_em
    }))),
    ...operationalEvents.map(telemetryEventFromRow)
  ].sort((a, b) => String(b.occurredAt || '').localeCompare(String(a.occurredAt || '')));

  if (!events.length) {
    events.push({
      time: formatTelemetryTime(row.atualizado_em || new Date()),
      tone: status === 'offline' ? 'offline' : 'limit',
      title: status === 'offline' ? 'Sem comunicação registrada' : 'Dentro do limite',
      detail: status === 'offline'
        ? 'Último estado do dispositivo indica ausência de comunicação.'
        : 'Leitura atual dentro do intervalo configurado.'
    });
  }

  const durationForType = (type) => alerts
    .filter((alert) => String(alert.tipo_alerta || '').includes(type))
    .reduce((total, alert) => total + alertDurationSeconds(alert), 0);
  const criticalSeconds = durationForType('critico');
  const attentionSeconds = durationForType('atencao');
  const offlineSeconds = durationForType('offline');
  const withinLimitSeconds = Math.max(0, (24 * 60 * 60) - criticalSeconds - attentionSeconds - offlineSeconds);
  const lastNormalization = operationalEvents.find((event) => (
    event.tipo_evento === 'simulation_temperature_normalized'
    || event.tipo_evento === 'simulation_communication_restored'
  ));
  const activeStartedAt = activeAlert?.criado_em || row.atualizado_em;
  const activeElapsedSeconds = activeAlert ? alertDurationSeconds(activeAlert) : 0;

  return {
    active: {
      status,
      startedAt: activeStartedAt,
      startedLabel: activeAlert ? `Início ${formatTelemetryTime(activeAlert.criado_em)}` : null,
      elapsedSeconds: activeElapsedSeconds,
      normalizedAt: lastNormalization?.ocorrido_em || null,
      normalizedLabel: lastNormalization ? `Última normalização ${formatTelemetryTime(lastNormalization.ocorrido_em)}` : null
    },
    durations: {
      withinLimitSeconds,
      criticalSeconds,
      attentionSeconds,
      offlineSeconds
    },
    alertChannels: [
      { tone: 'sms', icon: 'sms', label: 'SMS', total: alerts.length ? 3 : 0 },
      { tone: 'email', icon: 'email', label: 'E-mail', total: alerts.length ? 2 : 0 },
      { tone: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp', total: alerts.length ? 3 : 0 }
    ],
    events: events.slice(0, 12).map(({ occurredAt, ...event }) => event)
  };
}

function buildDeviceCardWithTelemetry(db, row) {
  const card = buildDeviceCard(row);
  const operationalTelemetry = buildOperationalTelemetry(db, row);
  card.operationalTelemetry = operationalTelemetry;

  if (card.state === 'crit' && operationalTelemetry.active?.elapsedSeconds) {
    card.criticalElapsedSeconds = operationalTelemetry.active.elapsedSeconds;
  }

  return card;
}

function applyAppDeviceAlertBaseline(rows, appDevice) {
  const activatedAt = appDevice?.criado_em;
  if (!activatedAt) return rows;

  return rows.map((row) => {
    if (row.visualizado || !row.criado_em || row.criado_em > activatedAt) return row;
    return {
      ...row,
      visualizado: 1,
      visualizado_em: activatedAt
    };
  });
}

function buildAreasSummary(db, clienteId) {
  const rows = db.prepare(`
    SELECT
      u.id,
      u.nome,
      u.local,
      COUNT(d.id) AS devices_count
    FROM unidades u
    LEFT JOIN dispositivos d ON d.unidade_id = u.id
    WHERE u.cliente_id = ?
    GROUP BY u.id
    ORDER BY
      CASE
        WHEN LOWER(u.nome) LIKE '%banco%' THEN 0
        WHEN LOWER(u.nome) LIKE '%laboratorio%' THEN 1
        ELSE 2
      END,
      u.nome ASC
  `).all(clienteId);

  if (clienteId === 'cliente_idvida' && !rows.some((row) => String(row.nome || '').toLowerCase().includes('laboratorio'))) {
    rows.push({
      id: 'unidade_laboratorio',
      nome: 'Laboratorio',
      local: 'Unidade Bela Vista',
      devices_count: 0
    });
  }

  return rows.map((row) => ({
    id: row.id,
    nome: String(row.nome || '').replace('Laboratorio', 'Laboratório'),
    local: row.local,
    devices_count: Number(row.devices_count || 0)
  }));
}

addRoute('GET', '/health', async ({ res }) => {
  ok(res, {
    status: 'online',
    datetime: nowIso(),
    version
  });
});

addRoute('POST', '/api/auth/login', async ({ body, res }) => {
  const username = String(body?.username || '').trim().toLowerCase();
  const password = String(body?.password || '');
  const user = PANEL_AUTH_USERS[username];

  if (!user || user.password !== password) {
    return fail(res, 401, 'Usuário ou senha inválidos.');
  }

  ok(res, sanitizePanelUser(user));
});

addRoute('POST', '/seed', async ({ res }) => {
  ok(res, seedDatabase(), 201);
});

addRoute('GET', '/devices', async ({ res }) => {
  const db = getDb();
  advanceSimulationIfNeeded(db);
  const rows = db.prepare(deviceSelectSql('ORDER BY d.nome ASC')).all();
  ok(res, rows.map((row) => buildDeviceCardWithTelemetry(db, row)));
});

addRoute('GET', '/q/:codigo', async ({ params, res }) => {
  const code = extractScannedCode(params.codigo);
  const db = getDb();
  advanceSimulationIfNeeded(db);

  const row = getDeviceByScannedCode(code);
  if (!row) {
    return html(res, 404, renderQrMessagePage(
      'QR não encontrado',
      'Não encontramos um equipamento ativo para este QR Code.',
      code || 'QR NÃO ENCONTRADO'
    ));
  }

  return html(res, 200, renderDeviceQrPage(buildDeviceCardWithTelemetry(db, row), code));
});

addRoute('GET', '/a/:codigo', async ({ params, req, res }) => {
  const code = extractScannedCode(params.codigo);
  const activation = getDb().prepare(`
    SELECT ac.*, c.nome AS cliente_nome, u.nome AS unidade_nome
    FROM activation_codes ac
    JOIN clientes c ON c.id = ac.cliente_id
    JOIN unidades u ON u.id = ac.unidade_id
    WHERE ac.codigo = ?
      AND ac.ativo = 1
      AND ac.tipo_ativacao = 'app_alerta'
      AND ac.usado_em IS NULL
      AND (ac.expira_em IS NULL OR ac.expira_em > ?)
  `).get(code, nowIso());

  return html(res, activation ? 200 : 404, renderActivationQrPage(
    activation,
    code || 'CÓDIGO INVÁLIDO',
    requestPublicBase(req)
  ));
});

addRoute('GET', '/devices/by-code/:codigo', async ({ params, req, res }) => {
  const code = extractScannedCode(params.codigo);
  const db = getDb();
  advanceSimulationIfNeeded(db);
  const row = getDeviceByScannedCode(code);

  if (!row) return fail(res, 404, 'Dispositivo não encontrado para este QR Code.');

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
  if (!row) return fail(res, 404, 'Dispositivo não encontrado.');
  ok(res, buildDeviceCardWithTelemetry(getDb(), row));
});

addRoute('POST', '/devices/:id/update-status', async ({ params, body, res }) => {
  const current = getDeviceById(params.id);
  if (!current) return fail(res, 404, 'Dispositivo não encontrado.');

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

  ok(res, buildDeviceCardWithTelemetry(getDb(), getDeviceById(params.id)));
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

addRoute('POST', '/api/ttn/uplink', async ({ body, res }) => {
  const db = getDb();
  const normalizedReadings = normalizeTtnCollectorPayloads(body);
  const storedReadings = normalizedReadings
    .map((reading) => saveCollectorReading(db, reading))
    .filter(Boolean);

  ok(res, {
    received: normalizedReadings.length,
    stored: storedReadings.length,
    ignored: normalizedReadings.length - storedReadings.length,
    readings: storedReadings
  });
});

addRoute('GET', '/api/cart-tracking/readings', async ({ query, res }) => {
  const macFilters = String(query.mac || '')
    .split(',')
    .map(compactBleSensorId)
    .filter(Boolean);
  const history = query.history === 'true' || query.history === '1';

  ok(res, {
    mode: history ? 'history' : 'latest',
    readings: (history ? collectorReadingsHistory : latestCollectorReadings)(getDb(), {
      limit: query.limit || 200,
      macFilters
    })
  });
});

addRoute('GET', '/api/cart-tracking/calibration/:mac', async ({ params, res }) => {
  const sensorId = compactBleSensorId(params.mac);
  if (!sensorId) return fail(res, 400, 'MAC do sensor invalido.');

  ok(res, {
    mac: formatBleSensorId(sensorId),
    calibration: collectorCalibrationForSensor(getDb(), sensorId)
  });
});

addRoute('POST', '/api/cart-tracking/calibration/:mac', async ({ params, body, res }) => {
  try {
    const calibration = saveCollectorCalibration(getDb(), params.mac, body?.calibration || body);
    ok(res, {
      mac: formatBleSensorId(params.mac),
      calibration
    });
  } catch (error) {
    return fail(res, error.statusCode || 500, error.message || 'Erro ao salvar calibracao.');
  }
});

addRoute('POST', '/activation-code', async ({ body, req, res }) => {
  const db = getDb();
  const clienteId = body.cliente_id;
  const unidadeId = body.unidade_id;
  const dispositivoId = body.dispositivo_id || null;
  const tipoAtivacao = body.tipo_ativacao || 'app_alerta';
  const usuarioNome = String(body.usuario_nome || '').trim() || null;
  const usuarioEmail = String(body.usuario_email || '').trim().toLowerCase() || null;
  const usuarioPerfil = normalizeUserProfile(body.usuario_perfil || body.perfil);
  const rawAreaIds = normalizeAreaIds(body.area_ids);
  const areaIds = isAdminProfile(usuarioPerfil)
    ? []
    : (rawAreaIds.length ? rawAreaIds : [unidadeId]);
  const areaNome = String(body.area_nome || '').trim()
    || (usuarioPerfil === 'master'
      ? 'Todos os clientes'
      : (isAdminProfile(usuarioPerfil) || areaIdsAllowAll(areaIds) ? 'Todas as áreas' : null));
  const serializedAreaIds = isAdminProfile(usuarioPerfil) ? null : serializeAreaIds(areaIds);
  const enviarEmail = body.enviar_email !== false && body.enviar_email !== 'false';

  if (!clienteId || !unidadeId) {
    return fail(res, 400, 'cliente_id e unidade_id são obrigatórios.');
  }

  const target = db.prepare(`
    SELECT c.nome AS cliente_nome, u.nome AS unidade_nome
    FROM clientes c
    JOIN unidades u ON u.cliente_id = c.id
    WHERE c.id = ? AND u.id = ?
  `).get(clienteId, unidadeId);

  if (!target) return fail(res, 404, 'Cliente ou unidade não encontrados.');

  const prefix = tipoAtivacao === 'dispositivo_qrcode' ? 'DEV' : 'APP';
  const code = activationCode(prefix);
  const activationId = id('act');
  const createdAt = nowIso();
  const expiresAt = activationExpiresAt(createdAt);

  if (tipoAtivacao === 'app_alerta') {
    db.prepare(`
      UPDATE activation_codes
      SET ativo = 0
      WHERE cliente_id = ?
        AND unidade_id = ?
        AND tipo_ativacao = 'app_alerta'
        AND ativo = 1
        AND usado_em IS NULL
        AND COALESCE(usuario_email, '') = COALESCE(?, '')
        AND COALESCE(usuario_nome, '') = COALESCE(?, '')
        AND COALESCE(area_nome, '') = COALESCE(?, '')
        AND COALESCE(area_ids, '') = COALESCE(?, '')
        AND COALESCE(usuario_perfil, '') = COALESCE(?, '')
    `).run(clienteId, unidadeId, usuarioEmail, usuarioNome, areaNome, serializedAreaIds, usuarioPerfil);
  }

  db.prepare(`
    INSERT INTO activation_codes (
      id, codigo, cliente_id, unidade_id, dispositivo_id, tipo_ativacao, ativo,
      criado_em, expira_em, usuario_nome, usuario_email, area_nome, area_ids, usuario_perfil
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    activationId,
    code,
    clienteId,
    unidadeId,
    dispositivoId,
    tipoAtivacao,
    createdAt,
    expiresAt,
    usuarioNome,
    usuarioEmail,
    areaNome,
    serializedAreaIds,
    usuarioPerfil
  );

  const publicBase = requestPublicBase(req);
  const payload = tipoAtivacao === 'dispositivo_qrcode'
    ? buildDevicePayload(code, publicBase)
    : buildActivationPayload(code, publicBase);
  const qrPayload = tipoAtivacao === 'app_alerta'
    ? buildActivationDeepLink(code)
    : payload;

  let emailDelivery = { status_envio: 'skipped', message: 'Envio não solicitado para este tipo de ativação.' };
  if (tipoAtivacao === 'app_alerta' && enviarEmail) {
    try {
      emailDelivery = await sendActivationEmail({
        usuarioNome,
        usuarioEmail,
        codigo: code,
        activationUrl: payload,
        qrImageUrl: buildQrImageUrl(qrPayload),
        clienteNome: target.cliente_nome,
        unidadeNome: target.unidade_nome,
        areaNome,
        expiraEm: expiresAt
      });
    } catch (error) {
      emailDelivery = {
        status_envio: 'failed',
        provider: 'resend',
        message: error.message
      };
    }

    db.prepare('UPDATE activation_codes SET email_status = ?, email_erro = ? WHERE id = ?')
      .run(
        emailDelivery.status_envio || null,
        emailDelivery.status_envio === 'sent' ? null : (emailDelivery.message || null),
        activationId
      );
  }

  ok(res, {
    id: activationId,
    codigo: code,
    cliente_id: clienteId,
    unidade_id: unidadeId,
    dispositivo_id: dispositivoId,
    tipo_ativacao: tipoAtivacao,
    usuario_nome: usuarioNome,
    usuario_email: usuarioEmail,
    area_nome: areaNome,
    area_ids: normalizeAreaIds(serializedAreaIds),
    usuario_perfil: usuarioPerfil,
    expira_em: expiresAt,
    email_delivery: emailDelivery,
    qr_payload: payload,
    qr_scan_payload: qrPayload,
    activation_deep_link: tipoAtivacao === 'app_alerta' ? qrPayload : null,
    qr_code_data_url: await buildQrDataUrl(qrPayload),
    qr_image_url: buildQrImageUrl(qrPayload)
  }, 201);
});

addRoute('POST', '/activate', async ({ body, res }) => {
  const db = getDb();
  const codigo = extractScannedCode(body.codigo);
  const token = body.expo_push_token || null;
  const plataforma = body.plataforma || 'desconhecida';
  const modelo = body.modelo_aparelho || 'Aparelho de teste';

  if (!codigo) return fail(res, 400, 'Código de ativação obrigatório.');

  const activation = db.prepare(`
    SELECT ac.*, c.nome AS cliente_nome, u.nome AS unidade_nome
    FROM activation_codes ac
    JOIN clientes c ON c.id = ac.cliente_id
    JOIN unidades u ON u.id = ac.unidade_id
    WHERE ac.codigo = ? AND ac.tipo_ativacao = 'app_alerta'
  `).get(codigo);

  if (!activation) return fail(res, 404, 'Código inválido ou inativo.');
  if (activation.usado_em) return fail(res, 409, 'Código de ativação já utilizado.');
  if (!activation.ativo) return fail(res, 404, 'Código inválido ou inativo.');
  if (isExpiredIso(activation.expira_em)) {
    db.prepare('UPDATE activation_codes SET ativo = 0 WHERE id = ?').run(activation.id);
    return fail(res, 410, 'Código de ativação expirado. Gere um novo código no painel.');
  }

  const appDeviceId = id('appdev');
  const createdAt = nowIso();
  const usuarioPerfil = normalizeUserProfile(activation.usuario_perfil);

  db.prepare(`
    INSERT INTO app_devices (
      id, activation_code_id, cliente_id, unidade_id, dispositivo_id,
      expo_push_token, plataforma, modelo_aparelho, usuario_nome,
      usuario_email, area_nome, area_ids, usuario_perfil, ativo, criado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `).run(
    appDeviceId,
    activation.id,
    activation.cliente_id,
    activation.unidade_id,
    activation.dispositivo_id,
    token,
    plataforma,
    modelo,
    activation.usuario_nome,
    activation.usuario_email,
    activation.area_nome,
    activation.area_ids || null,
    usuarioPerfil,
    createdAt
  );

  db.prepare('UPDATE activation_codes SET usado_em = COALESCE(usado_em, ?), ativo = 0 WHERE id = ?')
    .run(createdAt, activation.id);

  const activationAreaIds = normalizeAreaIds(activation.area_ids);
  const devicesCount = isAdminProfile(usuarioPerfil) || areaIdsAllowAll(activationAreaIds)
    ? db.prepare('SELECT COUNT(*) AS count FROM dispositivos WHERE cliente_id = ?')
      .get(activation.cliente_id).count
    : activationAreaIds.length
      ? db.prepare(`
          SELECT COUNT(*) AS count
          FROM dispositivos
          WHERE cliente_id = ?
            AND unidade_id IN (${activationAreaIds.map(() => '?').join(',')})
        `).get(activation.cliente_id, ...activationAreaIds).count
      : db.prepare('SELECT COUNT(*) AS count FROM dispositivos WHERE cliente_id = ? AND unidade_id = ?')
        .get(activation.cliente_id, activation.unidade_id).count;

  const appDeviceSession = {
    id: appDeviceId,
    activation_code_id: activation.id,
    cliente_id: activation.cliente_id,
    unidade_id: activation.unidade_id,
    dispositivo_id: activation.dispositivo_id,
    usuario_nome: activation.usuario_nome,
    usuario_email: activation.usuario_email,
    area_nome: activation.area_nome,
    area_ids: activation.area_ids || null,
    usuario_perfil: usuarioPerfil,
    criado_em: createdAt
  };

  ok(res, {
    success: true,
    app_device_id: appDeviceId,
    app_device_token: createAppDeviceToken(appDeviceSession, activation),
    cliente: {
      id: activation.cliente_id,
      nome: activation.cliente_nome
    },
    unidade: {
      id: activation.unidade_id,
      nome: activation.unidade_nome
    },
    usuario: {
      nome: activation.usuario_nome || null,
      email: activation.usuario_email || null,
      area: activation.area_nome || activation.unidade_nome,
      area_ids: normalizeAreaIds(activation.area_ids),
      perfil: usuarioPerfil
    },
    dispositivo_id: activation.dispositivo_id,
    devices_count: devicesCount,
    areas: buildAreasSummary(db, activation.cliente_id)
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

addRoute('GET', '/app-devices/search', async ({ query, res }) => {
  const q = String(query.q || '').trim().toLowerCase();
  if (q.length < 2) return ok(res, []);

  const like = `%${q}%`;
  const rows = getDb().prepare(`
    SELECT
      ad.id,
      ad.ativo,
      ad.criado_em,
      ad.plataforma,
      ad.modelo_aparelho,
      COALESCE(ad.usuario_nome, ac.usuario_nome) AS usuario_nome,
      COALESCE(ad.usuario_email, ac.usuario_email) AS usuario_email,
      COALESCE(ad.area_nome, ac.area_nome, u.nome) AS area_nome,
      COALESCE(ad.usuario_perfil, ac.usuario_perfil, 'area') AS usuario_perfil,
      ad.activation_code_id,
      ac.codigo AS codigo_ativacao,
      ac.ativo AS codigo_ativo,
      ac.usado_em,
      c.nome AS cliente_nome,
      u.nome AS unidade_nome
    FROM app_devices ad
    JOIN activation_codes ac ON ac.id = ad.activation_code_id
    JOIN clientes c ON c.id = ad.cliente_id
    JOIN unidades u ON u.id = ad.unidade_id
    WHERE ad.ativo = 1
      AND (
        LOWER(COALESCE(ad.usuario_nome, ac.usuario_nome, '')) LIKE ?
        OR LOWER(COALESCE(ad.usuario_email, ac.usuario_email, '')) LIKE ?
        OR LOWER(ac.codigo) LIKE ?
      )
    ORDER BY ad.criado_em DESC
    LIMIT 12
  `).all(like, like, like);

  ok(res, rows);
});

addRoute('POST', '/app-devices/:id/push-token', async ({ params, body, req, res }) => {
  const db = getDb();
  const token = String(body.expo_push_token || '').trim() || null;
  const plataforma = String(body.plataforma || '').trim() || 'desconhecida';
  const modelo = String(body.modelo_aparelho || '').trim() || 'Aparelho IDsensor';

  const appDevice = getAuthorizedAppDevice(db, params.id, req, body);
  if (!appDevice) return fail(res, 404, 'Celular habilitado não encontrado.');

  db.prepare(`
    UPDATE app_devices
    SET expo_push_token = ?, plataforma = ?, modelo_aparelho = ?
    WHERE id = ?
  `).run(token, plataforma, modelo, params.id);

  ok(res, {
    id: params.id,
    expo_push_token: token,
    plataforma,
    modelo_aparelho: modelo
  });
});

addRoute('POST', '/app-devices/:id/deactivate', async ({ params, res }) => {
  const db = getDb();
  const appDevice = db.prepare(`
    SELECT
      ad.*,
      ac.codigo AS codigo_ativacao,
      COALESCE(ad.usuario_nome, ac.usuario_nome) AS usuario_nome,
      COALESCE(ad.usuario_email, ac.usuario_email) AS usuario_email,
      COALESCE(ad.area_nome, ac.area_nome) AS area_nome,
      COALESCE(ad.usuario_perfil, ac.usuario_perfil, 'area') AS usuario_perfil
    FROM app_devices ad
    JOIN activation_codes ac ON ac.id = ad.activation_code_id
    WHERE ad.id = ? AND ad.ativo = 1
  `).get(params.id);

  if (!appDevice) return fail(res, 404, 'Celular habilitado não encontrado.');

  db.prepare('UPDATE app_devices SET ativo = 0 WHERE id = ?').run(params.id);
  db.prepare('UPDATE activation_codes SET ativo = 0 WHERE id = ?').run(appDevice.activation_code_id);

  ok(res, {
    id: params.id,
    ativo: false,
    activation_code_id: appDevice.activation_code_id,
    codigo_ativacao: appDevice.codigo_ativacao,
    usuario: {
      nome: appDevice.usuario_nome || null,
      email: appDevice.usuario_email || null,
      area: appDevice.area_nome || null
    }
  });
});

addRoute('POST', '/alerts', async ({ body, res }) => {
  const db = getDb();
  const device = getDeviceById(body.dispositivo_id);
  if (!device) return fail(res, 404, 'Dispositivo não encontrado.');

  const alertId = id('alert');
  const createdAt = nowIso();
  const tipoAlerta = body.tipo_alerta || 'temperatura';
  const severidade = body.severidade || (body.status === 'critico' ? 'critica' : 'alta');
  const temperatura = Object.prototype.hasOwnProperty.call(body, 'temperatura_atual')
    ? body.temperatura_atual
    : device.temperatura_atual;
  const mensagem = body.mensagem || alertMessageForAlert({
    status: body.status,
    severidade,
    tipo_alerta: tipoAlerta
  });

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
      AND (dispositivo_id IS NULL OR dispositivo_id = ?)
  `).all(device.cliente_id, device.id)
    .filter((recipient) => appDeviceCanAccessUnit(recipient, device.unidade_id));

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

addRoute('GET', '/app/alerts/:app_device_id', async ({ params, req, res }) => {
  const db = getDb();
  const appDevice = getAuthorizedAppDevice(db, params.app_device_id, req);
  if (!appDevice) return fail(res, 404, 'Celular habilitado não encontrado.');

  const allowedAreaIds = allowedAreaIdsForAppDevice(appDevice);
  const rows = allowedAreaIds === null
    ? db.prepare(appAlertSelectSql(`
      WHERE a.cliente_id = ?
        AND (? IS NULL OR a.dispositivo_id = ?)
    `)).all(appDevice.id, appDevice.cliente_id, appDevice.dispositivo_id, appDevice.dispositivo_id)
    : allowedAreaIds.length
      ? db.prepare(appAlertSelectSql(`
        WHERE a.cliente_id = ?
          AND a.unidade_id IN (${allowedAreaIds.map(() => '?').join(',')})
          AND (? IS NULL OR a.dispositivo_id = ?)
      `)).all(appDevice.id, appDevice.cliente_id, ...allowedAreaIds, appDevice.dispositivo_id, appDevice.dispositivo_id)
    : db.prepare(appAlertSelectSql(`
      WHERE a.cliente_id = ?
        AND a.unidade_id = ?
        AND (? IS NULL OR a.dispositivo_id = ?)
    `)).all(appDevice.id, appDevice.cliente_id, appDevice.unidade_id, appDevice.dispositivo_id, appDevice.dispositivo_id);

  ok(res, applyAppDeviceAlertBaseline(rows, appDevice).map(buildAlert));
});

addRoute('GET', '/alerts/:id', async ({ params, res }) => {
  const row = getDb().prepare(alertSelectSql('WHERE a.id = ?')).get(params.id);
  if (!row) return fail(res, 404, 'Alerta não encontrado.');
  ok(res, buildAlert(row));
});

addRoute('POST', '/alerts/:id/acknowledge', async ({ params, body, req, res }) => {
  const db = getDb();
  const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(params.id);
  if (!alert) return fail(res, 404, 'Alerta não encontrado.');

  const appDeviceId = body.app_device_id;
  const appDevice = getAuthorizedAppDevice(db, appDeviceId, req, body);
  if (!appDevice) return fail(res, 404, 'Celular habilitado não encontrado.');

  const createdAt = nowIso();
  const existingAck = db.prepare(`
    SELECT id
    FROM alert_acknowledgements
    WHERE alert_id = ? AND app_device_id = ?
    LIMIT 1
  `).get(alert.id, appDevice.id);

  if (!existingAck) {
    db.prepare(`
      INSERT INTO alert_acknowledgements (id, alert_id, app_device_id, status, criado_em)
      VALUES (?, ?, ?, 'ciente', ?)
    `).run(id('ack'), alert.id, appDevice.id, createdAt);
  }

  ok(res, {
    success: true,
    alert: buildAlert(db.prepare(appAlertSelectSql('WHERE a.id = ?')).get(appDevice.id, alert.id))
  });
});

addRoute('POST', '/alerts/:id/close', async ({ params, res }) => {
  const result = getDb().prepare(`
    UPDATE alerts
    SET status = 'encerrado', encerrado_em = ?
    WHERE id = ?
  `).run(nowIso(), params.id);

  if (!result.changes) return fail(res, 404, 'Alerta não encontrado.');
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
      return fail(res, 404, 'Rota não encontrada.');
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
