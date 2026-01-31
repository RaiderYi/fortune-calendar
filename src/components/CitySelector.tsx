// ==========================================
// 城市选择器组件（支持搜索和省份分组）
// ==========================================

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X } from 'lucide-react';
import { CITIES_BY_PROVINCE, ALL_CITIES, searchCities, type CityData } from '../utils/cityData';

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
  longitude: string;
  onLongitudeChange: (longitude: string) => void;
}

export default function CitySelector({
  value,
  onChange,
  longitude,
  onLongitudeChange
}: CitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [viewMode, setViewMode] = useState<'search' | 'province'>('search');

  // 搜索模式下的城市列表
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return searchCities(searchQuery);
  }, [searchQuery]);

  // 省份列表（按字母排序）
  const provinces = useMemo(() => {
    return Object.keys(CITIES_BY_PROVINCE).sort((a, b) => 
      a.localeCompare(b, 'zh-CN')
    );
  }, []);

  // 处理城市选择
  const handleCitySelect = (city: CityData) => {
    onChange(city.name);
    onLongitudeChange(city.longitude.toFixed(2));
    setShowSelector(false);
    setSearchQuery('');
  };

  // 获取当前城市名称
  const currentCityName = value || '请选择城市';

  return (
    <div>
      {/* 城市输入框 */}
      <motion.button
        onClick={() => setShowSelector(true)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base flex items-center justify-between"
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {currentCityName}
        </span>
        <MapPin size={18} className="text-gray-400" />
      </motion.button>

      {/* 经度显示 */}
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={longitude}
            onChange={(e) => onLongitudeChange(e.target.value)}
            placeholder="经度"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center"
          />
          <span className="text-xs text-gray-400">°E</span>
        </div>
      )}

      {/* 城市选择器弹窗 */}
      <AnimatePresence>
        {showSelector && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
              onClick={() => setShowSelector(false)}
            />

            {/* 选择器 */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* 头部 */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">选择城市</h3>
                  <motion.button
                    onClick={() => setShowSelector(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} className="text-gray-500" />
                  </motion.button>
                </div>

                {/* 搜索框 */}
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setViewMode('search');
                    }}
                    placeholder="搜索城市或省份..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X size={16} className="text-gray-400" />
                    </motion.button>
                  )}
                </div>

                {/* 切换按钮 */}
                <div className="flex gap-2 mt-3">
                  <motion.button
                    onClick={() => {
                      setViewMode('search');
                      setSearchQuery('');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'search'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    搜索
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setViewMode('province');
                      setSearchQuery('');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'province'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    按省份
                  </motion.button>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="flex-1 overflow-y-auto p-4">
                {viewMode === 'search' ? (
                  <>
                    {searchQuery ? (
                      searchResults.length > 0 ? (
                        <div className="space-y-2">
                          {searchResults.map((city) => (
                            <motion.button
                              key={city.name}
                              onClick={() => handleCitySelect(city)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full p-3 rounded-xl text-left transition-colors ${
                                value === city.name
                                  ? 'bg-indigo-100 border-2 border-indigo-500'
                                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              <div className="font-medium text-gray-800">{city.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{city.province}</div>
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          未找到相关城市
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        输入城市名称或省份进行搜索
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    {provinces.map((province) => (
                      <div key={province}>
                        <h4 className="text-sm font-bold text-gray-500 mb-2 px-2">
                          {province}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {CITIES_BY_PROVINCE[province].map((city) => (
                            <motion.button
                              key={city.name}
                              onClick={() => handleCitySelect(city)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-3 rounded-xl text-left transition-colors ${
                                value === city.name
                                  ? 'bg-indigo-100 border-2 border-indigo-500'
                                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              <div className="font-medium text-sm text-gray-800">
                                {city.name}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
