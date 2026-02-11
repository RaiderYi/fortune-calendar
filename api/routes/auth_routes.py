# -*- coding: utf-8 -*-
"""
认证路由 - 邮箱注册/登录/邀请
适配 Vercel KV 异步操作
"""

import json
import os
import sys
import asyncio

# 处理相对导入
try:
    from ..services.auth_service import AuthService, JWTManager
    from ..utils.json_utils import create_response
except ImportError:
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from services.auth_service import AuthService, JWTManager
    from utils.json_utils import create_response


# 获取或创建事件循环
def get_or_create_loop():
    try:
        return asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        return loop


def handle_auth_request(path: str, method: str, body: dict = None, headers: dict = None) -> str:
    """处理认证相关请求（同步包装）"""
    loop = get_or_create_loop()
    
    # 运行异步处理函数
    try:
        result = loop.run_until_complete(_handle_async(path, method, body, headers))
        return result
    except Exception as e:
        print(f"[Auth Route Error] {e}")
        return create_response({'success': False, 'error': 'Internal error'}, 500)


async def _handle_async(path: str, method: str, body: dict, headers: dict) -> str:
    """异步处理函数"""
    
    # 发送验证码
    if path == '/api/auth/send-code' and method == 'POST':
        email = body.get('email', '').lower().strip()
        if not email:
            return create_response({'success': False, 'error': '邮箱不能为空'}, 400)
        
        result = await AuthService.send_verification_email(email)
        return create_response(result, 200 if result.get('success') else 400)
    
    # 注册
    if path == '/api/auth/register' and method == 'POST':
        email = body.get('email', '').lower().strip()
        password = body.get('password', '')
        code = body.get('verificationCode', '')
        invite_code = body.get('inviteCode')
        
        if not all([email, password, code]):
            return create_response({'success': False, 'error': '请填写所有必填项'}, 400)
        
        result = await AuthService.register(email, password, code, invite_code)
        return create_response(result, 200 if result.get('success') else 400)
    
    # 登录
    if path == '/api/auth/login' and method == 'POST':
        email = body.get('email', '').lower().strip()
        password = body.get('password', '')
        remember_me = body.get('rememberMe', False)
        
        if not all([email, password]):
            return create_response({'success': False, 'error': '请填写邮箱和密码'}, 400)
        
        result = await AuthService.login(email, password, remember_me)
        return create_response(result, 200 if result.get('success') else 401)
    
    # 刷新Token
    if path == '/api/auth/refresh' and method == 'POST':
        refresh_token = body.get('refreshToken', '')
        if not refresh_token:
            return create_response({'success': False, 'error': '缺少刷新令牌'}, 400)
        
        result = await AuthService.refresh_token(refresh_token)
        return create_response(result, 200 if result.get('success') else 401)
    
    # 验证邀请码
    if path == '/api/invite/validate' and method == 'POST':
        code = body.get('code', '').upper().strip()
        if not code:
            return create_response({'success': False, 'error': '邀请码不能为空'}, 400)
        
        result = await AuthService.validate_invite_code(code)
        return create_response(result, 200)
    
    # 获取邀请信息（需要认证）
    if path == '/api/invite/info' and method == 'GET':
        user = await _get_current_user(headers)
        if not user:
            return create_response({'success': False, 'error': '未登录'}, 401)
        
        result = await AuthService.get_invite_info(user['id'])
        return create_response(result, 200 if result.get('success') else 400)
    
    # 更新同步设置
    if path == '/api/user/sync-setting' and method == 'PUT':
        user = await _get_current_user(headers)
        if not user:
            return create_response({'success': False, 'error': '未登录'}, 401)
        
        enabled = body.get('enabled', True)
        result = await AuthService.update_sync_setting(user['id'], enabled)
        return create_response(result, 200 if result.get('success') else 400)
    
    return create_response({'error': 'Not found'}, 404)


async def _get_current_user(headers: dict) -> dict:
    """从请求头获取当前用户"""
    auth_header = headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header[7:]  # 去掉 "Bearer "
    return await AuthService.get_user_by_token(token)
