import { Router } from 'express';
import { authController } from './auth.controller.ts';

export const authRouter = Router();

authRouter.post('/signup', authController.signup);

authRouter.post('/signup/bulk', authController.signupBulk);

authRouter.post('/login', authController.login);

authRouter.get('/logout', authController.logout);
