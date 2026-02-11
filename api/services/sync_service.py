# -*- coding: utf-8 -*-
"""
数据同步服务 - Vercel KV 版本
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
    """Vercel KV 版本同步服务"""
    
    # KV Key 前缀
    PREFIX_USER_DATA = "sync:user:{}:{}"  # sync:user:{user_id}:{data_type}
    PREFIX_SYNC_LOG = "sync:log:{}"       # sync:log:{user_id}
    
    @classmethod
    async def get_user_data(cls, user_id: str, data_type: Optional[str] = None) -> Dict:
        """获取用户云端数据"""
        try:
            if data_type:
                # 获取特定类型
                key = cls.PREFIX_USER_DATA.format(user_id, data_type)
                data = await kv.get(key)
                return {
                    'success': True,
                    'data': data,
                    'type': data_type
                }
            
            # 获取所有类型
            result = {}
            for dtype in ['profile', 'settings', 'history', 'achievements', 'stick_history']:
                key = cls.PREFIX_USER_DATA.format(user_id, dtype)
                data = await kv.get(key)
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
    async def upload_data(cls, user_id: str, data_type: str, data: Any, 
                          checksum: str, timestamp: int) -> Dict:
        """上传数据到云端"""
        try:
            # 验证checksum
            data_str = json.dumps(data, sort_keys=True)
            computed_checksum = hashlib.md5(data_str.encode()).hexdigest()
            
            if computed_checksum != checksum:
                return {
                    'success': False,
                    'error': '数据校验失败，请重试'
                }
            
            # 添加元数据
            data_with_meta = {
                'data': data,
                'checksum': checksum,
                'timestamp': timestamp,
                'uploaded_at': datetime.utcnow().isoformat()
            }
            
            # 保存到 KV
            key = cls.PREFIX_USER_DATA.format(user_id, data_type)
            success = await kv.set(key, data_with_meta)
            
            if not success:
                return {'success': False, 'error': '存储失败'}
            
            # 记录同步日志
            await cls._log_sync(user_id, data_type, 'upload', timestamp)
            
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
    async def batch_upload(cls, user_id: str, batch_data: List[Dict]) -> Dict:
        """批量上传数据"""
        results = []
        
        for item in batch_data:
            result = await cls.upload_data(
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
    async def detect_conflicts(cls, user_id: str, local_data: Dict) -> Dict:
        """检测数据冲突"""
        try:
            conflicts = []
            
            for data_type in ['profile', 'settings', 'history', 'achievements']:
                local = local_data.get(data_type)
                if not local:
                    continue
                
                # 获取云端数据
                key = cls.PREFIX_USER_DATA.format(user_id, data_type)
                cloud_meta = await kv.get(key)
                
                if not cloud_meta:
                    continue
                
                cloud = cloud_meta.get('data')
                cloud_time = cloud_meta.get('timestamp', 0)
                local_time = local.get('updated_at', 0)
                
                # 如果本地时间戳较新，可能不需要处理
                # 如果时间戳不同且数据不同，则可能有冲突
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
    async def resolve_conflicts(cls, user_id: str, resolutions: List[Dict]) -> Dict:
        """解决数据冲突"""
        results = []
        
        for resolution in resolutions:
            data_type = resolution['type']
            strategy = resolution['strategy']
            
            if strategy == 'local':
                # 使用本地数据上传
                result = await cls.upload_data(
                    user_id,
                    data_type,
                    resolution['data'],
                    resolution['checksum'],
                    int(time.time())
                )
                results.append(result)
                
            elif strategy == 'cloud':
                # 使用云端数据
                results.append({
                    'success': True,
                    'type': data_type,
                    'message': '使用云端版本'
                })
                
            elif strategy == 'merge':
                # 合并数据（简单合并，实际可能需要更复杂的逻辑）
                merged = resolution['data']
                result = await cls.upload_data(
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
    async def get_sync_status(cls, user_id: str) -> Dict:
        """获取同步状态"""
        try:
            # 获取所有数据类型
            total_records = {}
            for dtype in ['history', 'stick_history', 'achievements']:
                key = cls.PREFIX_USER_DATA.format(user_id, dtype)
                data = await kv.get(key)
                if data and 'data' in data:
                    if isinstance(data['data'], list):
                        total_records[dtype] = len(data['data'])
                    else:
                        total_records[dtype] = 1
                else:
                    total_records[dtype] = 0
            
            # 获取同步日志
            log_key = cls.PREFIX_SYNC_LOG.format(user_id)
            logs = await kv.get(log_key) or []
            
            return {
                'success': True,
                'total_records': total_records,
                'recent_syncs': logs[-10:] if isinstance(logs, list) else [],
                'storage_usage': await cls._calculate_storage(user_id)
            }
            
        except Exception as e:
            print(f"[Sync Status Error] {e}")
            return {'success': False, 'error': str(e)}
    
    @classmethod
    async def delete_user_data(cls, user_id: str) -> Dict:
        """删除用户所有云端数据（账号注销）"""
        try:
            # 删除所有数据类型
            for dtype in ['profile', 'settings', 'history', 'achievements', 'stick_history']:
                key = cls.PREFIX_USER_DATA.format(user_id, dtype)
                await kv.delete(key)
            
            # 删除同步日志
            await kv.delete(cls.PREFIX_SYNC_LOG.format(user_id))
            
            return {'success': True, 'message': '数据已删除'}
            
        except Exception as e:
            print(f"[Delete Error] {e}")
            return {'success': False, 'error': str(e)}
    
    @classmethod
    async def _log_sync(cls, user_id: str, data_type: str, action: str, timestamp: int):
        """记录同步日志"""
        try:
            key = cls.PREFIX_SYNC_LOG.format(user_id)
            logs = await kv.get(key) or []
            
            if not isinstance(logs, list):
                logs = []
            
            logs.append({
                'type': data_type,
                'action': action,
                'timestamp': timestamp,
                'at': datetime.utcnow().isoformat()
            })
            
            # 只保留最近100条
            logs = logs[-100:]
            
            await kv.set(key, logs)
            
        except Exception as e:
            print(f"[Log Sync Error] {e}")
    
    @classmethod
    async def _calculate_storage(cls, user_id: str) -> Dict:
        """计算存储使用情况"""
        try:
            total_size = 0
            breakdown = {}
            
            for dtype in ['profile', 'settings', 'history', 'achievements', 'stick_history']:
                key = cls.PREFIX_USER_DATA.format(user_id, dtype)
                data = await kv.get(key)
                
                if data:
                    size = len(json.dumps(data).encode('utf-8'))
                    total_size += size
                    breakdown[dtype] = {
                        'bytes': size,
                        'kb': round(size / 1024, 2)
                    }
            
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
