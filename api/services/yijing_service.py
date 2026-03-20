# -*- coding: utf-8 -*-
"""
易经问卦 MVP：铜钱起卦 → 本卦/变卦结构（供前端与 AI 解读）
一事一断、结果仅供娱乐参考。
"""

import random
from typing import Any, Dict, List, Tuple

# 先天序：二进制 000–111 对应（初爻为最低位）
TRIGRAM_NAMES = ("坤", "艮", "坎", "巽", "震", "离", "兑", "乾")


def _line_to_yang(line_val: int) -> bool:
    """7、9 为阳；6、8 为阴"""
    return line_val in (7, 9)


def _trigram_value(lines_three: Tuple[int, int, int]) -> int:
    """下卦三爻，初爻为 bit0"""
    return (
        (1 if _line_to_yang(lines_three[0]) else 0)
        + (2 if _line_to_yang(lines_three[1]) else 0)
        + (4 if _line_to_yang(lines_three[2]) else 0)
    )


def _six_lines_to_name(six: Tuple[int, ...]) -> str:
    low = _trigram_value(six[0:3])
    up = _trigram_value(six[3:6])
    return f"上{TRIGRAM_NAMES[up]}下{TRIGRAM_NAMES[low]}"


def _changing_lines(six: Tuple[int, ...]) -> List[int]:
    """动爻：老阴 6、老阳 9（1-based 爻位）"""
    return [i + 1 for i, v in enumerate(six) if v in (6, 9)]


def _apply_changes(six: Tuple[int, ...]) -> Tuple[int, ...]:
    """变卦：老阴变阳，老阳变阴"""
    out = []
    for v in six:
        if v == 6:
            out.append(7)  # 阴变老阳 → 阳爻用 7 表示
        elif v == 9:
            out.append(8)  # 阳变老阴 → 阴爻用 8 表示
        else:
            out.append(v)
    return tuple(out)


def _cast_line(rng: random.Random) -> int:
    """三钱法近似：6/7/8/9 概率 1/8, 3/8, 3/8, 1/8"""
    r = rng.random()
    if r < 0.125:
        return 6  # 老阴
    if r < 0.25:
        return 9  # 老阳
    if r < 0.625:
        return 7  # 少阳
    return 8  # 少阴


def cast_hexagram(seed: int) -> Tuple[int, ...]:
    rng = random.Random(seed)
    return tuple(_cast_line(rng) for _ in range(6))


def line_label(val: int) -> str:
    return {6: "老阴○", 7: "少阳—", 8: "少阴 - -", 9: "老阳○"}[val]


class YijingService:
    @staticmethod
    def handle_divination_request(body: Dict[str, Any]) -> Dict[str, Any]:
        try:
            question = (body.get("question") or "").strip()
            if not question or len(question) < 4:
                return {"success": False, "error": "请填写更具体的问题（至少4个字）", "code": 400}

            category = (body.get("category") or "general").strip()
            seed_in = body.get("seed")
            if seed_in is None:
                seed = hash(question) % (2**31)
            else:
                try:
                    seed = int(seed_in)
                except (TypeError, ValueError):
                    seed = hash(question) % (2**31)

            six = cast_hexagram(seed)
            changed = _apply_changes(six)
            ben_name = _six_lines_to_name(six)
            bian_name = _six_lines_to_name(changed)
            moving = _changing_lines(six)

            lines_detail = [
                {
                    "position": i + 1,
                    "value": six[i],
                    "label": line_label(six[i]),
                    "isMoving": six[i] in (6, 9),
                }
                for i in range(6)
            ]

            data = {
                "question": question,
                "category": category,
                "seed": seed,
                "benGua": ben_name,
                "bianGua": bian_name if moving else ben_name,
                "movingLines": moving,
                "lines": lines_detail,
                "principles": [
                    "疑则卜，不疑不卜",
                    "一事一卜，不可重复",
                    "结果仅供娱乐与文化参考，请理性决策",
                ],
            }
            return {"success": True, "data": data, "code": 200}
        except Exception as e:
            return {"success": False, "error": str(e), "code": 500}
