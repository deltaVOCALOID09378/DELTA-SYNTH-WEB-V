:: ==============================================================================
:: File Name   : 01_Fix_Environment.bat
:: Version     : v1.1
:: Location    : Project Root Directory
:: Function    : Void Editor Initialization and Workspace Setup
:: Credit      : Made And Checked By DELTA SYNTH & Gemini AI
::               Original by Microsoft and Void Editor Community
:: ==============================================================================

@echo off
setlocal enabledelayedexpansion

:: Change to script directory as default workspace
cd /d "%~dp0"

:: Check if directory arguments were passed via Drag-and-Drop
if not "%~1"=="" goto PROCESS_ARGS

:: Standard execution flow (Default workspace)
call :LAUNCH_VOID "%~dp0"
goto PROMPT_LOOP

:PROCESS_ARGS
for %%I in (%*) do (
    call :LAUNCH_VOID "%%~fI"
)
goto PROMPT_LOOP

:PROMPT_LOOP
echo.
echo ========================================================
echo [Drag and drop another folder to open in Void Editor]
echo [Or press ENTER to exit]
echo ========================================================
set "INPUT_DIR="
set /p "INPUT_DIR=> "
if "!INPUT_DIR!"=="" goto FINISH

:: Strip quotation marks from input path
set "INPUT_DIR=!INPUT_DIR:"=!"
if exist "!INPUT_DIR!\" (
    call :LAUNCH_VOID "!INPUT_DIR!"
    goto PROMPT_LOOP
) else (
    echo [ERROR] Target path does not exist or is not a valid directory.
    goto PROMPT_LOOP
)

:LAUNCH_VOID
set "TARGET_DIR=%~1"
echo.
echo ==========================================
echo Initializing Void Editor Environment
echo Target: "!TARGET_DIR!"
echo ==========================================

echo.
echo [1/2] Checking and Installing Thai Language Pack...
void --install-extension MS-CEINTL.vscode-language-pack-th

echo.
echo [2/2] Launching Void Editor...
if exist "!TARGET_DIR!\" (
    cd /d "!TARGET_DIR!"
    void .
    echo [OK] Void Editor launched for the specified project.
) else (
    echo [ERROR] Invalid directory. Launching in default workspace instead.
    cd /d "%~dp0"
    void .
)

echo.
echo Process Completed Successfully!
exit /b

:FINISH
echo.
echo Exiting setup utility...
pause
exit /b