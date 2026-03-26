// ==========================================
// 塔罗牌 - 东方美学沉浸式体验
// ==========================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TarotExperience } from '../../components/oriental';
import { PageTransition } from '../../components/oriental/animations';

// 塔罗牌数据
const tarotCards = [
  {
    id: 'fool',
    name: '愚人',
    nameEn: 'The Fool',
    meaning: {
      upright: '新的开始、冒险、纯真、自由',
      reversed: '鲁莽、冒失、缺乏计划、盲目'
    },
    interpretation: '愚人代表着全新的开始，鼓励你勇敢地踏出舒适区，拥抱未知的旅程。相信你的直觉，保持开放的心态。'
  },
  {
    id: 'magician',
    name: '魔术师',
    nameEn: 'The Magician',
    meaning: {
      upright: '创造力、意志力、技能、行动力',
      reversed: '欺骗、操控、缺乏自信、技能不足'
    },
    interpretation: '魔术师象征着你拥有实现目标所需的所有资源和能力。现在是采取行动、发挥创造力的最佳时机。'
  },
  {
    id: 'priestess',
    name: '女祭司',
    nameEn: 'The High Priestess',
    meaning: {
      upright: '直觉、潜意识、神秘、内在智慧',
      reversed: '忽视直觉、表面化、缺乏洞察力'
    },
    interpretation: '女祭司提醒你倾听内心的声音，相信你的直觉。答案往往隐藏在你内心深处，需要静心去发现。'
  },
  {
    id: 'empress',
    name: '女皇',
    nameEn: 'The Empress',
    meaning: {
      upright: '丰饶、母性、创造力、感官享受',
      reversed: '缺乏创造力、不孕、过度依赖'
    },
    interpretation: '女皇代表着丰盛和创造力。关注生活中的美好事物，培养你的创造力，享受当下的丰盛。'
  },
  {
    id: 'emperor',
    name: '皇帝',
    nameEn: 'The Emperor',
    meaning: {
      upright: '权威、结构、控制、父性能量',
      reversed: '专制、僵化、缺乏自律、软弱'
    },
    interpretation: '皇帝象征着秩序和结构。是时候建立规则，掌控局面，展现你的领导力和决断力。'
  }
];

export default function TarotPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [showExperience, setShowExperience] = useState(false);

  // 如果进入沉浸式体验
  if (showExperience) {
    return (
      <TarotExperience
        question={question}
        onBack={() => setShowExperience(false)}
        onComplete={(result) => {
          console.log('Tarot result:', result);
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
            <div className="w-10 h-10 rounded-xl bg-vermilion/10 flex items-center justify-center">
              <LayoutGrid size={20} className="text-vermilion" />
            </div>
            <div>
              <h1 className="text-xl font-serif text-ink">
                {isEnglish ? 'Tarot' : '塔罗占卜'}
              </h1>
              <p className="text-xs text-light-ink font-serif">
                {isEnglish ? 'Major Arcana divination' : '大阿尔卡那占卜'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-8 shadow-card text-center">
          {/* 装饰 */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-vermilion/10 flex items-center justify-center">
            <span className="text-3xl">🌙</span>
          </div>

          <h2 className="text-xl font-serif text-ink mb-2">
            {isEnglish ? 'Tarot Reading' : '塔罗牌占卜'}
          </h2>
          <p className="text-light-ink font-serif mb-8 max-w-md mx-auto">
            {isEnglish 
              ? 'Major Arcana only. For reflection and entertainment, not fortune-telling.' 
              : '仅使用大阿尔卡那牌组。供自省与娱乐参考，请勿过度依赖。'}
          </p>

          {/* 问题输入 */}
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm text-light-ink font-serif mb-2 text-left">
              {isEnglish ? 'Your question (optional)' : '你的问题（可选）'}
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={isEnglish 
                ? 'e.g., What should I focus on this month?' 
                : '例如：这个月我应该关注什么？'}
              className="w-full p-4 bg-paper-dark rounded-xl border border-border-subtle text-ink font-serif placeholder:text-muted focus:outline-none focus:border-vermilion/50 resize-none"
              rows={3}
            />
          </div>

          {/* 开始按钮 */}
          <button
            onClick={() => setShowExperience(true)}
            className="px-8 py-3 bg-vermilion text-white rounded-full font-serif hover:bg-vermilion-dark transition-colors"
          >
            {isEnglish ? 'Start Reading' : '开始占卜'}
          </button>

          {/* 说明文字 */}
          <div className="mt-8 pt-6 border-t border-border-subtle">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-paper-dark rounded-xl p-4">
                <h3 className="text-sm font-serif text-ink mb-2">
                  {isEnglish ? 'How to Ask' : '如何提问'}
                </h3>
                <ul className="text-xs text-light-ink font-serif space-y-1">
                  <li>• {isEnglish ? 'Be specific about timeframe' : '时间范围尽量具体'}</li>
                  <li>• {isEnglish ? 'Focus on one matter' : '一次专注一个问题'}</li>
                </ul>
              </div>
              <div className="bg-paper-dark rounded-xl p-4">
                <h3 className="text-sm font-serif text-ink mb-2">
                  {isEnglish ? 'Note' : '注意事项'}
                </h3>
                <ul className="text-xs text-light-ink font-serif space-y-1">
                  <li>• {isEnglish ? 'Keep an open mind' : '保持开放的心态'}</li>
                  <li>• {isEnglish ? 'For entertainment only' : '结果仅供娱乐参考'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
