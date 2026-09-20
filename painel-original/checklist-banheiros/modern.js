(() => {
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const flags = [['piso_molhado', 'Piso molhado'], ['lixeira_cheia', 'Lixeira cheia'], ['vaso_sujo', 'Vaso/mictório sujo'], ['pia_suja', 'Pia/bancada suja'], ['detalhe_manutencao', 'Necessita de manutenção']];
  const actionLabels = { limpeza_completa: 'Limpeza completa', limpeza_rapida: 'Limpeza rápida', reposicao_papel: 'Reposição de papel', reposicao_sabonete: 'Reposição de sabonete', reposicao_alcool: 'Reposição de álcool / outro insumo', reposicao_protetor_assento: 'Reposição de protetor de assento', reposicao_absorvente: 'Reposição de absorvente', correcao_odor: 'Correção de odor', manutencao: 'Manutenção', nenhuma_acao: 'Nenhuma ação necessária' };
  let config, api, form, content, refreshAnalysis, draft = {}, step = 'bathroom', busy = false, accessPromise;
  const storageKey = 'bathroom-checklist-draft-v2';
  function persist() { try { localStorage.setItem(storageKey, JSON.stringify({ draft, step })); } catch {} }
  function capture() {
    for (const input of content.querySelectorAll('input,select,textarea')) {
      if (input.type === 'checkbox') draft[input.name] = input.checked;
      else if (input.type !== 'radio' || input.checked) draft[input.name] = input.value;
    }
    persist();
  }
  function choices(name, options) {
    return `<div class="m-options">${options.map(([value, label]) => `<label><input type="radio" required name="${name}" value="${value}" ${draft[name] === value ? 'checked' : ''}>${escape(label)}</label>`).join('')}</div>`;
  }
  function field(name, label, type = 'text', fallback = '', required = false) {
    return `<label class="m-field">${label}<input type="${type}" name="${name}" value="${escape(draft[name] ?? fallback)}" ${required ? 'required' : ''} ${type === 'number' ? 'min="0" step="0.01" inputmode="decimal"' : ''}></label>`;
  }
  function hasSupplies() { return draft.reason === 'reposicao' || (draft.reason === 'limpeza' && draft.also_supply === 'sim'); }
  function hasCleaning() { return draft.reason === 'limpeza' || (draft.reason === 'reposicao' && draft.also_clean === 'sim'); }
  function path() { return ['bathroom', 'ticket', 'presence', 'reason', ...(draft.reason === 'reposicao' ? ['also_clean'] : []), ...(hasCleaning() ? ['condition'] : []), ...(draft.reason === 'limpeza' ? ['also_supply'] : []), ...(hasSupplies() ? ['supplies'] : []), 'finish']; }
  function replenishments() {
    return hasSupplies() ? config.supply_items.map(item => ({ item: item.key, quantity: Number(draft[`${item.key}_qty`] || 0), unit: String(draft[`${item.key}_unit`] || item.unit).trim() })).filter(item => item.quantity > 0) : [];
  }
  function actions() {
    const result = [];
    if (hasCleaning()) {
      const count = flags.slice(0, 4).filter(([key]) => draft[key]).length;
      result.push(draft.clean_level === 'nao' || draft.odor_level === 'forte' || count >= 2 ? 'limpeza_completa' : 'limpeza_rapida');
      if (draft.odor_level !== 'nao') result.push('correcao_odor');
      if (draft.detalhe_manutencao) result.push('manutencao');
    }
    const keys = replenishments().map(item => item.item);
    if (keys.includes('papel_higienico') || keys.includes('papel_toalha')) result.push('reposicao_papel');
    for (const [key, action] of [['sabonete', 'reposicao_sabonete'], ['alcool_outro', 'reposicao_alcool'], ['protetor_assento', 'reposicao_protetor_assento'], ['absorvente', 'reposicao_absorvente']]) if (keys.includes(key)) result.push(action);
    return result.length ? result : ['nenhuma_acao'];
  }
  function date(value) { return value ? new Date(value).toLocaleDateString('pt-BR') : '—'; }
  function time(value) { return value ? new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—'; }
  function draw() {
    const bathroom = config.bathrooms.find(item => item.id === draft.bathroom_id);
    $('#m-location').textContent = bathroom?.name || 'Checklist de banheiros';
    $('#m-step').textContent = `Etapa ${path().indexOf(step) + 1}`;
    $('#m-back').hidden = step === 'bathroom';
    $('#m-next').disabled = false;
    $('#m-next').textContent = step === 'ticket' ? 'Iniciar checklist' : step === 'finish' ? 'Finalizar checklist' : 'Continuar';
    $('#m-status').textContent = '';
    let html = '';
    if (step === 'bathroom') html = `<h2>Escolha o banheiro</h2><label class="m-field">Banheiro<select name="bathroom_id" required><option value="">Selecione</option>${config.bathrooms.map(item => `<option value="${escape(item.id)}" ${draft.bathroom_id === item.id ? 'selected' : ''}>${escape(item.name)}</option>`).join('')}</select></label>`;
    if (step === 'ticket') html = `<h2>A solicitação tem chamado?</h2>${choices('has_ticket', [['sim', 'Sim'], ['nao', 'Sem chamado']])}<div id="m-ticket-number" ${draft.has_ticket === 'sim' ? '' : 'hidden'}>${field('ticket_number', 'Número do chamado')}</div>`;
    if (step === 'presence') html = `<h2>A funcionária da limpeza está no local?</h2>${choices('presence', [['sim', 'Sim'], ['nao', 'Não']])}`;
    if (step === 'reason') html = `<h2>Motivo</h2>${choices('reason', [['limpeza', 'Limpeza'], ['reposicao', 'Reposição']])}`;
    if (step === 'also_clean') html = `<h2>Houve limpeza?</h2>${choices('also_clean', [['sim', 'Sim'], ['nao', 'Não']])}`;
    if (step === 'condition') html = `<h2>Checklist de condição</h2><fieldset><legend>Banheiro limpo?</legend>${choices('clean_level', [['sim', 'Sim'], ['parcial', 'Parcial'], ['nao', 'Não']])}</fieldset><fieldset><legend>Há odor?</legend>${choices('odor_level', [['nao', 'Não'], ['leve', 'Leve'], ['forte', 'Forte']])}</fieldset><fieldset><legend>Detalhes da limpeza</legend><div class="m-checks">${flags.map(([key, label]) => `<label><input type="checkbox" name="${key}" ${draft[key] ? 'checked' : ''}>${label}</label>`).join('')}</div></fieldset>`;
    if (step === 'also_supply') html = `<h2>Houve reposição?</h2>${choices('also_supply', [['sim', 'Sim'], ['nao', 'Não']])}`;
    if (step === 'supplies') html = `<h2>Checklist de insumos</h2>${config.supply_items.map(item => `<fieldset class="m-supply"><legend>${escape(item.label)}</legend>${choices(`${item.key}_level`, [['cheio', 'Cheio'], ['medio', 'Médio'], ['baixo', 'Baixo'], ['vazio', 'Vazio']])}<div class="m-two">${field(`${item.key}_qty`, 'Quantidade reposta', 'number', '0')}${field(`${item.key}_unit`, 'Unidade', 'text', item.unit)}</div></fieldset>`).join('')}`;
    if (step === 'finish') html = `<h2>Finalizar checklist</h2><div class="m-summary"><span>Motivo</span><strong>${draft.reason === 'limpeza' ? 'Limpeza' : 'Reposição'}</strong></div><div class="m-summary"><span>Chamado</span><strong>${draft.has_ticket === 'sim' ? escape(draft.ticket_number) : 'Sem chamado'}</strong></div><div class="m-summary"><span>Ação realizada automaticamente</span><strong>${actions().map(action => actionLabels[action]).join('<br>')}</strong></div>${replenishments().map(item => `<div class="m-summary"><span>${escape(config.supply_items.find(supply => supply.key === item.item)?.label)}</span><strong>${item.quantity.toLocaleString('pt-BR')} ${escape(item.unit)}</strong></div>`).join('')}${field('responsible_name', 'Responsável', 'text', '', true)}<label class="m-field">Observação<textarea name="notes" rows="3" placeholder="Ex.: papel baixo, odor forte, necessidade de manutenção...">${escape(draft.notes || '')}</textarea></label><div class="m-arrival">${draft.arrived_at ? '<p>Após a funcionária da limpeza terminar e sair do banheiro, finalize o checklist.</p><label class="m-confirm"><input type="checkbox" required name="left">A limpeza terminou e a funcionária já saiu do banheiro.</label>' : '<p>Quando a funcionária da limpeza chegar, confirme a chegada.</p><button type="button" id="m-arrival">Confirmar chegada</button>'}</div>`;
    content.innerHTML = `${draft.started_at ? `<div class="m-datetime"><span>Data <strong>${date(draft.started_at)}</strong></span><span>Hora <strong>${time(draft.started_at)}</strong></span></div>` : ''}${html}`;
    if (step === 'ticket') {
      const number = $('[name="ticket_number"]');
      number.required = draft.has_ticket === 'sim';
      content.querySelectorAll('[name="has_ticket"]').forEach(input => input.addEventListener('change', () => {
        $('#m-ticket-number').hidden = input.value !== 'sim';
        number.required = input.value === 'sim';
      }));
    }
    if (step === 'finish') {
      $('#m-next').disabled = !draft.arrived_at;
      $('#m-arrival')?.addEventListener('click', () => {
        capture(); draft.arrived_at = new Date().toISOString(); persist(); draw();
      });
    }
  }
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    capture();
    if (step === 'ticket' && !draft.started_at) draft.started_at = new Date().toISOString();
    if (step === 'presence' && draft.presence === 'sim' && !draft.arrived_at) draft.arrived_at = new Date().toISOString();
    if (step !== 'finish') { step = path()[path().indexOf(step) + 1]; persist(); draw(); return; }
    if (!draft.arrived_at || !draft.left) return;
    busy = true; $('#m-next').disabled = true; $('#m-status').textContent = 'Salvando checklist...';
    const condition = { clean_level: draft.clean_level || 'sim', odor_level: draft.odor_level || 'nao' };
    flags.forEach(([key]) => condition[key] = hasCleaning() && !!draft[key]);
    try {
      await api('/api/bathroom-checklists', { method: 'POST', body: JSON.stringify({ bathroom_id: draft.bathroom_id, people_count: 10, reason: draft.reason, condition, supplies: hasSupplies() ? Object.fromEntries(config.supply_items.map(item => [item.key, draft[`${item.key}_level`]])) : {}, replenishments: replenishments(), actions: actions(), responsible_name: draft.responsible_name.trim(), notes: draft.notes || '', service: { has_ticket: draft.has_ticket, ticket_number: draft.ticket_number || '', started_at: draft.started_at, arrived_at: draft.arrived_at, finished_at: new Date().toISOString() } }) });
      draft = {}; step = 'bathroom'; persist(); draw(); $('#m-status').textContent = 'Checklist salvo.';
    } catch (error) { $('#m-status').textContent = error.message; $('#m-next').disabled = false; }
    finally { busy = false; }
  }
  async function requestAccess() {
    if (accessPromise) return accessPromise;
    const session = await api('/api/bathroom-checklists/access');
    if (session.authenticated) return true;
    accessPromise = new Promise(resolve => {
      const dialog = document.createElement('dialog');
      dialog.className = 'm-access';
      dialog.innerHTML = '<form><h2>Acesso gerencial</h2><label class="m-field">Senha<input type="password" name="password" required autocomplete="current-password"></label><p class="m-error" role="alert"></p><div class="m-actions"><button type="button" class="secondary-button" id="m-cancel">Cancelar</button><button type="submit">Entrar</button></div></form>';
      document.body.append(dialog);
      dialog.addEventListener('close', () => { dialog.remove(); accessPromise = null; resolve(false); });
      dialog.querySelector('#m-cancel').onclick = () => dialog.close();
      dialog.querySelector('form').onsubmit = async event => {
        event.preventDefault();
        const button = dialog.querySelector('[type="submit"]'); button.disabled = true;
        try {
          await api('/api/bathroom-checklists/access', { method: 'POST', body: JSON.stringify({ password: dialog.querySelector('input').value }) });
          resolve(true); dialog.close();
        } catch (error) { dialog.querySelector('.m-error').textContent = error.message; button.disabled = false; }
      };
      dialog.showModal();
    });
    return accessPromise;
  }
  function bars(rows, color = '#0878af') {
    const max = Math.max(1, ...rows.map(row => row[1]));
    return rows.map(([label, count, unit = '']) => `<div class="m-bar"><span>${escape(label)}</span><div class="m-track"><div style="width:${count / max * 100}%;background:${color}"></div></div><strong>${count.toLocaleString('pt-BR')} ${escape(unit)}</strong></div>`).join('');
  }
  function levelBars(records, field, levels, colors) {
    return levels.map(([key, label], i) => {
      const count = records.filter(record => field(record) === key).length;
      const percent = records.length ? Math.round(count / records.length * 100) : 0;
      return `<div class="m-level"><div><span>${label}</span><strong>${count} · ${percent}%</strong></div><div class="m-track"><div style="width:${percent}%;background:${colors[i]}"></div></div></div>`;
    }).join('');
  }
  function duration(start, end) {
    if (!start || !end) return 'Tempo não registrado';
    const seconds = Math.max(0, Math.round((Date.parse(end) - Date.parse(start)) / 1000));
    return `${Math.floor(seconds / 60)} min${seconds % 60 ? ` ${seconds % 60} s` : ''}`;
  }
  function formatSeconds(seconds) {
    if (!Number.isFinite(seconds)) return 'Sem dados';
    const rounded = Math.max(0, Math.round(seconds));
    const hours = Math.floor(rounded / 3600);
    const minutes = Math.floor((rounded % 3600) / 60);
    const remainder = rounded % 60;
    if (hours) return `${hours} h${minutes ? ` ${minutes} min` : ''}`;
    return `${minutes} min${remainder ? ` ${remainder} s` : ''}`;
  }
  function timeMeasurement(record) {
    const started = Date.parse(record.service?.started_at || '');
    const arrived = Date.parse(record.service?.arrived_at || '');
    const finished = Date.parse(record.service?.finished_at || '');
    if (![started, arrived, finished].every(Number.isFinite) || started > arrived || arrived > finished) return null;
    return { wait: (arrived - started) / 1000, clean: (finished - arrived) / 1000 };
  }
  function bathroomGroups(records, currentConfig, selectedBathroomId) {
    const bathrooms = selectedBathroomId
      ? currentConfig.bathrooms.filter(item => item.id === selectedBathroomId)
      : currentConfig.bathrooms;
    return bathrooms.map(bathroom => ({ bathroom, records: records.filter(record => record.bathroom_id === bathroom.id) }));
  }
  function recordHasCleaning(record) {
    return record.reason === 'limpeza' || record.actions?.some(action => action.includes('limpeza'));
  }
  function recordHasReplenishment(record) {
    return record.reason === 'reposicao' || (record.replenishments || []).length > 0;
  }
  function compactTable(headers, rows, className = '') {
    if (!rows.length) return '<p class="m-sub">Nenhum registro no período selecionado.</p>';
    return `<div class="m-table-wrap"><table class="m-compact-table ${className}"><thead><tr>${headers.map(header => `<th>${escape(header)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, index) => `<${index ? 'td' : 'th'}>${cell}</${index ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function countBy(records, read, value) {
    return records.filter(record => read(record) === value).length.toLocaleString('pt-BR');
  }
  function formatQuantity(value) {
    return Number(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  }
  function replenishmentCell(records, item) {
    const quantities = new Map();
    let events = 0;
    records.forEach(record => (record.replenishments || []).filter(entry => entry.item === item.key).forEach(entry => {
      const unit = entry.unit || item.unit;
      quantities.set(unit, (quantities.get(unit) || 0) + Number(entry.quantity || 0));
      events++;
    }));
    if (!events) return '0';
    const amount = [...quantities].map(([unit, quantity]) => `${formatQuantity(quantity)} ${escape(unit)}`).join(' + ');
    return `${amount}<small>${events} ${events === 1 ? 'registro' : 'registros'}</small>`;
  }
  function timeOverview(records, groups) {
    const measured = records.map(record => ({ record, time: timeMeasurement(record) })).filter(item => item.time);
    const average = (items, key) => items.length ? items.reduce((sum, item) => sum + item.time[key], 0) / items.length : NaN;
    const total = (items, key) => items.reduce((sum, item) => sum + item.time[key], 0);
    const timeGroups = groups.flatMap(group => [
      { bathroom: group.bathroom.name, label: 'Com chamado', items: measured.filter(item => item.record.bathroom_id === group.bathroom.id && item.record.service?.has_ticket === 'sim') },
      { bathroom: group.bathroom.name, label: 'Sem chamado', items: measured.filter(item => item.record.bathroom_id === group.bathroom.id && item.record.service?.has_ticket === 'nao') }
    ]).map(group => ({ ...group, wait: average(group.items, 'wait'), clean: average(group.items, 'clean'), accumulated: total(group.items, 'wait') + total(group.items, 'clean') }));
    const cards = [
      [formatSeconds(average(measured, 'wait')), 'Tempo médio de espera'],
      [formatSeconds(average(measured, 'clean')), 'Tempo médio de limpeza'],
      [records.filter(record => record.service?.has_ticket === 'nao').length.toLocaleString('pt-BR'), 'Atendimentos sem chamado']
    ];
    const rows = timeGroups.map(group => [escape(group.bathroom), group.label, group.items.length.toLocaleString('pt-BR'), formatSeconds(group.wait), formatSeconds(group.clean), formatSeconds(group.wait + group.clean), group.items.length ? formatSeconds(group.accumulated) : 'Sem dados']);
    return `<section class="m-band m-time-overview"><h2>Resumo dos tempos</h2><p class="m-sub">Tempo de espera até a chegada e tempo de limpeza, separados por banheiro e por atendimento com ou sem chamado.</p><div class="m-time-cards">${cards.map(([value, label]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join('')}</div>${compactTable(['Banheiro', 'Atendimento', 'Medições', 'Espera média', 'Limpeza média', 'Tempo médio total', 'Tempo acumulado'], rows, 'm-time-summary-table')}<p class="m-sub">Calculado com ${measured.length} ${measured.length === 1 ? 'checklist que possui' : 'checklists que possuem'} medição de tempo. Registros antigos sem horários não entram nos cálculos.</p></section>`;
  }
  function times(records) {
    const cards = records.map(record => `<article class="m-record"><h3>${escape(record.bathroom_name)}</h3><dl><div><dt>Data e hora</dt><dd>${date(record.service?.started_at || record.created_at)} ${time(record.service?.started_at || record.created_at)}</dd></div><div><dt>Chamado</dt><dd>${record.service ? record.service.has_ticket === 'sim' ? escape(record.service.ticket_number) : 'Sem chamado' : 'Não registrado'}</dd></div><div><dt>Responsável</dt><dd>${escape(record.responsible_name)}</dd></div><div><dt>Chegada / Saída</dt><dd>${time(record.service?.arrived_at)} / ${time(record.service?.finished_at)}</dd></div><div><dt>Espera até a chegada</dt><dd>${duration(record.service?.started_at, record.service?.arrived_at)}</dd></div><div><dt>Tempo de limpeza</dt><dd>${duration(record.service?.arrived_at, record.service?.finished_at)}</dd></div><div class="m-wide"><dt>Observação</dt><dd>${escape(record.notes || '—')}</dd></div></dl></article>`).join('') || '<p>Nenhum checklist encontrado no período selecionado.</p>';
    const rows = records.map(record => `<tr><td>${escape(record.bathroom_name)}</td><td>${date(record.service?.started_at || record.created_at)}<br>${time(record.service?.started_at || record.created_at)}</td><td>${record.service ? record.service.has_ticket === 'sim' ? escape(record.service.ticket_number) : 'Sem chamado' : 'Não registrado'}</td><td>${escape(record.responsible_name)}</td><td>${time(record.service?.arrived_at)} / ${time(record.service?.finished_at)}</td><td>${duration(record.service?.started_at, record.service?.arrived_at)}</td><td>${duration(record.service?.arrived_at, record.service?.finished_at)}</td><td>${escape(record.notes || '—')}</td></tr>`).join('');
    return `<section class="m-band"><h2>Detalhamento dos tempos</h2><p class="m-sub">Espera: início do checklist até a confirmação de chegada. Limpeza: confirmação de chegada até a finalização.</p><div class="m-records">${cards}</div><div class="m-screen-time-table m-table-wrap"><table class="m-compact-table"><thead><tr><th>Banheiro</th><th>Data e hora</th><th>Chamado</th><th>Responsável</th><th>Chegada / Saída</th><th>Espera</th><th>Limpeza</th><th>Observação</th></tr></thead><tbody>${rows}</tbody></table></div><table class="m-print-time-table"><thead><tr><th>Banheiro</th><th>Data e hora</th><th>Chamado</th><th>Responsável</th><th>Chegada / Saída</th><th>Espera</th><th>Limpeza</th><th>Observação</th></tr></thead><tbody>${rows}</tbody></table></section>`;
  }
  function renderDashboard(records, currentConfig, filters) {
    const selectedBathroomId = $('#graphBathroom').value;
    const groups = bathroomGroups(records, currentConfig, selectedBathroomId);
    const individual = Boolean(selectedBathroomId);
    const cleaning = records.filter(recordHasCleaning);
    const supplyRecords = records.filter(record => Object.keys(record.supplies || {}).length);
    const metrics = [[records.length, 'Checklists realizados'], [cleaning.length, 'Limpeza'], [records.filter(recordHasReplenishment).length, 'Reposição'], [records.reduce((n, record) => n + Number(record.people_count || 0), 0), 'Pessoas acumuladas']];
    const dayCounts = new Map();
    records.forEach(record => { const key = date(record.created_at); dayCounts.set(key, (dayCounts.get(key) || 0) + 1); });
    const dailyRows = [...dayCounts].sort((a, b) => a[0].split('/').reverse().join('-').localeCompare(b[0].split('/').reverse().join('-')));
    const groupHeaders = ['Banheiro', 'Checklists', 'Limpeza', 'Reposição'];
    const serviceRows = groups.map(group => [escape(group.bathroom.name), group.records.length, group.records.filter(recordHasCleaning).length, group.records.filter(recordHasReplenishment).length]);
    const cleanRows = groups.map(group => [escape(group.bathroom.name), ...['sim', 'parcial', 'nao'].map(level => countBy(group.records.filter(recordHasCleaning), record => record.clean_level, level))]);
    const supplyHeaders = ['Insumo', ...groups.map(group => group.bathroom.name), ...(individual ? [] : ['Total'])];
    const replenishmentRows = currentConfig.supply_items.map(item => [escape(item.label), ...groups.map(group => replenishmentCell(group.records, item)), ...(individual ? [] : [replenishmentCell(records, item)])]);
    const levelRows = groups.flatMap(group => currentConfig.supply_items.map(item => {
      const label = individual ? escape(item.label) : `${escape(group.bathroom.name)}<small>${escape(item.label)}</small>`;
      return [label, ...['cheio', 'medio', 'baixo', 'vazio'].map(level => countBy(group.records.filter(record => record.supplies?.[item.key]), record => record.supplies[item.key], level))];
    }));
    const odorRows = groups.map(group => [escape(group.bathroom.name), ...['nao', 'leve', 'forte'].map(level => countBy(group.records.filter(recordHasCleaning), record => record.odor_level, level))]);
    const conditionRows = groups.map(group => [escape(group.bathroom.name), ...flags.map(([key]) => group.records.filter(record => recordHasCleaning(record) && (record.condition?.[key] || (key === 'detalhe_manutencao' && record.actions?.includes('manutencao')))).length)]);
    const actionHeaders = ['Ação', ...groups.map(group => group.bathroom.name), ...(individual ? [] : ['Total'])];
    const actionRows = Object.entries(actionLabels).map(([key, label]) => [escape(label), ...groups.map(group => group.records.filter(record => record.actions?.includes(key)).length), ...(individual ? [] : [records.filter(record => record.actions?.includes(key)).length])]);
    const callRows = groups.map(group => [escape(group.bathroom.name), group.records.filter(record => record.service?.has_ticket === 'sim').length, group.records.filter(record => record.service?.has_ticket === 'nao').length, group.records.filter(record => !record.service).length]);
    const title = individual ? `Resumo - ${escape(groups[0]?.bathroom.name || filters.bathroom)}` : 'Visão geral - Todos os banheiros';
    $('.m-dashboard-heading h1').innerHTML = title;
    $('#modernDashboard').innerHTML = `<p class="m-period">${escape(filters.from)} a ${escape(filters.to)} · ${escape(filters.bathroom)}</p><div class="metric-grid">${metrics.map(([count, label]) => `<article class="metric-card"><span>${label}</span><strong>${count.toLocaleString('pt-BR')}</strong></article>`).join('')}</div><div class="m-chart-pair"><section><h2>Banheiro limpo?</h2>${compactTable(['Banheiro', 'Sim', 'Parcial', 'Não'], cleanRows)}</section><section><h2>Checklists por dia</h2>${bars(dailyRows)}</section></div><section class="m-band"><h2>${individual ? 'Atendimentos deste banheiro' : 'Atendimentos por banheiro'}</h2><p class="m-sub">Limpeza e reposição mostram quantos checklists registraram cada atendimento. O mesmo checklist pode conter as duas ações.</p>${compactTable(groupHeaders, serviceRows)}</section><section class="m-band"><h2>Reposição realizada</h2><p class="m-sub">Quantidade reposta e número de registros, separados por banheiro.</p>${compactTable(supplyHeaders, replenishmentRows, 'm-supply-matrix')}</section><section class="m-band"><h2>Nível dos insumos por checklist</h2><p class="m-sub">Quantidade de checklists em que cada insumo foi encontrado em cada nível.</p>${compactTable([individual ? 'Insumo' : 'Banheiro / insumo', 'Cheio', 'Médio', 'Baixo', 'Vazio'], levelRows, 'm-level-matrix')}</section><section class="m-band"><h2>Odor por banheiro</h2>${compactTable(['Banheiro', 'Não', 'Leve', 'Forte'], odorRows)}</section><section class="m-band"><h2>Itens de condição</h2>${compactTable(['Banheiro', ...flags.map(([, label]) => label)], conditionRows, 'm-wide-table')}</section><section class="m-band"><h2>Ação realizada</h2>${compactTable(actionHeaders, actionRows, 'm-action-matrix')}</section><section class="m-band"><h2>Chamados</h2>${compactTable(['Banheiro', 'Com chamado', 'Sem chamado', 'Não registrado'], callRows)}</section>${timeOverview(records, groups)}${times(records)}`;
  }
  function polishDashboard() {
    for (const strong of document.querySelectorAll('#modernDashboard .m-level strong')) {
      if (strong.textContent === '1 checklists') strong.textContent = '1 checklist';
      if (strong.textContent === '1 avaliações') strong.textContent = '1 avaliação';
    }
  }
  function renderReportTimes(records, currentConfig, selectedBathroomId) {
    let target = $('#modernReportTimes');
    if (!target) { target = document.createElement('div'); target.id = 'modernReportTimes'; $('#reportView').append(target); }
    target.innerHTML = `${timeOverview(records, bathroomGroups(records, currentConfig || config, selectedBathroomId || ''))}${times(records)}`;
  }
  async function printReport(mode) {
    if (!await requestAccess()) return;
    try { await refreshAnalysis(mode); }
    catch (error) { alert(error.message); return; }
    if (mode === 'graph' && !$('#modernDashboard').textContent.trim()) return;
    document.body.dataset.printView = mode;
    window.print();
  }
  function init(currentConfig, apiFunction, exportCsv, refresh) {
    config = currentConfig; api = apiFunction; refreshAnalysis = refresh; document.body.classList.add('modern');
    try { const saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); if (saved?.draft && config.bathrooms.some(item => item.id === saved.draft.bathroom_id)) { draft = saved.draft; step = saved.step; if (!path().includes(step)) step = 'bathroom'; } } catch {}
    form = document.createElement('form'); form.className = 'newWizard';
    form.innerHTML = '<div class="m-wizard-top"><strong id="m-location"></strong><span id="m-step"></span></div><div id="m-content"></div><div class="m-actions"><button type="button" id="m-back" class="secondary-button">Voltar</button><button type="submit" id="m-next">Continuar</button></div><p id="m-status" role="status" aria-live="polite"></p>';
    $('#checklistView').append(form); content = $('#m-content'); form.addEventListener('submit', submit); form.addEventListener('change', capture); form.addEventListener('input', capture);
    $('#m-back').onclick = () => { if (busy) return; capture(); step = path()[Math.max(0, path().indexOf(step) - 1)]; draw(); };
    const filters = $('#graphFromDate').closest('section'); filters.classList.add('m-dashboard-filters');
    $('#loadGraph').textContent = 'Aplicar filtros'; $('#downloadGraph').hidden = true;
    const heading = document.createElement('div'); heading.className = 'm-dashboard-heading'; heading.innerHTML = '<h1>Dashboard de banheiros</h1>';
    $('#graphView').prepend(heading);
    const pdf = document.createElement('button'); pdf.type = 'button'; pdf.textContent = 'Gerar relatório em PDF'; pdf.onclick = () => printReport('graph'); filters.append(pdf);
    const target = document.createElement('div'); target.id = 'modernDashboard'; $('#graphView').append(target);
    for (const id of ['downloadReport', 'downloadReportBottom']) $(`#${id}`).textContent = 'Gerar relatório em PDF';
    const csv = document.createElement('button'); csv.type = 'button'; csv.className = 'secondary-button compact'; csv.textContent = 'Baixar CSV'; csv.onclick = exportCsv; $('#downloadReport').after(csv);
    const exit = document.createElement('button'); exit.className = 'tab m-exit'; exit.type = 'button'; exit.textContent = 'Sair'; exit.onclick = async () => { await api('/api/bathroom-checklists/access', { method: 'DELETE' }); location.reload(); }; $('.tabs').append(exit);
    draw();
  }
  window.BathroomUI = { init, requestAccess, renderDashboard: (...args) => { renderDashboard(...args); polishDashboard(); }, renderReportTimes, printReport };
})();
