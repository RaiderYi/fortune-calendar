# -*- coding: utf-8 -*-
"""
认证 API - 用户注册、登录、Token 管理
使用 Vercel KV 存储用户数据
"""

from http.server import BaseHTTPRequestHandler
import json
import hashlib
import hmac
import time
import os
from datetime import datetime, timedelta
from urllib.parse import parse_qs, urlparse

# JWT 简单实现（生产环境建议使用 PyJWT）
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'

# Vercel KV 客户端（需要安装 @vercel/kv）
# 这里使用模拟实现，实际需要配置 Vercel KV
try:
    from vercel_kv import kv
    KV_AVAILABLE = True
except ImportError:
    # 开发环境模拟
    KV_AVAILABLE = False
    _kv_store = {}  # 临时内存存储

def get_kv():
    """获取 KV 存储实例"""
    if KV_AVAILABLE:
        return kv
    else:
        # 开发环境使用内存存储
        return _kv_store

# ==================== JWT 工具函数 ====================

def encode_jwt(payload: dict, expires_in: int = 3600) -> str:
    """编码 JWT Token"""
    header = {
        'alg': JWT_ALGORITHM,
        'typ': 'JWT'
    }
    
    # 添加过期时间
    payload['exp'] = int(time.time()) + expires_in
    payload['iat'] = int(time.time())
    
    # 简单的 Base64 编码（实际应使用标准 JWT 库）
    import base64
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    
    # 签名
    message = f"{header_b64}.{payload_b64}"
    signature = hmac.new(JWT_SECRET.encode(), message.encode(), hashlib.sha256).hexdigest()
    
    return f"{header_b64}.{payload_b64}.{signature}"

def decode_jwt(token: str) -> dict | None:
    """解码 JWT Token"""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header_b64, payload_b64, signature = parts
        
        # 验证签名
        message = f"{header_b64}.{payload_b64}"
        expected_signature = hmac.new(JWT_SECRET.encode(), message.encode(), hashlib.sha256).hexdigest()
        
        if not hmac.compare_digest(signature, expected_signature):
            return None
        
        # 解码 payload
        import base64
        payload_json = base64.urlsafe_b64decode(payload_b64 + '==')
        payload = json.loads(payload_json)
        
        # 检查过期时间
        if payload.get('exp', 0) < time.time():
            return None
        
        return payload
    except:
        return None

# ==================== 密码加密 ====================

def hash_password(password: str) -> str:
    """使用 SHA256 哈希密码（生产环境应使用 bcrypt）"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """验证密码"""
    return hash_password(password) == hashed

# ==================== 用户数据操作 ====================

def get_user_by_email(email: str) -> dict | None:
    """根据邮箱获取用户"""
    kv = get_kv()
    if KV_AVAILABLE:
        user_data = kv.get(f"user:email:{email}")
        return json.loads(user_data) if user_data else None
    else:
        return kv.get(f"user:email:{email}")

def get_user_by_phone(phone: str) -> dict | None:
    """根据手机号获取用户"""
    kv = get_kv()
    if KV_AVAILABLE:
        user_data = kv.get(f"user:phone:{phone}")
        return json.loads(user_data) if user_data else None
    else:
        return kv.get(f"user:phone:{phone}")

def get_user_by_id(user_id: str) -> dict | None:
    """根据用户 ID 获取用户"""
    kv = get_kv()
    if KV_AVAILABLE:
        user_data = kv.get(f"user:{user_id}")
        return json.loads(user_data) if user_data else None
    else:
        return kv.get(f"user:{user_id}")

def save_user(user: dict):
    """保存用户数据"""
    kv = get_kv()
    user_id = user['id']
    
    if KV_AVAILABLE:
        kv.set(f"user:{user_id}", json.dumps(user))
        if user.get('email'):
            kv.set(f"user:email:{user['email']}", json.dumps(user))
        if user.get('phone'):
            kv.set(f"user:phone:{user['phone']}", json.dumps(user))
    else:
        kv[f"user:{user_id}"] = user
        if user.get('email'):
            kv[f"user:email:{user['email']}"] = user
        if user.get('phone'):
            kv[f"user:phone:{user['phone']}"] = user

# ==================== HTTP Handler ====================

class handler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """处理 OPTIONS 请求 - CORS 预检"""
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_POST(self):
        """处理 POST 请求"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # 路由
        if '/register' in path:
            self._handle_register()
        elif '/login' in path:
            self._handle_login()
        elif '/refresh' in path:
            self._handle_refresh()
        elif '/verify' in path:
            self._handle_verify()
        elif '/reset-password' in path:
            self._handle_reset_password()
        else:
            self._send_error(404, 'Not Found')
    
    def do_GET(self):
        """处理 GET 请求"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if '/verify' in path:
            self._handle_verify()
        else:
            self._send_error(404, 'Not Found')
    
    def _handle_register(self):
        """处理注册请求"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            email = data.get('email')
            phone = data.get('phone')
            password = data.get('password')
            name = data.get('name', '')
            
            # 验证输入
            if not (email or phone):
                self._send_error(400, '邮箱或手机号必填')
                return
            
            if not password or len(password) < 6:
                self._send_error(400, '密码长度至少 6 位')
                return
            
            # 检查用户是否已存在
            if email and get_user_by_email(email):
                self._send_error(409, '该邮箱已被注册')
                return
            
            if phone and get_user_by_phone(phone):
                self._send_error(409, '该手机号已被注册')
                return
            
            # 创建用户
            user_id = hashlib.md5(f"{email or phone}{time.time()}".encode()).hexdigest()
            user = {
                'id': user_id,
                'email': email,
                'phone': phone,
                'name': name,
                'password': hash_password(password),
                'createdAt': int(time.time() * 1000),
                'lastLoginAt': int(time.time() * 1000),
            }
            
            save_user(user)
            
            # 生成 Token
            token = encode_jwt({'userId': user_id, 'type': 'access'}, expires_in=3600)
            refresh_token = encode_jwt({'userId': user_id, 'type': 'refresh'}, expires_in=7*24*3600)
            
            # 返回响应
            response = {
                'success': True,
                'user': {
                    'id': user['id'],
                    'email': user.get('email'),
                    'phone': user.get('phone'),
                    'name': user['name'],
                    'createdAt': user['createdAt'],
                    'lastLoginAt': user['lastLoginAt'],
                },
                'token': token,
                'refreshToken': refresh_token,
            }
            
            self._send_json(200, response)
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_login(self):
        """处理登录请求"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            email = data.get('email')
            phone = data.get('phone')
            password = data.get('password')
            
            # 验证输入
            if not (email or phone):
                self._send_error(400, '邮箱或手机号必填')
                return
            
            if not password:
                self._send_error(400, '密码必填')
                return
            
            # 查找用户
            user = None
            if email:
                user = get_user_by_email(email)
            elif phone:
                user = get_user_by_phone(phone)
            
            if not user:
                self._send_error(401, '用户不存在')
                return
            
            # 验证密码
            if not verify_password(password, user['password']):
                self._send_error(401, '密码错误')
                return
            
            # 更新最后登录时间
            user['lastLoginAt'] = int(time.time() * 1000)
            save_user(user)
            
            # 生成 Token
            token = encode_jwt({'userId': user['id'], 'type': 'access'}, expires_in=3600)
            refresh_token = encode_jwt({'userId': user['id'], 'type': 'refresh'}, expires_in=7*24*3600)
            
            # 返回响应
            response = {
                'success': True,
                'user': {
                    'id': user['id'],
                    'email': user.get('email'),
                    'phone': user.get('phone'),
                    'name': user['name'],
                    'createdAt': user['createdAt'],
                    'lastLoginAt': user['lastLoginAt'],
                },
                'token': token,
                'refreshToken': refresh_token,
            }
            
            self._send_json(200, response)
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_refresh(self):
        """处理 Token 刷新请求"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            refresh_token = data.get('refreshToken')
            if not refresh_token:
                self._send_error(400, 'Refresh Token 必填')
                return
            
            # 解码 Token
            payload = decode_jwt(refresh_token)
            if not payload or payload.get('type') != 'refresh':
                self._send_error(401, '无效的 Refresh Token')
                return
            
            user_id = payload.get('userId')
            user = get_user_by_id(user_id)
            if not user:
                self._send_error(401, '用户不存在')
                return
            
            # 生成新 Token
            token = encode_jwt({'userId': user_id, 'type': 'access'}, expires_in=3600)
            new_refresh_token = encode_jwt({'userId': user_id, 'type': 'refresh'}, expires_in=7*24*3600)
            
            response = {
                'success': True,
                'token': token,
                'refreshToken': new_refresh_token,
            }
            
            self._send_json(200, response)
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_verify(self):
        """验证 Token"""
        try:
            auth_header = self.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                self._send_error(401, '未提供 Token')
                return
            
            token = auth_header[7:]  # 移除 'Bearer ' 前缀
            payload = decode_jwt(token)
            
            if not payload or payload.get('type') != 'access':
                self._send_error(401, '无效的 Token')
                return
            
            user_id = payload.get('userId')
            user = get_user_by_id(user_id)
            if not user:
                self._send_error(401, '用户不存在')
                return
            
            response = {
                'success': True,
                'user': {
                    'id': user['id'],
                    'email': user.get('email'),
                    'phone': user.get('phone'),
                    'name': user['name'],
                },
            }
            
            self._send_json(200, response)
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_reset_password(self):
        """处理密码重置请求"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            email = data.get('email')
            if not email:
                self._send_error(400, '邮箱必填')
                return
            
            user = get_user_by_email(email)
            if not user:
                # 为了安全，即使用户不存在也返回成功
                self._send_json(200, {'success': True, 'message': '如果该邮箱存在，将收到密码重置邮件'})
                return
            
            # 生成密码重置 Token
            reset_token = hashlib.sha256(f"{email}{time.time()}{os.urandom(16).hex()}".encode()).hexdigest()[:32]
            
            # 保存 Token 到用户记录（设置 24 小时过期）
            user['resetToken'] = reset_token
            user['resetTokenExpires'] = int(time.time()) + 24 * 3600
            save_user(user)
            
            # 发送密码重置邮件
            try:
                from .utils.email_sender import send_password_reset_email
                send_password_reset_email(email, reset_token)
            except ImportError:
                print(f"[模拟] 发送密码重置邮件到 {email}, Token: {reset_token}")
            
            self._send_json(200, {'success': True, 'message': '密码重置邮件已发送'})
            
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
