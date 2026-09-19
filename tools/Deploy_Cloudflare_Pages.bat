@echo off
setlocal enabledelayedexpansion

:: ============================================================================
:: Deploy_Cloudflare_Pages.bat
:: Tools/Deploy_Cloudflare_Pages.bat
:: Made And Checked By DELTA SYNTH & Gemini AI
:: Original by Patiphat Wongyai (Delta)
:: Revision: 1.0
:: Purpose: Deploy DELTA SYNTH static website to Cloudflare Pages
:: Target Domain: delta-synth-studio-th.com
:: ============================================================================

set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%.."
set "LOG_FILE=%SCRIPT_DIR%Deploy_Cloudflare_Pages.log"

echo ====================================================== > "%LOG_FILE%"
echo [DELTA SYNTH] Cloudflare Pages Deployment Started >> "%LOG_FILE%"
echo Date: %DATE% %TIME% >> "%LOG_FILE%"
echo ====================================================== >> "%LOG_FILE%"

echo [DELTA SYNTH] Deploying website to Cloudflare Pages...
echo Target Domain: delta-synth-studio-th.com
echo Logging output to: %LOG_FILE%

:: Check if Node.js is available
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in PATH. >> "%LOG_FILE%"
    echo [ERROR] Node.js is required to deploy. Please install Node.js.
    exit /b 1
)

:: Check if public directory exists
if not exist "%ROOT_DIR%\src\public" (
    echo [ERROR] Target directory src\public not found. >> "%LOG_FILE%"
    echo [ERROR] Target directory src\public not found.
    exit /b 1
)

:: Run pre-deployment verification tests
echo [1/3] Running pre-deployment verification tests...
echo [INFO] Running test suite... >> "%LOG_FILE%"
node "%ROOT_DIR%\tests\run-all-tests.js" >> "%LOG_FILE%" 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Pre-deployment tests failed. Aborting deployment. >> "%LOG_FILE%"
    echo [ERROR] Pre-deployment tests failed. Check %LOG_FILE% for details.
    exit /b 1
)
echo [PASS] All tests verified successfully.

:: Verify deployment assets
echo [2/3] Verifying CNAME and headers configurations...
if not exist "%ROOT_DIR%\src\public\CNAME" (
    echo [ERROR] src\public\CNAME is missing. >> "%LOG_FILE%"
    echo [ERROR] CNAME is missing.
    exit /b 1
)
if not exist "%ROOT_DIR%\src\public\_headers" (
    echo [ERROR] src\public\_headers is missing. >> "%LOG_FILE%"
    echo [ERROR] _headers is missing.
    exit /b 1
)
echo [PASS] CNAME and Cloudflare headers verified.

:: Execute Cloudflare Pages deployment via Wrangler
echo [3/3] Deploying to Cloudflare Pages...
echo [INFO] Executing npx wrangler pages deploy... >> "%LOG_FILE%"

call npx wrangler pages deploy "%ROOT_DIR%\src\public" --project-name delta-synth-studio >> "%LOG_FILE%" 2>&1
set "DEPLOY_EXIT=%ERRORLEVEL%"

if %DEPLOY_EXIT% equ 0 (
    echo ====================================================== >> "%LOG_FILE%"
    echo [SUCCESS] Deployment completed successfully! >> "%LOG_FILE%"
    echo ====================================================== >> "%LOG_FILE%"
    echo.
    echo ======================================================
    echo [SUCCESS] DELTA SYNTH deployed to Cloudflare Pages!
    echo Main Domain: https://delta-synth-studio-th.com
    echo Default URL: https://delta-synth-studio.pages.dev
    echo ======================================================
) else (
    echo [NOTICE] Wrangler CLI may need Cloudflare authentication or login. >> "%LOG_FILE%"
    echo.
    echo [INFO] Cloudflare Pages Direct Upload Guide:
    echo 1. Login to https://dash.cloudflare.com
    echo 2. Go to Workers ^& Pages -^> Create -^> Pages -^> Direct Upload
    echo 3. Drag and drop the folder: %ROOT_DIR%\src\public
    echo 4. Set Custom Domain to: delta-synth-studio-th.com
    echo.
    echo Details saved to: %LOG_FILE%
)

endlocal
exit /b 0
