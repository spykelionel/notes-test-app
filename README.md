# Notes Application - Automated Testing Demo

A full-stack notes application with comprehensive automated testing demonstrating UI automation, API testing, and visual regression testing.

## 🚀 Quick Start (1-2 minutes)

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone and Install

```bash
git clone <https://github.com/spykelionel/notes-test-app.git
cd notes-test-app
npm install
```

### 2. Setup Environment

```bash
# Copy environment files
cp backend/env.example backend/.env
cp frontend/.env.example frontend/.env

# Install Playwright browsers
npx playwright install
```

### 3. Start the Application

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:5000>
- **Test User**: `user@example.com` / `password123`

## 🧪 Running Tests

### Frontend Tests (Playwright)

```bash
cd frontend

# Run all tests
npm run test:e2e

# Run specific test suites
npx playwright test auth.spec.ts
npx playwright test notes.spec.ts
npx playwright test visual.spec.ts

# Run with UI
npm run test:e2e:ui

# View test report
npx playwright show-report
```

### Backend Tests (Jest + Supertest)

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Visual Regression Tests

```bash
cd frontend

# Run visual tests (requires both servers running)
npx playwright test visual.spec.ts

# Update visual snapshots
npx playwright test --update-snapshots
```

## 📊 Test Coverage

### Frontend Testing

- ✅ **Authentication**: Login/logout flows
- ✅ **Note Management**: CRUD operations
- ✅ **Form Validation**: Input validation and error handling
- ✅ **Responsive Design**: Mobile, tablet, desktop layouts
- ✅ **Visual Regression**: Cross-browser visual consistency

### Backend Testing

- ✅ **API Endpoints**: All CRUD operations
- ✅ **Authentication**: User registration and login
- ✅ **Validation**: Input validation and error handling
- ✅ **Security**: JWT token validation
- ✅ **Database Operations**: MongoDB integration

### Test Statistics

- **Frontend Tests**: 8 test files, 40+ test cases
- **Backend Tests**: 2 test files, 74 test cases
- **Visual Tests**: 8 visual regression tests
- **Coverage**: >80% line coverage on both frontend and backend

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Playwright** for UI automation and visual testing

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Jest + Supertest** for API testing

### Testing Tools

- **Playwright**: UI automation and visual testing
- **Jest**: Backend testing framework
- **Supertest**: HTTP assertions for API testing
- **MongoDB Memory Server**: Isolated test database

## 📁 Project Structure

```
notes-app/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── services/        # API services
│   ├── tests/               # Playwright tests
│   │   ├── auth.spec.ts     # Authentication tests
│   │   ├── notes.spec.ts    # Note management tests
│   │   └── visual.spec.ts   # Visual regression tests
│   └── package.json
├── backend/                  # Node.js API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── models/          # Database models
│   │   └── middleware/      # Express middleware
│   ├── tests/               # Jest tests
│   │   ├── auth.test.ts     # Authentication API tests
│   │   └── notes.test.ts    # Notes API tests
│   └── package.json
└── docs/                    # Documentation
    └── test-plan.md         # Comprehensive test plan
```

## 🎯 Key Features Demonstrated

### 1. Functional UI Automation

- **Login/Logout**: Valid and invalid credential testing
- **Note CRUD**: Create, read, update, delete operations
- **Form Validation**: Input validation and error handling
- **Responsive Testing**: Mobile and tablet layouts

### 2. API Test Automation

- **Authentication**: Registration and login endpoints
- **CRUD Operations**: Complete note management API
- **Validation**: Input validation and error responses
- **Security**: JWT token validation and authorization

### 3. Visual Regression Testing

- **Cross-browser**: Chrome, Firefox, Safari testing
- **Responsive Design**: Mobile, tablet, desktop layouts
- **UI States**: Login, dashboard, editor, error states
- **Automated Comparison**: Screenshot comparison and diff detection

### 4. Test Infrastructure

- **Isolated Testing**: Separate test databases
- **Parallel Execution**: Fast test execution
- **Comprehensive Reporting**: HTML reports and coverage
- **CI/CD Ready**: GitHub Actions integration ready

## 🔧 Development

### Adding New Tests

```bash
# Frontend test
npx playwright codegen http://localhost:3000

# Backend test
cd backend && npm run test:watch
```

### Debugging Tests

```bash
# Frontend debug mode
npx playwright test --debug

# Backend debug mode
npm run test:debug
```

### Updating Visual Snapshots

```bash
# Update all snapshots
npx playwright test --update-snapshots

# Update specific test
npx playwright test visual.spec.ts --update-snapshots
```

## 📈 CI/CD Integration

The project is ready for CI/CD integration with:

- **GitHub Actions**: Automated test execution
- **Coverage Reporting**: Code coverage tracking
- **Visual Regression**: Automated visual testing
- **Parallel Execution**: Fast CI/CD pipelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

**Tests failing with login errors:**

- Ensure backend server is running on port 5000
- Check that test user exists in database

**Visual tests failing:**

- Update visual snapshots: `npx playwright test --update-snapshots`
- Check for intentional UI changes

**Backend tests failing:**

- Ensure MongoDB is accessible
- Check environment variables in `.env` file

**Frontend tests timing out:**

- Increase timeout in `playwright.config.ts`
- Check for slow network conditions

### Getting Help

- Check the test plan in `docs/test-plan.md`
- Review test reports in `test-results/`
- Check Playwright documentation for UI testing
- Check Jest documentation for backend testing
