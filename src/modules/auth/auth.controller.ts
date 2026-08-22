import { JwtConstantsCollection } from '../../lib/jwt.constants.ts';
import { authService } from './auth.service.ts';
import type { AuthTypeCollection } from './auth.types.ts';
import type { NextFunction, Request, Response } from 'express';

const signup = async (
  req: Request<object, object, AuthTypeCollection['CreateUserInput']>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, token } = await authService.signup({ input: req.body });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: JwtConstantsCollection.accessTokenExpirationMs,
    });
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
    const { user, token } = await authService.login({ input: req.body });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: JwtConstantsCollection.accessTokenExpirationMs,
    });
    res.status(200).json({ message: 'Login successful', data: user });
  } catch (error) {
    next(error);
  }
};

const logout = (_res: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

const signupBulk = async (
  req: Request<object, object, { users?: AuthTypeCollection['CreateUserInput'][] }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body.users) {
      throw new Error('Users are required');
    }

    const users = await authService.signupBulk({ users: req.body.users });
    res.status(201).json({ message: 'Users created successfully', data: users });
  } catch (error) {
    next(error);
  }
};

// ⚠️⬆️⚠️ Write all Auth Routes Handlers above this line
// ✅ All Exports for authController
export const authController = {
  signup,
  signupBulk,
  login,
  logout,
};
