# 05 - Mobile

O app mobile sera criado em React Native com Expo.

## Nome

O nome correto e `ID Sensor`.

Nao usar outros nomes, como IDBipe ou IDCistor Alert.

## Fluxos

### Ativacao

1. App abre.
2. Se nao estiver ativado, mostra campo de codigo e, quando aprovado, opcao de leitura de QR Code.
3. App pede permissao de notificacao.
4. App coleta Expo Push Token.
5. App chama `/activate`.
6. App salva `app_device_id` localmente.

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
