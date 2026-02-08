// ==========================================
// 免责声明 - 首次查看运势时弹出
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const DISCLAIMER_KEY = 'fortune_disclaimer_acknowledged';

export function hasAcknowledgedDisclaimer(): boolean {
  return localStorage.getItem(DISCLAIMER_KEY) === 'true';
}

export function setDisclaimerAcknowledged(): void {
  localStorage.setItem(DISCLAIMER_KEY, 'true');
}

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const { t, i18n } = useTranslation(['ui', 'common']);
  const isEnglish = i18n.language === 'en';

  const handleAcknowledge = () => {
    setDisclaimerAcknowledged();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleAcknowledge}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-[101] max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6"
            role="dialog"
            aria-labelledby="disclaimer-title"
            aria-modal="true"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Info size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2
                  id="disclaimer-title"
                  className="text-lg font-bold text-gray-900 dark:text-white"
                >
                  {isEnglish ? 'Disclaimer' : '免责声明'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isEnglish ? 'Please read before using' : '使用前请阅读'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                {isEnglish
                  ? 'Fortune predictions are for entertainment and reference only. They do not constitute life decision-making advice.'
                  : '运势预测仅供娱乐与参考，不构成人生决策依据。'}
              </p>
              <p>
                {isEnglish
                  ? 'We recommend using them as a reference for self-awareness and planning, not as a substitute for professional advice.'
                  : '建议作为自我认知与规划时的参考，不替代专业建议。'}
              </p>
            </div>

            <Link
              to="/help#disclaimer"
              className="mt-4 inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {isEnglish ? 'View full disclaimer' : '查看完整免责声明'}
            </Link>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAcknowledge}
                className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition"
              >
                {isEnglish ? 'I understand' : '我已知晓'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
