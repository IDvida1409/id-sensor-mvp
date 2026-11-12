const QRCode = require('qrcode');
const mark = require('./qrMarkDots.json');
function renderLabel(url, mac = '') {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
  const n = qr.modules.size, margin = 4, full = n + margin * 2;
  const finders = [[0, 0], [n - 7, 0], [0, n - 7]];
  const scale = n * .44 / mark.width;
  const left = (full - mark.width * scale) / 2, top = (full - mark.height * scale) / 2;
  const blueRadius = mark.radius * scale;
  const blue = mark.dots.map(([x,y]) => [left + x * scale, top + y * scale]);
  const blackRadius = .40, separation = blackRadius + blueRadius + .10;
  let dots = '';
  // Both colors are whole vector dots: no bitmap overlay, clipping, or white plate.
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (finders.some(([fx,fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7)) continue;
    if (!qr.modules.get(y,x)) continue;
    const cx = x + margin + .5, cy = y + margin + .5;
    if (blue.some(([bx,by]) => (bx-cx)**2 + (by-cy)**2 < separation**2)) continue;
    dots += `<circle cx="${cx}" cy="${cy}" r="${blackRadius}" fill="#080808"/>`;
  }
  for (const [x,y] of blue) dots += `<circle cx="${x.toFixed(3)}" cy="${y.toFixed(3)}" r="${blueRadius.toFixed(3)}" fill="#005bac"/>`;
  let finder = '';
  for (const [x,y] of finders) finder += `<rect x="${x+margin}" y="${y+margin}" width="7" height="7" rx="1.75" fill="#080808"/><rect x="${x+margin+1}" y="${y+margin+1}" width="5" height="5" rx="1.05" fill="#fff"/><rect x="${x+margin+2}" y="${y+margin+2}" width="3" height="3" rx=".65" fill="#005bac"/>`;
  const caption = /^[A-F0-9]{2}(?::[A-F0-9]{2}){5}$/.test(mac) ? `<text x="${full/2}" y="${full+1.3}" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-size="1.35">MAC: ${mac}</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${caption?'970':'900'}" viewBox="0 0 ${full} ${full+(caption?3.5:0)}" role="img" aria-label="Etiqueta QR com marca formada por pontos azuis integrados"><rect width="${full}" height="${full+3.5}" fill="white"/>${dots}${finder}${caption}</svg>`;
}
module.exports = { renderLabel };
