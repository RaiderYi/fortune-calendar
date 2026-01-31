# -*- coding: utf-8 -*-
"""
节气计算器
提供节气日期查询、当前节气判断等功能
"""

from datetime import date
from typing import Tuple, Optional

from api.data.constants.solar_terms import (
    SOLAR_TERMS,
    SOLAR_TERM_TABLE,
    DEFAULT_TERM_DATES,
    TERM_INDEX_TO_MONTH_ZHI,
    get_term_name
)


class SolarTermProvider:
    """节气计算提供器"""
    
    def get_term_date(self, year: int, term_name: str) -> date:
        """
        获取指定年份某节气的日期
        
        Args:
            year: 年份
            term_name: 节气名称，如 "立春"
        
        Returns:
            节气日期
        """
        term_index = SOLAR_TERMS.index(term_name)
        month, day = self._get_term_month_day(year, term_index)
        return date(year, month, day)
    
    def get_term_date_by_index(self, year: int, term_index: int) -> date:
        """
        获取指定年份某索引节气的日期
        
        Args:
            year: 年份
            term_index: 节气索引 (0-23)
        
        Returns:
            节气日期
        """
        month, day = self._get_term_month_day(year, term_index)
        return date(year, month, day)
    
    def get_current_term(self, d: date) -> Tuple[str, int]:
        """
        获取指定日期所在的节气
        
        Args:
            d: 日期
        
        Returns:
            (节气名称, 节气索引)
        """
        year = d.year
        month = d.month
        day = d.day
        
        # 从后往前遍历，找到最近的已过节气
        for i in range(23, -1, -1):
            term_month, term_day = self._get_term_month_day(year, i)
            
            if month > term_month or (month == term_month and day >= term_day):
                return get_term_name(i), i
        
        # 如果在当年第一个节气之前，返回上一年的冬至
        return get_term_name(23), 23
    
    def get_current_term_name(self, d: date) -> str:
        """获取当前节气名称"""
        name, _ = self.get_current_term(d)
        return name
    
    def get_current_term_index(self, d: date) -> int:
        """获取当前节气索引"""
        _, index = self.get_current_term(d)
        return index
    
    def get_month_zhi_index(self, d: date) -> int:
        """
        获取日期对应的月支索引
        
        根据节气划分月份，非公历月份
        """
        term_index = self.get_current_term_index(d)
        return TERM_INDEX_TO_MONTH_ZHI.get(term_index, 0)
    
    def is_before_lichun(self, d: date) -> bool:
        """
        判断日期是否在立春之前
        
        用于年柱计算（立春换年）
        """
        lichun_date = self.get_term_date(d.year, "立春")
        return d < lichun_date
    
    def _get_term_month_day(self, year: int, term_index: int) -> Tuple[int, int]:
        """
        获取节气的月日
        
        优先使用精确数据表，否则使用默认值
        """
        if year in SOLAR_TERM_TABLE:
            return SOLAR_TERM_TABLE[year][term_index]
        
        # 使用默认值（可能有±1天误差）
        return DEFAULT_TERM_DATES[term_index]
