import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { prisma } from "../../index.js";
import { ApiResponse } from "../../utils/ApiResponseUtils.js";

// Create Industry
export const createIndustry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if(!userId){
        throw new AppError("Unauthorized: User not authenticated", 401);
    }

    if (!name) {
        throw new Error("Name is required")
    }

    const existingIndustry = await prisma.industry.findUnique({
      where: { name },
    });

    if (existingIndustry) {
        return res.status(409).json(ApiResponse.error("Industry already exists."))
    }

    const industry = await prisma.industry.create({
      data: { name },
    });

    res.status(201).json(ApiResponse.success(industry, "Industry Created successfully"));
  } catch (error) {
    next(error)
  }
};

// Get all Industries
export const getIndustries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const industries = await prisma.industry.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(ApiResponse.success(industries, "Industries fetched successully"));
  } catch (error) {
    next(error)
  }
};

// // Get single Industry
export const getIndustryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if(!id){
        throw new Error("Id is required")
    }

    const industry = await prisma.industry.findUnique({
      where: { id },
    });

    if (!industry) {
        throw new Error("Industry not found.")
    }

    res.status(200).json(ApiResponse.success(industry, "Industry fetched successfully"));
  } catch (error) {
    next(error)
  }
};

// // Delete Industry
export const deleteIndustry = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { id } = req.params;

    if(!id){
        throw new Error("No id found")
    }

    await prisma.industry.delete({
      where: { id },
    });

    res.status(200).json(ApiResponse.success(null, 'Industry deleted successfully.'));
  } catch (error) {
   next(error)
  }
};
