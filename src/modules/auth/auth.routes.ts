import { Router } from 'express';
import { authController } from './auth.controller.ts';

export const authRouter = Router();

authRouter.post('/login', authController.login);
