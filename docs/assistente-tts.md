# Camada de voz do assistente IDvida

Esta fase implementa apenas a camada de TTS para validar vozes. Ela ainda nao define a voz final do assistente.

## Pagina de teste

Abra:

`/teste-voz.html`

A pagina de aprovacao compara o mesmo roteiro apenas nos candidatos premium:

- Gemini TTS;
- OpenAI Text-to-Speech;
- ElevenLabs;

Voz nativa do navegador, Azure/Microsoft e Google ficam como fallback tecnico na camada de backend, mas nao entram como candidatas principais para a apresentacao porque podem soar artificiais ou como GPS.

## Rotas

- `GET /api/assistant-tts/providers`
  Lista provedores, vozes conhecidas e quais estao configurados no servidor.

- `POST /api/assistant-tts/preview`
  Gera um audio de teste a partir do provedor escolhido.

- `POST /api/assistant-voice-preview`
  Rota antiga mantida por compatibilidade.

## Variaveis de ambiente

OpenAI:

- `OPENAI_API_KEY`
- `OPENAI_TTS_MODEL` opcional, padrao `gpt-4o-mini-tts`

ElevenLabs:

- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- `ELEVENLABS_TTS_MODEL` opcional, padrao `eleven_multilingual_v2`

Gemini:

- `GEMINI_API_KEY`
- `GEMINI_TTS_MODEL` opcional, padrao `gemini-3.1-flash-tts-preview`
- `GEMINI_TTS_VOICE` opcional, padrao `Kore`

Azure:

- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`

Google Cloud:

- `GOOGLE_TTS_API_KEY`

## Criterios de validacao

Usar sempre o mesmo roteiro de teste:

> Seja bem-vindo ao painel IDSensor. Aqui voce acompanha os equipamentos monitorados em tempo real pela IDVida, incluindo Gateway, LoRa e BLE.

Avaliar:

- portugues do Brasil nativo;
- diccao limpa;
- ritmo natural;
- ausencia de metalizacao;
- pronuncia correta de IDSensor, IDVida, Gateway, LoRa e BLE;
- tom profissional e compativel com saude, laboratorio e monitoramento.
