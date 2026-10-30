@echo off
title UniCredit Frontend (Next.js)
echo ===================================================
echo  Starting UniCredit Frontend on port 3000...
echo  Web URL: http://localhost:3000
echo ===================================================
cd /d "%~dp0frontend"
npm run dev
pause
