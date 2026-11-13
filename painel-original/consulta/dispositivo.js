(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const date = value => value ? value.split('-').reverse().join('/') : 'Não informado';
  async function load() {
    try {
      const response = await fetch('/api/device-info/' + encodeURIComponent(window.IDSENSOR_DEVICE_MAC), { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result.ok) throw Error(result.message || 'Não foi possível consultar o dispositivo.');
      const info = result.data;
      $('#photo').src = info.image; $('#photo').alt = 'Ilustração do ' + info.model;
      $('#model').textContent = info.model; $('#manufacturer').textContent = info.manufacturer; $('#mac').textContent = info.mac;
      $('#condition').textContent = info.condition; $('#condition').classList.toggle('used', info.previously_used);
      $('#received').textContent = date(info.received_on); $('#usage').textContent = info.condition;
      $('#assignment').textContent = info.current ? info.current.area + ' · ' + info.current.equipment : 'Sem vínculo com equipamento';
      $('#probe').textContent = info.measurement?.probe || 'Faixa de medição não cadastrada';
      $('#limits').hidden = !info.measurement; $('#specification').hidden = !info.measurement;
      if (info.measurement) {
        const temp = value => (value < 0 ? '−' + Math.abs(value) : '+' + value) + ' °C';
        $('#min').textContent = temp(info.measurement.min); $('#max').textContent = temp(info.measurement.max);
        $('#measurement-note').textContent = info.measurement.note; $('#specification').href = info.measurement.source;
      }
      const calibration = info.calibration;
      $('#calibrated').textContent = date(calibration.calibrated_on); $('#expires').textContent = date(calibration.expires_on);
      $('#calibration-status').textContent = { valid: 'Dentro do prazo', expired: 'Certificado vencido', warning: 'Próximo do vencimento' }[calibration.status];
      $('#calibration-status').classList.add(calibration.status);
      $('#seal').src = '/assets/icone-certificado-' + { valid: 'azul', expired: 'vermelho', warning: 'laranja' }[calibration.status] + '-painel-atual.png';
      $('#certificate').href = calibration.certificate;
      $('#history-summary').textContent = info.history.length ? 'Áreas e equipamentos deste exemplo de utilização.' : 'Sem registros de instalação.';
      for (const entry of info.history) {
        const li = document.createElement('li'); if (entry.current) li.className = 'current';
        const area = document.createElement('strong'); area.textContent = entry.area;
        const equipment = document.createElement('span'); equipment.textContent = entry.equipment;
        const period = document.createElement('span'); period.textContent = date(entry.from) + ' → ' + (entry.current ? 'Uso atual' : date(entry.to));
        li.append(area, equipment, period); $('#history').append(li);
      }
      if (info.current) { $('#temperature').hidden = false; $('#temperature').href = info.current.url; }
      const message = $('#device-menu-message');
      function explain(title, copy) { $('#device-message-title').textContent = title; $('#device-message-text').textContent = copy; message.showModal(); }
      $('#device-message-close').addEventListener('click', () => message.close());
      document.querySelectorAll('[data-device-action]').forEach(button => button.addEventListener('click', () => {
        const action = button.dataset.deviceAction;
        if (action === 'certificate') { $('.calibration').scrollIntoView({block:'start',behavior:'smooth'}); return; }
        if (action === 'help') { explain('Ajuda', 'Esta consulta reúne os dados do MAC ' + info.mac + '. A faixa de medição pertence à probe do modelo indicado. O certificado e os registros de instalação acompanham este dispositivo.'); return; }
        if (info.current) { location.href = info.current.url + (action === 'replace' ? '#trocar' : ''); return; }
        explain(action === 'temperature' ? 'Dispositivo novo' : 'Instalar este dispositivo', action === 'temperature' ? 'Este dispositivo ainda não está vinculado a um equipamento. A temperatura ficará disponível após a instalação.' : 'Abra o QR do dispositivo instalado na geladeira, escolha Trocar dispositivo e informe a chave de acesso. Depois, escaneie o QR deste dispositivo novo.');
      }));
      $('#details').hidden = false; $('#feedback').hidden = true;
      document.title = 'IDsensor — ' + info.model + ' · ' + info.mac;
    } catch (error) { $('#feedback').textContent = error.message; }
  }
  load();
})();
