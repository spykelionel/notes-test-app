# Test Plan: Notes Application

## 🎯 Testing Strategy Overview

This document outlines the comprehensive testing approach for the Notes application, covering both UI and API layers with a focus on test-driven development (TDD) and end-to-end confidence.

## 🛠 Tools Selection & Rationale

### UI Testing: Playwright

**Why Playwright?**

- **Cross-browser support**: Chrome, Firefox, Safari, Edge
- **Modern architecture**: Built for modern web apps
- **Visual testing**: Built-in screenshot and video capture
- **Reliability**: Auto-waiting and smart retry mechanisms
- **Performance**: Fast execution with parallel test runs

### API Testing: Supertest + Jest

**Why Supertest + Jest?**

- **Express integration**: Native Express.js testing
- **Jest ecosystem**: Rich assertion library and mocking
- **Coverage reporting**: Built-in coverage analysis
- **Performance**: Fast unit and integration tests
- **Maintainability**: Clear test structure and organization

## 📋 Test Coverage Matrix

### Frontend (Playwright)

| Feature           | Test Type | Scenarios                            | Priority |
| ----------------- | --------- | ------------------------------------ | -------- |
| Authentication    | E2E       | Login success/failure, logout        | High     |
| Note Creation     | E2E       | Create note, validation, empty state | High     |
| Note Editing      | E2E       | Edit note, save changes, cancel      | High     |
| Note Deletion     | E2E       | Delete note, confirmation dialog     | High     |
| Note Listing      | E2E       | Display notes, empty state, search   | Medium   |
| Visual Regression | Visual    | UI consistency across browsers       | Medium   |

### Backend (Supertest + Jest)

| Endpoint                | Test Type        | Scenarios                                  | Priority |
| ----------------------- | ---------------- | ------------------------------------------ | -------- |
| `POST /api/auth/login`  | Unit/Integration | Valid/invalid credentials, JWT generation  | High     |
| `GET /api/notes`        | Unit/Integration | Fetch notes, auth required, empty response | High     |
| `POST /api/notes`       | Unit/Integration | Create note, validation, auth required     | High     |
| `PUT /api/notes/:id`    | Unit/Integration | Update note, validation, not found         | High     |
| `DELETE /api/notes/:id` | Unit/Integration | Delete note, auth required, not found      | High     |
| Middleware              | Unit             | Auth middleware, error handling            | Medium   |

## 🧪 Test Scenarios

### UI Test Scenarios (Playwright)

#### 1. Authentication Flow

```typescript
// Login with valid credentials
- Navigate to login page
- Enter valid email/password
- Submit form
- Assert redirect to dashboard
- Assert user menu shows logged-in state

// Login with invalid credentials
- Enter invalid email/password
- Submit form
- Assert error message displayed
- Assert no redirect occurs
```

#### 2. Note CRUD Operations

```typescript
// Create Note
- Click "New Note" button
- Fill note title and content
- Save note
- Assert note appears in list
- Assert note content is correct

// Edit Note
- Click edit button on existing note
- Modify title/content
- Save changes
- Assert note updates in list
- Assert changes persist

// Delete Note
- Click delete button on note
- Confirm deletion in dialog
- Assert note removed from list
- Assert empty state if no notes remain
```

#### 3. Visual Regression

```typescript
// Dashboard Layout
- Take screenshot of dashboard
- Compare with baseline
- Assert no visual regressions

// Note Editor
- Open note editor
- Take screenshot of editor interface
- Compare with baseline
```

### API Test Scenarios (Supertest)

#### 1. Authentication Endpoints

```javascript
// POST /api/auth/login
- Valid credentials → 200 + JWT token
- Invalid credentials → 401
- Missing fields → 400
- Malformed email → 400
```

#### 2. Notes Endpoints

```javascript
// GET /api/notes
- Valid token → 200 + notes array
- Invalid token → 401
- No token → 401
- Empty notes → 200 + empty array

// POST /api/notes
- Valid data + token → 201 + created note
- Invalid data → 400
- No token → 401
- Missing required fields → 400

// PUT /api/notes/:id
- Valid update + token → 200 + updated note
- Note not found → 404
- Invalid token → 401
- Invalid data → 400

// DELETE /api/notes/:id
- Valid token → 204
- Note not found → 404
- Invalid token → 401
```

## 🚀 Test Execution

### Running Tests Locally

#### Frontend Tests

```bash
# Install Playwright browsers
npx playwright install

# Run all UI tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- tests/auth.spec.ts

# Run with UI mode (debugging)
npm run test:e2e -- --ui

# Run visual regression tests
npm run test:visual
```

#### Backend Tests

```bash
# Run all API tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/auth.test.js

# Run in watch mode
npm run test:watch
```

### CI/CD Integration

#### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd backend && npm ci && npm test

  ui-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm ci && npm run test:e2e
```

## 📊 Coverage Goals

### Code Coverage Targets

- **Backend**: >90% line coverage
- **Frontend**: >80% component coverage
- **API Endpoints**: 100% endpoint coverage
- **Critical User Flows**: 100% e2e coverage

### Coverage Reporting

```bash
# Backend coverage
npm run test:coverage
# Generates: coverage/lcov-report/index.html

# Frontend coverage
npm run test:coverage
# Generates: coverage/index.html
```

## 🔧 Test Data Management

### Test Database

- **Environment**: Separate test database
- **Cleanup**: Before/after each test suite
- **Seeding**: Predefined test data for consistent results

### Mock Data

```javascript
// Test user data
const testUser = {
  email: "user@example.com",
  password: "password123",
};

// Test note data
const testNote = {
  title: "Test Note",
  content: "This is a test note content",
};
```

## 🚨 Limitations & Assumptions

### Known Limitations

1. **Browser Support**: Tests run on Chrome, Firefox, Safari only
2. **Network Conditions**: Tests assume stable internet connection
3. **Performance**: No performance benchmarking included
4. **Accessibility**: Basic a11y testing only

### Assumptions

1. **MongoDB**: Test database available and accessible
2. **Environment**: Node.js 18+ and npm available
3. **Dependencies**: All packages installable via npm
4. **Ports**: Ports 3000 (frontend) and 5000 (backend) available

## 📈 Future Enhancements

### Planned Improvements

1. **Performance Testing**: Lighthouse CI integration
2. **Accessibility Testing**: axe-core integration
3. **Load Testing**: Artillery.js for API stress testing
4. **Mobile Testing**: Responsive design validation
5. **Visual Testing**: Advanced screenshot comparison

### Monitoring & Alerting

1. **Test Metrics**: Track test execution time and success rates
2. **Coverage Alerts**: Notify on coverage drops
3. **Flaky Test Detection**: Identify and fix unstable tests
4. **Performance Regression**: Monitor test execution performance

## 📚 Resources

### Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Jest Documentation](https://jestjs.io/)

### Best Practices

- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)
- [API Testing Patterns](https://martinfowler.com/articles/microservice-testing/)
- [Visual Testing Guide](https://www.chromatic.com/features/visual-test)
