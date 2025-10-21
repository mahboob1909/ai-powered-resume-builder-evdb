import express from 'express';
import { body, validationResult } from 'express-validator';
import { verifyToken, AuthRequest } from '../../../shared/auth';
import { pdfGenerator, ResumeData, CoverLetterData } from '../utils/pdfGenerator';

const router = express.Router();

// Generate PDF from resume data
router.post('/generate', [
  verifyToken,
  body('personalInfo').isObject(),
  body('personalInfo.firstName').trim().isLength({ min: 1 }),
  body('personalInfo.lastName').trim().isLength({ min: 1 }),
  body('personalInfo.email').isEmail(),
  body('template').optional().isIn(['modern', 'classic', 'creative', 'minimal']),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const resumeData: ResumeData = {
      personalInfo: req.body.personalInfo,
      experience: req.body.experience || [],
      education: req.body.education || [],
      skills: req.body.skills || [],
      template: req.body.template || 'modern'
    };

    // Generate PDF
    const pdfBuffer = await pdfGenerator.generatePDF(resumeData);

    // Set response headers for PDF download
    const fileName = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      message: 'Failed to generate PDF',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Generate PDF from cover letter data
router.post('/generate-cover-letter', [
  verifyToken,
  body('companyName').trim().isLength({ min: 1 }),
  body('jobTitle').trim().isLength({ min: 1 }),
  body('content.opening').trim().isLength({ min: 1 }),
  body('content.body').isArray({ min: 1 }),
  body('content.closing').trim().isLength({ min: 1 }),
  body('template').optional().isIn(['professional', 'modern', 'creative']),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const coverLetterData: CoverLetterData = {
      companyName: req.body.companyName,
      jobTitle: req.body.jobTitle,
      hiringManagerName: req.body.hiringManagerName,
      content: req.body.content,
      template: req.body.template || 'professional'
    };

    // Generate PDF
    const pdfBuffer = await pdfGenerator.generateCoverLetterPDF(coverLetterData);

    // Set response headers for PDF download
    const fileName = `${coverLetterData.companyName}_${coverLetterData.jobTitle}_Cover_Letter.pdf`.replace(/[^a-zA-Z0-9_-]/g, '_');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating cover letter PDF:', error);
    res.status(500).json({ 
      message: 'Failed to generate cover letter PDF',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'PDF Service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;