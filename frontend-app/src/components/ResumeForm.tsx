import React from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import Card from './Card';

interface ResumeFormProps {
  resume: any;
  onChange: (resume: any) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ resume, onChange }) => {
  const updateResume = (field: string, value: any) => {
    onChange({ ...resume, [field]: value });
  };

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...resume,
      personalInfo: { ...resume.personalInfo, [field]: value }
    });
  };

  const addExperience = () => {
    const newExperience = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
      location: ''
    };
    onChange({
      ...resume,
      experience: [...resume.experience, newExperience]
    });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updatedExperience = [...resume.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    onChange({ ...resume, experience: updatedExperience });
  };

  const removeExperience = (index: number) => {
    const updatedExperience = resume.experience.filter((_: any, i: number) => i !== index);
    onChange({ ...resume, experience: updatedExperience });
  };

  const addEducation = () => {
    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: ''
    };
    onChange({
      ...resume,
      education: [...resume.education, newEducation]
    });
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updatedEducation = [...resume.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    onChange({ ...resume, education: updatedEducation });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = resume.education.filter((_: any, i: number) => i !== index);
    onChange({ ...resume, education: updatedEducation });
  };

  const addSkill = () => {
    onChange({ ...resume, skills: [...resume.skills, ''] });
  };

  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...resume.skills];
    updatedSkills[index] = value;
    onChange({ ...resume, skills: updatedSkills });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = resume.skills.filter((_: any, i: number) => i !== index);
    onChange({ ...resume, skills: updatedSkills });
  };

  const addBulletPoint = (expIndex: number) => {
    const updatedExperience = [...resume.experience];
    updatedExperience[expIndex].description.push('');
    onChange({ ...resume, experience: updatedExperience });
  };

  const updateBulletPoint = (expIndex: number, bulletIndex: number, value: string) => {
    const updatedExperience = [...resume.experience];
    updatedExperience[expIndex].description[bulletIndex] = value;
    onChange({ ...resume, experience: updatedExperience });
  };

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    const updatedExperience = [...resume.experience];
    updatedExperience[expIndex].description = updatedExperience[expIndex].description.filter(
      (_: any, i: number) => i !== bulletIndex
    );
    onChange({ ...resume, experience: updatedExperience });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Resume Title */}
      <div>
        <Input
          label="Resume Title"
          type="text"
          value={resume.title}
          onChange={(e) => updateResume('title', e.target.value)}
          placeholder="e.g., Software Engineer Resume"
        />
      </div>

      {/* Personal Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              label="First Name"
              type="text"
              value={resume.personalInfo.firstName}
              onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Last Name"
              type="text"
              value={resume.personalInfo.lastName}
              onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Email"
              type="email"
              value={resume.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Phone"
              type="tel"
              value={resume.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Input
              label="Location"
              type="text"
              value={resume.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder="City, State"
            />
          </div>
          <div>
            <Input
              label="Website"
              type="url"
              value={resume.personalInfo.website || ''}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <Input
              label="LinkedIn"
              type="url"
              value={resume.personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>
        <div className="mt-4">
          <Textarea
            label="Professional Summary"
            value={resume.personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            rows={4}
            placeholder="Write a compelling summary of your professional background and key achievements..."
          />
        </div>
      </Card>

      {/* Work Experience */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Work Experience</h3>
          <Button
            variant="outline"
            size="sm"
            icon={<Plus />}
            onClick={addExperience}
          >
            Add Experience
          </Button>
        </div>

        {resume.experience.map((exp: any, index: number) => (
          <Card key={index} className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Experience {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 />}
                onClick={() => removeExperience(index)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  label="Company"
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="Position"
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="Start Date"
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                  <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                      className="mr-1"
                    />
                    Current
                  </label>
                </div>
              </div>
              <div className="col-span-2">
                <Input
                  label="Location"
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Description
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addBulletPoint(index)}
                >
                  Add Bullet Point
                </Button>
              </div>
              {exp.description.map((bullet: string, bulletIndex: number) => (
                <div key={bulletIndex} className="flex items-center space-x-2 mb-2">
                  <span className="text-gray-400">•</span>
                  <Input
                    type="text"
                    value={bullet}
                    onChange={(e) => updateBulletPoint(index, bulletIndex, e.target.value)}
                    placeholder="Describe your achievement or responsibility..."
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 />}
                    onClick={() => removeBulletPoint(index, bulletIndex)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Education */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h3>
          <Button
            variant="outline"
            size="sm"
            icon={<Plus />}
            onClick={addEducation}
          >
            Add Education
          </Button>
        </div>

        {resume.education.map((edu: any, index: number) => (
          <Card key={index} className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Education {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 />}
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  label="Institution"
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="Degree"
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
              <div>
                <Input
                  label="Field of Study"
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  placeholder="Computer Science, Business, etc."
                />
              </div>
              <div>
                <Input
                  label="Start Date"
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="End Date"
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="GPA (Optional)"
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                  placeholder="3.8"
                />
              </div>
              <div>
                <Input
                  label="Honors (Optional)"
                  type="text"
                  value={edu.honors || ''}
                  onChange={(e) => updateEducation(index, 'honors', e.target.value)}
                  placeholder="Magna Cum Laude, Dean's List, etc."
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Skills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
          <Button
            variant="outline"
            size="sm"
            icon={<Plus />}
            onClick={addSkill}
          >
            Add Skill
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {resume.skills.map((skill: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                placeholder="e.g., JavaScript, Project Management"
              />
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 />}
                onClick={() => removeSkill(index)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Template Selection */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Template</h3>
        <div className="grid grid-cols-2 gap-4">
          {['modern', 'classic', 'creative', 'minimal'].map((template) => (
            <button
              key={template}
              onClick={() => updateResume('template', template)}
              className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:scale-105 ${
                resume.template === template
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white capitalize">{template}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {template === 'modern' && 'Clean and contemporary design'}
                {template === 'classic' && 'Traditional professional layout'}
                {template === 'creative' && 'Unique and eye-catching design'}
                {template === 'minimal' && 'Simple and elegant layout'}
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ResumeForm;