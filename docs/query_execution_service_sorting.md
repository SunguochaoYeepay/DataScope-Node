# 查询执行服务排序功能使用指南

## 概述

QueryExecutionService接口提供了对查询结果进行排序的功能，允许用户在执行分页查询时指定排序字段和排序方向。

## 排序参数

排序参数通过`SortField`对象指定，包含以下属性：

- `fieldName`: 排序字段名称
- `direction`: 排序方向，可以是`ASC`（升序）或`DESC`（降序）

## 使用方法

### 1. 执行带排序的分页查询

```java
// 创建排序字段列表
List<QueryResultSortService.SortField> sortFields = List.of(
    new QueryResultSortService.SortField("name", QueryResultSortService.SortDirection.ASC),
    new QueryResultSortService.SortField("age", QueryResultSortService.SortDirection.DESC)
  );

// 执行带排序的分页查询
QueryExecution execution = queryExecutionService.executePagedSql(
  dataSourceId,
  sql,
  parameters,
  pageNumber,
  pageSize,
  sortFields
);
```

### 2. 对已有查询结果进行排序

```java
// 获取查询执行记录
Optional<QueryExecution> executionOpt = queryExecutionService.getById(executionId);
if(executionOpt.

isPresent()){
// 创建排序字段列表
List<QueryResultSortService.SortField> sortFields = List.of(
  new QueryResultSortService.SortField("name", QueryResultSortService.SortDirection.ASC)
);

// 获取排序后的结果
QueryResult sortedResult = queryExecutionService.getSortedResult(executionId, sortFields);

// 或者使用单字段排序方法
QueryResult sortedResult = queryExecutionService.getSortedResult(
  executionId,
  "name",
  QueryResultSortService.SortDirection.ASC
);
}
```

### 3. 获取排序后的分页结果

```java
// 获取排序后的分页结果
PagedQueryResult pagedResult = queryExecutionService.getSortedPagedResult(
    executionId,
    pageNumber,
    pageSize,
    sortFields
  );

// 或者使用单字段排序方法
PagedQueryResult pagedResult = queryExecutionService.getSortedPagedResult(
  executionId,
  pageNumber,
  pageSize,
  "name",
  QueryResultSortService.SortDirection.ASC
);
```

## 排序实现原理

排序功能的实现原理如下：

1. 当执行带排序的分页查询时，排序参数会被转换为SQL的`ORDER BY`子句。
2. 排序参数会被添加到查询参数中，键名为`_sort_fields`。
3. SqlExecutionEngine会根据排序参数构建排序SQL。
4. 排序会在数据库层面执行，以提高性能。

## 注意事项

1. 排序字段必须是查询结果中存在的字段。
2. 排序字段名称只能包含字母、数字、下划线和点号，以防止SQL注入。
3. 如果原始SQL已经包含`ORDER BY`子句，排序参数会覆盖原始的排序。
4. 排序功能支持多字段排序，按照字段列表的顺序进行排序。
