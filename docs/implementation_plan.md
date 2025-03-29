# SQL执行引擎实施计划

## 概述

本文档详细说明了SQL执行引擎的实施计划，包括核心方法的实现细节、依赖关系和测试策略。

## 1. SqlExecutionEngineImpl 实现

### 1.1 依赖注入

```java

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

### 1.2 execute 方法实现

```java

@Override
public QueryResult execute(DataSourceId dataSourceId, String sql, Map<String, Object> parameters) {
  // 参数验证
  if (dataSourceId == null || sql == null || sql.trim().isEmpty()) {
    throw new IllegalArgumentException("DataSourceId and SQL must not be null or empty");
  }

  // 获取数据源
  DataSource dataSource = dataSourceRepository.findById(dataSourceId.getValue())
    .orElseThrow(() -> new DataSourceException("Data source not found: " + dataSourceId));

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
    throw new DataExecutionException("SQL execution failed: " + e.getMessage(), e);
  } finally {
    // 关闭资源
    closeResources(rs, stmt, connection);

    // 设置执行时间
    long endTime = System.currentTimeMillis();
    result.setExecutionTime(endTime - startTime);
  }

  return result;
}

private void setParameters(PreparedStatement stmt, Map<String, Object> parameters) throws SQLException {
  // 处理命名参数
  if (stmt instanceof NamedParameterStatement) {
    NamedParameterStatement namedStmt = (NamedParameterStatement) stmt;
    for (Map.Entry<String, Object> entry : parameters.entrySet()) {
      namedStmt.setObject(entry.getKey(), entry.getValue());
    }
  } else {
    // 处理位置参数（假设参数按顺序排列）
    int paramIndex = 1;
    for (Object value : parameters.values()) {
      stmt.setObject(paramIndex++, value);
    }
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

private void closeResources(ResultSet rs, Statement stmt, Connection connection) {
  if (rs != null) {
    try {
      rs.close();
    } catch (SQLException e) {
      // 记录错误但不抛出
    }
  }

  if (stmt != null) {
    try {
      stmt.close();
    } catch (SQLException e) {
      // 记录错误但不抛出
    }
  }

  // 注意：不关闭连接，而是将其返回到连接池
}
```

### 1.3 cancel 方法实现

```java

@Override
public void cancel(String executionId) {
  Statement stmt = activeStatements.get(executionId);
  if (stmt != null) {
    try {
      stmt.cancel();
    } catch (SQLException e) {
      throw new DataExecutionException("Failed to cancel query: " + e.getMessage(), e);
    }
  }
}
```

### 1.4 validate 方法实现

```java

@Override
public boolean validate(DataSourceId dataSourceId, String sql) {
  if (dataSourceId == null || sql == null || sql.trim().isEmpty()) {
    return false;
  }

  // 获取数据源
  DataSource dataSource = dataSourceRepository.findById(dataSourceId.getValue())
    .orElseThrow(() -> new DataSourceException("Data source not found: " + dataSourceId));

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
    // SQL语法错误
    return false;
  } finally {
    // 关闭资源
    if (stmt != null) {
      try {
        stmt.close();
      } catch (SQLException e) {
        // 忽略
      }
    }
    // 不关闭连接，而是将其返回到连接池
  }
}
```

### 1.5 getMetadata 方法实现

```java

@Override
public SqlMetadata getMetadata(DataSourceId dataSourceId, String sql) {
  if (dataSourceId == null || sql == null || sql.trim().isEmpty()) {
    throw new IllegalArgumentException("DataSourceId and SQL must not be null or empty");
  }

  // 获取数据源
  DataSource dataSource = dataSourceRepository.findById(dataSourceId.getValue())
    .orElseThrow(() -> new DataSourceException("Data source not found: " + dataSourceId));

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

    // 提取参数信息
    ParameterMetaData paramMetaData = stmt.getParameterMetaData();
    List<ParameterDefinition> parameters = new ArrayList<>();

    if (paramMetaData != null) {
      int paramCount = paramMetaData.getParameterCount();
      for (int i = 1; i <= paramCount; i++) {
        ParameterDefinition param = ParameterDefinition.builder()
          .name("param" + i) // JDBC不提供参数名称，使用位置索引
          .dataType(paramMetaData.getParameterTypeName(i))
          .required(paramMetaData.isNullable(i) == ParameterMetaData.parameterNoNulls)
          .build();
        parameters.add(param);
      }
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
      .parameters(parameters)
      .hasAggregation(hasAggregation)
      .hasGroupBy(hasGroupBy)
      .hasOrderBy(hasOrderBy)
      .build();
  } catch (SQLException e) {
    throw new DataExecutionException("Failed to get SQL metadata: " + e.getMessage(), e);
  } finally {
    // 关闭资源
    closeResources(rs, stmt, connection);
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
  // ... 实现表名提取逻辑
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

### 1.6 estimateRowCount 方法实现

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

  // 获取数据源
  DataSource dataSource = dataSourceRepository.findById(dataSourceId.getValue())
    .orElseThrow(() -> new DataSourceException("Data source not found: " + dataSourceId));

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
    // 如果COUNT查询失败，使用替代方法
    return estimateRowCountAlternative(dataSource, sql);
  } finally {
    // 关闭资源
    closeResources(rs, stmt, connection);
  }
}

private String buildCountQuery(String sql) {
  // 简单实现，实际项目中可能需要使用SQL解析器
  return "SELECT COUNT(*) FROM (" + sql + ") AS count_query";
}

private long estimateRowCountAlternative(DataSource dataSource, String sql) {
  // 替代方法：执行EXPLAIN或查询计划
  // 这是一个简化的实现，实际项目中需要根据数据库类型进行适配
  return 1000; // 返回一个默认估计值
}
```

## 2. 异常处理

创建专门的异常类来处理SQL执行过程中的错误：

```java
public class DataExecutionException extends RuntimeException {
  public DataExecutionException(String message) {
    super(message);
  }

  public DataExecutionException(String message, Throwable cause) {
    super(message, cause);
  }
}
```

## 3. 单元测试

### 3.1 基本测试

```java

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

  // 其他测试方法...
}
```

### 3.2 边界条件测试

```java

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

  assertThrows(DataSourceException.class, () ->
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
```

## 4. 集成测试

```java

@SpringBootTest
class SqlExecutionEngineIntegrationTest {

  @Autowired
  private SqlExecutionEngine sqlExecutionEngine;

  @Autowired
  private DataSourceRepository dataSourceRepository;

  private DataSource testDataSource;
  private DataSourceId testDataSourceId;

  @BeforeEach
  void setUp() {
    // 创建测试数据源
    testDataSource = new DataSource();
    testDataSource.setName("Integration Test DS");
    testDataSource.setType(DataSourceType.MYSQL);
    testDataSource.setHost("localhost");
    testDataSource.setPort(3306);
    testDataSource.setDatabase("test_db");
    testDataSource.setUsername("test_user");
    testDataSource.setPassword("test_password");
    testDataSource.init("system");

    testDataSource = dataSourceRepository.save(testDataSource);
    testDataSourceId = DataSourceId.of(testDataSource.getId());
  }

  @AfterEach
  void tearDown() {
    // 清理测试数据
    dataSourceRepository.delete(testDataSource);
  }

  @Test
  void testExecuteQueryIntegration() {
    // 执行简单查询
    String sql = "SELECT 1 as test_value";
    QueryResult result = sqlExecutionEngine.execute(testDataSourceId, sql, Map.of());

    // 验证结果
    assertNotNull(result);
    assertEquals(1, result.getColumns().size());
    assertEquals(1, result.getRows().size());
    assertEquals("test_value", result.getColumns().get(0).getName());
    assertEquals(1, result.getRows().get(0).get("test_value"));
  }

  // 其他集成测试...
}
```

## 5. 性能考虑

1. **连接池管理**：确保使用连接池而不是每次查询创建新连接
2. **查询超时**：实现查询超时机制，防止长时间运行的查询
3. **结果集分页**：对大结果集实现分页处理，防止内存溢出
4. **参数化查询**：使用参数化查询防止SQL注入并提高性能
5. **资源关闭**：确保正确关闭所有JDBC资源

## 6. 安全考虑

1. **SQL注入防护**：使用参数化查询和输入验证
2. **权限检查**：在执行SQL前验证用户权限
3. **敏感数据处理**：实现数据掩码功能
4. **查询限制**：限制查询返回的行数和执行时间
5. **审计日志**：记录所有SQL执行操作

## 7. 下一步工作

1. 实现QueryExecutionServiceImpl类的核心方法
2. 集成数据掩码功能
3. 实现查询结果导出功能
4. 添加查询监控和管理功能
5. 实现自然语言到SQL的转换
