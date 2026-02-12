# -*- coding: utf-8 -*-
"""
择日推荐服务
提供场景化权重、风险分级与可解释推荐
"""

import datetime
import os
import sys
from typing import Dict, List, Tuple

try:
    from .fortune_service import FortuneService
except ImportError:
    api_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if api_dir not in sys.path:
        sys.path.insert(0, api_dir)
    from services.fortune_service import FortuneService


PURPOSE_DIMENSION = {
    "moving": "career",
    "opening": "wealth",
    "travel": "travel",
    "romance": "romance",
    "wealth": "wealth",
    "academic": "academic",
    "other": "overall",
}

PURPOSE_WEIGHTS: Dict[str, Dict[str, float]] = {
    "moving": {"career": 0.40, "wealth": 0.10, "romance": 0.05, "health": 0.25, "academic": 0.05, "travel": 0.15},
    "opening": {"career": 0.15, "wealth": 0.50, "romance": 0.05, "health": 0.10, "academic": 0.05, "travel": 0.15},
    "travel": {"career": 0.05, "wealth": 0.10, "romance": 0.10, "health": 0.30, "academic": 0.05, "travel": 0.40},
    "romance": {"career": 0.05, "wealth": 0.05, "romance": 0.55, "health": 0.15, "academic": 0.05, "travel": 0.15},
    "wealth": {"career": 0.20, "wealth": 0.45, "romance": 0.05, "health": 0.10, "academic": 0.05, "travel": 0.15},
    "academic": {"career": 0.20, "wealth": 0.05, "romance": 0.05, "health": 0.10, "academic": 0.50, "travel": 0.10},
    "other": {"career": 0.20, "wealth": 0.20, "romance": 0.15, "health": 0.15, "academic": 0.15, "travel": 0.15},
}


class DatePickerService:
    @staticmethod
    def handle_recommend_request(data: Dict) -> Dict:
        """计算择日推荐结果"""
        try:
            birth_date_str = data.get("birthDate")
            if not birth_date_str:
                return {"success": False, "error": "出生日期必填", "code": 400}

            birth_time_str = data.get("birthTime", "12:00")
            longitude = float(data.get("longitude", 120.0))
            gender = data.get("gender", "male")
            custom_yongshen = data.get("customYongShen")

            purpose = str(data.get("purpose", "other") or "other")
            if purpose not in PURPOSE_DIMENSION:
                purpose = "other"

            range_days = DatePickerService._clamp_int(data.get("rangeDays", 14), 3, 60, 14)
            top_n = DatePickerService._clamp_int(data.get("topN", 10), 3, 20, 10)
            weekend_policy = str(data.get("weekendPolicy", "all") or "all")
            if weekend_policy not in ("all", "weekend_only", "workday_only"):
                weekend_policy = "all"

            excluded_dates = data.get("excludedDates", []) or []
            excluded_set = {str(v) for v in excluded_dates if isinstance(v, str)}

            start_date = DatePickerService._parse_start_date(data.get("startDate"))
            base_payload = {
                "birthDate": birth_date_str,
                "birthTime": birth_time_str,
                "longitude": longitude,
                "gender": gender,
                "customYongShen": custom_yongshen,
            }

            candidates = []
            skipped_days = 0
            failed_days = 0

            for offset in range(range_days):
                date_obj = start_date + datetime.timedelta(days=offset)
                date_str = date_obj.strftime("%Y-%m-%d")

                if date_str in excluded_set:
                    skipped_days += 1
                    continue

                weekday = date_obj.weekday()
                is_weekend = weekday >= 5
                if weekend_policy == "weekend_only" and not is_weekend:
                    skipped_days += 1
                    continue
                if weekend_policy == "workday_only" and is_weekend:
                    skipped_days += 1
                    continue

                request_payload = dict(base_payload)
                request_payload["date"] = date_str

                fortune_result = FortuneService.handle_fortune_request(request_payload)
                if not fortune_result.get("success") or "data" not in fortune_result:
                    failed_days += 1
                    continue

                candidate = DatePickerService._build_candidate(date_obj, purpose, fortune_result["data"])
                candidates.append(candidate)

            if not candidates:
                return {
                    "success": False,
                    "error": "未生成可用日期，请调整筛选条件后重试",
                    "code": 400,
                }

            ranked = sorted(
                candidates,
                key=lambda x: (
                    -x["purposeScore"],
                    -x["totalScore"],
                    x["riskWeight"],
                    x["date"],
                ),
            )
            recommendations = ranked[:top_n]
            timeline = sorted(candidates, key=lambda x: x["date"])

            summary = DatePickerService._build_summary(timeline, recommendations, failed_days)

            return {
                "success": True,
                "data": {
                    "purpose": purpose,
                    "startDate": start_date.strftime("%Y-%m-%d"),
                    "rangeDays": range_days,
                    "scannedDays": len(candidates),
                    "skippedDays": skipped_days,
                    "failedDays": failed_days,
                    "recommendedCount": len(recommendations),
                    "recommendations": recommendations,
                    "timeline": timeline,
                    "summary": summary,
                },
                "code": 200,
            }
        except Exception as e:
            import traceback

            return {
                "success": False,
                "error": str(e),
                "traceback": traceback.format_exc(),
                "code": 500,
            }

    @staticmethod
    def _parse_start_date(value) -> datetime.date:
        if isinstance(value, str):
            try:
                return datetime.datetime.strptime(value, "%Y-%m-%d").date()
            except Exception:
                pass
        return datetime.date.today()

    @staticmethod
    def _clamp_int(value, min_v: int, max_v: int, default_v: int) -> int:
        try:
            n = int(value)
            return max(min_v, min(max_v, n))
        except Exception:
            return default_v

    @staticmethod
    def _build_candidate(date_obj: datetime.date, purpose: str, fortune_data: Dict) -> Dict:
        fortune = fortune_data.get("fortune", {})
        dimensions = DatePickerService._extract_dimension_scores(fortune.get("dimensions", {}))
        total_score = int(fortune.get("totalScore", 50))
        purpose_score = DatePickerService._calculate_purpose_score(purpose, total_score, dimensions)
        risk_level, risk_weight, risk_flags = DatePickerService._analyze_risk(
            purpose=purpose,
            date_obj=date_obj,
            total_score=total_score,
            purpose_score=purpose_score,
            dimensions=dimensions,
        )
        confidence = max(35, min(99, int(purpose_score - risk_weight * 8 + (total_score - 60) * 0.2)))
        highlights, cautions = DatePickerService._build_explanations(dimensions)
        best_time_window = DatePickerService._suggest_time_window(purpose, date_obj.weekday(), purpose_score)

        liu_ri = fortune.get("liuRi", {}) or {}
        liu_nian = fortune.get("liuNian", {}) or {}
        liu_yue = fortune.get("liuYue", {}) or {}

        tags = DatePickerService._build_tags(purpose_score, total_score, risk_level)

        return {
            "date": date_obj.strftime("%Y-%m-%d"),
            "weekday": date_obj.weekday(),
            "totalScore": total_score,
            "purposeScore": purpose_score,
            "confidence": confidence,
            "riskLevel": risk_level,
            "riskWeight": risk_weight,
            "riskFlags": risk_flags,
            "bestTimeWindow": best_time_window,
            "mainTheme": fortune.get("mainTheme", {}),
            "dimensions": dimensions,
            "highlights": highlights,
            "cautions": cautions,
            "tags": tags,
            "liu": {
                "nian": f"{liu_nian.get('gan', '')}{liu_nian.get('zhi', '')}",
                "yue": f"{liu_yue.get('gan', '')}{liu_yue.get('zhi', '')}",
                "ri": f"{liu_ri.get('gan', '')}{liu_ri.get('zhi', '')}",
            },
        }

    @staticmethod
    def _extract_dimension_scores(dimensions: Dict) -> Dict[str, int]:
        keys = ["career", "wealth", "romance", "health", "academic", "travel"]
        scores: Dict[str, int] = {}
        for key in keys:
            raw = dimensions.get(key, 50)
            if isinstance(raw, dict):
                raw = raw.get("score", 50)
            try:
                scores[key] = max(0, min(100, int(raw)))
            except Exception:
                scores[key] = 50
        return scores

    @staticmethod
    def _calculate_purpose_score(purpose: str, total_score: int, dimensions: Dict[str, int]) -> int:
        weights = PURPOSE_WEIGHTS.get(purpose, PURPOSE_WEIGHTS["other"])
        weighted_dim = 0.0
        for key, weight in weights.items():
            weighted_dim += dimensions.get(key, 50) * weight

        core_dim = PURPOSE_DIMENSION.get(purpose, "overall")
        core_score = total_score if core_dim == "overall" else dimensions.get(core_dim, total_score)
        blended = weighted_dim * 0.55 + core_score * 0.25 + total_score * 0.20
        return max(0, min(100, int(round(blended))))

    @staticmethod
    def _analyze_risk(
        purpose: str,
        date_obj: datetime.date,
        total_score: int,
        purpose_score: int,
        dimensions: Dict[str, int],
    ) -> Tuple[str, int, List[str]]:
        flags: List[str] = []

        if total_score < 52:
            flags.append("global_score_low")
        if purpose_score < 58:
            flags.append("purpose_score_low")

        core_dim = PURPOSE_DIMENSION.get(purpose, "overall")
        if core_dim != "overall" and dimensions.get(core_dim, 50) < 55:
            flags.append("core_dimension_weak")

        if purpose in ("opening", "academic") and date_obj.weekday() >= 5:
            flags.append("weekend_mismatch")

        if dimensions.get("health", 50) < 45:
            flags.append("health_drag")

        weight = len(flags)
        if total_score < 45 or purpose_score < 48:
            weight += 1

        if weight <= 1:
            return "low", weight, flags
        if weight <= 3:
            return "medium", weight, flags
        return "high", weight, flags

    @staticmethod
    def _build_explanations(dimensions: Dict[str, int]) -> Tuple[List[str], List[str]]:
        zh_label = {
            "career": "事业",
            "wealth": "财运",
            "romance": "感情",
            "health": "健康",
            "academic": "学业",
            "travel": "出行",
        }

        ordered = sorted(dimensions.items(), key=lambda x: x[1], reverse=True)
        highlights = [f"{zh_label[k]}势能强（{v}）" for k, v in ordered[:2]]

        low_dims = [(k, v) for k, v in ordered[::-1] if v < 58][:2]
        cautions = [f"{zh_label[k]}偏弱（{v}），建议保守操作" for k, v in low_dims]
        if not cautions:
            cautions = ["整体风险可控，按计划推进即可"]
        return highlights, cautions

    @staticmethod
    def _suggest_time_window(purpose: str, weekday: int, purpose_score: int) -> str:
        slots = {
            "moving": ["07:00-09:00", "09:00-11:00", "13:00-15:00"],
            "opening": ["09:00-11:00", "11:00-13:00", "15:00-17:00"],
            "travel": ["07:00-09:00", "13:00-15:00", "17:00-19:00"],
            "romance": ["11:00-13:00", "15:00-17:00", "19:00-21:00"],
            "wealth": ["09:00-11:00", "13:00-15:00", "15:00-17:00"],
            "academic": ["07:00-09:00", "09:00-11:00", "19:00-21:00"],
            "other": ["09:00-11:00", "13:00-15:00", "15:00-17:00"],
        }
        purpose_slots = slots.get(purpose, slots["other"])
        pick = purpose_slots[weekday % len(purpose_slots)]
        if purpose_score >= 85:
            return f"{pick}（强推）"
        return pick

    @staticmethod
    def _build_tags(purpose_score: int, total_score: int, risk_level: str) -> List[str]:
        tags = []
        if purpose_score >= 88:
            tags.append("场景高契合")
        if total_score >= 85:
            tags.append("势能峰值")
        if risk_level == "low":
            tags.append("低风险")
        if not tags:
            tags.append("均衡可用")
        return tags[:3]

    @staticmethod
    def _build_summary(timeline: List[Dict], recommendations: List[Dict], failed_days: int) -> Dict:
        ordered = sorted(timeline, key=lambda x: x["date"])
        best = recommendations[0]
        worst = min(timeline, key=lambda x: x["purposeScore"])
        first_half = ordered[: max(1, len(ordered) // 2)]
        second_half = ordered[len(ordered) // 2 :]

        first_avg = sum(x["purposeScore"] for x in first_half) / len(first_half)
        second_avg = sum(x["purposeScore"] for x in second_half) / max(1, len(second_half))
        if second_avg > first_avg + 4:
            trend = "rising"
        elif first_avg > second_avg + 4:
            trend = "falling"
        else:
            trend = "stable"

        avg_conf = int(sum(x["confidence"] for x in timeline) / max(1, len(timeline)))

        return {
            "bestDate": best["date"],
            "bestScore": best["purposeScore"],
            "worstDate": worst["date"],
            "worstScore": worst["purposeScore"],
            "trend": trend,
            "averageConfidence": avg_conf,
            "failedDays": failed_days,
        }
