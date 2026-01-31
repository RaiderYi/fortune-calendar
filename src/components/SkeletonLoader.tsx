// ==========================================
// 骨架屏加载组件
// ==========================================

interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 animate-pulse ${className}`}>
      {/* 标题骨架 */}
      <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
      
      {/* 内容骨架 */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      
      {/* 按钮骨架 */}
      <div className="mt-6 flex gap-2">
        <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
      </div>
    </div>
  );
}

export function SkeletonFortuneCard({ className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`bg-gradient-to-br from-purple-100 to-indigo-200 rounded-3xl shadow-xl p-8 animate-pulse ${className}`}>
      {/* 主题骨架 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-white/50 rounded-full"></div>
        <div className="flex-1">
          <div className="h-6 bg-white/50 rounded-lg w-32 mb-2"></div>
          <div className="h-4 bg-white/50 rounded-lg w-24"></div>
        </div>
      </div>
      
      {/* 分数骨架 */}
      <div className="h-20 bg-white/50 rounded-2xl w-32 mb-6"></div>
      
      {/* 八字骨架 */}
      <div className="flex gap-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-white/50 rounded-lg flex-1"></div>
        ))}
      </div>
      
      {/* 描述骨架 */}
      <div className="space-y-2">
        <div className="h-4 bg-white/50 rounded w-full"></div>
        <div className="h-4 bg-white/50 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function SkeletonDimensionCard({ className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 animate-pulse ${className}`}>
      <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
