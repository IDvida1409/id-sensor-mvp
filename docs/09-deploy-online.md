# 09 - Deploy online

## Objetivo

Subir o painel e o backend juntos em uma URL publica fixa.

O backend serve:

- painel em `GET /`;
- API em `/devices`, `/simulation/*`, `/noc/*` e demais rotas.

Assim, qualquer computador que abrir a mesma URL enxerga o mesmo estado da simulacao.

## Contas necessarias

Para o caminho mais rapido:

- GitHub: guardar o codigo do projeto.
- Render: hospedar o backend/painel em URL publica.

Para o app:

- Expo: testar e gerar builds do app.
- Apple Developer: apenas se for publicar na App Store.
- Google Play Console: apenas se for publicar na Play Store.

## Arquivos preparados

- `package.json`: possui `npm start`.
- `render.yaml`: blueprint inicial para Render.
- `backend/src/server.js`: cria dados demo automaticamente se o banco estiver vazio.
- `backend/src/app.js`: serve o painel original pelo proprio backend.

## Deploy gratuito no Render

Esse caminho serve para apresentacao e teste rapido.

1. Criar conta no GitHub.
2. Criar um repositorio, por exemplo `id-sensor-mvp`.
3. Enviar esta pasta para o GitHub.
4. Criar conta no Render.
5. No Render, clicar em `New` > `Web Service`.
6. Conectar o repositorio do GitHub.
7. Configurar:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
```

8. Variaveis recomendadas:

```text
NODE_VERSION=24.14.1
AUTO_SEED_DEMO_DATA=true
EXPO_PUSH_ENABLED=false
```

9. Depois do deploy, abrir a URL gerada pelo Render.

## Limitacao do plano gratuito

No Render gratuito, o sistema de arquivos e efemero. Isso significa:

- o SQLite local pode ser perdido quando o servico reiniciar, dormir ou redeployar;
- o seed automatico recria os 24 cards quando o banco estiver vazio;
- a simulacao compartilhada funciona enquanto o servico estiver ativo.

Para demonstracao, isso e suficiente.

Para operacao real, usar uma das opcoes:

1. Plano pago com disco persistente e `DATABASE_PATH=/var/data/id_sensor_mvp.db`.
2. Migrar o backend para Postgres gerenciado.

## Checklist de aceite

Depois do deploy:

1. Abrir `/health` e confirmar `ok: true`.
2. Abrir `/` e confirmar que o painel aparece.
3. Abrir `/devices` e confirmar 24 cards.
4. Ligar a simulacao em um computador.
5. Abrir a mesma URL em outro computador.
6. Aguardar 2 minutos.
7. Confirmar cards em atencao/offline nos dois computadores.
8. Abrir NOC e confirmar as mesmas ocorrencias.
