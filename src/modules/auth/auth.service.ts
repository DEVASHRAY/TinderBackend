import argon2 from 'argon2';
import { logger } from '../../lib/logger.ts';
import { User } from '../user/user.model.ts';
import type { AuthTypeCollection } from './auth.types.ts';
import { UserConstantsCollection } from '../user/user.constants.ts';

const login = async ({ input }: AuthTypeCollection['LoginInput']) => {
  try {
    if (!input.email || !input.password) {
      throw new Error('Invalid email or password');
    }

    if (
      !input.password ||
      input.password.length < UserConstantsCollection.strongPasswordValidationOptions.minLength ||
      input.password.length >
        UserConstantsCollection.strongPasswordValidationOptions.userPasswordMaxLength
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

export const authService = { login };
