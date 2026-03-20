// ==========================================
// 我的页面 - 个人中心、账户管理、同步设置
// ==========================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Cloud,
  CloudOff,
  Gift,
  LogOut,
  ChevronRight,
  Shield,
  Trash2,
  Lock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Users,
  Crown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { getCreditsBalance } from '../../utils/creditsStorage';
import { syncManager } from '../../services/SyncManager';
import * as authApi from '../../services/authApi';
import * as syncApi from '../../services/syncApi';

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, toggleSync, refreshInviteInfo, inviteInfo } = useAuth();
  
  // 状态
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [credits, setCredits] = useState(() => getCreditsBalance());

  // 加载同步状态
  useEffect(() => {
    if (isLoggedIn) {
      loadSyncStatus();
      refreshInviteInfo();
    }
    setCredits(getCreditsBalance());
  }, [isLoggedIn]);

  useEffect(() => {
    const onCredits = () => setCredits(getCreditsBalance());
    window.addEventListener('fc-credits-updated', onCredits);
    return () => window.removeEventListener('fc-credits-updated', onCredits);
  }, []);

  const loadSyncStatus = async () => {
    try {
      const result = await syncApi.getSyncStatus();
      if (result.success) {
        setSyncStatus(result);
      }
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  // 手动同步
  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      await syncManager.onUserLogin(user!.id);
      await loadSyncStatus();
      setSuccess('同步成功');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('同步失败');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // 切换同步开关
  const handleToggleSync = async (enabled: boolean) => {
    await toggleSync(enabled);
  };

  // 处理登出
  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout();
      navigate('/app/fortune/today');
    }
  };

  // 未登录状态
  if (!isLoggedIn) {
    return <GuestProfile />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
      {/* 头部 */}
      <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/app/fortune/today" className="p-2 hover:bg-white/10 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </Link>
          <h1 className="text-lg font-bold text-white">我的</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{user?.email}</h2>
              <p className="text-white/60 text-sm">
                注册于 {new Date(user?.createdAt || '').toLocaleDateString('zh-CN')}
              </p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400">会员</span>
            </div>
          </div>

          {/* 权益展示 */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-emerald-400">{credits}</div>
              <div className="text-xs text-white/60">积分</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">15</div>
              <div className="text-xs text-white/60">AI咨询/日</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">∞</div>
              <div className="text-xs text-white/60">历史记录</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">全部</div>
              <div className="text-xs text-white/60">模板解锁</div>
            </div>
          </div>
        </motion.div>

        {/* 邀请信息 */}
        {inviteInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/app/invite"
              className="block bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 hover:border-amber-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">邀请好友</h3>
                    <p className="text-sm text-white/60">
                      已邀请 {inviteInfo.successfulInvites} 人 · 邀请码 {inviteInfo.inviteCode}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* 同步设置 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                {user?.syncEnabled ? (
                  <Cloud className="w-5 h-5 text-emerald-400" />
                ) : (
                  <CloudOff className="w-5 h-5 text-white/40" />
                )}
              </div>
              <div>
                <h3 className="text-white font-medium">数据同步</h3>
                <p className="text-sm text-white/60">
                  {user?.syncEnabled ? '已开启' : '已关闭'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggleSync(!user?.syncEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                user?.syncEnabled ? 'bg-emerald-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  user?.syncEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {user?.syncEnabled && syncStatus && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">历史记录</span>
                <span className="text-white">{syncStatus.total_records?.history || 0} 条</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">成就</span>
                <span className="text-white">{syncStatus.total_records?.achievements || 0} 个</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">存储空间</span>
                <span className="text-white">{syncStatus.storage_usage?.total_kb || 0} KB</span>
              </div>
              <button
                onClick={handleManualSync}
                disabled={isLoading}
                className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white/80 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                立即同步
              </button>
            </div>
          )}
        </motion.div>

        {/* 账户安全 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              账户安全
            </h3>
          </div>
          
          <button
            onClick={() => setShowChangePassword(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-white/60" />
              <span className="text-white">修改密码</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/40" />
          </button>

          <button
            onClick={() => setShowDeleteAccount(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition border-t border-white/10"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-400" />
              <span className="text-red-400">注销账户</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/40" />
          </button>
        </motion.div>

        {/* 登出按钮 */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleLogout}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </motion.button>

        {/* 提示消息 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400"
            >
              <CheckCircle className="w-5 h-5" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 修改密码弹窗 */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={() => {
          setShowChangePassword(false);
          setSuccess('密码修改成功');
          setTimeout(() => setSuccess(''), 3000);
        }}
      />

      {/* 注销账户弹窗 */}
      <DeleteAccountModal
        isOpen={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        onSuccess={() => {
          logout();
          navigate('/app/fortune/today');
        }}
      />
    </div>
  );
}

// 游客模式页面
function GuestProfile() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    aiCount: 0,
    historyCount: 0,
    daysUsed: 0
  });

  useEffect(() => {
    // 加载游客数据统计
    const aiCount = parseInt(localStorage.getItem('guest_ai_count') || '0');
    const history = JSON.parse(localStorage.getItem('fortune_history') || '[]');
    const firstVisit = localStorage.getItem('fortune_first_visit');
    const daysUsed = firstVisit 
      ? Math.floor((Date.now() - parseInt(firstVisit)) / (1000 * 60 * 60 * 24)) + 1
      : 1;

    setStats({
      aiCount,
      historyCount: history.length,
      daysUsed
    });

    // 记录首次访问
    if (!firstVisit) {
      localStorage.setItem('fortune_first_visit', Date.now().toString());
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
      {/* 头部 */}
      <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/app/fortune/today" className="p-2 hover:bg-white/10 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </Link>
          <h1 className="text-lg font-bold text-white">我的</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* 游客状态卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-8 h-8 text-white/60" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">游客模式</h2>
              <p className="text-white/60 text-sm">登录以享受完整功能</p>
            </div>
          </div>

          {/* 使用统计 */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">{stats.daysUsed}</div>
              <div className="text-xs text-white/60">使用天数</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">{stats.historyCount}</div>
              <div className="text-xs text-white/60">历史记录</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">{stats.aiCount}</div>
              <div className="text-xs text-white/60">AI咨询</div>
            </div>
          </div>
        </motion.div>

        {/* 登录引导 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-medium">登录解锁更多功能</h3>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              AI咨询从 3次 提升至 15次/日
            </li>
            <li className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              无限历史记录，永久云备份
            </li>
            <li className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              多设备数据同步
            </li>
            <li className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              解锁全部精美模板
            </li>
            <li className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              邀请好友获取额外奖励
            </li>
          </ul>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition"
          >
            立即登录 / 注册
          </button>
        </motion.div>

        {/* 数据安全提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <CloudOff className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white/80 text-sm font-medium">数据存储在本地</h4>
              <p className="text-white/50 text-xs mt-1">
                当前您的数据仅存储在设备本地。清除浏览器数据或更换设备将导致数据丢失。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// 修改密码弹窗
function ChangePasswordModal({ isOpen, onClose, onSuccess }: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError('新密码长度至少6位');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authApi.changePassword(oldPassword, newPassword);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || '修改失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">修改密码</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">当前密码</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">新密码</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">确认新密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-50"
            >
              {isLoading ? '修改中...' : '确认修改'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// 注销账户弹窗
function DeleteAccountModal({ isOpen, onClose, onSuccess }: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmText !== 'DELETE') {
      setError('请输入 DELETE 以确认注销');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authApi.deleteAccount(password);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || '注销失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white">注销账户</h3>
        </div>

        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
          <p className="text-red-400 text-sm">
            警告：此操作不可逆。注销后，您的所有数据将被永久删除，包括：
          </p>
          <ul className="mt-2 text-red-400/80 text-sm space-y-1">
            <li>• 历史记录</li>
            <li>• 成就数据</li>
            <li>• 云端备份</li>
            <li>• 邀请记录</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">
              请输入 DELETE 以确认
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500"
              placeholder="DELETE"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition disabled:opacity-50"
            >
              {isLoading ? '注销中...' : '确认注销'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
