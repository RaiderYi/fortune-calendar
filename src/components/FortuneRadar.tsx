// ==========================================
// 运势雷达图组件 - 六维分析可视化
// ==========================================

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { DimensionType, DimensionAnalysis } from './DimensionDetail';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface FortuneRadarProps {
  dimensions: { [key in DimensionType]: DimensionAnalysis };
  totalScore: number;
  onDimensionClick?: (dimension: DimensionType) => void;
  size?: 'sm' | 'md' | 'lg';
}

interface RadarDataItem {
  subject: string;
  key: DimensionType;
  value: number;
  fullMark: number;
  level: string;
  tag: string;
}

const sizeConfig = {
  sm: { height: 200, fontSize: 10 },
  md: { height: 280, fontSize: 12 },
  lg: { height: 360, fontSize: 14 },
};

export default function FortuneRadar({
  dimensions,
  totalScore,
  onDimensionClick,
  size = 'md',
}: FortuneRadarProps) {
  const { t, i18n } = useTranslation(['fortune']);
  const [hoveredDimension, setHoveredDimension] = useState<DimensionType | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<DimensionType | null>(null);

  const isEnglish = i18n.language === 'en';

  // 转换数据为雷达图格式
  const radarData: RadarDataItem[] = useMemo(() => {
    const dimensionKeys: DimensionType[] = ['career', 'wealth', 'romance', 'health', 'academic', 'travel'];
    const labels: Record<DimensionType, string> = {
      career: isEnglish ? 'Career' : '事业',
      wealth: isEnglish ? 'Wealth' : '财运',
      romance: isEnglish ? 'Love' : '桃花',
      health: isEnglish ? 'Health' : '健康',
      academic: isEnglish ? 'Study' : '学业',
      travel: isEnglish ? 'Travel' : '出行',
    };

    return dimensionKeys.map((key) => ({
      subject: labels[key],
      key,
      value: dimensions[key]?.score || 50,
      fullMark: 100,
      level: dimensions[key]?.level || '平',
      tag: dimensions[key]?.tag || '',
    }));
  }, [dimensions, isEnglish]);

  // 根据总分确定主题色
  const themeColor = useMemo(() => {
    if (totalScore >= 80) return { stroke: '#f59e0b', fill: '#fbbf24', bg: 'from-amber-50 to-yellow-50' }; // 金色
    if (totalScore >= 60) return { stroke: '#22c55e', fill: '#4ade80', bg: 'from-green-50 to-emerald-50' }; // 绿色
    return { stroke: '#f97316', fill: '#fb923c', bg: 'from-orange-50 to-amber-50' }; // 橙色
  }, [totalScore]);

  // 处理维度点击
  const handleDimensionClick = (dimension: DimensionType) => {
    setSelectedDimension(dimension);
    onDimensionClick?.(dimension);
  };

  // 获取Top 2维度
  const topDimensions = useMemo(() => {
    return [...radarData]
      .sort((a, b) => b.value - a.value)
      .slice(0, 2);
  }, [radarData]);

  // 获取趋势图标
  const getTrendIcon = (value: number) => {
    if (value >= 80) return <TrendingUp size={14} className="text-green-500" />;
    if (value < 60) return <TrendingDown size={14} className="text-orange-500" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  const config = sizeConfig[size];

  return (
    <div className="w-full">
      {/* 雷达图容器 */}
      <div className={`relative rounded-2xl bg-gradient-to-br ${themeColor.bg} p-4`}>
        {/* 标题 */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
            <Sparkles size={16} className="text-indigo-500" />
            {isEnglish ? 'Six Dimensions Analysis' : '六维运势分析'}
          </h3>
          <span className="text-xs text-gray-500">{isEnglish ? 'Click to view details' : '点击维度查看详情'}</span>
        </div>

        {/* 雷达图 */}
        <div style={{ height: config.height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="70%"
              data={radarData}
            >
              <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#6b7280', fontSize: config.fontSize, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name={isEnglish ? 'Score' : '分数'}
                dataKey="value"
                stroke={themeColor.stroke}
                fill={themeColor.fill}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as RadarDataItem;
                    return (
                      <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-lg border border-gray-100 text-sm">
                        <p className="font-bold text-gray-800 dark:text-gray-200">{data.subject}</p>
                        <p className="text-indigo-600 font-semibold">{data.value}分</p>
                        <p className="text-gray-500 text-xs">{data.tag}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 可点击的维度标签 */}
        <div className="absolute inset-0 pointer-events-none">
          {radarData.map((item, index) => {
            // 计算标签位置（简化版本，实际可能需要更精确的计算）
            const angle = (index * 60 - 90) * (Math.PI / 180);
            const radius = config.height * 0.35;
            const x = 50 + (Math.cos(angle) * radius) / config.height * 50;
            const y = 50 + (Math.sin(angle) * radius) / config.height * 50;

            return (
              <button
                key={item.key}
                onClick={() => handleDimensionClick(item.key)}
                onMouseEnter={() => setHoveredDimension(item.key)}
                onMouseLeave={() => setHoveredDimension(null)}
                className={`
                  absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-200
                  ${hoveredDimension === item.key || selectedDimension === item.key
                    ? 'bg-white shadow-lg scale-110'
                    : 'bg-transparent hover:bg-white/50'
                  }
                `}
                style={{
                  left: `${x}%`,
                  top: `${y + 10}%`, // 向下偏移一点
                }}
              >
                <span className={`
                  text-xs font-bold
                  ${item.value >= 80 ? 'text-amber-600' :
                    item.value >= 60 ? 'text-green-600' :
                    'text-orange-600'
                  }
                `}>
                  {item.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 2 维度快速展示 */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {topDimensions.map((dim) => (
          <motion.div
            key={dim.key}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDimensionClick(dim.key)}
            className={`
              flex items-center gap-2 p-2.5 rounded-xl cursor-pointer
              ${dim.value >= 80 ? 'bg-amber-50 border border-amber-100' :
                dim.value >= 60 ? 'bg-green-50 border border-green-100' :
                'bg-orange-50 border border-orange-100'
              }
            `}
          >
            {getTrendIcon(dim.value)}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">{dim.subject}</p>
              <p className="text-sm font-bold text-gray-800 truncate">{dim.tag}</p>
            </div>
            <span className={`
              text-sm font-bold
              ${dim.value >= 80 ? 'text-amber-600' :
                dim.value >= 60 ? 'text-green-600' :
                'text-orange-600'
              }
            `}>
              {dim.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* 选中的维度详情弹窗 */}
      <AnimatePresence>
        {selectedDimension && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-800">
                {radarData.find(d => d.key === selectedDimension)?.subject}
              </h4>
              <button
                onClick={() => setSelectedDimension(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {dimensions[selectedDimension]?.inference}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
