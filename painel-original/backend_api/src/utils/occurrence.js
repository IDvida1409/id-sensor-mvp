const { batterySeverity } = require('./status');

function isOffline(device) {
  return device.online === false;
}

function isNearLimit(device) {
  return device.state === 'warn';
}

function isOutOfRange(device) {
  return device.state === 'crit';
}

function isBatteryLow(device) {
  const level = Number(device.battery);
  return device.powerMode === 'battery' && Number.isFinite(level) && level <= 50;
}

function isSourceDisconnected(device) {
  return device.powerMode === 'source' && isOffline(device);
}

function matchesFilters(device, filters) {
  const selected = Array.isArray(filters) && filters.length ? filters : ['all'];
  const all = selected.includes('all');

  if (device.state === 'maint') return false;

  const checks = {
    near_limit: isNearLimit(device),
    out_of_range: isOutOfRange(device),
    offline: isOffline(device),
    battery: isBatteryLow(device) || isSourceDisconnected(device)
  };

  if (all) {
    return Object.values(checks).some(Boolean);
  }

  return selected.some((key) => !!checks[key]);
}

function describeOccurrence(device) {
  const items = [];

  if (isOffline(device)) {
    items.push({
      key: 'offline',
      text: 'Sem comunicacao',
      severity: 'critical',
      count: 1
    });
  }

  if (isNearLimit(device)) {
    items.push({
      key: 'near_limit',
      text: 'Proximo do limite',
      severity: 'warning',
      count: 1
    });
  }

  if (isOutOfRange(device)) {
    items.push({
      key: 'out_of_range',
      text: 'Fora da temperatura',
      severity: 'critical',
      count: 1
    });
  }

  if (isBatteryLow(device)) {
    const severityMap = {
      ok: 'info',
      warning: 'warning',
      critical: 'critical'
    };

    items.push({
      key: 'battery_low',
      text: 'Bateria',
      severity: severityMap[batterySeverity(device.battery)] || 'warning',
      count: 1
    });
  }

  if (isSourceDisconnected(device)) {
    items.push({
      key: 'source_disconnected',
      text: 'Fonte desconectada',
      severity: 'critical',
      count: 1
    });
  }

  return items;
}

module.exports = {
  isOffline,
  isNearLimit,
  isOutOfRange,
  isBatteryLow,
  isSourceDisconnected,
  matchesFilters,
  describeOccurrence
};
