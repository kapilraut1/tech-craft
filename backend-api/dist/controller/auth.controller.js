"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters"),
    email: zod_1.z.string().email("Please provide a valid email address"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(128, "Password must be at most 128 characters"),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Please provide a valid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
const register = async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((e) => e.message);
            return res.status(400).json({ message: errors[0], errors });
        }
        const user = await auth_service_1.authService.register(parsed.data);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        if (error.code === "ER_DUP_ENTRY" || error.message?.includes("duplicate")) {
            return res.status(409).json({ message: "Email already registered" });
        }
        res.status(400).json({ message: "Failed to register" });
    }
};
const login = async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((e) => e.message);
            return res.status(400).json({ message: errors[0], errors });
        }
        const result = await auth_service_1.authService.login(parsed.data.email, parsed.data.password);
        res.json({
            message: "Login successful",
            token: result.token,
            user: result.user,
        });
    }
    catch (error) {
        res.status(401).json({ message: error.message || "Invalid credentials" });
    }
};
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await auth_service_1.authService.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.authController = {
    login,
    register,
    getMe,
};
