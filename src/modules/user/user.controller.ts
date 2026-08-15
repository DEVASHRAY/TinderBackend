// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { Request, Response } from 'express';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { userService } from './user.service.ts';
import type { UserTypes } from './user.types.ts';

// Role of `user.controller.ts`: "what came in through HTTP?"
// Flow: Route → Controller → Service → Model → Mongo. Response: Mongo → Model → Service → Controller → HTTP.
// This file: take `req.body` / `req.params` / `req.query` → call the service → `res.status` + `res.json`.
const createUser = async (
  req: Request<object, object, UserTypes['CreateUserInput']['input']>,
  res: Response,
) => {
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

const getUser = async (req: Request<Pick<UserTypes['Users'], 'userId'>>, res: Response) => {
  try {
    const userDetails = await userService.getUserDetails({ userId: req.params.userId });

    res.status(200).json({ message: 'User fetched', data: userDetails });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Failed to get user' });
    }
  }
};

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const allUsers = await userService.getAllUsers();
    res.status(200).json({ message: 'Users fetched', data: allUsers });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Failed to get users' });
    }
  }
};

const deleteUser = async (req: Request<Pick<UserTypes['Users'], 'userId'>>, res: Response) => {
  try {
    await userService.deleteUser({ userId: req.params.userId });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Failed to delete user' });
    }
  }
};

const updateUser = async (
  req: Request<
    Pick<UserTypes['Users'], 'userId'>,
    object,
    UserTypes['CreateUserInput']['input']
  >,
  res: Response,
) => {
  try {
    const user = await userService.updateUser({
      userId: req.params.userId,
      input: req.body,
    });
    res.status(200).json({ message: 'User updated', data: user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Failed to update user' });
    }
  }
};

// ⚠️⬆️⚠️ Write all User Routes Handlers above this line
// ✅ All Exports for userController
export const userController = {
  createUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
};
