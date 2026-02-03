# -*- coding: utf-8 -*-
"""
API 工具模块
"""

from .email_sender import (
    EmailSender,
    EmailTemplates,
    email_sender,
    send_verification_email,
    send_welcome_email,
    send_daily_fortune_email,
    send_password_reset_email,
)

__all__ = [
    'EmailSender',
    'EmailTemplates',
    'email_sender',
    'send_verification_email',
    'send_welcome_email',
    'send_daily_fortune_email',
    'send_password_reset_email',
]
