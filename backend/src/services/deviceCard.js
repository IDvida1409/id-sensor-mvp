const STATUS_META = {
  normal: {
    state: 'blue',
    label: 'NORMAL',
    timerLabel: 'Dentro da faixa segura',
    events: ['Sem alerta ativo'],
    timer: 0,
    fill: 52,
    range: 40
  },
  atencao: {
    state: 'warn',
    label: 'ATEN\u00c7\u00c3O',
    timerLabel: 'Fora do limite. Monitorando antes de escalar.',
    events: ['Fora da faixa permitida', 'Alerta de atencao gerado pela simulacao'],
    timer: 35,
    fill: 70,
    range: 82
  },
  critico: {
    state: 'crit',
    label: 'CR\u00cdTICO',
    timerLabel: 'Alerta critico enviado pelo app',
    events: ['Alerta critico ativo', 'Aguardando ciencia'],
    timer: 100,
    fill: 84,
    range: 96
  },
  offline: {
    state: 'blue',
    label: 'NORMAL',
    timerLabel: 'Sem comunicacao com o sensor',
    events: ['Sensor sem comunicacao', 'Verificar energia, rede ou gateway'],
    timer: 45,
    fill: 48,
    range: 40
  },
  manutencao: {
    state: 'maint',
    label: 'MANUTEN\u00c7\u00c3O',
    timerLabel: 'Equipamento em manutencao',
    events: ['Equipamento em manutencao'],
    timer: 40,
    fill: 28,
    range: 0
  }
};

const SOURCE_DEVICE_NUMBERS = new Set([2, 5, 10, 12, 20, 21, 22, 23, 24]);

function numberOrNull(value) {
  return value === null || value === undefined ? null : Number(value);
}

function visualId(row) {
  const fromQr = String(row.qr_code || '').match(/(\d+)$/);
  if (fromQr) return Number(fromQr[1]);

  const fromName = String(row.nome || '').match(/(\d+)$/);
  if (fromName) return Number(fromName[1]);

  return row.id;
}

function tempLabel(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--';
  return `${Number(value).toFixed(1)}\u00b0C`;
}

function chartFor(row) {
  if (row.chart_json) {
    try {
      const parsed = JSON.parse(row.chart_json);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
  }

  const temp = Number(row.temperatura_atual || 5);
  return [temp - 0.2, temp - 0.1, temp, temp + 0.1, temp].map((item) => Number(item.toFixed(1)));
}

function buildDeviceCard(row) {
  const normalizedStatus = String(row.status || 'normal').toLowerCase();
  const meta = STATUS_META[normalizedStatus] || STATUS_META.normal;
  const chart = chartFor(row);
  const minReading = chart.length ? Math.min(...chart) : numberOrNull(row.temperatura_atual);
  const maxReading = chart.length ? Math.max(...chart) : numberOrNull(row.temperatura_atual);
  const online = normalizedStatus !== 'offline' && normalizedStatus !== 'manutencao';
  const panelId = visualId(row);
  const shouldShowBell = normalizedStatus !== 'normal' && normalizedStatus !== 'manutencao';

  return {
    id: panelId,
    panelId,
    backendId: row.id,
    name: row.nome,
    deviceName: row.nome,
    tipo: row.tipo,
    clientId: row.cliente_id,
    clientName: row.cliente_nome,
    unitId: row.unidade_id,
    unitName: row.unidade_nome,
    sector: row.local,
    local: row.local,
    temp: numberOrNull(row.temperatura_atual),
    tempLabel: tempLabel(row.temperatura_atual),
    dailyMin: minReading,
    dailyMax: maxReading,
    min: numberOrNull(row.faixa_minima),
    max: numberOrNull(row.faixa_maxima),
    rangeLabel: `${Number(row.faixa_minima).toFixed(1)}\u00b0C a ${Number(row.faixa_maxima).toFixed(1)}\u00b0C`,
    status: meta.label,
    rawStatus: normalizedStatus,
    state: meta.state,
    online,
    battery: numberOrNull(row.bateria),
    hum1: numberOrNull(row.umidade),
    hum2: numberOrNull(row.umidade),
    updated: row.ultima_comunicacao,
    ultimaComunicacao: row.ultima_comunicacao,
    timerLabel: meta.timerLabel,
    timer: meta.timer,
    fill: meta.fill,
    range: meta.range,
    events: meta.events,
    commText: online ? null : `Ultima comunicacao: ${row.ultima_comunicacao}`,
    chart,
    qrCode: row.qr_code,
    code: row.qr_code,
    powerMode: SOURCE_DEVICE_NUMBERS.has(Number(panelId)) ? 'source' : 'battery',
    visualContract: {
      cardClass: `card ${meta.state}`,
      state: meta.state,
      shouldShowBell,
      source: 'panel-card-v1'
    }
  };
}

module.exports = {
  buildDeviceCard,
  STATUS_META
};
