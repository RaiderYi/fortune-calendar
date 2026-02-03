# -*- coding: utf-8 -*-
"""
AI 业务逻辑
处理 DeepSeek API 调用和系统提示词构建
"""

import os
import json
import urllib.request
import datetime

class AIService:
    @staticmethod
    def build_bazi_system_prompt(context):
        """构建包含八字信息的系统提示词"""
        if not context:
            return AIService.get_default_system_prompt()
            
        bazi_detail = context.get('baziDetail', {})
        yong_shen = context.get('yongShen', {})
        dimensions = context.get('dimensions', {})
        main_theme = context.get('mainTheme', {})
        total_score = context.get('totalScore', 0)
        liu_nian = context.get('liuNian', {})
        
        prompt = f"""你是一位世界级的命理大师，精通八字、五行、十神、大运等传统命理学。现在你需要根据用户的八字信息，为用户提供精准、专业、易懂的命理咨询。

## 用户八字信息

**四柱八字：**
- 年柱：{bazi_detail.get('year', '未知')}
- 月柱：{bazi_detail.get('month', '未知')}
- 日柱：{bazi_detail.get('day', '未知')}
- 时柱：{bazi_detail.get('hour', '未知')}
- 日主：{bazi_detail.get('dayMaster', '未知')}

**用神喜忌：**
- 日主旺衰：{yong_shen.get('strength', '未知')}
- 用神：{', '.join(yong_shen.get('yongShen', []))}
- 喜神：{', '.join(yong_shen.get('xiShen', []))}
- 忌神：{', '.join(yong_shen.get('jiShen', []))}

**今日运势：**
- 综合评分：{total_score}/100
- 主题：{main_theme.get('keyword', '未知')} - {main_theme.get('subKeyword', '未知')}
- 描述：{main_theme.get('description', '未知')}

**流年流月流日：**
- 流年：{liu_nian.get('year', '未知')} ({liu_nian.get('yearGan', '')}{liu_nian.get('yearZhi', '')})
- 流月：{liu_nian.get('month', '未知')} ({liu_nian.get('monthGan', '')}{liu_nian.get('monthZhi', '')})
- 流日：{liu_nian.get('day', '未知')} ({liu_nian.get('dayGan', '')}{liu_nian.get('dayZhi', '')})

**六大维度评分："""
        
        dim_names = {
            'career': '事业',
            'wealth': '财运',
            'romance': '感情',
            'health': '健康',
            'academic': '学业',
            'travel': '出行'
        }
        
        for key, name in dim_names.items():
            dim = dimensions.get(key, {})
            score = dim.get('score', 0)
            level = dim.get('level', '未知')
            prompt += f"\n- {name}：{score}/100 ({level})"
        
        prompt += """

## 回答要求

1. **专业性**：基于八字五行、用神喜忌、流年流月等传统命理理论进行分析
2. **准确性**：严格依据提供的八字数据和运势评分，不要编造信息
3. **易懂性**：用通俗易懂的语言解释专业术语，避免过于晦涩
4. **实用性**：提供具体可行的建议，帮助用户把握机会、规避风险
5. **个性化**：针对用户的八字特点，给出个性化的指导
6. **积极正面**：即使运势不佳，也要给出改善建议，传递正能量

请根据用户的提问，结合以上八字信息，提供专业、精准、实用的命理咨询。"""
        
        return prompt

    @staticmethod
    def get_default_system_prompt():
        """构建默认八字系统提示词"""
        return """你是一位精通中国传统命理学的AI助手，专门解答关于八字（四柱）命理的问题。

你的知识包括：
1. 天干地支、五行生克
2. 十神、用神、喜神、忌神
3. 大运、流年、流月、流日
4. 神煞、格局分析
5. 运势评分和预测

请用专业但易懂的语言回答用户的问题。"""

    @staticmethod
    def call_deepseek_api(api_key, messages):
        """调用 DeepSeek API"""
        url = 'https://api.deepseek.com/v1/chat/completions'
        
        payload = {
            'model': 'deepseek-chat',
            'messages': messages,
            'temperature': 0.7,
            'max_tokens': 2000
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}'
            }
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode('utf-8'))
                if 'choices' in result and len(result['choices']) > 0:
                    return result['choices'][0]['message']['content']
                else:
                    raise Exception(f'DeepSeek API 返回异常: {json.dumps(result, ensure_ascii=False)}')
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            raise Exception(f'DeepSeek API 请求失败: {e.code} - {error_body}')
        except Exception as e:
            raise Exception(f'调用 DeepSeek API 时出错: {str(e)}')
