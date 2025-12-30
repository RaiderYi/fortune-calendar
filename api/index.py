# -*- coding: utf-8 -*-
"""
增强版主 API
集成了纯Python八字计算和五维分析系统
"""

from http.server import BaseHTTPRequestHandler
import json
import datetime
from urllib.parse import parse_qs

# 导入我们的增强模块
from lunar_calculator_pure import calculate_bazi, calculate_liu_nian, calculate_liu_yue, calculate_liu_ri
from bazi_analyzer_enhanced import analyze_bazi_enhanced


# ==================== 工具函数 ====================

def parse_date(date_str):
    """解析日期字符串"""
    try:
        return datetime.datetime.strptime(date_str, "%Y-%m-%d")
    except:
        return datetime.datetime.now()

def parse_datetime(date_str, time_str):
    """解析日期和时间字符串"""
    try:
        dt_str = f"{date_str} {time_str}"
        return datetime.datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
    except:
        return datetime.datetime.now()

def get_week_day_cn(date):
    """获取中文星期"""
    weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return weekdays[date.weekday()]


# ==================== 评分和建议生成 ====================

def calculate_fortune_score(yong_shen_result, liu_nian, liu_yue, liu_ri):
    """
    计算运势评分
    """
    base_score = 60
    
    # 获取用神五行
    primary_yong = yong_shen_result['primary']
    xi_shen_list = yong_shen_result.get('xi_shen', [])
    ji_shen_list = yong_shen_result.get('ji_shen', [])
    
    # 从 lunar_calculator_pure 导入五行映射
    from bazi_analyzer_enhanced import WU_XING_MAP
    
    # 流年影响 (40%)
    liu_nian_gan_element = WU_XING_MAP.get(liu_nian['gan'])
    liu_nian_zhi_element = WU_XING_MAP.get(liu_nian['zhi'])
    
    nian_score = 0
    if liu_nian_gan_element == primary_yong:
        nian_score += 20
    elif liu_nian_gan_element in xi_shen_list:
        nian_score += 10
    elif liu_nian_gan_element in ji_shen_list:
        nian_score -= 15
    
    # 流月影响 (30%)
    liu_yue_gan_element = WU_XING_MAP.get(liu_yue['gan'])
    liu_yue_zhi_element = WU_XING_MAP.get(liu_yue['zhi'])
    
    yue_score = 0
    if liu_yue_gan_element == primary_yong:
        yue_score += 15
    elif liu_yue_gan_element in xi_shen_list:
        yue_score += 8
    elif liu_yue_gan_element in ji_shen_list:
        yue_score -= 10
    
    # 流日影响 (30%)
    liu_ri_gan_element = WU_XING_MAP.get(liu_ri['gan'])
    liu_ri_zhi_element = WU_XING_MAP.get(liu_ri['zhi'])
    
    ri_score = 0
    if liu_ri_gan_element == primary_yong:
        ri_score += 15
    elif liu_ri_gan_element in xi_shen_list:
        ri_score += 8
    elif liu_ri_gan_element in ji_shen_list:
        ri_score -= 10
    
    # 综合评分
    total = base_score + nian_score + yue_score + ri_score
    
    # 限制在 0-100 之间
    return max(0, min(100, total))


def generate_dimension_scores(base_score, liu_ri_gan):
    """
    生成各维度评分
    基于流日天干的十神属性
    """
    # 简化版：基于基础分数上下波动
    import random
    random.seed(hash(liu_ri_gan))  # 使用天干作为随机种子，确保同一天结果一致
    
    dimensions = {}
    
    for dim in ['career', 'wealth', 'romance', 'health', 'academic', 'travel']:
        # 在基础分数上下波动 ±15
        variation = random.randint(-15, 15)
        score = max(0, min(100, base_score + variation))
        
        # 确定等级
        if score >= 85:
            level = '大吉'
        elif score >= 70:
            level = '吉'
        elif score >= 50:
            level = '平'
        else:
            level = '凶'
        
        dimensions[dim] = {
            'score': score,
            'level': level
        }
    
    return dimensions


def generate_todo(yong_shen_element, ji_shen_list):
    """
    生成宜忌事项
    基于用神和忌神
    """
    # 用神对应的宜做事项
    YI_MAP = {
        '木': ['户外活动', '运动健身', '种植', '创意工作'],
        '火': ['社交聚会', '学习新知', '演讲表达', '创作'],
        '土': ['房产投资', '稳健理财', '家居整理', '养生'],
        '金': ['签订合同', '商务谈判', '金融投资', '整理规划'],
        '水': ['学习思考', '休息调养', '旅游出行', '艺术鉴赏']
    }
    
    # 忌神对应的忌做事项
    JI_MAP = {
        '木': ['久坐不动', '封闭空间', '过度劳累'],
        '火': ['冲动决策', '情绪激动', '过度消耗'],
        '土': ['过度饮食', '懒散拖延', '固执己见'],
        '金': ['刚愎自用', '过度强势', '冒险投机'],
        '水': ['优柔寡断', '过度幻想', '消极逃避']
    }
    
    yi_items = YI_MAP.get(yong_shen_element, ['顺势而为'])
    ji_items = []
    for ji in ji_shen_list:
        ji_items.extend(JI_MAP.get(ji, []))
    
    if not ji_items:
        ji_items = ['冲动行事']
    
    return [
        {
            'label': '宜',
            'content': ', '.join(yi_items[:3]),
            'type': 'up'
        },
        {
            'label': '忌',
            'content': ', '.join(ji_items[:3]),
            'type': 'down'
        }
    ]


def generate_main_theme(total_score, yong_shen_element):
    """
    生成主题关键词
    """
    # 主题emoji映射
    ELEMENT_THEME = {
        '木': {'emoji': '🌱', 'keyword': '生机盎然', 'color': 'from-green-100 to-emerald-200'},
        '火': {'emoji': '🔥', 'keyword': '热情洋溢', 'color': 'from-red-100 to-pink-200'},
        '土': {'emoji': '🏔️', 'keyword': '稳如磐石', 'color': 'from-yellow-100 to-amber-200'},
        '金': {'emoji': '💰', 'keyword': '吸金纳财', 'color': 'from-orange-100 to-yellow-200'},
        '水': {'emoji': '💧', 'keyword': '智慧如水', 'color': 'from-blue-100 to-cyan-200'}
    }
    
    theme_info = ELEMENT_THEME.get(yong_shen_element, ELEMENT_THEME['木'])
    
    # 根据分数确定副标题
    if total_score >= 85:
        sub_keyword = '运势极佳'
        description = f'今日{theme_info["keyword"]}，诸事顺遂，把握机会'
    elif total_score >= 70:
        sub_keyword = '运势良好'
        description = f'今日{theme_info["keyword"]}，顺势而为，稳中求进'
    elif total_score >= 50:
        sub_keyword = '运势平稳'
        description = f'今日平和安稳，保持平常心即可'
    else:
        sub_keyword = '需多谨慎'
        description = f'今日宜谨慎行事，避免冲动决策'
    
    return {
        'keyword': theme_info['keyword'] + theme_info['emoji'],
        'subKeyword': sub_keyword,
        'emoji': theme_info['emoji'],
        'colorTheme': theme_info['color'],
        'textColor': 'text-slate-800',
        'description': description
    }


# ==================== HTTP Handler ====================

class handler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        """处理 GET 请求 - 健康检查"""
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'status': 'ok',
                'message': '增强版API正常运行！',
                'version': '2.0.0',
                'features': [
                    '纯Python八字计算',
                    '五维旺衰分析',
                    '多层次用神推导'
                ]
            }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
        else:
            self.send_error(404, 'Not Found')
    
    def do_POST(self):
        """处理 POST 请求 - 运势分析"""
        if self.path == '/api/fortune':
            try:
                # 读取请求体
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                data = json.loads(body.decode('utf-8'))
                
                # 解析参数
                date_str = data.get('date', datetime.datetime.now().strftime('%Y-%m-%d'))
                birth_date_str = data.get('birthDate', '1990-01-01')
                birth_time_str = data.get('birthTime', '12:00')
                longitude = float(data.get('longitude', 116.4))
                gender = int(data.get('gender', 1))
                
                # 1. 计算八字
                birth_dt = parse_datetime(birth_date_str, birth_time_str)
                bazi = calculate_bazi(birth_dt, longitude)
                
                # 2. 旺衰分析 + 用神推导
                analysis = analyze_bazi_enhanced(bazi)
                
                # 3. 计算流年流月流日
                current_date = parse_date(date_str)
                liu_nian = calculate_liu_nian(current_date.year)
                liu_yue = calculate_liu_yue(current_date.year, current_date.month, current_date.day)
                liu_ri = calculate_liu_ri(current_date.year, current_date.month, current_date.day)
                
                # 4. 计算运势评分
                total_score = calculate_fortune_score(
                    analysis['yong_shen'],
                    liu_nian,
                    liu_yue,
                    liu_ri
                )
                
                # 5. 生成各维度评分
                dimensions = generate_dimension_scores(total_score, liu_ri['gan'])
                
                # 6. 生成宜忌
                todo = generate_todo(
                    analysis['yong_shen']['primary'],
                    analysis['yong_shen']['ji_shen']
                )
                
                # 7. 生成主题
                main_theme = generate_main_theme(
                    total_score,
                    analysis['yong_shen']['primary']
                )
                
                # 8. 构建响应
                response = {
                    'dateStr': current_date.strftime('%m.%d'),
                    'weekDay': get_week_day_cn(current_date),
                    'lunarStr': f"{bazi['solar_term']}月",  # 简化版
                    'totalScore': total_score,
                    'pillars': {
                        'year': bazi['year'],
                        'month': bazi['month'],
                        'day': bazi['day']
                    },
                    'mainTheme': main_theme,
                    'dimensions': {
                        'career': {
                            'score': dimensions['career']['score'],
                            'level': dimensions['career']['level'],
                            'tag': '事业运',
                            'inference': f"事业运势{dimensions['career']['level']}"
                        },
                        'wealth': {
                            'score': dimensions['wealth']['score'],
                            'level': dimensions['wealth']['level'],
                            'tag': '财运',
                            'inference': f"财运{dimensions['wealth']['level']}"
                        },
                        'romance': {
                            'score': dimensions['romance']['score'],
                            'level': dimensions['romance']['level'],
                            'tag': '感情运',
                            'inference': f"感情运势{dimensions['romance']['level']}"
                        },
                        'health': {
                            'score': dimensions['health']['score'],
                            'level': dimensions['health']['level'],
                            'tag': '健康运',
                            'inference': f"健康运势{dimensions['health']['level']}"
                        },
                        'academic': {
                            'score': dimensions['academic']['score'],
                            'level': dimensions['academic']['level'],
                            'tag': '学业运',
                            'inference': f"学业运势{dimensions['academic']['level']}"
                        },
                        'travel': {
                            'score': dimensions['travel']['score'],
                            'level': dimensions['travel']['level'],
                            'tag': '出行运',
                            'inference': f"出行运势{dimensions['travel']['level']}"
                        }
                    },
                    'todo': todo,
                    'baziDetail': {
                        'year': bazi['year'],
                        'month': bazi['month'],
                        'day': bazi['day'],
                        'hour': bazi['hour'],
                        'dayMaster': bazi['day_gan']
                    },
                    'yongShen': {
                        'strength': analysis['strength']['level'],
                        'yongShen': [analysis['yong_shen']['primary']],
                        'xiShen': analysis['yong_shen']['xi_shen'],
                        'jiShen': analysis['yong_shen']['ji_shen'],
                        'strategies': analysis['yong_shen']['strategies']
                    },
                    'liuNian': {
                        'year': liu_nian['gan_zhi'],
                        'month': liu_yue['gan_zhi'],
                        'day': liu_ri['gan_zhi'],
                        'yearGan': liu_nian['gan'],
                        'yearZhi': liu_nian['zhi'],
                        'monthGan': liu_yue['gan'],
                        'monthZhi': liu_yue['zhi'],
                        'dayGan': liu_ri['gan'],
                        'dayZhi': liu_ri['zhi']
                    },
                    'todayTenGod': '偏财',  # 简化版，后续可以加入十神计算
                    
                    # 新增：增强分析结果
                    'enhancedAnalysis': {
                        'strength': {
                            'score': analysis['strength']['score'],
                            'level': analysis['strength']['level'],
                            'details': analysis['strength']['details']
                        },
                        'yongShen': analysis['yong_shen']
                    }
                }
                
                # 返回响应
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                output = json.dumps(response, ensure_ascii=False, indent=2)
                self.wfile.write(output.encode('utf-8'))
                
            except Exception as e:
                # 错误处理
                import traceback
                error_response = {
                    'success': False,
                    'error': str(e),
                    'traceback': traceback.format_exc()
                }
                
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))
        else:
            self.send_error(404, 'Not Found')
    
    def do_OPTIONS(self):
        """处理 OPTIONS 请求 - CORS 预检"""
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


# 本地测试
if __name__ == "__main__":
    print("="*60)
    print("本地测试增强版主API")
    print("="*60)
    
    # 模拟请求数据
    test_data = {
        'date': '2025-12-30',
        'birthDate': '1990-01-01',
        'birthTime': '12:00',
        'longitude': '116.4',
        'gender': 1
    }
    
    print(f"\n📥 测试请求:")
    print(json.dumps(test_data, ensure_ascii=False, indent=2))
    
    # 模拟处理
    try:
        # 计算八字
        birth_dt = parse_datetime(test_data['birthDate'], test_data['birthTime'])
        bazi = calculate_bazi(birth_dt, float(test_data['longitude']))
        
        print(f"\n📋 八字排盘:")
        print(f"  年柱: {bazi['year']}")
        print(f"  月柱: {bazi['month']}")
        print(f"  日柱: {bazi['day']}")
        print(f"  时柱: {bazi['hour']}")
        
        # 分析
        analysis = analyze_bazi_enhanced(bazi)
        
        print(f"\n💪 旺衰分析:")
        print(f"  得分: {analysis['strength']['score']}")
        print(f"  等级: {analysis['strength']['level']}")
        
        print(f"\n🎯 用神:")
        print(f"  主用神: {analysis['yong_shen']['primary']}")
        print(f"  喜神: {', '.join(analysis['yong_shen']['xi_shen'])}")
        print(f"  忌神: {', '.join(analysis['yong_shen']['ji_shen'])}")
        
        print("\n" + "="*60)
        print("✅ 本地测试成功！")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
