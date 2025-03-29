import { v4 as uuidv4 } from 'uuid'
import type { QueryBuilderState, LogicalOperator } from '@/types/builder'

/**
 * 预定义查询模板
 * 这些模板将在应用首次加载时添加到用户的保存查询中
 */
export interface QueryTemplate {
  id: string
  name: string
  description: string
  sql: string
  savedAt: number
  isTemplate: boolean
  category: string
  state?: QueryBuilderState
}

/**
 * 基础查询模板列表
 */
export const defaultTemplates: QueryTemplate[] = [
  // 基础数据查询模板
  {
    id: uuidv4(),
    name: '基础表数据查询',
    description: '查询单表的全部字段和数据，可根据需要进行筛选和排序',
    sql: 'SELECT * FROM your_table LIMIT 100',
    savedAt: Date.now(),
    isTemplate: true,
    category: 'report',
    state: {
      selectedDataSourceId: '',
      tables: [],
      selectedTables: ['your_table'],
      joins: [],
      fieldSelections: [],
      whereConditions: {
        id: uuidv4(),
        conditions: [],
        groups: [],
        logicalOperator: 'AND' as LogicalOperator
      },
      groupByFields: [],
      sortDefinitions: [],
      limit: 100,
      offset: 0,
      generatedSql: 'SELECT * FROM your_table LIMIT 100'
    }
  },
  
  // 关联查询模板
  {
    id: uuidv4(),
    name: '多表关联查询',
    description: '通过外键关联多个表，提取关联数据',
    sql: 'SELECT a.*, b.name as related_name FROM table_a a LEFT JOIN table_b b ON a.ref_id = b.id LIMIT 100',
    savedAt: Date.now(),
    isTemplate: true,
    category: 'report',
    state: {
      selectedDataSourceId: '',
      tables: [],
      selectedTables: ['table_a', 'table_b'],
      joins: [
        {
          id: uuidv4(),
          type: 'LEFT',
          sourceTable: 'table_a',
          targetTable: 'table_b',
          sourceField: 'ref_id',
          targetField: 'id'
        }
      ],
      fieldSelections: [],
      whereConditions: {
        id: uuidv4(),
        conditions: [],
        groups: [],
        logicalOperator: 'AND' as LogicalOperator
      },
      groupByFields: [],
      sortDefinitions: [],
      limit: 100,
      offset: 0,
      generatedSql: 'SELECT a.*, b.name as related_name FROM table_a a LEFT JOIN table_b b ON a.ref_id = b.id LIMIT 100'
    }
  },
  
  // 数据统计模板
  {
    id: uuidv4(),
    name: '分组统计查询',
    description: '按指定字段分组并统计数据',
    sql: 'SELECT category, COUNT(*) as count, SUM(amount) as total_amount FROM orders GROUP BY category ORDER BY total_amount DESC LIMIT 10',
    savedAt: Date.now(),
    isTemplate: true,
    category: 'analysis',
    state: {
      selectedDataSourceId: '',
      tables: [],
      selectedTables: ['orders'],
      joins: [],
      fieldSelections: [
        {
          id: uuidv4(),
          field: { name: 'category', type: 'STRING', table: 'orders' },
          isVisible: true,
          isExpression: false
        },
        {
          id: uuidv4(),
          field: { name: 'id', type: 'INTEGER', table: 'orders' },
          aggregate: 'COUNT',
          alias: 'count',
          isVisible: true,
          isExpression: false
        },
        {
          id: uuidv4(),
          field: { name: 'amount', type: 'DECIMAL', table: 'orders' },
          aggregate: 'SUM',
          alias: 'total_amount',
          isVisible: true,
          isExpression: false
        }
      ],
      whereConditions: {
        id: uuidv4(),
        conditions: [],
        groups: [],
        logicalOperator: 'AND' as LogicalOperator
      },
      groupByFields: [
        { name: 'category', type: 'STRING', table: 'orders' }
      ],
      sortDefinitions: [
        {
          id: uuidv4(),
          field: { name: 'amount', type: 'DECIMAL', table: 'orders' },
          direction: 'DESC'
        }
      ],
      limit: 10,
      offset: 0,
      generatedSql: 'SELECT category, COUNT(*) as count, SUM(amount) as total_amount FROM orders GROUP BY category ORDER BY total_amount DESC LIMIT 10'
    }
  },
  
  // 日期筛选模板
  {
    id: uuidv4(),
    name: '日期范围筛选',
    description: '按日期范围筛选数据',
    sql: "SELECT * FROM logs WHERE created_at BETWEEN '2023-01-01' AND '2023-12-31' ORDER BY created_at DESC LIMIT 100",
    savedAt: Date.now(),
    isTemplate: true,
    category: 'report',
    state: {
      selectedDataSourceId: '',
      tables: [],
      selectedTables: ['logs'],
      joins: [],
      fieldSelections: [],
      whereConditions: {
        id: uuidv4(),
        conditions: [
          {
            id: uuidv4(),
            field: { name: 'created_at', type: 'DATE', table: 'logs' },
            operator: 'BETWEEN',
            value: ['2023-01-01', '2023-12-31']
          }
        ],
        groups: [],
        logicalOperator: 'AND' as LogicalOperator
      },
      groupByFields: [],
      sortDefinitions: [
        {
          id: uuidv4(),
          field: { name: 'created_at', type: 'DATE', table: 'logs' },
          direction: 'DESC'
        }
      ],
      limit: 100,
      offset: 0,
      generatedSql: "SELECT * FROM logs WHERE created_at BETWEEN '2023-01-01' AND '2023-12-31' ORDER BY created_at DESC LIMIT 100"
    }
  }
];

/**
 * 初始化查询模板
 * 如果用户本地存储中没有保存的查询，则添加默认模板
 */
export function initQueryTemplates(): void {
  const savedQueries = localStorage.getItem('datascope-saved-queries')
  
  // 只有在没有保存的查询时才添加默认模板
  if (!savedQueries) {
    localStorage.setItem('datascope-saved-queries', JSON.stringify(defaultTemplates))
  }
}