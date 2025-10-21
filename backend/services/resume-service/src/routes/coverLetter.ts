import express from 'express';
import { body, validationResult } from 'express-validator';
import { CoverLetter } from '../models/CoverLetter';
import { verifyToken, AuthRequest } from '../../../shared/auth';

const router = express.Router();

// Get all cover letters for authenticated user
router.get('/', verifyToken, async (req: AuthRequest, res) => {
  try {
    const coverLetters = await CoverLetter.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select('-__v');

    res.json(coverLetters);
  } catch (error) {
    console.error('Error fetching cover letters:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single cover letter by ID
router.get('/:id', verifyToken, async (req: AuthRequest, res) => {
  try {
    const coverLetter = await CoverLetter.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).select('-__v');

    if (!coverLetter) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }

    res.json(coverLetter);
  } catch (error) {
    console.error('Error fetching cover letter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new cover letter
router.post('/', [
  verifyToken,
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('companyName').trim().isLength({ min: 1 }),
  body('jobTitle').trim().isLength({ min: 1 }),
  body('content.opening').trim().isLength({ min: 1 }),
  body('content.body').isArray({ min: 1 }),
  body('content.closing').trim().isLength({ min: 1 }),
  body('template').isIn(['professional', 'modern', 'creative']),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const coverLetterData = {
      ...req.body,
      userId: req.userId,
    };

    const coverLetter = new CoverLetter(coverLetterData);
    await coverLetter.save();

    res.status(201).json(coverLetter);
  } catch (error) {
    console.error('Error creating cover letter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cover letter
router.put('/:id', [
  verifyToken,
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('companyName').optional().trim().isLength({ min: 1 }),
  body('jobTitle').optional().trim().isLength({ min: 1 }),
  body('template').optional().isIn(['professional', 'modern', 'creative']),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const coverLetter = await CoverLetter.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!coverLetter) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }

    res.json(coverLetter);
  } catch (error) {
    console.error('Error updating cover letter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete cover letter
router.delete('/:id', verifyToken, async (req: AuthRequest, res) => {
  try {
    const coverLetter = await CoverLetter.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!coverLetter) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }

    res.json({ message: 'Cover letter deleted successfully' });
  } catch (error) {
    console.error('Error deleting cover letter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;