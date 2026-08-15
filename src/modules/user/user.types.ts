export type UserGender = 'female' | 'male' | 'other';

export interface SignupBody {
  name?: string;
  email?: string;
  phoneNumber?: string;
  gender?: UserGender;
  age?: number;
  photoUrl?: string;
}

export interface CreateUserInput {
  input: SignupBody;
}

export interface GetUserBody {
  userId: string;
}

export interface UserTypes {
  SignupBody: SignupBody;
  CreateUserInput: CreateUserInput;
  GetUserBody: GetUserBody;
}

export type UserType = keyof UserTypes;
