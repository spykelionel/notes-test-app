import bcrypt from "bcryptjs";
import { User } from "../models/User";

export const seedDefaultUser = async (): Promise<void> => {
  try {
    // Check if default user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });

    if (!existingUser) {
      // Create default user
      const hashedPassword = await bcrypt.hash("password123", 12);

      const defaultUser = new User({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      });

      await defaultUser.save();
      console.log("✅ Default user created successfully");
      console.log("📧 Email: test@example.com");
      console.log("�� Password: password123");
    } else {
      console.log("ℹ️  Default user already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default user:", error);
  }
};
