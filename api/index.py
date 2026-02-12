# -*- coding: utf-8 -*-
"""
Fortune Calendar API - Vercel Python entrypoint
"""

import datetime
import json
import os
import sys
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse


api_dir = os.path.dirname(os.path.abspath(__file__))
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)


class handler(BaseHTTPRequestHandler):
    """Vercel Python handler."""

    def do_OPTIONS(self):
        self._send_json(204, {})

    def do_GET(self):
        self._handle_request("GET")

    def do_POST(self):
        self._handle_request("POST")

    def do_PUT(self):
        self._handle_request("PUT")

    def do_DELETE(self):
        self._handle_request("DELETE")

    def log_message(self, format, *args):  # noqa: A003
        # Silence default access logs in serverless runtime.
        return

    def _read_body_json(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length <= 0:
            return {}

        raw = self.rfile.read(content_length)
        if not raw:
            return {}

        try:
            body_text = raw.decode("utf-8")
        except UnicodeDecodeError:
            body_text = raw.decode("utf-8", errors="ignore")

        try:
            parsed = json.loads(body_text) if body_text else {}
            return parsed if isinstance(parsed, dict) else {}
        except Exception:
            return {}

    def _send_json(self, status_code, data):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        content_length = 0 if status_code == 204 else len(payload)
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Length", str(content_length))
        self.end_headers()
        if status_code != 204:
            self.wfile.write(payload)

    def _send_route_result(self, result_json):
        try:
            result_data = json.loads(result_json)
        except Exception as e:
            self._send_json(500, {"success": False, "error": f"Invalid route response: {e}"})
            return

        status = result_data.pop("code", 200 if result_data.get("success") else 400)
        self._send_json(status, result_data)

    def _handle_request(self, method):
        parsed = urlparse(self.path)
        path = parsed.path
        headers = {k: v for k, v in self.headers.items()}
        body = self._read_body_json() if method in ("POST", "PUT", "DELETE") else {}

        if path == "/" or path == "/api":
            self._send_json(
                200,
                {
                    "success": True,
                    "message": "Fortune Calendar API v2.1",
                    "timestamp": datetime.datetime.now().isoformat(),
                },
            )
            return

        try:
            if path.startswith("/api/auth") or path.startswith("/api/invite") or path.startswith("/api/user"):
                from routes.auth_routes import handle_auth_request

                result = handle_auth_request(path, method, body, headers)
                self._send_route_result(result)
                return

            if path.startswith("/api/sync"):
                from routes.sync_routes import handle_sync_request

                result = handle_sync_request(path, method, body, headers)
                self._send_route_result(result)
                return

            if path.endswith("/date-picker/recommend"):
                from services.date_picker_service import DatePickerService

                result = DatePickerService.handle_recommend_request(body)
                status = result.pop("code", 200)
                self._send_json(status, result)
                return

            if path.endswith("/lifemap/trends"):
                from services.lifemap_service import LifeMapService

                result = LifeMapService.handle_trends_request(body)
                status = result.pop("code", 200)
                self._send_json(status, result)
                return

            if path.endswith("/fortune"):
                from services.fortune_service import FortuneService

                result = FortuneService.handle_fortune_request(body)
                status = result.pop("code", 200)
                self._send_json(status, result)
                return

            if path.endswith("/fortune-year"):
                from services.fortune_service import FortuneService

                result = FortuneService.handle_fortune_year_request(body)
                status = result.pop("code", 200)
                self._send_json(status, result)
                return

            if path.endswith("/ai-chat"):
                from services.ai_service import AIService

                messages = body.get("messages", [])
                bazi_context = body.get("baziContext", {})

                api_key = os.environ.get("DEEPSEEK_API_KEY")
                if not api_key:
                    self._send_json(500, {"success": False, "error": "AI not configured"})
                    return

                system_prompt = AIService.build_bazi_system_prompt(bazi_context)
                full_messages = [{"role": "system", "content": system_prompt}] + messages
                ai_message = AIService.call_deepseek_api(api_key, full_messages)
                self._send_json(200, {"success": True, "message": ai_message})
                return

            self._send_json(404, {"success": False, "error": "Not found"})
        except Exception as e:
            import traceback

            print(f"[CRITICAL] {e}")
            traceback.print_exc()
            self._send_json(
                500,
                {
                    "success": False,
                    "error": "Internal Server Error",
                    "details": str(e),
                },
            )
