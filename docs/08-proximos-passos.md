# 08 - Proximos Passos

## Ordem combinada

1. Manter o painel original abrindo por link/servidor.
2. Preparar a separacao entre painel e backend. Concluido na base local: o painel consome `GET /devices` quando o backend esta online.
3. Implementar a simulacao de evento no backend. Concluido na base local: `POST /simulation/start`, `POST /simulation/stop`, `POST /simulation/tick` e NOC backend.
4. Conectar o controle visual de simulacao ao backend. Concluido na base local: botao redondo antes de `Gestao`.
5. Validar link publico temporario com mais de um computador. Concluido com Cloudflare Tunnel.
6. Criar contas GitHub e Render.
7. Publicar backend/painel em URL fixa.
8. Validar simulacao e NOC na URL fixa.
9. Criar fluxo de gestao para cadastrar dispositivo e smartphone.
10. Criar app mobile ID Sensor.
11. Configurar push notification.
12. Implementar leitura de QR Code dentro do app.
13. Documentar handoff para o desenvolvedor do painel oficial.

## Integracao futura com sistema oficial

O desenvolvedor do painel oficial deve integrar o sistema real respeitando o contrato:

- dispositivo;
- status;
- temperatura;
- alerta;
- push;
- aceite;
- historico;
- QR Code lido dentro do app;
- card mobile equivalente ao card do painel.

## Regras futuras de escalonamento

- Push no app deve ser o primeiro canal.
- Se houver aceite dentro do prazo, SMS/e-mail podem ser evitados.
- Se nao houver aceite, o sistema oficial pode escalar.
- Relatorios devem registrar envio, recebimento, aceite e tempo de resposta.

## Limitacoes do MVP

- Sem dispositivo real nesta fase.
- Dados atuais ainda sao simulados.
- O painel ja consome backend local para listar dispositivos, mas ainda preserva fallback mockado.
- A simulacao ja esta centralizada no backend e acionada pelo botao visual do painel.
- O backend ja serve o painel e a API na mesma origem.
- O deploy gratuito com SQLite e suficiente para demonstracao, mas nao para persistencia real.
- O app ainda nao foi criado.
- SMS/e-mail ficam fora do escopo inicial.
