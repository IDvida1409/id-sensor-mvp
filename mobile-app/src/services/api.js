export const API_BASE_URL = 'https://id-sensor-mvp.onrender.com';

async function request(path, options = {}) {
  const { authToken, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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

export function activateApp(codigo, options = {}) {
  return request('/activate', {
    method: 'POST',
    body: JSON.stringify({
      codigo,
      expo_push_token: options.expoPushToken || null,
      plataforma: options.plataforma || 'expo',
      modelo_aparelho: options.modeloAparelho || 'IDsensor MVP'
    })
  });
}

export function updateAppDevicePushToken(appDeviceId, options = {}) {
  return request(`/app-devices/${encodeURIComponent(appDeviceId)}/push-token`, {
    method: 'POST',
    body: JSON.stringify({
      expo_push_token: options.expoPushToken || null,
      plataforma: options.plataforma || 'expo',
      modelo_aparelho: options.modeloAparelho || 'IDsensor MVP'
    })
  });
}

export function getDevices() {
  return request('/devices');
}

export function getAppAlerts(appDeviceId, appDeviceToken) {
  if (!appDeviceId) return Promise.resolve([]);
  return request(`/app/alerts/${encodeURIComponent(appDeviceId)}`, {
    authToken: appDeviceToken
  });
}

export function acknowledgeAlert(alertId, appDeviceId, appDeviceToken) {
  return request(`/alerts/${encodeURIComponent(alertId)}/acknowledge`, {
    method: 'POST',
    authToken: appDeviceToken,
    body: JSON.stringify({
      app_device_id: appDeviceId,
      app_device_token: appDeviceToken || null
    })
  });
}

export function getDeviceByCode(code) {
  return request(`/devices/by-code/${encodeURIComponent(code)}`);
}
