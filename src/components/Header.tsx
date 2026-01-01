import { Settings, Sparkles, Clock } from 'lucide-react';

interface HeaderProps {
  userName: string;
  onSettingsClick: () => void;
  onHistoryClick: () => void; // 新增
}

export default function Header({
  userName,
  onSettingsClick,
  onHistoryClick // 新增
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 pt-5">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-yellow-500" />
        <h1 className="text-xl font-black text-gray-800">
          {userName}，今日如何？
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* 历史按钮 */}
        <button
          onClick={onHistoryClick}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="历史记录"
        >
          <Clock size={20} className="text-gray-600" />
        </button>

        {/* 设置按钮 */}
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="设置"
        >
          <Settings size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}