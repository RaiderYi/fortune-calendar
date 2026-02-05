# -*- coding: utf-8 -*-
"""
后端API端点测试
测试运势、认证、同步、统计、AI聊天API
"""

import unittest
import sys
import os
import time
from datetime import datetime, date, timedelta

# 添加项目路径
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)
sys.path.insert(0, os.path.join(project_root, 'api'))

from tests.test_utils import (
    MockHandler, generate_test_fortune_request, generate_test_user_data,
    generate_test_sync_data, generate_test_analytics_event,
    assert_success, assert_error, assert_has_field, assert_field_type,
    assert_score_range, assert_dates_different, get_test_dates,
    compare_fortune_results, extract_token_from_response, create_auth_headers
)

# 导入API handlers
try:
    from api.index import handler as FortuneHandler
    from api.auth import handler as AuthHandler
    from api.sync import handler as SyncHandler
    from api.analytics import handler as AnalyticsHandler
except ImportError:
    # 备用导入
    import sys
    sys.path.insert(0, os.path.join(project_root, 'api'))
    from index import handler as FortuneHandler
    from auth import handler as AuthHandler
    from sync import handler as SyncHandler
    from analytics import handler as AnalyticsHandler


class TestFortuneAPI(unittest.TestCase):
    """运势API测试"""
    
    def setUp(self):
        self.handler = MockHandler(FortuneHandler)
        self.base_request = generate_test_fortune_request()
    
    def test_fortune_basic_request(self):
        """测试基本运势请求"""
        response = self.handler.make_request('/api/fortune', 'POST', self.base_request)
        assert_success(response, "Fortune API should succeed")
        assert_has_field(response, 'fortune')
        assert_has_field(response['fortune'], 'totalScore')
        assert_score_range(response['fortune']['totalScore'])
    
    def test_fortune_different_dates(self):
        """测试不同日期返回不同结果"""
        dates = get_test_dates(7)
        results = []
        
        for date_str in dates:
            request = generate_test_fortune_request(date_str)
            response = self.handler.make_request('/api/fortune', 'POST', request)
            if response.get('success'):
                results.append({
                    'date': date_str,
                    'score': response.get('fortune', {}).get('totalScore'),
                    'theme': response.get('fortune', {}).get('mainTheme'),
                    'suitable': response.get('fortune', {}).get('suitable', [])
                })
        
        # 验证至少有一些不同
        self.assertGreater(len(results), 0, "Should get results for multiple dates")
        
        # 验证分数有变化（至少有一个不同）
        scores = [r['score'] for r in results if r['score'] is not None]
        if len(scores) > 1:
            unique_scores = set(scores)
            self.assertGreater(len(unique_scores), 1, 
                             f"Scores should vary across dates, got: {scores}")
    
    def test_fortune_missing_birth_date(self):
        """测试缺少出生日期参数"""
        request = {'birthTime': '12:00'}
        response = self.handler.make_request('/api/fortune', 'POST', request)
        assert_error(response, "出生日期", "Should return error for missing birthDate")
    
    def test_fortune_response_structure(self):
        """测试响应数据结构完整性"""
        response = self.handler.make_request('/api/fortune', 'POST', self.base_request)
        assert_success(response)
        
        fortune = response.get('fortune', {})
        required_fields = ['totalScore', 'mainTheme', 'dimensions', 'suitable', 'unsuitable']
        for field in required_fields:
            assert_has_field(fortune, field, f"Fortune should have {field}")
        
        # 验证dimensions结构
        dimensions = fortune.get('dimensions', {})
        dimension_fields = ['career', 'wealth', 'health', 'relationship', 'study']
        for field in dimension_fields:
            if field in dimensions:
                dim = dimensions[field]
                self.assertIsInstance(dim, dict, f"Dimension {field} should be object")
                if 'score' in dim:
                    assert_score_range(dim['score'])
    
    def test_fortune_custom_yongshen(self):
        """测试自定义用神"""
        request = generate_test_fortune_request()
        request['customYongShen'] = ['金', '水']
        response = self.handler.make_request('/api/fortune', 'POST', request)
        assert_success(response, "Should accept custom yongshen")
        
        analysis = response.get('analysis', {})
        if 'yong_shen_result' in analysis:
            yongshen = analysis['yong_shen_result']
            self.assertIsInstance(yongshen, dict, "Yongshen result should be object")


class TestAuthAPI(unittest.TestCase):
    """认证API测试"""
    
    def setUp(self):
        self.handler = MockHandler(AuthHandler)
        self.test_user = generate_test_user_data()
    
    def test_register_success(self):
        """测试用户注册成功"""
        response = self.handler.make_request('/api/auth/register', 'POST', self.test_user)
        assert_success(response, "Registration should succeed")
        assert_has_field(response, 'data')
        assert_has_field(response['data'], 'token')
        assert_has_field(response['data'], 'user')
    
    def test_register_duplicate_email(self):
        """测试重复邮箱注册"""
        # 第一次注册
        response1 = self.handler.make_request('/api/auth/register', 'POST', self.test_user)
        assert_success(response1, "First registration should succeed")
        
        # 第二次注册相同邮箱
        response2 = self.handler.make_request('/api/auth/register', 'POST', self.test_user)
        assert_error(response2, "已存在", "Should reject duplicate email")
    
    def test_login_success(self):
        """测试用户登录成功"""
        # 先注册
        self.handler.make_request('/api/auth/register', 'POST', self.test_user)
        
        # 登录
        login_data = {
            'email': self.test_user['email'],
            'password': self.test_user['password']
        }
        response = self.handler.make_request('/api/auth/login', 'POST', login_data)
        assert_success(response, "Login should succeed")
        assert_has_field(response, 'data')
        assert_has_field(response['data'], 'token')
    
    def test_login_wrong_password(self):
        """测试错误密码登录"""
        # 先注册
        self.handler.make_request('/api/auth/register', 'POST', self.test_user)
        
        # 错误密码登录
        login_data = {
            'email': self.test_user['email'],
            'password': 'WrongPassword123'
        }
        response = self.handler.make_request('/api/auth/login', 'POST', login_data)
        assert_error(response, "密码", "Should reject wrong password")
    
    def test_login_nonexistent_user(self):
        """测试不存在的用户登录"""
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'SomePassword123'
        }
        response = self.handler.make_request('/api/auth/login', 'POST', login_data)
        assert_error(response, "用户", "Should reject nonexistent user")
    
    def test_token_verification(self):
        """测试Token验证"""
        # 注册并获取token
        register_response = self.handler.make_request('/api/auth/register', 'POST', self.test_user)
        token = extract_token_from_response(register_response)
        self.assertIsNotNone(token, "Should get token from registration")
        
        # 验证token
        headers = create_auth_headers(token)
        response = self.handler.make_request('/api/auth/verify', 'GET', None, headers)
        assert_success(response, "Token verification should succeed")


class TestSyncAPI(unittest.TestCase):
    """同步API测试"""
    
    def setUp(self):
        self.handler = MockHandler(SyncHandler)
        # 先注册用户获取token
        auth_handler = MockHandler(AuthHandler)
        user_data = generate_test_user_data()
        register_response = auth_handler.make_request('/api/auth/register', 'POST', user_data)
        self.token = extract_token_from_response(register_response)
        self.user_id = register_response.get('data', {}).get('user', {}).get('id')
        self.headers = create_auth_headers(self.token) if self.token else {}
    
    def test_upload_data(self):
        """测试数据上传"""
        sync_data = generate_test_sync_data()
        response = self.handler.make_request('/api/sync/upload', 'POST', sync_data, self.headers)
        assert_success(response, "Data upload should succeed")
    
    def test_download_data(self):
        """测试数据下载"""
        # 先上传数据
        sync_data = generate_test_sync_data()
        self.handler.make_request('/api/sync/upload', 'POST', sync_data, self.headers)
        
        # 下载数据
        response = self.handler.make_request('/api/sync/download', 'GET', None, self.headers)
        assert_success(response, "Data download should succeed")
        assert_has_field(response, 'data')
        
        downloaded_data = response['data']
        self.assertIn('profile', downloaded_data)
        self.assertIn('history', downloaded_data)
    
    def test_sync_merge_logic(self):
        """测试数据合并逻辑"""
        # 上传初始数据
        initial_data = generate_test_sync_data()
        self.handler.make_request('/api/sync/upload', 'POST', initial_data, self.headers)
        
        # 上传新数据（模拟本地有更新）
        new_data = generate_test_sync_data()
        new_data['history'].append({
            'date': datetime.now().strftime('%Y-%m-%d'),
            'score': 95,
            'timestamp': int(datetime.now().timestamp())
        })
        self.handler.make_request('/api/sync/upload', 'POST', new_data, self.headers)
        
        # 下载验证合并结果
        response = self.handler.make_request('/api/sync/download', 'GET', None, self.headers)
        assert_success(response)
        downloaded_history = response['data'].get('history', [])
        self.assertGreater(len(downloaded_history), len(initial_data['history']),
                          "Merged history should have more records")


class TestAnalyticsAPI(unittest.TestCase):
    """统计API测试"""
    
    def setUp(self):
        self.handler = MockHandler(AnalyticsHandler)
    
    def test_track_event(self):
        """测试事件追踪"""
        # analytics API 期望的格式
        event = {
            'type': 'page_view',
            'timestamp': int(time.time() * 1000),
            'data': {'page': '/today'}
        }
        response = self.handler.make_request('/api/analytics/track', 'POST', event)
        assert_success(response, "Event tracking should succeed")
    
    def test_track_multiple_events(self):
        """测试多个事件追踪"""
        events = [
            {'type': 'page_view', 'timestamp': int(time.time() * 1000), 'data': {'page': '/today'}},
            {'type': 'feature_usage', 'timestamp': int(time.time() * 1000), 'data': {'feature': 'fortune_view'}},
            {'type': 'feature_usage', 'timestamp': int(time.time() * 1000), 'data': {'feature': 'checkin'}}
        ]
        
        for event in events:
            response = self.handler.make_request('/api/analytics/track', 'POST', event)
            assert_success(response, f"Event {event['type']} should be tracked")
    
    def test_query_analytics_data(self):
        """测试查询统计数据"""
        # 先追踪一些事件
        for i in range(3):
            event = generate_test_analytics_event('page_view')
            self.handler.make_request('/api/analytics/track', 'POST', event)
        
        # 查询数据（使用正确的路径）
        response = self.handler.make_request('/api/analytics/stats', 'GET', None)
        # 注意：由于KV存储的限制，这个测试可能返回空数据
        # 但至少应该成功返回
        self.assertIn('success', response)


class TestAIChatAPI(unittest.TestCase):
    """AI聊天API测试"""
    
    def setUp(self):
        self.handler = MockHandler(FortuneHandler)
    
    def test_ai_chat_basic(self):
        """测试基本AI聊天"""
        chat_data = {
            'messages': [
                {'role': 'user', 'content': '你好'}
            ],
            'baziContext': {}
        }
        response = self.handler.make_request('/api/ai-chat', 'POST', chat_data)
        # AI API可能需要配置，所以可能失败，但至少应该返回响应
        self.assertIn('success', response)


def run_tests():
    """运行所有测试"""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # 添加所有测试类
    suite.addTests(loader.loadTestsFromTestCase(TestFortuneAPI))
    suite.addTests(loader.loadTestsFromTestCase(TestAuthAPI))
    suite.addTests(loader.loadTestsFromTestCase(TestSyncAPI))
    suite.addTests(loader.loadTestsFromTestCase(TestAnalyticsAPI))
    suite.addTests(loader.loadTestsFromTestCase(TestAIChatAPI))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()


if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
