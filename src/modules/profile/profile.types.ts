import type { UserFields } from '../user/user.model.ts';

type NonUpdateableUserFieldsByUser = Pick<
  UserFields,
  'createdAt' | 'updatedAt' | 'id' | 'email' | 'password' | 'role'
>;

type UpdatableUserFieldsByUser = Partial<Omit<UserFields, keyof NonUpdateableUserFieldsByUser>>;

export interface ProfileTypeCollection {
  UpdatableUserFieldsByUser: UpdatableUserFieldsByUser;
}
