from flask import Flask, jsonify, request
from flask_cors import CORS
from lunar_python import Solar, Lunar
import datetime

app = Flask(__name__)
CORS(app)

# --- 核心命理映射配置 ---
TEN_GOD_MAPPING = {
    "比肩": {"keyword": "硬刚", "subKeyword": "自我主场", "emoji": "👊",
             "desc": "竞争激烈，但你能量爆棚。不用看谁脸色，今天你自己就是规矩。"},
    "劫财": {"keyword": "破财", "subKeyword": "买买买", "emoji": "💸",
             "desc": "容易冲动消费或请客吃饭，护好钱包，但利于社交破圈。"},
    "食神": {"keyword": "松弛", "subKeyword": "天赋点满", "emoji": "☕️",
             "desc": "灵感追着你跑。适合摸鱼、探店、发呆，怎么舒服怎么来。"},
    "伤官": {"keyword": "叛逆", "subKeyword": "整顿职场", "emoji": "🎤",
             "desc": "才华压不住，想怼谁就怼谁。利于创作和演讲，但小心口舌。"},
    "偏财": {"keyword": "吸金", "subKeyword": "财运Buff", "emoji": "💰",
             "desc": "搞钱雷达灵敏，买彩票、谈客户容易有惊喜，接住这波富贵。"},
    "正财": {"keyword": "搬砖", "subKeyword": "稳稳当当", "emoji": "🧱",
             "desc": "一分耕耘一分收获，虽然没有横财，但进账踏实，适合存钱。"},
    "七杀": {"keyword": "气场", "subKeyword": "掌控全场", "emoji": "🔥",
             "desc": "压力有点大，但你是绝对C位。遇到困难直接硬刚，必能逆风翻盘。"},
    "正官": {"keyword": "上岸", "subKeyword": "顺风顺水", "emoji": "⚖️",
             "desc": "利于考试、面试、升职。领导看你顺眼，全世界都在给你开绿灯。"},
    "偏印": {"keyword": "脑洞", "subKeyword": "外星接收", "emoji": "👽",
             "desc": "思维很怪但很有用。适合钻研冷门知识，直觉准得可怕。"},
    "正印": {"keyword": "锦鲤", "subKeyword": "躺赢模式", "emoji": "🍀",
             "desc": "有贵人罩着，不用太费力就能成事。适合抱大腿，做长远规划。"},
}


@app.route('/api/fortune', methods=['POST'])
def get_fortune():
    data = request.json

    # 1. 获取用户自定义生日 (从前端传过来)
    # 默认值还是张三，防止没传报错
    birth_date_str = data.get('birthDate', '1995-08-15')
    birth_time_str = data.get('birthTime', '09:30')

    try:
        # 解析生日字符串
        b_year, b_month, b_day = map(int, birth_date_str.split('-'))
        b_hour, b_minute = map(int, birth_time_str.split(':'))
        user_birthday = Solar.fromYmdHms(b_year, b_month, b_day, b_hour, b_minute, 0)
    except:
        # 容错：如果格式不对，回退到默认
        user_birthday = Solar.fromYmdHms(1995, 8, 15, 9, 30, 0)

    # 2. 获取目标日期
    target_date_str = data.get('date', datetime.datetime.now().strftime('%Y-%m-%d'))
    try:
        t_year, t_month, t_day = map(int, target_date_str.split('-'))
        target_solar = Solar.fromYmd(t_year, t_month, t_day)
    except:
        now = datetime.datetime.now()
        target_solar = Solar.fromYmd(now.year, now.month, now.day)

    target_lunar = target_solar.getLunar()

    # 3. 排盘核心计算
    user_bazi = user_birthday.getLunar().getEightChar()
    day_master = user_bazi.getDayGan()  # 日主天干

    today_gan_zhi = target_lunar.getEightChar().getDay()
    today_gan = today_gan_zhi[0]

    # 简单的十神推导
    stems = list("甲乙丙丁戊己庚辛壬癸")
    try:
        user_idx = stems.index(day_master)
        today_idx = stems.index(today_gan)
        diff = (today_idx - user_idx) % 10
    except:
        diff = 0

    ten_god_keys = ["比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印"]
    current_ten_god = ten_god_keys[diff]
    theme = TEN_GOD_MAPPING.get(current_ten_god, TEN_GOD_MAPPING["比肩"])

    # 4. 返回数据
    response_data = {
        "dateStr": f"{target_lunar.getMonth()}.{target_lunar.getDay()}",
        "weekDay": f"周{target_lunar.getWeekInChinese()}",
        "lunarStr": f"{target_lunar.getMonthInChinese()}月{target_lunar.getDayInChinese()}",
        "totalScore": 60 + (diff * 4) % 40,

        "pillars": {
            "year": target_lunar.getYearInGanZhi(),
            "month": target_lunar.getMonthInGanZhi(),
            "day": f"{today_gan_zhi}日"
        },

        "mainTheme": {
            "keyword": theme["keyword"],
            "subKeyword": theme["subKeyword"],
            "emoji": theme["emoji"],
            "colorTheme": "from-slate-800 to-black" if current_ten_god == "七杀" else "from-orange-100 to-amber-200",
            "textColor": "text-slate-100" if current_ten_god == "七杀" else "text-slate-800",
            "description": theme["desc"]
        },

        "dimensions": {
            "career": {"score": 80, "level": "吉", "tag": "稳中有升", "inference": "官杀得力，利于职场晋升。"},
            "wealth": {"score": 75, "level": "平", "tag": "正财得地", "inference": "辛苦钱稳赚，偏财勿念。"},
            "romance": {"score": 60, "level": "平", "tag": "平平淡淡", "inference": "多关注伴侣情绪。"},
            "health": {"score": 90, "level": "吉", "tag": "神清气爽", "inference": "五行流通，身体倍儿棒。"},
            "academic": {"score": 85, "level": "吉", "tag": "文昌显现", "inference": "头脑清晰，适合学习。"},
            "travel": {"score": 40, "level": "凶", "tag": "宜静不宜动", "inference": "出门容易堵车。"}
        },

        "todo": [
            {"label": "宜", "content": f"{theme['keyword']}，抱大腿", "type": "up"},
            {"label": "忌", "content": "内耗，犹豫", "type": "down"}
        ]
    }

    return jsonify(response_data)


if __name__ == '__main__':
    app.run(port=5000, debug=True)