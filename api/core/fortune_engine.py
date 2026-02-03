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
    if shensha_result.get('details'):
        for sha in shensha_result['details'][:3]:
            all_factors.append(sha.get('desc', ''))

    return {
        'total_score': final_score,
        'score': final_score,  # 兼容旧版本
        'shensha_result': shensha_result,  # 包含神煞结果供维度计算使用
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
    """计算流年影响 - 优化版，减少随机性，提高准确性"""
    liunian_weight = FORTUNE_WEIGHTS_V5['liunian']['weight']
    stem_ratio = FORTUNE_WEIGHTS_V5['liunian']['stem_ratio']
    branch_ratio = FORTUNE_WEIGHTS_V5['liunian']['branch_ratio']
    
    nian_gan_element = WU_XING_MAP.get(liu_nian['gan'])
    nian_gan_bonus = 0

    # 优化：使用favorable和unfavorable列表，减少随机性
    favorable_list = yongshen.get('favorable', [])
    unfavorable_list = yongshen.get('unfavorable', [])
    primary = yongshen.get('primary')

    if nian_gan_element == primary:
        nian_gan_bonus = 9 + random.randint(-1, 1)  # 减少随机范围
    elif nian_gan_element in favorable_list:
        nian_gan_bonus = 6 + random.randint(-1, 1)
    elif nian_gan_element in unfavorable_list:
        nian_gan_bonus = -7 + random.randint(-1, 0)
    else:
        nian_gan_bonus = random.randint(-2, 2)

    nian_zhi_element = WU_XING_MAP.get(liu_nian['zhi'])
    nian_zhi_bonus = 0

    if nian_zhi_element == primary:
        nian_zhi_bonus = 6 + random.randint(-1, 1)
    elif nian_zhi_element in favorable_list:
        nian_zhi_bonus = 4 + random.randint(0, 1)
    elif nian_zhi_element in unfavorable_list:
        nian_zhi_bonus = -5 + random.randint(-1, 0)
    else:
        nian_zhi_bonus = random.randint(-1, 1)

    return (nian_gan_bonus * stem_ratio + nian_zhi_bonus * branch_ratio) * (liunian_weight / 0.12)


def _calculate_liuyue_score(liu_yue, yongshen):
    """计算流月影响 - 优化版，减少随机性，提高准确性"""
    liuyue_weight = FORTUNE_WEIGHTS_V5['liuyue']['weight']
    yue_gan_element = WU_XING_MAP.get(liu_yue['gan'])

    favorable_list = yongshen.get('favorable', [])
    unfavorable_list = yongshen.get('unfavorable', [])
    primary = yongshen.get('primary')

    if yue_gan_element == primary:
        liuyue_score = 13 + random.randint(-2, 2)  # 减少随机范围
    elif yue_gan_element in favorable_list:
        liuyue_score = 8 + random.randint(-1, 1)
    elif yue_gan_element in unfavorable_list:
        liuyue_score = -9 + random.randint(-1, 1)
    else:
        liuyue_score = random.randint(-2, 2)  # 减少随机范围

    return liuyue_score * (liuyue_weight / 0.18)


def _calculate_liuri_score(liu_ri, yongshen):
    """计算流日影响 - 优化版，减少随机性，提高准确性"""
    liuri_weight = FORTUNE_WEIGHTS_V5['liuri']['weight']
    stem_ratio = FORTUNE_WEIGHTS_V5['liuri']['stem_ratio']
    branch_ratio = FORTUNE_WEIGHTS_V5['liuri']['branch_ratio']
    
    ri_gan_element = WU_XING_MAP.get(liu_ri['gan'])
    ri_gan_bonus = 0

    favorable_list = yongshen.get('favorable', [])
    unfavorable_list = yongshen.get('unfavorable', [])
    primary = yongshen.get('primary')

    if ri_gan_element == primary:
        ri_gan_bonus = 38 + random.randint(-3, 3)  # 减少随机范围，提高基础值
    elif ri_gan_element in favorable_list:
        ri_gan_bonus = 22 + random.randint(-2, 2)
    elif ri_gan_element in unfavorable_list:
        ri_gan_bonus = -20 + random.randint(-2, 1)
    else:
        ri_gan_bonus = random.randint(-4, 4)

    ri_zhi_element = WU_XING_MAP.get(liu_ri['zhi'])
    ri_zhi_bonus = 0

    if ri_zhi_element == primary:
        ri_zhi_bonus = 27 + random.randint(-2, 2)
    elif ri_zhi_element in favorable_list:
        ri_zhi_bonus = 17 + random.randint(-1, 1)
    elif ri_zhi_element in unfavorable_list:
        ri_zhi_bonus = -14 + random.randint(-1, 1)
    else:
        ri_zhi_bonus = random.randint(-3, 3)

    return (ri_gan_bonus * stem_ratio + ri_zhi_bonus * branch_ratio) * (liuri_weight / 0.70)


def _check_tiangan_interaction(gan1, gan2, yongshen, is_weak):
    """检测天干互动 - 优化版，提高判断准确性"""
    score = 0
    descriptions = []

    gan1_element = WU_XING_MAP.get(gan1)
    gan2_element = WU_XING_MAP.get(gan2)
    
    favorable_list = yongshen.get('favorable', [])
    unfavorable_list = yongshen.get('unfavorable', [])

    # 检查相生
    if WU_XING_SHENG.get(gan2_element) == gan1_element:
        if gan2_element in favorable_list:
            score += 4  # 提升相生助力分数
            descriptions.append("天干相生，喜神助力")
        elif gan2_element in unfavorable_list:
            score -= 3  # 提升相生忌神的负面影响
            descriptions.append("天干相生，生助忌神")
        else:
            score += 1
            descriptions.append("天干相生，温和助力")

    # 检查相克
    if WU_XING_KE.get(gan2_element) == gan1_element:
        if gan2_element in unfavorable_list:
            score += 3  # 提升克制忌神的正面影响
            descriptions.append("天干相克，克制忌神")
        elif gan2_element in favorable_list:
            score -= 3  # 提升受克于喜神的负面影响
            descriptions.append("天干受克，喜神受损")
        else:
            score -= 1
            descriptions.append("天干相克，轻微影响")

    # 检查比和
    if gan1_element == gan2_element:
        if is_weak:
            score += 3  # 身弱时比和更有利
            descriptions.append("天干比和，同类相助")
        else:
            score -= 4  # 身旺时比和更不利
            descriptions.append("天干比和，竞争夺利")

    return score, descriptions


def _check_dizhi_interaction(bazi_zhis, liu_ri_zhi, day_zhi, yongshen):
    """检测地支互动 - 优化版，提高判断准确性"""
    score = 0
    descriptions = []

    # 检查六冲
    liu_chong_table = DIZHI_INTERACTIONS['liu_chong']
    liu_chong_scores = DIZHI_INTERACTIONS['liu_chong_scores']
    
    favorable_list = yongshen.get('favorable', [])
    unfavorable_list = yongshen.get('unfavorable', [])

    for bazi_zhi in bazi_zhis:
        if liu_chong_table.get(liu_ri_zhi) == bazi_zhi:
            if bazi_zhi == day_zhi:
                score += liu_chong_scores['clash_root']
                descriptions.append(f"六冲日支（{liu_ri_zhi}冲{bazi_zhi}），动荡不安")
            else:
                zhi_element = WU_XING_MAP.get(bazi_zhi)
                if zhi_element in unfavorable_list:
                    score += liu_chong_scores['clash_favorable']
                    descriptions.append(f"六冲去忌神（{liu_ri_zhi}冲{bazi_zhi}），变动中求吉")
                elif zhi_element in favorable_list:
                    score += liu_chong_scores['clash_unfavorable']
                    descriptions.append(f"六冲用神（{liu_ri_zhi}冲{bazi_zhi}），防备突发")
                else:
                    score += liu_chong_scores.get('clash_neutral', -2)
                    descriptions.append(f"六冲（{liu_ri_zhi}冲{bazi_zhi}），有变动")

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

    # 优化：限制神煞影响范围，使其更合理
    total_score = max(-20, min(20, total_score))  # 缩小影响范围，使评分更稳定

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


def generate_todo(yong_shen_element, ji_shen_list):
    """根据用神和忌神生成宜忌建议"""
    element_names = {
        '木': '木',
        '火': '火',
        '土': '土',
        '金': '金',
        '水': '水'
    }
    
    yong_name = element_names.get(yong_shen_element, '木')
    
    # 宜做的事情（基于用神）
    yi_list = []
    if yong_shen_element == '木':
        yi_list = ['多接触绿色植物', '向东发展', '多读书学习', '早起锻炼']
    elif yong_shen_element == '火':
        yi_list = ['多晒太阳', '向南发展', '多社交活动', '保持热情']
    elif yong_shen_element == '土':
        yi_list = ['稳定发展', '多接地气', '保持耐心', '注重实际']
    elif yong_shen_element == '金':
        yi_list = ['向西发展', '多接触金属', '保持果断', '注重效率']
    elif yong_shen_element == '水':
        yi_list = ['多喝水', '向北发展', '保持冷静', '多思考']
    
    # 忌做的事情（基于忌神）
    ji_list = []
    if ji_shen_list:
        ji_list = ['避免冲动决策', '谨慎投资', '注意人际关系', '保持低调']
    
    return {
        'yi': yi_list[:3],  # 最多3条
        'ji': ji_list[:3]   # 最多3条
    }
