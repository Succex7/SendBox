import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../api/auth.js'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) { setErr('Please fill in all fields'); return }
    setLoading(true); setErr('')
    try {
      const r = await authAPI.login(form)
      const { token, user } = r.data.data
      login(token, user)
      toast.success(`Welcome back, ${user.username}!`)
      navigate('/dashboard')
    } catch (e) {
      const m = e.response?.data?.message || 'Login failed'
      setErr(m)
      toast.error(m)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col md:flex-row">
      {/* Left panel — desktop */}
      <div className="hidden md:flex md:w-1/2 mesh-gradient relative items-center justify-center p-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-container/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-container/10 rounded-full blur-[120px]" />
        <div className="relative z-10 glass-card p-10 rounded-2xl max-w-md w-full">
          <div className="flex items-center gap-3 mb-8">
            <img src="/icons/icon-192x192.png" alt="SendBox" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-2xl font-black tracking-tighter text-white">SendBox</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-4 leading-tight">
            Send Files.<br />
            <span className="gradient-text">No Limits.</span><br />
            No Compromise.
          </h1>
          <p className="text-on-surface-variant text-body-lg leading-relaxed">
            The professional standard for peer-to-peer file transfers. Precision-engineered for modern workflows.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="h-0.5 w-16 bg-linear-to-r from-secondary to-primary rounded-full" />
            <span className="font-mono text-xs tracking-widest text-outline uppercase">Secure Link</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full md:w-1/2 bg-surface-container-lowest flex flex-col">
        {/* Mobile logo */}
        <div className="md:hidden p-6 header-glass border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <img src="/icons/icon-192x192.png" alt="SendBox" className="w-8 h-8 rounded-xl object-cover" />
            <span className="text-xl font-black tracking-tighter text-white">SendBox</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tighter text-on-background">Welcome Back</h2>
              <p className="text-on-surface-variant mt-1">Log in to manage your transfers.</p>
            </div>

            {err && (
              <div className="mb-5 p-3 bg-error-container/20 border border-error/20 rounded-xl flex items-center gap-2 text-sm text-red-500 animate-scale-in">
                <span className="material-symbols-outlined text-lg">error</span>
                {err}
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors duration-200 text-xl">
                    mail
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="name@company.com"
                    className="glass-input pl-12 pr-4 py-4 rounded-t-lg cursor-text"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline cursor-pointer transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors duration-200 text-xl">
                    lock
                  </span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="••••••••"
                    className="glass-input pl-12 pr-12 py-4 rounded-t-lg cursor-text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-xl">{showPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Sign In — real button shape */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-[#16274e] hover:bg-[#16274e]/70 text-on-primary rounded-full font-black text-base cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-on-surface-variant mt-6">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline cursor-pointer inline-flex items-center gap-1 transition-colors duration-200"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <footer className="p-6 text-center">
          <p className="text-xs text-outline">© 2026 SendBox. Engineered for precision.</p>
        </footer>
      </div>
    </div>
  )
}