# Docker Setup - Notes Application

This document explains how to use Docker for running the Notes Application in development, testing, and production environments.

## 🐳 Overview

The application uses Docker Compose to orchestrate multiple services:

- **MongoDB**: Database with automatic initialization
- **Backend**: Node.js API server
- **Frontend**: React application served by Nginx
- **Test Environment**: Complete testing suite

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed
- Docker Compose installed

### 1. Start the Application

```bash
# Clone the repository
git clone <repository-url>
cd notes-app

# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

### 2. Access the Application

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:5000>
- **Test User**: `user@example.com` / `password123`

### 3. Stop the Application

```bash
docker compose down
```

## 🧪 Running Tests

### Run All Tests

```bash
# Start test environment
docker compose --profile test up --abort-on-container-exit --exit-code-from test
```

### Run Specific Test Suites

```bash
# Backend tests only
docker compose run --rm test sh -c "cd backend && npm test"

# Frontend tests only
docker compose run --rm test sh -c "cd frontend && npm run test:e2e"

# Visual tests only
docker compose run --rm test sh -c "cd frontend && npx playwright test visual.spec.ts"
```

## 🏗️ Development Workflow

### Development Mode

```bash
# Start services for development
docker compose up mongodb backend -d

# Run frontend in development mode
cd frontend
npm install
npm run dev
```

### Hot Reload

```bash
# Watch for changes and rebuild
docker compose up --build
```

### Database Access

```bash
# Connect to MongoDB
docker compose exec mongodb mongosh -u admin -p password123

# View database
use notes-app
show collections
```

## 📊 Production Deployment

### Build Production Images

```bash
# Build all images
docker compose build

# Build specific service
docker compose build backend
docker compose build frontend
```

### Production Environment Variables

Create a `.env` file for production:

```env
NODE_ENV=production
MONGODB_URI=mongodb://admin:password123@mongodb:27017/notes-app?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://yourdomain.com
```

### Deploy to Production

```bash
# Start production services
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale services
docker compose up -d --scale backend=3
```

## 🔧 Configuration

### Environment Variables

#### MongoDB

- `MONGO_INITDB_ROOT_USERNAME`: Root username (default: admin)
- `MONGO_INITDB_ROOT_PASSWORD`: Root password (default: password123)
- `MONGO_INITDB_DATABASE`: Database name (default: notes-app)

#### Backend

- `NODE_ENV`: Environment (development/production/test)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `BCRYPT_ROUNDS`: Password hashing rounds
- `PORT`: Server port (default: 5000)
- `CORS_ORIGIN`: Allowed CORS origin

#### Frontend

- `VITE_API_URL`: Backend API URL

### Volumes

- `mongodb_data`: Persistent MongoDB data
- `./scripts/init-db.js`: Database initialization script

### Networks

- `notes-app-network`: Internal network for service communication

## 🐛 Troubleshooting

### Common Issues

#### Port Conflicts

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :5000
lsof -i :27017

# Stop conflicting services
sudo service mongod stop
```

#### Database Connection Issues

```bash
# Check MongoDB logs
docker compose logs mongodb

# Reset database
docker compose down -v
docker compose up -d
```

#### Build Failures

```bash
# Clean build
docker compose build --no-cache

# Remove all containers and images
docker compose down --rmi all
docker system prune -a
```

#### Test Failures

```bash
# Check test logs
docker-compose logs test

# Run tests with verbose output
docker-compose run --rm test sh -c "cd backend && npm test -- --verbose"
```

### Debugging

#### Access Running Containers

```bash
# Access backend container
docker-compose exec backend sh

# Access frontend container
docker-compose exec frontend sh

# Access MongoDB container
docker-compose exec mongodb mongosh
```

#### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Follow logs
docker-compose logs -f backend
```

## 🔒 Security

### Production Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Use secrets management
- [ ] Regular security updates

### Secrets Management

```bash
# Use Docker secrets (Swarm mode)
echo "your-secret-jwt-key" | docker secret create jwt_secret -

# Use environment files
docker-compose --env-file .env.production up -d
```

## 📈 Monitoring

### Health Checks

```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:5000/health
curl http://localhost:3000/health
```

### Resource Usage

```bash
# Monitor resource usage
docker stats

# View container details
docker-compose top
```

## 🚀 CI/CD Integration

### GitHub Actions

The repository includes a GitHub Actions workflow that:

1. Builds Docker images
2. Runs all tests in containers
3. Pushes images to registry (optional)

### Local CI/CD

```bash
# Run CI pipeline locally
./scripts/ci.sh

# Run specific stages
./scripts/test.sh
./scripts/build.sh
./scripts/deploy.sh
```

## 📚 Additional Commands

### Useful Docker Commands

```bash
# View running containers
docker-compose ps

# Restart services
docker-compose restart backend

# Update images
docker-compose pull

# Clean up
docker-compose down --volumes --remove-orphans

# View resource usage
docker system df
```

### Database Management

```bash
# Backup database
docker-compose exec mongodb mongodump --out /backup

# Restore database
docker-compose exec mongodb mongorestore /backup

# Export data
docker-compose exec mongodb mongoexport --collection users --db notes-app
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test with Docker
5. Submit a pull request

### Testing Changes

```bash
# Test your changes
docker-compose --profile test up --abort-on-container-exit

# Run specific tests
docker-compose run --rm test sh -c "cd backend && npm test"
```

---

**Note**: This Docker setup is designed for development and testing. For production deployment, consider using orchestration tools like Kubernetes or Docker Swarm.
