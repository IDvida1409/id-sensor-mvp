const { publicApiUrl } = require('../config');

function normalizeBase(base) {
  return String(base || '').replace(/\/+$/, '');
}

function joinPublicLink(path, code) {
  const cleanPath = String(path || '').replace(/^\/?/, '/').replace(/\/+$/, '');
  return `${normalizeBase(publicApiUrl)}${cleanPath}/${encodeURIComponent(code)}`;
}

function buildActivationPayload(code) {
  return joinPublicLink('/a', code);
}

function buildDevicePayload(code) {
  return joinPublicLink('/q', code);
}

function buildQrImageUrl(payload) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(payload)}`;
}

async function buildQrDataUrl() {
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
