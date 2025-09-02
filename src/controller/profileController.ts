import type { NextFunction, Request, Response } from "express";
import { prisma } from "../index.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponseUtils.js";
import type { CreateProfileInput } from "../interface/profile.js";

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  try {
    if (!id) {
      throw new AppError("Id is required", 500);
    }
    const userProfile = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true,
        created_at: true,
      },
    });

    if (!userProfile) {
      throw new AppError("User not found", 404);
    }

    res
      .status(200)
      .json(ApiResponse.success(userProfile, "User Fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const createUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string;
    if (!userId) {
      throw new AppError("Unauthorized: User not authenticated", 401);
    }

    const {
      resume_url,
      skills,
      linkedin,
      portfolio,
      experiences,
      educations,
    }: CreateProfileInput = req.body;

    const profile = await prisma.$transaction(async (tx) => {
      const newProfile = await tx.userProfile.create({
        data: {
          user_id: userId,
          skills,
          resume_url: resume_url ?? "",
          linkedin: linkedin ?? "",
          portfolio: portfolio ?? "",
        },
      });

      if (experiences && experiences.length) {
        tx.experience.createMany({
          data: experiences?.map((exp) => ({
            userProfileId: newProfile.id,
            companyName: exp.companyName,
            location: exp.location ?? "",
            startDate: exp.startDate ?? "",
            endDate: exp.endDate,
            description: exp.description,
          })),
        });
      }

      if (educations && educations.length) {
        tx.education.createMany({
          data: educations.map((edu) => ({
            userProfileId: newProfile.id,
            school: edu.school,
            duration: edu.duration ?? "",
            cgpa: edu.cgpa ?? null,
            description: edu.description ?? "",
          })),
        });
      }
      return newProfile;
    });

    const fullProfile = await prisma.userProfile.findUnique({
      where: { id: profile.id },
      include: {
        experiences: true,
        educations: true,
      },
    });

    res.status(200).json(ApiResponse.success(fullProfile, "User Profile Successfully"))

  } catch (error) {
    next(error)
  }
};
