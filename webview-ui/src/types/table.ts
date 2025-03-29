// 表格列配置接口
export interface TableColumn {
  key: string;              // 列标识
  title: string;           // 列标题
  dataIndex: string;       // 数据索引
  sortable?: boolean;      // 是否可排序
  filterable?: boolean;    // 是否可筛选
  width?: number | string; // 列宽度
  fixed?: 'left' | 'right';// 固定列
  align?: 'left' | 'center' | 'right'; // 对齐方式
  render?: (text: any, record: any, index: number) => any; // 自定义渲染函数
}

// 分页配置接口
export interface Pagination {
  current: number;        // 当前页码
  pageSize: number;       // 每页条数
  total: number;         // 总条数
  showSizeChanger?: boolean; // 是否显示页码切换器
  showQuickJumper?: boolean; // 是否显示快速跳转
}

// 排序配置接口
export interface SorterConfig {
  key: string;           // 排序字段
  order: 'ascend' | 'descend' | null; // 排序方向
}

// 筛选配置接口
export interface FilterConfig {
  key: string;           // 筛选字段
  values: string[];      // 筛选值
}

// 表格变更事件接口
export interface TableChangeEvent {
  pagination?: Pagination;
  sorter?: SorterConfig;
  filters?: Record<string, string[]>;
}

// 表格配置接口
export interface TableProps {
  columns: TableColumn[];              // 列配置
  dataSource: any[];                   // 数据源
  pagination?: Pagination;             // 分页配置
  loading?: boolean;                   // 加载状态
  rowKey?: string | ((record: any) => string); // 行键
  rowSelection?: {                     // 行选择配置
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => void;
  };
  onChange?: (event: TableChangeEvent) => void; // 变更事件处理
}