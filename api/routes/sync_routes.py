# -*- coding: utf-8 -*-
"""
同步路由 - 数据上传/下载/冲突解决
适配 Vercel KV 同步操作
"""

import json
import os
import sys

try:
    from ..services.sync_service import SyncService
    from ..services.auth_service import AuthService
except ImportError:
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from services.sync_service import SyncService
    from services.auth_service import AuthService


def make_response(data: dict, code: int = 200) -> str:
    """创建 JSON 响应字符串"""
    data['code'] = code
    return json.dumps(data, ensure_ascii=False)


def handle_sync_request(path: str, method: str, body: dict = None, headers: dict = None) -> str:
    """处理同步相关请求"""
    try:
        return _handle_request(path, method, body, headers)
    except Exception as e:
        print(f"[Sync Route Error] {e}")
        import traceback
        traceback.print_exc()
        return make_response({'success': False, 'error': 'Internal error'}, 500)


def _handle_request(path: str, method: str, body: dict, headers: dict) -> str:
    """处理函数"""
    
    user = _get_current_user(headers)
    if not user:
        return make_response({'success': False, 'error': '未登录'}, 401)
    
    user_id = user['id']
    
    if not user.get('sync_enabled', True):
        return make_response({'success': False, 'error': '同步功能已关闭'}, 403)
    
    # 上传数据
    if path == '/api/sync/upload' and method == 'POST':
        data_type = body.get('type')
        data = body.get('data')
        checksum = body.get('checksum')
        timestamp = body.get('timestamp')
        
        if not all([data_type, checksum]):
            return make_response({'success': False, 'error': '缺少必要参数'}, 400)
        
        result = SyncService.upload_data(user_id, data_type, data, checksum, timestamp)
        return make_response(result, 200 if result.get('success') else 400)
    
    # 批量上传
    if path == '/api/sync/batch' and method == 'POST':
        batch_data = body.get('batch', [])
        if not batch_data:
            return make_response({'success': False, 'error': '批量数据不能为空'}, 400)
        
        result = SyncService.batch_upload(user_id, batch_data)
        return make_response(result, 200 if result.get('success') else 400)
    
    # 下载数据
    if path == '/api/sync/download' and method == 'GET':
        data_type = body.get('type') if body else None
        result = SyncService.get_user_data(user_id, data_type)
        return make_response(result, 200 if result.get('success') else 400)
    
    # 检测冲突
    if path == '/api/sync/conflicts' and method == 'POST':
        local_data = body.get('localData', {})
        result = SyncService.detect_conflicts(user_id, local_data)
        return make_response(result, 200)
    
    # 解决冲突
    if path == '/api/sync/resolve' and method == 'POST':
        resolutions = body.get('resolutions', [])
        if not resolutions:
            return make_response({'success': False, 'error': '解决方案不能为空'}, 400)
        
        result = SyncService.resolve_conflicts(user_id, resolutions)
        return make_response(result, 200 if result.get('success') else 400)
    
    # 获取同步状态
    if path == '/api/sync/status' and method == 'GET':
        result = SyncService.get_sync_status(user_id)
        return make_response(result, 200)
    
    # 清除云端数据
    if path == '/api/sync/clear' and method == 'DELETE':
        result = SyncService.delete_user_data(user_id)
        return make_response(result, 200 if result.get('success') else 400)
    
    return make_response({'success': False, 'error': 'Not found'}, 404)


def _get_current_user(headers: dict) -> dict:
    """从请求头获取当前用户"""
    auth_header = headers.get('Authorization', '') if headers else ''
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header[7:]
    return AuthService.get_user_by_token(token)
