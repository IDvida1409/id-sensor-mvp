# 02 - Arquitetura

## Visao geral

O MVP tera quatro partes evolutivas:

- Backend Node.js com API REST e SQLite.
- Painel web original servido por HTTP.
- Simulacao central no backend, acionada pelo botao redondo da topbar do painel.
- App mobile React Native com Expo.

## Backend

O backend e a fonte de verdade do MVP. Ele guarda:

- clientes;
- unidades;
- dispositivos;
- codigos de ativacao;
- celulares habilitados;
- alertas;
- aceites;
- logs de notificacao.
- estado da simulacao.

Nesta primeira base local, a API foi escrita sem dependencias externas para contornar o `npm` local silencioso e permitir teste imediato. O contrato HTTP foi mantido simples para migrar para Express sem alterar app/painel.

## Banco SQLite

No Windows, a base local fica em `%LOCALAPPDATA%/IDSensorMVP/id_sensor_mvp.db`.

Motivo: o SQLite apresentou erro de I/O ao gravar dentro da pasta sincronizada pelo OneDrive. AppData e um local mais seguro para arquivo de runtime local.

## Painel web original

O painel enviado em HTML, CSS e JavaScript fica em `painel-original`. Nesta etapa ele foi mantido como referencia visual e servido por HTTP em `http://localhost:8080/`.

O objetivo desta fase nao e redesenhar o painel. O painel abre por link local, usa o backend como fonte de verdade quando a API esta online e tem apenas um controle compacto de simulacao na topbar.

O painel faz polling de `GET /devices` e atualiza o array legado `devices`. Como o NOC atual calcula ocorrencias a partir desse mesmo array, painel e NOC passam a refletir o mesmo estado vindo do backend.

Se o backend estiver desligado, o painel preserva fallback com os dados mockados originais para nao abrir vazio.

## Simulacao e NOC

A simulacao fica no backend e controla:

- liga/desliga;
- passo atual;
- mudanca de status dos 24 dispositivos;
- criacao de alertas ativos;
- ocorrencias usadas pelo NOC.

Enquanto a simulacao estiver ligada, chamadas a `GET /devices` avancam o ciclo quando o tempo do estagio vence. Isso permite que qualquer painel aberto pelo mesmo link veja o mesmo estado.

O NOC tambem tem endpoint proprio em `GET /noc/occurrences/live`, mas o painel atual ainda consegue refletir as ocorrencias porque usa o mesmo array `devices` atualizado pelo backend.

O botao de simulacao fica na topbar, antes de `Gestao`, e chama somente endpoints do backend.

## App mobile

O app ID Sensor sera criado com Expo para teste rapido em Android e iPhone. Ele vai:

- ativar com codigo ou QR Code;
- registrar Expo Push Token no backend;
- receber push;
- listar alertas;
- registrar `Estou ciente`;
- escanear QR Code de dispositivo dentro do app;
- renderizar o card equivalente ao card do painel.

## Backend online

Para testar com cliente em outro local, o backend precisa ficar publico na internet.

Opcao recomendada para a reuniao: Render ou Railway, porque fornece URL publica mais estavel que ngrok.
