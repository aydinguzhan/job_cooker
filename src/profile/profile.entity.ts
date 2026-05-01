// src/profile/profile.types.ts

export interface IUserProfile {
  userId: string;

  skills: {
    name: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    yearsExperience?: number;
  }[];

  yearsExperience: {
    companyName: string;
    position: string;
    startDate?: string;
    endDate?: string | null;
  }[];

  projects: {
    name: string;
    technologies: string[];
  }[];

  contactInfo: {
    github?: string;
    linkedin?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

export  type UpdateUserProfilePayload = Partial<
  Pick<IUserProfile, "skills" | "yearsExperience" | "projects" | "contactInfo">
>;