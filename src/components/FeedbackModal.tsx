// ==========================================
// 准确性反馈弹窗组件
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, HelpCircle, Star, TrendingUp } from 'lucide-react';
import {
  saveFeedback,
  getFeedbackByDate,
  getFeedbackStats,
  type FeedbackRecord,
} from '../utils/feedbackStorage';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string; // YYYY-MM-DD
  onFeedbackSubmit?: () => void;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  date,
  onFeedbackSubmit,
}: FeedbackModalProps) {
  const [selectedAccuracy, setSelectedAccuracy] = useState<'accurate' | 'inaccurate' | 'partial' | null>(null);
  const [comment, setComment] = useState('');
  const [stats, setStats] = useState(getFeedbackStats());
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 检查是否已有反馈
      const existing = getFeedbackByDate(date);
      if (existing) {
        setSelectedAccuracy(existing.accuracy);
        setComment(existing.comment || '');
        setSubmitted(true);
      } else {
        setSelectedAccuracy(null);
        setComment('');
        setSubmitted(false);
      }
      setStats(getFeedbackStats());
    }
  }, [isOpen, date]);

  const handleSubmit = () => {
    if (!selectedAccuracy) return;

    const feedback: FeedbackRecord = {
      date,
      timestamp: Date.now(),
      accuracy: selectedAccuracy,
      comment: comment.trim() || undefined,
    };

    saveFeedback(feedback);
    setSubmitted(true);
    setStats(getFeedbackStats());
    onFeedbackSubmit?.();
    
    // 更新成就（反馈相关）
    try {
      const { updateAchievements } = require('../utils/achievementStorage');
      const feedbacks = require('../utils/feedbackStorage').getAllFeedbacks();
      updateAchievements({
        feedback_10: feedbacks.length,
      });
    } catch (error) {
      console.error('更新成就失败:', error);
    }
  };

  const handleDelete = () => {
    const { deleteFeedback } = require('../utils/feedbackStorage');
    deleteFeedback(date);
    setSelectedAccuracy(null);
    setComment('');
    setSubmitted(false);
    setStats(getFeedbackStats());
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
            className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 反馈弹窗 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden">
              {/* 头部 */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">反馈准确度</h2>
                      <p className="text-white/90 text-sm">{date}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/20 rounded-full transition"
                  >
                    <X size={20} className="text-white" />
                  </motion.button>
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs opacity-90 mt-1">总反馈</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold">{stats.accuracyRate}%</div>
                    <div className="text-xs opacity-90 mt-1">准确率</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold">{stats.accurate}</div>
                    <div className="text-xs opacity-90 mt-1">准确</div>
                  </div>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-6 space-y-4">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      感谢您的反馈！
                    </h3>
                    <p className="text-gray-600 mb-4">
                      您的反馈将帮助我们不断优化算法
                    </p>
                    <motion.button
                      onClick={handleDelete}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      重新反馈
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 mb-3">
                        今日运势是否准确？
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <motion.button
                          onClick={() => setSelectedAccuracy('accurate')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedAccuracy === 'accurate'
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          <ThumbsUp size={24} className="mx-auto mb-2" />
                          <div className="text-sm font-bold">准确</div>
                        </motion.button>
                        <motion.button
                          onClick={() => setSelectedAccuracy('partial')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedAccuracy === 'partial'
                              ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          <HelpCircle size={24} className="mx-auto mb-2" />
                          <div className="text-sm font-bold">部分</div>
                        </motion.button>
                        <motion.button
                          onClick={() => setSelectedAccuracy('inaccurate')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedAccuracy === 'inaccurate'
                              ? 'bg-red-50 border-red-500 text-red-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          <ThumbsDown size={24} className="mx-auto mb-2" />
                          <div className="text-sm font-bold">不准确</div>
                        </motion.button>
                      </div>
                    </div>

                    {/* 评论输入 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">
                        补充说明（可选）
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="告诉我们更多细节..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                        rows={3}
                      />
                    </div>

                    {/* 提交按钮 */}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!selectedAccuracy}
                      whileHover={{ scale: selectedAccuracy ? 1.02 : 1 }}
                      whileTap={{ scale: selectedAccuracy ? 0.98 : 1 }}
                      className={`w-full py-3 rounded-xl font-bold transition ${
                        selectedAccuracy
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      提交反馈
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
