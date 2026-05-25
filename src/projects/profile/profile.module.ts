import ProfileController from './profile.controller';
import ProfileRepository from './profile.repository';
import ProfileService from './profile.service';
import { db } from '../config/database';
import RefdataRepository from '../lookup/refdatas/refdata.repostiory';

let profileController: ProfileController | null = null;

export async function getProfileController() {
  if (profileController) {
    return profileController;
  }

  const profileRepository = new ProfileRepository(db);
  const refdataRepository = new RefdataRepository(db);

  const profileService = new ProfileService(profileRepository, refdataRepository);

  profileController = new ProfileController(profileService);

  return profileController;
}
