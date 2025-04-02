/**
 * 日期时间格式化工具
 * 将Date对象或日期字符串格式化为本地化字符串
 * @param date 日期对象或日期字符串
 * @param format 可选的格式化选项
 * @returns 格式化后的日期字符串，无效日期返回'-'
 */
export function formatDateTime(date: Date | string, format?: Intl.DateTimeFormatOptions): string {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // 检查日期是否有效
    if (isNaN(dateObj.getTime())) {
      return '-';
    }
    
    // 默认格式化选项
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    
    // 合并选项
    const options = { ...defaultOptions, ...(format || {}) };
    
    return dateObj.toLocaleString('zh-CN', options);
  } catch (e) {
    console.error('格式化日期时间出错:', e);
    return '-';
  }
}

/**
 * 相对时间格式化工具
 * 将日期格式化为相对时间（如"2小时前"）
 * @param date 日期对象或日期字符串
 * @returns 相对时间字符串，无效日期返回'-'
 */
export function formatRelativeTime(date: Date | string): string {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // 检查日期是否有效
    if (isNaN(dateObj.getTime())) {
      return '-';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);
    
    if (diffSec < 60) {
      return '刚刚';
    }
    
    if (diffMin < 60) {
      return `${diffMin}分钟前`;
    }
    
    if (diffHour < 24) {
      return `${diffHour}小时前`;
    }
    
    if (diffDay < 30) {
      return `${diffDay}天前`;
    }
    
    if (diffMonth < 12) {
      return `${diffMonth}个月前`;
    }
    
    return `${diffYear}年前`;
  } catch (e) {
    console.error('格式化相对时间出错:', e);
    return '-';
  }
}

/**
 * 数字格式化工具
 * 将数字格式化为带千位分隔符的字符串
 * @param num 要格式化的数字
 * @param defaultValue 默认值，当num为null或undefined时返回
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number | null | undefined, defaultValue: string = '-'): string {
  if (num === null || num === undefined) return defaultValue;
  return num.toLocaleString('zh-CN');
}

/**
 * 文件大小格式化
 * 将字节数转换为人类可读的文件大小格式
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 格式化百分比
 * @param value 小数值 (0.1 表示 10%)
 * @param decimals 小数位数
 * @returns 格式化后的百分比字符串
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * 格式化货币金额
 * @param amount 金额
 * @param currency 货币符号
 * @param decimals 小数位数
 * @returns 格式化后的货币金额字符串
 */
export function formatCurrency(amount: number, currency: string = '¥', decimals: number = 2): string {
  return `${currency}${amount.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

/**
 * 截断文本
 * @param text 要截断的文本
 * @param length 最大长度
 * @param suffix 后缀，默认为"..."
 * @returns 截断后的文本
 */
export function truncateText(text: string, length: number, suffix: string = '...'): string {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
}

/**
 * 格式化持续时间
 * @param milliseconds 毫秒数
 * @returns 格式化后的持续时间字符串
 */
export function formatDuration(milliseconds: number): string {
  if (!milliseconds || milliseconds < 0) return '-';
  
  // 小于1秒
  if (milliseconds < 1000) {
    return `${milliseconds}毫秒`;
  }
  
  // 小于1分钟
  if (milliseconds < 60000) {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;
    return ms > 0 ? `${seconds}.${ms.toString().padStart(3, '0')}秒` : `${seconds}秒`;
  }
  
  // 小于1小时
  if (milliseconds < 3600000) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return seconds > 0 ? `${minutes}分${seconds}秒` : `${minutes}分钟`;
  }
  
  // 大于等于1小时
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
}