const BLE_SENSOR_ID_KEYS = ['ble_sensor_id', 'sensor_id', 'sensorId', 'mac', 'ble_mac'];
const DISTANCE_KEYS = ['distance_mm', 'distanceMm', 'distance'];
const BATTERY_KEYS = ['battery', 'battery_percent', 'batt_vol', 'battery_voltage'];
const RSSI_BLE_KEYS = ['rssi_ble', 'rssiBle', 'rssi'];
const SENSOR_LIST_KEYS = ['sensors', 'scan_data'];

function asObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value;
}

function firstDefined(source, keys) {
  const object = asObject(source);

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(object, key) && object[key] !== undefined) {
      return object[key];
    }
  }

  return undefined;
}

function stringOrNull(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  if (Number.isFinite(number)) return number;

  if (typeof value === 'string') {
    const match = value.trim().match(/^-?\d+(?:\.\d+)?/);
    if (match) {
      const parsed = Number(match[0]);
      return Number.isFinite(parsed) ? parsed : null;
    }
  }

  return null;
}

function tofDistanceFromRawData(rawData) {
  const hex = stringOrNull(rawData)?.replace(/[^0-9a-f]/gi, '').toUpperCase();
  if (!hex) return null;

  const marker = '02010612FF5900';
  const markerIndex = hex.indexOf(marker);
  if (markerIndex === -1) return null;

  const distanceSeparatorIndex = hex.indexOf('FFFFFF', markerIndex + marker.length);
  if (distanceSeparatorIndex === -1) return null;

  const distanceIndex = distanceSeparatorIndex + 6;
  const distanceHex = hex.slice(distanceIndex, distanceIndex + 4);
  if (distanceHex.length !== 4) return null;

  const lowByte = Number.parseInt(distanceHex.slice(0, 2), 16);
  const highByte = Number.parseInt(distanceHex.slice(2, 4), 16);
  if (!Number.isFinite(lowByte) || !Number.isFinite(highByte)) return null;

  return (highByte << 8) + lowByte;
}

function firstGatewayId(rxMetadata) {
  if (!Array.isArray(rxMetadata)) return null;

  for (const item of rxMetadata) {
    const gatewayId = stringOrNull(asObject(asObject(item).gateway_ids).gateway_id);
    if (gatewayId) return gatewayId;
  }

  return null;
}

function ttnApplicationUpFrom(payload) {
  const root = asObject(payload);
  const data = asObject(root.data);

  if (data.uplink_message || data.end_device_ids) return data;
  return root;
}

function decodedPayloadFrom(payload) {
  return asObject(asObject(ttnApplicationUpFrom(payload)).uplink_message).decoded_payload;
}

function sensorReadingsFrom(payload) {
  const decodedPayload = asObject(decodedPayloadFrom(payload));

  for (const key of SENSOR_LIST_KEYS) {
    const sensors = decodedPayload[key];
    if (!Array.isArray(sensors)) continue;

    return sensors
      .map(asObject)
      .filter((sensor) => Object.keys(sensor).length > 0);
  }

  return [];
}

function commonTtnFields(payload) {
  const root = ttnApplicationUpFrom(payload);
  const originalRoot = asObject(payload);
  const endDeviceIds = asObject(root.end_device_ids);
  const uplinkMessage = asObject(root.uplink_message);
  const decodedPayload = asObject(uplinkMessage.decoded_payload);

  return {
    source: 'ttn',
    lorawanDeviceId: stringOrNull(endDeviceIds.device_id),
    lorawanGatewayId: firstGatewayId(uplinkMessage.rx_metadata),
    fPort: numberOrNull(uplinkMessage.f_port ?? decodedPayload.port),
    rawPayload: stringOrNull(uplinkMessage.frm_payload),
    receivedAt: stringOrNull(root.received_at ?? uplinkMessage.received_at ?? originalRoot.time),
    originalPayload: payload
  };
}

function normalizeSensorFields(decodedPayload, sensorPayload) {
  const decoded = asObject(decodedPayload);
  const sensor = asObject(sensorPayload);
  const source = Object.keys(sensor).length ? sensor : decoded;
  const explicitDistance = numberOrNull(firstDefined(source, DISTANCE_KEYS));

  return {
    bleSensorId: stringOrNull(firstDefined(source, BLE_SENSOR_ID_KEYS)),
    distanceMm: explicitDistance ?? tofDistanceFromRawData(source.raw_data),
    battery: numberOrNull(firstDefined(source, BATTERY_KEYS)),
    rssiBle: numberOrNull(firstDefined(source, RSSI_BLE_KEYS))
  };
}

function normalizeTtnCollectorPayload(payload, sensorPayload = null) {
  const common = commonTtnFields(payload);
  const decodedPayload = asObject(decodedPayloadFrom(payload));
  const sensors = sensorReadingsFrom(payload);
  const sensorSource = sensorPayload || sensors[0] || null;
  const sensorFields = normalizeSensorFields(decodedPayload, sensorSource);

  return {
    source: common.source,
    lorawanDeviceId: common.lorawanDeviceId,
    lorawanGatewayId: common.lorawanGatewayId,
    bleSensorId: sensorFields.bleSensorId,
    distanceMm: sensorFields.distanceMm,
    battery: sensorFields.battery,
    rssiBle: sensorFields.rssiBle,
    fPort: common.fPort,
    rawPayload: common.rawPayload,
    receivedAt: common.receivedAt,
    originalPayload: common.originalPayload
  };
}

function normalizeTtnCollectorPayloads(payload) {
  const sensors = sensorReadingsFrom(payload);
  if (!sensors.length) return [normalizeTtnCollectorPayload(payload)];

  return sensors.map((sensor) => normalizeTtnCollectorPayload(payload, sensor));
}

module.exports = {
  tofDistanceFromRawData,
  normalizeTtnCollectorPayload,
  normalizeTtnCollectorPayloads
};
