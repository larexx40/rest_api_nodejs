import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation Error: ", errors)
    const errorMessages = errors.array().map(err => ({
      field: err.type,
      message: err.msg
    }));
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  next();
};