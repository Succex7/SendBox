import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../api/auth.js'
import toast from 'react-hot-toast'

const STEPS = ['Email', 'Verify OTP', 'New Password']

export default function ForgotPassword() {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [pw, setPw] = useState({ new: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [done, setDone] = useState(false)
  const [otpError, setOtpError] = useState('')
  const refs = useRef([])

  const onOtp = (i, v) => {
    if (!/^\d?$/.test(v)) return
    const n = [...otp]; n[i] = v; setOtp(n)
    setOtpError('')
    if (v && i < 5) refs.current[i + 1]?.focus()
  }

  const onOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const onOtpPaste = e => {
    const s = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (s.length === 6) { setOtp(s.split('')); refs.current[5]?.focus() }
  }

  const step1 = async e => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
    } catch {}
    finally {
      // Always show same message (security — don't reveal if email exists)
      toast.success('If that email exists, a code has been sent.')
      setStep(1)
      setLoading(false)
    }
  }

  // Verify OTP 
  const verifyOtp = async () => {
  const otpString = otp.join('')
  if (otpString.length !== 6) return
  setVerifying(true)
  setOtpError('')
  try {
    await authAPI.verifyOtp({ email, otp: otpString })
    // Only advance if backend confirms OTP is valid
    setStep(2)
    toast.success('Code verified!')
  } catch (err) {
    const msg = err.response?.data?.message || 'Invalid reset code'
    setOtpError(msg)
    toast.error(msg)
    // If too many attempts, go back to email step
    if (err.response?.status === 429) {
      setStep(0)
      setOtp(['', '', '', '', '', ''])
    }
  } finally {
    setVerifying(false)
  }
}

const step3 = async e => {
  e.preventDefault()
  if (pw.new !== pw.confirm) { toast.error('Passwords do not match'); return }
  if (pw.new.length < 6) { toast.error('Password must be at least 6 characters'); return }
  setLoading(true)
  try {
    await authAPI.resetPassword({ email, otp: otp.join(''), newPassword: pw.new })
    setDone(true)
    toast.success('Password reset successfully!')
  } catch (err) {
    const msg = err.response?.data?.message || 'Reset failed'
    toast.error(msg)
    // If OTP was wrong or expired, send back to OTP step
    if (
      msg.toLowerCase().includes('code') ||
      msg.toLowerCase().includes('otp') ||
      msg.toLowerCase().includes('expired') ||
      msg.toLowerCase().includes('invalid')
    ) {
      setStep(1)
      setOtp(['', '', '', '', '', ''])
      setOtpError(msg)
    }
  } finally {
    setLoading(false)
  }
}

  if (done) return (
    <div className="flex items-center justify-center min-h-screen p-6 mesh-bg">
      <div className="w-full max-w-md p-8 text-center glass-modal rounded-2xl animate-scale-in">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10">
          <span className="text-4xl text-green-500 material-symbols-outlined">check_circle</span>
        </div>
        <h2 className="mb-2 text-2xl font-black text-on-surface">Password Reset!</h2>
        <p className="mb-6 text-on-surface-variant">Your password has been updated. You can now sign in.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#16274e] hover:bg-[#16274e]/70 text-on-primary rounded-full font-black cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97]"
        >
          Go to Sign In
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="flex items-center justify-center min-h-screen p-6 mesh-bg">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="/icons/icon-192x192.png" alt="SendBox" className="w-10 h-10 rounded-xl object-cover" />
          <span className="text-2xl font-black tracking-tighter text-white">SendBox</span>
        </div>

        <div className="glass-modal rounded-2xl p-7">
          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-7">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 gap-2 last:flex-none">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all duration-300 ${
                  step > i ? 'bg-secondary text-on-secondary' : step === i ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-outline'
                }`}>
                  {step > i ? <span className="text-sm material-symbols-outlined">check</span> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block transition-colors duration-200 ${step === i ? 'text-on-surface' : 'text-outline'}`}>{s}</span>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px transition-all duration-300 ${step > i ? 'bg-secondary' : 'bg-outline-variant'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 0: Email */}
          {step === 0 && (
            <div className="animate-fade-in">
              <h1 className="mb-1 text-2xl font-black text-on-surface">Forgot Password?</h1>
              <p className="mb-6 text-sm text-on-surface-variant">Enter your email and we'll send you a 6-digit reset code.</p>
              <form onSubmit={step1} className="space-y-4">
                <div className="relative group">
                  <span className="absolute transition-colors duration-200 -translate-y-1/2 material-symbols-outlined left-4 top-1/2 text-outline group-focus-within:text-primary">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="py-4 pl-12 pr-4 rounded-t-lg glass-input cursor-text"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3.5 bg-[#16274e] hover:bg-[#16274e]/70 text-on-primary rounded-full font-black cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin">progress_activity</span> Sending...</>
                  ) : 'Send Reset Code'}
                </button>
              </form>
            </div>
          )}

          {/* Step 1: OTP */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="mb-1 text-2xl font-black text-on-surface">Enter Reset Code</h1>
              <p className="mb-2 text-sm text-on-surface-variant">Check your email for the 6-digit code.</p>
              <p className="mb-6 font-mono text-xs text-primary">⏱ Code expires in 10 minutes</p>

              {otpError && (
                <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-500 border bg-error-container/20 border-error/20 rounded-xl animate-scale-in">
                  <span className="text-lg material-symbols-outlined">error</span>
                  {otpError}
                </div>
              )}

              <div className="flex gap-2 mb-6" onPaste={onOtpPaste}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => refs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => onOtp(i, e.target.value)}
                    onKeyDown={e => onOtpKey(i, e)}
                    className={`otp-input w-full aspect-square text-center text-2xl font-black rounded-xl cursor-text ${
                      otpError ? 'border-error' : ''
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={otp.join('').length !== 6 || verifying}
                className="w-full py-3.5 bg-[#16274e] hover:bg-[#16274e]/70 text-on-primary rounded-full font-black cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <><span className="material-symbols-outlined animate-spin">progress_activity</span> Verifying...</>
                ) : 'Verify Code'}
              </button>

              <button
                onClick={() => { setStep(0); setOtp(['', '', '', '', '', '']); setOtpError('') }}
                className="flex items-center justify-center w-full gap-1 mt-3 text-sm transition-colors duration-200 cursor-pointer text-on-surface-variant hover:text-on-surface"
              >
                <span className="text-sm material-symbols-outlined">arrow_back</span> Use different email
              </button>
            </div>
          )}

          {/* Step 2: New password */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h1 className="mb-1 text-2xl font-black text-on-surface">New Password</h1>
              <p className="mb-6 text-sm text-on-surface-variant">Choose a strong new password.</p>
              <form onSubmit={step3} className="space-y-4">
                {[
                  { id: 'new', label: 'New Password', placeholder: 'Min. 6 characters' },
                  { id: 'confirm', label: 'Confirm Password', placeholder: 'Repeat password' },
                ].map(f => (
                  <div key={f.id} className="relative group">
                    <span className="absolute transition-colors duration-200 -translate-y-1/2 material-symbols-outlined left-4 top-1/2 text-outline group-focus-within:text-primary">lock</span>
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={pw[f.id]}
                      onChange={e => setPw(p => ({ ...p, [f.id]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="py-4 pl-12 pr-12 rounded-t-lg glass-input cursor-text"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute transition-colors duration-200 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-outline hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined">{showPw ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#16274e] hover:bg-[#16274e]/70 text-on-primary rounded-full font-black cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin">progress_activity</span> Resetting...</>
                  ) : 'Reset Password'}
                </button>
              </form>
            </div>
          )}

          <p className="mt-5 text-sm text-center text-on-surface-variant">
            Remember it?{' '}
            <Link to="/login" className="font-semibold transition-colors duration-200 cursor-pointer text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}