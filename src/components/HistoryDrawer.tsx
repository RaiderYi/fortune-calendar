import { X, Clock, TrendingUp, Trash2 } from 'lucide-react';
import { getHistory, clearHistory, formatHistoryDate, getHistoryStats, HistoryRecord } from '../utils/historyStorage';
import { useState, useEffect } from 'react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

export default function HistoryDrawer({ isOpen, onClose, onSelectDate }: HistoryDrawerProps) {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getHistoryStats>>(null);

  // 加载历史记录
  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
      setStats(getHistoryStats());
    }
  }, [isOpen]);

  // 清除所有历史
  const handleClearAll = () => {
    if (confirm('确定要清除所有历史记录吗？')) {
      clearHistory();
      setHistory([]);
      setStats(null);
    }
  };

  // 选择日期
  const handleSelectDate = (dateStr: string) => {
    // 修复：使用本地时区创建日期，避免时区偏移
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0); // 使用中午12点，避免跨日期问题
    onSelectDate(date);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 抽屉 */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={24} />
              <h2 className="text-xl font-bold">历史记录</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* 统计信息 */}
          {stats && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
                <div className="text-2xl font-black">{stats.total}</div>
                <div className="text-xs opacity-90 mt-1">查询次数</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
                <div className="text-2xl font-black">{stats.avgScore}</div>
                <div className="text-xs opacity-90 mt-1">平均分</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
                <div className="text-2xl font-black">{stats.maxRecord.fortune.totalScore}</div>
                <div className="text-xs opacity-90 mt-1">最高分</div>
              </div>
            </div>
          )}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <Clock size={48} className="opacity-30" />
              <p className="text-sm">暂无历史记录</p>
              <p className="text-xs">查询运势后会自动保存</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record, index) => (
                <button
                  key={`${record.date}-${index}`}
                  onClick={() => handleSelectDate(record.date)}
                  className="w-full bg-white border border-gray-200 rounded-2xl p-4 hover:border-indigo-400 hover:shadow-md transition text-left group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-gray-800 text-lg mb-1">
                        {formatHistoryDate(record.date)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {record.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-indigo-600">
                        {record.fortune.totalScore}
                      </div>
                      <div className="text-xs text-gray-400">分</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{record.fortune.mainTheme.emoji}</span>
                    <span className="font-bold text-gray-700 text-sm">
                      {record.fortune.mainTheme.keyword}
                    </span>
                  </div>

                  {/* 六维度迷你图 */}
                  <div className="grid grid-cols-6 gap-1">
                    {Object.entries(record.fortune.dimensions).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div 
                          className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mb-1"
                          style={{ width: `${value.score}%` }}
                        />
                        <div className="text-[8px] text-gray-400">
                          {value.score}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-indigo-600 opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                    <TrendingUp size={12} />
                    点击查看详情
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 底部操作 */}
        {history.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleClearAll}
              className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              清除所有历史
            </button>
          </div>
        )}
      </div>
    </>
  );
}
