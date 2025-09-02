import Joi from "joi";
import type { Request, Response, NextFunction } from "express";

// 🔹 Signup validation schema
export const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 50 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
    "string.pattern.base": "Phone must be a valid 10-digit number",
  }),
  role: Joi.string().valid("job_seeker", "employer", "admin").default("job_seeker"),
});

// 🔹 Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});
