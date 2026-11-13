// Client presentation only. No sensor provisioning, real telemetry, or outbound messages.
const crypto = require('node:crypto');
const catalog = [
  { mac:'DE:10:00:00:00:01', code:'DEMO-NOVO-01', manufacturer:'Minew', model:'MST01 Pt100 — demonstração', has_probe:true, image_profile:'mst01-pt100-aprovado', calibrated_on:'2026-11-01', expires_on:'2027-11-01' },
  { mac:'DE:10:00:00:00:02', code:'DEMO-NOVO-02', manufacturer:'Exemplo demonstrativo', model:'Dispositivo com cabo — demonstração', has_probe:true, image_profile:'white-probe', calibrated_on:'2026-11-02', expires_on:'2027-11-02' },
  { mac:'DE:10:00:00:00:03', code:'DEMO-NOVO-03', manufacturer:'Exemplo demonstrativo', model:'Dispositivo sem cabo — demonstração', has_probe:false, image_profile:'white', calibrated_on:'2026-11-03', expires_on:'2027-11-03' }
];
const grants=new Map();
function init(db){db.exec('CREATE TABLE IF NOT EXISTS qr_demo_replacements (device_id TEXT PRIMARY KEY, state_json TEXT NOT NULL)');}
function read(db,id){const row=db.prepare('SELECT state_json FROM qr_demo_replacements WHERE device_id = ?').get(id);if(!row)return null;try{return JSON.parse(row.state_json);}catch{return null;}}
function save(db,id,state){db.prepare('INSERT INTO qr_demo_replacements (device_id,state_json) VALUES (?,?) ON CONFLICT(device_id) DO UPDATE SET state_json = excluded.state_json').run(id,JSON.stringify(state));}
function scanned(value){let code=String(value||'').trim();try{code=decodeURIComponent(code);if(code.includes('://'))code=decodeURIComponent(new URL(code).pathname.split('/').filter(Boolean).pop()||'');}catch{return '';}return code.toUpperCase();}
function findSensor(code){code=scanned(code);return catalog.find(item=>item.mac===code||item.code===code)||null;}
function initialSensor(card){return {mac:'DE:00:00:00:'+String(Math.floor(Number(card.panelId||card.id||1)/256)).padStart(2,'0')+':'+Number(card.panelId||card.id||1).toString(16).padStart(2,'0').toUpperCase(),manufacturer:'Minew — exemplo',model:'MST01 — demonstração',has_probe:true,image_profile:'mst01-aprovado',calibrated_on:'2025-07-21',expires_on:'2026-07-31',example_certificate:true};}
function byMac(db,code){code=scanned(code);const row=db.prepare('SELECT device_id,state_json FROM qr_demo_replacements').all().find(row=>{try{return JSON.parse(row.state_json).sensor.mac===code;}catch{return false;}});if(row)return row.device_id;if(/^DE:00:00:00:[0-9A-F]{2}:[0-9A-F]{2}$/.test(code)){const number=parseInt(code.split(':').slice(-2).join(''),16);const equipment=db.prepare('SELECT id FROM dispositivos WHERE qr_code = ?').get('DEV-GELADEIRA-'+String(number).padStart(2,'0'));if(equipment&&!read(db,equipment.id))return equipment.id;}return null;}
function decorate(db,card){
  const id=card.backendId||card.id,state=read(db,id);
  if(!state){const sensor=initialSensor(card);return {...card,sensor,code:sensor.mac,qrCode:sensor.mac,demonstration:true,stabilizing:false};}
  const next={...card,sensor:state.sensor,demonstration:true,stabilizing:!!state.stabilizing,qrCode:state.sensor.mac,code:state.sensor.mac};
  if(state.finishedAt || !state.stabilizing){
    next.temp=state.finalTemperature ?? (Number(card.min)+Number(card.max))/2;next.tempLabel=next.temp.toFixed(1)+'°C';next.state='blue';next.status='NORMAL';next.online=card.online;next.chart=[next.temp];next.dailyMin=next.temp;next.dailyMax=next.temp;
  }
  if(state.stabilizing && card.online){
    // Fast, explicitly simulated cooling for the customer presentation. Exit by the configured range, not by a timeout.
    const seconds=Math.max(0,(Date.now()-Date.parse(state.startedAt))/1000),target=(Number(card.min)+Number(card.max))/2;
    const start=Number(card.max)+4,temperature=Math.max(target,start-seconds*.18);
    next.temp=Math.round(temperature*10)/10;next.tempLabel=next.temp.toFixed(1)+'°C';next.dailyMin=next.temp;next.dailyMax=start;next.chart=[start,next.temp];
    next.online=true;next.state='blue';next.status='EM ESTABILIZAÇÃO';next.timerLabel='Temperatura em estabilização — troca de dispositivo';next.events=['Troca de dispositivo — em estabilização'];
    if(next.visualContract)next.visualContract={...next.visualContract,shouldShowBell:false};
    state.maximumTemperature=Math.max(state.maximumTemperature||start,next.temp);
    if(next.temp>=card.min&&next.temp<=card.max){state.stabilizing=false;state.finishedAt=new Date().toISOString();state.finalTemperature=next.temp;state.justification='Troca de dispositivo — em estabilização';next.stabilizing=false;next.status='NORMAL';next.timerLabel='Dentro da faixa configurada';next.events=['Temperatura estabilizada após a troca'];}
    save(db,id,state);
  }
  return next;
}
function authorize(deviceId,key){if(String(key||'').trim().toUpperCase()!=='12345678')throw Object.assign(Error('Nesta demonstração, use a chave 12345678.'),{statusCode:401});const token=crypto.randomBytes(24).toString('base64url');for(const[t,v]of grants)if(v.until<Date.now())grants.delete(t);grants.set(token,{deviceId,until:Date.now()+1800000});return{token,expiresIn:1800};}
function check(deviceId,token){const grant=grants.get(token);if(!grant||grant.deviceId!==deviceId||grant.until<Date.now())throw Object.assign(Error('Acesso demonstrativo expirado. Digite 12345678 novamente.'),{statusCode:401});}
function identify(db,deviceId,token,value){check(deviceId,token);const found=findSensor(value);if(!found)throw Object.assign(Error('Use um dos QR Codes de exemplo da demonstração.'),{statusCode:404});const linked=byMac(db,found.mac);if(linked&&linked!==deviceId)throw Object.assign(Error('Este dispositivo de exemplo já está em uso. Reinicie a demonstração ou escolha outro.'),{statusCode:409});return found;}
function replace(db,deviceId,token,value,replaceProbe){const sensor=identify(db,deviceId,token,value);if(sensor.has_probe&&typeof replaceProbe!=='boolean')throw Object.assign(Error('Escolha se o cabo também será trocado.'),{statusCode:400});const state={sensor,stabilizing:sensor.has_probe&&replaceProbe===true,startedAt:new Date().toISOString(),replaceProbe:!!replaceProbe,finishedAt:null,justification:null};save(db,deviceId,state);grants.delete(token);return{sensor,stabilizing:state.stabilizing,nextCode:sensor.mac,demonstration:true};}
module.exports={catalog,init,read,save,scanned,findSensor,byMac,decorate,authorize,identify,replace};
