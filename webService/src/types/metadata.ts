/**
 * 数据库架构类型
 */
export interface Schema {
  name: string;
  tables: Table[];
}

/**
 * 表类型
 */
export interface Table {
  name: string;
  type: string;
  schema?: string;
  description?: string;
  createTime?: Date;
  updateTime?: Date;
}

/**
 * 列类型
 */
export interface Column {
  name: string;
  dataType: string;
  columnType: string;
  position: number;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isUnique: boolean;
  isAutoIncrement: boolean;
  defaultValue?: string;
  description?: string;
  maxLength?: number;
  precision?: number;
  scale?: number;
}

/**
 * 主键类型
 */
export interface PrimaryKey {
  constraintName: string;
  columnName: string;
  position: number;
}

/**
 * 外键类型
 */
export interface ForeignKey {
  constraintName: string;
  columnName: string;
  position: number;
  referencedSchema: string;
  referencedTable: string;
  referencedColumn: string;
  updateRule: string;
  deleteRule: string;
}

/**
 * 索引类型
 */
export interface Index {
  name: string;
  columns: string[];
  unique: boolean;
}

/**
 * 表结构类型
 */
export interface TableStructure {
  table: {
    schema: string;
    name: string;
  };
  columns: Column[];
  primaryKeys: PrimaryKey[];
  foreignKeys: ForeignKey[];
  indexes: Index[];
}

/**
 * 表数据预览类型
 */
export interface TableDataPreview {
  columns: Array<{
    name: string;
    type: string;
    table?: string;
    schema?: string;
  }>;
  rows: any[];
  rowCount: number;
  truncated: boolean;
}

/**
 * 低代码JSON导出格式
 */
export interface LowCodeSchema {
  name: string;
  schema: string;
  fields: Array<{
    name: string;
    type: string;
    label: string;
    description: string;
    primary: boolean;
    required: boolean;
    unique: boolean;
    defaultValue?: string;
    length?: number;
    precision?: number;
    scale?: number;
    autoIncrement: boolean;
    relations: Array<{
      type: string;
      target: string;
      targetSchema: string;
      targetField: string;
      name: string;
    }>;
  }>;
  indexes: Array<{
    name: string;
    columns: string[];
    unique: boolean;
  }>;
}