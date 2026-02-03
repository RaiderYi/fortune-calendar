# -*- coding: utf-8 -*-
"""
运势业务逻辑
协调八字计算、评分和响应构建
"""

import datetime
from ..core.lunar import (
    calculate_bazi, calculate_liu_nian, calculate_liu_yue, calculate_liu_ri,
    get_day_gan_zhi, get_hour_gan_zhi
)
from ..core.bazi_engine import analyze_bazi_cached, calculate_ten_god
from ..core.fortune_engine import (
    calculate_fortune_score_v5, calculate_dimensions_v5,
    generate_main_theme, generate_todo, generate_dimension_scores
)
from ..utils.json_utils import clean_for_json

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
            from ..utils.date_utils import parse_datetime
            birth_dt = parse_datetime(birth_date_str, birth_time_str)

            # 2. 计算基础八字
            bazi = calculate_bazi(birth_dt, longitude)

            # 3. 八字分析（带缓存）
            from ..core.bazi_engine import generate_bazi_cache_key
            cache_key = generate_bazi_cache_key(birth_date_str, birth_time_str, longitude)
            analysis_result = analyze_bazi_cached(cache_key, birth_date_str, birth_time_str, longitude)

            # 处理用户手动调整的用神
            if custom_yongshen:
                from ..core.bazi_engine import _create_custom_yongshen
                analysis_result['yong_shen_result'] = _create_custom_yongshen(custom_yongshen, bazi)

            # 4. 计算当前流年流月流日
            now = datetime.datetime.now()
            liu_nian = calculate_liu_nian(now.year)
            liu_yue = calculate_liu_yue(now.year, now.month, now.day)
            liu_ri = calculate_liu_ri(now.year, now.month, now.day)

            # 5. 计算运势评分 (V5.0)
            yongshen_data = analysis_result.get('yong_shen_result', {})
            element_analysis = analysis_result.get('element_analysis', {})
            
            score_result_v5 = calculate_fortune_score_v5(
                bazi, element_analysis, yongshen_data,
                liu_nian, liu_yue, liu_ri
            )
            total_score = score_result_v5['total_score']

            # 6. 生成维度评分和建议
            dimensions = calculate_dimensions_v5(
                bazi, liu_ri, total_score, yongshen_data, gender
            )
            
            todo_list = generate_todo(
                yongshen_data.get('yong_shen', ['木'])[0],
                yongshen_data.get('ji_shen', [])
            )
            
            main_theme = generate_main_theme(
                total_score, bazi['day_gan'], liu_ri['gan']
            )

            # 7. 构建完整响应
            response = {
                'success': True,
                'data': {
                    'bazi': bazi,
                    'analysis': analysis_result,
                    'fortune': {
                        'totalScore': total_score,
                        'dimensions': dimensions,
                        'mainTheme': main_theme,
                        'todoList': todo_list,
                        'liuNian': liu_nian,
                        'liuYue': liu_yue,
                        'liuRi': liu_ri
                    }
                }
            }
            
            return {'success': True, 'data': clean_for_json(response), 'code': 200}

        except Exception as e:
            import traceback
            return {
                'success': False, 
                'error': str(e), 
                'traceback': traceback.format_exc(),
                'code': 500
            }
