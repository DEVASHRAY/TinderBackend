// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { NextFunction, Request, Response } from 'express';
import { JwtCollection } from '../lib/jwt.ts';
import { User } from '../modules/user/user.model.ts';

// `Cookie` is one header string (`token=...; other=...`). `req.cookies` is typed as `any`.
export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies as { token: string | undefined };

    if (!token) {
      throw new Error('Unauthorized');
    }

    const isValidToken = JwtCollection.verifyAccessToken({ token });

    if (!isValidToken.userId) {
      throw new Error('Unauthorized');
    }

    // Find User by ID
    const user = await User.findById(isValidToken.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Put the user on `req` so the next handler (protected route) can read `req.user`.
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
