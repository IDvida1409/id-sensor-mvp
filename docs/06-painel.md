# 06 - Painel

## Estado atual

O painel original continua em:

```text
painel-original
```

Ele e servido localmente por:

```bash
npm run serve:panel
```

URL:

```text
http://localhost:8080/
```

Para demonstracao com link unico, o mesmo painel tambem e servido pelo backend:

```text
http://localhost:4000/
```

Quando publicado por tunel ou servidor online, use a URL publica do backend. O painel detecta essa origem automaticamente e chama a API no mesmo dominio.

## Fonte dos dados

O painel preserva os 24 cards e a linguagem visual original.

Quando o backend esta online, o painel chama:

```text
GET http://localhost:4000/devices
```

Quando aberto por `http://localhost:4000/` ou por `https://...trycloudflare.com/`, o painel troca para:

```text
GET /devices
```

na mesma origem do navegador. Assim dois computadores acessando o mesmo link publico enxergam o mesmo estado de simulacao.

Os dados retornados substituem o array legado `devices` sem redesenhar o card. O NOC atual usa esse mesmo array para calcular ocorrencias, entao painel e NOC passam a refletir a mesma fonte de verdade.

Se o backend estiver desligado, o painel mantem fallback com os dados mockados originais.

## Simulacao

O painel recebeu um botao visual de simulacao ao lado esquerdo de `Gestao`.

Estado atual do botao:

- redondo, apenas com icone de ligar/desligar;
- compacto, com 42px para ficar proporcional aos botoes da topbar;
- vermelho quando desligado;
- verde quando ligado;
- chama `POST /simulation/start` ao ligar;
- chama `POST /simulation/stop` ao desligar;
- consulta `GET /simulation/status` para sincronizar o estado visual;
- forca nova leitura de `GET /devices` apos ligar/desligar.

Regras do ciclo implementado:

- ao ligar, os 24 cards ficam normais/azuis;
- depois de 2 minutos, entram 8 cards em atencao e 2 ficam sem comunicacao;
- depois de 4 minutos, 3 dos cards em atencao viram criticos e 5 continuam em atencao;
- critico alto fica em `14.0°C` e critico baixo fica em `-4.0°C`;
- ao desligar, todos os 24 cards voltam para normal/azul.

A regra de negocio fica no backend. O painel apenas aciona o backend e renderiza o retorno.

## Regra do NOC

O NOC nao deve ter uma simulacao propria separada.

Fluxo correto:

1. Backend altera estado dos dispositivos.
2. Painel atualiza os cards por `/devices`.
3. NOC calcula ocorrencias a partir dos mesmos dispositivos.
4. Opcionalmente, o NOC pode chamar `/noc/occurrences/live` para receber as ocorrencias prontas do backend.
5. Se o NOC estiver aberto, o painel atualiza a tela NOC quando o polling recebe novos estados.

## Alertas sonoros

O painel ja possui alerta sonoro ligado aos sinos dos cards. Quando o backend passa um card para `warn`, `crit` ou `offline`, o render do painel mostra o sino e dispara a sequencia sonora se o painel nao estiver silenciado.
