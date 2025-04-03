/**
 * 执行状态枚举
 */
export type ExecutionStatus = 'RUNNING' | 'SUCCESS' | 'ERROR' | 'CANCELLED';

/**
 * 执行历史记录
 */
export interface ExecutionHistory {
  id: string;
  queryId: string;
  versionId: string;
  executedAt: string;
  status: ExecutionStatus;
  executionTime: number; // 毫秒
  resultRowCount: number;
  userId: string;
  error: string | null;
} 