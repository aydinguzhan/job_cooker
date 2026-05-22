// entities/profile.entity.ts

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface ProfileSkill {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface ProfileExperience {
  id: string;
  role: string;
  company: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  description: string;
}

export interface ProfileReference {
  referenceId?: string;
  name: string;
  email: string;
  title?: string;
  company?: string;
}

export interface ProfileImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export type CreateProfilePayload = {
  user_id: string;
  title: string;
  bio_description?: string;
  profile_image_path?: string;

  skills: {
    skill_id: string;
    level: number;
  }[];

  experiences: {
    company_name: string;
    company_location?: string;
    position_title: string;
    start_date: Date;
    end_date?: Date | null;
    is_current: boolean;
    description?: string;
  }[];

  references: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    company_name?: string;
    position_title?: string;
  }[];
};

export type UserProfilesInfo = {
  title: string;
  bio_description: string;
  profile_image_path?: string | null;
  user_id: string;
};

export type UpdateProfileSkillsPayload = {
  user_id: string;
  skills: {
    skill_id: string;
    level: number;
  }[];
};
export type UpdateProfileReferencesPayload = {
  user_id: string;

  references: {
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    position_title?: string | null;
  }[];
};
export type UpdateProfileExperiencesPayload = {
  user_id: string;

  experiences: {
    company_name: string;
    company_location?: string | null;
    position_title: string;
    start_date: string;
    end_date?: string | null;
    is_current: boolean;
    description?: string | null;
  }[];
};
