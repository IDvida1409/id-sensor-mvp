const OFFLINE_AFTER_MS = 30 * 60 * 1000;

function finiteNumberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function calculateFillPercentage(emptyDistanceMm, fullDistanceMm, currentDistanceMm) {
  const empty = finiteNumberOrNull(emptyDistanceMm);
  const full = finiteNumberOrNull(fullDistanceMm);
  const current = finiteNumberOrNull(currentDistanceMm);

  if (empty === null || full === null || current === null) return null;
  if (empty < 0 || full < 0 || current < 0) return null;

  const usableRange = empty - full;
  if (usableRange <= 0) return null;

  const percentage = ((empty - current) / usableRange) * 100;
  return Number(clamp(percentage, 0, 100).toFixed(2));
}

function isOffline(lastReadingAt) {
  if (!lastReadingAt) return false;

  const timestamp = new Date(lastReadingAt).getTime();
  if (!Number.isFinite(timestamp)) return false;

  return Date.now() - timestamp > OFFLINE_AFTER_MS;
}

function getCollectorStatus(fillPercentage, lastReadingAt, consecutiveCriticalReadings = 0) {
  if (isOffline(lastReadingAt)) return 'offline';

  const percentage = finiteNumberOrNull(fillPercentage);
  if (percentage === null || percentage < 0) return 'unknown';

  const normalizedPercentage = clamp(percentage, 0, 100);
  const criticalCount = Math.max(0, Number(consecutiveCriticalReadings || 0));

  if (normalizedPercentage >= 90 && criticalCount >= 3) return 'critical_confirmed';
  if (normalizedPercentage >= 90) return 'critical';
  if (normalizedPercentage >= 75) return 'attention';
  return 'normal';
}

module.exports = {
  OFFLINE_AFTER_MS,
  calculateFillPercentage,
  getCollectorStatus
};
