// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { StrongPasswordOptions } from 'validator';

enum UserGender {
  Female = 'female',
  Male = 'male',
  Other = 'other',
}

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

const defaultMalePhotoUrl =
  'https://media.istockphoto.com/id/1223477625/vector/male-default-avatar-profile-icon-man-face-silhouette-person-placeholder-vector-illustration.jpg?s=170667a&w=0&k=20&c=CrHRmkAACHQyNhv-f3Mj_PpO5WLFJlXcL2QcUlYByP4=';

const defaultFemalePhotoUrl =
  'https://cdn.vectorstock.com/i/1000v/14/18/default-female-avatar-profile-picture-icon-grey-vector-34511418.jpg';

const strongPasswordValidationOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
} satisfies StrongPasswordOptions;

const userPasswordMaxLength = 32;

const strongPasswordMessage = `Password must be at least ${String(strongPasswordValidationOptions.minLength)} characters and include at least ${String(strongPasswordValidationOptions.minUppercase)} uppercase letter, ${String(strongPasswordValidationOptions.minLowercase)} lowercase letter, ${String(strongPasswordValidationOptions.minNumbers)} number, and ${String(strongPasswordValidationOptions.minSymbols)} symbol`;

const strongPasswordMinLengthMessage = `Password must be at least ${String(strongPasswordValidationOptions.minLength)} characters long`;

const userPasswordMaxLengthMessage = `Password must be less than ${String(userPasswordMaxLength)} characters`;

export const UserConstantsCollection = {
  UserGender,
  UserRole,
  defaultMalePhotoUrl,
  defaultFemalePhotoUrl,
  strongPasswordValidationOptions,
  userPasswordMaxLength,
  strongPasswordMessage,
  strongPasswordMinLengthMessage,
  userPasswordMaxLengthMessage,
};
