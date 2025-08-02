'use client'

import Link from 'next/link'
import { BookOpen, Calendar, User } from 'lucide-react'

const articles = [
  {
    id: '1',
    title: 'How to Make Math Fun: Gamification in the Classroom',
    summary: 'Discover how gamified learning can transform math education for students of all ages.',
    date: '2024-05-01',
    author: 'MathHero AI',
    tags: ['gamification', 'math', 'education'],
    slug: 'make-math-fun-gamification',
  },
  {
    id: '2',
    title: 'Top 5 Physics Games for High School Students',
    summary: 'Explore the best interactive games to help high schoolers master physics concepts.',
    date: '2024-05-03',
    author: 'MathHero AI',
    tags: ['physics', 'games', 'high school'],
    slug: 'top-physics-games',
  },
  {
    id: '3',
    title: 'AI Tutors: The Future of Personalized Learning',
    summary: 'How AI-powered tutors are changing the way students learn math and science.',
    date: '2024-05-05',
    author: 'MathHero AI',
    tags: ['ai', 'tutoring', 'personalized learning'],
    slug: 'ai-tutors-future',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">MathHero Academy Blog</h1>
        <p className="text-lg text-gray-600 mb-12">Insights, tips, and stories about gamified learning, AI, and STEM education.</p>
        <div className="space-y-8">
          {articles.map(article => (
            <div key={article.id} className="card p-6 flex flex-col md:flex-row md:items-center md:space-x-6">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <BookOpen className="w-12 h-12 text-primary-500" />
              </div>
              <div className="flex-1">
                <Link href={`/blog/${article.slug}`} className="text-2xl font-semibold text-gray-900 hover:text-primary-500">
                  {article.title}
                </Link>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{article.date}</span>
                  <span className="flex items-center"><User className="w-4 h-4 mr-1" />{article.author}</span>
                  <span>{article.tags.map(tag => <span key={tag} className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 rounded-full text-xs">#{tag}</span>)}</span>
                </div>
                <p className="mt-3 text-gray-600">{article.summary}</p>
                <Link href={`/blog/${article.slug}`} className="text-primary-500 hover:underline mt-2 inline-block">Read more &rarr;</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}