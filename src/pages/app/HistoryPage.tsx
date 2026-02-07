// ==========================================
// 历史记录 - 功能页
// ==========================================

import { Link, useNavigate } from 'react-router-dom';
import { Clock, Trash2, BarChart3, ChevronLeft } from 'lucide-react';
import { getHistory, clearHistory, formatHistoryDate, getHistoryStats, HistoryRecord } from '../../utils/historyStorage';
import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { updateAchievementProgress } from '../../utils/achievementStorage';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

function HistoryPage() {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const { setCurrentDate, onCompareClick } = useAppContext();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getHistoryStats>>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: history.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 3,
  });

  useEffect(() => {
    setHistory(getHistory());
    setStats(getHistoryStats());
    const viewCount = parseInt(localStorage.getItem('history_view_count') || '0') + 1;
    localStorage.setItem('history_view_count', viewCount.toString());
    updateAchievementProgress('history_clear', viewCount);
  }, []);

  const handleClearAll = useCallback(() => {
    if (confirm(isEnglish ? 'Clear all history?' : '确定要清除所有历史记录吗？')) {
      clearHistory();
      setHistory([]);
      setStats(null);
    }
  }, [isEnglish]);

  const handleSelectDate = useCallback(
    (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day, 12, 0, 0);
      setCurrentDate(date);
      navigate('/app/today');
    },
    [setCurrentDate, navigate]
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* 头部 */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Link
            to="/app/today"
            className="p-2 hover:bg-white/20 rounded-full transition"
            aria-label={isEnglish ? 'Back' : '返回'}
          >
            <ChevronLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <Clock size={24} />
            <h2 className="text-xl font-bold">{isEnglish ? 'History' : '历史记录'}</h2>
          </div>
        </div>
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
              <div className="text-2xl font-black">{stats.total}</div>
              <div className="text-xs opacity-90 mt-1">{isEnglish ? 'Queries' : '查询次数'}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
              <div className="text-2xl font-black">{stats.avgScore}</div>
              <div className="text-xs opacity-90 mt-1">{isEnglish ? 'Avg Score' : '平均分'}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
              <div className="text-2xl font-black">{stats.maxRecord.fortune.totalScore}</div>
              <div className="text-xs opacity-90 mt-1">{isEnglish ? 'Best' : '最高分'}</div>
            </div>
          </div>
        )}
      </div>

      {/* 内容 */}
      <div ref={parentRef} className="flex-1 overflow-y-auto p-4 bg-[#F5F5F7] dark:bg-slate-900">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400 gap-3">
            <Clock size={48} className="opacity-30" />
            <p className="text-sm">{isEnglish ? 'No history yet' : '暂无历史记录'}</p>
            <p className="text-xs">{isEnglish ? 'History is saved when you query fortune' : '查询运势后会自动保存'}</p>
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const record = history[virtualRow.index];
              return (
                <div
                  key={`${record.date}-${virtualRow.index}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="pb-3"
                >
                  <HistoryItem record={record} onSelect={handleSelectDate} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 底部 */}
      {history.length > 0 && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-slate-700 space-y-2 bg-white dark:bg-slate-800/50">
          {onCompareClick && (
            <button
              onClick={() => {
                onCompareClick();
                navigate('/app/today');
              }}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              <BarChart3 size={18} />
              {isEnglish ? 'Compare Fortune' : '运势对比'}
            </button>
          )}
          <button
            onClick={handleClearAll}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            {isEnglish ? 'Clear All' : '清除所有历史'}
          </button>
        </div>
      )}
    </div>
  );
}

const HistoryItem = memo(function HistoryItem({
  record,
  onSelect,
}: {
  record: HistoryRecord;
  onSelect: (dateStr: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(record.date)}
      className="w-full h-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 hover:border-indigo-400 hover:shadow-md transition text-left group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-1">
            {formatHistoryDate(record.date)}
          </div>
          <div className="text-xs text-gray-400">{record.date}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {record.fortune.totalScore}
          </div>
          <div className="text-xs text-gray-400">分</div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{record.fortune.mainTheme.emoji}</span>
        <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
          {record.fortune.mainTheme.keyword}
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1">
        {Object.entries(record.fortune.dimensions).map(([key, value]) => (
          <div key={key} className="text-center">
            <div
              className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mb-1"
              style={{ width: `${value.score}%` }}
            />
            <div className="text-[8px] text-gray-400">{value.score}</div>
          </div>
        ))}
      </div>
    </button>
  );
});

export default HistoryPage;
