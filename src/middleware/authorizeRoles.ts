import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(new AppError("Forbidden: You are not allowed to access this resource", 403));
    }

    next();
  };
};