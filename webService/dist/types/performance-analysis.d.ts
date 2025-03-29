/**
 * 查询执行计划性能分析接口
 */
export interface PlanBottleneck {
    nodeId: number;
    reason: string;
}
export interface IndexUsage {
    table: string;
    index: string;
    effectiveness: number;
}
export interface JoinAnalysis {
    tables: string[];
    joinType: string;
    condition: string;
    cost: number;
}
export interface PerformanceAnalysis {
    bottlenecks: PlanBottleneck[];
    indexUsage: IndexUsage[];
    joinAnalysis: JoinAnalysis[];
}
export interface PerformanceConcern {
    severity: 'high' | 'medium' | 'low';
    type: string;
    description: string;
    suggestedAction: string;
}
export interface PerformanceAnalysisResult {
    bottlenecks: PerformanceConcern[];
    indexUsage: {
        missingIndexes: PerformanceConcern[];
        inefficientIndexes: PerformanceConcern[];
    };
    joinAnalysis: PerformanceConcern[];
}
