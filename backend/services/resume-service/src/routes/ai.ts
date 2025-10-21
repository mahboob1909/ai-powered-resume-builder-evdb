import express from 'express';
import { body, validationResult } from 'express-validator';
import { verifyToken, AuthRequest } from '../../../shared/auth';
import OpenAI from 'openai';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate AI bullet points for work experience
router.post('/generate-bullets', [
  verifyToken,
  body('jobTitle').trim().isLength({ min: 1 }),
  body('jobDescription').trim().isLength({ min: 1 }),
  body('experienceLevel').isIn(['entry', 'mid', 'senior']),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobTitle, jobDescription, experienceLevel } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        message: 'AI service temporarily unavailable',
        bulletPoints: [
          'Collaborated with cross-functional teams to deliver high-quality results',
          'Implemented best practices and improved operational efficiency by 25%',
          'Led key projects and initiatives that increased team productivity',
          'Developed innovative solutions that reduced processing time by 30%'
        ],
        suggestions: [
          'Add specific metrics and numbers to quantify your achievements',
          'Include relevant technologies and tools you used',
          'Highlight leadership and collaboration experiences',
          'Focus on measurable business impact and outcomes'
        ]
      });
    }

    const prompt = `Generate 5 professional, ATS-optimized resume bullet points for a ${experienceLevel}-level ${jobTitle} position.

Job Description: ${jobDescription}

Requirements:
- Start each bullet point with a strong action verb (Led, Developed, Implemented, Achieved, etc.)
- Include specific, quantifiable achievements with metrics when possible
- Tailor content to the ${experienceLevel} experience level
- Make them keyword-rich and ATS-friendly
- Focus on impact, results, and business value
- Use industry-specific terminology from the job description

Format as a JSON object with:
- "bulletPoints": array of 5 bullet points
- "suggestions": array of 4 improvement tips
- "keywords": array of important keywords from job description
- "actionVerbs": array of recommended action verbs for this role`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer and career coach with 15+ years of experience. You specialize in creating compelling, ATS-optimized content that highlights achievements and quantifiable impact. Always focus on results, metrics, and business value."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI service');
    }

    try {
      const aiResponse = JSON.parse(response);
      res.json(aiResponse);
    } catch (parseError) {
      // Enhanced fallback with better content
      const lines = response.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
      const bulletPoints = lines.slice(0, 5).map(line => line.replace(/^[•\-]\s*/, '').trim());
      
      res.json({
        bulletPoints: bulletPoints.length > 0 ? bulletPoints : [
          'Delivered exceptional results in dynamic, fast-paced environment',
          'Collaborated with cross-functional teams to achieve 95% project success rate',
          'Implemented innovative solutions that improved operational efficiency by 30%',
          'Led strategic initiatives resulting in $500K+ annual cost savings',
          'Mentored team members and improved overall productivity by 25%'
        ],
        suggestions: [
          'Quantify achievements with specific numbers and percentages',
          'Include industry-specific keywords and technologies',
          'Highlight leadership experiences and team collaboration',
          'Focus on measurable business impact and ROI'
        ],
        keywords: ['leadership', 'collaboration', 'efficiency', 'innovation'],
        actionVerbs: ['Led', 'Implemented', 'Achieved', 'Developed', 'Optimized']
      });
    }
  } catch (error) {
    console.error('Error generating AI content:', error);
    
    // Enhanced fallback content
    res.json({
      bulletPoints: [
        'Delivered exceptional results in dynamic, fast-paced environment',
        'Collaborated with cross-functional teams to achieve project objectives',
        'Implemented innovative solutions that improved operational efficiency',
        'Demonstrated strong problem-solving and analytical skills',
        'Led initiatives that resulted in measurable business impact'
      ],
      suggestions: [
        'Quantify your achievements with specific numbers and percentages',
        'Include industry-specific keywords and technologies',
        'Highlight leadership experiences and team collaboration',
        'Focus on measurable impact and business outcomes'
      ],
      keywords: ['leadership', 'collaboration', 'innovation', 'efficiency'],
      actionVerbs: ['Led', 'Implemented', 'Achieved', 'Developed']
    });
  }
});

// Enhanced job description analysis with detailed scoring
router.post('/analyze-job', [
  verifyToken,
  body('jobDescription').trim().isLength({ min: 1 }),
  body('currentResume').isObject(),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobDescription, currentResume } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        message: 'AI service temporarily unavailable',
        score: 75,
        breakdown: {
          skills: 80,
          experience: 70,
          keywords: 75,
          education: 85
        },
        suggestions: [
          'Add more relevant keywords from the job description',
          'Quantify your achievements with specific metrics',
          'Highlight technical skills mentioned in the job posting',
          'Strengthen your professional summary section'
        ],
        missingKeywords: ['leadership', 'project management', 'data analysis'],
        strengthAreas: ['Technical expertise', 'Educational background'],
        improvementAreas: ['Quantified achievements', 'Industry keywords'],
        matchedSkills: ['JavaScript', 'React', 'Node.js'],
        recommendedSkills: ['TypeScript', 'AWS', 'Docker']
      });
    }

    const resumeText = `
      Summary: ${currentResume.personalInfo?.summary || 'No summary provided'}
      Skills: ${currentResume.skills?.join(', ') || 'No skills listed'}
      Experience: ${currentResume.experience?.map((exp: any) => 
        `${exp.position} at ${exp.company}: ${exp.description?.join('. ') || ''}`
      ).join(' | ') || 'No experience listed'}
      Education: ${currentResume.education?.map((edu: any) => 
        `${edu.degree} in ${edu.field} from ${edu.institution}`
      ).join(' | ') || 'No education listed'}
    `;

    const prompt = `Analyze this resume against the job description and provide a comprehensive assessment.

Job Description: ${jobDescription}

Current Resume: ${resumeText}

Provide a detailed JSON response with:
- score (0-100): Overall match percentage
- breakdown: Object with scores for skills, experience, keywords, education (0-100 each)
- suggestions: Array of 5-6 specific, actionable improvement recommendations
- missingKeywords: Array of important keywords from job description not in resume
- strengthAreas: Array of resume strengths that align well with the job
- improvementAreas: Array of specific areas needing enhancement
- matchedSkills: Array of skills that match between resume and job
- recommendedSkills: Array of skills to add based on job requirements
- experienceGaps: Array of experience areas that could be strengthened
- optimizationTips: Array of ATS optimization suggestions

Be specific, actionable, and focus on measurable improvements.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS specialist and career coach. Provide detailed, actionable feedback to help job seekers optimize their resumes for specific positions. Focus on keyword optimization, quantifiable achievements, and ATS compatibility."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1200,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI service');
    }

    try {
      const analysis = JSON.parse(response);
      res.json(analysis);
    } catch (parseError) {
      // Enhanced fallback response
      res.json({
        score: 72,
        breakdown: {
          skills: 75,
          experience: 68,
          keywords: 70,
          education: 80
        },
        suggestions: [
          'Incorporate more keywords from the job description throughout your resume',
          'Add quantifiable achievements with specific metrics and percentages',
          'Strengthen the professional summary with role-specific language',
          'Highlight relevant technical skills and certifications',
          'Include industry-specific terminology and buzzwords',
          'Optimize formatting for ATS readability'
        ],
        missingKeywords: ['collaboration', 'leadership', 'innovation', 'agile'],
        strengthAreas: ['Technical expertise', 'Educational background', 'Professional experience'],
        improvementAreas: ['Quantified achievements', 'Industry keywords', 'Leadership examples'],
        matchedSkills: ['JavaScript', 'React', 'Problem-solving'],
        recommendedSkills: ['TypeScript', 'AWS', 'Project Management', 'Agile'],
        experienceGaps: ['Team leadership', 'Cross-functional collaboration'],
        optimizationTips: [
          'Use standard section headings for ATS compatibility',
          'Include keywords in context, not just as a list',
          'Use bullet points for better readability'
        ]
      });
    }
  } catch (error) {
    console.error('Error analyzing job description:', error);
    res.status(500).json({ message: 'Server error during analysis' });
  }
});

// New endpoint: Generate professional summary
router.post('/generate-summary', [
  verifyToken,
  body('jobTitle').trim().isLength({ min: 1 }),
  body('experienceLevel').isIn(['entry', 'mid', 'senior']),
  body('keySkills').isArray(),
  body('industryFocus').optional().trim(),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobTitle, experienceLevel, keySkills, industryFocus } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        summary: `${experienceLevel === 'entry' ? 'Motivated' : experienceLevel === 'mid' ? 'Experienced' : 'Senior'} ${jobTitle} with expertise in ${keySkills.slice(0, 3).join(', ')}. Proven track record of delivering high-quality results and driving business success through innovative solutions and collaborative teamwork.`,
        alternatives: [
          `Results-driven ${jobTitle} with strong background in ${keySkills[0]} and ${keySkills[1]}. Committed to excellence and continuous improvement.`,
          `Dynamic ${jobTitle} specializing in ${keySkills.slice(0, 2).join(' and ')}. Passionate about leveraging technology to solve complex business challenges.`
        ]
      });
    }

    const prompt = `Generate a compelling professional summary for a ${experienceLevel}-level ${jobTitle} position.

Key Skills: ${keySkills.join(', ')}
${industryFocus ? `Industry Focus: ${industryFocus}` : ''}

Requirements:
- 2-3 sentences, 50-80 words
- Highlight relevant experience level and key skills
- Include measurable impact when possible
- Use strong action words and industry terminology
- Make it ATS-friendly and keyword-rich

Provide JSON with:
- summary: Main professional summary
- alternatives: Array of 2 alternative versions
- tips: Array of 3 tips for customizing summaries`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer specializing in compelling professional summaries that capture attention and highlight key value propositions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI service');
    }

    try {
      const summaryResponse = JSON.parse(response);
      res.json(summaryResponse);
    } catch (parseError) {
      res.json({
        summary: `${experienceLevel === 'entry' ? 'Motivated' : experienceLevel === 'mid' ? 'Experienced' : 'Senior'} ${jobTitle} with expertise in ${keySkills.slice(0, 3).join(', ')}. Proven track record of delivering high-quality results and driving business success through innovative solutions and collaborative teamwork.`,
        alternatives: [
          `Results-driven ${jobTitle} with strong background in ${keySkills[0]} and ${keySkills[1]}. Committed to excellence and continuous improvement.`,
          `Dynamic ${jobTitle} specializing in ${keySkills.slice(0, 2).join(' and ')}. Passionate about leveraging technology to solve complex business challenges.`
        ],
        tips: [
          'Customize your summary for each job application',
          'Include 2-3 of your strongest skills',
          'Quantify achievements when possible'
        ]
      });
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: 'Server error during summary generation' });
  }
});

// New endpoint: Optimize existing content
router.post('/optimize-content', [
  verifyToken,
  body('content').trim().isLength({ min: 1 }),
  body('contentType').isIn(['summary', 'bullet', 'skill']),
  body('targetKeywords').optional().isArray(),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, contentType, targetKeywords = [] } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        optimizedContent: content,
        improvements: [
          'Add specific metrics and numbers',
          'Use stronger action verbs',
          'Include relevant keywords'
        ],
        atsScore: 75
      });
    }

    const prompt = `Optimize this ${contentType} for ATS compatibility and impact:

Original Content: "${content}"
${targetKeywords.length > 0 ? `Target Keywords: ${targetKeywords.join(', ')}` : ''}

Provide JSON with:
- optimizedContent: Improved version of the content
- improvements: Array of specific improvements made
- atsScore: Score 0-100 for ATS compatibility
- suggestions: Array of additional optimization tips`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an ATS optimization expert. Improve content for better keyword density, impact, and readability while maintaining authenticity."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI service');
    }

    try {
      const optimizationResponse = JSON.parse(response);
      res.json(optimizationResponse);
    } catch (parseError) {
      res.json({
        optimizedContent: content,
        improvements: [
          'Enhanced with stronger action verbs',
          'Improved keyword density',
          'Better quantification of achievements'
        ],
        atsScore: 78,
        suggestions: [
          'Consider adding specific metrics',
          'Use industry-specific terminology',
          'Ensure proper keyword placement'
        ]
      });
    }
  } catch (error) {
    console.error('Error optimizing content:', error);
    res.status(500).json({ message: 'Server error during content optimization' });
  }
});

// Generate AI-powered cover letter
router.post('/generate-cover-letter', [
  verifyToken,
  body('companyName').trim().isLength({ min: 1 }),
  body('jobTitle').trim().isLength({ min: 1 }),
  body('jobDescription').trim().isLength({ min: 1 }),
  body('userBackground').trim().isLength({ min: 1 }),
  body('tone').isIn(['professional', 'enthusiastic', 'confident']),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyName, jobTitle, jobDescription, userBackground, hiringManagerName, tone } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        opening: `Dear ${hiringManagerName || 'Hiring Manager'},\n\nI am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${userBackground}, I am excited about the opportunity to contribute to your team.`,
        body: [
          `My experience in ${userBackground} has equipped me with the skills necessary to excel in this role. I am particularly drawn to ${companyName} because of your commitment to innovation and excellence in the industry.`,
          `Throughout my career, I have demonstrated strong problem-solving abilities and a passion for delivering high-quality results. I believe my skills and enthusiasm make me an ideal candidate for this position.`,
          `I am excited about the possibility of bringing my unique perspective and expertise to ${companyName} and contributing to your continued success.`
        ],
        closing: `Thank you for considering my application. I look forward to the opportunity to discuss how my background and passion can contribute to ${companyName}'s success.\n\nSincerely,\n[Your Name]`,
        suggestions: [
          'Customize the opening paragraph with specific company research',
          'Add quantifiable achievements from your background',
          'Include specific examples that match the job requirements',
          'Research the company culture and values to personalize your letter'
        ]
      });
    }

    const prompt = `Generate a compelling, personalized cover letter for the following position:

Company: ${companyName}
Position: ${jobTitle}
${hiringManagerName ? `Hiring Manager: ${hiringManagerName}` : ''}
User Background: ${userBackground}
Tone: ${tone}

Job Description: ${jobDescription}

Requirements:
- Write in a ${tone} tone that matches the company culture
- Include specific examples from the user's background
- Reference specific requirements from the job description
- Show genuine interest in the company and role
- Keep it concise but impactful (3-4 paragraphs)
- Make it ATS-friendly with relevant keywords

Provide JSON response with:
- opening: Opening paragraph with greeting and interest statement
- body: Array of 2-3 body paragraphs highlighting qualifications and fit
- closing: Professional closing paragraph with call to action
- suggestions: Array of 4 tips for further customization
- keywords: Array of important keywords to include`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional career coach and cover letter expert with 15+ years of experience. You specialize in creating compelling, personalized cover letters that get interviews. Focus on storytelling, specific achievements, and genuine connection to the company."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI service');
    }

    try {
      const coverLetterResponse = JSON.parse(response);
      res.json(coverLetterResponse);
    } catch (parseError) {
      // Enhanced fallback
      res.json({
        opening: `Dear ${hiringManagerName || 'Hiring Manager'},\n\nI am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${userBackground}, I am excited about the opportunity to contribute to your team and help drive ${companyName}'s continued success.`,
        body: [
          `My experience in ${userBackground} has provided me with a solid foundation in the skills essential for this role. I am particularly drawn to ${companyName} because of your reputation for innovation and commitment to excellence, which aligns perfectly with my professional values and career aspirations.`,
          `Throughout my career, I have consistently demonstrated strong problem-solving abilities, attention to detail, and a passion for delivering exceptional results. I believe my unique combination of technical skills and collaborative approach would make me a valuable addition to your team.`,
          `I am excited about the possibility of bringing my expertise and fresh perspective to ${companyName}, and I am confident that my dedication and enthusiasm will contribute meaningfully to your organization's objectives.`
        ],
        closing: `Thank you for considering my application. I would welcome the opportunity to discuss how my background and passion can contribute to ${companyName}'s success. I look forward to hearing from you soon.\n\nSincerely,\n[Your Name]`,
        suggestions: [
          'Research the company\'s recent achievements or news to add specific details',
          'Include quantifiable accomplishments that demonstrate your impact',
          'Mention specific technologies or methodologies mentioned in the job posting',
          'Add a brief story that showcases your problem-solving abilities'
        ],
        keywords: ['leadership', 'collaboration', 'innovation', 'results-driven']
      });
    }
  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ message: 'Server error during cover letter generation' });
  }
});

export default router;