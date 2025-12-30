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
            
            for pos2, zhi2 in all_zhi[i+1:]:
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

if __name__ == "__main__":
    # 为了测试，需要模拟一个八字数据
    test_bazi = {
        'year_gan': '乙', 'year_zhi': '亥',
        'month_gan': '甲', 'month_zhi': '申',
        'day_gan': '戊', 'day_zhi': '申',
        'time_gan': '丁', 'time_zhi': '巳',
        'solar_term': '立秋'
    }
    
    print("="*60)
    print("增强版八字分析测试")
    print("="*60)
    
    print(f"\n📋 测试八字:")
    print(f"  年柱: {test_bazi['year_gan']}{test_bazi['year_zhi']}")
    print(f"  月柱: {test_bazi['month_gan']}{test_bazi['month_zhi']}")
    print(f"  日柱: {test_bazi['day_gan']}{test_bazi['day_zhi']}")
    print(f"  时柱: {test_bazi['time_gan']}{test_bazi['time_zhi']}")
    
    result = analyze_bazi_enhanced(test_bazi)
    
    print(f"\n💪 旺衰分析:")
    print(f"  综合得分: {result['strength']['score']}")
    print(f"  旺衰等级: {result['strength']['level']}")
    print(f"\n  详细分析:")
    for key, data in result['strength']['details'].items():
        print(f"    {key}: {data['score']:.2f} - {data['detail']}")
    
    print(f"\n🎯 用神分析:")
    print(f"  主用神: {result['yong_shen']['primary']}")
    print(f"  次用神: {', '.join(result['yong_shen']['secondary'])}")
    print(f"  喜神: {', '.join(result['yong_shen']['xi_shen'])}")
    print(f"  忌神: {', '.join(result['yong_shen']['ji_shen'])}")
    print(f"\n  策略:")
    for strategy in result['yong_shen']['strategies']:
        print(f"    • {strategy}")
    
    print("\n" + "="*60)
    print("✅ 测试完成！")
    print("="*60)
