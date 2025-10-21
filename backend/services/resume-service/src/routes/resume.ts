import express from 'express';
import { body, validationResult } from 'express-validator';
import { Resume } from '../models/Resume';
import { verifyToken, AuthRequest } from '../../../shared/auth';

const router = express.Router();

// Get all resumes for authenticated user
router.get('/', verifyToken, async (req: AuthRequest, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select('-__v');

    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single resume by ID
router.get('/:id', verifyToken, async (req: AuthRequest, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).select('-__v');

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new resume
router.post('/', [
  verifyToken,
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('personalInfo.firstName').trim().isLength({ min: 1 }),
  body('personalInfo.lastName').trim().isLength({ min: 1 }),
  body('personalInfo.email').isEmail(),
  body('personalInfo.phone').trim().isLength({ min: 1 }),
  body('personalInfo.location').trim().isLength({ min: 1 }),
  body('personalInfo.summary').trim().isLength({ min: 1 }),
  body('template').isIn(['modern', 'classic', 'creative', 'minimal']),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const resumeData = {
      ...req.body,
      userId: req.userId,
    };

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json(resume);
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resume
router.put('/:id', [
  verifyToken,
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('personalInfo.firstName').optional().trim().isLength({ min: 1 }),
  body('personalInfo.lastName').optional().trim().isLength({ min: 1 }),
  body('personalInfo.email').optional().isEmail(),
  body('template').optional().isIn(['modern', 'classic', 'creative', 'minimal']),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resume
router.delete('/:id', verifyToken, async (req: AuthRequest, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;