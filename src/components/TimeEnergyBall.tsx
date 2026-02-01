// ==========================================
// 时辰能量球组件
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';

interface TimeEnergyBallProps {
  currentTime?: Date;
  dayMaster?: string; // 日主天干
}

// 时辰对应表（12时辰）
const SHICHEN_MAP: Record<number, { name: string; gan: string; zhi: string; element: string }> = {
  0: { name: '子时', gan: '甲', zhi: '子', element: '水' },
  1: { name: '丑时', gan: '乙', zhi: '丑', element: '土' },
  2: { name: '寅时', gan: '丙', zhi: '寅', element: '木' },
  3: { name: '卯时', gan: '丁', zhi: '卯', element: '木' },
  4: { name: '辰时', gan: '戊', zhi: '辰', element: '土' },
  5: { name: '巳时', gan: '己', zhi: '巳', element: '火' },
  6: { name: '午时', gan: '庚', zhi: '午', element: '火' },
  7: { name: '未时', gan: '辛', zhi: '未', element: '土' },
  8: { name: '申时', gan: '壬', zhi: '申', element: '金' },
  9: { name: '酉时', gan: '癸', zhi: '酉', element: '金' },
  10: { name: '戌时', gan: '甲', zhi: '戌', element: '土' },
  11: { name: '亥时', gan: '乙', zhi: '亥', element: '水' },
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
  const [now, setNow] = useState(currentTime || new Date());
  const [shichen, setShichen] = useState<{ name: string; gan: string; zhi: string; element: string } | null>(null);
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [relation, setRelation] = useState<string>('');

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
    const currentShichen = SHICHEN_MAP[shichenIndex];
    
    if (currentShichen) {
      setShichen(currentShichen);
      
      // 如果有日主，计算生克关系
      if (dayMaster) {
        const dayMasterElement = GAN_ELEMENT[dayMaster];
        const shichenElement = currentShichen.element;
        
        if (dayMasterElement && shichenElement) {
          const relationData = ELEMENT_RELATION[dayMasterElement];
          
          if (relationData.sheng.includes(shichenElement)) {
            setRelation('生');
            setEnergyLevel('high');
          } else if (relationData.ke.includes(shichenElement)) {
            setRelation('克');
            setEnergyLevel('high');
          } else if (relationData.beiSheng.includes(shichenElement)) {
            setRelation('被生');
            setEnergyLevel('high');
          } else if (relationData.beiKe.includes(shichenElement)) {
            setRelation('被克');
            setEnergyLevel('low');
          } else if (dayMasterElement === shichenElement) {
            setRelation('同');
            setEnergyLevel('medium');
          } else {
            setRelation('平');
            setEnergyLevel('medium');
          }
        }
      } else {
        setRelation('');
        setEnergyLevel('medium');
      }
    }
  }, [now, dayMaster]);

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
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">当前时辰</span>
          </div>
          <div className="text-lg font-black text-gray-800 dark:text-gray-200 mb-1">
            {shichen.name}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {shichen.gan}{shichen.zhi} · {shichen.element}
          </div>
          {dayMaster && relation && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">与日主关系</div>
                <div className={`text-sm font-bold ${
                  energyLevel === 'high' ? 'text-green-600 dark:text-green-400' :
                  energyLevel === 'low' ? 'text-red-600 dark:text-red-400' :
                  'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {GAN_ELEMENT[dayMaster] || dayMaster} {relation} {shichen.element}
                </div>
              </div>
            </>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
