// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { NextFunction, Request, Response } from 'express';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { userService } from './user.service.ts';
import type { UserTypeCollection } from './user.types.ts';

// Role of `user.controller.ts`: "what came in through HTTP?"
// Flow: Route → Controller → Service → Model → Mongo. Response: Mongo → Model → Service → Controller → HTTP.
// This file: take `req.body` / `req.params` / `req.query` → call the service → `res.status` + `res.json`.

const getUser = async (
  req: Request<UserTypeCollection['UserIdParams']>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userDetails = await userService.getUserDetails({ id: req.params.id });

    res.status(200).json({ message: 'User fetched', data: userDetails });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await userService.getAllUsers();
    res.status(200).json({ message: 'Users fetched', data: allUsers });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (
  req: Request<UserTypeCollection['UserIdParams']>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await userService.deleteUser({ id: req.params.id });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req: Request<
    UserTypeCollection['UserIdParams'],
    object,
    UserTypeCollection['UserUpdateInput']['input']
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.updateUser({
      id: req.params.id,
      input: req.body,
    });
    res.status(200).json({ message: 'User updated', data: user });
  } catch (error) {
    next(error);
  }
};

// ⚠️⬆️⚠️ Write all User Routes Handlers above this line
// ✅ All Exports for userController
export const userController = {
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
};
