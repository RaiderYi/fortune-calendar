// ==========================================
// 任务面板组件
// 展示和管理运势任务
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Circle, Trophy, Sparkles, Target } from 'lucide-react';
import {
  getAllTasks,
  getTodayTasks,
  getWeeklyTasks,
  getMonthlyTasks,
  updateTaskProgress,
  getTaskCompletionRate,
  type Task,
} from '../utils/taskStorage';
import { useToast } from '../contexts/ToastContext';
import TaskReward from './TaskReward';

interface TaskPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TaskFilter = 'all' | 'daily' | 'weekly' | 'monthly';

export default function TaskPanel({ isOpen, onClose }: TaskPanelProps) {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showReward, setShowReward] = useState<{ task: Task; reward: any } | null>(null);

  useEffect(() => {
    if (isOpen) {
      refreshTasks();
    }
  }, [isOpen, filter]);

  const refreshTasks = () => {
    let filteredTasks: Task[] = [];
    switch (filter) {
      case 'daily':
        filteredTasks = getTodayTasks();
        break;
      case 'weekly':
        filteredTasks = getWeeklyTasks();
        break;
      case 'monthly':
        filteredTasks = getMonthlyTasks();
        break;
      default:
        filteredTasks = getAllTasks();
    }
    setTasks(filteredTasks);
  };

  const handleTaskComplete = (taskId: string) => {
    const result = updateTaskProgress(taskId, 1);
    refreshTasks();

    if (result.completed && result.task) {
      setShowReward({
        task: result.task,
        reward: result.task.reward,
      });
      showToast(`任务完成！获得奖励`, 'success');
    }
  };

  const getCompletionRate = () => {
    return getTaskCompletionRate(filter === 'all' ? undefined : filter);
  };

  const getFilteredTasks = () => {
    return tasks;
  };

  if (!isOpen) return null;

  const completionRate = getCompletionRate();
  const filteredTasks = getFilteredTasks();

  return (
    <>
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

          {/* 任务面板 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* 头部 */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">运势任务</h2>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Target size={16} />
                    <span>完成率: {completionRate}%</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 筛选器 */}
              <div className="flex gap-2">
                {(['all', 'daily', 'weekly', 'monthly'] as TaskFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filter === f
                        ? 'bg-white text-indigo-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {f === 'all' ? '全部' : f === 'daily' ? '每日' : f === 'weekly' ? '每周' : '每月'}
                  </button>
                ))}
              </div>
            </div>

            {/* 任务列表 */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Trophy size={48} className="mx-auto mb-4 opacity-50" />
                  <p>暂无任务</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => {
                    const isCompleted = task.progress >= task.target;
                    const progressPercent = Math.min((task.progress / task.target) * 100, 100);

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border-2 transition ${
                          isCompleted
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* 完成状态图标 */}
                          <div className="flex-shrink-0 mt-1">
                            {isCompleted ? (
                              <CheckCircle2
                                size={24}
                                className="text-green-600 dark:text-green-400"
                              />
                            ) : (
                              <Circle size={24} className="text-gray-400" />
                            )}
                          </div>

                          {/* 任务内容 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3
                                className={`font-bold ${
                                  isCompleted
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-gray-900 dark:text-gray-100'
                                }`}
                              >
                                {task.title}
                              </h3>
                              {task.reward.type === 'badge' && (
                                <Trophy
                                  size={18}
                                  className="text-yellow-500 flex-shrink-0"
                                />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {task.description}
                            </p>

                            {/* 进度条 */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                <span>
                                  进度: {task.progress} / {task.target}
                                </span>
                                <span>{Math.round(progressPercent)}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressPercent}%` }}
                                  className={`h-full ${
                                    isCompleted
                                      ? 'bg-green-500'
                                      : 'bg-indigo-500'
                                  }`}
                                />
                              </div>
                            </div>

                            {/* 奖励信息 */}
                            <div className="flex items-center gap-2 text-xs">
                              <Sparkles size={14} className="text-yellow-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                奖励:{' '}
                                {task.reward.type === 'points'
                                  ? `${task.reward.value} 积分`
                                  : task.reward.type === 'badge'
                                  ? `徽章: ${task.reward.value}`
                                  : task.reward.type === 'theme'
                                  ? `主题: ${task.reward.value}`
                                  : '解锁功能'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* 奖励弹窗 */}
      {showReward && (
        <TaskReward
          task={showReward.task}
          reward={showReward.reward}
          onClose={() => setShowReward(null)}
        />
      )}
    </>
  );
}
