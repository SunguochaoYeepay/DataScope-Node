/**
 * Ant Design Vue 本地化配置
 * 确保所有 Ant Design Vue 组件使用一致的本地化配置
 */
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 确保 dayjs 使用中文
dayjs.locale('zh-cn')

export default zhCN
