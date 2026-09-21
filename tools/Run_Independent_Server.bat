@echo off
setlocal enabledelayedexpansion

:: ============================================================================
:: Run_Independent_Server.bat
:: Tools/Run_Independent_Server.bat
:: Made And Checked By DELTA SYNTH & Gemini AI
:: Original by Patiphat Wongyai (Delta)
:: Revision: 1.0
:: Purpose: Launch standalone Node.js REST API and static server
:: Port: 3000 (or %PORT%)
:: ============================================================================

set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%.."
set "LOG_FILE=%SCRIPT_DIR%Run_Independent_Server.log"

echo ====================================================== > "%LOG_FILE%"
echo [DELTA SYNTH] Server Starting... >> "%LOG_FILE%"
echo Date: %DATE% %TIME% >> "%LOG_FILE%"
echo ====================================================== >> "%LOG_FILE%"

echo [DELTA SYNTH] Starting Standalone REST API and Static Portal...
echo Logging output to: %LOG_FILE%

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in PATH. >> "%LOG_FILE%"
    echo [ERROR] Node.js is required. Please install Node.js.
    exit /b 1
)

echo [INFO] Launching server.js... >> "%LOG_FILE%"
echo Opening server at http://localhost:3000
echo Press Ctrl+C to terminate.

node "%ROOT_DIR%\server.js" >> "%LOG_FILE%" 2>&1

endlocal
exit /b 0
