# -*- coding: utf-8 -*-
"""
八字合盘 MVP：双人日主、日支刑冲合、五行互补等启发式评分
仅供娱乐参考，非专业合婚断语。
"""

from typing import Any, Dict, List

try:
    from ..core.lunar import calculate_bazi
    from ..core.bazi_engine import calculate_ten_god
    from ..core.constants import WU_XING_MAP, WU_XING_SHENG, WU_XING_KE
    from ..core.fortune_engine import DIZHI_INTERACTIONS
    from ..utils.date_utils import parse_datetime
    from ..utils.json_utils import clean_for_json
except ImportError:
    import os
    import sys
    api_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if api_dir not in sys.path:
        sys.path.insert(0, api_dir)
    from core.lunar import calculate_bazi
    from core.bazi_engine import calculate_ten_god
    from core.constants import WU_XING_MAP, WU_XING_SHENG, WU_XING_KE
    from core.fortune_engine import DIZHI_INTERACTIONS
    from utils.date_utils import parse_datetime
    from utils.json_utils import clean_for_json


def _element(gan: str) -> str:
    return WU_XING_MAP.get(gan, '')


def _day_master_relation(g1: str, g2: str) -> tuple:
    """日主五行关系：比和、相生、相克、未知"""
    e1, e2 = _element(g1), _element(g2)
    if not e1 or not e2:
        return 'neutral', 0
    if e1 == e2:
        return 'same', 8
    if WU_XING_SHENG.get(e1) == e2:
        return 'a_generates_b', 10
    if WU_XING_SHENG.get(e2) == e1:
        return 'b_generates_a', 10
    if WU_XING_KE.get(e1) == e2:
        return 'a_controls_b', -5
    if WU_XING_KE.get(e2) == e1:
        return 'b_controls_a', -5
    return 'neutral', 2


def _zhi_relation(z1: str, z2: str) -> List[str]:
    notes = []
    if DIZHI_INTERACTIONS['liu_he'].get(z1) == z2 or DIZHI_INTERACTIONS['liu_he'].get(z2) == z1:
        notes.append('日支六合，易亲近')
    if DIZHI_INTERACTIONS['liu_chong'].get(z1) == z2:
        notes.append('日支相冲，需多磨合')
    return notes


class HepanService:
    @staticmethod
    def handle_hepan_request(body: Dict[str, Any]) -> Dict[str, Any]:
        try:
            a = body.get('personA') or {}
            b = body.get('personB') or {}
            for key, label in [(a, 'A'), (b, 'B')]:
                if not key.get('birthDate'):
                    return {'success': False, 'error': f'请填写{label}方出生日期', 'code': 400}

            lon_a = float(a.get('longitude', 120.0))
            lon_b = float(b.get('longitude', 120.0))
            dt_a = parse_datetime(a['birthDate'], a.get('birthTime', '12:00'))
            dt_b = parse_datetime(b['birthDate'], b.get('birthTime', '12:00'))
            bazi_a = calculate_bazi(dt_a, lon_a)
            bazi_b = calculate_bazi(dt_b, lon_b)

            g_a, g_b = bazi_a['day_gan'], bazi_b['day_gan']
            z_a, z_b = bazi_a['day_zhi'], bazi_b['day_zhi']

            base = 55
            _, dm_score = _day_master_relation(g_a, g_b)
            base += dm_score

            ten = calculate_ten_god(g_a, g_b)
            romance_bonus = 6 if ten in ('正财', '偏财', '正官', '七杀') else 0
            base += romance_bonus

            notes = _zhi_relation(z_a, z_b)
            if '日支相冲' in ''.join(notes):
                base -= 8
            if any('六合' in n for n in notes):
                base += 10

            overall = max(35, min(92, int(base)))
            communication = max(30, min(95, overall + 5 - (3 if notes else 0)))
            romance = max(30, min(95, overall + romance_bonus))
            stability = max(30, min(95, overall - (5 if '冲' in ''.join(notes) else 0)))

            summary_points = notes + [
                f'日主比和为「{ten}」关系视角',
                f'日主五行：{_element(g_a)} × {_element(g_b)}',
            ]

            data = {
                'scores': {
                    'overall': overall,
                    'communication': communication,
                    'romance': romance,
                    'stability': stability,
                },
                'labels': {
                    'overall': '综合契合',
                    'communication': '沟通相处',
                    'romance': '情感吸引',
                    'stability': '稳定持久',
                },
                'summaryPoints': summary_points[:8],
                'personA': {'bazi': clean_for_json(bazi_a)},
                'personB': {'bazi': clean_for_json(bazi_b)},
                'tenGodBtoA': ten,
            }
            return {'success': True, 'data': data, 'code': 200}
        except Exception as e:
            return {'success': False, 'error': str(e), 'code': 500}
