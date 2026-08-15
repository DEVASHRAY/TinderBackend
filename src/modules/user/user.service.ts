import { logger } from '../../lib/logger.ts';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { User } from './user.model.ts';
// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { CreateUserInput } from './user.types.ts';

// Role of `user.service.ts`: "what should the application do?"
// Flow: Route → Controller → Service → Model → Mongo. Response: Mongo → Model → Service → Controller → HTTP.
// This file: business rules and model calls. No `req` / `res`, no status codes.
const createUser = async ({ input }: CreateUserInput) => {
  try {
    if (input.email !== undefined && input.email !== '') {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser !== null) {
        throw new Error('Email already exists');
      }
    }

    const user = await User.create(input);
    return user;
  } catch (error) {
    logger.fail({ message: 'Failed to create user', error });
    throw error;
  }
};

export const userService = {
  createUser,
};
