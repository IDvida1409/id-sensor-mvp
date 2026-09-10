const OPENAI_VOICES = [
  { id: 'marin', name: 'Marin' },
  { id: 'cedar', name: 'Cedar' },
  { id: 'coral', name: 'Coral' },
  { id: 'nova', name: 'Nova' },
  { id: 'shimmer', name: 'Shimmer' },
  { id: 'sage', name: 'Sage' },
  { id: 'alloy', name: 'Alloy' },
  { id: 'ash', name: 'Ash' },
  { id: 'ballad', name: 'Ballad' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'verse', name: 'Verse' }
];

const AZURE_PT_BR_VOICES = [
  { id: 'pt-BR-FranciscaNeural', name: 'Francisca Neural' },
  { id: 'pt-BR-AntonioNeural', name: 'Antonio Neural' },
  { id: 'pt-BR-BrendaNeural', name: 'Brenda Neural' },
  { id: 'pt-BR-DonatoNeural', name: 'Donato Neural' },
  { id: 'pt-BR-ElzaNeural', name: 'Elza Neural' },
  { id: 'pt-BR-FabioNeural', name: 'Fabio Neural' },
  { id: 'pt-BR-GiovannaNeural', name: 'Giovanna Neural' },
  { id: 'pt-BR-HumbertoNeural', name: 'Humberto Neural' },
  { id: 'pt-BR-JulioNeural', name: 'Julio Neural' },
  { id: 'pt-BR-LeilaNeural', name: 'Leila Neural' },
  { id: 'pt-BR-LeticiaNeural', name: 'Leticia Neural' },
  { id: 'pt-BR-ManuelaNeural', name: 'Manuela Neural' },
  { id: 'pt-BR-NicolauNeural', name: 'Nicolau Neural' },
  { id: 'pt-BR-ValerioNeural', name: 'Valerio Neural' },
  { id: 'pt-BR-YaraNeural', name: 'Yara Neural' }
];

const GOOGLE_PT_BR_VOICES = [
  { id: 'pt-BR-Neural2-A', name: 'Neural2 A' },
  { id: 'pt-BR-Neural2-B', name: 'Neural2 B' },
  { id: 'pt-BR-Neural2-C', name: 'Neural2 C' },
  { id: 'pt-BR-Wavenet-A', name: 'Wavenet A' },
  { id: 'pt-BR-Wavenet-B', name: 'Wavenet B' },
  { id: 'pt-BR-Wavenet-C', name: 'Wavenet C' },
  { id: 'pt-BR-Standard-A', name: 'Standard A' },
  { id: 'pt-BR-Standard-B', name: 'Standard B' },
  { id: 'pt-BR-Standard-C', name: 'Standard C' }
];

const GEMINI_TTS_VOICES = [
  { id: 'Kore', name: 'Kore' },
  { id: 'Puck', name: 'Puck' },
  { id: 'Charon', name: 'Charon' },
  { id: 'Sulafat', name: 'Sulafat' },
  { id: 'Achird', name: 'Achird' }
];

const DEFAULT_TTS_TEXT = 'Seja bem-vindo ao painel IDSensor. Aqui voce acompanha os equipamentos monitorados em tempo real pela IDVida, incluindo Gateway, LoRa e BLE.';
const DEFAULT_INSTRUCTIONS = 'Fale em portugues do Brasil, com diccao excelente, ritmo natural, tom profissional e pausas leves. Pronuncie IDSensor, IDVida, Gateway, LoRa e BLE com clareza.';

function hasEnv(name) {
  return Boolean(String(process.env[name] || '').trim());
}

function createError(statusCode, message, details = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function pickVoice(voice, voices, fallback) {
  const requested = String(voice || '').trim();
  if (requested && voices.some((item) => item.id === requested)) return requested;
  return fallback;
}

function pickPtBrVoiceOrCustom(voice, voices, fallback) {
  const requested = String(voice || '').trim();
  if (requested && voices.some((item) => item.id === requested)) return requested;
  if (/^pt-BR-[A-Za-z0-9-]+$/.test(requested)) return requested;
  return fallback;
}

function listTtsProviders() {
  const elevenConfiguredVoice = String(process.env.ELEVENLABS_VOICE_ID || '').trim();

  return {
    defaultText: DEFAULT_TTS_TEXT,
    defaultInstructions: DEFAULT_INSTRUCTIONS,
    providers: [
      {
        id: 'browser',
        name: 'Voz do navegador',
        configured: true,
        clientOnly: true,
        approvalCandidate: false,
        qualityTier: 'fallback',
        costProfile: 'gratuito no navegador',
        notes: 'Fallback tecnico. Nao deve ser usado para a apresentacao final porque pode soar como GPS.',
        voices: []
      },
      {
        id: 'gemini',
        name: 'Gemini TTS',
        configured: hasEnv('GEMINI_API_KEY'),
        approvalCandidate: true,
        qualityTier: 'premium',
        env: ['GEMINI_API_KEY', 'GEMINI_TTS_MODEL', 'GEMINI_TTS_VOICE'],
        model: process.env.GEMINI_TTS_MODEL || 'gemini-3.1-flash-tts-preview',
        costProfile: 'pago por uso, conforme a conta Gemini',
        notes: 'Candidato principal quando a mesma chave Gemini do assistente estiver configurada.',
        voices: GEMINI_TTS_VOICES
      },
      {
        id: 'openai',
        name: 'OpenAI Text-to-Speech',
        configured: hasEnv('OPENAI_API_KEY'),
        approvalCandidate: true,
        qualityTier: 'premium',
        env: ['OPENAI_API_KEY'],
        model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts',
        costProfile: 'pago por uso',
        notes: 'Candidato principal para voz natural, profissional e controlada por instrucao.',
        voices: OPENAI_VOICES
      },
      {
        id: 'elevenlabs',
        name: 'ElevenLabs',
        configured: hasEnv('ELEVENLABS_API_KEY') && Boolean(elevenConfiguredVoice),
        approvalCandidate: true,
        qualityTier: 'premium',
        env: ['ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID'],
        model: process.env.ELEVENLABS_TTS_MODEL || 'eleven_multilingual_v2',
        costProfile: 'teste gratuito/pago por uso, depende do plano',
        notes: 'Candidato principal para vozes muito naturais. Informe ELEVENLABS_VOICE_ID ou cole o ID da voz no campo.',
        voices: elevenConfiguredVoice
          ? [{ id: elevenConfiguredVoice, name: 'Voz configurada no servidor' }]
          : []
      },
      {
        id: 'azure',
        name: 'Azure AI Speech',
        configured: hasEnv('AZURE_SPEECH_KEY') && hasEnv('AZURE_SPEECH_REGION'),
        approvalCandidate: false,
        qualityTier: 'fallback',
        env: ['AZURE_SPEECH_KEY', 'AZURE_SPEECH_REGION'],
        model: 'Neural TTS',
        costProfile: 'tem camada gratuita/baixo custo, depende da conta Azure',
        notes: 'Fallback tecnico. Nao usar como candidata principal se soar artificial.',
        voices: AZURE_PT_BR_VOICES
      },
      {
        id: 'google',
        name: 'Google Cloud Text-to-Speech',
        configured: hasEnv('GOOGLE_TTS_API_KEY'),
        approvalCandidate: false,
        qualityTier: 'fallback',
        env: ['GOOGLE_TTS_API_KEY'],
        model: 'Cloud TTS',
        costProfile: 'tem cota gratuita/baixo custo, depende da conta Google Cloud',
        notes: 'Fallback tecnico. Nao usar como candidata principal se soar artificial.',
        voices: GOOGLE_PT_BR_VOICES
      }
    ]
  };
}

async function fetchAudio(url, options, providerName) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw createError(response.status, `Nao foi possivel gerar voz com ${providerName}.`, details.slice(0, 700));
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') || 'audio/mpeg';
  return { buffer, contentType };
}

function createWavBuffer(pcmBuffer, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = channels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

function uniqueTtsModels(configuredModel) {
  const candidates = [
    configuredModel,
    process.env.GEMINI_TTS_MODEL,
    'gemini-3.1-flash-tts-preview',
    'gemini-2.5-flash-preview-tts'
  ];
  return candidates
    .map((model) => String(model || '').trim())
    .filter(Boolean)
    .filter((model, index, list) => list.indexOf(model) === index);
}

function extractGeminiAudio(payload) {
  const visit = (value) => {
    if (!value || typeof value !== 'object') return null;
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = visit(item);
        if (found) return found;
      }
      return null;
    }

    const outputAudio = value.output_audio || value.outputAudio;
    if (outputAudio?.data) {
      return {
        data: String(outputAudio.data),
        mimeType: String(outputAudio.mime_type || outputAudio.mimeType || '')
      };
    }

    const inlineData = value.inlineData || value.inline_data;
    if (inlineData?.data) {
      return {
        data: String(inlineData.data),
        mimeType: String(inlineData.mimeType || inlineData.mime_type || '')
      };
    }

    if (typeof value.data === 'string') {
      const mimeType = String(value.mimeType || value.mime_type || '');
      if (/^audio\//i.test(mimeType)) return { data: value.data, mimeType };
    }

    for (const key of Object.keys(value)) {
      const found = visit(value[key]);
      if (found) return found;
    }
    return null;
  };

  return visit(payload);
}

async function synthesizeGemini({ text, voice, instructions }) {
  if (!hasEnv('GEMINI_API_KEY')) {
    throw createError(503, 'GEMINI_API_KEY nao configurada no servidor.');
  }

  const selectedVoice = pickVoice(voice || process.env.GEMINI_TTS_VOICE, GEMINI_TTS_VOICES, 'Kore');
  const prompt = `${instructions || DEFAULT_INSTRUCTIONS}\n\nTexto para falar:\n${text}`;
  let lastError = null;

  for (const model of uniqueTtsModels(process.env.GEMINI_TTS_MODEL || 'gemini-3.1-flash-tts-preview')) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/interactions?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Revision': '2026-05-20'
      },
      body: JSON.stringify({
        model,
        input: prompt,
        response_format: {
          type: 'audio'
        },
        generation_config: {
          speech_config: [
            { voice: selectedVoice }
          ],
          thinking_level: 'low'
        }
      })
    });

    const payload = await response.json().catch(async () => ({ raw: await response.text().catch(() => '') }));
    if (!response.ok) {
      const details = JSON.stringify(payload || {}).slice(0, 700);
      lastError = createError(response.status, 'Nao foi possivel gerar voz com Gemini TTS.', details);
      if (response.status === 404) continue;
      throw lastError;
    }

    const audio = extractGeminiAudio(payload);
    if (!audio?.data) {
      throw createError(502, 'Gemini TTS nao retornou audio.', JSON.stringify(payload || {}).slice(0, 700));
    }

    const mimeType = audio.mimeType || 'audio/L16;codec=pcm;rate=24000';
    const sampleRate = Number(mimeType.match(/rate=(\d+)/i)?.[1] || 24000);
    const rawBuffer = Buffer.from(audio.data.replace(/^data:[^,]+,/, ''), 'base64');
    if (/audio\/(?:wav|mpeg|mp3|ogg)/i.test(mimeType)) {
      return { buffer: rawBuffer, contentType: mimeType };
    }
    return { buffer: createWavBuffer(rawBuffer, sampleRate), contentType: 'audio/wav' };
  }

  if (lastError) throw lastError;
  throw createError(500, 'Nao foi possivel gerar voz com Gemini TTS.');
}

async function synthesizeOpenAI({ text, voice, instructions }) {
  if (!hasEnv('OPENAI_API_KEY')) {
    throw createError(503, 'OPENAI_API_KEY nao configurada no servidor.');
  }

  const model = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts';
  const payload = {
    model,
    voice: pickVoice(voice, OPENAI_VOICES, 'marin'),
    input: text,
    response_format: 'mp3'
  };

  if (model.startsWith('gpt-4o')) {
    payload.instructions = instructions || DEFAULT_INSTRUCTIONS;
  }

  return fetchAudio('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }, 'OpenAI');
}

async function synthesizeElevenLabs({ text, voice }) {
  if (!hasEnv('ELEVENLABS_API_KEY')) {
    throw createError(503, 'ELEVENLABS_API_KEY nao configurada no servidor.');
  }

  const voiceId = String(voice || process.env.ELEVENLABS_VOICE_ID || '').trim();
  if (!voiceId) {
    throw createError(400, 'Informe ELEVENLABS_VOICE_ID no servidor ou envie o ID da voz no campo de voz.');
  }

  const modelId = process.env.ELEVENLABS_TTS_MODEL || 'eleven_multilingual_v2';

  return fetchAudio(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
    method: 'POST',
    headers: {
      Accept: 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.46,
        similarity_boost: 0.78,
        style: 0.2,
        use_speaker_boost: true
      }
    })
  }, 'ElevenLabs');
}

async function synthesizeAzure({ text, voice, rate }) {
  if (!hasEnv('AZURE_SPEECH_KEY') || !hasEnv('AZURE_SPEECH_REGION')) {
    throw createError(503, 'AZURE_SPEECH_KEY e AZURE_SPEECH_REGION nao configuradas no servidor.');
  }

  const selectedVoice = pickPtBrVoiceOrCustom(voice, AZURE_PT_BR_VOICES, 'pt-BR-YaraNeural');
  const ratePercent = Math.round((Number(rate || 0.95) - 1) * 100);
  const rateText = ratePercent === 0 ? 'default' : `${ratePercent > 0 ? '+' : ''}${ratePercent}%`;
  const ssml = `<speak version="1.0" xml:lang="pt-BR"><voice xml:lang="pt-BR" name="${escapeXml(selectedVoice)}"><prosody rate="${rateText}">${escapeXml(text)}</prosody></voice></speak>`;
  const region = String(process.env.AZURE_SPEECH_REGION).trim();

  return fetchAudio(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/ssml+xml',
      'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
      'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
      'User-Agent': 'idsensor-assistant-tts'
    },
    body: ssml
  }, 'Azure AI Speech');
}

async function synthesizeGoogle({ text, voice, rate }) {
  if (!hasEnv('GOOGLE_TTS_API_KEY')) {
    throw createError(503, 'GOOGLE_TTS_API_KEY nao configurada no servidor.');
  }

  const selectedVoice = pickPtBrVoiceOrCustom(voice, GOOGLE_PT_BR_VOICES, 'pt-BR-Neural2-A');
  const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(process.env.GOOGLE_TTS_API_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: 'pt-BR', name: selectedVoice },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: Number(rate || 0.96)
      }
    })
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.audioContent) {
    throw createError(response.status || 500, 'Nao foi possivel gerar voz com Google Cloud TTS.', JSON.stringify(payload || {}).slice(0, 700));
  }

  return {
    buffer: Buffer.from(payload.audioContent, 'base64'),
    contentType: 'audio/mpeg'
  };
}

async function synthesizeTts({ provider = 'openai', text, voice, instructions, rate }) {
  const input = String(text || '').trim();
  if (!input) throw createError(400, 'Informe um texto para gerar a voz.');
  if (input.length > 1200) throw createError(400, 'O teste de voz aceita no maximo 1200 caracteres.');

  const selectedProvider = String(provider || 'openai').trim().toLowerCase();
  const normalized = {
    text: input,
    voice,
    instructions: String(instructions || DEFAULT_INSTRUCTIONS).trim(),
    rate
  };

  if (selectedProvider === 'browser') {
    throw createError(400, 'A voz do navegador deve ser executada diretamente no front-end.');
  }

  if (selectedProvider === 'gemini') return synthesizeGemini(normalized);
  if (selectedProvider === 'openai') return synthesizeOpenAI(normalized);
  if (selectedProvider === 'elevenlabs') return synthesizeElevenLabs(normalized);
  if (selectedProvider === 'azure') return synthesizeAzure(normalized);
  if (selectedProvider === 'google') return synthesizeGoogle(normalized);

  throw createError(400, `Provedor de voz desconhecido: ${selectedProvider}`);
}

module.exports = {
  DEFAULT_INSTRUCTIONS,
  DEFAULT_TTS_TEXT,
  listTtsProviders,
  synthesizeTts
};
