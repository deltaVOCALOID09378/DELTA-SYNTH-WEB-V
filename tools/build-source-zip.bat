@echo off

:: ============================================================================
:: build-source-zip.bat
:: Tools/build-source-zip.bat
:: Made And Checked By DELTA SYNTH & Gemini AI
:: Original by Patiphat Wongyai (Delta)
:: Revision: 1.1
:: Purpose: Package source code archive into zip format
:: ============================================================================

set SEVENZIP=C:\Program Files\7-Zip\7z.exe
set ROOT_DIR=E:\Program Developing\DELTA_SYNTH-main
set EXPORT_DIR=%ROOT_DIR%\Export The Project\16.09.2026-18.46
set TARGET_ZIP=%EXPORT_DIR%\DELTA_SYNTH-Source-Code-Version-1.01.01-Source Code.zip
set LOG_FILE=%ROOT_DIR%\tools\build-source-zip.log

echo Starting source code zip packaging... > "%LOG_FILE%"
if exist "%TARGET_ZIP%" del /f /q "%TARGET_ZIP%"

cd /d "%ROOT_DIR%"

"%SEVENZIP%" a -tzip -mx=5 -y "%TARGET_ZIP%" src tests tools "History Editing" server.js package.json wrangler.toml *.md -xr!node_modules -xr!.git -xr!.venv -xr!.tmp* "-xr!Export The Project" -xr!*.wav -xr!*.zip -xr!*.7z >> "%LOG_FILE%" 2>&1

echo Exit code: %ERRORLEVEL% >> "%LOG_FILE%"
exit /b %ERRORLEVEL%
