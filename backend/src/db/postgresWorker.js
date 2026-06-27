const fs = require('node:fs');
const { parentPort, workerData } = require('node:worker_threads');
const { Client, types } = require('pg');

const STATE_INDEX = 0;
const OK_INDEX = 1;

types.setTypeParser(20, (value) => Number(value));

function sslOptions(connectionString) {
  if (String(connectionString || '').includes('sslmode=require')) {
    return { rejectUnauthorized: false };
  }

  return undefined;
}

const state = new Int32Array(workerData.sharedBuffer);
const client = new Client({
  connectionString: workerData.connectionString,
  ssl: sslOptions(workerData.connectionString)
});
const ready = client.connect();

async function runRequest(request) {
  await ready;

  if (request.type === 'exec') {
    await client.query(request.sql);
    return { rows: [], rowCount: 0 };
  }

  if (request.type === 'columns') {
    const result = await client.query(`
      SELECT column_name AS name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
      ORDER BY ordinal_position
    `, [request.table]);
    return { rows: result.rows, rowCount: result.rowCount };
  }

  if (request.type === 'query') {
    const result = await client.query(request.sql, request.params || []);
    return { rows: result.rows, rowCount: result.rowCount };
  }

  throw new Error(`Tipo de requisicao PostgreSQL invalido: ${request.type}`);
}

parentPort.on('message', async (message) => {
  let ok = 1;
  let response;

  try {
    const request = JSON.parse(fs.readFileSync(message.requestFile, 'utf8'));
    response = await runRequest(request);
  } catch (error) {
    ok = 0;
    response = {
      message: error.message,
      stack: error.stack
    };
  }

  fs.writeFileSync(message.responseFile, JSON.stringify(response));
  Atomics.store(state, OK_INDEX, ok);
  Atomics.store(state, STATE_INDEX, message.id);
  Atomics.notify(state, STATE_INDEX, 1);
});
