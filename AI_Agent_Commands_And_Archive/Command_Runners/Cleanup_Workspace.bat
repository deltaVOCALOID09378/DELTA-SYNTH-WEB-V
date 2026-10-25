@echo off
echo ==============================================
echo DELTA SYNTH - Workspace Cleanup Script
echo ==============================================
echo Moving files to 'All Editing File For Agent'...
mkdir "All Editing File For Agent" 2>nul
move /Y "Deploy_to_Server.bat" "All Editing File For Agent\"
move /Y "scripts\update_profiles.py" "All Editing File For Agent\"

echo Deleting old script and history folders...
rmdir /S /Q "scripts"
rmdir /S /Q "Editing"

echo Cleanup Complete!
pause
