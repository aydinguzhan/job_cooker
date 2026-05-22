import {
  CreateProfilePayload,
  UpdateProfileExperiencesPayload,
  UpdateProfileReferencesPayload,
  UpdateProfileSkillsPayload,
  UserProfilesInfo,
} from './profile.entity';
import ProfileRepository from './profile.repository';

export default class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfileByUserId(userId: string) {
    return await this.profileRepository.getProfileByUserId(userId);
  }
  async createUserProfile(payload: CreateProfilePayload) {
    return await this.profileRepository.createProfile(payload as CreateProfilePayload);
  }
  async updatedUserInfo(payload: UserProfilesInfo) {
    return await this.profileRepository.updatedUserInfo(payload);
  }
  async updateProfileSkills(payload: UpdateProfileSkillsPayload) {
    return await this.profileRepository.updateProfileSkills(payload);
  }
  async updateProfileReferences(payload: UpdateProfileReferencesPayload) {
    return await this.profileRepository.updateProfileReferences(payload);
  }
  async updateProfileExperiences(payload: UpdateProfileExperiencesPayload) {
    return await this.profileRepository.updateProfileExperiences(payload);
  }
  async postAiGeneratedProfile(prompt: string) {
    const response = await fetch('http://localhost:8081/ai/profile/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);

      throw new Error(errorBody?.message || 'AI profile generate request failed');
    }

    const result = await response.json();

    return result.data;
  }
}
