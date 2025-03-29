/**
 * 列元数据定义
 */
export interface ColumnMetadata {
  /**
   * 列名
   */
  name: string;
  
  /**
   * 数据类型
   */
  type: string;
  
  /**
   * 长度/精度
   */
  size?: number;
  
  /**
   * 小数位数
   */
  scale?: number;
  
  /**
   * 是否可为空
   */
  nullable: boolean;
  
  /**
   * 默认值
   */
  defaultValue?: string;
  
  /**
   * 是否为主键
   */
  primaryKey: boolean;
  
  /**
   * 是否为外键
   */
  foreignKey: boolean;
  
  /**
   * 外键引用的表
   */
  referencedTable?: string;
  
  /**
   * 外键引用的列
   */
  referencedColumn?: string;
  
  /**
   * 是否为唯一键
   */
  unique: boolean;
  
  /**
   * 是否为自增列
   */
  autoIncrement: boolean;
  
  /**
   * 列注释
   */
  comment?: string;
}

/**
 * 表元数据定义
 */
export interface TableMetadata {
  /**
   * 表名
   */
  name: string;
  
  /**
   * 表类型（TABLE, VIEW 等）
   */
  type: 'TABLE' | 'VIEW' | 'MATERIALIZED_VIEW' | 'SYSTEM_TABLE' | 'SYSTEM_VIEW' | 'OTHER';
  
  /**
   * 表注释
   */
  comment?: string;
  
  /**
   * 表所属模式
   */
  schema?: string;
  
  /**
   * 表所属目录
   */
  catalog?: string;
  
  /**
   * 表的列定义
   */
  columns: ColumnMetadata[];
  
  /**
   * 表的主键
   */
  primaryKey?: string[];
  
  /**
   * 表的索引
   */
  indices?: IndexMetadata[];
}

/**
 * 索引元数据定义
 */
export interface IndexMetadata {
  /**
   * 索引名称
   */
  name: string;
  
  /**
   * 索引类型
   */
  type: 'BTREE' | 'HASH' | 'FULLTEXT' | 'OTHER';
  
  /**
   * 索引列
   */
  columns: string[];
  
  /**
   * 是否唯一
   */
  unique: boolean;
}

/**
 * 元数据定义
 */
export interface Metadata {
  /**
   * 表元数据列表
   */
  tables: TableMetadata[];
  
  /**
   * 视图元数据列表
   */
  views?: TableMetadata[];
  
  /**
   * 数据库版本
   */
  databaseVersion?: string;
  
  /**
   * 数据库产品名称
   */
  databaseProductName?: string;
  
  /**
   * 上次同步时间
   */
  lastSyncTime?: string;
}

/**
 * 表关系定义
 */
export interface TableRelationship {
  /**
   * 关系ID
   */
  id: string;
  
  /**
   * 源表
   */
  sourceTable: string;
  
  /**
   * 源列
   */
  sourceColumn: string;
  
  /**
   * 目标表
   */
  targetTable: string;
  
  /**
   * 目标列
   */
  targetColumn: string;
  
  /**
   * 关系类型
   */
  relationType: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  
  /**
   * 是否为外键约束
   */
  isForeignKey: boolean;
  
  /**
   * 自定义关系名称
   */
  name?: string;
  
  /**
   * 关系描述
   */
  description?: string;
}