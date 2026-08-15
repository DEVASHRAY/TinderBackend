// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { Request, Response } from 'express';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { userService } from './user.service.ts';
import type { UserTypes } from './user.types.ts';

// Role of `user.controller.ts`: "what came in through HTTP?"
// Flow: Route → Controller → Service → Model → Mongo. Response: Mongo → Model → Service → Controller → HTTP.
// This file: take `req.body` / `req.params` / `req.query` → call the service → `res.status` + `res.json`.
const createUser = async (req: Request<object, object, UserTypes['SignupBody']>, res: Response) => {
  try {
    const user = await userService.createUser({ input: req.body });
    res.status(201).json({ message: 'User signed up', data: user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Failed to sign up' });
    }
  }
};

const getUser = async (req: Request<UserTypes['GetUserBody']>, res: Response) => {
  try {
    const userId = req.params.userId;

    const userDetails = await userService.getUserDetails({ userId });

    res.status(200).json({ message: 'User fetched', data: userDetails });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Failed to get user' });
    }
  }
};

// ⚠️⬆️⚠️ Write all User Routes Handlers above this line
// ✅ All Exports for userController
export const userController = {
  createUser,
  getUser,
};
