import { authService } from './auth.service.ts';
import type { AuthTypeCollection } from './auth.types.ts';
import type { NextFunction, Request, Response } from 'express';

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

export const authController = {
  login,
};
