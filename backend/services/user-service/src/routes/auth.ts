import express from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { generateToken } from '../../../shared/auth';
import passport from '../config/passport';
import axios from 'axios';

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user as any;
    const token = generateToken(user.id);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

// Get current user
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  const user = req.user as any;
  res.json({
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    subscription: user.subscription,
    profilePicture: user.profilePicture,
  });
});

// LinkedIn Profile Import
router.post('/import-linkedin', [
  body('linkedinUrl').isURL(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { linkedinUrl } = req.body;

    // For demo purposes, return mock LinkedIn data
    // In production, you would integrate with LinkedIn API or a scraping service
    const mockLinkedInData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        linkedin: linkedinUrl,
        summary: 'Experienced software engineer with 5+ years of experience in full-stack development. Passionate about creating scalable web applications and leading high-performing teams.'
      },
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          startDate: '2021-01',
          endDate: '',
          current: true,
          description: [
            'Led development of microservices architecture serving 1M+ users',
            'Mentored junior developers and improved team productivity by 30%',
            'Implemented CI/CD pipelines reducing deployment time by 50%'
          ],
          location: 'San Francisco, CA'
        },
        {
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          startDate: '2019-06',
          endDate: '2021-01',
          current: false,
          description: [
            'Built responsive web applications using React and Node.js',
            'Collaborated with design team to implement pixel-perfect UIs',
            'Optimized database queries improving performance by 40%'
          ],
          location: 'San Francisco, CA'
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2015-08',
          endDate: '2019-05',
          gpa: '3.8',
          honors: 'Magna Cum Laude'
        }
      ],
      skills: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 
        'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'Git'
      ]
    };

    res.json({
      success: true,
      data: mockLinkedInData,
      message: 'LinkedIn profile data imported successfully'
    });
  } catch (error) {
    console.error('LinkedIn import error:', error);
    res.status(500).json({ message: 'Failed to import LinkedIn profile' });
  }
});

export default router;