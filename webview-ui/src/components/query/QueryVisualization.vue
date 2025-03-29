<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQueryStore } from '@/stores/query'
import type { QueryResult, ChartConfig, ChartType } from '@/types/query'
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts'
import { 
  GridComponent, 
  TooltipComponent, 
  LegendComponent, 
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent 
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import * as echarts from 'echarts/core'

// 注册必要的ECharts组件
echarts.use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent
])

// 定义组件属性
const props = defineProps<{
  queryId: string
  queryResult: QueryResult | null
  isLoading: boolean
}>()

const queryStore = useQueryStore()

// 图表配置状态
const chartConfig = ref<ChartConfig>({
  chartType: 'bar',
  title: '',
  xAxis: '',
  yAxis: '',
  groupBy: '',
  aggregateFunction: 'sum',
  colorField: '',
  enableDataZoom: true,
  showLegend: true
})

// 图表状态
const chartInstance = ref<echarts.ECharts | null>(null)
const chartContainer = ref<HTMLElement | null>(null)
const chartLoading = ref(false)
const chartError = ref<string | null>(null)
const saveLoading = ref(false)
const saveSuccess = ref(false)

// 可用字段（来自查询结果）
const availableColumns = computed(() => {
  if (!props.queryResult || !props.queryResult.columns) return []
  return props.queryResult.columns
})

// 可用的聚合函数
const aggregateFunctions = [
  { value: 'sum', label: '求和' },
  { value: 'avg', label: '平均值' },
  { value: 'count', label: '计数' },
  { value: 'max', label: '最大值' },
  { value: 'min', label: '最小值' }
]

// 可用的图表类型
const chartTypes: { value: ChartType; label: string; icon: string }[] = [
  { value: 'bar', label: '柱状图', icon: 'chart-bar' },
  { value: 'line', label: '折线图', icon: 'chart-line' },
  { value: 'pie', label: '饼图', icon: 'chart-pie' },
  { value: 'scatter', label: '散点图', icon: 'braille' }
]

// 根据当前配置生成图表选项
const chartOptions = computed(() => {
  if (!props.queryResult || !props.queryResult.rows || !chartConfig.value.xAxis) {
    return null
  }

  const { chartType, title, xAxis, yAxis, groupBy, aggregateFunction, colorField, showLegend, enableDataZoom } = chartConfig.value
  const rows = props.queryResult.rows

  // 基础配置
  const baseOptions: any = {
    title: {
      text: title || '查询结果可视化',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: showLegend,
      orient: 'horizontal',
      bottom: 10
    },
    toolbox: {
      feature: {
        saveAsImage: { title: '保存为图片' }
      }
    }
  }

  // 根据图表类型和配置生成具体选项
  try {
    switch (chartType) {
      case 'bar': {
        // 柱状图
        const categoryData = Array.from(new Set(rows.map(row => String(row[xAxis]))))
        let seriesData = []
        
        if (groupBy) {
          // 分组柱状图
          const groupValues = Array.from(new Set(rows.map(row => String(row[groupBy]))))
          seriesData = groupValues.map(group => {
            const filteredRows = rows.filter(row => String(row[groupBy]) === group)
            const data = categoryData.map(category => {
              const categoryRows = filteredRows.filter(row => String(row[xAxis]) === category)
              if (categoryRows.length === 0) return 0
              
              // 应用聚合函数
              switch (aggregateFunction) {
                case 'sum':
                  return categoryRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0)
                case 'avg':
                  return categoryRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0) / categoryRows.length
                case 'count':
                  return categoryRows.length
                case 'max':
                  return Math.max(...categoryRows.map(row => Number(row[yAxis]) || 0))
                case 'min':
                  return Math.min(...categoryRows.map(row => Number(row[yAxis]) || 0))
                default:
                  return 0
              }
            })
            
            return {
              name: group,
              type: 'bar',
              data
            }
          })
        } else {
          // 简单柱状图
          const data = categoryData.map(category => {
            const categoryRows = rows.filter(row => String(row[xAxis]) === category)
            
            // 应用聚合函数
            switch (aggregateFunction) {
              case 'sum':
                return categoryRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0)
              case 'avg':
                return categoryRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0) / categoryRows.length
              case 'count':
                return categoryRows.length
              case 'max':
                return Math.max(...categoryRows.map(row => Number(row[yAxis]) || 0))
              case 'min':
                return Math.min(...categoryRows.map(row => Number(row[yAxis]) || 0))
              default:
                return 0
            }
          })
          
          seriesData = [{
            name: yAxis,
            type: 'bar',
            data
          }]
        }
        
        return {
          ...baseOptions,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: categoryData,
            axisLabel: {
              rotate: categoryData.length > 10 ? 45 : 0
            }
          },
          yAxis: {
            type: 'value'
          },
          dataZoom: enableDataZoom ? [
            {
              type: 'slider',
              show: categoryData.length > 10,
              start: 0,
              end: categoryData.length > 10 ? 50 : 100
            }
          ] : [],
          series: seriesData
        }
      }
      
      case 'line': {
        // 折线图
        const categoryData = Array.from(new Set(rows.map(row => String(row[xAxis]))))
        let seriesData = []
        
        if (groupBy) {
          // 分组折线图
          const groupValues = Array.from(new Set(rows.map(row => String(row[groupBy]))))
          seriesData = groupValues.map(group => {
            const filteredRows = rows.filter(row => String(row[groupBy]) === group)
            const data = categoryData.map(category => {
              const categoryRows = filteredRows.filter(row => String(row[xAxis]) === category)
              if (categoryRows.length === 0) return 0
              
              // 应用聚合函数
              switch (aggregateFunction) {
                case 'sum':
                  return categoryRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0)
                case 'avg':
                  return categoryRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0) / categoryRows.length
                case 'count':
                  return categoryRows.length
                case 'max':
                  return Math.max(...categoryRows.map(row => Number(row[yAxis]) || 0))
                case 'min':
                  return Math.min(...categoryRows.map(row => Number(row[yAxis]) || 0))
                default:
                  return 0
              }
            })
            
            return {
              name: group,
              type: 'line',
              data,
              smooth: true
            }
          })
        } else {
          // 简单折线图
          const data = categoryData.map(category => {
            const categoryRows = rows.filter(row => String(row[xAxis]) === category)
            
            // 应用聚合函数
            switch (aggregateFunction) {
              case 'sum':
                return categoryRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0)
              case 'avg':
                return categoryRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0) / categoryRows.length
              case 'count':
                return categoryRows.length
              case 'max':
                return Math.max(...categoryRows.map(row => Number(row[yAxis]) || 0))
              case 'min':
                return Math.min(...categoryRows.map(row => Number(row[yAxis]) || 0))
              default:
                return 0
            }
          })
          
          seriesData = [{
            name: yAxis,
            type: 'line',
            data,
            smooth: true
          }]
        }
        
        return {
          ...baseOptions,
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: categoryData,
            axisLabel: {
              rotate: categoryData.length > 10 ? 45 : 0
            }
          },
          yAxis: {
            type: 'value'
          },
          dataZoom: enableDataZoom ? [
            {
              type: 'slider',
              show: categoryData.length > 10,
              start: 0,
              end: categoryData.length > 10 ? 50 : 100
            }
          ] : [],
          series: seriesData
        }
      }
      
      case 'pie': {
        // 饼图
        let data = []
        
        if (groupBy) {
          // 按分组聚合
          const groupValues = Array.from(new Set(rows.map(row => String(row[groupBy]))))
          data = groupValues.map(group => {
            const groupRows = rows.filter(row => String(row[groupBy]) === group)
            
            // 应用聚合函数
            let value
            switch (aggregateFunction) {
              case 'sum':
                value = groupRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0)
                break
              case 'avg':
                value = groupRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0) / groupRows.length
                break
              case 'count':
                value = groupRows.length
                break
              case 'max':
                value = Math.max(...groupRows.map(row => Number(row[yAxis]) || 0))
                break
              case 'min':
                value = Math.min(...groupRows.map(row => Number(row[yAxis]) || 0))
                break
              default:
                value = 0
            }
            
            return {
              name: group,
              value
            }
          })
        } else {
          // 按X轴分类
          const categoryData = Array.from(new Set(rows.map(row => String(row[xAxis]))))
          data = categoryData.map(category => {
            const categoryRows = rows.filter(row => String(row[xAxis]) === category)
            
            // 应用聚合函数
            let value
            switch (aggregateFunction) {
              case 'sum':
                value = categoryRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0)
                break
              case 'avg':
                value = categoryRows.reduce((sum, row) => sum + (Number(row[yAxis]) || 0), 0) / categoryRows.length
                break
              case 'count':
                value = categoryRows.length
                break
              case 'max':
                value = Math.max(...categoryRows.map(row => Number(row[yAxis]) || 0))
                break
              case 'min':
                value = Math.min(...categoryRows.map(row => Number(row[yAxis]) || 0))
                break
              default:
                value = 0
            }
            
            return {
              name: category,
              value
            }
          })
        }
        
        // 按值排序并过滤掉零值
        data = data.filter(item => item.value > 0).sort((a, b) => b.value - a.value)
        
        return {
          ...baseOptions,
          series: [
            {
              name: yAxis,
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                formatter: '{b}: {d}%'
              }
            }
          ]
        }
      }
      
      case 'scatter': {
        // 散点图
        let seriesData = []
        
        if (colorField) {
          // 按颜色字段分组
          const colorValues = Array.from(new Set(rows.map(row => String(row[colorField]))))
          seriesData = colorValues.map(colorValue => {
            const filteredRows = rows.filter(row => String(row[colorField]) === colorValue)
            return {
              name: colorValue,
              type: 'scatter',
              data: filteredRows.map(row => [row[xAxis], row[yAxis]])
            }
          })
        } else {
          // 简单散点图
          seriesData = [{
            name: yAxis,
            type: 'scatter',
            data: rows.map(row => [row[xAxis], row[yAxis]])
          }]
        }
        
        return {
          ...baseOptions,
          tooltip: {
            trigger: 'item',
            formatter: function (params: any) {
              return `${params.seriesName}<br />
                ${xAxis}: ${params.data[0]}<br />
                ${yAxis}: ${params.data[1]}`
            }
          },
          xAxis: {
            type: 'value',
            name: xAxis
          },
          yAxis: {
            type: 'value',
            name: yAxis
          },
          series: seriesData
        }
      }
      
      default:
        return null
    }
  } catch (error) {
    console.error('Error generating chart options:', error)
    chartError.value = '生成图表选项时出错，请检查数据和配置'
    return null
  }
})

// 初始化图表，添加延迟和调试日志
const initChart = () => {
  console.log('initChart called, container:', chartContainer.value)
  
  // 使用setTimeout确保DOM已经完全渲染
  setTimeout(() => {
    // 直接通过ID获取图表容器，避免ref可能的引用问题
    const container = document.getElementById('chartContainer');
    
    if (!container) {
      console.error('Chart container not found in DOM');
      chartError.value = '图表容器未找到，请刷新页面重试';
      return;
    }
    
    try {
      // 如果已有实例，先销毁
      if (chartInstance.value) {
        console.log('Disposing existing chart instance');
        chartInstance.value.dispose();
      }
      
      console.log('Creating new chart instance');
      // 创建新实例，使用获取到的DOM元素
      chartInstance.value = echarts.init(container);
      console.log('Chart instance created:', chartInstance.value);
      
      // 如果有可用选项，立即设置
      if (chartOptions.value) {
        console.log('Setting initial chart options');
        chartInstance.value.setOption(chartOptions.value);
      }
    } catch (error) {
      console.error('Error initializing chart:', error);
      chartError.value = '初始化图表失败，请刷新页面重试';
    }
    
    // 响应窗口大小变化
    window.addEventListener('resize', () => {
      if (chartInstance.value) {
        console.log('Resizing chart on window resize');
        chartInstance.value.resize();
      }
    });
  }, 300); // 延迟300ms确保DOM已渲染
};

// 更新图表，添加调试日志和延迟执行
const updateChart = () => {
  console.log('updateChart called');
  
  if (!chartOptions.value) {
    console.log('Chart update skipped: missing options');
    return;
  }
  
  // 延迟执行以确保DOM已更新
  setTimeout(() => {
    // 直接获取DOM元素
    const container = document.getElementById('chartContainer');
    
    if (!container) {
      console.error('Chart container not found during update');
      chartError.value = '图表容器未找到，请刷新页面重试';
      return;
    }
    
    // 如果实例不存在或已被销毁，重新创建
    if (!chartInstance.value) {
      console.log('Chart instance not found, creating new one');
      try {
        chartInstance.value = echarts.init(container);
      } catch (error) {
        console.error('Error creating chart instance during update:', error);
        chartError.value = '初始化图表失败，请刷新页面重试';
        return;
      }
    }
    
    try {
      chartError.value = null;
      
      console.log('Updating chart with options for type:', chartConfig.value.chartType);
      chartInstance.value.setOption(chartOptions.value, true);
      console.log('Chart updated successfully');
    } catch (error) {
      console.error('Error updating chart:', error);
      chartError.value = '更新图表时出错，请检查数据格式';
    }
  }, 200);
};

// 保存图表配置
const saveChartConfig = async () => {
  if (!props.queryId) {
    chartError.value = '无法保存配置：缺少查询ID'
    return
  }
  
  saveLoading.value = true
  saveSuccess.value = false
  
  try {
    await queryStore.saveQueryVisualization(props.queryId, chartConfig.value)
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Error saving chart config:', error)
    chartError.value = '保存配置失败'
  } finally {
    saveLoading.value = false
  }
}

// 加载保存的图表配置
const loadChartConfig = async () => {
  if (!props.queryId) return
  
  chartLoading.value = true
  chartError.value = null
  
  try {
    const config = await queryStore.getQueryVisualization(props.queryId)
    if (config) {
      chartConfig.value = config
    }
  } catch (error) {
    console.error('Error loading chart config:', error)
    chartError.value = '加载配置失败'
  } finally {
    chartLoading.value = false
  }
}

// 切换图表类型
const changeChartType = (type: ChartType) => {
  chartConfig.value.chartType = type
}

// 导出图表为图片
const exportImage = () => {
  if (!chartInstance.value) return
  
  const dataURL = chartInstance.value.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  })
  
  // 创建下载链接
  const link = document.createElement('a')
  link.download = `chart-${new Date().getTime()}.png`
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 图表容器挂载后初始化，确保容器元素存在
onMounted(() => {
  console.log('Component mounted')
  
  // 延迟初始化图表，确保DOM已完全渲染
  setTimeout(() => {
    console.log('DOM ready, checking chart container')
    
    // 直接获取DOM元素
    const container = document.getElementById('chartContainer')
    console.log('Chart container found by ID?', !!container)
    
    if (container) {
      console.log('Container size:', container.offsetWidth, 'x', container.offsetHeight)
      initChart()
      
      // 加载保存的配置
      if (props.queryId) {
        loadChartConfig()
      }
    } else {
      console.error('Chart container element not found after delay')
      chartError.value = '图表容器未找到，请刷新页面重试'
    }
  }, 500)
})

// 图表选项变化时更新图表
watch(chartOptions, (newOptions) => {
  if (newOptions) {
    updateChart()
  }
})

// 查询ID变化时加载配置
watch(() => props.queryId, (newId) => {
  if (newId) {
    loadChartConfig()
  }
})

// 监控组件可见性状态，当变为可见时重绘图表
watch(() => props.isLoading, (isLoading) => {
  if (!isLoading) {
    // 延迟执行以确保DOM已更新
    setTimeout(() => {
      const container = document.getElementById('chartContainer');
      
      if (container && chartInstance.value) {
        console.log('Resizing chart after loading complete');
        chartInstance.value.resize();
        updateChart();
      } else if (container && !chartInstance.value && chartOptions.value) {
        console.log('Reinitializing chart after loading complete');
        initChart();
      }
    }, 200);
  }
})
</script>

<template>
  <div class="h-full flex flex-col" style="min-height: 600px;">
    <!-- 图表配置面板 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div class="flex flex-wrap gap-4">
        <!-- 图表类型选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">图表类型</label>
          <div class="flex space-x-2">
            <button 
              v-for="type in chartTypes" 
              :key="type.value"
              @click="changeChartType(type.value)"
              :class="[
                'px-3 py-1 rounded-md text-sm flex items-center',
                chartConfig.chartType === type.value 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              ]"
            >
              <i :class="`fas fa-${type.icon} mr-1`"></i>
              {{ type.label }}
            </button>
          </div>
        </div>
        
        <!-- 标题 -->
        <div class="min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">图表标题</label>
          <input 
            type="text" 
            v-model="chartConfig.title" 
            placeholder="输入图表标题" 
            class="w-full px-3 py-1 border rounded-md text-sm"
          />
        </div>
        
        <!-- 选择轴和字段 -->
        <div class="min-w-[150px]">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">X轴 / 分类</label>
          <select 
            v-model="chartConfig.xAxis" 
            class="w-full px-3 py-1 border rounded-md text-sm"
          >
            <option value="">请选择字段</option>
            <option v-for="col in availableColumns" :key="col" :value="col">{{ col }}</option>
          </select>
        </div>
        
        <div class="min-w-[150px]">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Y轴 / 值</label>
          <select 
            v-model="chartConfig.yAxis" 
            class="w-full px-3 py-1 border rounded-md text-sm"
          >
            <option value="">请选择字段</option>
            <option v-for="col in availableColumns" :key="col" :value="col">{{ col }}</option>
          </select>
        </div>
        
        <div class="min-w-[150px]">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分组字段</label>
          <select 
            v-model="chartConfig.groupBy" 
            class="w-full px-3 py-1 border rounded-md text-sm"
          >
            <option value="">不分组</option>
            <option v-for="col in availableColumns" :key="col" :value="col">{{ col }}</option>
          </select>
        </div>
        
        <div class="min-w-[150px]" v-if="chartConfig.chartType === 'scatter'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">颜色字段</label>
          <select 
            v-model="chartConfig.colorField" 
            class="w-full px-3 py-1 border rounded-md text-sm"
          >
            <option value="">不使用</option>
            <option v-for="col in availableColumns" :key="col" :value="col">{{ col }}</option>
          </select>
        </div>
        
        <div class="min-w-[150px]">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">聚合函数</label>
          <select 
            v-model="chartConfig.aggregateFunction" 
            class="w-full px-3 py-1 border rounded-md text-sm"
          >
            <option v-for="func in aggregateFunctions" :key="func.value" :value="func.value">{{ func.label }}</option>
          </select>
        </div>
        
        <!-- 显示选项 -->
        <div class="flex items-end space-x-4">
          <div>
            <label class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="checkbox" v-model="chartConfig.showLegend" class="mr-2" />
              显示图例
            </label>
          </div>
          <div v-if="['bar', 'line'].includes(chartConfig.chartType)">
            <label class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="checkbox" v-model="chartConfig.enableDataZoom" class="mr-2" />
              启用缩放
            </label>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-end space-x-2 ml-auto">
          <button 
            @click="exportImage" 
            class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md flex items-center"
            :disabled="!chartInstance"
          >
            <i class="fas fa-download mr-1"></i>
            导出图片
          </button>
          <button 
            v-if="props.queryId" 
            @click="saveChartConfig" 
            class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-md flex items-center"
            :disabled="saveLoading"
          >
            <i class="fas fa-save mr-1"></i>
            {{ saveLoading ? '保存中...' : '保存配置' }}
          </button>
        </div>
      </div>
      
      <!-- 成功信息 -->
      <div v-if="saveSuccess" class="mt-2 text-sm text-green-600">
        <i class="fas fa-check-circle mr-1"></i>
        配置已保存
      </div>
      
      <!-- 错误信息 -->
      <div v-if="chartError" class="mt-2 text-sm text-red-600">
        <i class="fas fa-exclamation-circle mr-1"></i>
        {{ chartError }}
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="flex-grow relative" style="height: 400px;">
      <!-- 加载状态 -->
      <div v-if="props.isLoading || chartLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
        <div class="flex flex-col items-center">
          <svg class="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">加载中...</span>
        </div>
      </div>
      
      <!-- 选择字段提示 -->
      <div v-else-if="!chartConfig.xAxis || !chartConfig.yAxis" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-gray-500">
          <i class="fas fa-chart-line text-3xl mb-2"></i>
          <p>请在上方选择X轴和Y轴字段以生成图表</p>
        </div>
      </div>
      
      <!-- 图表容器 -->
      <div 
        ref="chartContainer" 
        id="chartContainer"
        class="w-full" 
        style="height: 500px; min-height: 400px; width: 100%;"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
  min-height: 0;
}
</style>

<style scoped>
.flex-grow {
  flex-grow: 1;
  min-height: 400px;
}

#chartContainer {
  height: 500px !important;
  width: 100% !important;
  display: block;
}
</style>