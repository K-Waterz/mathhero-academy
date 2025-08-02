const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Chat with AI tutor
// @route   POST /api/ai/chat
// @access  Public
router.post('/chat', [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  body('context')
    .optional()
    .isObject()
    .withMessage('Context must be an object'),
  body('grade')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Grade must be between 1 and 12'),
  body('subject')
    .optional()
    .isIn(['mathematics', 'physics'])
    .withMessage('Subject must be either mathematics or physics')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { message, context = {}, grade = 8, subject = 'mathematics' } = req.body;

  try {
    const systemPrompt = `You are MathHero, an AI tutor for MathHero Academy. You help students learn ${subject} from grade ${grade}.

Your role:
- Explain concepts clearly and step-by-step
- Use age-appropriate language for grade ${grade} students
- Provide encouraging and supportive responses
- Include examples and analogies when helpful
- Ask follow-up questions to check understanding
- Suggest related topics or practice problems

Context: ${JSON.stringify(context)}

Always be encouraging and make learning fun!`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      success: true,
      message: 'AI response generated successfully',
      data: {
        response: aiResponse,
        model: 'gpt-4',
        tokens: completion.usage.total_tokens
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

// @desc    Get problem explanation
// @route   POST /api/ai/explain-problem
// @access  Public
router.post('/explain-problem', [
  body('problem')
    .trim()
    .notEmpty()
    .withMessage('Problem is required')
    .isLength({ max: 2000 })
    .withMessage('Problem cannot exceed 2000 characters'),
  body('grade')
    .isInt({ min: 1, max: 12 })
    .withMessage('Grade must be between 1 and 12'),
  body('subject')
    .isIn(['mathematics', 'physics'])
    .withMessage('Subject must be either mathematics or physics'),
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { problem, grade, subject, difficulty = 'intermediate' } = req.body;

  try {
    const systemPrompt = `You are an expert ${subject} tutor for grade ${grade} students. Explain the following problem step-by-step.

Guidelines:
- Break down the solution into clear, logical steps
- Use age-appropriate language for grade ${grade}
- Include the mathematical reasoning behind each step
- Provide visual cues or hints where helpful
- End with a summary of the key concepts
- Suggest similar problems for practice

Problem: ${problem}
Difficulty: ${difficulty}
Subject: ${subject}
Grade: ${grade}

Provide a comprehensive explanation that helps the student understand both the solution and the underlying concepts.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please explain this ${subject} problem for a grade ${grade} student: ${problem}` }
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const explanation = completion.choices[0].message.content;

    res.json({
      success: true,
      message: 'Problem explanation generated successfully',
      data: {
        explanation,
        problem,
        subject,
        grade,
        difficulty,
        model: 'gpt-4',
        tokens: completion.usage.total_tokens
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate problem explanation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

// @desc    Generate practice problems
// @route   POST /api/ai/generate-problems
// @access  Public
router.post('/generate-problems', [
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('Topic is required'),
  body('grade')
    .isInt({ min: 1, max: 12 })
    .withMessage('Grade must be between 1 and 12'),
  body('subject')
    .isIn(['mathematics', 'physics'])
    .withMessage('Subject must be either mathematics or physics'),
  body('count')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Count must be between 1 and 10'),
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { topic, grade, subject, count = 5, difficulty = 'intermediate' } = req.body;

  try {
    const systemPrompt = `Generate ${count} ${difficulty} ${subject} practice problems for grade ${grade} students on the topic: ${topic}.

For each problem, provide:
1. A clear problem statement
2. The correct answer
3. A step-by-step solution
4. The difficulty level
5. Key concepts being tested

Format the response as a JSON array with the following structure:
[
  {
    "problem": "Problem statement",
    "answer": "Correct answer",
    "solution": "Step-by-step solution",
    "difficulty": "beginner/intermediate/advanced",
    "concepts": ["concept1", "concept2"]
  }
]

Make sure the problems are appropriate for grade ${grade} students and cover different aspects of the topic.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate ${count} ${subject} problems for grade ${grade} on ${topic}` }
      ],
      max_tokens: 1500,
      temperature: 0.5,
    });

    const response = completion.choices[0].message.content;
    
    // Try to parse JSON response
    let problems;
    try {
      problems = JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      problems = [{
        problem: "Failed to parse AI response",
        answer: "Please try again",
        solution: "The AI response could not be parsed properly",
        difficulty: difficulty,
        concepts: [topic]
      }];
    }

    res.json({
      success: true,
      message: 'Practice problems generated successfully',
      data: {
        problems,
        topic,
        subject,
        grade,
        difficulty,
        count: problems.length,
        model: 'gpt-4',
        tokens: completion.usage.total_tokens
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate practice problems',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

// @desc    Generate lesson content
// @route   POST /api/ai/generate-lesson
// @access  Public
router.post('/generate-lesson', [
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('Topic is required'),
  body('grade')
    .isInt({ min: 1, max: 12 })
    .withMessage('Grade must be between 1 and 12'),
  body('subject')
    .isIn(['mathematics', 'physics'])
    .withMessage('Subject must be either mathematics or physics'),
  body('duration')
    .optional()
    .isInt({ min: 15, max: 120 })
    .withMessage('Duration must be between 15 and 120 minutes')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { topic, grade, subject, duration = 45 } = req.body;

  try {
    const systemPrompt = `Create a comprehensive ${subject} lesson for grade ${grade} students on the topic: ${topic}.

Lesson structure:
1. Introduction and learning objectives
2. Key concepts with clear explanations
3. Examples and step-by-step demonstrations
4. Interactive practice problems
5. Summary and key takeaways
6. Assessment questions

Guidelines:
- Use age-appropriate language for grade ${grade}
- Include visual descriptions and analogies
- Make it engaging and interactive
- Duration: approximately ${duration} minutes
- Include 3-5 practice problems with solutions
- Add 5 assessment questions with answers

Format as a structured lesson plan with clear sections.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create a ${duration}-minute ${subject} lesson for grade ${grade} on ${topic}` }
      ],
      max_tokens: 2000,
      temperature: 0.4,
    });

    const lessonContent = completion.choices[0].message.content;

    res.json({
      success: true,
      message: 'Lesson content generated successfully',
      data: {
        lesson: lessonContent,
        topic,
        subject,
        grade,
        duration,
        model: 'gpt-4',
        tokens: completion.usage.total_tokens
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate lesson content',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

// @desc    Get learning recommendations
// @route   POST /api/ai/recommendations
// @access  Public
router.post('/recommendations', [
  body('currentTopics')
    .isArray()
    .withMessage('Current topics must be an array'),
  body('grade')
    .isInt({ min: 1, max: 12 })
    .withMessage('Grade must be between 1 and 12'),
  body('subject')
    .isIn(['mathematics', 'physics'])
    .withMessage('Subject must be either mathematics or physics'),
  body('strength')
    .optional()
    .isIn(['weak', 'average', 'strong'])
    .withMessage('Strength must be weak, average, or strong')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { currentTopics, grade, subject, strength = 'average' } = req.body;

  try {
    const systemPrompt = `You are an AI learning advisor for MathHero Academy. Provide personalized learning recommendations for a grade ${grade} student studying ${subject}.

Current topics: ${currentTopics.join(', ')}
Student strength level: ${strength}

Provide recommendations for:
1. Next topics to learn (3-5 recommendations)
2. Practice activities and games
3. Study strategies
4. Resources and materials
5. Learning goals for the next month

Format as a structured response with clear sections.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Provide learning recommendations for grade ${grade} ${subject} student` }
      ],
      max_tokens: 1000,
      temperature: 0.6,
    });

    const recommendations = completion.choices[0].message.content;

    res.json({
      success: true,
      message: 'Learning recommendations generated successfully',
      data: {
        recommendations,
        currentTopics,
        subject,
        grade,
        strength,
        model: 'gpt-4',
        tokens: completion.usage.total_tokens
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate learning recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

module.exports = router; 