"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("5000").transform(Number),
    DB_HOST: zod_1.z.string(),
    DB_USERNAME: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
    DB_PORT: zod_1.z.string().regex(/^\d+$/).default("3306").transform(Number),
    DB_NAME: zod_1.z.string(),
    NODE_ENV: zod_1.z.string().default("development"),
    JWT_SECRET: zod_1.z.string(),
    FRONTEND_URL: zod_1.z.string(),
});
const envData = envSchema.safeParse(process.env);
if (!envData.success) {
    console.error("Invalid environment variables:", envData.error.format());
    process.exit(1);
}
exports.env = envData.data;
