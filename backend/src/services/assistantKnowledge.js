const DEFAULT_ASSISTANT_MODEL = process.env.GEMINI_ASSISTANT_MODEL
  || process.env.GEMINI_MODEL
  || 'gemini-3.5-flash-lite';
const GEMINI_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_QUESTION_LENGTH = 420;
const MAX_ANSWER_LENGTH = 900;

const KNOWLEDGE_SECTIONS = [
  {
    id: 'visao-geral',
    title: 'Visao geral do painel',
    keywords: ['painel', 'idsensor', 'idvida', 'monitoramento', 'sistema', 'tempo real'],
    answer: 'O painel IDSensor centraliza o monitoramento dos equipamentos. Ele mostra cards com temperatura, limites, comunicacao, alertas, detalhes, grafico, telemetria, calibracao, relatorios e recursos de gestao conforme o perfil do usuario.'
  },
  {
    id: 'cards',
    title: 'Cards dos equipamentos',
    keywords: ['card', 'cards', 'equipamento', 'temperatura', 'minimo', 'maximo', 'umidade', 'bateria'],
    answer: 'Cada card representa um equipamento monitorado. No card aparecem temperatura atual, limite minimo, limite maximo, status visual, comunicacao, bateria, umidade quando disponivel e alertas ativos.'
  },
  {
    id: 'temperatura',
    title: 'Configuracao e leitura de temperatura',
    keywords: ['temperatura', 'limite', 'limites', 'minima', 'maxima', 'configurar', 'configuracao', 'faixa'],
    answer: 'A configuracao de temperatura define a faixa minima e maxima esperada para o equipamento. O painel compara as leituras com esses limites e muda o estado visual do card quando a temperatura entra em atencao ou em condicao critica. Ajustes de limite devem ser feitos por usuario autorizado no cadastro ou nas configuracoes do equipamento.'
  },
  {
    id: 'status-cores',
    title: 'Status e cores',
    keywords: ['cor', 'cores', 'azul', 'laranja', 'amarelo', 'vermelho', 'critico', 'atencao', 'normal', 'manutencao', 'degelo', 'reposicao', 'inventario'],
    answer: 'As cores ajudam a identificar a condicao do equipamento. Azul indica operacao normal, amarelo ou laranja indica atencao, vermelho indica critico e cinza pode indicar manutencao ou outro estado operacional. Tambem existem estados como degelo, reposicao e inventario.'
  },
  {
    id: 'comunicacao',
    title: 'Comunicacao do equipamento',
    keywords: ['comunicacao', 'comunicando', 'sem comunicacao', 'logo', 'simbolo', 'idvida', 'offline', 'online'],
    answer: 'O simbolo da IDvida no card indica a comunicacao do equipamento. Quando esta azul, o equipamento esta comunicando. Quando aparece em vermelho ou com aviso de sem comunicacao, o dispositivo parou de enviar leituras dentro do tempo esperado.'
  },
  {
    id: 'alertas',
    title: 'Alertas e silenciamento',
    keywords: ['alerta', 'alertas', 'sino', 'silenciar', 'silencio', 'sms', 'email', 'whatsapp'],
    answer: 'Os alertas avisam quando um equipamento exige atencao, esta critico ou perdeu comunicacao. O sino do card indica ocorrencias e pode permitir silenciamento temporario quando o usuario tem permissao. O registro da ocorrencia continua mesmo quando o aviso e silenciado.'
  },
  {
    id: 'filtros-busca',
    title: 'Filtros e busca',
    keywords: ['filtro', 'filtros', 'buscar', 'busca', 'pesquisar', 'area', 'cliente', 'mac', 'codigo', 'nome'],
    answer: 'Os filtros organizam a visualizacao por status, area ou cliente. A busca ajuda a localizar rapidamente um equipamento pelo nome, codigo ou MAC.'
  },
  {
    id: 'detalhes',
    title: 'Detalhes do equipamento',
    keywords: ['detalhe', 'detalhes', 'abrir card', 'informacao', 'informacoes', 'responsavel', 'modelo', 'mac', 'editar', 'clonar'],
    answer: 'Ao abrir um card, o painel mostra os detalhes do equipamento. Essa area apresenta eventos recentes, comunicacao, bateria, umidade, status operacional e dados cadastrais como MAC, modelo, nome, codigo, area e responsavel. Usuarios autorizados tambem podem editar dados, clonar cadastro ou alterar MAC.'
  },
  {
    id: 'calibracao',
    title: 'Calibracao e certificado',
    keywords: ['calibracao', 'calibrado', 'certificado', 'vencido', 'vencimento', 'baixar certificado', 'visualizar certificado'],
    answer: 'A area de calibracao mostra a situacao do certificado do equipamento. Azul indica certificado valido, laranja indica certificado proximo do vencimento e vermelho indica certificado vencido. Tambem aparecem as datas de calibracao e vencimento, com opcoes para visualizar ou baixar o certificado.'
  },
  {
    id: 'grafico',
    title: 'Grafico de temperatura',
    keywords: ['grafico', 'grafico', 'historico', 'periodo', 'periodos', 'telemetria', 'variacao', 'curva'],
    answer: 'O grafico mostra o comportamento da temperatura ao longo do tempo. Ele ajuda a visualizar limites configurados, pontos de atencao, pontos criticos, variacoes e eventos registrados no periodo selecionado.'
  },
  {
    id: 'telemetria',
    title: 'Telemetria operacional',
    keywords: ['telemetria', 'dentro do limite', 'fora do limite', 'tempo', 'recorrencia', 'normalizacao', 'pico'],
    answer: 'A telemetria mostra por quanto tempo o equipamento ficou dentro do limite, em atencao, em condicao critica ou sem comunicacao. Ela tambem resume canais de alerta enviados e registra eventos como inicio da ocorrencia, pico atingido, recorrencia, silenciamento e normalizacao.'
  },
  {
    id: 'relatorios',
    title: 'Relatorios',
    keywords: ['relatorio', 'relatorios', 'pdf', 'excel', 'csv', 'analitico', 'exportar', 'coleta programada'],
    answer: 'A area de relatorios permite exportar informacoes em PDF, Excel, CSV ou relatorio analitico. Esses arquivos apoiam conferencia, auditoria e acompanhamento historico. A coleta programada ajuda a consolidar relatorios no periodo configurado.'
  },
  {
    id: 'gestao',
    title: 'Gestao',
    keywords: ['gestao', 'saude', 'contrato', 'disponibilidade', 'ordem de servico', 'servicos', 'calibrados'],
    answer: 'A area de Gestao apresenta a saude geral dos dispositivos, certificados validos, proximos do vencimento, vencidos, equipamentos em manutencao, comunicando e sem comunicacao. Tambem pode mostrar contrato, disponibilidade, servicos e ordens de servico.'
  },
  {
    id: 'noc',
    title: 'NOC',
    keywords: ['noc', 'ocorrencia', 'ocorrencias', 'tempo real', 'bateria', 'fonte'],
    answer: 'O modo NOC foi criado para acompanhamento operacional em tempo real. Ele organiza ocorrencias por area, dispositivo ou cliente, com filtros para proximo do limite, fora do limite, sem comunicacao, bateria e fonte, ou todos os status.'
  },
  {
    id: 'configuracoes',
    title: 'Configuracoes do painel',
    keywords: ['configuracao', 'configuracoes', 'silenciar painel', 'atualizacao automatica', 'coleta programada', 'usuarios', 'vincular dispositivo'],
    answer: 'Nas configuracoes ficam recursos de operacao como silenciar temporariamente o painel, ativar atualizacao automatica, configurar coleta programada, vincular dispositivos para alertas e gerenciar usuarios quando o perfil tem permissao.'
  },
  {
    id: 'acessibilidade',
    title: 'Acessibilidade',
    keywords: ['acessibilidade', 'alto contraste', 'daltonico', 'daltônico', 'compacto', 'visual compacto', 'informacoes visiveis'],
    answer: 'A acessibilidade permite adaptar a leitura visual do painel. As opcoes incluem alto contraste, modo daltonico, visual compacto e escolha das informacoes exibidas nos cards.'
  },
  {
    id: 'permissoes',
    title: 'Perfis e permissoes',
    keywords: ['perfil', 'permissao', 'permissoes', 'usuario', 'master', 'cliente', 'admin'],
    answer: 'As funcoes disponiveis dependem do perfil do usuario. O perfil IDvida Master tem acesso administrativo mais amplo. Perfis de cliente ou area podem ver apenas as funcoes liberadas para sua operacao.'
  }
];

const INTERNAL_TOPIC_PATTERNS = [
  /\b(api|endpoint|rota|servidor|backend|front-?end|banco de dados|database|sql|tabela|github|render|deploy|codigo fonte|c[oó]digo|token|senha|chave|secret|env|variavel de ambiente|gemini|prompt|modelo de ia|fine[- ]?tuning)\b/i,
  /\b(pol[ií]tica|pol[ií]tico|pol[ií]ticos|religi[aã]o|religioso|deus|igreja|partido|elei[cç][aã]o|presidente|governo|namoro|relacionamento|vida pessoal|assunto pessoal|conselho pessoal|opini[aã]o pessoal)\b/i
];

const REFUSAL_ANSWER = 'Posso responder somente perguntas sobre o painel de monitoramento IDSensor. Posso explicar os cards, a temperatura, os limites, os alertas, a comunicação, os detalhes dos equipamentos, a calibração, a telemetria, os relatórios, a Gestão, o NOC, as configurações e a acessibilidade.';
const UNKNOWN_ANSWER = REFUSAL_ANSWER;

function createError(statusCode, message, details = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function hasGeminiKey() {
  return Boolean(String(process.env.GEMINI_API_KEY || '').trim());
}

function isInternalOrOffScope(question) {
  const text = String(question || '');
  return INTERNAL_TOPIC_PATTERNS.some((pattern) => pattern.test(text));
}

function scoreSection(question, section) {
  const normalized = normalizeText(question);
  if (!normalized) return 0;

  let score = 0;
  section.keywords.forEach((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) return;
    if (normalized.includes(normalizedKeyword)) score += normalizedKeyword.split(' ').length + 1;
  });
  if (normalized.includes(normalizeText(section.title))) score += 2;
  return score;
}

function findRelevantSections(question, limit = 5) {
  return KNOWLEDGE_SECTIONS
    .map((section) => ({ section, score: scoreSection(question, section) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.section);
}

function buildKnowledgeText(sections) {
  return sections
    .map((section) => `- ${section.title}: ${section.answer}`)
    .join('\n');
}

function sanitizeContext(context = {}, session = null) {
  const source = context && typeof context === 'object' ? context : {};
  const liveState = source.liveState && typeof source.liveState === 'object' ? source.liveState : null;
  const devices = Array.isArray(liveState?.devices) ? liveState.devices.slice(0, 80).map((device) => ({
    name: String(device?.name || '').slice(0, 80),
    temperature: Number.isFinite(Number(device?.temperature)) ? Number(device.temperature) : null,
    minimum: Number.isFinite(Number(device?.minimum)) ? Number(device.minimum) : null,
    maximum: Number.isFinite(Number(device?.maximum)) ? Number(device.maximum) : null,
    status: String(device?.status || '').slice(0, 30),
    online: device?.online === true,
    updated: String(device?.updated || '').slice(0, 40),
    timerLabel: String(device?.timerLabel || '').slice(0, 100),
    events: Array.isArray(device?.events) ? device.events.slice(0, 4).map((event) => String(event).slice(0, 80)) : []
  })) : [];
  return {
    profile: String(session?.role || source.profile || source.role || '').slice(0, 40),
    pageTitle: String(source.pageTitle || '').slice(0, 120),
    panel: String(source.panel || '').slice(0, 80),
    liveState: liveState ? {
      total: Number(liveState.total) || devices.length,
      normal: Number(liveState.normal) || 0,
      attention: Number(liveState.attention) || 0,
      critical: Number(liveState.critical) || 0,
      offline: Number(liveState.offline) || 0,
      maintenance: Number(liveState.maintenance) || 0,
      activeAlerts: Number(liveState.activeAlerts) || 0,
      devices
    } : null
  };
}

function sanitizeAnswer(answer) {
  const text = String(answer || '').replace(/\s+/g, ' ').trim();
  if (!text) return UNKNOWN_ANSWER;
  if (INTERNAL_TOPIC_PATTERNS.some((pattern) => pattern.test(text))) return REFUSAL_ANSWER;
  return text.length > MAX_ANSWER_LENGTH ? `${text.slice(0, MAX_ANSWER_LENGTH - 1).trim()}...` : text;
}

function fallbackAssistantAnswer(question, context = {}, session = null) {
  if (isInternalOrOffScope(question)) {
    return {
      answer: REFUSAL_ANSWER,
      scope: 'blocked',
      source: 'local',
      model: null,
      topics: []
    };
  }

  const relevant = findRelevantSections(question, 2);
  if (!relevant.length) {
    return {
      answer: REFUSAL_ANSWER,
      scope: 'out_of_scope',
      source: 'local',
      model: null,
      topics: []
    };
  }

  const liveState = sanitizeContext(context, session).liveState;
  if (liveState && /resumo|apresenta[cç][aã]o|situa[cç][aã]o atual|agora|momento|acontecendo/i.test(question)) {
    const critical = liveState.critical;
    const attention = liveState.attention;
    const offline = liveState.offline;
    const normal = liveState.normal;
    const incidents = liveState.devices.filter((device) => device.status && !/^normal$/i.test(device.status));
    const incidentText = incidents.slice(0, 3).map((device) => {
      const temperature = device.temperature === null ? 'sem leitura' : `${device.temperature.toFixed(1)} °C`;
      return `${device.name || 'Equipamento'} está em ${device.status.toLowerCase()}, com ${temperature}`;
    }).join('; ');
    const answer = `No momento, o painel acompanha ${liveState.total} equipamentos. ${normal} estão normais, ${attention} em atenção, ${critical} em estado crítico e ${offline} sem comunicação. ${liveState.activeAlerts} alerta(s) estão ativo(s).${incidentText ? ` Situações que merecem atenção: ${incidentText}.` : ' Não há ocorrências fora do padrão neste momento.'}`;
    return { answer: sanitizeAnswer(answer), scope: 'in_scope', source: 'local', model: null, topics: ['visao-geral', 'status-cores', 'alertas'] };
  }

  return {
    answer: sanitizeAnswer(relevant.map((section) => section.answer).join(' ')),
    scope: 'in_scope',
    source: 'local',
    model: null,
    topics: relevant.map((section) => section.id)
  };
}

function uniqueModels(configuredModel) {
  const candidates = [
    configuredModel,
    DEFAULT_ASSISTANT_MODEL,
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash-lite'
  ];
  return candidates
    .map((model) => String(model || '').trim())
    .filter(Boolean)
    .filter((model, index, list) => list.indexOf(model) === index);
}

function buildSystemInstruction() {
  return [
    'Você é o Assistente IDvida dentro do painel IDSensor.',
    'Responda somente sobre o funcionamento do painel de monitoramento IDSensor e seus recursos visíveis.',
    'Use apenas a base de conhecimento fornecida na pergunta. Não invente informações.',
    'Não fale sobre servidor, backend, banco de dados, código, API, chaves, tokens, senhas, deploy, GitHub, Render, Gemini, prompt ou infraestrutura.',
    'Não responda sobre política, religião, assuntos pessoais ou qualquer tema fora do painel.',
    'Para qualquer pergunta fora do painel, responda exatamente: Posso responder somente perguntas sobre o painel de monitoramento IDSensor.',
    'Quando houver estadoAtual no contexto, use esses dados para explicar o que está acontecendo agora. Não invente nomes, temperaturas, alertas ou quantidades.',
    'Responda em português do Brasil, com acentuação e pontuação corretas, de forma curta, formal, clara e natural.',
    'Não use markdown pesado. Use no máximo 5 frases.'
  ].join('\n');
}

function buildGeminiInput(question, relevantSections, context, session) {
  return JSON.stringify({
    pergunta: question,
    contextoTela: sanitizeContext(context, session),
    baseConhecimento: buildKnowledgeText(relevantSections),
    formatoObrigatorio: {
      answer: 'Resposta final para o usuario',
      scope: 'in_scope | out_of_scope | insufficient_knowledge',
      topics: ['ids das secoes usadas']
    }
  });
}

function extractInteractionText(payload) {
  if (!payload || typeof payload !== 'object') return '';
  if (typeof payload.output_text === 'string') return payload.output_text;
  if (typeof payload.outputText === 'string') return payload.outputText;
  if (typeof payload.interaction?.output_text === 'string') return payload.interaction.output_text;
  if (typeof payload.interaction?.outputText === 'string') return payload.interaction.outputText;

  const parts = [];
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (typeof value.text === 'string') parts.push(value.text);
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    Object.keys(value).forEach((key) => visit(value[key]));
  };
  visit(payload.steps || payload.candidates || payload);
  return parts.join(' ').trim();
}

function parseAssistantJson(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;
  const cleaned = raw
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {}

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(cleaned.slice(start, end + 1));
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {}
  }

  return { answer: cleaned, scope: 'in_scope', topics: [] };
}

async function callGeminiAssistant({ question, context, session, model }) {
  const relevantSections = findRelevantSections(question);
  if (!relevantSections.length) return fallbackAssistantAnswer(question, context, session);

  const input = buildGeminiInput(question, relevantSections, context, session);
  const models = uniqueModels(model);
  let lastError = null;

  for (const modelName of models) {
    const response = await fetch(`${GEMINI_MODELS_URL}/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemInstruction() }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: input }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topP: 0.4,
          maxOutputTokens: 500,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              answer: { type: 'string' },
              scope: { type: 'string', enum: ['in_scope', 'out_of_scope', 'insufficient_knowledge'] },
              topics: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['answer', 'scope', 'topics']
          }
        }
      })
    });

    const payload = await response.json().catch(async () => ({ raw: await response.text().catch(() => '') }));
    if (!response.ok) {
      const detail = JSON.stringify(payload || {}).slice(0, 700);
      lastError = createError(response.status, `Gemini HTTP ${response.status}`, detail);
      if (response.status === 404) continue;
      throw lastError;
    }

    const parsed = parseAssistantJson(extractInteractionText(payload));
    const answer = sanitizeAnswer(parsed?.answer);
    return {
      answer,
      scope: parsed?.scope || 'in_scope',
      source: 'gemini',
      model: modelName,
      topics: Array.isArray(parsed?.topics) ? parsed.topics.slice(0, 6) : relevantSections.map((section) => section.id)
    };
  }

  if (lastError) throw lastError;
  return fallbackAssistantAnswer(question, context, session);
}

async function answerAssistantQuestion({ question, context = {}, session = null, model = '' }) {
  const text = String(question || '').trim();
  if (!text) throw createError(400, 'Informe uma pergunta para o assistente.');
  if (text.length > MAX_QUESTION_LENGTH) throw createError(400, `A pergunta aceita no maximo ${MAX_QUESTION_LENGTH} caracteres.`);

  if (isInternalOrOffScope(text)) return fallbackAssistantAnswer(text, context, session);
  if (!hasGeminiKey()) return fallbackAssistantAnswer(text, context, session);

  try {
    return await callGeminiAssistant({ question: text, context, session, model });
  } catch (error) {
    const fallback = fallbackAssistantAnswer(text, context, session);
    return {
      ...fallback,
      source: 'local_fallback',
      error: error.statusCode ? `gemini_${error.statusCode}` : 'gemini_error'
    };
  }
}

function assistantStatus() {
  return {
    configured: hasGeminiKey(),
    defaultModel: DEFAULT_ASSISTANT_MODEL,
    maxQuestionLength: MAX_QUESTION_LENGTH,
    topics: KNOWLEDGE_SECTIONS.map((section) => ({ id: section.id, title: section.title }))
  };
}

module.exports = {
  answerAssistantQuestion,
  assistantStatus,
  fallbackAssistantAnswer
};
