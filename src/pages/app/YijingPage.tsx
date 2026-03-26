// ==========================================
// 易经问卦 - 东方美学沉浸式体验
// ==========================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ChevronLeft, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { YijingExperience } from '../../components/oriental';
import { PageTransition } from '../../components/oriental/animations';

const CATEGORIES = [
  { id: 'career', zh: '事业', en: 'Career' },
  { id: 'love', zh: '感情', en: 'Love' },
  { id: 'wealth', zh: '财运', en: 'Wealth' },
  { id: 'health', zh: '健康', en: 'Health' },
  { id: 'general', zh: '综合', en: 'General' },
];

export default function YijingPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('general');
  const [showExperience, setShowExperience] = useState(false);

  // 如果进入沉浸式体验
  if (showExperience) {
    return (
      <YijingExperience
        question={question}
        onBack={() => setShowExperience(false)}
        onComplete={(result) => {
          console.log('Yijing result:', result);
        }}
      />
    );
  }

  return (
    <PageTransition className="min-h-screen bg-paper">
      {/* 顶部标题栏 */}
      <div className="bg-white border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-paper-dark transition-colors"
            >
              <ChevronLeft size={20} className="text-ink" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-qingdai/10 flex items-center justify-center">
              <Flame size={20} className="text-qingdai" />
            </div>
            <div>
              <h1 className="text-xl font-serif text-ink">
                {isEnglish ? 'I Ching' : '易经问卦'}
              </h1>
              <p className="text-xs text-light-ink font-serif">
                {isEnglish ? 'Ancient Chinese divination' : '中华传统占卜术'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-8 shadow-card">
          {/* 如何提问 */}
          <div className="bg-qingdai/5 border border-qingdai/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-qingdai" />
              <h3 className="font-serif text-qingdai-dark text-sm">
                {isEnglish ? 'How to Ask' : '如何提问'}
              </h3>
            </div>
            <ul className="text-xs text-light-ink font-serif space-y-1 pl-6 list-disc">
              {(isEnglish
                ? [
                    'Be specific (timeframe + situation).',
                    'One matter per reading; avoid repeated casts.',
                    'For entertainment & reflection only.',
                  ]
                : ['尽量具体（时间范围 + 情境）。', '一事一卜，同一件事勿反复起卦。', '结果仅供娱乐与自省参考。']
              ).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          {/* 问题类型 */}
          <div className="mb-6">
            <label className="block text-sm text-light-ink font-serif mb-3">
              {isEnglish ? 'Category' : '问题类型'}
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-4 py-2 rounded-full text-sm font-serif transition ${
                    category === c.id
                      ? 'bg-qingdai text-white'
                      : 'bg-paper-dark text-ink-light hover:bg-paper-dark/80'
                  }`}
                >
                  {isEnglish ? c.en : c.zh}
                </button>
              ))}
            </div>
          </div>

          {/* 占问内容 */}
          <div className="mb-8">
            <label className="block text-sm text-light-ink font-serif mb-3">
              {isEnglish ? 'Your question' : '占问内容'}
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              placeholder={
                isEnglish
                  ? 'e.g. Should I change jobs in the next three months?'
                  : '例如：未来三个月内是否适合换工作？'
              }
              className="w-full p-4 bg-paper-dark rounded-xl border border-border-subtle text-ink font-serif placeholder:text-muted focus:outline-none focus:border-qingdai/50 resize-none"
            />
          </div>

          {/* 开始按钮 */}
          <button
            onClick={() => setShowExperience(true)}
            className="w-full py-4 bg-qingdai text-white rounded-xl font-serif text-lg hover:bg-qingdai-dark transition-colors flex items-center justify-center gap-2"
          >
            <Flame size={20} />
            {isEnglish ? 'Cast Hexagram' : '开始摇卦'}
          </button>

          {/* 说明 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted font-serif">
              {isEnglish 
                ? 'You will toss coins 6 times to generate your hexagram.' 
                : '你将通过六次摇卦来生成你的卦象'}
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
