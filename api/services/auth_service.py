# -*- coding: utf-8 -*-
"""
用户认证业务逻辑
"""

import hashlib
import time
import json
import base64
import os

# 全局内存存储（在 Vercel Serverless 中仅在单个实例生命周期内有效）
_users_store = {}
_passwords_store = {}

def _hash_password(password):
    """简单的密码哈希"""
    return hashlib.sha256(password.encode()).hexdigest()

def _get_user_by_email(email):
    for user in _users_store.values():
        if user.get('email') == email:
            return user
    return None

def _get_user_by_phone(phone):
    for user in _users_store.values():
        if user.get('phone') == phone:
            return user
    return None

def _save_user(user_id, user, password_hash):
    _users_store[user_id] = user
    _passwords_store[user_id] = password_hash

class AuthService:
    SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-123')

    @staticmethod
    def generate_jwt(payload, expiry_seconds=3600):
        """生成简易 JWT"""
        header = {"alg": "HS256", "typ": "JWT"}
        
        # 设置过期时间
        payload_copy = payload.copy()
        payload_copy['exp'] = int(time.time()) + expiry_seconds
        
        def b64_encode(data):
            return base64.urlsafe_b64encode(json.dumps(data).encode()).decode().rstrip("=")
        
        encoded_header = b64_encode(header)
        encoded_payload = b64_encode(payload_copy)
        
        # 简易签名（实际生产环境应使用 hmac）
        signature_base = f"{encoded_header}.{encoded_payload}"
        signature = hashlib.sha256(f"{signature_base}.{AuthService.SECRET_KEY}".encode()).hexdigest()
        
        return f"{encoded_header}.{encoded_payload}.{signature}"

    @staticmethod
    def decode_jwt(token):
        """解码并验证简易 JWT"""
        try:
            parts = token.split('.')
            if len(parts) != 3:
                return None
            
            encoded_header, encoded_payload, signature = parts
            
            # 验证签名
            signature_base = f"{encoded_header}.{encoded_payload}"
            expected_signature = hashlib.sha256(f"{signature_base}.{AuthService.SECRET_KEY}".encode()).hexdigest()
            
            if signature != expected_signature:
                return None
            
            # 解码负载
            padding = '=' * (4 - len(encoded_payload) % 4)
            payload = json.loads(base64.urlsafe_b64decode(encoded_payload + padding).decode())
            
            # 检查是否过期
            if payload.get('exp', 0) < time.time():
                return None
                
            return payload
        except:
            return None

    @staticmethod
    def register(data):
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')
        name = data.get('name', '')
        
        if not (email or phone):
            return {'success': False, 'error': '邮箱或手机号必填', 'code': 400}
        
        if not password or len(password) < 6:
            return {'success': False, 'error': '密码长度至少6位', 'code': 400}
        
        if email and _get_user_by_email(email):
            return {'success': False, 'error': '该邮箱已被注册', 'code': 409}
        
        if phone and _get_user_by_phone(phone):
            return {'success': False, 'error': '该手机号已被注册', 'code': 409}
        
        user_id = hashlib.md5(f"{email or phone}{time.time()}".encode()).hexdigest()
        user = {
            'id': user_id,
            'email': email,
            'phone': phone,
            'name': name or (email.split('@')[0] if email else phone),
            'createdAt': int(time.time() * 1000),
            'lastLoginAt': int(time.time() * 1000),
        }
        
        password_hash = _hash_password(password)
        _save_user(user_id, user, password_hash)
        
        token = AuthService.generate_jwt({'userId': user_id, 'type': 'access'}, 3600)
        refresh_token = AuthService.generate_jwt({'userId': user_id, 'type': 'refresh'}, 7*24*3600)
        
        return {
            'success': True,
            'user': user,
            'token': token,
            'refreshToken': refresh_token,
            'code': 200
        }

    @staticmethod
    def login(data):
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')
        
        if not (email or phone):
            return {'success': False, 'error': '邮箱或手机号必填', 'code': 400}
        
        if not password:
            return {'success': False, 'error': '密码必填', 'code': 400}
        
        user = None
        if email:
            user = _get_user_by_email(email)
        elif phone:
            user = _get_user_by_phone(phone)
        
        if not user:
            return {'success': False, 'error': '用户不存在，请先注册', 'code': 401}
        
        user_id = user['id']
        stored_password_hash = _passwords_store.get(user_id)
        password_hash = _hash_password(password)
        
        if stored_password_hash != password_hash:
            return {'success': False, 'error': '密码错误', 'code': 401}
        
        user['lastLoginAt'] = int(time.time() * 1000)
        _users_store[user_id] = user
        
        token = AuthService.generate_jwt({'userId': user_id, 'type': 'access'}, 3600)
        refresh_token = AuthService.generate_jwt({'userId': user_id, 'type': 'refresh'}, 7*24*3600)
        
        return {
            'success': True,
            'user': user,
            'token': token,
            'refreshToken': refresh_token,
            'code': 200
        }
