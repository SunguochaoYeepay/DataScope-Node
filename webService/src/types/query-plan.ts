/**
 * 查询计划节点接口定义
 * 表示MySQL EXPLAIN命令返回的单个执行步骤
 */
export interface QueryPlanNode {
  /** 操作ID */
  id: number;
  /** 查询类型，例如SIMPLE, PRIMARY, UNION等 */
  selectType: string;
  /** 表名 */
  table: string;
  /** 分区信息（如果使用分区表） */
  partitions?: string;
  /** 访问类型，如ALL, index, range, ref等 */
  type: string;
  /** 可能使用的索引 */
  possibleKeys?: string;
  /** 实际使用的索引 */
  key?: string;
  /** 使用的索引长度 */
  keyLen?: string | number;
  /** 与索引比较的列 */
  ref?: string;
  /** 预计扫描的行数 */
  rows: number;
  /** 过滤后百分比，表示符合条件的行数比例 */
  filtered: number;
  /** 额外信息，如Using index, Using filesort等 */
  extra?: string;
  /** 子查询计划（用于复杂查询） */
  children?: QueryPlanNode[];
}

/**
 * 查询执行计划接口
 * 表示完整的SQL查询执行计划及分析结果
 */
export interface QueryPlan {
  /** 计划中包含的所有节点 */
  planNodes: QueryPlanNode[];
  /** 查询时产生的警告信息 */
  warnings: string[];
  /** 原始SQL查询语句 */
  query: string;
  /** 查询估计成本，由数据库优化器计算 */
  estimatedCost: number | undefined;
  /** 估计返回行数总计 */
  estimatedRows: number;
  /** 查询性能优化建议 */
  optimizationTips: string[];
  /** 性能分析结果 */
  performanceAnalysis?: {
    /** 查询执行瓶颈列表 */
    bottlenecks: string[];
    /** 推荐创建的索引 */
    recommendedIndexes?: string[];
    /** 其他性能分析数据 */
    additionalInfo?: Record<string, any>;
  };
  /** 查询执行统计信息 */
  executionStats?: {
    /** 执行时间（毫秒） */
    executionTime?: number;
    /** IO统计信息 */
    ioStats?: {
      /** 磁盘读取次数 */
      reads: number;
      /** 磁盘写入次数 */
      writes: number;
    };
    /** 内存使用量（字节） */
    memoryUsage?: number;
  };
}