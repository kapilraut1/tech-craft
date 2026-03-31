"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const data_source_1 = require("../data.source");
const user_entity_1 = require("../entities/user.entity");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env");
const userRepo = data_source_1.AppDataSource.getRepository(user_entity_1.User);
async function register(data) {
    const { email, password, name } = data;
    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
        const error = new Error("Email already registered");
        error.code = "ER_DUP_ENTRY";
        throw error;
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = userRepo.create({
        email,
        name,
        password_hash: hashedPassword,
    });
    return await userRepo.save(user);
}
async function login(email, pass) {
    const user = await userRepo.findOneBy({ email });
    if (!user)
        throw new Error("Invalid email or password");
    const isMatch = await bcryptjs_1.default.compare(pass, user.password_hash);
    if (!isMatch)
        throw new Error("Invalid email or password");
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: "1d" });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}
async function getUserById(id) {
    return await userRepo.findOneBy({ id });
}
exports.authService = {
    register,
    login,
    getUserById,
};
