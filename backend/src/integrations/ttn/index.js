const {
  normalizeBleGatewayPayload,
  normalizeBleGatewayPayloads,
  normalizeTtnCollectorPayload,
  normalizeTtnCollectorPayloads
} = require('./collectorNormalizer');
const {
  OFFLINE_AFTER_MS,
  calculateFillPercentage,
  getCollectorStatus
} = require('./collectorMetrics');

module.exports = {
  OFFLINE_AFTER_MS,
  calculateFillPercentage,
  getCollectorStatus,
  normalizeBleGatewayPayload,
  normalizeBleGatewayPayloads,
  normalizeTtnCollectorPayload,
  normalizeTtnCollectorPayloads
};
