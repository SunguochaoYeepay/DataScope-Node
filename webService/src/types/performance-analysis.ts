/**
 * 查询执行计划性能分析接口
 */

// 瓶颈
export interface PlanBottleneck {
  nodeId: number;
  reason: string;
}

// 索引使用情况
export interface IndexUsage {
  table: string;
  index: string;
  effectiveness: number; // 0-100的数值，表示有效性百分比
}

// 连接分析
export interface JoinAnalysis {
  tables: string[];
  joinType: string;
  condition: string;
  cost: number;
}

// 完整的性能分析
export interface PerformanceAnalysis {
  bottlenecks: PlanBottleneck[];
  indexUsage: IndexUsage[];
  joinAnalysis: JoinAnalysis[];
}

// 性能关注点
export interface PerformanceConcern {
  severity: 'high' | 'medium' | 'low';
  type: string;
  description: string;
  suggestedAction: string;
}

// 性能分析结果
export interface PerformanceAnalysisResult {
  bottlenecks: PerformanceConcern[];
  indexUsage: {
    missingIndexes: PerformanceConcern[];
    inefficientIndexes: PerformanceConcern[];
  };
  joinAnalysis: PerformanceConcern[];
}