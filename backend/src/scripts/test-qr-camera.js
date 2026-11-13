const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const root = path.resolve(__dirname, '../../..');
const directory = path.join(root, '.tmp', 'qr-camera-' + Date.now()); fs.mkdirSync(directory, { recursive: true });
Object.assign(process.env, { DATABASE_URL: '', DATABASE_PATH: path.join(directory, 'test.db'), AUTO_SEED_DEMO_DATA: 'false', MQTT_BRIDGE_ENABLED: 'false', EXPO_PUSH_ENABLED: 'false', EMAIL_ENABLED: 'false' });

test('Câmera frontal: modal, permissão, cancelamento, zoom e leitura real dos pontos na imagem de vídeo', { timeout: 120000 }, async () => {
  const { initDb, getDb } = require('../db/database'); initDb(); require('../db/seed').seedDatabase();
  const server = http.createServer(require('../app').app); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const { chromium } = require('playwright'); let browser;
  try {
    browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } }), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/q/DEV-GELADEIRA-01'); await page.locator('.page-content:not([hidden])').waitFor();
    await page.locator('#qr-help-teaser').waitFor({state:'visible',timeout:8000});
    fs.mkdirSync(path.join(root,'output/qr-demo'),{recursive:true});await page.locator('#qr-help-teaser').screenshot({path:path.join(root,'output/qr-demo/convite-ajuda-ajustado.png')});
    await page.locator('#qr-nav-replace').click(); await page.locator('#qr-access-key').fill('12345678'); await page.locator('#qr-key-form button').click(); await page.locator('#qr-manual-code').waitFor();
    await page.evaluate(() => {
      Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, writable: true, value: async () => { throw new DOMException('Denied', 'NotAllowedError'); } });
    });
    await page.locator('#qr-simulate-scan').click();
    await page.waitForFunction(() => document.querySelector('#qr-camera-status').textContent.includes('Autorize'));
    assert(await page.locator('#qr-camera-dialog').evaluate(e => e.matches(':modal')));
    await page.locator('#qr-camera-close').click(); assert.equal(await page.locator('#qr-camera-dialog').isVisible(), false);
    // A camera permission request that completes after closing must release its track.
    await page.evaluate(() => {
      navigator.mediaDevices.getUserMedia = () => new Promise(resolve => { window.resolveCamera = resolve; });
    });
    await page.locator('#qr-simulate-scan').click(); await page.locator('#qr-camera-close').click();
    await page.evaluate(() => { const canvas = document.createElement('canvas'); canvas.width = canvas.height = 100; const s = canvas.captureStream(); window.lateTrack = s.getVideoTracks()[0]; window.resolveCamera(s); });
    await page.waitForFunction(() => window.lateTrack.readyState === 'ended');
    const { renderLabel } = require('../services/qrLabel');
    const newSvg = renderLabel('https://id-sensor-mvp.onrender.com/q/DE%3A10%3A00%3A00%3A00%3A01', 'DE:10:00:00:00:01');
    const oldSvg = renderLabel('https://id-sensor-mvp.onrender.com/q/DE%3A00%3A00%3A00%3A00%3A01', 'DE:00:00:00:00:01');
    await page.evaluate(async ({ newSvg, oldSvg }) => {
      const images = {};
      for (const [key, svg] of Object.entries({ valid: newSvg, unknown: oldSvg })) { const image = new Image(); image.src = 'data:image/svg+xml;base64,' + btoa(svg); await image.decode(); images[key] = image; }
      window.BarcodeDetector = undefined; // Exercise the software decoder used on browsers without native detection.
      window.cameraTest = { mode: 'blank', width: 1280, height: 960, size: 280, rotation: .035, tracks: [] };
      navigator.mediaDevices.getUserMedia = async constraints => {
        window.cameraConstraints = constraints;
        const state = window.cameraTest, canvas = document.createElement('canvas'); canvas.width = state.width; canvas.height = state.height;
        const context = canvas.getContext('2d');
        const draw = () => {
          context.fillStyle = '#dce2e7'; context.fillRect(0, 0, canvas.width, canvas.height);
          const image = images[state.mode]; if (!image) return;
          context.save(); context.translate(canvas.width / 2, canvas.height / 2); context.rotate(state.rotation);
          context.filter = 'blur(0.35px)'; context.drawImage(image, -state.size / 2, -state.size * image.height / image.width / 2, state.size, state.size * image.height / image.width); context.restore();
        };
        draw(); const stream = canvas.captureStream(12); const interval = setInterval(draw, 80);
        const track = stream.getVideoTracks()[0], stop = track.stop.bind(track); track.stop = () => { clearInterval(interval); stop(); };
        state.tracks.push(track); return stream;
      };
    }, { newSvg, oldSvg });
    await page.locator('#qr-manual-code').scrollIntoViewIfNeeded();
    await page.locator('#qr-simulate-scan').click();
    await page.waitForFunction(() => document.querySelector('#qr-camera-video').readyState >= 2);
    const bounds = await page.locator('#qr-camera-dialog').boundingBox(); assert(bounds.y >= 0 && bounds.y + bounds.height <= 845);
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    assert.equal(await page.evaluate(() => window.cameraConstraints.video.facingMode.ideal), 'environment');
    await page.locator('#qr-camera-zoom').evaluate(e => { e.value = '1.5'; e.dispatchEvent(new Event('input')); });
    assert.equal(await page.locator('#qr-camera-video').evaluate(e => e.style.transform), 'scale(1.5)');
    await page.evaluate(() => { window.cameraTest.mode = 'unknown'; });
    await page.waitForFunction(() => document.querySelector('#qr-camera-status').textContent.includes('QR Codes de exemplo'), { timeout: 15000 });
    fs.mkdirSync(path.join(root, 'output/qr-demo'), { recursive: true });
    await page.screenshot({ path: path.join(root, 'output/qr-demo/camera-modal-celular.png'), fullPage: false });
    assert(await page.locator('#qr-camera-dialog').evaluate(e => e.matches(':modal')));
    await page.evaluate(() => { window.cameraTest.mode = 'valid'; });
    await page.locator('#qr-swap-probe:not([hidden])').waitFor({ timeout: 20000 });
    assert.equal(await page.locator('.device-identification dd').first().textContent(), 'DE:10:00:00:00:01');
    assert.equal(await page.locator('#qr-camera-dialog').isVisible(), false);
    assert(await page.evaluate(() => window.cameraTest.tracks.every(track => track.readyState === 'ended')));
    // Same individual label with a portrait video and a larger sticker.
    await page.locator('#qr-swap-probe [data-swap-back="scan"]').click();
    await page.evaluate(() => Object.assign(window.cameraTest, { mode: 'valid', width: 960, height: 1280, size: 420, rotation: -.04 }));
    await page.locator('#qr-simulate-scan').click();
    await page.locator('#qr-swap-probe:not([hidden])').waitFor({ timeout: 20000 });
    assert(await page.evaluate(() => window.cameraTest.tracks.every(track => track.readyState === 'ended')));
    assert.deepEqual(errors, []);
    assert.equal(getDb().prepare('SELECT count(*) AS n FROM qr_demo_replacements').get().n, 0, 'Ler o QR não efetiva a troca sem confirmação');
  } finally { if (browser) await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); getDb().close(); }
});
