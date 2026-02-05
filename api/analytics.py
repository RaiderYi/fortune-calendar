# -*- coding: utf-8 -*-
"""
统计分析 API
收集和分析用户行为数据
"""

from http.server import BaseHTTPRequestHandler
import json
import time
import os
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

def save_analytics_data(date: str, data: dict):
    """保存统计数据"""
    kv = get_kv()
    key = f"analytics:date:{date}"
    
    if KV_AVAILABLE:
        existing = kv.get(key)
        if existing:
            existing_data = json.loads(existing)
            # 合并数据
            for k, v in data.items():
                if k in existing_data:
                    if isinstance(v, (int, float)) and isinstance(existing_data[k], (int, float)):
                        existing_data[k] += v
                    elif isinstance(v, dict) and isinstance(existing_data[k], dict):
                        for sub_k, sub_v in v.items():
                            existing_data[k][sub_k] = existing_data[k].get(sub_k, 0) + sub_v
                    else:
                        existing_data[k] = v
                else:
                    existing_data[k] = v
            kv.set(key, json.dumps(existing_data, ensure_ascii=False))
        else:
            kv.set(key, json.dumps(data, ensure_ascii=False))
    else:
        if key in kv:
            existing_data = kv[key]
            for k, v in data.items():
                if k in existing_data:
                    if isinstance(v, (int, float)) and isinstance(existing_data[k], (int, float)):
                        existing_data[k] += v
                    elif isinstance(v, dict) and isinstance(existing_data[k], dict):
                        for sub_k, sub_v in v.items():
                            existing_data[k][sub_k] = existing_data[k].get(sub_k, 0) + sub_v
                    else:
                        existing_data[k] = v
                else:
                    existing_data[k] = v
            kv[key] = existing_data
        else:
            kv[key] = data

def get_analytics_data(date: str) -> dict:
    """获取统计数据"""
    kv = get_kv()
    key = f"analytics:date:{date}"
    
    if KV_AVAILABLE:
        data = kv.get(key)
        return json.loads(data) if data else {}
    else:
        return kv.get(key, {})

def get_analytics_range(start_date: str, end_date: str) -> list:
    """获取日期范围的统计数据"""
    # 简化实现：返回最近7天的数据
    results = []
    for i in range(7):
        date_key = (time.time() - i * 86400) // 86400
        date_str = time.strftime('%Y-%m-%d', time.localtime(date_key * 86400))
        data = get_analytics_data(date_str)
        if data:
            results.append({'date': date_str, **data})
    return results

# ==================== HTTP Handler ====================

class handler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """处理 OPTIONS 请求 - CORS 预检"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """处理 POST 请求"""
        parsed_path = urlparse(self.path)
        
        if '/analytics/track' in parsed_path.path:
            self._handle_track()
        else:
            self._send_error(404, 'Not Found')
    
    def do_GET(self):
        """处理 GET 请求"""
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        
        if '/analytics/stats' in parsed_path.path:
            self._handle_get_stats(query_params)
        else:
            self._send_error(404, 'Not Found')
    
    def _handle_track(self):
        """处理事件追踪"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            event_type = data.get('type', '')
            timestamp = data.get('timestamp', int(time.time() * 1000))
            event_data = data.get('data', {})
            
            # 获取日期
            date_str = time.strftime('%Y-%m-%d', time.localtime(timestamp / 1000))
            
            # 更新统计数据
            analytics_data = {
                'totalEvents': 1,
                'eventTypes': {event_type: 1},
            }
            
            if event_type == 'page_view':
                analytics_data['pageViews'] = 1
            elif event_type == 'feature_usage':
                feature = event_data.get('feature', 'unknown')
                analytics_data['featureUsage'] = {feature: 1}
            
            save_analytics_data(date_str, analytics_data)
            
            self._send_json(200, {'success': True})
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_get_stats(self, query_params):
        """获取统计数据"""
        try:
            start_date = query_params.get('start', [None])[0]
            end_date = query_params.get('end', [None])[0]
            
            if start_date and end_date:
                data = get_analytics_range(start_date, end_date)
            else:
                # 返回今天的数据
                today = time.strftime('%Y-%m-%d')
                data = get_analytics_data(today)
            
            self._send_json(200, {'success': True, 'data': data})
            
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
