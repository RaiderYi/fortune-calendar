import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './App.css'
import './i18n/config' // 初始化 i18n
import App from './App.tsx'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
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
        <AuthProvider>
          <BrowserRouter>
            <App />
            <ToastContainer />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
