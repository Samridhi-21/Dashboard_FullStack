import { Response } from 'express';
import { PaginationMeta } from '../types';

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  pagination?: PaginationMeta
): void => {
  const body: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    body.pagination = pagination;
  }

  res.status(statusCode).json(body);
};
