const Sk = ({ className = '' }) => (
  <div className={`skeleton rounded-lg ${className}`} />
)

export const SkeletonStatCard = () => (
  <div className="glass-card p-6 rounded-DEFAULT flex items-center justify-between">
    <div className="space-y-2 flex-1 mr-4">
      <Sk className="w-24 h-3" />
      <Sk className="w-16 h-8" />
      <Sk className="w-20 h-2.5" />
    </div>
    <Sk className="w-14 h-14 rounded-xl" />
  </div>
)

export const SkeletonFileRow = () => (
  <div className="glass-card p-4 rounded-DEFAULT flex items-center gap-4">
    <Sk className="w-12 h-12 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Sk className="w-2/3 h-4" />
      <Sk className="w-1/3 h-3" />
    </div>
    <Sk className="w-20 h-8 rounded-full" />
  </div>
)

export const SkeletonConnectionCard = () => (
  <div className="glass-card p-md rounded-DEFAULT space-y-4">
    <div className="flex items-center gap-3">
      <Sk className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Sk className="w-1/2 h-4" />
        <Sk className="w-1/3 h-3" />
      </div>
    </div>
    <Sk className="w-full h-9 rounded-full" />
  </div>
)

export const SkeletonNotifRow = () => (
  <div className="flex items-start gap-3 p-4 glass-card rounded-DEFAULT">
    <Sk className="w-10 h-10 rounded-full flex-shrink-0 mt-0.5" />
    <div className="flex-1 space-y-2">
      <Sk className="w-3/4 h-4" />
      <Sk className="w-1/4 h-3" />
    </div>
  </div>
)