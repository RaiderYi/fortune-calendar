# -*- coding: utf-8 -*-
"""
JSON 工具函数
处理 JSON 序列化，特别是 datetime 对象的处理
"""

import json
import datetime


class DateTimeJSONEncoder(json.JSONEncoder):
    """自定义 JSON 编码器，处理 datetime 对象和其他不可序列化类型"""
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        elif isinstance(obj, datetime.date):
            return obj.isoformat()
        elif isinstance(obj, datetime.time):
            return obj.isoformat()
        elif hasattr(obj, '__dict__'):
            # 尝试序列化对象为字典
            return obj.__dict__
        return super().default(obj)


def clean_for_json(obj):
    """
    递归清理数据，确保所有对象都可以被 JSON 序列化
    
    参数:
        obj: 要清理的对象（可以是 dict, list, 或其他类型）
    
    返回:
        清理后的对象
    """
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    elif isinstance(obj, datetime.date):
        return obj.isoformat()
    elif isinstance(obj, datetime.time):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {key: clean_for_json(value) for key, value in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [clean_for_json(item) for item in obj]
    elif hasattr(obj, '__dict__'):
        # 如果是自定义对象，尝试转换为字典
        try:
            return clean_for_json(obj.__dict__)
        except:
            return str(obj)
    else:
        # 基本类型（str, int, float, bool, None）直接返回
        return obj


def safe_json_dumps(obj, **kwargs):
    """
    安全的 JSON 序列化函数，自动处理不可序列化的对象
    
    参数:
        obj: 要序列化的对象
        **kwargs: 传递给 json.dumps 的其他参数
    
    返回:
        JSON 字符串
    """
    try:
        # 先尝试使用自定义编码器
        return json.dumps(obj, cls=DateTimeJSONEncoder, ensure_ascii=False, **kwargs)
    except (TypeError, ValueError) as e:
        # 如果编码器失败，使用清理函数
        print(f"[WARNING] JSON 编码器失败，使用清理函数: {e}")
        cleaned_obj = clean_for_json(obj)
        return json.dumps(cleaned_obj, ensure_ascii=False, **kwargs)
