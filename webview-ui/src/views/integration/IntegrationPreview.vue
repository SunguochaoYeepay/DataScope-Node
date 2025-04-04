<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIntegrationStore } from '@/stores/integration';
import { useMessageStore } from '@/stores/message';
import { storeToRefs } from 'pinia';
import type { Integration, FormConfig, TableConfig, FormCondition, ChartConfig, ChartType, FormComponentType } from '@/types/integration';
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
const queryError = ref<string | null>(null);
const isLoading = ref(false);

// 页面标题和操作按钮
const pageTitle = computed(() => integration.value ? `预览: ${integration.value.name}` : '集成预览');
const actionItems = computed(() => [
  {
    icon: ArrowLeftOutlined,
    text: '返回列表',
    onClick: goBack
  },
  {
    icon: EditOutlined,
    text: '编辑集成',
    type: 'primary',
    onClick: goToEdit
  }
]);

// 集成类型
const integrationType = computed(() => integration.value?.type || '');

// 表格标题
const tableTitle = computed(() => '数据列表');

// 是否显示查询表单
const showQueryForm = computed(() => {
  return queryConditions.value.length > 0;
});

// 集成数据
const integrationData = computed(() => {
  if (!integration.value) return [];
  
  if (integrationType.value === 'TABLE' || integrationType.value === 'SIMPLE_TABLE') {
    return tableData.value;
  } else if (integrationType.value === 'CHART') {
    return chartData.value;
  }
  return [];
});

// 获取集成类型的显示名称
const getIntegrationType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'TABLE': '高级表格',
    'SIMPLE_TABLE': '简单表格',
    'CHART': '图表'
  };
  return typeMap[type] || type;
};

// 需要显示查询条件的集成类型
const shouldShowQuery = computed(() => {
  // 优先使用URL查询参数的类型，其次使用集成对象的类型
  console.log('[DEBUG] 计算shouldShowQuery, URL类型:', route.query.type);
  console.log('[DEBUG] 集成类型:', integration.value?.type);
  
  const typeParam = Array.isArray(route.query.type) 
    ? route.query.type[0] 
    : route.query.type as string;
  
  const integrationType = typeParam || (integration.value?.type ?? 'TABLE');
  
  console.log('[DEBUG] 最终使用的类型:', integrationType);
  
  // 只有高级表格类型(TABLE)需要显示查询条件
  return integrationType === 'TABLE';
});

// 计算查询条件列表
const queryConditions = computed(() => {
  if (!integration.value) return [];
  
  // 如果存在集成配置中的表单条件，优先使用
  if (integration.value.formConfig?.conditions?.length) {
    return integration.value.formConfig.conditions
      .filter(condition => condition.visibility !== 'hidden')
      .map(condition => ({
        name: condition.field,
        type: condition.type,
        format: condition.type === 'SELECT' ? 'enum' : condition.type.toLowerCase(),
        formType: mapFormComponentType(condition.type),
        required: condition.required || false,
        defaultValue: condition.defaultValue,
        description: condition.label,
        displayOrder: condition.displayOrder,
        options: condition.componentProps?.options || [],
        advancedConfig: condition.componentProps?.advancedConfig
      }))
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }
  
  // 其次使用查询参数
  if (integration.value.queryParams?.length) {
    return integration.value.queryParams
      .filter(param => param.description && param.description.trim() !== '')
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }
  
  return [];
});

// 将FormComponentType映射到formType
const mapFormComponentType = (componentType: string): string => {
  const typeMap: Record<string, string> = {
    'INPUT': 'input',
    'NUMBER': 'number',
    'DATE': 'date',
    'DATETIME': 'datetime',
    'SELECT': 'select',
    'MULTISELECT': 'multiselect',
    'CHECKBOX': 'checkbox',
    'RADIO': 'radio',
    'TEXTAREA': 'textarea'
  };
  return typeMap[componentType] || 'input';
};

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
    return {
      type: 'bar' as ChartType,
      title: '默认图表',
      dataMapping: {
        xField: 'category',
        yField: 'value'
      }
    } as ChartConfig;
  }
  
  return integration.value.chartConfig;
});

// 生命周期钩子
onMounted(async () => {
  console.log('页面刷新后重新计算shouldShowQuery');
  
  if (integrationId.value) {
    await loadIntegration();
  }
  
  // 手动触发数据加载
  await loadTableData();
  
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
    
    // 获取类型参数(优先顺序: URL路径参数 > URL查询参数 > 默认类型)
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
    
    // 确保类型是有效的（TABLE, SIMPLE_TABLE, CHART）
    const validType = ['CHART', 'TABLE', 'SIMPLE_TABLE'].includes(typeParam) 
      ? typeParam as 'CHART' | 'TABLE' | 'SIMPLE_TABLE'
      : 'TABLE';
      
    console.log(`[DEBUG] 使用的集成类型: ${validType}, URL路径参数: ${pathTypeParam}, URL查询参数: ${queryTypeParam}`);
    
    // 从服务端获取集成数据
    try {
      const result = await integrationStore.fetchIntegrationById(integrationId.value);
    
      if (result) {
        // 创建集成数据副本
        integration.value = { ...result };
        
        // 如果URL中有指定类型，则优先使用URL中的类型
        if (typeParam && ['CHART', 'TABLE', 'SIMPLE_TABLE'].includes(typeParam)) {
          console.log(`[DEBUG] 从URL获取集成类型: ${typeParam}, 覆盖服务端返回的类型: ${result.type}`);
          integration.value.type = typeParam as 'CHART' | 'TABLE' | 'SIMPLE_TABLE';
        }
        
        // 日志输出实际使用的类型
        console.log(`[DEBUG] 最终使用的集成类型: ${integration.value.type}`);
        console.log(`[DEBUG] 集成配置数据:`, integration.value);
        
        // 为TABLE类型添加默认查询条件（如果没有条件）
        if (integration.value.type === 'TABLE' && 
            (!integration.value.queryParams || integration.value.queryParams.length === 0)) {
          console.log('[DEBUG] 添加默认查询条件');
          integration.value.queryParams = [
            {
              name: 'product',
              type: 'STRING',
              format: 'string',
              formType: 'input',
              required: false,
              defaultValue: '',
              description: '产品名称',
              displayOrder: 1
            },
            {
              name: 'status',
              type: 'SELECT',
              format: 'enum',
              formType: 'select',
              required: false,
              defaultValue: '',
              description: '订单状态',
              displayOrder: 2,
              options: [
                { label: '全部', value: '' },
                { label: '已完成', value: '已完成' },
                { label: '进行中', value: '进行中' },
                { label: '已取消', value: '已取消' }
              ]
            },
            {
              name: 'dateRange',
              type: 'DATE',
              format: 'date',
              formType: 'date',
              required: false,
              defaultValue: '',
              description: '订单日期',
              displayOrder: 3
            }
          ];
        }
        
        // 初始化表单值
        if (integration.value.formConfig?.conditions?.length) {
          // 如果有表单配置，优先使用表单配置中的条件
          initFormValuesFromConfig(integration.value.formConfig.conditions);
        } else if (integration.value.queryParams) {
          // 其次使用查询参数
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
      
      // 模拟集成数据
      integration.value = {
        id: route.params.id as string,
        name: '订单系统集成',
        description: '与企业ERP系统的订单数据集成',
        type: validType, // 使用前面确定的类型参数
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
        // 添加模拟表单配置
        formConfig: {
          layout: 'horizontal',
          conditions: [
            { 
              field: 'startDate', 
              label: '开始日期', 
              type: 'DATE' as unknown as FormComponentType, 
              required: true, 
              displayOrder: 1,
              defaultValue: '',
              visibility: 'visible',
              componentProps: { 
                advancedConfig: { 
                  dateFormat: 'YYYY-MM-DD',
                  disableFuture: false
                } 
              }
            },
            { 
              field: 'endDate', 
              label: '结束日期', 
              type: 'DATE' as unknown as FormComponentType, 
              required: true, 
              displayOrder: 2,
              defaultValue: '',
              visibility: 'visible',
              componentProps: { 
                advancedConfig: { 
                  dateFormat: 'YYYY-MM-DD',
                  disablePast: false
                } 
              }
            },
            { 
              field: 'product', 
              label: '产品', 
              type: 'SELECT' as unknown as FormComponentType, 
              required: false, 
              displayOrder: 3,
              defaultValue: '',
              visibility: 'visible',
              componentProps: { 
                options: [
                  { label: '产品A', value: '产品A' },
                  { label: '产品B', value: '产品B' },
                  { label: '产品C', value: '产品C' }
                ]
              }
            },
            { 
              field: 'quantity', 
              label: '数量', 
              type: 'NUMBER' as unknown as FormComponentType, 
              required: false, 
              displayOrder: 4,
              defaultValue: '',
              visibility: 'visible',
              componentProps: { 
                advancedConfig: { 
                  minValue: 0,
                  step: 1
                } 
              }
            },
            { 
              field: 'remark', 
              label: '备注', 
              type: 'TEXTAREA' as unknown as FormComponentType, 
              required: false, 
              displayOrder: 5,
              defaultValue: '',
              visibility: 'visible',
              componentProps: { 
                advancedConfig: { 
                  maxLength: 200
                } 
              }
            }
          ],
          buttons: [
            { type: 'submit', label: '查询', style: 'primary' },
            { type: 'reset', label: '重置', style: 'secondary' }
          ]
        },
        // 添加查询参数定义，可选
        queryParams: validType === 'TABLE' ? [
          {
            name: 'product',
            type: 'STRING',
            format: 'string',
            formType: 'input',
            required: false,
            defaultValue: '',
            description: '产品名称',
            displayOrder: 1
          },
          {
            name: 'status',
            type: 'SELECT',
            format: 'enum',
            formType: 'select',
            required: false,
            defaultValue: '',
            description: '订单状态',
            displayOrder: 2,
            options: [
              { label: '全部', value: '' },
              { label: '已完成', value: '已完成' },
              { label: '进行中', value: '进行中' },
              { label: '已取消', value: '已取消' }
            ]
          },
          {
            name: 'dateRange',
            type: 'DATE',
            format: 'date',
            formType: 'date',
            required: false,
            defaultValue: '',
            description: '订单日期',
            displayOrder: 3
          }
        ] : [],
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
          batchActions: [],
          aggregation: {
            enabled: false,
            groupByFields: [],
            aggregationFunctions: []
          },
          advancedFilters: {
            enabled: false,
            defaultFilters: [],
            savedFilters: []
          }
        },
        // 图表配置（仅在CHART类型时使用）
        chartConfig: validType === 'CHART' ? {
          type: 'bar' as ChartType,
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
        } : undefined,
      };
      
      // 初始化表单值
      if (integration.value && integration.value.formConfig?.conditions?.length) {
        // 如果有表单配置，优先使用表单配置
        initFormValuesFromConfig(integration.value.formConfig.conditions);
      } else if (integration.value && integration.value.queryParams) {
        // 其次使用查询参数
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

// 从表单配置初始化值
const initFormValuesFromConfig = (conditions: any[]) => {
  formValues.value = {};
  
  if (!conditions) return;
  
  conditions.forEach(condition => {
    if (condition.visibility !== 'hidden') {
      // 根据不同类型设置默认值
      let defaultValue = condition.defaultValue || '';
      
      // 根据组件类型处理默认值
      if (condition.type === 'DATE') {
        // 如果默认值为空，检查是否有设置使用当前日期
        if (!defaultValue && condition.componentProps?.advancedConfig?.useCurrentDate) {
          defaultValue = new Date().toISOString().split('T')[0];
        }
      } else if (condition.type === 'DATETIME') {
        // 处理日期时间类型
        if (!defaultValue && condition.componentProps?.advancedConfig?.useCurrentDate) {
          defaultValue = new Date().toISOString().slice(0, 16);
        }
      } else if (condition.type === 'NUMBER') {
        // 数字类型默认值处理
        defaultValue = defaultValue === '' ? '' : Number(defaultValue);
      } else if (condition.type === 'CHECKBOX' || condition.type === 'BOOLEAN') {
        // 布尔类型转换
        defaultValue = defaultValue === true || defaultValue === 'true';
      }
      
      formValues.value[condition.field] = defaultValue;
    }
  });
  
  console.log('[DEBUG] 从表单配置初始化值:', formValues.value);
};

// 从查询参数初始化表单值
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
  
  console.log('[DEBUG] 从查询参数初始化值:', formValues.value);
};

// 加载表格数据
const loadTableData = async () => {
  try {
    tableLoading.value = true;
    console.log('[DEBUG] 开始加载表格数据...');

    // 显示加载状态的延迟
    await sleep(300);
    
    // 定义表格的列配置
    if (integration.value && !integration.value.tableConfig?.columns?.length) {
      integration.value.tableConfig = {
        ...integration.value?.tableConfig || {},
        columns: [
          { field: 'id', label: 'ID', type: 'number', visible: true, sortable: true, displayOrder: 0, align: ColumnAlign.LEFT, displayType: ColumnDisplayType.TEXT },
          { field: 'date', label: '日期', type: 'date', visible: true, sortable: true, displayOrder: 1, align: ColumnAlign.LEFT, displayType: ColumnDisplayType.DATE },
          { field: 'product', label: '产品', type: 'string', visible: true, sortable: true, displayOrder: 2, align: ColumnAlign.LEFT, displayType: ColumnDisplayType.TEXT },
          { field: 'quantity', label: '数量', type: 'number', visible: true, sortable: true, displayOrder: 3, align: ColumnAlign.RIGHT, displayType: ColumnDisplayType.NUMBER },
          { field: 'amount', label: '金额', type: 'currency', visible: true, sortable: true, displayOrder: 4, align: ColumnAlign.RIGHT, displayType: ColumnDisplayType.TEXT },
          { field: 'status', label: '状态', type: 'enum', visible: true, sortable: true, displayOrder: 5, align: ColumnAlign.CENTER, displayType: ColumnDisplayType.TAG },
          { field: 'customer', label: '客户', type: 'string', visible: true, sortable: true, displayOrder: 6, align: ColumnAlign.LEFT, displayType: ColumnDisplayType.TEXT },
          { field: 'department', label: '部门', type: 'string', visible: true, sortable: true, displayOrder: 7, align: ColumnAlign.LEFT, displayType: ColumnDisplayType.TEXT }
        ]
      };
    }
    
    // 生成测试数据，确保每次都创建新数据
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      date: formatDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
      product: ['笔记本电脑', '智能手机', '平板电脑', '智能手表', '无线耳机'][Math.floor(Math.random() * 5)],
      quantity: Math.floor(Math.random() * 100) + 1,
      amount: (Math.random() * 10000 + 500).toFixed(2),
      status: ['已完成', '进行中', '已取消'][Math.floor(Math.random() * 3)],
      customer: ['张三', '李四', '王五', '赵六', '钱七'][Math.floor(Math.random() * 5)],
      department: ['销售部', '市场部', '技术部', '客服部', '财务部'][Math.floor(Math.random() * 5)]
    }));

    console.log('生成了测试数据:', mockData.length, '条记录');
    console.log('样例数据:', mockData[0]);
    
    // 直接设置数据
    tableData.value = mockData;
    console.log('[DEBUG] 表格数据加载完成:', tableData.value.length, '条记录');
  } catch (error) {
    console.error('加载表格数据失败:', error);
    messageStore.error('加载表格数据失败，请稍后重试');
  } finally {
    tableLoading.value = false;
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
    } else if (chartType === 'line' || chartType === 'bar') {
      // 折线图和柱状图数据
      const categories = Array.from({ length: dataSize }, (_, i) => `类别${i + 1}`);
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
    } else {
      // 其他类型图表
      chartData.value = Array.from({ length: dataSize }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        category: `分类${i % 3 + 1}`
      }));
    }
    
    console.log('图表数据加载完成, 共生成', chartData.value.length, '条数据');
  } catch (error) {
    console.error('加载图表数据失败:', error);
  } finally {
    chartLoading.value = false;
  }
};

// 处理表格操作
const handleTableAction = (action: any, record: any) => {
  console.log('触发表格操作:', action, record);
  messageStore.info(`执行操作: ${action.label}, 记录ID: ${record.id}`);
};

// 处理导出
const handleExport = (format: string) => {
  console.log('导出数据:', format);
  messageStore.info(`导出数据至${format}格式`);
};

// 处理分页变化
const handlePageChange = (page: number) => {
  console.log('页码变化:', page);
};

// 返回按钮事件
const goBack = () => {
  router.push('/integration');
};

// 编辑按钮事件
const goToEdit = () => {
  router.push(`/integration/edit/${integrationId.value}`);
};

// 加载数据
const loadData = async () => {
  isLoading.value = true;
  queryError.value = null;
  
  try {
    if (integrationType.value === 'TABLE' || integrationType.value === 'SIMPLE_TABLE') {
      await loadTableData();
    } else if (integrationType.value === 'CHART') {
      await loadChartData();
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    queryError.value = '数据加载失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formValues.value = {};
  loadData();
};
</script>

<template>
  <div class="preview-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold mb-0">{{ pageTitle }}</h1>
          <a-tag v-if="integration?.type" color="blue" class="ml-2">{{ getIntegrationType(integration.type) }}</a-tag>
        </div>
        
        <div class="flex items-center space-x-2">
          <template v-for="(item, index) in actionItems" :key="index">
            <a-button 
              :type="item.type || 'default'" 
              @click="item.onClick"
            >
              <template #icon v-if="item.icon">
                <component :is="item.icon" />
              </template>
              {{ item.text }}
            </a-button>
          </template>
        </div>
      </div>
    </div>
    
    <!-- 预览内容区域 -->
    <div class="preview-content">
      <!-- 查询表单和结果内容 -->
      <a-card class="result-preview-card">
        <!-- 页面顶部消息 -->
        <div v-if="!isLoading && queryError" class="error-message">
          <a-alert type="error" :message="queryError" show-icon />
        </div>
        
        <!-- 查询条件表单区域 -->
        <template v-if="shouldShowQuery">
          <div class="query-info-header mb-4">
            <div class="flex justify-between items-center">
              <h3 class="text-base font-medium mb-0">查询条件</h3>
              <a-tag v-if="integration?.type" color="blue">{{ getIntegrationType(integration.type) }}</a-tag>
            </div>
          </div>

          <QueryForm 
            v-if="queryConditions.length > 0"
            :conditions="queryConditions" 
            :model-value="formValues"
            @submit="loadData"
            @reset="resetForm"
            class="query-form-section"
          />

          <div v-else class="empty-query-message p-4 mb-4 border border-dashed border-gray-300 rounded">
            <a-alert type="info" message="无查询条件可用" description="当前集成未配置查询条件，您可以继续查看数据或返回编辑集成添加查询条件。" show-icon />
          </div>
        </template>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-container">
          <a-spin size="large" tip="数据加载中..." />
        </div>
        
        <!-- 结果展示区域 -->
        <div v-else-if="!queryError" class="result-container">
          <!-- 图表视图 -->
          <ChartView
            v-if="integrationData && integrationType === 'CHART'"
            :config="chartConfig"
            :data="integrationData"
            @refresh="loadData"
          />
          
          <!-- 表格视图 -->
          <TableView
            v-else-if="integrationData && (integrationType === 'TABLE' || integrationType === 'SIMPLE_TABLE')"
            :columns="tableColumns"
            :data="integrationData" 
            :pagination="tablePagination"
            :title="tableTitle"
            :export-config="{ enabled: true, formats: ['Excel', 'CSV'] }"
            @refresh="loadData"
          />
          
          <!-- 无数据提示 -->
          <div v-else class="empty-container">
            <a-empty description="暂无数据，请修改查询条件后重试">
              <a-button type="primary" @click="loadData">刷新数据</a-button>
            </a-empty>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}

.result-preview-card {
  height: 100%;
}

.error-message {
  margin-bottom: 16px;
}

.query-form-section {
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.result-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.query-info-header {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
</style>