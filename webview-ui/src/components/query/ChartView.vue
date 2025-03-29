<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts'
import { 
  TooltipComponent, 
  GridComponent, 
  LegendComponent, 
  TitleComponent,
  ToolboxComponent 
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { ColumnType } from '@/types/query'

// 注册必要的组件
echarts.use([
  BarChart, LineChart, PieChart, ScatterChart,
  TooltipComponent, GridComponent, LegendComponent, TitleComponent, 
  ToolboxComponent, CanvasRenderer
])

const props = defineProps({
  chartType: {
    type: String as () => 'BAR' | 'LINE' | 'PIE' | 'SCATTER' | 'AREA',
    required: true
  },
  config: {
    type: Object,
    required: true
  },
  data: {
    type: Array as () => Record<string, any>[],
    required: true
  },
  columns: {
    type: Array as () => string[],
    required: true
  },
  columnTypes: {
    type: Array as () => ColumnType[],
    default: () => []
  }
})

const chartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 生成图表配置
const generateChartOptions = () => {
  const { xAxis, yAxis, series, showLegend, colorScheme } = props.config
  
  if (!xAxis || !yAxis) {
    return {
      title: {
        text: '请配置图表轴',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#999',
          fontSize: 16
        }
      }
    }
  }
  
  // 准备数据
  const xAxisData: any[] = []
  const seriesData: Record<string, Record<string, number>> = {}
  
  // 根据是否有系列字段，处理数据不同
  if (series) {
    // 有系列字段，准备多系列数据
    props.data.forEach(row => {
      const xValue = row[xAxis]
      const yValue = parseFloat(row[yAxis])
      const seriesValue = String(row[series])
      
      if (!xAxisData.includes(xValue)) {
        xAxisData.push(xValue)
      }
      
      if (!seriesData[seriesValue]) {
        seriesData[seriesValue] = {}
      }
      
      seriesData[seriesValue][xValue] = yValue
    })
  } else {
    // 无系列字段，准备单系列数据
    props.data.forEach(row => {
      const xValue = row[xAxis]
      const yValue = parseFloat(row[yAxis])
      
      if (!xAxisData.includes(xValue)) {
        xAxisData.push(xValue)
      }
      
      if (!seriesData[yAxis]) {
        seriesData[yAxis] = {}
      }
      
      seriesData[yAxis][xValue] = yValue
    })
  }
  
  // 准备ECharts系列数据
  const echartsSeriesData: any[] = []
  
  // 颜色方案
  const colorSchemes: Record<string, string[]> = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
    warm: ['#f97316', '#ea580c', '#c2410c', '#ef4444', '#dc2626', '#fbbf24', '#f59e0b', '#d97706'],
    cool: ['#06b6d4', '#0891b2', '#0e7490', '#0284c7', '#0369a1', '#8b5cf6', '#7c3aed', '#6d28d9'],
    monochrome: ['#020617', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0']
  }
  
  const colors = colorSchemes[colorScheme as keyof typeof colorSchemes] || colorSchemes.default
  
  // 根据图表类型生成不同的配置
  if (props.chartType === 'PIE') {
    // 准备饼图数据
    const pieData = Object.entries(seriesData[yAxis] || {}).map(([name, value]) => ({
      name,
      value: Object.values(value)[0]
    }))
    
    echartsSeriesData.push({
      type: 'pie',
      radius: '60%',
      data: pieData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    })
    
    return {
      title: {
        text: '',
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        show: showLegend,
        orient: 'horizontal',
        bottom: '5%',
        data: xAxisData
      },
      color: colors,
      series: echartsSeriesData
    }
  } else {
    // 为柱状图、折线图、散点图等准备数据
    Object.entries(seriesData).forEach(([seriesName, values]: [string, any]) => {
      const seriesValues = xAxisData.map(x => values[x] || 0)
      
      echartsSeriesData.push({
        name: seriesName,
        type: props.chartType.toLowerCase(),
        data: seriesValues,
        areaStyle: props.chartType === 'AREA' ? {} : undefined
      })
    })
    
    return {
      title: {
        text: '',
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        show: showLegend,
        data: Object.keys(seriesData),
        bottom: '5%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        type: 'value'
      },
      color: colors,
      series: echartsSeriesData
    }
  }
}

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return
  
  // 如果已存在实例，销毁它
  if (chartInstance) {
    chartInstance.dispose()
  }
  
  // 创建新实例
  chartInstance = echarts.init(chartContainer.value)
  
  // 生成并设置配置
  const options = generateChartOptions()
  chartInstance.setOption(options)
  
  // 监听窗口大小变化
  const handleResize = () => {
    chartInstance?.resize()
  }
  
  window.addEventListener('resize', handleResize)
  
  // 清理事件监听
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return
  
  const options = generateChartOptions()
  chartInstance.setOption(options)
}

// 导出图表为图片 (可以由父组件调用)
const exportToImage = () => {
  if (!chartInstance) return
  
  const url = chartInstance.getDataURL({
    pixelRatio: 2,
    backgroundColor: '#fff'
  })
  
  const link = document.createElement('a')
  link.download = `chart-${new Date().getTime()}.png`
  link.href = url
  link.click()
}

// 导出定义给父组件使用
defineExpose({
  exportToImage
})

// 监听属性变化，更新图表
watch(() => [props.chartType, props.config, props.data], () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })

// 组件挂载时初始化图表
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

// 组件卸载时销毁图表实例
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<template>
  <div ref="chartContainer" class="w-full h-[400px]"></div>
</template>