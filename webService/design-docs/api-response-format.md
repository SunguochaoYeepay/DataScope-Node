# API响应格式规范

## 背景

为了提高前端开发效率，减少不必要的适配代码，我们需要统一API响应的格式，特别是分页列表接口的返回格式。本文档定义了DataScope后端API的标准响应格式。

## 基本响应结构

所有API响应都应遵循以下基本结构：

```json
{
  "success": true,  // 布尔值，表示请求是否成功
  "data": {         // 响应数据主体
    // ...具体数据
  }
}
```

错误响应结构：

```json
{
  "success": false,
  "message": "错误描述信息",
  "errorCode": 10001,      // 可选，错误码
  "details": {             // 可选，详细错误信息
    // ...详细错误数据
  }
}
```

## 分页列表响应格式

所有返回列表数据且支持分页的API必须采用以下统一格式：

```json
{
  "success": true,
  "data": {
    "items": [           // 数据项数组，替代之前的rows、history等不同名称
      // ...数据项列表
    ],
    "pagination": {      // 分页信息统一封装在pagination对象中 
      "page": 1,         // 当前页码
      "pageSize": 10,    // 每页记录数
      "total": 100,      // 总记录数
      "totalPages": 10,  // 总页数
      "hasMore": true    // 是否有更多数据
    },
    // 可能包含其他特定于API的额外信息
  }
}
```

### 分页参数支持

所有分页列表API应该同时支持以下两种分页参数方式：

1. **offset/limit方式**：
   - `offset`: 从第几条记录开始
   - `limit`: 获取多少条记录

2. **page/size方式**：
   - `page`: 页码，从1开始
   - `size`: 每页记录数

服务器应优先使用offset/limit参数，如果未提供，则尝试使用page/size参数。

## 已统一的API列表

下列API已采用统一的分页列表响应格式：

1. `GET /api/queries/history` - 查询历史列表
   - 原先使用 `history` 字段返回数据项，现在改为 `items`

2. `GET /api/queries/plans` - 查询计划历史 
   - 原先使用 `history` 字段返回数据项，现在改为 `items`

3. `GET /api/metadata/:dataSourceId/tables/:tableName/data` - 表数据预览
   - 原先使用 `rows` 字段返回数据项，现在改为 `items`

## 待统一的API列表

以下API计划后续统一为标准格式：

1. `GET /api/queries` - 查询列表
2. `GET /api/datasources` - 数据源列表
3. `GET /api/metadata/:dataSourceId/tables` - 表列表
4. 其他返回列表数据的API

## 实现方法

为了方便开发人员使用统一格式，我们提供了`createPaginatedResponse`工具函数：

```typescript
/**
 * 创建统一的分页响应格式
 * @param items 分页数据项
 * @param total 总记录数
 * @param page 当前页码
 * @param pageSize 每页大小
 * @param additionalData 额外数据
 * @returns 标准化的分页响应
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number = 1,
  pageSize: number = 20,
  additionalData: Record<string, any> = {}
) {
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasMore: page < totalPages
    },
    ...additionalData
  };
}
```

同时，我们还提供了offset/limit与page/size之间的转换函数：

```typescript
/**
 * 将offset/limit转换为page/pageSize
 */
export function offsetToPage(offset: number, limit: number): { page: number, pageSize: number } {
  return {
    page: Math.floor(offset / limit) + 1,
    pageSize: limit
  };
}

/**
 * 将page/pageSize转换为offset/limit
 */
export function pageToOffset(page: number, pageSize: number): { offset: number, limit: number } {
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize
  };
}
```

## 时间线

- 2025年3月31日：完成首批API的格式统一（查询历史、查询计划、表数据预览）
- 2025年Q2：计划完成所有列表API的格式统一