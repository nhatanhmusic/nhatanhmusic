@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0frontend"

if not exist "node_modules" (
  echo === Chua cai thu vien, dang cai ===
  call npm install || exit /b 1
)

if not exist ".env.local" copy ".env.local.example" ".env.local" >nul

echo === Web chay o http://localhost:3000 ===
call npm run dev
