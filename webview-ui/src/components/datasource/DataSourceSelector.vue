<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { dataSourceService } from '@/services/dataSource'
import { useMessageStore } from '@/stores/message'
import type { DataSource, DataSourceType } from '@/types/dataSource'

const message = useMessageStore()

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  dataSourceType: {
    type: String as () => DataSourceType,
    default: undefined
  }
})

// 定义组件事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'selected', id: string, dataSource: DataSource): void
}>()

// 组件状态
const loading = ref(false)
const dataSources = ref<DataSource[]>([])
const selectedDataSourceId = ref<string>(props.modelValue || '')

// 计算属性：过滤后的数据源列表
const filteredDataSources = computed(() => {
  if (props.dataSourceType) {
    return dataSources.value.filter(ds => ds.type === props.dataSourceType)
  }
  return dataSources.value
})

// 监听选中值变化
watch(selectedDataSourceId, (newValue) => {
  emit('update:modelValue', newValue)
  
  // 查找选中的数据源数据
  const selectedDataSource = dataSources.value.find(ds => ds.id === newValue)
  if (selectedDataSource) {
    emit('selected', newValue, selectedDataSource)
  }
})

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  selectedDataSourceId.value = newValue
})

// 生命周期钩子
onMounted(async () => {
  await loadDataSources()
})

// 加载数据源列表
const loadDataSources = async () => {
  loading.value = true
  
  try {
    const result = await dataSourceService.getDataSources({ status: 'ACTIVE' })
    
    if (result) {
      dataSources.value = result.items.map(dataSource => ({
        id: dataSource.id,
        name: dataSource.name || `数据源 ${dataSource.id}`,
        description: dataSource.description,
        type: dataSource.type,
        host: dataSource.host,
        port: dataSource.port,
        databaseName: dataSource.databaseName,
        database: dataSource.database,
        username: dataSource.username,
        status: dataSource.status,
        syncFrequency: dataSource.syncFrequency,
        lastSyncTime: dataSource.lastSyncTime,
        createdAt: dataSource.createdAt,
        updatedAt: dataSource.updatedAt
      }))
    }
  } catch (error) {
    console.error('加载数据源列表失败', error)
    message.error('加载数据源列表失败')
  } finally {
    loading.value = false
  }
}

// 刷新数据源列表
const refreshDataSources = async () => {
  await loadDataSources()
}

// 数据源选择变更处理
const handleDataSourceChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedDataSourceId.value = target.value
}

// 添加下拉状态
const isDropdownOpen = ref(false);

// 切换下拉菜单状态
const toggleDropdown = () => {
  if (!props.disabled && !loading.value) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

// 选择数据源
const selectDataSource = (dataSourceId) => {
  selectedDataSourceId.value = dataSourceId;
  isDropdownOpen.value = false;
};

// 点击外部关闭下拉菜单
onMounted(() => {
  document.addEventListener('click', (event) => {
    const dropdownEl = document.querySelector('.data-source-selector .input-with-dropdown');
    if (dropdownEl && !dropdownEl.contains(event.target)) {
      isDropdownOpen.value = false;
    }
  });
});
</script>

<template>
  <div class="data-source-selector">
    <label v-if="props.label" :for="'data-source-selector-' + (Math.random().toString(36).substring(2))" class="block text-sm font-medium text-gray-700 mb-1">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <div class="input-with-dropdown">
        <input
          :value="filteredDataSources.find(ds => ds.id === selectedDataSourceId)?.name || ''"
          type="text"
          readonly
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer"
          :class="{ 'border-red-300': props.error }"
          :placeholder="props.placeholder || '请选择数据源'"
          :disabled="props.disabled || loading"
          @click="toggleDropdown"
        />
        <div class="absolute inset-y-0 right-2 flex items-center">
          <div v-if="loading" class="pointer-events-none">
            <i class="fas fa-circle-notch fa-spin text-gray-400"></i>
          </div>
          <button 
            v-else
            type="button" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none mr-1"
            @click="refreshDataSources"
            title="刷新数据源列表"
          >
            <i class="fas fa-sync-alt"></i>
          </button>
          <i class="fas fa-chevron-down text-gray-400"></i>
        </div>
        
        <div v-if="isDropdownOpen" class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <div v-if="filteredDataSources.length === 0" class="p-3 text-sm text-gray-500 text-center">
            {{ loading ? '加载中...' : '暂无数据源' }}
          </div>
          <ul v-else class="py-1">
            <li
              v-for="dataSource in filteredDataSources"
              :key="dataSource.id"
              class="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              :class="{ 'bg-indigo-50': dataSource.id === selectedDataSourceId }"
              @click="selectDataSource(dataSource.id)"
            >
              {{ dataSource.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div v-if="props.error" class="mt-1 text-sm text-red-600">
      {{ props.error }}
    </div>
  </div>
</template>

<style scoped>
.data-source-selector {
  margin-bottom: 0;
  position: relative;
}

.input-with-dropdown {
  position: relative;
}

input[readonly] {
  cursor: pointer;
  background-color: #fff;
}

input[readonly]:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}
</style>