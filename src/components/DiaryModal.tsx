// ==========================================
// 日记编辑弹窗组件
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smile, Frown, Meh, Heart, AlertCircle } from 'lucide-react';
import { saveDiaryEntry, getDiaryEntry, type DiaryEntry } from '../utils/diaryStorage';
import { useToast } from '../contexts/ToastContext';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string; // YYYY-MM-DD
  fortuneScore?: number;
  onSave?: () => void;
}

const MOODS: Array<{ id: DiaryEntry['mood']; label: string; icon: typeof Smile; color: string }> = [
  { id: 'happy', label: '开心', icon: Smile, color: 'text-yellow-500' },
  { id: 'excited', label: '兴奋', icon: Heart, color: 'text-pink-500' },
  { id: 'neutral', label: '平静', icon: Meh, color: 'text-gray-500' },
  { id: 'sad', label: '难过', icon: Frown, color: 'text-blue-500' },
  { id: 'anxious', label: '焦虑', icon: AlertCircle, color: 'text-red-500' },
];

export default function DiaryModal({
  isOpen,
  onClose,
  date,
  fortuneScore,
  onSave,
}: DiaryModalProps) {
  const { showToast } = useToast();
  const [mood, setMood] = useState<DiaryEntry['mood']>('neutral');
  const [events, setEvents] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');
  const [accuracy, setAccuracy] = useState<DiaryEntry['accuracy']>();

  useEffect(() => {
    if (isOpen) {
      // 加载已有日记
      const existing = getDiaryEntry(date);
      if (existing) {
        setMood(existing.mood);
        setEvents(existing.events.length > 0 ? existing.events : ['']);
        setNotes(existing.notes);
        setAccuracy(existing.accuracy);
      } else {
        // 重置为新日记
        setMood('neutral');
        setEvents(['']);
        setNotes('');
        setAccuracy(undefined);
      }
    }
  }, [isOpen, date]);

  const handleAddEvent = () => {
    setEvents([...events, '']);
  };

  const handleEventChange = (index: number, value: string) => {
    const newEvents = [...events];
    newEvents[index] = value;
    setEvents(newEvents.filter(e => e.trim() !== '').length > 0 
      ? newEvents 
      : ['']);
  };

  const handleRemoveEvent = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index);
    setEvents(newEvents.length > 0 ? newEvents : ['']);
  };

  const handleSave = () => {
    const entry: DiaryEntry = {
      date,
      timestamp: Date.now(),
      mood,
      events: events.filter(e => e.trim() !== ''),
      notes: notes.trim(),
      fortuneScore: fortuneScore || 0,
      accuracy,
    };

    saveDiaryEntry(entry);
    showToast('日记已保存', 'success');
    onSave?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 遮罩层 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* 弹窗 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* 头部 */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">记录日记</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-white/90 text-sm">{date}</p>
            {fortuneScore !== undefined && (
              <p className="text-white/80 text-xs mt-1">今日运势: {fortuneScore}分</p>
            )}
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 心情选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                今日心情
              </label>
              <div className="grid grid-cols-5 gap-2">
                {MOODS.map((m) => {
                  const Icon = m.icon;
                  const isSelected = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`p-3 rounded-xl border-2 transition ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={24} className={`mx-auto ${isSelected ? m.color : 'text-gray-400'}`} />
                      <div className={`text-xs mt-1 ${isSelected ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>
                        {m.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 事件记录 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                今日事件
              </label>
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={event}
                      onChange={(e) => handleEventChange(index, e.target.value)}
                      placeholder="记录今天发生的事..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {events.length > 1 && (
                      <button
                        onClick={() => handleRemoveEvent(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddEvent}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition"
                >
                  + 添加事件
                </button>
              </div>
            </div>

            {/* 备注 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                备注
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="记录更多想法..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 预测准确性（如果有运势分数） */}
            {fortuneScore !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  预测准确性
                </label>
                <div className="flex gap-2">
                  {(['accurate', 'neutral', 'inaccurate'] as const).map((acc) => (
                    <button
                      key={acc}
                      onClick={() => setAccuracy(acc === accuracy ? undefined : acc)}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
                        accuracy === acc
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {acc === 'accurate' ? '准确' : acc === 'neutral' ? '一般' : '不准确'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 底部按钮 */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium"
            >
              保存
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
