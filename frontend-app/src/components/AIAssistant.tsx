import React, { useState } from 'react';
import { X, Sparkles, Loader2, Lightbulb, Target, Zap, FileText, TrendingUp, Award } from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import Card from './Card';

interface AIAssistantProps {
  resume: any;
  onClose: () => void;
  onUpdateResume: (resume: any) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ resume, onClose, onUpdateResume }) => {
  const { generateAIBulletPoints, analyzeJobDescription, generateSummary, optimizeContent } = useResume();
  const [activeTab, setActiveTab] = useState<'bullets' | 'analysis' | 'summary' | 'optimize'>('bullets');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Bullet Points Generation
  const [bulletForm, setBulletForm] = useState({
    jobTitle: '',
    jobDescription: '',
    experienceLevel: 'mid' as 'entry' | 'mid' | 'senior'
  });
  const [generatedBullets, setGeneratedBullets] = useState<any>(null);

  // Job Analysis
  const [jobAnalysisText, setJobAnalysisText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Summary Generation
  const [summaryForm, setSummaryForm] = useState({
    jobTitle: '',
    experienceLevel: 'mid' as 'entry' | 'mid' | 'senior',
    keySkills: resume.skills?.slice(0, 5) || [],
    industryFocus: ''
  });
  const [generatedSummary, setGeneratedSummary] = useState<any>(null);

  // Content Optimization
  const [optimizeForm, setOptimizeForm] = useState({
    content: '',
    contentType: 'bullet' as 'summary' | 'bullet' | 'skill',
    targetKeywords: []
  });
  const [optimizedResult, setOptimizedResult] = useState<any>(null);

  const handleGenerateBullets = async () => {
    if (!bulletForm.jobTitle || !bulletForm.jobDescription) {
      setError('Please fill in both job title and description');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await generateAIBulletPoints(bulletForm);
      setGeneratedBullets(result);
    } catch (err) {
      setError('Failed to generate bullet points. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeJob = async () => {
    if (!jobAnalysisText.trim()) {
      setError('Please paste a job description to analyze');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await analyzeJobDescription(jobAnalysisText, resume);
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze job description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!summaryForm.jobTitle) {
      setError('Please enter a job title');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await generateSummary(summaryForm);
      setGeneratedSummary(result);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeContent = async () => {
    if (!optimizeForm.content.trim()) {
      setError('Please enter content to optimize');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await optimizeContent(optimizeForm);
      setOptimizedResult(result);
    } catch (err) {
      setError('Failed to optimize content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addBulletToResume = (bullet: string, experienceIndex: number) => {
    const updatedResume = { ...resume };
    if (updatedResume.experience[experienceIndex]) {
      updatedResume.experience[experienceIndex].description.push(bullet);
      onUpdateResume(updatedResume);
    }
  };

  const applySummaryToResume = (summary: string) => {
    const updatedResume = { ...resume };
    updatedResume.personalInfo.summary = summary;
    onUpdateResume(updatedResume);
  };

  const tabs = [
    { id: 'bullets', label: 'Bullet Points', icon: Zap },
    { id: 'analysis', label: 'Job Analysis', icon: Target },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'optimize', label: 'Optimize', icon: TrendingUp }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <h3 className="text-lg font-semibold">AI Assistant</h3>
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
              className={`px-3 py-3 text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-b-2 border-purple-600 dark:border-purple-400'
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

        {activeTab === 'bullets' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-purple-600" />
                Generate AI-Powered Bullet Points
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Get tailored bullet points for your work experience based on job requirements.
              </p>
            </div>

            <Input
              label="Job Title"
              type="text"
              value={bulletForm.jobTitle}
              onChange={(e) => setBulletForm({ ...bulletForm, jobTitle: e.target.value })}
              placeholder="e.g., Software Engineer"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience Level
              </label>
              <select
                value={bulletForm.experienceLevel}
                onChange={(e) => setBulletForm({ ...bulletForm, experienceLevel: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            <Textarea
              label="Job Description"
              value={bulletForm.jobDescription}
              onChange={(e) => setBulletForm({ ...bulletForm, jobDescription: e.target.value })}
              rows={4}
              placeholder="Paste the job description here..."
            />

            <Button
              onClick={handleGenerateBullets}
              disabled={loading}
              loading={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Generate Bullet Points
            </Button>

            {generatedBullets && (
              <Card className="mt-6">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-green-600" />
                  Generated Content
                </h5>
                
                <div className="space-y-3 mb-4">
                  {generatedBullets.bulletPoints?.map((bullet: string, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">• {bullet}</p>
                      {resume.experience.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {resume.experience.map((exp: any, expIndex: number) => (
                            <button
                              key={expIndex}
                              onClick={() => addBulletToResume(bullet, expIndex)}
                              className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                            >
                              Add to {exp.position || `Experience ${expIndex + 1}`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {generatedBullets.keywords && (
                  <div className="mb-3">
                    <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Key Keywords:</h6>
                    <div className="flex flex-wrap gap-1">
                      {generatedBullets.keywords.map((keyword: string, index: number) => (
                        <span key={index} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {generatedBullets.suggestions && (
                  <div>
                    <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Tips:</h6>
                    <ul className="space-y-1">
                      {generatedBullets.suggestions.map((suggestion: string, index: number) => (
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

        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2 text-purple-600" />
                Job Description Analysis
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Analyze how well your resume matches a specific job posting and get improvement suggestions.
              </p>
            </div>

            <Textarea
              label="Job Description"
              value={jobAnalysisText}
              onChange={(e) => setJobAnalysisText(e.target.value)}
              rows={6}
              placeholder="Paste the complete job description here for analysis..."
            />

            <Button
              onClick={handleAnalyzeJob}
              disabled={loading}
              loading={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Analyze Match
            </Button>

            {analysisResult && (
              <Card className="mt-6">
                <div className="space-y-4">
                  {/* Overall Score */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">Overall Match Score</h5>
                      <span className={`text-lg font-bold ${
                        analysisResult.score >= 80 ? 'text-green-600 dark:text-green-400' :
                        analysisResult.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {analysisResult.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          analysisResult.score >= 80 ? 'bg-green-600' :
                          analysisResult.score >= 60 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${analysisResult.score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Breakdown Scores */}
                  {analysisResult.breakdown && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Detailed Breakdown</h6>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(analysisResult.breakdown).map(([key, value]: [string, any]) => (
                          <div key={key} className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{key}</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Skills */}
                  {analysisResult.matchedSkills && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Matched Skills</h6>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.matchedSkills.map((skill: string, index: number) => (
                          <span key={index} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {analysisResult.missingKeywords && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Missing Keywords</h6>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.missingKeywords.map((keyword: string, index: number) => (
                          <span key={index} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvement Suggestions */}
                  {analysisResult.suggestions && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Improvement Suggestions
                      </h6>
                      <ul className="space-y-2">
                        {analysisResult.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            • {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-purple-600" />
                Generate Professional Summary
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Create a compelling professional summary tailored to your target role.
              </p>
            </div>

            <Input
              label="Target Job Title"
              type="text"
              value={summaryForm.jobTitle}
              onChange={(e) => setSummaryForm({ ...summaryForm, jobTitle: e.target.value })}
              placeholder="e.g., Senior Software Engineer"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience Level
              </label>
              <select
                value={summaryForm.experienceLevel}
                onChange={(e) => setSummaryForm({ ...summaryForm, experienceLevel: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            <Input
              label="Industry Focus (Optional)"
              type="text"
              value={summaryForm.industryFocus}
              onChange={(e) => setSummaryForm({ ...summaryForm, industryFocus: e.target.value })}
              placeholder="e.g., FinTech, Healthcare, E-commerce"
            />

            <Button
              onClick={handleGenerateSummary}
              disabled={loading}
              loading={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Generate Summary
            </Button>

            {generatedSummary && (
              <Card className="mt-6">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Generated Summaries</h5>
                
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Primary Summary</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => applySummaryToResume(generatedSummary.summary)}
                        className="text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{generatedSummary.summary}</p>
                  </div>

                  {generatedSummary.alternatives?.map((alt: string, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Alternative {index + 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => applySummaryToResume(alt)}
                          className="text-xs"
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{alt}</p>
                    </div>
                  ))}
                </div>

                {generatedSummary.tips && (
                  <div className="mt-4">
                    <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Tips:</h6>
                    <ul className="space-y-1">
                      {generatedSummary.tips.map((tip: string, index: number) => (
                        <li key={index} className="text-xs text-gray-600 dark:text-gray-400">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {activeTab === 'optimize' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                Optimize Content
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Improve existing content for better ATS compatibility and impact.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content Type
              </label>
              <select
                value={optimizeForm.contentType}
                onChange={(e) => setOptimizeForm({ ...optimizeForm, contentType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="summary">Professional Summary</option>
                <option value="bullet">Bullet Point</option>
                <option value="skill">Skill Description</option>
              </select>
            </div>

            <Textarea
              label="Content to Optimize"
              value={optimizeForm.content}
              onChange={(e) => setOptimizeForm({ ...optimizeForm, content: e.target.value })}
              rows={4}
              placeholder="Paste the content you want to optimize..."
            />

            <Button
              onClick={handleOptimizeContent}
              disabled={loading}
              loading={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Optimize Content
            </Button>

            {optimizedResult && (
              <Card className="mt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">Optimized Content</h5>
                      <span className={`text-xs px-2 py-1 rounded ${
                        optimizedResult.atsScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        optimizedResult.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        ATS Score: {optimizedResult.atsScore}%
                      </span>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{optimizedResult.optimizedContent}</p>
                    </div>
                  </div>

                  {optimizedResult.improvements && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Improvements Made:</h6>
                      <ul className="space-y-1">
                        {optimizedResult.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="text-xs text-gray-600 dark:text-gray-400">
                            ✓ {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {optimizedResult.suggestions && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Additional Suggestions:</h6>
                      <ul className="space-y-1">
                        {optimizedResult.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-xs text-gray-600 dark:text-gray-400">
                            • {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;