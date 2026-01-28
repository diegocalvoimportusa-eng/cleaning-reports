#!/bin/bash
# Clean and rebuild frontend

echo "Cleaning frontend..."
cd frontend
rm -rf node_modules package-lock.json
echo "Reinstalling dependencies..."
npm install
echo "Starting dev server..."
npm run dev
