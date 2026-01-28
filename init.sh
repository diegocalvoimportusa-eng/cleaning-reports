#!/bin/bash
# Quick setup script for first-time initialization

set -e

echo "Initializing Cleaning Reports project..."
echo ""

# Backend setup
echo "1. Setting up backend..."
cd backend
cp .env.example .env
npm install
echo "✓ Backend ready"
echo ""

# Frontend setup
echo "2. Setting up frontend..."
cd ../frontend
cp .env.example .env
npm install
echo "✓ Frontend ready"
echo ""

cd ..
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure MongoDB is running locally or update .env with your MongoDB URI"
echo "2. Run 'npm start' to start both servers, or:"
echo "   - Terminal 1: cd backend && npm run dev"
echo "   - Terminal 2: cd frontend && npm run dev"
echo "3. Open http://localhost:3000 in your browser"
