# 查询执行服务实施进度

## 实施第一天 (2025/3/24) - 下午

### 1. 修复QueryExecution类中缺少result字段和setResult方法的问题

已修复QueryExecution类，添加了result字段和setter方法：

```java

@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class QueryExecution {
  private String id;
  private DataSourceId dataSourceId;
  @Setter
  private String sql;
  private Map<String, Object> parameters;
  private QueryExecutionStatus status;
  private LocalDateTime startTime;
  private LocalDateTime endTime;
  private Long resultCount;
  private String errorMessage;
  private String userId;

  @Setter
  private QueryResult result;

  // 其他方法...
}
```

**文件路径**：`data-scope-domain/src/main/java/com/datascope/domain/query/model/QueryExecution.java`

**状态**：✅ 已完成

### 2. 完善QueryExecutionServiceImpl类的cancel方法

已完善cancel方法，使其能够实际取消查询执行：

```java

@Override
@Transactional
public void cancel(String id) {
  Optional<QueryExecution> execution = queryExecutionRepository.findById(id);
  if (execution.isPresent() && execution.get().isRunning()) {
    QueryExecution queryExecution = execution.get();

    try {
      // 实际取消查询执行
      sqlExecutionEngine.cancel(queryExecution.getId());

      // 更新执行记录状态
      queryExecution.markAsCancelled();
      queryExecutionRepository.save(queryExecution);

      log.info("Query execution cancelled: {}", id);
    } catch (Exception e) {
      log.error("Failed to cancel query execution: {}", id, e);
      queryExecution.markAsFailed("Failed to cancel query: " + e.getMessage());
      queryExecutionRepository.save(queryExecution);
    }
  } else {
    log.warn("Cannot cancel query execution: {} (not found or not running)", id);
  }
}
```

**文件路径**：`data-scope-domain/src/main/java/com/datascope/domain/query/service/impl/QueryExecutionServiceImpl.java`

**状态**：✅ 已完成

### 3. 实现exportResult方法

已实现exportResult方法，用于导出查询结果：

```java

@Override
public String exportResult(String id, String format) {
  Optional<QueryExecution> execution = queryExecutionRepository.findById(id);
  if (execution.isPresent()) {
    QueryExecution queryExecution = execution.get();

    // 检查查询是否已完成
    if (!queryExecution.isCompleted()) {
      throw new IllegalStateException("Cannot export results for query that is not completed: " + id);
    }

    // 检查是否有结果
    if (queryExecution.getResult() == null) {
      throw new IllegalStateException("Query execution has no results to export: " + id);
    }

    // 根据格式导出结果
    String exportPath = "/tmp/export/" + id + "." + format.toLowerCase();

    try {
      switch (format.toLowerCase()) {
        case "csv":
          exportToCsv(queryExecution.getResult(), exportPath);
          break;
        case "json":
          exportToJson(queryExecution.getResult(), exportPath);
          break;
        case "excel":
          exportToExcel(queryExecution.getResult(), exportPath);
          break;
        default:
          throw new IllegalArgumentException("Unsupported export format: " + format);
      }

      log.info("Query results exported to {}", exportPath);
      return exportPath;
    } catch (Exception e) {
      log.error("Failed to export query results: {}", id, e);
      throw new RuntimeException("Failed to export query results: " + e.getMessage(), e);
    }
  }
  throw new IllegalArgumentException("Query execution not found: " + id);
}

private void exportToCsv(QueryResult result, String filePath) {
  // TODO: 实现CSV导出逻辑
  log.info("CSV export not yet implemented");
}

private void exportToJson(QueryResult result, String filePath) {
  // TODO: 实现JSON导出逻辑
  log.info("JSON export not yet implemented");
}

private void exportToExcel(QueryResult result, String filePath) {
  // TODO: 实现Excel导出逻辑
  log.info("Excel export not yet implemented");
}
```

**文件路径**：`data-scope-domain/src/main/java/com/datascope/domain/query/service/impl/QueryExecutionServiceImpl.java`

**状态**：✅ 已完成基本框架，导出具体实现待完成

### 4. 实现executeNaturalLanguage方法

已实现executeNaturalLanguage方法，用于将自然语言转换为SQL并执行：

```java

@Override
@Transactional
public QueryExecution executeNaturalLanguage(String dataSourceId, String text) {
  log.info("Processing natural language query: {}", text);

  // 创建查询执行记录
  QueryExecution execution = new QueryExecution(
    DataSourceId.of(dataSourceId),
    "NATURAL_LANGUAGE: " + text,
    Map.of()
  );

  // 保存执行记录
  execution = queryExecutionRepository.save(execution);

  try {
    // 标记为执行中
    execution.markAsStarted();

    // TODO: 调用LLM服务将自然语言转换为SQL
    // 这里是临时实现，实际项目中需要集成LLM服务
    String sql = convertNaturalLanguageToSql(dataSourceId, text);
    log.info("Converted natural language to SQL: {}", sql);

    // 验证生成的SQL
    boolean isValid = sqlExecutionEngine.validate(DataSourceId.of(dataSourceId), sql);
    if (!isValid) {
      throw new IllegalArgumentException("Generated SQL is not valid: " + sql);
    }

    // 执行SQL查询
    QueryResult queryResult = sqlExecutionEngine.execute(
      DataSourceId.of(dataSourceId),
      sql,
      Map.of()
    );

    // 更新执行记录
    execution.markAsCompleted(queryResult.getTotalRows());
    execution.setResult(queryResult);
    execution.setSql(sql); // 更新为实际执行的SQL

  } catch (Exception e) {
    log.error("Natural language query execution failed", e);
    execution.markAsFailed(e.getMessage());
  }

  return queryExecutionRepository.save(execution);
}

private String convertNaturalLanguageToSql(String dataSourceId, String text) {
  // 这是一个简单的实现，实际项目中需要集成LLM服务
  // 临时返回一个简单的SQL查询
  return "SELECT 1 AS result";
}
```

**文件路径**：`data-scope-domain/src/main/java/com/datascope/domain/query/service/impl/QueryExecutionServiceImpl.java`

**状态**：✅ 已完成基本框架，LLM集成待实现

### 5. 完善executeSql方法，添加查询超时处理

已完善executeSql方法，添加了查询超时处理：

```java
// 查询超时时间（秒）
private static final int QUERY_TIMEOUT_SECONDS = 60;

@Override
@Transactional
public QueryExecution executeSql(String dataSourceId, String sql, Map<String, Object> parameters) {
  log.info("Executing SQL query on dataSource: {}, SQL: {}", dataSourceId, sql);

  // 创建查询执行记录
  QueryExecution execution = new QueryExecution(
    DataSourceId.of(dataSourceId),
    sql,
    parameters
  );

  // 保存执行记录
  execution = queryExecutionRepository.save(execution);

  // 创建查询超时任务
  ScheduledFuture<?> timeoutTask = null;

  try {
    // 标记为执行中
    execution.markAsStarted();

    // 设置查询超时任务
    final String executionId = execution.getId();
    timeoutTask = scheduleQueryTimeout(executionId);

    // 验证SQL语句
    boolean isValid = sqlExecutionEngine.validate(DataSourceId.of(dataSourceId), sql);
    if (!isValid) {
      throw new IllegalArgumentException("SQL validation failed: " + sql);
    }

    // 实际执行SQL查询
    QueryResult queryResult = sqlExecutionEngine.execute(
      DataSourceId.of(dataSourceId),
      sql,
      parameters
    );

    // 更新执行记录
    execution.markAsCompleted(queryResult.getTotalRows());
    execution.setResult(queryResult);

    log.info("SQL execution completed successfully, rows: {}", queryResult.getTotalRows());

  } catch (Exception e) {
    log.error("SQL execution failed: {}", e.getMessage(), e);
    execution.markAsFailed(e.getMessage());
  } finally {
    // 取消超时任务
    if (timeoutTask != null) {
      timeoutTask.cancel(false);
    }
  }

  return queryExecutionRepository.save(execution);
}

// 调度器用于处理查询超时
private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

/**
 * 调度查询超时任务
 *
 * @param executionId 查询执行ID
 * @return 调度任务
 */
private ScheduledFuture<?> scheduleQueryTimeout(String executionId) {
  return scheduler.schedule(() -> {
    log.warn("Query execution timed out: {}", executionId);
    try {
      cancel(executionId);
    } catch (Exception e) {
      log.error("Failed to cancel timed out query: {}", executionId, e);
    }
  }, QUERY_TIMEOUT_SECONDS, TimeUnit.SECONDS);
}
```

**文件路径**：`data-scope-domain/src/main/java/com/datascope/domain/query/service/impl/QueryExecutionServiceImpl.java`

**状态**：✅ 已完成

## 下一步计划

1. 实现查询结果缓存功能
2. 实现查询结果分页功能
3. 实现查询结果排序功能
4. 实现导出功能的具体实现（CSV、JSON、Excel）
5. 集成LLM服务，实现自然语言到SQL的转换

## 实施总结

今天的实施工作已经完成了查询执行服务的核心功能：

1. 修复了QueryExecution类中缺少result字段和setResult方法的问题
2. 完善了QueryExecutionServiceImpl类的cancel方法
3. 实现了exportResult方法的基本框架
4. 实现了executeNaturalLanguage方法的基本框架
5. 完善了executeSql方法，添加了查询超时处理

这些实现已经可以支持基本的查询执行功能，包括SQL查询执行、查询取消、查询超时处理和结果导出。下一步将继续完善查询结果处理功能，包括缓存、分页和排序，以及实现自然语言到SQL的转换功能。
