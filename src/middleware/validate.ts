import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
import { AppError } from "../utils/AppError.js";

export const validate =
  (schema: ObjectSchema, property: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next(new AppError(message, 400));
    }
    next();
  };
