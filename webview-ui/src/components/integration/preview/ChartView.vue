<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import * as echarts from 'echarts';
import { 
  SyncOutlined, 
  SettingOutlined,
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue';
import type { ChartConfig, ChartDataMapping } from '@/types/integration';
import { ChartType } from '@/types/integration';
import { Empty } from 'ant-design-vue';

const props = defineProps<{
  config: ChartConfig;
  data?: any[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;
const isInitialized = ref(false);

// 当数据或配置变化时重新渲染图表
watch(() => [props.data, props.config], () => {
  nextTick(() => {
    if (props.data && props.data.length > 0 && !props.loading) {
      console.log('数据变化，重新渲染图表');
      
      if (!chart && chartRef.value) {
        console.log('图表实例不存在，初始化图表');
        initChart();
      } else {
        renderChart();
      }
    }
  });
}, { deep: true });

// 监听容器大小变化
watch(() => props.config.height, () => {
  nextTick(() => {
    if (chart) {
      console.log('图表高度变化，重新调整大小');
      chart.resize();
    }
  });
});

// 挂载时初始化图表
onMounted(() => {
  console.log('ChartView组件挂载');
  // 延迟初始化以确保DOM已完全渲染
  setTimeout(() => {
    initChart();
    // 注册resize事件
    window.addEventListener('resize', handleResize);
    // 注册一个MutationObserver监控DOM变化
    setupObserver();
  }, 100);
});

// 设置MutationObserver监控DOM变化
const setupObserver = () => {
  if (!chartRef.value) return;
  
  const observer = new MutationObserver((mutations) => {
    if (chart) chart.resize();
  });
  
  observer.observe(chartRef.value, {
    attributes: true,
    childList: true,
    subtree: true
  });
};

// 销毁时清理
onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener('resize', handleResize);
});

// 初始化图表
const initChart = () => {
  if (!chartRef.value) {
    console.warn('chartRef不存在，无法初始化图表');
    return;
  }
  
  try {
    // 检查容器是否有尺寸
    const { offsetWidth, offsetHeight } = chartRef.value;
    console.log('图表容器尺寸:', { width: offsetWidth, height: offsetHeight });
    
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('图表容器尺寸为0，延迟初始化');
      setTimeout(initChart, 200);
      return;
    }
    
    // 在初始化前先清理
    if (chart) {
      chart.dispose();
      chart = null;
    }
    
    console.log('初始化ECharts实例', chartRef.value);
    chart = echarts.init(chartRef.value);
    console.log('ECharts实例创建成功', chart);
    isInitialized.value = true;
    
    // 如果已有数据，立即渲染
    if (props.data && props.data.length > 0 && !props.loading) {
      console.log('初始化后立即渲染图表');
      renderChart();
    }
  } catch (error) {
    console.error('初始化ECharts实例失败:', error);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  if (chart) {
    console.log('窗口大小变化，重新调整图表大小');
    chart.resize();
  }
};

// 渲染图表
const renderChart = () => {
  if (!chart) {
    console.warn('chart实例不存在，尝试重新初始化');
    initChart();
    if (!chart) return;
  }
  
  if (!props.data || props.data.length === 0) {
    console.warn('没有数据可渲染');
    return;
  }
  
  // 提取chart配置
  const { type, dataMapping, styleOptions = {} } = props.config;
  console.log('renderChart - 图表数据:', props.data);
  console.log('renderChart - 图表配置:', props.config);
  
  // 基础选项
  let option: any = {
    title: {
      text: props.config.title || '图表',
      subtext: props.config.description,
      left: 'center'
    },
    tooltip: {
      trigger: type === 'pie' ? 'item' : 'axis'
    },
    legend: {
      show: props.config.showLegend !== false,
      bottom: '5%',
      orient: 'horizontal'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    animation: props.config.animation !== false,
    color: styleOptions.colors || [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
      '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
    ]
  };
  
  // 根据图表类型配置不同的选项
  if (type === 'bar') {
    configureCategoryChart(option, 'bar');
  } else if (type === 'line') {
    configureCategoryChart(option, 'line');
  } else if (type === 'pie') {
    configurePieChart(option);
  } else if (type === 'scatter') {
    configureScatterChart(option);
  } else if (type === 'area') {
    // 面积图是带有区域填充的线图
    configureCategoryChart(option, 'line', true);
  } else {
    console.warn(`不支持的图表类型: ${type}`);
    return;
  }
  
  console.log('渲染ECharts选项:', option);
  
  // 应用图表
  try {
    chart.clear();
    chart.setOption(option, true);
    console.log('图表渲染完成');
  } catch (error) {
    console.error('图表渲染失败:', error);
  }
};

// 配置类目图表(柱状图、线图等)
const configureCategoryChart = (option: any, chartType: string, isArea = false) => {
  const { xField, yField, seriesField } = props.config.dataMapping || {};
  
  if (!xField || !yField) {
    console.warn(`${chartType}图需要 xField 和 yField`);
    return;
  }
  
  // 设置X轴
  option.xAxis = {
    type: 'category',
    data: Array.from(new Set(props.data.map(item => item[xField]))),
    axisLabel: {
      rotate: 45,
      interval: 0
    }
  };
  
  // 设置Y轴
  option.yAxis = {
    type: 'value'
  };
  
  // 准备系列数据
  if (seriesField) {
    // 多系列图表
    const seriesValues = Array.from(new Set(props.data.map(item => item[seriesField])));
    const xAxisData = option.xAxis.data;
    
    option.series = seriesValues.map(seriesValue => {
      // 对于每个系列，创建完整数据
      const seriesData = xAxisData.map((xValue: any) => {
        const match = props.data.find(
          item => item[xField] === xValue && item[seriesField] === seriesValue
        );
        return match ? match[yField] : 0;
      });
      
      return {
        name: seriesValue,
        type: chartType,
        data: seriesData,
        ...(isArea ? { areaStyle: {} } : {})
      };
    });
  } else {
    // 单系列图表
    const seriesData = option.xAxis.data.map((xValue: any) => {
      const match = props.data.find(item => item[xField] === xValue);
      return match ? match[yField] : 0;
    });
    
    option.series = [{
      type: chartType,
      data: seriesData,
      ...(isArea ? { areaStyle: {} } : {})
    }];
  }
};

// 配置饼图
const configurePieChart = (option: any) => {
  const { valueField, categoryField } = props.config.dataMapping || {};
  
  if (!valueField || !categoryField) {
    console.warn('饼图需要 valueField 和 categoryField');
    return;
  }
  
  // 准备饼图数据
  const pieData = props.data.map(item => ({
    name: item[categoryField],
    value: item[valueField]
  }));
  
  option.series = [{
    type: 'pie',
    radius: '50%',
    data: pieData,
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }];
};

// 配置散点图
const configureScatterChart = (option: any) => {
  const { xField, yField, seriesField, sizeField } = props.config.dataMapping || {};
  
  if (!xField || !yField) {
    console.warn('散点图需要 xField 和 yField');
    return;
  }
  
  // 设置X轴和Y轴为数值类型
  option.xAxis = { type: 'value' };
  option.yAxis = { type: 'value' };
  
  // 准备系列数据
  if (seriesField) {
    // 多系列散点图
    const seriesValues = Array.from(new Set(props.data.map(item => item[seriesField])));
    
    option.series = seriesValues.map(seriesValue => {
      const filteredData = props.data.filter(item => item[seriesField] === seriesValue);
      const data = filteredData.map(item => {
        const point: any[] = [item[xField], item[yField]];
        if (sizeField) {
          point.push(item[sizeField]); // 添加大小维度
        }
        return point;
      });
      
      return {
        name: seriesValue,
        type: 'scatter',
        data
      };
    });
  } else {
    // 单系列散点图
    const data = props.data.map(item => {
      const point: any[] = [item[xField], item[yField]];
      if (sizeField) {
        point.push(item[sizeField]); // 添加大小维度
      }
      return point;
    });
    
    option.series = [{
      type: 'scatter',
      data
    }];
  }
};

// 图表类型对应的名称
const getChartTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'BAR': '柱状图',
    'LINE': '折线图',
    'PIE': '饼图',
    'SCATTER': '散点图',
    'HEATMAP': '热力图',
    'RADAR': '雷达图',
    'FUNNEL': '漏斗图',
  };
  return typeMap[type] || '图表';
};

// 刷新图表
const refreshChart = () => {
  // 添加刷新逻辑
  emit('refresh');
};
</script>

<template>
  <div class="chart-view-container">
    <div class="chart-header">
      <div class="title-section">
        <span class="chart-title">{{ config.title || '数据可视化' }}</span>
        <a-tag v-if="config.type" color="blue" class="chart-type-tag">
          {{ getChartTypeName(config.type) }}
        </a-tag>
      </div>
      <div class="chart-actions">
        <a-button type="text" @click="refreshChart" class="action-btn">
          <template #icon><ReloadOutlined /></template>
        </a-button>
        <a-button type="text" class="action-btn">
          <template #icon><DownloadOutlined /></template>
        </a-button>
      </div>
    </div>

    <div v-if="loading" class="chart-loading">
      <a-spin />
    </div>
    <div v-else-if="!data || data.length === 0" class="chart-empty">
      <a-empty 
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
        description="暂无数据"
      >
        <template #description>
          <span class="text-gray-500">
            暂无图表数据，请调整查询条件后重试
          </span>
        </template>
      </a-empty>
    </div>
    <div v-else ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped>
.chart-view-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title-section {
  display: flex;
  align-items: center;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  margin-right: 8px;
}

.chart-type-tag {
  font-size: 12px;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 4px;
}

.action-btn:hover {
  background-color: #f0f0f0;
  color: #1890ff;
}

.chart-container {
  flex: 1;
  min-height: 300px;
}

.chart-loading, .chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>