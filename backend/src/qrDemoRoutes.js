const fs=require('node:fs'),path=require('node:path');
const demo=require('./services/qrDemo');
const {renderLabel}=require('./services/qrLabel');
function register({addRoute,getDb,getDeviceByScannedCode,getDeviceById,buildDeviceCard,ok,fail,html,requestPublicBase}){
  const deviceInfo=require('./deviceInfoRoutes').register({addRoute,getDb,getDeviceById,buildDeviceCard,ok,html});
  const token=req=>String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  function resolve(code){const db=getDb(),id=demo.byMac(db,code);const row=id?getDeviceById(id):getDeviceByScannedCode(demo.scanned(code));if(!row)throw Object.assign(Error('Equipamento de demonstração não encontrado.'),{statusCode:404});return row;}
  addRoute('GET','/q/:codigo',async({params,res})=>{const sensor=demo.findSensor(params.codigo);if(sensor&&!demo.byMac(getDb(),sensor.mac))return deviceInfo.renderPage(sensor.mac,res);const page=fs.readFileSync(path.resolve(__dirname,'../../painel-original/consulta/index.html'),'utf8').replace('/*QR_BOOT*/','window.IDSENSOR_QR_CODE='+JSON.stringify(demo.scanned(params.codigo)).replace(/</g,'\\u003c')+';');html(res,200,page);});
  addRoute('GET','/api/qr/:codigo',async({params,res})=>{const row=resolve(params.codigo),card=demo.decorate(getDb(),buildDeviceCard(row));ok(res,{card,sensor:card.sensor,stabilizing:card.stabilizing,demonstration:true,simulation:true});});
  addRoute('POST','/api/qr/:codigo/access',async({params,body,res})=>ok(res,demo.authorize(resolve(params.codigo).id,body.key)));
  addRoute('POST','/api/qr/:codigo/identify',async({params,body,req,res})=>ok(res,demo.identify(getDb(),resolve(params.codigo).id,token(req),body.scanned)));
  addRoute('POST','/api/qr/:codigo/replace',async({params,body,req,res})=>{const row=resolve(params.codigo);ok(res,{...demo.replace(getDb(),row.id,token(req),body.scanned,body.replaceProbe),equipmentName:row.nome});});
  addRoute('GET','/api/qr/:codigo/certificate',async({params,res})=>{resolve(params.codigo);require('./services/demoCertificate').send(res);});
  addRoute('GET','/api/qr/:codigo/label.svg',async({params,req,res})=>{const source=demo.scanned(params.codigo),candidate=demo.findSensor(source);const mac=candidate?candidate.mac:demo.decorate(getDb(),buildDeviceCard(resolve(source))).sensor.mac;const svg=renderLabel(requestPublicBase(req)+'/q/'+encodeURIComponent(mac),mac);res.writeHead(200,{'Content-Type':'image/svg+xml','Cache-Control':'no-store'});res.end(svg);});
  addRoute('GET','/api/qr-demo/catalog',async({res})=>ok(res,demo.catalog));
  addRoute('GET','/api/qr/:codigo/report',async({params,res})=>{const row=resolve(params.codigo);demo.decorate(getDb(),buildDeviceCard(row));ok(res,{demonstration:true,equipment:row.nome,replacement:demo.read(getDb(),row.id)});});
  addRoute('POST','/api/qr/:codigo/reset',async({params,body,res})=>{if(String(body.key||'').toUpperCase()!=='12345678')return fail(res,401,'Use a chave de demonstração.');getDb().prepare('DELETE FROM qr_demo_replacements WHERE device_id = ?').run(resolve(params.codigo).id);ok(res,{reset:true});});
}
module.exports={register};
