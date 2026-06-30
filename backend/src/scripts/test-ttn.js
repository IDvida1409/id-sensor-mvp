const fs = require('node:fs');
const path = require('node:path');
const {
  calculateFillPercentage,
  getCollectorStatus,
  normalizeTtnCollectorPayloads
} = require('../integrations/ttn');

const examplesDir = path.resolve(__dirname, '../integrations/ttn/examples');
const exampleFiles = [
  'ttn-raw-payload.json',
  'ttn-decoded-single-sensor.json',
  'ttn-decoded-multiple-sensors.json',
  'ttn-invalid-payload.json',
  'ttn-real-sample-placeholder.json',
  'ttn-real-tof-sensor.json',
  'ttn-real-tof-sensor-close.json'
];

function readJson(fileName) {
  const filePath = path.join(examplesDir, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function printResult(fileName, payload) {
  const normalized = normalizeTtnCollectorPayloads(payload);
  const result = normalized.length === 1 ? normalized[0] : normalized;

  console.log(`Arquivo: ${fileName}`);
  console.log('');
  console.log('Resultado normalizado:');
  console.log(JSON.stringify(result, null, 2));
  console.log('');
}

function run() {
  for (const fileName of exampleFiles) {
    try {
      printResult(fileName, readJson(fileName));
    } catch (error) {
      console.error(`Falha ao processar ${fileName}: ${error.message}`);
      process.exitCode = 1;
    }
  }

  const exampleFill = calculateFillPercentage(600, 100, 200);
  console.log('Calculo de enchimento:');
  console.log(JSON.stringify({
    emptyDistanceMm: 600,
    fullDistanceMm: 100,
    currentDistanceMm: 200,
    fillPercentage: exampleFill,
    status: getCollectorStatus(exampleFill, new Date().toISOString(), 0)
  }, null, 2));
}

run();
