# -*- coding: utf-8 -*-
"""
新旧版本对比验证脚本

对比重构后的干支计算模块与原index.py中的计算结果
验证关键修复是否生效
"""

import sys
import os
from datetime import date, datetime

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


def compare_versions():
    """对比新旧版本的计算结果"""
    print("=" * 70)
    print("新旧版本干支计算对比")
    print("=" * 70)
    
    # ===== 新版本 =====
    from api.core.calendar.ganzhi import GanZhiCalculator
    new_calc = GanZhiCalculator()
    
    # ===== 旧版本（模拟原index.py中的计算） =====
    # 原代码使用 1900-01-01 = 甲戌(序号10)，这是正确的
    # 但 lunar_calculator_pure.py 使用 1984-01-01 = 甲子，这是错误的
    
    TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
    DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    
    def old_calc_day_ganzhi_correct(d):
        """原index.py中的正确版本（1900-01-01=甲戌）"""
        base_date = date(1900, 1, 1)
        days_diff = (d - base_date).days
        gan_zhi_index = (10 + days_diff) % 60
        return TIAN_GAN[gan_zhi_index % 10] + DI_ZHI[gan_zhi_index % 12]
    
    def old_calc_day_ganzhi_buggy(d):
        """原lunar_calculator_pure.py中的错误版本（1984-01-01=甲子）"""
        base_date = date(1984, 1, 1)
        days_diff = (d - base_date).days
        gan_zhi_num = (days_diff % 60) + 1
        return TIAN_GAN[(gan_zhi_num - 1) % 10] + DI_ZHI[(gan_zhi_num - 1) % 12]
    
    # ===== 测试案例 =====
    test_dates = [
        date(1900, 1, 1),   # 基准日
        date(1984, 1, 1),   # 甲子年
        date(2000, 1, 1),   # 千禧年
        date(2024, 1, 1),   # 甲辰年
        date(2025, 1, 1),   # 乙巳年（立春后）
        date(2025, 1, 31),  # 测试日
    ]
    
    print("\n日柱计算对比:")
    print("-" * 70)
    print(f"{'日期':<15} {'新版本':<10} {'原正确版':<10} {'原Bug版':<10} {'状态'}")
    print("-" * 70)
    
    all_match = True
    for d in test_dates:
        new_result = new_calc.calculate_liu_ri(d).full
        old_correct = old_calc_day_ganzhi_correct(d)
        old_buggy = old_calc_day_ganzhi_buggy(d)
        
        # 新版本应该与原正确版一致
        if new_result == old_correct:
            status = "✅ 一致"
        else:
            status = "❌ 不一致"
            all_match = False
        
        # 标注Bug版本差异
        bug_note = "" if old_correct == old_buggy else f" (Bug版不同)"
        
        print(f"{str(d):<15} {new_result:<10} {old_correct:<10} {old_buggy:<10} {status}{bug_note}")
    
    print("-" * 70)
    
    # ===== 完整八字对比 =====
    print("\n完整八字对比:")
    print("-" * 70)
    
    test_cases = [
        (datetime(1990, 5, 15, 10, 30), 116.4, "北京"),
        (datetime(1985, 8, 20, 14, 0), 121.5, "上海"),
        (datetime(2000, 1, 1, 0, 0), 120.0, "标准"),
    ]
    
    for birth_dt, longitude, location in test_cases:
        bazi = new_calc.calculate_bazi(birth_dt, longitude)
        print(f"\n出生: {birth_dt} ({location}, 经度{longitude})")
        print(f"八字: {bazi}")
        print(f"日主: {bazi.day_master} ({bazi.day_master_element})")
    
    print("\n" + "=" * 70)
    if all_match:
        print("✅ 新版本与原正确版本完全一致，修复成功！")
    else:
        print("❌ 存在不一致，需要检查")
    print("=" * 70)
    
    return all_match


def show_key_fixes():
    """展示关键修复点"""
    print("\n" + "=" * 70)
    print("关键修复点说明")
    print("=" * 70)
    
    fixes = [
        {
            "问题": "日柱基准日不一致",
            "原因": "lunar_calculator_pure.py使用1984-01-01=甲子(错误)\n"
                   "       index.py使用1900-01-01=甲戌(正确)",
            "修复": "统一使用1900-01-01=甲戌作为基准",
            "影响": "日柱计算结果可能偏差数十天"
        },
        {
            "问题": "早子时未处理",
            "原因": "23:00-00:00属于次日子时，原代码未处理",
            "修复": "添加_handle_early_zi_hour方法，23点后日柱+1",
            "影响": "23点出生的人日柱和时柱都会错误"
        },
        {
            "问题": "十神计算简化",
            "原因": "原代码只用天干索引差，未考虑阴阳",
            "修复": "新增ShiShenCalculator，正确处理阴阳异同",
            "影响": "十神判断可能混淆正偏（如正财vs偏财）"
        }
    ]
    
    for i, fix in enumerate(fixes, 1):
        print(f"\n{i}. {fix['问题']}")
        print(f"   原因: {fix['原因']}")
        print(f"   修复: {fix['修复']}")
        print(f"   影响: {fix['影响']}")
    
    print("\n" + "=" * 70)


if __name__ == "__main__":
    compare_versions()
    show_key_fixes()
