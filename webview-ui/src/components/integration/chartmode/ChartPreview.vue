<template>
  <div class="chart-preview">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state" :style="{ height: `${height}px` }">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-state" :style="{ height: `${height}px` }">
      <el-alert
        :title="error"
        type="error"
        :closable="false"
        show-icon
      />
    </div>

    <!-- 空状态 -->
    <div v-else-if="isEmpty" class="empty-state" :style="{ height: `${height}px` }">
      <el-empty description="暂无数据" />
    </div>

    <!-- 图表 -->
    <div v-else class="chart-container" :style="{ height: `${height}px` }">
      <v-chart 
        :option="chartOption" 
        autoresize
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import VChart from 'vue-echarts';
import type { EChartsOption } from 'echarts';

// 组件 props
interface Props {
  loading?: boolean;
  data: any[];
  chartType: string;
  title?: string;
  description?: string;
  height?: number;
  showLegend?: boolean;
  animation?: boolean;
  xField?: string;
  yField?: string;
  valueField?: string;
  categoryField?: string;
  theme?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  data: () => [],
  title: '',
  description: '',
  height: 400,
  showLegend: true,
  animation: true,
  xField: '',
  yField: '',
  valueField: '',
  categoryField: '',
  theme: 'default'
});

// 状态变量
const error = ref<string | null>(null);
const isEmpty = computed(() => !props.data || props.data.length === 0);

// 检查字段是否存在于数据中
const checkFieldExists = (field: string): boolean => {
  return props.data.some(item => field in item);
};

// 图表配置
const chartOption = computed<EChartsOption>(() => {
  const option: EChartsOption = {
    title: {
      text: props.title,
      subtext: props.description,
      left: 'center'
    },
    tooltip: {
      trigger: props.chartType === 'pie' ? 'item' : 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      show: props.showLegend,
      bottom: '0%',
      left: 'center'
    },
    animation: props.animation,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: props.title ? '15%' : '8%',
      containLabel: true
    }
  };

  // 确保图表数据非空
  if (isEmpty.value) {
    return option;
  }

  // 根据图表类型生成不同的配置
  try {
    switch (props.chartType.toLowerCase()) {
      case 'bar':
      case 'line': {
        if (!props.xField || !checkFieldExists(props.xField)) {
          error.value = `X轴字段 "${props.xField}" 不存在于数据中`;
          console.error(error.value, '可用字段：', Object.keys(props.data[0]));
          return option;
        }
        
        if (!props.yField || !checkFieldExists(props.yField)) {
          error.value = `Y轴字段 "${props.yField}" 不存在于数据中`;
          console.error(error.value, '可用字段：', Object.keys(props.data[0]));
          return option;
        }

        option.xAxis = {
          type: 'category',
          data: props.data.map(item => item[props.xField] || 'N/A')
        };
        option.yAxis = {
          type: 'value'
        };
        option.series = [{
          name: props.yField,
          type: props.chartType.toLowerCase(),
          data: props.data.map(item => item[props.yField] || 0),
          ...(props.chartType.toLowerCase() === 'bar' ? {
            itemStyle: {
              borderRadius: 4
            }
          } : {
            smooth: true
          })
        }];
        break;
      }
      case 'pie': {
        if (!props.categoryField || !checkFieldExists(props.categoryField)) {
          error.value = `类别字段 "${props.categoryField}" 不存在于数据中`;
          console.error(error.value, '可用字段：', Object.keys(props.data[0]));
          return option;
        }
        
        if (!props.valueField || !checkFieldExists(props.valueField)) {
          error.value = `值字段 "${props.valueField}" 不存在于数据中`;
          console.error(error.value, '可用字段：', Object.keys(props.data[0]));
          return option;
        }

        option.series = [{
          name: props.valueField,
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          data: props.data.map(item => ({
            name: item[props.categoryField] || 'N/A',
            value: item[props.valueField] || 0
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }];
        break;
      }
      case 'scatter': {
        if (!props.xField || !checkFieldExists(props.xField)) {
          error.value = `X轴字段 "${props.xField}" 不存在于数据中`;
          console.error(error.value, '可用字段：', Object.keys(props.data[0]));
          return option;
        }
        
        if (!props.yField || !checkFieldExists(props.yField)) {
          error.value = `Y轴字段 "${props.yField}" 不存在于数据中`;
          console.error(error.value, '可用字段：', Object.keys(props.data[0]));
          return option;
        }

        option.xAxis = {
          type: 'value'
        };
        option.yAxis = {
          type: 'value'
        };
        option.series = [{
          name: 'scatter',
          type: 'scatter',
          data: props.data.map(item => [item[props.xField] || 0, item[props.yField] || 0]),
          symbolSize: function (data: any) {
            return Math.max(data[1] / 10, 5);
          },
        }];
        break;
      }
    }
  } catch (err) {
    console.error('生成图表配置失败:', err);
    error.value = err instanceof Error ? err.message : '生成图表配置失败';
  }

  return option;
});

// 监听数据变化，清除错误状态
watch(() => props.data, () => {
  error.value = null;
}, { deep: true });
</script>

<style scoped>
.chart-preview {
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.chart-container {
  width: 100%;
}
</style>