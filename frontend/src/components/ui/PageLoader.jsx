// src/components/ui/PageLoader.jsx
// Replace the entire file with this

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 mesh-bg">

      {/* ── Animated Logo ─────────────────────────────── */}
      <div className="flex flex-col items-center gap-5">

        {/* Box + Arrow animation container */}
        <div className="relative w-24 h-24">
          <svg
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="strongGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Gradient for box faces */}
              <linearGradient id="topFace" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4d8eff" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#2d5a8e" stopOpacity="0.9"/>
              </linearGradient>
              <linearGradient id="leftFace" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a3a6e" stopOpacity="0.95"/>
                <stop offset="100%" stopColor="#0b1e3d" stopOpacity="0.95"/>
              </linearGradient>
              <linearGradient id="rightFace" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2a4a8e" stopOpacity="0.95"/>
                <stop offset="100%" stopColor="#1a2d5a" stopOpacity="0.95"/>
              </linearGradient>
              <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff"/>
                <stop offset="100%" stopColor="#4fdbc8"/>
              </linearGradient>
            </defs>

            {/* ── Box body ─────────────────────────────── */}

            {/* Left face */}
            <path
              d="M12 52 L48 70 L48 90 L12 72 Z"
              fill="url(#leftFace)"
              stroke="#4fdbc8"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />

            {/* Right face */}
            <path
              d="M48 70 L84 52 L84 72 L48 90 Z"
              fill="url(#rightFace)"
              stroke="#4fdbc8"
              strokeWidth="0.8"
              strokeOpacity="0.4"
            />

            {/* Top face (open box — just the rim) */}
            <path
              d="M12 52 L48 34 L84 52 L48 70 Z"
              fill="url(#topFace)"
              stroke="#adc6ff"
              strokeWidth="1"
              strokeOpacity="0.8"
              filter="url(#glow)"
            />

            {/* Box opening inner shadow */}
            <path
              d="M20 54 L48 42 L76 54 L48 66 Z"
              fill="#0b1326"
              fillOpacity="0.6"
            />

            {/* Edge glow lines */}
            <line x1="12" y1="52" x2="48" y2="34" stroke="#4fdbc8" strokeWidth="1.5" strokeOpacity="0.8" filter="url(#glow)" />
            <line x1="84" y1="52" x2="48" y2="34" stroke="#adc6ff" strokeWidth="1" strokeOpacity="0.6" filter="url(#glow)" />
            <line x1="12" y1="52" x2="12" y2="72" stroke="#4fdbc8" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="84" y1="52" x2="84" y2="72" stroke="#adc6ff" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="48" y1="90" x2="12" y2="72" stroke="#4fdbc8" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="48" y1="90" x2="84" y2="72" stroke="#adc6ff" strokeWidth="0.8" strokeOpacity="0.3" />

            {/* ── Arrow — animated ─────────────────────── */}
            {/* Arrow group with drop animation */}
            <g style={{ animation: 'arrowEnter 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}>
              {/* Arrow shaft */}
              <line
                x1="48" y1="4"
                x2="48" y2="44"
                stroke="url(#arrowGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#strongGlow)"
              />
              {/* Arrow head */}
              <path
                d="M36 34 L48 46 L60 34"
                stroke="url(#arrowGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#strongGlow)"
              />
            </g>

            {/* Entry flash — appears when arrow enters */}
            <g style={{ animation: 'entryFlash 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}>
              {/* Sparkle particles */}
              <circle cx="34" cy="50" r="2" fill="#4fdbc8" fillOpacity="0.9" filter="url(#glow)" />
              <circle cx="62" cy="48" r="1.5" fill="#adc6ff" fillOpacity="0.8" filter="url(#glow)" />
              <circle cx="42" cy="56" r="1" fill="#ffffff" fillOpacity="0.9" />
              <circle cx="56" cy="44" r="1.5" fill="#4fdbc8" fillOpacity="0.7" filter="url(#glow)" />
              <circle cx="48" cy="42" r="3" fill="#4fdbc8" fillOpacity="0.3" filter="url(#strongGlow)" />
            </g>
          </svg>
        </div>

        {/* Wordmark */}
        <div className="text-center">
          <p className="text-2xl font-black tracking-tighter text-white leading-none">SendBox</p>
          <p className="text-xs text-outline mt-1 tracking-widest uppercase font-medium">File Transfer</p>
        </div>
      </div>

      {/* ── Loading bar ─────────────────────────────────── */}
      <div className="w-36 h-0.5 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(to right, #4fdbc8, #4d8eff)',
            animation: 'loadBar 1.6s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Animation keyframes ─────────────────────────── */}
      <style>{`
        @keyframes arrowEnter {
          0%   { transform: translateY(-18px); opacity: 0; }
          20%  { transform: translateY(-18px); opacity: 0; }
          45%  { transform: translateY(0px);   opacity: 1; }
          60%  { transform: translateY(0px);   opacity: 1; }
          75%  { transform: translateY(4px);   opacity: 0.4; }
          76%  { transform: translateY(-18px); opacity: 0; }
          100% { transform: translateY(-18px); opacity: 0; }
        }

        @keyframes entryFlash {
          0%   { opacity: 0; transform: scale(0.5); }
          55%  { opacity: 0; transform: scale(0.5); }
          65%  { opacity: 1; transform: scale(1.2); }
          80%  { opacity: 0; transform: scale(0.8); }
          100% { opacity: 0; transform: scale(0.5); }
        }

        @keyframes loadBar {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 70%;  margin-left: 15%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}