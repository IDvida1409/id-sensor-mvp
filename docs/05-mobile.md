# 05 - Mobile

O app mobile foi iniciado em React Native com Expo, na pasta:

```text
mobile-app
```

## Nome

O nome correto no app e `IDsensor`.

Nao usar outros nomes, como IDBipe ou IDCistor Alert.

## Identidade visual

- Topo/tela inicial com logo completo IDsensor.
- Icone do app com o simbolo `S` do IDsensor.
- Rodape com `Powered by IDvida`.
- Cards com a mesma linguagem visual do painel:
  - azul para normal;
  - laranja para atencao;
  - vermelho para critico ou sem comunicacao.

## Fluxos

### Ativacao

1. App abre.
2. Se nao estiver ativado, mostra campo de codigo.
3. App chama `/activate`.
4. App recebe `app_device_id`, cliente e unidade.
5. App mostra home com area, alertas, favoritos, scanner e configuracoes.

Codigo demo:

```text
APP-DEMO-11
```

### Push

1. Backend cria alerta.
2. Backend envia push via Expo.
3. Usuario toca na notificacao.
4. App abre detalhe do alerta.
5. Usuario toca em `Estou ciente`.
6. App chama `/alerts/:id/acknowledge`.

### QR Code de dispositivo

1. App escaneia QR Code.
2. App extrai codigo.
3. App chama `/devices/by-code/:codigo`.
4. App renderiza o card equivalente ao card do painel.

O QR Code nao abre um site. A leitura acontece dentro do app, que busca os dados atualizados no backend.

## Card mobile

O app nao deve inventar outro card. Ele deve consumir o contrato retornado pelo backend e reproduzir:

- nome do dispositivo;
- local;
- temperatura;
- faixa permitida;
- status;
- comunicacao;
- bateria;
- umidade, quando houver;
- hierarquia visual e cores do painel.

## Favoritos

O app permite ate 5 equipamentos favoritos em carrossel horizontal.

A tela atualiza a cada 60 segundos quando a configuracao local de atualizacao automatica esta ligada.

## Rodar no celular

Instalar Expo Go no celular.

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

Escanear o QR Code exibido pelo Expo com o aplicativo Expo Go.
