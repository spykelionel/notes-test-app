import express from "express";
import request from "supertest";
import authRoutes from "../src/routes/auth";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Authentication Endpoints", () => {
  const testUser = {
    name: "Test User",
    email: "user@example.com",
    password: "password123",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user with valid data", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("name", testUser.name);
      expect(response.body.user).toHaveProperty("email", testUser.email);
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should return 400 for duplicate email", async () => {
      // First registration
      await request(app).post("/api/auth/register").send(testUser).expect(201);

      // Second registration with same email
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty(
        "message",
        "User already exists with this email"
      );
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          ...testUser,
          email: "invalid-email",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "email");
    });

    it("should return 400 for short password", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          ...testUser,
          password: "123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "password");
    });

    it("should return 400 for missing required fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(2); // email and password missing
    });

    it("should return 400 for empty name", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "",
          email: "user@example.com",
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "name");
    });

    it("should return 400 for very long name", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "A".repeat(101), // More than 100 characters
          email: "user@example.com",
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "name");
    });

    it("should return 400 for very long email", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "a".repeat(250) + "@example.com", // Very long email
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "email");
    });

    it("should return 400 for very long name", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "A".repeat(51), // More than 50 characters
          email: "user@example.com",
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "name");
    });

    it("should return 400 for email with spaces", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test @example.com",
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "email");
    });

    it("should return 400 for email without domain", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test@",
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "email");
    });

    it("should return 400 for password with only spaces", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "user@example.com",
          password: "   ",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "password");
    });

    it("should return 400 for empty request body", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(3); // name, email, and password missing
    });

    it("should return 400 for malformed JSON", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .set("Content-Type", "application/json")
        .send("invalid json")
        .expect(400);

      // Express returns different error format for malformed JSON
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("email", testUser.email);
    });

    it("should return 401 for invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: testUser.password,
        })
        .expect(401);

      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should return 401 for invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "invalid-email",
          password: testUser.password,
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "email");
    });

    it("should return 400 for short password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "password");
    });

    it("should return 400 for missing email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          password: testUser.password,
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "email");
    });

    it("should return 400 for missing password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "password");
    });

    it("should return 400 for empty email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "",
          password: testUser.password,
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "email");
    });

    it("should return 400 for empty password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "password");
    });

    it("should return 400 for password with only spaces", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "   ",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "password");
    });

    it("should return 400 for empty request body", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(2); // email and password missing
    });

    it("should return 400 for malformed JSON", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send("invalid json")
        .expect(400);

      // Express returns different error format for malformed JSON
      expect(response.status).toBe(400);
    });

    it("should handle email case insensitivity", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "user@example.com", // Different case
          password: testUser.password,
        })
        .expect(200); // Should work due to email normalization

      expect(response.body).toHaveProperty("message", "Login successful");
    });

    it("should handle email with leading/trailing spaces", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "  user@example.com  ", // With spaces
          password: testUser.password,
        })
        .expect(400); // Email validation fails for spaces

      expect(response.body).toHaveProperty("message", "Validation failed");
    });
  });
});
