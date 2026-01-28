#!/bin/bash
# Start both backend and frontend development servers

echo "Starting Cleaning Reports application..."
echo "Backend: http://localhost:4000"
echo "Frontend: http://localhost:3000"
echo ""

# Start backend in background
cd backend
echo "[Backend] Starting on port 4000..."
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
cd ../frontend
echo "[Frontend] Starting on port 3000..."
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
