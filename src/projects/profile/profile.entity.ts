// entities/profile.entity.ts

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface ProfileSkill {
  name: string;
  level: SkillLevel;
  category?: 'frontend' | 'backend' | 'database' | 'tool' | 'other';
}

export interface ProfileExperience {
  role: string;
  company: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  description: string;
}

export interface ProfileReference {
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
  _id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  title: string;
  description?: string;

  profileImage?: ProfileImage;

  skills: ProfileSkill[];
  experiences: ProfileExperience[];
  references: ProfileReference[];

  createdAt?: Date;
  updatedAt?: Date;
}
