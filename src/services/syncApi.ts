// ==========================================
// 同步API服务 - 数据上传/下载/冲突解决
// ==========================================

import { authenticatedFetch, TokenManager } from './authApi';

const API_BASE = '/api';

// 上传数据
export async function uploadData(
  type: 'profile' | 'settings' | 'history' | 'achievements' | 'stick_history',
  data: any,
  checksum: string,
  timestamp: number
) {
  const response = await authenticatedFetch(`${API_BASE}/sync/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, data, checksum, timestamp }),
  });
  return response.json();
}

// 批量上传
export async function batchUpload(batch: Array<{
  type: string;
  data: any;
  checksum: string;
  timestamp: number;
}>) {
  const response = await authenticatedFetch(`${API_BASE}/sync/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ batch }),
  });
  return response.json();
}

// 下载数据
export async function downloadData(type?: string) {
  const url = type 
    ? `${API_BASE}/sync/download?type=${type}`
    : `${API_BASE}/sync/download`;
  
  const response = await authenticatedFetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

// 检测冲突
export async function detectConflicts(localData: Record<string, any>) {
  const response = await authenticatedFetch(`${API_BASE}/sync/conflicts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ localData }),
  });
  return response.json();
}

// 解决冲突
export async function resolveConflicts(resolutions: Array<{
  type: string;
  strategy: 'local' | 'cloud' | 'merge';
  data?: any;
  checksum?: string;
}>) {
  const response = await authenticatedFetch(`${API_BASE}/sync/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resolutions }),
  });
  return response.json();
}

// 获取同步状态
export async function getSyncStatus() {
  const response = await authenticatedFetch(`${API_BASE}/sync/status`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

// 清除云端数据
export async function clearCloudData() {
  const response = await authenticatedFetch(`${API_BASE}/sync/clear`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}
