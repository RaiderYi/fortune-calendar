# -*- coding: utf-8 -*-
"""
邮件订阅 API - 运势日报订阅管理
"""

from http.server import BaseHTTPRequestHandler
import json
import hashlib
import time
import os
import re
from urllib.parse import parse_qs, urlparse

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

def get_subscription(email: str) -> dict | None:
    """获取订阅信息"""
    kv = get_kv()
    key = f"email_sub:{email.lower()}"
    
    if KV_AVAILABLE:
        data = kv.get(key)
        return json.loads(data) if data else None
    else:
        return kv.get(key)

def save_subscription(subscription: dict):
    """保存订阅信息"""
    kv = get_kv()
    email = subscription['email'].lower()
    key = f"email_sub:{email}"
    
    if KV_AVAILABLE:
        kv.set(key, json.dumps(subscription, ensure_ascii=False))
    else:
        kv[key] = subscription

def delete_subscription(email: str):
    """删除订阅"""
    kv = get_kv()
    key = f"email_sub:{email.lower()}"
    
    if KV_AVAILABLE:
        kv.delete(key)
    else:
        kv.pop(key, None)

def generate_verification_token(email: str) -> str:
    """生成验证 Token"""
    data = f"{email}{time.time()}{os.urandom(16).hex()}"
    return hashlib.sha256(data.encode()).hexdigest()[:32]

def validate_email(email: str) -> bool:
    """验证邮箱格式"""
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return bool(re.match(pattern, email))

# ==================== 邮件发送 ====================

try:
    from .utils.email_sender import (
        send_verification_email as _send_verification_email,
        send_welcome_email as _send_welcome_email,
        send_daily_fortune_email as _send_daily_fortune_email,
    )
    EMAIL_SERVICE_AVAILABLE = True
except ImportError:
    EMAIL_SERVICE_AVAILABLE = False


def send_verification_email(email: str, token: str) -> bool:
    """发送验证邮件"""
    if EMAIL_SERVICE_AVAILABLE:
        return _send_verification_email(email, token)
    else:
        print(f"[模拟] 发送验证邮件到 {email}, Token: {token}")
        return True


def send_welcome_email(email: str) -> bool:
    """发送欢迎邮件"""
    if EMAIL_SERVICE_AVAILABLE:
        return _send_welcome_email(email)
    else:
        print(f"[模拟] 发送欢迎邮件到 {email}")
        return True


def send_daily_fortune_email(email: str, fortune_data: dict) -> bool:
    """发送每日运势邮件"""
    if EMAIL_SERVICE_AVAILABLE:
        return _send_daily_fortune_email(
            email=email,
            date=fortune_data.get('date', ''),
            score=fortune_data.get('score', 50),
            keyword=fortune_data.get('keyword', '平稳'),
            emoji=fortune_data.get('emoji', '☯️'),
            dimensions=fortune_data.get('dimensions', {}),
            advice=fortune_data.get('advice', ''),
        )
    else:
        print(f"[模拟] 发送每日运势到 {email}")
        return True

# ==================== HTTP Handler ====================

class handler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """处理 OPTIONS 请求 - CORS 预检"""
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_POST(self):
        """处理 POST 请求"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # 路由
        if '/subscribe' in path:
            self._handle_subscribe()
        elif '/unsubscribe' in path:
            self._handle_unsubscribe()
        elif '/verify' in path:
            self._handle_verify()
        elif '/resend-verification' in path:
            self._handle_resend_verification()
        else:
            self._send_error(404, 'Not Found')
    
    def do_PUT(self):
        """处理 PUT 请求"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if '/preferences' in path:
            self._handle_update_preferences()
        else:
            self._send_error(404, 'Not Found')
    
    def _handle_subscribe(self):
        """处理订阅请求"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            email = data.get('email', '').strip().lower()
            preferences = data.get('preferences', {})
            
            # 验证邮箱
            if not email or not validate_email(email):
                self._send_error(400, '请输入有效的邮箱地址')
                return
            
            # 检查是否已订阅
            existing = get_subscription(email)
            if existing and existing.get('isVerified'):
                self._send_error(409, '该邮箱已订阅')
                return
            
            # 生成验证 Token
            token = generate_verification_token(email)
            
            # 创建订阅记录
            subscription = {
                'email': email,
                'subscribedAt': int(time.time() * 1000),
                'isVerified': False,
                'verificationToken': token,
                'preferences': {
                    'dailyFortune': preferences.get('dailyFortune', True),
                    'weeklyDigest': preferences.get('weeklyDigest', False),
                    'monthlyReport': preferences.get('monthlyReport', False),
                    'importantAlerts': preferences.get('importantAlerts', True),
                    'language': preferences.get('language', 'zh'),
                    'sendTime': preferences.get('sendTime', '08:00'),
                },
            }
            
            # 保存订阅
            save_subscription(subscription)
            
            # 发送验证邮件
            send_verification_email(email, token)
            
            self._send_json(200, {
                'success': True,
                'message': '订阅成功！请查收验证邮件。',
                'requiresVerification': True,
            })
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_unsubscribe(self):
        """处理取消订阅请求"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            email = data.get('email', '').strip().lower()
            
            if not email:
                self._send_error(400, '邮箱不能为空')
                return
            
            # 检查订阅是否存在
            existing = get_subscription(email)
            if not existing:
                # 即使不存在也返回成功，避免泄露信息
                self._send_json(200, {
                    'success': True,
                    'message': '已取消订阅',
                })
                return
            
            # 删除订阅
            delete_subscription(email)
            
            self._send_json(200, {
                'success': True,
                'message': '已成功取消订阅',
            })
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_verify(self):
        """处理邮箱验证请求"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            token = data.get('token', '').strip()
            
            if not token:
                self._send_error(400, '验证码不能为空')
                return
            
            # 查找对应的订阅（遍历所有订阅查找 Token）
            # 在实际实现中，应该用专门的 Token 索引
            kv = get_kv()
            found_subscription = None
            
            # 简化实现：遍历查找
            # 实际应该用 Redis 的 SCAN 或建立 Token 索引
            if not KV_AVAILABLE:
                for key, value in kv.items():
                    if key.startswith('email_sub:') and isinstance(value, dict):
                        if value.get('verificationToken') == token:
                            found_subscription = value
                            break
            
            if not found_subscription:
                self._send_error(400, '无效的验证码')
                return
            
            # 标记为已验证
            found_subscription['isVerified'] = True
            found_subscription['verifiedAt'] = int(time.time() * 1000)
            del found_subscription['verificationToken']
            
            save_subscription(found_subscription)
            
            # 发送欢迎邮件
            send_welcome_email(found_subscription['email'])
            
            self._send_json(200, {
                'success': True,
                'message': '邮箱验证成功！',
            })
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_resend_verification(self):
        """重新发送验证邮件"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            email = data.get('email', '').strip().lower()
            
            if not email:
                self._send_error(400, '邮箱不能为空')
                return
            
            # 获取订阅
            subscription = get_subscription(email)
            if not subscription:
                # 避免泄露信息
                self._send_json(200, {
                    'success': True,
                    'message': '如果该邮箱存在，将收到验证邮件',
                })
                return
            
            if subscription.get('isVerified'):
                self._send_error(400, '该邮箱已验证')
                return
            
            # 生成新 Token
            token = generate_verification_token(email)
            subscription['verificationToken'] = token
            save_subscription(subscription)
            
            # 发送验证邮件
            send_verification_email(email, token)
            
            self._send_json(200, {
                'success': True,
                'message': '验证邮件已重新发送',
            })
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_update_preferences(self):
        """更新订阅偏好"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            email = data.get('email', '').strip().lower()
            preferences = data.get('preferences', {})
            
            if not email:
                self._send_error(400, '邮箱不能为空')
                return
            
            # 获取订阅
            subscription = get_subscription(email)
            if not subscription:
                self._send_error(404, '订阅不存在')
                return
            
            # 更新偏好
            subscription['preferences'].update(preferences)
            subscription['updatedAt'] = int(time.time() * 1000)
            
            save_subscription(subscription)
            
            self._send_json(200, {
                'success': True,
                'message': '偏好设置已更新',
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
