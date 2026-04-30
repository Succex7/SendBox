import { useState, useEffect } from 'react'
import { filesAPI } from '../api/files.js'
import { useAuth } from '../context/AuthContext.jsx'
import { SkeletonFileRow } from '../components/ui/Skeleton.jsx'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const fmt = b => {
  if (!b) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  if (b < 1073741824) return `${(b / 1048576).toFixed(1)} MB`
  return `${(b / 1073741824).toFixed(2)} GB`
}

const fileIcon = mime => {
  if (mime?.startsWith('image/')) return { i: 'image', c: 'file-image' }
  if (mime?.startsWith('video/')) return { i: 'movie', c: 'file-video' }
  if (mime === 'application/pdf') return { i: 'picture_as_pdf', c: 'file-pdf' }
  if (mime?.includes('word') || mime?.includes('document')) return { i: 'description', c: 'file-doc' }
  if (mime?.includes('zip') || mime?.includes('rar')) return { i: 'folder_zip', c: 'file-zip' }
  if (mime?.startsWith('audio/')) return { i: 'audio_file', c: 'file-audio' }
  return { i: 'insert_drive_file', c: 'file-other' }
}

// Compare user IDs reliably — handles both string and ObjectId forms
const isSameUser = (fileUser, authUserId) => {
  if (!fileUser || !authUserId) return false
  const fid = fileUser._id?.toString() || fileUser.id?.toString() || fileUser?.toString()
  return fid === authUserId.toString()
}

export default function Files() {
  const { user } = useAuth()
  const [tab, setTab] = useState('received')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [delTarget, setDelTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const uid = user?._id || user?.id

  useEffect(() => {
    filesAPI.getHistory()
      .then(r => setFiles(r.data.data))
      .catch(() => toast.error('Failed to load files'))
      .finally(() => setLoading(false))
  }, [])

  // A file is RECEIVED if the current user is the RECIPIENT and NOT the sender
  const received = files.filter(f =>
    isSameUser(f.recipient, uid) && !isSameUser(f.sender, uid)
  )

  // A file is SENT if the current user is the SENDER
  const sent = files.filter(f => isSameUser(f.sender, uid))

  const list = (tab === 'received' ? received : sent).filter(f =>
    f.fileName?.toLowerCase().includes(search.toLowerCase())
  )

  const doDelete = async () => {
    if (!delTarget) return
    setDeleting(true)
    try {
      await filesAPI.deleteFile(delTarget._id)
      setFiles(p => p.filter(f => f._id !== delTarget._id))
      toast.success('File deleted')
      setDelTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="py-4 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-on-background">Files</h1>
        <p className="mt-1 text-on-surface-variant">All your sent and received file transfers.</p>
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex p-1 rounded-full bg-surface-container-low w-fit">
          {[
            ['received', 'Received', received.length],
            ['sent', 'Sent', sent.length],
          ].map(([v, l, c]) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 ${
                tab === v
                  ? 'bg-surface-container-highest text-primary shadow-sm'
                  : 'text-outline hover:text-on-surface active:scale-95'
              }`}
            >
              {l} ({c})
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <span className="absolute text-lg -translate-y-1/2 material-symbols-outlined left-3 top-1/2 text-outline">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary pl-10 pr-4 py-2.5 rounded-full text-sm text-on-surface placeholder:text-outline outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* File list */}
      <div className="space-y-2">
        {loading ? (
          [1, 2, 3, 4, 5].map(i => <SkeletonFileRow key={i} />)
        ) : list.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-xl">
            <span className="block mb-3 text-5xl material-symbols-outlined text-outline">folder_open</span>
            <p className="font-semibold text-on-surface">No {tab} files</p>
            <p className="mt-1 text-sm text-on-surface-variant">
              {tab === 'received' ? 'Files sent to you will appear here' : 'Files you send will appear here'}
            </p>
          </div>
        ) : (
          list.map(f => {
            const { i, c } = fileIcon(f.fileType)
            return (
              <div key={f._id} className="flex items-center gap-4 p-4 transition-all duration-200 glass-card rounded-xl hover:border-white/12">
                <div className={`w-11 h-12 rounded-lg flex items-center justify-center shrink-0 ${c}`}>
                  <span className="text-xl material-symbols-outlined">{i}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-on-surface">{f.fileName}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {fmt(f.fileSize)} •{' '}
                    {tab === 'sent' ? `To ${f.recipient?.username}` : `From ${f.sender?.username}`} •{' '}
                    {formatDistanceToNow(new Date(f.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={f.fileUrl}
                    download={f.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-primary hover:text-on-primary active:scale-95"
                  >
                    <span className="text-sm material-symbols-outlined">download</span>
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  {tab === 'sent' && (
                    <button
                      onClick={() => setDelTarget(f)}
                      className="p-1.5 text-outline hover:text-error hover:bg-error/10 rounded-lg cursor-pointer transition-all duration-200"
                    >
                      <span className="text-lg material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Delete confirm modal */}
      {delTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDelTarget(null)} />
          <div className="relative w-full max-w-sm p-6 glass-modal rounded-2xl animate-scale-in">
            <h3 className="mb-2 font-bold text-on-surface">Delete File</h3>
            <p className="mb-5 text-sm text-on-surface-variant">
              Delete <strong className="text-on-surface">{delTarget.fileName}</strong>? This removes it from storage permanently.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDelTarget(null)}
                className="flex-1 py-2.5 bg-surface-container-high rounded-full text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-[#16274e]/70 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                disabled={deleting}
                className="flex-1 py-2.5 hover:bg-red-500 text-white rounded-full text-sm font-bold cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting
                  ? <span className="text-lg material-symbols-outlined animate-spin">progress_activity</span>
                  : <span className="text-lg material-symbols-outlined">delete</span>
                }
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}