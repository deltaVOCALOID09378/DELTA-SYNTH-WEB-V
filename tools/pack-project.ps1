# pack-project.ps1
# Export and Package script for DELTA SYNTH
$timestamp = "16.09.2026-18.46"
$rootDir = "E:\Program Developing\DELTA_SYNTH-main"
$exportDir = "$rootDir\Export The Project\$timestamp"

if (-not (Test-Path $exportDir)) {
    New-Item -ItemType Directory -Path $exportDir -Force | Out-Null
}

$sevenZip = "C:\Program Files\7-Zip\7z.exe"
$programArchive = "$exportDir\DELTA_SYNTH-Program-Version-1.01.01.7z"
$sourceArchive = "$exportDir\DELTA_SYNTH-Source-Code-Version-1.01.01-Source Code.zip"

Write-Host "Creating Program Package: $programArchive"
& $sevenZip a -t7z -mx=5 -y -bsp0 -bso0 $programArchive "$rootDir\src\public" "$rootDir\server.js" "$rootDir\package.json" "$rootDir\wrangler.toml" "$rootDir\Cloudflare_Pages_Domain_Setup_Guide.md" "$rootDir\tools"

Write-Host "Creating Source Code Package: $sourceArchive"
& $sevenZip a -tzip -mx=5 -y -bsp0 -bso0 $sourceArchive "$rootDir\src" "$rootDir\tests" "$rootDir\tools" "$rootDir\History Editing" "$rootDir\server.js" "$rootDir\package.json" "$rootDir\wrangler.toml" "$rootDir\*.md" "-xr!node_modules" "-xr!.git" "-xr!.venv" "-xr!.tmp*"

Write-Host "Packaging Complete. Files generated:"
Get-ChildItem -Path $exportDir | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
