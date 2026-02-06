// ==========================================
// 自定义用神存储
// 持久化用户手动设置的用神，按出生信息区分
// ==========================================

const KEY_PREFIX = 'custom_yong_shen';

/** 统一日期格式为 YYYY-MM-DD */
function normalizeBirthDate(date: string): string {
  if (!date) return '';
  const match = date.match(/^(\d{4})-?(\d{1,2})-?(\d{1,2})/);
  if (match) {
    const [, y, m, d] = match;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return date;
}

/** 统一时间格式为 HH:mm */
function normalizeBirthTime(time: string): string {
  if (!time) return '12:00';
  const match = time.match(/^(\d{1,2}):?(\d{0,2})/);
  if (match) {
    const [, h, min = '0'] = match;
    return `${h.padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  }
  return time;
}

function getStorageKey(birthDate: string, birthTime: string): string {
  const d = normalizeBirthDate(birthDate);
  const t = normalizeBirthTime(birthTime || '12:00');
  const normalized = `${d}_${t}`.replace(/\s/g, '');
  return `${KEY_PREFIX}_${normalized}`;
}

/**
 * 获取当前用户的自定义用神
 * @param birthDate 出生日期 YYYY-MM-DD
 * @param birthTime 出生时间 HH:mm
 * @returns 自定义用神（单元素或数组），未设置则返回 null
 */
export function getCustomYongShen(
  birthDate: string,
  birthTime: string = '12:00'
): string | string[] | null {
  try {
    const key = getStorageKey(birthDate, birthTime);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'string' && parsed) return parsed;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (error) {
    console.error('读取自定义用神失败:', error);
  }
  return null;
}

/**
 * 保存自定义用神
 * @param birthDate 出生日期 YYYY-MM-DD
 * @param birthTime 出生时间 HH:mm
 * @param value 用神值（单元素或数组），传 null 表示恢复默认
 */
export function setCustomYongShen(
  birthDate: string,
  birthTime: string,
  value: string | string[] | null
): void {
  try {
    const key = getStorageKey(birthDate, birthTime);
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('保存自定义用神失败:', error);
  }
}
