import type { NextFunction, Request, Response } from 'express';
import { connectionService } from './connection.service.ts';
import type { ConnectionTypeCollection } from './connection.types.ts';

const createConnection = async (
  req: Request<
    object,
    object,
    { receiverId?: string; status?: ConnectionTypeCollection['CreateConnectionAllowedStatusType'] }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, body } = req;
    // Check if the user is authenticated
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the receiver ID is provided
    if (!body.receiverId) {
      throw new Error('Receiver ID is required');
    }

    // Check if the status is provided
    if (!body.status) {
      throw new Error('Status is required');
    }

    // Call the connection service to create the connection
    const connection = await connectionService.createConnection({
      user,
      receiverId: body.receiverId,
      status: body.status,
    });

    // Return the response received from the connection service
    res.status(201).json({ message: 'Connection created', data: connection });
  } catch (error) {
    next(error);
  }
};

const updateConnection = async (
  req: Request<
    { connectionId?: string },
    object,
    { status?: ConnectionTypeCollection['UpdateConnectionAllowedStatusType'] }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, body, params } = req;

    if (!user) {
      throw new Error('User not found');
    }

    if (!params.connectionId) {
      throw new Error('Connection ID is required');
    }

    if (!body.status) {
      throw new Error('Status is required');
    }

    const updatedConnection = await connectionService.updateConnection({
      user,
      connectionId: params.connectionId,
      status: body.status,
    });

    res.status(200).json({ message: 'Connection updated', data: updatedConnection });
  } catch (error) {
    next(error);
  }
};

const getConnections = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'Connections fetched' });
  } catch (error) {
    next(error);
  }
};

export const ConnectionController = {
  getConnections,
  updateConnection,
  createConnection,
};
