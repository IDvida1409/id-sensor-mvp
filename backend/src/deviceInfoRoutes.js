const fs = require('node:fs');
const path = require('node:path');
const demo = require('./services/qrDemo');
const examples = {
  'DE:10:00:00:00:01': {
    model: 'MST01 Pt100', image_profile: 'mst01-pt100-aprovado',
    received_on: '2026-11-10', previously_used: false, history: [],
    measurement: { min: -200, max: 200, probe: 'Pt100 · 4 fios', source: 'https://www.minew.com/product/mst01-pt100-temperature-sensor/', note: 'Faixa de medição da probe Pt100 desta versão. Não é a faixa de alarme do equipamento.' }
  },
  'DE:00:00:00:00:01': {
    model: 'MST01', image_profile: 'mst01-aprovado',
    measurement: { min: -40, max: 125, probe: 'Probe de temperatura e umidade', source: 'https://www.minew.com/product/mst01-industrial-temperature-and-humidity-sensor/', note: 'Faixa de medição da probe deste dispositivo. Não é a faixa de alarme do equipamento.' },
    received_on: '2025-07-25', previously_used: true,
    history: [
      { area: 'Farmácia central', equipment: 'Geladeira de medicamentos', from: '2025-07-28', to: '2025-12-18' },
      { area: 'Laboratório de análises', equipment: 'Geladeira de amostras', from: '2025-12-18', to: '2026-05-05' }
    ]
  }
};

function register({ addRoute, getDb, getDeviceById, buildDeviceCard, ok, html }) {
  function getInfo(value) {
    const code = demo.scanned(value), candidate = demo.findSensor(code);
    const mac = candidate?.mac || code, db = getDb();
    const deviceId = demo.byMac(db, mac);
    const row = deviceId && getDeviceById(deviceId);
    const card = row && demo.decorate(db, buildDeviceCard(row));
    const sensor = candidate || card?.sensor;
    const example = examples[mac] || examples[candidate?.mac];
    if (!sensor && !example) throw Object.assign(Error('Dispositivo não encontrado.'), { statusCode: 404 });
    const actualMac = sensor?.mac || mac;
    const state = row && demo.read(db, row.id);
    const previouslyUsed = !!(example?.previously_used || row);
    const history = (example?.history || []).map(item => ({ ...item, illustrative: true }));
    if (card) history.push({ area: card.local || card.unitName, equipment: card.name, from: state?.startedAt?.slice(0, 10) || (example ? '2026-05-05' : null), to: null, current: true });
    const calibrated = sensor?.calibrated_on || '2025-07-21';
    const expires = sensor?.expires_on || '2026-07-31';
    const days = Math.ceil((Date.parse(expires + 'T23:59:59Z') - Date.now()) / 86400000);
    return {
      demonstration: true, mac: actualMac,
      manufacturer: example ? 'Minew' : sensor.manufacturer, model: example?.model || sensor.model,
      image: '/consulta/assets/' + (example?.image_profile || sensor?.image_profile || 'minew-probe') + '.webp',
      received_on: example?.received_on || null,
      condition: card ? 'Em uso' : previouslyUsed ? 'Disponível' : 'Novo',
      previously_used: previouslyUsed,
      current: card ? { area: card.local || card.unitName, equipment: card.name, url: '/q/' + encodeURIComponent(actualMac) } : null,
      history,
      measurement: example?.measurement || null,
      calibration: { calibrated_on: calibrated, expires_on: expires, status: days < 0 ? 'expired' : days <= 30 ? 'warning' : 'valid', certificate: '/api/device-info/' + encodeURIComponent(actualMac) + '/certificate' }
    };
  }
  function renderPage(value, res) {
    const info = getInfo(value);
    const file = fs.readFileSync(path.resolve(__dirname, '../../painel-original/consulta/dispositivo.html'), 'utf8');
    res.setHeader('Cache-Control', 'no-store');
    html(res, 200, file.replace('/*DEVICE_INFO_BOOT*/', 'window.IDSENSOR_DEVICE_MAC=' + JSON.stringify(info.mac).replace(/</g, '\\u003c') + ';'));
  }
  addRoute('GET', '/dispositivo/:mac', async ({ params, res }) => renderPage(params.mac, res));
  addRoute('GET', '/api/device-info/:mac', async ({ params, res }) => { res.setHeader('Cache-Control', 'no-store'); ok(res, getInfo(params.mac)); });
  addRoute('GET', '/api/device-info/:mac/certificate', async ({ params, res }) => { getInfo(params.mac); require('./services/demoCertificate').send(res); });
  return { getInfo, renderPage };
}

module.exports = { register };
