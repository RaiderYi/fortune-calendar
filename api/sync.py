# -*- coding: utf-8 -*-
"""
数据同步 API - 用户数据上传、下载、同步
"""

from http.server import BaseHTTPRequestHandler
import json
import os
from urllib.parse import parse_qs, urlparse

# JWT 验证（从 auth.py 导入）
try:
    from .auth import decode_jwt, get_user_by_id
except ImportError:
    # Vercel 部署时的相对导入
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from auth import decode_jwt, get_user_by_id

# Vercel KV 客户端
try:
    from vercel_kv import kv
    KV_AVAILABLE = True
except ImportError:
    KV_AVAILABLE = False
    _kv_store = {}

def get_kv():
    """获取 KV 存储实例"""
    if KV_AVAILABLE:
        return kv
    else:
        return _kv_store

# ==================== 数据操作 ====================

def get_user_data(user_id: str) -> dict | None:
    """获取用户同步数据"""
    kv = get_kv()
    key = f"sync:{user_id}"
    
    if KV_AVAILABLE:
        data = kv.get(key)
        return json.loads(data) if data else None
    else:
        return kv.get(key)

def save_user_data(user_id: str, data: dict):
    """保存用户同步数据"""
    kv = get_kv()
    key = f"sync:{user_id}"
    
    if KV_AVAILABLE:
        kv.set(key, json.dumps(data, ensure_ascii=False))
    else:
        kv[key] = data

def merge_data(local_data: dict, remote_data: dict) -> dict:
    """合并本地和远程数据"""
    merged = {
        'profile': {},
        'history': [],
        'achievements': [],
        'checkins': [],
        'feedbacks': [],
        'lastSyncTime': max(
            local_data.get('lastSyncTime', 0),
            remote_data.get('lastSyncTime', 0)
        ),
    }
    
    # 合并 profile（选择较新的）
    local_profile = local_data.get('profile', {})
    remote_profile = remote_data.get('profile', {})
    local_profile_time = local_profile.get('lastSyncTime', 0) if isinstance(local_profile, dict) else 0
    remote_profile_time = remote_profile.get('lastSyncTime', 0) if isinstance(remote_profile, dict) else 0
    
    if local_profile_time >= remote_profile_time:
        merged['profile'] = local_profile
    else:
        merged['profile'] = remote_profile
    
    # 合并 history（按日期去重，保留较新的）
    history_map = {}
    for record in remote_data.get('history', []):
        if isinstance(record, dict) and 'date' in record:
            history_map[record['date']] = record
    for record in local_data.get('history', []):
        if isinstance(record, dict) and 'date' in record:
            existing = history_map.get(record['date'])
            if not existing or record.get('timestamp', 0) > existing.get('timestamp', 0):
                history_map[record['date']] = record
    merged['history'] = list(history_map.values())
    
    # 合并 achievements（按 id 去重，保留进度最高的）
    achievement_map = {}
    for achievement in remote_data.get('achievements', []):
        if isinstance(achievement, dict) and 'id' in achievement:
            achievement_map[achievement['id']] = achievement
    for achievement in local_data.get('achievements', []):
        if isinstance(achievement, dict) and 'id' in achievement:
            existing = achievement_map.get(achievement['id'])
            if not existing or achievement.get('progress', 0) > existing.get('progress', 0):
                achievement_map[achievement['id']] = achievement
    merged['achievements'] = list(achievement_map.values())
    
    # 合并 checkins（按日期去重，保留较新的）
    checkin_map = {}
    for record in remote_data.get('checkins', []):
        if isinstance(record, dict) and 'date' in record:
            checkin_map[record['date']] = record
    for record in local_data.get('checkins', []):
        if isinstance(record, dict) and 'date' in record:
            existing = checkin_map.get(record['date'])
            if not existing or record.get('timestamp', 0) > existing.get('timestamp', 0):
                checkin_map[record['date']] = record
    merged['checkins'] = list(checkin_map.values())
    
    # 合并 feedbacks（按 id 去重，保留较新的）
    feedback_map = {}
    for record in remote_data.get('feedbacks', []):
        if isinstance(record, dict) and 'id' in record:
            feedback_map[record['id']] = record
    for record in local_data.get('feedbacks', []):
        if isinstance(record, dict) and 'id' in record:
            existing = feedback_map.get(record['id'])
            if not existing or record.get('timestamp', 0) > existing.get('timestamp', 0):
                feedback_map[record['id']] = record
    merged['feedbacks'] = list(feedback_map.values())
    
    return merged

# ==================== HTTP Handler ====================

class handler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """处理 OPTIONS 请求 - CORS 预检"""
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def _get_user_id_from_token(self) -> str | None:
        """从 Authorization header 获取用户 ID"""
        auth_header = self.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header[7:]
        payload = decode_jwt(token)
        
        if not payload or payload.get('type') != 'access':
            return None
        
        return payload.get('userId')
    
    def do_POST(self):
        """处理 POST 请求"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # 验证用户身份
        user_id = self._get_user_id_from_token()
        if not user_id:
            self._send_error(401, '未授权访问')
            return
        
        # 路由
        if '/upload' in path:
            self._handle_upload(user_id)
        elif '/sync' in path:
            self._handle_sync(user_id)
        else:
            self._send_error(404, 'Not Found')
    
    def do_GET(self):
        """处理 GET 请求"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # 验证用户身份
        user_id = self._get_user_id_from_token()
        if not user_id:
            self._send_error(401, '未授权访问')
            return
        
        if '/download' in path:
            self._handle_download(user_id)
        else:
            self._send_error(404, 'Not Found')
    
    def _handle_upload(self, user_id: str):
        """处理数据上传请求"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            # 添加同步时间戳
            data['lastSyncTime'] = int(__import__('time').time() * 1000)
            
            # 保存数据
            save_user_data(user_id, data)
            
            self._send_json(200, {
                'success': True,
                'lastSyncTime': data['lastSyncTime'],
            })
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_download(self, user_id: str):
        """处理数据下载请求"""
        try:
            data = get_user_data(user_id)
            
            if not data:
                self._send_json(404, {
                    'success': False,
                    'error': '未找到用户数据',
                })
                return
            
            self._send_json(200, {
                'success': True,
                'data': data,
            })
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_sync(self, user_id: str):
        """处理双向同步请求"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            request_data = json.loads(body.decode('utf-8'))
            
            local_data = request_data.get('localData', {})
            local_last_sync = request_data.get('localLastSyncTime', 0)
            
            # 获取远程数据
            remote_data = get_user_data(user_id) or {
                'profile': {},
                'history': [],
                'achievements': [],
                'checkins': [],
                'feedbacks': [],
                'lastSyncTime': 0,
            }
            
            remote_last_sync = remote_data.get('lastSyncTime', 0)
            
            # 合并数据
            merged_data = merge_data(local_data, remote_data)
            merged_data['lastSyncTime'] = int(__import__('time').time() * 1000)
            
            # 保存合并后的数据
            save_user_data(user_id, merged_data)
            
            # 返回合并后的数据
            self._send_json(200, {
                'success': True,
                'data': merged_data,
            })
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _send_json(self, status_code: int, data: dict):
        """发送 JSON 响应"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def _send_error(self, status_code: int, message: str):
        """发送错误响应"""
        self._send_json(status_code, {
            'success': False,
            'error': message,
        })
