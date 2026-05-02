import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

export default function Settings() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState(user?.username || '')
  const [savingUsername, setSavingUsername] = useState(false)

  const copyId = () => {
    navigator.clipboard.writeText(user?.uniqueId || '')
    setCopied(true)
    toast.success('ID copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const doLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out')
  }

  const saveUsername = async () => {
    if (!newUsername.trim() || newUsername.trim() === user?.username) {
      setEditingUsername(false)
      return
    }
    setSavingUsername(true)
    setTimeout(() => {
      updateUser({ ...user, username: newUsername.trim() })
      toast.success('Username updated!')
      setEditingUsername(false)
      setSavingUsername(false)
    }, 600)
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'SB'

  return (
    <div className="py-4">
      <motion.div
        className="max-w-2xl mx-auto space-y-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Page title */}
        <motion.div variants={fadeUp}>
          <h1 className="text-3xl font-black tracking-tighter text-on-background">Settings</h1>
          <p className="text-on-surface-variant mt-1">Manage your account preferences.</p>
        </motion.div>

        {/* Profile */}
        <motion.div variants={fadeUp} className="glass-card rounded-xl p-6 space-y-5">
          <h2 className="font-bold text-on-surface text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Profile
          </h2>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-black text-xl flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-bold text-on-surface text-lg">{user?.username}</p>
              <p className="text-sm text-on-surface-variant">{user?.email}</p>
            </div>
          </div>

          {/* SendBox ID */}
          <div className="border-t border-white/5 pt-4">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Your SendBox ID
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-surface-container-high border border-white/5 rounded-xl px-4 py-3">
                <span className="font-mono font-bold text-primary tracking-widest text-lg">{user?.uniqueId}</span>
              </div>
              <button
                onClick={copyId}
                className="flex items-center gap-2 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-primary font-semibold text-sm cursor-pointer transition-all duration-200 hover:bg-primary hover:text-on-primary active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Share this ID with people you want to connect with.
            </p>
          </div>
        </motion.div>

        {/* Account info */}
        <motion.div variants={fadeUp} className="glass-card rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-on-surface text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">account_circle</span>
            Account Information
          </h2>

          {/* Username — editable */}
          <div className="flex items-center gap-3 p-3 bg-surface-container-high/50 rounded-xl border border-white/5">
            <span className="material-symbols-outlined text-outline">person</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-on-surface-variant">Username</p>
              {editingUsername ? (
                <input
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveUsername(); if (e.key === 'Escape') setEditingUsername(false) }}
                  className="bg-transparent border-b border-primary outline-none text-sm font-semibold text-on-surface w-full mt-0.5"
                  autoFocus
                />
              ) : (
                <p className="text-sm font-semibold text-on-surface">{user?.username}</p>
              )}
            </div>
            {editingUsername ? (
              <div className="flex gap-2">
                <button
                  onClick={saveUsername}
                  disabled={savingUsername}
                  className="p-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary hover:text-on-secondary cursor-pointer transition-all duration-200 active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">{savingUsername ? 'progress_activity' : 'check'}</span>
                </button>
                <button
                  onClick={() => { setEditingUsername(false); setNewUsername(user?.username) }}
                  className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-200 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingUsername(true)}
                className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-200 text-outline hover:text-primary"
                title="Edit username"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            )}
          </div>

          {/* Email — read only */}
          <div className="flex items-center gap-3 p-3 bg-surface-container-high/50 rounded-xl border border-white/5">
            <span className="material-symbols-outlined text-outline">mail</span>
            <div className="flex-1">
              <p className="text-xs text-on-surface-variant">Email Address</p>
              <p className="text-sm font-semibold text-on-surface">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div variants={fadeUp} className="glass-card rounded-xl p-6 space-y-3">
          <h2 className="font-bold text-on-surface text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">info</span>
            About SendBox
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            SendBox is a peer-to-peer file transfer platform. Connect with people using unique IDs and share files of any type in full quality — no compression, no size limits.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[{ label: 'Version', value: '1.0.0' }, { label: 'Plan', value: 'Free' }].map(item => (
              <div key={item.label} className="bg-surface-container-high/50 rounded-xl p-3 border border-white/5">
                <p className="text-xs text-on-surface-variant">{item.label}</p>
                <p className="font-semibold text-on-surface text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          variants={fadeUp}
          className="rounded-xl p-6 border-2 border-red-500/40 bg-red-500/5"
        >
          <h2 className="font-bold text-red-400 mb-1 flex items-center gap-2 text-lg">
            <span className="material-symbols-outlined text-red-400">warning</span>
            Danger Zone
          </h2>
          <p className="text-sm text-red-300/70 mb-4">
            Logging out will end your current session. You'll need to sign in again to access your account.
          </p>
          <button
            onClick={doLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-700 text-white border border-red-500 rounded-full text-sm font-black cursor-pointer transition-all duration-200 hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Log Out of SendBox
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}