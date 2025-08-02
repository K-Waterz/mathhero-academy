const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  grade: {
    type: Number,
    required: [true, 'Grade level is required'],
    min: [1, 'Grade must be between 1 and 12'],
    max: [12, 'Grade must be between 1 and 12']
  },
  avatar: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Gamification fields
  level: {
    type: Number,
    default: 1,
    min: [1, 'Level cannot be less than 1']
  },
  experience: {
    type: Number,
    default: 0,
    min: [0, 'Experience cannot be negative']
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  streak: {
    type: Number,
    default: 0,
    min: [0, 'Streak cannot be negative']
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  
  // Learning preferences
  subjects: [{
    type: String,
    enum: ['mathematics', 'physics'],
    default: ['mathematics']
  }],
  preferredDifficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  
  // Progress tracking
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    timeSpent: Number // in minutes
  }],
  
  completedGames: [{
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number,
    timeSpent: Number
  }],
  
  // Achievements
  achievements: [{
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Settings
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      },
      showProgress: {
        type: Boolean,
        default: true
      }
    },
    accessibility: {
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
      },
      colorBlindMode: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Social features
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Subscription and billing
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  
  // Analytics
  analytics: {
    totalTimeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    averageSessionLength: {
      type: Number,
      default: 0 // in minutes
    },
    sessionsThisWeek: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for experience to next level
userSchema.virtual('experienceToNextLevel').get(function() {
  const experienceForNextLevel = this.level * 100; // Simple formula
  return Math.max(0, experienceForNextLevel - this.experience);
});

// Virtual for progress percentage to next level
userSchema.virtual('levelProgress').get(function() {
  const experienceForCurrentLevel = (this.level - 1) * 100;
  const experienceForNextLevel = this.level * 100;
  const currentLevelExperience = this.experience - experienceForCurrentLevel;
  const totalExperienceNeeded = experienceForNextLevel - experienceForCurrentLevel;
  return Math.min(100, Math.max(0, (currentLevelExperience / totalExperienceNeeded) * 100));
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ grade: 1 });
userSchema.index({ level: -1 });
userSchema.index({ totalPoints: -1 });
userSchema.index({ 'completedLessons.lessonId': 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add experience and handle leveling up
userSchema.methods.addExperience = function(amount) {
  this.experience += amount;
  this.totalPoints += amount;
  
  // Check for level up
  const experienceForNextLevel = this.level * 100;
  if (this.experience >= experienceForNextLevel) {
    this.level += 1;
    return { leveledUp: true, newLevel: this.level };
  }
  
  return { leveledUp: false };
};

// Method to update streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActive = new Date(this.lastActiveDate);
  const diffTime = Math.abs(today - lastActive);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    this.streak += 1;
  } else if (diffDays > 1) {
    this.streak = 1;
  }
  
  this.lastActiveDate = today;
  return this.streak;
};

// Method to check if lesson is completed
userSchema.methods.hasCompletedLesson = function(lessonId) {
  return this.completedLessons.some(lesson => 
    lesson.lessonId.toString() === lessonId.toString()
  );
};

// Method to check if game is completed
userSchema.methods.hasCompletedGame = function(gameId) {
  return this.completedGames.some(game => 
    game.gameId.toString() === gameId.toString()
  );
};

// Method to get user statistics
userSchema.methods.getStats = function() {
  return {
    level: this.level,
    experience: this.experience,
    totalPoints: this.totalPoints,
    streak: this.streak,
    completedLessons: this.completedLessons.length,
    completedGames: this.completedGames.length,
    achievements: this.achievements.length,
    accuracy: this.analytics.accuracy,
    totalTimeSpent: this.analytics.totalTimeSpent
  };
};

module.exports = mongoose.model('User', userSchema); 