import mongoose from 'mongoose';
import { logger } from '../../lib/logger.ts';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { User, type UserFields } from './user.model.ts';
import type { UserTypeCollection } from './user.types.ts';

// Role of `user.service.ts`: "what should the application do?"
// Flow: Route → Controller → Service → Model → Mongo. Response: Mongo → Model → Service → Controller → HTTP.
// This file: business rules and model calls. No `req` / `res`, no status codes.
const createUser = async ({ input }: UserTypeCollection['CreateUserInput']) => {
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
    // Unique email index: two signups at once can both pass findOne, then Mongo
    // rejects the second write with code 11000. Same meaning as "Email already exists".
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      throw new Error('Email already exists', { cause: error });
    }
    throw error;
  }
};

const getUserDetails = async ({ id }: UserTypeCollection['UserIdParams']) => {
  try {
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

const deleteUser = async ({ id }: UserTypeCollection['UserIdParams']) => {
  try {
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
  } catch (error) {
    logger.fail({ message: 'Failed to delete user', error });
    throw error;
  }
};

const updateUser = async ({
  id,
  input,
}: UserTypeCollection['UserIdParams'] & UserTypeCollection['CreateUserInput']) => {
  try {
    if (id === '') {
      throw new Error('User ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user id');
    }

    if (input.email) {
      throw new Error('Email cannot be updated');
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
