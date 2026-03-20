// ==========================================
// 首次使用引导：3 步内完成可排盘的最小档案（G-020）
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, UserCircle2, ArrowRight, X, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import CitySelector from './CitySelector';
import { CITY_LONGITUDE_MAP } from '../utils/cityData';
import { getCurrentLocation, isGeolocationSupported } from '../utils/geolocation';
import { useToast } from '../contexts/ToastContext';
import type { UserProfile } from './ProfileSettings';

export interface OnboardingProps {
  profile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onSkip: () => void;
}

const STEP_COUNT = 3;

export default function Onboarding({ profile, onComplete, onSkip }: OnboardingProps) {
  const { t } = useTranslation(['ui']);
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const parseDate = (dateStr: string): Date => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const parseTime = (timeStr: string): [number, number] => {
    const [h, m] = timeStr.split(':').map(Number);
    return [h || 0, m || 0];
  };

  const handleCityChange = (city: string) => {
    const lng = CITY_LONGITUDE_MAP[city];
    setDraft((prev) => ({
      ...prev,
      city,
      longitude: lng != null ? String(lng) : prev.longitude,
    }));
  };

  const handleAutoLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location.city) {
        setDraft((prev) => ({
          ...prev,
          city: location.city!,
          longitude: location.longitude.toFixed(2),
        }));
        showToast(t('ui:onboarding.locateOk', { defaultValue: '定位成功' }), 'success');
      }
    } catch (e) {
      console.error(e);
      showToast(t('ui:onboarding.locateFail', { defaultValue: '定位失败，请手动选择城市' }), 'error');
    }
  };

  const handleDateSelect = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setDraft((prev) => ({ ...prev, birthDate: `${y}-${m}-${d}` }));
    setShowDatePicker(false);
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    const h = String(hour).padStart(2, '0');
    const mi = String(minute).padStart(2, '0');
    setDraft((prev) => ({ ...prev, birthTime: `${h}:${mi}` }));
    setShowTimePicker(false);
  };

  const goNext = () => {
    if (step === 1) {
      if (!draft.birthDate?.trim() || !draft.birthTime?.trim()) {
        showToast(t('ui:onboarding.birthRequired'), 'warning');
        return;
      }
    }
    if (step < STEP_COUNT - 1) {
      setStep((s) => s + 1);
    }
  };

  const finish = () => {
    if (!draft.birthDate?.trim() || !draft.birthTime?.trim()) {
      showToast(t('ui:onboarding.birthRequired'), 'warning');
      setStep(1);
      return;
    }
    const longitude =
      draft.longitude?.trim() && !Number.isNaN(parseFloat(draft.longitude))
        ? draft.longitude
        : '120';
    const name =
      draft.name?.trim() ||
      t('ui:onboarding.defaultDisplayName', { defaultValue: '用户' });
    onComplete({
      ...draft,
      name,
      longitude,
      city: draft.city?.trim() ?? '',
    });
  };

  const gradients = [
    'from-violet-500 to-indigo-600',
    'from-sky-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
  ];
  const color = gradients[step];
  const isLast = step === STEP_COUNT - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className={`bg-gradient-to-r ${color} text-white p-6 relative shrink-0`}>
          <button
            type="button"
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
            aria-label={t('ui:onboarding.skip')}
          >
            <X size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-3 mb-4 pr-10">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
              {step === 0 && <Sparkles size={24} />}
              {step === 1 && <Calendar size={24} />}
              {step === 2 && <UserCircle2 size={24} />}
            </div>
            <div>
              <h2 id="onboarding-title" className="text-xl font-bold leading-tight">
                {step === 0 && t('ui:onboarding.welcome')}
                {step === 1 && t('ui:onboarding.birthStepTitle')}
                {step === 2 && t('ui:onboarding.extraStepTitle')}
              </h2>
              <p className="text-white/90 text-sm mt-1">
                {step === 0 && t('ui:onboarding.welcomeSub')}
                {step === 1 && t('ui:onboarding.birthStepSub')}
                {step === 2 && t('ui:onboarding.extraStepSub')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: STEP_COUNT }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {step === 0 && (
                <div className="text-center space-y-3 py-2">
                  <div className="text-5xl" aria-hidden>
                    📅
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('ui:onboarding.welcomeBody')}
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">
                      {t('ui:forms.birthDate')}
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => setShowDatePicker(true)}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-left text-base"
                    >
                      {draft.birthDate || t('ui:onboarding.pickDate')}
                    </motion.button>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">
                      {t('ui:forms.birthTime')}
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => setShowTimePicker(true)}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-left text-base"
                    >
                      {draft.birthTime || t('ui:onboarding.pickTime')}
                    </motion.button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">
                      {t('ui:forms.gender')}
                    </label>
                    <select
                      value={draft.gender}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          gender: e.target.value as 'male' | 'female',
                        }))
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base"
                    >
                      <option value="male">{t('ui:forms.male')}</option>
                      <option value="female">{t('ui:forms.female')}</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">{t('ui:onboarding.genderNote')}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-gray-500">
                        {t('ui:forms.city')}
                        <span className="text-xs font-normal text-gray-400 ml-1">
                          ({t('ui:onboarding.optional')})
                        </span>
                      </label>
                      {isGeolocationSupported() && (
                        <button
                          type="button"
                          onClick={handleAutoLocation}
                          className="flex items-center gap-1 text-xs text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50"
                        >
                          <MapPin size={14} />
                          {t('ui:onboarding.autoLocate')}
                        </button>
                      )}
                    </div>
                    <CitySelector
                      value={draft.city}
                      onChange={handleCityChange}
                      longitude={draft.longitude}
                      onLongitudeChange={(lng) =>
                        setDraft((p) => ({ ...p, longitude: lng }))
                      }
                    />
                    <p className="text-xs text-gray-400 mt-2">{t('ui:onboarding.cityHint')}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0 bg-white">
          <button
            type="button"
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 font-medium px-2 py-2"
          >
            {t('ui:onboarding.skip')}
          </button>
          {!isLast ? (
            <motion.button
              type="button"
              onClick={goNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-r ${color} text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2`}
            >
              {t('ui:onboarding.next')}
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={finish}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-r ${color} text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2`}
            >
              {t('ui:onboarding.finish')}
              <Sparkles size={18} />
            </motion.button>
          )}
        </div>
      </motion.div>

      {showDatePicker && (
        <DatePicker
          isOpen={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          value={draft.birthDate ? parseDate(draft.birthDate) : new Date(1990, 0, 1)}
          onSelect={handleDateSelect}
        />
      )}
      {showTimePicker && (
        <TimePicker
          isOpen={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          value={parseTime(draft.birthTime || '12:00')}
          onSelect={handleTimeSelect}
        />
      )}
    </motion.div>
  );
}
