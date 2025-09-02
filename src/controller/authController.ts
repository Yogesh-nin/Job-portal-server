import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SALT_ROUNDS } from "../utils/constants.js";
import bcrypt from "bcrypt";
import { prisma } from "../index.js";
import { ApiResponse } from "../utils/ApiResponseUtils.js";
import { AppError } from "../utils/AppError.js";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password } = req.body;
  try {

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res
      .status(200)
      .json(ApiResponse.success(user, "User Created successfully"));
  } catch (error) {
    next(error);
  }
};

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User Not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Email or Password is not correct", 400);
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res
      .status(200)
      .json(ApiResponse.success({ data: payload, token }, "Login Successful"));
  } catch (error) {
    next(error);
  }
};
