// ==========================================
// 日记条目组件
// 展示单条日记
// ==========================================

import { motion } from 'framer-motion';
import { Smile, Frown, Meh, Heart, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { type DiaryEntry } from '../utils/diaryStorage';

interface DiaryEntryProps {
  entry: DiaryEntry;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MOOD_ICONS = {
  happy: Smile,
  excited: Heart,
  neutral: Meh,
  sad: Frown,
  anxious: AlertCircle,
};

const MOOD_COLORS = {
  happy: 'text-yellow-500',
  excited: 'text-pink-500',
  neutral: 'text-gray-500',
  sad: 'text-blue-500',
  anxious: 'text-red-500',
};

export default function DiaryEntryComponent({ entry, onEdit, onDelete }: DiaryEntryProps) {
  const MoodIcon = MOOD_ICONS[entry.mood];
  const moodColor = MOOD_COLORS[entry.mood];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
    >
      <div className="flex items-start gap-4">
        {/* 心情图标 */}
        <div className={`flex-shrink-0 ${moodColor}`}>
          <MoodIcon size={32} />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {entry.date}
            </div>
            {entry.fortuneScore > 0 && (
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                运势: {entry.fortuneScore}分
              </div>
            )}
          </div>

          {/* 事件列表 */}
          {entry.events.length > 0 && (
            <div className="mb-2">
              {entry.events.map((event, index) => (
                <div key={index} className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                  • {event}
                </div>
              ))}
            </div>
          )}

          {/* 备注 */}
          {entry.notes && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {entry.notes}
            </p>
          )}

          {/* 准确性标记 */}
          {entry.accuracy && (
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
              entry.accuracy === 'accurate'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : entry.accuracy === 'inaccurate'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {entry.accuracy === 'accurate' ? '✓ 准确' :
               entry.accuracy === 'inaccurate' ? '✗ 不准确' : '○ 一般'}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        {(onEdit || onDelete) && (
          <div className="flex-shrink-0 flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
              >
                <Edit size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
