// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
// Node needs a real file extension in imports (browsers/bundlers often hide this).
import type { StrongPasswordOptions } from 'validator';
import type { UserGender } from './user.types.ts';

const userGenders: UserGender[] = ['female', 'male', 'other'];

const defaultMalePhotoUrl =
  'https://media.istockphoto.com/id/1223477625/vector/male-default-avatar-profile-icon-man-face-silhouette-person-placeholder-vector-illustration.jpg?s=170667a&w=0&k=20&c=CrHRmkAACHQyNhv-f3Mj_PpO5WLFJlXcL2QcUlYByP4=';

const defaultFemalePhotoUrl =
  'https://cdn.vectorstock.com/i/1000v/14/18/default-female-avatar-profile-picture-icon-grey-vector-34511418.jpg';

const userPasswordMaxLength = 32;

const strongPasswordOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
} satisfies StrongPasswordOptions;

const strongPasswordMessage = `Password must be at least ${String(strongPasswordOptions.minLength)} characters and include at least ${String(strongPasswordOptions.minUppercase)} uppercase letter, ${String(strongPasswordOptions.minLowercase)} lowercase letter, ${String(strongPasswordOptions.minNumbers)} number, and ${String(strongPasswordOptions.minSymbols)} symbol`;

const strongPasswordMinLengthMessage = `Password must be at least ${String(strongPasswordOptions.minLength)} characters long`;

const userPasswordMaxLengthMessage = `Password must be less than ${String(userPasswordMaxLength)} characters`;

// ⚠️👆⚠️ Write constant above and export them as a collection
export const UserConstantsCollection = {
  userGenders,
  defaultMalePhotoUrl,
  defaultFemalePhotoUrl,
  userPasswordMaxLength,
  strongPasswordOptions,
  strongPasswordMessage,
  strongPasswordMinLengthMessage,
  userPasswordMaxLengthMessage,
};
