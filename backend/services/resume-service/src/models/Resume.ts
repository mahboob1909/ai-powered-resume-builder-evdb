import mongoose, { Schema, Document } from 'mongoose';

export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary: string;
}

export interface IWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  location: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  honors?: string;
}

export interface IResume extends Document {
  userId: string;
  title: string;
  personalInfo: IPersonalInfo;
  experience: IWorkExperience[];
  education: IEducation[];
  skills: string[];
  template: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const personalInfoSchema = new Schema<IPersonalInfo>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  website: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  summary: { type: String, required: true, trim: true },
});

const workExperienceSchema = new Schema<IWorkExperience>({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: [{ type: String, trim: true }],
  location: { type: String, required: true, trim: true },
});

const educationSchema = new Schema<IEducation>({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  field: { type: String, required: true, trim: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  gpa: { type: String, trim: true },
  honors: { type: String, trim: true },
});

const resumeSchema = new Schema<IResume>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  personalInfo: {
    type: personalInfoSchema,
    required: true,
  },
  experience: [workExperienceSchema],
  education: [educationSchema],
  skills: [{
    type: String,
    trim: true,
  }],
  template: {
    type: String,
    required: true,
    enum: ['modern', 'classic', 'creative', 'minimal'],
    default: 'modern',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
resumeSchema.index({ userId: 1, createdAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);