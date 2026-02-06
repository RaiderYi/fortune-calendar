# -*- coding: utf-8 -*-
"""
八字分析引擎
包含：旺衰分析、用神推导、十神计算
"""

from .constants import (
    WU_XING_MAP, WU_XING_SHENG, WU_XING_KE, YUE_LING_WANG,
    ZHI_CANG_GAN, TIAN_GAN, SHI_SHEN, TIAO_HOU_RULES
)


class EnhancedStrengthAnalyzer:
    """增强版旺衰分析器 - 五维分析法"""

    def __init__(self, bazi):
        self.bazi = bazi
        self.day_gan = bazi['day_gan']
        self.day_zhi = bazi['day_zhi']
        self.day_element = WU_XING_MAP[self.day_gan]

    def analyze(self):
        """综合分析日主旺衰 - 优化版五维分析"""
        # 优化后的权重分配：月令权重提升，通根次之，透干和合化刑冲适当调整
        # 1. 月令分析 (40%) - 提升权重，月令是判断旺衰的最重要因素
        yue_ling_score, yue_ling_detail = self._analyze_yue_ling()
        # 2. 通根分析 (30%) - 提升权重，通根是日主力量的基础
        gen_score, gen_detail = self._analyze_gen()
        # 3. 透干分析 (20%) - 保持权重
        tou_gan_score, tou_gan_detail = self._analyze_tou_gan()
        # 4. 合化分析 (5%) - 降低权重，合化影响相对较小
        he_hua_score, he_hua_detail = self._analyze_he_hua()
        # 5. 刑冲分析 (5%) - 降低权重，刑冲影响相对较小
        xing_chong_score, xing_chong_detail = self._analyze_xing_chong()

        # 加权计算总分
        total_score = (
            yue_ling_score * 0.40 +
            gen_score * 0.30 +
            tou_gan_score * 0.20 +
            he_hua_score * 0.05 +
            xing_chong_score * 0.05
        )

        # 优化后的旺衰等级判断，使边界更清晰
        if total_score >= 0.70:
            level = '身旺'
        elif total_score <= 0.30:
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
        """月令分析"""
        month_zhi = self.bazi['month_zhi']
        wang_element = YUE_LING_WANG.get(month_zhi)

        if wang_element == self.day_element:
            score = 1.0
            detail = f"日主{self.day_gan}在{month_zhi}月得令，{self.day_element}当旺"
        elif wang_element == WU_XING_SHENG.get(self.day_element):
            score = 0.8
            detail = f"月令{month_zhi}藏{wang_element}，生助日主{self.day_element}"
        elif self.day_element == WU_XING_SHENG.get(wang_element):
            score = 0.3
            detail = f"日主{self.day_element}泄气于月令{wang_element}"
        elif wang_element == WU_XING_KE.get(self.day_element):
            score = 0.1
            detail = f"月令{wang_element}克制日主{self.day_element}"
        else:
            score = 0.5
            detail = f"日主{self.day_element}克制月令{wang_element}"

        return score, detail

    def _analyze_gen(self):
        """通根分析"""
        score = 0.0
        details = []

        all_zhi = [
            ('年支', self.bazi['year_zhi']),
            ('月支', self.bazi['month_zhi']),
            ('日支', self.bazi['day_zhi']),
            ('时支', self.bazi['time_zhi'])
        ]

        for position, zhi in all_zhi:
            cang_gan = ZHI_CANG_GAN.get(zhi, [])
            if cang_gan[0] and WU_XING_MAP.get(cang_gan[0]) == self.day_element:
                score += 0.35
                details.append(f"{position}{zhi}本气{cang_gan[0]}为{self.day_element}，通本气根")
            elif len(cang_gan) > 1 and cang_gan[1] and WU_XING_MAP.get(cang_gan[1]) == self.day_element:
                score += 0.20
                details.append(f"{position}{zhi}中气{cang_gan[1]}为{self.day_element}，通中气根")
            elif len(cang_gan) > 2 and cang_gan[2] and WU_XING_MAP.get(cang_gan[2]) == self.day_element:
                score += 0.10
                details.append(f"{position}{zhi}余气{cang_gan[2]}为{self.day_element}，通余气根")

        score = min(1.0, score)
        if not details:
            details.append("日主在地支无根，根基不稳")

        return score, '; '.join(details)

    def _analyze_tou_gan(self):
        """透干分析"""
        score = 0.5
        details = []

        other_gans = [
            ('年干', self.bazi['year_gan']),
            ('月干', self.bazi['month_gan']),
            ('时干', self.bazi['time_gan'])
        ]

        for position, gan in other_gans:
            gan_element = WU_XING_MAP[gan]
            if gan_element == self.day_element:
                score += 0.20
                details.append(f"{position}{gan}为同类{self.day_element}，帮身")
            elif WU_XING_SHENG.get(gan_element) == self.day_element:
                score += 0.15
                details.append(f"{position}{gan}({gan_element})生日主，为印")

        score = min(1.0, score)
        if not details:
            details.append("其他天干无助力")

        return score, '; '.join(details)

    def _analyze_he_hua(self):
        """合化分析"""
        score = 0.5
        details = []
        # 简化实现
        if not details:
            details.append("无明显合化")
        return score, '; '.join(details)

    def _analyze_xing_chong(self):
        """刑冲分析"""
        score = 0.5
        details = []
        # 简化实现
        if not details:
            details.append("无冲克")
        return score, '; '.join(details)


class EnhancedYongShenDeriver:
    """增强版用神推导器"""

    def __init__(self, bazi, strength_result):
        self.bazi = bazi
        self.strength = strength_result
        self.day_gan = bazi['day_gan']
        self.day_element = WU_XING_MAP[self.day_gan]
        self.month_zhi = bazi['month_zhi']

    def derive(self):
        """多层次用神推导 - 优化版，增加冲突检测和优先级排序"""
        strategies = []
        yong_shen_list = []
        yong_shen_priorities = {}  # 记录每个用神的优先级

        # 第一层：调候用神（优先级最高）
        tiao_hou = self._derive_tiao_hou()
        if tiao_hou:
            element = tiao_hou['element']
            yong_shen_list.append(element)
            yong_shen_priorities[element] = 100  # 调候优先级最高
            strategies.append(f"调候: {tiao_hou['reason']}")

        # 第二层：通关用神（优先级中等）
        tong_guan = self._derive_tong_guan()
        if tong_guan:
            if tong_guan not in yong_shen_list:
                yong_shen_list.append(tong_guan)
                yong_shen_priorities[tong_guan] = 80
            else:
                # 如果已存在，提升其优先级
                yong_shen_priorities[tong_guan] = max(yong_shen_priorities.get(tong_guan, 0), 80)
            strategies.append(f"通关: 需要{tong_guan}化解冲克")

        # 第三层：扶抑用神（优先级较低）
        fu_yi = self._derive_fu_yi()
        for element in fu_yi['elements']:
            if element not in yong_shen_list:
                # 检查冲突：如果与已有用神相克，则跳过
                if not self._check_conflict(element, yong_shen_list):
                    yong_shen_list.append(element)
                    yong_shen_priorities[element] = 60
        if fu_yi['elements']:
            strategies.append(f"扶抑: {fu_yi['reason']}")

        # 按优先级排序用神列表
        yong_shen_list = sorted(yong_shen_list, key=lambda x: yong_shen_priorities.get(x, 0), reverse=True)

        # 验证用神有效性
        yong_shen_list = self._validate_yongshen(yong_shen_list)

        # 推导喜神和忌神
        xi_shen, ji_shen = self._derive_xi_ji(yong_shen_list)

        return {
            'primary': yong_shen_list[0] if yong_shen_list else self.day_element,
            'secondary': yong_shen_list[1:3] if len(yong_shen_list) > 1 else [],
            'favorable': yong_shen_list,  # 添加favorable字段，用于打分
            'xi_shen': xi_shen,
            'ji_shen': ji_shen,
            'unfavorable': ji_shen,  # 添加unfavorable字段，用于打分
            'strategies': strategies
        }

    def _derive_tiao_hou(self):
        """调候用神"""
        rule = TIAO_HOU_RULES.get(self.month_zhi)
        if rule:
            return {
                'element': rule['need'],
                'type': 'tiao_hou',
                'reason': rule['reason']
            }
        return None

    def _derive_fu_yi(self):
        """扶抑用神"""
        strength_level = self.strength['level']

        if strength_level == '身旺':
            yong_elements = [
                WU_XING_SHENG[self.day_element],
                WU_XING_SHENG[WU_XING_SHENG[self.day_element]]
            ]
            reason = "身旺需泄耗，取食伤、财星为用"
        elif strength_level == '身弱':
            sheng_element = None
            for element, sheng in WU_XING_SHENG.items():
                if sheng == self.day_element:
                    sheng_element = element
                    break
            yong_elements = [sheng_element, self.day_element]
            reason = "身弱需生扶，取印星、比劫为用"
        else:
            month_element = YUE_LING_WANG[self.month_zhi]
            yong_elements = [month_element]
            reason = "身中和，顺应月令之气"

        return {
            'elements': [e for e in yong_elements if e],
            'reason': reason
        }

    def _derive_tong_guan(self):
        """通关用神 - 优化版，检测五行战局"""
        # 检查四柱中是否有明显的冲克关系
        all_zhis = [self.bazi['year_zhi'], self.bazi['month_zhi'], 
                    self.bazi['day_zhi'], self.bazi['time_zhi']]
        all_gans = [self.bazi['year_gan'], self.bazi['month_gan'],
                    self.bazi['day_gan'], self.bazi['time_gan']]
        
        # 统计各五行出现次数
        element_count = {}
        for zhi in all_zhis:
            wang_element = YUE_LING_WANG.get(zhi)
            if wang_element:
                element_count[wang_element] = element_count.get(wang_element, 0) + 1
        
        for gan in all_gans:
            gan_element = WU_XING_MAP.get(gan)
            if gan_element:
                element_count[gan_element] = element_count.get(gan_element, 0) + 0.5
        
        # 找出出现次数最多的两个五行
        sorted_elements = sorted(element_count.items(), key=lambda x: x[1], reverse=True)
        if len(sorted_elements) >= 2:
            first_elem, first_count = sorted_elements[0]
            second_elem, second_count = sorted_elements[1]
            
            # 如果两个五行力量相近且相克，需要通关
            if abs(first_count - second_count) < 1.0:
                if WU_XING_KE.get(first_elem) == second_elem or WU_XING_KE.get(second_elem) == first_elem:
                    # 找到通关五行
                    mediator = None
                    for elem, sheng_to in WU_XING_SHENG.items():
                        if sheng_to == first_elem and WU_XING_SHENG.get(second_elem) == elem:
                            mediator = elem
                            break
                        elif sheng_to == second_elem and WU_XING_SHENG.get(first_elem) == elem:
                            mediator = elem
                            break
                    
                    if mediator:
                        return mediator
        
        return None
    
    def _check_conflict(self, new_element, existing_list):
        """检查新用神是否与已有用神冲突（相克）"""
        for existing in existing_list:
            if WU_XING_KE.get(new_element) == existing or WU_XING_KE.get(existing) == new_element:
                return True
        return False
    
    def _validate_yongshen(self, yong_shen_list):
        """验证用神有效性，去除无效用神"""
        valid_list = []
        for element in yong_shen_list:
            # 用神不能是日主本身（除非特殊情况）
            if element == self.day_element and len(yong_shen_list) > 1:
                continue
            # 用神不能与日主相克
            if WU_XING_KE.get(element) == self.day_element:
                continue
            valid_list.append(element)
        
        # 如果验证后为空，至少保留第一个
        if not valid_list and yong_shen_list:
            valid_list = [yong_shen_list[0]]
        
        return valid_list

    def _derive_xi_ji(self, yong_shen_list):
        """推导喜神和忌神
        喜神：生用神的元素（能生用神的）
        忌神：克用神的元素（能克用神的）
        """
        xi_shen = []
        ji_shen = []
        all_elements = ['木', '火', '土', '金', '水']

        # 创建反向映射：找到能生某个元素的元素
        # 例如：如果用神是'火'，那么'木'是喜神（因为木生火）
        for element in all_elements:
            if element in yong_shen_list:
                continue  # 用神本身不是喜神或忌神
            
            # 检查这个元素是否能生用神（喜神）
            # WU_XING_SHENG[element] 表示 element 生什么
            # 如果 element 生的是用神，那么 element 是喜神
            if any(WU_XING_SHENG.get(element) == yong for yong in yong_shen_list):
                if element not in xi_shen:
                    xi_shen.append(element)
            
            # 检查这个元素是否能克用神（忌神）
            # WU_XING_KE[element] 表示 element 克什么
            # 如果 element 克的是用神，那么 element 是忌神
            elif any(WU_XING_KE.get(element) == yong for yong in yong_shen_list):
                if element not in ji_shen:
                    ji_shen.append(element)

        return xi_shen, ji_shen


def analyze_bazi_enhanced(bazi):
    """完整的增强八字分析"""
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


def calculate_ten_god(day_gan, target_gan):
    """计算十神"""
    if day_gan not in TIAN_GAN or target_gan not in TIAN_GAN:
        return "比肩"  # 默认值
    day_idx = TIAN_GAN.index(day_gan)
    target_idx = TIAN_GAN.index(target_gan)
    diff = (target_idx - day_idx) % 10
    return SHI_SHEN[diff]


# ==================== 缓存和工具函数 ====================

from functools import lru_cache
import hashlib


def generate_bazi_cache_key(birth_date_str, birth_time_str, longitude):
    """生成八字分析的缓存键"""
    key_str = f"{birth_date_str}_{birth_time_str}_{longitude}"
    return hashlib.md5(key_str.encode('utf-8')).hexdigest()


@lru_cache(maxsize=100)
def _analyze_bazi_internal(cache_key, birth_date_str, birth_time_str, longitude):
    """内部八字分析函数（带LRU缓存）"""
    # 延迟导入避免循环依赖
    from ..utils.date_utils import parse_datetime
    from ..core.lunar import calculate_bazi
    
    birth_dt = parse_datetime(birth_date_str, birth_time_str)
    bazi = calculate_bazi(birth_dt, longitude)
    return analyze_bazi_enhanced(bazi)


def analyze_bazi_cached(cache_key, birth_date_str, birth_time_str, longitude):
    """带缓存的八字分析"""
    try:
        result = _analyze_bazi_internal(cache_key, birth_date_str, birth_time_str, longitude)
        return {
            'strength_result': result['strength'],
            'yong_shen_result': result['yong_shen']
        }
    except Exception as e:
        print(f"[ERROR] analyze_bazi_cached 失败: {e}")
        # 降级处理：不使用缓存
        from ..utils.date_utils import parse_datetime
        from ..core.lunar import calculate_bazi
        
        birth_dt = parse_datetime(birth_date_str, birth_time_str)
        bazi = calculate_bazi(birth_dt, longitude)
        result = analyze_bazi_enhanced(bazi)
        return {
            'strength_result': result['strength'],
            'yong_shen_result': result['yong_shen']
        }


def _create_custom_yongshen(custom_yongshen, bazi):
    """根据用户自定义创建用神结果"""
    if not custom_yongshen or not isinstance(custom_yongshen, (str, list)):
        return None
    
    # 如果是字符串，转换为列表
    if isinstance(custom_yongshen, str):
        yong_shen_list = [custom_yongshen]
    else:
        yong_shen_list = custom_yongshen
    
    # 验证用神是否有效（必须是五行之一）
    valid_elements = ['木', '火', '土', '金', '水']
    yong_shen_list = [y for y in yong_shen_list if y in valid_elements]
    
    if not yong_shen_list:
        return None
    
    # 推导喜神和忌神
    xi_shen = []
    ji_shen = []
    
    for element in valid_elements:
        if element in yong_shen_list:
            continue
        # 检查是否能生用神（喜神）
        if any(WU_XING_SHENG.get(element) == yong for yong in yong_shen_list):
            xi_shen.append(element)
        # 检查是否能克用神（忌神）
        elif any(WU_XING_KE.get(element) == yong for yong in yong_shen_list):
            ji_shen.append(element)
    
    return {
        'yong_shen': yong_shen_list,
        'xi_shen': xi_shen,
        'ji_shen': ji_shen,
        'is_custom': True,
        # 与 EnhancedYongShenDeriver 输出一致，供 fortune_engine 使用
        'favorable': yong_shen_list,
        'unfavorable': ji_shen,
        'primary': yong_shen_list[0] if yong_shen_list else None,
    }
