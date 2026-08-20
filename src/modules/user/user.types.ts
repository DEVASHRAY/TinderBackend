import type { UserFields } from './user.model.ts';

type NonUpdateableUserFieldsByAdmin = Pick<
  UserFields,
  'createdAt' | 'updatedAt' | 'id' | 'email' | 'password'
>;

type AdminOnlyUserUpdateInput = Partial<Omit<UserFields, keyof NonUpdateableUserFieldsByAdmin>>;

export interface UserTypeCollection {
  UserFields: UserFields;
  AdminOnlyUserUpdateInput: AdminOnlyUserUpdateInput;
}
