(() => {
  'use strict';
  const root = document.getElementById('ids-qr-preview');
  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];
  let code = window.IDSENSOR_QR_CODE || '', current = null, access = '', identified = null, replaceProbe = null, scanner = null, busy = false, lastUpdated = 0;
  const status = $('#qr-live-status');
  const endpoint = suffix => '/api/qr/' + encodeURIComponent(code) + (suffix || '');
  const temp = value => value === null || value === undefined || !Number.isFinite(Number(value)) ? '--' : Number(value).toFixed(1) + '°C';
  const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? value.split('-').reverse().join('/') : 'Não cadastrado';
  const text = (selector, value) => { const el = $(selector); if (el) el.textContent = value; };
  async function api(suffix, body) {
    const response = await fetch(endpoint(suffix), { method: body === undefined ? 'GET' : 'POST', cache: 'no-store', headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(access ? { Authorization: 'Bearer ' + access } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.message || 'Não foi possível concluir a operação.');
    return result.data;
  }
  function showStatus(message) { status.hidden = false; status.textContent = message; }
  let teaserTimer;
  function setTeaserVisible(visible) {
    const teaser = $('#qr-help-teaser');
    teaser.classList.toggle('is-visible', visible);
    teaser.setAttribute('aria-hidden', String(!visible));
    teaser.inert = !visible;
  }
  function hideTeaser() { clearTimeout(teaserTimer); setTeaserVisible(false); }
  function scheduleTeaser(delay = 3000) {
    hideTeaser();
    teaserTimer = setTimeout(() => {
      setTeaserVisible(true);
      teaserTimer = setTimeout(() => { setTeaserVisible(false); scheduleTeaser(24000); }, 6000);
    }, delay);
  }
  function showTab(name) {
    if (name === 'temperature' && !document.hidden) scheduleTeaser(); else hideTeaser();
    if (name !== 'replace') stopCamera();
    $$('[data-panel]').forEach(p => p.hidden = p.dataset.panel !== name);
    $$('.nav-button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.go === name)));
    if (name !== 'certificate') { $('#qr-certificate-summary').hidden = false; $('#qr-certificate-viewer').hidden = true; }
  }
  function step(name) { $$('[id^="qr-swap-"]').forEach(el => el.hidden = el.id !== 'qr-swap-' + name); if (!$('.page-content').hidden) $('#qr-swap-' + name)?.scrollIntoView({block:'start'}); }
  function clearAccess() { access = ''; identified = null; replaceProbe = null; $('#qr-access-key').value = ''; }
  function render() {
    const { card, sensor, stabilizing } = current;
    text('.location', card.clientName || 'Cliente');
    text('h1', card.local || card.unitName || 'Área monitorada');
    text('.location-detail', card.name);
    let infoLink = $('#qr-device-info-link');
    if (!infoLink) { infoLink = document.createElement('a'); infoLink.id = 'qr-device-info-link'; infoLink.textContent = 'Informações do dispositivo →'; $('.location-detail').after(infoLink); }
    infoLink.href = '/dispositivo/' + encodeURIComponent(sensor.mac);
    text('.device-name', card.name);
    const state = !card.online ? 'offline' : stabilizing ? 'blue' : card.state;
    const cardEl = $('#qr-sensor-card');
    cardEl.classList.toggle('high', state === 'warn' || state === 'crit');
    cardEl.style.background = state === 'crit' ? 'linear-gradient(135deg,#7a2449,#c43b46)' : '';
    text('#qr-temp-value', temp(card.temp));
    const values = $$('.metric-value');
    values[0].textContent = temp(card.dailyMin); values[1].textContent = temp(card.dailyMax);
    text('.battery span', card.battery == null ? '--%' : card.battery + '%');
    text('.humidity span', card.hum1 == null ? '--%' : card.hum1 + '%');
    $('.battery-level').style.width = (card.battery || 0) + '%';
    const comm = $('.communication img'); comm.src = card.online ? '/assets/comm-online.png' : '/assets/comm-offline.png';
    $('.communication').hidden = false;
    let label = $('#qr-live-stabilization');
    if (!label) { label = document.createElement('div'); label.id = 'qr-live-stabilization'; label.className = 'stabilization-state'; $('#qr-temp-value').after(label); }
    label.hidden = !stabilizing; label.textContent = 'Temperatura em estabilização — troca de dispositivo';
    cardEl.style.minHeight = stabilizing ? '385px' : '';
    text('#qr-reading-label', card.online ? 'Última leitura: ' + (card.updated || 'não informada') : 'Equipamento sem comunicação — ' + (card.updated || 'aguardando leitura'));
    $('.online-dot').style.background = card.online ? '#39b56b' : '#bc4b4b';
    text('.range-note', 'Faixa configurada: ' + temp(card.min) + ' a ' + temp(card.max) + ' · Somente consulta');
    $$('[data-current-mac]').forEach(el => el.textContent = sensor?.mac || 'MAC ainda não vinculado');
    text('#qr-calibrated-date', date(sensor?.calibrated_on)); text('#qr-expiration-date', date(sensor?.expires_on));
    const days = sensor ? (Date.parse(sensor.expires_on + 'T23:59:59Z') - Date.now()) / 86400000 : null;
    const validity = days == null ? 'missing' : days < 0 ? 'expired' : days <= 30 ? 'warning' : 'valid';
    $('.calibration-panel').dataset.validity = validity;
    const colors = { missing: '#718397', expired: '#b33c42', warning: '#b66b25', valid: '#205780' };
    $('#qr-certificate-validity').style.color = colors[validity];
    text('#qr-validity-text', { missing: 'Certificado não cadastrado para o dispositivo instalado', expired: 'Prazo de calibração vencido', warning: 'Próximo do vencimento', valid: 'Dentro do prazo' }[validity]);
    $('.calibration-seal').src = '/assets/icone-certificado-' + (validity === 'expired' ? 'vermelho' : validity === 'warning' ? 'laranja' : 'azul') + '-painel-atual.png';
    $('.calibration-seal').style.filter = validity === 'missing' ? 'grayscale(1)' : '';
    $('#qr-view-certificate').disabled = !sensor;
    $('#qr-certificate-example').textContent = 'Certificado de exemplo para demonstração ao cliente.';
    const thumb = $('.document-thumbnail'); thumb.hidden = true;
    text('#qr-swap-key .location', card.name + ' · ' + (card.local || ''));
    $$('#qr-swap-key .info-row strong').forEach((el, i) => el.textContent = [card.local, card.name, sensor?.mac || 'Não vinculado'][i] || '—');
    status.hidden = true;
    if (current.demonstration) showStatus('Demonstração — temperaturas e dispositivos simulados.');
    $('.page-content').hidden = false;
    cardEl.setAttribute('aria-label', card.name + '. Temperatura ' + temp(card.temp) + (stabilizing ? '. Em estabilização por troca de dispositivo.' : ''));
  }
  async function refresh() {
    try { current = await api(); lastUpdated = Date.now(); render(); }
    catch (error) { showStatus(error.message + (lastUpdated ? ' A leitura exibida não foi atualizada.' : '')); if (!lastUpdated) $('.page-content').hidden = true; }
  }
  function renderIdentified() {
    const info = $('.device-identification');
    const profile = ['minew-probe', 'white-probe', 'white', 'mst01-pt100-aprovado', 'mst01-aprovado'].includes(identified.image_profile) ? identified.image_profile : 'white';
    info.querySelector('img').src = '/consulta/assets/' + profile + '.webp';
    const fields = info.querySelectorAll('dd');
    fields[0].textContent = identified.mac; fields[1].textContent = date(identified.calibrated_on); fields[2].textContent = identified.manufacturer;
    const caption = $('#qr-swap-probe .location'); caption.textContent = identified.model;
    $$('[name="qr-probe-choice"]').forEach(input => input.checked = false);
    $('#qr-probe-continue').disabled = true; $('#qr-probe-explanation').hidden = true;
    text('#qr-confirm-probe-choice', 'Selecione a opção');
    text('#qr-confirm-stabilization', 'Somente se o cabo for substituído');
  }
  function renderConfirmation() {
    const currentMac = current.sensor?.mac || 'Não vinculado';
    const items = $$('#qr-swap-confirm .swap-comparison strong'); items[0].textContent = currentMac; items[1].textContent = identified.mac;
    const fields = $$('#qr-swap-confirm .sensor-info .info-row strong');
    fields[0].textContent = current.card.local || '—'; fields[1].textContent = current.card.name;
    fields[2].textContent = 'Do dispositivo novo'; fields[3].textContent = identified.has_probe ? replaceProbe ? 'Substituir o cabo' : 'Manter o cabo atual' : 'Sem cabo externo';
    fields[4].textContent = (!identified.has_probe || replaceProbe) ? 'Até atingir a faixa configurada' : 'Manter a probe atual';
    text('#qr-swap-stabilization-note', identified.has_probe && replaceProbe ? 'Confira o dispositivo e a substituição do cabo antes de confirmar.' : 'Será trocado somente o dispositivo.');
    step('confirm');
  }
  async function identify(raw) {
    if (busy) return false;
    busy = true;
    try { identified = await api('/identify', { scanned: raw }); replaceProbe = null; stopCamera(); renderIdentified(); identified.has_probe ? step('probe') : renderConfirmation(); return true; }
    catch (error) { showStatus(error.message); return { accepted: false, message: error.message }; }
    finally { busy = false; }
  }
  function stopCamera() { scanner?.close(); }
  function startCamera() {
    if (!scanner) scanner = window.IDSensorQrScanner.create({ root, onCode: identify });
    scanner.open();
  }
  async function commit() {
    if (busy || !identified) return;
    busy = true; $('#qr-real-commit').disabled = true;
    try {
      const result = await api('/replace', { scanned: identified.mac, replaceProbe: identified.has_probe ? replaceProbe : false });
      closeSwapNotice(); code = result.nextCode; clearAccess();
      history.replaceState(null, '', '/q/' + encodeURIComponent(code));
      await refresh(); step('success'); showTab('replace');
      const fields = $$('#qr-swap-success .sensor-info .info-row strong');
      fields[0].textContent = result.sensor.mac; fields[1].textContent = current.card.local; fields[2].textContent = 'Do dispositivo novo';
      text('#qr-success-stabilization-note', result.stabilizing ? 'Temperatura em estabilização — troca de dispositivo. O modo termina quando a leitura atingir a faixa configurada. Alertas de falta de comunicação continuam ativos.' : 'Dispositivo substituído. A leitura continua sincronizada com o painel.');
    } catch (error) { showStatus(error.message); }
    finally { busy = false; $('#qr-real-commit').disabled = false; }
  }
  $$('[data-shared-ref]').forEach(img => { const source = $('[data-shared-id="' + img.dataset.sharedRef + '"]'); if (source) img.src = source.src; });
  $$('[data-copy-from]').forEach(img => { const source = $(img.dataset.copyFrom); if (source) img.src = source.src; });
  $$('[data-go]').forEach(button => button.addEventListener('click', () => { const name = button.dataset.go; if (name === 'replace' && !access) step('key'); showTab(name); }));
  $$('[data-swap-back]').forEach(button => button.addEventListener('click', () => { stopCamera(); step(button.dataset.swapBack); }));
  $$('.tip button').forEach(button => button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(open)); $('#' + button.getAttribute('aria-controls')).hidden = !open; }));
  $('#qr-key-form').addEventListener('submit', async event => {
    event.preventDefault(); const key = $('#qr-access-key').value; $('#qr-access-key').value = '';
    try { const result = await api('/access', { key }); access = result.token; $('#qr-key-feedback').hidden = true; step('scan'); }
    catch (error) { $('#qr-key-feedback').hidden = false; text('#qr-key-feedback', error.message); }
  });
  $('#qr-simulate-scan').addEventListener('click', startCamera);
  $('#qr-swap-key .key-hint').textContent = 'Chave para testar esta demonstração: 12345678.';
  const manual = document.createElement('form'); manual.innerHTML = '<label class="field-label" for="qr-manual-code">Ou digite o MAC / código do dispositivo novo</label><input class="key-input" id="qr-manual-code" required autocomplete="off" placeholder="MAC ou link do QR"><button type="submit" class="action secondary">Identificar dispositivo</button>';
  $('#qr-swap-scan').append(manual); manual.addEventListener('submit', event => { event.preventDefault(); identify($('#qr-manual-code').value); });
  const examples=document.createElement('a');examples.href='/consulta/demo.html';examples.target='_blank';examples.rel='noopener';examples.className='back-action swap-back';examples.textContent='Ver QR Codes dos dispositivos de exemplo';$('#qr-swap-scan').append(examples);
  const report=document.createElement('button');report.type='button';report.className='action secondary';report.textContent='Baixar relatório da demonstração';$('#qr-swap-success').append(report);
  report.addEventListener('click',async()=>{try{const result=await api('/report'),swap=result.replacement;if(!swap)return;const rows=[['Equipamento','Início','Fim','MAC novo','Justificativa'],[result.equipment,swap.startedAt,swap.finishedAt||'Em estabilização',swap.sensor.mac,swap.justification || 'Troca somente do dispositivo']];const csv='\uFEFF'+rows.map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='relatorio-demonstracao-troca.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){showStatus(error.message);}});
  $$('[name="qr-probe-choice"]').forEach(input => input.addEventListener('change', () => { replaceProbe = input.value === 'replace'; $('#qr-probe-continue').disabled = false; $('#qr-probe-explanation').hidden = true; }));
  $('#qr-probe-continue').addEventListener('click', () => { if (replaceProbe !== null) renderConfirmation(); });
  function closeSwapNotice() { const notice = $('#qr-real-notice'); if (notice.open) notice.close(); notice.hidden = true; }
  $('#qr-confirm-swap').addEventListener('click', () => {
    if (!identified) return;
    if (!identified.has_probe || replaceProbe) {
      text('#qr-notice-intro', identified.has_probe ? 'Ao confirmar a troca do dispositivo e do cabo de temperatura, será iniciado o período de estabilização da leitura.' : 'Ao confirmar a troca do dispositivo, será iniciado o período de estabilização da leitura.');
      const notice = $('#qr-real-notice'); notice.hidden = false; notice.showModal(); $('#qr-real-commit').focus();
    } else commit();
  });
  $('#qr-real-notice').addEventListener('cancel', event => { event.preventDefault(); closeSwapNotice(); $('#qr-confirm-swap').focus(); });
  $('#qr-real-commit').addEventListener('click', commit);
  $('#qr-real-cancel').addEventListener('click', () => { closeSwapNotice(); $('#qr-confirm-swap').focus(); });
  $('#qr-real-notice').addEventListener('keydown', event => { if (event.key === 'Escape') $('#qr-real-cancel').click(); if (event.key === 'Tab') { const target = event.shiftKey ? $('#qr-real-cancel') : $('#qr-real-commit'); if ((event.target === $('#qr-real-cancel') && !event.shiftKey) || (event.target === $('#qr-real-commit') && event.shiftKey)) { event.preventDefault(); target.focus(); } } });
  $('#qr-view-certificate').addEventListener('click', () => { if (current.sensor) window.open(endpoint('/certificate'), '_blank', 'noopener'); });
  $('#qr-close-document').addEventListener('click', () => { $('#qr-certificate-viewer').hidden = true; $('#qr-certificate-summary').hidden = false; });
  window.addEventListener('pagehide', () => { stopCamera(); hideTeaser(); }); document.addEventListener('visibilitychange', () => { if (document.hidden) { stopCamera(); hideTeaser(); } else { refresh(); if (!$('[data-panel="temperature"]').hidden) scheduleTeaser(); } });
  showTab(location.hash === '#trocar' ? 'replace' : 'temperature'); step('key'); refresh(); setInterval(() => { if (!document.hidden && !busy) refresh(); }, 10000);
})();
