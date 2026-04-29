import { useState, useEffect, useCallback } from 'react'
import { connectionsAPI } from '../api/connections.js'
import { useAuth } from '../context/AuthContext.jsx'
import { SkeletonConnectionCard } from '../components/ui/Skeleton.jsx'
import SendFileModal from '../components/features/SendFileModal.jsx'
import toast from 'react-hot-toast'

export default function Connections() {
  const { user } = useAuth()
  const [uid, setUid] = useState('')
  const [sending, setSending] = useState(false)
  const [conns, setConns] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [resp, setResp] = useState(null)
  const [modal, setModal] = useState({ open: false, recipient: null })

  const fetch = useCallback(async () => {
    try {
      const [c, p] = await Promise.all([connectionsAPI.getAll(), connectionsAPI.getPending()])
      setConns(c.data.data)
      setPending(p.data.data)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const sendReq = async e => {
    e.preventDefault()
    if (!uid.trim()) return
    setSending(true)
    try {
      await connectionsAPI.sendRequest(uid.trim().toUpperCase())
      toast.success('Connection request sent!')
      setUid('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    } finally { setSending(false) }
  }

  const respond = async (id, status) => {
    setResp(`${id}-${status}`)
    try {
      await connectionsAPI.respond(id, status)
      toast.success(`Request ${status}`)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally { setResp(null) }
  }

  const getOther = conn => {
    const uid2 = user?._id
    return (conn.requester?._id === uid2 || conn.requester?.id === uid2) ? conn.recipient : conn.requester
  }

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      <div>
        <h1 className="text-h1 text-3xl font-black tracking-tighter text-on-background">Connections</h1>
        <p className="text-on-surface-variant mt-1">Manage your trusted network. Send files to connected people.</p>
      </div>

      {/* Add connection */}
      <div className="glass-card p-5 rounded-xl">
        <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person_add</span>
          Add New Connection
        </h2>
        <form onSubmit={sendReq} className="flex gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">alternate_email</span>
            <input
              value={uid}
              onChange={e => setUid(e.target.value)}
              placeholder="Enter SendBox ID (e.g. NOVA-3847)"
              className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary pl-12 pr-4 py-3 rounded-full font-mono text-sm text-on-surface placeholder:text-outline outline-none t"
            />
          </div>
          <button
            type="submit"
            disabled={sending || !uid.trim()}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-full font-bold text-sm t hover:opacity-90 active:scale-95 disabled:opacity-60 flex-shrink-0"
          >
            {sending ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> : <span className="material-symbols-outlined text-lg">send</span>}
            <span className="hidden sm:inline">Send Request</span>
          </button>
        </form>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
          <h2 className="font-bold text-amber-200 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">pending_actions</span>
            Pending Requests ({pending.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {pending.map(req => (
              <div key={req._id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {req.requester?.username?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-amber-200 text-sm truncate">{req.requester?.username}</p>
                    <p className="font-mono text-xs text-amber-200/60">{req.requester?.uniqueId}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => respond(req._id, 'accepted')}
                    disabled={resp === `${req._id}-accepted`}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary/20 text-secondary hover:bg-secondary hover:text-on-secondary t active:scale-90 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-lg">check</span>
                  </button>
                  <button
                    onClick={() => respond(req._id, 'rejected')}
                    disabled={resp === `${req._id}-rejected`}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-error/70 hover:bg-error/20 hover:text-error t active:scale-90 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected */}
      <div>
        <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-outline">group</span>
          Connected ({conns.length})
        </h2>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <SkeletonConnectionCard key={i} />)}
          </div>
        ) : conns.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline block mb-3">group</span>
            <p className="font-semibold text-on-surface">No connections yet</p>
            <p className="text-sm text-on-surface-variant mt-1">Share your ID <span className="font-mono text-primary">{user?.uniqueId}</span> to get started</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {conns.map(conn => {
              const other = getOther(conn)
              return (
                <div key={conn._id} className="glass-card p-5 rounded-xl t hover:border-primary/20 hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-black">
                      {other?.username?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-on-surface truncate">{other?.username}</p>
                      <p className="font-mono text-xs text-on-surface-variant">{other?.uniqueId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setModal({ open: true, recipient: { ...other, _id: other?._id || other?.id } })}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-semibold text-sm t hover:bg-primary hover:text-on-primary active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">send</span>
                    Send File
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <SendFileModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, recipient: null })}
        recipient={modal.recipient}
      />
    </div>
  )
}