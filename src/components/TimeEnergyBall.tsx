// ==========================================
// 时辰能量球组件
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TimeEnergyBallProps {
  currentTime?: Date;
  dayMaster?: string; // 日主天干
}

// 时辰对应表（12时辰）- 使用 key 来动态获取翻译
const SHICHEN_MAP_BASE: Record<number, { key: string; gan: string; zhi: string; elementKey: string }> = {
  0: { key: 'zi', gan: '甲', zhi: '子', elementKey: 'water' },
  1: { key: 'chou', gan: '乙', zhi: '丑', elementKey: 'earth' },
  2: { key: 'yin', gan: '丙', zhi: '寅', elementKey: 'wood' },
  3: { key: 'mao', gan: '丁', zhi: '卯', elementKey: 'wood' },
  4: { key: 'chen', gan: '戊', zhi: '辰', elementKey: 'earth' },
  5: { key: 'si', gan: '己', zhi: '巳', elementKey: 'fire' },
  6: { key: 'wu', gan: '庚', zhi: '午', elementKey: 'fire' },
  7: { key: 'wei', gan: '辛', zhi: '未', elementKey: 'earth' },
  8: { key: 'shen', gan: '壬', zhi: '申', elementKey: 'metal' },
  9: { key: 'you', gan: '癸', zhi: '酉', elementKey: 'metal' },
  10: { key: 'xu', gan: '甲', zhi: '戌', elementKey: 'earth' },
  11: { key: 'hai', gan: '乙', zhi: '亥', elementKey: 'water' },
};

// 元素映射 (内部使用中文作为键)
const ELEMENT_KEY_TO_CHINESE: Record<string, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

// 天干五行映射
const GAN_ELEMENT: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 五行生克关系
const ELEMENT_RELATION: Record<string, { sheng: string[]; ke: string[]; beiSheng: string[]; beiKe: string[] }> = {
  '木': { sheng: ['火'], ke: ['土'], beiSheng: ['水'], beiKe: ['金'] },
  '火': { sheng: ['土'], ke: ['金'], beiSheng: ['木'], beiKe: ['水'] },
  '土': { sheng: ['金'], ke: ['水'], beiSheng: ['火'], beiKe: ['木'] },
  '金': { sheng: ['水'], ke: ['木'], beiSheng: ['土'], beiKe: ['火'] },
  '水': { sheng: ['木'], ke: ['火'], beiSheng: ['金'], beiKe: ['土'] },
};

export default function TimeEnergyBall({ currentTime, dayMaster }: TimeEnergyBallProps) {
  const { t, i18n } = useTranslation(['ui', 'bazi']);
  const isEnglish = i18n.language === 'en';
  const [now, setNow] = useState(currentTime || new Date());
  const [shichen, setShichen] = useState<{ key: string; name: string; gan: string; zhi: string; element: string; elementKey: string } | null>(null);
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [relation, setRelation] = useState<string>('');
  const [relationKey, setRelationKey] = useState<string>('');

  useEffect(() => {
    // 更新当前时间
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 计算当前时辰（每2小时一个时辰）
    const hour = now.getHours();
    const shichenIndex = Math.floor(hour / 2);
    const currentShichenBase = SHICHEN_MAP_BASE[shichenIndex];
    
    if (currentShichenBase) {
      const chineseElement = ELEMENT_KEY_TO_CHINESE[currentShichenBase.elementKey];
      const currentShichen = {
        ...currentShichenBase,
        name: t(`ui:timeEnergyHours.${currentShichenBase.key}`),
        element: chineseElement,
      };
      setShichen(currentShichen);
      
      // 如果有日主，计算生克关系
      if (dayMaster) {
        const dayMasterElement = GAN_ELEMENT[dayMaster];
        const shichenElement = currentShichen.element;
        
        if (dayMasterElement && shichenElement) {
          const relationData = ELEMENT_RELATION[dayMasterElement];
          
          if (relationData.sheng.includes(shichenElement)) {
            setRelation('生');
            setRelationKey('generate');
            setEnergyLevel('high');
          } else if (relationData.ke.includes(shichenElement)) {
            setRelation('克');
            setRelationKey('restrict');
            setEnergyLevel('high');
          } else if (relationData.beiSheng.includes(shichenElement)) {
            setRelation('被生');
            setRelationKey('beGenerated');
            setEnergyLevel('high');
          } else if (relationData.beiKe.includes(shichenElement)) {
            setRelation('被克');
            setRelationKey('beRestricted');
            setEnergyLevel('low');
          } else if (dayMasterElement === shichenElement) {
            setRelation('同');
            setRelationKey('same');
            setEnergyLevel('medium');
          } else {
            setRelation('平');
            setRelationKey('neutral');
            setEnergyLevel('medium');
          }
        }
      } else {
        setRelation('');
        setRelationKey('');
        setEnergyLevel('medium');
      }
    }
  }, [now, dayMaster, t]);

  if (!shichen) return null;

  const getEnergyColor = () => {
    switch (energyLevel) {
      case 'high':
        return 'from-green-400 to-emerald-500';
      case 'medium':
        return 'from-yellow-400 to-amber-500';
      case 'low':
        return 'from-gray-400 to-slate-500';
      default:
        return 'from-blue-400 to-indigo-500';
    }
  };

  const getEnergySize = () => {
    switch (energyLevel) {
      case 'high':
        return 'w-16 h-16';
      case 'medium':
        return 'w-14 h-14';
      case 'low':
        return 'w-12 h-12';
      default:
        return 'w-14 h-14';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed top-4 right-4 z-30 lg:top-6 lg:right-6"
    >
      <div className="relative">
        {/* 能量球 */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`${getEnergySize()} rounded-full bg-gradient-to-br ${getEnergyColor()} shadow-lg flex items-center justify-center cursor-pointer group`}
        >
          <Zap size={20} className="text-white" />
        </motion.div>

        {/* 悬浮提示 */}
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('ui:timeEnergy.currentHour')}</span>
          </div>
          <div className="text-lg font-black text-gray-800 dark:text-gray-200 mb-1">
            {shichen.name}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {shichen.gan}{shichen.zhi} · {isEnglish ? t(`bazi:elements.${shichen.elementKey}`) : shichen.element}
          </div>
          {dayMaster && relation && relationKey && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isEnglish ? 'Relation with Day Master' : '与日主关系'}</div>
                <div className={`text-sm font-bold ${
                  energyLevel === 'high' ? 'text-green-600 dark:text-green-400' :
                  energyLevel === 'low' ? 'text-red-600 dark:text-red-400' :
                  'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {isEnglish 
                    ? `${t(`bazi:elements.${shichen.elementKey}`)} ${t(`ui:timeEnergyRelations.${relationKey}`)}`
                    : `${GAN_ELEMENT[dayMaster] || dayMaster} ${relation} ${shichen.element}`
                  }
                </div>
              </div>
            </>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {now.toLocaleTimeString(isEnglish ? 'en-US' : 'zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
