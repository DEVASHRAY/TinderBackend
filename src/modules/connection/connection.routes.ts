import { Router } from 'express';
import { ConnectionController } from './connection.controller.ts';

export const connectionRouter = Router();

connectionRouter.post('/connection', ConnectionController.createConnection);

connectionRouter.patch('/connection/:connectionId', ConnectionController.updateConnection);

connectionRouter.get('/connection', ConnectionController.getConnections);
