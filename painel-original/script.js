/* ===== SCRIPT BLOCK 1 | (sem-id) ===== */
const devices = [
  {id:1,name:'Geladeira 1',sector:'Banco IDvida',temp:5.4,dailyMin:4.8,dailyMax:5.6,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:92,hum1:22,hum2:24,updated:'agora',timerLabel:'Dentro da faixa segura',timer:0,fill:52,range:36,events:['Sem alerta ativo'],chart:[5.2,5.1,5.2,5.3,5.4,5.3,5.2,5.4,5.5,5.4,5.3,5.4]},
  {id:2,name:'Geladeira 2',sector:'Banco IDvida',temp:3.2,dailyMin:3.2,dailyMax:7.5,min:2,max:8,status:'NORMAL',state:'blue',online:false,battery:45,hum1:61,hum2:61,updated:'agora',timerLabel:'Dentro da faixa segura',timer:0,fill:40,range:28,events:['Sem alerta ativo'],commText:'Sem comunicação há 15 min',chart:[3.1,3.2,3.1,3.0,3.1,3.2,3.3,3.2,3.2,3.1,3.2,3.2]},
  {id:3,name:'Geladeira 3',sector:'Banco IDvida',temp:8.6,dailyMin:7.0,dailyMax:8.9,min:2,max:8,status:'ATENÇÃO',state:'warn',online:true,battery:82,hum1:61,hum2:67,updated:'há 7 min',timerLabel:'Fora do limite há 8 min · alerta em 22 min',timer:26,fill:64,range:82,events:['Fora do limite há 8 min','Alerta previsto em 22 min'],chart:[7.1,7.2,7.0,7.3,7.5,7.9,8.1,8.0,8.2,8.3,8.4,8.6]},
  {id:4,name:'Geladeira 4',sector:'Banco IDvida',temp:5.1,dailyMin:4.7,dailyMax:5.4,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:90,hum1:64,hum2:66,updated:'agora',timerLabel:'Dentro da faixa segura',timer:0,fill:50,range:34,events:['Sem alerta ativo'],chart:[5.0,5.1,5.1,5.2,5.0,4.9,5.1,5.2,5.2,5.1,5.0,5.1]},
  {id:5,name:'Geladeira 5',sector:'Banco IDvida',temp:-127.0,dailyMin:1.2,dailyMax:16.0,min:2,max:8,status:'CRÍTICO',state:'crit',online:false,battery:79,hum1:72,hum2:72,updated:'agora',timerLabel:'30 min atingidos · alertas enviados',timer:100,fill:84,range:96,events:['SMS enviado','Email enviado','Fora do limite por 30 minutos'],commText:'Última comunicação: 20/03',chart:[7.3,7.4,7.2,7.5,7.8,8.3,8.9,9.4,9.8,10.1,10.5,10.8]},
  {id:6,name:'Geladeira 6',sector:'Banco IDvida',temp:7.9,dailyMin:6.8,dailyMax:7.9,min:2,max:8,status:'ATENÇÃO',state:'warn',online:true,battery:82,hum1:61,hum2:67,updated:'agora',timerLabel:'Próximo do limite · monitorando',timer:14,fill:60,range:76,events:['Próximo do limite','Sem envio de alerta'],chart:[6.8,6.7,6.9,7.0,7.1,7.2,7.2,7.3,7.4,7.5,7.7,7.9]},
  {id:7,name:'Geladeira 7',sector:'Banco IDvida',temp:4.7,dailyMin:4.2,dailyMax:5.1,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:28,hum1:60,hum2:63,updated:'há 1 min',timerLabel:'Dentro da faixa segura',timer:0,fill:46,range:44,events:['Sem alerta ativo'],chart:[4.8,4.7,4.8,4.9,4.8,4.7,4.6,4.7,4.8,4.8,4.7,4.7]},
  {id:8,name:'Geladeira 8',sector:'Banco IDvida',temp:8.3,dailyMin:7.1,dailyMax:8.5,min:2,max:8,status:'ATENÇÃO',state:'warn',online:true,battery:76,hum1:63,hum2:65,updated:'há 3 min',timerLabel:'Fora do limite há 4 min · alerta em 26 min',timer:14,fill:62,range:80,events:['Fora do limite há 4 min','Alerta previsto em 26 min'],chart:[7.0,7.2,7.1,7.2,7.3,7.5,7.7,7.9,8.0,8.0,8.2,8.3]},
  {id:9,name:'Geladeira 9',sector:'Banco IDvida',temp:6.1,dailyMin:5.7,dailyMax:6.3,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:89,hum1:62,hum2:64,updated:'agora',timerLabel:'Dentro da faixa segura',timer:0,fill:54,range:48,events:['Sem alerta ativo'],chart:[6.0,6.1,6.0,6.1,6.2,6.1,6.0,6.0,6.1,6.2,6.1,6.1]},
  {id:10,name:'Geladeira 10',sector:'Banco IDvida',temp:2.8,dailyMin:2.6,dailyMax:3.4,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:69,hum1:58,hum2:60,updated:'há 6 min',timerLabel:'Última leitura estável',timer:0,fill:34,range:20,events:['Offline, última leitura preservada'],chart:[2.9,2.8,2.8,2.9,2.8,2.7,2.8,2.8,2.8,2.9,2.8,2.8]},
  {id:11,name:'Geladeira 11',sector:'Banco IDvida',temp:9.5,dailyMin:7.4,dailyMax:9.7,min:2,max:8,status:'ATENÇÃO',state:'warn',online:true,battery:12,hum1:66,hum2:69,updated:'há 9 min',timerLabel:'Fora do limite há 18 min · alerta em 12 min',timer:60,fill:72,range:88,events:['Fora do limite há 18 min','Alerta previsto em 12 min'],chart:[7.4,7.5,7.6,7.7,7.8,8.0,8.2,8.4,8.7,9.0,9.3,9.5]},
  {id:12,name:'Geladeira 12',sector:'Banco IDvida',temp:11.1,dailyMin:8.2,dailyMax:11.3,min:2,max:8,status:'CRÍTICO',state:'crit',online:true,battery:74,hum1:71,hum2:74,updated:'há 2 min',timerLabel:'30 min atingidos · alertas enviados',timer:100,fill:86,range:98,events:['SMS enviado','Email enviado','Fora do limite'],chart:[7.2,7.3,7.5,7.8,8.1,8.5,9.0,9.4,9.8,10.3,10.8,11.1]},
  {id:13,name:'Geladeira 13',sector:'Banco IDvida',temp:5.8,dailyMin:5.2,dailyMax:6.1,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:87,hum1:63,hum2:64,updated:'agora',timerLabel:'Dentro da faixa segura',timer:0,fill:56,range:40,events:['Sem alerta ativo'],chart:[5.7,5.8,5.8,5.9,5.8,5.7,5.8,5.9,5.8,5.8,5.9,5.8]},
  {id:14,name:'Geladeira 14',sector:'Banco IDvida',temp:4.9,dailyMin:4.4,dailyMax:5.0,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:91,hum1:60,hum2:62,updated:'agora',timerLabel:'Dentro da faixa segura',timer:0,fill:48,range:38,events:['Sem alerta ativo'],chart:[4.8,4.9,5.0,4.9,4.8,4.8,4.9,5.0,4.9,4.9,4.8,4.9]},
  {id:15,name:'Geladeira 15',sector:'Banco IDvida',temp:6.7,dailyMin:6.0,dailyMax:6.9,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:85,hum1:62,hum2:65,updated:'há 1 min',timerLabel:'Dentro da faixa segura',timer:0,fill:58,range:58,events:['Sem alerta ativo'],chart:[6.5,6.6,6.6,6.7,6.7,6.8,6.7,6.6,6.7,6.7,6.8,6.7]},
  {id:16,name:'Geladeira 16',sector:'Banco IDvida',temp:7.4,dailyMin:6.8,dailyMax:7.8,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:80,hum1:64,hum2:66,updated:'há 2 min',timerLabel:'Próximo do limite, ainda dentro da faixa',timer:0,fill:61,range:68,events:['Sem alerta ativo'],chart:[7.0,7.1,7.1,7.2,7.2,7.3,7.4,7.4,7.3,7.4,7.4,7.4]},
  {id:17,name:'Geladeira 17',sector:'Banco IDvida',temp:5.0,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:83,hum1:60,hum2:63,updated:'agora',timerLabel:'Dentro da faixa segura',timer:0,fill:49,range:35,events:['Sem alerta ativo'],chart:[5.0,5.0,5.1,5.0,4.9,5.0,5.1,5.0,5.0,4.9,5.0,5.0]},
  {id:18,name:'Geladeira 18',sector:'Banco IDvida',temp:8.1,min:2,max:8,status:'ATENÇÃO',state:'warn',online:true,battery:68,hum1:66,hum2:68,updated:'há 5 min',timerLabel:'Fora do limite há 2 min · alerta em 28 min',timer:8,fill:61,range:78,events:['Fora do limite há 2 min','Alerta previsto em 28 min'],chart:[7.0,7.0,7.1,7.1,7.2,7.3,7.4,7.5,7.7,7.9,8.0,8.1]},
  {id:19,name:'Geladeira 19',sector:'Banco IDvida',temp:4.2,min:2,max:8,status:'NORMAL',state:'blue',online:true,battery:78,hum1:59,hum2:61,updated:'há 1 min',timerLabel:'Dentro da faixa segura',timer:0,fill:43,range:30,events:['Sem alerta ativo'],chart:[4.2,4.1,4.2,4.3,4.2,4.1,4.2,4.2,4.3,4.2,4.2,4.2]},
  {id:20,name:'Geladeira 20',sector:'Banco IDvida',temp:10.2,min:2,max:8,status:'CRÍTICO',state:'crit',online:true,battery:72,hum1:70,hum2:73,updated:'há 4 min',timerLabel:'30 min atingidos · alertas enviados',timer:100,fill:80,range:94,events:['SMS enviado','Email enviado','Fora do limite por 30 minutos'],chart:[7.1,7.2,7.3,7.6,7.9,8.2,8.6,9.0,9.3,9.7,9.9,10.2]},
  {id:21,name:'Geladeira 21',sector:'Banco IDvida',temp:null,min:2,max:8,status:'MANUTENÇÃO',state:'maint',online:false,battery:null,hum1:null,hum2:null,updated:'há 30 min',timerLabel:'Em manutenção há 30 min',timer:40,fill:28,range:0,events:['Equipamento em manutenção','Responsável: João Silva','Previsão: mais 1h'],chart:[5.4,5.3,5.3,5.2,5.2,5.1,5.1,5.0,5.0,5.0,5.0,5.0]},
  {id:22,name:'Geladeira 22',sector:'Banco IDvida',temp:null,min:2,max:8,status:'MANUTENÇÃO',state:'maint',online:false,battery:null,hum1:null,hum2:null,updated:'há 2h',timerLabel:'Em manutenção há 2h',timer:80,fill:28,range:0,events:['Equipamento em manutenção','Responsável: Carlos Lima','Sem previsão de retorno'],chart:[6.0,6.0,5.9,5.9,5.8,5.8,5.8,5.7,5.7,5.7,5.7,5.7]},
  {id:23,name:'Geladeira 23',sector:'Banco IDvida',temp:null,min:2,max:8,status:'MANUTENÇÃO',state:'maint',online:false,battery:null,hum1:null,hum2:null,updated:'há 10 min',timerLabel:'Manutenção iniciada',timer:15,fill:28,range:0,events:['Manutenção preventiva','Responsável: Equipe Técnica'],chart:[4.9,4.9,4.8,4.8,4.8,4.7,4.7,4.7,4.7,4.7,4.7,4.7]},
  {id:24,name:'Geladeira 24',sector:'Banco IDvida',temp:null,min:2,max:8,status:'MANUTENÇÃO',state:'maint',online:false,battery:null,hum1:null,hum2:null,updated:'há 50 min',timerLabel:'Em manutenção',timer:55,fill:28,range:0,events:['Falha detectada','Responsável: Ana Paula','Previsão: mais 30 min'],chart:[5.8,5.8,5.7,5.7,5.6,5.6,5.6,5.5,5.5,5.5,5.5,5.5]}
];

const SAMPLE_CERTIFICATE_FILE = 'certificado-geladeira-1.pdf';
const SAMPLE_CERTIFICATE_NAME = 'certificado-geladeira-1.pdf';

devices.forEach(device => {
  const hasSampleCertificate = Number(device.id) === 1 || Number(device.id) === 2;
  device.hasCertificate = hasSampleCertificate;
  device.certificateHidden = !hasSampleCertificate;
  device.certificateFile = hasSampleCertificate ? SAMPLE_CERTIFICATE_FILE : '';
  device.certificateFileName = hasSampleCertificate ? SAMPLE_CERTIFICATE_NAME : '';
});

function panelEscapeHtml(value){
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function certificatePreviewUrl(url){
  const cleanUrl = String(url || '').trim();
  if(!cleanUrl) return '';
  return cleanUrl.includes('#') ? cleanUrl : `${cleanUrl}#toolbar=0&navpanes=0&scrollbar=0`;
}

const grid = document.getElementById('cardGrid');
const layout = document.getElementById('layout');
const sidepanel = document.getElementById('sidepanel');
const emptyPanel = document.getElementById('emptyPanel');
const accButton = document.getElementById('accButton');
const accMenu = document.getElementById('accMenu');
const accState = document.getElementById('accState');
const toggleColorblind = document.getElementById('toggleColorblind');
const toggleContrast = document.getElementById('toggleContrast');
const toggleMotion = document.getElementById('toggleMotion');
const toggleCommIcon = document.getElementById('toggleCommIcon');
const toggleMinMax = document.getElementById('toggleMinMax');
const toggleBattery = document.getElementById('toggleBattery');
const accLiveBadge = document.getElementById('accLiveBadge');
const accessibility = { colorblind: false, contrast: false, compact: false, showCommIcon: true, showMinMax: true, showBattery: true };
let activeId = null;
let activeFilter = null;
let nocFilteredIds = null;
let selectedArea = 'Banco IDvida';
let selectedClient = 'Laboratório IDvida';

const svgIcon = {
  check: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3.5 8.2 6.6 11.3 12.5 4.9" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  alert: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 2.4 13.2 12.6H2.8L8 2.4Z" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 5.9v3.1" stroke-width="1.8" stroke-linecap="round"/><circle cx="8" cy="11.2" r=".9" fill="currentColor" stroke="none"/></svg>`,
  critical: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="8" cy="8" r="5.8" stroke-width="1.7"/><path d="M8 4.7v4.1" stroke-width="1.9" stroke-linecap="round"/><circle cx="8" cy="11.4" r=".95" fill="currentColor" stroke="none"/></svg>`,
  tool: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9.6 2.8a3 3 0 0 0 2.9 4.9l-5.2 5.2a1.5 1.5 0 1 1-2.1-2.1l5.2-5.2a3 3 0 0 0 4.1-3" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const stateMeta = {
  blue: { icon:svgIcon.check, label:'Normal', summary:'Operação estável e dentro da faixa segura', color:'#2ea8ff', lineClass:'blue-line' },
  warn: { icon:svgIcon.alert, label:'Atenção', summary:'Próximo do limite ou fora do limite sem escalonamento', color:'#ff9b2f', lineClass:'warn-line' },
  crit: { icon:svgIcon.critical, label:'Crítico', summary:'Regra dos 30 minutos atingida com alertas enviados', color:'#ff5d63', lineClass:'crit-line' },
  maint: { icon:svgIcon.tool, label:'Manutenção', summary:'Equipamento fora da operação para ajuste técnico', color:'#98a2b3', lineClass:'maint-line' },
  inventory: { icon:svgIcon.tool, label:'Inventário', summary:'Equipamento temporariamente reservado para conferência', color:'#8b6a43', lineClass:'maint-line' },
  defrost: { icon:svgIcon.tool, label:'Degelo', summary:'Equipamento temporariamente em processo de degelo', color:'#7f69c6', lineClass:'maint-line' },
  restock: { icon:svgIcon.tool, label:'Reposição', summary:'Equipamento temporariamente em reposição', color:'#d9a931', lineClass:'maint-line' }
};

function tempLabel(v){ return v === null ? '--' : `${v.toFixed(1)}°C`; }
function normalizeHumidityTemperatureValue(value){
  if(value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  if(!Number.isFinite(numeric)) return null;
  return numeric > 40 ? Math.min(29, Math.max(18, numeric - 40)) : numeric;
}
function humLabel(v){
  const value = normalizeHumidityTemperatureValue(v);
  return value === null ? '--' : `${value.toFixed(1)}°C`;
}
function battLabel(v){ return v === null ? '--' : `${v}%`; }
function getCommunicationLabel(d){
  return d.online ? '' : `Sem comunicação · ${d.updated}`;
}

const criticalClockStarts = new Map();

function getCriticalClockSeedSeconds(d){
  const configured = Number(d?.criticalElapsedSeconds);
  if(Number.isFinite(configured) && configured >= 0) return configured;
  const id = Number(d?.id) || 1;
  return (31 * 60) + ((id % 9) * 73);
}

function ensureCriticalClockStart(d){
  if(!d) return null;
  const key = String(d.id);
  if(d.state !== 'crit'){
    criticalClockStarts.delete(key);
    return null;
  }
  if(!criticalClockStarts.has(key)){
    criticalClockStarts.set(key, Date.now() - (getCriticalClockSeedSeconds(d) * 1000));
  }
  return criticalClockStarts.get(key);
}

function formatOperationalElapsed(totalSeconds){
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = String(Math.floor(safe / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((safe % 3600) / 60)).padStart(2, '0');
  const seconds = String(safe % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getCriticalElapsedSeconds(d){
  const startedAt = ensureCriticalClockStart(d);
  return startedAt === null ? 0 : Math.floor((Date.now() - startedAt) / 1000);
}

function getStopwatchIcon(){
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="13" r="7.2" stroke="currentColor" stroke-width="1.9"/>
    <path d="M9.5 3h5M12 3v2.8M17.4 7.5l1.4-1.4M12 9.2V13l2.5 1.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function buildCriticalClockCard(d){
  if(!d || d.state !== 'crit'){
    if(d) criticalClockStarts.delete(String(d.id));
    return '';
  }
  return `<div class="critical-clock-card" aria-label="Tempo em estado crítico">
    <span class="critical-clock-icon">${getStopwatchIcon()}</span>
    <span class="critical-clock-copy"><small>Em crítico</small><strong data-critical-timer="${d.id}">${formatOperationalElapsed(getCriticalElapsedSeconds(d))}</strong></span>
  </div>`;
}

function updateOperationalClocks(){
  document.querySelectorAll('[data-critical-timer]').forEach(el => {
    const d = devices.find(item => String(item.id) === String(el.dataset.criticalTimer));
    if(d && d.state === 'crit') el.textContent = formatOperationalElapsed(getCriticalElapsedSeconds(d));
  });
}

setInterval(updateOperationalClocks, 1000);

function getThermoVisual(d){
  const nearLimit = d.temp !== null && (Math.abs(d.max - d.temp) <= 0.8 || Math.abs(d.temp - d.min) <= 0.8 || (d.timerLabel || '').toLowerCase().includes('próximo do limite'));
  if(d.state === 'maint') return {level:0, fill:'#c6ced8', bulb:'#c6ced8'};
  if(d.state === 'inventory') return {level:0, fill:'#8b6a43', bulb:'#8b6a43'};
  if(d.state === 'defrost') return {level:0, fill:'#7f69c6', bulb:'#7f69c6'};
  if(d.state === 'restock') return {level:0, fill:'#d9a931', bulb:'#d9a931'};
  if(d.state === 'crit') return {level:100, fill:'#ff4d4f', bulb:'#ff4d4f'};
  if(d.state === 'warn'){
    const level = Math.max(18, Math.min(100, d.timer || 0));
    return {level, fill:'#ff6b4a', bulb:'#f06a45'};
  }
  const ratio = d.temp === null ? 0 : Math.max(0, Math.min(1, (d.temp - d.min) / Math.max(0.1, (d.max - d.min))));
  if(nearLimit){
    const level = Math.max(18, Math.min(56, Math.round(18 + ratio * 38)));
    return {level, fill:'#f4a43d', bulb:'#f4a43d'};
  }
  const level = Math.max(20, Math.min(82, Math.round(20 + ratio * 56)));
  return {level, fill:'#35a9ff', bulb:'#35a9ff'};
}

function thermoStyle(d, mini=false){
  const t = getThermoVisual(d);
  return `--${mini ? 'mini-' : ''}thermo-level:${t.level}%;--${mini ? 'mini-' : ''}thermo-fill:${t.fill};--${mini ? 'mini-' : ''}thermo-bulb:${t.bulb};`;
}


function getRangeFillStyle(d){
  if(d.state === 'crit') return 'background:linear-gradient(90deg,#ffb54c 0%,#ff9440 35%,#ff6366 70%,#ff3f50 100%);width:100%';
  if(d.state === 'maint') return 'background:linear-gradient(90deg,#b3bcc8 0%,#9099a7 50%,#6d7886 100%);width:52%';
  if(d.state === 'inventory') return 'background:linear-gradient(90deg,#b0885f 0%,#8b6a43 50%,#6f4f2d 100%);width:52%';
  if(d.state === 'defrost') return 'background:linear-gradient(90deg,#b49cff 0%,#8f72eb 50%,#7358ce 100%);width:52%';
  if(d.state === 'restock') return 'background:linear-gradient(90deg,#f3d268 0%,#e8bf49 50%,#d9a931 100%);width:52%';
  if(d.state === 'warn'){
    const t = Math.max(0, Math.min(100, d.timer || 0));
    if(t < 20) return 'background:linear-gradient(90deg,#e5a043 0%,#da8b34 78%,#d37a2c 100%);width:82%';
    if(t < 50) return 'background:linear-gradient(90deg,#e5a043 0%,#d98a33 58%,#d36f39 82%,#ca5f45 100%);width:82%';
    return 'background:linear-gradient(90deg,#e5a043 0%,#d78635 45%,#cf6d3e 72%,#c45052 100%);width:82%';
  }
  const nearLimit = d.temp !== null && ((d.max - d.temp) <= 0.8 || (d.timerLabel || '').toLowerCase().includes('próximo do limite'));
  if(nearLimit) return 'background:linear-gradient(90deg,#2ab2ff 0%,#63c5ff 78%,#88d3ff 88%,#f0a43d 100%);width:70%';
  return 'background:linear-gradient(90deg,#2ab2ff 0%,#63c5ff 45%,#88d3ff 100%);width:70%';
}

function getStatusText(d){
  const meta = stateMeta[d.state];
  return accessibility.colorblind ? meta.label.toUpperCase() : (d.status === "MANUTENÇÃO" ? "MANUTENÇÃO" : d.status);
}

function getBatteryVisualClass(value){
  const level = Number(value);
  if(!Number.isFinite(level)) return 'battery-good';
  if(level < 20) return 'battery-critical';
  if(level <= 35) return 'battery-warning';
  return 'battery-good';
}

function buildSmallCard(d){
  const card = document.createElement('div');
  card.className = `card ${d.state}`;
  card.dataset.id = d.id;
  card.dataset.state = d.state;

  const batteryValue = Number(d.battery);
  const hasBatteryValue = Number.isFinite(batteryValue);
  const batteryClass = getBatteryVisualClass(d.battery);
  const batteryWidth = hasBatteryValue ? Math.max(6, Math.min(100, batteryValue)) : 6;
  const shouldBlinkBattery = hasBatteryValue && batteryValue < 20;
  const batteryHTML = `<div class="battery ${batteryClass}${shouldBlinkBattery ? ' low-battery' : ''}"><div class="battery-icon"><div class="battery-level" style="width:${batteryWidth}%"></div></div> ${battLabel(d.battery)}</div>`;

  card.innerHTML = `
    <div class="card-head">
      <div class="device-line"><div class="device">${d.name}</div></div>
    </div>

    <div class="temp">${tempLabel(d.temp)}</div>

    <div class="middle">
      <div class="metrics">
        <div class="metric-box"><div class="metric-label">Min</div><div class="metric-value">${Math.min(...(d.chart || [d.temp])).toFixed(1)}°C</div></div>
        <div class="metric-box"><div class="metric-label">Max</div><div class="metric-value">${Math.max(...(d.chart || [d.temp])).toFixed(1)}°C</div></div>
      </div>
      <div class="thermo" aria-hidden="true" style="${thermoStyle(d)}">
        <div class="thermo-track"><div class="thermo-fill"></div></div>
        <div class="thermo-bulb"></div>
      </div>
    </div>

    <div class="comm-wrap">
      <div class="comm-track ${d.online ? 'active' : 'inactive'}">
        <div class="comm-flow">
          <div class="comm-circles">
            <div class="comm-dot"></div><div class="comm-dot"></div><div class="comm-dot"></div><div class="comm-dot"></div><div class="comm-dot"></div><div class="comm-dot"></div><div class="comm-dot"></div><div class="comm-dot"></div><div class="comm-dot"></div>
          </div>
          </div>
      </div>
      <div class="comm-label ${d.online ? 'active' : 'inactive'}">${getCommunicationLabel(d)}</div>
    </div>

    ${buildCriticalClockCard(d)}

    <div class="bottom-meta"><div class="left-meta">${batteryHTML}</div><div class="right-meta"><span class="drop"></span> ${humLabel(d.hum2 ?? d.hum1)}</div></div>
    </div>
    ${(d.state === 'warn' || d.state === 'crit' || (d.online === false && d.state !== 'maint')) ? `<div class="card-bell" data-id="${d.id}" title="Silenciar por 15 minutos">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 17H5.5a1 1 0 0 1-.8-1.6l1.1-1.5c.5-.7.7-1.5.7-2.4V9a5.5 5.5 0 1 1 11 0v2.5c0 .9.2 1.7.7 2.4l1.1 1.5a1 1 0 0 1-.8 1.6H15"></path>
        <path d="M9.5 17a2.5 2.5 0 0 0 5 0"></path>
      </svg>
    </div>` : ''}
    ${d.state === 'maint' ? '' : `<div class="offline-logo-badge ${d.commText ? 'offline' : 'online'}"><img src="${d.commText ? 'data:image/png;base64,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' : 'data:image/png;base64,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'}" alt="Comunicação"></div>`}
  `;

  card.setAttribute('aria-label', `${d.name}. Temperatura ${tempLabel(d.temp)}.`);
  card.addEventListener('click', ()=> openDetail(d.id));
  return card;
}

function chartPaths(values){
  const width = 320, height = 150, min = 0, max = 12;
  const step = width/(values.length-1);
  const y = v => height - ((v-min)/(max-min))*height;
  let line = `M 0 ${y(values[0]).toFixed(1)}`;
  for(let i=1;i<values.length;i++) line += ` L ${(i*step).toFixed(1)} ${y(values[i]).toFixed(1)}`;
  let area = `${line} L ${width} ${height} L 0 ${height} Z`;
  return {line, area, y, step};
}

function buildChartMarker(d, pointX, pointY){
  if(d.state === 'warn') return `<polygon class="chart-point" points="${pointX},${pointY-7} ${pointX-7},${pointY+7} ${pointX+7},${pointY+7}" fill="#d55e00" stroke="#fff" stroke-width="3"></polygon>`;
  if(d.state === 'crit') return `<circle class="chart-point" cx="${pointX}" cy="${pointY}" r="6" fill="#d55e00" stroke="#fff" stroke-width="3"/>`;
  if(d.state === 'maint') return `<rect class="chart-point" x="${pointX-6}" y="${pointY-6}" width="12" height="12" rx="2" fill="#7a5195" stroke="#fff" stroke-width="3"></rect>`;
  return `<circle class="chart-point" cx="${pointX}" cy="${pointY}" r="5" fill="#1f78b4" stroke="#fff" stroke-width="3"/>`;
}


function getRemainingStatusText(d){
  if(!d || !d.tempStatusUntil) return '';
  const ms = d.tempStatusUntil - Date.now();
  if(ms <= 0) return '';
  const totalMinutes = Math.max(1, Math.ceil(ms/60000));
  if(totalMinutes < 60) return `${totalMinutes} min restantes`;
  const hours = Math.floor(totalMinutes/60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours}h ${minutes}min restantes` : `${hours}h restantes`;
}
function getStatusClockHTML(d){
  const txt = getRemainingStatusText(d);
  if(!txt) return '';
  return `<span class="status-timer-chip" title="${txt}" aria-label="${txt}">🕒</span>`;
}

function buildDetail(d){
  const detailVisualState = (d.tempStatusUntil && d.preTempStatusState) ? d.preTempStatusState : d.state;
  const meta = stateMeta[detailVisualState] || stateMeta.blue;
  const badgeClassMap = { blue:'blue', warn:'warn', crit:'', maint:'maint', inventory:'inventory', defrost:'defrost', restock:'restock' };
  const pillClass = badgeClassMap[d.state] ?? 'blue';
  const color = meta.color;
  const paths = chartPaths(d.chart || [5,5,5,5,5,5,5,5,5,5,5,5]);
  const pointIndex = Math.max(0, d.chart.length - 2);
  const pointX = Number((pointIndex * paths.step).toFixed(1));
  const pointY = Number(paths.y(d.chart[pointIndex]).toFixed(1));
  const showDanger = detailVisualState === 'warn' || detailVisualState === 'crit';
  const accessibleChart = accessibility.colorblind || accessibility.contrast;
  const dangerStart = detailVisualState === 'crit' ? 210 : 240;

  return `
    <div class="close-row">
      <div class="panel-title">Detalhes do dispositivo</div>
      <button class="detail-info-btn" type="button" onclick="openInfoModal('${d.id}')"><span class="detail-info-badge">i</span></button>
      ${getCalibHTML(d)}
      <button class="close-btn" id="closeBtn" aria-label="Fechar">Fechar</button>
    </div>

    <div class="alert-detail">
      <div class="alert-head">
        <div>
          <div class="alert-name">${d.name}</div>
          <div class="alert-range">2°C a 8°C</div>
          <div class="alert-sub">${d.sector}</div>
        </div></div>

      <div class="alert-top">
        <div>
          <div class="alert-temp">${tempLabel(d.temp)}</div>
          <button class="pill ${pillClass} status-edit-btn" type="button" onclick="openStatusConfigModal(${d.id})"><span class="state-legend-icon">${meta.icon}</span> ${getStatusText(d)} ${getStatusClockHTML(d)}</button>
          ${accessibility.colorblind ? `<div style="margin-top:8px;font-size:12px;font-weight:700;color:#425066">${meta.summary}</div>` : ''}
        </div>
        <div class="mini-thermo ${detailVisualState}" style="${thermoStyle({...d, state: detailVisualState}, true)}">
          <div class="track"><div class="fill"></div></div>
          <div class="bulb"></div>
        </div>
      </div>

      <div class="rows">
        
<div class="chart-title">Temperatura (últimas 24h)</div>
        <div class="detail-graph-launch">
          <button class="open-graph-btn" type="button" onclick="openGraphModal(${d.id})">Abrir gráfico</button>
        </div>

      <div class="rows">
        ${(d.events || ['Sem alerta ativo']).map(ev => `<div class="row"><div class="ico">${meta.icon}</div>${ev}</div>`).join('')}
        <div class="row"><div class="ico"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="4.5" width="10" height="7" rx="1.8" stroke-width="1.5"/><path d="M12.8 6.3h.8c.5 0 .9.4.9.9v1.6c0 .5-.4.9-.9.9h-.8" stroke-width="1.5" stroke-linecap="round"/></svg></div>Bateria ${battLabel(d.battery)}</div>
        <div class="row"><div class="ico"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.5c-1.9 2.6-3.5 4.3-3.5 6.3a3.5 3.5 0 1 0 7 0c0-2-1.6-3.7-3.5-6.3Z" stroke-width="1.5" stroke-linejoin="round"/></svg></div>Umidade ${humLabel(d.hum2 ?? d.hum1)}</div>
        <div class="row"><div class="ico"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="4.5" stroke-width="1.5"/></svg></div>${d.online ? 'Em uso' : 'Em uso'}</div>
        ${d.commText ? `<div class="row comm-status-row"><div class="ico"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="4.5" stroke-width="1.5"/></svg><span class="status-dot"></span></div>${d.commText}</div>` 
: (d.state !== 'maint' ? `<div class="row comm-status-row"><div class="ico"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="4.5" stroke-width="1.5"/></svg><span class="status-dot green"></span></div>Comunicando</div>` : '')}
      </div>

      
    </div>
  `;
}

function isCartTrackingRoleActive(){
  const role = String(
    window.activePanelSession?.role ||
    document.body?.dataset?.authRole ||
    document.body?.dataset?.panelRole ||
    window.currentRole ||
    ''
  ).toLowerCase();
  return role === 'cart' || document.body.classList.contains('cart-tracking-open');
}

function renderGrid(){
  if(isCartTrackingRoleActive()) return;
  grid.innerHTML = '';
  const filtered = devices.filter(d => {
    const matchesFilter = !activeFilter || (activeFilter === 'offline' ? d.online === false && d.state !== 'maint' : d.state === activeFilter);
    const matchesArea = !selectedArea || d.sector === selectedArea;
    const matchesNoc = !Array.isArray(nocFilteredIds) || nocFilteredIds.includes(d.id);
    return matchesFilter && matchesArea && matchesNoc;
  });

  if(!filtered.length){
    grid.innerHTML = `
      <div class="grid-empty-state">
        <div class="grid-empty-card">
          <h3>Nenhum dispositivo vinculado a esta área</h3>
          <p>No momento, não existem dispositivos cadastrados em ${selectedArea}.</p>
        </div>
      </div>
    `;
    return;
  }

  filtered.forEach(d => {
    grid.appendChild(buildSmallCard(d));
  });
}


const STORAGE_KEY = 'painel_iot_accessibility_v2';

function saveAccessibility(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accessibility));
  }catch(e){}
}

function loadAccessibility(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if(saved && typeof saved === 'object'){
      accessibility.colorblind = !!saved.colorblind;
      accessibility.contrast = !!saved.contrast;
      accessibility.compact = !!saved.compact;
      accessibility.showCommIcon = saved.showCommIcon !== false;
      accessibility.showMinMax = saved.showMinMax !== false;
      accessibility.showBattery = saved.showBattery !== false;
    }
  }catch(e){}
}

function updateToolbarState(){
  const states = [];
  if(accessibility.colorblind) states.push('Daltônico');
  if(accessibility.contrast) states.push('Contraste');
  if(accessibility.compact) states.push('Compacto');

  const stateText = states.length ? states.join(' · ') : 'Padrão';
  accState.textContent = stateText;
  accButton.classList.toggle('active', states.length > 0);
  accLiveBadge.textContent = states.length ? `${states.length} recurso${states.length > 1 ? 's' : ''} ativo${states.length > 1 ? 's' : ''}` : 'Padrão ativo';
toggleColorblind.classList.toggle('on', accessibility.colorblind);
  toggleContrast.classList.toggle('on', accessibility.contrast);
  toggleDensity.classList.toggle('on', accessibility.compact);
  if(toggleCommIcon) toggleCommIcon.classList.toggle('on', accessibility.showCommIcon);
  if(toggleMinMax) toggleMinMax.classList.toggle('on', accessibility.showMinMax);
  if(toggleBattery) toggleBattery.classList.toggle('on', accessibility.showBattery);
}

function applyAccessibility(){
  document.body.classList.toggle('acc-colorblind', accessibility.colorblind);
  document.body.classList.toggle('acc-contrast', accessibility.contrast);
  document.body.classList.toggle('density-compact', accessibility.compact);
  document.body.classList.toggle('hide-comm-icon', !accessibility.showCommIcon);
  document.body.classList.toggle('hide-minmax', !accessibility.showMinMax);
  document.body.classList.toggle('hide-battery', !accessibility.showBattery);
  updateToolbarState();
  saveAccessibility();
  renderGrid();
  attachFilterHandlers();
  if(activeId){
    const exists = devices.find(d => d.id === activeId && (!activeFilter || d.state === activeFilter));
    if(exists) openDetail(activeId, true);
    else closeDetail();
  }
}


function bigChartPaths(values){
  const width = 920, height = 360, min = 0, max = 12;
  const step = width/(values.length-1);
  const y = v => height - ((v-min)/(max-min))*height;
  let line = `M 0 ${y(values[0]).toFixed(1)}`;
  for(let i=1;i<values.length;i++){
    const x = i*step;
    const mid = x - step/2;
    line += ` C ${mid.toFixed(1)} ${y(values[i-1]).toFixed(1)} ${mid.toFixed(1)} ${y(values[i]).toFixed(1)} ${x.toFixed(1)} ${y(values[i]).toFixed(1)}`;
  }
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  return {line, area, y, step, width, height};
}

const GRAPH_STATUS_POINT_META = {
  defrost: { label:'Degelo', color:'#7f69c6' },
  maint: { label:'Manutenção', color:'#98a2b3' },
  inventory: { label:'Inventário', color:'#8b6a43' },
  restock: { label:'Reposição', color:'#d9a931' }
};

function parseUpdatedToMinutes(updated){
  const txt = String(updated || '').toLowerCase();
  if(!txt || txt.includes('agora')) return 0;
  const minMatch = txt.match(/(\d+)\s*min/);
  if(minMatch) return Number(minMatch[1]) || 0;
  const hourMatch = txt.match(/(\d+)\s*h/);
  if(hourMatch) return (Number(hourMatch[1]) || 0) * 60;
  return 0;
}

function ensureGraphStatusTimeline(d){
  if(!d) return [];
  if(!Array.isArray(d.graphStatusTimeline)) d.graphStatusTimeline = [];
  if(!d.graphStatusTimelineSeeded){
    d.graphStatusTimelineSeeded = true;
    if(!d.graphStatusTimeline.length && GRAPH_STATUS_POINT_META[d.state]){
      const minutesAgo = parseUpdatedToMinutes(d.updated);
      d.graphStatusTimeline.push({
        state:d.state,
        at:Date.now() - (minutesAgo * 60000)
      });
    }
  }
  return d.graphStatusTimeline;
}

function recordGraphStatusEvent(d, state){
  if(!d || !GRAPH_STATUS_POINT_META[state]) return;
  const timeline = ensureGraphStatusTimeline(d);
  timeline.unshift({
    state,
    at:Date.now()
  });
  if(timeline.length > 160) timeline.length = 160;
}

function getGraphWindowMs(graphState){
  const dayMs = 24 * 60 * 60 * 1000;
  if(graphState.period === 'weekly') return 7 * dayMs;
  if(graphState.period === 'monthly') return 28 * dayMs;
  if(graphState.period === 'custom'){
    const start = graphState.customStart;
    const end = graphState.customEnd;
    if(start && end){
      const startDate = new Date(`${start}T00:00:00`);
      const endDate = new Date(`${end}T23:59:59`);
      if(!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()) && endDate >= startDate){
        return Math.max(dayMs, endDate.getTime() - startDate.getTime());
      }
    }
    return 7 * dayMs;
  }
  return dayMs;
}

function getInterpolatedGraphValue(values, floatIndex){
  if(!Array.isArray(values) || !values.length) return 0;
  const clamped = Math.max(0, Math.min(values.length - 1, floatIndex));
  const startIndex = Math.floor(clamped);
  const endIndex = Math.min(values.length - 1, Math.ceil(clamped));
  const startValue = Number(values[startIndex]) || 0;
  const endValue = Number(values[endIndex]) || 0;
  if(startIndex === endIndex) return startValue;
  const ratio = clamped - startIndex;
  return startValue + ((endValue - startValue) * ratio);
}

function getGraphStatusMarkers(d, graphState, values, paths){
  const timeline = ensureGraphStatusTimeline(d);
  if(!timeline.length) return { svg:'', legend:'' };

  const now = Date.now();
  const windowMs = getGraphWindowMs(graphState);
  const start = now - windowMs;

  const points = timeline
    .filter(item => item && GRAPH_STATUS_POINT_META[item.state] && Number.isFinite(item.at))
    .filter(item => item.at >= start && item.at <= now)
    .sort((a,b) => a.at - b.at);

  if(!points.length) return { svg:'', legend:'' };

  const stackMap = {};
  const presentStates = new Set();

  const svg = points.map(item => {
    const ratio = Math.max(0, Math.min(1, (item.at - start) / windowMs));
    const x = ratio * paths.width;
    const valueAtPoint = getInterpolatedGraphValue(values, ratio * Math.max(1, values.length - 1));
    const bucket = Math.round(x / 18);
    const stack = stackMap[bucket] || 0;
    stackMap[bucket] = stack + 1;

    const y = Math.max(10, paths.y(valueAtPoint) - 12 - (stack * 11));
    const meta = GRAPH_STATUS_POINT_META[item.state];
    presentStates.add(item.state);
    const when = new Date(item.at).toLocaleString('pt-BR', {
      day:'2-digit',
      month:'2-digit',
      hour:'2-digit',
      minute:'2-digit'
    });
    const title = `${meta.label} - ${when}`;

    return `<g class="graph-status-point graph-status-point-${item.state}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${meta.color}" stroke="#fff" stroke-width="3"></circle><title>${title}</title></g>`;
  }).join('');

  const legendOrder = ['defrost','maint','inventory','restock'];
  const legend = legendOrder
    .filter(state => presentStates.has(state))
    .map(state => `<div class="graph-legend-item"><span class="graph-status-swatch graph-status-swatch-${state}"></span> ${GRAPH_STATUS_POINT_META[state].label}</div>`)
    .join('');

  return { svg, legend };
}

function normalizeScheduledMetrics(metrics){
  const raw = Array.isArray(metrics) ? metrics : ['temperature'];
  const legacyAliases = {
    min: 'temperatureMinMax',
    max: 'temperatureMinMax',
    minMax: 'temperatureMinMax',
    average: 'temperatureAverage'
  };
  const migrated = raw.map(metric => legacyAliases[metric] || metric);
  const allowed = new Set([
    'temperature',
    'temperatureMinMax',
    'temperatureAverage',
    'humidity',
    'humidityMinMax',
    'humidityAverage'
  ]);
  const unique = Array.from(new Set(migrated.filter(metric => allowed.has(metric))));
  return unique.length ? unique : ['temperature'];
}

function normalizeScheduledConfigValue(config){
  const raw = config && typeof config === 'object' ? config : {};
  const hours = [1,2,3,4,6,12].includes(Number(raw.hours)) ? Number(raw.hours) : 1;
  return {
    ...raw,
    areaName: raw.areaName || 'Banco IDvida',
    hours,
    scope: raw.scope === 'selected' ? 'selected' : 'all',
    deviceIds: Array.isArray(raw.deviceIds) ? raw.deviceIds.map(String) : [],
    metrics: normalizeScheduledMetrics(raw.metrics),
    updatedAt: raw.updatedAt || null
  };
}

function writeScheduledCollectionState(state){
  localStorage.setItem('idsensor.scheduledCollection.v1', JSON.stringify({
    version: 2,
    active: state?.active || null,
    pending: state?.pending || null
  }));
}

function readScheduledCollectionState(){
  try {
    const parsed = JSON.parse(localStorage.getItem('idsensor.scheduledCollection.v1') || 'null');
    if(!parsed) return { active:null, pending:null };
    const isVersioned = parsed.version === 2 || Object.prototype.hasOwnProperty.call(parsed, 'active') || Object.prototype.hasOwnProperty.call(parsed, 'pending');
    let active = isVersioned && parsed.active ? normalizeScheduledConfigValue(parsed.active) : null;
    let pending = isVersioned && parsed.pending ? normalizeScheduledConfigValue(parsed.pending) : null;
    if(!isVersioned && parsed.updatedAt) active = normalizeScheduledConfigValue(parsed);

    const effectiveAt = pending?.effectiveAt ? new Date(pending.effectiveAt) : null;
    if(pending && effectiveAt && !Number.isNaN(effectiveAt.getTime()) && effectiveAt <= new Date()){
      active = normalizeScheduledConfigValue({
        ...pending,
        updatedAt: pending.effectiveAt
      });
      delete active.effectiveAt;
      delete active.requestedAt;
      pending = null;
      writeScheduledCollectionState({ active, pending });
    }
    return { active, pending };
  } catch(e) {
    return { active:null, pending:null };
  }
}

function getScheduledCollectionConfig(){
  return readScheduledCollectionState().active;
}

function formatScheduledHours(hours){
  const safe = Number(hours) || 1;
  return safe === 1 ? '1 hora' : `${safe} horas`;
}

function formatScheduleClock(date){
  if(!(date instanceof Date) || Number.isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
}

function formatScheduleDate(date){
  if(!(date instanceof Date) || Number.isNaN(date.getTime())) return '--/--/----';
  return date.toLocaleDateString('pt-BR');
}

function getScheduledCollectionTiming(config){
  const hours = Math.max(1, Number(config?.hours) || 1);
  const intervalMs = hours * 60 * 60 * 1000;
  const now = new Date();
  const updatedAt = new Date(config?.updatedAt || now);
  const anchor = Number.isNaN(updatedAt.getTime()) ? now : updatedAt;
  const dayStart = new Date(now);
  dayStart.setHours(0,0,0,0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  let cursor = new Date(anchor);
  while(cursor > now) cursor = new Date(cursor.getTime() - intervalMs);
  while(new Date(cursor.getTime() + intervalMs) <= now) cursor = new Date(cursor.getTime() + intervalMs);

  const last = cursor >= dayStart ? cursor : null;
  const next = new Date((last || cursor).getTime() + intervalMs);
  const totalDaily = Math.max(1, Math.floor(24 / hours));
  let completed = 0;
  if(last){
    let scan = new Date(anchor);
    while(scan < dayStart) scan = new Date(scan.getTime() + intervalMs);
    while(scan <= now && scan < dayEnd){
      completed += 1;
      scan = new Date(scan.getTime() + intervalMs);
    }
  }
  const remaining = Math.max(0, totalDaily - Math.min(totalDaily, completed));
  const progress = Math.round((Math.min(totalDaily, completed) / totalDaily) * 100);
  return { last, next, totalDaily, completed: Math.min(totalDaily, completed), remaining, progress };
}

function averageTemperature(values){
  const valid = (values || []).filter(value => Number.isFinite(Number(value))).map(Number);
  if(!valid.length) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function averageMetric(values){
  return averageTemperature(values);
}

function getScheduledIntervalValues(values, hours){
  const valid = (values || []).filter(value => Number.isFinite(Number(value))).map(Number);
  if(!valid.length) return [];
  const estimatedSampleHours = Math.max(1, 24 / valid.length);
  const sampleCount = Math.max(1, Math.ceil((Number(hours) || 1) / estimatedSampleHours));
  return valid.slice(-sampleCount);
}

function buildScheduledCollectionCard(d, values){
  const config = getScheduledCollectionConfig();
  if(!config){
    return `
      <div class="graph-mini-card graph-schedule-card">
        <div class="graph-mini-title-row">
          <h3 class="graph-mini-title">Coleta programada</h3>
          <span class="graph-schedule-pill muted">Não configurada</span>
        </div>
        <div class="graph-mini-sub">Configure a rotina na engrenagem do painel. O relatório consolidado será gerado apenas no fechamento de 30 dias.</div>
        <div class="graph-schedule-empty">Nenhuma coleta programada foi salva para esta área.</div>
      </div>
    `;
  }

  const timing = getScheduledCollectionTiming(config);
  const current = Number.isFinite(Number(d.temp)) ? Number(d.temp) : values[values.length - 1];
  const snapshotValues = Array.isArray(d.chart) && d.chart.length ? d.chart : values;
  const snapshotMin = Math.min(...snapshotValues);
  const snapshotMax = Math.max(...snapshotValues);
  const intervalValues = getScheduledIntervalValues(values, config.hours);
  const intervalAverage = averageTemperature(intervalValues);
  const intervalMin = intervalValues.length ? Math.min(...intervalValues) : null;
  const intervalMax = intervalValues.length ? Math.max(...intervalValues) : null;
  const humidityValues = [d.hum1, d.hum2].filter(value => Number.isFinite(Number(value))).map(Number);
  const currentHumidity = Number.isFinite(Number(d.hum2 ?? d.hum1)) ? Number(d.hum2 ?? d.hum1) : null;
  const humidityAverage = averageMetric(humidityValues);
  const humidityMin = humidityValues.length ? Math.min(...humidityValues) : null;
  const humidityMax = humidityValues.length ? Math.max(...humidityValues) : null;
  const selectedMetrics = config.metrics;
  const temperatureSelected = selectedMetrics.includes('temperature');
  const temperatureMinMaxSelected = selectedMetrics.includes('temperatureMinMax');
  const showTemperatureAverage = selectedMetrics.includes('temperatureAverage');
  const humiditySelected = selectedMetrics.includes('humidity');
  const humidityMinMaxSelected = selectedMetrics.includes('humidityMinMax');
  const showHumidityAverage = selectedMetrics.includes('humidityAverage');
  const showTemperatureSnapshot = temperatureSelected || temperatureMinMaxSelected;
  const showHumiditySnapshot = humiditySelected || humidityMinMaxSelected;
  const showTemperatureAverageValue = showTemperatureAverage && (temperatureSelected || !temperatureMinMaxSelected);
  const showTemperaturePeriodMinMax = showTemperatureAverage && temperatureMinMaxSelected;
  const showHumidityAverageValue = showHumidityAverage && (humiditySelected || !humidityMinMaxSelected);
  const showHumidityPeriodMinMax = showHumidityAverage && humidityMinMaxSelected;
  const showAverage = showTemperatureAverage || showHumidityAverage;
  const hasTemperatureMetrics = showTemperatureSnapshot || showTemperatureAverage;
  const hasHumidityMetrics = showHumiditySnapshot || showHumidityAverage;
  const describeGroup = (label, hasSnapshot, hasPeriod) => {
    if(hasSnapshot && hasPeriod) return `Mostra os dados de ${label} coletados e os resultados do intervalo selecionado.`;
    if(hasPeriod) return `Mostra os resultados de ${label} no intervalo selecionado.`;
    return `Mostra os dados de ${label} coletados.`;
  };
  const cardDescription = hasTemperatureMetrics && hasHumidityMetrics
    ? 'Mostra os dados selecionados de temperatura e umidade na coleta e no intervalo.'
    : hasHumidityMetrics
      ? describeGroup('umidade', showHumiditySnapshot, showHumidityAverage)
      : describeGroup('temperatura', showTemperatureSnapshot, showTemperatureAverage);
  const lastCollection = timing.last || new Date(config.updatedAt);
  const intervalEnd = lastCollection;
  const intervalStart = new Date(intervalEnd.getTime() - config.hours * 60 * 60 * 1000);
  const collectionCount = `${timing.completed} de ${timing.totalDaily}`;
  const collectionState = readScheduledCollectionState();
  const pendingEffectiveAt = collectionState.pending?.effectiveAt ? new Date(collectionState.pending.effectiveAt) : null;

  const panels = [];

  if(showTemperatureSnapshot) panels.push(`
    <div class="graph-schedule-reading-panel">
      <span class="graph-schedule-panel-label">${temperatureSelected ? 'Temperatura coletada' : 'Mín./Máx. coletados'}</span>
      ${temperatureSelected ? `<strong class="graph-schedule-main-value">${tempLabel(current)}</strong>` : ''}
      ${temperatureMinMaxSelected ? `
        <div class="graph-schedule-minmax">
          <div><span>Mín.</span><strong>${tempLabel(snapshotMin)}</strong></div>
          <div><span>Máx.</span><strong>${tempLabel(snapshotMax)}</strong></div>
        </div>
      ` : ''}
    </div>
  `);

  if(showTemperatureAverage) panels.push(`
    <div class="graph-schedule-reading-panel">
      <span class="graph-schedule-panel-label">${showTemperatureAverageValue && showTemperaturePeriodMinMax ? 'Média e extremos do período' : showTemperaturePeriodMinMax ? 'Mín./Máx. do período' : 'Média da temperatura'}</span>
      ${showTemperatureAverageValue ? `<strong class="graph-schedule-main-value">${tempLabel(intervalAverage)}</strong>` : ''}
      ${showTemperaturePeriodMinMax ? `
        <div class="graph-schedule-minmax">
          <div><span>Mín.</span><strong>${tempLabel(intervalMin)}</strong></div>
          <div><span>Máx.</span><strong>${tempLabel(intervalMax)}</strong></div>
        </div>
      ` : ''}
    </div>
  `);

  if(showHumiditySnapshot) panels.push(`
    <div class="graph-schedule-reading-panel">
      <span class="graph-schedule-panel-label">${humiditySelected ? 'Umidade coletada' : 'Mín./Máx. coletados da umidade'}</span>
      ${humiditySelected ? `<strong class="graph-schedule-main-value">${humLabel(currentHumidity)}</strong>` : ''}
      ${humidityMinMaxSelected ? `
        <div class="graph-schedule-minmax">
          <div><span>Mín.</span><strong>${humLabel(humidityMin)}</strong></div>
          <div><span>Máx.</span><strong>${humLabel(humidityMax)}</strong></div>
        </div>
      ` : ''}
    </div>
  `);

  if(showHumidityAverage) panels.push(`
    <div class="graph-schedule-reading-panel">
      <span class="graph-schedule-panel-label">${showHumidityAverageValue && showHumidityPeriodMinMax ? 'Média e extremos da umidade' : showHumidityPeriodMinMax ? 'Mín./Máx. da umidade no período' : 'Média da umidade'}</span>
      ${showHumidityAverageValue ? `<strong class="graph-schedule-main-value">${humLabel(humidityAverage)}</strong>` : ''}
      ${showHumidityPeriodMinMax ? `
        <div class="graph-schedule-minmax">
          <div><span>Mín.</span><strong>${humLabel(humidityMin)}</strong></div>
          <div><span>Máx.</span><strong>${humLabel(humidityMax)}</strong></div>
        </div>
      ` : ''}
    </div>
  `);

  return `
    <div class="graph-mini-card graph-schedule-card">
      <div class="graph-mini-title-row">
        <h3 class="graph-mini-title">Coleta programada</h3>
        <span class="graph-schedule-pill">A cada ${formatScheduledHours(config.hours)}</span>
      </div>
      <div class="graph-mini-sub">${cardDescription}</div>
      ${collectionState.pending && pendingEffectiveAt && !Number.isNaN(pendingEffectiveAt.getTime()) ? `
        <div class="graph-schedule-pending-note">Alteração pendente para o próximo ciclo, às ${formatScheduleClock(pendingEffectiveAt)}.</div>
      ` : ''}
      <div class="graph-schedule-last-head">
        <span>Última coleta <strong>${formatScheduleClock(lastCollection)}</strong></span>
        <small>${formatScheduleDate(lastCollection)}</small>
      </div>
      <div class="graph-schedule-readings ${panels.length === 1 ? 'single' : ''}">
        ${panels.join('')}
      </div>
      ${showAverage ? `<div class="graph-schedule-interval">Período analisado: ${formatScheduleClock(intervalStart)} às ${formatScheduleClock(intervalEnd)}</div>` : ''}
      <div class="graph-schedule-meta-row">
        <span>Próxima coleta <strong>${formatScheduleClock(timing.next)}</strong></span>
        <span>Hoje <strong>${collectionCount}</strong></span>
      </div>
      <div class="graph-schedule-progress-compact">
        <div>
          <span>Fechamento do ciclo</span>
          <strong>Relatório após 30 dias</strong>
        </div>
      </div>
    </div>
  `;
}

function getReportIcon(){
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 3.5h7.4L19 8.1v12.4H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M14 3.7V8h4.3M8.5 12h7M8.5 15h7M8.5 18h4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;
}

function getAlertMailboxIcon(){
  return `<svg viewBox="0 0 96 96" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path d="M34 22h45c4.4 0 8 3.6 8 8v37c0 4.4-3.6 8-8 8H37" stroke="#2f80ff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M36 27 60 48 84 27M61 49 85 73" stroke="#2f80ff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M31 41c-9 0-16 7.1-16 16v10.5c0 3-.9 5.8-2.7 8.2L10 79h45l-2.2-3.3a14.9 14.9 0 0 1-2.8-8.2V57c0-8.9-7.1-16-16-16h-3Z" fill="#eaf3ff" stroke="#2f80ff" stroke-width="6" stroke-linejoin="round"/>
    <path d="M25 85c3.2 5 10.8 5 14 0M18 91c7 5 21 5 28 0" stroke="#2f80ff" stroke-width="6" stroke-linecap="round"/>
  </svg>`;
}

function getOperationalTelemetryIcon(kind){
  const icons = {
    limit: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="m8.2 12.2 2.4 2.4 5.1-5.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    attention: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4 21 19H3L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9v4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.4" r="1" fill="currentColor"/></svg>`,
    critical: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.7v5.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.2" r="1.1" fill="currentColor"/></svg>`,
    communication: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.8 8.7a15.2 15.2 0 0 1 18.4 0M6.4 12.2a9.5 9.5 0 0 1 11.2 0M10 15.8a4 4 0 0 1 4 0" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="m4 4 16 16" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/><circle cx="12" cy="19" r="1.25" fill="currentColor"/></svg>`,
    variation: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16.5 8.4 12l3.2 2.8L19.5 7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5 7h4v4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    alerts: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0v3.2c0 1-.3 1.9-.9 2.7L4 16.5h16l-1.1-1.6a4.6 4.6 0 0 1-.9-2.7V9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.5 19a2.7 2.7 0 0 0 5 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    silence: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 5 14 14M8.2 8.2A5.8 5.8 0 0 0 6 12v2.2c0 .8-.3 1.6-.8 2.3L4 18h12M10 21h4M16.7 13.7V12a5.8 5.8 0 0 0-7.9-5.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    sms: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5.8" width="16" height="11.4" rx="2.6" stroke="currentColor" stroke-width="1.8"/><path d="M8.2 17.2 5.6 20v-3.2M7.8 10h8.4M7.8 13h5.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    email: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="6" width="17" height="12" rx="2.2" stroke="currentColor" stroke-width="1.8"/><path d="m4.5 7.5 7.5 5.6 7.5-5.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.1 19.4 6.3 16A7.2 7.2 0 1 1 8 18.1l-2.9 1.3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.2 8.7c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.8l-.4.5c.6 1.1 1.5 1.9 2.7 2.5l.6-.5c.2-.2.5-.3.8-.1l1.5.7c.3.1.4.4.4.6v.5c0 .4-.2.7-.6.9-.5.3-1.2.4-2 .2-2.8-.7-5-2.8-5.8-5.5-.2-.8-.2-1.5.1-2Z" fill="currentColor"/></svg>`,
    maintenance: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.7 5.3a4 4 0 0 0 4 5.1l-7.5 7.5a2.1 2.1 0 1 1-3-3l7.5-7.5a4 4 0 0 0-1-2.1Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    defrost: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v18M5.6 6.4l12.8 11.2M18.4 6.4 5.6 17.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8.8 3.8 12 6.1l3.2-2.3M8.8 20.2 12 17.9l3.2 2.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };
  return icons[kind] || icons.limit;
}

function formatTelemetryShortDuration(totalSeconds){
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  if(safe < 60) return `${safe}s`;
  const totalMinutes = Math.floor(safe / 60);
  if(totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours}h ${minutes}min` : `${hours}h`;
}

function escapeTelemetryText(value){
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function telemetryToneClass(value){
  const tone = String(value || '').toLowerCase();
  return ['limit','normal','attention','critical','offline','alert','silence','maintenance','defrost'].includes(tone)
    ? tone
    : 'normal';
}

function normalizeTelemetryChannels(channels){
  const fallback = [
    {tone:'sms', icon:'sms', label:'SMS', total:3},
    {tone:'email', icon:'email', label:'E-mail', total:2},
    {tone:'whatsapp', icon:'whatsapp', label:'WhatsApp', total:3}
  ];

  if(!Array.isArray(channels) || !channels.length) return fallback;
  return channels.map((channel, index) => ({
    tone: channel.tone || fallback[index]?.tone || 'sms',
    icon: channel.icon || fallback[index]?.icon || 'sms',
    label: channel.label || fallback[index]?.label || 'Canal',
    total: Number.isFinite(Number(channel.total)) ? Number(channel.total) : 0
  }));
}

function buildOperationalTelemetryCard(d, values){
  const safeValues = (Array.isArray(values) ? values : []).map(Number).filter(Number.isFinite);
  const latest = safeValues.length ? safeValues[safeValues.length - 1] : Number(d.temp) || 0;
  const initial = safeValues.length ? safeValues[0] : latest;
  const maximum = safeValues.length ? Math.max(...safeValues) : latest;
  const minimum = safeValues.length ? Math.min(...safeValues) : latest;
  const rise = maximum - initial;
  const fall = initial - minimum;
  const variationIsUp = rise >= fall;
  const variationTarget = variationIsUp ? maximum : minimum;
  const variation = variationTarget - initial;
  const variationLabel = `${variation >= 0 ? '+' : ''}${variation.toFixed(1)}°C`;
  const variationTargetLabel = variationIsUp ? 'Pico atingido' : 'Menor ponto';
  const variationClass = variation >= 0 ? 'up' : 'down';
  const telemetry = d.operationalTelemetry || {};
  const telemetryActive = telemetry.active || {};
  const telemetryDurations = telemetry.durations || {};
  const hasTelemetryDurations = telemetry.durations && Object.prototype.hasOwnProperty.call(telemetry.durations, 'withinLimitSeconds');
  const criticalElapsed = getCriticalElapsedSeconds(d);
  const criticalSeconds = hasTelemetryDurations
    ? Number(telemetryDurations.criticalSeconds || 0)
    : (d.state === 'crit' ? criticalElapsed : 0);
  const attentionSeconds = Number(telemetryDurations.attentionSeconds || 0);
  const offlineSeconds = Number(telemetryDurations.offlineSeconds || 0);
  const withinLimitSeconds = Number(telemetryDurations.withinLimitSeconds || 0);
  const criticalTotalLabel = hasTelemetryDurations ? formatTelemetryShortDuration(criticalSeconds) : '32 min';
  const outOfRangeTime = hasTelemetryDurations
    ? formatTelemetryShortDuration(attentionSeconds + criticalSeconds)
    : (d.state === 'crit' ? formatTelemetryShortDuration(criticalElapsed) : '1h20');
  const isCritical = d.state === 'crit';
  const isAttention = d.state === 'warn';
  const isOffline = d.online === false;
  const statusClass = isCritical ? 'is-critical' : (isAttention ? 'is-attention' : (isOffline ? 'is-offline' : 'is-normal'));
  const statusLabel = isCritical ? 'CRÍTICO EM ANDAMENTO' : (isAttention ? 'ATENÇÃO EM ANDAMENTO' : (isOffline ? 'SEM COMUNICAÇÃO' : 'DENTRO DO LIMITE'));
  const statusMain = isCritical
    ? `<strong data-critical-timer="${d.id}">${formatOperationalElapsed(criticalElapsed)}</strong>`
    : ((isAttention || isOffline)
      ? `<strong>${formatOperationalElapsed(Number(telemetryActive.elapsedSeconds || 0))}</strong>`
      : `<strong>${tempLabel(latest)}</strong>`);
  const statusSub = isCritical
    ? (telemetryActive.startedLabel || 'Início 14:32')
    : (isAttention ? (telemetryActive.startedLabel || 'Início 15:06') : (isOffline ? (telemetryActive.startedLabel || 'Última comunicação 14:35') : (telemetryActive.normalizedLabel || 'Dentro do limite configurado')));
  const alertChannels = normalizeTelemetryChannels(telemetry.alertChannels);
  const smsCount = alertChannels[0].total;
  const emailCount = alertChannels[1].total;
  const whatsappCount = alertChannels[2].total;
  const statusCards = [
    {tone:'limit', icon:'limit', label:'Dentro do limite', value:hasTelemetryDurations ? formatTelemetryShortDuration(withinLimitSeconds) : '19h40'},
    {tone:'attention', icon:'attention', label:'Atenção', value:hasTelemetryDurations ? formatTelemetryShortDuration(attentionSeconds) : '48 min'},
    {tone:'critical', icon:'critical', label:'Crítico', value:criticalTotalLabel},
    {tone:'offline', icon:'communication', label:'Sem comunicação', value:hasTelemetryDurations ? formatTelemetryShortDuration(offlineSeconds) : '15 min'}
  ];

  const fallbackTimelineEvents = [
    {time:'15:45', tone:'normal', title:'Temperatura normalizada', detail:'Leitura voltou para dentro do limite configurado.'},
    {time:'15:38', tone:'critical', title:'Crítico encerrado', detail:'Equipamento deixou o estado crítico.'},
    {time:'15:30', tone:'normal', title:'Comunicação restabelecida', detail:'Painel voltou a receber leituras do sensor.'},
    {time:'15:22', tone:'critical', title:`${variationTargetLabel}: ${tempLabel(variationTarget)}`, detail:`Variação acumulada da ocorrência: ${variationLabel}.`},
    {time:'15:20', tone:'alert', title:'Alerta de recorrência enviado', detail:'Ocorrência continuou sem normalizar após 10 minutos.'},
    {time:'15:10', tone:'silence', title:'Painel silenciado', detail:'Alerta sonoro do painel pausado; alertas externos continuaram ativos.'},
    {time:'15:00', tone:'offline', title:'Comunicação interrompida', detail:'Sensor ficou sem transmitir novas leituras ao painel.'},
    {time:'15:00', tone:'alert', title:'Alerta de recorrência enviado', detail:'Sistema reenviou o alerta conforme regra configurada.'},
    {time:'14:50', tone:'alert', title:'Primeiro alerta enviado', detail:'Canais configurados foram acionados.'},
    {time:'14:50', tone:'critical', title:'Crítico iniciado', detail:'Permanência fora do limite atingiu a regra configurada.'},
    {time:'14:20', tone:'attention', title:'Atenção iniciada', detail:'Temperatura permaneceu fora do limite antes de virar crítico.'},
    {time:'14:20', tone:'attention', title:'Temperatura saiu do limite configurado', detail:'Primeiro ponto fora do intervalo permitido.'}
  ];
  const timelineEvents = Array.isArray(telemetry.events) && telemetry.events.length
    ? telemetry.events
    : fallbackTimelineEvents;

  return `
    <details class="graph-mini-card telemetry-accordion">
      <summary>
        <span class="telemetry-heading-row">
          <span class="telemetry-title-icon">${getStopwatchIcon()}</span>
          <span class="telemetry-heading-copy">
            <strong>Telemetria operacional</strong>
            <small>Eventos, duração e ações das últimas 24 horas.</small>
          </span>
          <span class="telemetry-chevron" aria-hidden="true">⌄</span>
        </span>
        <span class="telemetry-active-card ${statusClass}">
          <span class="telemetry-active-icon">${isCritical ? getStopwatchIcon() : getOperationalTelemetryIcon(isAttention ? 'attention' : (isOffline ? 'communication' : 'limit'))}</span>
          <span class="telemetry-active-copy"><small>${statusLabel}</small>${statusMain}<em>${statusSub}</em></span>
        </span>
        <span class="telemetry-status-grid">
          ${statusCards.map(item => `
            <span class="telemetry-status-card ${item.tone}">
              <span class="telemetry-status-icon">${getOperationalTelemetryIcon(item.icon)}</span>
              <span><small>${item.label}</small><strong>${item.value}</strong></span>
            </span>
          `).join('')}
        </span>
        <span class="telemetry-section-label">Canais de alerta</span>
        <span class="telemetry-channel-grid">
          ${alertChannels.map(channel => `
            <span class="telemetry-channel-card ${channel.tone}">
              <span>${getOperationalTelemetryIcon(channel.icon)}</span>
              <small>${channel.label}</small>
              <strong>${channel.total}</strong>
            </span>
          `).join('')}
        </span>
        <span class="telemetry-silence-card">
          <span class="telemetry-silence-icon">${getOperationalTelemetryIcon('silence')}</span>
          <span><strong>Painel silenciado</strong><small>15:10 às 15:25 · duração 15 min</small><em>Som do painel pausado; alertas externos continuaram ativos.</em></span>
        </span>
        <span class="telemetry-variation-strip">
          <span><small>Início da ocorrência</small><strong>${tempLabel(initial)}</strong></span>
          <span><small>${variationTargetLabel}</small><strong>${tempLabel(variationTarget)}</strong></span>
          <span><small>Variação</small><strong class="${variationClass}">${variationLabel}</strong></span>
          <span><small>Tempo fora do limite</small><strong>${outOfRangeTime}</strong></span>
        </span>
        <span class="telemetry-expand-hint">Clique para expandir a linha do tempo</span>
      </summary>
      <div class="telemetry-expanded-content">
        <div class="telemetry-timeline-head">
          <div><strong>Linha do tempo</strong><small>Últimas 24 horas, com ocorrências e ações operacionais.</small></div>
          <span>Últimas 24h</span>
        </div>
        <div class="telemetry-timeline">
          ${timelineEvents.map(event => `
            <div class="telemetry-event ${telemetryToneClass(event.tone)}">
              <time>${escapeTelemetryText(event.time)}</time>
              <span class="telemetry-event-dot"></span>
              <div><strong>${escapeTelemetryText(event.title)}</strong><small>${escapeTelemetryText(event.detail)}</small></div>
            </div>
          `).join('')}
        </div>
        <button class="graph-primary-btn telemetry-download-btn" type="button">Baixar telemetria do dia</button>
      </div>
    </details>
  `;
}

function buildGraphModal(d, graphState = {period:'daily', view:'summary'}){
  const periodSets = {
    daily: {
      labels:['00h','02h','04h','06h','08h','10h','12h','14h','16h','18h','20h','22h'],
      values: d.chart || [5,5,5,5,5,5,5,5,5,5,5,5],
      title:'Últimas 24 horas',
      descSummary:'Leitura resumida do comportamento térmico do equipamento nas últimas 24 horas.',
      descDetail:'Leitura detalhada das últimas 24 horas, com foco em saída do limite, retorno, concentração de risco e proximidade do limite.'
    },
    weekly: {
      labels:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
      values: [6.9,7.1,7.0,7.3,8.0,8.2,8.6],
      title:'Visão semanal',
      descSummary:'Leitura resumida do comportamento térmico do equipamento ao longo da semana.',
      descDetail:'Leitura detalhada da semana, destacando concentração de risco e variações mais críticas por dia.'
    },
    monthly: {
      labels:['S1','S2','S3','S4'],
      values: [6.7,7.4,8.1,7.2],
      title:'Visão mensal',
      descSummary:'Leitura resumida do comportamento térmico do equipamento ao longo do mês.',
      descDetail:'Leitura detalhada do mês com foco em semanas críticas, permanência fora do limite e tendência de instabilidade.'
    },
    custom: {
      labels:['D1','D2','D3','D4','D5','D6','D7'],
      values: [7.0,7.3,7.7,8.2,8.4,7.8,7.1],
      title:'Período personalizado',
      descSummary:'Leitura resumida do comportamento térmico no intervalo selecionado pelo usuário.',
      descDetail:'Leitura detalhada do intervalo selecionado, destacando permanência próximo do limite e pontos fora da faixa segura.'
    }
  };

  const activePeriod = periodSets[graphState.period] || periodSets.daily;
  if(graphState.period === 'custom'){
    const start = graphState.customStart || '';
    const end = graphState.customEnd || '';
    activePeriod.title = 'Período personalizado';
    activePeriod.descSummary = 'Resumo do intervalo selecionado pelo usuário.';
    const startLabel = formatDateDisplay(start) || 'data inicial';
    const endLabel = formatDateDisplay(end) || 'data final';
    activePeriod.descDetail = `Leitura detalhada do intervalo de ${startLabel} até ${endLabel}.`; 
  }
  let values = [...activePeriod.values];

  if(graphState.view === 'detail'){
    const expanded = [];
    for(let i=0;i<values.length-1;i++){
      const a = values[i], b = values[i+1];
      expanded.push(a, a + (b-a)*0.33, a + (b-a)*0.66);
    }
    expanded.push(values[values.length-1]);
    values = expanded;
  }

  const paths = bigChartPaths(values);
  const current = values[values.length-1];
  const maxTemp = Math.max(...values);
  const minTemp = Math.min(...values);
  const outsidePoints = values.filter(v => v > 8 || v < 2).length;
  const outsideHours = outsidePoints * (graphState.view === 'detail' ? 0.4 : 2);
  const outsideH = Math.floor(outsideHours);
  const outsideM = Math.round((outsideHours - outsideH) * 60);
  const outsideText = `${outsideH}h ${String(outsideM).padStart(2,'0')}m`;

  const nearPoints = values.map((v,i)=>({v,i})).filter(p => (p.v >= 7.5 && p.v <= 8) || (p.v >= 2 && p.v <= 2.5));
  const outPoints = values.map((v,i)=>({v,i})).filter(p => p.v > 8 || p.v < 2);

  const labels = graphState.view === 'detail'
    ? (() => {
        const labelCount = activePeriod.labels.length;
        const detailedLabels = new Array(values.length).fill('');
        if(labelCount <= 1 || values.length <= 1) return activePeriod.labels;
        for(let li = 0; li < labelCount; li++){
          const position = Math.round((li * (values.length - 1)) / (labelCount - 1));
          detailedLabels[position] = activePeriod.labels[li] || '';
        }
        return detailedLabels;
      })()
    : activePeriod.labels;

  const statusMarkerLayer = getGraphStatusMarkers(d, graphState, values, paths);

  const nearRects = nearPoints.map(p => {
    const x = p.i * paths.step;
    return `<rect x="${Math.max(0,x-22).toFixed(1)}" y="0" width="44" height="${paths.height}" rx="14" fill="rgba(255,176,74,.08)" stroke="rgba(255,176,74,.18)"/>`;
  }).join('');

  const outRects = outPoints.map(p => {
    const x = p.i * paths.step;
    return `<rect x="${Math.max(0,x-22).toFixed(1)}" y="0" width="44" height="${paths.height}" rx="14" fill="rgba(255,93,99,.08)" stroke="rgba(255,93,99,.16)"/>`;
  }).join('');

  const pointDots = values.map((v,i)=>{
    const x = (i*paths.step).toFixed(1);
    const y = paths.y(v).toFixed(1);
    const fill = (v>8||v<2) ? '#ff5d63' : ((v>=7.5&&v<=8)||(v>=2&&v<=2.5) ? '#ffb04a' : '#2ea8ff');
    return `<circle cx="${x}" cy="${y}" r="${(v>8||v<2)?7:5.5}" fill="${fill}" stroke="#fff" stroke-width="3"/>`;
  }).join('');

  const lastX = ((values.length-1)*paths.step).toFixed(1);
  const lastY = paths.y(current).toFixed(1);

  const periodButton = (key, label) => `<button class="graph-chip ${graphState.period===key?'active':''}" type="button" onclick="setGraphPeriod('${key}')">${label}</button>`;
  const viewButton = (key, label) => `<button class="graph-chip ${graphState.view===key?'active':''}" type="button" onclick="setGraphView('${key}')">${label}</button>`;
  const customRange = `
    <div class="graph-custom-range" id="graphCustomRange" ${graphState.period === 'custom' ? '' : 'hidden'}>
      <label class="graph-datebox" aria-label="Data inicial">
        <input class="graph-date-text" type="text" id="graphCustomStartText" value="${formatDateDisplay(graphState.customStart || '2026-04-01')}" placeholder="dd/mm/aaaa" inputmode="numeric" autocomplete="off" onblur="commitGraphDateText('start', this.value)" onkeydown="handleGraphDateKeydown(event, 'start', this.value)">
        <input class="graph-date-native" type="date" id="graphCustomStartPicker" value="${graphState.customStart || '2026-04-01'}" onchange="setGraphCustomRange('start', this.value)">
        <button class="graph-date-trigger" type="button" aria-label="Abrir calendário inicial" onclick="openGraphDatePicker('graphCustomStartPicker')">${getCalendarIcon()}</button>
      </label>
      <label class="graph-datebox" aria-label="Data final">
        <input class="graph-date-text" type="text" id="graphCustomEndText" value="${formatDateDisplay(graphState.customEnd || '2026-04-05')}" placeholder="dd/mm/aaaa" inputmode="numeric" autocomplete="off" onblur="commitGraphDateText('end', this.value)" onkeydown="handleGraphDateKeydown(event, 'end', this.value)">
        <input class="graph-date-native" type="date" id="graphCustomEndPicker" value="${graphState.customEnd || '2026-04-05'}" onchange="setGraphCustomRange('end', this.value)">
        <button class="graph-date-trigger" type="button" aria-label="Abrir calendário final" onclick="openGraphDatePicker('graphCustomEndPicker')">${getCalendarIcon()}</button>
      </label>
      <button class="graph-apply-btn" type="button" onclick="applyGraphCustomRange()">Aplicar</button>
    </div>
  `;

  return `
    <div class="graph-workspace-backdrop" id="graphWorkspaceBackdrop"></div>
    <div class="graph-workspace-modal" id="graphWorkspaceModal">
      <div class="graph-workspace-inner">
        <button class="graph-workspace-close" id="closeGraphWorkspace" aria-label="Fechar">×</button>

        <section class="graph-workspace-hero" style="margin-right:64px;">
          <div class="graph-workspace-toolbar">
            <div class="graph-workspace-left">
              <div class="graph-workspace-period">
                ${periodButton('daily','Diário')}
                ${periodButton('weekly','Semanal')}
                ${periodButton('monthly','Mensal')}
                ${periodButton('custom','Personalizado')}
              </div>
              ${customRange}
            </div>
            <div class="graph-workspace-group">
              ${viewButton('summary','Resumido')}
              ${viewButton('detail','Detalhado')}
            </div>
          </div>
        </section>

        <section class="graph-workspace-grid">
          <div class="graph-main-card">
            <div class="graph-main-head">
              <div>
                <div class="graph-eyebrow">TEMPERATURA — ${d.name.toUpperCase()}</div>
                <div class="graph-h1">${activePeriod.title}</div>
                <div class="graph-desc">${graphState.view === 'summary' ? activePeriod.descSummary : activePeriod.descDetail}</div>
              </div>
              <div class="graph-mode-badge">${graphState.view === 'summary' ? 'Modo resumido' : 'Modo detalhado'}</div>
            </div>

            <div class="graph-wrap">
              <div class="graph-legend">
                <div class="graph-legend-item"><span class="graph-line-swatch"></span> Temperatura</div>
                <div class="graph-legend-item"><span class="graph-band-swatch"></span> Dentro do limite: 2°C a 8°C</div>
                <div class="graph-legend-item"><span class="graph-near-swatch"></span> Atenção</div>
                <div class="graph-legend-item"><span class="graph-risk-swatch"></span> Crítico</div>
                ${statusMarkerLayer.legend}
              </div>

              <div class="graph-box">
                <svg class="graph-svg" viewBox="0 0 1080 460" xmlns="http://www.w3.org/2000/svg" aria-label="Gráfico expandido de ${d.name}">
                  <defs>
                    <linearGradient id="graphArea${d.id}" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#2ea8ff" stop-opacity=".22"/>
                      <stop offset="100%" stop-color="#2ea8ff" stop-opacity=".03"/>
                    </linearGradient>
                  </defs>
                  <g transform="translate(78,18)">
                    <rect x="0" y="${paths.y(8).toFixed(1)}" width="${paths.width}" height="${(paths.y(2)-paths.y(8)).toFixed(1)}" rx="18" fill="rgba(46,168,255,.09)" stroke="rgba(93,174,255,.35)" stroke-dasharray="8 8"/>
                    ${nearRects}
                    ${outRects}
                    ${[0,2,4,6,8,10,12].map(v=>`<line x1="0" y1="${paths.y(v).toFixed(1)}" x2="${paths.width}" y2="${paths.y(v).toFixed(1)}" stroke="rgba(145,158,180,.22)" stroke-width="1"/>`).join('')}
                    ${[0,2,4,6,8,10,12].map(v=>`<text x="-16" y="${(paths.y(v)+4).toFixed(1)}" fill="#6f7d90" font-size="12" text-anchor="end">${v}°C</text>`).join('')}
                    <path d="${paths.area}" fill="url(#graphArea${d.id})"></path>
                    <path d="${paths.line}" fill="none" stroke="#2f80ff" stroke-width="${graphState.view==='detail' ? 5 : 4.5}" stroke-linecap="round"></path>
                    <line x1="0" y1="${paths.y(8).toFixed(1)}" x2="${paths.width}" y2="${paths.y(8).toFixed(1)}" stroke="#5daeff" stroke-width="2" stroke-dasharray="7 7"/>
                    <line x1="0" y1="${paths.y(2).toFixed(1)}" x2="${paths.width}" y2="${paths.y(2).toFixed(1)}" stroke="#5daeff" stroke-width="2" stroke-dasharray="7 7"/>
                    ${pointDots}
                    ${statusMarkerLayer.svg}
                    <text x="${lastX}" y="${Math.max(14, Number(lastY)-10)}" fill="#6f7d90" font-size="12" font-weight="800" text-anchor="middle">${tempLabel(current)}</text>
                  </g>
                </svg>
                <div class="graph-axis">
                  ${labels.map(label=>`<span>${label}</span>`).join('')}
                </div>
              </div>
            </div>

            <div class="graph-summary">
              <div class="graph-stat">
                <div class="graph-stat-k">Temperatura atual</div>
                <div class="graph-stat-v">${tempLabel(current)}</div>
                <div class="graph-stat-sub">Leitura mais recente do período.</div>
              </div>
              <div class="graph-stat">
                <div class="graph-stat-k">Temperatura máxima</div>
                <div class="graph-stat-v">${tempLabel(maxTemp)}</div>
                <div class="graph-stat-sub">Maior valor encontrado no intervalo.</div>
              </div>
              <div class="graph-stat">
                <div class="graph-stat-k">Tempo fora do limite</div>
                <div class="graph-stat-v">${outsideText}</div>
                <div class="graph-stat-sub">Tempo acumulado acima de 8°C ou abaixo de 2°C.</div>
              </div>
              <div class="graph-stat">
                <div class="graph-stat-k">Temperatura mínima</div>
                <div class="graph-stat-v">${tempLabel(minTemp)}</div>
                <div class="graph-stat-sub">Menor valor encontrado no intervalo.</div>
              </div>
            </div>
          </div>

          <div class="graph-side-stack">
            ${buildOperationalTelemetryCard(d, values)}

            ${buildScheduledCollectionCard(d, values)}

            <details class="graph-mini-card graph-report-accordion">
              <summary>
                <span class="graph-report-icon">${getReportIcon()}</span>
                <span class="graph-report-summary-copy">
                  <strong>Relatórios</strong>
                  <small>Exportações operacionais e relatório analítico</small>
                </span>
                <span class="graph-report-chevron" aria-hidden="true">⌄</span>
              </summary>
              <div class="graph-report-list">
                <button class="graph-report-btn">Exportar PDF</button>
                <button class="graph-report-btn">Exportar Excel</button>
                <button class="graph-report-btn">Exportar CSV</button>
                <button class="graph-report-btn" type="button" onclick="openAnalyticalReportModal(${d.id})">Relatório Analítico</button>
              </div>
            </details>
          </div>
        </section>
      </div>
    </div>`;
}

let currentGraphDeviceId = null;
let currentGraphState = {
  period:'daily',
  view:'summary',
  customStart:'2026-04-01',
  customEnd:'2026-04-05'
};

function getCalendarIcon(){
  return `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.25" y="3.75" width="15.5" height="14" rx="3" stroke="currentColor" stroke-width="1.7"/>
    <path d="M6 2.5v3M14 2.5v3M2.5 7.5h15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
  </svg>`;
}

function normalizeGraphLegendLabels(root = document){
  const replacements = [
    ['graph-band-swatch', 'Dentro do limite: 2°C a 8°C'],
    ['graph-near-swatch', 'Atenção'],
    ['graph-risk-swatch', 'Crítico']
  ];

  replacements.forEach(([className, label]) => {
    const swatch = root.querySelector(`.${className}`);
    const item = swatch?.closest('.graph-legend-item');
    if(item) item.innerHTML = `<span class="${className}"></span> ${label}`;
  });
}


function renderGraphModal(){
  const d = devices.find(x => x.id === currentGraphDeviceId);
  if(!d) return;
  const root = document.getElementById('graphWorkspaceRoot');
  if(!root) return;
  root.innerHTML = buildGraphModal(d, currentGraphState);
  normalizeGraphLegendLabels(root);
  document.getElementById('closeGraphWorkspace').addEventListener('click', closeGraphModal);
  document.getElementById('graphWorkspaceBackdrop').addEventListener('click', closeGraphModal);
  updateOperationalClocks();
}

function setGraphPeriod(period){
  currentGraphState.period = period;
  renderGraphModal();
}

function formatDateDisplay(value){
  if(!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const [y,m,d] = value.split('-');
  return `${d}/${m}/${y}`;
}

function parseDateDisplay(value){
  const clean = String(value || '').trim();
  if(!clean) return '';
  const match = clean.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if(!match) return null;
  const [,dd,mm,yyyy] = match;
  const iso = `${yyyy}-${mm}-${dd}`;
  const date = new Date(`${iso}T00:00:00`);
  if(Number.isNaN(date.getTime())) return null;
  if(date.getUTCFullYear() !== Number(yyyy) || (date.getUTCMonth()+1) !== Number(mm) || date.getUTCDate() !== Number(dd)) return null;
  return iso;
}

function setGraphCustomRange(side, value){
  if(side === 'start') currentGraphState.customStart = value || '';
  if(side === 'end') currentGraphState.customEnd = value || '';
  renderGraphModal();
}

function applyGraphCustomRange(){
  const startText = document.getElementById('graphCustomStartText');
  const endText = document.getElementById('graphCustomEndText');
  const startPicker = document.getElementById('graphCustomStartPicker');
  const endPicker = document.getElementById('graphCustomEndPicker');
  const startParsed = parseDateDisplay(startText ? startText.value : '');
  const endParsed = parseDateDisplay(endText ? endText.value : '');

  const startValue = startParsed === null ? (startPicker ? startPicker.value : '') : startParsed;
  const endValue = endParsed === null ? (endPicker ? endPicker.value : '') : endParsed;

  if(startValue) currentGraphState.customStart = startValue;
  if(endValue) currentGraphState.customEnd = endValue;

  if(currentGraphState.customStart && currentGraphState.customEnd && currentGraphState.customStart > currentGraphState.customEnd){
    const swap = currentGraphState.customStart;
    currentGraphState.customStart = currentGraphState.customEnd;
    currentGraphState.customEnd = swap;
  }

  renderGraphModal();
}

function commitGraphDateText(side, rawValue){
  const parsed = parseDateDisplay(rawValue);
  if(parsed === null){
    renderGraphModal();
    return;
  }
  setGraphCustomRange(side, parsed);
}

function handleGraphDateKeydown(event, side, rawValue){
  if(event.key === 'Enter'){
    event.preventDefault();
    commitGraphDateText(side, rawValue);
    event.target.blur();
  }
}

function openGraphDatePicker(inputId){
  const input = document.getElementById(inputId);
  if(!input) return;
  if(typeof input.showPicker === 'function') input.showPicker();
  else input.click();
}

function setGraphView(view){
  currentGraphState.view = view;
  renderGraphModal();
}

function openGraphModal(id){
  const d = devices.find(x => x.id === id);
  if(!d) return;
  closeGraphModal();
  currentGraphDeviceId = id;
  currentGraphState = {
    period:'daily',
    view:'summary',
    customStart:'2026-04-01',
    customEnd:'2026-04-05'
  };
  const wrapper = document.createElement('div');
  wrapper.id = 'graphWorkspaceRoot';
  document.body.appendChild(wrapper);
  renderGraphModal();
}

function closeGraphModal(){
  document.getElementById('graphWorkspaceRoot')?.remove();
}

function analyticalReportPeriod(){
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth() - 5, 1);
  const format = value => value.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit', year:'numeric'});
  return {
    start:format(start),
    end:format(end),
    generated:end.toLocaleString('pt-BR', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'})
  };
}

function analyticalPath(values, width, height, minValue=0, maxValue=12){
  const safe = (Array.isArray(values) ? values : []).map(Number).filter(Number.isFinite);
  const step = safe.length > 1 ? width / (safe.length - 1) : width;
  const y = value => height - ((Number(value) - minValue) / (maxValue - minValue)) * height;
  const points = safe.map((value, index) => ({
    x:index * step,
    y:Math.max(0, Math.min(height, y(value))),
    value
  }));
  const line = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const area = points.length ? `${line} L ${points.at(-1).x.toFixed(1)} ${height} L 0 ${height} Z` : '';
  return {points, line, area, y};
}

function analyticalDuration(totalSeconds){
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  if(!hours) return `${minutes}min`;
  return `${hours}h ${String(minutes).padStart(2,'0')}min`;
}

function analyticalLongDuration(totalSeconds){
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  if(!hours) return `${minutes}min`;
  return `${hours}h ${String(minutes).padStart(2,'0')}min`;
}

function buildAnalyticalReportModel(d){
  const months = ['Jan/26','Fev/26','Mar/26','Abr/26','Mai/26','Jun/26'];
  const offset = ((Number(d.id) || 1) % 4) * 0.1;
  const minimum = [2.3,2.4,2.5,2.9,3.1,3.0].map(value => Number((value + offset).toFixed(1)));
  const average = [3.8,4.0,4.3,4.8,5.3,5.9].map(value => Number((value + offset).toFixed(1)));
  const maximum = [5.4,5.7,6.2,7.1,8.1,9.4].map(value => Number((value + offset).toFixed(1)));
  const temperatureStatuses = ['normal','normal','normal','attention','critical','attention'];
  const humidityBase = Number.isFinite(Number(d.hum1)) ? Number(d.hum1) : 25.8;
  const humidity = [-1.2,-0.5,1.3,3.2,2.0,0.4].map(value => Number((humidityBase + value).toFixed(1)));
  const humidityStatuses = ['normal','normal','attention','critical','attention','normal'];
  const durations = d.operationalTelemetry?.durations || {};
  const criticalSeconds = Math.max(Number(durations.criticalSeconds || 0), 18 * 3600 + 40 * 60);
  const attentionSeconds = Math.max(Number(durations.attentionSeconds || 0), 9 * 3600 + 15 * 60);
  const offlineSeconds = Math.max(Number(durations.offlineSeconds || 0), 45 * 60);
  const periodSeconds = 143 * 86400 + 23 * 3600 + 59 * 60;
  const normalSeconds = Math.max(0, periodSeconds - criticalSeconds - attentionSeconds - offlineSeconds);
  const conditionSeconds = {normal:normalSeconds, attention:attentionSeconds, critical:criticalSeconds, offline:offlineSeconds};
  const conditionWidths = Object.fromEntries(Object.entries(conditionSeconds).map(([key,value]) => [key, (value / periodSeconds) * 100]));
  const humidityAttentionSeconds = 48 * 3600;
  const humidityCriticalSeconds = 24 * 3600;
  const humidityConditionSeconds = {
    normal:Math.max(0, periodSeconds - humidityAttentionSeconds - humidityCriticalSeconds),
    attention:humidityAttentionSeconds,
    critical:humidityCriticalSeconds,
    offline:0
  };
  const humidityConditionWidths = Object.fromEntries(Object.entries(humidityConditionSeconds).map(([key,value]) => [key, (value / periodSeconds) * 100]));
  const alerts = [10,12,13,15,17,18];
  const recurrences = [2,3,3,4,4,6];
  const offline = [0,1,0,1,1,0];
  return {
    months, minimum, average, maximum, temperatureStatuses, humidity, humidityStatuses, humidityConditionSeconds, humidityConditionWidths, hasHumidity:Number.isFinite(Number(d.hum1)),
    conditionSeconds, conditionWidths, periodSeconds, alerts, recurrences, offline,
    minValue:Math.min(...minimum),
    maxValue:Math.max(...maximum),
    averageValue:Number((average.reduce((sum, value) => sum + value, 0) / average.length).toFixed(1)),
    averageChange:Number((average.at(-1) - average[0]).toFixed(1)),
    humidityAverage:Number((humidity.reduce((sum, value) => sum + value, 0) / humidity.length).toFixed(1)),
    humidityMax:Math.max(...humidity),
    humidityChange:Number((humidity.at(-1) - humidity[0]).toFixed(1)),
    variation:Number((Math.max(...maximum) - Math.min(...minimum)).toFixed(1)),
    criticalSeconds, attentionSeconds, offlineSeconds,
    alertTotal:alerts.reduce((sum, value) => sum + value, 0),
    recurrenceTotal:recurrences.reduce((sum, value) => sum + value, 0),
    offlineTotal:offline.reduce((sum, value) => sum + value, 0)
  };
}

function buildAnalyticalMetricChart(model, d, config){
  const width = 640;
  const height = 235;
  const metricPath = analyticalPath(config.values, width, height, config.axisMin, config.axisMax);
  const criticalY = metricPath.y(config.criticalValue);
  const monthStep = width / (model.months.length - 1);
  const stateBands = config.statuses.map((status,index) => {
    const x = index === 0 ? 0 : index * monthStep - monthStep / 2;
    const bandWidth = index === 0 || index === model.months.length - 1 ? monthStep / 2 : monthStep;
    return `<rect x="${x.toFixed(1)}" y="0" width="${bandWidth.toFixed(1)}" height="${height}" class="analytic-state-band ${status}"/>`;
  }).join('');
  return `
    <div class="analytic-chart-legend">
      <span><i class="is-series ${config.className}"></i>${config.seriesLabel}</span>
      <span><i class="is-state normal"></i>Dentro do limite</span>
      <span><i class="is-state attention"></i>Atenção</span>
      <span><i class="is-state critical"></i>Crítico</span>
      <span><i class="is-state offline"></i>Sem comunicação</span>
      <span><i class="is-limit"></i>Limite crítico</span>
    </div>
    <svg class="analytic-thermal-svg" viewBox="0 0 760 325" role="img" aria-label="${config.ariaLabel}">
      <text x="12" y="19" class="analytic-axis-title ${config.className}">${config.axisLabel}</text>
      <g transform="translate(58,38)">
        ${stateBands}
        ${config.ticks.map(value => `<line x1="0" y1="${metricPath.y(value).toFixed(1)}" x2="${width}" y2="${metricPath.y(value).toFixed(1)}" stroke="#dce5f1"/><text x="-12" y="${(metricPath.y(value)+4).toFixed(1)}" text-anchor="end" class="analytic-axis-label">${value}${config.unit}</text>`).join('')}
        ${model.months.map((month,index) => `<line x1="${(index*monthStep).toFixed(1)}" y1="0" x2="${(index*monthStep).toFixed(1)}" y2="${height}" class="analytic-month-guide"/>`).join('')}
        <line x1="0" y1="${criticalY.toFixed(1)}" x2="${width}" y2="${criticalY.toFixed(1)}" class="analytic-limit-line"/><text x="${width-4}" y="${(criticalY-7).toFixed(1)}" text-anchor="end" class="analytic-critical-label">Limite crítico ${config.criticalValue.toFixed(config.criticalValue % 1 ? 1 : 0)}${config.unit}</text>
        <path d="${metricPath.line}" class="analytic-series-${config.className}"/>
        ${metricPath.points.map(point => `<circle cx="${point.x}" cy="${point.y}" r="4.5" class="analytic-dot-${config.className}"/><text x="${point.x}" y="${Math.max(12,point.y-12)}" text-anchor="middle" class="analytic-value-label ${config.className}">${point.value.toFixed(1)}${config.unit}</text>`).join('')}
        ${model.months.map((month,index) => `<text x="${(index*monthStep).toFixed(1)}" y="266" text-anchor="middle" class="analytic-month-label">${month}</text>`).join('')}
      </g>
    </svg>`;
}

function buildAnalyticalTemperatureChart(model, d){
  return buildAnalyticalMetricChart(model, d, {
    values:model.average,
    statuses:model.temperatureStatuses,
    axisMin:0,
    axisMax:12,
    ticks:[0,2,4,6,8,10,12],
    criticalValue:Number(d.max ?? 8),
    unit:'°C',
    axisLabel:'Temperatura (°C)',
    seriesLabel:'Temperatura média',
    className:'temperature',
    ariaLabel:'Histórico da temperatura do equipamento'
  });
}

function buildAnalyticalHumidityChart(model, d){
  const axisMin = Math.floor(Math.min(...model.humidity) - 2);
  const axisMax = Math.ceil(Math.max(...model.humidity) + 3);
  const mid = Math.round((axisMin + axisMax) / 2);
  return buildAnalyticalMetricChart(model, d, {
    values:model.humidity,
    statuses:model.humidityStatuses,
    axisMin,
    axisMax,
    ticks:[axisMin, mid, axisMax],
    criticalValue:Math.min(axisMax - 0.5, Math.max(28, model.humidityMax)),
    unit:'°C',
    axisLabel:'Umidade (°C)',
    seriesLabel:'Umidade',
    className:'humidity',
    ariaLabel:'Histórico da umidade do equipamento'
  });
}

function buildAnalyticalOccurrencesChart(model){
  const total = model.alertTotal + model.recurrenceTotal + model.offlineTotal;
  const alertShare = total ? (model.alertTotal / total) * 100 : 0;
  const recurrenceShare = total ? (model.recurrenceTotal / total) * 100 : 0;
  const offlineShare = total ? (model.offlineTotal / total) * 100 : 0;
  const comparison = (label, values, tone) => {
    const start = Number(values[0] || 0);
    const end = Number(values.at(-1) || 0);
    const delta = end - start;
    const direction = delta > 0 ? 'aumentaram' : (delta < 0 ? 'diminuíram' : 'permaneceram estáveis');
    const arrow = delta > 0 ? '↑' : (delta < 0 ? '↓' : '→');
    const difference = delta ? `${Math.abs(delta)} registro${Math.abs(delta) === 1 ? '' : 's'}` : 'sem alteração';
    return `<div class="analytic-occurrence-trend ${tone}"><i></i><div><small>${label}</small><strong>${arrow} ${direction}</strong><span>${start} no início · ${end} no fim · ${difference}</span></div></div>`;
  };
  return `
    <div class="analytic-donut-layout">
      <div class="analytic-donut-wrap">
        <svg class="analytic-donut-svg" viewBox="0 0 220 220" role="img" aria-label="${total} ocorrências: ${model.alertTotal} alertas, ${model.recurrenceTotal} recorrências e ${model.offlineTotal} sem comunicação">
          <circle class="analytic-donut-track" cx="110" cy="110" r="76" pathLength="100"></circle>
          <circle class="analytic-donut-segment alerts" cx="110" cy="110" r="76" pathLength="100" stroke-dasharray="${alertShare.toFixed(3)} ${(100-alertShare).toFixed(3)}"></circle>
          <circle class="analytic-donut-segment recurrences" cx="110" cy="110" r="76" pathLength="100" stroke-dasharray="${recurrenceShare.toFixed(3)} ${(100-recurrenceShare).toFixed(3)}" stroke-dashoffset="${(-alertShare).toFixed(3)}"></circle>
          <circle class="analytic-donut-segment offline" cx="110" cy="110" r="76" pathLength="100" stroke-dasharray="${offlineShare.toFixed(3)} ${(100-offlineShare).toFixed(3)}" stroke-dashoffset="${(-(alertShare+recurrenceShare)).toFixed(3)}"></circle>
          <text x="110" y="105" text-anchor="middle" class="analytic-donut-total">${total}</text>
          <text x="110" y="125" text-anchor="middle" class="analytic-donut-caption">OCORRÊNCIAS</text>
        </svg>
      </div>
      <div class="analytic-donut-legend">
        <div class="alerts"><i></i><span><small>Alertas</small><strong>${model.alertTotal}</strong></span></div>
        <div class="recurrences"><i></i><span><small>Recorrências</small><strong>${model.recurrenceTotal}</strong></span></div>
        <div class="offline"><i></i><span><small>Sem comunicação</small><strong>${model.offlineTotal}</strong></span></div>
      </div>
    </div>
    <div class="analytic-occurrence-trends">
      <div class="analytic-occurrence-trends-title"><strong>Comparação dos últimos 6 meses</strong><span>Início do período comparado ao mês mais recente</span></div>
      ${comparison('Alertas', model.alerts, 'alerts')}
      ${comparison('Recorrências', model.recurrences, 'recurrences')}
      ${comparison('Sem comunicação', model.offline, 'offline')}
    </div>`;
}

function buildAnalyticalReport(d){
  const model = buildAnalyticalReportModel(d);
  const period = analyticalReportPeriod();
  const trendWord = model.averageChange > 0.2 ? 'aumentou' : (model.averageChange < -0.2 ? 'reduziu' : 'permaneceu estável');
  const trendClass = model.averageChange > 0.2 ? 'up' : (model.averageChange < -0.2 ? 'down' : 'stable');
  const trendSign = model.averageChange > 0 ? '+' : '';
  const humidityTrendWord = model.humidityChange > 0.2 ? 'aumentou' : (model.humidityChange < -0.2 ? 'reduziu' : 'permaneceu estável');
  const humidityTrendClass = model.humidityChange > 0.2 ? 'up' : (model.humidityChange < -0.2 ? 'down' : 'stable');
  const humidityTrendSign = model.humidityChange > 0 ? '+' : '';
  const areaName = d.unitName || d.sector || 'Banco IDvida';
  const deviceId = d.backendId || d.code || d.id;
  const largestAverageIncreases = model.months.slice(1).map((month,index) => ({
    month,
    change:Number((model.average[index + 1] - model.average[index]).toFixed(1))
  })).sort((a,b) => b.change - a.change).slice(0,3);
  const largestAverageIncreasesText = largestAverageIncreases.map(item => `${item.month}: +${item.change.toFixed(1)}°C`).join(' · ');
  const largestHumidityIncreases = model.months.slice(1).map((month,index) => ({
    month,
    change:Number((model.humidity[index + 1] - model.humidity[index]).toFixed(1))
  })).sort((a,b) => b.change - a.change).slice(0,3);
  const largestHumidityIncreasesText = largestHumidityIncreases.map(item => `${item.month}: +${item.change.toFixed(1)}°C`).join(' · ');
  const deviations = [
    {label:'Manhã', range:'06h - 12h', values:[8,9,10,11,13,15], peak:'8,1°C', trend:'↑'},
    {label:'Tarde', range:'12h - 18h', values:[35,38,42,47,58,55], peak:'9,4°C', trend:'↑'},
    {label:'Noite', range:'18h - 00h', values:[9,10,12,14,16,17], peak:'8,6°C', trend:'↑'},
    {label:'Madrugada', range:'00h - 06h', values:[2,2,2,3,3,3], peak:'7,2°C', trend:'↔'}
  ];
  const humidityDeviations = [
    {label:'Manhã', range:'06h - 12h', values:[5,6,8,10,9,7], peak:'26,8°C', trend:'↑'},
    {label:'Tarde', range:'12h - 18h', values:[12,14,18,24,21,16], peak:'28,2°C', trend:'↑'},
    {label:'Noite', range:'18h - 00h', values:[7,8,10,12,11,9], peak:'27,0°C', trend:'↑'},
    {label:'Madrugada', range:'00h - 06h', values:[2,2,3,4,3,2], peak:'25,6°C', trend:'→'}
  ];
  const processes = [
    ['Degelo','18','45h 30min'], ['Inventário','32','18h 40min'],
    ['Reposição','76','30h 15min'], ['Manutenção','12','22h 30min']
  ];
  return `
    <div class="analytic-report-backdrop" onclick="closeAnalyticalReportModal()"></div>
    <div class="analytic-report-shell" role="dialog" aria-modal="true" aria-label="Relatório analítico de ${escapeTelemetryText(d.name)}">
      <div class="analytic-report-toolbar">
        <div><strong>Pré-visualização do relatório</strong><small>Versão HTML para aprovação visual</small></div>
        <div class="analytic-report-actions">
          <button type="button" class="analytic-pdf-btn" disabled title="Disponível após a aprovação do modelo">Baixar PDF <small>após aprovação</small></button>
          <button type="button" class="analytic-close-btn" onclick="closeAnalyticalReportModal()" aria-label="Fechar">×</button>
        </div>
      </div>
      <div class="analytic-report-scroll">
        <article class="analytic-report-page">
          <div class="analytic-top-band"></div>
          <header class="analytic-report-header">
            <div class="analytic-brand-block">
              <img src="assets/idsensor-logo.png" alt="IDsensor">
              <div><h1>RELATÓRIO ANALÍTICO INDIVIDUAL</h1><p>Análise da temperatura e das ocorrências do equipamento</p></div>
            </div>
            <div class="analytic-period-block">
              <span>${getCalendarIcon()}</span>
              <div><small>Período analisado</small><strong>${period.start} a ${period.end}</strong><em>Últimos 6 meses</em></div>
            </div>
          </header>

          <section class="analytic-device-strip">
            <div><h2>${escapeTelemetryText(d.name)}</h2><p><strong>Área:</strong> ${escapeTelemetryText(areaName)}</p><p><strong>ID do dispositivo:</strong> ${escapeTelemetryText(deviceId)}</p><p><strong>Faixa configurada:</strong> ${tempLabel(d.min ?? 2)} a ${tempLabel(d.max ?? 8)}</p></div>
            <div class="analytic-device-purpose"><small>Escopo do relatório</small><strong>Temperatura e ocorrências</strong><span>Consolida o histórico do equipamento no período.</span></div>
          </section>

          <section class="analytic-kpi-grid">
            <div class="analytic-kpi"><small>Temperatura mínima</small><strong class="blue">${model.minValue.toFixed(1)}°C</strong><span class="analytic-kpi-note down"><b>↓</b> Menor leitura · 05/01/2026 04:10</span></div>
            <div class="analytic-kpi"><small>Temperatura máxima</small><strong class="red">${model.maxValue.toFixed(1)}°C</strong><span class="analytic-kpi-note up"><b>↑</b> Maior leitura · 11/06/2026 15:40</span></div>
            <div class="analytic-kpi"><small>Temperatura média</small><strong>${model.averageValue.toFixed(1)}°C</strong><span>Período analisado</span></div>
            <div class="analytic-kpi"><small>Variação total</small><strong class="red">↑ +${model.variation.toFixed(1)}°C</strong><span>Máxima - mínima</span></div>
            <div class="analytic-kpi"><small>Tempo em crítico</small><strong class="red">${analyticalDuration(model.criticalSeconds)}</strong><span>Tempo acumulado no período</span></div>
            <div class="analytic-kpi"><small>Tempo em atenção</small><strong class="orange">${analyticalDuration(model.attentionSeconds)}</strong><span>Tempo acumulado no período</span></div>
            <div class="analytic-kpi"><small>Sem comunicação</small><strong class="gray">${analyticalDuration(model.offlineSeconds)}</strong><span>Tempo acumulado no período</span></div>
          </section>

          <section class="analytic-section analytic-history-section">
            <div class="analytic-section-title"><b>1</b><div><h3>Comportamento da temperatura do período</h3><p>Mostra a temperatura média em °C e as faixas de condição: dentro do limite, atenção, crítico e sem comunicação.</p></div></div>
            <div class="analytic-history-grid">
              <div class="analytic-chart-card">${buildAnalyticalTemperatureChart(model,d)}</div>
              <aside class="analytic-period-summary">
                <h4>Leitura da temperatura</h4>
                <div class="analytic-trend-conclusion"><strong class="${trendClass}">A temperatura ${trendWord}</strong><span>A média avançou ${trendSign}${model.averageChange.toFixed(1)}°C nos seis meses, de ${model.average[0].toFixed(1)}°C para ${model.average.at(-1).toFixed(1)}°C.</span></div>
                <div><small>Temperatura média do período</small><strong>${model.averageValue.toFixed(1)}°C</strong><span>Maior pico: ${model.maxValue.toFixed(1)}°C · Menor leitura: ${model.minValue.toFixed(1)}°C.</span></div>
                <div><small>Maiores aumentos da média</small><strong class="analytic-trend-inline">${largestAverageIncreasesText}</strong></div>
                <div><small>Tempo fora da condição normal</small><strong>${analyticalLongDuration(model.conditionSeconds.attention + model.conditionSeconds.critical)}</strong><span>${analyticalLongDuration(model.conditionSeconds.attention)} em atenção e ${analyticalLongDuration(model.conditionSeconds.critical)} em crítico.</span></div>
              </aside>
            </div>
          </section>

          <div class="analytic-two-column">
            <section class="analytic-section">
              <div class="analytic-section-title"><b>2</b><div><h3>Tempo da temperatura em cada condição</h3><p>Mostra, em horas e minutos, quanto tempo a temperatura permaneceu dentro do limite, em atenção, em crítico ou sem comunicação.</p></div></div>
              <div class="analytic-condition-bar" aria-label="Tempo por condição"><span class="normal" style="width:${model.conditionWidths.normal}%"></span><span class="attention" style="width:${model.conditionWidths.attention}%"></span><span class="critical" style="width:${model.conditionWidths.critical}%"></span><span class="offline" style="width:${model.conditionWidths.offline}%"></span></div>
              <div class="analytic-condition-legend">
                <div><i class="normal"></i><span>Dentro do limite</span><strong>${analyticalLongDuration(model.conditionSeconds.normal)}</strong></div>
                <div><i class="attention"></i><span>Atenção</span><strong>${analyticalLongDuration(model.conditionSeconds.attention)}</strong></div>
                <div><i class="critical"></i><span>Crítico</span><strong>${analyticalLongDuration(model.conditionSeconds.critical)}</strong></div>
                <div><i class="offline"></i><span>Sem comunicação</span><strong>${analyticalLongDuration(model.conditionSeconds.offline)}</strong></div>
              </div>
              <div class="analytic-condition-total"><small>Total de horas monitoradas</small><strong>${analyticalLongDuration(model.periodSeconds)}</strong></div>
              <p class="analytic-condition-reading">A temperatura permaneceu dentro do limite por <strong>${analyticalLongDuration(model.conditionSeconds.normal)}</strong>. Fora da condição normal, foram registrados ${analyticalLongDuration(model.conditionSeconds.attention)} em atenção, ${analyticalLongDuration(model.conditionSeconds.critical)} em crítico e ${analyticalLongDuration(model.conditionSeconds.offline)} sem comunicação.</p>
            </section>

            <section class="analytic-section analytic-deviation-section">
              <div class="analytic-section-title"><b>3</b><div><h3>Desvio da temperatura por horário</h3><p>Mostra a incidência de desvios da temperatura e os maiores picos em cada faixa do dia.</p></div></div>
              <div class="analytic-table-wrap"><table class="analytic-table analytic-deviation-table"><thead><tr><th>Período</th>${model.months.map(month=>`<th>${month.replace('/26','')}</th>`).join('')}<th>Pico</th><th>Tend.</th></tr></thead><tbody>
                ${deviations.map(row => `<tr><td><strong>${row.label}</strong><small>${row.range}</small></td>${row.values.map(value=>`<td>${value}</td>`).join('')}<td class="peak">${row.peak}</td><td class="trend">${row.trend}</td></tr>`).join('')}
              </tbody></table></div>
              <p class="analytic-table-note">A maior concentração de desvios ocorreu no período da tarde.</p>
            </section>
          </div>

          <section class="analytic-section analytic-history-section">
            <div class="analytic-section-title"><b>4</b><div><h3>Comportamento da umidade do período</h3><p>Mostra a umidade em °C e as faixas de condição: dentro do limite, atenção, crítico e sem comunicação.</p></div></div>
            <div class="analytic-history-grid">
              <div class="analytic-chart-card">${buildAnalyticalHumidityChart(model,d)}</div>
              <aside class="analytic-period-summary">
                <h4>Leitura da umidade</h4>
                <div class="analytic-trend-conclusion"><strong class="${humidityTrendClass}">A umidade ${humidityTrendWord}</strong><span>A leitura variou ${humidityTrendSign}${model.humidityChange.toFixed(1)}°C nos seis meses, de ${model.humidity[0].toFixed(1)}°C para ${model.humidity.at(-1).toFixed(1)}°C.</span></div>
                <div><small>Umidade média do período</small><strong>${model.humidityAverage.toFixed(1)}°C</strong><span>Maior pico: ${model.humidityMax.toFixed(1)}°C.</span></div>
                <div><small>Maiores aumentos da umidade</small><strong class="analytic-trend-inline">${largestHumidityIncreasesText}</strong></div>
                <div><small>Tempo fora da condição normal</small><strong>${analyticalLongDuration(model.humidityConditionSeconds.attention + model.humidityConditionSeconds.critical)}</strong><span>${analyticalLongDuration(model.humidityConditionSeconds.attention)} em atenção e ${analyticalLongDuration(model.humidityConditionSeconds.critical)} em crítico.</span></div>
              </aside>
            </div>
          </section>

          <div class="analytic-two-column">
            <section class="analytic-section">
              <div class="analytic-section-title"><b>5</b><div><h3>Tempo da umidade em cada condição</h3><p>Mostra, em horas e minutos, quanto tempo a umidade permaneceu dentro do limite, em atenção, em crítico ou sem comunicação.</p></div></div>
              <div class="analytic-condition-bar" aria-label="Tempo da umidade por condição"><span class="normal" style="width:${model.humidityConditionWidths.normal}%"></span><span class="attention" style="width:${model.humidityConditionWidths.attention}%"></span><span class="critical" style="width:${model.humidityConditionWidths.critical}%"></span><span class="offline" style="width:${model.humidityConditionWidths.offline}%"></span></div>
              <div class="analytic-condition-legend">
                <div><i class="normal"></i><span>Dentro do limite</span><strong>${analyticalLongDuration(model.humidityConditionSeconds.normal)}</strong></div>
                <div><i class="attention"></i><span>Atenção</span><strong>${analyticalLongDuration(model.humidityConditionSeconds.attention)}</strong></div>
                <div><i class="critical"></i><span>Crítico</span><strong>${analyticalLongDuration(model.humidityConditionSeconds.critical)}</strong></div>
                <div><i class="offline"></i><span>Sem comunicação</span><strong>${analyticalLongDuration(model.humidityConditionSeconds.offline)}</strong></div>
              </div>
              <div class="analytic-condition-total"><small>Total de horas monitoradas</small><strong>${analyticalLongDuration(model.periodSeconds)}</strong></div>
              <p class="analytic-condition-reading">A umidade permaneceu dentro do limite por <strong>${analyticalLongDuration(model.humidityConditionSeconds.normal)}</strong>. Fora da condição normal, foram registrados ${analyticalLongDuration(model.humidityConditionSeconds.attention)} em atenção e ${analyticalLongDuration(model.humidityConditionSeconds.critical)} em crítico.</p>
            </section>

            <section class="analytic-section analytic-deviation-section">
              <div class="analytic-section-title"><b>6</b><div><h3>Desvio da umidade por horário</h3><p>Mostra a incidência de desvios da umidade e os maiores picos em cada faixa do dia.</p></div></div>
              <div class="analytic-table-wrap"><table class="analytic-table analytic-deviation-table"><thead><tr><th>Período</th>${model.months.map(month=>`<th>${month.replace('/26','')}</th>`).join('')}<th>Pico</th><th>Tend.</th></tr></thead><tbody>
                ${humidityDeviations.map(row => `<tr><td><strong>${row.label}</strong><small>${row.range}</small></td>${row.values.map(value=>`<td>${value}</td>`).join('')}<td class="peak">${row.peak}</td><td class="trend">${row.trend}</td></tr>`).join('')}
              </tbody></table></div>
              <p class="analytic-table-note">A maior concentração de desvios de umidade ocorreu no período da tarde.</p>
            </section>
          </div>

          <section class="analytic-section analytic-indicators-section">
            <div class="analytic-section-title"><b>7</b><div><h3>Indicadores</h3><p>Consolida as ocorrências e os processos registrados durante o período analisado.</p></div></div>
            <div class="analytic-indicator-grid">
              <div class="analytic-occurrence-panel">
                ${buildAnalyticalOccurrencesChart(model)}
              </div>
              <div class="analytic-process-panel">
                <h4>Processos registrados</h4><p>Períodos em que o equipamento foi colocado em um processo operacional.</p>
                <table class="analytic-table"><thead><tr><th>Processo</th><th>Quantidade</th><th>Tempo total</th></tr></thead><tbody>${processes.map(row=>`<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join('')}<tr class="total"><td>Total</td><td>138</td><td>116h 45min</td></tr></tbody></table>
                <small class="analytic-process-note">Esses processos mostram os períodos em que o equipamento foi colocado pelo usuário em manutenção, degelo, inventário ou reposição. Nesses intervalos, o processo permanece registrado e os alertas automáticos relacionados à intervenção ficam suspensos, evitando contabilizar a operação planejada como falha.</small>
              </div>
            </div>
          </section>

          <section class="analytic-section analytic-analysis-section">
            <div class="analytic-section-title"><b>8</b><div><h3>Análise do período</h3><p>Resumo factual da temperatura, da umidade e dos indicadores operacionais apresentados neste relatório.</p></div></div>
            <div class="analytic-analysis-copy">
              <p><strong>Temperatura:</strong> a média ${trendWord} ${Math.abs(model.averageChange).toFixed(1)}°C, passando de ${model.average[0].toFixed(1)}°C em ${model.months[0]} para ${model.average.at(-1).toFixed(1)}°C em ${model.months.at(-1)}. O maior pico registrado foi de <strong>${model.maxValue.toFixed(1)}°C</strong>, com ${analyticalDuration(model.criticalSeconds)} em crítico e ${analyticalDuration(model.attentionSeconds)} em atenção.</p>
              <p><strong>Umidade:</strong> a leitura ${humidityTrendWord} ${Math.abs(model.humidityChange).toFixed(1)}°C, passando de ${model.humidity[0].toFixed(1)}°C para ${model.humidity.at(-1).toFixed(1)}°C. O maior pico foi de <strong>${model.humidityMax.toFixed(1)}°C</strong>, com ${analyticalLongDuration(model.humidityConditionSeconds.critical)} em crítico e ${analyticalLongDuration(model.humidityConditionSeconds.attention)} em atenção.</p>
              <p><strong>Operacional:</strong> foram contabilizados <strong>${model.alertTotal} alertas</strong>, <strong>${model.recurrenceTotal} recorrências</strong> e ${model.offlineTotal} ocorrências de perda de comunicação. A maior incidência de desvios ocorreu no período da tarde.</p>
            </div>
          </section>

          <section class="analytic-signature">
            <div><span></span><strong>Assinatura do responsável</strong><small>Nome e identificação</small></div>
            <div class="analytic-generated"><small>Relatório gerado em</small><strong>${period.generated}</strong><span>ID: RA-${String(d.id).padStart(4,'0')}-0626</span></div>
          </section>

          <footer class="analytic-report-footer">
            <div class="analytic-powered"><span>Powered by</span><img src="assets/idvida-logo.png" alt="IDvida"></div>
            <strong>IDsensor · Relatório Analítico Individual</strong><span>Página 1 de 1</span>
          </footer>
        </article>
      </div>
    </div>`;
}

function openAnalyticalReportModal(id){
  const d = devices.find(device => Number(device.id) === Number(id));
  if(!d) return;
  closeAnalyticalReportModal();
  const root = document.createElement('div');
  root.id = 'analyticReportRoot';
  root.innerHTML = buildAnalyticalReport(d);
  document.body.appendChild(root);
  document.body.classList.add('analytic-report-open');
  requestAnimationFrame(() => root.classList.add('show'));
}

function closeAnalyticalReportModal(){
  document.getElementById('analyticReportRoot')?.remove();
  document.body.classList.remove('analytic-report-open');
}

document.addEventListener('keydown', event => {
  if(event.key === 'Escape' && document.getElementById('analyticReportRoot')) closeAnalyticalReportModal();
});

function openDetail(id, keepMenu){
  const d = devices.find(x => x.id === id);
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if(!d || !card) return;
  closeDetail();
  activeId = id;
  const rect = card.getBoundingClientRect();
  const overlay = document.createElement('div');
  overlay.className = 'card-floating-detail';
  overlay.id = 'cardFloatingDetail';
  const backdrop = document.createElement('div');
  backdrop.className = 'card-floating-backdrop';
  backdrop.id = 'cardFloatingBackdrop';
  overlay.innerHTML = '<div class="detail-scroll-wrap">' + buildDetail(d).replace('<button class="close-btn" id="closeBtn" aria-label="Fechar">Fechar</button>','<button class="close-btn" id="closeBtn" type="button">Fechar</button>') + '</div>';
  document.body.appendChild(backdrop);
  document.body.appendChild(overlay);
  const width = Math.min(520, window.innerWidth - 32);
  let left = rect.left;
  let top = rect.top - 8;
  if(left + width > window.innerWidth - 16) left = window.innerWidth - width - 16;
  if(left < 16) left = 16;
  const maxTop = window.innerHeight - Math.min(680, overlay.offsetHeight) - 16;
  if(top > maxTop) top = Math.max(16, maxTop);
  if(top < 16) top = 16;
  overlay.style.left = left + 'px';
  overlay.style.top = top + 'px';
  document.getElementById('closeBtn').addEventListener('click', closeDetail);
  backdrop.addEventListener('click', closeDetail);
  if(!keepMenu) accMenu.classList.remove('show');
}
function closeDetail(){
  activeId = null;
  document.getElementById('cardFloatingDetail')?.remove();
  document.getElementById('cardFloatingBackdrop')?.remove();
}


function attachFilterHandlers(){
  document.querySelectorAll('.filterchip').forEach(chip=>{
    chip.style.cursor='pointer';
    chip.onclick = ()=>{
      nocFilteredIds = null;
      const text = chip.innerText.toLowerCase();
      if(text.includes('normal')) activeFilter = activeFilter === 'blue' ? null : 'blue';
      else if(text.includes('atenção')) activeFilter = activeFilter === 'warn' ? null : 'warn';
      else if(text.includes('crítico')) activeFilter = activeFilter === 'crit' ? null : 'crit';
      else if(text.includes('manutenção')) activeFilter = activeFilter === 'maint' ? null : 'maint';
      else if(text.includes('sem comunicação')) activeFilter = activeFilter === 'offline' ? null : 'offline';
      else if(text.includes('degelo')) activeFilter = activeFilter === 'defrost' ? null : 'defrost';
      else if(text.includes('reposição')) activeFilter = activeFilter === 'restock' ? null : 'restock';
      else if(text.includes('inventário')) activeFilter = activeFilter === 'inventory' ? null : 'inventory';

      document.querySelectorAll('.filterchip').forEach(el => el.style.outline = 'none');
      if(activeFilter){
        const target = Array.from(document.querySelectorAll('.filterchip')).find(el => el.innerText.toLowerCase().includes(
          activeFilter==='blue' ? 'normal' :
          activeFilter==='warn' ? 'atenção' :
          activeFilter==='crit' ? 'crítico' :
          activeFilter==='maint' ? 'manutenção' :
          activeFilter==='offline' ? 'sem comunicação' :
          activeFilter==='defrost' ? 'degelo' :
          activeFilter==='restock' ? 'reposição' : 'inventário'
        ));
        if(target) target.style.outline = '2px solid #7c8ea8';
      }
      renderGrid();
      if(activeId && activeFilter){
        const selected = devices.find(d => d.id===activeId);
        if(selected && selected.state !== activeFilter) closeDetail();
      }
    };
  });
}

accButton.addEventListener('click', (e)=>{
  e.stopPropagation();
  const open = accMenu.classList.toggle('show');
  accButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (e)=>{
  if(!accMenu.contains(e.target) && !accButton.contains(e.target)) { accMenu.classList.remove('show'); accButton.setAttribute('aria-expanded','false'); }
});

toggleColorblind.addEventListener('click', ()=>{ accessibility.colorblind = !accessibility.colorblind; applyAccessibility(); });
toggleContrast.addEventListener('click', ()=>{ accessibility.contrast = !accessibility.contrast; applyAccessibility(); });
toggleDensity.addEventListener('click', ()=>{ accessibility.compact = !accessibility.compact; applyAccessibility(); });
if(toggleCommIcon) toggleCommIcon.addEventListener('click', ()=>{ accessibility.showCommIcon = !accessibility.showCommIcon; applyAccessibility(); });
if(toggleMinMax) toggleMinMax.addEventListener('click', ()=>{ accessibility.showMinMax = !accessibility.showMinMax; applyAccessibility(); });
if(toggleBattery) toggleBattery.addEventListener('click', ()=>{ accessibility.showBattery = !accessibility.showBattery; applyAccessibility(); });

loadAccessibility();
applyAccessibility();

/* ===== SCRIPT BLOCK 2 | (sem-id) ===== */
let isOpen = false;
let currentFilter = 'all';

document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("filterMain");
  const arrow = document.getElementById("filterArrow");
  const chips = document.querySelectorAll(".filterchip");
  const statusChips = document.querySelector(".statuschips");

  if (!main || !statusChips) return;

  function applyFilter(type){
    currentFilter = type;

    document.querySelectorAll(".card").forEach(card=>{
      if(type === 'all'){
        card.style.display = '';
      }else{
        card.style.display = card.classList.contains(type) ? '' : 'none';
      }
    });
  }

  main.addEventListener("click", (e)=>{
    // Click arrow area → expand
    if(e.target === arrow || e.target.closest('.filter-arrow')){
      isOpen = !isOpen;
      main.classList.toggle("open");
      statusChips.style.display = isOpen ? "flex" : "none";
      return;
    }

    // Click text → reset
    applyFilter('all');
    isOpen = false;
    main.classList.remove("open");
    statusChips.style.display = "none";
  });

  chips.forEach(chip=>{
    chip.addEventListener("click", ()=>{
      const text = chip.innerText.toLowerCase();

      if(text.includes("normal")) applyFilter("blue");
      if(text.includes("atenção")) applyFilter("warn");
      if(text.includes("crítico")) applyFilter("crit");
      if(text.includes("manutenção")) applyFilter("maint");
    });
  });

  // start hidden
  statusChips.style.display = "none";
});

/* ===== SCRIPT BLOCK 3 | (sem-id) ===== */
(function(){
  const filtersControl = document.getElementById('filtersControl');
  const filterAllBtn = document.getElementById('filterAllBtn');
  const filterAllArrow = document.getElementById('filterAllArrow');
  const filterChips = document.querySelectorAll('#statusChips .filterchip');
  if(filtersControl && filterAllBtn && filterAllArrow){
    function closeFilters(){ filtersControl.classList.remove('open'); }
    function resetToAll(){
      activeFilter = null;
      nocFilteredIds = null;
      renderGrid();
      closeDetail();
      closeFilters();
      document.querySelectorAll('.filterchip').forEach(el => el.style.outline = 'none');
    }
    filterAllArrow.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      filtersControl.classList.toggle('open');
    });
    filterAllBtn.addEventListener('click', function(e){
      if(e.target === filterAllArrow || filterAllArrow.contains(e.target)) return;
      resetToAll();
    });
    filterChips.forEach(chip => chip.addEventListener('click', function(){ filtersControl.classList.add('open'); }));
  }
  window.addEventListener('resize', ()=>{ if(activeId){ closeDetail(); } });
})();


/* ===== SCRIPT BLOCK 44 | app-deep-link-route ===== */
(function(){
  const FILTER_MAP = {
    all: null,
    normal: 'blue',
    blue: 'blue',
    warn: 'warn',
    atencao: 'warn',
    attention: 'warn',
    crit: 'crit',
    critico: 'crit',
    critical: 'crit',
    offline: 'offline'
  };

  const CHIP_MAP = {
    blue: 'normal',
    warn: 'warn',
    crit: 'crit',
    offline: 'offline'
  };

  function normalizeRole(role){
    const value = String(role || '').toLowerCase();
    return ['master','admin1','admin2','area','cart'].includes(value) ? value : '';
  }

  function applyRouteFilter(filter){
    const normalized = String(filter || 'all').toLowerCase();
    const nextFilter = Object.prototype.hasOwnProperty.call(FILTER_MAP, normalized)
      ? FILTER_MAP[normalized]
      : null;

    activeFilter = nextFilter;
    nocFilteredIds = null;

    document.querySelectorAll('.filterchip').forEach(el => el.style.outline = 'none');
    if(nextFilter){
      const chipKey = CHIP_MAP[nextFilter] || nextFilter;
      const target = document.querySelector(`.filterchip[data-filter="${chipKey}"]`);
      if(target) target.style.outline = '2px solid #7c8ea8';
    }

    if(typeof renderGrid === 'function') renderGrid();
  }

  function applyPanelRouteParams(){
    const params = new URLSearchParams(window.location.search || '');
    const role = normalizeRole(params.get('role'));
    const filter = params.get('filter');
    const area = params.get('area');

    if(role && typeof window.applyPanelRole === 'function'){
      window.applyPanelRole(role);
    }

    if(area){
      selectedArea = area;
    }

    if(filter){
      applyRouteFilter(filter);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(applyPanelRouteParams, 120);
  });
})();


/* ===== BACKEND DATA SOURCE | shared panel and NOC state ===== */
(function(){
  const DEFAULT_API_BASE_URL = 'http://localhost:4000';
  const POLL_INTERVAL_MS = 10000;
  let previousPanelAlertKeys = null;

  function getPanelApiBaseUrl(){
    try {
      const configuredUrl = localStorage.getItem('PANEL_API_BASE_URL');
      if(configuredUrl) return configuredUrl;
    } catch(e) {}

    try {
      const host = window.location.hostname;
      const port = window.location.port;
      const protocol = window.location.protocol;
      const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '';
      const isStandaloneLocalPanel = isLocalHost && port && port !== '4000';

      if(protocol.indexOf('http') === 0 && window.location.origin && !isStandaloneLocalPanel){
        return window.location.origin;
      }
    } catch(e) {}

    return DEFAULT_API_BASE_URL;
  }

  function asPanelDevice(card, index){
    const panelId = Number(card.panelId || card.id || index + 1);
    const humidityTemperature = normalizeHumidityTemperatureValue(card.humidity ?? card.hum2 ?? card.hum1);
    return {
      ...card,
      id: Number.isFinite(panelId) ? panelId : index + 1,
      backendId: card.backendId || card.deviceId || card.id,
      name: card.name || card.deviceName || `Geladeira ${String(index + 1).padStart(2, '0')}`,
      sector: card.sector || card.local || 'Banco IDvida',
      state: card.state || 'blue',
      status: card.status || 'NORMAL',
      online: card.online !== false,
      events: Array.isArray(card.events) ? card.events : ['Sem alerta ativo'],
      chart: Array.isArray(card.chart) ? card.chart : [],
      hum1: humidityTemperature,
      hum2: humidityTemperature,
      code: card.code || card.qrCode
    };
  }

  function panelAlertKey(device){
    if(!device) return null;
    const isOffline = device.online === false && device.state !== 'maint';
    const isTemperatureAlert = device.state === 'warn' || device.state === 'crit';
    if(!isOffline && !isTemperatureAlert) return null;
    return `${device.id}:${device.state}:${isOffline ? 'offline' : 'online'}`;
  }

  function notifyNewPanelAlerts(nextDevices){
    const nextKeys = new Set(nextDevices.map(panelAlertKey).filter(Boolean));
    if(previousPanelAlertKeys){
      const hasNewAlert = Array.from(nextKeys).some(key => !previousPanelAlertKeys.has(key));
      if(hasNewAlert && typeof window.playPanelAlertSequence === 'function'){
        window.playPanelAlertSequence();
      }
    }
    previousPanelAlertKeys = nextKeys;
  }

  function isNocLiveVisible(){
    const overlay = document.getElementById('nocLiveOverlay') || document.querySelector('.noc-live-overlay');
    if(!overlay) return false;
    return overlay.classList.contains('show') || overlay.classList.contains('active') || overlay.style.display === 'block';
  }

  function refreshNocLiveFromDevices(){
    if(!isNocLiveVisible()) return;
    const grid = document.getElementById('nocLiveGrid');
    if(!grid || typeof getNocCounts !== 'function' || typeof window.createNocCard !== 'function') return;

    const mode = (typeof integratedNocMode !== 'undefined' && integratedNocMode) ? integratedNocMode : 'area';
    const counts = getNocCounts();
    const items = (counts && counts[mode]) ? counts[mode] : [];
    const signature = JSON.stringify({
      mode,
      items: items.map(item => ({
        key: item.key,
        count: item.count,
        rotations: item.rotations || [],
        visibleIds: item.visibleIds || []
      }))
    });

    if(window.__nocLiveBackendSignature === signature) return;
    const hadSignature = !!window.__nocLiveBackendSignature;
    window.__nocLiveBackendSignature = signature;

    if(typeof clearIntegratedNocTimers === 'function') clearIntegratedNocTimers();

    grid.innerHTML = items.map(item => window.createNocCard(item, mode)).join('');
    Array.from(grid.querySelectorAll('.noc-card')).forEach(card => {
      card.style.display = 'block';
      card.classList.add('show');
    });

    if(typeof window.setupNocRotations === 'function') window.setupNocRotations();
    if(typeof updateNocOccurrenceBadge === 'function') updateNocOccurrenceBadge();

    const occBtn = document.getElementById('nocOccBtn');
    if(occBtn && !items.length) occBtn.textContent = 'Ocorrencias (0)';

    if(hadSignature && items.length && typeof window.playPanelAlertSequence === 'function'){
      window.playPanelAlertSequence();
    }
  }

  function isCartTrackingSessionActive(){
    const role = window.activePanelSession?.role || document.body.dataset.authRole || '';
    return role === 'cart' || document.body.classList.contains('cart-tracking-open');
  }

  function shouldLoadLegacyPanelDevices(){
    if(isCartTrackingSessionActive()) return false;
    if(document.body.classList.contains('auth-pending')) return false;
    if(!document.body.classList.contains('auth-ready') && !window.activePanelSession?.token) return false;
    return true;
  }

  async function loadPanelDevicesFromBackend(){
    if(!shouldLoadLegacyPanelDevices()) return devices;
    const baseUrl = getPanelApiBaseUrl().replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/devices`, { cache:'no-store' });
    if(!response.ok) throw new Error(`GET /devices falhou: ${response.status}`);

    const payload = await response.json();
    const items = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
    if(!items.length) throw new Error('Backend não retornou dispositivos.');
    const nextDevices = items.map(asPanelDevice);

    notifyNewPanelAlerts(nextDevices);
    devices.splice(0, devices.length, ...nextDevices);
    window.devices = devices;
    window.panelDataSource = 'backend';
    window.panelApiBaseUrl = baseUrl;

    if(typeof renderGrid === 'function') renderGrid();
    if(typeof updateToolbarState === 'function') updateToolbarState();
    if(currentGraphDeviceId !== null && document.getElementById('graphWorkspaceRoot')) renderGraphModal();
    refreshNocLiveFromDevices();
    return devices;
  }

  function pollLegacyPanelDevices(){
    if(!shouldLoadLegacyPanelDevices()) return;
    loadPanelDevicesFromBackend().catch(() => {
      window.panelDataSource = 'mock-fallback';
      window.devices = devices;
    });
  }

  function startBackendPolling(){
    if(window.__panelBackendPollTimer) return;
    pollLegacyPanelDevices();

    window.__panelBackendPollTimer = setInterval(pollLegacyPanelDevices, POLL_INTERVAL_MS);
  }

  window.loadPanelDevicesFromBackend = loadPanelDevicesFromBackend;
  window.startPanelDevicesBackendPolling = startBackendPolling;
  window.getPanelApiBaseUrl = getPanelApiBaseUrl;
  window.refreshNocLiveFromDevices = refreshNocLiveFromDevices;

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', startBackendPolling);
  } else {
    startBackendPolling();
  }
})();

/* ===== SIMULATION CONTROL | backend events ===== */
(function(){
  const DEFAULT_API_BASE_URL = 'http://localhost:4000';

  function getSimulationApiBaseUrl(){
    if(typeof window.getPanelApiBaseUrl === 'function'){
      return window.getPanelApiBaseUrl().replace(/\/+$/, '');
    }
    try {
      return (localStorage.getItem('PANEL_API_BASE_URL') || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
    } catch(e) {
      return DEFAULT_API_BASE_URL;
    }
  }

  function setSimulationButtonState(button, enabled){
    button.classList.toggle('is-on', enabled);
    button.classList.toggle('is-off', !enabled);
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', enabled ? 'Simulador ligado' : 'Simulador desligado');
    button.setAttribute('title', enabled ? 'Simulador ligado' : 'Simulador desligado');
  }

  function setSimulationButtonBusy(button, busy){
    button.disabled = busy;
    button.classList.toggle('is-busy', busy);
    if(busy) button.setAttribute('title', 'Sincronizando simulador');
  }

  async function requestSimulation(endpoint){
    const response = await fetch(`${getSimulationApiBaseUrl()}${endpoint}`, {
      method:'POST',
      cache:'no-store'
    });
    if(!response.ok) throw new Error(`Simulador falhou: ${response.status}`);
    const payload = await response.json();
    return payload?.data || payload;
  }

  async function syncSimulationButtonState(){
    const button = document.getElementById('simulationToggleBtn');
    if(!button) return null;

    const response = await fetch(`${getSimulationApiBaseUrl()}/simulation/status`, { cache:'no-store' });
    if(!response.ok) throw new Error(`Status do simulador falhou: ${response.status}`);
    const payload = await response.json();
    const simulation = payload?.data || payload;
    setSimulationButtonState(button, !!simulation.enabled);
    return simulation;
  }

  function initSimulationButtonControl(){
    const button = document.getElementById('simulationToggleBtn');
    if(!button || button.dataset.simulationBound === 'true') return;

    button.dataset.simulationBound = 'true';
    setSimulationButtonState(button, button.classList.contains('is-on'));

    button.addEventListener('click', async () => {
      if(button.disabled) return;

      const shouldEnable = !button.classList.contains('is-on');
      if(typeof window.primePanelAlertAudio === 'function') window.primePanelAlertAudio();

      setSimulationButtonBusy(button, true);
      setSimulationButtonState(button, shouldEnable);

      try {
        const result = await requestSimulation(shouldEnable ? '/simulation/start' : '/simulation/stop');
        setSimulationButtonState(button, !!result?.simulation?.enabled);
        if(typeof window.loadPanelDevicesFromBackend === 'function'){
          await window.loadPanelDevicesFromBackend();
        }
      } catch(error) {
        console.error(error);
        setSimulationButtonState(button, !shouldEnable);
        button.setAttribute('title', 'Backend do simulador indisponivel');
      } finally {
        setSimulationButtonBusy(button, false);
      }
    });

    syncSimulationButtonState().catch(() => {});
    setInterval(() => {
      syncSimulationButtonState().catch(() => {});
    }, 10000);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initSimulationButtonControl);
  } else {
    initSimulationButtonControl();
  }
})();

/* ===== SCRIPT BLOCK 4 | adaptive-temp-script ===== */
function applyTempSizing(){
  document.querySelectorAll('.temp').forEach(el=>{
    el.classList.remove('long','xlong');
    const t = (el.textContent || '').trim();
    if(t.length >= 8){
      el.classList.add('xlong');
    }else if(t.length >= 7){
      el.classList.add('long');
    }
  });
}

document.addEventListener('DOMContentLoaded', applyTempSizing);

const observer = new MutationObserver(applyTempSizing);
observer.observe(document.body,{childList:true,subtree:true,characterData:true});

/* ===== SCRIPT BLOCK 5 | seal-helpers ===== */
function getSealInfo(d){
  if(d.state === 'crit') return { img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMsAAAEECAYAAACGMsDmAADNfUlEQVR4nOyddZwk1dWwn1tVbdPjtu74ssji7u7uJAT3ECRBEpJAgie4S3AI7oTgBGeBBVbYXdZlZselp62q7vfHraqu1ulZluR9835nf73TXXL93OPnCtu2Jf8f/r1g26BpCCEASM6cQfzDf5GcPYfEogXIWIzwqDEE11iLyLZbE958M0QwhASkaSJ0/T/b/v+jIP4/svwbQUqkbaMZBhJJ71N/p+fJJ0l8NxOrpwcAoWkgBJgmmCZ6tILwupOpOvxwqg8/FK2yCmlZ6hkH2f4//Hvg/yPLvwt81CTx7Xe0/vlKYm+9BUYAEYkgdM15DkCC8L0XT0AyRXDyejRe/Buq99pb3fr/VObfCv93kUVKtdM7fz0QQrFHq2vnlhJpWWiBAHY6TdctN9N+512YfX3oNVVIWyIt28MNpPdfpkmaQGgasn8AS5rUHnggwy7/PcbwEUjTBJcarS5wx0PKTLn/n4r9H0QWKdVubRiUmn4JYFlIKRXyaNqQ65G2jXDqGfjqS1p+dznxf/0Lra4OAjpYtg8vJBlyInPxRd0RGkIDu7OLwISJDL/2Wip33unHyzLOmEhAaDpoImtsssZidSPm/yL4v4UsloUwDABkKknq229JL1uB1dVNuq8HrSKK0dyEMWw4oXXWRq+q8l6VDoUQkEEc/6Lx7cZSSg9J7K5OOu64g4577saOxRG1NQpJcrEhFwohi0N1NF1HDsSxLIvaE09k2CUXo1dWIi0bKe3SC9ptp4ccmnreB3Y8jt3XjxUfQAsGMRoaEMGg16z/q0qG/xvI4iwQoWmYra30PfAA/a++QnLhIsyBOLZlYUtb7aiajoiECQwbTsW661K5805Ett2OwBpreNorcNatbWcWn0+7BWD39tD3/HP03HknsdnfQ00N6AbYVv5C9hOVrAoyIPzXpFT1SYnd3U1ogw1pvvQ3VO6+R1bbpG3nFKLYOZFTv9myguT06cQ//YLkV19iLV+B1duHmYyjh8MYw5oIjBtHdJ+9qdxzb7SqqkzZ/4eozH8/srgLC+i6+y66b72V9PIV2JEwhEIelRAIJI4cY1vIVBLiCTRbotfVE1x3XaJbbUlkq60JTp6MXluLFgr5qrGxu3tIzPme+NtvMfDqKyTnzMUKhiESRpoW3mrPQxaRuYdQmOGTo/KWo8RDMGHoyNgAQkiiO+xEzZFHULH99ui1tUUGxMZs7yT5/SwGPvuc+CefkJo5C6utFZlIIwIGGAEwNMWSSRtpmYhUGiQE1l6L+jPPpOboYzz2bMgs6v9S+O9GFgdRSKVYccH59D32KKKyGsIhpMODZ8sMmW9C+NS4loWdSEIyjRYOIuqbMJoaCI4aDeEItmlid7aTXr4Mq3UlMh5DhCOIcAQpLbDs4kyXFCVlp8JkJ6fNmgYC7L5+sAWBcaOpmLIh4XUnI4O6QgDTJrFgHqn5P2AuX4HV0oqdSCi2NBxSbKMQYLuKD1W+YjsVAguhYScS2ANJqg8/hJHX34CoqFAU9v8AhfnvRRZX22VZLD/7XPqffhK9qQnbsrJ2benb0LO0Yu5FVxmkaaALpb1Kp7BNE5lOqzoQCF1DDwQRwaDSXNm2WniQhZAOQ5ij/frRnVWLVdcAiZ1MIZNJMC1sMto+KUALBNBDIUQgqN6RmbHK73+B5mkCTdNIt3dQsfcejL/nXkQo4gzSfzfC/Ncii7QsNMNgxe//SOdf/0pg5DDsdBo/w1P4Reevf95zVENSCLXGRGbRC9RuLFz5qFi5peocBPLEmgJrU7oPeqxRhr30q6VVO0XJtko/tXUGTjh3tIBBqq2NumOOY/Qttyg2U//vZsf+K5FF2jaartP3zvssOeJItOpIhsen0Nr0Xc3lenLFC+n/K7NviyKLzy13EBAFninFhCEKFCtBimzVs/SrooVD10SmpaVV6FkF+SoBAjpmRxcjr76KhpNP+a83kv73IYuzmu3+ARbuvS+pebMQlZWZVS5KYALePlzgvsz8X2LEfGswp10lnh/kmeIvFKpHZhcjcxa800D1R/iuFa8/gyOeOk4hthAgLWxbMuHlV4hMmaJccf5LBf7/vl7Zys7QdsN1JGZOR1RW5atQBwFR5G/u99x3hiqHDJnD99a2oKBaQLp3S70v8hHa1a6VWb/3RUqlOUskWXnZZcqbwL3+Xwj/XcjiWMxjX3xKx333odXVIW0r+5mSVMFPU7JZFOGig8wghv+TV5bM+fj/CU19NKWeFbr6aIaBZhhKM2UYznXnOaEhpEBI4S1ugXDKzm2LyLknMu339TDzV2R9K/SkV47HwQlPU6jXVtP/r/fovPtuhK4PeXP63wL/PWyYT/u18JCDSEz7CqIVCMsCZ5IV+HfWAhb4Qvco9FgRGQcc3zJl/BPCece2FeJa6iMtGyEdjZm0s4r0/NM0HWHojmpYU/KAJjILVaLU3659KE/LJ7OKdRUCfqNkudQtm7XLZlSFEMpzQMLYF18k/F/Kjv33IItpIgIBVt5wA53XXAt1Nci0YgvyECUL/Ax7gaVTiJ+XmWXoOl0KV0NmWwhHrSxNU7nY6BpCD0E4iKiuRq+uRotUQCiAXllJsL4eGQogXQRDQCqF1d2NuaIFu78fq78X+vqR8TjCtrEtUyGQEQDDcD46CF212ZbKK8Enw0g/Vcjp3pBAuqOlVNZCArqGjMUITdmAMc89qwy2/2VhBP8VyCJNEy0QoP/td1jy858hQiHFCkjpacAKan5cO0MpyJPxJQgNNE3t5GYKmUhAOq08BcIhjIZGgiNHEhg/Hn38RILDhhMcOwFteCN6XS1aVTVaKJRxyy8BVjKJjCewB2LY7R2YS5ciu7pJrFhOasVyrEULSbe0YnW0Ifv6kQOJjCwRNDwvBdV02zHJ5CBLIXV51oUC9heZjQdCSkTAwFzZTt0FFzD80kuUHcrxxftvgP/1yOIiSnLOHBYdejhmT5cyDObKKkXVpNmUJfPLR2lcg58EaZlYA3FkIo4IGATq6gitvQ6hddYhssmmBMaPIzh+PHpTU56DIr6avO25mEHQ3ZUdV52i/Uc5PlptbaRbW0nNmUNq/gIS078mvXAB6WXLMZNxEBpapAIRDqFpOkiJcKz1hXHE22V8GsAcNbJv6Fx5T0gwkwlGPvg3anbb/b8KYf73IosvTiS1aDFLjjyS5OJFiGhUsT5Zu2EptiMz43n3NE0ZIM009kAcYVuImhrCk9YgPHUqFdtuQ2T9KRhjxxYkQNK2MosxLy5EFGpMwX5mfZceqqlSdF2xQgVetXp7SM77gfh339L30YfEv/oac9lSRDyBFgqhRyqU/5ffIdTfLr9I52uLhDybkHCQXwoNmU4go9WMe/xxKjbeUBmDNe1/vQzzvwtZfAFbmrNbxT7+mOXnnU96yWLlp2SZKIE+n7cohiiZ6w4PrmnYtoU9MACWSaC5mehWW1O5266ENt2cwLhxWVTDdd8HPBnG+bEaO18CPCEfT8h3F6e/BWZ/jMR33zLw0YfE3nufxPSvkX39aOEIWiTiyToe5DRfymzKki3luZQS0DXsZBKtppaRt9xI1c67ACqy02tbuZvF/yD4n4ks/ihGB3LjLtIty+m6/z4677kf0iZEIkjLmYzMWxlOKquCHCSR7uIS2EklH2gVFVRsshlVBx5AdKedCYwZ7WueVMK7EAhNab7+R4J/HAVoejY7FP/6K3peepm+l1/F/GGe8m+rqgJNR8qcwDS/cbPoinE1HxIMDZlMI22b+hNPoP7kUwmM9o0hUjmY+ud4dUao/gTwPwNZfJNaaEd0wWxvIzFjBj1v/ZPYSy9jLl2GVlWjBteLr/C/4WNPil3XdDQkdjyGTKYxxo2lao/dqT74EMKbbJJpoj9q8ieYUJkru/jDm1dfJZlx1nVP0Lf6++n/51t0P/448Y8/hkQCrTKKCAYdRYmdpQHMQqK8mfJ0b0hNU5q7vh6M4SOJ7rILVbvvQWjKBgRGjijqGiOlVCr2/2HI859FlpzQWxfs3l7Sy5aRamklPX8eiTmzSc2fT2ruPMyVK5EpExGtQAuG1KAW0OYUE+c9SqPrIMHu7wNbEp68PjXHHUfV/vtiNDQ4zZOZeI1VnDBpq91TQMEIRteAp5VaOMXKdhb/KiOV2zZn/CUQ+/gzuh9/jP633oS2NrRIBBEOY9tWxtjoE+gL81IZCiSFQkyZSiEHYqAH0OsaCI4dizZqOIFxEzCamwmNGUNw7BiMYc0Yw4ZnlSRN839EOPN/DllsG3RdscmpFPHPP2Pgo4+JffYF5tLFWG3tmH39CCutJjRgIEIhCAQylES6qs+MHrPQcLoLQUiBNDSEBKu3F6HrRLfemrrjj6di993RImEAj8UakkDqIL4ke+HnRiVmFr9wHD5VHf0rWuiaO494VzdSQEVjE41rr0mkob4owmRFZroy06oI0W5eAh+rm1y4kO6nn6L378+Smj8PvcJBGstG2HYOq1ucwkg/pdQ1xX6lTEimkJaJbdlICXowgFYRQautJThhPJWbb0Fk+x0JbTIVPRRUpf2HDZ3/GWRxYuGtrm66H32EnmeeJTF7FlYiqZAiGEAEA86icwanQCaW3OkpiCju406AlNnXC2hU7rwz9SedROXOO4NrbhliphQ/1dBy1KMuyzbvtTdYOW06PcuXstnZp9O47jrOwhZoukbH7Dm8deVVLP/4U2IrO0j296MJDS0UpGnyuvzsjZeoqK/Dtu0Mcjjsaqy1lWRXN9UTxmM4UZulKFFZkIPwZmcn7Y8+Rvcjj2DOnYMerVQGR78Gze+QmSPn+CQdn4OCj70SvtcsC2mZKhYnbaLpQcLrrUfN0UdS+zPHfmaa8B/ybP63I4sbZ9L75lusvORSUvPmQjiMiESUK4eUSNtVq2QjQLElXHxpSwSa0s7E+pGpFOEddqTx3HOp2n579YRte7tq2UjiIIJ/Z493dtE67Stav5zOhqedSLi6CoTg8T32Z9Ebr5MGDn3qCdY99GDMVAojGGT5Z1/w6H4HM9DRpXy/DIOqEcOR6TRdS5cQaWjkvDnfEK6vU+10fGdcNe5LBx1Jy6efUb3GJKrHj2Py0Ucyfp89sC0rj8JIl+V1tH1ldDKLRU53dNLxtwfpeuhBrEWLCFRVOcZfKzMDufpzn6rZW2Qlh9jBHMeLQdgWDMSxU0kim27O8GuvJrzRRv8xV5p/q7XIRZSuZ59nxVlnKU6nsVENuG2D47QqvP98v7O3rZx7vt9+jsAwkPEEVlcfFVOnUn/2OVQdcKBac+7OqGmD7lTuIlNaL4nmTFT3gkUs+/ATFv/rQ5Z98hkd839goK+dpqkbMXG3nQBoXG9tVnzwMUKH/paVgNq10319vHLaOaT6YujhMM2bbMJuv7uEYZPXwUqlaZk5g/bvZhCIRrN6bds2umEw75nnWfzWO+iVFaycOYP5H72L0AOM32ePbNuMA5rPzmE7ySy0UhuEEEqus21s2ybQUM/w88+j/vhj6Xzwb/Tecz9WaytaQ50q17Z9A+9SnIJfS420h2ReF6IVaNVVxKd/xaJDD2XU3XdSufOu2JapbET/Rvj3IYuTtrT/nXdpPfsc9EhYGf3MdOYZD0tkli0945aSL5dk1L9++4AG2FgdnRijR9N48aXU/+IERFi5wdiW7RnzSoG7m7ssiW0pGWPGM88x7cZbia9ooX/5cpLxPnQ9SHjEcBrWXxcznfKoT+X4caSsNBJB79JlgEKW7195nY5vZ6JXRdHq6zj66UepbGrw6q4aO4o199wd22U9HaqiaRrmQJyvrr8RXUiqmuqQukEqFScd61Mv+21AtkRogo7Zs1nw9jusufde1Iwf7z1jmWZZSCMdBAs2NTH8ggupO/RQOq7/K93PPq3Y0MoqH2uW4a0y0ZzZ7HMRKSzzrPdVqem1mmrsRIKlp53CuCeeJDJ1s387hfn3IItUbE6ypYVl55+P0AVS08C28gYtDx1yApQKRRNmHlVCpBXrRxoGtSedTNP552E0D1NuIU4kX6loPunEw0CGb18+bRp1EycSrq4BIN3fz7J/fUR0eDOVI0cwZY/jGDZ1KqO22pL6tddE03VltQ4EqBozCgI6Ekn3sqVePUs/+ggMg1Ssn01POJbKpgbMZAo9YDgaXluxIrqW1TbNMPjqjrtYNn06Uki2+NlxLPtiGsu++47+FcuwEgm0cDiTREJKhND4+q57+fDGv9I0fk1GbrEp6xxyEBP33I1AVbVi0VytWvHBzUKa0PgJjLz1ZioPOpCVV11FcvrX6JVViGBAyX654+ptgu50Cue69OY8d2r9v6VpQTiMNRCj5VcXMO75FxDV1VnKnZ8a/j1oKdVCbrvxRtIL50NFROXP8lELBT7EENm3vJ957JlCIGGoBZnubCc0eV1GP/YYI665GqN5mLIc2/agSIJ0EtjZagJmv/wqD+57MLdvvxffPPGst3DHbbsN0bGjSaRSpANBdrj2KjY88ec0rreOh2AuwlWPHIUWDIKm0bN8uWfF7m1tddzvBQ1rTHRsH2qHF5qiZnmIout0z/+BT2+6FStgUDVuPFNOOgmhG+iGQbytg0R3j7dzK7WwTnzZMma99CqhhhHEe/r49smneOHYk3h0p7348o67wLbQXMfQwcBFGstCmibVu+zMhBdfoPl3l0E0gtXVpRJ2aPmLH1x0cRFFIY1EeEgjcBEpWwkAgGmhRSuJTf+GztvvUGP8b4yd+emRxTGAxefPp+fZZ9FrarysKDmiX+b7YHOWs5EIw0D29UHapOFXFzDmhZeo3HY7bMtUlKIEy+WyZZquqwjLWbNx/bk6581n1iuvYAR0vn7sSaxUGgnUTZxA3dprYlo2HYsWMved95yuSgY6Ommd/g2WgxQ1Y0YRrq5BIOhbvoJkdw8AdspE14TSfOlG6V3dHRIh+ODK6+jr7CSeiLPRyScSrK3BCEUQRoBEXx/9La3euOOoeBe8/k86Fy1BppJEx49mq3PPpm7kSNqnTef1M87jkT33J7ZihUKYchefI+vZpolWUUHT2ecy8ZVXqDrsUKzePkimwdB9M5wRJtU196r/ieyQaDdwzmPrAEwLUV1Jx8OPYrauVKmc/k2RmT85sriD3/ncs5gdbRAIFu2c8H/x4VLBZSRAasoWYna0E9hwQ0Y/8zTNl16KVhHFNi0lAJZIY2pbFpquoxs6LdOn8+xxJ/HI7gfQPmMWABsccwSNEyYRNAK0fDOdhe+851A3wejNN8OKpwiEQnzz4MN8cMXVPLbfYdyz9Y7cvfUOrJzxPQDRpiaqR45ASEm8u5e+ViXkV9TXKV5faMSWtxRporOILAtd11ny/r+Y/dxLCN1g1JZbs+l5Z4MQ1Iwfi0CSTiXpX77C65/rhjPr5dfQhEayr4+J++7DLjdez+Fvv8LGp59EoKKCBW++wfPHn4iZSCqkHcLi85QApklw3HjG3HY7I+66HdFYh9XdrahnUShcTx5rLpWNTADClohgiMTypfS//LJ6/t9EXX5yZBG6jm3ZxN55By0UUD5H+U/5SG/W5eLsqK6r5Hd9PdSdcy7jXnyBis0397FcRbrmIInQNHTDoG329zx/6lk8sPfBTH/2OTqXLmfG868AUNnUxFp77Eo6FkPD5rsn/u4VM27HHTCCBsFIBQvfeIt//O4Svn3lGToWLaJy1CiSPb0AGMEgtcOHg4R4rJ/OxYsBaNpgClbaxAgFWfze+4DSWNmmqdLJWoo1cm0StmnywZ+uxbZMAsEwqUSCNy65nLkvvqKCy0JBrHSaWKtCPNfg2btwIcs/+5xwKEikro6Njj4SadvUTBjPLrffyJjddyYQijL/3feY98prjhPpEBefjzWzTYvaAw9mwosvEdltZ9Lt7WpjG2KaJFHgR8aEIyFo0PvWO179/w74aZHFUbmmlyzF/OEHtFAY7BxSSw5Fcb/m443Hz2pGAAYSgM6Im29j2O9/p07GclPxlBo8B0niK1t57/d/4P5d9+Lrhx9BJuPUrbEm+997O1ude5pnEd/khOOIhIKEQyEWv/MefYuXADBs4w2pHT0SO5nECARYY8fd2PvK6zjp3Tc56+vPmbDTtl4ZVePGkLYszHSKHkcjNmnP3QlURjECQRZ/9gX/uvavCoEDAXRDySD9y5YrI6WuM+3O+1jyzvtUhEMkujpY+tnHvH/VlTx1xFF8dvtdhCsrkZZJ/4rlQGa3XfjGW9jt3WCarLHnHjStsxZSSsxUCqRk8hEHY9oWWkBj4bvvZ4+V401t+z4yJ0lh7tgKXSF8cPQYJjz6GI2/uQhrIIZIJhWVEdKRUvzKnOz5yloPIvuiFIq66KEQsZkzMbt6lZz4b2DFflptmNOB1MKF2L29aBVhFXCUBQUMWoWfUN8DOnZ3D4Ex4xlxx21ENp2aOaOkDMuuTCWZ/vBjfHLTLbT9sACjsopwZRVGZZTjXnyahnGjnaZLbNtm5GabMmHbrVjwwQf09vUx++XX2OyMU4g2NDBiow3pfeVV0qbJlEMPYZMzT8nqujt/dWtMwJKKI+9crDRiDWuvxdRTf8GbV/6JyuYRvPOna1j02RdM2mE7sG1WfvU1Sz/7ip/9603M1lY+uuZ6wpEQaTPNxif9gnQsRvuc7+lfvoJUXw+Byko03aBn4UJAeRRIabPg1TfQg0FMmWb9o47w+uYqIKRlIwwdISTx7k5nvIWnFcz1THChVI4wl8ogBCMu+g3RjTdm2fkXYq9sRa+pVTJr3szmFlLokuLPpQQRDJFqX05q/g8Ym2z8b9GK/aTI4op0ycWLsJNJ9Mqo0oJBkcEoBUJpvLq6CE/dlBH33E1w9Ogy3R9US9IDAzxxxLEseeddTCkJVkaVe4cQ9LevZOU3X1M/ZqQS+A3dU9Wud8wRzHv7bbRQiBnPPsvUk36OHgwyboft+f75F9CMAAveeZepp52IbSuNmj8gq27SJPRgEJlO0Ltc7fy2ZbLtby+mq6Odzx94EA2dmc+/yIxnnkVgA2kqAjXElizivSuupHfpQnTdYMJBB7P3nbcAYMYTxFpaWP7ll3zw60vQ+vrpWbDIa3fHnDm0fDENLaBRM3IM47bbBnDYPWdxtX493RulQLRSjZZtqfbaNt+/+g+W/esTkr29hGprGLXFJkzafReMcKSgp4AHmpNK1jSp3m0Pgi+uw9IzTif56acYDQ0qh0CWIWawnM9kZFmB8jNLpkjNnUuFiyw/Mfxb7CzpxYtxkyQ63gwO5BsZc8EVqDXdwGrvoGrfvRl+6y2IqupBEcVVB7vDGIhEaFpvHeb8803W2H03dj7vbL546FG+euzvGJEg71/7F9bcbTe0YAB8u+/EPXcnOmok8c4uVnz1Fcs+/4KxW2/FyK03x6ishGSKrnk/YMaTBCorHHedTEdrxo/HFpBOpjD7e72eaYEAB95+C+vttw8znn2Bjjk/EO/pQw8EqBsxgknbbY09ECNSWcP4nXehbe5ctvnVuUjbxjJNjEiYmgnjqRo3hs+v/Qv97e3EW9tIdHYTaaznh+dewuzpRgATtt2WUE2VkukcRE739zP/7XcIRSpIxnppXHttAPRgkJ7583n29F+y+L0PMaRwnB7TBEMRGqeszbaXXMg6Bx2oDLxasRlUsoxtmoTHj2PiM8+w9NcX0vPYEwTqarMy0IjM10EWhGM7QiBsm8T8+SUeXr3wkyKLdxrvgoVqQH2a4RxWNPNOoXJ0nXR7BzU/O54RV18NwYCKiCyGKG40Zc59KSXbX/BLxm6+BeseciCagPDI0Xz36j8wgKVffMn0R55gk5N+pizbuo5lWkTq6piw+65Mv/9BhKEx+6nnGLvN1tSvtRY1EybRNWs2fcuX0b1gIU1T1nMMfCA0ZT+oGjuaQ++/h0hjPQ0TxmXYICmxpWStvfZkrb32xBwYIBVPogcMQtWZg5T23WorLMtioK2dymHNAOiBgOfICSCqosR7OtAW2PS3tBCpr+OHZ19QDpa2zZQTjs/sUkIl955239/omjWXcG01QkaZtMtOAMRaWnji4KNo+W4mlY0NxHv6qJkwgZrGerq+n0vrF9N46rBj2PXaK9nqV+dlO3kWmT/bshCRCGNvvpVlw0fQ8dcbCdTUeIu/6OQXKs/5q+k6qYULnB8/vRXkp61B07AtG2tFi0pa4E5s2RRT7Uxmezs1p5/GiL/cAAHDcdUuEv/hOEVquk7H7Ll8ff+DfHXP/cQ6OhFCEG0exuRDD0SghNzmddZki9NPIdHZRbgyyoe33Ea8q8cTGt01sNHxxxIKh6kIV/DDG28SW9lOIBymef116e5vI2mZ9DuaqOy4eTAqKph8yAFM3GE7asaO9XVPOWPapollWegVFVQ01BGqrsJ21LG2bXuasarhw3KGR+C640w97TQ2Pu0s6jfZmPRAjLkvvcyyzz4iGAqhR6PMf/s9ur6f48kT3z7+JP+69i9EGxuIdbQzaZ99aJoyGaTkrUt+S9us2dQ2N9PT0cHGZ57CCe++zrFvvcphLz5N8zbbYOgB3rn0j/zw2hvKPmPlJgjJaapjQJSWxahLLmXYlVeQHugHWUJzWQqkRAsESS1YpKz7zubzU8JP53XsOCmmW1tZuPuemF3tEAwqPTnuJpdNXzK/HNuurmO1d1B71lkM++PvBz1tynXUtBIJPvjDlUx/5AkGentJxZM0rLs2Rzz+IE3rrYuVSqEFAkjHIyTe1cndW26P2dNLvKeHPW+4ls3OOs2jLq5j39/3PZDlH39KMtbH7n+5gU3OPp2F775H27x5TNppZ2pGj1IsXAGwLSsrx1jRMXMh9xmHnSz2rnvdzQew/ItpfHLNdSz/8CPSvX3IpEX1qNHUT1mXVDJF67czMcIBBnp6qBg9kmNfeZG6CeNY+Pa7PH3IkYSqquhubWWby37Nzr+9VPXBcb7snD+f+3feg/TKDsbvtAtHvfR3ZU4sR8B2jaWGQdffn2T5heejG0HHFFCmytqRt2zLxKhrZNI/Xkdvbsp4Zv9E8NNRFscKbi5aiNXRgQgEcoKGsiEbUUAYOnZ7FzVnnKkQxd25igyG7Xo0z53LU/sdyEfX3UBPawtmMklVXQ2dM2fy3Mmnk+qPoQVcmUQtgIqGBrb55TlYXT1URaNMv/tekr19ysHQcVXXdI2NTvgZyfgAo7bZhvoJ45FSMn7HHdjspBOpnzQBPRQsOhyuh0BZiOL+zkGeUqyObVme14AwDEZvuQWHPvc0h7/1BlMvvpCGTTYg3tPB/NdfZck772LH+rB7+hiz+eYc8dQT1E0YB8A39z9IAEj29TJp3z3Z+beXYjm2HyEElmlSP3EiwzaYjK0JOhfMo7+lVbm4lOkug65jp03qDj+C0bfeDqk0wjI9GbGs5S4lwghgdrSR/OGHwmO4muGnk1mchse/+QY7FkOP1Cv2yYMi1EEIRR3aO6k57liGX/kHTw1ZatfQDYMFL73Mq7+6kPYfFhAaMYLtzz6HcCTI+1ddQ6i6ihXTvmThu++z1r57YVk2mi7QNIFt22z0i5/x7UMP0z9rLu2zv2fmI4+x8RmnetRFSsnEvffgqDdeY+z22zqhN9Jzdx80TsSdSDeIDR+VyEkT5PZS5r7nUFZX6eEfE+HmLXCetx2X+eFT1mf4lPVJXXA+Kz79jPaZszBjCTTDoHG9dRm3286e5i/R20vrN98ggwGkZbHd+b/y6nNlLE3XMRNxYh1diIBBKpUkHY9n+ljmzi4M5Wxas9/+YEuWn3YaWrQCNJFRkAxWhqZhJRIkp39NxVZbeoF4PxX8dMjiZEHsf+tdFTqb1f/cLmVEfmEEsDraqdxnb4b95doMaS3GekkJaZOv77yXf17+e1KmRdOmm7LvrbcwdvONAQjXVPHyGeciLUlfS6uz6DIaK2lZBCJhtv7Nhbx0+LFEq6v57OY7WeugA6kY3uwtgkBlJeN32FYhiWV7lKKgvcGlDO4CckKoi/UeL+WrBdJWYWsVEcddRBRERgneQavCGXM/8oCiOFJKgtEo43beiXE775RXhpU20QMGsbY2kj19pJMpmjdYn5GbTM2yybixND+89z6t380gEo4QiISI1NV6YzkUEIahEOaAA7BjAyz/1XkYlZXIMlxu3I1BGDqxt9+h7tRTVy2kegjw0yCLY9AamDWbxIcfoldVYkuXqoiCREUiEYEAVncPoc22YMTNNysh3o1iLAAZT9z5vH/ZH6AijGYNUDdiBGM33xgzHkcPhRizycboGui1NYzddhs1qKaFRNkJNF3Htm3W2n9fRm2/NfPffhtjIE7L518waf99FAvi+kC5UZKF2uTu/r4YGO9WKoXZ3UV6wQJSCxZgrmghsXARsrcXu7sTe2AAO55AJtPYlo0tJIHqaggFIRhAq6wkNGosRnMToTUmEZo4AWPsWPSa2uwcZjnn1bsUx3Wtl77YGLcfrurXPd7PtkwqGuvRQ8EMZXXm1Eomee/P1xLQNFLxAcauuTbh3LDnIYCLMHVHH0W6t5eVl15KoKEOaWVUyp5GOReBLAs9UkHs889ITJ9OeMMNPQXPTwE/CbK4sRFd996H7O+DBh8LVhhXlDDf348+cQKj7rsbraameHCPE++BUDtn7brrsN21f+Llc35JVVMzc197nZfOPI/9bvsrdirFe1dejWXb1NTXs/gdReka1pzkFWf73PO3/M35WJEwO192GaO22FQtAnfhF5Ib/OG6jlwCYHZ2kJg5m8Tnn5GaO4/0gh+wVq7E7ujC7O93JlV4VAddZcp3vYsBzKVLwcm0L22bmGUjhGqnURHFGD4cbfx4wptuQsVmmxLZcCP0urqMH6ppqva6iOOjbllj78xZ9ajRhEcMJ9bZTdv384i3txFpbMIyTXTHkv/6Jb+l5fNpRBsb6G9vY+Pjj3EHsaQq3x2/QqAQxqT5tFMxl6+g67ZbMBoaMokL3UkvBLqG2d9H9733MPzW235SuWX1a8OcZBSxL75k8YEHKudJyKiN/QZJ1yjl7PToGmOef46KKRuUcKcQWQjn7paarvPGxZfx6fU3UjN8OP09fWx/+cWsmD6dGY89TSRaAQLS8Tih+iYm7b0b6x9+MBN23IFAKJQRTn2W95ICq4skvjRO6fY2+j94n/6332Hg009JL1uBSCZAaGihgFIs6IbDVvpCZ6XjWi1FxtPY7Wumy8rGrYEmpUruYKaxU6Y6LSAcJDB2PNHNNqNyj12JbrMtem2dN0aD5RlwNYnfPvUML/zsRAKhCGN32YE9r76CujXWJNbSwvtXXs3XDz5KRWMD3cuXMuXIwzn4b/d51LZgubb0MtgMNp7uOCw7+WT6XnwJraFeJVD0BsQ/NnhjgxDYySRjHniAql13U4F3P0F+5dWLLLYFuoEdi7Hw4INJf/cduEc/kyN8uesDtfNZ3d2Muv02ag4/vGhnvTVl27z5q/OZ8vPjGTF1qmeV1jSNp448hjkvvkLlsEb6O7oUvx6JUDl8OF0LFmMN9BM2AkjTRkSCBJub2fy8c9jqnDNV6lJHcPdb8LP7aDu8smqfFesn9sH79L7+Gv0ffIi5fJmiUqGwc3Kx8JBA+OWYIubqciZDuG9pIkOdpMROqYz+UtcIjh9P5U67UHvwIUSmTvXKLpWDy13YH1x7Pe/+/kqEbVM7ejQjJk+ma/4CehcvIVxbQ0drK6O33oIjn3qccH19UVbZRcD0QAxsiRGNlo7IdMqR3d0sPvRQkrNnoUWjSo7zjY3MHTtNw06l0BsbGP/004QmTvpJEGa1IYs7MHYqxdKTT6b/9dfRamsUxSCjEs684HRVNzDb2qk7+0xGXHFFcYriaJ50w+Af5/6KD2/+K/Vrr8vP33yD2tGjvcFJdHfz8L770fXdLMJ19aT7etnz9ttY54B9Wf7Fl8x6+hl+ePk1YgsWIG2LNfc/mB2v/xO1kyaUtGO4EXlu21LLltLz1FN0PfcM8dnfI6REr4iiOepjdVhRIYSQWbuk3yNKuo8ONiPC/zXzghvfA2AnksjYAEa0kugWm1FzzDFU7bEnIhwuiTSuHPjlw4/y9u/+SP/CRQhMQoEKgsEAQtNY48D92eWGa6hoaizqH2abJnogQHzZMl469gSikyawz713DX5Iq20hdIPE7NksPuQQ6O9Xx2dIOxMw5h9Wx7dMGhoyFkcfN5ZxjzxMeNIaqq7VmJzvxyOLa4cwDMzOTpacfjqxt97CaKj3EAX8yOI7DlvXsXu7CW21DWMff9w5m52CnXMH/8Nrr+edy/6AiWCTs85kr6v+4B0lJx1kap83jwf33hfR3Qu2ZPz++3LQvXd5kxrv7GbOC8+T6Btgi3POUN0oZtDyGdEAkjO+peuhh+h+9TXSLSsQoZA6ykGInGz0fiiELMUe8WGLLII5vmdz+XnvmyO8S8tCDgwg0xaRKVOoP/UUag46EBEKKwpagCq4CNOzbDmzn3uBtu9mIeIJItXVTNpvL8bt7iT6LuIXZpsWesBg5bSvePlnJ7Fy8WIs22b7S3/DdhdfmDH2FgEvXdY/3mD5z45Dj1Yqx08XXXxuU1kQMLD7+hFNzYy+5Saqd9ixaB9XBX4cslgWODx77MMPWH7Rr0l9Pxe9rg5p+5N053uUCk2oRGrRSsa9/CKBCROLCvS2ZaEbBjP+9jCvnvkr+lNJxm+/Pce//jyaoWdRA9u00AydBR9+yOP7HUplOEJX6wqmnnUW+910nZezywU3i2QhiuJOGkB6zhy677qDnueeIR1LIKJRRNBQSGYVWKx5kL3whXQ3xTJ3Pen7IjJlidxH8hrgxPZLgXRycIU33ICmM86k+qADVRLwAnYsf99zwQ0OK6zskGiGztwXX+Llk8/CSsQhGMSKJzGlzQEP38f6Bx9Y2mMZwDIRRoD2G66n7co/ozc1evkLyJLrcvuqYyeS2NKi6dzzaP7VeQgjsFqozKohiy9rodXdRfvNN9N1991YNsqwZFpKKPXk0/wGKu1XL6NuuoXqww4r6kHs7nJzn3+Fl044GVtKqieM56jnn6RyzGiEpvHpPffww2dfcOitNxMIBBVyBQw+vud+/nHWr6hvqKe9pYXdb7iGbX95FpZleUu34A7nUBmhaVgd7fTecw899z9AuqsTWVOD1N0zTRxEy9npCg9oxtQo3IdEniRXHGTOj4zsn/dMwfod9yMhhDprJpWicrttaDz/fCLbbqe6ncMiSVt6ka3q3EjH27eQL5fjjqNpGp/deDNvXXo5gUiEVCxG5ahR1I0Zw8IPP6KiuYnjXnuR5inrD4Iw0pEhBUuOPJLYe+8haqodO9QgS1bXEFIiu3uo3H5bmn57GeGpmxXs41Bg6LTJsTlouk7fay+zaP99ab/1VmQ4glYRyUEUTxT1gQRdx+rpoXq//RSiWGZhAdFBlEX/fJPXzjgHGQoi02l2/d1vqBo3FqFpfP3o47xx0WV8fO/dvH3HXR5bYKZSbHXyL9jiN7+iu7MNHZvl07/Flir3ltuHvDqd/glNo/upJ1i8zz6033ADadOEunpvDNSE+Q5zzZIjcj+CvMdWBUd8yR3KKsJfoRBKBW3ZiIoIWn0t/Z9/xuKjjmbF+edhrlimKInLtoCXZcZ11cnNOOO1ys4gyusX/JqXfvVrjKoq4n29RCeM56jnn+aIF5+hfrONSaxo5Z3f/A4zkRgk3j9j+xl27TWI+lpEOu0srAI9d9l3QWYzb2pk4LPPWXLEUay87DKslS2qj0XZ5UGGs2zK4ts5kkuW0HbNn+l95jmEEVSpjUw3mAdH1ZnpUJYIq2lqwoIBJrzyMsFJaxZlv1xkmfHgQ7x6+rkEamqQtk24rpaDH/kbsd4eHj/4GFKJGI2bbcJRDz5A/fgxGfcMB579+UnUjR7DTlderuwmhYw9PhYivWQJK/9wOX2vvooWDEM45Bgxiw2Vjy0oKGcUWtbuO6WXvHTfLuBkmaMacL469TtY7LXM/7r7n6HceOzuXowxo2i+8ALqjlR2k3JzCrvGSgG8dMbZfHLnXdQOG0F/WxvjdtmJwx68n6oRKiv+oi++4In9DkH0D7DvPXew3pGHDr7TO5Gc7X97gJUXXoRWW+ckZszZnXK+u3MsdHXWjNXdR2DCOJp+fSF1Bx+m2j7EJH3lIYtj9RVC0PW3h1h5/XWYK1vRa6vVHGal7vRtZrkdQYIRwOzsYtjll9N45plFSbFf4NY0jW8eeIh/nnsBWiRC2kwRqqvD1nT6Fy6lfq2JHPf6S1SPHul43do8e/Y5bHLkUUzYYVusVBo9mG3vyQI7k9G/+9ln6fjTlaRbWtCqq53juMvzhi0oMxTDBRcLCqzzws9n7ECDFZ3XJhTa5BbhyUyGgZ1MIuNxavbemxF/+APGmLGDL2RHvW7H47x++tl89tBjhBrq6W9fzsZHH8eB996FEQl7WS+lEDy89wEsfesdJh95BAc+dO/gsovrSycli488koEPPkRUVmTWXC47KvwXfN81DSuewEomqD38MEZd8Sf02tohsWWDo5XD68pUiiWnncHS887D6u9Fq61FWnZekjNR9AegG1ixPqJbbkXDySerY7AL6vsVRXG9fm3LYoMTjueAh+9DaBIRDJJOJkl0djJik4044Z+vUj16JFY6jZ1O8dQppzHtrvt48cTT6F2yDC0YUMkjCmQtcdkuu6+PFRf+ipazzsTs6kJUVWObFtKSg+7+Wd0tsMv5f4jc53z8mqcILFRdAVav3DZ5NTs/FDOXuSNNE2EY6LU19L7yCgv3P4D+V1/JsGXFNhgh6Fu8mOcPO5qvH3+KcH0dve0tbHHGWRzy0APokZCXbkpKiea6AekGvUuXq3RVzjk5xTugeBTNMGi+/LdOHgc7azwKI0oGpC2RaQsRDBKorqHn0SdYsP/+JOfOUbkKymSuSiOLq3UYiLPkhJPoefQxpRLWDKSZzhnDnAqFbxU4QoxEogkY/puLnFOlJLnaCRdROn9YwEBHp+KTHdfwNQ7Yj0MefxDDEJipFFokSG9PB0tnfgcoz+OnTzmLbx97imBNHdtdfBGVI4crhBAFbAqOxifx/WwWHXwQ3fc/iKiqQhqqf0jX4XKI/G0WRmQJDmRym+Tez1rWBbChGBaVBul9/H0Q2TdB8flpE622hmRnO4tOPJnWP/0pc2ZLzkbjahD7ly9n0YcfEa6pQSbj7H/j9ex/281IpJNnWcNKp9F0nWVffs2yL75GD4ew7HROaSXASRFVMWVDao89Bqu3J9vgWNTR1t9BqdIFWyZGUz3JWbNZeOihJOfMUR4GZSBMGcgiWH7+hfS/9BLGsGbFy7rnqWf1M7uxucsBw8Du6aX2kMMJb71NxjnRX52DKMu//Ir7dtyN+3bYk3n/fBtPM5VOM2bHnTjssUcwgkGSAwkGOjt49NAjmPHsc7x80SV8+/jfEcCO553L1BOP997NW2eObajnxRdZfPDBpGfMQGtsUNqWAmxXuejiHJaQNx6Fnhz8/tCRww9lo7hnDUXtwIEgoiJM69XXsPhnP8Pu61Pyiw9hhKZhWxYjttyS3W+8nnR3NxId08nc4rLD0rYxgkF6li/nudPPxk4nSKdTVI0fp0IDXLX1IODa0RrPPgdj/ATsRBy0Ar56/p+F9jkJMpVGq6kmtXwFi449FnPFcuUJMUi+tOLI4jgQtt1zN12PPoI2rAnbl/E+Wx2cszxy+64JSKUIDh9Gw/nnF4w7cN0g4p2dPH/iaQx0dNHx/TxWTv/OGxDNMLDSaUZvty3HPf8UNc1NpJIpwpWVPHPSqXx1/4NYtsWUIw9jp9/9xlMR51TkafTab7mF5SefjBwYgMoqtREUBeHbwQp8vPiSzM+ChGPQdSEy4+n9579Touwyyi30YFYNArVobIkxrJneF15g4RFHYrW0qs3NF5MkNA3LNJn8s+PY4sLzSMUHePuPV/PRrbep3GcBA03X+eH993nggENYOXMmeiRCSko2Ou5YVYjLvThe0cWbL0BKjOZmmn55HvZAAt0XLOYfflVgkTFwyLY0TfTaWpIzZ7Py91eU5TFdWMB3ECW1YgULdtpFHXGt64qieCTDz0DnWFK8RjuTHjCwOjpo/M1FNP7qwoKaFpclevuSy/n0LzdhRCvZ945bWPfwg/KEQNdI2TNvLk/8/ESWT59JzbAmule0MHGn7Tn2qSfU6VSQMwhqt9MMg5V//QttV/4Jo75eCbq2hZeWpwALlDeWstBz+TDo7l7W9j8ENrDAo8V0DgU2XeeLI6dINXdmTy/R9aYw9uEHMMaMyZ4/RwDXNI3nTzmNb+57iGBNFWvsuSvVEyayfMZsFn74MUibQEUFfUuXssMFF7LXdVd6SQghY+8aNNrSUfsuOvwwEp98glZV5WTx8fWggL3JX67y01NPSEDE4kx49WXCm22m5PAi2WoKUha34O4n/47Z2oIIBQHbw8qsvUjk0hg8I51AUQuZSGKMHk3tcT/PxFPkDIBmGAy0tjHvmefQbJPJB+7PuocfhJVO52lLNF3Hsixq1liT4595inX22JXuJUuYsO1WHPHg/RiRCG68Rla/HERpu+tu2q6+FsM9r9E9xDVv43XJRIFBKjie+bv3kBgpP/EqWm62DJTX6FJEL4fi5e7GXkm+rVqaJkZdDcnZ37L0hBOwVrYqecGfD0EIpIT9br2ZzU45CZFIMueJp/nyuhtpffc9ogGlYOlpWcFW55zNnlf9Ecs0HcdNZcdZ/PEnvHv5H1W+ZShuB3GcWJsuvBAtGEQAGgItd8MuOcyZTgtdx0zG6XnuWaf44shaEFlc/rD/rTcRoWA+eSy2ARcqS9ew+/qoOepojKamgrpt22ng8s8+o2fFMoxoBesec2RJD1XXSTEybBiHP/YgO/zqPA664w4iDQ2Fj4lzKFfbffex8reXoVVXYTsWaun2JmucCi34UvzOkNCiYElDL8EF6bs2tFIKlSb8EywEpE1ETQ3xGd+x/BfHY3e0+WQYV26QaKEQe915Cwc/8QhrHXwgdePHEgmH0TTBiPWncMTf7uOAm65HYntsWuv0b3nhxNN4bL+D+ecfr2Le628o5CvGkjnZaSq22pqq3XaDvn7wko8X77t/U8/8FWBLRDhM/yefOFrB4tq5fOcfhwVLtrSQXDAfQiFP0M8e3FK8r3tBw06n0EYMp+aoo0u7ZwO9y5ZimiahSJhwbXXBej1t2YJFvHbBZex46QWM3nwTdrnqCqf5dlFEaX/2WZZecjHBqkrlxmHLIrt4ISh1vRw2qRAfl6EieaySKL65Dt6GISJMrr9Ogfpl2kRUV9P7+Vfw818w6tFHEFXVeClyHEdSG1jzgP1Y84D96F+ylIEVKzBqaqidNAnNWdSaYdD6zbd8cuudzHrueZKxGKGaWoJVUT78y02stfceXlKRYs6tAqg94wxi77zt+fcVGpXsbqnTYBAgXKOWlIhAkHRrK2Z7J4HhzUVns6iAb3d2qijHXINNLs9VCjQNq6+fqr33Jjh61KAhn3ooiKbppOIJZr/0kpPRPdsXyDVQdcyZx9wXn+XxQ46ie+FiL89WPuvleLB+8glLzz2XQDii1LeWLw5/kP5k7PPux7+D+1STg3iHlaqmKFdXFpSJVUUJj/D9X7x0mU6j19bQ98H7LD3zTEfO89lhRCYPmm3bVI4ZTfPmm1G/9loeovQsXsyr557P/bvtw/QHH8aSElvTGOjooMII0PrFF8x+4eXS2fydpH2RjadSsddeWH29oGtFRyGbWRXZF0G9OxDD7u52Olq4pLyV6z5m9fYhU+nM4vYVnktVXGqdOxnSMhFVVdQde1xpedhZ4HVrr40wdMJVNXx++93Mff11jGAQKYTK4p52kEEIvnrgYdB16tdZm0on+VyeJdjhb1PLl7L4jNPRbOUljV1AS1a4YaVaXQRK7XH59LmwLOJ7dtW4qsJV5C4UkfOgKN5S71rKRG9spO/5F2j97W+93ARZTzm2Mdu2nU0JUrEYH15/Aw/suDtf3H0vupREamrRhc7YTTfliEfuZ8LuO2Mnk0y77XbMeMIzShfrFkDdGWdCRVTJnYONlaAgoQKVtGSwRIFFt3lpGCqYKJeVp8BycDDF23sFoOuY/f1UbLM14fXXL+mHozk86ujNN2f0lpuT7u9HCwT4+89P4ZM770GmU4rHDQbQdJ33r7qeea//A00LsMXPj8NwDlbNGgl3xzNNFp1zHtbSpWjRqJO7TOSsRFF8oEuyaUNDuZJPF7npf2/VJZLsErPKyUWYInW71FXihEE0N9F2++10PvSIOnmtgG1KAFY6xcznXuT+nffgrcuuwBxIEI5WkuzrJxnrp2mttfnF2/9g8uGHseVFFxJqbmbF59OY8+zznuxcEBw7T2Td9ajef3/snl4vo9DgI5ADloVeEUGvqizygFNlsYICTQ0Y0SrPi3jwGvPBRlJz2GGDM+CO+7dmGOx63TUEa2uwk0lCusHr513Eg7vszfu/v4LPbr6Nvx96DB9efQN2IsHaO+7Ieocd6GVK9IN7PF7rjTcy8NZbGHV1Tl/UmY2KZVBLx7+bZqjkj1+WxSGXdXNZmSJjJAZD0SJoVAARMv8XMZ2KfERyn/M2QgBbotXWsuJ3vyM+Y6aXe8zroaNkWfD22zx/5DH0zp1HtK6GWEcbVRPGs+W5Z2IHQiz++mu+f/UfSMti9NSN2Pi4Y7BTJtNvv4dUV4/jDjMIdTnpJGRFFGnaOXcGB+G0VauqQq+vL/l+/lYvFIUI1DcQqFcJA/KVw1mPZ98TqLSt8TjBddalcudds3JPFW20s1M0T1mfgx/9G0ZlJf3tHVTW1ND2zQz+dfVfeOuCS5j/ymuYAwM0TJjAXrf9RR1umisIOqrovk8+of2GGwnU14JpojntzbOy+5HGt0CyV02xfb0UScp9Z6iuM6Lg11K1ZlWd83QxJMsy5mWxY7mURv2WbmyLYUAqzrLzz8fOcbl3qcL4HXZg7LbKY8O2bba+8Hx+9tqL7Hb1lYzaYjMSAz18dOOtqi4p2frCX1K75kRWzl1A17x5XhxNQXAiQSPrTaZypx2RvX3qaESvHyLfWOkfEddzwTTRqmvRImG/M0N+dfnjpxqtV1WhNzYgTdN3lrmvoiIg3U4k4tQfdRR61OUnB8d2F2HGbLsNx7/+MmsfuB+JdIpkKoktwNIFBIKss+deHP3Kc9SsOSlfTSyV46M1MEDLpb9DWCYI3Wf78e+tWf/lt6eM/g4yElm//SqC8tEmB2HK4MtXCYoRprx5czdEoTSn1VUkPv+MlVdfk+1D5sgsgWiUzc4/l2QqiWXbrH/ogVQ0NiBtmx0uOo9IVQ3LP/mMmc+9CEIlbt/5+j9zxJsvMWyzTbKOWi8ELiLVHnMcCN1HoXO8RIr1TxPYqSTBtdfxjl4sNogF40alk84ouMaa9H30MYZWmbFJ5lWcS2k07FSS0Jgx1B14kOrMUGIGHKe5xrXX5KgnH2HljJks+2o6vctXEAiFGLfJJozadkuAwvYUh6qsvO0OUp99hj6sUR2cIwpY4UsgSuHeFYJSSz6j1pC5l92vfkpWbs0uT1TmK6uEP37O2Vef+uqjO2kTvb6OzrvuoGrnHYhuv6Pyr9Od5IWWxVp77M7o7bdl3hv/4J0//ImjnlVnc66xy06ste/efPn4w8x/7z0mH3oglmmy9j77AhQ2YOc208mxXLn9doSmbkzym6/QKqOOY6Q7/kUikQSe9jQ8ZX2nzuLjVTjI2hml0OTJSNNydNIF68q/JjTsWL8yQg4bNni8QqEynEEGQfPk9WievF7WfTcpXl65rifA99/Tedut6HUqDLW4r13mm8y7srpAFkWUQpeLj3S+mrv8oztK6iJL1VKwsrw9RwjsgEHbpb+l4tVXIRr1WGNXFt3+gvNZ8tGnLH7vIxa+/T4TdtsJKSU7XHQ+I7fckm1OPkHJnt7cU966EUqTpQUD1BxyCCs+/xStqtLXkwzCFOyptNFCYSomr+/cKT4KhS34zuoKrrcuekXEF9yVYf4KkWiBxLYtjHCEmoMOyTy3CuCmFXWzw7sfN5t7sYG0bZu2yy/H7u9Xhx65jXCoiEdMVpsAX7qcQddzDj8mC3wr9orvhLki8lUpWauMdmVBgTJ9xkg9GiU+axZdN97oJREHvMW/5m67sO5+e2MPDPDpjTeT7o8BMGqjDdnxnDMIRCLeuhNuWECZ4D5bvd8+BEaOgmTSJ5MW47/AdefRamsJTJiorpWotoguV10OrzcZfdhwdWCmyAh+ucKfuiaVcSfWT8XGUwlP3Xi15J11Y7/9seAFwdF+dT39LANvvoVeV+s4xUFWRFWZ62YoYnihRaniVgpUWJAVLFa3X1vms/8VFXqGihSZsgt5WxYtzbdveuvOtBB1NXTcfz/JmTOy7S8O4mx95ulgaKyY9h0tX3+r4pTSpuMn9iPOsnfscIHhw6jee0/s2ADCyF0nBRhdoZLzGWNGEhjWPCjbV3jlOeTTqK0hNHa8cnXQtQy2+tQL3mBJVTmpNJW77q6E/B8zAEMBp5NmRyed11+HVhHx2V18An0ZwnFm3cgCnG6OqjdPSyPz/i+IdoU2vZzHJJkqHAfg1Qwy608xyKNPWfOu1oIXQqGp4yhW/uX6rIKFEyk5asvN2f6Pv+fI155j9NabO/Kl7h1Y+2PAfbvmsEMRFVGVWLxkUBgeZQmPHoUIBgcNACu+7VsWAkF4zUkq32wh/Vtua9NpAnUNVO61p9OW1S8BFAJXY9J+/TWkF/yADIc9LYma5FVvhyy06IsKGOXJBUUZBFnk+08FRfC48A/yqEnWLekohqqq6H3tNXrfflshSVbAmM62F5zLiI3XL5l3eZXAEfTDG21MZKMNkPG4Z6QsOpSawLYlgZHqOPdCvohZjxe74a2HUSO8g3FK6aDRdOx4nNBGGxCYOGFoLFixOO9ywHG77/vgX3Q88BCiplalVnJmNYuvX0XIozAlyioVr++jcdnX/JeGaoopVtFg4koRpY16PWOJyicr2QX7m+1+kUDrX/+qUurmGKRtR+5c5fkuBY4fYOVee2InkqpxLt8qM6p7j6hKQNrotTVO00sP/qCrWUajZbRSkTw7maZy190QYogsWJE478GrlaAJrHiC1j9c4Qi9oiBLU7DNfhgEmYqKB3mLspg+KRcjClQ9KEKXIgUltn3/+87GJDTnECZdR2rqL5pOrgE6+18RPPQTX8vCqKgi8dnn9Lz4Up7Liigld7rg5vUaKkI5BvXo7ntg1NZhp9OKmZaKw5JOoJrH4qKCwPRwpKziy8juAgX8c/23QWhgpjHq6qjYYSen3eVv5XYsRmrZMjV5QyHNjvq467HHiX8xDa2qSh3FkPVQGeWJ7K9FN+MS72XuF8KiwfhXHyoVY7MLVFiQHYICy9tpnUQtVE3DHhjA7OzE7GjD6uwg3d6G2dWJTKU8R8iywEdSMl9ttECA7rvvRiaTWdqxcsBFqCGf5OVsuKEJEwlttglWLIbUtDyKIXNci0QiWV7xgz0gOzoUN1Vq7DQNayBGePNNCa2zVvksmHMI0PI//J5Zm29O65+vUufbl7OrOMbOdFc3nXfejVYZKUCZcrQQJe4NuikXhGKLd/BFXQpKsrsl2pHNGPnuuJcMHTs+AP29hNdbl/pjj2bEb3/LqL/ewLBLL6PmqCPQRw7D7uwGJxBKycgi65O1HxQC20ariBD/6iv6X3yxfK7BUcr0PP8iC3bcnb6HHsNLuF4muAdLRXfeCTudQorCS0lRF5UHOrV0ieqOKL0Kih5g4e4s6SVLnMTSxR7Ecce2iO68CwKyT8sq2iup0rj299P/4QfIZB9dr7xC06/OQwuHB2fjnMz2PY8+TvqHuegNdYoXFjlLJ5fHyaEiBTvkSB6D74U5AqFwBN280oay9n01l2hE8fLyaxMIpKFjdXYRXmc9ms8/n+ieuysNUA6YXZ30PvcCnX+5HtnVBVVVWdlupFOeqiI/wZJ0/hO2hGCArrvuonL//SAY8rSWhZstPU/i9lvvYODTTxFIKo84BAr5/xUBd91Gt94WraZWZUoVmi/uPtNWpEQLBkjOnYedSiG8gLPCZRc5rNFZyIkEiRkzEKEwWckqch+3LERVNRVbb5PV4JLgRLvFZ80kvXwZaDpVu+2CFg57hxOVehddx+rupuehhxAVYZWjipwm5hZRElH8b5deipkfBfmwUtXmlpBzpxBtGAL4NNtZlQcMzI5Oqg86hHEvvkDl/vtCUGWWt82076+FUVdP/S9OYMxzz2FMnoLs6S15TGDRtto2IlpB7Jvp9D333OAUwgnT0HWd0JabI2trSCxZRPKbb/OUBCXB0YoF116T0FprYw8k1VoqJMfaNiIcITFvLumFizwEKlp0oYvu6bf9H36EOX8+WjiMkHY2SfcVIZMJQuPGERw/3mEhBp9uV7Ub+/AjZF8fWihM9U47q5uDve6Q2q5HHiU5b45KSC79EyFyvmdYh8KEdmjLU+b+KKBEETm3B1NzqR27ALoUaFousSzVQmEY2O3t1B15FKPuuA29plptRrYjG+iG769zAGs6TWjNtRj9yCME1lkLGYs5EbOqD4OOlit32TZ2MEDbPfcgk2knQ1DxMXDzKtTsqo4bT8f66Hv7HdWjIcg8bnRsdIstkclEgfWYWQXCcDbdF1/CtS8Wg6LuLhLoefBhL1VmoSIEoOkCO5UiMnmyco2xihwKlFezhpQ28Y8+Qlg24REjiWywoVN/6dy36DpmXx/djz6GCFcUDDzy4ccQcWEQ3a2niRQFjJZ5TfBe8ONU9idbLVAS88oGtaA1w8Bu66T2Zz9n5E1/VepTl0UuVqYQ3gnCgeYmmm+6GYJhhHc2ig/5C1LSTK+xbPSKKANfT1eascGoi2MXiW64IZHRI5GWReytNyGdXqVjIqLbbA16oKQSUVoSLVJB98MPkW5pVSJHEeNk/qp0EtD1vvAisX/+A726apAwXEUiQxtupCqXZQhjTp6p9LKlpGbMQkhBePIUjLrawTMUOlSl5+WXSc+Zi6gIF+xc8b2kYIPIXaRlySuy+JN+RCijpLzW+Swd+G8XCt8G57xKVzUM6hTf1jaqfv4zhl17rc+DuDzME4aBTJtEN9iQyiMOx+rtUQcfZfSuOe2n8O5k22hBg5777ob0INTFdYqsq6Vi882wpU1izlxSM2YPSdB3tWihyZPVqceuvSdTjQ9bbEQoTHrpYtquv86Jn8lOdO9CTk4ilU0+1dLCyj/8AREMUCh7pB+kZSEqKohsvInTkDJYMKfTiW9mYrZ1INCo2GprdW8wcus45vU89bQ6R7Dk82IVduWhgfT9737LvVYaCrCMpRpdiPBI3z1QCdjb26k8/nhGXHtNdo6voYAjK9QcejBEo8rYW/7L6o8t0SqixL6azsDHnwwufzj3KnbeEWHoJGN9xD791LlV5pg67FRwxAjC48ciEik830aR/RyAtC2M2lq6H3lMnZJsGE48fvZ4ZSGLm6qo7aqrSC1ZCpGIOgBH+uYoS3hUsSf6sGEEJkzwrg3aF+dv/KvpaMkkenU1FZtv7rR/cKqSmDWL5FdfokUrVN6vklK9c8XzEypH+VDi438m61nHl8zvzDUIR5fdPgrgSrbSIoeYgMQX1OZ8AgGsle1UH3QQo66/dtURBUATSCEIr7ueykSZTCE14XRR9VfmbBT5HVM7vZ2K0/PCC0Ue9L3ismKbbkawScUiDXz5+dD74ISGBNdYE5lOOWfIZA+yAJ86XKBFArT++iJSc+epbDR2dgILb2W7QlH3s8/R9+RTiiXy5/6VmT8u0kghkMkkxvgJ6vlSkTPZI4IEUjNnotk2gVGjCa655qAD4ikFPngP2ZdJ05RH/X1/yxGYsysp0Fz34y5Ot5u5zxZbBIMQv9Kkm6Lh+V43Xau8YWC3tlO13/6MuOU2ZesqU+VauG2K9RGRCMboUZkzHQsshoIcqXvfshEVFfR/8D5WT4+TyK4EK2bbGCNHEll7HZCSxKyZKmR4EAVBbtUA4fWnIOzMJpy9H/l+2U7+sO5uWs49Cxkf8CirC8450Mq/Kv7tN7RdehkiouwcIneW8r6qHFGh8ePUtXIO/XEMQWZfL4k5c5BAaO211Bnpg8grriV44P33IWA4GqSsJ/L+z/1aLvgRJJdCiJxnoDQ+DFZPYZCeWDS4vAUioGO3t1O1776MvPsORDCwek7pddhwLRJRWfEpQHBzOp9/XyJCYZILFxD/8iv1UCkPX8c4Gd1sMzQhSLS2kF40uGq3EOgTJyANR8h3DaoFqbhQ1Ki6mtgXX7DyogsdVx0/sriW8LY2lp90KlZvDzJg4B4uKgttGTJTvpSSwOgxOTdKgNPZ9MKFWCvbkbpGcO21s+4Ve09oGqmVrSRnzISwY/vx9TXrb6H2DhVyECR/0cryyy7yXEGq4RuHokorp1AhFetlr2yner99GXHvXYhQaLXEEgFKQ5U2SSxZgq2XELIHGQehCWQ6Reyddwd93O1zxdbboEWjJPtjxL6c5tRT3oC7lCQwfJgXwFh0w/EmVijPhbp6Oh5+nI7rrlfsmBO5qbnuAS0XX0Zq7lx1BJlpZpeR1z41w1LaSE3DaG4qqwOqr6qwgW++w+7rQ4TCRNZdt4wX1SQlZ87EbGtDBAzfbuEnrL4l7bW7HD4oGxUKX3XuSenZBFyEEd73InxTDqHLlOuOpf/dUuA+Z3usl9XaTsV++zPsrrshEFCTuzoQxVlgyfk/kJw7DxEKqsR5slCsTwERzT8VDpsT++wTFeqtl/AXc9oeWHtt9KYmLDNN7CuHIpXLUrrRvsOGqXxglkk5MqsAMC20hhparrma2DvvKs2gbaNphkHX40/Q98zTiIZ67HQZGg+P95BogSDBMWOc9pU/QdbChYoUV1QQnOgqB0owGw45THw9HTuVAq2A3n0VWfPcIvI2CPd0Y0NX/lKuw6cceqV5iFfkelHwiQvCMEi3dxDaZ29G3H2ncgtZXRQFvMjBzuefw+rsRBgBSm88BUBJ0WpDCYdJLJhPeuHi0oocR24JNjURnjgRTWjEv5+NjA0MatjMaj+g19ag1zXkZawstBFmRDAJQkfqGi2//6M6Cl0ItFRrKyuvvx5RVQnS9jQD/oYXWsRCANJGi0bQm5rLajzgaTvSc+eiaQJjeBPGmNHOuhtEXgHS8+YhND1fmSBKL7iscFz/S3kViUxhug4a2AMxzK5O0p2dylO3uxM7lVS7o3uWhyQ7sUcBwvJjcdk/wZoRwGrrILrH7oy57270YHj1URTwndGzjO5HH8Oorsk5aFcUpSJZbI0zlkKAFgxidXeRnD3bq6MYuJGu0fXWw5CQallBevmy8uUWRzgXoTCBxnrFLTkZVv1aMe8Q2pwJchPvxb6eRs/jf0doGsbKW27DWr4MvVplQsnqfMnpFSpRdGMjgfqG8jdZRwdudnRi2xZixCj0unq8bOzFwEGy5OLFKl/xELUi/u+FMnhk4Z0mkELD6u5BDwaJbrgB4Q02whg/DplMkpg/n9gnn5Ka/wN6MIgWrVSJNLL16mW1bzDIk5FwEKW9k8j2OzL67nvQQuEhH1NdEpyIQSEEK//4R1ixwjlw18prlMzapNwfMvNcDoXGtknMnkXVvnsVUNBkNQJQhkXN0BG9vaQXLVJa03KFfOdYcK25WdkDXcZX5DRNFGquULEpFWHan3ic6qOPwOh7+u9olZWOJoqiaY8gZ3lpytoarK93Us/4ai1agFIm2D09WN3dSF0QGqfOrZe2LHrikvueHIhhtbcrZMmRvgdfmqWUB5mmC01DWBZ2IknNvvtRd+qpRDbfJK9vVm8ffW/8k/ZbbiE1awZ6TW2OXt5VZYnM+hkK/sjCj2vBAGZbB+EttmT0Q/cjKqM/AaKA0DVa/vh7+p97XiFKoZOlRd6XnN9uJ0Tmqm6QcClLCbbdZemDa6xBMFKBGR8gOXcu0V13LXso3XOmtbo6bCR6WZu5+590OKcoAzNnEHvvX2iYaRVdmEdCi5Tj/2XbBOrrlWuzXdwr2d98AaTb20l1diA1CE4Yr+4MpgkDEkuXkWxZ6dSXOdddrcvyGJ28J3wygHuEOeEQI++4g5H33UNk801VpJ1pItNplaHTNNGqq6g99GDGv/IS1Ucdid3VlbH7yAIVuF9z2cE8PStF8VoYQez2DqJbb8WYRx9Cr65ZvayXiyiaRsvFF9F5862Impqi7h/gUulikEMXpUQEAqSXLnGCwkrLLQCBkaPQKqJI0yK9bPlQeuOBVltdtkksuw0o9xfLpP/td9Ayhh5RuhAfK+99kRZaZVX5tTvPWJ2dMKCMPnpdfel3wJtEq3Vl5nzLgoXnN0K4m5vMXcT+d5wbpokMBhl+771U7bevQhA34ZuuK4rmhOLieOfqlZWMvulmak/6BVZrG5pjcHUNmMpOI/Oi8/zjUQi82XC8ATQjgN3RSWSbbRn9yCPodXWrn6I46vmVl15M570PoDU2qtgkMqJr5iPyEMUvphSkOhJEIEBy+VLMlSsH9fdSAnoteq2SOVKLnSCtIfZZq6pS7P9QBEdXjJESzdBIfj8LLbuxZeRB8Q+ClIhIhfN7cGxxqYfV3Y1MJiGgYzQ0ZBdb6D3nr9m6UslVvlNqy2pqsWf9miUN0v0xmi6/nMott1LJFnS9+GJ0vHOxbWzLZsTV11B7ztmk29qzbF9Z1Um3tuJjlfueBAgYpDs6CG23LSMfehCqq38aRNF1Wn5/OZ333Ife2OjzBVtF+cu/VgQOMhrI/hhWR/sg74qM94CT2TSxskVR/iGGKePLI1FgOy38jrePSjRNJ93ZgSbdO8V8KrLKE14/XE8A2zkVeCjxBmZXp8o/HI1ijBiBV+hg7/X0FNTvl4Ri7KVf5NE0zN4+ojvtRN2RR6kTxIyiQaQ55ascytKyGHnFH6m/8ALs9g5vJ/P7bnn1DjbM7qMShBHA6uwguMWWjP7bA+jV1aud9XLd9lde/Se6b78dUV+nzlf0ixxZ7s4F5qrYrp27Y2kCO5UmvbI908liTXOpWmMjlrSxenqw+vqH3EU9EvEa4hOhSnYga76EQCbjaHIwK3QWbfUV4/6prMx/ZxCwOzpUiRURtLra3OYVBdndkREyh4gzxQt1Ngrbov7441XWk6GW4ewe0rIYcdmlNF16CbKjS7FkosAEQK5+oqAspRkBZHcP4fU2YNz992H8FBTFcXVqv+mvdPzlJrS6eof1LKBhyMUX71MOf+Py8RrSSpNqX+l2c1AwGuvRNB36+pC9vUPhpNT79XVKzY/b1uLNLdRlbAuCQTQ3ZtzlEEoRGO9tZ3CkQNlnhghyIIYtBITDaBXRko3337J6+5SWpED7VolRcGQ1O5XEaG4mstFUT9AfMjgIY1sWjRddRN3vLiXd0YnmLqRC8lJBOcopLmAgu3sITlyDUY88hNHcpBxbVzdFMQzab72VjquuRq+rdZKuU1TZsIoMWaYo4XwZiJX9bnDUCIRmYCcSmD09XvsHBQcxtEjE8Tr23SLDIZXUDQlU8six49DcY5mz1TPlgUBguAL+EIYx3deHbZsYFRH0SMSpsQw2rL/fURuWEdpaJggBMpUm0NyM3lj/4yiWyBxA2vyrX1F/ySWkOxxqWFDz44x77qI0DOyebozxExj52EPq8FrTLKLYWAWQUsWZGAZtN/6FtiuugOpqbNu/W64u0p1dkvvd7u0r+329oUlRpEQS2dU55PpFMJDlXjOUtSNQHEPVttui2cm0Eus94dP/F991nzQsMzcz6r/yB1cODKjTlvQABMqUDQArkXA0S7kdyocsnjOvATlfLYtgUxNasMRx0uWCEMrDwDQZfuH5NP/+cqyuLuVL5rp9yNzNzEUa5eslu3sIj5/I2L8/TmjCBOUav1oRRRnr2q75M21X/glRW+3giJshLmerzR2v/ELz72S6lAVqa5ak+wdHFo+Nqq1R546m0xkkG4KMrPKQuXb7QiK+nzXz2fedOgPDhlGz995ooqHO86r0NzCrMcXaJaFUGtBiYCeTCFs6/l7lvy/TZl5TikgEOS/mfJyL3huaRqq7W7XnxyCKvynuoUznnkvTVX/C7O1z8hn4ZC6fxgVbKorS3Y2x5tqMfPLvGOPGKWXD6kIUAOmwXtdcTcd1NyDqG1S/ywkHL7uOrD/kIZNEne9ZJohIGKlrWOkUKUeLNmS65ycGWXuBK/jnSytCN7D7+qjdfU+C48eh1R97HHZsQAlQubJ+IT7bvwvKzCAPRSx2nSKFRnlpk9z3HJtDtqpB+Bb40Ba6Gj+JCIdIL1uK2bJC7TxDjJkoCEKlR7VNk8ZTTqX5uusx+2MI23KiiKTTBke/F9Cxe3oQa6zJ6CceJTB29GpGFKlcPnSDtuuuoe3a6xB19QqB3f56RhTytVhDgSKaDDd9qooqLaNQd16DIZVmVgisdHqIjSGzIeXttCKrrQJfMkFNQDqFUVdP3amnAqA1nHACwTXWwI4ncvjqHK1Tod3Z3REZkryFpmtOO4c2C5quOwKZTyorUEQZerXscoMh0q2txN57B1e/v7rAQ5ifH8/wG67H6o853g5apiWGgd3XT2DMWMY99iihUaNWP6KYjtbrtltov/oatPp6ZZmX+XEexeTdcnVeme+FuRMJlOd74pTjentrrnw9NJCmibStLM1kdgU5m4RQChart4f6U08htPZa2JaFZtTX0/jLc7H7Yz63d78cko+R0pUbpMyQ03L67pQTCIfRhIbmQ7ZyIFRVnW+3IKuPRZuRi+tZHKTjndr5wN+Uh8BgSRWGCC7C1B93HMP++hdSsQGVk1ngGelEXSOjHnqY0NixqxdRpERaNlrAoPNvD9B2xZWIunrl1ZvjuZ1HUEThcc0e7yKWfP/3nDlzIyfLBiHQA845LkPRBjpzKG1Lpehyl7JvavP7ggrP7u8nuuVWNJx9jvJiEAJNWha1hx1G1f77YXd2IQw9E4iUqdUjY57x0XWRSSWzBqIc0KuqEWhYqVR2nP8gYFRWMlja5UIw6LK3VX6r+PTptN90kzpXZDUfi+AhzLHHMuzGm0gNxBC2jZ0YwK6qZMwjDxJed+3VjyiOHaXzbw+w8pJLlV0syz4gfP8XanjJXvm+iTxEy2lMhg0T6uj4csE9KMs9BW6oIBMJbHdj8HFKBbsmlCOtVhFl2DXXoFVUeMoZze3V8GuvwpgwAXsgkTkERuZyXhnJTSKxNDA7u/x3Sjfa/RKtxLItrIEYdnzAaXTxErxprakZ8gIe7GnpKgItC72mhvZbbqHzgfvQAoHM7ruaQOg60kzTdNSRjLn7LkgmMKqrGf/ow1RMnfqTIUrHnbfT+uvfQEVF9jy67cqS+8ruTYGfuRSmACJKidANAsOaC5VSEKRlKeOpLtRR8WW+54I9EHc0kBmEdile3uzqOlZvH02XXkp4yhSliXSomYEQSnU6fATDr/4zS44+DiMY9CuNCrdMAkJg9/WqyssZbHfhVUSxhSAdjyv2r7mpeD0+MBoa858Z5L2yuFwXYWwbLRKh5eKLkekUDaecnjEErg4tGYBuIE2TmgMPIlhZjVZdQ2jTTVe/1sulKLfcxMo/Xgk1NXipmlwYtEt+drzQ9ZwyBIicTJ3e+Lsbu6MeN+odB9pyxtVBFgkqPVd5jfeWhtnR4clmMvcJ6btqGFg93VTsvgc1xx+vYpR8c6JQxmERqnfZhdpjjsLs7vElg86uPOuX42BWdqedZ/RwCKEbmANxrK7uwV9z/hojhyF0AyyZvUMWwIZcXUS5IIVAq66h5eLf0n7ddZ6z5OqkMG6iwMiuuxDcfFNHS7X6EEVaFsIw6Lj9Vtp+/0fHzV6S67+XL21k311VyJZxcqiNbYMRQG8sI2+D0167t0f5quk6umsEL2e5OX+tdkfd7PDw2a9msp/JVBK7rpHmP/2poPzrSUtupsDm3/ya4Lix2Ilc7Zi/eEc21DTSXT2+lpU3wHp9rYprT6Wx+8owMrluCyNGICJhJ51sRlobNNFbnpQqsp7PZTWllOj1dbRc+Wfabrj+J0EYoWmKvVidvl4ozY9mGHT97T5WXv57qK1Vu7mUOQv4x1DKwlqu3MH3szzu8pCWRbCmWuWZg5KbrFucuXQp2BI9FMaorh5yK1XWU7L0Vd58S1TOMF3D7Omm7oSfER4zOov9ciHzy5m8QHMzDaediuiPF4wbkL5RELpOursDayBelgbJZdWMxmZEKATpNFZ72+C99tLaDCdQXe24jousEXGPP8u8Q64avXyQKnON3tRAy5//TOsN1zgIk6v4+JHgnMK1ukBaljpx66knabn4UkR1jWdLytsoCmwcQ6wt8/EUQoVoeea6hkCYaQJNTRh1gwv4HmXo6UXYNnpFFXpjo3Nz8HZ7TwwMFKChEjfOSAJ2Io42cjQNxx6LG9eTCzmoo3IH1xx1FKF11saKx5FCwz3TPW+ZaDr09yN7ugdtuB/0qkr0UAhh26SXLBr8BQcPjbpaAiNHqIhFf98LrN9iqs6ywRlIva6e1muup/WaqzOZFFcnwqwm8GcUXXHe+YhIRQZRPPAdqorvS8GB+Qn6KIB0mtCYsYhQ0EumNxjInh5FgSORTLBhOeAoquy2lU5WGK9En3AvQROY/f1Ed9yR4LBhypm0QLuykcVxM9erqojuvYdKYVnMECSl4r0HBrD6+x0yN8gAuzJLXQOEI0hbkmxpcZtc6kXFegkNffQ4dQRBngNoppTyprn0JHklSYlRU0vbdTfQ+sc/ZGSL/0EI4yHK44+y/OyzIRBEOgFSfk4gG8rSQ7HKSOPwOFnaJyGQtklonXXUI4MZf53Fnlq0BCQYNdXoVVXltcjN95BIkG5pUWmcfAZ0/0YipcQWkugOO5bcDPNojVqDkuhOO0EgSInRRugadixGeoUbGz14NySgNTViDGtGSkgtXuyQvUEWr9OByLprKUdAza/uLG9Ciz5V8nUJ0sKor6X9pptY8ZsLlPF9NVv6VxU8GeXBB1n+y/PVjq0XOsMxl9b+mEpzPmWBQKA8nV1kKdkKZ7HLdIrksmVIQK+vHxJFEqio3HRbB9IwcqRbX1csG72yivBaa+J6jheCfMZMOWwRmDCeQIOTb6nAuwLQUAkeUosWZWou2XqlptYDASJjx4KE1NKl2P19g4aKuk0Irr8euIZT90YhlX8OeMJcmZB1lLV0du+GBtrvvZ9lZ5yJcAXz/yCFcWWUzvv/xooLLlTHQmiFDuP5TyBHdu1CEyo1UU0NITdd7yALXqDkFaurC1sDUVPrtKeMRjg+i6lFi7C6u528CYXar7gWvarKC3Ev1q7Cx+QBek0dRnWtY2Ev0imhVIHppUud98qgLE5HjXFjEULDbO/EbF05OBvndCC0njqgBtPNMDi4NCK9xhYru4xrEjAtjIZGOh9+jMWnneZkOfzPUBiPojzxGC2//jWislIpNGxnRRQT1IaKN6ttL1BBdqGxYzHGTxhUE+auhcTCBaS7upACAuPHOrfKWWfqb2r+QqxEEnSNYlpTaUtEKITm2XAKQ3FVjKYhDecUJF84X9b4S+cEr7nz1L0yNDvuu5H11kMzApjd3SS/n+0UV2IQ3IM1R48iuO66yGR8CJokkfM393qx13y9dZVv6TTGiGZ6nnqaJWeerkJONY3V6uI+CEjTRAsE6H39VVp+dQFaZTSbyvk2kSyrta+7ZSnD5I/AFZ8mQSBUnrlUisjk9dFDgcxGU6xqpy+pRYuUv14wSHDSpKFVDyRmz3bCiDLybD7dFZBWqa5KQfHVZqbUsWZOwFLBBkmJCOgkFy1Cph29dDmsGBBaZx20aAV2OkV81qxBXlLgxp+HN9tUZYfJHWxJMb1d5oGiv4q1N9NmlzjZaRO9uYmup55myRlngJkGof9bKIyLKP3vvsOK089QwrxeGFmzpJRVpChF1DtDByGwbZvwRhur4stkX5MzZyHTFlo0SnjSmk5RZXTGUQ4kvv3OkXNy6vPYSumdUWq2t2fuFSoy74pjvLI6O0l3OcmgizH8TmZ0q7UVc8WKjOGnFAi1nAMTxqvs+7ZkYOZMdWsQSuEOUuVOOyHCUYflyGl+3peiF1YJpJMvS5omwcYmep9+lqWnngqphJdP7KcCaSoZpe/tN1l24kkqLihg+E73wsvnlUU5cn4MutRk7g/Pxr0KrVaKGJlOo9c1ULH1VurqYHPt5rae8z22tDEaGgiOdY42GQxZHOWA2dVFetlSdbJAAeT0NGK6htXf7+UlK4bIBVqsHkwuXITZ1etkxbA9NjivU0YAq6ODlMOKDcqOODy+XlVNePwEhJTEZs5yDvgcRGB2KFdk440x1l4LORD384TFulL4nnfdv5pEzier4Zn/HUWcNE2Mxnr6XnyJpSf+HBnr/8kQRlEUg95XXmHZL07EtixkMIhK5p5BksJdGFyuK1Lrj3vMrVLTsONxIpPXI7jGWkXtGJnylFHQ7Owk9f0cbGyCEyei19cP/q77PpCaPQdr2XJE0M2NXQzh1ebnpZUt0qE8ZHHXamL6dMWGaSKDKL6F7GmLhAAzTXLWDKeaMgbYyQdVOXUTNClILVnCwNffKJI/yEKzLRM9FKZi552x4kmlvfPapZhs6aeEvlu5O2b2kGeQQeRcK/yM8BBGb6in9403WXrCcciebuVdvDoRxrXMP/scS089DVtoEAggbBvPY9hreC62+GSuXJwZisKDfKVYAQJUoCip5JV0mso991IUY7CxcQ/o/W4GiWXLkUJSsf6UrHulwKUMienTIRlX9RdpoivJCE1j4OuvVZuL5GAuoDpWIzXw5Zc5Vk/I2l39oOskvvu2ZEWFILzZVLRICCsRZ+DLL8p6x2XFavffX8VmlBPL/aM4sGwBvxDYpole30Ds7Q9YfPTRWD3dKu5iNSCMdBL+db/0MsvPPgcRMDxfNZnXLlEYKXKhHEKzKoSoYDka0kxjNDVTtdfe6tIglMGdrr6PP8aMxxHBEJFNNnWaNXjDXJvdwOefgSYc/ZRPE+Z+deVRKRHhMMnvv1euNUUOWspe2VKi6TpmTy/Jb2ehhcM5E+4rwB1wKdHCYRKzZ6mQWb0MId8RvsIbTiEwYjgCiH32mdPRQZBN05C2TWS99YhstCEy7tOK+QbFH4tTGPJXjH9jzsoplYUwvjhtXxkynUY01BP75BMWHXM0Vlfnj6YwrjAfe/89Ws86S7ETRraMktWXXCLi60dpHCp813Vz8p7Ji1kvDFml6Rp2fz/V++xNaNzYwZMESrUGpIT+zz5D2mmMEcOIbLCBuj+I8VqxcDpmdw/J6dMR4bATl0TWgshdG1oohLl8Oam5c71yciEPWQBS8+ZhrmxR2eoLyRAi+x0tFMZcsojkrNkOuza43CJtG6OxkYqNN0LTdBJzvifV0uIdsloSbBtN16k99BCkZWZb/4spI0o1h2ycyLsnshdgNmT4PDudQquvJ/bxJ8w/9mjMzk5FYazyM5l4pVoOonz2CUtPPhmJzHg/Z7VVFPrzI6AQ65mNJC7e+FpLYR5MKJkqGqX26GPLq96RV1JLlpD6bgbCtoiuvz5GU+OgB/QCGRbuy68wly9XOcNKrUd33HQDmRhgYNrnTjPKRJaBr77GHogNHmPhLiJNwx6IE//4Q6ec0q8BniarcvvtMAIBzLZWBj75BH8SjKLg2Fyq9tmbwMQJ2MkEWbPprd/BG5K75sqCrK0zexXZpone0EDy82ksOPJI0itbVS6wISCMMjgG6P/kY5b97OfIeAIZCjqhCX7kLSR1FWqvyP6U1cFVu5t1T9Ow+/qo3HZ7IlM3LutQWOks7IEP3sdauRJNaFRts71zrwxjpPM39s7byFTSUwqV7JFwXhQ68elfO9cG8zp2IPHdd0i7vNWjVNU2GAb97/1LdagcY6EzaRVbb41eX4dMm/T+801FdQblpwVYyppee/DB2LEBRV0KsV4/yqpWTBpW92TWVWf5CqESCNbXkfr6axYddRTpFcvRDGPwfANSZlivd95m6XHHYcUGkOGQcq/5cR0q0pcf/1hRkCojT/0pJ6vfZbCkrjwT++fbYJoY1dVUbbtt1r2S7+s6ViJB7IN/qTAQq9B4ZQkt6mNLRDhI/LsZ2PG4I7dkv5W9qnUd27ZJz/kB3TkwCInPgJ/D0zpGHWlZiHCE5PQvSc/7QS3ccjxKpSQ4aQ3CUyZj6Rr9H32AuXx5ecKxG05w9DEYzc3YqZSHZLmcd8bN1LUYlLPgCrEWgrxwBZHZ4TPpnQSk0+h1taS+m8GiIw4n9cM8NPcQJidM1vNwtW2HndSUwfGfb7D05FOQqTSEQyoTjK8Ng7U4f8PIZdRLqdIzb/tluEGHxr3h9EnoOnZPN5Fdd6Vim20VVRmMU3EMhKlly4h/Og1NE4SnbEBw7bXKO6rcUllYBr78kuTs7xFhFSjojbOrPnbWbfZHhWEnVq4kVcT9KlO7k8HC7o9htndAQM+OGcrpU+4YCT2A1dVF7B+vq0vlpDiyLISmUb37HmjoJFtb6Xn5JaeOQd535J7gmDHUHHUUdm//4GxjMf1h7jNlQ7bg7353kUamTbSaalJzf2DhgQfR89TfEbqGZhhOSlGVsUSdhBzA6uul/aabWHrqqVimsqNIK/vQ02LN8O4U7J9YZYKUV2655VgWdjhC/fkXOe+X8aJjUoi98z7mylYEgqodd8lElQ4Kqo6+N99CJhKKlSqsK/a++vcPqWnI2ADm4kUF25yFqgKVfNvq7XUWXnk8onQ6KoNBel973TvpdlBwtGLVe+5J2Mn20f38c0qzVMb7QqjDXBtOPZXguDHIRNJj6POXVQ5FyZ08/0Io0e38cnMRxrewnfggrTKK2d3JktNPZ9EBB9D9wEMkZ31Puq0Ns62dgc8+pe2v17Nwn71oveoqbE1HeHaUQvUUbon/0fKkjuL6sdynXcaz0LjmlqoZBlZPDzVHHU10/cnlH5PhrIe+N95EYBNqbqTm0ENU2eWsJ8PATCaJvfMuWjhUHoJ6vVDig51Oke7ozFzzF5/3lm05gmSR3chh1KWUWTyktJzDKr+ZTuLbGYQ3nDL4IAkBlk1wxChqttqS9JNPE5/+DfFPPqFiu+3KfN8i0DyMpjPOoOU3l0BFg2d7ceW2IUMhtsP54jIoBUVrIZU7fy4jaNmIUAg9HKH/80+JffwpWmUUUVsNAsyVrchEEi1SiV5To9guWWAnLaStE6V/50OpESlnxPySWv6zQtORiQSBkSMZdt55ZfuAeUeJL16E+e3X6JqkYpcdCU2cUB6yOe/Hp0/HnDcHvSKCLbPPOR2sdwKJtK2iKWLzg7+CQXVUdG6SbI/XzVSXNw66TjoWo/uFF5z75QyUkk1qDz0CIxjETCbp+vvfM1UOBg6JrvnZzwlvvimyv99nq3EEbqcfWUqsIYMs/N3VrLqUxf3upwDOLEnbRqusRK+rBk1idXZgdXSghSMY9fWIsOON68iJWfu/yK4w+1rmzuBtXx0gfZPvdNZbGgJrYICGX//G8f0rQ9YAr7z+l1+F9na0ighVRx2bda/06+qZ2NtvqwhfXSsw1zmJAHMLsaWKxg0XdtXP6oUEjJoaAnW13lHf5D6Q1fgc9zrbRotW0P3aK1h9MWUXGKyjmgrkCm+zNeENNwBNp+utf5JavBitHNcIxzFThEI0XHqZEi7dFikpDTGUxTIIJpVCNg9h8haze01pXaRpAQItEEQYQeV6Z9kZlbmvEr845H75sUqqDJQ5LlmPFdpAHTAMrO5OonvuSc1RRw7tlDJdx0om6HvlFWzTxJi8PtEttyxPu+oqFJIJBt56Uxkis1yz/O0usaXYEj0SJjhimHoyZzfKtMKNYgyFCKy9BjKZQor8ZeYJRa6CyfkicXLqhsIk5s2l9+231YZaji+PZSGMALVHHQW2Taq9g45HH1KIUI6tRNOQlknVdttRc8LP1WnIAcNBZbXrlU1RcmUXr/ocPn/QAn0aMv/HX5Srnckqx1dplhuBb8pXnTz+SHAqzSWyjueunYijD29m2JVXDImYSctCCEH/m2+R+OZb0thE9tsPLRQq2xAphCD+8SckZ81S6bKkz3ib8/HTF/+pCXY6jdHYSGjttZybxZAFvJeq990n6/i2ov12tXD4Q2sATdD19yeVXFNOQJijBq7eb3/C48aiGQG6nnyK9IoVZI4eH7QQpG3TfNGvMSZPRvbHfDtStpjs2+eLw2CsfVn3hiI857MMqx/KWcE59RZ8JV9QElJCIsmIq64lOHZ8+ewXav5t26L7wYexU2nsunpq9tnHKbqMcXDq6fn708hUOuOfmCOvZPfAj/hSHQwbGyCy+ZYY1TXYBZC0YCqkyj12J7Th+shYLL/D0v9F5t+ybYxolIGPPyE5c3Z5XqZuVpmaGhpPOAHDMjFbWuh+7BGl8SrHv8px/Tdqahl+3XVIDSehc1ajfc9n/pQvy4j8dYLfR8zPO/krGiopKP/Z8ktffXJLbnSLpmnYHR00/fZyKvfZp2CCuqLgmA/6P/iAxCefYNoWFbvsTGjsGLVgyxDscdxj+t9+By1agXSdTD0ozL5mbaHShmCQhhNOKPgsFEmFpIXDNJx3DnYqhablL5BsMizz5sG1GfS98LzzSJmslG1Tf9zxVK45CS1g0PH4E5grV5ZPXZw0tFVbbEnD+RdidTlpaIewTst5tNACXT2cURmllNgtVw0xS4xrqSF32C9pGKTaVlJ7ykk0nHWGl2a1bNA0bNum57570IQN0QhNvzih/Ped2JXuZ58l3dqKCORGRZYeC4FANwLYnd00HnMMVZttVhRJ87VhznELtQceSO2xR2O1d6AFgqURxuH7PPbGluiRED2vvIIdi5W32B3KoNXUUHP88WiWRWrJUjoffqh86gKeAavprLOoPuggrM5u0HM15CWEvEGamM/Q5ZecLZSXU3LpNvnrL/V0eQfTrgpC+cCzhNuIgIG5spWqgw5i2J+vHvqx4w5VGfjkY9IffYK0ber22oPKjadi29bgLLwj2Jt9vfQ8+TRaJKzU9ICQpefHHSstEED29BLdcCojLr0kzyTih8KtcRbnyD//mcj226kTd41APhdSbP5tiR6OkJg3j/6331aVl7PYXdnliKMJTZiIDARoe/QxJbuUo1lz2o4QoGmMuP46wptuhtXT60OYwXaaIgtxdYgQP4ITKq/6AuxGMU1WHgytccIIYLa3E911N8bcfgee4+FQBkrTkKZJ7913KYoUjdJw8imqmDKaI52oyZ7XXicxYyaiIlIkzsf3TqYHiEAAq6eHwNhxjLrvHrTa2pI5yYoiC4CIVjLmgQeo2GUXUh0d3rl+RWrPaaFECOh+5DFFFst0rpSWjV5TQ83RR2Il4wzMn0/nU08hKE+z5rXfVuWMuuM2AuPGYMf6FcKRSyGKFOHrTb7YU/rtwvNcQC1T5i6/auyWKKPNuWXky6F5NQq1yMyOdiJbbM7Y++4DN+5pFahK7NN/MfDPVzHjMSo225TI1E1U6HCZiiHbsuh66FG0oOGtj0FGRa1hQ8dsa6Ni8nqMffJxgpMmZo4XKQLF77gCc3094x9+mLqf/RyrvbNw1vdC42vaaNFKYh9/SPzTz8oT9J1qkZLagw8ltP4UgmutRXTTTXw3ywSHHQuOG8fYhx5Cb25Wx9EZGX66XPlkcMjoBAvYbrMKK6qK918YEvg1FX6dZDkFFUeOAjWoKgIGVmcn4S23ZMzDj6BXV6/aSQBO3FJo0loEtt0Ju6GJ6qOOUffKMTfYNkLT6PvgX8Q/+Vilgyrgj5i1FUhUfm7bxuzopPqQwxjz7LMYLqIMImsJ2x7E49ExCgmg4667af3Tn5CppErQbJqZBSz8LuvON13H7O2m/tDDGXXbrUPiaYUQmP0xwMaorCrfbSIXnLNKEjNmsOToo5BdXYiKCqTpuEJI17RaJojcL5l3c210hUCNjPtQjh1LOldyhJ68Kn0/1KN+Pb/IIIv0P1oI7csT7j2qEjCwOjqIbLc9o+69F72ubuhySg4IIbAtG6uvD722RmkwywHbRugaC446mtg/30SvrnHsLTheG0p+zswxYOhYfb2ISJRhl11K/QknqOtl9mFwZAGl9XBCjmOffsqKX19Ecvq3zom3ancS0uVtfAtBCKSwEVJn4gsvEF5/vfIH17HRuOroHyM0uImzB777hiWHH44YiCMiEWVJl0PZiR0o0JRyEMX3pFdQ5j2ZgxRDQBb3i3SPzJa51RRudF578i8Lx21eAHR1UHXYoTTf8Fe0SMWPRhRVT2YzluXOs+MH1vevf7H40MMQFVEvGlL4kET4NnKEwOzsIDJ1KsNv+AuRKVMyBs8y11a527ziD02T6BZbMOGll6g9/jisjg6lVXCFOwnqkEZnIqVE09QRyZ333FtWVf46pW3/aEQBvMNPK9bfgNEPPYyMViIHBpQMIzIDXHYtsshn0PdkzjvS8QHL0WKVhXl+1i9zzkhhRClVRn4/hPuxpXJHSqewerqpv/BCht9+lzrOogiiSNtWaZpsG2lL73tRcNj9shHF1/LOO+9EWDaa5rd05W4iCnGsrm6qjzqacc88Q2TKFGwzzVCPPyyPsvjBssAwFFt29920XP4H5U7uJXvz8dBSNVYKCabNxFdfJrzeZHXU8mo6xEdKddCocN1CpFo8QtPyVIAehfnmG5adcCJ2awtaVRXSTPvWzdCGY0hPD4WV9JGMopzfYJxVAUqU93BOk7ynpATdwOzrRotWMPL6v1B94EGZhV9gkdmWhW7kO7IDSmiHvDkZMjhUpf+DD1h8+BFoFRWejJPxzXO+axpCSGQsTuNFF1N/7llDYrtyYejIAmpBOgd8dr/yKstOO10ZL3WfetdFFgBDw+zsouawwxh75x2rh3yD8kUzigtltlVAV2+ZCCNA8of5LDnlFNIzZqgj20wzazGXs68PrbGr8JYz+XlrPreYQte89wv+cNpUQCCWODuuJN3ZQXC9dRl1y21UbLiROiS24G4sHW5Ko3PRYr555nmWff0N6WSC2tGjWH+/vVljxx2AInNSLngRn5KFhx1O/MN/oVVWIXzqYo+yaI7Heayf5j/9mZoTTvjRh+muGrK4bXfixXteeoFlp5yuwjhFtsrHFdhswErEmfjiC0Q33/xHI4x0MrzEli1j9t+fYem0aQzEYgQrowzbdBOmHHEYNcNHFJwcl8JYnR0sveAiBl56EaOuLiMf+bbwYoNTGK1KTMKqKCh8oQV5VZRTXN6aFr73MwV4ebWEQBgG1kAMK56k9ugjGHHlFWhVtdhmWh1+mwsOJdc0nfev/ytv3Xw7/Z2dCASGpmOlUwjDYMqBe3HAdddSPXz4KiOMO2+djz7OsnPPJlhb6xkhc2dBBAJYXZ00XnghTRddVALRy4cfhSyQQZiVV/6J9r/ciKiv81L/KHlfqgHVNNJ9PVRsvx2Tnn5G9W6wHFDF6nQQZfaTT/Lub/9Az9LlaIZOKpnESpnYQhAdP459/3od6x6wX8Fjs6UXzSlpvfoaOm+6GT0YUMcO+BL3uXJAoUHKv/o/GVn8m1iujCS9Hdfq6sZYYw2aLrqA2oMOHpRtcefizYsv440bboSKCtKWScAIYScShCsiBMJhulpaGL7+Opzy3NPUT5w4dIRxbC/pFS3M33NvZHe7Cm+Qrkojo6YRmo7V3090hx0Z9/hjuBvBj5Z9fyyyuMhgJxIs3HtvEnPnqQVnO51wtGW248ad7u5h/D33UnvIQat09rs7OZ/fdAtvXfo7otVVCCFIdPdg1NSCbhBva0NYAoI6Bzx0D+secjC2aTl5m33gCJVC0+h54w1af3cZLFyIVluHtJ2jsHPYp6xvfpa/sMoqe5yGCrnIkmU0KLcM34vFkEXXkfEBrHSa6mOPY/hll2LU1KoFXWKRuTv99y+8xGPH/wLLMAgMb2aXX/2S0euuy8LPp/HR3ffQ/cMCos1N9KxsZcIWm3HqS89jVFY6TStvAbss99JzfknPI4+gN9ZBOjvjjT8ezUpbTHjpZaIbb6C0nrlzvwrw40twYk70aJS6n/8cmUxmhDhfVhEhAanCa1tvuAG7t6+8hHo+cBFl7osv884ll1HdUI9lprEDBtv/6Qp+9v7bnPzZh+x7563Ujx1OhS1498wLaPtuBppRIDuks7PZpknN7rsz4cWXiB52CHZ3N5gphK55evuMtsVhLX2imacxdzRchZxLVwvInL/lvlOgvQI8tsTs6EAbMZxR99zN6OuuU4jisi1QOFmE45dlpdN8dPtdaEDD6JGc9fILbHviCYzfekt2PPdMznnnDdbdbw8G2tqpHz6CBZ9+zoe33ak8lcv1yLAsNEMn9uFHxJ56Gr2uViFAITzT1BHd0Z13JrrxBsopcjUgCqwOZAFv0VfttRehYcOcmAL3rsTzabPAqKggMWsmbXfe4XkalwWO3SXV08sHv7ucUCSMGY8Ramri8OefZfNfnk3dGhOJjhjGlJ8fx4FPP05lUyN0dvHuuedjpVKFkVMIT7UcaB7GqFvuoPnWW9Cqq5CdnUpQ1JVmzZ+yNRtBfOpW3I/0rnnS5+qAH42EDkti6NgDMRiIUXfyiYx//Q1q9t0f27K8WA43/ZBWQMPlOhx2zl/AyrlzsMwkmx16CA0TxpNOJrEtCyuVprK5mWMfeZjR229DorubaH09Xz31LInubqU5G2yzdLIOWakUHVf+GQ1Vb2Zcs5+VtsQyTar22FO9+yMZJz+sHpQTAltKAsOHUzF1qnPKsUZubwQgTBW30nb7ncS/ma4mogyEsR318MJ/vkn73DmISIgUNvveew/DN9oQM5XCtpS+3kwmad54YzY+6xRs0kw+7ninHlmU7Lt5iaVlUXvo4Yx58RUqDzsMu78P2dfnpCxSqkiRp3KV2V9l9g/hffJqZVWRSBT55LUjqy2AYWBbJlZ7O+G112b0o48y4qprlILDoSaarnufVF8vC955p6jKt6+1lcRAHFMIpCODak6aJy1gYKXTBEIhDrn5BrTqKIam07liGSu/n6NaNQiyuLJl9823kPz0U6iMZtLhFlLwmWn02joqt9jcY7FXF6y+kpwFH5yyvgr+KdQTxcMgdA0Zj7H8wgux4wOOBm2wHUb9Wf75NNB0Ej09rHPQQYzZagustIkeCHgnGGtGAGlLJh5yIPs88yTr/fxoVYczmdJJcJdH1RxvZds0CY4dy8jbbmfUI48S2WE77PgAdn8/CC3Hh0hmUZTBwKVLGSNoiX67lKlAGUXLz6NwKC2YrsKsU+3tBCqjjLjiCsa89AoVO+6USfqn6wghiHV0svDzL1g2cyafP/4kt+28Dz+89a6SQa3sMYvU12FrGjIUZtqzL2DGYlkcg2YYWJbFyLXXYZ3dd2Wgvx/btol3dzt9LNF/RyaKvf8BXTfcAHVOBGOhEXEURjKVJjhqFMFRwx2CvpooOoVSIa0iuE0KTJqokiwjPf2/AC+eXyARloVRVUXss89YedVVDP/jFYML+66t01EVWmiM3nJLxyCZ86iDFDWTJlIzyad5kY49wKlHUFjv78b0SCC6085U7LQz/W/8g94HHmDgow+xEwm0aCVCcz1dJcJxNckS1wY1CvqtKIOzC8WmvWAJEofF1LDNNGZHN6KqkrpfnETzGacTGD9OER7HgdBlq+K9fdyz90Es+WoaMhikL9bDmptvw/ANN8haeMKZz8ZJk6geOYKOhYtZPnsWr17+B/a//los03SOYHcS5Ok61c3DSabSVEbChKuq3IIKd8qNVenoYOUFFyiEdDZV6Skt3MWlei40Dcw0wZEjlTuOLVcb9wurk7I4YDQ1+xL0iawtThnZHY7etDDq6mm/4y7633hD5QIuI+tg/eS1nYWokezp8+L3C4HreuHtdJqGpmssfuJx3jvgALqmT1eIU2jCnGyR7q5btfsejHz8cUb+7SHCe+xJ2rRJd3RAMuFllcwNzir5ySNFJZiqInOeW4T7XWiK+qmEcR1II0DtEUcx4bnnGXXt1QTGj1PUPyelqgDMVJLOhYs59rbbueC9d/jdJ59y2jOPsej9txlob0czdE+msU2TQCTCxkcdTqKnl2hTM+/dcRdvXX01umF4m5IRDJIaGGDW2+8jpKRx0iRGbDCleKCVF2AGK399EakF85EV0QLhwnk9Vz6MdXVOMatXy7L6kMXptFZdDUH/URUZxsPtlBKW8WIjlv/mYsz2NifHceEOag5lmLjXnlSNHI0mdGa//CpWKoUeCDisX36b3AWv6Tp2Msn0S3/LtHMuoPXtf/HBAQez5JFHkIl4cXbA0RgpCz9Ed9qJcQ89zLgXX6T2jNMQo0dh9fdhdncjrbRSTxuGswgLShMKJAgpsu6WpBwy+3c24iklhWs0tPv7sLo7MZqbqD/7bCa89BKjb7uZio02xDZNZcjL2STc7J7Rhga2Pvt0Ju61KyM32RCZiPPkocfy6FEn8PDxv6C3tRXdMLI2oW1PO4XxW27GQHsHVY2NvHblNTx+0im0zvgOMz5A+7wfeOhnJ9M6cya6prHb+ecRrKxULF0BZJGWhdB12m++md7nnoe6OrD881t4xJTiz8aoqXYurF5k+fF2FhfcjIJLlzB/1z3UIUOGTtGzWhz7hdANzO4uqg8+kDF334s0LU/2yHvF4WG/vu8BXj37V0Qqo0w+aD92uPrPhFwLvH+AfG45HdOnM+3CX9P7+ZcI3SBYEVHywEAfWzzzJE077lTYFlOgn37BMd3TQ+xfHxD/xxsqPHbpckQqpU7IDYVUhKkDwjXQFpjEwSbBQyrX/VxoHiciU0lIJpBpE1lVTWiDjag68ACq99sXo7FBNdtSx1UM6jUhMozh1397lBdPOQstGsYIBEkMDFC5xliOuO8uxmyyqSebaoZO+9w53Lbnfgy0tBFtaCDe1UmkpoqGsWPpWdlOV8tKrEScPS/5Nbv/8XdFjZLuHPe/9wFLjz4KEQ4VHh+/4sJRj0tdJ9XeRtNZZzHyT39aJTteKVhtMosbz6JVV2NUVZHq788KtPIe83+RTlaX+jq6n3uW8OT1aT73l9hps/C7umIBNjrxBDrm/cC0G2/hh6eeo3/296xz3NGseeyxBEIhNXaOTUZoGnMffJBpl10O8STpdIpRO+9AdX0ti597mXDTMMKjxrpd8EC5b2vZByWBt9ikZSGlxKipoXaffandZ1/SnZ0kPv+C+Icfkvj6K9Jz5iC7e9Rurusqi77hUABdA0fGcZPQZGzQeDKHN2aOGlRaJqTT2KkUwsnzFhw1ksB66xHeZhtCW21NaMoUj2WwTVNRnmJI4kNeJdeBmU5hBIP0dXdjaYLa+npCjQ0snzGTxKJl/G3/g9nn2quZeszRIMFKmzSuuRYnPf8Uj/3iNFq//JpgOEyiq5dFLZ9jS0m4rpFdL7uYHX9zPrZlF2a/bBthGKSWLKXlvPPUGHnKghwh0BPUMiPnyi9aJJLz0OqB1YcsDohgSIWZZq8ACjbcVfWYFkZtPa1XX0to9BhqDjkEO532woCzXhEC27LY5aorqWxq4Jtbb2fp+/+ibsOprK3p2LalMgsGAph9/Xx52aXMeuAhRChMor+fNY86gm3/eh3vH3kMdjJFxZjRRMePUwvGm0Dp2RaK7k5ODIbfvTxQX09gj92p2mN3pIT0wgWY380gPmsmyTnfk5o7D7OnC9Hdjd0fB8vGJqP8UB7aThts17gp0TUBho4WDqOHK9DGjiE0egyRDTcmssVmBKZMQauv95ompfR874rtrNK2lTHZ8SB33wPpyRrjttmcQE2U3vaV7P+7S5j3ycdMu+9vVIbqeOm0M2n59jv2+MPl6KEQVirFqCkb8Mt33mTa408w7733GWhtBU1nzMZT2eTYI2lefz1lAijk5uTY0ayBAZaffjrpZUsQNTVqcygLRKYPNTXePK5OWK2UBSnVATLhENJNLu6C9O2bgux7KBZFiwRZ+stz0Rsaqdxxh8II4xgHpW2zxa/OY+z227Hon++w5cUXerukFtBonzaNT395AV3TphGqqyela2x07jlsftnFdH31NR3ffIfQNarXXx8tYGQhhW1ZtLz8EjUbb0zluLGlBUUhPCHZjb+RKCoYnDCB4IQJVOy3ryo3kcCOxTAXL8Jatgy7rQ2rL0a6sx2zP4aVSCj1tKahBwIEG5rQGuowauswhg/HGDUCvbEZrakRLRTKDC0OJXQRXstVb2eDS3UBkn299PywEDuRoHnzzbLcWxomTqRi5AjaZsxi4edfcPAdt1I3eiQfXXUDNZEqpt14O8u/+JL9b72R5nXWwUqlCFRWsOXJv2DLk3+RaY8DRTceB0klgmVnnEPio4/QGup9iJKzVrz/M5oPtTcrZtWoq+engNVLWZxJMJqbSfhPES661nykx5ZoegBpSZacfjITnnyS8AYbFx9gh8KM2HRTRmy6aZZmZdbNt/Dd1TeQiscJNw8j0dXDxOOOZvPLLgZg+dvvYiYG0A2dhi03y2q/0HV6Z8zkveNOQK+rZ61fHMuGl1yiztccDBzE8XZqZwErjkogwmGMcBijoQE2njp4eQXA83ixbKS0M3JImcY3aSvK0TFnLl8+8BA/vPU2vYuWENQ1TvjkQ2rGjlJ+cbZNtKGeurFjaf/+B5Z8Po10bx87XXoJk7bYkldOPxtb02j5/Cvu33N/Drz1r6yz7z5esJd79oxL5VwlRH6DMnLlit9cQv9zT6M3NWbcWXLNAr7//VeFUBulCBgYTY1DGNHyYfWqjp0dODxlCiJt5XkVe9obR7hX15x/QqjzSEIhZP8AS048hdSCH0qqlN3sHlZaBW91z53Lq7vtzVe/vQJN0xBI4j3dWDrMfu4FXjzqOAZaWmn9YpqTRaaS2o02cgrLxMN/f//DpIRGoq2dFR9/pexGhaiLsxBcI2ceODu80HX13WHZpGUhTRNpmti+j7SsrI933f24xkPbBs1ZfMVU34Wmx7bRdI0v7rmP+3ffhw9vuo2lX35NwjSJ9cdY8uGHTrek47clGLPRBhi6RueSRXT+8AMA6UQcAgGSiQSBYJBAMs1zx53ItDvvVXKiY9x059yVHQuCgyit111H5x23oTU2YpsWmW0hNwqyhM7QsjDqaglPmqiurEaDJPwEMgtA5dZb0R0KKYEUgcgSWsn/7uuTZtlQEcVcsYLFxx7L2MefIDh2XFEK40VECghURGmYOJ749G9JdHcx9sADWPPE4/j6tttZ+M93Wfrya7y6cDH09WLrGuGxY6mcMMFDBE3X6V+yhKUvvko4VEFCS7DRZb9RHgcFsn+4u6cLHkJ5AXC526LIu15qOsuealdIdyyhhTR6Luv11T338c+LLkYPhqgePoz1DzuYNXbdmWhTI5HGBsXGarqKZgVGb7IRoYCOiCeY8/JrzHjqWd77683ItEnVsCZqx42l89vvqaqv5Z9nnk/PrDns+Jc/U+gA07w2mRZawKD97nvpuPpq9IbGfCNznnHXf8NvWxKY8RSRyeuqnHM5LODqgNWLLM7xEZHNtyC43jok53yPCEeU+lhmdy4ffHcsC70ySnr+QhYdfyzjHnmU4OixJVkygOiokWx59x3M3Wwz+pa3MvVyxXbtsf2OfHfn3Xxz443E584hUBXFMk1qN94YPZhto1nw1LPEW1egh0M0bbEZI7bZwhf7osBdeCumTWPh6/9k0p57ULvWGgQqK1VznEQbWaySyD4rZrWBE4viX5quH11ue9tnzOSdK64iVFFBoLqGgx68n9Gbb5JTnOsro95vWmcdojVVWMk0H918KwO9fUhbMmbLLdj7hmtoXn9dXjrnQmY8+gQTt9qStQ7cn8HR3DlxIWDQ9dDDtF12GXpNjSO1+O1zpUB4gYUCZ+NKJqnaaSflgVFGaqOhwuplw4Ryn9DDISoPOQgZj6P5drmylokrsJkWWk0N6TnzWHj00aQWLhz0xF9p29i2zZon/4Kpl1+s2AnTRGqCKWeezh5PP0nt5HWwkmksTaN+E7VQpOtakUiw4Jnn0CoiJFNp1jj+2JKe0d898Xc+uuLPPL3PAcx+6lmleLBM0j096sRiXVOWbMea7XkE5LBs0jmUNYsFcz5FWTx3uDQNTJPe7+cw57Enmf/CS54B1yvf+f7d088y0BcjPTDAZiefyOjNN8FMphS7l5NYwnVnqZs4gfpx47ATSXRNo2r4MPb485X84s3XGLXFpgSiUQ6+73b2vf92Dnz+cUbvtG3piEQpwVLaxq7776f1ogsRlRXKzTSvn+5iyCsk/1nLQtTUULnffm4Hio7ZqsLqVx3rOtKWNBx/PL2PPIK1ZJlz4m5mF3CYhaz3/DYmFZks1Ym/1dWk5y9g4RFHMPaBBwivt17xXcMxqLnOdp5QKSWWZdK44UYER4wk/c236FWVNKw/xalTKQeWv/MunTO+wwgGqVxjPOP33Ye8YzMcxEr09LD03Q8INzVgCY369ScDYCaTvHL8KZi93TRMHEftWmtSPWkitWutRc0akwhUVDjFZCZbbSjF9y0vKYef5XOoxbJXXuPjK6+mb2U7XStb0QIBjv/4PerXXssz/LnvrZw125PNmtZdy5NhSilQdCNA07prs2LaV1iJAfa66s9s/IvjsB1XInfMNz76SGCQGHuHVRSGTvttt7Hy979DVFajdtkC52dmvev9l3MNRMAg3d5O7bFHE5mywWrL8ZALq19mEUrQ0qurab74Epb/4mR1EpNwyaaDJjl8qRCufEP2mJhpjMoKzGVLWHTE4Yy+7Rai2+9UMqY6L+Ye0A2D3oULWTltGoSCBIcPp3r8OPW848v2w6OPIIRGMtbHuoedTaimOo/1k7aNpmks/eRTeucvQg/pVIwbTfPk9QBI98XonDWLeHs7K7/6ilhPBxo60fp6KseNYa0jDmXTc89xjiJUCND9ww/0L16KlUxiJ1PYySRWOokUgvp11qFp6sb/r73zjrObuBb/dyTdvr2494pNr6aYapohoQVCKIEQTMeEvEBegAQCjyQkL6QXSELoBDA9mNCNQzWQAqHjXrC9u97du+VWSfP7YyRd3bbNu7bx+x1/bN+rOxqNZubM6ed4IQTu+7rI1vLRR6xb8hbRkcMIVlbQ3dbOS9d8j5MW3F80L9IyEUDGtOhY95myWckSoQN5MhAM230X5J33IKRNd0uTQ/0UG+WCZZpKqdKDIO9qCptuuIGWn/8CrabacY50EaVwJGq/lGLMvGR8RgCrK4E+ajQNV3570P3B/DAkAj6O127V8ceRmv8vmn/2CwLDGjwrtF/G96uPSxNOAVkLLVaB3dHBmrO/xsgbbqT6q191WBS7d2HScaJsW7qU9MZmZDbN8KN2JFJdjZXNogcCbPrPf1i9aDGEQ2jRCFNO/Yrz+NJC+srnX8CystjJDJNn7UMwpihG1/p1ZBIJjEiEqrGj2PXgg9nwn3dpeuttupcuY8l3riW1pomDf/1TbIc6vPubW/joN7cSqKok1Rknk01gI9G0CKGaakbuN4tDf/UzqiZN8uQRd1TJ1jZsXadx+lQ6pU3HP97h46ee5oOHHmbmKScr718EaBBuaMTKmkhdY9Urr7L7vK+XSMWbk4FcWa5hxkyMSIRsPM7a15cobVfBFGs9yAdegpBENxu+9V/E//IgWl1tHkJ6q5/XcakdIXOHqWFgJ7sxdZ3xt/yOwNixQ0ZVYAi8jj0QKsl34/e+S91555BtiyPTaWUZd109PGWgUG4LEi8CzlMSuqQ2ayKCQaSms+6/rmDD9derKEZN79Vb2T2Vxxx4IEcteICKqdOo21GxTe5J9NFdd2OmMmQTCcYccSTVkycWsxQOC5bp6mLN4r8TCqnKApOPPsJrEl+xCiuVRGbS1MyYwewf38jJTz3B3Dv+TKC6mopRo1n62BO0r1yF7thujGgYIxZDj1XQsMeuTD7pS0z8wnGExo0hY+h8/MJLPHf5fysjLc6kOEjbubEJy7LQa2o5+IbvIzUNPRpj0Q0/ILWpNa8u54QDD8A2swRjUT559gXaly5H13XsbFbJew61ttMp4suWeQbh+qlTCeoagdoaph11uLO8fVRXmyaaYZDdsJ5Vp51G+/0PotXXF1AA4SkV/H/8AWzCh1hC0yFgYLe1IWIxxt97D5WzZ/ea2HtzYUiRxVFTMPLmnzH61t9jjB6L1boJkUx6bu3uywlvQnL/530GcHyK9OpKmn/5K1bMO4fspua+ufcLgRYKMfaowznhxeeYcfrpyt0jGCTR1Myahc8SikQwYjF2u3y+w0bbeQK5dFiWDf/8J52ffoouLarGjmXsfvt5ix9fvkJtTimpmzLZe/z4Iw4jWF0DUrm0+MtHi4CBNHRS3Ql2OOfrfOHhBZzw18c59r47sWIxgo2NrH3nHdqWLncUDtKjpl3NTRAIkDEtxh14ILt99UwyGYu2tZ/x0g9vclTrgJRMnXsUtWNHo6UzpDvaefqqa7BNEz0YRNN15SLU3clT513MQ2eci5VMIYFwTQ17nn8BZy1+iT0uPL9v2SOlsgdpgQDJf/6LlSedQvL1N5TB0favlXDkqMIKajn+QwiFIJquK0NEdzeyqZXI/gcy4cmFVB50oBczM5QwdMgCzoQq4bTm5C8x/pmnaPjBj9CmTsPu6sZubUV2dXlJnhXy+DQg/r8uWEqwDNTX0fn4kyw//kQSb7+dC0/uKUTZ0Y5FGuqpGjNKWZaBD+5/kM8+fA8pNIxwlGUPP0Lb+++jBwJohpGjLg5CrHnhRex0hmwyxehZ+xKprva0dO2rViOFxAiH6FqzmpULF7L2+RdY/N1riW/YQHzjeoYfdAC1kyd6CKOFw1iA1MBMJbBNEzOVZux++1E/cwapRApLCLLptDcOoQmsTJpkewdogkBtLbZpcsAV3yA2vBEjGuWNu+5i2fMvoAUCmNks0dpa9v3WN+hsbSVWW8+yZ59jwRlns+rlV9j4zju8e/sd3HX4Mfx7wWN8uuQNlj39vNq2hsEBN17HsJnTS9ZaLJpmywJNGSdb/3w7q07+MuaqlWjV1chsD9pMULjjGFyFoTuGZxOru5NsWyu2aRLacy9G/P63jHt0AaGpU/pXlm8zYGhkFj84E2ubJnpNDfUXnkfNWWeSXLKE7pcWkfzH22Q+/BirPY60TbRQSCXrMwywbJ+hz+nO+SjNLIHaWszly1n1pVMY/r1rqJs3TzXtQcfuCcrgFU8ac9BsdrrkElY98STZ9et5+yc38/4ddzNq9mx2OOMURs6eTaiqygmoyrL25VfRAgZm1mT8nMPy1Jgdq9cgASMc4tP7HuCDO+9BC4eVkqEywq7nXML+V12NpulYtto4eiSMJRzeXlcIqhkGzR99yMZPlqIZGoFYmMrRI705FSi/rlRHB7aUVI4aiWYY1Iwfz+zLL+GZa67DiAR57rrrGbvfvhjhMLZpss/557Lm9dd55857qB0zhtWLFrPm5dfQA0Gy7XHS2Qzd2TR7nnU2o2ft5SkhPA1jT5vS57pitjSz/trv037/g+hVFUrJkzWLRUD3X11TYQe2jZVJI1NJJyedcl8J7LEH0dkHUHHwIYT32APN70ozxBTFhaFHFgeErupi2LaNFo1QceghVBx6CFJK0kuXkfrgfbpfe530O/8m8+FHWC1Nij2oqHT87GxP3ewR6GwGPaqS4m34zlUklrzB8O9/n8DoMT3nvBL5/YzYbVdG/OaXtF0+n4/vvIeljz1OfNlyVi54iKX338sBv/w1e1x2EQKIr1zOpo8+QQiNcF0to/abpVg8w8BKJOhevx4hwJQWO3zpRLqam9j44UckW9vA2dThuhqknfNl06JRsrZNIBpi+QvP09XWSmfTRj586e8kmjdgdyfY//JLiTU25sWgpzs6SHV2QMgg1dLEf26/i3VL3mTjRx8TiVaghwJseucd3vjZLznoe1djZU2EFJx46++pamzkX3ffi5VOKQdP06aisoqa6VM54Kor2PHE49Uc29IX4VoeXCFeaBrdzz7Dhuu+T+qTpQTqalQiEXfcPou8AHUomiZ2ZxfSMtGiUYwxIwlNmkpst10I7ro7oZkzCYwenVt3KXPyyRagKC4MXvBXf0DKPO9cv7BoWxaZT5bS9fe/0/7QQ6T/8U+0oKGK1fg2St6gnXgNq7WNwMhRjPif66k86STVXx8CgFzDn+uWn2xuZsVjT/Dp3ffS+cEnHPvyImpnTAVg6cOP8ORZX0cAI/bdly8/9zeFyLpOfPUq7jvkCKy2ONEJ4zhryWsYAZ34p8t48drrWP30M2S6ujjsp//LnpdfhplOY4RC/Puuu3nx8iuJ1dfT1dxMR7wZLRCBaCVSl8z57/9m9jcvR+rquJC2RDN01r39Ng8cczx6UAVmdbe1kSWLhk60sppQOEogHATT4oyn/krDbjtjmSoHlwCa3/+AZYtfoWPjBmpGjeTlX/+OVGs7k488jF2++EVmnHic5wRaFhxXf80wsDa10HzTTcTvuRdL01W2fdP0VstTTkhlW5JIZEcHRkMjoVn7EDvkECJ77EF48mRV/8e/1o5fnXC9qrcCbDHKkgc9eecaBuEZ0wnPmE7duecSf2ohLTffTPa99zFqqtSpUqhJkc7JVl+LGW9nzfnnU/viizR+77sYw0eUNOrlDcdNtueMI9LYyMzzzmXamafT+e571E6f4t2/7MmnySSTGIbOmIMPVLJD2kTXdbo2NpHp7ERYJhWNjei6jpU1qZ42lb0uvIC1Tz9LrK6eFX97lt2/Md9DYi0YQGo62VSKxhnT2XGPr7Bs0WJam5pIZ1IYlTFEQPchvmIjO9dvwEpnCQaCaMEA9bvtQuOMmYzZeSfG7Ls3/7jtDtY8/RxGMMSr1/+ILy64S2mSbBtbShp3nEmjYx8CCDQM452772bd8y/x4aNP8e1DDiJWX1fkPqMWLcdyCaDt8cdoufF/yKxYiaiuVU18iALS41Y1Q8fu7kYL6NRfcDE1884lMHFCrmtnT7gKFTe0e0uxW+Vg6yBLIbgaMfBOKumc1rXHfZGqOXNo+dFNdNxyK7Iypu4pcrBT9hgRDEIkROsDD9C55A0av/1tak45Bc2VVRw7QinwMjA6p5gRiVA7a2+lfXIe1rDjTEbstjvxFSuYcLhSGbsBW8n16yGrFrly7FiErqHrQQCWL34ZTYCORK+MOeE/aveoNE46qXSKcbvvytG//RXLnn6OO798OsFIlGe+dx2T99+fYbvukseGda5dhyE00skUh//4RnY8/TTP3gNQM2EC976+hGzLJpY/sZClDzzCtDO+7IRP646Li9KgCCHY8ajDiYR0nlq1lJknnUCkplpVDS6wY0lLVVPTNI30yhVs/PFNxB96CC0YQdTW5eWKVje45QMVctlt7ejTpzPmFz8nNmuW16cXZuFQj8F3WNk82DaQxQ/OZAlyqVW1WJThN95AcNRImr53HVTHcqpl4Tu7FI+CNEGrrcHa0MS6Sy6l/cEHaLx0PhUHH6LauRuuHDl3TjE3mtBDIinZ84rL2eXSC2l9/2PqZ05XOOu6k7z7H7rjzVRWN7DypZdYcMzxVI0YQTKRYP2rrxKrqqS9aSOT5h6tVKCOokEPBJ3H6mSTKpvj5KOPYLezzuBfd9yNHgzw3Pd/wBkP/8V5UfVfsmUTuq6hh0IM33lngrEoViarNIq2Td3EiRx24/WsffUNph11JI277Zz3PsoVBu8AySRaWfvRxxx8zbXsebKTFNzPpTvqWdfAuOnPt9P6u99ibmhSZTtQ1ET4hRJvcZTG04y3E957FhPuuZtAY4OyHTmyx7aGHIWw7SFLAXiKAcum9uKLyHZ2semmH6HV16q6kHmNhWfQxLQgGMAIB0m88hor/v4asSMOZ/j8S73TrNckDq6nsA9sy8IIhxm+565eggy3TcMOOzDl2OPo3thEsrmJ1S+9RDbZhQ5EKqvo0gQzz/4aO515uuPJrJ5rhMNoegCw0J2wXiklh131bT5++mlIpvlk0SLee/BhdvrKKVhWBoBNnywl0dpCpLrWS4UqdM1LhSRtmx1PO5UdTzvVG39J13UnyrVi2DAOv+JbTjun9IbAy6IvDANpW7Q//hgbf/Vr0v9+F6OyEr2u1is5lzdfLkGWeJntjYkTmXDPXTlEKVP8aFuErSPg9waujOEX5hylgDAMVn/1a3Qv/CuivhZhWspjVeSaFfqdYWhgS+yOLgiFqTrmKBouvoTIbruqJrYEux9GLUduKkrO52yUbHc3qfY2utatJ752Dd0bNhAIBKifMZPRsw/IE1g1w2D5i4u47+gT0KRk8pFzOHXho5jZLEYgwCu/v4WFl11JLBqjsraes15cSO3E8ZjZLC9deyNhQ2f4jGmMm3sUobq6IoOhdOYN6L0+iRf0Rc7yr+lezHzn03+j5dbf0f36EjQ9gIjFHHnTLantifDOd3dBFGtrJdNMfPQhKg6YXexz52ovt5Lw3hfYJpGlMBbDW2BHyM6sXsvKI49CJrvB0MkLMXOQxcMZnwMAuo6wbezOLrSKCqqOPoLaM88gcsCB6llIRZF621RlQI1VnaLl7ralyl7ppXXRNDrWrOU/Dz+OZhjUjhnNDscf6/HvZibDipdfIxgMgC2pnz6NypHDsZ1caHnPHwwnQveg0g1vCrqfe5ZNt9xK12uvIYVAr6hQzyr0miihBFBexgbZphYa589nxI03lMze4655f2tLbknYtpDF2URmUxOtt/6BmtO+Qmjq1DznOFefv+nWP9D8ne+gNdY5Yaj5E+zjAAr1zMoybJpY3V1ohkHFvrOonTeP2JFHKb0/5OJmBoI4PveYvLiLMimJimpfFt5T1L2v/75Sjd7ApwIGZfTteu4Z4nfcSfcrr2HZUqnvBeDkO5bev/nPzde7CGQ6jT5sBJOefQa9tsa7nvP10th0++2Exo6n4vDDtlmE2baQxdGytNxyC+sv+ybBHWcw4cH7CU6dlqs+5UywnUqx+qi5ZJZ+CrFoUcJqv3BZgCveYgpdx5Y2srMLoQnCO+9M1YknUXXiiQRGjPDulU7uLVf5MOjgY38EBWHB0k1g7hhSyyQgHMgzPXbSR0XMlmY6n3yCjgUPkHrnfXV+xRwNpJe/i3yK7YHIwxSBk0SxpZnR//sTqr8+L4/9cmNyNvzkp3x27Xcxpu7AjGeewhg50vMU35Zg20EWh6rY6TSrjjsRc8VSrI4OIoccyPj77gd8/KyDVB1/fZK153wdvbqqT3VelO+R/6R2Xl13woAT3djJDIFRI6macxhVJxxPZL/90cKRXGvLcobqIs8gzsFQgxMiIVGskTt027ZI/vMfdD36KF3PPIu5Zo1KaRWNIXBykPl2icz/Qr5J3geajkx0E545g3GPPQ7hkJJrhPAy6XT/698sm3sMemWUVFucsdddx7D5lw56NsnBgG0HWRwEiD/1NzZ8fR6isgIpJGZrM6P+9CdqT/iSbwJV0Rqha6w46xwSTz6p6otYVs+HrvD+AUqcjJqjss6kkIkEmm4Q2mE6sTmHE5tzCOHd90CLxvLudw2qQ0p5BgIuC+gae32COoCdSJB85990v/IKnYsWkXn/fUQyjRaLqtSzeRStFIn2ParMEISuIzs6GX3PXVTMOTwfARxkWXXWmbQv/BtGbS1mMklwyjSmLvwreizmHaDbCmw7yCKVhXf1SSeTfmsJIhoFaWMluzFmzmTywqcRbmSeezJpOqlly1h+1FGIdAaCgVwEXZ6SnyJE8TdxM4C6CgEEyrFPSkimsJMpiEQIjZ9AdL9ZRPfbj9DOOxGcNBHh2EjcW/FbnrcUAhUiRoGHhAvm+s9IvvNvul5aTNcrr5FdvhzSaUQkgohGVHl2yymh4ZsLbxb7s1MCQezmjVR/9UxG/vyX+UFZLlV541WWnXgSeiSm2C7DINseZ9zvb6HulC9tc9Rlm0AWLxn0osWsO/MMtGg0p5LUdbJtbYz8+S+pO+vMfI9iZ9LjDz3EunnnI2prlKBr++K5RX5Yqss1FKCSMxDFZ+f9oGnKyGdZyFQa0hmVPbO2BmPCRMLTdyCyz16Ed9mZ4JQpqopAfpe5U9oVaJ1xedAXZPKs4LnBKWqmORSxoHk2S3b1KtLvv0/qvfdJvvMOyQ8/wty4QXnzhsPo4TAYAYXcto3wvXhujDmmSxRMTalRSwkiqJK9B6dNZ/xjj6O76VQdoV5p+mD1mWfS8fwLaFVVCMtCahp2dxfR/fZn0oMLcrUgtxHqsk0gi0tu155+BomXFyuB0swFXdmmiV7XwKTnn0Orq1X3+FSNmq7TeusfWH/11egVFeq0t8zy1KTkl4Kd4BhschofHKObpvhu08ROpyGbASRaLEZg7DiCkycR2X03gtOnY4wbR3DsOLTqfAQabLA7Osg2N2GuXEVm+TKy779H4sOPSa1cjRVvh6yJ0A20cAgRCCA15T3gqrD9Ycr5lpI+QJ7iToBhYLW1oE2bxrg77yY0aVI+VXHlzYVPsva8CxzljKVkI1BhEN1dTHjwUSpn7zckKY0GClsfWWwLoRt0vfkmn512mooatFRsvad6DRiYLW00nHc+w2/6YbGe3lmAtocWsOHKK5FdCbSaKiV/5KUSEup47EEqd3OVe+dpqdlx2RMhHO0USvWaSSMzivLYQkeLVaI3NBAYMQJj9BhEYz2hkSMIjBiJVluDXlODUVuj5ASvnotLjWxkJuvlT7ba2jHb2pCJbqzWNsz168isWEl2w3qyn23EbGmGrg7ImkiBOjCCQTAMNQ9u7jY38lQ400HO6u5c8r1ynnnR9/75FFKxfRpWOo0VbyNyyCGM+s3vCI4alY8ojleA1dnFquOOI7NyhRqjbXvzLXSdbEc71cefxPhbby3pm7a1YBtAFsVqrb/iSjrvuxe9RkXTSam0Nv5yCLKrm9G3/5nKo+cWuUq4rFzinX+x8ZprSbz1JpqUiHAE4Tgq5giNT3vjZ8glOcTyt/OxUTLXmjwbg8Czo0iX4bdsLDPrpV5VCy8QmqEoY8AgEIuhRSJIV3HhvrdtI7NZxbJIIJ3BTiUUu2SaKvGHlx7WUNotwwCh5dg1NxN/8csCyk1eCN2n8ZUeKyq99rnqlzk3cfWPRJU8lMkUdjqJNmwE1efNo37+fLRAoABRcl7K6674Np333I1WU41tZn2cpUPNBWBLJj25kPDMGUOahKI/sHWRxXGnyKxby5rjj0d2dDi2FNfz2DnhJSqq0cyix6KMv/9BQjvtVBZhpJR0Pfc8nY88Quqf/8T8bD1mMunuZ/KUx65wr7kGQ4GwJdK2lH+U0BCBoMpabxhIqQLYCm03hd890JwyEj41s3SQUjhx6rajFMizoDqntVdSXFORhJ4B023rIoXXse/hpQYlhJOEz0Y6bKSwVZiypumKWiKwbafEt6uSlzh1M1VPmqZha6BXVBGaOpXo0UdTecrJBMaM9hQd/g2uoh4DNN36BzZdey16bY0XEuGtsTtSQ8dsi9NwxhmM+PnP/j+yAB771PTLX7DpppsI1NUhnbh0KaXP4dWZTF1DJpIEh41izAP3qfjrQmc8x5jlbiq7rY30R5+QXrUKc8N6zHhcxXRoAi0YwqisQouE0SoqlaCpa6pYUDxOevkKMp+tI/3RR2SXL8Nub0cahlJA6Fq+IVQU79W83wovFH70TmtyJ70n2ApP8SAgL7G6M1lOF2Ue7lIIXUOmM8hkN1ooTGjcOMIzZhKcOp3A8GEYo0ZBNKKUIlkTuzuBHY8js1nM9nbMrg4nrscgXFuDMWIkxowdCE6f5qmlvQhGkTsZpGWhBQJseuhBPvvGZQRilWpEhbFJMvfetrTR0Zj43HMEJ07waoJuTdh6yOK6trS1s2LuXGTzBsVn+1w5cnvCd+rqOnZ7B/q4CYy7+3YiM2YWJ9xz3UDKqFD7C3Y6TWb5croXLabj2WdJ/fNtZCqJVlWtnmH59c7OEAo78QhCsebKr3HKwzeHFcwXvn2/F/iCFeKQcMmmYSCzGcyODgKjRlMz9xgqvngs4d12Q6+sZHPBi4UvdLmxncQVQtC6YAHrr7xCudNorgxV2JHv3Qwds7mFYRdcyLAf/bDnTJdbCLYasrharKY//omma64iUF8HpqvyVZsnL/+t+78tQdOwOrugvpaxP/8ZVUfPVe1LZan0uXWUgp4QyTvldZ+1G0n362/Qetuf6XzmaTTTRK+sUul9/FNZ2LEo/UMP6OW9RxGSFN1SRhnh1J0043G0mjpqvnY29V87m+CoUbnmRbmXXb168XhKivulPIV9fmZ2MkHLT39Cyx9vU14BQhQjil9MdL8LgZXNEIhGmfTSYvThw7wDdmvB1ovBFwI7lWLp3GMwVyxDD4Udg2JOdC5W5eIIioCmYWfTSFMy7ILzaLjim2gVVTmkGUyDYJ4fVS5nQMcrr9D84x+TeeN1tKpqpKZ5ToYeFO30XtFTfSpS5+bf77JleYvnt8EYhirKmkoTO/4EGq74FuGpKo+ANM3c3AzW5vOFVbiGxMRbS9h4/Q0k3nobvbZahUIUOpdCaWRBFVTNbmph5DXfpfFb39rqRsqtgyyuqvexJ1h34YUYNZXOCdfDPX5kcb66fLLd3kFk152pu+gCquYei+aUfpAAptkfq0EeCIQySBZuKNfpUdeRZpaW3/+WTT/9ucolHImBuxlVJ3k9llTElXt+CQTL666A3/eYPMPAam8jOHIEjdd/n8rjT1TDLpcf2rbLUt6iZ/of5/5ekHQktfRTWu+4nfb7/oJMZdCqKp08yyUoYDliLKVKRphJERg9hinPPo9WWbFVqctWoiyK0Vpx0imk3lyCXhkrjo3Ia1+CWVESIqDYJDuZQFom4SnTqTp2LrE5hxPacSf0SHjzh+tmFinYaCpnlfLY7X7jddZeMp/sihXo9SoO3W+/kJ4yqh8L7VNfl2bBcptPIEFTFQPs1lYqDptD4//+mODEiaUjQr24Fb1/YyoBEshuWE9yyRu0/+0pul9chNkWx6isUlb4wgJFRe/he9283yTS0Mm2tTLqBzfRcP55W5W6bHlkcRao47XXWPuV09FCIVTBnzLDKOLHSmmWpFoUIZDJBDKVQovECEyaRGjGdEKTp2KMGoXR2Kg8iDWB7cZkWKayZ6SSWPF2lR1egl5bQ2DkaEKTJmI05GoUFi2WxMkor5Pe0MSqiy4i+fxzhIYNU0OzpZ+gkEdaeoMSsSwl50Uqtkumk4i0Rd2FF1B39VWIgsKyqq2DJI7XsQTSK1eSWb4cq72dbEccLBstHMGorlKJKYwgUnPGIzSwLMxUksza1WSXfUp26XJSn3yC1dKCbUu0igo03XDKjDjvX0IB6M0fxb8pRYeiIlY6RXj6DCY98ThEoluNumw1ZFl3/kV0PP4Y1FSDUwqhLBQIsrLkRLmMr7KqS9tGplLIjKmSXgsNYehIofJV5dK8qi0jbMA2PTMcQiCMAMbwYYR2nEHtsV+g6gtfQK+sLJklxrXx2KbJZ9ffQNuttxKIRBChoJcmtqTKuAzkq47zr+eIqjNaQ8dqayfQ2MjIn/yEyDFzc4FhfmriK/tgblhP/KGHiD/3vNrocYUk0s7VXHEVBJoQ2B6OK7W8ZZkgJZqjbROhkHJ0lTjz48pVQr1G3hnhQ4kyyJK3pobSgI755a+o+sqpW80FZssii4MoyU8+Ye1xJ2KbGbUIfvcJB4oUO7107akF/Ddqwllw4cg5+XVH1Ikvcie/t6qOJd1WLiek02BLwjtMp/HiC6k57Qz1OoWntqOuFppG6yOPsvGqqyDehl5doxDGZ4iRZV4oJ6YUolfB7LjIKiV2W5zw7NmM+MlPCE2bUlo2ceREO5mk/Ve/pP3Ou0h/9hkyHIJIBAIBzwBaitXNl7LyKZ6LmDnDavGIvbkuBJ9XRMn7ULKpnUgQ23sW4xYsQOqbGRU6QNiiyOJFxl11Ne23346orlFskCxkVfqILAUaYvfO4hcSPo7FPc18lKioU5nrU4DQNJWvPJlEpjNUHnkkI268gcCESSVtPK5bR+qDD1l/zdUkXnmZQKwCQiHPBb7UO+a/kiixH5wLmrOpuzrBCFB9wQU0XHmlR9kK2S5Q75B4cwlNV19N6q23EZWVEA5jOxtcOudEyQ1dqGgopZ3wNr10Oa+iPsohCyW6EwWfpa4hEknG3nU30cMO3SrUZcshixMgld3YxKqjj8Hs6lAnfoHOPc+bwz/QXr9Ivx4g91gPSwqQwG81EKWR0W3ncRGasoLbbXGMEcMZfsP1VJ9wkmpnWyXZMmmatPzpD7T97hbsdZ8pp8lIWLGDtu3YZvIpa+5/Z2A+V3wpJXZ3N3YmTWyvPWi85ntE9j+gLNsldB0JbLrl92y66UfIdAatstJLageuO45vPvMFB9+Yyp/m+S4rssSalmBB3TY9aOK85rqO3dlB5dHHMPrPt20VuWXLIYtlIwydpp/eTMtPb0arrYFstmCScwqgkshSMN/57h3F/K8filWj0odAZbAl7/ky11TXkak0ViZN48UXMuzq7yKMQGm2zHG9ya5dR/z2O+hYuJDMquUqc2UwiAgGlE1E09Dcs9fdoK59x7KUH5dpIsIh9Gk7UHX2WdSeeipaIKAyTBaouF1kNePtNF19DZ0PP4RWGQNN97Jaytyb5Wa1R7GqcJcXfM/7T/ocvH30snBtFX9cdt7z7tYEtpll/MOPEN1jzy1OXbYMsriuLZ0drDh6LtZnGxDBQM41uwSyQMGS+H7wh3PlT3x59saPSYUCZeHSl3mJ/I+a0gzZrW1UHHYoo375C4xRo3tkywDM7m4Sr75OYvFLpN59l/SqVdjtbWjprPLgxXaIiVIwiICBaGwkPGUKkX32IXzAAYT22ktRLShyWHSNfkLXSb73Hhsu/ybp995Fq63xQh8KpiP35r0eGI68VVZ/RbnJVy0L+s8j8IU3luA20HXMeJy6U77MyF//eos7WG4ZZHGEy+ZbbmHjtddh1NU5xsIC0u0iQ0lkKc0IyMJv0t9TYZseSE+/wTmXgwFkWweBsaMZcdOPqJhzBF5OrR5Uti5km5sxV61BNjdjdXZgpZIqEjMUQq+pxWhoQB8/Hr2xIf/JhQ6L5KgJQOt999J8w43Irg6orFRu/QVjz019X5ClONFHPvPo67GMMFZy7cohS/6tefcIdCY+8zTByZO2KMIMPbL4XFuWH3cc5ocfIqLRXDaW/BkrOn4KqUruk+sunmOlCqkUucPdP6CSHwselmtQbnZ8+0sYOnYyjZXNUHfpfEZeeQUiEFRUptB3yo2NgX4ZBN0gsFJuKp6biaaRaW5i4/Xfp3PBQ2ixCggEFOIWPcZ/pJSS2Eu9biEb5r+W67eIqyrAxXLLUXpsBcK+oZNtbqFh/mUM//51TpLz7QRZvKR4jzzCZxdfRKC6GmnavokreHwfkAUoCHh0kcX/3TeGsgvifuxJZskhjLelSrXVNIRlk2lpJTZ7f0Zedx3RffYBwLZMNd5SriZe9GLutM7XXxQjh3uf61UgNGU7al3wIE3/ezNy5Qq0mloncKyQxy0F+dvYe08faS+P0iV+KVQH93Qe9LL78m6VqIPXzKBFK5j80kuK4toyV15xCGHIUVI45cw6FyxA0wRS+tGkQFoohShlQOYJioUtC/op2ZHI/RVFV3x/hWd/yMWrlygWattIAYHhjaT/8TYrTjmVz674NulPP0ZzIxk1rdjL16U8uu5EPereZ9wCtYVe1I67uuvuHl/0IstP+TLrL70MNm5AuGmh7BJu8D2A+zab3dqH3wNVWJXsXaDksVCIzIb1xO+/X6nQe1EQDBYMLWVxZJXuN99i9SmnIIKGyvfl/JzH85Yg1cUEpXjmixQCZWh84f4s0WRg4BzDeSygruI17PZO9Po6KubOpeqLXyS6994YTvzIQBfYSz4eb6frpcW0/eUBEq++jJbNqpKCyBy75o4P0eM0lsgN44zRfWbJkfRhtD0pXIqa9RlRJWCnU4TGjGHCs8+rtLJbQJU8pMjiGiHXXf5N4vfdp9y0TSuf1ejtBUseL75v/kPXj2rFmNPLA8prY/p6q8zbHE6Nl2wWq6MDNJ3Q5IlU7LknjVd8G2PC+PxN3Rs4myH73n9ou/ceWhf9HWvFSgQCvSKGykmRCw8QiBx3mZvskuMvLR3k3qjUEdU3DaLTRx/kPl/zHnpyJFOJSpHVvonRP/wxdfPmIU0rlzppiGDoencMYqmPP6Zj4UK0ygqkZXuWYvV3cE+CntmIckxWTnj1pWbIb1auC//1EiOQpvKzMmpq0CsipD/9mJa/LkRqjpasH9TFFeIzK1ez6Te/Q65fj14RQ6uMKbccM5/lynOnGeTjsL/d9bTKwvvXZYl7FJB8yjMbLRQmfv+DyExmyBEFhhJZpDrn43/5C7S2KcOblHmbc3Nhc3DNw1XfGrkX/X9yjXsZsQ9PPA2dUIK7WxfeylgMu+wyguPG5GLV+zpepzhRxRe/QOSYY7GSSXXuW5Z6VtEWLh2RXwokomzr3vroHXF6Pr56knv87HWhfCpsiR6NknjvXToefUzJLj2FeQwCDA2ySKnIZMsmOh5+DK0i2vuLlJvTnlaj6LfiTCFlH9X7ced8zBfo8wX7nvoVuf81gUylCY0ZS8NpX8GrndhPcNmsxksuUSMoFXXojq7AU7MkMvTKefZP5C8HPS9hGaOMg8DlHE4BhA0ioLPpT7dhJ5JDHqM/NL07LEP7ww9jrl8H4bCn9itaAN+p7WlP/E36u1YlV6aAKy+SdkvwVz0tUg/3uv173IRQVMHs7qZ23rkYo0YpS/oAFlboOtKyqDj4ICqPOw6rrR18yQZ7pNpOyqES5wv+s7t4+nqnHW6//eb2JKWJYq/gvJ9to0VjpN57l+7FL+W0jUMEQ4MsmoadydD50MOISFixXyXYmHJndGl5tMwp5+fTe7d2Dfyg7PMhm2PfBCh1eSpDePx4Gs48Y8BUJQeKmgz75jfQo74I07KT6Hz1vpeYlwHLNKVRq/BvT3f3NKy+jE1I1Uf8vr8M+BDqKwx+z44NoPvFRWQ/eF/lLbbLxCyUlKYL2R2g4BvgKbwkeTa9gi/5D+zLHs3RBx95EAUNCsfi3ud7htuHpmlYqQS18+ZhDBvu5L/aDGTRlOwS2Wlnak85GdHeoSqZ9WHD+2hfMeRRmJ62usphJvqsnOhLu9LPKhc9m3fdstBiMbr//hLJt9/2EsMPBQw+sjjW5PY778zZUUoJx/3YuCX2qoI+rVePYmTBs0o9p2cB1buvmLNEaCr/b3DyFOrOGAyqkgMpJbWXzVeJ0rPZHnn73Kj62Hdvv+bZRWTuej97yoPNmRZNw8qkaL/zDqevwZnjoscMZmduorWORYvoXLwYUVGhstnL/LND4PuyObMk8jes2rQ5wcejT708ovhnv8Wkj0e298FHkXQdO5GgYd7XVbElJ2R3s0FTsTChyZOpOuurWPG4F7dSfrSlLSZFTZy/PfZVopsh2Z6ydL/+sUnUvtNiMTqefpbUBx8NGXUZVGQRTlLqtj/dDo7xsUfj4Obo/8usTpEcVFoAKguSfNNi/8FZSk3DTqlKVtUnf9mhKoM33QJFXerOOw9j2HAV+uyQuEExq8jcfyURx8eObo4Y2J/reQMrGJPQAlgd7bT+8Y8DHE3vMHirZ9sIXaPr7bfpXrwIrapSUZWCaR6ME6icYqBkoz48fcBKmZI9OaBpmF0J6i++BKO6WqnOB5M9cKhLcPRoas48A7ujyws8GxomxIUh6l0WfuxhNQqHIB3qUllJ/IknyKxereZikKnLoMssHfffj0ylVIkH3/tuzgnUL+j3g2SZz/QdgwraCKFhd3UR3mVHar50Yi7n2CCDS13qLzif4ISxyHQaobEFJrqsFLmZUFr+ET188y5JiQgEMFs30X7fX1Qvg0JiczA4K+hshvTatXQ/+4xyFrSH1prqgl8L1fPB3dPOL69BK7kXSgnzjlpO2MoeTirD8Mu/pWqvDFVdd4c3N4aPoPacr0FXQlUIyB8ZOeNVD1BKvef1UKid9Pef+14oP3rKmYK+hcQxqBY8sweWPf9pxRojAQjLwohFiT/yCFZHl4pzGUSEGRxkcZz8Oh95BHP9BkQwNEho3fMClzpx+r0lC6XFvt5T9Cw35lwgOzuIzj6AymOPHTKq4oFQOdJqzjmX4I47IJPJ/stGvfKzm9VBDy3L2Hx6ONd60k1KKRHRKKmVy2h/9GHlAjOIrNjmr6IT7202NxO/9y9oMcexb4Dd9ZWLKkeaN0cs7wv4KVnxQJVTiZ3NUnfBhSqJxFBRFW9AakPo1dXUzTsXO5V07DibcVh5WsbBkTB7lDEHPMx86iIFSi0vJVowQPt996tyioNIXTYfWZzN0PHIY6SXLlOuLf3B5h5OkPLufaU66U19UwYKJrywx1678bMruo7V1UVo/wOomHPYFivAIxxhv/rUrxCeuSOysxMlvJR/g5LcpU/rPXhQgt3yRjCwJ+WzYwUHpW1jRCtIvPNvOp9+xqEugyMSbN5KOg6TdlcXbffcrxDFV3KhJ60x/lYl2ZocFPPCxV24wym63ptB2v+AMs2kr5EsMRI3L5bQBJZpUn/++crLeqipijd+RV20cIT6S+djZzK9PjffzDU4NKRPUM522c/TP2+8bhSr+x4SdEPQdtcdnkfJYMDm9eI4THY+/yKpjz5Ai0ZKU5VBFLLKzWufRKReVMkD2TDeNjN07M5OYoceSuVRcx2qsgVzWjnUpepLJxHdf3/sjg6V5rSc8qK4hxLXBkGh3pfDss9tS4N7bEmXR7YlIlZB9+tvkHj99UFzsNw8ZHEwNv74X4u4jVIUoBSFKKVnKQVFHgAlrvcIwvehBL/RL0QpVDIJTS2WptN48UWq7Li0B5uf6WVMwtNKNvzXN9HsAv+tPpktyg24bxoQVysoSlHyooXKXcj5Q8t+sdFl941QG1vYJm133K6uDQJ1GXAP0lL1ybveeZeuxS+pOGg3xU+J9sXXCl61h8nJsUG+O8qxwv2b7z6BKPriQ3chEIaG3d1F5LA5RA8+RPHIW5CqeOC68B96GJFjjsJqjyM1PWfk63FCSsh9Rb/noDRaFc98TwdhKXwa6MoV4aGp3Pe7XnyB1DvvDAp1GTi6OSdz+z33Qmdc1XGXPQjkfTXuFcyVLPjkZQ4qbO87mPpN2SVlnZXLD7Tg/oBO3TnnOBqZvvYzdFA//zLsgIGwbN8BUkZVWwgeX0PRepRCBOFe97VzQre8W3LawxJxNeWQs4/zWJaA6TpmIkHLbbc5g9o8Uj8wZJESTdNIr1xF1xN/dRwmnfDWnnZciUkvK7gXLpTQlFeAV+1WrYDQ9dKTUIgw0vfBn6urcE0KEbBsv86i6zpmVxfR/fYnduCBW78EtaZhWxYVe+1FzQknYsXbS2bVd0GUuNZ/kOXXTujOmGwnWYnIpXvyHSwuC1e0GAMcmwRVfS0Wo/Ppp0l9slQ9czPsLgNbVUfL03rXPdhNG734+txIeyDD/skpsRv9J5UUqEQEmo5tmpgdHWQ3tWB2dmIjsLJZsq2tqnJXqYQFPqTw/rjz76dQPYEfyXzUzaNkUmJJqDln3pDGUvQH3PluuPgiFU9kmj67Se8SSkkoJqZFcyfz/1FsYVcHVkccOxDErqrAzGbItrVitbcjM1mErioT+A88V+7xxuzbM72O0VtTtcCabmBv2kT8zrs2W4Tsfyokp4hOtrWVFYcdgdzUDMFA8QuVyU1c8HNBG0dq1jRsJFY2g5VIgJQYjcMJ7roLFfvvT2TmTAJjxyKTKbqWvMGmP/4JuWYtWkWFT6de5rWKBZBewRNTCq4KXScbb6fiqGMYf/ttWzxRdY/gZNfZ8O0raLvtDkR9fV4a1z5NQ+EUiqIPuUZuW189GDMeJ3r44dSdO4/Q1CmIcIjMus9IvvceiVdeIfnmm5hr16jkE+EIIhzOHTil8oCJ/EeR/0jfb84Y3JIamSxGTR0TX3gGffjwAav0+48sbqXhBx9k/UWXoNfWIm3TexO1sYoF9yLNmH/RhFPaTmjITAYr0Y2NxBg2jMg++1B56BxiBx9MYOyYkkNKr1nL2jPPxFy6DGKRHlwc/BowWWJUZe/K++zdKQRmOs34hx4mtvde2ySyZFYsZ/VRR2NaTnb/cjJKKSiLLCV+A4+KC03HjLdRe+48Rtx0U9nus5s2kXjzTSWEv/wKmZUrVeRjJIIIh9QD3XLgkLev/DV2ckMpgbhSgmFgNrUw8n9/Qv0FAy/i2m9kcXMXr//Wt4jfeTeitgZpKWQpQhTfwPNYLulqbzXFZlkmdiKBzJoYI0YQ2WsvKo44guihh2KMGpm7za0a7HuOtCy0YJDUBx+w5ovHYUtb5eWSpbBU9BU/PKwQvq8ujVesuIbZ1kbFcScx7k+3qorA2wqiOOAmOdz4ve+y6dY/YNTVqlxmhVBqTqT7Q1+3h3SKzWrI7g6Cu+/JxCefVKEE/uTdUnoRo/4Na3V0knzrTTqfXEjq1VfJrFyJlEqjpYWCSipy7nUfJ33rUWqcnrOmJsi2x4kcdCCTH33EqTTXf8pi9PcGNyLPWrUKYQTUSVKwpTxwyGCOTqpM72hSZWpMdYFpEqitJ3bgIVQcfxzRgw7MoyBuhSq35knhiSA0DTubJTxzJlXnfp3Wn92MqGsooSbsx+S4VK9orzgXJEjTRESjNMyf39/etxi4vlI1886n7dHHsRPdav4KhWbZE1L0BWF8hwgS27RouPhSJyOnqWRa79TM7Rb38APQqiqpmDOHijlzMNvaSbz8Kl0vvEhi0SLMjesRSLRIFC0YRAK2bYHte37hqP3IboOIhEktXYq5qRW9oX5ArFj/kMWRV2zbItPZVZR4IY+x8Y3f2+DZLFZXh6oCVldLdM+9qDziKGKHHExwxrRcP27ybE1T2el7GZZwtGM1p32F9tv+jMxmS7ND/ceX/L3i/m/omC2tVJ96GtFdd9omqQqA6wYTGj+OmpNPpvW3v8GorUPKIQqfEAI7k0EfPozIXnuqa64XQZn23t5wEUcI9Noaqo47lqrjjiW7sZnEW2/R9czfSC95E3P1GizbQo9GkYFA7l4pvfipwj0oQbGGySRmZydGQ32f6aUf+ocsjpVY03S0ykpHYPSL5+7xonnpNGUmi93VhZ1Ko9XVET3oEKrmHkv0kAMJTpmUd8p4NRH7u/E0Fc4cnDCR0IwdSP7jH0qdbcuC0hQ56HGyCu/xBBVFRaVlodXU0vCN+fRoW9oWwMkyX3v++bQ/tAC7q8srwe006PF26aiFC6ck/7tqIXQNM5MmvMPeBIYPw+5Pgg4hcsWfPMRRVQmqv3AM1V84BnNTC92LX6bjxUV0L/471sYNCGmhhaOIUFCNx5Fxcmyz9KJKtcoqAgNEFBgAG+a6VFTOPZquJxcSiEVVqQSR4yntbBaZSoGU6A2NRPfbj8gBB1Bx5BGEp0/NIYi0sS3lX+aVXRgguLJU5OCDSbz6OnqV5iSIgP4ySYV4kvfNMLBaNlF99tmEp++wbQn1pUAIsCxCo0ZSc87X2PTDmzAa6p2Q755ZrEKC6mmjpJugtuCgEAJpWsT23kfNyUCTdfsQx1/ESa9voPqkE6k+6UTSTc0kliyh86m/kXzjDcw1axG2hRYKo4VCDrvvvoAk07KJ+rPORq+sHDAnMLAs+lIizSwbbriR+D13oyW6kZaFrQm0QIDAiOGEdt+LyqPnEtl3FsGxY3O3+itYDeYmc7Q/XUuWsPakL6kIRW+ZSwv2PSqGPG1dbkMJZ+PJcITxTz1FaOzYrW+E7As4MorZ2cHKw4/A2tiECAV6JK/OG0OZOcxRG0/CRgqwU0nG/+V+YrMPHPyDREqnDo5A8x2smeZNJJa8Qeezz5L85z/hs3VYXd1gW2rIkSgVp5zKqP/5PiIScV5gS6iOvTvVNkovX07qH2+TXbcOva6O8OTJBKdNQ28clntHV4s12AjiB1eeSiZYMedIrDVrlPrRrUJVZm58WyEfhKffw90WuqFjtrZSe8klDPvetVulFvuAwVH5t95+O+uvuFLx7Y4SpKwyzA9lNpcAR12scncFx41lwpNPoVVVD22Iglv5rFCrlk6RXbmCzJo1ZFvb0IJBojNmEpo+3bltoEzYQNgwFxyhKjRpEqFJk/J+kvSuxRp0EAJMEz0SJbLvPnR9uhRiEbVJ6FnXU/qiKPgqsLNZtGGN1Jx1tpr0bZ2i+MENEPvKaTTfcSfWsk/RIo7za5/2c7GUkvuiKqLJdJrYnnuhV1UPPXvq21N+k4IWChOePoPw9Bn5o3fl681A3s1zpNQ0hRSmiZ01sU1T2Vzc+u/l/LaGGGIHHYSfLgwMXN8JB8005VlcffLJBMeP33KBXYMFbvhxJEzj/MuwEmlv+M6b5jfvU5/5nwUQ2Wsv1ecWKl2nnu3zN7Pt3J403T1pla7n2U8YBCd/JZgLw6mHqG0dBHHHIoHo3vugDxuGzKTVRnB3g7d+vSykr73HiJlZ9Jpaas/6arGd4nMCbo2X2hOOI7b/vlgdnd7p3+uK+Szm+Z06P1smemUF4d12V5e31h7wKYuEW6Nzm4iU3NbAUW0HRo/C2GE6VirlS97goxR92Os5Xb1UhYg6uqg44UQCEyZjfx6E+nJg2wjDYNjl30Cz7R6RpND5wQ/+KRSaQKZTBMaNJzBlqlKsfJ6obh/hc7riPYCzAWIHH4SdySq7yED6cf2KhEBms2j19dRddJESZj/PG8ENEJtzOLEjD0d2qiz8CHx//R4ZZRTp/stOAvTwXnujhUJeecDtDbY/ZHEWqeLgg9Crqh23F0ERJ1YWCsJxNQ2ro4Pas75KcOxY7MFOw7pVQB0C9d+4DEIBJ6zAjy2QV26jD0n6pKYRPfDgIR311obtElkkENphGqEpU7DTaZW/ywdlkcbl1JzPUgqsdApt5Chqz/m6pyL93INT4yW69yyiRx6F1dlZVltZgEK5iw5IlJYwMGwEkd33UD9vD3NUAra/t3IMh1ooTHT2bGQ6q9xvSkDpeoa5X9EEdjxO3dfOVe4b2wVVccChng2XzkdEogOOTxeahpVKEZo2neCoEUj5OdMS9gO2P2QBbyNEDzoQOxjIy2Xmb+PmJ/bAx3lITVNC64SJ1J11Rs5mtL2AE34c3XVXqo4/Dive0astLM9B0dWVaAKZNYnOPlD9VGqutxPYjlbfB44KObzrrhhjxmGlM0g0ZLnyWH6VstNEM3Sszk5qL7oI3bV2b2cnpmt9r58/H62mBpnJ5Mv5fbhf2hKCYaL77quubWdz5IftE1mE8gwO1NZSMWsWdjKlHPoKCi/KvE+uU6AycNmJJOGdd6X2tNOHPrn31gKHuoQnTab2nLORHZ0I3efUUU64c68LDZlMEpgwnvBOOw44qOrzAtvhDlDgarQqjzgU3fGIBnqQ7tVZKlB2A2FmGfbdq9ArKz5/1vp+gNA0VUHs/AsITBiPnUp575pnw3XtU55xUiI1gZ1MEN13H/RYbLukvn7YbpHFZcVi++1PaNQoyKTzF7IAYTx1sW5gd3ZQMedwKo84Qm2Az4uz5EDAocJGfT31l30D2d2tvDBKHCjSE1Scv5aFNILUfOGLqqstPPQtDdsvsjibQK+vJ3rEHOyu7r6xUpaFEa2k/jtXldWibW/gZeE//TSi++6H3VFa2FfpiXL+cjKVIDxlCtFZs1SD7ZFV9cF2/XYutaj4wrEQMIqzvrjr7tpWDB27vY2qs84iNHPGth/YNVjgRFMKw2DYD/4HIxhy0vP62vgjwSSgCcxEgso5h6GHw9imuV2zYLCdIwsOPx7dfz+CM2eoDDKaK8b7NT5KLWx3dBLaeSdqL7t06ErbbaMgHA/y8C670HDNd6C1TTki+sLA8sCSaKEQVcfMVb//H5ir7RtZHFZMCwapOelLyEQSzbcBAKUt1nTIpBHRCCNuvlnFY2znmp2SIDRs06TmvPOpOvMMrOYWMAIehXar02iGgdXZSWzWfkR23+PzES06CLDdv6HLj9efcw7h3XfDam1FBAIqwk4IhGEg0ynsrMnIX/yK8O57qCRs/wcWvwhEbr6G/fgmwgcdjL1hA1pAd9LoaoqdzabRDJ1h3/nv4tS92zFs/zvCURuLaJSxv/01walTsNvaEGYGzCxWextaVRWj//RHqo49ZsDZCrcbcNPuRiKMve2PVBx7DHZrHJHoRmRS0NGBkDDy5p8QnbXv/x25DjYjBv/zBk5CC7Opidbf30ri1VfRLIvIPvtQNe9cQpMn/X9E8YMbNm1bxB9YQNczz2K3thIcP56qM04nuu+s/1OIAvD/AAZCbyRGyvGjAAAAAElFTkSuQmCC", calib: "05/2025", venc: "05/2026" };
  if(d.state === 'maint') return { img: "data:image/png;base64,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", calib: "07/2025", venc: "08/2026" };
  return { img: "data:image/png;base64,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", calib: "06/2026", venc: "06/2027" };
}

function getCalibHTML(d){
  if(!d || d.certificateHidden || d.hasCertificate !== true) return '';
  const info = getSealInfo(d);
  const certificateUrl = d.certificateFile || SAMPLE_CERTIFICATE_FILE;
  const certificateName = d.certificateFileName || certificateUrl;
  const safeUrl = panelEscapeHtml(certificateUrl);
  const safePreviewUrl = panelEscapeHtml(certificatePreviewUrl(certificateUrl));
  const safeName = panelEscapeHtml(certificateName);
  const previewHTML = certificateUrl
    ? `<iframe
         src="${safePreviewUrl}"
         title="Pre-visualizacao do certificado de ${panelEscapeHtml(d.name)}"
         style="width:100%;height:100%;border:none;border-radius:10px;background:#fff;">
       </iframe>`
    : `<div class="calib-pop-sheet">
         <div class="calib-line l1"></div>
         <div class="calib-line l2"></div>
         <div class="calib-line l3"></div>
         <div class="calib-line l4"></div>
       </div>`;

  return `
    <div class="calib-wrap">
      <button class="calib-seal-btn" type="button" aria-label="Abrir certificado de calibração" onclick="toggleCalibPopover(event)">
        <img class="calib-seal-img" src="${info.img}" alt="Certificado de calibração">
      </button>
      <div class="calib-pop">
        <div class="calib-pop-title">Certificado de calibração</div>
        <div class="calib-pop-row"><span>Calibrado</span><strong>${info.calib}</strong></div>
        <div class="calib-pop-row"><span>Vencimento</span><strong>${info.venc}</strong></div>
        <div class="calib-pop-preview">
          ${previewHTML}
        </div>
        ${certificateUrl ? `
          <div class="calib-pop-actions">
            <a href="${safeUrl}" target="_blank" rel="noopener">Ver previa</a>
            <a href="${safeUrl}" download="${safeName}">Baixar certificado</a>
          </div>
        ` : ''}
      </div>
    </div>`;
}

function toggleCalibPopover(event){
  event.stopPropagation();
  const pop = event.currentTarget.parentElement.querySelector('.calib-pop');
  if(!pop) return;
  document.querySelectorAll('.calib-pop.show').forEach(el => {
    if(el !== pop) el.classList.remove('show');
  });
  pop.classList.toggle('show');
}

document.addEventListener('click', (e) => {
  if(!e.target.closest('.calib-wrap')){
    document.querySelectorAll('.calib-pop.show').forEach(el => el.classList.remove('show'));
  }
});

/* ===== SCRIPT BLOCK 6 | count-fix-real ===== */
function updateCounts(){
  const cards = document.querySelectorAll('.card');
  let normal=0, att=0, crit=0, maint=0;

  cards.forEach(c=>{
    if(c.classList.contains('blue')) normal++;
    else if(c.classList.contains('warn')) att++;
    else if(c.classList.contains('crit')) crit++;
    else if(c.classList.contains('maint')) maint++;
  });

  const n = document.getElementById('count-normal');
  const a = document.getElementById('count-att');
  const c = document.getElementById('count-crit');
  const m = document.getElementById('count-maint');
  if(n) n.textContent = normal;
  if(a) a.textContent = att;
  if(c) c.textContent = crit;
  if(m) m.textContent = maint;
}

window.addEventListener('load', updateCounts);

/* ===== SCRIPT BLOCK 7 | gestao-preview-script ===== */
function abrirGestaoModal(){
  document.getElementById('gestaoOverlay')?.classList.add('show');
}
function fecharGestaoModal(){
  document.getElementById('gestaoOverlay')?.classList.remove('show');
}

function abrirOSPanel(mode){
  if(mode === 'orcamento'){
    if(window.abrirOrcamentoDrill){
      window.abrirOrcamentoDrill();
      return;
    }
  }
  const panel = document.getElementById('osPanel');
  const title = document.getElementById('osTitle');
  const list = document.getElementById('osList');
  if(!panel || !title || !list) return;
  if(mode === 'orcamento'){
    title.textContent = 'Solicitar orçamento';
    list.innerHTML = `
      <div class="os-item"><span>Novo dispositivo</span><span class="os-status analise">Selecionar</span></div>
      <div class="os-item"><span>Reposição / reparo</span><span class="os-status resolvido">Abrir</span></div>
    `;
  } else {
    title.textContent = 'OS abertas';
    list.innerHTML = `
      <div class="os-item"><span>Solicitação de novo dispositivo</span><span class="os-status analise">Em análise</span></div>
      <div class="os-item"><span>Reposição de gateway</span><span class="os-status aprovado">Aprovado</span></div>
      <div class="os-item"><span>Troca de sensor</span><span class="os-status reprovado">Reprovado</span></div>
      <div class="os-item"><span>Expansão para nova área</span><span class="os-status resolvido">Resolvido</span></div>
    `;
  }
  panel.classList.add('show');
}

function fecharOSPanel(){
  document.getElementById('osPanel')?.classList.remove('show');
}
document.addEventListener('click', function(e){
  const overlay = document.getElementById('gestaoOverlay');
  const panel = document.getElementById('osPanel');
  if(e.target === overlay) fecharGestaoModal();
  if(e.target === panel) fecharOSPanel();
});

/* ===== SCRIPT BLOCK 8 | drill-preview-script ===== */
window.DRILL_STATUS_TREE = {
  root: [
    {
      id: 'fora',
      title: 'Fora da temperatura',
      subtitle: 'Mostra só as áreas com dispositivos fora do limite.',
      badge: '38%',
      badgeClass: 'badge-red',
      areas: [
        {
          id: 'banco-sangue',
          title: 'Banco IDvida',
          subtitle: '3 dispositivos fora da temperatura neste momento.',
          badge: '3',
          badgeClass: 'badge-red',
          devices: [
            { title:'Geladeira BLS 01', subtitle:'Última leitura crítica no setor.', badge:'8.6°C', badgeClass:'badge-red' },
            { title:'Geladeira BLS 02', subtitle:'Próximo do limite superior.', badge:'7.9°C', badgeClass:'badge-yellow' },
            { title:'Geladeira BLS 03', subtitle:'Evento recorrente no período.', badge:'9.1°C', badgeClass:'badge-red' }
          ]
        },
        {
          id: 'laboratorio',
          title: 'Laboratório',
          subtitle: '2 dispositivos fora da temperatura no setor.',
          badge: '2',
          badgeClass: 'badge-red',
          devices: [
            { title:'Geladeira LAB 01', subtitle:'Desvio recente identificado.', badge:'8.4°C', badgeClass:'badge-red' },
            { title:'Geladeira LAB 02', subtitle:'Próximo do limite.', badge:'7.8°C', badgeClass:'badge-yellow' }
          ]
        }
      ]
    },
    {
      id: 'manutencao',
      title: 'Manutenção',
      subtitle: 'Mostra somente áreas com equipamentos aguardando troca, validação ou ajuste.',
      badge: '23%',
      badgeClass: 'badge-gray',
      areas: [
        {
          id: 'engenharia',
          title: 'Engenharia Clínica',
          subtitle: '4 dispositivos aguardando intervenção.',
          badge: '4',
          badgeClass: 'badge-gray',
          devices: [
            { title:'Geladeira ENG 01', subtitle:'Dispositivo em manutenção.', badge:'Manutenção', badgeClass:'badge-gray' },
            { title:'Geladeira ENG 02', subtitle:'Dispositivo em manutenção.', badge:'Manutenção', badgeClass:'badge-gray' },
            { title:'Geladeira ENG 03', subtitle:'Dispositivo em manutenção.', badge:'Manutenção', badgeClass:'badge-gray' },
            { title:'Geladeira ENG 04', subtitle:'Dispositivo em manutenção.', badge:'Manutenção', badgeClass:'badge-gray' }
          ]
        }
      ]
    },
    {
      id: 'inventario',
      title: 'Inventário',
      subtitle: 'Mostra as áreas com produtos ou insumos em conferência.',
      badge: '1%',
      badgeClass: 'badge-brown',
      areas: [
        {
          id: 'banco-sangue',
          title: 'Banco IDvida',
          subtitle: 'Conferência de produtos e insumos no setor.',
          badge: '2',
          badgeClass: 'badge-brown',
          devices: [
            { title:'Geladeira BLS 01', subtitle:'Produtos em contagem e conferência.', badge:'Inventário', badgeClass:'badge-brown' },
            { title:'Geladeira BLS 02', subtitle:'Insumos em revisão de estoque.', badge:'Inventário', badgeClass:'badge-brown' }
          ]
        },
        {
          id: 'laboratorio',
          title: 'Laboratório',
          subtitle: 'Conferência de produtos do setor.',
          badge: '1',
          badgeClass: 'badge-brown',
          devices: [
            { title:'Geladeira LAB 01', subtitle:'Produtos em conferência.', badge:'Inventário', badgeClass:'badge-brown' }
          ]
        }
      ]
    },
    {
      id: 'degelo',
      title: 'Degelo',
      subtitle: 'Equipamentos em rotina programada de degelo.',
      badge: '1%',
      badgeClass: 'badge-purple',
      areas: [
        {
          id: 'nutricao',
          title: 'Nutrição',
          subtitle: 'Equipamentos em rotina de degelo.',
          badge: '1',
          badgeClass: 'badge-purple',
          devices: [
            { title:'Freezer NUT 01', subtitle:'Degelo programado do equipamento.', badge:'Degelo', badgeClass:'badge-purple' }
          ]
        }
      ]
    },
    {
      id: 'reposicao',
      title: 'Reposição',
      subtitle: 'Mostra as áreas com reposição de produtos ou insumos.',
      badge: '1%',
      badgeClass: 'badge-yellow',
      areas: [
        {
          id: 'farmacia',
          title: 'Farmácia',
          subtitle: 'Reposição de insumos no setor.',
          badge: '2',
          badgeClass: 'badge-yellow',
          devices: [
            { title:'Geladeira FAR 01', subtitle:'Reposição de produtos em andamento.', badge:'Reposição', badgeClass:'badge-yellow' },
            { title:'Geladeira FAR 02', subtitle:'Reposição de insumos no equipamento.', badge:'Reposição', badgeClass:'badge-yellow' }
          ]
        }
      ]
    },
    {
      id: 'disponivel',
      title: 'Disponível',
      subtitle: 'Equipamentos livres, prontos para uso imediato ou troca operacional.',
      badge: '17%',
      badgeClass: 'badge-green',
      areas: [
        {
          id: 'reserva',
          title: 'Reserva Técnica',
          subtitle: '5 dispositivos disponíveis.',
          badge: '5',
          badgeClass: 'badge-green',
          devices: [
            { title:'Dispositivo O1', subtitle:'Não vinculado a nenhuma área.', badge:'Disponível', badgeClass:'badge-green' },
            { title:'Dispositivo O2', subtitle:'Não vinculado a nenhuma área.', badge:'Disponível', badgeClass:'badge-green' },
            { title:'Dispositivo O3', subtitle:'Equipamento substituído disponível.', badge:'Disponível', badgeClass:'badge-green' },
            { title:'Dispositivo O4', subtitle:'Equipamento substituído disponível.', badge:'Disponível', badgeClass:'badge-green' },
            { title:'Dispositivo O5', subtitle:'Não vinculado a nenhuma área.', badge:'Disponível', badgeClass:'badge-green' }
          ]
        }
      ]
    },
    {
      id: 'uso',
      title: 'Em uso',
      subtitle: 'Dispositivos operando normalmente nas áreas ativas.',
      badge: '22%',
      badgeClass: 'badge-blue',
      areas: [
        {
          id: 'uti',
          title: 'UTI',
          subtitle: '6 dispositivos em operação normal.',
          badge: '6',
          badgeClass: 'badge-blue',
          devices: [
            { title:'Geladeira UTI 01', subtitle:'Operando normalmente.', badge:'4.8°C', badgeClass:'badge-green' },
            { title:'Geladeira UTI 02', subtitle:'Operando normalmente.', badge:'5.1°C', badgeClass:'badge-green' },
            { title:'Geladeira UTI 03', subtitle:'Operando normalmente.', badge:'4.6°C', badgeClass:'badge-green' },
            { title:'Geladeira UTI 04', subtitle:'Operando normalmente.', badge:'4.9°C', badgeClass:'badge-green' },
            { title:'Geladeira UTI 05', subtitle:'Operando normalmente.', badge:'5.0°C', badgeClass:'badge-green' },
            { title:'Geladeira UTI 06', subtitle:'Operando normalmente.', badge:'4.7°C', badgeClass:'badge-green' }
          ]
        }
      ]
    }
  ]
};


window.DRILL_SAUDE_TREE = (() => {
  const makeDevices = (prefix, area, count, badge, badgeClass, subtitleBase) =>
    Array.from({length: count}, (_, i) => ({
      title: `${prefix} ${String(i+1).padStart(2,'0')}`,
      subtitle: `${subtitleBase} · ${area}`,
      badge,
      badgeClass
    }));

  return {
    root: [
      {
        id:'calibrados',
        title:'Calibrados',
        subtitle:'Dispositivos com calibração em dia.',
        badge:'84',
        badgeClass:'badge-blue',
        areas:[
          { id:'banco-sangue-cal', title:'Banco IDvida', subtitle:'10 dispositivos calibrados.', badge:'10', badgeClass:'badge-blue',
            devices: makeDevices('Sensor CAL BS', 'Banco IDvida', 10, 'Calibrado', 'badge-blue', 'Calibração em dia') },
          { id:'uti-cal', title:'UTI', subtitle:'18 dispositivos calibrados.', badge:'18', badgeClass:'badge-blue',
            devices: makeDevices('Sensor CAL UTI', 'UTI', 18, 'Calibrado', 'badge-blue', 'Calibração em dia') },
          { id:'farmacia-cal', title:'Farmácia', subtitle:'14 dispositivos calibrados.', badge:'14', badgeClass:'badge-blue',
            devices: makeDevices('Sensor CAL FAR', 'Farmácia', 14, 'Calibrado', 'badge-blue', 'Calibração em dia') },
          { id:'lab-cal', title:'Laboratório', subtitle:'12 dispositivos calibrados.', badge:'12', badgeClass:'badge-blue',
            devices: makeDevices('Sensor CAL LAB', 'Laboratório', 12, 'Calibrado', 'badge-blue', 'Calibração em dia') },
          { id:'engenharia-cal', title:'Engenharia Clínica', subtitle:'16 dispositivos calibrados.', badge:'16', badgeClass:'badge-blue',
            devices: makeDevices('Sensor CAL ENG', 'Engenharia Clínica', 16, 'Calibrado', 'badge-blue', 'Calibração em dia') },
          { id:'nutri-cal', title:'Nutrição', subtitle:'14 dispositivos calibrados.', badge:'14', badgeClass:'badge-blue',
            devices: makeDevices('Sensor CAL NUT', 'Nutrição', 14, 'Calibrado', 'badge-blue', 'Calibração em dia') }
        ]
      },
      {
        id:'proximo',
        title:'Próx. vencimento',
        subtitle:'Dispositivos próximos do vencimento de calibração.',
        badge:'18',
        badgeClass:'badge-yellow',
        areas:[
          { id:'banco-sangue-prox', title:'Banco IDvida', subtitle:'4 dispositivos próximos do vencimento.', badge:'4', badgeClass:'badge-yellow',
            devices: makeDevices('Sensor PV BS', 'Banco IDvida', 4, 'Próx. vencimento', 'badge-yellow', 'Calibração próxima do vencimento') },
          { id:'uti-prox', title:'UTI', subtitle:'5 dispositivos próximos do vencimento.', badge:'5', badgeClass:'badge-yellow',
            devices: makeDevices('Sensor PV UTI', 'UTI', 5, 'Próx. vencimento', 'badge-yellow', 'Calibração próxima do vencimento') },
          { id:'farmacia-prox', title:'Farmácia', subtitle:'3 dispositivos próximos do vencimento.', badge:'3', badgeClass:'badge-yellow',
            devices: makeDevices('Sensor PV FAR', 'Farmácia', 3, 'Próx. vencimento', 'badge-yellow', 'Calibração próxima do vencimento') },
          { id:'engenharia-prox', title:'Engenharia Clínica', subtitle:'6 dispositivos próximos do vencimento.', badge:'6', badgeClass:'badge-yellow',
            devices: makeDevices('Sensor PV ENG', 'Engenharia Clínica', 6, 'Próx. vencimento', 'badge-yellow', 'Calibração próxima do vencimento') }
        ]
      },
      {
        id:'vencidos',
        title:'Vencidos',
        subtitle:'Dispositivos com calibração vencida.',
        badge:'6',
        badgeClass:'badge-red',
        areas:[
          { id:'banco-sangue-v', title:'Banco IDvida', subtitle:'2 dispositivos vencidos.', badge:'2', badgeClass:'badge-red',
            devices: makeDevices('Sensor VEN BS', 'Banco IDvida', 2, 'Vencido', 'badge-red', 'Calibração vencida') },
          { id:'uti-v', title:'UTI', subtitle:'1 dispositivo vencido.', badge:'1', badgeClass:'badge-red',
            devices: makeDevices('Sensor VEN UTI', 'UTI', 1, 'Vencido', 'badge-red', 'Calibração vencida') },
          { id:'laboratorio-v', title:'Laboratório', subtitle:'2 dispositivos vencidos.', badge:'2', badgeClass:'badge-red',
            devices: makeDevices('Sensor VEN LAB', 'Laboratório', 2, 'Vencido', 'badge-red', 'Calibração vencida') },
          { id:'nutricao-v', title:'Nutrição', subtitle:'1 dispositivo vencido.', badge:'1', badgeClass:'badge-red',
            devices: makeDevices('Sensor VEN NUT', 'Nutrição', 1, 'Vencido', 'badge-red', 'Calibração vencida') }
        ]
      },
      {
        id:'manutencao',
        title:'Manutenção',
        subtitle:'Dispositivos em manutenção.',
        badge:'12',
        badgeClass:'badge-gray',
        areas:[
          { id:'engenharia-m', title:'Engenharia Clínica', subtitle:'4 dispositivos em manutenção.', badge:'4', badgeClass:'badge-gray',
            devices: makeDevices('Dispositivo M ENG', 'Engenharia Clínica', 4, 'Manutenção', 'badge-gray', 'Dispositivo em manutenção') },
          { id:'farmacia-m', title:'Farmácia', subtitle:'3 dispositivos em manutenção.', badge:'3', badgeClass:'badge-gray',
            devices: makeDevices('Dispositivo M FAR', 'Farmácia', 3, 'Manutenção', 'badge-gray', 'Dispositivo em manutenção') },
          { id:'uti-m', title:'UTI', subtitle:'2 dispositivos em manutenção.', badge:'2', badgeClass:'badge-gray',
            devices: makeDevices('Dispositivo M UTI', 'UTI', 2, 'Manutenção', 'badge-gray', 'Dispositivo em manutenção') },
          { id:'laboratorio-m', title:'Laboratório', subtitle:'3 dispositivos em manutenção.', badge:'3', badgeClass:'badge-gray',
            devices: makeDevices('Dispositivo M LAB', 'Laboratório', 3, 'Manutenção', 'badge-gray', 'Dispositivo em manutenção') }
        ]
      },
      {
        id:'comunicando',
        title:'Comunicando',
        subtitle:'Dispositivos com comunicação normal.',
        badge:'70',
        badgeClass:'badge-comm',
        areas:[
          { id:'banco-sangue-c', title:'Banco IDvida', subtitle:'12 dispositivos comunicando.', badge:'12', badgeClass:'badge-comm',
            devices: makeDevices('Dispositivo C BS', 'Banco IDvida', 12, 'Comunicando', 'badge-comm', 'Informação chegando normalmente') },
          { id:'uti-c', title:'UTI', subtitle:'16 dispositivos comunicando.', badge:'16', badgeClass:'badge-comm',
            devices: makeDevices('Dispositivo C UTI', 'UTI', 16, 'Comunicando', 'badge-comm', 'Informação chegando normalmente') },
          { id:'farmacia-c', title:'Farmácia', subtitle:'10 dispositivos comunicando.', badge:'10', badgeClass:'badge-comm',
            devices: makeDevices('Dispositivo C FAR', 'Farmácia', 10, 'Comunicando', 'badge-comm', 'Informação chegando normalmente') },
          { id:'engenharia-c', title:'Engenharia Clínica', subtitle:'14 dispositivos comunicando.', badge:'14', badgeClass:'badge-comm',
            devices: makeDevices('Dispositivo C ENG', 'Engenharia Clínica', 14, 'Comunicando', 'badge-comm', 'Informação chegando normalmente') },
          { id:'laboratorio-c', title:'Laboratório', subtitle:'8 dispositivos comunicando.', badge:'8', badgeClass:'badge-comm',
            devices: makeDevices('Dispositivo C LAB', 'Laboratório', 8, 'Comunicando', 'badge-comm', 'Informação chegando normalmente') },
          { id:'nutricao-c', title:'Nutrição', subtitle:'10 dispositivos comunicando.', badge:'10', badgeClass:'badge-comm',
            devices: makeDevices('Dispositivo C NUT', 'Nutrição', 10, 'Comunicando', 'badge-comm', 'Informação chegando normalmente') }
        ]
      },
      {
        id:'sem-comunicacao',
        title:'Sem comunicação',
        subtitle:'Dispositivos sem envio de informação.',
        badge:'10',
        badgeClass:'badge-no-comm',
        areas:[
          { id:'banco-sangue-sc', title:'Banco IDvida', subtitle:'2 dispositivos sem comunicação.', badge:'2', badgeClass:'badge-no-comm',
            devices: makeDevices('Dispositivo SC BS', 'Banco IDvida', 2, 'Sem comunicação', 'badge-no-comm', 'Informação não está chegando') },
          { id:'uti-sc', title:'UTI', subtitle:'2 dispositivos sem comunicação.', badge:'2', badgeClass:'badge-no-comm',
            devices: makeDevices('Dispositivo SC UTI', 'UTI', 2, 'Sem comunicação', 'badge-no-comm', 'Informação não está chegando') },
          { id:'farmacia-sc', title:'Farmácia', subtitle:'1 dispositivo sem comunicação.', badge:'1', badgeClass:'badge-no-comm',
            devices: makeDevices('Dispositivo SC FAR', 'Farmácia', 1, 'Sem comunicação', 'badge-no-comm', 'Informação não está chegando') },
          { id:'engenharia-sc', title:'Engenharia Clínica', subtitle:'3 dispositivos sem comunicação.', badge:'3', badgeClass:'badge-no-comm',
            devices: makeDevices('Dispositivo SC ENG', 'Engenharia Clínica', 3, 'Sem comunicação', 'badge-no-comm', 'Informação não está chegando') },
          { id:'laboratorio-sc', title:'Laboratório', subtitle:'2 dispositivos sem comunicação.', badge:'2', badgeClass:'badge-no-comm',
            devices: makeDevices('Dispositivo SC LAB', 'Laboratório', 2, 'Sem comunicação', 'badge-no-comm', 'Informação não está chegando') }
        ]
      }
    ]
  };
})();


window.DRILL_CONTRATO_TREE = {
  rootStep: {
    id:'cliente',
    title:'Cliente',
    subtitle:'Clique para visualizar os clientes cadastrados.',
    badge:'1',
    badgeClass:'badge-blue'
  },
  clients: [
    {
      id:'h1',
      title:'H1',
      subtitle:'Cliente fictício para demonstração.',
      badge:'120',
      badgeClass:'badge-blue',
      categories:[
        {
          id:'total',
          title:'Total de dispositivos',
          subtitle:'Dispositivos IDSensor cadastrados no cliente.',
          badge:'120',
          badgeClass:'badge-blue',
          areas:[
            {
              id:'total-banco-sangue',
              title:'Banco IDvida',
              subtitle:'Dispositivos IDSensor ativos na área.',
              badge:'40',
              badgeClass:'badge-blue',
              devices:[
                { title:'Dispositivo IDSensor 01', subtitle:'Banco IDvida · ativo', badge:'Ativo', badgeClass:'badge-green' },
                { title:'Dispositivo IDSensor 02', subtitle:'Banco IDvida · ativo', badge:'Ativo', badgeClass:'badge-green' }
              ]
            },
            {
              id:'total-laboratorio',
              title:'Laboratório',
              subtitle:'Dispositivos IDSensor ativos na área.',
              badge:'35',
              badgeClass:'badge-blue',
              devices:[
                { title:'Dispositivo IDSensor 03', subtitle:'Laboratório · ativo', badge:'Ativo', badgeClass:'badge-green' },
                { title:'Dispositivo IDSensor 04', subtitle:'Laboratório · ativo', badge:'Ativo', badgeClass:'badge-green' }
              ]
            },
            {
              id:'total-uti',
              title:'UTI',
              subtitle:'Dispositivos IDSensor ativos na área.',
              badge:'25',
              badgeClass:'badge-blue',
              devices:[
                { title:'Dispositivo IDSensor 05', subtitle:'UTI · ativo', badge:'Ativo', badgeClass:'badge-green' },
                { title:'Dispositivo IDSensor 06', subtitle:'UTI · ativo', badge:'Ativo', badgeClass:'badge-green' }
              ]
            },
            {
              id:'total-farmacia',
              title:'Farmácia',
              subtitle:'Dispositivos IDSensor ativos na área.',
              badge:'20',
              badgeClass:'badge-blue',
              devices:[
                { title:'Dispositivo IDSensor 10', subtitle:'Farmácia · ativo', badge:'Ativo', badgeClass:'badge-green' },
                { title:'Dispositivo IDSensor 11', subtitle:'Farmácia · ativo', badge:'Ativo', badgeClass:'badge-green' }
              ]
            }
          ]
        },
        {
          id:'em-contrato',
          title:'Em contrato',
          subtitle:'Dispositivos ativos e cobrados no contrato.',
          badge:'100',
          badgeClass:'badge-green',
          areas:[
            {
              id:'contrato-banco-sangue',
              title:'Banco IDvida',
              subtitle:'Dispositivos IDSensor em contrato na área.',
              badge:'35',
              badgeClass:'badge-green',
              devices:[
                { title:'Dispositivo IDSensor 12', subtitle:'Banco IDvida · ativo', badge:'Ativo', badgeClass:'badge-green' },
                { title:'Dispositivo IDSensor 13', subtitle:'Banco IDvida · ativo', badge:'Ativo', badgeClass:'badge-green' }
              ]
            },
            {
              id:'contrato-laboratorio',
              title:'Laboratório',
              subtitle:'Dispositivos IDSensor em contrato na área.',
              badge:'25',
              badgeClass:'badge-green',
              devices:[
                { title:'Dispositivo IDSensor 14', subtitle:'Laboratório · ativo', badge:'Ativo', badgeClass:'badge-green' },
                { title:'Dispositivo IDSensor 15', subtitle:'Laboratório · ativo', badge:'Ativo', badgeClass:'badge-green' }
              ]
            },
            {
              id:'contrato-uti',
              title:'UTI',
              subtitle:'Dispositivos IDSensor em contrato na área.',
              badge:'20',
              badgeClass:'badge-green',
              devices:[
                { title:'Dispositivo IDSensor 16', subtitle:'UTI · ativo', badge:'Ativo', badgeClass:'badge-green' },
                { title:'Dispositivo IDSensor 17', subtitle:'UTI · ativo', badge:'Ativo', badgeClass:'badge-green' }
              ]
            },
            {
              id:'contrato-farmacia',
              title:'Farmácia',
              subtitle:'Dispositivos IDSensor em contrato na área.',
              badge:'20',
              badgeClass:'badge-green',
              devices:[
                { title:'Dispositivo IDSensor 18', subtitle:'Farmácia · ativo', badge:'Ativo', badgeClass:'badge-green' },
                { title:'Dispositivo IDSensor 19', subtitle:'Farmácia · ativo', badge:'Ativo', badgeClass:'badge-green' }
              ]
            }
          ]
        },
        {
          id:'aguardando',
          title:'Aguardando',
          subtitle:'Dispositivos aguardando validação ou liberação.',
          badge:'20',
          badgeClass:'badge-yellow',
          areas:[
            {
              id:'aguardando-banco-sangue',
              title:'Banco IDvida',
              subtitle:'Dispositivos IDSensor aguardando na área.',
              badge:'7',
              badgeClass:'badge-yellow',
              devices:[
                { title:'Dispositivo IDSensor 07', subtitle:'Aguardando validação', badge:'Aguardando', badgeClass:'badge-yellow' }
              ]
            },
            {
              id:'aguardando-laboratorio',
              title:'Laboratório',
              subtitle:'Dispositivos IDSensor aguardando na área.',
              badge:'6',
              badgeClass:'badge-yellow',
              devices:[
                { title:'Dispositivo IDSensor 08', subtitle:'Aguardando liberação', badge:'Aguardando', badgeClass:'badge-yellow' }
              ]
            },
            {
              id:'aguardando-uti',
              title:'UTI',
              subtitle:'Dispositivos IDSensor aguardando na área.',
              badge:'7',
              badgeClass:'badge-yellow',
              devices:[
                { title:'Dispositivo IDSensor 09', subtitle:'Aguardando regularização', badge:'Aguardando', badgeClass:'badge-yellow' }
              ]
            }
          ]
        },
        {
          id:'disponivel',
          title:'Disponível',
          subtitle:'Dispositivos não vinculados a nenhum equipamento.',
          badge:'10',
          badgeClass:'badge-gray',
          areas:[
            {
              id:'disponivel-sem-vinculo',
              title:'Sem vínculo',
              subtitle:'Dispositivos IDSensor não vinculados a nenhum equipamento.',
              badge:'10',
              badgeClass:'badge-gray',
              devices:[
                { title:'Dispositivo IDSensor versão 05', subtitle:'Não vinculado a nenhum equipamento', badge:'Disponível', badgeClass:'badge-gray' },
                { title:'Dispositivo IDSensor versão 06', subtitle:'Não vinculado a nenhum equipamento', badge:'Disponível', badgeClass:'badge-gray' },
                { title:'Dispositivo IDSensor versão 07', subtitle:'Não vinculado a nenhum equipamento', badge:'Disponível', badgeClass:'badge-gray' }
              ]
            }
          ]
        },
        {
          id:'servicos',
          type:'services',
          title:'Serviços',
          subtitle:'Serviços contratados: SMS, WhatsApp e e-mail.',
          badge:'3',
          badgeClass:'badge-purple',
          services:[
            {
              id:'sms',
              title:'SMS',
              subtitle:'Mensagens de alerta por SMS.',
              description:'Controle de disparos SMS contratados para alertas e notificações.',
              status:'ativo',
              limitType:'limited',
              limit:5000,
              badgeClass:'badge-green'
            },
            {
              id:'whatsapp',
              title:'WhatsApp',
              subtitle:'Alertas e notificações por WhatsApp.',
              description:'Controle de disparos via WhatsApp para alertas operacionais.',
              status:'ativo',
              limitType:'unlimited',
              limit:0,
              badgeClass:'badge-green'
            },
            {
              id:'email',
              title:'E-mail',
              subtitle:'Envio de alertas e relatórios por e-mail.',
              description:'Controle de mensagens de e-mail contratadas para o cliente.',
              status:'ativo',
              limitType:'limited',
              limit:10000,
              badgeClass:'badge-green'
            }
          ]
        }
      ]
    }
  ]
};

window.drillState = { mode:null, status:null, area:null, saude:null, client:null };

window.DRILL_CLIENTS = window.DRILL_CLIENTS || [
  { id:'h1', title:'H1', subtitle:'Cliente fictício para demonstração.', badge:'120', badgeClass:'badge-blue' }
];

function textForDrillContext(text, context){
  const raw = String(text || '');
  if(context !== 'unidade') return raw;
  return raw
    .replace(/\b[Cc]liente\b/g, 'unidade')
    .replace(/\b[Cc]lientes\b/g, 'unidades');
}

window.getDrillUnits = function(){
  const units = (window.DRILL_CLIENTS || []).map(client => ({
    id: client.id,
    title: `Unidade ${client.title}`,
    subtitle: `${client.title} · selecione para visualizar as áreas.`,
    badge: client.badge || '0',
    badgeClass: client.badgeClass || 'badge-blue'
  }));
  if(units.length) return units;
  return [
    { id:'h1', title:'Unidade H1', subtitle:'H1 · selecione para visualizar as áreas.', badge:'120', badgeClass:'badge-blue' }
  ];
};

function getContratoClients(){
  return (window.DRILL_CONTRATO_TREE && Array.isArray(window.DRILL_CONTRATO_TREE.clients))
    ? window.DRILL_CONTRATO_TREE.clients
    : [];
}

function getContratoClientFromUnit(unit){
  const clients = getContratoClients();
  const unitId = String(unit && unit.id ? unit.id : '').toLowerCase();
  return clients.find(client => String(client.id || '').toLowerCase() === unitId) || clients[0] || null;
}

function getDrillRole(){
  return String(window.currentRole || 'master').toLowerCase();
}

function parseDrillCount(value){
  const clean = String(value == null ? '' : value).replace(/[^0-9]/g, '');
  const n = Number(clean);
  return Number.isFinite(n) ? n : 0;
}

function contratoServiceStatusLabel(service){
  return String(service?.status || '').toLowerCase() === 'inativo' ? 'Inativo' : 'Ativo';
}

function contratoServiceBadgeClass(service){
  return contratoServiceStatusLabel(service) === 'Inativo' ? 'badge-gray' : (service?.badgeClass || 'badge-green');
}

function contratoServiceLimitLabel(service){
  if(String(service?.limitType || '').toLowerCase() === 'limited'){
    const limit = parseDrillCount(service?.limit);
    return `Com limite · ${limit.toLocaleString('pt-BR')} mensagens`;
  }
  return 'Ilimitado';
}

function normalizeDrillAreaKey(text){
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function aggregateAreasFromRoot(root){
  const map = new Map();
  (root || []).forEach(item => {
    (item.areas || []).forEach(area => {
      const key = normalizeDrillAreaKey(area.title || area.id);
      if(!key) return;
      if(!map.has(key)){
        map.set(key, {
          id:key,
          title:area.title,
          subtitle:'Selecione para continuar o detalhamento.',
          badge:0,
          badgeClass:'badge-blue'
        });
      }
      const current = map.get(key);
      current.badge += parseDrillCount(area.badge);
    });
  });
  return Array.from(map.values()).map(x => ({ ...x, badge:String(x.badge) }));
}

function findAreaByTitle(list, areaTitle){
  return (list || []).find(a => String(a.title || '').toLowerCase() === String(areaTitle || '').toLowerCase());
}

window.renderStatusRoot = function(){
  if(getDrillRole() === 'master'){
    window.renderStatusClientEntry();
    return;
  }
  window.renderStatusUnitEntry();
};

window.renderStatusClientEntry = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  title.textContent = 'Status operacional';
  sub.textContent = '';
  hint.textContent = 'Comece por Cliente para visualizar os status.';
  back.textContent = '← Voltar ao resumo';
  back.onclick = window.voltarResumoDrill;

  content.innerHTML = `
    <div class="drill-list">
      <button class="drill-item drill-nav" type="button" data-status-step="cliente">
        <div><strong>Cliente</strong><span>Selecione o cliente para continuar.</span></div>
        <div class="drill-badge badge-blue">${window.DRILL_CLIENTS.length}</div>
      </button>
    </div>
  `;

  content.querySelector('[data-status-step="cliente"]')?.addEventListener('click', () => {
    window.renderStatusClients();
  });
};

window.renderStatusClients = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  title.textContent = 'Cliente';
  sub.textContent = 'Selecione o cliente para visualizar os status.';
  hint.textContent = 'Clique no cliente para continuar.';
  back.textContent = '← Voltar';
  back.onclick = () => window.renderStatusClientEntry();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Status</span>
      <span class="drill-crumb">Cliente</span>
    </div>
    <div class="drill-list">
      ${window.DRILL_CLIENTS.map(client => `
        <button class="drill-item drill-nav" type="button" data-status-client="${client.id}">
          <div><strong>${client.title}</strong><span>${client.subtitle}</span></div>
          <div class="drill-badge ${client.badgeClass}">${client.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-status-client]').forEach(btn => {
    btn.addEventListener('click', () => {
      const client = window.DRILL_CLIENTS.find(x => x.id === btn.dataset.statusClient);
      if(client) window.renderStatusForClient(client);
    });
  });
};

window.renderStatusForClient = function(client){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  window.drillState.client = client;

  title.textContent = 'Status operacional';
  sub.textContent = `Cliente ${client.title} · distribuição dos dispositivos por status.`;
  hint.textContent = 'Clique em um status para ver as áreas relacionadas.';
  back.textContent = '← Voltar ao cliente';
  back.onclick = () => window.renderStatusClients();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Status</span>
      <span class="drill-crumb">${client.title}</span>
    </div>
    <div class="drill-list">
      ${window.DRILL_STATUS_TREE.root.map(item => `
        <button class="drill-item drill-nav" type="button" data-status="${item.id}">
          <div><strong>${item.title}</strong><span>${item.subtitle}</span></div>
          <div class="drill-badge ${item.badgeClass}">${item.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      const status = window.DRILL_STATUS_TREE.root.find(x => x.id === btn.dataset.status);
      if(status){
        window.renderAreasForStatus(status, {
          onBack: () => window.renderStatusForClient(client),
          backText: '← Voltar aos status',
          breadcrumbsPrefix: ['Status', client.title]
        });
      }
    });
  });
};

window.renderStatusUnitEntry = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const units = window.getDrillUnits();
  title.textContent = 'Status operacional';
  sub.textContent = '';
  hint.textContent = 'Comece por Unidades para visualizar os status.';
  back.textContent = '← Voltar ao resumo';
  back.onclick = window.voltarResumoDrill;

  content.innerHTML = `
    <div class="drill-list">
      <button class="drill-item drill-nav" type="button" data-status-step="unidades">
        <div><strong>Unidades</strong><span>Selecione a unidade para continuar.</span></div>
        <div class="drill-badge badge-blue">${units.length}</div>
      </button>
    </div>
  `;

  content.querySelector('[data-status-step="unidades"]')?.addEventListener('click', () => {
    window.renderStatusUnits();
  });
};

window.renderStatusUnits = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const units = window.getDrillUnits();
  title.textContent = 'Unidades';
  sub.textContent = 'Selecione a unidade para visualizar os status por área.';
  hint.textContent = 'Clique na unidade para continuar.';
  back.textContent = '← Voltar';
  back.onclick = () => window.renderStatusUnitEntry();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Status</span>
      <span class="drill-crumb">Unidades</span>
    </div>
    <div class="drill-list">
      ${units.map(unit => `
        <button class="drill-item drill-nav" type="button" data-status-unit="${unit.id}">
          <div><strong>${unit.title}</strong><span>${unit.subtitle}</span></div>
          <div class="drill-badge ${unit.badgeClass}">${unit.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-status-unit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const unit = units.find(x => x.id === btn.dataset.statusUnit);
      if(unit) window.renderStatusAreasForUnit(unit);
    });
  });
};

window.renderStatusAreasForUnit = function(unit){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const areas = aggregateAreasFromRoot(window.DRILL_STATUS_TREE.root);
  title.textContent = unit.title;
  sub.textContent = `${unit.title} · selecione a área para visualizar os status.`;
  hint.textContent = 'Clique na área para ver os status da unidade.';
  back.textContent = '← Voltar às unidades';
  back.onclick = () => window.renderStatusUnits();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Status</span>
      <span class="drill-crumb">Unidades</span>
      <span class="drill-crumb">${unit.title}</span>
    </div>
    <div class="drill-list">
      ${areas.map(area => `
        <button class="drill-item drill-nav" type="button" data-status-unit-area="${area.title}">
          <div><strong>${area.title}</strong><span>${area.subtitle}</span></div>
          <div class="drill-badge ${area.badgeClass}">${area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-status-unit-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.renderStatusForAreaInUnit(unit, btn.dataset.statusUnitArea);
    });
  });
};

window.renderStatusForAreaInUnit = function(unit, areaTitle){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const statusRows = window.DRILL_STATUS_TREE.root
    .map(status => {
      const area = findAreaByTitle(status.areas, areaTitle);
      return area ? { status, area } : null;
    })
    .filter(Boolean);

  title.textContent = areaTitle;
  sub.textContent = `Status disponíveis para ${areaTitle}.`;
  hint.textContent = 'Clique em um status para ver os dispositivos.';
  back.textContent = '← Voltar às áreas';
  back.onclick = () => window.renderStatusAreasForUnit(unit);

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Status</span>
      <span class="drill-crumb">Unidades</span>
      <span class="drill-crumb">${unit.title}</span>
      <span class="drill-crumb">${areaTitle}</span>
    </div>
    <div class="drill-list">
      ${statusRows.map(row => `
        <button class="drill-item drill-nav" type="button" data-status-unit-in-area="${row.status.id}">
          <div><strong>${row.status.title}</strong><span>${row.area.subtitle}</span></div>
          <div class="drill-badge ${row.status.badgeClass}">${row.area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-status-unit-in-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = statusRows.find(x => x.status.id === btn.dataset.statusUnitInArea);
      if(row){
        window.renderDevicesForArea(row.status, row.area, {
          onBack: () => window.renderStatusForAreaInUnit(unit, areaTitle),
          backText: '← Voltar aos status da área',
          breadcrumbs: ['Status', 'Unidades', unit.title, areaTitle, row.status.title]
        });
      }
    });
  });
};

window.renderStatusAreaEntry = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const areas = aggregateAreasFromRoot(window.DRILL_STATUS_TREE.root);
  title.textContent = 'Status operacional';
  sub.textContent = 'Selecione a área para visualizar os status.';
  hint.textContent = 'Fluxo direto por área para este perfil.';
  back.textContent = '← Voltar ao resumo';
  back.onclick = window.voltarResumoDrill;

  content.innerHTML = `
    <div class="drill-list">
      ${areas.map(area => `
        <button class="drill-item drill-nav" type="button" data-status-root-area="${area.title}">
          <div><strong>${area.title}</strong><span>${area.subtitle}</span></div>
          <div class="drill-badge ${area.badgeClass}">${area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-status-root-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.renderStatusForArea(btn.dataset.statusRootArea);
    });
  });
};

window.renderStatusForArea = function(areaTitle){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const statusRows = window.DRILL_STATUS_TREE.root
    .map(status => {
      const area = findAreaByTitle(status.areas, areaTitle);
      return area ? { status, area } : null;
    })
    .filter(Boolean);

  title.textContent = areaTitle;
  sub.textContent = 'Status disponíveis para a área selecionada.';
  hint.textContent = 'Clique em um status para ver os dispositivos.';
  back.textContent = '← Voltar às áreas';
  back.onclick = () => window.renderStatusAreaEntry();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Status</span>
      <span class="drill-crumb">${areaTitle}</span>
    </div>
    <div class="drill-list">
      ${statusRows.map(row => `
        <button class="drill-item drill-nav" type="button" data-status-in-area="${row.status.id}">
          <div><strong>${row.status.title}</strong><span>${row.area.subtitle}</span></div>
          <div class="drill-badge ${row.status.badgeClass}">${row.area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-status-in-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = statusRows.find(x => x.status.id === btn.dataset.statusInArea);
      if(row){
        window.renderDevicesForArea(row.status, row.area, {
          onBack: () => window.renderStatusForArea(areaTitle),
          backText: '← Voltar aos status da área',
          breadcrumbs: ['Status', areaTitle, row.status.title]
        });
      }
    });
  });
};

window.renderAreasForStatus = function(status, options){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  window.drillState.status = status;
  window.drillState.area = null;

  const onBack = options && typeof options.onBack === 'function'
    ? options.onBack
    : () => window.renderStatusRoot();
  const backText = options?.backText || '← Voltar aos status';
  const prefix = Array.isArray(options?.breadcrumbsPrefix) ? options.breadcrumbsPrefix : ['Status'];
  const areaCrumbs = [...prefix, status.title];

  title.textContent = status.title;
  sub.textContent = 'Áreas relacionadas a este status.';
  hint.textContent = 'Agora clique na área para ver os dispositivos daquele contexto.';
  back.textContent = backText;
  back.onclick = onBack;

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      ${areaCrumbs.map(crumb => `<span class="drill-crumb">${crumb}</span>`).join('')}
    </div>
    <div class="drill-list">
      ${status.areas.map(area => `
        <button class="drill-item drill-nav" type="button" data-area="${area.id}">
          <div><strong>${area.title}</strong><span>${area.subtitle}</span></div>
          <div class="drill-badge ${area.badgeClass}">${area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      const area = status.areas.find(x => x.id === btn.dataset.area);
      if(area){
        window.renderDevicesForArea(status, area, {
          onBack: () => window.renderAreasForStatus(status, options),
          backText: '← Voltar às áreas',
          breadcrumbs: [...areaCrumbs, area.title]
        });
      }
    });
  });
};

window.renderDevicesForArea = function(status, area, options){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  window.drillState.status = status;
  window.drillState.area = area;

  const onBack = options && typeof options.onBack === 'function'
    ? options.onBack
    : () => window.renderAreasForStatus(status);
  const backText = options?.backText || '← Voltar às áreas';
  const crumbs = Array.isArray(options?.breadcrumbs) && options.breadcrumbs.length
    ? options.breadcrumbs
    : ['Status', status.title, area.title];

  title.textContent = area.title;
  sub.textContent = 'Dispositivos desta área dentro do status selecionado.';
  hint.textContent = 'Aqui o usuário identifica qual equipamento precisa de análise.';
  back.textContent = backText;
  back.onclick = onBack;

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      ${crumbs.map(crumb => `<span class="drill-crumb">${crumb}</span>`).join('')}
    </div>
    <div class="drill-list">
      ${area.devices.map(device => `
        <div class="drill-item">
          <div><strong>${device.title}</strong><span>${device.subtitle}</span></div>
          <div class="drill-badge ${device.badgeClass}">${device.badge}</div>
        </div>
      `).join('')}
    </div>
  `;
};

window.renderSaudeRoot = function(){
  if(getDrillRole() === 'master'){
    window.renderSaudeClientEntry();
    return;
  }
  window.renderSaudeUnitEntry();
};

window.renderSaudeClientEntry = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  title.textContent = 'Saúde dos dispositivos';
  sub.textContent = '';
  hint.textContent = 'Comece por Cliente para visualizar as condições de saúde.';
  back.textContent = '← Voltar ao resumo';
  back.onclick = window.voltarResumoDrill;

  content.innerHTML = `
    <div class="drill-list">
      <button class="drill-item drill-nav" type="button" data-saude-step="cliente">
        <div><strong>Cliente</strong><span>Selecione o cliente para continuar.</span></div>
        <div class="drill-badge badge-blue">${window.DRILL_CLIENTS.length}</div>
      </button>
    </div>
  `;

  content.querySelector('[data-saude-step="cliente"]')?.addEventListener('click', () => {
    window.renderSaudeClients();
  });
};

window.renderSaudeClients = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  title.textContent = 'Cliente';
  sub.textContent = 'Selecione o cliente para visualizar as condições de saúde.';
  hint.textContent = 'Clique no cliente para continuar.';
  back.textContent = '← Voltar';
  back.onclick = () => window.renderSaudeClientEntry();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Saúde</span>
      <span class="drill-crumb">Cliente</span>
    </div>
    <div class="drill-list">
      ${window.DRILL_CLIENTS.map(client => `
        <button class="drill-item drill-nav" type="button" data-saude-client="${client.id}">
          <div><strong>${client.title}</strong><span>${client.subtitle}</span></div>
          <div class="drill-badge ${client.badgeClass}">${client.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-saude-client]').forEach(btn => {
    btn.addEventListener('click', () => {
      const client = window.DRILL_CLIENTS.find(x => x.id === btn.dataset.saudeClient);
      if(client) window.renderSaudeForClient(client);
    });
  });
};

window.renderSaudeForClient = function(client){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  window.drillState.client = client;

  title.textContent = 'Saúde dos dispositivos';
  sub.textContent = `Cliente ${client.title} · condições de calibração, manutenção e comunicação.`;
  hint.textContent = 'Clique em uma condição para ver as áreas relacionadas.';
  back.textContent = '← Voltar ao cliente';
  back.onclick = () => window.renderSaudeClients();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Saúde</span>
      <span class="drill-crumb">${client.title}</span>
    </div>
    <div class="drill-list">
      ${window.DRILL_SAUDE_TREE.root.map(item => `
        <button class="drill-item drill-nav" type="button" data-saude="${item.id}">
          <div><strong>${item.title}</strong><span>${item.subtitle}</span></div>
          <div class="drill-badge ${item.badgeClass}">${item.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-saude]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = window.DRILL_SAUDE_TREE.root.find(x => x.id === btn.dataset.saude);
      if(item){
        window.renderSaudeAreas(item, {
          onBack: () => window.renderSaudeForClient(client),
          backText: '← Voltar às condições',
          breadcrumbsPrefix: ['Saúde', client.title]
        });
      }
    });
  });
};

window.renderSaudeUnitEntry = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const units = window.getDrillUnits();
  title.textContent = 'Saúde dos dispositivos';
  sub.textContent = '';
  hint.textContent = 'Comece por Unidades para visualizar as condições de saúde.';
  back.textContent = '← Voltar ao resumo';
  back.onclick = window.voltarResumoDrill;

  content.innerHTML = `
    <div class="drill-list">
      <button class="drill-item drill-nav" type="button" data-saude-step="unidades">
        <div><strong>Unidades</strong><span>Selecione a unidade para continuar.</span></div>
        <div class="drill-badge badge-blue">${units.length}</div>
      </button>
    </div>
  `;

  content.querySelector('[data-saude-step="unidades"]')?.addEventListener('click', () => {
    window.renderSaudeUnits();
  });
};

window.renderSaudeUnits = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const units = window.getDrillUnits();
  title.textContent = 'Unidades';
  sub.textContent = 'Selecione a unidade para visualizar as condições por área.';
  hint.textContent = 'Clique na unidade para continuar.';
  back.textContent = '← Voltar';
  back.onclick = () => window.renderSaudeUnitEntry();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Saúde</span>
      <span class="drill-crumb">Unidades</span>
    </div>
    <div class="drill-list">
      ${units.map(unit => `
        <button class="drill-item drill-nav" type="button" data-saude-unit="${unit.id}">
          <div><strong>${unit.title}</strong><span>${unit.subtitle}</span></div>
          <div class="drill-badge ${unit.badgeClass}">${unit.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-saude-unit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const unit = units.find(x => x.id === btn.dataset.saudeUnit);
      if(unit) window.renderSaudeAreasForUnit(unit);
    });
  });
};

window.renderSaudeAreasForUnit = function(unit){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const areas = aggregateAreasFromRoot(window.DRILL_SAUDE_TREE.root);
  title.textContent = unit.title;
  sub.textContent = `${unit.title} · selecione a área para visualizar as condições.`;
  hint.textContent = 'Clique na área para ver as condições da unidade.';
  back.textContent = '← Voltar às unidades';
  back.onclick = () => window.renderSaudeUnits();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Saúde</span>
      <span class="drill-crumb">Unidades</span>
      <span class="drill-crumb">${unit.title}</span>
    </div>
    <div class="drill-list">
      ${areas.map(area => `
        <button class="drill-item drill-nav" type="button" data-saude-unit-area="${area.title}">
          <div><strong>${area.title}</strong><span>${area.subtitle}</span></div>
          <div class="drill-badge ${area.badgeClass}">${area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-saude-unit-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.renderSaudeForAreaInUnit(unit, btn.dataset.saudeUnitArea);
    });
  });
};

window.renderSaudeForAreaInUnit = function(unit, areaTitle){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const saudeRows = window.DRILL_SAUDE_TREE.root
    .map(item => {
      const area = findAreaByTitle(item.areas, areaTitle);
      return area ? { item, area } : null;
    })
    .filter(Boolean);

  title.textContent = areaTitle;
  sub.textContent = `Condições de saúde para ${areaTitle}.`;
  hint.textContent = 'Clique em uma condição para ver os dispositivos.';
  back.textContent = '← Voltar às áreas';
  back.onclick = () => window.renderSaudeAreasForUnit(unit);

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Saúde</span>
      <span class="drill-crumb">Unidades</span>
      <span class="drill-crumb">${unit.title}</span>
      <span class="drill-crumb">${areaTitle}</span>
    </div>
    <div class="drill-list">
      ${saudeRows.map(row => `
        <button class="drill-item drill-nav" type="button" data-saude-unit-in-area="${row.item.id}">
          <div><strong>${row.item.title}</strong><span>${row.area.subtitle}</span></div>
          <div class="drill-badge ${row.item.badgeClass}">${row.area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-saude-unit-in-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = saudeRows.find(x => x.item.id === btn.dataset.saudeUnitInArea);
      if(row){
        window.renderSaudeDevices(row.item, row.area, {
          onBack: () => window.renderSaudeForAreaInUnit(unit, areaTitle),
          backText: '← Voltar às condições da área',
          breadcrumbs: ['Saúde', 'Unidades', unit.title, areaTitle, row.item.title]
        });
      }
    });
  });
};

window.renderSaudeAreaEntry = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const areas = aggregateAreasFromRoot(window.DRILL_SAUDE_TREE.root);
  title.textContent = 'Saúde dos dispositivos';
  sub.textContent = 'Selecione a área para visualizar as condições de saúde.';
  hint.textContent = 'Fluxo direto por área para este perfil.';
  back.textContent = '← Voltar ao resumo';
  back.onclick = window.voltarResumoDrill;

  content.innerHTML = `
    <div class="drill-list">
      ${areas.map(area => `
        <button class="drill-item drill-nav" type="button" data-saude-root-area="${area.title}">
          <div><strong>${area.title}</strong><span>${area.subtitle}</span></div>
          <div class="drill-badge ${area.badgeClass}">${area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-saude-root-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.renderSaudeForArea(btn.dataset.saudeRootArea);
    });
  });
};

window.renderSaudeForArea = function(areaTitle){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const saudeRows = window.DRILL_SAUDE_TREE.root
    .map(item => {
      const area = findAreaByTitle(item.areas, areaTitle);
      return area ? { item, area } : null;
    })
    .filter(Boolean);

  title.textContent = areaTitle;
  sub.textContent = 'Condições de saúde para a área selecionada.';
  hint.textContent = 'Clique em uma condição para ver os dispositivos.';
  back.textContent = '← Voltar às áreas';
  back.onclick = () => window.renderSaudeAreaEntry();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Saúde</span>
      <span class="drill-crumb">${areaTitle}</span>
    </div>
    <div class="drill-list">
      ${saudeRows.map(row => `
        <button class="drill-item drill-nav" type="button" data-saude-in-area="${row.item.id}">
          <div><strong>${row.item.title}</strong><span>${row.area.subtitle}</span></div>
          <div class="drill-badge ${row.item.badgeClass}">${row.area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-saude-in-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = saudeRows.find(x => x.item.id === btn.dataset.saudeInArea);
      if(row){
        window.renderSaudeDevices(row.item, row.area, {
          onBack: () => window.renderSaudeForArea(areaTitle),
          backText: '← Voltar às condições da área',
          breadcrumbs: ['Saúde', areaTitle, row.item.title]
        });
      }
    });
  });
};

window.renderSaudeAreas = function(item, options){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const onBack = options && typeof options.onBack === 'function'
    ? options.onBack
    : () => window.renderSaudeRoot();
  const backText = options?.backText || '← Voltar às condições';
  const prefix = Array.isArray(options?.breadcrumbsPrefix) ? options.breadcrumbsPrefix : ['Saúde'];
  const areaCrumbs = [...prefix, item.title];

  title.textContent = item.title;
  sub.textContent = 'Áreas relacionadas a esta condição.';
  hint.textContent = 'Agora clique na área para ver os dispositivos daquele contexto.';
  back.textContent = backText;
  back.onclick = onBack;

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      ${areaCrumbs.map(crumb => `<span class="drill-crumb">${crumb}</span>`).join('')}
    </div>
    <div class="drill-list">
      ${item.areas.map(area => `
        <button class="drill-item drill-nav" type="button" data-saude-area="${area.id}">
          <div><strong>${area.title}</strong><span>${area.subtitle}</span></div>
          <div class="drill-badge ${area.badgeClass}">${area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-saude-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      const area = item.areas.find(x => x.id === btn.dataset.saudeArea);
      if(area){
        window.renderSaudeDevices(item, area, {
          onBack: () => window.renderSaudeAreas(item, options),
          backText: '← Voltar às áreas',
          breadcrumbs: [...areaCrumbs, area.title]
        });
      }
    });
  });
};

window.renderSaudeDevices = function(item, area, options){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const onBack = options && typeof options.onBack === 'function'
    ? options.onBack
    : () => window.renderSaudeAreas(item);
  const backText = options?.backText || '← Voltar às áreas';
  const crumbs = Array.isArray(options?.breadcrumbs) && options.breadcrumbs.length
    ? options.breadcrumbs
    : ['Saúde', item.title, area.title];

  title.textContent = area.title;
  sub.textContent = 'Dispositivos desta área dentro da condição selecionada.';
  hint.textContent = 'Aqui o usuário identifica quais sensores ou equipamentos estão nessa condição.';
  back.textContent = backText;
  back.onclick = onBack;

  const dotClass = {
    'badge-blue':'dot-blue',
    'badge-yellow':'dot-yellow',
    'badge-red':'dot-red',
    'badge-gray':'dot-gray',
    'badge-comm':'dot-comm',
    'badge-no-comm':'dot-no-comm'
  };

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      ${crumbs.map(crumb => `<span class="drill-crumb">${crumb}</span>`).join('')}
    </div>
    <div class="drill-list">
      ${area.devices.map(device => `
        <div class="drill-item">
          <div><strong>${device.title}</strong><span>${device.subtitle}</span></div>
          <span class="saude-dot ${dotClass[device.badgeClass] || 'dot-gray'}"></span>
        </div>
      `).join('')}
    </div>
  `;
};
window.renderContratoRoot = function(){
  if(getDrillRole() === 'master'){
    window.renderContratoClientEntry();
    return;
  }
  window.renderContratoUnitEntry();
};

window.renderContratoClientEntry = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  title.textContent = 'Total + contrato + disponível';
  sub.textContent = '';
  hint.textContent = 'Comece por Cliente para seguir o detalhamento.';
  back.textContent = '← Voltar ao resumo';
  back.onclick = window.voltarResumoDrill;

  content.innerHTML = `
    <div class="drill-list">
      <button class="drill-item drill-nav" type="button" data-contrato-step="cliente">
        <div><strong>Cliente</strong><span>Selecione o cliente para continuar.</span></div>
        <div class="drill-badge badge-blue">${getContratoClients().length}</div>
      </button>
    </div>
  `;

  content.querySelector('[data-contrato-step="cliente"]')?.addEventListener('click', () => {
    window.renderContratoClients();
  });
};

window.renderContratoUnitEntry = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const units = window.getDrillUnits();
  title.textContent = 'Total + contrato + disponível';
  sub.textContent = '';
  hint.textContent = 'Comece por Unidades para seguir o detalhamento.';
  back.textContent = '← Voltar ao resumo';
  back.onclick = window.voltarResumoDrill;

  content.innerHTML = `
    <div class="drill-list">
      <button class="drill-item drill-nav" type="button" data-contrato-step="unidades">
        <div><strong>Unidades</strong><span>Selecione a unidade para continuar.</span></div>
        <div class="drill-badge badge-blue">${units.length}</div>
      </button>
    </div>
  `;

  content.querySelector('[data-contrato-step="unidades"]')?.addEventListener('click', () => {
    window.renderContratoUnits();
  });
};

window.renderContratoUnits = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const units = window.getDrillUnits();
  title.textContent = 'Unidades';
  sub.textContent = 'Selecione a unidade para visualizar os indicadores de contrato.';
  hint.textContent = 'Clique na unidade para continuar.';
  back.textContent = '← Voltar';
  back.onclick = () => window.renderContratoUnitEntry();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Contrato</span>
      <span class="drill-crumb">Unidades</span>
    </div>
    <div class="drill-list">
      ${units.map(unit => `
        <button class="drill-item drill-nav" type="button" data-contrato-unit="${unit.id}">
          <div><strong>${unit.title}</strong><span>${unit.subtitle}</span></div>
          <div class="drill-badge ${unit.badgeClass}">${unit.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-contrato-unit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const unit = units.find(x => x.id === btn.dataset.contratoUnit);
      const sourceClient = unit ? getContratoClientFromUnit(unit) : null;
      if(!unit || !sourceClient) return;
      const unitClient = {
        ...sourceClient,
        title: unit.title,
        subtitle: unit.subtitle,
        badge: sourceClient.badge || unit.badge,
        badgeClass: sourceClient.badgeClass || unit.badgeClass
      };
      window.renderContratoCategories(unitClient, {
        context: 'unidade',
        backText: '← Voltar às unidades',
        onBack: () => window.renderContratoUnits(),
        breadcrumbsPrefix: ['Contrato', 'Unidades']
      });
    });
  });
};

window.renderContratoClients = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const clients = getContratoClients();
  title.textContent = 'Cliente';
  sub.textContent = 'Selecione o cliente para visualizar os contratos.';
  hint.textContent = 'Clique no cliente para abrir os indicadores de dispositivos.';
  back.textContent = '← Voltar';
  back.onclick = () => window.renderContratoClientEntry();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Contrato</span>
      <span class="drill-crumb">Cliente</span>
    </div>
    <div class="drill-list">
      ${clients.map(client => `
        <button class="drill-item drill-nav" type="button" data-contrato-client="${client.id}">
          <div><strong>${client.title}</strong><span>${client.subtitle}</span></div>
          <div class="drill-badge ${client.badgeClass}">${client.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-contrato-client]').forEach(btn => {
    btn.addEventListener('click', () => {
      const client = clients.find(x => x.id === btn.dataset.contratoClient);
      if(client) window.renderContratoCategories(client);
    });
  });
};

window.renderContratoCategories = function(client, options){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const context = options?.context === 'unidade' ? 'unidade' : 'cliente';
  const onBack = options && typeof options.onBack === 'function'
    ? options.onBack
    : () => window.renderContratoClients();
  const backText = options?.backText || (context === 'unidade' ? '← Voltar à unidade' : '← Voltar ao cliente');
  const breadcrumbsPrefix = Array.isArray(options?.breadcrumbsPrefix) && options.breadcrumbsPrefix.length
    ? options.breadcrumbsPrefix
    : ['Contrato', context === 'unidade' ? 'Unidades' : 'Cliente'];
  const categoryCrumbs = [...breadcrumbsPrefix, client.title];

  title.textContent = client.title;
  sub.textContent = context === 'unidade'
    ? `${client.title} · total de dispositivos, em contrato, aguardando, disponível e serviços contratados.`
    : 'Total de dispositivos, em contrato, aguardando, disponível e serviços contratados.';
  hint.textContent = 'Clique em uma categoria para ver os dispositivos ou serviços daquele contexto.';
  back.textContent = backText;
  back.onclick = onBack;

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      ${categoryCrumbs.map(crumb => `<span class="drill-crumb">${crumb}</span>`).join('')}
    </div>
    <div class="drill-list">
      ${(client.categories || []).map(item => `
        <button class="drill-item drill-nav" type="button" data-contrato-category="${item.id}">
          <div><strong>${item.title}</strong><span>${textForDrillContext(item.subtitle, context)}</span></div>
          <div class="drill-badge ${item.badgeClass}">${item.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-contrato-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = (client.categories || []).find(x => x.id === btn.dataset.contratoCategory);
      if(item){
        if(item.type === 'services' || Array.isArray(item.services)){
          window.renderContratoServices(client, item, {
            context,
            onBack: () => window.renderContratoCategories(client, options),
            backText: '← Voltar às categorias',
            breadcrumbsPrefix: categoryCrumbs
          });
          return;
        }
        window.renderContratoAreas(client, item, {
          context,
          onBack: () => window.renderContratoCategories(client, options),
          backText: '← Voltar às categorias',
          breadcrumbsPrefix: categoryCrumbs
        });
      }
    });
  });
};

window.renderContratoAreas = function(client, item, options){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const context = options?.context === 'unidade' ? 'unidade' : 'cliente';
  const onBack = options && typeof options.onBack === 'function'
    ? options.onBack
    : () => window.renderContratoCategories(client, { context });
  const backText = options?.backText || '← Voltar às categorias';
  const breadcrumbsPrefix = Array.isArray(options?.breadcrumbsPrefix) && options.breadcrumbsPrefix.length
    ? options.breadcrumbsPrefix
    : ['Contrato', client.title];
  const areaCrumbs = [...breadcrumbsPrefix, item.title];

  title.textContent = item.title;
  sub.textContent = 'Áreas vinculadas à categoria selecionada.';
  hint.textContent = 'Agora clique na área para ver os dispositivos IDSensor daquele contexto.';
  back.textContent = backText;
  back.onclick = onBack;

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      ${areaCrumbs.map(crumb => `<span class="drill-crumb">${crumb}</span>`).join('')}
    </div>
    <div class="drill-list">
      ${(item.areas || []).map(area => `
        <button class="drill-item drill-nav" type="button" data-contrato-area="${area.id}">
          <div><strong>${area.title}</strong><span>${textForDrillContext(area.subtitle, context)}</span></div>
          <div class="drill-badge ${area.badgeClass}">${area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-contrato-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      const area = (item.areas || []).find(x => x.id === btn.dataset.contratoArea);
      if(area){
        window.renderContratoDevices(client, item, area, {
          context,
          onBack: () => window.renderContratoAreas(client, item, options),
          backText: '← Voltar às áreas',
          breadcrumbs: [...areaCrumbs, area.title]
        });
      }
    });
  });
};

window.renderContratoServices = function(client, item, options){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const context = options?.context === 'unidade' ? 'unidade' : 'cliente';
  const onBack = options && typeof options.onBack === 'function'
    ? options.onBack
    : () => window.renderContratoCategories(client, { context });
  const backText = options?.backText || '← Voltar às categorias';
  const breadcrumbsPrefix = Array.isArray(options?.breadcrumbsPrefix) && options.breadcrumbsPrefix.length
    ? options.breadcrumbsPrefix
    : ['Contrato', client.title];
  const serviceCrumbs = [...breadcrumbsPrefix, item.title];

  title.textContent = item.title;
  sub.textContent = 'Serviços contratados pelo cliente.';
  hint.textContent = 'Clique em um serviço contratado para configurar status e limite.';
  back.textContent = backText;
  back.onclick = onBack;

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      ${serviceCrumbs.map(crumb => `<span class="drill-crumb">${crumb}</span>`).join('')}
    </div>
    <div class="drill-section-title">Serviços contratados</div>
    <div class="drill-list">
      ${(item.services || []).map(service => `
        <button class="drill-item drill-nav drill-service-item" type="button" data-contrato-service="${service.id}">
          <div><strong>${service.title}</strong><span>${textForDrillContext(service.subtitle, context)} · ${contratoServiceLimitLabel(service)}</span></div>
          <div class="drill-badge ${contratoServiceBadgeClass(service)}">${contratoServiceStatusLabel(service)}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-contrato-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const service = (item.services || []).find(x => x.id === btn.dataset.contratoService);
      if(service){
        window.renderContratoServiceConfig(client, item, service, {
          context,
          onBack: () => window.renderContratoServices(client, item, options),
          backText: '← Voltar aos serviços',
          breadcrumbs: [...serviceCrumbs, service.title]
        });
      }
    });
  });
};

window.renderContratoServiceConfig = function(client, item, service, options){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const onBack = options && typeof options.onBack === 'function'
    ? options.onBack
    : () => window.renderContratoServices(client, item, { context: options?.context });
  const backText = options?.backText || '← Voltar aos serviços';
  const crumbs = Array.isArray(options?.breadcrumbs) && options.breadcrumbs.length
    ? options.breadcrumbs
    : ['Contrato', client.title, item.title, service.title];
  const limitType = String(service.limitType || '').toLowerCase() === 'limited' ? 'limited' : 'unlimited';
  const limitValue = parseDrillCount(service.limit);

  title.textContent = service.title;
  sub.textContent = 'Configuração do serviço contratado.';
  hint.textContent = 'Selecione se está ativo ou inativo e defina se o serviço é ilimitado ou com limite.';
  back.textContent = backText;
  back.onclick = onBack;

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      ${crumbs.map(crumb => `<span class="drill-crumb">${crumb}</span>`).join('')}
    </div>
    <div class="drill-service-config">
      <div class="drill-service-summary">
        <div>
          <strong>${service.title}</strong>
          <span>${service.description || service.subtitle || 'Serviço contratado.'}</span>
        </div>
        <div class="drill-badge ${contratoServiceBadgeClass(service)}" data-service-current-badge>${contratoServiceStatusLabel(service)}</div>
      </div>
      <div class="drill-service-form">
        <div class="orc-field">
          <label>Status do serviço</label>
          <select data-service-status>
            <option value="ativo" ${contratoServiceStatusLabel(service) === 'Ativo' ? 'selected' : ''}>Ativo</option>
            <option value="inativo" ${contratoServiceStatusLabel(service) === 'Inativo' ? 'selected' : ''}>Inativo</option>
          </select>
        </div>
        <div class="orc-field">
          <label>Tipo de limite</label>
          <select data-service-limit-type>
            <option value="unlimited" ${limitType === 'unlimited' ? 'selected' : ''}>Ilimitado</option>
            <option value="limited" ${limitType === 'limited' ? 'selected' : ''}>Com limite</option>
          </select>
        </div>
        <div class="orc-field drill-service-limit-field ${limitType === 'limited' ? '' : 'is-disabled'}">
          <label>Limite de mensagens</label>
          <input type="number" min="0" step="1" value="${limitValue}" data-service-limit ${limitType === 'limited' ? '' : 'disabled'}>
          <div class="drill-service-help">Valor contratado para este canal.</div>
        </div>
      </div>
    </div>
  `;

  const statusSelect = content.querySelector('[data-service-status]');
  const limitTypeSelect = content.querySelector('[data-service-limit-type]');
  const limitInput = content.querySelector('[data-service-limit]');
  const badge = content.querySelector('[data-service-current-badge]');
  const limitField = content.querySelector('.drill-service-limit-field');

  const syncBadge = () => {
    if(!badge) return;
    badge.textContent = contratoServiceStatusLabel(service);
    badge.className = `drill-badge ${contratoServiceBadgeClass(service)}`;
  };

  const syncLimitField = () => {
    const limited = limitTypeSelect?.value === 'limited';
    service.limitType = limited ? 'limited' : 'unlimited';
    if(limitInput){
      limitInput.disabled = !limited;
      if(limited && !limitInput.value) limitInput.value = '0';
      service.limit = limited ? parseDrillCount(limitInput.value) : 0;
    }
    if(limitField) limitField.classList.toggle('is-disabled', !limited);
  };

  statusSelect?.addEventListener('change', () => {
    service.status = statusSelect.value === 'inativo' ? 'inativo' : 'ativo';
    syncBadge();
  });
  limitTypeSelect?.addEventListener('change', syncLimitField);
  limitInput?.addEventListener('input', () => {
    service.limit = parseDrillCount(limitInput.value);
  });
};

window.renderContratoDevices = function(client, item, area, options){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const context = options?.context === 'unidade' ? 'unidade' : 'cliente';
  const onBack = options && typeof options.onBack === 'function'
    ? options.onBack
    : () => window.renderContratoAreas(client, item, { context });
  const backText = options?.backText || '← Voltar às áreas';
  const crumbs = Array.isArray(options?.breadcrumbs) && options.breadcrumbs.length
    ? options.breadcrumbs
    : ['Contrato', client.title, item.title, area.title];

  title.textContent = area.title;
  sub.textContent = 'Dispositivos IDSensor desta área na categoria selecionada.';
  hint.textContent = 'Aqui o usuário identifica quais dispositivos IDSensor pertencem a esse grupo.';
  back.textContent = backText;
  back.onclick = onBack;

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      ${crumbs.map(crumb => `<span class="drill-crumb">${crumb}</span>`).join('')}
    </div>
    <div class="drill-list">
      ${(area.devices || []).map(device => `
        <div class="drill-item">
          <div><strong>${device.title}</strong><span>${textForDrillContext(device.subtitle, context)}</span></div>
          <div class="drill-badge ${device.badgeClass}">${device.badge}</div>
        </div>
      `).join('')}
    </div>
  `;
};

window.abrirDrill = function(tipo){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const panel = document.getElementById('drillPanel');
  if(!title || !sub || !content || !panel || !hint) return;

  panel.classList.add('show');
  panel.classList.remove('config-mode');


  if(tipo === 'configuracoes'){
    window.drillState = { mode:'config', status:null, area:null, saude:null };
    
    window.renderConfigRoot();
    return;
  }

  if(tipo === 'status'){
    window.drillState = { mode:'status', status:null, area:null, saude:null };
    window.renderStatusRoot();
    return;
  }
  if(tipo === 'saude'){
    window.drillState = { mode:'saude', status:null, area:null, saude:null };
    window.renderSaudeRoot();
    return;
  }
  if(tipo === 'contrato'){
    window.drillState = { mode:'contrato', status:null, area:null, saude:null };
    window.renderContratoRoot();
    return;
  }

  const views = {
    areas: {
      title: 'Áreas / setores',
      sub: 'Detalhamento por área, uso e manutenção.',
      hint: 'Exemplo de drill down: da área para a situação operacional do que está instalado nela.',
      html: `
        <div class="drill-list">
          <div class="drill-item"><div><strong>Banco IDvida</strong><span>30 em uso · 2 em manutenção</span></div><div class="drill-badge badge-blue">32</div></div>
          <div class="drill-item"><div><strong>Laboratório</strong><span>18 em uso · 7 em manutenção</span></div><div class="drill-badge badge-yellow">25</div></div>
          <div class="drill-item"><div><strong>Nutrição</strong><span>10 em uso · 1 em manutenção</span></div><div class="drill-badge badge-green">11</div></div>
          <div class="drill-item"><div><strong>Farmácia</strong><span>14 em uso · 3 em manutenção</span></div><div class="drill-badge badge-gray">17</div></div>
        </div>`
    }
  };

  const view = views[tipo];
  if(!view) return;
  title.textContent = view.title;
  sub.textContent = view.sub;
  hint.textContent = view.hint;
  content.innerHTML = view.html;
  const back = document.querySelector('.drill-back');
  if(back){
    back.textContent = '← Voltar ao resumo';
    back.onclick = window.voltarResumoDrill;
  }
};

window.fecharDrill = function(){
  document.getElementById('drillPanel')?.classList.remove('show');
};

window.voltarResumoDrill = function(){
  window.fecharDrill();
};

document.addEventListener('click', function(e){
  const panel = document.getElementById('drillPanel');
  if(panel && e.target === panel){ window.fecharDrill(); }
});

/* ===== SCRIPT BLOCK 9 | contrato-card-bind-script ===== */
(function(){
  function bindContratoCard(){
    const all = Array.from(document.querySelectorAll('button, .card, .management-card, .summary-card, .overview-card, .dash-card, .kpi-card, .modal-card, .metric-card'));
    all.forEach(el => {
      if (el.dataset.contratoBound === '1') return;
      const txt = (el.textContent || '').replace(/\s+/g,' ').trim();
      if (txt.includes('Total + contrato + disponível') && txt.includes('Total de dispositivos')) {
        el.style.cursor = 'pointer';
        el.dataset.contratoBound = '1';
        el.addEventListener('click', function(){
          if (typeof abrirDrill === 'function') abrirDrill('contrato');
        });
      }
    });
  }

  bindContratoCard();
  const obs = new MutationObserver(() => bindContratoCard());
  obs.observe(document.body, { childList:true, subtree:true });
})();

/* ===== SCRIPT BLOCK 10 | direct-card-bind-preview ===== */
(function(){
  function markCards(){
    const cards = Array.from(document.querySelectorAll('.card'));
    cards.forEach(card => {
      const txt = (card.textContent || '').replace(/\s+/g,' ').trim();

      if(txt.includes('Status operacional') && txt.includes('Distribuição geral dos dispositivos')){
        card.id = 'card-status';
        card.classList.add('card-clickable');
      }
      if(txt.includes('Saúde dos dispositivos') && txt.includes('Calibrados')){
        card.id = 'card-saude';
        card.classList.add('card-clickable');
      }
      if(txt.includes('Total + contrato + disponível') && txt.includes('Total de dispositivos')){
        card.id = 'card-contrato';
        card.classList.add('card-clickable');
      }
    });
  }

  function bindCards(){
    markCards();

    const status = document.getElementById('card-status');
    const saude = document.getElementById('card-saude');
    const contrato = document.getElementById('card-contrato');

    if(status && !status.dataset.boundClick){
      status.dataset.boundClick = '1';
      status.addEventListener('click', (e) => {
        if(e.target.closest('button')) return;
        if(typeof abrirDrill === 'function') abrirDrill('status');
      });
    }

    if(saude && !saude.dataset.boundClick){
      saude.dataset.boundClick = '1';
      saude.addEventListener('click', (e) => {
        if(e.target.closest('button')) return;
        if(typeof abrirDrill === 'function') abrirDrill('saude');
      });
    }

    if(contrato && !contrato.dataset.boundClick){
      contrato.dataset.boundClick = '1';
      contrato.addEventListener('click', (e) => {
        if(e.target.closest('button')) return;
        if(typeof abrirDrill === 'function') abrirDrill('contrato');
      });
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bindCards);
  } else {
    bindCards();
  }

  const obs = new MutationObserver(() => bindCards());
  obs.observe(document.body, {childList:true, subtree:true});
})();

/* ===== SCRIPT BLOCK 11 | saude-drill-script ===== */
window.SAUDE_DRILL = {
  'calibrados': {
    title: 'Calibrados',
    items: [
      { title:'Dispositivo CAL 01', subtitle:'Calibração válida.', badge:'Calibrado', badgeClass:'badge-blue' },
      { title:'Dispositivo CAL 02', subtitle:'Calibração válida.', badge:'Calibrado', badgeClass:'badge-blue' }
    ]
  },
  'prox-vencimento': {
    title: 'Próx. vencimento',
    items: [
      { title:'Dispositivo PV 01', subtitle:'Calibração próxima do vencimento.', badge:'Próx. vencimento', badgeClass:'badge-orange' },
      { title:'Dispositivo PV 02', subtitle:'Calibração próxima do vencimento.', badge:'Próx. vencimento', badgeClass:'badge-orange' }
    ]
  },
  'vencidos': {
    title: 'Vencidos',
    items: [
      { title:'Dispositivo V 01', subtitle:'Calibração vencida.', badge:'Vencido', badgeClass:'badge-red' },
      { title:'Dispositivo V 02', subtitle:'Calibração vencida.', badge:'Vencido', badgeClass:'badge-red' }
    ]
  },
  'manutencao': {
    title: 'Manutenção',
    items: [
      { title:'Dispositivo M 01', subtitle:'Em manutenção.', badge:'Manutenção', badgeClass:'badge-gray' },
      { title:'Dispositivo M 02', subtitle:'Em manutenção.', badge:'Manutenção', badgeClass:'badge-gray' }
    ]
  },
  'comunicando': {
    title: 'Comunicando',
    items: [
      { title:'Dispositivo C 01', subtitle:'Informação chegando normalmente.', badge:'Comunicando', badgeClass:'badge-comm' },
      { title:'Dispositivo C 02', subtitle:'Informação chegando normalmente.', badge:'Comunicando', badgeClass:'badge-comm' }
    ]
  },
  'sem-comunicacao': {
    title: 'Sem comunicação',
    items: [
      { title:'Dispositivo SC 01', subtitle:'Informação não está chegando.', badge:'Sem comunicação', badgeClass:'badge-no-comm' },
      { title:'Dispositivo SC 02', subtitle:'Informação não está chegando.', badge:'Sem comunicação', badgeClass:'badge-no-comm' }
    ]
  }
};

function abrirSaudeDrill(tipo){
  const data = window.SAUDE_DRILL?.[tipo];
  if(!data) return;

  let panel = document.getElementById('saudeDrillPanel');
  if(!panel){
    panel = document.createElement('div');
    panel.id = 'saudeDrillPanel';
    panel.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.30);display:flex;align-items:flex-start;align-items:center;justify-content:center;z-index:9999;';
    panel.innerHTML = `
      <div style="background:#fff;border-radius:18px;padding:20px;min-width:360px;max-width:560px;width:92%;box-shadow:0 20px 50px rgba(0,0,0,.18);">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <strong id="saudeDrillTitle" style="font-size:18px;color:#243245;"></strong>
          <button type="button" onclick="fecharSaudeDrill()" style="border:none;background:#eef2f8;border-radius:10px;padding:8px 10px;cursor:pointer;">✕</button>
        </div>
        <div id="saudeDrillList"></div>
      </div>
    `;
    document.body.appendChild(panel);
  }
  const title = document.getElementById('saudeDrillTitle');
  const list = document.getElementById('saudeDrillList');
  title.textContent = data.title;
  list.innerHTML = data.items.map(item => `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;background:#f4f7fb;margin-bottom:10px;">
      <div>
        <div style="font-weight:800;color:#243245;">${item.title}</div>
        <div style="font-size:13px;color:#6b7280;margin-top:3px;">${item.subtitle}</div>
      </div>
      <span class="${item.badgeClass}" style="display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:800;white-space:nowrap;">${item.badge}</span>
    </div>
  `).join('');
  panel.style.display = 'flex';
}

function fecharSaudeDrill(){
  const panel = document.getElementById('saudeDrillPanel');
  if(panel) panel.style.display = 'none';
}

/* ===== SCRIPT BLOCK 12 | config-drill-clean ===== */
window.DRILL_CONFIG_TREE = {
  root: [
    {
      id:'calibrados',
      title:'Calibrados',
      subtitle:'Gerencie certificados por área e por dispositivo.',
      badge:'1',
      badgeClass:'badge-blue',
      areas:[
        {
          id:'banco-sangue',
          title:'Banco IDvida',
          subtitle:'24 dispositivos cadastrados para configuração.',
          badge:'24',
          badgeClass:'badge-blue',
          areaEnabled:true,
          devices: devices.map(device => ({
            deviceId: device.id,
            title: device.name,
            subtitle:'Certificado controlado pelo detalhe do dispositivo.',
            enabled: device.hasCertificate === true && !device.certificateHidden,
            fileName: device.certificateFileName || '',
            fileUrl: device.certificateFile || '',
            badgeClass:'badge-blue'
          }))
        }
      ]
    }
  ]
};

function getConfigDeviceCertificateUrl(device){
  if(!device) return '';
  if(device.fileUrl) return device.fileUrl;
  return device.fileName === SAMPLE_CERTIFICATE_NAME ? SAMPLE_CERTIFICATE_FILE : '';
}

function syncConfigDeviceCertificate(configDevice, areaEnabled){
  if(!configDevice) return;
  const panelDevice = getDeviceById(configDevice.deviceId);
  if(!panelDevice) return;
  const fileUrl = getConfigDeviceCertificateUrl(configDevice);
  const hasVisibleCertificate = Boolean(areaEnabled && configDevice.enabled && configDevice.fileName && fileUrl);
  panelDevice.certificateFileName = configDevice.fileName || '';
  panelDevice.certificateFile = fileUrl;
  panelDevice.hasCertificate = hasVisibleCertificate;
  panelDevice.certificateHidden = !hasVisibleCertificate;
}

function refreshCertificatePanelView(){
  if(typeof renderGrid === 'function') renderGrid();
  if(activeId !== null && typeof openDetail === 'function'){
    const active = getDeviceById(activeId);
    if(active) openDetail(active.id, true);
  }
}

window.toggleConfigArea = function(configId, areaId){
  const root = window.DRILL_CONFIG_TREE.root.find(x => x.id === configId);
  if(!root) return;
  const area = root.areas.find(x => x.id === areaId);
  if(!area) return;
  area.areaEnabled = !area.areaEnabled;
  area.devices.forEach(device => syncConfigDeviceCertificate(device, area.areaEnabled));
  refreshCertificatePanelView();
  window.renderConfigDevices(root, area);
};

window.toggleConfigDevice = function(configId, areaId, index){
  const root = window.DRILL_CONFIG_TREE.root.find(x => x.id === configId);
  if(!root) return;
  const area = root.areas.find(x => x.id === areaId);
  if(!area) return;
  const device = area.devices[index];
  if(!device) return;
  device.enabled = !device.enabled;
  syncConfigDeviceCertificate(device, area.areaEnabled);
  refreshCertificatePanelView();
  window.renderConfigDevices(root, area);
};

window.uploadConfigDevice = function(configId, areaId, index, input){
  const file = input?.files?.[0];
  if(!file) return;
  const root = window.DRILL_CONFIG_TREE.root.find(x => x.id === configId);
  if(!root) return;
  const area = root.areas.find(x => x.id === areaId);
  if(!area) return;
  const device = area.devices[index];
  if(!device) return;
  if(device.fileUrl && String(device.fileUrl).startsWith('blob:')){
    URL.revokeObjectURL(device.fileUrl);
  }
  device.fileName = file.name;
  device.fileUrl = file.name === SAMPLE_CERTIFICATE_NAME ? SAMPLE_CERTIFICATE_FILE : URL.createObjectURL(file);
  device.enabled = true;
  syncConfigDeviceCertificate(device, area.areaEnabled);
  refreshCertificatePanelView();
  window.renderConfigDevices(root, area);
};

function renderConfigCertificatePreview(device){
  const fileUrl = getConfigDeviceCertificateUrl(device);
  if(!device?.fileName || !fileUrl) return '';
  const safeUrl = panelEscapeHtml(fileUrl);
  const safePreviewUrl = panelEscapeHtml(certificatePreviewUrl(fileUrl));
  const safeFileName = panelEscapeHtml(device.fileName);
  return `
    <div class="config-cert-preview">
      <div class="config-cert-preview-head">
        <div>
          <strong>Pre-visualizacao</strong>
          <span>${safeFileName}</span>
        </div>
        <div class="config-cert-actions">
          <a href="${safeUrl}" target="_blank" rel="noopener">Ver previa</a>
          <a href="${safeUrl}" download="${safeFileName}">Baixar</a>
        </div>
      </div>
      <iframe src="${safePreviewUrl}" title="Pre-visualizacao do certificado ${safeFileName}"></iframe>
    </div>
  `;
}

window.renderConfigRoot = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const panel = document.getElementById('drillPanel');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back || !panel) return;

  panel.classList.add('show');
  title.textContent = 'Configurações';
  sub.textContent = 'Módulos de configuração do sistema.';
  hint.textContent = 'Clique em uma opção para continuar.';
  back.textContent = '← Voltar ao resumo';
  back.onclick = window.voltarResumoDrill;

  content.innerHTML = `
    <div class="drill-list">
      ${window.DRILL_CONFIG_TREE.root.map(item => `
        <button class="drill-item drill-nav" type="button" data-config="${item.id}">
          <div><strong>${item.title}</strong><span>${item.subtitle}</span></div>
          <div class="drill-badge ${item.badgeClass}">${item.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-config]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = window.DRILL_CONFIG_TREE.root.find(x => x.id === btn.dataset.config);
      if(item) window.renderConfigAreas(item);
    });
  });
};

window.renderConfigAreas = function(item){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  title.textContent = item.title;
  sub.textContent = 'Áreas disponíveis para configuração.';
  hint.textContent = 'Clique na área para configurar certificados.';
  back.textContent = '← Voltar às configurações';
  back.onclick = () => window.renderConfigRoot();

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Configurações</span>
      <span class="drill-crumb">${item.title}</span>
    </div>
    <div class="drill-list">
      ${item.areas.map(area => `
        <button class="drill-item drill-nav" type="button" data-config-area="${area.id}">
          <div><strong>${area.title}</strong><span>${area.subtitle}</span></div>
          <div class="drill-badge ${area.badgeClass}">${area.badge}</div>
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-config-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      const area = item.areas.find(x => x.id === btn.dataset.configArea);
      if(area) window.renderConfigDevices(item, area);
    });
  });
};

window.renderConfigDevices = function(item, area){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  title.textContent = area.title;
  sub.textContent = 'Controle de certificados por área e por dispositivo.';
  hint.textContent = 'Desligar a área bloqueia todos os certificados. Com a área ativa, cada dispositivo pode ser controlado individualmente.';
  back.textContent = '← Voltar às áreas';
  back.onclick = () => window.renderConfigAreas(item);

  content.innerHTML = `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Configurações</span>
      <span class="drill-crumb">${item.title}</span>
      <span class="drill-crumb">${area.title}</span>
    </div>

    <div class="config-toggle-master">
      <div>
        <strong>Certificados da área</strong>
        <div class="config-master-note">Quando desligado, nenhum dispositivo desta área mostra o ícone do certificado no detalhe.</div>
      </div>
      <button class="config-switch ${area.areaEnabled ? 'on' : ''}" type="button" onclick="toggleConfigArea('${item.id}','${area.id}')"></button>
    </div>

    <div class="drill-list">
      ${area.devices.map((device, idx) => `
        <div class="drill-item config-device-row${device.fileName ? ' has-certificate' : ''}">
          <div>
            <strong>${device.title}</strong>
            <span>${device.enabled ? 'Certificado habilitado individualmente.' : 'Certificado desabilitado individualmente.'}</span>
          </div>
          <label class="config-upload-btn" title="Subir arquivo do certificado">
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onchange="uploadConfigDevice('${item.id}','${area.id}', ${idx}, this)">
            <span>↑</span>
          </label>
          <div class="config-device-controls">
            <div class="config-inline-state">${device.fileName ? device.fileName : 'Nenhum arquivo'}</div>
            <button class="config-switch ${device.enabled ? 'on' : ''}" type="button" onclick="toggleConfigDevice('${item.id}','${area.id}', ${idx})"></button>
          </div>
          ${renderConfigCertificatePreview(device)}
        </div>
      `).join('')}
    </div>
  `;
};

/* ===== SCRIPT BLOCK 13 | config-open-fix-final ===== */
function abrirConfiguracoesDrill(ev){
  const btn = ev && ev.currentTarget ? ev.currentTarget : document.querySelector('.actions-premium-icon');
  if(window.abrirDrill){ window.abrirDrill('configuracoes'); }
  const panel = document.getElementById('drillPanel');
  if(!panel) return;
  panel.classList.add('show','config-mode');
  const rect = btn ? btn.getBoundingClientRect() : {left: window.innerWidth*0.5, top: 180, width: 44};
  const panelWidth = Math.min(760, window.innerWidth - 40);
  let left = rect.left + rect.width/2 - panelWidth/2;
  left = Math.max(20, Math.min(left, window.innerWidth - panelWidth - 20));
  let top = rect.top - 30;
  top = Math.max(20, top);
  
  
  panel.style.right = 'auto';
}

/* ===== SCRIPT BLOCK 14 | orcamento-flow-script ===== */
window.ORCAMENTO_BASE = {
  cliente: 'H IDvida',
  solicitante: 'João Silva',
  unidade: 'Paulista'
};

window.abrirOrcamentoDrill = function(){
  const panel = document.getElementById('drillPanel');
  if(!panel) return;
  panel.classList.add('show');
  if(window.renderOrcamentoRoot) window.renderOrcamentoRoot();
};

window.renderOrcamentoRoot = function(){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  title.textContent = 'Solicitar orçamento';
  sub.textContent = 'Escolha o tipo de solicitação para continuar.';
  hint.textContent = 'Cliente, solicitante e unidade já podem vir preenchidos automaticamente.';
  back.textContent = '← Voltar ao resumo';
  back.onclick = window.voltarResumoDrill;

  content.innerHTML = `
    <div class="drill-list">
      <button class="drill-item drill-nav" type="button" data-orc="novo">
        <div><strong>Novo dispositivo</strong><span>Solicitar novos equipamentos para uma área existente.</span></div>
        <div class="drill-badge badge-blue">Selecionar</div>
      </button>
      <button class="drill-item drill-nav" type="button" data-orc="reposicao">
        <div><strong>Reposição / reparo</strong><span>Substituição de equipamento ou pedido de reparo técnico.</span></div>
        <div class="drill-badge badge-gray">Abrir</div>
      </button>
      <button class="drill-item drill-nav" type="button" data-orc="expansao">
        <div><strong>Expansão para nova área</strong><span>Criar uma nova área com quantidade definida de dispositivos.</span></div>
        <div class="drill-badge badge-gray">Abrir</div>
      </button>
    </div>
  `;

  content.querySelectorAll('[data-orc]').forEach(btn => {
    btn.addEventListener('click', () => window.renderOrcamentoForm(btn.dataset.orc));
  });
};

window.renderOrcamentoForm = function(tipo){
  const title = document.getElementById('drillTitle');
  const sub = document.getElementById('drillSub');
  const hint = document.getElementById('drillHint');
  const content = document.getElementById('drillContent');
  const back = document.querySelector('.drill-back');
  if(!title || !sub || !hint || !content || !back) return;

  const base = window.ORCAMENTO_BASE;
  back.textContent = '← Voltar às opções';
  back.onclick = () => window.renderOrcamentoRoot();

  const crumbs = (extra) => `
    <div class="drill-breadcrumbs">
      <span class="drill-crumb">Orçamento</span>
      <span class="drill-crumb">${extra}</span>
    </div>
  `;

  const baseFields = (extra) => `
    <div class="orc-row">
      <div class="orc-field"><label>Cliente</label><input value="${base.cliente}"></div>
      <div class="orc-field"><label>Solicitante</label><input value="${base.solicitante}"></div>
    </div>
    <div class="orc-row">
      <div class="orc-field">
        <label>Unidade</label>
        <select>
          <option selected>${base.unidade}</option>
          <option>Unidade Centro</option>
          <option>Unidade Sul</option>
        </select>
      </div>
      ${extra}
    </div>
  `;

  if(tipo === 'novo'){
    title.textContent = 'Novo dispositivo';
    sub.textContent = 'Solicitação de novos equipamentos para uma área existente.';
    hint.textContent = 'O usuário pode informar quantidade e usar um dispositivo existente como referência.';
    content.innerHTML = `
      ${crumbs('Novo dispositivo')}
      <div class="orc-form">
        ${baseFields('<div class="orc-field"><label>Quantidade</label><input type="number" value="1"></div>')}
        <div class="orc-row">
          <div class="orc-field"><label>Área de destino</label><select><option>UTI</option><option>Banco IDvida</option><option>Farmácia</option></select></div>
          <div class="orc-field"><label>Dispositivo de referência</label><select><option>Selecione uma referência</option><option>Geladeira UTI 02</option><option>Banco IDvida 03</option></select></div>
        </div>
        <div class="orc-field"><label>Observações</label><textarea placeholder="Ex.: quero um dispositivo igual ao da UTI 02."></textarea></div>
        <div class="orc-actions"><button class="orc-btn">Cancelar</button><button class="orc-btn primary">Enviar solicitação</button></div>
      </div>
    `;
  }

  if(tipo === 'reposicao'){
    title.textContent = 'Reposição / reparo';
    sub.textContent = 'Abertura de solicitação para troca ou reparo.';
    hint.textContent = 'Selecione o equipamento afetado e informe o tipo da demanda.';
    content.innerHTML = `
      ${crumbs('Reposição / reparo')}
      <div class="orc-form">
        ${baseFields('<div class="orc-field"><label>Tipo</label><select><option>Reposição</option><option>Reparo</option></select></div>')}
        <div class="orc-row">
          <div class="orc-field"><label>Dispositivo afetado</label><select><option>Geladeira 3</option><option>Geladeira 8</option><option>Banco IDvida 03</option></select></div>
          <div class="orc-field"><label>Motivo</label><select><option>Falha técnica</option><option>Dano físico</option><option>Baixa performance</option></select></div>
        </div>
        <div class="orc-field"><label>Observações</label><textarea placeholder="Descreva o contexto da solicitação."></textarea></div>
        <div class="orc-actions"><button class="orc-btn">Cancelar</button><button class="orc-btn primary">Enviar solicitação</button></div>
      </div>
    `;
  }

  if(tipo === 'expansao'){
    title.textContent = 'Expansão para nova área';
    sub.textContent = 'Criação de nova área com dispositivos planejados.';
    hint.textContent = 'O usuário define a nova área, quantidade de dispositivos e, se quiser, usa uma referência existente.';
    content.innerHTML = `
      ${crumbs('Expansão para nova área')}
      <div class="orc-form">
        ${baseFields('<div class="orc-field"><label>Quantidade de dispositivos</label><input type="number" value="4"></div>')}
        <div class="orc-row">
          <div class="orc-field"><label>Nome da nova área</label><input value="Hemodinâmica"></div>
          <div class="orc-field"><label>Dispositivo de referência</label><select><option>Geladeira UTI 02</option><option>Banco IDvida 01</option><option>Nenhum</option></select></div>
        </div>
        <div class="orc-field"><label>Observações</label><textarea placeholder="Ex.: criar nova área com 4 dispositivos iguais ao da UTI 02."></textarea></div>
        <div class="orc-actions"><button class="orc-btn">Cancelar</button><button class="orc-btn primary">Enviar solicitação</button></div>
      </div>
    `;
  }
};

/* ===== SCRIPT BLOCK 15 | info-feature-script ===== */
window.currentInfoId = null;


function getDeviceById(id){
  return devices.find(x => String(x.id) === String(id));
}
function ensureInfoFields(d){
  if(!d) return;
  if(!d.mac) d.mac = 'C3:00:00:2E:E8:96';
  if(!d.deviceModel) d.deviceModel = 'IDvida Sensor v2';
  if(!d.connType) d.connType = 'Wi-Fi';
  if(!d.code) d.code = String(d.id).padStart(4,'0');
  if(!d.equipModel) d.equipModel = 'IDvida Cooler Pro';
  if(!d.responsible) d.responsible = 'João Silva';
  if(!Array.isArray(d.auditLog) || !d.auditLog.length){
    d.auditLog = buildInitialAuditLog(d);
  }
}

function getCurrentAuditUser(){
  const label = document.getElementById('currentUserLabel')?.textContent?.trim();
  return label || 'Lab IDvida';
}
function getAuditNow(){
  const now = new Date();
  return now.toLocaleString('pt-BR', {
    day:'2-digit', month:'2-digit', year:'numeric',
    hour:'2-digit', minute:'2-digit'
  });
}
function buildInitialAuditLog(d){
  return [
    {
      scope:'equipamento',
      field:'Nome do dispositivo',
      user:'Admin 1',
      when:'07/04/2026 20:52',
      description:`Última edição do nome registrada para ${d.name}.`
    },
    {
      scope:'dispositivo',
      field:'MAC',
      user:'Admin 2',
      when:'07/04/2026 20:31',
      description:`Última troca de MAC registrada no dispositivo ${d.mac}.`
    },
    {
      scope:'painel',
      field:'Painel silenciado',
      user:'Lab IDvida',
      when:'07/04/2026 20:14',
      description:'Silenciamento global do painel por 15 minutos.'
    },
    {
      scope:'status',
      field:'Status do dispositivo',
      user:'Admin 1',
      when:'07/04/2026 19:42',
      description:`Status alterado para ${d.status || 'NORMAL'}.`
    }
  ];
}
function pushAuditEntry(d, entry){
  ensureInfoFields(d);
  d.auditLog.unshift({
    scope: entry.scope || 'equipamento',
    field: entry.field || 'Atualização',
    user: entry.user || getCurrentAuditUser(),
    when: entry.when || getAuditNow(),
    description: entry.description || 'Alteração registrada no equipamento.'
  });
}
function getLastAuditEntry(d){
  ensureInfoFields(d);
  return d.auditLog && d.auditLog.length ? d.auditLog[0] : null;
}
function getLastAuditLabel(d){
  const entry = getLastAuditEntry(d);
  if(!entry) return 'Sem alterações registradas';
  return `${entry.field}`;
}
function renderAuditHistoryModal(d){
  ensureInfoFields(d);
  const target = document.getElementById('historyAuditContent');
  if(!target) return;
  const grouped = {
    equipamento: d.auditLog.filter(item => item.scope === 'equipamento'),
    dispositivo: d.auditLog.filter(item => item.scope === 'dispositivo'),
    painel: d.auditLog.filter(item => item.scope === 'painel'),
    status: d.auditLog.filter(item => item.scope === 'status')
  };
  const renderItems = (items) => {
    if(!items.length){
      return '<div class="history-empty">Nenhuma alteração registrada nesta seção.</div>';
    }
    return `<div class="history-list">${items.map(item => `
      <div class="history-item">
        <div class="history-item-top">
          <div>
            <div class="history-item-title">${item.field}</div>
            <div class="history-item-meta">Alterado por <strong>${item.user}</strong></div>
          </div>
          <div class="history-item-date">${item.when}</div>
        </div>
        <div class="history-item-desc">${item.description}</div>
      </div>
    `).join('')}</div>`;
  };
  const latest = getLastAuditEntry(d);
  target.innerHTML = `
    <button class="info-modal-close" type="button" onclick="closeHistoryAuditModal()">✕</button>
    <h2>Última edição</h2>
    <div class="history-head-sub">${d.name} • ${d.sector}</div>

    <div class="history-summary">
      <div class="history-summary-card">
        <div class="history-summary-k">Última alteração</div>
        <div class="history-summary-v">${latest ? latest.field : 'Sem histórico'}</div>
      </div>
      <div class="history-summary-card">
        <div class="history-summary-k">Responsável pela última edição</div>
        <div class="history-summary-v">${latest ? latest.user : '—'}</div>
      </div>
    </div>

    <div class="history-block">
      <div class="history-block-title">Equipamento monitorado</div>
      ${renderItems(grouped.equipamento)}
    </div>

    <div class="history-block">
      <div class="history-block-title">Dispositivo</div>
      ${renderItems(grouped.dispositivo)}
    </div>

    <div class="history-block">
      <div class="history-block-title">Painel</div>
      ${renderItems(grouped.painel)}
    </div>

    <div class="history-block">
      <div class="history-block-title">Status do card</div>
      ${renderItems(grouped.status)}
    </div>
  `;
}
function openHistoryAuditModal(){
  const d = getDeviceById(window.currentInfoId);
  if(!d) return;
  renderAuditHistoryModal(d);
  document.getElementById('historyAuditOverlay')?.classList.add('show');
}
function closeHistoryAuditModal(){
  document.getElementById('historyAuditOverlay')?.classList.remove('show');
}
function closeInfoOverlays(){
  document.getElementById('infoOverlayModal')?.classList.remove('show');
  document.getElementById('infoEditOverlay')?.classList.remove('show');
  document.getElementById('infoMacOverlay')?.classList.remove('show');
  document.getElementById('infoCloneOverlay')?.classList.remove('show');
  document.getElementById('cloneAttentionOverlay')?.classList.remove('show');
  document.getElementById('historyAuditOverlay')?.classList.remove('show');
  document.getElementById('infoEditFeedback')?.classList.remove('show');
  document.getElementById('infoMacFeedback')?.classList.remove('show');
  document.getElementById('infoCloneFeedback')?.classList.remove('show');
}
function syncCloneButtonVisibility(){
  const cloneBtn = document.getElementById('cloneInfoBtn');
  if(!cloneBtn) return;
  cloneBtn.style.display = (window.currentRole === 'area') ? 'none' : '';
}
function openInfoModal(id){
  const d = getDeviceById(id);
  if(!d) return;
  ensureInfoFields(d);
  window.currentInfoId = d.id;
  closeInfoOverlays();
  document.getElementById('infoDeviceMac').textContent = d.mac;
  document.getElementById('infoDeviceModel').textContent = d.deviceModel;
  document.getElementById('infoDeviceConn').textContent = d.connType;
  document.getElementById('infoEquipName').textContent = d.name;
  document.getElementById('infoEquipCode').textContent = d.code;
  document.getElementById('infoEquipModel').textContent = d.equipModel;
  document.getElementById('infoEquipArea').textContent = d.sector;
  document.getElementById('infoEquipResponsible').textContent = d.responsible;
  const lastEditInfo = document.getElementById('infoEquipLastEdit');
  if(lastEditInfo) lastEditInfo.textContent = getLastAuditLabel(d);
  const certImg = document.querySelector('#infoOverlayModal img[alt="Certificado"], #infoOverlayModal .certificate-badge, #infoOverlayModal .cert-badge, #infoOverlayModal .certificado-badge');
  if(certImg){
    certImg.style.display = d.certificateHidden ? 'none' : '';
  }
  syncCloneButtonVisibility();
  document.getElementById('infoOverlayModal').classList.add('show');
}
function openEditModal(){
  const d = getDeviceById(window.currentInfoId);
  if(!d) return;
  ensureInfoFields(d);
  closeInfoOverlays();
  document.getElementById('editName').value = d.name;
  document.getElementById('editCode').value = d.code;
  document.getElementById('editEquipModel').value = d.equipModel;
  document.getElementById('editArea').value = d.sector;
  document.getElementById('editResponsible').value = d.responsible;
  document.getElementById('infoEditOverlay').classList.add('show');
}
function saveEditModal(){
  const d = getDeviceById(window.currentInfoId);
  if(!d) return;
  const prev = { name:d.name, code:d.code, equipModel:d.equipModel, sector:d.sector, responsible:d.responsible };
  d.name = document.getElementById('editName').value.trim() || d.name;
  d.code = document.getElementById('editCode').value.trim() || d.code;
  d.equipModel = document.getElementById('editEquipModel').value.trim() || d.equipModel;
  d.sector = document.getElementById('editArea').value;
  d.responsible = document.getElementById('editResponsible').value.trim() || d.responsible;

  if(prev.name !== d.name){
    pushAuditEntry(d, {scope:'equipamento', field:'Nome do dispositivo', description:`Nome alterado de ${prev.name} para ${d.name}.`});
  }
  if(prev.code !== d.code){
    pushAuditEntry(d, {scope:'equipamento', field:'Código', description:`Código alterado de ${prev.code} para ${d.code}.`});
  }
  if(prev.equipModel !== d.equipModel){
    pushAuditEntry(d, {scope:'equipamento', field:'Modelo do equipamento', description:`Modelo alterado de ${prev.equipModel} para ${d.equipModel}.`});
  }
  if(prev.sector !== d.sector){
    pushAuditEntry(d, {scope:'equipamento', field:'Área', description:`Área alterada de ${prev.sector} para ${d.sector}.`});
  }
  if(prev.responsible !== d.responsible){
    pushAuditEntry(d, {scope:'equipamento', field:'Responsável', description:`Responsável alterado de ${prev.responsible} para ${d.responsible}.`});
  }

  renderGrid();
  if(typeof openDetail === 'function' && window.activeId !== null){
    openDetail(d.id, true);
  }
  document.getElementById('infoEditFeedback').classList.add('show');
  setTimeout(() => openInfoModal(d.id), 350);
}
function openMacModal(){
  const d = getDeviceById(window.currentInfoId);
  if(!d) return;
  ensureInfoFields(d);
  closeInfoOverlays();
  document.getElementById('macValue').value = d.mac;
  document.getElementById('macModel').value = d.deviceModel || 'IDvida Sensor v2';
  document.getElementById('macConn').value = d.connType || 'Wi-Fi';
  document.getElementById('macReason').value = 'Reparo';
  document.getElementById('infoMacOverlay').classList.add('show');
}
function saveMacModal(){
  const d = getDeviceById(window.currentInfoId);
  if(!d) return;
  const prev = { mac:d.mac, model:d.deviceModel, conn:d.connType };
  d.mac = document.getElementById('macValue').value.trim() || d.mac;
  d.deviceModel = document.getElementById('macModel').value.trim() || d.deviceModel;
  d.connType = document.getElementById('macConn').value || d.connType;

  if(prev.mac !== d.mac){
    pushAuditEntry(d, {scope:'dispositivo', field:'MAC', description:`MAC alterado de ${prev.mac} para ${d.mac}.`});
  }
  if(prev.model !== d.deviceModel){
    pushAuditEntry(d, {scope:'dispositivo', field:'Modelo do dispositivo', description:`Modelo do dispositivo alterado de ${prev.model} para ${d.deviceModel}.`});
  }
  if(prev.conn !== d.connType){
    pushAuditEntry(d, {scope:'dispositivo', field:'Conexão', description:`Tipo de conexão alterado de ${prev.conn} para ${d.connType}.`});
  }

  document.getElementById('infoMacFeedback').classList.add('show');
  setTimeout(() => openInfoModal(d.id), 350);
}

function openCloneModal(){
  if(window.currentRole === 'area') return;
  closeInfoOverlays();
  document.getElementById('cloneAttentionOverlay')?.classList.add('show');
}

function openCloneForm(){
  document.getElementById('cloneAttentionOverlay')?.classList.remove('show');
  document.getElementById('infoCloneOverlay')?.classList.add('show');
}

function saveCloneModal(){
  const source = getDeviceById(window.currentInfoId);
  if(!source) return;

  const name = document.getElementById('cloneName').value.trim();
  const equip = document.getElementById('cloneEquip').value.trim();
  const device = document.getElementById('cloneDevice').value.trim();
  const mac = document.getElementById('cloneMac').value.trim();

  if(!name || !equip || !device || !mac){
    alert('Preencha nome do equipamento, modelo do equipamento, modelo do dispositivo e MAC.');
    return;
  }

  const newId = Math.max(...devices.map(d => Number(d.id) || 0)) + 1;
  const midTemp = Number(((source.min + source.max) / 2).toFixed(1));

  const newDevice = {
    id: newId,
    name: name,
    sector: source.sector,
    temp: 0,
    dailyMin: 0,
    dailyMax: 0,
    min: 0,
    max: 0,
    status: 'NORMAL',
    state: 'blue',
    online: true,
    battery: 100,
    hum1: 0,
    hum2: 0,
    updated: 'aguardando leitura',
    timerLabel: 'Novo dispositivo aguardando primeira leitura',
    timer: 0,
    fill: 0,
    range: 0,
    events: ['Novo dispositivo clonado', 'Sem leitura inicial'],
    chart: Array(12).fill(0),
    equipModel: equip,
    deviceModel: device,
    mac: mac,
    code: String(newId).padStart(4,'0'),
    responsible: source.responsible,
    connType: 'LoRa',
    hasCertificate: false,
    certificateHidden: true
  };

  devices.push(newDevice);
  if(typeof selectedArea !== 'undefined') selectedArea = source.sector;
  renderGrid();
  closeInfoOverlays();
  openInfoModal(newId);
}

/* ===== SCRIPT BLOCK 16 | history-audit-overlay-script ===== */
document.getElementById('historyAuditOverlay')?.addEventListener('click', closeHistoryAuditModal);

/* ===== SCRIPT BLOCK 17 | clone-info-feature-outside ===== */
document.getElementById('cloneAttentionOverlay')?.addEventListener('click', closeInfoOverlays);
document.getElementById('infoCloneOverlay')?.addEventListener('click', ()=> openInfoModal(window.currentInfoId));

/* ===== SCRIPT BLOCK 18 | info-feature-outside ===== */
document.getElementById('infoOverlayModal')?.addEventListener('click', closeInfoOverlays);
document.getElementById('infoEditOverlay')?.addEventListener('click', ()=> openInfoModal(window.currentInfoId));
document.getElementById('infoMacOverlay')?.addEventListener('click', ()=> openInfoModal(window.currentInfoId));

/* ===== SCRIPT BLOCK 19 | areas-clients-within-devices ===== */
(function(){
  const chipAreas = document.getElementById('chipAreas');
  const chipClients = document.getElementById('chipClients');
  const areasModal = document.getElementById('areasModal');
  const clientsModal = document.getElementById('clientsModal');
  const choiceBackdrop = document.getElementById('choiceBackdrop');
  const closeAreasModalBtn = document.getElementById('closeAreasModal');
  const closeClientsModalBtn = document.getElementById('closeClientsModal');
  const subtitleEl = document.getElementById('pageSubtitle');

  if(!chipAreas || !chipClients || !areasModal || !clientsModal || !choiceBackdrop) return;

  function openModal(modal){
    choiceBackdrop.classList.add('show');
    modal.classList.add('show');
  }

  function closeModal(modal){
    modal.classList.remove('show');
    if(!areasModal.classList.contains('show') && !clientsModal.classList.contains('show')){
      choiceBackdrop.classList.remove('show');
    }
  }

  chipAreas.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    openModal(areasModal);
  });

  chipClients.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    openModal(clientsModal);
  });

  if(closeAreasModalBtn){
    closeAreasModalBtn.addEventListener('click', ()=>closeModal(areasModal));
  }
  if(closeClientsModalBtn){
    closeClientsModalBtn.addEventListener('click', ()=>closeModal(clientsModal));
  }

  choiceBackdrop.addEventListener('click', function(){
    closeModal(areasModal);
    closeModal(clientsModal);
  });

  document.querySelectorAll('[data-area-option]').forEach(btn => {
    btn.addEventListener('click', function(){
      selectedArea = this.getAttribute('data-area-option') || 'Laboratório';
      nocFilteredIds = null;
      if(subtitleEl){
        subtitleEl.textContent = selectedClient + ' · ' + selectedArea;
      }
      closeModal(areasModal);
      activeId = null;
      renderGrid();
    });
  });
})();

/* ===== SCRIPT BLOCK 20 | user-role-simulation ===== */
(function(){
  const userSwitcher = document.getElementById('userSwitcher');
  const userMenu = document.getElementById('userMenu');
  const currentUserLabel = document.getElementById('currentUserLabel');
  const gestaoBtn = document.getElementById('gestaoBtn');
  const gestaoTitle = document.getElementById('gestaoTitle');
  const gestaoSubtitle = document.getElementById('gestaoSubtitle');
  const chipAreas = document.getElementById('chipAreas');
  const chipClients = document.getElementById('chipClients');
  const subtitleEl = document.getElementById('pageSubtitle');

  if(!userSwitcher || !userMenu || !currentUserLabel) return;

  let currentRole = 'master';
  window.currentRole = currentRole;
  let lastGestaoHTML = '';

  function getGestaoOverlay(){
    return document.getElementById('drillOverlay') || document.getElementById('gestaoOverlay') || document.querySelector('.drill-overlay') || document.querySelector('.gestao-overlay');
  }
  function getGestaoModal(){
    return document.getElementById('drillModal') || document.getElementById('gestaoModal') || document.querySelector('.drill-modal') || document.querySelector('.gestao-modal');
  }

  function syncGestaoCopy(role){
    if(gestaoTitle){
      if(role === 'admin1' || role === 'admin2'){
        gestaoTitle.textContent = 'Gestão de dispositivos por unidades';
      } else {
        gestaoTitle.textContent = 'Gestão de dispositivos por cliente';
      }
    }
    if(gestaoSubtitle){
      gestaoSubtitle.textContent = 'Leitura rápida de todos os dispositivos.';
    }
  }

  function applyRole(role){
    currentRole = role;
    window.currentRole = role;
    syncGestaoCopy(role);
    const labelMap = {
      master: 'IDvida Master',
      admin1: 'DM 1',
      admin2: 'DM 2',
      area: 'Teste IDvida',
      cart: 'Hospital Einstein'
    };
    currentUserLabel.textContent = labelMap[role] || 'IDvida Master';
    document.body.dataset.panelRole = role;
    document.body.classList.toggle('cart-profile-mode', role === 'cart');
    document.querySelectorAll('.auth-master-only').forEach((element) => {
      element.hidden = role !== 'master';
    });
    if(typeof window.syncPanelRoleChrome === 'function'){
      window.syncPanelRoleChrome(role);
    }

    if(role === 'master'){
      if(typeof window.closeCartTrackingView === 'function') window.closeCartTrackingView();
      if(gestaoBtn) gestaoBtn.style.display = '';
      if(chipAreas) chipAreas.style.display = '';
      if(chipClients) chipClients.style.display = '';
      if(subtitleEl) subtitleEl.textContent = 'Laboratório IDvida · Banco IDvida';
      if(typeof selectedArea !== 'undefined') selectedArea = 'Banco IDvida';
      if(typeof selectedClient !== 'undefined') selectedClient = 'Laboratório IDvida';
    }

    if(role === 'admin1'){
      if(typeof window.closeCartTrackingView === 'function') window.closeCartTrackingView();
      if(gestaoBtn) gestaoBtn.style.display = '';
      if(chipAreas) chipAreas.style.display = '';
      if(chipClients) chipClients.style.display = 'none';
      if(subtitleEl) subtitleEl.textContent = 'Laboratório IDvida · Banco IDvida';
      if(typeof selectedArea !== 'undefined') selectedArea = 'Banco IDvida';
      if(typeof selectedClient !== 'undefined') selectedClient = 'Laboratório IDvida';
    }

    if(role === 'admin2'){
      if(typeof window.closeCartTrackingView === 'function') window.closeCartTrackingView();
      if(gestaoBtn) gestaoBtn.style.display = '';
      if(chipAreas) chipAreas.style.display = '';
      if(chipClients) chipClients.style.display = 'none';
      if(subtitleEl) subtitleEl.textContent = 'Laboratório IDvida · Banco IDvida';
      if(typeof selectedArea !== 'undefined') selectedArea = 'Banco IDvida';
      if(typeof selectedClient !== 'undefined') selectedClient = 'Laboratório IDvida';
    }

    if(role === 'area'){
      if(typeof window.closeCartTrackingView === 'function') window.closeCartTrackingView();
      if(gestaoBtn) gestaoBtn.style.display = 'none';
      if(chipAreas) chipAreas.style.display = 'none';
      if(chipClients) chipClients.style.display = 'none';
      if(subtitleEl) subtitleEl.textContent = 'Laboratório IDvida · Banco IDvida';
      if(typeof selectedArea !== 'undefined') selectedArea = 'Banco IDvida';
      if(typeof selectedClient !== 'undefined') selectedClient = 'Laboratório IDvida';
    }

    if(role === 'cart'){
      if(gestaoBtn) gestaoBtn.style.display = 'none';
      if(chipAreas) chipAreas.style.display = 'none';
      if(chipClients) chipClients.style.display = 'none';
      if(subtitleEl) subtitleEl.textContent = 'Hospital Einstein · Carrinhos de resíduo';
      if(typeof selectedArea !== 'undefined') selectedArea = 'Carrinhos de resíduo';
      if(typeof selectedClient !== 'undefined') selectedClient = 'Hospital Einstein';
      if(typeof window.openCartTrackingView === 'function'){
        window.openCartTrackingView({ profileMode:true });
      }else{
        window.__pendingCartTrackingOpen = true;
      }
      if(typeof syncCloneButtonVisibility === 'function') syncCloneButtonVisibility();
      if(typeof window.updateScheduledCollectionVisibility === 'function') window.updateScheduledCollectionVisibility();
      if(typeof window.updateBindDeviceVisibility === 'function') window.updateBindDeviceVisibility();
      return;
    }

    if(typeof renderGrid === 'function') renderGrid();
    if(typeof syncCloneButtonVisibility === 'function') syncCloneButtonVisibility();
    if(typeof window.updateScheduledCollectionVisibility === 'function') window.updateScheduledCollectionVisibility();
    if(typeof window.updateBindDeviceVisibility === 'function') window.updateBindDeviceVisibility();
  }

  window.applyPanelRole = applyRole;
  window.setPanelVisualRole = function(role){
    currentRole = role;
    window.currentRole = role;
    syncGestaoCopy(role);
    document.body.dataset.panelRole = role;
    document.body.classList.toggle('cart-profile-mode', role === 'cart');
    if(gestaoBtn) gestaoBtn.style.display = role === 'cart' || role === 'area' ? 'none' : '';
    if(chipAreas) chipAreas.style.display = role === 'cart' || role === 'area' ? 'none' : '';
    if(chipClients) chipClients.style.display = role === 'master' ? '' : 'none';
    document.querySelectorAll('.auth-master-only').forEach((element) => {
      element.hidden = role !== 'master';
    });
    if(typeof window.syncPanelRoleChrome === 'function'){
      window.syncPanelRoleChrome(role);
    }
    if(typeof syncCloneButtonVisibility === 'function') syncCloneButtonVisibility();
    if(typeof window.updateScheduledCollectionVisibility === 'function') window.updateScheduledCollectionVisibility();
    if(typeof window.updateBindDeviceVisibility === 'function') window.updateBindDeviceVisibility();
  };

  userSwitcher.addEventListener('click', function(e){
    e.stopPropagation();
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', function(){
    userMenu.style.display = 'none';
  });

  userMenu.querySelectorAll('[data-role]').forEach(btn => {
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      applyRole(this.getAttribute('data-role'));
      userMenu.style.display = 'none';
    });
  });

  // Wrap existing open drill function to blank one card for admin2 inside Gestão only
  const originalAbrirDrill = window.abrirDrill;
  if(typeof originalAbrirDrill === 'function'){
    window.abrirDrill = function(kind){
      originalAbrirDrill(kind);
      if(currentRole !== 'admin2' || kind !== 'gestao') return;

      const modal = getGestaoModal() || document.querySelector('.choice-modal.show') || document.querySelector('.card-floating-detail');
      if(!modal) return;

      const cards = modal.querySelectorAll('.gestao-card, .drill-card, .kpi-card, .overview-card, .choice-item');
      if(cards && cards.length >= 1){
        const first = cards[0];
        first.innerHTML = '<div class="blank-gestao-card"><div class="blank-title">Total de contratos disponíveis</div><div class="blank-sub">Indisponível para este perfil.</div></div>';
        first.style.pointerEvents = 'none';
      }
    }
  }

  if(!document.getElementById('loginShell')){
    applyRole('master');
  }
})();

/* ===== PANEL AUTH | login profiles ===== */
(function(){
  const SESSION_KEY = 'idsensor.panel.session.v2';
  const DEFAULT_API_BASE_URL = 'http://localhost:4000';
  const loginShell = document.getElementById('loginShell');
  const loginForm = document.getElementById('panelLoginForm');
  const usernameInput = document.getElementById('loginUsername');
  const passwordInput = document.getElementById('loginPassword');
  const feedback = document.getElementById('loginFeedback');
  const profilePreview = document.getElementById('loginProfilePreview');
  const clientLogo = document.getElementById('loginClientLogo');
  const userMenu = document.getElementById('userMenu');
  const currentUserLabel = document.getElementById('currentUserLabel');
  const currentUserAvatar = document.getElementById('currentUserAvatar');
  const logoutButton = document.getElementById('panelLogoutBtn');

  const profileChrome = {
    master: {
      displayName: 'IDvida Master',
      organization: 'ID sensor',
      logo: './assets/idsensor-logo.png',
      avatar: './assets/idsensor-symbol.png',
      wideLogo: true
    },
    admin1: {
      displayName: 'DM 1',
      organization: 'ID sensor',
      logo: './assets/idsensor-symbol.png',
      avatar: './assets/idsensor-symbol.png',
      symbolLogo: true
    },
    admin2: {
      displayName: 'DM 2',
      organization: 'ID sensor',
      logo: './assets/idsensor-symbol.png',
      avatar: './assets/idsensor-symbol.png',
      symbolLogo: true
    },
    area: {
      displayName: 'Teste IDvida',
      organization: 'ID sensor',
      logo: './assets/idsensor-symbol.png',
      avatar: './assets/idsensor-symbol.png',
      symbolLogo: true
    },
    cart: {
      displayName: 'Hospital Einstein',
      organization: 'Hospital Einstein',
      logo: './assets/einstein-logo.png',
      avatar: './assets/einstein-symbol.png',
      wideLogo: true,
      logoHalo: true
    }
  };

  function getAuthApiBaseUrl(){
    try {
      const configuredUrl = localStorage.getItem('PANEL_API_BASE_URL');
      if(configuredUrl) return configuredUrl.replace(/\/+$/, '');
    } catch(e) {}

    try {
      const host = window.location.hostname;
      const port = window.location.port;
      const protocol = window.location.protocol;
      const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '';
      const isStandaloneLocalPanel = isLocalHost && port && port !== '4000';

      if(protocol.indexOf('http') === 0 && window.location.origin && !isStandaloneLocalPanel){
        return window.location.origin.replace(/\/+$/, '');
      }
    } catch(e) {}

    return DEFAULT_API_BASE_URL;
  }

  function setFeedback(message, tone){
    if(!feedback) return;
    feedback.textContent = message || '';
    feedback.dataset.tone = tone || '';
  }

  function profileFromUsername(username){
    const normalized = String(username || '').trim().toLowerCase();
    return normalized.indexOf('einstein') >= 0 ? profileChrome.cart : profileChrome.master;
  }

  function updateLoginDiagonal(){
    if(!loginShell || !loginForm || loginShell.hidden) return;
    const shellRect = loginShell.getBoundingClientRect();
    const cardRect = loginForm.getBoundingClientRect();
    if(!shellRect.width || !shellRect.height || !cardRect.width || !cardRect.height) return;

    if(shellRect.width <= 900){
      loginForm.style.setProperty('--login-card-diagonal-top', '100%');
      loginForm.style.setProperty('--login-card-diagonal-left', '0%');
      return;
    }

    const diagonalTopRatio = 0.74;
    const diagonalBottomRatio = 0.295;
    const diagonalSpan = diagonalTopRatio - diagonalBottomRatio;
    const localTop = (shellRect.width * (diagonalTopRatio - (diagonalSpan * ((cardRect.top - shellRect.top) / shellRect.height)))) - (cardRect.left - shellRect.left);
    const localLeft = (shellRect.height * ((diagonalTopRatio - ((cardRect.left - shellRect.left) / shellRect.width)) / diagonalSpan)) - (cardRect.top - shellRect.top);
    const topPx = Math.max(0, Math.min(cardRect.width, localTop));
    const leftPx = Math.max(0, Math.min(cardRect.height, localLeft));

    loginForm.style.setProperty('--login-card-diagonal-top', `${topPx.toFixed(2)}px`);
    loginForm.style.setProperty('--login-card-diagonal-left', `${leftPx.toFixed(2)}px`);
  }

  function scheduleLoginDiagonalUpdate(){
    if(typeof requestAnimationFrame === 'function'){
      requestAnimationFrame(updateLoginDiagonal);
    } else {
      setTimeout(updateLoginDiagonal, 0);
    }
  }

  function updateLoginPreview(){
    const profile = profileFromUsername(usernameInput?.value);
    const isWideProfile = !!profile.wideLogo || !!profile.symbolLogo;
    const isFullLogoProfile = !!profile.wideLogo;
    const isSymbolProfile = !!profile.symbolLogo;
    const hasLogoHalo = !!profile.logoHalo;
    if(loginForm) loginForm.classList.toggle('is-wide-profile', isWideProfile);
    if(profilePreview) profilePreview.textContent = profile.organization;
    if(clientLogo){
      clientLogo.src = profile.logo;
      clientLogo.alt = profile.organization;
      clientLogo.classList.toggle('is-wide-logo', isFullLogoProfile);
      clientLogo.classList.toggle('is-symbol-logo', isSymbolProfile);
      const head = clientLogo.closest('.login-card-head');
      head?.classList.toggle('is-wide-profile', isWideProfile);
      head?.classList.toggle('is-full-logo-profile', isFullLogoProfile);
      head?.classList.toggle('is-symbol-profile', isSymbolProfile);
      head?.classList.toggle('is-logo-halo-profile', hasLogoHalo);
    }
    scheduleLoginDiagonalUpdate();
  }

  function setAvatar(src, alt){
    if(!currentUserAvatar) return;
    currentUserAvatar.classList.add('panel-avatar');
    let image = currentUserAvatar.querySelector('img');
    if(!image){
      image = document.createElement('img');
      currentUserAvatar.textContent = '';
      currentUserAvatar.appendChild(image);
    }
    image.src = src;
    image.alt = alt || '';
  }

  function syncProtectedUi(role){
    const isMaster = role === 'master';
    document.querySelectorAll('.auth-master-only').forEach((element) => {
      element.hidden = !isMaster;
    });
    document.querySelectorAll('.auth-master-switch').forEach((element) => {
      element.hidden = window.activePanelSession?.role !== 'master';
    });
  }

  function currentSessionProfile(role){
    const fallback = profileChrome[role] || profileChrome.master;
    const session = window.activePanelSession || null;
    if(!session || session.role !== role) return fallback;
    return {
      ...fallback,
      displayName:session.displayName || session.display_name || fallback.displayName,
      organization:session.organization || session.clienteNome || fallback.organization,
      logo:session.logo || fallback.logo,
      avatar:session.avatar || fallback.avatar,
      wideLogo:role === 'cart' || fallback.wideLogo,
      logoHalo:role === 'cart' || fallback.logoHalo
    };
  }

  function syncPanelRoleChrome(role){
    const profile = currentSessionProfile(role);
    if(currentUserLabel) currentUserLabel.textContent = profile.displayName;
    setAvatar(profile.avatar, profile.organization);
    syncProtectedUi(role);
  }

  function showLogin(message = '', tone = ''){
    document.body.classList.add('auth-pending');
    document.body.classList.remove('auth-ready');
    delete document.body.dataset.authRole;
    window.__pendingCartTrackingOpen = false;
    try {
      localStorage.removeItem('idsensor.cartTracking.activeRoute.v1');
    } catch(e) {}
    if(typeof window.resetCartTrackingBackendConfigCache === 'function') window.resetCartTrackingBackendConfigCache();
    if(typeof window.closeCartTrackingView === 'function') window.closeCartTrackingView();
    if(typeof window.hideCartAlertsOutsideContext === 'function') window.hideCartAlertsOutsideContext();
    if(loginShell) loginShell.hidden = false;
    if(passwordInput) passwordInput.value = '';
    setFeedback(message, tone);
    updateLoginPreview();
    scheduleLoginDiagonalUpdate();
  }

  function decodePanelTokenPayload(token){
    try {
      const encodedPayload = String(token || '').split('.')[0];
      if(!encodedPayload) return null;
      const normalizedPayload = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
      return JSON.parse(atob(paddedPayload));
    } catch(e) {
      return null;
    }
  }

  function isPanelSessionExpired(session){
    const payload = decodePanelTokenPayload(session?.token);
    const expiresAt = Number(payload?.exp || 0);
    return Number.isFinite(expiresAt) && expiresAt > 0 && expiresAt <= Date.now();
  }

  function expirePanelSession(message = 'Sessão expirada. Faça login novamente.'){
    try { localStorage.removeItem(SESSION_KEY); } catch(e) {}
    window.activePanelSession = null;
    if(userMenu) userMenu.style.display = 'none';
    showLogin(message, 'error');
  }

  function shouldRestoreCartRouteFromStorage(){
    try {
      return localStorage.getItem('idsensor.cartTracking.activeRoute.v1') === '1';
    } catch(e) {
      return false;
    }
  }

  function applySession(session){
    if(!session || !session.role) return showLogin();
    if(!session.token) return showLogin();
    if(isPanelSessionExpired(session)) return expirePanelSession();
    const restoreCartRoute = session.role !== 'cart' && shouldRestoreCartRouteFromStorage();
    window.activePanelSession = session;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch(e) {}

    document.body.classList.remove('auth-pending');
    document.body.classList.add('auth-ready');
    document.body.dataset.authRole = session.role;
    if(loginShell) loginShell.hidden = true;
    if(userMenu) userMenu.style.display = 'none';

    if(typeof window.applyPanelRole === 'function'){
      window.applyPanelRole(session.role);
    } else {
      syncPanelRoleChrome(session.role);
    }
    if(typeof window.resetCartTrackingBackendConfigCache === 'function') window.resetCartTrackingBackendConfigCache();
    if(typeof window.hideCartAlertsOutsideContext === 'function') window.hideCartAlertsOutsideContext();
    if(session.role === 'cart'){
      window.__pendingCartTrackingOpen = true;
      window.setTimeout(() => {
        if(typeof window.openCartTrackingView === 'function') window.openCartTrackingView();
      }, 0);
      if(typeof window.refreshCartConfigFromBackend === 'function'){
        window.refreshCartConfigFromBackend().catch(error => {
          console.warn('Nao foi possivel carregar a configuracao C.R. apos o login.', error);
        });
      }
    }else if(restoreCartRoute){
      if(typeof window.setPanelVisualRole === 'function') window.setPanelVisualRole('cart');
      window.__pendingCartTrackingOpen = true;
      if(typeof selectedArea !== 'undefined') selectedArea = 'Carrinhos de resíduo';
      if(typeof selectedClient !== 'undefined') selectedClient = 'Hospital Einstein';
      if(typeof subtitleEl !== 'undefined' && subtitleEl) subtitleEl.textContent = 'Hospital Einstein · Carrinhos de resíduo';
      window.setTimeout(() => {
        if(typeof window.openCartTrackingView === 'function') window.openCartTrackingView({ profileMode:true });
      }, 0);
      if(typeof window.refreshCartConfigFromBackend === 'function'){
        window.refreshCartConfigFromBackend().catch(error => {
          console.warn('Nao foi possivel carregar a configuracao C.R. apos restaurar a sessao.', error);
        });
      }
    }else{
      window.__pendingCartTrackingOpen = false;
      if(typeof window.startPanelDevicesBackendPolling === 'function') window.startPanelDevicesBackendPolling();
    }
  }

  async function login(username, password){
    const response = await fetch(`${getAuthApiBaseUrl()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const payload = await response.json().catch(() => null);
    if(!response.ok || !payload?.ok){
      throw new Error(payload?.message || 'Usuário ou senha inválidos.');
    }
    return payload.data;
  }

  window.getPanelApiBaseUrl = getAuthApiBaseUrl;
  window.syncPanelRoleChrome = syncPanelRoleChrome;
  window.expirePanelSession = expirePanelSession;

  if(usernameInput){
    usernameInput.addEventListener('input', updateLoginPreview);
    usernameInput.addEventListener('blur', updateLoginPreview);
  }

  window.addEventListener('resize', scheduleLoginDiagonalUpdate);
  window.addEventListener('load', scheduleLoginDiagonalUpdate);

  if(loginForm){
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = String(usernameInput?.value || '').trim().toLowerCase();
      const password = String(passwordInput?.value || '');

      if(!username || !password){
        setFeedback('Informe usuário e senha.', 'error');
        return;
      }

      setFeedback('Validando acesso...', 'info');
      const submitButton = loginForm.querySelector('button[type="submit"]');
      if(submitButton) submitButton.disabled = true;

      try {
        applySession(await login(username, password));
        setFeedback('', '');
      } catch(error) {
        showLogin();
        setFeedback(error?.message || 'Usuário ou senha inválidos.', 'error');
      } finally {
        if(submitButton) submitButton.disabled = false;
      }
    });
  }

  if(logoutButton){
    logoutButton.addEventListener('click', (event) => {
      event.stopPropagation();
      try { localStorage.removeItem(SESSION_KEY); } catch(e) {}
      window.activePanelSession = null;
      if(userMenu) userMenu.style.display = 'none';
      showLogin();
    });
  }

  let savedSession = null;
  try {
    savedSession = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch(e) {}

  if(savedSession?.role){
    applySession(savedSession);
  } else {
    showLogin();
  }
})();

/* ===== SCRIPT BLOCK 21 | clone-overlays-outside ===== */
document.getElementById('cloneAttentionOverlay')?.addEventListener('click', closeInfoOverlays);
document.getElementById('infoCloneOverlay')?.addEventListener('click', ()=> openInfoModal(window.currentInfoId));

/* ===== SCRIPT BLOCK 22 | temp-status-script ===== */
window.statusConfigDeviceId = null;
window.statusConfigSelectedState = 'blue';
window.statusConfigSelectedMinutes = 60;

const CYCLE_STATUS_STATES = ['maint','inventory','defrost','restock'];

function isCycleState(state){
  return CYCLE_STATUS_STATES.includes(state);
}

function resolveTelemetryState(d){
  if(!d) return { status:'NORMAL', state:'blue', timerLabel:'Dentro da faixa segura', timer:0 };
  const temp = Number(d.temp);
  const hasTemp = Number.isFinite(temp);
  const min = Number.isFinite(Number(d.min)) ? Number(d.min) : 2;
  const max = Number.isFinite(Number(d.max)) ? Number(d.max) : 8;

  if(!hasTemp){
    return { status:'NORMAL', state:'blue', timerLabel:'Dentro da faixa segura', timer:0 };
  }

  if(temp > (max + 1) || temp < (min - 1)){
    return { status:'CRÍTICO', state:'crit', timerLabel:'Fora do limite crítico', timer:100 };
  }

  const outOfRange = temp > max || temp < min;
  const nearLimit = !outOfRange && ((max - temp) <= 0.8 || (temp - min) <= 0.8);

  if(outOfRange){
    return { status:'ATENÇÃO', state:'warn', timerLabel:'Fora do limite · monitorando', timer:60 };
  }

  if(nearLimit){
    return { status:'ATENÇÃO', state:'warn', timerLabel:'Próximo do limite · monitorando', timer:14 };
  }

  return { status:'NORMAL', state:'blue', timerLabel:'Dentro da faixa segura', timer:0 };
}

function applyResolvedTelemetryState(d){
  const resolved = resolveTelemetryState(d);
  d.status = resolved.status;
  d.state = resolved.state;
  d.timerLabel = resolved.timerLabel;
  d.timer = resolved.timer;
  d.preTempStatusState = null;
  d.preTempStatusStatus = null;
  return resolved;
}

function openStatusConfigModal(id){
  window.statusConfigDeviceId = id;
  const d = devices.find(x => x.id === id);
  const cycleActive = isCycleState(d?.state);
  window.statusConfigSelectedState = cycleActive ? d.state : 'blue';
  window.statusConfigSelectedMinutes = null;

  document.querySelectorAll('#statusOptionGrid .status-option-btn').forEach(btn => {
    const isCloseCycleBtn = btn.dataset.status === 'blue';
    const isDisabled = isCloseCycleBtn && !cycleActive;

    btn.disabled = isDisabled;
    btn.classList.toggle('disabled', isDisabled);
    btn.title = isDisabled
      ? 'Encerrar ciclo só fica disponível quando o dispositivo estiver em manutenção, inventário, degelo ou reposição.'
      : (btn.dataset.status === 'blue'
          ? 'Encerrar o ciclo e voltar ao status automático'
          : '');

    btn.classList.toggle('active', btn.dataset.status === window.statusConfigSelectedState && !isDisabled);
    btn.onclick = () => {
      if(isDisabled) return;
      window.statusConfigSelectedState = btn.dataset.status;
      document.querySelectorAll('#statusOptionGrid .status-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
  });

  const durationLabelEl = document.getElementById('statusDurationLabel');
  if(durationLabelEl) durationLabelEl.textContent = 'Selecionar duração';
  document.getElementById('statusDurationDropdown')?.classList.remove('open');

  document.getElementById('statusConfigOverlay')?.classList.add('show');
  document.getElementById('statusConfigModal')?.classList.add('show');
}
function closeStatusConfigModal(){
  document.getElementById('statusConfigOverlay')?.classList.remove('show');
  document.getElementById('statusConfigModal')?.classList.remove('show');
}
function applyStatusConfig(){
  const d = devices.find(x => x.id === window.statusConfigDeviceId);
  if(!d) return;

  if(window.statusConfigSelectedState === 'blue'){
    if(!isCycleState(d.state)){
      alert('Encerrar ciclo só pode ser aplicado quando o dispositivo estiver em manutenção, inventário, degelo ou reposição.');
      return;
    }

    const resolved = applyResolvedTelemetryState(d);
    d.tempStatusUntil = null;
    d.updated = 'agora';
    pushAuditEntry(d, {
      scope:'status',
      field:'Encerramento de ciclo',
      description:`Ciclo encerrado. O dispositivo voltou ao status automático: ${resolved.status}.`
    });
    renderGrid();
    if(typeof openDetail === 'function') openDetail(d.id, true);
    closeStatusConfigModal();
    return;
  }

  const stateMap = {
    maint: {status:'MANUTENÇÃO', state:'maint'},
    inventory: {status:'INVENTÁRIO', state:'inventory'},
    defrost: {status:'DEGELO', state:'defrost'},
    restock: {status:'REPOSIÇÃO', state:'restock'}
  };
  const chosen = stateMap[window.statusConfigSelectedState];
  if(!chosen) return;

  if(window.statusConfigSelectedMinutes === null){
    alert('Selecione a duração para aplicar o status.');
    return;
  }

  const previousStatus = d.status || 'NORMAL';
  const resolved = resolveTelemetryState(d);

  d.status = chosen.status;
  d.state = chosen.state;
  recordGraphStatusEvent(d, chosen.state);
  d.tempStatusUntil = Date.now() + (window.statusConfigSelectedMinutes * 60000);
  d.updated = 'agora';
  d.timerLabel = `${chosen.status} por tempo determinado`;
  d.preTempStatusState = resolved.state;
  d.preTempStatusStatus = resolved.status;

  pushAuditEntry(d, {
    scope:'status',
    field:'Status do dispositivo',
    description:`Status alterado de ${previousStatus} para ${chosen.status} por ${window.statusConfigSelectedMinutes} minutos.`
  });

  renderGrid();
  if(typeof openDetail === 'function'){
    openDetail(d.id, true);
  }
  closeStatusConfigModal();
}
function refreshTemporaryStatuses(){
  let changed = false;
  devices.forEach(d => {
    if(d && d.tempStatusUntil && Date.now() >= d.tempStatusUntil){
      d.tempStatusUntil = null;
      const resolved = applyResolvedTelemetryState(d);
      d.updated = 'agora';
      pushAuditEntry(d, {
        scope:'status',
        field:'Encerramento automático de ciclo',
        description:`Tempo do ciclo encerrado. O dispositivo voltou ao status automático: ${resolved.status}.`
      });
      changed = true;
    }
  });
  if(changed){
    renderGrid();
    if(window.activeId){
      const active = devices.find(x => x.id === window.activeId);
      if(active) openDetail(active.id, true);
    }
  } else if(window.activeId){
    const detail = document.getElementById('cardFloatingDetail');
    if(detail){
      const active = devices.find(x => x.id === window.activeId);
      if(active){
        const chip = detail.querySelector('.status-timer-chip');
        if(chip){
          const txt = getRemainingStatusText(active);
          chip.title = txt;
          chip.setAttribute('aria-label', txt);
        }
      }
    }
  }
}
document.getElementById('statusConfigOverlay')?.addEventListener('click', closeStatusConfigModal);
setInterval(refreshTemporaryStatuses, 1000);

/* ===== SCRIPT BLOCK 23 | duration-dropdown-script ===== */
function toggleDurationDropdown(event){
  event.stopPropagation();
  const dd = document.getElementById('statusDurationDropdown');
  if(!dd) return;

  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.duration-dropdown.open').forEach(el => {
    el.classList.remove('open');
    el.classList.remove('up');
  });
  if(isOpen) return;

  const btn = document.getElementById('statusDurationBtn');
  const menu = document.getElementById('statusDurationMenu');
  if(!btn || !menu) return;

  dd.classList.add('open');
  dd.classList.remove('up');

  requestAnimationFrame(() => {
    const btnRect = btn.getBoundingClientRect();
    const menuHeight = Math.min(menu.scrollHeight, 220);
    const spaceBelow = window.innerHeight - btnRect.bottom - 16;
    const spaceAbove = btnRect.top - 16;

    if(spaceBelow < menuHeight && spaceAbove > spaceBelow){
      dd.classList.add('up');
    }
  });
}
function selectDurationOption(minutes, label){
  window.statusConfigSelectedMinutes = minutes;
  const lbl = document.getElementById('statusDurationLabel');
  if(lbl) lbl.textContent = label;
  const dd = document.getElementById('statusDurationDropdown');
  dd?.classList.remove('open');
  dd?.classList.remove('up');
}
document.addEventListener('click', function(e){
  const dd = document.getElementById('statusDurationDropdown');
  if(dd && !dd.contains(e.target)) {
    dd.classList.remove('open');
    dd.classList.remove('up');
  }
});

/* ===== SCRIPT BLOCK 24 | integrated-noc-script ===== */
let integratedNocMode = 'area';
let integratedNocTimers = [];
let integratedNocReminder = null;
let integratedNocLive = null;

function integratedBeep(freq=760,duration=140,volume=0.18){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext; if(!AudioCtx) return;
    const ctx=new AudioCtx(), osc=ctx.createOscillator(), gain=ctx.createGain();
    osc.type='sine'; osc.frequency.value=freq; gain.gain.value=0.0001;
    osc.connect(gain); gain.connect(ctx.destination);
    const now=ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(volume, now+0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now+duration/1000);
    osc.start(now); osc.stop(now+duration/1000+0.02);
  }catch(e){}
}
function clearIntegratedNocTimers(){
  integratedNocTimers.forEach(t => clearTimeout(t));
  integratedNocTimers = [];
  if(integratedNocReminder) clearInterval(integratedNocReminder);
  if(integratedNocLive) clearInterval(integratedNocLive);
  integratedNocReminder = null;
  integratedNocLive = null;
}
function getOccurrenceDevices(){
  const area = 'Banco IDvida';
  return devices.filter(d => d.sector === area && (d.state === 'warn' || d.state === 'crit'));
}
function getNocCounts(){
  const occ = getOccurrenceDevices();
  return {
    area: [{key:'bs', title:'Banco IDvida', count: occ.length}],
    client: [{key:'labidvida', title:'Laboratório IDvida', count: occ.length}],
    device: occ.map((d, idx) => ({key:'device_'+d.id, title:d.name, count:1, deviceId:d.id}))
  };
}
const NOC_SOURCE_DEVICE_IDS = new Set([2,5,10,12,20,21,22,23,24]);
function getNocPowerMode(device){
  if(!device) return 'battery';
  const declared = String(device.powerMode || '').toLowerCase();
  if(declared === 'battery' || declared === 'source') return declared;
  return NOC_SOURCE_DEVICE_IDS.has(Number(device.id)) ? 'source' : 'battery';
}
function isNocBatteryLowDevice(device){
  if(!device || device.state === 'maint') return false;
  const battery = Number(device.battery);
  return getNocPowerMode(device) === 'battery' && Number.isFinite(battery) && battery <= 50;
}
function isNocSourceDisconnectedDevice(device){
  if(!device || device.state === 'maint') return false;
  const offlineByState = device.online === false;
  const offlineByText = /sem comunicação/i.test(String(device.commText || ''));
  return getNocPowerMode(device) === 'source' && (offlineByState || offlineByText);
}
function getBatteryPowerOccurrenceDevices(){
  return devices.filter(d => isNocBatteryLowDevice(d) || isNocSourceDisconnectedDevice(d));
}
window.getBatteryPowerOccurrenceDevices = getBatteryPowerOccurrenceDevices;
function setNocMode(mode){
  integratedNocMode = mode;
  document.getElementById('nocModeArea')?.classList.toggle('active', mode === 'area');
  document.getElementById('nocModeDevice')?.classList.toggle('active', mode === 'device');
  document.getElementById('nocModeClient')?.classList.toggle('active', mode === 'client');
}
function openNocStart(){
  document.getElementById('nocStartOverlay')?.classList.add('show');
  document.getElementById('nocLiveOverlay')?.classList.remove('show');
  const clientBtn = document.getElementById('nocModeClient');
  if(clientBtn){
    clientBtn.style.display = (window.currentRole === 'master') ? '' : 'none';
    if(window.currentRole !== 'master' && integratedNocMode === 'client'){
      setNocMode('area');
    }
  }
}
function closeNoc(){
  clearIntegratedNocTimers();
  document.getElementById('nocStartOverlay')?.classList.remove('show');
  document.getElementById('nocLiveOverlay')?.classList.remove('show');
}
function updateNocOccurrenceBadge(){
  const shown = Array.from(document.querySelectorAll('#nocLiveGrid .noc-card')).filter(c => c.classList.contains('show')).length;
  const btn = document.getElementById('nocOccBtn');
  if(btn) btn.textContent = 'Ocorrências (' + shown + ')';
}
function createNocCard(item, mode){
  return `
    <div class="noc-card" data-key="${item.key}" ${item.deviceId ? `data-device-id="${item.deviceId}"` : ''}>
      <div class="noc-area">${item.title}</div>
      <div class="noc-graph">
        <svg viewBox="0 0 112 112">
          <circle cx="56" cy="56" r="36" fill="none" stroke="#e8edf4" stroke-width="14"></circle>
          <circle class="noc-ring-base" cx="56" cy="56" r="36" fill="none" stroke="#dc2626" stroke-width="14" stroke-dasharray="${mode==='device' ? '54 172.2' : '80 146.2'}" stroke-linecap="round"></circle>
        </svg>
        <div class="noc-center"><div class="noc-inner-number" data-counter>${item.count}</div></div>
      </div>
      <div class="noc-bottom"><div class="noc-label">ocorrências</div><div class="noc-alert">alerta</div></div>
    </div>`;
}
function startIntegratedNoc(){
  clearIntegratedNocTimers();
  document.getElementById('nocStartOverlay')?.classList.remove('show');
  document.getElementById('nocLiveOverlay')?.classList.add('show');

  const grid = document.getElementById('nocLiveGrid');
  const items = getNocCounts()[integratedNocMode] || [];
  grid.innerHTML = items.map(item => createNocCard(item, integratedNocMode)).join('');

  const cards = Array.from(grid.querySelectorAll('.noc-card'));
  cards.forEach((card, idx) => {
    card.onclick = () => {
      if(integratedNocMode === 'area'){
        openNocArea('Banco IDvida');
      } else if(integratedNocMode === 'client'){
        openNocClient('Laboratório IDvida');
      } else {
        const deviceId = Number(card.dataset.deviceId);
        openNocDevice(deviceId);
      }
    };
    const delay = 60000 + (idx * 30000);
    const timer = setTimeout(() => {
      card.style.display = 'block';
      requestAnimationFrame(() => { card.classList.add('show'); updateNocOccurrenceBadge(); });
      integratedBeep(920,150,0.24);
      if(idx === cards.length - 1) startIntegratedLiveChanges();
    }, delay);
    integratedNocTimers.push(timer);
  });

  const occBtn = document.getElementById('nocOccBtn');
  if(occBtn) occBtn.textContent = 'Ocorrências (0)';

  integratedNocReminder = setInterval(() => {
    const anyShown = cards.some(c => c.classList.contains('show'));
    if(anyShown) integratedBeep(760,120,0.18);
  }, 30000);
}
function startIntegratedLiveChanges(){
  const cards = Array.from(document.querySelectorAll('#nocLiveGrid .noc-card.show'));
  if(!cards.length) return;
  let step = 0;
  integratedNocLive = setInterval(() => {
    const card = cards[step % cards.length];
    const counter = card.querySelector('[data-counter]');
    if(counter){
      const current = Number(counter.textContent || '0');
      const next = Math.max(1, current + (step % 2 === 0 ? 1 : -1));
      counter.textContent = String(next);
      integratedBeep(step % 2 === 0 ? 980 : 700, 120, 0.18);
    }
    step++;
  }, 30000);
}
function applyNocFilter(ids, openId){
  activeFilter = null;
  nocFilteredIds = Array.isArray(ids) ? [...ids] : null;
  selectedArea = 'Banco IDvida';
  if(typeof renderGrid === 'function') renderGrid();
  closeNoc();
  // detalhe automático removido
}
function openNocArea(area){
  const occ = getOccurrenceDevices();
  applyNocFilter(occ.map(d => d.id), null);
}
function openNocClient(client){
  const occ = getOccurrenceDevices();
  applyNocFilter(occ.map(d => d.id), null);
}
function openNocDevice(deviceId){
  applyNocFilter([deviceId], deviceId);
}
function openNocOccurrences(){
  const occ = getOccurrenceDevices();
  applyNocFilter(occ.map(d => d.id), null);
}

/* ===== SCRIPT BLOCK 25 | noc-occurrence-step-script ===== */
window.nocOccurrenceFilters = ['all'];

window.canUseNocBatteryFilter = function(){
  const role = String(window.currentRole || '').toLowerCase();
  const roleAllowed = role === 'master' || role === 'admin1' || role === 'admin2';
  const modeAllowed = typeof integratedNocMode !== 'undefined' && (integratedNocMode === 'area' || integratedNocMode === 'device');
  return roleAllowed && modeAllowed;
};

window.isNocBatteryFilterVisible = function(){
  const item = document.getElementById('nocOccurrenceBatteryItem');
  return !!item && !item.hidden;
};

function syncBatteryOptionVisibility(){
  const item = document.getElementById('nocOccurrenceBatteryItem');
  const input = document.querySelector('#nocOccurrenceGrid input[value="battery"]');
  const allow = !!window.canUseNocBatteryFilter?.();
  if(item){
    item.hidden = !allow;
  }
  if(input && !allow){
    input.checked = false;
  }
  return allow;
}

function syncOccurrenceVisualState(){
  document.querySelectorAll('#nocOccurrenceGrid .noc-occ-item').forEach(item => {
    const input = item.querySelector('input');
    item.classList.toggle('active', !!(input && input.checked));
  });

  const values = Array.from(document.querySelectorAll('#nocOccurrenceGrid input:checked')).map(i => i.value);
  const note = document.getElementById('nocOccurrenceNote');
  const batteryHint = document.getElementById('nocOccurrenceBatteryHint');
  const batteryVisible = !!window.isNocBatteryFilterVisible?.();

  if(note){
    note.textContent = values.length
      ? 'Selecionados: ' + values.map(v => ({
          near_limit:'Próximo do limite',
          out_of_range:'Fora do limite',
          offline:'Sem comunicação',
          battery:'Bateria e fonte',
          all:'Todos os status'
        }[v] || v)).join(' • ')
      : 'Selecione uma ou mais ocorrências para continuar.';
  }

  if(batteryHint){
    const showHint = batteryVisible && (values.includes('battery') || values.includes('all'));
    batteryHint.hidden = !showHint;
  }
}

function resetOccurrenceSelection(){
  const inputs = document.querySelectorAll('#nocOccurrenceGrid input');
  inputs.forEach(i => i.checked = false);

  syncBatteryOptionVisibility();

  const all = document.querySelector('#nocOccurrenceGrid input[value="all"]');
  if(all) all.checked = true;

  syncOccurrenceVisualState();
}

function openOccurrenceStep(){
  document.getElementById('nocOccurrenceOverlay')?.classList.add('show');
  syncBatteryOptionVisibility();

  const checked = document.querySelectorAll('#nocOccurrenceGrid input:checked');
  if(!checked.length){
    const all = document.querySelector('#nocOccurrenceGrid input[value="all"]');
    if(all) all.checked = true;
  }

  syncOccurrenceVisualState();
}

function closeOccurrenceStep(){
  document.getElementById('nocOccurrenceOverlay')?.classList.remove('show');
}

function confirmOccurrenceStep(){
  const allowBattery = syncBatteryOptionVisibility();
  const checked = Array.from(document.querySelectorAll('#nocOccurrenceGrid input:checked')).map(i => i.value);

  if(!checked.length){
    const note = document.getElementById('nocOccurrenceNote');
    if(note) note.textContent = 'Selecione ao menos uma ocorrência para continuar.';
    return;
  }

  const normalized = checked.includes('all') ? ['all'] : checked;
  window.nocOccurrenceFilters = allowBattery ? normalized : normalized.filter(v => v !== 'battery');

  if(!window.nocOccurrenceFilters.length){
    window.nocOccurrenceFilters = ['all'];
  }

  closeOccurrenceStep();
  startIntegratedNoc();
}

document.addEventListener('change', function(e){
  if(!e.target.closest('#nocOccurrenceGrid')) return;

  const target = e.target;
  if(target.value === 'all' && target.checked){
    document.querySelectorAll('#nocOccurrenceGrid input').forEach(i => {
      if(i.value !== 'all') i.checked = false;
    });
  } else if(target.value !== 'all' && target.checked){
    const all = document.querySelector('#nocOccurrenceGrid input[value="all"]');
    if(all) all.checked = false;
  }

  const values = Array.from(document.querySelectorAll('#nocOccurrenceGrid input:checked')).map(i => i.value);
  if(!values.length){
    const all = document.querySelector('#nocOccurrenceGrid input[value="all"]');
    if(all) all.checked = true;
  }

  syncOccurrenceVisualState();
});

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    closeOccurrenceStep();
  }
});

document.addEventListener('DOMContentLoaded', function(){
  resetOccurrenceSelection();
});

/* ===== SCRIPT BLOCK 26 | noc-occurrence-real-filter ===== */
(function(){
  function getSelectedOccurrenceFilters(){
    const raw = Array.isArray(window.nocOccurrenceFilters) && window.nocOccurrenceFilters.length
      ? window.nocOccurrenceFilters
      : ['all'];
    return raw.includes('all') ? ['all'] : raw;
  }

  function matchesOccurrenceFilter(device) {
  const filters = getSelectedOccurrenceFilters();

  // nunca considerar manutenção
  if (device.state === 'maint') return false;

  // REGRA CORRETA DE COMUNICAÇÃO
  const isOffline = (device.online === false && device.state !== 'maint');

  const isNearLimit = device.state === 'warn';
  const isOutOfRange = device.state === 'crit';

  if (filters.includes('all')) {
    return isOffline || isNearLimit || isOutOfRange;
  }

  if (filters.includes('offline')) {
    return isOffline;
  }

  if (filters.includes('near_limit') && filters.includes('out_of_range')) {
    return isNearLimit || isOutOfRange;
  }

  return (
    (filters.includes('near_limit') && isNearLimit) ||
    (filters.includes('out_of_range') && isOutOfRange)
  );
}

  function getFilteredOccurrenceDevices(){
    return devices.filter(d => matchesOccurrenceFilter(d));
  }

  window.getOccurrenceDevices = getFilteredOccurrenceDevices;

  window.getNocCounts = function(){
    const occ = getFilteredOccurrenceDevices();
    return {
      area: [{ key:'bs', title:'Banco IDvida', count: occ.length }],
      client: [{ key:'labidvida', title:'Laboratório IDvida', count: occ.length }],
      device: occ.map(d => ({ key:'device_' + d.id, title:d.name, count:1, deviceId:d.id }))
    };
  };

  window.applyNocFilter = function(ids, openId){
    activeFilter = null;
    nocFilteredIds = Array.isArray(ids) ? [...ids] : null;
    selectedArea = 'Banco IDvida';
    if(typeof renderGrid === 'function') renderGrid();
    closeNoc();
    // detalhe automático removido
  };

  window.openNocArea = function(area){
    const occ = getFilteredOccurrenceDevices();
    applyNocFilter(occ.map(d => d.id), null);
  };

  window.openNocClient = function(client){
    const occ = getFilteredOccurrenceDevices();
    applyNocFilter(occ.map(d => d.id), null);
  };

  window.openNocDevice = function(deviceId){
    const occIds = getFilteredOccurrenceDevices().map(d => d.id);
    if(occIds.includes(deviceId)){
      applyNocFilter([deviceId], deviceId);
    }
  };

  window.openNocOccurrences = function(){
    const occ = getFilteredOccurrenceDevices();
    applyNocFilter(occ.map(d => d.id), null);
  };
})();

/* ===== SCRIPT BLOCK 27 | noc-final-fix ===== */
(function(){

function isOfflineReal(d){
  return d.online === false && d.state !== 'maint';
}

function matchesOccurrenceFilter(d){
  const f = window.nocOccurrenceFilters || ['all'];

  if(d.state === 'maint') return false;

  const offline = isOfflineReal(d);
  const warn = d.state === 'warn';
  const crit = d.state === 'crit';

  if(f.includes('all')) return offline || warn || crit;

  return (
    (f.includes('offline') && offline) ||
    (f.includes('near_limit') && warn) ||
    (f.includes('out_of_range') && crit)
  );
}

// 🔥 fonte única de verdade
window.getOccurrenceDevices = function(){
  return devices.filter(d => matchesOccurrenceFilter(d));
};

// 🔥 tudo passa por aqui
window.getNocCounts = function(){
  const occ = window.getOccurrenceDevices();

  return {
    area: [{ key:'area', title:'Ocorrências', count: occ.length }],
    client: [{ key:'client', title:'Ocorrências', count: occ.length }],
    device: occ.map(d => ({
      key:'device_'+d.id,
      title:d.name,
      count:1,
      deviceId:d.id
    }))
  };
};

})();

/* ===== SCRIPT BLOCK 28 | noc-rotation-patch-script ===== */
(function(){
  const css = () => getComputedStyle(document.documentElement);
  const COLORS = () => ({
    blue: css().getPropertyValue('--blue').trim() || '#2ea8ff',
    orange: css().getPropertyValue('--orange').trim() || '#ffb04a',
    red: css().getPropertyValue('--red').trim() || '#ff4d4f'
  });

  function isMaint(d){ return d.state === 'maint'; }
  function isOffline(d){ return d.online === false && !isMaint(d); }
  function isWarn(d){ return d.state === 'warn' && !isMaint(d); }
  function isCrit(d){ return d.state === 'crit' && !isMaint(d); }

  function selectedFilters(){
    const raw = Array.isArray(window.nocOccurrenceFilters) && window.nocOccurrenceFilters.length
      ? window.nocOccurrenceFilters
      : ['all'];
    return raw.includes('all') ? ['all'] : raw;
  }

  function categoryListForDevices(deviceList){
    const f = selectedFilters();
    const all = f.includes('all');
    const c = COLORS();
    const out = [];
    const offlineCount = deviceList.filter(isOffline).length;
    const warnCount = deviceList.filter(isWarn).length;
    const critCount = deviceList.filter(isCrit).length;

    if ((all || f.includes('offline')) && offlineCount > 0) {
      out.push({
        key:'offline',
        count:offlineCount,
        text:'Sem comunicação',
        ringStroke:c.red,
        trackStroke:c.blue,
        alertClass:'noc-alert-offline'
      });
    }
    if ((all || f.includes('near_limit')) && warnCount > 0) {
      out.push({
        key:'warn',
        count:warnCount,
        text:'Próximo do limite',
        ringStroke:c.orange,
        trackStroke:'#e8edf4',
        alertClass:'noc-alert-warn'
      });
    }
    if ((all || f.includes('out_of_range')) && critCount > 0) {
      out.push({
        key:'crit',
        count:critCount,
        text:'Fora da temperatura',
        ringStroke:c.red,
        trackStroke:'#e8edf4',
        alertClass:'noc-alert-crit'
      });
    }
    return out;
  }

  function getAreaDevices(areaName){
    return devices.filter(d => d.sector === areaName);
  }

  function getFilteredOccurrenceDevices(){
    const allArea = getAreaDevices('Banco IDvida');
    const cats = categoryListForDevices(allArea);
    const wanted = new Set(cats.map(x => x.key));
    return allArea.filter(d => (
      (wanted.has('offline') && isOffline(d)) ||
      (wanted.has('warn') && isWarn(d)) ||
      (wanted.has('crit') && isCrit(d))
    ));
  }

  window.getOccurrenceDevices = getFilteredOccurrenceDevices;

  window.getNocCounts = function(){
    const occ = getFilteredOccurrenceDevices();
    const areaName = 'Banco IDvida';
    const areaCats = categoryListForDevices(getAreaDevices(areaName));
    const total = areaCats.reduce((s, item) => s + item.count, 0);

    return {
      area: total > 0 ? [{
        key:'bs',
        title:areaName,
        count: total,
        rotations: areaCats
      }] : [],
      client: total > 0 ? [{
        key:'labidvida',
        title:'Laboratório IDvida',
        count: total,
        rotations: areaCats
      }] : [],
      device: occ.map((d) => {
        let label = 'Próximo do limite';
        let stroke = COLORS().orange;
        let track = '#e8edf4';
        let alertClass = 'noc-alert-warn';
        if (isOffline(d)) {
          label = 'Sem comunicação';
          stroke = COLORS().red;
          track = COLORS().blue;
          alertClass = 'noc-alert-offline';
        } else if (isCrit(d)) {
          label = 'Fora da temperatura';
          stroke = COLORS().red;
          track = '#e8edf4';
          alertClass = 'noc-alert-crit';
        }
        return {
          key:'device_'+d.id,
          title:d.name,
          count:1,
          deviceId:d.id,
          rotations:[{
            key: isOffline(d) ? 'offline' : (isCrit(d) ? 'crit' : 'warn'),
            count:1,
            text:label,
            ringStroke:stroke,
            trackStroke:track,
            alertClass:alertClass
          }]
        };
      })
    };
  };

  function createNocCardPatched(item, mode){
    const rotations = Array.isArray(item.rotations) && item.rotations.length ? item.rotations : [{
      count:item.count,
      text:'Ocorrência',
      ringStroke:COLORS().red,
      trackStroke:'#e8edf4',
      alertClass:'noc-alert-plain'
    }];
    const first = rotations[0];
    const dash = mode === 'device' ? '54 172.2' : '80 146.2';
    const rotJson = encodeURIComponent(JSON.stringify(rotations));
    return `
      <div class="noc-card" data-key="${item.key}" data-rotations="${rotJson}" ${item.deviceId ? `data-device-id="${item.deviceId}"` : ''}>
        <div class="noc-area">${item.title}</div>
        <div class="noc-graph">
          <svg viewBox="0 0 112 112">
            <circle class="noc-track" cx="56" cy="56" r="36" fill="none" stroke="${first.trackStroke}" stroke-width="14"></circle>
            <circle class="noc-ring-base" cx="56" cy="56" r="36" fill="none" stroke="${first.ringStroke}" stroke-width="14" stroke-dasharray="${dash}" stroke-linecap="round"></circle>
          </svg>
          <div class="noc-center"><div class="noc-inner-number" data-counter>${first.count}</div></div>
        </div>
        <div class="noc-bottom">
          <div class="noc-label">ocorrências</div>
          <div class="noc-alert noc-alert-plain ${first.alertClass}" data-alert-text>${first.text}</div>
        </div>
      </div>`;
  }

  function setupNocRotations(){
    clearInterval(window.__nocRotationTimer);
    const cards = Array.from(document.querySelectorAll('#nocLiveGrid .noc-card'));
    const parsed = cards.map(card => {
      const raw = card.getAttribute('data-rotations');
      let rotations = [];
      try { rotations = JSON.parse(decodeURIComponent(raw || '[]')); } catch(e){}
      return {card, rotations, idx:0};
    }).filter(x => x.rotations.length > 1);

    function paint(entry){
      const state = entry.rotations[entry.idx];
      const num = entry.card.querySelector('[data-counter]');
      const ring = entry.card.querySelector('.noc-ring-base');
      const track = entry.card.querySelector('.noc-track');
      const alert = entry.card.querySelector('[data-alert-text]');
      if(num) num.textContent = state.count;
      if(ring) ring.setAttribute('stroke', state.ringStroke);
      if(track) track.setAttribute('stroke', state.trackStroke);
      if(alert){
        alert.textContent = state.text;
        alert.className = 'noc-alert noc-alert-plain ' + (state.alertClass || '');
      }
    }

    parsed.forEach(paint);

    if(!parsed.length) return;

    window.__nocRotationTimer = setInterval(() => {
      parsed.forEach(entry => {
        entry.idx = (entry.idx + 1) % entry.rotations.length;
        paint(entry);
      });
    }, 12000);
  }

  const originalStart = window.startIntegratedNoc;
  window.createNocCard = createNocCardPatched;
  window.startIntegratedNoc = function(){
    if (typeof originalStart === 'function') {
      originalStart();
      setupNocRotations();
    }
  };

  const originalClose = window.closeNoc;
  window.closeNoc = function(){
    clearInterval(window.__nocRotationTimer);
    if (typeof originalClose === 'function') originalClose();
  };
})();

/* ===== SCRIPT BLOCK 29 | noc-final-fixes-v4 ===== */
(function(){
  const rootStyles = () => getComputedStyle(document.documentElement);
  const COLORS = () => ({
    blue: rootStyles().getPropertyValue('--blue').trim() || '#2ea8ff',
    orange: rootStyles().getPropertyValue('--orange').trim() || '#ffb04a',
    red: rootStyles().getPropertyValue('--red').trim() || '#ff4d4f',
    green: rootStyles().getPropertyValue('--green').trim() || '#31c36b',
    gray: '#e8edf4',
    dark: '#111827'
  });

  function currentMode(){
    return (typeof integratedNocMode === 'string' && integratedNocMode) ? integratedNocMode : 'area';
  }

  function canUseBatteryFilter(){
    if(typeof window.canUseNocBatteryFilter === 'function'){
      return !!window.canUseNocBatteryFilter();
    }
    const role = String(window.currentRole || '').toLowerCase();
    return (role === 'master' || role === 'admin1' || role === 'admin2') && (currentMode() === 'area' || currentMode() === 'device');
  }

  function selectedFilters(){
    const raw = Array.isArray(window.nocOccurrenceFilters) && window.nocOccurrenceFilters.length
      ? window.nocOccurrenceFilters
      : ['all'];

    const allowBattery = canUseBatteryFilter();
    if(raw.includes('all')){
      return {
        all: true,
        includeBattery: allowBattery,
        list: ['all']
      };
    }

    const list = raw.filter(v => v !== 'all' && (allowBattery || v !== 'battery'));
    if(!list.length){
      return {
        all: true,
        includeBattery: allowBattery,
        list: ['all']
      };
    }
    return {
      all: false,
      includeBattery: allowBattery && list.includes('battery'),
      list: list
    };
  }

  function isMaint(d){ return d.state === 'maint'; }
  function isOffline(d){ return d.online === false && !isMaint(d); }
  function isWarn(d){ return d.state === 'warn' && !isMaint(d); }
  function isCrit(d){ return d.state === 'crit' && !isMaint(d); }
  function isBatteryLow(d){
    return (typeof window.isNocBatteryLowDevice === 'function') ? window.isNocBatteryLowDevice(d) : false;
  }
  function isSourceDisconnected(d){
    return (typeof window.isNocSourceDisconnectedDevice === 'function') ? window.isNocSourceDisconnectedDevice(d) : false;
  }

  function batteryStrokeColorFromValue(value){
    const c = COLORS();
    const level = Number(value);
    if(!Number.isFinite(level)) return c.green;
    if(level < 20) return c.red;
    if(level <= 35) return c.orange;
    return c.green;
  }

  function batteryStrokeColorFromIds(ids, pool){
    if(!Array.isArray(ids) || !ids.length) return batteryStrokeColorFromValue(null);
    const wanted = new Set(ids.map(x => Number(x)));
    let minBattery = Infinity;
    (pool || []).forEach(device => {
      if(!wanted.has(Number(device.id))) return;
      const value = Number(device.battery);
      if(Number.isFinite(value) && value < minBattery) minBattery = value;
    });
    return Number.isFinite(minBattery) ? batteryStrokeColorFromValue(minBattery) : batteryStrokeColorFromValue(null);
  }

  function renderNocAlertIcon(icon, color){
    const stroke = color || '#111827';
    if(icon === 'battery'){
      return `<svg width="40" height="20" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="1" y="4" width="34" height="12" rx="2" fill="none" stroke="${stroke}" stroke-width="2"/><rect x="36" y="7" width="3" height="6" rx="1" fill="${stroke}"/></svg>`;
    }
    if(icon === 'source'){
      return `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="6" y="8" width="12" height="12" rx="2" fill="none" stroke="${stroke}" stroke-width="2"/><rect x="18" y="11" width="4" height="2" fill="${stroke}"/><rect x="18" y="15" width="4" height="2" fill="${stroke}"/><line x1="10" y1="5" x2="10" y2="8" stroke="${stroke}" stroke-width="2"/><line x1="14" y1="5" x2="14" y2="8" stroke="${stroke}" stroke-width="2"/></svg>`;
    }
    return '';
  }

  function deviceRotations(d){
    const f = selectedFilters();
    const all = f.all;
    const c = COLORS();
    const out = [];

    if ((all || f.list.includes('offline')) && isOffline(d)) {
      out.push({
        key:'offline',
        count:1,
        text:'Sem comunicação',
        ringStroke:c.red,
        trackStroke:c.blue,
        alertClass:'noc-alert-offline',
        visibleIds:[d.id]
      });
    }
    if ((all || f.list.includes('near_limit')) && isWarn(d)) {
      out.push({
        key:'warn',
        count:1,
        text:'Próximo do limite',
        ringStroke:c.orange,
        trackStroke:c.gray,
        alertClass:'noc-alert-warn',
        visibleIds:[d.id]
      });
    }
    if ((all || f.list.includes('out_of_range')) && isCrit(d)) {
      out.push({
        key:'crit',
        count:1,
        text:'Fora da temperatura',
        ringStroke:c.red,
        trackStroke:c.gray,
        alertClass:'noc-alert-crit',
        visibleIds:[d.id]
      });
    }

    if (f.includeBattery && isBatteryLow(d)) {
      const batteryStroke = batteryStrokeColorFromValue(d.battery);
      out.push({
        key:'battery_low',
        count:1,
        text:'Bateria',
        ringStroke:batteryStroke,
        trackStroke:c.gray,
        alertClass:'noc-alert-power',
        icon:'battery',
        iconColor:batteryStroke,
        visibleIds:[d.id]
      });
    }
    if (f.includeBattery && isSourceDisconnected(d)) {
      out.push({
        key:'source_disconnected',
        count:1,
        text:'Fonte desconectada',
        ringStroke:c.red,
        trackStroke:c.gray,
        alertClass:'noc-alert-power',
        icon:'source',
        iconColor:c.red,
        visibleIds:[d.id]
      });
    }

    return out;
  }

  function areaRotations(areaName){
    const f = selectedFilters();
    const c = COLORS();
    const all = f.all;
    const allDevices = devices.filter(d => d.sector === areaName && !isMaint(d));

    const offlineIds = allDevices.filter(isOffline).map(d => d.id);
    const warnIds = allDevices.filter(isWarn).map(d => d.id);
    const critIds = allDevices.filter(isCrit).map(d => d.id);
    const batteryIds = f.includeBattery ? allDevices.filter(isBatteryLow).map(d => d.id) : [];
    const sourceIds = f.includeBattery ? allDevices.filter(isSourceDisconnected).map(d => d.id) : [];

    const out = [];

    if ((all || f.list.includes('offline')) && offlineIds.length) {
      out.push({
        key:'offline',
        count:offlineIds.length,
        text:'Sem comunicação',
        ringStroke:c.red,
        trackStroke:c.blue,
        alertClass:'noc-alert-offline',
        visibleIds: offlineIds
      });
    }
    if ((all || f.list.includes('near_limit')) && warnIds.length) {
      out.push({
        key:'warn',
        count:warnIds.length,
        text:'Próximo do limite',
        ringStroke:c.orange,
        trackStroke:c.gray,
        alertClass:'noc-alert-warn',
        visibleIds: warnIds
      });
    }
    if ((all || f.list.includes('out_of_range')) && critIds.length) {
      out.push({
        key:'crit',
        count:critIds.length,
        text:'Fora da temperatura',
        ringStroke:c.red,
        trackStroke:c.gray,
        alertClass:'noc-alert-crit',
        visibleIds: critIds
      });
    }
    if (f.includeBattery && batteryIds.length) {
      const batteryStroke = batteryStrokeColorFromIds(batteryIds, allDevices);
      out.push({
        key:'battery_low',
        count:batteryIds.length,
        text:'Bateria',
        ringStroke:batteryStroke,
        trackStroke:c.gray,
        alertClass:'noc-alert-power',
        icon:'battery',
        iconColor:batteryStroke,
        visibleIds:batteryIds
      });
    }
    if (f.includeBattery && sourceIds.length) {
      out.push({
        key:'source_disconnected',
        count:sourceIds.length,
        text:'Fonte desconectada',
        ringStroke:c.red,
        trackStroke:c.gray,
        alertClass:'noc-alert-power',
        icon:'source',
        iconColor:c.red,
        visibleIds:sourceIds
      });
    }

    return out;
  }

  function dedupe(arr){ return [...new Set(arr)]; }

  window.getNocCounts = function(){
    const areaName = 'Banco IDvida';
    const areaR = areaRotations(areaName);
    const areaTotal = areaR.reduce((s, x) => s + x.count, 0);
    const visibleAreaIds = dedupe(areaR.flatMap(x => x.visibleIds || []));

    const occDevices = devices.filter(d => deviceRotations(d).length > 0);

    return {
      area: areaTotal > 0 ? [{
        key:'bs',
        title:areaName,
        count:areaTotal,
        rotations:areaR,
        visibleIds: visibleAreaIds
      }] : [],
      client: areaTotal > 0 ? [{
        key:'labidvida',
        title:'Laboratório IDvida',
        count:areaTotal,
        rotations:areaR,
        visibleIds: visibleAreaIds
      }] : [],
      device: occDevices.map(d => {
        const rots = deviceRotations(d);
        return {
          key:'device_'+d.id,
          title:d.name,
          count:1,
          deviceId:d.id,
          rotations:rots,
          visibleIds:[d.id]
        };
      })
    };
  };

  window.createNocCard = function(item, mode){
    const c = COLORS();
    const rotations = Array.isArray(item.rotations) && item.rotations.length ? item.rotations : [{
      key:'plain', count:item.count, text:'Ocorrências', ringStroke:c.red, trackStroke:c.gray, alertClass:'noc-alert-plain', visibleIds:item.visibleIds || []
    }];
    const first = rotations[0];
    const dash = mode === 'device' ? '54 172.2' : '80 146.2';
    const rotJson = encodeURIComponent(JSON.stringify(rotations));
    const visibleIds = encodeURIComponent(JSON.stringify(first.visibleIds || item.visibleIds || []));
    const firstIcon = renderNocAlertIcon(first.icon, first.iconColor);
    return `
      <div class="noc-card" data-key="${item.key}" data-rotation-index="0" data-rotations="${rotJson}" data-visible-ids="${visibleIds}" ${item.deviceId ? `data-device-id="${item.deviceId}"` : ''}>
        <div class="noc-area">${item.title}</div>
        <div class="noc-graph">
          <svg viewBox="0 0 112 112">
            <circle class="noc-track" cx="56" cy="56" r="36" fill="none" stroke="${first.trackStroke}" stroke-width="14"></circle>
            <circle class="noc-ring-base" cx="56" cy="56" r="36" fill="none" stroke="${first.ringStroke}" stroke-width="14" stroke-dasharray="${dash}" stroke-linecap="round"></circle>
          </svg>
          <div class="noc-center"><div class="noc-inner-number" data-counter>${first.count}</div></div>
        </div>
        <div class="noc-bottom">
          <div class="noc-label">ocorrências</div>
          <div class="noc-alert noc-alert-plain ${first.alertClass || ''}">
            <span class="noc-alert-icon" data-alert-icon>${firstIcon}</span>
            <span data-alert-text>${first.text}</span>
          </div>
        </div>
      </div>`;
  };

  window.openNocOccurrences = function(){
    const shownCards = Array.from(document.querySelectorAll('#nocLiveGrid .noc-card.show'));
    const ids = dedupe(shownCards.flatMap(card => {
      try {
        return JSON.parse(decodeURIComponent(card.getAttribute('data-visible-ids') || '[]'));
      } catch(e) {
        const d = Number(card.dataset.deviceId || 0);
        return d ? [d] : [];
      }
    }));
    if (!ids.length) return;
    applyNocFilter(ids, null);
  };

  window.setupNocRotations = function(){
    clearInterval(window.__nocRotationTimer);
    const cards = Array.from(document.querySelectorAll('#nocLiveGrid .noc-card'));
    const parsed = cards.map(card => {
      let rotations = [];
      try { rotations = JSON.parse(decodeURIComponent(card.getAttribute('data-rotations') || '[]')); } catch(e){}
      return { card, rotations, idx:0 };
    }).filter(x => x.rotations.length > 1);

    function paint(entry){
      const state = entry.rotations[entry.idx];
      const num = entry.card.querySelector('[data-counter]');
      const ring = entry.card.querySelector('.noc-ring-base');
      const track = entry.card.querySelector('.noc-track');
      const alert = entry.card.querySelector('[data-alert-text]');
      const icon = entry.card.querySelector('[data-alert-icon]');
      if (num) num.textContent = state.count;
      if (ring) ring.setAttribute('stroke', state.ringStroke);
      if (track) track.setAttribute('stroke', state.trackStroke);
      if (alert){
        alert.textContent = state.text;
        const parent = alert.closest('.noc-alert');
        if(parent) parent.className = 'noc-alert noc-alert-plain ' + (state.alertClass || '');
      }
      if (icon) icon.innerHTML = renderNocAlertIcon(state.icon, state.iconColor);
      entry.card.setAttribute('data-rotation-index', String(entry.idx));
      entry.card.setAttribute('data-visible-ids', encodeURIComponent(JSON.stringify(state.visibleIds || [])));
    }

    parsed.forEach(paint);

    if (!parsed.length) return;

    window.__nocRotationTimer = setInterval(() => {
      parsed.forEach(entry => {
        entry.idx = (entry.idx + 1) % entry.rotations.length;
        paint(entry);
      });
    }, 12000);
  };

  const originalStart = window.startIntegratedNoc;
  window.startIntegratedNoc = function(){
    if (typeof originalStart === 'function') {
      originalStart();
      if (typeof window.setupNocRotations === 'function') window.setupNocRotations();
    }
  };
})();

/* ===== SCRIPT BLOCK 30 | noc-current-card-click-fix ===== */
(function(){
  function decodeIds(raw){
    try { return JSON.parse(decodeURIComponent(raw || '[]')); }
    catch(e){ return []; }
  }

  function bindCurrentCardClicks(){
    const cards = Array.from(document.querySelectorAll('#nocLiveGrid .noc-card'));
    cards.forEach(card => {
      card.onclick = () => {
        const ids = decodeIds(card.getAttribute('data-visible-ids'));
        const deviceId = Number(card.dataset.deviceId || 0);
        if (!ids.length && deviceId) {
          applyNocFilter([deviceId], deviceId);
          return;
        }
        if (!ids.length) return;

        // card de dispositivo continua podendo abrir o detalhe
        if (deviceId && ids.length === 1) {
          applyNocFilter(ids, deviceId);
        } else {
          applyNocFilter(ids, null);
        }
      };
    });
  }

  const originalStartIntegratedNocCurrent = window.startIntegratedNoc;
  window.startIntegratedNoc = function(){
    if (typeof originalStartIntegratedNocCurrent === 'function') {
      originalStartIntegratedNocCurrent();
      bindCurrentCardClicks();
    }
  };

  // rebinda após rotações também, sem mudar layout
  const originalSetupNocRotationsCurrent = window.setupNocRotations;
  window.setupNocRotations = function(){
    if (typeof originalSetupNocRotationsCurrent === 'function') {
      originalSetupNocRotationsCurrent();
      bindCurrentCardClicks();
    }
  };
})();

/* ===== SCRIPT BLOCK 31 | acc-status-visibility-script ===== */
(function(){
  function qs(id){ return document.getElementById(id); }

  accessibility.visibleFilters = accessibility.visibleFilters || {
    normal:true, warn:true, crit:true, maint:true, offline:true, defrost:true, restock:true, inventory:true
  };

  window.loadAccessibility = function(){
    try{
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if(saved && typeof saved === 'object'){
        accessibility.colorblind = !!saved.colorblind;
        accessibility.contrast = !!saved.contrast;
        accessibility.compact = !!saved.compact;
        accessibility.showCommIcon = saved.showCommIcon !== false;
        accessibility.showMinMax = saved.showMinMax !== false;
        accessibility.showBattery = saved.showBattery !== false;
        accessibility.visibleFilters = Object.assign({
          normal:true, warn:true, crit:true, maint:true, offline:true, defrost:true, restock:true, inventory:true
        }, saved.visibleFilters || {});
      }
    }catch(e){}
  };

  window.saveAccessibility = function(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accessibility));
    }catch(e){}
  };

  function syncTopStatusVisibility(){
    document.querySelectorAll('#statusChips .filterchip[data-filter]').forEach(chip=>{
      const key = chip.dataset.filter;
      chip.style.display = accessibility.visibleFilters[key] ? '' : 'none';
    });
  }

  window.updateToolbarState = function(){
    const states = [];
    if(accessibility.colorblind) states.push('Daltônico');
    if(accessibility.contrast) states.push('Contraste');
    if(accessibility.compact) states.push('Compacto');

    const stateText = states.length ? states.join(' · ') : 'Padrão';
    accState.textContent = stateText;
    accButton.classList.toggle('active', states.length > 0);
    accLiveBadge.textContent = states.length ? `${states.length} recurso${states.length > 1 ? 's' : ''} ativo${states.length > 1 ? 's' : ''}` : 'Padrão ativo';
    toggleColorblind.classList.toggle('on', accessibility.colorblind);
    toggleContrast.classList.toggle('on', accessibility.contrast);
    toggleDensity.classList.toggle('on', accessibility.compact);
    if(toggleCommIcon) toggleCommIcon.classList.toggle('on', accessibility.showCommIcon);
    if(toggleMinMax) toggleMinMax.classList.toggle('on', accessibility.showMinMax);
    if(toggleBattery) toggleBattery.classList.toggle('on', accessibility.showBattery);

    const map = {
      toggleStatusNormal:'normal',
      toggleStatusWarn:'warn',
      toggleStatusCrit:'crit',
      toggleStatusMaint:'maint',
      toggleStatusOffline:'offline',
      toggleStatusDefrost:'defrost',
      toggleStatusRestock:'restock',
      toggleStatusInventory:'inventory'
    };
    Object.keys(map).forEach(id=>{
      const el = qs(id);
      if(el) el.classList.toggle('on', !!accessibility.visibleFilters[map[id]]);
    });
    syncTopStatusVisibility();
  };

  window.applyAccessibility = function(){
    document.body.classList.toggle('acc-colorblind', accessibility.colorblind);
    document.body.classList.toggle('acc-contrast', accessibility.contrast);
    document.body.classList.toggle('density-compact', accessibility.compact);
    document.body.classList.toggle('hide-comm-icon', !accessibility.showCommIcon);
    document.body.classList.toggle('hide-minmax', !accessibility.showMinMax);
    document.body.classList.toggle('hide-battery', !accessibility.showBattery);
    updateToolbarState();
    saveAccessibility();
    renderGrid();
    attachFilterHandlers();
    if(activeId){
      const exists = devices.find(d => d.id === activeId && (!activeFilter || d.state === activeFilter));
      if(exists) openDetail(activeId, true);
      else closeDetail();
    }
  };

  function bindCollapsible(headerId, panelId){
    const header = qs(headerId);
    const panel = qs(panelId);
    if(!header || !panel) return;
    const toggle = () => {
      const open = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(!open));
      if(open) panel.setAttribute('hidden','hidden');
      else panel.removeAttribute('hidden');
    };
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }});
  }

  function bindStatusToggle(id, key){
    const el = qs(id);
    if(!el) return;
    el.addEventListener('click', ()=>{
      accessibility.visibleFilters[key] = !accessibility.visibleFilters[key];
      applyAccessibility();
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    bindCollapsible('accPersonalHeader', 'accPersonalOptions');
    bindCollapsible('accStatusHeader', 'accStatusOptions');
    bindStatusToggle('toggleStatusNormal', 'normal');
    bindStatusToggle('toggleStatusWarn', 'warn');
    bindStatusToggle('toggleStatusCrit', 'crit');
    bindStatusToggle('toggleStatusMaint', 'maint');
    bindStatusToggle('toggleStatusOffline', 'offline');
    bindStatusToggle('toggleStatusDefrost', 'defrost');
    bindStatusToggle('toggleStatusRestock', 'restock');
    bindStatusToggle('toggleStatusInventory', 'inventory');
  });
})();

/* ===== SCRIPT BLOCK 32 | acc-modal-v7-script ===== */
(function(){
  const ORDER = ['normal','warn','crit','offline','maint','defrost','restock','inventory'];
  function qs(id){ return document.getElementById(id); }

  function clampVisibleFilters(){
    const vf = accessibility.visibleFilters || {};
    let selected = ORDER.filter(k => !!vf[k]);
    if(selected.length <= 4) return;
    // keep first 4 by priority order
    ORDER.forEach((k, idx) => { vf[k] = selected.slice(0,4).includes(k); });
  }

  function syncHeadersClosed(){
    const pH = qs('accPersonalHeader'), pO = qs('accPersonalOptions');
    const sH = qs('accStatusHeader'), sO = qs('accStatusOptions');
    if(pH && pO){
      pH.setAttribute('aria-expanded','false');
      pO.setAttribute('hidden','hidden');
    }
    if(sH && sO){
      sH.setAttribute('aria-expanded','false');
      sO.setAttribute('hidden','hidden');
    }
  }

  function updateStatusNote(msg, warn){
    const note = qs('accStatusNote');
    if(!note) return;
    note.textContent = msg || 'Você pode selecionar no máximo 4 status para exibir no topo.';
    note.classList.toggle('warn', !!warn);
  }

  function selectedCount(){
    return ORDER.filter(k => accessibility.visibleFilters && accessibility.visibleFilters[k]).length;
  }

  function syncTopStatusVisibilityV7(){
    document.querySelectorAll('#statusChips .filterchip[data-filter]').forEach(chip=>{
      const key = chip.dataset.filter;
      chip.style.display = accessibility.visibleFilters[key] ? '' : 'none';
    });
  }

  function syncStatusTogglesV7(){
    const map = {
      toggleStatusNormal:'normal',
      toggleStatusWarn:'warn',
      toggleStatusCrit:'crit',
      toggleStatusMaint:'maint',
      toggleStatusOffline:'offline',
      toggleStatusDefrost:'defrost',
      toggleStatusRestock:'restock',
      toggleStatusInventory:'inventory'
    };
    Object.keys(map).forEach(id=>{
      const el = qs(id);
      if(el) el.classList.toggle('on', !!accessibility.visibleFilters[map[id]]);
    });
  }

  function bindStatusToggleLimited(id, key){
    const el = qs(id);
    if(!el) return;
    el.onclick = function(){
      const currentlyOn = !!accessibility.visibleFilters[key];
      if(!currentlyOn){
        if(selectedCount() >= 4){
          updateStatusNote('O limite de status visíveis é 4.', true);
          return;
        }
        accessibility.visibleFilters[key] = true;
        updateStatusNote('', false);
      } else {
        accessibility.visibleFilters[key] = false;
        updateStatusNote('', false);
      }
      syncStatusTogglesV7();
      syncTopStatusVisibilityV7();
      saveAccessibility();
    };
  }

  // override toolbar sync lightly
  const prevUpdateToolbarState = window.updateToolbarState;
  window.updateToolbarState = function(){
    if (typeof prevUpdateToolbarState === 'function') prevUpdateToolbarState();
    clampVisibleFilters();
    syncStatusTogglesV7();
    syncTopStatusVisibilityV7();
  };

  // ensure saved state respects max 4
  const prevLoad = window.loadAccessibility;
  window.loadAccessibility = function(){
    if (typeof prevLoad === 'function') prevLoad();
    clampVisibleFilters();
  };

  document.addEventListener('DOMContentLoaded', function(){
    clampVisibleFilters();
    syncHeadersClosed();
    syncStatusTogglesV7();
    syncTopStatusVisibilityV7();
    bindStatusToggleLimited('toggleStatusNormal','normal');
    bindStatusToggleLimited('toggleStatusWarn','warn');
    bindStatusToggleLimited('toggleStatusCrit','crit');
    bindStatusToggleLimited('toggleStatusMaint','maint');
    bindStatusToggleLimited('toggleStatusOffline','offline');
    bindStatusToggleLimited('toggleStatusDefrost','defrost');
    bindStatusToggleLimited('toggleStatusRestock','restock');
    bindStatusToggleLimited('toggleStatusInventory','inventory');
  });
})();

/* ===== SCRIPT BLOCK 33 | final-toggle-fix ===== */
window.statusState = {
 normal:true, warn:true, crit:true, offline:true
};

function toggleStatus(key, el){
  const enabledCount = Object.values(statusState).filter(v=>v).length;
  if(!statusState[key] && enabledCount>=4){
    alert("Máximo 4 status");
    return;
  }
  statusState[key] = !statusState[key];
  el.classList.toggle("on", statusState[key]);

  document.querySelectorAll('#statusChips .filterchip').forEach(c=>{
    const k=c.dataset.filter;
    if(statusState[k]===false){
      c.style.display="none";
    }else{
      c.style.display="";
    }
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  const map={
    toggleStatusNormal:"normal",
    toggleStatusWarn:"warn",
    toggleStatusCrit:"crit",
    toggleStatusOffline:"offline"
  };
  Object.keys(map).forEach(id=>{
    const el=document.getElementById(id);
    if(el){
      el.onclick=(e)=>{
        e.stopPropagation();
        toggleStatus(map[id], el);
      };
    }
  });
});

/* ===== SCRIPT BLOCK 34 | v13-status-sync-all ===== */
(function(){
  const STATUS_KEYS = ['normal','warn','crit','offline','maint','defrost','restock','inventory'];

  function ensureState(){
    window.statusState = window.statusState || {};
    STATUS_KEYS.forEach(k => {
      if (!(k in window.statusState)) window.statusState[k] = false;
    });
    // manter os 4 principais ativos por padrão se ainda não houve escolha
    if (!window.__statusInitialized) {
      window.statusState.normal = true;
      window.statusState.warn = true;
      window.statusState.crit = true;
      window.statusState.offline = true;
      window.statusState.maint = false;
      window.statusState.defrost = false;
      window.statusState.restock = false;
      window.statusState.inventory = false;
      window.__statusInitialized = true;
    }
  }

  function syncTop(){
    ensureState();
    document.querySelectorAll('#statusChips .filterchip[data-filter]').forEach(chip => {
      const key = chip.dataset.filter;
      chip.style.display = window.statusState[key] ? '' : 'none';
    });
  }

  function syncButtons(){
    ensureState();
    const map = {
      toggleStatusNormal:'normal',
      toggleStatusWarn:'warn',
      toggleStatusCrit:'crit',
      toggleStatusOffline:'offline',
      toggleStatusMaint:'maint',
      toggleStatusDefrost:'defrost',
      toggleStatusRestock:'restock',
      toggleStatusInventory:'inventory'
    };
    Object.entries(map).forEach(([id,key])=>{
      const btn = document.getElementById(id);
      if (btn) btn.classList.toggle('on', !!window.statusState[key]);
    });
  }

  function countEnabled(){
    ensureState();
    return Object.values(window.statusState).filter(Boolean).length;
  }

  function toggleKey(key){
    ensureState();
    const turningOn = !window.statusState[key];
    if (turningOn && countEnabled() >= 4){
      alert('Você pode selecionar no máximo 4 status.');
      return;
    }
    window.statusState[key] = turningOn;
    syncButtons();
    syncTop();
  }

  function bind(id, key){
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      toggleKey(key);
    };
  }

  function init(){
    ensureState();
    bind('toggleStatusNormal','normal');
    bind('toggleStatusWarn','warn');
    bind('toggleStatusCrit','crit');
    bind('toggleStatusOffline','offline');
    bind('toggleStatusMaint','maint');
    bind('toggleStatusDefrost','defrost');
    bind('toggleStatusRestock','restock');
    bind('toggleStatusInventory','inventory');
    syncButtons();
    syncTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ===== SCRIPT BLOCK 35 | force-battery-visible-preview ===== */
document.addEventListener('DOMContentLoaded', function(){
  try{
    if (window.accessibility) {
      accessibility.showBattery = true;
      document.body.classList.remove('hide-battery');
      if (typeof updateToolbarState === 'function') updateToolbarState();
      if (typeof saveAccessibility === 'function') saveAccessibility();
      if (typeof renderGrid === 'function') renderGrid();
    }
  } catch(e) {}
});

/* ===== SCRIPT BLOCK 36 | v20-card-bell-script ===== */
(function(){
  const bellSilencedUntil = {};
  const PANEL_MUTE_MS = 15 * 60 * 1000;
  const panelState = window.panelControlState = window.panelControlState || {
    globalMuteUntil: 0,
    autoRefreshEnabled: false,
    autoRefreshRemaining: 60,
    autoRefreshInterval: null,
    autoRefreshTicker: null
  };

  function isGlobalMuted(){
    return panelState.globalMuteUntil && Date.now() < panelState.globalMuteUntil;
  }

  function isSilenced(id){
    return bellSilencedUntil[id] && Date.now() < bellSilencedUntil[id];
  }

  function remainingText(id){
    if(isGlobalMuted()) return 'Painel silenciado globalmente por 15 minutos';
    if(!isSilenced(id)) return 'Silenciar por 15 minutos';
    const left = Math.max(0, bellSilencedUntil[id] - Date.now());
    const sec = Math.ceil(left / 1000);
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2,'0');
    return 'Silenciado por 15 minutos • restante ' + m + ':' + s;
  }

  function updateBells(){
    const globalMuted = isGlobalMuted();
    document.querySelectorAll('.card').forEach(card => card.classList.toggle('global-muted', globalMuted));
    document.querySelectorAll('.card-bell').forEach(bell => {
      const id = bell.dataset.id;
      const silenced = globalMuted || isSilenced(id);
      bell.classList.toggle('global-hidden', globalMuted);
      bell.classList.toggle('silenced', silenced);
      bell.classList.toggle('ringing', !silenced);
      bell.title = remainingText(id);
      bell.onclick = function(e){
        e.preventDefault();
        e.stopPropagation();
        if(globalMuted) return;
        bellSilencedUntil[id] = Date.now() + PANEL_MUTE_MS;
        updateBells();
      };
    });
    if(typeof window.updatePanelConfigUI === 'function') window.updatePanelConfigUI();
  }

  let audioCtx = null;
  function getAudioContext(){
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function beepOnce(offset=0){
    const ctx = getAudioContext();
    if(ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime + offset;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1120, now);
    osc.frequency.linearRampToValueAtTime(1240, now + 0.10);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  function playSequence(){
    if(isGlobalMuted()) return;
    for(let i=0;i<5;i++) beepOnce(i * 0.22);
  }

  function primeAudio(){
    try {
      const ctx = getAudioContext();
      if(ctx.state === 'suspended') ctx.resume();
    } catch(e) {}
  }

  function anyBellActive(){
    if(isGlobalMuted()) return false;
    return Array.from(document.querySelectorAll('.card-bell')).some(bell => !isSilenced(bell.dataset.id));
  }

  const originalRenderGrid = window.renderGrid;
  window.renderGrid = function(){
    if(typeof originalRenderGrid === 'function') originalRenderGrid();
    updateBells();
  };

  window.activateGlobalMute = function(active){
    panelState.globalMuteUntil = active ? Date.now() + PANEL_MUTE_MS : 0;
    updateBells();
  };
  window.isPanelGloballyMuted = isGlobalMuted;
  window.updatePanelBells = updateBells;
  window.playPanelAlertSequence = playSequence;
  window.primePanelAlertAudio = primeAudio;

  document.addEventListener('DOMContentLoaded', function(){
    updateBells();
    setInterval(updateBells, 1000);
    setInterval(() => {
      if(anyBellActive()) playSequence();
    }, 5000);
  });
})();

/* ===== SCRIPT BLOCK 37 | panel-controls-script ===== */
(function(){
  const state = window.panelControlState = window.panelControlState || {
    globalMuteUntil: 0,
    autoRefreshEnabled: false,
    autoRefreshRemaining: 60,
    autoRefreshInterval: null,
    autoRefreshTicker: null
  };

  function formatClock(total){
    const safe = Math.max(0, total);
    const m = String(Math.floor(safe / 60)).padStart(2,'0');
    const s = String(safe % 60).padStart(2,'0');
    return `${m}:${s}`;
  }

  function getEl(id){ return document.getElementById(id); }

  function closeMenusOnOutside(event){
    const btn = getEl('panelConfigBtn');
    const menu = getEl('panelConfigMenu');
    if(!btn || !menu) return;
    if(btn.contains(event.target) || menu.contains(event.target)) return;
    menu.classList.remove('show');
    btn.setAttribute('aria-expanded','false');
  }

  function setSwitchState(el, on){
    if(!el) return;
    el.classList.toggle('on', !!on);
    el.setAttribute('aria-checked', !!on ? 'true' : 'false');
  }

  function updatePanelConfigUI(){
    const globalMuted = !!(state.globalMuteUntil && Date.now() < state.globalMuteUntil);
    const btn = getEl('panelConfigBtn');
    const badge = getEl('panelConfigBadge');
    const muteStatus = getEl('globalMuteStatus');
    const autoStatus = getEl('autoRefreshMiniStatus');
    const timer = getEl('autoRefreshStatus');

    setSwitchState(getEl('toggleGlobalMute'), globalMuted);
    setSwitchState(getEl('toggleAutoRefresh'), !!state.autoRefreshEnabled);

    const labels = [];
    if(globalMuted) labels.push('Silêncio global');
    if(state.autoRefreshEnabled) labels.push('Atualização ativa');
    if(badge) badge.textContent = labels.length ? labels.join(' • ') : 'Painel padrão';
    if(btn) btn.classList.toggle('active', labels.length > 0);

    if(muteStatus){
      if(globalMuted){
        const left = Math.max(0, Math.ceil((state.globalMuteUntil - Date.now()) / 1000));
        muteStatus.textContent = `Silêncio global ativo • restante ${formatClock(left)}`;
        muteStatus.classList.add('show');
      } else {
        muteStatus.classList.remove('show');
        muteStatus.textContent = '';
      }
    }

    if(autoStatus){
      if(state.autoRefreshEnabled){
        autoStatus.textContent = `Atualização automática ligada • próxima em ${formatClock(state.autoRefreshRemaining)}`;
        autoStatus.classList.add('show');
      } else {
        autoStatus.classList.remove('show');
        autoStatus.textContent = '';
      }
    }

    if(timer){
      if(state.autoRefreshEnabled){
        timer.hidden = false;
        timer.textContent = `Próxima atualização em: ${formatClock(state.autoRefreshRemaining)}`;
      } else {
        timer.hidden = true;
        timer.textContent = 'Próxima atualização em: 01:00';
      }
    }
  }

  function stopAutoRefresh(){
    state.autoRefreshEnabled = false;
    if(state.autoRefreshTicker) clearInterval(state.autoRefreshTicker);
    state.autoRefreshTicker = null;
    updatePanelConfigUI();
  }

  function startAutoRefresh(){
    state.autoRefreshEnabled = true;
    state.autoRefreshRemaining = 60;
    if(state.autoRefreshTicker) clearInterval(state.autoRefreshTicker);
    state.autoRefreshTicker = setInterval(() => {
      if(!state.autoRefreshEnabled) return;
      state.autoRefreshRemaining -= 1;
      if(state.autoRefreshRemaining <= 0){
        location.reload();
        return;
      }
      updatePanelConfigUI();
    }, 1000);
    updatePanelConfigUI();
  }

  function setGlobalMute(active){
    if(typeof window.activateGlobalMute === 'function'){
      window.activateGlobalMute(active);
    } else {
      state.globalMuteUntil = active ? Date.now() + 15 * 60 * 1000 : 0;
    }
    updatePanelConfigUI();
  }

  document.addEventListener('DOMContentLoaded', function(){
    const btn = getEl('panelConfigBtn');
    const menu = getEl('panelConfigMenu');
    const muteToggle = getEl('toggleGlobalMute');
    const refreshToggle = getEl('toggleAutoRefresh');

    if(btn && menu){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        const open = menu.classList.toggle('show');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    if(muteToggle){
      muteToggle.addEventListener('click', function(){
        const next = !(state.globalMuteUntil && Date.now() < state.globalMuteUntil);
        setGlobalMute(next);
        if(typeof window.logGlobalMuteForAll === 'function'){
          window.logGlobalMuteForAll(next);
        }
      });
    }

    if(refreshToggle){
      refreshToggle.addEventListener('click', function(){
        if(state.autoRefreshEnabled){
          stopAutoRefresh();
        } else {
          startAutoRefresh();
        }
      });
    }

    document.addEventListener('click', closeMenusOnOutside);
    setInterval(updatePanelConfigUI, 1000);
    updatePanelConfigUI();
  });

  window.updatePanelConfigUI = updatePanelConfigUI;
  window.logGlobalMuteForAll = function(enabled){
    const label = enabled ? 'Painel silenciado' : 'Painel reativado';
    const description = enabled
      ? 'Painel silenciado globalmente por 15 minutos.'
      : 'Silenciamento global encerrado e os alertas voltaram ao normal.';
    (window.devices || devices || []).forEach(d => {
      pushAuditEntry(d, {scope:'painel', field:label, description});
    });
  };
})();

/* ===== SCRIPT BLOCK 37A | scheduled-collection-modal ===== */
(function(){
  const allowedRoles = new Set(['master', 'admin1', 'admin2']);
  const defaultConfig = {
    areaName: 'Banco IDvida',
    hours: 1,
    scope: 'all',
    deviceIds: [],
    metrics: ['temperature'],
    updatedAt: null
  };
  const metricNames = {
    temperature: 'temperatura da coleta',
    temperatureMinMax: 'temperatura: mín./máx.',
    temperatureAverage: 'temperatura: média',
    humidity: 'umidade da coleta',
    humidityMinMax: 'umidade: mín./máx.',
    humidityAverage: 'umidade: média'
  };
  const metricShortNames = {
    temperature: 'temperatura',
    temperatureMinMax: 'temp. mín./máx.',
    temperatureAverage: 'média temp.',
    humidity: 'umidade',
    humidityMinMax: 'umid. mín./máx.',
    humidityAverage: 'média umid.'
  };

  function getEl(id){ return document.getElementById(id); }

  function escapeHtml(value){
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function canConfigureScheduledCollection(){
    return allowedRoles.has(String(window.currentRole || 'master').toLowerCase());
  }

  function currentAreaName(){
    if(typeof selectedArea !== 'undefined' && selectedArea) return selectedArea;
    return 'Banco IDvida';
  }

  function getDeviceRows(){
    const allDevices = window.devices || (typeof devices !== 'undefined' ? devices : []);
    const area = currentAreaName();
    if(!Array.isArray(allDevices)) return [];
    if(!area) return allDevices;
    return allDevices.filter(device => device.sector === area);
  }

  function formatHours(hours){
    const safe = Number(hours) || 1;
    return safe === 1 ? '1 hora' : `${safe} horas`;
  }

  function joinPt(parts){
    const list = parts.filter(Boolean);
    if(list.length <= 1) return list[0] || '';
    if(list.length === 2) return `${list[0]} e ${list[1]}`;
    return `${list.slice(0, -1).join(', ')} e ${list[list.length - 1]}`;
  }

  function selectedDeviceLabel(count){
    if(count === 1) return '1 dispositivo selecionado';
    if(!count) return 'nenhum dispositivo selecionado';
    return `${count} dispositivos selecionados`;
  }

  function normalizeConfig(config){
    return normalizeScheduledConfigValue({
      ...defaultConfig,
      ...(config && typeof config === 'object' ? config : {}),
      areaName: config?.areaName || currentAreaName()
    });
  }

  function loadState(){
    const state = readScheduledCollectionState();
    return {
      active: state.active ? normalizeConfig(state.active) : null,
      pending: state.pending ? normalizeConfig(state.pending) : null
    };
  }

  function loadConfig(){
    const state = loadState();
    return normalizeConfig(state.pending || state.active || defaultConfig);
  }

  function configSignature(config){
    const normalized = normalizeConfig(config);
    return JSON.stringify({
      hours: normalized.hours,
      scope: normalized.scope,
      deviceIds: normalized.deviceIds.slice().sort(),
      metrics: normalized.metrics.slice().sort()
    });
  }

  function saveConfig(config){
    const state = loadState();
    const now = new Date();
    const draft = normalizeConfig({
      ...config,
      areaName: currentAreaName()
    });

    if(!state.active){
      const active = normalizeConfig({ ...draft, updatedAt: now.toISOString() });
      writeScheduledCollectionState({ active, pending:null });
      return { mode:'active', active, pending:null };
    }

    if(configSignature(draft) === configSignature(state.active)){
      writeScheduledCollectionState({ active:state.active, pending:null });
      return { mode:'unchanged', active:state.active, pending:null };
    }

    const timing = getScheduledCollectionTiming(state.active);
    const effectiveAt = state.pending?.effectiveAt || timing.next.toISOString();
    const pending = normalizeConfig({
      ...draft,
      updatedAt: null,
      requestedAt: now.toISOString(),
      effectiveAt
    });
    writeScheduledCollectionState({ active:state.active, pending });
    return { mode:'pending', active:state.active, pending };
  }

  function selectedHours(){
    const active = getEl('scheduledFrequencyOptions')?.querySelector('.scheduled-choice.active');
    return Number(active?.dataset?.hours || defaultConfig.hours);
  }

  function selectedScope(){
    const active = getEl('scheduledScopeOptions')?.querySelector('button.active');
    return active?.dataset?.scope === 'selected' ? 'selected' : 'all';
  }

  function selectedMetrics(){
    return Array.from(document.querySelectorAll('#scheduledMetricOptions input[type="checkbox"]:checked'))
      .map(input => input.value)
      .filter(value => Object.prototype.hasOwnProperty.call(metricNames, value));
  }

  function selectedDeviceIds(){
    return Array.from(document.querySelectorAll('#scheduledDeviceList input[type="checkbox"]:checked'))
      .map(input => String(input.value));
  }

  function setFeedback(message, type){
    const feedback = getEl('scheduledCollectionFeedback');
    if(!feedback) return;
    feedback.textContent = message || '';
    feedback.classList.toggle('show', !!message);
    feedback.classList.toggle('error', type === 'error');
  }

  function updateCycleStatus(state){
    const currentState = state || loadState();
    const wrapper = getEl('scheduledCollectionCycleStatus');
    const title = getEl('scheduledCollectionCycleTitle');
    const text = getEl('scheduledCollectionCycleText');
    const cancelButton = getEl('cancelPendingScheduledCollection');
    const saveButton = getEl('saveScheduledCollection');
    if(!wrapper || !title || !text || !cancelButton || !saveButton) return;

    if(!currentState.active){
      wrapper.hidden = true;
      cancelButton.hidden = true;
      saveButton.textContent = 'Salvar coleta';
      return;
    }

    wrapper.hidden = false;
    if(currentState.pending){
      const effectiveAt = new Date(currentState.pending.effectiveAt);
      title.textContent = 'Alteração pendente';
      text.textContent = `A configuração ativa continua até a coleta das ${formatScheduleClock(effectiveAt)}. Você pode corrigir ou cancelar a alteração antes desse horário.`;
      cancelButton.hidden = false;
      saveButton.textContent = 'Atualizar alteração';
      return;
    }

    const timing = getScheduledCollectionTiming(currentState.active);
    title.textContent = 'Configuração ativa';
    text.textContent = `Qualquer mudança será aplicada somente após a próxima coleta, às ${formatScheduleClock(timing.next)}.`;
    cancelButton.hidden = true;
    saveButton.textContent = 'Programar alteração';
  }

  function renderDeviceList(config){
    const list = getEl('scheduledDeviceList');
    if(!list) return;
    const rows = getDeviceRows();
    const checkedIds = new Set((config?.deviceIds || []).map(String));
    if(!rows.length){
      list.innerHTML = '<div class="scheduled-device-empty">Nenhum dispositivo encontrado para esta área.</div>';
      return;
    }
    list.innerHTML = rows.map(device => {
      const id = String(device.id);
      const checked = checkedIds.has(id) ? ' checked' : '';
      return `
        <label class="scheduled-device-option">
          <input type="checkbox" value="${escapeHtml(id)}"${checked}>
          <span>${escapeHtml(device.name || `Dispositivo ${id}`)}</span>
          <small>${escapeHtml(device.sector || currentAreaName())}</small>
        </label>
      `;
    }).join('');
  }

  function updateDeviceVisibility(){
    const list = getEl('scheduledDeviceList');
    const help = getEl('scheduledDeviceHelp');
    const scope = selectedScope();
    const rows = getDeviceRows();
    if(list) list.hidden = scope !== 'selected';
    if(help){
      if(scope === 'selected'){
        const count = selectedDeviceIds().length;
        help.textContent = count
          ? `${selectedDeviceLabel(count)} para a rotina.`
          : 'Selecione pelo menos um dispositivo da área atual.';
      } else {
        help.textContent = `A rotina será aplicada em todos os dispositivos da área atual (${rows.length}).`;
      }
    }
  }

  function buildSummaryText(){
    const hours = selectedHours();
    const scope = selectedScope();
    const metrics = selectedMetrics();
    const temperatureMetrics = metrics.filter(metric => metric.startsWith('temperature'));
    const humidityMetrics = metrics.filter(metric => metric.startsWith('humidity'));
    const rows = getDeviceRows();
    const selectedCount = scope === 'selected' ? selectedDeviceIds().length : rows.length;

    if(!metrics.length){
      return 'Selecione pelo menos um dado para montar a coleta programada.';
    }

    const scopeText = scope === 'selected'
      ? `A coleta será aplicada em ${selectedDeviceLabel(selectedCount)}.`
      : `A coleta será aplicada em todos os dispositivos da área atual (${rows.length}).`;
    const pieces = [scopeText, `A rotina será executada a cada ${formatHours(hours)}.`];

    if(temperatureMetrics.length){
      const details = [];
      const hasValue = temperatureMetrics.includes('temperature');
      const hasMinMax = temperatureMetrics.includes('temperatureMinMax');
      const hasAverage = temperatureMetrics.includes('temperatureAverage');
      if(hasValue) details.push('temperatura do horário');
      if(hasMinMax) details.push('mín./máx. do horário');
      if(hasAverage && hasMinMax && hasValue) details.push(`média da temperatura e mín./máx. das últimas ${formatHours(hours)}`);
      else if(hasAverage && hasMinMax) details.push(`mín./máx. das últimas ${formatHours(hours)}`);
      else if(hasAverage) details.push(`média da temperatura das últimas ${formatHours(hours)}`);
      pieces.push(`Temperatura: ${joinPt(details)}.`);
    }
    if(humidityMetrics.length){
      const details = [];
      const hasValue = humidityMetrics.includes('humidity');
      const hasMinMax = humidityMetrics.includes('humidityMinMax');
      const hasAverage = humidityMetrics.includes('humidityAverage');
      if(hasValue) details.push('umidade do horário');
      if(hasMinMax) details.push('mín./máx. do horário');
      if(hasAverage && hasMinMax && hasValue) details.push(`média da umidade e mín./máx. das últimas ${formatHours(hours)}`);
      else if(hasAverage && hasMinMax) details.push(`mín./máx. das últimas ${formatHours(hours)}`);
      else if(hasAverage) details.push(`média da umidade das últimas ${formatHours(hours)}`);
      pieces.push(`Umidade: ${joinPt(details)}.`);
    }

    return pieces.join(' ');
  }

  function updateMetricCards(){
    document.querySelectorAll('#scheduledMetricOptions .scheduled-check-card').forEach(card => {
      const input = card.querySelector('input[type="checkbox"]');
      card.classList.toggle('active', !!input?.checked);
    });
  }

  function updateSummary(){
    updateMetricCards();
    updateDeviceVisibility();
    const summary = getEl('scheduledCollectionSummary');
    if(!summary) return;
    const metrics = selectedMetrics();
    const metricLabel = metrics.length
      ? metrics.map(metric => metricNames[metric]).join('; ')
      : 'nenhum dado selecionado';
    summary.innerHTML = `
      <strong>Resumo da configuração</strong>
      <span>${escapeHtml(buildSummaryText())}</span>
      <small>Dados selecionados: ${escapeHtml(metricLabel)}.</small>
    `;
  }

  function updateMiniStatus(config){
    const entry = getEl('scheduledCollectionEntry');
    const mini = getEl('scheduledCollectionMiniStatus');
    const allowed = canConfigureScheduledCollection();
    if(entry) entry.hidden = !allowed;
    if(!mini) return;
    if(!allowed){
      mini.classList.remove('show');
      mini.textContent = '';
      return;
    }
    const state = config?.active || config?.pending ? config : loadState();
    const current = state.active ? normalizeConfig(state.active) : null;
    if(!current?.updatedAt){
      mini.classList.remove('show');
      mini.textContent = '';
      return;
    }
    const metricLabel = joinPt(current.metrics.map(metric => metricShortNames[metric] || metricNames[metric]));
    const scopeLabel = current.scope === 'selected'
      ? `${current.deviceIds.length} dispositivo${current.deviceIds.length === 1 ? '' : 's'}`
      : 'todos os dispositivos';
    const pendingLabel = state.pending?.effectiveAt
      ? ` Alteração pendente para ${formatScheduleClock(new Date(state.pending.effectiveAt))}.`
      : '';
    mini.textContent = `Coleta programada: ${formatHours(current.hours)} · ${scopeLabel} · ${metricLabel}. Fechamento em 30 dias.${pendingLabel}`;
    mini.classList.add('show');
  }

  function applyConfig(config){
    const current = normalizeConfig(config || loadConfig());
    document.querySelectorAll('#scheduledFrequencyOptions .scheduled-choice').forEach(button => {
      button.classList.toggle('active', Number(button.dataset.hours) === current.hours);
    });
    document.querySelectorAll('#scheduledScopeOptions button').forEach(button => {
      button.classList.toggle('active', button.dataset.scope === current.scope);
    });
    document.querySelectorAll('#scheduledMetricOptions input[type="checkbox"]').forEach(input => {
      input.checked = current.metrics.includes(input.value);
    });
    renderDeviceList(current);
    updateSummary();
  }

  function openModal(){
    if(!canConfigureScheduledCollection()) return;
    const menu = getEl('panelConfigMenu');
    const btn = getEl('panelConfigBtn');
    if(menu) menu.classList.remove('show');
    if(btn) btn.setAttribute('aria-expanded','false');
    setFeedback('');
    const state = loadState();
    applyConfig(state.pending || state.active || defaultConfig);
    updateCycleStatus(state);
    getEl('scheduledCollectionOverlay')?.classList.add('show');
    setTimeout(() => getEl('scheduledFrequencyOptions')?.querySelector('.scheduled-choice.active')?.focus(), 40);
  }

  function closeModal(){
    getEl('scheduledCollectionOverlay')?.classList.remove('show');
  }

  function submitForm(event){
    event.preventDefault();
    if(!canConfigureScheduledCollection()) return;
    const metrics = selectedMetrics();
    const scope = selectedScope();
    const deviceIds = scope === 'selected' ? selectedDeviceIds() : [];
    if(!metrics.length){
      setFeedback('Selecione pelo menos um dado para registrar na coleta.', 'error');
      updateSummary();
      return;
    }
    if(scope === 'selected' && !deviceIds.length){
      setFeedback('Selecione pelo menos um dispositivo ou aplique para todos da área.', 'error');
      updateSummary();
      return;
    }
    const saved = saveConfig({
      hours: selectedHours(),
      scope,
      deviceIds,
      metrics
    });
    if(saved.mode === 'active'){
      setFeedback('Coleta programada salva e ativada para esta área.');
    } else if(saved.mode === 'unchanged'){
      setFeedback('A alteração pendente foi cancelada. A configuração ativa foi mantida.');
    } else {
      const effectiveAt = new Date(saved.pending.effectiveAt);
      setFeedback(`Alteração programada. A nova configuração será aplicada após a coleta das ${formatScheduleClock(effectiveAt)}.`);
    }
    const state = loadState();
    updateCycleStatus(state);
    updateMiniStatus(state);
    updateSummary();
  }

  function cancelPendingChange(){
    const state = loadState();
    if(!state.pending || !state.active) return;
    writeScheduledCollectionState({ active:state.active, pending:null });
    const nextState = loadState();
    applyConfig(nextState.active);
    updateCycleStatus(nextState);
    updateMiniStatus(nextState);
    setFeedback('Alteração pendente cancelada. A configuração ativa foi mantida.');
  }

  function updateScheduledCollectionVisibility(){
    updateMiniStatus(loadState());
  }

  window.updateScheduledCollectionVisibility = updateScheduledCollectionVisibility;

  document.addEventListener('DOMContentLoaded', function(){
    getEl('openScheduledCollectionModal')?.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      openModal();
    });
    getEl('closeScheduledCollectionModal')?.addEventListener('click', closeModal);
    getEl('cancelScheduledCollection')?.addEventListener('click', closeModal);
    getEl('cancelPendingScheduledCollection')?.addEventListener('click', cancelPendingChange);
    getEl('scheduledCollectionOverlay')?.addEventListener('click', function(event){
      if(event.target === event.currentTarget) closeModal();
    });
    getEl('scheduledFrequencyOptions')?.addEventListener('click', function(event){
      const button = event.target?.closest?.('.scheduled-choice');
      if(!button) return;
      this.querySelectorAll('.scheduled-choice').forEach(item => item.classList.toggle('active', item === button));
      setFeedback('');
      updateSummary();
    });
    getEl('scheduledScopeOptions')?.addEventListener('click', function(event){
      const button = event.target?.closest?.('button[data-scope]');
      if(!button) return;
      this.querySelectorAll('button[data-scope]').forEach(item => item.classList.toggle('active', item === button));
      setFeedback('');
      updateSummary();
    });
    getEl('scheduledMetricOptions')?.addEventListener('change', function(){
      setFeedback('');
      updateSummary();
    });
    getEl('scheduledDeviceList')?.addEventListener('change', function(){
      setFeedback('');
      updateSummary();
    });
    getEl('scheduledCollectionForm')?.addEventListener('submit', submitForm);
    updateScheduledCollectionVisibility();
  });
})();

/* ===== SCRIPT BLOCK 37B | bind-device-modal ===== */
(function(){
  const allowedRoles = new Set(['master', 'admin1', 'admin2']);

  function getEl(id){ return document.getElementById(id); }

  function escapeHtml(value){
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function canBindDevice(){
    return allowedRoles.has(String(window.currentRole || 'master').toLowerCase());
  }

  function getApiBase(){
    if(typeof window.getPanelApiBaseUrl === 'function'){
      return window.getPanelApiBaseUrl().replace(/\/+$/, '');
    }
    return 'http://localhost:4000';
  }

  function setFeedback(message, type){
    const feedback = getEl('bindDeviceFeedback');
    if(!feedback) return;
    feedback.textContent = message || '';
    feedback.classList.toggle('show', !!message);
    feedback.classList.toggle('error', type === 'error');
  }

  function resetResult(){
    const result = getEl('bindDeviceResult');
    if(!result) return;
    result.hidden = true;
    result.innerHTML = '';
  }

  function readAreaIds(areaInput){
    const raw = areaInput?.dataset?.areaIds || '[]';
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch(e) {
      return [];
    }
  }

  function isWideProfile(profile){
    return ['master','admin1','admin2'].includes(String(profile || '').toLowerCase());
  }

  function openModal(){
    if(!canBindDevice()) return;
    const overlay = getEl('bindDeviceOverlay');
    const menu = getEl('panelConfigMenu');
    const btn = getEl('panelConfigBtn');
    if(menu) menu.classList.remove('show');
    if(btn) btn.setAttribute('aria-expanded','false');
    setFeedback('');
    resetResult();
    if(overlay) overlay.classList.add('show');
    setTimeout(() => getEl('bindUserName')?.focus(), 40);
  }

  function closeModal(){
    const overlay = getEl('bindDeviceOverlay');
    if(overlay) overlay.classList.remove('show');
  }

  function emailStatusLabel(delivery){
    const status = delivery?.status_envio || 'skipped';
    if(status === 'sent') return 'E-mail enviado com sucesso.';
    if(status === 'not_configured') return 'Código gerado. Envio de e-mail ainda não configurado no servidor.';
    if(status === 'disabled') return 'Código gerado. Envio de e-mail desativado no servidor.';
    if(status === 'failed'){
      const message = String(delivery?.message || '');
      if(message.includes('testing emails') || message.includes('verify a domain')){
        return 'Código gerado. O e-mail de teste só pode ser enviado para david@idvida.com.br.';
      }
      return 'Código gerado. O e-mail não foi enviado, mas o QR Code e o código podem ser usados normalmente.';
    }
    return 'Código gerado para ativação manual.';
  }

  function showResult(data){
    const result = getEl('bindDeviceResult');
    if(!result) return;
    const payload = data?.qr_payload || '';
    const scanPayload = data?.qr_scan_payload || data?.activation_deep_link || '';
    const qrImage = data?.qr_code_data_url || data?.qr_image_url || '';
    const delivery = data?.email_delivery || {};
    result.innerHTML = `
      <div class="bind-device-result-line">Código de ativação</div>
      <div class="bind-device-result-main">
        <div class="bind-device-result-code">${escapeHtml(data?.codigo || '')}</div>
        ${qrImage ? `<img class="bind-device-result-qr" src="${escapeHtml(qrImage)}" alt="QR Code de ativação">` : ''}
      </div>
      ${scanPayload ? `<div class="bind-device-result-line">QR Code: no app instalado, abre o IDsensor. No Expo Go, abra o projeto primeiro e escaneie este QR dentro do app.</div>` : ''}
      <div class="bind-device-result-line">${escapeHtml(emailStatusLabel(delivery))}</div>
      ${payload ? `<div class="bind-device-result-line">Link de apoio: ${escapeHtml(payload)}</div>` : ''}
      <button class="bind-device-copy" id="copyBindDeviceCode" type="button">Copiar código</button>
    `;
    result.hidden = false;
  }

  async function submitForm(event){
    event.preventDefault();
    if(!canBindDevice()) return;

    const nameInput = getEl('bindUserName');
    const emailInput = getEl('bindUserEmail');
    const areaInput = getEl('bindUserArea');
    const profileInput = getEl('bindUserProfile');
    const submit = getEl('submitBindDevice');

    const usuarioNome = String(nameInput?.value || '').trim();
    const usuarioEmail = String(emailInput?.value || '').trim();
    const unidadeId = areaInput?.value || 'unidade_banco_sangue';
    const areaNome = areaInput?.dataset?.areaName || 'Banco IDvida';
    const usuarioPerfil = profileInput?.value || 'area';
    const areaIds = isWideProfile(usuarioPerfil) ? [] : readAreaIds(areaInput);

    if(!usuarioNome || !usuarioEmail){
      setFeedback('Preencha nome e e-mail do usuário.', 'error');
      return;
    }

    setFeedback('Gerando código de ativação...');
    resetResult();
    if(submit) submit.disabled = true;

    try {
      const response = await fetch(`${getApiBase()}/activation-code`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          cliente_id:'cliente_idvida',
          unidade_id:unidadeId,
          usuario_nome:usuarioNome,
          usuario_email:usuarioEmail,
          area_nome:isWideProfile(usuarioPerfil) ? '' : areaNome,
          area_ids:areaIds,
          usuario_perfil:usuarioPerfil,
          tipo_ativacao:'app_alerta',
          enviar_email:true
        })
      });
      const json = await response.json();
      if(!response.ok || !json.ok){
        throw new Error(json.message || 'Não foi possível gerar o código.');
      }
      showResult(json.data);
      setFeedback('Código pronto para vínculo do smartphone.');
    } catch(error) {
      setFeedback(error.message || 'Erro ao gerar código de ativação.', 'error');
    } finally {
      if(submit) submit.disabled = false;
    }
  }

  function updateBindDeviceVisibility(){
    const entry = getEl('bindDeviceEntry');
    if(entry) entry.hidden = !canBindDevice();
  }

  window.updateBindDeviceVisibility = updateBindDeviceVisibility;

  document.addEventListener('DOMContentLoaded', function(){
    getEl('openBindDeviceModal')?.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      openModal();
    });
    getEl('closeBindDeviceModal')?.addEventListener('click', closeModal);
    getEl('cancelBindDevice')?.addEventListener('click', closeModal);
    getEl('bindDeviceOverlay')?.addEventListener('click', function(event){
      if(event.target === event.currentTarget) closeModal();
    });
    getEl('bindDeviceForm')?.addEventListener('submit', submitForm);
    getEl('bindDeviceResult')?.addEventListener('click', async function(event){
      if(event.target?.id !== 'copyBindDeviceCode') return;
      const code = getEl('bindDeviceResult')?.querySelector('.bind-device-result-code')?.textContent || '';
      try {
        await navigator.clipboard.writeText(code);
        setFeedback('Código copiado.');
      } catch(e) {
        setFeedback('Não foi possível copiar automaticamente. Copie o código manualmente.', 'error');
      }
    });
    updateBindDeviceVisibility();
  });
})();

/* ===== SCRIPT BLOCK 37C | disable-linked-device-modal ===== */
(function(){
  const allowedRoles = new Set(['master', 'admin1', 'admin2']);
  const wideProfiles = new Set(['master', 'admin1', 'admin2']);

  function getEl(id){ return document.getElementById(id); }

  function escapeHtml(value){
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function canBindDevice(){
    return allowedRoles.has(String(window.currentRole || 'master').toLowerCase());
  }

  function getApiBase(){
    if(typeof window.getPanelApiBaseUrl === 'function'){
      return window.getPanelApiBaseUrl().replace(/\/+$/, '');
    }
    return 'http://localhost:4000';
  }

  function closeAreaMenu(){
    const menu = getEl('bindAreaMenu');
    const trigger = getEl('bindUserAreaButton');
    if(menu) menu.hidden = true;
    if(trigger) trigger.setAttribute('aria-expanded','false');
  }

  function closeProfileMenu(){
    const menu = getEl('bindProfileMenu');
    const trigger = getEl('bindUserProfileButton');
    if(menu) menu.hidden = true;
    if(trigger) trigger.setAttribute('aria-expanded','false');
  }

  function toggleAreaMenu(){
    const menu = getEl('bindAreaMenu');
    const trigger = getEl('bindUserAreaButton');
    if(!menu || !trigger) return;
    if(trigger.disabled) return;
    const open = menu.hidden;
    menu.hidden = !open;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function toggleProfileMenu(){
    const menu = getEl('bindProfileMenu');
    const trigger = getEl('bindUserProfileButton');
    if(!menu || !trigger) return;
    const open = menu.hidden;
    menu.hidden = !open;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function selectedAreaOptions(){
    return Array.from(document.querySelectorAll('#bindAreaMenu .bind-area-option.active'));
  }

  function updateAreaInputFromSelection(){
    const areaInput = getEl('bindUserArea');
    const label = getEl('bindUserAreaLabel');
    const selected = selectedAreaOptions();
    const areaOptions = selected.filter((option) => option?.dataset?.areaId !== 'all');
    const allSelected = selected.some((option) => option?.dataset?.areaId === 'all') || !areaOptions.length;
    const areaIds = allSelected ? ['all'] : areaOptions.map((option) => option.dataset.areaId || option.dataset.value).filter(Boolean);
    const areaName = allSelected
      ? 'Todas as áreas'
      : areaOptions.map((option) => option.dataset.areaName || option.textContent || '').filter(Boolean).join(', ');

    if(areaInput){
      areaInput.value = areaIds[0] === 'all' ? 'unidade_banco_sangue' : (areaIds[0] || 'unidade_banco_sangue');
      areaInput.dataset.areaName = areaName;
      areaInput.dataset.areaIds = JSON.stringify(areaIds);
    }
    if(label) label.textContent = allSelected
      ? 'Todas as áreas'
      : (areaOptions.length === 1 ? areaName : `${areaOptions.length} áreas selecionadas`);
  }

  function selectArea(option){
    const options = document.querySelectorAll('#bindAreaMenu .bind-area-option');
    const isAll = option?.dataset?.areaId === 'all';

    if(isAll){
      options.forEach(item => item.classList.toggle('active', item === option));
    } else {
      const allOption = getEl('bindAreaMenu')?.querySelector('[data-area-id="all"]');
      if(allOption) allOption.classList.remove('active');
      option.classList.toggle('active');

      const hasSpecific = Array.from(options)
        .some(item => item.dataset.areaId !== 'all' && item.classList.contains('active'));
      if(!hasSpecific && allOption) allOption.classList.add('active');
    }

    updateAreaInputFromSelection();
    if(isAll) closeAreaMenu();
  }

  function updateAreaPickerForProfile(profile){
    const isWide = wideProfiles.has(String(profile || '').toLowerCase());
    const picker = getEl('bindAreaPicker');
    const trigger = getEl('bindUserAreaButton');
    const label = getEl('bindUserAreaLabel');
    const areaInput = getEl('bindUserArea');
    const help = getEl('bindAreaHelp');

    if(picker) picker.classList.toggle('locked', isWide);
    if(trigger){
      trigger.disabled = isWide;
      trigger.setAttribute('aria-expanded','false');
    }
    closeAreaMenu();

    if(isWide){
      const profileLabel = profile === 'master' ? 'Todos os clientes' : 'Todas as áreas';
      if(label) label.textContent = profileLabel;
      if(areaInput){
        areaInput.value = 'unidade_banco_sangue';
        areaInput.dataset.areaName = profileLabel;
        areaInput.dataset.areaIds = '[]';
      }
      if(help) help.textContent = profile === 'master'
        ? 'Master acessa todos os clientes automaticamente.'
        : 'Admin 1 e Admin 2 acessam todas as áreas automaticamente.';
      return;
    }

    if(help) help.textContent = 'Para usuário comum, selecione todas as áreas ou uma ou mais áreas específicas.';
    updateAreaInputFromSelection();
  }

  function selectProfile(option){
    const profileInput = getEl('bindUserProfile');
    const label = getEl('bindUserProfileLabel');
    const options = document.querySelectorAll('#bindProfileMenu .bind-area-option');
    const profileName = option?.dataset?.profileName || option?.textContent || 'Usuário da área';
    if(profileInput){
      profileInput.value = option?.dataset?.profile || 'area';
      profileInput.dataset.profileName = profileName;
    }
    if(label) label.textContent = profileName;
    options.forEach(item => item.classList.toggle('active', item === option));
    updateAreaPickerForProfile(profileInput?.value || 'area');
    closeProfileMenu();
  }

  function setDisableFeedback(message, type){
    const feedback = getEl('disableDeviceFeedback');
    if(!feedback) return;
    feedback.textContent = message || '';
    feedback.classList.toggle('show', !!message);
    feedback.classList.toggle('error', type === 'error');
  }

  function resetDisableResults(){
    const results = getEl('disableDeviceResults');
    if(results) results.innerHTML = '';
  }

  function closeBindModal(){
    getEl('bindDeviceOverlay')?.classList.remove('show');
    closeAreaMenu();
    closeProfileMenu();
  }

  function openDisableModal(){
    if(!canBindDevice()) return;
    closeBindModal();
    setDisableFeedback('');
    resetDisableResults();
    const input = getEl('disableDeviceSearch');
    if(input) input.value = '';
    getEl('disableDeviceOverlay')?.classList.add('show');
    setTimeout(() => input?.focus(), 40);
  }

  function closeDisableModal(){
    getEl('disableDeviceOverlay')?.classList.remove('show');
  }

  function renderDisableResults(rows){
    const results = getEl('disableDeviceResults');
    if(!results) return;
    if(!rows || !rows.length){
      results.innerHTML = '<div class="disable-device-empty">Nenhum dispositivo vinculado ativo encontrado para essa busca.</div>';
      return;
    }

    results.innerHTML = rows.map(row => `
      <div class="disable-device-card" data-app-device-id="${escapeHtml(row.id)}">
        <div class="disable-device-card-top">
          <div>
            <div class="disable-device-name">${escapeHtml(row.usuario_nome || 'Usuário sem nome')}</div>
            <div class="disable-device-meta">${escapeHtml(row.usuario_email || 'E-mail não informado')}</div>
            <div class="disable-device-meta">${escapeHtml(row.cliente_nome || 'Cliente')} · ${escapeHtml(row.area_nome || row.unidade_nome || 'Área vinculada')}</div>
            <div class="disable-device-code">${escapeHtml(row.codigo_ativacao || 'Sem código')}</div>
          </div>
          <button class="disable-device-action" type="button" data-disable-device-id="${escapeHtml(row.id)}">Desabilitar</button>
        </div>
      </div>
    `).join('');
  }

  async function searchDisableDevice(event){
    event.preventDefault();
    if(!canBindDevice()) return;

    const input = getEl('disableDeviceSearch');
    const submit = getEl('submitDisableSearch');
    const query = String(input?.value || '').trim();
    if(query.length < 2){
      setDisableFeedback('Digite pelo menos 2 caracteres para pesquisar.', 'error');
      resetDisableResults();
      return;
    }

    setDisableFeedback('Pesquisando dispositivo vinculado...');
    resetDisableResults();
    if(submit) submit.disabled = true;

    try {
      const response = await fetch(`${getApiBase()}/app-devices/search?q=${encodeURIComponent(query)}`, { cache:'no-store' });
      const json = await response.json();
      if(!response.ok || !json.ok){
        throw new Error(json.message || 'Não foi possível pesquisar.');
      }
      renderDisableResults(json.data || []);
      setDisableFeedback((json.data || []).length ? 'Selecione o vínculo que deseja desabilitar.' : '');
    } catch(error) {
      setDisableFeedback(error.message || 'Erro ao pesquisar dispositivo vinculado.', 'error');
    } finally {
      if(submit) submit.disabled = false;
    }
  }

  async function deactivateLinkedDevice(id, button){
    if(!id || !canBindDevice()) return;
    const card = button?.closest?.('.disable-device-card');
    const name = card?.querySelector?.('.disable-device-name')?.textContent || 'este usuário';
    const confirmed = window.confirm(`Desabilitar o acesso de ${name}? O app deixará de receber alertas e o código não poderá ser reutilizado.`);
    if(!confirmed) return;

    setDisableFeedback('Desabilitando vínculo...');
    if(button) button.disabled = true;

    try {
      const response = await fetch(`${getApiBase()}/app-devices/${encodeURIComponent(id)}/deactivate`, { method:'POST' });
      const json = await response.json();
      if(!response.ok || !json.ok){
        throw new Error(json.message || 'Não foi possível desabilitar o vínculo.');
      }
      if(card) card.remove();
      if(!getEl('disableDeviceResults')?.querySelector('.disable-device-card')){
        resetDisableResults();
      }
      setDisableFeedback('Dispositivo vinculado desabilitado.');
    } catch(error) {
      if(button) button.disabled = false;
      setDisableFeedback(error.message || 'Erro ao desabilitar dispositivo vinculado.', 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    getEl('bindUserAreaButton')?.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      toggleAreaMenu();
    });
    getEl('bindAreaMenu')?.addEventListener('click', function(event){
      const option = event.target?.closest?.('.bind-area-option');
      if(!option) return;
      event.preventDefault();
      event.stopPropagation();
      selectArea(option);
    });
    getEl('bindUserProfileButton')?.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      toggleProfileMenu();
    });
    getEl('bindProfileMenu')?.addEventListener('click', function(event){
      const option = event.target?.closest?.('.bind-area-option');
      if(!option) return;
      event.preventDefault();
      event.stopPropagation();
      selectProfile(option);
    });
    getEl('openDisableDeviceModal')?.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      openDisableModal();
    });
    getEl('closeDisableDeviceModal')?.addEventListener('click', closeDisableModal);
    getEl('cancelDisableDevice')?.addEventListener('click', closeDisableModal);
    getEl('disableDeviceOverlay')?.addEventListener('click', function(event){
      if(event.target === event.currentTarget) closeDisableModal();
    });
    getEl('disableDeviceForm')?.addEventListener('submit', searchDisableDevice);
    getEl('disableDeviceResults')?.addEventListener('click', function(event){
      const button = event.target?.closest?.('[data-disable-device-id]');
      if(!button) return;
      deactivateLinkedDevice(button.dataset.disableDeviceId, button);
    });
    updateAreaPickerForProfile(getEl('bindUserProfile')?.value || 'area');
    document.addEventListener('click', function(){
      closeAreaMenu();
      closeProfileMenu();
    });
  });
})();

/* ===== SCRIPT BLOCK 38 | v22-device-search-script ===== */
(function(){
  let searchDeviceId = null;

  function getDevicesList(){
    if (typeof devices !== 'undefined' && Array.isArray(devices)) return devices;
    if (Array.isArray(window.devices)) return window.devices;
    return [];
  }

  function normalize(v){
    return String(v || '').toLowerCase().trim();
  }

  function findDevice(query){
    const q = normalize(query);
    if(!q) return null;
    const list = getDevicesList();

    // exact id first
    let found = list.find(d => String(d.id) === q);
    if(found) return found;

    // exact name
    found = list.find(d => normalize(d.name) === q);
    if(found) return found;

    // alias "geladeira X"
    found = list.find(d => normalize(`geladeira ${d.id}`) === q);
    if(found) return found;

    // partial matches
    found = list.find(d => {
      const name = normalize(d.name);
      const code = normalize(d.code || d.codigo || d.deviceCode || '');
      const mac = normalize(d.mac || d.macAddress || d.address || '');
      return name.includes(q) || code.includes(q) || mac.includes(q) || normalize(`geladeira ${d.id}`).includes(q);
    });
    return found || null;
  }

  function closePop(){
    const pop = document.getElementById('deviceSearchPop');
    if(pop) pop.classList.remove('show');
  }

  function executeSearch(){
    const input = document.getElementById('deviceSearchInput');
    if(!input) return;
    const found = findDevice(input.value);
    if(!found){
      alert('Dispositivo não encontrado.');
      return;
    }

    // limpa filtros visuais e fixa apenas o card encontrado
    if(typeof window.activeFilter !== 'undefined') window.activeFilter = null;
    if(typeof window.nocFilteredIds !== 'undefined') window.nocFilteredIds = null;
    searchDeviceId = found.id;

    if(typeof window.renderGrid === 'function') window.renderGrid();

    setTimeout(() => {
      const card = document.querySelector(`.card[data-id="${found.id}"]`);
      if(card){
        card.scrollIntoView({behavior:'smooth', block:'center'});
      }
      if(typeof window.openDetail === 'function') window.openDetail(found.id, true);
    }, 120);

    closePop();
  }

  function initDeviceSearch(){
    const wrap = document.getElementById('filterAllBtn');
    const btn = document.getElementById('deviceSearchBtn');
    const pop = document.getElementById('deviceSearchPop');
    const input = document.getElementById('deviceSearchInput');
    const run = document.getElementById('deviceSearchRun');
    if(!wrap || !btn || !pop || !input || !run) return;

    btn.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      pop.classList.toggle('show');
      if(pop.classList.contains('show')){
        setTimeout(() => input.focus(), 20);
      }
    };

    btn.onkeydown = function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        btn.click();
      }
    };

    input.onkeydown = function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        executeSearch();
      } else if(e.key === 'Escape'){
        closePop();
      }
    };

    run.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      executeSearch();
    };

    document.addEventListener('click', function(e){
      if(!wrap.contains(e.target) && !pop.contains(e.target)){
        closePop();
      }
    });

    pop.onclick = function(e){ e.stopPropagation(); };

    // clicar em Dispositivos volta a exibir todos
    wrap.addEventListener('click', function(e){
      const searchBtn = document.getElementById('deviceSearchBtn');
      const popNow = document.getElementById('deviceSearchPop');
      if(searchBtn && searchBtn.contains(e.target)) return;
      if(popNow && popNow.contains(e.target)) return;
      searchDeviceId = null;
      if(typeof window.renderGrid === 'function') window.renderGrid();
    }, true);
  }

  // intercepta renderGrid para mostrar somente o dispositivo pesquisado
  const originalRenderGridForSearch = window.renderGrid;
  window.renderGrid = function(){
    if(typeof originalRenderGridForSearch === 'function') originalRenderGridForSearch();

    if(searchDeviceId != null){
      document.querySelectorAll('.grid .card[data-id]').forEach(card => {
        card.style.display = (String(card.dataset.id) === String(searchDeviceId)) ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.grid .card[data-id]').forEach(card => {
        card.style.display = '';
      });
    }
  };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initDeviceSearch);
  } else {
    initDeviceSearch();
  }
})();

/* ===== SCRIPT BLOCK 39 | daltonico-ajuste-fino-js ===== */
(function(){
  function ensureGraphPatterns(){
    document.querySelectorAll('.graph-wrap svg').forEach(svg=>{
      let defs = svg.querySelector('defs');
      if(!defs){
        defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
        svg.insertBefore(defs, svg.firstChild);
      }
      if(!svg.querySelector('#cbWarnPattern')){
        const p = document.createElementNS('http://www.w3.org/2000/svg','pattern');
        p.setAttribute('id','cbWarnPattern');
        p.setAttribute('patternUnits','userSpaceOnUse');
        p.setAttribute('width','8'); p.setAttribute('height','8');
        p.setAttribute('patternTransform','rotate(45)');
        const r1 = document.createElementNS('http://www.w3.org/2000/svg','rect');
        r1.setAttribute('width','8'); r1.setAttribute('height','8'); r1.setAttribute('fill','#fff4cc');
        const r2 = document.createElementNS('http://www.w3.org/2000/svg','rect');
        r2.setAttribute('width','4'); r2.setAttribute('height','8'); r2.setAttribute('fill','#e69f00');
        p.appendChild(r1); p.appendChild(r2); defs.appendChild(p);
      }
      if(!svg.querySelector('#cbCritPattern')){
        const p = document.createElementNS('http://www.w3.org/2000/svg','pattern');
        p.setAttribute('id','cbCritPattern');
        p.setAttribute('patternUnits','userSpaceOnUse');
        p.setAttribute('width','8'); p.setAttribute('height','8');
        p.setAttribute('patternTransform','rotate(45)');
        const r1 = document.createElementNS('http://www.w3.org/2000/svg','rect');
        r1.setAttribute('width','8'); r1.setAttribute('height','8'); r1.setAttribute('fill','#f8d5c2');
        const r2 = document.createElementNS('http://www.w3.org/2000/svg','rect');
        r2.setAttribute('width','4'); r2.setAttribute('height','8'); r2.setAttribute('fill','#d55e00');
        p.appendChild(r1); p.appendChild(r2); defs.appendChild(p);
      }
    });
  }

  function applyNocTextPills(){
    if(!document.body.classList.contains('acc-colorblind')) return;
    document.querySelectorAll('.noc-alert').forEach(el=>{
      const txt = (el.textContent || '').toLowerCase();
      if(txt.includes('próximo do limite')) el.classList.add('noc-alert-warn');
      if(txt.includes('fora do limite') || txt.includes('fora da temperatura')) el.classList.add('noc-alert-crit');
      if(txt.includes('sem comunicação')) el.classList.add('noc-alert-offline');
    });
  }

  function run(){
    ensureGraphPatterns();
    applyNocTextPills();
  }

  document.addEventListener('DOMContentLoaded', run);
  const oldApplyAccessibility = window.applyAccessibility;
  if(typeof oldApplyAccessibility === 'function'){
    window.applyAccessibility = function(){
      oldApplyAccessibility.apply(this, arguments);
      setTimeout(run, 50);
    };
  } else {
      setTimeout(run, 50);
  }
})();

/* ===== SCRIPT BLOCK 40 | noc-fullscreen-helper ===== */
window.abrirNocEmTelaCheia = function(){
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen();
};

/* ===== SCRIPT BLOCK 41 | noc-fullscreen-auto ===== */
function abrirNocEmTelaCheia(){
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if (el.msRequestFullscreen) el.msRequestFullscreen();
}

// Hook automático no botão NOC
document.addEventListener("DOMContentLoaded", function(){
  const btns = Array.from(document.querySelectorAll("button, .btn, .chip, .menu-item"));
  btns.forEach(btn=>{
    if(btn.textContent && btn.textContent.toLowerCase().includes("noc")){
      btn.addEventListener("click", abrirNocEmTelaCheia);
    }
  });
});

// Se sair do fullscreen, fecha overlay do NOC
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    const noc = document.querySelector('.noc-live-overlay');
    if(noc) noc.classList.remove('active');
  }
});

/* ===== SCRIPT BLOCK 42 | noc-clean-single-source-js ===== */
(function(){
  function ensureSingleViewport(){
    const overlay = document.getElementById('nocLiveOverlay') || document.querySelector('.noc-live-overlay');
    const grid = document.getElementById('nocLiveGrid') || document.querySelector('.noc-live-grid');
    if(!overlay || !grid) return;

    // remove any old parallel helpers every time
    overlay.querySelectorAll('.noc-scrollbar, .noc-vscroll, .noc-scroll-area').forEach(el => el.remove());

    let viewport = overlay.querySelector('.noc-scroll-viewport');
    if(!viewport){
      viewport = document.createElement('div');
      viewport.className = 'noc-scroll-viewport';
      grid.parentNode.insertBefore(viewport, grid);
    }

    if(grid.parentElement !== viewport){
      viewport.appendChild(grid);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureSingleViewport();
    setTimeout(ensureSingleViewport, 50);
    setTimeout(ensureSingleViewport, 200);
    setTimeout(ensureSingleViewport, 500);
  });

  window.addEventListener('resize', ensureSingleViewport);
})();

/* ===== SCRIPT BLOCK 43 | noc-body-scroll-guard ===== */
(function(){
  const overlay = document.getElementById('nocLiveOverlay') || document.querySelector('.noc-live-overlay');
  if(!overlay) return;

  const syncNocOpenState = () => {
    const visible = overlay.classList.contains('show') || overlay.classList.contains('active') || overlay.style.display === 'block';
    document.body.classList.toggle('noc-open', visible);
  };

  const observer = new MutationObserver(syncNocOpenState);
  observer.observe(overlay, { attributes:true, attributeFilter:['class','style'] });
  syncNocOpenState();
})();

/* ===== SCRIPT BLOCK 44 | cart-tracking-test-view ===== */
if(false){(function(){
  const STORAGE_KEY = 'idsensor.cartTracking.v1';
  const ROOM_STATUSES = {
    in_room: 'Na sala',
    near: 'Carrinho proximo',
    transit: 'Em trânsito',
    offline: 'Offline'
  };

  const defaultState = {
    rooms: [
      {
        id: 'sala-bloco-b1',
        name: 'SALA BLOCO B1',
        gatewayDeviceId: '8ec5',
        expectedTotal: 16
      }
    ],
    carts: []
  };

  let previousSubtitle = '';

  function clone(value){
    return JSON.parse(JSON.stringify(value));
  }

  function readState(){
    try{
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(saved && Array.isArray(saved.rooms) && Array.isArray(saved.carts)){
        return saved;
      }
    }catch(err){
      console.warn('Falha ao ler cadastro de carrinhos', err);
    }
    return clone(defaultState);
  }

  function saveState(state){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function slugify(value){
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `area-${Date.now()}`;
  }

  function cleanMac(value){
    return String(value || '').toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 12);
  }

  function formatMac(value){
    const compact = cleanMac(value);
    return compact.match(/.{1,2}/g)?.join(':') || '';
  }

  function statusForCart(cart){
    const fill = cartVisualFill(cart);
    const criticalReads = Number(cart.consecutiveCriticalReadings || 0);

    if(cart.locationStatus === 'offline'){
      return { key:'offline', label:'Offline', tone:'offline' };
    }
    if(fill >= 90 && criticalReads >= 3){
      return { key:'critical_confirmed', label:'Crítico confirmado', tone:'critical' };
    }
    if(fill >= 90){
      return { key:'critical_pending', label:`Crítico ${criticalReads}/3`, tone:'warning' };
    }
    if(fill >= 75){
      return { key:'attention', label:'Atenção', tone:'attention' };
    }
    return { key:'normal', label:'Normal', tone:'normal' };
  }

  function roomCounters(room, carts){
    const roomCarts = carts.filter(cart => cart.roomId === room.id);
    return {
      inRoom: roomCarts.filter(cart => cart.locationStatus === 'in_room').length,
      near: roomCarts.filter(cart => cart.locationStatus === 'near').length,
      transit: roomCarts.filter(cart => cart.locationStatus === 'transit').length,
      critical: roomCarts.filter(cart => statusForCart(cart).tone === 'critical').length
    };
  }

  function roomHasCritical(room, carts){
    return carts.some(cart => cart.roomId === room.id && statusForCart(cart).tone === 'critical');
  }

  function ensureCartTrackingUi(){
    if(document.getElementById('cartTrackingView')) return;

    const view = document.createElement('section');
    view.className = 'cart-tracking-view';
    view.id = 'cartTrackingView';
    view.hidden = true;
    view.innerHTML = `
      <div class="cart-tracking-head">
        <div>
          <p class="cart-tracking-kicker">Teste de rastreamento</p>
          <h1>Salas e carrinhos</h1>
          <span>Gateway BLE fixo por sala, sensor MAC no carrinho.</span>
        </div>
        <button type="button" class="cart-secondary-btn" id="cartBackBtn">Voltar ao painel</button>
      </div>

      <div class="cart-config-panel">
        <div class="cart-config-section">
          <strong>Area e gateway</strong>
          <label>
            Area
            <select id="cartRoomSelect"></select>
          </label>
          <label>
            Nome da area
            <input id="cartRoomName" type="text" placeholder="SALA BLOCO B1">
          </label>
          <label>
            Device ID do gateway
            <input id="cartGatewayDeviceId" type="text" placeholder="8ec5">
          </label>
          <label>
            Total de carrinhos
            <input id="cartRoomTotal" type="number" min="0" step="1" placeholder="16">
          </label>
          <button type="button" class="cart-primary-btn" id="cartSaveRoomBtn">Salvar area</button>
        </div>

        <div class="cart-config-section">
          <strong>Sensor no carrinho</strong>
          <label>
            Nome do carrinho
            <input id="cartNameInput" type="text" placeholder="Carrinho 01">
          </label>
          <label>
            MAC do sensor
            <input id="cartMacInput" type="text" placeholder="DE:08:DB:F4:73:11">
          </label>
          <label>
            Status inicial
            <select id="cartStatusInput">
              <option value="in_room">Na sala</option>
              <option value="near">Carrinho proximo</option>
              <option value="transit">Em trânsito</option>
              <option value="offline">Offline</option>
            </select>
          </label>
          <button type="button" class="cart-primary-btn" id="cartAddSensorBtn">Cadastrar sensor</button>
        </div>
      </div>

      <div class="cart-room-grid" id="cartRoomGrid"></div>
    `;

    const layoutNode = document.getElementById('layout') || document.querySelector('.layout');
    const toolbarNode = document.querySelector('.toolbar-filters') || document.querySelector('.toolbar');
    const appNode = document.querySelector('.app') || layoutNode?.parentNode || toolbarNode?.parentNode || document.body;
    const anchorNode = layoutNode || toolbarNode || null;
    if(anchorNode && anchorNode.parentNode === appNode){
      appNode.insertBefore(view, anchorNode);
    }else{
      appNode.appendChild(view);
    }

    document.getElementById('cartBackBtn')?.addEventListener('click', closeCartTrackingView);
    document.getElementById('cartSaveRoomBtn')?.addEventListener('click', saveRoomFromForm);
    document.getElementById('cartAddSensorBtn')?.addEventListener('click', addCartFromForm);
    document.getElementById('cartRoomSelect')?.addEventListener('change', syncRoomFormFromSelect);
    document.getElementById('cartRoomGrid')?.addEventListener('click', handleRoomGridClick);

    renderCartTracking();
  }

  function setRoomOptions(state){
    const select = document.getElementById('cartRoomSelect');
    if(!select) return;
    const selected = select.value || state.rooms[0]?.id || '';
    select.innerHTML = [
      ...state.rooms.map(room => `<option value="${room.id}">${room.name}</option>`),
      '<option value="__new__">+ Nova area</option>'
    ].join('');
    select.value = state.rooms.some(room => room.id === selected) ? selected : (state.rooms[0]?.id || '');
  }

  function syncRoomFormFromSelect(){
    const state = readState();
    const selectedId = document.getElementById('cartRoomSelect')?.value;
    if(selectedId === '__new__'){
      document.getElementById('cartRoomName').value = '';
      document.getElementById('cartGatewayDeviceId').value = '';
      document.getElementById('cartRoomTotal').value = 0;
      return;
    }
    const room = state.rooms.find(item => item.id === selectedId) || state.rooms[0];
    if(!room) return;
    document.getElementById('cartRoomName').value = room.name || '';
    document.getElementById('cartGatewayDeviceId').value = room.gatewayDeviceId || '';
    document.getElementById('cartRoomTotal').value = Number(room.expectedTotal || 0);
  }

  function saveRoomFromForm(){
    const state = readState();
    const selectedId = document.getElementById('cartRoomSelect')?.value;
    const name = document.getElementById('cartRoomName')?.value.trim();
    const gatewayDeviceId = document.getElementById('cartGatewayDeviceId')?.value.trim();
    const expectedTotal = Math.max(0, Number(document.getElementById('cartRoomTotal')?.value || 0));
    if(!name){
      alert('Informe o nome da area.');
      return;
    }

    let room = selectedId === '__new__' ? null : state.rooms.find(item => item.id === selectedId);
    if(!room){
      let newId = slugify(name);
      if(state.rooms.some(item => item.id === newId)){
        newId = `${newId}-${Date.now()}`;
      }
      room = { id: newId, name, gatewayDeviceId: '', expectedTotal: 0 };
      state.rooms.push(room);
    }

    room.name = name.toUpperCase();
    room.gatewayDeviceId = gatewayDeviceId;
    room.expectedTotal = expectedTotal;
    saveState(state);
    renderCartTracking(room.id);
  }

  function addCartFromForm(){
    const state = readState();
    const roomId = document.getElementById('cartRoomSelect')?.value || state.rooms[0]?.id;
    const name = document.getElementById('cartNameInput')?.value.trim();
    const mac = formatMac(document.getElementById('cartMacInput')?.value);
    const status = document.getElementById('cartStatusInput')?.value || 'in_room';

    if(roomId === '__new__'){
      alert('Salve a area antes de cadastrar o sensor.');
      return;
    }

    if(!name || !mac || cleanMac(mac).length !== 12){
      alert('Informe nome do carrinho e MAC completo do sensor.');
      return;
    }

    const existing = state.carts.find(cart => cleanMac(cart.mac) === cleanMac(mac));
    if(existing){
      existing.name = name;
      existing.mac = mac;
      existing.roomId = roomId;
      existing.locationStatus = status;
      existing.lastSeen = 'agora';
    }else{
      state.carts.push({
        id: `cart-${cleanMac(mac).toLowerCase()}`,
        name,
        mac,
        roomId,
        locationStatus: status,
        fillPercentage: 0,
        consecutiveCriticalReadings: 0,
        rssi: null,
        lastSeen: 'cadastro manual'
      });
    }

    saveState(state);
    document.getElementById('cartNameInput').value = '';
    document.getElementById('cartMacInput').value = '';
    renderCartTracking(roomId);
  }

  function handleRoomGridClick(event){
    const addRoomId = event.target.closest('[data-cart-add-room]')?.getAttribute('data-cart-add-room');
    const editRoomId = event.target.closest('[data-cart-edit-room]')?.getAttribute('data-cart-edit-room');
    if(!addRoomId && !editRoomId) return;

    const select = document.getElementById('cartRoomSelect');
    if(select){
      select.value = addRoomId || editRoomId;
      syncRoomFormFromSelect();
    }

    if(addRoomId){
      document.getElementById('cartNameInput')?.focus();
    }else{
      document.getElementById('cartGatewayDeviceId')?.focus();
    }
  }

  function renderCartRows(room, carts){
    const roomCarts = carts.filter(cart => cart.roomId === room.id);
    if(!roomCarts.length){
      return `<div class="cart-empty-row">Nenhum sensor cadastrado nesta sala.</div>`;
    }

    return roomCarts.map(cart => {
      const fill = Math.max(0, Math.min(100, Number(cart.fillPercentage || 0)));
      const status = statusForCart(cart);
      const locationLabel = ROOM_STATUSES[cart.locationStatus] || ROOM_STATUSES.in_room;
      const rssi = cart.rssi === null || cart.rssi === undefined ? '--' : `${cart.rssi} dBm`;
      return `
        <div class="cart-row">
          <div class="cart-row-main">
            <strong>${cart.name}</strong>
            <span>${cart.mac}</span>
          </div>
          <div class="cart-row-meta">
            <span class="cart-pill ${cart.locationStatus}">${locationLabel}</span>
            <span class="cart-pill ${status.tone}">${status.label}</span>
          </div>
          <div class="cart-fill-track" aria-label="Nivel ${fill}%">
            <span style="width:${fill}%"></span>
          </div>
          <div class="cart-row-foot">
            <span>${fill}% cheio</span>
            <span>RSSI ${rssi}</span>
            <span>${cart.lastSeen || 'sem leitura'}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderCartTracking(preferredRoomId){
    const state = readState();
    setRoomOptions(state);
    if(preferredRoomId){
      const select = document.getElementById('cartRoomSelect');
      if(select && state.rooms.some(room => room.id === preferredRoomId)) select.value = preferredRoomId;
    }
    syncRoomFormFromSelect();

    const grid = document.getElementById('cartRoomGrid');
    if(!grid) return;

    grid.innerHTML = state.rooms.map(room => {
      const counters = roomCounters(room, state.carts);
      const isCritical = roomHasCritical(room, state.carts);
      return `
        <article class="cart-room-card ${isCritical ? 'critical' : ''}">
          <div class="cart-room-title">
            <div>
              <h2>${room.name}</h2>
              <span>Gateway: ${room.gatewayDeviceId || 'não vinculado'}</span>
            </div>
            <strong>${Number(room.expectedTotal || 0)}</strong>
          </div>
          <div class="cart-room-total">Total de carrinhos</div>
          <div class="cart-room-stats">
            <span><b>${counters.inRoom}</b> Na sala</span>
            <span><b>${counters.near}</b> Proximos</span>
            <span><b>${counters.transit}</b> Transito</span>
            <span><b>${counters.critical}</b> Críticos</span>
          </div>
          <div class="cart-room-list">
            ${renderCartRows(room, state.carts)}
          </div>
          <div class="cart-room-actions">
            <button type="button" data-cart-edit-room="${room.id}">Vincular gateway</button>
            <button type="button" data-cart-add-room="${room.id}">Cadastrar sensor</button>
          </div>
        </article>
      `;
    }).join('');
  }

  function openCartTrackingView(){
    window.__pendingCartTrackingOpen = false;
    ensureCartTrackingUi();
    const view = document.getElementById('cartTrackingView');
    if(!view) return;
    const subtitle = document.getElementById('pageSubtitle');
    previousSubtitle = subtitle?.textContent || previousSubtitle;
    if(subtitle) subtitle.textContent = 'Carrinhos por sala';
    view.hidden = false;
    view.style.display = '';
    document.body.classList.add('cart-tracking-open');
    renderCartTracking();
  }

  function closeCartTrackingView(){
    const view = document.getElementById('cartTrackingView');
    const subtitle = document.getElementById('pageSubtitle');
    if(subtitle && previousSubtitle) subtitle.textContent = previousSubtitle;
    if(view) view.hidden = true;
    document.body.classList.remove('cart-tracking-open');
  }

  document.addEventListener('DOMContentLoaded', ensureCartTrackingUi);
  window.openCartTrackingView = openCartTrackingView;
  window.closeCartTrackingView = closeCartTrackingView;
})();}

/* ===== SCRIPT BLOCK 45 | cart-tracking-room-cards-redesign ===== */
(function(){
  const STORAGE_KEY = 'idsensor.cartTracking.v9';
  const CART_ROUTE_KEY = 'idsensor.cartTracking.activeRoute.v1';
  const ROOM_SWITCH_RSSI_MIN = -70;
  const ROOM_SWITCH_CONFIRM_READINGS = 2;
  const ROOM_READING_RECENT_MS = 30 * 60 * 1000;
  const CART_EXCHANGE_CONFIRM_READINGS = 2;
  const CART_EXCHANGE_OLD_SILENCE_MS = 4 * 60 * 1000;
  const CHART_EXCHANGE_MIN_RETURN_MS = 30 * 60 * 1000;
  const CART_LOST_AFTER_MS = 24 * 60 * 60 * 1000;
  const CART_TRANSIT_FLOW_ENABLED = false;
  const OBSOLETE_CART_IDS = new Set(['cart-flat-03']);
  const OBSOLETE_CART_MACS = new Set(['AABBCC000003']);
  const RESIDUE_ROOM_ID = 'sala-residuos';
  const HYGIENE_ROOM_ID = 'sala-higienizacao';
  const PILOT_ROOM_ID = 'sala-bloco-b1';
  const PILOT_GATEWAY_ID = 'e6a69dbb6d2d';
  const PILOT_CART_MACS = new Set(['DE08DBF47311', 'C4894994A485']);
  const SPECIAL_ROOM_IDS = new Set([RESIDUE_ROOM_ID, HYGIENE_ROOM_ID]);
  const DEFAULT_CART_CALIBRATION = {
    emptyDistanceMm:720,
    fullDistanceMm:140,
    redPercent:50,
    openMarginPercent:30,
    openMarginMinMm:250,
    confirmationReadings:2,
    lidDetectionEnabled:false,
    samples:[]
  };
  const CART_CRITICAL_PERCENT_CHOICES = [25, 50, 75, 100];
  const CALIBRATION_SAMPLE_COUNT = 2;
  const CALIBRATION_SAMPLE_DELAY_MS = 1200;
  const CALIBRATION_FRESH_POLL_MS = 5000;
  const CALIBRATION_STABILITY_MIN_MM = 50;
  const CALIBRATION_STABILITY_PERCENT = 8;
  const INVALID_SENSOR_DISTANCE_MM = 60000;
  const CART_EMPTY_DEADBAND_MM = 50;
  const CART_EMPTY_DEADBAND_PERCENT = 8;
  const CART_STABLE_EMPTY_PERCENT = 10;
  const CART_SUSPICIOUS_JUMP_PERCENT = 75;
  const CART_CRITICAL_PERCENT = 90;
  const CART_READING_POLL_MS = 5000;
  const CART_CRITICAL_FIRST_ALERT_MS = 10 * 60 * 1000;
  const CART_ALERT_RECURRENCE_MS = 30 * 60 * 1000;
  const CART_ALERT_LIMIT = 80;
  const GATEWAY_ONLINE_GRACE_MS = 60 * 60 * 1000;
  const GATEWAY_STALE_GRACE_MS = 6 * 60 * 60 * 1000;
  const DEFAULT_CART_ALERT_SETTINGS = {
    popupEnabled:true,
    soundEnabled:true,
    recurrenceMinutes:30,
    enabledTypes:{
      critical:true,
      recurrence:true,
    }
  };
  const CART_ALERT_TYPE_OPTIONS = [
    { id:'critical', label:'Crítico', detail:'Carrinho atingiu o limite crítico.' },
    { id:'recurrence', label:'Recorrência crítica', detail:'Carrinho segue crítico após o intervalo.' },
  ];
  const OBSOLETE_ROOM_IDS = new Set(['sala-bloco-a']);

  function rememberCartTrackingRoute(active){
    try {
      if(active) localStorage.setItem(CART_ROUTE_KEY, '1');
      else localStorage.removeItem(CART_ROUTE_KEY);
    } catch(e) {}
  }

  const defaultState = {
    rooms: [
      { id:'sala-bloco-b1', name:'SALA BLOCO B1', gatewayDeviceId:PILOT_GATEWAY_ID },
      { id:'sala-residuos', name:'SALA DE RESÍDUOS', gatewayDeviceId:'' },
      { id:'sala-higienizacao', name:'SALA DE HIGIENIZAÇÃO', gatewayDeviceId:'' }
    ],
    carts: [],
    telemetryEvents:[],
    backendChartSamples:[],
    alerts:[],
    alertSettings:clone(DEFAULT_CART_ALERT_SETTINGS)
  };

  let previousSubtitle = '';
  let previousTitle = '';
  let activeCartFilter = 'all';
  let activeRoomFilter = '';
  let cartSearchTerm = '';
  let cartSettingsView = 'home';
  let cartPanelClients = [];
  let cartPanelUsers = [];
  let cartPanelClientsLoaded = false;
  let cartPanelUsersClientId = '';
  let cartPanelSettingsLoading = false;
  let panelUsersView = 'clients';
  let cartAlertModalView = 'list';
  let lastGeneratedCartAlertId = '';
  let cartBackendOperationalActive = false;
  let cartGatewayStatus = null;
  let cartConfigBackendLoaded = false;
  let cartConfigBackendLoadPromise = null;
  let cartConfigSaving = false;
  let cartConfigSaveTimer = null;
  const CART_SETTINGS_PARENT_VIEW = {
    rooms:'home',
    devices:'home',
    gateways:'devices',
    sensors:'devices',
    users:'home',
    clientUsers:'users'
  };

  function isEinsteinCartSessionActive(){
    const body = document.body;
    const loginShell = document.getElementById('loginShell');
    const loginVisible = Boolean(loginShell && loginShell.hidden !== true);
    const session = window.activePanelSession || {};
    const authRole = String(body?.dataset?.authRole || session.role || '').toLowerCase();
    const panelRole = String(body?.dataset?.panelRole || window.currentRole || '').toLowerCase();
    const ready = Boolean(
      body?.classList.contains('auth-ready') &&
      !body.classList.contains('auth-pending') &&
      !loginVisible
    );
    const identityText = [
      session.displayName,
      session.display_name,
      session.organization,
      session.clienteNome,
      session.clientName,
      document.getElementById('currentUserLabel')?.textContent,
      document.getElementById('pageSubtitle')?.textContent,
      typeof selectedClient !== 'undefined' ? selectedClient : ''
    ].join(' ').toLowerCase();

    return Boolean(
      ready &&
      (authRole === 'cart' || authRole === 'master') &&
      panelRole === 'cart' &&
      identityText.includes('einstein')
    );
  }

  function isEinsteinCartAlertContext(){
    const cartView = document.getElementById('cartTrackingView');
    const cartOpen = Boolean(
      document.body?.classList.contains('cart-tracking-open') &&
      cartView &&
      cartView.hidden !== true
    );
    const title = (document.querySelector('.brand .title')?.textContent || '').toLowerCase();
    const subtitle = (document.getElementById('pageSubtitle')?.textContent || '').toLowerCase();
    const cartPanelText = `${title} ${subtitle}`;
    const isCartPanel = (
      cartPanelText.includes('c.r') ||
      cartPanelText.includes('carrinho') ||
      cartPanelText.includes('residuo') ||
      cartPanelText.includes('resíduo')
    );
    return Boolean(isEinsteinCartSessionActive() && cartOpen && isCartPanel);
  }

  function hideCartAlertsOutsideContext(){
    const stableOverlay = document.getElementById('cartAlertStableOverlay');
    if(stableOverlay){
      stableOverlay.hidden = true;
      stableOverlay.dataset.alertId = '';
    }
    const legacyOverlay = document.getElementById('cartAlertModalOverlay');
    if(legacyOverlay){
      legacyOverlay.hidden = true;
      legacyOverlay.dataset.alertId = '';
    }
    document.querySelectorAll('[data-cart-alerts-modal] b').forEach(badge => badge.remove());
  }

  function resetCartTrackingBackendConfigCache(){
    cartConfigBackendLoaded = false;
  }

  window.isEinsteinCartAlertContext = isEinsteinCartAlertContext;
  window.hideCartAlertsOutsideContext = hideCartAlertsOutsideContext;
  window.resetCartTrackingBackendConfigCache = resetCartTrackingBackendConfigCache;

  function clone(value){
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeCartAlertSettings(settings){
    const source = settings && typeof settings === 'object' ? settings : {};
    const sourceTypes = source.enabledTypes && typeof source.enabledTypes === 'object' ? source.enabledTypes : {};
    const normalizedTypes = {};
    CART_ALERT_TYPE_OPTIONS.forEach(option => {
      normalizedTypes[option.id] = sourceTypes[option.id] !== false;
    });
    const recurrence = Number(source.recurrenceMinutes);
    return {
      popupEnabled:source.popupEnabled !== false,
      soundEnabled:source.soundEnabled !== false,
      recurrenceMinutes:Number.isFinite(recurrence) && recurrence >= 0 ? recurrence : DEFAULT_CART_ALERT_SETTINGS.recurrenceMinutes,
      enabledTypes:normalizedTypes
    };
  }

  function cartAlertRecurrenceMs(state){
    const minutes = normalizeCartAlertSettings(state?.alertSettings).recurrenceMinutes;
    return minutes > 0 ? minutes * 60 * 1000 : Number.POSITIVE_INFINITY;
  }

  function cartAlertTypeEnabled(state, type){
    const settings = normalizeCartAlertSettings(state?.alertSettings);
    return settings.enabledTypes[type || 'critical'] !== false;
  }

  function shouldOpenCartAlertPopup(state){
    return normalizeCartAlertSettings(state?.alertSettings).popupEnabled;
  }

  function shouldPlayCartAlertSound(state){
    return normalizeCartAlertSettings(state?.alertSettings).soundEnabled;
  }

  function ensureSeedData(state){
    let changed = false;
    const normalized = {
      rooms: Array.isArray(state?.rooms) ? state.rooms : [],
      carts: Array.isArray(state?.carts) ? state.carts : [],
      telemetryEvents: Array.isArray(state?.telemetryEvents) ? state.telemetryEvents : [],
      backendChartSamples: Array.isArray(state?.backendChartSamples) ? state.backendChartSamples : [],
      alerts: Array.isArray(state?.alerts) ? state.alerts : [],
      backendOperationalMode: state?.backendOperationalMode === true,
      alertSettings: normalizeCartAlertSettings(state?.alertSettings)
    };

    const activeRooms = normalized.rooms.filter(room => {
      const isObsolete = OBSOLETE_ROOM_IDS.has(room?.id);
      if(isObsolete) changed = true;
      return !isObsolete;
    });
    normalized.rooms = activeRooms;

    const activeCarts = normalized.carts.filter(cart => {
      const isObsolete = OBSOLETE_CART_IDS.has(cart?.id) || OBSOLETE_CART_MACS.has(cleanMac(cart?.mac));
      if(isObsolete) changed = true;
      return !isObsolete;
    });
    normalized.carts = activeCarts;

    normalized.carts.forEach(cart => {
      if(OBSOLETE_ROOM_IDS.has(cart?.roomId)){
        cart.roomId = '';
        cart.locationStatus = 'offline';
        changed = true;
      }
    });

    defaultState.rooms.forEach(defaultRoom => {
      if(!normalized.rooms.some(room => room.id === defaultRoom.id)){
        normalized.rooms.push(clone(defaultRoom));
        changed = true;
      }
    });

    defaultState.carts.forEach(defaultCart => {
      if(!normalized.carts.some(cart => cart.id === defaultCart.id)){
        normalized.carts.push(clone(defaultCart));
        changed = true;
      }
    });

    const defaultCartNames = new Map(defaultState.carts.map(cart => [cart.id, cart.name]));
    normalized.carts.forEach(cart => {
      const compactMac = cleanMac(cart.mac);
      const defaultName = defaultCartNames.get(cart.id);
      if(defaultName && /^Carrinho\s+0?[12]$/i.test(String(cart.name || '').trim())){
        cart.name = defaultName;
        changed = true;
      }
      const pilotCartInTransit = cart.locationStatus === 'transit' || SPECIAL_ROOM_IDS.has(cart.roomId);
      if(PILOT_CART_MACS.has(compactMac) && cart.roomId !== PILOT_ROOM_ID && !pilotCartInTransit){
        cart.roomId = PILOT_ROOM_ID;
        cart.locationStatus = 'in_room';
        cart.transitStep = 0;
        changed = true;
      }
      const normalizedCalibration = normalizeCartCalibration(cart.calibration);
      if(JSON.stringify(cart.calibration || null) !== JSON.stringify(normalizedCalibration)){
        cart.calibration = normalizedCalibration;
        changed = true;
      }
    });

    const pilotRoom = normalized.rooms.find(room => room.id === PILOT_ROOM_ID);
    if(pilotRoom && pilotRoom.gatewayDeviceId !== PILOT_GATEWAY_ID){
      pilotRoom.gatewayDeviceId = PILOT_GATEWAY_ID;
      changed = true;
    }

    return { state: normalized, changed };
  }

  function readState(){
    try{
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(saved && Array.isArray(saved.rooms) && Array.isArray(saved.carts)){
        const migration = ensureSeedData(saved);
        if(migration.changed) saveState(migration.state);
        return migration.state;
      }
    }catch(err){
      console.warn('Falha ao ler carrinhos por sala', err);
    }
    return clone(defaultState);
  }

  function saveState(state, options = {}){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if(options.persistConfig !== false) scheduleCartConfigBackendSave(state);
  }

  function hasCartConfigurationData(state){
    return Boolean(
      state &&
      Array.isArray(state.rooms) &&
      state.rooms.length > 0 &&
      Array.isArray(state.carts) &&
      state.carts.length > 0
    );
  }

  function cartConfigPayloadFromState(state){
    const source = state || {};
    return {
      rooms:Array.isArray(source.rooms) ? source.rooms.map(room => ({
        id:room.id,
        name:room.name,
        gatewayDeviceId:room.gatewayDeviceId || ''
      })) : [],
      carts:Array.isArray(source.carts) ? source.carts.map(cart => ({
        id:cart.id,
        name:cart.name,
        mac:cart.mac,
        roomId:cart.roomId || '',
        locationStatus:cart.roomId ? 'in_room' : 'offline',
        fillPercentage:0,
        calibration:normalizeCartCalibration(cart.calibration),
        registeredAt:cart.registeredAt || ''
      })) : [],
      alertSettings:normalizeCartAlertSettings(source.alertSettings)
    };
  }

  function hasCartConfigStateShape(state){
    return Boolean(state && Array.isArray(state.rooms) && Array.isArray(state.carts));
  }

  function scheduleCartConfigBackendSave(state){
    if(!hasCartConfigStateShape(state)) return;
    if(!cartConfigBackendLoaded || cartConfigSaving || !canManageCartSettings()) return;
    window.clearTimeout(cartConfigSaveTimer);
    const payload = cartConfigPayloadFromState(state);
    cartConfigSaveTimer = window.setTimeout(async () => {
      try{
        cartConfigSaving = true;
        await panelApi('/api/cart-tracking/config', {
          method:'PUT',
          body:JSON.stringify({ state:payload })
        });
      }catch(err){
        console.warn('Falha ao salvar configuracao C.R. no backend', err);
      }finally{
        cartConfigSaving = false;
      }
    }, 250);
  }

  async function saveCartConfigBackendNow(state){
    if(!canManageCartSettings()) return state;
    if(!hasCartConfigStateShape(state)){
      console.warn('Configuracao C.R. incompleta ignorada para evitar sobrescrever salas e carrinhos.');
      return readState();
    }
    window.clearTimeout(cartConfigSaveTimer);
    const payload = cartConfigPayloadFromState(state);
    cartConfigSaving = true;
    try{
      const saved = await panelApi('/api/cart-tracking/config', {
        method:'PUT',
        body:JSON.stringify({ state:payload })
      });
      const backendState = ensureSeedData({
        ...readState(),
        ...(saved?.state || payload),
        telemetryEvents:[],
        backendChartSamples:[],
        alerts:[]
      }).state;
      cartConfigBackendLoaded = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backendState));
      return backendState;
    }finally{
      cartConfigSaving = false;
    }
  }

  window.__saveCartTrackingConfigToBackend = scheduleCartConfigBackendSave;
  window.__readCartTrackingState = readState;

  function cleanMac(value){
    return String(value || '').toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 12);
  }

  function formatMac(value){
    const compact = cleanMac(value);
    return compact.match(/.{1,2}/g)?.join(':') || '';
  }

  function normalizeGatewayId(value){
    return String(value || '').replace(/[^0-9a-z]/gi, '').toLowerCase();
  }

  function formatGatewayShort(value){
    const compact = normalizeGatewayId(value);
    if(!compact) return 'não vinculado';
    return compact.length > 4 ? compact.slice(-4) : compact;
  }

  function gatewayMatchesRoom(roomGatewayId, readingGatewayId){
    const roomGateway = normalizeGatewayId(roomGatewayId);
    const readingGateway = normalizeGatewayId(readingGatewayId);
    if(!roomGateway || !readingGateway) return false;
    return readingGateway === roomGateway || readingGateway.endsWith(roomGateway);
  }

  function cartDisplayName(cart){
    const name = String(cart?.name || '').trim();
    const compactMac = cleanMac(cart?.mac);
    if(compactMac === 'DE08DBF47311') return 'C01';
    if(compactMac === 'C4894994A485') return 'C02';
    const numberedName = name.match(/^Carrinho\s+0?(\d+)$/i);
    if(numberedName) return `C${String(numberedName[1]).padStart(2, '0')}`;
    return name || 'C--';
  }

  function finiteNumberOrNull(value){
    if(value === null || value === undefined || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function clampNumber(value, min, max){
    const number = Number(value);
    if(!Number.isFinite(number)) return min;
    return Math.min(max, Math.max(min, number));
  }

  function normalizeCartCalibration(value){
    const source = value && typeof value === 'object' ? value : {};
    const emptyDistance = finiteNumberOrNull(source.emptyDistanceMm);
    const fullDistance = finiteNumberOrNull(source.fullDistanceMm);
    const redPercent = finiteNumberOrNull(source.redPercent);
    const redDistance = finiteNumberOrNull(source.redDistanceMm);
    const openMarginPercent = finiteNumberOrNull(source.openMarginPercent);
    const openMarginMin = finiteNumberOrNull(source.openMarginMinMm);
    const confirmationReadings = finiteNumberOrNull(source.confirmationReadings);
    return {
      emptyDistanceMm: emptyDistance !== null && emptyDistance > 0 ? Math.round(emptyDistance) : DEFAULT_CART_CALIBRATION.emptyDistanceMm,
      fullDistanceMm: fullDistance !== null && fullDistance >= 0 ? Math.round(fullDistance) : DEFAULT_CART_CALIBRATION.fullDistanceMm,
      redMode: 'percent',
      redPercent: normalizeCartCriticalPercent(redPercent),
      redDistanceMm: redDistance !== null && redDistance > 0 ? Math.round(redDistance) : null,
      openMarginPercent: openMarginPercent !== null ? clampNumber(openMarginPercent, 1, 200) : DEFAULT_CART_CALIBRATION.openMarginPercent,
      openMarginMinMm: openMarginMin !== null ? Math.max(1, Math.round(openMarginMin)) : DEFAULT_CART_CALIBRATION.openMarginMinMm,
      confirmationReadings: confirmationReadings !== null ? Math.max(1, Math.round(confirmationReadings)) : DEFAULT_CART_CALIBRATION.confirmationReadings,
      lidDetectionEnabled: source.lidDetectionEnabled === true || source.lid_detection_enabled === true || source.lid_detection_enabled === 1 || source.lid_detection_enabled === '1',
      samples: Array.isArray(source.samples) ? source.samples.slice(-CALIBRATION_SAMPLE_COUNT).map(Number).filter(Number.isFinite) : [],
      updatedAt: source.updatedAt || source.updated_at || null
    };
  }

  function cartCalibration(cart){
    return normalizeCartCalibration(cart?.calibration);
  }

  function canManageCartSettings(){
    return window.activePanelSession?.role === 'master';
  }

  function canViewCartCalibration(){
    const role = window.activePanelSession?.role;
    return role === 'master' || role === 'cart';
  }

  function canEditCartCriticalLimit(){
    const role = window.activePanelSession?.role;
    return role === 'master' || role === 'cart';
  }

  function distanceForFillPercentage(calibration, percentage){
    const empty = finiteNumberOrNull(calibration.emptyDistanceMm);
    const full = finiteNumberOrNull(calibration.fullDistanceMm);
    const percent = clampNumber(percentage, 0, 100);
    if(empty === null || full === null || empty <= full) return null;
    return Math.round(empty - ((empty - full) * (percent / 100)));
  }

  function fillPercentageForDistance(calibration, distanceMm){
    const empty = finiteNumberOrNull(calibration.emptyDistanceMm);
    const full = finiteNumberOrNull(calibration.fullDistanceMm);
    const current = finiteNumberOrNull(distanceMm);
    if(empty === null || full === null || current === null || empty <= full || current < 0) return null;
    if(current >= empty - CART_EMPTY_DEADBAND_MM) return 0;
    return normalizeCartFillPercentage(((empty - current) / (empty - full)) * 100);
  }

  function normalizeCartFillPercentage(fillPercentage){
    const fill = finiteNumberOrNull(fillPercentage);
    if(fill === null || fill < 0) return null;
    const normalized = clampNumber(fill, 0, 100);
    return normalized <= CART_EMPTY_DEADBAND_PERCENT ? 0 : normalized;
  }

  function normalizeCartCriticalPercent(value, fallback = DEFAULT_CART_CALIBRATION.redPercent){
    const number = finiteNumberOrNull(value);
    const target = number !== null ? clampNumber(Math.round(number), 1, 100) : fallback;
    return CART_CRITICAL_PERCENT_CHOICES.reduce((best, option) => {
      const bestDistance = Math.abs(best - target);
      const optionDistance = Math.abs(option - target);
      if(optionDistance < bestDistance) return option;
      if(optionDistance === bestDistance && option > best) return option;
      return best;
    }, CART_CRITICAL_PERCENT_CHOICES[0]);
  }

  function bucketCartFillPercentage(fillPercentage){
    const fill = normalizeCartFillPercentage(fillPercentage);
    if(fill === null) return null;
    if(fill <= 12) return 0;
    if(fill <= 37) return 25;
    if(fill <= 62) return 50;
    if(fill <= 87) return 75;
    return 100;
  }

  function clearPendingFullReading(cart){
    let changed = false;
    if(cart.pendingFullReadingKey){
      delete cart.pendingFullReadingKey;
      changed = true;
    }
    if(cart.pendingFullReadings){
      delete cart.pendingFullReadings;
      changed = true;
    }
    return changed;
  }

  function stabilizeCartFillPercentage(cart, fillPercentage, criticalReadings, reading){
    const fill = normalizeCartFillPercentage(fillPercentage);
    if(fill === null) return { fill:null, changed:clearPendingFullReading(cart) };

    const calibration = cartCalibration(cart);
    const requiredReadings = Math.max(1, Number(calibration.confirmationReadings || DEFAULT_CART_CALIBRATION.confirmationReadings));
    const currentCriticalReadings = Math.max(0, Number(criticalReadings || 0));
    const fullLimit = clampNumber(cartRedPercent(cart), 1, 100);
    const previousFill = normalizeCartFillPercentage(cart.fillPercentage);
    const backendFill = normalizeCartFillPercentage(reading?.fillPercentage);

    if(
      backendFill !== null
      && backendFill <= CART_STABLE_EMPTY_PERCENT
      && fill >= CART_SUSPICIOUS_JUMP_PERCENT
      && currentCriticalReadings < requiredReadings
    ){
      return { fill:backendFill, changed:clearPendingFullReading(cart) };
    }

    if(fill >= fullLimit){
      if(previousFill !== null && previousFill >= fullLimit){
        return { fill, changed:clearPendingFullReading(cart) };
      }

      const readingKey = readingIdentity(reading);
      let changed = false;

      if(cart.pendingFullReadingKey !== readingKey){
        cart.pendingFullReadingKey = readingKey;
        cart.pendingFullReadings = Math.max(0, Number(cart.pendingFullReadings || 0)) + 1;
        changed = true;
      }

      if(Number(cart.pendingFullReadings || 0) < requiredReadings){
        const guardedLimit = Math.max(0, Math.min(CART_CRITICAL_PERCENT - 1, fullLimit - 1));
        return {
          fill:previousFill === null ? 0 : Math.min(previousFill, guardedLimit),
          changed
        };
      }

      return { fill, changed:clearPendingFullReading(cart) || changed };
    }

    if(fill >= CART_CRITICAL_PERCENT && currentCriticalReadings < requiredReadings){
      const previousFill = normalizeCartFillPercentage(cart.fillPercentage);
      return {
        fill:previousFill === null ? 0 : Math.min(previousFill, CART_CRITICAL_PERCENT - 1),
        changed:clearPendingFullReading(cart)
      };
    }

    return { fill, changed:clearPendingFullReading(cart) };
  }

  function cartRedPercent(cart){
    const calibration = cartCalibration(cart);
    return calibration.redPercent;
  }

  function cartNearPercent(cart){
    return Math.max(0, cartRedPercent(cart) - 10);
  }

  function cartOpenDistanceLimit(calibration){
    const empty = finiteNumberOrNull(calibration.emptyDistanceMm);
    if(empty === null) return null;
    const dynamicMargin = Math.round(empty * (Number(calibration.openMarginPercent || 0) / 100));
    const margin = Math.max(Number(calibration.openMarginMinMm || 0), dynamicMargin);
    return empty + margin;
  }

  function relativeTime(value){
    const timestamp = new Date(value || '').getTime();
    if(!Number.isFinite(timestamp)) return 'agora';
    const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
    if(seconds < 60) return 'agora';
    const minutes = Math.round(seconds / 60);
    if(minutes < 60) return `${minutes} min atras`;
    const hours = Math.round(minutes / 60);
    return `${hours} h atras`;
  }

  function formatClock(value){
    const date = new Date(value || '');
    if(Number.isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
  }

  function formatDateTime(value){
    const date = new Date(value || '');
    if(Number.isNaN(date.getTime())) return '--';
    return date.toLocaleString('pt-BR', {
      day:'2-digit',
      month:'2-digit',
      hour:'2-digit',
      minute:'2-digit'
    });
  }

  function appendTelemetryEvent(state, event){
    if(!state || !event) return false;
    const list = Array.isArray(state.telemetryEvents) ? state.telemetryEvents : [];
    const ts = event.ts || new Date().toISOString();
    const key = event.key || [event.type, event.roomId, event.cartId, ts].join('|');
    if(list.some(item => item.key === key)) return false;
    list.push({
      id:`evt-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      key,
      ts,
      type:event.type || 'reading',
      roomId:event.roomId || '',
      cartId:event.cartId || '',
      cartName:event.cartName || '',
      title:event.title || 'Leitura registrada',
      detail:event.detail || '',
      fill:finiteNumberOrNull(event.fill),
      distanceMm:finiteNumberOrNull(event.distanceMm)
    });
    state.telemetryEvents = list
      .sort((a, b) => new Date(a.ts || 0) - new Date(b.ts || 0))
      .slice(-160);
    return true;
  }

  function roomNameForAlert(state, roomId){
    return state.rooms.find(room => room.id === roomId)?.name || 'Sala sem nome';
  }

  function alertSeverityLabel(type){
    if(type === 'obstruction') return 'Obstrução provável';
    if(type === 'sensor') return 'Sensor fora da calibração';
    if(type === 'recurrence') return 'Recorrência';
    if(type === 'exchange') return 'Troca registrada';
    return 'Crítico';
  }

  function appendCartAlert(state, alert){
    if(!state || !alert) return false;
    if(!cartAlertTypeEnabled(state, alert.type || 'critical')) return false;
    const list = Array.isArray(state.alerts) ? state.alerts : [];
    const ts = alert.ts || new Date().toISOString();
    const key = alert.key || [alert.type, alert.roomId, alert.cartId, ts].join('|');
    if(list.some(item => item.key === key)) return false;
    const nextAlert = {
      id:`alert-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      key,
      ts,
      type:alert.type || 'critical',
      roomId:alert.roomId || '',
      roomName:alert.roomName || roomNameForAlert(state, alert.roomId),
      cartId:alert.cartId || '',
      cartName:alert.cartName || '',
      title:alert.title || alertSeverityLabel(alert.type),
      message:alert.message || '',
      detail:alert.detail || '',
      read:false,
      acknowledgedAt:null
    };
    list.push(nextAlert);
    state.alerts = list
      .sort((a, b) => new Date(a.ts || 0) - new Date(b.ts || 0))
      .slice(-CART_ALERT_LIMIT);
    lastGeneratedCartAlertId = nextAlert.id;
    appendTelemetryEvent(state, {
      key:`alert-telemetry|${nextAlert.key}`,
      type:'alert',
      roomId:nextAlert.roomId,
      cartId:nextAlert.cartId,
      cartName:nextAlert.cartName,
      ts:nextAlert.ts,
      title:nextAlert.title,
      detail:nextAlert.message || nextAlert.detail
    });
    return true;
  }

  function alertAgeLabel(startIso, nowIso){
    const start = new Date(startIso || '').getTime();
    const now = new Date(nowIso || '').getTime();
    if(!Number.isFinite(start) || !Number.isFinite(now) || now < start) return 'agora';
    return formatCartDurationFromMs(now - start, 'agora');
  }

  function ensureCartAlertState(cart){
    if(!cart.alertState || typeof cart.alertState !== 'object') cart.alertState = {};
    return cart.alertState;
  }

  function processCartAlerts(state, cart, previous, eventBase, rawStatus){
    if(cartBackendOperationalActive || state?.backendOperationalMode) return false;
    const alertState = ensureCartAlertState(cart);
    const ts = eventBase.ts || new Date().toISOString();
    const nowMs = new Date(ts).getTime();
    const roomName = roomNameForAlert(state, eventBase.roomId);
    const cartName = cartDisplayName(cart);
    const nextTone = fillTone(cart);
    const recurrenceMs = cartAlertRecurrenceMs(state);
    let changed = false;

    if(nextTone === 'full'){
      if(!alertState.criticalStartedAt || previous.fillTone !== 'full'){
        alertState.criticalStartedAt = ts;
        alertState.lastCriticalAlertAt = '';
        changed = true;
      }
      const lastMs = new Date(alertState.lastCriticalAlertAt || 0).getTime();
      const criticalStartMs = new Date(alertState.criticalStartedAt || 0).getTime();
      const shouldSendInitial = !alertState.lastCriticalAlertAt
        && Number.isFinite(nowMs)
        && Number.isFinite(criticalStartMs)
        && nowMs - criticalStartMs >= CART_CRITICAL_FIRST_ALERT_MS;
      const shouldSendRecurrence = !shouldSendInitial && Number.isFinite(nowMs) && Number.isFinite(lastMs) && nowMs - lastMs >= recurrenceMs;
      if(shouldSendInitial || shouldSendRecurrence){
        const type = shouldSendInitial ? 'critical' : 'recurrence';
        const elapsed = alertAgeLabel(alertState.criticalStartedAt, ts);
        if(appendCartAlert(state, {
          key:`${type}|${cart.id}|${alertState.criticalStartedAt}|${shouldSendInitial ? 'initial' : Math.floor(nowMs / recurrenceMs)}`,
          type,
          roomId:eventBase.roomId,
          roomName,
          cartId:cart.id,
          cartName,
          ts,
          title:shouldSendInitial ? `${cartName} crítico` : `${cartName} segue crítico`,
          message:shouldSendInitial
            ? `${roomName}: ${cartName} atingiu o limite crítico.`
            : `${roomName}: ${cartName} está crítico há ${elapsed}.`,
          detail:`Leitura ${Math.round(cartVisualFill(cart))}%${eventBase.distanceMm !== null && eventBase.distanceMm !== undefined ? ` - ${Math.round(eventBase.distanceMm)} mm` : ''}.`
        })) changed = true;
        alertState.lastCriticalAlertAt = ts;
        changed = true;
      }
    }else if(
      previous.fillTone === 'full'
      && !['obstruction', 'sensor', 'pending', 'lost'].includes(nextTone)
      && alertState.criticalStartedAt
    ){
      if(appendTelemetryEvent(state, {
        ...eventBase,
        key:`critical-normalized|${cart.id}|${alertState.criticalStartedAt}|${ts}`,
        type:'reading',
        title:`${cartName} voltou para livre`,
        detail:`${roomName}: ${cartName} voltou para livre.`
      })) changed = true;
      alertState.criticalStartedAt = '';
      alertState.lastCriticalAlertAt = '';
      changed = true;
    }

    if(isObstructedCart(cart)){
      const lastObstructionMs = new Date(alertState.lastObstructionAlertAt || 0).getTime();
      if(!alertState.lastObstructionAlertAt || (Number.isFinite(nowMs) && Number.isFinite(lastObstructionMs) && nowMs - lastObstructionMs >= recurrenceMs)){
        if(appendCartAlert(state, {
          key:`obstruction|${cart.id}|${Math.floor(nowMs / recurrenceMs)}`,
          type:'obstruction',
          roomId:eventBase.roomId,
          roomName,
          cartId:cart.id,
          cartName,
          ts,
          title:`${cartName}: obstrução provável`,
          message:`${roomName}: possível obstrução no ${cartName}.`,
          detail:'Salto de leitura detectado pelo sensor.'
        })) changed = true;
        alertState.lastObstructionAlertAt = ts;
        changed = true;
      }
    }else if(alertState.lastObstructionAlertAt && !isObstructedCart(cart)){
      alertState.lastObstructionAlertAt = '';
      changed = true;
    }

    if(rawStatus === 'sensor_removed'){
      const lastSensorMs = new Date(alertState.lastSensorAlertAt || 0).getTime();
      if(!alertState.lastSensorAlertAt || (Number.isFinite(nowMs) && Number.isFinite(lastSensorMs) && nowMs - lastSensorMs >= recurrenceMs)){
        if(appendCartAlert(state, {
          key:`sensor|${cart.id}|${Math.floor(nowMs / recurrenceMs)}`,
          type:'sensor',
          roomId:eventBase.roomId,
          roomName,
          cartId:cart.id,
          cartName,
          ts,
          title:`${cartName}: sensor fora da calibração`,
          message:`${roomName}: sensor do ${cartName} fora da faixa esperada.`,
          detail:'Verifique fixação lateral e calibração.'
        })) changed = true;
        alertState.lastSensorAlertAt = ts;
        changed = true;
      }
    }else if(alertState.lastSensorAlertAt && rawStatus !== 'sensor_removed'){
      alertState.lastSensorAlertAt = '';
      changed = true;
    }

    return changed;
  }

  function readingIdentity(reading){
    return [
      reading?.id || '',
      reading?.receivedAt || '',
      reading?.createdAt || '',
      reading?.lorawanDeviceId || ''
    ].join('|');
  }

  function isOfficialCartReading(reading){
    return reading?.officialReading === true
      || reading?.officialReading === 1
      || String(reading?.officialReading || '').toLowerCase() === 'true';
  }

  function isTechnicalReadingStatus(status){
    return [
      'sensor_removed',
      'sensor_obstructed',
      'uncalibrated',
      'calibration_pending'
    ].includes(String(status || '').toLowerCase());
  }

  function setCartLocation(cart, nextLocationStatus, nextTransitStep = 0){
    let changed = false;
    if(cart.locationStatus !== nextLocationStatus){
      cart.locationStatus = nextLocationStatus;
      changed = true;
    }
    if(Number(cart.transitStep || 0) !== nextTransitStep){
      cart.transitStep = nextTransitStep;
      changed = true;
    }
    return changed;
  }

  function clearPendingRoom(cart){
    let changed = false;
    if(cart.pendingRoomId){
      delete cart.pendingRoomId;
      changed = true;
    }
    if(cart.pendingRoomReadingKey){
      delete cart.pendingRoomReadingKey;
      changed = true;
    }
    if(cart.pendingRoomReadings){
      delete cart.pendingRoomReadings;
      changed = true;
    }
    return changed;
  }

  function gatewayRoomIdForReading(state, reading){
    return state.rooms.find(room => gatewayMatchesRoom(room.gatewayDeviceId, reading?.lorawanDeviceId))?.id || '';
  }

  function isSpecialRoomId(roomId){
    return SPECIAL_ROOM_IDS.has(roomId);
  }

  function transitStepForGatewayRoom(roomId){
    if(roomId === RESIDUE_ROOM_ID) return 2;
    if(roomId === HYGIENE_ROOM_ID) return 3;
    return 1;
  }

  function locationStatusForGatewayRoom(roomId){
    return isSpecialRoomId(roomId) ? 'transit' : 'in_room';
  }

  function isRecentReading(reading, maxAgeMs = ROOM_READING_RECENT_MS){
    const ts = readingTimestampMs(reading);
    return ts !== null && Date.now() - ts <= maxAgeMs;
  }

  function hasValidRoomReading(reading){
    const distance = finiteNumberOrNull(reading?.distanceMm);
    return distance !== null && distance < INVALID_SENSOR_DISTANCE_MM;
  }

  function isStrongRecentRoomReading(reading, rssi){
    return isRecentReading(reading) && hasValidRoomReading(reading) && rssi !== null && rssi >= ROOM_SWITCH_RSSI_MIN;
  }

  function cartLastCommunicationMs(cart){
    const timestamps = [cart?.lastCommunicationAt, cart?.lastReadingAt]
      .map(value => new Date(value || '').getTime())
      .filter(Number.isFinite);
    return timestamps.length ? Math.max(...timestamps) : null;
  }

  function shouldLeaveRoomForExchange(cart, nowMs){
    if(!cart || cart.locationStatus === 'transit') return false;
    const lastMs = cartLastCommunicationMs(cart);
    if(lastMs === null) return false;
    return nowMs - lastMs >= CART_EXCHANGE_OLD_SILENCE_MS;
  }

  function clearExchangeCandidate(cart){
    let changed = false;
    [
      'exchangeCandidateCartId',
      'exchangeCandidateRoomId',
      'exchangeCandidateReadingKey',
      'exchangeCandidateReadings',
      'exchangeCandidateStartedAt'
    ].forEach(key => {
      if(Object.prototype.hasOwnProperty.call(cart, key)){
        delete cart[key];
        changed = true;
      }
    });
    return changed;
  }

  function trackExchangeCandidate(oldCart, newest, roomId){
    const key = readingIdentity(newest.context.reading);
    let changed = false;

    if(oldCart.exchangeCandidateCartId !== newest.cart.id || oldCart.exchangeCandidateRoomId !== roomId){
      oldCart.exchangeCandidateCartId = newest.cart.id;
      oldCart.exchangeCandidateRoomId = roomId;
      oldCart.exchangeCandidateReadingKey = key;
      oldCart.exchangeCandidateReadings = 1;
      oldCart.exchangeCandidateStartedAt = newest.context.readingAt || new Date().toISOString();
      return true;
    }

    if(oldCart.exchangeCandidateReadingKey !== key){
      oldCart.exchangeCandidateReadingKey = key;
      oldCart.exchangeCandidateReadings = Number(oldCart.exchangeCandidateReadings || 0) + 1;
      changed = true;
    }

    return changed;
  }

  function resetCartForStock(cart){
    let changed = false;
    const updates = {
      fillPercentage:0,
      displayFillPercentage:0,
      levelStatus:'normal',
      collectorStatus:'stock',
      candidateLevelStatus:null,
      candidateFillPercentage:null,
      candidateLevelReadings:0,
      consecutiveCriticalReadings:0,
      consecutiveObstructedReadings:0
    };
    Object.entries(updates).forEach(([key, value]) => {
      if(cart[key] !== value){
        cart[key] = value;
        changed = true;
      }
    });
    return changed;
  }

  function shouldMarkNeverSeenCartLost(cart){
    return false;
  }

  function shouldMarkCartLost(cart, nowMs){
    if(!cart || cart.lostAt) return false;
    const lastMs = cartLastCommunicationMs(cart);
    return lastMs !== null && nowMs - lastMs >= CART_LOST_AFTER_MS;
  }

  function applyCartLostAging(state){
    const nowMs = Date.now();
    const ts = new Date(nowMs).toISOString();
    let changed = false;
    state.carts.forEach(cart => {
      if(!shouldMarkNeverSeenCartLost(cart) && !shouldMarkCartLost(cart, nowMs)) return;
      if(setCartLocation(cart, 'offline', 0)) changed = true;
      if(clearPendingRoom(cart)) changed = true;
      if(cart.lostAt !== ts){
        cart.lostAt = ts;
        changed = true;
      }
    });
    return changed;
  }

  function applyRoomExchangeFromCurrentReadings(state, readingContextsByMac){
    const nowMs = Date.now();
    let changed = false;
    const freshCartsByRoom = new Map();

    state.carts.forEach(cart => {
      const context = readingContextsByMac.get(cleanMac(cart.mac));
      if(!context || !context.gatewayRoomId || isSpecialRoomId(context.gatewayRoomId)) return;
      if(!context.strongRoomReading) return;
      const list = freshCartsByRoom.get(context.gatewayRoomId) || [];
      list.push({ cart, context });
      freshCartsByRoom.set(context.gatewayRoomId, list);
    });

    freshCartsByRoom.forEach((freshItems, roomId) => {
      if(!freshItems.length) return;
      const newest = freshItems
        .slice()
        .sort((a, b) => (b.context.readingAtMs || 0) - (a.context.readingAtMs || 0))[0];
      const room = state.rooms.find(item => item.id === roomId);
      const roomName = room?.name || 'Sala';

      state.carts
        .filter(cart => cart.roomId === roomId && cart.id !== newest.cart.id)
        .forEach(oldCart => {
          const oldContext = readingContextsByMac.get(cleanMac(oldCart.mac));
          if(oldContext?.strongRoomReading){
            if(clearExchangeCandidate(oldCart)) changed = true;
            return;
          }
          if(trackExchangeCandidate(oldCart, newest, roomId)) changed = true;
          if(Number(oldCart.exchangeCandidateReadings || 0) < CART_EXCHANGE_CONFIRM_READINGS) return;
          if(!shouldLeaveRoomForExchange(oldCart, nowMs)) return;

          const ts = newest.context.readingAt || new Date().toISOString();
          if(setCartLocation(oldCart, CART_TRANSIT_FLOW_ENABLED ? 'transit' : 'offline', CART_TRANSIT_FLOW_ENABLED ? 1 : 0)) changed = true;
          if(!CART_TRANSIT_FLOW_ENABLED && resetCartForStock(oldCart)) changed = true;
          if(oldCart.transitStartedAt !== ts){
            oldCart.transitStartedAt = ts;
            changed = true;
          }
          if(appendTelemetryEvent(state, {
            key:`exchange-detected|${oldCart.id}|${newest.cart.id}|${roomId}|${ts}`,
            type:'exchange',
            roomId,
            cartId:oldCart.id,
            cartName:cartDisplayName(oldCart),
            ts,
            fill:cartVisualFill(oldCart),
            distanceMm:oldCart.distanceMm,
            title:'Troca de carrinho registrada',
            detail:`${cartDisplayName(oldCart)} saiu da ${roomName}; ${cartDisplayName(newest.cart)} entrou com leitura forte.`
          })) changed = true;
          if(clearExchangeCandidate(oldCart)) changed = true;
        });
    });

    return changed;
  }

  function applyGatewayRoomToCart(cart, gatewayRoomId, rssi, reading){
    if(!gatewayRoomId) return false;
    if(!isRecentReading(reading)) return false;

    const nextLocationStatus = locationStatusForGatewayRoom(gatewayRoomId);
    const nextTransitStep = nextLocationStatus === 'transit' ? transitStepForGatewayRoom(gatewayRoomId) : 0;

    if(cart.roomId === gatewayRoomId){
      const cleared = clearPendingRoom(cart);
      const located = setCartLocation(cart, nextLocationStatus, nextTransitStep);
      return cleared || located;
    }

    if(!isStrongRecentRoomReading(reading, rssi)){
      return clearPendingRoom(cart);
    }

    const key = readingIdentity(reading);
    let changed = false;
    if(cart.pendingRoomId !== gatewayRoomId){
      cart.pendingRoomId = gatewayRoomId;
      cart.pendingRoomReadings = 1;
      cart.pendingRoomReadingKey = key;
      changed = true;
    }else if(cart.pendingRoomReadingKey !== key){
      cart.pendingRoomReadings = Number(cart.pendingRoomReadings || 0) + 1;
      cart.pendingRoomReadingKey = key;
      changed = true;
    }

    if(Number(cart.pendingRoomReadings || 0) >= ROOM_SWITCH_CONFIRM_READINGS){
      cart.roomId = gatewayRoomId;
      changed = true;
      const cleared = clearPendingRoom(cart);
      const located = setCartLocation(cart, nextLocationStatus, nextTransitStep);
      return cleared || located || changed;
    }

    return setCartLocation(cart, 'near', 1) || changed;
  }

  function applyReadingsToState(state, readings){
    const latestReadings = Array.isArray(readings) ? readings : [];
    const readingsByMac = new Map(latestReadings.map(reading => [
      cleanMac(reading.mac || reading.bleSensorId),
      reading
    ]).filter(([mac]) => mac.length === 12));
    const readingContextsByMac = new Map();
    readingsByMac.forEach((reading, mac) => {
      const rssi = finiteNumberOrNull(reading.rssiBle);
      const gatewayRoomId = gatewayRoomIdForReading(state, reading);
      const readingAtMs = readingTimestampMs(reading);
      readingContextsByMac.set(mac, {
        reading,
        gatewayRoomId,
        rssi,
        readingAtMs,
        readingAt:reading.createdAt || reading.receivedAt || '',
        strongRoomReading:isStrongRecentRoomReading(reading, rssi)
      });
    });

    let changed = false;

    state.carts.forEach(cart => {
      const cartMac = cleanMac(cart.mac);
      const reading = readingsByMac.get(cartMac);
      if(!reading) return;
      const readingContext = readingContextsByMac.get(cartMac) || {};

      const previous = {
        roomId:cart.roomId || '',
        locationStatus:cart.locationStatus || '',
        fillTone:fillTone(cart),
        lastReadingAt:cart.lastReadingAt || ''
      };
      const fill = finiteNumberOrNull(reading.fillPercentage);
      const distance = finiteNumberOrNull(reading.distanceMm);
      const battery = finiteNumberOrNull(reading.battery);
      const batteryVoltage = finiteNumberOrNull(reading.batteryVoltageMv);
      const rssi = finiteNumberOrNull(reading.rssiBle);
      const criticalReads = finiteNumberOrNull(reading.consecutiveCriticalReadings);
      const lidOpenReads = finiteNumberOrNull(reading.consecutiveLidOpenReadings);
      const lidClosedReads = finiteNumberOrNull(reading.consecutiveLidClosedReadings);
      const candidateLevelReads = finiteNumberOrNull(reading.candidateLevelReadings);
      const gatewayRoomId = readingContext.gatewayRoomId;
      const rawStatus = String(reading.status || '').toLowerCase();
      const officialReading = isOfficialCartReading(reading);
      const confirmedLidState = String(reading.confirmedLidState || '').toLowerCase();
      const currentCalibration = cartCalibration(cart);
      const readingCalibration = reading.calibration
        ? normalizeCartCalibration({ ...currentCalibration, ...reading.calibration })
        : null;
      const effectiveCalibration = readingCalibration || currentCalibration;
      const sensorPositionAlert = rawStatus === 'sensor_removed'
        || (rawStatus === 'sensor_obstructed' && effectiveCalibration.lidDetectionEnabled === true);
      const technicalReadingStatus = isTechnicalReadingStatus(rawStatus);
      const readingLidOpen = effectiveCalibration.lidDetectionEnabled === true
        && !sensorPositionAlert
        && ([
          'lid_open',
          'open_lid',
          'tampa_aberta',
          'tampa aberta'
        ].includes(rawStatus) || confirmedLidState === 'open' || reading.lidOpen === true);
      const backendFill = normalizeCartFillPercentage(fill);
      const backendCalibrationMs = new Date(readingCalibration?.updatedAt || '').getTime();
      const registeredAtMs = new Date(cart.registeredAt || '').getTime();
      const backendCalibrationBelongsToRegistration = Number.isFinite(backendCalibrationMs)
        && (!Number.isFinite(registeredAtMs) || backendCalibrationMs >= registeredAtMs);
      const shouldUseBackendCalibration = readingCalibration
        && backendCalibrationBelongsToRegistration
        && (readingCalibration.updatedAt || !currentCalibration.updatedAt);
      if(shouldUseBackendCalibration && JSON.stringify(cart.calibration || null) !== JSON.stringify(readingCalibration)){
        cart.calibration = readingCalibration;
        changed = true;
      }
      const calibratedFill = backendFill === null && !readingLidOpen && !technicalReadingStatus && distance !== null
        ? fillPercentageForDistance(cartCalibration(cart), distance)
        : null;
      const nextFill = backendFill !== null ? backendFill : calibratedFill;
      const nextDisplayFill = bucketCartFillPercentage(nextFill);

      if(nextFill !== null && Math.round(nextFill) !== Math.round(Number(cart.fillPercentage || 0))){
        cart.fillPercentage = Math.round(nextFill);
        changed = true;
      }
      if(nextDisplayFill !== null && Math.round(nextDisplayFill) !== Math.round(Number(cart.displayFillPercentage ?? cart.fillPercentage ?? 0))){
        cart.displayFillPercentage = Math.round(nextDisplayFill);
        changed = true;
      }
      if(distance !== null && cart.distanceMm !== distance){
        cart.distanceMm = distance;
        changed = true;
      }
      if(battery !== null && cart.battery !== battery){
        cart.battery = battery;
        changed = true;
      }
      if(batteryVoltage !== null && cart.batteryVoltageMv !== batteryVoltage){
        cart.batteryVoltageMv = batteryVoltage;
        changed = true;
      }
      if(rssi !== null && cart.rssi !== rssi){
        cart.rssi = rssi;
        changed = true;
      }
      if(criticalReads !== null && cart.consecutiveCriticalReadings !== criticalReads){
        cart.consecutiveCriticalReadings = criticalReads;
        changed = true;
      }
      if(lidOpenReads !== null && cart.consecutiveLidOpenReadings !== lidOpenReads){
        cart.consecutiveLidOpenReadings = lidOpenReads;
        changed = true;
      }
      if(lidClosedReads !== null && cart.consecutiveLidClosedReadings !== lidClosedReads){
        cart.consecutiveLidClosedReadings = lidClosedReads;
        changed = true;
      }
      if(candidateLevelReads !== null && cart.candidateLevelReadings !== candidateLevelReads){
        cart.candidateLevelReadings = candidateLevelReads;
        changed = true;
      }
      if(reading.levelStatus && cart.levelStatus !== reading.levelStatus){
        cart.levelStatus = reading.levelStatus;
        changed = true;
      }
      if(confirmedLidState && cart.confirmedLidState !== confirmedLidState){
        cart.confirmedLidState = confirmedLidState;
        changed = true;
      }
      if(cart.lidOpen !== readingLidOpen){
        cart.lidOpen = readingLidOpen;
        changed = true;
      }
      if(reading.status && cart.collectorStatus !== reading.status){
        cart.collectorStatus = reading.status;
        changed = true;
      }
      let readingAt = '';
      if(reading.createdAt || reading.receivedAt){
        readingAt = reading.createdAt || reading.receivedAt;
        const lastCommunicationSeen = relativeTime(readingAt);
        if(cart.lastCommunicationAt !== readingAt){
          cart.lastCommunicationAt = readingAt;
          changed = true;
        }
        if(cart.lastCommunicationSeen !== lastCommunicationSeen){
          cart.lastCommunicationSeen = lastCommunicationSeen;
          changed = true;
        }
        if(officialReading){
          const lastSeen = relativeTime(readingAt);
          if(cart.lastReadingAt !== readingAt){
            cart.lastReadingAt = readingAt;
            changed = true;
          }
          if(cart.lastSeen !== lastSeen){
            cart.lastSeen = lastSeen;
            changed = true;
          }
        }
      }
      if(rawStatus === 'offline'){
        if(setCartLocation(cart, 'offline', 0)) changed = true;
        if(clearPendingRoom(cart)) changed = true;
      }else if(applyGatewayRoomToCart(cart, gatewayRoomId, rssi, reading)){
        changed = true;
      }

      const eventRoomId = cart.roomId || gatewayRoomId || previous.roomId || '';
      const nextTone = fillTone(cart);
      const eventBase = {
        roomId:eventRoomId,
        cartId:cart.id,
        cartName:cartDisplayName(cart),
        ts:readingAt || new Date().toISOString(),
        fill:cartVisualFill(cart),
        distanceMm:cart.distanceMm
      };
      if(officialReading && readingAt && readingAt !== previous.lastReadingAt){
        if(appendTelemetryEvent(state, {
          ...eventBase,
          key:`reading|${cart.id}|${readingAt}`,
          type:'reading',
          title:`${cartDisplayName(cart)} comunicou`,
          detail:`${fillLabel(cart)} - ${Math.round(cartVisualFill(cart))}%`
        })) changed = true;
      }
      if(previous.fillTone !== nextTone){
        if(appendTelemetryEvent(state, {
          ...eventBase,
          key:`status|${cart.id}|${nextTone}|${eventBase.ts}`,
          type:nextTone === 'full' ? 'critical' : 'status',
          title:`${cartDisplayName(cart)}: ${fillLabel(cart)}`,
          detail:`Estado mudou para ${fillLabel(cart)}`
        })) changed = true;
      }
      if(previous.locationStatus !== cart.locationStatus || previous.roomId !== cart.roomId){
        if(appendTelemetryEvent(state, {
          ...eventBase,
          key:`location|${cart.id}|${cart.roomId || ''}|${cart.locationStatus || ''}|${eventBase.ts}`,
          type:cart.locationStatus === 'transit' ? 'transit' : 'room',
          title:cart.locationStatus === 'transit'
            ? `${cartDisplayName(cart)} saiu da sala`
            : `${cartDisplayName(cart)} entrou na sala`,
          detail:locationLabel(cart)
        })) changed = true;
      }
      if(processCartAlerts(state, cart, previous, eventBase, rawStatus)) changed = true;
    });

    if(applyRoomExchangeFromCurrentReadings(state, readingContextsByMac)) changed = true;
    if(applyCartLostAging(state)) changed = true;

    return changed;
  }

  function backendOperationalQuery(macFilters){
    const params = new URLSearchParams();
    if(Array.isArray(macFilters) && macFilters.length){
      params.set('mac', macFilters.join(','));
    }
    params.set('limit', '10000');
    params.set('alertLimit', String(CART_ALERT_LIMIT));
    params.set('telemetryLimit', '5000');
    params.set('sampleLimit', '10000');
    return `?${params.toString()}`;
  }

  async function fetchBackendOperationalState(macFilters){
    const response = await fetch(`/api/cart-tracking/operational${backendOperationalQuery(macFilters)}`, { cache:'no-store' });
    if(!response.ok) throw new Error(`Falha operacional ${response.status}`);
    const payload = await response.json();
    return payload?.data || null;
  }

  function cartMacFiltersForState(state){
    return Array.from(new Set(
      (state?.carts || [])
        .map(cart => cleanMac(cart.mac))
        .filter(mac => mac.length === 12)
    ));
  }

  async function fetchLatestCartReadings(macFilters){
    const query = macFilters.length
      ? `?mac=${encodeURIComponent(macFilters.join(','))}&limit=${Math.max(20, macFilters.length * 20)}`
      : '';
    const response = await fetch(`/api/cart-tracking/readings${query}`, { cache:'no-store' });
    const payload = await response.json();
    return payload?.data?.readings || [];
  }

  async function hydrateStateWithLatestCartReadings(state){
    const macFilters = cartMacFiltersForState(state);
    if(!macFilters.length) return false;
    const readings = await fetchLatestCartReadings(macFilters);
    return applyReadingsToState(state, readings);
  }

  async function refreshGatewayStatusFromBackend(){
    try{
      const response = await fetch('/api/mqtt/status', { cache:'no-store' });
      const payload = await response.json().catch(() => null);
      if(!response.ok || payload?.ok === false) return false;
      const nextStatus = payload?.data || null;
      const previousSignature = JSON.stringify(cartGatewayStatus?.lastPayload || null);
      const nextSignature = JSON.stringify(nextStatus?.lastPayload || null);
      cartGatewayStatus = nextStatus;
      return previousSignature !== nextSignature;
    }catch(err){
      console.warn('Nao foi possivel carregar status do gateway.', err);
      return false;
    }
  }

  function mergeBackendAlerts(existingAlerts, backendAlerts){
    const previousByKey = new Map((existingAlerts || []).map(alert => [alert.key || alert.id, alert]));
    return (backendAlerts || [])
      .filter(alert => alert && (alert.key || alert.id))
      .map(alert => {
        const previous = previousByKey.get(alert.key || alert.id) || {};
        return {
          ...alert,
          read:previous.read === true || previous.acknowledgedAt ? true : alert.read === true,
          acknowledgedAt:previous.acknowledgedAt || alert.acknowledgedAt || null
        };
      })
      .sort((a, b) => new Date(a.ts || 0) - new Date(b.ts || 0))
      .slice(-CART_ALERT_LIMIT);
  }

  function mergeBackendOperationalState(state, operational){
    if(!state || !operational || operational.clientId !== 'einstein') return false;
    let changed = false;
    const currentAlertsSignature = JSON.stringify((state.alerts || []).map(alert => [
      alert.key || alert.id,
      alert.ts,
      alert.type,
      alert.read === true,
      alert.acknowledgedAt || ''
    ]));
    const nextAlerts = mergeBackendAlerts(state.alerts, operational.alerts || []);
    const nextAlertsSignature = JSON.stringify(nextAlerts.map(alert => [
      alert.key || alert.id,
      alert.ts,
      alert.type,
      alert.read === true,
      alert.acknowledgedAt || ''
    ]));
    if(currentAlertsSignature !== nextAlertsSignature){
      state.alerts = nextAlerts;
      changed = true;
    }

    const backendTelemetry = Array.isArray(operational.telemetryEvents) ? operational.telemetryEvents : [];
    const nextTelemetry = backendTelemetry
      .filter(event => event && (event.key || event.id))
      .sort((a, b) => new Date(a.ts || 0) - new Date(b.ts || 0))
      .slice(-1000);
    const telemetrySignature = JSON.stringify((state.telemetryEvents || []).map(event => [event.key || event.id, event.ts, event.type]));
    const nextTelemetrySignature = JSON.stringify(nextTelemetry.map(event => [event.key || event.id, event.ts, event.type]));
    if(telemetrySignature !== nextTelemetrySignature){
      state.telemetryEvents = nextTelemetry;
      changed = true;
    }

    const nextSamples = Array.isArray(operational.chart?.samples) ? operational.chart.samples : [];
    const sampleSignature = JSON.stringify((state.backendChartSamples || []).map(sample => [sample.ts, sample.cartId, sample.fill, sample.status]));
    const nextSampleSignature = JSON.stringify(nextSamples.map(sample => [sample.ts, sample.cartId, sample.fill, sample.status]));
    if(sampleSignature !== nextSampleSignature){
      state.backendChartSamples = nextSamples;
      changed = true;
    }

    if(state.backendOperationalMode !== true){
      state.backendOperationalMode = true;
      changed = true;
    }
    cartBackendOperationalActive = true;
    return changed;
  }

  let readingsTimer = null;
  let readingsInFlight = false;

  async function refreshCartReadings(){
    if(!isEinsteinCartAlertContext()){
      hideCartAlertsOutsideContext();
      lastGeneratedCartAlertId = '';
      return;
    }
    if(readingsInFlight) return;
    readingsInFlight = true;
    try{
      const state = cartConfigBackendLoaded
        ? readState()
        : await loadCartConfigFromBackend(true);
      if(!hasCartConfigurationData(state)){
        renderRooms();
        return;
      }
      const macFilters = cartMacFiltersForState(state);
      const readings = await fetchLatestCartReadings(macFilters);
      let changed = false;
      let operational = null;
      try{
        operational = await fetchBackendOperationalState(macFilters);
        if(operational && operational.clientId === 'einstein'){
          cartBackendOperationalActive = true;
          state.backendOperationalMode = true;
        }
      }catch(operationalError){
        cartBackendOperationalActive = false;
        state.backendOperationalMode = false;
        console.warn('Falha ao buscar operação dos carrinhos', operationalError);
      }
      if(await refreshGatewayStatusFromBackend()){
        changed = true;
      }
      if(applyReadingsToState(state, readings)){
        changed = true;
      }
      if(operational && mergeBackendOperationalState(state, operational)){
        changed = true;
      }
      if(changed){
        saveState(state, { persistConfig:false });
        renderRooms();
        if(lastGeneratedCartAlertId){
          lastGeneratedCartAlertId = '';
          window.setTimeout(() => {
            const refreshAlerts = window.refreshStableCartAlertUi || window.updateStableAlertBadges;
            if(typeof refreshAlerts === 'function') refreshAlerts();
          }, 0);
        }
      }
    }catch(err){
      console.warn('Falha ao buscar leituras dos carrinhos', err);
    }finally{
      readingsInFlight = false;
    }
  }

  function startReadingsPolling(){
    if(!isEinsteinCartAlertContext()) return;
    refreshCartReadings();
    if(readingsTimer) return;
    readingsTimer = setInterval(refreshCartReadings, CART_READING_POLL_MS);
  }

  function stopReadingsPolling(){
    if(readingsTimer){
      clearInterval(readingsTimer);
      readingsTimer = null;
    }
    readingsInFlight = false;
    lastGeneratedCartAlertId = '';
  }

  function escapeHtml(value){
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#039;'
    }[char]));
  }

  function cartIcon(){
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path d="M18 20h28" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
        <path d="M22 22h20l-3 30H25L22 22Z" fill="currentColor" opacity=".18"/>
        <path d="M22 22h20l-3 30H25L22 22Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
        <path d="M26 14h12" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `;
  }

  function transitIcon(){
    return '<img src="./assets/cart-transit-approved.png" alt="" loading="lazy">';
  }

  function locationLabel(cart){
    if(cart.locationStatus === 'near') return 'Próximo';
    if(cart.locationStatus === 'transit') return 'Em trânsito';
    if(isStockCart(cart)) return 'Estoque';
    if(cart.locationStatus === 'offline') return 'Sem comunicação';
    return 'Na sala';
  }

  function fillLabel(cart){
    const rawStatus = String(cart?.collectorStatus || '').toLowerCase();
    if(isLostCart(cart)) return 'Perdido';
    if(isStockCart(cart)) return 'Estoque';
    if(rawStatus === 'uncalibrated') return 'Aguardando calibração';
    if(rawStatus === 'calibration_pending') return 'Aguardando leitura';
    if(rawStatus === 'sensor_removed') return 'Sensor fora da posição';
    if(isObstructedCart(cart)) return 'Possível obstrução';
    if(isLidOpen(cart)) return 'Porta aberta';
    const fill = Number(cart.fillPercentage || 0);
    if(fill >= cartRedPercent(cart)) return 'Crítico';
    return 'Livre';
  }

  function cartVisualFill(cart){
    if(isStockCart(cart)) return 0;
    const displayFill = finiteNumberOrNull(cart?.displayFillPercentage);
    const confirmedFill = finiteNumberOrNull(cart?.fillPercentage);
    return Math.max(0, Math.min(100, Number(displayFill ?? confirmedFill ?? 0)));
  }

  function cartOperationalFill(cart){
    if(isStockCart(cart)) return 0;
    const confirmedFill = finiteNumberOrNull(cart?.fillPercentage);
    const displayFill = finiteNumberOrNull(cart?.displayFillPercentage);
    return Math.max(0, Math.min(100, Number(confirmedFill ?? displayFill ?? 0)));
  }

  function fillTone(cart){
    const rawStatus = String(cart?.collectorStatus || '').toLowerCase();
    if(isLostCart(cart)) return 'lost';
    if(isStockCart(cart)) return 'stock';
    if(rawStatus === 'uncalibrated' || rawStatus === 'calibration_pending') return 'pending';
    if(rawStatus === 'sensor_removed') return 'sensor';
    if(isObstructedCart(cart)) return 'obstruction';
    const fill = cartOperationalFill(cart);
    if(fill >= cartRedPercent(cart)) return 'full';
    return 'empty';
  }

  function isLidOpen(cart){
    const rawStatus = String(cart?.collectorStatus || cart?.readingStatus || cart?.sensorStatus || '').toLowerCase();
    if(rawStatus === 'sensor_removed' || rawStatus === 'sensor_obstructed') return false;
    if(cartCalibration(cart).lidDetectionEnabled !== true) return false;
    const lidState = String(cart?.confirmedLidState || '').toLowerCase();
    return cart?.lidOpen === true || lidState === 'open' || [
      'lid_open',
      'open_lid',
      'tampa_aberta',
      'tampa aberta'
    ].includes(rawStatus);
  }

  function cartReadingDetail(cart){
    const distance = finiteNumberOrNull(cart?.distanceMm);
    const rawStatus = String(cart?.collectorStatus || '').toLowerCase();
    if(rawStatus === 'uncalibrated') return 'Aguardando calibração';
    if(rawStatus === 'calibration_pending') return 'Aguardando leitura';
    if(rawStatus === 'sensor_removed'){
      return distance !== null ? `Sensor fora da posição - ${Math.round(distance)} mm` : 'Sensor fora da posição';
    }
    if(isObstructedCart(cart)){
      return distance !== null ? `Possível obstrução - ${Math.round(distance)} mm` : 'Possível obstrução';
    }
    if(isLidOpen(cart)){
      return distance !== null ? `Porta aberta - ${Math.round(distance)} mm` : 'Porta aberta';
    }
    if(distance !== null) return `${Math.round(distance)} mm`;
    return '';
  }

  function formatMm(value){
    const number = finiteNumberOrNull(value);
    return number === null ? '--' : `${Math.round(number)} mm`;
  }

  function cartBatteryLabel(cart){
    const battery = cartBatteryPercent(cart);
    return battery === null ? '--' : `${Math.round(battery)}%`;
  }

  function cartBatteryTone(cart){
    const battery = cartBatteryPercent(cart);
    if(battery === null) return 'unknown';
    if(battery < 20) return 'critical';
    if(battery <= 35) return 'warning';
    return 'good';
  }

  function batteryToneFromPercent(battery){
    const value = finiteNumberOrNull(battery);
    if(value === null) return 'unknown';
    if(value < 20) return 'critical';
    if(value <= 35) return 'warning';
    return 'good';
  }

  function cartBatteryPercent(cart){
    const battery = finiteNumberOrNull(cart?.battery);
    if(battery !== null) return clampNumber(battery, 0, 100);
    const voltage = finiteNumberOrNull(cart?.batteryVoltageMv);
    if(voltage === null) return null;
    return clampNumber(((voltage - 2200) / 900) * 100, 0, 100);
  }

  function batteryIconHtml(percent, tone = 'good', className = ''){
    const value = finiteNumberOrNull(percent);
    const fill = value === null ? 8 : Math.max(8, Math.min(100, value));
    return `<i class="cart-battery-mini ${escapeHtml(tone)} ${escapeHtml(className)}" aria-hidden="true"><em style="width:${fill}%"></em></i>`;
  }

  function gatewayStatusMatchesRoom(status, room){
    const gatewayId = normalizeGatewayId(room?.gatewayDeviceId);
    const statusGatewayId = normalizeGatewayId(status?.gatewayMac || status?.lastPayload?.gatewayMac);
    return Boolean(gatewayId && statusGatewayId && gatewayId === statusGatewayId);
  }

  function gatewayBatteryStatusForRoom(room){
    if(!gatewayStatusMatchesRoom(cartGatewayStatus, room)) return null;
    const payloadStatus = cartGatewayStatus?.lastPayload?.gatewayStatus || cartGatewayStatus?.gatewayStatus || null;
    const percent = finiteNumberOrNull(payloadStatus?.batteryPercent);
    if(percent === null) return null;
    return {
      percent:clampNumber(percent, 0, 100),
      voltageMv:finiteNumberOrNull(payloadStatus?.batteryVoltageMv),
      networkType:payloadStatus?.networkType || '',
      csq:finiteNumberOrNull(payloadStatus?.csq),
      timestamp:payloadStatus?.timestamp || cartGatewayStatus?.lastMessageAt || ''
    };
  }

  function gatewayLastCommunicationForRoom(room){
    if(!gatewayStatusMatchesRoom(cartGatewayStatus, room)) return '';
    const payloadStatus = cartGatewayStatus?.lastPayload?.gatewayStatus || cartGatewayStatus?.gatewayStatus || null;
    return payloadStatus?.timestamp || cartGatewayStatus?.lastGatewayStatusAt || cartGatewayStatus?.lastMessageAt || '';
  }

  function gatewayConnectionToneForRoom(room){
    const timestamp = gatewayLastCommunicationForRoom(room);
    const ms = new Date(timestamp || '').getTime();
    if(!Number.isFinite(ms)) return 'unknown';
    const age = Date.now() - ms;
    if(age <= GATEWAY_ONLINE_GRACE_MS) return 'online';
    if(age <= GATEWAY_STALE_GRACE_MS) return 'warning';
    return 'offline';
  }

  function gatewayConnectionTitle(room){
    const timestamp = gatewayLastCommunicationForRoom(room);
    const tone = gatewayConnectionToneForRoom(room);
    if(!timestamp) return 'Gateway aguardando comunicação';
    const prefix = tone === 'online'
      ? 'Gateway comunicando'
      : (tone === 'warning' ? 'Gateway sem pacote recente' : 'Gateway sem comunicação recente');
    return `${prefix}: ${formatDateTime(timestamp)}`;
  }

  function gatewayBatteryHtml(room){
    const status = gatewayBatteryStatusForRoom(room);
    if(!status) return '';
    const tone = batteryToneFromPercent(status.percent);
    const titleParts = [
      `Bateria do gateway: ${Math.round(status.percent)}%`,
      status.voltageMv !== null ? `${Math.round(status.voltageMv)} mV` : '',
      status.networkType ? `Rede ${status.networkType}` : '',
      status.csq !== null ? `CSQ ${status.csq}` : '',
      status.timestamp ? `Última ${formatDateTime(status.timestamp)}` : ''
    ].filter(Boolean);
    return `
      <span class="cart-gateway-battery ${tone}" title="${escapeHtml(titleParts.join(' · '))}">
        ${batteryIconHtml(status.percent, tone, 'gateway')}
        <b>${Math.round(status.percent)}%</b>
      </span>
    `;
  }

  function cartLevelLabel(cart){
    const fill = Math.round(cartVisualFill(cart));
    const distance = finiteNumberOrNull(cart?.distanceMm);
    return distance === null ? `${fill}%` : `${fill}% (${Math.round(distance)} mm)`;
  }

  function isObstructedCart(cart){
    return String(cart?.collectorStatus || '').toLowerCase() === 'sensor_obstructed'
      && cartCalibration(cart).lidDetectionEnabled === true;
  }

  function cartCriticalDistanceLabel(cart){
    const calibration = cartCalibration(cart);
    const distance = distanceForFillPercentage(calibration, cartRedPercent(cart));
    return formatMm(distance);
  }

  function cartSideStatusLabel(cart){
    if(isLostCart(cart)) return 'Perdido';
    if(isObstructedCart(cart)) return 'Obstrução provável';
    if(fillTone(cart) === 'full') return 'Crítico';
    return 'Livre';
  }

  function cartSideStatusDetail(cart){
    if(isObstructedCart(cart)) return 'Salto de leitura detectado.';
    if(fillTone(cart) === 'full') return `Limite: ${cartCriticalDistanceLabel(cart)}`;
    if(isLostCart(cart)) return 'Sem leitura recente.';
    return '';
  }

  function cartStatusTone(cart){
    if(isObstructedCart(cart)) return 'obstruction';
    const tone = fillTone(cart);
    if(tone === 'full') return 'critical';
    if(tone === 'lost') return 'lost';
    return 'free';
  }

  function cartCommunicationLabel(cart){
    return isLostCart(cart) ? 'Sem comunicação' : 'Comunicando';
  }

  function renderCartSideMeta(cart){
    const statusTone = cartStatusTone(cart);
    const statusLabel = cartSideStatusLabel(cart);
    const statusDetail = cartSideStatusDetail(cart);
    return `
      <div class="cart-side-meta" aria-label="Resumo de ${escapeHtml(cartDisplayName(cart))}">
        <span class="cart-side-row cart-side-status" title="${escapeHtml(cartLevelLabel(cart))}">
          <i class="cart-side-dot ${statusTone}" aria-hidden="true"></i>
          <b>${escapeHtml(statusLabel)}</b>
        </span>
        ${statusDetail ? `
          <span class="cart-side-row cart-side-limit">
            <small>${escapeHtml(statusDetail)}</small>
          </span>
        ` : ''}
      </div>
    `;
  }

  function renderCartUnderMeta(cart){
    const battery = cartBatteryPercent(cart);
    const lastCommunication = cart.lastCommunicationSeen || 'sem comunicação';
    return `
      <div class="cart-under-meta" aria-label="Comunicação e bateria de ${escapeHtml(cartDisplayName(cart))}">
        <span class="cart-under-row cart-under-battery">
          ${batteryIconHtml(battery, cartBatteryTone(cart), 'sensor')}
          <small>Bateria</small>
          <span>${escapeHtml(cartBatteryLabel(cart))}</span>
        </span>
        <span class="cart-under-row cart-under-reading">
          <small>&Uacute;ltima comunica&ccedil;&atilde;o</small>
          <span>${escapeHtml(lastCommunication)}</span>
        </span>
      </div>
    `;
  }

  function roomCartsForDetails(state, room){
    return state.carts.filter(cart => cart.roomId === room.id && cart.locationStatus !== 'transit');
  }

  function latestRoomReadingLabel(carts){
    const timestamps = carts
      .map(cart => new Date(cart.lastReadingAt || '').getTime())
      .filter(Number.isFinite);
    if(!timestamps.length) return 'sem leitura';
    return relativeTime(new Date(Math.max(...timestamps)).toISOString());
  }

  function roomTelemetryEvents(state, room){
    const roomCartIds = new Set(state.carts.filter(cart => cart.roomId === room.id).map(cart => cart.id));
    const storedEvents = (state.telemetryEvents || [])
      .filter(event => event.roomId === room.id || roomCartIds.has(event.cartId))
      .sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0));
    if(storedEvents.length) return storedEvents;

    return roomCartsForDetails(state, room).map(cart => ({
      id:`fallback-${cart.id}`,
      ts:cart.lastReadingAt || new Date().toISOString(),
      type:fillTone(cart) === 'full' ? 'critical' : 'reading',
      roomId:room.id,
      cartId:cart.id,
      cartName:cartDisplayName(cart),
      title:`${cartDisplayName(cart)} - ${fillLabel(cart)}`,
      detail:`Última leitura ${cart.lastSeen || 'sem leitura'}`,
      fill:cartVisualFill(cart),
      distanceMm:finiteNumberOrNull(cart.distanceMm)
    }));
  }

  function roomChronologicalEvents(state, room){
    return roomTelemetryEvents(state, room)
      .map(event => ({ ...event, _time:new Date(event.ts || 0).getTime() }))
      .filter(event => Number.isFinite(event._time))
      .sort((a, b) => a._time - b._time);
  }

  function formatCartDurationFromMs(ms, fallback = 'aguardando'){
    const value = Number(ms);
    if(!Number.isFinite(value) || value < 0) return fallback;
    const totalMinutes = Math.max(0, Math.round(value / 60000));
    if(totalMinutes < 1) return '<1 min';
    if(totalMinutes < 60) return `${totalMinutes} min`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes ? `${hours}h ${String(minutes).padStart(2, '0')}` : `${hours}h`;
  }

  function eventText(event){
    return `${event?.title || ''} ${event?.detail || ''}`.toLowerCase();
  }

  function isCriticalEvent(event){
    const text = eventText(event);
    return event?.type === 'critical' || text.includes('crítico') || text.includes('crÃ­tico') || text.includes('critico');
  }

  function isObstructionEvent(event){
    return eventText(event).includes('obstru');
  }

  function isRoomEntryEvent(event){
    const text = eventText(event);
    return event?.type === 'room' && (text.includes('entrou') || text.includes('na sala'));
  }

  function isExchangeEvent(event){
    const text = eventText(event);
    return event?.type === 'exchange' || text.includes('troca');
  }

  function sameLocalDay(a, b){
    const first = new Date(a || '');
    const second = new Date(b || '');
    if(Number.isNaN(first.getTime()) || Number.isNaN(second.getTime())) return false;
    return first.getFullYear() === second.getFullYear()
      && first.getMonth() === second.getMonth()
      && first.getDate() === second.getDate();
  }

  function roomBlockLabel(room){
    return String(room?.name || 'Bloco')
      .replace(/^sala\s*-\s*/i, '')
      .replace(/^sala\s+/i, '')
      .trim() || 'Bloco';
  }

  function roomChartPoints(state, room, view = 'summary'){
    const limit = view === 'detail' ? 18 : 12;
    const events = roomChronologicalEvents(state, room)
      .filter(event => finiteNumberOrNull(event.fill) !== null)
      .slice(-limit);
    if(events.length >= 2){
      return events.map(event => ({
        value:clampNumber(finiteNumberOrNull(event.fill), 0, 100),
        time:event.ts,
        label:formatClock(event.ts),
        tone:isObstructionEvent(event) ? 'obstruction' : (isCriticalEvent(event) ? 'critical' : 'normal'),
        distanceMm:finiteNumberOrNull(event.distanceMm)
      }));
    }
    const carts = roomCartsForDetails(state, room);
    if(carts.length){
      const now = new Date().toISOString();
      return carts.map(cart => ({
        value:cartVisualFill(cart),
        time:cart.lastReadingAt || now,
        label:formatClock(cart.lastReadingAt || now),
        tone:isObstructedCart(cart)
          ? 'obstruction'
          : (fillTone(cart) === 'full' ? 'critical' : 'normal'),
        distanceMm:finiteNumberOrNull(cart.distanceMm)
      }));
    }
    return [
      { value:0, time:new Date().toISOString(), label:'--:--', tone:'normal', distanceMm:null },
      { value:0, time:new Date().toISOString(), label:'--:--', tone:'normal', distanceMm:null }
    ];
  }

  function demandScoreForFill(fill, criticalPercent){
    const value = finiteNumberOrNull(fill);
    if(value === null) return 0;
    if(value >= criticalPercent) return 4;
    if(value >= Math.max(0, criticalPercent - 15)) return 3;
    if(value >= 50) return 2;
    if(value > 0) return 1;
    return 0;
  }

  function demandScoreLabel(score){
    if(score >= 4) return 'Gargalo';
    if(score >= 3) return 'Alta';
    if(score >= 2) return 'Media';
    if(score >= 1) return 'Baixa';
    return 'Sem dado';
  }

  function roomDemandSlots(state, room){
    const hours = [6, 8, 10, 12, 14, 16, 18, 20];
    const carts = roomCartsForDetails(state, room);
    const criticalPercent = carts.length
      ? Math.max(...carts.map(cart => cartRedPercent(cart)))
      : DEFAULT_CART_CALIBRATION.redPercent;
    const slots = hours.map(hour => ({
      hour,
      label:`${String(hour).padStart(2, '0')}h`,
      score:0,
      fill:null,
      events:0,
      critical:0,
      obstruction:0,
      exchange:0
    }));
    const now = new Date();
    const todayEvents = roomChronologicalEvents(state, room).filter(event => sameLocalDay(event.ts, now));
    const findSlot = (value) => {
      const date = new Date(value || '');
      if(Number.isNaN(date.getTime())) return null;
      const hour = date.getHours();
      const target = Math.max(hours[0], Math.min(hours[hours.length - 1], Math.floor(hour / 2) * 2));
      return slots.find(slot => slot.hour === target) || slots[0];
    };
    const applySlot = (slot, score, fill = null, type = '') => {
      if(!slot) return;
      slot.score = Math.max(slot.score, score);
      if(fill !== null && fill !== undefined){
        const current = finiteNumberOrNull(slot.fill);
        const next = clampNumber(fill, 0, 100);
        slot.fill = current === null ? next : Math.max(current, next);
      }
      slot.events += 1;
      if(type === 'critical') slot.critical += 1;
      if(type === 'obstruction') slot.obstruction += 1;
      if(type === 'exchange') slot.exchange += 1;
    };

    todayEvents.forEach(event => {
      const slot = findSlot(event.ts);
      const fill = finiteNumberOrNull(event.fill);
      if(fill !== null) applySlot(slot, demandScoreForFill(fill, criticalPercent), fill, 'reading');
      if(isCriticalEvent(event)) applySlot(slot, 4, fill, 'critical');
      if(isObstructionEvent(event)) applySlot(slot, 3, fill, 'obstruction');
      if(isExchangeEvent(event) || isRoomEntryEvent(event)) applySlot(slot, 2, fill, 'exchange');
    });

    if(!slots.some(slot => slot.events) && carts.length){
      const slot = findSlot(carts[0].lastReadingAt || new Date().toISOString());
      const peakFill = Math.max(...carts.map(cart => cartVisualFill(cart)));
      const hasObstruction = carts.some(isObstructedCart);
      const hasCritical = carts.some(cart => fillTone(cart) === 'full');
      applySlot(slot, hasObstruction ? 3 : (hasCritical ? 4 : demandScoreForFill(peakFill, criticalPercent)), peakFill, hasObstruction ? 'obstruction' : 'reading');
    }

    return slots;
  }

  function roomDemandSummary(state, room){
    const slots = roomDemandSlots(state, room);
    const events = roomChronologicalEvents(state, room).filter(event => sameLocalDay(event.ts, new Date()));
    const peak = slots.reduce((best, slot) => {
      if(!best) return slot;
      if(slot.score > best.score) return slot;
      const slotFill = finiteNumberOrNull(slot.fill) || 0;
      const bestFill = finiteNumberOrNull(best.fill) || 0;
      return slot.score === best.score && slotFill > bestFill ? slot : best;
    }, null);
    const currentHour = new Date().getHours();
    const current = slots.find(slot => slot.hour === Math.max(6, Math.min(20, Math.floor(currentHour / 2) * 2))) || peak;
    return {
      slots,
      peak,
      current,
      exchangeTotal: events.filter(event => isExchangeEvent(event) || isRoomEntryEvent(event)).length,
      obstructionTotal: events.filter(isObstructionEvent).length
    };
  }

  function roomOperationalSummary(state, room){
    const carts = roomCartsForDetails(state, room);
    const events = roomChronologicalEvents(state, room);
    const now = Date.now();
    const fullCarts = carts.filter(cart => fillTone(cart) === 'full');
    const lostCarts = carts.filter(isLostCart);
    const freeCarts = carts.filter(cart => fillTone(cart) === 'empty');
    const readingEvents = events.filter(event => finiteNumberOrNull(event.fill) !== null);
    const criticalEvents = events.filter(isCriticalEvent);
    const alertEvents = events.filter(event => event.type === 'alert');
    const obstructionCount = events.filter(isObstructionEvent).length
      + carts.filter(isObstructedCart).length;
    const firstReading = readingEvents[0];
    const lastReading = readingEvents[readingEvents.length - 1];
    const lastCritical = criticalEvents[criticalEvents.length - 1];
    const criticalStartMs = lastCritical ? lastCritical._time : (fullCarts[0]?.lastReadingAt ? new Date(fullCarts[0].lastReadingAt).getTime() : NaN);
    const firstReadingMs = firstReading ? firstReading._time : (lastReading ? lastReading._time : NaN);
    const exchangeEvent = Number.isFinite(criticalStartMs)
      ? events.find(event => event._time > criticalStartMs && (isExchangeEvent(event) || isRoomEntryEvent(event)))
      : null;
    const values = [
      ...readingEvents.map(event => ({ value:finiteNumberOrNull(event.fill), time:event.ts, distanceMm:finiteNumberOrNull(event.distanceMm) })),
      ...carts.map(cart => ({ value:cartVisualFill(cart), time:cart.lastReadingAt, distanceMm:finiteNumberOrNull(cart.distanceMm) }))
    ].filter(item => finiteNumberOrNull(item.value) !== null);
    const peak = values.reduce((best, item) => !best || item.value > best.value ? item : best, null);
    const criticalCart = fullCarts[0] || carts.find(cart => fillTone(cart) === 'full') || carts[0] || null;
    const calibration = criticalCart ? cartCalibration(criticalCart) : DEFAULT_CART_CALIBRATION;
    const criticalPercent = carts.length
      ? Math.max(...carts.map(cart => cartRedPercent(cart)))
      : DEFAULT_CART_CALIBRATION.redPercent;
    const criticalDistance = distanceForFillPercentage(calibration, criticalPercent);
    const staleEvents = events.filter(event => event.type === 'reading' && event._time && now - event._time > 30 * 60000);
    const panelAlerts = Math.max(fullCarts.length, criticalEvents.length, alertEvents.length);
    return {
      carts,
      events,
      freeCount:freeCarts.length,
      fullCount:fullCarts.length,
      lostCount:lostCarts.length,
      obstructionCount,
      panelAlerts,
      firstReading,
      lastReading,
      criticalStart: Number.isFinite(criticalStartMs) ? criticalStartMs : null,
      criticalStartLabel: Number.isFinite(criticalStartMs) ? formatClock(new Date(criticalStartMs).toISOString()) : '--:--',
      timeToCriticalLabel: Number.isFinite(firstReadingMs) && Number.isFinite(criticalStartMs) && criticalStartMs >= firstReadingMs
        ? formatCartDurationFromMs(criticalStartMs - firstReadingMs)
        : 'aguardando',
      timeInCriticalLabel: fullCarts.length && Number.isFinite(criticalStartMs)
        ? formatCartDurationFromMs(Math.max(0, now - criticalStartMs), 'aguardando')
        : '0 min',
      exchangeLabel: exchangeEvent && Number.isFinite(criticalStartMs)
        ? formatCartDurationFromMs(exchangeEvent._time - criticalStartMs)
        : (fullCarts.length ? 'aguardando' : 'sem troca'),
      peakLabel: peak ? `${Math.round(peak.value)}%` : '--',
      peakAtLabel: peak?.time ? formatClock(peak.time) : '--:--',
      peakDistanceLabel: peak?.distanceMm !== null && peak?.distanceMm !== undefined ? `${Math.round(peak.distanceMm)} mm` : '',
      criticalCalibrationLabel: `${Math.round(criticalPercent)}% / ${formatMm(criticalDistance)}`,
      staleReadingCount: staleEvents.length,
      criticalCartName: criticalCart ? cartDisplayName(criticalCart) : 'Carrinho',
      activeTitle: fullCarts.length ? 'CRÍTICO EM ANDAMENTO' : 'OPERAÇÃO NORMAL',
      activeMain: fullCarts.length
        ? `${cartDisplayName(fullCarts[0])} atingiu o limite`
        : `${freeCarts.length} livre${freeCarts.length === 1 ? '' : 's'}`,
      activeSub: fullCarts.length
        ? `Início ${Number.isFinite(criticalStartMs) ? formatClock(new Date(criticalStartMs).toISOString()) : '--:--'}`
        : 'Sem alerta ativo'
    };
  }

  function roomFillValues(state, room){
    const events = roomTelemetryEvents(state, room)
      .filter(event => finiteNumberOrNull(event.fill) !== null)
      .slice()
      .reverse()
      .slice(-12);
    const values = events.map(event => finiteNumberOrNull(event.fill));
    if(values.length >= 2) return values;
    const carts = roomCartsForDetails(state, room);
    if(carts.length){
      const current = Math.max(...carts.map(cart => cartVisualFill(cart)));
      return [current, current, current, current];
    }
    return [0, 0, 0, 0];
  }

  function roomDemandHeatmapHtml(state, room){
    const demand = roomDemandSummary(state, room);
    const blockLabel = roomBlockLabel(room);
    const peak = demand.peak;
    return `
      <div class="cart-demand-chart" role="img" aria-label="Demanda por horário do ${escapeHtml(blockLabel)}">
        <div class="cart-demand-head">
          <span>Demanda por horário</span>
          <strong>${escapeHtml(peak ? `${peak.label} - ${demandScoreLabel(peak.score)}` : '--')}</strong>
        </div>
        <div class="cart-demand-axis">
          <i></i>
          ${demand.slots.map(slot => `<span>${escapeHtml(slot.label)}</span>`).join('')}
        </div>
        <div class="cart-demand-row">
          <strong title="${escapeHtml(blockLabel)}">${escapeHtml(blockLabel)}</strong>
          <div class="cart-demand-cells">
            ${demand.slots.map(slot => {
              const fill = finiteNumberOrNull(slot.fill);
              const title = `${slot.label}: ${demandScoreLabel(slot.score)}${fill !== null ? ` - pico ${Math.round(fill)}%` : ''}`;
              return `
                <span class="cart-demand-cell level-${Math.max(0, Math.min(4, slot.score))}" title="${escapeHtml(title)}">
                  <b>${fill !== null ? `${Math.round(fill)}%` : ''}</b>
                  ${slot.exchange ? '<em>T</em>' : ''}
                  ${slot.obstruction ? '<em class="warn">!</em>' : ''}
                </span>
              `;
            }).join('')}
          </div>
        </div>
        <div class="cart-demand-legend">
          <span><i class="level-1"></i>Baixa</span>
          <span><i class="level-2"></i>Media</span>
          <span><i class="level-3"></i>Alta</span>
          <span><i class="level-4"></i>Gargalo</span>
        </div>
      </div>
    `;
  }

  function roomStepChartSvg(state, room){
    const chartPoints = roomChartPoints(state, room, 'detail');
    const carts = roomCartsForDetails(state, room);
    const criticalPercent = carts.length
      ? Math.max(...carts.map(cart => cartRedPercent(cart)))
      : DEFAULT_CART_CALIBRATION.redPercent;
    const width = 620;
    const height = 218;
    const padX = 44;
    const padY = 20;
    const innerW = width - padX * 2;
    const innerH = height - padY * 2 - 16;
    const point = (item, index) => {
      const x = padX + (chartPoints.length === 1 ? 0 : (innerW * index) / (chartPoints.length - 1));
      const y = padY + innerH - (clampNumber(item.value, 0, 100) / 100) * innerH;
      return { ...item, x, y };
    };
    const points = chartPoints.map(point);
    const stepPath = points.length
      ? points.slice(1).reduce((path, item) => `${path} H ${item.x.toFixed(1)} V ${item.y.toFixed(1)}`, `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`)
      : '';
    const redY = padY + innerH - clampNumber(criticalPercent, 0, 100) / 100 * innerH;
    const grid = [0, 50, 100].map(value => {
      const y = padY + innerH - (value / 100) * innerH;
      return `<line x1="${padX}" y1="${y}" x2="${width - padX}" y2="${y}" class="cart-room-chart-grid"></line><text x="10" y="${y + 4}" class="cart-room-chart-axis">${value}%</text>`;
    }).join('');
    const axisLabels = points.filter((_, index) => {
      if(points.length <= 4) return true;
      return index === 0 || index === points.length - 1 || index % Math.ceil(points.length / 4) === 0;
    }).map(item => `<text x="${item.x}" y="${height - 4}" text-anchor="middle" class="cart-room-chart-axis">${escapeHtml(item.label)}</text>`).join('');

    return `
      <svg class="cart-room-chart-svg cart-room-step-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Nível oficial do carrinho em degraus">
        ${grid}
        <rect x="${padX}" y="${padY}" width="${innerW}" height="${innerH}" rx="8" class="cart-room-chart-band"></rect>
        <rect x="${padX}" y="${padY}" width="${innerW}" height="${Math.max(0, redY - padY)}" rx="8" class="cart-room-chart-critical-zone"></rect>
        <line x1="${padX}" y1="${redY}" x2="${width - padX}" y2="${redY}" class="cart-room-chart-critical"></line>
        ${stepPath ? `<path d="${stepPath}" class="cart-room-step-line"></path>` : ''}
        ${points.map(item => `
          <circle cx="${item.x}" cy="${item.y}" r="${item.tone === 'obstruction' ? 6 : 4.5}" class="cart-room-chart-point ${item.tone}">
            <title>${Math.round(item.value)}%${item.distanceMm !== null && item.distanceMm !== undefined ? ` - ${Math.round(item.distanceMm)} mm` : ''}</title>
          </circle>
        `).join('')}
        ${axisLabels}
      </svg>
    `;
  }

  function roomCycleRows(state, room){
    const events = roomChronologicalEvents(state, room);
    const readings = events.filter(event => finiteNumberOrNull(event.fill) !== null);
    const criticals = events.filter(isCriticalEvent);
    const now = Date.now();
    const rows = criticals.slice(-3).map((event, index) => {
      const previousReading = readings.filter(item => item._time <= event._time).slice(-2)[0] || readings[0] || null;
      const exchange = events.find(item => item._time > event._time && (isExchangeEvent(item) || isRoomEntryEvent(item)));
      const fillTime = previousReading && previousReading._time < event._time
        ? formatCartDurationFromMs(event._time - previousReading._time, '--')
        : '--';
      const fullTime = exchange
        ? formatCartDurationFromMs(exchange._time - event._time, '--')
        : formatCartDurationFromMs(Math.max(0, now - event._time), 'em aberto');
      return {
        label:`Ciclo ${Math.max(1, criticals.length - 2 + index)}`,
        fillTime,
        fullTime,
        at:formatClock(event.ts),
        tone:exchange ? 'closed' : 'open'
      };
    });
    if(rows.length) return rows;
    const carts = roomCartsForDetails(state, room);
    return [{
      label:'Ciclo atual',
      fillTime:'sem crítico',
      fullTime:carts.length ? `${Math.round(Math.max(...carts.map(cart => cartVisualFill(cart))))}%` : '--',
      at:carts[0]?.lastReadingAt ? formatClock(carts[0].lastReadingAt) : '--:--',
      tone:'open'
    }];
  }

  function roomCycleDetailHtml(state, room){
    const rows = roomCycleRows(state, room);
    return `
      <div class="cart-cycle-chart">
        ${roomStepChartSvg(state, room)}
        <div class="cart-cycle-list">
          ${rows.map(row => `
            <span class="cart-cycle-row ${escapeHtml(row.tone)}">
              <b>${escapeHtml(row.label)}</b>
              <small>Encher ${escapeHtml(row.fillTime)}</small>
              <small>Cheio ${escapeHtml(row.fullTime)}</small>
              <em>${escapeHtml(row.at)}</em>
            </span>
          `).join('')}
        </div>
      </div>
    `;
  }

  function roomChartGraphicHtml(state, room, view = 'summary'){
    return view === 'detail'
      ? roomCycleDetailHtml(state, room)
      : roomDemandHeatmapHtml(state, room);
  }

  function roomChartLegendHtml(view){
    if(view === 'detail'){
      return `
        <div class="graph-legend-item"><span class="graph-line-swatch"></span> Nível oficial</div>
        <div class="graph-legend-item"><span class="graph-risk-swatch"></span> Limite crítico</div>
        <div class="graph-legend-item"><span class="cart-obstruction-swatch"></span> Falha técnica</div>
      `;
    }
    return `
      <div class="graph-legend-item"><span class="cart-demand-swatch level-1"></span> Baixa</div>
      <div class="graph-legend-item"><span class="cart-demand-swatch level-2"></span> Media</div>
      <div class="graph-legend-item"><span class="cart-demand-swatch level-3"></span> Alta</div>
      <div class="graph-legend-item"><span class="cart-demand-swatch level-4"></span> Gargalo</div>
    `;
  }

  function roomChartSvg(state, room, view = 'summary'){
    return roomChartGraphicHtml(state, room, view);
    const chartPoints = roomChartPoints(state, room, view);
    const carts = roomCartsForDetails(state, room);
    const criticalPercent = carts.length
      ? Math.max(...carts.map(cart => cartRedPercent(cart)))
      : DEFAULT_CART_CALIBRATION.redPercent;
    const width = 620;
    const height = 260;
    const padX = 44;
    const padY = 24;
    const innerW = width - padX * 2;
    const innerH = height - padY * 2 - 14;
    const baseY = padY + innerH;
    const point = (item, index) => {
      const x = padX + (chartPoints.length === 1 ? 0 : (innerW * index) / (chartPoints.length - 1));
      const y = padY + innerH - (clampNumber(item.value, 0, 100) / 100) * innerH;
      return { ...item, x, y };
    };
    const points = chartPoints.map(point);
    const polyline = points.map(item => `${item.x.toFixed(1)},${item.y.toFixed(1)}`).join(' ');
    const areaPath = points.length
      ? `M ${points[0].x.toFixed(1)} ${baseY.toFixed(1)} L ${points.map(item => `${item.x.toFixed(1)} ${item.y.toFixed(1)}`).join(' L ')} L ${points[points.length - 1].x.toFixed(1)} ${baseY.toFixed(1)} Z`
      : '';
    const redY = padY + innerH - clampNumber(criticalPercent, 0, 100) / 100 * innerH;
    const grid = [0, 25, 50, 75, 100].map(value => {
      const y = padY + innerH - (value / 100) * innerH;
      return `<line x1="${padX}" y1="${y}" x2="${width - padX}" y2="${y}" class="cart-room-chart-grid"></line><text x="10" y="${y + 4}" class="cart-room-chart-axis">${value}%</text>`;
    }).join('');
    const axisLabels = points.filter((_, index) => {
      if(points.length <= 4) return true;
      return index === 0 || index === points.length - 1 || index % Math.ceil(points.length / 4) === 0;
    }).map(item => `<text x="${item.x}" y="${height - 4}" text-anchor="middle" class="cart-room-chart-axis">${escapeHtml(item.label)}</text>`).join('');

    return `
      <svg class="cart-room-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Gráfico de evolução do carrinho na sala">
        <defs>
          <linearGradient id="cartRoomFillGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#2f80ff" stop-opacity=".26"></stop>
            <stop offset="100%" stop-color="#2f80ff" stop-opacity=".03"></stop>
          </linearGradient>
        </defs>
        ${grid}
        <rect x="${padX}" y="${padY}" width="${innerW}" height="${innerH}" rx="8" class="cart-room-chart-band"></rect>
        <rect x="${padX}" y="${padY}" width="${innerW}" height="${Math.max(0, redY - padY)}" rx="8" class="cart-room-chart-critical-zone"></rect>
        <line x1="${padX}" y1="${redY}" x2="${width - padX}" y2="${redY}" class="cart-room-chart-critical"></line>
        ${areaPath ? `<path d="${areaPath}" class="cart-room-chart-area"></path>` : ''}
        <polyline points="${polyline}" class="cart-room-chart-line"></polyline>
        ${points.map(item => `
          <circle cx="${item.x}" cy="${item.y}" r="${item.tone === 'obstruction' ? 6 : 4.5}" class="cart-room-chart-point ${item.tone}">
            <title>${Math.round(item.value)}%${item.distanceMm !== null && item.distanceMm !== undefined ? ` - ${Math.round(item.distanceMm)} mm` : ''}</title>
          </circle>
        `).join('')}
        ${axisLabels}
      </svg>
    `;
  }

  function roomInsightTitle(mode){
    if(mode === 'chart') return 'Gráfico da sala';
    if(mode === 'telemetry') return 'Telemetria da sala';
    return 'Informações do gateway';
  }

  function roomInsightHeader(state, room, mode){
    return `
      <header class="cart-room-insight-head">
        <div>
          <span>${escapeHtml(roomInsightTitle(mode))}</span>
          <h2>${escapeHtml(room.name)}</h2>
          <p><i class="cart-room-online-dot" aria-hidden="true"></i> Comunicando</p>
        </div>
      </header>
    `;
  }

  function renderRoomInfoMode(state, room){
    return `
      <section class="cart-room-info-layout gateway-only">
        <article class="cart-room-info-card">
          <h3>Gateway</h3>
          <div><span>Identificação</span><strong>${escapeHtml(formatGatewayShort(room.gatewayDeviceId))}</strong></div>
          <div><span>Fabricante</span><strong>MOKO</strong></div>
          <div><span>Modelo</span><strong>MKGW4</strong></div>
          <div><span>Tecnologia</span><strong>BLE + 4G</strong></div>
          <div><span>Status</span><strong><i class="cart-room-online-dot" aria-hidden="true"></i> Comunicando</strong></div>
        </article>
      </section>
    `;
  }

  function renderRoomChartMode(state, room, view = 'summary'){
    const summary = roomOperationalSummary(state, room);
    const demand = roomDemandSummary(state, room);
    const graphEyebrow = `BLOCO - ${roomBlockLabel(room).toUpperCase()}`;
    const graphTitle = view === 'detail' ? 'Ciclos do carrinho' : 'Demanda do bloco';
    const graphDesc = view === 'detail'
      ? 'Nível oficial por ciclo, limite crítico e tempo cheio.'
      : 'Horários de maior pressão para orientar a equipe.';
    const metricCards = [
      { label:'Tempo até crítico', value:summary.timeToCriticalLabel, note:'Do início da leitura ao limite.' },
      { label:'Em crítico', value:summary.timeInCriticalLabel, note:summary.fullCount ? 'Aguardando troca.' : 'Sem crítico ativo.' },
      { label:'Troca após alerta', value:summary.exchangeLabel, note:'Medida a partir do crítico.' },
      { label:'Pico do período', value:summary.peakLabel, note:`${summary.peakAtLabel}${summary.peakDistanceLabel ? ` - ${summary.peakDistanceLabel}` : ''}` },
      { label:'Obstruções', value:String(summary.obstructionCount), note:'Saltos ou leituras incoerentes.' },
      { label:'Perdidos', value:String(summary.lostCount), note:'Sem comunicação ativa.' }
    ];
    const chartCards = view === 'detail'
      ? [
        { label:'Tempo até crítico', value:summary.timeToCriticalLabel, note:'Ciclo atual.' },
        { label:'Cheio', value:summary.timeInCriticalLabel, note:summary.fullCount ? 'Em andamento.' : 'Sem crítico.' },
        { label:'Troca', value:summary.exchangeLabel, note:'Depois do alerta.' },
        { label:'Obstruções', value:String(summary.obstructionCount), note:'Falhas técnicas.' }
      ]
      : [
        { label:'Pico do bloco', value:demand.peak?.label || '--', note:demand.peak ? demandScoreLabel(demand.peak.score) : 'Sem dados.' },
        { label:'Pressão atual', value:demand.current ? demandScoreLabel(demand.current.score) : '--', note:demand.current?.fill !== null && demand.current?.fill !== undefined ? `${Math.round(demand.current.fill)}% no horário.` : 'Sem leitura.' },
        { label:'Trocas hoje', value:String(demand.exchangeTotal), note:'Entradas/trocas.' },
        { label:'Falhas hoje', value:String(demand.obstructionTotal), note:'Obstrução ou sensor.' }
      ];
    const visibleCards = chartCards;
    return `
      <section class="cart-room-chart-layout graph-only">
        <article class="graph-main-card cart-room-graph-card cart-room-graph-operational">
          <div class="graph-main-head">
            <div>
              <div class="graph-eyebrow">${escapeHtml(graphEyebrow)}</div>
              <div class="graph-h1">${escapeHtml(graphTitle)}</div>
              <div class="graph-desc">${escapeHtml(graphDesc)}</div>
            </div>
            <div class="cart-room-chart-view">
              <button type="button" class="${view === 'summary' ? 'active' : ''}" data-room-insight-mode="chart-summary" data-room-id="${escapeHtml(room.id)}">Resumido</button>
              <button type="button" class="${view === 'detail' ? 'active' : ''}" data-room-insight-mode="chart-detail" data-room-id="${escapeHtml(room.id)}">Detalhado</button>
            </div>
          </div>
          <div class="graph-wrap cart-room-operational-wrap">
            <div class="graph-legend">
              ${roomChartLegendHtml(view)}
            </div>
            <div class="graph-box">
              ${roomChartSvg(state, room, view)}
            </div>
          </div>
          <div class="graph-summary cart-room-graph-summary operational">
            ${visibleCards.map(card => `
              <div class="graph-stat">
                <div class="graph-stat-k">${escapeHtml(card.label)}</div>
                <div class="graph-stat-v">${escapeHtml(card.value)}</div>
                <div class="graph-stat-sub">${escapeHtml(card.note)}</div>
              </div>
            `).join('')}
          </div>
        </article>
      </section>
    `;
  }

  function parseRoomChartMode(mode){
    const raw = String(mode || 'chart-detail-day');
    const pieces = raw.split('-');
    const validViews = new Set(['summary', 'detail']);
    const validPeriods = new Set(['day', 'week', 'month', 'custom']);
    let view = 'detail';
    let period = 'day';
    pieces.slice(1).forEach(piece => {
      if(validViews.has(piece)) view = piece;
      if(validPeriods.has(piece)) period = piece;
    });
    return { view, period, mode:`chart-${view}-${period}` };
  }

  function roomChartModeString(view, period){
    const nextView = view === 'summary' ? 'summary' : 'detail';
    const nextPeriod = ['day', 'week', 'month', 'custom'].includes(period) ? period : 'day';
    return `chart-${nextView}-${nextPeriod}`;
  }

  function startOfLocalDayMs(value){
    const date = new Date(value || Date.now());
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  function addDaysMs(value, amount){
    const date = new Date(value);
    date.setDate(date.getDate() + amount);
    return date.getTime();
  }

  function roomChartPeriodMeta(period, events, samples = []){
    const now = Date.now();
    if(period === 'week'){
      return {
        key:'week',
        title:'últimos 7 dias',
        range:'Exibir por: 7 dias',
        start:now - 7 * 24 * 60 * 60000,
        end:now,
        maxPoints:40
      };
    }
    if(period === 'month'){
      return {
        key:'month',
        title:'últimos 30 dias',
        range:'Exibir por: 30 dias',
        start:now - 30 * 24 * 60 * 60000,
        end:now,
        maxPoints:44
      };
    }
    if(period === 'custom'){
      const eventTimes = (events || [])
        .map(event => event._time)
        .filter(Number.isFinite);
      const sampleTimes = (samples || [])
        .map(sample => sample.time)
        .filter(Number.isFinite);
      const times = [...eventTimes, ...sampleTimes];
      const start = times.length ? Math.min(...times) : now - 48 * 60 * 60000;
      return {
        key:'custom',
        title:'histórico disponível',
        range:'Exibir por: histórico',
        start,
        end:now,
        maxPoints:52
      };
    }
    const start = now - 24 * 60 * 60000;
    return {
      key:'day',
      title:'ultimas 24 horas',
      range:'Exibir por: 24 horas',
      start,
      end:now,
      maxPoints:46
    };
  }

  function chartTickLabel(value, period, span = 0){
    const date = new Date(value);
    if(Number.isNaN(date.getTime())) return '--';
    if(period === 'day' || (period === 'custom' && span <= 48 * 60 * 60000)){
      return date.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
    }
    return date.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
  }

  function chartEventClock(value){
    const date = new Date(value || 0);
    if(Number.isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
  }

  function chartEventDateTime(value){
    const date = new Date(value || 0);
    if(Number.isNaN(date.getTime())) return '--';
    return `${date.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' })} ${date.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })}`;
  }

  function roomChartBucketPoints(points, start, end, maxPoints){
    if(points.length <= maxPoints) return points;
    const span = Math.max(1, end - start);
    const bucketMs = span / maxPoints;
    const buckets = new Map();
    points.forEach(point => {
      const index = Math.max(0, Math.min(maxPoints - 1, Math.floor((point.time - start) / bucketMs)));
      const current = buckets.get(index);
      if(!current || point.value >= current.value){
        buckets.set(index, {
          ...point,
          time:Math.min(end, start + (index + 0.5) * bucketMs)
        });
      }
    });
    return Array.from(buckets.values()).sort((a, b) => a.time - b.time);
  }

  function roomChartSamples(state, room){
    const roomCartIds = new Set(state.carts.filter(cart => cart.roomId === room.id).map(cart => cart.id));
    const backendSamples = (state.backendChartSamples || [])
      .filter(sample => sample.roomId === room.id || roomCartIds.has(sample.cartId))
      .filter(sample => finiteNumberOrNull(sample.fill) !== null)
      .map(sample => ({
        time:new Date(sample.ts || 0).getTime(),
        value:clampNumber(finiteNumberOrNull(sample.fill), 0, 100),
        ts:sample.ts,
        source:{ ...sample, type:sample.status === 'critical' ? 'critical' : 'reading' },
        tone:sample.status === 'critical' ? 'critical' : 'free',
        cartName:sample.cartName || '',
        cartId:sample.cartId || '',
        roomId:sample.roomId || room.id
      }))
      .filter(sample => Number.isFinite(sample.time))
      .sort((a, b) => a.time - b.time);
    const events = roomChronologicalEvents(state, room)
      .filter(event => !isObstructionEvent(event))
      .filter(event => event.roomId === room.id || roomCartIds.has(event.cartId));
    if(backendSamples.length){
      return { events, samples:backendSamples };
    }
    const eventSamples = events
      .filter(event => finiteNumberOrNull(event.fill) !== null)
      .map(event => ({
        time:event._time,
        value:clampNumber(finiteNumberOrNull(event.fill), 0, 100),
        ts:event.ts,
        source:event,
        tone:isCriticalEvent(event) ? 'critical' : 'free',
        cartName:event.cartName || '',
        cartId:event.cartId || '',
        roomId:event.roomId || room.id
      }));
    const cartSamples = roomCartsForDetails(state, room)
      .filter(cart => !isObstructedCart(cart))
      .map(cart => {
        const ts = cart.lastReadingAt || new Date().toISOString();
        return {
          time:new Date(ts).getTime(),
          value:clampNumber(cartVisualFill(cart), 0, 100),
          ts,
          source:null,
          tone:fillTone(cart) === 'full' ? 'critical' : 'free',
          cartName:cartDisplayName(cart),
          cartId:cart.id || '',
          roomId:room.id
        };
      })
      .filter(sample => Number.isFinite(sample.time));
    return { events, samples:[...eventSamples, ...cartSamples].sort((a, b) => a.time - b.time) };
  }

  function detectCriticalCrossing(points, criticalPercent){
    return points.find(point => point.value >= criticalPercent) || null;
  }

  function detectExchangePoint(points, criticalPoint, criticalPercent){
    if(!criticalPoint) return null;
    return points.find(point => point.time > criticalPoint.time && point.value < criticalPercent) || null;
  }

  function eventLooksLikeRecurrence(event){
    const text = eventText(event);
    return event?.type === 'recurrence' || text.includes('recorr') || text.includes('segue');
  }

  function isNonCriticalReadingEvent(event){
    return event?.type === 'reading' && !isCriticalEvent(event) && !isObstructionEvent(event);
  }

  function inferExchangeEventsFromSamples(samples, officialExchangeEvents = []){
    const sorted = (samples || [])
      .filter(sample => sample && sample.cartId && Number.isFinite(sample.time))
      .sort((a, b) => a.time - b.time);
    const inferred = [];
    let current = null;
    let lastSwitchTime = null;
    sorted.forEach(sample => {
      if(!current){
        current = sample;
        return;
      }
      if(sample.cartId === current.cartId){
        current = sample;
        return;
      }
      const windowEnd = sample.time + 10 * 60 * 1000;
      const newFuture = sorted.filter(item => item.cartId === sample.cartId && item.time >= sample.time && item.time <= windowEnd).length;
      const oldFuture = sorted.filter(item => item.cartId === current.cartId && item.time > sample.time && item.time <= windowEnd).length;
      const recentlySwitched = lastSwitchTime !== null && Math.abs(sample.time - lastSwitchTime) <= 12 * 60 * 1000;
      if(newFuture < 2 || oldFuture > 1 || recentlySwitched) return;
      const duplicateOfficial = officialExchangeEvents.some(event => Math.abs((event._time || 0) - sample.time) <= 15 * 60 * 1000);
      if(!duplicateOfficial){
        inferred.push({
          id:`inferred-exchange-${current.cartId}-${sample.cartId}-${sample.ts || sample.time}`,
          key:`inferred-exchange|${current.cartId}|${sample.cartId}|${sample.ts || sample.time}`,
          type:'exchange',
          inferred:true,
          _time:sample.time,
          ts:sample.ts || new Date(sample.time).toISOString(),
          roomId:sample.roomId || current.roomId || '',
          cartId:current.cartId,
          cartName:current.cartName || current.cartId,
          title:'Troca de carrinho identificada',
          detail:`${current.cartName || current.cartId} saiu; ${sample.cartName || sample.cartId} entrou.`
        });
      }
      lastSwitchTime = sample.time;
      current = sample;
    });
    return inferred;
  }

  function dedupeExchangeEvents(events){
    return (events || [])
      .filter(event => event && Number.isFinite(event._time))
      .sort((a, b) => a._time - b._time)
      .reduce((acc, event) => {
        const duplicate = acc.some(item => Math.abs(item._time - event._time) <= 15 * 60 * 1000);
        if(!duplicate) acc.push(event);
        return acc;
      }, []);
  }

  function filterInferredExchangeEvents(inferredEvents, officialEvents){
    const official = (officialEvents || [])
      .filter(event => Number.isFinite(event._time))
      .sort((a, b) => a._time - b._time);
    const inferred = (inferredEvents || [])
      .filter(event => Number.isFinite(event._time))
      .sort((a, b) => a._time - b._time);
    if(!official.length) return inferred.slice(-1);
    return inferred.filter(event => event._time < official[0]._time).slice(-1);
  }

  function inferValidatedExchangeEventsFromSamples(samples){
    const sorted = (samples || [])
      .filter(sample => sample && sample.cartId && Number.isFinite(sample.time))
      .sort((a, b) => a.time - b.time);
    const exchanges = [];
    let previous = null;
    sorted.forEach(sample => {
      if(!previous){
        previous = sample;
        return;
      }
      if(sample.cartId === previous.cartId){
        previous = sample;
        return;
      }
      const returningOld = sorted.find(item => item.cartId === previous.cartId && item.time > sample.time) || null;
      const returnGap = returningOld ? returningOld.time - sample.time : null;
      if(returnGap !== null && returnGap <= CHART_EXCHANGE_MIN_RETURN_MS){
        previous = sample;
        return;
      }
      exchanges.push({
        id:`validated-exchange-${previous.cartId}-${sample.cartId}-${sample.ts || sample.time}`,
        key:`validated-exchange|${previous.cartId}|${sample.cartId}|${sample.ts || sample.time}`,
        type:'exchange',
        inferred:true,
        validated:true,
        _time:sample.time,
        ts:sample.ts || new Date(sample.time).toISOString(),
        roomId:sample.roomId || previous.roomId || '',
        cartId:previous.cartId,
        cartName:previous.cartName || previous.cartId,
        enteringCartId:sample.cartId,
        enteringCartName:sample.cartName || sample.cartId,
        title:'Troca de carrinho validada',
        detail:`${previous.cartName || previous.cartId} saiu; ${sample.cartName || sample.cartId} entrou. ${returningOld ? `${previous.cartName || previous.cartId} voltou depois de ${formatCartDurationFromMs(returnGap, '--')}.` : `${previous.cartName || previous.cartId} ainda não voltou a comunicar.`}`
      });
      previous = sample;
    });
    return dedupeExchangeEvents(exchanges);
  }

  function criticalCycleForExchange(samples, exchange, criticalPercent){
    if(!exchange) return null;
    const cartId = exchange.cartId || '';
    const exchangeTime = exchange._time;
    if(!cartId || !Number.isFinite(exchangeTime)) return null;
    const cartSamples = (samples || [])
      .filter(sample => sample.cartId === cartId && Number.isFinite(sample.time) && sample.time < exchangeTime)
      .sort((a, b) => a.time - b.time);
    const lastSample = cartSamples[cartSamples.length - 1] || null;
    if(!lastSample || lastSample.value < criticalPercent) return null;
    let criticalStart = lastSample.time;
    for(let index = cartSamples.length - 1; index >= 0; index -= 1){
      const sample = cartSamples[index];
      if(sample.value < criticalPercent) break;
      criticalStart = sample.time;
    }
    return {
      exchange,
      criticalStart,
      criticalEnd:exchangeTime,
      cartId
    };
  }

  function roomChartBoundaryPoint(samples, meta, criticalPercent){
    const previous = samples
      .filter(point => point.time < meta.start)
      .sort((a, b) => b.time - a.time)[0];
    if(previous){
      return { ...previous, time:meta.start };
    }
    return {
      time:meta.start,
      value:0,
      tone:'free',
      cartName:''
    };
  }

  function normalizeRoomChartPoints(samples, points, meta, criticalPercent){
    const sorted = points.slice().sort((a, b) => a.time - b.time);
    const startPoint = roomChartBoundaryPoint(samples, meta, criticalPercent);
    const visibleEnd = Math.min(meta.end, Date.now());
    if(!sorted.length){
      return [
        startPoint,
        { ...startPoint, time:visibleEnd }
      ];
    }
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    if(first.time > meta.start){
      sorted.unshift(startPoint);
    }
    if(last.time < visibleEnd){
      sorted.push({ ...last, time:visibleEnd });
    }
    return sorted;
  }

  function roomOperationalChartModel(state, room, period = 'day'){
    const summary = roomOperationalSummary(state, room);
    const carts = roomCartsForDetails(state, room);
    const criticalPercent = carts.length
      ? Math.max(...carts.map(cart => cartRedPercent(cart)))
      : DEFAULT_CART_CALIBRATION.redPercent;
    const chartData = roomChartSamples(state, room);
    const meta = roomChartPeriodMeta(period, chartData.events, chartData.samples);
    const inRangeEvents = chartData.events.filter(event => event._time >= meta.start && event._time <= meta.end);
    const periodSamples = chartData.samples.filter(point => point.time >= meta.start && point.time <= meta.end);
    let points = periodSamples;
    points = roomChartBucketPoints(points, meta.start, meta.end, meta.maxPoints);
    points = normalizeRoomChartPoints(chartData.samples, points, meta, criticalPercent);

    const criticalPoint = detectCriticalCrossing(points, criticalPercent);
    const detectedExchangePoint = detectExchangePoint(points, criticalPoint, criticalPercent);
    const criticalEvents = inRangeEvents.filter(event => isCriticalEvent(event) && !isObstructionEvent(event));
    const alertEvents = inRangeEvents.filter(event => event.type === 'alert' && !isObstructionEvent(event));
    const recurrenceEvents = inRangeEvents.filter(event => eventLooksLikeRecurrence(event) && isCriticalEvent(event));
    const exchangeEvents = dedupeExchangeEvents(
      inferValidatedExchangeEventsFromSamples(chartData.samples)
        .filter(event => event._time >= meta.start && event._time <= meta.end)
    );
    const criticalCycles = exchangeEvents
      .map(exchange => criticalCycleForExchange(periodSamples, exchange, criticalPercent))
      .filter(Boolean);
    const responsePairForExchange = cycle => {
      const exchange = cycle.exchange;
      const responseCartId = exchange?.cartId || '';
      const sameResponseCart = event => !responseCartId || event.cartId === responseCartId;
      const responseAlert = alertEvents
        .filter(event => sameResponseCart(event) && event._time < exchange._time)
        .filter(event => event._time >= cycle.criticalStart)
        .filter(event => isCriticalEvent(event) && !eventLooksLikeRecurrence(event))
        .sort((a, b) => a._time - b._time)[0] || null;
      return responseAlert ? { exchange, alert:responseAlert, cycle } : null;
    };
    const responsePair = criticalCycles
      .slice()
      .reverse()
      .map(responsePairForExchange)
      .find(Boolean) || null;
    const exchangeEvent = responsePair?.exchange || exchangeEvents[exchangeEvents.length - 1] || null;
    const alertEvent = responsePair?.alert
      || (!exchangeEvent ? (alertEvents.find(event => isCriticalEvent(event) && !eventLooksLikeRecurrence(event)) || criticalEvents[0] || null) : null);
    const recurrenceEvent = recurrenceEvents.find(event => !alertEvent || event._time > alertEvent._time)
      || criticalEvents.find((event, index) => index > 0 && (!alertEvent || event._time > alertEvent._time))
      || null;
    const alertTime = alertEvent?._time || criticalPoint?.time || null;
    const recurrenceTime = recurrenceEvent?._time || null;
    const exchangeTime = exchangeEvent?._time || detectedExchangePoint?.time || null;
    const responseLabel = alertTime && exchangeTime && exchangeTime >= alertTime
      ? formatCartDurationFromMs(exchangeTime - alertTime, '--')
      : (criticalPoint && !exchangeTime ? 'em aberto' : '--');
    const timeToCritical = criticalPoint
      ? formatCartDurationFromMs(Math.max(0, criticalPoint.time - points[0].time), '--')
      : 'sem crítico';
    return {
      summary,
      period:meta,
      points,
      criticalPercent:Math.round(criticalPercent || 50),
      alertTime,
      recurrenceTime,
      exchangeTime,
      exchangeEvents,
      criticalCycles,
      responseSegments:criticalCycles.map(cycle => {
        const alert = responsePairForExchange(cycle)?.alert || null;
        return {
          exchangeTime:cycle.exchange._time,
          criticalStart:cycle.criticalStart,
          alertTime:alert?._time || null,
          cartId:cycle.cartId
        };
      }),
      eventRows:exchangeEvents.map((event, index) => {
        const cycle = criticalCycles.find(item => item.exchange === event) || null;
        const pair = cycle ? responsePairForExchange(cycle) : null;
        const responseMinutes = pair?.alert
          ? Math.max(0, Math.round((event._time - pair.alert._time) / 60000))
          : null;
        return {
          type:'exchange',
          label:`Troca ${index + 1}${event.inferred ? ' identificada' : ''}`,
          time:event._time,
          detail:event.detail || event.title || 'Troca de carrinho registrada.',
          response:responseMinutes === null ? 'sem alerta no ciclo' : formatCartDurationFromMs(responseMinutes * 60000, '--')
        };
      }),
      responseLabel,
      timeToCritical,
      alertTotal:alertEvents.filter(event => isCriticalEvent(event) && !eventLooksLikeRecurrence(event)).length || (criticalPoint ? 1 : 0),
      recurrenceTotal:recurrenceEvents.length,
      exchangeTotal:exchangeEvents.length || (detectedExchangePoint ? 1 : 0),
      roomName:room.name || roomBlockLabel(room)
    };
  }

  function layoutChartLabels(items){
    const sorted = items
      .filter(item => Number.isFinite(item.x))
      .sort((a, b) => a.x - b.x);
    const lanes = [];
    return sorted.map(item => {
      const lane = lanes.findIndex(lastX => Math.abs(item.x - lastX) >= 112);
      if(lane >= 0){
        lanes[lane] = item.x;
        return {
          ...item,
          labelX:clampNumber(item.x, 82, 994),
          level:lane,
          hiddenLabel:false
        };
      }
      if(lanes.length < 5){
        lanes.push(item.x);
        return {
          ...item,
          labelX:clampNumber(item.x, 82, 994),
          level:lanes.length - 1,
          hiddenLabel:false
        };
      }
      return {
        ...item,
        labelX:clampNumber(item.x, 82, 994),
        level:4,
        hiddenLabel:true
      };
    });
  }

  function renderRoomOperationalGraphSvg(model, view = 'detail'){
    const detailed = view !== 'summary';
    const left = 72;
    const top = detailed ? 112 : 72;
    const width = 904;
    const height = detailed ? 206 : 176;
    const bottom = top + height;
    const endY = detailed ? 470 : 350;
    const span = Math.max(1, model.period.end - model.period.start);
    const x = time => left + (clampNumber(time, model.period.start, model.period.end) - model.period.start) / span * width;
    const y = value => bottom - (clampNumber(value, 0, 100) / 100) * height;
    const points = model.points.map(point => ({
      ...point,
      x:x(point.time),
      y:y(point.value)
    }));
    const criticalY = y(model.criticalPercent);
    const stepPath = items => items.reduce((path, item, index) => {
      const px = item.x.toFixed(1);
      const py = item.y.toFixed(1);
      if(index === 0) return `M ${px} ${py}`;
      return `${path} H ${px} V ${py}`;
    }, '');
    const fullPath = stepPath(points);
    const areaPath = `${fullPath} L ${points[points.length - 1].x.toFixed(1)} ${bottom} L ${left} ${bottom} Z`;
    const lineSegments = points.slice(1).map((point, index) => {
      const previous = points[index];
      const critical = previous.value >= model.criticalPercent || point.value >= model.criticalPercent;
      return `<path d="M ${previous.x.toFixed(1)} ${previous.y.toFixed(1)} H ${point.x.toFixed(1)} V ${point.y.toFixed(1)}" class="${critical ? 'cart-op-line-critical' : 'cart-op-line'}"></path>`;
    }).join('');
    const tickCount = model.period.key === 'day' ? 8 : 6;
    const gridY = [0, 25, 50, 75, 100].map(value => {
      const gy = y(value);
      return `
        <line x1="${left}" y1="${gy}" x2="${left + width}" y2="${gy}" class="cart-op-grid"></line>
        <text x="${left - 14}" y="${gy + 5}" text-anchor="end" class="cart-op-axis">${value}%</text>
      `;
    }).join('');
    const gridX = Array.from({ length:tickCount + 1 }, (_, index) => model.period.start + (span * index) / tickCount).map(value => {
      const gx = x(value);
      return `
        <line x1="${gx}" y1="${top}" x2="${gx}" y2="${bottom}" class="cart-op-grid"></line>
        <text x="${gx}" y="${bottom + 26}" text-anchor="middle" class="cart-op-axis">${escapeHtml(chartTickLabel(value, model.period.key, span))}</text>
      `;
    }).join('');
    const exchangeItems = (model.exchangeEvents || []).map((event, index) => ({
      x:x(event._time),
      time:event._time,
      label:`Troca ${index + 1}`,
      detail:chartEventDateTime(event._time),
      tone:'green'
    }));
    const responseAlertItems = (model.responseSegments || [])
      .filter(segment => segment.alertTime)
      .map(segment => ({
        x:x(segment.alertTime),
        time:segment.alertTime,
        label:'Alerta gerado',
        tone:'red'
      }));
    const eventItems = [
      ...responseAlertItems,
      detailed && model.recurrenceTime ? { x:x(model.recurrenceTime), time:model.recurrenceTime, label:'Recorrencia', tone:'red' } : null,
      ...exchangeItems
    ].filter(Boolean);
    const eventSvg = eventItems.map(item => `
      <line x1="${item.x}" y1="${top - 8}" x2="${item.x}" y2="${detailed ? 428 : bottom}" class="cart-op-event-line ${item.tone}"></line>
    `).join('');
    const markerSvg = eventItems.map(item => {
      const valueAtMarker = points.reduce((best, point) => Math.abs(point.time - item.time) < Math.abs(best.time - item.time) ? point : best, points[0]);
      return `<circle cx="${item.x}" cy="${y(valueAtMarker?.value || 0)}" r="5" class="${item.tone === 'green' ? 'cart-op-marker-green' : 'cart-op-marker-red'}"><title>${escapeHtml(`${item.label} - ${chartEventDateTime(item.time)}`)}</title></circle>`;
    }).join('');
    const eventLabelSvg = detailed ? layoutChartLabels(exchangeItems)
      .filter(item => !item.hiddenLabel)
      .map(item => {
        const yOffset = top - 30 - item.level * 18;
        return `
          <text x="${item.labelX}" y="${yOffset}" text-anchor="middle" class="cart-op-event-label ${item.tone}">
            <tspan x="${item.labelX}" dy="0">${escapeHtml(item.label)}</tspan>
            <tspan x="${item.labelX}" dy="13">${escapeHtml(chartEventDateTime(item.time))}</tspan>
          </text>
        `;
      }).join('') : '';
    const stateY = detailed ? 386 : 306;
    const legendY = detailed ? 438 : 0;
    const responseStateSegments = (model.responseSegments || []).map(segment => {
      const criticalStartX = x(segment.criticalStart);
      const alertX = segment.alertTime ? x(segment.alertTime) : null;
      const exchangeX = x(segment.exchangeTime);
      const redEndX = alertX || exchangeX;
      return `
        <rect x="${criticalStartX}" y="${stateY}" width="${Math.max(0, redEndX - criticalStartX)}" height="16" class="cart-op-state critical"></rect>
        ${alertX ? `<rect x="${alertX}" y="${stateY}" width="${Math.max(0, exchangeX - alertX)}" height="16" class="cart-op-state exchanged"></rect>` : ''}
      `;
    }).join('');
    const stateBar = detailed ? `
      <rect x="${left}" y="${stateY}" width="${width}" height="16" rx="2" class="cart-op-state free"></rect>
      ${responseStateSegments}
      <text x="${left}" y="${stateY + 42}" text-anchor="middle" class="cart-op-axis">${escapeHtml(chartTickLabel(model.period.start, model.period.key, span))}</text>
      <text x="${left + width}" y="${stateY + 42}" text-anchor="middle" class="cart-op-axis">${escapeHtml(chartTickLabel(model.period.end, model.period.key, span))}</text>
      <circle cx="110" cy="${legendY}" r="5" class="cart-op-dot free"></circle>
      <text x="130" y="${legendY + 5}" class="cart-op-legend-text">Livre</text>
      <circle cx="220" cy="${legendY}" r="5" class="cart-op-dot critical"></circle>
      <text x="240" y="${legendY + 5}" class="cart-op-legend-text">Crítico</text>
      <circle cx="632" cy="${legendY}" r="5" class="cart-op-dot exchanged"></circle>
      <text x="652" y="${legendY + 5}" class="cart-op-legend-text">Troca concluída</text>

      <polyline points="220,${legendY + 14} 220,${legendY + 40} 300,${legendY + 40}" class="cart-op-response-link red"></polyline>
      <polygon points="300,${legendY + 40} 292,${legendY + 35} 292,${legendY + 45}" class="cart-op-response-arrow red"></polygon>
      <polyline points="632,${legendY + 14} 632,${legendY + 40} 570,${legendY + 40}" class="cart-op-response-link green"></polyline>
      <polygon points="570,${legendY + 40} 578,${legendY + 35} 578,${legendY + 45}" class="cart-op-response-arrow green"></polygon>
      <rect x="300" y="${legendY + 18}" width="270" height="48" rx="6" class="cart-op-response-box"></rect>
      <circle cx="330" cy="${legendY + 42}" r="9" class="cart-op-response-clock"></circle>
      <path d="M330 ${legendY + 36} V${legendY + 43} L335 ${legendY + 47}" class="cart-op-response-clock-line"></path>
      <text x="350" y="${legendY + 38}" class="cart-op-response-title">Tempo de resposta: ${escapeHtml(model.responseLabel)}</text>
      <text x="350" y="${legendY + 56}" class="cart-op-response-sub">Entre o alerta gerado e a troca concluída.</text>
    ` : '';
    return `
      <svg class="cart-op-graph-svg ${detailed ? 'is-detail' : 'is-summary'}" viewBox="0 0 1080 ${detailed ? 530 : 370}" role="img" aria-label="Evolução operacional da ocupação da sala">
        <defs>
          <linearGradient id="cartOpAreaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#1d7cff" stop-opacity=".18"></stop>
            <stop offset="100%" stop-color="#1d7cff" stop-opacity=".06"></stop>
          </linearGradient>
        </defs>
        <text x="12" y="${top - 40}" class="cart-op-label">% ocupação</text>
        <rect x="${left}" y="${top}" width="${width}" height="${height}" fill="#fff"></rect>
        ${gridY}
        ${gridX}
        <line x1="${left}" y1="${criticalY}" x2="${left + width}" y2="${criticalY}" class="cart-op-critical-limit"></line>
        <text x="${left + 10}" y="${criticalY - 10}" class="cart-op-critical-text">Limite crítico ${model.criticalPercent}%</text>
        <path d="${areaPath}" class="cart-op-area"></path>
        ${lineSegments}
        ${points.map((point, index) => index === 0 || index === points.length - 1
          ? `<circle cx="${point.x}" cy="${point.y}" r="4.5" class="${point.value >= model.criticalPercent ? 'cart-op-marker-red' : 'cart-op-marker-blue'}"></circle>`
          : '').join('')}
        ${eventSvg}
        ${markerSvg}
        ${eventLabelSvg}
        ${stateBar}
      </svg>
    `;
  }

  function renderRoomChartMode(state, room, view = 'detail', period = 'day'){
    const activeView = view === 'summary' ? 'summary' : 'detail';
    const activePeriod = ['day', 'week', 'month', 'custom'].includes(period) ? period : 'day';
    const model = roomOperationalChartModel(state, room, activePeriod);
    const periodOptions = [
      ['day', 'Diário'],
      ['week', 'Semanal'],
      ['month', 'Mensal'],
      ['custom', 'Personalizado']
    ];
    const cards = [
      { label:'Tempo até crítico', value:model.timeToCritical },
      { label:'Tempo de retirada', value:model.responseLabel, red:model.responseLabel !== '--' && model.responseLabel !== 'em aberto' },
      { label:'Alertas críticos', value:String(model.alertTotal), red:model.alertTotal > 0 },
      { label:'Recorrências', value:String(model.recurrenceTotal), red:model.recurrenceTotal > 0 },
      { label:'Trocas registradas', value:String(model.exchangeTotal), green:model.exchangeTotal > 0 }
    ];
    const allEventRows = model.eventRows || [];
    const eventRows = allEventRows.slice(-3);
    const hiddenEventRows = Math.max(0, allEventRows.length - eventRows.length);
    return `
      <section class="cart-op-chart-shell">
        <header class="cart-op-chart-head">
          <div class="cart-op-title">
            <span class="cart-op-title-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 19V6M10 19V3M16 19v-9M3 19h18"></path></svg>
            </span>
            <h2>Análise operacional - ${escapeHtml(model.roomName)}</h2>
          </div>
        </header>
        <div class="cart-op-toolbar">
          <div class="cart-op-periods" aria-label="Período do gráfico">
            ${periodOptions.map(([key, label]) => `
              <button type="button" class="${activePeriod === key ? 'active' : ''}" data-room-insight-mode="${escapeHtml(roomChartModeString(activeView, key))}" data-room-id="${escapeHtml(room.id)}">${escapeHtml(label)}</button>
            `).join('')}
          </div>
          <div class="cart-op-view">
            <button type="button" class="${activeView === 'summary' ? 'active' : ''}" data-room-insight-mode="${escapeHtml(roomChartModeString('summary', activePeriod))}" data-room-id="${escapeHtml(room.id)}">Resumido</button>
            <button type="button" class="${activeView === 'detail' ? 'active' : ''}" data-room-insight-mode="${escapeHtml(roomChartModeString('detail', activePeriod))}" data-room-id="${escapeHtml(room.id)}">Detalhado</button>
          </div>
        </div>
        <article class="cart-op-chart-card">
          <div class="cart-op-chart-card-head">
            <h3>Evolução da ocupação - ${escapeHtml(model.period.title)}</h3>
            <span>${escapeHtml(model.period.range)}</span>
          </div>
          ${renderRoomOperationalGraphSvg(model, activeView)}
        </article>
        <div class="cart-op-event-list">
          ${eventRows.length ? eventRows.map(row => `
            <span>
              <i class="is-${escapeHtml(row.type)}"></i>
              <strong>${escapeHtml(row.label)}</strong>
              <small>${escapeHtml(chartEventDateTime(row.time))}</small>
              <em>${escapeHtml(row.response)}</em>
            </span>
          `).join('') : '<span><strong>Sem trocas no periodo</strong><small>--</small><em>sem resposta</em></span>'}
          ${hiddenEventRows ? `<span class="is-summary"><strong>Mais ${hiddenEventRows} troca(s)</strong><small>${escapeHtml(model.period.title)}</small><em>Veja a lista completa na telemetria.</em></span>` : ''}
        </div>
        <div class="cart-op-kpis">
          ${cards.map(card => `
            <span class="${card.red ? 'is-red' : ''} ${card.green ? 'is-green' : ''}">
              <small>${escapeHtml(card.label)}</small>
              <strong>${escapeHtml(card.value)}</strong>
            </span>
          `).join('')}
        </div>
      </section>
    `;
  }

  function eventToneClass(type){
    if(type === 'critical') return 'critical';
    if(type === 'transit') return 'transit';
    if(type === 'room') return 'room';
    return 'reading';
  }

  function renderRoomTelemetryMode(state, room){
    const summary = roomOperationalSummary(state, room);
    const timelineEvents = summary.events.slice(-120).reverse().map(event => {
      const critical = isCriticalEvent(event);
      const obstruction = isObstructionEvent(event);
      const roomEntry = isRoomEntryEvent(event);
      return {
        time:formatDateTime(event.ts),
        tone:obstruction || event.type === 'alert' ? 'alert' : (critical ? 'critical' : (event.type === 'transit' ? 'offline' : (roomEntry ? 'normal' : 'limit'))),
        title:event.title || (critical ? 'Crítico iniciado' : 'Leitura registrada'),
        detail:event.detail || ''
      };
    });
    return `
      <section class="cart-room-telemetry-layout">
        <article class="cart-room-telemetry-compact cart-room-telemetry-operational">
          <div class="telemetry-compact-head">
            <div>
              <strong>Telemetria operacional</strong>
              <small>Eventos, duração e ações da sala.</small>
            </div>
            <span class="telemetry-compact-state ${summary.fullCount ? 'is-critical' : 'is-normal'}">
              <i>${getOperationalTelemetryIcon(summary.fullCount ? 'critical' : 'limit')}</i>
              <b>${escapeHtml(summary.activeTitle)}</b>
              <em>${escapeHtml(summary.activeMain)}</em>
              <small>${escapeHtml(summary.activeSub)}</small>
            </span>
          </div>
          <div class="telemetry-compact-grid cart-room-telemetry-grid">
            <span><small>Carrinho vazio</small><strong>${summary.freeCount}</strong></span>
            <span><small>Tempo até crítico</small><strong>${escapeHtml(summary.timeToCriticalLabel)}</strong></span>
            <span><small>Crítico</small><strong>${escapeHtml(summary.timeInCriticalLabel)}</strong></span>
            <span><small>Sem comunicação</small><strong>${summary.lostCount}</strong></span>
          </div>
          <div class="cart-telemetry-channel">
            <small>Canal de alerta</small>
            <span><i>${getOperationalTelemetryIcon('alerts')}</i><b>Painel dashboard</b><strong>${summary.panelAlerts}</strong></span>
          </div>
          <div class="telemetry-variation-strip cart-telemetry-ops-strip">
            <span><small>Início do crítico</small><strong>${escapeHtml(summary.criticalStartLabel)}</strong></span>
            <span><small>Pico atingido</small><strong>${escapeHtml(summary.peakLabel)}</strong><em>${escapeHtml(summary.peakAtLabel)}</em></span>
            <span><small>Calibração crítica</small><strong>${escapeHtml(summary.criticalCalibrationLabel)}</strong></span>
            <span><small>Troca do carrinho</small><strong>${escapeHtml(summary.exchangeLabel)}</strong></span>
          </div>
          <details class="cart-telemetry-timeline-toggle">
            <summary>
              <span>Expandir linha do tempo</span>
              <i aria-hidden="true">⌄</i>
            </summary>
            <div class="telemetry-expanded-content">
              <div class="telemetry-timeline-head">
                <div><strong>Linha do tempo</strong><small>Leituras, alertas e trocas vinculados a esta sala.</small></div>
                <span>Eventos da sala</span>
              </div>
              <div class="telemetry-timeline">
                ${timelineEvents.length ? timelineEvents.map(event => `
                  <div class="telemetry-event ${telemetryToneClass(event.tone)}">
                    <time>${escapeTelemetryText(event.time)}</time>
                    <span class="telemetry-event-dot"></span>
                    <div><strong>${escapeTelemetryText(event.title)}</strong><small>${escapeTelemetryText(event.detail)}</small></div>
                  </div>
                `).join('') : '<p class="cart-room-empty">Nenhum evento registrado ainda.</p>'}
              </div>
            </div>
          </details>
        </article>
      </section>
    `;
  }

  function renderRoomInsight(roomId, mode = 'info'){
    const state = readState();
    const room = state.rooms.find(item => item.id === roomId);
    const content = document.getElementById('cartRoomInsightContent');
    const overlay = document.getElementById('cartRoomInsightOverlay');
    if(!room || !content || !overlay) return;
    const rawMode = String(mode || 'info');
    const baseMode = rawMode.startsWith('chart') ? 'chart' : rawMode;
    const chartMode = parseRoomChartMode(rawMode);
    const body = baseMode === 'chart'
      ? renderRoomChartMode(state, room, chartMode.view, chartMode.period)
      : baseMode === 'telemetry'
        ? renderRoomTelemetryMode(state, room)
        : renderRoomInfoMode(state, room);
    overlay.dataset.roomId = room.id;
    overlay.dataset.mode = baseMode === 'chart' ? chartMode.mode : rawMode;
    content.innerHTML = `${baseMode === 'chart' ? '' : roomInsightHeader(state, room, baseMode)}${body}`;
  }

  function openRoomInsight(roomId, mode = 'info'){
    const overlay = document.getElementById('cartRoomInsightOverlay');
    if(!overlay) return;
    renderRoomInsight(roomId, mode);
    overlay.hidden = false;
  }

  function closeRoomInsight(){
    const overlay = document.getElementById('cartRoomInsightOverlay');
    if(overlay) overlay.hidden = true;
  }

  function transitStepsForCart(cart){
    const step = Math.max(1, Math.min(4, Number(cart.transitStep || 1)));
    const labels = ['Saiu da sala', 'Residuos', 'Higienizacao', 'Nova sala'];
    return labels.map((label, index) => `
      <span class="${index + 1 <= step ? 'done' : ''}">
        <i>${index + 1 <= step ? '&#10003;' : index + 1}</i>
        <em>${label}</em>
      </span>
    `).join('');
  }

  function renderTransitModal(){
    const state = readState();
    const content = document.getElementById('cartTransitModalContent');
    if(!content) return;
    const transitCarts = state.carts.filter(cart => cart.locationStatus === 'transit');
    content.innerHTML = `
      <header class="cart-transit-modal-head">
        <span>Fluxo operacional</span>
        <h2>Carrinhos em trânsito</h2>
        <p>${transitCarts.length} carrinho${transitCarts.length === 1 ? '' : 's'} em deslocamento</p>
      </header>
      <div class="cart-transit-modal-list">
        ${transitCarts.length ? transitCarts.map(cart => `
          <article class="cart-transit-card">
            <div class="cart-transit-card-icon approved">${transitIcon()}</div>
            <div>
              <strong>${escapeHtml(cartDisplayName(cart))}</strong>
              <small>${escapeHtml(cart.lastSeen || 'sem leitura')}</small>
              <div class="cart-transit-route">${transitStepsForCart(cart)}</div>
            </div>
          </article>
        `).join('') : '<div class="cart-room-empty">Nenhum carrinho em trânsito agora.</div>'}
      </div>
    `;
  }

  function openTransitModal(){
    const overlay = document.getElementById('cartTransitModalOverlay');
    if(!overlay) return;
    renderTransitModal();
    overlay.hidden = false;
  }

  function closeTransitModal(){
    const overlay = document.getElementById('cartTransitModalOverlay');
    if(overlay) overlay.hidden = true;
  }

  function renderCartReportModal(){
    const state = readState();
    const content = document.getElementById('cartReportModalContent');
    if(!content) return;
    const events = Array.isArray(state.telemetryEvents) ? state.telemetryEvents : [];
    const fullCount = state.carts.filter(cart => fillTone(cart) === 'full').length;
    const lostCount = state.carts.filter(isLostCart).length;
    const freeCount = state.carts.filter(cart => fillTone(cart) === 'empty').length;
    content.innerHTML = `
      <header class="cart-transit-modal-head cart-report-modal-head">
        <span>Relatórios</span>
        <h2>Relatórios</h2>
        <p>Relatório analítico dos carrinhos.</p>
      </header>
      <details class="graph-mini-card graph-report-accordion cart-global-report-accordion" open>
        <summary>
          <span class="graph-report-icon">${getReportIcon()}</span>
          <span class="graph-report-summary-copy">
            <strong>Relatório Analítico</strong>
            <small>Tempo de retirada, alertas, trocas e histórico por sala</small>
          </span>
          <span class="graph-report-chevron" aria-hidden="true">⌄</span>
        </summary>
        <div class="cart-report-kpi-row">
          <span><small>Livres</small><strong>${freeCount}</strong></span>
          <span><small>Críticos</small><strong>${fullCount}</strong></span>
          <span><small>Perdidos</small><strong>${lostCount}</strong></span>
          <span><small>Eventos</small><strong>${events.length}</strong></span>
        </div>
        <div class="graph-report-list">
          <button class="graph-report-btn" disabled>Exportar PDF</button>
          <button class="graph-report-btn" disabled>Exportar Excel</button>
        </div>
      </details>
    `;
  }

  function openCartReportModal(){
    const overlay = document.getElementById('cartReportModalOverlay');
    if(!overlay) return;
    renderCartReportModal();
    overlay.hidden = false;
  }

  function closeCartReportModal(){
    const overlay = document.getElementById('cartReportModalOverlay');
    if(overlay) overlay.hidden = true;
  }

  function sortedCartAlerts(state){
    return (state.alerts || [])
      .slice()
      .sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0));
  }

  function acknowledgeCartAlert(alertId, acknowledgeAll = false){
    const state = readState();
    const now = new Date().toISOString();
    let changed = false;
    (state.alerts || []).forEach(alert => {
      if((acknowledgeAll || alert.id === alertId) && !alert.acknowledgedAt){
        alert.acknowledgedAt = now;
        alert.read = true;
        changed = true;
      }
    });
    if(changed){
      saveState(state);
      renderRooms();
    }
  }

  function playCartAlertSound(){
    if(!isEinsteinCartAlertContext()) return;
    try{
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if(!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const gain = ctx.createGain();
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.setValueAtTime(660, ctx.currentTime + .12);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + .02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + .38);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + .42);
      window.setTimeout(() => ctx.close?.(), 700);
    }catch(err){
      console.warn('Som de alerta bloqueado pelo navegador', err);
    }
  }

  function alertTypeClass(type){
    if(type === 'obstruction') return 'obstruction';
    if(type === 'sensor') return 'sensor';
    if(type === 'exchange') return 'exchange';
    if(type === 'recurrence') return 'recurrence';
    return 'critical';
  }

  function renderCartAlertPopup(alert){
    if(!alert){
      return `
        <div class="cart-alert-empty">
          <span class="cart-alert-mail-icon">${getAlertMailboxIcon()}</span>
          <strong>Nenhum alerta novo.</strong>
          <small>Os próximos alertas aparecerão aqui automaticamente.</small>
        </div>
      `;
    }
    const typeClass = alertTypeClass(alert.type);
    return `
      <article class="cart-alert-popup-card ${typeClass}">
        <span class="cart-alert-eyebrow">Alerta do painel</span>
        <h2>${escapeHtml(alert.title)}</h2>
        <p>${escapeHtml(alert.message || alert.detail || '')}</p>
        <div class="cart-alert-popup-grid">
          <span><small>Sala</small><strong>${escapeHtml(alert.roomName || roomNameForAlert(readState(), alert.roomId))}</strong></span>
          <span><small>Carrinho</small><strong>${escapeHtml(alert.cartName || 'C--')}</strong></span>
          <span><small>Horário</small><strong>${escapeHtml(formatDateTime(alert.ts))}</strong></span>
          <span><small>Tipo</small><strong>${escapeHtml(alertSeverityLabel(alert.type))}</strong></span>
        </div>
        ${alert.detail ? `<small class="cart-alert-detail">${escapeHtml(alert.detail)}</small>` : ''}
      </article>
    `;
  }

  function renderCartAlertNav(active = 'list'){
    const state = readState();
    const unread = unreadCartAlertCount(state);
    const settings = normalizeCartAlertSettings(state.alertSettings);
    return `
      <div class="cart-alert-drill-actions">
        <button type="button" class="${active === 'list' ? 'active' : ''}" data-cart-alert-view="list">
          <span>Caixa de alertas</span>
          <b>${unread}</b>
        </button>
        <button type="button" class="${active === 'settings' ? 'active' : ''}" data-cart-alert-view="settings">
          <span>Configurações</span>
          <small>${settings.popupEnabled ? 'Popup ativo' : 'Popup silenciado'}</small>
        </button>
      </div>
    `;
  }

  function renderCartAlertHistory(){
    const state = readState();
    const alerts = sortedCartAlerts(state).slice(0, 12);
    if(!alerts.length){
      return `
        <header class="cart-alert-history-head">
          <span>Alertas</span>
          <h2>Caixa de alertas</h2>
          <p>Nenhum alerta registrado no painel.</p>
        </header>
        ${renderCartAlertNav('list')}
        <div class="cart-alert-empty">
          <span class="cart-alert-mail-icon">${getAlertMailboxIcon()}</span>
          <strong>Sem alertas por enquanto.</strong>
          <small>Alertas críticos, obstruções e trocas aparecerão nesta lista.</small>
        </div>
      `;
    }
    return `
      <header class="cart-alert-history-head">
        <span>Alertas</span>
        <h2>Caixa de alertas</h2>
        <p>${alerts.length} alerta${alerts.length === 1 ? '' : 's'} recente${alerts.length === 1 ? '' : 's'} do painel.</p>
      </header>
      ${renderCartAlertNav('list')}
      <div class="cart-alert-history-list">
        ${alerts.map(alert => `
          <article class="cart-alert-history-item ${alertTypeClass(alert.type)} ${alert.acknowledgedAt ? 'read' : 'new'}">
            <i>${getOperationalTelemetryIcon(alert.type === 'exchange' ? 'limit' : (alert.type === 'obstruction' || alert.type === 'sensor' ? 'attention' : 'critical'))}</i>
            <span>
              <strong>${escapeHtml(alert.title)}</strong>
              <small>${escapeHtml(alert.message || alert.detail || '')}</small>
            </span>
            <time>${escapeHtml(formatDateTime(alert.ts))}</time>
          </article>
        `).join('')}
      </div>
    `;
  }

  function renderCartAlertSettings(){
    const state = readState();
    const settings = normalizeCartAlertSettings(state.alertSettings);
    const recurrenceOptions = [0, 10, 20, 30, 45, 60];
    return `
      <header class="cart-alert-history-head">
        <span>Alertas</span>
        <h2>Configurações de alertas</h2>
        <p>Escolha quais avisos aparecem no painel e quando eles voltam a alertar.</p>
      </header>
      ${renderCartAlertNav('settings')}
      <div class="cart-alert-settings-panel">
        <label class="cart-alert-toggle-row">
          <span>
            <strong>Popup na tela</strong>
            <small>Abre a janela quando um alerta novo chega.</small>
          </span>
          <input type="checkbox" name="cart-alert-popup" ${settings.popupEnabled ? 'checked' : ''}>
        </label>
        <label class="cart-alert-toggle-row">
          <span>
            <strong>Som do alerta</strong>
            <small>Toca apenas quando a janela abre.</small>
          </span>
          <input type="checkbox" name="cart-alert-sound" ${settings.soundEnabled ? 'checked' : ''}>
        </label>
        <label class="cart-alert-setting-row">
          <span>
            <strong>Recorrência</strong>
            <small>Depois que o carrinho fica crítico, repetir o aviso em:</small>
          </span>
          <select name="cart-alert-recurrence">
            ${recurrenceOptions.map(minutes => `
              <option value="${minutes}" ${Number(settings.recurrenceMinutes) === minutes ? 'selected' : ''}>
                ${minutes === 0 ? 'Sem recorrência' : `${minutes} min`}
              </option>
            `).join('')}
          </select>
        </label>
        <div class="cart-alert-check-list">
          ${CART_ALERT_TYPE_OPTIONS.map(option => `
            <label>
              <input type="checkbox" data-cart-alert-type="${escapeHtml(option.id)}" ${settings.enabledTypes[option.id] !== false ? 'checked' : ''}>
              <span>
                <strong>${escapeHtml(option.label)}</strong>
                <small>${escapeHtml(option.detail)}</small>
              </span>
            </label>
          `).join('')}
        </div>
        <button type="button" class="cart-alert-save-btn" data-cart-alert-save-settings>Salvar configurações</button>
      </div>
    `;
  }

  function renderCartAlertModalContent(){
    const content = document.getElementById('cartAlertModalContent');
    if(!content) return;
    content.innerHTML = cartAlertModalView === 'settings'
      ? renderCartAlertSettings()
      : renderCartAlertHistory();
  }

  function saveCartAlertSettingsFromModal(){
    const content = document.getElementById('cartAlertModalContent');
    if(!content) return;
    const state = readState();
    const current = normalizeCartAlertSettings(state.alertSettings);
    const nextTypes = {};
    CART_ALERT_TYPE_OPTIONS.forEach(option => {
      const input = content.querySelector(`[data-cart-alert-type="${option.id}"]`);
      nextTypes[option.id] = input ? input.checked : current.enabledTypes[option.id] !== false;
    });
    state.alertSettings = normalizeCartAlertSettings({
      popupEnabled:content.querySelector('[name="cart-alert-popup"]')?.checked !== false,
      soundEnabled:content.querySelector('[name="cart-alert-sound"]')?.checked !== false,
      recurrenceMinutes:Number(content.querySelector('[name="cart-alert-recurrence"]')?.value || current.recurrenceMinutes),
      enabledTypes:nextTypes
    });
    saveState(state);
    renderCartAlertModalContent();
    if(typeof window.saveCartAlertSettingsToBackend === 'function'){
      window.saveCartAlertSettingsToBackend(state.alertSettings).catch(error => {
        console.warn('Nao foi possivel salvar as configuracoes de alerta no backend.', error);
      });
    }
  }

  function handleCartAlertModalClick(event){
    const viewButton = event.target.closest('[data-cart-alert-view]');
    if(viewButton){
      cartAlertModalView = viewButton.getAttribute('data-cart-alert-view') || 'list';
      renderCartAlertModalContent();
      return;
    }
    if(event.target.closest('[data-cart-alert-save-settings]')){
      saveCartAlertSettingsFromModal();
    }
  }

  function openCartAlertModal(alertId = '', options = {}){
    if(!isEinsteinCartAlertContext()){
      hideCartAlertsOutsideContext();
      return;
    }
    if(typeof window.openStableCartAlertModal === 'function'){
      return window.openStableCartAlertModal(alertId, options);
    }
    const overlay = document.getElementById('cartAlertModalOverlay');
    const content = document.getElementById('cartAlertModalContent');
    if(!overlay || !content) return;
    const state = readState();
    const wasVisible = !overlay.hidden;
    overlay.dataset.alertId = alertId || '';
    overlay.dataset.mode = options.history ? 'history' : 'popup';
    if(options.history){
      cartAlertModalView = 'list';
      renderCartAlertModalContent();
    }else{
      const alert = (state.alerts || []).find(item => item.id === alertId) || sortedCartAlerts(state).find(item => !item.acknowledgedAt) || null;
      overlay.dataset.alertId = alert?.id || '';
      content.innerHTML = renderCartAlertPopup(alert);
      if(options.playSound && !wasVisible && shouldPlayCartAlertSound(state)) playCartAlertSound();
    }
    overlay.hidden = false;
  }

  function openCartAlertInbox(){
    if(!isEinsteinCartAlertContext()){
      hideCartAlertsOutsideContext();
      return;
    }
    if(typeof window.openStableCartAlertInbox === 'function'){
      return window.openStableCartAlertInbox();
    }
    return openCartAlertModal('', { history:true });
  }

  function closeCartAlertModal(){
    if(typeof window.closeStableCartAlertModal === 'function'){
      return window.closeStableCartAlertModal();
    }
    const overlay = document.getElementById('cartAlertModalOverlay');
    if(!overlay) return;
    const alertId = overlay.dataset.alertId || '';
    const isPopup = overlay.dataset.mode !== 'history';
    overlay.hidden = true;
    if(isPopup && alertId) acknowledgeCartAlert(alertId);
  }

  function currentDetailCart(){
    const overlay = document.getElementById('cartDetailOverlay');
    const cartId = overlay?.dataset.cartId;
    if(!cartId) return null;
    const state = readState();
    return state.carts.find(item => item.id === cartId) || null;
  }

  function setCalibrationStatus(message, tone = 'info'){
    const status = document.getElementById('cartCalibrationStatus');
    if(!status) return;
    status.textContent = message || '';
    status.dataset.tone = tone;
  }

  function setCalibrationNewStatus(message, tone = 'info'){
    const status = document.getElementById('cartCalibrationNewStatus');
    if(!status) return;
    status.textContent = message || '';
    status.dataset.tone = tone;
  }

  function renderCalibrationSamples(samples, activeIndex = -1){
    const list = document.getElementById('cartCalibrationSamples');
    if(!list) return;
    const sampleList = Array.from({ length:CALIBRATION_SAMPLE_COUNT }, (_, index) => {
      const value = samples[index];
      const active = activeIndex === index ? ' active' : '';
      return `<span class="${active}"><em>${index + 1}</em><strong>${value ? formatMm(value) : '--'}</strong></span>`;
    }).join('');
    list.innerHTML = sampleList;
  }

  function calibrationPercentChoices(calibration, selectedValue){
    const selected = normalizeCartCriticalPercent(selectedValue || calibration.redPercent || DEFAULT_CART_CALIBRATION.redPercent);
    const values = new Set(CART_CRITICAL_PERCENT_CHOICES);
    return Array.from(values)
      .filter(value => value >= 1 && value <= 100)
      .sort((a, b) => a - b)
      .map(value => {
        const distance = distanceForFillPercentage(calibration, value);
        return {
          value,
          label: `${value}% (${formatMm(distance)})`,
          selected:value === selected
        };
      });
  }

  function closeCalibrationSelects(exceptPicker = null){
    document.querySelectorAll('.cart-calibration-select.is-open').forEach(picker => {
      if(picker === exceptPicker) return;
      picker.classList.remove('is-open');
      picker.classList.remove('drop-up');
      picker.querySelector('.cart-calibration-select-btn')?.setAttribute('aria-expanded', 'false');
      const options = picker.querySelector('.cart-calibration-options');
      if(options) options.hidden = true;
    });
  }

  function setCalibrationPickerValue(inputId, value){
    const input = document.getElementById(inputId);
    const picker = document.querySelector(`[data-calibration-select="${inputId}"]`);
    if(!input || !picker) return;

    const normalizedValue = String(value || '');
    const options = Array.from(picker.querySelectorAll(`[data-calibration-option="${inputId}"]`));
    const selectedOption = options.find(option => option.dataset.value === normalizedValue) || options[0];
    if(!selectedOption) return;

    const selectedValue = selectedOption.dataset.value || normalizedValue;
    input.value = selectedValue;
    picker.dataset.value = selectedValue;
    const label = picker.querySelector('.cart-calibration-select-btn span');
    if(label) label.textContent = selectedOption.textContent.trim();
    options.forEach(option => {
      const selected = option === selectedOption;
      option.classList.toggle('is-selected', selected);
      option.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

  function renderCalibrationPercentPicker(inputId, calibration, selectedValue){
    const input = document.getElementById(inputId);
    const picker = document.querySelector(`[data-calibration-select="${inputId}"]`);
    if(!input || !picker) return;

    const choices = calibrationPercentChoices(calibration, selectedValue);
    const selectedChoice = choices.find(choice => choice.selected) || choices[0];
    if(!selectedChoice) return;

    input.value = String(selectedChoice.value);
    picker.dataset.value = String(selectedChoice.value);
    picker.innerHTML = `
      <button type="button" class="cart-calibration-select-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="${escapeHtml(inputId)}Menu">
        <span>${escapeHtml(selectedChoice.label)}</span>
      </button>
      <div class="cart-calibration-options" id="${escapeHtml(inputId)}Menu" role="listbox" hidden>
        ${choices.map(choice => `
          <button type="button" class="cart-calibration-option${choice.selected ? ' is-selected' : ''}" role="option" aria-selected="${choice.selected ? 'true' : 'false'}" data-calibration-option="${escapeHtml(inputId)}" data-value="${choice.value}">
            ${escapeHtml(choice.label)}
          </button>
        `).join('')}
      </div>
    `;
  }

  function toggleCalibrationSelect(picker){
    if(!picker) return;
    const willOpen = !picker.classList.contains('is-open');
    closeCalibrationSelects(willOpen ? picker : null);
    picker.classList.remove('drop-up');
    picker.classList.toggle('is-open', willOpen);
    picker.querySelector('.cart-calibration-select-btn')?.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    const options = picker.querySelector('.cart-calibration-options');
    if(options) options.hidden = !willOpen;
    if(willOpen){
      const trigger = picker.querySelector('.cart-calibration-select-btn');
      const modal = picker.closest('.cart-detail-modal');
      const triggerRect = trigger?.getBoundingClientRect();
      const modalRect = modal?.getBoundingClientRect();
      if(triggerRect){
        const menuHeight = Math.min(options?.scrollHeight || 250, 320);
        const bottomLimit = Math.min(window.innerHeight, modalRect?.bottom || window.innerHeight);
        const topLimit = Math.max(0, modalRect?.top || 0);
        const spaceBelow = bottomLimit - triggerRect.bottom;
        const spaceAbove = triggerRect.top - topLimit;
        picker.classList.toggle('drop-up', spaceBelow < menuHeight + 16 && spaceAbove > spaceBelow);
      }
    }
  }

  function handleCalibrationSelectClick(event){
    const option = event.target.closest('[data-calibration-option]');
    if(option){
      event.preventDefault();
      setCalibrationPickerValue(option.dataset.calibrationOption, option.dataset.value);
      closeCalibrationSelects();
      return;
    }

    const button = event.target.closest('.cart-calibration-select-btn');
    if(button){
      event.preventDefault();
      toggleCalibrationSelect(button.closest('.cart-calibration-select'));
      return;
    }

    if(!event.target.closest('.cart-calibration-select')) closeCalibrationSelects();
  }

  function handleCalibrationSelectKeydown(event){
    const picker = event.target.closest('.cart-calibration-select');
    if(!picker) return;

    if(event.key === 'Escape'){
      event.preventDefault();
      closeCalibrationSelects();
      picker.querySelector('.cart-calibration-select-btn')?.focus();
      return;
    }

    if(event.key === 'Enter' || event.key === ' '){
      const option = event.target.closest('[data-calibration-option]');
      if(option){
        event.preventDefault();
        setCalibrationPickerValue(option.dataset.calibrationOption, option.dataset.value);
        closeCalibrationSelects();
      }
    }
  }

  function setCalibrationExpanded(expanded){
    const panel = document.getElementById('cartCalibrationPanel');
    const body = document.getElementById('cartCalibrationBody');
    const toggle = document.getElementById('cartCalibrationToggle');
    if(panel) panel.classList.toggle('expanded', expanded);
    if(body) body.hidden = !expanded;
    if(toggle) toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  function toggleCartCalibrationPanel(){
    const body = document.getElementById('cartCalibrationBody');
    setCalibrationExpanded(Boolean(body?.hidden));
  }

  function setCalibrationMode(mode){
    closeCalibrationSelects();
    const edit = document.getElementById('cartCalibrationEdit');
    const flow = document.getElementById('cartCalibrationNewFlow');
    if(edit) edit.hidden = mode !== 'edit';
    if(flow) flow.hidden = mode !== 'new';
  }

  function renderCartCalibrationPanel(cart){
    const panel = document.getElementById('cartCalibrationPanel');
    if(!panel) return;
    const canManage = canManageCartSettings();
    const canView = canViewCartCalibration() && !!cart;
    const canEditLimit = canEditCartCriticalLimit() && !!cart;
    panel.hidden = !canView;
    if(!canView) return;

    const overlay = document.getElementById('cartDetailOverlay');
    const calibration = cartCalibration(cart);
    const summaryEl = document.getElementById('cartCalibrationSummary');
    const currentEl = document.getElementById('cartCalibrationCurrent');
    const fullEl = document.getElementById('cartCalibrationFull');
    const modeEl = document.getElementById('cartCalibrationReadMode');
    const redEl = document.getElementById('cartCalibrationRed');
    const startBtn = document.getElementById('cartCalibrationStartBtn');
    const confirmBtn = document.getElementById('cartCalibrationConfirmBtn');
    const lidToggleBtn = document.getElementById('cartCalibrationLidToggle');
    const editBtn = document.getElementById('cartCalibrationEditBtn');
    const newBtn = document.getElementById('cartCalibrationNewBtn');
    const editPanel = document.getElementById('cartCalibrationEdit');
    const newFlow = document.getElementById('cartCalibrationNewFlow');
    const redDistance = distanceForFillPercentage(calibration, calibration.redPercent);

    if(summaryEl) summaryEl.textContent = `${formatMm(calibration.emptyDistanceMm)} · ${calibration.redPercent}%`;
    if(currentEl) currentEl.textContent = formatMm(calibration.emptyDistanceMm);
    if(fullEl) fullEl.textContent = formatMm(calibration.fullDistanceMm);
    if(modeEl) modeEl.textContent = 'Por porcentagem';
    if(redEl) redEl.textContent = `${calibration.redPercent}% (${formatMm(redDistance)})`;
    if(lidToggleBtn){
      lidToggleBtn.hidden = !canManage;
      lidToggleBtn.disabled = !canManage;
      lidToggleBtn.textContent = calibration.lidDetectionEnabled ? 'Porta aberta ligada' : 'Leitura lateral ativa';
      lidToggleBtn.dataset.enabled = calibration.lidDetectionEnabled ? 'true' : 'false';
    }
    if(editBtn){
      editBtn.hidden = !canEditLimit;
      editBtn.disabled = !canEditLimit;
    }
    if(newBtn){
      newBtn.hidden = !canManage;
      newBtn.disabled = !canManage;
    }
    renderCalibrationPercentPicker('cartCalibrationRedPercent', calibration, calibration.redPercent);
    renderCalibrationPercentPicker('cartCalibrationNewRedPercent', calibration, calibration.redPercent);

    if(startBtn) startBtn.disabled = !cart || !canManage;
    if(confirmBtn) confirmBtn.disabled = true;
    if(editPanel) editPanel.hidden = true;
    if(newFlow) newFlow.hidden = true;
    if(overlay){
      delete overlay.dataset.calibrationDraftEmpty;
      delete overlay.dataset.calibrationDraftSamples;
    }
    renderCalibrationSamples([]);
    document.getElementById('cartCalibrationDraft')?.replaceChildren();
    setCalibrationStatus(canEditLimit ? 'Ajuste apenas o limite crítico em porcentagem.' : 'Calibração técnica somente leitura.', 'info');
    setCalibrationNewStatus(canManage ? 'A nova calibração substitui a calibração atual deste carrinho.' : '', canManage ? 'warn' : 'info');
    setCalibrationMode('');
  }

  function readingTimestampMs(reading){
    const timestamps = [reading?.createdAt, reading?.receivedAt]
      .map(value => new Date(value || '').getTime())
      .filter(Number.isFinite);
    return timestamps.length ? Math.max(...timestamps) : null;
  }

  function hasValidCalibrationReading(reading){
    const distance = finiteNumberOrNull(reading?.distanceMm);
    return distance !== null && distance < INVALID_SENSOR_DISTANCE_MM;
  }

  async function readingsForCart(cart, limit = 20){
    const mac = cleanMac(cart?.mac);
    if(mac.length !== 12) return [];
    const response = await fetch(`/api/cart-tracking/readings?mac=${encodeURIComponent(mac)}&limit=${limit}`, { cache:'no-store' });
    const payload = await response.json();
    return Array.isArray(payload?.data?.readings) ? payload.data.readings : [];
  }

  async function latestReadingForCart(cart){
    const readings = await readingsForCart(cart, 20);
    return readings[0] || null;
  }

  function isCalibrationFlowActive(cart){
    const overlay = document.getElementById('cartDetailOverlay');
    const flow = document.getElementById('cartCalibrationNewFlow');
    return !!overlay
      && overlay.dataset.cartId === cart?.id
      && flow
      && flow.hidden !== true;
  }

  async function calibrationBaseReadingForCart(cart){
    const readings = await readingsForCart(cart, 30);
    const official = readings.find(reading => isOfficialCartReading(reading) && hasValidCalibrationReading(reading));
    const base = official || readings.find(reading => hasValidCalibrationReading(reading));
    if(base){
      return {
        distance:Math.round(finiteNumberOrNull(base.distanceMm)),
        key:readingIdentity(base),
        ts:readingTimestampMs(base)
      };
    }
    const distance = finiteNumberOrNull(cart?.distanceMm);
    if(distance !== null && distance < INVALID_SENSOR_DISTANCE_MM && cart?.lastReadingAt){
      return {
        distance:Math.round(distance),
        key:`cart|${cart.id}|${cart.lastReadingAt}|${distance}`,
        ts:new Date(cart.lastReadingAt).getTime()
      };
    }
    return null;
  }

  async function freshCalibrationReadingForCart(cart, seenKeys, minTimestampMs){
    while(isCalibrationFlowActive(cart)){
      const readings = await readingsForCart(cart, 30);
      const fresh = readings.find(reading => {
        const key = readingIdentity(reading);
        const ts = readingTimestampMs(reading);
        return key
          && !seenKeys.has(key)
          && ts !== null
          && ts >= minTimestampMs
          && hasValidCalibrationReading(reading);
      });
      if(fresh){
        seenKeys.add(readingIdentity(fresh));
        return fresh;
      }
      await wait(CALIBRATION_FRESH_POLL_MS);
    }
    return null;
  }

  async function saveCartCalibrationToBackend(cart, calibration){
    const mac = cleanMac(cart?.mac);
    if(mac.length !== 12) throw new Error('MAC do sensor inválido.');
    const payload = await panelApi(`/api/cart-tracking/calibration/${encodeURIComponent(mac)}`, {
      method:'POST',
      body:JSON.stringify({ calibration })
    });
    return normalizeCartCalibration(payload?.calibration || calibration);
  }

  async function saveCartCriticalLimitToBackend(cart, redPercent){
    const mac = cleanMac(cart?.mac);
    if(mac.length !== 12) throw new Error('MAC do sensor inválido.');
    const payload = await panelApi(`/api/cart-tracking/critical-limit/${encodeURIComponent(mac)}`, {
      method:'PUT',
      body:JSON.stringify({ redPercent })
    });
    return normalizeCartCalibration(payload?.calibration || {
      ...cartCalibration(cart),
      redPercent
    });
  }

  async function clearCartCalibrationFromBackend(macValue){
    const mac = cleanMac(macValue);
    if(mac.length !== 12) throw new Error('MAC do sensor invalido.');
    const payload = await panelApi(`/api/cart-tracking/calibration/${encodeURIComponent(mac)}`, {
      method:'DELETE'
    });
    return normalizeCartCalibration(payload?.calibration || DEFAULT_CART_CALIBRATION);
  }

  function resetCartOperationalCycleAfterCalibration(cart){
    if(!cart) return;
    cart.collectorStatus = 'calibration_pending';
    cart.levelStatus = '';
    cart.candidateLevelReadings = 0;
    cart.consecutiveCriticalReadings = 0;
    cart.consecutiveLidOpenReadings = 0;
    cart.consecutiveLidClosedReadings = 0;
    cart.consecutiveObstructedReadings = 0;
    cart.consecutiveSensorRemovedReadings = 0;
    cart.lidOpen = false;
    delete cart.pendingFullReadingKey;
    delete cart.pendingFullReadings;
    if(cart.alertState && typeof cart.alertState === 'object'){
      cart.alertState.criticalStartedAt = '';
      cart.alertState.lastCriticalAlertAt = '';
      cart.alertState.lastObstructionAlertAt = '';
      cart.alertState.lastSensorAlertAt = '';
    }
    cart.calibrationCycleResetAt = cart.calibration?.updatedAt || new Date().toISOString();
  }

  function wait(ms){
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }

  async function startCartCalibration(){
    if(!canManageCartSettings()) return;
    const cart = currentDetailCart();
    if(!cart){
      alert('Salve o carrinho antes de calibrar.');
      return;
    }

    const overlay = document.getElementById('cartDetailOverlay');
    const startBtn = document.getElementById('cartCalibrationStartBtn');
    const samples = [];
    const calibrationStartedAt = Date.now();
    const seenReadingKeys = new Set();
    if(startBtn) startBtn.disabled = true;
    setCalibrationNewStatus('Aguardando nova leitura do sensor...', 'info');
    renderCalibrationSamples(samples, 0);

    try{
      const baseReading = await calibrationBaseReadingForCart(cart);
      if(!baseReading){
        setCalibrationNewStatus('Ainda nao existe leitura valida para usar como base. Aguarde o primeiro ciclo oficial do sensor.', 'info');
        renderCalibrationSamples(samples);
        return;
      }
      samples.push(baseReading.distance);
      if(baseReading.key) seenReadingKeys.add(baseReading.key);
      renderCalibrationSamples(samples, 1);

      await wait(Math.min(CALIBRATION_SAMPLE_DELAY_MS, 1000));
      setCalibrationNewStatus('Primeira leitura valida encontrada. Aguardando a proxima leitura nova do sensor...', 'info');
      const reading = await freshCalibrationReadingForCart(cart, seenReadingKeys, calibrationStartedAt);
      if(!reading){
        setCalibrationNewStatus('Busca de nova leitura interrompida.', 'info');
        renderCalibrationSamples(samples);
        return;
      }
      const distance = finiteNumberOrNull(reading?.distanceMm);
      if(distance === null || distance >= INVALID_SENSOR_DISTANCE_MM){
        setCalibrationNewStatus('Leitura invalida. Reposicione o sensor e tente novamente.', 'error');
        renderCalibrationSamples(samples);
        return;
      }
      samples.push(Math.round(distance));
      renderCalibrationSamples(samples, 1);

      const min = Math.min(...samples);
      const max = Math.max(...samples);
      const avg = Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length);
      const tolerance = Math.max(CALIBRATION_STABILITY_MIN_MM, Math.round(avg * (CALIBRATION_STABILITY_PERCENT / 100)));
      if(max - min > tolerance){
        setCalibrationNewStatus(`Leituras variaram ${max - min} mm. Tente novamente com o sensor parado.`, 'error');
        return;
      }

      if(overlay){
        overlay.dataset.calibrationDraftEmpty = String(avg);
        overlay.dataset.calibrationDraftSamples = JSON.stringify(samples);
      }
      const draft = document.getElementById('cartCalibrationDraft');
      if(draft){
        draft.textContent = `Calibração atual do dispositivo será ${avg} mm. Defina o limite crítico e confirme.`;
      }
      const confirmBtn = document.getElementById('cartCalibrationConfirmBtn');
      if(confirmBtn) confirmBtn.disabled = false;
      setCalibrationNewStatus(`Leituras estáveis. Nova calibração sugerida: ${avg} mm.`, 'success');
    }catch(err){
      console.warn('Falha ao calibrar carrinho', err);
      setCalibrationNewStatus('Não foi possível buscar as leituras agora.', 'error');
    }finally{
      if(startBtn) startBtn.disabled = false;
      renderCalibrationSamples(samples);
    }
  }

  async function saveCartCalibrationLimit(){
    const overlay = document.getElementById('cartDetailOverlay');
    const cartId = overlay?.dataset.cartId;
    if(!cartId || !canEditCartCriticalLimit()){
      return;
    }

    const state = readState();
    const cart = state.carts.find(item => item.id === cartId);
    if(!cart) return;

    const current = cartCalibration(cart);
    const redPercent = Math.round(Number(document.getElementById('cartCalibrationRedPercent')?.value || current.redPercent));
    const next = normalizeCartCalibration({
      ...current,
      redPercent,
      updatedAt: new Date().toISOString()
    });

    try{
      setCalibrationStatus('Salvando limite crítico no backend...', 'info');
      cart.calibration = await saveCartCriticalLimitToBackend(cart, next.redPercent);
      saveState(state);
      renderCartCalibrationPanel(cart);
      renderRooms();
      setCalibrationExpanded(true);
      setCalibrationMode('');
      setCalibrationStatus('Limite crítico salvo no backend.', 'success');
    }catch(err){
      console.warn('Falha ao salvar calibração', err);
      setCalibrationStatus('Não foi possível salvar a calibração no backend.', 'error');
    }
  }

  async function toggleCartLidDetection(){
    const overlay = document.getElementById('cartDetailOverlay');
    const cartId = overlay?.dataset.cartId;
    if(!cartId || !canManageCartSettings()) return;

    const state = readState();
    const cart = state.carts.find(item => item.id === cartId);
    if(!cart) return;

    const current = cartCalibration(cart);
    const next = normalizeCartCalibration({
      ...current,
      lidDetectionEnabled: !current.lidDetectionEnabled,
      updatedAt: new Date().toISOString()
    });

    try{
      setCalibrationStatus('Salvando modo de leitura...', 'info');
      cart.calibration = await saveCartCalibrationToBackend(cart, next);
      resetCartOperationalCycleAfterCalibration(cart);
      saveState(state);
      renderCartCalibrationPanel(cart);
      renderRooms();
      setCalibrationExpanded(true);
      setCalibrationStatus(next.lidDetectionEnabled ? 'Detecção de porta aberta ligada.' : 'Leitura lateral salva. Distância alta vira alerta de sensor.', 'success');
    }catch(err){
      console.warn('Falha ao salvar modo de leitura', err);
      setCalibrationStatus('Não foi possível salvar o modo de leitura.', 'error');
    }
  }

  async function confirmCartCalibration(){
    if(!canManageCartSettings()) return;
    const overlay = document.getElementById('cartDetailOverlay');
    const cartId = overlay?.dataset.cartId;
    const draftEmpty = finiteNumberOrNull(overlay?.dataset.calibrationDraftEmpty);
    if(!cartId || draftEmpty === null){
      alert('Busque as 3 leituras antes de confirmar a calibração.');
      return;
    }

    const state = readState();
    const cart = state.carts.find(item => item.id === cartId);
    if(!cart) return;

    const current = cartCalibration(cart);
    const redPercent = Math.round(Number(document.getElementById('cartCalibrationNewRedPercent')?.value || current.redPercent));
    let samples = [];
    try{
      const parsedSamples = JSON.parse(overlay?.dataset.calibrationDraftSamples || '[]');
      if(Array.isArray(parsedSamples)) samples = parsedSamples.map(Number).filter(Number.isFinite);
    }catch{}

    const next = normalizeCartCalibration({
      ...current,
      emptyDistanceMm: draftEmpty,
      redPercent,
      samples,
      updatedAt: new Date().toISOString()
    });

    if(next.emptyDistanceMm <= next.fullDistanceMm){
      next.fullDistanceMm = Math.max(0, next.emptyDistanceMm - 50);
    }

    try{
      setCalibrationNewStatus('Salvando nova calibração no backend...', 'info');
      cart.calibration = await saveCartCalibrationToBackend(cart, next);
      resetCartOperationalCycleAfterCalibration(cart);
      saveState(state);
      renderCartCalibrationPanel(cart);
      renderRooms();
      setCalibrationExpanded(true);
      setCalibrationMode('');
      setCalibrationStatus('Nova calibração salva no backend.', 'success');
    }catch(err){
      console.warn('Falha ao confirmar calibração', err);
      setCalibrationNewStatus('Não foi possível salvar a calibração no backend.', 'error');
    }
  }

  function cancelCartCalibrationDraft(){
    const cart = currentDetailCart();
    renderCartCalibrationPanel(cart);
    setCalibrationExpanded(true);
  }

  function openCartCalibrationEdit(){
    if(!canEditCartCriticalLimit()) return;
    setCalibrationExpanded(true);
    setCalibrationMode('edit');
    setCalibrationStatus('Ajuste apenas o limite crítico em porcentagem.', 'info');
  }

  function openCartCalibrationNew(){
    if(!canManageCartSettings()) return;
    setCalibrationExpanded(true);
    setCalibrationMode('new');
    renderCalibrationSamples([]);
    document.getElementById('cartCalibrationDraft')?.replaceChildren();
    const confirmBtn = document.getElementById('cartCalibrationConfirmBtn');
    if(confirmBtn) confirmBtn.disabled = true;
    setCalibrationNewStatus('A nova calibração substitui a calibração atual deste carrinho.', 'warn');
  }

  function normalizeCartSearch(value){
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function isLostCart(cart){
    return cart.locationStatus === 'offline' && Boolean(cart.lostAt);
  }

  function isStockCart(cart){
    return cart.locationStatus === 'offline' && !isLostCart(cart);
  }

  function isFreeCart(cart){
    return !isLostCart(cart) && !isStockCart(cart) && fillTone(cart) === 'empty';
  }

  function cartMatchesFilter(cart, filter = activeCartFilter){
    if(!filter || filter === 'all') return true;
    if(filter === 'empty') return isFreeCart(cart);
    if(filter === 'full') return !isStockCart(cart) && !isLostCart(cart) && fillTone(cart) === 'full';
    if(filter === 'stock') return isStockCart(cart);
    if(filter === 'lost') return isLostCart(cart);
    return true;
  }

  function cartMatchesSearch(cart, room, query){
    if(!query) return true;
    return normalizeCartSearch([
      cartDisplayName(cart),
      cart?.name,
      cart?.mac,
      cleanMac(cart?.mac),
      room?.name,
      room?.gatewayDeviceId
    ].join(' ')).includes(query);
  }

  function roomMatchesSearch(room, carts, query){
    if(!query) return true;
    if(normalizeCartSearch([room?.name, room?.gatewayDeviceId].join(' ')).includes(query)) return true;
    return carts.some(cart => cart.roomId === room.id && cartMatchesSearch(cart, room, query));
  }

  function visibleRoomCarts(room, carts){
    const query = normalizeCartSearch(cartSearchTerm);
    const roomMatched = query && normalizeCartSearch([room?.name, room?.gatewayDeviceId].join(' ')).includes(query);
    const showOutOfRoom = activeCartFilter === 'stock' || activeCartFilter === 'lost';
    return carts
      .filter(cart => cart.roomId === room.id && cart.locationStatus !== 'transit')
      .filter(cart => showOutOfRoom || cart.locationStatus !== 'offline')
      .filter(cart => cartMatchesFilter(cart))
      .filter(cart => !query || roomMatched || cartMatchesSearch(cart, room, query));
  }

  function roomStats(room, carts){
    const roomCarts = carts.filter(cart => cart.roomId === room.id && cart.locationStatus !== 'transit' && cart.locationStatus !== 'offline');
    return {
      total: roomCarts.length,
      full: roomCarts.filter(cart => cartMatchesFilter(cart, 'full')).length,
      empty: roomCarts.filter(cart => cartMatchesFilter(cart, 'empty')).length,
      stock:carts.filter(cart => cart.roomId === room.id && cartMatchesFilter(cart, 'stock')).length,
      lost: roomCarts.filter(cart => cartMatchesFilter(cart, 'lost')).length
    };
  }

  function globalStats(state){
    const empty = state.carts.filter(cart => cartMatchesFilter(cart, 'empty')).length;
    const full = state.carts.filter(cart => cartMatchesFilter(cart, 'full')).length;
    const stock = state.carts.filter(cart => cartMatchesFilter(cart, 'stock')).length;
    const lost = state.carts.filter(cart => cartMatchesFilter(cart, 'lost')).length;
    return { total: state.carts.length, empty, full, stock, lost };
  }

  function unreadAlertCount(state){
    return (state.alerts || []).filter(alert => !alert.acknowledgedAt).length;
  }

  function roomCartTotal(state, roomId){
    return state.carts.filter(cart => cart.roomId === roomId).length;
  }

  function renderSummary(state){
    const summary = document.getElementById('cartTrackingSummary');
    if(!summary) return;
    const stats = globalStats(state);
    const transitTotal = CART_TRANSIT_FLOW_ENABLED
      ? state.carts.filter(cart => cart.locationStatus === 'transit').length
      : 0;
    const alertsTotal = isEinsteinCartAlertContext() ? unreadAlertCount(state) : 0;
    const countText = value => String(Math.max(0, Number(value || 0)));
    const totalText = value => countText(value).padStart(2, '0');
    summary.innerHTML = `
      <article class="cart-overview-card cart-overview-total cart-overview-status">
        <div class="cart-status-strip">
          <button type="button" class="cart-status-total ${activeCartFilter === 'all' ? 'active' : ''}" data-cart-filter="all" aria-pressed="${activeCartFilter === 'all' ? 'true' : 'false'}">
            <span class="cart-total-label">Total:</span>
            <span class="cart-total-value"><strong>${totalText(stats.total)}</strong><small>carrinhos</small></span>
          </button>
          <button type="button" class="cart-status-item empty ${activeCartFilter === 'empty' ? 'active' : ''}" data-cart-filter="empty" aria-pressed="${activeCartFilter === 'empty' ? 'true' : 'false'}">
            <em><i></i>Livres</em>
            <strong>${countText(stats.empty)}</strong>
          </button>
          <button type="button" class="cart-status-item full ${activeCartFilter === 'full' ? 'active' : ''}" data-cart-filter="full" aria-pressed="${activeCartFilter === 'full' ? 'true' : 'false'}">
            <em><i></i>Críticos</em>
            <strong>${countText(stats.full)}</strong>
          </button>
          <button type="button" class="cart-status-item lost ${activeCartFilter === 'lost' ? 'active' : ''}" data-cart-filter="lost" aria-pressed="${activeCartFilter === 'lost' ? 'true' : 'false'}">
            <em><i></i>Perdidos</em>
            <strong>${countText(stats.lost)}</strong>
          </button>
          <button type="button" class="cart-status-item stock ${activeCartFilter === 'stock' ? 'active' : ''}" data-cart-filter="stock" aria-pressed="${activeCartFilter === 'stock' ? 'true' : 'false'}">
            <em><i></i>Estoque</em>
            <strong>${countText(stats.stock)}</strong>
          </button>
        </div>
      </article>
      <article class="cart-overview-card cart-overview-flow">
        <button type="button" class="cart-flow-item residue" data-cart-room-modal="residue" aria-label="Abrir sala de resíduos">
          <img class="cart-flow-img" src="./assets/cr-icon-residue-clean.png" alt="" loading="lazy">
          <span class="cart-flow-label">Resíduos</span>
        </button>
        <button type="button" class="cart-flow-item hygiene" data-cart-room-modal="hygiene" aria-label="Abrir sala de higienização">
          <img class="cart-flow-img hygiene" src="./assets/cr-icon-hygiene-clean.png" alt="" loading="lazy">
          <span class="cart-flow-label">Higienização</span>
        </button>
        <button type="button" class="cart-flow-item transit" data-cart-transit-modal aria-label="Carrinhos em trânsito">
          <span class="cart-flow-transit-icon approved" aria-hidden="true">${transitIcon()}</span>
          <b>${countText(transitTotal)}</b>
          <span class="cart-flow-label">Em trânsito</span>
        </button>
      </article>
      <article class="cart-overview-card cart-overview-report">
        <div class="cart-overview-actions">
          <button type="button" class="cart-report-global-btn" data-cart-report-modal aria-label="Relatório analítico" title="Relatório analítico">
            <span class="graph-report-icon">${getReportIcon()}</span>
          </button>
          <button type="button" class="cart-alert-global-btn" data-cart-alerts-modal aria-label="Alertas do painel" title="Alertas do painel">
            <span class="cart-alert-mail-icon">${getAlertMailboxIcon()}</span>
            ${alertsTotal ? `<b>${countText(alertsTotal)}</b>` : ''}
          </button>
        </div>
      </article>
      <article class="cart-overview-card cart-overview-empty" aria-hidden="true"></article>
    `;
    summary.querySelector('[data-cart-alerts-modal]')?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if(typeof window.openCartAlertInbox === 'function') window.openCartAlertInbox();
    });
  }

  function renderTransitStrip(cart){
    const currentStep = Math.max(1, Math.min(4, Number(cart.transitStep || 1)));
    const steps = Array.from({ length:4 }, (_, index) => {
      const done = index + 1 <= currentStep ? 'done' : '';
      return `<span class="${done}">${done ? '&#10003;' : index + 1}</span>`;
    }).join('');

    return `
      <div class="cart-transit-strip">
        <div>
          <strong>${escapeHtml(cartDisplayName(cart))}</strong>
          <small>Em trânsito - sinal afastando</small>
        </div>
        <div class="cart-transit-steps">${steps}</div>
      </div>
    `;
  }

  function renderCartCard(cart){
    const displayFill = cartVisualFill(cart);
    const visualFill = displayFill <= 2 ? 0 : displayFill;
    const tone = fillTone(cart);
    const lidOpen = isLidOpen(cart);
    const cardLabel = `${Math.round(displayFill)}%`;
    const showStatus = cart.locationStatus !== 'in_room' && cart.locationStatus !== 'transit';

    return `
      <div class="cart-item-unit">
        <div class="cart-card-stack">
          <button type="button" class="cart-item-card ${tone} ${escapeHtml(cart.locationStatus)} ${lidOpen ? 'lid-open' : 'lid-closed'}" data-cart-id="${escapeHtml(cart.id)}" style="--cart-fill:${visualFill}%;--cart-liquid:${visualFill}%">
            <span class="cart-card-online-dot ${isLostCart(cart) || isStockCart(cart) ? 'offline' : 'online'}" aria-hidden="true"></span>
            ${showStatus ? `<span class="cart-card-status"><i>${locationLabel(cart)}</i></span>` : ''}
            <span class="cart-item-body">
              <strong>${escapeHtml(cartDisplayName(cart))}</strong>
            </span>
            <span class="cart-visual" aria-hidden="true">
              <span class="cart-bin-empty-shell ${lidOpen ? 'open' : 'closed'}">
                <img
                  class="cart-bin-empty-img"
                  src="./assets/${lidOpen ? 'cart-bin-open-empty.png' : 'cart-bin-closed-empty.png'}"
                  alt=""
                  loading="lazy"
                />
                <span class="cart-bin-fill-zone">
                  <span class="cart-bin-liquid"></span>
                </span>
              </span>
            </span>
            <span class="cart-item-foot">
              <small>${cardLabel}</small>
            </span>
          </button>
          ${renderCartUnderMeta(cart)}
        </div>
        ${renderCartSideMeta(cart)}
      </div>
    `;
  }

  function renderRoomCarts(room, carts){
    const roomCarts = visibleRoomCarts(room, carts);
    if(!roomCarts.length){
      const emptyMessage = activeCartFilter === 'all' && !normalizeCartSearch(cartSearchTerm)
        ? 'Nenhum CR nesta sala.'
        : 'Nenhum CR neste filtro.';
      return `<div class="cart-room-empty">${emptyMessage}</div>`;
    }
    return roomCarts.map(renderCartCard).join('');
  }

  function renderRoomTransitRows(room, carts){
    if(!CART_TRANSIT_FLOW_ENABLED) return '';
    const transitCarts = carts.filter(cart => cart.roomId === room.id && cart.locationStatus === 'transit');
    if(!transitCarts.length) return '';

    return `
      <div class="cart-room-status-list">
        ${transitCarts.map(cart => {
          const transitStep = Math.max(1, Math.min(4, Number(cart.transitStep || 1)));
          const steps = Array.from({ length:4 }, (_, index) => {
            const done = index + 1 <= transitStep ? 'done' : '';
            return `<i class="${done}">${done ? '&#10003;' : index + 1}</i>`;
          }).join('');
          return `
            <button type="button" class="cart-room-transit-status" data-cart-id="${escapeHtml(cart.id)}">
              <span>
                <strong>${escapeHtml(cartDisplayName(cart))} em trânsito</strong>
                <small>Sinal afastando da sala</small>
              </span>
              <span class="cart-room-transit-steps">${steps}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderRooms(stateOverride){
    const state = stateOverride || readState();
    renderSummary(state);

    const grid = document.getElementById('cartRoomGrid');
    if(!grid) return;

    if(window.activePanelSession?.token && !cartConfigBackendLoaded){
      grid.innerHTML = '<div class="cart-room-empty cart-room-empty-wide">Carregando CR...</div>';
      refreshCartConfigFromBackend().catch(error => {
        console.warn('Nao foi possivel carregar configuracao C.R. antes da renderizacao.', error);
        grid.innerHTML = '<div class="cart-room-empty cart-room-empty-wide">Nenhum CR encontrado.</div>';
      });
      return;
    }

    if(activeRoomFilter && !state.rooms.some(room => room.id === activeRoomFilter)){
      activeRoomFilter = '';
    }

    const query = normalizeCartSearch(cartSearchTerm);
    const canManage = canManageCartSettings();
    const settingsToggle = document.getElementById('cartSettingsToggle');
    if(settingsToggle) settingsToggle.hidden = !canManage;
    const visibleRooms = state.rooms.filter(room => {
      if(activeRoomFilter && room.id !== activeRoomFilter) return false;
      if(SPECIAL_ROOM_IDS.has(room.id) && room.id !== activeRoomFilter) return false;
      if(!query && activeCartFilter === 'all') return roomCartTotal(state, room.id) > 0;
      return roomMatchesSearch(room, state.carts, query) && visibleRoomCarts(room, state.carts).length > 0;
    });

    if(!visibleRooms.length){
      grid.innerHTML = '<div class="cart-room-empty cart-room-empty-wide">Nenhum CR encontrado.</div>';
      return;
    }

    grid.innerHTML = visibleRooms.map(room => {
      return `
        <article class="cart-room-card" data-room-open="${escapeHtml(room.id)}">
          <header class="cart-room-header">
            <div class="cart-room-title-block">
              <span class="cart-room-kicker">Sala atual</span>
              <h2>${escapeHtml(room.name)}</h2>
              <span class="cart-room-gateway readonly">
                <span>Gateway: ${escapeHtml(formatGatewayShort(room.gatewayDeviceId))}</span>
                <i class="cart-room-online-dot ${escapeHtml(gatewayConnectionToneForRoom(room))}" title="${escapeHtml(gatewayConnectionTitle(room))}" aria-hidden="true"></i>
                ${gatewayBatteryHtml(room)}
              </span>
            </div>
            <div class="cart-room-header-actions">
              <button type="button" class="cart-room-action-btn" data-room-insight="${escapeHtml(room.id)}" data-room-insight-mode="chart">Gráfico</button>
              <button type="button" class="cart-room-action-btn" data-room-insight="${escapeHtml(room.id)}" data-room-insight-mode="telemetry">Telemetria</button>
              <button type="button" class="cart-room-info-btn" data-room-insight="${escapeHtml(room.id)}" data-room-insight-mode="info" aria-label="Informações de ${escapeHtml(room.name)}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 10v6"></path>
                  <path d="M12 7h.01"></path>
                </svg>
              </button>
              ${canManage ? `
                <button type="button" class="cart-room-icon-btn" data-room-settings="${escapeHtml(room.id)}" aria-label="Configurar ${escapeHtml(room.name)}">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5A7 7 0 0 0 19 12z"></path>
                  </svg>
                </button>
              ` : ''}
            </div>
          </header>
          <div class="cart-items-grid">
            ${renderRoomCarts(room, state.carts)}
          </div>
          ${renderRoomTransitRows(room, state.carts)}
        </article>
      `;
    }).join('');
  }

  function syncCartSearchUi(){
    const view = document.getElementById('cartTrackingView');
    const input = document.getElementById('cartSearchInput');
    const toggle = document.getElementById('cartSearchToggle');
    if(!view || !input || !toggle) return;
    const hasValue = Boolean(input.value.trim());
    const isFocused = document.activeElement === input;
    const isOpen = hasValue || isFocused;
    const width = Math.min(520, Math.max(220, 150 + input.value.length * 8));
    view.style.setProperty('--cart-search-width', `${width}px`);
    view.classList.toggle('search-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function mountCartTrackingView(view){
    if(!view) return;
    const layoutNode = document.getElementById('layout') || document.querySelector('.layout');
    const toolbarNode = document.querySelector('.toolbar-filters') || document.querySelector('.toolbar');
    const appNode = document.querySelector('.app') || layoutNode?.parentNode || toolbarNode?.parentNode || document.body;
    const anchorNode = layoutNode || toolbarNode || null;
    const hiddenParent = view.closest?.('.layout,.toolbar');
    const wrongParent = view.parentNode && appNode && view.parentNode !== appNode;
    if(!view.isConnected || hiddenParent || wrongParent){
      if(anchorNode && anchorNode.parentNode === appNode){
        appNode.insertBefore(view, anchorNode);
      }else{
        appNode.appendChild(view);
      }
    }
  }

  function ensureCartTrackingUi(){
    const oldButton = document.getElementById('cartTrackingBtn');
    if(oldButton) oldButton.remove();

    const existingView = document.getElementById('cartTrackingView');
    if(existingView && existingView.classList.contains('cart-tracking-v2')){
      mountCartTrackingView(existingView);
      return existingView;
    }
    if(existingView) existingView.remove();

    const view = document.createElement('section');
    view.className = 'cart-tracking-view cart-tracking-v2';
    view.id = 'cartTrackingView';
    view.hidden = true;
    view.innerHTML = `
      <div class="cart-tracking-head">
        <button type="button" class="cart-alert-ticker" id="cartAlertTicker" data-cart-alert-ticker hidden aria-live="polite"></button>
        <label class="cart-search-box" aria-label="Buscar CR">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6"></circle>
            <path d="M20 20l-4.2-4.2"></path>
          </svg>
          <input id="cartSearchInput" type="search" placeholder="Buscar sala, CR ou MAC">
        </label>
        <div class="cart-tools-strip">
          <button type="button" class="cart-settings-toggle" id="cartSettingsToggle" aria-label="Configurar C.R.">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 0 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 .9-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5.9h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6.9z"></path>
            </svg>
          </button>
          <button type="button" class="cart-search-toggle" id="cartSearchToggle" aria-label="Pesquisar CR" aria-expanded="false" aria-controls="cartSearchInput">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6"></circle>
              <path d="M20 20l-4.2-4.2"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="cart-summary-strip" id="cartTrackingSummary"></div>
      <div class="cart-room-grid" id="cartRoomGrid"></div>
      <div class="cart-detail-overlay" id="cartDetailOverlay" hidden>
        <div class="cart-detail-modal">
          <button type="button" class="cart-detail-close" id="cartDetailCloseBtn">x</button>
          <div class="cart-detail-hero">
            <span class="cart-detail-icon">${cartIcon()}</span>
            <div>
              <p>Detalhes do carrinho</p>
              <h2 id="cartDetailTitle">Carrinho</h2>
              <small id="cartDetailMeta">Sensor BLE</small>
            </div>
          </div>
          <div class="cart-detail-device-summary" id="cartDetailDeviceSummary"></div>
          <label>
            Nome do carrinho
            <input id="cartDetailName" type="text" placeholder="Carrinho 01">
          </label>
          <label>
            MAC do sensor
            <input id="cartDetailMac" type="text" placeholder="DE:08:DB:F4:73:11">
          </label>
          <section class="cart-calibration-panel" id="cartCalibrationPanel">
            <button type="button" class="cart-calibration-toggle" id="cartCalibrationToggle" aria-expanded="false" aria-controls="cartCalibrationBody">
              <span>
                <strong>Calibração do dispositivo</strong>
                <small>Regras atuais do carrinho</small>
              </span>
              <em id="cartCalibrationSummary">720 mm · 50%</em>
            </button>
            <div class="cart-calibration-body" id="cartCalibrationBody" hidden>
              <div class="cart-calibration-grid">
                <span><em>Calibração atual</em><strong id="cartCalibrationCurrent">--</strong></span>
                <span><em>Limite cheio</em><strong id="cartCalibrationFull">--</strong></span>
                <span><em>Forma de leitura</em><strong id="cartCalibrationReadMode">Por porcentagem</strong></span>
                <span><em>Limite crítico</em><strong id="cartCalibrationRed">--</strong></span>
              </div>
              <button type="button" class="cart-secondary-btn cart-calibration-lid-toggle" id="cartCalibrationLidToggle">Leitura lateral ativa</button>
              <p class="cart-calibration-status" id="cartCalibrationStatus"></p>
              <div class="cart-calibration-actions">
                <button type="button" class="cart-secondary-btn" id="cartCalibrationEditBtn">Editar</button>
                <button type="button" class="cart-secondary-btn" id="cartCalibrationNewBtn">Nova calibração</button>
              </div>
              <div class="cart-calibration-edit" id="cartCalibrationEdit" hidden>
                <label>
                  Limite crítico
                  <input id="cartCalibrationRedPercent" type="hidden" value="50">
                  <div class="cart-calibration-select" data-calibration-select="cartCalibrationRedPercent"></div>
                </label>
                <div class="cart-calibration-actions">
                  <button type="button" class="cart-primary-btn" id="cartCalibrationSaveBtn">Salvar limite</button>
                  <button type="button" class="cart-secondary-btn" id="cartCalibrationCancelBtn">Cancelar</button>
                </div>
              </div>
              <div class="cart-calibration-new" id="cartCalibrationNewFlow" hidden>
                <p class="cart-calibration-note">Caso opte por uma nova calibração, as configurações atuais deste carrinho serão substituídas. Use isso quando o sensor mudar de carrinho ou quando o carrinho tiver outro tamanho.</p>
                <button type="button" class="cart-secondary-btn" id="cartCalibrationStartBtn">Buscar calibração atual</button>
                <div class="cart-calibration-samples" id="cartCalibrationSamples"></div>
                <p class="cart-calibration-draft" id="cartCalibrationDraft"></p>
                <label>
                  Limite crítico
                  <input id="cartCalibrationNewRedPercent" type="hidden" value="50">
                  <div class="cart-calibration-select" data-calibration-select="cartCalibrationNewRedPercent"></div>
                </label>
                <p class="cart-calibration-status" id="cartCalibrationNewStatus"></p>
                <div class="cart-calibration-actions">
                  <button type="button" class="cart-primary-btn" id="cartCalibrationConfirmBtn" disabled>Confirmar calibração</button>
                  <button type="button" class="cart-secondary-btn" id="cartCalibrationNewCancelBtn">Cancelar</button>
                </div>
              </div>
            </div>
          </section>
          <button type="button" class="cart-primary-btn" id="cartDetailSaveBtn">Salvar</button>
        </div>
      </div>
      <div class="cart-settings-overlay" id="cartSettingsOverlay" hidden>
        <div class="cart-settings-modal">
          <button type="button" class="cart-detail-close" id="cartSettingsCloseBtn">x</button>
          <div class="cart-settings-head">
            <span>Configurações</span>
            <h2>Ambiente C.R.</h2>
            <p>Salas, gateways e sensores cadastrados para o monitoramento.</p>
          </div>
          <div class="cart-settings-content" id="cartSettingsContent"></div>
        </div>
      </div>
      <div class="cart-room-settings-overlay" id="cartRoomSettingsOverlay" hidden>
        <div class="cart-room-settings-modal">
          <button type="button" class="cart-detail-close" id="cartRoomSettingsCloseBtn">x</button>
          <h2>Configurar sala</h2>
          <label>
            Nome da sala
            <input id="cartRoomSettingsName" type="text" placeholder="SALA BLOCO B1">
          </label>
          <label>
            Gateway
            <input id="cartRoomSettingsGateway" type="text" placeholder="e6a69dbb6d2d">
          </label>
          <button type="button" class="cart-primary-btn" id="cartRoomSettingsSaveBtn">Salvar</button>
        </div>
      </div>
      <div class="cart-room-modal-overlay" id="cartRoomModalOverlay" hidden>
        <div class="cart-room-modal">
          <button type="button" class="cart-detail-close" id="cartRoomModalCloseBtn">x</button>
          <header class="cart-room-modal-header">
            <div>
              <h2 id="cartRoomModalTitle">Sala de resíduos</h2>
              <button type="button" class="cart-room-gateway" id="cartRoomModalGatewayBtn">Gateway: não vinculado</button>
            </div>
            <img class="cart-room-modal-icon" id="cartRoomModalIcon" src="./assets/cr-icon-residue-clean.png" alt="">
          </header>
          <div class="cart-room-modal-body">
            <div class="cart-room-empty">Nenhum carrinho nesta sala.</div>
          </div>
        </div>
      </div>
      <div class="cart-room-insight-overlay" id="cartRoomInsightOverlay" hidden>
        <div class="cart-room-insight-modal">
          <button type="button" class="cart-detail-close" id="cartRoomInsightCloseBtn">x</button>
          <div id="cartRoomInsightContent"></div>
        </div>
      </div>
      <div class="cart-transit-modal-overlay" id="cartTransitModalOverlay" hidden>
        <div class="cart-transit-modal">
          <button type="button" class="cart-detail-close" id="cartTransitModalCloseBtn">x</button>
          <div id="cartTransitModalContent"></div>
        </div>
      </div>
      <div class="cart-report-modal-overlay" id="cartReportModalOverlay" hidden>
        <div class="cart-transit-modal cart-report-modal">
          <button type="button" class="cart-detail-close" id="cartReportModalCloseBtn">x</button>
          <div id="cartReportModalContent"></div>
        </div>
      </div>
      <div class="cart-alert-modal-overlay" id="cartAlertModalOverlay" hidden>
        <div class="cart-alert-modal">
          <button type="button" class="cart-detail-close" id="cartAlertModalCloseBtn">x</button>
          <div id="cartAlertModalContent"></div>
        </div>
      </div>
    `;

    mountCartTrackingView(view);

    document.getElementById('cartTrackingSummary')?.addEventListener('click', handleCartFilterClick);
    document.getElementById('cartSearchToggle')?.addEventListener('click', () => {
      const view = document.getElementById('cartTrackingView');
      const input = document.getElementById('cartSearchInput');
      const isOpen = view?.classList.contains('search-open');
      const hasValue = Boolean(input?.value.trim());
      if(isOpen && !hasValue){
        input?.blur();
        syncCartSearchUi();
        return;
      }
      input?.focus();
      syncCartSearchUi();
    });
    document.getElementById('cartSearchInput')?.addEventListener('input', event => {
      cartSearchTerm = event.target.value || '';
      activeRoomFilter = '';
      syncCartSearchUi();
      renderRooms();
    });
    document.getElementById('cartSearchInput')?.addEventListener('focus', syncCartSearchUi);
    document.getElementById('cartSearchInput')?.addEventListener('blur', () => {
      window.setTimeout(syncCartSearchUi, 120);
    });
    document.getElementById('cartSettingsToggle')?.addEventListener('click', openCartSettings);
    document.getElementById('cartSettingsCloseBtn')?.addEventListener('click', closeCartSettings);
    document.getElementById('cartSettingsOverlay')?.addEventListener('click', event => {
      if(event.target.id === 'cartSettingsOverlay') closeCartSettings();
    });
    document.getElementById('cartSettingsContent')?.addEventListener('click', handleCartSettingsClick);
    document.getElementById('openPanelUsersModal')?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      openPanelUsersManager();
    });
    document.getElementById('closePanelUsersModal')?.addEventListener('click', closePanelUsersManager);
    document.getElementById('panelUsersOverlay')?.addEventListener('click', event => {
      if(event.target.id === 'panelUsersOverlay') closePanelUsersManager();
    });
    document.getElementById('panelUsersContent')?.addEventListener('click', handlePanelUsersClick);
    document.getElementById('cartRoomSettingsCloseBtn')?.addEventListener('click', closeRoomSettings);
    document.getElementById('cartRoomSettingsOverlay')?.addEventListener('click', event => {
      if(event.target.id === 'cartRoomSettingsOverlay') closeRoomSettings();
    });
    document.getElementById('cartRoomSettingsSaveBtn')?.addEventListener('click', saveRoomSettings);
    document.getElementById('cartTrackingView')?.addEventListener('click', event => {
      if(event.target.closest('.cart-search-box') || event.target.closest('#cartSearchToggle') || event.target.closest('#cartSettingsToggle')) return;
      window.setTimeout(syncCartSearchUi, 0);
    });
    document.getElementById('cartRoomGrid')?.addEventListener('click', handleRoomClick);
    document.getElementById('cartDetailCloseBtn')?.addEventListener('click', closeCartDetail);
    document.getElementById('cartDetailSaveBtn')?.addEventListener('click', saveCartDetail);
    document.getElementById('cartDetailOverlay')?.addEventListener('click', event => {
      if(event.target.id === 'cartDetailOverlay') closeCartDetail();
    });
    document.getElementById('cartRoomModalCloseBtn')?.addEventListener('click', closeCartRoomModal);
    document.getElementById('cartRoomModalOverlay')?.addEventListener('click', event => {
      if(event.target.id === 'cartRoomModalOverlay') closeCartRoomModal();
    });
    document.getElementById('cartRoomModalGatewayBtn')?.addEventListener('click', saveCartRoomModalGateway);
    document.getElementById('cartRoomInsightCloseBtn')?.addEventListener('click', closeRoomInsight);
    document.getElementById('cartRoomInsightOverlay')?.addEventListener('click', event => {
      if(event.target.id === 'cartRoomInsightOverlay') closeRoomInsight();
      const modeButton = event.target.closest('[data-room-insight-mode]');
      if(modeButton){
        renderRoomInsight(
          modeButton.getAttribute('data-room-id') || document.getElementById('cartRoomInsightOverlay')?.dataset.roomId,
          modeButton.getAttribute('data-room-insight-mode') || 'info'
        );
      }
    });
    document.getElementById('cartTransitModalCloseBtn')?.addEventListener('click', closeTransitModal);
    document.getElementById('cartTransitModalOverlay')?.addEventListener('click', event => {
      if(event.target.id === 'cartTransitModalOverlay') closeTransitModal();
    });
    document.getElementById('cartReportModalCloseBtn')?.addEventListener('click', closeCartReportModal);
    document.getElementById('cartReportModalOverlay')?.addEventListener('click', event => {
      if(event.target.id === 'cartReportModalOverlay') closeCartReportModal();
    });
    document.getElementById('cartAlertModalCloseBtn')?.addEventListener('click', closeCartAlertModal);
    document.getElementById('cartAlertModalContent')?.addEventListener('click', handleCartAlertModalClick);
    document.getElementById('cartCalibrationToggle')?.addEventListener('click', toggleCartCalibrationPanel);
    document.getElementById('cartCalibrationPanel')?.addEventListener('click', handleCalibrationSelectClick);
    document.getElementById('cartCalibrationPanel')?.addEventListener('keydown', handleCalibrationSelectKeydown);
    document.getElementById('cartCalibrationEditBtn')?.addEventListener('click', openCartCalibrationEdit);
    document.getElementById('cartCalibrationNewBtn')?.addEventListener('click', openCartCalibrationNew);
    document.getElementById('cartCalibrationLidToggle')?.addEventListener('click', toggleCartLidDetection);
    document.getElementById('cartCalibrationStartBtn')?.addEventListener('click', startCartCalibration);
    document.getElementById('cartCalibrationSaveBtn')?.addEventListener('click', saveCartCalibrationLimit);
    document.getElementById('cartCalibrationCancelBtn')?.addEventListener('click', cancelCartCalibrationDraft);
    document.getElementById('cartCalibrationConfirmBtn')?.addEventListener('click', confirmCartCalibration);
    document.getElementById('cartCalibrationNewCancelBtn')?.addEventListener('click', cancelCartCalibrationDraft);

    renderRooms();
    return view;
  }

  function setCartFilter(filter){
    activeCartFilter = filter || 'all';
    activeRoomFilter = '';
    renderRooms();
  }

  function handleCartFilterClick(event){
    const reportButton = event.target.closest('[data-cart-report-modal]');
    if(reportButton){
      openCartReportModal();
      return;
    }

    const alertsButton = event.target.closest('[data-cart-alerts-modal]');
    if(alertsButton){
      if(typeof window.openCartAlertInbox === 'function') window.openCartAlertInbox();
      return;
    }

    const transitButton = event.target.closest('[data-cart-transit-modal]');
    if(transitButton){
      openTransitModal();
      return;
    }

    const roomModalButton = event.target.closest('[data-cart-room-modal]');
    if(roomModalButton){
      openCartRoomModal(roomModalButton.getAttribute('data-cart-room-modal'));
      return;
    }

    const roomButton = event.target.closest('[data-cart-room-filter]');
    if(roomButton){
      activeRoomFilter = roomButton.getAttribute('data-cart-room-filter') || '';
      activeCartFilter = 'all';
      cartSearchTerm = '';
      const input = document.getElementById('cartSearchInput');
      if(input) input.value = '';
      syncCartSearchUi();
      renderRooms();
      return;
    }
    const filterButton = event.target.closest('[data-cart-filter]');
    if(!filterButton) return;
    setCartFilter(filterButton.getAttribute('data-cart-filter'));
  }

  function openCartRoomModal(kind){
    const overlay = document.getElementById('cartRoomModalOverlay');
    const title = document.getElementById('cartRoomModalTitle');
    const icon = document.getElementById('cartRoomModalIcon');
    const gateway = document.getElementById('cartRoomModalGatewayBtn');
    if(!overlay) return;

    const isHygiene = kind === 'hygiene';
    const roomId = isHygiene ? HYGIENE_ROOM_ID : RESIDUE_ROOM_ID;
    const state = readState();
    const room = state.rooms.find(item => item.id === roomId);
    overlay.dataset.roomId = roomId;
    if(title) title.textContent = isHygiene ? 'Sala de higienização' : 'Sala de resíduos';
    if(icon) icon.src = isHygiene ? './assets/cr-icon-hygiene-clean.png' : './assets/cr-icon-residue-clean.png';
    if(gateway) gateway.textContent = `Gateway: ${room?.gatewayDeviceId || 'não vinculado'}`;
    overlay.hidden = false;
  }

  function closeCartRoomModal(){
    const overlay = document.getElementById('cartRoomModalOverlay');
    if(overlay) overlay.hidden = true;
  }

  function saveCartRoomModalGateway(){
    const overlay = document.getElementById('cartRoomModalOverlay');
    const roomId = overlay?.dataset.roomId;
    if(!roomId) return;
    const state = readState();
    const room = state.rooms.find(item => item.id === roomId);
    if(!room) return;
    const nextGateway = prompt('Device ID do gateway BLE/LoRa desta sala:', room.gatewayDeviceId || '');
    if(nextGateway === null) return;
    room.gatewayDeviceId = nextGateway.trim();
    saveState(state);
    renderRooms();
    openCartRoomModal(roomId === HYGIENE_ROOM_ID ? 'hygiene' : 'residue');
  }

  function cartRoomNameById(state, roomId){
    return state.rooms.find(room => room.id === roomId)?.name || 'Sem sala';
  }

  function cartCalibrationSummaryLabel(cart){
    const calibration = cartCalibration(cart);
    const distance = distanceForFillPercentage(calibration, calibration.redPercent);
    return `${calibration.redPercent}% (${formatMm(distance)})`;
  }

  function gatewaySettingsItems(state){
    return state.rooms
      .filter(room => normalizeGatewayId(room.gatewayDeviceId))
      .map(room => ({
        id:normalizeGatewayId(room.gatewayDeviceId),
        short:formatGatewayShort(room.gatewayDeviceId),
        roomId:room.id,
        roomName:room.name
      }))
      .filter((item, index, list) => list.findIndex(other => other.id === item.id) === index);
  }

  function panelApiBaseUrl(){
    if(typeof window.getPanelApiBaseUrl === 'function'){
      return window.getPanelApiBaseUrl();
    }
    return String(window.location.origin || '').replace(/\/+$/, '') || 'http://localhost:4000';
  }

  async function panelApi(path, options = {}){
    const response = await fetch(`${panelApiBaseUrl()}${path}`, {
      ...options,
      headers:{
        'Content-Type':'application/json',
        ...(window.activePanelSession?.token ? { Authorization:`Bearer ${window.activePanelSession.token}` } : {}),
        ...(options.headers || {})
      }
    });
    const payload = await response.json().catch(() => null);
    if(!response.ok || !payload?.ok){
      const message = payload?.message || 'Não foi possível concluir a operação.';
      if(response.status === 401 && typeof window.expirePanelSession === 'function'){
        window.expirePanelSession('Sessão expirada. Faça login novamente.');
      }
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    return payload.data;
  }

  async function saveCartAlertSettingsToBackend(settings){
    const normalizedSettings = normalizeCartAlertSettings(settings);
    if(!window.activePanelSession?.token){
      return normalizedSettings;
    }
    const saved = await panelApi('/api/cart-tracking/alert-settings', {
      method:'PUT',
      body:JSON.stringify({ alertSettings:normalizedSettings })
    });
    const currentState = readState();
    const backendState = ensureSeedData({
      ...currentState,
      ...(saved?.state || {}),
      alertSettings:saved?.alertSettings || saved?.state?.alertSettings || normalizedSettings,
      telemetryEvents:[],
      backendChartSamples:[],
      alerts:Array.isArray(currentState.alerts) ? currentState.alerts : []
    }).state;
    cartConfigBackendLoaded = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(backendState));
    return backendState.alertSettings;
  }

  window.saveCartAlertSettingsToBackend = saveCartAlertSettingsToBackend;

  async function loadCartConfigFromBackend(force = false){
    if(cartConfigBackendLoaded && !force) return readState();
    if(!window.activePanelSession?.token){
      return readState();
    }
    if(cartConfigBackendLoadPromise){
      return cartConfigBackendLoadPromise;
    }
    cartConfigBackendLoadPromise = (async () => {
    try{
      const data = await panelApi('/api/cart-tracking/config');
      const currentState = readState();
      const payloadState = data?.state || {};
      const backendState = ensureSeedData({
        ...currentState,
        ...payloadState,
        telemetryEvents:[],
        backendChartSamples:[],
        alerts:Array.isArray(currentState.alerts) ? currentState.alerts : []
      }).state;
      if(hasCartConfigurationData(currentState) && !hasCartConfigurationData(backendState)){
        cartConfigBackendLoaded = true;
        console.warn('Configuracao C.R. vazia ignorada para preservar carrinhos carregados.');
        return currentState;
      }
      cartConfigBackendLoaded = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backendState));
      return backendState;
    }catch(err){
      cartConfigBackendLoaded = false;
      console.warn('Usando cache local do C.R.; backend nao retornou configuracao.', err);
      return readState();
    }finally{
      cartConfigBackendLoadPromise = null;
    }
    })();
    return cartConfigBackendLoadPromise;
  }

  async function refreshCartConfigFromBackend(){
    const state = await loadCartConfigFromBackend(true);
    if(cartConfigBackendLoaded || !window.activePanelSession?.token){
      renderRooms(state);
    }else{
      renderSummary(state);
      const grid = document.getElementById('cartRoomGrid');
      if(grid){
        grid.innerHTML = '<div class="cart-room-empty cart-room-empty-wide">Nao foi possivel carregar os CRs do servidor.</div>';
      }
    }
    return state;
  }
  window.refreshCartConfigFromBackend = refreshCartConfigFromBackend;

  async function loadPanelClientsForSettings(){
    if(cartPanelSettingsLoading) return;
    cartPanelSettingsLoading = true;
    renderCartSettingsContent();
    renderPanelUsersModalContent();
    try{
      const data = await panelApi('/api/panel/clients');
      cartPanelClients = data?.clients || [];
      cartPanelClientsLoaded = true;
    }catch(err){
      alert(err.message || 'Não foi possível carregar os clientes.');
    }finally{
      cartPanelSettingsLoading = false;
      renderCartSettingsContent();
      renderPanelUsersModalContent();
    }
  }

  async function loadPanelUsersForSettings(clientId){
    if(cartPanelSettingsLoading) return;
    cartPanelSettingsLoading = true;
    cartPanelUsersClientId = clientId || '';
    renderCartSettingsContent();
    renderPanelUsersModalContent();
    try{
      const data = await panelApi(`/api/panel/users?client_id=${encodeURIComponent(clientId || '')}`);
      cartPanelUsers = data?.users || [];
    }catch(err){
      alert(err.message || 'Não foi possível carregar os usuários.');
    }finally{
      cartPanelSettingsLoading = false;
      renderCartSettingsContent();
      renderPanelUsersModalContent();
    }
  }

  async function refreshPanelUsersAndClients(clientId){
    cartPanelSettingsLoading = true;
    renderCartSettingsContent();
    renderPanelUsersModalContent();
    try{
      const [clientsData, usersData] = await Promise.all([
        panelApi('/api/panel/clients'),
        panelApi(`/api/panel/users?client_id=${encodeURIComponent(clientId || '')}`)
      ]);
      cartPanelClients = clientsData?.clients || [];
      cartPanelClientsLoaded = true;
      cartPanelUsers = usersData?.users || [];
      cartPanelUsersClientId = clientId || '';
    }catch(err){
      alert(err.message || 'Não foi possível atualizar os usuários.');
    }finally{
      cartPanelSettingsLoading = false;
      renderCartSettingsContent();
      renderPanelUsersModalContent();
    }
  }

  async function createPanelUser(clientId){
    const displayName = document.getElementById('panelUserNameInput')?.value.trim() || '';
    const password = document.getElementById('panelUserPasswordInput')?.value || '';
    if(!clientId){
      alert('Selecione um cliente.');
      return;
    }
    if(!displayName){
      alert('Informe o nome do usuário.');
      return;
    }
    if(password.length < 6){
      alert('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    try{
      cartPanelSettingsLoading = true;
      renderCartSettingsContent();
      await panelApi('/api/panel/users', {
        method:'POST',
        body:JSON.stringify({ clientId, displayName, password })
      });
      await refreshPanelUsersAndClients(clientId);
    }catch(err){
      cartPanelSettingsLoading = false;
      renderCartSettingsContent();
      alert(err.message || 'Não foi possível cadastrar o usuário.');
    }
  }

  async function resetPanelUserPassword(userId){
    if(!userId) return;
    const password = window.prompt('Nova senha do usuário:');
    if(password === null) return;
    if(String(password).length < 6){
      alert('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    try{
      await panelApi(`/api/panel/users/${encodeURIComponent(userId)}/reset-password`, {
        method:'POST',
        body:JSON.stringify({ password })
      });
      await refreshPanelUsersAndClients(cartPanelUsersClientId);
    }catch(err){
      alert(err.message || 'Não foi possível redefinir a senha.');
    }
  }

  async function deletePanelUser(userId){
    if(!userId) return;
    const user = cartPanelUsers.find(item => item.id === userId);
    if(!window.confirm(`Excluir o usuário ${user?.username || ''}?`)) return;
    try{
      await panelApi(`/api/panel/users/${encodeURIComponent(userId)}/delete`, { method:'POST' });
      await refreshPanelUsersAndClients(cartPanelUsersClientId);
    }catch(err){
      alert(err.message || 'Não foi possível excluir o usuário.');
    }
  }

  function settingsPanelHeader(title, subtitle){
    return `
      <div class="cart-settings-drill-head">
        ${cartSettingsView === 'home' ? '' : '<button type="button" data-settings-back aria-label="Voltar">←</button>'}
        <span>
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml(subtitle)}</small>
        </span>
      </div>
    `;
  }

  function settingsHomeCard(view, title, subtitle, count){
    return `
      <button type="button" class="cart-settings-home-card" data-settings-view="${escapeHtml(view)}">
        <span>
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml(subtitle)}</small>
        </span>
        <b>${escapeHtml(String(count))}</b>
      </button>
    `;
  }

  function cartSettingsClientRows(){
    if(cartPanelSettingsLoading && !cartPanelClientsLoaded){
      return '<p class="cart-settings-empty">Carregando clientes...</p>';
    }
    if(!cartPanelClients.length){
      return '<p class="cart-settings-empty">Nenhum cliente ativo encontrado.</p>';
    }
    return cartPanelClients.map(client => `
      <button type="button" class="cart-settings-row cart-settings-row-button" data-settings-user-client="${escapeHtml(client.id)}">
        <span>
          <strong>${escapeHtml(client.nome || client.organization || 'Cliente')}</strong>
          <small>${Number(client.userCount || 0)} usuário${Number(client.userCount || 0) === 1 ? '' : 's'} ativo${Number(client.userCount || 0) === 1 ? '' : 's'}</small>
        </span>
        <b>Ver</b>
      </button>
    `).join('');
  }

  function selectedPanelClient(){
    return cartPanelClients.find(client => client.id === cartPanelUsersClientId) || null;
  }

  function cartSettingsUserRows(){
    if(cartPanelSettingsLoading){
      return '<p class="cart-settings-empty">Carregando usuários...</p>';
    }
    if(!cartPanelUsers.length){
      return '<p class="cart-settings-empty">Nenhum usuário cadastrado para este cliente.</p>';
    }
    return cartPanelUsers.map(user => `
      <div class="cart-settings-row device">
        <span>
          <strong>${escapeHtml(user.displayName || user.username)}</strong>
          <small>${escapeHtml(user.username)} · usuário básico</small>
          <small>${escapeHtml(user.clienteNome || user.organization || '')}</small>
        </span>
        <span class="cart-settings-row-actions">
          <button type="button" data-settings-reset-panel-user="${escapeHtml(user.id)}">Redefinir senha</button>
          <button type="button" data-settings-delete-panel-user="${escapeHtml(user.id)}">Excluir</button>
        </span>
      </div>
    `).join('');
  }

  function renderPanelUserCreateForm(client){
    return `
      <div class="cart-settings-inline-form">
        <label>
          Nome do usuário
          <input id="panelUserNameInput" type="text" placeholder="David">
        </label>
        <label>
          Senha
          <input id="panelUserPasswordInput" type="password" placeholder="Mínimo 6 caracteres">
        </label>
        <button type="button" class="cart-settings-mini-btn" data-settings-create-panel-user="${escapeHtml(client?.id || '')}">Cadastrar usuário</button>
        <small>O acesso será criado como nome.${escapeHtml(client?.slug || 'cliente')}.</small>
      </div>
    `;
  }

  function cartSettingsRoomRows(state){
    const rows = state.rooms.map(room => {
      const count = state.carts.filter(cart => cart.roomId === room.id && cart.locationStatus !== 'transit').length;
      return `
        <div class="cart-settings-row">
          <span>
            <strong>${escapeHtml(room.name)}</strong>
            <small>Gateway ${escapeHtml(formatGatewayShort(room.gatewayDeviceId))} · ${count} CR</small>
          </span>
          <span class="cart-settings-row-actions">
            <button type="button" data-settings-room="${escapeHtml(room.id)}">Editar</button>
            <button type="button" data-settings-delete-room="${escapeHtml(room.id)}">Remover</button>
          </span>
        </div>
      `;
    }).join('');
    return rows || '<p class="cart-settings-empty">Nenhuma sala cadastrada.</p>';
  }

  function cartSettingsGatewayRows(state){
    const gateways = gatewaySettingsItems(state);
    if(!gateways.length){
      return '<p class="cart-settings-empty">Nenhum gateway vinculado.</p>';
    }
    return gateways.map(gateway => `
      <div class="cart-settings-row">
        <span>
          <strong>MKGW4 Smart · ${escapeHtml(gateway.short)}</strong>
          <small>MOKO · gateway ativo · ${escapeHtml(gateway.roomName)}</small>
        </span>
        <span class="cart-settings-row-actions">
          <button type="button" data-settings-room="${escapeHtml(gateway.roomId)}">Trocar sala</button>
          <button type="button" data-settings-clear-gateway="${escapeHtml(gateway.roomId)}">Remover</button>
        </span>
      </div>
    `).join('');
  }

  function cartSettingsDeviceRows(state){
    if(!state.carts.length){
      return '<p class="cart-settings-empty">Nenhum sensor cadastrado.</p>';
    }
    return state.carts.map(cart => `
      <div class="cart-settings-row device">
        <span>
          <strong>${escapeHtml(cartDisplayName(cart))}</strong>
          <small>${escapeHtml(formatMac(cart.mac))} · ${escapeHtml(cartRoomNameById(state, cart.roomId))}</small>
          <small>Calibração ${escapeHtml(cartCalibrationSummaryLabel(cart))} · Bateria ${escapeHtml(cartBatteryLabel(cart))}</small>
        </span>
        <span class="cart-settings-row-actions">
          <button type="button" data-settings-device="${escapeHtml(cart.id)}">Detalhes</button>
          <button type="button" data-settings-calibration="${escapeHtml(cart.id)}">Calibrar</button>
          <button type="button" data-settings-delete-device="${escapeHtml(cart.id)}">Excluir</button>
        </span>
      </div>
    `).join('');
  }

  function renderCartSettingsContent(){
    const content = document.getElementById('cartSettingsContent');
    if(!content) return;
    const state = readState();
    const gatewayCount = gatewaySettingsItems(state).length;

    if(cartSettingsView === 'users'){
      content.innerHTML = `
        ${settingsPanelHeader('Usuários do painel', 'Escolha o cliente para ver ou criar acessos.')}
        <section class="cart-settings-section">
          <div class="cart-settings-section-head">
            <span>
              <strong>Clientes ativos</strong>
              <small>Usuários básicos herdam o logo e o acesso do cliente.</small>
            </span>
          </div>
          <div class="cart-settings-list drill-list">${cartSettingsClientRows()}</div>
        </section>
      `;
      if(!cartPanelClientsLoaded && !cartPanelSettingsLoading) loadPanelClientsForSettings();
      return;
    }

    if(cartSettingsView === 'clientUsers'){
      const client = selectedPanelClient();
      content.innerHTML = `
        ${settingsPanelHeader(client?.nome || 'Cliente', 'Cadastre, redefina senha ou exclua usuários.')}
        <section class="cart-settings-section">
          <div class="cart-settings-section-head">
            <span>
              <strong>Usuários cadastrados</strong>
              <small>${escapeHtml(client?.nome || '')}</small>
            </span>
          </div>
          ${renderPanelUserCreateForm(client)}
          <div class="cart-settings-list drill-list">${cartSettingsUserRows()}</div>
        </section>
      `;
      return;
    }

    if(cartSettingsView === 'rooms'){
      content.innerHTML = `
        ${settingsPanelHeader('Salas cadastradas', `${state.rooms.length} salas no ambiente atual.`)}
        <section class="cart-settings-section">
          <div class="cart-settings-section-head">
            <span>
              <strong>Salas</strong>
              <small>Crie, edite, remova e vincule gateways.</small>
            </span>
            <button type="button" class="cart-settings-mini-btn" data-settings-add-room>Adicionar sala</button>
          </div>
          <div class="cart-settings-list drill-list">${cartSettingsRoomRows(state)}</div>
        </section>
      `;
      return;
    }

    if(cartSettingsView === 'gateways'){
      content.innerHTML = `
        ${settingsPanelHeader('Gateways', `${gatewayCount} gateway ativo.`)}
        <section class="cart-settings-section">
          <div class="cart-settings-section-head">
            <span>
              <strong>Gateways</strong>
              <small>Gateway MOKO atualmente vinculado.</small>
            </span>
          </div>
          <div class="cart-settings-list drill-list">${cartSettingsGatewayRows(state)}</div>
        </section>
      `;
      return;
    }

    if(cartSettingsView === 'devices'){
      content.innerHTML = `
        ${settingsPanelHeader('Dispositivos', `${gatewayCount} gateway e ${state.carts.length} sensores cadastrados.`)}
        <div class="cart-settings-home">
          ${settingsHomeCard('gateways', 'Gateways', 'Gateway MOKO ativo.', gatewayCount)}
          ${settingsHomeCard('sensors', 'Sensores', 'Sensores ToF dos carrinhos.', state.carts.length)}
        </div>
      `;
      return;
    }

    if(cartSettingsView === 'sensors'){
      content.innerHTML = `
        ${settingsPanelHeader('Sensores', `${state.carts.length} sensores cadastrados.`)}
        <section class="cart-settings-section">
          <div class="cart-settings-section-head">
            <span>
              <strong>Sensores</strong>
              <small>Consulte, calibre ou exclua sensores.</small>
            </span>
            <button type="button" class="cart-settings-mini-btn" data-settings-add-device>Adicionar dispositivo</button>
          </div>
          <div class="cart-settings-list drill-list">${cartSettingsDeviceRows(state)}</div>
        </section>
      `;
      return;
    }

    cartSettingsView = 'home';
    content.innerHTML = `
      ${settingsPanelHeader('Configurações C.R.', 'Escolha uma área para configurar.')}
      <div class="cart-settings-home">
        ${settingsHomeCard('rooms', 'Salas cadastradas', 'Sala Bloco B1, resíduos e higiene.', state.rooms.length)}
        ${settingsHomeCard('devices', 'Dispositivos', 'Gateway e sensores cadastrados.', gatewayCount + state.carts.length)}
      </div>
    `;
  }

  function renderPanelUsersModalContent(){
    const content = document.getElementById('panelUsersContent');
    if(!content) return;

    if(!cartPanelClientsLoaded && !cartPanelSettingsLoading){
      loadPanelClientsForSettings();
    }

    if(panelUsersView === 'clientUsers'){
      const client = selectedPanelClient();
      content.innerHTML = `
        <header class="panel-users-head">
          <span>Usuários</span>
          <h2 id="panelUsersTitle">${escapeHtml(client?.nome || 'Cliente')}</h2>
          <p>Cadastre, redefina senha ou exclua acessos básicos.</p>
        </header>
        <button type="button" class="panel-users-back" data-panel-users-back>← Voltar aos clientes</button>
        <section class="cart-settings-section panel-users-section">
          <div class="cart-settings-section-head">
            <span>
              <strong>Usuários cadastrados</strong>
              <small>O login usa o logo e o nome do cliente.</small>
            </span>
          </div>
          <div class="cart-settings-list drill-list">${cartSettingsUserRows()}</div>
        </section>
        ${renderPanelUserCreateForm(client)}
      `;
      return;
    }

    content.innerHTML = `
      <header class="panel-users-head">
        <span>Usuários</span>
        <h2 id="panelUsersTitle">Usuários do painel</h2>
        <p>Escolha o cliente para ver ou criar acessos.</p>
      </header>
      <section class="cart-settings-section panel-users-section">
        <div class="cart-settings-section-head">
          <span>
            <strong>Clientes ativos</strong>
            <small>Usuários básicos herdam o logo do cliente.</small>
          </span>
        </div>
        <div class="cart-settings-list drill-list">${cartSettingsClientRows()}</div>
      </section>
    `;
  }

  function openPanelUsersManager(){
    if(!canManageCartSettings()) return;
    const overlay = document.getElementById('panelUsersOverlay');
    document.getElementById('panelConfigMenu')?.classList.remove('show');
    document.getElementById('panelConfigBtn')?.setAttribute('aria-expanded', 'false');
    panelUsersView = 'clients';
    renderPanelUsersModalContent();
    if(overlay) overlay.classList.add('show');
  }

  function closePanelUsersManager(){
    document.getElementById('panelUsersOverlay')?.classList.remove('show');
  }

  function handlePanelUsersClick(event){
    if(event.target.closest('[data-panel-users-back]')){
      panelUsersView = 'clients';
      cartPanelUsersClientId = '';
      cartPanelUsers = [];
      renderPanelUsersModalContent();
      return;
    }

    const clientButton = event.target.closest('[data-settings-user-client]');
    if(clientButton){
      const clientId = clientButton.getAttribute('data-settings-user-client') || '';
      panelUsersView = 'clientUsers';
      cartPanelUsersClientId = clientId;
      cartPanelUsers = [];
      renderPanelUsersModalContent();
      loadPanelUsersForSettings(clientId);
      return;
    }

    const createPanelUserButton = event.target.closest('[data-settings-create-panel-user]');
    if(createPanelUserButton){
      createPanelUser(createPanelUserButton.getAttribute('data-settings-create-panel-user') || cartPanelUsersClientId);
      return;
    }

    const resetPanelUserButton = event.target.closest('[data-settings-reset-panel-user]');
    if(resetPanelUserButton){
      resetPanelUserPassword(resetPanelUserButton.getAttribute('data-settings-reset-panel-user') || '');
      return;
    }

    const deletePanelUserButton = event.target.closest('[data-settings-delete-panel-user]');
    if(deletePanelUserButton){
      deletePanelUser(deletePanelUserButton.getAttribute('data-settings-delete-panel-user') || '');
    }
  }

  function createRoomIdFromName(state, name){
    const base = normalizeCartSearch(name)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'sala';
    let candidate = base.startsWith('sala-') ? base : `sala-${base}`;
    let index = 2;
    while(state.rooms.some(room => room.id === candidate)){
      candidate = `${base}-${index}`;
      index += 1;
    }
    return candidate;
  }

  function defaultNewCartRoomId(state){
    if(activeRoomFilter && state.rooms.some(room => room.id === activeRoomFilter)){
      return activeRoomFilter;
    }
    if(state.rooms.some(room => room.id === PILOT_ROOM_ID)){
      return PILOT_ROOM_ID;
    }
    return state.rooms.find(room => !SPECIAL_ROOM_IDS.has(room.id))?.id || state.rooms[0]?.id || '';
  }

  function handleCartSettingsClick(event){
    const backButton = event.target.closest('[data-settings-back]');
    if(backButton){
      cartSettingsView = CART_SETTINGS_PARENT_VIEW[cartSettingsView] || 'home';
      renderCartSettingsContent();
      return;
    }

    const viewButton = event.target.closest('[data-settings-view]');
    if(viewButton){
      cartSettingsView = viewButton.getAttribute('data-settings-view') || 'home';
      renderCartSettingsContent();
      return;
    }

    const clientButton = event.target.closest('[data-settings-user-client]');
    if(clientButton){
      const clientId = clientButton.getAttribute('data-settings-user-client') || '';
      cartSettingsView = 'clientUsers';
      cartPanelUsersClientId = clientId;
      cartPanelUsers = [];
      renderCartSettingsContent();
      loadPanelUsersForSettings(clientId);
      return;
    }

    const createPanelUserButton = event.target.closest('[data-settings-create-panel-user]');
    if(createPanelUserButton){
      createPanelUser(createPanelUserButton.getAttribute('data-settings-create-panel-user') || cartPanelUsersClientId);
      return;
    }

    const resetPanelUserButton = event.target.closest('[data-settings-reset-panel-user]');
    if(resetPanelUserButton){
      resetPanelUserPassword(resetPanelUserButton.getAttribute('data-settings-reset-panel-user') || '');
      return;
    }

    const deletePanelUserButton = event.target.closest('[data-settings-delete-panel-user]');
    if(deletePanelUserButton){
      deletePanelUser(deletePanelUserButton.getAttribute('data-settings-delete-panel-user') || '');
      return;
    }

    const addRoom = event.target.closest('[data-settings-add-room]');
    if(addRoom){
      openRoomSettings('');
      return;
    }

    const addDevice = event.target.closest('[data-settings-add-device]');
    if(addDevice){
      const state = readState();
      closeCartSettings();
      openCartDetail(null, defaultNewCartRoomId(state));
      return;
    }

    const roomButton = event.target.closest('[data-settings-room]');
    if(roomButton){
      openRoomSettings(roomButton.getAttribute('data-settings-room') || '');
      return;
    }

    const deleteRoomButton = event.target.closest('[data-settings-delete-room]');
    if(deleteRoomButton){
      deleteCartRoom(deleteRoomButton.getAttribute('data-settings-delete-room') || '');
      return;
    }

    const clearGatewayButton = event.target.closest('[data-settings-clear-gateway]');
    if(clearGatewayButton){
      clearRoomGateway(clearGatewayButton.getAttribute('data-settings-clear-gateway') || '');
      return;
    }

    const deleteDeviceButton = event.target.closest('[data-settings-delete-device]');
    if(deleteDeviceButton){
      deleteCartDevice(deleteDeviceButton.getAttribute('data-settings-delete-device') || '');
      return;
    }

    const deviceButton = event.target.closest('[data-settings-device]');
    const calibrationButton = event.target.closest('[data-settings-calibration]');
    const cartId = deviceButton?.getAttribute('data-settings-device') || calibrationButton?.getAttribute('data-settings-calibration');
    if(cartId){
      closeCartSettings();
      openCartDetail(cartId, '');
      if(calibrationButton){
        window.setTimeout(() => {
          setCalibrationExpanded(true);
          setCalibrationMode('view');
        }, 0);
      }
    }
  }

  function deleteCartRoom(roomId){
    if(!canManageCartSettings() || !roomId) return;
    const state = readState();
    const room = state.rooms.find(item => item.id === roomId);
    if(!room) return;
    if(!window.confirm(`Remover a sala ${room.name}? Os sensores vinculados ficarão sem sala.`)) return;
    state.rooms = state.rooms.filter(item => item.id !== roomId);
    state.carts.forEach(cart => {
      if(cart.roomId === roomId){
        cart.roomId = '';
        cart.locationStatus = 'offline';
        cart.transitStep = 0;
      }
    });
    if(activeRoomFilter === roomId) activeRoomFilter = '';
    saveState(state);
    renderCartSettingsContent();
    renderRooms();
  }

  function clearRoomGateway(roomId){
    if(!canManageCartSettings() || !roomId) return;
    const state = readState();
    const room = state.rooms.find(item => item.id === roomId);
    if(!room) return;
    if(!window.confirm(`Remover o gateway da sala ${room.name}?`)) return;
    room.gatewayDeviceId = '';
    saveState(state);
    renderCartSettingsContent();
    renderRooms();
  }

  function deleteCartDevice(cartId){
    if(!canManageCartSettings() || !cartId) return;
    const state = readState();
    const cart = state.carts.find(item => item.id === cartId);
    if(!cart) return;
    if(!window.confirm(`Excluir o dispositivo ${cartDisplayName(cart)}?`)) return;
    state.carts = state.carts.filter(item => item.id !== cartId);
    state.telemetryEvents = (state.telemetryEvents || []).filter(event => event.cartId !== cartId);
    saveState(state);
    renderCartSettingsContent();
    renderRooms();
  }

  function openCartSettings(){
    if(!canManageCartSettings()) return;
    const overlay = document.getElementById('cartSettingsOverlay');
    cartSettingsView = 'home';
    renderCartSettingsContent();
    if(overlay) overlay.hidden = false;
  }

  function closeCartSettings(){
    const overlay = document.getElementById('cartSettingsOverlay');
    if(overlay) overlay.hidden = true;
  }

  function openRoomSettings(roomId){
    if(!canManageCartSettings()) return;
    const state = readState();
    const room = state.rooms.find(item => item.id === roomId);
    const overlay = document.getElementById('cartRoomSettingsOverlay');
    if(!overlay) return;
    overlay.dataset.roomId = room?.id || '';
    const name = document.getElementById('cartRoomSettingsName');
    const gateway = document.getElementById('cartRoomSettingsGateway');
    const title = overlay.querySelector('h2');
    if(title) title.textContent = room ? 'Configurar sala' : 'Adicionar sala';
    if(name) name.value = room?.name || '';
    if(gateway) gateway.value = room?.gatewayDeviceId || '';
    overlay.hidden = false;
    name?.focus();
  }

  function closeRoomSettings(){
    const overlay = document.getElementById('cartRoomSettingsOverlay');
    if(overlay) overlay.hidden = true;
  }

  function saveRoomSettings(){
    if(!canManageCartSettings()) return;
    const overlay = document.getElementById('cartRoomSettingsOverlay');
    const roomId = overlay?.dataset.roomId;
    const state = readState();
    let room = state.rooms.find(item => item.id === roomId);
    const name = document.getElementById('cartRoomSettingsName')?.value.trim();
    const gateway = document.getElementById('cartRoomSettingsGateway')?.value.trim();
    if(!name){
      alert('Informe o nome da sala.');
      return;
    }
    if(!room){
      room = {
        id:createRoomIdFromName(state, name),
        name:'',
        gatewayDeviceId:'',
        expectedTotal:0
      };
      state.rooms.push(room);
    }
    room.name = name.toUpperCase();
    room.gatewayDeviceId = gateway || '';
    saveState(state);
    closeRoomSettings();
    renderCartSettingsContent();
    renderRooms();
  }

  function handleRoomClick(event){
    const filterButton = event.target.closest('[data-cart-filter]');
    const cartButton = event.target.closest('[data-cart-id]');
    const roomInsightButton = event.target.closest('[data-room-insight]');
    const roomSettingsButton = event.target.closest('[data-room-settings]');
    const gatewayButton = event.target.closest('[data-gateway-room]');
    const roomCard = event.target.closest('[data-room-open]');

    if(filterButton){
      setCartFilter(filterButton.getAttribute('data-cart-filter'));
      return;
    }

    if(cartButton){
      openCartDetail(cartButton.getAttribute('data-cart-id'));
      return;
    }

    if(roomInsightButton){
      openRoomInsight(
        roomInsightButton.getAttribute('data-room-insight'),
        roomInsightButton.getAttribute('data-room-insight-mode') || 'info'
      );
      return;
    }

    if(roomSettingsButton){
      openRoomSettings(roomSettingsButton.getAttribute('data-room-settings'));
      return;
    }

    if(gatewayButton){
      if(!canManageCartSettings()) return;
      const roomId = gatewayButton.getAttribute('data-gateway-room');
      const state = readState();
      const room = state.rooms.find(item => item.id === roomId);
      if(!room) return;
      const nextGateway = prompt('Device ID do gateway BLE/LoRa desta sala:', room.gatewayDeviceId || '');
      if(nextGateway === null) return;
      room.gatewayDeviceId = nextGateway.trim();
      saveState(state);
      renderRooms();
      return;
    }

    if(roomCard){
      openRoomInsight(roomCard.getAttribute('data-room-open'), 'info');
    }
  }

  async function openCartDetail(cartId, roomId){
    const overlay = document.getElementById('cartDetailOverlay');
    if(!overlay) return;

    const title = document.getElementById('cartDetailTitle');
    const meta = document.getElementById('cartDetailMeta');
    const summary = document.getElementById('cartDetailDeviceSummary');
    if(window.activePanelSession?.token){
      if(title) title.textContent = 'Carregando...';
      if(meta) meta.textContent = 'Sincronizando configuração do servidor';
      if(summary) summary.innerHTML = '<span><small>Status</small><strong>Atualizando dados</strong></span>';
      renderCartCalibrationPanel(null);
      overlay.hidden = false;
    }

    const state = window.activePanelSession?.token
      ? await loadCartConfigFromBackend(true)
      : readState();
    if(window.activePanelSession?.token && !cartConfigBackendLoaded){
      if(title) title.textContent = 'Não foi possível carregar';
      if(meta) meta.textContent = 'A configuração do servidor não respondeu.';
      if(summary) summary.innerHTML = '<span><small>Status</small><strong>Sincronização pendente</strong></span>';
      renderCartCalibrationPanel(null);
      return;
    }
    if(window.activePanelSession?.token){
      try{
        if(await hydrateStateWithLatestCartReadings(state)){
          saveState(state, { persistConfig:false });
        }
      }catch(error){
        console.warn('Nao foi possivel atualizar leitura antes dos detalhes do carrinho.', error);
      }
    }
    if(window.activePanelSession?.token) renderRooms(state);
    const cart = state.carts.find(item => item.id === cartId);

    overlay.dataset.cartId = cart?.id || '';
    overlay.dataset.roomId = cart?.roomId || roomId || '';

    const name = document.getElementById('cartDetailName');
    const mac = document.getElementById('cartDetailMac');
    const saveBtn = document.getElementById('cartDetailSaveBtn');
    const canManage = canManageCartSettings();
    const isNewCart = !cart;
    const canEditIdentity = canManage;

    if(title) title.textContent = cart ? cartDisplayName(cart) : 'Novo dispositivo';
    if(meta){
      const readingDetail = cart ? cartReadingDetail(cart) : '';
      const readingText = readingDetail ? ` - ${readingDetail}` : '';
      meta.textContent = cart ? `${locationLabel(cart)} - ${fillLabel(cart)}${readingText}` : 'Cadastro manual';
    }
    if(name) name.value = cart?.name || '';
    if(mac) mac.value = cart ? formatMac(cart.mac) : '';
    if(name) name.readOnly = !canEditIdentity;
    if(mac) mac.readOnly = !canEditIdentity;
    if(saveBtn) saveBtn.hidden = !canEditIdentity;
    if(summary){
      summary.innerHTML = cart ? `
        <span><small>MAC</small><strong>${escapeHtml(formatMac(cart.mac))}</strong></span>
        <span><small>Modelo</small><strong>Sensor ToF BLE</strong></span>
        <span><small>Sala</small><strong>${escapeHtml(cartRoomNameById(state, cart.roomId))}</strong></span>
        <span><small>Bateria</small><strong>${escapeHtml(cartBatteryLabel(cart))}</strong></span>
        <span><small>Última comunicação</small><strong>${escapeHtml(cart.lastCommunicationSeen || cart.lastSeen || 'sem comunicação')}</strong></span>
        <span><small>Última leitura</small><strong>${escapeHtml(cart.lastSeen || 'sem leitura')}</strong></span>
        <span><small>Calibração</small><strong>${escapeHtml(cartCalibrationSummaryLabel(cart))}</strong></span>
      ` : `
        <span><small>Tipo</small><strong>Sensor ToF BLE</strong></span>
        <span><small>Status</small><strong>Novo cadastro</strong></span>
      `;
    }
    renderCartCalibrationPanel(cart);
    setCalibrationExpanded(false);

    overlay.hidden = false;
    if(canEditIdentity) name?.focus();
  }

  function closeCartDetail(){
    const overlay = document.getElementById('cartDetailOverlay');
    if(overlay) overlay.hidden = true;
  }

  async function saveCartDetail(){
    if(!canManageCartSettings()) return;
    const overlay = document.getElementById('cartDetailOverlay');
    const state = readState();
    const cartId = overlay?.dataset.cartId;
    const roomId = overlay?.dataset.roomId || defaultNewCartRoomId(state);
    const name = document.getElementById('cartDetailName')?.value.trim();
    const mac = formatMac(document.getElementById('cartDetailMac')?.value);
    const saveBtn = document.getElementById('cartDetailSaveBtn');

    if(!name || cleanMac(mac).length !== 12){
      alert('Informe nome e MAC completo do sensor.');
      return;
    }

    const duplicate = state.carts.find(cart => cleanMac(cart.mac) === cleanMac(mac) && cart.id !== cartId);
    if(duplicate){
      alert('Este MAC já está cadastrado em outro carrinho.');
      return;
    }

    let cart = state.carts.find(item => item.id === cartId);
    const previousMac = cart ? cleanMac(cart.mac) : '';
    const isNewCart = !cart;
    const macChanged = Boolean(cart && previousMac !== cleanMac(mac));
    if(cart){
      cart.name = name;
      cart.mac = mac;
      if(roomId) cart.roomId = roomId;
      if(roomId && !cart.locationStatus) cart.locationStatus = 'in_room';
      if(macChanged){
        cart.calibration = clone(DEFAULT_CART_CALIBRATION);
        cart.fillPercentage = 0;
        cart.collectorStatus = 'uncalibrated';
        cart.levelStatus = '';
        cart.lastSeen = 'aguardando calibracao';
        cart.registeredAt = new Date().toISOString();
      }
    }else{
      cart = {
        id:`cart-${cleanMac(mac).toLowerCase()}`,
        name,
        mac,
        roomId,
        locationStatus: roomId ? 'in_room' : 'offline',
        fillPercentage:0,
        consecutiveCriticalReadings:0,
        calibration:clone(DEFAULT_CART_CALIBRATION),
        rssi:null,
        lastCommunicationAt:'',
        lastCommunicationSeen:'cadastro manual',
        lastSeen:'aguardando calibracao',
        collectorStatus:'uncalibrated',
        levelStatus:'',
        registeredAt:new Date().toISOString(),
        transitStep:0
      };
      state.carts.push(cart);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if(saveBtn){
      saveBtn.disabled = true;
      saveBtn.textContent = 'Salvando...';
    }
    try{
      if(isNewCart || macChanged){
        cart.calibration = await clearCartCalibrationFromBackend(mac);
      }
      const savedState = await saveCartConfigBackendNow(state);
      closeCartDetail();
      renderRooms(savedState);
    }catch(error){
      console.warn('Nao foi possivel salvar o carrinho no backend.', error);
      alert(error.message || 'Nao foi possivel salvar o carrinho. Tente novamente.');
    }finally{
      if(saveBtn){
        saveBtn.disabled = false;
        saveBtn.textContent = 'Salvar';
      }
    }
  }

  function openCartTrackingView(){
    window.__pendingCartTrackingOpen = false;
    rememberCartTrackingRoute(true);
    if(typeof window.setPanelVisualRole === 'function'){
      window.setPanelVisualRole('cart');
    }else{
      window.currentRole = 'cart';
      document.body.dataset.panelRole = 'cart';
      document.body.classList.add('cart-profile-mode');
    }
    if(typeof selectedArea !== 'undefined') selectedArea = 'Carrinhos de resíduo';
    if(typeof selectedClient !== 'undefined') selectedClient = 'Hospital Einstein';
    const view = ensureCartTrackingUi() || document.getElementById('cartTrackingView');
    if(!view) return;
    mountCartTrackingView(view);
    const title = document.querySelector('.brand .title');
    const subtitle = document.getElementById('pageSubtitle');
    if(!document.body.classList.contains('cart-tracking-open')){
      previousTitle = title?.textContent || previousTitle;
      previousSubtitle = subtitle?.textContent || previousSubtitle;
    }
    if(title) title.textContent = 'Monitoramento de C.R.';
    if(subtitle) subtitle.textContent = 'Carrinhos de resíduo';
    view.hidden = false;
    document.body.classList.add('cart-tracking-open');
    if(window.activePanelSession?.token){
      refreshCartConfigFromBackend().catch(error => {
        console.warn('Nao foi possivel atualizar configuracao C.R. do backend.', error);
        renderRooms();
      });
    }else{
      renderRooms();
    }
    startReadingsPolling();
  }

  function closeCartTrackingView(){
    rememberCartTrackingRoute(false);
    const view = document.getElementById('cartTrackingView');
    const title = document.querySelector('.brand .title');
    const subtitle = document.getElementById('pageSubtitle');
    if(title && previousTitle) title.textContent = previousTitle;
    if(subtitle && previousSubtitle) subtitle.textContent = previousSubtitle;
    if(view) view.hidden = true;
    document.body.classList.remove('cart-tracking-open');
    if(window.activePanelSession?.role === 'master' && String(document.body.dataset.panelRole || window.currentRole || '').toLowerCase() === 'cart'){
      if(typeof window.setPanelVisualRole === 'function'){
        window.setPanelVisualRole('master');
      }else{
        window.currentRole = 'master';
        document.body.dataset.panelRole = 'master';
        document.body.classList.remove('cart-profile-mode');
      }
    }
    stopReadingsPolling();
    hideCartAlertsOutsideContext();
  }

  document.addEventListener('click', event => {
    const panelUsersButton = event.target.closest('#openPanelUsersModal');
    if(panelUsersButton){
      event.preventDefault();
      event.stopPropagation();
      openPanelUsersManager();
      return;
    }

    const alertsButton = event.target.closest('[data-cart-alerts-modal]');
    if(alertsButton){
      event.preventDefault();
      event.stopPropagation();
      if(typeof window.openCartAlertInbox === 'function') window.openCartAlertInbox();
    }
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ensureCartTrackingUi);
  }else{
    ensureCartTrackingUi();
  }

  window.openCartTrackingView = openCartTrackingView;
  window.closeCartTrackingView = closeCartTrackingView;
  window.openCartAlertInbox = openCartAlertInbox;

  function bootstrapCartTrackingAfterModuleReady(){
    const session = window.activePanelSession || {};
    const role = String(document.body?.dataset?.panelRole || window.currentRole || session.role || '').toLowerCase();
    const loginNode = document.getElementById('loginShell');
    const loginVisible = loginNode && loginNode.hidden !== true;
    const shouldOpenCartView = document.body.classList.contains('auth-ready') &&
      !document.body.classList.contains('auth-pending') &&
      !loginVisible &&
      (window.__pendingCartTrackingOpen === true || role === 'cart');

    if(shouldOpenCartView){
      window.setTimeout(() => openCartTrackingView({ profileMode:true }), 0);
      return;
    }
    if(
      window.activePanelSession?.token &&
      document.body.classList.contains('cart-tracking-open') &&
      document.getElementById('cartTrackingView')?.hidden !== true
    ){
      refreshCartConfigFromBackend().catch(error => {
        console.warn('Nao foi possivel sincronizar configuracao C.R. apos iniciar o modulo.', error);
      });
    }
  }

  bootstrapCartTrackingAfterModuleReady();
})();

/* ===== SCRIPT BLOCK 46 | cart-alert-stability-guard ===== */
(function(){
  const STORAGE_KEY = 'idsensor.cartTracking.v9';
  const LAST_POPUP_KEY = 'idsensor.cartAlert.lastPopupId';
  const LAST_SOUND_KEY = 'idsensor.cartAlert.lastSoundId';
  const STABLE_OVERLAY_ID = 'cartAlertStableOverlay';
  const STABLE_CONTENT_ID = 'cartAlertStableContent';
  const STABLE_CLOSE_ID = 'cartAlertStableCloseBtn';
  const ALERT_TICKER_ID = 'cartAlertTicker';
  const ALERT_POLL_MS = 2500;
  const ALERT_TICKER_ROTATE_MS = 5200;
  const ALERT_TYPES = [
    {
      id:'critical',
      label:'Carrinho crítico',
      detail:'Avisar quando o carrinho atingir o limite crítico.'
    },
    {
      id:'recurrence',
      label:'Recorrência crítica',
      detail:'Repetir aviso enquanto o carrinho continuar crítico.'
    },
  ];
  let audioContext = null;
  let lastAlertSignature = '';
  let stableAlertTickerIndex = 0;
  let stableAlertTickerSignature = '';

  function escapeStableAlertHtml(value){
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function readStableAlertState(){
    try{
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    }catch(error){
      console.warn('Não foi possível ler o estado dos alertas.', error);
      return {};
    }
  }

  function mergeStableAlertState(state){
    const current = readStableAlertState();
    const incoming = state && typeof state === 'object' ? state : {};
    const merged = { ...current, ...incoming };
    ['rooms', 'carts', 'telemetryEvents', 'backendChartSamples', 'alerts'].forEach(key => {
      if(!Array.isArray(incoming[key]) && Array.isArray(current[key])){
        merged[key] = current[key];
      }
    });
    if(!incoming.alertSettings && current.alertSettings){
      merged.alertSettings = current.alertSettings;
    }
    return merged;
  }

  function saveStableAlertState(state){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergeStableAlertState(state)));
    }catch(error){
      console.warn('Não foi possível salvar o estado dos alertas.', error);
    }
  }

  function defaultAlertTypes(){
    return ALERT_TYPES.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});
  }

  function normalizeStableAlertSettings(settings = {}){
    const enabledTypes = Object.assign(defaultAlertTypes(), settings.enabledTypes || {});
    return {
      popupEnabled: settings.popupEnabled !== false,
      soundEnabled: settings.soundEnabled !== false,
      recurrenceMinutes: Number.isFinite(Number(settings.recurrenceMinutes))
        ? Number(settings.recurrenceMinutes)
        : 30,
      enabledTypes
    };
  }

  function isEinsteinCartAlertContext(){
    if(typeof window.isEinsteinCartAlertContext === 'function'){
      return window.isEinsteinCartAlertContext();
    }
    const body = document.body;
    const loginShell = document.getElementById('loginShell');
    const loginVisible = Boolean(loginShell && loginShell.hidden !== true);
    const ready = Boolean(
      body?.classList.contains('auth-ready') &&
      !body.classList.contains('auth-pending') &&
      !loginVisible
    );
    if(!ready) return false;

    const cartView = document.getElementById('cartTrackingView');
    const cartOpen = Boolean(body?.classList.contains('cart-tracking-open') && cartView && cartView.hidden !== true);
    if(!cartOpen) return false;

    const title = (document.querySelector('.brand .title')?.textContent || '').toLowerCase();
    const subtitle = (document.getElementById('pageSubtitle')?.textContent || '').toLowerCase();
    const currentUser = (document.getElementById('currentUserLabel')?.textContent || '').toLowerCase();
    const selectedClientText = (typeof selectedClient !== 'undefined' ? String(selectedClient || '') : '').toLowerCase();
    const session = window.activePanelSession || {};
    const authRole = String(body?.dataset?.authRole || session.role || '').toLowerCase();
    const panelRole = String(body?.dataset?.panelRole || window.currentRole || '').toLowerCase();
    const cartPanelText = `${title} ${subtitle}`;
    const userText = `${currentUser} ${selectedClientText} ${session.displayName || ''} ${session.display_name || ''} ${session.organization || ''} ${session.clienteNome || ''}`.toLowerCase();
    const isCartPanel = cartPanelText.includes('c.r') || cartPanelText.includes('carrinho') || cartPanelText.includes('residuo') || cartPanelText.includes('resíduo');
    const isEinstein = userText.includes('einstein') || subtitle.includes('einstein');
    return Boolean((authRole === 'cart' || authRole === 'master') && panelRole === 'cart' && isCartPanel && isEinstein);
  }

  function hideStableAlertsOutsideContext(){
    if(isEinsteinCartAlertContext()) return false;
    if(typeof window.hideCartAlertsOutsideContext === 'function'){
      window.hideCartAlertsOutsideContext();
    }
    const overlay = document.getElementById(STABLE_OVERLAY_ID);
    if(overlay && !overlay.hidden){
      overlay.hidden = true;
      overlay.dataset.alertId = '';
    }
    document.querySelectorAll('[data-cart-alerts-modal] b').forEach(badge => badge.remove());
    clearStableAlertTicker();
    return true;
  }

  function stableAlertTimestamp(alert){
    const time = new Date(alert?.ts || alert?.createdAt || 0).getTime();
    return Number.isFinite(time) ? time : 0;
  }

  function stableAlertKey(alert){
    return String(alert?.id || `${alert?.type || 'alert'}-${alert?.cartName || ''}-${alert?.roomName || alert?.roomId || ''}-${alert?.ts || ''}-${alert?.title || ''}`);
  }

  function sortedStableAlerts(state = readStableAlertState()){
    const alerts = Array.isArray(state.alerts) ? state.alerts : [];
    return alerts
      .map(alert => Object.assign({}, alert, { _stableKey: stableAlertKey(alert) }))
      .sort((a, b) => stableAlertTimestamp(b) - stableAlertTimestamp(a));
  }

  function isUnreadStableAlert(alert){
    return Boolean(alert) && !alert.acknowledgedAt && alert.read !== true;
  }

  function unreadStableAlertCount(state = readStableAlertState()){
    return sortedStableAlerts(state).filter(isUnreadStableAlert).length;
  }

  function formatStableAlertTime(value){
    const date = new Date(value || Date.now());
    if(Number.isNaN(date.getTime())) return 'agora';
    return date.toLocaleString('pt-BR', {
      day:'2-digit',
      month:'2-digit',
      hour:'2-digit',
      minute:'2-digit'
    });
  }

  function stableAlertTypeLabel(type){
    if(type === 'exchange') return 'Troca registrada';
    if(type === 'obstruction') return 'Obstrução provável';
    if(type === 'sensor') return 'Fora da calibração';
    if(type === 'recurrence') return 'Recorrência crítica';
    return 'Crítico';
  }

  function stableAlertIcon(type){
    if(typeof getOperationalTelemetryIcon === 'function'){
      if(type === 'exchange') return getOperationalTelemetryIcon('limit');
      if(type === 'obstruction' || type === 'sensor') return getOperationalTelemetryIcon('attention');
      return getOperationalTelemetryIcon('critical');
    }
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.7v5.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.2" r="1.1" fill="currentColor"/></svg>';
  }

  function stableMailboxIcon(){
    if(typeof getAlertMailboxIcon === 'function') return getAlertMailboxIcon();
    return '<svg viewBox="0 0 96 96" fill="none" aria-hidden="true"><path d="M34 22h45c4.4 0 8 3.6 8 8v37c0 4.4-3.6 8-8 8H37" stroke="#2f80ff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 27 60 48 84 27M61 49 85 73" stroke="#2f80ff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 41c-9 0-16 7.1-16 16v10.5c0 3-.9 5.8-2.7 8.2L10 79h45l-2.2-3.3a14.9 14.9 0 0 1-2.8-8.2V57c0-8.9-7.1-16-16-16h-3Z" fill="#eaf3ff" stroke="#2f80ff" stroke-width="6" stroke-linejoin="round"/><path d="M25 85c3.2 5 10.8 5 14 0M18 91c7 5 21 5 28 0" stroke="#2f80ff" stroke-width="6" stroke-linecap="round"/></svg>';
  }

  function stableAlertTone(type){
    if(type === 'exchange') return 'exchange';
    if(type === 'obstruction' || type === 'sensor') return 'obstruction';
    if(type === 'recurrence') return 'recurrence';
    return 'critical';
  }

  function stableAlertRoom(alert){
    return alert?.roomName || alert?.roomId || 'Sala';
  }

  function stableAlertCart(alert){
    return alert?.cartName || 'Carrinho';
  }

  function stableAlertText(alert){
    return alert?.message || alert?.detail || `${stableAlertRoom(alert)} - ${stableAlertCart(alert)}`;
  }

  function clearStableAlertTicker(){
    const ticker = document.getElementById(ALERT_TICKER_ID);
    if(!ticker) return;
    ticker.hidden = true;
    ticker.dataset.alertId = '';
    ticker.className = 'cart-alert-ticker';
    ticker.innerHTML = '';
  }

  function stableTickerAlerts(state = readStableAlertState()){
    const settings = normalizeStableAlertSettings(state.alertSettings);
    if(!settings.popupEnabled) return [];
    return sortedStableAlerts(state)
      .filter(alert => (
        isUnreadStableAlert(alert) &&
        settings.enabledTypes[alert.type || 'critical'] !== false
      ))
      .slice(0, 8);
  }

  function stableTickerTitle(alert){
    const room = stableAlertRoom(alert);
    const title = alert?.title || stableAlertTypeLabel(alert?.type);
    return String(title)
      .replace(/\s+/g, ' ')
      .replace(new RegExp(`\\s*${escapeStableAlertRegExp(room)}:.*`, 'i'), '')
      .trim();
  }

  function escapeStableAlertRegExp(value){
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function stableTickerSubtitle(alert){
    const room = stableAlertRoom(alert);
    const detail = stableAlertText(alert)
      .replace(/\s+/g, ' ')
      .replace(new RegExp(`^${escapeStableAlertRegExp(room)}:?\\s*`, 'i'), '')
      .trim();
    if(detail && detail.length <= 72) return detail;
    return room;
  }

  function renderStableAlertTicker(alerts){
    const ticker = document.getElementById(ALERT_TICKER_ID);
    if(!ticker) return;
    if(!isEinsteinCartAlertContext() || !alerts.length){
      clearStableAlertTicker();
      return;
    }
    const signature = alerts.map(stableAlertKey).join('|');
    if(signature !== stableAlertTickerSignature){
      stableAlertTickerSignature = signature;
      stableAlertTickerIndex = 0;
    }
    if(stableAlertTickerIndex >= alerts.length) stableAlertTickerIndex = 0;
    const alert = alerts[stableAlertTickerIndex] || alerts[0];
    const alertId = stableAlertKey(alert);
    const tone = stableAlertTone(alert.type);
    ticker.hidden = false;
    ticker.dataset.alertId = alertId;
    ticker.className = `cart-alert-ticker ${tone}`;
    ticker.innerHTML = `
      <span class="cart-alert-ticker-dot" aria-hidden="true"></span>
      <span class="cart-alert-ticker-copy">
        <strong>${escapeStableAlertHtml(stableTickerTitle(alert))}</strong>
        <small>${escapeStableAlertHtml(stableTickerSubtitle(alert))}</small>
      </span>
    `;
  }

  function rotateStableAlertTicker(){
    if(!isEinsteinCartAlertContext()){
      clearStableAlertTicker();
      return;
    }
    const alerts = stableTickerAlerts();
    if(alerts.length > 1) stableAlertTickerIndex = (stableAlertTickerIndex + 1) % alerts.length;
    renderStableAlertTicker(alerts);
  }

  function renderStableAlertRows(alerts, emptyText, groupTitle){
    if(!alerts.length){
      return `
        <div class="cart-alert-empty compact">
          <span class="cart-alert-mail-icon">${stableMailboxIcon()}</span>
          <strong>${emptyText}</strong>
          <small>Novos avisos aparecer&atilde;o aqui automaticamente.</small>
        </div>
      `;
    }

    return `
      <details class="cart-alert-group">
        <summary>
          <span>
            <strong>${escapeStableAlertHtml(groupTitle || 'Mensagens')}</strong>
            <small>Clique para ver todos os alertas deste grupo.</small>
          </span>
          <b>${alerts.length}</b>
        </summary>
        <div class="cart-alert-message-list">
        ${alerts.map(alert => `
          <article class="cart-alert-message-row ${stableAlertTone(alert.type)} ${isUnreadStableAlert(alert) ? 'new' : 'read'}">
            <i aria-hidden="true"></i>
            <span>
              <strong>${escapeStableAlertHtml(alert.title || stableAlertTypeLabel(alert.type))}</strong>
              <small>${escapeStableAlertHtml(stableAlertRoom(alert))} &middot; ${escapeStableAlertHtml(stableAlertCart(alert))} &middot; ${escapeStableAlertHtml(formatStableAlertTime(alert.ts || alert.createdAt))}</small>
              <em>${escapeStableAlertHtml(stableAlertText(alert))}</em>
            </span>
          </article>
        `).join('')}
        </div>
      </details>
    `;
  }

  function renderStableAlertInbox(mode = 'unread'){
    const allAlerts = sortedStableAlerts();
    const unreadAlerts = allAlerts.filter(isUnreadStableAlert);
    const isHistory = mode === 'history';
    const recentAlerts = allAlerts.slice(0, 10);
    const historyAlerts = allAlerts.slice(10, 80);
    const alerts = isHistory ? historyAlerts : recentAlerts;
    const groupTitle = isHistory ? 'Historico de alertas' : 'Ultimos 10 alertas';
    return `
      <header class="cart-alert-history-head">
        <span>Alertas</span>
        <h2>${isHistory ? 'Histórico de alertas' : 'Caixa de alertas'}</h2>
        <p>${isHistory ? 'Alertas anteriores aos 10 mais recentes.' : `${recentAlerts.length} alerta${recentAlerts.length === 1 ? '' : 's'} recente${recentAlerts.length === 1 ? '' : 's'}.`}</p>
      </header>
      ${renderStableAlertNav(isHistory ? 'history' : 'unread')}
      ${renderStableAlertRows(alerts, isHistory ? 'Sem histórico por enquanto.' : 'Sem alertas recentes.', groupTitle)}
    `;
  }

  function disableLegacyAlertOverlays(){
    document.querySelectorAll('#cartAlertModalOverlay').forEach(overlay => {
      overlay.hidden = true;
      overlay.dataset.mode = 'legacy-disabled';
      const content = overlay.querySelector('#cartAlertModalContent');
      if(content) content.innerHTML = '';
    });
  }

  function ensureStableAlertModal(){
    disableLegacyAlertOverlays();
    let overlay = document.getElementById(STABLE_OVERLAY_ID);
    if(!overlay){
      overlay = document.createElement('div');
      overlay.className = 'cart-alert-modal-overlay';
      overlay.id = STABLE_OVERLAY_ID;
      overlay.hidden = true;
      overlay.innerHTML = `
        <div class="cart-alert-modal">
          <button type="button" class="cart-detail-close" id="${STABLE_CLOSE_ID}" aria-label="Fechar">x</button>
          <div id="${STABLE_CONTENT_ID}"></div>
        </div>
      `;
    }
    if(overlay.parentElement !== document.body){
      document.body.appendChild(overlay);
    }
    let content = document.getElementById(STABLE_CONTENT_ID);
    if(!content){
      content = document.createElement('div');
      content.id = STABLE_CONTENT_ID;
      overlay.querySelector('.cart-alert-modal')?.appendChild(content);
    }
    if(!document.getElementById(STABLE_CLOSE_ID)){
      const closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.className = 'cart-detail-close';
      closeButton.id = STABLE_CLOSE_ID;
      closeButton.setAttribute('aria-label', 'Fechar');
      closeButton.textContent = 'x';
      overlay.querySelector('.cart-alert-modal')?.prepend(closeButton);
    }
    return { overlay, content };
  }

  function renderStableAlertNav(active){
    const state = readStableAlertState();
    const unread = unreadStableAlertCount(state);
    const total = sortedStableAlerts(state).length;
    const settings = normalizeStableAlertSettings(state.alertSettings);
    return `
      <div class="cart-alert-drill-actions">
        <button type="button" class="${active === 'unread' ? 'active' : ''}" data-cart-alert-stable-view="unread">
          <span>Novos</span>
          <b>${unread}</b>
        </button>
        <button type="button" class="${active === 'history' ? 'active' : ''}" data-cart-alert-stable-view="history">
          <span>Histórico</span>
          <b>${total}</b>
        </button>
        <button type="button" class="${active === 'settings' ? 'active' : ''}" data-cart-alert-stable-view="settings">
          <span>Configura&ccedil;&otilde;es</span>
          <small>${settings.popupEnabled ? 'Ativo' : 'Silenciado'}</small>
        </button>
      </div>
    `;
  }

  function renderStableAlertInboxLegacyUnused(mode = 'unread'){
    const allAlerts = sortedStableAlerts();
    const unreadAlerts = allAlerts.filter(isUnreadStableAlert);
    const isHistory = mode === 'history';
    const alerts = (isHistory ? allAlerts : unreadAlerts).slice(0, 40);
    return `
      <header class="cart-alert-history-head">
        <span>Alertas</span>
        <h2>${isHistory ? 'Histórico de alertas' : 'Caixa de alertas'}</h2>
        <p>${isHistory ? 'Registro dos avisos gerados pelo painel.' : `${unreadAlerts.length} alerta${unreadAlerts.length === 1 ? '' : 's'} sem leitura.`}</p>
      </header>
      ${renderStableAlertNav(isHistory ? 'history' : 'unread')}
      ${renderStableAlertRows(alerts, isHistory ? 'Sem histórico por enquanto.' : 'Sem alertas recentes.')}
    `;
    return `
      <header class="cart-alert-history-head">
        <span>Alertas</span>
        <h2>${isHistory ? 'Histórico de alertas' : 'Caixa de alertas'}</h2>
        <p>${isHistory ? 'Registro dos avisos gerados pelo painel.' : `${unreadAlerts.length} alerta${unreadAlerts.length === 1 ? '' : 's'} sem leitura.`}</p>
      </header>
      ${renderStableAlertNav(isHistory ? 'history' : 'unread')}
      ${alerts.length ? `
        <div class="cart-alert-history-list">
          ${alerts.map(alert => `
            <article class="cart-alert-history-item ${alert.type || 'critical'} ${isUnreadStableAlert(alert) ? 'new' : 'read'}">
              <i>${stableAlertIcon(alert.type)}</i>
              <span>
                <strong>${escapeStableAlertHtml(alert.title || stableAlertTypeLabel(alert.type))}</strong>
                <small>${escapeStableAlertHtml(alert.message || alert.detail || `${alert.roomName || 'Sala'} - ${alert.cartName || 'carrinho'}`)}</small>
              </span>
              <time>${escapeStableAlertHtml(formatStableAlertTime(alert.ts || alert.createdAt))}</time>
            </article>
          `).join('')}
        </div>
      ` : `
        <div class="cart-alert-empty">
          <span class="cart-alert-mail-icon">${stableMailboxIcon()}</span>
          <strong>Sem alertas por enquanto.</strong>
          <small>Alertas críticos, obstruções e trocas aparecerão nesta lista.</small>
        </div>
      `}
    `;
  }

  function renderStableAlertSettings(){
    const state = readStableAlertState();
    const settings = normalizeStableAlertSettings(state.alertSettings);
    const recurrenceOptions = [0, 10, 20, 30, 45, 60];
    return `
      <header class="cart-alert-history-head">
        <span>Alertas</span>
        <h2>Configurações de alertas</h2>
        <p>Defina quais avisos aparecem no painel e quando eles voltam a alertar.</p>
      </header>
      ${renderStableAlertNav('settings')}
      <div class="cart-alert-settings-panel">
        <label class="cart-alert-toggle-row">
          <span>
            <strong>Mensagem no card</strong>
            <small>Mostra um alerta resumido no card superior.</small>
          </span>
          <input type="checkbox" name="stable-cart-alert-popup" ${settings.popupEnabled ? 'checked' : ''}>
        </label>
        <label class="cart-alert-toggle-row">
          <span>
            <strong>Som do alerta</strong>
            <small>Toca uma vez quando uma mensagem nova chega.</small>
          </span>
          <input type="checkbox" name="stable-cart-alert-sound" ${settings.soundEnabled ? 'checked' : ''}>
        </label>
        <label class="cart-alert-setting-row">
          <span>
            <strong>Recorrência</strong>
            <small>Repetir alerta crítico depois de:</small>
          </span>
          <select name="stable-cart-alert-recurrence">
            ${recurrenceOptions.map(minutes => `
              <option value="${minutes}" ${Number(settings.recurrenceMinutes) === minutes ? 'selected' : ''}>
                ${minutes === 0 ? 'Sem recorrência' : `${minutes} min`}
              </option>
            `).join('')}
          </select>
        </label>
        <div class="cart-alert-check-list">
          ${ALERT_TYPES.map(option => `
            <label>
              <input type="checkbox" data-stable-cart-alert-type="${escapeStableAlertHtml(option.id)}" ${settings.enabledTypes[option.id] !== false ? 'checked' : ''}>
              <span>
                <strong>${escapeStableAlertHtml(option.label)}</strong>
                <small>${escapeStableAlertHtml(option.detail)}</small>
              </span>
            </label>
          `).join('')}
        </div>
        <button type="button" class="cart-alert-save-btn" data-stable-cart-alert-save>Salvar configura&ccedil;&otilde;es</button>
      </div>
    `;
  }

  function renderStableAlertPopup(alert){
    if(!alert){
      return `
        <div class="cart-alert-empty">
          <span class="cart-alert-mail-icon">${stableMailboxIcon()}</span>
          <strong>Nenhum alerta novo.</strong>
          <small>Os próximos alertas aparecerão aqui automaticamente.</small>
        </div>
      `;
    }
    return `
      <article class="cart-alert-popup-card ${alert.type || 'critical'}">
        <span class="cart-alert-eyebrow">Alerta do painel</span>
        <h2>${escapeStableAlertHtml(alert.title || stableAlertTypeLabel(alert.type))}</h2>
        <p>${escapeStableAlertHtml(alert.message || alert.detail || '')}</p>
        <div class="cart-alert-popup-grid">
          <span><small>Sala</small><strong>${escapeStableAlertHtml(alert.roomName || alert.roomId || 'Sala')}</strong></span>
          <span><small>Carrinho</small><strong>${escapeStableAlertHtml(alert.cartName || 'Carrinho')}</strong></span>
          <span><small>Hor&aacute;rio</small><strong>${escapeStableAlertHtml(formatStableAlertTime(alert.ts || alert.createdAt))}</strong></span>
          <span><small>Tipo</small><strong>${escapeStableAlertHtml(stableAlertTypeLabel(alert.type))}</strong></span>
        </div>
        ${alert.detail ? `<small class="cart-alert-detail">${escapeStableAlertHtml(alert.detail)}</small>` : ''}
      </article>
    `;
  }

  function openStableAlertInbox(){
    if(!isEinsteinCartAlertContext()) return hideStableAlertsOutsideContext();
    const { overlay, content } = ensureStableAlertModal();
    overlay.dataset.mode = 'history';
    overlay.dataset.alertId = '';
    content.innerHTML = renderStableAlertInbox('unread');
    overlay.hidden = false;
    updateStableAlertBadges();
  }

  function openStableAlertHistory(){
    if(!isEinsteinCartAlertContext()) return hideStableAlertsOutsideContext();
    const { overlay, content } = ensureStableAlertModal();
    overlay.dataset.mode = 'history';
    overlay.dataset.alertId = '';
    content.innerHTML = renderStableAlertInbox('history');
    overlay.hidden = false;
    updateStableAlertBadges();
  }

  function openStableAlertSettings(){
    if(!isEinsteinCartAlertContext()) return hideStableAlertsOutsideContext();
    const { overlay, content } = ensureStableAlertModal();
    overlay.dataset.mode = 'history';
    overlay.dataset.alertId = '';
    content.innerHTML = renderStableAlertSettings();
    overlay.hidden = false;
    updateStableAlertBadges();
  }

  function openStableAlertPopup(alert, playSound){
    if(!isEinsteinCartAlertContext()) return hideStableAlertsOutsideContext();
    const { overlay, content } = ensureStableAlertModal();
    overlay.dataset.mode = 'popup';
    overlay.dataset.alertId = stableAlertKey(alert);
    content.innerHTML = renderStableAlertPopup(alert);
    overlay.hidden = false;
    if(playSound) playStableAlertSoundOnce(stableAlertKey(alert));
    updateStableAlertBadges();
  }

  function closeStableAlertModal(){
    const overlay = document.getElementById(STABLE_OVERLAY_ID);
    disableLegacyAlertOverlays();
    if(!overlay) return;
    const alertId = overlay.dataset.alertId || '';
    const isPopup = overlay.dataset.mode === 'popup';
    overlay.hidden = true;
    if(isPopup && alertId){
      markStableAlertRead(alertId);
    }
    updateStableAlertBadges();
  }

  function markStableAlertRead(alertId){
    const state = readStableAlertState();
    let changed = false;
    const now = new Date().toISOString();
    (state.alerts || []).forEach(alert => {
      if(stableAlertKey(alert) === alertId && isUnreadStableAlert(alert)){
        alert.acknowledgedAt = now;
        alert.read = true;
        changed = true;
      }
    });
    if(changed) saveStableAlertState(state);
  }

  async function saveStableAlertSettings(){
    const content = document.getElementById(STABLE_CONTENT_ID);
    if(!content) return;
    const state = readStableAlertState();
    const current = normalizeStableAlertSettings(state.alertSettings);
    const enabledTypes = {};
    ALERT_TYPES.forEach(option => {
      const input = content.querySelector(`[data-stable-cart-alert-type="${option.id}"]`);
      enabledTypes[option.id] = input ? input.checked : current.enabledTypes[option.id] !== false;
    });
    const nextSettings = normalizeStableAlertSettings({
      popupEnabled: content.querySelector('[name="stable-cart-alert-popup"]')?.checked !== false,
      soundEnabled: content.querySelector('[name="stable-cart-alert-sound"]')?.checked !== false,
      recurrenceMinutes: Number(content.querySelector('[name="stable-cart-alert-recurrence"]')?.value || current.recurrenceMinutes),
      enabledTypes
    });
    state.alertSettings = nextSettings;
    saveStableAlertState(state);
    openStableAlertSettings();
    if(typeof window.saveCartAlertSettingsToBackend !== 'function') return;
    try{
      const savedSettings = await window.saveCartAlertSettingsToBackend(nextSettings);
      if(savedSettings){
        const latestState = readStableAlertState();
        latestState.alertSettings = normalizeStableAlertSettings(savedSettings);
        saveStableAlertState(latestState);
        openStableAlertSettings();
      }
    }catch(error){
      console.warn('Nao foi possivel salvar as configuracoes de alerta no backend.', error);
      alert('Nao foi possivel salvar as configuracoes no servidor. Tente novamente antes de entregar o login.');
    }
  }

  function updateStableAlertBadges(){
    if(!isEinsteinCartAlertContext()){
      hideStableAlertsOutsideContext();
      return;
    }
    const state = readStableAlertState();
    const tickerAlerts = stableTickerAlerts(state);
    const unread = unreadStableAlertCount();
    document.querySelectorAll('[data-cart-alerts-modal]').forEach(button => {
      let badge = button.querySelector('b');
      if(unread > 0){
        if(!badge){
          badge = document.createElement('b');
          button.appendChild(badge);
        }
        badge.textContent = unread > 99 ? '99+' : String(unread);
      }else if(badge){
        badge.remove();
      }
    });
    renderStableAlertTicker(tickerAlerts);
  }

  function unlockStableAlertAudio(){
    try{
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if(!AudioContextClass) return;
      if(!audioContext) audioContext = new AudioContextClass();
      if(audioContext.state === 'suspended') audioContext.resume?.();
    }catch(error){
      console.warn('Não foi possível preparar o som de alerta.', error);
    }
  }

  function playStableAlertSoundOnce(alertId){
    if(!isEinsteinCartAlertContext()) return;
    const state = readStableAlertState();
    const settings = normalizeStableAlertSettings(state.alertSettings);
    if(!settings.soundEnabled) return;
    if(sessionStorage.getItem(LAST_SOUND_KEY) === alertId) return;
    try{
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if(!AudioContextClass) return;
      if(!audioContext) audioContext = new AudioContextClass();
      if(audioContext.state === 'suspended') audioContext.resume?.();
      const start = audioContext.currentTime + 0.01;
      const gain = audioContext.createGain();
      const first = audioContext.createOscillator();
      const second = audioContext.createOscillator();
      first.type = 'sine';
      second.type = 'triangle';
      first.frequency.setValueAtTime(880, start);
      first.frequency.setValueAtTime(660, start + 0.12);
      second.frequency.setValueAtTime(1320, start);
      second.frequency.setValueAtTime(990, start + 0.12);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.1, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
      first.connect(gain);
      second.connect(gain);
      gain.connect(audioContext.destination);
      first.start(start);
      second.start(start);
      first.stop(start + 0.42);
      second.stop(start + 0.42);
      sessionStorage.setItem(LAST_SOUND_KEY, alertId);
    }catch(error){
      console.warn('Som de alerta bloqueado pelo navegador.', error);
    }
  }

  function maybeOpenStableNewAlert(){
    if(!isEinsteinCartAlertContext()){
      hideStableAlertsOutsideContext();
      return;
    }
    const state = readStableAlertState();
    const settings = normalizeStableAlertSettings(state.alertSettings);
    const alerts = sortedStableAlerts(state);
    const signature = alerts.map(alert => `${stableAlertKey(alert)}:${alert.acknowledgedAt || alert.read || ''}`).join('|');
    if(signature !== lastAlertSignature){
      lastAlertSignature = signature;
      updateStableAlertBadges();
    }
    const nextAlert = alerts.find(alert => (
      isUnreadStableAlert(alert) &&
      settings.enabledTypes[alert.type || 'critical'] !== false
    ));
    if(!nextAlert) return;
    const alertId = stableAlertKey(nextAlert);
    if(sessionStorage.getItem(LAST_POPUP_KEY) === alertId) return;
    sessionStorage.setItem(LAST_POPUP_KEY, alertId);
    if(settings.soundEnabled){
      playStableAlertSoundOnce(alertId);
    }
  }

  document.addEventListener('click', event => {
    const tickerButton = event.target.closest('[data-cart-alert-ticker]');
    if(tickerButton){
      event.preventDefault();
      event.stopPropagation();
      if(typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      if(!isEinsteinCartAlertContext()){
        hideStableAlertsOutsideContext();
        return;
      }
      const alertId = tickerButton.dataset.alertId || '';
      const alert = sortedStableAlerts().find(item => stableAlertKey(item) === alertId) || sortedStableAlerts()[0] || null;
      if(alert) openStableAlertPopup(alert, false);
      return;
    }

    const alertButton = event.target.closest('[data-cart-alerts-modal]');
    if(alertButton){
      event.preventDefault();
      event.stopPropagation();
      if(typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      if(!isEinsteinCartAlertContext()){
        hideStableAlertsOutsideContext();
        return;
      }
      openStableAlertInbox();
      return;
    }

    if(event.target.closest(`#${STABLE_CLOSE_ID}`) || event.target.closest('#cartAlertModalCloseBtn')){
      event.preventDefault();
      event.stopPropagation();
      if(typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      closeStableAlertModal();
      return;
    }

    const viewButton = event.target.closest('[data-cart-alert-stable-view]');
    if(viewButton){
      event.preventDefault();
      event.stopPropagation();
      const view = viewButton.getAttribute('data-cart-alert-stable-view');
      if(view === 'settings'){
        openStableAlertSettings();
      }else if(view === 'history'){
        openStableAlertHistory();
      }else{
        openStableAlertInbox();
      }
      return;
    }

    if(event.target.closest('[data-stable-cart-alert-save]')){
      event.preventDefault();
      event.stopPropagation();
      saveStableAlertSettings();
    }
  }, true);

  document.addEventListener('pointerdown', unlockStableAlertAudio, { capture:true, once:true });
  document.addEventListener('keydown', unlockStableAlertAudio, { capture:true, once:true });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => {
      ensureStableAlertModal();
      updateStableAlertBadges();
      window.setTimeout(maybeOpenStableNewAlert, 800);
    });
  }else{
    ensureStableAlertModal();
    updateStableAlertBadges();
    window.setTimeout(maybeOpenStableNewAlert, 800);
  }

  window.setInterval(maybeOpenStableNewAlert, ALERT_POLL_MS);
  window.setInterval(rotateStableAlertTicker, ALERT_TICKER_ROTATE_MS);
  window.refreshStableCartAlertUi = function(){
    updateStableAlertBadges();
    maybeOpenStableNewAlert();
  };
  window.openStableCartAlertInbox = openStableAlertInbox;
  window.openStableCartAlertHistory = openStableAlertHistory;
  window.openStableCartAlertSettings = openStableAlertSettings;
  window.closeStableCartAlertModal = closeStableAlertModal;
  window.openStableCartAlertModal = function(alertId = '', options = {}){
    if(options.history) return openStableAlertInbox();
    const alert = sortedStableAlerts().find(item => stableAlertKey(item) === alertId) || sortedStableAlerts()[0] || null;
    return openStableAlertPopup(alert, Boolean(options.playSound));
  };
  window.openCartAlertInbox = openStableAlertInbox;
  window.openCartAlertModal = function(alertId = '', options = {}){
    if(options.history) return openStableAlertInbox();
    const alert = sortedStableAlerts().find(item => stableAlertKey(item) === alertId) || sortedStableAlerts()[0] || null;
    return openStableAlertPopup(alert, Boolean(options.playSound));
  };
})();


