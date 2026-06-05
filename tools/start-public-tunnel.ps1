param(
  [int]$Port = 4000
)

$ErrorActionPreference = 'Stop'
$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$Cloudflared = Join-Path $Root 'runtime\bin\cloudflared.exe'

if (!(Test-Path -LiteralPath $Cloudflared)) {
  throw "cloudflared.exe nao encontrado em $Cloudflared. Baixe o binario oficial para runtime\bin antes de abrir o tunel."
}

Write-Host "Abrindo link publico temporario para http://localhost:$Port ..."
Write-Host "Mantenha esta janela aberta enquanto o link publico estiver em uso."
& $Cloudflared tunnel --url "http://localhost:$Port" --no-autoupdate
