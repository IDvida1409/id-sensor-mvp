const BLE_SENSOR_ID_KEYS = ['ble_sensor_id', 'sensor_id', 'sensorId', 'mac', 'ble_mac'];
const DISTANCE_KEYS = ['distance_mm', 'distanceMm', 'distance', 'randingDistance', 'rangingDistance'];
const BATTERY_PERCENT_KEYS = ['battery', 'battery_percent', 'batteryPercent'];
const BATTERY_VOLTAGE_KEYS = ['battery_voltage_mv', 'batteryVoltageMv', 'battVoltage', 'batteryVoltage'];
const RSSI_BLE_KEYS = ['rssi_ble', 'rssiBle', 'rssi'];
const SENSOR_LIST_KEYS = ['sensors', 'scan_data'];
const BLE_GATEWAY_ID_KEYS = ['gateway_id', 'gatewayId', 'gw_id', 'gwId', 'device_id', 'deviceId', 'gatewayMac', 'gateway_mac'];
const BLE_SENSOR_LIST_KEYS = ['sensors', 'scan_data', 'deviceArray', 'devices', 'beacons', 'data'];

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

function rawDataFrom(source) {
  const object = asObject(source);
  return stringOrNull(object.raw_data ?? object.rawData ?? object.advPacket ?? object.advertisingPacket);
}

function timestampIsoOrNull(value) {
  const timestamp = numberOrNull(value);
  if (timestamp === null) return null;

  const ms = timestamp > 1000000000000 ? timestamp : timestamp * 1000;
  const date = new Date(ms);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
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

function directBleSensorReadingsFrom(payload) {
  const root = asObject(payload);

  for (const key of BLE_SENSOR_LIST_KEYS) {
    const sensors = root[key];
    if (!Array.isArray(sensors)) continue;

    return sensors
      .map(asObject)
      .filter((sensor) => Object.keys(sensor).length > 0);
  }

  return Object.keys(root).length ? [root] : [];
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
  const rawData = rawDataFrom(source);

  return {
    bleSensorId: stringOrNull(firstDefined(source, BLE_SENSOR_ID_KEYS)),
    distanceMm: explicitDistance ?? tofDistanceFromRawData(rawData),
    battery: numberOrNull(firstDefined(source, BATTERY_PERCENT_KEYS)),
    batteryVoltageMv: numberOrNull(firstDefined(source, BATTERY_VOLTAGE_KEYS)),
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
    batteryVoltageMv: sensorFields.batteryVoltageMv,
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

function normalizeBleGatewayPayload(payload, sensorPayload = null) {
  const root = asObject(payload);
  const sensor = asObject(sensorPayload || payload);
  const sensorFields = normalizeSensorFields(root, sensor);
  const gatewayId = stringOrNull(firstDefined(root, BLE_GATEWAY_ID_KEYS));
  const receivedAt = timestampIsoOrNull(sensor.timestamp ?? root.timestamp)
    || stringOrNull(root.received_at ?? root.receivedAt ?? root.time ?? root.current_time ?? sensor.current_time);

  return {
    source: 'ble-gateway',
    lorawanDeviceId: gatewayId,
    lorawanGatewayId: gatewayId,
    bleSensorId: sensorFields.bleSensorId,
    distanceMm: sensorFields.distanceMm,
    battery: sensorFields.battery,
    batteryVoltageMv: sensorFields.batteryVoltageMv,
    rssiBle: sensorFields.rssiBle,
    fPort: null,
    rawPayload: rawDataFrom(sensor) || rawDataFrom(root),
    receivedAt,
    originalPayload: payload
  };
}

function normalizeBleGatewayPayloads(payload) {
  const sensors = directBleSensorReadingsFrom(payload);
  if (!sensors.length) return [normalizeBleGatewayPayload(payload)];

  return sensors.map((sensor) => normalizeBleGatewayPayload(payload, sensor));
}

module.exports = {
  tofDistanceFromRawData,
  normalizeBleGatewayPayload,
  normalizeBleGatewayPayloads,
  normalizeTtnCollectorPayload,
  normalizeTtnCollectorPayloads
};
