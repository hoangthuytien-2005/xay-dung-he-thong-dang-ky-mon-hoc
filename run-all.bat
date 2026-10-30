@echo off
title UniCredit Portal - Fullstack Launcher (MongoDB + C# + Next.js)
echo ============================================================
echo   UNICREDIT PORTAL - LAUNCHING MONGODB, BACKEND AND FRONTEND
echo ============================================================
echo.
if not exist "%~dp0.mongodb\data" mkdir "%~dp0.mongodb\data"
echo 1. Starting MongoDB Server (Port 27017)...
start "UniCredit MongoDB Server" cmd /k ""%~dp0.mongodb\bin\mongod.exe" --dbpath "%~dp0.mongodb\data" --port 27017 --bind_ip 127.0.0.1"
timeout /t 2 >nul

echo.
echo 2. Launching C# ASP.NET Core Backend (Port 5000)...
start "UniCredit Backend API" cmd /k "cd /d "%~dp0backend\UniCredit.Api" && dotnet run"

echo.
echo 3. Launching Next.js Frontend (Port 3000)...
start "UniCredit Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ============================================================
echo   All services are starting!
echo   - MongoDB: mongodb://127.0.0.1:27017/unicredit_db
echo   - Frontend: http://localhost:3000
echo   - Backend Swagger: http://localhost:5000/swagger
echo ============================================================
timeout /t 5
