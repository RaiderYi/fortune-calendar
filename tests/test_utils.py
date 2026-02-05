# -*- coding: utf-8 -*-
"""
测试工具模块
提供API请求封装、测试数据生成、断言辅助函数
"""

import json
import time
import random
import string
from datetime import datetime, date, timedelta
from typing import Dict, Any, Optional, List
import sys
import os

# 添加项目根目录到路径
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)
sys.path.insert(0, os.path.join(project_root, 'api'))

# ==================== API请求封装 ====================

class MockRequest:
    """模拟HTTP请求对象"""
    def __init__(self, path: str, method: str = 'POST', data: Dict = None, headers: Dict = None):
        self.path = path
        self.method = method
        self.data = data or {}
        self.headers = headers or {}
        self.rfile = MockRFile(data)
        self.wfile = MockWFile()
    
    def get_header(self, name: str, default: str = '') -> str:
        return self.headers.get(name, default)

class MockRFile:
    """模拟请求体读取对象"""
    def __init__(self, data: Dict):
        self._data = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self._pos = 0
    
    def read(self, size: int = -1) -> bytes:
        if size == -1:
            result = self._data[self._pos:]
            self._pos = len(self._data)
        else:
            result = self._data[self._pos:self._pos + size]
            self._pos += len(result)
        return result

class MockWFile:
    """模拟响应体写入对象"""
    def __init__(self):
        self._data = b''
        self.closed = False
    
    def write(self, data: bytes):
        if not self.closed:
            self._data += data
    
    def get_data(self) -> bytes:
        return self._data
    
    def get_json(self) -> Dict:
        try:
            return json.loads(self._data.decode('utf-8'))
        except:
            return {}

class MockHandler:
    """模拟API Handler"""
    def __init__(self, handler_class):
        self.handler_class = handler_class
        self.last_response = None
        self.last_status = None
    
    def make_request(self, path: str, method: str = 'POST', data: Dict = None, headers: Dict = None) -> Dict:
        """发起API请求"""
        request = MockRequest(path, method, data, headers)
        handler = self.handler_class()
        handler.path = path
        handler.command = method
        handler.rfile = request.rfile
        handler.wfile = request.wfile
        handler.headers = request.headers
        
        # 设置Content-Length
        if data:
            body = json.dumps(data, ensure_ascii=False).encode('utf-8')
            handler.headers['Content-Length'] = str(len(body))
        
        # 执行请求
        try:
            if method == 'GET':
                handler.do_GET()
            elif method == 'POST':
                handler.do_POST()
            elif method == 'OPTIONS':
                handler.do_OPTIONS()
        except Exception as e:
            print(f"[TEST ERROR] Request failed: {e}")
            return {'success': False, 'error': str(e)}
        
        # 获取响应
        response_data = handler.wfile.get_json()
        self.last_response = response_data
        return response_data

# ==================== 测试数据生成 ====================

def generate_test_birth_date() -> str:
    """生成随机测试出生日期"""
    year = random.randint(1980, 2000)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return f"{year}-{month:02d}-{day:02d}"

def generate_test_birth_time() -> str:
    """生成随机测试出生时间"""
    hour = random.randint(0, 23)
    minute = random.randint(0, 59)
    return f"{hour:02d}:{minute:02d}"

def generate_test_user_data() -> Dict[str, Any]:
    """生成测试用户数据"""
    return {
        'email': f"test_{random.randint(1000, 9999)}@example.com",
        'password': 'Test123456',
        'name': f"测试用户{random.randint(1, 100)}",
        'phone': f"138{random.randint(10000000, 99999999)}"
    }

def generate_test_fortune_request(date_str: Optional[str] = None) -> Dict[str, Any]:
    """生成测试运势请求数据"""
    if not date_str:
        date_str = datetime.now().strftime('%Y-%m-%d')
    
    return {
        'birthDate': generate_test_birth_date(),
        'birthTime': generate_test_birth_time(),
        'longitude': 120.0,
        'gender': random.choice(['male', 'female']),
        'date': date_str
    }

def generate_test_sync_data() -> Dict[str, Any]:
    """生成测试同步数据"""
    return {
        'profile': {
            'name': '测试用户',
            'gender': 'male',
            'birthDate': '1990-01-01',
            'birthTime': '12:00',
            'city': '北京'
        },
        'history': [
            {
                'date': (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d'),
                'score': random.randint(60, 100),
                'timestamp': int(time.time()) - i * 86400
            }
            for i in range(7)
        ],
        'achievements': [],
        'checkins': [],
        'feedbacks': []
    }

def generate_test_analytics_event(event_type: str = 'page_view', user_id: str = None) -> Dict[str, Any]:
    """生成测试统计事件（兼容analytics API格式）"""
    return {
        'type': event_type,
        'timestamp': int(time.time() * 1000),
        'data': {
            'page': '/today',
            'action': 'view_fortune',
            'userId': user_id or f"user_{random.randint(1000, 9999)}"
        }
    }

# ==================== 断言辅助函数 ====================

def assert_success(response: Dict, message: str = "API should return success"):
    """断言API响应成功"""
    assert response.get('success') == True, f"{message}: {response.get('error', 'Unknown error')}"
    return True

def assert_error(response: Dict, expected_error: str = None, message: str = "API should return error"):
    """断言API响应失败"""
    assert response.get('success') == False, f"{message}: Expected error but got success"
    if expected_error:
        error_msg = response.get('error', '')
        assert expected_error in error_msg or expected_error in str(response), \
            f"{message}: Expected '{expected_error}' but got '{error_msg}'"
    return True

def assert_has_field(response: Dict, field: str, message: str = None):
    """断言响应包含指定字段"""
    msg = message or f"Response should have field '{field}'"
    assert field in response, f"{msg}: {list(response.keys())}"
    return True

def assert_field_type(response: Dict, field: str, expected_type: type, message: str = None):
    """断言字段类型"""
    assert_has_field(response, field, message)
    msg = message or f"Field '{field}' should be {expected_type.__name__}"
    assert isinstance(response[field], expected_type), \
        f"{msg}: got {type(response[field]).__name__}"
    return True

def assert_score_range(score: float, min_score: int = 0, max_score: int = 100):
    """断言分数在合理范围内"""
    assert min_score <= score <= max_score, \
        f"Score {score} should be between {min_score} and {max_score}"
    return True

def assert_dates_different(results: List[Dict], date_field: str = 'date'):
    """断言不同日期的结果不同"""
    unique_values = set()
    for result in results:
        if date_field in result:
            unique_values.add(str(result[date_field]))
    
    assert len(unique_values) > 1, \
        f"All results should have different {date_field} values"
    return True

def assert_response_time(start_time: float, max_time: float, endpoint: str = "API"):
    """断言响应时间"""
    elapsed = time.time() - start_time
    assert elapsed < max_time, \
        f"{endpoint} response time {elapsed:.2f}s exceeds maximum {max_time}s"
    return elapsed

# ==================== 测试辅助函数 ====================

def get_test_dates(count: int = 7, start_date: date = None) -> List[str]:
    """获取测试日期列表"""
    if not start_date:
        start_date = date.today()
    return [(start_date + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(count)]

def compare_fortune_results(result1: Dict, result2: Dict) -> Dict[str, bool]:
    """比较两个运势结果"""
    comparison = {
        'scores_different': result1.get('totalScore') != result2.get('totalScore'),
        'themes_different': result1.get('mainTheme') != result2.get('mainTheme'),
        'todos_different': result1.get('suitable') != result2.get('suitable') or \
                          result1.get('unsuitable') != result2.get('unsuitable')
    }
    return comparison

def extract_token_from_response(response: Dict) -> Optional[str]:
    """从响应中提取Token"""
    if 'data' in response and 'token' in response['data']:
        return response['data']['token']
    return None

def create_auth_headers(token: str) -> Dict[str, str]:
    """创建认证头"""
    return {'Authorization': f'Bearer {token}'}

# ==================== 性能测试辅助 ====================

class PerformanceTimer:
    """性能计时器"""
    def __init__(self):
        self.start_time = None
        self.end_time = None
    
    def start(self):
        self.start_time = time.time()
        return self
    
    def stop(self):
        self.end_time = time.time()
        return self
    
    def elapsed(self) -> float:
        if self.start_time and self.end_time:
            return self.end_time - self.start_time
        return 0.0
    
    def __enter__(self):
        self.start()
        return self
    
    def __exit__(self, *args):
        self.stop()

def measure_api_performance(handler: MockHandler, path: str, data: Dict, 
                           max_time: float = 3.0, headers: Dict = None) -> Dict[str, Any]:
    """测量API性能"""
    timer = PerformanceTimer()
    timer.start()
    response = handler.make_request(path, 'POST', data, headers)
    elapsed = timer.stop().elapsed()
    
    return {
        'success': response.get('success', False),
        'response_time': elapsed,
        'within_limit': elapsed < max_time,
        'response': response
    }
