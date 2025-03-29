# SQL执行引擎实施指南

本文档提供了SQL执行引擎实施的详细步骤和代码示例，作为开发团队的实施参考。

## 1. 实施SqlExecutionEngineImpl的execute方法

### 步骤1: 更新类依赖

首先，更新`SqlExecutionEngineImpl`类，添加必要的依赖注入：

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

  // 其他方法实现...
}
```

### 步骤2: 实现execute方法

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
```

### 步骤3: 实现辅助方法

添加处理参数和结果集的辅助方法：

```java
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

## 2. 实施SqlExecutionEngineImpl的cancel方法

```java

@Override
public void cancel(String executionId) {
  Statement stmt = activeStatements.get(executionId);
  if (stmt != null) {
    try {
      log.debug("Cancelling query execution: {}", executionId);
      stmt.cancel();
    } catch (SQLException e) {
      log.error("Failed to cancel query: {}", e.getMessage(), e);
      throw new DataExecutionException("Failed to cancel query: " + e.getMessage(), e);
    }
  } else {
    log.warn("No active statement found for execution ID: {}", executionId);
  }
}
```

## 3. 实施SqlExecutionEngineImpl的validate方法

```java

@Override
public boolean validate(DataSourceId dataSourceId, String sql) {
  if (dataSourceId == null || sql == null || sql.trim().isEmpty()) {
    return false;
  }

  log.debug("Validating SQL on dataSource: {}, SQL: {}", dataSourceId, sql);

  // 获取数据源
  DataSource dataSource = dataSourceRepository.findById(dataSourceId.getValue())
    .orElseThrow(() -> new DataExecutionException("Data source not found: " + dataSourceId));

  Connection connection = null;
  PreparedStatement stmt = null;

  try {
    // 获取数据库连接
    connection = connectionGateway.getConnection(dataSource);

    // 使用JDBC的prepareStatement方法来验证SQL语法
    // 注意：这只会验证SQL语法，不会执行SQL
    stmt = connection.prepareStatement(sql);
    return true;
  } catch (SQLException e) {
    log.debug("SQL validation failed: {}", e.getMessage());
    // SQL语法错误
    return false;
  } finally {
    // 关闭资源
    if (stmt != null) {
      try {
        stmt.close();
      } catch (SQLException e) {
        log.warn("Failed to close Statement: {}", e.getMessage());
      }
    }
    // 不关闭连接，而是将其返回到连接池
  }
}
```

## 4. 实施SqlExecutionEngineImpl的getMetadata方法

```java

@Override
public SqlMetadata getMetadata(DataSourceId dataSourceId, String sql) {
  if (dataSourceId == null || sql == null || sql.trim().isEmpty()) {
    throw new IllegalArgumentException("DataSourceId and SQL must not be null or empty");
  }

  log.debug("Getting metadata for SQL on dataSource: {}, SQL: {}", dataSourceId, sql);

  // 获取数据源
  DataSource dataSource = dataSourceRepository.findById(dataSourceId.getValue())
    .orElseThrow(() -> new DataExecutionException("Data source not found: " + dataSourceId));

  Connection connection = null;
  PreparedStatement stmt = null;
  ResultSet rs = null;

  try {
    // 获取数据库连接
    connection = connectionGateway.getConnection(dataSource);

    // 准备语句但不执行
    stmt = connection.prepareStatement(sql);

    // 获取元数据
    ResultSetMetaData metaData = stmt.getMetaData();

    if (metaData == null) {
      // 如果是非查询SQL，可能无法获取元数据
      return SqlMetadata.builder()
        .sqlType(determineSqlType(sql))
        .tableNames(extractTableNames(sql))
        .build();
    }

    // 提取列定义
    int columnCount = metaData.getColumnCount();
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

    // 分析SQL类型和特性
    String sqlType = determineSqlType(sql);
    List<String> tableNames = extractTableNames(sql);
    boolean hasAggregation = checkForAggregation(sql);
    boolean hasGroupBy = sql.toUpperCase().contains("GROUP BY");
    boolean hasOrderBy = sql.toUpperCase().contains("ORDER BY");

    return SqlMetadata.builder()
      .sqlType(sqlType)
      .tableNames(tableNames)
      .columns(columns)
      .hasAggregation(hasAggregation)
      .hasGroupBy(hasGroupBy)
      .hasOrderBy(hasOrderBy)
      .build();
  } catch (SQLException e) {
    log.error("Failed to get SQL metadata: {}", e.getMessage(), e);
    throw new DataExecutionException("Failed to get SQL metadata: " + e.getMessage(), e);
  } finally {
    // 关闭资源
    closeResources(rs, stmt);
  }
}

private String determineSqlType(String sql) {
  String upperSql = sql.trim().toUpperCase();
  if (upperSql.startsWith("SELECT")) return "SELECT";
  if (upperSql.startsWith("INSERT")) return "INSERT";
  if (upperSql.startsWith("UPDATE")) return "UPDATE";
  if (upperSql.startsWith("DELETE")) return "DELETE";
  if (upperSql.startsWith("CREATE")) return "CREATE";
  if (upperSql.startsWith("ALTER")) return "ALTER";
  if (upperSql.startsWith("DROP")) return "DROP";
  return "UNKNOWN";
}

private List<String> extractTableNames(String sql) {
  // 简单实现，实际项目中可能需要使用SQL解析器
  List<String> tableNames = new ArrayList<>();

  // 这是一个非常简化的实现，仅用于演示
  // 实际项目中应该使用SQL解析器库
  String upperSql = sql.toUpperCase();
  int fromIndex = upperSql.indexOf("FROM ");

  if (fromIndex >= 0) {
    String fromClause = upperSql.substring(fromIndex + 5);
    int whereIndex = fromClause.indexOf(" WHERE ");
    if (whereIndex >= 0) {
      fromClause = fromClause.substring(0, whereIndex);
    }

    String[] tables = fromClause.split(",");
    for (String table : tables) {
      String tableName = table.trim();
      int asIndex = tableName.indexOf(" AS ");
      if (asIndex >= 0) {
        tableName = tableName.substring(0, asIndex).trim();
      }

      tableNames.add(tableName);
    }
  }

  return tableNames;
}

private boolean checkForAggregation(String sql) {
  String upperSql = sql.toUpperCase();
  return upperSql.contains("COUNT(") ||
    upperSql.contains("SUM(") ||
    upperSql.contains("AVG(") ||
    upperSql.contains("MIN(") ||
    upperSql.contains("MAX(");
}
```

## 5. 实施SqlExecutionEngineImpl的estimateRowCount方法

```java

@Override
public long estimateRowCount(DataSourceId dataSourceId, String sql) {
  if (dataSourceId == null || sql == null || sql.trim().isEmpty()) {
    throw new IllegalArgumentException("DataSourceId and SQL must not be null or empty");
  }

  // 只处理SELECT查询
  if (!sql.trim().toUpperCase().startsWith("SELECT")) {
    return 0;
  }

  log.debug("Estimating row count for SQL on dataSource: {}, SQL: {}", dataSourceId, sql);

  // 获取数据源
  DataSource dataSource = dataSourceRepository.findById(dataSourceId.getValue())
    .orElseThrow(() -> new DataExecutionException("Data source not found: " + dataSourceId));

  Connection connection = null;
  PreparedStatement stmt = null;
  ResultSet rs = null;

  try {
    // 获取数据库连接
    connection = connectionGateway.getConnection(dataSource);

    // 构建COUNT查询
    String countSql = buildCountQuery(sql);

    // 执行COUNT查询
    stmt = connection.prepareStatement(countSql);
    rs = stmt.executeQuery();

    if (rs.next()) {
      return rs.getLong(1);
    }

    return 0;
  } catch (SQLException e) {
    log.warn("Failed to estimate row count: {}", e.getMessage());
    // 如果COUNT查询失败，使用替代方法
    return estimateRowCountAlternative(dataSource, sql);
  } finally {
    // 关闭资源
    closeResources(rs, stmt);
  }
}

private String buildCountQuery(String sql) {
  // 简单实现，实际项目中可能需要使用SQL解析器
  return "SELECT COUNT(*) FROM (" + sql + ") AS count_query";
}

private long estimateRowCountAlternative(DataSource dataSource, String sql) {
  // 替代方法：执行EXPLAIN或查询计划
  // 这是一个简化的实现，实际项目中需要根据数据库类型进行适配
  log.debug("Using alternative method to estimate row count");
  return 1000; // 返回一个默认估计值
}
```

## 6. 创建DataExecutionException类

创建一个新的异常类来处理SQL执行过程中的错误：

```java
package com.datascope.domain.query.exception;

/**
 * 数据执行异常
 */
public class DataExecutionException extends RuntimeException {

  public DataExecutionException(String message) {
    super(message);
  }

  public DataExecutionException(String message, Throwable cause) {
    super(message, cause);
  }
}
```

## 7. 单元测试

为SqlExecutionEngineImpl创建单元测试：

```java
package com.datascope.domain.query.service.impl;

import com.datascope.domain.datasource.entity.DataSource;
import com.datascope.domain.datasource.gateway.DataSourceConnectionGateway;
import com.datascope.domain.datasource.model.DataSourceId;
import com.datascope.domain.datasource.repository.DataSourceRepository;
import com.datascope.domain.query.exception.DataExecutionException;
import com.datascope.domain.query.model.QueryResult;
import com.datascope.domain.query.model.SqlMetadata;
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

  @Test
  void testExecuteUpdate() throws SQLException {
    // 准备测试数据
    String sql = "UPDATE test_table SET name = 'Updated' WHERE id = 1";
    Map<String, Object> parameters = Map.of();

    // 设置模拟行为
    when(dataSourceRepository.findById(dataSourceId.getValue())).thenReturn(Optional.of(dataSource));
    when(connectionGateway.getConnection(dataSource)).thenReturn(connection);
    when(connection.prepareStatement(sql)).thenReturn(statement);
    when(statement.execute()).thenReturn(false);
    when(statement.getUpdateCount()).thenReturn(1);

    // 执行测试
    QueryResult result = sqlExecutionEngine.execute(dataSourceId, sql, parameters);

    // 验证结果
    assertNotNull(result);
    assertEquals(1, result.getTotalRows());

    // 验证交互
    verify(dataSourceRepository).findById(dataSourceId.getValue());
    verify(connectionGateway).getConnection(dataSource);
    verify(connection).prepareStatement(sql);
    verify(statement).execute();
    verify(statement).getUpdateCount();
  }

  @Test
  void testExecuteQueryWithEmptySql() {
    // 测试空SQL
    assertThrows(IllegalArgumentException.class, () ->
      sqlExecutionEngine.execute(dataSourceId, "", Map.of()));
  }

  @Test
  void testExecuteQueryWithNullDataSourceId() {
    // 测试空数据源ID
    assertThrows(IllegalArgumentException.class, () ->
      sqlExecutionEngine.execute(null, "SELECT 1", Map.of()));
  }

  @Test
  void testExecuteQueryWithNonExistentDataSource() {
    // 测试不存在的数据源
    when(dataSourceRepository.findById(dataSourceId.getValue())).thenReturn(Optional.empty());

    assertThrows(DataExecutionException.class, () ->
      sqlExecutionEngine.execute(dataSourceId, "SELECT 1", Map.of()));
  }

  @Test
  void testExecuteQueryWithSqlException() throws SQLException {
    // 测试SQL异常
    String sql = "SELECT * FROM test_table";

    when(dataSourceRepository.findById(dataSourceId.getValue())).thenReturn(Optional.of(dataSource));
    when(connectionGateway.getConnection(dataSource)).thenReturn(connection);
    when(connection.prepareStatement(sql)).thenThrow(new SQLException("Test SQL Exception"));

    assertThrows(DataExecutionException.class, () ->
      sqlExecutionEngine.execute(dataSourceId, sql, Map.of()));
  }

  // 其他测试方法...
}
```

## 8. 实施步骤

1. 创建DataExecutionException类
2. 更新SqlExecutionEngineImpl类，添加依赖注入
3. 实现execute方法和辅助方法
4. 实现cancel方法
5. 实现validate方法
6. 实现getMetadata方法和辅助方法
7. 实现estimateRowCount方法和辅助方法
8. 创建单元测试
9. 运行测试并修复问题
10. 进行代码审查

## 9. 注意事项

1. **连接管理**：不要在方法中关闭连接，而是将其返回到连接池
2. **参数处理**：确保正确处理不同类型的参数
3. **异常处理**：捕获并适当处理所有SQL异常
4. **资源关闭**：确保在finally块中关闭ResultSet和Statement
5. **日志记录**：使用适当的日志级别记录执行信息和错误
6. **安全考虑**：使用参数化查询防止SQL注入
7. **性能优化**：限制结果集大小，防止内存溢出
