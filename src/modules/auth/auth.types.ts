import type { UserFields } from '../user/user.model.ts';

export type LoginInput = Pick<UserFields, 'email' | 'password'>;

export interface AuthTypeCollection {
  LoginInput: { input: LoginInput };
  CreateUserInput: {
    input: Omit<UserFields, 'createdAt' | 'updatedAt' | 'id' | 'role'>;
  };
}
