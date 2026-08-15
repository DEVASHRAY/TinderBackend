import mongoose from 'mongoose';
import { logger } from '../../lib/logger.ts';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { User } from './user.model.ts';
// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { UserTypes } from './user.types.ts';
import { userUpdateAllowedFields } from './user.constants.ts';

// Role of `user.service.ts`: "what should the application do?"
// Flow: Route → Controller → Service → Model → Mongo. Response: Mongo → Model → Service → Controller → HTTP.
// This file: business rules and model calls. No `req` / `res`, no status codes.
const createUser = async ({ input }: UserTypes['CreateUserInput']) => {
  try {
    if (input.name === '' || input.email === '') {
      throw new Error('Name and email are required');
    }

    const existingUser = await User.findOne({ email: input.email });

    if (existingUser !== null) {
      throw new Error('Email already exists');
    }

    const user = await User.create(input);
    return user;
  } catch (error) {
    logger.fail({ message: 'Failed to create user', error });
    throw error;
  }
};

const getUserDetails = async ({ userId }: Pick<UserTypes['Users'], 'userId'>) => {
  try {
    if (userId === '') {
      throw new Error('User ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user id');
    }

    const user = await User.findById(userId);

    if (user === null) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    logger.fail({ message: 'Failed to get user details', error });
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find();

    return users;
  } catch (error) {
    logger.fail({ message: 'Failed to get all users', error });

    throw error;
  }
};

const deleteUser = async ({ userId }: Pick<UserTypes['Users'], 'userId'>) => {
  try {
    if (userId === '') {
      throw new Error('User ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user id');
    }

    const user = await User.findById(userId);

    if (user === null) {
      throw new Error('User not found');
    }

    await user.deleteOne();

    return { message: 'User deleted' };
  } catch (error) {
    logger.fail({ message: 'Failed to delete user', error });
    throw error;
  }
};

const updateUser = async ({
  userId,
  input,
}: Pick<UserTypes['Users'], 'userId'> & UserTypes['CreateUserInput']) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user id');
    }

    if (input.email) {
      throw new Error('Email cannot be updated');
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    userUpdateAllowedFields.forEach((field) => {
      const value = input[field];
      if (value) {
        user.set(field, value);
      }
    });

    await user.save();

    return user;
  } catch (error) {
    logger.fail({ message: 'Failed to update user', error });
    throw error;
  }
};

// ⚠️⬆️⚠️ Write all User Service Functions above this line
// ✅ All Exports for userService
export const userService = {
  createUser,
  getUserDetails,
  getAllUsers,
  deleteUser,
  updateUser,
};
