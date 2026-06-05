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

Depois, abra o Expo Go no celular e escaneie o QR Code.

## Codigo de ativacao

Use:

```text
APP-DEMO-11
```

## Fluxos implementados

- Ativacao de celular por codigo.
- Home com cliente, unidade e area.
- Criticos agora.
- Ultimos alertas.
- Favoritos com ate 5 equipamentos em carrossel.
- Scanner de QR Code/codigo de equipamento.
- Configuracoes locais de alerta.
- Cards mobile no mesmo padrao visual do painel.

## Codigos de equipamento para teste

```text
DEV-GELADEIRA-01
DEV-GELADEIRA-02
DEV-GELADEIRA-03
```
