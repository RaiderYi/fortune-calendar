// ==========================================
// 人生大图景 - 功能页
// ==========================================

import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../contexts/AppContext';
import LifeMapContent from '../../components/LifeMapContent';
import { AppSubPageShell } from '../../components/layout/AppSubPageShell';

export default function LifeMapPage() {
  const { t } = useTranslation(['ui', 'fortune']);
  const navigate = useNavigate();
  const { userProfile, setCurrentDate } = useAppContext();

  return (
    <AppSubPageShell
      variant="light"
      lightTone="spectrum"
      title={t('ui:lifemap.title')}
      icon={TrendingUp}
      subtitle={t('ui:lifemap.description')}
      scrollable={false}
      contentClassName="!p-0 lg:!p-0 flex min-h-0 flex-1 flex-col"
    >
      <LifeMapContent
        userProfile={userProfile}
        onOpenYongShenSettings={() => navigate('/app/fortune/today')}
        onViewToday={() => {
          setCurrentDate(new Date());
          navigate('/app/fortune/today');
        }}
      />
    </AppSubPageShell>
  );
}
