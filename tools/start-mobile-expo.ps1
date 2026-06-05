$ErrorActionPreference = 'Stop'
$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$MobileDir = Join-Path $Root 'mobile-app'

Set-Location -LiteralPath $MobileDir

if (!(Test-Path -LiteralPath 'node_modules')) {
  corepack pnpm install --ignore-scripts
}

Write-Host 'Abrindo Expo para o app IDsensor...'
Write-Host 'Escaneie o QR Code com o Expo Go no celular.'
& '.\node_modules\.bin\expo.cmd' start --tunnel
