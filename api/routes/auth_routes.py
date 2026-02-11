# -*- coding: utf-8 -*-
"""
认证路由 - 邮箱注册/登录/邀请
适配 Vercel KV 同步操作
"""

import json
import os
import sys

# 处理相对导入
try:
    from ..services.auth_service import AuthService, JWTManager
except ImportError:
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from services.auth_service import AuthService, JWTManager


def make_response(data: dict, code: int = 200) -> str:
    """创建 JSON 响应字符串"""
    data['code'] = code
    return json.dumps(data, ensure_ascii=False)


def handle_auth_request(path: str, method: str, body: dict = None, headers: dict = None) -> str:
    """处理认证相关请求"""
    try:
        return _handle_request(path, method, body, headers)
    except Exception as e:
        print(f"[Auth Route Error] {e}")
        import traceback
        traceback.print_exc()
        return make_response({'success': False, 'error': 'Internal error'}, 500)


def _handle_request(path: str, method: str, body: dict, headers: dict) -> str:
    """处理函数"""
    
    # 发送验证码
    if path == '/api/auth/send-code' and method == 'POST':
        email = body.get('email', '').lower().strip()
        if not email:
            return make_response({'success': False, 'error': '邮箱不能为空'}, 400)
        
        result = AuthService.send_verification_email(email)
        return make_response(result, 200 if result.get('success') else 400)
    
    # 注册
    if path == '/api/auth/register' and method == 'POST':
        email = body.get('email', '').lower().strip()
        password = body.get('password', '')
        code = body.get('verificationCode', '')
        invite_code = body.get('inviteCode')
        
        if not all([email, password, code]):
            return make_response({'success': False, 'error': '请填写所有必填项'}, 400)
        
        result = AuthService.register(email, password, code, invite_code)
        return make_response(result, 200 if result.get('success') else 400)
    
    # 登录
    if path == '/api/auth/login' and method == 'POST':
        email = body.get('email', '').lower().strip()
        password = body.get('password', '')
        remember_me = body.get('rememberMe', False)
        
        if not all([email, password]):
            return make_response({'success': False, 'error': '请填写邮箱和密码'}, 400)
        
        result = AuthService.login(email, password, remember_me)
        return make_response(result, 200 if result.get('success') else 401)
    
    # 刷新Token
    if path == '/api/auth/refresh' and method == 'POST':
        refresh_token = body.get('refreshToken', '')
        if not refresh_token:
            return make_response({'success': False, 'error': '缺少刷新令牌'}, 400)
        
        result = AuthService.refresh_token(refresh_token)
        return make_response(result, 200 if result.get('success') else 401)
    
    # 验证邀请码
    if path == '/api/invite/validate' and method == 'POST':
        code = body.get('code', '').upper().strip()
        if not code:
            return make_response({'success': False, 'error': '邀请码不能为空'}, 400)
        
        result = AuthService.validate_invite_code(code)
        return make_response(result, 200)
    
    # 获取邀请信息（需要认证）
    if path == '/api/invite/info' and method == 'GET':
        user = _get_current_user(headers)
        if not user:
            return make_response({'success': False, 'error': '未登录'}, 401)
        
        result = AuthService.get_invite_info(user['id'])
        return make_response(result, 200 if result.get('success') else 400)
    
    # 更新同步设置
    if path == '/api/user/sync-setting' and method == 'PUT':
        user = _get_current_user(headers)
        if not user:
            return make_response({'success': False, 'error': '未登录'}, 401)
        
        enabled = body.get('enabled', True)
        result = AuthService.update_sync_setting(user['id'], enabled)
        return make_response(result, 200 if result.get('success') else 400)
    
    return make_response({'success': False, 'error': 'Not found'}, 404)


def _get_current_user(headers: dict) -> dict:
    """从请求头获取当前用户"""
    auth_header = headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header[7:]  # 去掉 "Bearer "
    return AuthService.get_user_by_token(token)
