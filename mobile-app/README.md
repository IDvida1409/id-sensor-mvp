# IDsensor Mobile

App Expo/React Native para testar o fluxo mobile do MVP IDsensor.

## Backend

O app esta apontando para:

```text
https://id-sensor-mvp.onrender.com
```

## Rodar no Expo Go

Na raiz do projeto:

```powershell
npm run mobile:start
```

Ou diretamente:

```powershell
cd mobile-app
corepack pnpm install --ignore-scripts
.\node_modules\.bin\expo.cmd start --tunnel
```

Depois, abra o Expo Go no celular e escaneie o QR Code do Expo.

## Codigo de ativacao

Use:

```text
APP-DEMO-11
```

## Telas implementadas

- Ativacao de celular por codigo.
- Inicio com cliente, unidade, resumo, criticos e ultimos alertas.
- Alertas com detalhe e botao `Estou ciente`.
- Scanner de QR Code/codigo de equipamento.
- Configuracoes locais de alerta.
- Cards mobile no mesmo padrao visual do painel.

## QR Code de equipamento

O QR Code de equipamento pode ser lido fora do app ou dentro do app.

Exemplo publico:

```text
https://id-sensor-mvp.onrender.com/q/DEV-GELADEIRA-02
```

Dentro do app, a tela `Escanear` aceita esse link completo ou apenas:

```text
DEV-GELADEIRA-02
```

## Codigos de equipamento para teste

```text
DEV-GELADEIRA-01
DEV-GELADEIRA-02
DEV-GELADEIRA-03
```
