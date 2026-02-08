// ==========================================
// 人生大图景 - 大运生命曲线组件（弹窗）
// 支持流年详解、重要年份标记、个性化建议
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from './ProfileSettings';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import LifeMapContent from './LifeMapContent';

interface LifeMapProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  /** 点击「去设置」时回调，用于关闭 LifeMap 并跳转到用神设置（如今日页） */
  onOpenYongShenSettings?: () => void;
}

export default function LifeMap({
  isOpen,
  onClose,
  userProfile,
  onOpenYongShenSettings,
}: LifeMapProps) {
  const { t } = useTranslation(['ui', 'fortune']);
  const navigate = useNavigate();
  const { setCurrentDate } = useAppContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col lg:rounded-l-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center gap-3">
                <TrendingUp size={24} />
                <div>
                  <h2 className="text-xl font-bold">{t('ui:lifemap.title')}</h2>
                  <p className="text-sm opacity-90">{t('ui:lifemap.description')}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <LifeMapContent
              userProfile={userProfile}
              onOpenYongShenSettings={onOpenYongShenSettings}
              onViewToday={() => {
                onClose();
                setCurrentDate(new Date());
                navigate('/app/today');
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
