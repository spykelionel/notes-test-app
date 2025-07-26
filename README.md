# Test-Driven Notes: A Fullstack Automation Showcase

A comprehensive Notes application built with React + Vite + Tailwind frontend and Node.js + Express + Mongoose backend, featuring extensive test automation with Playwright (UI/e2e) and Supertest (API).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Installation & Setup

1. **Clone and Install Dependencies**

   ```bash
   git clone <repository-url>
   cd notes-app

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

2. **Environment Setup**

   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start Development Servers**

   ```bash
   # Terminal 1: Start backend (port 5000)
   cd backend
   npm run dev

   # Terminal 2: Start frontend (port 3000)
   cd frontend
   npm run dev
   ```

4. **Run Tests**

   ```bash
   # API Tests (Backend)
   cd backend
   npm test

   # UI Tests (Frontend)
   cd frontend
   npm run test:e2e

   # Run all tests
   npm run test:all
   ```

## 🧪 Testing Strategy

### UI Automation (Playwright)

- **Login flows**: Valid/invalid credentials
- **CRUD operations**: Create, read, update, delete notes
- **Visual regression**: Snapshot testing
- **Cross-browser**: Chrome, Firefox, Safari

### API Testing (Supertest + Jest)

- **Authentication**: JWT token validation
- **CRUD endpoints**: Full note lifecycle
- **Error handling**: Invalid payloads, auth failures
- **Edge cases**: Empty states, malformed data

## 📁 Project Structure

```
notes-app/
├── frontend/             # React + Vite + Tailwind
│   ├── src/
│   ├── tests/            # Playwright e2e tests
│   └── playwright.config.ts
├── backend/              # Node.js + Express + Mongoose
│   ├── src/
│   ├── tests/            # Supertest + Jest
│   └── jest.config.js
└── docs/
    └── test-plan.md      # Detailed test strategy
```

## 🛠 Tech Stack

| Layer     | Technology                             | Purpose                     |
| --------- | -------------------------------------- | --------------------------- |
| Frontend  | React, Vite, TailwindCSS, Lucide Icons | Modern note-taking UI       |
| Backend   | Node.js, Express, Mongoose, JWT        | RESTful API with auth       |
| UI Tests  | Playwright                             | Functional & visual testing |
| API Tests | Supertest, Jest                        | Robust endpoint validation  |

## 📊 Test Coverage

- **API Coverage**: >90% via Jest + nyc
- **UI Coverage**: Full user journey flows
- **Visual Coverage**: Snapshot regression testing

## 🔄 CI/CD

GitHub Actions automatically runs:

- API tests on every PR
- UI tests on every push
- Coverage reporting
- Build validation

## 📚 Documentation

- [Test Plan](./docs/test-plan.md) - Detailed testing strategy
- [API Documentation](./backend/README.md) - Backend API specs
- [Frontend Guide](./frontend/README.md) - UI component docs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Write tests first (TDD approach)
4. Implement functionality
5. Ensure all tests pass
6. Submit pull request

## 📄 License

MIT License - see LICENSE file for details
