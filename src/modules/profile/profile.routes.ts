import { Router } from 'express';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { profileController } from './profile.controller.ts';

export const profileRouter = Router();

profileRouter.get('/profile', profileController.getProfile);

profileRouter.get('/profile/:id', profileController.getProfileById);

profileRouter.patch('/profile/update', profileController.updateProfile);
