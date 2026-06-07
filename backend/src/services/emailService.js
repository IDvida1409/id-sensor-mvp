const fs = require('node:fs');
const path = require('node:path');
const { emailEnabled, emailFrom, publicApiUrl, resendApiKey } = require('../config');

const assetDir = path.resolve(__dirname, '../../../painel-original/assets');

function plainTextFromHtml(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function publicAssetUrl(path) {
  return `${String(publicApiUrl || '').replace(/\/+$/, '')}${path}`;
}

function inlinePngAttachment(filename, contentId) {
  const filePath = path.join(assetDir, filename);
  if (!fs.existsSync(filePath)) return null;

  return {
    content: fs.readFileSync(filePath).toString('base64'),
    filename,
    contentId
  };
}

function buildInlineLogoAssets() {
  const idsensor = inlinePngAttachment('idsensor-logo.png', 'idsensor-logo');
  const idvida = inlinePngAttachment('idvida-logo.png', 'idvida-logo');
  const attachments = [idsensor, idvida].filter(Boolean);

  return {
    attachments,
    idsensorLogoSrc: idsensor ? 'cid:idsensor-logo' : publicAssetUrl('/assets/idsensor-logo.png'),
    idvidaLogoSrc: idvida ? 'cid:idvida-logo' : publicAssetUrl('/assets/idvida-logo.png')
  };
}

function formatExpiration(value) {
  if (!value) return '24 horas após a geração';
  return new Date(value).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function buildActivationEmail({
  usuarioNome,
  codigo,
  activationUrl,
  qrImageUrl,
  clienteNome,
  unidadeNome,
  areaNome,
  expiraEm
}) {
  const safeName = escapeHtml(usuarioNome || 'usuário');
  const safeArea = escapeHtml(areaNome || unidadeNome || 'área vinculada');
  const safeClient = escapeHtml(clienteNome || 'cliente');
  const safeCode = escapeHtml(codigo);
  const safeQrUrl = escapeHtml(qrImageUrl || '');
  const safeExpiration = escapeHtml(formatExpiration(expiraEm));
  const logoAssets = buildInlineLogoAssets();
  const idsensorLogo = escapeHtml(logoAssets.idsensorLogoSrc);
  const idvidaLogo = escapeHtml(logoAssets.idvidaLogoSrc);

  const html = `
    <div style="margin:0;background:#f4f8fc;padding:24px 0;font-family:Arial,sans-serif;color:#0f2238;line-height:1.5">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #dbe6f3;border-radius:18px;padding:28px">
        <div style="margin-bottom:24px">
          <img src="${idsensorLogo}" alt="IDsensor" style="display:block;width:150px;max-width:48%;height:auto">
        </div>

        <p style="margin:0 0 14px;font-size:16px">Olá, <strong>${safeName}</strong>.</p>
        <p style="margin:0 0 14px;font-size:15px;color:#344963">
          Você recebeu um código para ativar o app IDsensor e acompanhar os alertas de
          <strong>${safeClient} - ${safeArea}</strong>.
        </p>
        <p style="margin:0 0 18px;font-size:15px;color:#344963">
          Abra o app no celular ou tablet, escaneie o QR Code abaixo ou digite o código de ativação.
        </p>

        <div style="border:1px solid #dbe6f3;border-radius:16px;background:#f8fbff;padding:20px;text-align:center;margin:20px 0">
          ${safeQrUrl ? `<img src="${safeQrUrl}" alt="QR Code de ativação" style="display:block;width:190px;height:190px;margin:0 auto 16px">` : ''}
          <div style="font-size:12px;font-weight:700;color:#667892;text-transform:uppercase;letter-spacing:.08em">Código de ativação</div>
          <div style="font-size:30px;font-weight:800;letter-spacing:2px;margin-top:6px;color:#0d3b66">${safeCode}</div>
        </div>

        <div style="background:#fff8e8;border:1px solid #f1d9a9;border-radius:14px;padding:14px 16px;margin:18px 0;color:#604515;font-size:14px">
          Este código vale até <strong>${safeExpiration}</strong> e só pode ser usado uma vez.
        </div>

        <p style="margin:0 0 10px;font-size:14px;color:#344963">
          Se o código expirar, solicite um novo código à área responsável.
        </p>
        <p style="margin:0 0 18px;font-size:14px;color:#344963">
          Se o app for desinstalado ou o aparelho for trocado, também será necessário solicitar uma nova ativação.
        </p>

        <p style="margin:20px 0 0;font-size:12px;color:#7a8ba3">
          Este e-mail foi enviado automaticamente. Não responda esta mensagem.
        </p>

        <div style="border-top:1px solid #e6edf5;margin-top:24px;padding-top:18px;text-align:center">
          <span style="display:block;font-size:11px;color:#7a8ba3;font-weight:700;margin-bottom:8px">Powered by</span>
          <img src="${idvidaLogo}" alt="IDvida" style="display:inline-block;height:32px;width:auto">
        </div>
      </div>
    </div>
  `;

  return {
    subject: 'Seu código de ativação do IDsensor',
    html,
    text: plainTextFromHtml(html),
    attachments: logoAssets.attachments
  };
}

async function sendActivationEmail(payload) {
  const to = String(payload.usuarioEmail || '').trim();
  if (!emailEnabled) {
    return { status_envio: 'disabled', provider: 'resend', message: 'Envio de e-mail desativado.' };
  }

  if (!resendApiKey || !emailFrom || !to) {
    return {
      status_envio: 'not_configured',
      provider: 'resend',
      message: 'Configure RESEND_API_KEY, EMAIL_FROM e o e-mail do usuário para enviar.'
    };
  }

  const content = buildActivationEmail(payload);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: emailFrom,
      to,
      subject: content.subject,
      html: content.html,
      text: content.text,
      ...(content.attachments?.length ? { attachments: content.attachments } : {})
    })
  });

  const responseText = await response.text();
  if (!response.ok) {
    return {
      status_envio: 'failed',
      provider: 'resend',
      status_code: response.status,
      message: responseText
    };
  }

  return {
    status_envio: 'sent',
    provider: 'resend',
    response: responseText
  };
}

module.exports = {
  sendActivationEmail
};
