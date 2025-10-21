import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary: string;
}

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  location: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  honors?: string;
}

interface Resume {
  _id?: string;
  userId: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  template: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AIGenerationRequest {
  jobTitle: string;
  jobDescription: string;
  experienceLevel: 'entry' | 'mid' | 'senior';
}

interface AIGenerationResponse {
  bulletPoints: string[];
  suggestions: string[];
}

interface ResumeContextType {
  resumes: Resume[];
  currentResume: Resume | null;
  loading: boolean;
  error: string | null;
  fetchResumes: () => Promise<void>;
  getResume: (id: string) => Promise<Resume | null>;
  createResume: (resumeData: Omit<Resume, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Resume>;
  updateResume: (id: string, resumeData: Partial<Resume>) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
  setCurrentResume: (resume: Resume | null) => void;
  generateAIBulletPoints: (request: AIGenerationRequest) => Promise<AIGenerationResponse>;
  analyzeJobDescription: (jobDescription: string, currentResume: Resume) => Promise<any>;
  generateSummary: (request: any) => Promise<any>;
  optimizeContent: (request: any) => Promise<any>;
  downloadPDF: (resume: Resume) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

interface ResumeProviderProps {
  children: ReactNode;
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ children }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const API_BASE_URL = 'http://localhost:3002/api';
  const PDF_API_BASE_URL = 'http://localhost:3003/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchResumes = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }

      const data = await response.json();
      setResumes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const getResume = async (id: string): Promise<Resume | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resume');
      }

      const resume = await response.json();
      setCurrentResume(resume);
      return resume;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resume');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (resumeData: Omit<Resume, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Resume> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create resume');
      }

      const newResume = await response.json();
      setResumes(prev => [newResume, ...prev]);
      setCurrentResume(newResume);
      return newResume;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resume');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateResume = async (id: string, resumeData: Partial<Resume>): Promise<Resume> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update resume');
      }

      const updatedResume = await response.json();
      setResumes(prev => prev.map(resume => resume._id === id ? updatedResume : resume));
      setCurrentResume(updatedResume);
      return updatedResume;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resume');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }

      setResumes(prev => prev.filter(resume => resume._id !== id));
      if (currentResume?._id === id) {
        setCurrentResume(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resume');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateAIBulletPoints = async (request: AIGenerationRequest): Promise<AIGenerationResponse> => {
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-bullets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI content');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI content');
      throw err;
    }
  };

  const analyzeJobDescription = async (jobDescription: string, currentResume: Resume) => {
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ai/analyze-job`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ jobDescription, currentResume }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze job description');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze job description');
      throw err;
    }
  };

  const generateSummary = async (request: any) => {
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-summary`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
      throw err;
    }
  };

  const optimizeContent = async (request: any) => {
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ai/optimize-content`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize content');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize content');
      throw err;
    }
  };

  const downloadPDF = async (resume: Resume): Promise<void> => {
    setError(null);
    
    try {
      const response = await fetch(`${PDF_API_BASE_URL}/pdf/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(resume),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.personalInfo.firstName}_${resume.personalInfo.lastName}_Resume.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchResumes();
    } else {
      setResumes([]);
      setCurrentResume(null);
    }
  }, [user]);

  const value = {
    resumes,
    currentResume,
    loading,
    error,
    fetchResumes,
    getResume,
    createResume,
    updateResume,
    deleteResume,
    setCurrentResume,
    generateAIBulletPoints,
    analyzeJobDescription,
    generateSummary,
    optimizeContent,
    downloadPDF,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};