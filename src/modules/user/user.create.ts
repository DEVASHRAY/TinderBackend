import type { AuthTypeCollection } from '../auth/auth.types.ts';
import { UserConstantsCollection } from './user.constants.ts';
import { User } from './user.model.ts';

// Never pass `req.body` into `new User(...)`. Extra keys like `role` would be copied.
// Only the fields below are set; role is always USER.
export const createUserInstance = (input: AuthTypeCollection['CreateUserInput']) => {
  const user = new User({
    name: input.name,
    email: input.email,
    password: input.password,
    gender: input.gender,
    age: input.age,
    role: UserConstantsCollection.UserRole.USER,
  });

  if (input.phoneNumber) {
    user.phoneNumber = input.phoneNumber;
  }

  if (input.photoUrl) {
    user.photoUrl = input.photoUrl;
  }

  return user;
};
