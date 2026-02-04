# -*- coding: utf-8 -*-
"""
运势业务逻辑
协调八字计算、评分和响应构建
"""

import datetime
import os
import sys

# 处理相对导入问题（Vercel 环境兼容）
try:
    from ..core.lunar import (
        calculate_bazi, calculate_liu_nian, calculate_liu_yue, calculate_liu_ri,
        get_day_gan_zhi, get_hour_gan_zhi, calculate_dayun
    )
    from ..core.bazi_engine import analyze_bazi_cached, calculate_ten_god
    from ..core.fortune_engine import (
        calculate_fortune_score_v5, calculate_dimensions_v5,
        generate_main_theme, generate_todo
    )
    from ..utils.json_utils import clean_for_json
except ImportError:
    # Vercel 部署时的备用导入方式
    api_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if api_dir not in sys.path:
        sys.path.insert(0, api_dir)
    from core.lunar import (
        calculate_bazi, calculate_liu_nian, calculate_liu_yue, calculate_liu_ri,
        get_day_gan_zhi, get_hour_gan_zhi, calculate_dayun
    )
    from core.bazi_engine import analyze_bazi_cached, calculate_ten_god
    from core.fortune_engine import (
        calculate_fortune_score_v5, calculate_dimensions_v5,
        generate_main_theme, generate_todo
    )
    from utils.json_utils import clean_for_json

class FortuneService:
    @staticmethod
    def handle_fortune_request(data):
        """处理运势分析请求的完整业务流程"""
        try:
            # 1. 参数验证与解析
            birth_date_str = data.get('birthDate')
            birth_time_str = data.get('birthTime', '12:00')
            longitude = float(data.get('longitude', 120.0))
            gender = data.get('gender', 'male')
            custom_yongshen = data.get('customYongShen')

            if not birth_date_str:
                return {'success': False, 'error': '出生日期必填', 'code': 400}

            # 解析出生日期时间
            try:
                from ..utils.date_utils import parse_datetime
            except ImportError:
                from utils.date_utils import parse_datetime
            birth_dt = parse_datetime(birth_date_str, birth_time_str)

            # 2. 计算基础八字
            bazi = calculate_bazi(birth_dt, longitude)

            # 3. 八字分析（带缓存）
            try:
                from ..core.bazi_engine import generate_bazi_cache_key, _create_custom_yongshen
            except ImportError:
                from core.bazi_engine import generate_bazi_cache_key, _create_custom_yongshen
            cache_key = generate_bazi_cache_key(birth_date_str, birth_time_str, longitude)
            analysis_result = analyze_bazi_cached(cache_key, birth_date_str, birth_time_str, longitude)

            # 处理用户手动调整的用神
            if custom_yongshen:
                analysis_result['yong_shen_result'] = _create_custom_yongshen(custom_yongshen, bazi)

            # 4. 获取目标日期（前端传递的date参数，如果未提供则使用当前日期）
            target_date_str = data.get('date')
            if target_date_str:
                # 解析目标日期
                try:
                    from ..utils.date_utils import parse_date
                except ImportError:
                    from utils.date_utils import parse_date
                target_dt = parse_date(target_date_str)
                # 调试日志：记录接收到的日期参数
                print(f"[DEBUG] 接收到目标日期参数: {target_date_str}, 解析为: {target_dt}")
            else:
                # 如果未提供目标日期，使用当前日期
                target_dt = datetime.datetime.now()
                print(f"[DEBUG] 未提供目标日期，使用当前日期: {target_dt}")
            
            # 4.1 计算目标日期的流年流月流日
            liu_nian = calculate_liu_nian(target_dt.year)
            liu_yue = calculate_liu_yue(target_dt.year, target_dt.month, target_dt.day)
            liu_ri = calculate_liu_ri(target_dt.year, target_dt.month, target_dt.day)
            
            # 调试日志：记录流年流月流日
            print(f"[DEBUG] 流年: {liu_nian['gan']}{liu_nian['zhi']}, 流月: {liu_yue['gan']}{liu_yue['zhi']}, 流日: {liu_ri['gan']}{liu_ri['zhi']}")
            
            # 4.2 计算目标日期所在的大运
            dayun = calculate_dayun(birth_dt, target_dt.year, gender, longitude)
            if dayun:
                print(f"[DEBUG] 大运: {dayun.get('current_gan', '')}{dayun.get('current_zhi', '')}")

            # 5. 计算运势评分 (V5.0)
            yongshen_data = analysis_result.get('yong_shen_result', {})
            strength_result = analysis_result.get('strength_result', {})
            
            # 构建元素分析数据：将中文 level 映射为英文 pattern
            level = strength_result.get('level', '中和')
            level_to_pattern = {
                '身弱': 'Weak',
                '身旺': 'Strong',
                '中和': 'Neutral'
            }
            pattern = level_to_pattern.get(level, 'Neutral')
            
            element_analysis = {
                'pattern': pattern,
                'score': strength_result.get('score', 0.5),
                'level': level  # 保留中文 level 供其他用途
            }
            
            score_result_v5 = calculate_fortune_score_v5(
                bazi, element_analysis, yongshen_data,
                liu_nian, liu_yue, liu_ri, dayun=dayun
            )
            total_score = score_result_v5['total_score']
            
            # 调试日志：记录分数
            print(f"[DEBUG] 计算得分: {total_score}, 流日: {liu_ri['gan']}{liu_ri['zhi']}")

            # 6. 生成维度评分和建议
            # 计算神煞（用于维度计算）- 从 calculate_fortune_score_v5 的结果中获取
            shensha_result = score_result_v5.get('shensha', score_result_v5.get('shensha_result', {'total_score': 0, 'details': [], 'dimension_boosts': {}}))
            
            dimensions = calculate_dimensions_v5(
                bazi, liu_ri, total_score, yongshen_data, element_analysis, shensha_result
            )
            
            # 生成随机数生成器，确保主题和宜忌的一致性
            seed_str = f"{bazi['day_gan']}{bazi['day_zhi']}{liu_ri['gan']}{liu_ri['zhi']}"
            import random
            rng = random.Random(hash(seed_str))
            
            todo_list = generate_todo(
                yongshen_data.get('primary', '木'),
                yongshen_data.get('ji_shen', []),
                liu_ri=liu_ri,
                bazi=bazi,
                yongshen=yongshen_data,
                rng=rng
            )
            
            main_theme = generate_main_theme(
                total_score, bazi['day_gan'], liu_ri['gan'], rng=rng
            )

            # 7. 构建完整响应
            response_data = {
                'bazi': clean_for_json(bazi),
                'analysis': clean_for_json(analysis_result),
                'fortune': {
                    'totalScore': total_score,
                    'dimensions': clean_for_json(dimensions),
                    'mainTheme': clean_for_json(main_theme),
                    'todoList': clean_for_json(todo_list),
                    'liuNian': clean_for_json(liu_nian),
                    'liuYue': clean_for_json(liu_yue),
                    'liuRi': clean_for_json(liu_ri)
                }
            }
            
            return {'success': True, 'data': response_data, 'code': 200}

        except Exception as e:
            import traceback
            return {
                'success': False, 
                'error': str(e), 
                'traceback': traceback.format_exc(),
                'code': 500
            }
