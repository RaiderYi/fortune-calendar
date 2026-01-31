// ==========================================
// 个人档案设置组件
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { CITY_LONGITUDE_MAP } from '../utils/cityData';
import { getCurrentLocation, isGeolocationSupported } from '../utils/geolocation';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import CitySelector from './CitySelector';
import { useToast } from '../contexts/ToastContext';

export interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  city: string;
  longitude: string;
  gender: 'male' | 'female';
}

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export default function ProfileSettings({
  isOpen,
  onClose,
  profile,
  onSave
}: ProfileSettingsProps) {
  const { showToast } = useToast();
  const [editProfile, setEditProfile] = useState<UserProfile>(profile);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 城市选择处理
  const handleCityChange = (city: string) => {
    const lng = CITY_LONGITUDE_MAP[city];
    setEditProfile({
      ...editProfile,
      city: city,
      longitude: lng ? lng.toString() : editProfile.longitude
    });
  };

  // 保存设置
  const handleSave = () => {
    onSave(editProfile);
    onClose();
    showToast('个人档案已保存', 'success');
  };

  // 处理日期选择
  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setEditProfile({
      ...editProfile,
      birthDate: `${year}-${month}-${day}`
    });
    setShowDatePicker(false);
  };

  // 处理时间选择
  const handleTimeSelect = (hour: number, minute: number) => {
    const hourStr = String(hour).padStart(2, '0');
    const minuteStr = String(minute).padStart(2, '0');
    setEditProfile({
      ...editProfile,
      birthTime: `${hourStr}:${minuteStr}`
    });
    setShowTimePicker(false);
  };

  // 自动定位
  const handleAutoLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location.city) {
        setEditProfile({
          ...editProfile,
          city: location.city,
          longitude: location.longitude.toFixed(2)
        });
        showToast('定位成功', 'success');
      }
    } catch (error) {
      console.error('定位失败:', error);
      showToast('定位失败，请手动选择城市', 'error');
    }
  };

  // 解析日期字符串
  const parseDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // 解析时间字符串
  const parseTime = (timeStr: string): [number, number] => {
    const [hour, minute] = timeStr.split(':').map(Number);
    return [hour || 0, minute || 0];
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* 设置抽屉/Modal - 移动端底部抽屉，PC端居中Modal */}
            <motion.div
              initial={{ y: '100%', scale: 1 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: '100%', scale: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-4 bg-white lg:bg-transparent rounded-t-3xl lg:rounded-3xl shadow-2xl z-50 max-h-[90vh] lg:max-w-2xl lg:w-full overflow-hidden flex flex-col pointer-events-auto"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="bg-white lg:rounded-3xl lg:shadow-2xl lg:w-full lg:max-h-[90vh] flex flex-col overflow-hidden"
              >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold">个人档案</h3>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} className="text-gray-500" />
                </motion.button>
              </div>

              {/* 内容区域 - 可滚动 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* 昵称 */}
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">
                    昵称
                  </label>
                  <input
                    type="text"
                    value={editProfile.name}
                    onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                    placeholder="请输入昵称"
                  />
                </div>

                {/* 出生日期 */}
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">
                    出生日期
                  </label>
                  <motion.button
                    onClick={() => setShowDatePicker(true)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  >
                    {editProfile.birthDate || '请选择出生日期'}
                  </motion.button>
                </div>

                {/* 出生时间 */}
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">
                    出生时间
                  </label>
                  <motion.button
                    onClick={() => setShowTimePicker(true)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  >
                    {editProfile.birthTime || '请选择出生时间'}
                  </motion.button>
                </div>

                {/* 性别选择 */}
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">
                    性别 <span className="text-xs text-gray-400">(影响大运排序)</span>
                  </label>
                  <select
                    value={editProfile.gender}
                    onChange={e => setEditProfile({ ...editProfile, gender: e.target.value as 'male' | 'female' })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-base"
                  >
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>

                {/* 出生城市 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-gray-500">
                      出生城市 <span className="text-xs text-gray-400">(真太阳时校准)</span>
                    </label>
                    {isGeolocationSupported() && (
                      <motion.button
                        onClick={handleAutoLocation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded hover:bg-indigo-50 transition"
                      >
                        <MapPin size={14} />
                        自动定位
                      </motion.button>
                    )}
                  </div>
                  <CitySelector
                    value={editProfile.city}
                    onChange={handleCityChange}
                    longitude={editProfile.longitude}
                    onLongitudeChange={(lng) => setEditProfile({ ...editProfile, longitude: lng })}
                  />
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition text-base"
                >
                  保存并重排运势
                </motion.button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  已支持 {Object.keys(CITY_LONGITUDE_MAP).length} 个城市，真太阳时校准
                </p>
              </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 日期选择器 */}
      {showDatePicker && (
        <DatePicker
          isOpen={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          value={editProfile.birthDate ? parseDate(editProfile.birthDate) : new Date()}
          onSelect={handleDateSelect}
        />
      )}

      {/* 时间选择器 */}
      {showTimePicker && (
        <TimePicker
          isOpen={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          value={parseTime(editProfile.birthTime)}
          onSelect={handleTimeSelect}
        />
      )}
    </>
  );
}
