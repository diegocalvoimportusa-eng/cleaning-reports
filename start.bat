@echo off
REM Start both backend and frontend development servers on Windows

echo Starting Cleaning Reports application...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo.

REM Start backend in new window
cd backend
echo [Backend] Starting on port 4000...
start "Cleaning Reports Backend" cmd /k npm run dev

REM Wait a bit
timeout /t 3 /nobreak

REM Start frontend in new window
cd ..\frontend
echo [Frontend] Starting on port 3000...
start "Cleaning Reports Frontend" cmd /k npm run dev

cd ..
echo.
echo Both servers started in separate windows.
echo Press Ctrl+C in each window to stop them.
