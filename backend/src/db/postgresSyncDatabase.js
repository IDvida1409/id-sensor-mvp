const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const REQUEST_TIMEOUT_MS = Number(process.env.POSTGRES_SYNC_TIMEOUT_MS || 30000);
const STATE_INDEX = 0;
const OK_INDEX = 1;

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) && !Buffer.isBuffer(value);
}

function normalizeSql(sql) {
  return String(sql)
    .replace(/\bINSERT\s+OR\s+IGNORE\b/gi, 'INSERT ON CONFLICT DO NOTHING');
}

function bindNamedParams(sql, params) {
  const values = [];
  const indexes = new Map();
  const boundSql = normalizeSql(sql).replace(/@([A-Za-z_][A-Za-z0-9_]*)/g, (match, name) => {
    if (!Object.prototype.hasOwnProperty.call(params, name)) {
      throw new Error(`Parametro SQL ausente: ${name}`);
    }

    if (!indexes.has(name)) {
      values.push(params[name]);
      indexes.set(name, values.length);
    }

    return `$${indexes.get(name)}`;
  });

  return { sql: boundSql, params: values };
}

function bindPositionalParams(sql, params) {
  let index = 0;
  const boundSql = normalizeSql(sql).replace(/\?/g, () => `$${++index}`);
  return { sql: boundSql, params };
}

function bindSql(sql, args) {
  if (args.length === 1 && isPlainObject(args[0])) {
    return bindNamedParams(sql, args[0]);
  }

  return bindPositionalParams(sql, args);
}

class PostgresSyncStatement {
  constructor(database, sql) {
    this.database = database;
    this.sql = sql;
  }

  all(...args) {
    const query = bindSql(this.sql, args);
    return this.database.query(query.sql, query.params).rows;
  }

  get(...args) {
    return this.all(...args)[0];
  }

  run(...args) {
    const query = bindSql(this.sql, args);
    const result = this.database.query(query.sql, query.params);
    return {
      changes: Number(result.rowCount || 0)
    };
  }
}

class PostgresSyncDatabase {
  constructor(connectionString) {
    this.dialect = 'postgres';
    this.nextRequestId = 1;
    this.sharedBuffer = new SharedArrayBuffer(8);
    this.state = new Int32Array(this.sharedBuffer);
    this.tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'idsensor-pg-'));
    this.worker = new Worker(path.resolve(__dirname, './postgresWorker.js'), {
      workerData: {
        connectionString,
        sharedBuffer: this.sharedBuffer
      }
    });
  }

  request(type, payload = {}) {
    const id = this.nextRequestId++;
    const requestFile = path.join(this.tmpDir, `${id}.request.json`);
    const responseFile = path.join(this.tmpDir, `${id}.response.json`);

    fs.writeFileSync(requestFile, JSON.stringify({ type, ...payload }));
    Atomics.store(this.state, STATE_INDEX, 0);
    Atomics.store(this.state, OK_INDEX, 0);

    this.worker.postMessage({ id, requestFile, responseFile });
    const waitResult = Atomics.wait(this.state, STATE_INDEX, 0, REQUEST_TIMEOUT_MS);
    if (waitResult === 'timed-out') {
      throw new Error(`Timeout aguardando PostgreSQL apos ${REQUEST_TIMEOUT_MS}ms.`);
    }

    const rawResponse = fs.readFileSync(responseFile, 'utf8');
    fs.rmSync(requestFile, { force: true });
    fs.rmSync(responseFile, { force: true });

    const response = JSON.parse(rawResponse);
    if (!Atomics.load(this.state, OK_INDEX)) {
      throw new Error(response.message || 'Erro desconhecido no PostgreSQL.');
    }

    return response;
  }

  exec(sql) {
    return this.request('exec', { sql: normalizeSql(sql) });
  }

  prepare(sql) {
    return new PostgresSyncStatement(this, sql);
  }

  query(sql, params) {
    return this.request('query', { sql, params });
  }

  columns(table) {
    return this.request('columns', { table }).rows;
  }
}

module.exports = {
  PostgresSyncDatabase
};
