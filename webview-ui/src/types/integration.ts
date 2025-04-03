// 集成类型定义文件

// 表单组件类型枚举
export enum FormComponentType {
  INPUT = 'INPUT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  TEXTAREA = 'TEXTAREA'
}

// 表格列对齐方式
export enum ColumnAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right'
}

// 表格列显示类型
export enum ColumnDisplayType {
  TEXT = 'TEXT',
  TAG = 'TAG',
  STATUS = 'STATUS',
  SENSITIVE = 'SENSITIVE',
  LINK = 'LINK',
  IMAGE = 'IMAGE',
  DATE = 'DATE',
  NUMBER = 'NUMBER',
  BADGE = 'BADGE'
}

// 查询参数配置
export interface QueryParam {
  name: string; // 字段名
  type: string; // 字段类型(string, number, date等)
  format: string; // 数据格式(string, integer, decimal, date, datetime, enum等)
  formType: string; // 表单类型(date, select, input等)
  required: boolean; // 是否必填
  defaultValue?: any; // 默认值
  description: string; // 中文名称/描述
  displayOrder: number; // 显示顺序
  options?: Array<{label: string, value: string}>; // 选项列表(用于select类型)
  // 高级配置选项
  advancedConfig?: {
    minValue?: number; // 最小值(数字类型)
    maxValue?: number; // 最大值(数字类型)
    step?: number; // 步长(数字类型)
    precision?: number; // 小数位数(数字类型)
    dateFormat?: string; // 日期格式
    dateRange?: number; // 可选日期范围(天)
    disablePast?: boolean; // 禁用过去日期
    disableFuture?: boolean; // 禁用未来日期
    maxLength?: number; // 最大长度(文本类型)
    minLength?: number; // 最小长度(文本类型)
    allowSearch?: boolean; // 允许搜索(select类型)
    allowMultiple?: boolean; // 允许多选(select类型)
    placeholder?: string; // 占位文本
    validationRegex?: string; // 验证正则表达式
    validationMessage?: string; // 验证错误消息
  };
}

// 图表类型枚举
export enum ChartType {
  BAR = 'bar',
  LINE = 'line',
  PIE = 'pie',
  SCATTER = 'scatter',
  AREA = 'area'
}

// 图表主题枚举
export enum ChartTheme {
  DEFAULT = 'default',
  LIGHT = 'light', 
  DARK = 'dark'
}

// 图表数据映射配置
export interface ChartDataMapping {
  xField?: string; // X轴字段(柱状图、折线图、散点图)
  yField?: string; // Y轴字段(柱状图、折线图、散点图)
  valueField?: string; // 值字段(饼图)
  categoryField?: string; // 分类字段(饼图)
  seriesField?: string; // 系列字段(多系列图表)
  colorField?: string; // 颜色映射字段
  sizeField?: string; // 大小映射字段(散点图)
}

// 图表配置接口
export interface ChartConfig {
  type: ChartType; // 图表类型
  title?: string; // 图表标题
  description?: string; // 图表描述
  theme?: ChartTheme; // 图表主题
  height?: number; // 图表高度
  showLegend?: boolean; // 是否显示图例
  animation?: boolean; // 是否启用动画
  dataMapping: ChartDataMapping; // 数据映射配置
  // 样式配置
  styleOptions?: {
    colors?: string[]; // 自定义颜色数组
    backgroundColor?: string; // 背景颜色
    fontFamily?: string; // 字体
    borderRadius?: number; // 边框圆角
    padding?: number | number[]; // 内边距
  };
  // 交互配置
  interactions?: {
    enableZoom?: boolean; // 启用缩放
    enablePan?: boolean; // 启用平移
    enableSelect?: boolean; // 启用选择
    tooltipMode?: 'single' | 'multiple'; // 提示框模式
  };
}

// 表单布局类型
export type FormLayoutType = 'horizontal' | 'vertical' | 'grid';

// 表单条件
export interface FormCondition {
  field: string;
  label: string;
  type: FormComponentType;
  required?: boolean;
  defaultValue?: any;
  displayOrder: number;
  visibility?: 'visible' | 'hidden' | 'readonly';
  componentProps?: Record<string, any>;
}

// 表单按钮
export interface FormButton {
  type: 'submit' | 'reset' | 'button';
  label: string;
  style?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info';
  icon?: string;
  handler?: string;
}

// 表单配置
export interface FormConfig {
  layout: FormLayoutType;
  conditions: FormCondition[];
  buttons: FormButton[];
}

// 表格列
export interface TableColumn {
  field: string;
  label: string;
  type: string;
  displayType?: ColumnDisplayType; // 显示类型 - TEXT、TAG、STATUS、SENSITIVE、LINK、IMAGE、DATE、NUMBER、BADGE
  sortable?: boolean;
  filterable?: boolean;
  align: ColumnAlign;
  width?: string;
  maskType?: string;
  format?: string;
  visible: boolean;
  displayOrder: number;
  filterConfig?: ColumnFilterConfig;
  helpText?: string; // 列帮助文本，用于显示提示信息
  isNewColumn?: boolean; // 标记是否为新添加的列
}

// 表格操作
export interface TableAction {
  type: 'button' | 'link' | 'menu';
  label: string;
  handler: string;
  icon?: string;
  style?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info';
  confirm?: boolean;
  confirmMessage?: string;
}

// 分页配置
export interface PaginationConfig {
  enabled: boolean;
  pageSize: number;
  pageSizeOptions: number[];
}

// 导出配置
export interface ExportConfig {
  enabled: boolean;
  formats: string[];
  maxRows: number;
}

// 批量操作
export interface BatchAction {
  id: string;
  label: string;
  handler: string;
  confirmationRequired: boolean;
  confirmationMessage?: string;
}

// 聚合配置
export interface AggregationConfig {
  enabled: boolean;
  groupByFields: string[];
  aggregationFunctions: Array<{
    field: string;
    function: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'countDistinct';
    alias: string;
  }>;
}

// 过滤条件
export interface FilterCondition {
  field: string;
  operator: string;
  value: any;
  logic: 'AND' | 'OR';
}

// 保存的过滤器
export interface SavedFilter {
  id: string;
  name: string;
  conditions: FilterCondition[];
  isDefault: boolean;
}

// 高级过滤配置
export interface AdvancedFiltersConfig {
  enabled: boolean;
  defaultFilters: string[];
  savedFilters: SavedFilter[];
}

// 列过滤配置
export interface ColumnFilterConfig {
  operators: string[];
  defaultValue: any;
  multiple: boolean;
}

// 表格配置
export interface TableConfig {
  columns: TableColumn[];
  actions: TableAction[];
  pagination: PaginationConfig;
  export: ExportConfig;
  batchActions: BatchAction[];
  aggregation: AggregationConfig;
  advancedFilters: AdvancedFiltersConfig;
}

// URL配置
export interface UrlConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
}

// 表单提交配置
export interface FormSubmitConfig {
  formId: string;
  submitAction: string;
  successMessage?: string;
  errorMessage?: string;
}

// 集成点
export interface IntegrationPoint {
  id: string;
  name: string;
  type: 'URL' | 'FORM_SUBMIT';
  urlConfig?: UrlConfig;
  formSubmitConfig?: FormSubmitConfig;
}

// 集成
export interface Integration {
  id: string;
  name: string;
  description?: string;
  type: 'SIMPLE_TABLE' | 'TABLE' | 'CHART' | 'FORM';
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  queryId: string;
  dataSourceId?: string; // 数据源ID
  formConfig?: FormConfig;
  tableConfig?: TableConfig;
  chartConfig?: ChartConfig; // 图表配置
  integrationPoint: IntegrationPoint;
  createTime: string;
  updateTime: string;
  queryParams?: QueryParam[]; // 查询参数列表
}

// 查询结果列定义
export interface QueryResultColumn {
  name: string;
  type: string;
  label?: string;
  format?: string;
}

// 查询结果定义
export interface QueryResult {
  columns: QueryResultColumn[];
  rows: any[];
  total?: number;
  page?: number;
  pageSize?: number;
}