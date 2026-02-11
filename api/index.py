# -*- coding: utf-8 -*-
"""
Fortune Calendar API - Vercel Serverless 入口 v2.1
"""

import json
import datetime
import os
import sys

# 添加 api 目录到路径
api_dir = os.path.dirname(os.path.abspath(__file__))
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)


def handler(event, context):
    """
    Vercel Python Serverless Function 入口
    event: { 'path', 'httpMethod', 'headers', 'body', 'queryStringParameters' }
    context: Lambda context
    """
    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    headers = event.get('headers', {}) or {}
    
    # 解析请求体
    body = {}
    if event.get('body'):
        try:
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            else:
                body = event['body']
        except:
            body = {}
    
    # 构建 Response helper
    def response(status_code, data):
        return {
            'statusCode': status_code,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': json.dumps(data, ensure_ascii=False)
        }
    
    # 处理 OPTIONS 预检请求
    if method == 'OPTIONS':
        return response(204, {})
    
    # 健康检查
    if path == '/' or path == '/api':
        return response(200, {
            'success': True,
            'message': 'Fortune Calendar API v2.1',
            'timestamp': datetime.datetime.now().isoformat()
        })
    
    try:
        # 认证/邀请/用户路由
        if path.startswith('/api/auth') or path.startswith('/api/invite') or path.startswith('/api/user'):
            try:
                from routes.auth_routes import handle_auth_request
                result = handle_auth_request(path, method, body, headers)
                result_data = json.loads(result)
                status = result_data.pop('code', 200 if result_data.get('success') else 400)
                return response(status, result_data)
            except Exception as e:
                import traceback
                print(f"[Auth Error] {e}")
                traceback.print_exc()
                return response(500, {'success': False, 'error': str(e)})
        
        # 同步路由
        if path.startswith('/api/sync'):
            try:
                from routes.sync_routes import handle_sync_request
                result = handle_sync_request(path, method, body, headers)
                result_data = json.loads(result)
                status = result_data.pop('code', 200 if result_data.get('success') else 400)
                return response(status, result_data)
            except Exception as e:
                import traceback
                print(f"[Sync Error] {e}")
                traceback.print_exc()
                return response(500, {'success': False, 'error': str(e)})
        
        # 运势分析 - 支持 /api/fortune 和 /fortune
        if path.endswith('/fortune'):
            try:
                from services.fortune_service import FortuneService
                result = FortuneService.handle_fortune_request(body)
                status = result.pop('code', 200)
                return response(status, result)
            except Exception as e:
                import traceback
                print(f"[Fortune Error] {e}")
                traceback.print_exc()
                return response(500, {'success': False, 'error': str(e), 'traceback': traceback.format_exc()})
        
        # 年运势分析
        if path.endswith('/fortune-year'):
            try:
                from services.fortune_service import FortuneService
                result = FortuneService.handle_fortune_year_request(body)
                status = result.pop('code', 200)
                return response(status, result)
            except Exception as e:
                import traceback
                print(f"[FortuneYear Error] {e}")
                traceback.print_exc()
                return response(500, {'success': False, 'error': str(e)})
        
        # AI 聊天
        if path.endswith('/ai-chat'):
            try:
                from services.ai_service import AIService
                messages = body.get('messages', [])
                bazi_context = body.get('baziContext', {})
                
                api_key = os.environ.get('DEEPSEEK_API_KEY')
                if not api_key:
                    return response(500, {'success': False, 'error': 'AI not configured'})
                
                system_prompt = AIService.build_bazi_system_prompt(bazi_context)
                full_messages = [{'role': 'system', 'content': system_prompt}] + messages
                ai_message = AIService.call_deepseek_api(api_key, full_messages)
                return response(200, {'success': True, 'message': ai_message})
            except Exception as e:
                import traceback
                print(f"[AI Error] {e}")
                traceback.print_exc()
                return response(500, {'success': False, 'error': str(e)})
        
        # 未知路径
        return response(404, {'success': False, 'error': 'Not found'})
        
    except Exception as e:
        import traceback
        print(f"[CRITICAL] {e}")
        traceback.print_exc()
        return response(500, {
            'success': False,
            'error': 'Internal Server Error',
            'details': str(e)
        })
