// ==========================================
// 用神喜忌编辑组件
// 统一展示与编辑逻辑，供 TodayPage 与桌面端复用
// ==========================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';

interface YongShenData {
  strength?: string;
  yongShen?: string[];
  xiShen?: string[];
  jiShen?: string[];
  isCustom?: boolean;
}

interface YongShenEditorProps {
  yongShen: YongShenData;
  onChange?: (value: string | string[] | null) => void;
  /** 是否使用深色模式样式（桌面端与移动端略有差异） */
  darkMode?: boolean;
  /** 术语点击回调（用于显示 BaziTermTooltip） */
  onTermClick?: (term: string) => void;
}

const ELEMENTS = [
  { value: '木', key: 'wood' },
  { value: '火', key: 'fire' },
  { value: '土', key: 'earth' },
  { value: '金', key: 'metal' },
  { value: '水', key: 'water' },
] as const;

export default function YongShenEditor({
  yongShen,
  onChange,
  darkMode = true,
  onTermClick,
}: YongShenEditorProps) {
  const { t } = useTranslation(['ui', 'bazi']);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<string[]>([]);

  const handleStartEdit = () => {
    setIsEditing(true);
    const current = yongShen?.yongShen && Array.isArray(yongShen.yongShen) ? yongShen.yongShen : [];
    setEditValues(current.length > 0 ? current : []);
  };

  const toggleElement = (value: string) => {
    setEditValues((prev) => {
      const has = prev.includes(value);
      if (has) return prev.filter((v) => v !== value);
      if (prev.length >= 2) return prev; // 最多选 2 个
      return [...prev, value];
    });
  };

  const handleSave = () => {
    if (editValues.length > 0 && onChange) {
      onChange(editValues.length === 1 ? editValues[0] : editValues);
      setIsEditing(false);
    }
  };

  const handleReset = () => {
    onChange?.(null);
    setIsEditing(false);
  };

  const strengthClass = darkMode
    ? (yongShen?.strength === '身旺' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
       yongShen?.strength === '身弱' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
       'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300')
    : (yongShen?.strength === '身旺' ? 'bg-red-100 text-red-700' :
       yongShen?.strength === '身弱' ? 'bg-blue-100 text-blue-700' :
       'bg-gray-100 text-gray-700');

  const TermEl = onTermClick
    ? ({ term, className = '' }: { term: string; className?: string }) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onTermClick(term); }}
          className={`${className} hover:opacity-80 transition cursor-pointer`}
        >
          {term}
        </button>
      )
    : ({ term, className = '' }: { term: string; className?: string }) => <span className={className}>{term}</span>;

  const tagClass = darkMode
    ? 'px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold'
    : 'px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold';
  const xiClass = darkMode
    ? 'px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold'
    : 'px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold';
  const jiClass = darkMode
    ? 'px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-bold'
    : 'px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold';

  return (
    <CollapsibleSection
      title={t('ui:todayPage.yongShenXiJi')}
      icon={<TrendingUp size={14} />}
      defaultExpanded={true}
      headerAction={
        onChange ? (
          !isEditing ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartEdit();
              }}
              className={`text-sm px-4 py-2 rounded-lg cursor-pointer font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap ${
                darkMode
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
              }`}
              type="button"
            >
              ✏️ {t('ui:todayPage.editYongShen')}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
              className={`text-sm px-4 py-2 rounded-lg cursor-pointer font-semibold transition-all shadow-md whitespace-nowrap ${
                darkMode ? 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
              } text-white`}
              type="button"
            >
              {t('ui:todayPage.cancel')}
            </button>
          )
        ) : undefined
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className={`text-[10px] mb-2 ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>
            {t('ui:todayPage.dayMasterStrength')}
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${strengthClass}`}>
            {yongShen?.strength === '身旺' ? t('bazi:strength.strong') :
             yongShen?.strength === '身弱' ? t('bazi:strength.weak') :
             yongShen?.strength || '未知'}
          </div>
        </div>
        <div className="col-span-2">
          <div className={`text-[10px] mb-2 flex items-center justify-between ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>
            <TermEl term={t('bazi:terms.yongShen')} className={darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'} />
            <div className="flex items-center gap-2">
              {yongShen?.isCustom && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  darkMode ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-orange-100 text-orange-600'
                }`}>
                  {t('ui:todayPage.custom')}
                </span>
              )}
            </div>
          </div>
          {isEditing && onChange ? (
            <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-wrap gap-2">
                {ELEMENTS.map(({ value, key }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition ${
                      editValues.includes(value)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={editValues.includes(value)}
                      onChange={() => toggleElement(value)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">{t(`bazi:elements.${key}`)}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('ui:todayPage.selectYongShenHint')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  disabled={editValues.length === 0}
                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                  type="button"
                >
                  {t('ui:todayPage.save')}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                  type="button"
                >
                  {t('ui:todayPage.reset')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {yongShen?.yongShen && yongShen.yongShen.length > 0 ? (
                (Array.isArray(yongShen.yongShen) ? yongShen.yongShen : []).map((elem, idx) => (
                  <TermEl key={idx} term={elem} className={tagClass} />
                ))
              ) : (
                <span className={`text-xs ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>
                  {t('ui:todayPage.noData')}
                </span>
              )}
            </div>
          )}
        </div>
        <div>
          <div className={`text-[10px] mb-2 ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>
            <TermEl term={t('bazi:terms.xiShen')} className={darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'} />
          </div>
          <div className="flex flex-wrap gap-1">
            {yongShen?.xiShen && yongShen.xiShen.length > 0 ? (
              (Array.isArray(yongShen.xiShen) ? yongShen.xiShen : []).map((elem, idx) => (
                <TermEl key={idx} term={elem} className={xiClass} />
              ))
            ) : (
              <span className={`text-xs ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>
                {t('ui:todayPage.noData')}
              </span>
            )}
          </div>
        </div>
        <div>
          <div className={`text-[10px] mb-2 ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>
            <TermEl term={t('bazi:terms.jiShen')} className={darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'} />
          </div>
          <div className="flex flex-wrap gap-1">
            {yongShen?.jiShen && yongShen.jiShen.length > 0 ? (
              (Array.isArray(yongShen.jiShen) ? yongShen.jiShen : []).map((elem, idx) => (
                <TermEl key={idx} term={elem} className={jiClass} />
              ))
            ) : (
              <span className={`text-xs ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>
                {t('ui:todayPage.noData')}
              </span>
            )}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
