// MongoDB initialization script
// This script runs automatically when the MongoDB container starts

print("Starting database initialization...");

// Connect to the admin database
db = db.getSiblingDB("admin");

// Authenticate with root credentials
db.auth("admin", "password123");

// Switch to the notes-app database
db = db.getSiblingDB("notes-app");

print("Creating default user...");

// Create the default user
db.createUser({
  user: "user@example.com",
  pwd: "password123",
  roles: [
    {
      role: "readWrite",
      db: "notes-app",
    },
  ],
});

// Create collections
db.createCollection("users");
db.createCollection("notes");

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.notes.createIndex({ userId: 1 });
db.notes.createIndex({ createdAt: -1 });

print("Database initialization completed successfully!");

// Also create test database
db = db.getSiblingDB("notes-app-test");

print("Creating test database...");

// Create the same user for test database
db.createUser({
  user: "user@example.com",
  pwd: "password123",
  roles: [
    {
      role: "readWrite",
      db: "notes-app-test",
    },
  ],
});

// Create collections for test database
db.createCollection("users");
db.createCollection("notes");

// Create indexes for test database
db.users.createIndex({ email: 1 }, { unique: true });
db.notes.createIndex({ userId: 1 });
db.notes.createIndex({ createdAt: -1 });

print("Test database initialization completed successfully!");
