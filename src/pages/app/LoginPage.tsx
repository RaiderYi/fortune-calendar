// ==========================================
// 登录/注册页面 - 邮箱验证 + 邀请码
// ==========================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  Gift, 
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import * as authApi from '../../services/authApi';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoggedIn } = useAuth();
  
  // 从URL获取邀请码
  const queryParams = new URLSearchParams(location.search);
  const urlInviteCode = queryParams.get('invite');
  
  // 模式切换
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'email' | 'verify' | 'password'>('email');
  
  // 表单状态
  const [email, setEmail] = useState('');
  [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [inviteCode, setInviteCode] = useState(urlInviteCode || '');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // UI状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showRewards, setShowRewards] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);

  // 如果已登录，跳转
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/app/today');
    }
  }, [isLoggedIn, navigate]);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 发送验证码
  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await authApi.sendVerificationCode(email);
      if (result.success) {
        setStep('verify');
        setCountdown(60);
        // 开发环境显示验证码
        if (result.debug_code) {
          console.log('Debug code:', result.debug_code);
        }
      } else {
        setError(result.error || '发送失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 验证验证码（注册流程）
  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('请输入6位验证码');
      return;
    }
    setStep('password');
    setError('');
  };

  // 注册
  const handleRegister = async () => {
    if (!password || password.length < 6) {
      setError('密码长度至少6位');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await register({
        email,
        password,
        verificationCode,
        inviteCode: inviteCode || undefined,
      });
      
      if (result.success) {
        setRewards(result.rewards || []);
        setShowRewards(true);
      } else {
        setError(result.error || '注册失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 登录
  const handleLogin = async () => {
    if (!password) {
      setError('请输入密码');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        navigate('/app/today');
      } else {
        setError(result.error || '登录失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 奖励动画完成后跳转
  const handleRewardComplete = () => {
    navigate('/app/today');
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
        to="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        <span>返回首页</span>
      </Link>

      <div className="relative w-full max-w-md">
        {/* 标题 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === 'login' ? '欢迎回来' : '开启命运之旅'}
          </h1>
          <p className="text-white/60">
            {mode === 'login' 
              ? '登录以同步您的数据' 
              : '注册即可获得专属奖励'}
          </p>
        </motion.div>

        {/* 模式切换 */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6"
        >
          <button
            onClick={() => { setMode('login'); setStep('email'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'login' 
                ? 'bg-indigo-600 text-white' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => { setMode('register'); setStep('email'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'register' 
                ? 'bg-indigo-600 text-white' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            注册
          </button>
        </motion.div>

        {/* 表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          {/* 错误提示 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 邮箱输入 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={step !== 'email'}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
              </div>
            </div>

            {/* 验证码输入（仅注册） */}
            {mode === 'register' && step !== 'email' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm text-white/60 mb-2">验证码</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 text-center tracking-widest"
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={countdown > 0 || isLoading}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white/80 hover:bg-white/20 disabled:opacity-50 whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s` : '重新发送'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* 密码输入 */}
            {(mode === 'login' || step === 'password') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm text-white/60 mb-2">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少6位"
                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* 邀请码（仅注册） */}
            {mode === 'register' && step === 'password' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl"
              >
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Gift size={16} />
                  <span className="text-sm font-medium">有邀请码？</span>
                </div>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="FC-XXXXXX（选填）"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-amber-500 text-sm"
                />
                <p className="mt-2 text-xs text-white/40">
                  填写邀请码，双方均可获得额外奖励
                </p>
              </motion.div>
            )}

            {/* 记住我（仅登录） */}
            {mode === 'login' && (
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-indigo-600"
                />
                记住我
              </label>
            )}

            {/* 操作按钮 */}
            {step === 'email' && mode === 'register' && (
              <button
                onClick={handleSendCode}
                disabled={isLoading || !email}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    发送验证码
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}

            {step === 'verify' && mode === 'register' && (
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                下一步
                <ArrowRight size={18} />
              </button>
            )}

            {step === 'password' && mode === 'register' && (
              <button
                onClick={handleRegister}
                disabled={isLoading || !password}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    注册
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}

            {mode === 'login' && (
              <button
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    登录
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* 登录奖励提示 */}
        {mode === 'login' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <Sparkles size={16} />
              <span className="text-sm font-medium">登录奖励</span>
            </div>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500" />
                AI咨询 5次 → 15次/日
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500" />
                解锁全部基础模板
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500" />
                历史记录永久云备份
              </li>
            </ul>
          </motion.div>
        )}
      </div>

      {/* 奖励动画弹窗 */}
      <AnimatePresence>
        {showRewards && (
          <RewardModal 
            rewards={rewards} 
            onComplete={handleRewardComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 奖励弹窗组件
function RewardModal({ rewards, onComplete }: { rewards: any[]; onComplete: () => void }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), rewards.length * 500 + 1000);
    return () => clearTimeout(timer);
  }, [rewards.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">注册成功！</h2>
        <p className="text-white/60 mb-8">恭喜获得以下奖励</p>

        <div className="space-y-3 mb-8">
          {rewards.map((reward, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 + 0.5 }}
              className="p-4 bg-white/10 border border-white/20 rounded-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-white font-medium">{reward.description}</div>
                <div className="text-white/50 text-sm">{reward.type}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {showButton && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition"
          >
            开始使用
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
