const QRCode = require('qrcode');
const fs = require('node:fs');
const path = require('node:path');
function renderLabel(url, mac = '') {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
  const n = qr.modules.size, margin = 4, full = n + margin * 2;
  const finders = [[0, 0], [n - 7, 0], [0, n - 7]];
  let marks = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7)) continue;
    if (qr.modules.get(y, x)) marks += `<circle cx="${x + margin + .5}" cy="${y + margin + .5}" r=".40"/>`;
  }
  let finder = '';
  for (const [x, y] of finders) finder += `<rect x="${x + margin}" y="${y + margin}" width="7" height="7" rx="1.75" fill="#080808"/><rect x="${x + margin + 1}" y="${y + margin + 1}" width="5" height="5" rx="1.05" fill="#fff"/><rect x="${x + margin + 2}" y="${y + margin + 2}" width="3" height="3" rx=".65" fill="#005bac"/>`;
  // Keep the actual dotted blue mark from the user's reference, rather than substituting another logo.
  const reference = fs.readFileSync(path.resolve(__dirname, '../../../painel-original/assets/qr-code-modelo-enviado.png')).toString('base64');
  const logoWidth = n * .44, logoHeight = logoWidth * 360 / 437;
  const x = (full - logoWidth) / 2, y = (full - logoHeight) / 2;
  const logo = `<defs><filter id="reference-blue" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -2 0 2 0 0"/></filter><filter id="logo-clearance" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feMorphology operator="dilate" radius=".65"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/></filter><g id="reference-mark"><svg x="${x}" y="${y}" width="${logoWidth}" height="${logoHeight}" viewBox="586 293 437 360"><image href="data:image/png;base64,${reference}" width="1617" height="973" filter="url(#reference-blue)"/></svg></g><mask id="dots-around-mark" maskUnits="userSpaceOnUse" x="0" y="0" width="${full}" height="${full}"><rect width="${full}" height="${full}" fill="white"/><use href="#reference-mark" filter="url(#logo-clearance)"/></mask></defs>`;

  const caption=/^[A-F0-9]{2}(?::[A-F0-9]{2}){5}$/.test(mac)?`<text x="${full/2}" y="${full+1.3}" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-size="1.35">MAC: ${mac}</text>`:'';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${caption?'970':'900'}" viewBox="0 0 ${full} ${full+(caption?3.5:0)}" role="img" aria-label="QR Code no modelo enviado pelo cliente"><rect width="${full}" height="${full+3.5}" fill="white"/>${logo}<g mask="url(#dots-around-mark)"><g fill="#080808">${marks}</g>${finder}</g><use href="#reference-mark"/>${caption}</svg>`;
}
module.exports = { renderLabel };
