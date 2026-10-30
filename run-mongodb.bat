@echo off
title UniCredit MongoDB Server (Port 27017)
if not exist "%~dp0.mongodb\data" mkdir "%~dp0.mongodb\data"
echo Starting MongoDB Server on 127.0.0.1:27017...
"%~dp0.mongodb\bin\mongod.exe" --dbpath "%~dp0.mongodb\data" --port 27017 --bind_ip 127.0.0.1
