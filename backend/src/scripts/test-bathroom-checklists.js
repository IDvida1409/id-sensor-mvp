const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { DatabaseSync } = require('node:sqlite');

const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'bathroom-checklists-'));
process.env.DATABASE_URL = '';
process.env.DATABASE_PATH = path.join(testDirectory, 'test.db');
process.env.AUTO_SEED_DEMO_DATA = 'false';
process.env.MQTT_BRIDGE_ENABLED = 'false';

test('migration, access control and service records', async () => {
  const original = new DatabaseSync(process.env.DATABASE_PATH);
  original.exec(`CREATE TABLE bathroom_checklists (
    id TEXT PRIMARY KEY, bathroom_id TEXT NOT NULL, bathroom_name TEXT NOT NULL,
    location_name TEXT NOT NULL, bathroom_gender TEXT NOT NULL, people_count INTEGER NOT NULL,
    reason TEXT NOT NULL, clean_level TEXT NOT NULL, odor_level TEXT NOT NULL,
    condition_json TEXT NOT NULL, supplies_json TEXT NOT NULL, replenishments_json TEXT NOT NULL,
    actions_json TEXT NOT NULL, notes TEXT, responsible_name TEXT, created_at TEXT NOT NULL
  )`);
  const legacy = ['legacy', 'atrium-feminino', 'Banheiro Feminino - Atrium', 'Atrium', 'Feminino', 10, 'limpeza', 'sim', 'nao', '{}', '{}', '[]', '["limpeza_rapida"]', 'Preservar esta observação.', 'Responsável original', '2026-09-01T12:00:00.000Z'];
  original.prepare('INSERT INTO bathroom_checklists VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(...legacy);
  original.close();
  const { initDb, getDb } = require('../db/database');
  initDb(); initDb();
  const oldRow = getDb().prepare('SELECT * FROM bathroom_checklists WHERE id = ?').get('legacy');
  assert.deepEqual(Object.values(oldRow).slice(0, 16), legacy);
  assert.equal(oldRow.service_json, null);
  const { app } = require('../app');
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (route, options) => fetch(base + route, options);
  try {
    for (const route of ['/api/bathroom-checklists', '/api/bathroom-checklists/report']) assert.equal((await request(route)).status, 401);
    assert.equal((await request('/api/bathroom-checklists/history?confirm=limpar-historico-checklists', { method: 'DELETE' })).status, 401);
    assert.equal((await request('/api/bathroom-checklists/config')).status, 200);
    assert.equal((await request('/api/bathroom-checklists/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'wrong' }) })).status, 401);
    const auth = await request('/api/bathroom-checklists/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'einstein12345678' }) });
    assert.equal(auth.status, 200);
    const cookie = auth.headers.get('set-cookie');
    assert.match(cookie, /HttpOnly/); assert.match(cookie, /SameSite=Strict/);
    const headers = { 'Content-Type': 'application/json', Cookie: cookie.split(';')[0] };
    const now = Date.now();
    const service = { has_ticket: 'sim', ticket_number: '123', started_at: new Date(now - 900000).toISOString(), arrived_at: new Date(now - 600000).toISOString(), finished_at: new Date(now).toISOString() };
    const payload = { bathroom_id: 'atrium-feminino', people_count: 10, reason: 'limpeza', condition: { clean_level: 'parcial', odor_level: 'leve', detalhe_manutencao: true }, supplies: { papel_higienico: 'baixo' }, replenishments: [{ item: 'papel_higienico', quantity: 2, unit: 'rolos' }], actions: ['limpeza_rapida', 'reposicao_papel', 'manutencao'], responsible_name: 'Teste', notes: 'Observação de teste', service };
    const saved = await request('/api/bathroom-checklists', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    assert.equal(saved.status, 201);
    const publicRecord = (await saved.json()).data;
    assert.equal(publicRecord.service, undefined);
    const response = await request('/api/bathroom-checklists?limit=20000', { headers });
    const records = (await response.json()).data;
    const record = records.find(item => item.id === publicRecord.id);
    assert.deepEqual(record.service, service);
    assert.equal(record.replenishments[0].quantity, 2);
    assert.equal(record.condition.detalhe_manutencao, true);
    assert.equal(records.find(item => item.id === 'legacy').notes, legacy[13]);
    assert.equal(records.find(item => item.id === 'legacy').service, null);
    assert.equal((await request('/api/bathroom-checklists/report', { headers })).status, 200);
    const invalid = { ...payload, service: { ...service, arrived_at: service.finished_at, finished_at: service.started_at } };
    assert.equal((await request('/api/bathroom-checklists', { method: 'POST', headers, body: JSON.stringify(invalid) })).status, 400);
    const noTicket = { ...payload, service: { ...service, has_ticket: 'nao', ticket_number: '' } };
    assert.equal((await request('/api/bathroom-checklists', { method: 'POST', headers, body: JSON.stringify(noTicket) })).status, 201);
    assert.equal(getDb().prepare('SELECT COUNT(*) AS count FROM bathroom_checklists').get().count, 3);
    await request('/api/bathroom-checklists/access', { method: 'DELETE', headers });
    assert.equal((await request('/api/bathroom-checklists', { headers })).status, 401);
  } finally { await new Promise(resolve => server.close(resolve)); getDb().close(); }
});
