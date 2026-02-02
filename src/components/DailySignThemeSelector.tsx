// ==========================================
// 日签主题选择器组件
// ==========================================

import { motion } from 'framer-motion';
import { Palette, Sparkles, Minus, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type DailySignTheme = 'zen' | 'minimal' | 'oracle';

interface DailySignThemeSelectorProps {
  selectedTheme: DailySignTheme;
  onThemeChange: (theme: DailySignTheme) => void;
  onClose: () => void;
}

export default function DailySignThemeSelector({
  selectedTheme,
  onThemeChange,
  onClose,
}: DailySignThemeSelectorProps) {
  const { t, i18n } = useTranslation(['ui']);
  const isEnglish = i18n.language === 'en';
  
  const themes: Array<{ id: DailySignTheme; label: string; icon: React.ReactNode; description: string; preview: string }> = [
    {
      id: 'zen',
      label: t('ui:dailySignThemes.zen'),
      icon: <Palette size={20} />,
      description: isEnglish ? 'Calligraphy font, ink & wash style' : '书法字体、水墨留白',
      preview: isEnglish ? '🎨 Traditional' : '🎨 传统雅致',
    },
    {
      id: 'minimal',
      label: t('ui:dailySignThemes.minimal'),
      icon: <Minus size={20} />,
      description: isEnglish ? 'Solid colors, precise data' : '纯色背景、精准数据',
      preview: isEnglish ? '📊 Modern' : '📊 现代简约',
    },
    {
      id: 'oracle',
      label: t('ui:dailySignThemes.oracle'),
      icon: <Zap size={20} />,
      description: isEnglish ? 'Mystical style, tarot feel' : '神秘风格、塔罗牌感',
      preview: isEnglish ? '🔮 Mystical' : '🔮 神秘力量',
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 z-50 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-indigo-500" />
          <h3 className="font-bold text-gray-800 dark:text-gray-200">{isEnglish ? 'Choose Sign Style' : '选择日签风格'}</h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <motion.button
              key={theme.id}
              onClick={() => {
                onThemeChange(theme.id);
                onClose();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border-2 transition ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`mb-2 flex justify-center ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {theme.icon}
              </div>
              <div className={`text-sm font-bold mb-1 ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                {theme.label}
              </div>
              <div className={`text-xs ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-500'}`}>
                {theme.preview}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
