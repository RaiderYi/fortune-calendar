# -*- coding: utf-8 -*-
"""
Vercel KV 客户端 - 兼容 Vercel Serverless 环境
使用 urllib 避免额外依赖
"""

import os
import json
from typing import Any, Optional


class VercelKV:
    """Vercel KV 客户端封装"""
    
    def __init__(self):
        # Vercel 自动注入环境变量
        self.rest_api_url = os.environ.get('KV_REST_API_URL')
        self.rest_api_token = os.environ.get('KV_REST_API_TOKEN')
        
        if not self.rest_api_url or not self.rest_api_token:
            print("[Warning] KV environment variables not set, using mock storage")
            self._mock_storage = {}
    
    def _is_mock(self) -> bool:
        return not self.rest_api_url or not self.rest_api_token
    
    async def get(self, key: str) -> Optional[Any]:
        """获取值"""
        if self._is_mock():
            return self._mock_storage.get(key)
        
        import urllib.request
        import urllib.error
        
        try:
            req = urllib.request.Request(
                f"{self.rest_api_url}/get/{key}",
                headers={"Authorization": f"Bearer {self.rest_api_token}"}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                result = json.loads(response.read().decode())
                value = result.get('result')
                # Vercel KV 存储的是 JSON 字符串，需要解析
                if isinstance(value, str):
                    try:
                        return json.loads(value)
                    except:
                        return value
                return value
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            print(f"[KV GET Error] {key}: {e}")
            return None
        except Exception as e:
            print(f"[KV GET Error] {key}: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """设置值"""
        if self._is_mock():
            self._mock_storage[key] = value
            return True
        
        import urllib.request
        
        try:
            # Vercel KV 需要 JSON 字符串
            json_value = json.dumps(value)
            
            url = f"{self.rest_api_url}/set/{key}"
            if ttl:
                url += f"?ex={ttl}"
            
            req = urllib.request.Request(
                url,
                data=json_value.encode(),
                headers={
                    "Authorization": f"Bearer {self.rest_api_token}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                return True
        except Exception as e:
            print(f"[KV SET Error] {key}: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """删除值"""
        if self._is_mock():
            self._mock_storage.pop(key, None)
            return True
        
        import urllib.request
        
        try:
            req = urllib.request.Request(
                f"{self.rest_api_url}/del/{key}",
                headers={"Authorization": f"Bearer {self.rest_api_token}"},
                method="DELETE"
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                return True
        except Exception as e:
            print(f"[KV DEL Error] {key}: {e}")
            return False
    
    async def hget(self, key: str, field: str) -> Optional[Any]:
        """获取 Hash 字段"""
        if self._is_mock():
            data = self._mock_storage.get(key, {})
            return data.get(field)
        
        # Vercel KV 原生不支持 HGET，使用 JSON 对象模拟
        data = await self.get(key)
        if isinstance(data, dict):
            return data.get(field)
        return None
    
    async def hset(self, key: str, field: str, value: Any) -> bool:
        """设置 Hash 字段"""
        if self._is_mock():
            if key not in self._mock_storage:
                self._mock_storage[key] = {}
            self._mock_storage[key][field] = value
            return True
        
        # 先获取整个对象，修改后重新设置
        data = await self.get(key) or {}
        if not isinstance(data, dict):
            data = {}
        data[field] = value
        return await self.set(key, data)
    
    async def hgetall(self, key: str) -> dict:
        """获取整个 Hash"""
        if self._is_mock():
            return self._mock_storage.get(key, {})
        
        data = await self.get(key)
        if isinstance(data, dict):
            return data
        return {}


# 全局实例
kv = VercelKV()
