import express from 'express';
import { getProfileController } from './profile.module';

const router = express.Router();

getProfileController().then(profileController => {
  router.post('/', profileController.createUserProfile.bind(profileController));
  router.get('/:userId', profileController.getUserIdForProfile.bind(profileController));
  router.put('/:userId', profileController.updatedProfileWithuserId.bind(profileController));
});

export default router;

