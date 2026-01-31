// ==========================================
// 每日签到弹窗组件
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Award, Sparkles } from 'lucide-react';
import {
  checkIn,
  isCheckedInToday,
  getCheckinStats,
  getCheckinReward,
  getCheckinCalendar,
  type CheckinRecord,
} from '../utils/checkinStorage';
import { useToast } from '../contexts/ToastContext';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckinSuccess?: (record: CheckinRecord) => void;
}

export default function CheckinModal({
  isOpen,
  onClose,
  onCheckinSuccess,
}: CheckinModalProps) {
  const { showToast } = useToast();
  const [stats, setStats] = useState(getCheckinStats());
  const [calendar, setCalendar] = useState(getCheckinCalendar());
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkinResult, setCheckinResult] = useState<CheckinRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStats(getCheckinStats());
      setCalendar(getCheckinCalendar());
    }
  }, [isOpen]);

  const handleCheckIn = () => {
    if (isCheckedInToday() || isCheckingIn) return;

    setIsCheckingIn(true);
    const result = checkIn();
    
    setTimeout(() => {
      setIsCheckingIn(false);
      if (result) {
        setCheckinResult(result);
        setStats(getCheckinStats());
        setCalendar(getCheckinCalendar());
        onCheckinSuccess?.(result);
        showToast(`签到成功！已连续签到 ${result.consecutiveDays} 天`, 'success');
      }
    }, 500);
  };

  const reward = checkinResult ? getCheckinReward(checkinResult.consecutiveDays) : null;
  const alreadyCheckedIn = isCheckedInToday();

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
            className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 签到弹窗 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden">
              {/* 头部 */}
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
                >
                  <X size={20} className="text-white" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">每日签到</h2>
                    <p className="text-white/90 text-sm">坚持签到，解锁更多奖励</p>
                  </div>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-6 space-y-6">
                {/* 签到状态 */}
                {checkinResult ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-4"
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      签到成功！
                    </h3>
                    <p className="text-gray-600 mb-4">
                      已连续签到 <span className="text-indigo-600 font-bold text-2xl">{checkinResult.consecutiveDays}</span> 天
                    </p>
                    {reward && (
                      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-yellow-300">
                        <div className="text-4xl mb-2">{reward.badge}</div>
                        <div className="font-bold text-gray-800">{reward.name}</div>
                      </div>
                    )}
                  </motion.div>
                ) : alreadyCheckedIn ? (
                  <div className="text-center py-4">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      今日已签到
                    </h3>
                    <p className="text-gray-600">
                      已连续签到 <span className="text-indigo-600 font-bold text-xl">{stats.consecutiveDays}</span> 天
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      点击签到
                    </h3>
                    <p className="text-gray-600 mb-4">
                      当前连续签到 <span className="text-indigo-600 font-bold text-xl">{stats.consecutiveDays}</span> 天
                    </p>
                    <motion.button
                      onClick={handleCheckIn}
                      disabled={isCheckingIn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50"
                    >
                      {isCheckingIn ? '签到中...' : '立即签到'}
                    </motion.button>
                  </div>
                )}

                {/* 签到统计 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{stats.totalDays}</div>
                    <div className="text-xs text-gray-500 mt-1">总签到</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.consecutiveDays}</div>
                    <div className="text-xs text-gray-500 mt-1">连续签到</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.longestStreak}</div>
                    <div className="text-xs text-gray-500 mt-1">最长记录</div>
                  </div>
                </div>

                {/* 签到日历 */}
                <div>
                  <h4 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
                    <Calendar size={16} />
                    最近30天
                  </h4>
                  <div className="grid grid-cols-7 gap-1">
                    {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                      <div key={day} className="text-center text-xs font-bold text-gray-400 py-1">
                        {day}
                      </div>
                    ))}
                    {calendar.map((item) => (
                      <div
                        key={item.date}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                          item.checked
                            ? 'bg-indigo-600 text-white font-bold'
                            : item.isToday
                            ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-400'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {new Date(item.date).getDate()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
