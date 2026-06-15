const { id } = require('../utils/ids');
const { buildDeviceCard } = require('./deviceCard');
const { alertMessageForStatus } = require('./alertText');
const { sendExpoPush } = require('./pushService');

const DEFAULT_INTERVAL_MS = 10000;
const FIRST_EVENT_AFTER_MS = 2 * 60 * 1000;
const CRITICAL_EVENT_AFTER_MS = 4 * 60 * 1000;

const SIMULATION_PLAN = {
  warnOnly: new Set([3, 8, 11, 14, 17]),
  critical: new Set([6, 12, 20]),
  offline: new Set([4, 15])
};

const WARNING_TEMPERATURES = new Map([
  [3, 8.4],
  [6, 8.6],
  [8, 8.7],
  [11, 1.8],
  [12, 1.7],
  [14, 8.5],
  [17, 1.6],
  [20, 8.9]
]);

const CRITICAL_TEMPERATURES = new Map([
  [6, 14.0],
  [12, -4.0],
  [20, 14.0]
]);

function nowIso() {
  return new Date().toISOString();
}

function visualId(row) {
  const fromQr = String(row.qr_code || '').match(/(\d+)$/);
  if (fromQr) return Number(fromQr[1]);
  const fromName = String(row.nome || '').match(/(\d+)$/);
  return fromName ? Number(fromName[1]) : 1;
}

function normalTemp(number) {
  const values = [5.4, 3.2, 5.1, 4.8, 6.2, 7.4, 4.7, 5.9, 6.1, 2.8, 5.6, 6.8];
  return values[(number - 1) % values.length];
}

function baselineChart(temp) {
  return [
    temp - 0.2,
    temp - 0.1,
    temp,
    temp + 0.1,
    temp,
    temp - 0.1,
    temp,
    temp + 0.1,
    temp + 0.2,
    temp + 0.1,
    temp,
    temp
  ].map((value) => Number(value.toFixed(1)));
}

function chartWith(row, temp) {
  let chart = [];
  try {
    chart = JSON.parse(row.chart_json || '[]');
  } catch {
    chart = [];
  }

  if (!Array.isArray(chart)) chart = [];
  const next = temp === null || temp === undefined ? normalTemp(visualId(row)) : Number(temp);
  return JSON.stringify([...chart.slice(-11), Number(next.toFixed(1))]);
}

function ensureSimulationState(db) {
  const current = db.prepare("SELECT * FROM simulation_state WHERE id = 'main'").get();
  if (current) return current;

  const createdAt = nowIso();

  db.prepare(`
    INSERT INTO simulation_state (
      id, enabled, step, interval_ms, started_at, last_tick_at, updated_em
    ) VALUES ('main', 0, 0, ?, NULL, NULL, ?)
  `).run(DEFAULT_INTERVAL_MS, createdAt);

  return db.prepare("SELECT * FROM simulation_state WHERE id = 'main'").get();
}

function getSimulationState(db) {
  return ensureSimulationState(db);
}

function serializeSimulationState(state) {
  const startedAt = state.started_at ? Date.parse(state.started_at) : 0;
  const elapsedMs = state.enabled && startedAt ? Math.max(0, Date.now() - startedAt) : 0;
  const nextEventInMs = !state.enabled
    ? null
    : Math.max(0, (Number(state.step || 0) < 1 ? FIRST_EVENT_AFTER_MS : CRITICAL_EVENT_AFTER_MS) - elapsedMs);

  return {
    enabled: !!state.enabled,
    step: Number(state.step || 0),
    stage: Number(state.step || 0),
    stage_label: Number(state.step || 0) >= 2
      ? 'critico'
      : (Number(state.step || 0) === 1 ? 'atencao' : 'aguardando'),
    interval_ms: Number(state.interval_ms || DEFAULT_INTERVAL_MS),
    first_event_after_ms: FIRST_EVENT_AFTER_MS,
    critical_event_after_ms: CRITICAL_EVENT_AFTER_MS,
    next_event_in_ms: nextEventInMs,
    started_at: state.started_at,
    last_tick_at: state.last_tick_at,
    updated_em: state.updated_em
  };
}

function setSimulationState(db, patch) {
  const current = ensureSimulationState(db);
  const next = {
    enabled: Object.prototype.hasOwnProperty.call(patch, 'enabled') ? patch.enabled : current.enabled,
    step: Object.prototype.hasOwnProperty.call(patch, 'step') ? patch.step : current.step,
    interval_ms: patch.interval_ms || current.interval_ms || DEFAULT_INTERVAL_MS,
    started_at: Object.prototype.hasOwnProperty.call(patch, 'started_at') ? patch.started_at : current.started_at,
    last_tick_at: Object.prototype.hasOwnProperty.call(patch, 'last_tick_at') ? patch.last_tick_at : current.last_tick_at,
    updated_em: nowIso()
  };

  db.prepare(`
    UPDATE simulation_state
    SET enabled = ?, step = ?, interval_ms = ?, started_at = ?, last_tick_at = ?, updated_em = ?
    WHERE id = 'main'
  `).run(
    next.enabled ? 1 : 0,
    Number(next.step || 0),
    Number(next.interval_ms || DEFAULT_INTERVAL_MS),
    next.started_at,
    next.last_tick_at,
    next.updated_em
  );

  return getSimulationState(db);
}

function activeDeviceRows(db) {
  return db.prepare(`
    SELECT
      d.*,
      c.nome AS cliente_nome,
      u.nome AS unidade_nome,
      u.local AS unidade_local
    FROM dispositivos d
    JOIN clientes c ON c.id = d.cliente_id
    JOIN unidades u ON u.id = d.unidade_id
    ORDER BY d.nome ASC
  `).all();
}

function updateDevice(db, row, next, updatedAt = nowIso()) {
  db.prepare(`
    UPDATE dispositivos
    SET temperatura_atual = ?, status = ?, ultima_comunicacao = ?, bateria = ?,
        chart_json = ?, atualizado_em = ?
    WHERE id = ?
  `).run(
    next.temp,
    next.status,
    next.ultima_comunicacao,
    next.bateria,
    next.chart_json || chartWith(row, next.temp),
    updatedAt,
    row.id
  );
}

function closeSimulationAlertsForDevice(db, deviceId, endedAt = nowIso()) {
  db.prepare(`
    UPDATE alerts
    SET status = 'encerrado', encerrado_em = ?
    WHERE dispositivo_id = ?
      AND status = 'ativo'
      AND tipo_alerta LIKE 'simulacao_%'
  `).run(endedAt, deviceId);
}

function recordTelemetryEvent(db, row, event) {
  db.prepare(`
    INSERT INTO telemetry_events (
      id, dispositivo_id, tipo_evento, tom, titulo, detalhe, temperatura, ocorrido_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id('telemetry'),
    row.id,
    event.type,
    event.tone,
    event.title,
    event.detail,
    event.temp,
    event.occurredAt
  );
}

function logSimulationPush(db, alertId, recipient, pushResult) {
  db.prepare(`
    INSERT INTO notification_logs (
      id, alert_id, app_device_id, expo_push_token, status_envio, resposta, criado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id('notif'),
    alertId,
    recipient?.id || null,
    recipient?.expo_push_token || null,
    pushResult.status_envio,
    pushResult.resposta,
    nowIso()
  );
}

function dispatchSimulationPush(db, alertId, row) {
  const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(alertId);
  if (!alert) return;

  const recipients = db.prepare(`
    SELECT *
    FROM app_devices
    WHERE ativo = 1
      AND cliente_id = ?
      AND (unidade_id = ? OR usuario_perfil IN ('master', 'admin1', 'admin2'))
      AND (dispositivo_id IS NULL OR dispositivo_id = ?)
  `).all(row.cliente_id, row.unidade_id, row.id);

  if (!recipients.length) {
    logSimulationPush(db, alertId, null, {
      status_envio: 'no_recipients',
      resposta: 'Nenhum celular habilitado para esta unidade/dispositivo.'
    });
    return;
  }

  recipients.forEach((recipient) => {
    sendExpoPush({
      token: recipient.expo_push_token,
      alert,
      device: row
    }).then((pushResult) => {
      logSimulationPush(db, alertId, recipient, pushResult);
    }).catch((error) => {
      logSimulationPush(db, alertId, recipient, {
        status_envio: 'failed',
        resposta: error.message
      });
    });
  });
}

function createSimulationAlert(db, row, next) {
  const tipo = `simulacao_${next.status}`;
  const existing = db.prepare(`
    SELECT id FROM alerts
    WHERE dispositivo_id = ?
      AND tipo_alerta = ?
      AND status = 'ativo'
    LIMIT 1
  `).get(row.id, tipo);

  if (existing) return existing.id;

  const alertId = id('alert');
  const createdAt = nowIso();
  const severity = next.status === 'critico' || next.status === 'offline' ? 'critica' : 'alta';
  const message = alertMessageForStatus(next.status);

  db.prepare(`
    INSERT INTO alerts (
      id, cliente_id, unidade_id, dispositivo_id, tipo_alerta, mensagem,
      temperatura_atual, faixa_minima, faixa_maxima, severidade, status, criado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo', ?)
  `).run(
    alertId,
    row.cliente_id,
    row.unidade_id,
    row.id,
    tipo,
    message,
    next.temp,
    row.faixa_minima,
    row.faixa_maxima,
    severity,
    createdAt
  );

  db.prepare(`
    INSERT INTO notification_logs (
      id, alert_id, app_device_id, expo_push_token, status_envio, resposta, criado_em
    ) VALUES (?, ?, NULL, NULL, ?, ?, ?)
  `).run(
    id('notif'),
    alertId,
    'simulation_created',
    'Alerta criado pela simulação; envio push será validado no app.',
    createdAt
  );

  dispatchSimulationPush(db, alertId, row);
  return alertId;
}

function normalStateFor(row) {
  const number = visualId(row);
  const temp = normalTemp(number);
  return {
    status: 'normal',
    temp,
    ultima_comunicacao: 'agora',
    bateria: Math.max(42, 96 - number),
    chart_json: JSON.stringify(baselineChart(temp))
  };
}

function attentionStateFor(row) {
  const number = visualId(row);
  return {
    status: 'atencao',
    temp: WARNING_TEMPERATURES.get(number) || 8.4,
    ultima_comunicacao: 'há 1 min',
    bateria: Math.max(42, Number(row.bateria || (96 - number)))
  };
}

function criticalStateFor(row) {
  const number = visualId(row);
  return {
    status: 'critico',
    temp: CRITICAL_TEMPERATURES.get(number) || 14.0,
    ultima_comunicacao: 'agora',
    bateria: Math.max(42, Number(row.bateria || (96 - number)))
  };
}

function offlineStateFor(row) {
  const number = visualId(row);
  return {
    status: 'offline',
    temp: Number(row.temperatura_atual ?? normalTemp(number)),
    ultima_comunicacao: 'sem comunicação há 15 min',
    bateria: Math.max(42, Number(row.bateria || (96 - number)))
  };
}

function plannedStateFor(row, stage) {
  const number = visualId(row);
  if (stage <= 0) return normalStateFor(row);
  if (SIMULATION_PLAN.offline.has(number)) return offlineStateFor(row);
  if (SIMULATION_PLAN.critical.has(number)) {
    return stage >= 2 ? criticalStateFor(row) : attentionStateFor(row);
  }
  if (SIMULATION_PLAN.warnOnly.has(number)) return attentionStateFor(row);
  return normalStateFor(row);
}

function resetOperationalDevices(db) {
  activeDeviceRows(db).forEach((row) => {
    updateDevice(db, row, normalStateFor(row));
    closeSimulationAlertsForDevice(db, row.id);
  });
}

function normalizeOperationalDevices(db) {
  const normalizedAt = nowIso();
  let normalizationCount = 0;

  activeDeviceRows(db).forEach((row) => {
    const previousStatus = String(row.status || 'normal').toLowerCase();
    const next = normalStateFor(row);

    // Preserve the simulated excursion and append the normalized reading.
    next.chart_json = chartWith(row, next.temp);
    closeSimulationAlertsForDevice(db, row.id, normalizedAt);
    updateDevice(db, row, next, normalizedAt);

    if (previousStatus === 'normal') return;

    if (previousStatus === 'critico') {
      recordTelemetryEvent(db, row, {
        type: 'simulation_critical_ended',
        tone: 'critical',
        title: 'Crítico encerrado',
        detail: 'Equipamento deixou o estado crítico.',
        temp: next.temp,
        occurredAt: normalizedAt
      });
    }

    if (previousStatus === 'offline') {
      recordTelemetryEvent(db, row, {
        type: 'simulation_communication_restored',
        tone: 'normal',
        title: 'Comunicação restabelecida',
        detail: 'Painel voltou a receber leituras do sensor.',
        temp: next.temp,
        occurredAt: normalizedAt
      });
    } else {
      recordTelemetryEvent(db, row, {
        type: 'simulation_temperature_normalized',
        tone: 'normal',
        title: 'Temperatura normalizada',
        detail: `Leitura voltou para dentro do limite configurado (${next.temp.toFixed(1)}°C).`,
        temp: next.temp,
        occurredAt: normalizedAt
      });
    }

    normalizationCount += 1;
  });

  return normalizationCount;
}

function syncSimulationAlert(db, row, next) {
  if (next.status === 'normal') {
    closeSimulationAlertsForDevice(db, row.id);
    return;
  }

  const currentStatus = String(row.status || 'normal').toLowerCase();
  if (currentStatus !== next.status) closeSimulationAlertsForDevice(db, row.id);
  createSimulationAlert(db, row, next);
}

function applySimulationStage(db, stage) {
  const rows = activeDeviceRows(db);
  let occurrenceCount = 0;

  rows.forEach((row) => {
    const next = plannedStateFor(row, stage);
    const isOccurrence = next.status === 'atencao' || next.status === 'critico' || next.status === 'offline';

    updateDevice(db, row, next);
    syncSimulationAlert(db, row, next);

    if (isOccurrence) occurrenceCount += 1;
  });

  return occurrenceCount;
}

function runSimulationTick(db, options = {}) {
  const state = ensureSimulationState(db);
  const currentStep = Number(state.step || 0);
  const nextStep = Math.min(2, currentStep + 1 || 1);
  const occurrenceCount = applySimulationStage(db, nextStep);

  const nextState = setSimulationState(db, {
    enabled: options.keepDisabled ? state.enabled : 1,
    step: nextStep,
    started_at: state.started_at || nowIso(),
    last_tick_at: nowIso()
  });

  return {
    simulation: serializeSimulationState(nextState),
    occurrence_count: occurrenceCount
  };
}

function advanceSimulationIfNeeded(db) {
  const state = ensureSimulationState(db);
  if (!state.enabled) return serializeSimulationState(state);

  const startedAt = state.started_at ? Date.parse(state.started_at) : 0;
  const elapsedMs = startedAt ? Date.now() - startedAt : 0;
  const targetStep = elapsedMs >= CRITICAL_EVENT_AFTER_MS
    ? 2
    : (elapsedMs >= FIRST_EVENT_AFTER_MS ? 1 : 0);
  const currentStep = Number(state.step || 0);

  if (targetStep > currentStep) {
    for (let stage = currentStep + 1; stage <= targetStep; stage += 1) {
      applySimulationStage(db, stage);
    }

    const nextState = setSimulationState(db, {
      step: targetStep,
      last_tick_at: nowIso()
    });
    return serializeSimulationState(nextState);
  }

  return serializeSimulationState(state);
}

function startSimulation(db) {
  resetOperationalDevices(db);
  const state = setSimulationState(db, {
    enabled: 1,
    step: 0,
    interval_ms: DEFAULT_INTERVAL_MS,
    started_at: nowIso(),
    last_tick_at: null
  });
  return {
    simulation: serializeSimulationState(state),
    occurrence_count: 0
  };
}

function stopSimulation(db) {
  const normalizationCount = normalizeOperationalDevices(db);
  const state = setSimulationState(db, {
    enabled: 0,
    step: 0,
    started_at: null,
    last_tick_at: nowIso()
  });
  return {
    simulation: serializeSimulationState(state),
    normalization_count: normalizationCount
  };
}

function parseFilters(filtersValue) {
  const raw = String(filtersValue || 'all').split(',').map((item) => item.trim()).filter(Boolean);
  return raw.length ? raw : ['all'];
}

function selectedIncludes(filters, key) {
  return filters.includes('all') || filters.includes(key);
}

function cardRotations(card, filters) {
  if (card.state === 'maint') return [];

  const out = [];
  const isOffline = card.online === false;
  const isWarn = card.state === 'warn';
  const isCrit = card.state === 'crit';
  const isBatteryLow = card.powerMode === 'battery' && Number(card.battery) <= 35;
  const isSourceDisconnected = card.powerMode === 'source' && isOffline;

  if (selectedIncludes(filters, 'offline') && isOffline) {
    out.push({ key: 'offline', count: 1, text: 'Sem comunicação', severity: 'critical', visibleIds: [card.id] });
  }
  if (selectedIncludes(filters, 'near_limit') && isWarn) {
    out.push({ key: 'warn', count: 1, text: 'Próximo do limite', severity: 'warning', visibleIds: [card.id] });
  }
  if (selectedIncludes(filters, 'out_of_range') && isCrit) {
    out.push({ key: 'crit', count: 1, text: 'Fora do limite', severity: 'critical', visibleIds: [card.id] });
  }
  if (selectedIncludes(filters, 'battery') && isBatteryLow) {
    out.push({ key: 'battery_low', count: 1, text: 'Bateria', severity: 'warning', visibleIds: [card.id] });
  }
  if (selectedIncludes(filters, 'battery') && isSourceDisconnected) {
    out.push({ key: 'source_disconnected', count: 1, text: 'Fonte desconectada', severity: 'critical', visibleIds: [card.id] });
  }

  return out;
}

function groupRotations(cards, filters) {
  return cards.flatMap((card) => cardRotations(card, filters));
}

function compactRotations(rotations) {
  const grouped = new Map();
  rotations.forEach((rotation) => {
    const current = grouped.get(rotation.key) || {
      ...rotation,
      count: 0,
      visibleIds: []
    };
    current.count += rotation.count;
    current.visibleIds.push(...(rotation.visibleIds || []));
    grouped.set(rotation.key, current);
  });

  return Array.from(grouped.values()).map((rotation) => ({
    ...rotation,
    visibleIds: [...new Set(rotation.visibleIds)]
  }));
}

function getNocOccurrences(db, options = {}) {
  advanceSimulationIfNeeded(db);

  const filters = parseFilters(options.filters);
  const mode = options.mode || 'area';
  const rows = db.prepare(`
    SELECT
      d.*,
      c.nome AS cliente_nome,
      u.nome AS unidade_nome,
      u.local AS unidade_local
    FROM dispositivos d
    JOIN clientes c ON c.id = d.cliente_id
    JOIN unidades u ON u.id = d.unidade_id
    ORDER BY d.nome ASC
  `).all();
  const cards = rows.map(buildDeviceCard);
  const occurrenceCards = cards
    .map((card) => ({ card, rotations: cardRotations(card, filters) }))
    .filter((item) => item.rotations.length);

  const allRotations = compactRotations(groupRotations(cards, filters));
  const visibleIds = [...new Set(allRotations.flatMap((rotation) => rotation.visibleIds || []))];
  const total = allRotations.reduce((sum, rotation) => sum + rotation.count, 0);

  const groups = {
    area: total ? [{
      key: 'area_banco_sangue',
      title: 'Banco IDvida',
      count: total,
      rotations: allRotations,
      visibleIds
    }] : [],
    client: total ? [{
      key: 'client_idvida',
      title: 'Laboratorio IDvida',
      count: total,
      rotations: allRotations,
      visibleIds
    }] : [],
    device: occurrenceCards.map(({ card, rotations }) => ({
      key: `device_${card.id}`,
      title: card.name,
      deviceId: card.id,
      backendId: card.backendId,
      count: rotations.reduce((sum, rotation) => sum + rotation.count, 0),
      rotations,
      visibleIds: [card.id]
    }))
  };

  return {
    mode,
    filters,
    total,
    cards: groups[mode] || groups.area,
    by_mode: groups
  };
}

module.exports = {
  advanceSimulationIfNeeded,
  getNocOccurrences,
  getSimulationState,
  runSimulationTick,
  serializeSimulationState,
  startSimulation,
  stopSimulation
};
