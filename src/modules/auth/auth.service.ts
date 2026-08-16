import argon2 from 'argon2';
import { logger } from '../../lib/logger.ts';
import { User } from '../user/user.model.ts';
import type { AuthTypeCollection } from './auth.types.ts';
import { UserConstantsCollection } from '../user/user.constants.ts';
import mongoose from 'mongoose';

const signup = async ({ input }: AuthTypeCollection['CreateUserInput']) => {
  try {
    if (!input.email || !input.password) {
      throw new Error('Name and email are required');
    }

    const existingUser = await User.findOne({ email: input.email });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = new User(input);
    // Runs schema rules (email, strong password, age, …) on what they typed.
    // Does not write to Mongo yet.
    await user.validate();
    // Turn the typed password into an Argon2 hash. We cannot get the original back.
    user.password = await argon2.hash(input.password);
    // Do not validate again: the hash is long and is not a "strong password",
    // so maxlength / isStrongPassword would fail even though the typed one passed.
    await user.save({ validateBeforeSave: false });
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

const login = async ({ input }: AuthTypeCollection['LoginInput']) => {
  try {
    if (!input.email || !input.password) {
      throw new Error('Invalid email or password');
    }

    if (
      !input.password ||
      input.password.length < UserConstantsCollection.strongPasswordValidationOptions.minLength ||
      input.password.length >
        UserConstantsCollection.userPasswordMaxLength
    ) {
      throw new Error('Invalid email or password');
    }

    // `select: false` on password: we must ask for the hash to verify it.
    const user = await User.findOne({ email: input.email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Reads salt + hash from the stored string; compares to what they typed.
    const isPasswordValid = await argon2.verify(user.password, input.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return user;
  } catch (error) {
    logger.fail({ message: 'Failed to log in', error });
    throw error;
  }
};

// ⚠️⬆️⚠️ Write all Auth Services above this line
// ✅ All Exports for authService

export const authService = { login, signup };
