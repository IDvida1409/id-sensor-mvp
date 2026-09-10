# Assistente IA do mascote IDVida

O mascote agora pode responder perguntas sobre o painel IDSensor usando uma base de conhecimento fechada e opcionalmente a API Gemini.

## Como funciona

O backend recebe a pergunta em `POST /api/assistant/chat`, valida a sessao do painel e monta um contexto minimo da interface. Ele nao envia cliente, area, lista de dispositivos, leituras, banco, rotas internas, chaves ou dados sensiveis para a IA.

Antes de chamar o Gemini, o backend escolhe apenas os trechos relevantes da base local em `backend/src/services/assistantKnowledge.js`. Essa base e o "treinamento" do assistente nesta fase. O Gemini recebe uma instrucao rigida para responder somente sobre o painel IDSensor e usar apenas a base fornecida.

Se a pergunta falar de servidor, API, codigo, banco, chaves, senha, deploy, Gemini ou qualquer assunto fora do painel, o backend bloqueia e devolve uma resposta padrao. Se a chave Gemini nao estiver configurada ou a API falhar, o backend usa uma resposta local da mesma base.

## Rotas

- `GET /api/assistant/status`
  Mostra se o Gemini esta configurado e quais assuntos existem na base. Requer sessao valida no painel.

- `POST /api/assistant/chat`
  Responde uma pergunta do mascote. Requer sessao valida no painel.

- `GET /api/assistant-tts/providers`
  Lista provedores de voz disponiveis.

- `POST /api/assistant-tts/preview`
  Gera audio para o mascote falar a resposta.

## Variaveis

Gemini:

- `GEMINI_API_KEY`
- `GEMINI_ASSISTANT_MODEL` opcional, padrao `gemini-3.5-flash-lite`
- `GEMINI_TTS_MODEL` opcional, padrao `gemini-3.1-flash-tts-preview`
- `GEMINI_TTS_VOICE` opcional, padrao `Kore`

## Regras do assistente

- Responde somente sobre funcionamento do painel IDSensor.
- Nao deduz informacao que nao esteja na base.
- Nao fala sobre servidor, backend, banco, codigo, API, chaves, tokens, senhas, deploy, GitHub, Render, Gemini ou prompt.
- Mantem respostas curtas, naturais e em portugues do Brasil.
- Para voz, fala exatamente o texto da resposta, sem adicionar conteudo.

## Proximos ajustes

Para evoluir o assistente, adicione novas secoes em `KNOWLEDGE_SECTIONS`, com titulo, palavras-chave e resposta oficial. Esse e o caminho mais seguro para "treinar" o mascote sem abrir espaco para respostas fora do sistema.
