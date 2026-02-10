// ==========================================
// 中国城市经纬度数据 - 完整版
// 包含所有省会城市 + 主要地级市（共330+个）
// ==========================================

export interface CityData {
  name: string;
  longitude: number;
  latitude: number;
  province: string;
}

// 按省份组织的城市数据
export const CITIES_BY_PROVINCE: Record<string, CityData[]> = {
  '北京': [
    { name: '北京', longitude: 116.4074, latitude: 39.9042, province: '北京' },
  ],
  
  '天津': [
    { name: '天津', longitude: 117.2008, latitude: 39.0842, province: '天津' },
  ],
  
  '河北': [
    { name: '石家庄', longitude: 114.5149, latitude: 38.0428, province: '河北' },
    { name: '唐山', longitude: 118.1758, latitude: 39.6304, province: '河北' },
    { name: '秦皇岛', longitude: 119.6004, latitude: 39.9354, province: '河北' },
    { name: '邯郸', longitude: 114.5391, latitude: 36.6250, province: '河北' },
    { name: '邢台', longitude: 114.5045, latitude: 37.0707, province: '河北' },
    { name: '保定', longitude: 115.4647, latitude: 38.8737, province: '河北' },
    { name: '张家口', longitude: 114.8869, latitude: 40.8118, province: '河北' },
    { name: '承德', longitude: 117.9634, latitude: 40.9919, province: '河北' },
    { name: '沧州', longitude: 116.8387, latitude: 38.3037, province: '河北' },
    { name: '廊坊', longitude: 116.6838, latitude: 39.5382, province: '河北' },
    { name: '衡水', longitude: 115.6706, latitude: 37.7349, province: '河北' },
  ],
  
  '山西': [
    { name: '太原', longitude: 112.5489, latitude: 37.8706, province: '山西' },
    { name: '大同', longitude: 113.2951, latitude: 40.0768, province: '山西' },
    { name: '阳泉', longitude: 113.5832, latitude: 37.8567, province: '山西' },
    { name: '长治', longitude: 113.1163, latitude: 36.1952, province: '山西' },
    { name: '晋城', longitude: 112.8513, latitude: 35.4901, province: '山西' },
    { name: '朔州', longitude: 112.4328, latitude: 39.3313, province: '山西' },
    { name: '晋中', longitude: 112.7525, latitude: 37.6872, province: '山西' },
    { name: '运城', longitude: 111.0073, latitude: 35.0267, province: '山西' },
    { name: '忻州', longitude: 112.7341, latitude: 38.4167, province: '山西' },
    { name: '临汾', longitude: 111.5189, latitude: 36.0881, province: '山西' },
    { name: '吕梁', longitude: 111.1344, latitude: 37.5177, province: '山西' },
  ],
  
  '内蒙古': [
    { name: '呼和浩特', longitude: 111.6708, latitude: 40.8183, province: '内蒙古' },
    { name: '包头', longitude: 109.8403, latitude: 40.6582, province: '内蒙古' },
    { name: '乌海', longitude: 106.7942, latitude: 39.6734, province: '内蒙古' },
    { name: '赤峰', longitude: 118.8870, latitude: 42.2586, province: '内蒙古' },
    { name: '通辽', longitude: 122.2437, latitude: 43.6174, province: '内蒙古' },
    { name: '鄂尔多斯', longitude: 109.7810, latitude: 39.6086, province: '内蒙古' },
    { name: '呼伦贝尔', longitude: 119.7658, latitude: 49.2114, province: '内蒙古' },
    { name: '巴彦淖尔', longitude: 107.3874, latitude: 40.7574, province: '内蒙古' },
    { name: '乌兰察布', longitude: 113.1329, latitude: 40.9941, province: '内蒙古' },
  ],
  
  '辽宁': [
    { name: '沈阳', longitude: 123.4328, latitude: 41.8057, province: '辽宁' },
    { name: '大连', longitude: 121.6147, latitude: 38.9140, province: '辽宁' },
    { name: '鞍山', longitude: 122.9945, latitude: 41.1087, province: '辽宁' },
    { name: '抚顺', longitude: 123.9574, latitude: 41.8801, province: '辽宁' },
    { name: '本溪', longitude: 123.7657, latitude: 41.2986, province: '辽宁' },
    { name: '丹东', longitude: 124.3543, latitude: 40.0005, province: '辽宁' },
    { name: '锦州', longitude: 121.1272, latitude: 41.0950, province: '辽宁' },
    { name: '营口', longitude: 122.2188, latitude: 40.6672, province: '辽宁' },
    { name: '阜新', longitude: 121.6708, latitude: 42.0192, province: '辽宁' },
    { name: '辽阳', longitude: 123.2372, latitude: 41.2694, province: '辽宁' },
    { name: '盘锦', longitude: 122.0698, latitude: 41.1192, province: '辽宁' },
    { name: '铁岭', longitude: 123.8445, latitude: 42.2867, province: '辽宁' },
    { name: '朝阳', longitude: 120.4506, latitude: 41.5733, province: '辽宁' },
    { name: '葫芦岛', longitude: 120.8377, latitude: 40.7112, province: '辽宁' },
  ],
  
  '吉林': [
    { name: '长春', longitude: 125.3235, latitude: 43.8171, province: '吉林' },
    { name: '吉林', longitude: 126.5493, latitude: 43.8378, province: '吉林' },
    { name: '四平', longitude: 124.3505, latitude: 43.1661, province: '吉林' },
    { name: '辽源', longitude: 125.1437, latitude: 42.8876, province: '吉林' },
    { name: '通化', longitude: 125.9394, latitude: 41.7368, province: '吉林' },
    { name: '白山', longitude: 126.4142, latitude: 41.9425, province: '吉林' },
    { name: '松原', longitude: 124.8254, latitude: 45.1411, province: '吉林' },
    { name: '白城', longitude: 122.8397, latitude: 45.6196, province: '吉林' },
    { name: '延边', longitude: 129.5086, latitude: 42.8914, province: '吉林' },
  ],
  
  '黑龙江': [
    { name: '哈尔滨', longitude: 126.5349, latitude: 45.8038, province: '黑龙江' },
    { name: '齐齐哈尔', longitude: 123.9182, latitude: 47.3543, province: '黑龙江' },
    { name: '鸡西', longitude: 130.9699, latitude: 45.2950, province: '黑龙江' },
    { name: '鹤岗', longitude: 130.2977, latitude: 47.3495, province: '黑龙江' },
    { name: '双鸭山', longitude: 131.1592, latitude: 46.6434, province: '黑龙江' },
    { name: '大庆', longitude: 125.1029, latitude: 46.5900, province: '黑龙江' },
    { name: '伊春', longitude: 128.8997, latitude: 47.7279, province: '黑龙江' },
    { name: '佳木斯', longitude: 130.3186, latitude: 46.8000, province: '黑龙江' },
    { name: '七台河', longitude: 130.8416, latitude: 45.7710, province: '黑龙江' },
    { name: '牡丹江', longitude: 129.6330, latitude: 44.5518, province: '黑龙江' },
    { name: '黑河', longitude: 127.5287, latitude: 50.2450, province: '黑龙江' },
    { name: '绥化', longitude: 126.9689, latitude: 46.6371, province: '黑龙江' },
    { name: '大兴安岭', longitude: 124.1964, latitude: 50.4112, province: '黑龙江' },
  ],
  
  '上海': [
    { name: '上海', longitude: 121.4737, latitude: 31.2304, province: '上海' },
  ],
  
  '江苏': [
    { name: '南京', longitude: 118.7969, latitude: 32.0603, province: '江苏' },
    { name: '无锡', longitude: 120.3019, latitude: 31.5747, province: '江苏' },
    { name: '徐州', longitude: 117.2838, latitude: 34.2053, province: '江苏' },
    { name: '常州', longitude: 119.9740, latitude: 31.8109, province: '江苏' },
    { name: '苏州', longitude: 120.5954, latitude: 31.2989, province: '江苏' },
    { name: '南通', longitude: 120.8945, latitude: 31.9809, province: '江苏' },
    { name: '连云港', longitude: 119.2216, latitude: 34.5967, province: '江苏' },
    { name: '淮安', longitude: 119.0153, latitude: 33.6103, province: '江苏' },
    { name: '盐城', longitude: 120.1631, latitude: 33.3479, province: '江苏' },
    { name: '扬州', longitude: 119.4126, latitude: 32.3940, province: '江苏' },
    { name: '镇江', longitude: 119.4251, latitude: 32.1877, province: '江苏' },
    { name: '泰州', longitude: 119.9229, latitude: 32.4564, province: '江苏' },
    { name: '宿迁', longitude: 118.2751, latitude: 33.9630, province: '江苏' },
  ],
  
  '浙江': [
    { name: '杭州', longitude: 120.1551, latitude: 30.2741, province: '浙江' },
    { name: '宁波', longitude: 121.5440, latitude: 29.8683, province: '浙江' },
    { name: '温州', longitude: 120.6994, latitude: 28.0006, province: '浙江' },
    { name: '嘉兴', longitude: 120.7555, latitude: 30.7467, province: '浙江' },
    { name: '湖州', longitude: 120.0867, latitude: 30.8941, province: '浙江' },
    { name: '绍兴', longitude: 120.5820, latitude: 30.0291, province: '浙江' },
    { name: '金华', longitude: 119.6478, latitude: 29.0789, province: '浙江' },
    { name: '衢州', longitude: 118.8595, latitude: 28.9700, province: '浙江' },
    { name: '舟山', longitude: 122.2070, latitude: 30.0160, province: '浙江' },
    { name: '台州', longitude: 121.4207, latitude: 28.6563, province: '浙江' },
    { name: '丽水', longitude: 119.9229, latitude: 28.4517, province: '浙江' },
  ],
  
  '安徽': [
    { name: '合肥', longitude: 117.2272, latitude: 31.8206, province: '安徽' },
    { name: '芜湖', longitude: 118.4330, latitude: 31.3520, province: '安徽' },
    { name: '蚌埠', longitude: 117.3889, latitude: 32.9162, province: '安徽' },
    { name: '淮南', longitude: 117.0183, latitude: 32.6475, province: '安徽' },
    { name: '马鞍山', longitude: 118.5066, latitude: 31.6700, province: '安徽' },
    { name: '淮北', longitude: 116.7987, latitude: 33.9600, province: '安徽' },
    { name: '铜陵', longitude: 117.8120, latitude: 30.9456, province: '安徽' },
    { name: '安庆', longitude: 117.0530, latitude: 30.5255, province: '安徽' },
    { name: '黄山', longitude: 118.3378, latitude: 29.7144, province: '安徽' },
    { name: '滁州', longitude: 118.3163, latitude: 32.3017, province: '安徽' },
    { name: '阜阳', longitude: 115.8197, latitude: 32.8969, province: '安徽' },
    { name: '宿州', longitude: 116.9636, latitude: 33.6339, province: '安徽' },
    { name: '六安', longitude: 116.5078, latitude: 31.7341, province: '安徽' },
    { name: '亳州', longitude: 115.7788, latitude: 33.8712, province: '安徽' },
    { name: '池州', longitude: 117.4896, latitude: 30.6643, province: '安徽' },
    { name: '宣城', longitude: 118.7583, latitude: 30.9407, province: '安徽' },
  ],
  
  '福建': [
    { name: '福州', longitude: 119.2965, latitude: 26.0745, province: '福建' },
    { name: '厦门', longitude: 118.0894, latitude: 24.4798, province: '福建' },
    { name: '莆田', longitude: 119.0077, latitude: 25.4540, province: '福建' },
    { name: '三明', longitude: 117.6388, latitude: 26.2634, province: '福建' },
    { name: '泉州', longitude: 118.6754, latitude: 24.8740, province: '福建' },
    { name: '漳州', longitude: 117.6472, latitude: 24.5107, province: '福建' },
    { name: '南平', longitude: 118.1779, latitude: 26.6417, province: '福建' },
    { name: '龙岩', longitude: 117.0172, latitude: 25.0916, province: '福建' },
    { name: '宁德', longitude: 119.5477, latitude: 26.6592, province: '福建' },
  ],
  
  '江西': [
    { name: '南昌', longitude: 115.8581, latitude: 28.6832, province: '江西' },
    { name: '景德镇', longitude: 117.1781, latitude: 29.2686, province: '江西' },
    { name: '萍乡', longitude: 113.8548, latitude: 27.6229, province: '江西' },
    { name: '九江', longitude: 116.0019, latitude: 29.7051, province: '江西' },
    { name: '新余', longitude: 114.9171, latitude: 27.8177, province: '江西' },
    { name: '鹰潭', longitude: 117.0695, latitude: 28.2386, province: '江西' },
    { name: '赣州', longitude: 114.9403, latitude: 25.8311, province: '江西' },
    { name: '吉安', longitude: 114.9927, latitude: 27.1138, province: '江西' },
    { name: '宜春', longitude: 114.4166, latitude: 27.8153, province: '江西' },
    { name: '抚州', longitude: 116.3583, latitude: 27.9492, province: '江西' },
    { name: '上饶', longitude: 117.9434, latitude: 28.4544, province: '江西' },
  ],
  
  '山东': [
    { name: '济南', longitude: 117.1205, latitude: 36.6519, province: '山东' },
    { name: '青岛', longitude: 120.3826, latitude: 36.0671, province: '山东' },
    { name: '淄博', longitude: 118.0548, latitude: 36.8132, province: '山东' },
    { name: '枣庄', longitude: 117.3234, latitude: 34.8107, province: '山东' },
    { name: '东营', longitude: 118.6748, latitude: 37.4343, province: '山东' },
    { name: '烟台', longitude: 121.4478, latitude: 37.4638, province: '山东' },
    { name: '潍坊', longitude: 119.1070, latitude: 36.7093, province: '山东' },
    { name: '济宁', longitude: 116.5872, latitude: 35.4150, province: '山东' },
    { name: '泰安', longitude: 117.0875, latitude: 36.2003, province: '山东' },
    { name: '威海', longitude: 122.1204, latitude: 37.5097, province: '山东' },
    { name: '日照', longitude: 119.5269, latitude: 35.4164, province: '山东' },
    { name: '临沂', longitude: 118.3563, latitude: 35.1045, province: '山东' },
    { name: '德州', longitude: 116.3594, latitude: 37.4355, province: '山东' },
    { name: '聊城', longitude: 115.9858, latitude: 36.4567, province: '山东' },
    { name: '滨州', longitude: 117.9708, latitude: 37.3835, province: '山东' },
    { name: '菏泽', longitude: 115.4809, latitude: 35.2333, province: '山东' },
  ],
  
  '河南': [
    { name: '郑州', longitude: 113.6254, latitude: 34.7466, province: '河南' },
    { name: '开封', longitude: 114.3477, latitude: 34.7972, province: '河南' },
    { name: '洛阳', longitude: 112.4539, latitude: 34.6197, province: '河南' },
    { name: '平顶山', longitude: 113.1927, latitude: 33.7352, province: '河南' },
    { name: '安阳', longitude: 114.3929, latitude: 36.0975, province: '河南' },
    { name: '鹤壁', longitude: 114.2974, latitude: 35.7478, province: '河南' },
    { name: '新乡', longitude: 113.9268, latitude: 35.3030, province: '河南' },
    { name: '焦作', longitude: 113.2418, latitude: 35.2159, province: '河南' },
    { name: '濮阳', longitude: 115.0291, latitude: 35.7619, province: '河南' },
    { name: '许昌', longitude: 113.8520, latitude: 34.0358, province: '河南' },
    { name: '漯河', longitude: 114.0166, latitude: 33.5818, province: '河南' },
    { name: '三门峡', longitude: 111.1818, latitude: 34.7730, province: '河南' },
    { name: '南阳', longitude: 112.5283, latitude: 32.9909, province: '河南' },
    { name: '商丘', longitude: 115.6564, latitude: 34.4144, province: '河南' },
    { name: '信阳', longitude: 114.0919, latitude: 32.1470, province: '河南' },
    { name: '周口', longitude: 114.6496, latitude: 33.6250, province: '河南' },
    { name: '驻马店', longitude: 114.0226, latitude: 32.9801, province: '河南' },
  ],
  
  '湖北': [
    { name: '武汉', longitude: 114.3054, latitude: 30.5931, province: '湖北' },
    { name: '黄石', longitude: 115.0387, latitude: 30.1996, province: '湖北' },
    { name: '十堰', longitude: 110.7989, latitude: 32.6291, province: '湖北' },
    { name: '宜昌', longitude: 111.2860, latitude: 30.6920, province: '湖北' },
    { name: '襄阳', longitude: 112.1226, latitude: 32.0090, province: '湖北' },
    { name: '鄂州', longitude: 114.8946, latitude: 30.3969, province: '湖北' },
    { name: '荆门', longitude: 112.1997, latitude: 31.0354, province: '湖北' },
    { name: '孝感', longitude: 113.9169, latitude: 30.9264, province: '湖北' },
    { name: '荆州', longitude: 112.2397, latitude: 30.3353, province: '湖北' },
    { name: '黄冈', longitude: 114.8722, latitude: 30.4477, province: '湖北' },
    { name: '咸宁', longitude: 114.3224, latitude: 29.8418, province: '湖北' },
    { name: '随州', longitude: 113.3826, latitude: 31.6903, province: '湖北' },
    { name: '恩施', longitude: 109.4793, latitude: 30.2720, province: '湖北' },
  ],
  
  '湖南': [
    { name: '长沙', longitude: 112.9388, latitude: 28.2282, province: '湖南' },
    { name: '株洲', longitude: 113.1342, latitude: 27.8274, province: '湖南' },
    { name: '湘潭', longitude: 112.9443, latitude: 27.8296, province: '湖南' },
    { name: '衡阳', longitude: 112.5719, latitude: 26.8933, province: '湖南' },
    { name: '邵阳', longitude: 111.4677, latitude: 27.2389, province: '湖南' },
    { name: '岳阳', longitude: 113.1288, latitude: 29.3571, province: '湖南' },
    { name: '常德', longitude: 111.6983, latitude: 29.0397, province: '湖南' },
    { name: '张家界', longitude: 110.4791, latitude: 29.1176, province: '湖南' },
    { name: '益阳', longitude: 112.3550, latitude: 28.5544, province: '湖南' },
    { name: '郴州', longitude: 113.0146, latitude: 25.7706, province: '湖南' },
    { name: '永州', longitude: 111.6134, latitude: 26.4206, province: '湖南' },
    { name: '怀化', longitude: 110.0019, latitude: 27.5504, province: '湖南' },
    { name: '娄底', longitude: 111.9937, latitude: 27.6983, province: '湖南' },
    { name: '湘西', longitude: 109.7397, latitude: 28.3115, province: '湖南' },
  ],
  
  '广东': [
    { name: '广州', longitude: 113.2644, latitude: 23.1291, province: '广东' },
    { name: '韶关', longitude: 113.5977, latitude: 24.8101, province: '广东' },
    { name: '深圳', longitude: 114.0579, latitude: 22.5431, province: '广东' },
    { name: '珠海', longitude: 113.5767, latitude: 22.2707, province: '广东' },
    { name: '汕头', longitude: 116.6819, latitude: 23.3540, province: '广东' },
    { name: '佛山', longitude: 113.1220, latitude: 23.0217, province: '广东' },
    { name: '江门', longitude: 113.0816, latitude: 22.5790, province: '广东' },
    { name: '湛江', longitude: 110.3577, latitude: 21.2707, province: '广东' },
    { name: '茂名', longitude: 110.9253, latitude: 21.6631, province: '广东' },
    { name: '肇庆', longitude: 112.4650, latitude: 23.0476, province: '广东' },
    { name: '惠州', longitude: 114.4152, latitude: 23.1115, province: '广东' },
    { name: '梅州', longitude: 116.1226, latitude: 24.2888, province: '广东' },
    { name: '汕尾', longitude: 115.3750, latitude: 22.7865, province: '广东' },
    { name: '河源', longitude: 114.7005, latitude: 23.7433, province: '广东' },
    { name: '阳江', longitude: 111.9827, latitude: 21.8575, province: '广东' },
    { name: '清远', longitude: 113.0565, latitude: 23.6817, province: '广东' },
    { name: '东莞', longitude: 113.7518, latitude: 23.0206, province: '广东' },
    { name: '中山', longitude: 113.3927, latitude: 22.5170, province: '广东' },
    { name: '潮州', longitude: 116.6228, latitude: 23.6566, province: '广东' },
    { name: '揭阳', longitude: 116.3729, latitude: 23.5438, province: '广东' },
    { name: '云浮', longitude: 112.0446, latitude: 22.9151, province: '广东' },
  ],
  
  '广西': [
    { name: '南宁', longitude: 108.3661, latitude: 22.8172, province: '广西' },
    { name: '柳州', longitude: 109.4281, latitude: 24.3264, province: '广西' },
    { name: '桂林', longitude: 110.2993, latitude: 25.2736, province: '广西' },
    { name: '梧州', longitude: 111.2797, latitude: 23.4761, province: '广西' },
    { name: '北海', longitude: 109.1201, latitude: 21.4813, province: '广西' },
    { name: '防城港', longitude: 108.3548, latitude: 21.6174, province: '广西' },
    { name: '钦州', longitude: 108.6542, latitude: 21.9794, province: '广西' },
    { name: '贵港', longitude: 109.6023, latitude: 23.1115, province: '广西' },
    { name: '玉林', longitude: 110.1810, latitude: 22.6542, province: '广西' },
    { name: '百色', longitude: 106.6183, latitude: 23.9023, province: '广西' },
    { name: '贺州', longitude: 111.5520, latitude: 24.4038, province: '广西' },
    { name: '河池', longitude: 108.0854, latitude: 24.6996, province: '广西' },
    { name: '来宾', longitude: 109.2212, latitude: 23.7508, province: '广西' },
    { name: '崇左', longitude: 107.3645, latitude: 22.3766, province: '广西' },
  ],
  
  '海南': [
    { name: '海口', longitude: 110.1999, latitude: 20.0444, province: '海南' },
    { name: '三亚', longitude: 109.5122, latitude: 18.2528, province: '海南' },
    { name: '三沙', longitude: 112.3389, latitude: 16.8311, province: '海南' },
    { name: '儋州', longitude: 109.5767, latitude: 19.5213, province: '海南' },
  ],
  
  '重庆': [
    { name: '重庆', longitude: 106.5516, latitude: 29.5630, province: '重庆' },
  ],
  
  '四川': [
    { name: '成都', longitude: 104.0665, latitude: 30.5723, province: '四川' },
    { name: '自贡', longitude: 104.7784, latitude: 29.3398, province: '四川' },
    { name: '攀枝花', longitude: 101.7183, latitude: 26.5804, province: '四川' },
    { name: '泸州', longitude: 105.4433, latitude: 28.8719, province: '四川' },
    { name: '德阳', longitude: 104.3979, latitude: 31.1268, province: '四川' },
    { name: '绵阳', longitude: 104.6790, latitude: 31.4671, province: '四川' },
    { name: '广元', longitude: 105.8297, latitude: 32.4357, province: '四川' },
    { name: '遂宁', longitude: 105.5713, latitude: 30.5327, province: '四川' },
    { name: '内江', longitude: 105.0586, latitude: 29.5806, province: '四川' },
    { name: '乐山', longitude: 103.7651, latitude: 29.5522, province: '四川' },
    { name: '南充', longitude: 106.1105, latitude: 30.8370, province: '四川' },
    { name: '眉山', longitude: 103.8485, latitude: 30.0756, province: '四川' },
    { name: '宜宾', longitude: 104.6430, latitude: 28.7696, province: '四川' },
    { name: '广安', longitude: 106.6334, latitude: 30.4564, province: '四川' },
    { name: '达州', longitude: 107.4682, latitude: 31.2094, province: '四川' },
    { name: '雅安', longitude: 103.0421, latitude: 29.9800, province: '四川' },
    { name: '巴中', longitude: 106.7476, latitude: 31.8691, province: '四川' },
    { name: '资阳', longitude: 104.6278, latitude: 30.1222, province: '四川' },
    { name: '阿坝', longitude: 102.2245, latitude: 31.8998, province: '四川' },
    { name: '甘孜', longitude: 101.9638, latitude: 30.0499, province: '四川' },
    { name: '凉山', longitude: 102.2677, latitude: 27.8808, province: '四川' },
  ],
  
  '贵州': [
    { name: '贵阳', longitude: 106.6302, latitude: 26.6477, province: '贵州' },
    { name: '六盘水', longitude: 104.8305, latitude: 26.5918, province: '贵州' },
    { name: '遵义', longitude: 106.9272, latitude: 27.6999, province: '贵州' },
    { name: '安顺', longitude: 105.9476, latitude: 26.2455, province: '贵州' },
    { name: '毕节', longitude: 105.2863, latitude: 27.2828, province: '贵州' },
    { name: '铜仁', longitude: 109.1896, latitude: 27.6842, province: '贵州' },
    { name: '黔西南', longitude: 104.9065, latitude: 25.0881, province: '贵州' },
    { name: '黔东南', longitude: 107.9774, latitude: 26.5834, province: '贵州' },
    { name: '黔南', longitude: 107.5175, latitude: 26.2534, province: '贵州' },
  ],
  
  '云南': [
    { name: '昆明', longitude: 102.8329, latitude: 24.8801, province: '云南' },
    { name: '曲靖', longitude: 103.7976, latitude: 25.4895, province: '云南' },
    { name: '玉溪', longitude: 102.5437, latitude: 24.3520, province: '云南' },
    { name: '保山', longitude: 99.1670, latitude: 25.1119, province: '云南' },
    { name: '昭通', longitude: 103.7176, latitude: 27.3381, province: '云南' },
    { name: '丽江', longitude: 100.2270, latitude: 26.8721, province: '云南' },
    { name: '普洱', longitude: 100.9729, latitude: 22.7773, province: '云南' },
    { name: '临沧', longitude: 100.0885, latitude: 23.8839, province: '云南' },
    { name: '楚雄', longitude: 101.5457, latitude: 25.0420, province: '云南' },
    { name: '红河', longitude: 103.3769, latitude: 23.3626, province: '云南' },
    { name: '文山', longitude: 104.2433, latitude: 23.3695, province: '云南' },
    { name: '西双版纳', longitude: 100.7979, latitude: 22.0017, province: '云南' },
    { name: '大理', longitude: 100.2676, latitude: 25.6067, province: '云南' },
    { name: '德宏', longitude: 98.5784, latitude: 24.4367, province: '云南' },
    { name: '怒江', longitude: 98.8567, latitude: 25.8176, province: '云南' },
    { name: '迪庆', longitude: 99.7065, latitude: 27.8269, province: '云南' },
  ],
  
  '西藏': [
    { name: '拉萨', longitude: 91.1145, latitude: 29.6444, province: '西藏' },
    { name: '日喀则', longitude: 88.8851, latitude: 29.2690, province: '西藏' },
    { name: '昌都', longitude: 97.1785, latitude: 31.1369, province: '西藏' },
    { name: '林芝', longitude: 94.3617, latitude: 29.6491, province: '西藏' },
    { name: '山南', longitude: 91.7731, latitude: 29.2373, province: '西藏' },
    { name: '那曲', longitude: 92.0535, latitude: 31.4761, province: '西藏' },
    { name: '阿里', longitude: 80.1055, latitude: 32.5013, province: '西藏' },
  ],
  
  '陕西': [
    { name: '西安', longitude: 108.9398, latitude: 34.3416, province: '陕西' },
    { name: '铜川', longitude: 108.9450, latitude: 34.8965, province: '陕西' },
    { name: '宝鸡', longitude: 107.2372, latitude: 34.3618, province: '陕西' },
    { name: '咸阳', longitude: 108.7093, latitude: 34.3297, province: '陕西' },
    { name: '渭南', longitude: 109.5096, latitude: 34.4997, province: '陕西' },
    { name: '延安', longitude: 109.4897, latitude: 36.5853, province: '陕西' },
    { name: '汉中', longitude: 107.0236, latitude: 33.0677, province: '陕西' },
    { name: '榆林', longitude: 109.7344, latitude: 38.2854, province: '陕西' },
    { name: '安康', longitude: 109.0295, latitude: 32.6840, province: '陕西' },
    { name: '商洛', longitude: 109.9187, latitude: 33.8701, province: '陕西' },
  ],
  
  '甘肃': [
    { name: '兰州', longitude: 103.8343, latitude: 36.0611, province: '甘肃' },
    { name: '嘉峪关', longitude: 98.2773, latitude: 39.7717, province: '甘肃' },
    { name: '金昌', longitude: 102.1877, latitude: 38.5208, province: '甘肃' },
    { name: '白银', longitude: 104.1393, latitude: 36.5447, province: '甘肃' },
    { name: '天水', longitude: 105.7244, latitude: 34.5806, province: '甘肃' },
    { name: '武威', longitude: 102.6380, latitude: 37.9282, province: '甘肃' },
    { name: '张掖', longitude: 100.4495, latitude: 38.9253, province: '甘肃' },
    { name: '平凉', longitude: 106.6653, latitude: 35.5428, province: '甘肃' },
    { name: '酒泉', longitude: 98.4941, latitude: 39.7332, province: '甘肃' },
    { name: '庆阳', longitude: 107.6434, latitude: 35.7089, province: '甘肃' },
    { name: '定西', longitude: 104.6260, latitude: 35.5806, province: '甘肃' },
    { name: '陇南', longitude: 104.9219, latitude: 33.4007, province: '甘肃' },
    { name: '临夏', longitude: 103.2107, latitude: 35.5993, province: '甘肃' },
    { name: '甘南', longitude: 102.9111, latitude: 34.9864, province: '甘肃' },
  ],
  
  '青海': [
    { name: '西宁', longitude: 101.7782, latitude: 36.6171, province: '青海' },
    { name: '海东', longitude: 102.1041, latitude: 36.5029, province: '青海' },
    { name: '海北', longitude: 100.9010, latitude: 36.9541, province: '青海' },
    { name: '黄南', longitude: 102.0076, latitude: 35.5228, province: '青海' },
    { name: '海南', longitude: 100.6233, latitude: 36.2804, province: '青海' },
    { name: '果洛', longitude: 100.2423, latitude: 34.4716, province: '青海' },
    { name: '玉树', longitude: 97.0086, latitude: 33.0040, province: '青海' },
    { name: '海西', longitude: 97.3701, latitude: 37.3743, province: '青海' },
  ],
  
  '宁夏': [
    { name: '银川', longitude: 106.2309, latitude: 38.4872, province: '宁夏' },
    { name: '石嘴山', longitude: 106.3765, latitude: 39.0133, province: '宁夏' },
    { name: '吴忠', longitude: 106.1987, latitude: 37.9974, province: '宁夏' },
    { name: '固原', longitude: 106.2426, latitude: 36.0159, province: '宁夏' },
    { name: '中卫', longitude: 105.1896, latitude: 37.4999, province: '宁夏' },
  ],
  
  '新疆': [
    { name: '乌鲁木齐', longitude: 87.6168, latitude: 43.8256, province: '新疆' },
    { name: '克拉玛依', longitude: 84.8890, latitude: 45.5794, province: '新疆' },
    { name: '吐鲁番', longitude: 89.1815, latitude: 42.9513, province: '新疆' },
    { name: '哈密', longitude: 93.5151, latitude: 42.8185, province: '新疆' },
    { name: '昌吉', longitude: 87.3041, latitude: 44.0070, province: '新疆' },
    { name: '博尔塔拉', longitude: 82.0524, latitude: 44.9058, province: '新疆' },
    { name: '巴音郭楞', longitude: 86.1457, latitude: 41.7686, province: '新疆' },
    { name: '阿克苏', longitude: 80.2651, latitude: 41.1707, province: '新疆' },
    { name: '克孜勒苏', longitude: 76.1376, latitude: 39.7503, province: '新疆' },
    { name: '喀什', longitude: 75.9897, latitude: 39.4677, province: '新疆' },
    { name: '和田', longitude: 79.9226, latitude: 37.1104, province: '新疆' },
    { name: '伊犁', longitude: 81.3243, latitude: 43.9170, province: '新疆' },
    { name: '塔城', longitude: 82.9856, latitude: 46.7586, province: '新疆' },
    { name: '阿勒泰', longitude: 88.1416, latitude: 47.8397, province: '新疆' },
  ],
  
  '香港': [
    { name: '香港', longitude: 114.1733, latitude: 22.3200, province: '香港' },
  ],
  
  '澳门': [
    { name: '澳门', longitude: 113.5439, latitude: 22.1987, province: '澳门' },
  ],
  
  '台湾': [
    { name: '台北', longitude: 121.5098, latitude: 25.0478, province: '台湾' },
    { name: '高雄', longitude: 120.3014, latitude: 22.6203, province: '台湾' },
    { name: '台中', longitude: 120.6736, latitude: 24.1477, province: '台湾' },
    { name: '台南', longitude: 120.2133, latitude: 22.9998, province: '台湾' },
  ],
};

// 生成扁平化的城市列表（用于搜索和选择）
export const ALL_CITIES: CityData[] = Object.values(CITIES_BY_PROVINCE)
  .flat()
  .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

// 快速查找：城市名 -> 经度
export const CITY_LONGITUDE_MAP: Record<string, number> = ALL_CITIES.reduce(
  (acc, city) => {
    acc[city.name] = city.longitude;
    return acc;
  },
  {} as Record<string, number>
);

// 导出便捷函数
export function getCityLongitude(cityName: string): number | null {
  return CITY_LONGITUDE_MAP[cityName] || null;
}

function normalizeLocationText(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, '')
    .replace(/(特别行政区|壮族自治区|回族自治区|维吾尔自治区|自治区|地区|盟|省|市)$/g, '');
}

export function searchCities(query: string): CityData[] {
  const rawQuery = query.trim();
  if (!rawQuery) return [];
  const normalizedQuery = normalizeLocationText(rawQuery);
  return ALL_CITIES.filter((city) => {
    const name = normalizeLocationText(city.name);
    const province = normalizeLocationText(city.province);
    return (
      city.name.includes(rawQuery) ||
      city.province.includes(rawQuery) ||
      name.includes(normalizedQuery) ||
      province.includes(normalizedQuery)
    );
  });
}

// 统计信息
console.log(`✓ 已加载 ${ALL_CITIES.length} 个城市数据`);
console.log(`✓ 覆盖 ${Object.keys(CITIES_BY_PROVINCE).length} 个省份/直辖市`);
