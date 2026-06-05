const http = require('node:http');
const { app } = require('./app');
const { initDb } = require('./db/database');
const { seedDatabaseIfEmpty } = require('./db/seed');
const { autoSeedDemoData, port } = require('./config');

initDb();

if (autoSeedDemoData) {
  const seedResult = seedDatabaseIfEmpty();
  console.log(seedResult.seeded
    ? `Dados demo criados: ${seedResult.devices_count} dispositivos.`
    : `Dados demo existentes: ${seedResult.devices_count} dispositivos.`);
}

http.createServer(app).listen(port, () => {
  console.log(`ID Sensor backend rodando na porta ${port}`);
});
