// ==========================================
// 增强版日签生成器组件
// 支持多种模板、水印自定义、一键分享
// ==========================================

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Share2, X, Sparkles, Palette, 
  Type, Image as ImageIcon, Check, Copy, 
  Twitter, Facebook, MessageCircle, Send,
  Loader2, Settings, Eye, EyeOff
} from 'lucide-react';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { useTranslation } from 'react-i18next';

// ==================== 类型定义 ====================

export type SignTemplate = 'classic' | 'modern' | 'zen' | 'minimal' | 'oracle' | 'gradient' | 'photo';

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;
  fontSize: number;
}

export interface SignData {
  date: string;
  lunarDate: string;
  weekDay: string;
  score: number;
  keyword: string;
  emoji: string;
  description: string;
  dimensions?: {
    career: number;
    wealth: number;
    romance: number;
    health: number;
    academic: number;
    travel: number;
  };
  baziDetail?: {
    year: string;
    month: string;
    day: string;
    hour?: string;
  };
}

interface DailySignGeneratorProps {
  signData: SignData;
  isOpen: boolean;
  onClose: () => void;
  contentRef?: React.RefObject<HTMLDivElement>;
}

// ==================== 模板配置 ====================

const TEMPLATES: Array<{
  id: SignTemplate;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  bgStyle: string;
  textColor: string;
  accentColor: string;
}> = [
  {
    id: 'classic',
    name: '经典东方',
    nameEn: 'Classic Eastern',
    description: '红金配色，传统节庆风格',
    descriptionEn: 'Red & gold, traditional festive style',
    bgStyle: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FF6347 100%)',
    textColor: '#FFD700',
    accentColor: '#FFF8DC',
  },
  {
    id: 'modern',
    name: '现代简约',
    nameEn: 'Modern Minimal',
    description: '黑白灰，时尚商务感',
    descriptionEn: 'Monochrome, fashionable business style',
    bgStyle: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
    textColor: '#ffffff',
    accentColor: '#888888',
  },
  {
    id: 'zen',
    name: '禅意水墨',
    nameEn: 'Zen Ink Wash',
    description: '水墨风格，东方禅意',
    descriptionEn: 'Ink wash style, Eastern zen',
    bgStyle: 'linear-gradient(180deg, #faf8f3 0%, #e8e4db 100%)',
    textColor: '#2d2d2d',
    accentColor: '#8B7355',
  },
  {
    id: 'minimal',
    name: '极简数据',
    nameEn: 'Minimal Data',
    description: '纯净白底，精准数据展示',
    descriptionEn: 'Pure white, precise data display',
    bgStyle: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#6366f1',
  },
  {
    id: 'oracle',
    name: '神秘塔罗',
    nameEn: 'Mystical Tarot',
    description: '深紫星空，神秘力量感',
    descriptionEn: 'Deep purple starry, mystical power',
    bgStyle: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    textColor: '#e8d4b8',
    accentColor: '#ffd700',
  },
  {
    id: 'gradient',
    name: '梦幻渐变',
    nameEn: 'Dreamy Gradient',
    description: '多彩渐变，活力青春',
    descriptionEn: 'Colorful gradient, vibrant youth',
    bgStyle: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    textColor: '#ffffff',
    accentColor: '#fff3e0',
  },
  {
    id: 'photo',
    name: '照片叠加',
    nameEn: 'Photo Overlay',
    description: '自定义背景图片',
    descriptionEn: 'Custom background image',
    bgStyle: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)',
    textColor: '#ffffff',
    accentColor: '#ffd700',
  },
];

// ==================== 主组件 ====================

export default function DailySignGenerator({
  signData,
  isOpen,
  onClose,
}: DailySignGeneratorProps) {
  const { t, i18n } = useTranslation(['ui']);
  const isEnglish = i18n.language === 'en';
  
  const [selectedTemplate, setSelectedTemplate] = useState<SignTemplate>('classic');
  const [watermark, setWatermark] = useState<WatermarkConfig>({
    enabled: true,
    text: isEnglish ? 'Fortune Calendar' : '命运日历',
    position: 'bottom-right',
    opacity: 0.6,
    fontSize: 12,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  
  const signRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取当前模板配置
  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  // 生成图片
  const generateImage = useCallback(async (format: 'png' | 'jpeg' = 'png') => {
    if (!signRef.current) return;
    
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待渲染
      
      const options = {
        cacheBust: true,
        pixelRatio: 3,
        quality: 0.95,
      };

      let dataUrl: string;
      if (format === 'jpeg') {
        dataUrl = await toJpeg(signRef.current, options);
      } else {
        dataUrl = await toPng(signRef.current, options);
      }
      
      setGeneratedImage(dataUrl);
    } catch (error) {
      console.error('生成图片失败:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // 下载图片
  const downloadImage = useCallback(() => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = `fortune-${signData.date}.png`;
    link.href = generatedImage;
    link.click();
  }, [generatedImage, signData.date]);

  // 复制到剪贴板
  const copyToClipboard = useCallback(async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert(isEnglish ? 'Copied to clipboard!' : '已复制到剪贴板！');
    } catch (error) {
      console.error('复制失败:', error);
      // 降级方案：复制图片链接
      try {
        await navigator.clipboard.writeText(generatedImage);
        alert(isEnglish ? 'Image URL copied!' : '已复制图片链接！');
      } catch {
        alert(isEnglish ? 'Copy failed, please download' : '复制失败，请下载');
      }
    }
  }, [generatedImage, isEnglish]);

  // 分享到社交平台
  const shareToSocial = useCallback(async (platform: 'twitter' | 'facebook' | 'weibo' | 'wechat') => {
    const text = isEnglish 
      ? `My fortune for ${signData.date}: ${signData.score} points! ${signData.emoji} ${signData.keyword}`
      : `${signData.date} 我的运势：${signData.score}分！${signData.emoji} ${signData.keyword}`;
    const url = window.location.href;
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      weibo: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      wechat: '', // 微信需要特殊处理
    };

    if (platform === 'wechat') {
      // 微信分享提示
      alert(isEnglish 
        ? 'Please save the image and share via WeChat' 
        : '请保存图片后在微信中分享');
      downloadImage();
      return;
    }

    // 尝试使用 Web Share API
    if (navigator.share && generatedImage) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], `fortune-${signData.date}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: isEnglish ? 'My Daily Fortune' : '我的今日运势',
          text,
          files: [file],
        });
        return;
      } catch (error) {
        console.log('Web Share API 不支持或取消分享');
      }
    }

    // 降级到打开分享链接
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  }, [signData, generatedImage, downloadImage, isEnglish]);

  // 处理背景图片上传
  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBgImage(e.target?.result as string);
        setSelectedTemplate('photo');
      };
      reader.readAsDataURL(file);
    }
  };

  // 水印位置样式
  const getWatermarkPosition = () => {
    const positions: Record<string, string> = {
      'top-left': 'top-3 left-3',
      'top-right': 'top-3 right-3',
      'bottom-left': 'bottom-3 left-3',
      'bottom-right': 'bottom-3 right-3',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    };
    return positions[watermark.position] || positions['bottom-right'];
  };

  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-500" size={20} />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {isEnglish ? 'Generate Daily Sign' : '生成今日运势签'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition ${showSettings ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <Settings size={20} />
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
            {/* 左侧：模板选择和设置 */}
            <div className={`${showSettings ? 'w-full lg:w-1/3' : 'w-0 overflow-hidden'} border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}>
              <div className="p-4 overflow-y-auto max-h-full">
                {/* 模板选择 */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Palette size={16} />
                    {isEnglish ? 'Choose Template' : '选择模板'}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATES.map(template => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-3 rounded-xl border-2 text-left transition ${
                          selectedTemplate === template.id
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded-lg mb-2"
                          style={{ background: template.bgStyle }}
                        />
                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {isEnglish ? template.nameEn : template.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {isEnglish ? template.descriptionEn : template.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 自定义背景图片 */}
                {selectedTemplate === 'photo' && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <ImageIcon size={16} />
                      {isEnglish ? 'Background Image' : '背景图片'}
                    </h3>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBgImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-indigo-400 transition text-gray-600 dark:text-gray-400"
                    >
                      {customBgImage 
                        ? (isEnglish ? 'Change Image' : '更换图片')
                        : (isEnglish ? 'Upload Image' : '上传图片')}
                    </button>
                  </div>
                )}

                {/* 水印设置 */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Type size={16} />
                    {isEnglish ? 'Watermark Settings' : '水印设置'}
                  </h3>
                  
                  <label className="flex items-center gap-2 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watermark.enabled}
                      onChange={e => setWatermark(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {isEnglish ? 'Show Watermark' : '显示水印'}
                    </span>
                  </label>

                  {watermark.enabled && (
                    <>
                      <input
                        type="text"
                        value={watermark.text}
                        onChange={e => setWatermark(prev => ({ ...prev, text: e.target.value }))}
                        placeholder={isEnglish ? 'Watermark text' : '水印文字'}
                        className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                      />
                      
                      <div className="grid grid-cols-3 gap-1 mb-3">
                        {(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'] as const).map(pos => (
                          <button
                            key={pos}
                            onClick={() => setWatermark(prev => ({ ...prev, position: pos }))}
                            className={`p-2 text-xs rounded-lg border transition ${
                              watermark.position === pos
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {pos.replace('-', ' ')}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">{isEnglish ? 'Opacity' : '透明度'}</span>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={watermark.opacity}
                          onChange={e => setWatermark(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-500 w-8">{Math.round(watermark.opacity * 100)}%</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 中间：预览区 */}
            <div className={`flex-1 p-4 overflow-y-auto ${showPreview ? '' : 'hidden'}`}>
              <div className="flex justify-center">
                {/* 日签预览卡片 */}
                <div
                  ref={signRef}
                  className="relative w-[320px] h-[480px] rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    background: selectedTemplate === 'photo' && customBgImage
                      ? `url(${customBgImage}) center/cover`
                      : currentTemplate.bgStyle,
                  }}
                >
                  {/* 背景遮罩（photo模板） */}
                  {selectedTemplate === 'photo' && (
                    <div className="absolute inset-0 bg-black/50" />
                  )}
                  
                  {/* 内容区 */}
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    {/* 顶部：日期 */}
                    <div className="text-center">
                      <div 
                        className="text-4xl font-black mb-1"
                        style={{ color: currentTemplate.textColor }}
                      >
                        {signData.date.split('-')[2]}
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: currentTemplate.accentColor }}
                      >
                        {signData.date.split('-').slice(0, 2).join('/')} · {signData.weekDay}
                      </div>
                      <div 
                        className="text-xs mt-1"
                        style={{ color: currentTemplate.accentColor, opacity: 0.8 }}
                      >
                        {signData.lunarDate}
                      </div>
                    </div>

                    {/* 中间：核心内容 */}
                    <div className="text-center">
                      <div className="text-6xl mb-4">{signData.emoji}</div>
                      <div 
                        className="text-3xl font-black mb-2"
                        style={{ color: currentTemplate.textColor }}
                      >
                        {signData.keyword}
                      </div>
                      <div 
                        className="text-sm leading-relaxed px-4"
                        style={{ color: currentTemplate.accentColor }}
                      >
                        {signData.description}
                      </div>
                    </div>

                    {/* 底部：评分和八字 */}
                    <div>
                      {/* 评分 */}
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div 
                          className="text-5xl font-black"
                          style={{ color: getScoreColor(signData.score) }}
                        >
                          {signData.score}
                        </div>
                        <div 
                          className="text-sm"
                          style={{ color: currentTemplate.accentColor }}
                        >
                          {isEnglish ? 'pts' : '分'}
                        </div>
                      </div>

                      {/* 八字（简化显示） */}
                      {signData.baziDetail && (
                        <div 
                          className="flex justify-center gap-3 text-xs"
                          style={{ color: currentTemplate.accentColor, opacity: 0.7 }}
                        >
                          <span>{signData.baziDetail.year}</span>
                          <span>{signData.baziDetail.month}</span>
                          <span>{signData.baziDetail.day}</span>
                        </div>
                      )}
                    </div>

                    {/* 水印 */}
                    {watermark.enabled && (
                      <div
                        className={`absolute ${getWatermarkPosition()}`}
                        style={{
                          color: currentTemplate.accentColor,
                          opacity: watermark.opacity,
                          fontSize: `${watermark.fontSize}px`,
                        }}
                      >
                        {watermark.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：操作区 */}
            <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-4">
              {/* 生成按钮 */}
              <button
                onClick={() => generateImage()}
                disabled={isGenerating}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {isEnglish ? 'Generating...' : '生成中...'}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    {isEnglish ? 'Generate Image' : '生成图片'}
                  </>
                )}
              </button>

              {/* 已生成图片的操作 */}
              {generatedImage && (
                <div className="mt-4 space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={downloadImage}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition flex items-center justify-center gap-1"
                    >
                      <Download size={16} />
                      {isEnglish ? 'Download' : '下载'}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition flex items-center justify-center gap-1"
                    >
                      <Copy size={16} />
                      {isEnglish ? 'Copy' : '复制'}
                    </button>
                  </div>

                  {/* 社交分享 */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="text-xs font-bold text-gray-500 mb-2">
                      {isEnglish ? 'Share to' : '分享到'}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => shareToSocial('twitter')}
                        className="p-2 rounded-lg bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white transition"
                        title="Twitter"
                      >
                        <Twitter size={18} />
                      </button>
                      <button
                        onClick={() => shareToSocial('facebook')}
                        className="p-2 rounded-lg bg-[#4267B2] hover:bg-[#365899] text-white transition"
                        title="Facebook"
                      >
                        <Facebook size={18} />
                      </button>
                      <button
                        onClick={() => shareToSocial('weibo')}
                        className="p-2 rounded-lg bg-[#E6162D] hover:bg-[#cc1428] text-white transition"
                        title="微博"
                      >
                        <Send size={18} />
                      </button>
                      <button
                        onClick={() => shareToSocial('wechat')}
                        className="p-2 rounded-lg bg-[#07C160] hover:bg-[#06ad56] text-white transition"
                        title="微信"
                      >
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  </div>

                  {/* 生成的图片预览 */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="text-xs font-bold text-gray-500 mb-2">
                      {isEnglish ? 'Generated Image' : '生成的图片'}
                    </div>
                    <img
                      src={generatedImage}
                      alt="Generated sign"
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
