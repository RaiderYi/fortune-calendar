// ==========================================
// 报告弹窗组件
// 包装 FortuneReport 组件
// ==========================================

import FortuneReport from './FortuneReport';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  period?: 'week' | 'month';
}

export default function ReportModal({ isOpen, onClose, period }: ReportModalProps) {
  return (
    <FortuneReport
      isOpen={isOpen}
      onClose={onClose}
      period={period}
    />
  );
}
