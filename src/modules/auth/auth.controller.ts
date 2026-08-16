import { authService } from './auth.service.ts';
import type { AuthTypeCollection } from './auth.types.ts';
import type { NextFunction, Request, Response } from 'express';

const signup = async (
  req: Request<object, object, AuthTypeCollection['CreateUserInput']['input']>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.signup({ input: req.body });
    res.status(201).json({ message: 'User created successfully', data: user });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request<object, object, AuthTypeCollection['LoginInput']['input']>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.login({ input: req.body });
    res.status(200).json({ message: 'Login successful', data: user });
  } catch (error) {
    next(error);
  }
};

// ⚠️⬆️⚠️ Write all Auth Routes Handlers above this line
// ✅ All Exports for authController
export const authController = {
  signup,
  login,
};
