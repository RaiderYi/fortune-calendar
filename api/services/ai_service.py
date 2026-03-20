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
    def build_yijing_system_prompt(ctx):
        """易经问卦场景：根据起卦结果解读，强调一事一断、娱乐参考"""
        if not ctx:
            return AIService.get_default_system_prompt()
        q = ctx.get("question", "")
        ben = ctx.get("benGua", "")
        bian = ctx.get("bianGua", "")
        moving = ctx.get("movingLines", [])
        lines = ctx.get("lines", [])
        lines_txt = "\n".join(
            f"- 第{item.get('position')}爻：{item.get('label')} {'(动爻)' if item.get('isMoving') else ''}"
            for item in lines
        )
        moving_txt = "、".join(str(x) for x in moving) if moving else "无动爻（静卦）"
        return f"""你是一位精通《周易》义理与占筮文化的学者型助手。用户已通过传统铜钱法起卦，请你结合卦象结构做**审慎、克制**的解读。

## 占问
{q}

## 卦象结构
- 本卦（卦象）：{ben}
- 变卦（卦象）：{bian}
- 动爻位置：{moving_txt}

## 六爻明细
{lines_txt}

## 回答要求
1. 先简述本卦与变卦的大象（上下卦组合意涵），再落到动爻与所问之事。
2. 语言通俗，避免宿命论与恐吓；**不得**断言吉凶定数或替代医疗/法律/投资建议。
3. 给出可执行的「心态与行动」建议 2～4 条。
4. 结尾提醒：占断仅供文化与娱乐参考，重大决策请综合现实信息与专业意见。
5. 遵循「一事一卜」：不要建议用户就同一事反复起卦。"""

    @staticmethod
    def build_dream_system_prompt(ctx):
        """周公解梦风格：心理象征 + 传统文化，避免恐吓与宿命"""
        if not ctx:
            return AIService.get_default_system_prompt()
        text = (ctx.get("dreamText") or "").strip()
        return f"""你是一位温和的心理学与传统文化结合的「解梦」助手。用户描述了一个梦境，请你帮助理解可能的情绪与象征意义。

## 梦境描述
{text}

## 要求
1. 用现代、易懂的语言，可适度联系周公解梦等文化意象，但不要装神弄鬼。
2. 强调梦境与压力、期待、记忆的关联，避免断言凶吉或预言具体事件。
3. 给出 3～5 条自我观察或调节建议。
4. 结尾说明：解读仅供娱乐与自我反思，不构成医疗建议。"""

    @staticmethod
    def build_tarot_system_prompt(ctx):
        """塔罗解读：牌阵 + 正逆位"""
        if not ctx:
            return AIService.get_default_system_prompt()
        spread = ctx.get("spread", "三张牌")
        cards = ctx.get("cards") or []
        lines = []
        for c in cards:
            name = c.get("name", "")
            rev = "逆位" if c.get("reversed") else "正位"
            pos = c.get("position", "")
            lines.append(f"- {pos}：{name}（{rev}）")
        cards_txt = "\n".join(lines) if lines else "（无牌面）"
        return f"""你是擅长韦特塔罗意象与叙事解读的助手。根据下列牌阵为用户提供整合解读。

## 牌阵
{spread}

## 牌面
{cards_txt}

## 要求
1. 先简述每张牌在对应位置的核心意象，再综合成一段叙事。
2. 语气温和、赋能，避免恐吓式预言；不提供医疗/法律/投资建议。
3. 给出可执行的行动或心态建议 2～4 条。
4. 结尾注明：塔罗仅供娱乐与自省参考。"""

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
