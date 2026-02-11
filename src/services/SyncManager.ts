// ==========================================
// 智能同步管理器 - 本地存储 + 云端同步
// 支持增量同步、冲突解决、可开关
// ==========================================

import * as syncApi from './syncApi';
import { isLoggedIn } from './authApi';

// 数据类型定义
type DataType = 'profile' | 'settings' | 'history' | 'achievements' | 'stick_history';

// 同步任务
interface SyncTask {
  type: DataType;
  id?: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

// 本地存储封装
class LocalStorageManager {
  private prefix = 'fortune_';

  get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  set(key: string, data: any) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  remove(key: string) {
    localStorage.removeItem(this.prefix + key);
  }

  // IndexedDB用于大数据
  async getIndexedDB<T>(store: string, key: string): Promise<T | null> {
    return new Promise((resolve) => {
      const request = indexedDB.open('FortuneCalendar', 1);
      
      request.onerror = () => resolve(null);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([store], 'readonly');
        const objectStore = transaction.objectStore(store);
        const getRequest = objectStore.get(key);
        
        getRequest.onsuccess = () => resolve(getRequest.result || null);
        getRequest.onerror = () => resolve(null);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' });
        }
      };
    });
  }

  async setIndexedDB(store: string, data: any) {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('FortuneCalendar', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);
        const putRequest = objectStore.put(data);
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
}

// 同步管理器
export class SmartSyncManager {
  private localStore: LocalStorageManager;
  private syncQueue: SyncTask[] = [];
  private syncEnabled: boolean = true;
  private syncInterval: number = 5 * 60 * 1000; // 5分钟
  private timer: NodeJS.Timeout | null = null;

  constructor() {
    this.localStore = new LocalStorageManager();
    this.syncEnabled = this.localStore.get('sync_enabled') ?? true;
    this.startPeriodicSync();
  }

  // 设置同步开关
  setSyncEnabled(enabled: boolean) {
    this.syncEnabled = enabled;
    this.localStore.set('sync_enabled', enabled);
    
    if (enabled) {
      this.startPeriodicSync();
    } else {
      this.stopPeriodicSync();
    }
  }

  // 数据变更时调用
  async onDataChange(type: DataType, data: any, id?: string) {
    // 1. 保存到本地
    await this.saveToLocal(type, data, id);

    // 2. 如果未登录或未开启同步，直接返回
    if (!isLoggedIn() || !this.syncEnabled) return;

    // 3. 根据数据类型决定同步策略
    if (this.isCriticalData(type)) {
      // 关键数据：立即同步
      await this.syncImmediately(type, data, id);
    } else {
      // 普通数据：加入队列
      this.enqueueSync(type, data, id);
    }
  }

  // 用户登录时触发全量同步
  async onUserLogin(userId: string): Promise<void> {
    if (!this.syncEnabled) return;

    try {
      // 1. 下载云端数据
      const cloudData = await syncApi.downloadData();

      // 2. 获取本地数据
      const localData = await this.getAllLocalData();

      // 3. 检测冲突
      const conflicts = await syncApi.detectConflicts(localData);

      if (conflicts.hasConflicts) {
        // 有冲突，需要用户解决
        // 实际项目中这里应该触发UI提示
        console.log('Data conflicts detected:', conflicts.conflicts);
        // 自动合并策略：以时间戳为准
        await this.autoMergeConflicts(conflicts.conflicts, localData, cloudData.data);
      } else {
        // 无冲突，智能合并
        const merged = this.smartMerge(localData, cloudData.data);
        await this.saveToLocalBulk(merged);
        
        // 上传到云端
        await this.uploadAllData(merged);
      }
    } catch (error) {
      console.error('Sync on login failed:', error);
    }
  }

  // 保存到本地
  private async saveToLocal(type: DataType, data: any, id?: string) {
    const key = id ? `${type}_${id}` : type;
    
    // 添加时间戳
    const dataWithTimestamp = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (type === 'history' || type === 'stick_history') {
      // 大数据使用IndexedDB
      await this.localStore.setIndexedDB(type, dataWithTimestamp);
    } else {
      this.localStore.set(key, dataWithTimestamp);
    }
  }

  // 获取所有本地数据
  private async getAllLocalData(): Promise<Record<string, any>> {
    return {
      profile: this.localStore.get('profile'),
      settings: this.localStore.get('settings'),
      history: await this.localStore.getIndexedDB('history', 'all'),
      achievements: this.localStore.get('achievements'),
      stick_history: await this.localStore.getIndexedDB('stick_history', 'all'),
    };
  }

  // 批量保存到本地
  private async saveToLocalBulk(data: Record<string, any>) {
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        await this.saveToLocal(key as DataType, value);
      }
    }
  }

  // 关键数据判断
  private isCriticalData(type: DataType): boolean {
    return ['profile', 'settings'].includes(type);
  }

  // 立即同步
  private async syncImmediately(type: DataType, data: any, id?: string) {
    try {
      const checksum = this.computeChecksum(data);
      await syncApi.uploadData(type, data, checksum, Date.now());
    } catch (error) {
      // 失败则加入队列稍后重试
      this.enqueueSync(type, data, id);
    }
  }

  // 加入同步队列
  private enqueueSync(type: DataType, data: any, id?: string) {
    const existingIndex = this.syncQueue.findIndex(
      task => task.type === type && task.id === id
    );

    if (existingIndex >= 0) {
      // 更新已有任务
      this.syncQueue[existingIndex].data = data;
      this.syncQueue[existingIndex].timestamp = Date.now();
    } else {
      // 添加新任务
      this.syncQueue.push({
        type,
        id,
        data,
        timestamp: Date.now(),
        retryCount: 0,
      });
    }
  }

  // 启动定时同步
  private startPeriodicSync() {
    if (this.timer) return;

    this.timer = setInterval(async () => {
      if (!isLoggedIn() || !this.syncEnabled || this.syncQueue.length === 0) {
        return;
      }

      // 批量上传
      const batch = this.syncQueue.splice(0, 10);
      const batchData = batch.map(task => ({
        type: task.type,
        data: task.data,
        checksum: this.computeChecksum(task.data),
        timestamp: task.timestamp,
      }));

      try {
        await syncApi.batchUpload(batchData);
      } catch (error) {
        // 失败则放回队列
        batch.forEach(task => {
          task.retryCount++;
          if (task.retryCount < 3) {
            this.syncQueue.unshift(task);
          }
        });
      }
    }, this.syncInterval);
  }

  // 停止定时同步
  private stopPeriodicSync() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // 智能合并
  private smartMerge(local: Record<string, any>, cloud: Record<string, any>): Record<string, any> {
    const merged: Record<string, any> = {};

    for (const key of Object.keys({ ...local, ...cloud })) {
      const localItem = local[key];
      const cloudItem = cloud[key];

      if (!cloudItem) {
        merged[key] = localItem;
      } else if (!localItem) {
        merged[key] = cloudItem;
      } else {
        // 比较时间戳
        const localTime = new Date(localItem.updatedAt || 0).getTime();
        const cloudTime = new Date(cloudItem.updatedAt || 0).getTime();

        merged[key] = localTime > cloudTime ? localItem : cloudItem;
      }
    }

    return merged;
  }

  // 自动合并冲突
  private async autoMergeConflicts(
    conflicts: any[],
    localData: Record<string, any>,
    cloudData: Record<string, any>
  ) {
    const resolutions = conflicts.map(conflict => {
      const localTime = new Date(conflict.localVersion).getTime();
      const cloudTime = new Date(conflict.cloudVersion).getTime();

      return {
        type: conflict.type,
        strategy: localTime >= cloudTime ? ('local' as const) : ('cloud' as const),
        data: localTime >= cloudTime ? localData[conflict.type] : cloudData[conflict.type],
        checksum: this.computeChecksum(
          localTime >= cloudTime ? localData[conflict.type] : cloudData[conflict.type]
        ),
      };
    });

    await syncApi.resolveConflicts(resolutions);
  }

  // 上传所有数据
  private async uploadAllData(data: Record<string, any>) {
    const batchData = Object.entries(data)
      .filter(([_, value]) => value)
      .map(([type, value]) => ({
        type: type as DataType,
        data: value,
        checksum: this.computeChecksum(value),
        timestamp: Date.now(),
      }));

    if (batchData.length > 0) {
      await syncApi.batchUpload(batchData);
    }
  }

  // 计算校验和
  private computeChecksum(data: any): string {
    const str = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  // 清除本地数据（登出时）
  clearLocalData() {
    this.syncQueue = [];
    // 注意：这里不清除本地存储的数据，只清除同步队列
  }

  // 销毁
  destroy() {
    this.stopPeriodicSync();
  }
}

// 导出单例
export const syncManager = new SmartSyncManager();
