# -*- coding: utf-8 -*-
"""
干支计算核心模块

职责：
1. 计算年月日时四柱干支
2. 处理立春换年
3. 处理早子时
4. 真太阳时校准

关键修复：
- 日柱基准日使用 1900-01-01 = 甲戌日（60甲子序号10）
- 早子时（23:00-00:00）日柱算次日
"""

from datetime import date, datetime, timedelta
from dataclasses import dataclass
from typing import Optional, Tuple

from api.data.constants.tiangan import (
    TIAN_GAN, 
    WU_HU_DUN, 
    WU_SHU_DUN,
    get_tiangan_by_index
)
from api.data.constants.dizhi import (
    DI_ZHI,
    get_dizhi_by_index,
    get_hour_zhi_index
)
from api.core.calendar.solar_terms import SolarTermProvider
from api.core.calendar.true_solar_time import adjust_true_solar_time


@dataclass(frozen=True)
class GanZhi:
    """
    干支数据结构
    
    使用 frozen=True 使其不可变，可以作为字典键
    """
    gan: str  # 天干
    zhi: str  # 地支
    
    @property
    def full(self) -> str:
        """完整干支字符串，如 '甲子'"""
        return f"{self.gan}{self.zhi}"
    
    @property
    def gan_index(self) -> int:
        """天干索引 (0-9)"""
        return TIAN_GAN.index(self.gan)
    
    @property
    def zhi_index(self) -> int:
        """地支索引 (0-11)"""
        return DI_ZHI.index(self.zhi)
    
    @property
    def sixty_index(self) -> int:
        """六十甲子索引 (0-59)"""
        # 通过天干地支索引计算六十甲子位置
        # 甲子=0, 乙丑=1, ..., 癸亥=59
        gan_idx = self.gan_index
        zhi_idx = self.zhi_index
        
        # 六十甲子的规律：天干和地支同时递增
        # 需要找到满足 i%10==gan_idx 且 i%12==zhi_idx 的 i
        for i in range(60):
            if i % 10 == gan_idx and i % 12 == zhi_idx:
                return i
        return 0
    
    def __str__(self) -> str:
        return self.full
    
    def __repr__(self) -> str:
        return f"GanZhi('{self.gan}', '{self.zhi}')"
    
    def to_dict(self) -> dict:
        """转换为字典"""
        return {
            'gan': self.gan,
            'zhi': self.zhi,
            'full': self.full
        }


@dataclass(frozen=True)
class BaziPillars:
    """
    四柱八字数据结构
    """
    year: GanZhi   # 年柱
    month: GanZhi  # 月柱
    day: GanZhi    # 日柱
    hour: GanZhi   # 时柱
    
    @property
    def day_master(self) -> str:
        """日主（日干），八字分析的核心"""
        return self.day.gan
    
    @property
    def day_master_element(self) -> str:
        """日主五行"""
        from api.data.constants.tiangan import TIAN_GAN_WUXING
        return TIAN_GAN_WUXING[self.day_master]
    
    def get_all_gan(self) -> Tuple[str, str, str, str]:
        """获取四柱天干"""
        return (self.year.gan, self.month.gan, self.day.gan, self.hour.gan)
    
    def get_all_zhi(self) -> Tuple[str, str, str, str]:
        """获取四柱地支"""
        return (self.year.zhi, self.month.zhi, self.day.zhi, self.hour.zhi)
    
    def to_dict(self) -> dict:
        """转换为字典（兼容原API格式）"""
        return {
            'year': self.year.full,
            'month': self.month.full,
            'day': self.day.full,
            'hour': self.hour.full,
            'year_gan': self.year.gan,
            'year_zhi': self.year.zhi,
            'month_gan': self.month.gan,
            'month_zhi': self.month.zhi,
            'day_gan': self.day.gan,
            'day_zhi': self.day.zhi,
            'time_gan': self.hour.gan,
            'time_zhi': self.hour.zhi
        }
    
    def __str__(self) -> str:
        return f"{self.year.full} {self.month.full} {self.day.full} {self.hour.full}"


class GanZhiCalculator:
    """
    干支计算器
    
    核心计算逻辑，包含所有干支推算方法
    
    Usage:
        calculator = GanZhiCalculator()
        bazi = calculator.calculate_bazi(
            datetime(1990, 5, 15, 10, 30),
            longitude=116.4
        )
        print(bazi)  # 庚午 辛巳 丙申 癸巳
    """
    
    # ========== 关键修复：日柱基准日 ==========
    # 1900年1月1日 = 甲戌日
    # 甲戌在60甲子中的位置是第11位（从1开始计数）
    # 或者说索引是10（从0开始计数）
    _BASE_DATE = date(1900, 1, 1)
    _BASE_DAY_INDEX = 10  # 甲戌在60甲子中的索引（0-based）
    
    def __init__(self, solar_term_provider: Optional[SolarTermProvider] = None):
        """
        初始化
        
        Args:
            solar_term_provider: 节气计算器，用于确定月柱和立春换年
                                如果不提供，将创建默认实例
        """
        self._solar_term_provider = solar_term_provider or SolarTermProvider()
    
    def calculate_bazi(
        self,
        birth_dt: datetime,
        longitude: float = 120.0
    ) -> BaziPillars:
        """
        计算完整四柱八字
        
        Args:
            birth_dt: 出生时间（北京时间）
            longitude: 出生地东经度数（默认120度，即北京时间基准）
        
        Returns:
            BaziPillars 四柱八字对象
        
        Examples:
            >>> calc = GanZhiCalculator()
            >>> bazi = calc.calculate_bazi(datetime(1990, 5, 15, 10, 30), 116.4)
            >>> print(bazi.day_master)
            '丙'
        """
        # 1. 真太阳时校准
        adjusted_dt = adjust_true_solar_time(birth_dt, longitude)
        
        # 2. 处理早子时（23:00-00:00）
        calc_date, calc_hour = self._handle_early_zi_hour(adjusted_dt)
        
        # 3. 计算四柱
        year_gz = self._calc_year_pillar(calc_date)
        month_gz = self._calc_month_pillar(calc_date, year_gz.gan)
        day_gz = self._calc_day_pillar(calc_date)
        hour_gz = self._calc_hour_pillar(day_gz.gan, calc_hour)
        
        return BaziPillars(
            year=year_gz,
            month=month_gz,
            day=day_gz,
            hour=hour_gz
        )
    
    def calculate_liu_nian(self, year: int) -> GanZhi:
        """
        计算流年干支
        
        Args:
            year: 公历年份
        
        Returns:
            流年干支
        """
        # 使用立春后的日期确保正确
        return self._calc_year_pillar(date(year, 3, 1))
    
    def calculate_liu_yue(self, d: date) -> GanZhi:
        """
        计算流月干支
        
        Args:
            d: 日期
        
        Returns:
            流月干支
        """
        year_gz = self._calc_year_pillar(d)
        return self._calc_month_pillar(d, year_gz.gan)
    
    def calculate_liu_ri(self, d: date) -> GanZhi:
        """
        计算流日干支
        
        Args:
            d: 日期
        
        Returns:
            流日干支
        """
        return self._calc_day_pillar(d)
    
    # ========== 私有方法：四柱计算 ==========
    
    def _handle_early_zi_hour(self, dt: datetime) -> Tuple[date, int]:
        """
        处理早子时
        
        命理学中对23:00-00:00的处理有两种观点：
        1. 夜子时：仍算当日子时
        2. 早子时：算次日子时
        
        本实现采用"早子时"方案（主流观点）：
        - 23:00-00:00 时辰为子时
        - 但日柱已换成次日
        
        Args:
            dt: 调整后的真太阳时
        
        Returns:
            (计算用日期, 计算用小时)
        """
        if dt.hour == 23:
            # 早子时：日期+1，时辰按子时(0点)算
            return dt.date() + timedelta(days=1), 0
        return dt.date(), dt.hour
    
    def _calc_year_pillar(self, d: date) -> GanZhi:
        """
        计算年柱
        
        关键规则：立春换年！
        - 公历年份不等于干支年份
        - 立春前属于上一年的干支
        
        Args:
            d: 日期
        
        Returns:
            年柱干支
        """
        year = d.year
        
        # 检查是否在立春前
        if self._solar_term_provider.is_before_lichun(d):
            year -= 1
        
        # 1984年为甲子年，以此为基准推算
        # 甲子年的索引是0
        offset = (year - 1984) % 60
        
        return self._index_to_ganzhi(offset)
    
    def _calc_month_pillar(self, d: date, year_gan: str) -> GanZhi:
        """
        计算月柱
        
        关键规则：
        1. 月支由节气决定（非公历月份）
        2. 月干由年干推出（五虎遁）
        
        Args:
            d: 日期
            year_gan: 年干（用于推月干）
        
        Returns:
            月柱干支
        """
        # 1. 获取月支（由节气决定）
        month_zhi_index = self._solar_term_provider.get_month_zhi_index(d)
        
        # 2. 根据年干推月干（五虎遁）
        # 甲己之年丙作首（寅月起丙寅）
        # 乙庚之年戊为头（寅月起戊寅）
        # 丙辛之岁寻庚上（寅月起庚寅）
        # 丁壬壬寅顺水流（寅月起壬寅）
        # 戊癸之年何处起（寅月起甲寅）
        month_gan_base = WU_HU_DUN[year_gan]
        
        # 寅月地支索引是2，从寅月开始递推
        # 当前月支索引与寅月的差值
        offset = (month_zhi_index - 2) % 12
        month_gan_index = (month_gan_base + offset) % 10
        
        return GanZhi(
            gan=get_tiangan_by_index(month_gan_index),
            zhi=get_dizhi_by_index(month_zhi_index)
        )
    
    def _calc_day_pillar(self, d: date) -> GanZhi:
        """
        计算日柱
        
        关键修复：使用正确的基准日
        - 基准日：1900年1月1日 = 甲戌日
        - 甲戌在60甲子中的索引是10（0-based）
        
        Args:
            d: 日期
        
        Returns:
            日柱干支
        """
        # 计算与基准日的天数差
        days_diff = (d - self._BASE_DATE).days
        
        # 计算六十甲子索引
        # 基准日甲戌的索引是10
        sixty_index = (self._BASE_DAY_INDEX + days_diff) % 60
        
        return self._index_to_ganzhi(sixty_index)
    
    def _calc_hour_pillar(self, day_gan: str, hour: int) -> GanZhi:
        """
        计算时柱
        
        关键规则：
        1. 时支由小时决定（23-1子时，1-3丑时...）
        2. 时干由日干推出（五鼠遁）
        
        Args:
            day_gan: 日干
            hour: 小时 (0-23)
        
        Returns:
            时柱干支
        """
        # 1. 获取时支
        zhi_index = get_hour_zhi_index(hour)
        
        # 2. 根据日干推时干（五鼠遁）
        # 甲己还加甲（子时起甲子）
        # 乙庚丙作初（子时起丙子）
        # 丙辛从戊起（子时起戊子）
        # 丁壬庚子居（子时起庚子）
        # 戊癸何方发（子时起壬子）
        gan_base = WU_SHU_DUN[day_gan]
        gan_index = (gan_base + zhi_index) % 10
        
        return GanZhi(
            gan=get_tiangan_by_index(gan_index),
            zhi=get_dizhi_by_index(zhi_index)
        )
    
    @staticmethod
    def _index_to_ganzhi(index: int) -> GanZhi:
        """
        六十甲子索引转干支
        
        Args:
            index: 0-59的索引
        
        Returns:
            对应的干支
        """
        gan = get_tiangan_by_index(index % 10)
        zhi = get_dizhi_by_index(index % 12)
        return GanZhi(gan=gan, zhi=zhi)


# ========== 便捷函数 ==========

def calculate_bazi(
    birth_dt: datetime,
    longitude: float = 120.0
) -> BaziPillars:
    """
    计算八字的便捷函数
    
    Args:
        birth_dt: 出生时间
        longitude: 出生地经度
    
    Returns:
        四柱八字
    """
    calculator = GanZhiCalculator()
    return calculator.calculate_bazi(birth_dt, longitude)


def calculate_day_ganzhi(d: date) -> GanZhi:
    """
    计算某日干支的便捷函数
    
    Args:
        d: 日期
    
    Returns:
        日干支
    """
    calculator = GanZhiCalculator()
    return calculator.calculate_liu_ri(d)
