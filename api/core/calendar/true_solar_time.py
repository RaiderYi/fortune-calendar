# -*- coding: utf-8 -*-
"""
真太阳时计算模块
用于将北京时间转换为出生地的真太阳时
"""

from datetime import datetime, timedelta


def adjust_true_solar_time(dt: datetime, longitude: float) -> datetime:
    """
    真太阳时校准
    
    中国标准时间（北京时间）基于东经120度
    真太阳时需要根据出生地经度进行调整
    
    公式: 时差(分钟) = (当地经度 - 120) × 4
    
    Args:
        dt: 北京时间
        longitude: 出生地东经度数（如北京 116.4，上海 121.5）
    
    Returns:
        调整后的真太阳时
    
    Examples:
        >>> adjust_true_solar_time(datetime(2025, 1, 1, 12, 0), 116.4)
        datetime(2025, 1, 1, 11, 45, 36)  # 北京比东经120度慢约14分钟
    """
    # 计算时差（分钟）
    # 东经120度以东的地方时间更早，以西的地方时间更晚
    diff_minutes = (longitude - 120.0) * 4
    
    return dt + timedelta(minutes=diff_minutes)


def get_local_solar_time_diff(longitude: float) -> float:
    """
    获取与北京时间的时差（分钟）
    
    Args:
        longitude: 东经度数
    
    Returns:
        时差分钟数（正数表示比北京时间早，负数表示比北京时间晚）
    """
    return (longitude - 120.0) * 4
