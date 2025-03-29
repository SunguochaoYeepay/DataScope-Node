/**
 * 查询计划节点接口定义
 */
export interface QueryPlanNode {
  id: number;              // 操作ID
  selectType: string;      // 查询类型
  table: string;           // 表名
  partitions?: string;     // 分区
  type: string;            // 连接类型
  possibleKeys?: string;   // 可能使用的索引
  key?: string;            // 实际使用的索引
  keyLen?: string;         // 索引长度
  ref?: string;            // 索引引用
  rows: number;            // 扫描行数估计
  filtered: number;        // 按表条件过滤的百分比
  extra?: string;          // 附加信息
  children?: QueryPlanNode[]; // 子查询计划（用于复杂查询）
}

/**
 * 查询执行计划接口
 */
export interface QueryPlan {
  planNodes: QueryPlanNode[];
  warnings: string[];      // 警告信息
  query: string;           // 原始查询
  estimatedCost: number;   // 估计成本
  estimatedRows: number;   // 估计返回行数
  optimizationTips: string[]; // 优化建议
  performanceAnalysis?: any; // 性能分析结果
  executionStats?: { // 执行统计信息
    executionTime?: number; // 执行时间
    ioStats?: { // IO统计
      reads: number;  // 读取次数
      writes: number; // 写入次数
    };
    memoryUsage?: number; // 内存使用
  };
}