# -*- coding: utf-8 -*-
"""
流年·私历 重构版 使用示例

展示如何使用新的模块化API计算八字和运势
"""

import sys
import os
from datetime import datetime, date

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


def example_basic_bazi():
    """示例1: 基础八字计算"""
    print("=" * 60)
    print("示例1: 基础八字计算")
    print("=" * 60)
    
    from api.core.calendar import GanZhiCalculator, calculate_bazi
    
    # 方式1: 使用便捷函数
    birth_dt = datetime(1990, 8, 15, 10, 30)
    bazi = calculate_bazi(birth_dt, longitude=116.4)
    
    print(f"\n出生时间: {birth_dt}")
    print(f"出生地经度: 116.4 (北京)")
    print(f"\n四柱八字: {bazi}")
    print(f"  年柱: {bazi.year.full}")
    print(f"  月柱: {bazi.month.full}")
    print(f"  日柱: {bazi.day.full}")
    print(f"  时柱: {bazi.hour.full}")
    print(f"\n日主: {bazi.day_master} ({bazi.day_master_element})")
    
    # 方式2: 使用计算器实例（推荐用于批量计算）
    calculator = GanZhiCalculator()
    
    # 计算流年流月流日
    today = date.today()
    liu_nian = calculator.calculate_liu_nian(today.year)
    liu_yue = calculator.calculate_liu_yue(today)
    liu_ri = calculator.calculate_liu_ri(today)
    
    print(f"\n今日: {today}")
    print(f"  流年: {liu_nian.full}")
    print(f"  流月: {liu_yue.full}")
    print(f"  流日: {liu_ri.full}")


def example_ganzhi_data():
    """示例2: 干支数据结构"""
    print("\n" + "=" * 60)
    print("示例2: 干支数据结构")
    print("=" * 60)
    
    from api.core.calendar import GanZhi
    
    # GanZhi 是不可变的数据类
    gz = GanZhi(gan="甲", zhi="子")
    
    print(f"\n干支: {gz.full}")
    print(f"  天干: {gz.gan} (索引: {gz.gan_index})")
    print(f"  地支: {gz.zhi} (索引: {gz.zhi_index})")
    print(f"  六十甲子索引: {gz.sixty_index}")
    
    # 可以用作字典键（因为是frozen dataclass）
    scores = {gz: 85}
    print(f"\n作为字典键: {gz} -> {scores[gz]}")


def example_constants():
    """示例3: 使用常量数据"""
    print("\n" + "=" * 60)
    print("示例3: 使用常量数据")
    print("=" * 60)
    
    from api.data.constants import (
        TIAN_GAN, DI_ZHI, WU_XING,
        get_tiangan_wuxing, is_yang_gan,
        get_dizhi_wuxing, get_cang_gan,
        WU_XING_SHENG, WU_XING_KE,
        check_liu_chong, check_liu_he
    )
    
    print(f"\n天干: {' '.join(TIAN_GAN)}")
    print(f"地支: {' '.join(DI_ZHI)}")
    print(f"五行: {' '.join(WU_XING)}")
    
    # 天干五行和阴阳
    print("\n天干属性:")
    for gan in TIAN_GAN[:5]:
        element = get_tiangan_wuxing(gan)
        yy = "阳" if is_yang_gan(gan) else "阴"
        print(f"  {gan}: {element} ({yy})")
    
    # 地支藏干
    print("\n地支藏干示例:")
    for zhi in ["寅", "卯", "辰"]:
        cang = get_cang_gan(zhi)
        cang_str = ", ".join([g for g in cang if g])
        print(f"  {zhi}: {cang_str}")
    
    # 五行生克
    print("\n五行相生:")
    for element in WU_XING:
        sheng = WU_XING_SHENG[element]
        print(f"  {element} 生 {sheng}")
    
    # 地支冲合
    print("\n地支关系判断:")
    print(f"  子午是否六冲: {check_liu_chong('子', '午')}")
    print(f"  子丑是否六合: {check_liu_he('子', '丑')}")


def example_solar_terms():
    """示例4: 节气计算"""
    print("\n" + "=" * 60)
    print("示例4: 节气计算")
    print("=" * 60)
    
    from api.core.calendar import SolarTermProvider
    
    provider = SolarTermProvider()
    
    # 获取今年的立春日期
    lichun_2025 = provider.get_term_date(2025, "立春")
    print(f"\n2025年立春: {lichun_2025}")
    
    # 判断某日期是否在立春前
    test_date = date(2025, 1, 15)
    before = provider.is_before_lichun(test_date)
    print(f"{test_date} 是否在立春前: {before}")
    
    # 获取当前节气
    today = date.today()
    term_name = provider.get_current_term_name(today)
    print(f"今日节气: {term_name}")


def example_early_zi_hour():
    """示例5: 早子时处理"""
    print("\n" + "=" * 60)
    print("示例5: 早子时处理")
    print("=" * 60)
    
    from api.core.calendar import calculate_bazi
    
    # 23:30 出生属于次日子时
    birth_late_night = datetime(2025, 1, 15, 23, 30)
    bazi = calculate_bazi(birth_late_night)
    
    print(f"\n出生时间: {birth_late_night}")
    print(f"四柱八字: {bazi}")
    print(f"说明: 23:30属于次日(1月16日)子时")
    
    # 对比0:30出生
    birth_early_morning = datetime(2025, 1, 16, 0, 30)
    bazi2 = calculate_bazi(birth_early_morning)
    
    print(f"\n出生时间: {birth_early_morning}")
    print(f"四柱八字: {bazi2}")
    print(f"说明: 0:30同样属于1月16日子时")
    
    # 验证两者日柱相同
    assert bazi.day.full == bazi2.day.full, "早子时处理错误"
    print(f"\n✅ 验证通过: 两者日柱都是 {bazi.day.full}")


def main():
    """运行所有示例"""
    example_basic_bazi()
    example_ganzhi_data()
    example_constants()
    example_solar_terms()
    example_early_zi_hour()
    
    print("\n" + "=" * 60)
    print("所有示例运行完成！")
    print("=" * 60)


if __name__ == "__main__":
    main()
