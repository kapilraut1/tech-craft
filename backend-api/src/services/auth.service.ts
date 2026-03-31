import { AppDataSource } from "../data.source";
import { User } from "../entities/user.entity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../env";

const userRepo = AppDataSource.getRepository(User);

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

async function register(data: RegisterData) {
  const { email, password, name } = data;

  const existingUser = await userRepo.findOneBy({ email });
  if (existingUser) {
    const error: any = new Error("Email already registered");
    error.code = "ER_DUP_ENTRY";
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepo.create({
    email,
    name,
    password_hash: hashedPassword,
  });

  return await userRepo.save(user);
}

async function login(email: string, pass: string) {
  const user = await userRepo.findOneBy({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(pass, user.password_hash);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "1d" },
  );

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

async function getUserById(id: number) {
  return await userRepo.findOneBy({ id });
}

export const authService = {
  register,
  login,
  getUserById,
};
