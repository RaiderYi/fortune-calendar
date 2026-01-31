# -*- coding: utf-8 -*-
"""
干支计算单元测试

验证内容：
1. 日柱计算（关键Bug修复）
2. 早子时处理
3. 年柱立春换年
4. 月柱五虎遁
5. 时柱五鼠遁
6. 特殊案例验证
"""

import sys
import os
from datetime import date, datetime
from typing import List, Tuple

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))


def run_tests():
    """运行所有测试"""
    print("=" * 70)
    print("干支计算模块测试")
    print("=" * 70)
    
    results = []
    
    # 测试1: 日柱基准日验证
    results.append(test_day_pillar_base_date())
    
    # 测试2: 日柱计算验证
    results.append(test_day_pillar_calculation())
    
    # 测试3: 年柱立春换年验证
    results.append(test_year_pillar_lichun())
    
    # 测试4: 月柱计算验证
    results.append(test_month_pillar())
    
    # 测试5: 时柱计算验证
    results.append(test_hour_pillar())
    
    # 测试6: 早子时处理验证
    results.append(test_early_zi_hour())
    
    # 测试7: 完整八字验证
    results.append(test_full_bazi())
    
    # 汇总结果
    print("\n" + "=" * 70)
    print("测试结果汇总")
    print("=" * 70)
    
    passed = sum(1 for r in results if r)
    total = len(results)
    
    print(f"\n通过: {passed}/{total}")
    
    if passed == total:
        print("✅ 所有测试通过！")
        return True
    else:
        print("❌ 存在失败的测试")
        return False


def test_day_pillar_base_date():
    """
    测试1: 日柱基准日验证
    
    验证 1900-01-01 是否为甲戌日
    """
    print("\n" + "-" * 50)
    print("测试1: 日柱基准日验证")
    print("-" * 50)
    
    from api.core.calendar.ganzhi import GanZhiCalculator
    
    calc = GanZhiCalculator()
    
    # 1900-01-01 应该是甲戌日
    base_date = date(1900, 1, 1)
    day_gz = calc.calculate_liu_ri(base_date)
    
    expected = "甲戌"
    actual = day_gz.full
    
    print(f"  基准日: 1900-01-01")
    print(f"  期望: {expected}")
    print(f"  实际: {actual}")
    
    if actual == expected:
        print("  ✅ 通过")
        return True
    else:
        print("  ❌ 失败")
        return False


def test_day_pillar_calculation():
    """
    测试2: 日柱计算验证
    
    使用已知的日期-干支对照表验证
    基准：1900-01-01 = 甲戌日
    """
    print("\n" + "-" * 50)
    print("测试2: 日柱计算验证")
    print("-" * 50)
    
    from api.core.calendar.ganzhi import GanZhiCalculator
    
    calc = GanZhiCalculator()
    
    # 已计算验证的日期-干支对照
    test_cases = [
        # (年, 月, 日, 期望干支)
        (1900, 1, 1, "甲戌"),    # 基准日
        (1900, 1, 2, "乙亥"),    # 基准日+1
        (1900, 1, 31, "甲辰"),   # 基准日+30
        (1900, 3, 1, "癸酉"),    # 基准日+59（1月31天+2月28天）
        (1984, 1, 1, "甲午"),    # 经验证：距基准日30680天
        (2000, 1, 1, "戊午"),    # 千禧年第一天
        (2020, 1, 1, "癸卯"),    # 2020年第一天
        (2024, 1, 1, "甲子"),    # 2024年第一天（已验证）
        (2025, 1, 1, "庚午"),    # 2025年第一天
        (2025, 1, 31, "庚子"),   # 2025年1月31日
    ]
    
    all_passed = True
    
    for year, month, day, expected in test_cases:
        d = date(year, month, day)
        day_gz = calc.calculate_liu_ri(d)
        actual = day_gz.full
        
        status = "✅" if actual == expected else "❌"
        if actual != expected:
            all_passed = False
        
        print(f"  {year}-{month:02d}-{day:02d}: 期望 {expected}, 实际 {actual} {status}")
    
    if all_passed:
        print("  ✅ 全部通过")
    else:
        print("  ❌ 存在失败")
    
    return all_passed


def test_year_pillar_lichun():
    """
    测试3: 年柱立春换年验证
    
    验证立春前后的年柱是否正确切换
    """
    print("\n" + "-" * 50)
    print("测试3: 年柱立春换年验证")
    print("-" * 50)
    
    from api.core.calendar.ganzhi import GanZhiCalculator
    from api.core.calendar.solar_terms import SolarTermProvider
    
    calc = GanZhiCalculator()
    provider = SolarTermProvider()
    
    # 2025年立春日期
    lichun_2025 = provider.get_term_date(2025, "立春")
    print(f"  2025年立春: {lichun_2025}")
    
    test_cases = [
        # (日期, 期望年柱)
        (date(2025, 1, 1), "甲辰"),   # 2025年1月1日，立春前，算甲辰年
        (date(2025, 2, 2), "甲辰"),   # 立春前一天
        (date(2025, 2, 3), "乙巳"),   # 立春当天（2025立春是2月3日），算乙巳年
        (date(2025, 2, 4), "乙巳"),   # 立春后
        (date(2025, 12, 31), "乙巳"), # 2025年12月31日
    ]
    
    all_passed = True
    
    for d, expected in test_cases:
        # 计算八字以获取年柱
        bazi = calc.calculate_bazi(datetime(d.year, d.month, d.day, 12, 0))
        actual = bazi.year.full
        
        status = "✅" if actual == expected else "❌"
        if actual != expected:
            all_passed = False
        
        print(f"  {d}: 期望 {expected}, 实际 {actual} {status}")
    
    if all_passed:
        print("  ✅ 全部通过")
    else:
        print("  ❌ 存在失败")
    
    return all_passed


def test_month_pillar():
    """
    测试4: 月柱计算验证
    
    验证五虎遁月干推算
    """
    print("\n" + "-" * 50)
    print("测试4: 月柱计算验证（五虎遁）")
    print("-" * 50)
    
    from api.core.calendar.ganzhi import GanZhiCalculator
    
    calc = GanZhiCalculator()
    
    # 五虎遁规则验证
    # 甲己之年丙作首 -> 甲/己年正月（寅月）起丙寅
    # 乙庚之年戊为头 -> 乙/庚年正月（寅月）起戊寅
    # 丙辛之岁寻庚上 -> 丙/辛年正月（寅月）起庚寅
    # 丁壬壬寅顺水流 -> 丁/壬年正月（寅月）起壬寅
    # 戊癸之年何处起 -> 戊/癸年正月（寅月）起甲寅
    
    test_cases = [
        # (日期, 期望月柱)
        # 2024甲辰年，甲年正月起丙寅
        (datetime(2024, 2, 10, 12, 0), "丙寅"),  # 立春后，寅月
        (datetime(2024, 3, 10, 12, 0), "丁卯"),  # 卯月
        
        # 2025乙巳年，乙年正月起戊寅
        (datetime(2025, 2, 10, 12, 0), "戊寅"),  # 立春后，寅月
        (datetime(2025, 3, 10, 12, 0), "己卯"),  # 卯月
    ]
    
    all_passed = True
    
    for dt, expected in test_cases:
        bazi = calc.calculate_bazi(dt)
        actual = bazi.month.full
        
        status = "✅" if actual == expected else "❌"
        if actual != expected:
            all_passed = False
        
        print(f"  {dt.date()}: 期望 {expected}, 实际 {actual} {status}")
    
    if all_passed:
        print("  ✅ 全部通过")
    else:
        print("  ❌ 存在失败")
    
    return all_passed


def test_hour_pillar():
    """
    测试5: 时柱计算验证
    
    验证五鼠遁时干推算
    """
    print("\n" + "-" * 50)
    print("测试5: 时柱计算验证（五鼠遁）")
    print("-" * 50)
    
    from api.core.calendar.ganzhi import GanZhiCalculator
    
    calc = GanZhiCalculator()
    
    # 五鼠遁规则验证
    # 甲己还加甲 -> 甲/己日子时起甲子
    # 乙庚丙作初 -> 乙/庚日子时起丙子
    # 丙辛从戊起 -> 丙/辛日子时起戊子
    # 丁壬庚子居 -> 丁/壬日子时起庚子
    # 戊癸何方发 -> 戊/癸日子时起壬子
    
    # 2025-01-01 是庚午日（庚日子时起丙子）
    test_cases = [
        # (时间, 期望时柱)
        (datetime(2025, 1, 1, 0, 30), "丙子"),   # 子时(0点) 庚日起丙子
        (datetime(2025, 1, 1, 1, 30), "丁丑"),   # 丑时
        (datetime(2025, 1, 1, 3, 30), "戊寅"),   # 寅时
        (datetime(2025, 1, 1, 5, 30), "己卯"),   # 卯时
        (datetime(2025, 1, 1, 7, 30), "庚辰"),   # 辰时
        (datetime(2025, 1, 1, 9, 30), "辛巳"),   # 巳时
        (datetime(2025, 1, 1, 11, 30), "壬午"),  # 午时
        (datetime(2025, 1, 1, 13, 30), "癸未"),  # 未时
        (datetime(2025, 1, 1, 15, 30), "甲申"),  # 申时
        (datetime(2025, 1, 1, 17, 30), "乙酉"),  # 酉时
        (datetime(2025, 1, 1, 19, 30), "丙戌"),  # 戌时
        (datetime(2025, 1, 1, 21, 30), "丁亥"),  # 亥时
    ]
    
    all_passed = True
    
    for dt, expected in test_cases:
        bazi = calc.calculate_bazi(dt)
        actual = bazi.hour.full
        
        status = "✅" if actual == expected else "❌"
        if actual != expected:
            all_passed = False
        
        print(f"  {dt.time()}: 期望 {expected}, 实际 {actual} {status}")
    
    if all_passed:
        print("  ✅ 全部通过")
    else:
        print("  ❌ 存在失败")
    
    return all_passed


def test_early_zi_hour():
    """
    测试6: 早子时处理验证
    
    23:00-00:00 属于次日子时
    """
    print("\n" + "-" * 50)
    print("测试6: 早子时处理验证")
    print("-" * 50)
    
    from api.core.calendar.ganzhi import GanZhiCalculator
    
    calc = GanZhiCalculator()
    
    # 2025-01-01 23:30 应该算 2025-01-02 的子时
    # 2025-01-01 是庚午日
    # 2025-01-02 是辛未日，辛日子时起戊子（丙辛从戊起）
    
    dt_early_zi = datetime(2025, 1, 1, 23, 30)
    bazi = calc.calculate_bazi(dt_early_zi)
    
    print(f"  测试时间: {dt_early_zi}")
    print(f"  日柱期望: 辛未（次日）")
    print(f"  日柱实际: {bazi.day.full}")
    print(f"  时柱期望: 戊子（辛日子时起戊子）")
    print(f"  时柱实际: {bazi.hour.full}")
    
    day_ok = bazi.day.full == "辛未"
    hour_ok = bazi.hour.full == "戊子"
    
    if day_ok and hour_ok:
        print("  ✅ 通过")
        return True
    else:
        print("  ❌ 失败")
        return False


def test_full_bazi():
    """
    测试7: 完整八字验证
    
    使用名人八字或已知案例验证
    """
    print("\n" + "-" * 50)
    print("测试7: 完整八字验证")
    print("-" * 50)
    
    from api.core.calendar.ganzhi import GanZhiCalculator
    
    calc = GanZhiCalculator()
    
    # 测试案例（需要使用已知正确的八字）
    # 案例1: 1990-05-15 10:30 北京
    # 这个案例需要查万年历确认
    
    test_cases = [
        {
            'birth': datetime(1984, 2, 19, 10, 30),  # 立春后
            'longitude': 116.4,
            'expected': {
                'year': '甲子',
                'month': '丙寅',  # 甲年寅月起丙寅
            }
        },
    ]
    
    all_passed = True
    
    for case in test_cases:
        bazi = calc.calculate_bazi(case['birth'], case['longitude'])
        
        print(f"  出生时间: {case['birth']}")
        print(f"  八字: {bazi}")
        
        if 'year' in case['expected']:
            if bazi.year.full != case['expected']['year']:
                print(f"    年柱不匹配: 期望 {case['expected']['year']}, 实际 {bazi.year.full}")
                all_passed = False
        
        if 'month' in case['expected']:
            if bazi.month.full != case['expected']['month']:
                print(f"    月柱不匹配: 期望 {case['expected']['month']}, 实际 {bazi.month.full}")
                all_passed = False
    
    if all_passed:
        print("  ✅ 全部通过")
    else:
        print("  ❌ 存在失败")
    
    return all_passed


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
