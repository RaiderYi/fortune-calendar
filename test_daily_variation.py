# -*- coding: utf-8 -*-
"""
测试脚本：验证不同日期返回不同结果
测试流日、分数、主题、宜忌是否随日期变化
"""

import sys
import os
import datetime
import json

# 添加 api 目录到路径
api_path = os.path.join(os.path.dirname(__file__), 'api')
sys.path.insert(0, api_path)

# 直接导入需要的模块，避免导入整个包
from api.core.lunar import calculate_liu_ri, calculate_liu_nian, calculate_liu_yue, calculate_bazi
from api.core.fortune_engine import calculate_fortune_score_v5, generate_main_theme, generate_todo
from api.core.bazi_engine import analyze_bazi_cached, generate_bazi_cache_key
from api.utils.date_utils import parse_datetime

def test_liu_ri_variation():
    """测试用例1：验证流日计算"""
    print("=" * 60)
    print("测试用例1：验证流日计算")
    print("=" * 60)
    
    # 测试连续7天
    base_date = datetime.date(2026, 2, 1)
    liu_ri_list = []
    
    for i in range(7):
        test_date = base_date + datetime.timedelta(days=i)
        liu_ri = calculate_liu_ri(test_date.year, test_date.month, test_date.day)
        liu_ri_list.append(liu_ri)
        print(f"{test_date}: {liu_ri['gan']}{liu_ri['zhi']}")
    
    # 验证是否都不同
    gan_zhi_set = set(f"{lr['gan']}{lr['zhi']}" for lr in liu_ri_list)
    if len(gan_zhi_set) == 7:
        print("✅ 通过：7天流日干支都不同")
    else:
        print(f"❌ 失败：有重复的流日干支，共{len(gan_zhi_set)}个不同值")
    
    return len(gan_zhi_set) == 7


def test_score_variation():
    """测试用例2：验证分数计算"""
    print("\n" + "=" * 60)
    print("测试用例2：验证分数计算")
    print("=" * 60)
    
    # 使用测试八字
    birth_date_str = "1995-08-15"
    birth_time_str = "09:30"
    longitude = 116.4
    
    birth_dt = parse_datetime(birth_date_str, birth_time_str)
    bazi = calculate_bazi(birth_dt, longitude)
    
    # 分析八字
    cache_key = generate_bazi_cache_key(birth_date_str, birth_time_str, longitude)
    analysis_result = analyze_bazi_cached(cache_key, birth_date_str, birth_time_str, longitude)
    
    yongshen_data = analysis_result.get('yong_shen_result', {})
    strength_result = analysis_result.get('strength_result', {})
    
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
        'level': level
    }
    
    # 测试连续30天
    base_date = datetime.date(2026, 2, 1)
    scores = []
    liu_ri_list = []
    
    for i in range(30):
        test_date = base_date + datetime.timedelta(days=i)
        liu_nian = calculate_liu_nian(test_date.year)
        liu_yue = calculate_liu_yue(test_date.year, test_date.month, test_date.day)
        liu_ri = calculate_liu_ri(test_date.year, test_date.month, test_date.day)
        
        score_result = calculate_fortune_score_v5(
            bazi, element_analysis, yongshen_data,
            liu_nian, liu_yue, liu_ri, dayun=None
        )
        
        scores.append(score_result['total_score'])
        liu_ri_list.append(f"{liu_ri['gan']}{liu_ri['zhi']}")
    
    # 统计
    unique_scores = set(scores)
    score_range = (min(scores), max(scores))
    
    print(f"分数范围: {score_range[0]} - {score_range[1]}")
    print(f"不同分数数量: {len(unique_scores)} / 30")
    print(f"分数分布: {dict((s, scores.count(s)) for s in sorted(unique_scores))}")
    
    # 验证
    if len(unique_scores) >= 20:
        print("✅ 通过：30天中至少有20天分数不同")
    else:
        print(f"❌ 失败：只有{len(unique_scores)}天分数不同")
    
    if score_range[0] >= 20 and score_range[1] <= 100:
        print("✅ 通过：分数范围在20-100之间")
    else:
        print(f"❌ 失败：分数范围超出预期 {score_range}")
    
    return len(unique_scores) >= 20


def test_theme_variation():
    """测试用例3：验证主题生成"""
    print("\n" + "=" * 60)
    print("测试用例3：验证主题生成")
    print("=" * 60)
    
    birth_date_str = "1995-08-15"
    birth_time_str = "09:30"
    longitude = 116.4
    
    birth_dt = parse_datetime(birth_date_str, birth_time_str)
    bazi = calculate_bazi(birth_dt, longitude)
    
    # 测试连续7天
    base_date = datetime.date(2026, 2, 1)
    themes = []
    
    for i in range(7):
        test_date = base_date + datetime.timedelta(days=i)
        liu_ri = calculate_liu_ri(test_date.year, test_date.month, test_date.day)
        
        # 计算分数用于主题生成
        cache_key = generate_bazi_cache_key(birth_date_str, birth_time_str, longitude)
        analysis_result = analyze_bazi_cached(cache_key, birth_date_str, birth_time_str, longitude)
        yongshen_data = analysis_result.get('yong_shen_result', {})
        strength_result = analysis_result.get('strength_result', {})
        
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
            'level': level
        }
        
        liu_nian = calculate_liu_nian(test_date.year)
        liu_yue = calculate_liu_yue(test_date.year, test_date.month, test_date.day)
        
        score_result = calculate_fortune_score_v5(
            bazi, element_analysis, yongshen_data,
            liu_nian, liu_yue, liu_ri, dayun=None
        )
        
        theme = generate_main_theme(
            score_result['total_score'],
            bazi['day_gan'],
            liu_ri['gan']
        )
        
        themes.append({
            'date': str(test_date),
            'liu_ri': f"{liu_ri['gan']}{liu_ri['zhi']}",
            'keyword': theme['keyword'],
            'subKeyword': theme['subKeyword'],
            'description': theme['description'][:30] + '...'
        })
    
    # 打印结果
    for t in themes:
        print(f"{t['date']} ({t['liu_ri']}): {t['keyword']} - {t['subKeyword']}")
    
    # 验证
    unique_keywords = set(t['keyword'] for t in themes)
    unique_descriptions = set(t['description'] for t in themes)
    
    print(f"\n不同关键词数量: {len(unique_keywords)} / 7")
    print(f"不同描述数量: {len(unique_descriptions)} / 7")
    
    if len(unique_keywords) >= 3 or len(unique_descriptions) >= 5:
        print("✅ 通过：主题有足够的变化")
    else:
        print("❌ 失败：主题变化不足")
    
    return len(unique_keywords) >= 3 or len(unique_descriptions) >= 5


def test_todo_variation():
    """测试用例4：验证宜忌生成"""
    print("\n" + "=" * 60)
    print("测试用例4：验证宜忌生成")
    print("=" * 60)
    
    birth_date_str = "1995-08-15"
    birth_time_str = "09:30"
    longitude = 116.4
    
    birth_dt = parse_datetime(birth_date_str, birth_time_str)
    bazi = calculate_bazi(birth_dt, longitude)
    
    # 分析八字获取用神
    cache_key = generate_bazi_cache_key(birth_date_str, birth_time_str, longitude)
    analysis_result = analyze_bazi_cached(cache_key, birth_date_str, birth_time_str, longitude)
    yongshen_data = analysis_result.get('yong_shen_result', {})
    
    yong_shen_element = yongshen_data.get('primary', '木')
    ji_shen_list = yongshen_data.get('ji_shen', [])
    
    # 测试连续7天
    base_date = datetime.date(2026, 2, 1)
    todos = []
    
    for i in range(7):
        test_date = base_date + datetime.timedelta(days=i)
        todo_list = generate_todo(yong_shen_element, ji_shen_list)
        
        todos.append({
            'date': str(test_date),
            'todo': todo_list
        })
    
    # 打印结果
    for t in todos:
        print(f"\n{t['date']}:")
        for item in t['todo']:
            print(f"  {item['type']}: {item['content'][:40]}...")
    
    # 验证
    all_todos = [item['content'] for t in todos for item in t['todo']]
    unique_todos = set(all_todos)
    
    print(f"\n不同宜忌建议数量: {len(unique_todos)} / {len(all_todos)}")
    
    if len(unique_todos) >= len(all_todos) * 0.5:
        print("✅ 通过：宜忌有足够的变化")
    else:
        print("❌ 失败：宜忌变化不足（当前设计问题：宜忌不依赖日期）")
    
    return len(unique_todos) >= len(all_todos) * 0.5


if __name__ == '__main__':
    print("开始测试每日差异化...\n")
    
    results = []
    results.append(("流日计算", test_liu_ri_variation()))
    results.append(("分数计算", test_score_variation()))
    results.append(("主题生成", test_theme_variation()))
    results.append(("宜忌生成", test_todo_variation()))
    
    print("\n" + "=" * 60)
    print("测试总结")
    print("=" * 60)
    for name, passed in results:
        status = "✅ 通过" if passed else "❌ 失败"
        print(f"{name}: {status}")
    
    all_passed = all(r[1] for r in results)
    if all_passed:
        print("\n🎉 所有测试通过！")
    else:
        print("\n⚠️  部分测试失败，需要优化代码")
