import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import Card from './Card';

interface CoverLetterFormProps {
  coverLetter: any;
  onChange: (coverLetter: any) => void;
}

const CoverLetterForm: React.FC<CoverLetterFormProps> = ({ coverLetter, onChange }) => {
  const updateCoverLetter = (field: string, value: any) => {
    onChange({ ...coverLetter, [field]: value });
  };

  const updateContent = (field: string, value: any) => {
    onChange({
      ...coverLetter,
      content: { ...coverLetter.content, [field]: value }
    });
  };

  const addBodyParagraph = () => {
    const newBody = [...coverLetter.content.body, ''];
    updateContent('body', newBody);
  };

  const updateBodyParagraph = (index: number, value: string) => {
    const updatedBody = [...coverLetter.content.body];
    updatedBody[index] = value;
    updateContent('body', updatedBody);
  };

  const removeBodyParagraph = (index: number) => {
    const updatedBody = coverLetter.content.body.filter((_: any, i: number) => i !== index);
    updateContent('body', updatedBody);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Cover Letter Title */}
      <div>
        <Input
          label="Cover Letter Title"
          type="text"
          value={coverLetter.title}
          onChange={(e) => updateCoverLetter('title', e.target.value)}
          placeholder="e.g., Software Engineer Cover Letter - Google"
        />
      </div>

      {/* Job Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              label="Company Name"
              type="text"
              value={coverLetter.companyName}
              onChange={(e) => updateCoverLetter('companyName', e.target.value)}
              placeholder="e.g., Google"
            />
          </div>
          <div>
            <Input
              label="Job Title"
              type="text"
              value={coverLetter.jobTitle}
              onChange={(e) => updateCoverLetter('jobTitle', e.target.value)}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          <div className="col-span-2">
            <Input
              label="Hiring Manager Name (Optional)"
              type="text"
              value={coverLetter.hiringManagerName || ''}
              onChange={(e) => updateCoverLetter('hiringManagerName', e.target.value)}
              placeholder="e.g., John Smith"
              helperText="If you know the hiring manager's name, include it for personalization"
            />
          </div>
          <div className="col-span-2">
            <Textarea
              label="Job Description (Optional)"
              value={coverLetter.jobDescription || ''}
              onChange={(e) => updateCoverLetter('jobDescription', e.target.value)}
              rows={4}
              placeholder="Paste the job description here to help with AI generation..."
              helperText="This helps the AI generate more targeted content"
            />
          </div>
        </div>
      </Card>

      {/* Cover Letter Content */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cover Letter Content</h3>
        
        {/* Opening Paragraph */}
        <div className="mb-6">
          <Textarea
            label="Opening Paragraph"
            value={coverLetter.content.opening}
            onChange={(e) => updateContent('opening', e.target.value)}
            rows={3}
            placeholder="Dear Hiring Manager,

I am writing to express my strong interest in the [Job Title] position at [Company Name]..."
            helperText="Start with a compelling hook that shows your enthusiasm and briefly mentions your key qualifications"
          />
        </div>

        {/* Body Paragraphs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Body Paragraphs
            </label>
            <Button
              variant="outline"
              size="sm"
              icon={<Plus />}
              onClick={addBodyParagraph}
            >
              Add Paragraph
            </Button>
          </div>
          
          {coverLetter.content.body.map((paragraph: string, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Paragraph {index + 1}
                </span>
                {coverLetter.content.body.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 />}
                    onClick={() => removeBodyParagraph(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                  </Button>
                )}
              </div>
              <Textarea
                value={paragraph}
                onChange={(e) => updateBodyParagraph(index, e.target.value)}
                rows={4}
                placeholder={
                  index === 0 
                    ? "Highlight your most relevant experience and achievements that match the job requirements..."
                    : index === 1
                    ? "Demonstrate your knowledge of the company and explain why you want to work there..."
                    : "Add additional qualifications, skills, or experiences that make you the ideal candidate..."
                }
              />
            </div>
          ))}
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Tip: Use 2-3 body paragraphs to highlight your qualifications, show company knowledge, and demonstrate fit.
          </p>
        </div>

        {/* Closing Paragraph */}
        <div>
          <Textarea
            label="Closing Paragraph"
            value={coverLetter.content.closing}
            onChange={(e) => updateContent('closing', e.target.value)}
            rows={3}
            placeholder="Thank you for considering my application. I would welcome the opportunity to discuss how my background and passion can contribute to [Company Name]'s success. I look forward to hearing from you.

Sincerely,
[Your Name]"
            helperText="End with a strong call to action and professional closing"
          />
        </div>
      </Card>

      {/* Template Selection */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Template Style</h3>
        <div className="grid grid-cols-3 gap-4">
          {['professional', 'modern', 'creative'].map((template) => (
            <button
              key={template}
              onClick={() => updateCoverLetter('template', template)}
              className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:scale-105 ${
                coverLetter.template === template
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white capitalize">{template}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {template === 'professional' && 'Traditional business format'}
                {template === 'modern' && 'Clean contemporary style'}
                {template === 'creative' && 'Unique design elements'}
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CoverLetterForm;