const crypto = require('node:crypto');

const passwordHash = process.env.BATHROOM_MANAGEMENT_PASSWORD_HASH
  || 'f9647bede676b76ffc2d6058a193389e4b6ebc4bd0edee6ad4782a02c598bd5d';
const sessions = new Map();
const attempts = new Map();
const sessionDuration = 8 * 60 * 60 * 1000;

function passwordMatches(password) {
  const actual = crypto.scryptSync(String(password || ''), 'bathroom-management-v2', 32);
  const expected = Buffer.from(passwordHash, 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
}

function sessionFromRequest(req) {
  const cookie = String(req.headers.cookie || '').split(';').map(part => part.trim())
    .find(part => part.startsWith('bathroom_management='));
  const token = cookie?.slice('bathroom_management='.length);
  const expires = sessions.get(token);
  if (!expires || expires <= Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function login(req, res, password) {
  const now = Date.now();
  for (const [key, expires] of sessions) if (expires <= now) sessions.delete(key);
  for (const [key, attempt] of attempts) if (attempt.until <= now) attempts.delete(key);
  const key = req.socket.remoteAddress || 'unknown';
  const attempt = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
  if (attempt.count >= 10) return 429;
  if (!passwordMatches(password)) {
    attempt.count += 1;
    attempts.set(key, attempt);
    return 401;
  }
  attempts.delete(key);
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, now + sessionDuration);
  const secure = req.socket.encrypted || req.headers['x-forwarded-proto'] === 'https';
  res.setHeader('Set-Cookie', `bathroom_management=${token}; Path=/api/bathroom-checklists; HttpOnly; SameSite=Strict; Max-Age=28800${secure ? '; Secure' : ''}`);
  return 200;
}

function logout(req, res) {
  const cookie = String(req.headers.cookie || '').split(';').map(part => part.trim())
    .find(part => part.startsWith('bathroom_management='));
  if (cookie) sessions.delete(cookie.slice('bathroom_management='.length));
  res.setHeader('Set-Cookie', 'bathroom_management=; Path=/api/bathroom-checklists; HttpOnly; SameSite=Strict; Max-Age=0');
}

function normalizeService(value, now = Date.now()) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'object' || !['sim', 'nao'].includes(value.has_ticket)) {
    throw new Error('Informe se a solicitação tem chamado.');
  }
  const ticket = String(value.ticket_number || '').trim().slice(0, 80);
  if (value.has_ticket === 'sim' && !ticket) throw new Error('Informe o número do chamado.');
  const dates = ['started_at', 'arrived_at', 'finished_at'].map(key => {
    const date = new Date(value[key] || '');
    if (!Number.isFinite(date.getTime()) || date.getTime() > now + 300000) {
      throw new Error('Confirme a chegada e a conclusão do atendimento.');
    }
    return date;
  });
  if (dates[0] > dates[1] || dates[1] > dates[2]) throw new Error('A sequência do atendimento é inválida.');
  return {
    has_ticket: value.has_ticket,
    ticket_number: value.has_ticket === 'sim' ? ticket : '',
    started_at: dates[0].toISOString(),
    arrived_at: dates[1].toISOString(),
    finished_at: dates[2].toISOString()
  };
}

module.exports = { sessionFromRequest, login, logout, normalizeService, passwordMatches };
