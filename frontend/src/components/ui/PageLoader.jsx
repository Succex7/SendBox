export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 mesh-bg flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-2xl">send</span>
        </div>
        <span className="text-2xl font-black tracking-tighter text-white">SendBox</span>
      </div>
      <div className="w-48 h-1 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className="h-full rounded-full progress-bar"
          style={{ animation: 'loadBar 1.4s ease-in-out infinite' }}
        />
      </div>
      <style>{`
        @keyframes loadBar {
          0%   { width: 0%; margin-left: 0%; }
          50%  { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}