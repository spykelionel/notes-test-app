#!/bin/bash

echo "🔍 Checking Linting Status"
echo "=========================="

# Check backend linting
echo ""
echo "📦 Backend Linting Check..."
cd backend
if npm run lint 2>/dev/null; then
    echo "✅ Backend linting passed"
else
    echo "❌ Backend linting failed"
    echo "Running lint with fixes..."
    npm run lint:fix 2>/dev/null || echo "Some issues may need manual fixing"
fi
cd ..

# Check frontend linting
echo ""
echo "📦 Frontend Linting Check..."
cd frontend
if npm run lint 2>/dev/null; then
    echo "✅ Frontend linting passed"
else
    echo "❌ Frontend linting failed"
    echo "Running lint with fixes..."
    npm run lint:fix 2>/dev/null || echo "Some issues may need manual fixing"
fi
cd ..

echo ""
echo "🎯 Linting check completed!" 