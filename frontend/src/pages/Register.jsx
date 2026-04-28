import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../api/auth.js'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [registered, setRegistered] = useState(null)
  const [copied, setCopied] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const submit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setLoading(true)
    try {
      const r = await authAPI.register({ username: form.username, email: form.email, password: form.password })
      const { token, user } = r.data.data
      login(token, user)
      setRegistered(user)
      toast.success('Account created!')
    } catch (err) {
      const m = err.response?.data?.message || 'Registration failed'
      toast.error(m)
      if (m.toLowerCase().includes('email')) setErrors({ email: m })
    } finally { setLoading(false) }
  }

  const copyId = () => {
    navigator.clipboard.writeText(registered?.uniqueId || '')
    setCopied(true)
    toast.success('ID copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Success state ──────────────────────────────────────────
  if (registered) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-modal rounded-2xl p-8 text-center animate-scale-in">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-secondary text-5xl">verified_user</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-on-surface mb-2">Welcome to SendBox! 🎉</h2>
          <p className="text-on-surface-variant mb-8">Your account is ready. Here's your unique SendBox ID:</p>

          <div className="bg-surface-container-highest/60 border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3 font-semibold">Your Personal ID</p>
            <p className="font-mono text-4xl font-black text-primary tracking-widest mb-4">{registered.uniqueId}</p>
            <button
              onClick={copyId}
              className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-semibold text-primary cursor-pointer transition-all duration-200 hover:bg-primary/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
              {copied ? 'Copied!' : 'Copy ID'}
            </button>
          </div>

          <p className="text-xs text-on-surface-variant bg-secondary/10 border border-secondary/20 rounded-xl p-3 mb-6">
            💡 Share this ID with people you want to connect with.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-primary text-on-primary rounded-full font-black cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen mesh-bg flex flex-col md:flex-row">
      {/* Left */}
      <div className="hidden md:flex md:w-1/2 mesh-gradient relative items-center justify-center p-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-container/20 rounded-full blur-[100px]" />
        <div className="relative z-10 glass-card p-10 rounded-2xl max-w-md w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">send</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">SendBox</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-4 leading-tight">Create Account</h1>
          <p className="text-on-surface-variant text-body-lg">
            Join the file transfer ecosystem. Get your unique ID and start sharing instantly.
          </p>
          <div className="mt-8 space-y-3">
            {['No size limits', 'Any file type', 'Persistent connections', 'Full transfer history'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full md:w-1/2 bg-surface-container-lowest flex flex-col">
        <div className="md:hidden p-6 header-glass border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-lg">send</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">SendBox</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tighter text-on-background">Create Account</h2>
              <p className="text-on-surface-variant mt-1">Join the elite file sharing ecosystem.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors duration-200 text-xl">person</span>
                  <input type="text" value={form.username} onChange={set('username')} placeholder="Your name" className="glass-input pl-12 pr-4 py-4 rounded-t-lg cursor-text" />
                </div>
                {errors.username && <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">warning</span>{errors.username}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors duration-200 text-xl">mail</span>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="name@company.com" className="glass-input pl-12 pr-4 py-4 rounded-t-lg cursor-text" />
                </div>
                {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">warning</span>{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors duration-200 text-xl">lock</span>
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 6 characters" className="glass-input pl-12 pr-12 py-4 rounded-t-lg cursor-text" />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer transition-colors duration-200">
                    <span className="material-symbols-outlined text-xl">{showPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">warning</span>{errors.password}</p>}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Confirm Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors duration-200 text-xl">verified</span>
                  <input type={showPw ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" className="glass-input pl-12 pr-4 py-4 rounded-t-lg cursor-text" />
                </div>
                {errors.confirm && <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">warning</span>{errors.confirm}</p>}
              </div>

              {/* Create Account — real button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-[#16274e] hover:bg-[#16274e]/70 text-on-primary rounded-full font-black text-base cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Creating...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-on-surface-variant mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline cursor-pointer inline-flex items-center gap-1 transition-colors duration-200">
                Sign in 
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}