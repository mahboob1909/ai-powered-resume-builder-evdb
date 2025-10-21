import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar } from 'lucide-react';

interface ResumePreviewProps {
  resume: any;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const renderModernTemplate = () => (
    <div className="bg-white shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">
          {resume.personalInfo.firstName} {resume.personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap gap-4 text-blue-100">
          {resume.personalInfo.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {resume.personalInfo.email}
            </div>
          )}
          {resume.personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {resume.personalInfo.phone}
            </div>
          )}
          {resume.personalInfo.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {resume.personalInfo.location}
            </div>
          )}
          {resume.personalInfo.website && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              {resume.personalInfo.website}
            </div>
          )}
          {resume.personalInfo.linkedin && (
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Professional Summary */}
        {resume.personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {resume.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Work Experience
            </h2>
            {resume.experience.map((exp: any, index: number) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                    <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                    <p className="text-gray-600">{exp.location}</p>
                  </div>
                  <div className="text-right text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                </div>
                {exp.description.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    {exp.description.map((bullet: string, bulletIndex: number) => (
                      bullet && <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Education
            </h2>
            {resume.education.map((edu: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-lg text-blue-600 font-medium">{edu.institution}</p>
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    {edu.honors && <p className="text-gray-600">{edu.honors}</p>}
                  </div>
                  <div className="text-right text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill: string, index: number) => (
                skill && (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderClassicTemplate = () => (
    <div className="bg-white shadow-lg max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {resume.personalInfo.firstName} {resume.personalInfo.lastName}
        </h1>
        <div className="flex justify-center flex-wrap gap-6 text-gray-600">
          {resume.personalInfo.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {resume.personalInfo.email}
            </div>
          )}
          {resume.personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {resume.personalInfo.phone}
            </div>
          )}
          {resume.personalInfo.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {resume.personalInfo.location}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
            Work Experience
          </h2>
          {resume.experience.map((exp: any, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                  <p className="text-gray-700 font-medium">{exp.company}, {exp.location}</p>
                </div>
                <div className="text-gray-600">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
              </div>
              {exp.description.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {exp.description.map((bullet: string, bulletIndex: number) => (
                    bullet && <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
            Education
          </h2>
          {resume.education.map((edu: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                  {edu.honors && <p className="text-gray-600">{edu.honors}</p>}
                </div>
                <div className="text-gray-600">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
            Skills
          </h2>
          <div className="text-gray-700">
            {resume.skills.filter((skill: string) => skill).join(' • ')}
          </div>
        </div>
      )}
    </div>
  );

  const renderTemplate = () => {
    switch (resume.template) {
      case 'classic':
        return renderClassicTemplate();
      case 'modern':
      default:
        return renderModernTemplate();
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Preview</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This is how your resume will look when downloaded as PDF
        </p>
      </div>
      
      <div className="transform scale-75 origin-top-left" style={{ width: '133.33%' }}>
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;