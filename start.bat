@echo off
title CrochetsBy_Advika - Dev Server
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm install || goto :error
)

if not exist .env (
  echo WARNING: .env file is missing. Copy .env.example to .env and fill in the values.
)

echo Starting the site at http://localhost:5173 ...
call npm run dev -- --open
goto :eof

:error
echo.
echo Something went wrong. Check the messages above.
pause
