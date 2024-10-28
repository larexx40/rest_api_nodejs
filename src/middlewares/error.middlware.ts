import { time } from 'console';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Helper function to get formatted time
const getFormattedTime = () => {
  const currentTime = new Date();
  return currentTime.toLocaleString('en-US', {
    hour12: true,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// 405 Method Not Allowed Handler
const methodNotAllowedHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error(`Method Not Allowed - ${req.method}`);
  res.status(405).json({
    status: false,
    text: error.message,
    data: [],
    time: getFormattedTime(),
    method: req.method,
    endpoint: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    error: ['Invalid HTTP method', `${req.method} is not allowed on this route: ${req.originalUrl}`],
  });
  next(error);
};

// 404 Not Found Handler
const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    status: false,
    text: error.message,
    data: [],
    time: getFormattedTime(),
    method: req.method,
    endpoint: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    error: [],
  });
  next(error);
};

// Custom ApiError class
class ApiError extends Error {
  statusCode: number;
  error?: string[] | string | object;

  constructor(statusCode: number, message: string, error?: string[] | string | object) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

// General Error Handler Middleware
const apiErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentTime = getFormattedTime();
    const endpoint = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    if (err instanceof ApiError) {
      const { statusCode = 500, message, error } = err;
      let errorResponse: { status: boolean, message: string, data: [], time:string, method:string, endpoint: string, error: string[] | string | object  } = {
        status: false,
        message: message,
        data: [],
        time: currentTime,
        method: req.method,
        endpoint,
        error: [],
      };

      if (error) {
        if (typeof error === 'string') {
          errorResponse.error = [error];
        } else if (Array.isArray(error)) {
          errorResponse.error = error;
        } else if (Object.keys(error).length > 0) {
          errorResponse.error = error;
        }
      }
      res.status(statusCode).json(errorResponse);

    } else if (err instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(err.errors).map((er) => er.message);
      let errorResponse = {
        status: false,
        text: "Invalid data passed",
        data: [],
        time: currentTime,
        method: req.method,
        endpoint,
        error: validationErrors,
      };
      res.status(400).json(errorResponse);

    } else {
      let errorResponse = {
        status: false,
        text: err.message || 'Internal Server Error',
        data: [],
        time: currentTime,
        method: req.method,
        endpoint,
        error: [],
      };
      res.status(500).json(errorResponse);
    }
    next(err);
  } catch (error) {
    next(error);
  }
};

export { methodNotAllowedHandler, notFoundHandler, ApiError, apiErrorHandler };
