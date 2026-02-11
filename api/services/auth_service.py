# -*- coding: utf-8 -*-
"""
认证服务 - Vercel KV 版本（同步实现）
兼容 Vercel Serverless 环境
"""

import os
import sys
import re
import hashlib
import secrets
import time
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple

# 处理相对导入
try:
    from ..utils.json_utils import safe_json_dumps
    from ..utils.kv_client import kv
    from ..utils.email_sender import send_verification_email_sync
except ImportError:
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from utils.json_utils import safe_json_dumps
    from utils.kv_client import kv
    from utils.email_sender import send_verification_email_sync


def create_response(success: bool, data: dict = None, error: str = None, code: int = 200) -> dict:
    """创建统一响应格式"""
    response = {'success': success}
    if data is not None:
        response['data'] = data
    if error is not None:
        response['error'] = error
    if code != 200:
        response['code'] = code
    return response


# JWT 实现（简化版，无依赖）
class JWTManager:
    """简化版JWT管理"""
    
    @staticmethod
    def generate_token(user_id: str, email: str, token_type: str = 'access') -> str:
        """生成JWT Token"""
        import base64
        import json
        
        secret = os.environ.get('JWT_SECRET', 'vercel-jwt-secret-change-in-production-32chars')
        
        # Header
        header = base64.urlsafe_b64encode(
            json.dumps({'alg': 'HS256', 'typ': 'JWT'}).encode()
        ).decode().rstrip('=')
        
        # Payload
        exp = datetime.utcnow() + timedelta(
            days=30 if token_type == 'refresh' else 1
        )
        payload = {
            'sub': user_id,
            'email': email,
            'type': token_type,
            'iat': int(time.time()),
            'exp': int(exp.timestamp())
        }
        payload_b64 = base64.urlsafe_b64encode(
            json.dumps(payload).encode()
        ).decode().rstrip('=')
        
        # Signature
        message = f"{header}.{payload_b64}"
        signature = hashlib.sha256(f"{message}.{secret}".encode()).digest()
        signature_b64 = base64.urlsafe_b64encode(signature).decode().rstrip('=')
        
        return f"{header}.{payload_b64}.{signature_b64}"
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """验证JWT Token"""
        try:
            import base64
            import json
            
            parts = token.split('.')
            if len(parts) != 3:
                return None
            
            # 解码payload
            payload_b64 = parts[1]
            padding = 4 - len(payload_b64) % 4
            if padding != 4:
                payload_b64 += '=' * padding
            
            payload = json.loads(base64.urlsafe_b64decode(payload_b64))
            
            # 检查过期
            if payload.get('exp', 0) < int(time.time()):
                return None
            
            return payload
        except Exception:
            return None


class AuthService:
    """Vercel KV 版本认证服务（同步实现）"""
    
    # KV Key 前缀
    PREFIX_USER_EMAIL = "user:email:"
    PREFIX_USER_ID = "user:id:"
    PREFIX_INVITE = "invite:code:"
    PREFIX_VERIFY = "verify:code:"
    KEY_REWARDS = "user:{}:rewards"
    KEY_INVITE_STATS = "user:{}:invites"
    
    @classmethod
    def generate_invite_code(cls) -> str:
        """生成6位随机邀请码"""
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        code = ''.join(secrets.choice(chars) for _ in range(6))
        return f"FC-{code}"
    
    @classmethod
    def hash_password(cls, password: str) -> str:
        """密码加密"""
        salt = secrets.token_hex(16)
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return salt + pwdhash.hex()
    
    @classmethod
    def verify_password(cls, password: str, hashed: str) -> bool:
        """验证密码"""
        if len(hashed) < 64:
            return False
        salt = hashed[:32]
        stored_hash = hashed[32:]
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return pwdhash.hex() == stored_hash
    
    @classmethod
    def is_valid_email(cls, email: str) -> bool:
        """验证邮箱格式"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def _run_async(coro):
        """运行异步协程并返回结果"""
        import asyncio
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # 如果事件循环正在运行，使用 run_coroutine_threadsafe
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(asyncio.run, coro)
                    return future.result()
            return loop.run_until_complete(coro)
        except RuntimeError:
            # 没有事件循环，创建新的
            return asyncio.run(coro)
    
    @classmethod
    def send_verification_email(cls, email: str) -> Dict:
        """发送验证码邮件（同步包装）"""
        try:
            # 检查冷却时间
            existing = cls._run_async(kv.get(f"{cls.PREFIX_VERIFY}{email}"))
            if existing:
                if time.time() - existing.get('sent_at', 0) < 60:
                    return {
                        'success': False,
                        'error': '请等待60秒后重试',
                        'cooldown': 60 - int(time.time() - existing['sent_at'])
                    }
            
            # 生成6位验证码
            code = ''.join(secrets.choice('0123456789') for _ in range(6))
            
            # 发送邮件（同步方式）
            result = send_verification_email_sync(email, code)
            
            if not result['success']:
                return result
            
            # 存储验证码（5分钟有效）
            cls._run_async(kv.set(f"{cls.PREFIX_VERIFY}{email}", {
                'code': code,
                'sent_at': time.time(),
                'attempts': 0
            }, ttl=300))
            
            return {
                'success': True,
                'message': '验证码已发送',
                'debug_code': result.get('debug_code')  # 开发环境返回
            }
            
        except Exception as e:
            print(f"[Send Email Error] {e}")
            return {'success': False, 'error': str(e)}
    
    @classmethod
    def verify_code(cls, email: str, code: str) -> bool:
        """验证邮箱验证码（同步）"""
        stored = cls._run_async(kv.get(f"{cls.PREFIX_VERIFY}{email}"))
        if not stored:
            return False
        
        if stored['code'] != code:
            stored['attempts'] = stored.get('attempts', 0) + 1
            cls._run_async(kv.set(f"{cls.PREFIX_VERIFY}{email}", stored, ttl=300))
            return False
        
        # 验证成功，删除验证码
        cls._run_async(kv.delete(f"{cls.PREFIX_VERIFY}{email}"))
        return True
    
    @classmethod
    def register(cls, email: str, password: str, verification_code: str, 
                 invite_code: Optional[str] = None) -> Dict:
        """用户注册（同步）"""
        try:
            # 验证邮箱格式
            if not cls.is_valid_email(email):
                return {'success': False, 'error': '邮箱格式不正确'}
            
            email = email.lower().strip()
            
            # 检查邮箱是否已注册
            existing = cls._run_async(kv.get(f"{cls.PREFIX_USER_EMAIL}{email}"))
            if existing:
                return {'success': False, 'error': '该邮箱已注册'}
            
            # 验证验证码
            if not cls.verify_code(email, verification_code):
                return {'success': False, 'error': '验证码错误或已过期'}
            
            # 验证密码强度
            if len(password) < 6:
                return {'success': False, 'error': '密码长度至少6位'}
            
            # 生成用户ID
            user_id = f"u_{secrets.token_hex(8)}"
            my_invite_code = cls.generate_invite_code()
            
            # 处理邀请码
            inviter_id = None
            if invite_code:
                inviter_id = cls._run_async(kv.get(f"{cls.PREFIX_INVITE}{invite_code.upper()}"))
            
            # 创建用户
            now = datetime.utcnow().isoformat()
            user_data = {
                'id': user_id,
                'email': email,
                'password_hash': cls.hash_password(password),
                'created_at': now,
                'updated_at': now,
                'invite_code': my_invite_code,
                'invited_by': inviter_id,
                'sync_enabled': True
            }
            
            # 保存用户（双向索引）
            cls._run_async(kv.set(f"{cls.PREFIX_USER_EMAIL}{email}", user_data))
            cls._run_async(kv.set(f"{cls.PREFIX_USER_ID}{user_id}", {'email': email}))
            
            # 保存邀请码映射
            cls._run_async(kv.set(f"{cls.PREFIX_INVITE}{my_invite_code}", user_id))
            
            # 初始化奖励
            rewards = {
                'ai_quota_bonus': 10,
                'templates_unlocked': ['basic', 'newcomer'],
                'badges': ['newcomer'],
                'granted_at': now
            }
            cls._run_async(kv.set(cls.KEY_REWARDS.format(user_id), rewards))
            
            # 初始化邀请统计
            cls._run_async(kv.set(cls.KEY_INVITE_STATS.format(user_id), {
                'total': 0,
                'successful': 0
            }))
            
            # 如果有邀请人，处理奖励
            if inviter_id:
                cls._process_invite_reward(inviter_id, user_id)
            
            # 生成Token
            access_token = JWTManager.generate_token(user_id, email, 'access')
            refresh_token = JWTManager.generate_token(user_id, email, 'refresh')
            
            return {
                'success': True,
                'user': {
                    'id': user_id,
                    'email': email,
                    'created_at': now,
                    'invite_code': my_invite_code
                },
                'token': access_token,
                'refresh_token': refresh_token,
                'rewards': [
                    {'type': 'ai_quota', 'value': 15, 'description': 'AI咨询15次/日'},
                    {'type': 'template', 'value': 'newcomer', 'description': '新星专属模板'},
                    {'type': 'badge', 'value': 'newcomer', 'description': '新星徽章'}
                ],
                'invite_reward': {
                    'inviter_name': '您的好友',
                    'reward_description': '+5次AI/日'
                } if inviter_id else None
            }
            
        except Exception as e:
            print(f"[Register Error] {e}")
            return {'success': False, 'error': '注册失败，请稍后重试'}
    
    @classmethod
    def login(cls, email: str, password: str, remember_me: bool = False) -> Dict:
        """用户登录（同步）"""
        try:
            email = email.lower().strip()
            user = cls._run_async(kv.get(f"{cls.PREFIX_USER_EMAIL}{email}"))
            
            if not user:
                return {'success': False, 'error': '邮箱或密码错误'}
            
            if not cls.verify_password(password, user['password_hash']):
                return {'success': False, 'error': '邮箱或密码错误'}
            
            # 生成Token
            access_token = JWTManager.generate_token(user['id'], email, 'access')
            refresh_token = JWTManager.generate_token(user['id'], email, 'refresh')
            
            # 更新最后登录时间
            user['last_login'] = datetime.utcnow().isoformat()
            cls._run_async(kv.set(f"{cls.PREFIX_USER_EMAIL}{email}", user))
            
            # 获取奖励信息
            rewards = cls._run_async(kv.get(cls.KEY_REWARDS.format(user['id'])))
            invite_stats = cls._run_async(kv.get(cls.KEY_INVITE_STATS.format(user['id'])))
            
            return {
                'success': True,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'invite_code': user['invite_code'],
                    'rewards': rewards or {},
                    'invite_stats': invite_stats or {'total': 0, 'successful': 0},
                    'sync_enabled': user.get('sync_enabled', True)
                },
                'token': access_token,
                'refresh_token': refresh_token,
                'requires_sync': True
            }
            
        except Exception as e:
            print(f"[Login Error] {e}")
            return {'success': False, 'error': '登录失败'}
    
    @classmethod
    def refresh_token(cls, refresh_token: str) -> Dict:
        """刷新Access Token"""
        payload = JWTManager.verify_token(refresh_token)
        if not payload or payload.get('type') != 'refresh':
            return {'success': False, 'error': '无效的刷新令牌'}
        
        user_id = payload['sub']
        email = payload['email']
        
        new_access_token = JWTManager.generate_token(user_id, email, 'access')
        
        return {
            'success': True,
            'token': new_access_token
        }
    
    @classmethod
    def get_user_by_token(cls, token: str) -> Optional[Dict]:
        """通过Token获取用户"""
        payload = JWTManager.verify_token(token)
        if not payload:
            return None
        
        email = payload.get('email')
        if not email:
            return None
        
        return cls._run_async(kv.get(f"{cls.PREFIX_USER_EMAIL}{email}"))
    
    @classmethod
    def _process_invite_reward(cls, inviter_id: str, invitee_id: str):
        """处理邀请奖励"""
        try:
            # 获取邀请人邮箱
            inviter_index = cls._run_async(kv.get(f"{cls.PREFIX_USER_ID}{inviter_id}"))
            if not inviter_index:
                return
            
            inviter = cls._run_async(kv.get(f"{cls.PREFIX_USER_EMAIL}{inviter_index['email']}"))
            if not inviter:
                return
            
            # 更新邀请统计
            stats = cls._run_async(kv.get(cls.KEY_INVITE_STATS.format(inviter_id))) or {
                'total': 0, 'successful': 0
            }
            stats['total'] += 1
            stats['successful'] += 1
            cls._run_async(kv.set(cls.KEY_INVITE_STATS.format(inviter_id), stats))
            
            # 获取当前奖励
            rewards = cls._run_async(kv.get(cls.KEY_REWARDS.format(inviter_id))) or {
                'ai_quota_bonus': 0,
                'templates_unlocked': [],
                'badges': []
            }
            
            # 添加奖励
            rewards['ai_quota_bonus'] = rewards.get('ai_quota_bonus', 0) + 5
            
            if 'guide' not in rewards.get('templates_unlocked', []):
                rewards.setdefault('templates_unlocked', []).append('guide')
            
            if 'guide' not in rewards.get('badges', []):
                rewards.setdefault('badges', []).append('guide')
            
            # 检查里程碑
            successful = stats['successful']
            if successful == 3:
                rewards['all_templates'] = True
                rewards['draw_quota_bonus'] = rewards.get('draw_quota_bonus', 0) + 3
            elif successful == 5:
                rewards['ai_unlimited'] = True
            elif successful == 10:
                rewards['premium_forever'] = True
            
            cls._run_async(kv.set(cls.KEY_REWARDS.format(inviter_id), rewards))
            
        except Exception as e:
            print(f"[Invite Reward Error] {e}")
    
    @classmethod
    def validate_invite_code(cls, code: str) -> Dict:
        """验证邀请码"""
        inviter_id = cls._run_async(kv.get(f"{cls.PREFIX_INVITE}{code.upper()}"))
        if not inviter_id:
            return {'valid': False}
        
        # 获取邀请人信息
        inviter_index = cls._run_async(kv.get(f"{cls.PREFIX_USER_ID}{inviter_id}"))
        if inviter_index:
            return {
                'valid': True,
                'inviter_name': inviter_index['email'].split('@')[0]
            }
        
        return {'valid': False}
    
    @classmethod
    def get_invite_info(cls, user_id: str) -> Dict:
        """获取用户邀请信息"""
        user_index = cls._run_async(kv.get(f"{cls.PREFIX_USER_ID}{user_id}"))
        if not user_index:
            return {'success': False, 'error': '用户不存在'}
        
        user = cls._run_async(kv.get(f"{cls.PREFIX_USER_EMAIL}{user_index['email']}"))
        if not user:
            return {'success': False, 'error': '用户不存在'}
        
        rewards = cls._run_async(kv.get(cls.KEY_REWARDS.format(user_id))) or {}
        stats = cls._run_async(kv.get(cls.KEY_INVITE_STATS.format(user_id))) or {
            'total': 0, 'successful': 0
        }
        
        successful = stats['successful']
        milestones = [3, 5, 10]
        next_milestone = None
        for m in milestones:
            if successful < m:
                next_milestone = {
                    'target': m,
                    'current': successful,
                    'remaining': m - successful
                }
                break
        
        return {
            'success': True,
            'invite_code': user['invite_code'],
            'invite_link': f"https://fortune-calendar.vercel.app/?invite={user['invite_code']}",
            'total_invites': stats['total'],
            'successful_invites': successful,
            'current_rewards': rewards,
            'next_milestone': next_milestone
        }
    
    @classmethod
    def update_sync_setting(cls, user_id: str, enabled: bool) -> Dict:
        """更新同步设置"""
        user_index = cls._run_async(kv.get(f"{cls.PREFIX_USER_ID}{user_id}"))
        if not user_index:
            return {'success': False, 'error': '用户不存在'}
        
        user = cls._run_async(kv.get(f"{cls.PREFIX_USER_EMAIL}{user_index['email']}"))
        if not user:
            return {'success': False, 'error': '用户不存在'}
        
        user['sync_enabled'] = enabled
        user['updated_at'] = datetime.utcnow().isoformat()
        
        cls._run_async(kv.set(f"{cls.PREFIX_USER_EMAIL}{user_index['email']}", user))
        
        return {'success': True, 'sync_enabled': enabled}


# 全局认证服务实例
auth_service = AuthService()
