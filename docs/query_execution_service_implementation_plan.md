# QueryExecutionService实施计划

## 概述

本文档详细说明了QueryExecutionService的实施计划，包括核心方法的实现细节、依赖关系和测试策略。QueryExecutionService是在SqlExecutionEngine基础上提供更高级别查询执行功能的服务，包括查询执行状态跟踪、查询超时处理、结果缓存和导出等功能。

## 1. QueryExecutionServiceImpl 实现

### 1.1 依赖注入

```java

@Service
@RequiredArgsConstructor
public class QueryExecutionServiceImpl implements QueryExecutionService {
  private final SqlExecutionEngine sqlExecutionEngine;
  private final QueryExecutionRepository queryExecutionRepository;
  private final UserService userService;
  private final CacheManager cacheManager;

  // 查询超时配置（可通过配置文件注入）
  @Value("${query.execution.timeout:30}")
  private int queryTimeoutSeconds;

  // 查询结果缓存配置
  @Value("${query.execution.cache.enabled:true}")
  private boolean cacheEnabled;

  @Value("${query.execution.cache.ttl:300}")
  private int cacheTtlSeconds;

  // 查询执行线程池
  private final ExecutorService queryExecutor = Executors.newFixedThreadPool(10);

  // 其他方法实现...
}
```

### 1.2 executeSql 方法实现

```java

@Override
public QueryExecution executeSql(String dataSourceId, String sql, Map<String, Object> parameters) {
  // 参数验证
  if (dataSourceId == null || sql == null || sql.trim().isEmpty()) {
    throw new IllegalArgumentException("DataSourceId and SQL must not be null or empty");
  }

  // 获取当前用户
  String userId = userService.getCurrentUserId();

  // 创建查询执行记录
  QueryExecution execution = new QueryExecution();
  execution.setId(UUID.randomUUID().toString());
  execution.setDataSourceId(DataSourceId.of(dataSourceId));
  execution.setSql(sql);
  execution.setParameters(parameters);
  execution.setStatus(QueryExecutionStatus.CREATED);
  execution.setStartTime(LocalDateTime.now());
  execution.setUserId(userId);

  // 保存查询执行记录
  queryExecutionRepository.save(execution);

  // 检查缓存
  if (cacheEnabled) {
    QueryResult cachedResult = getCachedResult(dataSourceId, sql, parameters);
    if (cachedResult != null) {
      // 使用缓存结果
      execution.setStatus(QueryExecutionStatus.COMPLETED);
      execution.setEndTime(LocalDateTime.now());
      execution.setExecutionTimeMs(0L);
      execution.setResultRowCount(cachedResult.getTotalRows());
      execution.setResult(cachedResult);

      // 更新查询执行记录
      queryExecutionRepository.save(execution);

      return execution;
    }
  }

  // 异步执行查询
  queryExecutor.submit(() -> executeQuery(execution));

  return execution;
}

private void executeQuery(QueryExecution execution) {
  try {
    // 更新状态为运行中
    execution.setStatus(QueryExecutionStatus.RUNNING);
    queryExecutionRepository.save(execution);

    // 执行查询
    long startTime = System.currentTimeMillis();

    // 设置超时任务
    ScheduledExecutorService timeoutExecutor = Executors.newSingleThreadScheduledExecutor();
    ScheduledFuture<?> timeoutFuture = timeoutExecutor.schedule(() -> {
      if (execution.getStatus() == QueryExecutionStatus.RUNNING) {
        try {
          // 取消查询
          sqlExecutionEngine.cancel(execution.getId());

          // 更新状态为超时
          execution.setStatus(QueryExecutionStatus.TIMEOUT);
          execution.setEndTime(LocalDateTime.now());
          execution.setErrorMessage("Query execution timed out after " + queryTimeoutSeconds + " seconds");
          queryExecutionRepository.save(execution);
        } catch (Exception e) {
          log.error("Failed to cancel query: {}", e.getMessage(), e);
        }
      }
    }, queryTimeoutSeconds, TimeUnit.SECONDS);

    try {
      // 执行查询
      QueryResult result = sqlExecutionEngine.execute(
        execution.getDataSourceId(),
        execution.getSql(),
        execution.getParameters());

      // 取消超时任务
      timeoutFuture.cancel(false);

      // 计算执行时间
      long executionTime = System.currentTimeMillis() - startTime;

      // 更新查询执行记录
      execution.setStatus(QueryExecutionStatus.COMPLETED);
      execution.setEndTime(LocalDateTime.now());
      execution.setExecutionTimeMs(executionTime);
      execution.setResultRowCount(result.getTotalRows());
      execution.setResult(result);

      // 缓存结果
      if (cacheEnabled) {
        cacheResult(execution.getDataSourceId().getValue(), execution.getSql(),
          execution.getParameters(), result);
      }
    } catch (Exception e) {
      // 取消超时任务
      timeoutFuture.cancel(false);

      // 更新状态为失败
      execution.setStatus(QueryExecutionStatus.FAILED);
      execution.setEndTime(LocalDateTime.now());
      execution.setErrorMessage(e.getMessage());
    } finally {
      // 关闭超时执行器
      timeoutExecutor.shutdown();
    }
  } catch (Exception e) {
    // 处理异常
    execution.setStatus(QueryExecutionStatus.FAILED);
    execution.setEndTime(LocalDateTime.now());
    execution.setErrorMessage("Unexpected error: " + e.getMessage());
  } finally {
    // 保存查询执行记录
    queryExecutionRepository.save(execution);
  }
}

private QueryResult getCachedResult(String dataSourceId, String sql, Map<String, Object> parameters) {
  String cacheKey = buildCacheKey(dataSourceId, sql, parameters);
  Cache cache = cacheManager.getCache("queryResults");
  if (cache != null) {
    Cache.ValueWrapper wrapper = cache.get(cacheKey);
    if (wrapper != null) {
      return (QueryResult) wrapper.get();
    }
  }
  return null;
}

private void cacheResult(String dataSourceId, String sql, Map<String, Object> parameters, QueryResult result) {
  String cacheKey = buildCacheKey(dataSourceId, sql, parameters);
  Cache cache = cacheManager.getCache("queryResults");
  if (cache != null) {
    cache.put(cacheKey, result);
  }
}

private String buildCacheKey(String dataSourceId, String sql, Map<String, Object> parameters) {
  StringBuilder sb = new StringBuilder();
  sb.append(dataSourceId).append(":");
  sb.append(sql).append(":");

  if (parameters != null && !parameters.isEmpty()) {
    List<String> paramList = new ArrayList<>();
    parameters.forEach((key, value) ->
      paramList.add(key + "=" + (value == null ? "null" : value.toString())));
    Collections.sort(paramList);
    sb.append(String.join(",", paramList));
  }

  return DigestUtils.md5DigestAsHex(sb.toString().getBytes());
}
```

### 1.3 getById 方法实现

```java

@Override
public Optional<QueryExecution> getById(String id) {
  if (id == null || id.trim().isEmpty()) {
    return Optional.empty();
  }

  return queryExecutionRepository.findById(id);
}
```

### 1.4 getRecentByUserId 方法实现

```java

@Override
public List<QueryExecution> getRecentByUserId(String userId, int limit) {
  if (userId == null || userId.trim().isEmpty()) {
    throw new IllegalArgumentException("UserId must not be null or empty");
  }

  return queryExecutionRepository.findByUserIdOrderByStartTimeDesc(userId, PageRequest.of(0, limit));
}
```

### 1.5 cancel 方法实现

```java

@Override
public void cancel(String id) {
  if (id == null || id.trim().isEmpty()) {
    throw new IllegalArgumentException("Execution ID must not be null or empty");
  }

  // 获取查询执行记录
  QueryExecution execution = queryExecutionRepository.findById(id)
    .orElseThrow(() -> new IllegalArgumentException("Query execution not found: " + id));

  // 只能取消正在运行的查询
  if (execution.getStatus() != QueryExecutionStatus.RUNNING) {
    throw new IllegalStateException("Cannot cancel query with status: " + execution.getStatus());
  }

  try {
    // 取消查询
    sqlExecutionEngine.cancel(id);

    // 更新状态为已取消
    execution.setStatus(QueryExecutionStatus.CANCELLED);
    execution.setEndTime(LocalDateTime.now());
    queryExecutionRepository.save(execution);
  } catch (Exception e) {
    throw new RuntimeException("Failed to cancel query: " + e.getMessage(), e);
  }
}
```

### 1.6 exportResult 方法实现

```java

@Override
public String exportResult(String id, String format) {
  if (id == null || id.trim().isEmpty()) {
    throw new IllegalArgumentException("Execution ID must not be null or empty");
  }

  if (format == null || format.trim().isEmpty()) {
    format = "csv"; // 默认格式
  }

  // 获取查询执行记录
  QueryExecution execution = queryExecutionRepository.findById(id)
    .orElseThrow(() -> new IllegalArgumentException("Query execution not found: " + id));

  // 只能导出已完成的查询
  if (execution.getStatus() != QueryExecutionStatus.COMPLETED) {
    throw new IllegalStateException("Cannot export result for query with status: " + execution.getStatus());
  }

  // 获取查询结果
  QueryResult result = execution.getResult();
  if (result == null || result.getRows() == null || result.getRows().isEmpty()) {
    throw new IllegalStateException("Query has no results to export");
  }

  // 导出结果
  String fileName = "query_result_" + id + "." + format.toLowerCase();
  String filePath = "exports/" + fileName;

  try {
    switch (format.toLowerCase()) {
      case "csv":
        exportToCsv(result, filePath);
        break;
      case "json":
        exportToJson(result, filePath);
        break;
      case "excel":
        exportToExcel(result, filePath);
        break;
      default:
        throw new IllegalArgumentException("Unsupported export format: " + format);
    }

    return filePath;
  } catch (Exception e) {
    throw new RuntimeException("Failed to export result: " + e.getMessage(), e);
  }
}

private void exportToCsv(QueryResult result, String filePath) throws IOException {
  try (FileWriter writer = new FileWriter(filePath);
       CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT)) {

    // 写入列头
    List<String> headers = result.getColumns().stream()
      .map(ColumnDefinition::getName)
      .collect(Collectors.toList());
    printer.printRecord(headers);

    // 写入数据行
    for (Map<String, Object> row : result.getRows()) {
      List<Object> values = headers.stream()
        .map(header -> row.getOrDefault(header, ""))
        .collect(Collectors.toList());
      printer.printRecord(values);
    }
  }
}

private void exportToJson(QueryResult result, String filePath) throws IOException {
  ObjectMapper mapper = new ObjectMapper();
  mapper.writerWithDefaultPrettyPrinter().writeValue(new File(filePath), result.getRows());
}

private void exportToExcel(QueryResult result, String filePath) throws IOException {
  try (Workbook workbook = new XSSFWorkbook();
       FileOutputStream fileOut = new FileOutputStream(filePath)) {

    Sheet sheet = workbook.createSheet("Query Result");

    // 创建列头行
    Row headerRow = sheet.createRow(0);
    List<String> headers = result.getColumns().stream()
      .map(ColumnDefinition::getName)
      .collect(Collectors.toList());

    for (int i = 0; i < headers.size(); i++) {
      Cell cell = headerRow.createCell(i);
      cell.setCellValue(headers.get(i));
    }

    // 创建数据行
    int rowNum = 1;
    for (Map<String, Object> row : result.getRows()) {
      Row dataRow = sheet.createRow(rowNum++);

      for (int i = 0; i < headers.size(); i++) {
        Cell cell = dataRow.createCell(i);
        Object value = row.getOrDefault(headers.get(i), "");

        if (value == null) {
          cell.setCellValue("");
        } else if (value instanceof Number) {
          cell.setCellValue(((Number) value).doubleValue());
        } else if (value instanceof Boolean) {
          cell.setCellValue((Boolean) value);
        } else if (value instanceof Date) {
          cell.setCellValue((Date) value);
        } else {
          cell.setCellValue(value.toString());
        }
      }
    }

    workbook.write(fileOut);
  }
}
```

## 2. QueryExecution 模型

```java

@Data
@Entity
@Table(name = "query_executions")
public class QueryExecution {
  @Id
  private String id;

  @Column(name = "data_source_id", nullable = false)
  private String dataSourceIdValue;

  @Transient
  private DataSourceId dataSourceId;

  @Column(name = "sql_text", length = 10000)
  private String sql;

  @Column(name = "natural_language_text", length = 1000)
  private String naturalLanguageText;

  @Column(name = "parameters")
  @Convert(converter = ParametersConverter.class)
  private Map<String, Object> parameters;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private QueryExecutionStatus status;

  @Column(name = "start_time", nullable = false)
  private LocalDateTime startTime;

  @Column(name = "end_time")
  private LocalDateTime endTime;

  @Column(name = "execution_time_ms")
  private Long executionTimeMs;

  @Column(name = "result_row_count")
  private Long resultRowCount;

  @Column(name = "error_message", length = 1000)
  private String errorMessage;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Transient
  private QueryResult result;

  // 获取数据源ID
  public DataSourceId getDataSourceId() {
    if (dataSourceId == null && dataSourceIdValue != null) {
      dataSourceId = DataSourceId.of(dataSourceIdValue);
    }
    return dataSourceId;
  }

  // 设置数据源ID
  public void setDataSourceId(DataSourceId dataSourceId) {
    this.dataSourceId = dataSourceId;
    this.dataSourceIdValue = dataSourceId != null ? dataSourceId.getValue() : null;
  }
}
```

## 3. QueryExecutionStatus 枚举

```java
public enum QueryExecutionStatus {
  CREATED,    // 已创建
  RUNNING,    // 正在运行
  COMPLETED,  // 已完成
  FAILED,     // 失败
  CANCELLED,  // 已取消
  TIMEOUT     // 超时
}
```

## 4. QueryExecutionRepository 接口

```java
public interface QueryExecutionRepository extends JpaRepository<QueryExecution, String> {
  List<QueryExecution> findByUserIdOrderByStartTimeDesc(String userId, Pageable pageable);

  List<QueryExecution> findByStatusOrderByStartTimeDesc(QueryExecutionStatus status, Pageable pageable);

  List<QueryExecution> findByDataSourceIdValueOrderByStartTimeDesc(String dataSourceId, Pageable pageable);

  List<QueryExecution> findByStartTimeBetweenOrderByStartTimeDesc(LocalDateTime start, LocalDateTime end, Pageable pageable);
}
```

## 5. ParametersConverter 转换器

```java

@Converter
public class ParametersConverter implements AttributeConverter<Map<String, Object>, String> {
  private static final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public String convertToDatabaseColumn(Map<String, Object> attribute) {
    try {
      return attribute == null ? null : objectMapper.writeValueAsString(attribute);
    } catch (Exception e) {
      throw new IllegalArgumentException("Failed to convert parameters to JSON", e);
    }
  }

  @Override
  public Map<String, Object> convertToEntityAttribute(String dbData) {
    try {
      if (dbData == null || dbData.isEmpty()) {
        return new HashMap<>();
      }
      return objectMapper.readValue(dbData, new TypeReference<Map<String, Object>>() {
      });
    } catch (Exception e) {
      throw new IllegalArgumentException("Failed to convert JSON to parameters", e);
    }
  }
}
```

## 6. 缓存配置

```java

@Configuration
@EnableCaching
public class CacheConfig {

  @Value("${query.execution.cache.ttl:300}")
  private int cacheTtlSeconds;

  @Bean
  public CacheManager cacheManager() {
    SimpleCacheManager cacheManager = new SimpleCacheManager();

    // 创建查询结果缓存
    GuavaCache queryResultsCache = new GuavaCache("queryResults",
      CacheBuilder.newBuilder()
        .expireAfterWrite(cacheTtlSeconds, TimeUnit.SECONDS)
        .maximumSize(100)
        .build());

    cacheManager.setCaches(Arrays.asList(queryResultsCache));
    return cacheManager;
  }
}
```

## 7. 异常处理

创建专门的异常类来处理查询执行过程中的错误：

```java
public class QueryExecutionException extends RuntimeException {
  public QueryExecutionException(String message) {
    super(message);
  }

  public QueryExecutionException(String message, Throwable cause) {
    super(message, cause);
  }
}
```

## 8. 单元测试

### 8.1 基本测试

```java

@ExtendWith(MockitoExtension.class)
class QueryExecutionServiceImplTest {

  @Mock
  private SqlExecutionEngine sqlExecutionEngine;

  @Mock
  private QueryExecutionRepository queryExecutionRepository;

  @Mock
  private UserService userService;

  @Mock
  private CacheManager cacheManager;

  @InjectMocks
  private QueryExecutionServiceImpl queryExecutionService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(queryExecutionService, "queryTimeoutSeconds", 30);
    ReflectionTestUtils.setField(queryExecutionService, "cacheEnabled", true);
    ReflectionTestUtils.setField(queryExecutionService, "cacheTtlSeconds", 300);
  }

  @Test
  void testExecuteSql() {
    // 准备测试数据
    String dataSourceId = "test-ds-id";
    String sql = "SELECT * FROM test_table";
    Map<String, Object> parameters = Map.of("param1", "value1");
    String userId = "test-user";

    // 设置模拟行为
    when(userService.getCurrentUserId()).thenReturn(userId);
    when(queryExecutionRepository.save(any(QueryExecution.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // 执行测试
    QueryExecution execution = queryExecutionService.executeSql(dataSourceId, sql, parameters);

    // 验证结果
    assertNotNull(execution);
    assertEquals(dataSourceId, execution.getDataSourceId().getValue());
    assertEquals(sql, execution.getSql());
    assertEquals(parameters, execution.getParameters());
    assertEquals(QueryExecutionStatus.CREATED, execution.getStatus());
    assertEquals(userId, execution.getUserId());

    // 验证交互
    verify(userService).getCurrentUserId();
    verify(queryExecutionRepository).save(any(QueryExecution.class));
  }

  // 其他测试方法...
}
```

## 9. 实施步骤

1. 创建QueryExecutionStatus枚举
2. 创建QueryExecution实体类
3. 创建ParametersConverter转换器
4. 创建QueryExecutionRepository接口
5. 创建QueryExecutionException异常类
6. 创建CacheConfig缓存配置
7. 实现QueryExecutionServiceImpl类
8. 创建单元测试
9. 运行测试并修复问题
10. 进行代码审查

## 10. 性能考虑

1. **查询超时**：实现查询超时机制，防止长时间运行的查询
2. **结果缓存**：缓存频繁执行的查询结果，提高性能
3. **异步执行**：使用线程池异步执行查询，提高并发性能
4. **分页处理**：对大结果集实现分页处理，防止内存溢出
5. **资源限制**：限制单个用户的并发查询数量

## 11. 安全考虑

1. **用户权限**：验证用户对数据源的访问权限
2. **查询审计**：记录所有查询操作，包括用户、时间、SQL等信息
3. **结果掩码**：对敏感数据进行掩码处理
4. **查询限制**：限制查询返回的行数和执行时间

## 12. 下一步工作

1. 实现自然语言处理服务
2. 实现查询结果可视化功能
3. 实现查询历史分析功能
4. 实现查询推荐功能
5. 实现查询结果导出功能的增强
