import express from 'express';
import { getProfileController } from './profile.module';
import { authMiddleware } from '../../middleware/auth.middeware';

const router = express.Router();

getProfileController().then(profileController => {
  router.post('/', authMiddleware, profileController.createUserProfile.bind(profileController));
  router.get('/', authMiddleware, profileController.getProfileByUserId.bind(profileController));
  router.put('/userInfo',authMiddleware, profileController.updatedUserInfo.bind(profileController));
  router.put('/skills', authMiddleware, profileController.updateProfileSkills.bind(profileController));
  router.put('/referances',authMiddleware, profileController.updateProfileReferences.bind(profileController));
  router.put('/experiences',authMiddleware, profileController.updateProfileExperiences.bind(profileController));
});

export default router;

