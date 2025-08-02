'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Brain, 
  Trophy, 
  BookOpen, 
  Gamepad2, 
  Target, 
  TrendingUp,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Play,
  Award,
  Users,
  BarChart3
} from 'lucide-react'

export default function DashboardPage() {
  const [selectedGrade, setSelectedGrade] = useState('8')

  // Mock data - in a real app, this would come from an API
  const userStats = {
    totalPoints: 2840,
    level: 12,
    streak: 7,
    completedLessons: 45,
    totalGames: 23,
    accuracy: 87
  }

  const recentActivities = [
    {
      id: 1,
      type: 'lesson',
      title: 'Algebra Basics',
      subject: 'Mathematics',
      grade: 'Grade 8',
      completed: true,
      time: '2 hours ago',
      points: 150
    },
    {
      id: 2,
      type: 'game',
      title: 'Number Ninja',
      subject: 'Mathematics',
      grade: 'Grade 8',
      completed: true,
      time: '4 hours ago',
      points: 200
    },
    {
      id: 3,
      type: 'quiz',
      title: 'Physics Quiz',
      subject: 'Physics',
      grade: 'Grade 8',
      completed: false,
      time: '1 day ago',
      points: 0
    }
  ]

  const recommendedLessons = [
    {
      id: 1,
      title: 'Linear Equations',
      subject: 'Mathematics',
      difficulty: 'Intermediate',
      duration: '45 min',
      thumbnail: '/api/placeholder/300/200',
      progress: 0
    },
    {
      id: 2,
      title: 'Forces and Motion',
      subject: 'Physics',
      difficulty: 'Beginner',
      duration: '30 min',
      thumbnail: '/api/placeholder/300/200',
      progress: 0
    },
    {
      id: 3,
      title: 'Geometry Basics',
      subject: 'Mathematics',
      difficulty: 'Beginner',
      duration: '40 min',
      thumbnail: '/api/placeholder/300/200',
      progress: 0
    }
  ]

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', earned: true, icon: '🎯' },
    { id: 2, name: 'Streak Master', description: 'Maintain a 7-day streak', earned: true, icon: '🔥' },
    { id: 3, name: 'Math Wizard', description: 'Score 100% on 10 quizzes', earned: false, icon: '🧙‍♂️' },
    { id: 4, name: 'Game Champion', description: 'Win 50 games', earned: false, icon: '🏆' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MathHero Academy</h1>
                <p className="text-sm text-gray-500">Welcome back, Student!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-primary-700">{userStats.totalPoints} pts</span>
              </div>
              <div className="flex items-center space-x-2 bg-accent-50 px-3 py-1 rounded-full">
                <Target className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-medium text-accent-700">Level {userStats.level}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-primary-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats.totalPoints}</div>
                <div className="text-sm text-gray-500">Total Points</div>
              </div>
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-accent-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats.level}</div>
                <div className="text-sm text-gray-500">Current Level</div>
              </div>
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats.streak}</div>
                <div className="text-sm text-gray-500">Day Streak</div>
              </div>
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats.accuracy}%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
            </motion.div>

            {/* Recommended Lessons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                <Link href="/learn" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1 inline" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedLessons.map((lesson) => (
                  <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="w-full h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg mb-3 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{lesson.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{lesson.subject}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{lesson.difficulty}</span>
                      <span>{lesson.duration}</span>
                    </div>
                    <Link href={`/learn/${lesson.id}`} className="btn-primary w-full text-sm py-2">
                      <Play className="w-4 h-4 mr-1" />
                      Start Learning
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                <Link href="/activities" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1 inline" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'lesson' ? 'bg-blue-100' : 
                      activity.type === 'game' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'lesson' ? (
                        <BookOpen className="w-5 h-5 text-blue-500" />
                      ) : activity.type === 'game' ? (
                        <Gamepad2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Target className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-500">{activity.subject} • {activity.grade}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {activity.completed ? (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-900">{activity.points}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not completed</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/learn" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-gray-900">Continue Learning</span>
                </Link>
                <Link href="/games" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Gamepad2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-900">Play Games</span>
                </Link>
                <Link href="/ai-tutor" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-gray-900">AI Tutor</span>
                </Link>
                <Link href="/leaderboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-5 h-5 text-accent-500" />
                  <span className="font-medium text-gray-900">Leaderboard</span>
                </Link>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">Achievements</h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                  }`}>
                    <div className={`text-2xl ${achievement.earned ? '' : 'opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Award className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Study Streak */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="card p-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white"
            >
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{userStats.streak}</div>
                <div className="text-sm opacity-90">Day Study Streak</div>
                <div className="mt-4 text-xs opacity-75">
                  Keep it up! Consistency is key to learning.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 