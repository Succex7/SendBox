import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { filesAPI } from '../api/files.js'
import { connectionsAPI } from '../api/connections.js'
import { SkeletonStatCard, SkeletonFileRow } from '../components/ui/Skeleton.jsx'
import { formatDistanceToNow } from 'date-fns'

const fmt = b => {
  if (!b) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`
  if (b < 1073741824) return `${(b/1048576).toFixed(1)} MB`
  return `${(b/1073741824).toFixed(2)} GB`
}

function CopyId({ id }) {
  const [ok, setOk] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(id); setOk(true); setTimeout(() => setOk(false), 2000) }}
      className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 t hover:bg-white/30 active:scale-95">
      <span className="font-mono font-bold tracking-wider text-white">{id}</span>
      <span className="material-symbols-outlined text-sm text-white/80">{ok ? 'check' : 'content_copy'}</span>
    </button>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [conns, setConns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([filesAPI.getHistory(), connectionsAPI.getAll()])
      .then(([fr, cr]) => { setFiles(fr.data.data); setConns(cr.data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const uid = user?._id || user?.id
  // Reliable ID comparison — handles both string and ObjectId forms
    const isSameUser = (fileUser, authUserId) => {
      if (!fileUser || !authUserId) return false
      const fid = fileUser._id?.toString() || fileUser.id?.toString() || fileUser?.toString()
      return fid === authUserId.toString()
    }

    // A file is SENT if current user is the SENDER
    const sent = files.filter(f => isSameUser(f.sender, uid))

    // A file is RECEIVED if current user is the RECIPIENT and NOT the sender
    // (prevents double-counting if same user somehow appears on both sides)
    const recv = files.filter(f =>
      isSameUser(f.recipient, uid) && !isSameUser(f.sender, uid)
    )
  const recent = [...files].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const stats = [
    { label: 'Files Sent', val: sent.length, icon: 'upload_file', col: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Files Received', val: recv.length, icon: 'download_done', col: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Connections', val: conns.length, icon: 'hub', col: 'text-tertiary', bg: 'bg-tertiary/10' },
  ]

  const fileIcon = mime => {
    if (mime?.startsWith('image/')) return { icon: 'image', cls: 'file-image' }
    if (mime?.startsWith('video/')) return { icon: 'movie', cls: 'file-video' }
    if (mime === 'application/pdf') return { icon: 'picture_as_pdf', cls: 'file-pdf' }
    if (mime?.includes('word') || mime?.includes('document')) return { icon: 'description', cls: 'file-doc' }
    if (mime?.includes('zip') || mime?.includes('rar')) return { icon: 'folder_zip', cls: 'file-zip' }
    if (mime?.startsWith('audio/')) return { icon: 'audio_file', cls: 'file-audio' }
    return { icon: 'insert_drive_file', cls: 'file-other' }
  }

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      {/* Welcome card */}
      <div className="welcome-gradient rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-primary-container/20">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute right-16 -bottom-4 w-24 h-24 bg-secondary/30 rounded-full blur-2xl" />
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-1 font-label-sm">Welcome back</p>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-4">
            Good day, {user?.username} 👋
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/70 text-sm font-label-sm">Your ID:</span>
            <CopyId id={user?.uniqueId} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading
          ? [1,2,3].map(i => <SkeletonStatCard key={i} />)
          : stats.map(s => (
            <div key={s.label} className="glass-card p-5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-outline uppercase tracking-widest font-semibold mb-1">{s.label}</p>
                <p className="text-4xl font-black text-on-surface">{s.val}</p>
              </div>
              <div className={`${s.bg} p-4 rounded-xl`}>
                <span className={`material-symbols-outlined ${s.col} text-3xl`}>{s.icon}</span>
              </div>
            </div>
          ))
        }
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/dashboard/connections" className="glass-card p-6 rounded-xl flex items-center justify-between group t hover:border-primary/20 hover:-translate-y-0.5">
          <div>
            <p className="font-bold text-on-surface">Send a File</p>
            <p className="text-sm text-on-surface-variant mt-0.5">Choose a connection to send to</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center t group-hover:bg-primary group-hover:text-on-primary text-primary">
            <span className="material-symbols-outlined">arrow_outward</span>
          </div>
        </Link>
        <Link to="/dashboard/connections" className="glass-card p-6 rounded-xl flex items-center justify-between group t hover:border-secondary/20 hover:-translate-y-0.5">
          <div>
            <p className="font-bold text-on-surface">Add Connection</p>
            <p className="text-sm text-on-surface-variant mt-0.5">Connect via SendBox ID</p>
          </div>
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center t group-hover:bg-secondary group-hover:text-on-secondary text-secondary">
            <span className="material-symbols-outlined">person_add</span>
          </div>
        </Link>
      </div>

      {/* Recent transfers */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-xl">history</span>
            Recent Transfers
          </h2>
          <Link to="/dashboard/files" className="text-xs text-primary font-bold uppercase tracking-widest hover:underline">View All</Link>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3].map(i => <SkeletonFileRow key={i} />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline block mb-3">folder_open</span>
            <p className="font-semibold text-on-surface">No transfers yet</p>
            <p className="text-sm text-on-surface-variant mt-1">Send your first file to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recent.map(f => {
              const isSent = f.sender?._id === uid || f.sender?.id === uid
              const { icon, cls } = fileIcon(f.fileType)
              return (
                <div key={f._id} className="flex items-center gap-4 p-4 t hover:bg-white/3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cls}`}>
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface text-sm truncate">{f.fileName}</p>
                    <p className="text-xs text-on-surface-variant">
                      {isSent ? `To ${f.recipient?.username}` : `From ${f.sender?.username}`} • {fmt(f.fileSize)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-outline hidden sm:block">
                      {formatDistanceToNow(new Date(f.createdAt), { addSuffix: true })}
                    </span>
                    {!isSent && (
                      <a href={f.fileUrl} download target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold t hover:bg-primary hover:text-on-primary active:scale-95">
                        <span className="material-symbols-outlined text-sm">download</span>
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}