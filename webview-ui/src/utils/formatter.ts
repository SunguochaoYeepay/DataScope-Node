/**
 * 日期/时间格式化工具函数
 */

/**
 * 格式化日期为字符串
 * @param date 需要格式化的日期
 * @param format 日期格式，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number | undefined, format: string = 'YYYY-MM-DD'): string {
  if (!date) {
    return ''; 
  }
  
  const d = typeof date === 'object' ? date : new Date(date);
  
  if (!isValidDate(d)) {
    return '';
  }
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  
  return format
    .replace(/YYYY/g, year.toString())
    .replace(/YY/g, year.toString().slice(-2))
    .replace(/MM/g, month < 10 ? `0${month}` : month.toString())
    .replace(/M/g, month.toString())
    .replace(/DD/g, day < 10 ? `0${day}` : day.toString())
    .replace(/D/g, day.toString())
    .replace(/HH/g, hours < 10 ? `0${hours}` : hours.toString())
    .replace(/H/g, hours.toString())
    .replace(/hh/g, (hours % 12 || 12) < 10 ? `0${hours % 12 || 12}` : (hours % 12 || 12).toString())
    .replace(/h/g, (hours % 12 || 12).toString())
    .replace(/mm/g, minutes < 10 ? `0${minutes}` : minutes.toString())
    .replace(/m/g, minutes.toString())
    .replace(/ss/g, seconds < 10 ? `0${seconds}` : seconds.toString())
    .replace(/s/g, seconds.toString())
    .replace(/A/g, hours < 12 ? 'AM' : 'PM')
    .replace(/a/g, hours < 12 ? 'am' : 'pm');
}

/**
 * 格式化日期时间为字符串
 * @param date 需要格式化的日期
 * @param format 日期时间格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: Date | string | number | undefined, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return formatDate(date, format);
}

/**
 * 格式化时间为字符串
 * @param date 需要格式化的日期
 * @param format 时间格式，默认为 'HH:mm:ss'
 * @returns 格式化后的时间字符串
 */
export function formatTime(date: Date | string | number | undefined, format: string = 'HH:mm:ss'): string {
  return formatDate(date, format);
}

/**
 * 日期是否有效
 * @param date 日期对象
 * @returns 是否有效
 */
function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

/**
 * 格式化数字为指定精度和格式
 * @param value 数字值
 * @param precision 小数位数
 * @param thousands 是否使用千分位分隔符
 * @returns 格式化后的数字字符串
 */
export function formatNumber(value: number | string | undefined, precision: number = 2, thousands: boolean = true): string {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return '';
  }
  
  // 处理精度
  const fixed = num.toFixed(precision);
  
  // 处理千分位
  if (thousands) {
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  
  return fixed;
}

/**
 * 格式化货币
 * @param value 数字值
 * @param currency 货币符号，默认为 '¥'
 * @param precision 小数位数，默认为 2
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(value: number | string | undefined, currency: string = '¥', precision: number = 2): string {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  
  return `${currency} ${formatNumber(value, precision)}`;
}

/**
 * 格式化百分比
 * @param value 数字值 (0-1)
 * @param precision 小数位数，默认为 2
 * @returns 格式化后的百分比字符串
 */
export function formatPercent(value: number | string | undefined, precision: number = 2): string {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return '';
  }
  
  return `${formatNumber(num * 100, precision, false)}%`;
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param precision 小数位数，默认为 2
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number | undefined, precision: number = 2): string {
  if (bytes === undefined || bytes === null || bytes < 0) {
    return '';
  }
  
  if (bytes === 0) {
    return '0 Bytes';
  }
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(precision))} ${sizes[i]}`;
}