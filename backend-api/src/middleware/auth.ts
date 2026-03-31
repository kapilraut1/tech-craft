import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../controller/auth.controller";
import { env } from "../env";

interface UserPayload extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const secret = env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as UserPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
