# -*- coding: utf-8 -*-
"""
运势评分引擎
包含：V5.0 算法、六大维度计算、主题生成
"""

import random
from .constants import (
    WU_XING_MAP, WU_XING_SHENG, WU_XING_KE, FORTUNE_WEIGHTS_V5, TEN_GOD_INFLUENCE_V5,
    TEN_GOD_THEMES, DIMENSION_MAPPING, DIZHI_INTERACTIONS,
    SHEN_SHA_COMPLETE
)
from .bazi_engine import calculate_ten_god


def calculate_fortune_score_v5(bazi, element_analysis, yongshen,
                                liu_nian, liu_yue, liu_ri, dayun=None):
    """
    Celestial-Quant V5.0 完整算法
    """
    # 使用流日作为随机种子
    random.seed(hash(liu_ri['gan'] + liu_ri['zhi']))

    # 基础分（大运修正）
    base_score = FORTUNE_WEIGHTS_V5['base_score']
    dayun_adjust = 0

    if dayun:
        dayun_gan_element = WU_XING_MAP.get(dayun.get('current_gan'))
        if dayun_gan_element in yongshen.get('favorable', []):
            dayun_adjust = FORTUNE_WEIGHTS_V5['dayun_adjust']['favorable']
        elif dayun_gan_element in yongshen.get('unfavorable', []):
            dayun_adjust = FORTUNE_WEIGHTS_V5['dayun_adjust']['unfavorable']
        base_score += dayun_adjust

    # 流年影响（10%）
    liunian_score = _calculate_liunian_score(liu_nian, yongshen)

    # 流月影响（20%）
    liuyue_score = _calculate_liuyue_score(liu_yue, yongshen)

    # 流日影响（70%）
    liuri_score = _calculate_liuri_score(liu_ri, yongshen)

    # 天干互动
    tiangan_score, tiangan_desc = _check_tiangan_interaction(
        bazi['day_gan'], liu_ri['gan'], yongshen,
        element_analysis.get('pattern') in ['Weak', 'Follower']
    )

    # 地支互动
    bazi_zhis = [bazi['year_zhi'], bazi['month_zhi'], bazi['day_zhi'], bazi['time_zhi']]
    dizhi_score, dizhi_desc = _check_dizhi_interaction(
        bazi_zhis, liu_ri['zhi'], bazi['day_zhi'], yongshen
    )

    # 神煞影响
    shensha_result = _calculate_shensha(bazi, liu_ri)
    shensha_score = shensha_result['total_score']

    # 十神影响
    ten_god = calculate_ten_god(bazi['day_gan'], liu_ri['gan'])
    ten_god_config = TEN_GOD_INFLUENCE_V5.get(ten_god, {})
    ten_god_score = 0

    if element_analysis.get('pattern') in ['Weak', 'Follower']:
        ten_god_score = ten_god_config.get('weak_bonus', ten_god_config.get('bonus', 0))
    else:
        ten_god_score = ten_god_config.get('strong_bonus', ten_god_config.get('bonus', 0))

    # 综合计算
    total = (base_score + liunian_score + liuyue_score + liuri_score +
             tiangan_score + dizhi_score + shensha_score + ten_god_score)

    final_score = max(30, min(100, int(total)))

    # 收集所有因素
    all_factors = []
    all_factors.extend(tiangan_desc)
    all_factors.extend(dizhi_desc)
    if shensha_result['details']:
        for sha in shensha_result['details'][:3]:
            all_factors.append(sha['desc'])

    return {
        'score': final_score,
        'breakdown': {
            'base': base_score,
            'dayun_adjust': dayun_adjust,
            'liunian': round(liunian_score, 1),
            'liuyue': round(liuyue_score, 1),
            'liuri': round(liuri_score, 1),
            'tiangan': tiangan_score,
            'dizhi': dizhi_score,
            'shensha': shensha_score,
            'ten_god': ten_god_score
        },
        'interactions': {
            'tiangan': tiangan_desc,
            'dizhi': dizhi_desc
        },
        'shensha': shensha_result,
        'ten_god': ten_god,
        'factors': all_factors[:5]
    }


def _calculate_liunian_score(liu_nian, yongshen):
    """计算流年影响"""
    liunian_weight = FORTUNE_WEIGHTS_V5['liunian']['weight']
    nian_gan_element = WU_XING_MAP.get(liu_nian['gan'])
    nian_gan_bonus = 0

    if nian_gan_element == yongshen.get('primary'):
        nian_gan_bonus = 8 + random.randint(-2, 2)
    elif nian_gan_element in yongshen.get('favorable', []):
        nian_gan_bonus = 5 + random.randint(-1, 1)
    elif nian_gan_element in yongshen.get('unfavorable', []):
        nian_gan_bonus = -6 + random.randint(-1, 1)

    nian_zhi_element = WU_XING_MAP.get(liu_nian['zhi'])
    nian_zhi_bonus = 0

    if nian_zhi_element == yongshen.get('primary'):
        nian_zhi_bonus = 5 + random.randint(-1, 1)
    elif nian_zhi_element in yongshen.get('favorable', []):
        nian_zhi_bonus = 3 + random.randint(0, 1)
    elif nian_zhi_element in yongshen.get('unfavorable', []):
        nian_zhi_bonus = -4 + random.randint(-1, 0)

    return (nian_gan_bonus * 0.6 + nian_zhi_bonus * 0.4) * (liunian_weight / 0.1)


def _calculate_liuyue_score(liu_yue, yongshen):
    """计算流月影响"""
    liuyue_weight = FORTUNE_WEIGHTS_V5['liuyue']['weight']
    yue_gan_element = WU_XING_MAP.get(liu_yue['gan'])

    if yue_gan_element == yongshen.get('primary'):
        liuyue_score = 12 + random.randint(-2, 3)
    elif yue_gan_element in yongshen.get('favorable', []):
        liuyue_score = 7 + random.randint(-2, 2)
    elif yue_gan_element in yongshen.get('unfavorable', []):
        liuyue_score = -8 + random.randint(-1, 1)
    else:
        liuyue_score = random.randint(-3, 3)

    return liuyue_score * (liuyue_weight / 0.2)


def _calculate_liuri_score(liu_ri, yongshen):
    """计算流日影响"""
    liuri_weight = FORTUNE_WEIGHTS_V5['liuri']['weight']
    ri_gan_element = WU_XING_MAP.get(liu_ri['gan'])
    ri_gan_bonus = 0

    if ri_gan_element == yongshen.get('primary'):
        ri_gan_bonus = 35 + random.randint(-4, 5)
    elif ri_gan_element in yongshen.get('favorable', []):
        ri_gan_bonus = 20 + random.randint(-3, 3)
    elif ri_gan_element in yongshen.get('unfavorable', []):
        ri_gan_bonus = -18 + random.randint(-2, 2)
    else:
        ri_gan_bonus = random.randint(-5, 5)

    ri_zhi_element = WU_XING_MAP.get(liu_ri['zhi'])
    ri_zhi_bonus = 0

    if ri_zhi_element == yongshen.get('primary'):
        ri_zhi_bonus = 25 + random.randint(-3, 4)
    elif ri_zhi_element in yongshen.get('favorable', []):
        ri_zhi_bonus = 15 + random.randint(-2, 2)
    elif ri_zhi_element in yongshen.get('unfavorable', []):
        ri_zhi_bonus = -12 + random.randint(-2, 1)
    else:
        ri_zhi_bonus = random.randint(-4, 4)

    return (ri_gan_bonus * 0.6 + ri_zhi_bonus * 0.4) * (liuri_weight / 0.7)


def _check_tiangan_interaction(gan1, gan2, yongshen, is_weak):
    """检测天干互动"""
    score = 0
    descriptions = []

    gan1_element = WU_XING_MAP.get(gan1)
    gan2_element = WU_XING_MAP.get(gan2)

    # 检查相生
    if WU_XING_SHENG.get(gan2_element) == gan1_element:
        if gan2_element in yongshen.get('favorable', []):
            score += 3
            descriptions.append("天干相生，喜神助力")
        else:
            score -= 2
            descriptions.append("天干相生，生助忌神")

    # 检查相克
    if WU_XING_KE.get(gan2_element) == gan1_element:
        if gan2_element in yongshen.get('unfavorable', []):
            score -= 2
            descriptions.append("天干受克，忌神来袭")
        else:
            score += 3
            descriptions.append("天干相克，克制忌神")

    # 检查比和
    if gan1_element == gan2_element:
        if is_weak:
            score += 2
            descriptions.append("天干比和，同类相助")
        else:
            score -= 3
            descriptions.append("天干比和，竞争夺利")

    return score, descriptions


def _check_dizhi_interaction(bazi_zhis, liu_ri_zhi, day_zhi, yongshen):
    """检测地支互动"""
    score = 0
    descriptions = []

    # 检查六冲
    liu_chong_table = DIZHI_INTERACTIONS['liu_chong']
    liu_chong_scores = DIZHI_INTERACTIONS['liu_chong_scores']

    for bazi_zhi in bazi_zhis:
        if liu_chong_table.get(liu_ri_zhi) == bazi_zhi:
            if bazi_zhi == day_zhi:
                score += liu_chong_scores['clash_root']
                descriptions.append(f"六冲日支（{liu_ri_zhi}冲{bazi_zhi}），动荡不安")
            else:
                zhi_element = WU_XING_MAP.get(bazi_zhi)
                if zhi_element in yongshen.get('unfavorable', []):
                    score += liu_chong_scores['clash_favorable']
                    descriptions.append(f"六冲去忌神（{liu_ri_zhi}冲{bazi_zhi}），变动中求吉")
                else:
                    score += liu_chong_scores['clash_unfavorable']
                    descriptions.append(f"六冲用神（{liu_ri_zhi}冲{bazi_zhi}），防备突发")

    return score, descriptions


def _calculate_shensha(bazi, liu_ri):
    """计算神煞影响"""
    total_score = 0
    details = []
    dimension_boosts = {}

    day_gan = bazi['day_gan']
    liu_ri_zhi = liu_ri['zhi']

    for sha_name, sha_config in SHEN_SHA_COMPLETE.items():
        triggered = False

        if sha_config['calc_method'] == 'stem_based':
            table = sha_config['table']
            valid_zhis = table.get(day_gan, [])
            if isinstance(valid_zhis, list):
                if liu_ri_zhi in valid_zhis:
                    triggered = True
            else:
                if liu_ri_zhi == valid_zhis:
                    triggered = True

        if triggered:
            total_score += sha_config['score']
            details.append({
                'name': sha_name,
                'score': sha_config['score'],
                'desc': sha_config['desc'],
                'type': 'auspicious' if sha_config['score'] > 0 else 'inauspicious'
            })

            if 'dimension_boost' in sha_config:
                for dim, boost in sha_config['dimension_boost'].items():
                    dimension_boosts[dim] = dimension_boosts.get(dim, 0) + boost

    total_score = max(-25, min(25, total_score))

    return {
        'total_score': total_score,
        'details': details,
        'dimension_boosts': dimension_boosts
    }


def calculate_dimensions_v5(bazi, liu_ri, overall_score, yongshen,
                             element_analysis, shensha_result):
    """计算六大维度分数"""
    dimensions = {}
    base_dim_score = overall_score

    # 事业运
    career_score = base_dim_score
    ten_god = calculate_ten_god(bazi['day_gan'], liu_ri['gan'])
    if ten_god in DIMENSION_MAPPING['career']['core_shishen']:
        career_score += 10
    dimensions['career'] = max(0, min(100, int(career_score)))

    # 财运
    wealth_score = base_dim_score
    if ten_god in DIMENSION_MAPPING['wealth']['core_shishen']:
        wealth_score += 12
    dimensions['wealth'] = max(0, min(100, int(wealth_score)))

    # 情感运
    romance_score = base_dim_score
    if DIZHI_INTERACTIONS['liu_he'].get(liu_ri['zhi']) == bazi['day_zhi']:
        romance_score += 12
    elif DIZHI_INTERACTIONS['liu_chong'].get(liu_ri['zhi']) == bazi['day_zhi']:
        romance_score -= 15
    dimensions['romance'] = max(0, min(100, int(romance_score)))

    # 健康运
    health_score = base_dim_score
    dimensions['health'] = max(0, min(100, int(health_score)))

    # 学业运
    studies_score = base_dim_score
    if ten_god in DIMENSION_MAPPING['studies']['core_shishen']:
        studies_score += 10
    dimensions['studies'] = max(0, min(100, int(studies_score)))

    # 出行运
    travel_score = base_dim_score
    if 'travel' in shensha_result.get('dimension_boosts', {}):
        travel_score += shensha_result['dimension_boosts']['travel']
    dimensions['travel'] = max(0, min(100, int(travel_score)))

    return dimensions


def generate_main_theme(total_score, day_gan, liu_ri_gan):
    """生成主题关键词"""
    ten_god = calculate_ten_god(day_gan, liu_ri_gan)
    theme_info = TEN_GOD_THEMES.get(ten_god, TEN_GOD_THEMES['食神'])
    descriptions = theme_info['descriptions']

    if total_score >= 85:
        sub_keyword = '运势极佳'
        description = random.choice(descriptions[:3])
    elif total_score >= 70:
        sub_keyword = '运势良好'
        description = random.choice(descriptions)
    elif total_score >= 50:
        sub_keyword = '运势平稳'
        description = random.choice(descriptions[2:])
    else:
        sub_keyword = '需多谨慎'
        description = f'今日{theme_info["keyword"]}，宜谨慎行事，三思而后行'

    return {
        'keyword': theme_info['keyword'],
        'subKeyword': sub_keyword,
        'emoji': theme_info['emoji'],
        'colorTheme': theme_info['color'],
        'textColor': 'text-slate-800',
        'description': description
    }
