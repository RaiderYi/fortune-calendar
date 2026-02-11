# -*- coding: utf-8 -*-
"""
邮件发送服务 - 使用 Resend API，兼容 Vercel Serverless
"""

import os
import json
import urllib.request
from typing import Optional


async def send_verification_email(to_email: str, code: str) -> dict:
    """
    发送验证码邮件
    开发环境：直接返回验证码（不实际发送）
    生产环境：使用 Resend 发送
    """
    
    api_key = os.environ.get('RESEND_API_KEY')
    is_dev = os.environ.get('VERCEL_ENV') != 'production'
    
    # 开发环境：打印验证码到日志，不实际发送
    if is_dev or not api_key:
        print(f"\n{'='*50}")
        print(f"[DEV] 验证码邮件")
        print(f"收件人: {to_email}")
        print(f"验证码: {code}")
        print(f"{'='*50}\n")
        return {
            'success': True,
            'message': '开发模式：验证码已打印到日志',
            'debug_code': code
        }
    
    # 生产环境：使用 Resend 发送
    from_email = "Fortune Calendar <onboarding@resend.dev>"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>邮箱验证</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td style="padding: 40px;">
                                <div style="text-align: center; margin-bottom: 32px;">
                                    <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1, #a855f7); border-radius: 16px; line-height: 64px; color: white; font-size: 32px;">
                                        ✨
                                    </div>
                                </div>
                                
                                <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">
                                    命运日历
                                </h1>
                                
                                <p style="margin: 0 0 24px; font-size: 16px; color: #6b7280; text-align: center; line-height: 1.5;">
                                    您好！感谢您注册命运日历。您的验证码是：
                                </p>
                                
                                <div style="background: linear-gradient(135deg, #eff6ff, #f3e8ff); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                                    <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #6366f1; font-family: monospace;">
                                        {code}
                                    </div>
                                </div>
                                
                                <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280; text-align: center;">
                                    验证码5分钟内有效，请勿泄露给他人。
                                </p>
                                
                                <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                                    如非本人操作，请忽略此邮件。
                                </p>
                            </td>
                        </tr>
                    </table>
                    
                    <p style="margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center;">
                        © 2026 命运日历 Fortune Calendar. All rights reserved.
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    text_content = f"""
    命运日历 - 邮箱验证
    
    您的验证码是：{code}
    
    验证码5分钟内有效，请勿泄露给他人。
    如非本人操作，请忽略此邮件。
    """
    
    data = {
        "from": from_email,
        "to": to_email,
        "subject": "命运日历 - 邮箱验证码",
        "text": text_content,
        "html": html_content
    }
    
    try:
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(data).encode('utf-8'),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode())
            return {
                'success': True,
                'message': '邮件已发送',
                'id': result.get('id')
            }
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"[Email Error] HTTP {e.code}: {error_body}")
        return {
            'success': False,
            'error': f'邮件发送失败: {e.code}'
        }
    except Exception as e:
        print(f"[Email Error] {e}")
        return {
            'success': False,
            'error': '邮件服务暂时不可用'
        }


# 兼容同步调用（Vercel 环境）
def send_verification_email_sync(to_email: str, code: str) -> dict:
    """同步版本的邮件发送（用于不支持 async 的场景）"""
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    return loop.run_until_complete(send_verification_email(to_email, code))
