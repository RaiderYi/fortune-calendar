# -*- coding: utf-8 -*-
"""
同步路由 - 数据上传/下载/冲突解决
适配 Vercel KV 异步操作
"""

import json
import os
import sys
import asyncio

try:
    from ..services.sync_service import SyncService
    from ..services.auth_service import AuthService
    from ..utils.json_utils import create_response
except ImportError:
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from services.sync_service import SyncService
    from services.auth_service import AuthService
    from utils.json_utils import create_response


def get_or_create_loop():
    try:
        return asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        return loop


def handle_sync_request(path: str, method: str, body: dict = None, headers: dict = None) -> str:
    """处理同步相关请求（同步包装）"""
    loop = get_or_create_loop()
    
    try:
        result = loop.run_until_complete(_handle_sync_async(path, method, body, headers))
        return result
    except Exception as e:
        print(f"[Sync Route Error] {e}")
        return create_response({'success': False, 'error': 'Internal error'}, 500)


async def _handle_sync_async(path: str, method: str, body: dict, headers: dict) -> str:
    """异步处理函数"""
    
    # 获取当前用户
    user = await _get_current_user(headers)
    if not user:
        return create_response({'success': False, 'error': '未登录'}, 401)
    
    user_id = user['id']
    
    # 检查同步是否启用
    if not user.get('sync_enabled', True):
        return create_response({'success': False, 'error': '同步功能已关闭'}, 403)
    
    # 上传数据
    if path == '/api/sync/upload' and method == 'POST':
        data_type = body.get('type')
        data = body.get('data')
        checksum = body.get('checksum')
        timestamp = body.get('timestamp')
        
        if not all([data_type, checksum]):
            return create_response({'success': False, 'error': '缺少必要参数'}, 400)
        
        result = await SyncService.upload_data(user_id, data_type, data, checksum, timestamp)
        return create_response(result, 200 if result.get('success') else 400)
    
    # 批量上传
    if path == '/api/sync/batch' and method == 'POST':
        batch_data = body.get('batch', [])
        if not batch_data:
            return create_response({'success': False, 'error': '批量数据不能为空'}, 400)
        
        result = await SyncService.batch_upload(user_id, batch_data)
        return create_response(result, 200 if result.get('success') else 400)
    
    # 下载数据
    if path == '/api/sync/download' and method == 'GET':
        data_type = body.get('type') if body else None
        result = await SyncService.get_user_data(user_id, data_type)
        return create_response(result, 200 if result.get('success') else 400)
    
    # 检测冲突
    if path == '/api/sync/conflicts' and method == 'POST':
        local_data = body.get('localData', {})
        result = await SyncService.detect_conflicts(user_id, local_data)
        return create_response(result, 200)
    
    # 解决冲突
    if path == '/api/sync/resolve' and method == 'POST':
        resolutions = body.get('resolutions', [])
        if not resolutions:
            return create_response({'success': False, 'error': '解决方案不能为空'}, 400)
        
        result = await SyncService.resolve_conflicts(user_id, resolutions)
        return create_response(result, 200 if result.get('success') else 400)
    
    # 获取同步状态
    if path == '/api/sync/status' and method == 'GET':
        result = await SyncService.get_sync_status(user_id)
        return create_response(result, 200)
    
    # 清除云端数据
    if path == '/api/sync/clear' and method == 'DELETE':
        result = await SyncService.delete_user_data(user_id)
        return create_response(result, 200 if result.get('success') else 400)
    
    return create_response({'error': 'Not found'}, 404)


async def _get_current_user(headers: dict) -> dict:
    """从请求头获取当前用户"""
    auth_header = headers.get('Authorization', '') if headers else ''
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header[7:]
    return await AuthService.get_user_by_token(token)
