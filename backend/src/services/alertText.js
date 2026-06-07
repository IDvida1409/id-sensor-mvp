function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function alertKindFromParts(parts = {}) {
  const text = normalizeText(`${parts.status || ''} ${parts.severidade || ''} ${parts.tipo_alerta || ''} ${parts.mensagem || ''}`);
  if (text.includes('offline') || text.includes('comunic')) return 'offline';
  if (text.includes('critico') || text.includes('critica')) return 'crit';
  return 'warn';
}

function alertMessageForKind(kind) {
  if (kind === 'offline') return 'Dispositivo sem comunicação.';
  if (kind === 'crit') return 'Temperatura fora do limite estabelecido.';
  return 'Temperatura próxima do limite estabelecido.';
}

function alertMessageForStatus(status) {
  return alertMessageForKind(alertKindFromParts({ status }));
}

function alertMessageForAlert(alert) {
  return alertMessageForKind(alertKindFromParts(alert));
}

module.exports = {
  alertKindFromParts,
  alertMessageForAlert,
  alertMessageForKind,
  alertMessageForStatus
};
