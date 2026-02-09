// ==========================================
// 自定义时间选择器组件 - 双下拉框交互
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';

interface TimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  value: [number, number]; // [hour, minute]
  onSelect: (hour: number, minute: number) => void;
}

export default function TimePicker({
  isOpen,
  onClose,
  value,
  onSelect
}: TimePickerProps) {
  const [selectedHour, setSelectedHour] = useState(value[0]);
  const [selectedMinute, setSelectedMinute] = useState(value[1]);

  // 更新选中时间（分钟取整到 5 的倍数）
  useEffect(() => {
    setSelectedHour(value[0]);
    setSelectedMinute(Math.round(value[1] / 5) * 5);
  }, [value]);

  // 确认选择
  const handleConfirm = () => {
    onSelect(selectedHour, selectedMinute);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 时间选择器 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-indigo-600" />
                <h3 className="text-lg font-bold">选择时间</h3>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </motion.button>
            </div>

            {/* 时间选择区域 - 双下拉框 */}
            <div className="flex gap-3 px-4 py-6">
              <select
                value={String(selectedHour).padStart(2, '0')}
                onChange={(e) => setSelectedHour(Number(e.target.value))}
                className="flex-1 appearance-none bg-gray-100 rounded-xl px-4 py-3 text-lg font-medium border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, '0')}>
                    {i}时
                  </option>
                ))}
              </select>
              <span className="self-center text-2xl font-bold text-gray-400">:</span>
              <select
                value={String(selectedMinute).padStart(2, '0')}
                onChange={(e) => setSelectedMinute(Number(e.target.value))}
                className="flex-1 appearance-none bg-gray-100 rounded-xl px-4 py-3 text-lg font-medium border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
              >
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                  <option key={m} value={String(m).padStart(2, '0')}>
                    {m}分
                  </option>
                ))}
              </select>
            </div>

            {/* 底部按钮 */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-3xl font-bold text-gray-800">
                  {String(selectedHour).padStart(2, '0')}:
                  {String(selectedMinute).padStart(2, '0')}
                </div>
              </div>
              <motion.button
                onClick={handleConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg"
              >
                确认
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
