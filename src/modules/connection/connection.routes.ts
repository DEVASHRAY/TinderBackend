import { Router } from 'express';
import { connectionController } from './connection.controller.ts';

export const connectionRouter = Router();

connectionRouter.post('/connection', connectionController.createConnection);

connectionRouter.patch('/connection/:connectionId', connectionController.updateConnection);

connectionRouter.get('/connection', connectionController.getConnections);
