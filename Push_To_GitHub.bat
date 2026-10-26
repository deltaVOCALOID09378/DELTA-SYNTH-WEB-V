@echo off
:: =====================================================================
:: File Name: Push_To_GitHub.bat
:: Version: 1.0
:: Target Path: E:\Program Developing\DELTA_SYNTH-main\
:: Description: Automated one-click script to stage, commit, and push 
::              the 55-singer roster update directly to GitHub main branch.
:: Made And Checked By DELTA SYNTH & All Code Agentic AI Engine
:: Original by DELTA SYNTH (Patiphat Wongyai)
:: =====================================================================

setlocal EnableDelayedExpansion
title DELTA SYNTH - GitHub Deployment Engine

echo ====================================================================
echo        DELTA SYNTH - GITHUB ONE-CLICK REPOSITORY SYNCHRONIZER
echo ====================================================================
echo.

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: Locate project root directory (checks current folder and two levels up)
if exist ".git" (
    set "REPO_DIR=%SCRIPT_DIR%"
) else if exist "..\..\.git" (
    cd /d "..\.."
    set "REPO_DIR=!CD!"
) else (
    set "REPO_DIR=%SCRIPT_DIR%"
)

:: Locate Git binary (system git or project tools/git)
where git >nul 2>&1
if !errorlevel! equ 0 (
    set "GIT_CMD=git"
) else if exist "%REPO_DIR%\tools\git\cmd\git.exe" (
    set "GIT_CMD=%REPO_DIR%\tools\git\cmd\git.exe"
) else (
    set "GIT_CMD=git"
)

echo [1/4] Checking Git repository status in %REPO_DIR%...
if not exist ".git" (
    echo [ERROR] Git repository not found in %REPO_DIR%
    pause
    exit /b 1
)

echo [2/4] Staging all updated files...
"%GIT_CMD%" add -A

echo [3/4] Checking commit status...
"%GIT_CMD%" status --porcelain >nul 2>&1
"%GIT_CMD%" commit -m "feat(theme): implement Night Meteor Shower Sky v3.1, showcase Thai RVC WebUI and The Darkside UI AI Agent, clean GitHub workflows, and apply workspace archive protocol" >nul 2>&1

echo [4/4] Pushing changes to origin/main on GitHub...
"%GIT_CMD%" push origin main

if errorlevel 1 (
    echo.
    echo ====================================================================
    echo [ERROR] Git push encountered an issue.
    echo Please verify your network connection or GitHub credentials.
    echo ====================================================================
) else (
    echo.
    echo ====================================================================
    echo [SUCCESS] All files successfully uploaded to GitHub!
    echo Repository: https://github.com/deltaVOCALOID09378/DELTA-SYNTH-WEB-V
    echo Live Site:  https://deltavocaloid09378.github.io/DELTA-SYNTH-WEB-V/
    echo ====================================================================
)

echo.
pause
