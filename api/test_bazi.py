# -*- coding: utf-8 -*-
"""
测试八字运势API
"""
import json
import sys

try:
    from flask import Flask
    from bazi_calculator import BaziCalculator
    from config import TEN_GOD_MAPPING
    print("✓ 所有模块导入成功")
except Exception as e:
    print(f"✗ 模块导入失败: {e}")
    sys.exit(1)

# 测试八字计算器
print("\n" + "="*50)
print("测试八字计算器")
print("="*50)

try:
    calculator = BaziCalculator("1995-08-15", "09:30", 116.4)
    print("✓ 八字计算器初始化成功")

    # 测试日主旺衰分析
    strength = calculator.analyze_day_master_strength()
    print(f"\n日主旺衰: {strength['strength']}")
    print(f"  - 月令得分: {strength['details']['yue_ling']:.2f}")
    print(f"  - 得令得分: {strength['details']['de_ling']:.2f}")
    print(f"  - 得地得分: {strength['details']['de_di']:.2f}")
    print(f"  - 得势得分: {strength['details']['de_shi']:.2f}")

    # 测试用神喜忌
    yong_shen = calculator.derive_yong_shen()
    print(f"\n用神喜忌:")
    print(f"  - 用神: {yong_shen['yong_shen']}")
    print(f"  - 喜神: {yong_shen['xi_shen']}")
    print(f"  - 忌神: {yong_shen['ji_shen']}")
    print(f"  - 十神: {yong_shen['ten_gods']}")

    # 测试大运
    da_yun_list = calculator.get_da_yun_list()
    print(f"\n大运列表 (前5个):")
    for da_yun in da_yun_list[:5]:
        print(f"  - {da_yun['gan_zhi']} ({da_yun['start_year']}-{da_yun['end_year']}, {da_yun['age']}岁)")

    # 测试运势分析
    fortune = calculator.calculate_fortune_score("2025-01-01", 1)
    print(f"\n运势分析 (2025-01-01):")
    print(f"  - 总分: {fortune['total_score']}")
    print(f"  - 今日十神: {fortune['today_ten_god']}")
    print(f"  - 神煞: {fortune['shen_sha']}")
    print(f"  - 宜: {fortune['yi_ji']['yi']}")
    print(f"  - 忌: {fortune['yi_ji']['ji']}")

    print("\n各维度评分:")
    for dim, data in fortune['dimensions'].items():
        print(f"  - {dim}: {data['score']}分 ({data['level']}) - {data['tag']}")

    print("\n" + "="*50)
    print("✓ 所有测试通过!")
    print("="*50)

except Exception as e:
    print(f"\n✗ 测试失败: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
