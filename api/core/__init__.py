# -*- coding: utf-8 -*-
"""
核心算法包

包含：
- calendar: 干支历法计算
- analysis: 命理分析（旺衰、用神、十神）
- scoring: 运势评分算法
"""

from .calendar import (
    GanZhi,
    BaziPillars,
    GanZhiCalculator,
    SolarTermProvider,
    calculate_bazi,
    calculate_day_ganzhi
)

__all__ = [
    'GanZhi',
    'BaziPillars',
    'GanZhiCalculator',
    'SolarTermProvider',
    'calculate_bazi',
    'calculate_day_ganzhi'
]
