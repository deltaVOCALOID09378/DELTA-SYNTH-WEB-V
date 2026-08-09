@echo off
:: Made And Checked By DELTA SYNTH & Gemini AI
:: Original by Patiphat Wongyai
:: v.1.1 [2026-06-29]

:: [EN] Change console code page to UTF-8 for Thai language support
:: [TH] ปรับตั้งค่าหน้าต่าง CMD ให้รองรับอักขระภาษาไทยอย่างสมบูรณ์
chcp 65001 >nul
setlocal enabledelayedexpansion

:: [EN] Setup dynamic variables and tracking
:: [TH] กำหนดตัวแปรและเริ่มต้นการบันทึกเวลา
set "PROJECT_DIR=%~dp0"
set "SRC_DIR=%PROJECT_DIR%src"
set "ZIP_NAME=DELTA_SYNTH_Official_Website_v1.1.zip"
set "OUTPUT_ZIP=%PROJECT_DIR%%ZIP_NAME%"

for /f "tokens=*" %%a in ('powershell -Command "Get-Date -Format 'HH:mm:ss'"') do set "START_TIME=%%a"

echo =======================================================
echo [EN] DELTA SYNTH Website Automation System v.1.1
echo [TH] ระบบสร้างและรวมไฟล์เว็บไซต์อัตโนมัติ (Production-Ready)
echo =======================================================
echo [STATUS] Task File: Run_Build_Website_v1.1.bat
echo [STATUS] Job Type: Generator ^& Packager (.zip)
echo [STATUS] Working Path: !PROJECT_DIR!
echo [STATUS] Start Time: !START_TIME!
echo -------------------------------------------------------

:: [EN] Run the Python Generator Script
:: [TH] ดำเนินการรันสคริปต์ Python เพื่ออัปเดตโครงสร้าง UI/UX
echo [ACTION] Executing extract_v1.1.py ...
python extract_v1.1.py
if !errorlevel! neq 0 (
    echo [ERROR] การประมวลผล Python ล้มเหลว โปรดตรวจสอบโครงสร้างโค้ด
    goto :PROMPT_EXIT
)

:: [EN] Detect and count generated files
:: [TH] ตรวจสอบและนับจำนวนไฟล์ที่พร้อมส่งมอบ
set /a FILE_COUNT=0
for /f %%A in ('dir /s /b /a-d "!SRC_DIR!\*.html" 2^>nul ^| find /c /v ""') do set "FILE_COUNT=%%A"
echo [INFO] Found !FILE_COUNT! HTML files / พบหน้าเว็บจำนวน !FILE_COUNT! ไฟล์

:: [EN] Package files into .zip format using PowerShell
:: [TH] บีบอัดไฟล์ทั้งหมดด้วยมาตรฐาน .zip
echo [ACTION] Packaging files into !ZIP_NAME! ...
if exist "!OUTPUT_ZIP!" del /f /q "!OUTPUT_ZIP!"
powershell -NoProfile -Command "Compress-Archive -Path '!SRC_DIR!\*' -DestinationPath '!OUTPUT_ZIP!' -Force"

if exist "!OUTPUT_ZIP!" (
    echo [SUCCESS] สร้างไฟล์ .zip เรียบร้อยแล้ว (Created successfully)
) else (
    echo [ERROR] เกิดข้อผิดพลาดในการรวมไฟล์ (Failed to package files)
)

:: [EN] Calculate Duration and Completion Time
:: [TH] คำนวณระยะเวลาการทำงานและเวลาสิ้นสุด
for /f "tokens=*" %%a in ('powershell -Command "Get-Date -Format 'HH:mm:ss'"') do set "END_TIME=%%a"
for /f "tokens=*" %%a in ('powershell -Command "(New-TimeSpan -Start (Get-Date '!START_TIME!') -End (Get-Date '!END_TIME!')).ToString('hh\:mm\:ss')"') do set "DURATION=%%a"

echo.
echo =======================================================
echo [REPORT] สรุปผลการดำเนินงาน (Execution Summary)
echo =======================================================
echo - Start Time: !START_TIME!
echo - End Time:   !END_TIME!
echo - Duration:   !DURATION!
echo - Files:      !FILE_COUNT! files processed.
echo - Package:    !ZIP_NAME!
echo =======================================================
echo [⬇️ ดาวน์โหลด Source Code] ไฟล์โค้ดตัวเต็มถูกแพ็กเป็น .zip และรออยู่ที่:
echo !OUTPUT_ZIP!
echo =======================================================
echo.

:PROMPT_EXIT
:: [EN] Final instruction prompt
:: [TH] สิ้นสุดการทำงานและสอบถามความต้องการผู้ใช้
echo ผู้ใช้งาน หากต้องการ ทำรายการ ต่อไป ท่านสามารถ คัดลอก ที่อยู่ไฟล์ แล้ว เอามาวาง ที่อยู่ไฟล์ ของเป้าหมาย หรือ  จะไป ลากแฟ้ม เข้ามาใน โปรแกรม แล้ว กด Enter เพื่อเดินหน้าทำงานอื่นต่อได้ ก็ทำได้เช่นกัน หรือ อยากจะจะออกจากระบบ ด้วยการกด ESC ก็สามารถกดได้ทันที ครับ (Continue or Exit) ขอบคุณที่ให้เราทำงานให้นะครับ  
pause >nul
exit /b