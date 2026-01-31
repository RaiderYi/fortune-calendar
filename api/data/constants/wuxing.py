# -*- coding: utf-8 -*-
"""
五行相关常量
包含五行列表、生克关系等核心数据
"""

# 五行列表
WU_XING = ["木", "火", "土", "金", "水"]

# 五行相生关系
# 木生火、火生土、土生金、金生水、水生木
WU_XING_SHENG = {
    "木": "火",
    "火": "土",
    "土": "金",
    "金": "水",
    "水": "木"
}

# 五行相克关系
# 木克土、土克水、水克火、火克金、金克木
WU_XING_KE = {
    "木": "土",
    "土": "水",
    "水": "火",
    "火": "金",
    "金": "木"
}

# 五行被生关系（谁生我）
WU_XING_BEI_SHENG = {
    "木": "水",  # 水生木
    "火": "木",  # 木生火
    "土": "火",  # 火生土
    "金": "土",  # 土生金
    "水": "金"   # 金生水
}

# 五行被克关系（谁克我）
WU_XING_BEI_KE = {
    "木": "金",  # 金克木
    "火": "水",  # 水克火
    "土": "木",  # 木克土
    "金": "火",  # 火克金
    "水": "土"   # 土克水
}

# 五行颜色映射
WU_XING_COLOR = {
    "木": "green",
    "火": "red",
    "土": "yellow",
    "金": "white",
    "水": "black"
}

# 五行方位映射
WU_XING_DIRECTION = {
    "木": "东",
    "火": "南",
    "土": "中",
    "金": "西",
    "水": "北"
}

# 五行季节映射
WU_XING_SEASON = {
    "木": "春",
    "火": "夏",
    "土": "四季",  # 辰戌丑未月
    "金": "秋",
    "水": "冬"
}

# 月令旺相（每个季节五行的旺衰状态）
# 旺 > 相 > 休 > 囚 > 死
YUE_LING_WANG_XIANG = {
    "春": {"旺": "木", "相": "火", "休": "水", "囚": "金", "死": "土"},
    "夏": {"旺": "火", "相": "土", "休": "木", "囚": "水", "死": "金"},
    "秋": {"旺": "金", "相": "水", "休": "土", "囚": "火", "死": "木"},
    "冬": {"旺": "水", "相": "木", "休": "金", "囚": "土", "死": "火"},
    "四季": {"旺": "土", "相": "金", "休": "火", "囚": "木", "死": "水"}
}


def get_sheng_element(element: str) -> str:
    """获取我生的五行"""
    return WU_XING_SHENG.get(element)


def get_ke_element(element: str) -> str:
    """获取我克的五行"""
    return WU_XING_KE.get(element)


def get_bei_sheng_element(element: str) -> str:
    """获取生我的五行"""
    return WU_XING_BEI_SHENG.get(element)


def get_bei_ke_element(element: str) -> str:
    """获取克我的五行"""
    return WU_XING_BEI_KE.get(element)


def check_relation(element1: str, element2: str) -> str:
    """
    检查两个五行的关系
    
    返回:
        "同我": 同一五行
        "我生": element1生element2
        "生我": element2生element1
        "我克": element1克element2
        "克我": element2克element1
    """
    if element1 == element2:
        return "同我"
    if WU_XING_SHENG.get(element1) == element2:
        return "我生"
    if WU_XING_SHENG.get(element2) == element1:
        return "生我"
    if WU_XING_KE.get(element1) == element2:
        return "我克"
    if WU_XING_KE.get(element2) == element1:
        return "克我"
    return "无关"


def get_wang_xiang_state(season: str, element: str) -> str:
    """
    获取某五行在某季节的旺衰状态
    
    Args:
        season: 季节（春、夏、秋、冬、四季）
        element: 五行
    
    Returns:
        状态（旺、相、休、囚、死）
    """
    season_config = YUE_LING_WANG_XIANG.get(season, {})
    for state, elem in season_config.items():
        if elem == element:
            return state
    return "未知"
