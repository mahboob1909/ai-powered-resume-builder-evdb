import mongoose, { Schema, Document } from 'mongoose';

export interface ICoverLetterContent {
  opening: string;
  body: string[];
  closing: string;
}

export interface ICoverLetter extends Document {
  userId: string;
  resumeId?: string;
  title: string;
  companyName: string;
  jobTitle: string;
  hiringManagerName?: string;
  content: ICoverLetterContent;
  jobDescription?: string;
  template: string;
  createdAt: Date;
  updatedAt: Date;
}

const coverLetterContentSchema = new Schema<ICoverLetterContent>({
  opening: { type: String, required: true, trim: true },
  body: [{ type: String, required: true, trim: true }],
  closing: { type: String, required: true, trim: true },
});

const coverLetterSchema = new Schema<ICoverLetter>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  resumeId: {
    type: String,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  hiringManagerName: {
    type: String,
    trim: true,
  },
  content: {
    type: coverLetterContentSchema,
    required: true,
  },
  jobDescription: {
    type: String,
    trim: true,
  },
  template: {
    type: String,
    required: true,
    enum: ['professional', 'modern', 'creative'],
    default: 'professional',
  },
}, {
  timestamps: true,
});

// Index for efficient queries
coverLetterSchema.index({ userId: 1, createdAt: -1 });

export const CoverLetter = mongoose.model<ICoverLetter>('CoverLetter', coverLetterSchema);