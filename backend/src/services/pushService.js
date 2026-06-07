const { expoPushEnabled } = require('../config');
const { alertMessageForAlert } = require('./alertText');

async function sendExpoPush({ token, alert, device }) {
  if (!expoPushEnabled) {
    return {
      status_envio: 'disabled',
      resposta: 'EXPO_PUSH_ENABLED=false'
    };
  }

  if (!token) {
    return {
      status_envio: 'ignored',
      resposta: 'Sem Expo Push Token cadastrado.'
    };
  }

  if (!String(token).startsWith('ExponentPushToken[') && !String(token).startsWith('ExpoPushToken[')) {
    return {
      status_envio: 'invalid_token',
      resposta: 'Token informado não parece ser um Expo Push Token.'
    };
  }

  const currentTemp = alert.temperatura_atual === null || alert.temperatura_atual === undefined
    ? '--'
    : `${Number(alert.temperatura_atual).toFixed(1)} C`;

  const displayMessage = alertMessageForAlert(alert);
  const body = displayMessage === 'Dispositivo sem comunicação.'
    ? `${device.nome}: ${displayMessage}`
    : `${device.nome}: ${displayMessage} Atual: ${currentTemp}.`;

  const payload = {
    to: token,
    title: 'Alerta IDsensor',
    body,
    sound: 'default',
    channelId: 'idsensor-alerts',
    priority: 'high',
    data: {
      alert_id: alert.id,
      dispositivo_id: alert.dispositivo_id,
      tipo_alerta: alert.tipo_alerta
    }
  };

  try {
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const body = await res.json().catch(() => ({}));
    const expoData = Array.isArray(body.data) ? body.data[0] : body.data;
    const expoAccepted = res.ok && (!expoData || expoData.status !== 'error');

    return {
      status_envio: expoAccepted ? 'sent' : 'failed',
      resposta: JSON.stringify(body)
    };
  } catch (error) {
    return {
      status_envio: 'failed',
      resposta: error.message
    };
  }
}

module.exports = {
  sendExpoPush
};
