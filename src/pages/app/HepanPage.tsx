// ==========================================
// 八字合盘
// ==========================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Users, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { postHepan } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const PARTNER_KEY = 'partner_profile';

interface P {
  birthDate: string;
  birthTime: string;
  longitude: string;
  gender: string;
}

function loadJson<T>(key: string): T | null {
  try {
    const r = localStorage.getItem(key);
    return r ? (JSON.parse(r) as T) : null;
  } catch {
    return null;
  }
}

export default function HepanPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [a, setA] = useState<P>({
    birthDate: '',
    birthTime: '12:00',
    longitude: '116.40',
    gender: 'male',
  });
  const [b, setB] = useState<P>({
    birthDate: '',
    birthTime: '12:00',
    longitude: '116.40',
    gender: 'female',
  });
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const me = loadJson<Record<string, string>>('user_profile');
    if (me?.birthDate) {
      setA({
        birthDate: me.birthDate,
        birthTime: me.birthTime || '12:00',
        longitude: String(me.longitude ?? '116.40'),
        gender: me.gender || 'male',
      });
    }
    const p = loadJson<P>(PARTNER_KEY);
    if (p?.birthDate) setB(p);
  }, []);

  const savePartner = () => {
    localStorage.setItem(PARTNER_KEY, JSON.stringify(b));
    showToast(isEnglish ? 'Saved' : '已保存对方档案', 'success');
  };

  const run = async () => {
    if (!a.birthDate || !b.birthDate) {
      showToast(isEnglish ? 'Fill both birth dates' : '请填写双方出生日期', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await postHepan({ personA: a, personB: b });
      if (res.success && res.data) {
        setResult(res.data as Record<string, unknown>);
      } else {
        showToast(res.error || 'Error', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const scores = result?.scores as Record<string, number> | undefined;
  const points = (result?.summaryPoints as string[]) || [];

  return (
    <div className="min-h-full bg-[#F5F5F7] dark:bg-slate-900 pb-24">
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-4 flex items-center gap-3">
        <Link to="/app/fortune/today">
          <ChevronLeft size={24} />
        </Link>
        <Users size={22} />
        <h1 className="text-lg font-bold">{isEnglish ? 'Bazi Synastry' : '八字合盘'}</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isEnglish
            ? 'Heuristic compatibility for two birth charts. Entertainment only.'
            : '基于双人八字的启发式契合度分析，仅供娱乐参考。'}
        </p>

        <fieldset className="bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-slate-700">
          <legend className="text-sm font-bold px-2">{isEnglish ? 'You' : '我'}</legend>
          <input
            type="date"
            value={a.birthDate}
            onChange={(e) => setA({ ...a, birthDate: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          />
          <input
            type="time"
            value={a.birthTime}
            onChange={(e) => setA({ ...a, birthTime: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          />
          <input
            type="text"
            placeholder="longitude"
            value={a.longitude}
            onChange={(e) => setA({ ...a, longitude: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          />
          <select
            value={a.gender}
            onChange={(e) => setA({ ...a, gender: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          >
            <option value="male">{isEnglish ? 'Male' : '男'}</option>
            <option value="female">{isEnglish ? 'Female' : '女'}</option>
          </select>
        </fieldset>

        <fieldset className="bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-slate-700">
          <legend className="text-sm font-bold px-2">{isEnglish ? 'Partner' : '对方'}</legend>
          <input
            type="date"
            value={b.birthDate}
            onChange={(e) => setB({ ...b, birthDate: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          />
          <input
            type="time"
            value={b.birthTime}
            onChange={(e) => setB({ ...b, birthTime: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          />
          <input
            type="text"
            placeholder="longitude"
            value={b.longitude}
            onChange={(e) => setB({ ...b, longitude: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          />
          <select
            value={b.gender}
            onChange={(e) => setB({ ...b, gender: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          >
            <option value="male">{isEnglish ? 'Male' : '男'}</option>
            <option value="female">{isEnglish ? 'Female' : '女'}</option>
          </select>
          <button
            type="button"
            onClick={savePartner}
            className="text-sm text-rose-600 font-medium"
          >
            {isEnglish ? 'Save partner profile' : '保存对方档案到本机'}
          </button>
        </fieldset>

        <button
          type="button"
          disabled={loading}
          onClick={run}
          className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold flex justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : null}
          {isEnglish ? 'Analyze' : '开始合盘'}
        </button>

        {scores && (
          <div className="grid grid-cols-2 gap-3">
            {(['overall', 'communication', 'romance', 'stability'] as const).map((k) => (
              <div key={k} className="bg-white dark:bg-slate-800 rounded-xl p-4 border dark:border-slate-700">
                <div className="text-xs text-gray-500">
                  {k === 'overall'
                    ? isEnglish
                      ? 'Overall'
                      : '综合'
                    : k === 'communication'
                      ? isEnglish
                        ? 'Talk'
                        : '沟通'
                      : k === 'romance'
                        ? isEnglish
                          ? 'Romance'
                          : '情感'
                        : isEnglish
                          ? 'Stable'
                          : '稳定'}
                </div>
                <div className="text-2xl font-black text-rose-600">{scores[k]}</div>
              </div>
            ))}
          </div>
        )}

        {points.length > 0 && (
          <ul className="bg-white dark:bg-slate-800 rounded-xl p-4 text-sm space-y-2 list-disc pl-5 dark:border-slate-700 border">
            {points.map((p, i) => (
              <li key={`${i}-${p.slice(0, 12)}`}>{p}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
