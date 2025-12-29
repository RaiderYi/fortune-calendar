import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // 配置代理，解决本地开发时的跨域和 404 问题
    // 假设你的 Python 后端运行在 5000 端口 (Flask 默认)
    // 如果你的后端在其他端口 (如 8000)，请修改 target
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        // 如果后端不需要 /api 前缀，可以开启下面的重写
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})