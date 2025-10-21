import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCoverLetter } from '../contexts/CoverLetterContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { 
  FileText, 
  Save, 
  Download, 
  ArrowLeft, 
  Sparkles,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import CoverLetterForm from '../components/CoverLetterForm';
import CoverLetterPreview from '../components/CoverLetterPreview';
import CoverLetterAI from '../components/CoverLetterAI';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const CoverLetterEditor: React.FC = () => {
  const { coverLetterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { 
    currentCoverLetter, 
    loading, 
    error, 
    getCoverLetter, 
    createCoverLetter, 
    updateCoverLetter,
    setCurrentCoverLetter,
    downloadCoverLetterPDF
  } = useCoverLetter();

  const [isEditing, setIsEditing] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize cover letter data
  useEffect(() => {
    if (coverLetterId && coverLetterId !== 'new') {
      getCoverLetter(coverLetterId);
    } else if (coverLetterId === 'new') {
      // Create new cover letter template
      const newCoverLetter = {
        title: 'Untitled Cover Letter',
        companyName: '',
        jobTitle: '',
        hiringManagerName: '',
        content: {
          opening: '',
          body: [''],
          closing: ''
        },
        template: 'professional' as const
      };
      setCurrentCoverLetter(newCoverLetter as any);
      setIsEditing(true);
    }
  }, [coverLetterId, getCoverLetter, setCurrentCoverLetter]);

  const handleSave = async () => {
    if (!currentCoverLetter) return;

    setSaving(true);
    try {
      if (coverLetterId === 'new' || !currentCoverLetter._id) {
        const savedCoverLetter = await createCoverLetter(currentCoverLetter);
        navigate(`/cover-letter-editor/${savedCoverLetter._id}`, { replace: true });
        showSuccess('Cover letter created', 'Your cover letter has been successfully created.');
      } else {
        await updateCoverLetter(currentCoverLetter._id, currentCoverLetter);
        showSuccess('Cover letter saved', 'Your changes have been saved successfully.');
      }
      setLastSaved(new Date());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save cover letter:', error);
      showError('Save failed', 'Failed to save your cover letter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCoverLetterChange = (updatedCoverLetter: any) => {
    setCurrentCoverLetter(updatedCoverLetter);
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading cover letter..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Cover Letter</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentCoverLetter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cover Letter Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">The cover letter you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-green-600" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentCoverLetter.title}
                  </h1>
                  {lastSaved && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
              {isEditing && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 animate-pulse">
                  Unsaved changes
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                icon={<Sparkles />}
                onClick={() => setShowAI(!showAI)}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 border-purple-300 dark:border-purple-600"
              >
                AI Assistant
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={saving ? <Loader2 className="animate-spin" /> : <Save />}
                onClick={handleSave}
                disabled={saving || !isEditing}
                loading={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Form */}
        <div className="w-1/2 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <CoverLetterForm 
            coverLetter={currentCoverLetter}
            onChange={handleCoverLetterChange}
          />
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <CoverLetterPreview 
            coverLetter={currentCoverLetter}
          />
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      {showAI && (
        <CoverLetterAI
          coverLetter={currentCoverLetter}
          onClose={() => setShowAI(false)}
          onUpdateCoverLetter={handleCoverLetterChange}
        />
      )}
    </div>
  );
};

export default CoverLetterEditor;