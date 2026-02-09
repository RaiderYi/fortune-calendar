// ==========================================
// 打赏收款码 - 支持加载失败时显示占位
// ==========================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QrCode } from 'lucide-react';

interface DonateQRProps {
  className?: string;
}

export default function DonateQR({ className = '' }: DonateQRProps) {
  const { i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  const [imgError, setImgError] = useState(false);

  const containerClass =
    'w-[160px] h-[160px] mx-auto rounded-lg bg-white dark:bg-slate-800 p-2 border border-gray-200 dark:border-slate-600 flex items-center justify-center ' +
    className;

  if (imgError) {
    return (
      <div
        className={containerClass}
        title={isEnglish ? 'Add donate-qr.png to public folder' : '请将收款码放入 public/donate-qr.png'}
      >
        <div className="text-center text-gray-400 dark:text-gray-500">
          <QrCode size={48} className="mx-auto mb-2 opacity-50" />
          <span className="text-xs block">
            {isEnglish ? 'QR image not found' : '收款码未配置'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <img
        src="/donate-qr.png"
        alt={isEnglish ? 'Donation QR code' : '打赏收款码'}
        className="w-full h-full object-contain"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
