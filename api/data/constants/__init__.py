# -*- coding: utf-8 -*-
"""
常量数据包
导出所有常量模块
"""

from .tiangan import (
    TIAN_GAN,
    TIAN_GAN_WUXING,
    TIAN_GAN_YINYANG,
    TIAN_GAN_WU_HE,
    WU_HU_DUN,
    WU_SHU_DUN,
    get_tiangan_index,
    get_tiangan_by_index,
    get_tiangan_wuxing,
    is_yang_gan,
    is_same_yinyang
)

from .dizhi import (
    DI_ZHI,
    DI_ZHI_WUXING,
    DI_ZHI_YINYANG,
    ZHI_CANG_GAN,
    LIU_CHONG,
    LIU_HE,
    LIU_HE_PAIR,
    SAN_HE,
    SAN_HUI,
    LIU_HAI,
    SAN_XING,
    get_dizhi_index,
    get_dizhi_by_index,
    get_dizhi_wuxing,
    get_cang_gan,
    get_ben_qi,
    check_liu_chong,
    check_liu_he,
    get_hour_zhi_index
)

from .wuxing import (
    WU_XING,
    WU_XING_SHENG,
    WU_XING_KE,
    WU_XING_BEI_SHENG,
    WU_XING_BEI_KE,
    YUE_LING_WANG_XIANG,
    get_sheng_element,
    get_ke_element,
    get_bei_sheng_element,
    get_bei_ke_element,
    check_relation,
    get_wang_xiang_state
)

from .solar_terms import (
    SOLAR_TERMS,
    SOLAR_TERM_TABLE,
    TERM_INDEX_TO_MONTH_ZHI,
    MONTH_ZHI_SEASON,
    YUE_LING_DANG_LING,
    get_term_name,
    get_term_index,
    get_month_zhi_index_from_term,
    get_season_from_month_zhi,
    get_dang_ling_element
)

__all__ = [
    # 天干
    'TIAN_GAN', 'TIAN_GAN_WUXING', 'TIAN_GAN_YINYANG',
    'TIAN_GAN_WU_HE', 'WU_HU_DUN', 'WU_SHU_DUN',
    # 地支
    'DI_ZHI', 'DI_ZHI_WUXING', 'DI_ZHI_YINYANG',
    'ZHI_CANG_GAN', 'LIU_CHONG', 'LIU_HE', 'SAN_HE',
    # 五行
    'WU_XING', 'WU_XING_SHENG', 'WU_XING_KE',
    # 节气
    'SOLAR_TERMS', 'SOLAR_TERM_TABLE'
]
