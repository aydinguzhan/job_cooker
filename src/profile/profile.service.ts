import { IUserProfile } from './profile.entity';
import ProfileRepository from './profile.repository';

export default class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getUserIdForProfile(userId: string) {
    return await this.profileRepository.getUserProfileWithuerId(userId);
  }
  async createUserProfile(userId: string, payload: IUserProfile) {
    return await this.profileRepository.createProfile(userId, payload as IUserProfile);
  }
  async updatedProfileWithuserId(userId: string, payload :Partial<IUserProfile>){
    return await this.profileRepository.updatedProfileWithuserId(userId,payload)
  }
}
