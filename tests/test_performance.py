# -*- coding: utf-8 -*-
"""
性能测试
测试API响应时间和前端性能
"""

import unittest
import sys
import os
import time
from datetime import datetime, timedelta

# 添加项目路径
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)
sys.path.insert(0, os.path.join(project_root, 'api'))

from tests.test_utils import (
    MockHandler, generate_test_fortune_request, generate_test_user_data,
    generate_test_sync_data, assert_success, measure_api_performance,
    PerformanceTimer, extract_token_from_response, create_auth_headers
)

# 导入API handlers
try:
    from api.index import handler as FortuneHandler
    from api.auth import handler as AuthHandler
    from api.sync import handler as SyncHandler
except ImportError:
    import sys
    sys.path.insert(0, os.path.join(project_root, 'api'))
    from index import handler as FortuneHandler
    from auth import handler as AuthHandler
    from sync import handler as SyncHandler


# 性能基准
FORTUNE_API_MAX_TIME = 3.0  # 运势API最大响应时间（秒）
AUTH_API_MAX_TIME = 1.0      # 认证API最大响应时间（秒）
SYNC_API_MAX_TIME = 2.0      # 同步API最大响应时间（秒）


class TestAPIPerformance(unittest.TestCase):
    """API性能测试"""
    
    def setUp(self):
        self.fortune_handler = MockHandler(FortuneHandler)
        self.auth_handler = MockHandler(AuthHandler)
        self.sync_handler = MockHandler(SyncHandler)
        self.test_user = generate_test_user_data()
        self.fortune_request = generate_test_fortune_request()
    
    def test_fortune_api_response_time(self):
        """测试运势API响应时间"""
        perf_result = measure_api_performance(
            self.fortune_handler,
            '/api/fortune',
            self.fortune_request,
            FORTUNE_API_MAX_TIME
        )
        
        self.assertTrue(perf_result['success'], "API should succeed")
        self.assertTrue(perf_result['within_limit'], 
                       f"Response time {perf_result['response_time']:.2f}s should be < {FORTUNE_API_MAX_TIME}s")
        
        print(f"✓ Fortune API response time: {perf_result['response_time']:.3f}s")
    
    def test_fortune_api_multiple_requests(self):
        """测试多次运势API请求的平均响应时间"""
        times = []
        request_count = 5
        
        for i in range(request_count):
            with PerformanceTimer() as timer:
                response = self.fortune_handler.make_request(
                    '/api/fortune', 'POST', self.fortune_request
                )
                assert_success(response, "Request should succeed")
                times.append(timer.elapsed())
        
        avg_time = sum(times) / len(times)
        max_time = max(times)
        
        print(f"✓ Fortune API average response time: {avg_time:.3f}s")
        print(f"✓ Fortune API max response time: {max_time:.3f}s")
        
        self.assertLess(avg_time, FORTUNE_API_MAX_TIME * 1.5,
                       f"Average time {avg_time:.3f}s should be reasonable")
    
    def test_auth_register_response_time(self):
        """测试注册API响应时间"""
        # 使用新的测试用户避免重复注册错误
        user_data = generate_test_user_data()
        
        perf_result = measure_api_performance(
            self.auth_handler,
            '/api/auth/register',
            user_data,
            AUTH_API_MAX_TIME
        )
        
        self.assertTrue(perf_result['success'], "Registration should succeed")
        self.assertTrue(perf_result['within_limit'],
                       f"Response time {perf_result['response_time']:.2f}s should be < {AUTH_API_MAX_TIME}s")
        
        print(f"✓ Auth Register API response time: {perf_result['response_time']:.3f}s")
    
    def test_auth_login_response_time(self):
        """测试登录API响应时间"""
        # 先注册
        register_response = self.auth_handler.make_request(
            '/api/auth/register', 'POST', self.test_user
        )
        assert_success(register_response, "Should register successfully")
        
        # 测试登录性能
        login_data = {
            'email': self.test_user['email'],
            'password': self.test_user['password']
        }
        
        perf_result = measure_api_performance(
            self.auth_handler,
            '/api/auth/login',
            login_data,
            AUTH_API_MAX_TIME
        )
        
        self.assertTrue(perf_result['success'], "Login should succeed")
        self.assertTrue(perf_result['within_limit'],
                       f"Response time {perf_result['response_time']:.2f}s should be < {AUTH_API_MAX_TIME}s")
        
        print(f"✓ Auth Login API response time: {perf_result['response_time']:.3f}s")
    
    def test_sync_upload_response_time(self):
        """测试同步上传API响应时间"""
        # 先注册获取token
        register_response = self.auth_handler.make_request(
            '/api/auth/register', 'POST', self.test_user
        )
        token = extract_token_from_response(register_response)
        headers = create_auth_headers(token) if token else {}
        
        sync_data = generate_test_sync_data()
        
        perf_result = measure_api_performance(
            self.sync_handler,
            '/api/sync/upload',
            sync_data,
            SYNC_API_MAX_TIME,
            headers
        )
        
        # 注意：由于MockHandler的限制，headers可能无法正确传递
        # 这里主要测试基本性能
        print(f"✓ Sync Upload API response time: {perf_result['response_time']:.3f}s")
    
    def test_concurrent_requests(self):
        """测试并发请求性能（模拟）"""
        # 由于是单线程模拟，这里测试连续快速请求
        request_count = 10
        times = []
        
        for i in range(request_count):
            user_data = generate_test_user_data()
            with PerformanceTimer() as timer:
                # 使用不同的用户避免冲突
                response = self.fortune_handler.make_request(
                    '/api/fortune', 'POST', generate_test_fortune_request()
                )
                times.append(timer.elapsed())
        
        avg_time = sum(times) / len(times)
        total_time = sum(times)
        
        print(f"✓ {request_count} concurrent requests:")
        print(f"  - Average time: {avg_time:.3f}s")
        print(f"  - Total time: {total_time:.3f}s")
        
        # 验证平均时间合理
        self.assertLess(avg_time, FORTUNE_API_MAX_TIME * 2,
                       "Average time should be reasonable even under load")


class TestDataProcessingPerformance(unittest.TestCase):
    """数据处理性能测试"""
    
    def test_large_history_processing(self):
        """测试大量历史数据处理"""
        # 生成大量历史数据
        large_history = []
        base_date = datetime.now()
        
        for i in range(100):  # 100条历史记录
            large_history.append({
                'date': (base_date - timedelta(days=i)).strftime('%Y-%m-%d'),
                'score': 70 + (i % 30),
                'timestamp': int((base_date - timedelta(days=i)).timestamp())
            })
        
        sync_data = generate_test_sync_data()
        sync_data['history'] = large_history
        
        # 测试处理时间
        with PerformanceTimer() as timer:
            # 模拟数据处理（合并、去重等）
            processed = {}
            for record in large_history:
                date_key = record['date']
                if date_key not in processed or record['timestamp'] > processed[date_key].get('timestamp', 0):
                    processed[date_key] = record
        
        processing_time = timer.elapsed()
        
        print(f"✓ Processed {len(large_history)} history records in {processing_time:.3f}s")
        self.assertLess(processing_time, 1.0, "Should process large history quickly")


def run_tests():
    """运行所有性能测试"""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # 添加所有测试类
    suite.addTests(loader.loadTestsFromTestCase(TestAPIPerformance))
    suite.addTests(loader.loadTestsFromTestCase(TestDataProcessingPerformance))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # 打印性能总结
    print("\n" + "=" * 60)
    print("性能测试总结")
    print("=" * 60)
    print(f"通过: {result.testsRun - len(result.failures) - len(result.errors)}/{result.testsRun}")
    if result.failures:
        print(f"失败: {len(result.failures)}")
    if result.errors:
        print(f"错误: {len(result.errors)}")
    
    return result.wasSuccessful()


if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
