<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { DataSource, DataSourceType, SyncFrequency, CreateDataSourceParams, ConnectionTestResult } from '@/types/datasource'
import { useDataSourceStore } from '@/stores/datasource'
import { message } from '@/services/message'

// 组件属性
const props = defineProps<{
  dataSource?: DataSource | null
  isEdit?: boolean
}>()

// 组件事件
const emit = defineEmits<{
  (e: 'save', dataSource: CreateDataSourceParams): void
  (e: 'cancel'): void
  (e: 'test-connection', params: any, callback: (result: ConnectionTestResult) => void): void
}>()

// 数据源状态管理
const dataSourceStore = useDataSourceStore()

// 表单数据
const formData = reactive<{
  id?: string
  name: string
  description: string
  type: DataSourceType
  host: string
  port: number
  databaseName: string
  schema?: string
  username: string
  password: string
  syncFrequency: SyncFrequency
  connectionTimeout: number
  maxPoolSize: number
  autoSync: boolean
  connectionOptions: Record<string, string>
}>({
  name: '',
  description: '',
  type: 'MYSQL',
  host: '',
  port: 3306,
  databaseName: '',
  schema: '',
  username: '',
  password: '',
  syncFrequency: 'MANUAL',
  connectionTimeout: 30,
  maxPoolSize: 10,
  autoSync: false,
  connectionOptions: {}
})

// 默认端口映射
const defaultPorts = {
  'MYSQL': 3306,
  'POSTGRESQL': 5432,
  'ORACLE': 1521,
  'SQLSERVER': 1433,
  'MONGODB': 27017,
  'ELASTICSEARCH': 9200
}

// 表单验证状态
const formErrors = reactive<Record<string, string>>({})
const isFormSubmitting = ref(false)
const isFormValid = ref(false)
const isTestingConnection = ref(false)
const testConnectionResult = ref<ConnectionTestResult | null>(null)

// 计算标题
const formTitle = computed(() => props.isEdit ? '编辑数据源' : '添加数据源')

// 初始化表单数据
onMounted(() => {
  if (props.dataSource) {
    const ds = props.dataSource
    
    formData.id = ds.id
    formData.name = ds.name
    formData.description = ds.description
    formData.type = ds.type
    formData.host = ds.host
    formData.port = ds.port
    formData.databaseName = ds.databaseName
    formData.username = ds.username
    formData.syncFrequency = ds.syncFrequency
    
    // 只有在编辑模式下才不设置密码，因为后端通常不会返回密码
    if (!props.isEdit) {
      formData.password = ds.password || ''
    }
    
    // 处理高级选项
    if (ds.connectionOptions) {
      formData.connectionOptions = { ...ds.connectionOptions }
      
      if (ds.connectionOptions.connectionTimeout) {
        formData.connectionTimeout = parseInt(ds.connectionOptions.connectionTimeout, 10)
      }
      
      if (ds.connectionOptions.maxPoolSize) {
        formData.maxPoolSize = parseInt(ds.connectionOptions.maxPoolSize, 10)
      }
      
      formData.autoSync = ds.syncFrequency !== 'MANUAL'
    }
  }
})

// 监听数据源类型变化，自动设置默认端口
watch(() => formData.type, (newType) => {
  if (defaultPorts[newType]) {
    formData.port = defaultPorts[newType]
  }
})

// 表单验证
const validateForm = () => {
  const errors: Record<string, string> = {}
  
  // 验证名称
  if (!formData.name.trim()) {
    errors.name = '请输入数据源名称'
  }
  
  // 验证主机
  if (!formData.host.trim()) {
    errors.host = '请输入主机地址'
  }
  
  // 验证端口
  if (!formData.port || formData.port <= 0) {
    errors.port = '请输入有效的端口号'
  }
  
  // 验证数据库名
  if (!formData.databaseName.trim()) {
    errors.databaseName = '请输入数据库名称'
  }
  
  // 验证用户名
  if (!formData.username.trim()) {
    errors.username = '请输入用户名'
  }
  
  // 验证密码（仅新建时必填）
  if (!props.isEdit && !formData.password) {
    errors.password = '请输入密码'
  }
  
  formErrors.value = errors
  isFormValid.value = Object.keys(errors).length === 0
  
  return isFormValid.value
}

// 处理输入变化
const handleInput = () => {
  validateForm()
  
  // 清除测试连接结果
  testConnectionResult.value = null
}

// 处理自动同步变化
const handleAutoSyncChange = (checked: boolean) => {
  formData.syncFrequency = checked ? 'DAILY' : 'MANUAL'
}

// 准备保存数据
const prepareDataForSave = (): CreateDataSourceParams => {
  // 构建保存的数据对象
  return {
    id: formData.id,
    name: formData.name,
    description: formData.description,
    type: formData.type,
    host: formData.host,
    port: formData.port,
    databaseName: formData.databaseName,
    username: formData.username,
    password: formData.password,
    syncFrequency: formData.syncFrequency,
    connectionOptions: {
      ...formData.connectionOptions,
      connectionTimeout: formData.connectionTimeout.toString(),
      maxPoolSize: formData.maxPoolSize.toString(),
      schema: formData.schema || ''
    }
  }
}

// 处理测试连接
const handleTestConnection = async () => {
  if (isTestingConnection.value) return
  
  // 验证必要字段
  if (!formData.host || !formData.port || !formData.username || !formData.databaseName) {
    message.error('请先填写主机、端口、用户名和数据库名')
    return
  }
  
  isTestingConnection.value = true
  testConnectionResult.value = null
  
  try {
    // 构建测试参数
    const testParams = {
      type: formData.type,
      host: formData.host,
      port: formData.port,
      databaseName: formData.databaseName,
      username: formData.username,
      password: formData.password,
      connectionOptions: {
        ...formData.connectionOptions,
        connectionTimeout: formData.connectionTimeout.toString(),
        maxPoolSize: formData.maxPoolSize.toString(),
        schema: formData.schema || ''
      }
    }
    
    // 调用测试连接
    emit('test-connection', testParams, (result) => {
      testConnectionResult.value = result
    })
  } catch (err) {
    console.error('测试连接失败:', err)
    message.error('测试连接失败')
  } finally {
    isTestingConnection.value = false
  }
}

// 处理表单提交
const handleSubmit = (e: Event) => {
  e.preventDefault()
  
  if (isFormSubmitting.value) return
  
  // 验证表单
  if (!validateForm()) {
    message.error('请检查表单填写是否正确')
    return
  }
  
  isFormSubmitting.value = true
  
  try {
    const saveData = prepareDataForSave()
    emit('save', saveData)
  } catch (err) {
    console.error('保存数据源失败:', err)
    message.error('保存数据源失败')
  } finally {
    isFormSubmitting.value = false
  }
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="bg-white shadow rounded-lg">
    <div class="p-6">
      <form class="space-y-8 divide-y divide-gray-200" id="datasource-form" @submit="handleSubmit">
        <!-- 基本信息 -->
        <div class="space-y-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              基本信息
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              提供数据源的基本信息。
            </p>
          </div>

          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                名称 <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <input
                  v-model="formData.name"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="name"
                  required
                  type="text"
                  @input="handleInput"
                />
                <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                类型 <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <select
                  v-model="formData.type"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="type"
                  @change="handleInput"
                >
                  <option value="MYSQL">MySQL</option>
                  <option value="POSTGRESQL">PostgreSQL</option>
                  <option value="ORACLE">Oracle</option>
                  <option value="SQLSERVER">SQL Server</option>
                  <option value="MONGODB">MongoDB</option>
                  <option value="ELASTICSEARCH">Elasticsearch</option>
                </select>
              </div>
            </div>

            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700">
                描述
              </label>
              <div class="mt-1">
                <textarea
                  v-model="formData.description"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="description"
                  rows="3"
                  @input="handleInput"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 连接详情 -->
        <div class="pt-8 space-y-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              连接详情
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              配置数据库连接设置。
            </p>
          </div>

          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                主机 <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <input
                  v-model="formData.host"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="host"
                  required
                  type="text"
                  @input="handleInput"
                />
                <p v-if="formErrors.host" class="mt-1 text-sm text-red-600">{{ formErrors.host }}</p>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                端口 <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <input
                  v-model.number="formData.port"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="port"
                  required
                  type="number"
                  @input="handleInput"
                />
                <p v-if="formErrors.port" class="mt-1 text-sm text-red-600">{{ formErrors.port }}</p>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                数据库名称 <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <input
                  v-model="formData.databaseName"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="database"
                  required
                  type="text"
                  @input="handleInput"
                />
                <p v-if="formErrors.databaseName" class="mt-1 text-sm text-red-600">{{ formErrors.databaseName }}</p>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                模式名 (Schema)
              </label>
              <div class="mt-1">
                <input
                  v-model="formData.schema"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="schema"
                  type="text"
                  @input="handleInput"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                用户名 <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <input
                  v-model="formData.username"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="username"
                  required
                  type="text"
                  @input="handleInput"
                />
                <p v-if="formErrors.username" class="mt-1 text-sm text-red-600">{{ formErrors.username }}</p>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                密码 <span v-if="!isEdit" class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <input
                  v-model="formData.password"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="password"
                  :placeholder="isEdit ? '保持不变请留空' : ''"
                  :required="!isEdit"
                  type="password"
                  @input="handleInput"
                />
                <p v-if="formErrors.password" class="mt-1 text-sm text-red-600">{{ formErrors.password }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 高级设置 -->
        <div class="pt-8 space-y-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              高级设置
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              配置其他连接属性。
            </p>
          </div>

          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                连接超时 (秒)
              </label>
              <div class="mt-1">
                <input
                  v-model.number="formData.connectionTimeout"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="timeout"
                  type="number"
                  @input="handleInput"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                最大连接池大小
              </label>
              <div class="mt-1">
                <input
                  v-model.number="formData.maxPoolSize"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="poolSize"
                  type="number"
                  @input="handleInput"
                />
              </div>
            </div>

            <div class="sm:col-span-6">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    v-model="formData.autoSync"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    name="autoSync"
                    type="checkbox"
                    @change="handleAutoSyncChange"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label class="font-medium text-gray-700">启用自动同步</label>
                  <p class="text-gray-500">
                    自动同步来自数据源的元数据变更。
                  </p>
                </div>
              </div>
            </div>
            
            <div class="sm:col-span-3" v-if="formData.autoSync">
              <label class="block text-sm font-medium text-gray-700">
                同步频率
              </label>
              <div class="mt-1">
                <select
                  v-model="formData.syncFrequency"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  name="syncFrequency"
                  @change="handleInput"
                >
                  <option value="HOURLY">每小时</option>
                  <option value="DAILY">每天</option>
                  <option value="WEEKLY">每周</option>
                  <option value="MONTHLY">每月</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 测试连接结果 -->
        <div v-if="testConnectionResult" class="pt-8 space-y-6">
          <div 
            class="rounded-md p-4" 
            :class="testConnectionResult.success ? 'bg-green-50' : 'bg-red-50'"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg 
                  v-if="testConnectionResult.success" 
                  class="h-5 w-5 text-green-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg 
                  v-else 
                  class="h-5 w-5 text-red-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 
                  class="text-sm font-medium" 
                  :class="testConnectionResult.success ? 'text-green-800' : 'text-red-800'"
                >
                  {{ testConnectionResult.success ? '连接成功' : '连接失败' }}
                </h3>
                <div 
                  class="mt-2 text-sm" 
                  :class="testConnectionResult.success ? 'text-green-700' : 'text-red-700'"
                >
                  <p>{{ testConnectionResult.message }}</p>
                  
                  <!-- 如果连接成功，显示数据库信息 -->
                  <div v-if="testConnectionResult.success && testConnectionResult.connectionInfo" class="mt-2">
                    <p class="font-medium">数据库信息：</p>
                    <ul class="list-disc pl-5 mt-1 space-y-1">
                      <li>类型：{{ testConnectionResult.connectionInfo.databaseType }}</li>
                      <li>版本：{{ testConnectionResult.connectionInfo.databaseVersion }}</li>
                      <li>驱动版本：{{ testConnectionResult.connectionInfo.driverVersion }}</li>
                      <li>连接时间：{{ testConnectionResult.connectionInfo.pingTime }}ms</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- 表单操作 -->
    <div
      class="px-6 py-3 bg-gray-50 flex items-center justify-end space-x-3 rounded-b-lg"
    >
      <button
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :disabled="isTestingConnection"
        type="button"
        @click="handleTestConnection"
      >
        <template v-if="isTestingConnection">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          测试中...
        </template>
        <template v-else>
          测试连接
        </template>
      </button>
      <button
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :disabled="isFormSubmitting"
        form="datasource-form"
        type="submit"
      >
        <template v-if="isFormSubmitting">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          保存中...
        </template>
        <template v-else>
          保存数据源
        </template>
      </button>
      <button
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        type="button"
        @click="handleCancel"
      >
        取消
      </button>
    </div>
  </div>
</template>