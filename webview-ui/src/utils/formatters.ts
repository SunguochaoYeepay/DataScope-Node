/**
 * 日期和时间格式化工具函数
 */

/**
 * 格式化日期时间，显示为"YYYY-MM-DD HH:MM:SS"格式
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return '-';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // 判断日期是否有效
  if (isNaN(d.getTime())) return '-';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 格式化持续时间（毫秒），显示为可读格式
 * @param duration 持续时间（毫秒）
 * @returns 格式化后的持续时间字符串
 */
export function formatDuration(duration: number | undefined | null): string {
  if (duration === undefined || duration === null) return '-';
  
  if (duration < 1000) {
    return `${duration}ms`;
  }
  
  if (duration < 60000) {
    return `${(duration / 1000).toFixed(2)}s`;
  }
  
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(2);
  
  return `${minutes}m ${seconds}s`;
} 