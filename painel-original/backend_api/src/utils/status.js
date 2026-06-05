const CYCLE_STATUS_STATES = ['maint', 'inventory', 'defrost', 'restock'];

const MANUAL_STATUS_LABEL = {
  maint: 'MANUTENCAO',
  inventory: 'INVENTARIO',
  defrost: 'DEGELO',
  restock: 'REPOSICAO'
};

function isCycleState(state) {
  return CYCLE_STATUS_STATES.includes(state);
}

function resolveTelemetryState(device) {
  if (!device) {
    return { status: 'NORMAL', state: 'blue', timerLabel: 'Dentro da faixa segura', timer: 0 };
  }

  const temp = Number(device.temp);
  const hasTemp = Number.isFinite(temp);
  const min = Number.isFinite(Number(device.min)) ? Number(device.min) : 2;
  const max = Number.isFinite(Number(device.max)) ? Number(device.max) : 8;

  if (!hasTemp) {
    return { status: 'NORMAL', state: 'blue', timerLabel: 'Dentro da faixa segura', timer: 0 };
  }

  if (temp > (max + 1) || temp < (min - 1)) {
    return { status: 'CRITICO', state: 'crit', timerLabel: 'Fora do limite critico', timer: 100 };
  }

  const outOfRange = temp > max || temp < min;
  const nearLimit = !outOfRange && ((max - temp) <= 0.8 || (temp - min) <= 0.8);

  if (outOfRange) {
    return { status: 'ATENCAO', state: 'warn', timerLabel: 'Fora do limite - monitorando', timer: 60 };
  }

  if (nearLimit) {
    return { status: 'ATENCAO', state: 'warn', timerLabel: 'Proximo do limite - monitorando', timer: 14 };
  }

  return { status: 'NORMAL', state: 'blue', timerLabel: 'Dentro da faixa segura', timer: 0 };
}

function mapManualStateLabel(state) {
  return MANUAL_STATUS_LABEL[state] || 'NORMAL';
}

function batterySeverity(level) {
  const value = Number(level);
  if (!Number.isFinite(value)) return 'ok';
  if (value < 20) return 'critical';
  if (value <= 35) return 'warning';
  return 'ok';
}

module.exports = {
  CYCLE_STATUS_STATES,
  isCycleState,
  resolveTelemetryState,
  mapManualStateLabel,
  batterySeverity
};
