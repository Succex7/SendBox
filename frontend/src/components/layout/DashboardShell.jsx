import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { notificationsAPI } from '../../api/notifications.js'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/dashboard',               icon: 'grid_view',     label: 'Home',    end: true },
  { to: '/dashboard/connections',   icon: 'group',         label: 'Connect'  },
  { to: '/dashboard/files',         icon: 'folder_open',   label: 'Files'    },
  { to: '/dashboard/notifications', icon: 'notifications', label: 'Alerts'   },
  { to: '/dashboard/settings',      icon: 'settings',      label: 'Settings' },
]

function CopyId({ id }) {
  const [ok, setOk] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(id || '')
    setOk(true)
    toast.success('ID copied!')
    setTimeout(() => setOk(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 w-full bg-surface-container-high/50 border border-white/5 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-surface-container-high cursor-pointer group"
    >
      <span className="font-mono text-xs font-bold text-primary tracking-widest flex-1 text-left truncate">{id}</span>
      <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors duration-200">
        {ok ? 'check' : 'content_copy'}
      </span>
    </button>
  )
}

function ProfileDropdown({ user, onLogout, onClose }) {
  const navigate = useNavigate()
  // Remove stopPropagation, just call actions directly
  const handleSettings = () => {
    navigate('/dashboard/settings')
    if (onClose) onClose()
  }
  const handleLogout = () => {
    if (onLogout) onLogout()
    if (onClose) onClose()
  }
  return (
    <div className="absolute top-12 right-0 w-64 glass-modal rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in border border-white/10">
      {/* User info */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-black text-sm shrink-0">
            {user?.username?.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-on-surface text-sm truncate">{user?.username}</p>
            <p className="text-xs text-outline truncate">{user?.email}</p>
          </div>
        </div>
        <div className="mt-3">
          <CopyId id={user?.uniqueId} />
        </div>
      </div>
      {/* Actions */}
      <div className="p-2">
        <button
          onClick={handleSettings}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-error hover:bg-red-500 transition-all duration-200 cursor-pointer mt-1"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Log Out
        </button>
      </div>
    </div>
  )
}

export default function DashboardShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    notificationsAPI.getAll()
      .then(r => setUnread(r.data.data.filter(n => !n.isRead).length))
      .catch(() => {})
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const doLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'SB'

  return (
    <div className="min-h-screen bg-background text-on-background">

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 z-40 sidebar-glass flex-col py-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-xl">send</span>
          </div>
          <div>
            <h2 className="text-white font-black text-lg tracking-tighter leading-none">SendBox</h2>
            <p className="text-xs text-outline mt-0.5">File Transfer</p>
          </div>
        </div>

        {/* User card */}
        <div className="px-2 mb-6">
          <div className="bg-surface-container-high/40 border border-white/5 rounded-DEFAULT p-3 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-black text-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-on-surface text-sm truncate">{user?.username}</p>
                <p className="text-xs text-outline truncate">{user?.email}</p>
              </div>
            </div>
            <CopyId id={user?.uniqueId} />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5">
          {NAV.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'nav-active'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface active:scale-[0.98]'
                }`
              }
            >
              <span className="material-symbols-outlined text-xl">{icon}</span>
              <span>{label}</span>
              {icon === 'notifications' && unread > 0 && (
                <span className="ml-auto bg-primary text-on-primary text-xs font-black px-2 py-0.5 rounded-full">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-white/5">
          <button
            onClick={doLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-error hover:text-red-500 transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="md:ml-64 flex flex-col min-h-screen">

        {/* Desktop topbar */}
        <header className="hidden md:flex fixed top-0 left-64 right-0 h-16 z-30 header-glass items-center justify-between px-8">
          {/* Functional search */}
          <SearchBar />

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <NavLink
              to="/dashboard/notifications"
              className="relative p-2 text-on-surface-variant hover:bg-white/5 hover:text-on-surface rounded-full transition-all duration-200 cursor-pointer"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />}
            </NavLink>

            {/* Profile avatar — clickable */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(v => !v)}
                className="w-9 h-9 rounded-full bg-linear-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-black text-xs cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all duration-200 active:scale-95"
                title={user?.username}
              >
                {initials}
              </button>
              {showProfile && (
                <ProfileDropdown user={user} onLogout={doLogout} onClose={() => setShowProfile(false)} />
              )}
            </div>
          </div>
        </header>

        {/* Mobile topbar */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 z-30 header-glass flex items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-lg">send</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-white">SendBox</span>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/dashboard/notifications" className="relative p-2 text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />}
            </NavLink>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(v => !v)}
                className="w-9 h-9 rounded-full bg-linear-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-black text-xs cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all duration-200"
              >
                {initials}
              </button>
              {showProfile && (
                <ProfileDropdown user={user} onLogout={doLogout} onClose={() => setShowProfile(false)} />
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pt-16 pb-24 md:pt-24 md:pb-10 px-4 md:px-8">
          <div className="max-w-300 mx-auto page-enter">
            <Outlet />
          </div>
        </main>

        {/* ── Mobile Bottom Nav ──────────────────────────── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 sidebar-glass border-t border-white/6 pb-safe">
          <div className="flex items-center justify-around h-16 px-2">
            {NAV.map(({ to, icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 relative cursor-pointer ${
                    isActive ? 'text-primary' : 'text-on-surface-variant'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`material-symbols-outlined text-xl ${isActive ? 'text-primary' : ''}`}>{icon}</span>
                    <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
                    {icon === 'notifications' && unread > 0 && (
                      <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full" />
                    )}
                    {isActive && <span className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

// ── Functional Search Bar ──────────────────────────────────
function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  const pages = [
    { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { label: 'Connections', path: '/dashboard/connections', icon: 'group' },
    { label: 'Files', path: '/dashboard/files', icon: 'folder_open' },
    { label: 'Notifications', path: '/dashboard/notifications', icon: 'notifications' },
    { label: 'Settings', path: '/dashboard/settings', icon: 'settings' },
    { label: 'Send a File', path: '/dashboard/connections', icon: 'send' },
    { label: 'View Transfer History', path: '/dashboard/files', icon: 'history' },
    { label: 'Add Connection', path: '/dashboard/connections', icon: 'person_add' },
  ]

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const onChange = e => {
    const q = e.target.value
    setQuery(q)
    if (q.trim().length > 0) {
      setResults(pages.filter(p => p.label.toLowerCase().includes(q.toLowerCase())))
      setOpen(true)
    } else {
      setResults([])
      setOpen(false)
    }
  }

  const go = path => {
    navigate(path)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative w-80" ref={ref}>
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
        <span className="material-symbols-outlined text-outline text-lg">search</span>
        <input
          value={query}
          onChange={onChange}
          onFocus={() => query && setOpen(true)}
          placeholder="Search files, transfers..."
          className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline w-full"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false) }} className="text-outline hover:text-on-surface cursor-pointer">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-12 left-0 right-0 glass-modal rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in border border-white/10">
          {results.map(r => (
            <button
              key={r.path + r.label}
              onClick={() => go(r.path)}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-150 cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-lg">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>
      )}

      {open && query && results.length === 0 && (
        <div className="absolute top-12 left-0 right-0 glass-modal rounded-xl shadow-2xl z-50 p-4 border border-white/10 animate-scale-in">
          <p className="text-sm text-outline text-center">No results for "{query}"</p>
        </div>
      )}
    </div>
  )
}