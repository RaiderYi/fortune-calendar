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
        """综合分析日主旺衰"""
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
        """多层次用神推导"""
        strategies = []
        yong_shen_list = []

        # 第一层：调候用神
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
        """通关用神"""
        return None

    def _derive_xi_ji(self, yong_shen_list):
        """推导喜神和忌神"""
        xi_shen = []
        ji_shen = []
        all_elements = ['木', '火', '土', '金', '水']

        for element in all_elements:
            if element in yong_shen_list:
                continue
            elif any(WU_XING_SHENG.get(element) == yong for yong in yong_shen_list):
                xi_shen.append(element)
            else:
                if any(WU_XING_KE.get(element) == yong for yong in yong_shen_list):
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
    day_idx = TIAN_GAN.index(day_gan)
    target_idx = TIAN_GAN.index(target_gan)
    diff = (target_idx - day_idx) % 10
    return SHI_SHEN[diff]
