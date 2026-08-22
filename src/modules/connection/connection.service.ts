import mongoose from 'mongoose';
import { User, type UserDocument } from '../user/user.model.ts';
import { ConnectionConstantsCollection } from './connection.constant.ts';
import { Connection } from './connection.model.ts';
import { getMinMaxUserIds } from './connection.pair.ts';
import type { ConnectionTypeCollection } from './connection.types.ts';

const createConnection = async ({
  user,
  receiverId,
  status,
}: {
  user: UserDocument;
  receiverId: string;
  status: ConnectionTypeCollection['CreateConnectionAllowedStatusType'];
}) => {
  // Check if the sender and receiver are the same
  if (user.id === receiverId) {
    throw new Error('Sender and receiver cannot be the same');
  }

  // Check if the status is allowed
  if (!ConnectionConstantsCollection.CreateConnectionAllowedStatus.includes(status)) {
    throw new Error('Invalid connection status');
  }

  // Find the receiver user
  const receiverUser = await User.findById(receiverId);

  if (!receiverUser) {
    throw new Error('Receiver user not found');
  }

  // A→B and B→A must hit the same unique pair, not two directed rows.
  const { minUserId, maxUserId } = getMinMaxUserIds({
    senderId: user.id,
    receiverId,
  });

  // $and = both fields must match (same as writing { minUserId, maxUserId } without $and).
  const connection = await Connection.findOne({
    $and: [{ minUserId }, { maxUserId }],
  });

  if (connection) {
    throw new Error('Connection already exists');
  }

  try {
    const newConnection = await Connection.create({
      senderId: user.id,
      receiverId,
      minUserId,
      maxUserId,
      status: ConnectionConstantsCollection.CONNECTION_STATUS_ENUM[status],
    });

    return newConnection;
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      throw new Error('Connection already exists', { cause: error });
    }
    throw error;
  }
};

const updateConnection = () => {
  return 'Done';
};

const getConnections = () => {
  return 'Connections fetched';
};

export const connectionService = {
  createConnection,
  updateConnection,
  getConnections,
};
