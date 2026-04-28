import { Link } from 'react-router-dom'

const features = [
  {
    icon: 'link',
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Connect by ID',
    body: 'No email links. Share your unique SendBox ID like NOVA-3847 and connect directly with anyone.',
  },
  {
    icon: 'folder_open',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    title: 'Any File Type',
    body: 'Videos, PDFs, Word docs, ZIP archives, images — everything goes through in full quality.',
  },
  {
    icon: 'history',
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
    title: 'Transfer History',
    body: "Every file transfer is logged. Download anything you've received at any time.",
  },
  {
    icon: 'shield',
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Secure Access',
    body: 'JWT authentication and connection-based access control. Only your contacts can send to you.',
  },
  {
    icon: 'bolt',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    title: 'Instant Transfer',
    body: 'Files go straight to cloud CDN — fast delivery anywhere in the world.',
  },
  {
    icon: 'devices',
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
    title: 'Works Everywhere',
    body: 'Fully responsive. Installs on your phone or desktop like a native app.',
  },
]

const steps = [
  { n: '01', icon: 'person_add', title: 'Create Account', body: 'Sign up in seconds and get your unique SendBox ID automatically.' },
  { n: '02', icon: 'link', title: 'Connect', body: "Enter someone's SendBox ID to link accounts. Once connected, you're connected forever." },
  { n: '03', icon: 'send', title: 'Send Files', body: 'Drag, drop, and send. Files arrive in full quality, instantly.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-on-background overflow-x-hidden">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 header-glass">
        <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-lg">send</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">SendBox</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-[#16274e] px-4 py-2 rounded-full cursor-pointer transition-all duration-200 active:scale-95"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-full cursor-pointer transition-all duration-200 hover:opacity-90 hover:bg-[#16274e] hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
            >
              Get Started
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 mesh-bg">
        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-secondary/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-8">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Free • No compression • Any file type
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] mb-6">
            Send Files.{' '}
            <span className="gradient-text">No Limits.</span>
            <br />No Compromise.
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with anyone using a unique ID. Share videos, documents, and images in full original quality — instantly.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/register"
              className="group flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-black rounded-full text-lg cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-2xl hover:bg-[#16274e] hover:-translate-y-1 active:scale-[0.97] active:translate-y-0"
            >
              Get Started Free
              <span className="material-symbols-outlined transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
            </Link>
            <a
              href="#how"
              className="flex items-center gap-2 px-3 py-3 glass-card text-on-surface font-semibold rounded-full text-lg cursor-pointer transition-all duration-200 hover:bg-[#16274e] hover:-translate-y-0.5 active:scale-[0.97]"
            >
              How It Works
            </a>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-on-surface-variant">
            {['No registration for recipients', 'Files never expire', 'Any size'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating dashboard mockup */}
        <div className="relative z-10 w-full max-w-4xl mx-auto mt-16 px-4">
          <div className="glass-card rounded-2xl p-4 shadow-2xl shadow-black/50 border border-white/10">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-secondary/70" />
              <div className="w-3 h-3 rounded-full bg-primary/70" />
              <span className="ml-3 font-mono text-xs text-outline">sendbox.app/dashboard</span>
            </div>
            <div className="welcome-gradient rounded-xl p-5 text-white">
              <p className="text-sm text-white/70 mb-1">Good morning</p>
              <h3 className="text-xl font-bold">Hello, Alex 👋</h3>
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <span className="font-mono text-sm font-bold tracking-wider">NOVA-3847</span>
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-surface-container-low/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-background mb-4">
              Why <span className="gradient-text">SendBox</span>?
            </h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
              Built for people who care about their files staying exactly as they are.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div
                key={f.title}
                className="glass-card p-6 rounded-xl transition-all duration-200 hover:border-white/15 hover:-translate-y-1 hover:shadow-lg cursor-default"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <span className={`material-symbols-outlined ${f.color} text-2xl`}>{f.icon}</span>
                </div>
                <h3 className="font-bold text-on-surface mb-2">{f.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <section id="how" className="py-24 px-6 mesh-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold tracking-tighter text-on-background mb-4">
              Three steps, done.
            </h2>
            <p className="text-on-surface-variant text-lg">A streamlined workflow designed for speed.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="glass-card p-6 rounded-xl h-full transition-all duration-200 hover:-translate-y-1 hover:border-white/15">
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-4xl font-black text-primary/30 leading-none shrink-0">{s.n}</span>
                    <div>
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-primary">{s.icon}</span>
                      </div>
                      <h3 className="font-bold text-on-surface mb-2">{s.title}</h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                    <span className="material-symbols-outlined text-outline">arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-surface-container-low/50">
        <div className="max-w-3xl mx-auto">
          <div className="welcome-gradient rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to send your first file?</h2>
            <p className="text-white/80 mb-8">Create your account in seconds. Get your unique ID. Start sending.</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0a1628] font-black rounded-full cursor-pointer transition-all duration-200 hover:bg-primary-fixed hover:-translate-y-1 hover:shadow-xl active:scale-[0.97] active:translate-y-0"
            >
              Create Free Account
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-sm">send</span>
            </div>
            <span className="font-bold text-on-surface">SendBox</span>
          </div>
          <p className="text-sm text-outline">Send files. No limits. No compression.</p>
          <p className="text-xs text-outline">© 2026 SendBox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}