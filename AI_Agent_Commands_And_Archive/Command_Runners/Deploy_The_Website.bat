@echo off
:: ============================================================================
:: Deploy_The_Website.bat
:: Made And Checked By DELTA SYNTH & Gemini AI
:: Original by Patiphat Wongyai (DELTA SYNTH)
:: Version: 1.0
:: Purpose: Dual Production Deployment for DELTA SYNTH (GitHub Pages & Cloudflare Pages)
:: ============================================================================
setlocal EnableDelayedExpansion

set "TARGET_DIR=%~dp0"
if not "%~1"=="" (
    set "TARGET_DIR=%~1"
)

:MENU
cls
echo ============================================================================
echo         DELTA SYNTH - DUAL DEPLOYMENT CONTROL CENTER v1.0
echo            (Zero-Defect Hosting: GitHub Pages + Cloudflare Pages)
echo ============================================================================
echo.
echo  Workspace: %TARGET_DIR%
echo.
echo  [1] Deploy to GitHub Pages (Sync and Push to origin/main)
echo  [2] Deploy to Cloudflare Pages (via Wrangler or Direct Upload)
echo  [3] Deploy to BOTH (GitHub Pages + Cloudflare Pages Dual-Failover)
echo  [4] Run Local Standalone Web Server (http://localhost:3000)
echo  [5] Run Full Zero-Defect Test Suites (144 Tests)
echo  [6] Exit
echo.
echo ============================================================================
set /p "CHOICE=Please select an option (1-6): "

if "%CHOICE%"=="1" goto DEPLOY_GITHUB
if "%CHOICE%"=="2" goto DEPLOY_CLOUDFLARE
if "%CHOICE%"=="3" goto DEPLOY_BOTH
if "%CHOICE%"=="4" goto RUN_LOCAL
if "%CHOICE%"=="5" goto RUN_TESTS
if "%CHOICE%"=="6" goto EXIT_SCRIPT

echo [ERROR] Invalid choice. Please enter a number between 1 and 6.
timeout /t 2 >nul
goto MENU

:RUN_TESTS
echo.
echo [INFO] Running 4-Tier Automated Verification Suites (144 Tests)...
call node "%TARGET_DIR%tests\run-all-tests.js"
if errorlevel 1 (
    echo [ERROR] Verification failed. Please resolve errors before deploying.
    pause
    goto MENU
)
echo.
echo [SUCCESS] 100% Zero-Defect Verification Passed!
pause
goto MENU

:DEPLOY_GITHUB
echo.
echo ============================================================================
echo [DELTA SYNTH] Deploying to GitHub Pages...
echo ============================================================================
call node "%TARGET_DIR%tests\run-all-tests.js"
if errorlevel 1 (
    echo [ERROR] Pre-deployment verification failed. Aborting GitHub deployment.
    pause
    goto MENU
)
echo.
echo [1/3] Adding changes to Git...
git -C "%TARGET_DIR%" add -A
echo [2/3] Committing deployment bundle...
git -C "%TARGET_DIR%" commit -m "deploy: update dual-release for GitHub Pages and Cloudflare Pages"
echo [3/3] Pushing to GitHub main branch...
git -C "%TARGET_DIR%" push origin main
if errorlevel 1 (
    echo [ERROR] Git push failed. Please check network connection or remote status.
) else (
    echo.
    echo ============================================================================
    echo [SUCCESS] GitHub Pages deployment triggered successfully!
    echo Production URL: https://deltavocaloid09378.github.io/DELTA-SYNTH-WEB-V/
    echo ============================================================================
)
pause
goto MENU

:DEPLOY_CLOUDFLARE
echo.
echo ============================================================================
echo [DELTA SYNTH] Deploying to Cloudflare Pages...
echo ============================================================================
call node "%TARGET_DIR%tests\run-all-tests.js"
if errorlevel 1 (
    echo [ERROR] Pre-deployment verification failed. Aborting Cloudflare deployment.
    pause
    goto MENU
)
echo.
echo Checking for Wrangler CLI...
call npx wrangler pages deploy "%TARGET_DIR%src\public" --project-name delta-synth-studio
if errorlevel 1 (
    echo.
    echo [NOTICE] Wrangler deployment requires Cloudflare login.
    echo Alternative Direct Upload:
    echo 1. Open https://dash.cloudflare.com
    echo 2. Go to Workers & Pages -^> Create -^> Pages -^> Upload assets
    echo 3. Drag and drop the folder: "%TARGET_DIR%src\public"
    echo 4. Project Name: delta-synth-studio
    echo.
    explorer "%TARGET_DIR%src\public"
) else (
    echo.
    echo ============================================================================
    echo [SUCCESS] Cloudflare Pages deployed successfully!
    echo Production URL: https://delta-synth-studio.pages.dev
    echo ============================================================================
)
pause
goto MENU

:DEPLOY_BOTH
echo.
echo ============================================================================
echo [DELTA SYNTH] Executing Dual Failover Deployment (GitHub + Cloudflare)...
echo ============================================================================
call node "%TARGET_DIR%tests\run-all-tests.js"
if errorlevel 1 (
    echo [ERROR] Pre-deployment verification failed. Aborting deployment.
    pause
    goto MENU
)
echo.
echo [Stage 1] Pushing to GitHub Pages...
git -C "%TARGET_DIR%" add -A
git -C "%TARGET_DIR%" commit -m "deploy: dual hosting release on GitHub Pages and Cloudflare Pages"
git -C "%TARGET_DIR%" push origin main

echo.
echo [Stage 2] Deploying to Cloudflare Pages...
call npx wrangler pages deploy "%TARGET_DIR%src\public" --project-name delta-synth-studio
if errorlevel 1 (
    echo [NOTICE] Cloudflare direct upload available at https://dash.cloudflare.com
)

echo.
echo ============================================================================
echo [COMPLETE] Dual Deployment Routine Finished!
echo Primary (GitHub Pages):    https://deltavocaloid09378.github.io/DELTA-SYNTH-WEB-V/
echo Backup (Cloudflare Pages): https://delta-synth-studio.pages.dev
echo ============================================================================
pause
goto MENU

:RUN_LOCAL
echo.
echo ============================================================================
echo [DELTA SYNTH] Starting Local Standalone Server on http://localhost:3000...
echo ============================================================================
call node "%TARGET_DIR%server.js"
pause
goto MENU

:EXIT_SCRIPT
echo Exiting DELTA SYNTH Deployment Control Center.
exit /b 0
