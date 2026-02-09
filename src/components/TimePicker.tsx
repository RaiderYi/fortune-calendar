// ==========================================
// 自定义时间选择器组件
// ==========================================

import { useState, useEffect, useRef } from 'react';
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
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  // 更新选中时间
  useEffect(() => {
    setSelectedHour(value[0]);
    setSelectedMinute(value[1]);
  }, [value]);

  // 生成小时列表（0-23）
  const generateHours = () => {
    return Array.from({ length: 24 }, (_, i) => i);
  };

  // 生成分钟列表（0-59，每5分钟一个）
  const generateMinutes = () => {
    return Array.from({ length: 12 }, (_, i) => i * 5);
  };

  // 滚动到选中项
  useEffect(() => {
    if (isOpen) {
      // 滚动到选中的小时
      if (hourListRef.current) {
        const hourElement = hourListRef.current.children[selectedHour] as HTMLElement;
        if (hourElement) {
          hourElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      // 滚动到选中的分钟
      if (minuteListRef.current) {
        const minuteIndex = Math.floor(selectedMinute / 5);
        const minuteElement = minuteListRef.current.children[minuteIndex] as HTMLElement;
        if (minuteElement) {
          minuteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [isOpen, selectedHour, selectedMinute]);

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
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] max-h-[70vh] overflow-hidden flex flex-col"
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

            {/* 时间选择区域 */}
            <div className="flex-1 overflow-hidden min-h-0">
              <div className="flex h-full min-h-0">
                {/* 小时选择 */}
                <div
                  className="flex-1 overflow-y-auto min-h-0 touch-pan-y overscroll-contain"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="py-20">
                    <div ref={hourListRef} className="space-y-2 px-4">
                      {generateHours().map((hour) => (
                        <motion.button
                          key={hour}
                          onClick={() => setSelectedHour(hour)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-full py-4 rounded-xl text-lg font-medium transition-colors ${
                            selectedHour === hour
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {String(hour).padStart(2, '0')}时
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 分隔线 */}
                <div className="w-px bg-gray-200 my-4" />

                {/* 分钟选择 */}
                <div
                  className="flex-1 overflow-y-auto min-h-0 touch-pan-y overscroll-contain"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="py-20">
                    <div ref={minuteListRef} className="space-y-2 px-4">
                      {generateMinutes().map((minute) => (
                        <motion.button
                          key={minute}
                          onClick={() => setSelectedMinute(minute)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-full py-4 rounded-xl text-lg font-medium transition-colors ${
                            selectedMinute === minute
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {String(minute).padStart(2, '0')}分
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
