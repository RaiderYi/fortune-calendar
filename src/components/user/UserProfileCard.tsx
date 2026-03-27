// ==========================================
// 用户资料卡片
// User Profile Card
// ==========================================

import { motion } from 'framer-motion';
import { Crown, Star, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserGrowth, getCurrentLevelConfig, getLevelProgressPercent } from '../../utils/userLevelStorage';
import { getMembership, getMembershipRemainingDays, isValidMembership, MEMBERSHIP_CONFIG } from '../../utils/membershipStorage';

interface UserProfileCardProps {
  onEdit?: () => void;
  onViewMembership?: () => void;
}

export function UserProfileCard({ onEdit, onViewMembership }: UserProfileCardProps) {
  const { user } = useAuth();
  const growth = getUserGrowth();
  const levelConfig = getCurrentLevelConfig();
  const progressPercent = getLevelProgressPercent();
  const membership = getMembership();
  const isMember = isValidMembership() && membership.type !== 'free';
  const remainingDays = getMembershipRemainingDays();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-card"
    >
      {/* 用户基本信息 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vermilion to-gold flex items-center justify-center text-white text-2xl font-serif">
            {user?.email?.[0]?.toUpperCase() || '👤'}
          </div>
          {isMember && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
              <Crown size={14} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-serif text-ink">
            {user?.email?.split('@')[0] || '访客用户'}
          </h3>
          <p className="text-sm text-light-ink font-serif">
            {user?.email}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg">{levelConfig.icon}</span>
            <span className="text-sm text-vermilion font-serif">{levelConfig.title}</span>
            <span className="text-xs text-muted">Lv.{growth.level}</span>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-2 rounded-xl hover:bg-paper-dark transition-colors"
        >
          <ChevronRight size={20} className="text-light-ink" />
        </button>
      </div>

      {/* 会员状态 */}
      <div 
        onClick={onViewMembership}
        className={`
          mb-6 p-4 rounded-xl cursor-pointer transition-all
          ${isMember 
            ? 'bg-gradient-to-r from-gold/20 to-vermilion/10 border border-gold/30' 
            : 'bg-paper-dark border border-border-subtle'}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${isMember ? 'bg-gold/20' : 'bg-gray-200'}
            `}>
              <Crown size={20} className={isMember ? 'text-gold-dark' : 'text-gray-400'} />
            </div>
            <div>
              <p className="font-serif text-ink">
                {isMember ? MEMBERSHIP_CONFIG[membership.type].name : '免费用户'}
              </p>
              <p className="text-xs text-light-ink">
                {isMember 
                  ? (remainingDays === -1 
                      ? '终身会员' 
                      : `剩余 ${remainingDays} 天`)
                  : '升级会员解锁更多功能'}
              </p>
            </div>
          </div>
          <button className={`
            px-4 py-2 rounded-full text-sm font-serif transition-colors
            ${isMember 
              ? 'bg-gold text-white hover:bg-gold-dark' 
              : 'bg-vermilion text-white hover:bg-vermilion-dark'}
          `}>
            {isMember ? '续费' : '升级'}
          </button>
        </div>
      </div>

      {/* 等级进度 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-light-ink font-serif">等级进度</span>
          <span className="text-vermilion font-serif">{growth.currentExp}/{levelConfig.maxExp} EXP</span>
        </div>
        <div className="h-2 bg-paper-dark rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-vermilion to-gold rounded-full"
          />
        </div>
        <p className="text-xs text-muted font-serif">
          还需 {levelConfig.maxExp - growth.currentExp} 经验值升级到 Lv.{growth.level + 1}
        </p>
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border-subtle">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gold mb-1">
            <Zap size={16} />
            <span className="text-lg font-bold font-serif">{growth.totalQueries}</span>
          </div>
          <p className="text-xs text-light-ink font-serif">运势查询</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-vermilion mb-1">
            <Star size={16} />
            <span className="text-lg font-bold font-serif">{growth.totalCheckins}</span>
          </div>
          <p className="text-xs text-light-ink font-serif">累计签到</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-qingdai mb-1">
            <span className="text-lg font-bold font-serif">{growth.streakDays}</span>
          </div>
          <p className="text-xs text-light-ink font-serif">连续活跃</p>
        </div>
      </div>
    </motion.div>
  );
}
