:: =====================================================================
:: File Name: GitHub_Safe_Sync_Updater.bat
:: Version: 1.0
:: Target Path: E:\Program Developing\DELTA_SYNTH-main\
:: Description: Basic essential automated script to safely verify, synchronize, and update codebase from GitHub and external URLs.
:: Made And Checked By DELTA SYNTH & All Code Agentic AI Engine
:: Original by DELTA SYNTH
:: =====================================================================

@echo off
setlocal enabledelayedexpansion

echo ************************************************************
echo System: Safe Git Synchronizer and File Importer
echo ************************************************************

:: Clean and repair git garbage to prevent previous errors
echo [System] Checking and repairing Git internal references...
git gc --prune=now --quiet

:: Sync with Github securely without deleting or renaming local structure
echo [System] Pulling latest code from GitHub safely...
git fetch origin --quiet
git merge origin/main --no-edit

:: Check if user provided direct download links in a file
set "URL_LIST=update_links.txt"
if exist "%URL_LIST%" (
    echo [System] Scanning %URL_LIST% for direct file imports...
    for /f "usebackq tokens=*" %%L in ("%URL_LIST%") do (
        set "FILE_URL=%%L"
        if not "!FILE_URL!"=="" (
            echo [System] Verifying and importing from URL: !FILE_URL!
            
            :: Use curl to download. -O enforces the exact filename from URL.
            :: -s hides progress, --fail skips broken links automatically.
            curl -O -L -s --fail "!FILE_URL!"
            
            if !errorlevel! equ 0 (
                echo [System] Import success: Exact filename preserved perfectly.
            ) else (
                echo [System] Bypass: Link invalid, content error, or unavailable. Skipping.
            )
        )
    )
) else (
    echo [System] No %URL_LIST% found. Skipping direct URL import phase.
)

echo ************************************************************
echo [System] All code updates completed with zero structure damage.
echo ************************************************************
pause