# Mock服务模块

此模块提供了统一的Mock服务管理，用于模拟API请求响应，方便前端开发和测试。

## 目录结构

```
mock/
├── config/            # 配置相关
│   └── index.ts       # 配置管理
├── data/              # 模拟数据
│   └── index.ts       # 数据模型导出
├── middleware/        # 中间件实现
│   └── index.ts       # 请求拦截中间件
├── services/          # 服务实现
│   └── index.ts       # API服务模拟
├── interceptors/      # 拦截器实现
│   └── index.ts       # 请求响应拦截
├── index.ts           # 模块入口
└── README.md          # 说明文档
```

## 使用说明

### 基础用法

```typescript
// 在应用入口(main.ts)中初始化Mock服务
import { setupMockService } from './mock';

// 初始化Mock服务(默认使用环境变量VITE_USE_MOCK_API控制启用状态)
setupMockService();

// 或传入参数控制
setupMockService({
  enabled: true,  // 启用Mock
  delay: 300,     // 响应延迟(毫秒)
  logging: true   // 启用日志
});
```

### 中间件配置

在`vite.config.ts`中配置服务器中间件:

```typescript
import { createCompatibleMockMiddleware } from './src/mock';

export default defineConfig({
  // ...其他配置
  server: {
    // ...
    setupMiddlewares(middlewares) {
      middlewares.use(createCompatibleMockMiddleware());
      return middlewares;
    }
  }
});
```

### API控制

在代码中动态控制Mock服务:

```typescript
import mockService from './mock';

// 检查状态
const isMockEnabled = mockService.isEnabled();

// 启用
mockService.enable();

// 禁用
mockService.disable();

// 更新配置
mockService.updateConfig({
  delay: 500,
  logging: false
});
```

## 注意事项

1. 当前版本保持与旧版Mock系统的兼容性，确保平滑过渡
2. 环境变量`VITE_USE_MOCK_API`控制全局Mock开关
3. 全局变量`window.USE_MOCK`会自动同步Mock状态，用于兼容旧代码

## 迁移策略

当前模块提供了与旧版Mock系统的兼容层，后续会逐步淘汰旧的实现：

1. 第一阶段: 建立新的统一结构(当前阶段)
2. 第二阶段: 迁移数据和服务实现
3. 第三阶段: 迁移拦截器和中间件
4. 第四阶段: 切换入口使用新实现
5. 最终阶段: 移除旧实现