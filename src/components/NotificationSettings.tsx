// ==========================================
// 通知设置组件
// 管理运势提醒和通知设置
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, BellOff, Clock, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../hooks/useNotification';
import { useToast } from '../contexts/ToastContext';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationSettings({
  isOpen,
  onClose,
}: NotificationSettingsProps) {
  const { t } = useTranslation('ui');
  const { showToast } = useToast();
  const {
    settings,
    permission,
    supported,
    requestPermission,
    updateSettings,
  } = useNotification();

  const [localSettings, setLocalSettings] = useState(settings);
  const [timeValue, setTimeValue] = useState(settings.dailyTime);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
      setTimeValue(settings.dailyTime);
    }
  }, [isOpen, settings]);

  const handleToggleEnabled = () => {
    if (!localSettings.enabled && permission !== 'granted') {
      // 如果启用但未授权，先请求权限
      requestPermission().then((granted) => {
        if (granted) {
          setLocalSettings({ ...localSettings, enabled: true });
        } else {
          showToast(t('notificationSettings.permissionRequired'), 'error');
        }
      });
    } else {
      setLocalSettings({ ...localSettings, enabled: !localSettings.enabled });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value);
  };

  const handleTypeToggle = (type: string) => {
    const types = localSettings.types.includes(type)
      ? localSettings.types.filter(t => t !== type)
      : [...localSettings.types, type];
    setLocalSettings({ ...localSettings, types });
  };

  const handleSave = () => {
    updateSettings({
      ...localSettings,
      dailyTime: timeValue,
    });
    showToast(t('notificationSettings.saved'), 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 遮罩层 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* 设置面板 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* 头部 */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{t('notificationSettings.title')}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-6 space-y-6">
            {/* 浏览器支持检查 */}
            {!supported && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {t('notificationSettings.browserNotSupported')}
                </p>
              </div>
            )}

            {/* 权限状态 */}
            {supported && permission !== 'granted' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  {permission === 'default'
                    ? t('notificationSettings.permissionPrompt')
                    : t('notificationSettings.permissionDenied')}
                </p>
                {permission === 'default' && (
                  <button
                    onClick={requestPermission}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    {t('notificationSettings.grantPermission')}
                  </button>
                )}
              </div>
            )}

            {/* 总开关 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                {localSettings.enabled ? (
                  <Bell size={24} className="text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <BellOff size={24} className="text-gray-400" />
                )}
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {t('notificationSettings.enableNotifications')}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('notificationSettings.enableDesc')}
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleEnabled}
                disabled={!supported || permission !== 'granted'}
                className={`relative w-14 h-8 rounded-full transition ${
                  localSettings.enabled
                    ? 'bg-indigo-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                } ${(!supported || permission !== 'granted') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <motion.div
                  animate={{
                    x: localSettings.enabled ? 24 : 4,
                  }}
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* 提醒时间 */}
            {localSettings.enabled && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={18} className="text-gray-500" />
                    {t('notificationSettings.dailyTime')}
                  </div>
                  <input
                    type="time"
                    value={timeValue}
                    onChange={handleTimeChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </label>
              </div>
            )}

            {/* 提醒类型 */}
            {localSettings.enabled && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('notificationSettings.reminderTypes')}
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'daily', label: t('notificationSettings.typeDaily'), desc: t('notificationSettings.typeDailyDesc') },
                    { id: 'solarTerms', label: t('notificationSettings.typeSolarTerms'), desc: t('notificationSettings.typeSolarTermsDesc') },
                    { id: 'important', label: t('notificationSettings.typeImportant'), desc: t('notificationSettings.typeImportantDesc') },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeToggle(type.id)}
                      className={`w-full p-4 rounded-xl border-2 transition text-left ${
                        localSettings.types.includes(type.id)
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {type.label}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {type.desc}
                          </div>
                        </div>
                        {localSettings.types.includes(type.id) && (
                          <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 保存按钮 */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
              >
                {t('notificationSettings.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium"
              >
                {t('notificationSettings.save')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
