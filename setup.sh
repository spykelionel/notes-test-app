#!/bin/bash

# Notes App Setup Script
# This script sets up the fullstack Notes application with all dependencies and configurations

set -e

echo "🚀 Setting up Notes App - Test-Driven Development Showcase"
echo "=========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running (optional check)
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.runCommand({ping: 1})" --quiet &> /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running. Please start MongoDB before running the app."
    fi
else
    echo "⚠️  MongoDB not found. Please install MongoDB or use MongoDB Atlas."
fi

# Backend Setup
echo ""
echo "📦 Setting up Backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "✅ Backend environment file created"
    echo "⚠️  Please edit backend/.env with your MongoDB URI and JWT secret"
else
    echo "✅ Backend environment file already exists"
fi

cd ..

# Frontend Setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Install Playwright browsers
echo "Installing Playwright browsers..."
npx playwright install --with-deps

cd ..

# Create test data setup script
echo ""
echo "📝 Creating test data setup..."
cat > setup-test-data.js << 'EOF'
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/notes-app-test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Note schema
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  isPinned: Boolean,
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

async function setupTestData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Note.deleteMany({});

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    });
    await user.save();

    // Create sample notes
    const notes = [
      {
        title: 'Welcome to Notes App',
        content: 'This is your first note. You can create, edit, and delete notes as needed.',
        user: user._id,
        tags: ['welcome', 'getting-started'],
        isPinned: true,
      },
      {
        title: 'Test-Driven Development',
        content: 'This application demonstrates comprehensive testing with Playwright for UI tests and Supertest for API tests.',
        user: user._id,
        tags: ['testing', 'tdd', 'automation'],
        isPinned: false,
      },
      {
        title: 'Shopping List',
        content: '1. Milk\n2. Bread\n3. Eggs\n4. Butter',
        user: user._id,
        tags: ['shopping', 'personal'],
        isPinned: false,
      },
    ];

    await Note.insertMany(notes);

    console.log('✅ Test data created successfully!');
    console.log('📧 Login credentials: test@example.com / password123');
  } catch (error) {
    console.error('❌ Error setting up test data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

setupTestData();
EOF

echo "✅ Test data setup script created"

# Create development start script
echo ""
echo "📝 Creating development start script..."
cat > start-dev.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Notes App in development mode..."
echo ""

# Start backend
echo "📦 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend
echo "📦 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Development servers started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "📊 API Health: http://localhost:5000/health"
echo ""
echo "📧 Test credentials: test@example.com / password123"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait
EOF

chmod +x start-dev.sh

# Create test runner script
echo ""
echo "📝 Creating test runner script..."
cat > run-tests.sh << 'EOF'
#!/bin/bash

echo "🧪 Running Notes App Test Suite"
echo "================================"

# Function to run backend tests
run_backend_tests() {
    echo ""
    echo "🔧 Running Backend API Tests..."
    cd backend
    npm test
    cd ..
}

# Function to run frontend tests
run_frontend_tests() {
    echo ""
    echo "🎨 Running Frontend UI Tests..."
    cd frontend
    npm run test:e2e
    cd ..
}

# Function to run visual tests
run_visual_tests() {
    echo ""
    echo "📸 Running Visual Regression Tests..."
    cd frontend
    npm run test:visual
    cd ..
}

# Check command line arguments
case "$1" in
    "backend")
        run_backend_tests
        ;;
    "frontend")
        run_frontend_tests
        ;;
    "visual")
        run_visual_tests
        ;;
    "all"|"")
        run_backend_tests
        run_frontend_tests
        run_visual_tests
        ;;
    *)
        echo "Usage: $0 [backend|frontend|visual|all]"
        echo "  backend  - Run only backend API tests"
        echo "  frontend - Run only frontend UI tests"
        echo "  visual   - Run only visual regression tests"
        echo "  all      - Run all tests (default)"
        exit 1
        ;;
esac

echo ""
echo "✅ Test suite completed!"
EOF

chmod +x run-tests.sh

echo ""
echo "🎉 Setup completed successfully!"
echo "=================================="
echo ""
echo "📁 Project Structure:"
echo "  ├── backend/          # Node.js + Express + Mongoose API"
echo "  ├── frontend/         # React + Vite + Tailwind UI"
echo "  ├── docs/            # Documentation and test plans"
echo "  ├── .github/         # GitHub Actions CI/CD"
echo "  ├── setup.sh         # This setup script"
echo "  ├── start-dev.sh     # Development server starter"
echo "  └── run-tests.sh     # Test runner"
echo ""
echo "🚀 Quick Start Commands:"
echo "  ./start-dev.sh       # Start development servers"
echo "  ./run-tests.sh       # Run all tests"
echo "  ./run-tests.sh backend   # Run only API tests"
echo "  ./run-tests.sh frontend  # Run only UI tests"
echo ""
echo "📧 Test Credentials:"
echo "  Email: test@example.com"
echo "  Password: password123"
echo ""
echo "🔧 Manual Setup (if needed):"
echo "  1. Edit backend/.env with your MongoDB URI"
echo "  2. Run 'node setup-test-data.js' to create test data"
echo "  3. Start servers: cd backend && npm run dev"
echo "  4. In another terminal: cd frontend && npm run dev"
echo ""
echo "📚 Documentation:"
echo "  - README.md for project overview"
echo "  - docs/test-plan.md for testing strategy"
echo "  - Backend API docs in backend/README.md"
echo ""
echo "Happy coding! 🎯" 