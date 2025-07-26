import express from "express";
import request from "supertest";
import authRoutes from "../src/routes/auth";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Authentication Endpoints", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
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
  });
});
