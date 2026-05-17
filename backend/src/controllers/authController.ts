import { Response } from 'express';
import * as authService from '../services/authService';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';

export const register = asyncHandler(async (req, res: Response) => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'sales';
  };

  const result = await authService.registerUser({ name, email, password, role });
  sendSuccess(res, 201, 'Registration successful', result);
});

export const login = asyncHandler(async (req, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const result = await authService.loginUser({ email, password });
  sendSuccess(res, 200, 'Login successful', result);
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.userId);
  sendSuccess(res, 200, 'User retrieved successfully', { user });
});
