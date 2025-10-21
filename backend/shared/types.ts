export interface User {
  _id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  googleId?: string;
  profilePicture?: string;
  subscription: 'free' | 'pro' | 'executive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Resume {
  _id?: string;
  userId: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  template: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  location: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  honors?: string;
}

export interface AIGenerationRequest {
  jobTitle: string;
  jobDescription: string;
  experienceLevel: 'entry' | 'mid' | 'senior';
}

export interface AIGenerationResponse {
  bulletPoints: string[];
  suggestions: string[];
}

export interface CoverLetter {
  _id?: string;
  userId: string;
  resumeId?: string;
  title: string;
  companyName: string;
  jobTitle: string;
  hiringManagerName?: string;
  content: {
    opening: string;
    body: string[];
    closing: string;
  };
  jobDescription?: string;
  template: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoverLetterGenerationRequest {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  hiringManagerName?: string;
  userBackground: string;
  tone: 'professional' | 'enthusiastic' | 'confident';
}