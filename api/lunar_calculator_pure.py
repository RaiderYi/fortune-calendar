# -*- coding: utf-8 -*-
"""
纯Python农历干支计算模块 - 生产版本
无需任何外部依赖，可在 Vercel 环境运行

功能：
1. 公历转干支（年月日时）
2. 真太阳时校准
3. 节气计算
4. 流年流月流日干支
"""

import datetime
import math

# ==================== 基础常量 ====================

# 天干地支
TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

# 节气名称（24节气，从小寒开始）
SOLAR_TERMS = [
    "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
    "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
    "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
    "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
]

# 农历月份名称
LUNAR_MONTH_NAMES = [
    "正月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "冬月", "腊月"
]

# 简化的节气日期表（2000-2030年，每年24个节气的大致日期）
# 格式：{年份: [(月, 日), (月, 日), ...]} 共24个
SOLAR_TERM_TABLE = {
    2025: [
        (1, 5), (1, 20), (2, 3), (2, 18), (3, 5), (3, 20),
        (4, 4), (4, 19), (5, 5), (5, 20), (6, 5), (6, 21),
        (7, 6), (7, 22), (8, 7), (8, 23), (9, 7), (9, 22),
        (10, 8), (10, 23), (11, 7), (11, 22), (12, 7), (12, 21)
    ],
    # 可以扩展其他年份
}


# ==================== 工具函数 ====================

def get_gan_zhi_from_num(num):
    """
    从数字获取干支
    num: 1-60 之间的数字（代表六十甲子中的位置）
    """
    gan_index = (num - 1) % 10
    zhi_index = (num - 1) % 12
    return TIAN_GAN[gan_index] + DI_ZHI[zhi_index]


def adjust_time_for_longitude(dt, longitude):
    """
    真太阳时校准

    参数:
        dt: datetime 对象
        longitude: 东经度数（如北京 116.4）

    返回:
        调整后的 datetime 对象
    """
    # 北京时间基于东经120度
    # 每度差异约4分钟
    time_diff_minutes = (longitude - 120.0) * 4.0

    adjusted_dt = dt + datetime.timedelta(minutes=time_diff_minutes)
    return adjusted_dt


# ==================== 节气计算 ====================

def get_solar_term_for_year(year, term_index):
    """
    获取某年某个节气的日期

    参数:
        year: 年份
        term_index: 节气索引 0-23 (0=小寒, 2=立春, ...)

    返回:
        (月, 日) 或 None
    """
    # 如果有精确数据表，使用表
    if year in SOLAR_TERM_TABLE:
        month, day = SOLAR_TERM_TABLE[year][term_index]
        return month, day

    # 否则使用近似算法
    # 以2025年为基准推算
    base_year = 2025
    if year in SOLAR_TERM_TABLE:
        base_month, base_day = SOLAR_TERM_TABLE[base_year][term_index]
    else:
        # 如果连基准年都没有，使用硬编码的大致日期
        approximate_dates = [
            (1, 5), (1, 20), (2, 3), (2, 18), (3, 5), (3, 20),
            (4, 4), (4, 19), (5, 5), (5, 20), (6, 5), (6, 21),
            (7, 6), (7, 22), (8, 7), (8, 23), (9, 7), (9, 22),
            (10, 8), (10, 23), (11, 7), (11, 22), (12, 7), (12, 21)
        ]
        base_month, base_day = approximate_dates[term_index]

    # 每年节气会有小幅偏移（约±1天）
    year_diff = year - base_year

    # 简化处理：假设不变（实际应用中可以加入更精确的算法）
    return base_month, base_day


def get_current_solar_term(date):
    """
    获取指定日期所处的节气

    返回:
        (节气名称, 节气索引)
    """
    year = date.year
    month = date.month
    day = date.day

    # 遍历24个节气，找到最近的前一个
    for i in range(23, -1, -1):
        term_month, term_day = get_solar_term_for_year(year, i)

        if month > term_month or (month == term_month and day >= term_day):
            return SOLAR_TERMS[i], i

    # 如果在当年第一个节气之前，属于上一年的冬至
    return SOLAR_TERMS[23], 23


# ==================== 干支推算 ====================

def get_year_gan_zhi(year, month, day):
    """
    计算年柱干支

    注意：立春换年！不是正月初一

    参数:
        year, month, day: 公历日期

    返回:
        年干支字符串，如 "甲子"
    """
    # 检查是否在立春之前
    lichun_month, lichun_day = get_solar_term_for_year(year, 2)  # 立春是第2个节气（索引2）

    calc_year = year
    if month < lichun_month or (month == lichun_month and day < lichun_day):
        # 在立春之前，算上一年
        calc_year = year - 1

    # 1984年是甲子年（索引=1）
    # 使用公式：(年份 - 1984) % 60 + 1
    offset = (calc_year - 1984) % 60
    gan_zhi_num = offset + 1

    return get_gan_zhi_from_num(gan_zhi_num)


def get_month_gan_zhi(year, month, day):
    """
    计算月柱干支

    月柱根据节气划分（不是公历月份）
    """
    # 1. 确定节气月（地支）
    term_name, term_index = get_current_solar_term(datetime.date(year, month, day))

    # 节气月地支映射
    # 小寒/大寒→丑月，立春/雨水→寅月，惊蛰/春分→卯月...
    # 索引 0,1→丑  2,3→寅  4,5→卯  6,7→辰  8,9→巳  10,11→午
    #     12,13→未 14,15→申 16,17→酉 18,19→戌 20,21→亥 22,23→子
    month_zhi_index = (term_index // 2 + 1) % 12

    # 2. 根据年干推月干（五虎遁）
    year_gz = get_year_gan_zhi(year, month, day)
    year_gan_index = TIAN_GAN.index(year_gz[0])

    # 五虎遁口诀：甲己之年丙作首，乙庚之年戊为头...
    # 对应关系：甲己→丙，乙庚→戊，丙辛→庚，丁壬→壬，戊癸→甲
    month_gan_starts = [2, 4, 6, 8, 0]  # 对应丙戊庚壬甲的索引
    month_gan_base = month_gan_starts[year_gan_index % 5]

    # 寅月(索引2)开始，月干从基数开始
    # 实际月份地支索引 month_zhi_index，寅月是2
    month_gan_index = (month_gan_base + (month_zhi_index - 2)) % 10

    return TIAN_GAN[month_gan_index] + DI_ZHI[month_zhi_index]


def get_day_gan_zhi(year, month, day):
    """
    计算日柱干支

    使用公元纪年推算法
    """
    # 使用简化算法：以1984年1月1日（甲子日）为基准
    base_date = datetime.date(1984, 1, 1)
    target_date = datetime.date(year, month, day)

    # 计算天数差
    days_diff = (target_date - base_date).days

    # 1984-01-01 是甲子日（数字1）
    gan_zhi_num = (days_diff % 60) + 1

    return get_gan_zhi_from_num(gan_zhi_num)


def get_hour_gan_zhi(day_gan, hour):
    """
    计算时柱干支

    根据日干推时干（日上起时法）

    参数:
        day_gan: 日干，如 "甲"
        hour: 小时 0-23

    返回:
        时干支，如 "甲子"
    """
    # 1. 确定时辰地支
    # 23-1点子时，1-3丑时，3-5寅时...
    time_zhi_index = ((hour + 1) // 2) % 12

    # 2. 根据日干推时干（五鼠遁）
    # 甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
    day_gan_index = TIAN_GAN.index(day_gan)

    time_gan_starts = [0, 2, 4, 6, 8]  # 甲丙戊庚壬
    time_gan_base = time_gan_starts[day_gan_index % 5]

    # 子时（索引0）开始
    time_gan_index = (time_gan_base + time_zhi_index) % 10

    return TIAN_GAN[time_gan_index] + DI_ZHI[time_zhi_index]


# ==================== 完整八字计算 ====================

def calculate_bazi(birth_datetime, longitude=120.0):
    """
    计算完整八字

    参数:
        birth_datetime: datetime 对象，出生时间
        longitude: 出生地东经度数，用于真太阳时校准

    返回:
        字典，包含完整八字信息
    """
    # 1. 真太阳时校准
    adjusted_dt = adjust_time_for_longitude(birth_datetime, longitude)

    year = adjusted_dt.year
    month = adjusted_dt.month
    day = adjusted_dt.day
    hour = adjusted_dt.hour

    # 2. 计算四柱干支
    year_gz = get_year_gan_zhi(year, month, day)
    month_gz = get_month_gan_zhi(year, month, day)
    day_gz = get_day_gan_zhi(year, month, day)
    hour_gz = get_hour_gan_zhi(day_gz[0], hour)

    # 3. 获取节气
    term_name, term_index = get_current_solar_term(adjusted_dt.date())

    return {
        'year': year_gz,
        'month': month_gz,
        'day': day_gz,
        'hour': hour_gz,
        'year_gan': year_gz[0],
        'year_zhi': year_gz[1],
        'month_gan': month_gz[0],
        'month_zhi': month_gz[1],
        'day_gan': day_gz[0],
        'day_zhi': day_gz[1],
        'time_gan': hour_gz[0],
        'time_zhi': hour_gz[1],
        'solar_term': term_name,
        'solar_term_index': term_index,
        'adjusted_datetime': adjusted_dt,
        'original_datetime': birth_datetime
    }


def calculate_liu_nian(year):
    """
    计算流年干支
    """
    # 使用年初日期来获取年干支
    year_gz = get_year_gan_zhi(year, 2, 4)  # 使用立春后的日期确保正确

    return {
        'year': year,
        'gan_zhi': year_gz,
        'gan': year_gz[0],
        'zhi': year_gz[1]
    }


def calculate_liu_yue(year, month, day):
    """
    计算流月干支
    """
    month_gz = get_month_gan_zhi(year, month, day)

    return {
        'year': year,
        'month': month,
        'gan_zhi': month_gz,
        'gan': month_gz[0],
        'zhi': month_gz[1]
    }


def calculate_liu_ri(year, month, day):
    """
    计算流日干支
    """
    day_gz = get_day_gan_zhi(year, month, day)

    return {
        'year': year,
        'month': month,
        'day': day,
        'gan_zhi': day_gz,
        'gan': day_gz[0],
        'zhi': day_gz[1]
    }


# ==================== 测试函数 ====================

def test_calculation():
    """
    测试八字计算功能
    """
    print("=" * 60)
    print("八字计算模块测试")
    print("=" * 60)

    # 测试案例：1995年8月15日 9:30，北京
    test_date = datetime.datetime(1995, 8, 15, 9, 30)
    longitude = 116.4

    print(f"\n📅 测试日期: {test_date}")
    print(f"📍 出生地: 东经 {longitude}°")

    bazi = calculate_bazi(test_date, longitude)

    print(f"\n⏰ 真太阳时: {bazi['adjusted_datetime']}")
    print(f"🌱 当前节气: {bazi['solar_term']}")

    print(f"\n八字排盘:")
    print(f"  年柱: {bazi['year']} ({bazi['year_gan']}{bazi['year_zhi']})")
    print(f"  月柱: {bazi['month']} ({bazi['month_gan']}{bazi['month_zhi']})")
    print(f"  日柱: {bazi['day']} ({bazi['day_gan']}{bazi['day_zhi']})")
    print(f"  时柱: {bazi['hour']} ({bazi['time_gan']}{bazi['time_zhi']})")

    # 测试流年流月流日
    print(f"\n\n{'=' * 60}")
    print("流年流月流日测试")
    print("=" * 60)

    test_date2 = datetime.date(2025, 12, 30)
    print(f"\n📅 测试日期: {test_date2}")

    liu_nian = calculate_liu_nian(test_date2.year)
    print(f"流年: {liu_nian['gan_zhi']} ({test_date2.year}年)")

    liu_yue = calculate_liu_yue(test_date2.year, test_date2.month, test_date2.day)
    print(f"流月: {liu_yue['gan_zhi']}")

    liu_ri = calculate_liu_ri(test_date2.year, test_date2.month, test_date2.day)
    print(f"流日: {liu_ri['gan_zhi']}")

    print("\n" + "=" * 60)
    print("✅ 测试完成！")
    print("=" * 60)


if __name__ == "__main__":
    test_calculation()