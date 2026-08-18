import mongoose from 'mongoose';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { User, type UserFields } from './user.model.ts';
import type { UserTypeCollection } from './user.types.ts';

// Role of `user.service.ts`: "what should the application do?"
// Flow: Route → Controller → Service → Model → Mongo. Response: Mongo → Model → Service → Controller → HTTP.
// This file: business rules and model calls. No `req` / `res`, no status codes, no logger.
// `throw` is not caught here — it goes to the controller `catch`, then error middleware.

const getUserDetails = async ({ id }: UserTypeCollection['UserIdParams']) => {
  if (id === '') {
    throw new Error('User ID is required');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user id');
  }

  const user = await User.findById(id);

  if (user === null) {
    throw new Error('User not found');
  }

  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const deleteUser = async ({ id }: UserTypeCollection['UserIdParams']) => {
  if (id === '') {
    throw new Error('User ID is required');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user id');
  }

  const user = await User.findById(id);

  if (user === null) {
    throw new Error('User not found');
  }

  await user.deleteOne();

  return { message: 'User deleted' };
};

const updateUser = async ({ id, input }: UserTypeCollection['UserUpdateInput']) => {
  if (!id) {
    throw new Error('User ID is required');
  }

  const user = await User.findById(id);

  if (user === null) {
    throw new Error('User not found');
  }

  const userUpdateAllowedFields: (keyof Omit<
    UserFields,
    'createdAt' | 'updatedAt' | 'email' | 'password' | 'id'
  >)[] = ['name', 'phoneNumber', 'gender', 'age', 'photoUrl'];

  userUpdateAllowedFields.forEach((field) => {
    const value = input[field];
    if (value !== undefined && value !== '') {
      user.set(field, value);
    }
  });

  await user.save();

  return user;
};

// ⚠️⬆️⚠️ Write all User Service Functions above this line
// ✅ All Exports for userService
export const userService = {
  getUserDetails,
  getAllUsers,
  deleteUser,
  updateUser,
};
