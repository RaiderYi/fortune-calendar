import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config' // 初始化 i18n
import App from './App.tsx'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ToastContainer from './components/Toast.tsx'
import { collectWebVitals, reportToAnalytics } from './utils/performance'

// 性能监控
collectWebVitals((metrics) => {
  console.log('Performance metrics:', metrics);
  reportToAnalytics(metrics);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
        <ToastContainer />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
