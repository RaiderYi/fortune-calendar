import {
  Briefcase, Coins, Heart, Zap, BookOpen, Map
} from 'lucide-react';

type DimensionType = 'career' | 'wealth' | 'romance' | 'health' | 'academic' | 'travel';

interface DimensionAnalysis {
  score: number;
  level: '吉' | '平' | '凶' | '大吉';
  tag: string;
  inference: string;
}

interface DimensionCardProps {
  dimensions: { [key in DimensionType]: DimensionAnalysis };
}

export default function DimensionCard({ dimensions }: DimensionCardProps) {

  // 获取对应图标
  const getIcon = (type: DimensionType) => {
    const className = "w-5 h-5";
    switch (type) {
      case 'career': return <Briefcase className={className} />;
      case 'wealth': return <Coins className={className} />;
      case 'romance': return <Heart className={className} />;
      case 'health': return <Zap className={className} />;
      case 'academic': return <BookOpen className={className} />;
      case 'travel': return <Map className={className} />;
    }
  };

  // 获取中文标签
  const getLabel = (type: DimensionType) => {
    switch (type) {
      case 'career': return '事业';
      case 'wealth': return '财运';
      case 'romance': return '情感';
      case 'health': return '健康';
      case 'academic': return '学业';
      case 'travel': return '出行';
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider flex items-center gap-1">
        <span className="text-base">📊</span> 深度推演
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {(Object.keys(dimensions) as DimensionType[]).map((key) => {
          const item = dimensions[key];
          const isGood = item.level === '吉' || item.level === '大吉';
          const isBad = item.level === '凶';

          return (
            <div
              key={key}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4"
            >
              {/* 图标 */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: isGood ? '#ffedd5' : isBad ? '#f3f4f6' : '#dbeafe',
                  color: isGood ? '#ea580c' : isBad ? '#9ca3af' : '#2563eb'
                }}
              >
                {getIcon(key)}
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-800 text-base">
                    {getLabel(key)}
                  </h4>
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide"
                    style={{
                      backgroundColor: isGood ? '#d1fae5' : isBad ? '#fee2e2' : '#dbeafe',
                      color: isGood ? '#047857' : isBad ? '#991b1b' : '#1e40af',
                      borderColor: isGood ? '#10b981' : isBad ? '#ef4444' : '#3b82f6',
                      borderStyle: 'solid',
                      borderWidth: '1px'
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed text-justify">
                  {item.inference}
                </p>
              </div>

              {/* 分数 */}
              <div className="text-right shrink-0 flex flex-col items-end justify-center h-full min-w-[2rem]">
                <span
                  className="text-sm font-bold font-mono"
                  style={{
                    color: isGood ? '#ea580c' : isBad ? '#9ca3af' : '#2563eb'
                  }}
                >
                  {item.score}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}