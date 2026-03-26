# Script para construir imagen Docker localmente y guardarla
# Uso: .\build-local.ps1

Write-Host "[INFO] Construyendo imagen Docker..." -ForegroundColor Green
docker build -t cardionova:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Fallo la construccion de la imagen" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Guardando imagen a archivo..." -ForegroundColor Green
docker save -o cardionova.tar cardionova:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Fallo al guardar la imagen" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Imagen guardada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Archivo creado: cardionova.tar" -ForegroundColor Yellow
Write-Host "Tamano aproximado: " -NoNewline -ForegroundColor Yellow
$size = (Get-Item cardionova.tar).Length / 1MB
Write-Host "$([math]::Round($size, 2)) MB" -ForegroundColor Yellow
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Cyan
Write-Host "Subir a EC2 con: scp -i `"cardionova.pem`" cardionova.tar ubuntu@ec2-44-204-140-25.compute-1.amazonaws.com:~/" -ForegroundColor White
