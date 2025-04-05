/**
 * Dayjs配置
 * 
 * 设置全局Dayjs配置，包括：
 * 1. 加载必要插件
 * 2. 设置默认语言
 * 3. 设置默认格式
 */

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/zh-cn';

// 是否已初始化
let initialized = false;

/**
 * 设置Dayjs配置
 */
export function setupDayjs() {
  // 防止重复初始化
  if (initialized) {
    console.warn('[Utils] Dayjs已初始化，跳过');
    return;
  }
  
  // 标记为已初始化
  initialized = true;
  
  // 注册插件
  dayjs.extend(localizedFormat); // 使用本地化格式
  dayjs.extend(relativeTime);    // 相对时间，如"几分钟前"
  dayjs.extend(duration);        // 持续时间功能
  dayjs.extend(utc);             // UTC支持
  dayjs.extend(timezone);        // 时区支持
  
  // 设置中文作为默认语言
  dayjs.locale('zh-cn');
  
  console.log('[Utils] Dayjs配置完成，默认语言: zh-cn');
}

/**
 * 格式化日期时间
 * @param date 要格式化的日期
 * @param format 自定义格式，默认为'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: string | Date | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format);
}

/**
 * 获取相对时间
 * @param date 目标日期
 * @returns 相对当前时间的描述，如"3小时前"
 */
export function fromNow(date: string | Date | number): string {
  return dayjs(date).fromNow();
}

/**
 * 计算两个日期之间的差异
 * @param date1 第一个日期
 * @param date2 第二个日期，默认为当前时间
 * @returns 两个日期之间的毫秒数
 */
export function diff(date1: string | Date | number, date2: string | Date | number = new Date()): number {
  return dayjs(date1).diff(dayjs(date2));
}

/**
 * 获取当前日期时间
 * @param format 自定义格式，默认为'YYYY-MM-DD HH:mm:ss'
 * @returns 当前日期时间的字符串表示
 */
export function now(format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs().format(format);
}

// 默认导出dayjs
export default dayjs; 