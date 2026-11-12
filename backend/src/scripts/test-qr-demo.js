const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../../..');
const directory=path.join(root,'.tmp','qr-demo-test-'+Date.now());fs.mkdirSync(directory,{recursive:true});
Object.assign(process.env,{DATABASE_URL:'',DATABASE_PATH:path.join(directory,'test.db'),AUTO_SEED_DEMO_DATA:'false',MQTT_BRIDGE_ENABLED:'false',EXPO_PUSH_ENABLED:'false',EMAIL_ENABLED:'false'});
test('QR demonstration: scan, read-only consultation, model, probe choice, stabilization, certificate and report',{timeout:90000},async()=>{
  const {initDb,getDb}=require('../db/database');initDb();require('../db/seed').seedDatabase();
  const demo=require('../services/qrDemo'),{app}=require('../app');
  const server=http.createServer(app);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port,endpoint='/api/qr/DEV-GELADEIRA-01';
  async function request(url,body,token){const response=await fetch(base+url,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});return{status:response.status,body:await response.json()};}
  let browser;
  try{
    const all=await request('/devices');assert.equal(all.body.data.length,24);
    const before=await request(endpoint);assert.equal(before.body.data.demonstration,true);assert.equal(before.body.data.card.name,'Geladeira 01');
    assert.equal((await request(endpoint+'/access',{key:'errada'})).status,401);
    assert.equal((await request(endpoint+'/replace',{scanned:'DEMO-NOVO-01',replaceProbe:true})).status,401);
    const access=(await request(endpoint+'/access',{key:'DEMO'})).body.data.token;
    assert.equal((await request(endpoint+'/identify',{scanned:'desconhecido'},access)).status,404);
    const identified=(await request(endpoint+'/identify',{scanned:base+'/q/DEMO-NOVO-01'},access)).body.data;assert.equal(identified.has_probe,true);assert.equal(identified.mac,demo.catalog[0].mac);
    assert.equal((await request(endpoint+'/replace',{scanned:'DEMO-NOVO-01'},access)).status,400);
    const replaced=await request(endpoint+'/replace',{scanned:'DEMO-NOVO-01',replaceProbe:true},access);assert.equal(replaced.status,200);assert.equal(replaced.body.data.stabilizing,true);
    assert.equal((await request(endpoint+'/replace',{scanned:'DEMO-NOVO-01',replaceProbe:true},access)).status,401);
    const code=encodeURIComponent(replaced.body.data.nextCode),warm=(await request('/api/qr/'+code)).body.data;
    assert.equal(warm.stabilizing,true);assert.equal(warm.card.name,before.body.data.card.name);assert.equal(warm.card.local,before.body.data.card.local);assert.equal(warm.card.status,'EM ESTABILIZAÇÃO');
    const newCertificate=await fetch(base+'/api/qr/'+code+'/certificate');assert.match(await newCertificate.text(),new RegExp(demo.catalog[0].mac));
    const source=fs.readFileSync(path.join(root,'painel-original/consulta/app.js'),'utf8'),markup=fs.readFileSync(path.join(root,'painel-original/consulta/index.html'),'utf8');assert(!source.includes('60 minutos'));assert(markup.includes('Os alertas de equipamento sem comunicação permanecerão ativos.'));
    const {chromium}=require('playwright');browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
    const page=await browser.newPage({viewport:{width:390,height:980}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
    const output=path.join(root,'output/qr-demo');fs.mkdirSync(output,{recursive:true});
    const svg=await(await fetch(base+'/api/qr/DEV-GELADEIRA-01/label.svg')).text();assert(svg.includes('MAC: '+demo.catalog[0].mac));
    await page.setContent('<body style="margin:0"><img width="900" height="900" src="data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64')+'">');await page.locator('img').evaluate(img=>img.decode());
    let read;const {PNG}=require('pngjs');
    for(const width of [225,270,315]){await page.locator('img').evaluate((img,width)=>{img.width=width;img.height=width;},width);const png=await page.locator('img').screenshot({path:path.join(output,'qrcode-validacao.png')});const pixels=PNG.sync.read(png);read=require('jsqr')(new Uint8ClampedArray(pixels.data),pixels.width,pixels.height);if(read)break;}
    assert.equal(read?.data,base+'/q/'+encodeURIComponent(demo.catalog[0].mac));
    const publicUrl='https://id-sensor-mvp.onrender.com/q/'+encodeURIComponent(demo.catalog[0].mac);
    const publicSvg=require('../services/qrLabel').renderLabel(publicUrl,demo.catalog[0].mac);
    await page.setContent('<body style="margin:0"><img src="data:image/svg+xml;base64,'+Buffer.from(publicSvg).toString('base64')+'">');await page.locator('img').evaluate(img=>img.decode());
    let publicRead;
    for(const width of [270,315,360,450]){await page.locator('img').evaluate((img,width)=>{img.style.width=width+'px';img.style.height='auto';},width);const png=await page.locator('img').screenshot({path:path.join(output,'etiqueta-publica.png')});const pixels=PNG.sync.read(png);publicRead=require('jsqr')(new Uint8ClampedArray(pixels.data),pixels.width,pixels.height);if(publicRead)break;}
    assert.equal(publicRead?.data,publicUrl,'A etiqueta deve abrir o endereço público com o MAC');

    const back=getDb().prepare('SELECT * FROM dispositivos WHERE id = ?').get(warm.card.backendId);assert.equal(back.temperatura_atual,before.body.data.card.temp,'A troca demonstrativa não altera a temperatura-base do painel');
    // The communication exception remains visible even while the demo reading is stabilizing.
    getDb().prepare("UPDATE dispositivos SET status = 'offline' WHERE id = ?").run(back.id);
    const offline=(await request('/api/qr/'+code)).body.data;assert.equal(offline.card.online,false);assert.equal(offline.stabilizing,true);
    getDb().prepare("UPDATE dispositivos SET status = 'normal' WHERE id = ?").run(back.id);
    const state=demo.read(getDb(),back.id);state.startedAt=new Date(Date.now()-60000).toISOString();demo.save(getDb(),back.id,state);
    const stable=(await request('/api/qr/'+code)).body.data;assert.equal(stable.stabilizing,false);assert(stable.card.temp>=stable.card.min&&stable.card.temp<=stable.card.max);
    const report=(await request('/api/qr/'+code+'/report')).body.data;assert(report.replacement.finishedAt);assert.match(report.replacement.justification,/Troca de dispositivo/);
    await request('/api/qr/'+code+'/reset',{key:'DEMO'});
    await page.goto(base+'/q/DEV-GELADEIRA-01');await page.locator('.page-content:not([hidden])').waitFor();assert.match(await page.locator('#qr-live-status').textContent(),/simulados/);
    await page.screenshot({path:path.join(output,'consulta-temperatura.png'),fullPage:true});
    await page.locator('#qr-nav-replace').click();await page.locator('#qr-access-key').fill('DEMO');await page.locator('#qr-key-form button').click();await page.locator('#qr-manual-code').fill('DEMO-NOVO-01');await page.locator('#qr-swap-scan form button').click();await page.locator('#qr-swap-probe:not([hidden])').waitFor();
    assert.equal(await page.locator('.device-identification dd').first().textContent(),demo.catalog[0].mac);
    await page.locator('[name="qr-probe-choice"][value="replace"]').check();await page.locator('#qr-probe-continue').click();await page.locator('#qr-confirm-swap').click();await page.locator('#qr-real-notice:not([hidden])').waitFor();
    await page.screenshot({path:path.join(output,'aviso-estabilizacao.png'),fullPage:true});
    await page.locator('#qr-real-commit').click();await page.locator('#qr-swap-success:not([hidden])').waitFor();await page.locator('#qr-nav-temperature').click();await page.locator('#qr-live-stabilization:not([hidden])').waitFor();
    await page.screenshot({path:path.join(output,'temperatura-estabilizacao.png'),fullPage:true});
    await request('/api/qr/'+code+'/reset',{key:'DEMO'});
    await page.goto(base+'/q/DEV-GELADEIRA-01');await page.locator('.page-content:not([hidden])').waitFor();await page.locator('#qr-nav-replace').click();await page.locator('#qr-access-key').fill('DEMO');await page.locator('#qr-key-form button').click();await page.locator('#qr-manual-code').fill('DEMO-NOVO-03');await page.locator('#qr-swap-scan form button').click();await page.locator('#qr-swap-confirm:not([hidden])').waitFor();assert.equal(await page.locator('#qr-swap-probe').isVisible(),false);
    for(const width of[320,390,736]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
    assert.deepEqual(errors,[]);fs.writeFileSync(path.join(output,'test-result.json'),JSON.stringify({passed:true,qrDecoded:true,publicData:'demonstration',physicalHardware:false,browserErrors:errors},null,2));
  }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));getDb().close();}
});
