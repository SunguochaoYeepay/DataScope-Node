<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIntegrationStore } from '@/stores/integration';
import { useMessageStore } from '@/stores/message';
import { storeToRefs } from 'pinia';
import type { Integration, FormConfig, TableConfig, FormCondition, ChartConfig, ChartType } from '@/types/integration';
import { ColumnAlign, ColumnDisplayType } from '@/types/integration';
import { formatDate } from '@/utils/formatter';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  ExclamationCircleOutlined, 
  LoadingOutlined 
} from '@ant-design/icons-vue';

// 导入预览组件
import QueryForm from '@/components/integration/preview/QueryForm.vue';
import TableView from '@/components/integration/preview/TableView.vue';
import ChartView from '@/components/integration/preview/ChartView.vue';

// 路由相关
const route = useRoute();
const router = useRouter();
const integrationId = computed(() => route.params.id as string);

// Store
const integrationStore = useIntegrationStore();
const messageStore = useMessageStore();
const { loading } = storeToRefs(integrationStore);

// 状态
const integration = ref<Integration | null>(null);
const formValues = ref<Record<string, any>>({});
const tableData = ref<any[]>([]);
const tableLoading = ref(false);
const chartData = ref<any[]>([]);
const chartLoading = ref(false);

// 需要显示查询条件的集成类型
const shouldShowQuery = computed(() => {
  return integration.value?.type === 'TABLE'; // 只有复杂表格需要查询条件
});

// 计算查询条件列表
const queryConditions = computed(() => {
  if (!integration.value || !integration.value.queryParams) {
    return [];
  }
  
  return integration.value.queryParams
    .filter(param => param.description && param.description.trim() !== '')
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
});

// 计算表格列
const tableColumns = computed(() => {
  if (!integration.value || 
      (integration.value.type !== 'SIMPLE_TABLE' && integration.value.type !== 'TABLE') || 
      !integration.value.tableConfig) {
    return [];
  }
  
  return integration.value.tableConfig.columns
    .filter(column => column.visible)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
});

// 表格操作按钮
const tableActions = computed(() => {
  if (!integration.value || 
      (integration.value.type !== 'SIMPLE_TABLE' && integration.value.type !== 'TABLE') || 
      !integration.value.tableConfig) {
    return [];
  }
  
  return integration.value.tableConfig.actions || [];
});

// 表格分页配置
const tablePagination = computed(() => {
  if (!integration.value || 
      (integration.value.type !== 'SIMPLE_TABLE' && integration.value.type !== 'TABLE') || 
      !integration.value.tableConfig) {
    return {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100]
    };
  }
  
  return integration.value.tableConfig.pagination;
});

// 表格导出配置
const tableExport = computed(() => {
  if (!integration.value || 
      (integration.value.type !== 'SIMPLE_TABLE' && integration.value.type !== 'TABLE') || 
      !integration.value.tableConfig) {
    return {
      enabled: true,
      formats: ['CSV', 'EXCEL'],
      maxRows: 1000
    };
  }
  
  return integration.value.tableConfig.export;
});

// 图表配置
const chartConfig = computed(() => {
  if (!integration.value || integration.value.type !== 'CHART' || !integration.value.chartConfig) {
    return null;
  }
  
  return integration.value.chartConfig;
});

// 生命周期钩子
onMounted(async () => {
  if (integrationId.value) {
    await loadIntegration();
  }
  
  // 添加全局resize事件监听器，用于处理图表和表格的尺寸变化
  window.addEventListener('resize', handleGlobalResize);
});

// 在组件销毁时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleGlobalResize);
});

// 全局resize事件处理
const handleGlobalResize = () => {
  console.log('窗口尺寸变化，触发容器重新计算');
  // 此处可以添加其他需要处理的resize逻辑
};

// 用于模拟API延迟的函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 加载集成
const loadIntegration = async () => {
  try {
    loading.value = true;
    
    if (!route.params.id) {
      messageStore.error('缺少集成ID');
      return;
    }
    
    // 从服务端获取集成数据
    try {
      const result = await integrationStore.fetchIntegrationById(integrationId.value);
    
    if (result) {
        // 获取类型参数(优先顺序: URL路径参数 > URL查询参数 > 服务端返回的类型)
        // 1. 检查URL路径参数，如 /preview/id/CHART
        const pathTypeParam = Array.isArray(route.params.type) 
          ? route.params.type[0] 
          : route.params.type as string;
          
        // 2. 检查URL查询参数，如 /preview/id?type=CHART
        const queryTypeParam = Array.isArray(route.query.type) 
          ? route.query.type[0] 
          : route.query.type as string;
          
        // 选择有效的类型参数
        const urlTypeParam = pathTypeParam || queryTypeParam;
        
        // 创建集成数据副本
        integration.value = { ...result };
        
        // 如果URL中有指定类型，则优先使用URL中的类型
        if (urlTypeParam && ['CHART', 'TABLE', 'SIMPLE_TABLE'].includes(urlTypeParam)) {
          console.log(`[DEBUG] 从URL获取集成类型: ${urlTypeParam}, 覆盖服务端返回的类型: ${result.type}`);
          integration.value.type = urlTypeParam as 'CHART' | 'TABLE' | 'SIMPLE_TABLE';
        }
        
        // 日志输出实际使用的类型
        console.log(`[DEBUG] 最终使用的集成类型: ${integration.value.type}`);
        
        // 初始化表单值
        if (integration.value.queryParams) {
          initFormValues(integration.value.queryParams);
        }
        
        // 根据集成类型决定加载何种数据
        if (integration.value.type === 'CHART') {
          console.log('[DEBUG] 检测到图表类型集成，加载图表数据');
          loadChartData();
        } else {
          console.log(`[DEBUG] 检测到表格类型集成 (${integration.value.type})，加载表格数据`);
          loadTableData();
        }
      }
    } catch (error) {
      console.error('从服务端获取集成数据失败:', error);
      
      // 获取类型参数(优先顺序: URL路径参数 > URL查询参数 > 默认表格类型)
      // 1. 检查URL路径参数，如 /preview/id/CHART
      const pathTypeParam = Array.isArray(route.params.type) 
        ? route.params.type[0] 
        : route.params.type as string;
        
      // 2. 检查URL查询参数，如 /preview/id?type=CHART
      const queryTypeParam = Array.isArray(route.query.type) 
        ? route.query.type[0] 
        : route.query.type as string;
        
      // 选择有效的类型参数
      const typeParam = pathTypeParam || queryTypeParam || 'TABLE';
      
      const validType = ['CHART', 'TABLE', 'SIMPLE_TABLE'].includes(typeParam) 
        ? typeParam as 'CHART' | 'TABLE' | 'SIMPLE_TABLE'
        : 'TABLE';
      
      console.log(`[DEBUG] 使用模拟数据，类型: ${validType}`);
        
      // 模拟集成数据
      integration.value = {
        id: route.params.id as string,
        name: '示例集成',
        description: '这是一个示例集成',
        type: validType, // 使用处理后的类型参数
        status: 'ACTIVE',
        queryId: 'query-001', // 查询ID
        integrationPoint: {
          id: 'ip-001',
          name: '示例集成点',
          type: 'URL',
          urlConfig: {
            url: '/api/data',
            method: 'GET',
            headers: {}
          }
        },
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        queryParams: [
          { name: 'startDate', type: 'DATE', format: 'date', formType: 'date', required: true, displayOrder: 1, description: '开始日期' },
          { name: 'endDate', type: 'DATE', format: 'date', formType: 'date', required: true, displayOrder: 2, description: '结束日期' },
          { name: 'product', type: 'STRING', format: 'enum', formType: 'select', required: false, displayOrder: 3, description: '产品', options: [
            { label: '产品A', value: '产品A' },
            { label: '产品B', value: '产品B' },
            { label: '产品C', value: '产品C' }
          ]},
          { name: 'quantity', type: 'NUMBER', format: 'integer', formType: 'number', required: false, displayOrder: 4, description: '数量' },
          { name: 'remark', type: 'STRING', format: 'string', formType: 'textarea', required: false, displayOrder: 5, description: '备注' },
        ],
        // 添加表格配置
        tableConfig: {
          columns: [
            { field: 'date', label: '日期', type: 'date', visible: true, sortable: true, displayOrder: 1, align: ColumnAlign.LEFT, displayType: ColumnDisplayType.DATE },
            { field: 'product', label: '产品', type: 'string', visible: true, sortable: true, displayOrder: 2, align: ColumnAlign.LEFT, displayType: ColumnDisplayType.TEXT },
            { field: 'quantity', label: '数量', type: 'number', visible: true, sortable: true, displayOrder: 3, align: ColumnAlign.RIGHT, displayType: ColumnDisplayType.NUMBER },
            { field: 'amount', label: '金额', type: 'currency', visible: true, sortable: true, displayOrder: 4, align: ColumnAlign.RIGHT, displayType: ColumnDisplayType.TEXT },
            { field: 'status', label: '状态', type: 'enum', visible: true, sortable: true, displayOrder: 5, align: ColumnAlign.CENTER, displayType: ColumnDisplayType.TAG },
          ],
          actions: [
            { type: 'link', label: '查看', handler: 'viewRecord', icon: 'eye', style: 'primary' },
            { type: 'link', label: '编辑', handler: 'editRecord', icon: 'edit', style: 'secondary' },
            { type: 'link', label: '删除', handler: 'deleteRecord', icon: 'trash', style: 'danger', confirm: true, confirmMessage: '确定要删除此记录吗？' },
          ],
          pagination: {
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [10, 20, 50, 100]
          },
          export: {
            enabled: true,
            formats: ['CSV', 'EXCEL'],
            maxRows: 1000
          },
          batchActions: [], // 批量操作
          aggregation: {   // 聚合配置
            enabled: false,
            groupByFields: [],
            aggregationFunctions: []
          },
          advancedFilters: { // 高级筛选
            enabled: false,
            defaultFilters: [],
            savedFilters: []
          }
        },
        // 图表配置（仅在CHART类型时使用）
        chartConfig: {
          type: 'bar' as ChartType, // 可以是 'bar', 'line', 'pie', 'scatter', 'area'
          title: '销售分析图表',
          description: '按月度显示销售数据',
          height: 400,
          animation: true,
          showLegend: true,
          dataMapping: {
            xField: 'category',
            yField: 'value',
            seriesField: 'series'
          },
          styleOptions: {
            colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
          }
        },
        // ... 其他属性
      };
      
      // 初始化表单值
      if (integration.value && integration.value.queryParams) {
        initFormValues(integration.value.queryParams);
      }
      
      // 根据集成类型决定加载何种数据
      if (integration.value && integration.value.type === 'CHART') {
        console.log('[DEBUG] 检测到图表类型集成，加载图表数据');
        loadChartData();
      } else if (integration.value) {
        console.log(`[DEBUG] 检测到表格类型集成 (${integration.value.type})，加载表格数据`);
        loadTableData();
      }
    }
  } catch (error) {
    console.error('加载集成数据失败:', error);
    messageStore.error('加载集成数据失败');
  } finally {
    loading.value = false;
  }
};

// 初始化表单值
const initFormValues = (params?: any[]) => {
  formValues.value = {};
  
  if (!params) return;
  
  params.forEach(param => {
    // 根据不同类型设置默认值
    let defaultValue = param.defaultValue || '';
    
    // 根据类型处理默认值
    if (param.formType === 'date' || param.type === 'DATE' || param.type === 'date') {
      // 如果默认值为空，且有设置当前日期为默认值的选项
      if (!defaultValue && param.useCurrentDate) {
        defaultValue = new Date().toISOString().split('T')[0];
      }
    } else if (param.formType === 'datetime' || param.type === 'DATETIME' || param.type === 'datetime') {
      // 处理日期时间类型
      if (!defaultValue && param.useCurrentDate) {
        defaultValue = new Date().toISOString().slice(0, 16);
      }
    } else if (param.formType === 'number' || param.type === 'NUMBER' || param.type === 'number') {
      // 数字类型默认值处理
      defaultValue = defaultValue === '' ? '' : Number(defaultValue);
    } else if (param.formType === 'checkbox' || param.formType === 'boolean' || 
               param.type === 'BOOLEAN' || param.type === 'boolean') {
      // 布尔类型转换
      defaultValue = defaultValue === true || defaultValue === 'true';
    }
    
    formValues.value[param.name] = defaultValue;
  });
};

// 加载表格数据
const loadTableData = () => {
  if (!integration.value || 
      (integration.value.type !== 'SIMPLE_TABLE' && integration.value.type !== 'TABLE') || 
      !integration.value.tableConfig) {
    return;
  }
  
  tableLoading.value = true;
  
  // 模拟数据加载，实际应该是从API获取
  setTimeout(() => {
    // 生成模拟数据
    tableData.value = Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      date: formatDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
      product: ['笔记本电脑', '智能手机', '平板电脑', '智能手表', '无线耳机'][Math.floor(Math.random() * 5)],
      quantity: Math.floor(Math.random() * 100) + 1,
      amount: (Math.random() * 10000 + 500).toFixed(2),
      status: ['已完成', '进行中', '已取消'][Math.floor(Math.random() * 3)]
    }));
    
    tableLoading.value = false;
    console.log('表格数据加载完成:', tableData.value.length, '条记录');
  }, 1000);
};

// 提交查询，用于替代之前的handleSubmit
const submitQuery = () => {
  if (integration.value && (integration.value.type === 'TABLE' || integration.value.type === 'SIMPLE_TABLE')) {
    tableLoading.value = true;
    console.log('提交查询:', formValues.value);
    
    // 模拟API调用获取表格数据
    setTimeout(() => {
      // 生成一些模拟数据
      const mockData = Array.from({ length: 100 }, (_, i) => ({
        id: `${i + 1}`,
        date: formatDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
        product: ['产品A', '产品B', '产品C'][Math.floor(Math.random() * 3)],
        quantity: Math.floor(Math.random() * 100) + 1,
        amount: (Math.random() * 1000 + 100).toFixed(2),
        status: ['已完成', '进行中', '已取消'][Math.floor(Math.random() * 3)]
      }));
      
      tableData.value = mockData;
      
      // 不要直接修改计算属性
      const currentPagination = tablePagination.value;
      if (typeof currentPagination === 'object' && currentPagination !== null) {
        console.log('更新分页信息:', mockData.length, '条记录');
      }
      
      tableLoading.value = false;
      console.log('查询结果:', tableData.value);
    }, 1000);
  }
};

// 生成图表数据
const loadChartData = async () => {
  try {
    chartLoading.value = true;
    console.log('正在加载图表数据...');
    
    // 在实际场景中，这里应该调用API获取实际数据
    await sleep(1000); // 模拟网络延迟
    
    if (!integration.value || !integration.value.chartConfig) {
      console.warn('集成或图表配置为空，无法加载图表数据');
      chartLoading.value = false;
      return;
    }
    
    const chartType = integration.value.chartConfig.type || 'bar';
    const dataSize = 10; // 数据点数量
    console.log('图表类型:', chartType);
    
    // 生成符合图表需要的数据
    if (chartType === 'pie') {
      // 饼图数据
      chartData.value = Array.from({ length: 5 }, (_, i) => ({
        category: `分类${i + 1}`,
        value: Math.floor(Math.random() * 1000)
      }));
      
      // 确保配置正确
      if (integration.value.chartConfig) {
        integration.value.chartConfig.dataMapping = {
          ...integration.value.chartConfig.dataMapping,
          categoryField: 'category',
          valueField: 'value'
        };
      }
    } else if (chartType === 'scatter') {
      // 散点图数据
      chartData.value = Array.from({ length: dataSize }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 5,
        series: `系列${Math.floor(Math.random() * 3) + 1}`
      }));
      
      // 确保配置正确
      if (integration.value.chartConfig) {
        integration.value.chartConfig.dataMapping = {
          ...integration.value.chartConfig.dataMapping,
          xField: 'x',
          yField: 'y',
          sizeField: 'size',
          seriesField: 'series'
        };
      }
      } else {
      // 柱状图、线图、面积图等类目图表
      const categories = ['一月', '二月', '三月', '四月', '五月', '六月'];
      const series = ['系列A', '系列B', '系列C'];
      
      chartData.value = [];
      categories.forEach(category => {
        series.forEach(series => {
          chartData.value.push({
            category,
            series,
            value: Math.floor(Math.random() * 1000)
          });
        });
      });
      
      // 确保配置正确
      if (integration.value.chartConfig) {
        integration.value.chartConfig.dataMapping = {
          ...integration.value.chartConfig.dataMapping,
          xField: 'category',
          yField: 'value',
          seriesField: 'series'
        };
      }
    }
    
    console.log('生成的图表数据:', chartData.value);
    console.log('图表配置:', integration.value.chartConfig);
    
    // 手动触发图表重绘
    nextTick(() => {
      // 此延迟确保数据已更新且组件已重新渲染
    setTimeout(() => {
        // 可以通过添加一个刷新事件来触发图表重绘
        window.dispatchEvent(new Event('resize'));
      }, 200);
    });
  } catch (error) {
    console.error('加载图表数据失败:', error);
    messageStore.error('加载图表数据失败');
  } finally {
    chartLoading.value = false;
  }
};

// 重置查询条件
const resetQuery = () => {
  if (integration.value?.queryParams) {
    initFormValues(integration.value.queryParams);
  }
};

// 处理表格操作
const handleTableAction = (action: any, row: any) => {
  console.log('表格操作:', action, row);
  messageStore.info(`执行操作: ${action.label}`);
};

// 处理表格导出
const handleTableExport = (format: string) => {
  messageStore.info(`导出表格为 ${format} 格式`);
};

// 返回编辑页面
const goToEdit = () => {
  if (!integration.value) return;
  router.push(`/integration/edit/${integration.value.id}`);
};

// 返回列表页面
const goToList = () => {
  router.push('/integration');
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 页面头部 -->
    <a-page-header
      class="mb-6 px-0"
      title="预览集成"
      :back-icon="false"
    >
      <template #extra>
        <a-space>
          <a-button @click="goToList">
            <template #icon><ArrowLeftOutlined /></template>
            返回列表
          </a-button>
          <a-button type="primary" @click="goToEdit">
            <template #icon><EditOutlined /></template>
            编辑集成
          </a-button>
        </a-space>
      </template>
    </a-page-header>
    
    <!-- 加载中 -->
    <a-card v-if="loading" class="text-center">
      <a-spin size="large" tip="正在加载集成数据...">
        <div class="py-10"></div>
      </a-spin>
    </a-card>
    
    <!-- 集成内容 -->
    <div v-else-if="integration" class="space-y-6">
      <!-- 集成信息头部 -->
      <a-card>
        <template #title>
        <div class="flex items-center">
            <span class="flex-1">{{ integration.name }}</span>
            <a-tag 
              :color="integration.status === 'ACTIVE' ? 'success' : 
                    integration.status === 'INACTIVE' ? 'default' : 'warning'"
          >
            {{ integration.status === 'ACTIVE' ? '已激活' : 
               integration.status === 'INACTIVE' ? '已停用' : '草稿' }}
            </a-tag>
        </div>
        </template>
        <p v-if="integration.description" class="text-gray-500">
          {{ integration.description }}
        </p>
      </a-card>
      
      <!-- 查询条件表单 - 只有复杂表格才显示 -->
      <QueryForm 
        v-if="shouldShowQuery && queryConditions.length > 0"
        :conditions="queryConditions"
        v-model="formValues"
        :loading="tableLoading"
        @submit="submitQuery"
        @reset="resetQuery"
      />
      
      <!-- 表格视图 - 对于SIMPLE_TABLE和TABLE类型 -->
      <TableView
        v-if="integration.type === 'SIMPLE_TABLE' || integration.type === 'TABLE'"
        :data="tableData"
        :columns="tableColumns"
        :actions="tableActions"
        :pagination="tablePagination"
        :export-config="tableExport"
        :loading="tableLoading"
        @action="handleTableAction"
        @export="handleTableExport"
      />
      
      <!-- 图表视图 - 对于CHART类型 -->
      <ChartView
        v-else-if="integration.type === 'CHART' && chartConfig"
        :data="chartData"
        :config="chartConfig"
        :loading="chartLoading"
      />
      
      <!-- 未知类型集成 -->
      <a-result
        v-else
        status="warning"
        title="未知集成类型"
        :sub-title="`该集成类型 (${integration.type}) 暂不支持预览`"
      />
                </div>
                
    <!-- 集成不存在 -->
    <a-result
                  v-else
      status="warning"
      title="集成不存在"
      sub-title="找不到指定的集成，或集成数据加载失败"
    >
      <template #extra>
        <a-button @click="goToList">
          <template #icon><ArrowLeftOutlined /></template>
          返回集成列表
        </a-button>
                </template>
    </a-result>
  </div>
</template>