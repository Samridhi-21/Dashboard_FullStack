import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUserDocument } from '../models/User';
import { JwtPayload, UserRole } from '../types';
import { AppError } from '../utils/AppError';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
};

const formatUser = (user: IUserDocument): AuthResponse['user'] => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerUser = async (input: RegisterInput): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    role: input.role ?? 'sales',
  });

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user: formatUser(user), token };
};

export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user: formatUser(user), token };
};

export const getCurrentUser = async (userId: string): Promise<AuthResponse['user']> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return formatUser(user);
};
