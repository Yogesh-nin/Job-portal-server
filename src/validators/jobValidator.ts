import Joi from "joi";
import { JobLevel, JobType, SalaryType } from "../generated/prisma/index.js";

export const createJobSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  jobRole: Joi.string().min(2).max(100).required(),
  tags: Joi.array().items(Joi.string()).min(1).required(),

  minSalary: Joi.number().positive().optional(),
  maxSalary: Joi.number().positive().optional(),

  salaryType: Joi.string()
    .valid(...Object.values(SalaryType))
    .optional(),

  education: Joi.string().min(2).max(100).required(),
  experience: Joi.string().min(1).max(100).required(),

  jobType: Joi.string()
    .valid(...Object.values(JobType))
    .required(),

  vacancy: Joi.number().integer().min(1).optional(),

  expirationDate: Joi.date().iso().optional(),

  jobLevel: Joi.string()
    .valid(...Object.values(JobLevel))
    .optional(),

  country: Joi.string().optional(),
  city: Joi.string().optional(),

  isRemote: Joi.boolean().optional(),

  jobBenefits: Joi.array().items(Joi.string()).optional(),

  description: Joi.string().min(10).required()
});
