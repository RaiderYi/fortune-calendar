// ==========================================
// 联系我们模态框组件
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Copy, Check, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t, i18n } = useTranslation('ui');
  const [copied, setCopied] = useState(false);
  const email = 'bazirili@foxmail.com';
  const isEnglish = i18n.language === 'en';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      // 降级方案：使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = email;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('降级复制也失败:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleMailto = () => {
    const subject = isEnglish ? 'Inquiry' : '咨询';
    const body = isEnglish 
      ? 'Hello, I would like to inquire about Bazi fortune telling.' 
      : '您好，我想咨询关于八字命理的问题。';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm"
          />

          {/* 模态框 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden"
            >
              {/* 头部 */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{t('contact.title')}</h2>
                      <p className="text-white/80 text-sm mt-1">{t('contact.description')}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* 内容 */}
              <div className="p-6 space-y-4">
                {/* 邮箱展示 */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 border-2 border-dashed border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('contact.email')}</div>
                      <div className="text-lg font-mono font-semibold text-gray-800 dark:text-gray-200 break-all">
                        {email}
                      </div>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className={`flex-shrink-0 p-3 rounded-xl transition-all ${
                        copied
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                      }`}
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-2"
                    >
                      <Check size={16} />
                      {t('contact.copied')}
                    </motion.div>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="space-y-3">
                  <motion.button
                    onClick={handleMailto}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl p-4 font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <MessageCircle size={20} />
                    {t('contact.sendEmail')}
                  </motion.button>

                  <button
                    onClick={handleCopyEmail}
                    className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl p-4 font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Copy size={18} />
                    {copied ? t('contact.copied') : t('contact.copyEmail')}
                  </button>
                </div>

                {/* 提示信息 */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                    💡 <strong>{isEnglish ? 'Tip:' : '温馨提示：'}</strong>
                    {isEnglish 
                      ? ' If you have any questions, suggestions, or business inquiries, feel free to contact us via email. We will reply as soon as possible.'
                      : '如果您有任何问题、建议或合作意向，欢迎通过邮箱与我们联系。我们会在收到邮件后尽快回复您。'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
