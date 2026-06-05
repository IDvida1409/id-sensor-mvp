/**
 * Regras de negócio para status e alertas de dispositivo (blueprint).
 */
export function resolveTelemetryState(device){
  // TODO: migrar lógica completa de resolveTelemetryState do script.js
  return { status: 'NORMAL', state: 'blue', timerLabel: 'Dentro da faixa segura', timer: 0 };
}

export function getBatteryVisualClass(value){
  const level = Number(value);
  if(!Number.isFinite(level)) return 'battery-good';
  if(level < 20) return 'battery-critical';
  if(level <= 35) return 'battery-warning';
  return 'battery-good';
}

export function isDeviceOffline(device){
  return !!device && device.online === false && device.state !== 'maint';
}
