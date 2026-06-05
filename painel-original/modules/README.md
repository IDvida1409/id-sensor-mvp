# Blueprint de Módulos

Este diretório contém um blueprint para migração gradual do `script.js` monolítico para módulos por responsabilidade.

## Ordem sugerida de migração
1. `state-store.js`
2. `device-rules.js`
3. `ui-renderers.js`
4. `accessibility-controller.js`
5. `gestao-drill.js`
6. `noc-engine.js`
7. `api-client.js`
8. `bootstrap.js`

## Estratégia
- Migrar função por função do `script.js` para o módulo equivalente.
- Manter wrappers temporários em `script.js` para compatibilidade.
- Remover wrappers somente após testes de regressão completos.
