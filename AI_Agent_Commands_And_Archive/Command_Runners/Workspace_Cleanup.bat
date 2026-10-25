:: ==============================================================================
:: File Name   : Workspace_Cleanup.bat
:: Version     : v1.1
:: Location    : Project Root Directory
:: Function    : Safe Workspace Cleanup, Agent File Migration, and Folder Purge
:: Credit      : Made And Checked By DELTA SYNTH & All Agentic AI
::               Original by DELTA SYNTH
:: ==============================================================================

@echo off
setlocal enabledelayedexpansion

:: Check if directory arguments were passed via Drag-and-Drop
if not "%~1"=="" goto PROCESS_ARGS

:: Default to the script's current directory if executed directly
call :CLEAN_WORKSPACE "%~dp0"
goto PROMPT_LOOP

:PROCESS_ARGS
for %%I in (%*) do (
    call :CLEAN_WORKSPACE "%%~fI"
)
goto PROMPT_LOOP

:PROMPT_LOOP
echo.
echo ==============================================
echo [Drag and drop another folder to continue]
echo [Or press ENTER to exit]
echo ==============================================
set "INPUT_DIR="
set /p "INPUT_DIR=> "
if "!INPUT_DIR!"=="" goto FINISH

:: Strip quotation marks from input path
set "INPUT_DIR=!INPUT_DIR:"=!"
if exist "!INPUT_DIR!\" (
    call :CLEAN_WORKSPACE "!INPUT_DIR!"
    goto PROMPT_LOOP
) else (
    echo [ERROR] Target path does not exist or is not a valid directory.
    goto PROMPT_LOOP
)

:CLEAN_WORKSPACE
set "TARGET_DIR=%~1"
echo.
echo ==============================================
echo DELTA SYNTH - Workspace Cleanup Script
echo Target: "!TARGET_DIR!"
echo ==============================================

cd /d "!TARGET_DIR!"

echo.
echo Step 1: Preparing destination folder...
if not exist "All Editing File For Agent" (
    mkdir "All Editing File For Agent" 2>nul
)

echo.
echo Step 2: Moving files to 'All Editing File For Agent'...
if exist "Deploy_to_Server.bat" (
    move /Y "Deploy_to_Server.bat" "All Editing File For Agent\" >nul
    echo [OK] Moved: Deploy_to_Server.bat
) else (
    echo [SKIP] File not found: Deploy_to_Server.bat
)

if exist "scripts\update_profiles.py" (
    move /Y "scripts\update_profiles.py" "All Editing File For Agent\" >nul
    echo [OK] Moved: scripts\update_profiles.py
) else (
    echo [SKIP] File not found: scripts\update_profiles.py
)

echo.
echo Step 3: Deleting obsolete folders...
if exist "scripts" (
    rmdir /S /Q "scripts"
    echo [OK] Deleted folder: scripts
) else (
    echo [SKIP] Folder not found: scripts
)

if exist "Editing" (
    rmdir /S /Q "Editing"
    echo [OK] Deleted folder: Editing
) else (
    echo [SKIP] Folder not found: Editing
)

echo.
echo Cleanup complete for: "!TARGET_DIR!"
exit /b

:FINISH
echo.
echo Terminating cleanup process...
exit /b