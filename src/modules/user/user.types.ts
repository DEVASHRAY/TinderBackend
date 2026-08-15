export type UserGender = 'female' | 'male' | 'other';

export interface Users {
  userId: string;
  email: string;
  name: string;
  phoneNumber?: string;
  gender?: UserGender;
  age?: number;
  photoUrl?: string;
}

export interface CreateUserInput {
  input: Omit<Users, 'userId'>;
}

export interface UserTypes {
  Users: Users;
  CreateUserInput: CreateUserInput;
}

export type UserType = keyof UserTypes;
