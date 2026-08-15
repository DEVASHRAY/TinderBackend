import mongoose from 'mongoose';
// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { InferSchemaType } from 'mongoose';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
import { userGenders } from './user.constants.ts';

// A schema is Mongoose's blueprint for one MongoDB collection: field names, types, and rules.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: userGenders,
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type UserFields = InferSchemaType<typeof userSchema>;

export const User = mongoose.model('User', userSchema);
