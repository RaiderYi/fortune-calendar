// ==========================================
// 设计令牌 - 兼容入口
// ==========================================
// 必须从 ./designTokens/index 显式重导出：若写为 `from './designTokens'`，
// 部分解析器会把同名文件 `designTokens.ts` 当作目标，造成自引用循环，
// 生产构建（rolldown）会报 MISSING_EXPORT。
// ==========================================

export * from './designTokens/index';
export { default } from './designTokens/index';
