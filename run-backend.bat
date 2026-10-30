@echo off
title UniCredit Backend (C# ASP.NET Core)
echo ===================================================
echo  Starting UniCredit C# Backend API on port 5000...
echo  Swagger UI: http://localhost:5000/swagger
echo ===================================================
cd /d "%~dp0backend\UniCredit.Api"
dotnet run
pause
