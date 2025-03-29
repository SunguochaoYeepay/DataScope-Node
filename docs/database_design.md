> **Note**: This document is deprecated. Please use the updated version at [Database Design](database_design.md).

# DataScope 数据库设计

## 数据源管理相关表

### tbl_data_source（数据源表）

| 字段名                | 类型       | 长度  | 允许空 | 默认值      | 说明               |
|--------------------|----------|-----|-----|----------|------------------|
| id                 | varchar  | 36  | 否   |          | 主键UUID           |
| name               | varchar  | 100 | 否   |          | 数据源名称            |
| description        | varchar  | 500 | 是   |          | 数据源描述            |
| type               | varchar  | 20  | 否   |          | 数据源类型(MYSQL/DB2) |
| host               | varchar  | 100 | 否   |          | 数据库主机            |
| port               | int      |     | 否   |          | 数据库端口            |
| database_name      | varchar  | 100 | 否   |          | 数据库名称            |
| username           | varchar  | 100 | 否   |          | 数据库用户名           |
| password_encrypted | varchar  | 500 | 否   |          | 加密后的密码           |
| password_salt      | varchar  | 36  | 否   |          | 密码加密盐值           |
| connection_params  | text     |     | 是   |          | 额外连接参数(JSON)     |
| status             | varchar  | 20  | 否   | INACTIVE | 连接状态             |
| sync_frequency     | varchar  | 100 | 是   |          | 同步调度Cron表达式      |
| last_sync_time     | datetime |     | 是   |          | 最后同步时间           |
| nonce              | int      |     | 否   | 0        | 乐观锁版本号           |
| created_time       | datetime |     | 否   |          | 创建时间             |
| created_by         | varchar  | 100 | 否   |          | 创建人              |
| modified_time      | datetime |     | 否   |          | 最后修改时间           |
| modified_by        | varchar  | 100 | 否   |          | 最后修改人            |

索引：

- u_idx_data_source_name (name)

### tbl_metadata_sync_history（元数据同步历史表）

| 字段名            | 类型       | 长度  | 允许空 | 默认值 | 说明                   |
|----------------|----------|-----|-----|-----|----------------------|
| id             | varchar  | 36  | 否   |     | 主键UUID               |
| data_source_id | varchar  | 36  | 否   |     | 数据源ID                |
| sync_type      | varchar  | 20  | 否   |     | 同步类型(FULL/INCREMENT) |
| status         | varchar  | 20  | 否   |     | 同步状态                 |
| start_time     | datetime |     | 否   |     | 开始时间                 |
| end_time       | datetime |     | 是   |     | 结束时间                 |
| error_message  | text     |     | 是   |     | 错误信息                 |
| created_time   | datetime |     | 否   |     | 创建时间                 |
| created_by     | varchar  | 100 | 否   |     | 创建人                  |

索引：

- idx_sync_history_ds_id (data_source_id)
- idx_sync_history_start_time (start_time)

### tbl_table_metadata（表元数据）

| 字段名            | 类型       | 长度  | 允许空 | 默认值 | 说明     |
|----------------|----------|-----|-----|-----|--------|
| id             | varchar  | 36  | 否   |     | 主键UUID |
| data_source_id | varchar  | 36  | 否   |     | 数据源ID  |
| table_name     | varchar  | 100 | 否   |     | 表名     |
| table_type     | varchar  | 20  | 否   |     | 表类型    |
| description    | varchar  | 500 | 是   |     | 表描述    |
| nonce          | int      |     | 否   | 0   | 乐观锁版本号 |
| created_time   | datetime |     | 否   |     | 创建时间   |
| created_by     | varchar  | 100 | 否   |     | 创建人    |
| modified_time  | datetime |     | 否   |     | 最后修改时间 |
| modified_by    | varchar  | 100 | 否   |     | 最后修改人  |

索引：

- u_idx_table_metadata_ds_name (data_source_id, table_name)

### tbl_column_metadata（列元数据）

| 字段名               | 类型       | 长度  | 允许空 | 默认值 | 说明     |
|-------------------|----------|-----|-----|-----|--------|
| id                | varchar  | 36  | 否   |     | 主键UUID |
| table_metadata_id | varchar  | 36  | 否   |     | 表元数据ID |
| column_name       | varchar  | 100 | 否   |     | 列名     |
| data_type         | varchar  | 50  | 否   |     | 数据类型   |
| column_size       | int      |     | 是   |     | 列大小    |
| decimal_digits    | int      |     | 是   |     | 小数位数   |
| nullable          | boolean  |     | 否   |     | 是否可空   |
| default_value     | varchar  | 100 | 是   |     | 默认值    |
| description       | varchar  | 500 | 是   |     | 列描述    |
| nonce             | int      |     | 否   | 0   | 乐观锁版本号 |
| created_time      | datetime |     | 否   |     | 创建时间   |
| created_by        | varchar  | 100 | 否   |     | 创建人    |
| modified_time     | datetime |     | 否   |     | 最后修改时间 |
| modified_by       | varchar  | 100 | 否   |     | 最后修改人  |

索引：

- u_idx_column_metadata_table_name (table_metadata_id, column_name)

### tbl_table_relation（表关系）

| 字段名             | 类型       | 长度  | 允许空 | 默认值 | 说明           |
|-----------------|----------|-----|-----|-----|--------------|
| id              | varchar  | 36  | 否   |     | 主键UUID       |
| source_table_id | varchar  | 36  | 否   |     | 源表ID         |
| target_table_id | varchar  | 36  | 否   |     | 目标表ID        |
| relation_type   | varchar  | 20  | 否   |     | 关系类型         |
| confidence      | decimal  | 5,2 | 否   |     | 置信度          |
| source_columns  | varchar  | 500 | 否   |     | 源表关联列(JSON)  |
| target_columns  | varchar  | 500 | 否   |     | 目标表关联列(JSON) |
| nonce           | int      |     | 否   | 0   | 乐观锁版本号       |
| created_time    | datetime |     | 否   |     | 创建时间         |
| created_by      | varchar  | 100 | 否   |     | 创建人          |
| modified_time   | datetime |     | 否   |     | 最后修改时间       |
| modified_by     | varchar  | 100 | 否   |     | 最后修改人        |

索引：

- idx_table_relation_source (source_table_id)
- idx_table_relation_target (target_table_id)

## 查询管理相关表

### tbl_query_history（查询历史）

| 字段名            | 类型       | 长度  | 允许空 | 默认值 | 说明           |
|----------------|----------|-----|-----|-----|--------------|
| id             | varchar  | 36  | 否   |     | 主键UUID       |
| data_source_id | varchar  | 36  | 否   |     | 数据源ID        |
| query_type     | varchar  | 20  | 否   |     | 查询类型(SQL/NL) |
| query_text     | text     |     | 否   |     | 查询文本         |
| generated_sql  | text     |     | 是   |     | 生成的SQL       |
| execution_time | int      |     | 否   |     | 执行时间(ms)     |
| row_count      | int      |     | 否   |     | 结果行数         |
| status         | varchar  | 20  | 否   |     | 执行状态         |
| error_message  | text     |     | 是   |     | 错误信息         |
| created_time   | datetime |     | 否   |     | 创建时间         |
| created_by     | varchar  | 100 | 否   |     | 创建人          |

索引：

- idx_query_history_ds_id (data_source_id)
- idx_query_history_created_by (created_by)
- idx_query_history_created_time (created_time)

### tbl_query_favorite（查询收藏）

| 字段名            | 类型       | 长度  | 允许空 | 默认值 | 说明     |
|----------------|----------|-----|-----|-----|--------|
| id             | varchar  | 36  | 否   |     | 主键UUID |
| name           | varchar  | 100 | 否   |     | 收藏名称   |
| data_source_id | varchar  | 36  | 否   |     | 数据源ID  |
| query_type     | varchar  | 20  | 否   |     | 查询类型   |
| query_text     | text     |     | 否   |     | 查询文本   |
| description    | varchar  | 500 | 是   |     | 描述     |
| nonce          | int      |     | 否   | 0   | 乐观锁版本号 |
| created_time   | datetime |     | 否   |     | 创建时间   |
| created_by     | varchar  | 100 | 否   |     | 创建人    |
| modified_time  | datetime |     | 否   |     | 最后修改时间 |
| modified_by    | varchar  | 100 | 否   |     | 最后修改人  |

索引：

- u_idx_query_favorite_name_user (name, created_by)
- idx_query_favorite_ds_id (data_source_id)

### tbl_query_config（查询配置）

| 字段名              | 类型       | 长度  | 允许空 | 默认值   | 说明         |
|------------------|----------|-----|-----|-------|------------|
| id               | varchar  | 36  | 否   |       | 主键UUID     |
| name             | varchar  | 100 | 否   |       | 配置名称       |
| data_source_id   | varchar  | 36  | 否   |       | 数据源ID      |
| query_type       | varchar  | 20  | 否   |       | 查询类型       |
| query_text       | text     |     | 否   |       | 查询文本       |
| condition_config | text     |     | 否   |       | 条件配置(JSON) |
| display_config   | text     |     | 否   |       | 显示配置(JSON) |
| version          | int      |     | 否   | 1     | 版本号        |
| status           | varchar  | 20  | 否   | DRAFT | 状态         |
| description      | varchar  | 500 | 是   |       | 描述         |
| nonce            | int      |     | 否   | 0     | 乐观锁版本号     |
| created_time     | datetime |     | 否   |       | 创建时间       |
| created_by       | varchar  | 100 | 否   |       | 创建人        |
| modified_time    | datetime |     | 否   |       | 最后修改时间     |
| modified_by      | varchar  | 100 | 否   |       | 最后修改人      |

索引：

- u_idx_query_config_name_version (name, version)
- idx_query_config_ds_id (data_source_id)
- idx_query_config_status (status)

### tbl_user_preference（用户偏好设置）

| 字段名              | 类型       | 长度  | 允许空 | 默认值 | 说明        |
|------------------|----------|-----|-----|-----|-----------|
| id               | varchar  | 36  | 否   |     | 主键UUID    |
| user_id          | varchar  | 100 | 否   |     | 用户ID      |
| preference_type  | varchar  | 50  | 否   |     | 偏好类型      |
| preference_key   | varchar  | 100 | 否   |     | 偏好键       |
| preference_value | text     |     | 否   |     | 偏好值(JSON) |
| nonce            | int      |     | 否   | 0   | 乐观锁版本号    |
| created_time     | datetime |     | 否   |     | 创建时间      |
| created_by       | varchar  | 100 | 否   |     | 创建人       |
| modified_time    | datetime |     | 否   |     | 最后修改时间    |
| modified_by      | varchar  | 100 | 否   |     | 最后修改人     |

索引：

- u_idx_user_preference_type_key (user_id, preference_type, preference_key)
