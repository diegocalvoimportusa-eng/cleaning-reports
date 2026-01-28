@echo off
REM Quick setup script for Windows

setlocal enabledelayedexpansion

echo Initializing Cleaning Reports project...
echo.

REM Backend setup
echo 1. Setting up backend...
cd backend
if exist .env (
  echo .env already exists, skipping...
) else (
  copy .env.example .env > nul
  echo Created .env from template
)
call npm install
echo ✓ Backend ready
echo.

REM Frontend setup
echo 2. Setting up frontend...
cd ..\frontend
if exist .env (
  echo .env already exists, skipping...
) else (
  copy .env.example .env > nul
  echo Created .env from template
)
call npm install
echo ✓ Frontend ready
echo.

cd ..
echo Setup complete!
echo.
echo Next steps:
echo 1. Ensure MongoDB is running locally or update .env with your MongoDB URI
echo 2. Run 'start.bat' to start both servers, or:
echo    - Terminal 1: cd backend ^&^& npm run dev
echo    - Terminal 2: cd frontend ^&^& npm run dev
echo 3. Open http://localhost:3000 in your browser
