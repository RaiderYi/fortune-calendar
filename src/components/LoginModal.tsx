// ==========================================
// 登录/注册模态框组件
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function LoginModal({
  isOpen,
  onClose,
  defaultMode = 'login',
}: LoginModalProps) {
  const { t } = useTranslation(['ui', 'common']);
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [error, setError] = useState('');

  // 切换模式时重置表单
  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setEmailOrPhone('');
    setPassword('');
    setName('');
    setError('');
  };

  // 验证输入
  const validateInput = (): boolean => {
    if (!emailOrPhone.trim()) {
      setError(isPhone ? '请输入手机号' : '请输入邮箱');
      return false;
    }

    if (isPhone) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(emailOrPhone)) {
        setError('请输入正确的手机号');
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailOrPhone)) {
        setError('请输入正确的邮箱地址');
        return false;
      }
    }

    if (password.length < 6) {
      setError('密码长度至少 6 位');
      return false;
    }

    if (mode === 'register' && !name.trim()) {
      setError('请输入姓名');
      return false;
    }

    return true;
  };

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInput()) return;

    const success = await login(emailOrPhone, password, isPhone);
    if (success) {
      onClose();
    }
  };

  // 处理注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInput()) return;

    const success = await register(emailOrPhone, password, name, isPhone);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 遮罩层 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* 模态框 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* 头部 */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {mode === 'login' ? '登录' : '注册'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* 切换按钮 */}
            <div className="flex gap-2">
              <button
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  mode === 'login'
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                登录
              </button>
              <button
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  mode === 'register'
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                注册
              </button>
            </div>
          </div>

          {/* 表单 */}
          <form
            onSubmit={mode === 'login' ? handleLogin : handleRegister}
            className="p-6 space-y-4"
          >
            {/* 登录方式切换 */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPhone(false)}
                className={`flex-1 py-2 px-4 rounded-lg border transition ${
                  !isPhone
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Mail size={16} className="inline mr-2" />
                邮箱
              </button>
              <button
                type="button"
                onClick={() => setIsPhone(true)}
                className={`flex-1 py-2 px-4 rounded-lg border transition ${
                  isPhone
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Phone size={16} className="inline mr-2" />
                手机号
              </button>
            </div>

            {/* 注册时显示姓名输入 */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  姓名
                </label>
                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入您的姓名"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* 邮箱/手机号输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isPhone ? '手机号' : '邮箱'}
              </label>
              <div className="relative">
                {isPhone ? (
                  <Phone
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                ) : (
                  <Mail
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                )}
                <input
                  type={isPhone ? 'tel' : 'email'}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={isPhone ? '请输入手机号' : '请输入邮箱地址'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
            </button>

            {/* 忘记密码（仅登录模式） */}
            {mode === 'login' && (
              <button
                type="button"
                className="w-full text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                忘记密码？
              </button>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
