# API Contract - Painel IoT Backend Starter

## Base URL
`http://localhost:4000/api/v1`

## Convenção de resposta
```json
{
  "status": "ok",
  "data": {}
}
```

Erros:
```json
{
  "status": "error",
  "message": "..."
}
```

## 1. Sessão e permissões
### GET `/session/me`
Retorna perfil atual para controle de visibilidade no frontend.

### GET `/permissions`
Retorna matriz de permissões por papel.

## 2. Organização
### GET `/clients`
### GET `/units?clientId=h1`
### GET `/areas?unitId=unit-h1&clientId=h1`

## 3. Dispositivos
### GET `/devices`
Parâmetros suportados:
- `areaId`
- `status`
- `search`
- `clientId`
- `unitId`
- `page`
- `pageSize`

### GET `/devices/:deviceId`
Detalhe completo de dispositivo.

### GET `/devices/:deviceId/telemetry?period=daily|weekly|monthly|custom&start=YYYY-MM-DD&end=YYYY-MM-DD`

## 4. Ciclo de status
### POST `/devices/:deviceId/status-cycle`
Request:
```json
{
  "state": "inventory",
  "durationMinutes": 120,
  "reason": "Conferencia de estoque",
  "user": "Admin 1"
}
```

### POST `/devices/:deviceId/status-cycle/close`
Request:
```json
{
  "user": "Admin 1"
}
```

### GET `/devices/:deviceId/status-cycle`

## 5. Gestão
### GET `/management/health`
### GET `/management/contracts`
### GET `/management/operational-status`
### GET `/management/drill/:type`
`type` permitido: `health`, `contracts`, `operational-status`

## 6. NOC
### POST `/noc/sessions`
Request:
```json
{
  "mode": "area",
  "filters": ["near_limit", "offline", "battery"],
  "scope": { "areaId": "banco-sangue" }
}
```

### GET `/noc/sessions/:sessionId/occurrences`
### GET `/noc/occurrences/live?mode=device&filters=offline,battery`
### POST `/noc/sessions/:sessionId/ack`

## 7. Auditoria
### GET `/devices/:deviceId/audit`
### POST `/audit/events`
Request:
```json
{
  "deviceId": 7,
  "scope": "status",
  "field": "Status do dispositivo",
  "description": "Status alterado para INVENTARIO",
  "user": "Admin 2"
}
```

## 8. Configuração/certificados
### GET `/config/certificates?areaId=banco-sangue`
### PATCH `/config/areas/:areaId/certificates`
### PATCH `/config/devices/:deviceId/certificates`
### POST `/config/devices/:deviceId/certificate-file`

## 9. Ordem de serviço
### POST `/service-orders`
### GET `/service-orders?status=em_analise&type=orcamento`

## 10. Debug técnico
### GET `/debug/snapshot`
Retorna snapshot completo em memória para inspeção técnica.
