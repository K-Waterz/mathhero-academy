const express = require('express');
const asyncHandler = require('express-async-handler');
const { query, validationResult } = require('express-validator');

const router = express.Router();

// @desc    Get all lessons
// @route   GET /api/content/lessons
// @access  Public
router.get('/lessons', [
  query('subject').optional().isIn(['mathematics', 'physics']),
  query('grade').optional().isInt({ min: 1, max: 12 }),
  query('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  query('topic').optional().isString()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { subject, grade, difficulty, topic } = req.query;

  const mockLessons = [
    {
      id: '1',
      title: 'Algebra Basics',
      description: 'Learn the fundamentals of algebra including variables, expressions, and equations.',
      subject: 'mathematics',
      grade: 8,
      difficulty: 'beginner',
      duration: 45,
      topics: ['variables', 'expressions', 'equations'],
      thumbnail: '/api/placeholder/300/200',
      progress: 100,
      completed: true,
      rating: 4.5,
      enrolledStudents: 1250
    },
    {
      id: '2',
      title: 'Linear Equations',
      description: 'Master solving linear equations with one variable and understanding their applications.',
      subject: 'mathematics',
      grade: 8,
      difficulty: 'intermediate',
      duration: 60,
      topics: ['linear equations', 'solving', 'applications'],
      thumbnail: '/api/placeholder/300/200',
      progress: 75,
      completed: false,
      rating: 4.2,
      enrolledStudents: 980
    },
    {
      id: '3',
      title: 'Forces and Motion',
      description: 'Explore the fundamental principles of forces and how they affect motion.',
      subject: 'physics',
      grade: 8,
      difficulty: 'beginner',
      duration: 50,
      topics: ['forces', 'motion', 'newton laws'],
      thumbnail: '/api/placeholder/300/200',
      progress: 100,
      completed: true,
      rating: 4.7,
      enrolledStudents: 890
    },
    {
      id: '4',
      title: 'Energy and Work',
      description: 'Learn about different forms of energy and the relationship between work and energy.',
      subject: 'physics',
      grade: 8,
      difficulty: 'intermediate',
      duration: 55,
      topics: ['energy', 'work', 'conservation'],
      thumbnail: '/api/placeholder/300/200',
      progress: 60,
      completed: false,
      rating: 4.3,
      enrolledStudents: 720
    },
    {
      id: '5',
      title: 'Geometry Fundamentals',
      description: 'Discover geometric shapes, angles, and basic geometric concepts.',
      subject: 'mathematics',
      grade: 8,
      difficulty: 'beginner',
      duration: 40,
      topics: ['shapes', 'angles', 'perimeter', 'area'],
      thumbnail: '/api/placeholder/300/200',
      progress: 30,
      completed: false,
      rating: 4.1,
      enrolledStudents: 650
    }
  ];

  // Filter lessons based on query parameters
  let filteredLessons = mockLessons;
  
  if (subject) {
    filteredLessons = filteredLessons.filter(lesson => lesson.subject === subject);
  }
  
  if (grade) {
    filteredLessons = filteredLessons.filter(lesson => lesson.grade === parseInt(grade));
  }
  
  if (difficulty) {
    filteredLessons = filteredLessons.filter(lesson => lesson.difficulty === difficulty);
  }
  
  if (topic) {
    filteredLessons = filteredLessons.filter(lesson => 
      lesson.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
    );
  }

  res.json({
    success: true,
    message: 'Lessons retrieved successfully',
    data: {
      lessons: filteredLessons,
      total: filteredLessons.length,
      filters: { subject, grade, difficulty, topic }
    }
  });
}));

// @desc    Get lesson by ID
// @route   GET /api/content/lessons/:id
// @access  Public
router.get('/lessons/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const mockLesson = {
    id: id,
    title: 'Linear Equations',
    description: 'Master solving linear equations with one variable and understanding their applications.',
    subject: 'mathematics',
    grade: 8,
    difficulty: 'intermediate',
    duration: 60,
    topics: ['linear equations', 'solving', 'applications'],
    thumbnail: '/api/placeholder/300/200',
    content: {
      sections: [
        {
          id: '1',
          title: 'Introduction to Linear Equations',
          type: 'video',
          duration: 10,
          content: 'Learn what linear equations are and why they are important in mathematics.',
          videoUrl: '/api/videos/linear-equations-intro'
        },
        {
          id: '2',
          title: 'Solving Simple Linear Equations',
          type: 'interactive',
          duration: 15,
          content: 'Practice solving basic linear equations step by step.',
          interactiveUrl: '/api/interactive/solving-equations'
        },
        {
          id: '3',
          title: 'Word Problems with Linear Equations',
          type: 'text',
          duration: 20,
          content: 'Learn how to translate word problems into linear equations and solve them.',
          textContent: 'Word problems often involve translating real-world situations into mathematical equations...'
        },
        {
          id: '4',
          title: 'Practice Problems',
          type: 'quiz',
          duration: 15,
          content: 'Test your understanding with practice problems.',
          quizId: 'linear-equations-quiz'
        }
      ],
      resources: [
        {
          id: '1',
          title: 'Linear Equations Cheat Sheet',
          type: 'pdf',
          url: '/api/resources/linear-equations-cheat-sheet.pdf'
        },
        {
          id: '2',
          title: 'Practice Worksheet',
          type: 'pdf',
          url: '/api/resources/linear-equations-worksheet.pdf'
        }
      ]
    },
    prerequisites: ['Algebra Basics'],
    learningObjectives: [
      'Understand what linear equations are',
      'Solve linear equations with one variable',
      'Apply linear equations to word problems',
      'Verify solutions to linear equations'
    ],
    assessment: {
      quizId: 'linear-equations-final-quiz',
      passingScore: 80,
      timeLimit: 30
    }
  };

  res.json({
    success: true,
    message: 'Lesson retrieved successfully',
    data: mockLesson
  });
}));

// @desc    Get topics by subject and grade
// @route   GET /api/content/topics
// @access  Public
router.get('/topics', [
  query('subject').isIn(['mathematics', 'physics']),
  query('grade').isInt({ min: 1, max: 12 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { subject, grade } = req.query;

  const mockTopics = {
    mathematics: {
      8: [
        {
          id: '1',
          name: 'Algebra',
          description: 'Learn about variables, expressions, and equations',
          lessons: 5,
          completed: 2,
          progress: 40
        },
        {
          id: '2',
          name: 'Geometry',
          description: 'Explore geometric shapes, angles, and measurements',
          lessons: 4,
          completed: 1,
          progress: 25
        },
        {
          id: '3',
          name: 'Statistics',
          description: 'Understand data analysis and probability',
          lessons: 3,
          completed: 0,
          progress: 0
        }
      ]
    },
    physics: {
      8: [
        {
          id: '1',
          name: 'Forces and Motion',
          description: 'Learn about forces, motion, and Newton\'s laws',
          lessons: 4,
          completed: 2,
          progress: 50
        },
        {
          id: '2',
          name: 'Energy',
          description: 'Explore different forms of energy and conservation',
          lessons: 3,
          completed: 1,
          progress: 33
        },
        {
          id: '3',
          name: 'Waves',
          description: 'Understand wave properties and behavior',
          lessons: 3,
          completed: 0,
          progress: 0
        }
      ]
    }
  };

  const topics = mockTopics[subject]?.[grade] || [];

  res.json({
    success: true,
    message: 'Topics retrieved successfully',
    data: {
      topics,
      subject,
      grade: parseInt(grade),
      totalTopics: topics.length
    }
  });
}));

// @desc    Get curriculum overview
// @route   GET /api/content/curriculum
// @access  Public
router.get('/curriculum', [
  query('grade').optional().isInt({ min: 1, max: 12 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { grade } = req.query;

  const mockCurriculum = {
    overview: {
      totalLessons: 45,
      totalGames: 23,
      estimatedDuration: '6 months',
      subjects: ['mathematics', 'physics']
    },
    subjects: {
      mathematics: {
        totalLessons: 25,
        totalGames: 12,
        topics: ['Algebra', 'Geometry', 'Statistics'],
        estimatedDuration: '3 months'
      },
      physics: {
        totalLessons: 20,
        totalGames: 11,
        topics: ['Forces and Motion', 'Energy', 'Waves'],
        estimatedDuration: '3 months'
      }
    },
    gradeLevels: {
      1: { totalLessons: 30, subjects: ['mathematics'] },
      2: { totalLessons: 32, subjects: ['mathematics'] },
      3: { totalLessons: 35, subjects: ['mathematics'] },
      4: { totalLessons: 38, subjects: ['mathematics'] },
      5: { totalLessons: 40, subjects: ['mathematics'] },
      6: { totalLessons: 42, subjects: ['mathematics'] },
      7: { totalLessons: 44, subjects: ['mathematics', 'physics'] },
      8: { totalLessons: 45, subjects: ['mathematics', 'physics'] },
      9: { totalLessons: 48, subjects: ['mathematics', 'physics'] },
      10: { totalLessons: 50, subjects: ['mathematics', 'physics'] },
      11: { totalLessons: 52, subjects: ['mathematics', 'physics'] },
      12: { totalLessons: 55, subjects: ['mathematics', 'physics'] }
    }
  };

  res.json({
    success: true,
    message: 'Curriculum overview retrieved successfully',
    data: mockCurriculum
  });
}));

// @desc    Get lesson progress
// @route   GET /api/content/lessons/:id/progress
// @access  Private
router.get('/lessons/:id/progress', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const mockProgress = {
    lessonId: id,
    completed: false,
    progress: 75,
    timeSpent: 45, // minutes
    sections: [
      {
        id: '1',
        title: 'Introduction to Linear Equations',
        completed: true,
        timeSpent: 10,
        score: 100
      },
      {
        id: '2',
        title: 'Solving Simple Linear Equations',
        completed: true,
        timeSpent: 15,
        score: 85
      },
      {
        id: '3',
        title: 'Word Problems with Linear Equations',
        completed: false,
        timeSpent: 20,
        score: null
      },
      {
        id: '4',
        title: 'Practice Problems',
        completed: false,
        timeSpent: 0,
        score: null
      }
    ],
    lastAccessed: '2024-01-25T10:30:00Z',
    nextSection: '3'
  };

  res.json({
    success: true,
    message: 'Lesson progress retrieved successfully',
    data: mockProgress
  });
}));

// @desc    Update lesson progress
// @route   POST /api/content/lessons/:id/progress
// @access  Private
router.post('/lessons/:id/progress', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sectionId, completed, timeSpent, score } = req.body;

  // Mock progress update - in real app, update actual progress
  const mockUpdatedProgress = {
    lessonId: id,
    sectionId,
    completed,
    timeSpent,
    score,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Lesson progress updated successfully',
    data: mockUpdatedProgress
  });
}));

// @desc    Get recommended lessons
// @route   GET /api/content/recommendations
// @access  Private
router.get('/recommendations', asyncHandler(async (req, res) => {
  const { userId, subject, grade } = req.query;

  const mockRecommendations = [
    {
      id: '1',
      title: 'Linear Equations',
      subject: 'mathematics',
      grade: 8,
      difficulty: 'intermediate',
      reason: 'Based on your progress in Algebra Basics',
      thumbnail: '/api/placeholder/300/200',
      estimatedDuration: 60
    },
    {
      id: '2',
      title: 'Energy and Work',
      subject: 'physics',
      grade: 8,
      difficulty: 'intermediate',
      reason: 'Recommended after completing Forces and Motion',
      thumbnail: '/api/placeholder/300/200',
      estimatedDuration: 55
    },
    {
      id: '3',
      title: 'Geometry Fundamentals',
      subject: 'mathematics',
      grade: 8,
      difficulty: 'beginner',
      reason: 'Good foundation for advanced topics',
      thumbnail: '/api/placeholder/300/200',
      estimatedDuration: 40
    }
  ];

  res.json({
    success: true,
    message: 'Recommended lessons retrieved successfully',
    data: mockRecommendations
  });
}));

module.exports = router; 