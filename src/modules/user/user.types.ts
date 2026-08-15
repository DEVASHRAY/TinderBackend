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
