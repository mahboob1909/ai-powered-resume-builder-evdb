import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CoverLetterContent {
  opening: string;
  body: string[];
  closing: string;
}

interface CoverLetter {
  _id?: string;
  userId: string;
  resumeId?: string;
  title: string;
  companyName: string;
  jobTitle: string;
  hiringManagerName?: string;
  content: CoverLetterContent;
  jobDescription?: string;
  template: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CoverLetterGenerationRequest {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  hiringManagerName?: string;
  userBackground: string;
  tone: 'professional' | 'enthusiastic' | 'confident';
}

interface CoverLetterContextType {
  coverLetters: CoverLetter[];
  currentCoverLetter: CoverLetter | null;
  loading: boolean;
  error: string | null;
  fetchCoverLetters: () => Promise<void>;
  getCoverLetter: (id: string) => Promise<CoverLetter | null>;
  createCoverLetter: (coverLetterData: Omit<CoverLetter, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<CoverLetter>;
  updateCoverLetter: (id: string, coverLetterData: Partial<CoverLetter>) => Promise<CoverLetter>;
  deleteCoverLetter: (id: string) => Promise<void>;
  setCurrentCoverLetter: (coverLetter: CoverLetter | null) => void;
  generateAICoverLetter: (request: CoverLetterGenerationRequest) => Promise<any>;
  downloadCoverLetterPDF: (coverLetter: CoverLetter) => Promise<void>;
}

const CoverLetterContext = createContext<CoverLetterContextType | undefined>(undefined);

export const useCoverLetter = () => {
  const context = useContext(CoverLetterContext);
  if (context === undefined) {
    throw new Error('useCoverLetter must be used within a CoverLetterProvider');
  }
  return context;
};

interface CoverLetterProviderProps {
  children: ReactNode;
}

export const CoverLetterProvider: React.FC<CoverLetterProviderProps> = ({ children }) => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [currentCoverLetter, setCurrentCoverLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const API_BASE_URL = 'http://localhost:3002/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchCoverLetters = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/cover-letters`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cover letters');
      }

      const data = await response.json();
      setCoverLetters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cover letters');
    } finally {
      setLoading(false);
    }
  };

  const getCoverLetter = async (id: string): Promise<CoverLetter | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/cover-letters/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cover letter');
      }

      const coverLetter = await response.json();
      setCurrentCoverLetter(coverLetter);
      return coverLetter;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cover letter');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCoverLetter = async (coverLetterData: Omit<CoverLetter, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<CoverLetter> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/cover-letters`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(coverLetterData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create cover letter');
      }

      const newCoverLetter = await response.json();
      setCoverLetters(prev => [newCoverLetter, ...prev]);
      setCurrentCoverLetter(newCoverLetter);
      return newCoverLetter;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create cover letter');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCoverLetter = async (id: string, coverLetterData: Partial<CoverLetter>): Promise<CoverLetter> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/cover-letters/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(coverLetterData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cover letter');
      }

      const updatedCoverLetter = await response.json();
      setCoverLetters(prev => prev.map(cl => cl._id === id ? updatedCoverLetter : cl));
      setCurrentCoverLetter(updatedCoverLetter);
      return updatedCoverLetter;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cover letter');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoverLetter = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/cover-letters/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete cover letter');
      }

      setCoverLetters(prev => prev.filter(cl => cl._id !== id));
      if (currentCoverLetter?._id === id) {
        setCurrentCoverLetter(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete cover letter');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateAICoverLetter = async (request: CoverLetterGenerationRequest) => {
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-cover-letter`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter');
      throw err;
    }
  };

  const downloadCoverLetterPDF = async (coverLetter: CoverLetter): Promise<void> => {
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3003/api/pdf/generate-cover-letter`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(coverLetter),
      });

      if (!response.ok) {
        throw new Error('Failed to generate cover letter PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${coverLetter.companyName}_${coverLetter.jobTitle}_Cover_Letter.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download cover letter PDF');
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCoverLetters();
    } else {
      setCoverLetters([]);
      setCurrentCoverLetter(null);
    }
  }, [user]);

  const value = {
    coverLetters,
    currentCoverLetter,
    loading,
    error,
    fetchCoverLetters,
    getCoverLetter,
    createCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
    setCurrentCoverLetter,
    generateAICoverLetter,
    downloadCoverLetterPDF,
  };

  return <CoverLetterContext.Provider value={value}>{children}</CoverLetterContext.Provider>;
};