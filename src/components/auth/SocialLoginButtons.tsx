// ==========================================
// 社交登录按钮组
// Social Login Buttons
// ==========================================

import { motion } from 'framer-motion';
import { useState } from 'react';

interface SocialLoginButtonsProps {
  onLogin: (provider: 'wechat' | 'qq' | 'weibo' | 'github' | 'google') => Promise<void>;
  disabled?: boolean;
}

const providers = [
  { id: 'wechat' as const, name: '微信', icon: '💬', color: '#07C160', bgColor: 'bg-[#07C160]/10', textColor: 'text-[#07C160]' },
  { id: 'qq' as const, name: 'QQ', icon: '🐧', color: '#12B7F5', bgColor: 'bg-[#12B7F5]/10', textColor: 'text-[#12B7F5]' },
  { id: 'weibo' as const, name: '微博', icon: '📱', color: '#E6162D', bgColor: 'bg-[#E6162D]/10', textColor: 'text-[#E6162D]' },
  { id: 'github' as const, name: 'GitHub', icon: '🐙', color: '#333', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
  { id: 'google' as const, name: 'Google', icon: '🔍', color: '#4285F4', bgColor: 'bg-[#4285F4]/10', textColor: 'text-[#4285F4]' },
];

export function SocialLoginButtons({ onLogin, disabled }: SocialLoginButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleClick = async (providerId: typeof providers[number]['id']) => {
    if (disabled || loading) return;
    
    setLoading(providerId);
    try {
      await onLogin(providerId);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-light-ink font-serif">或</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {providers.map((provider) => (
          <motion.button
            key={provider.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(provider.id)}
            disabled={disabled || loading !== null}
            className={`
              flex flex-col items-center justify-center p-3 rounded-xl
              transition-colors duration-200
              ${provider.bgColor} ${provider.textColor}
              ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
            `}
          >
            {loading === provider.id ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-xl">{provider.icon}</span>
            )}
            <span className="text-xs mt-1 font-serif">{provider.name}</span>
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-muted text-center font-serif">
        登录即表示同意服务条款和隐私政策
      </p>
    </div>
  );
}

// 邀请码输入
interface InviteCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (valid: boolean, message?: string) => void;
  disabled?: boolean;
}

export function InviteCodeInput({ value, onChange, onValidate, disabled }: InviteCodeInputProps) {
  const [validating, setValidating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState('');

  const validateCode = async (code: string) => {
    if (!code || code.length < 4) {
      setStatus('idle');
      onValidate?.(false);
      return;
    }

    setValidating(true);
    
    // 模拟验证API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟验证结果
    const validCodes = ['WELCOME', 'FRIEND', 'VIP2024'];
    const isValid = validCodes.includes(code.toUpperCase());
    
    if (isValid) {
      setStatus('valid');
      setMessage('邀请码有效！注册后可获得额外奖励');
      onValidate?.(true, '邀请码有效');
    } else {
      setStatus('invalid');
      setMessage('邀请码无效或已过期');
      onValidate?.(false, '邀请码无效');
    }
    
    setValidating(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-light-ink font-serif">邀请码（选填）</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value.toUpperCase().slice(0, 10);
            onChange(newValue);
            validateCode(newValue);
          }}
          placeholder="输入好友邀请码"
          disabled={disabled || validating}
          className={`
            w-full px-4 py-3 bg-paper-dark rounded-xl border font-serif
            placeholder:text-muted focus:outline-none transition-colors
            ${status === 'valid' ? 'border-green-500 text-green-700' : ''}
            ${status === 'invalid' ? 'border-red-400 text-red-600' : 'border-border-subtle'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {validating ? (
            <div className="w-5 h-5 border-2 border-vermilion border-t-transparent rounded-full animate-spin" />
          ) : status === 'valid' ? (
            <span className="text-green-500 text-xl">✓</span>
          ) : status === 'invalid' ? (
            <span className="text-red-400 text-xl">✕</span>
          ) : null}
        </div>
      </div>
      {message && (
        <p className={`text-xs font-serif ${status === 'valid' ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
