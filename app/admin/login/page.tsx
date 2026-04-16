'use client'

import { useState } from 'react'
import { login } from '@/lib/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-serif text-2xl text-[#111] tracking-[-0.01em]">crafyne</span>
          <p className="mt-2 text-sm text-[#888] font-light">CMS Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-black/8 rounded-lg p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#555] mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 text-sm border border-black/12 rounded-md bg-white text-[#111] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#7A9E89]/40 focus:border-[#7A9E89] transition"
                placeholder="nama@crafyne.co"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#555] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2.5 text-sm border border-black/12 rounded-md bg-white text-[#111] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#7A9E89]/40 focus:border-[#7A9E89] transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111] text-[#F5F4F0] py-2.5 rounded-md text-sm font-medium tracking-wide hover:opacity-80 disabled:opacity-50 transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-[#aaa] font-light">
          Access restricted to Crafyne admins
        </p>
      </div>
    </div>
  )
}
