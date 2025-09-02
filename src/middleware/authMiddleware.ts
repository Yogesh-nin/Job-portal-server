import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
      console.log(authHeader)
      throw new AppError("Unauthorized: No token provided", 401);
    }
    const token = authHeader.split(" ")[1] as string;
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded)
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    next(error)

  }
};
