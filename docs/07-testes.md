# 07 - Testes

## Teste local do painel original

Comando usado para subir o painel:

```bash
npm run serve:panel
```

URL validada:

```text
http://localhost:8080/
```

Validado nesta etapa:

- `GET /` retornou status `200`;
- `GET /styles.css` retornou CSS;
- `GET /script.js` retornou JavaScript;
- `node -c painel-original/script.js` passou sem erro de sintaxe;
- foi adicionado polling para `GET /devices`;
- quando o backend estiver online, o array legado `devices` passa a ser atualizado pelo backend;
- como o NOC usa o mesmo array, ele passa a refletir a mesma fonte de verdade.
- o botao visual de simulacao foi ajustado para formato redondo, somente com icone, antes de `Gestao`;
- apos revisao visual, o botao foi reduzido para 42px e recebeu sombra mais discreta;
- o clique agora chama o backend: `POST /simulation/start` e `POST /simulation/stop`;
- o painel força uma nova leitura de `GET /devices` apos ligar/desligar;
- quando o NOC esta aberto, ele e atualizado a partir dos mesmos dispositivos carregados por `/devices`;
- alertas sonoros usam os sinos dos cards quando surgem estados `warn`, `crit` ou `offline`.
- em 2026-06-04 23:10, `GET /`, `GET /styles.css`, `GET /script.js` e `node -c painel-original/script.js` passaram.
- em 2026-06-05, `GET /` e `GET /script.js` em `http://localhost:8080` retornaram `200`.

## Teste local do backend

Comando usado nesta sessao para subir o backend:

```powershell
node src/server.js
```

Nesta maquina, o processo foi iniciado fora do sandbox para permitir escrita no banco em:

```text
%LOCALAPPDATA%/IDSensorMVP/id_sensor_mvp.db
```

Processo atual validado:

```text
PID 15768
```

Rotas validadas:

- `POST /seed` criou 24 dispositivos;
- `GET /devices` retornou 24 cards normais/azuis apos seed;
- `POST /simulation/start` ligou a simulacao sem criar ocorrencia imediata;
- `POST /simulation/tick` avancou manualmente para o estagio de atencao/offline;
- segundo `POST /simulation/tick` avancou manualmente para o estagio critico;
- `GET /noc/occurrences/live?mode=area&filters=all` refletiu as mesmas 10 ocorrencias para o NOC;
- `POST /simulation/stop` desligou a simulacao e voltou os 24 dispositivos para normal/azul.

Resultado do teste automatizado:

```json
{
  "seed_devices": 24,
  "after_seed": { "blue": 24 },
  "after_start": { "blue": 24 },
  "after_tick1": { "blue": 14, "warn": 8, "offline": 2 },
  "after_tick2": { "blue": 14, "warn": 5, "crit": 3, "offline": 2 },
  "critical_temperatures": [
    { "id": 6, "temp": 14.0 },
    { "id": 12, "temp": -4.0 },
    { "id": 20, "temp": 14.0 }
  ],
  "noc_total": 10,
  "after_stop": { "blue": 24 }
}
```

Pontos conferidos na resposta do backend:

- textos principais corretos em JSON;
- temperaturas com graus Celsius;
- contrato visual do card com `visualContract.source = panel-card-v1`;
- QR Code de dispositivo com payload interno `idsensor://device/DEV-GELADEIRA-02`;
- sem `web_url`, `data_url` ou `image_url` na resposta de QR de dispositivo.

Fluxo de backend ainda a completar:

1. Conectar push real no app.
2. Registrar aceite em `/alerts/:id/acknowledge` pelo app.

## Teste de link publico temporario

URL temporaria validada nesta sessao:

```text
https://seat-ata-begin-hunting.trycloudflare.com
```

Validado:

- `GET /health` pela URL publica retornou `200`;
- `GET /devices` pela URL publica retornou 24 cards azuis com simulacao desligada;
- cliente A ligou a simulacao por `POST /simulation/start`;
- cliente B leu `GET /devices` no mesmo link publico e enxergou o mesmo backend;
- apos 125 segundos, `GET /devices` retornou 8 cards em atencao e 2 dispositivos sem comunicacao;
- no mesmo momento, `GET /noc/occurrences/live?mode=area&filters=all` retornou `total: 10`;
- `POST /simulation/stop` voltou os 24 cards para normal/azul.

## Teste futuro em celular real

1. Subir backend online.
2. Configurar app com a URL online.
3. Abrir app no Expo Go ou build de teste.
4. Ativar celular com codigo autorizado.
5. Disparar evento de simulacao pelo botao redondo da topbar do painel.
6. Confirmar push no celular.
7. Tocar em `Estou ciente`.
8. Conferir registro de aceite no backend/painel.
9. Escanear QR Code de dispositivo dentro do app.
10. Conferir se o app renderiza o card equivalente ao painel.

## Limitacoes atuais

- O painel ainda tem fallback com dados mockados caso o backend esteja desligado.
- O backend online ainda nao foi configurado.
- O app mobile ainda nao foi criado.
- O controle de simulacao esta conectado ao backend local.
- SMS/e-mail nao fazem parte do MVP desta fase.
