import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const alertSchema = z.object({
  country: z.string().min(1, "Country is required").max(100),
  city: z.string().min(1, "City is required").max(100),
  visaType: z.enum(["Tourist", "Business", "Student"], {
    message: "Visa type must be Tourist, Business, or Student",
  }),
  status: z.enum(["Active", "Booked", "Expired"]).optional(),
});

const updateAlertSchema = z
  .object({
    country: z.string().min(1).max(100).optional(),
    city: z.string().min(1).max(100).optional(),
    visaType: z.enum(["Tourist", "Business", "Student"]).optional(),
    status: z.enum(["Active", "Booked", "Expired"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const validateAlert = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = alertSchema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation failed",
        details: error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    } else {
      next(error);
    }
  }
};

export const validateUpdateAlert = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = updateAlertSchema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation failed",
        details: error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    } else {
      next(error);
    }
  }
};
