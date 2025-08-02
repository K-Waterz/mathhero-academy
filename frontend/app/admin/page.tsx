'use client'

import Link from 'next/link'
import { Users, BookOpen, BarChart3, Settings, Home } from 'lucide-react'

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-4 flex items-center space-x-6">
        <Link href="/admin" className="text-xl font-bold text-primary-500 flex items-center space-x-2">
          <Home className="w-6 h-6 mr-2" />
          Admin Dashboard
        </Link>
        <Link href="/admin/users" className="text-gray-700 hover:text-primary-500">Users</Link>
        <Link href="/admin/content" className="text-gray-700 hover:text-primary-500">Content</Link>
        <Link href="/admin/analytics" className="text-gray-700 hover:text-primary-500">Analytics</Link>
        <Link href="/admin/settings" className="text-gray-700 hover:text-primary-500">Settings</Link>
      </nav>
      <main className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to the Admin Panel</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card p-6 text-center">
            <Users className="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">Manage Users</div>
            <p className="text-gray-500">View, edit, and remove platform users.</p>
            <Link href="/admin/users" className="btn-primary mt-4 inline-block">Go</Link>
          </div>
          <div className="card p-6 text-center">
            <BookOpen className="w-8 h-8 text-accent-500 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">Manage Content</div>
            <p className="text-gray-500">Add, edit, or remove lessons and games.</p>
            <Link href="/admin/content" className="btn-secondary mt-4 inline-block">Go</Link>
          </div>
          <div className="card p-6 text-center">
            <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">Analytics</div>
            <p className="text-gray-500">View platform usage and performance stats.</p>
            <Link href="/admin/analytics" className="btn-outline mt-4 inline-block">Go</Link>
          </div>
          <div className="card p-6 text-center">
            <Settings className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">Settings</div>
            <p className="text-gray-500">Platform configuration and preferences.</p>
            <Link href="/admin/settings" className="btn-outline mt-4 inline-block">Go</Link>
          </div>
        </div>
      </main>
    </div>
  )
}