# API 分页标准规范

## 1. 请求参数(入参)标准

所有支持分页的 API 必须统一使用以下参数：

```typescript
interface PaginationParams {
    page: number;    // 页码，从1开始
    size: number;    // 每页条数，默认10
}
```

示例：
```
GET /api/queries?page=1&size=10
```

## 2. 返回格式(出参)标准

所有分页 API 必须统一使用以下返回格式：

```typescript
interface PaginationResponse<T> {
    success: boolean;
    data: {
        items: T[];           // 数据项数组
        pagination: {
            page: number;      // 当前页码
            pageSize: number;  // 每页条数
            total: number;     // 总记录数
            totalPages: number;// 总页数
            hasMore: boolean;  // 是否有下一页
        }
    }
}
```

示例：
```json
{
    "success": true,
    "data": {
        "items": [
            { "id": 1, "name": "Query 1" },
            { "id": 2, "name": "Query 2" }
        ],
        "pagination": {
            "page": 1,
            "pageSize": 10,
            "total": 25,
            "totalPages": 3,
            "hasMore": true
        }
    }
}
```

## 3. 工具函数

后端应使用统一的工具函数处理分页逻辑：

```typescript
// 创建分页响应
function createPaginatedResponse<T>(
    items: T[],
    page: number,
    pageSize: number,
    total: number
): PaginationResponse<T> {
    const totalPages = Math.ceil(total / pageSize);
    return {
        success: true,
        data: {
            items,
            pagination: {
                page,
                pageSize,
                total,
                totalPages,
                hasMore: page < totalPages
            }
        }
    };
}

// 从请求中获取分页参数
function getPaginationParams(req): PaginationParams {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    return { page, size };
}
```

## 4. 实施时间表

- 2024年Q4: 完成核心高频API标准化
- 2025年Q2: 完成所有分页API标准化

## 5. 兼容性处理

为保证兼容性，在过渡期间：
1. 入参：同时支持 page/size 和 offset/limit，但文档中已标记 offset/limit 为废弃
2. 出参：新API必须使用新格式，老API逐步迁移