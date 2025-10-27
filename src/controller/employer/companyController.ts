import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../index.js";
import { ApiResponse } from "../../utils/ApiResponseUtils.js";
import type { Company } from "../../generated/prisma/index.js";
import { AppError } from "../../utils/AppError.js";

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { name, industryId, aboutUs, organizationType, teamSize, foundedAt, company_url, vision, email } = req.body as Company;

    if (!name || !industryId) {
       throw new Error("Name and industryId are required.");
    }

    // check if industry exists
    const industry = await prisma.industry.findUnique({
      where: { id: industryId },
    });

    if (!industry) {
      throw new AppError("Industry not found", 404)
    }

    // create company
    const company = await prisma.company.create({
      data: {
        name,
        aboutUs,
        organizationType,
        teamSize,
        foundedAt,
        company_url,
        vision,
        email,
        industry: { connect: { id: industryId } },
        users: { connect: { id: userId } },
      },
      include: {
        industry: true,
        users: true,
      },
    });

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id; // Assuming company ID is passed as a URL parameter
    const { name, industryId, aboutUs, organizationType, teamSize, foundedAt, company_url, vision, email } = req.body as Partial<Company>;

    // Check if company exists and belongs to the user

    if(!companyId){
      throw new AppError("Company Id not provided", 400);
    }

    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        users: {
          some: { id: userId }, // Ensure the user is associated with the company
        },
      },
    });

    if (!company) {
      throw new AppError("Company not found or you don't have permission to edit", 404);
    }

    // If industryId is provided, verify it exists
    if (industryId) {
      const industry = await prisma.industry.findUnique({
        where: { id: industryId },
      });

      if (!industry) {
        throw new AppError("Industry not found", 404);
      }
    }

    // Update company with provided fields
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: name ?? company.name, // Only update if provided, else keep existing
        aboutUs: aboutUs ?? company.aboutUs,
        organizationType: organizationType ?? company.organizationType,
        teamSize: teamSize ?? company.teamSize,
        foundedAt: foundedAt ?? company.foundedAt,
        company_url: company_url ?? company.company_url,
        vision: vision ?? company.vision,
        email: email ?? company.email,
        industry: industryId ? { connect: { id: industryId } } : undefined, // Only update industry if provided
      },
      include: {
        industry: true,
        users: true,
      },
    });

    res.status(200).json(ApiResponse.success(updatedCompany, "Company updated successfully"))

  } catch (error: any) {
    next(error);
  }
};