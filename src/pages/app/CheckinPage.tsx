// ==========================================
// 每日签到 - 功能页
// ==========================================

import { Link } from 'react-router-dom';
import { Calendar, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  checkIn,
  isCheckedInToday,
  getCheckinStats,
  getCheckinReward,
  getCheckinCalendar,
} from '../../utils/checkinStorage';
import { useToast } from '../../contexts/ToastContext';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

export default function CheckinPage() {
  const { t, i18n } = useTranslation(['ui']);
  const isEnglish = i18n.language === 'en';
  const { showToast } = useToast();
  const { onCheckinSuccess } = useAppContext();
  const [stats, setStats] = useState(getCheckinStats());
  const [calendar, setCalendar] = useState(getCheckinCalendar());
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkinResult, setCheckinResult] = useState<ReturnType<typeof checkIn> | null>(null);

  useEffect(() => {
    setStats(getCheckinStats());
    setCalendar(getCheckinCalendar());
  }, []);

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
        showToast(`${t('ui:checkin.checkinNow')}! ${result.consecutiveDays} ${t('ui:checkin.days')}`, 'success');
      }
    }, 500);
  };

  const reward = checkinResult ? getCheckinReward(checkinResult.consecutiveDays) : null;
  const alreadyCheckedIn = isCheckedInToday();
  const weekDays = (t('ui:calendar.weekDays', { returnObjects: true }) as string[]) || ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F7] dark:bg-slate-900">
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/app/today" className="p-2 hover:bg-white/20 rounded-full transition" aria-label={isEnglish ? 'Back' : '返回'}>
            <ChevronLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
              <Calendar size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{isEnglish ? 'Daily Check-in' : '每日签到'}</h2>
              <p className="text-white/90 text-sm">{isEnglish ? 'Keep checking in for rewards' : '坚持签到，解锁更多奖励'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          {checkinResult ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-4">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{isEnglish ? 'Check-in success!' : '签到成功！'}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isEnglish ? 'Consecutive' : '已连续签到'}{' '}
                <span className="text-indigo-600 font-bold text-2xl">{checkinResult.consecutiveDays}</span> {isEnglish ? 'days' : '天'}
              </p>
              {reward && (
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl p-4 border-2 border-yellow-300 dark:border-yellow-700">
                  <div className="text-4xl mb-2">{reward.badge}</div>
                  <div className="font-bold text-gray-800 dark:text-gray-200">{reward.name}</div>
                </div>
              )}
            </motion.div>
          ) : alreadyCheckedIn ? (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{isEnglish ? 'Already checked in today' : '今日已签到'}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isEnglish ? 'Consecutive' : '已连续签到'}{' '}
                <span className="text-indigo-600 font-bold text-xl">{stats.consecutiveDays}</span> {isEnglish ? 'days' : '天'}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{isEnglish ? 'Tap to check in' : '点击签到'}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isEnglish ? 'Current streak' : '当前连续签到'}{' '}
                <span className="text-indigo-600 font-bold text-xl">{stats.consecutiveDays}</span> {isEnglish ? 'days' : '天'}
              </p>
              <motion.button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50"
              >
                {isCheckingIn ? t('ui:checkin.checkingIn') : t('ui:checkin.checkinNow')}
              </motion.button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalDays}</div>
              <div className="text-xs text-gray-500 mt-1">{isEnglish ? 'Total' : '总签到'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.consecutiveDays}</div>
              <div className="text-xs text-gray-500 mt-1">{isEnglish ? 'Streak' : '连续签到'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.longestStreak}</div>
              <div className="text-xs text-gray-500 mt-1">{isEnglish ? 'Longest' : '最长记录'}</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
              <Calendar size={16} />
              {isEnglish ? 'Last 30 days' : '最近30天'}
            </h4>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
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
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 border-2 border-indigo-400'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-400'
                  }`}
                >
                  {new Date(item.date).getDate()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
