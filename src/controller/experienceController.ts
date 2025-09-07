import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { prisma } from "../index.js";

export const getUserExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req?.user?.id;
  try {
    if (!userId) {
      throw new AppError("Unauthorized: User not authenticated", 401);
    }
    const existingProfile = await prisma.userProfile.findUnique({
      where: { user_id: userId },
    });

    

  } catch (error) {}
};
