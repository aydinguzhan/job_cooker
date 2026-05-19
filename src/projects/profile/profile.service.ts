import { CreateProfilePayload, UpdateProfileExperiencesPayload, UpdateProfileReferencesPayload, UpdateProfileSkillsPayload, UserProfilesInfo } from './profile.entity';
import ProfileRepository from './profile.repository';

export default class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfileByUserId(userId: string) {
    return await this.profileRepository.getProfileByUserId(userId);
  }
  async createUserProfile( payload: CreateProfilePayload) {
    return await this.profileRepository.createProfile( payload as CreateProfilePayload);
  }
  async updatedUserInfo(payload :UserProfilesInfo){
    return await this.profileRepository.updatedUserInfo(payload);
  }
  async updateProfileSkills(payload :UpdateProfileSkillsPayload){
    return await this.profileRepository.updateProfileSkills(payload);
  }
  async updateProfileReferences(payload :UpdateProfileReferencesPayload){
    return await this.profileRepository.updateProfileReferences(payload);
  }
  async updateProfileExperiences(payload :UpdateProfileExperiencesPayload){
    return await this.profileRepository.updateProfileExperiences(payload);
  }

}
