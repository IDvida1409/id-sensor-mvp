const AREAS = [
  { id: 'banco-sangue', name: 'Banco de Sangue', unitId: 'unit-h1', clientId: 'h1' },
  { id: 'laboratorio', name: 'Laboratorio', unitId: 'unit-h1', clientId: 'h1' },
  { id: 'uti', name: 'UTI', unitId: 'unit-h1', clientId: 'h1' },
  { id: 'farmacia', name: 'Farmacia', unitId: 'unit-h1', clientId: 'h1' }
];

const CLIENTS = [
  { id: 'h1', name: 'H1', code: 'CLI-H1' }
];

const UNITS = [
  { id: 'unit-h1', clientId: 'h1', name: 'Unidade H1', code: 'UNI-H1' }
];

function nowIso() {
  return new Date().toISOString();
}

function buildChart(base) {
  return [
    base - 0.2, base - 0.1, base, base + 0.1,
    base, base - 0.1, base, base + 0.1,
    base + 0.2, base + 0.1, base, base
  ].map((v) => Number(v.toFixed(1)));
}

function baseDevice(index, area) {
  const id = index + 1;
  const temp = Number((4.6 + ((index % 6) * 0.4)).toFixed(1));
  const battery = 95 - (index * 3);
  const powerMode = id % 5 === 0 ? 'source' : 'battery';

  return {
    id,
    name: `Geladeira ${id}`,
    clientId: area.clientId,
    unitId: area.unitId,
    areaId: area.id,
    areaName: area.name,
    temp,
    min: 2,
    max: 8,
    online: true,
    battery: Math.max(8, battery),
    humidity: 58 + (index % 9),
    powerMode,
    inContract: id <= 20,
    pendingActivation: id > 20 && id <= 22,
    linkedEquipmentId: id <= 20 ? `EQ-${String(id).padStart(3, '0')}` : null,
    mac: `C3:00:00:2E:${String(100 + id).padStart(2, '0')}:${String(150 + id).padStart(2, '0')}`,
    deviceModel: 'IDSensor V5',
    connType: powerMode === 'source' ? 'LoRa' : 'Wi-Fi',
    code: String(id).padStart(4, '0'),
    equipModel: 'IDvida Cooler Pro',
    responsible: 'Equipe IDvida',
    events: ['Sem alerta ativo'],
    chart: buildChart(temp),
    calibrationStatus: 'calibrated',
    calibrationDueAt: '2026-12-31',
    statusCycle: null,
    lastUpdateAt: nowIso(),
    auditLog: [
      {
        scope: 'status',
        field: 'Status do dispositivo',
        user: 'Sistema',
        when: nowIso(),
        description: 'Dispositivo inicializado no backend starter.'
      }
    ]
  };
}

function createDevices() {
  const total = 24;
  const devices = [];

  for (let i = 0; i < total; i += 1) {
    const area = AREAS[i % AREAS.length];
    devices.push(baseDevice(i, area));
  }

  // Casos para cobrir todos os cenarios de UI/NOC
  devices[1].online = false;
  devices[1].events = ['Sem comunicacao ha 15 min'];

  devices[2].temp = 8.6;
  devices[2].chart = buildChart(8.3);
  devices[2].events = ['Fora do limite ha 8 min'];

  devices[4].temp = 10.5;
  devices[4].online = false;
  devices[4].events = ['Fora do limite por 30 minutos'];

  devices[6].battery = 28;
  devices[6].events = ['Bateria em monitoramento'];

  devices[10].battery = 12;
  devices[10].events = ['Bateria critica'];

  devices[11].temp = 11.1;
  devices[11].events = ['Critico - alerta enviado'];

  devices[14].temp = 7.9;
  devices[14].events = ['Proximo do limite'];

  devices[20].temp = null;
  devices[20].online = false;
  devices[20].battery = null;
  devices[20].statusCycle = {
    state: 'maint',
    reason: 'Manutencao preventiva',
    startedAt: nowIso(),
    activeUntil: new Date(Date.now() + (2 * 60 * 60 * 1000)).toISOString(),
    previousState: 'blue',
    previousStatus: 'NORMAL'
  };

  devices[21].temp = null;
  devices[21].online = false;
  devices[21].battery = null;
  devices[21].statusCycle = {
    state: 'inventory',
    reason: 'Inventario de itens',
    startedAt: nowIso(),
    activeUntil: new Date(Date.now() + (60 * 60 * 1000)).toISOString(),
    previousState: 'blue',
    previousStatus: 'NORMAL'
  };

  devices[22].temp = null;
  devices[22].online = false;
  devices[22].battery = null;
  devices[22].statusCycle = {
    state: 'defrost',
    reason: 'Degelo programado',
    startedAt: nowIso(),
    activeUntil: new Date(Date.now() + (90 * 60 * 1000)).toISOString(),
    previousState: 'blue',
    previousStatus: 'NORMAL'
  };

  devices[23].temp = null;
  devices[23].online = false;
  devices[23].battery = null;
  devices[23].statusCycle = {
    state: 'restock',
    reason: 'Reposicao de insumos',
    startedAt: nowIso(),
    activeUntil: new Date(Date.now() + (75 * 60 * 1000)).toISOString(),
    previousState: 'blue',
    previousStatus: 'NORMAL'
  };

  // Dispositivos de fonte para desconexao
  [4, 9, 19].forEach((idx) => {
    if (devices[idx]) {
      devices[idx].powerMode = 'source';
      devices[idx].connType = 'LoRa';
    }
  });

  return devices;
}

function createServiceOrders() {
  return [
    {
      id: 'SO-0001',
      type: 'orcamento',
      status: 'em_analise',
      requester: 'Admin 1',
      areaId: 'banco-sangue',
      createdAt: nowIso(),
      note: 'Solicitacao inicial do prototipo.'
    }
  ];
}

module.exports = {
  CLIENTS,
  UNITS,
  AREAS,
  createDevices,
  createServiceOrders
};
