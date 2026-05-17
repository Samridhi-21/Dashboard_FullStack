import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

interface MongooseValidationError extends Error {
  errors: Record<string, { message: string }>;
}

interface MongooseDuplicateKeyError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    const validationErr = err as MongooseValidationError;
    const messages = Object.values(validationErr.errors).map((e) => e.message);
    message = messages.join('. ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID';
  } else if ('code' in err && (err as MongooseDuplicateKeyError).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (!env.isProduction && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
};

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError('Route not found', 404));
};
