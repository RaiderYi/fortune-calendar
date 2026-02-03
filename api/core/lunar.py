# -*- coding: utf-8 -*-
"""
历法计算模块
包含：农历、节气、真太阳时、干支计算
"""

import datetime
from .constants import (
    TIAN_GAN, DI_ZHI, SOLAR_TERMS, SOLAR_TERM_TABLE
)


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


def get_solar_term_for_year(year, term_index):
    """
    获取某年某个节气的日期

    参数:
        year: 年份
        term_index: 节气索引 0-23 (0=小寒, 2=立春, ...)

    返回:
        (月, 日)
    """
    # 如果有精确数据表，使用表
    if year in SOLAR_TERM_TABLE:
        month, day = SOLAR_TERM_TABLE[year][term_index]
        return month, day

    # 否则使用近似算法
    base_year = 2025
    if base_year in SOLAR_TERM_TABLE:
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
    基准：1900年1月1日 = 甲戌日（六十甲子序号10，从0开始计数）
    """
    # 使用1900年1月1日作为基准，这一天是甲戌日（序号10）
    base_date = datetime.date(1900, 1, 1)
    target_date = datetime.date(year, month, day)

    # 计算天数差
    days_diff = (target_date - base_date).days

    # 1900-01-01 是甲戌日（序号10，从0开始计数）
    # 计算目标日期的干支序号（0-59）
    gan_zhi_index = (10 + days_diff) % 60

    # get_gan_zhi_from_num 使用1-60，所以加1转换
    gan_zhi_num = gan_zhi_index + 1

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
        'solar_term_index': term_index
        # 注意：不包含 datetime 对象，避免 JSON 序列化问题
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
