import ProfileController from './profile.controller';
import ProfileRepository from './profile.repository';
import ProfileService from './profile.service';
import { db } from '../config/database';


let profileController: ProfileController | null = null;

export async function getProfileController() {
  if (profileController) {
    return profileController;
  }


  const profileRepository = new ProfileRepository(db,);

  const profileService = new ProfileService(profileRepository);

  profileController = new ProfileController(profileService);

  return profileController;
}