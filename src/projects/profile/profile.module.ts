import ProfileController from './profile.controller';
import ProfileRepository from './profile.repository';
import ProfileService from './profile.service';

import { getMongoDb } from '../config/mongo-db';

let profileController: ProfileController | null = null;

export async function getProfileController() {
  if (profileController) {
    return profileController;
  }

  const db = await getMongoDb();

  const profileRepository = new ProfileRepository(db);

  const profileService = new ProfileService(profileRepository);

  profileController = new ProfileController(profileService);

  return profileController;
}