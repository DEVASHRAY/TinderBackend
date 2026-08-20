import type { UserFields } from '../user/user.model.ts';

type LoginInput = Pick<UserFields, 'email' | 'password'>;

type CreateUserFields = Omit<UserFields, 'createdAt' | 'updatedAt' | 'id' | 'role'>;

export interface AuthTypeCollection {
  LoginInput: { input: LoginInput };
  CreateUserInput: CreateUserFields;
}
