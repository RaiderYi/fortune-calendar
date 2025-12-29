from flask import Flask, jsonify, request
from flask_cors import CORS
from lunar_python import Solar
import datetime
from bazi_calculator import analyze_fortune
from config import TEN_GOD_MAPPING

app = Flask(__name__)
CORS(app)


@app.route('/api/fortune', methods=['POST'])
def get_fortune():
    """
    获取运势分析
    基于八字命理的完整分析，包括用神喜忌、大运流年流月等
    """
    data = request.json

    # 1. 获取用户自定义生日和经度
    birth_date_str = data.get('birthDate', '1995-08-15')
    birth_time_str = data.get('birthTime', '09:30')
    longitude = data.get('longitude', 116.4)  # 默认北京经度
    gender = data.get('gender', 1)  # 1为男，2为女

    # 2. 获取目标日期
    target_date_str = data.get('date', datetime.datetime.now().strftime('%Y-%m-%d'))

    try:
        # 3. 使用新的八字计算器分析运势
        fortune_result = analyze_fortune(
            birth_date_str,
            birth_time_str,
            longitude,
            target_date_str,
            gender
        )

        # 4. 获取目标日期的农历信息
        t_year, t_month, t_day = map(int, target_date_str.split('-'))
        target_solar = Solar.fromYmd(t_year, t_month, t_day)
        target_lunar = target_solar.getLunar()

        # 5. 获取今日十神主题
        today_ten_god = fortune_result['today_ten_god']
        theme = TEN_GOD_MAPPING.get(today_ten_god, TEN_GOD_MAPPING["比肩"])

        # 6. 构建宜忌建议
        yi_ji = fortune_result['yi_ji']
        todo_list = [
            {"label": "宜", "content": ", ".join(yi_ji['yi'][:3]), "type": "up"},
            {"label": "忌", "content": ", ".join(yi_ji['ji'][:3]), "type": "down"}
        ]

        # 7. 返回数据
        response_data = {
            "dateStr": f"{target_lunar.getMonth()}.{target_lunar.getDay()}",
            "weekDay": f"周{target_lunar.getWeekInChinese()}",
            "lunarStr": f"{target_lunar.getMonthInChinese()}月{target_lunar.getDayInChinese()}",

            "totalScore": fortune_result['totalScore'],

            "pillars": {
                "year": fortune_result['liu_nian']['year'],
                "month": fortune_result['liu_nian']['month'],
                "day": fortune_result['liu_nian']['day']
            },

            "mainTheme": {
                "keyword": theme["keyword"],
                "subKeyword": theme["subKeyword"],
                "emoji": theme["emoji"],
                "colorTheme": "from-slate-800 to-black" if today_ten_god == "七杀" else "from-orange-100 to-amber-200",
                "textColor": "text-slate-100" if today_ten_god == "七杀" else "text-slate-800",
                "description": theme["desc"]
            },

            "dimensions": fortune_result['dimensions'],

            "todo": todo_list,

            # 新增：八字详情
            "baziDetail": {
                "year": fortune_result['bazi']['year'],
                "month": fortune_result['bazi']['month'],
                "day": fortune_result['bazi']['day'],
                "hour": fortune_result['bazi']['hour'],
                "dayMaster": fortune_result['bazi']['day_gan'] + fortune_result['bazi']['day_zhi']
            },

            # 新增：用神喜忌
            "yongShen": {
                "strength": fortune_result['strength']['strength'],
                "yongShen": fortune_result['yong_shen']['yong_shen'],
                "xiShen": fortune_result['yong_shen']['xi_shen'],
                "jiShen": fortune_result['yong_shen']['ji_shen'],
                "tenGods": fortune_result['yong_shen']['ten_gods']
            },

            # 新增：大运信息
            "daYun": fortune_result['da_yun'],

            # 新增：神煞
            "shenSha": fortune_result['shen_sha'],

            # 新增：流年信息
            "liuNian": {
                "year": fortune_result['liu_nian']['year'],
                "month": fortune_result['liu_nian']['month'],
                "day": fortune_result['liu_nian']['day'],
                "yearGan": fortune_result['liu_nian']['year_gan'],
                "yearZhi": fortune_result['liu_nian']['year_zhi'],
                "monthGan": fortune_result['liu_nian']['month_gan'],
                "monthZhi": fortune_result['liu_nian']['month_zhi'],
                "dayGan": fortune_result['liu_nian']['day_gan'],
                "dayZhi": fortune_result['liu_nian']['day_zhi']
            },

            # 新增：今日十神
            "todayTenGod": today_ten_god
        }

        return jsonify(response_data)

    except Exception as e:
        print(f"运势分析错误: {e}")
        import traceback
        traceback.print_exc()

        # 返回错误信息
        return jsonify({
            "error": str(e),
            "message": "运势分析失败，请稍后重试"
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    健康检查接口
    """
    return jsonify({
        "status": "ok",
        "message": "API is running",
        "version": "2.0"
    })


if __name__ == '__main__':
    app.run(port=5000, debug=True)
