@echo off
:: Made And Checked By DELTA SYNTH & All Agentic AI
:: Original by DELTA SYNTH Studio
:: Version: 0.1

title DELTA SYNTH Web Deployment System

echo ==========================================
echo DELTA SYNTH WEB DEPLOYMENT SYSTEM
echo ==========================================

set "TARGET_DIR=%~1"
if "%TARGET_DIR%"=="" (
    set "TARGET_DIR=%CD%"
)

echo Target Directory: %TARGET_DIR%
cd /d "%TARGET_DIR%"

if not exist "package.json" (
    echo Initializing new npm project...
    call npm init -y
)

echo Checking and installing necessary packages...
call npm install

echo Starting local development server...
echo Press CTRL+C to stop the server at any time.
call npx serve .

pause
goto :eof