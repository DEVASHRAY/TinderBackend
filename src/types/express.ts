import type { UserDocument } from '../modules/user/user.model.ts';

// Express does not know `req.user` by default. This file teaches TypeScript:
// after auth middleware, `req.user` is the logged-in user (or missing on public routes).
// Express only accepts this extra field through its `Express` namespace (not a normal export).
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Express request typing
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};
