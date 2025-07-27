import express from "express";
import request from "supertest";
import { generateToken } from "../src/middleware/auth";
import { Note } from "../src/models/Note";
import { User } from "../src/models/User";
import notesRoutes from "../src/routes/notes";

const app = express();
app.use(express.json());
app.use("/api/notes", notesRoutes);

describe("Notes Endpoints", () => {
  let authToken: string;
  let testUser: any;
  let testNote: any;

  const testUserData = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  const testNoteData = {
    title: "Test Note",
    content: "This is a test note content",
    tags: ["test", "example"],
    isPinned: false,
  };

  beforeEach(async () => {
    // Create test user and get auth token
    testUser = new User(testUserData);
    await testUser.save();
    authToken = generateToken(testUser._id);
  });

  describe("GET /api/notes", () => {
    it("should get all notes for authenticated user", async () => {
      // Create some test notes
      const note1 = new Note({ ...testNoteData, user: testUser._id });
      const note2 = new Note({
        ...testNoteData,
        title: "Second Note",
        user: testUser._id,
      });
      await note1.save();
      await note2.save();

      const response = await request(app)
        .get("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Notes retrieved successfully"
      );
      expect(response.body).toHaveProperty("notes");
      expect(response.body.notes).toHaveLength(2);

      // Check that both notes exist without assuming order
      const noteTitles = response.body.notes.map((note: any) => note.title);
      expect(noteTitles).toContain(testNoteData.title);
      expect(noteTitles).toContain("Second Note");
    });

    it("should return empty array when user has no notes", async () => {
      const response = await request(app)
        .get("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Notes retrieved successfully"
      );
      expect(response.body).toHaveProperty("notes");
      expect(response.body.notes).toHaveLength(0);
    });

    it("should return 401 without authentication token", async () => {
      const response = await request(app).get("/api/notes").expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "Access denied. No token provided."
      );
    });

    it("should return 401 with invalid token", async () => {
      const response = await request(app)
        .get("/api/notes")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body).toHaveProperty("message", "Invalid token.");
    });
  });

  describe("POST /api/notes", () => {
    it("should create a new note with valid data", async () => {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testNoteData)
        .expect(201);

      expect(response.body).toHaveProperty(
        "message",
        "Note created successfully"
      );
      expect(response.body).toHaveProperty("note");
      expect(response.body.note).toHaveProperty("title", testNoteData.title);
      expect(response.body.note).toHaveProperty(
        "content",
        testNoteData.content
      );
      expect(response.body.note).toHaveProperty(
        "user",
        testUser._id.toString()
      );
      expect(response.body.note).toHaveProperty("tags", testNoteData.tags);
    });

    it("should create note without optional fields", async () => {
      const minimalNoteData = {
        title: "Minimal Note",
        content: "Minimal content",
      };

      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .send(minimalNoteData)
        .expect(201);

      expect(response.body.note).toHaveProperty("title", minimalNoteData.title);
      expect(response.body.note).toHaveProperty(
        "content",
        minimalNoteData.content
      );
      expect(response.body.note).toHaveProperty("tags", []);
      expect(response.body.note).toHaveProperty("isPinned", false);
    });

    it("should return 400 for missing title", async () => {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "Content without title",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "title");
    });

    it("should return 400 for missing content", async () => {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Title without content",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "content");
    });

    it("should return 400 for title too long", async () => {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "A".repeat(101), // 101 characters
          content: "Valid content",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty("field", "title");
    });

    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .post("/api/notes")
        .send(testNoteData)
        .expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "Access denied. No token provided."
      );
    });
  });

  describe("GET /api/notes/:id", () => {
    beforeEach(async () => {
      testNote = new Note({ ...testNoteData, user: testUser._id });
      await testNote.save();
    });

    it("should get a specific note by ID", async () => {
      const response = await request(app)
        .get(`/api/notes/${testNote._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Note retrieved successfully"
      );
      expect(response.body).toHaveProperty("note");
      expect(response.body.note).toHaveProperty("_id", testNote._id.toString());
      expect(response.body.note).toHaveProperty("title", testNoteData.title);
    });

    it("should return 404 for non-existent note", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .get(`/api/notes/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message", "Note not found");
    });

    it("should return 404 for note belonging to different user", async () => {
      // Create another user and note
      const otherUser = new User({
        name: "Other User",
        email: "other@example.com",
        password: "password123",
      });
      await otherUser.save();

      const otherNote = new Note({ ...testNoteData, user: otherUser._id });
      await otherNote.save();

      const response = await request(app)
        .get(`/api/notes/${otherNote._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message", "Note not found");
    });

    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .get(`/api/notes/${testNote._id}`)
        .expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "Access denied. No token provided."
      );
    });
  });

  describe("PUT /api/notes/:id", () => {
    beforeEach(async () => {
      testNote = new Note({ ...testNoteData, user: testUser._id });
      await testNote.save();
    });

    it("should update a note with valid data", async () => {
      const updateData = {
        title: "Updated Title",
        content: "Updated content",
        tags: ["updated", "test"],
        isPinned: true,
      };

      const response = await request(app)
        .put(`/api/notes/${testNote._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Note updated successfully"
      );
      expect(response.body).toHaveProperty("note");
      expect(response.body.note).toHaveProperty("title", updateData.title);
      expect(response.body.note).toHaveProperty("content", updateData.content);
      expect(response.body.note).toHaveProperty("tags", updateData.tags);
      expect(response.body.note).toHaveProperty(
        "isPinned",
        updateData.isPinned
      );
    });

    it("should return 404 for non-existent note", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .put(`/api/notes/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(testNoteData)
        .expect(404);

      expect(response.body).toHaveProperty("message", "Note not found");
    });

    it("should return 400 for invalid data", async () => {
      const response = await request(app)
        .put(`/api/notes/${testNote._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "", // Empty title
          content: "Valid content",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Validation failed");
    });

    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .put(`/api/notes/${testNote._id}`)
        .send(testNoteData)
        .expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "Access denied. No token provided."
      );
    });
  });

  describe("DELETE /api/notes/:id", () => {
    beforeEach(async () => {
      testNote = new Note({ ...testNoteData, user: testUser._id });
      await testNote.save();
    });

    it("should delete a note successfully", async () => {
      await request(app)
        .delete(`/api/notes/${testNote._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      // Verify note is deleted
      const deletedNote = await Note.findById(testNote._id);
      expect(deletedNote).toBeNull();
    });

    it("should return 404 for non-existent note", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .delete(`/api/notes/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message", "Note not found");
    });

    it("should return 404 for note belonging to different user", async () => {
      // Create another user and note
      const otherUser = new User({
        name: "Other User",
        email: "other@example.com",
        password: "password123",
      });
      await otherUser.save();

      const otherNote = new Note({ ...testNoteData, user: otherUser._id });
      await otherNote.save();

      const response = await request(app)
        .delete(`/api/notes/${otherNote._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message", "Note not found");
    });

    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .delete(`/api/notes/${testNote._id}`)
        .expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "Access denied. No token provided."
      );
    });
  });
});
