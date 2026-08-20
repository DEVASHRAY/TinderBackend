import type { NextFunction, Request, Response } from 'express';
import { UserConstantsCollection } from '../modules/user/user.constants.ts';

// After authMiddleware. Only an admin may hit routes that change another user's data.
export const adminMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new Error('Unauthorized');
    }

    if (req.user.role !== UserConstantsCollection.UserRole.ADMIN) {
      throw new Error('Forbidden');
    }

    next();
  } catch (error) {
    next(error);
  }
};
