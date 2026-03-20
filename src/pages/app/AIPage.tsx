// ==========================================
// AI 命理深度咨询 - 功能页
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { chatWithAI } from '../../services/api';
import type { ChatMessage, BaziContext, QuickQuestion } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import TypewriterText from '../../components/TypewriterText';
import { trySpendCredits, addCredits } from '../../utils/creditsStorage';
import { AppSubPageShell } from '../../components/layout/AppSubPageShell';
import { appSpectrumCtaButtonClass } from '../../constants/appUiClasses';

export default function AIPage() {
  const { t } = useTranslation('ui');
  const { showToast } = useToast();
  const { fortune } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessageIndex, setTypingMessageIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const baziContext: BaziContext | undefined = fortune
    ? {
        baziDetail: fortune.baziDetail,
        yongShen: fortune.yongShen,
        dimensions: fortune.dimensions,
        mainTheme: fortune.mainTheme,
        totalScore: fortune.totalScore,
        liuNian: fortune.liuNian,
      }
    : undefined;

  const QUICK_QUESTIONS: QuickQuestion[] = [
    { id: 'wealth', text: t('aiDeduction.quickQuestions.wealth'), icon: '💰' },
    { id: 'career', text: t('aiDeduction.quickQuestions.career'), icon: '💼' },
    { id: 'romance', text: t('aiDeduction.quickQuestions.romance'), icon: '💕' },
    { id: 'health', text: t('aiDeduction.quickQuestions.health'), icon: '🏥' },
    { id: 'personality', text: t('aiDeduction.quickQuestions.personality'), icon: '🔮' },
    { id: 'avoid', text: t('aiDeduction.quickQuestions.avoid'), icon: '⚠️' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (content: string, skipValidation = false) => {
    if ((!content.trim() || isLoading) && !skipValidation) return;
    if (!baziContext) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: content.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    let needRefundCredits = false;
    try {
      if (!trySpendCredits(1, 'ai_chat')) {
        showToast('积分不足，完成邀请或签到可获积分', 'warning');
        setMessages(messages);
        setInputText(content.trim());
        setIsLoading(false);
        return;
      }
      needRefundCredits = true;
      const response = await chatWithAI(newMessages, { baziContext });

      if (response.success && response.message) {
        needRefundCredits = false;
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.message,
        };
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);
        setTypingMessageIndex(updatedMessages.length - 1);
      } else {
        throw new Error(response.error || t('aiDeduction.error'));
      }
    } catch (error) {
      console.error('AI 聊天错误:', error);
      const errMsg = error instanceof Error ? error.message : t('aiDeduction.error');
      const isRateLimit = /过于频繁|rate limit|too many/i.test(errMsg);
      showToast(isRateLimit ? t('aiDeduction.rateLimit') : t('aiDeduction.error'), 'error');
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: isRateLimit ? t('aiDeduction.rateLimit') : t('aiDeduction.errorMessage'),
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      if (needRefundCredits) {
        addCredits(1, 'ai_chat_refund');
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleQuickQuestion = (question: QuickQuestion) => {
    sendMessage(question.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  // 无运势数据时显示提示
  if (!baziContext) {
    return (
      <AppSubPageShell
        variant="light"
        lightTone="spectrum"
        title={t('header.aiConsult')}
        icon={Sparkles}
        contentClassName="flex flex-col items-center justify-center py-12 text-center"
      >
        <Bot size={64} className="mb-4 text-indigo-400" />
        <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-200">{t('aiDeduction.welcome')}</h3>
        <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">{t('aiDeduction.description')}</p>
        <p className="mb-6 text-amber-600 dark:text-amber-400">
          {t('aiDeduction.viewTodayFirst', {
            defaultValue: '请先查看今日运势，以便 AI 基于您的八字提供个性化分析',
          })}
        </p>
        <Link to="/app/fortune/today" className={appSpectrumCtaButtonClass}>
          {t('aiDeduction.goToToday', { defaultValue: '查看今日运势' })}
        </Link>
      </AppSubPageShell>
    );
  }

  return (
    <AppSubPageShell
      variant="light"
      lightTone="spectrum"
      title={t('header.aiConsult')}
      icon={Sparkles}
      scrollable={false}
      contentClassName="!p-0 lg:!p-0 flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot size={48} className="mx-auto mb-4 text-indigo-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              {t('aiDeduction.welcome')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t('aiDeduction.description')}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleQuickQuestion(q)}
                  className="p-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left transition text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  <span className="mr-2">{q.icon}</span>
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

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
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-2">
                {msg.role === 'assistant' && (
                  <Bot size={16} className="mt-0.5 flex-shrink-0 text-indigo-500" />
                )}
                <div className="flex-1 whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.role === 'assistant' && idx === typingMessageIndex ? (
                    <TypewriterText
                      text={msg.content}
                      speed={20}
                      onComplete={() => setTypingMessageIndex(null)}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === 'user' && (
                  <User size={16} className="mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-2 shadow-sm border border-gray-100 dark:border-gray-700">
              <Loader2 size={16} className="animate-spin text-indigo-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('aiDeduction.thinking', { defaultValue: 'AI 正在思考...' })}
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-gray-200 bg-white/95 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/95">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('aiDeduction.sendPlaceholder')}
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
          {t('aiDeduction.enterHint', {
            defaultValue: '按 Enter 发送，Shift + Enter 换行',
          })}
        </p>
      </div>
      </div>
    </AppSubPageShell>
  );
}
