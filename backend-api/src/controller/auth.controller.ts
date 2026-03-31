import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { z } from "zod";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e: any) => e.message);
      return res.status(400).json({ message: errors[0], errors });
    }

    const user = await authService.register(parsed.data);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY" || error.message?.includes("duplicate")) {
      return res.status(409).json({ message: "Email already registered" });
    }
    res.status(400).json({ message: "Failed to register" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e: any) => e.message);
      return res.status(400).json({ message: errors[0], errors });
    }

    const result = await authService.login(
      parsed.data.email,
      parsed.data.password,
    );
    res.json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || "Invalid credentials" });
  }
};

const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await authService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error" });
  }
};

export const authController = {
  login,
  register,
  getMe,
};
