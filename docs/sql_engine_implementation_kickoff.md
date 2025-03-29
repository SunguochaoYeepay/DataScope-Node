# SQL执行引擎实施启动

本文档提供了SQL执行引擎实施的启动步骤和初始代码片段，以便开发团队可以立即开始实施。

## 1. 立即开始的任务

### 1.1 创建DataExecutionException类

首先，创建一个新的异常类来处理SQL执行过程中的错误：

```java
package com.datascope.domain.query.exception;

/**
 * 数据执行异常，用于处理SQL执行过程中的错误
 */
public class DataExecutionException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  public DataExecutionException(String message) {
    super(message);
  }

  public DataExecutionException(String message, Throwable cause) {
    super(message, cause);
  }
}
```

**文件路径**：`data-scope-domain/src/main/java/com/datascope/domain/query/exception/DataExecutionException.java`

### 1.2 更新SqlExecutionEngineImpl类的基础结构

更新`SqlExecutionEngineImpl`类，添加必要的依赖注入：

```java
package com.datascope.domain.query.service.impl;

import com.datascope.domain.datasource.entity.DataSource;
import com.datascope.domain.datasource.gateway.DataSourceConnectionGateway;
import com.datascope.domain.datasource.model.DataSourceId;
import com.datascope.domain.datasource.repository.DataSourceRepository;
import com.datascope.domain.query.exception.DataExecutionException;
import com.datascope.domain.query.model.ColumnDefinition;
import com.datascope.domain.query.model.QueryResult;
import com.datascope.domain.query.model.SqlMetadata;
import com.datascope.domain.query.service.SqlExecutionEngine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * SQL执行引擎实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SqlExecutionEngineImpl implements SqlExecutionEngine {

  private final DataSourceRepository dataSourceRepository;
  private final DataSourceConnectionGateway connectionGateway;

  // 用于存储正在执行的查询，以支持取消操作
  private final Map<String, Statement> activeStatements = new ConcurrentHashMap<>();

  @Override
  public QueryResult execute(DataSourceId dataSourceId, String sql, Map<String, Object> parameters) {
    // TODO: 实现SQL查询执行逻辑
    return null;
  }

  @Override
  public void cancel(String executionId) {
    // TODO: 实现取消正在执行的查询逻辑
  }

  @Override
  public boolean validate(DataSourceId dataSourceId, String sql) {
    // TODO: 实现SQL语句验证逻辑
    return false;
  }

  @Override
  public SqlMetadata getMetadata(DataSourceId dataSourceId, String sql) {
    // TODO: 实现获取SQL语句元数据逻辑
    return null;
  }

  @Override
  public long estimateRowCount(DataSourceId dataSourceId, String sql) {
    // TODO: 实现估算查询结果行数逻辑
    return 0;
  }
}
```

**文件路径**：`data-scope-domain/src/main/java/com/datascope/domain/query/service/impl/SqlExecutionEngineImpl.java`

### 1.3 实现execute方法

接下来，实现`execute`方法：

```java

@Override
public QueryResult execute(DataSourceId dataSourceId, String sql, Map<String, Object> parameters) {
  // 参数验证
  if (dataSourceId == null || sql == null || sql.trim().isEmpty()) {
    throw new IllegalArgumentException("DataSourceId and SQL must not be null or empty");
  }

  log.debug("Executing SQL query on dataSource: {}, SQL: {}, Parameters: {}",
    dataSourceId, sql, parameters);

  // 获取数据源
  DataSource dataSource = dataSourceRepository.findById(dataSourceId.getValue())
    .orElseThrow(() -> new DataExecutionException("Data source not found: " + dataSourceId));

  // 创建查询结果对象
  QueryResult result = new QueryResult();
  long startTime = System.currentTimeMillis();

  Connection connection = null;
  PreparedStatement stmt = null;
  ResultSet rs = null;

  try {
    // 获取数据库连接
    connection = connectionGateway.getConnection(dataSource);

    // 准备语句
    stmt = connection.prepareStatement(sql);

    // 设置查询参数
    if (parameters != null && !parameters.isEmpty()) {
      setParameters(stmt, parameters);
    }

    // 生成唯一的执行ID
    String executionId = UUID.randomUUID().toString();

    // 存储语句以支持取消操作
    activeStatements.put(executionId, stmt);

    try {
      // 执行查询
      boolean isQuery = stmt.execute();

      if (isQuery) {
        // 处理查询结果
        rs = stmt.getResultSet();
        result = processResultSet(rs);
      } else {
        // 处理更新结果
        int updateCount = stmt.getUpdateCount();
        result.setTotalRows(updateCount);
      }
    } finally {
      // 从活动语句映射中移除
      activeStatements.remove(executionId);
    }
  } catch (SQLException e) {
    log.error("SQL execution failed: {}", e.getMessage(), e);
    throw new DataExecutionException("SQL execution failed: " + e.getMessage(), e);
  } finally {
    // 关闭资源
    closeResources(rs, stmt);

    // 设置执行时间
    long endTime = System.currentTimeMillis();
    result.setExecutionTime(endTime - startTime);

    log.debug("SQL execution completed in {}ms, rows: {}",
      result.getExecutionTime(), result.getTotalRows());
  }

  return result;
}

private void setParameters(PreparedStatement stmt, Map<String, Object> parameters) throws SQLException {
  // 处理位置参数（假设参数按顺序排列）
  int paramIndex = 1;
  for (Object value : parameters.values()) {
    setParameter(stmt, paramIndex++, value);
  }
}

private void setParameter(PreparedStatement stmt, int index, Object value) throws SQLException {
  if (value == null) {
    stmt.setNull(index, Types.NULL);
  } else if (value instanceof String) {
    stmt.setString(index, (String) value);
  } else if (value instanceof Integer) {
    stmt.setInt(index, (Integer) value);
  } else if (value instanceof Long) {
    stmt.setLong(index, (Long) value);
  } else if (value instanceof Double) {
    stmt.setDouble(index, (Double) value);
  } else if (value instanceof Boolean) {
    stmt.setBoolean(index, (Boolean) value);
  } else if (value instanceof Date) {
    stmt.setTimestamp(index, new Timestamp(((Date) value).getTime()));
  } else if (value instanceof java.time.LocalDate) {
    stmt.setDate(index, Date.valueOf((java.time.LocalDate) value));
  } else if (value instanceof java.time.LocalDateTime) {
    stmt.setTimestamp(index, Timestamp.valueOf((java.time.LocalDateTime) value));
  } else {
    stmt.setObject(index, value);
  }
}

private QueryResult processResultSet(ResultSet rs) throws SQLException {
  QueryResult result = new QueryResult();

  // 获取结果集元数据
  ResultSetMetaData metaData = rs.getMetaData();
  int columnCount = metaData.getColumnCount();

  // 设置列定义
  List<ColumnDefinition> columns = new ArrayList<>();
  for (int i = 1; i <= columnCount; i++) {
    ColumnDefinition column = ColumnDefinition.builder()
      .name(metaData.getColumnName(i))
      .label(metaData.getColumnLabel(i))
      .dataType(metaData.getColumnTypeName(i))
      .nullable(metaData.isNullable(i) == ResultSetMetaData.columnNullable)
      .autoIncrement(metaData.isAutoIncrement(i))
      .build();
    columns.add(column);
  }
  result.setColumns(columns);

  // 处理数据行
  List<Map<String, Object>> rows = new ArrayList<>();
  long rowCount = 0;

  // 设置最大行数限制，防止内存溢出
  final int MAX_ROWS = 1000;
  boolean hasMore = false;

  while (rs.next()) {
    rowCount++;

    // 检查是否达到最大行数限制
    if (rowCount > MAX_ROWS) {
      hasMore = true;
      break;
    }

    Map<String, Object> row = new HashMap<>();
    for (int i = 1; i <= columnCount; i++) {
      String columnName = metaData.getColumnName(i);
      Object value = rs.getObject(i);
      row.put(columnName, value);
    }
    rows.add(row);
  }

  result.setRows(rows);
  result.setTotalRows(rowCount);
  result.setHasMore(hasMore);

  return result;
}

private void closeResources(ResultSet rs, Statement stmt) {
  if (rs != null) {
    try {
      rs.close();
    } catch (SQLException e) {
      log.warn("Failed to close ResultSet: {}", e.getMessage());
    }
  }

  if (stmt != null) {
    try {
      stmt.close();
    } catch (SQLException e) {
      log.warn("Failed to close Statement: {}", e.getMessage());
    }
  }

  // 注意：不关闭连接，而是将其返回到连接池
}
```

## 2. 单元测试启动

为了开始测试，创建一个基本的单元测试类：

```java
package com.datascope.domain.query.service.impl;

import com.datascope.domain.datasource.entity.DataSource;
import com.datascope.domain.datasource.gateway.DataSourceConnectionGateway;
import com.datascope.domain.datasource.model.DataSourceId;
import com.datascope.domain.datasource.repository.DataSourceRepository;
import com.datascope.domain.query.exception.DataExecutionException;
import com.datascope.domain.query.model.QueryResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.*;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SqlExecutionEngineImplTest {

  @Mock
  private DataSourceRepository dataSourceRepository;

  @Mock
  private DataSourceConnectionGateway connectionGateway;

  @InjectMocks
  private SqlExecutionEngineImpl sqlExecutionEngine;

  @Mock
  private Connection connection;

  @Mock
  private PreparedStatement statement;

  @Mock
  private ResultSet resultSet;

  @Mock
  private ResultSetMetaData resultSetMetaData;

  private DataSource dataSource;
  private DataSourceId dataSourceId;

  @BeforeEach
  void setUp() {
    dataSource = new DataSource();
    dataSource.setId("test-ds-id");
    dataSource.setName("Test DataSource");

    dataSourceId = DataSourceId.of("test-ds-id");
  }

  @Test
  void testExecuteQuery() throws SQLException {
    // 准备测试数据
    String sql = "SELECT * FROM test_table";
    Map<String, Object> parameters = Map.of("param1", "value1");

    // 设置模拟行为
    when(dataSourceRepository.findById(dataSourceId.getValue())).thenReturn(Optional.of(dataSource));
    when(connectionGateway.getConnection(dataSource)).thenReturn(connection);
    when(connection.prepareStatement(sql)).thenReturn(statement);
    when(statement.execute()).thenReturn(true);
    when(statement.getResultSet()).thenReturn(resultSet);
    when(resultSet.getMetaData()).thenReturn(resultSetMetaData);
    when(resultSetMetaData.getColumnCount()).thenReturn(2);
    when(resultSetMetaData.getColumnName(1)).thenReturn("id");
    when(resultSetMetaData.getColumnLabel(1)).thenReturn("ID");
    when(resultSetMetaData.getColumnTypeName(1)).thenReturn("INTEGER");
    when(resultSetMetaData.getColumnName(2)).thenReturn("name");
    when(resultSetMetaData.getColumnLabel(2)).thenReturn("NAME");
    when(resultSetMetaData.getColumnTypeName(2)).thenReturn("VARCHAR");

    // 模拟结果集数据
    when(resultSet.next()).thenReturn(true, true, false);
    when(resultSet.getObject(1)).thenReturn(1, 2);
    when(resultSet.getObject(2)).thenReturn("Test1", "Test2");

    // 执行测试
    QueryResult result = sqlExecutionEngine.execute(dataSourceId, sql, parameters);

    // 验证结果
    assertNotNull(result);
    assertEquals(2, result.getColumns().size());
    assertEquals(2, result.getRows().size());
    assertEquals("id", result.getColumns().get(0).getName());
    assertEquals("name", result.getColumns().get(1).getName());
    assertEquals(1, result.getRows().get(0).get("id"));
    assertEquals("Test1", result.getRows().get(0).get("name"));
    assertEquals(2, result.getRows().get(1).get("id"));
    assertEquals("Test2", result.getRows().get(1).get("name"));
    assertEquals(2, result.getTotalRows());
    assertFalse(result.isHasMore());

    // 验证交互
    verify(dataSourceRepository).findById(dataSourceId.getValue());
    verify(connectionGateway).getConnection(dataSource);
    verify(connection).prepareStatement(sql);
    verify(statement).execute();
    verify(resultSet, times(3)).next();
  }
}
```

**文件路径**：`data-scope-domain/src/test/java/com/datascope/domain/query/service/impl/SqlExecutionEngineImplTest.java`

## 3. 实施步骤

1. **创建异常类**

- 创建DataExecutionException类
- 确保包路径正确

2. **更新SqlExecutionEngineImpl类**

- 添加依赖注入
- 添加activeStatements映射
- 添加日志支持

3. **实现execute方法**

- 实现参数验证
- 实现数据源获取
- 实现SQL执行
- 实现结果处理
- 实现资源关闭

4. **实现辅助方法**

- 实现setParameters方法
- 实现setParameter方法
- 实现processResultSet方法
- 实现closeResources方法

5. **创建单元测试**

- 设置测试环境
- 实现基本测试用例

## 4. 注意事项

1. **依赖注入**

- 确保DataSourceRepository和DataSourceConnectionGateway已正确实现
- 使用@RequiredArgsConstructor进行构造函数注入

2. **异常处理**

- 使用DataExecutionException包装SQL异常
- 记录详细的错误信息

3. **资源管理**

- 确保在finally块中关闭ResultSet和Statement
- 不要关闭Connection，而是将其返回到连接池

4. **日志记录**

- 使用适当的日志级别记录执行信息
- 记录SQL执行时间和结果行数

5. **安全考虑**

- 使用参数化查询防止SQL注入
- 不要在日志中记录敏感信息

## 5. 下一步行动

1. 完成上述代码的实现
2. 运行单元测试并修复问题
3. 实现cancel方法
4. 实现validate方法
5. 更新实施跟踪文档
