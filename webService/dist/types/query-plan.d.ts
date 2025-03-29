/**
 * 查询计划节点接口定义
 */
export interface QueryPlanNode {
    id: number;
    selectType: string;
    table: string;
    partitions?: string;
    type: string;
    possibleKeys?: string;
    key?: string;
    keyLen?: string;
    ref?: string;
    rows: number;
    filtered: number;
    extra?: string;
    children?: QueryPlanNode[];
}
/**
 * 查询执行计划接口
 */
export interface QueryPlan {
    planNodes: QueryPlanNode[];
    warnings: string[];
    query: string;
    estimatedCost: number | undefined;
    estimatedRows: number;
    optimizationTips: string[];
    performanceAnalysis?: any;
    executionStats?: {
        executionTime?: number;
        ioStats?: {
            reads: number;
            writes: number;
        };
        memoryUsage?: number;
    };
}
