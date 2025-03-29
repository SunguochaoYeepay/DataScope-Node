/**
 * 日期时间处理插件配置
 * 为项目提供统一的日期处理实例
 */
import dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import objectSupport from 'dayjs/plugin/objectSupport'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

// 注册所有需要的插件
dayjs.extend(localeData)
dayjs.extend(weekday)
dayjs.extend(objectSupport)
dayjs.extend(weekOfYear)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(quarterOfYear)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

// 设置默认语言
dayjs.locale(zhCN)

// 创建dayjsHelpers用于辅助调试和修复问题
const dayjsHelpers = {
  // 创建具有所有dayjs方法的克隆
  createDayjsLike: function(obj: any): any {
    // 创建一个新的dayjs实例作为基础
    const result = dayjs(obj instanceof Date ? obj : (obj && obj.valueOf ? obj.valueOf() : obj))
    
    // 复制原对象的所有自有属性
    if (obj && typeof obj === 'object') {
      Object.getOwnPropertyNames(obj).forEach(prop => {
        if (prop !== 'locale' && prop !== 'format' && !result.hasOwnProperty(prop)) {
          try {
            // @ts-ignore - 动态分配属性，忽略TS错误
            result[prop] = obj[prop]
          } catch (e) {
            // 忽略不可写属性
          }
        }
      })
    }
    
    return result
  }
}

// 修复方案1: 直接修改dayjs原型，确保locale方法总是返回一个完整的dayjs对象
const dayjsProto = Object.getPrototypeOf(dayjs())
if (!dayjsProto.locale || typeof dayjsProto.locale !== 'function') {
  console.info('向dayjs原型添加locale方法')
  // @ts-ignore
  dayjsProto.locale = function(locale: any) {
    // 确保返回一个有format方法的dayjs对象
    return dayjs(this.valueOf())
  }
} else {
  // 保存原始locale方法
  const originalLocale = dayjsProto.locale
  // 重写locale方法确保返回有format方法的对象
  // @ts-ignore
  dayjsProto.locale = function(locale: any) {
    // @ts-ignore - 忽略arguments类型检查
    const result = originalLocale.apply(this, arguments)
    // 如果结果没有format方法，返回一个新的dayjs实例
    if (result && !result.format) {
      console.info('修复locale方法的返回值')
      return dayjs(this.valueOf())
    }
    return result
  }
}

// 修复方案2: 拦截所有dayjs实例的创建
const originalDayjs = dayjs
// @ts-ignore
window.dayjs = function(...args: any[]) {
  const instance = originalDayjs(...args)
  
  if (!instance.locale || typeof instance.locale !== 'function') {
    console.info('向dayjs实例添加locale方法')
    // @ts-ignore
    instance.locale = function(locale: any) {
      // 返回具有format方法的dayjs对象
      return dayjs(this.valueOf())
    }
  } else {
    // 确保locale方法返回有format方法的对象
    const originalInstanceLocale = instance.locale
    // @ts-ignore
    instance.locale = function(locale: any) {
      const result = originalInstanceLocale.apply(this, arguments)
      if (result && !result.format) {
        console.info('修复instance.locale方法的返回值')
        return dayjs(this.valueOf())
      }
      return result
    }
  }
  
  return instance
}
// 复制原始dayjs的所有属性和方法
Object.keys(originalDayjs).forEach(key => {
  // @ts-ignore
  window.dayjs[key] = originalDayjs[key]
})

// 修复方案3: 使用Object.defineProperty在Object.prototype上添加locale方法
// 这样所有对象都会继承这个方法，包括date4
const addLocaleToObjectPrototype = () => {
  if (!Object.prototype.hasOwnProperty('locale')) {
    Object.defineProperty(Object.prototype, 'locale', {
      value: function(locale: any) {
        // 如果这个对象是dayjs对象或类似结构，返回一个新的dayjs实例保证格式化功能
        if (this.format || this.$d || this.valueOf) {
          console.info('Object.prototype.locale被调用，返回dayjs实例')
          return dayjs(this.valueOf ? this.valueOf() : this)
        }
        // 否则仅返回自身，避免干扰其他对象
        return this
      },
      writable: true,
      configurable: true
    })
    console.info('向Object.prototype添加locale方法')
  }
}

// 修复方案4: 全局劫持format方法调用
const originalCall = Function.prototype.call
Function.prototype.call = function(...args) {
  if (this && this.name === 'format' && args[0]) {
    // 首先确保对象有locale方法
    if (!args[0].locale) {
      console.info('在format调用中动态添加locale方法')
      args[0].locale = function(locale: any) {
        // 返回一个具有format方法的dayjs对象
        return dayjs(this.valueOf ? this.valueOf() : this)
      }
    }
    
    // 然后检查这个对象的locale方法返回值是否有format方法
    const testLocale = args[0].locale
    if (testLocale && typeof testLocale === 'function') {
      const testLocaleResult = testLocale.call(args[0])
      if (testLocaleResult && !testLocaleResult.format) {
        console.info('修复locale方法的返回值在format调用中')
        // 重写locale方法以确保返回的对象有format方法
        args[0].locale = function(locale: any) {
          return dayjs(this.valueOf ? this.valueOf() : this)
        }
      }
    }
  }
  return originalCall.apply(this, args)
}

// 最后手段: 修复方案3的执行延迟到下一个事件循环
setTimeout(() => {
  addLocaleToObjectPrototype()
}, 0)

// 强制设置一个全局dayjs变量，确保Ant Design Vue使用的是同一个dayjs实例
// @ts-ignore
window.dayjs_no_conflict = window.dayjs
// @ts-ignore
window.dayjs = window.dayjs || dayjs

// 导出dayjs实例
export default dayjs

// 提供一些常用的格式化函数
export const formatDate = (date: any, format: string = 'YYYY-MM-DD') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

export const formatDateTime = (date: any, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

export const formatTime = (date: any, format: string = 'HH:mm:ss') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

// 获取当前日期（YYYY-MM-DD格式）
export const getCurrentDate = () => {
  return dayjs().format('YYYY-MM-DD')
}

// 获取当前日期时间
export const getCurrentDateTime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// 日期比较函数
export const isAfter = (date1: any, date2: any) => {
  return dayjs(date1).isAfter(dayjs(date2))
}

export const isBefore = (date1: any, date2: any) => {
  return dayjs(date1).isBefore(dayjs(date2))
}

export const isSame = (date1: any, date2: any, unit: any = 'day') => {
  return dayjs(date1).isSame(dayjs(date2), unit)
}

