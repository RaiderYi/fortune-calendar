// ==========================================
// YiJiDisplay - 宜忌展示组件
// ==========================================
// 设计特点:
// - 卡片式布局
// - 图标化展示
// - 支持宜/忌两种状态
// ==========================================

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { colors, space, radius, shadows, fontSize, fontWeight } from '../designTokens';

interface YiJiDisplayProps {
  /** 宜事项列表 */  yi: string[];
  /** 忌事项列表 */  ji: string[];
  /** 最大显示数量 */  maxItems?: number;
  /** 是否展开全部 */  expanded?: boolean;
}

// 单个宜忌卡片
const YiJiCard: React.FC<{
  type: 'yi' | 'ji';
  items: string[];
  maxItems: number;
}> = ({ type, items, maxItems }) => {
  const isYi = type === 'yi';
  const Icon = isYi ? CheckCircle2 : XCircle;
  
  // 颜色配置
  const colorConfig = {
    yi: {
      bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.08) 100%)',
      border: 'rgba(34, 197, 94, 0.3)',
      icon: colors.dimensions.health.DEFAULT,
      title: '宜',
      titleBg: colors.dimensions.health.DEFAULT,
    },
    ji: {
      bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%)',
      border: 'rgba(239, 68, 68, 0.3)',
      icon: colors.functional.error,
      title: '忌',
      titleBg: colors.functional.error,
    },
  };
  
  const config = colorConfig[type];
  const displayItems = items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  return (
    <motion.div
      style={{
        flex: 1,
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: radius.xl,
        padding: space[4],
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 标题 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: space[2],
          marginBottom: space[3],
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: config.titleBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: fontWeight.bold,
          }}
        >
          {config.title}
        </div>
        <Icon size={20} color={config.icon} />
      </div>

      {/* 事项列表 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: space[2],
        }}
      >
        {displayItems.map((item, index) => (
          <motion.span
            key={index}
            style={{
              padding: `${space[1.5]} ${space[3]}`,
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: radius.md,
              fontSize: fontSize.sm[0],
              fontWeight: fontWeight.medium,
              color: colors.text.primary,
              boxShadow: shadows.sm,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{
              scale: 1.05,
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {item}
          </motion.span>
        ))}
        {hasMore && (
          <span
            style={{
              padding: `${space[1.5]} ${space[3]}`,
              fontSize: fontSize.sm[0],
              color: colors.text.tertiary,
              fontStyle: 'italic',
            }}
          >
            +{items.length - maxItems} 项
          </span>
        )}
      </div>
    </motion.div>
  );
};

export const YiJiDisplay: React.FC<YiJiDisplayProps> = ({
  yi = [],
  ji = [],
  maxItems = 4,
  expanded = false,
}) => {
  const displayMax = expanded ? 100 : maxItems;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space[4],
      }}
    >
      {/* 标题 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3
          style={{
            fontSize: fontSize.lg[0],
            fontWeight: fontWeight.semibold,
            color: colors.text.primary,
            margin: 0,
          }}
        >
          今日宜忌
        </h3>
      </div>

      {/* 宜忌卡片组 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: space[4],
        }}
      >
        {yi.length > 0 && (
          <YiJiCard type="yi" items={yi} maxItems={displayMax} />
        )}
        {ji.length > 0 && (
          <YiJiCard type="ji" items={ji} maxItems={displayMax} />
        )}
      </div>

      {/* 空状态 */}
      {yi.length === 0 && ji.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: space[8],
            color: colors.text.tertiary,
          }}
        >
          暂无宜忌数据
        </div>
      )}
    </div>
  );
};

export default YiJiDisplay;
