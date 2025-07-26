import { Request, Response, Router } from "express";
import { generateToken } from "../middleware/auth";
import {
  handleValidationErrors,
  validateLogin,
  validateRegister,
} from "../middleware/validation";
import { User } from "../models/User";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  validateRegister,
  handleValidationErrors, // Add this back
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res
          .status(400)
          .json({ message: "User already exists with this email" });
        return;
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  validateLogin,
  handleValidationErrors, // Add this back
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Login request received");
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      console.log("user", user);

      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Use the comparePassword method from the User model
      const isPasswordValid = await user.comparePassword(password);
      console.log("isPasswordValid", isPasswordValid);

      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
