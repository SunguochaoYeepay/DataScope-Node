/**
 * 集成类型定义
 */

// 集成状态
export type IntegrationStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

// 表单组件类型
export enum FormComponentType {
  INPUT = 'input',
  NUMBER = 'number',
  DATE = 'date',
  DATETIME = 'datetime',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  TEXTAREA = 'textarea'
}

// 表单布局类型
export enum FormLayoutType {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  GRID = 'grid'
}

// 表单条件定义
export interface FormCondition {
  field: string;
  label: string;
  type: FormComponentType;
  required: boolean;
  defaultValue?: any;
  validation?: {
    pattern?: string;
    message?: string;
  };
  displayOrder: number;
  visibility: 'visible' | 'hidden' | 'conditional';
  dependsOn?: {
    field: string;
    value: any;
  };
  componentProps?: Record<string, any>;
}

// 表单按钮定义
export interface FormButton {
  type: 'submit' | 'reset' | 'export';
  label: string;
  style: 'primary' | 'secondary' | 'danger';
  icon?: string;
  action?: string;
}

// 表单配置
export interface FormConfig {
  layout: FormLayoutType;
  conditions: FormCondition[];
  buttons: FormButton[];
}

// 列对齐方式
export enum ColumnAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right'
}

// 数据列定义
export interface TableColumn {
  field: string;
  label: string;
  type: string;
  format?: string;
  sortable: boolean;
  filterable: boolean;
  width?: string;
  align: ColumnAlign;
  maskType?: string;
  maskPattern?: string;
  visible: boolean;
  displayOrder: number;
}

// 表格操作定义
export interface TableAction {
  type: 'link' | 'button' | 'menu';
  label: string;
  icon?: string;
  style?: string;
  handler: string;
  condition?: {
    field: string;
    operator: string;
    value: any;
  };
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

// 表格配置
export interface TableConfig {
  columns: TableColumn[];
  actions: TableAction[];
  pagination: PaginationConfig;
  export: ExportConfig;
}

// 图表类型
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie'
}

// 图表主题
export enum ChartTheme {
  DEFAULT = 'default',
  LIGHT = 'light',
  DARK = 'dark'
}

// 图表配置
export interface ChartConfig {
  type: ChartType;
  title?: string;
  theme?: ChartTheme;
  dataMapping: {
    xField: string;
    yField: string;
    seriesField?: string;
    valueField?: string;
  };
  height?: number;
  showLegend?: boolean;
  animation?: boolean;
  styleOptions?: {
    colors?: string[];
    backgroundColor?: string;
    fontFamily?: string;
    borderRadius?: number;
    padding?: number | number[];
  };
  interactions?: {
    enableZoom?: boolean;
    enablePan?: boolean;
    enableSelect?: boolean;
    tooltipMode?: 'single' | 'multiple';
  };
}

// 显示配置
export interface DisplayConfig {
  queryForm: FormConfig;
  resultTable: TableConfig;
  chart?: ChartConfig;
}

// 集成配置
export interface IntegrationConfig {
  id: string;
  name: string;
  description?: string;
  queryId: string;
  version: number;
  displayConfig: DisplayConfig;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// API配置
export interface ApiConfig {
  configId: string;
  queryEndpoint: string;
  downloadEndpoint: string;
  documentation?: {
    description: string;
    parameters: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
    responses: {
      code: number;
      description: string;
      example?: string;
    }[];
  };
}

/**
 * 自定义图表配置
 */
export interface CustomChartConfig {
  type: string;
  theme: string;
  title?: string;
  description?: string;
  height?: number;
  showLegend?: boolean;
  animation?: boolean;
  dataMapping: {
    xField?: string;
    yField?: string;
    nameField?: string;
    valueField?: string;
  };
}

/**
 * 集成定义
 */
export interface Integration {
  id: string;
  name: string;
  description?: string;
  type: 'SIMPLE_TABLE' | 'TABLE' | 'CHART';
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  queryId: string;
  formConfig?: FormConfig;
  tableConfig?: TableConfig;
  chartConfig?: CustomChartConfig;
  integrationPoint: IntegrationPoint;
  createTime: string;
  updateTime: string;
}

/**
 * 集成点定义
 */
export interface IntegrationPoint {
  id: string;
  name: string;
  type: 'URL' | 'FORM_SUBMIT';
  urlConfig?: UrlConfig;
  formSubmitConfig?: FormSubmitConfig;
}

/**
 * URL配置
 */
export interface UrlConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
}

/**
 * 表单提交配置
 */
export interface FormSubmitConfig {
  formId: string;
  submitAction: string;
  successMessage: string;
  errorMessage: string;
}