# -*- coding: utf-8 -*-
"""
基础常量定义
"""

# ==================== 天干地支 ====================

TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

# ==================== 节气 ====================

SOLAR_TERMS = [
    "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
    "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
    "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
    "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
]

SOLAR_TERM_TABLE = {
    2025: [
        (1, 5), (1, 20), (2, 3), (2, 18), (3, 5), (3, 20),
        (4, 4), (4, 19), (5, 5), (5, 20), (6, 5), (6, 21),
        (7, 6), (7, 22), (8, 7), (8, 23), (9, 7), (9, 22),
        (10, 8), (10, 23), (11, 7), (11, 22), (12, 7), (12, 21)
    ],
}

LUNAR_MONTH_NAMES = [
    "正月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "冬月", "腊月"
]

# ==================== 十神 ====================

SHI_SHEN = ["比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印"]

# ==================== 十神主题映射 ====================

TEN_GOD_THEMES = {
    "比肩": {
        "emoji": "👊",
        "keyword": "硬刚",
        "subKeyword": "自我主场",
        "color": "from-purple-100 to-indigo-200",
        "descriptions": [
            "今日硬刚模式开启，能量爆棚，不用看谁脸色",
            "今日比肩当道，竞争激烈但你占优，勇敢去拼",
            "今日自我力量爆发，直接硬刚，该是你的就是你的",
            "今日比肩之力旺盛，主动出击，你就是规矩",
            "今日比肩格局，自信满满，按自己的节奏来"
        ]
    },
    "劫财": {
        "emoji": "💸",
        "keyword": "破财",
        "subKeyword": "买买买",
        "color": "from-pink-100 to-rose-200",
        "descriptions": [
            "今日劫财当头，容易冲动消费，护好钱包",
            "今日破财星现，利于社交破圈，小心钱包",
            "今日劫财格局，请客吃饭，花钱换人脉",
            "今日劫财之力，不宜投资，适合社交",
            "今日劫财当值，钱财易散，但利于交友"
        ]
    },
    "食神": {
        "emoji": "☕️",
        "keyword": "松弛",
        "subKeyword": "天赋点满",
        "color": "from-green-100 to-emerald-200",
        "descriptions": [
            "今日食神当令，灵感追着你跑，怎么舒服怎么来",
            "今日松弛感满满，适合摸鱼、探店、发呆",
            "今日食神格局，才华横溢，享受当下",
            "今日食神之力，创意爆棚，慢慢来比较快",
            "今日食神当值，轻松自在，顺其自然最好"
        ]
    },
    "伤官": {
        "emoji": "🎤",
        "keyword": "叛逆",
        "subKeyword": "整顿职场",
        "color": "from-red-100 to-orange-200",
        "descriptions": [
            "今日伤官当道，才华压不住，想怼谁就怼谁",
            "今日叛逆精神爆发，利于创作和演讲，但小心口舌",
            "今日伤官格局，打破常规，勇敢表达自己",
            "今日伤官之力，创新思维活跃，该说就说",
            "今日伤官当值，不走寻常路，做真实的自己"
        ]
    },
    "偏财": {
        "emoji": "💰",
        "keyword": "吸金",
        "subKeyword": "财运Buff",
        "color": "from-yellow-100 to-amber-200",
        "descriptions": [
            "今日偏财当令，搞钱雷达灵敏，接住这波富贵",
            "今日吸金格局，买彩票、谈客户容易有惊喜",
            "今日偏财之力，横财机会多，大胆出击",
            "今日偏财星现，财运亨通，适合投资理财",
            "今日偏财当值，贵人送财，好好把握"
        ]
    },
    "正财": {
        "emoji": "🧱",
        "keyword": "搬砖",
        "subKeyword": "稳稳当当",
        "color": "from-blue-100 to-sky-200",
        "descriptions": [
            "今日正财当令，一分耕耘一分收获，踏实赚钱",
            "今日搬砖模式，虽然没有横财，但进账稳定",
            "今日正财格局，辛苦有回报，适合存钱",
            "今日正财之力，正道生财，稳扎稳打",
            "今日正财当值，勤劳致富，积少成多"
        ]
    },
    "七杀": {
        "emoji": "🔥",
        "keyword": "气场",
        "subKeyword": "掌控全场",
        "color": "from-red-100 to-pink-200",
        "descriptions": [
            "今日七杀当道，压力有点大，但你是绝对C位",
            "今日气场全开，遇到困难直接硬刚，必能逆风翻盘",
            "今日七杀格局，威严十足，掌控全局",
            "今日七杀之力，挑战重重，但你能搞定一切",
            "今日七杀当值，魄力爆表，该出手时就出手"
        ]
    },
    "正官": {
        "emoji": "⚖️",
        "keyword": "上岸",
        "subKeyword": "顺风顺水",
        "color": "from-indigo-100 to-blue-200",
        "descriptions": [
            "今日正官当令，利于考试、面试、升职，领导看你顺眼",
            "今日上岸格局，全世界都在给你开绿灯",
            "今日正官之力，事业运旺，升职加薪有望",
            "今日正官星现，贵人相助，顺风顺水",
            "今日正官当值，名利双收，大展宏图"
        ]
    },
    "偏印": {
        "emoji": "👽",
        "keyword": "脑洞",
        "subKeyword": "外星接收",
        "color": "from-purple-100 to-violet-200",
        "descriptions": [
            "今日偏印当道，思维很怪但很有用，直觉准得可怕",
            "今日脑洞大开，适合钻研冷门知识，独特见解",
            "今日偏印格局，灵感来自异想天开，相信直觉",
            "今日偏印之力，思路清奇，另辟蹊径",
            "今日偏印当值，智慧非凡，看透本质"
        ]
    },
    "正印": {
        "emoji": "🍀",
        "keyword": "锦鲤",
        "subKeyword": "躺赢模式",
        "color": "from-green-100 to-teal-200",
        "descriptions": [
            "今日正印当令，有贵人罩着，不用太费力就能成事",
            "今日锦鲤模式，适合抱大腿，做长远规划",
            "今日正印格局，学习运佳，容易得到帮助",
            "今日正印之力，贵人运旺，躺赢模式开启",
            "今日正印当值，福星高照，事半功倍"
        ]
    }
}

# ==================== 五行属性 ====================

WU_XING_MAP = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
    '寅': '木', '卯': '木',
    '巳': '火', '午': '火',
    '辰': '土', '未': '土', '戌': '土', '丑': '土',
    '申': '金', '酉': '金',
    '亥': '水', '子': '水'
}

# ==================== 地支藏干 ====================

ZHI_CANG_GAN = {
    '子': ['癸', None, None],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙', None, None],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己', None],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛', None, None],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲', None]
}

# ==================== 五行生克关系 ====================

WU_XING_SHENG = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
}

WU_XING_KE = {
    '木': '土',
    '火': '金',
    '土': '水',
    '金': '木',
    '水': '火'
}

# ==================== 月令司令 ====================

YUE_LING_WANG = {
    '寅': '木', '卯': '木', '辰': '土',
    '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土',
    '亥': '水', '子': '水', '丑': '土'
}

# ==================== V5.0 算法配置 ====================

USE_V5_ALGORITHM = True

ELEMENT_STRENGTH_WEIGHTS = {
    'month_zhi': 40,
    'day_zhi': 15,
    'time_zhi': 15,
    'year_zhi': 15,
    'year_gan': 5,
    'month_gan': 5,
    'time_gan': 5
}

STRENGTH_THRESHOLDS = {
    'dominant': 75,
    'strong': 55,
    'neutral_high': 50,
    'neutral_low': 40,
    'weak': 40,
    'follower': 25
}

YONGSHEN_TIERS = {
    'tier1_climate': {
        'priority': 100,
        'weight_multiplier': 1.3,
        'description': '调候用神'
    },
    'tier2_mediator': {
        'priority': 80,
        'weight_multiplier': 2.0,
        'description': '通关用神'
    },
    'tier3_balance': {
        'priority': 60,
        'weight_multiplier': 1.0,
        'description': '扶抑用神'
    }
}

CLIMATE_CONFIG = {
    'winter': {
        'months': ['亥', '子', '丑'],
        'favorable_element': '火',
        'reason': '冬季寒冷，火暖为先',
        'threshold': 0.20
    },
    'summer': {
        'months': ['巳', '午', '未'],
        'favorable_element': '水',
        'reason': '夏季炎热，水润为先',
        'threshold': 0.20
    }
}

MEDIATOR_ELEMENTS = {
    ('金', '木'): '水',
    ('木', '土'): '火',
    ('土', '水'): '金',
    ('水', '火'): '木',
    ('火', '金'): '土'
}

FORTUNE_WEIGHTS_V5 = {
    'base_score': 60,
    'dayun_adjust': {
        'favorable': +10,
        'unfavorable': -10,
        'neutral': 0
    },
    'liunian': {
        'weight': 0.10,
        'stem_ratio': 0.60,
        'branch_ratio': 0.40
    },
    'liuyue': {
        'weight': 0.20,
        'stem_only': True
    },
    'liuri': {
        'weight': 0.70,
        'stem_ratio': 0.60,
        'branch_ratio': 0.40
    }
}

# ==================== 天干互动规则 ====================

TIANGAN_INTERACTIONS = {
    'wu_he': {
        '甲己': {'element': '土', 'favorable_bonus': 5, 'unfavorable_penalty': -4, 'desc': '甲己合化土'},
        '乙庚': {'element': '金', 'favorable_bonus': 5, 'unfavorable_penalty': -4, 'desc': '乙庚合化金'},
        '丙辛': {'element': '水', 'favorable_bonus': 5, 'unfavorable_penalty': -4, 'desc': '丙辛合化水'},
        '丁壬': {'element': '木', 'favorable_bonus': 5, 'unfavorable_penalty': -4, 'desc': '丁壬合化木'},
        '戊癸': {'element': '火', 'favorable_bonus': 5, 'unfavorable_penalty': -4, 'desc': '戊癸合化火'}
    },
    'sheng': {
        'bonus': 3,
        'penalty': -2,
        'desc': '天干相生'
    },
    'ke': {
        'controlled_bonus': -2,
        'control_bonus': 3,
        'desc': '天干相克'
    },
    'bi_he': {
        'weak_bonus': 2,
        'strong_penalty': -3,
        'desc': '天干比和'
    }
}

# ==================== 地支互动规则 ====================

DIZHI_INTERACTIONS = {
    'liu_chong': {
        '子': '午', '午': '子',
        '丑': '未', '未': '丑',
        '寅': '申', '申': '寅',
        '卯': '酉', '酉': '卯',
        '辰': '戌', '戌': '辰',
        '巳': '亥', '亥': '巳'
    },
    'liu_chong_scores': {
        'clash_favorable': 5,
        'clash_unfavorable': -10,
        'clash_root': -12,
        'clash_treasury': 8
    },
    'san_he': {
        '申子辰': '水',
        '亥卯未': '木',
        '寅午戌': '火',
        '巳酉丑': '金'
    },
    'san_he_scores': {
        'favorable_complete': 8,
        'favorable_partial': 4,
        'unfavorable_complete': -6,
        'unfavorable_partial': -3
    },
    'liu_he': {
        '子': '丑', '丑': '子',
        '寅': '亥', '亥': '寅',
        '卯': '戌', '戌': '卯',
        '辰': '酉', '酉': '辰',
        '巳': '申', '申': '巳',
        '午': '未', '未': '午'
    },
    'liu_he_scores': {
        'favorable': 4,
        'unfavorable': -3,
        'bind_favorable': -4
    },
    'san_xing': {
        'ziwu': ['子', '卯'],
        'yinshen': ['寅', '巳', '申'],
        'chouxu': ['丑', '未', '戌'],
        'zixing': ['辰', '午', '酉', '亥']
    },
    'san_xing_score': -6,
    'liu_hai': {
        '子': '未', '未': '子',
        '丑': '午', '午': '丑',
        '寅': '巳', '巳': '寅',
        '卯': '辰', '辰': '卯',
        '申': '亥', '亥': '申',
        '酉': '戌', '戌': '酉'
    },
    'liu_hai_score': -4
}

TREASURY_BRANCHES = {
    '辰': '水库',
    '戌': '火库',
    '丑': '金库',
    '未': '木库'
}

# ==================== 神煞完整表 ====================

SHEN_SHA_COMPLETE = {
    'tianyi_guiren': {
        'score': 8,
        'calc_method': 'stem_based',
        'table': {
            '甲': ['丑', '未'], '戊': ['丑', '未'],
            '乙': ['子', '申'], '己': ['子', '申'],
            '丙': ['亥', '酉'], '丁': ['亥', '酉'],
            '庚': ['丑', '未'], '辛': ['寅', '午'],
            '壬': ['卯', '巳'], '癸': ['卯', '巳']
        },
        'desc': '天乙贵人：遇难呈祥，化险为夷'
    },
    'tiande': {
        'score': 10,
        'calc_method': 'month_based',
        'table': {
            '正月': '丁', '二月': '申', '三月': '壬', '四月': '辛',
            '五月': '亥', '六月': '甲', '七月': '癸', '八月': '寅',
            '九月': '丙', '十月': '乙', '十一月': '巳', '十二月': '庚'
        },
        'desc': '天德贵人：天赐之福，逢凶化吉'
    },
    'yuede': {
        'score': 10,
        'calc_method': 'month_based',
        'table': {
            '正月': '丙', '二月': '甲', '三月': '壬', '四月': '庚',
            '五月': '丙', '六月': '甲', '七月': '壬', '八月': '庚',
            '九月': '丙', '十月': '甲', '十一月': '壬', '十二月': '庚'
        },
        'desc': '月德贵人：月中之德，助运添福'
    },
    'wenchang': {
        'score': 8,
        'calc_method': 'stem_based',
        'table': {
            '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申',
            '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯'
        },
        'desc': '文昌贵人：聪明才智，学业有成'
    },
    'taohua': {
        'score': 5,
        'calc_method': 'branch_based',
        'table': {
            '申子辰': '酉',
            '寅午戌': '卯',
            '巳酉丑': '午',
            '亥卯未': '子'
        },
        'desc': '咸池桃花：人缘魅力，情感机遇',
        'dimension_boost': {'romance': 10}
    },
    'yima': {
        'score': 3,
        'calc_method': 'branch_based',
        'table': {
            '申子辰': '寅',
            '寅午戌': '申',
            '巳酉丑': '亥',
            '亥卯未': '巳'
        },
        'desc': '驿马星：奔走动荡，变动出行',
        'dimension_boost': {'travel': 15}
    },
    'yangbian': {
        'score': -8,
        'calc_method': 'stem_based',
        'table': {
            '甲': '卯', '乙': '辰', '丙': '午', '丁': '未', '戊': '午',
            '己': '未', '庚': '酉', '辛': '戌', '壬': '子', '癸': '丑'
        },
        'desc': '羊刃：刚烈冲动，易有血光',
        'dimension_boost': {'career': 3}
    },
    'jiesha': {
        'score': -6,
        'calc_method': 'branch_based',
        'table': {
            '申子辰': '巳',
            '寅午戌': '亥',
            '巳酉丑': '寅',
            '亥卯未': '申'
        },
        'desc': '劫煞：破耗损失，小心财物'
    },
    'zaisha': {
        'score': -5,
        'calc_method': 'branch_based',
        'table': {
            '申子辰': '午',
            '寅午戌': '子',
            '巳酉丑': '卯',
            '亥卯未': '酉'
        },
        'desc': '灾煞：疾病灾祸，注意安全'
    },
    'guchen': {
        'score': -4,
        'calc_method': 'branch_based',
        'table': {
            '亥子丑': '寅',
            '寅卯辰': '巳',
            '巳午未': '申',
            '申酉戌': '亥'
        },
        'desc': '孤辰：孤独寂寞，六亲缘薄'
    },
    'guasu': {
        'score': -4,
        'calc_method': 'branch_based',
        'table': {
            '亥子丑': '戌',
            '寅卯辰': '丑',
            '巳午未': '辰',
            '申酉戌': '未'
        },
        'desc': '寡宿：孤独冷清，感情不顺'
    }
}

# ==================== 六大维度映射 ====================

DIMENSION_MAPPING = {
    'career': {
        'core_shishen': ['正官', '七杀', '正印'],
        'favorable_interactions': ['官印相生', '杀印相生'],
        'unfavorable_interactions': ['伤官见官', '财破印'],
        'base_weight': 1.0,
        'desc': '事业运势'
    },
    'wealth': {
        'core_shishen': ['正财', '偏财', '食神', '伤官'],
        'favorable_interactions': ['食神生财', '伤官生财'],
        'unfavorable_interactions': ['比劫夺财', '印制食伤'],
        'base_weight': 1.0,
        'desc': '财运势'
    },
    'romance': {
        'core_elements': {
            'male': ['正财', '偏财'],
            'female': ['正官', '七杀']
        },
        'branch_interactions': ['六合日支', '桃花入命'],
        'unfavorable_interactions': ['六冲日支', '刑害日支'],
        'base_weight': 1.0,
        'desc': '情感运势'
    },
    'health': {
        'balance_check': True,
        'critical_clashes': ['子午冲', '卯酉冲'],
        'element_excess_threshold': 0.50,
        'element_deficiency_threshold': 0.05,
        'base_weight': 0.8,
        'desc': '健康运势'
    },
    'studies': {
        'core_shishen': ['正印', '偏印', '食神', '伤官'],
        'favorable_shensha': ['文昌贵人', '学堂'],
        'unfavorable_interactions': ['财破印', '印枭夺食'],
        'base_weight': 1.0,
        'desc': '学业运势'
    },
    'travel': {
        'core_shensha': ['驿马'],
        'trigger_clashes': ['冲年支', '冲月支'],
        'four_changsheng': ['寅', '申', '巳', '亥'],
        'base_weight': 0.9,
        'desc': '出行运势'
    }
}

# ==================== 十神影响系数 ====================

TEN_GOD_INFLUENCE_V5 = {
    '比肩': {
        'weak_bonus': 8,
        'strong_penalty': -4,
        'desc': '自我能量强，适合独立行动'
    },
    '劫财': {
        'weak_bonus': 5,
        'strong_penalty': -6,
        'wealth_penalty': -8,
        'desc': '容易破财，需谨慎理财'
    },
    '食神': {
        'bonus': 10,
        'desc': '轻松愉快，创意丰富'
    },
    '伤官': {
        'bonus': 3,
        'officer_penalty': -15,
        'desc': '创新能力强，但需注意口舌'
    },
    '偏财': {
        'strong_bonus': 12,
        'weak_penalty': -2,
        'desc': '横财运佳，投资有利'
    },
    '正财': {
        'strong_bonus': 8,
        'weak_penalty': -3,
        'desc': '稳定收入，正财稳健'
    },
    '七杀': {
        'strong_penalty': -8,
        'weak_penalty': -12,
        'seal_bonus': 5,
        'desc': '压力较大，挑战多'
    },
    '正官': {
        'strong_bonus': 10,
        'weak_bonus': 5,
        'desc': '贵人运强，名誉提升'
    },
    '偏印': {
        'bonus': 0,
        'food_penalty': -8,
        'desc': '思维独特，略显孤独'
    },
    '正印': {
        'bonus': 10,
        'desc': '庇护力强，学习运佳'
    }
}

TEN_GOD_BONUS = {
    '比肩': 5,
    '劫财': -3,
    '食神': 8,
    '伤官': 0,
    '偏财': 10,
    '正财': 3,
    '七杀': -5,
    '正官': 7,
    '偏印': -2,
    '正印': 8
}

SHEN_SHA_SCORE = {
    '天德贵人': 10,
    '月德贵人': 10,
    '天乙贵人': 8,
    '文昌贵人': 8,
    '红鸾': 5,
    '天喜': 5,
    '禄神': 8,
    '驿马': 3,
    '天赦': 12,
    '福星贵人': 6,
    '羊刃': -8,
    '劫煞': -8,
    '灾煞': -6,
    '孤辰': -5,
    '寡宿': -5,
    '亡神': -6,
    '飞刃': -7,
    '白虎': -4,
    '丧门': -5,
    '吊客': -5
}

CLIMATE_PRIORITY = {
    'winter_months': ['亥', '子', '丑'],
    'winter_element': '火',
    'winter_reason': '冬季寒冷，火暖为先',
    'summer_months': ['巳', '午', '未'],
    'summer_element': '水',
    'summer_reason': '夏季炎热，水润为先',
}

TIAO_HOU_RULES = {
    '亥': {'need': '火', 'reason': '寒冬需暖'},
    '子': {'need': '火', 'reason': '寒冬需暖'},
    '丑': {'need': '火', 'reason': '寒冬需暖'},
    '寅': {'need': '火', 'reason': '初春仍寒'},
    '卯': {'need': '水', 'reason': '仲春需润'},
    '辰': {'need': '火', 'reason': '湿土需燥'},
    '巳': {'need': '水', 'reason': '初夏渐热'},
    '午': {'need': '水', 'reason': '炎夏需润'},
    '未': {'need': '水', 'reason': '暑热需润'},
    '申': {'need': '火', 'reason': '金寒需暖'},
    '酉': {'need': '火', 'reason': '金寒需暖'},
    '戌': {'need': '水', 'reason': '燥土需湿'}
}

LIU_CHONG = {
    '子': '午', '午': '子',
    '丑': '未', '未': '丑',
    '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰',
    '巳': '亥', '亥': '巳'
}

SAN_HE = {
    ('申', '子', '辰'): '水',
    ('亥', '卯', '未'): '木',
    ('寅', '午', '戌'): '火',
    ('巳', '酉', '丑'): '金'
}
