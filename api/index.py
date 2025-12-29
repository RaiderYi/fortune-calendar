from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "message": "API正常运行！",
        "version": "1.0"
    })

@app.route('/api/fortune', methods=['POST'])
def fortune():
    # 返回模拟数据
    return jsonify({
        "dateStr": "12.29",
        "weekDay": "周日",
        "lunarStr": "腊月初一",
        "totalScore": 88,
        "pillars": {"year": "乙巳", "month": "戊子", "day": "癸亥"},
        "mainTheme": {
            "keyword": "吸金💰",
            "subKeyword": "财运亨通",
            "emoji": "💰",
            "colorTheme": "from-orange-100 to-amber-200",
            "textColor": "text-slate-800",
            "description": "今日财运极佳"
        },
        "dimensions": {
            "career": {"score": 85, "level": "吉", "tag": "事业腾飞", "inference": "职场顺利"},
            "wealth": {"score": 92, "level": "大吉", "tag": "财运亨通", "inference": "财运爆棚"},
            "romance": {"score": 78, "level": "吉", "tag": "桃花朵朵", "inference": "感情顺利"},
            "health": {"score": 82, "level": "吉", "tag": "精力充沛", "inference": "身体健康"},
            "academic": {"score": 75, "level": "吉", "tag": "思维敏捷", "inference": "学习顺利"},
            "travel": {"score": 88, "level": "吉", "tag": "出行顺利", "inference": "一路平安"}
        },
        "todo": [
            {"label": "宜", "content": "投资理财, 商务洽谈", "type": "up"},
            {"label": "忌", "content": "冲动消费, 借贷", "type": "down"}
        ],
        "baziDetail": {"year": "乙巳", "month": "戊子", "day": "癸亥", "hour": "甲寅", "dayMaster": "癸亥"},
        "yongShen": {"strength": "身旺", "yongShen": ["木", "火"], "xiShen": ["水"], "jiShen": ["土", "金"], "tenGods": ["食神", "偏财"]},
        "daYun": {"index": 3, "start_year": 2020, "end_year": 2030, "gan_zhi": "丁亥", "age": 28},
        "shenSha": ["天乙贵人", "文昌星"],
        "liuNian": {"year": "乙巳", "month": "戊子", "day": "癸亥", "yearGan": "乙", "yearZhi": "巳", "monthGan": "戊", "monthZhi": "子", "dayGan": "癸", "dayZhi": "亥"},
        "todayTenGod": "偏财"
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)