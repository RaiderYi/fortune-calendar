# -*- coding: utf-8 -*-
"""
Fortune Calendar API - 模块化入口版本
由 api/index.py 拆分而来，采用分层架构
"""

import json
import datetime
import os
import traceback
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse

# 导入业务服务 - 使用 try-except 处理 Vercel 环境的导入问题
try:
    from .services.auth_service import AuthService
    from .services.ai_service import AIService
    from .services.fortune_service import FortuneService
    from .utils.json_utils import safe_json_dumps
except ImportError:
    # Vercel 部署时的备用导入方式
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from services.auth_service import AuthService
    from services.ai_service import AIService
    from services.fortune_service import FortuneService
    from utils.json_utils import safe_json_dumps

class handler(BaseHTTPRequestHandler):
    """
    Vercel 入口处理器
    仅负责路由分发、CORS 处理和基础异常捕获
    """

    def _send_json_response(self, status_code, data):
        """统一发送 JSON 响应"""
        try:
            self.send_response(status_code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
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
            except:
                pass

    def do_OPTIONS(self):
        """处理预检请求"""
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        """处理健康检查"""
        self._send_json_response(200, {
            'success': True,
            'message': 'Fortune Calendar API is running',
            'version': '2.0 (Modular)',
            'timestamp': datetime.datetime.now().isoformat()
        })

    def do_POST(self):
        """请求路由分发"""
        try:
            parsed_path = urlparse(self.path)
            path = parsed_path.path
            
            # 读取请求体
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8')) if body else {}

            # 1. 认证接口 (/api/auth/*)
            if '/auth/' in path:
                self._handle_auth_route(path, data)
                return

            # 2. AI 聊天接口 (/api/ai-chat)
            if path.endswith('/ai-chat'):
                self._handle_ai_route(data)
                return

            # 3. 运势分析接口 (/api/fortune)
            if path.endswith('/fortune') or path == '/api' or path == '/':
                self._handle_fortune_route(data)
                return

            # 3.1 年运势接口 (/api/fortune-year) - 十年趋势
            if path.endswith('/fortune-year'):
                self._handle_fortune_year_route(data)
                return

            # 4. 统计分析接口 (/api/analytics/*)
            if '/analytics/' in path:
                self._handle_analytics_route(path, data)
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

    def _handle_auth_route(self, path, data):
        """处理认证路由"""
        if '/register' in path:
            result = AuthService.register(data)
        elif '/login' in path:
            result = AuthService.login(data)
        elif '/verify' in path:
            # Token 验证
            auth_header = self.headers.get('Authorization', '')
            token = auth_header[7:] if auth_header.startswith('Bearer ') else None
            payload = AuthService.decode_jwt(token) if token else None
            if payload:
                result = {'success': True, 'data': payload, 'code': 200}
            else:
                result = {'success': False, 'error': 'Unauthorized', 'code': 401}
        else:
            result = {'success': False, 'error': 'Auth action not found', 'code': 404}
        
        status_code = result.pop('code', 200)
        self._send_json_response(status_code, result)

    def _handle_ai_route(self, data):
        """处理 AI 路由"""
        try:
            messages = data.get('messages', [])
            bazi_context = data.get('baziContext', {})
            
            api_key = os.environ.get('sk-5de6598eb59e448f9e829350d56cbd00')
            if not api_key:
                self._send_json_response(500, {'success': False, 'error': 'AI configuration missing'})
                return

            system_prompt = AIService.build_bazi_system_prompt(bazi_context)
            full_messages = [{'role': 'system', 'content': system_prompt}] + messages
            
            ai_message = AIService.call_deepseek_api(api_key, full_messages)
            self._send_json_response(200, {'success': True, 'message': ai_message})
        except Exception as e:
            self._send_json_response(500, {'success': False, 'error': str(e)})

    def _handle_fortune_route(self, data):
        """处理运势路由"""
        result = FortuneService.handle_fortune_request(data)
        status_code = result.pop('code', 200)
        self._send_json_response(status_code, result)

    def _handle_fortune_year_route(self, data):
        """处理年运势路由 - 十年趋势"""
        result = FortuneService.handle_fortune_year_request(data)
        status_code = result.pop('code', 200)
        self._send_json_response(status_code, result)
