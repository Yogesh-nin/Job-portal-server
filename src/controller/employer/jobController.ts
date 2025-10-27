import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { prisma } from "../../index.js";
import type { Job } from "../../generated/prisma/index.js";
import { ApiResponse } from "../../utils/ApiResponseUtils.js";

export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const jobPayload = req.body as Job;
  try {
    if (!userId) {
      throw new AppError("Unauthorized: User not authenticated", 401);
    }

     const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true },
    });

    if(!user?.companyId){
      throw new AppError("User is not registered with any organization", 404);
    }

    const job = await prisma.job.create({
      data: {
        ...jobPayload,
        userId,
        companyId: user?.companyId
      },
    });

    res.status(200).json(ApiResponse.success(job, "Job Created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getUserJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.user.id;
  try {
    if (!id) {
      throw new AppError("Unauthorized: User not authenticated", 401);
    }

    const allJobs = await prisma.job.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        title: true,
        jobRole: true,
        tags: true,
        minSalary: true,
        maxSalary: true,
        salaryType: true,
        education: true,
        experience: true,
        jobType: true,
        vacancy: true,
        expirationDate: true,
        jobLevel: true,
        country: true,
        city: true,
        isRemote: true,
        jobBenefits: true,
        description: true,
        created_at: true
      },
    });

    res.status(200).json(ApiResponse.success(allJobs, "Jobs Fetched successfully"))
  } catch (error) {
    next(error);
  }
};
