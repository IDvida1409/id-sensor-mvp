const { emailEnabled, emailFrom, resendApiKey } = require('../config');

function plainTextFromHtml(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
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

function buildActivationEmail({ usuarioNome, codigo, activationUrl, clienteNome, unidadeNome, areaNome }) {
  const safeName = escapeHtml(usuarioNome || 'usuário');
  const safeArea = escapeHtml(areaNome || unidadeNome || 'área vinculada');
  const safeClient = escapeHtml(clienteNome || 'cliente');
  const safeCode = escapeHtml(codigo);
  const safeUrl = escapeHtml(activationUrl);
  const html = `
    <div style="font-family:Arial,sans-serif;color:#0f2238;line-height:1.5">
      <h2 style="margin:0 0 12px">Vincular aparelho ao IDsensor</h2>
      <p>Olá, ${safeName}.</p>
      <p>Use o código abaixo para vincular o celular aos alertas do ${safeClient} - ${safeArea}.</p>
      <p style="font-size:28px;font-weight:800;letter-spacing:2px;margin:22px 0;color:#0d3b66">${safeCode}</p>
      <p>Link de ativação: <a href="${safeUrl}">${safeUrl}</a></p>
      <p>Depois da ativação, este aparelho receberá os alertas da área vinculada.</p>
    </div>
  `;

  return {
    subject: `Código de ativação IDsensor - ${safeArea}`,
    html,
    text: plainTextFromHtml(html)
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
      text: content.text
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
