/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 可选：Google Analytics 4 测量 ID（Vite 构建时注入，勿提交密钥到仓库） */
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// JSON 模块类型声明
declare module '*.json' {
  const value: any;
  export default value;
}
