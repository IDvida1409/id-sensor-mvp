const express = require('express');
const store = require('./data/store');
const { matchesFilters, describeOccurrence } = require('./utils/occurrence');
const {
  buildHealthSummary,
  buildContractSummary,
  buildOperationalStatus,
  buildDrillTree
} = require('./utils/management');

const app = express();
app.use(express.json());

function ok(res, data) {
  return res.status(200).json({ status: 'ok', data });
}

function badRequest(res, message, details) {
  return res.status(400).json({ status: 'error', message, details: details || null });
}

function notFound(res, message) {
  return res.status(404).json({ status: 'error', message });
}

function parseFilters(value) {
  if (!value) return ['all'];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function filterOccurrences(devices, filters) {
  return devices.filter((device) => matchesFilters(device, filters));
}

function aggregateRotations(devices) {
  const map = new Map();

  devices.forEach((device) => {
    const occurrences = describeOccurrence(device);
    occurrences.forEach((occ) => {
      if (!map.has(occ.key)) {
        map.set(occ.key, {
          key: occ.key,
          text: occ.text,
          severity: occ.severity,
          count: 0,
          visibleIds: []
        });
      }

      const current = map.get(occ.key);
      current.count += occ.count;
      current.visibleIds.push(device.id);
      map.set(occ.key, current);
    });
  });

  return Array.from(map.values()).map((item) => ({
    ...item,
    visibleIds: [...new Set(item.visibleIds)]
  }));
}

function buildNocCards(devices, mode) {
  if (mode === 'device') {
    return devices.map((device) => ({
      key: `device_${device.id}`,
      title: device.name,
      deviceId: device.id,
      count: 1,
      rotations: describeOccurrence(device).map((item) => ({
        ...item,
        visibleIds: [device.id]
      }))
    })).filter((item) => item.rotations.length > 0);
  }

  if (mode === 'client') {
    const byClient = new Map();

    devices.forEach((device) => {
      if (!byClient.has(device.clientId)) {
        byClient.set(device.clientId, []);
      }
      byClient.get(device.clientId).push(device);
    });

    return Array.from(byClient.entries()).map(([clientId, list]) => ({
      key: `client_${clientId}`,
      title: list[0].clientId === 'h1' ? 'Laboratorio IDvida' : clientId,
      count: list.length,
      rotations: aggregateRotations(list)
    }));
  }

  // area (default)
  const byArea = new Map();
  devices.forEach((device) => {
    if (!byArea.has(device.areaId)) {
      byArea.set(device.areaId, []);
    }
    byArea.get(device.areaId).push(device);
  });

  return Array.from(byArea.entries()).map(([areaId, list]) => ({
    key: `area_${areaId}`,
    title: list[0].areaName,
    count: list.length,
    rotations: aggregateRotations(list)
  }));
}

app.get('/api/v1/health', (req, res) => {
  return ok(res, {
    service: 'painel-iot-backend-api',
    up: true,
    now: new Date().toISOString()
  });
});

app.get('/api/v1/session/me', (req, res) => {
  return ok(res, {
    userId: 'master-demo',
    name: 'Lab IDvida',
    role: 'master',
    rolesAvailable: ['master', 'admin1', 'admin2', 'area']
  });
});

app.get('/api/v1/permissions', (req, res) => {
  return ok(res, {
    roleMatrix: {
      master: {
        canViewClient: true,
        canUseBatteryFilter: true,
        canOpenManagement: true
      },
      admin1: {
        canViewClient: false,
        canUseBatteryFilter: true,
        canOpenManagement: true
      },
      admin2: {
        canViewClient: false,
        canUseBatteryFilter: true,
        canOpenManagement: true
      },
      area: {
        canViewClient: false,
        canUseBatteryFilter: false,
        canOpenManagement: false
      }
    }
  });
});

app.get('/api/v1/clients', (req, res) => ok(res, store.listClients()));

app.get('/api/v1/units', (req, res) => ok(res, store.listUnits(req.query.clientId)));

app.get('/api/v1/areas', (req, res) => ok(res, store.listAreas(req.query)));

app.get('/api/v1/devices', (req, res) => {
  const result = store.listDevices(req.query);
  return ok(res, result);
});

app.get('/api/v1/devices/:deviceId', (req, res) => {
  const device = store.getDeviceById(req.params.deviceId);
  if (!device) return notFound(res, 'Dispositivo nao encontrado.');
  return ok(res, device);
});

app.get('/api/v1/devices/:deviceId/telemetry', (req, res) => {
  const telemetry = store.getDeviceTelemetry(req.params.deviceId, req.query);
  if (!telemetry) return notFound(res, 'Dispositivo nao encontrado para telemetria.');
  return ok(res, telemetry);
});

app.post('/api/v1/devices/:deviceId/status-cycle', (req, res) => {
  const user = req.body.user || 'API';
  const result = store.applyStatusCycle(req.params.deviceId, req.body, user);

  if (!result) return notFound(res, 'Dispositivo nao encontrado.');
  if (result.error === 'state_invalido') return badRequest(res, 'State invalido. Use: maint, inventory, defrost ou restock.');
  if (result.error === 'duracao_invalida') return badRequest(res, 'durationMinutes invalido. Informe um numero positivo.');

  return ok(res, result);
});

app.post('/api/v1/devices/:deviceId/status-cycle/close', (req, res) => {
  const user = req.body.user || 'API';
  const result = store.closeStatusCycle(req.params.deviceId, user);

  if (!result) return notFound(res, 'Dispositivo nao encontrado.');
  if (result.error === 'ciclo_nao_ativo') return badRequest(res, 'Nao existe ciclo ativo para encerrar.');

  return ok(res, result);
});

app.get('/api/v1/devices/:deviceId/status-cycle', (req, res) => {
  const cycle = store.getStatusCycle(req.params.deviceId);
  if (cycle === null && !store.getDeviceById(req.params.deviceId)) {
    return notFound(res, 'Dispositivo nao encontrado.');
  }

  return ok(res, {
    active: !!cycle,
    cycle: cycle || null
  });
});

app.get('/api/v1/management/health', (req, res) => {
  const devices = store.listDevices(req.query).items;
  return ok(res, buildHealthSummary(devices));
});

app.get('/api/v1/management/contracts', (req, res) => {
  const devices = store.listDevices(req.query).items;
  return ok(res, buildContractSummary(devices));
});

app.get('/api/v1/management/operational-status', (req, res) => {
  const devices = store.listDevices(req.query).items;
  return ok(res, buildOperationalStatus(devices));
});

app.get('/api/v1/management/drill/:type', (req, res) => {
  const type = String(req.params.type || '').toLowerCase();
  const valid = ['health', 'contracts', 'operational-status'];
  if (!valid.includes(type)) {
    return badRequest(res, 'Tipo de drill invalido.', { allowed: valid });
  }

  const devices = store.listDevices(req.query).items;
  const mapType = type === 'operational-status' ? 'operational' : type;
  return ok(res, {
    type,
    scope: req.query.scope || 'client',
    nodes: buildDrillTree(mapType, devices)
  });
});

app.post('/api/v1/noc/sessions', (req, res) => {
  const payload = {
    mode: req.body.mode || 'area',
    filters: parseFilters(req.body.filters || ['all']),
    scope: req.body.scope || {}
  };

  const session = store.createNocSession(payload);
  return ok(res, session);
});

app.get('/api/v1/noc/sessions/:sessionId/occurrences', (req, res) => {
  const session = store.getNocSession(req.params.sessionId);
  if (!session) return notFound(res, 'Sessao NOC nao encontrada.');

  const devices = store.listDevices({ pageSize: 500 }).items;
  const filtered = filterOccurrences(devices, session.filters);
  const cards = buildNocCards(filtered, session.mode);

  return ok(res, {
    session,
    count: filtered.length,
    cards
  });
});

app.get('/api/v1/noc/occurrences/live', (req, res) => {
  const mode = req.query.mode || 'area';
  const filters = parseFilters(req.query.filters || 'all');

  const devices = store.listDevices({ pageSize: 500 }).items;
  const filtered = filterOccurrences(devices, filters);
  const cards = buildNocCards(filtered, mode);

  return ok(res, {
    mode,
    filters,
    count: filtered.length,
    cards
  });
});

app.post('/api/v1/noc/sessions/:sessionId/ack', (req, res) => {
  const session = store.updateNocSession(req.params.sessionId, {
    filters: parseFilters(req.body.filters || ['all']),
    mode: req.body.mode,
    scope: req.body.scope
  });

  if (!session) return notFound(res, 'Sessao NOC nao encontrada.');
  return ok(res, session);
});

app.get('/api/v1/devices/:deviceId/audit', (req, res) => {
  const entries = store.getDeviceAudit(req.params.deviceId);
  if (!entries) return notFound(res, 'Dispositivo nao encontrado.');
  return ok(res, {
    deviceId: Number(req.params.deviceId),
    entries
  });
});

app.post('/api/v1/audit/events', (req, res) => {
  const result = store.addAuditEvent(req.body || {});
  if (result.error === 'device_nao_encontrado') {
    return notFound(res, 'Dispositivo nao encontrado para auditoria.');
  }
  return ok(res, result);
});

app.get('/api/v1/config/certificates', (req, res) => {
  return ok(res, {
    areaId: req.query.areaId || null,
    data: store.getCertificates(req.query.areaId)
  });
});

app.patch('/api/v1/config/areas/:areaId/certificates', (req, res) => {
  const result = store.setAreaCertificate(req.params.areaId, req.body || {});
  return ok(res, result);
});

app.patch('/api/v1/config/devices/:deviceId/certificates', (req, res) => {
  const result = store.setDeviceCertificate(req.params.deviceId, req.body || {});
  return ok(res, result);
});

app.post('/api/v1/config/devices/:deviceId/certificate-file', (req, res) => {
  const payload = {
    enabled: true,
    fileName: req.body.fileName || null,
    user: req.body.user || 'API'
  };
  const result = store.setDeviceCertificate(req.params.deviceId, payload);
  return ok(res, result);
});

app.post('/api/v1/service-orders', (req, res) => {
  const order = store.createServiceOrder(req.body || {});
  return ok(res, order);
});

app.get('/api/v1/service-orders', (req, res) => {
  return ok(res, store.listServiceOrders(req.query));
});

app.get('/api/v1/debug/snapshot', (req, res) => {
  return ok(res, store.getDbSnapshot());
});

app.use((req, res) => {
  return res.status(404).json({
    status: 'error',
    message: 'Rota nao encontrada.',
    path: req.originalUrl
  });
});

module.exports = app;
