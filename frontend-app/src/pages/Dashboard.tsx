import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useResume } from '../contexts/ResumeContext';
import { useCoverLetter } from '../contexts/CoverLetterContext';
import { useToast } from '../hooks/useToast';
import { FileText, Plus, Settings, Crown, Calendar, Edit3, Trash2, Mail } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { resumes, loading, deleteResume } = useResume();
  const { coverLetters, loading: coverLetterLoading, deleteCoverLetter } = useCoverLetter();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleCreateResume = () => {
    navigate('/editor');
  };

  const handleCreateCoverLetter = () => {
    navigate('/cover-letter-editor/new');
  };

  const handleEditResume = (resumeId: string) => {
    navigate(`/editor/${resumeId}`);
  };

  const handleEditCoverLetter = (coverLetterId: string) => {
    navigate(`/cover-letter-editor/${coverLetterId}`);
  };

  const handleDeleteResume = async (resumeId: string, resumeTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${resumeTitle}"? This action cannot be undone.`)) {
      try {
        await deleteResume(resumeId);
        showSuccess('Resume deleted', `"${resumeTitle}" has been successfully deleted.`);
      } catch (error) {
        console.error('Failed to delete resume:', error);
        showError('Delete failed', 'Failed to delete resume. Please try again.');
      }
    }
  };

  const handleDeleteCoverLetter = async (coverLetterId: string, coverLetterTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${coverLetterTitle}"? This action cannot be undone.`)) {
      try {
        await deleteCoverLetter(coverLetterId);
        showSuccess('Cover letter deleted', `"${coverLetterTitle}" has been successfully deleted.`);
      } catch (error) {
        console.error('Failed to delete cover letter:', error);
        showError('Delete failed', 'Failed to delete cover letter. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-dark-950 dark:to-dark-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-md shadow-soft border-b-2 border-brand-gold/20 transition-colors duration-300 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-brand-gold" />
              <h1 className="text-2xl font-bold text-gradient-gold">ResumeAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                  <span className="text-dark-950 text-sm font-bold">
                    {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-brand-pirate-gold dark:text-brand-gold capitalize font-medium">
                    {user?.subscription} plan
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-brand-gold dark:text-gray-400 dark:hover:text-brand-gold transition-colors duration-300"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, <span className="text-gradient-gold">{user?.firstName}</span>!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Ready to create your next professional resume?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            hover
            onClick={handleCreateResume}
            variant="premium"
            className="bg-gradient-gold text-dark-950 cursor-pointer group shadow-gold hover:shadow-gold-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Plus className="h-8 w-8" />
              <div className="text-2xl font-bold group-hover:translate-x-1 transition-transform duration-200">→</div>
            </div>
            <h3 className="text-lg font-bold mb-2">Create New Resume</h3>
            <p className="text-dark-900/80">Start building your professional resume from scratch</p>
          </Card>

          <Card
            hover
            onClick={handleCreateCoverLetter}
            variant="premium"
            className="bg-brand-pirate-gold text-white cursor-pointer group shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Mail className="h-8 w-8" />
              <div className="text-2xl font-bold group-hover:translate-x-1 transition-transform duration-200">→</div>
            </div>
            <h3 className="text-lg font-bold mb-2">Create Cover Letter</h3>
            <p className="text-white/90">Write compelling cover letters that complement your resume</p>
          </Card>

          <Card hover variant="premium" className="bg-brand-yukon-gold text-white cursor-pointer group shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Crown className="h-8 w-8" />
              <div className="text-2xl font-bold group-hover:translate-x-1 transition-transform duration-200">→</div>
            </div>
            <h3 className="text-lg font-bold mb-2">Upgrade to Pro</h3>
            <p className="text-white/90">Unlock premium features and unlimited downloads</p>
          </Card>
        </div>

        {/* Recent Resumes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Resumes */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-brand-gold pl-3">Recent Resumes</h3>

            {loading ? (
              <Card className="text-center">
                <LoadingSpinner size="lg" text="Loading your resumes..." />
              </Card>
            ) : resumes.length === 0 ? (
              <Card variant="outlined" className="text-center">
                <FileText className="h-12 w-12 text-brand-gold mx-auto mb-4" />
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No resumes yet</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create your first resume to get started on your job search journey.
                </p>
                <Button
                  variant="primary"
                  icon={<Plus />}
                  onClick={handleCreateResume}
                >
                  Create Your First Resume
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {resumes.slice(0, 3).map((resume) => (
                  <Card key={resume._id} hover variant="default" className="group border-l-4 border-brand-gold/30 hover:border-brand-gold">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                          {resume.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <Calendar className="h-4 w-4 mr-1 text-brand-gold" />
                          {resume.updatedAt ? formatDate(resume.updatedAt.toString()) : 'Recently updated'}
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-gold/20 text-brand-yukon-gold dark:text-brand-gold capitalize">
                            {resume.template}
                          </span>
                          {resume.isPublic && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit3 />}
                        onClick={() => handleEditResume(resume._id!)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 />}
                        onClick={() => handleDeleteResume(resume._id!, resume.title)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
                {resumes.length > 3 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      And {resumes.length - 3} more resumes...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Cover Letters */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Cover Letters</h3>
          
            {coverLetterLoading ? (
              <Card className="text-center">
                <LoadingSpinner size="lg" text="Loading your cover letters..." />
              </Card>
            ) : coverLetters.length === 0 ? (
              <Card className="text-center">
                <Mail className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No cover letters yet</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create your first cover letter to complement your resume.
                </p>
                <Button
                  variant="secondary"
                  icon={<Plus />}
                  onClick={handleCreateCoverLetter}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Create Your First Cover Letter
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {coverLetters.slice(0, 3).map((coverLetter) => (
                  <Card key={coverLetter._id} hover className="group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                          {coverLetter.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {coverLetter.updatedAt ? formatDate(coverLetter.updatedAt.toString()) : 'Recently updated'}
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            {coverLetter.companyName}
                          </span>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
                            {coverLetter.template}
                          </span>
                        </div>
                      </div>
                    </div>
                  
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit3 />}
                        onClick={() => handleEditCoverLetter(coverLetter._id!)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 />}
                        onClick={() => handleDeleteCoverLetter(coverLetter._id!, coverLetter.title)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
                {coverLetters.length > 3 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      And {coverLetters.length - 3} more cover letters...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;