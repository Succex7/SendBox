import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { notificationsAPI } from '../../api/notifications.js'
import { filesAPI } from '../../api/files.js'
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
      className="flex items-center w-full gap-2 px-3 py-2 transition-all duration-200 border rounded-lg cursor-pointer bg-surface-container-high/50 border-white/5 hover:bg-surface-container-high group"
    >
      <span className="flex-1 font-mono text-xs font-bold tracking-widest text-left truncate text-primary">{id}</span>
      <span className="text-sm transition-colors duration-200 material-symbols-outlined text-outline group-hover:text-primary">
        {ok ? 'check' : 'content_copy'}
      </span>
    </button>
  )
}

function ProfileDropdown({ user, onLogout, onClose }) {
  const navigate = useNavigate()

  const goTo = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <div className="absolute right-0 z-50 w-64 overflow-hidden border shadow-2xl top-12 glass-modal rounded-xl animate-scale-in border-white/10">
      {/* User info */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-sm font-black text-white rounded-full bg-gradient-to-br from-primary-container to-secondary-container">
            {user?.username?.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-on-surface">{user?.username}</p>
            <p className="text-xs truncate text-outline">{user?.email}</p>
          </div>
        </div>
        <div className="mt-3">
          <CopyId id={user?.uniqueId} />
        </div>
      </div>

      {/* Actions */}
      <div className="p-2">
        <button
          onClick={() => goTo('/dashboard/settings')}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-200 cursor-pointer"
        >
          <span className="text-lg material-symbols-outlined">settings</span>
          Settings
        </button>
        <button
          onClick={() => { onLogout(); onClose() }}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-error hover:bg-red-500 transition-all duration-200 cursor-pointer mt-1"
        >
          <span className="text-lg material-symbols-outlined">logout</span>
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
  const desktopProfileRef = useRef(null)
  const mobileProfileRef = useRef(null)

  useEffect(() => {
    notificationsAPI.getAll()
      .then(r => setUnread(r.data.data.filter(n => !n.isRead).length))
      .catch(() => {})
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
  const handler = e => {
    const clickedDesktop = desktopProfileRef.current && !desktopProfileRef.current.contains(e.target)
    const clickedMobile = mobileProfileRef.current && !mobileProfileRef.current.contains(e.target)
    if (clickedDesktop && clickedMobile) {
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
      <aside className="fixed top-0 left-0 z-40 flex-col hidden w-64 h-full px-4 py-6 md:flex sidebar-glass">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-xl shrink-0">
            <span className="text-xl material-symbols-outlined text-on-primary">send</span>
          </div>
          <div>
            <h2 className="text-lg font-black leading-none tracking-tighter text-white">SendBox</h2>
            <p className="text-xs text-outline mt-0.5">File Transfer</p>
          </div>
        </div>

        {/* User card */}
        <div className="px-2 mb-6">
          <div className="bg-surface-container-high/40 border border-white/5 rounded-DEFAULT p-3 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 text-sm font-black text-white rounded-full bg-linear-to-br from-primary-container to-secondary-container shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-on-surface">{user?.username}</p>
                <p className="text-xs truncate text-outline">{user?.email}</p>
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
              <span className="text-xl material-symbols-outlined">{icon}</span>
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
            <span className="text-xl material-symbols-outlined">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="flex flex-col min-h-screen md:ml-64">

        {/* Desktop topbar */}
        <header className="fixed top-0 right-0 z-30 items-center justify-between hidden h-16 px-8 md:flex left-64 header-glass">
          {/* Functional search */}
          <SearchBar />

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <NavLink
              to="/dashboard/notifications"
              className="relative p-2 transition-all duration-200 rounded-full cursor-pointer text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />}
            </NavLink>

            {/* Profile avatar — clickable */}
            <div className="relative" ref={desktopProfileRef}>
              <button
                onClick={() => setShowProfile(v => !v)}
                className="flex items-center justify-center text-xs font-black text-white transition-all duration-200 rounded-full cursor-pointer w-9 h-9 bg-linear-to-br from-primary-container to-secondary-container hover:ring-2 hover:ring-primary/40 active:scale-95"
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
        <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between h-16 px-5 md:hidden header-glass">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-xl">
              <span className="text-lg material-symbols-outlined text-on-primary">send</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-white">SendBox</span>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/dashboard/notifications" className="relative p-2 cursor-pointer text-on-surface-variant">
              <span className="material-symbols-outlined">notifications</span>
              {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />}
            </NavLink>
            <div className="relative" ref={mobileProfileRef}>
              <button
                onClick={() => setShowProfile(v => !v)}
                className="flex items-center justify-center text-xs font-black text-white transition-all duration-200 rounded-full cursor-pointer w-9 h-9 bg-linear-to-br from-primary-container to-secondary-container hover:ring-2 hover:ring-primary/40"
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
        <main className="flex-1 px-4 pt-16 pb-24 md:pt-24 md:pb-10 md:px-8">
          <div className="mx-auto max-w-300 page-enter">
            <Outlet />
          </div>
        </main>

        {/* ── Mobile Bottom Nav ──────────────────────────── */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t md:hidden sidebar-glass border-white/6 pb-safe">
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
                    {/* Active top bar indicator */}
                    {isActive && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-[#adc6ff] rounded-full" />
                    )}
                    <span className={`material-symbols-outlined text-xl transition-all duration-200 ${isActive ? 'text-[#adc6ff]' : ''}`}>
                      {icon}
                    </span>
                    <span className={`text-[10px] transition-all duration-200 ${isActive ? 'font-bold text-[#adc6ff]' : 'font-medium'}`}>
                      {label}
                    </span>
                    {icon === 'notifications' && unread > 0 && (
                      <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full" />
                    )}
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
  const [results, setResults] = useState({ pages: [], files: [] })
  const [open, setOpen] = useState(false)
  const [fileData, setFileData] = useState([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  const pages = [
    { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { label: 'Connections', path: '/dashboard/connections', icon: 'group' },
    { label: 'Files', path: '/dashboard/files', icon: 'folder_open' },
    { label: 'Notifications', path: '/dashboard/notifications', icon: 'notifications' },
    { label: 'Settings', path: '/dashboard/settings', icon: 'settings' },
    { label: 'Send a File', path: '/dashboard/connections', icon: 'send' },
    { label: 'Add Connection', path: '/dashboard/connections', icon: 'person_add' },
  ]

  // Load file history once on mount for search
    useEffect(() => {
      setLoadingFiles(true)
      filesAPI.getHistory()
        .then(r => setFileData(r.data.data))
        .catch(() => {})
        .finally(() => setLoadingFiles(false))
    }, [])

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
    if (q.trim().length >= 2) {
      const ql = q.toLowerCase()
      const matchedPages = pages.filter(p => p.label.toLowerCase().includes(ql))
      const matchedFiles = fileData.filter(f =>
        f.fileName?.toLowerCase().includes(ql) ||
        f.sender?.username?.toLowerCase().includes(ql) ||
        f.recipient?.username?.toLowerCase().includes(ql)
      ).slice(0, 5)
      setResults({ pages: matchedPages, files: matchedFiles })
      setOpen(true)
    } else {
      setResults({ pages: [], files: [] })
      setOpen(false)
    }
  }

  const go = path => {
    navigate(path)
    setQuery('')
    setOpen(false)
  }

  const fmt = b => {
    if (!b) return ''
    if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`
    return `${(b / 1048576).toFixed(1)} MB`
  }

  const hasResults = results.pages.length > 0 || results.files.length > 0

  return (
    <div className="relative w-80" ref={ref}>
      <div className="flex items-center gap-2 px-4 py-2 border rounded-full bg-white/5 border-white/10">
        <span className="text-lg material-symbols-outlined text-outline">search</span>
        <input
          value={query}
          onChange={onChange}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Search files, transfers..."
          className="w-full text-sm bg-transparent border-none outline-none text-on-surface placeholder:text-outline"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false) }} className="cursor-pointer text-outline hover:text-on-surface">
            <span className="text-sm material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 z-50 overflow-hidden overflow-y-auto border shadow-2xl top-12 glass-modal rounded-xl animate-scale-in border-white/10 max-h-80">

          {/* Files section */}
          {results.files.length > 0 && (
            <>
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-xs font-semibold tracking-wider uppercase text-outline">Files</p>
              </div>
              {results.files.map(f => (
                <button
                  key={f._id}
                  onClick={() => go('/dashboard/files')}
                  className="flex items-center w-full gap-3 px-4 py-3 text-sm transition-all duration-150 border-b cursor-pointer text-on-surface-variant hover:bg-white/5 hover:text-on-surface border-white/3"
                >
                  <span className="text-lg material-symbols-outlined text-primary">insert_drive_file</span>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-medium truncate text-on-surface">{f.fileName}</p>
                    <p className="text-[10px] text-outline">
                      {fmt(f.fileSize)} • {f.sender?.username}
                    </p>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Pages section */}
          {results.pages.length > 0 && (
            <>
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-xs font-semibold tracking-wider uppercase text-outline">Navigation</p>
              </div>
              {results.pages.map(r => (
                <button
                  key={r.path + r.label}
                  onClick={() => go(r.path)}
                  className="flex items-center w-full gap-3 px-4 py-3 text-sm transition-all duration-150 cursor-pointer text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                >
                  <span className="text-lg material-symbols-outlined text-primary">{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </>
          )}

          {/* No results */}
          {!hasResults && (
            <div className="p-4">
              <p className="text-sm text-center text-outline">No results for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}