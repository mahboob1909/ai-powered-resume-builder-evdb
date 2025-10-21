import React, { useState } from 'react';
import { X, Sparkles, Loader2, FileText, Target, Lightbulb } from 'lucide-react';
import { useCoverLetter } from '../contexts/CoverLetterContext';
import { useResume } from '../contexts/ResumeContext';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import Card from './Card';

interface CoverLetterAIProps {
  coverLetter: any;
  onClose: () => void;
  onUpdateCoverLetter: (coverLetter: any) => void;
}

const CoverLetterAI: React.FC<CoverLetterAIProps> = ({ coverLetter, onClose, onUpdateCoverLetter }) => {
  const { generateAICoverLetter } = useCoverLetter();
  const { resumes } = useResume();
  const [activeTab, setActiveTab] = useState<'generate' | 'improve'>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generation Form
  const [generateForm, setGenerateForm] = useState({
    companyName: coverLetter.companyName || '',
    jobTitle: coverLetter.jobTitle || '',
    jobDescription: coverLetter.jobDescription || '',
    hiringManagerName: coverLetter.hiringManagerName || '',
    userBackground: '',
    tone: 'professional' as 'professional' | 'enthusiastic' | 'confident'
  });

  const [generatedContent, setGeneratedContent] = useState<any>(null);

  // Get user background from resume
  React.useEffect(() => {
    if (resumes.length > 0 && !generateForm.userBackground) {
      const latestResume = resumes[0];
      const background = `${latestResume.personalInfo?.summary || ''} Experience: ${latestResume.experience?.map(exp => `${exp.position} at ${exp.company}`).join(', ') || ''}`;
      setGenerateForm(prev => ({ ...prev, userBackground: background }));
    }
  }, [resumes, generateForm.userBackground]);

  const handleGenerate = async () => {
    if (!generateForm.companyName || !generateForm.jobTitle || !generateForm.jobDescription) {
      setError('Please fill in company name, job title, and job description');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await generateAICoverLetter(generateForm);
      setGeneratedContent(result);
    } catch (err) {
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyGeneratedContent = (section: 'opening' | 'body' | 'closing', content: string | string[]) => {
    const updatedCoverLetter = { ...coverLetter };
    
    if (section === 'body' && Array.isArray(content)) {
      updatedCoverLetter.content.body = content;
    } else if (typeof content === 'string') {
      updatedCoverLetter.content[section] = content;
    }
    
    // Also update company and job info if they were empty
    if (generateForm.companyName && !updatedCoverLetter.companyName) {
      updatedCoverLetter.companyName = generateForm.companyName;
    }
    if (generateForm.jobTitle && !updatedCoverLetter.jobTitle) {
      updatedCoverLetter.jobTitle = generateForm.jobTitle;
    }
    if (generateForm.hiringManagerName && !updatedCoverLetter.hiringManagerName) {
      updatedCoverLetter.hiringManagerName = generateForm.hiringManagerName;
    }
    
    onUpdateCoverLetter(updatedCoverLetter);
  };

  const applyFullCoverLetter = () => {
    if (!generatedContent) return;
    
    const updatedCoverLetter = {
      ...coverLetter,
      companyName: generateForm.companyName,
      jobTitle: generateForm.jobTitle,
      hiringManagerName: generateForm.hiringManagerName,
      jobDescription: generateForm.jobDescription,
      content: {
        opening: generatedContent.opening,
        body: generatedContent.body,
        closing: generatedContent.closing
      }
    };
    
    onUpdateCoverLetter(updatedCoverLetter);
  };

  const tabs = [
    { id: 'generate', label: 'Generate', icon: Sparkles },
    { id: 'improve', label: 'Improve', icon: Target }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Cover Letter AI</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-b-2 border-green-600 dark:border-green-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-green-600" />
                Generate AI Cover Letter
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Create a personalized cover letter tailored to the specific job and company.
              </p>
            </div>

            <Input
              label="Company Name"
              type="text"
              value={generateForm.companyName}
              onChange={(e) => setGenerateForm({ ...generateForm, companyName: e.target.value })}
              placeholder="e.g., Google"
            />

            <Input
              label="Job Title"
              type="text"
              value={generateForm.jobTitle}
              onChange={(e) => setGenerateForm({ ...generateForm, jobTitle: e.target.value })}
              placeholder="e.g., Senior Software Engineer"
            />

            <Input
              label="Hiring Manager Name (Optional)"
              type="text"
              value={generateForm.hiringManagerName}
              onChange={(e) => setGenerateForm({ ...generateForm, hiringManagerName: e.target.value })}
              placeholder="e.g., John Smith"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tone
              </label>
              <select
                value={generateForm.tone}
                onChange={(e) => setGenerateForm({ ...generateForm, tone: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="professional">Professional</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="confident">Confident</option>
              </select>
            </div>

            <Textarea
              label="Job Description"
              value={generateForm.jobDescription}
              onChange={(e) => setGenerateForm({ ...generateForm, jobDescription: e.target.value })}
              rows={4}
              placeholder="Paste the complete job description here..."
            />

            <Textarea
              label="Your Background"
              value={generateForm.userBackground}
              onChange={(e) => setGenerateForm({ ...generateForm, userBackground: e.target.value })}
              rows={3}
              placeholder="Brief summary of your relevant experience and skills..."
              helperText="This is auto-filled from your resume but you can customize it"
            />

            <Button
              onClick={handleGenerate}
              disabled={loading}
              loading={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Generate Cover Letter
            </Button>

            {generatedContent && (
              <Card className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-green-600" />
                    Generated Cover Letter
                  </h5>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={applyFullCoverLetter}
                    className="text-xs"
                  >
                    Apply All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {/* Opening */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Opening</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => applyGeneratedContent('opening', generatedContent.opening)}
                        className="text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {generatedContent.opening}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">Body Paragraphs</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => applyGeneratedContent('body', generatedContent.body)}
                        className="text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                    {generatedContent.body?.map((paragraph: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 dark:text-gray-300 mb-3 last:mb-0 whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Closing */}
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Closing</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => applyGeneratedContent('closing', generatedContent.closing)}
                        className="text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {generatedContent.closing}
                    </p>
                  </div>
                </div>

                {generatedContent.suggestions && (
                  <div className="mt-4">
                    <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Customization Tips:
                    </h6>
                    <ul className="space-y-1">
                      {generatedContent.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="text-xs text-gray-600 dark:text-gray-400">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {activeTab === 'improve' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2 text-green-600" />
                Improve Existing Content
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Get suggestions to improve your current cover letter content.
              </p>
            </div>

            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Content improvement features coming soon!</p>
              <p className="text-xs mt-2">
                This will analyze your current cover letter and provide specific suggestions for improvement.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterAI;