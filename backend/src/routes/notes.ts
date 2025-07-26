import { Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import { validateNote } from "../middleware/validation";
import { Note } from "../models/Note";

interface AuthRequest extends Request {
  user?: any;
}

const router = Router();

// GET /api/notes - Get all notes for authenticated user
router.get(
  "/",
  auth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const notes = await Note.find({ user: req.user._id })
        .sort({ isPinned: -1, createdAt: -1 })
        .select("-__v");

      res.json({
        message: "Notes retrieved successfully",
        notes,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/notes - Create a new note
router.post(
  "/",
  auth,
  validateNote,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, content, tags, isPinned } = req.body;

      const note = new Note({
        title,
        content,
        tags: tags || [],
        isPinned: isPinned || false,
        user: req.user._id,
      });

      await note.save();

      res.status(201).json({
        message: "Note created successfully",
        note,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/notes/:id - Get a specific note
router.get(
  "/:id",
  auth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const note = await Note.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).select("-__v");

      if (!note) {
        res.status(404).json({ message: "Note not found" });
        return;
      }

      res.json({
        message: "Note retrieved successfully",
        note,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/notes/:id - Update a note
router.put(
  "/:id",
  auth,
  validateNote,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, content, tags, isPinned } = req.body;

      const note = await Note.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        {
          title,
          content,
          tags: tags || [],
          isPinned: isPinned || false,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-__v");

      if (!note) {
        res.status(404).json({ message: "Note not found" });
        return;
      }

      res.json({
        message: "Note updated successfully",
        note,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /api/notes/:id - Delete a note
router.delete(
  "/:id",
  auth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const note = await Note.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!note) {
        res.status(404).json({ message: "Note not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
