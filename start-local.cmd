@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Please install Node.js 22 or newer.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  call npm.cmd install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo ApplyMate AI: http://127.0.0.1:5173/
echo Keep this window open. Press Ctrl+C to stop.
call npm.cmd run dev
if errorlevel 1 pause
