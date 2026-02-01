// ==========================================
// AI 命理深度推演组件
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2, Sparkles, TrendingUp, Briefcase, Coins, Heart, Zap, BookOpen, Map } from 'lucide-react';
import { chatWithAI } from '../services/api';
import type { ChatMessage, BaziContext, QuickQuestion } from '../types';
import { useToast } from '../contexts/ToastContext';

interface AIDeductionProps {
  isOpen: boolean;
  onClose: () => void;
  baziContext: BaziContext;
}

// 快捷问题列表
const QUICK_QUESTIONS: QuickQuestion[] = [
  { id: 'wealth', text: '详解今日财运', icon: '💰' },
  { id: 'career', text: '事业发展建议', icon: '💼' },
  { id: 'romance', text: '感情运势分析', icon: '💕' },
  { id: 'health', text: '健康注意事项', icon: '🏥' },
  { id: 'personality', text: '解析我的性格', icon: '🔮' },
  { id: 'avoid', text: '今日避坑指南', icon: '⚠️' },
];

export default function AIDeduction({
  isOpen,
  onClose,
  baziContext,
}: AIDeductionProps) {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // 重置消息（可选：保留历史）
      // setMessages([]);
    }
  }, [isOpen, messages]);

  // 发送消息
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: content.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatWithAI(newMessages, baziContext);

      if (response.success && response.message) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.message,
        };
        setMessages([...newMessages, assistantMessage]);
      } else {
        throw new Error(response.error || 'AI 响应失败');
      }
    } catch (error) {
      console.error('AI 聊天错误:', error);
      showToast('AI 咨询失败，请稍后重试', 'error');
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '抱歉，我暂时无法回答您的问题。请稍后再试。',
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理快捷问题
  const handleQuickQuestion = (question: QuickQuestion) => {
    sendMessage(question.text);
  };

  // 处理输入框回车
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:z-50"
          />

          {/* 抽屉/弹窗 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col lg:rounded-l-2xl"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={20} />
                <h2 className="text-lg font-bold">AI 命理深度咨询</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot size={48} className="mx-auto mb-4 text-indigo-500" />
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                    欢迎使用 AI 命理咨询
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    我已经了解了您的八字信息，可以为您提供专业的命理分析
                  </p>

                  {/* 快捷问题 */}
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleQuickQuestion(q)}
                        className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-left transition text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        <span className="mr-2">{q.icon}</span>
                        {q.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 消息列表 */}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      msg.role === 'user'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.role === 'assistant' && (
                        <Bot size={16} className="mt-0.5 flex-shrink-0 text-indigo-500" />
                      )}
                      <div className="flex-1 whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <User size={16} className="mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* 加载中 */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-indigo-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">AI 正在思考...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入您的问题..."
                  rows={1}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={!inputText.trim() || isLoading}
                  className="p-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                按 Enter 发送，Shift + Enter 换行
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
