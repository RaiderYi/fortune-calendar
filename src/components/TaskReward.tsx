// ==========================================
// 任务奖励组件
// 展示任务完成奖励动画
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X } from 'lucide-react';
import { Task } from '../utils/taskStorage';

interface TaskRewardProps {
  task: Task;
  reward: any;
  onClose: () => void;
}

export default function TaskReward({ task, reward, onClose }: TaskRewardProps) {
  const getRewardIcon = () => {
    switch (reward.type) {
      case 'badge':
        return <Trophy size={64} className="text-yellow-500" />;
      case 'points':
        return <Sparkles size={64} className="text-indigo-500" />;
      default:
        return <Trophy size={64} className="text-purple-500" />;
    }
  };

  const getRewardText = () => {
    switch (reward.type) {
      case 'points':
        return `获得 ${reward.value} 积分`;
      case 'badge':
        return `解锁徽章: ${reward.value}`;
      case 'theme':
        return `解锁主题: ${reward.value}`;
      default:
        return '解锁新功能';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        {/* 遮罩层 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        />

        {/* 奖励卡片 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 rounded-3xl p-8 shadow-2xl max-w-sm w-full pointer-events-auto"
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
          >
            <X size={20} className="text-white" />
          </button>

          {/* 内容 */}
          <div className="text-center space-y-4">
            {/* 图标动画 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex justify-center"
            >
              {getRewardIcon()}
            </motion.div>

            {/* 标题 */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white"
            >
              任务完成！
            </motion.h2>

            {/* 任务名称 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/90 font-medium"
            >
              {task.title}
            </motion.p>

            {/* 奖励信息 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <p className="text-xl font-bold text-white">{getRewardText()}</p>
            </motion.div>

            {/* 确认按钮 */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg"
            >
              太棒了！
            </motion.button>
          </div>

          {/* 装饰性粒子效果 */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
              }}
              transition={{
                delay: 0.7 + i * 0.1,
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
            />
          ))}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
