import type { NextFunction, Request, Response } from "express"
import { prisma } from "../index.js"
import { ApiResponse } from "../utils/ApiResponseUtils.js"

export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobs = await prisma.job.findMany({
            select: {
                title: true,
                minSalary: true,
                maxSalary: true,
                jobType: true,
                country: true,
                city: true,
                isRemote: true,
                created_at: true,
                updated_at: true,
            }
        })
        res.status(200).json(ApiResponse.success(jobs, "All Jobs Fetched successfully"))
    } catch (error) {
        next(error)
    }
}

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if(!id){
            throw new Error("Id is required");
        }
        const job = await prisma.job.findUnique({
            where: {
                id: id
            },
            select: {
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
                jobLevel: true,
                country: true,
                city: true,
                isRemote: true,
                jobBenefits: true,
                description: true,
                created_at: true,
                updated_at: true,
            }
        })

        if(!job){
            throw new Error("Job not found")
        }

        res.status(200).json(ApiResponse.success(job, "Job fetched successfully"));
        
    } catch (error) {
        next(error);
    }
}