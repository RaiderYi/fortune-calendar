# -*- coding: utf-8 -*-
"""
Fortune Calendar API - Vercel Serverless 入口 v2.0
支持邮箱认证、邀请系统、数据同步（Vercel KV）
"""

import json
import datetime
import os
import traceback
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse

# 导入业务服务 - 使用 try-except 处理 Vercel 环境的导入问题
try:
    from .routes.auth_routes import handle_auth_request
    from .routes.sync_routes import handle_sync_request
    from .services.ai_service import AIService
    from .services.fortune_service import FortuneService
    from .utils.json_utils import safe_json_dumps
except ImportError:
    # Vercel 部署时的备用导入方式
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from routes.auth_routes import handle_auth_request
    from routes.sync_routes import handle_sync_request
    from services.ai_service import AIService
    from services.fortune_service import FortuneService
    from utils.json_utils import safe_json_dumps


class handler(BaseHTTPRequestHandler):
    """
    Vercel 入口处理器
    负责路由分发、CORS 处理和基础异常捕获
    """

    def _send_json_response(self, status_code, data):
        """统一发送 JSON 响应"""
        try:
            self.send_response(status_code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()
            
            # 使用安全的 JSON 序列化
            response_json = safe_json_dumps(data)
            self.wfile.write(response_json.encode('utf-8'))
        except Exception as e:
            print(f"[ERROR] 发送响应失败: {str(e)}")
            # 最后的退路
            try:
                if not self.wfile.closed:
                    self.wfile.write(json.dumps({"success": False, "error": "Internal Server Error"}).encode('utf-8'))
            except Exception:
                pass

    def do_OPTIONS(self):
        """处理预检请求"""
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        """处理 GET 请求"""
        try:
            parsed_path = urlparse(self.path)
            path = parsed_path.path
            
            # 健康检查
            if path == '/' or path == '/api':
                self._send_json_response(200, {
                    'success': True,
                    'message': 'Fortune Calendar API v2.0 is running',
                    'features': ['email-auth', 'invite-system', 'data-sync', 'vercel-kv'],
                    'timestamp': datetime.datetime.now().isoformat()
                })
                return
            
            # 认证路由
            if path.startswith('/api/auth') or path.startswith('/api/invite') or path.startswith('/api/user'):
                headers = {'Authorization': self.headers.get('Authorization', '')}
                response = handle_auth_request(path, 'GET', {}, headers)
                try:
                    response_data = json.loads(response)
                    status = response_data.pop('code', 200 if response_data.get('success') else 400)
                    self._send_json_response(status, response_data)
                except:
                    self._send_json_response(500, {'success': False, 'error': 'Invalid response'})
                return
            
            # 同步路由
            if path.startswith('/api/sync'):
                headers = {'Authorization': self.headers.get('Authorization', '')}
                response = handle_sync_request(path, 'GET', {}, headers)
                try:
                    response_data = json.loads(response)
                    status = response_data.pop('code', 200 if response_data.get('success') else 400)
                    self._send_json_response(status, response_data)
                except:
                    self._send_json_response(500, {'success': False, 'error': 'Invalid response'})
                return
            
            self._send_json_response(404, {'success': False, 'error': 'Not found'})
            
        except Exception as e:
            print(f"[ERROR] GET请求处理失败: {str(e)}")
            print(traceback.format_exc())
            self._send_json_response(500, {'success': False, 'error': 'Internal Server Error'})

    def do_POST(self):
        """处理 POST 请求"""
        try:
            parsed_path = urlparse(self.path)
            path = parsed_path.path
            
            # 读取请求体
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8')) if body else {}
            
            # 认证/邀请/用户路由
            if path.startswith('/api/auth') or path.startswith('/api/invite') or path.startswith('/api/user'):
                headers = {'Authorization': self.headers.get('Authorization', '')}
                response = handle_auth_request(path, 'POST', data, headers)
                try:
                    response_data = json.loads(response)
                    status = response_data.pop('code', 200 if response_data.get('success') else 400)
                    self._send_json_response(status, response_data)
                except Exception as e:
                    print(f"[Parse Error] {e}")
                    self._send_json_response(500, {'success': False, 'error': 'Invalid response'})
                return
            
            # 同步路由
            if path.startswith('/api/sync'):
                headers = {'Authorization': self.headers.get('Authorization', '')}
                response = handle_sync_request(path, 'POST', data, headers)
                try:
                    response_data = json.loads(response)
                    status = response_data.pop('code', 200 if response_data.get('success') else 400)
                    self._send_json_response(status, response_data)
                except:
                    self._send_json_response(500, {'success': False, 'error': 'Invalid response'})
                return
            
            # AI 聊天接口
            if path.endswith('/ai-chat'):
                self._handle_ai_route(data)
                return
            
            # 运势分析接口
            if path.endswith('/fortune') or path.endswith('/fortune-year'):
                self._handle_fortune_route(data, path.endswith('/fortune-year'))
                return
            
            # 未知路径
            self._send_json_response(404, {
                'success': False,
                'error': f'Endpoint not found: {path}'
            })

        except json.JSONDecodeError:
            self._send_json_response(400, {'success': False, 'error': 'Invalid JSON body'})
        except Exception as e:
            print(f"[CRITICAL] Unhandled Exception: {str(e)}")
            print(traceback.format_exc())
            self._send_json_response(500, {
                'success': False,
                'error': 'Internal Server Error',
                'message': str(e) if os.environ.get('VERCEL_ENV') == 'development' else '请稍后再试'
            })

    def do_PUT(self):
        """处理 PUT 请求"""
        try:
            parsed_path = urlparse(self.path)
            path = parsed_path.path
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8')) if body else {}
            
            headers = {'Authorization': self.headers.get('Authorization', '')}
            
            # 认证路由
            if path.startswith('/api/auth') or path.startswith('/api/user'):
                response = handle_auth_request(path, 'PUT', data, headers)
                try:
                    response_data = json.loads(response)
                    status = response_data.pop('code', 200 if response_data.get('success') else 400)
                    self._send_json_response(status, response_data)
                except:
                    self._send_json_response(500, {'success': False, 'error': 'Invalid response'})
                return
            
            # 同步路由
            if path.startswith('/api/sync'):
                response = handle_sync_request(path, 'PUT', data, headers)
                try:
                    response_data = json.loads(response)
                    status = response_data.pop('code', 200 if response_data.get('success') else 400)
                    self._send_json_response(status, response_data)
                except:
                    self._send_json_response(500, {'success': False, 'error': 'Invalid response'})
                return
            
            self._send_json_response(404, {'success': False, 'error': 'Not found'})
            
        except Exception as e:
            print(f"[ERROR] PUT请求处理失败: {str(e)}")
            self._send_json_response(500, {'success': False, 'error': 'Internal Server Error'})

    def do_DELETE(self):
        """处理 DELETE 请求"""
        try:
            parsed_path = urlparse(self.path)
            path = parsed_path.path
            
            headers = {'Authorization': self.headers.get('Authorization', '')}
            
            # 同步路由
            if path.startswith('/api/sync'):
                response = handle_sync_request(path, 'DELETE', {}, headers)
                try:
                    response_data = json.loads(response)
                    status = response_data.pop('code', 200 if response_data.get('success') else 400)
                    self._send_json_response(status, response_data)
                except:
                    self._send_json_response(500, {'success': False, 'error': 'Invalid response'})
                return
            
            self._send_json_response(404, {'success': False, 'error': 'Not found'})
            
        except Exception as e:
            print(f"[ERROR] DELETE请求处理失败: {str(e)}")
            self._send_json_response(500, {'success': False, 'error': 'Internal Server Error'})

    def _handle_ai_route(self, data):
        """处理 AI 路由"""
        try:
            messages = data.get('messages', [])
            bazi_context = data.get('baziContext', {})
            
            api_key = os.environ.get('DEEPSEEK_API_KEY')
            if not api_key:
                self._send_json_response(500, {'success': False, 'error': 'AI configuration missing'})
                return

            system_prompt = AIService.build_bazi_system_prompt(bazi_context)
            full_messages = [{'role': 'system', 'content': system_prompt}] + messages
            
            ai_message = AIService.call_deepseek_api(api_key, full_messages)
            self._send_json_response(200, {'success': True, 'message': ai_message})
        except Exception as e:
            self._send_json_response(500, {'success': False, 'error': str(e)})

    def _handle_fortune_route(self, data, is_year=False):
        """处理运势路由"""
        if is_year:
            result = FortuneService.handle_fortune_year_request(data)
        else:
            result = FortuneService.handle_fortune_request(data)
        status_code = result.pop('code', 200)
        self._send_json_response(status_code, result)
