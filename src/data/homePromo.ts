/**
 * 首页 / 落地页「精选推荐」运营位（可后续接 CMS）
 */
export interface PromoItem {
  id: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  to: string;
  accent: 'amber' | 'violet' | 'rose' | 'emerald';
}

export const HOME_PROMO_ITEMS: PromoItem[] = [
  {
    id: 'monthly',
    titleZh: '每月运势',
    titleEn: 'Monthly Fortune',
    descZh: '月历热力 + 流月综合分',
    descEn: 'Heatmap & month score',
    to: '/app/fortune/monthly',
    accent: 'violet',
  },
  {
    id: 'yijing',
    titleZh: '易经问卦',
    titleEn: 'I Ching',
    descZh: '一事一卜 · AI 解读',
    descEn: 'One question, AI insight',
    to: '/app/fortune/yijing',
    accent: 'amber',
  },
  {
    id: 'hepan',
    titleZh: '八字合盘',
    titleEn: 'Bazi Synastry',
    descZh: '双人契合度分析',
    descEn: 'Compatibility overview',
    to: '/app/fortune/hepan',
    accent: 'rose',
  },
  {
    id: 'year2026',
    titleZh: '2026 丙午年运',
    titleEn: '2026 Fortune',
    descZh: '流年主题与建议',
    descEn: 'Yearly theme & tips',
    to: '/app/fortune/year-2026',
    accent: 'emerald',
  },
];
