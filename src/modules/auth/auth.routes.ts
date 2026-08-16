import { Router } from 'express';
import { authController } from './auth.controller.ts';

export const authRouter = Router();

authRouter.post('/signup', authController.signup);

authRouter.post('/login', authController.login);
