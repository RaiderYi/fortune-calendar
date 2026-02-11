// ==========================================
// 邀请页面 - 邀请好友获取奖励
// ==========================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Share2, 
  Copy, 
  CheckCircle, 
  Users, 
  TrendingUp,
  ArrowLeft,
  QrCode,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import * as authApi from '../../services/authApi';

interface InviteStats {
  inviteCode: string;
  inviteLink: string;
  totalInvites: number;
  successfulInvites: number;
  currentRewards: {
    aiQuotaBonus?: number;
    templatesUnlocked?: string[];
    badges?: string[];
    allTemplates?: boolean;
    aiUnlimited?: boolean;
  };
  nextMilestone?: {
    target: number;
    current: number;
    remaining: number;
  };
}

export default function InvitePage() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [stats, setStats] = useState<InviteStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      loadInviteStats();
    }
  }, [isLoggedIn]);

  const loadInviteStats = async () => {
    try {
      const result = await authApi.getInviteInfo();
      if (result.success) {
        setStats(result);
      }
    } catch (error) {
      console.error('Failed to load invite stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (stats?.inviteCode) {
      navigator.clipboard.writeText(stats.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (stats?.inviteLink) {
      navigator.clipboard.writeText(stats.inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share && stats?.inviteLink) {
      try {
        await navigator.share({
          title: '加入命运日历',
          text: '我在用命运日历，邀请你一起探索运势！',
          url: stats.inviteLink,
        });
      } catch {
        // 用户取消分享
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Gift className="w-10 h-10 text-white/40" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">请先登录</h2>
          <p className="text-white/60 mb-6">登录后即可获取专属邀请码</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
          >
            去登录
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
      {/* 头部 */}
      <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/app/today" className="p-2 hover:bg-white/10 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </Link>
          <h1 className="text-lg font-bold text-white">邀请好友</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            邀请好友，共享命运
          </h2>
          <p className="text-white/60">
            每成功邀请一位好友，双方均可获得奖励
          </p>
        </motion.div>

        {/* 邀请码卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6 mb-6"
        >
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">您的专属邀请码</p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <code className="text-3xl font-mono font-bold text-white tracking-wider">
                {stats?.inviteCode}
              </code>
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-white/10 rounded-lg transition"
                title="复制邀请码"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-white/60" />
                )}
              </button>
            </div>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-sm text-white/80"
              >
                <QrCode className="w-4 h-4" />
                {showQR ? '隐藏二维码' : '显示二维码'}
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-sm text-white/80"
              >
                <Share2 className="w-4 h-4" />
                复制链接
              </button>
              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition text-sm text-white"
                >
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
              )}
            </div>
          </div>

          {/* QR码 */}
          {showQR && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4">
                {/* 这里应该生成实际的QR码 */}
                <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white/40 text-xs text-center p-4">
                  QR Code
                  <br />
                  {stats?.inviteCode}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 统计数据 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats?.totalInvites || 0}</div>
            <div className="text-sm text-white/60">总邀请</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats?.successfulInvites || 0}</div>
            <div className="text-sm text-white/60">成功注册</div>
          </div>
        </motion.div>

        {/* 里程碑进度 */}
        {stats?.nextMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">下一里程碑</span>
              <span className="text-white/60 text-sm">
                {stats.nextMilestone.current} / {stats.nextMilestone.target}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(stats.nextMilestone.current / stats.nextMilestone.target) * 100}%` 
                }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            </div>
            <p className="mt-2 text-sm text-white/60">
              再邀请 {stats.nextMilestone.remaining} 人即可解锁新奖励
            </p>
          </motion.div>
        )}

        {/* 当前奖励 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            已获得奖励
          </h3>
          <ul className="space-y-2">
            {stats?.currentRewards?.aiQuotaBonus && (
              <li className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                AI咨询 +{stats.currentRewards.aiQuotaBonus}次/日
              </li>
            )}
            {stats?.currentRewards?.allTemplates && (
              <li className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                全部模板已解锁
              </li>
            )}
            {stats?.currentRewards?.aiUnlimited && (
              <li className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                AI咨询无限次数
              </li>
            )}
            {stats?.currentRewards?.badges?.map((badge) => (
              <li key={badge} className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                「{badge}」徽章
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 邀请奖励说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4"
        >
          <h3 className="text-amber-400 font-medium mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5" />
            邀请奖励规则
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">1.</span>
              每成功邀请1人，双方各得+5次AI咨询/日（30天）
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">2.</span>
              邀请3人：解锁全部模板 + 抽签+5次/日
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">3.</span>
              邀请5人：AI咨询无限次数 + 「宗师」称号
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">4.</span>
              邀请10人：终身至尊会员 + 实体周边
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
