# 03 - Instalacao

## Requisitos da maquina

- Node.js LTS.
- npm.
- Git.
- Expo Go no Android e no iPhone.
- Conta Expo, se necessario.
- Render ou Railway para backend online.

## Backend local

```bash
cd id-sensor-mvp/backend
cp .env.example .env
npm run dev
```

No PowerShell, se `cp` nao estiver disponivel:

```powershell
Copy-Item .env.example .env
```

Se `npm` nao estiver respondendo na maquina, rode com Node diretamente:

```powershell
node src/server.js
```

## Popular banco de teste

```bash
npm run seed
```

Ou via API:

```bash
curl -X POST http://localhost:4000/seed
```

No Windows, o banco SQLite local fica por padrao em:

```text
%LOCALAPPDATA%/IDSensorMVP/id_sensor_mvp.db
```

Esse caminho evita erro de I/O em pastas sincronizadas pelo OneDrive.

## Painel original local

```bash
cd id-sensor-mvp
npm run serve:panel
```

Acesse:

```text
http://localhost:8080/
```

O servidor usa `tools/serve-panel.js` e entrega os arquivos de `painel-original`.

## Painel pelo backend

Para teste com mais de um computador, use o painel servido pelo backend:

```text
http://localhost:4000/
```

Nesse modo, painel e API ficam na mesma origem. Isso evita que outro computador tente chamar o `localhost` dele.

## Link publico temporario

Com o backend rodando, abra um tunel publico:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\start-public-tunnel.ps1
```

Copie a URL `https://...trycloudflare.com` exibida no terminal e envie para os outros computadores. Mantenha o backend e o tunel abertos enquanto a apresentacao estiver em uso.

## Observacao sobre celulares reais

Para celulares fora da rede local, `PUBLIC_API_URL` deve apontar para a URL online do backend.
