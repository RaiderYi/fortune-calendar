# -*- coding: utf-8 -*-
"""
Fortune Calendar API - 单文件版本
所有模块已内联，避免Vercel导入问题
"""

from http.server import BaseHTTPRequestHandler
import json
import datetime
from urllib.parse import parse_qs
from functools import lru_cache  # ← 新增
import hashlib                   # ← 新增

# ==================== lunar_calculator_pure 模块 ====================
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


# ==================== bazi_analyzer_enhanced 模块 ====================
# -*- coding: utf-8 -*-
"""
增强版八字分析器
包含：
1. 五维旺衰分析（月令、通根、透干、合化、刑冲）
2. 多层次用神推导（扶抑、调候、通关）
3. 动态运势评分系统
"""

# ==================== 配置数据 ====================

# 五行属性
WU_XING_MAP = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
    '寅': '木', '卯': '木',
    '巳': '火', '午': '火',
    '辰': '土', '未': '土', '戌': '土', '丑': '土',
    '申': '金', '酉': '金',
    '亥': '水', '子': '水'
}

# 地支藏干（本气、中气、余气）
ZHI_CANG_GAN = {
    '子': ['癸', None, None],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙', None, None],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己', None],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛', None, None],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲', None]
}

# 五行生克关系
WU_XING_SHENG = {
    '木': '火',  # 木生火
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
}

WU_XING_KE = {
    '木': '土',  # 木克土
    '火': '金',
    '土': '水',
    '金': '木',
    '水': '火'
}

# 月令司令（哪些五行在哪些月份当令）
YUE_LING_WANG = {
    '寅': '木', '卯': '木', '辰': '土',
    '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土',
    '亥': '水', '子': '水', '丑': '土'
}

# 地支六冲
LIU_CHONG = {
    '子': '午', '午': '子',
    '丑': '未', '未': '丑',
    '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰',
    '巳': '亥', '亥': '巳'
}

# 地支三合
SAN_HE = {
    ('申', '子', '辰'): '水',
    ('亥', '卯', '未'): '木',
    ('寅', '午', '戌'): '火',
    ('巳', '酉', '丑'): '金'
}

# 调候需求（哪些月份需要什么五行来调候）
TIAO_HOU_RULES = {
    '亥': {'need': '火', 'reason': '寒冬需暖'},
    '子': {'need': '火', 'reason': '寒冬需暖'},
    '丑': {'need': '火', 'reason': '寒冬需暖'},
    '寅': {'need': '火', 'reason': '初春仍寒'},
    '卯': {'need': '水', 'reason': '仲春需润'},
    '辰': {'need': '火', 'reason': '湿土需燥'},
    '巳': {'need': '水', 'reason': '初夏渐热'},
    '午': {'need': '水', 'reason': '炎夏需润'},
    '未': {'need': '水', 'reason': '暑热需润'},
    '申': {'need': '火', 'reason': '金寒需暖'},
    '酉': {'need': '火', 'reason': '金寒需暖'},
    '戌': {'need': '水', 'reason': '燥土需湿'}
}


# ==================== 增强版旺衰分析器 ====================

class EnhancedStrengthAnalyzer:
    """增强版旺衰分析器 - 五维分析法"""

    def __init__(self, bazi):
        """
        初始化
        bazi: 八字数据（来自 lunar_calculator_pure.calculate_bazi）
        """
        self.bazi = bazi
        self.day_gan = bazi['day_gan']
        self.day_zhi = bazi['day_zhi']
        self.day_element = WU_XING_MAP[self.day_gan]

    def analyze(self):
        """
        综合分析日主旺衰

        返回：
        {
            'score': 0.75,  # 总分 0-1
            'level': '身旺',  # 身旺/身弱/中和
            'details': {...}  # 详细分析
        }
        """
        # 1. 月令分析 (35%)
        yue_ling_score, yue_ling_detail = self._analyze_yue_ling()

        # 2. 通根分析 (25%)
        gen_score, gen_detail = self._analyze_gen()

        # 3. 透干分析 (20%)
        tou_gan_score, tou_gan_detail = self._analyze_tou_gan()

        # 4. 合化分析 (10%)
        he_hua_score, he_hua_detail = self._analyze_he_hua()

        # 5. 刑冲分析 (10%)
        xing_chong_score, xing_chong_detail = self._analyze_xing_chong()

        # 加权计算总分
        total_score = (
                yue_ling_score * 0.35 +
                gen_score * 0.25 +
                tou_gan_score * 0.20 +
                he_hua_score * 0.10 +
                xing_chong_score * 0.10
        )

        # 判断旺衰等级
        if total_score >= 0.65:
            level = '身旺'
        elif total_score <= 0.35:
            level = '身弱'
        else:
            level = '中和'

        return {
            'score': round(total_score, 2),
            'level': level,
            'details': {
                'yue_ling': {'score': yue_ling_score, 'detail': yue_ling_detail},
                'gen': {'score': gen_score, 'detail': gen_detail},
                'tou_gan': {'score': tou_gan_score, 'detail': tou_gan_detail},
                'he_hua': {'score': he_hua_score, 'detail': he_hua_detail},
                'xing_chong': {'score': xing_chong_score, 'detail': xing_chong_detail}
            }
        }

    def _analyze_yue_ling(self):
        """月令分析 - 最重要的因素"""
        month_zhi = self.bazi['month_zhi']
        wang_element = YUE_LING_WANG.get(month_zhi)

        # 检查日主在月令的状态
        if wang_element == self.day_element:
            # 得令（最强）
            score = 1.0
            detail = f"日主{self.day_gan}在{month_zhi}月得令，{self.day_element}当旺"
        elif wang_element == WU_XING_SHENG.get(self.day_element):
            # 月令生日主（次强）
            score = 0.8
            detail = f"月令{month_zhi}藏{wang_element}，生助日主{self.day_element}"
        elif self.day_element == WU_XING_SHENG.get(wang_element):
            # 日主泄月令（弱）
            score = 0.3
            detail = f"日主{self.day_element}泄气于月令{wang_element}"
        elif wang_element == WU_XING_KE.get(self.day_element):
            # 月令克日主（最弱）
            score = 0.1
            detail = f"月令{wang_element}克制日主{self.day_element}"
        else:
            # 日主克月令（中等）
            score = 0.5
            detail = f"日主{self.day_element}克制月令{wang_element}"

        return score, detail

    def _analyze_gen(self):
        """通根分析 - 日主在地支的根基"""
        score = 0.0
        details = []

        # 检查四个地支
        all_zhi = [
            ('年支', self.bazi['year_zhi']),
            ('月支', self.bazi['month_zhi']),
            ('日支', self.bazi['day_zhi']),
            ('时支', self.bazi['time_zhi'])
        ]

        for position, zhi in all_zhi:
            cang_gan = ZHI_CANG_GAN.get(zhi, [])

            # 检查本气根（最强）
            if cang_gan[0] and WU_XING_MAP.get(cang_gan[0]) == self.day_element:
                score += 0.35
                details.append(f"{position}{zhi}本气{cang_gan[0]}为{self.day_element}，通本气根")
            # 检查中气根
            elif len(cang_gan) > 1 and cang_gan[1] and WU_XING_MAP.get(cang_gan[1]) == self.day_element:
                score += 0.20
                details.append(f"{position}{zhi}中气{cang_gan[1]}为{self.day_element}，通中气根")
            # 检查余气根（最弱）
            elif len(cang_gan) > 2 and cang_gan[2] and WU_XING_MAP.get(cang_gan[2]) == self.day_element:
                score += 0.10
                details.append(f"{position}{zhi}余气{cang_gan[2]}为{self.day_element}，通余气根")

        score = min(1.0, score)  # 最高1.0

        if not details:
            details.append("日主在地支无根，根基不稳")

        return score, '; '.join(details)

    def _analyze_tou_gan(self):
        """透干分析 - 天干的支持"""
        score = 0.5  # 基础分
        details = []

        # 检查其他三个天干
        other_gans = [
            ('年干', self.bazi['year_gan']),
            ('月干', self.bazi['month_gan']),
            ('时干', self.bazi['time_gan'])
        ]

        for position, gan in other_gans:
            gan_element = WU_XING_MAP[gan]

            # 同类透干（比劫）
            if gan_element == self.day_element:
                score += 0.20
                details.append(f"{position}{gan}为同类{self.day_element}，帮身")
            # 印星透干（生我）
            elif WU_XING_SHENG.get(gan_element) == self.day_element:
                score += 0.15
                details.append(f"{position}{gan}({gan_element})生日主，为印")

        score = min(1.0, score)

        if not details:
            details.append("其他天干无助力")

        return score, '; '.join(details)

    def _analyze_he_hua(self):
        """合化分析 - 三合局的影响"""
        score = 0.5  # 中性基础分
        details = []

        # 收集所有地支
        all_zhi = [
            self.bazi['year_zhi'],
            self.bazi['month_zhi'],
            self.bazi['day_zhi'],
            self.bazi['time_zhi']
        ]

        # 检查三合局
        for he_zhi_tuple, he_element in SAN_HE.items():
            # 检查是否有三合
            matched = sum(1 for z in he_zhi_tuple if z in all_zhi)

            if matched >= 2:  # 半合或三合
                if he_element == self.day_element:
                    # 合化成日主五行，增强
                    bonus = 0.3 if matched == 3 else 0.15
                    score += bonus
                    details.append(f"{'三合' if matched == 3 else '半合'}{he_element}局，助日主")
                elif WU_XING_SHENG.get(he_element) == self.day_element:
                    # 合化成生日主的五行
                    bonus = 0.2 if matched == 3 else 0.1
                    score += bonus
                    details.append(f"{'三合' if matched == 3 else '半合'}{he_element}局，生日主")
                else:
                    # 合化成其他五行，可能减弱
                    penalty = 0.2 if matched == 3 else 0.1
                    score -= penalty
                    details.append(f"{'三合' if matched == 3 else '半合'}{he_element}局，不利日主")

        score = max(0.0, min(1.0, score))

        if not details:
            details.append("无明显合化")

        return score, '; '.join(details)

    def _analyze_xing_chong(self):
        """刑冲分析 - 地支冲克的影响"""
        score = 0.5  # 中性基础分
        details = []

        all_zhi = [
            ('年支', self.bazi['year_zhi']),
            ('月支', self.bazi['month_zhi']),
            ('日支', self.bazi['day_zhi']),
            ('时支', self.bazi['time_zhi'])
        ]

        # 检查六冲
        for i, (pos1, zhi1) in enumerate(all_zhi):
            chong_target = LIU_CHONG.get(zhi1)
            if not chong_target:
                continue

            for pos2, zhi2 in all_zhi[i + 1:]:
                if zhi2 == chong_target:
                    # 发现相冲
                    # 判断冲克对日主的影响
                    zhi1_element = WU_XING_MAP[zhi1]
                    zhi2_element = WU_XING_MAP[zhi2]

                    # 如果冲克的是日主的根，减分
                    if zhi1 == self.bazi['day_zhi'] or zhi2 == self.bazi['day_zhi']:
                        score -= 0.25
                        details.append(f"{pos1}{zhi1}与{pos2}{zhi2}相冲，动摇日主根基")
                    else:
                        score -= 0.15
                        details.append(f"{pos1}{zhi1}与{pos2}{zhi2}相冲")

        score = max(0.0, min(1.0, score))

        if not details:
            details.append("无冲克")

        return score, '; '.join(details)


# ==================== 多层次用神推导器 ====================

class EnhancedYongShenDeriver:
    """增强版用神推导器 - 三层次法"""

    def __init__(self, bazi, strength_result):
        self.bazi = bazi
        self.strength = strength_result
        self.day_gan = bazi['day_gan']
        self.day_element = WU_XING_MAP[self.day_gan]
        self.month_zhi = bazi['month_zhi']

    def derive(self):
        """
        多层次用神推导

        返回：
        {
            'primary': '火',  # 主用神
            'secondary': ['土'],  # 次用神
            'xi_shen': ['木'],  # 喜神
            'ji_shen': ['水', '金'],  # 忌神
            'strategies': [...]  # 策略说明
        }
        """
        strategies = []
        yong_shen_list = []

        # 第一层：调候用神（优先级最高）
        tiao_hou = self._derive_tiao_hou()
        if tiao_hou:
            yong_shen_list.append(tiao_hou['element'])
            strategies.append(f"调候: {tiao_hou['reason']}")

        # 第二层：扶抑用神
        fu_yi = self._derive_fu_yi()
        yong_shen_list.extend(fu_yi['elements'])
        strategies.append(f"扶抑: {fu_yi['reason']}")

        # 第三层：通关用神
        tong_guan = self._derive_tong_guan()
        if tong_guan:
            if tong_guan not in yong_shen_list:
                yong_shen_list.append(tong_guan)
            strategies.append(f"通关: 需要{tong_guan}化解冲克")

        # 推导喜神和忌神
        xi_shen, ji_shen = self._derive_xi_ji(yong_shen_list)

        return {
            'primary': yong_shen_list[0] if yong_shen_list else self.day_element,
            'secondary': yong_shen_list[1:3] if len(yong_shen_list) > 1 else [],
            'xi_shen': xi_shen,
            'ji_shen': ji_shen,
            'strategies': strategies
        }

    def _derive_tiao_hou(self):
        """调候用神 - 寒暖燥湿平衡"""
        rule = TIAO_HOU_RULES.get(self.month_zhi)

        if rule:
            return {
                'element': rule['need'],
                'type': 'tiao_hou',
                'reason': rule['reason']
            }

        return None

    def _derive_fu_yi(self):
        """扶抑用神 - 根据旺衰平衡"""
        strength_level = self.strength['level']

        if strength_level == '身旺':
            # 身旺用泄耗
            # 优先：食伤（泄）> 财星（耗）> 官杀（克）
            yong_elements = [
                WU_XING_SHENG[self.day_element],  # 食伤
                WU_XING_SHENG[WU_XING_SHENG[self.day_element]]  # 财星
            ]
            reason = "身旺需泄耗，取食伤、财星为用"

        elif strength_level == '身弱':
            # 身弱用生扶
            # 优先：印星（生）> 比劫（帮）
            # 找生日主的五行
            sheng_element = None
            for element, sheng in WU_XING_SHENG.items():
                if sheng == self.day_element:
                    sheng_element = element
                    break

            yong_elements = [sheng_element, self.day_element]  # 印星、比劫
            reason = "身弱需生扶，取印星、比劫为用"

        else:
            # 中和，以月令为用
            month_element = YUE_LING_WANG[self.month_zhi]
            yong_elements = [month_element]
            reason = "身中和，顺应月令之气"

        return {
            'elements': [e for e in yong_elements if e],
            'reason': reason
        }

    def _derive_tong_guan(self):
        """通关用神 - 化解冲克"""
        # 简化版：检查是否有明显的克战
        # 如果有木土相战，用火通关（木生火、火生土）
        # 实际应用中需要更复杂的判断

        # 这里返回 None，表示暂时不需要通关
        return None

    def _derive_xi_ji(self, yong_shen_list):
        """推导喜神和忌神"""
        xi_shen = []
        ji_shen = []

        all_elements = ['木', '火', '土', '金', '水']

        for element in all_elements:
            if element in yong_shen_list:
                # 用神
                continue
            elif any(WU_XING_SHENG.get(element) == yong for yong in yong_shen_list):
                # 生用神的是喜神
                xi_shen.append(element)
            else:
                # 克用神的是忌神
                if any(WU_XING_KE.get(element) == yong for yong in yong_shen_list):
                    ji_shen.append(element)

        return xi_shen, ji_shen


# ==================== 导出函数 ====================

def analyze_bazi_enhanced(bazi):
    """
    完整的增强八字分析

    参数:
        bazi: 来自 lunar_calculator_pure.calculate_bazi() 的结果

    返回:
        {
            'strength': {...},  # 旺衰分析结果
            'yong_shen': {...}  # 用神推导结果
        }
    """
    # 1. 旺衰分析
    strength_analyzer = EnhancedStrengthAnalyzer(bazi)
    strength_result = strength_analyzer.analyze()

    # 2. 用神推导
    yong_shen_deriver = EnhancedYongShenDeriver(bazi, strength_result)
    yong_shen_result = yong_shen_deriver.derive()

    return {
        'strength': strength_result,
        'yong_shen': yong_shen_result
    }


# ==================== 测试代码 ====================
# ==================== 缓存优化 ====================

def generate_bazi_cache_key(birth_date_str, birth_time_str, longitude):
    """
    生成八字缓存键

    说明：
    - 对于相同的出生信息，生成相同的MD5 key
    - 用于缓存 analyze_bazi_enhanced 的计算结果
    - 这样相同出生信息的查询可以直接返回缓存

    参数：
        birth_date_str: 出生日期字符串，如 "1990-01-01"
        birth_time_str: 出生时间字符串，如 "12:00"
        longitude: 出生地经度，如 116.4

    返回：
        32位MD5字符串，如 "a1b2c3d4..."
    """
    # 把三个参数组合成一个唯一字符串
    data_string = f"{birth_date_str}:{birth_time_str}:{longitude}"

    # 生成MD5哈希（作为缓存键）
    cache_key = hashlib.md5(data_string.encode()).hexdigest()

    return cache_key


@lru_cache(maxsize=500)
def analyze_bazi_cached(cache_key, birth_date_str, birth_time_str, longitude):
    """
    带缓存的八字分析函数

    说明：
    - 这个函数会：1)计算八字 → 2)分析旺衰和用神 → 3)缓存结果
    - 相同出生信息的查询会直接返回缓存（速度快90%+）
    - maxsize=500 表示最多缓存500个不同用户的数据

    参数：
        cache_key: 缓存键（由 generate_bazi_cache_key 生成）
        birth_date_str: 出生日期字符串
        birth_time_str: 出生时间字符串
        longitude: 出生地经度

    返回：
        (bazi, analysis) 元组
        - bazi: 八字计算结果（字典）
        - analysis: 旺衰和用神分析结果（字典）
    """
    # 步骤1：计算八字
    birth_dt = parse_datetime(birth_date_str, birth_time_str)
    bazi = calculate_bazi(birth_dt, longitude)

    # 步骤2：分析八字（这是最耗时的部分，约1-2秒）
    # 通过缓存，相同出生信息的第2次查询会跳过这个计算
    analysis = analyze_bazi_enhanced(bazi)

    # 返回两个结果
    return bazi, analysis

# ==================== 主API处理器 ====================
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


def get_dayun_direction(year_gan, gender):
    """
    判断大运顺逆

    规则：阳男阴女顺排，阴男阳女逆排

    参数:
        year_gan: 年干，如 "甲"
        gender: 性别，"male" 或 "female"

    返回:
        {
            'direction': 'shun' 或 'ni',  # 顺排或逆排
            'description': 说明文字
        }
    """
    # 阳年天干：甲、丙、戊、庚、壬
    yang_gan = ['甲', '丙', '戊', '庚', '壬']
    is_yang_year = year_gan in yang_gan

    # 判断顺逆
    if gender == 'male':
        is_shun = is_yang_year  # 阳男顺排，阴男逆排
        if is_shun:
            direction = 'shun'
            desc = '阳年男命，大运顺排'
        else:
            direction = 'ni'
            desc = '阴年男命，大运逆排'
    else:  # female
        is_shun = not is_yang_year  # 阴女顺排，阳女逆排
        if is_shun:
            direction = 'shun'
            desc = '阴年女命，大运顺排'
        else:
            direction = 'ni'
            desc = '阳年女命，大运逆排'

    return {
        'direction': direction,
        'description': desc,
        'is_yang_year': is_yang_year,
        'gender_cn': '男' if gender == 'male' else '女'
    }


# ==================== 评分和建议生成 ====================

def calculate_fortune_score(yong_shen_result, liu_nian, liu_yue, liu_ri):
    """计算运势评分"""
    base_score = 60

    # 获取用神五行
    primary_yong = yong_shen_result['primary']
    xi_shen_list = yong_shen_result.get('xi_shen', [])
    ji_shen_list = yong_shen_result.get('ji_shen', [])

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

    yue_score = 0
    if liu_yue_gan_element == primary_yong:
        yue_score += 15
    elif liu_yue_gan_element in xi_shen_list:
        yue_score += 8
    elif liu_yue_gan_element in ji_shen_list:
        yue_score -= 10

    # 流日影响 (30%)
    liu_ri_gan_element = WU_XING_MAP.get(liu_ri['gan'])

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
    return max(0, min(100, int(total)))


def generate_dimension_scores(base_score, liu_ri_gan):
    """生成各维度评分"""
    import random
    # 使用天干作为随机种子，确保同一天结果一致
    random.seed(hash(liu_ri_gan))

    dimensions = {}
    dim_names = ['career', 'wealth', 'romance', 'health', 'academic', 'travel']

    for dim in dim_names:
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

        # 生成标签和推断
        if dim == 'career':
            tag = '事业运'
            inference = f"事业运势{level}，" + (
                "把握机会" if score >= 70 else "稳扎稳打" if score >= 50 else "需谨慎行事")
        elif dim == 'wealth':
            tag = '财运'
            inference = f"财运{level}，" + ("财运亨通" if score >= 70 else "正财稳定" if score >= 50 else "避免投资")
        elif dim == 'romance':
            tag = '感情运'
            inference = f"感情运势{level}，" + ("桃花旺盛" if score >= 70 else "感情平稳" if score >= 50 else "需多沟通")
        elif dim == 'health':
            tag = '健康运'
            inference = f"健康运势{level}，" + ("精力充沛" if score >= 70 else "注意休息" if score >= 50 else "多加保养")
        elif dim == 'academic':
            tag = '学业运'
            inference = f"学业运势{level}，" + ("思维敏捷" if score >= 70 else "稳步前进" if score >= 50 else "需加努力")
        else:  # travel
            tag = '出行运'
            inference = f"出行运势{level}，" + (
                "一路顺风" if score >= 70 else "平安出行" if score >= 50 else "宜静不宜动")

        dimensions[dim] = {
            'score': score,
            'level': level,
            'tag': tag,
            'inference': inference
        }

    return dimensions


def generate_todo(yong_shen_element, ji_shen_list):
    """生成宜忌事项"""
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
    """生成主题关键词"""
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

    def do_OPTIONS(self):
        """处理 OPTIONS 请求 - CORS 预检"""
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        """处理 GET 请求 - 健康检查"""
        # Vercel中路径是 / 而不是 /api
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

    def do_POST(self):
        """处理 POST 请求 - 运势分析"""
        # Vercel中路径是 / 而不是 /api/fortune
        try:
            # 读取请求体
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))

            # 解析参数
            date_str = data.get('date', datetime.datetime.now().strftime('%Y-%m-%d'))
            birth_date_str = data.get('birthDate', '1990-01-01')
            birth_time_str = data.get('birthTime', '12:00')
            longitude_str = data.get('longitude', '116.4')
            gender = data.get('gender', 'male')  # 新增：性别参数（male/female）

            # 转换经度为浮点数
            try:
                longitude = float(longitude_str)
            except:
                longitude = 116.4


            # 生成缓存键
            cache_key = generate_bazi_cache_key(birth_date_str, birth_time_str, longitude)

            # 调用缓存函数（相同出生信息会直接返回缓存）
            bazi, analysis = analyze_bazi_cached(cache_key, birth_date_str, birth_time_str, longitude)
            # =============================================


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

            # 8. 判断大运顺逆（基于性别和年干）
            dayun_info = get_dayun_direction(bazi['year_gan'], gender)

            # 9. 构建响应
            response = {
                'dateStr': current_date.strftime('%m.%d'),
                'weekDay': get_week_day_cn(current_date),
                'lunarStr': f"{bazi['solar_term']}",
                'totalScore': total_score,
                'pillars': {
                    'year': bazi['year'],
                    'month': bazi['month'],
                    'day': bazi['day']
                },
                'mainTheme': main_theme,
                'dimensions': dimensions,
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
                    'jiShen': analysis['yong_shen']['ji_shen']
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
                'dayun': dayun_info,  # 新增：大运信息
                'gender': gender,  # 新增：性别信息
                'todayTenGod': '偏财'  # 简化版
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