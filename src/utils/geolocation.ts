// ==========================================
// GPS定位工具
// ==========================================

import { CITY_LONGITUDE_MAP } from './cityData';

export interface LocationResult {
  latitude: number;
  longitude: number;
  city?: string;
  error?: string;
}

/**
 * 获取用户当前位置
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        latitude: 39.9042,
        longitude: 116.4074,
        city: '北京',
        error: '浏览器不支持定位功能'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // 根据经纬度匹配最近的城市
        const city = findNearestCity(longitude);
        
        resolve({
          latitude,
          longitude,
          city
        });
      },
      (error) => {
        // 定位失败，返回默认值（北京）
        resolve({
          latitude: 39.9042,
          longitude: 116.4074,
          city: '北京',
          error: getErrorMessage(error.code)
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * 根据经度查找最近的城市
 */
function findNearestCity(longitude: number): string {
  let minDistance = Infinity;
  let nearestCity = '北京';
  let nearestLongitude = 116.4074;

  for (const [city, lon] of Object.entries(CITY_LONGITUDE_MAP)) {
    const distance = Math.abs(lon - longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
      nearestLongitude = lon;
    }
  }

  return nearestCity;
}

/**
 * 获取错误消息
 */
function getErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return '用户拒绝了定位请求';
    case 2:
      return '定位信息不可用';
    case 3:
      return '定位请求超时';
    default:
      return '定位失败';
  }
}

/**
 * 检查是否支持定位
 */
export function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator;
}
