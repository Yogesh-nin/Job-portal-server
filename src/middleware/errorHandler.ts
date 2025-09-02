import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponseUtils.js";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err);

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(
        ApiResponse.error(
          err.message,
          process.env.NODE_ENV === "development" ? err.stack : undefined
        )
      );
  }

 if (err instanceof PrismaClientKnownRequestError) {
    return res.status(400).json(
      ApiResponse.error(
        err.message // Already trimmed message (e.g. "Unique constraint failed on the fields: (`email`)")
      )
    );
  }

  // Prisma validation errors
  if (err instanceof PrismaClientValidationError) {
    return res.status(400).json(ApiResponse.error(err.message));
  }

  // Default: just send the message (without big Prisma debug dump)
  return res.status(500).json(ApiResponse.error(err.message));
};
