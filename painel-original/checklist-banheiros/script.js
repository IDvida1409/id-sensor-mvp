(() => {
  const fallbackConfig = {
    bathrooms: [
      { id: 'atrium-feminino', location: 'Atrium', gender: 'Feminino', name: 'Banheiro Feminino - Atrium' },
      { id: 'atrium-masculino', location: 'Atrium', gender: 'Masculino', name: 'Banheiro Masculino - Atrium' },
      { id: 'endoscopia-feminino', location: 'Endoscopia', gender: 'Feminino', name: 'Banheiro Feminino - Endoscopia' },
      { id: 'endoscopia-masculino', location: 'Endoscopia', gender: 'Masculino', name: 'Banheiro Masculino - Endoscopia' }
    ],
    supply_items: [
      { key: 'papel_higienico', label: 'Papel higiênico', unit: 'rolos' },
      { key: 'papel_toalha', label: 'Papel toalha', unit: 'refis' },
      { key: 'sabonete', label: 'Sabonete', unit: 'refis' },
      { key: 'alcool_outro', label: 'Álcool/outro insumo', unit: 'refis' },
      { key: 'protetor_assento', label: 'Protetor de assento', unit: 'unidades' },
      { key: 'absorvente', label: 'Absorvente', unit: 'unidades' }
    ],
    actions: [
      'limpeza_completa',
      'limpeza_rapida',
      'reposicao_papel',
      'reposicao_sabonete',
      'reposicao_alcool',
      'correcao_odor',
      'manutencao',
      'nenhuma_acao'
    ]
  };

  const labels = {
    reposicao: 'Reposição',
    limpeza: 'Limpeza',
    piso_molhado: 'Piso molhado',
    manutencao: 'Manutenção',
    sim: 'Sim',
    nao: 'Não',
    parcial: 'Parcial',
    leve: 'Leve',
    forte: 'Forte',
    limpeza_completa: 'Limpeza completa',
    limpeza_rapida: 'Limpeza rápida',
    reposicao_papel: 'Reposição de papel',
    reposicao_sabonete: 'Reposição de sabonete',
    reposicao_alcool: 'Reposição de outros insumos',
    correcao_odor: 'Correção de odor',
    nenhuma_acao: 'Nenhuma ação necessária',
    lixeira_cheia: 'Lixeira cheia',
    vaso_sujo: 'Vaso/mictório sujo',
    pia_suja: 'Pia/bancada suja',
    detalhe_manutencao: 'Necessita manutenção',
    cheio: 'Cheio',
    medio: 'Médio',
    baixo: 'Baixo',
    vazio: 'Vazio'
  };

  const colorHex = {
    green: '#19a974',
    teal: '#18a7a7',
    orange: '#f59e0b',
    yellow: '#f6c343',
    red: '#dc4c45',
    blue: '#2157d9',
    muted: '#617089',
    text: '#1e293b',
    track: '#e8eef6',
    line: '#dce7f4'
  };

  const colors = {
    sim: 'var(--green)',
    nao: 'var(--red)',
    parcial: 'var(--orange)',
    leve: 'var(--yellow)',
    forte: 'var(--red)',
    cheio: 'var(--green)',
    medio: 'var(--teal)',
    baixo: 'var(--orange)',
    vazio: 'var(--red)',
    reposicao: 'var(--green)',
    limpeza: 'var(--blue-strong)',
    piso_molhado: 'var(--teal)',
    manutencao: 'var(--orange)',
    limpeza_completa: 'var(--teal)',
    limpeza_rapida: 'var(--blue-strong)',
    reposicao_papel: 'var(--green)',
    reposicao_sabonete: 'var(--orange)',
    reposicao_alcool: 'var(--teal)',
    correcao_odor: 'var(--red)',
    detalhe_manutencao: 'var(--orange)',
    nenhuma_acao: 'var(--yellow)'
  };

  const peopleBuckets = [
    { label: '0-10 pessoas', short: '0-10', min: 0, max: 10 },
    { label: '11-20 pessoas', short: '11-20', min: 11, max: 20 },
    { label: '21-30 pessoas', short: '21-30', min: 21, max: 30 },
    { label: '31-40 pessoas', short: '31-40', min: 31, max: 40 },
    { label: '41+ pessoas', short: '41+', min: 41, max: Infinity }
  ];

  const state = {
    config: fallbackConfig,
    peoplePerChecklist: 10,
    selectedBathroom: null,
    selected: {
      reason: '',
      clean_level: 'sim',
      odor_level: 'nao',
      supplies: {},
      reason_details: new Set()
    }
  };

  const reasonDetailConfig = {
    limpeza: {
      title: 'Detalhes da limpeza',
      hint: 'Marque o que motivou a limpeza neste checklist.',
      options: [
        { key: 'piso_molhado', label: 'Piso molhado' },
        { key: 'lixeira_cheia', label: 'Lixeira cheia' },
        { key: 'vaso_sujo', label: 'Vaso/mictório sujo' },
        { key: 'pia_suja', label: 'Pia/bancada suja' },
        { key: 'detalhe_manutencao', label: 'Necessita manutenção' }
      ]
    }
  };

  let currentGraphRecords = [];
  let currentReportRecords = [];
  let currentHistoryRecords = [];
  let currentReport = null;
  let currentGraphSvg = '';
  let appStarted = false;

  const ACCESS_PASSWORD = '12345678';
  const ACCESS_KEY = 'bathroomChecklistAccess';

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  async function api(path, options = {}) {
    const response = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || 'Não foi possível concluir a operação.');
    }
    return payload.data;
  }

  function setStatus(message, type = '') {
    const status = $('#saveStatus');
    if (!status) return;
    status.textContent = message;
    status.className = `status ${type}`;
  }

  function hasAccess() {
    return sessionStorage.getItem(ACCESS_KEY) === 'ok';
  }

  function setLoginStatus(message, type = '') {
    const status = $('#loginStatus');
    if (!status) return;
    status.textContent = message;
    status.className = `status ${type}`;
  }

  function applyAccessState() {
    document.body.dataset.auth = hasAccess() ? 'unlocked' : 'locked';
    if (!hasAccess()) setTimeout(() => $('#accessPassword')?.focus(), 100);
  }

  function setupAccessGate() {
    applyAccessState();
    $('#loginForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const password = $('#accessPassword').value;
      if (password !== ACCESS_PASSWORD) {
        setLoginStatus('Senha inválida.', 'error');
        return;
      }
      sessionStorage.setItem(ACCESS_KEY, 'ok');
      $('#accessPassword').value = '';
      setLoginStatus('');
      applyAccessState();
      startApp().catch((error) => setLoginStatus(error.message, 'error'));
    });
  }

  function setStep(step) {
    document.body.dataset.step = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function formatDateInput(date) {
    return date.toISOString().slice(0, 10);
  }

  function setDefaultDateRange() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    ['graph', 'report', 'history'].forEach((prefix) => {
      $(`#${prefix}FromDate`).value = formatDateInput(firstDay);
      $(`#${prefix}ToDate`).value = formatDateInput(now);
    });
  }

  function setNowFields() {
    const now = new Date();
    $('#checkDate').value = now.toLocaleDateString('pt-BR');
    $('#checkTime').value = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function genderInitial(gender) {
    return String(gender || '').toLowerCase().startsWith('f') ? 'F' : 'M';
  }

  function bathroomById(id) {
    return state.config.bathrooms.find((bathroom) => bathroom.id === id);
  }

  function renderBathrooms() {
    $('#bathroomGrid').innerHTML = state.config.bathrooms.map((bathroom) => `
      <button class="bathroom-card" type="button" data-bathroom="${bathroom.id}">
        <div class="icon">${genderInitial(bathroom.gender)}</div>
        <div>
          <strong>${bathroom.location}</strong>
          <span>${bathroom.gender}</span>
        </div>
      </button>
    `).join('');

    const options = [
      '<option value="">Todos os banheiros</option>',
      ...state.config.bathrooms.map((bathroom) => `<option value="${bathroom.id}">${bathroom.name}</option>`)
    ].join('');
    $('#graphBathroom').innerHTML = options;
    $('#reportBathroom').innerHTML = options;
    $('#historyBathroom').innerHTML = options;
  }

  function selectBathroom(id) {
    state.selectedBathroom = bathroomById(id);
    if (!state.selectedBathroom) return;
    $$('.bathroom-card').forEach((button) => {
      button.classList.toggle('selected', button.dataset.bathroom === id);
    });
    $('#startBathroomName').textContent = state.selectedBathroom.name;
    $('#selectedBathroomName').textContent = state.selectedBathroom.name;
    $('#bathroomStep').hidden = true;
    $('#startChecklistCard').hidden = false;
    $('#checklistForm').hidden = true;
    setStep('confirm');
  }

  function showBathroomStep() {
    $('#welcomeStep').hidden = true;
    $('#bathroomStep').hidden = false;
    $('#startChecklistCard').hidden = true;
    $('#checklistForm').hidden = true;
    setStatus('');
    setStep('bathrooms');
  }

  function startChecklist() {
    if (!state.selectedBathroom) return;
    $('#welcomeStep').hidden = true;
    $('#bathroomStep').hidden = true;
    $('#startChecklistCard').hidden = true;
    $('#checklistForm').hidden = false;
    $('#selectedBathroomName').textContent = state.selectedBathroom.name;
    setNowFields();
    setStatus('');
    setStep('form');
    setTimeout(() => $('[data-radio-group="reason"] button')?.focus(), 250);
  }

  function changeBathroom() {
    state.selectedBathroom = null;
    $('#startChecklistCard').hidden = true;
    $('#checklistForm').hidden = true;
    $('#bathroomStep').hidden = false;
    $$('.bathroom-card').forEach((button) => button.classList.remove('selected'));
    setStep('bathrooms');
  }

  function renderSupplyLevels() {
    const levels = ['cheio', 'medio', 'baixo', 'vazio'];
    $('#supplyLevels').innerHTML = state.config.supply_items.map((item) => {
      state.selected.supplies[item.key] = state.selected.supplies[item.key] || 'cheio';
      return `
        <div class="supply-row">
          <strong>${item.label}</strong>
          <div class="level-buttons" data-supply="${item.key}">
            ${levels.map((level) => `
              <button type="button" data-value="${level}" class="${level === state.selected.supplies[item.key] ? 'active' : ''}">
                ${labels[level]}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderReplenishments() {
    $('#replenishmentList').innerHTML = state.config.supply_items.map((item) => `
      <div class="replenishment-row">
        <strong>${item.label}</strong>
        <div class="replenishment-controls">
          <label>
            Quantidade reposta
            <input type="number" min="0" step="0.01" inputmode="decimal" data-repl-quantity="${item.key}" placeholder="0">
          </label>
          <label>
            Unidade
            <input type="text" data-repl-unit="${item.key}" value="${item.unit}">
          </label>
        </div>
      </div>
    `).join('');
  }

  function applyReasonVisibility() {
    const reason = state.selected.reason;
    const showCondition = reason === 'limpeza';
    $('#conditionFieldset').hidden = !showCondition;
    $('#supplyFieldset').hidden = reason !== 'reposicao';
    $('#replenishmentFieldset').hidden = reason !== 'reposicao';
  }

  function renderReasonDetails() {
    const reason = state.selected.reason;
    const config = reasonDetailConfig[reason];
    const field = $('#reasonDetailField');
    if (!config) {
      field.hidden = true;
      $('#reasonDetailOptions').innerHTML = '';
      return;
    }

    field.hidden = false;
    $('#reasonDetailTitle').textContent = config.title;
    $('#reasonDetailHint').textContent = config.hint;
    $('#reasonDetailOptions').innerHTML = config.options.map((option) => {
      const checked = option.locked || state.selected.reason_details.has(option.key);
      if (option.locked) state.selected.reason_details.add(option.key);
      return `
        <label>
          <input type="checkbox" data-reason-detail="${option.key}" ${checked ? 'checked' : ''} ${option.locked ? 'disabled' : ''}>
          ${option.label}
        </label>
      `;
    }).join('');
  }

  function currentConditionFlags() {
    const details = state.selected.reason_details;
    return {
      piso_molhado: $('#pisoMolhado')?.checked || details.has('piso_molhado'),
      lixeira_cheia: $('#lixeiraCheia')?.checked || details.has('lixeira_cheia'),
      vaso_sujo: $('#vasoSujo')?.checked || details.has('vaso_sujo'),
      pia_suja: $('#piaSuja')?.checked || details.has('pia_suja'),
      detalhe_manutencao: details.has('detalhe_manutencao')
    };
  }

  function autoActions() {
    if (!state.selected.reason) return [];

    const actions = new Set();
    const flags = currentConditionFlags();
    const replenishments = collectReplenishments();
    const replenished = (keys) => replenishments.some((item) => keys.includes(item.item));

    if (state.selected.reason === 'reposicao') {
      if (replenished(['papel_higienico', 'papel_toalha'])) actions.add('reposicao_papel');
      if (replenished(['sabonete'])) actions.add('reposicao_sabonete');
      if (replenished(['alcool_outro', 'protetor_assento', 'absorvente'])) actions.add('reposicao_alcool');
    }

    if (state.selected.reason === 'limpeza') {
      const conditionCount = ['piso_molhado', 'lixeira_cheia', 'vaso_sujo', 'pia_suja'].filter((key) => flags[key]).length;
      const needsComplete = state.selected.clean_level === 'nao' || state.selected.odor_level === 'forte' || conditionCount >= 2;
      actions.add(needsComplete ? 'limpeza_completa' : 'limpeza_rapida');
      if (state.selected.odor_level !== 'nao') actions.add('correcao_odor');
      if (flags.detalhe_manutencao) actions.add('manutencao');
    }

    if (!actions.size) actions.add('nenhuma_acao');
    return [...actions];
  }

  function renderActions() {
    const actions = autoActions();
    if (!actions.length) {
      $('#actionGrid').innerHTML = '<p class="auto-action-placeholder">Selecione o motivo para visualizar a ação realizada.</p>';
      return;
    }

    $('#actionGrid').innerHTML = actions.map((action) => `
      <span class="auto-action-chip ${action === 'nenhuma_acao' ? 'neutral' : ''}">${labels[action] || action}</span>
    `).join('');
  }

  function selectRadio(group, value) {
    state.selected[group] = value;
    $$(`[data-radio-group="${group}"] button`).forEach((button) => {
      button.classList.toggle('active', button.dataset.value === value);
    });
  }

  function setupChoiceEvents() {
    document.addEventListener('click', (event) => {
      const bathroomButton = event.target.closest('[data-bathroom]');
      if (bathroomButton) {
        selectBathroom(bathroomButton.dataset.bathroom);
        return;
      }

      const shortcut = event.target.closest('[data-view-shortcut]');
      if (shortcut) {
        activateView(shortcut.dataset.viewShortcut);
        return;
      }

      const radioButton = event.target.closest('[data-radio-group] button');
      if (radioButton) {
        const group = radioButton.closest('[data-radio-group]').dataset.radioGroup;
        selectRadio(group, radioButton.dataset.value);
        if (group === 'reason') {
          state.selected.reason_details.clear();
          applyReasonVisibility();
          renderReasonDetails();
        }
        renderActions();
        return;
      }

      const supplyButton = event.target.closest('[data-supply] button');
      if (supplyButton) {
        const item = supplyButton.closest('[data-supply]').dataset.supply;
        state.selected.supplies[item] = supplyButton.dataset.value;
        supplyButton.closest('[data-supply]').querySelectorAll('button').forEach((button) => {
          button.classList.toggle('active', button === supplyButton);
        });
        renderActions();
        return;
      }

      const detailCheckbox = event.target.closest('[data-reason-detail]');
      if (detailCheckbox) {
        if (detailCheckbox.checked) state.selected.reason_details.add(detailCheckbox.dataset.reasonDetail);
        else state.selected.reason_details.delete(detailCheckbox.dataset.reasonDetail);
        renderActions();
      }
    });

    document.addEventListener('input', (event) => {
      if (event.target.matches('[data-repl-quantity], [data-repl-unit]')) renderActions();
    });

    document.addEventListener('change', (event) => {
      if (event.target.matches('[data-reason-detail]')) {
        if (event.target.checked) state.selected.reason_details.add(event.target.dataset.reasonDetail);
        else state.selected.reason_details.delete(event.target.dataset.reasonDetail);
        renderActions();
      }

      if (event.target.matches('#pisoMolhado, #lixeiraCheia, #vasoSujo, #piaSuja, [data-repl-quantity], [data-repl-unit]')) {
        renderActions();
      }
    });
  }

  function collectReplenishments() {
    return state.config.supply_items.map((item) => {
      const quantity = Number(document.querySelector(`[data-repl-quantity="${item.key}"]`)?.value || 0);
      const unit = document.querySelector(`[data-repl-unit="${item.key}"]`)?.value || item.unit;
      return { item: item.key, quantity, unit };
    }).filter((item) => item.quantity > 0);
  }

  function collectChecklist() {
    if (!state.selectedBathroom) throw new Error('Selecione um banheiro.');
    if (!state.selected.reason) throw new Error('Selecione o motivo.');
    const people = state.peoplePerChecklist;
    const conditionFlags = currentConditionFlags();
    const actions = autoActions();
    const replenishments = state.selected.reason === 'reposicao' ? collectReplenishments() : [];
    const supplies = state.selected.reason === 'reposicao' ? state.selected.supplies : {};

    return {
      bathroom_id: state.selectedBathroom.id,
      people_count: people,
      reason: state.selected.reason,
      condition: {
        clean_level: state.selected.clean_level,
        odor_level: state.selected.odor_level,
        piso_molhado: conditionFlags.piso_molhado,
        lixeira_cheia: conditionFlags.lixeira_cheia,
        vaso_sujo: conditionFlags.vaso_sujo,
        pia_suja: conditionFlags.pia_suja
      },
      supplies,
      replenishments,
      actions,
      notes: $('#notes').value,
      responsible_name: $('#responsibleName').value
    };
  }

  function resetChecklist(keepBathroom = true) {
    const bathroom = state.selectedBathroom;
    $('#checklistForm').reset();
    state.selected.reason = '';
    state.selected.clean_level = 'sim';
    state.selected.odor_level = 'nao';
    state.selected.supplies = {};
    state.selected.reason_details = new Set();
    $('#peopleCount').value = state.peoplePerChecklist;
    renderSupplyLevels();
    renderReplenishments();
    applyReasonVisibility();
    renderReasonDetails();
    renderActions();
    ['reason', 'clean_level', 'odor_level'].forEach((group) => selectRadio(group, state.selected[group]));
    setNowFields();
    if (keepBathroom && bathroom) {
      state.selectedBathroom = bathroom;
      $('#selectedBathroomName').textContent = bathroom.name;
      $('#checklistForm').hidden = false;
      setStep('form');
      setTimeout(() => $('[data-radio-group="reason"] button')?.focus(), 150);
    }
  }

  async function saveChecklist(event) {
    event.preventDefault();
    setStatus('Salvando checklist...');
    try {
      const payload = collectChecklist();
      await api('/api/bathroom-checklists', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setStatus('Checklist salvo. Gráfico, relatório e histórico já podem usar este registro.', 'success');
      resetChecklist(true);
      loadGraph().catch(() => {});
      loadReport().catch(() => {});
      loadHistory().catch(() => {});
    } catch (error) {
      setStatus(error.message, 'error');
    }
  }

  function numberText(value) {
    return Number(value || 0).toLocaleString('pt-BR');
  }

  function decimalText(value, digits = 1) {
    return Number(value || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  function pluralText(value, singular, plural) {
    return `${numberText(value)} ${Number(value || 0) === 1 ? singular : plural}`;
  }

  function peopleText(value) {
    return value ? pluralText(value, 'pessoa', 'pessoas') : 'sem dados';
  }

  function shortBathroomName(name) {
    return String(name || 'Banheiro').replace(/^Banheiro\s+/i, '');
  }

  function htmlText(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function percentValue(count, total) {
    return total ? Math.round((count / total) * 100) : 0;
  }

  function rate(records, predicate) {
    return percentValue(records.filter(predicate).length, records.length);
  }

  function distinctPeopleCount(records) {
    return new Set(records.map((record) => Number(record.people_count || 0)).filter((value) => value > 0)).size;
  }

  function totalPeopleCount(records) {
    return records.reduce((total, record) => total + Number(record.people_count || state.peoplePerChecklist), 0);
  }

  function groupByBathroom(records) {
    const groups = new Map();
    records.forEach((record) => {
      const key = record.bathroom_id || 'sem-banheiro';
      if (!groups.has(key)) {
        groups.set(key, {
          bathroom: {
            id: record.bathroom_id,
            name: record.bathroom_name || 'Banheiro'
          },
          records: []
        });
      }
      groups.get(key).records.push(record);
    });
    return [...groups.values()].sort((a, b) => a.bathroom.name.localeCompare(b.bathroom.name, 'pt-BR'));
  }

  function recordsForBucket(records, bucket) {
    let accumulated = 0;
    return [...records]
      .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
      .filter((record) => {
        accumulated += Number(record.people_count || state.peoplePerChecklist);
        return accumulated >= bucket.min && accumulated <= bucket.max;
      });
  }

  function firstPeople(records, predicate) {
    let accumulated = 0;
    const orderedRecords = [...records].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    for (const record of orderedRecords) {
      accumulated += Number(record.people_count || state.peoplePerChecklist);
      if (predicate(record)) return accumulated;
    }
    return null;
  }

  function firstPeopleText(values) {
    const valid = values.filter((value) => Number.isFinite(Number(value)) && Number(value) > 0);
    return valid.length ? peopleText(Math.min(...valid)) : 'sem dados';
  }

  function dateText(value) {
    if (!value) return '';
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return '';
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function actionsText(record) {
    const actions = Array.isArray(record.actions) ? record.actions : [];
    return actions.length ? actions.map((action) => labels[action] || action).join(', ') : 'Nenhuma ação registrada';
  }

  function supplyItem(key) {
    return state.config.supply_items.find((item) => item.key === key) || { key, label: key, unit: '' };
  }

  function hasReplenishment(record) {
    return Array.isArray(record.replenishments) && record.replenishments.some((item) => Number(item.quantity || 0) > 0);
  }

  function hasAction(record) {
    const actions = Array.isArray(record.actions) ? record.actions : [];
    return actions.some((action) => action !== 'nenhuma_acao');
  }

  function supplyCritical(record, key) {
    return ['baixo', 'vazio'].includes(record.supplies?.[key]);
  }

  function hasSupplyIssue(record) {
    return state.config.supply_items.some((item) => supplyCritical(record, item.key));
  }

  function hasSupplyLevel(record) {
    return !!record.supplies && Object.keys(record.supplies).length > 0;
  }

  function supplyLevelRecords(records) {
    return records.filter((record) => record.reason === 'reposicao' || hasSupplyLevel(record));
  }

  function conditionIssue(record) {
    const condition = record.condition || {};
    return record.clean_level !== 'sim'
      || record.odor_level !== 'nao'
      || condition.piso_molhado
      || condition.lixeira_cheia
      || condition.vaso_sujo
      || condition.pia_suja;
  }

  function hasOccurrence(record) {
    return conditionIssue(record) || hasSupplyIssue(record) || hasAction(record) || hasReplenishment(record);
  }

  function occurrenceRate(records) {
    return rate(records, hasOccurrence);
  }

  function fieldDistribution(records, levels, getter) {
    return levels.map((level) => {
      const count = records.filter((record) => getter(record) === level).length;
      return {
        key: level,
        label: labels[level] || level,
        count,
        percent: percentValue(count, records.length),
        color: colors[level] || 'var(--blue-strong)'
      };
    });
  }

  function dominantLevel(records, getter) {
    if (!records.length) return 'sem dados';
    const distribution = fieldDistribution(records, ['cheio', 'medio', 'baixo', 'vazio'], getter)
      .sort((a, b) => b.count - a.count);
    const top = distribution[0];
    return `${top.label} ${top.percent}%`;
  }

  function legendHtml(items) {
    return `<div class="legend">${items.map((item) => `
      <span><i style="background:${item.color}"></i>${item.label}</span>
    `).join('')}</div>`;
  }

  function stackHtml(parts) {
    const visible = parts.filter((part) => part.percent > 0);
    if (!visible.length) return '<div class="stack-track"></div>';
    return `
      <div class="stack-track">
        ${visible.map((part) => `
          <div class="stack-segment" style="width:${part.percent}%; background:${part.color}" title="${part.label}: ${part.percent}%">
            ${part.percent >= 12 ? `${part.percent}%` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  function miniMetricHtml(value, color = 'var(--blue-strong)') {
    const width = Number(value || 0) > 0 ? Math.max(3, value) : 0;
    return `
      <div class="mini-metric">
        <div class="mini-track"><div class="mini-fill" style="width:${width}%; background:${color}"></div></div>
        <strong>${value}%</strong>
      </div>
    `;
  }

  function barRowHtml(label, value, max, color, suffix = '') {
    const width = max && Number(value || 0) > 0 ? Math.max(3, (Number(value || 0) / max) * 100) : 0;
    return `
      <div class="bar-row">
        <header>
          <strong>${label}</strong>
          <span>${numberText(value)}${suffix}</span>
        </header>
        <div class="bar-track"><div class="bar-fill" style="width:${width}%; background:${color}"></div></div>
      </div>
    `;
  }

  function renderEmpty(target, message = 'Sem checklists no período selecionado.') {
    $(target).innerHTML = `<p class="empty-state">${message}</p>`;
  }

  function activeSelect(mode) {
    return $(`#${mode}Bathroom`);
  }

  function paramsForMode(mode) {
    const params = new URLSearchParams();
    const from = $(`#${mode}FromDate`).value;
    const to = $(`#${mode}ToDate`).value;
    const bathroom = activeSelect(mode).value;
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (bathroom) params.set('bathroom_id', bathroom);
    return params;
  }

  async function fetchAnalysis(mode) {
    const params = paramsForMode(mode);
    const [data, records] = await Promise.all([
      api(`/api/bathroom-checklists/report?${params.toString()}`),
      api(`/api/bathroom-checklists?${params.toString()}`)
    ]);
    return { report: data.report, records };
  }

  function comparisonGroups(records, selectedBathroomId) {
    if (selectedBathroomId) {
      const bathroom = bathroomById(selectedBathroomId);
      return [{
        bathroom: bathroom || { id: selectedBathroomId, name: 'Banheiro selecionado' },
        records
      }];
    }
    return groupByBathroom(records);
  }

  function renderGraphMetrics(records, selectedBathroomId) {
    const groups = comparisonGroups(records, selectedBathroomId).filter((group) => group.records.length);
    const topGroup = [...groups].sort((a, b) => occurrenceRate(b.records) - occurrenceRate(a.records))[0];
    const totalReplenishments = records.reduce((total, record) => total + (record.replenishments || []).filter((item) => Number(item.quantity || 0) > 0).length, 0);
    const peopleTotal = totalPeopleCount(records);
    const metrics = selectedBathroomId
      ? [
        [numberText(records.length), 'checklists gerados'],
        [numberText(peopleTotal), 'pessoas acumuladas'],
        [numberText(records.filter(hasOccurrence).length), 'checklists com ocorrência'],
        [numberText(totalReplenishments), 'reposições registradas']
      ]
      : [
        [numberText(groups.length), 'banheiros comparados'],
        [numberText(records.length), 'checklists gerados'],
        [numberText(peopleTotal), 'pessoas acumuladas'],
        [topGroup ? shortBathroomName(topGroup.bathroom.name) : '-', 'maior ocorrência']
      ];

    $('#graphMetricGrid').innerHTML = metrics.map(([value, label]) => `
      <article class="metric-card ${String(value).length > 14 ? 'compact-value' : ''}">
        <strong>${value}</strong>
        <span>${label}</span>
      </article>
    `).join('');
  }

  function renderReportMetrics(records, selectedBathroomId) {
    const groups = comparisonGroups(records, selectedBathroomId).filter((group) => group.records.length);
    const totalReplenishments = records.reduce((total, record) => total + (record.replenishments || []).filter((item) => Number(item.quantity || 0) > 0).length, 0);
    const metrics = [
      [selectedBathroomId ? '1' : numberText(groups.length), selectedBathroomId ? 'banheiro selecionado' : 'banheiros com dados'],
      [numberText(records.length), 'checklists no período'],
      [numberText(totalPeopleCount(records)), 'pessoas acumuladas'],
      [numberText(totalReplenishments), 'reposições registradas']
    ];

    $('#reportMetricGrid').innerHTML = metrics.map(([value, label]) => `
      <article class="metric-card">
        <strong>${value}</strong>
        <span>${label}</span>
      </article>
    `).join('');
  }

  function renderGraphComparison(records, selectedBathroomId) {
    const groups = comparisonGroups(records, selectedBathroomId).filter((group) => group.records.length);
    const isComparison = !selectedBathroomId;
    $('#graphComparisonEyebrow').textContent = isComparison ? 'Filtro em modo todos' : 'Banheiro selecionado';
    $('#graphComparisonTitle').textContent = isComparison ? 'Todos os banheiros: comparativo' : 'Resumo do banheiro';
    $('#graphComparisonPill').textContent = isComparison ? 'cada banheiro separado' : 'leitura individual';

    if (!groups.length) {
      renderEmpty('#graphComparison');
      return;
    }

    $('#graphComparison').innerHTML = `
      <div class="comparison-row graph header">
        <span>Banheiro</span>
        <span>Pessoas</span>
        <span>Limpeza parcial/não</span>
        <span>Odor leve/forte</span>
        <span>Papel H. baixo/vazio</span>
        <span>Primeiro ponto</span>
      </div>
      ${groups.map((group) => {
        const groupRecords = group.records;
        const cleanRate = rate(groupRecords, (record) => record.clean_level !== 'sim');
        const odorRate = rate(groupRecords, (record) => record.odor_level !== 'nao');
        const paperRate = rate(groupRecords, (record) => supplyCritical(record, 'papel_higienico'));
        const observed = firstPeopleText([
          firstPeople(groupRecords, (record) => record.clean_level !== 'sim'),
          firstPeople(groupRecords, (record) => record.odor_level !== 'nao'),
          firstPeople(groupRecords, (record) => supplyCritical(record, 'papel_higienico'))
        ]);
        return `
          <div class="comparison-row graph">
            <strong title="${group.bathroom.name}">${shortBathroomName(group.bathroom.name)}</strong>
            <span>${peopleText(totalPeopleCount(groupRecords))}</span>
            ${miniMetricHtml(cleanRate, cleanRate >= 60 ? 'var(--red)' : cleanRate >= 35 ? 'var(--orange)' : 'var(--teal)')}
            ${miniMetricHtml(odorRate, odorRate >= 45 ? 'var(--red)' : odorRate >= 25 ? 'var(--orange)' : 'var(--teal)')}
            ${miniMetricHtml(paperRate, paperRate >= 55 ? 'var(--red)' : paperRate >= 35 ? 'var(--orange)' : 'var(--teal)')}
            <strong>${observed}</strong>
          </div>
        `;
      }).join('')}
    `;
  }

  function renderStackChart(target, records, levels, getter) {
    if (!records.length) {
      renderEmpty(target);
      return;
    }

    const legendParts = levels.map((level) => ({
      label: labels[level],
      color: colors[level]
    }));
    const rows = peopleBuckets.map((bucket) => {
      const bucketRecords = recordsForBucket(records, bucket);
      const parts = fieldDistribution(bucketRecords, levels, getter);
      return `
        <div class="stack-row">
          <strong>${bucket.label}</strong>
          ${stackHtml(parts)}
        </div>
      `;
    }).join('');

    $(target).innerHTML = `${legendHtml(legendParts)}${rows}`;
  }

  function renderSupplyStackChart(records) {
    const supplyRecords = supplyLevelRecords(records);
    if (!supplyRecords.length) {
      renderEmpty('#supplyLevelsChart', 'Sem leitura de insumos no período selecionado.');
      return;
    }

    const legend = legendHtml(['cheio', 'medio', 'baixo', 'vazio'].map((level) => ({
      label: labels[level],
      color: colors[level]
    })));

    $('#supplyLevelsChart').innerHTML = `
      ${legend}
      ${state.config.supply_items.map((item) => `
        <article class="supply-stack-item">
          <strong>${item.label}</strong>
          ${peopleBuckets.map((bucket) => {
            const bucketRecords = recordsForBucket(supplyRecords, bucket);
            const parts = fieldDistribution(bucketRecords, ['cheio', 'medio', 'baixo', 'vazio'], (record) => record.supplies?.[item.key] || 'cheio');
            return `
              <div class="supply-stack-row">
                <span>${bucket.short}</span>
                ${stackHtml(parts)}
              </div>
            `;
          }).join('')}
        </article>
      `).join('')}
    `;
  }

  function conditionItemRows(records) {
    return [
      ['Piso molhado', rate(records, (record) => !!record.condition?.piso_molhado), 'var(--teal)'],
      ['Lixeira cheia', rate(records, (record) => !!record.condition?.lixeira_cheia), 'var(--orange)'],
      ['Vaso/mictório sujo', rate(records, (record) => !!record.condition?.vaso_sujo), 'var(--red)'],
      ['Pia/bancada suja', rate(records, (record) => !!record.condition?.pia_suja), 'var(--blue-strong)']
    ];
  }

  function reasonRows(records) {
    const reasons = ['reposicao', 'limpeza'];
    return reasons.map((reason) => [
      labels[reason],
      records.filter((record) => {
        const normalizedReason = ['piso_molhado', 'manutencao'].includes(record.reason) ? 'limpeza' : record.reason;
        return normalizedReason === reason;
      }).length,
      colors[reason]
    ]);
  }

  function actionRows(records) {
    const actions = [...new Set([...(state.config.actions || []), 'reposicao_alcool'])];
    const rows = actions.map((action) => [
      labels[action] || action,
      records.filter((record) => (record.actions || []).includes(action)).length,
      colors[action] || 'var(--blue-strong)'
    ]);
    return rows.filter((row) => row[1] > 0 || row[0] !== labels.nenhuma_acao);
  }

  function renderPercentBars(target, rows) {
    if (!rows.length) {
      renderEmpty(target);
      return;
    }
    const max = Math.max(...rows.map((row) => Number(row[1] || 0)), 1);
    $(target).innerHTML = rows.map(([label, value, color]) => barRowHtml(label, value, max, color, '%')).join('');
  }

  function renderCountBars(target, rows) {
    if (!rows.length) {
      renderEmpty(target);
      return;
    }
    const max = Math.max(...rows.map((row) => Number(row[1] || 0)), 1);
    $(target).innerHTML = rows.map(([label, value, color]) => barRowHtml(label, value, max, color)).join('');
  }

  function supplyTotals(records) {
    return state.config.supply_items.map((item) => {
      let quantity = 0;
      let events = 0;
      records.forEach((record) => {
        (record.replenishments || []).forEach((entry) => {
          if (entry.item !== item.key) return;
          const amount = Number(entry.quantity || 0);
          if (amount <= 0) return;
          quantity += amount;
          events += 1;
        });
      });
      const peopleSum = totalPeopleCount(records);
      const average = peopleSum > 0 ? (quantity / peopleSum) * 100 : 0;
      return {
        ...item,
        quantity: Math.round(quantity * 100) / 100,
        events,
        average
      };
    });
  }

  function renderGraphBlocks(records) {
    renderStackChart('#conditionChart', records, ['sim', 'parcial', 'nao'], (record) => record.clean_level || 'sim');
    renderStackChart('#odorChart', records, ['nao', 'leve', 'forte'], (record) => record.odor_level || 'nao');
    renderSupplyStackChart(records);
    renderPercentBars('#conditionItemsChart', conditionItemRows(records));
    renderCountBars('#reasonChart', reasonRows(records));
    renderCountBars('#actionChart', actionRows(records));
  }

  function renderReportSummary(records, selectedBathroomId) {
    const groups = comparisonGroups(records, selectedBathroomId).filter((group) => group.records.length);
    const isComparison = !selectedBathroomId;
    $('#reportSummaryEyebrow').textContent = isComparison ? 'Comparação' : 'Banheiro selecionado';
    $('#reportSummaryTitle').textContent = isComparison ? 'Resumo por banheiro' : 'Resumo do banheiro';
    $('#reportSummaryPill').textContent = isComparison ? 'comparação' : 'individual';

    if (!groups.length) {
      renderEmpty('#reportSummary');
      return;
    }

    $('#reportSummary').innerHTML = `
      <div class="comparison-row report header">
        <span>Banheiro</span>
        <span>Checklists</span>
        <span>Pessoas</span>
        <span>Condição parcial/não</span>
        <span>Odor leve/forte</span>
        <span>Insumo crítico</span>
      </div>
      ${groups.map((group) => {
        const groupRecords = group.records;
        const cleanRate = rate(groupRecords, (record) => record.clean_level !== 'sim');
        const odorRate = rate(groupRecords, (record) => record.odor_level !== 'nao');
        const criticalSupply = state.config.supply_items
          .map((item) => ({
            label: item.label,
            count: groupRecords.filter((record) => supplyCritical(record, item.key)).length
          }))
          .sort((a, b) => b.count - a.count)[0];
        return `
          <div class="comparison-row report">
            <strong>${group.bathroom.name}</strong>
            <span>${numberText(groupRecords.length)}</span>
            <span>${peopleText(totalPeopleCount(groupRecords))}</span>
            <strong>${cleanRate}%</strong>
            <strong>${odorRate}%</strong>
            <span>${criticalSupply && criticalSupply.count ? criticalSupply.label : 'sem crítico'}</span>
          </div>
        `;
      }).join('')}
    `;
  }

  function observedFields(records) {
    return [
      ['Limpeza parcial/não', firstPeople(records, (record) => record.clean_level !== 'sim'), 'pessoas acumuladas até a primeira ocorrência'],
      ['Odor leve/forte', firstPeople(records, (record) => record.odor_level !== 'nao'), 'pessoas acumuladas até a primeira ocorrência'],
      ['Papel higiênico baixo/vazio', firstPeople(records, (record) => supplyCritical(record, 'papel_higienico')), 'pessoas acumuladas até o primeiro registro crítico'],
      ['Papel toalha baixo/vazio', firstPeople(records, (record) => supplyCritical(record, 'papel_toalha')), 'pessoas acumuladas até o primeiro registro crítico'],
      ['Sabonete baixo/vazio', firstPeople(records, (record) => supplyCritical(record, 'sabonete')), 'pessoas acumuladas até o primeiro registro crítico']
    ];
  }

  function renderObservedFields(records) {
    if (!records.length) {
      renderEmpty('#observedFieldsReport');
      return;
    }
    $('#observedFieldsReport').innerHTML = observedFields(records).map(([label, people, note]) => `
      <div class="threshold-item">
        <strong>${label}</strong>
        <strong>${peopleText(people)}</strong>
        <span>${note}</span>
      </div>
    `).join('');
  }

  function renderSupplyReport(records) {
    const totals = supplyTotals(records);
    if (!records.length) {
      renderEmpty('#supplyReport');
      return;
    }
    $('#supplyReport').innerHTML = `
      <div class="comparison-row compact-supply header">
        <span>Item</span>
        <span>Consumo médio</span>
        <span>Qtd. reposta</span>
        <span>Reposições</span>
      </div>
      ${totals.map((item) => `
        <div class="comparison-row compact-supply">
          <strong>${item.label}</strong>
          <span>${decimalText(item.average, 1)} ${item.unit}/100 pessoas</span>
          <strong>${decimalText(item.quantity, item.quantity % 1 ? 1 : 0)} ${item.unit}</strong>
          <span>${numberText(item.events)}</span>
        </div>
      `).join('')}
    `;
  }

  function renderSupplyLevelReport(records) {
    const supplyRecords = supplyLevelRecords(records);
    if (!supplyRecords.length) {
      renderEmpty('#supplyLevelReport', 'Sem leitura de insumos no período selecionado.');
      return;
    }
    $('#supplyLevelReport').innerHTML = `
      <div class="comparison-row levels header">
        <span>Insumo</span>
        ${peopleBuckets.slice(0, 4).map((bucket) => `<span>${bucket.label}</span>`).join('')}
      </div>
      ${state.config.supply_items.map((item) => `
        <div class="comparison-row levels">
          <strong>${item.label}</strong>
          ${peopleBuckets.slice(0, 4).map((bucket) => {
            const bucketRecords = recordsForBucket(supplyRecords, bucket);
            return `<span>${dominantLevel(bucketRecords, (record) => record.supplies?.[item.key] || 'cheio')}</span>`;
          }).join('')}
        </div>
      `).join('')}
    `;
  }

  function renderReportBlocks(records) {
    renderObservedFields(records);
    renderSupplyReport(records);
    renderPercentBars('#conditionReport', conditionItemRows(records));
    renderCountBars('#reasonReport', reasonRows(records));
    renderCountBars('#actionReport', actionRows(records));
    renderSupplyLevelReport(records);
  }

  function xmlText(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function svgBar(label, value, max, color, y) {
    const width = max ? Math.max(4, (value / max) * 380) : 0;
    return `
      <text x="72" y="${y + 15}" fill="${colorHex.text}" font-size="15" font-weight="700">${xmlText(label)}</text>
      <rect x="300" y="${y}" width="380" height="18" rx="9" fill="${colorHex.track}"/>
      <rect x="300" y="${y}" width="${width}" height="18" rx="9" fill="${color}"/>
      <text x="700" y="${y + 15}" fill="${colorHex.text}" font-size="15" font-weight="700">${numberText(value)}</text>
    `;
  }

  function buildGraphSvg(records, selectedBathroomId) {
    const groups = comparisonGroups(records, selectedBathroomId).filter((group) => group.records.length);
    const conditionRows = conditionItemRows(records);
    const action = actionRows(records).slice(0, 6);
    const width = 1200;
    const height = 820;
    const maxCondition = Math.max(...conditionRows.map((row) => row[1]), 1);
    const maxAction = Math.max(...action.map((row) => row[1]), 1);
    const peopleTotal = totalPeopleCount(records);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Gráfico dos checklists">
        <rect width="${width}" height="${height}" rx="28" fill="#f4f7fb"/>
        <rect x="34" y="34" width="1132" height="96" rx="18" fill="#ffffff" stroke="${colorHex.line}"/>
        <text x="70" y="78" fill="${colorHex.text}" font-size="30" font-weight="700">Gráfico dos checklists</text>
        <text x="70" y="108" fill="${colorHex.muted}" font-size="16">${numberText(records.length)} checklists | ${numberText(peopleTotal)} pessoas acumuladas | condição, odor, insumos e ação.</text>
        <rect x="34" y="160" width="1132" height="190" rx="18" fill="#ffffff" stroke="${colorHex.line}"/>
        <text x="70" y="204" fill="${colorHex.text}" font-size="22" font-weight="700">${selectedBathroomId ? 'Resumo do banheiro' : 'Todos os banheiros: comparativo'}</text>
        ${groups.slice(0, 4).map((group, index) => {
          const y = 236 + index * 28;
          const cleanRate = rate(group.records, (record) => record.clean_level !== 'sim');
          const odorRate = rate(group.records, (record) => record.odor_level !== 'nao');
          const paperRate = rate(group.records, (record) => supplyCritical(record, 'papel_higienico'));
          return `
            <text x="70" y="${y}" fill="${colorHex.text}" font-size="15" font-weight="700">${xmlText(group.bathroom.name)}</text>
            <text x="390" y="${y}" fill="${colorHex.text}" font-size="15">${numberText(group.records.length)} checklists</text>
            <text x="560" y="${y}" fill="${colorHex.red}" font-size="15" font-weight="700">Limpeza ${cleanRate}%</text>
            <text x="740" y="${y}" fill="${colorHex.orange}" font-size="15" font-weight="700">Odor ${odorRate}%</text>
            <text x="900" y="${y}" fill="${colorHex.teal}" font-size="15" font-weight="700">Papel H. ${paperRate}%</text>
          `;
        }).join('')}
        <rect x="34" y="382" width="548" height="370" rx="18" fill="#ffffff" stroke="${colorHex.line}"/>
        <text x="70" y="428" fill="${colorHex.text}" font-size="22" font-weight="700">Itens de condição</text>
        ${conditionRows.map((row, index) => svgBar(row[0], row[1], maxCondition, row[2].replace('var(--teal)', colorHex.teal).replace('var(--orange)', colorHex.orange).replace('var(--red)', colorHex.red).replace('var(--blue-strong)', colorHex.blue), 462 + index * 52)).join('')}
        <rect x="618" y="382" width="548" height="370" rx="18" fill="#ffffff" stroke="${colorHex.line}"/>
        <text x="654" y="428" fill="${colorHex.text}" font-size="22" font-weight="700">Ação realizada</text>
        ${action.map((row, index) => svgBar(row[0], row[1], maxAction, row[2].replace('var(--teal)', colorHex.teal).replace('var(--orange)', colorHex.orange).replace('var(--red)', colorHex.red).replace('var(--blue-strong)', colorHex.blue).replace('var(--green)', colorHex.green).replace('var(--yellow)', colorHex.yellow), 462 + index * 44).replaceAll('x="72"', 'x="654"').replaceAll('x="300"', 'x="884"').replaceAll('x="700"', 'x="1090"')).join('')}
      </svg>
    `;
  }

  async function loadGraph() {
    const { records, report } = await fetchAnalysis('graph');
    currentGraphRecords = records;
    currentReport = report;
    const selectedBathroomId = $('#graphBathroom').value;
    renderGraphMetrics(records, selectedBathroomId);
    renderGraphComparison(records, selectedBathroomId);
    renderGraphBlocks(records);
    currentGraphSvg = records.length ? buildGraphSvg(records, selectedBathroomId) : '';
  }

  async function loadReport() {
    const { records, report } = await fetchAnalysis('report');
    currentReportRecords = records;
    currentReport = report;
    const selectedBathroomId = $('#reportBathroom').value;
    renderReportMetrics(records, selectedBathroomId);
    renderReportSummary(records, selectedBathroomId);
    renderReportBlocks(records);
  }

  function historyDetailsText(record) {
    const details = [];
    const condition = record.condition || {};
    if (condition.piso_molhado) details.push('Piso molhado');
    if (condition.lixeira_cheia) details.push('Lixeira cheia');
    if (condition.vaso_sujo) details.push('Vaso/mictório sujo');
    if (condition.pia_suja) details.push('Pia/bancada suja');
    (record.replenishments || []).forEach((item) => {
      details.push(`${supplyItem(item.item).label}: ${numberText(item.quantity)} ${item.unit}`);
    });
    if (record.notes) details.push(record.notes);
    return details.length ? details.join(' · ') : '-';
  }

  function renderHistoryMetrics(records) {
    const responsibleCount = new Set(records.map((record) => String(record.responsible_name || '').trim()).filter(Boolean)).size;
    const peopleTotal = totalPeopleCount(records);
    const lastRecord = records[0];
    const metrics = [
      [numberText(records.length), 'checklists no histórico'],
      [numberText(peopleTotal), 'pessoas acumuladas'],
      [numberText(responsibleCount), 'responsáveis'],
      [lastRecord ? dateText(lastRecord.created_at) : '-', 'último checklist']
    ];

    $('#historyMetricGrid').innerHTML = metrics.map(([value, label]) => `
      <article class="metric-card ${String(value).length > 14 ? 'compact-value' : ''}">
        <strong>${htmlText(value)}</strong>
        <span>${label}</span>
      </article>
    `).join('');
  }

  function renderHistoryList(records) {
    $('#historyCountPill').textContent = pluralText(records.length, 'registro', 'registros');
    if (!records.length) {
      renderEmpty('#historyList', 'Nenhum checklist encontrado no período selecionado.');
      return;
    }

    $('#historyList').innerHTML = `
      <div class="history-row header">
        <span>Data e hora</span>
        <span>Banheiro</span>
        <span>Motivo</span>
        <span>Ação</span>
        <span>Responsável</span>
        <span>Detalhes</span>
      </div>
      ${records.map((record) => `
        <article class="history-row">
          <time>${htmlText(dateText(record.created_at))}</time>
          <strong title="${htmlText(record.bathroom_name)}">${htmlText(shortBathroomName(record.bathroom_name))}</strong>
          <span>${htmlText(labels[record.reason] || record.reason || '-')}</span>
          <span>${htmlText(actionsText(record))}</span>
          <strong>${htmlText(record.responsible_name || 'Sem responsável')}</strong>
          <span>${htmlText(historyDetailsText(record))}</span>
        </article>
      `).join('')}
    `;
  }

  async function loadHistory() {
    const params = paramsForMode('history');
    params.set('limit', '1000');
    const records = await api(`/api/bathroom-checklists?${params.toString()}`);
    currentHistoryRecords = records;
    renderHistoryMetrics(records);
    renderHistoryList(records);
  }

  async function clearHistory() {
    const filters = selectedFilterText('history');
    const message = `Limpar o histórico de ${filters.from} até ${filters.to} para ${filters.bathroom}?`;
    if (!confirm(message)) return;

    const params = paramsForMode('history');
    params.set('confirm', 'limpar-historico-checklists');
    const result = await api(`/api/bathroom-checklists/history?${params.toString()}`, {
      method: 'DELETE'
    });
    alert(`${numberText(result.deleted)} registro(s) apagado(s).`);
    await Promise.all([
      loadHistory(),
      loadGraph(),
      loadReport()
    ]);
  }

  function downloadBlob(filename, content, type) {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
  }

  function csvCell(value) {
    return `"${String(value ?? '').replace(/"/g, '""')}"`;
  }

  function csvLine(values) {
    return values.map(csvCell).join(';');
  }

  function selectedFilterText(mode) {
    const bathroomId = $(`#${mode}Bathroom`).value;
    return {
      from: $(`#${mode}FromDate`).value || 'sem início',
      to: $(`#${mode}ToDate`).value || 'sem fim',
      bathroom: bathroomId ? bathroomById(bathroomId)?.name || bathroomId : 'Todos os banheiros'
    };
  }

  function downloadGraphSvg() {
    if (!currentGraphSvg) {
      alert('Gere um gráfico com dados antes de baixar.');
      return;
    }
    downloadBlob(`grafico-checklist-banheiros-${new Date().toISOString().slice(0, 10)}.svg`, currentGraphSvg, 'image/svg+xml;charset=utf-8');
  }

  function downloadReportCsv() {
    const records = currentReportRecords;
    if (!records.length) {
      alert('Gere um relatório com dados antes de baixar.');
      return;
    }

    const filters = selectedFilterText('report');
    const groups = comparisonGroups(records, $('#reportBathroom').value).filter((group) => group.records.length);
    const totals = supplyTotals(records);
    const lines = [
      'sep=;',
      csvLine(['Relatório dos checklists de banheiros']),
      csvLine(['Gerado em', dateText(new Date().toISOString())]),
      csvLine(['De', filters.from, 'Até', filters.to, 'Banheiro', filters.bathroom]),
      '',
      csvLine(['Resumo por banheiro']),
      csvLine(['Banheiro', 'Checklists', 'Pessoas acumuladas', 'Condição parcial/não', 'Odor leve/forte', 'Ocorrências'])
    ];

    groups.forEach((group) => {
      lines.push(csvLine([
        group.bathroom.name,
        group.records.length,
        totalPeopleCount(group.records),
        `${rate(group.records, (record) => record.clean_level !== 'sim')}%`,
        `${rate(group.records, (record) => record.odor_level !== 'nao')}%`,
        group.records.filter(hasOccurrence).length
      ]));
    });

    lines.push(
      '',
      csvLine(['Pessoas acumuladas por campo']),
      csvLine(['Campo', 'Pessoas acumuladas', 'Observação'])
    );
    observedFields(records).forEach(([label, people, note]) => {
      lines.push(csvLine([label, peopleText(people), note]));
    });

    lines.push(
      '',
      csvLine(['Insumos e reposições']),
      csvLine(['Item', 'Consumo médio', 'Quantidade reposta', 'Reposições'])
    );
    totals.forEach((item) => {
      lines.push(csvLine([
        item.label,
        `${decimalText(item.average, 1)} ${item.unit}/100 pessoas`,
        `${decimalText(item.quantity, item.quantity % 1 ? 1 : 0)} ${item.unit}`,
        item.events
      ]));
    });

    lines.push(
      '',
      csvLine(['Registros detalhados']),
      csvLine([
        'Data e hora',
        'Banheiro',
        'Pessoas consideradas no checklist',
        'Motivo',
        'Banheiro limpo',
        'Odor',
        'Piso molhado',
        'Lixeira cheia',
        'Vaso/mictório sujo',
        'Pia/bancada suja',
        ...state.config.supply_items.map((item) => item.label),
        'Reposição realizada',
        'Ação realizada',
        'Responsável',
        'Observação'
      ])
    );

    records.forEach((record) => {
      lines.push(csvLine([
        dateText(record.created_at),
        record.bathroom_name,
        record.people_count,
        labels[record.reason] || record.reason,
        labels[record.clean_level] || record.clean_level,
        labels[record.odor_level] || record.odor_level,
        record.condition?.piso_molhado ? 'Sim' : 'Não',
        record.condition?.lixeira_cheia ? 'Sim' : 'Não',
        record.condition?.vaso_sujo ? 'Sim' : 'Não',
        record.condition?.pia_suja ? 'Sim' : 'Não',
        ...state.config.supply_items.map((item) => labels[record.supplies?.[item.key]] || ''),
        (record.replenishments || []).map((item) => `${supplyItem(item.item).label}: ${numberText(item.quantity)} ${item.unit}`).join(' | '),
        actionsText(record),
        record.responsible_name,
        record.notes
      ]));
    });

    downloadBlob(`relatorio-checklist-banheiros-${new Date().toISOString().slice(0, 10)}.csv`, `\ufeff${lines.join('\r\n')}`, 'text/csv;charset=utf-8');
  }

  function activateView(viewName) {
    $$('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === viewName));
    $$('.view').forEach((view) => view.classList.toggle('active', view.id === `${viewName}View`));
    if (viewName === 'checklist') {
      $('#welcomeStep').hidden = false;
      $('#bathroomStep').hidden = true;
      $('#startChecklistCard').hidden = true;
      $('#checklistForm').hidden = true;
      setStep('welcome');
      return;
    }
    setStep(viewName);
    if (viewName === 'graph') loadGraph().catch(() => {});
    if (viewName === 'report') loadReport().catch(() => {});
    if (viewName === 'history') loadHistory().catch(() => {});
  }

  function setupTabs() {
    $$('.tab').forEach((tab) => {
      tab.addEventListener('click', () => activateView(tab.dataset.view));
    });
  }

  async function startApp() {
    if (appStarted) return;
    appStarted = true;
    try {
      state.config = await api('/api/bathroom-checklists/config');
    } catch {
      state.config = fallbackConfig;
    }
    renderBathrooms();
    renderSupplyLevels();
    renderReplenishments();
    applyReasonVisibility();
    renderReasonDetails();
    renderActions();
    selectRadio('clean_level', 'sim');
    selectRadio('odor_level', 'nao');
    setDefaultDateRange();
    setNowFields();
    setStep('welcome');
    setupTabs();
    setupChoiceEvents();
    $('#enterChecklist').addEventListener('click', showBathroomStep);
    $('#startChecklist').addEventListener('click', startChecklist);
    $('#changeBathroom').addEventListener('click', changeBathroom);
    $('#changeBathroomBeforeStart').addEventListener('click', changeBathroom);
    $('#checklistForm').addEventListener('submit', saveChecklist);
    $('#loadGraph').addEventListener('click', () => loadGraph().catch((error) => alert(error.message)));
    $('#loadReport').addEventListener('click', () => loadReport().catch((error) => alert(error.message)));
    $('#loadHistory').addEventListener('click', () => loadHistory().catch((error) => alert(error.message)));
    $('#clearHistory').addEventListener('click', () => clearHistory().catch((error) => alert(error.message)));
    $('#downloadGraph').addEventListener('click', downloadGraphSvg);
    $('#downloadReport').addEventListener('click', downloadReportCsv);
    $('#downloadReportBottom').addEventListener('click', downloadReportCsv);
    loadGraph().catch(() => {});
    loadReport().catch(() => {});
    loadHistory().catch(() => {});
  }

  function init() {
    setupAccessGate();
    if (hasAccess()) startApp().catch((error) => setLoginStatus(error.message, 'error'));
  }

  init();
})();
