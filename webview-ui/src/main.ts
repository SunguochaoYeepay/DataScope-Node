import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 最优先导入dayjs配置（包含locale和plugins），必须在其他所有导入之前
import './plugins/dayjs'

import App from './App.vue'
import router from './router'
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

// 初始化查询模板
initQueryTemplates()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd, { locale: zhCN }) // 应用中文配置

app.mount('#app')