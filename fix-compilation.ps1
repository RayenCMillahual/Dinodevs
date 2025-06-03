# fix-compilation.ps1
# Script para corregir errores de compilación

Write-Host "🔧 Corrigiendo errores de compilación..." -ForegroundColor Green

# 1. Eliminar archivos residuales que causan conflictos
Write-Host "🗑️ Eliminando archivos residuales..." -ForegroundColor Yellow

$filesToRemove = @(
    "backend\src\auth\auth.service.ts",
    "backend\src\auth\auth.guard.ts", 
    "backend\dist"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item -Recurse -Force $file -ErrorAction SilentlyContinue
        Write-Host "❌ Eliminado: $file" -ForegroundColor Red
    } else {
        Write-Host "✅ No existe: $file" -ForegroundColor Green
    }
}

# 2. Verificar estructura de archivos necesarios
Write-Host ""
Write-Host "📁 Verificando estructura de archivos..." -ForegroundColor Yellow

$requiredFiles = @(
    "backend\src\auth\auth0.service.ts",
    "backend\src\auth\auth.controller.ts",
    "backend\src\auth\auth.module.ts",
    "backend\src\auth\auth.strategy.ts",
    "backend\src\auth\jwt-auth.guard.ts",
    "backend\src\auth\email-verified.guard.ts",
    "backend\src\juegos\juegos.controller.ts",
    "backend\src\juegos\juegos.service.ts",
    "backend\src\juegos\juegos.module.ts",
    "backend\src\app.module.ts"
)

$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Existe: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Falta: $file" -ForegroundColor Red
        $missingFiles += $file
    }
}

# 3. Limpiar caché de compilación
Write-Host ""
Write-Host "🧹 Limpiando caché de compilación..." -ForegroundColor Yellow
Set-Location "backend"

if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Carpeta dist eliminada" -ForegroundColor Green
}

if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache" -ErrorAction SilentlyContinue
    Write-Host "✅ Caché de node_modules limpiado" -ForegroundColor Green
}

# 4. Reinstalar dependencias si es necesario
Write-Host ""
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow

# Verificar si auth0 está instalado (no debería estar)
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if ($packageJson.dependencies.auth0) {
    Write-Host "⚠️ Dependencia 'auth0' encontrada, eliminando..." -ForegroundColor Yellow
    npm uninstall auth0
    Write-Host "✅ Dependencia 'auth0' eliminada" -ForegroundColor Green
}

# 5. Intentar compilar
Write-Host ""
Write-Host "🔨 Intentando compilar..." -ForegroundColor Yellow
$buildResult = npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Compilación exitosa!" -ForegroundColor Green
} else {
    Write-Host "❌ Error en la compilación" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Archivos que faltan:" -ForegroundColor Cyan
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "🔧 Soluciones:" -ForegroundColor Cyan
    Write-Host "1. Crear los archivos faltantes con el contenido de los artifacts" -ForegroundColor White
    Write-Host "2. Verificar que no haya archivos .ts duplicados en auth/" -ForegroundColor White
    Write-Host "3. Verificar que todas las importaciones sean correctas" -ForegroundColor White
}

Set-Location ".."

Write-Host ""
Write-Host "🎯 Proceso completado!" -ForegroundColor Green