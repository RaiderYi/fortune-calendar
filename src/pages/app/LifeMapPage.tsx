// ==========================================
// 人生大图景 - 功能页
// ==========================================

import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../contexts/AppContext';
import LifeMapContent from '../../components/LifeMapContent';

export default function LifeMapPage() {
  const { t, i18n } = useTranslation(['ui', 'fortune']);
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const { userProfile, setCurrentDate } = useAppContext();

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F7] dark:bg-slate-900">
      {/* 头部 */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 lg:p-6">
        <div className="flex items-center gap-3">
          <Link
            to="/app/today"
            className="p-2 hover:bg-white/20 rounded-full transition"
            aria-label={isEnglish ? 'Back' : '返回'}
          >
            <ChevronLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <TrendingUp size={24} />
            <h2 className="text-xl font-bold">{t('ui:lifemap.title')}</h2>
          </div>
        </div>
        <p className="text-sm opacity-90 mt-1 pl-11">{t('ui:lifemap.description')}</p>
      </div>

      {/* 内容 */}
      <LifeMapContent
        userProfile={userProfile}
        onOpenYongShenSettings={() => navigate('/app/today')}
        onViewToday={() => {
          setCurrentDate(new Date());
          navigate('/app/today');
        }}
      />
    </div>
  );
}
