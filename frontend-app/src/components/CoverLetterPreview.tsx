import React from 'react';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface CoverLetterPreviewProps {
  coverLetter: any;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ coverLetter }) => {
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderProfessionalTemplate = () => (
    <div className="bg-white shadow-lg max-w-4xl mx-auto p-8">
      {/* Header with Date */}
      <div className="mb-8">
        <div className="text-right text-gray-600 mb-6">
          {formatDate()}
        </div>
        
        {/* Recipient Address */}
        <div className="mb-6">
          {coverLetter.hiringManagerName && (
            <div className="font-medium text-gray-900">{coverLetter.hiringManagerName}</div>
          )}
          <div className="font-medium text-gray-900">Hiring Manager</div>
          {coverLetter.companyName && (
            <div className="text-gray-700">{coverLetter.companyName}</div>
          )}
        </div>
      </div>

      {/* Subject Line */}
      {coverLetter.jobTitle && (
        <div className="mb-6">
          <div className="font-semibold text-gray-900">
            Re: Application for {coverLetter.jobTitle} Position
          </div>
        </div>
      )}

      {/* Letter Content */}
      <div className="space-y-6 text-gray-700 leading-relaxed">
        {/* Opening */}
        {coverLetter.content.opening && (
          <div className="whitespace-pre-line">
            {coverLetter.content.opening}
          </div>
        )}

        {/* Body Paragraphs */}
        {coverLetter.content.body.map((paragraph: string, index: number) => (
          paragraph && (
            <div key={index} className="whitespace-pre-line">
              {paragraph}
            </div>
          )
        ))}

        {/* Closing */}
        {coverLetter.content.closing && (
          <div className="whitespace-pre-line">
            {coverLetter.content.closing}
          </div>
        )}
      </div>
    </div>
  );

  const renderModernTemplate = () => (
    <div className="bg-white shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Cover Letter</h1>
            {coverLetter.jobTitle && coverLetter.companyName && (
              <p className="text-blue-100">
                {coverLetter.jobTitle} • {coverLetter.companyName}
              </p>
            )}
          </div>
          <div className="text-right text-blue-100">
            <div className="flex items-center justify-end mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Recipient */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-900 mb-1">To:</div>
          {coverLetter.hiringManagerName && (
            <div className="text-gray-700">{coverLetter.hiringManagerName}</div>
          )}
          <div className="text-gray-700">Hiring Manager</div>
          {coverLetter.companyName && (
            <div className="text-gray-700">{coverLetter.companyName}</div>
          )}
        </div>

        {/* Letter Content */}
        <div className="space-y-6 text-gray-700 leading-relaxed">
          {/* Opening */}
          {coverLetter.content.opening && (
            <div className="whitespace-pre-line">
              {coverLetter.content.opening}
            </div>
          )}

          {/* Body Paragraphs */}
          {coverLetter.content.body.map((paragraph: string, index: number) => (
            paragraph && (
              <div key={index} className="whitespace-pre-line">
                {paragraph}
              </div>
            )
          ))}

          {/* Closing */}
          {coverLetter.content.closing && (
            <div className="whitespace-pre-line">
              {coverLetter.content.closing}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (coverLetter.template) {
      case 'modern':
        return renderModernTemplate();
      case 'professional':
      default:
        return renderProfessionalTemplate();
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Preview</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This is how your cover letter will look when printed or saved as PDF
        </p>
      </div>
      
      <div className="transform scale-75 origin-top-left" style={{ width: '133.33%' }}>
        {renderTemplate()}
      </div>
    </div>
  );
};

export default CoverLetterPreview;