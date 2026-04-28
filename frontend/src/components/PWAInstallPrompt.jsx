import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const handler = e => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    if (user && deferredPrompt && !localStorage.getItem('pwa_dismissed')) {
      const t = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(t)
    }
  }, [user, deferredPrompt])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  const dismiss = () => {
    setShow(false)
    localStorage.setItem('pwa_dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 animate-slide-up">
      <div className="glass-modal rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-primary">send</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-on-surface text-sm">Install SendBox</p>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              Add to your device for quick access — no browser, works like a native app
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={install}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-full t hover:opacity-90 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Install
              </button>
              <button
                onClick={dismiss}
                className="px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface t"
              >
                Not now
              </button>
            </div>
          </div>
          <button onClick={dismiss} className="text-on-surface-variant hover:text-on-surface t">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>
    </div>
  )
}