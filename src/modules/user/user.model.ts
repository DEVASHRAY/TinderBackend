import mongoose from 'mongoose';
// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { InferSchemaType } from 'mongoose';
// Node needs a real file extension in imports (browsers/bundlers often hide this).

import validator from 'validator';
import { UserConstantsCollection } from './user.constants.ts';

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
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Please enter a valid email address',
      },
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [
        UserConstantsCollection.strongPasswordValidationOptions.minLength,
        UserConstantsCollection.strongPasswordMinLengthMessage,
      ],
      maxlength: [
        UserConstantsCollection.strongPasswordValidationOptions.userPasswordMaxLength,
        UserConstantsCollection.userPasswordMaxLengthMessage,
      ],
      validate: {
        // `isStrongPassword` returns true/false. It does not throw, so Mongoose
        // uses `message` (built from `strongPasswordOptions`) when this is false.
        validator: (value: string) =>
          validator.isStrongPassword(
            value,
            UserConstantsCollection.strongPasswordValidationOptions,
          ),
        message: UserConstantsCollection.strongPasswordMessage,
      },
      // `select: false` hides this path from `find` / `findById`. Mongo still stores it.
      // Load it on purpose with `.select('+password')`.
      select: false,
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be 10 digits'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: UserConstantsCollection.userGenders,
        // Mongoose replaces `{VALUE}` with whatever was sent (not a JS template string).
        message: '{VALUE} is not a valid gender type',
      },
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Age must be at least 18'],
    },
    photoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => validator.isURL(value, { require_protocol: true }),
        message: 'Please enter a valid photo URL',
      },
      default: function defaultPhotoByGender(this: {
        gender?: (typeof UserConstantsCollection.userGenders)[number];
      }) {
        // Mongoose calls this with the document as `this`. An arrow would not see `gender`.
        if (this.gender === 'male') {
          return UserConstantsCollection.defaultMalePhotoUrl;
        }

        if (this.gender === 'female') {
          return UserConstantsCollection.defaultFemalePhotoUrl;
        }

        return undefined;
      },
    },
  },
  {
    timestamps: true,
    // When we send a user in the API (`res.json`), Mongoose uses toJSON.
    toJSON: {
      // virtuals: extra fields Mongoose computes. `id` is one of them:
      // the same value as Mongo `_id`, written as a normal string.
      virtuals: true,
      // `__v` is Mongo's internal edit counter. The frontend does not need it.
      versionKey: false,
      // Last step before JSON leaves the server.
      // Drop `_id` (keep string `id`) and `password` even if we loaded the hash to verify login.
      transform: (_doc, ret: { _id?: mongoose.Types.ObjectId; password?: string }) => {
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
  },
);

export type UserFields = InferSchemaType<typeof userSchema> & {
  id: string;
};

export const User = mongoose.model('User', userSchema);
