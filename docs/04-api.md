# 04 - API

Base local inicial:

```text
http://localhost:4000
```

O backend tambem serve o painel original em:

```text
GET /
GET /styles.css
GET /script.js
```

Isso permite publicar apenas a porta `4000` em um link publico. O navegador carrega o painel e chama a API pela mesma origem do link.

## Saude

### GET `/health`

Resposta:

```json
{
  "ok": true,
  "data": {
    "status": "online",
    "datetime": "2026-06-04T12:00:00.000Z",
    "version": "0.1.0"
  }
}
```

## Seed

### POST `/seed`

Cria cliente, unidade, 24 dispositivos do Banco de Sangue e codigo demo `APP-DEMO-11`.

## Dispositivos

### GET `/devices`

Retorna os 24 cards de dispositivos no contrato visual do painel.

Quando a simulacao esta ligada, esta rota tambem pode avancar o ciclo de simulacao caso o intervalo configurado ja tenha vencido. Isso mantem painel e NOC usando o mesmo estado.

### GET `/devices/:id`

Retorna um dispositivo.

### GET `/devices/by-code/:codigo`

Usado pelo app apos escanear QR Code e tambem pela pagina web publica do QR.

A rota aceita:

- codigo puro: `DEV-GELADEIRA-02`;
- link publico: `https://id-sensor-mvp.onrender.com/q/DEV-GELADEIRA-02`.

Exemplo parcial:

```json
{
  "ok": true,
  "data": {
    "card": {
      "id": "disp_geladeira_02",
      "name": "Geladeira 02",
      "temp": 8.6,
      "tempLabel": "8.6°C",
      "status": "ATENÇÃO",
      "state": "warn",
      "events": [
        "Fora da faixa permitida",
        "Aguardando ciência pelo aplicativo"
      ],
      "visualContract": {
        "cardClass": "card warn",
        "source": "panel-card-v1"
      }
    },
    "qr": {
      "code": "DEV-GELADEIRA-02",
      "payload": "https://id-sensor-mvp.onrender.com/q/DEV-GELADEIRA-02"
    }
  }
}
```

### GET `/q/:codigo`

Pagina publica do equipamento para abrir direto no navegador, sem instalar app.

Exemplo:

```text
GET /q/DEV-GELADEIRA-02
```

A pagina renderiza o card do equipamento no mesmo padrao visual do painel e atualiza os dados a cada 60 segundos.

### GET `/a/:codigo`

Pagina publica de apoio para QR de ativacao do app.

Exemplo:

```text
GET /a/APP-DEMO-11
```

Mostra o codigo de ativacao e os dados do cliente/unidade vinculados.

### POST `/devices/:id/update-status`

Request:

```json
{
  "temperatura_atual": 9.2,
  "status": "critico",
  "ultima_comunicacao": "agora"
}
```

## Simulacao

### GET `/simulation/status`

Retorna se a simulacao esta ligada, passo atual, estagio e tempos configurados.

Campos principais:

- `enabled`: simulacao ligada/desligada;
- `stage`: `0` aguardando, `1` atencao/offline, `2` critico;
- `stage_label`: `aguardando`, `atencao` ou `critico`;
- `first_event_after_ms`: `120000`;
- `critical_event_after_ms`: `240000`;
- `next_event_in_ms`: tempo restante ate o proximo estagio.

### POST `/simulation/start`

Liga a simulacao e reseta os 24 dispositivos para normal/azul.

Importante: esta rota nao cria eventos imediatamente. Os eventos aparecem quando `/devices` ou `/simulation/status` avancam o tempo:

- ate 2 minutos: 24 normais;
- apos 2 minutos: 8 em atencao e 2 offline;
- apos 4 minutos: 5 em atencao, 3 criticos e 2 offline.

### POST `/simulation/stop`

Desliga a simulacao, volta os 24 dispositivos para normal/azul e encerra alertas de simulacao ativos.

### POST `/simulation/tick`

Executa manualmente o proximo estagio de simulacao. Util para teste sem aguardar 2 ou 4 minutos.

## NOC

### GET `/noc/occurrences/live`

Consulta ocorrencias NOC derivadas dos mesmos dispositivos de `/devices`.

Query params:

- `mode`: `area`, `client` ou `device`;
- `filters`: lista separada por virgula. Exemplo: `all`, `offline`, `near_limit`, `out_of_range`, `battery`.

Exemplo:

```text
GET /noc/occurrences/live?mode=area&filters=all
```

Resposta parcial:

```json
{
  "ok": true,
  "data": {
    "mode": "area",
    "filters": ["all"],
    "total": 10,
    "cards": [
      {
        "title": "Banco de Sangue",
        "count": 10,
        "visibleIds": [3, 4, 6, 8, 11, 12, 14, 15, 17, 20]
      }
    ]
  }
}
```

## Ativacao

### POST `/activation-code`

Request:

```json
{
  "cliente_id": "cliente_idvida",
  "unidade_id": "unidade_banco_sangue",
  "tipo_ativacao": "app_alerta"
}
```

Observacao: a rota de ativacao gera um payload HTTPS. O QR pode ser aberto pelo navegador para apoio visual ou lido dentro do app para extrair o codigo.

### POST `/activate`

Request:

```json
{
  "codigo": "APP-DEMO-11",
  "expo_push_token": "ExpoPushToken[...]",
  "plataforma": "ios",
  "modelo_aparelho": "iPhone do cliente"
}
```

## Alertas

### POST `/alerts`

Cria alerta manual e tenta enviar push para celulares habilitados.

Request:

```json
{
  "dispositivo_id": "disp_geladeira_02",
  "tipo_alerta": "temperatura_alta",
  "mensagem": "Geladeira 02 fora da temperatura.",
  "temperatura_atual": 9.2,
  "severidade": "critica"
}
```

### GET `/alerts/active`

Lista alertas ativos.

### GET `/alerts/history`

Lista historico.

### GET `/app/alerts/:app_device_id`

Lista alertas daquele celular.

### POST `/alerts/:id/acknowledge`

Request:

```json
{
  "app_device_id": "appdev_..."
}
```

Retorno esperado:

```json
{
  "ok": true,
  "data": {
    "success": true,
    "alert": {
      "status": "reconhecido",
      "reconhecido_em": "2026-06-04T16:01:44.680Z"
    }
  }
}
```

### POST `/alerts/:id/close`

Encerra alerta.
