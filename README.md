# ID Sensor MVP

MVP de demonstracao do ID Sensor com backend, painel web original, app mobile futuro e documentacao.

O painel HTML original abre pelo backend ou por um servidor local, preservando visual e estrutura. O painel consome `GET /devices` quando a API esta online, mantendo fallback para os dados mockados originais. A simulacao de eventos fica centralizada no backend e o botao redondo da topbar ja chama `POST /simulation/start` e `POST /simulation/stop`.

## Estrutura

- `painel-original`: painel HTML/CSS/JS enviado como referencia visual.
- `tools/serve-panel.js`: servidor estatico simples para abrir o painel localmente.
- `tools/start-public-tunnel.ps1`: abre um link publico temporario para o backend local.
- `backend`: API local inicial em Node.js com SQLite.
- `mobile-app`: sera criado na etapa do app Expo.
- `docs`: documentacao obrigatoria do projeto.

## Abrir painel original

```bash
cd id-sensor-mvp
npm run serve:panel
```

Depois acesse:

```text
http://localhost:8080/
```

Para apresentacao em link unico, prefira abrir pelo proprio backend:

```text
http://localhost:4000/
```

Assim o HTML, o JavaScript e a API ficam na mesma origem. Em um link publico, todos os computadores acessam o mesmo backend e veem a mesma simulacao.

## Backend local

```bash
cd id-sensor-mvp/backend
cp .env.example .env
npm run dev
```

Depois, em outro terminal:

```bash
curl -X POST http://localhost:4000/seed
curl http://localhost:4000/devices
curl -X POST http://localhost:4000/simulation/start
curl "http://localhost:4000/noc/occurrences/live?mode=area&filters=all"
```

No Windows PowerShell, use:

```powershell
Invoke-RestMethod -Method Post http://localhost:4000/seed
Invoke-RestMethod http://localhost:4000/devices
Invoke-RestMethod -Method Post http://localhost:4000/simulation/start
Invoke-RestMethod "http://localhost:4000/noc/occurrences/live?mode=area&filters=all"
```

## Link publico temporario

Com o backend rodando na porta `4000`, o painel pode ser publicado temporariamente com Cloudflare Tunnel:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\start-public-tunnel.ps1
```

O comando mostra uma URL `https://...trycloudflare.com`. Essa URL deve ser enviada para os outros computadores; o botao de simulacao passa a controlar o mesmo backend para todos.

## Deploy online

O projeto esta preparado para subir como um unico servico Node:

```bash
npm start
```

Arquivos de apoio:

- `render.yaml`: blueprint inicial para Render.
- `docs/09-deploy-online.md`: passo a passo de GitHub/Render e checklist de aceite.

No Render gratuito, o SQLite local e efemero. Para demonstracao isso funciona porque o backend recria os 24 cards automaticamente se o banco estiver vazio. Para operacao real, usar disco persistente em plano pago ou migrar para Postgres.

## App mobile Expo

O app mobile inicial fica em:

```text
mobile-app
```

Para testar no celular com Expo Go:

```powershell
npm run mobile:start
```

Codigo de ativacao demo:

```text
APP-DEMO-11
```

O app aponta para o backend fixo:

```text
https://id-sensor-mvp.onrender.com
```

## Regra do QR Code

O QR Code de dispositivo e hibrido:

1. Se abrir pela camera normal do celular, abre uma pagina web publica do equipamento.
2. Se for lido dentro do app IDsensor, o app extrai o codigo e renderiza o card no aplicativo.

Exemplo:

```text
https://id-sensor-mvp.onrender.com/q/DEV-GELADEIRA-02
```

## Observacao sobre Node nesta maquina

Durante a primeira validacao, os comandos `node` e `npm` do sistema nao retornaram versao. Para validar localmente nesta sessao foi usado o Node empacotado do Codex. Em ambiente normal, instale Node.js LTS.
