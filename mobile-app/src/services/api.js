export const API_BASE_URL = 'https://id-sensor-mvp.onrender.com';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.ok === false) {
    const message = payload?.message || `Falha na API (${response.status})`;
    throw new Error(message);
  }

  return payload?.data ?? payload;
}

export function activateApp(codigo) {
  return request('/activate', {
    method: 'POST',
    body: JSON.stringify({
      codigo,
      plataforma: 'expo-go',
      modelo_aparelho: 'IDsensor MVP'
    })
  });
}

export function getDevices() {
  return request('/devices');
}

export function getAppAlerts(appDeviceId) {
  if (!appDeviceId) return Promise.resolve([]);
  return request(`/app/alerts/${encodeURIComponent(appDeviceId)}`);
}

export function acknowledgeAlert(alertId, appDeviceId) {
  return request(`/alerts/${encodeURIComponent(alertId)}/acknowledge`, {
    method: 'POST',
    body: JSON.stringify({ app_device_id: appDeviceId })
  });
}

export function getDeviceByCode(code) {
  return request(`/devices/by-code/${encodeURIComponent(code)}`);
}
