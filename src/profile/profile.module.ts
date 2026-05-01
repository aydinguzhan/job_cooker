import ProfileController from './profile.controller';
import ProfileRepository from './profile.repository';
import ProfileService from './profile.service';

  const profileRepository = new ProfileRepository();
  const profileService = new ProfileService(profileRepository);
  const profileController = new ProfileController(profileService)

export { profileController };
