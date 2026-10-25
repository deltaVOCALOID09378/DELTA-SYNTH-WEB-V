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

set "REPO_DIR=%~dp0"
cd /d "%REPO_DIR%"

echo [1/4] Checking Git repository status...
if not exist ".git" (
    echo [ERROR] Git repository not found in %REPO_DIR%
    pause
    exit /b 1
)

echo [2/4] Staging all updated files for 55 singers roster...
git add -A

echo [3/4] Creating commit with official roster metadata...
git commit -m "feat(roster): update official 55-singer roster, voicers, Mrs. CodeZero, Andromeda, New Day and test suite"

echo [4/4] Pushing changes to origin/main on GitHub...
git push origin main

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
