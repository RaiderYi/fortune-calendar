from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/api/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({
        "status": "ok",
        "message": "API正常运行！",
        "version": "1.0"
    })


@app.route('/api/fortune', methods=['GET', 'POST', 'OPTIONS'])
def fortune():
    """运势分析接口 - 同时支持 GET 和 POST"""

    # 处理 OPTIONS 预检请求
    if request.method == 'OPTIONS':
        return '', 204

    # 获取参数（支持 GET 和 POST）
    if request.method == 'POST':
        data = request.json or {}
    else:  # GET 请求
        data = {
            'date': request.args.get('date', datetime.datetime.now().strftime('%Y-%m-%d')),
            'birthDate': request.args.get('birthDate', '1995-08-15'),
            'birthTime': request.args.get('birthTime', '09:30'),
            'longitude': request.args.get('longitude', '116.40'),
            'gender': request.args.get('gender', '1')
        }

    # 从数据中获取日期（用于显示）
    target_date = data.get('date', datetime.datetime.now().strftime('%Y-%m-%d'))
    try:
        date_obj = datetime.datetime.strptime(target_date, '%Y-%m-%d')
        date_str = f"{date_obj.month}.{date_obj.day}"
        weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        week_day = weekdays[date_obj.weekday()]
    except:
        date_str = "12.30"
        week_day = "周一"

    # 返回模拟数据
    return jsonify({
        "dateStr": date_str,
        "weekDay": week_day,
        "lunarStr": "腊月初二",
        "totalScore": 88,
        "pillars": {
            "year": "乙巳",
            "month": "戊子",
            "day": "癸亥"
        },
        "mainTheme": {
            "keyword": "吸金💰",
            "subKeyword": "财运亨通",
            "emoji": "💰",
            "colorTheme": "from-orange-100 to-amber-200",
            "textColor": "text-slate-800",
            "description": "今日财运极佳，适合投资理财，把握机会"
        },
        "dimensions": {
            "career": {"score": 85, "level": "吉", "tag": "事业腾飞", "inference": "职场运势极佳，上级赏识"},
            "wealth": {"score": 92, "level": "大吉", "tag": "财运亨通", "inference": "财运爆棚，投资有道"},
            "romance": {"score": 78, "level": "吉", "tag": "桃花朵朵", "inference": "感情顺利，桃花运旺"},
            "health": {"score": 82, "level": "吉", "tag": "精力充沛", "inference": "身体健康，精神饱满"},
            "academic": {"score": 75, "level": "吉", "tag": "思维敏捷", "inference": "学习顺利，考运不错"},
            "travel": {"score": 88, "level": "吉", "tag": "出行顺利", "inference": "一路平安，贵人相助"}
        },
        "todo": [
            {"label": "宜", "content": "投资理财, 商务洽谈, 签订合同", "type": "up"},
            {"label": "忌", "content": "冲动消费, 借贷, 赌博", "type": "down"}
        ],
        "baziDetail": {
            "year": "乙巳",
            "month": "戊子",
            "day": "癸亥",
            "hour": "甲寅",
            "dayMaster": "癸亥"
        },
        "yongShen": {
            "strength": "身旺",
            "yongShen": ["木", "火"],
            "xiShen": ["水"],
            "jiShen": ["土", "金"],
            "tenGods": ["食神", "偏财"]
        },
        "daYun": {
            "index": 3,
            "start_year": 2020,
            "end_year": 2030,
            "gan_zhi": "丁亥",
            "age": 28
        },
        "shenSha": ["天乙贵人", "文昌星", "福星"],
        "liuNian": {
            "year": "乙巳",
            "month": "戊子",
            "day": "癸亥",
            "yearGan": "乙",
            "yearZhi": "巳",
            "monthGan": "戊",
            "monthZhi": "子",
            "dayGan": "癸",
            "dayZhi": "亥"
        },
        "todayTenGod": "偏财"
    })


# 添加错误处理
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found", "message": "API endpoint not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)