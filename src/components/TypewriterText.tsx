// ==========================================
// 打字机效果组件
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  speed?: number; // 每个字符的延迟（毫秒）
  delay?: number; // 开始前的延迟
  onComplete?: () => void;
  className?: string;
  cursor?: boolean; // 是否显示光标
  cursorChar?: string;
}

export default function TypewriterText({
  text,
  speed = 30,
  delay = 0,
  onComplete,
  className = '',
  cursor = true,
  cursorChar = '▌',
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 重置状态
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;

    // 延迟开始
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, delay]);

  useEffect(() => {
    if (!isTyping || isComplete) return;

    const typeNextChar = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        
        // 根据标点符号调整速度
        const currentChar = text[indexRef.current - 1];
        const pauseChars = ['。', '！', '？', '.', '!', '?', '，', ',', '；', ';'];
        const extraDelay = pauseChars.includes(currentChar) ? speed * 3 : 0;
        
        timeoutRef.current = setTimeout(typeNextChar, speed + extraDelay);
      } else {
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    timeoutRef.current = setTimeout(typeNextChar, speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isTyping, isComplete, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="text-indigo-500"
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  );
}

/**
 * 流式打字机效果 Hook
 * 用于 AI 流式响应场景
 */
export function useTypewriter(options?: {
  speed?: number;
  onComplete?: () => void;
}) {
  const { speed = 30, onComplete } = options || {};
  const [text, setText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 当文本更新时，继续打字
  useEffect(() => {
    if (text.length === 0) {
      setDisplayedText('');
      indexRef.current = 0;
      return;
    }

    if (indexRef.current >= text.length) {
      setIsTyping(false);
      onComplete?.();
      return;
    }

    setIsTyping(true);

    const typeNextChar = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        timeoutRef.current = setTimeout(typeNextChar, speed);
      } else {
        setIsTyping(false);
        onComplete?.();
      }
    };

    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(typeNextChar, speed);
    }

    return () => {
      if (timeoutRef.current && indexRef.current >= text.length) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, speed, onComplete]);

  // 追加文本（用于流式响应）
  const append = (newText: string) => {
    setText(prev => prev + newText);
  };

  // 重置
  const reset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setText('');
    setDisplayedText('');
    indexRef.current = 0;
    setIsTyping(false);
  };

  // 立即显示所有文本
  const flush = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDisplayedText(text);
    indexRef.current = text.length;
    setIsTyping(false);
  };

  return {
    text,
    displayedText,
    isTyping,
    setText,
    append,
    reset,
    flush,
  };
}
