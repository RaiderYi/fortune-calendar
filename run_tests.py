# -*- coding: utf-8 -*-
"""
测试运行脚本
统一测试入口、报告生成、错误汇总
"""

import sys
import os
import argparse
import unittest
from datetime import datetime
from io import StringIO

# 添加项目路径
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)
sys.path.insert(0, os.path.join(project_root, 'api'))

# 测试模块将在运行时动态导入


class TestResultCollector:
    """测试结果收集器"""
    def __init__(self):
        self.results = []
        self.start_time = None
        self.end_time = None
    
    def add_result(self, name, success, output, errors=None, failures=None):
        """添加测试结果"""
        self.results.append({
            'name': name,
            'success': success,
            'output': output,
            'errors': errors or [],
            'failures': failures or []
        })
    
    def get_summary(self):
        """获取测试总结"""
        total = len(self.results)
        passed = sum(1 for r in self.results if r['success'])
        failed = total - passed
        
        total_tests = 0
        total_failures = 0
        total_errors = 0
        
        for result in self.results:
            total_failures += len(result.get('failures', []))
            total_errors += len(result.get('errors', []))
        
        elapsed = (self.end_time - self.start_time).total_seconds() if self.end_time and self.start_time else 0
        
        return {
            'total_suites': total,
            'passed_suites': passed,
            'failed_suites': failed,
            'total_failures': total_failures,
            'total_errors': total_errors,
            'elapsed_time': elapsed
        }


def run_test_suite(test_module, suite_name):
    """运行测试套件并收集结果"""
    print(f"\n{'=' * 60}")
    print(f"运行 {suite_name}")
    print(f"{'=' * 60}\n")
    
    # 捕获输出
    stream = StringIO()
    
    try:
        if hasattr(test_module, 'run_tests'):
            # 使用模块的run_tests函数
            success = test_module.run_tests()
            output = stream.getvalue()
            return {
                'success': success,
                'output': output,
                'errors': [],
                'failures': []
            }
        else:
            # 使用unittest runner
            loader = unittest.TestLoader()
            suite = loader.loadTestsFromModule(test_module)
            runner = unittest.TextTestRunner(stream=stream, verbosity=2)
            result = runner.run(suite)
            output = stream.getvalue()
            return {
                'success': result.wasSuccessful(),
                'output': output,
                'errors': result.errors,
                'failures': result.failures
            }
    except Exception as e:
        import traceback
        error_msg = f"Error running {suite_name}: {str(e)}\n{traceback.format_exc()}"
        return {
            'success': False,
            'output': error_msg,
            'errors': [(suite_name, error_msg)],
            'failures': []
        }
    finally:
        stream.close()


def generate_report(collector, output_file=None):
    """生成测试报告"""
    summary = collector.get_summary()
    
    report_lines = []
    report_lines.append("=" * 80)
    report_lines.append("测试报告")
    report_lines.append("=" * 80)
    report_lines.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report_lines.append("")
    report_lines.append("测试总结:")
    report_lines.append(f"  测试套件总数: {summary['total_suites']}")
    report_lines.append(f"  通过: {summary['passed_suites']}")
    report_lines.append(f"  失败: {summary['failed_suites']}")
    report_lines.append(f"  总失败数: {summary['total_failures']}")
    report_lines.append(f"  总错误数: {summary['total_errors']}")
    report_lines.append(f"  总耗时: {summary['elapsed_time']:.2f}秒")
    report_lines.append("")
    report_lines.append("-" * 80)
    report_lines.append("详细结果:")
    report_lines.append("-" * 80)
    
    for result in collector.results:
        status = "✅ 通过" if result['success'] else "❌ 失败"
        report_lines.append(f"\n{result['name']}: {status}")
        
        if result['failures']:
            report_lines.append("\n失败用例:")
            for failure in result['failures']:
                report_lines.append(f"  - {failure[0]}")
                report_lines.append(f"    {failure[1][:200]}...")  # 截断长错误信息
        
        if result['errors']:
            report_lines.append("\n错误:")
            for error in result['errors']:
                report_lines.append(f"  - {error[0]}")
                report_lines.append(f"    {error[1][:200]}...")
    
    report_lines.append("")
    report_lines.append("=" * 80)
    
    report_text = "\n".join(report_lines)
    
    # 打印到控制台
    print("\n" + report_text)
    
    # 保存到文件
    if output_file:
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report_text)
            print(f"\n报告已保存到: {output_file}")
        except Exception as e:
            print(f"\n保存报告失败: {e}")
    
    return report_text


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='运行测试套件')
    parser.add_argument('--all', action='store_true', help='运行所有测试')
    parser.add_argument('--api', action='store_true', help='运行API端点测试')
    parser.add_argument('--integration', action='store_true', help='运行集成测试')
    parser.add_argument('--performance', action='store_true', help='运行性能测试')
    parser.add_argument('--report', type=str, help='生成测试报告文件路径')
    
    args = parser.parse_args()
    
    # 如果没有指定任何选项，默认运行所有测试
    if not any([args.all, args.api, args.integration, args.performance]):
        args.all = True
    
    collector = TestResultCollector()
    collector.start_time = datetime.now()
    
    try:
        # 导入测试模块
        if args.all or args.api:
            try:
                from tests import test_api_endpoints
                result = run_test_suite(test_api_endpoints, "API端点测试")
                collector.add_result("API端点测试", **result)
            except Exception as e:
                print(f"❌ 无法运行API端点测试: {e}")
                collector.add_result("API端点测试", False, str(e), [str(e)], [])
        
        if args.all or args.integration:
            try:
                from tests import test_integration
                result = run_test_suite(test_integration, "集成测试")
                collector.add_result("集成测试", **result)
            except Exception as e:
                print(f"❌ 无法运行集成测试: {e}")
                collector.add_result("集成测试", False, str(e), [str(e)], [])
        
        if args.all or args.performance:
            try:
                from tests import test_performance
                result = run_test_suite(test_performance, "性能测试")
                collector.add_result("性能测试", **result)
            except Exception as e:
                print(f"❌ 无法运行性能测试: {e}")
                collector.add_result("性能测试", False, str(e), [str(e)], [])
    
    finally:
        collector.end_time = datetime.now()
        
        # 生成报告
        report_file = args.report or (f"test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt" if args.report is None else None)
        generate_report(collector, report_file)
        
        # 返回退出码
        summary = collector.get_summary()
        if summary['failed_suites'] > 0 or summary['total_failures'] > 0 or summary['total_errors'] > 0:
            sys.exit(1)
        else:
            sys.exit(0)


if __name__ == '__main__':
    main()
