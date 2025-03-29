<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  numericColumns: {
    type: Array as () => string[],
    required: true
  },
  categoricalColumns: {
    type: Array as () => string[],
    required: true
  },
  chartType: {
    type: String as () => 'BAR' | 'LINE' | 'PIE' | 'SCATTER' | 'AREA',
    required: true
  },
  config: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:config', 'change-chart-type'])

// 本地状态
const localConfig = ref({
  xAxis: props.config.xAxis || '',
  yAxis: props.config.yAxis || '',
  series: props.config.series || '',
  showLegend: props.config.showLegend ?? true,
  colorScheme: props.config.colorScheme || 'default'
})

// 图表类型
const chartTypes = [
  { id: 'BAR', label: '柱状图', icon: 'chart-bar' },
  { id: 'LINE', label: '折线图', icon: 'chart-line' },
  { id: 'PIE', label: '饼图', icon: 'chart-pie' },
  { id: 'SCATTER', label: '散点图', icon: 'braille' },
  { id: 'AREA', label: '面积图', icon: 'chart-area' }
]

// 颜色方案
const colorSchemes = [
  { id: 'default', label: '默认' },
  { id: 'warm', label: '暖色调' },
  { id: 'cool', label: '冷色调' },
  { id: 'monochrome', label: '单色调' }
]

// 更新配置
watch(localConfig, (newConfig) => {
  emit('update:config', newConfig)
}, { deep: true })

// 切换图表类型
const selectChartType = (type: 'BAR' | 'LINE' | 'PIE' | 'SCATTER' | 'AREA') => {
  emit('change-chart-type', type)
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium mb-4">图表配置</h3>
    
    <!-- 图表类型选择 -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">图表类型</label>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="type in chartTypes" 
          :key="type.id"
          :class="[
            'px-3 py-1.5 rounded text-sm flex items-center', 
            chartType === type.id 
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          ]"
          @click="selectChartType(type.id as 'BAR' | 'LINE' | 'PIE' | 'SCATTER' | 'AREA')"
        >
          <i :class="['fas', 'fa-' + type.icon, 'mr-1.5']"></i>
          {{ type.label }}
        </button>
      </div>
    </div>
    
    <!-- 数据映射 -->
    <div class="space-y-4">
      <!-- X轴 -->
      <div>
        <label class="block text-sm font-medium mb-1">X轴 / 类别</label>
        <select 
          v-model="localConfig.xAxis"
          class="w-full p-2 border rounded text-sm"
        >
          <option value="">选择字段</option>
          <option 
            v-for="column in categoricalColumns" 
            :key="column"
            :value="column"
          >
            {{ column }}
          </option>
        </select>
      </div>
      
      <!-- Y轴 -->
      <div>
        <label class="block text-sm font-medium mb-1">Y轴 / 数值</label>
        <select 
          v-model="localConfig.yAxis"
          class="w-full p-2 border rounded text-sm"
        >
          <option value="">选择字段</option>
          <option 
            v-for="column in numericColumns" 
            :key="column"
            :value="column"
          >
            {{ column }}
          </option>
        </select>
      </div>
      
      <!-- 系列 -->
      <div>
        <label class="block text-sm font-medium mb-1">系列（可选）</label>
        <select 
          v-model="localConfig.series"
          class="w-full p-2 border rounded text-sm"
        >
          <option value="">无</option>
          <option 
            v-for="column in categoricalColumns" 
            :key="column"
            :value="column"
          >
            {{ column }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- 外观设置 -->
    <div class="mt-4">
      <h4 class="text-sm font-medium mb-2">外观设置</h4>
      
      <!-- 显示图例 -->
      <div class="flex items-center mb-2">
        <input 
          type="checkbox" 
          id="showLegend" 
          v-model="localConfig.showLegend"
          class="mr-2"
        />
        <label for="showLegend" class="text-sm">显示图例</label>
      </div>
      
      <!-- 颜色方案 -->
      <div>
        <label class="block text-sm font-medium mb-1">颜色方案</label>
        <select 
          v-model="localConfig.colorScheme"
          class="w-full p-2 border rounded text-sm"
        >
          <option 
            v-for="scheme in colorSchemes" 
            :key="scheme.id"
            :value="scheme.id"
          >
            {{ scheme.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>