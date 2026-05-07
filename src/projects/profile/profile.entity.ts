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

export interface ProfileEntity {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  description?: string;
  profileImage?: ProfileImage;
  skills: ProfileSkill[];
  experiences: ProfileExperience[];
  references: ProfileReference[];
  createdAt?: Date;
  updatedAt?: Date;
}
