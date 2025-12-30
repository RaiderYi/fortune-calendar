# -*- coding: utf-8 -*-
"""
完整测试 API - 展示端到端流程
访问路径: /api/test_enhanced
"""

from http.server import BaseHTTPRequestHandler
import json
import datetime

# 导入我们的模块
from lunar_calculator_pure import calculate_bazi, calculate_liu_nian, calculate_liu_yue, calculate_liu_ri
from bazi_analyzer_enhanced import analyze_bazi_enhanced


class handler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        """处理 GET 请求"""
        
        try:
            # 测试案例：1990年1月1日 12:00，北京
            test_birth = datetime.datetime(1990, 1, 1, 12, 0, 0)
            longitude = 116.4
            
            # 步骤1: 计算八字
            bazi = calculate_bazi(test_birth, longitude)
            
            # 步骤2: 旺衰分析 + 用神推导
            analysis = analyze_bazi_enhanced(bazi)
            
            # 步骤3: 计算今天的流年流月流日
            today = datetime.datetime.now()
            liu_nian = calculate_liu_nian(today.year)
            liu_yue = calculate_liu_yue(today.year, today.month, today.day)
            liu_ri = calculate_liu_ri(today.year, today.month, today.day)
            
            # 构建响应
            response_data = {
                "success": True,
                "message": "完整八字分析系统测试",
                "birth_info": {
                    "date": "1990-01-01 12:00:00",
                    "location": "北京（东经116.4°）",
                    "adjusted_time": str(bazi['adjusted_datetime'])
                },
                "bazi": {
                    "年柱": bazi['year'],
                    "月柱": bazi['month'],
                    "日柱": bazi['day'],
                    "时柱": bazi['hour'],
                    "节气": bazi['solar_term'],
                    "日主": bazi['day_gan']
                },
                "strength_analysis": {
                    "综合得分": analysis['strength']['score'],
                    "旺衰等级": analysis['strength']['level'],
                    "详细分析": {
                        "月令分析": {
                            "得分": analysis['strength']['details']['yue_ling']['score'],
                            "说明": analysis['strength']['details']['yue_ling']['detail']
                        },
                        "通根分析": {
                            "得分": analysis['strength']['details']['gen']['score'],
                            "说明": analysis['strength']['details']['gen']['detail']
                        },
                        "透干分析": {
                            "得分": analysis['strength']['details']['tou_gan']['score'],
                            "说明": analysis['strength']['details']['tou_gan']['detail']
                        },
                        "合化分析": {
                            "得分": analysis['strength']['details']['he_hua']['score'],
                            "说明": analysis['strength']['details']['he_hua']['detail']
                        },
                        "刑冲分析": {
                            "得分": analysis['strength']['details']['xing_chong']['score'],
                            "说明": analysis['strength']['details']['xing_chong']['detail']
                        }
                    }
                },
                "yong_shen_analysis": {
                    "主用神": analysis['yong_shen']['primary'],
                    "次用神": analysis['yong_shen']['secondary'],
                    "喜神": analysis['yong_shen']['xi_shen'],
                    "忌神": analysis['yong_shen']['ji_shen'],
                    "推导策略": analysis['yong_shen']['strategies']
                },
                "today_fortune": {
                    "日期": today.strftime("%Y-%m-%d"),
                    "流年": liu_nian['gan_zhi'],
                    "流月": liu_yue['gan_zhi'],
                    "流日": liu_ri['gan_zhi']
                },
                "system_info": {
                    "模块": "完整增强版",
                    "版本": "2.0.0",
                    "功能": [
                        "✅ 纯Python农历计算",
                        "✅ 五维旺衰分析",
                        "✅ 多层次用神推导",
                        "✅ 无外部依赖"
                    ]
                }
            }
            
            # 返回 JSON
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            output = json.dumps(response_data, ensure_ascii=False, indent=2)
            self.wfile.write(output.encode('utf-8'))
            
        except Exception as e:
            # 错误处理
            import traceback
            error_response = {
                "success": False,
                "error": str(e),
                "traceback": traceback.format_exc(),
                "message": "测试失败"
            }
            
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            output = json.dumps(error_response, ensure_ascii=False, indent=2)
            self.wfile.write(output.encode('utf-8'))


# 本地测试
if __name__ == "__main__":
    print("="*60)
    print("完整系统本地测试")
    print("="*60)
    
    try:
        # 测试案例
        test_birth = datetime.datetime(1990, 1, 1, 12, 0, 0)
        longitude = 116.4
        
        print(f"\n📅 测试出生时间: {test_birth}")
        print(f"📍 出生地: 东经 {longitude}°")
        
        # 步骤1
        print("\n" + "-"*60)
        print("步骤1: 计算八字")
        print("-"*60)
        bazi = calculate_bazi(test_birth, longitude)
        print(f"年柱: {bazi['year']}")
        print(f"月柱: {bazi['month']}")
        print(f"日柱: {bazi['day']}")
        print(f"时柱: {bazi['hour']}")
        print(f"节气: {bazi['solar_term']}")
        
        # 步骤2
        print("\n" + "-"*60)
        print("步骤2: 增强分析")
        print("-"*60)
        analysis = analyze_bazi_enhanced(bazi)
        
        print(f"\n💪 旺衰分析:")
        print(f"  综合得分: {analysis['strength']['score']}")
        print(f"  旺衰等级: {analysis['strength']['level']}")
        
        print(f"\n🎯 用神分析:")
        print(f"  主用神: {analysis['yong_shen']['primary']}")
        print(f"  次用神: {', '.join(analysis['yong_shen']['secondary']) if analysis['yong_shen']['secondary'] else '无'}")
        
        # 步骤3
        print("\n" + "-"*60)
        print("步骤3: 今日运势")
        print("-"*60)
        today = datetime.datetime.now()
        liu_nian = calculate_liu_nian(today.year)
        liu_yue = calculate_liu_yue(today.year, today.month, today.day)
        liu_ri = calculate_liu_ri(today.year, today.month, today.day)
        
        print(f"日期: {today.strftime('%Y-%m-%d')}")
        print(f"流年: {liu_nian['gan_zhi']}")
        print(f"流月: {liu_yue['gan_zhi']}")
        print(f"流日: {liu_ri['gan_zhi']}")
        
        print("\n" + "="*60)
        print("✅ 完整流程测试成功！")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
