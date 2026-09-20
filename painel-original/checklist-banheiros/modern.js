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
  function stackedRow(records, getter, levels, colors) {
    const counts = levels.map(([key, label], index) => ({ key, label, color: colors[index], count: records.filter(record => getter(record) === key).length }));
    const total = counts.reduce((sum, item) => sum + item.count, 0);
    return `<div class="m-stack" aria-label="${total} avaliações">${counts.map(item => `<span title="${escape(item.label)}: ${item.count}" style="width:${total ? item.count / total * 100 : 0}%;background:${item.color}">${item.count || ''}</span>`).join('')}</div>`;
  }
  function compactCountBars(rows, total, color) {
    return rows.map(([label, count]) => {
      const percent = total ? Math.round(count / total * 100) : 0;
      return `<div class="m-count-bar"><div><span>${escape(label)}</span><strong>${count}</strong></div><div class="m-track"><div style="width:${percent}%;background:${color}"></div></div></div>`;
    }).join('');
  }
  function bathroomDetail(group, currentConfig) {
    const records = group.records;
    const cleaning = records.filter(record => record.reason === 'limpeza' || record.actions?.some(action => action.includes('limpeza')));
    const calls = records.filter(record => record.service?.has_ticket === 'sim').length;
    const measured = records.map(timeMeasurement).filter(Boolean);
    const average = (key) => measured.length ? measured.reduce((sum, item) => sum + item[key], 0) / measured.length : NaN;
    const supplyLevels = [['cheio', 'Cheio'], ['medio', 'Médio'], ['baixo', 'Baixo'], ['vazio', 'Vazio']];
    const supplyColors = ['#13856b', '#3299a3', '#dbab41', '#cf605b'];
    const conditionRows = flags.map(([key, label]) => {
      const count = cleaning.filter(record => record.condition?.[key] || (key === 'detalhe_manutencao' && record.actions?.includes('manutencao'))).length;
      return [label, count];
    });
    const actionRows = Object.entries(actionLabels).map(([key, label]) => [label, records.filter(record => record.actions?.includes(key)).length]).filter(([, count]) => count > 0);
    return `<article class="m-bathroom-card">
      <header><div><span>Banheiro</span><h3>${escape(group.bathroom.name)}</h3></div><div class="m-bathroom-totals"><strong>${records.length}</strong><span>${records.length === 1 ? 'checklist' : 'checklists'}</span><strong>${calls}</strong><span>${calls === 1 ? 'chamado' : 'chamados'}</span></div></header>
      ${records.length ? `<div class="m-detail-section"><h4>Condição e odor</h4><div class="m-legend"><span><i style="background:#13856b"></i>Sim / Não</span><span><i style="background:#dbab41"></i>Parcial / Leve</span><span><i style="background:#cf605b"></i>Não / Forte</span></div><div class="m-distribution-row"><div><span>Banheiro limpo</span><strong>${cleaning.length} avaliações</strong></div>${stackedRow(cleaning, record => record.clean_level, [['sim', 'Sim'], ['parcial', 'Parcial'], ['nao', 'Não']], ['#13856b', '#dbab41', '#cf605b'])}</div><div class="m-distribution-row"><div><span>Odor</span><strong>${cleaning.length} avaliações</strong></div>${stackedRow(cleaning, record => record.odor_level, [['nao', 'Não'], ['leve', 'Leve'], ['forte', 'Forte']], ['#13856b', '#dbab41', '#cf605b'])}</div></div>
      <div class="m-detail-section"><h4>Nível dos insumos</h4><div class="m-legend">${supplyLevels.map(([key, label], index) => `<span><i style="background:${supplyColors[index]}"></i>${label}</span>`).join('')}</div>${currentConfig.supply_items.map(item => { const evaluated = records.filter(record => record.supplies?.[item.key]); return `<div class="m-distribution-row"><div><span>${escape(item.label)}</span><strong>${evaluated.length} ${evaluated.length === 1 ? 'avaliação' : 'avaliações'}</strong></div>${stackedRow(evaluated, record => record.supplies?.[item.key], supplyLevels, supplyColors)}</div>`; }).join('')}</div>
      <div class="m-detail-columns"><div class="m-detail-section"><h4>Itens de condição</h4><div class="m-compact-bars">${compactCountBars(conditionRows, cleaning.length, '#dbab41')}</div></div><div class="m-detail-section"><h4>Ações realizadas</h4><div class="m-compact-bars">${actionRows.length ? compactCountBars(actionRows, records.length, '#0878af') : '<p class="m-no-data">Nenhuma ação registrada.</p>'}</div></div></div>
      <div class="m-service-summary"><span><strong>${calls}</strong> com chamado</span><span><strong>${records.length - calls}</strong> sem chamado</span><span><strong>${formatSeconds(average('wait'))}</strong> espera média</span><span><strong>${formatSeconds(average('clean'))}</strong> limpeza média</span></div>` : '<p class="m-empty">Sem registros no período.</p>'}
    </article>`;
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
  function timeOverview(records, compact = false) {
    const measured = records.map(record => ({ record, time: timeMeasurement(record) })).filter(item => item.time);
    const average = (items, key) => items.length ? items.reduce((sum, item) => sum + item.time[key], 0) / items.length : NaN;
    const total = (items, key) => items.reduce((sum, item) => sum + item.time[key], 0);
    const groups = [
      { label: 'Com chamado', items: measured.filter(item => item.record.service?.has_ticket === 'sim') },
      { label: 'Sem chamado', items: measured.filter(item => item.record.service?.has_ticket === 'nao') }
    ].map(group => ({ ...group, wait: average(group.items, 'wait'), clean: average(group.items, 'clean'), accumulated: total(group.items, 'wait') + total(group.items, 'clean') }));
    const maxAverage = Math.max(1, ...groups.map(group => (Number.isFinite(group.wait) ? group.wait : 0) + (Number.isFinite(group.clean) ? group.clean : 0)));
    const withTicket = records.filter(record => record.service?.has_ticket === 'sim').length;
    const withoutTicket = records.filter(record => record.service?.has_ticket === 'nao').length;
    const cards = [
      [formatSeconds(average(measured, 'wait')), 'Tempo médio de espera'],
      [formatSeconds(average(measured, 'clean')), 'Tempo médio de limpeza'],
      [withoutTicket.toLocaleString('pt-BR'), 'Atendimentos sem chamado'],
      [withTicket.toLocaleString('pt-BR'), 'Atendimentos com chamado'],
      [(withTicket + withoutTicket).toLocaleString('pt-BR'), 'Total de atendimentos']
    ];
    const chart = groups.map(group => `<article class="m-time-row ${compact ? 'compact' : ''}"><div><strong>${group.label}</strong><span>${group.items.length} ${group.items.length === 1 ? 'atendimento' : 'atendimentos'}</span></div><div class="m-time-track"><span title="Espera média: ${formatSeconds(group.wait)}" style="width:${Number.isFinite(group.wait) ? group.wait / maxAverage * 100 : 0}%;background:#0878af"></span><span title="Limpeza média: ${formatSeconds(group.clean)}" style="width:${Number.isFinite(group.clean) ? group.clean / maxAverage * 100 : 0}%;background:#13856b"></span></div>${compact ? '' : `<dl><div><dt>Espera média</dt><dd>${formatSeconds(group.wait)}</dd></div><div><dt>Limpeza média</dt><dd>${formatSeconds(group.clean)}</dd></div><div><dt>Tempo médio total</dt><dd>${formatSeconds(group.wait + group.clean)}</dd></div><div><dt>Tempo acumulado</dt><dd>${group.items.length ? formatSeconds(group.accumulated) : 'Sem dados'}</dd></div></dl>`}</article>`).join('');
    return `<section class="m-band m-time-overview ${compact ? 'compact' : ''}"><h2>Chamados e resumo de tempo</h2><p class="m-sub">Leitura rápida dos atendimentos que possuem marcação de tempo.</p><div class="m-time-cards">${cards.map(([value, label]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join('')}</div><div class="m-legend"><span><i style="background:#0878af"></i>Espera até a chegada</span><span><i style="background:#13856b"></i>Tempo de limpeza</span></div><div class="m-time-chart">${chart}</div><p class="m-sub">${measured.length} ${measured.length === 1 ? 'atendimento com tempo válido' : 'atendimentos com tempo válido'}. O detalhamento completo fica em Relatórios.</p></section>`;
  }
  function times(records) {
    const serviceRecords = records.filter(record => record.service?.started_at || record.service?.arrived_at || record.service?.finished_at);
    const valueOrMissing = value => value && value !== '—' ? value : 'Sem registro';
    const rows = serviceRecords.map(record => `<tr><td>${escape(record.bathroom_name)}</td><td>${date(record.service?.started_at || record.created_at)}<br>${time(record.service?.started_at || record.created_at)}</td><td>${record.service?.has_ticket === 'sim' ? escape(record.service.ticket_number || 'Sem registro') : record.service?.has_ticket === 'nao' ? 'Sem chamado' : 'Sem registro'}</td><td>${escape(record.responsible_name || 'Sem registro')}</td><td>${record.service?.arrived_at ? time(record.service.arrived_at) : 'Sem registro'} / ${record.service?.finished_at ? time(record.service.finished_at) : 'Sem registro'}</td><td>${record.service?.started_at && record.service?.arrived_at ? duration(record.service.started_at, record.service.arrived_at) : 'Sem registro'}</td><td>${record.service?.arrived_at && record.service?.finished_at ? duration(record.service.arrived_at, record.service.finished_at) : 'Sem registro'}</td><td>${escape(record.notes || 'Sem registro')}</td></tr>`).join('');
    return `<section class="m-band m-time-details"><h2>Registros de atendimento</h2><p class="m-sub">Somente registros que possuem ao menos um horário de atendimento.</p><div class="m-table-scroll"><table class="m-print-time-table"><thead><tr><th>Banheiro</th><th>Data e hora</th><th>Chamado</th><th>Responsável</th><th>Chegada / Saída</th><th>Espera</th><th>Limpeza</th><th>Observação</th></tr></thead><tbody>${rows || '<tr><td colspan="8">Nenhum atendimento com horário registrado no período.</td></tr>'}</tbody></table></div></section>`;
  }
  function reportTimeSummary(records) {
    const groups = config.bathrooms.map(bathroom => ({ bathroom, records: records.filter(record => record.bathroom_id === bathroom.id) })).filter(group => group.records.length);
    const rows = groups.map(group => {
      const measured = group.records.map(timeMeasurement).filter(Boolean);
      const average = key => measured.length ? measured.reduce((sum, item) => sum + item[key], 0) / measured.length : NaN;
      const calls = group.records.filter(record => record.service?.has_ticket === 'sim').length;
      return `<tr><th>${escape(group.bathroom.name)}</th><td>${group.records.length}</td><td>${calls}</td><td>${group.records.length - calls}</td><td>${formatSeconds(average('wait'))}</td><td>${formatSeconds(average('clean'))}</td></tr>`;
    }).join('');
    return `<section class="m-band m-report-time"><h2>Chamados e tempos por banheiro</h2><div class="m-table-scroll"><table><thead><tr><th>Banheiro</th><th>Atendimentos</th><th>Com chamado</th><th>Sem chamado</th><th>Espera média</th><th>Limpeza média</th></tr></thead><tbody>${rows || '<tr><td colspan="6">Sem atendimentos no período.</td></tr>'}</tbody></table></div></section>`;
  }
  function renderDashboard(records, currentConfig, filters) {
    const cleaning = records.filter(record => record.reason === 'limpeza' || record.actions?.some(action => action.includes('limpeza')));
    const metrics = [[records.length, 'Checklists realizados'], [cleaning.length, 'Limpezas registradas'], [records.filter(record => record.reason === 'reposicao' || (record.replenishments || []).length).length, 'Reposições registradas'], [records.filter(record => record.service?.has_ticket === 'sim').length, 'Chamados registrados']];
    const grouped = currentConfig.bathrooms.filter(bathroom => !$('#graphBathroom').value || bathroom.id === $('#graphBathroom').value).map(bathroom => ({ bathroom, records: records.filter(record => record.bathroom_id === bathroom.id) }));
    const dayCounts = new Map();
    records.forEach(record => { const key = date(record.created_at); dayCounts.set(key, (dayCounts.get(key) || 0) + 1); });
    const dailyRows = [...dayCounts].sort((a, b) => a[0].split('/').reverse().join('-').localeCompare(b[0].split('/').reverse().join('-')));
    const supplyHeader = currentConfig.supply_items.map(item => `<th>${escape(item.label)}</th>`).join('');
    const replenishmentRows = grouped.map(group => `<tr><th>${escape(group.bathroom.name)}</th>${currentConfig.supply_items.map(item => {
      const quantity = group.records.flatMap(record => record.replenishments || []).filter(entry => entry.item === item.key).reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);
      return `<td><strong>${quantity.toLocaleString('pt-BR')}</strong><span>${escape(item.unit)}</span></td>`;
    }).join('')}</tr>`).join('');
    const suppliesHtml = `<div class="m-matrix-scroll"><table class="m-supply-matrix"><thead><tr><th>Banheiro</th>${supplyHeader}</tr></thead><tbody>${replenishmentRows}</tbody></table></div>`;
    $('#modernDashboard').innerHTML = `<p class="m-period">${escape(filters.from)} a ${escape(filters.to)} · ${escape(filters.bathroom)}</p><div class="metric-grid">${metrics.map(([count, label]) => `<article class="metric-card"><span>${label}</span><strong>${count.toLocaleString('pt-BR')}</strong></article>`).join('')}</div><div class="m-chart-pair"><section><h2>Condição geral</h2>${levelBars(cleaning, record => record.clean_level, [['sim', 'Limpo'], ['parcial', 'Parcial'], ['nao', 'Não limpo']], ['#13856b', '#dbab41', '#cf605b'])}<p class="m-sub">Consolidado dos checklists com limpeza.</p></section><section><h2>Checklists por dia</h2>${bars(dailyRows)}</section></div><section class="m-band"><h2>Detalhamento por banheiro</h2><p class="m-sub">Cada bloco apresenta a mesma leitura: condição, odor, insumos, ocorrências, ações, chamados e tempos.</p><div class="m-bathroom-grid">${grouped.map(group => bathroomDetail(group, currentConfig)).join('')}</div></section><section class="m-band"><h2>Reposição realizada por banheiro</h2><p class="m-sub">Quantidade efetivamente reposta de cada material.</p>${suppliesHtml}</section>${timeOverview(records, true)}`;
  }
  function polishDashboard() {
    for (const strong of document.querySelectorAll('#modernDashboard .m-level strong')) {
      if (strong.textContent === '1 checklists') strong.textContent = '1 checklist';
      if (strong.textContent === '1 avaliações') strong.textContent = '1 avaliação';
    }
  }
  function renderReportTimes(records) {
    let target = $('#modernReportTimes');
    if (!target) { target = document.createElement('div'); target.id = 'modernReportTimes'; $('#reportView').append(target); }
    target.innerHTML = `${reportTimeSummary(records)}${times(records)}`;
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
    $('#loadReport').textContent = 'Aplicar';
    for (const id of ['downloadReport', 'downloadReportBottom']) { const button = $(`#${id}`); if (button) button.textContent = 'PDF'; }
    const csv = document.createElement('button'); csv.type = 'button'; csv.className = 'secondary-button compact'; csv.textContent = 'CSV'; csv.onclick = exportCsv; $('#downloadReport').after(csv);
    const exit = document.createElement('button'); exit.className = 'tab m-exit'; exit.type = 'button'; exit.textContent = 'Sair'; exit.onclick = async () => { await api('/api/bathroom-checklists/access', { method: 'DELETE' }); location.reload(); }; $('.tabs').append(exit);
    draw();
  }
  window.BathroomUI = { init, requestAccess, renderDashboard: (...args) => { renderDashboard(...args); polishDashboard(); }, renderReportTimes, printReport };
})();
