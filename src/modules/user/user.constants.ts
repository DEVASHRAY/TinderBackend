// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
// Node needs a real file extension in imports (browsers/bundlers often hide this).
import type { UserGender, UserTypes } from './user.types.ts';

export const userGenders: UserGender[] = ['female', 'male', 'other'];

export const userUpdateAllowedFields: (keyof Omit<UserTypes['Users'], 'userId' | 'email'>)[] = [
  'name',
  'phoneNumber',
  'gender',
  'age',
  'photoUrl',
];
