// ==========================================
// 登录引导弹窗 - 渐进式引导用户登录
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  MessageCircle, 
  History, 
  Cloud,
  Gift,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  triggerType: 'ai_limit' | 'history_limit' | 'sync_prompt' | 'feature_lock' | 'data_migration';
  extraData?: any;
}

const promptConfigs = {
  ai_limit: {
    icon: MessageCircle,
    title: 'AI 咨询次数已用完',
    description: '今日免费次数已使用完毕，登录后可享受 15 次/日',
    benefits: [
      'AI 咨询从 3 次提升至 15 次/日',
      '更精准的八字分析',
      '历史对话永久保存'
    ],
    primaryAction: '立即登录',
    secondaryAction: '稍后再说',
    highlightColor: 'from-indigo-500 to-purple-500',
    iconColor: 'text-indigo-400',
    bgColor: 'from-indigo-600/20 to-purple-600/20'
  },
  history_limit: {
    icon: History,
    title: '历史记录已达上限',
    description: '本地存储空间有限，登录后可永久保存无限历史记录',
    benefits: [
      '无限历史记录存储',
      '多设备数据同步',
      '云端备份永不丢失'
    ],
    primaryAction: '登录解锁',
    secondaryAction: '先看一看',
    highlightColor: 'from-emerald-500 to-cyan-500',
    iconColor: 'text-emerald-400',
    bgColor: 'from-emerald-600/20 to-cyan-600/20'
  },
  sync_prompt: {
    icon: Cloud,
    title: '同步您的数据',
    description: '您在本设备的数据可以同步到云端，换设备也不丢失',
    benefits: [
      '多设备无缝切换',
      '数据实时同步',
      '安全云端备份'
    ],
    primaryAction: '立即同步',
    secondaryAction: '继续使用',
    highlightColor: 'from-blue-500 to-indigo-500',
    iconColor: 'text-blue-400',
    bgColor: 'from-blue-600/20 to-indigo-600/20'
  },
  feature_lock: {
    icon: Gift,
    title: '解锁更多功能',
    description: '登录后即可使用全部高级功能',
    benefits: [
      '全部精美模板',
      '高级 AI 分析',
      '专属运势报告'
    ],
    primaryAction: '免费登录',
    secondaryAction: '暂时跳过',
    highlightColor: 'from-amber-500 to-orange-500',
    iconColor: 'text-amber-400',
    bgColor: 'from-amber-600/20 to-orange-600/20'
  },
  data_migration: {
    icon: Cloud,
    title: '上传本地数据',
    description: '检测到你有一些本地数据，登录后可以同步到云端',
    benefits: [
      '保留所有历史记录',
      '同步到云端安全保存',
      '多设备可用'
    ],
    primaryAction: '登录并上传',
    secondaryAction: '仅登录不上传',
    highlightColor: 'from-violet-500 to-purple-500',
    iconColor: 'text-violet-400',
    bgColor: 'from-violet-600/20 to-purple-600/20'
  }
};

export default function LoginPrompt({ isOpen, onClose, triggerType, extraData }: LoginPromptProps) {
  const navigate = useNavigate();
  const [showDontAskAgain, setShowDontAskAgain] = useState(false);
  
  const config = promptConfigs[triggerType];
  const Icon = config.icon;

  // 处理不再询问
  const handleDontAskAgain = () => {
    const key = `login_prompt_dismissed_${triggerType}`;
    localStorage.setItem(key, Date.now().toString());
    onClose();
  };

  // 处理登录
  const handleLogin = () => {
    // 保存当前路径，登录后返回
    sessionStorage.setItem('login_redirect', window.location.pathname);
    navigate('/login');
    onClose();
  };

  // 检查是否应该显示（是否已设置不再询问）
  useEffect(() => {
    if (isOpen) {
      const dismissed = localStorage.getItem(`login_prompt_dismissed_${triggerType}`);
      if (dismissed) {
        const daysSinceDismissed = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
        // 7天后再次显示
        if (daysSinceDismissed < 7) {
          onClose();
        }
      }
    }
  }, [isOpen, triggerType, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl overflow-hidden"
        >
          {/* 头部渐变背景 */}
          <div className={`bg-gradient-to-br ${config.bgColor} p-6 relative`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.highlightColor} flex items-center justify-center shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{config.title}</h3>
                <p className="text-white/60 text-sm">{config.description}</p>
              </div>
            </div>
          </div>

          {/* 权益列表 */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-white font-medium">登录后享受</span>
            </div>

            <ul className="space-y-3">
              {config.benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${config.highlightColor} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            {/* 额外信息（如本地数据统计） */}
            {extraData && triggerType === 'data_migration' && (
              <div className="mt-4 p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/60 mb-2">可上传的数据：</p>
                <div className="flex gap-4">
                  {extraData.historyCount > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{extraData.historyCount}</div>
                      <div className="text-xs text-white/50">历史记录</div>
                    </div>
                  )}
                  {extraData.aiCount > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{extraData.aiCount}</div>
                      <div className="text-xs text-white/50">AI对话</div>
                    </div>
                  )}
                  {extraData.achievementCount > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{extraData.achievementCount}</div>
                      <div className="text-xs text-white/50">成就</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="space-y-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                className={`w-full py-3.5 bg-gradient-to-r ${config.highlightColor} text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25`}
              >
                {config.primaryAction}
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              <button
                onClick={() => setShowDontAskAgain(true)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 text-sm rounded-xl transition"
              >
                {config.secondaryAction}
              </button>
            </div>

            {/* 不再询问选项 */}
            <AnimatePresence>
              {showDontAskAgain && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2"
                >
                  <button
                    onClick={handleDontAskAgain}
                    className="text-xs text-white/40 hover:text-white/60 transition"
                  >
                    7天内不再提示
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 底部提示 */}
            <p className="text-center text-xs text-white/30 pt-2">
              登录即表示同意我们的服务条款和隐私政策
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// 检查是否应该显示登录引导
export function shouldShowLoginPrompt(triggerType: string): boolean {
  const dismissed = localStorage.getItem(`login_prompt_dismissed_${triggerType}`);
  if (dismissed) {
    const daysSinceDismissed = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
    return daysSinceDismissed >= 7;
  }
  return true;
}

// 获取游客数据统计
export function getGuestStats() {
  const aiCount = parseInt(localStorage.getItem('guest_ai_count') || '0');
  const history = JSON.parse(localStorage.getItem('fortune_history') || '[]');
  const achievements = JSON.parse(localStorage.getItem('fortune_achievements') || '[]');
  
  return {
    aiCount,
    historyCount: history.length,
    achievementCount: achievements.length,
    hasData: aiCount > 0 || history.length > 0 || achievements.length > 0
  };
}
