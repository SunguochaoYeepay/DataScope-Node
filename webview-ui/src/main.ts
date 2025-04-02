import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 最优先导入dayjs配置（包含locale和plugins），必须在其他所有导入之前
import './plugins/dayjs'

import App from './App.vue'
import router from './router'

// 导入自定义样式，确保Tailwind可以正确应用
import './styles/index.css'
import { initQueryTemplates } from './services/queryTemplates'

// 引入Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css'

// 引入Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 导入Ant Design Vue中文配置
import zhCN from './plugins/antd-locale'

// 引入ECharts配置
import './plugins/echarts'

// 引入消息服务插件
import { installMessageService } from './services/message'

// 初始化查询模板
initQueryTemplates()

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(Antd)
installMessageService.install(app)  // 正确调用消息服务插件
app.mount('#app')