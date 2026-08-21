import { model, Schema, type InferSchemaType } from 'mongoose';
import { ConnectionConstantsCollection } from './connection.constant.ts';

const connectionSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ConnectionConstantsCollection.CONNECTION_STATUS_ENUM),
        message: '{VALUE} is not a valid connection status',
      },
    },
  },
  {
    timestamps: true,
  },
);

export type ConnectionFieldsType = InferSchemaType<typeof connectionSchema> & {
  id: string;
};

export const Connection = model('Connection', connectionSchema);
