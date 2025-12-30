import { Settings, Sparkles } from 'lucide-react';

interface HeaderProps {
  userName: string;
  onSettingsClick: () => void;
}

export default function Header({ userName, onSettingsClick }: HeaderProps) {
  return (
    <div className="px-6 pt-12 pb-4 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold tracking-tight">
          你好，<span className="text-indigo-600">{userName}</span>
        </h1>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Sparkles size={10} /> 这里的每一天都为你定制
        </div>
      </div>
      <button
        onClick={onSettingsClick}
        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition active:scale-90"
      >
        <Settings size={20} className="text-gray-600" />
      </button>
    </div>
  );
}