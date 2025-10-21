import React, { useState } from 'react';
import { Linkedin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';

interface LinkedInImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (data: any) => void;
}

const LinkedInImport: React.FC<LinkedInImportProps> = ({ isOpen, onClose, onImportSuccess }) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { importLinkedInProfile } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleImport = async () => {
    if (!linkedinUrl.trim()) {
      setError('Please enter your LinkedIn profile URL');
      return;
    }

    if (!linkedinUrl.includes('linkedin.com')) {
      setError('Please enter a valid LinkedIn profile URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await importLinkedInProfile(linkedinUrl);
      
      if (result.success) {
        showSuccess('LinkedIn Import Successful', 'Your profile data has been imported successfully!');
        onImportSuccess(result.data);
        onClose();
        setLinkedinUrl('');
      } else {
        throw new Error(result.message || 'Import failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import LinkedIn profile';
      setError(errorMessage);
      showError('Import Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLinkedinUrl('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import LinkedIn Profile" size="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Linkedin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Import Your LinkedIn Profile
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Automatically populate your resume with your LinkedIn profile information
          </p>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Demo Mode
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This is a demonstration feature. In production, this would integrate with LinkedIn's API 
                to import your actual profile data. For now, it will populate sample professional data.
              </p>
            </div>
          </div>
        </div>

        {/* URL Input */}
        <div>
          <Input
            label="LinkedIn Profile URL"
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://www.linkedin.com/in/your-profile"
            error={error}
            icon={<Linkedin className="h-5 w-5" />}
            helperText="Enter your complete LinkedIn profile URL"
          />
        </div>

        {/* Features List */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            What will be imported:
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Personal information and contact details
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Professional summary and headline
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Work experience and job descriptions
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Education and certifications
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Skills and endorsements
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={loading || !linkedinUrl.trim()}
            loading={loading}
            icon={loading ? <Loader2 className="animate-spin" /> : <Linkedin />}
          >
            {loading ? 'Importing...' : 'Import Profile'}
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Your LinkedIn data is processed securely and never stored permanently. 
          You can review and edit all imported information before saving.
        </div>
      </div>
    </Modal>
  );
};

export default LinkedInImport;