# SQL执行引擎技术规范

## 1. 概述

SQL执行引擎是DataScope系统的核心组件，负责执行SQL查询、处理查询结果、提供元数据信息和管理查询执行过程。本文档详细说明了SQL执行引擎的设计和实现规范。

## 2. 架构设计

### 2.1 组件关系图

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  QueryFacade    │──────▶ QueryExecution  │──────▶ SqlExecution    │
│  (API层)        │      │  Service        │      │  Engine         │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                 │                        │
                                 │                        │
                                 ▼                        ▼
                          ┌─────────────────┐     ┌─────────────────┐
                          │ QueryExecution  │     │ DataSource      │
                          │ Repository      │     │ Connection      │
                          └─────────────────┘     └─────────────────┘
                                                         │
                                                         │
                                                         ▼
                                                  ┌─────────────────┐
                                                  │ Database        │
                                                  │ (MySQL/DB2)     │
                                                  └─────────────────┘
```

### 2.2 核心接口

#### 2.2.1 SqlExecutionEngine

SQL执行引擎的核心接口，负责执行SQL查询、验证SQL语句、获取元数据和估算结果行数。

```java
public interface SqlExecutionEngine {
  QueryResult execute(DataSourceId dataSourceId, String sql, Map<String, Object> parameters);

  void cancel(String executionId);

  boolean validate(DataSourceId dataSourceId, String sql);

  SqlMetadata getMetadata(DataSourceId dataSourceId, String sql);

  long estimateRowCount(DataSourceId dataSourceId, String sql);
}
```

#### 2.2.2 QueryExecutionService

查询执行服务接口，提供更高级别的查询执行功能，包括SQL查询和自然语言查询。

```java
public interface QueryExecutionService {
  QueryExecution executeSql(String dataSourceId, String sql, Map<String, Object> parameters);

  QueryExecution executeNaturalLanguage(String dataSourceId, String text);

  Optional<QueryExecution> getById(String id);

  List<QueryExecution> getRecentByUserId(String userId, int limit);

  void cancel(String id);

  String exportResult(String id, String format);
}
```

#### 2.2.3 DataSourceConnectionGateway

数据源连接网关接口，负责管理数据库连接。

```java
public interface DataSourceConnectionGateway {
  Connection getConnection(DataSource dataSource) throws SQLException;

  boolean testConnection(DataSource dataSource);

  void closeDataSource(String dataSourceId);

  void closeAllDataSources();
}
```

## 3. 数据模型

### 3.1 QueryResult

查询结果模型，包含查询结果的列定义、数据行、总行数和执行时间等信息。

```java

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueryResult {
  private List<ColumnDefinition> columns;
  private List<Map<String, Object>> rows;
  private long totalRows;
  private boolean hasMore;
  private long executionTime;
}
```

### 3.2 SqlMetadata

SQL元数据模型，包含SQL类型、表名、列定义、参数定义和聚合信息等。

```java

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SqlMetadata {
  private String sqlType;
  private List<String> tableNames;
  private List<ColumnDefinition> columns;
  private List<ParameterDefinition> parameters;
  private boolean hasAggregation;
  private boolean hasGroupBy;
  private boolean hasOrderBy;
}
```

### 3.3 ColumnDefinition

列定义模型，描述查询结果的列信息。

```java

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ColumnDefinition {
  private String name;
  private String label;
  private String dataType;
  private boolean nullable;
  private boolean autoIncrement;
  private boolean primaryKey;
}
```

### 3.4 ParameterDefinition

参数定义模型，描述SQL查询的参数信息。

```java

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParameterDefinition {
  private String name;
  private String dataType;
  private boolean required;
  private Object defaultValue;
}
```

### 3.5 QueryExecution

查询执行模型，跟踪查询执行的状态和结果。

```java

@Data
public class QueryExecution {
  private String id;
  private DataSourceId dataSourceId;
  private String sql;
  private Map<String, Object> parameters;
  private QueryExecutionStatus status;
  private LocalDateTime startTime;
  private LocalDateTime endTime;
  private Long executionTimeMs;
  private Long resultRowCount;
  private String errorMessage;
  private String userId;
  private QueryResult result;

  // 方法...
}
```

## 4. 功能规范

### 4.1 SQL查询执行

#### 4.1.1 基本流程

1. 接收SQL查询请求，包含数据源ID、SQL语句和参数
2. 验证参数有效性
3. 获取数据源连接
4. 准备SQL语句并设置参数
5. 执行查询并处理结果
6. 关闭资源并返回结果

#### 4.1.2 参数处理

支持两种类型的参数：

1. **命名参数**：使用`:paramName`语法，例如`SELECT * FROM users WHERE name = :name`
2. **位置参数**：使用`?`语法，例如`SELECT * FROM users WHERE name = ?`

参数值通过Map传递，键为参数名（命名参数）或参数索引（位置参数）。

#### 4.1.3 结果处理

1. 提取结果集元数据（列名、类型等）
2. 将结果集转换为行列结构
3. 应用分页限制（默认最大1000行）
4. 计算总行数和是否有更多数据
5. 记录执行时间

#### 4.1.4 异常处理

1. 参数验证错误：抛出IllegalArgumentException
2. 数据源不存在：抛出DataSourceException
3. SQL执行错误：抛出DataExecutionException，包含原始SQLException信息
4. 超时错误：抛出QueryTimeoutException

### 4.2 查询取消

#### 4.2.1 取消机制

1. 每个执行的查询都有唯一的执行ID
2. 活动查询的Statement对象存储在内存中
3. 取消请求通过执行ID找到对应的Statement
4. 调用Statement.cancel()方法取消查询

#### 4.2.2 超时处理

1. 设置Statement的查询超时（默认30秒）
2. 实现异步超时检查，超过时间自动取消
3. 超时取消后，更新查询执行状态为TIMEOUT

### 4.3 SQL验证

#### 4.3.1 验证方法

1. 语法验证：使用JDBC的prepareStatement方法
2. 语义验证：检查表和列是否存在（可选）
3. 权限验证：检查用户是否有权限执行查询（可选）

#### 4.3.2 验证结果

返回布尔值表示SQL是否有效，不抛出异常。

### 4.4 元数据获取

#### 4.4.1 获取方法

1. 使用JDBC的PreparedStatement.getMetaData()获取ResultSetMetaData
2. 使用PreparedStatement.getParameterMetaData()获取ParameterMetaData
3. 使用SQL解析器分析SQL类型和特性

#### 4.4.2 元数据内容

1. SQL类型（SELECT, INSERT, UPDATE, DELETE等）
2. 表名列表
3. 列定义（名称、标签、类型、是否可空等）
4. 参数定义（名称、类型、是否必需等）
5. 聚合信息（是否有聚合函数、GROUP BY、ORDER BY等）

### 4.5 行数估算

#### 4.5.1 估算方法

1. 主要方法：执行`SELECT COUNT(*) FROM (原SQL) AS count_query`
2. 备选方法：使用数据库特定的EXPLAIN或查询计划
3. 兜底方法：返回默认估计值（如1000）

#### 4.5.2 性能考虑

1. 对于简单查询，直接执行COUNT查询
2. 对于复杂查询，使用EXPLAIN或查询计划
3. 设置COUNT查询的超时时间（较短）
4. 缓存估算结果（短时间内）

## 5. 性能规范

### 5.1 连接管理

1. 使用连接池管理数据库连接
2. 连接池配置：

- 最小空闲连接：5
- 最大连接数：20（每个数据源）
- 连接超时：30秒
- 空闲超时：10分钟
- 最大生命周期：30分钟

### 5.2 查询限制

1. 默认查询超时：30秒
2. 最大结果行数：1000行（分页查询）
3. 最大并发查询数：20（全局）
4. 用户查询频率限制：每分钟10次

### 5.3 缓存策略

1. 查询结果缓存：

- 缓存时间：5分钟
- 最大缓存条目：100
- 缓存键：数据源ID + SQL + 参数哈希

2. 元数据缓存：

- 缓存时间：30分钟
- 最大缓存条目：500
- 缓存键：数据源ID + SQL哈希

### 5.4 资源管理

1. 结果集处理：流式处理大结果集
2. 内存使用：限制单个查询的内存使用
3. 线程池：使用专用线程池执行查询
4. 监控：记录查询执行时间和资源使用情况

## 6. 安全规范

### 6.1 SQL注入防护

1. 使用参数化查询（PreparedStatement）
2. 验证SQL语句，禁止危险操作（如DROP TABLE）
3. 使用白名单过滤SQL关键字
4. 限制查询权限（只读操作）

### 6.2 数据访问控制

1. 验证用户对数据源的访问权限
2. 实现行级和列级访问控制（可选）
3. 敏感数据掩码（与DataMasker集成）
4. 审计日志记录所有查询操作

### 6.3 资源保护

1. 查询频率限制
2. 查询复杂度限制
3. 结果集大小限制
4. 查询超时机制

## 7. 错误处理

### 7.1 异常类型

1. **DataSourceException**：数据源相关错误
2. **DataExecutionException**：SQL执行错误
3. **QueryTimeoutException**：查询超时错误
4. **ValidationException**：SQL验证错误
5. **PermissionException**：权限错误

### 7.2 错误响应

1. 错误代码：唯一标识错误类型
2. 错误消息：用户友好的错误描述
3. 技术详情：详细的技术错误信息（仅开发环境）
4. 建议操作：如何解决错误的建议

### 7.3 错误日志

1. 记录所有错误到日志系统
2. 日志级别：ERROR（异常）、WARN（警告）、INFO（信息）
3. 日志内容：时间、用户、数据源、SQL、错误信息、堆栈跟踪
4. 敏感信息处理：掩码敏感数据

## 8. 测试规范

### 8.1 单元测试

1. 测试覆盖率目标：>80%
2. 测试框架：JUnit 5 + Mockito
3. 测试范围：所有公共方法
4. 测试场景：正常流程、边界条件、异常情况

### 8.2 集成测试

1. 测试环境：使用测试数据库（H2或Docker容器）
2. 测试数据：预定义的测试数据集
3. 测试范围：端到端流程
4. 测试场景：复杂查询、并发查询、大数据量查询

### 8.3 性能测试

1. 测试工具：JMeter
2. 测试指标：响应时间、吞吐量、错误率
3. 测试场景：高并发、大数据量、长时间运行
4. 基准要求：

- 简单查询响应时间 < 100ms
- 复杂查询响应时间 < 1s
- 并发查询吞吐量 > 50 QPS

## 9. 实现计划

### 9.1 第一阶段：基础功能

1. 实现SqlExecutionEngineImpl的核心方法
2. 实现基本的查询执行和结果处理
3. 实现查询取消和验证功能
4. 添加单元测试和基本集成测试

### 9.2 第二阶段：高级功能

1. 实现元数据获取和行数估算
2. 实现查询结果缓存
3. 实现查询超时和资源限制
4. 增强安全功能和错误处理

### 9.3 第三阶段：优化和扩展

1. 性能优化和基准测试
2. 实现高级查询功能（分页、排序、过滤）
3. 实现结果导出功能
4. 完善文档和示例

## 10. 依赖项

1. **Spring Framework**：依赖注入和事务管理
2. **JDBC**：数据库连接和操作
3. **HikariCP**：连接池管理
4. **JSqlParser**：SQL解析和验证
5. **Jackson**：JSON处理
6. **Redis**：缓存管理（可选）
7. **Lombok**：代码简化
8. **SLF4J**：日志记录
