import { User, type UserDocument } from '../user/user.model.ts';
import { ConnectionConstantsCollection } from './connection.constant.ts';
import { Connection } from './connection.model.ts';
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

  // Check if the connection already exists

  const connection = await Connection.findOne({
    $or: [
      { senderId: user.id, receiverId },
      { senderId: receiverId, receiverId: user.id },
    ],
  });

  if (connection) {
    throw new Error('Connection already exists');
  }

  // Create the connection

  const newConnection = await Connection.create({
    senderId: user.id,
    receiverId,
    status: ConnectionConstantsCollection.CONNECTION_STATUS_ENUM[status],
  });

  return newConnection;
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
