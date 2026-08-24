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
const { buildCartAnalyticReportHtml } = require('./services/cartAnalyticReport');
const { sendActivationEmail } = require('./services/emailService');
const { gatewayStatusSummary, getMqttBridgeStatus, parseMokoRawPayload } = require('./services/mqttBridge');
const { sendExpoPush } = require('./services/pushService');
const { alertMessageForAlert } = require('./services/alertText');
const {
  OFFLINE_AFTER_MS,
  calculateFillPercentage,
  normalizeBleGatewayPayloads,
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
const { appDeviceTokenSecret, databaseUrl, publicApiUrl, version } = require('./config');

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

const BATHROOM_CHECKLIST_BATHROOMS = [
  { id: 'atrium-feminino', location: 'Atrium', gender: 'Feminino', name: 'Banheiro Feminino - Atrium' },
  { id: 'atrium-masculino', location: 'Atrium', gender: 'Masculino', name: 'Banheiro Masculino - Atrium' },
  { id: 'endoscopia-feminino', location: 'Endoscopia', gender: 'Feminino', name: 'Banheiro Feminino - Endoscopia' },
  { id: 'endoscopia-masculino', location: 'Endoscopia', gender: 'Masculino', name: 'Banheiro Masculino - Endoscopia' }
];
const BATHROOM_BY_ID = new Map(BATHROOM_CHECKLIST_BATHROOMS.map((bathroom) => [bathroom.id, bathroom]));
const BATHROOM_REASONS = ['reposicao', 'limpeza'];
const BATHROOM_CLEAN_LEVELS = ['sim', 'parcial', 'nao'];
const BATHROOM_ODOR_LEVELS = ['nao', 'leve', 'forte'];
const BATHROOM_SUPPLY_LEVELS = ['cheio', 'medio', 'baixo', 'vazio'];
const BATHROOM_SUPPLY_ITEMS = [
  { key: 'papel_higienico', label: 'Papel higiênico', unit: 'rolos' },
  { key: 'papel_toalha', label: 'Papel toalha', unit: 'refis' },
  { key: 'sabonete', label: 'Sabonete', unit: 'refis' },
  { key: 'alcool_outro', label: 'Álcool/outro insumo', unit: 'refis' },
  { key: 'protetor_assento', label: 'Protetor de assento', unit: 'unidades' },
  { key: 'absorvente', label: 'Absorvente', unit: 'unidades' }
];
const BATHROOM_SUPPLY_ITEM_BY_KEY = new Map(BATHROOM_SUPPLY_ITEMS.map((item) => [item.key, item]));
const BATHROOM_ACTIONS = [
  'limpeza_completa',
  'limpeza_rapida',
  'reposicao_papel',
  'reposicao_sabonete',
  'reposicao_alcool',
  'correcao_odor',
  'manutencao',
  'nenhuma_acao'
];

const CART_EMPTY_DISTANCE_MM = Number(process.env.CART_EMPTY_DISTANCE_MM || 720);
const CART_FULL_DISTANCE_MM = Number(process.env.CART_FULL_DISTANCE_MM || 140);
const CART_LID_OPEN_MARGIN_MM = Number(process.env.CART_LID_OPEN_MARGIN_MM || 250);
const CART_LID_OPEN_MARGIN_PERCENT = Number(process.env.CART_LID_OPEN_MARGIN_PERCENT || 30);
const CART_LID_CLOSE_MARGIN_MM = Number(process.env.CART_LID_CLOSE_MARGIN_MM || 120);
const CART_EMPTY_DEADBAND_MM = Number(process.env.CART_EMPTY_DEADBAND_MM || 50);
const CART_EMPTY_DEADBAND_PERCENT = Number(process.env.CART_EMPTY_DEADBAND_PERCENT || 8);
const CART_STABLE_EMPTY_PERCENT = Number(process.env.CART_STABLE_EMPTY_PERCENT || 10);
const CART_VALID_DISTANCE_MIN_MM = Number(process.env.CART_VALID_DISTANCE_MIN_MM || 80);
const CART_FILL_CHANGE_DEADBAND_PERCENT = Number(process.env.CART_FILL_CHANGE_DEADBAND_PERCENT || 5);
const CART_SUSPICIOUS_JUMP_PERCENT = Number(process.env.CART_SUSPICIOUS_JUMP_PERCENT || 75);
const CART_CRITICAL_PERCENT = Number(process.env.CART_CRITICAL_PERCENT || 90);
const CART_LEVEL_CONFIRM_READINGS = Number(process.env.CART_LEVEL_CONFIRM_READINGS || 2);
const CART_CRITICAL_CONFIRM_READINGS = Number(process.env.CART_CRITICAL_CONFIRM_READINGS || CART_LEVEL_CONFIRM_READINGS);
const CART_LID_OPEN_CONFIRM_READINGS = Number(process.env.CART_LID_OPEN_CONFIRM_READINGS || 4);
const CART_LID_CLOSE_CONFIRM_READINGS = Number(process.env.CART_LID_CLOSE_CONFIRM_READINGS || CART_LID_OPEN_CONFIRM_READINGS);
const CART_OBSTRUCTION_CONFIRM_READINGS = Number(process.env.CART_OBSTRUCTION_CONFIRM_READINGS || 3);
const CART_SENSOR_REMOVED_CONFIRM_READINGS = Number(process.env.CART_SENSOR_REMOVED_CONFIRM_READINGS || 3);
const CART_READING_SPIKE_PERCENT = Number(process.env.CART_READING_SPIKE_PERCENT || 35);
const COLLECTOR_LID_OPEN_STATUS = 'lid_open';
const COLLECTOR_SENSOR_REMOVED_STATUS = 'sensor_removed';
const COLLECTOR_SENSOR_OBSTRUCTED_STATUS = 'sensor_obstructed';
const COLLECTOR_UNCALIBRATED_STATUS = 'uncalibrated';
const COLLECTOR_CALIBRATION_PENDING_STATUS = 'calibration_pending';
const COLLECTOR_LID_OPEN_STATE = 'open';
const COLLECTOR_LID_CLOSED_STATE = 'closed';
const COLLECTOR_EMPTY_LEVEL_STATUS = 'empty';
const COLLECTOR_NORMAL_LEVEL_STATUS = 'normal';
const COLLECTOR_ATTENTION_LEVEL_STATUS = 'attention';
const COLLECTOR_CRITICAL_LEVEL_STATUS = 'critical';
const COLLECTOR_CRITICAL_PERCENT_CHOICES = [25, 50, 75, 100];
const DEFAULT_COLLECTOR_CALIBRATION = {
  emptyDistanceMm: CART_EMPTY_DISTANCE_MM,
  fullDistanceMm: CART_FULL_DISTANCE_MM,
  redPercent: 50,
  openMarginPercent: CART_LID_OPEN_MARGIN_PERCENT,
  openMarginMinMm: CART_LID_OPEN_MARGIN_MM,
  confirmationReadings: CART_LEVEL_CONFIRM_READINGS,
  lidDetectionEnabled: false,
  samples: []
};
const EINSTEIN_CART_CLIENT_ID = 'einstein';
const EINSTEIN_CART_ROOM_ID = 'sala-bloco-b1';
const EINSTEIN_CART_ROOM_NAME = 'SALA BLOCO B1';
const EINSTEIN_CART_CRITICAL_FIRST_ALERT_MS = Number(process.env.EINSTEIN_CART_CRITICAL_FIRST_ALERT_MS || 10 * 60 * 1000);
const EINSTEIN_CART_ALERT_RECURRENCE_MS = Number(process.env.EINSTEIN_CART_ALERT_RECURRENCE_MS || 30 * 60 * 1000);
const EINSTEIN_CART_EXCHANGE_CONFIRM_READINGS = Number(process.env.EINSTEIN_CART_EXCHANGE_CONFIRM_READINGS || 2);
const EINSTEIN_CART_EXCHANGE_OLD_SILENCE_MS = Number(process.env.EINSTEIN_CART_EXCHANGE_OLD_SILENCE_MS || 4 * 60 * 1000);
const EINSTEIN_CART_EXCHANGE_MIN_RETURN_MS = Number(process.env.EINSTEIN_CART_EXCHANGE_MIN_RETURN_MS || 30 * 60 * 1000);
const EINSTEIN_CART_HISTORY_LIMIT = Number(process.env.EINSTEIN_CART_HISTORY_LIMIT || 60000);
const EINSTEIN_CART_SAMPLE_LIMIT = Number(process.env.EINSTEIN_CART_SAMPLE_LIMIT || EINSTEIN_CART_HISTORY_LIMIT);
const EINSTEIN_CART_TELEMETRY_LIMIT = Number(process.env.EINSTEIN_CART_TELEMETRY_LIMIT || 12000);
const EINSTEIN_CART_ALERT_LIMIT = Number(process.env.EINSTEIN_CART_ALERT_LIMIT || 1000);
const EINSTEIN_CART_SENSORS = [
  { id: 'c01', name: 'C01', sensorId: 'de08dbf47311', roomId: EINSTEIN_CART_ROOM_ID, roomName: EINSTEIN_CART_ROOM_NAME },
  { id: 'c02', name: 'C02', sensorId: 'c4894994a485', roomId: EINSTEIN_CART_ROOM_ID, roomName: EINSTEIN_CART_ROOM_NAME }
];
const EINSTEIN_CART_SENSOR_BY_ID = new Map(EINSTEIN_CART_SENSORS.map((sensor) => [sensor.sensorId, sensor]));
const EINSTEIN_CART_GATEWAY_ID = 'e6a69dbb6d2d';
const EINSTEIN_CART_CONFIG_DEFAULT = {
  rooms: [
    { id: EINSTEIN_CART_ROOM_ID, name: EINSTEIN_CART_ROOM_NAME, gatewayDeviceId: EINSTEIN_CART_GATEWAY_ID },
    { id: 'sala-residuos', name: 'SALA DE RES\u00cdDUOS', gatewayDeviceId: '' },
    { id: 'sala-higienizacao', name: 'SALA DE HIGIENIZA\u00c7\u00c3O', gatewayDeviceId: '' }
  ],
  carts: [],
  alertSettings: {
    popupEnabled: true,
    soundEnabled: true,
    recurrenceMinutes: 30,
    enabledTypes: {
      critical: true,
      recurrence: true,
    }
  }
};
// C01/C02 are vertical ToF sensors. A stable distance far beyond calibration means the lid is open.

function normalizeCollectorCriticalPercent(value, fallback = DEFAULT_COLLECTOR_CALIBRATION.redPercent) {
  const number = finiteNumberOrNull(value);
  const target = number !== null ? clampNumber(Math.round(number), 1, 100) : fallback;
  return COLLECTOR_CRITICAL_PERCENT_CHOICES.reduce((best, option) => {
    const bestDistance = Math.abs(best - target);
    const optionDistance = Math.abs(option - target);
    if (optionDistance < bestDistance) return option;
    if (optionDistance === bestDistance && option > best) return option;
    return best;
  }, COLLECTOR_CRITICAL_PERCENT_CHOICES[0]);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeCartTrackingRoom(room) {
  return {
    id: String(room?.id || '').trim() || normalizePanelSlug(room?.name || 'sala').replace(/\./g, '-'),
    name: String(room?.name || 'SALA').trim().toUpperCase(),
    gatewayDeviceId: String(room?.gatewayDeviceId || room?.gateway_device_id || '').trim()
  };
}

function normalizeCartTrackingCart(cart) {
  const mac = compactBleSensorId(cart?.mac || cart?.sensorId || cart?.ble_sensor_id);
  const idValue = String(cart?.id || '').trim() || (mac ? `cart-${mac}` : id('cart'));
  const roomId = String(cart?.roomId || cart?.room_id || EINSTEIN_CART_ROOM_ID).trim();
  return {
    id: idValue,
    name: String(cart?.name || cart?.nome || '').trim() || idValue,
    mac: formatBleSensorId(mac),
    roomId,
    locationStatus: roomId ? 'in_room' : 'offline',
    fillPercentage: 0,
    calibration: normalizeCollectorCalibration(cart?.calibration || {}),
    rssi: null,
    lastCommunicationAt: '',
    lastCommunicationSeen: '',
    lastSeen: '',
    registeredAt: String(cart?.registeredAt || cart?.registered_at || '').trim(),
    transitStep: 0
  };
}

function normalizeCartTrackingAlertSettings(settings = {}) {
  const defaults = EINSTEIN_CART_CONFIG_DEFAULT.alertSettings;
  const sourceTypes = settings?.enabledTypes && typeof settings.enabledTypes === 'object' ? settings.enabledTypes : {};
  const enabledTypes = {};
  for (const key of Object.keys(defaults.enabledTypes)) {
    enabledTypes[key] = sourceTypes[key] !== false;
  }
  const recurrence = finiteNumberOrNull(settings?.recurrenceMinutes);
  return {
    popupEnabled: settings?.popupEnabled !== false,
    soundEnabled: settings?.soundEnabled !== false,
    recurrenceMinutes: recurrence !== null && recurrence >= 0 ? recurrence : defaults.recurrenceMinutes,
    enabledTypes
  };
}

function normalizeCartTrackingConfigState(input = {}) {
  const base = cloneJson(EINSTEIN_CART_CONFIG_DEFAULT);
  const rooms = Array.isArray(input.rooms) ? input.rooms.map(normalizeCartTrackingRoom) : base.rooms;
  const carts = Array.isArray(input.carts)
    ? input.carts.map(normalizeCartTrackingCart).filter((cart) => compactBleSensorId(cart.mac))
    : base.carts;
  return {
    rooms,
    carts,
    alertSettings: normalizeCartTrackingAlertSettings(input.alertSettings)
  };
}

function cartTrackingConfigForClient(db, clientId = EINSTEIN_CART_CLIENT_ID) {
  const row = db.prepare('SELECT state_json FROM cart_tracking_config WHERE client_id = ?').get(clientId);
  if (!row?.state_json) return normalizeCartTrackingConfigState();
  try {
    return normalizeCartTrackingConfigState(JSON.parse(row.state_json));
  } catch {
    return normalizeCartTrackingConfigState();
  }
}

function saveCartTrackingConfigForClient(db, state, clientId = EINSTEIN_CART_CLIENT_ID) {
  const normalized = normalizeCartTrackingConfigState(state);
  const now = nowIso();
  db.prepare(`
    INSERT INTO cart_tracking_config (client_id, state_json, created_at, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT (client_id) DO UPDATE SET
      state_json = excluded.state_json,
      updated_at = excluded.updated_at
  `).run(clientId, JSON.stringify(normalized), now, now);
  return normalized;
}

function saveCartTrackingAlertSettingsForClient(db, alertSettings, clientId = EINSTEIN_CART_CLIENT_ID) {
  const current = cartTrackingConfigForClient(db, clientId);
  return saveCartTrackingConfigForClient(db, {
    ...current,
    alertSettings: normalizeCartTrackingAlertSettings(alertSettings)
  }, clientId);
}

function saveCartTrackingCriticalPercentForClient(db, bleSensorId, redPercent, clientId = EINSTEIN_CART_CLIENT_ID) {
  const sensorId = compactBleSensorId(bleSensorId);
  if (!sensorId) {
    const error = new Error('MAC do sensor inválido.');
    error.statusCode = 400;
    throw error;
  }

  const current = cartTrackingConfigForClient(db, clientId);
  const targetCart = current.carts.find((cart) => compactBleSensorId(cart.mac) === sensorId);
  if (!targetCart) {
    const error = new Error('Carrinho não encontrado para este cliente.');
    error.statusCode = 404;
    throw error;
  }

  const calibration = saveCollectorCriticalPercent(db, sensorId, redPercent);
  const nextState = {
    ...current,
    carts: current.carts.map((cart) => {
      if (compactBleSensorId(cart.mac) !== sensorId) return cart;
      return {
        ...cart,
        calibration: normalizeCollectorCalibration({
          ...cart.calibration,
          ...calibration,
          redPercent: calibration.redPercent
        })
      };
    })
  };
  const state = saveCartTrackingConfigForClient(db, nextState, clientId);
  return {
    redPercent: calibration.redPercent,
    calibration,
    state
  };
}

function resetCartTrackingHistory(db, { clientId = EINSTEIN_CART_CLIENT_ID, resetConfig = false } = {}) {
  const sensorIds = cartTrackingConfigForClient(db, clientId).carts
    .map((cart) => compactBleSensorId(cart.mac))
    .filter(Boolean);
  const knownSensors = Array.from(new Set([...EINSTEIN_CART_SENSORS.map((sensor) => sensor.sensorId), ...sensorIds]));
  let deletedReadings = 0;
  if (knownSensors.length) {
    const placeholders = knownSensors.map(() => '?').join(',');
    deletedReadings = db.prepare(`DELETE FROM collector_readings WHERE ble_sensor_id IN (${placeholders})`).run(...knownSensors).changes || 0;
  }
  if (resetConfig) {
    saveCartTrackingConfigForClient(db, normalizeCartTrackingConfigState(), clientId);
  }
  return { deletedReadings, resetConfig };
}

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

const PANEL_CLIENT_FALLBACKS = [
  {
    id: 'cliente_einstein',
    nome: 'Hospital Einstein',
    organization: 'Hospital Einstein',
    logo: './assets/einstein-logo.png',
    avatar: './assets/einstein-symbol.png',
    role: 'cart',
    slug: 'einstein'
  }
];

function sanitizePanelUser(user) {
  const { password, password_hash, password_salt, ...safeUser } = user;
  return safeUser;
}

function panelPasswordHash(password, salt = crypto.randomBytes(16).toString('hex')) {
  return {
    salt,
    hash: crypto.scryptSync(String(password || ''), salt, 32).toString('hex')
  };
}

function verifyPanelPassword(user, password) {
  if (user?.password) return user.password === password;
  if (!user?.password_hash || !user?.password_salt) return false;
  const hashed = panelPasswordHash(password, user.password_salt).hash;
  const received = Buffer.from(user.password_hash, 'hex');
  const expected = Buffer.from(hashed, 'hex');
  return received.length === expected.length && crypto.timingSafeEqual(expected, received);
}

function normalizePanelSlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '') || 'usuario';
}

function panelClientDefaults(client) {
  const name = client?.nome || client?.cliente_nome || client?.organization || 'Cliente';
  const fallback = PANEL_CLIENT_FALLBACKS.find((item) => item.id === client?.id)
    || PANEL_CLIENT_FALLBACKS.find((item) => normalizePanelSlug(name).includes(item.slug));
  return {
    id: client?.id || fallback?.id || normalizePanelSlug(name).replace(/\./g, '_'),
    nome: name,
    organization: fallback?.organization || name,
    logo: fallback?.logo || './assets/idsensor-symbol.png',
    avatar: fallback?.avatar || './assets/idsensor-symbol.png',
    role: fallback?.role || 'cart',
    slug: fallback?.slug || normalizePanelSlug(name).split('.').slice(-1)[0] || 'cliente'
  };
}

function panelUsernameFor(name, client) {
  const userSlug = normalizePanelSlug(name);
  const clientSlug = panelClientDefaults(client).slug || normalizePanelSlug(client?.nome);
  return `${userSlug}.${clientSlug}`.toLowerCase();
}

function listPanelClients(db = getDb()) {
  const rows = db.prepare('SELECT id, nome FROM clientes ORDER BY nome ASC').all();
  const clients = [...rows];
  PANEL_CLIENT_FALLBACKS.forEach((fallback) => {
    if (!clients.some((client) => client.id === fallback.id || normalizePanelSlug(client.nome).includes(fallback.slug))) {
      clients.push({ id: fallback.id, nome: fallback.nome });
    }
  });
  return clients.map(panelClientDefaults);
}

function getPanelClient(db, clientId) {
  return listPanelClients(db).find((client) => client.id === clientId) || null;
}

function panelUserFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    displayName: row.display_name,
    organization: row.organization,
    clienteId: row.cliente_id,
    clienteNome: row.cliente_nome,
    logo: row.logo,
    avatar: row.avatar,
    ativo: Boolean(row.ativo),
    permissions: row.role === 'cart' ? { cartOnly: true } : {}
  };
}

function ensureDefaultPanelUsers(db = getDb()) {
  const createdAt = nowIso();
  const einstein = panelClientDefaults({ id: 'cliente_einstein', nome: 'Hospital Einstein' });
  const existing = db.prepare('SELECT id FROM panel_users WHERE username = ?').get('idvida.einstein');
  if (existing) return;
  const password = process.env.PANEL_EINSTEIN_PASSWORD || 'einstein123456';
  const hashed = panelPasswordHash(password);
  db.prepare(`
    INSERT INTO panel_users (
      id, username, password_hash, password_salt, role, display_name, organization,
      cliente_id, cliente_nome, logo, avatar, ativo, criado_em, atualizado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `).run(
    'panel-user-einstein-default',
    'idvida.einstein',
    hashed.hash,
    hashed.salt,
    'cart',
    'Hospital Einstein',
    einstein.organization,
    einstein.id,
    einstein.nome,
    einstein.logo,
    einstein.avatar,
    createdAt,
    createdAt
  );
}

function getPanelUserByUsername(username) {
  const staticUser = PANEL_AUTH_USERS[username];
  if (staticUser?.role === 'master') return staticUser;
  const db = getDb();
  ensureDefaultPanelUsers(db);
  const row = db.prepare('SELECT * FROM panel_users WHERE username = ? AND ativo = 1').get(username);
  return row ? { ...row, ...panelUserFromRow(row) } : null;
}

function createPanelSessionToken(user) {
  const payload = {
    v: 1,
    type: 'panel',
    username: user.username,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + (12 * 60 * 60 * 1000)
  };
  const encodedPayload = encodeTokenPayload(payload);
  return `${encodedPayload}.${signTokenPayload(encodedPayload)}`;
}

function verifyPanelSessionToken(req) {
  const header = String(req?.headers?.authorization || '');
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;
  const expected = signTokenPayload(encodedPayload);
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== receivedBuffer.length) return null;
  if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload?.v !== 1 || payload?.type !== 'panel' || !payload?.username || !payload?.role) return null;
    if (Number(payload.exp || 0) <= Date.now()) return null;
    const user = getPanelUserByUsername(String(payload.username).toLowerCase());
    if (!user || user.role !== payload.role) return null;
    return { ...payload, user };
  } catch {
    return null;
  }
}

function requirePanelMaster(req, res) {
  const session = verifyPanelSessionToken(req);
  if (!session || session.role !== 'master') {
    fail(res, 403, 'Acesso restrito ao usuário master.');
    return null;
  }
  return session;
}

function requirePanelSession(req, res) {
  const session = verifyPanelSessionToken(req);
  if (!session) {
    fail(res, 401, 'Sessao do painel invalida ou expirada.');
    return null;
  }
  return session;
}

function requirePanelCartSession(req, res) {
  const session = requirePanelSession(req, res);
  if (!session) return null;
  if (session.role !== 'master' && session.role !== 'cart') {
    fail(res, 403, 'Acesso restrito ao painel de carrinhos.');
    return null;
  }
  return session;
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

function booleanFromDb(value, fallback = false) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const text = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'sim', 'on'].includes(text)) return true;
  if (['0', 'false', 'no', 'nao', 'não', 'off'].includes(text)) return false;
  return fallback;
}

function normalizeCollectorCalibration(value = {}) {
  const source = value && typeof value === 'object' ? value : {};
  const empty = finiteNumberOrNull(source.emptyDistanceMm ?? source.empty_distance_mm);
  const full = finiteNumberOrNull(source.fullDistanceMm ?? source.full_distance_mm);
  const redPercent = finiteNumberOrNull(source.redPercent ?? source.red_percent);
  const openMarginPercent = finiteNumberOrNull(source.openMarginPercent ?? source.open_margin_percent);
  const openMarginMinMm = finiteNumberOrNull(source.openMarginMinMm ?? source.open_margin_min_mm);
  const confirmationReadings = finiteNumberOrNull(source.confirmationReadings ?? source.confirmation_readings);
  const lidDetectionEnabled = booleanFromDb(
    source.lidDetectionEnabled ?? source.lid_detection_enabled,
    DEFAULT_COLLECTOR_CALIBRATION.lidDetectionEnabled
  );
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
    redPercent: normalizeCollectorCriticalPercent(redPercent),
    openMarginPercent: openMarginPercent !== null
      ? clampNumber(openMarginPercent, 1, 200)
      : DEFAULT_COLLECTOR_CALIBRATION.openMarginPercent,
    openMarginMinMm: openMarginMinMm !== null
      ? Math.max(1, Math.round(openMarginMinMm))
      : DEFAULT_COLLECTOR_CALIBRATION.openMarginMinMm,
    confirmationReadings: confirmationReadings !== null
      ? Math.max(1, Math.round(confirmationReadings))
      : DEFAULT_COLLECTOR_CALIBRATION.confirmationReadings,
    lidDetectionEnabled,
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

  return normalizeCollectorCalibration(row || {});
}

function isCollectorOperationalCalibration(calibration) {
  return Boolean(normalizeCollectorCalibration(calibration).updatedAt);
}

function isCollectorReadingBeforeCalibration(row, calibration) {
  const calibrationMs = new Date(calibration?.updatedAt || '').getTime();
  const readingMs = new Date(row?.created_at || row?.createdAt || '').getTime();
  return Number.isFinite(calibrationMs)
    && Number.isFinite(readingMs)
    && readingMs < calibrationMs;
}

function saveCollectorCalibration(db, bleSensorId, calibration) {
  const sensorId = compactBleSensorId(bleSensorId);
  if (!sensorId) {
    const error = new Error('MAC do sensor inválido.');
    error.statusCode = 400;
    throw error;
  }

  const normalized = normalizeCollectorCalibration(calibration);
  const updatedAt = nowIso();

  db.prepare(`
    INSERT INTO collector_calibrations (
      ble_sensor_id, empty_distance_mm, full_distance_mm, red_percent,
      open_margin_percent, open_margin_min_mm, confirmation_readings,
      lid_detection_enabled, samples_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(ble_sensor_id) DO UPDATE SET
      empty_distance_mm = excluded.empty_distance_mm,
      full_distance_mm = excluded.full_distance_mm,
      red_percent = excluded.red_percent,
      open_margin_percent = excluded.open_margin_percent,
      open_margin_min_mm = excluded.open_margin_min_mm,
      confirmation_readings = excluded.confirmation_readings,
      lid_detection_enabled = excluded.lid_detection_enabled,
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
    normalized.lidDetectionEnabled ? 1 : 0,
    safeJsonStringify(normalized.samples),
    updatedAt
  );

  return {
    ...normalized,
    updatedAt
  };
}

function saveCollectorCriticalPercent(db, bleSensorId, redPercent) {
  const sensorId = compactBleSensorId(bleSensorId);
  if (!sensorId) {
    const error = new Error('MAC do sensor inválido.');
    error.statusCode = 400;
    throw error;
  }

  const current = collectorCalibrationForSensor(db, sensorId);
  const normalized = normalizeCollectorCalibration({
    ...current,
    redPercent
  });
  const updatedAt = current.updatedAt || nowIso();

  db.prepare(`
    INSERT INTO collector_calibrations (
      ble_sensor_id, empty_distance_mm, full_distance_mm, red_percent,
      open_margin_percent, open_margin_min_mm, confirmation_readings,
      lid_detection_enabled, samples_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(ble_sensor_id) DO UPDATE SET
      red_percent = excluded.red_percent
  `).run(
    sensorId,
    normalized.emptyDistanceMm,
    normalized.fullDistanceMm,
    normalized.redPercent,
    normalized.openMarginPercent,
    normalized.openMarginMinMm,
    normalized.confirmationReadings,
    normalized.lidDetectionEnabled ? 1 : 0,
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
  const normalized = normalizeCollectorCalibration(calibration);
  if (!normalized.lidDetectionEnabled) return false;
  const distance = finiteNumberOrNull(distanceMm);
  const openLimit = collectorOpenDistanceLimit(normalized);
  if (distance === null || openLimit === null) return false;
  return distance > openLimit;
}

function deleteCollectorCalibration(db, bleSensorId) {
  const sensorId = compactBleSensorId(bleSensorId);
  if (!sensorId) {
    const error = new Error('MAC do sensor invÃ¡lido.');
    error.statusCode = 400;
    throw error;
  }
  db.prepare('DELETE FROM collector_calibrations WHERE ble_sensor_id = ?').run(sensorId);
  return normalizeCollectorCalibration();
}

function isCollectorSensorRemovedDistance(distanceMm, calibration) {
  const normalized = normalizeCollectorCalibration(calibration);
  if (normalized.lidDetectionEnabled) return false;
  const distance = finiteNumberOrNull(distanceMm);
  const openLimit = collectorOpenDistanceLimit(normalized);
  if (distance === null || openLimit === null) return false;
  return distance > openLimit;
}

function isCollectorObstructedDistance(distanceMm, calibration) {
  const normalized = normalizeCollectorCalibration(calibration);
  if (!normalized.lidDetectionEnabled) return false;
  const distance = finiteNumberOrNull(distanceMm);
  if (distance === null) return false;
  return distance < collectorValidDistanceMin(normalized);
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
  if (!normalized.lidDetectionEnabled && distance < collectorValidDistanceMin(normalized)) return 100;
  if (isCollectorObstructedDistance(distance, normalized)) return null;
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
  if (fill <= CART_STABLE_EMPTY_PERCENT) return COLLECTOR_EMPTY_LEVEL_STATUS;
  if (fill >= criticalPercent) return COLLECTOR_CRITICAL_LEVEL_STATUS;
  return COLLECTOR_NORMAL_LEVEL_STATUS;
}

function collectorStatusForLevel(levelStatus) {
  if (levelStatus === COLLECTOR_CRITICAL_LEVEL_STATUS) return 'critical_confirmed';
  if (levelStatus === COLLECTOR_ATTENTION_LEVEL_STATUS) return 'attention';
  if ([COLLECTOR_EMPTY_LEVEL_STATUS, COLLECTOR_NORMAL_LEVEL_STATUS].includes(levelStatus)) return 'normal';
  return COLLECTOR_CALIBRATION_PENDING_STATUS;
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
  const normalizedCalibration = normalizeCollectorCalibration(calibration);
  const storedStatus = String(row?.status || '').trim().toLowerCase();
  if ([COLLECTOR_UNCALIBRATED_STATUS, COLLECTOR_CALIBRATION_PENDING_STATUS].includes(storedStatus)) {
    return storedStatus;
  }
  if ([COLLECTOR_SENSOR_REMOVED_STATUS, COLLECTOR_SENSOR_OBSTRUCTED_STATUS].includes(storedStatus)) {
    return storedStatus;
  }
  if (!normalizedCalibration.lidDetectionEnabled && storedStatus === COLLECTOR_LID_OPEN_STATUS) {
    return collectorStatusForLevel(collectorLevelForRow(row, fillPercentage, normalizedCalibration));
  }
  if (collectorLidStateForRow(row) === COLLECTOR_LID_OPEN_STATE) return COLLECTOR_LID_OPEN_STATUS;
  return collectorStatusForLevel(collectorLevelForRow(row, fillPercentage, normalizedCalibration));
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

function safeJsonParse(value, fallback = null) {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function gatewayMessageStatusFromRow(row, summary = {}) {
  const summaryStatus = summary?.gatewayStatus && typeof summary.gatewayStatus === 'object'
    ? summary.gatewayStatus
    : null;
  if (summaryStatus) return summaryStatus;

  const storedPayload = safeJsonParse(row?.payload_json, null);
  const rawData = typeof storedPayload?.raw_data === 'string' ? storedPayload.raw_data : null;
  if (rawData) {
    const parsed = parseMokoRawPayload(rawData);
    const parsedStatus = gatewayStatusSummary(parsed?.deviceStatus);
    if (parsedStatus) return parsedStatus;
  }

  const batteryVoltageMv = finiteNumberOrNull(row?.battery_voltage_mv);
  const batteryPercent = finiteNumberOrNull(row?.battery_percent);
  const csq = finiteNumberOrNull(row?.csq);
  const hasStatus = row?.gateway_timestamp || row?.network_type || csq !== null
    || batteryVoltageMv !== null || batteryPercent !== null;
  if (!hasStatus) return null;

  return {
    timestamp: row?.gateway_timestamp || null,
    networkType: row?.network_type || null,
    csq,
    batteryVoltageMv,
    batteryPercent,
    accStatus: null,
    imei: null
  };
}

function serializeGatewayMessage(row) {
  if (!row) return null;
  const summary = safeJsonParse(row.summary_json, {}) || {};
  const result = {
    received: finiteNumberOrNull(row.received) ?? finiteNumberOrNull(summary.received) ?? 0,
    stored: finiteNumberOrNull(row.stored) ?? finiteNumberOrNull(summary.stored) ?? 0,
    ignored: finiteNumberOrNull(row.ignored) ?? finiteNumberOrNull(summary.ignored) ?? 0
  };
  const gatewayStatus = gatewayMessageStatusFromRow(row, summary);
  const gatewayMac = compactBleSensorId(row.gateway_mac || summary.gatewayMac) || null;
  const normalizedSummary = {
    ...summary,
    flag: row.flag || summary.flag || null,
    kind: row.kind || summary.kind || null,
    gatewayMac,
    gatewayStatus,
    received: result.received,
    stored: result.stored,
    ignored: result.ignored
  };

  return {
    id: row.id,
    gatewayMac,
    flag: normalizedSummary.flag,
    kind: normalizedSummary.kind,
    topic: row.topic || null,
    qos: finiteNumberOrNull(row.qos),
    packetId: finiteNumberOrNull(row.packet_id),
    receivedAt: row.received_at || row.created_at || null,
    createdAt: row.created_at || null,
    gatewayStatus,
    gatewayTimestamp: gatewayStatus?.timestamp || row.gateway_timestamp || null,
    result,
    summary: normalizedSummary,
    hasPayload: Boolean(row.payload_json)
  };
}

function saveGatewayMqttMessage(payload, result = {}, meta = {}) {
  const db = getDb();
  const now = nowIso();
  const receivedAt = String(meta.receivedAt || now);
  const summary = meta.summary && typeof meta.summary === 'object'
    ? meta.summary
    : {
      kind: payload?.raw_data ? 'raw_hex' : 'json',
      flag: payload?.flag || null,
      gatewayMac: payload?.gatewayMac || null,
      gatewayStatus: null,
      received: Number(result?.received || 0),
      stored: Number(result?.stored || 0),
      ignored: Number(result?.ignored || 0)
    };
  const gatewayStatus = summary.gatewayStatus && typeof summary.gatewayStatus === 'object'
    ? summary.gatewayStatus
    : null;
  const deviceStatus = payload?.deviceStatus && typeof payload.deviceStatus === 'object'
    ? payload.deviceStatus
    : null;
  const gatewayMac = compactBleSensorId(summary.gatewayMac || payload?.gatewayMac) || null;
  const payloadJson = safeJsonStringify(payload) || '{}';
  const summaryJson = safeJsonStringify(summary) || '{}';
  const deviceStatusJson = deviceStatus ? safeJsonStringify(deviceStatus) : null;
  const row = {
    id: id('gateway_message'),
    gateway_mac: gatewayMac,
    flag: summary.flag || payload?.flag || null,
    kind: summary.kind || (payload?.raw_data ? 'raw_hex' : 'json'),
    topic: meta.topic || null,
    qos: finiteNumberOrNull(meta.qos),
    packet_id: finiteNumberOrNull(meta.packetId),
    payload_json: payloadJson,
    summary_json: summaryJson,
    device_status_json: deviceStatusJson,
    gateway_timestamp: gatewayStatus?.timestamp || null,
    network_type: gatewayStatus?.networkType || deviceStatus?.networkType || deviceStatus?.netwrokType || null,
    csq: finiteNumberOrNull(gatewayStatus?.csq ?? deviceStatus?.csq),
    battery_voltage_mv: finiteNumberOrNull(gatewayStatus?.batteryVoltageMv ?? deviceStatus?.battVoltage),
    battery_percent: finiteNumberOrNull(gatewayStatus?.batteryPercent),
    received: Number(result?.received ?? summary.received ?? 0),
    stored: Number(result?.stored ?? summary.stored ?? 0),
    ignored: Number(result?.ignored ?? summary.ignored ?? 0),
    received_at: receivedAt,
    created_at: now
  };

  db.prepare(`
    INSERT INTO gateway_messages (
      id, gateway_mac, flag, kind, topic, qos, packet_id,
      payload_json, summary_json, device_status_json, gateway_timestamp,
      network_type, csq, battery_voltage_mv, battery_percent,
      received, stored, ignored, received_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.id,
    row.gateway_mac,
    row.flag,
    row.kind,
    row.topic,
    row.qos,
    row.packet_id,
    row.payload_json,
    row.summary_json,
    row.device_status_json,
    row.gateway_timestamp,
    row.network_type,
    row.csq,
    row.battery_voltage_mv,
    row.battery_percent,
    row.received,
    row.stored,
    row.ignored,
    row.received_at,
    row.created_at
  );

  return serializeGatewayMessage(row);
}

function latestGatewayMqttMessage(db, gatewayMac = EINSTEIN_CART_GATEWAY_ID) {
  const compactGatewayMac = compactBleSensorId(gatewayMac);
  const row = compactGatewayMac
    ? db.prepare(`
      SELECT *
      FROM gateway_messages
      WHERE gateway_mac = ?
      ORDER BY received_at DESC
      LIMIT 1
    `).get(compactGatewayMac)
    : db.prepare(`
      SELECT *
      FROM gateway_messages
      ORDER BY received_at DESC
      LIMIT 1
    `).get();
  return serializeGatewayMessage(row);
}

function latestGatewayStatusMessage(db, gatewayMac = EINSTEIN_CART_GATEWAY_ID) {
  const compactGatewayMac = compactBleSensorId(gatewayMac);
  const row = compactGatewayMac
    ? db.prepare(`
      SELECT *
      FROM gateway_messages
      WHERE gateway_mac = ? AND device_status_json IS NOT NULL
      ORDER BY received_at DESC
      LIMIT 1
    `).get(compactGatewayMac)
    : db.prepare(`
      SELECT *
      FROM gateway_messages
      WHERE device_status_json IS NOT NULL
      ORDER BY received_at DESC
      LIMIT 1
    `).get();
  return serializeGatewayMessage(row);
}

function persistedMqttBridgeStatus() {
  const bridgeStatus = getMqttBridgeStatus();
  try {
    const db = getDb();
    const livePayload = bridgeStatus.lastPayload || null;
    const gatewayMac = compactBleSensorId(livePayload?.gatewayMac || EINSTEIN_CART_GATEWAY_ID);
    const latestMessage = latestGatewayMqttMessage(db, gatewayMac);
    const latestGatewayStatus = latestGatewayStatusMessage(db, gatewayMac);
    const liveGatewayStatus = livePayload?.gatewayStatus || null;
    const effectivePayload = liveGatewayStatus
      ? livePayload
      : (latestGatewayStatus?.summary || livePayload || latestMessage?.summary || null);
    const effectiveGatewayStatus = liveGatewayStatus || latestGatewayStatus?.gatewayStatus || null;

    return {
      ...bridgeStatus,
      gatewayMac: livePayload?.gatewayMac || latestGatewayStatus?.gatewayMac || latestMessage?.gatewayMac || null,
      gatewayStatus: effectiveGatewayStatus,
      lastPayload: effectivePayload,
      lastMessageAt: bridgeStatus.lastMessageAt || latestMessage?.receivedAt || latestGatewayStatus?.receivedAt || null,
      lastGatewayStatusAt: latestGatewayStatus?.receivedAt || null,
      lastPersistedMessage: latestMessage,
      lastPersistedGatewayStatus: latestGatewayStatus
    };
  } catch (error) {
    return {
      ...bridgeStatus,
      persistenceError: error.message
    };
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

function isCollectorTechnicalStatus(status) {
  return [
    COLLECTOR_LID_OPEN_STATUS,
    COLLECTOR_SENSOR_REMOVED_STATUS,
    COLLECTOR_SENSOR_OBSTRUCTED_STATUS,
    COLLECTOR_UNCALIBRATED_STATUS,
    COLLECTOR_CALIBRATION_PENDING_STATUS
  ].includes(String(status || '').trim().toLowerCase());
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

function previousCollectorOfficialReading(db, bleSensorId, calibration) {
  if (!bleSensorId) return null;
  const rows = db.prepare(`
    SELECT *
    FROM collector_readings
    WHERE ble_sensor_id = ?
    ORDER BY created_at DESC
    LIMIT 200
  `).all(bleSensorId);

  return rows.find((row) => {
    if (!row || isCollectorReadingBeforeCalibration(row, calibration)) return false;
    if (isCollectorTechnicalStatus(row.status)) return false;
    return normalizeCollectorFillPercentage(row.fill_percentage) !== null;
  }) || null;
}

function serializeCollectorReading(row, calibration = null) {
  const rowCalibration = serializeCollectorCalibration(calibration || row.calibration || {});
  const consecutiveCriticalReadings = Number(row.consecutive_critical_readings || 0);
  const consecutiveLidOpenReadings = Number(row.consecutive_lid_open_readings || 0);
  const consecutiveLidClosedReadings = Number(row.consecutive_lid_closed_readings || 0);
  const consecutiveObstructedReadings = Number(row.consecutive_obstructed_readings || 0);
  const consecutiveSensorRemovedReadings = Number(row.consecutive_sensor_removed_readings || 0);
  const candidateLevelReadings = Number(row.candidate_level_readings || 0);
  const fillPercentage = normalizeCollectorFillPercentage(row.fill_percentage);
  const confirmedLidState = collectorLidStateForRow(row);
  const levelStatus = collectorLevelForRow(row, fillPercentage, rowCalibration);
  const status = collectorStatusForRow(row, fillPercentage, rowCalibration);
  const lidDetectionEnabled = normalizeCollectorCalibration(rowCalibration).lidDetectionEnabled;
  const lidOpen = lidDetectionEnabled
    && ![COLLECTOR_SENSOR_REMOVED_STATUS, COLLECTOR_SENSOR_OBSTRUCTED_STATUS].includes(status)
    && confirmedLidState === COLLECTOR_LID_OPEN_STATE;

  return {
    id: row.id,
    bleSensorId: row.ble_sensor_id,
    mac: formatBleSensorId(row.ble_sensor_id),
    lorawanDeviceId: row.lorawan_device_id,
    lorawanGatewayId: row.lorawan_gateway_id,
    distanceMm: finiteNumberOrNull(row.distance_mm),
    fillPercentage,
    status,
    levelStatus,
    confirmedLidState: lidOpen ? COLLECTOR_LID_OPEN_STATE : COLLECTOR_LID_CLOSED_STATE,
    lidOpen,
    battery: finiteNumberOrNull(row.battery),
    batteryVoltageMv: finiteNumberOrNull(row.battery_voltage_mv),
    rssiBle: finiteNumberOrNull(row.rssi_ble),
    consecutiveCriticalReadings,
    consecutiveLidOpenReadings,
    consecutiveLidClosedReadings,
    consecutiveObstructedReadings,
    consecutiveSensorRemovedReadings,
    candidateLevelStatus: row.candidate_level_status || null,
    candidateLevelReadings,
    candidateFillPercentage: normalizeCollectorFillPercentage(row.candidate_fill_percentage),
    officialReading: Boolean(Number(row.official_reading || 0)),
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
  const hasOperationalCalibration = isCollectorOperationalCalibration(calibration);
  const requiredReadings = Math.max(1, Number(calibration.confirmationReadings || CART_LEVEL_CONFIRM_READINGS));
  let previous = previousCollectorReading(db, bleSensorId);
  if (previous && isCollectorReadingBeforeCalibration(previous, calibration)) {
    previous = null;
  }
  const previousOfficial = previousCollectorOfficialReading(db, bleSensorId, calibration);
  const previousFillPercentage = normalizeCollectorFillPercentage(previousOfficial?.fill_percentage);
  const previousConfirmedFill = previousFillPercentage !== null ? previousFillPercentage : null;
  const previousConfirmedLevel = previousFillPercentage !== null
    ? collectorLevelForRow(previousOfficial, previousFillPercentage, calibration)
    : null;
  const previousLidState = collectorLidStateForRow(previous);
  const previousLidOpenReadings = Number(previous?.consecutive_lid_open_readings || 0);
  const previousLidClosedReadings = Number(previous?.consecutive_lid_closed_readings || 0);
  const previousObstructedReadings = Number(previous?.consecutive_obstructed_readings || 0);
  const previousSensorRemovedReadings = Number(previous?.consecutive_sensor_removed_readings || 0);
  const samePayloadAsPrevious = Boolean(previous) && isSameCollectorPayload(previous, normalizedReading, receivedAt);
  const lidOpenCandidate = hasOperationalCalibration && isCollectorLidOpenDistance(distanceMm, calibration);
  const sensorRemovedCandidate = hasOperationalCalibration && isCollectorSensorRemovedDistance(distanceMm, calibration);
  const sensorObstructedCandidate = hasOperationalCalibration && isCollectorObstructedDistance(distanceMm, calibration);
  const lidClosedCandidate = hasOperationalCalibration && isCollectorLidClosedDistance(distanceMm, calibration);
  const consecutiveObstructedReadings = sensorObstructedCandidate
    ? (samePayloadAsPrevious ? previousObstructedReadings : previousObstructedReadings + 1)
    : 0;
  const consecutiveSensorRemovedReadings = sensorRemovedCandidate
    ? (samePayloadAsPrevious ? previousSensorRemovedReadings : previousSensorRemovedReadings + 1)
    : 0;
  const confirmedObstructed = consecutiveObstructedReadings >= Math.max(1, CART_OBSTRUCTION_CONFIRM_READINGS);
  const confirmedSensorRemoved = consecutiveSensorRemovedReadings >= Math.max(1, CART_SENSOR_REMOVED_CONFIRM_READINGS);
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

  if (!calibration.lidDetectionEnabled || confirmedSensorRemoved || confirmedObstructed) {
    confirmedLidState = COLLECTOR_LID_CLOSED_STATE;
    consecutiveLidOpenReadings = 0;
    consecutiveLidClosedReadings = 0;
  }

  const rawFillPercentage = hasOperationalCalibration
    && !sensorRemovedCandidate
    && !sensorObstructedCandidate
    && !lidOpenCandidate
    ? calculateCollectorFillPercentage(distanceMm, calibration)
    : null;
  const rawLevelStatus = collectorLevelForFillPercentage(rawFillPercentage, calibration);
  const previousCandidateLevel = String(previous?.candidate_level_status || '').trim().toLowerCase();
  const previousCandidateReadings = Number(previous?.candidate_level_readings || 0);
  const previousCandidateFill = normalizeCollectorFillPercentage(previous?.candidate_fill_percentage);
  let candidateLevelStatus = previousCandidateLevel || null;
  let candidateLevelReadings = previousCandidateReadings;
  let candidateFillPercentage = previousCandidateFill;
  let fillPercentage = previousConfirmedFill;
  let confirmedLevelStatus = previousConfirmedLevel;
  let officialReading = false;

  if (rawFillPercentage !== null && rawLevelStatus) {
    const sameConfirmedLevel = previousConfirmedLevel === rawLevelStatus;
    const enteringCritical = rawLevelStatus === COLLECTOR_CRITICAL_LEVEL_STATUS
      && previousConfirmedLevel !== COLLECTOR_CRITICAL_LEVEL_STATUS;
    const requiredReadingsForLevel = enteringCritical
      ? Math.max(requiredReadings, Number(CART_CRITICAL_CONFIRM_READINGS || requiredReadings))
      : requiredReadings;
    const shouldConfirmImmediately = sameConfirmedLevel || !enteringCritical;
    const sameCandidate = previousCandidateLevel === rawLevelStatus;
    const spikeFromCandidate = sameCandidate
      && previousCandidateFill !== null
      && Math.abs(rawFillPercentage - previousCandidateFill) > CART_READING_SPIKE_PERCENT;
    candidateLevelStatus = rawLevelStatus;
    candidateFillPercentage = rawFillPercentage;
    candidateLevelReadings = samePayloadAsPrevious
      ? previousCandidateReadings
      : (sameCandidate && !spikeFromCandidate ? previousCandidateReadings + 1 : 1);

    if (shouldConfirmImmediately || candidateLevelReadings >= requiredReadingsForLevel) {
      fillPercentage = rawFillPercentage;
      confirmedLevelStatus = rawLevelStatus;
      candidateLevelStatus = null;
      candidateLevelReadings = 0;
      candidateFillPercentage = null;
      officialReading = true;
    }
  }

  const confirmedCritical = confirmedLevelStatus === COLLECTOR_CRITICAL_LEVEL_STATUS;
  const criticalCandidate = candidateLevelStatus === COLLECTOR_CRITICAL_LEVEL_STATUS;
  const consecutiveCriticalReadings = criticalCandidate
    ? candidateLevelReadings
    : (confirmedCritical ? Math.max(requiredReadings, Number(previous?.consecutive_critical_readings || 0)) : 0);
  const status = !hasOperationalCalibration
    ? COLLECTOR_UNCALIBRATED_STATUS
    : (confirmedSensorRemoved
      ? COLLECTOR_SENSOR_REMOVED_STATUS
      : (confirmedObstructed
        ? COLLECTOR_SENSOR_OBSTRUCTED_STATUS
        : (confirmedLidState === COLLECTOR_LID_OPEN_STATE
          ? COLLECTOR_LID_OPEN_STATUS
          : collectorStatusForLevel(confirmedLevelStatus))));
  const row = {
    id: id('collector_reading'),
    bleSensorId,
    lorawanDeviceId: normalizedReading.lorawanDeviceId || null,
    lorawanGatewayId: normalizedReading.lorawanGatewayId || null,
    distanceMm,
    fillPercentage,
    status,
    battery: finiteNumberOrNull(normalizedReading.battery),
    batteryVoltageMv: finiteNumberOrNull(normalizedReading.batteryVoltageMv),
    rssiBle: finiteNumberOrNull(normalizedReading.rssiBle),
    consecutiveCriticalReadings,
    consecutiveLidOpenReadings,
    consecutiveLidClosedReadings,
    confirmedLidState,
    confirmedLevelStatus,
    candidateLevelStatus,
    candidateLevelReadings,
    candidateFillPercentage,
    consecutiveObstructedReadings,
    consecutiveSensorRemovedReadings,
    officialReading,
    fPort: finiteNumberOrNull(normalizedReading.fPort),
    rawPayload: normalizedReading.rawPayload || null,
    receivedAt,
    createdAt,
    originalPayloadJson: safeJsonStringify(normalizedReading.originalPayload)
  };

  db.prepare(`
    INSERT INTO collector_readings (
      id, ble_sensor_id, lorawan_device_id, lorawan_gateway_id,
      distance_mm, fill_percentage, status, battery, battery_voltage_mv, rssi_ble,
      consecutive_critical_readings, consecutive_lid_open_readings, consecutive_lid_closed_readings,
      consecutive_obstructed_readings, consecutive_sensor_removed_readings,
      confirmed_lid_state, confirmed_level_status, candidate_level_status, candidate_level_readings,
      candidate_fill_percentage, official_reading, f_port, raw_payload, received_at,
      created_at, original_payload_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.id,
    row.bleSensorId,
    row.lorawanDeviceId,
    row.lorawanGatewayId,
    row.distanceMm,
    row.fillPercentage,
    row.status,
    row.battery,
    row.batteryVoltageMv,
    row.rssiBle,
    row.consecutiveCriticalReadings,
    row.consecutiveLidOpenReadings,
    row.consecutiveLidClosedReadings,
    row.consecutiveObstructedReadings,
    row.consecutiveSensorRemovedReadings,
    row.confirmedLidState,
    row.confirmedLevelStatus,
    row.candidateLevelStatus,
    row.candidateLevelReadings,
    row.candidateFillPercentage,
    row.officialReading ? 1 : 0,
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
    battery_voltage_mv: row.batteryVoltageMv,
    rssi_ble: row.rssiBle,
    consecutive_critical_readings: row.consecutiveCriticalReadings,
    consecutive_lid_open_readings: row.consecutiveLidOpenReadings,
    consecutive_lid_closed_readings: row.consecutiveLidClosedReadings,
    consecutive_obstructed_readings: row.consecutiveObstructedReadings,
    consecutive_sensor_removed_readings: row.consecutiveSensorRemovedReadings,
    confirmed_lid_state: row.confirmedLidState,
    confirmed_level_status: row.confirmedLevelStatus,
    candidate_level_status: row.candidateLevelStatus,
    candidate_level_readings: row.candidateLevelReadings,
    candidate_fill_percentage: row.candidateFillPercentage,
    official_reading: row.officialReading ? 1 : 0,
    f_port: row.fPort,
    raw_payload: row.rawPayload,
    received_at: row.receivedAt,
    created_at: row.createdAt
  }, calibration);
}

function latestCollectorReadings(db, options = {}) {
  const limit = Math.max(1, Math.min(500, Number(options.limit || 200)));
  const macFilters = Array.isArray(options.macFilters) ? options.macFilters.filter(Boolean) : [];

  if (macFilters.length) {
    return macFilters
      .map((sensorId) => db.prepare(`
        SELECT *
        FROM collector_readings
        WHERE ble_sensor_id = ?
        ORDER BY created_at DESC
        LIMIT 1
      `).get(sensorId))
      .filter(Boolean)
      .map((row) => serializeCollectorReading(row, collectorCalibrationForSensor(db, row.ble_sensor_id)));
  }

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
  const limit = Math.max(1, Math.min(10000, Number(options.limit || 100)));
  const macFilters = Array.isArray(options.macFilters) ? options.macFilters.filter(Boolean) : [];

  if (macFilters.length) {
    const perSensorLimit = Math.max(1, Math.ceil(limit / macFilters.length));
    return macFilters
      .flatMap((sensorId) => db.prepare(`
        SELECT *
        FROM collector_readings
        WHERE ble_sensor_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `).all(sensorId, perSensorLimit))
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, limit)
      .map((row) => serializeCollectorReading(row, collectorCalibrationForSensor(db, row.ble_sensor_id)));
  }

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

function operationalReadingsHistory(db, options = {}) {
  const limit = Math.max(1, Math.min(60000, Number(options.limit || 2000)));
  const macFilters = Array.isArray(options.macFilters) && options.macFilters.length
    ? options.macFilters.filter(Boolean)
    : EINSTEIN_CART_SENSORS.map((sensor) => sensor.sensorId);
  const perSensorLimit = Math.max(1, Math.ceil(limit / Math.max(1, macFilters.length)));

  return macFilters
    .flatMap((sensorId) => db.prepare(`
      SELECT *
      FROM collector_readings
      WHERE ble_sensor_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(sensorId, perSensorLimit))
    .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
    .map((row) => serializeCollectorReading(row, collectorCalibrationForSensor(db, row.ble_sensor_id)));
}

function readingTimeIso(reading) {
  return reading?.createdAt || reading?.receivedAt || nowIso();
}

function minutesBetween(startIso, endIso) {
  const start = new Date(startIso || '').getTime();
  const end = new Date(endIso || '').getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  return Math.round((end - start) / 60000);
}

function durationLabelFromMinutes(minutes) {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value < 0) return 'agora';
  if (value < 1) return '<1 min';
  if (value < 60) return `${Math.round(value)} min`;
  const hours = Math.floor(value / 60);
  const rest = Math.round(value % 60);
  return rest ? `${hours}h ${String(rest).padStart(2, '0')}` : `${hours}h`;
}

function operationalEventId(parts) {
  return crypto
    .createHash('sha1')
    .update(parts.filter(Boolean).join('|'))
    .digest('hex')
    .slice(0, 16);
}

function createOperationalTelemetryEvent(event) {
  const ts = event.ts || nowIso();
  const key = event.key || [event.type, event.roomId, event.cartId, ts].join('|');
  return {
    id: `evt-${operationalEventId([key])}`,
    key,
    source: 'backend',
    clientId: EINSTEIN_CART_CLIENT_ID,
    ts,
    type: event.type || 'reading',
    roomId: event.roomId || EINSTEIN_CART_ROOM_ID,
    roomName: event.roomName || EINSTEIN_CART_ROOM_NAME,
    cartId: event.cartId || '',
    cartName: event.cartName || '',
    title: event.title || 'Leitura validada',
    detail: event.detail || '',
    fill: finiteNumberOrNull(event.fill),
    distanceMm: finiteNumberOrNull(event.distanceMm)
  };
}

function createOperationalAlert(alert) {
  const ts = alert.ts || nowIso();
  const type = alert.type || 'critical';
  const key = alert.key || [type, alert.roomId, alert.cartId, ts].join('|');
  return {
    id: `alert-${operationalEventId([key])}`,
    key,
    source: 'backend',
    clientId: EINSTEIN_CART_CLIENT_ID,
    ts,
    type,
    roomId: alert.roomId || EINSTEIN_CART_ROOM_ID,
    roomName: alert.roomName || EINSTEIN_CART_ROOM_NAME,
    cartId: alert.cartId || '',
    cartName: alert.cartName || '',
    title: alert.title || 'Alerta do painel',
    message: alert.message || '',
    detail: alert.detail || '',
    read: false,
    acknowledgedAt: null
  };
}

function dedupeOperationalExchangeEvents(events) {
  return (Array.isArray(events) ? events : [])
    .filter((event) => event && Number.isFinite(Number(event._time)))
    .sort((a, b) => Number(a._time) - Number(b._time))
    .reduce((acc, event) => {
      const duplicate = acc.some((item) => Math.abs(Number(item._time) - Number(event._time)) <= 15 * 60 * 1000);
      if (!duplicate) acc.push(event);
      return acc;
    }, []);
}

function validatedOperationalExchangesFromSamples(samples) {
  const sorted = (Array.isArray(samples) ? samples : [])
    .map((sample) => ({
      ...sample,
      _time: new Date(sample?.ts || 0).getTime()
    }))
    .filter((sample) => sample && sample.cartId && Number.isFinite(sample._time))
    .sort((a, b) => a._time - b._time);

  const exchanges = [];
  let previous = null;
  for (const sample of sorted) {
    if (!previous) {
      previous = sample;
      continue;
    }
    if (sample.cartId === previous.cartId) {
      previous = sample;
      continue;
    }

    const returningOld = sorted.find((item) => item.cartId === previous.cartId && item._time > sample._time) || null;
    const returnGap = returningOld ? returningOld._time - sample._time : null;
    if (returnGap !== null && returnGap <= EINSTEIN_CART_EXCHANGE_MIN_RETURN_MS) {
      previous = sample;
      continue;
    }

    const event = {
      id: `validated-exchange-${previous.cartId}-${sample.cartId}-${sample.ts || sample._time}`,
      key: `validated-exchange|${previous.cartId}|${sample.cartId}|${sample.ts || sample._time}`,
      source: 'backend',
      clientId: EINSTEIN_CART_CLIENT_ID,
      ts: sample.ts || new Date(sample._time).toISOString(),
      _time: sample._time,
      type: 'exchange',
      inferred: true,
      validated: true,
      roomId: sample.roomId || previous.roomId || EINSTEIN_CART_ROOM_ID,
      roomName: sample.roomName || previous.roomName || EINSTEIN_CART_ROOM_NAME,
      cartId: previous.cartId,
      cartName: previous.cartName || previous.cartId,
      enteringCartId: sample.cartId,
      enteringCartName: sample.cartName || sample.cartId,
      title: 'Troca de carrinho validada',
      detail: `${previous.cartName || previous.cartId} saiu; ${sample.cartName || sample.cartId} entrou. ${returningOld ? `${previous.cartName || previous.cartId} voltou depois de ${durationLabelFromMinutes(Math.round(returnGap / 60000))}.` : `${previous.cartName || previous.cartId} ainda não voltou a comunicar.`}`,
      fill: 0,
      distanceMm: finiteNumberOrNull(sample.distanceMm)
    };
    exchanges.push(event);
    previous = sample;
  }

  return dedupeOperationalExchangeEvents(exchanges).map(({ _time, ...event }) => event);
}

function isOfficialOperationalReading(reading) {
  return reading?.officialReading === true || reading?.officialReading === 1;
}

function isCriticalOperationalReading(reading, calibration) {
  const fill = finiteNumberOrNull(reading?.fillPercentage);
  const redPercent = finiteNumberOrNull(calibration?.redPercent) ?? 50;
  return fill !== null && fill >= redPercent;
}

function technicalAlertTypeForReading(reading, calibration = null) {
  const status = String(reading?.status || '').toLowerCase();
  const normalizedCalibration = normalizeCollectorCalibration(calibration || reading?.calibration || {});
  if (status === COLLECTOR_SENSOR_OBSTRUCTED_STATUS) {
    return normalizedCalibration.lidDetectionEnabled ? 'obstruction' : '';
  }
  if (status === COLLECTOR_SENSOR_REMOVED_STATUS) return 'sensor';
  return '';
}

function technicalTitleForAlert(type, cartName) {
  if (type === 'obstruction') return `${cartName}: obstrução provável`;
  if (type === 'sensor') return `${cartName}: sensor fora da calibração`;
  return `${cartName}: evento técnico`;
}

function technicalMessageForAlert(type, roomName, cartName) {
  if (type === 'obstruction') return `${roomName}: possível obstrução no ${cartName}.`;
  if (type === 'sensor') return `${roomName}: sensor do ${cartName} fora da faixa esperada.`;
  return `${roomName}: evento técnico no ${cartName}.`;
}

function einsteinCartOperationalSensors(config) {
  const state = normalizeCartTrackingConfigState(config);
  const roomById = new Map(state.rooms.map((room) => [String(room.id || '').trim(), room]));
  const cartBySensorId = new Map(state.carts
    .map((cart) => [compactBleSensorId(cart.mac), cart])
    .filter(([sensorId]) => sensorId));

  return new Map(EINSTEIN_CART_SENSORS.map((sensor) => {
    const cart = cartBySensorId.get(sensor.sensorId) || null;
    const roomId = String(cart?.roomId || sensor.roomId || EINSTEIN_CART_ROOM_ID).trim();
    const room = roomById.get(roomId) || null;
    const name = String(cart?.name || sensor.name || '').trim() || sensor.name;
    const roomName = String(room?.name || sensor.roomName || EINSTEIN_CART_ROOM_NAME).trim() || EINSTEIN_CART_ROOM_NAME;

    return [sensor.sensorId, {
      ...sensor,
      name,
      roomId,
      roomName
    }];
  }));
}

function buildEinsteinCartOperationalDataset(db, options = {}) {
  const config = cartTrackingConfigForClient(db, EINSTEIN_CART_CLIENT_ID);
  const operationalSensors = einsteinCartOperationalSensors(config);
  const requestedSensors = Array.isArray(options.macFilters) && options.macFilters.length
    ? options.macFilters.filter((sensorId) => operationalSensors.has(sensorId))
    : EINSTEIN_CART_SENSORS.map((sensor) => sensor.sensorId);
  const readings = operationalReadingsHistory(db, {
    limit: options.limit || EINSTEIN_CART_HISTORY_LIMIT,
    macFilters: requestedSensors
  });
  const telemetryEvents = [];
  const alerts = [];
  const samples = [];
  const sensorState = new Map();
  const roomExchangeState = new Map();
  const exchangeCandidates = new Map();

  const appendTelemetry = (event) => telemetryEvents.push(createOperationalTelemetryEvent(event));
  const appendAlert = (alert) => {
    const nextAlert = createOperationalAlert(alert);
    if (!alerts.some((item) => item.key === nextAlert.key)) alerts.push(nextAlert);
    appendTelemetry({
      key: `alert-telemetry|${nextAlert.key}`,
      type: nextAlert.type === 'exchange' ? 'exchange' : 'alert',
      roomId: nextAlert.roomId,
      roomName: nextAlert.roomName,
      cartId: nextAlert.cartId,
      cartName: nextAlert.cartName,
      ts: nextAlert.ts,
      title: nextAlert.title,
      detail: nextAlert.message || nextAlert.detail,
      fill: alert.fill,
      distanceMm: alert.distanceMm
    });
  };
  const readingMs = (value) => {
    const time = new Date(value || '').getTime();
    return Number.isFinite(time) ? time : null;
  };
  const exchangeReadingKey = (reading, sensorId, ts) => [
    reading?.id || '',
    sensorId || '',
    reading?.receivedAt || '',
    ts || ''
  ].join('|');
  const rememberOfficialRoomReading = (roomId, sensorId, ts, reading, fill, distanceMm) => {
    const roomState = roomExchangeState.get(roomId) || {
      activeSensorId: '',
      lastBySensor: new Map()
    };
    roomState.lastBySensor.set(sensorId, { ts, reading, fill, distanceMm });
    if (!roomState.activeSensorId) roomState.activeSensorId = sensorId;
    roomExchangeState.set(roomId, roomState);
    return roomState;
  };
  const appendOfficialExchangeIfConfirmed = ({ sensor, reading, ts, fill, distanceMm }) => {
    const sensorId = sensor.sensorId;
    const roomId = sensor.roomId || EINSTEIN_CART_ROOM_ID;
    const roomName = sensor.roomName || EINSTEIN_CART_ROOM_NAME;
    const roomState = roomExchangeState.get(roomId);
    if (!roomState || !roomState.activeSensorId || roomState.activeSensorId === sensorId) return;

    const oldSensorId = roomState.activeSensorId;
    const oldReading = roomState.lastBySensor.get(oldSensorId);
    const oldSensor = operationalSensors.get(oldSensorId);
    if (!oldReading || !oldSensor) return;

    const currentMs = readingMs(ts);
    const oldMs = readingMs(oldReading.ts);
    if (currentMs === null || oldMs === null) return;

    const candidateKey = `${roomId}|${oldSensorId}|${sensorId}`;
    const currentReadingKey = exchangeReadingKey(reading, sensorId, ts);
    let candidate = exchangeCandidates.get(roomId);
    if (!candidate || candidate.key !== candidateKey) {
      candidate = {
        key: candidateKey,
        oldSensorId,
        newSensorId: sensorId,
        firstSeenAt: ts,
        readings: 0,
        lastReadingKey: ''
      };
    }
    if (candidate.lastReadingKey !== currentReadingKey) {
      candidate.readings += 1;
      candidate.lastReadingKey = currentReadingKey;
    }
    candidate.lastSeenAt = ts;
    exchangeCandidates.set(roomId, candidate);

    if (candidate.readings < EINSTEIN_CART_EXCHANGE_CONFIRM_READINGS) return;
    if (currentMs - oldMs < EINSTEIN_CART_EXCHANGE_OLD_SILENCE_MS) return;

    appendTelemetry({
      key: `exchange|${roomId}|${oldSensor.id}|${sensor.id}|${candidate.firstSeenAt}|${ts}`,
      type: 'exchange',
      roomId,
      roomName,
      cartId: oldSensor.id,
      cartName: oldSensor.name,
      ts,
      title: 'Troca de carrinho registrada',
      detail: `${oldSensor.name} saiu da ${roomName}; ${sensor.name} entrou. ${oldSensor.name} sem comunicaÃ§Ã£o desde ${oldReading.ts}.`,
      fill: 0,
      distanceMm
    });
    roomState.activeSensorId = sensorId;
    exchangeCandidates.delete(roomId);
  };

  for (const reading of readings) {
    const sensorId = compactBleSensorId(reading?.bleSensorId || reading?.mac);
    const sensor = operationalSensors.get(sensorId);
    if (!sensor) continue;

    const ts = readingTimeIso(reading);
    const calibration = normalizeCollectorCalibration(reading.calibration || collectorCalibrationForSensor(db, sensorId));
    const fill = normalizeCollectorFillPercentage(reading.fillPercentage);
    const distanceMm = finiteNumberOrNull(reading.distanceMm);
    const state = sensorState.get(sensorId) || {
      critical: false,
      criticalStartedAt: '',
      lastCriticalAlertAt: '',
      lastTechnicalType: ''
    };
    const technicalType = technicalAlertTypeForReading(reading, calibration);

    if (technicalType && technicalType !== state.lastTechnicalType) {
      appendTelemetry({
        key: `${technicalType}|${sensor.id}|${ts}`,
        type: technicalType,
        roomId: sensor.roomId,
        roomName: sensor.roomName,
        cartId: sensor.id,
        cartName: sensor.name,
        ts,
        title: technicalTitleForAlert(technicalType, sensor.name),
        message: technicalMessageForAlert(technicalType, sensor.roomName, sensor.name),
        detail: technicalType === 'obstruction'
          ? 'Salto de leitura detectado pelo sensor.'
          : 'Verifique a fixação lateral e a calibração.',
        fill,
        distanceMm
      });
    }
    state.lastTechnicalType = technicalType;

    if (!isOfficialOperationalReading(reading) || fill === null) {
      sensorState.set(sensorId, state);
      continue;
    }

    const critical = isCriticalOperationalReading(reading, calibration);
    samples.push({
      source: 'backend',
      clientId: EINSTEIN_CART_CLIENT_ID,
      ts,
      roomId: sensor.roomId,
      roomName: sensor.roomName,
      cartId: sensor.id,
      cartName: sensor.name,
      fill: Math.round(fill),
      distanceMm,
      criticalPercent: calibration.redPercent,
      status: critical ? 'critical' : 'free'
    });
    appendTelemetry({
      key: `reading|${sensor.id}|${ts}`,
      type: critical ? 'critical' : 'reading',
      roomId: sensor.roomId,
      roomName: sensor.roomName,
      cartId: sensor.id,
      cartName: sensor.name,
      ts,
      title: `${sensor.name} - ${critical ? 'Crítico' : 'Livre'}`,
      detail: `Leitura validada: ${Math.round(fill)}%${distanceMm !== null ? ` - ${Math.round(distanceMm)} mm` : ''}.`,
      fill,
      distanceMm
    });
    appendOfficialExchangeIfConfirmed({ sensor, reading, ts, fill, distanceMm });
    rememberOfficialRoomReading(sensor.roomId || EINSTEIN_CART_ROOM_ID, sensorId, ts, reading, fill, distanceMm);

    if (critical) {
      if (!state.critical) {
        state.critical = true;
        state.criticalStartedAt = ts;
        state.lastCriticalAlertAt = '';
      } else {
        const elapsedSinceCriticalStart = minutesBetween(state.criticalStartedAt, ts);
        const elapsedSinceAlert = state.lastCriticalAlertAt ? minutesBetween(state.lastCriticalAlertAt, ts) : null;
        const shouldSendInitialAlert = !state.lastCriticalAlertAt
          && elapsedSinceCriticalStart !== null
          && elapsedSinceCriticalStart * 60000 >= EINSTEIN_CART_CRITICAL_FIRST_ALERT_MS;
        const shouldSendRecurrenceAlert = state.lastCriticalAlertAt
          && elapsedSinceAlert !== null
          && elapsedSinceAlert * 60000 >= EINSTEIN_CART_ALERT_RECURRENCE_MS;
        if (shouldSendInitialAlert || shouldSendRecurrenceAlert) {
          const elapsed = durationLabelFromMinutes(minutesBetween(state.criticalStartedAt, ts));
          state.lastCriticalAlertAt = ts;
          appendAlert({
            key: `${shouldSendInitialAlert ? 'critical' : 'recurrence'}|${sensor.id}|${state.criticalStartedAt}|${ts}`,
            type: shouldSendInitialAlert ? 'critical' : 'recurrence',
            roomId: sensor.roomId,
            roomName: sensor.roomName,
            cartId: sensor.id,
            cartName: sensor.name,
            ts,
            title: shouldSendInitialAlert ? `${sensor.name} crítico` : `${sensor.name} segue crítico`,
            message: `${sensor.roomName}: ${sensor.name} está crítico há ${elapsed}.`,
            detail: `Leitura ${Math.round(fill)}%${distanceMm !== null ? ` - ${Math.round(distanceMm)} mm` : ''}.`,
            fill,
            distanceMm
          });
        }
      }
    } else if (state.critical) {
      const elapsed = durationLabelFromMinutes(minutesBetween(state.criticalStartedAt, ts));
      appendTelemetry({
        key: `critical-normalized|${sensor.id}|${state.criticalStartedAt}|${ts}`,
        type: 'reading',
        roomId: sensor.roomId,
        roomName: sensor.roomName,
        cartId: sensor.id,
        cartName: sensor.name,
        ts,
        title: `${sensor.name} voltou para livre`,
        detail: `${sensor.roomName}: ${sensor.name} voltou para livre. Tempo desde o alerta: ${elapsed}.`,
        fill,
        distanceMm
      });
      state.critical = false;
      state.criticalStartedAt = '';
      state.lastCriticalAlertAt = '';
    }

    sensorState.set(sensorId, state);
  }

  const latestReadings = latestCollectorReadings(db, { macFilters: requestedSensors, limit: requestedSensors.length || 2 });
  const primarySensor = requestedSensors.map((sensorId) => operationalSensors.get(sensorId)).find(Boolean)
    || operationalSensors.values().next().value
    || { roomId: EINSTEIN_CART_ROOM_ID, roomName: EINSTEIN_CART_ROOM_NAME };

  return {
    clientId: EINSTEIN_CART_CLIENT_ID,
    generatedAt: nowIso(),
    room: {
      id: primarySensor.roomId || EINSTEIN_CART_ROOM_ID,
      name: primarySensor.roomName || EINSTEIN_CART_ROOM_NAME
    },
    latestReadings,
    alerts: alerts
      .sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0))
      .slice(0, Math.max(1, Math.min(EINSTEIN_CART_ALERT_LIMIT, Number(options.alertLimit || EINSTEIN_CART_ALERT_LIMIT)))),
    telemetryEvents: telemetryEvents
      .sort((a, b) => new Date(a.ts || 0) - new Date(b.ts || 0))
      .slice(-Math.max(1, Math.min(EINSTEIN_CART_TELEMETRY_LIMIT, Number(options.telemetryLimit || EINSTEIN_CART_TELEMETRY_LIMIT)))),
    chart: {
      samples: samples.slice(-Math.max(1, Math.min(EINSTEIN_CART_SAMPLE_LIMIT, Number(options.sampleLimit || EINSTEIN_CART_SAMPLE_LIMIT)))),
      validatedExchanges: validatedOperationalExchangesFromSamples(samples)
    }
  };
}

function minutesSinceIso(value) {
  const timestamp = new Date(value || '').getTime();
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, Math.round((Date.now() - timestamp) / 60000));
}

function buildEinsteinCartHealth(db) {
  const config = cartTrackingConfigForClient(db, EINSTEIN_CART_CLIENT_ID);
  const mqtt = persistedMqttBridgeStatus();
  const gatewayStatus = mqtt.gatewayStatus || mqtt.lastPayload?.gatewayStatus || null;
  const gatewayLastAt = gatewayStatus?.timestamp || mqtt.lastGatewayStatusAt || mqtt.lastMessageAt || null;
  const latestReadings = latestCollectorReadings(db, {
    macFilters: EINSTEIN_CART_SENSORS.map((sensor) => sensor.sensorId),
    limit: EINSTEIN_CART_SENSORS.length
  });
  const readingBySensor = new Map(latestReadings.map((reading) => [compactBleSensorId(reading.bleSensorId), reading]));
  const cartsBySensor = new Map(config.carts.map((cart) => [compactBleSensorId(cart.mac), cart]));
  const warnings = [];
  const gatewayAgeMinutes = minutesSinceIso(gatewayLastAt);

  if (mqtt.connected !== true) warnings.push('Bridge MQTT do backend desconectado.');
  if (!gatewayLastAt) warnings.push('Gateway ainda sem pacote persistido.');
  if (gatewayAgeMinutes !== null && gatewayAgeMinutes > 60) warnings.push('Gateway sem comunicação recente.');
  if (!config.carts.length) warnings.push('Nenhum carrinho configurado para o Einstein.');

  const sensors = EINSTEIN_CART_SENSORS.map((sensor) => {
    const cart = cartsBySensor.get(sensor.sensorId) || null;
    const reading = readingBySensor.get(sensor.sensorId) || null;
    const calibration = collectorCalibrationForSensor(db, sensor.sensorId);
    const readingAt = reading?.createdAt || reading?.receivedAt || null;
    const readingAgeMinutes = minutesSinceIso(readingAt);

    if (!cart) warnings.push(`${sensor.name} não está no cadastro do Einstein.`);
    if (!calibration.updatedAt) warnings.push(`${sensor.name} sem calibração técnica persistida.`);

    return {
      id: sensor.id,
      name: sensor.name,
      sensorId: sensor.sensorId,
      configured: Boolean(cart),
      calibrated: Boolean(calibration.updatedAt),
      calibrationUpdatedAt: calibration.updatedAt || null,
      lastReadingAt: readingAt,
      lastReadingAgeMinutes: readingAgeMinutes,
      lastStatus: reading?.status || null,
      lastFillPercentage: reading?.fillPercentage ?? null,
      batteryPercent: reading?.battery ?? null,
      batteryVoltageMv: reading?.batteryVoltageMv ?? null
    };
  });

  return {
    clientId: EINSTEIN_CART_CLIENT_ID,
    generatedAt: nowIso(),
    readyForPoc: warnings.length === 0,
    warnings,
    gateway: {
      id: EINSTEIN_CART_GATEWAY_ID,
      connected: mqtt.connected === true,
      lastCommunicationAt: gatewayLastAt,
      lastCommunicationAgeMinutes: gatewayAgeMinutes,
      batteryPercent: gatewayStatus?.batteryPercent ?? null,
      batteryVoltageMv: gatewayStatus?.batteryVoltageMv ?? null,
      networkType: gatewayStatus?.networkType || null,
      csq: gatewayStatus?.csq ?? null,
      persistenceError: mqtt.persistenceError || null
    },
    config: {
      rooms: config.rooms.length,
      carts: config.carts.length,
      alertSettings: config.alertSettings
    },
    sensors
  };
}

function storeBleGatewayPayload(payload, options = {}) {
  const db = getDb();
  const normalizedReadings = normalizeBleGatewayPayloads(payload);
  const readingsToStore = options.requireDistance
    ? normalizedReadings.filter((reading) => finiteNumberOrNull(reading.distanceMm) !== null)
    : normalizedReadings;
  const storedReadings = readingsToStore
    .map((reading) => saveCollectorReading(db, reading))
    .filter(Boolean);

  return {
    received: normalizedReadings.length,
    stored: storedReadings.length,
    ignored: normalizedReadings.length - storedReadings.length,
    readings: storedReadings
  };
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
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
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

  let filePath = safePanelPath(pathname);
  if (!filePath) {
    fail(res, 403, 'Arquivo não autorizado.');
    return true;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
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
  const telemetryOrder = db.dialect === 'postgres'
    ? 'ORDER BY ocorrido_em DESC, id DESC'
    : 'ORDER BY ocorrido_em DESC, rowid DESC';
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
    ${telemetryOrder}
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

function bathroomChecklistError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseJsonObject(value, fallback) {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function normalizeBathroomChoice(value) {
  const bathroom = BATHROOM_BY_ID.get(String(value || '').trim());
  if (!bathroom) throw bathroomChecklistError('Selecione um banheiro válido.');
  return bathroom;
}

function normalizeBathroomChoiceValue(value, allowed, fallback, label) {
  const normalized = String(value || fallback || '').trim();
  if (!allowed.includes(normalized)) {
    throw bathroomChecklistError(`${label} inválido.`);
  }
  return normalized;
}

function normalizeBathroomBoolean(value) {
  return value === true || value === 1 || value === '1' || String(value || '').toLowerCase() === 'sim';
}

function normalizeBathroomNumber(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw bathroomChecklistError(`${label} deve ser um número válido.`);
  }
  return Math.round(number);
}

function normalizeBathroomText(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeBathroomChecklistBody(body = {}) {
  const bathroom = normalizeBathroomChoice(body.bathroom_id || body.bathroomId);
  const condition = body.condition && typeof body.condition === 'object' ? body.condition : {};
  const suppliesInput = body.supplies && typeof body.supplies === 'object' ? body.supplies : {};
  const peopleCount = normalizeBathroomNumber(body.people_count ?? body.peopleCount, 'Quantidade de pessoas');
  const reason = normalizeBathroomChoiceValue(body.reason, BATHROOM_REASONS, '', 'Motivo');
  const cleanLevel = normalizeBathroomChoiceValue(
    condition.clean_level || condition.cleanLevel || body.clean_level,
    BATHROOM_CLEAN_LEVELS,
    'sim',
    'Nível de limpeza'
  );
  const odorLevel = normalizeBathroomChoiceValue(
    condition.odor_level || condition.odorLevel || body.odor_level,
    BATHROOM_ODOR_LEVELS,
    'nao',
    'Nível de odor'
  );

  const conditionJson = {
    clean_level: cleanLevel,
    odor_level: odorLevel,
    piso_molhado: normalizeBathroomBoolean(condition.piso_molhado ?? condition.wetFloor),
    lixeira_cheia: normalizeBathroomBoolean(condition.lixeira_cheia ?? condition.fullTrash),
    vaso_sujo: normalizeBathroomBoolean(condition.vaso_sujo ?? condition.dirtyToilet),
    pia_suja: normalizeBathroomBoolean(condition.pia_suja ?? condition.dirtySink)
  };

  const supplies = {};
  if (reason === 'reposicao' || Object.keys(suppliesInput).length > 0) {
    for (const item of BATHROOM_SUPPLY_ITEMS) {
      supplies[item.key] = normalizeBathroomChoiceValue(
        suppliesInput[item.key],
        BATHROOM_SUPPLY_LEVELS,
        'cheio',
        item.label
      );
    }
  }

  const replenishmentsInput = Array.isArray(body.replenishments) ? body.replenishments : [];
  const replenishments = replenishmentsInput
    .map((entry) => {
      const item = BATHROOM_SUPPLY_ITEM_BY_KEY.get(String(entry?.item || '').trim());
      if (!item) return null;
      const quantity = Number(entry?.quantity || 0);
      if (!Number.isFinite(quantity) || quantity <= 0) return null;
      return {
        item: item.key,
        label: item.label,
        quantity: Math.round(quantity * 100) / 100,
        unit: normalizeBathroomText(entry?.unit, 40) || item.unit
      };
    })
    .filter(Boolean);

  const actionsInput = Array.isArray(body.actions) ? body.actions : [];
  const actions = actionsInput.filter((actionValue) => BATHROOM_ACTIONS.includes(actionValue));
  const finalActions = actions.length ? Array.from(new Set(actions)) : ['nenhuma_acao'];

  return {
    id: id('bathcheck'),
    bathroom,
    peopleCount,
    reason,
    cleanLevel,
    odorLevel,
    conditionJson,
    supplies,
    replenishments,
    actions: finalActions,
    notes: normalizeBathroomText(body.notes || body.observation, 1000),
    responsibleName: normalizeBathroomText(body.responsible_name || body.responsibleName, 160),
    createdAt: nowIso()
  };
}

function bathroomChecklistRowToRecord(row) {
  return {
    id: row.id,
    bathroom_id: row.bathroom_id,
    bathroom_name: row.bathroom_name,
    location_name: row.location_name,
    bathroom_gender: row.bathroom_gender,
    people_count: Number(row.people_count || 0),
    reason: row.reason,
    clean_level: row.clean_level,
    odor_level: row.odor_level,
    condition: parseJsonObject(row.condition_json, {}),
    supplies: parseJsonObject(row.supplies_json, {}),
    replenishments: parseJsonObject(row.replenishments_json, []),
    actions: parseJsonObject(row.actions_json, []),
    notes: row.notes || '',
    responsible_name: row.responsible_name || '',
    created_at: row.created_at
  };
}

function bathroomReportDate(value, endOfDay = false) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const dateText = /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? `${raw}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}-03:00`
    : raw;
  const date = new Date(dateText);
  if (!Number.isFinite(date.getTime())) throw bathroomChecklistError('Período inválido.');
  return date.toISOString();
}

function loadBathroomChecklistRows(query = {}, limit = 5000) {
  const db = getDb();
  const where = [];
  const args = [];
  const from = bathroomReportDate(query.from, false);
  const to = bathroomReportDate(query.to, true);
  if (from) {
    where.push('created_at >= ?');
    args.push(from);
  }
  if (to) {
    where.push('created_at <= ?');
    args.push(to);
  }
  if (query.bathroom_id) {
    const bathroom = normalizeBathroomChoice(query.bathroom_id);
    where.push('bathroom_id = ?');
    args.push(bathroom.id);
  }

  const rows = db.prepare(`
    SELECT *
    FROM bathroom_checklists
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY created_at DESC
    LIMIT ?
  `).all(...args, Math.max(1, Math.min(Number(limit) || 5000, 20000)));

  return rows.map(bathroomChecklistRowToRecord);
}

function averageBathroomPeople(values) {
  const numbers = values.filter((value) => Number.isFinite(value));
  if (!numbers.length) return null;
  return Math.round(numbers.reduce((total, value) => total + value, 0) / numbers.length);
}

function bathroomAlertSuggestion(average) {
  if (!Number.isFinite(average) || average <= 0) return null;
  return Math.max(5, Math.round((average * 0.85) / 5) * 5);
}

function emptyBathroomSupplyTotals() {
  return Object.fromEntries(BATHROOM_SUPPLY_ITEMS.map((item) => [item.key, {
    item: item.key,
    label: item.label,
    unit: item.unit,
    quantity: 0,
    events: 0
  }]));
}

function summarizeBathroomChecklists(records) {
  const overallSupplyTotals = emptyBathroomSupplyTotals();
  const byBathroom = new Map(BATHROOM_CHECKLIST_BATHROOMS.map((bathroom) => [bathroom.id, {
    bathroom,
    checklists: 0,
    people_total: 0,
    action_count: 0,
    cleaning_actions: 0,
    replenishment_events: 0,
    supply_totals: emptyBathroomSupplyTotals(),
    supply_people_by_level: Object.fromEntries(BATHROOM_SUPPLY_ITEMS.map((item) => [item.key, {
      cheio: [],
      medio: [],
      baixo: [],
      vazio: [],
      reposto: []
    }])),
    cleaning_people: {
      parcial: [],
      sujo: [],
      acao_limpeza: []
    }
  }]));

  for (const record of records) {
    const summary = byBathroom.get(record.bathroom_id);
    if (!summary) continue;
    const people = Number(record.people_count || 0);
    const actions = Array.isArray(record.actions) ? record.actions : [];
    const replenishments = Array.isArray(record.replenishments) ? record.replenishments : [];

    summary.checklists += 1;
    summary.people_total += people;
    if (actions.some((actionValue) => actionValue !== 'nenhuma_acao')) summary.action_count += 1;
    if (actions.some((actionValue) => actionValue.includes('limpeza'))) {
      summary.cleaning_actions += 1;
      summary.cleaning_people.acao_limpeza.push(people);
    }
    if (record.clean_level === 'parcial') summary.cleaning_people.parcial.push(people);
    if (record.clean_level === 'nao') summary.cleaning_people.sujo.push(people);

    for (const item of BATHROOM_SUPPLY_ITEMS) {
      const level = record.supplies?.[item.key];
      if (BATHROOM_SUPPLY_LEVELS.includes(level)) {
        summary.supply_people_by_level[item.key][level].push(people);
      }
    }

    for (const replenishment of replenishments) {
      const item = BATHROOM_SUPPLY_ITEM_BY_KEY.get(replenishment.item);
      if (!item) continue;
      const quantity = Number(replenishment.quantity || 0);
      if (!Number.isFinite(quantity) || quantity <= 0) continue;

      summary.replenishment_events += 1;
      summary.supply_totals[item.key].quantity += quantity;
      summary.supply_totals[item.key].events += 1;
      summary.supply_people_by_level[item.key].reposto.push(people);
      overallSupplyTotals[item.key].quantity += quantity;
      overallSupplyTotals[item.key].events += 1;
    }
  }

  const bathroomSummaries = Array.from(byBathroom.values()).map((summary) => {
    const supplyThresholds = {};
    for (const item of BATHROOM_SUPPLY_ITEMS) {
      const levels = summary.supply_people_by_level[item.key];
      const baixo = averageBathroomPeople(levels.baixo);
      const vazio = averageBathroomPeople(levels.vazio);
      const reposto = averageBathroomPeople(levels.reposto);
      const trigger = reposto || vazio || baixo;
      supplyThresholds[item.key] = {
        label: item.label,
        unit: item.unit,
        cheio: averageBathroomPeople(levels.cheio),
        medio: averageBathroomPeople(levels.medio),
        baixo,
        vazio,
        reposto,
        suggested_people: bathroomAlertSuggestion(trigger)
      };
    }

    const cleaningParcial = averageBathroomPeople(summary.cleaning_people.parcial);
    const cleaningDirty = averageBathroomPeople(summary.cleaning_people.sujo);
    const cleaningAction = averageBathroomPeople(summary.cleaning_people.acao_limpeza);
    const cleaningTrigger = cleaningAction || cleaningDirty || cleaningParcial;

    return {
      bathroom: summary.bathroom,
      checklists: summary.checklists,
      people_total: summary.people_total,
      action_count: summary.action_count,
      cleaning_actions: summary.cleaning_actions,
      replenishment_events: summary.replenishment_events,
      supply_totals: Object.values(summary.supply_totals).map((item) => ({
        ...item,
        quantity: Math.round(item.quantity * 100) / 100
      })),
      supply_thresholds: supplyThresholds,
      cleaning_thresholds: {
        parcial: cleaningParcial,
        sujo: cleaningDirty,
        acao_limpeza: cleaningAction,
        suggested_people: bathroomAlertSuggestion(cleaningTrigger)
      }
    };
  });

  const itemRanking = Object.values(overallSupplyTotals)
    .map((item) => ({ ...item, quantity: Math.round(item.quantity * 100) / 100 }))
    .sort((a, b) => b.quantity - a.quantity || b.events - a.events);

  const bathroomRanking = [...bathroomSummaries]
    .sort((a, b) => b.action_count - a.action_count || b.replenishment_events - a.replenishment_events)
    .map((item) => ({
      bathroom: item.bathroom,
      people_total: item.people_total,
      action_count: item.action_count,
      replenishment_events: item.replenishment_events,
      cleaning_actions: item.cleaning_actions
    }));

  return {
    generated_at: nowIso(),
    total_checklists: records.length,
    total_people: records.reduce((total, record) => total + Number(record.people_count || 0), 0),
    total_actions: bathroomSummaries.reduce((total, item) => total + item.action_count, 0),
    total_replenishment_events: bathroomSummaries.reduce((total, item) => total + item.replenishment_events, 0),
    item_ranking: itemRanking,
    bathroom_ranking: bathroomRanking,
    bathrooms: bathroomSummaries
  };
}

addRoute('GET', '/health', async ({ res }) => {
  ok(res, {
    status: 'online',
    datetime: nowIso(),
    version
  });
});

addRoute('GET', '/api/mqtt/status', async ({ res }) => {
  ok(res, persistedMqttBridgeStatus());
});

addRoute('GET', '/api/db/status', async ({ res }) => {
  ok(res, {
    dialect: databaseUrl ? 'postgres' : 'sqlite',
    databaseUrlConfigured: Boolean(databaseUrl)
  });
});

addRoute('GET', '/api/bathroom-checklists/config', async ({ res }) => {
  ok(res, {
    bathrooms: BATHROOM_CHECKLIST_BATHROOMS,
    reasons: BATHROOM_REASONS,
    clean_levels: BATHROOM_CLEAN_LEVELS,
    odor_levels: BATHROOM_ODOR_LEVELS,
    supply_levels: BATHROOM_SUPPLY_LEVELS,
    supply_items: BATHROOM_SUPPLY_ITEMS,
    actions: BATHROOM_ACTIONS,
    server_time: nowIso()
  });
});

addRoute('GET', '/api/bathroom-checklists', async ({ query, res }) => {
  const limit = Math.max(1, Math.min(Number(query.limit || 200), 1000));
  ok(res, loadBathroomChecklistRows(query, limit));
});

addRoute('DELETE', '/api/bathroom-checklists/history', async ({ query, res }) => {
  if (query.confirm !== 'limpar-historico-checklists') {
    return fail(res, 400, 'Confirmação inválida para limpar o histórico.');
  }
  const where = [];
  const args = [];
  const from = bathroomReportDate(query.from, false);
  const to = bathroomReportDate(query.to, true);
  if (from) {
    where.push('created_at >= ?');
    args.push(from);
  }
  if (to) {
    where.push('created_at <= ?');
    args.push(to);
  }
  if (query.bathroom_id) {
    const bathroom = normalizeBathroomChoice(query.bathroom_id);
    where.push('bathroom_id = ?');
    args.push(bathroom.id);
  }

  const deleted = getDb().prepare(`
    DELETE FROM bathroom_checklists
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
  `).run(...args).changes || 0;
  ok(res, {
    deleted,
    cleared_at: nowIso()
  });
});

addRoute('POST', '/api/bathroom-checklists', async ({ body, res }) => {
  const db = getDb();
  const checklist = normalizeBathroomChecklistBody(body);

  db.prepare(`
    INSERT INTO bathroom_checklists (
      id, bathroom_id, bathroom_name, location_name, bathroom_gender,
      people_count, reason, clean_level, odor_level, condition_json,
      supplies_json, replenishments_json, actions_json, notes,
      responsible_name, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    checklist.id,
    checklist.bathroom.id,
    checklist.bathroom.name,
    checklist.bathroom.location,
    checklist.bathroom.gender,
    checklist.peopleCount,
    checklist.reason,
    checklist.cleanLevel,
    checklist.odorLevel,
    JSON.stringify(checklist.conditionJson),
    JSON.stringify(checklist.supplies),
    JSON.stringify(checklist.replenishments),
    JSON.stringify(checklist.actions),
    checklist.notes,
    checklist.responsibleName,
    checklist.createdAt
  );

  const record = db.prepare('SELECT * FROM bathroom_checklists WHERE id = ?').get(checklist.id);
  ok(res, bathroomChecklistRowToRecord(record), 201);
});

addRoute('GET', '/api/bathroom-checklists/report', async ({ query, res }) => {
  const records = loadBathroomChecklistRows(query, 20000);
  ok(res, {
    filters: {
      from: query.from || '',
      to: query.to || '',
      bathroom_id: query.bathroom_id || ''
    },
    report: summarizeBathroomChecklists(records)
  });
});

addRoute('POST', '/api/auth/login', async ({ body, res }) => {
  const username = String(body?.username || '').trim().toLowerCase();
  const password = String(body?.password || '');
  const user = getPanelUserByUsername(username);

  if (!user || !verifyPanelPassword(user, password)) {
    return fail(res, 401, 'Usuário ou senha inválidos.');
  }

  ok(res, { ...sanitizePanelUser(user), token: createPanelSessionToken(user) });
});

addRoute('GET', '/api/panel/clients', async ({ req, res }) => {
  if (!requirePanelMaster(req, res)) return;
  const db = getDb();
  ensureDefaultPanelUsers(db);
  const clients = listPanelClients(db).map((client) => {
    const userCount = db.prepare('SELECT COUNT(*) AS total FROM panel_users WHERE cliente_id = ? AND ativo = 1').get(client.id)?.total || 0;
    return { ...client, userCount };
  });
  ok(res, { clients });
});

addRoute('GET', '/api/panel/users', async ({ req, res }) => {
  if (!requirePanelMaster(req, res)) return;
  const url = new URL(req.url, 'http://local');
  const clientId = String(url.searchParams.get('client_id') || '').trim();
  const db = getDb();
  ensureDefaultPanelUsers(db);
  const rows = clientId
    ? db.prepare('SELECT * FROM panel_users WHERE cliente_id = ? AND ativo = 1 ORDER BY display_name ASC, username ASC').all(clientId)
    : db.prepare('SELECT * FROM panel_users WHERE ativo = 1 ORDER BY cliente_nome ASC, display_name ASC, username ASC').all();
  ok(res, { users: rows.map(panelUserFromRow) });
});

addRoute('POST', '/api/panel/users', async ({ body, req, res }) => {
  if (!requirePanelMaster(req, res)) return;
  const db = getDb();
  ensureDefaultPanelUsers(db);
  const clientId = String(body?.clientId || body?.cliente_id || '').trim();
  const client = getPanelClient(db, clientId);
  if (!client) return fail(res, 400, 'Cliente não encontrado.');

  const displayName = String(body?.displayName || body?.name || '').trim();
  const password = String(body?.password || '');
  if (!displayName) return fail(res, 400, 'Informe o nome do usuário.');
  if (password.length < 6) return fail(res, 400, 'A senha precisa ter pelo menos 6 caracteres.');

  const defaults = panelClientDefaults(client);
  const username = panelUsernameFor(displayName, defaults);
  const existing = db.prepare('SELECT id, ativo FROM panel_users WHERE username = ?').get(username);
  const hashed = panelPasswordHash(password);
  const timestamp = nowIso();

  if (existing?.ativo) {
    return fail(res, 409, 'Já existe um usuário ativo com esse nome para este cliente.');
  }

  if (existing) {
    db.prepare(`
      UPDATE panel_users
      SET password_hash = ?, password_salt = ?, role = ?, display_name = ?, organization = ?,
          cliente_id = ?, cliente_nome = ?, logo = ?, avatar = ?, ativo = 1, atualizado_em = ?
      WHERE id = ?
    `).run(
      hashed.hash,
      hashed.salt,
      defaults.role,
      displayName,
      defaults.organization,
      defaults.id,
      defaults.nome,
      defaults.logo,
      defaults.avatar,
      timestamp,
      existing.id
    );
    const row = db.prepare('SELECT * FROM panel_users WHERE id = ?').get(existing.id);
    return ok(res, panelUserFromRow(row));
  }

  const userId = id('panel_user');
  db.prepare(`
    INSERT INTO panel_users (
      id, username, password_hash, password_salt, role, display_name, organization,
      cliente_id, cliente_nome, logo, avatar, ativo, criado_em, atualizado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `).run(
    userId,
    username,
    hashed.hash,
    hashed.salt,
    defaults.role,
    displayName,
    defaults.organization,
    defaults.id,
    defaults.nome,
    defaults.logo,
    defaults.avatar,
    timestamp,
    timestamp
  );
  const row = db.prepare('SELECT * FROM panel_users WHERE id = ?').get(userId);
  ok(res, panelUserFromRow(row), 201);
});

addRoute('POST', '/api/panel/users/:id/reset-password', async ({ params, body, req, res }) => {
  if (!requirePanelMaster(req, res)) return;
  const password = String(body?.password || '');
  if (password.length < 6) return fail(res, 400, 'A senha precisa ter pelo menos 6 caracteres.');
  const db = getDb();
  ensureDefaultPanelUsers(db);
  const row = db.prepare('SELECT * FROM panel_users WHERE id = ? AND ativo = 1').get(params.id);
  if (!row) return fail(res, 404, 'Usuário não encontrado.');
  const hashed = panelPasswordHash(password);
  db.prepare('UPDATE panel_users SET password_hash = ?, password_salt = ?, atualizado_em = ? WHERE id = ?')
    .run(hashed.hash, hashed.salt, nowIso(), params.id);
  ok(res, panelUserFromRow(db.prepare('SELECT * FROM panel_users WHERE id = ?').get(params.id)));
});

addRoute('POST', '/api/panel/users/:id/delete', async ({ params, req, res }) => {
  if (!requirePanelMaster(req, res)) return;
  const db = getDb();
  ensureDefaultPanelUsers(db);
  const row = db.prepare('SELECT * FROM panel_users WHERE id = ? AND ativo = 1').get(params.id);
  if (!row) return fail(res, 404, 'Usuário não encontrado.');
  db.prepare('UPDATE panel_users SET ativo = 0, atualizado_em = ? WHERE id = ?').run(nowIso(), params.id);
  ok(res, { id: params.id, deleted: true });
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

addRoute('POST', '/api/ble/uplink', async ({ body, res }) => {
  ok(res, storeBleGatewayPayload(body));
});

addRoute('GET', '/api/cart-tracking/config', async ({ req, res }) => {
  const session = requirePanelSession(req, res);
  if (!session) return;
  ok(res, {
    clientId: EINSTEIN_CART_CLIENT_ID,
    state: cartTrackingConfigForClient(getDb(), EINSTEIN_CART_CLIENT_ID)
  });
});

addRoute('PUT', '/api/cart-tracking/alert-settings', async ({ req, body, res }) => {
  const session = requirePanelCartSession(req, res);
  if (!session) return;
  const state = saveCartTrackingAlertSettingsForClient(getDb(), body?.alertSettings || body, EINSTEIN_CART_CLIENT_ID);
  ok(res, {
    clientId: EINSTEIN_CART_CLIENT_ID,
    alertSettings: state.alertSettings,
    state
  });
});

addRoute('PUT', '/api/cart-tracking/config', async ({ req, body, res }) => {
  if (!requirePanelMaster(req, res)) return;
  ok(res, {
    clientId: EINSTEIN_CART_CLIENT_ID,
    state: saveCartTrackingConfigForClient(getDb(), body?.state || body, EINSTEIN_CART_CLIENT_ID)
  });
});

addRoute('PUT', '/api/cart-tracking/critical-limit/:mac', async ({ req, params, body, res }) => {
  const session = requirePanelCartSession(req, res);
  if (!session) return;
  try {
    ok(res, {
      clientId: EINSTEIN_CART_CLIENT_ID,
      ...saveCartTrackingCriticalPercentForClient(
        getDb(),
        params.mac,
        body?.redPercent ?? body?.calibration?.redPercent,
        EINSTEIN_CART_CLIENT_ID
      )
    });
  } catch (error) {
    return fail(res, error.statusCode || 500, error.message || 'Erro ao salvar limite crítico.');
  }
});

addRoute('POST', '/api/cart-tracking/reset-history', async ({ req, body, res }) => {
  if (!requirePanelMaster(req, res)) return;
  ok(res, resetCartTrackingHistory(getDb(), {
    clientId: EINSTEIN_CART_CLIENT_ID,
    resetConfig: body?.resetConfig === true
  }));
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

addRoute('GET', '/api/cart-tracking/operational', async ({ query, res }) => {
  const macFilters = String(query.mac || '')
    .split(',')
    .map(compactBleSensorId)
    .filter(Boolean);

  ok(res, buildEinsteinCartOperationalDataset(getDb(), {
    macFilters,
    limit: query.limit || EINSTEIN_CART_HISTORY_LIMIT,
    alertLimit: query.alertLimit || EINSTEIN_CART_ALERT_LIMIT,
    telemetryLimit: query.telemetryLimit || EINSTEIN_CART_TELEMETRY_LIMIT,
    sampleLimit: query.sampleLimit || EINSTEIN_CART_SAMPLE_LIMIT
  }));
});

addRoute('GET', '/api/cart-tracking/health', async ({ req, res }) => {
  const session = requirePanelCartSession(req, res);
  if (!session) return;
  ok(res, buildEinsteinCartHealth(getDb()));
});

addRoute('GET', '/api/cart-tracking/alerts', async ({ query, res }) => {
  const macFilters = String(query.mac || '')
    .split(',')
    .map(compactBleSensorId)
    .filter(Boolean);
  const dataset = buildEinsteinCartOperationalDataset(getDb(), {
    macFilters,
    limit: query.limit || EINSTEIN_CART_HISTORY_LIMIT,
    alertLimit: query.alertLimit || EINSTEIN_CART_ALERT_LIMIT
  });

  ok(res, {
    clientId: dataset.clientId,
    generatedAt: dataset.generatedAt,
    alerts: dataset.alerts
  });
});

addRoute('GET', '/api/cart-tracking/telemetry', async ({ query, res }) => {
  const macFilters = String(query.mac || '')
    .split(',')
    .map(compactBleSensorId)
    .filter(Boolean);
  const dataset = buildEinsteinCartOperationalDataset(getDb(), {
    macFilters,
    limit: query.limit || EINSTEIN_CART_HISTORY_LIMIT,
    telemetryLimit: query.telemetryLimit || EINSTEIN_CART_TELEMETRY_LIMIT
  });

  ok(res, {
    clientId: dataset.clientId,
    generatedAt: dataset.generatedAt,
    room: dataset.room,
    telemetryEvents: dataset.telemetryEvents
  });
});

addRoute('GET', '/api/cart-tracking/chart', async ({ query, res }) => {
  const macFilters = String(query.mac || '')
    .split(',')
    .map(compactBleSensorId)
    .filter(Boolean);
  const dataset = buildEinsteinCartOperationalDataset(getDb(), {
    macFilters,
    limit: query.limit || EINSTEIN_CART_HISTORY_LIMIT,
    sampleLimit: query.sampleLimit || EINSTEIN_CART_SAMPLE_LIMIT
  });

  ok(res, {
    clientId: dataset.clientId,
    generatedAt: dataset.generatedAt,
    room: dataset.room,
    chart: dataset.chart
  });
});

addRoute('GET', '/relatorios/carrinhos/einstein', async ({ res }) => {
  const dataset = buildEinsteinCartOperationalDataset(getDb(), {
    limit: EINSTEIN_CART_HISTORY_LIMIT,
    alertLimit: EINSTEIN_CART_ALERT_LIMIT,
    telemetryLimit: EINSTEIN_CART_TELEMETRY_LIMIT,
    sampleLimit: EINSTEIN_CART_SAMPLE_LIMIT
  });
  const body = buildCartAnalyticReportHtml(dataset);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
});

addRoute('GET', '/api/cart-tracking/calibration/:mac', async ({ params, res }) => {
  const sensorId = compactBleSensorId(params.mac);
  if (!sensorId) return fail(res, 400, 'MAC do sensor inválido.');

  ok(res, {
    mac: formatBleSensorId(sensorId),
    calibration: collectorCalibrationForSensor(getDb(), sensorId)
  });
});

addRoute('POST', '/api/cart-tracking/calibration/:mac', async ({ req, params, body, res }) => {
  if (!requirePanelMaster(req, res)) return;
  try {
    const db = getDb();
    const sensorId = compactBleSensorId(params.mac);
    const calibration = saveCollectorCalibration(db, sensorId, body?.calibration || body);
    const current = cartTrackingConfigForClient(db, EINSTEIN_CART_CLIENT_ID);
    const nextState = {
      ...current,
      carts: current.carts.map((cart) => (
        compactBleSensorId(cart.mac) === sensorId
          ? { ...cart, calibration }
          : cart
      ))
    };
    ok(res, {
      mac: formatBleSensorId(sensorId),
      calibration,
      state: saveCartTrackingConfigForClient(db, nextState, EINSTEIN_CART_CLIENT_ID)
    });
  } catch (error) {
    return fail(res, error.statusCode || 500, error.message || 'Erro ao salvar calibração.');
  }
});

addRoute('DELETE', '/api/cart-tracking/calibration/:mac', async ({ req, params, res }) => {
  if (!requirePanelMaster(req, res)) return;
  try {
    const db = getDb();
    const sensorId = compactBleSensorId(params.mac);
    const calibration = deleteCollectorCalibration(db, sensorId);
    const current = cartTrackingConfigForClient(db, EINSTEIN_CART_CLIENT_ID);
    const nextState = {
      ...current,
      carts: current.carts.map((cart) => (
        compactBleSensorId(cart.mac) === sensorId
          ? { ...cart, calibration }
          : cart
      ))
    };
    ok(res, {
      mac: formatBleSensorId(sensorId),
      calibration,
      state: saveCartTrackingConfigForClient(db, nextState, EINSTEIN_CART_CLIENT_ID)
    });
  } catch (error) {
    return fail(res, error.statusCode || 500, error.message || 'Erro ao limpar calibracao.');
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
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
  app,
  saveGatewayMqttMessage,
  storeBleGatewayPayload
};
