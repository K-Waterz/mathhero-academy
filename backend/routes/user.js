const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', asyncHandler(async (req, res) => {
  // Mock user data for now - in real app, get from auth middleware
  const mockUser = {
    id: 'mock-user-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    grade: 8,
    level: 5,
    totalPoints: 1250,
    streak: 3,
    experience: 450,
    experienceToNextLevel: 50,
    levelProgress: 90,
    completedLessons: 12,
    completedGames: 8,
    accuracy: 87,
    subjects: ['mathematics', 'physics'],
    preferredDifficulty: 'intermediate',
    isEmailVerified: true,
    createdAt: '2024-01-15T10:30:00Z'
  };

  res.json({
    success: true,
    message: 'User profile retrieved successfully',
    data: mockUser
  });
}));

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('grade')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Grade must be between 1 and 12'),
  body('preferredDifficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),
  body('subjects')
    .optional()
    .isArray()
    .withMessage('Subjects must be an array'),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  // Mock update - in real app, update actual user
  const updatedUser = {
    id: 'mock-user-id',
    firstName: req.body.firstName || 'John',
    lastName: req.body.lastName || 'Doe',
    grade: req.body.grade || 8,
    preferredDifficulty: req.body.preferredDifficulty || 'intermediate',
    subjects: req.body.subjects || ['mathematics', 'physics'],
    settings: req.body.settings || {},
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
}));

// @desc    Get user statistics
// @route   GET /api/user/stats
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  const mockStats = {
    level: 5,
    experience: 450,
    totalPoints: 1250,
    streak: 3,
    completedLessons: 12,
    completedGames: 8,
    achievements: 4,
    accuracy: 87,
    totalTimeSpent: 360, // minutes
    averageSessionLength: 30,
    sessionsThisWeek: 5,
    experienceToNextLevel: 50,
    levelProgress: 90,
    weeklyProgress: [
      { day: 'Mon', points: 45 },
      { day: 'Tue', points: 67 },
      { day: 'Wed', points: 23 },
      { day: 'Thu', points: 89 },
      { day: 'Fri', points: 34 },
      { day: 'Sat', points: 56 },
      { day: 'Sun', points: 78 }
    ],
    subjectProgress: {
      mathematics: {
        completed: 8,
        total: 15,
        accuracy: 92
      },
      physics: {
        completed: 4,
        total: 10,
        accuracy: 78
      }
    }
  };

  res.json({
    success: true,
    message: 'User statistics retrieved successfully',
    data: mockStats
  });
}));

// @desc    Get user achievements
// @route   GET /api/user/achievements
// @access  Private
router.get('/achievements', asyncHandler(async (req, res) => {
  const mockAchievements = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      earned: true,
      earnedAt: '2024-01-15T10:30:00Z',
      category: 'learning'
    },
    {
      id: '2',
      name: 'Streak Master',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      earned: true,
      earnedAt: '2024-01-20T14:15:00Z',
      category: 'consistency'
    },
    {
      id: '3',
      name: 'Math Wizard',
      description: 'Score 100% on 10 quizzes',
      icon: '🧙‍♂️',
      earned: false,
      progress: 7,
      required: 10,
      category: 'mastery'
    },
    {
      id: '4',
      name: 'Game Champion',
      description: 'Win 50 games',
      icon: '🏆',
      earned: false,
      progress: 23,
      required: 50,
      category: 'gaming'
    },
    {
      id: '5',
      name: 'Physics Explorer',
      description: 'Complete 5 physics lessons',
      icon: '⚡',
      earned: true,
      earnedAt: '2024-01-25T09:45:00Z',
      category: 'subject'
    }
  ];

  res.json({
    success: true,
    message: 'User achievements retrieved successfully',
    data: mockAchievements
  });
}));

// @desc    Get user progress
// @route   GET /api/user/progress
// @access  Private
router.get('/progress', asyncHandler(async (req, res) => {
  const { subject, grade } = req.query;

  const mockProgress = {
    overall: {
      level: 5,
      experience: 450,
      totalPoints: 1250,
      streak: 3,
      accuracy: 87
    },
    subjects: {
      mathematics: {
        completedLessons: 8,
        totalLessons: 15,
        completedGames: 5,
        totalGames: 12,
        accuracy: 92,
        topics: [
          { name: 'Algebra Basics', progress: 100, completed: true },
          { name: 'Linear Equations', progress: 75, completed: false },
          { name: 'Geometry', progress: 30, completed: false },
          { name: 'Statistics', progress: 0, completed: false }
        ]
      },
      physics: {
        completedLessons: 4,
        totalLessons: 10,
        completedGames: 3,
        totalGames: 8,
        accuracy: 78,
        topics: [
          { name: 'Forces and Motion', progress: 100, completed: true },
          { name: 'Energy', progress: 60, completed: false },
          { name: 'Waves', progress: 0, completed: false },
          { name: 'Electricity', progress: 0, completed: false }
        ]
      }
    },
    recentActivity: [
      {
        id: '1',
        type: 'lesson',
        title: 'Linear Equations',
        subject: 'mathematics',
        completedAt: '2024-01-25T10:30:00Z',
        score: 85,
        timeSpent: 25
      },
      {
        id: '2',
        type: 'game',
        title: 'Number Ninja',
        subject: 'mathematics',
        completedAt: '2024-01-24T15:45:00Z',
        score: 200,
        timeSpent: 10
      },
      {
        id: '3',
        type: 'quiz',
        title: 'Physics Quiz',
        subject: 'physics',
        completedAt: '2024-01-23T14:20:00Z',
        score: 90,
        timeSpent: 15
      }
    ]
  };

  res.json({
    success: true,
    message: 'User progress retrieved successfully',
    data: mockProgress
  });
}));

// @desc    Get leaderboard
// @route   GET /api/user/leaderboard
// @access  Public
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const { subject, grade, timeFrame = 'all' } = req.query;

  const mockLeaderboard = [
    {
      rank: 1,
      userId: 'user1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      grade: 8,
      totalPoints: 2840,
      level: 12,
      streak: 15,
      avatar: null
    },
    {
      rank: 2,
      userId: 'user2',
      firstName: 'Michael',
      lastName: 'Chen',
      grade: 8,
      totalPoints: 2650,
      level: 11,
      streak: 12,
      avatar: null
    },
    {
      rank: 3,
      userId: 'user3',
      firstName: 'Emma',
      lastName: 'Rodriguez',
      grade: 8,
      totalPoints: 2480,
      level: 10,
      streak: 8,
      avatar: null
    },
    {
      rank: 4,
      userId: 'user4',
      firstName: 'Alex',
      lastName: 'Thompson',
      grade: 8,
      totalPoints: 2320,
      level: 10,
      streak: 6,
      avatar: null
    },
    {
      rank: 5,
      userId: 'user5',
      firstName: 'Zoe',
      lastName: 'Williams',
      grade: 8,
      totalPoints: 2180,
      level: 9,
      streak: 10,
      avatar: null
    }
  ];

  res.json({
    success: true,
    message: 'Leaderboard retrieved successfully',
    data: {
      leaderboard: mockLeaderboard,
      userRank: 12,
      userPoints: 1250,
      timeFrame,
      subject: subject || 'all',
      grade: grade || 'all'
    }
  });
}));

// @desc    Get user friends
// @route   GET /api/user/friends
// @access  Private
router.get('/friends', asyncHandler(async (req, res) => {
  const mockFriends = [
    {
      id: 'friend1',
      firstName: 'Emma',
      lastName: 'Rodriguez',
      grade: 8,
      level: 7,
      totalPoints: 1850,
      isOnline: true,
      lastActive: '2024-01-25T10:30:00Z'
    },
    {
      id: 'friend2',
      firstName: 'Alex',
      lastName: 'Thompson',
      grade: 8,
      level: 6,
      totalPoints: 1620,
      isOnline: false,
      lastActive: '2024-01-24T18:45:00Z'
    },
    {
      id: 'friend3',
      firstName: 'Zoe',
      lastName: 'Williams',
      grade: 8,
      level: 8,
      totalPoints: 2100,
      isOnline: true,
      lastActive: '2024-01-25T11:15:00Z'
    }
  ];

  res.json({
    success: true,
    message: 'Friends list retrieved successfully',
    data: mockFriends
  });
}));

// @desc    Add friend
// @route   POST /api/user/friends
// @access  Private
router.post('/friends', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { email } = req.body;

  // Mock friend request - in real app, send actual friend request
  res.json({
    success: true,
    message: 'Friend request sent successfully'
  });
}));

// @desc    Get user settings
// @route   GET /api/user/settings
// @access  Private
router.get('/settings', asyncHandler(async (req, res) => {
  const mockSettings = {
    notifications: {
      email: true,
      push: true
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true
    },
    accessibility: {
      fontSize: 'medium',
      colorBlindMode: false
    },
    learning: {
      autoPlayVideos: true,
      showHints: true,
      difficulty: 'intermediate'
    }
  };

  res.json({
    success: true,
    message: 'User settings retrieved successfully',
    data: mockSettings
  });
}));

// @desc    Update user settings
// @route   PUT /api/user/settings
// @access  Private
router.put('/settings', asyncHandler(async (req, res) => {
  const { notifications, privacy, accessibility, learning } = req.body;

  // Mock settings update - in real app, update actual user settings
  const updatedSettings = {
    notifications: notifications || {
      email: true,
      push: true
    },
    privacy: privacy || {
      profileVisibility: 'public',
      showProgress: true
    },
    accessibility: accessibility || {
      fontSize: 'medium',
      colorBlindMode: false
    },
    learning: learning || {
      autoPlayVideos: true,
      showHints: true,
      difficulty: 'intermediate'
    }
  };

  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: updatedSettings
  });
}));

module.exports = router; 