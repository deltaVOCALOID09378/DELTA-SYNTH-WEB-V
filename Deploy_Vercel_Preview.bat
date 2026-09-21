@echo off
:: =====================================================================
:: Made And Checked By DELTA SYNTH & Gemini AI
:: Original by DELTA SYNTH
:: Version: 0.2 (Upgraded with Continuous Loop, Drag-and-Drop, Prod/Preview)
:: =====================================================================
setlocal EnableDelayedExpansion

:: Check if a folder was dragged directly onto the script icon
set "INITIAL_TARGET=%~1"

:MAIN_LOOP
cls
echo ===================================================
echo      DELTA SYNTH VERCEL DEPLOYMENT TOOL v0.2
echo ===================================================
echo.

set "TARGET="
if defined INITIAL_TARGET (
    set "TARGET=!INITIAL_TARGET!"
    set "INITIAL_TARGET="
    echo [INFO] Detected dragged folder: !TARGET!
) else (
    echo Please drag and drop your project folder here, 
    echo or press ENTER to use the current directory.
    set /p "TARGET=Target Folder: "
)

:: Remove quotes from path if any, and set default to current directory
if defined TARGET set "TARGET=!TARGET:"=!"
if not defined TARGET set "TARGET=%cd%"

:: Check if vercel.json exists in the target directory
if not exist "!TARGET!\vercel.json" (
    echo.
    echo [ERROR] vercel.json was not found in: !TARGET!
    echo         Please provide a valid DELTA SYNTH project folder.
    goto END_TASK
)

:: Check for Node.js (npm) dependency
where npm >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js ^(npm^) is not installed or not available in PATH.
    echo         Please install Node.js before running this script.
    goto END_TASK
)

:: Check for Vercel CLI and auto-install if missing
where vercel >nul 2>&1
if errorlevel 1 (
    echo.
    echo [WARNING] Vercel CLI is not installed.
    echo           Attempting to install Vercel CLI globally via npm...
    call npm install --global vercel
    if errorlevel 1 (
        echo [ERROR] Failed to install Vercel CLI automatically.
        goto END_TASK
    )
    echo [SUCCESS] Vercel CLI installed successfully.
)

:MENU
echo.
echo Select Deployment Environment:
echo [1] Preview Deployment (vercel --yes)
echo [2] Production Deployment (vercel --prod --yes)
echo [3] Cancel and select a new folder
echo.
set /p "DEPLOY_CHOICE=Enter your choice (1/2/3): "

pushd "!TARGET!"

if "!DEPLOY_CHOICE!"=="1" (
    echo.
    echo Deploying DELTA SYNTH to a Vercel Preview environment...
    call vercel --yes
    set "EXIT_CODE=!ERRORLEVEL!"
) else if "!DEPLOY_CHOICE!"=="2" (
    echo.
    echo Deploying DELTA SYNTH to a Vercel Production environment...
    call vercel --prod --yes
    set "EXIT_CODE=!ERRORLEVEL!"
) else if "!DEPLOY_CHOICE!"=="3" (
    popd
    goto MAIN_LOOP
) else (
    popd
    echo [ERROR] Invalid choice. Please try again.
    goto MENU
)
popd

:: Result Evaluation
echo.
if not "!EXIT_CODE!"=="0" (
    echo [ERROR] Deployment failed with exit code !EXIT_CODE!.
) else (
    echo [SUCCESS] Deployment completed successfully.
)

:END_TASK
echo.
echo ===================================================
echo Press any key to process another folder, 
echo or close this window to exit.
echo ===================================================
pause >nul
goto MAIN_LOOP