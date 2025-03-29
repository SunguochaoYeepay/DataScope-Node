/**
 * 元数据相关的模拟数据
 */

/**
 * 数据库结构模拟数据
 */
export const mockDatabaseStructure = {
  databases: [
    {
      name: 'test_db',
      schemas: [
        {
          name: 'public',
          tables: [
            {
              name: 'users',
              type: 'TABLE',
              comment: '用户信息表',
              columns: [
                {
                  name: 'id',
                  type: 'INT',
                  nullable: false,
                  defaultValue: undefined,
                  isPrimary: true,
                  isUnique: true,
                  comment: '用户ID'
                },
                {
                  name: 'name',
                  type: 'VARCHAR(100)',
                  nullable: false,
                  defaultValue: undefined,
                  isPrimary: false,
                  isUnique: false,
                  comment: '用户名'
                },
                {
                  name: 'email',
                  type: 'VARCHAR(255)',
                  nullable: false,
                  defaultValue: undefined,
                  isPrimary: false,
                  isUnique: true,
                  comment: '电子邮箱'
                },
                {
                  name: 'password',
                  type: 'VARCHAR(255)',
                  nullable: false,
                  defaultValue: undefined,
                  isPrimary: false,
                  isUnique: false,
                  comment: '密码哈希'
                },
                {
                  name: 'status',
                  type: 'ENUM("active","inactive","suspended")',
                  nullable: false,
                  defaultValue: 'active',
                  isPrimary: false,
                  isUnique: false,
                  comment: '用户状态'
                },
                {
                  name: 'created_at',
                  type: 'TIMESTAMP',
                  nullable: false,
                  defaultValue: 'CURRENT_TIMESTAMP',
                  isPrimary: false,
                  isUnique: false,
                  comment: '创建时间'
                },
                {
                  name: 'updated_at',
                  type: 'TIMESTAMP',
                  nullable: false,
                  defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                  isPrimary: false,
                  isUnique: false,
                  comment: '更新时间'
                }
              ],
              indexes: [
                {
                  name: 'PRIMARY',
                  columns: ['id'],
                  unique: true,
                  type: 'BTREE'
                },
                {
                  name: 'idx_email',
                  columns: ['email'],
                  unique: true,
                  type: 'BTREE'
                },
                {
                  name: 'idx_status',
                  columns: ['status'],
                  unique: false,
                  type: 'BTREE'
                }
              ],
              foreignKeys: []
            },
            {
              name: 'orders',
              type: 'TABLE',
              comment: '订单表',
              columns: [
                {
                  name: 'id',
                  type: 'INT',
                  nullable: false,
                  defaultValue: undefined,
                  isPrimary: true,
                  isUnique: true,
                  comment: '订单ID'
                },
                {
                  name: 'user_id',
                  type: 'INT',
                  nullable: false,
                  defaultValue: undefined,
                  isPrimary: false,
                  isUnique: false,
                  comment: '用户ID'
                },
                {
                  name: 'status',
                  type: 'ENUM("pending","processing","shipped","delivered","cancelled")',
                  nullable: false,
                  defaultValue: 'pending',
                  isPrimary: false,
                  isUnique: false,
                  comment: '订单状态'
                },
                {
                  name: 'total_amount',
                  type: 'DECIMAL(10,2)',
                  nullable: false,
                  defaultValue: '0.00',
                  isPrimary: false,
                  isUnique: false,
                  comment: '订单总金额'
                },
                {
                  name: 'created_at',
                  type: 'TIMESTAMP',
                  nullable: false,
                  defaultValue: 'CURRENT_TIMESTAMP',
                  isPrimary: false,
                  isUnique: false,
                  comment: '创建时间'
                },
                {
                  name: 'updated_at',
                  type: 'TIMESTAMP',
                  nullable: false,
                  defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                  isPrimary: false,
                  isUnique: false,
                  comment: '更新时间'
                }
              ],
              indexes: [
                {
                  name: 'PRIMARY',
                  columns: ['id'],
                  unique: true,
                  type: 'BTREE'
                },
                {
                  name: 'idx_user_id',
                  columns: ['user_id'],
                  unique: false,
                  type: 'BTREE'
                },
                {
                  name: 'idx_status',
                  columns: ['status'],
                  unique: false,
                  type: 'BTREE'
                }
              ],
              foreignKeys: [
                {
                  column: 'user_id',
                  referencedTable: 'users',
                  referencedColumn: 'id'
                }
              ]
            },
            {
              name: 'products',
              type: 'TABLE',
              comment: '产品表',
              columns: [
                {
                  name: 'id',
                  type: 'INT',
                  nullable: false,
                  defaultValue: undefined,
                  isPrimary: true,
                  isUnique: true,
                  comment: '产品ID'
                },
                {
                  name: 'name',
                  type: 'VARCHAR(255)',
                  nullable: false,
                  defaultValue: undefined,
                  isPrimary: false,
                  isUnique: false,
                  comment: '产品名称'
                },
                {
                  name: 'description',
                  type: 'TEXT',
                  nullable: true,
                  defaultValue: undefined,
                  isPrimary: false,
                  isUnique: false,
                  comment: '产品描述'
                },
                {
                  name: 'price',
                  type: 'DECIMAL(10,2)',
                  nullable: false,
                  defaultValue: '0.00',
                  isPrimary: false,
                  isUnique: false,
                  comment: '产品价格'
                },
                {
                  name: 'stock',
                  type: 'INT',
                  nullable: false,
                  defaultValue: '0',
                  isPrimary: false,
                  isUnique: false,
                  comment: '库存数量'
                },
                {
                  name: 'category_id',
                  type: 'INT',
                  nullable: true,
                  defaultValue: undefined,
                  isPrimary: false,
                  isUnique: false,
                  comment: '类别ID'
                },
                {
                  name: 'created_at',
                  type: 'TIMESTAMP',
                  nullable: false,
                  defaultValue: 'CURRENT_TIMESTAMP',
                  isPrimary: false,
                  isUnique: false,
                  comment: '创建时间'
                },
                {
                  name: 'updated_at',
                  type: 'TIMESTAMP',
                  nullable: false,
                  defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                  isPrimary: false,
                  isUnique: false,
                  comment: '更新时间'
                }
              ],
              indexes: [
                {
                  name: 'PRIMARY',
                  columns: ['id'],
                  unique: true,
                  type: 'BTREE'
                },
                {
                  name: 'idx_category_id',
                  columns: ['category_id'],
                  unique: false,
                  type: 'BTREE'
                }
              ],
              foreignKeys: [
                {
                  column: 'category_id',
                  referencedTable: 'categories',
                  referencedColumn: 'id'
                }
              ]
            },
            {
              name: 'categories',
              type: 'TABLE',
              comment: '产品类别表',
              columns: [
                {
                  name: 'id',
                  type: 'INT',
                  nullable: false,
                  defaultValue: undefined,
                  isPrimary: true,
                  isUnique: true,
                  comment: '类别ID'
                },
                {
                  name: 'name',
                  type: 'VARCHAR(100)',
                  nullable: false,
                  defaultValue: undefined,
                  isPrimary: false,
                  isUnique: true,
                  comment: '类别名称'
                },
                {
                  name: 'description',
                  type: 'TEXT',
                  nullable: true,
                  defaultValue: undefined,
                  isPrimary: false,
                  isUnique: false,
                  comment: '类别描述'
                },
                {
                  name: 'created_at',
                  type: 'TIMESTAMP',
                  nullable: false,
                  defaultValue: 'CURRENT_TIMESTAMP',
                  isPrimary: false,
                  isUnique: false,
                  comment: '创建时间'
                },
                {
                  name: 'updated_at',
                  type: 'TIMESTAMP',
                  nullable: false,
                  defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                  isPrimary: false,
                  isUnique: false,
                  comment: '更新时间'
                }
              ],
              indexes: [
                {
                  name: 'PRIMARY',
                  columns: ['id'],
                  unique: true,
                  type: 'BTREE'
                },
                {
                  name: 'idx_name',
                  columns: ['name'],
                  unique: true,
                  type: 'BTREE'
                }
              ],
              foreignKeys: []
            }
          ]
        }
      ]
    }
  ]
};

/**
 * 获取指定数据源的元数据结构
 * @param dataSourceId 数据源ID
 * @returns 元数据结构
 */
export function getMockMetadataStructure(dataSourceId: string) {
  return mockDatabaseStructure;
}

/**
 * 获取指定表的列信息
 * @param dataSourceId 数据源ID
 * @param table 表名
 * @returns 列信息
 */
export function getMockTableColumns(dataSourceId: string, database: string, table: string) {
  const db = mockDatabaseStructure.databases.find(db => db.name === database);
  if (!db) return [];
  
  for (const schema of db.schemas) {
    const tableInfo = schema.tables.find(t => t.name === table);
    if (tableInfo) {
      return tableInfo.columns;
    }
  }
  
  return [];
}

/**
 * 获取表索引信息
 * @param dataSourceId 数据源ID
 * @param table 表名
 * @returns 索引信息
 */
export function getMockTableIndexes(dataSourceId: string, database: string, table: string) {
  const db = mockDatabaseStructure.databases.find(db => db.name === database);
  if (!db) return [];
  
  for (const schema of db.schemas) {
    const tableInfo = schema.tables.find(t => t.name === table);
    if (tableInfo) {
      return tableInfo.indexes;
    }
  }
  
  return [];
}

/**
 * 获取表外键信息
 * @param dataSourceId 数据源ID
 * @param table 表名
 * @returns 外键信息
 */
export function getMockTableForeignKeys(dataSourceId: string, database: string, table: string) {
  const db = mockDatabaseStructure.databases.find(db => db.name === database);
  if (!db) return [];
  
  for (const schema of db.schemas) {
    const tableInfo = schema.tables.find(t => t.name === table);
    if (tableInfo) {
      return tableInfo.foreignKeys;
    }
  }
  
  return [];
}