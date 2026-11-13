const fs = require('node:fs');
const path = require('node:path');

function send(res) {
  const pdf = fs.readFileSync(path.resolve(__dirname, '../../../painel-original/certificado-geladeira-1.pdf'));
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="certificado-exemplo.pdf"',
    'Content-Length': pdf.length,
    'Cache-Control': 'no-store'
  });
  res.end(pdf);
}

module.exports = { send };
