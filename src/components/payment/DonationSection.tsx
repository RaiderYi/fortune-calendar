// ==========================================
// 打赏/赞助组件
// Donation Section
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, X, CheckCircle } from 'lucide-react';
import { addExp, EXP_RULES } from '../../utils/userLevelStorage';
import { addCredits } from '../../utils/creditsStorage';

interface DonationOption {
  id: string;
  amount: number;
  label: string;
  icon: string;
  description: string;
  reward: {
    credits: number;
    exp: number;
    badge?: string;
  };
}

const DONATION_OPTIONS: DonationOption[] = [
  {
    id: 'coffee',
    amount: 6,
    label: '请我喝咖啡',
    icon: '☕',
    description: '一杯咖啡的支持',
    reward: { credits: 60, exp: EXP_RULES.CHECKIN * 2 }
  },
  {
    id: 'snack',
    amount: 18,
    label: '小食一份',
    icon: '🍜',
    description: '感谢你的支持',
    reward: { credits: 200, exp: EXP_RULES.CHECKIN * 5 }
  },
  {
    id: 'meal',
    amount: 38,
    label: '午餐赞助',
    icon: '🍱',
    description: '让我有更好的状态开发',
    reward: { credits: 450, exp: EXP_RULES.CHECKIN * 10, badge: '慷慨赞助者' }
  },
  {
    id: 'vip',
    amount: 88,
    label: 'VIP赞助',
    icon: '👑',
    description: '成为尊贵赞助者',
    reward: { credits: 1000, exp: EXP_RULES.INVITE_FRIEND, badge: 'VIP赞助者' }
  },
  {
    id: 'custom',
    amount: 0,
    label: '自定义金额',
    icon: '💝',
    description: '随心打赏',
    reward: { credits: 0, exp: EXP_RULES.CHECKIN }
  }
];

// 支付方式配置 - 请替换为你的真实收款链接
const PAYMENT_METHODS = [
  {
    id: 'alipay',
    name: '支付宝',
    icon: '💙',
    link: 'https://qr.alipay.com/fkx19157lmvqc3zre5zsbcf' // 替换为你的支付宝收款链接
  },
  {
    id: 'wechat',
    name: '微信支付',
    icon: '💚',
    link: 'https://pay.weixin.qq.com' // 替换为你的微信收款码链接
  },
  {
    id: 'buymeacoffee',
    name: 'Buy Me a Coffee',
    icon: '☕',
    link: 'https://www.buymeacoffee.com' // 替换为你的链接
  }
];

interface DonationSectionProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function DonationSection({ onClose, showCloseButton = true }: DonationSectionProps) {
  const [selectedOption, setSelectedOption] = useState<DonationOption | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleDonate = () => {
    if (!selectedOption || !selectedMethod) return;
    
    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);
    if (!method) return;

    // 计算奖励
    const amount = selectedOption.id === 'custom' 
      ? parseInt(customAmount) || 0 
      : selectedOption.amount;
    
    const creditsReward = selectedOption.id === 'custom' 
      ? amount * 10 
      : selectedOption.reward.credits;
    
    // 发放奖励
    if (creditsReward > 0) {
      addCredits(creditsReward, 'donation');
    }
    addExp(selectedOption.reward.exp, '打赏赞助');

    // 打开支付链接
    window.open(method.link, '_blank');

    setShowThankYou(true);
  };

  if (showThankYou) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-vermilion/10 flex items-center justify-center">
          <Heart size={40} className="text-vermilion fill-vermilion" />
        </div>
        <h3 className="text-xl font-serif text-ink mb-2">感谢你的支持！</h3>
        <p className="text-light-ink font-serif mb-4">
          你的打赏将帮助我持续改进这个应用
        </p>
        <div className="bg-paper-dark rounded-xl p-4 mb-4">
          <p className="text-sm text-ink font-serif">
            已获得 {selectedOption?.id === 'custom' ? parseInt(customAmount) * 10 : selectedOption?.reward.credits} 积分
          </p>
          <p className="text-xs text-muted">+ {selectedOption?.reward.exp} 经验值</p>
        </div>
        <button
          onClick={() => {
            setShowThankYou(false);
            onClose?.();
          }}
          className="px-6 py-2 bg-vermilion text-white rounded-full font-serif hover:bg-vermilion-dark transition-colors"
        >
          关闭
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-card"
    >
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vermilion/10 flex items-center justify-center">
            <Heart size={20} className="text-vermilion" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-ink">支持开发者</h3>
            <p className="text-xs text-light-ink">你的支持是我持续改进的动力</p>
          </div>
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-paper-dark transition-colors"
          >
            <X size={20} className="text-light-ink" />
          </button>
        )}
      </div>

      {/* 打赏选项 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {DONATION_OPTIONS.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedOption(option)}
            className={`
              p-4 rounded-xl border-2 text-left transition-all
              ${selectedOption?.id === option.id 
                ? 'border-vermilion bg-vermilion/5' 
                : 'border-border-subtle hover:border-vermilion/30'}
            `}
          >
            <div className="text-2xl mb-2">{option.icon}</div>
            <div className="font-serif text-ink text-sm">{option.label}</div>
            {option.id !== 'custom' && (
              <div className="text-vermilion font-bold">¥{option.amount}</div>
            )}
            <div className="text-xs text-muted mt-1">{option.description}</div>
            {option.reward.badge && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-gold/10 rounded-full text-xs text-gold-dark">
                <Gift size={10} />
                {option.reward.badge}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* 自定义金额 */}
      <AnimatePresence>
        {selectedOption?.id === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <label className="text-sm text-light-ink font-serif mb-2 block">
              自定义金额 (¥)
            </label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="请输入金额"
              min="1"
              className="w-full px-4 py-3 bg-paper-dark rounded-xl border border-border-subtle font-serif focus:outline-none focus:border-vermilion"
            />
            <p className="text-xs text-muted mt-2">
              将获得 {parseInt(customAmount) * 10 || 0} 积分奖励
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 支付方式 */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <label className="text-sm text-light-ink font-serif mb-3 block">
            选择支付方式
          </label>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                  ${selectedMethod === method.id 
                    ? 'border-vermilion bg-vermilion/5' 
                    : 'border-border-subtle hover:border-vermilion/30'}
                `}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="flex-1 text-left font-serif text-ink">
                  {method.name}
                </span>
                {selectedMethod === method.id && (
                  <CheckCircle size={20} className="text-vermilion" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 确认按钮 */}
      {selectedOption && selectedMethod && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDonate}
          className="w-full py-3 bg-vermilion text-white rounded-xl font-serif hover:bg-vermilion-dark transition-colors flex items-center justify-center gap-2"
        >
          <Heart size={18} />
          {selectedOption.id === 'custom' 
            ? `打赏 ¥${customAmount || 0}` 
            : `打赏 ¥${selectedOption.amount}`}
        </motion.button>
      )}

      {/* 说明 */}
      <p className="text-xs text-muted text-center mt-4 font-serif">
        打赏是自愿行为，打赏后将获得相应积分奖励
      </p>
    </motion.div>
  );
}

// 悬浮打赏按钮
export function FloatingDonateButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-vermilion to-gold shadow-lg flex items-center justify-center text-white"
    >
      <Heart size={24} className="fill-white" />
    </motion.button>
  );
}

export default DonationSection;
