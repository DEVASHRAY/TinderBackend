import type { UserFields } from './user.model.ts';

export interface UserTypeCollection {
  UserFields: UserFields;
  UserIdParams: Pick<UserFields, 'id'>;
  UserUpdateInput: Pick<UserFields, 'id'> & {
    input: Partial<Omit<UserFields, 'createdAt' | 'updatedAt' | 'id' | 'email' | 'password'>>;
  };
}
