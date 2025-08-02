const express = require('express');
const asyncHandler = require('express-async-handler');
const { query, body, validationResult } = require('express-validator');

const router = express.Router();

// @desc    Get all games
// @route   GET /api/game/games
// @access  Public
router.get('/games', [
  query('subject').optional().isIn(['mathematics', 'physics']),
  query('grade').optional().isInt({ min: 1, max: 12 }),
  query('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  query('type').optional().isIn(['puzzle', 'quiz', 'simulation', 'arcade'])
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { subject, grade, difficulty, type } = req.query;

  const mockGames = [
    {
      id: '1',
      title: 'Number Ninja',
      description: 'Practice mental math by solving equations quickly',
      subject: 'mathematics',
      grade: 8,
      difficulty: 'beginner',
      type: 'arcade',
      thumbnail: '/api/placeholder/300/200',
      estimatedDuration: 10,
      highScore: 2500,
      personalBest: 1800,
      completed: true,
      rating: 4.6,
      players: 1250
    },
    {
      id: '2',
      title: 'Geometry Puzzle',
      description: 'Solve geometric puzzles by matching shapes and angles',
      subject: 'mathematics',
      grade: 8,
      difficulty: 'intermediate',
      type: 'puzzle',
      thumbnail: '/api/placeholder/300/200',
      estimatedDuration: 15,
      highScore: 1800,
      personalBest: 1200,
      completed: false,
      rating: 4.3,
      players: 890
    },
    {
      id: '3',
      title: 'Physics Simulator',
      description: 'Experiment with forces and motion in a virtual lab',
      subject: 'physics',
      grade: 8,
      difficulty: 'intermediate',
      type: 'simulation',
      thumbnail: '/api/placeholder/300/200',
      estimatedDuration: 20,
      highScore: 3200,
      personalBest: 2800,
      completed: true,
      rating: 4.8,
      players: 650
    },
    {
      id: '4',
      title: 'Algebra Quiz',
      description: 'Test your algebra skills with timed questions',
      subject: 'mathematics',
      grade: 8,
      difficulty: 'advanced',
      type: 'quiz',
      thumbnail: '/api/placeholder/300/200',
      estimatedDuration: 12,
      highScore: 1500,
      personalBest: 1100,
      completed: false,
      rating: 4.1,
      players: 720
    },
    {
      id: '5',
      title: 'Energy Conservation',
      description: 'Learn about energy conservation through interactive challenges',
      subject: 'physics',
      grade: 8,
      difficulty: 'beginner',
      type: 'simulation',
      thumbnail: '/api/placeholder/300/200',
      estimatedDuration: 18,
      highScore: 2100,
      personalBest: 1600,
      completed: false,
      rating: 4.4,
      players: 540
    }
  ];

  // Filter games based on query parameters
  let filteredGames = mockGames;
  
  if (subject) {
    filteredGames = filteredGames.filter(game => game.subject === subject);
  }
  
  if (grade) {
    filteredGames = filteredGames.filter(game => game.grade === parseInt(grade));
  }
  
  if (difficulty) {
    filteredGames = filteredGames.filter(game => game.difficulty === difficulty);
  }
  
  if (type) {
    filteredGames = filteredGames.filter(game => game.type === type);
  }

  res.json({
    success: true,
    message: 'Games retrieved successfully',
    data: {
      games: filteredGames,
      total: filteredGames.length,
      filters: { subject, grade, difficulty, type }
    }
  });
}));

// @desc    Get game by ID
// @route   GET /api/game/games/:id
// @access  Public
router.get('/games/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const mockGame = {
    id: id,
    title: 'Number Ninja',
    description: 'Practice mental math by solving equations quickly. Race against time to solve as many problems as possible!',
    subject: 'mathematics',
    grade: 8,
    difficulty: 'beginner',
    type: 'arcade',
    thumbnail: '/api/placeholder/300/200',
    estimatedDuration: 10,
    instructions: [
      'Solve the math equation shown on screen',
      'Type your answer and press Enter',
      'Earn points for correct answers',
      'Lose time for incorrect answers',
      'Try to achieve the highest score!'
    ],
    features: [
      'Progressive difficulty levels',
      'Multiple equation types',
      'Real-time scoring',
      'Leaderboard integration',
      'Achievement system'
    ],
    learningObjectives: [
      'Improve mental math skills',
      'Practice equation solving',
      'Enhance calculation speed',
      'Build mathematical confidence'
    ],
    gameUrl: '/games/number-ninja',
    highScores: [
      { rank: 1, player: 'Sarah J.', score: 2500, date: '2024-01-25' },
      { rank: 2, player: 'Mike C.', score: 2300, date: '2024-01-24' },
      { rank: 3, player: 'Emma R.', score: 2100, date: '2024-01-23' }
    ],
    personalStats: {
      bestScore: 1800,
      averageScore: 1200,
      gamesPlayed: 15,
      totalTime: 150 // minutes
    }
  };

  res.json({
    success: true,
    message: 'Game retrieved successfully',
    data: mockGame
  });
}));

// @desc    Start a game session
// @route   POST /api/game/games/:id/start
// @access  Private
router.post('/games/:id/start', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, difficulty } = req.body;

  // Mock game session - in real app, create actual game session
  const mockGameSession = {
    sessionId: 'session-' + Date.now(),
    gameId: id,
    userId: userId || 'mock-user-id',
    difficulty: difficulty || 'beginner',
    startTime: new Date().toISOString(),
    status: 'active',
    score: 0,
    level: 1,
    lives: 3
  };

  res.json({
    success: true,
    message: 'Game session started successfully',
    data: mockGameSession
  });
}));

// @desc    Update game progress
// @route   POST /api/game/games/:id/progress
// @access  Private
router.post('/games/:id/progress', [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('score').isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),
  body('level').optional().isInt({ min: 1 }).withMessage('Level must be a positive integer'),
  body('lives').optional().isInt({ min: 0 }).withMessage('Lives must be a non-negative integer'),
  body('status').optional().isIn(['active', 'paused', 'completed', 'failed']).withMessage('Invalid status')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const { sessionId, score, level, lives, status } = req.body;

  // Mock progress update - in real app, update actual game progress
  const mockProgress = {
    sessionId,
    gameId: id,
    score,
    level: level || 1,
    lives: lives || 3,
    status: status || 'active',
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Game progress updated successfully',
    data: mockProgress
  });
}));

// @desc    End game session
// @route   POST /api/game/games/:id/end
// @access  Private
router.post('/games/:id/end', [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('finalScore').isInt({ min: 0 }).withMessage('Final score must be a non-negative integer'),
  body('timeSpent').isInt({ min: 0 }).withMessage('Time spent must be a non-negative integer'),
  body('accuracy').optional().isFloat({ min: 0, max: 100 }).withMessage('Accuracy must be between 0 and 100')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const { sessionId, finalScore, timeSpent, accuracy } = req.body;

  // Mock game completion - in real app, save actual game results
  const mockGameResult = {
    sessionId,
    gameId: id,
    finalScore,
    timeSpent,
    accuracy: accuracy || 85,
    completedAt: new Date().toISOString(),
    experienceGained: Math.floor(finalScore / 10),
    pointsEarned: finalScore,
    achievements: finalScore > 2000 ? ['High Scorer'] : []
  };

  res.json({
    success: true,
    message: 'Game session ended successfully',
    data: mockGameResult
  });
}));

// @desc    Get game leaderboard
// @route   GET /api/game/games/:id/leaderboard
// @access  Public
router.get('/games/:id/leaderboard', [
  query('timeFrame').optional().isIn(['all', 'week', 'month']).withMessage('Invalid time frame')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const { timeFrame = 'all' } = req.query;

  const mockLeaderboard = [
    {
      rank: 1,
      playerId: 'user1',
      playerName: 'Sarah J.',
      score: 2500,
      timeSpent: 8,
      date: '2024-01-25T10:30:00Z'
    },
    {
      rank: 2,
      playerId: 'user2',
      playerName: 'Mike C.',
      score: 2300,
      timeSpent: 9,
      date: '2024-01-24T15:45:00Z'
    },
    {
      rank: 3,
      playerId: 'user3',
      playerName: 'Emma R.',
      score: 2100,
      timeSpent: 7,
      date: '2024-01-23T14:20:00Z'
    },
    {
      rank: 4,
      playerId: 'user4',
      playerName: 'Alex T.',
      score: 1950,
      timeSpent: 10,
      date: '2024-01-22T16:15:00Z'
    },
    {
      rank: 5,
      playerId: 'user5',
      playerName: 'Zoe W.',
      score: 1800,
      timeSpent: 6,
      date: '2024-01-21T11:30:00Z'
    }
  ];

  res.json({
    success: true,
    message: 'Game leaderboard retrieved successfully',
    data: {
      gameId: id,
      leaderboard: mockLeaderboard,
      timeFrame,
      userRank: 12,
      userScore: 1200
    }
  });
}));

// @desc    Get user game statistics
// @route   GET /api/game/stats
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const mockGameStats = {
    totalGamesPlayed: 45,
    totalTimeSpent: 360, // minutes
    averageScore: 1250,
    bestScore: 2500,
    favoriteGame: 'Number Ninja',
    achievements: [
      { id: '1', name: 'First Win', description: 'Win your first game', earned: true },
      { id: '2', name: 'High Scorer', description: 'Score over 2000 points', earned: true },
      { id: '3', name: 'Speed Demon', description: 'Complete a game in under 5 minutes', earned: false }
    ],
    recentGames: [
      {
        id: '1',
        gameTitle: 'Number Ninja',
        score: 1800,
        timeSpent: 8,
        date: '2024-01-25T10:30:00Z'
      },
      {
        id: '2',
        gameTitle: 'Geometry Puzzle',
        score: 1200,
        timeSpent: 15,
        date: '2024-01-24T15:45:00Z'
      },
      {
        id: '3',
        gameTitle: 'Physics Simulator',
        score: 2800,
        timeSpent: 20,
        date: '2024-01-23T14:20:00Z'
      }
    ],
    gameProgress: {
      'Number Ninja': { played: 15, bestScore: 1800, averageScore: 1200 },
      'Geometry Puzzle': { played: 8, bestScore: 1200, averageScore: 900 },
      'Physics Simulator': { played: 12, bestScore: 2800, averageScore: 2200 },
      'Algebra Quiz': { played: 6, bestScore: 1100, averageScore: 800 },
      'Energy Conservation': { played: 4, bestScore: 1600, averageScore: 1400 }
    }
  };

  res.json({
    success: true,
    message: 'Game statistics retrieved successfully',
    data: mockGameStats
  });
}));

// @desc    Get game achievements
// @route   GET /api/game/achievements
// @access  Public
router.get('/achievements', asyncHandler(async (req, res) => {
  const mockAchievements = [
    {
      id: '1',
      name: 'First Win',
      description: 'Win your first game',
      icon: '🏆',
      category: 'milestone',
      earned: true,
      earnedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'High Scorer',
      description: 'Score over 2000 points in any game',
      icon: '⭐',
      category: 'performance',
      earned: true,
      earnedAt: '2024-01-20T14:15:00Z'
    },
    {
      id: '3',
      name: 'Speed Demon',
      description: 'Complete a game in under 5 minutes',
      icon: '⚡',
      category: 'speed',
      earned: false,
      progress: 2,
      required: 1
    },
    {
      id: '4',
      name: 'Game Master',
      description: 'Win 50 games total',
      icon: '👑',
      category: 'milestone',
      earned: false,
      progress: 45,
      required: 50
    },
    {
      id: '5',
      name: 'Perfect Score',
      description: 'Achieve 100% accuracy in any game',
      icon: '💯',
      category: 'performance',
      earned: false,
      progress: 0,
      required: 1
    }
  ];

  res.json({
    success: true,
    message: 'Game achievements retrieved successfully',
    data: mockAchievements
  });
}));

module.exports = router; 