import { useState, useEffect } from 'react'
import { notificationsAPI } from '../api/notifications.js'
import { SkeletonNotifRow } from '../components/ui/Skeleton.jsx'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function Notifications() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    notificationsAPI.getAll()
      .then(r => setNotifs(r.data.data))
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false))
  }, [])

  const unread = notifs.filter(n => !n.isRead).length

  const markOne = async id => {
    try {
      await notificationsAPI.markRead(id)
      setNotifs(p => p.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch {}
  }

  const markAll = async () => {
    setMarking(true)
    try {
      await notificationsAPI.markAllRead()
      setNotifs(p => p.map(n => ({ ...n, isRead: true })))
      toast.success('All marked as read')
    } catch { toast.error('Failed') }
    finally { setMarking(false) }
  }

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-on-background">Notifications</h1>
          <p className="text-on-surface-variant mt-1">{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAll}
            disabled={marking}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-semibold t hover:bg-primary hover:text-on-primary active:scale-95 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-sm">{marking ? 'progress_activity' : 'done_all'}</span>
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {loading
          ? [1,2,3,4].map(i => <SkeletonNotifRow key={i} />)
          : notifs.length === 0
          ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-secondary block mb-3">notifications_none</span>
              <p className="font-semibold text-on-surface">You're all caught up ✅</p>
              <p className="text-sm text-on-surface-variant mt-1">Notifications will appear here</p>
            </div>
          )
          : notifs.map(n => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markOne(n._id)}
              className={`flex items-start gap-3 p-4 rounded-xl t cursor-pointer ${
                !n.isRead
                  ? 'glass-card border-l-4 border-l-primary bg-primary/5'
                  : 'glass-card hover:bg-white/3'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                n.type === 'connection_request' ? 'bg-primary/10' : 'bg-secondary/10'
              }`}>
                <span className={`material-symbols-outlined ${n.type === 'connection_request' ? 'text-primary' : 'text-secondary'}`}>
                  {n.type === 'connection_request' ? 'link' : 'folder_open'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-on-surface leading-snug">
                  <span className="font-semibold">{n.sender?.username}</span>{' '}
                  {n.type === 'connection_request' ? 'sent you a connection request' : 'sent you a file'}
                </p>
                <p className="text-xs text-outline mt-1">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!n.isRead && <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />}
            </div>
          ))
        }
      </div>
    </div>
  )
}