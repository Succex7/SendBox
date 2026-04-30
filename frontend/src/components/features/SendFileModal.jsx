import { useState, useRef, useCallback } from 'react'
import { filesAPI } from '../../api/files.js'
import toast from 'react-hot-toast'

const fmt = b => {
  if (!b) return '0 B'
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`
  if (b < 1073741824) return `${(b/1048576).toFixed(1)} MB`
  return `${(b/1073741824).toFixed(2)} GB`
}

export default function SendFileModal({ isOpen, onClose, recipient }) {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle') // idle|uploading|success|error
  const [drag, setDrag] = useState(false)
  const inputRef = useRef()

  const pickFile = useCallback(f => { setFile(f); setStatus('idle'); setProgress(0) }, [])

  const onDrop = e => {
    e.preventDefault(); setDrag(false)
    if (e.dataTransfer.files[0]) pickFile(e.dataTransfer.files[0])
  }

  const send = async () => {
    if (!file || !recipient) return
    setStatus('uploading')
    const fd = new FormData()
    fd.append('file', file)
    try {
      await filesAPI.send(recipient._id, fd, e => setProgress(Math.round(e.loaded * 100 / e.total)))
      setStatus('success')
      toast.success(`File sent to ${recipient.username}!`)
    } catch (err) {
      setStatus('error')
      toast.error(err.response?.data?.message || 'Upload failed')
    }
  }

  const close = () => { setFile(null); setProgress(0); setStatus('idle'); onClose() }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      {/* Sheet — bottom sheet on mobile, centered modal on desktop */}
      <div className="relative z-10 w-full p-5 md:max-w-lg glass-modal md:rounded-2xl rounded-t-2xl animate-slide-up">
        <div className="sheet-handle md:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Send File</h2>
            {recipient && (
              <p className="text-xs text-on-surface-variant mt-0.5">
                To <span className="font-semibold text-primary">{recipient.username}</span>
                <span className="ml-1 font-mono text-outline">({recipient.uniqueId})</span>
              </p>
            )}
          </div>
          <button onClick={close} className="p-1.5 hover:bg-white/5 rounded-lg t text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Success */}
        {status === 'success' ? (
          <div className="py-8 space-y-3 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-secondary/10">
              <span className="text-4xl text-green-500 material-symbols-outlined">check_circle</span>
            </div>
            <p className="text-lg font-bold text-green-500 text-on-surface">File Sent!</p>
            <p className="text-sm text-on-surface-variant">{recipient?.username} will be notified.</p>
            <button
            onClick={close}
            className="mt-3 px-8 py-3.5 bg-[#16274e] text-on-primary rounded-full font-black cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 flex items-center gap-2 mx-auto"
          >
            <span className="text-lg text-green-500 material-symbols-outlined">check</span>
            Done
          </button>
          </div>
        ) : (
          <>
            {/* Drop zone */}
            <div
              className={`upload-zone rounded-xl p-8 text-center cursor-pointer mb-4 ${drag ? 'drag-over' : ''}`}
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onClick={() => !file && inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" className="hidden" onChange={e => e.target.files[0] && pickFile(e.target.files[0])} />

              {!file ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center mx-auto w-14 h-14 bg-primary/10 rounded-2xl animate-float">
                    <span className="text-3xl material-symbols-outlined text-primary">cloud_upload</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface">Drop your file here</p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      or <span className="font-semibold text-primary">click to browse</span>
                    </p>
                  </div>
                  <p className="text-xs text-outline">Any file type • No size limit</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-left" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl">
                    <span className="text-2xl material-symbols-outlined text-primary">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-on-surface">{file.name}</p>
                    <p className="text-xs text-on-surface-variant">{fmt(file.size)}</p>
                  </div>
                  {status !== 'uploading' && (
                    <button onClick={() => setFile(null)} className="p-1.5 hover:bg-white/5 rounded-lg t text-on-surface-variant">
                      <span className="text-lg material-symbols-outlined">close</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Progress */}
            {status === 'uploading' && (
              <div className="mb-4 space-y-1.5">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Uploading...</span>
                  <span className="font-mono font-bold text-primary">{progress}%</span>
                </div>
                <div className="w-full h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div className="h-full rounded-full progress-bar" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Error */}
            {status === 'error' && (
              <div className="flex items-center gap-2 p-3 mb-4 border bg-error-container/20 border-error/20 rounded-xl">
                <span className="text-lg material-symbols-outlined text-error">error</span>
                <p className="text-sm text-red-500">Upload failed. Please try again.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={close} className="flex-1 py-2.5 bg-surface-container-high hover:bg-[#16274e]/70 rounded-full text-sm font-medium t hover:bg-surface-container-highest active:scale-95">
                Cancel
              </button>
              <button
                onClick={send}
                disabled={!file || status === 'uploading'}
                className="flex-1 py-2.5 hover:bg-[#16274e]/70 hover:transition-0.5 text-on-primary rounded-full text-sm font-bold t hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'uploading' ? (
                  <><span className="text-sm material-symbols-outlined animate-spin">progress_activity</span> {progress}%</>
                ) : (
                  <><span className="text-sm material-symbols-outlined">send</span> Send File</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}