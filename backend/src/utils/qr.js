const { appDeepLinkBase } = require('../config');

function normalizeBase(base) {
  return String(base || '').replace(/\/+$/, '');
}

function joinDeepLink(base, suffix) {
  const raw = String(base || '').trim();
  const cleanSuffix = String(suffix || '').replace(/^\/+/, '');
  if (raw.endsWith('://')) return `${raw}${cleanSuffix}`;
  return `${normalizeBase(raw)}/${cleanSuffix}`;
}

function buildActivationPayload(code) {
  return joinDeepLink(appDeepLinkBase, `activate/${encodeURIComponent(code)}`);
}

function buildDevicePayload(code) {
  return joinDeepLink(appDeepLinkBase, `device/${encodeURIComponent(code)}`);
}

function buildQrImageUrl(payload) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(payload)}`;
}

async function buildQrDataUrl(payload) {
  return null;
}

function extractScannedCode(input) {
  const raw = decodeURIComponent(String(input || '').trim());
  if (!raw) return '';

  const queryCode = raw.match(/[?&](?:code|codigo)=([^&]+)/i);
  if (queryCode) return decodeURIComponent(queryCode[1]).trim();

  return raw
    .split(/[/?#]/)
    .filter(Boolean)
    .pop()
    .trim();
}

module.exports = {
  buildActivationPayload,
  buildDevicePayload,
  buildQrImageUrl,
  buildQrDataUrl,
  extractScannedCode
};
