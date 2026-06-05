const crypto = require('crypto');
const { CLIENTS, UNITS, AREAS, createDevices, createServiceOrders } = require('./seed');
const { resolveTelemetryState, isCycleState, mapManualStateLabel } = require('../utils/status');

const db = {
  clients: CLIENTS,
  units: UNITS,
  areas: AREAS,
  devices: createDevices(),
  nocSessions: new Map(),
  serviceOrders: createServiceOrders(),
  auditEvents: [],
  certificates: {
    byArea: {},
    byDevice: {}
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function toMs(value) {
  const t = Date.parse(value || '');
  return Number.isNaN(t) ? null : t;
}

function getRawDevice(deviceId) {
  const id = Number(deviceId);
  return db.devices.find((item) => Number(item.id) === id) || null;
}

function pushAudit(device, event) {
  const entry = {
    scope: event.scope || 'status',
    field: event.field || 'Atualizacao',
    user: event.user || 'Sistema',
    when: event.when || nowIso(),
    description: event.description || 'Atualizacao registrada.'
  };

  device.auditLog = Array.isArray(device.auditLog) ? device.auditLog : [];
  device.auditLog.unshift(entry);

  db.auditEvents.unshift({
    deviceId: device.id,
    ...entry
  });

  if (db.auditEvents.length > 2000) {
    db.auditEvents.length = 2000;
  }

  return entry;
}

function expireCycleIfNeeded(device) {
  if (!device || !device.statusCycle) return;
  const end = toMs(device.statusCycle.activeUntil);
  if (!end) {
    device.statusCycle = null;
    return;
  }

  if (Date.now() >= end) {
    const previousState = device.statusCycle.state;
    device.statusCycle = null;
    pushAudit(device, {
      scope: 'status',
      field: 'Encerramento automatico de ciclo',
      description: `Ciclo ${previousState} encerrado automaticamente.`
    });
  }
}

function toDeviceView(rawDevice) {
  if (!rawDevice) return null;

  expireCycleIfNeeded(rawDevice);

  const telemetry = resolveTelemetryState(rawDevice);
  let state = telemetry.state;
  let status = telemetry.status;
  let timerLabel = telemetry.timerLabel;
  let timer = telemetry.timer;
  let statusCycle = null;

  if (rawDevice.statusCycle && isCycleState(rawDevice.statusCycle.state)) {
    statusCycle = clone(rawDevice.statusCycle);
    state = rawDevice.statusCycle.state;
    status = mapManualStateLabel(rawDevice.statusCycle.state);
    timerLabel = `${status} por tempo determinado`;
    timer = 0;
  }

  return {
    ...clone(rawDevice),
    state,
    status,
    timerLabel,
    timer,
    statusCycle,
    telemetryResolvedState: telemetry.state,
    telemetryResolvedStatus: telemetry.status,
    updatedAt: rawDevice.lastUpdateAt || nowIso()
  };
}

function listDevices(query = {}) {
  const {
    areaId,
    status,
    search,
    page = 1,
    pageSize = 24,
    clientId,
    unitId
  } = query;

  let items = db.devices.map(toDeviceView);

  if (clientId) {
    items = items.filter((d) => d.clientId === clientId);
  }

  if (unitId) {
    items = items.filter((d) => d.unitId === unitId);
  }

  if (areaId) {
    items = items.filter((d) => d.areaId === areaId);
  }

  if (status) {
    if (status === 'offline') {
      items = items.filter((d) => d.online === false && d.state !== 'maint');
    } else {
      items = items.filter((d) => d.state === status || d.status === status);
    }
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    items = items.filter((d) => {
      const fields = [
        d.name,
        d.code,
        d.mac,
        d.areaName,
        String(d.id),
        `geladeira ${d.id}`
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());

      return fields.some((f) => f.includes(q));
    });
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Math.min(200, Number(pageSize) || 24));

  const total = items.length;
  const start = (safePage - 1) * safePageSize;
  const paged = items.slice(start, start + safePageSize);

  return {
    items: paged,
    page: safePage,
    pageSize: safePageSize,
    total
  };
}

function getDeviceById(deviceId) {
  const raw = getRawDevice(deviceId);
  if (!raw) return null;
  return toDeviceView(raw);
}

function getDeviceTelemetry(deviceId, query = {}) {
  const device = getDeviceById(deviceId);
  if (!device) return null;

  const period = String(query.period || 'daily');
  const points = Array.isArray(device.chart) && device.chart.length ? device.chart : [5, 5, 5, 5, 5, 5];

  const labels = {
    daily: ['00h','02h','04h','06h','08h','10h','12h','14h','16h','18h','20h','22h'],
    weekly: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    monthly: ['S1', 'S2', 'S3', 'S4'],
    custom: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7']
  };

  const selectedLabels = labels[period] || labels.daily;

  const telemetryPoints = selectedLabels.map((label, index) => {
    const value = points[index % points.length];
    return {
      label,
      temp: Number(value)
    };
  });

  return {
    deviceId: device.id,
    period,
    start: query.start || null,
    end: query.end || null,
    min: Math.min(...telemetryPoints.map((p) => p.temp)),
    max: Math.max(...telemetryPoints.map((p) => p.temp)),
    points: telemetryPoints
  };
}

function applyStatusCycle(deviceId, payload = {}, user = 'Sistema') {
  const raw = getRawDevice(deviceId);
  if (!raw) return null;

  const state = String(payload.state || '').trim();
  const durationMinutes = Number(payload.durationMinutes);

  if (!isCycleState(state)) {
    return { error: 'state_invalido' };
  }

  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return { error: 'duracao_invalida' };
  }

  const previous = resolveTelemetryState(raw);

  const startedAt = nowIso();
  const activeUntil = new Date(Date.now() + (durationMinutes * 60 * 1000)).toISOString();

  raw.statusCycle = {
    state,
    reason: payload.reason || null,
    startedAt,
    activeUntil,
    previousState: previous.state,
    previousStatus: previous.status
  };

  raw.lastUpdateAt = nowIso();

  pushAudit(raw, {
    scope: 'status',
    field: 'Status do dispositivo',
    user,
    description: `Status alterado para ${state} por ${durationMinutes} minutos.`
  });

  return toDeviceView(raw);
}

function closeStatusCycle(deviceId, user = 'Sistema') {
  const raw = getRawDevice(deviceId);
  if (!raw) return null;

  if (!raw.statusCycle) {
    return { error: 'ciclo_nao_ativo' };
  }

  const previousState = raw.statusCycle.state;
  raw.statusCycle = null;
  raw.lastUpdateAt = nowIso();

  pushAudit(raw, {
    scope: 'status',
    field: 'Encerramento de ciclo',
    user,
    description: `Ciclo ${previousState} encerrado manualmente.`
  });

  return toDeviceView(raw);
}

function getStatusCycle(deviceId) {
  const raw = getRawDevice(deviceId);
  if (!raw) return null;
  expireCycleIfNeeded(raw);
  return raw.statusCycle ? clone(raw.statusCycle) : null;
}

function getDeviceAudit(deviceId) {
  const raw = getRawDevice(deviceId);
  if (!raw) return null;
  return clone(raw.auditLog || []);
}

function addAuditEvent(payload = {}) {
  const raw = getRawDevice(payload.deviceId);
  if (!raw) return { error: 'device_nao_encontrado' };

  const entry = pushAudit(raw, {
    scope: payload.scope,
    field: payload.field,
    user: payload.user || 'API',
    when: payload.when,
    description: payload.description
  });

  raw.lastUpdateAt = nowIso();

  return entry;
}

function createNocSession(payload = {}) {
  const id = crypto.randomUUID();
  const session = {
    id,
    mode: String(payload.mode || 'area'),
    filters: Array.isArray(payload.filters) && payload.filters.length ? payload.filters : ['all'],
    scope: payload.scope || {},
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  db.nocSessions.set(id, session);
  return clone(session);
}

function getNocSession(id) {
  const session = db.nocSessions.get(id);
  return session ? clone(session) : null;
}

function updateNocSession(id, patch = {}) {
  const session = db.nocSessions.get(id);
  if (!session) return null;

  if (patch.mode) session.mode = patch.mode;
  if (Array.isArray(patch.filters) && patch.filters.length) session.filters = patch.filters;
  if (patch.scope) session.scope = patch.scope;
  session.updatedAt = nowIso();

  db.nocSessions.set(id, session);
  return clone(session);
}

function listClients() {
  return clone(db.clients);
}

function listUnits(clientId) {
  const data = clientId ? db.units.filter((unit) => unit.clientId === clientId) : db.units;
  return clone(data);
}

function listAreas(query = {}) {
  const { unitId, clientId } = query;
  let data = db.areas;

  if (unitId) data = data.filter((area) => area.unitId === unitId);
  if (clientId) data = data.filter((area) => area.clientId === clientId);

  return clone(data);
}

function listServiceOrders(query = {}) {
  let data = db.serviceOrders;
  if (query.status) data = data.filter((item) => item.status === query.status);
  if (query.type) data = data.filter((item) => item.type === query.type);
  return clone(data);
}

function createServiceOrder(payload = {}) {
  const id = `SO-${String(db.serviceOrders.length + 1).padStart(4, '0')}`;
  const order = {
    id,
    type: payload.type || 'orcamento',
    status: payload.status || 'em_analise',
    requester: payload.requester || 'Sistema',
    areaId: payload.areaId || null,
    deviceId: payload.deviceId || null,
    note: payload.note || '',
    createdAt: nowIso()
  };

  db.serviceOrders.unshift(order);
  return clone(order);
}

function getCertificates(areaId) {
  const byArea = db.certificates.byArea;
  if (!areaId) return clone(byArea);
  return clone(byArea[areaId] || { enabled: true, updatedAt: null });
}

function setAreaCertificate(areaId, payload = {}) {
  db.certificates.byArea[areaId] = {
    enabled: payload.enabled !== false,
    updatedAt: nowIso(),
    updatedBy: payload.user || 'API'
  };

  return clone(db.certificates.byArea[areaId]);
}

function setDeviceCertificate(deviceId, payload = {}) {
  const id = Number(deviceId);
  db.certificates.byDevice[id] = {
    enabled: payload.enabled !== false,
    fileName: payload.fileName || null,
    updatedAt: nowIso(),
    updatedBy: payload.user || 'API'
  };

  return clone(db.certificates.byDevice[id]);
}

function getDbSnapshot() {
  return {
    clients: listClients(),
    units: listUnits(),
    areas: listAreas(),
    devices: db.devices.map(toDeviceView),
    nocSessions: Array.from(db.nocSessions.values()).map(clone),
    serviceOrders: listServiceOrders()
  };
}

module.exports = {
  listClients,
  listUnits,
  listAreas,
  listDevices,
  getDeviceById,
  getDeviceTelemetry,
  applyStatusCycle,
  closeStatusCycle,
  getStatusCycle,
  getDeviceAudit,
  addAuditEvent,
  createNocSession,
  getNocSession,
  updateNocSession,
  listServiceOrders,
  createServiceOrder,
  getCertificates,
  setAreaCertificate,
  setDeviceCertificate,
  getDbSnapshot
};
