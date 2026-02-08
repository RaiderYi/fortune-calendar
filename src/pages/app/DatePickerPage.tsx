// ==========================================
// 择日页面 - 根据八字八字推荐吉日
// ==========================================

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Loader2, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

type Purpose = 'moving' | 'opening' | 'travel' | 'romance' | 'wealth' | 'academic' | 'other';

const PURPOSE_DIMENSION: Record<Purpose, string> = {
  moving: 'career',
  opening: 'wealth',
  travel: 'travel',
  romance: 'romance',
  wealth: 'wealth',
  academic: 'academic',
  other: 'overall',
};

interface FortuneResult {
  dateStr: string;
  totalScore: number;
  mainTheme?: { keyword: string; emoji: string };
  dimensions?: { [key: string]: { score?: number } };
}

export default function DatePickerPage() {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const { fetchFortuneForDate, setCurrentDate } = useAppContext();
  const [purpose, setPurpose] = useState<Purpose>('other');
  const [rangeDays, setRangeDays] = useState<7 | 14 | 30>(14);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FortuneResult[]>([]);

  const purposes: { id: Purpose; label: string; labelEn: string }[] = [
    { id: 'moving', label: '搬家', labelEn: 'Moving' },
    { id: 'opening', label: '开业', labelEn: 'Opening' },
    { id: 'travel', label: '出行', labelEn: 'Travel' },
    { id: 'romance', label: '嫁娶', labelEn: 'Wedding' },
    { id: 'wealth', label: '求财', labelEn: 'Wealth' },
    { id: 'academic', label: '考试', labelEn: 'Exam' },
    { id: 'other', label: '其他', labelEn: 'Other' },
  ];

  const getScore = useCallback((item: FortuneResult): number => {
    const dimKey = PURPOSE_DIMENSION[purpose];
    if (dimKey === 'overall') return item.totalScore;
    const dim = item.dimensions?.[dimKey];
    return dim?.score ?? item.totalScore;
  }, [purpose]);

  const handleAnalyze = async () => {
    if (!fetchFortuneForDate) return;
    setIsLoading(true);
    setResults([]);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const list: FortuneResult[] = [];
      for (let i = 0; i < rangeDays; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        try {
          const data = await fetchFortuneForDate(d);
          if (data && data.dateStr) list.push(data);
        } catch {
          // 单日失败不影响整体
        }
      }
      // 按分数降序，同分时按日期升序
      list.sort((a, b) => {
        const sa = getScore(a), sb = getScore(b);
        if (sb !== sa) return sb - sa;
        return (a.dateStr || '').localeCompare(b.dateStr || '');
      });
      setResults(list.slice(0, 10));
    } catch (err) {
      console.error('择日分析失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, d, 12, 0, 0));
    navigate('/app/today');
  };

  const formatDateLabel = (dateStr: string | undefined) => {
    if (!dateStr) return isEnglish ? 'Invalid date' : '日期无效';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return isEnglish ? 'Invalid date' : '日期无效';
    const weekDays = isEnglish ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${dateStr} ${weekDays[d.getDay()] ?? ''}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Calendar size={28} className="text-indigo-500" />
            {isEnglish ? 'Auspicious Date Picker' : '择日'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEnglish ? 'Recommend auspicious dates based on your Bazi' : '根据您的八字推荐吉日'}
          </p>
        </div>

        {/* 用途选择 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {isEnglish ? 'Purpose' : '用途'}
          </label>
          <div className="flex flex-wrap gap-2">
            {purposes.map((p) => (
              <button
                key={p.id}
                onClick={() => setPurpose(p.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  purpose === p.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {isEnglish ? p.labelEn : p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 日期范围 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {isEnglish ? 'Date Range' : '日期范围'}
          </label>
          <div className="flex gap-2">
            {([7, 14, 30] as const).map((days) => (
              <button
                key={days}
                onClick={() => setRangeDays(days)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  rangeDays === days
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {days} {isEnglish ? 'days' : '天'}
              </button>
            ))}
          </div>
        </div>

        {/* 分析按钮 */}
        <motion.button
          onClick={handleAnalyze}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {isEnglish ? 'Analyzing...' : '分析中...'}
            </>
          ) : (
            <>
              <Sparkles size={20} />
              {isEnglish ? 'Analyze Auspicious Dates' : '分析吉日'}
            </>
          )}
        </motion.button>

        {/* 结果列表 */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {isEnglish ? 'Recommended Dates' : '推荐日期'}
            </h2>
            {results.some((r) => getScore(r) === 100) && results.filter((r) => getScore(r) === 100).length > 2 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isEnglish ? 'Same-score dates sorted by date. Consider specific timing for final selection.' : '同分日期按日期排序，可根据具体事宜再择时辰。'}
              </p>
            )}
            <div className="space-y-2">
              {results.filter((item) => item?.dateStr).map((item, idx) => (
                <motion.button
                  key={item.dateStr}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectDate(item.dateStr)}
                  className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-600 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{item.mainTheme?.emoji ?? '📅'}</div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200">{formatDateLabel(item.dateStr)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.mainTheme?.keyword ?? '-'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{getScore(item)}</span>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
