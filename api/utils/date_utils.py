# -*- coding: utf-8 -*-
"""
日期工具函数
处理日期解析和格式化
"""

import datetime


def parse_date(date_str):
    """解析日期字符串"""
    try:
        return datetime.datetime.strptime(date_str, "%Y-%m-%d")
    except:
        return datetime.datetime.now()


def parse_datetime(date_str, time_str):
    """解析日期和时间字符串"""
    try:
        dt_str = f"{date_str} {time_str}"
        return datetime.datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
    except:
        return datetime.datetime.now()


def get_week_day_cn(date):
    """获取中文星期"""
    weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    return weekdays[date.weekday()]
