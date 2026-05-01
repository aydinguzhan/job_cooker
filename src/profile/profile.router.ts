import express from 'express';
import { profileController } from './profile.module';

const router = express.Router();
router.post('/:userId',profileController.createUserProfile.bind(profileController));
router.get('/:userId',profileController.getUserIdForProfile.bind(profileController))
router.put('/:userId',profileController.updatedProfileWithuserId.bind(profileController))

export default router;
