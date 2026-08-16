import type { UserFields } from './user.model.ts';

export type UserGender = 'female' | 'male' | 'other';

export interface UserTypeCollection {
  UserFields: UserFields;
  UserIdParams: Pick<UserFields, 'id'>;
  CreateUserInput: {
    input: Omit<UserFields, 'createdAt' | 'updatedAt' | 'id'>;
  };
}
