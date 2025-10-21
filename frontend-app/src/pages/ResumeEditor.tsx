import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '../contexts/ResumeContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { 
  FileText, 
  Save, 
  Download, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles,
  Eye,
  Settings,
  Loader2
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import AIAssistant from '../components/AIAssistant';
import LinkedInImport from '../components/LinkedInImport';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const ResumeEditor: React.FC = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { 
    currentResume, 
    loading, 
    error, 
    getResume, 
    createResume, 
    updateResume,
    setCurrentResume,
    downloadPDF
  } = useResume();

  const [isEditing, setIsEditing] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showLinkedInImport, setShowLinkedInImport] = useState(false);

  // Initialize resume data
  useEffect(() => {
    if (resumeId && resumeId !== 'new') {
      getResume(resumeId);
    } else if (resumeId === 'new') {
      // Create new resume template
      const newResume = {
        title: 'Untitled Resume',
        personalInfo: {
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          summary: ''
        },
        experience: [],
        education: [],
        skills: [],
        template: 'modern' as const,
        isPublic: false
      };
      setCurrentResume(newResume as any);
      setIsEditing(true);
    }
  }, [resumeId, user, getResume, setCurrentResume]);

  const handleSave = async () => {
    if (!currentResume) return;

    setSaving(true);
    try {
      if (resumeId === 'new' || !currentResume._id) {
        const savedResume = await createResume(currentResume);
        navigate(`/editor/${savedResume._id}`, { replace: true });
        showSuccess('Resume created', 'Your resume has been successfully created.');
      } else {
        await updateResume(currentResume._id, currentResume);
        showSuccess('Resume saved', 'Your changes have been saved successfully.');
      }
      setLastSaved(new Date());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save resume:', error);
      showError('Save failed', 'Failed to save your resume. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeChange = (updatedResume: any) => {
    setCurrentResume(updatedResume);
    setIsEditing(true);
  };

  const handleLinkedInImport = (importedData: any) => {
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      personalInfo: {
        ...currentResume.personalInfo,
        ...importedData.personalInfo
      },
      experience: importedData.experience || currentResume.experience,
      education: importedData.education || currentResume.education,
      skills: importedData.skills || currentResume.skills
    };
    
    setCurrentResume(updatedResume);
    setIsEditing(true);
    showSuccess('LinkedIn Import Complete', 'Your profile data has been imported successfully!');
  };

  const handleDownloadPDF = () => {
    if (!currentResume) return;
    
    downloadPDF(currentResume)
      .then(() => {
        showSuccess('PDF downloaded', 'Your resume has been downloaded successfully.');
      })
      .catch(error => {
        console.error('Failed to download PDF:', error);
        showError('Download failed', 'Failed to download PDF. Please try again.');
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading resume..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Resume</h2>
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

  if (!currentResume) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Resume Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">The resume you're looking for doesn't exist.</p>
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
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentResume.title}
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
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 border-purple-300 dark:border-purple-600"
              >
                AI Assistant
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                icon={<Settings />}
                onClick={() => setShowLinkedInImport(true)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border-blue-300 dark:border-blue-600"
              >
                Import LinkedIn
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                icon={<Download />}
                onClick={handleDownloadPDF}
              >
                Download PDF
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
          <ResumeForm 
            resume={currentResume}
            onChange={handleResumeChange}
          />
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <ResumePreview 
            resume={currentResume}
          />
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      {showAIAssistant && (
        <AIAssistant
          resume={currentResume}
          onClose={() => setShowAIAssistant(false)}
          onUpdateResume={handleResumeChange}
        />
      )}

      {/* LinkedIn Import Modal */}
      <LinkedInImport
        isOpen={showLinkedInImport}
        onClose={() => setShowLinkedInImport(false)}
        onImportSuccess={handleLinkedInImport}
      />
    </div>
  );
};

export default ResumeEditor;