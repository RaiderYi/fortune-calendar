// ==========================================
// 数据导出 - 导出历史、日记、反馈等
// ==========================================

import { getHistory } from './historyStorage';
import { getDiaryEntries } from './diaryStorage';
import { getAllFeedbacks } from './feedbackStorage';
import { getCheckinStats } from './checkinStorage';

export interface ExportData {
  exportDate: string;
  version: string;
  history: ReturnType<typeof getHistory>;
  diary: ReturnType<typeof getDiaryEntries>;
  feedback: ReturnType<typeof getAllFeedbacks>;
  checkinStats: ReturnType<typeof getCheckinStats>;
}

/**
 * 收集所有可导出的数据
 */
export function collectExportData(): ExportData {
  return {
    exportDate: new Date().toISOString(),
    version: '1.0',
    history: getHistory(),
    diary: getDiaryEntries(),
    feedback: getAllFeedbacks(),
    checkinStats: getCheckinStats(),
  };
}

/**
 * 导出为 JSON 并触发下载
 */
export function exportAsJson(): void {
  const data = collectExportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fortune-calendar-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 导出为 CSV（简化版：历史记录）
 */
export function exportAsCsv(): void {
  const data = collectExportData();
  const rows: string[] = [];
  rows.push('date,totalScore,keyword,timestamp');

  for (const record of data.history) {
    const score = record.fortune?.totalScore ?? '';
    const keyword = record.fortune?.mainTheme?.keyword ?? '';
    rows.push(`${record.date},${score},"${keyword}",${record.timestamp}`);
  }

  const csv = '\uFEFF' + rows.join('\n'); // BOM for Excel
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fortune-history-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
