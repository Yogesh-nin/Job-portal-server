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
  const id = req.user?.id;
  try {
    if (!id) {
      throw new AppError("Id is required", 500);
    }
    const userProfile = await prisma.user.findUnique({
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

      console.log({ experiences, educations})

      if (experiences && experiences.length > 0) {
        await tx.experience.createMany({
          data: experiences?.map((exp) => ({
            userProfileId: newProfile.id,
            companyName: exp.companyName,
            location: exp.location ?? "",
            startDate: exp.startDate ?? null,
            endDate: exp.endDate ?? null,
            description: exp.description ?? '',
          })),
        });
      }

      if (educations && educations.length > 0) {
        await tx.education.createMany({
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

export const updateUserProfile = async (
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

    // Check if profile exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { user_id: userId },
      include: { experiences: true, educations: true },
    });

    if (!existingProfile) {
      throw new AppError("Profile not found", 404);
    }

    const profile = await prisma.$transaction(async (tx) => {
      // Update basic profile information
      const updatedProfile = await tx.userProfile.update({
        where: { user_id: userId },
        data: {
          skills: skills ?? existingProfile.skills,
          resume_url: resume_url ?? existingProfile.resume_url,
          linkedin: linkedin ?? existingProfile.linkedin,
          portfolio: portfolio ?? existingProfile.portfolio,
        },
      });

      // Handle experiences
      if (experiences && experiences.length > 0) {
        // Delete existing experiences
        await tx.experience.deleteMany({
          where: { userProfileId: existingProfile.id },
        });

        // Create new experiences
        await tx.experience.createMany({
          data: experiences.map((exp) => ({
            userProfileId: existingProfile.id,
            companyName: exp.companyName,
            location: exp.location ?? "",
            startDate: exp.startDate ?? null,
            endDate: exp.endDate ?? null,
            description: exp.description ?? "",
          })),
        });
      }

      // Handle educations
      if (educations && educations.length > 0) {
        // Delete existing educations
        await tx.education.deleteMany({
          where: { userProfileId: existingProfile.id },
        });

        // Create new educations
        await tx.education.createMany({
          data: educations.map((edu) => ({
            userProfileId: existingProfile.id,
            school: edu.school,
            duration: edu.duration ?? "",
            cgpa: edu.cgpa ?? null,
            description: edu.description ?? "",
          })),
        });
      }

      return updatedProfile;
    });

    // Fetch the complete updated profile
    const fullProfile = await prisma.userProfile.findUnique({
      where: { id: profile.id },
      include: {
        experiences: true,
        educations: true,
      },
    });

    res.status(200).json(
      ApiResponse.success(fullProfile, "User Profile Updated Successfully")
    );
  } catch (error) {
    next(error);
  }
};

export const deleteUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string;
    if (!userId) {
      throw new AppError("Unauthorized: User not authenticated", 401);
    }

    // Check if profile exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { user_id: userId },
    });

    if (!existingProfile) {
      throw new AppError("Profile not found", 404);
    }

    await prisma.$transaction(async (tx) => {
      // Delete associated experiences
      await tx.experience.deleteMany({
        where: { userProfileId: existingProfile.id },
      });

      // Delete associated educations
      await tx.education.deleteMany({
        where: { userProfileId: existingProfile.id },
      });

      // Delete the user profile
      await tx.userProfile.delete({
        where: { user_id: userId },
      });
    });

    res.status(200).json(
      ApiResponse.success(null, "User Profile Deleted Successfully")
    );
  } catch (error) {
    next(error);
  }
};