/**
 * Cliente HTTP para integração backend (blueprint).
 */
const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export async function apiGet(url){
  const res = await fetch(url, { method: 'GET', headers: DEFAULT_HEADERS });
  if(!res.ok) throw new Error(`GET ${url} falhou com ${res.status}`);
  return res.json();
}

export async function apiPost(url, body){
  const res = await fetch(url, { method: 'POST', headers: DEFAULT_HEADERS, body: JSON.stringify(body || {}) });
  if(!res.ok) throw new Error(`POST ${url} falhou com ${res.status}`);
  return res.json();
}

export async function apiPatch(url, body){
  const res = await fetch(url, { method: 'PATCH', headers: DEFAULT_HEADERS, body: JSON.stringify(body || {}) });
  if(!res.ok) throw new Error(`PATCH ${url} falhou com ${res.status}`);
  return res.json();
}
