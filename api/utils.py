# -*- coding: utf-8 -*-
"""
八字命理工具函数
提供通用的辅助函数
"""

from lunar_python import Solar, Lunar
import datetime
from config import (
    TIAN_GAN, DI_ZHI, GAN_WU_XING, ZHI_WU_XING,
    WU_XING_SHENG, WU_XING_KE, WU_XING_BEI_SHENG, WU_XING_BEI_KE,
    SHI_SHEN, DI_ZHI_SAN_HE, DI_ZHI_LIU_HE, DI_ZHI_LIU_CHONG,
    DI_ZHI_LIU_HAI, YUE_LING_JI_JIE, YUE_LING_WANG_XIANG
)


def adjust_time_for_longitude(solar_time, longitude):
    """
    根据经度调整为真太阳时
    中国标准时间基准经度为东经120度
    公式: 时差(分钟) = (当地经度 - 120) * 4
    """
    time_diff_minutes = (longitude - 120) * 4
    adjusted_time = solar_time + datetime.timedelta(minutes=time_diff_minutes)
    return adjusted_time


def get_solar_from_birth(birth_date_str, birth_time_str, longitude):
    """
    从出生信息获取Solar对象（已调整真太阳时）
    """
    try:
        b_year, b_month, b_day = map(int, birth_date_str.split('-'))
        b_hour, b_minute = map(int, birth_time_str.split(':'))

        birth_datetime = datetime.datetime(b_year, b_month, b_day, b_hour, b_minute, 0)
        adjusted_birth = adjust_time_for_longitude(birth_datetime, longitude)

        return Solar.fromYmdHms(
            adjusted_birth.year,
            adjusted_birth.month,
            adjusted_birth.day,
            adjusted_birth.hour,
            adjusted_birth.minute,
            0
        )
    except Exception as e:
        print(f"出生时间解析错误: {e}")
        return Solar.fromYmdHms(1995, 8, 15, 9, 30, 0)


def get_gan_zhi_from_solar(solar):
    """
    从Solar对象获取干支信息
    """
    lunar = solar.getLunar()
    eight_char = lunar.getEightChar()

    return {
        "year": eight_char.getYear(),
        "month": eight_char.getMonth(),
        "day": eight_char.getDay(),
        "hour": eight_char.getTime(),
        "year_gan": eight_char.getYearGan(),
        "year_zhi": eight_char.getYearZhi(),
        "month_gan": eight_char.getMonthGan(),
        "month_zhi": eight_char.getMonthZhi(),
        "day_gan": eight_char.getDayGan(),
        "day_zhi": eight_char.getDayZhi(),
        "time_gan": eight_char.getTimeGan(),
        "time_zhi": eight_char.getTimeZhi()
    }


def get_wu_xing(gan_or_zhi):
    """
    获取天干或地支的五行属性
    """
    if gan_or_zhi in GAN_WU_XING:
        return GAN_WU_XING[gan_or_zhi]
    elif gan_or_zhi in ZHI_WU_XING:
        return ZHI_WU_XING[gan_or_zhi]
    return None


def calculate_ten_god(day_gan, target_gan):
    """
    计算十神
    根据日主天干和目标天干的关系确定十神
    """
    day_idx = TIAN_GAN.index(day_gan)
    target_idx = TIAN_GAN.index(target_gan)
    diff = (target_idx - day_idx) % 10

    return SHI_SHEN[diff]


def check_sheng_ke(element1, element2):
    """
    检查两个五行的生克关系
    返回: "生", "克", "被生", "被克", "无关系"
    """
    if WU_XING_SHENG.get(element1) == element2:
        return "生"
    elif WU_XING_KE.get(element1) == element2:
        return "克"
    elif WU_XING_BEI_SHENG.get(element1) == element2:
        return "被生"
    elif WU_XING_BEI_KE.get(element1) == element2:
        return "被克"
    else:
        return "无关系"


def check_zhi_he_chong(zhi1, zhi2):
    """
    检查地支的合冲关系
    返回: (关系类型, 结果)
    """
    # 检查六合
    key1 = zhi1 + zhi2
    key2 = zhi2 + zhi1
    if key1 in DI_ZHI_LIU_HE:
        return ("六合", DI_ZHI_LIU_HE[key1])
    elif key2 in DI_ZHI_LIU_HE:
        return ("六合", DI_ZHI_LIU_HE[key2])

    # 检查六冲
    if key1 in DI_ZHI_LIU_CHONG:
        return ("六冲", "冲")
    elif key2 in DI_ZHI_LIU_CHONG:
        return ("六冲", "冲")

    # 检查六害
    if key1 in DI_ZHI_LIU_HAI:
        return ("六害", "害")
    elif key2 in DI_ZHI_LIU_HAI:
        return ("六害", "害")

    return ("无关系", None)


def get_yue_ling_wang_xiang(month_zhi, element):
    """
    获取某五行在月令中的旺相休囚死状态
    """
    season = YUE_LING_JI_JIE.get(month_zhi, "春季")
    wang_xiang = YUE_LING_WANG_XIANG.get(season, YUE_LING_WANG_XIANG["春季"])

    for state, elem in wang_xiang.items():
        if elem == element:
            return state

    return "未知"


def count_wu_xing_in_bazi(bazi_gan_zhi):
    """
    统计八字中的五行数量
    bazi_gan_zhi: 包含年月日时天干地支的字典
    """
    elements = []

    # 统计天干五行
    for gan in [bazi_gan_zhi["year_gan"], bazi_gan_zhi["month_gan"],
                bazi_gan_zhi["day_gan"], bazi_gan_zhi["time_gan"]]:
        elem = get_wu_xing(gan)
        if elem:
            elements.append(elem)

    # 统计地支五行
    for zhi in [bazi_gan_zhi["year_zhi"], bazi_gan_zhi["month_zhi"],
                bazi_gan_zhi["day_zhi"], bazi_gan_zhi["time_zhi"]]:
        elem = get_wu_xing(zhi)
        if elem:
            elements.append(elem)

    # 统计各五行数量
    element_count = {"木": 0, "火": 0, "土": 0, "金": 0, "水": 0}
    for elem in elements:
        element_count[elem] += 1

    return element_count


def get_liu_nian_liu_yue_liu_ri(target_solar):
    """
    获取流年、流月、流日的干支
    """
    lunar = target_solar.getLunar()
    eight_char = lunar.getEightChar()

    return {
        "year": eight_char.getYear(),
        "month": eight_char.getMonth(),
        "day": eight_char.getDay(),
        "year_gan": eight_char.getYearGan(),
        "year_zhi": eight_char.getYearZhi(),
        "month_gan": eight_char.getMonthGan(),
        "month_zhi": eight_char.getMonthZhi(),
        "day_gan": eight_char.getDayGan(),
        "day_zhi": eight_char.getDayZhi()
    }


def format_score(score):
    """
    格式化分数，确保在0-100之间
    """
    return max(0, min(100, int(score)))


def get_level_from_score(score):
    """
    根据分数获取等级
    """
    if score >= 80:
        return "吉"
    elif score >= 60:
        return "平"
    else:
        return "凶"


def get_tag_from_score(score, dimension):
    """
    根据分数和维度获取标签
    """
    tags = {
        "career": {
            "high": "事业腾飞", "mid": "稳中有升", "low": "需谨慎"
        },
        "wealth": {
            "high": "财运亨通", "mid": "正财得地", "low": "财运平平"
        },
        "romance": {
            "high": "桃花运旺", "mid": "平平淡淡", "low": "感情波折"
        },
        "health": {
            "high": "神清气爽", "mid": "注意休息", "low": "身体欠安"
        },
        "academic": {
            "high": "文昌显现", "mid": "学业顺利", "low": "需加把劲"
        },
        "travel": {
            "high": "出行顺利", "mid": "平安出行", "low": "宜静不宜动"
        }
    }

    dim_tags = tags.get(dimension, {})
    if score >= 80:
        return dim_tags.get("high", "吉")
    elif score >= 60:
        return dim_tags.get("mid", "平")
    else:
        return dim_tags.get("low", "凶")


def get_inference_from_score(score, dimension, ten_god=None):
    """
    根据分数、维度和十神生成推论
    """
    inferences = {
        "career": {
            "high": f"{ten_god or '官杀'}得力,利于职场晋升和事业发展。",
            "mid": "工作稳定,稳步前进,适合积累经验。",
            "low": "职场压力较大,需谨慎应对,避免冲动。"
        },
        "wealth": {
            "high": f"{ten_god or '财星'}得地,财运亨通,适合投资理财。",
            "mid": "正财稳定,辛苦钱稳赚,偏财勿念。",
            "low": "财运平平,不宜冒险投资,保守为佳。"
        },
        "romance": {
            "high": "桃花旺盛,感情运势佳,利于表白和约会。",
            "mid": "感情平淡,多关注伴侣情绪,增进感情。",
            "low": "感情容易波动,需多沟通,避免争吵。"
        },
        "health": {
            "high": "五行流通,身体倍儿棒,精力充沛。",
            "mid": "身体尚可,注意劳逸结合,适度锻炼。",
            "low": "身体欠安,注意休息,避免过度劳累。"
        },
        "academic": {
            "high": "头脑清晰,思维敏捷,适合学习和考试。",
            "mid": "学业顺利,稳步前进,保持专注。",
            "low": "注意力不集中,需调整状态,多加努力。"
        },
        "travel": {
            "high": "出行顺利,利于出差、旅游和社交。",
            "mid": "平安出行,注意交通安全,顺利到达。",
            "low": "出行容易受阻,宜静不宜动,推迟行程。"
        }
    }

    dim_inferences = inferences.get(dimension, {})
    if score >= 80:
        return dim_inferences.get("high", "运势较好")
    elif score >= 60:
        return dim_inferences.get("mid", "运势平稳")
    else:
        return dim_inferences.get("low", "运势欠佳")


def get_yi_ji_suggestion(yong_shen, xi_shen, ji_shen, current_elements):
    """
    根据用神喜忌和当前五行生成宜忌建议
    """
    from config import YI_JI_ACTIVITIES

    yi_activities = []
    ji_activities = []

    # 根据用神推荐活动
    for element in yong_shen:
        if element in YI_JI_ACTIVITIES:
            yi_activities.extend(YI_JI_ACTIVITIES[element]["yi"])

    # 根据喜神推荐活动
    for element in xi_shen:
        if element in YI_JI_ACTIVITIES:
            yi_activities.extend(YI_JI_ACTIVITIES[element]["yi"])

    # 根据忌神提醒避免
    for element in ji_shen:
        if element in YI_JI_ACTIVITIES:
            ji_activities.extend(YI_JI_ACTIVITIES[element]["ji"])

    # 去重并限制数量
    yi_list = list(set(yi_activities))[:3]
    ji_list = list(set(ji_activities))[:3]

    return {
        "yi": yi_list if yi_list else ["保持平和心态", "适度活动"],
        "ji": ji_list if ji_list else ["冲动行事", "过度劳累"]
    }
