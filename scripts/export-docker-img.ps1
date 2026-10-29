param(
  [string]$ImageName = "mystic-tarot",
  [string]$Tag = "latest",
  [string]$OutputFile = "mystic-tarot.img",
  [switch]$NoBuild
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$docker = Get-Command docker -ErrorAction SilentlyContinue

if (-not $docker) {
  $dockerPath = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
  if (Test-Path $dockerPath) {
    $docker = @{ Source = $dockerPath }
  } else {
    throw "Docker CLI not found. Install/start Docker Desktop first."
  }
}

$imageRef = "${ImageName}:${Tag}"
$outputPath = if ([System.IO.Path]::IsPathRooted($OutputFile)) {
  $OutputFile
} else {
  Join-Path $projectRoot $OutputFile
}

Set-Location $projectRoot

Write-Host "Checking Docker daemon..."
& $docker.Source info *> $null

if (-not $NoBuild) {
  Write-Host "Building Docker image: $imageRef"
  & $docker.Source build -t $imageRef .
}

Write-Host "Exporting Docker image to: $outputPath"
& $docker.Source save $imageRef -o $outputPath

$file = Get-Item $outputPath
Write-Host "Done: $($file.FullName) ($([Math]::Round($file.Length / 1MB, 2)) MB)"
