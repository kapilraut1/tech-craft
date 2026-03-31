"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const auth_1 = require("../middleware/auth");
const authRoute = express_1.default.Router();
exports.authRoute = authRoute;
authRoute.post("/register", auth_controller_1.authController.register);
authRoute.post("/login", auth_controller_1.authController.login);
authRoute.get("/me", auth_1.verifyToken, auth_controller_1.authController.getMe);
