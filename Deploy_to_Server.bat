@echo off
echo ==========================================================
echo    DELTA SYNTH Website - Vercel Server Deployment Tool
echo ==========================================================
echo.
echo This script will help you upload your space-themed website
echo to a world-class global server (Vercel) using your Gmail.
echo.
echo [1] Checking Vercel CLI Installation...
call npm install -g vercel
echo.
echo [2] Logging In...
echo *** A browser window will open. Please choose "Continue with Google" ***
echo *** and log in with your Gmail account. ***
call vercel login
echo.
echo [3] Deploying to Production Server...
echo When asked questions by the system, just press ENTER for all defaults!
echo Specifically:
echo - "Set up and deploy?" -^> Type Y and press Enter
echo - "Which scope?" -^> Press Enter
echo - "Link to existing project?" -^> Type N and press Enter
echo - "What's your project's name?" -^> Press Enter
echo - "In which directory is your code located?" -^> Press Enter
echo.
cd src\public
call vercel deploy --prod
echo.
echo ==========================================================
echo   Deployment Complete! Your website is now on the server.
echo ==========================================================
pause
