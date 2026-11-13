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
    const newInfo=(await request('/api/device-info/'+encodeURIComponent(demo.catalog[0].mac))).body.data;
    assert.equal(newInfo.previously_used,false);assert.equal(newInfo.history.length,0);assert.equal(newInfo.received_on,'2026-11-10');assert.deepEqual([newInfo.measurement.min,newInfo.measurement.max],[-200,200]);assert.equal(newInfo.model,'MST01 Pt100');assert.equal(newInfo.condition,'Novo');assert.equal(newInfo.image,'/consulta/assets/mst01-pt100-aprovado.webp');
    const usedInfo=(await request('/api/device-info/DE%3A00%3A00%3A00%3A00%3A01')).body.data;
    assert.equal(usedInfo.previously_used,true);assert.equal(usedInfo.history.length,1);assert.equal(usedInfo.current.equipment,'Geladeira 01');assert.equal(usedInfo.calibration.status,'expired');assert.equal(usedInfo.model,'S1');assert.equal(usedInfo.has_probe,false);assert.equal(usedInfo.condition,'Em uso');assert.deepEqual([usedInfo.measurement.min,usedInfo.measurement.max],[-20,60]);assert.equal(usedInfo.image,'/consulta/assets/s1-aprovado.webp');
    const historical=(await request('/api/device-info/DE%3A10%3A00%3A00%3A00%3A02')).body.data;assert.equal(historical.model,'MST01');assert.equal(historical.condition,'Disponível');assert.equal(historical.history.length,2);assert.equal(historical.current,null);assert.deepEqual([historical.measurement.min,historical.measurement.max],[-40,125]);
    assert.equal((await request('/api/device-info/AA%3ABB%3ACC%3ADD%3AEE%3AFF')).status,404);
    assert.match(await(await fetch(base+'/q/'+encodeURIComponent(demo.catalog[0].mac))).text(),/IDSENSOR_DEVICE_MAC/,'O QR do sensor sem vínculo abre a ficha');
    const pdf=fs.readFileSync(path.join(root,'painel-original/certificado-geladeira-1.pdf'));const infoPdf=await fetch(base+newInfo.calibration.certificate);assert.match(infoPdf.headers.get('content-type'),/application\/pdf/);assert(Buffer.from(await infoPdf.arrayBuffer()).equals(pdf));
    assert.equal((await request(endpoint+'/access',{key:'errada'})).status,401);
    assert.equal((await request(endpoint+'/access',{key:'DEMO'})).status,401,'A chave anterior deve ser rejeitada');
    assert.equal((await request(endpoint+'/replace',{scanned:'DEMO-NOVO-01',replaceProbe:true})).status,401);
    const access=(await request(endpoint+'/access',{key:'12345678'})).body.data.token;
    assert.equal((await request(endpoint+'/identify',{scanned:'desconhecido'},access)).status,404);
    const identified=(await request(endpoint+'/identify',{scanned:base+'/q/DEMO-NOVO-01'},access)).body.data;assert.equal(identified.has_probe,true);assert.equal(identified.mac,demo.catalog[0].mac);
    assert.equal((await request(endpoint+'/replace',{scanned:'DEMO-NOVO-01'},access)).status,400);
    const replaced=await request(endpoint+'/replace',{scanned:'DEMO-NOVO-01',replaceProbe:true},access);assert.equal(replaced.status,200);assert.equal(replaced.body.data.stabilizing,true);
    assert.equal((await request(endpoint+'/replace',{scanned:'DEMO-NOVO-01',replaceProbe:true},access)).status,401);
    const code=encodeURIComponent(replaced.body.data.nextCode),warm=(await request('/api/qr/'+code)).body.data;
    assert.equal(warm.stabilizing,true);assert.equal(warm.card.name,before.body.data.card.name);assert.equal(warm.card.local,before.body.data.card.local);assert.equal(warm.card.status,'EM ESTABILIZAÇÃO');
    const linkedInfo=(await request('/api/device-info/'+code)).body.data;assert.equal(linkedInfo.previously_used,true);assert.equal(linkedInfo.current.equipment,'Geladeira 01');
    const newCertificate=await fetch(base+'/api/qr/'+code+'/certificate');assert.match(newCertificate.headers.get('content-type'),/application\/pdf/);assert(Buffer.from(await newCertificate.arrayBuffer()).equals(pdf));const panelSnapshot=(await request('/devices')).body.data.find(c=>c.backendId===warm.card.backendId);assert.equal(panelSnapshot.temp,warm.card.temp);assert.equal(panelSnapshot.stabilizing,true);
    const source=fs.readFileSync(path.join(root,'painel-original/consulta/app.js'),'utf8'),markup=fs.readFileSync(path.join(root,'painel-original/consulta/index.html'),'utf8');assert(!source.includes('60 minutos'));assert(markup.includes('Os alertas de equipamento sem comunicação permanecerão ativos durante todo o processo.'));
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
    assert(!/<(?:image|mask|filter|clipPath)\b/.test(publicSvg),'A marca deve ser feita de pontos vetoriais sem sobreposição de imagem ou recorte');
    const labelMacs=[...Array.from({length:24},(_,i)=>'DE:00:00:00:00:'+(i+1).toString(16).padStart(2,'0').toUpperCase()),...demo.catalog.map(item=>item.mac)];
    for(const labelMac of labelMacs){
      const labelUrl='https://id-sensor-mvp.onrender.com/q/'+encodeURIComponent(labelMac),labelSvg=require('../services/qrLabel').renderLabel(labelUrl,labelMac);
      await page.setContent('<body style="margin:0"><img src="data:image/svg+xml;base64,'+Buffer.from(labelSvg).toString('base64')+'">');await page.locator('img').evaluate(img=>img.decode());let found;
      for(const width of[270,315,360,450]){await page.locator('img').evaluate((e,w)=>{e.style.width=w+'px';e.style.height='auto';},width);const pixels=PNG.sync.read(await page.locator('img').screenshot());found=require('jsqr')(new Uint8ClampedArray(pixels.data),pixels.width,pixels.height);if(found)break;}
      assert.equal(found?.data,labelUrl,'Leitura da etiqueta '+labelMac);
    }


    const back=getDb().prepare('SELECT * FROM dispositivos WHERE id = ?').get(warm.card.backendId);assert.equal(back.temperatura_atual,before.body.data.card.temp,'A troca demonstrativa não altera a temperatura-base do painel');
    // The communication exception remains visible even while the demo reading is stabilizing.
    getDb().prepare("UPDATE dispositivos SET status = 'offline' WHERE id = ?").run(back.id);
    const offline=(await request('/api/qr/'+code)).body.data;assert.equal(offline.card.online,false);assert.equal(offline.stabilizing,true);
    getDb().prepare("UPDATE dispositivos SET status = 'normal' WHERE id = ?").run(back.id);
    const state=demo.read(getDb(),back.id);state.startedAt=new Date(Date.now()-3600000).toISOString();demo.save(getDb(),back.id,state);
    const stable=(await request('/api/qr/'+code)).body.data;assert.equal(stable.stabilizing,false);assert.equal(stable.card.temp,before.body.data.card.temp,'Após a estabilização a leitura volta à mesma fonte do painel');
    const report=(await request('/api/qr/'+code+'/report')).body.data;assert(report.replacement.finishedAt);assert.match(report.replacement.justification,/Troca de dispositivo/);
    await request('/api/qr/'+code+'/reset',{key:'12345678'});
    const keepAccess=(await request(endpoint+'/access',{key:'12345678'})).body.data.token;
    await request(endpoint+'/replace',{scanned:'DEMO-NOVO-01',replaceProbe:false},keepAccess);
    const kept=(await request('/api/qr/'+code)).body.data;assert.equal(kept.stabilizing,false);assert.equal(kept.card.temp,before.body.data.card.temp);
    await request('/api/qr/'+code+'/reset',{key:'12345678'});
    for(const [mac,label,expectedStatus,min,max,model,condition] of [['DE:10:00:00:00:01','novo','Dentro do prazo','−200 °C','+200 °C','MST01 Pt100','Novo'],['DE:00:00:00:00:01','atual','Certificado vencido','−20 °C','+60 °C','S1','Em uso'],['DE:10:00:00:00:02','historico','Dentro do prazo','−40 °C','+125 °C','MST01','Disponível']]){
      await page.goto(base+'/dispositivo/'+encodeURIComponent(mac));await page.locator('#details:not([hidden])').waitFor();
      assert.equal(await page.locator('#mac').textContent(),mac);assert.equal(await page.locator('#calibration-status').textContent(),expectedStatus);
      assert.equal(await page.locator('#min').textContent(),min);assert.equal(await page.locator('#max').textContent(),max);assert.equal(await page.locator('#model').textContent(),model);assert.equal(await page.locator('#condition').textContent(),condition);assert.equal(await page.locator('#usage').textContent(),condition);assert(!/Nunca utilizado|Já utilizado/.test(await page.locator('body').innerText()));
      assert.equal(await page.locator('.device-menu button').count(),4);if(condition==='Novo'){await page.locator('[data-device-action="temperature"]').click();assert(await page.locator('#device-menu-message').evaluate(e=>e.matches(':modal')));assert.match(await page.locator('#device-message-text').textContent(),/após a instalação/);await page.locator('#device-message-close').click();}
      await page.locator('#photo').evaluate(img=>img.decode());await page.locator('#seal').evaluate(img=>img.decode());
      await page.screenshot({path:path.join(output,'dispositivo-'+label+'.png'),fullPage:true});
      for(const width of[320,390,736]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Ficha sem rolagem horizontal');}
      await page.setViewportSize({width:390,height:980});
    }
    await page.clock.install();
    await page.goto(base+'/q/DEV-GELADEIRA-01');await page.locator('.page-content:not([hidden])').waitFor();
    const teaser=page.locator('#qr-help-teaser'),help=page.locator('[data-go="help"].nav-button');
    assert.equal(await teaser.isVisible(),false);assert.equal(await help.isVisible(),true);
    await page.clock.fastForward(3500);await page.clock.runFor(350);assert.equal(await teaser.isVisible(),true);
    await page.clock.fastForward(6500);await page.clock.runFor(350);assert.equal(await teaser.isVisible(),false);assert.equal(await help.isVisible(),true);
    await page.clock.fastForward(24500);await page.clock.runFor(350);assert.equal(await teaser.isVisible(),true);
    await teaser.locator('button').click();assert.equal(await teaser.isVisible(),false);assert.equal(await help.isVisible(),true);
    await page.locator('#qr-nav-temperature').click();
    assert.match(await page.locator('#qr-live-status').textContent(),/simulados/);
    await page.screenshot({path:path.join(output,'consulta-temperatura.png'),fullPage:true});
    await page.locator('#qr-nav-replace').click();await page.locator('#qr-access-key').fill('12345678');await page.locator('#qr-key-form button').click();await page.locator('#qr-manual-code').fill('DEMO-NOVO-01');await page.locator('#qr-swap-scan form button').click();await page.locator('#qr-swap-probe:not([hidden])').waitFor();
    assert.equal(await page.locator('.device-identification dd').first().textContent(),demo.catalog[0].mac);
    await page.locator('[name="qr-probe-choice"][value="replace"]').check();await page.locator('#qr-probe-continue').click();await page.locator('#qr-confirm-swap').click();await page.locator('#qr-real-notice:not([hidden])').waitFor();assert(await page.locator('#qr-real-notice').evaluate(e=>e.matches(':modal')));
    await page.screenshot({path:path.join(output,'aviso-estabilizacao.png'),fullPage:true});
    await page.locator('#qr-real-commit').click();await page.locator('#qr-swap-success:not([hidden])').waitFor();await page.locator('#qr-nav-temperature').click();await page.locator('#qr-live-stabilization:not([hidden])').waitFor();
    await page.screenshot({path:path.join(output,'temperatura-estabilizacao.png'),fullPage:true});
    const auth=(await request('/api/auth/login',{username:'idvida.master',password:process.env.PANEL_MASTER_PASSWORD||'idvida816'})).body;
    assert(auth.ok);const panelPage=await browser.newPage({viewport:{width:1440,height:1000}});await panelPage.addInitScript(({session,apiBase})=>{localStorage.setItem('idsensor.panel.session.v2',JSON.stringify(session));localStorage.setItem('PANEL_API_BASE_URL',apiBase);},{session:auth.data,apiBase:base});await panelPage.route('https://**/*',route=>route.abort());
    await panelPage.goto(base);await panelPage.waitForFunction(()=>window.devices?.some(d=>d.id===1&&d.stabilizing));
    const panelCard=panelPage.locator('.grid .card').filter({hasText:'Geladeira 01'}).first();assert(await panelCard.locator('.qr-stabilizing-note').isVisible());
    const panelTemp=await panelPage.evaluate(()=>window.devices.find(d=>d.id===1).temp),qrTemp=(await request('/api/qr/'+code)).body.data.card.temp;assert.equal(panelTemp,qrTemp);assert.equal(await page.locator('#qr-temp-value').textContent(),panelTemp.toFixed(1)+'°C');
    await panelCard.screenshot({path:path.join(output,'card-painel-estabilizacao.png')});await panelPage.close();

    await request('/api/qr/'+code+'/reset',{key:'12345678'});
    assert.equal((await request(endpoint+'/identify',{scanned:'DEMO-NOVO-03'},(await request(endpoint+'/access',{key:'12345678'})).body.data.token)).status,404);
    await page.goto(base+'/q/DEV-GELADEIRA-01');await page.locator('.page-content:not([hidden])').waitFor();await page.locator('#qr-nav-replace').click();await page.locator('#qr-access-key').fill('12345678');await page.locator('#qr-key-form button').click();await page.locator('#qr-manual-code').fill('DEMO-NOVO-01');await page.locator('#qr-swap-scan form button').click();await page.locator('#qr-swap-probe:not([hidden])').waitFor();await page.locator('[name="qr-probe-choice"][value="keep"]').check();await page.locator('#qr-probe-continue').click();await page.locator('#qr-confirm-swap').click();await page.locator('#qr-swap-success:not([hidden])').waitFor();const preserved=(await request('/api/qr/'+code)).body.data;assert.equal(preserved.stabilizing,false);assert.equal(preserved.card.temp,before.body.data.card.temp);
    for(const width of[320,390,736]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
    await request('/api/qr/'+code+'/reset',{key:'12345678'});const historicalGrant=(await request(endpoint+'/access',{key:'12345678'})).body.data.token;const historicalSwap=await request(endpoint+'/replace',{scanned:'DEMO-USADO-01',replaceProbe:true},historicalGrant);assert.equal(historicalSwap.status,200);const historicalLinked=(await request('/api/device-info/DE%3A10%3A00%3A00%3A00%3A02')).body.data;assert.equal(historicalLinked.current.equipment,'Geladeira 01');assert.equal(historicalLinked.history.length,3);await request('/api/qr/DE%3A10%3A00%3A00%3A00%3A02/reset',{key:'12345678'});
    assert.equal((await request('/api/qr-demo/catalog')).body.data.length,2);assert.equal((await request(endpoint)).body.data.sensor.model,'S1');
    assert.deepEqual(errors,[]);fs.writeFileSync(path.join(output,'test-result.json'),JSON.stringify({passed:true,qrDecoded:true,publicData:'demonstration',physicalHardware:false,browserErrors:errors},null,2));
  }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));getDb().close();}
});
