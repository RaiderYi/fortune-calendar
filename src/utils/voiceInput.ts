// ==========================================
// 语音输入工具
// 使用 Web Speech API 实现语音转文字
// ==========================================

export interface VoiceInputResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export interface VoiceInputOptions {
  language?: string; // 语言代码，如 'zh-CN', 'en-US'
  continuous?: boolean; // 是否持续识别
  interimResults?: boolean; // 是否返回中间结果
  maxAlternatives?: number; // 最大候选数量
}

export interface VoiceInputHook {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// 检查浏览器是否支持语音识别
export function isVoiceInputSupported(): boolean {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

// 获取 SpeechRecognition 构造函数
function getSpeechRecognition(): typeof SpeechRecognition | null {
  if ('SpeechRecognition' in window) {
    return window.SpeechRecognition;
  }
  if ('webkitSpeechRecognition' in window) {
    return (window as any).webkitSpeechRecognition;
  }
  return null;
}

/**
 * 创建语音识别实例
 */
export function createVoiceRecognition(
  options: VoiceInputOptions = {}
): SpeechRecognition | null {
  const SpeechRecognitionClass = getSpeechRecognition();
  
  if (!SpeechRecognitionClass) {
    console.warn('浏览器不支持语音识别');
    return null;
  }

  const recognition = new SpeechRecognitionClass();
  
  // 配置选项
  recognition.lang = options.language || 'zh-CN';
  recognition.continuous = options.continuous ?? false;
  recognition.interimResults = options.interimResults ?? true;
  recognition.maxAlternatives = options.maxAlternatives ?? 1;

  return recognition;
}

/**
 * 简单的一次性语音识别
 */
export function recognizeSpeech(
  options: VoiceInputOptions = {}
): Promise<VoiceInputResult> {
  return new Promise((resolve, reject) => {
    const recognition = createVoiceRecognition(options);
    
    if (!recognition) {
      reject(new Error('浏览器不支持语音识别'));
      return;
    }

    let finalTranscript = '';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
    };

    recognition.onend = () => {
      resolve({
        transcript: finalTranscript,
        isFinal: true,
        confidence: 1,
      });
    };

    recognition.onerror = (event) => {
      reject(new Error(getErrorMessage(event.error)));
    };

    recognition.start();
  });
}

/**
 * 获取错误消息
 */
function getErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    'no-speech': '未检测到语音，请重试',
    'audio-capture': '无法访问麦克风，请检查权限设置',
    'not-allowed': '麦克风权限被拒绝，请允许麦克风访问',
    'network': '网络错误，请检查网络连接',
    'aborted': '语音识别被中断',
    'language-not-supported': '不支持当前语言',
    'service-not-allowed': '语音识别服务不可用',
  };
  return messages[error] || `语音识别错误: ${error}`;
}

// React Hook 用于语音输入
import { useState, useCallback, useRef, useEffect } from 'react';

export function useVoiceInput(options: VoiceInputOptions = {}): VoiceInputHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSupported = isVoiceInputSupported();

  // 初始化语音识别
  useEffect(() => {
    if (!isSupported) return;

    const recognition = createVoiceRecognition({
      ...options,
      continuous: true,
      interimResults: true,
    });

    if (!recognition) return;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript(prev => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      setError(getErrorMessage(event.error));
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported, options.language]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    setError(null);
    setInterimTranscript('');
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      // 如果已经在监听，忽略错误
      console.warn('语音识别启动失败:', err);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.warn('语音识别停止失败:', err);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}

/**
 * 语音合成（文字转语音）
 */
export function speakText(
  text: string,
  options: {
    language?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('浏览器不支持语音合成'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language || 'zh-CN';
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(event.error));

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * 停止语音合成
 */
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * 检查是否正在播放语音
 */
export function isSpeaking(): boolean {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
