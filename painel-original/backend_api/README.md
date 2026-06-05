# Backend API Starter - Painel IoT

Backend inicial para substituir os mocks do painel e habilitar integração real de frontend.

## Requisitos
- Node.js 18+

## Como executar
```bash
cd handoff_tecnico/backend_api
npm install
npm start
```

Servidor padrão: `http://localhost:4000`

## Endpoints principais
- `GET /api/v1/health`
- `GET /api/v1/session/me`
- `GET /api/v1/permissions`
- `GET /api/v1/clients`
- `GET /api/v1/units`
- `GET /api/v1/areas`
- `GET /api/v1/devices`
- `GET /api/v1/devices/:deviceId`
- `GET /api/v1/devices/:deviceId/telemetry`
- `POST /api/v1/devices/:deviceId/status-cycle`
- `POST /api/v1/devices/:deviceId/status-cycle/close`
- `GET /api/v1/devices/:deviceId/status-cycle`
- `GET /api/v1/management/health`
- `GET /api/v1/management/contracts`
- `GET /api/v1/management/operational-status`
- `GET /api/v1/management/drill/:type`
- `POST /api/v1/noc/sessions`
- `GET /api/v1/noc/sessions/:sessionId/occurrences`
- `GET /api/v1/noc/occurrences/live`
- `POST /api/v1/noc/sessions/:sessionId/ack`
- `GET /api/v1/devices/:deviceId/audit`
- `POST /api/v1/audit/events`
- `GET /api/v1/config/certificates`
- `PATCH /api/v1/config/areas/:areaId/certificates`
- `PATCH /api/v1/config/devices/:deviceId/certificates`
- `POST /api/v1/config/devices/:deviceId/certificate-file`
- `POST /api/v1/service-orders`
- `GET /api/v1/service-orders`

## Observações
- Persistência atual em memória (starter técnico).
- Estrutura preparada para evoluir para banco relacional sem quebrar contratos HTTP.
- Dados seed já incluem cenários de NOC, bateria/fonte, manutenção e status temporário.
