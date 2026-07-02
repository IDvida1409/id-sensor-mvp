const tls = require('node:tls');
const crypto = require('node:crypto');
const { mqttBridge } = require('../config');

const MQTT_CONNECT = 1;
const MQTT_CONNACK = 2;
const MQTT_PUBLISH = 3;
const MQTT_PUBACK = 4;
const MQTT_SUBSCRIBE = 8;
const MQTT_SUBACK = 9;
const MQTT_PINGREQ = 12;
const MQTT_PINGRESP = 13;

const status = {
  enabled: mqttBridge.enabled,
  started: false,
  connected: false,
  configured: Boolean(mqttBridge.host && mqttBridge.username && mqttBridge.password),
  hostConfigured: Boolean(mqttBridge.host),
  port: mqttBridge.port,
  usernameConfigured: Boolean(mqttBridge.username),
  passwordConfigured: Boolean(mqttBridge.password),
  clientIdConfigured: Boolean(mqttBridge.clientId),
  topic: mqttBridge.topic,
  rejectUnauthorized: mqttBridge.rejectUnauthorized,
  messagesReceived: 0,
  readingsReceived: 0,
  readingsStored: 0,
  reconnects: 0,
  lastConnectedAt: null,
  lastDisconnectedAt: null,
  lastMessageAt: null,
  lastPayload: null,
  lastError: null,
  stopRequested: false
};

function nowIso() {
  return new Date().toISOString();
}

function getMqttBridgeStatus() {
  return { ...status };
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const number = Number(match[0]);
  return Number.isFinite(number) ? number : null;
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function gatewayBatteryPercentFromVoltage(voltageMv) {
  const voltage = numberOrNull(voltageMv);
  if (voltage === null) return null;
  return Math.round(clampNumber(((voltage - 3300) / 900) * 100, 0, 100));
}

function gatewayStatusSummary(deviceStatus) {
  if (!deviceStatus || typeof deviceStatus !== 'object') return null;
  const voltageMv = numberOrNull(deviceStatus.battVoltage ?? deviceStatus.batteryVoltageMv ?? deviceStatus.battery_voltage_mv);
  const timestamp = numberOrNull(deviceStatus.timestamp);
  const timestampIso = timestamp !== null
    ? new Date((timestamp > 1000000000000 ? timestamp : timestamp * 1000)).toISOString()
    : null;

  return {
    timestamp: timestampIso,
    networkType: deviceStatus.networkType || deviceStatus.netwrokType || null,
    csq: numberOrNull(deviceStatus.csq),
    batteryVoltageMv: voltageMv,
    batteryPercent: gatewayBatteryPercentFromVoltage(voltageMv),
    accStatus: numberOrNull(deviceStatus.accStatus),
    imei: deviceStatus.imei || null
  };
}

function payloadSummary(payload, result) {
  const deviceArray = Array.isArray(payload?.deviceArray) ? payload.deviceArray : null;
  const firstDevice = deviceArray?.[0] || null;
  const rawData = typeof payload?.raw_data === 'string' ? payload.raw_data : null;
  const firstDistance = firstDevice
    ? firstDevice.randingDistance ?? firstDevice.rangingDistance ?? firstDevice.distanceMm ?? firstDevice.distance
    : payload?.randingDistance ?? payload?.rangingDistance ?? payload?.distanceMm ?? payload?.distance;

  return {
    kind: rawData ? 'raw_hex' : 'json',
    flag: payload?.flag || null,
    keys: payload && typeof payload === 'object' ? Object.keys(payload).slice(0, 12) : [],
    deviceCount: deviceArray ? deviceArray.length : null,
    gatewayMac: payload?.gatewayMac || null,
    gatewayStatus: gatewayStatusSummary(payload?.deviceStatus),
    firstMac: firstDevice?.mac || payload?.mac || null,
    firstDistance: firstDistance ?? null,
    rawPrefix: rawData ? rawData.slice(0, 160) : null,
    received: Number(result?.received || 0),
    stored: Number(result?.stored || 0),
    ignored: Number(result?.ignored || 0)
  };
}

function encodeRemainingLength(length) {
  const bytes = [];
  let value = length;

  do {
    let encoded = value % 128;
    value = Math.floor(value / 128);
    if (value > 0) encoded |= 128;
    bytes.push(encoded);
  } while (value > 0);

  return Buffer.from(bytes);
}

function mqttString(value) {
  const data = Buffer.from(String(value || ''), 'utf8');
  const length = Buffer.allocUnsafe(2);
  length.writeUInt16BE(data.length, 0);
  return Buffer.concat([length, data]);
}

function packet(typeAndFlags, payload = Buffer.alloc(0)) {
  return Buffer.concat([
    Buffer.from([typeAndFlags]),
    encodeRemainingLength(payload.length),
    payload
  ]);
}

function connectPacket(options) {
  const clientId = options.clientId || `idsensor-backend-${crypto.randomBytes(4).toString('hex')}`;
  let flags = 0x02;
  const payloadParts = [mqttString(clientId)];

  if (options.username) flags |= 0x80;
  if (options.password) flags |= 0x40;
  if (options.username) payloadParts.push(mqttString(options.username));
  if (options.password) payloadParts.push(mqttString(options.password));

  const variableHeader = Buffer.concat([
    mqttString('MQTT'),
    Buffer.from([0x04, flags, 0x00, 0x3c])
  ]);

  return packet(0x10, Buffer.concat([variableHeader, ...payloadParts]));
}

function subscribePacket(packetId, topic) {
  const id = Buffer.allocUnsafe(2);
  id.writeUInt16BE(packetId, 0);
  return packet(0x80 | 0x02, Buffer.concat([id, mqttString(topic), Buffer.from([0x00])]));
}

function pubackPacket(packetId) {
  const id = Buffer.allocUnsafe(2);
  id.writeUInt16BE(packetId, 0);
  return packet(0x40, id);
}

function pingPacket() {
  return packet(0xc0);
}

function readPacket(buffer) {
  if (buffer.length < 2) return null;

  let multiplier = 1;
  let remainingLength = 0;
  let offset = 1;
  let encodedByte = 0;

  do {
    if (offset >= buffer.length) return null;
    encodedByte = buffer[offset++];
    remainingLength += (encodedByte & 127) * multiplier;
    multiplier *= 128;
    if (multiplier > 128 * 128 * 128) throw new Error('MQTT remaining length inválido.');
  } while ((encodedByte & 128) !== 0);

  const end = offset + remainingLength;
  if (buffer.length < end) return null;

  return {
    header: buffer[0],
    body: buffer.subarray(offset, end),
    rest: buffer.subarray(end)
  };
}

function parsePublish(header, body) {
  const qos = (header >> 1) & 0x03;
  let offset = 0;
  const topicLength = body.readUInt16BE(offset);
  offset += 2;
  const topic = body.subarray(offset, offset + topicLength).toString('utf8');
  offset += topicLength;

  let packetId = null;
  if (qos > 0) {
    packetId = body.readUInt16BE(offset);
    offset += 2;
  }

  return {
    topic,
    qos,
    packetId,
    payload: body.subarray(offset)
  };
}

function bytesToHex(bytes) {
  return Buffer.from(bytes).toString('hex');
}

function signedInt8(value) {
  return value > 127 ? value - 256 : value;
}

function isMokoTofRecordAt(bytes, offset) {
  return bytes[offset] === 0x0b
    && bytes[offset + 1] === 0x01
    && bytes[offset + 2] === 0x00
    && bytes[offset + 3] === 0x06;
}

function isMokoTofRecordSeparatorAt(bytes, offset) {
  return bytes[offset] === 0x00
    && bytes[offset + 1] === 0x00
    && bytes[offset + 2] === 0x01
    && isMokoTofRecordAt(bytes, offset + 3);
}

function parseMokoTofSensor(bytes, startIndex) {
  if (!isMokoTofRecordAt(bytes, startIndex)) return null;

  const sensor = {
    typeCode: 11,
    type: 'tof',
    mac: bytesToHex(bytes.subarray(startIndex + 4, startIndex + 10))
  };
  let offset = startIndex + 10;

  while (offset + 3 <= bytes.length) {
    if (offset > startIndex + 10 && (isMokoTofRecordAt(bytes, offset) || isMokoTofRecordSeparatorAt(bytes, offset))) {
      break;
    }

    const tag = bytes[offset];
    const length = bytes.readUInt16BE(offset + 1);
    const valueStart = offset + 3;
    const valueEnd = valueStart + length;
    if (!length || valueEnd > bytes.length) break;

    const value = bytes.subarray(valueStart, valueEnd);
    if (tag === 0x02 && length >= 1) sensor.connectable = value[0] ? 'Connectable' : 'Non-connectable';
    if (tag === 0x03 && length >= 4) sensor.timestamp = value.readUInt32BE(0);
    if (tag === 0x03 && length >= 5) sensor.timezone = value[4];
    if (tag === 0x04 && length >= 1) sensor.rssi = signedInt8(value[0]);
    if (tag === 0x0a && length >= 2) sensor.manufacturerVendorCode = value.readUInt16BE(0);
    if (tag === 0x0b && length >= 2) sensor.battVoltage = `${value.readUInt16BE(0)}mV`;
    if (tag === 0x0c && length >= 2) sensor.userData = value.readUInt16BE(0);
    if (tag === 0x0d && length >= 2) sensor.randingDistance = value.readUInt16BE(0);

    offset = valueEnd;
  }

  return { sensor, nextOffset: offset };
}

function readUnsignedInteger(bytes) {
  if (!bytes.length) return null;
  if (bytes.length <= 6) return bytes.readUIntBE(0, bytes.length);
  const value = bytes.readBigUInt64BE(0);
  return value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : null;
}

function parseMokoGatewayStatus(bytes, startIndex) {
  const deviceStatus = {};

  for (let offset = startIndex; offset + 3 <= bytes.length;) {
    const tag = bytes[offset];
    const length = bytes.readUInt16BE(offset + 1);
    const valueStart = offset + 3;
    const valueEnd = valueStart + length;
    if (!length || valueEnd > bytes.length) break;

    const value = bytes.subarray(valueStart, valueEnd);
    if (tag === 0x00) deviceStatus.timestamp = readUnsignedInteger(value);
    if (tag === 0x01) deviceStatus.netwrokType = value.toString('utf8');
    if (tag === 0x02) deviceStatus.csq = readUnsignedInteger(value);
    if (tag === 0x03) deviceStatus.battVoltage = `${readUnsignedInteger(value)}mV`;
    if (tag === 0x05) deviceStatus.accStatus = readUnsignedInteger(value);
    if (tag === 0x06) deviceStatus.imei = value.toString('utf8');

    offset = valueEnd;
  }

  return Object.keys(deviceStatus).length ? deviceStatus : null;
}

function parseMokoRawPayload(hex) {
  const bytes = Buffer.from(hex, 'hex');
  if (bytes.length < 13 || bytes[0] !== 0xef) return null;

  const flag = bytesToHex(bytes.subarray(1, 3));
  const gatewayMac = bytesToHex(bytes.subarray(3, 9));
  const length = bytes.readUInt16BE(9);
  const parsed = {
    flag,
    gatewayMac,
    length,
    raw_data: hex
  };

  if (flag === '3004') {
    const deviceStatus = parseMokoGatewayStatus(bytes, 11);
    if (deviceStatus) parsed.deviceStatus = deviceStatus;
    return parsed;
  }

  if (flag !== '30a0') return parsed;

  const deviceArray = [];
  for (let offset = 13; offset + 10 <= bytes.length;) {
    const record = parseMokoTofSensor(bytes, offset);
    if (!record) {
      offset += 1;
      continue;
    }

    deviceArray.push(record.sensor);
    offset = Math.max(record.nextOffset, offset + 1);
  }

  parsed.deviceArray = deviceArray;
  return parsed;
}

function parsePayload(payload) {
  const text = payload.toString('utf8').trim();

  if (text.startsWith('{') || text.startsWith('[')) {
    return JSON.parse(text);
  }

  const rawData = payload.toString('hex');
  const parsedMokoPayload = parseMokoRawPayload(rawData);
  if (parsedMokoPayload) return parsedMokoPayload;

  return {
    raw_data: rawData
  };
}

function startMqttBridge({ storePayload, recordPayload } = {}) {
  status.enabled = mqttBridge.enabled;
  status.configured = Boolean(mqttBridge.host && mqttBridge.username && mqttBridge.password);
  status.hostConfigured = Boolean(mqttBridge.host);
  status.usernameConfigured = Boolean(mqttBridge.username);
  status.passwordConfigured = Boolean(mqttBridge.password);
  status.clientIdConfigured = Boolean(mqttBridge.clientId);
  status.topic = mqttBridge.topic;
  status.port = mqttBridge.port;
  status.rejectUnauthorized = mqttBridge.rejectUnauthorized;
  status.stopRequested = false;

  if (!mqttBridge.enabled) {
    status.started = false;
    status.connected = false;
    status.lastError = 'disabled';
    return { started: false, reason: 'disabled' };
  }

  if (!mqttBridge.host || !mqttBridge.username || !mqttBridge.password) {
    status.started = false;
    status.connected = false;
    status.lastError = 'missing_config';
    console.warn('[mqtt] Ponte desativada: MQTT_HOST, MQTT_USERNAME ou MQTT_PASSWORD ausente.');
    return { started: false, reason: 'missing_config' };
  }

  status.started = true;
  status.lastError = null;

  let socket = null;
  let buffer = Buffer.alloc(0);
  let reconnectTimer = null;
  let pingTimer = null;
  let reconnectDelayMs = 5000;
  let nextPacketId = 1;
  let closedByApp = false;

  function scheduleReconnect() {
    if (closedByApp || reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, reconnectDelayMs);
    reconnectDelayMs = Math.min(60000, reconnectDelayMs * 2);
  }

  function clearPing() {
    if (pingTimer) clearInterval(pingTimer);
    pingTimer = null;
  }

  function handlePacket(mqttPacket) {
    const type = mqttPacket.header >> 4;

    if (type === MQTT_CONNACK) {
      const returnCode = mqttPacket.body[1];
      if (returnCode !== 0) throw new Error(`CONNACK recusado pelo broker: ${returnCode}`);

      reconnectDelayMs = 5000;
      status.connected = true;
      status.lastConnectedAt = nowIso();
      status.lastError = null;
      socket.write(subscribePacket(nextPacketId++, mqttBridge.topic));
      clearPing();
      pingTimer = setInterval(() => {
        if (socket && !socket.destroyed) socket.write(pingPacket());
      }, 30000);
      console.log(`[mqtt] Conectado ao HiveMQ e assinando ${mqttBridge.topic}`);
      return;
    }

    if (type === MQTT_SUBACK || type === MQTT_PINGRESP) return;

    if (type === MQTT_PUBLISH) {
      const message = parsePublish(mqttPacket.header, mqttPacket.body);
      if (message.qos === 1 && message.packetId !== null) socket.write(pubackPacket(message.packetId));

      const payload = parsePayload(message.payload);
      const result = storePayload(payload, { requireDistance: true });
      status.messagesReceived += 1;
      status.readingsReceived += Number(result.received || 0);
      status.readingsStored += Number(result.stored || 0);
      status.lastMessageAt = nowIso();
      status.lastPayload = payloadSummary(payload, result);
      status.lastError = null;
      if (typeof recordPayload === 'function') {
        try {
          recordPayload(payload, result, {
            topic: message.topic,
            qos: message.qos,
            packetId: message.packetId,
            receivedAt: status.lastMessageAt,
            summary: status.lastPayload
          });
        } catch (error) {
          console.error(`[mqtt] Falha ao persistir mensagem do gateway: ${error.message}`);
        }
      }
      console.log(`[mqtt] ${message.topic}: ${result.stored}/${result.received} leitura(s) salvas.`);
    }
  }

  function connect() {
    status.reconnects += status.lastDisconnectedAt ? 1 : 0;
    buffer = Buffer.alloc(0);
    clearPing();
    socket = tls.connect({
      host: mqttBridge.host,
      port: mqttBridge.port,
      servername: mqttBridge.host,
      rejectUnauthorized: mqttBridge.rejectUnauthorized
    });

    socket.on('secureConnect', () => {
      socket.write(connectPacket(mqttBridge));
    });

    socket.on('data', (chunk) => {
      try {
        buffer = Buffer.concat([buffer, chunk]);

        while (buffer.length) {
          const next = readPacket(buffer);
          if (!next) break;
          buffer = next.rest;
          handlePacket(next);
        }
      } catch (error) {
        status.connected = false;
        status.lastError = error.message;
        console.error(`[mqtt] Falha ao processar mensagem: ${error.message}`);
        if (socket && !socket.destroyed) socket.destroy();
      }
    });

    socket.on('error', (error) => {
      status.connected = false;
      status.lastError = error.message;
      console.error(`[mqtt] Erro de conexão: ${error.message}`);
    });

    socket.on('close', () => {
      status.connected = false;
      status.lastDisconnectedAt = nowIso();
      clearPing();
      scheduleReconnect();
    });
  }

  connect();

  return {
    started: true,
    stop() {
      closedByApp = true;
      status.stopRequested = true;
      status.connected = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      clearPing();
      if (socket) socket.destroy();
    }
  };
}

module.exports = {
  gatewayStatusSummary,
  getMqttBridgeStatus,
  parseMokoRawPayload,
  startMqttBridge
};
