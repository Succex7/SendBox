import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { authAPI } from '../api/auth.js'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setErrors({ general: 'Please fill in all fields' })
      return
    }
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      const { token, user } = res.data.data
      login(token, user)
      toast.success(`Welcome back, ${user.username}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="10" width="24" height="18" rx="3" fill="#0EA5E9"/>
            <path d="M4 16h24" stroke="#0284C7" strokeWidth="1.5"/>
            <path d="M16 2v12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M11 9l5 5 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-[#0F172A] text-xl">SendBox</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E0F2FE] shadow-xl p-8">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Welcome back</h1>
          <p className="text-sm text-[#64748B] mb-6">Sign in to your SendBox account</p>

          {errors.general && (
            <div className="p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl text-sm text-[#F43F5E] mb-4">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              rightElement={
                <button type="button" onClick={() => setShowPassword(v => !v)} className="text-[#94A3B8] hover:text-[#64748B]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-[#0EA5E9] hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0EA5E9] font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}