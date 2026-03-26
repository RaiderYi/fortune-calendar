/* ============================================
   卦象展示组件
   Hexagram Display Component
   ============================================ */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// 爻类型
export type YaoType = 'yin' | 'yang' | 'old-yin' | 'old-yang';

// 卦象数据
export interface HexagramData {
  id: string;
  name: string;
  nameCn: string;
  yaos: YaoType[]; // 从下到上
  meaning: string;
  interpretation: string;
}

// 单爻组件
interface YaoLineProps {
  type: YaoType;
  index: number;
  isAnimated?: boolean;
  className?: string;
}

export function YaoLine({ 
  type, 
  index,
  isAnimated = true,
  className = ''
}: YaoLineProps) {
  const isYin = type === 'yin' || type === 'old-yin';
  const isChanging = type === 'old-yin' || type === 'old-yang';

  return (
    <motion.div
      initial={isAnimated ? { opacity: 0, x: -20 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.2,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`flex items-center justify-center gap-2 py-1 ${className}`}
    >
      {isYin ? (
        // 阴爻 - 断开的两横
        <>
          <div className={`h-2 w-16 rounded-full ${isChanging ? 'bg-vermilion' : 'bg-ink'}`} />
          <div className="w-4" />
          <div className={`h-2 w-16 rounded-full ${isChanging ? 'bg-vermilion' : 'bg-ink'}`} />
        </>
      ) : (
        // 阳爻 - 完整的一横
        <div className={`h-2 w-36 rounded-full ${isChanging ? 'bg-vermilion' : 'bg-ink'}`} />
      )}
      
      {/* 变爻标记 */}
      {isChanging && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.2 + 0.3 }}
          className="absolute -right-6 w-4 h-4 rounded-full bg-vermilion text-white text-xs flex items-center justify-center font-serif"
        >
          变
        </motion.div>
      )}
    </motion.div>
  );
}

// 完整卦象
interface HexagramProps {
  yaos: YaoType[];
  name?: string;
  showNumbers?: boolean;
  isAnimated?: boolean;
  className?: string;
}

export function Hexagram({ 
  yaos, 
  name,
  showNumbers = true,
  isAnimated = true,
  className = ''
}: HexagramProps) {
  // 卦象从上到下显示，但数组是从下到上
  const displayYaos = [...yaos].reverse();

  return (
    <div className={`relative ${className}`}>
      {showNumbers && (
        <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-around text-xs text-light-ink font-serif">
          <span>六</span>
          <span>五</span>
          <span>四</span>
          <span>三</span>
          <span>二</span>
          <span>初</span>
        </div>
      )}
      
      <div className="space-y-3 py-2">
        {displayYaos.map((yao, index) => (
          <YaoLine
            key={index}
            type={yao}
            index={isAnimated ? index : -1}
            isAnimated={isAnimated}
          />
        ))}
      </div>
      
      {name && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-center"
        >
          <h3 className="text-2xl font-serif text-ink">{name}</h3>
        </motion.div>
      )}
    </div>
  );
}

// 铜钱结果转爻
export function coinsToYao(coins: [boolean, boolean, boolean]): YaoType {
  const heads = coins.filter(c => c).length; // 字（正面）的数量
  
  switch (heads) {
    case 3: return 'old-yang'; // 三个字 - 老阳（变爻）
    case 2: return 'yin';      // 两个字 - 少阴
    case 1: return 'yang';     // 一个字 - 少阳
    case 0: return 'old-yin';  // 无字 - 老阴（变爻）
    default: return 'yang';
  }
}

// 六爻生成卦象
export function generateHexagram(coinResults: [boolean, boolean, boolean][]): YaoType[] {
  return coinResults.map(coins => coinsToYao(coins));
}

// 卦象名称查找（简化版）
const hexagramNames: Record<string, string> = {
  '000000': '坤为地',
  '111111': '乾为天',
  '010001': '水雷屯',
  '100010': '山水蒙',
  '010111': '水天需',
  '111010': '天水讼',
  '000010': '地水师',
  '010000': '水地比',
  '110111': '风天小畜',
  '111011': '天泽履',
  '000111': '地天泰',
  '111000': '天地否',
  '111101': '天火同人',
  '101111': '火天大有',
  '000100': '地山谦',
  '001000': '雷地豫',
  '011001': '泽雷随',
  '100110': '山风蛊',
  '000011': '地泽临',
  '110000': '风地观',
  '101001': '火雷噬嗑',
  '100101': '山火贲',
  '100000': '山地剥',
  '000001': '地雷复',
  '111001': '天雷无妄',
  '100111': '山天大畜',
  '100001': '山雷颐',
  '011110': '泽风大过',
  '010010': '坎为水',
  '101101': '离为火',
  '011100': '泽山咸',
  '001110': '雷风恒',
  '111100': '天山遁',
  '001111': '雷天大壮',
  '101000': '火地晋',
  '000101': '地火明夷',
  '110101': '风火家人',
  '101011': '火泽睽',
  '010100': '水山蹇',
  '001010': '雷水解',
  '110001': '风雷益',
  '100011': '山泽损',
  '111110': '天泽夬',
  '011111': '泽天夬',
  '000110': '地风升',
  '011000': '泽地萃',
  '010110': '水风井',
  '011010': '泽水困',
  '101110': '火风鼎',
  '011101': '泽火革',
  '100100': '山雷震',
  '001001': '雷山艮',
  '001011': '雷泽归妹',
  '110100': '风山渐',
  '101100': '火山旅',
  '001101': '雷火丰',
  '101100': '火山旅',
  '110110': '风水涣',
  '011011': '泽水节',
  '110010': '风泽中孚',
  '010011': '水泽节',
  '110011': '风泽中孚',
  '001100': '雷山小过',
  '010101': '水火既济',
  '101010': '火水未济'
};

export function getHexagramName(yaos: YaoType[]): string {
  const key = yaos.map(y => {
    if (y === 'yang' || y === 'old-yang') return '1';
    return '0';
  }).join('');
  
  return hexagramNames[key] || '未知卦象';
}

export type { YaoType, HexagramData, YaoLineProps, HexagramProps };
