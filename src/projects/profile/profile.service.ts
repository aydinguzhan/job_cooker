import { ProfileEntity } from './profile.entity';
import ProfileRepository from './profile.repository';

export default class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getUserIdForProfile(userId: string) {
    return await this.profileRepository.getUserProfileWithUserId(userId);
  }
  async createUserProfile(userId: string, payload: ProfileEntity) {
    return await this.profileRepository.createProfile(userId, payload as ProfileEntity);
  }
  async updatedProfileWithuserId(userId: string, payload :Partial<ProfileEntity>){
    return await this.profileRepository.updateProfileWithUserId(userId,payload)
  }
}
