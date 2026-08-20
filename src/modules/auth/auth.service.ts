import argon2 from 'argon2';
import { JwtCollection } from '../../lib/jwt.ts';
import { User } from '../user/user.model.ts';
import { createUserInstance } from '../user/user.create.ts';
import type { AuthTypeCollection } from './auth.types.ts';
import { UserConstantsCollection } from '../user/user.constants.ts';
import mongoose from 'mongoose';

const signup = async ({ input }: { input: AuthTypeCollection['CreateUserInput'] }) => {
  if (!input.email || !input.password) {
    throw new Error('Name and email are required');
  }

  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const user = createUserInstance(input);
  // Schema rules run on the typed password (and the rest of the document). Nothing is written yet.
  await user.validate();
  // Replace the typed password with an Argon2 hash. We cannot get the original back.
  user.password = await argon2.hash(input.password);

  try {
    // Skip schema checks on save so minlength / isStrongPassword do not run on the generated hash.
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    // Unique email index: two signups at once can both pass findOne, then Mongo
    // rejects the second write with code 11000. Same meaning as "Email already exists".
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      throw new Error('Email already exists', { cause: error });
    }
    throw error;
  }

  const token = JwtCollection.generateAccessToken({ userId: user.id });

  return { user, token };
};

const login = async ({ input }: AuthTypeCollection['LoginInput']) => {
  if (!input.email || !input.password) {
    throw new Error('Invalid email or password');
  }

  if (
    !input.password ||
    input.password.length < UserConstantsCollection.strongPasswordValidationOptions.minLength ||
    input.password.length > UserConstantsCollection.userPasswordMaxLength
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

  // Generate access token
  const token = JwtCollection.generateAccessToken({ userId: user.id });

  return { user, token };
};

// ⚠️⬆️⚠️ Write all Auth Services above this line
// ✅ All Exports for authService

export const authService = { login, signup };
