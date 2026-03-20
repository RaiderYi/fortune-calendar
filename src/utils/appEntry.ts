// ==========================================
// 营销站 ↔ 应用主路径衔接（单一故事线：先看今日运势）
// ==========================================

export const APP_TODAY_PATH = '/app/fortune/today';

/** 带 UTM 式参数，便于分析与首屏承接文案；应用内跳转用 internal 不带参数 */
export type AppEntryFrom =
  | 'internal'
  | 'home'
  | 'home_bottom'
  | 'siteheader'
  | 'sitefooter'
  | 'features'
  | 'pricing';

export function buildTodayEntryLink(from: AppEntryFrom): string {
  if (from === 'internal') return APP_TODAY_PATH;
  const q = new URLSearchParams();
  q.set('from', from);
  q.set('intent', 'today');
  return `${APP_TODAY_PATH}?${q.toString()}`;
}

const BRIDGE_FROM = new Set([
  'home',
  'home_bottom',
  'siteheader',
  'sitefooter',
  'features',
  'pricing',
]);

/** 是否在今日页展示「从首页来」的承接条 */
export function shouldShowEntryBridge(
  from: string | null,
  intent: string | null
): boolean {
  return intent === 'today' && !!from && BRIDGE_FROM.has(from);
}
