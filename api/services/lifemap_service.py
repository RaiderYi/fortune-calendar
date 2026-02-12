# -*- coding: utf-8 -*-
"""
人生大图景服务
聚合未来多年的年度运势并输出趋势洞察
"""

import datetime
import math
import os
import sys
from typing import Dict, List

try:
    from .fortune_service import FortuneService
except ImportError:
    api_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if api_dir not in sys.path:
        sys.path.insert(0, api_dir)
    from services.fortune_service import FortuneService


class LifeMapService:
    @staticmethod
    def handle_trends_request(data: Dict) -> Dict:
        try:
            birth_date = data.get("birthDate")
            if not birth_date:
                return {"success": False, "error": "出生日期必填", "code": 400}

            birth_time = data.get("birthTime", "12:00")
            longitude = float(data.get("longitude", 120.0))
            gender = data.get("gender", "male")
            custom_yongshen = data.get("customYongShen")
            start_year = LifeMapService._safe_int(data.get("startYear"), datetime.datetime.now().year)
            years = LifeMapService._clamp_int(data.get("years", 10), 5, 20, 10)

            points: List[Dict] = []
            failed_years: List[int] = []

            for i in range(years):
                year = start_year + i
                payload = {
                    "year": year,
                    "birthDate": birth_date,
                    "birthTime": birth_time,
                    "longitude": longitude,
                    "gender": gender,
                    "customYongShen": custom_yongshen,
                }

                result = FortuneService.handle_fortune_year_request(payload)
                if not result.get("success"):
                    failed_years.append(year)
                    continue

                point = LifeMapService._build_point(result.get("data", {}), year)
                points.append(point)

            if not points:
                return {
                    "success": False,
                    "error": "年度趋势计算失败，请稍后重试",
                    "code": 500,
                }

            points = LifeMapService._attach_momentum(points)
            milestones = LifeMapService._build_milestones(points)
            summary = LifeMapService._build_summary(points, milestones, failed_years)
            strategy = LifeMapService._build_strategy(points, milestones)

            return {
                "success": True,
                "data": {
                    "startYear": start_year,
                    "years": years,
                    "points": points,
                    "milestones": milestones,
                    "summary": summary,
                    "strategy": strategy,
                    "failedYears": failed_years,
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
    def _build_point(data: Dict, year: int) -> Dict:
        dims = data.get("dimensions", {}) or {}
        career = LifeMapService._extract_dim_score(dims.get("career"), 50)
        wealth = LifeMapService._extract_dim_score(dims.get("wealth"), 50)
        romance = LifeMapService._extract_dim_score(dims.get("romance"), 50)
        health = LifeMapService._extract_dim_score(dims.get("health"), 50)
        academic = LifeMapService._extract_dim_score(dims.get("academic"), 50)
        travel = LifeMapService._extract_dim_score(dims.get("travel"), 50)
        total = LifeMapService._safe_int(data.get("totalScore"), 50)

        liu_nian = data.get("liuNian", {}) or {}
        gan = liu_nian.get("gan", "")
        zhi = liu_nian.get("zhi", "")
        gan_zhi = liu_nian.get("gan_zhi") or f"{gan}{zhi}" if (gan or zhi) else f"{year}"

        risk_level = "low" if total >= 75 else "medium" if total >= 55 else "high"
        confidence = max(35, min(97, int(total * 0.78 + (health + career) * 0.11)))

        return {
            "year": year,
            "ganZhi": gan_zhi,
            "overall": total,
            "career": career,
            "wealth": wealth,
            "romance": romance,
            "health": health,
            "academic": academic,
            "travel": travel,
            "riskLevel": risk_level,
            "confidence": confidence,
        }

    @staticmethod
    def _extract_dim_score(raw, default_value: int) -> int:
        if isinstance(raw, dict):
            raw = raw.get("score", default_value)
        return max(0, min(100, LifeMapService._safe_int(raw, default_value)))

    @staticmethod
    def _attach_momentum(points: List[Dict]) -> List[Dict]:
        if not points:
            return points
        out: List[Dict] = []
        prev = points[0]["overall"]
        for idx, item in enumerate(points):
            if idx == 0:
                trend = "stable"
                delta = 0
            else:
                delta = item["overall"] - prev
                trend = "up" if delta >= 6 else "down" if delta <= -6 else "stable"
            prev = item["overall"]
            next_item = dict(item)
            next_item["momentum"] = {
                "delta": delta,
                "trend": trend,
            }
            out.append(next_item)
        return out

    @staticmethod
    def _build_milestones(points: List[Dict]) -> List[Dict]:
        peak = max(points, key=lambda x: x["overall"])
        trough = min(points, key=lambda x: x["overall"])
        sorted_career = sorted(points, key=lambda x: x["career"], reverse=True)
        sorted_wealth = sorted(points, key=lambda x: x["wealth"], reverse=True)
        sorted_romance = sorted(points, key=lambda x: x["romance"], reverse=True)

        milestones = [
            {
                "type": "peak",
                "year": peak["year"],
                "title": "运势峰值窗口",
                "score": peak["overall"],
                "detail": f"综合分达到 {peak['overall']}，适合推进关键计划",
            },
            {
                "type": "trough",
                "year": trough["year"],
                "title": "谨慎调整窗口",
                "score": trough["overall"],
                "detail": f"综合分 {trough['overall']}，建议防守与修整",
            },
            {
                "type": "career",
                "year": sorted_career[0]["year"],
                "title": "事业突破点",
                "score": sorted_career[0]["career"],
                "detail": f"事业维度最佳（{sorted_career[0]['career']}）",
            },
            {
                "type": "wealth",
                "year": sorted_wealth[0]["year"],
                "title": "财务扩张点",
                "score": sorted_wealth[0]["wealth"],
                "detail": f"财运维度最佳（{sorted_wealth[0]['wealth']}）",
            },
            {
                "type": "romance",
                "year": sorted_romance[0]["year"],
                "title": "关系升温点",
                "score": sorted_romance[0]["romance"],
                "detail": f"感情维度最佳（{sorted_romance[0]['romance']}）",
            },
        ]

        unique = {}
        for item in milestones:
            key = f"{item['type']}:{item['year']}"
            unique[key] = item
        return list(unique.values())

    @staticmethod
    def _build_summary(points: List[Dict], milestones: List[Dict], failed_years: List[int]) -> Dict:
        overall_values = [p["overall"] for p in points]
        average = int(sum(overall_values) / len(overall_values))
        variance = sum((x - average) ** 2 for x in overall_values) / len(overall_values)
        volatility = round(math.sqrt(variance), 2)

        first_half = points[: max(1, len(points) // 2)]
        second_half = points[len(points) // 2 :]
        first_avg = sum(p["overall"] for p in first_half) / len(first_half)
        second_avg = sum(p["overall"] for p in second_half) / max(1, len(second_half))

        if second_avg > first_avg + 4:
            trend = "rising"
        elif first_avg > second_avg + 4:
            trend = "falling"
        else:
            trend = "stable"

        confidence = int(sum(p["confidence"] for p in points) / len(points))

        return {
            "average": average,
            "volatility": volatility,
            "trend": trend,
            "confidence": confidence,
            "peakYear": max(points, key=lambda x: x["overall"])["year"],
            "troughYear": min(points, key=lambda x: x["overall"])["year"],
            "failedYears": failed_years,
            "milestoneCount": len(milestones),
        }

    @staticmethod
    def _build_strategy(points: List[Dict], milestones: List[Dict]) -> List[Dict]:
        avg = int(sum(p["overall"] for p in points) / len(points))
        peak = max(points, key=lambda x: x["overall"])
        trough = min(points, key=lambda x: x["overall"])
        best_health = max(points, key=lambda x: x["health"])

        actions = []
        actions.append(
            {
                "id": "core-window",
                "title": "核心推进窗口",
                "detail": f"{peak['year']} 年综合势能最强，适合启动长期计划与关键节点升级。",
                "priority": "high",
            }
        )
        actions.append(
            {
                "id": "risk-window",
                "title": "风险控制窗口",
                "detail": f"{trough['year']} 年建议控制杠杆、降低试错成本，优先稳态运营。",
                "priority": "medium",
            }
        )
        actions.append(
            {
                "id": "health-anchor",
                "title": "状态管理锚点",
                "detail": f"{best_health['year']} 年健康维度最佳（{best_health['health']}），适合拉升节奏与体能储备。",
                "priority": "medium",
            }
        )
        actions.append(
            {
                "id": "baseline",
                "title": "长期基线策略",
                "detail": f"未来区间平均分约 {avg}。建议采用“高势能年份进攻、低势能年份修整”的双节奏策略。",
                "priority": "low",
            }
        )

        milestone_years = sorted({m["year"] for m in milestones})
        actions.append(
            {
                "id": "milestone-map",
                "title": "里程碑路线图",
                "detail": f"建议重点关注年份：{', '.join(str(y) for y in milestone_years)}。",
                "priority": "low",
            }
        )
        return actions

    @staticmethod
    def _safe_int(value, default_value: int) -> int:
        try:
            return int(value)
        except Exception:
            return default_value

    @staticmethod
    def _clamp_int(value, min_v: int, max_v: int, default_v: int) -> int:
        n = LifeMapService._safe_int(value, default_v)
        return max(min_v, min(max_v, n))
