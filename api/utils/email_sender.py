# -*- coding: utf-8 -*-
"""
邮件发送工具
支持 SendGrid, SMTP 等多种发送方式
"""

import os
import json
from typing import Optional, Dict, List
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

# 环境变量配置
EMAIL_PROVIDER = os.environ.get('EMAIL_PROVIDER', 'smtp')  # smtp, sendgrid, mailgun
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.qq.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '465'))
SMTP_USER = os.environ.get('SMTP_USER', '429507312@qq.com')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', 'qvlvbtmjecfpbjhj')
SMTP_USE_SSL = os.environ.get('SMTP_USE_SSL', 'true').lower() == 'true'

SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY', '')
MAILGUN_API_KEY = os.environ.get('MAILGUN_API_KEY', '')
MAILGUN_DOMAIN = os.environ.get('MAILGUN_DOMAIN', '')

FROM_EMAIL = os.environ.get('FROM_EMAIL', 'noreply@fortune-calendar.com')
FROM_NAME = os.environ.get('FROM_NAME', '命运日历')

SITE_URL = os.environ.get('SITE_URL', 'https://fortune-calendar.vercel.app')


class EmailSender:
    """邮件发送器"""
    
    def __init__(self):
        self.provider = EMAIL_PROVIDER
        self.from_email = FROM_EMAIL
        self.from_name = FROM_NAME
    
    def send(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """
        发送邮件
        
        Args:
            to_email: 收件人邮箱
            subject: 邮件主题
            html_content: HTML 内容
            text_content: 纯文本内容（可选）
        
        Returns:
            是否发送成功
        """
        try:
            if self.provider == 'sendgrid':
                return self._send_via_sendgrid(to_email, subject, html_content, text_content)
            elif self.provider == 'mailgun':
                return self._send_via_mailgun(to_email, subject, html_content, text_content)
            else:
                return self._send_via_smtp(to_email, subject, html_content, text_content)
        except Exception as e:
            print(f"邮件发送失败: {e}")
            return False
    
    def _send_via_smtp(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """通过 SMTP 发送邮件"""
        if not SMTP_USER or not SMTP_PASSWORD:
            print("SMTP 配置不完整，跳过邮件发送")
            return False
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"{self.from_name} <{self.from_email}>"
        msg['To'] = to_email
        
        if text_content:
            msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))
        
        try:
            if SMTP_USE_SSL:
                server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
            else:
                server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
                server.starttls()
            
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(self.from_email, to_email, msg.as_string())
            server.quit()
            return True
        except Exception as e:
            print(f"SMTP 发送失败: {e}")
            return False
    
    def _send_via_sendgrid(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """通过 SendGrid 发送邮件"""
        if not SENDGRID_API_KEY:
            print("SendGrid API Key 未配置")
            return False
        
        try:
            import urllib.request
            
            data = {
                "personalizations": [{"to": [{"email": to_email}]}],
                "from": {"email": self.from_email, "name": self.from_name},
                "subject": subject,
                "content": [
                    {"type": "text/html", "value": html_content}
                ]
            }
            
            if text_content:
                data["content"].insert(0, {"type": "text/plain", "value": text_content})
            
            req = urllib.request.Request(
                'https://api.sendgrid.com/v3/mail/send',
                data=json.dumps(data).encode('utf-8'),
                headers={
                    'Authorization': f'Bearer {SENDGRID_API_KEY}',
                    'Content-Type': 'application/json'
                },
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                return response.status == 202
        except Exception as e:
            print(f"SendGrid 发送失败: {e}")
            return False
    
    def _send_via_mailgun(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """通过 Mailgun 发送邮件"""
        if not MAILGUN_API_KEY or not MAILGUN_DOMAIN:
            print("Mailgun 配置不完整")
            return False
        
        try:
            import urllib.request
            import urllib.parse
            import base64
            
            data = urllib.parse.urlencode({
                'from': f'{self.from_name} <{self.from_email}>',
                'to': to_email,
                'subject': subject,
                'html': html_content,
                'text': text_content or '',
            }).encode('utf-8')
            
            credentials = base64.b64encode(f'api:{MAILGUN_API_KEY}'.encode()).decode()
            
            req = urllib.request.Request(
                f'https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages',
                data=data,
                headers={
                    'Authorization': f'Basic {credentials}',
                },
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                return response.status == 200
        except Exception as e:
            print(f"Mailgun 发送失败: {e}")
            return False


# 邮件模板
class EmailTemplates:
    """邮件模板"""
    
    @staticmethod
    def verification_email(token: str, email: str) -> Dict[str, str]:
        """验证邮件模板"""
        verification_url = f"{SITE_URL}/verify?token={token}&email={email}"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }}
                .footer {{ text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔮 命运日历</h1>
                    <p>验证您的邮箱</p>
                </div>
                <div class="content">
                    <p>您好！</p>
                    <p>感谢您订阅命运日历的运势日报。请点击下方按钮验证您的邮箱：</p>
                    <p style="text-align: center;">
                        <a href="{verification_url}" class="button">验证邮箱</a>
                    </p>
                    <p>或者复制以下链接到浏览器：</p>
                    <p style="word-break: break-all; color: #6366f1;">{verification_url}</p>
                    <p>如果您没有订阅，请忽略此邮件。</p>
                </div>
                <div class="footer">
                    <p>© 2024 命运日历 | Fortune Calendar</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
命运日历 - 验证您的邮箱

您好！

感谢您订阅命运日历的运势日报。请点击以下链接验证您的邮箱：

{verification_url}

如果您没有订阅，请忽略此邮件。

© 2024 命运日历 | Fortune Calendar
        """
        
        return {
            'subject': '【命运日历】请验证您的邮箱',
            'html': html,
            'text': text
        }
    
    @staticmethod
    def welcome_email(email: str) -> Dict[str, str]:
        """欢迎邮件模板"""
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .feature {{ background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }}
                .footer {{ text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 欢迎加入命运日历！</h1>
                </div>
                <div class="content">
                    <p>您好！</p>
                    <p>恭喜您成功订阅命运日历运势日报！从明天开始，您将收到每日运势分析。</p>
                    
                    <h3>📧 您将收到：</h3>
                    <div class="feature">📅 每日运势评分和关键词</div>
                    <div class="feature">💼 事业、财运、感情等维度分析</div>
                    <div class="feature">💡 每日行动建议</div>
                    
                    <p>访问 <a href="{SITE_URL}">{SITE_URL}</a> 获取更详细的运势分析！</p>
                </div>
                <div class="footer">
                    <p>© 2024 命运日历 | Fortune Calendar</p>
                    <p><a href="{SITE_URL}/unsubscribe?email={email}">取消订阅</a></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
欢迎加入命运日历！

恭喜您成功订阅命运日历运势日报！从明天开始，您将收到每日运势分析。

您将收到：
- 每日运势评分和关键词
- 事业、财运、感情等维度分析
- 每日行动建议

访问 {SITE_URL} 获取更详细的运势分析！

© 2024 命运日历 | Fortune Calendar
取消订阅: {SITE_URL}/unsubscribe?email={email}
        """
        
        return {
            'subject': '【命运日历】欢迎订阅运势日报！',
            'html': html,
            'text': text
        }
    
    @staticmethod
    def daily_fortune_email(
        email: str,
        date: str,
        score: int,
        keyword: str,
        emoji: str,
        dimensions: Dict[str, int],
        advice: str
    ) -> Dict[str, str]:
        """每日运势邮件模板"""
        
        def get_score_color(s: int) -> str:
            if s >= 70: return '#22c55e'
            if s >= 50: return '#3b82f6'
            if s >= 30: return '#eab308'
            return '#ef4444'
        
        dimensions_html = ''.join([
            f'<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">'
            f'<span>{name}</span><span style="color: {get_score_color(score)}; font-weight: bold;">{score}分</span></div>'
            for name, score in dimensions.items()
        ])
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .score {{ font-size: 48px; font-weight: bold; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .dimensions {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .advice {{ background: #eef2ff; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1; }}
                .footer {{ text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <p>{date}</p>
                    <div class="score" style="color: {get_score_color(score)}">{score}分</div>
                    <h2>{emoji} {keyword}</h2>
                </div>
                <div class="content">
                    <h3>📊 各维度运势</h3>
                    <div class="dimensions">
                        {dimensions_html}
                    </div>
                    
                    <h3>💡 今日建议</h3>
                    <div class="advice">
                        {advice}
                    </div>
                    
                    <p style="text-align: center; margin-top: 20px;">
                        <a href="{SITE_URL}" style="color: #6366f1;">查看完整运势分析 →</a>
                    </p>
                </div>
                <div class="footer">
                    <p>© 2024 命运日历 | Fortune Calendar</p>
                    <p><a href="{SITE_URL}/unsubscribe?email={email}">取消订阅</a></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        dimensions_text = '\n'.join([f'  {name}: {score}分' for name, score in dimensions.items()])
        
        text = f"""
命运日历 - {date} 运势日报

总评分: {score}分
主题: {emoji} {keyword}

各维度运势:
{dimensions_text}

今日建议:
{advice}

查看完整运势分析: {SITE_URL}

© 2024 命运日历 | Fortune Calendar
取消订阅: {SITE_URL}/unsubscribe?email={email}
        """
        
        return {
            'subject': f'【命运日历】{date} 运势：{emoji} {keyword} ({score}分)',
            'html': html,
            'text': text
        }
    
    @staticmethod
    def password_reset_email(token: str, email: str) -> Dict[str, str]:
        """密码重置邮件模板"""
        reset_url = f"{SITE_URL}/reset-password?token={token}&email={email}"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }}
                .warning {{ background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; }}
                .footer {{ text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 密码重置</h1>
                </div>
                <div class="content">
                    <p>您好！</p>
                    <p>我们收到了您重置密码的请求。请点击下方按钮设置新密码：</p>
                    <p style="text-align: center;">
                        <a href="{reset_url}" class="button">重置密码</a>
                    </p>
                    <div class="warning">
                        <strong>⚠️ 安全提示：</strong>
                        <ul>
                            <li>此链接将在 24 小时后失效</li>
                            <li>如果您没有请求重置密码，请忽略此邮件</li>
                            <li>请勿将此链接分享给他人</li>
                        </ul>
                    </div>
                </div>
                <div class="footer">
                    <p>© 2024 命运日历 | Fortune Calendar</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
命运日历 - 密码重置

您好！

我们收到了您重置密码的请求。请点击以下链接设置新密码：

{reset_url}

安全提示：
- 此链接将在 24 小时后失效
- 如果您没有请求重置密码，请忽略此邮件
- 请勿将此链接分享给他人

© 2024 命运日历 | Fortune Calendar
        """
        
        return {
            'subject': '【命运日历】密码重置',
            'html': html,
            'text': text
        }


# 单例实例
email_sender = EmailSender()


# 便捷函数
def send_verification_email(email: str, token: str) -> bool:
    """发送验证邮件"""
    template = EmailTemplates.verification_email(token, email)
    return email_sender.send(email, template['subject'], template['html'], template['text'])


def send_welcome_email(email: str) -> bool:
    """发送欢迎邮件"""
    template = EmailTemplates.welcome_email(email)
    return email_sender.send(email, template['subject'], template['html'], template['text'])


def send_daily_fortune_email(
    email: str,
    date: str,
    score: int,
    keyword: str,
    emoji: str,
    dimensions: Dict[str, int],
    advice: str
) -> bool:
    """发送每日运势邮件"""
    template = EmailTemplates.daily_fortune_email(email, date, score, keyword, emoji, dimensions, advice)
    return email_sender.send(email, template['subject'], template['html'], template['text'])


def send_password_reset_email(email: str, token: str) -> bool:
    """发送密码重置邮件"""
    template = EmailTemplates.password_reset_email(token, email)
    return email_sender.send(email, template['subject'], template['html'], template['text'])
