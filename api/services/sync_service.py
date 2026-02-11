# -*- coding: utf-8 -*-
"""
数据同步服务 - Vercel KV 版本（同步实现）
支持增量同步、冲突解决、可关闭
"""

import os
import sys
import json
import hashlib
import time
from datetime import datetime
from typing import Dict, Any, List, Optional

try:
    from ..utils.kv_client import kv
except ImportError:
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from utils.kv_client import kv


class SyncService:
    """Vercel KV 版本同步服务（同步实现）"""
    
    # KV Key 前缀
    PREFIX_USER_DATA = "sync:user:{}:{}"  # sync:user:{user_id}:{data_type}
    PREFIX_SYNC_LOG = "sync:log:{}"       # sync:log:{user_id}
    
    @staticmethod
    def _run_async(coro):
        """运行异步协程并返回结果"""
        import asyncio
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(asyncio.run, coro)
                    return future.result()
            return loop.run_until_complete(coro)
        except RuntimeError:
            return asyncio.run(coro)
    
    @classmethod
    def get_user_data(cls, user_id: str, data_type: Optional[str] = None) -> Dict:
        """获取用户云端数据"""
        try:
            if data_type:
                key = cls.PREFIX_USER_DATA.format(user_id, data_type)
                data = cls._run_async(kv.get(key))
                return {
                    'success': True,
                    'data': data,
                    'type': data_type
                }
            
            result = {}
            for dtype in ['profile', 'settings', 'history', 'achievements', 'stick_history']:
                key = cls.PREFIX_USER_DATA.format(user_id, dtype)
                data = cls._run_async(kv.get(key))
                if data:
                    result[dtype] = data
            
            return {
                'success': True,
                **result
            }
            
        except Exception as e:
            print(f"[Get User Data Error] {e}")
            return {'success': False, 'error': str(e)}
    
    @classmethod
    def upload_data(cls, user_id: str, data_type: str, data: Any, 
                    checksum: str, timestamp: int) -> Dict:
        """上传数据到云端"""
        try:
            data_str = json.dumps(data, sort_keys=True)
            computed_checksum = hashlib.md5(data_str.encode()).hexdigest()
            
            if computed_checksum != checksum:
                return {'success': False, 'error': '数据校验失败，请重试'}
            
            data_with_meta = {
                'data': data,
                'checksum': checksum,
                'timestamp': timestamp,
                'uploaded_at': datetime.utcnow().isoformat()
            }
            
            key = cls.PREFIX_USER_DATA.format(user_id, data_type)
            success = cls._run_async(kv.set(key, data_with_meta))
            
            if not success:
                return {'success': False, 'error': '存储失败'}
            
            cls._log_sync(user_id, data_type, 'upload', timestamp)
            
            return {
                'success': True,
                'message': '同步成功',
                'type': data_type,
                'synced_at': data_with_meta['uploaded_at']
            }
            
        except Exception as e:
            print(f"[Upload Error] {e}")
            return {'success': False, 'error': str(e)}
    
    @classmethod
    def batch_upload(cls, user_id: str, batch_data: List[Dict]) -> Dict:
        """批量上传数据"""
        results = []
        
        for item in batch_data:
            result = cls.upload_data(
                user_id,
                item['type'],
                item['data'],
                item['checksum'],
                item['timestamp']
            )
            results.append(result)
        
        success_count = sum(1 for r in results if r.get('success'))
        
        return {
            'success': True,
            'total': len(batch_data),
            'success_count': success_count,
            'failed_count': len(batch_data) - success_count,
            'results': results
        }
    
    @classmethod
    def detect_conflicts(cls, user_id: str, local_data: Dict) -> Dict:
        """检测数据冲突"""
        try:
            conflicts = []
            
            for data_type in ['profile', 'settings', 'history', 'achievements']:
                local = local_data.get(data_type)
                if not local:
                    continue
                
                key = cls.PREFIX_USER_DATA.format(user_id, data_type)
                cloud_meta = cls._run_async(kv.get(key))
                
                if not cloud_meta:
                    continue
                
                cloud = cloud_meta.get('data')
                cloud_time = cloud_meta.get('timestamp', 0)
                local_time = local.get('updated_at', 0)
                
                if str(cloud_time) != str(local_time):
                    cloud_hash = hashlib.md5(json.dumps(cloud, sort_keys=True).encode()).hexdigest()
                    local_hash = hashlib.md5(json.dumps(local, sort_keys=True).encode()).hexdigest()
                    
                    if cloud_hash != local_hash:
                        conflicts.append({
                            'type': data_type,
                            'cloud_version': cloud_time,
                            'local_version': local_time,
                            'cloud_preview': cls._get_preview(cloud),
                            'local_preview': cls._get_preview(local)
                        })
            
            return {
                'has_conflicts': len(conflicts) > 0,
                'conflicts': conflicts
            }
            
        except Exception as e:
            print(f"[Detect Conflicts Error] {e}")
            return {'has_conflicts': False, 'conflicts': []}
    
    @classmethod
    def resolve_conflicts(cls, user_id: str, resolutions: List[Dict]) -> Dict:
        """解决数据冲突"""
        results = []
        
        for resolution in resolutions:
            data_type = resolution['type']
            strategy = resolution['strategy']
            
            if strategy == 'local':
                result = cls.upload_data(
                    user_id,
                    data_type,
                    resolution['data'],
                    resolution['checksum'],
                    int(time.time())
                )
                results.append(result)
                
            elif strategy == 'cloud':
                results.append({
                    'success': True,
                    'type': data_type,
                    'message': '使用云端版本'
                })
                
            elif strategy == 'merge':
                merged = resolution['data']
                result = cls.upload_data(
                    user_id,
                    data_type,
                    merged,
                    hashlib.md5(json.dumps(merged, sort_keys=True).encode()).hexdigest(),
                    int(time.time())
                )
                results.append(result)
        
        return {
            'success': True,
            'resolved': len(results),
            'results': results
        }
    
    @classmethod
    def get_sync_status(cls, user_id: str) -> Dict:
        """获取同步状态"""
        try:
            total_records = {}
            for dtype in ['history', 'stick_history', 'achievements']:
                key = cls.PREFIX_USER_DATA.format(user_id, dtype)
                data = cls._run_async(kv.get(key))
                if data and 'data' in data:
                    if isinstance(data['data'], list):
                        total_records[dtype] = len(data['data'])
                    else:
                        total_records[dtype] = 1
                else:
                    total_records[dtype] = 0
            
            log_key = cls.PREFIX_SYNC_LOG.format(user_id)
            logs = cls._run_async(kv.get(log_key)) or []
            
            return {
                'success': True,
                'total_records': total_records,
                'recent_syncs': logs[-10:] if isinstance(logs, list) else [],
                'storage_usage': cls._calculate_storage(user_id)
            }
            
        except Exception as e:
            print(f"[Sync Status Error] {e}")
            return {'success': False, 'error': str(e)}
    
    @classmethod
    def delete_user_data(cls, user_id: str) -> Dict:
        """删除用户所有云端数据"""
        try:
            for dtype in ['profile', 'settings', 'history', 'achievements', 'stick_history']:
                key = cls.PREFIX_USER_DATA.format(user_id, dtype)
                cls._run_async(kv.delete(key))
            
            cls._run_async(kv.delete(cls.PREFIX_SYNC_LOG.format(user_id)))
            
            return {'success': True, 'message': '数据已删除'}
            
        except Exception as e:
            print(f"[Delete Error] {e}")
            return {'success': False, 'error': str(e)}
    
    @classmethod
    def _log_sync(cls, user_id: str, data_type: str, action: str, timestamp: int):
        """记录同步日志"""
        try:
            key = cls.PREFIX_SYNC_LOG.format(user_id)
            logs = cls._run_async(kv.get(key)) or []
            
            if not isinstance(logs, list):
                logs = []
            
            logs.append({
                'type': data_type,
                'action': action,
                'timestamp': timestamp,
                'at': datetime.utcnow().isoformat()
            })
            
            logs = logs[-100:]
            cls._run_async(kv.set(key, logs))
            
        except Exception as e:
            print(f"[Log Sync Error] {e}")
    
    @classmethod
    def _calculate_storage(cls, user_id: str) -> Dict:
        """计算存储使用情况"""
        try:
            total_size = 0
            breakdown = {}
            
            for dtype in ['profile', 'settings', 'history', 'achievements', 'stick_history']:
                key = cls.PREFIX_USER_DATA.format(user_id, dtype)
                data = cls._run_async(kv.get(key))
                
                if data:
                    size = len(json.dumps(data).encode('utf-8'))
                    total_size += size
                    breakdown[dtype] = {'bytes': size, 'kb': round(size / 1024, 2)}
            
            return {
                'total_bytes': total_size,
                'total_kb': round(total_size / 1024, 2),
                'breakdown': breakdown
            }
            
        except Exception as e:
            return {'total_bytes': 0, 'total_kb': 0, 'breakdown': {}}
    
    @staticmethod
    def _get_preview(data: Any, max_length: int = 100) -> str:
        """获取数据预览"""
        data_str = json.dumps(data, ensure_ascii=False)
        if len(data_str) <= max_length:
            return data_str
        return data_str[:max_length] + '...'


# 全局同步服务实例
sync_service = SyncService()
