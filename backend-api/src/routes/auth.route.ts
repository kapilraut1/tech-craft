import express from "express";
import { authController } from "../controller/auth.controller";
import { verifyToken } from "../middleware/auth";

const authRoute = express.Router();

authRoute.post("/register", authController.register);
authRoute.post("/login", authController.login);
authRoute.get("/me", verifyToken, authController.getMe);

export { authRoute };
