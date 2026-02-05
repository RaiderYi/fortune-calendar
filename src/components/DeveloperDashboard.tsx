// ==========================================
// 开发者统计仪表板
// 展示用户登录和使用情况统计
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Users, TrendingUp, Activity, Clock, BarChart3, Download } from 'lucide-react';

interface DeveloperDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsData {
  date: string;
  dailyActiveUsers: number;
  newUsers: number;
  featureUsage: Record<string, number>;
  averageSessionDuration: number;
  loginCount: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export default function DeveloperDashboard({
  isOpen,
  onClose,
}: DeveloperDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AnalyticsData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen, selectedDate]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/stats?start=${selectedDate}&end=${selectedDate}`
      );
      const result = await response.json();
      if (result.success) {
        setStats(Array.isArray(result.data) ? result.data : [result.data]);
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayStats = stats[0] || {
    dailyActiveUsers: 0,
    newUsers: 0,
    featureUsage: {},
    averageSessionDuration: 0,
    loginCount: 0,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩层 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* 仪表板面板 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">开发者统计仪表板</h2>
              <p className="text-white/90 text-sm">用户登录和使用情况分析</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* 日期选择 */}
          <div className="flex items-center gap-4">
            <label className="text-white/90 text-sm">选择日期:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">加载中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* 日活用户 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users size={24} className="text-blue-600 dark:text-blue-400" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">日活用户</div>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {todayStats.dailyActiveUsers}
                </div>
              </div>

              {/* 新用户 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">新用户</div>
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {todayStats.newUsers}
                </div>
              </div>

              {/* 登录次数 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity size={24} className="text-purple-600 dark:text-purple-400" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">登录次数</div>
                </div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {todayStats.loginCount}
                </div>
              </div>

              {/* 平均会话时长 */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={24} className="text-orange-600 dark:text-orange-400" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">平均会话时长</div>
                </div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(todayStats.averageSessionDuration / 60)} 分钟
                </div>
              </div>
            </div>
          )}

          {/* 功能使用统计 */}
          {Object.keys(todayStats.featureUsage || {}).length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-600" />
                功能使用统计
              </h3>
              <div className="space-y-3">
                {Object.entries(todayStats.featureUsage).map(([feature, count]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{feature}</div>
                    <div className="flex items-center gap-3 flex-1 mx-4">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min((count / 100) * 100, 100)}%`,
                          }}
                          className="h-full bg-indigo-500"
                        />
                      </div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300 w-12 text-right">
                        {count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 提示信息 */}
          {Object.keys(todayStats.featureUsage || {}).length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
              <p>暂无统计数据</p>
              <p className="text-sm mt-2">数据会在用户使用应用时自动收集</p>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
          <button
            onClick={loadStats}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium flex items-center justify-center gap-2"
          >
            <Activity size={18} />
            刷新数据
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium"
          >
            关闭
          </button>
        </div>
      </motion.div>
    </div>
  );
}
