# -*- coding: utf-8 -*-
"""
八字命理核心计算模块
提供完整的八字分析功能
"""

from lunar_python import Solar, Lunar
from config import (
    TIAN_GAN, DI_ZHI, GAN_WU_XING, ZHI_WU_XING,
    WU_XING_SHENG, WU_XING_KE, WU_XING_BEI_SHENG, WU_XING_BEI_KE,
    SHI_SHEN, YUE_LING_JI_JIE, YUE_LING_WANG_XIANG,
    ZHI_CANG_GAN, TIAN_YI_GUI_REN, TAO_HUA, WEN_CHANG,
    YI_MA, YANG_REN, STRENGTH_WEIGHTS, STRENGTH_THRESHOLD,
    BASE_SCORE, YONG_SHEN_BONUS, XI_SHEN_BONUS, JI_SHEN_PENALTY,
    SHEN_SHA_BONUS, WU_XING_LIU_TONG_BONUS, CHONG_KE_PENALTY,
    FORTUNE_DIMENSIONS
)
from utils import (
    get_solar_from_birth, get_gan_zhi_from_solar, get_wu_xing,
    calculate_ten_god, check_sheng_ke, check_zhi_he_chong,
    get_yue_ling_wang_xiang, count_wu_xing_in_bazi,
    get_liu_nian_liu_yue_liu_ri, format_score, get_level_from_score,
    get_tag_from_score, get_inference_from_score, get_yi_ji_suggestion
)


class BaziCalculator:
    """
    八字计算器类
    """

    def __init__(self, birth_date_str, birth_time_str, longitude):
        """
        初始化八字计算器
        """
        self.solar = get_solar_from_birth(birth_date_str, birth_time_str, longitude)
        self.lunar = self.solar.getLunar()
        self.eight_char = self.lunar.getEightChar()
        self.bazi_gan_zhi = get_gan_zhi_from_solar(self.solar)
        self.day_gan = self.bazi_gan_zhi["day_gan"]
        self.day_zhi = self.bazi_gan_zhi["day_zhi"]
        self.day_element = get_wu_xing(self.day_gan)

        # 缓存计算结果
        self._strength_result = None
        self._yong_shen_result = None
        self._da_yun_list = None

    def analyze_day_master_strength(self):
        """
        分析日主旺衰
        返回: {
            'strength': '身旺' | '身弱' | '从格',
            'score': 0-1之间的分数,
            'details': {
                'yue_ling': 分数,
                'de_ling': 分数,
                'de_di': 分数,
                'de_shi': 分数
            }
        }
        """
        if self._strength_result:
            return self._strength_result

        month_zhi = self.bazi_gan_zhi["month_zhi"]
        day_element = self.day_element

        # 1. 月令分析（权重45%）
        yue_ling_state = get_yue_ling_wang_xiang(month_zhi, day_element)
        if yue_ling_state == "旺":
            yue_ling_score = 1.0
        elif yue_ling_state == "相":
            yue_ling_score = 0.7
        elif yue_ling_state == "休":
            yue_ling_score = 0.4
        elif yue_ling_state == "囚":
            yue_ling_score = 0.2
        else:  # 死
            yue_ling_score = 0.0

        # 2. 得令分析（权重30%）- 其他地支对日主的生克
        de_ling_score = self._analyze_de_ling()

        # 3. 得地分析（权重15%）- 天干对日主的生克
        de_di_score = self._analyze_de_di()

        # 4. 得势分析（权重10%）- 整体格局
        de_shi_score = self._analyze_de_shi()

        # 计算总分
        total_score = (
            yue_ling_score * STRENGTH_WEIGHTS["yue_ling"] +
            de_ling_score * STRENGTH_WEIGHTS["de_ling"] +
            de_di_score * STRENGTH_WEIGHTS["de_di"] +
            de_shi_score * STRENGTH_WEIGHTS["de_shi"]
        )

        # 判断旺衰
        if total_score >= STRENGTH_THRESHOLD["strong"]:
            strength = "身旺"
        elif total_score <= STRENGTH_THRESHOLD["weak"]:
            strength = "身弱"
        else:
            strength = "中和"

        self._strength_result = {
            'strength': strength,
            'score': total_score,
            'details': {
                'yue_ling': yue_ling_score,
                'de_ling': de_ling_score,
                'de_di': de_di_score,
                'de_shi': de_shi_score
            }
        }

        return self._strength_result

    def _analyze_de_ling(self):
        """
        分析得令（其他地支对日主的生克）
        """
        day_element = self.day_element
        zhis = [
            self.bazi_gan_zhi["year_zhi"],
            self.bazi_gan_zhi["day_zhi"],
            self.bazi_gan_zhi["time_zhi"]
        ]

        score = 0.5  # 基础分
        for zhi in zhis:
            zhi_element = get_wu_xing(zhi)
            relation = check_sheng_ke(zhi_element, day_element)

            if relation == "生":
                score += 0.15
            elif relation == "被生":
                score += 0.1
            elif relation == "克":
                score -= 0.15
            elif relation == "被克":
                score -= 0.1

        return max(0, min(1, score))

    def _analyze_de_di(self):
        """
        分析得地（天干对日主的生克）
        """
        day_element = self.day_element
        gans = [
            self.bazi_gan_zhi["year_gan"],
            self.bazi_gan_zhi["month_gan"],
            self.bazi_gan_zhi["time_gan"]
        ]

        score = 0.5  # 基础分
        for gan in gans:
            gan_element = get_wu_xing(gan)
            relation = check_sheng_ke(gan_element, day_element)

            if relation == "生":
                score += 0.1
            elif relation == "被生":
                score += 0.05
            elif relation == "克":
                score -= 0.1
            elif relation == "被克":
                score -= 0.05

        return max(0, min(1, score))

    def _analyze_de_shi(self):
        """
        分析得势（整体格局）
        """
        # 统计五行数量
        element_count = count_wu_xing_in_bazi(self.bazi_gan_zhi)
        day_element = self.day_element

        # 同类五行数量
        same_count = element_count[day_element]
        # 生我五行数量
        sheng_me_count = element_count.get(WU_XING_BEI_SHENG[day_element], 0)

        total = sum(element_count.values())
        if total == 0:
            return 0.5

        # 同类和生我的比例
        ratio = (same_count + sheng_me_count) / total

        if ratio >= 0.6:
            return 0.8
        elif ratio >= 0.4:
            return 0.5
        else:
            return 0.2

    def derive_yong_shen(self):
        """
        推导用神喜忌
        返回: {
            'yong_shen': ['水', '木'],
            'xi_shen': ['水'],
            'ji_shen': ['火', '土'],
            'ten_gods': ['正印', '比肩']
        }
        """
        if self._yong_shen_result:
            return self._yong_shen_result

        strength_result = self.analyze_day_master_strength()
        strength = strength_result['strength']
        day_element = self.day_element

        yong_shen_elements = []
        xi_shen_elements = []
        ji_shen_elements = []
        yong_shen_ten_gods = []

        if strength == "身旺":
            # 身旺：取泄耗之神为用神
            # 泄秀（食伤）
            xie_xiu_element = WU_XING_SHENG[day_element]
            yong_shen_elements.append(xie_xiu_element)
            yong_shen_ten_gods.extend(["食神", "伤官"])

            # 耗身（财星）
            hao_shen_element = WU_XING_KE[day_element]
            yong_shen_elements.append(hao_shen_element)
            yong_shen_ten_gods.extend(["偏财", "正财"])

            # 喜神：生用神者
            for elem in yong_shen_elements:
                sheng_yong_shen = WU_XING_BEI_SHENG[elem]
                if sheng_yong_shen not in xi_shen_elements:
                    xi_shen_elements.append(sheng_yong_shen)

            # 忌神：生扶日主者
            sheng_fu_element = WU_XING_BEI_SHENG[day_element]
            ji_shen_elements.append(sheng_fu_element)
            ji_shen_elements.extend(["正印", "偏印"])

        elif strength == "身弱":
            # 身弱：取生扶之神为用神
            # 生扶（印星）
            sheng_fu_element = WU_XING_BEI_SHENG[day_element]
            yong_shen_elements.append(sheng_fu_element)
            yong_shen_ten_gods.extend(["正印", "偏印"])

            # 帮身（比劫）
            yong_shen_elements.append(day_element)
            yong_shen_ten_gods.extend(["比肩", "劫财"])

            # 喜神：生用神者
            for elem in yong_shen_elements:
                sheng_yong_shen = WU_XING_BEI_SHENG[elem]
                if sheng_yong_shen not in xi_shen_elements:
                    xi_shen_elements.append(sheng_yong_shen)

            # 忌神：泄耗日主者
            xie_xiu_element = WU_XING_SHENG[day_element]
            hao_shen_element = WU_XING_KE[day_element]
            ji_shen_elements.extend([xie_xiu_element, hao_shen_element])
            ji_shen_elements.extend(["食神", "伤官", "偏财", "正财"])

        else:  # 中和
            # 中和：根据月令取用神
            month_zhi = self.bazi_gan_zhi["month_zhi"]
            month_element = get_wu_xing(month_zhi)

            # 月令为用神
            yong_shen_elements.append(month_element)
            xi_shen_elements.append(WU_XING_BEI_SHENG[month_element])

            # 克月令者为忌神
            ji_shen_elements.append(WU_XING_KE[month_element])

        self._yong_shen_result = {
            'yong_shen': list(set(yong_shen_elements)),
            'xi_shen': list(set(xi_shen_elements)),
            'ji_shen': list(set(ji_shen_elements)),
            'ten_gods': list(set(yong_shen_ten_gods))
        }

        return self._yong_shen_result

    def get_da_yun_list(self, gender=1):
        """
        获取大运列表
        gender: 1为男，2为女
        """
        if self._da_yun_list:
            return self._da_yun_list

        yun = self.eight_char.getYun(gender)
        da_yun = yun.getDaYun()

        da_yun_list = []
        for i, dy in enumerate(da_yun):
            if i == 0:
                continue  # 跳过大运前的童限

            gan_zhi = dy.getGanZhi()
            da_yun_list.append({
                'index': i,
                'start_year': dy.getStartYear(),
                'end_year': dy.getEndYear(),
                'gan_zhi': gan_zhi,
                'gan': gan_zhi[0] if len(gan_zhi) > 0 else '',
                'zhi': gan_zhi[1] if len(gan_zhi) > 1 else '',
                'age': dy.getStartAge()
            })

        self._da_yun_list = da_yun_list
        return da_yun_list

    def get_current_da_yun(self, target_year):
        """
        获取目标年份所在的大运
        """
        da_yun_list = self.get_da_yun_list()

        for da_yun in da_yun_list:
            if da_yun['start_year'] <= target_year <= da_yun['end_year']:
                return da_yun

        return None

    def calculate_shen_sha(self, target_gan_zhi=None):
        """
        计算神煞
        target_gan_zhi: 目标干支字典（用于计算流年流月的神煞）
        """
        shen_sha_list = []

        # 天乙贵人
        gui_ren = TIAN_YI_GUI_REN.get(self.day_gan, [])
        if target_gan_zhi:
            if target_gan_zhi.get('year_zhi') in gui_ren:
                shen_sha_list.append("天乙贵人")
            if target_gan_zhi.get('month_zhi') in gui_ren:
                shen_sha_list.append("天乙贵人")
            if target_gan_zhi.get('day_zhi') in gui_ren:
                shen_sha_list.append("天乙贵人")
        else:
            for zhi in [self.bazi_gan_zhi["year_zhi"], self.bazi_gan_zhi["month_zhi"],
                       self.bazi_gan_zhi["day_zhi"], self.bazi_gan_zhi["time_zhi"]]:
                if zhi in gui_ren:
                    shen_sha_list.append("天乙贵人")
                    break

        # 桃花
        year_zhi = target_gan_zhi.get('year_zhi') if target_gan_zhi else self.bazi_gan_zhi["year_zhi"]
        for key, tao_hua in TAO_HUA.items():
            if year_zhi in key:
                if target_gan_zhi:
                    if target_gan_zhi.get('month_zhi') == tao_hua or \
                       target_gan_zhi.get('day_zhi') == tao_hua:
                        shen_sha_list.append("桃花")
                else:
                    for zhi in [self.bazi_gan_zhi["month_zhi"], self.bazi_gan_zhi["day_zhi"],
                               self.bazi_gan_zhi["time_zhi"]]:
                        if zhi == tao_hua:
                            shen_sha_list.append("桃花")
                            break

        # 文昌
        wen_chang = WEN_CHANG.get(self.day_gan)
        if wen_chang:
            if target_gan_zhi:
                if target_gan_zhi.get('year_zhi') == wen_chang or \
                   target_gan_zhi.get('month_zhi') == wen_chang or \
                   target_gan_zhi.get('day_zhi') == wen_chang:
                    shen_sha_list.append("文昌")
            else:
                for zhi in [self.bazi_gan_zhi["year_zhi"], self.bazi_gan_zhi["month_zhi"],
                           self.bazi_gan_zhi["day_zhi"], self.bazi_gan_zhi["time_zhi"]]:
                    if zhi == wen_chang:
                        shen_sha_list.append("文昌")
                        break

        # 驿马
        year_zhi = target_gan_zhi.get('year_zhi') if target_gan_zhi else self.bazi_gan_zhi["year_zhi"]
        for key, yi_ma in YI_MA.items():
            if year_zhi in key:
                if target_gan_zhi:
                    if target_gan_zhi.get('month_zhi') == yi_ma or \
                       target_gan_zhi.get('day_zhi') == yi_ma:
                        shen_sha_list.append("驿马")
                else:
                    for zhi in [self.bazi_gan_zhi["month_zhi"], self.bazi_gan_zhi["day_zhi"],
                               self.bazi_gan_zhi["time_zhi"]]:
                        if zhi == yi_ma:
                            shen_sha_list.append("驿马")
                            break

        # 羊刃
        yang_ren = YANG_REN.get(self.day_gan)
        if yang_ren:
            if target_gan_zhi:
                if target_gan_zhi.get('day_zhi') == yang_ren:
                    shen_sha_list.append("羊刃")
            else:
                if self.bazi_gan_zhi["day_zhi"] == yang_ren:
                    shen_sha_list.append("羊刃")

        return list(set(shen_sha_list))

    def analyze_wu_xing_liu_tong(self, target_gan_zhi, da_yun=None):
        """
        分析五行流通性
        """
        elements = []

        # 原局五行
        for gan in [self.bazi_gan_zhi["year_gan"], self.bazi_gan_zhi["month_gan"],
                    self.bazi_gan_zhi["day_gan"], self.bazi_gan_zhi["time_gan"]]:
            elements.append(get_wu_xing(gan))

        # 大运五行
        if da_yun:
            elements.append(get_wu_xing(da_yun['gan']))
            elements.append(get_wu_xing(da_yun['zhi']))

        # 流年流月流日五行
        if target_gan_zhi:
            elements.append(get_wu_xing(target_gan_zhi['year_gan']))
            elements.append(get_wu_xing(target_gan_zhi['month_gan']))
            elements.append(get_wu_xing(target_gan_zhi['day_gan']))

        # 检查是否有流通
        unique_elements = list(set(elements))
        has_flow = False

        # 检查是否存在相生关系
        for i in range(len(unique_elements) - 1):
            if WU_XING_SHENG.get(unique_elements[i]) == unique_elements[i + 1]:
                has_flow = True
                break

        return has_flow

    def calculate_fortune_score(self, target_date_str, gender=1):
        """
        计算目标日期的运势评分
        返回完整的运势分析结果
        """
        # 1. 获取流年流月流日干支
        t_year, t_month, t_day = map(int, target_date_str.split('-'))
        target_solar = Solar.fromYmd(t_year, t_month, t_day)
        liu_nian_info = get_liu_nian_liu_yue_liu_ri(target_solar)

        # 2. 获取大运
        da_yun = self.get_current_da_yun(t_year)

        # 3. 获取用神喜忌
        yong_shen_result = self.derive_yong_shen()
        yong_shen = yong_shen_result['yong_shen']
        xi_shen = yong_shen_result['xi_shen']
        ji_shen = yong_shen_result['ji_shen']

        # 4. 计算总分
        total_score = BASE_SCORE

        # 4.1 流年与用神的关系
        liu_nian_gan_element = get_wu_xing(liu_nian_info['year_gan'])
        liu_nian_zhi_element = get_wu_xing(liu_nian_info['year_zhi'])

        if liu_nian_gan_element in yong_shen:
            total_score += YONG_SHEN_BONUS
        elif liu_nian_gan_element in xi_shen:
            total_score += XI_SHEN_BONUS
        elif liu_nian_gan_element in ji_shen:
            total_score += JI_SHEN_PENALTY

        if liu_nian_zhi_element in yong_shen:
            total_score += YONG_SHEN_BONUS
        elif liu_nian_zhi_element in xi_shen:
            total_score += XI_SHEN_BONUS
        elif liu_nian_zhi_element in ji_shen:
            total_score += JI_SHEN_PENALTY

        # 4.2 大运与流年的关系
        if da_yun:
            da_yun_gan_element = get_wu_xing(da_yun['gan'])
            da_yun_zhi_element = get_wu_xing(da_yun['zhi'])

            if da_yun_gan_element in yong_shen and liu_nian_gan_element in yong_shen:
                total_score += 10
            if da_yun_zhi_element in yong_shen and liu_nian_zhi_element in yong_shen:
                total_score += 10

        # 4.3 神煞加成
        shen_sha = self.calculate_shen_sha(liu_nian_info)
        for ss in shen_sha:
            bonus = SHEN_SHA_BONUS.get(ss, 0)
            total_score += bonus

        # 4.4 五行流通加成
        if self.analyze_wu_xing_liu_tong(liu_nian_info, da_yun):
            total_score += WU_XING_LIU_TONG_BONUS

        # 4.5 冲克减分
        # 检查流年与原局的冲克
        for zhi in [self.bazi_gan_zhi["year_zhi"], self.bazi_gan_zhi["month_zhi"],
                   self.bazi_gan_zhi["day_zhi"], self.bazi_gan_zhi["time_zhi"]]:
            relation, result = check_zhi_he_chong(zhi, liu_nian_info['year_zhi'])
            if relation == "六冲":
                total_score += CHONG_KE_PENALTY

        # 5. 计算各维度评分
        dimensions = {}
        for dim_key, dim_config in FORTUNE_DIMENSIONS.items():
            dim_score = total_score

            # 根据神煞调整
            for ss in shen_sha:
                if ss in dim_config.get('shen_shen', []):
                    dim_score += 5

            # 根据十神调整
            liu_nian_ten_god = calculate_ten_god(self.day_gan, liu_nian_info['day_gan'])
            if liu_nian_ten_god in dim_config.get('shen_shen', []):
                dim_score += 5

            dimensions[dim_key] = {
                'score': format_score(dim_score),
                'level': get_level_from_score(dim_score),
                'tag': get_tag_from_score(dim_score, dim_key),
                'inference': get_inference_from_score(dim_score, dim_key, liu_nian_ten_god)
            }

        # 6. 生成宜忌建议
        current_elements = [
            get_wu_xing(liu_nian_info['year_gan']),
            get_wu_xing(liu_nian_info['month_gan']),
            get_wu_xing(liu_nian_info['day_gan'])
        ]
        yi_ji = get_yi_ji_suggestion(yong_shen, xi_shen, ji_shen, current_elements)

        # 7. 计算今日十神
        today_ten_god = calculate_ten_god(self.day_gan, liu_nian_info['day_gan'])

        # 8. 返回完整结果
        return {
            'bazi': {
                'year': self.bazi_gan_zhi['year'],
                'month': self.bazi_gan_zhi['month'],
                'day': self.bazi_gan_zhi['day'],
                'hour': self.bazi_gan_zhi['hour'],
                'year_gan': self.bazi_gan_zhi['year_gan'],
                'year_zhi': self.bazi_gan_zhi['year_zhi'],
                'month_gan': self.bazi_gan_zhi['month_gan'],
                'month_zhi': self.bazi_gan_zhi['month_zhi'],
                'day_gan': self.bazi_gan_zhi['day_gan'],
                'day_zhi': self.bazi_gan_zhi['day_zhi'],
                'time_gan': self.bazi_gan_zhi['time_gan'],
                'time_zhi': self.bazi_gan_zhi['time_zhi']
            },
            'strength': self.analyze_day_master_strength(),
            'yong_shen': yong_shen_result,
            'da_yun': da_yun,
            'liu_nian': liu_nian_info,
            'shen_sha': shen_sha,
            'today_ten_god': today_ten_god,
            'total_score': format_score(total_score),
            'dimensions': dimensions,
            'yi_ji': yi_ji
        }


def analyze_fortune(birth_date_str, birth_time_str, longitude, target_date_str, gender=1):
    """
    分析运势的便捷函数
    """
    calculator = BaziCalculator(birth_date_str, birth_time_str, longitude)
    return calculator.calculate_fortune_score(target_date_str, gender)
