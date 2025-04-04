/**
 * 国际化配置文件
 * 本文件负责初始化应用程序的国际化设置
 */

import { ref } from 'vue';

// 当前语言设置
export const currentLocale = ref('zh-CN');

// 切换语言
export function setLocale(locale: string) {
  currentLocale.value = locale;
  // 这里可以添加更多语言切换逻辑，如更新组件、存储到localStorage等
}

// 获取当前语言
export function getLocale() {
  return currentLocale.value;
}

// 默认导出，供main.ts使用
export default {
  currentLocale,
  setLocale,
  getLocale
};