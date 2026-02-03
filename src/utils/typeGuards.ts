// -*- coding: utf-8 -*-
/**
 * 类型安全工具函数
 * 提供数组和对象的安全访问方法，避免 undefined 错误
 */

/**
 * 确保值为数组，如果不是则返回空数组
 */
export function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }
  return [value];
}

/**
 * 安全地检查数组是否包含元素
 */
export function safeIncludes<T>(
  array: T[] | null | undefined,
  searchElement: T
): boolean {
  if (!Array.isArray(array)) {
    return false;
  }
  return array.includes(searchElement);
}

/**
 * 安全地映射数组
 */
export function safeMap<T, U>(
  array: T[] | null | undefined,
  callback: (item: T, index: number) => U
): U[] {
  if (!Array.isArray(array)) {
    return [];
  }
  return array.map(callback);
}

/**
 * 安全地过滤数组
 */
export function safeFilter<T>(
  array: T[] | null | undefined,
  callback: (item: T, index: number) => boolean
): T[] {
  if (!Array.isArray(array)) {
    return [];
  }
  return array.filter(callback);
}

/**
 * 安全地获取数组长度
 */
export function safeLength<T>(array: T[] | null | undefined): number {
  if (!Array.isArray(array)) {
    return 0;
  }
  return array.length;
}

/**
 * 安全地获取数组的第一个元素
 */
export function safeFirst<T>(array: T[] | null | undefined): T | undefined {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  return array[0];
}

/**
 * 安全地连接数组元素
 */
export function safeJoin(
  array: string[] | null | undefined,
  separator: string = ','
): string {
  if (!Array.isArray(array)) {
    return '';
  }
  return array.join(separator);
}

/**
 * 安全地访问对象属性
 */
export function safeGet<T>(
  obj: Record<string, any> | null | undefined,
  key: string,
  defaultValue: T
): T {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }
  return (obj[key] as T) ?? defaultValue;
}

/**
 * 安全地访问嵌套对象属性
 */
export function safeGetNested<T>(
  obj: any,
  path: string[],
  defaultValue: T
): T {
  let current: any = obj;
  for (const key of path) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  return (current as T) ?? defaultValue;
}
