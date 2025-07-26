import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config";
import { User } from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    const decoded = jwt.verify(token, envConfig.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "Invalid token." });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, `${envConfig.JWT_SECRET}`, {
    expiresIn: "24h",
  });
};
