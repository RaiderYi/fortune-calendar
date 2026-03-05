// ==========================================
// 密码重置页面
// ==========================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import * as authApi from '../../services/authApi';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // 模式：request（请求重置）| verify（验证令牌）| reset（设置新密码）| success（成功）
  const [mode, setMode] = useState<'request' | 'verify' | 'reset' | 'success'>(
    token ? 'verify' : 'request'
  );

  // 表单状态
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  // 如果有token，验证它
  useEffect(() => {
    if (token && mode === 'verify') {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    setIsLoading(true);
    try {
      const result = await authApi.verifyResetToken(token!);
      if (result.success && result.valid) {
        setIsTokenValid(true);
        setMode('reset');
      } else {
        setError('重置链接已过期或无效');
        setMode('request');
      }
    } catch {
      setError('验证失败，请重试');
      setMode('request');
    } finally {
      setIsLoading(false);
    }
  };

  // 请求重置
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authApi.requestPasswordReset(email);
      if (result.success) {
        setMode('success');
      } else {
        setError(result.error || '请求失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 重置密码
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError('密码长度至少6位');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authApi.resetPassword(token!, newPassword);
      if (result.success) {
        setMode('success');
      } else {
        setError(result.error || '重置失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* 返回按钮 */}
      <Link 
        to="/login"
        className="fixed top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        <span>返回登录</span>
      </Link>

      <div className="relative w-full max-w-md">
        {/* 标题 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === 'request' && '忘记密码'}
            {mode === 'verify' && '验证中...'}
            {mode === 'reset' && '设置新密码'}
            {mode === 'success' && '重置成功'}
          </h1>
          <p className="text-white/60">
            {mode === 'request' && '输入邮箱接收重置链接'}
            {mode === 'verify' && '正在验证重置链接...'}
            {mode === 'reset' && '请输入您的新密码'}
            {mode === 'success' && '您的密码已重置成功'}
          </p>
        </motion.div>

        {/* 表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          {/* 请求重置表单 */}
          {mode === 'request' && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    发送重置链接
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 验证中 */}
          {mode === 'verify' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
              <p className="text-white/60">正在验证重置链接...</p>
            </div>
          )}

          {/* 设置新密码表单 */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="至少6位"
                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">确认新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入新密码"
                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    重置密码
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 成功状态 */}
          {mode === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white mb-6">
                {token 
                  ? '您的密码已重置成功，请使用新密码登录' 
                  : '重置链接已发送至您的邮箱，请查收'}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition"
              >
                返回登录
              </button>
            </div>
          )}
        </motion.div>

        {/* 提示 */}
        {mode === 'request' && (
          <p className="mt-6 text-center text-sm text-white/40">
            记得密码？{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
              返回登录
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
