(() => {
  'use strict';
  window.IDSensorQrScanner = {
    create({ root, onCode }) {
      const dialog = document.createElement('dialog');
      dialog.id = 'qr-camera-dialog'; dialog.className = 'qr-scanner';
      dialog.setAttribute('aria-labelledby', 'qr-camera-title');
      dialog.innerHTML = '<div class="scanner-heading"><div><p>Trocar dispositivo</p><h2 id="qr-camera-title">Escanear QR Code</h2></div><button type="button" id="qr-camera-close" aria-label="Fechar câmera">×</button></div><p class="scanner-instruction">Posicione a etiqueta dentro da marcação.</p><div class="scanner-stage"><video id="qr-camera-video" autoplay muted playsinline></video><div class="scanner-guide" aria-hidden="true"><span></span><span></span><span></span><span></span></div></div><p id="qr-camera-status" class="scanner-status" role="status">Abrindo câmera…</p><label class="scanner-zoom">Aproximar <input id="qr-camera-zoom" type="range" min="1" max="3" step="0.1" value="1" aria-label="Zoom da câmera"><output id="qr-camera-zoom-value">1×</output></label><button type="button" class="scanner-retry" id="qr-camera-retry" hidden>Tentar abrir a câmera novamente</button><button type="button" class="scanner-manual" id="qr-camera-manual">Digitar MAC</button>';
      root.append(dialog);
      const video = dialog.querySelector('video'), status = dialog.querySelector('#qr-camera-status');
      const zoom = dialog.querySelector('#qr-camera-zoom'), retry = dialog.querySelector('#qr-camera-retry');
      const canvas = document.createElement('canvas'), context = canvas.getContext('2d', { willReadFrequently: true });
      let stream = null, timer, session = 0, phase = 0, detector = null, oldOverflow = '';
      function release() {
        session++; clearTimeout(timer);
        if (stream) stream.getTracks().forEach(track => track.stop());
        stream = null; video.pause(); video.srcObject = null;
        document.body.style.overflow = oldOverflow;
      }
      function close() { release(); if (dialog.open) dialog.close(); }
      dialog.addEventListener('close', () => { if (!dialog.open) release(); });
      dialog.addEventListener('cancel', () => { /* Native dialog closes on Escape. */ });
      dialog.querySelector('#qr-camera-close').addEventListener('click', close);
      dialog.querySelector('#qr-camera-manual').addEventListener('click', () => { close(); root.querySelector('#qr-manual-code')?.focus(); });
      zoom.addEventListener('input', () => {
        video.style.transform = 'scale(' + zoom.value + ')';
        dialog.querySelector('output').textContent = Number(zoom.value).toFixed(1).replace('.0', '') + '×';
        phase = 0;
      });
      function frame(width, inner = 1) {
        const side = Math.min(video.videoWidth, video.videoHeight) / Number(zoom.value) * inner;
        canvas.width = width; canvas.height = width;
        context.drawImage(video, (video.videoWidth - side) / 2, (video.videoHeight - side) / 2, side, side, 0, 0, width, width);
      }
      async function read() {
        if (video.readyState < 2 || !video.videoWidth) return '';
        // Read the visible square, and then a tighter central region for a smaller label.
        const inner = phase % 2 ? .65 : 1;
        if (detector) {
          try { frame(720, inner); const results = await detector.detect(canvas); if (results[0]?.rawValue) return results[0].rawValue; }
          catch { detector = null; }
        }
        const sizes = [[360, 270], [450, 315], [540, 225]][phase % 3];
        phase++;
        for (const width of sizes) {
          frame(width, inner);
          const pixels = context.getImageData(0, 0, width, width);
          const result = window.jsQR?.(pixels.data, width, width, { inversionAttempts: 'attemptBoth' });
          if (result?.data) return result.data;
        }
        return '';
      }
      async function open() {
        if (dialog.open) return;
        oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        zoom.value = '1'; video.style.transform = ''; dialog.querySelector('output').textContent = '1×';
        status.textContent = 'Abrindo câmera…'; retry.hidden = true; phase = 0;
        dialog.showModal();
        const active = ++session;
        try {
          if (!navigator.mediaDevices?.getUserMedia) throw Error('unsupported');
          const incoming = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } });
          if (session !== active || !dialog.open) { incoming.getTracks().forEach(track => track.stop()); return; }
          stream = incoming; video.srcObject = incoming; await video.play();
          if (session !== active || !dialog.open) return;
          const track = incoming.getVideoTracks()[0];
          if (track?.getCapabilities?.().focusMode?.includes('continuous')) track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(() => {});
          if ('BarcodeDetector' in window) {
            try { const formats = await window.BarcodeDetector.getSupportedFormats(); if (formats.includes('qr_code')) detector = new window.BarcodeDetector({ formats: ['qr_code'] }); } catch { detector = null; }
          }
          status.textContent = 'Aponte para o QR do dispositivo novo.';
          async function scan() {
            if (session !== active || !dialog.open) return;
            let delay = 140;
            try {
              const value = await read();
              if (session !== active || !dialog.open) return;
              if (value) {
                status.textContent = 'QR encontrado. Identificando dispositivo…';
                const accepted = await onCode(value);
                if (accepted === true) { close(); return; }
                status.textContent = accepted?.message || 'Dispositivo não identificado. Aponte para o QR do sensor novo ou digite o MAC.';
                delay = 1800;
              }
            } catch { status.textContent = 'Mantenha a etiqueta dentro da marcação e tente aproximar.'; }
            if (session === active && dialog.open) timer = setTimeout(scan, delay);
          }
          scan();
        } catch (error) {
          if (session !== active || !dialog.open) return;
          if (stream) stream.getTracks().forEach(track => track.stop());
          stream = null; video.srcObject = null;
          status.textContent = error.name === 'NotAllowedError' ? 'Autorize o acesso à câmera no navegador para escanear.' : 'Não foi possível abrir a câmera. Tente novamente ou digite o MAC.';
          retry.hidden = false;
        }
      }
      retry.addEventListener('click', () => { close(); open(); });
      return { open, close };
    }
  };
})();
