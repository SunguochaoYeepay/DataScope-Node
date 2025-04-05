var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/mock/config.ts
function isMockEnabled() {
  return mockConfig.enabled;
}
function logMock(level, message, ...args) {
  const configLevel = mockConfig.logLevel;
  const levels = {
    "none": 0,
    "error": 1,
    "warn": 2,
    "info": 3,
    "debug": 4
  };
  if (levels[configLevel] >= levels[level]) {
    const prefix = `[Mock ${level.toUpperCase()}]`;
    switch (level) {
      case "error":
        console.error(prefix, message, ...args);
        break;
      case "warn":
        console.warn(prefix, message, ...args);
        break;
      case "info":
        console.info(prefix, message, ...args);
        break;
      case "debug":
        console.debug(prefix, message, ...args);
        break;
    }
  }
}
var isEnabled, mockConfig;
var init_config = __esm({
  "src/mock/config.ts"() {
    isEnabled = () => {
      var _a, _b, _c, _d, _e, _f;
      if (typeof window !== "undefined") {
        if (window.__USE_MOCK_API === false)
          return false;
        if (window.__API_MOCK_DISABLED === true)
          return false;
      }
      if (((_b = (_a = import.meta) == null ? void 0 : _a.env) == null ? void 0 : _b.VITE_USE_MOCK_API) === "false")
        return false;
      if (((_d = (_c = import.meta) == null ? void 0 : _c.env) == null ? void 0 : _d.VITE_USE_MOCK_API) === "true")
        return true;
      const isDevelopment = ((_f = (_e = import.meta) == null ? void 0 : _e.env) == null ? void 0 : _f.MODE) === "development";
      return true;
    };
    mockConfig = {
      // 是否启用模拟服务（唯一开关）
      enabled: isEnabled(),
      // 请求延迟配置（毫秒）
      delay: {
        min: 200,
        max: 600
      },
      // 请求处理配置
      api: {
        // 基础URL
        baseUrl: "http://localhost:5000/api",
        // 是否启用自动模拟（当后端服务不可用时自动切换到模拟模式）
        autoMock: true
      },
      // 模块启用配置
      modules: {
        datasource: true,
        query: true,
        integration: true,
        version: true,
        metadata: true
      },
      // 日志配置
      logging: {
        enabled: true,
        level: "debug"
        // debug, info, warn, error, none
      },
      // 日志级别 - 便于直接访问
      get logLevel() {
        return this.logging.enabled ? this.logging.level : "none";
      }
    };
  }
});

// src/mock/data/datasource.ts
var mockDataSources2;
var init_datasource = __esm({
  "src/mock/data/datasource.ts"() {
    mockDataSources2 = [
      {
        id: "ds-1",
        name: "MySQL\u793A\u4F8B\u6570\u636E\u5E93",
        description: "\u8FDE\u63A5\u5230\u793A\u4F8BMySQL\u6570\u636E\u5E93",
        type: "mysql",
        host: "localhost",
        port: 3306,
        databaseName: "example_db",
        username: "user",
        status: "active",
        syncFrequency: "daily",
        lastSyncTime: new Date(Date.now() - 864e5).toISOString(),
        createdAt: new Date(Date.now() - 2592e6).toISOString(),
        updatedAt: new Date(Date.now() - 864e6).toISOString(),
        isActive: true
      },
      {
        id: "ds-2",
        name: "PostgreSQL\u751F\u4EA7\u5E93",
        description: "\u8FDE\u63A5\u5230PostgreSQL\u751F\u4EA7\u73AF\u5883\u6570\u636E\u5E93",
        type: "postgresql",
        host: "192.168.1.100",
        port: 5432,
        databaseName: "production_db",
        username: "admin",
        status: "active",
        syncFrequency: "hourly",
        lastSyncTime: new Date(Date.now() - 36e5).toISOString(),
        createdAt: new Date(Date.now() - 7776e6).toISOString(),
        updatedAt: new Date(Date.now() - 1728e5).toISOString(),
        isActive: true
      },
      {
        id: "ds-3",
        name: "SQLite\u672C\u5730\u5E93",
        description: "\u8FDE\u63A5\u5230\u672C\u5730SQLite\u6570\u636E\u5E93",
        type: "sqlite",
        databaseName: "/path/to/local.db",
        status: "active",
        syncFrequency: "manual",
        lastSyncTime: null,
        createdAt: new Date(Date.now() - 1728e6).toISOString(),
        updatedAt: new Date(Date.now() - 3456e5).toISOString(),
        isActive: true
      },
      {
        id: "ds-4",
        name: "SQL Server\u6D4B\u8BD5\u5E93",
        description: "\u8FDE\u63A5\u5230SQL Server\u6D4B\u8BD5\u73AF\u5883",
        type: "sqlserver",
        host: "192.168.1.200",
        port: 1433,
        databaseName: "test_db",
        username: "tester",
        status: "inactive",
        syncFrequency: "weekly",
        lastSyncTime: new Date(Date.now() - 6048e5).toISOString(),
        createdAt: new Date(Date.now() - 5184e6).toISOString(),
        updatedAt: new Date(Date.now() - 2592e6).toISOString(),
        isActive: false
      },
      {
        id: "ds-5",
        name: "Oracle\u4F01\u4E1A\u5E93",
        description: "\u8FDE\u63A5\u5230Oracle\u4F01\u4E1A\u6570\u636E\u5E93",
        type: "oracle",
        host: "192.168.1.150",
        port: 1521,
        databaseName: "enterprise_db",
        username: "system",
        status: "active",
        syncFrequency: "daily",
        lastSyncTime: new Date(Date.now() - 1728e5).toISOString(),
        createdAt: new Date(Date.now() - 10368e6).toISOString(),
        updatedAt: new Date(Date.now() - 1728e6).toISOString(),
        isActive: true
      }
    ];
  }
});

// src/mock/services/datasource.ts
async function simulateDelay() {
  const delay2 = typeof mockConfig.delay === "number" ? mockConfig.delay : 300;
  return new Promise((resolve) => setTimeout(resolve, delay2));
}
function resetDataSources() {
  dataSources = [...mockDataSources2];
}
async function getDataSources(params) {
  await simulateDelay();
  const page = (params == null ? void 0 : params.page) || 1;
  const size = (params == null ? void 0 : params.size) || 10;
  let filteredItems = [...dataSources];
  if (params == null ? void 0 : params.name) {
    const keyword = params.name.toLowerCase();
    filteredItems = filteredItems.filter(
      (ds) => ds.name.toLowerCase().includes(keyword) || ds.description && ds.description.toLowerCase().includes(keyword)
    );
  }
  if (params == null ? void 0 : params.type) {
    filteredItems = filteredItems.filter((ds) => ds.type === params.type);
  }
  if (params == null ? void 0 : params.status) {
    filteredItems = filteredItems.filter((ds) => ds.status === params.status);
  }
  const start = (page - 1) * size;
  const end = Math.min(start + size, filteredItems.length);
  const paginatedItems = filteredItems.slice(start, end);
  return {
    items: paginatedItems,
    pagination: {
      total: filteredItems.length,
      page,
      size,
      totalPages: Math.ceil(filteredItems.length / size)
    }
  };
}
async function getDataSource(id) {
  await simulateDelay();
  const dataSource = dataSources.find((ds) => ds.id === id);
  if (!dataSource) {
    throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u6570\u636E\u6E90`);
  }
  return dataSource;
}
async function createDataSource(data) {
  await simulateDelay();
  const newId = `ds-${Date.now()}`;
  const newDataSource = {
    id: newId,
    name: data.name || "New Data Source",
    description: data.description || "",
    type: data.type || "mysql",
    host: data.host,
    port: data.port,
    databaseName: data.databaseName,
    username: data.username,
    status: data.status || "pending",
    syncFrequency: data.syncFrequency || "manual",
    lastSyncTime: null,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    isActive: true
  };
  dataSources.push(newDataSource);
  return newDataSource;
}
async function updateDataSource(id, data) {
  await simulateDelay();
  const index = dataSources.findIndex((ds) => ds.id === id);
  if (index === -1) {
    throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u6570\u636E\u6E90`);
  }
  const updatedDataSource = {
    ...dataSources[index],
    ...data,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  dataSources[index] = updatedDataSource;
  return updatedDataSource;
}
async function deleteDataSource(id) {
  await simulateDelay();
  const index = dataSources.findIndex((ds) => ds.id === id);
  if (index === -1) {
    throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u6570\u636E\u6E90`);
  }
  dataSources.splice(index, 1);
}
async function testConnection(params) {
  await simulateDelay();
  const success = Math.random() > 0.2;
  return {
    success,
    message: success ? "\u8FDE\u63A5\u6210\u529F" : "\u8FDE\u63A5\u5931\u8D25: \u65E0\u6CD5\u8FDE\u63A5\u5230\u6570\u636E\u5E93\u670D\u52A1\u5668",
    details: success ? {
      responseTime: Math.floor(Math.random() * 50) + 10,
      version: "8.0.28",
      connectionId: Math.floor(Math.random() * 1e4) + 1e3
    } : {
      errorCode: "CONNECTION_REFUSED",
      errorDetails: "\u65E0\u6CD5\u5EFA\u7ACB\u5230\u670D\u52A1\u5668\u7684\u8FDE\u63A5\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8BBE\u7F6E\u548C\u51ED\u636E"
    }
  };
}
var dataSources, datasource_default;
var init_datasource2 = __esm({
  "src/mock/services/datasource.ts"() {
    init_datasource();
    init_config();
    dataSources = [...mockDataSources2];
    datasource_default = {
      getDataSources,
      getDataSource,
      createDataSource,
      updateDataSource,
      deleteDataSource,
      testConnection,
      resetDataSources
    };
  }
});

// src/mock/services/utils.ts
function createMockResponse(data, success = true, message) {
  return {
    success,
    data,
    message,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    mockResponse: true
    // 标记为模拟响应
  };
}
function createMockErrorResponse(message, code = "MOCK_ERROR", status = 500) {
  return {
    success: false,
    error: {
      message,
      code,
      statusCode: status
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    mockResponse: true
  };
}
function createPaginationResponse(items, totalItems, page = 1, size = 10) {
  return createMockResponse({
    items,
    pagination: {
      total: totalItems,
      page,
      size,
      totalPages: Math.ceil(totalItems / size),
      hasMore: page * size < totalItems
    }
  });
}
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var init_utils = __esm({
  "src/mock/services/utils.ts"() {
  }
});

// src/mock/services/index.ts
var services_exports = {};
__export(services_exports, {
  createMockErrorResponse: () => createMockErrorResponse,
  createMockResponse: () => createMockResponse,
  createPaginationResponse: () => createPaginationResponse,
  dataSourceService: () => dataSourceService,
  default: () => services_default,
  delay: () => delay,
  queryService: () => queryService
});
var services, dataSourceService, queryService, services_default;
var init_services = __esm({
  "src/mock/services/index.ts"() {
    init_datasource2();
    init_utils();
    services = {
      // 数据源服务
      dataSource: datasource_default,
      // 查询服务
      query: {
        // 临时：这里只定义基本的查询服务接口结构
        // 后续实现具体的查询服务逻辑
        getQueries: async (params) => {
          await delay();
          return createPaginationResponse([], 0, (params == null ? void 0 : params.page) || 1, (params == null ? void 0 : params.size) || 10);
        },
        getQuery: async (id) => {
          await delay();
          return createMockErrorResponse("\u67E5\u8BE2\u670D\u52A1\u5C1A\u672A\u5B9E\u73B0", "NOT_IMPLEMENTED", 501);
        },
        createQuery: async () => {
          await delay();
          return createMockResponse({ id: "temp-query-id" });
        },
        updateQuery: async () => {
          await delay();
          return createMockResponse(true);
        },
        deleteQuery: async () => {
          await delay();
          return createMockResponse(true);
        },
        executeQuery: async () => {
          await delay(500);
          return createMockResponse({ rows: [], columns: [] });
        }
      }
    };
    dataSourceService = services.dataSource;
    queryService = services.query;
    services_default = services;
  }
});

// vite.config.ts
import { defineConfig, loadEnv as viteLoadEnv } from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";

// src/plugins/mockData.ts
var mockDataSources = [
  {
    id: "ds-1",
    name: "MySQL\u793A\u4F8B\u6570\u636E\u5E93",
    description: "\u8FDE\u63A5\u5230\u793A\u4F8BMySQL\u6570\u636E\u5E93",
    type: "mysql",
    host: "localhost",
    port: 3306,
    database: "example_db",
    username: "user",
    status: "active",
    syncFrequency: "daily",
    lastSyncTime: new Date(Date.now() - 864e5).toISOString(),
    createdAt: new Date(Date.now() - 2592e6).toISOString(),
    updatedAt: new Date(Date.now() - 864e6).toISOString(),
    isActive: true
  },
  {
    id: "ds-2",
    name: "PostgreSQL\u751F\u4EA7\u5E93",
    description: "\u8FDE\u63A5\u5230PostgreSQL\u751F\u4EA7\u73AF\u5883\u6570\u636E\u5E93",
    type: "postgresql",
    host: "192.168.1.100",
    port: 5432,
    database: "production_db",
    username: "admin",
    status: "active",
    syncFrequency: "hourly",
    lastSyncTime: new Date(Date.now() - 36e5).toISOString(),
    createdAt: new Date(Date.now() - 7776e6).toISOString(),
    updatedAt: new Date(Date.now() - 1728e5).toISOString(),
    isActive: true
  },
  {
    id: "ds-3",
    name: "SQLite\u672C\u5730\u5E93",
    description: "\u8FDE\u63A5\u5230\u672C\u5730SQLite\u6570\u636E\u5E93",
    type: "sqlite",
    database: "/path/to/local.db",
    status: "active",
    syncFrequency: "manual",
    lastSyncTime: null,
    createdAt: new Date(Date.now() - 1728e6).toISOString(),
    updatedAt: new Date(Date.now() - 3456e5).toISOString(),
    isActive: true
  },
  {
    id: "ds-4",
    name: "SQL Server\u6D4B\u8BD5\u5E93",
    description: "\u8FDE\u63A5\u5230SQL Server\u6D4B\u8BD5\u73AF\u5883",
    type: "sqlserver",
    host: "192.168.1.200",
    port: 1433,
    database: "test_db",
    username: "tester",
    status: "inactive",
    syncFrequency: "weekly",
    lastSyncTime: new Date(Date.now() - 6048e5).toISOString(),
    createdAt: new Date(Date.now() - 5184e6).toISOString(),
    updatedAt: new Date(Date.now() - 2592e6).toISOString(),
    isActive: false
  },
  {
    id: "ds-5",
    name: "Oracle\u4F01\u4E1A\u5E93",
    description: "\u8FDE\u63A5\u5230Oracle\u4F01\u4E1A\u6570\u636E\u5E93",
    type: "oracle",
    host: "192.168.1.150",
    port: 1521,
    database: "enterprise_db",
    username: "system",
    status: "active",
    syncFrequency: "daily",
    lastSyncTime: new Date(Date.now() - 1728e5).toISOString(),
    createdAt: new Date(Date.now() - 10368e6).toISOString(),
    updatedAt: new Date(Date.now() - 1728e6).toISOString(),
    isActive: true
  }
];
var mockMetadata = {
  tables: [
    {
      name: "users",
      schema: "public",
      type: "TABLE",
      description: "\u7528\u6237\u8868",
      rowCount: 1e4,
      totalSize: 2048e3,
      createdAt: new Date(Date.now() - 5184e6).toISOString(),
      columns: [
        { name: "id", type: "INT", nullable: false, primary: true, description: "\u7528\u6237ID" },
        { name: "username", type: "VARCHAR(50)", nullable: false, description: "\u7528\u6237\u540D" },
        { name: "email", type: "VARCHAR(100)", nullable: false, description: "\u7535\u5B50\u90AE\u4EF6" },
        { name: "created_at", type: "TIMESTAMP", nullable: false, description: "\u521B\u5EFA\u65F6\u95F4" }
      ]
    },
    {
      name: "orders",
      schema: "public",
      type: "TABLE",
      description: "\u8BA2\u5355\u8868",
      rowCount: 5e4,
      totalSize: 8192e3,
      createdAt: new Date(Date.now() - 4752e6).toISOString(),
      columns: [
        { name: "id", type: "INT", nullable: false, primary: true, description: "\u8BA2\u5355ID" },
        { name: "user_id", type: "INT", nullable: false, description: "\u7528\u6237ID" },
        { name: "amount", type: "DECIMAL(10,2)", nullable: false, description: "\u8BA2\u5355\u91D1\u989D" },
        { name: "created_at", type: "TIMESTAMP", nullable: false, description: "\u521B\u5EFA\u65F6\u95F4" }
      ]
    },
    {
      name: "products",
      schema: "public",
      type: "TABLE",
      description: "\u4EA7\u54C1\u8868",
      rowCount: 5e3,
      totalSize: 1024e3,
      createdAt: new Date(Date.now() - 432e7).toISOString(),
      columns: [
        { name: "id", type: "INT", nullable: false, primary: true, description: "\u4EA7\u54C1ID" },
        { name: "name", type: "VARCHAR(100)", nullable: false, description: "\u4EA7\u54C1\u540D\u79F0" },
        { name: "price", type: "DECIMAL(10,2)", nullable: false, description: "\u4EA7\u54C1\u4EF7\u683C" },
        { name: "stock", type: "INT", nullable: false, description: "\u5E93\u5B58\u6570\u91CF" }
      ]
    }
  ]
};
var mockQueries = Array.from({ length: 10 }, (_, i) => {
  const id = `query-${i + 1}`;
  const timestamp = new Date(Date.now() - i * 864e5).toISOString();
  return {
    id,
    name: `\u793A\u4F8B\u67E5\u8BE2 ${i + 1}`,
    description: `\u8FD9\u662F\u793A\u4F8B\u67E5\u8BE2 ${i + 1} \u7684\u63CF\u8FF0`,
    folderId: i % 3 === 0 ? "folder-1" : i % 3 === 1 ? "folder-2" : "folder-3",
    dataSourceId: `ds-${i % 5 + 1}`,
    dataSourceName: mockDataSources[i % 5].name,
    queryType: i % 2 === 0 ? "SQL" : "NATURAL_LANGUAGE",
    queryText: i % 2 === 0 ? `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10` : `\u67E5\u627E\u6700\u8FD110\u6761${i % 2 === 0 ? "\u8BA2\u5355" : "\u7528\u6237"}\u8BB0\u5F55`,
    status: i % 4 === 0 ? "DRAFT" : i % 4 === 1 ? "PUBLISHED" : i % 4 === 2 ? "DEPRECATED" : "ARCHIVED",
    serviceStatus: i % 2 === 0 ? "ENABLED" : "DISABLED",
    createdAt: timestamp,
    updatedAt: new Date(Date.now() - i * 432e5).toISOString(),
    createdBy: { id: "user1", name: "\u6D4B\u8BD5\u7528\u6237" },
    updatedBy: { id: "user1", name: "\u6D4B\u8BD5\u7528\u6237" },
    executionCount: Math.floor(Math.random() * 50),
    isFavorite: i % 3 === 0,
    isActive: i % 5 !== 0,
    lastExecutedAt: new Date(Date.now() - i * 432e3).toISOString(),
    resultCount: Math.floor(Math.random() * 100) + 10,
    executionTime: Math.floor(Math.random() * 500) + 10,
    tags: [`\u6807\u7B7E${i + 1}`, `\u7C7B\u578B${i % 3}`],
    currentVersion: {
      id: `ver-${id}-1`,
      queryId: id,
      versionNumber: 1,
      name: "\u5F53\u524D\u7248\u672C",
      sql: `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10`,
      dataSourceId: `ds-${i % 5 + 1}`,
      status: "PUBLISHED",
      isLatest: true,
      createdAt: timestamp
    },
    versions: [{
      id: `ver-${id}-1`,
      queryId: id,
      versionNumber: 1,
      name: "\u5F53\u524D\u7248\u672C",
      sql: `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10`,
      dataSourceId: `ds-${i % 5 + 1}`,
      status: "PUBLISHED",
      isLatest: true,
      createdAt: timestamp
    }]
  };
});
var mockIntegrations = [
  {
    id: "integration-1",
    name: "\u793A\u4F8BREST API",
    description: "\u8FDE\u63A5\u5230\u793A\u4F8BREST API\u670D\u52A1",
    type: "REST",
    baseUrl: "https://api.example.com/v1",
    authType: "BASIC",
    username: "api_user",
    password: "********",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 2592e6).toISOString(),
    updatedAt: new Date(Date.now() - 864e6).toISOString(),
    endpoints: [
      {
        id: "endpoint-1",
        name: "\u83B7\u53D6\u7528\u6237\u5217\u8868",
        method: "GET",
        path: "/users",
        description: "\u83B7\u53D6\u6240\u6709\u7528\u6237\u7684\u5217\u8868"
      },
      {
        id: "endpoint-2",
        name: "\u83B7\u53D6\u5355\u4E2A\u7528\u6237",
        method: "GET",
        path: "/users/{id}",
        description: "\u6839\u636EID\u83B7\u53D6\u5355\u4E2A\u7528\u6237"
      }
    ]
  },
  {
    id: "integration-2",
    name: "\u5929\u6C14API",
    description: "\u8FDE\u63A5\u5230\u5929\u6C14\u9884\u62A5API",
    type: "REST",
    baseUrl: "https://api.weather.com",
    authType: "API_KEY",
    apiKey: "********",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1728e6).toISOString(),
    updatedAt: new Date(Date.now() - 432e6).toISOString(),
    endpoints: [
      {
        id: "endpoint-3",
        name: "\u83B7\u53D6\u5F53\u524D\u5929\u6C14",
        method: "GET",
        path: "/current",
        description: "\u83B7\u53D6\u6307\u5B9A\u4F4D\u7F6E\u7684\u5F53\u524D\u5929\u6C14"
      },
      {
        id: "endpoint-4",
        name: "\u83B7\u53D6\u5929\u6C14\u9884\u62A5",
        method: "GET",
        path: "/forecast",
        description: "\u83B7\u53D6\u672A\u67657\u5929\u7684\u5929\u6C14\u9884\u62A5"
      }
    ]
  },
  {
    id: "integration-3",
    name: "\u652F\u4ED8\u7F51\u5173",
    description: "\u8FDE\u63A5\u5230\u652F\u4ED8\u5904\u7406API",
    type: "REST",
    baseUrl: "https://api.payment.com",
    authType: "OAUTH2",
    clientId: "client123",
    clientSecret: "********",
    status: "INACTIVE",
    createdAt: new Date(Date.now() - 864e6).toISOString(),
    updatedAt: new Date(Date.now() - 1728e5).toISOString(),
    endpoints: [
      {
        id: "endpoint-5",
        name: "\u521B\u5EFA\u652F\u4ED8",
        method: "POST",
        path: "/payments",
        description: "\u521B\u5EFA\u65B0\u7684\u652F\u4ED8\u8BF7\u6C42"
      },
      {
        id: "endpoint-6",
        name: "\u83B7\u53D6\u652F\u4ED8\u72B6\u6001",
        method: "GET",
        path: "/payments/{id}",
        description: "\u68C0\u67E5\u652F\u4ED8\u72B6\u6001"
      },
      {
        id: "endpoint-7",
        name: "\u9000\u6B3E",
        method: "POST",
        path: "/payments/{id}/refund",
        description: "\u5904\u7406\u9000\u6B3E\u8BF7\u6C42"
      }
    ]
  }
];

// src/plugins/serverMock.ts
function createMockServerMiddleware() {
  console.log("[Server] \u521B\u5EFAMock\u670D\u52A1\u5668\u4E2D\u95F4\u4EF6");
  const useMockApi = false;
  console.log("[Server] Mock API\u72B6\u6001:", useMockApi ? "\u542F\u7528" : "\u7981\u7528");
  if (!useMockApi) {
    console.log("[Server] Mock\u670D\u52A1\u5668\u5DF2\u7981\u7528\uFF0C\u6240\u6709\u8BF7\u6C42\u5C06\u76F4\u63A5\u4F20\u9012\u5230\u540E\u7AEF");
    return (req, res, next) => {
      next();
    };
  }
  console.log("[Server] mockDataSources\u957F\u5EA6:", mockDataSources ? mockDataSources.length : "undefined");
  if (mockDataSources && mockDataSources.length > 0) {
    console.log("[Server] \u7B2C\u4E00\u4E2A\u6570\u636E\u6E90\u793A\u4F8B:", JSON.stringify(mockDataSources[0], null, 2));
  }
  return async (req, res, next) => {
    var _a, _b;
    if (!useMockApi || !((_a = req.url) == null ? void 0 : _a.includes("/api/"))) {
      return next();
    }
    if ((_b = req.url) == null ? void 0 : _b.includes("/api/")) {
      console.log("[Server Mock] \u62E6\u622AAPI\u8BF7\u6C42:", req.url, req.method);
      const method = req.method || "GET";
      try {
        const singleQueryMatch = req.url.match(/\/api\/queries\/([^\/\?]+)$/);
        if (singleQueryMatch && method === "GET") {
          const queryId = singleQueryMatch[1];
          console.log("[Server Mock] \u83B7\u53D6\u5355\u4E2A\u67E5\u8BE2:", queryId);
          const query = mockQueries.find((q) => q.id === queryId);
          if (!query) {
            console.warn(`[Server Mock] \u672A\u627E\u5230ID\u4E3A${queryId}\u7684\u67E5\u8BE2\uFF0C\u8FD4\u56DE\u9519\u8BEF\u54CD\u5E94`);
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              success: false,
              message: `\u672A\u627E\u5230ID\u4E3A${queryId}\u7684\u67E5\u8BE2`,
              error: {
                code: "NOT_FOUND",
                message: `\u672A\u627E\u5230ID\u4E3A${queryId}\u7684\u67E5\u8BE2`
              }
            }));
            return;
          }
          console.log("[Server Mock] \u8FD4\u56DE\u67E5\u8BE2\u8BE6\u60C5:", query.id, query.name);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, data: query }));
          return;
        }
        if (req.url.match(/\/api\/queries(\?.*)?$/) && method === "GET") {
          console.log("[Server Mock] \u83B7\u53D6\u67E5\u8BE2\u5217\u8868");
          const urlObj = new URL(`http://localhost${req.url}`);
          const page = parseInt(urlObj.searchParams.get("page") || "1", 10);
          const size = parseInt(urlObj.searchParams.get("size") || "10", 10);
          const start = (page - 1) * size;
          const end = start + size;
          const paginatedQueries = mockQueries.slice(start, Math.min(end, mockQueries.length));
          console.log(`[Server Mock] \u8FD4\u56DE${paginatedQueries.length}\u4E2A\u67E5\u8BE2`);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            success: true,
            data: {
              items: paginatedQueries,
              total: mockQueries.length,
              page,
              size,
              totalPages: Math.ceil(mockQueries.length / size)
            }
          }));
          return;
        }
        if (req.url.match(/\/api\/datasources(\?.*)?$/) && method === "GET") {
          console.log("[Server Mock] \u83B7\u53D6\u6570\u636E\u6E90\u5217\u8868");
          const mockItems = [
            {
              id: "ds-test-1",
              name: "\u6D4B\u8BD5\u6570\u636E\u6E90 1",
              description: "\u7B80\u5316\u7248\u6D4B\u8BD5\u6570\u636E\u6E90",
              type: "mysql",
              host: "localhost",
              port: 3306,
              database: "test_db",
              username: "user",
              status: "active",
              syncFrequency: "manual",
              lastSyncTime: (/* @__PURE__ */ new Date()).toISOString(),
              createdAt: (/* @__PURE__ */ new Date()).toISOString(),
              updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
              isActive: true
            }
          ];
          console.log("[Server Mock] \u8FD4\u56DE\u7B80\u5316\u6570\u636E\u6E90\u5217\u8868");
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            success: true,
            data: {
              items: mockItems,
              pagination: {
                total: mockItems.length,
                totalPages: 1,
                page: 1,
                size: 10
              }
            }
          }));
          return;
        }
        const checkStatusMatch = req.url.match(/\/api\/datasources\/([^\/\?]+)\/check-status/);
        if (checkStatusMatch && method === "GET") {
          const dataSourceId = checkStatusMatch[1];
          console.log("[Server Mock] \u68C0\u67E5\u6570\u636E\u6E90\u72B6\u6001:", dataSourceId);
          const dataSource = mockDataSources.find((ds) => ds.id === dataSourceId);
          if (!dataSource) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              success: false,
              error: {
                statusCode: 404,
                message: `\u672A\u627E\u5230ID\u4E3A${dataSourceId}\u7684\u6570\u636E\u6E90`,
                code: "NOT_FOUND",
                details: null
              }
            }));
            return;
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            success: true,
            data: {
              id: dataSource.id,
              status: dataSource.status,
              isActive: dataSource.isActive,
              lastCheckedAt: (/* @__PURE__ */ new Date()).toISOString(),
              message: dataSource.status === "error" ? "\u8FDE\u63A5\u5931\u8D25" : "\u8FDE\u63A5\u6B63\u5E38",
              details: {
                responseTime: Math.floor(Math.random() * 100) + 10,
                activeConnections: Math.floor(Math.random() * 5) + 1,
                connectionPoolSize: 10
              }
            }
          }));
          return;
        }
        const metadataSyncMatch = req.url.match(/\/api\/metadata\/datasources\/([^\/\?]+)\/sync/);
        if (metadataSyncMatch && method === "POST") {
          const dataSourceId = metadataSyncMatch[1];
          console.log("[Server Mock] \u540C\u6B65\u6570\u636E\u6E90\u5143\u6570\u636E:", dataSourceId);
          const dataSource = mockDataSources.find((ds) => ds.id === dataSourceId);
          if (!dataSource) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              success: false,
              error: {
                statusCode: 404,
                message: `\u672A\u627E\u5230ID\u4E3A${dataSourceId}\u7684\u6570\u636E\u6E90`,
                code: "NOT_FOUND",
                details: null
              }
            }));
            return;
          }
          let requestBody = "";
          req.on("data", (chunk) => {
            requestBody += chunk.toString();
          });
          req.on("end", () => {
            let filters = {};
            try {
              if (requestBody) {
                const data = JSON.parse(requestBody);
                filters = data.filters || {};
                console.log("[Server Mock] \u540C\u6B65\u5143\u6570\u636E\u8FC7\u6EE4\u5668:", filters);
              }
            } catch (e) {
              console.error("[Server Mock] \u89E3\u6790\u540C\u6B65\u53C2\u6570\u5931\u8D25:", e);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              success: true,
              data: {
                success: true,
                syncId: `sync-${Date.now()}`,
                dataSourceId: dataSource.id,
                startTime: (/* @__PURE__ */ new Date()).toISOString(),
                endTime: new Date(Date.now() + 5e3).toISOString(),
                tablesCount: Math.floor(Math.random() * 20) + 5,
                viewsCount: Math.floor(Math.random() * 10) + 1,
                syncDuration: Math.floor(Math.random() * 5e3) + 1e3,
                status: "completed",
                message: "\u540C\u6B65\u5B8C\u6210",
                errors: []
              }
            }));
          });
          return;
        }
        const statsMatch = req.url.match(/\/api\/datasources\/([^\/\?]+)\/stats/);
        if (statsMatch && method === "GET") {
          const dataSourceId = statsMatch[1];
          console.log("[Server Mock] \u83B7\u53D6\u6570\u636E\u6E90\u7EDF\u8BA1\u4FE1\u606F:", dataSourceId);
          const dataSource = mockDataSources.find((ds) => ds.id === dataSourceId);
          if (!dataSource) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              success: false,
              error: {
                statusCode: 404,
                message: `\u672A\u627E\u5230ID\u4E3A${dataSourceId}\u7684\u6570\u636E\u6E90`,
                code: "NOT_FOUND",
                details: null
              }
            }));
            return;
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            success: true,
            data: {
              dataSourceId: dataSource.id,
              tablesCount: Math.floor(Math.random() * 50) + 5,
              viewsCount: Math.floor(Math.random() * 10) + 1,
              totalRows: Math.floor(Math.random() * 1e6) + 1e3,
              totalSize: `${(Math.random() * 100 + 10).toFixed(2)} MB`,
              lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
              queriesCount: Math.floor(Math.random() * 500) + 10,
              connectionPoolSize: Math.floor(Math.random() * 10) + 5,
              activeConnections: Math.floor(Math.random() * 5) + 1,
              avgQueryTime: `${(Math.random() * 100 + 10).toFixed(2)}ms`,
              totalTables: Math.floor(Math.random() * 50) + 5,
              totalViews: Math.floor(Math.random() * 10) + 1,
              totalQueries: Math.floor(Math.random() * 500) + 10,
              avgResponseTime: Math.floor(Math.random() * 100) + 10,
              peakConnections: Math.floor(Math.random() * 20) + 5
            }
          }));
          return;
        }
        const executeQueryMatch = req.url.match(/\/api\/queries\/([^\/\?]+)\/execute/);
        if (executeQueryMatch && method === "POST") {
          const queryId = executeQueryMatch[1];
          console.log("[Server Mock] \u6267\u884C\u67E5\u8BE2:", queryId);
          const mockResult = {
            id: `result-${Date.now()}`,
            queryId,
            status: "COMPLETED",
            executionTime: 253,
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            rowCount: 20,
            columns: ["id", "name", "email", "age", "status", "created_at"],
            fields: [
              { name: "id", type: "integer", displayName: "ID" },
              { name: "name", type: "string", displayName: "\u540D\u79F0" },
              { name: "email", type: "string", displayName: "\u90AE\u7BB1" },
              { name: "age", type: "integer", displayName: "\u5E74\u9F84" },
              { name: "status", type: "string", displayName: "\u72B6\u6001" },
              { name: "created_at", type: "timestamp", displayName: "\u521B\u5EFA\u65F6\u95F4" }
            ],
            rows: Array.from({ length: 20 }, (_, i) => ({
              id: i + 1,
              name: `\u6D4B\u8BD5\u7528\u6237 ${i + 1}`,
              email: `user${i + 1}@example.com`,
              age: Math.floor(Math.random() * 50) + 18,
              status: i % 3 === 0 ? "active" : i % 3 === 1 ? "pending" : "inactive",
              created_at: new Date(Date.now() - i * 864e5).toISOString()
            }))
          };
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, data: mockResult }));
          return;
        }
        console.log(`[Server Mock] \u901A\u7528\u5904\u7406: ${req.url}`);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: true,
          data: { message: `API\u8BF7\u6C42\u5904\u7406\u6210\u529F: ${req.url}` }
        }));
      } catch (error) {
        console.error("[Server Mock] \u5904\u7406API\u8BF7\u6C42\u65F6\u51FA\u9519:", error);
        console.error("[Server Mock] \u9519\u8BEF\u5806\u6808:", error instanceof Error ? error.stack : "No stack trace");
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: false,
          error: {
            statusCode: 500,
            code: "INTERNAL_ERROR",
            message: `\u5904\u7406API\u8BF7\u6C42\u65F6\u53D1\u751F\u5185\u90E8\u9519\u8BEF: ${error instanceof Error ? error.message : String(error)}`,
            details: error instanceof Error ? error.stack : void 0
          }
        }));
      }
      return;
    }
    next();
  };
}

// src/mock/index.ts
init_config();

// src/mock/interceptors/fetch.ts
init_services();
init_config();
init_utils();
var API_MAPPINGS = {
  // 数据源相关API
  "/api/datasources": {
    GET: handleGetDataSources,
    POST: handleCreateDataSource
  },
  "/api/datasources/test": {
    POST: handleTestConnection
  }
};
var originalFetch;
function setupFetchInterceptor() {
  if (!mockConfig.enabled) {
    return;
  }
  if (originalFetch) {
    return;
  }
  originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    try {
      const url = input instanceof Request ? input.url : input.toString();
      const options = input instanceof Request ? { method: input.method, headers: input.headers, body: input.body } : init || {};
      const mockResponse = await handleInterception(url, options);
      if (mockResponse) {
        logMock("info", `Intercepted: ${options.method || "GET"} ${url}`);
        return mockResponse;
      }
      if (originalFetch) {
        return originalFetch(input, init);
      }
      throw new Error("\u539F\u59CBfetch\u672A\u5B9A\u4E49\uFF0C\u62E6\u622A\u5668\u53EF\u80FD\u914D\u7F6E\u9519\u8BEF");
    } catch (error) {
      logMock("error", "Interceptor error:", error);
      const errorData = createMockErrorResponse(
        error instanceof Error ? error.message : "Unknown error in mock interceptor",
        "MOCK_INTERCEPTOR_ERROR"
      );
      return new Response(JSON.stringify(errorData), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  };
  logMock("info", "Fetch interceptor enabled");
}
function removeFetchInterceptor() {
  if (originalFetch) {
    window.fetch = originalFetch;
    originalFetch = void 0;
    logMock("info", "Fetch interceptor removed");
  }
}
async function handleInterception(url, options) {
  if (!mockConfig.enabled) {
    return null;
  }
  try {
    const urlObj = new URL(url, window.location.origin);
    const path2 = urlObj.pathname;
    const method = (options.method || "GET").toUpperCase();
    for (const [pattern, handlers] of Object.entries(API_MAPPINGS)) {
      if (path2.startsWith(pattern) || path2 === pattern) {
        const handler = method in handlers ? handlers[method] : void 0;
        if (handler) {
          const response = await handler(url, options);
          return response;
        }
      }
    }
    return null;
  } catch (error) {
    logMock("error", "Interception error:", error);
    return null;
  }
}
function createResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
async function handleGetDataSources(url, options) {
  const urlObj = new URL(url, window.location.origin);
  const page = parseInt(urlObj.searchParams.get("page") || "1");
  const size = parseInt(urlObj.searchParams.get("size") || "10");
  const name = urlObj.searchParams.get("name") || void 0;
  const type = urlObj.searchParams.get("type") || void 0;
  const status = urlObj.searchParams.get("status") || void 0;
  const pathParts = urlObj.pathname.split("/").filter(Boolean);
  if (pathParts.length === 2 && pathParts[0] === "api" && pathParts[1] === "datasources") {
    try {
      const result = await services_default.dataSource.getDataSources({
        page,
        size,
        name,
        type,
        status
      });
      return createResponse({ success: true, data: result });
    } catch (error) {
      return createResponse({
        success: false,
        error: { message: error instanceof Error ? error.message : "Unknown error" }
      }, 500);
    }
  }
  if (pathParts.length === 3 && pathParts[0] === "api" && pathParts[1] === "datasources") {
    const id = pathParts[2];
    try {
      const result = await services_default.dataSource.getDataSource(id);
      return createResponse({ success: true, data: result });
    } catch (error) {
      return createResponse({
        success: false,
        error: { message: error instanceof Error ? error.message : "Unknown error" }
      }, 404);
    }
  }
  return null;
}
async function handleCreateDataSource(url, options) {
  try {
    const body = options.body ? JSON.parse(options.body) : {};
    const result = await services_default.dataSource.createDataSource(body);
    return createResponse({ success: true, data: result });
  } catch (error) {
    return createResponse({
      success: false,
      error: { message: error instanceof Error ? error.message : "Unknown error" }
    }, 400);
  }
}
async function handleTestConnection(url, options) {
  try {
    const body = options.body ? JSON.parse(options.body) : {};
    const result = await services_default.dataSource.testConnection(body);
    return createResponse({ success: true, data: result });
  } catch (error) {
    return createResponse({
      success: false,
      error: { message: error instanceof Error ? error.message : "Unknown error" }
    }, 400);
  }
}
var fetch_default = {
  setupFetchInterceptor,
  removeFetchInterceptor
};

// src/mock/interceptors/index.ts
function setupInterceptors() {
  fetch_default.setupFetchInterceptor();
}
function removeInterceptors() {
  fetch_default.removeFetchInterceptor();
}
var interceptors_default = {
  setupInterceptors,
  removeInterceptors,
  fetch: fetch_default
};

// src/mock/middleware/index.ts
init_config();
init_services();
init_utils();
var extractRequestBody = async (req) => {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        const bodyStr = Buffer.concat(chunks).toString();
        const body = bodyStr && bodyStr.trim() !== "" ? JSON.parse(bodyStr) : {};
        resolve(body);
      } catch (error) {
        logMock("warn", "\u89E3\u6790\u8BF7\u6C42\u4F53\u5931\u8D25:", error);
        resolve({});
      }
    });
  });
};
var sendJsonResponse = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};
var handleError = (res, error, statusCode = 500) => {
  logMock("error", "\u5904\u7406\u8BF7\u6C42\u51FA\u9519:", error);
  sendJsonResponse(res, statusCode, {
    success: false,
    error: {
      statusCode,
      code: error.code || "MOCK_ERROR",
      message: error instanceof Error ? error.message : String(error),
      details: error instanceof Error ? error.stack : void 0
    }
  });
};
var addDelay = async () => {
  const { delay: delay2 } = mockConfig;
  if (typeof delay2 === "number" && delay2 > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay2));
  } else if (delay2 && typeof delay2 === "object") {
    const { min, max } = delay2;
    const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, randomDelay));
  }
};
var createRequestContext = async (req, res) => {
  var _a;
  const normalizedUrl = ((_a = req.url) == null ? void 0 : _a.replace(/\/api\/api\//, "/api/")) || "/api/";
  const urlParts = normalizedUrl.split("?");
  const path2 = urlParts[0];
  const queryParams = {};
  if (urlParts.length > 1) {
    const urlObj = new URL(`http://localhost${normalizedUrl}`);
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
  }
  const page = parseInt(queryParams.page || "1", 10);
  const size = parseInt(queryParams.size || "10", 10);
  const body = await extractRequestBody(req);
  return {
    req,
    res,
    path: path2,
    method: req.method || "GET",
    queryParams,
    body,
    urlParts,
    normalizedUrl,
    pagination: {
      page,
      size
    }
  };
};
var routeHandlers = {
  // 数据源相关处理器
  async handleDataSourceRoutes(context) {
    const { path: path2, method, body, pagination, res } = context;
    const { page, size } = pagination;
    const singleMatch = path2.match(/\/api\/datasources\/([^\/]+)$/);
    if (singleMatch && method === "GET") {
      const id = singleMatch[1];
      logMock("debug", `\u83B7\u53D6\u6570\u636E\u6E90: ${id}`);
      try {
        const response = await services_default.dataSource.getDataSource(id);
        sendJsonResponse(res, 200, { success: true, data: response });
        return true;
      } catch (error) {
        handleError(res, error, 404);
        return true;
      }
    }
    if (path2.match(/\/api\/datasources\/?$/) && method === "GET") {
      logMock("debug", "\u83B7\u53D6\u6570\u636E\u6E90\u5217\u8868");
      const { name, type, status } = context.queryParams;
      try {
        const response = await services_default.dataSource.getDataSources({
          page,
          size,
          name,
          type,
          status
        });
        sendJsonResponse(res, 200, { success: true, data: response });
        return true;
      } catch (error) {
        handleError(res, error);
        return true;
      }
    }
    if (path2.match(/\/api\/datasources\/?$/) && method === "POST") {
      logMock("debug", "\u521B\u5EFA\u6570\u636E\u6E90");
      try {
        const response = await services_default.dataSource.createDataSource(body);
        sendJsonResponse(res, 201, { success: true, data: response });
        return true;
      } catch (error) {
        handleError(res, error);
        return true;
      }
    }
    const updateMatch = path2.match(/\/api\/datasources\/([^\/]+)$/);
    if (updateMatch && method === "PUT") {
      const id = updateMatch[1];
      logMock("debug", `\u66F4\u65B0\u6570\u636E\u6E90: ${id}`);
      try {
        const response = await services_default.dataSource.updateDataSource(id, body);
        sendJsonResponse(res, 200, { success: true, data: response });
        return true;
      } catch (error) {
        handleError(res, error);
        return true;
      }
    }
    const deleteMatch = path2.match(/\/api\/datasources\/([^\/]+)$/);
    if (deleteMatch && method === "DELETE") {
      const id = deleteMatch[1];
      logMock("debug", `\u5220\u9664\u6570\u636E\u6E90: ${id}`);
      try {
        await services_default.dataSource.deleteDataSource(id);
        sendJsonResponse(res, 200, { success: true, data: { id, deleted: true } });
        return true;
      } catch (error) {
        handleError(res, error);
        return true;
      }
    }
    return false;
  },
  // 查询相关处理器
  async handleQueryRoutes(context) {
    const { path: path2, method, body, pagination, res } = context;
    const { page, size } = pagination;
    if (!services_default.query) {
      return false;
    }
    const singleMatch = path2.match(/\/api\/queries\/([^\/]+)$/);
    if (singleMatch && method === "GET") {
      const id = singleMatch[1];
      logMock("debug", `\u83B7\u53D6\u67E5\u8BE2: ${id}`);
      try {
        const response = await services_default.query.getQuery(id);
        sendJsonResponse(res, 200, { success: true, data: response });
        return true;
      } catch (error) {
        handleError(res, error, 404);
        return true;
      }
    }
    if (path2.match(/\/api\/queries\/?$/) && method === "GET") {
      logMock("debug", "\u83B7\u53D6\u67E5\u8BE2\u5217\u8868");
      try {
        const response = await services_default.query.getQueries({ page, size });
        sendJsonResponse(res, 200, { success: true, data: response });
        return true;
      } catch (error) {
        handleError(res, error);
        return true;
      }
    }
    if (path2.match(/\/api\/queries\/?$/) && method === "POST") {
      logMock("debug", "\u521B\u5EFA\u67E5\u8BE2");
      try {
        const response = await services_default.query.createQuery(body);
        sendJsonResponse(res, 201, { success: true, data: response });
        return true;
      } catch (error) {
        handleError(res, error);
        return true;
      }
    }
    const updateMatch = path2.match(/\/api\/queries\/([^\/]+)$/);
    if (updateMatch && method === "PUT") {
      const id = updateMatch[1];
      logMock("debug", `\u66F4\u65B0\u67E5\u8BE2: ${id}`);
      try {
        const response = await services_default.query.updateQuery(id, body);
        sendJsonResponse(res, 200, { success: true, data: response });
        return true;
      } catch (error) {
        handleError(res, error);
        return true;
      }
    }
    const deleteMatch = path2.match(/\/api\/queries\/([^\/]+)$/);
    if (deleteMatch && method === "DELETE") {
      const id = deleteMatch[1];
      logMock("debug", `\u5220\u9664\u67E5\u8BE2: ${id}`);
      try {
        await services_default.query.deleteQuery(id);
        sendJsonResponse(res, 200, { success: true, data: { id, deleted: true } });
        return true;
      } catch (error) {
        handleError(res, error);
        return true;
      }
    }
    const executeMatch = path2.match(/\/api\/queries\/([^\/]+)\/execute$/);
    if (executeMatch && method === "POST") {
      const id = executeMatch[1];
      logMock("debug", `\u6267\u884C\u67E5\u8BE2: ${id}`);
      try {
        const response = await services_default.query.executeQuery(id, body);
        sendJsonResponse(res, 200, { success: true, data: response });
        return true;
      } catch (error) {
        handleError(res, error);
        return true;
      }
    }
    return false;
  },
  // 通用响应处理器 - 应该放在最后处理
  async handleGenericRoutes(context) {
    const { normalizedUrl, method, res } = context;
    logMock("debug", `\u901A\u7528\u5904\u7406: ${normalizedUrl}`);
    const mockData = createMockResponse({
      message: `\u6A21\u62DF\u54CD\u5E94: ${method} ${normalizedUrl}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    sendJsonResponse(res, 200, { success: true, data: mockData });
    return true;
  }
};
function createMockMiddleware() {
  logMock("info", "\u521B\u5EFAMock\u670D\u52A1\u4E2D\u95F4\u4EF6");
  const enabled = isMockEnabled();
  logMock("info", `Mock\u4E2D\u95F4\u4EF6\u72B6\u6001: ${enabled ? "\u5DF2\u542F\u7528" : "\u5DF2\u7981\u7528"}`);
  if (!enabled) {
    logMock("info", "\u4E2D\u95F4\u4EF6\u5DF2\u7981\u7528\uFF0C\u6240\u6709\u8BF7\u6C42\u5C06\u76F4\u63A5\u4F20\u9012\u5230\u540E\u7AEF");
    return (req, res, next) => next();
  }
  return async (req, res, next) => {
    var _a;
    if (!((_a = req.url) == null ? void 0 : _a.includes("/api/"))) {
      return next();
    }
    logMock("info", `\u62E6\u622AAPI\u8BF7\u6C42: ${req.method} ${req.url}`);
    try {
      await addDelay();
      const context = await createRequestContext(req, res);
      const handlers = [
        routeHandlers.handleDataSourceRoutes,
        routeHandlers.handleQueryRoutes,
        routeHandlers.handleGenericRoutes
      ];
      for (const handler of handlers) {
        const handled = await handler(context);
        if (handled) {
          return;
        }
      }
      next();
    } catch (error) {
      handleError(res, error);
    }
  };
}
function createCompatibleMockMiddleware() {
  const useNewMiddleware = true;
  if (useNewMiddleware) {
    logMock("info", "\u4F7F\u7528\u65B0\u7248Mock\u4E2D\u95F4\u4EF6");
    return createMockMiddleware();
  } else {
    logMock("info", "\u4F7F\u7528\u65E7\u7248(\u517C\u5BB9)\u4E2D\u95F4\u4EF6");
    return createMockServerMiddleware();
  }
}

// src/mock/vite.config.ts
init_config();
function createMockPlugin() {
  return {
    name: "vite:mock-middleware",
    enforce: "pre",
    // 确保在其他中间件之前执行
    configureServer(server) {
      const mockEnabled = isMockEnabled();
      console.log("==== Mock\u670D\u52A1\u914D\u7F6E ====");
      console.log("\u542F\u7528\u72B6\u6001:", mockEnabled);
      console.log("\u914D\u7F6E\u8BE6\u60C5:", {
        enabled: mockConfig.enabled,
        logLevel: mockConfig.logLevel,
        modules: mockConfig.modules
      });
      console.log("====================");
      if (mockEnabled) {
        logMock("info", "Vite\u5F00\u53D1\u670D\u52A1\u5668\u6CE8\u518CMock\u4E2D\u95F4\u4EF6");
        const middleware = createCompatibleMockMiddleware();
        server.middlewares.use((req, res, next) => {
          logMock("debug", `\u6536\u5230\u8BF7\u6C42: ${req.method} ${req.url}`);
          res.on("finish", () => {
            logMock("debug", `\u54CD\u5E94\u5B8C\u6210: ${req.method} ${req.url}, \u72B6\u6001: ${res.statusCode}`);
          });
          middleware(req, res, next);
        });
      } else {
        logMock("info", "Mock\u670D\u52A1\u5DF2\u7981\u7528\uFF0C\u4E0D\u6CE8\u518C\u4E2D\u95F4\u4EF6");
      }
    }
  };
}
var vite_config_default = createMockPlugin;

// src/mock/index.ts
init_services();
function setupMockService() {
  try {
    if (!isMockEnabled()) {
      logMock("info", "Mock\u670D\u52A1\u5DF2\u7981\u7528\uFF0C\u8DF3\u8FC7\u521D\u59CB\u5316");
      return false;
    }
    logMock("info", "\u521D\u59CB\u5316Mock\u670D\u52A1");
    logMock("debug", "\u5F53\u524DMock\u914D\u7F6E:", mockConfig);
    interceptors_default.setupInterceptors();
    logMock("info", "Mock\u670D\u52A1\u521D\u59CB\u5316\u5B8C\u6210");
    return true;
  } catch (error) {
    logMock("error", "\u521D\u59CB\u5316Mock\u670D\u52A1\u5931\u8D25:", error);
    return false;
  }
}
function disableMockService() {
  try {
    logMock("info", "\u7981\u7528Mock\u670D\u52A1");
    interceptors_default.removeInterceptors();
    logMock("info", "Mock\u670D\u52A1\u5DF2\u7981\u7528");
  } catch (error) {
    logMock("error", "\u7981\u7528Mock\u670D\u52A1\u5931\u8D25:", error);
  }
}
var mockService = {
  // 配置和状态
  config: mockConfig,
  isEnabled: isMockEnabled,
  // 拦截器管理
  interceptors: interceptors_default,
  // 服务导出
  services: (init_services(), __toCommonJS(services_exports)).default,
  // Vite插件
  createVitePlugin: vite_config_default,
  // 中间件
  createMiddleware: createCompatibleMockMiddleware,
  // 启用/禁用
  setup: setupMockService,
  disable: disableMockService,
  // 初始化函数，可在应用启动时调用
  init() {
    if (isMockEnabled()) {
      logMock("info", "\u81EA\u52A8\u521D\u59CB\u5316Mock\u670D\u52A1");
      this.setup();
      logMock("debug", "\u5F53\u524DMock\u670D\u52A1\u72B6\u6001: \u5DF2\u542F\u7528");
    } else {
      logMock("info", "Mock\u670D\u52A1\u5DF2\u7981\u7528\uFF0C\u8DF3\u8FC7\u521D\u59CB\u5316");
    }
    return this;
  }
};

// vite.config.ts
import { execSync } from "child_process";
var __vite_injected_original_dirname = "/Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui";
function forceReleasePort(port) {
  try {
    if (process.platform === "win32") {
      execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { stdio: "pipe" }).toString().trim().split("\n").forEach((line) => {
        const match = line.match(/\s+(\d+)$/);
        if (match && match[1]) {
          try {
            execSync(`taskkill /F /PID ${match[1]}`, { stdio: "pipe" });
            console.log(`\u5DF2\u5173\u95ED\u5360\u7528\u7AEF\u53E3 ${port} \u7684\u8FDB\u7A0B PID: ${match[1]}`);
          } catch (e) {
          }
        }
      });
    } else {
      try {
        const pids = execSync(`lsof -i:${port} -t`, { stdio: "pipe" }).toString().trim();
        if (pids) {
          execSync(`kill -9 ${pids}`, { stdio: "pipe" });
          console.log(`\u5DF2\u5173\u95ED\u5360\u7528\u7AEF\u53E3 ${port} \u7684\u8FDB\u7A0B PID: ${pids}`);
        }
      } catch (e) {
      }
    }
  } catch (e) {
    console.log(`\u7AEF\u53E3 ${port} \u672A\u88AB\u5360\u7528\u6216\u65E0\u6CD5\u5173\u95ED\u8FDB\u7A0B`);
  }
}
forceReleasePort(8080);
var vite_config_default2 = defineConfig(({ mode, command }) => {
  const env = viteLoadEnv(mode, process.cwd());
  const disableHMR = process.env.VITE_DISABLE_HMR === "true";
  const useMockApi = process.env.VITE_USE_MOCK_API === "true" || env.VITE_USE_MOCK_API === "true";
  console.log(`\u6784\u5EFA\u6A21\u5F0F: ${mode}, \u4F7F\u7528Mock API: ${useMockApi}, \u7981\u7528HMR: ${disableHMR}`);
  console.log("\u73AF\u5883\u53D8\u91CF:", {
    VITE_USE_MOCK_API: process.env.VITE_USE_MOCK_API || env.VITE_USE_MOCK_API,
    VITE_DISABLE_HMR: process.env.VITE_DISABLE_HMR,
    NODE_ENV: process.env.NODE_ENV
  });
  const plugins = [vue()];
  if (useMockApi) {
    plugins.push(vite_config_default());
  }
  return {
    plugins,
    base: "/",
    // 这里定义应用的基础路径
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src")
      }
    },
    optimizeDeps: {
      // 排除fsevents依赖，避免.node模块加载错误
      exclude: ["fsevents"],
      // 使用项目根目录下的缓存
      cacheDir: ".vite_deps_cache",
      // 强制预构建
      force: true
    },
    // 服务器设置
    server: {
      host: "localhost",
      port: 8080,
      strictPort: true,
      cors: true,
      // 根据环境变量决定是否启用HMR
      hmr: disableHMR ? false : true,
      // 标准模式，非中间件
      middlewareMode: false,
      fs: {
        strict: false,
        allow: ["./src", "./node_modules", "."]
      },
      // 根据模式选择代理或内置Mock
      ...useMockApi ? {
        // 在Mock模式下，不使用代理
      } : {
        // 在正常模式下，使用代理
        proxy: {
          // API请求代理配置
          "/api": {
            target: "http://localhost:5000",
            changeOrigin: true,
            secure: false,
            rewrite: (path2) => {
              console.log("\u4EE3\u7406\u91CD\u5199\u8DEF\u5F84:", path2);
              if (path2.startsWith("/api/api/")) {
                return path2.replace("/api/api/", "/api/");
              }
              return path2;
            }
          }
        }
      },
      headers: {
        // 更新CSP策略，确保允许本地样式加载和Axios的使用
        "Content-Security-Policy": "default-src 'self' http://localhost:5000 https://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http://localhost:5000 ws://localhost:5000 ws://localhost:8080"
      },
      watch: {
        // 确保文件更改时正确重新加载
        usePolling: true
      }
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      // 生产环境移除 console
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  };
});
export {
  vite_config_default2 as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svY29uZmlnLnRzIiwgInNyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzIiwgInZpdGUuY29uZmlnLnRzIiwgInNyYy9wbHVnaW5zL21vY2tEYXRhLnRzIiwgInNyYy9wbHVnaW5zL3NlcnZlck1vY2sudHMiLCAic3JjL21vY2svaW5kZXgudHMiLCAic3JjL21vY2svaW50ZXJjZXB0b3JzL2ZldGNoLnRzIiwgInNyYy9tb2NrL2ludGVyY2VwdG9ycy9pbmRleC50cyIsICJzcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzIiwgInNyYy9tb2NrL3ZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjsvKipcbiAqIFx1NkEyMVx1NjJERlx1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVxuICogXHU5NkM2XHU0RTJEXHU3QkExXHU3NDA2XHU2MjQwXHU2NzA5XHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHU3NkY4XHU1MTczXHU3Njg0XHU5MTREXHU3RjZFXHVGRjBDXHU0RjVDXHU0RTNBXHU1MzU1XHU0RTAwXHU3NzFGXHU3NkY4XHU2NzY1XHU2RTkwXG4gKi9cblxuLy8gXHU2OEMwXHU2N0U1XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU1NDhDXHU1MTY4XHU1QzQwXHU4QkJFXHU3RjZFXG5jb25zdCBpc0VuYWJsZWQgPSAoKSA9PiB7XG4gIC8vIFx1NjhDMFx1NjdFNVx1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1RkYwOFx1OEZEMFx1ODg0Q1x1NjVGNlx1RkYwOVxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGlmICgod2luZG93IGFzIGFueSkuX19VU0VfTU9DS19BUEkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCh3aW5kb3cgYXMgYW55KS5fX0FQSV9NT0NLX0RJU0FCTEVEID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFx1NjhDMFx1NjdFNVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1RkYwOFx1N0YxNlx1OEJEMVx1NjVGNlx1RkYwOVxuICAvLyBcdTU5ODJcdTY3OUNcdTY2MEVcdTc4NkVcdThCQkVcdTdGNkVcdTRFM0FmYWxzZVx1RkYwQ1x1NTIxOVx1Nzk4MVx1NzUyOFxuICBpZiAoaW1wb3J0Lm1ldGE/LmVudj8uVklURV9VU0VfTU9DS19BUEkgPT09IFwiZmFsc2VcIikgcmV0dXJuIGZhbHNlO1xuICBcbiAgLy8gXHU1OTgyXHU2NzlDXHU2NjBFXHU3ODZFXHU4QkJFXHU3RjZFXHU0RTNBdHJ1ZVx1RkYwQ1x1NTIxOVx1NTQyRlx1NzUyOFxuICBpZiAoaW1wb3J0Lm1ldGE/LmVudj8uVklURV9VU0VfTU9DS19BUEkgPT09IFwidHJ1ZVwiKSByZXR1cm4gdHJ1ZTtcbiAgXG4gIC8vIFx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NEUwQlx1OUVEOFx1OEJBNFx1NTQyRlx1NzUyOFx1RkYwQ1x1NTE3Nlx1NEVENlx1NzNBRlx1NTg4M1x1OUVEOFx1OEJBNFx1Nzk4MVx1NzUyOFxuICBjb25zdCBpc0RldmVsb3BtZW50ID0gaW1wb3J0Lm1ldGE/LmVudj8uTU9ERSA9PT0gXCJkZXZlbG9wbWVudFwiO1xuICBcbiAgLy8gXHU1RjNBXHU1MjM2XHU1RjAwXHU1NDJGTW9ja1x1NjcwRFx1NTJBMVx1NzUyOFx1NEU4RVx1NkQ0Qlx1OEJENVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIFx1NUI5QVx1NEU0OVx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQlx1N0M3Qlx1NTc4QlxuZXhwb3J0IHR5cGUgTG9nTGV2ZWwgPSAnbm9uZScgfCAnZXJyb3InIHwgJ3dhcm4nIHwgJ2luZm8nIHwgJ2RlYnVnJztcblxuZXhwb3J0IGNvbnN0IG1vY2tDb25maWcgPSB7XG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOFx1NkEyMVx1NjJERlx1NjcwRFx1NTJBMVx1RkYwOFx1NTUyRlx1NEUwMFx1NUYwMFx1NTE3M1x1RkYwOVxuICBlbmFibGVkOiBpc0VuYWJsZWQoKSxcbiAgXG4gIC8vIFx1OEJGN1x1NkM0Mlx1NUVGNlx1OEZERlx1OTE0RFx1N0Y2RVx1RkYwOFx1NkJFQlx1NzlEMlx1RkYwOVxuICBkZWxheToge1xuICAgIG1pbjogMjAwLFxuICAgIG1heDogNjAwXG4gIH0sXG4gIFxuICAvLyBcdThCRjdcdTZDNDJcdTU5MDRcdTc0MDZcdTkxNERcdTdGNkVcbiAgYXBpOiB7XG4gICAgLy8gXHU1N0ZBXHU3ODQwVVJMXG4gICAgYmFzZVVybDogXCJodHRwOi8vbG9jYWxob3N0OjUwMDAvYXBpXCIsXG4gICAgXG4gICAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XHU4MUVBXHU1MkE4XHU2QTIxXHU2MkRGXHVGRjA4XHU1RjUzXHU1NDBFXHU3QUVGXHU2NzBEXHU1MkExXHU0RTBEXHU1M0VGXHU3NTI4XHU2NUY2XHU4MUVBXHU1MkE4XHU1MjA3XHU2MzYyXHU1MjMwXHU2QTIxXHU2MkRGXHU2QTIxXHU1RjBGXHVGRjA5XG4gICAgYXV0b01vY2s6IHRydWVcbiAgfSxcbiAgXG4gIC8vIFx1NkEyMVx1NTc1N1x1NTQyRlx1NzUyOFx1OTE0RFx1N0Y2RVxuICBtb2R1bGVzOiB7XG4gICAgZGF0YXNvdXJjZTogdHJ1ZSxcbiAgICBxdWVyeTogdHJ1ZSxcbiAgICBpbnRlZ3JhdGlvbjogdHJ1ZSxcbiAgICB2ZXJzaW9uOiB0cnVlLFxuICAgIG1ldGFkYXRhOiB0cnVlXG4gIH0sXG4gIFxuICAvLyBcdTY1RTVcdTVGRDdcdTkxNERcdTdGNkVcbiAgbG9nZ2luZzoge1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgbGV2ZWw6IFwiZGVidWdcIiAvLyBkZWJ1ZywgaW5mbywgd2FybiwgZXJyb3IsIG5vbmVcbiAgfSxcbiAgXG4gIC8vIFx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQiAtIFx1NEZCRlx1NEU4RVx1NzZGNFx1NjNBNVx1OEJCRlx1OTVFRVxuICBnZXQgbG9nTGV2ZWwoKTogTG9nTGV2ZWwge1xuICAgIHJldHVybiB0aGlzLmxvZ2dpbmcuZW5hYmxlZCA/ICh0aGlzLmxvZ2dpbmcubGV2ZWwgYXMgTG9nTGV2ZWwpIDogJ25vbmUnO1xuICB9XG59O1xuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NkEyMVx1NjJERlx1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNNb2NrRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgLy8gXHU3ODZFXHU0RkREXHU4RkQ0XHU1NkRFdHJ1ZVx1NEVFNVx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgcmV0dXJuIG1vY2tDb25maWcuZW5hYmxlZDtcbn1cblxuLyoqXG4gKiBcdTY4QzBcdTY3RTVcdTcyNzlcdTVCOUFcdTZBMjFcdTU3NTdcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhcdTZBMjFcdTYyREZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTW9kdWxlRW5hYmxlZChtb2R1bGVOYW1lOiBrZXlvZiB0eXBlb2YgbW9ja0NvbmZpZy5tb2R1bGVzKTogYm9vbGVhbiB7XG4gIHJldHVybiBtb2NrQ29uZmlnLmVuYWJsZWQgJiYgbW9ja0NvbmZpZy5tb2R1bGVzW21vZHVsZU5hbWVdO1xufVxuXG4vKipcbiAqIFx1OEJCMFx1NUY1NVx1NkEyMVx1NjJERlx1NjcwRFx1NTJBMVx1NzZGOFx1NTE3M1x1NjVFNVx1NUZEN1xuICovXG5leHBvcnQgZnVuY3Rpb24gbG9nTW9jayhsZXZlbDogTG9nTGV2ZWwsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgY29uc3QgY29uZmlnTGV2ZWwgPSBtb2NrQ29uZmlnLmxvZ0xldmVsO1xuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCXHU0RjE4XHU1MTQ4XHU3RUE3OiBub25lIDwgZXJyb3IgPCB3YXJuIDwgaW5mbyA8IGRlYnVnXG4gIGNvbnN0IGxldmVsczogUmVjb3JkPExvZ0xldmVsLCBudW1iZXI+ID0ge1xuICAgICdub25lJzogMCxcbiAgICAnZXJyb3InOiAxLFxuICAgICd3YXJuJzogMixcbiAgICAnaW5mbyc6IDMsXG4gICAgJ2RlYnVnJzogNFxuICB9O1xuICBcbiAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1RTk0XHU4QkIwXHU1RjU1XHU2QjY0XHU3RUE3XHU1MjJCXHU3Njg0XHU2NUU1XHU1RkQ3XG4gIGlmIChsZXZlbHNbY29uZmlnTGV2ZWxdID49IGxldmVsc1tsZXZlbF0pIHtcbiAgICBjb25zdCBwcmVmaXggPSBgW01vY2sgJHtsZXZlbC50b1VwcGVyQ2FzZSgpfV1gO1xuICAgIFxuICAgIHN3aXRjaCAobGV2ZWwpIHtcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgY29uc29sZS5lcnJvcihwcmVmaXgsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dhcm4nOlxuICAgICAgICBjb25zb2xlLndhcm4ocHJlZml4LCBtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgY29uc29sZS5pbmZvKHByZWZpeCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGVidWcnOlxuICAgICAgICBjb25zb2xlLmRlYnVnKHByZWZpeCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NUY1M1x1NTI0RE1vY2tcdTkxNERcdTdGNkVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1vY2tDb25maWcoKSB7XG4gIHJldHVybiB7IC4uLm1vY2tDb25maWcgfTtcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHNcIjsvKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5MFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY1NzBcdTYzNkVcdTZFOTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdUZGMENcdTc1MjhcdTRFOEVcdTVGMDBcdTUzRDFcdTU0OENcdTZENEJcdThCRDVcbiAqL1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTdDN0JcdTU3OEJcbmV4cG9ydCB0eXBlIERhdGFTb3VyY2VUeXBlID0gJ215c3FsJyB8ICdwb3N0Z3Jlc3FsJyB8ICdvcmFjbGUnIHwgJ3NxbHNlcnZlcicgfCAnc3FsaXRlJztcblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU3MkI2XHU2MDAxXG5leHBvcnQgdHlwZSBEYXRhU291cmNlU3RhdHVzID0gJ2FjdGl2ZScgfCAnaW5hY3RpdmUnIHwgJ2Vycm9yJyB8ICdwZW5kaW5nJztcblxuLy8gXHU1NDBDXHU2QjY1XHU5ODkxXHU3Mzg3XG5leHBvcnQgdHlwZSBTeW5jRnJlcXVlbmN5ID0gJ21hbnVhbCcgfCAnaG91cmx5JyB8ICdkYWlseScgfCAnd2Vla2x5JyB8ICdtb250aGx5JztcblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU2M0E1XHU1M0UzXG5leHBvcnQgaW50ZXJmYWNlIERhdGFTb3VyY2Uge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICB0eXBlOiBEYXRhU291cmNlVHlwZTtcbiAgaG9zdD86IHN0cmluZztcbiAgcG9ydD86IG51bWJlcjtcbiAgZGF0YWJhc2VOYW1lPzogc3RyaW5nO1xuICB1c2VybmFtZT86IHN0cmluZztcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gIHN0YXR1czogRGF0YVNvdXJjZVN0YXR1cztcbiAgc3luY0ZyZXF1ZW5jeT86IFN5bmNGcmVxdWVuY3k7XG4gIGxhc3RTeW5jVGltZT86IHN0cmluZyB8IG51bGw7XG4gIGNyZWF0ZWRBdDogc3RyaW5nO1xuICB1cGRhdGVkQXQ6IHN0cmluZztcbiAgaXNBY3RpdmU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKi9cbmV4cG9ydCBjb25zdCBtb2NrRGF0YVNvdXJjZXM6IERhdGFTb3VyY2VbXSA9IFtcbiAge1xuICAgIGlkOiAnZHMtMScsXG4gICAgbmFtZTogJ015U1FMXHU3OTNBXHU0RjhCXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4Qk15U1FMXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnbXlzcWwnLFxuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHBvcnQ6IDMzMDYsXG4gICAgZGF0YWJhc2VOYW1lOiAnZXhhbXBsZV9kYicsXG4gICAgdXNlcm5hbWU6ICd1c2VyJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdkYWlseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMicsXG4gICAgbmFtZTogJ1Bvc3RncmVTUUxcdTc1MUZcdTRFQTdcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ3Bvc3RncmVzcWwnLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMTAwJyxcbiAgICBwb3J0OiA1NDMyLFxuICAgIGRhdGFiYXNlTmFtZTogJ3Byb2R1Y3Rpb25fZGInLFxuICAgIHVzZXJuYW1lOiAnYWRtaW4nLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2hvdXJseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzYwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA3Nzc2MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0zJyxcbiAgICBuYW1lOiAnU1FMaXRlXHU2NzJDXHU1NzMwXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NjcyQ1x1NTczMFNRTGl0ZVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ3NxbGl0ZScsXG4gICAgZGF0YWJhc2VOYW1lOiAnL3BhdGgvdG8vbG9jYWwuZGInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzQ1NjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTQnLFxuICAgIG5hbWU6ICdTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFNRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTczQUZcdTU4ODMnLFxuICAgIHR5cGU6ICdzcWxzZXJ2ZXInLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMjAwJyxcbiAgICBwb3J0OiAxNDMzLFxuICAgIGRhdGFiYXNlTmFtZTogJ3Rlc3RfZGInLFxuICAgIHVzZXJuYW1lOiAndGVzdGVyJyxcbiAgICBzdGF0dXM6ICdpbmFjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ3dlZWtseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNjA0ODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDUxODQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogZmFsc2VcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtNScsXG4gICAgbmFtZTogJ09yYWNsZVx1NEYwMVx1NEUxQVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBPcmFjbGVcdTRGMDFcdTRFMUFcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdvcmFjbGUnLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMTUwJyxcbiAgICBwb3J0OiAxNTIxLFxuICAgIGRhdGFiYXNlTmFtZTogJ2VudGVycHJpc2VfZGInLFxuICAgIHVzZXJuYW1lOiAnc3lzdGVtJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdkYWlseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDEwMzY4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfVxuXTtcblxuLyoqXG4gKiBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBjb3VudCBcdTc1MUZcdTYyMTBcdTY1NzBcdTkxQ0ZcbiAqIEByZXR1cm5zIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1N0VDNFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVNb2NrRGF0YVNvdXJjZXMoY291bnQ6IG51bWJlciA9IDUpOiBEYXRhU291cmNlW10ge1xuICBjb25zdCB0eXBlczogRGF0YVNvdXJjZVR5cGVbXSA9IFsnbXlzcWwnLCAncG9zdGdyZXNxbCcsICdvcmFjbGUnLCAnc3Fsc2VydmVyJywgJ3NxbGl0ZSddO1xuICBjb25zdCBzdGF0dXNlczogRGF0YVNvdXJjZVN0YXR1c1tdID0gWydhY3RpdmUnLCAnaW5hY3RpdmUnLCAnZXJyb3InLCAncGVuZGluZyddO1xuICBjb25zdCBzeW5jRnJlcXM6IFN5bmNGcmVxdWVuY3lbXSA9IFsnbWFudWFsJywgJ2hvdXJseScsICdkYWlseScsICd3ZWVrbHknLCAnbW9udGhseSddO1xuICBcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVzW2kgJSB0eXBlcy5sZW5ndGhdO1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBgZHMtZ2VuLSR7aSArIDF9YCxcbiAgICAgIG5hbWU6IGBcdTc1MUZcdTYyMTBcdTc2ODQke3R5cGV9XHU2NTcwXHU2MzZFXHU2RTkwICR7aSArIDF9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU3Njg0JHt0eXBlfVx1N0M3Qlx1NTc4Qlx1NjU3MFx1NjM2RVx1NkU5MCAke2kgKyAxfWAsXG4gICAgICB0eXBlLFxuICAgICAgaG9zdDogdHlwZSAhPT0gJ3NxbGl0ZScgPyAnbG9jYWxob3N0JyA6IHVuZGVmaW5lZCxcbiAgICAgIHBvcnQ6IHR5cGUgIT09ICdzcWxpdGUnID8gKDMzMDYgKyBpKSA6IHVuZGVmaW5lZCxcbiAgICAgIGRhdGFiYXNlTmFtZTogdHlwZSA9PT0gJ3NxbGl0ZScgPyBgL3BhdGgvdG8vZGJfJHtpfS5kYmAgOiBgZXhhbXBsZV9kYl8ke2l9YCxcbiAgICAgIHVzZXJuYW1lOiB0eXBlICE9PSAnc3FsaXRlJyA/IGB1c2VyXyR7aX1gIDogdW5kZWZpbmVkLFxuICAgICAgc3RhdHVzOiBzdGF0dXNlc1tpICUgc3RhdHVzZXMubGVuZ3RoXSxcbiAgICAgIHN5bmNGcmVxdWVuY3k6IHN5bmNGcmVxc1tpICUgc3luY0ZyZXFzLmxlbmd0aF0sXG4gICAgICBsYXN0U3luY1RpbWU6IGkgJSAzID09PSAwID8gbnVsbCA6IG5ldyBEYXRlKG5vdyAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUobm93IC0gKGkgKyAxMCkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUobm93IC0gaSAqIDQzMjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgaXNBY3RpdmU6IGkgJSA0ICE9PSAwXG4gICAgfTtcbiAgfSk7XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1OUVEOFx1OEJBNFx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuZXhwb3J0IGRlZmF1bHQgbW9ja0RhdGFTb3VyY2VzOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHNcIjsvKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5ME1vY2tcdTY3MERcdTUyQTFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2NTcwXHU2MzZFXHU2RTkwXHU3NkY4XHU1MTczQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU1QjlFXHU3M0IwXG4gKi9cblxuaW1wb3J0IHsgbW9ja0RhdGFTb3VyY2VzIH0gZnJvbSAnLi4vZGF0YS9kYXRhc291cmNlJztcbmltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZSB9IGZyb20gJy4uL2RhdGEvZGF0YXNvdXJjZSc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU0RTM0XHU2NUY2XHU1QjU4XHU1MEE4XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHVGRjBDXHU1MTQxXHU4QkI4XHU2QTIxXHU2MkRGXHU1ODlFXHU1MjIwXHU2NTM5XHU2NENEXHU0RjVDXG5sZXQgZGF0YVNvdXJjZXMgPSBbLi4ubW9ja0RhdGFTb3VyY2VzXTtcblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXkgPSB0eXBlb2YgbW9ja0NvbmZpZy5kZWxheSA9PT0gJ251bWJlcicgPyBtb2NrQ29uZmlnLmRlbGF5IDogMzAwO1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG59XG5cbi8qKlxuICogXHU5MUNEXHU3RjZFXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU2MzZFXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldERhdGFTb3VyY2VzKCk6IHZvaWQge1xuICBkYXRhU291cmNlcyA9IFsuLi5tb2NrRGF0YVNvdXJjZXNdO1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICogQHBhcmFtIHBhcmFtcyBcdTY3RTVcdThCRTJcdTUzQzJcdTY1NzBcbiAqIEByZXR1cm5zIFx1NTIwNlx1OTg3NVx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YVNvdXJjZXMocGFyYW1zPzoge1xuICBwYWdlPzogbnVtYmVyO1xuICBzaXplPzogbnVtYmVyO1xuICBuYW1lPzogc3RyaW5nO1xuICB0eXBlPzogc3RyaW5nO1xuICBzdGF0dXM/OiBzdHJpbmc7XG59KTogUHJvbWlzZTx7XG4gIGl0ZW1zOiBEYXRhU291cmNlW107XG4gIHBhZ2luYXRpb246IHtcbiAgICB0b3RhbDogbnVtYmVyO1xuICAgIHBhZ2U6IG51bWJlcjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgdG90YWxQYWdlczogbnVtYmVyO1xuICB9O1xufT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICBcbiAgLy8gXHU1RTk0XHU3NTI4XHU4RkM3XHU2RUU0XG4gIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLmRhdGFTb3VyY2VzXTtcbiAgXG4gIC8vIFx1NjMwOVx1NTQwRFx1NzlGMFx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy5uYW1lKSB7XG4gICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IFxuICAgICAgZHMubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgKGRzLmRlc2NyaXB0aW9uICYmIGRzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgKTtcbiAgfVxuICBcbiAgLy8gXHU2MzA5XHU3QzdCXHU1NzhCXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/LnR5cGUpIHtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gZHMudHlwZSA9PT0gcGFyYW1zLnR5cGUpO1xuICB9XG4gIFxuICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IGRzLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gIH1cbiAgXG4gIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKTtcbiAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICBcbiAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gIHJldHVybiB7XG4gICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgIHBhZ2UsXG4gICAgICBzaXplLFxuICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqIEByZXR1cm5zIFx1NjU3MFx1NjM2RVx1NkU5MFx1OEJFNlx1NjBDNVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YVNvdXJjZShpZDogc3RyaW5nKTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTY3RTVcdTYyN0VcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2VzLmZpbmQoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmICghZGF0YVNvdXJjZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICByZXR1cm4gZGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBkYXRhIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1NjM2RVxuICogQHJldHVybnMgXHU1MjFCXHU1RUZBXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVEYXRhU291cmNlKGRhdGE6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMElEXG4gIGNvbnN0IG5ld0lkID0gYGRzLSR7RGF0ZS5ub3coKX1gO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IG5ld0RhdGFTb3VyY2U6IERhdGFTb3VyY2UgPSB7XG4gICAgaWQ6IG5ld0lkLFxuICAgIG5hbWU6IGRhdGEubmFtZSB8fCAnTmV3IERhdGEgU291cmNlJyxcbiAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICB0eXBlOiBkYXRhLnR5cGUgfHwgJ215c3FsJyxcbiAgICBob3N0OiBkYXRhLmhvc3QsXG4gICAgcG9ydDogZGF0YS5wb3J0LFxuICAgIGRhdGFiYXNlTmFtZTogZGF0YS5kYXRhYmFzZU5hbWUsXG4gICAgdXNlcm5hbWU6IGRhdGEudXNlcm5hbWUsXG4gICAgc3RhdHVzOiBkYXRhLnN0YXR1cyB8fCAncGVuZGluZycsXG4gICAgc3luY0ZyZXF1ZW5jeTogZGF0YS5zeW5jRnJlcXVlbmN5IHx8ICdtYW51YWwnLFxuICAgIGxhc3RTeW5jVGltZTogbnVsbCxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9O1xuICBcbiAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU1MjE3XHU4ODY4XG4gIGRhdGFTb3VyY2VzLnB1c2gobmV3RGF0YVNvdXJjZSk7XG4gIFxuICByZXR1cm4gbmV3RGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICogQHBhcmFtIGRhdGEgXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXG4gKiBAcmV0dXJucyBcdTY2RjRcdTY1QjBcdTU0MEVcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZURhdGFTb3VyY2UoaWQ6IHN0cmluZywgZGF0YTogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2MjdFXHU1MjMwXHU4OTgxXHU2NkY0XHU2NUIwXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXHU3RDIyXHU1RjE1XG4gIGNvbnN0IGluZGV4ID0gZGF0YVNvdXJjZXMuZmluZEluZGV4KGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIC8vIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCB1cGRhdGVkRGF0YVNvdXJjZTogRGF0YVNvdXJjZSA9IHtcbiAgICAuLi5kYXRhU291cmNlc1tpbmRleF0sXG4gICAgLi4uZGF0YSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICB9O1xuICBcbiAgLy8gXHU2NkZGXHU2MzYyXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGRhdGFTb3VyY2VzW2luZGV4XSA9IHVwZGF0ZWREYXRhU291cmNlO1xuICBcbiAgcmV0dXJuIHVwZGF0ZWREYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVEYXRhU291cmNlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjI3RVx1NTIzMFx1ODk4MVx1NTIyMFx1OTY2NFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFx1N0QyMlx1NUYxNVxuICBjb25zdCBpbmRleCA9IGRhdGFTb3VyY2VzLmZpbmRJbmRleChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgZGF0YVNvdXJjZXMuc3BsaWNlKGluZGV4LCAxKTtcbn1cblxuLyoqXG4gKiBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAqIEBwYXJhbSBwYXJhbXMgXHU4RkRFXHU2M0E1XHU1M0MyXHU2NTcwXG4gKiBAcmV0dXJucyBcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTdFRDNcdTY3OUNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3RDb25uZWN0aW9uKHBhcmFtczogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8e1xuICBzdWNjZXNzOiBib29sZWFuO1xuICBtZXNzYWdlPzogc3RyaW5nO1xuICBkZXRhaWxzPzogYW55O1xufT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU1QjlFXHU5NjQ1XHU0RjdGXHU3NTI4XHU2NUY2XHU1M0VGXHU4MEZEXHU0RjFBXHU2NzA5XHU2NkY0XHU1OTBEXHU2NzQyXHU3Njg0XHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU5MDNCXHU4RjkxXG4gIC8vIFx1OEZEOVx1OTFDQ1x1N0I4MFx1NTM1NVx1NkEyMVx1NjJERlx1NjIxMFx1NTI5Ri9cdTU5MzFcdThEMjVcbiAgY29uc3Qgc3VjY2VzcyA9IE1hdGgucmFuZG9tKCkgPiAwLjI7IC8vIDgwJVx1NjIxMFx1NTI5Rlx1NzM4N1xuICBcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzLFxuICAgIG1lc3NhZ2U6IHN1Y2Nlc3MgPyAnXHU4RkRFXHU2M0E1XHU2MjEwXHU1MjlGJyA6ICdcdThGREVcdTYzQTVcdTU5MzFcdThEMjU6IFx1NjVFMFx1NkNENVx1OEZERVx1NjNBNVx1NTIzMFx1NjU3MFx1NjM2RVx1NUU5M1x1NjcwRFx1NTJBMVx1NTY2OCcsXG4gICAgZGV0YWlsczogc3VjY2VzcyA/IHtcbiAgICAgIHJlc3BvbnNlVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApICsgMTAsXG4gICAgICB2ZXJzaW9uOiAnOC4wLjI4JyxcbiAgICAgIGNvbm5lY3Rpb25JZDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApICsgMTAwMFxuICAgIH0gOiB7XG4gICAgICBlcnJvckNvZGU6ICdDT05ORUNUSU9OX1JFRlVTRUQnLFxuICAgICAgZXJyb3JEZXRhaWxzOiAnXHU2NUUwXHU2Q0Q1XHU1RUZBXHU3QUNCXHU1MjMwXHU2NzBEXHU1MkExXHU1NjY4XHU3Njg0XHU4RkRFXHU2M0E1XHVGRjBDXHU4QkY3XHU2OEMwXHU2N0U1XHU3RjUxXHU3RURDXHU4QkJFXHU3RjZFXHU1NDhDXHU1MUVEXHU2MzZFJ1xuICAgIH1cbiAgfTtcbn1cblxuLy8gXHU1QkZDXHU1MUZBXHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldERhdGFTb3VyY2VzLFxuICBnZXREYXRhU291cmNlLFxuICBjcmVhdGVEYXRhU291cmNlLFxuICB1cGRhdGVEYXRhU291cmNlLFxuICBkZWxldGVEYXRhU291cmNlLFxuICB0ZXN0Q29ubmVjdGlvbixcbiAgcmVzZXREYXRhU291cmNlc1xufTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy91dGlscy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvdXRpbHMudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTkwMUFcdTc1MjhcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU1MjFCXHU1RUZBXHU3RURGXHU0RTAwXHU2ODNDXHU1RjBGXHU1NENEXHU1RTk0XHU3Njg0XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG4gKi9cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTZBMjFcdTYyREZBUElcdTYyMTBcdTUyOUZcdTU0Q0RcdTVFOTRcbiAqIEBwYXJhbSBkYXRhIFx1NTRDRFx1NUU5NFx1NjU3MFx1NjM2RVxuICogQHBhcmFtIHN1Y2Nlc3MgXHU2MjEwXHU1MjlGXHU3MkI2XHU2MDAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBdHJ1ZVxuICogQHBhcmFtIG1lc3NhZ2UgXHU1M0VGXHU5MDA5XHU2RDg4XHU2MDZGXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTY4M0NcdTVGMEZcdTc2ODRBUElcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tSZXNwb25zZTxUPihcbiAgZGF0YTogVCwgXG4gIHN1Y2Nlc3M6IGJvb2xlYW4gPSB0cnVlLCBcbiAgbWVzc2FnZT86IHN0cmluZ1xuKSB7XG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBkYXRhLFxuICAgIG1lc3NhZ2UsXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgbW9ja1Jlc3BvbnNlOiB0cnVlIC8vIFx1NjgwN1x1OEJCMFx1NEUzQVx1NkEyMVx1NjJERlx1NTRDRFx1NUU5NFxuICB9O1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NkEyMVx1NjJERkFQSVx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICogQHBhcmFtIG1lc3NhZ2UgXHU5NTE5XHU4QkVGXHU2RDg4XHU2MDZGXG4gKiBAcGFyYW0gY29kZSBcdTk1MTlcdThCRUZcdTRFRTNcdTc4MDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0EnTU9DS19FUlJPUidcbiAqIEBwYXJhbSBzdGF0dXMgSFRUUFx1NzJCNlx1NjAwMVx1NzgwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQTUwMFxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHU3Njg0XHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZShcbiAgbWVzc2FnZTogc3RyaW5nLCBcbiAgY29kZTogc3RyaW5nID0gJ01PQ0tfRVJST1InLCBcbiAgc3RhdHVzOiBudW1iZXIgPSA1MDBcbikge1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgIGVycm9yOiB7XG4gICAgICBtZXNzYWdlLFxuICAgICAgY29kZSxcbiAgICAgIHN0YXR1c0NvZGU6IHN0YXR1c1xuICAgIH0sXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgbW9ja1Jlc3BvbnNlOiB0cnVlXG4gIH07XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU1MjA2XHU5ODc1XHU1NENEXHU1RTk0XHU3RUQzXHU2Nzg0XG4gKiBAcGFyYW0gaXRlbXMgXHU1RjUzXHU1MjREXHU5ODc1XHU3Njg0XHU5ODc5XHU3NkVFXHU1MjE3XHU4ODY4XG4gKiBAcGFyYW0gdG90YWxJdGVtcyBcdTYwM0JcdTk4NzlcdTc2RUVcdTY1NzBcbiAqIEBwYXJhbSBwYWdlIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzgwMVxuICogQHBhcmFtIHNpemUgXHU2QkNGXHU5ODc1XHU1OTI3XHU1QzBGXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTUyMDZcdTk4NzVcdTU0Q0RcdTVFOTRcdTdFRDNcdTY3ODRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZTxUPihcbiAgaXRlbXM6IFRbXSxcbiAgdG90YWxJdGVtczogbnVtYmVyLFxuICBwYWdlOiBudW1iZXIgPSAxLFxuICBzaXplOiBudW1iZXIgPSAxMFxuKSB7XG4gIHJldHVybiBjcmVhdGVNb2NrUmVzcG9uc2Uoe1xuICAgIGl0ZW1zLFxuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIHRvdGFsOiB0b3RhbEl0ZW1zLFxuICAgICAgcGFnZSxcbiAgICAgIHNpemUsXG4gICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwodG90YWxJdGVtcyAvIHNpemUpLFxuICAgICAgaGFzTW9yZTogcGFnZSAqIHNpemUgPCB0b3RhbEl0ZW1zXG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZBUElcdTU0Q0RcdTVFOTRcdTVFRjZcdThGREZcbiAqIEBwYXJhbSBtcyBcdTVFRjZcdThGREZcdTZCRUJcdTc5RDJcdTY1NzBcdUZGMENcdTlFRDhcdThCQTQzMDBtc1xuICogQHJldHVybnMgUHJvbWlzZVx1NUJGOVx1OEM2MVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlciA9IDMwMCk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSxcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheVxufTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTk2QzZcdTRFMkRcdTVCRkNcdTUxRkFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0QVBJXHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHU1MTY1XHU1M0UzXG4gKi9cblxuLy8gXHU1QkZDXHU1MTY1XHU2NTcwXHU2MzZFXHU2RTkwXHU2NzBEXHU1MkExXG5pbXBvcnQgZGF0YXNvdXJjZVNlcnZpY2UgZnJvbSAnLi9kYXRhc291cmNlJztcblxuLy8gXHU1QkZDXHU1MTY1XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG5pbXBvcnQgeyBjcmVhdGVNb2NrUmVzcG9uc2UsIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLCBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsIGRlbGF5IH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIFx1NjcwRFx1NTJBMVx1OTZDNlx1NTQwOFxuY29uc3Qgc2VydmljZXMgPSB7XG4gIC8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjcwRFx1NTJBMVxuICBkYXRhU291cmNlOiBkYXRhc291cmNlU2VydmljZSxcbiAgXG4gIC8vIFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMVxuICBxdWVyeToge1xuICAgIC8vIFx1NEUzNFx1NjVGNlx1RkYxQVx1OEZEOVx1OTFDQ1x1NTNFQVx1NUI5QVx1NEU0OVx1NTdGQVx1NjcyQ1x1NzY4NFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMVx1NjNBNVx1NTNFM1x1N0VEM1x1Njc4NFxuICAgIC8vIFx1NTQwRVx1N0VFRFx1NUI5RVx1NzNCMFx1NTE3N1x1NEY1M1x1NzY4NFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMVx1OTAzQlx1OEY5MVxuICAgIGdldFF1ZXJpZXM6IGFzeW5jIChwYXJhbXM/OiB7IHBhZ2U/OiBudW1iZXIsIHNpemU/OiBudW1iZXIgfSkgPT4ge1xuICAgICAgYXdhaXQgZGVsYXkoKTtcbiAgICAgIHJldHVybiBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UoW10sIDAsIHBhcmFtcz8ucGFnZSB8fCAxLCBwYXJhbXM/LnNpemUgfHwgMTApO1xuICAgIH0sXG4gICAgZ2V0UXVlcnk6IGFzeW5jIChpZDogc3RyaW5nKSA9PiB7XG4gICAgICBhd2FpdCBkZWxheSgpO1xuICAgICAgcmV0dXJuIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlKCdcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFcdTVDMUFcdTY3MkFcdTVCOUVcdTczQjAnLCAnTk9UX0lNUExFTUVOVEVEJywgNTAxKTtcbiAgICB9LFxuICAgIGNyZWF0ZVF1ZXJ5OiBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBkZWxheSgpO1xuICAgICAgcmV0dXJuIGNyZWF0ZU1vY2tSZXNwb25zZSh7IGlkOiAndGVtcC1xdWVyeS1pZCcgfSk7XG4gICAgfSxcbiAgICB1cGRhdGVRdWVyeTogYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgZGVsYXkoKTtcbiAgICAgIHJldHVybiBjcmVhdGVNb2NrUmVzcG9uc2UodHJ1ZSk7XG4gICAgfSxcbiAgICBkZWxldGVRdWVyeTogYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgZGVsYXkoKTtcbiAgICAgIHJldHVybiBjcmVhdGVNb2NrUmVzcG9uc2UodHJ1ZSk7XG4gICAgfSxcbiAgICBleGVjdXRlUXVlcnk6IGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IGRlbGF5KDUwMCk7XG4gICAgICByZXR1cm4gY3JlYXRlTW9ja1Jlc3BvbnNlKHsgcm93czogW10sIGNvbHVtbnM6IFtdIH0pO1xuICAgIH1cbiAgfVxufTtcblxuLy8gXHU1QkZDXHU1MUZBbW9jayBzZXJ2aWNlXHU1REU1XHU1MTc3XG5leHBvcnQge1xuICBjcmVhdGVNb2NrUmVzcG9uc2UsXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5XG59O1xuXG4vLyBcdTVCRkNcdTUxRkFcdTU0MDRcdTRFMkFcdTY3MERcdTUyQTFcbmV4cG9ydCBjb25zdCBkYXRhU291cmNlU2VydmljZSA9IHNlcnZpY2VzLmRhdGFTb3VyY2U7XG5leHBvcnQgY29uc3QgcXVlcnlTZXJ2aWNlID0gc2VydmljZXMucXVlcnk7XG5cbi8vIFx1OUVEOFx1OEJBNFx1NUJGQ1x1NTFGQVx1NjI0MFx1NjcwOVx1NjcwRFx1NTJBMVxuZXhwb3J0IGRlZmF1bHQgc2VydmljZXM7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IGFzIHZpdGVMb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IGNyZWF0ZU1vY2tTZXJ2ZXJNaWRkbGV3YXJlIH0gZnJvbSAnLi9zcmMvcGx1Z2lucy9zZXJ2ZXJNb2NrJ1xuaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgY3JlYXRlTW9ja1BsdWdpbiB9IGZyb20gJy4vc3JjL21vY2snXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbi8vIFx1NUYzQVx1NTIzNlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFM1x1NTFGRFx1NjU3MFxuZnVuY3Rpb24gZm9yY2VSZWxlYXNlUG9ydChwb3J0OiBudW1iZXIpIHtcbiAgdHJ5IHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgLy8gV2luZG93c1x1NUU3M1x1NTNGMFxuICAgICAgZXhlY1N5bmMoYG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH0gfCBmaW5kc3RyIExJU1RFTklOR2AsIHsgc3RkaW86ICdwaXBlJyB9KVxuICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAudHJpbSgpXG4gICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgLmZvckVhY2gobGluZSA9PiB7XG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKC9cXHMrKFxcZCspJC8pO1xuICAgICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaFsxXSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZXhlY1N5bmMoYHRhc2traWxsIC9GIC9QSUQgJHttYXRjaFsxXX1gLCB7IHN0ZGlvOiAncGlwZScgfSk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBcdTVERjJcdTUxNzNcdTk1RURcdTUzNjBcdTc1MjhcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTc2ODRcdThGREJcdTdBMEIgUElEOiAke21hdGNoWzFdfWApO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAvLyBcdTVGRkRcdTc1NjVcdTk1MTlcdThCRUZcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBtYWNPUy9MaW51eFx1NUU3M1x1NTNGMFxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGlkcyA9IGV4ZWNTeW5jKGBsc29mIC1pOiR7cG9ydH0gLXRgLCB7IHN0ZGlvOiAncGlwZScgfSkudG9TdHJpbmcoKS50cmltKCk7XG4gICAgICAgIGlmIChwaWRzKSB7XG4gICAgICAgICAgZXhlY1N5bmMoYGtpbGwgLTkgJHtwaWRzfWAsIHsgc3RkaW86ICdwaXBlJyB9KTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgXHU1REYyXHU1MTczXHU5NUVEXHU1MzYwXHU3NTI4XHU3QUVGXHU1M0UzICR7cG9ydH0gXHU3Njg0XHU4RkRCXHU3QTBCIFBJRDogJHtwaWRzfWApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIFx1NUZGRFx1NzU2NVx1OTUxOVx1OEJFRlx1RkYwQ1x1NTNFRlx1ODBGRFx1NjYyRlx1NjdFNVx1NjI3RVx1NTQ3RFx1NEVFNFx1NTkzMVx1OEQyNVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFx1NUZGRFx1NzU2NVx1OTUxOVx1OEJFRlx1RkYwQ1x1NTNFRlx1ODBGRFx1NjYyRlx1N0FFRlx1NTNFM1x1NkNBMVx1ODhBQlx1NTM2MFx1NzUyOFxuICAgIGNvbnNvbGUubG9nKGBcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTY3MkFcdTg4QUJcdTUzNjBcdTc1MjhcdTYyMTZcdTY1RTBcdTZDRDVcdTUxNzNcdTk1RURcdThGREJcdTdBMEJgKTtcbiAgfVxufVxuXG4vLyBcdTUyMUJcdTVFRkFcdTgxRUFcdTVCOUFcdTRFNDlNb2NrXHU2M0QyXHU0RUY2XG5mdW5jdGlvbiBjcmVhdGVNb2NrU2VydmVyUGx1Z2luKCk6IFBsdWdpbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZpdGU6bW9jay1zZXJ2ZXInLFxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIC8vIFx1NkNFOFx1NTE4Q1x1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1Nzg2RVx1NEZERFx1NUI4M1x1NTcyOFx1NjcwMFx1NTI0RFx1OTc2Mlx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0MlxuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjcmVhdGVNb2NrU2VydmVyTWlkZGxld2FyZSgpKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gXHU1QzFEXHU4QkQ1XHU5MUNBXHU2NTNFXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU3QUVGXHU1M0UzXG5mb3JjZVJlbGVhc2VQb3J0KDgwODApO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUsIGNvbW1hbmQgfSkgPT4ge1xuICAvLyBcdThCRkJcdTUzRDZcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcbiAgY29uc3QgZW52ID0gdml0ZUxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSk7XG4gIFxuICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTk3MDBcdTg5ODFcdTc5ODFcdTc1MjhITVJcbiAgY29uc3QgZGlzYWJsZUhNUiA9IHByb2Nlc3MuZW52LlZJVEVfRElTQUJMRV9ITVIgPT09ICd0cnVlJztcbiAgXG4gIC8vIFx1NUYwMFx1NTNEMVx1NkEyMVx1NUYwRlx1NEUwQlx1NTQyRlx1NzUyOE1vY2sgQVBJXG4gIGNvbnN0IHVzZU1vY2tBcGkgPSBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnIHx8IGVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBcbiAgY29uc29sZS5sb2coYFx1Njc4NFx1NUVGQVx1NkEyMVx1NUYwRjogJHttb2RlfSwgXHU0RjdGXHU3NTI4TW9jayBBUEk6ICR7dXNlTW9ja0FwaX0sIFx1Nzk4MVx1NzUyOEhNUjogJHtkaXNhYmxlSE1SfWApO1xuICBjb25zb2xlLmxvZygnXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGOicsIHsgXG4gICAgVklURV9VU0VfTU9DS19BUEk6IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJIHx8IGVudi5WSVRFX1VTRV9NT0NLX0FQSSxcbiAgICBWSVRFX0RJU0FCTEVfSE1SOiBwcm9jZXNzLmVudi5WSVRFX0RJU0FCTEVfSE1SLFxuICAgIE5PREVfRU5WOiBwcm9jZXNzLmVudi5OT0RFX0VOViBcbiAgfSk7XG4gIFxuICAvLyBcdTkxNERcdTdGNkVcdTYzRDJcdTRFRjZcbiAgY29uc3QgcGx1Z2lucyA9IFt2dWUoKV07XG4gIFxuICAvLyBcdTZERkJcdTUyQTBNb2NrXHU2NzBEXHU1MkExXHU2M0QyXHU0RUY2XG4gIGlmICh1c2VNb2NrQXBpKSB7XG4gICAgcGx1Z2lucy5wdXNoKGNyZWF0ZU1vY2tQbHVnaW4oKSk7XG4gIH1cbiAgXG4gIHJldHVybiB7XG4gICAgcGx1Z2lucyxcbiAgICBiYXNlOiAnLycsICAvLyBcdThGRDlcdTkxQ0NcdTVCOUFcdTRFNDlcdTVFOTRcdTc1MjhcdTc2ODRcdTU3RkFcdTc4NDBcdThERUZcdTVGODRcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIC8vIFx1NjM5Mlx1OTY2NGZzZXZlbnRzXHU0RjlEXHU4RDU2XHVGRjBDXHU5MDdGXHU1MTRELm5vZGVcdTZBMjFcdTU3NTdcdTUyQTBcdThGN0RcdTk1MTlcdThCRUZcbiAgICAgIGV4Y2x1ZGU6IFsnZnNldmVudHMnXSxcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVx1NEUwQlx1NzY4NFx1N0YxM1x1NUI1OFxuICAgICAgY2FjaGVEaXI6ICcudml0ZV9kZXBzX2NhY2hlJyxcbiAgICAgIC8vIFx1NUYzQVx1NTIzNlx1OTg4NFx1Njc4NFx1NUVGQVxuICAgICAgZm9yY2U6IHRydWVcbiAgICB9LFxuICAgIC8vIFx1NjcwRFx1NTJBMVx1NTY2OFx1OEJCRVx1N0Y2RVxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIGNvcnM6IHRydWUsXG4gICAgICAvLyBcdTY4MzlcdTYzNkVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTUxQjNcdTVCOUFcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhITVJcbiAgICAgIGhtcjogZGlzYWJsZUhNUiA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgIC8vIFx1NjgwN1x1NTFDNlx1NkEyMVx1NUYwRlx1RkYwQ1x1OTc1RVx1NEUyRFx1OTVGNFx1NEVGNlxuICAgICAgbWlkZGxld2FyZU1vZGU6IGZhbHNlLFxuICAgICAgZnM6IHtcbiAgICAgICAgc3RyaWN0OiBmYWxzZSxcbiAgICAgICAgYWxsb3c6IFsnLi9zcmMnLCAnLi9ub2RlX21vZHVsZXMnLCAnLiddXG4gICAgICB9LFxuICAgICAgLy8gXHU2ODM5XHU2MzZFXHU2QTIxXHU1RjBGXHU5MDA5XHU2MkU5XHU0RUUzXHU3NDA2XHU2MjE2XHU1MTg1XHU3RjZFTW9ja1xuICAgICAgLi4uKHVzZU1vY2tBcGkgPyB7XG4gICAgICAgIC8vIFx1NTcyOE1vY2tcdTZBMjFcdTVGMEZcdTRFMEJcdUZGMENcdTRFMERcdTRGN0ZcdTc1MjhcdTRFRTNcdTc0MDZcbiAgICAgIH0gOiB7XG4gICAgICAgIC8vIFx1NTcyOFx1NkI2M1x1NUUzOFx1NkEyMVx1NUYwRlx1NEUwQlx1RkYwQ1x1NEY3Rlx1NzUyOFx1NEVFM1x1NzQwNlxuICAgICAgICBwcm94eToge1xuICAgICAgICAgIC8vIEFQSVx1OEJGN1x1NkM0Mlx1NEVFM1x1NzQwNlx1OTE0RFx1N0Y2RVxuICAgICAgICAgICcvYXBpJzoge1xuICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MDAwJyxcbiAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnXHU0RUUzXHU3NDA2XHU5MUNEXHU1MTk5XHU4REVGXHU1Rjg0OicsIHBhdGgpO1xuICAgICAgICAgICAgICAvLyBcdTkwN0ZcdTUxNERcdTUzQ0NcdTkxQ0RcdThERUZcdTVGODRcdTk1RUVcdTk4OThcdUZGMENcdTU5ODIgL2FwaS9hcGkvZGF0YXNvdXJjZXMgXHU1M0Q4XHU2MjEwIC9hcGkvZGF0YXNvdXJjZXNcbiAgICAgICAgICAgICAgaWYgKHBhdGguc3RhcnRzV2l0aCgnL2FwaS9hcGkvJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aC5yZXBsYWNlKCcvYXBpL2FwaS8nLCAnL2FwaS8nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAvLyBcdTY2RjRcdTY1QjBDU1BcdTdCNTZcdTc1NjVcdUZGMENcdTc4NkVcdTRGRERcdTUxNDFcdThCQjhcdTY3MkNcdTU3MzBcdTY4MzdcdTVGMEZcdTUyQTBcdThGN0RcdTU0OENBeGlvc1x1NzY4NFx1NEY3Rlx1NzUyOFxuICAgICAgICAnQ29udGVudC1TZWN1cml0eS1Qb2xpY3knOiBcImRlZmF1bHQtc3JjICdzZWxmJyBodHRwOi8vbG9jYWxob3N0OjUwMDAgaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0OyBzY3JpcHQtc3JjICdzZWxmJyAndW5zYWZlLWlubGluZScgJ3Vuc2FmZS1ldmFsJyBodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQ7IHN0eWxlLXNyYyAnc2VsZicgJ3Vuc2FmZS1pbmxpbmUnOyBpbWctc3JjICdzZWxmJyBkYXRhOjsgY29ubmVjdC1zcmMgJ3NlbGYnIGh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCB3czovL2xvY2FsaG9zdDo1MDAwIHdzOi8vbG9jYWxob3N0OjgwODBcIlxuICAgICAgfSxcbiAgICAgIHdhdGNoOiB7XG4gICAgICAgIC8vIFx1Nzg2RVx1NEZERFx1NjU4N1x1NEVGNlx1NjZGNFx1NjUzOVx1NjVGNlx1NkI2M1x1Nzg2RVx1OTFDRFx1NjVCMFx1NTJBMFx1OEY3RFxuICAgICAgICB1c2VQb2xsaW5nOiB0cnVlXG4gICAgICB9XG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgICAgLy8gXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU3OUZCXHU5NjY0IGNvbnNvbGVcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSkiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9wbHVnaW5zL21vY2tEYXRhLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvcGx1Z2lucy9tb2NrRGF0YS50c1wiOy8qKlxuICogXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU5NkM2XHU0RTJEXHU3QkExXHU3NDA2XHU2NTg3XHU0RUY2XG4gKiBcdTZCNjRcdTY1ODdcdTRFRjZcdTk2QzZcdTRFMkRcdTdCQTFcdTc0MDZcdTYyNDBcdTY3MDlcdTYzQTVcdTUzRTNcdTYyNDBcdTk3MDBcdTc2ODRcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdUZGMENcdTc4NkVcdTRGRERcdTY1NzBcdTYzNkVcdTRFMDBcdTgxRjRcdTYwMjdcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IFF1ZXJ5LCBRdWVyeVN0YXR1cywgUXVlcnlUeXBlLCBRdWVyeVNlcnZpY2VTdGF0dXMgfSBmcm9tICcuLi90eXBlcy9xdWVyeSc7XG5cbi8vIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFxuZXhwb3J0IGNvbnN0IG1vY2tEYXRhU291cmNlcyA9IFtcbiAge1xuICAgIGlkOiAnZHMtMScsXG4gICAgbmFtZTogJ015U1FMXHU3OTNBXHU0RjhCXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4Qk15U1FMXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnbXlzcWwnLFxuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHBvcnQ6IDMzMDYsXG4gICAgZGF0YWJhc2U6ICdleGFtcGxlX2RiJyxcbiAgICB1c2VybmFtZTogJ3VzZXInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0yJyxcbiAgICBuYW1lOiAnUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAncG9zdGdyZXNxbCcsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xMDAnLFxuICAgIHBvcnQ6IDU0MzIsXG4gICAgZGF0YWJhc2U6ICdwcm9kdWN0aW9uX2RiJyxcbiAgICB1c2VybmFtZTogJ2FkbWluJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdob3VybHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNzc3NjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMycsXG4gICAgbmFtZTogJ1NRTGl0ZVx1NjcyQ1x1NTczMFx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY3MkNcdTU3MzBTUUxpdGVcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdzcWxpdGUnLFxuICAgIGRhdGFiYXNlOiAnL3BhdGgvdG8vbG9jYWwuZGInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzQ1NjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTQnLFxuICAgIG5hbWU6ICdTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFNRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTczQUZcdTU4ODMnLFxuICAgIHR5cGU6ICdzcWxzZXJ2ZXInLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMjAwJyxcbiAgICBwb3J0OiAxNDMzLFxuICAgIGRhdGFiYXNlOiAndGVzdF9kYicsXG4gICAgdXNlcm5hbWU6ICd0ZXN0ZXInLFxuICAgIHN0YXR1czogJ2luYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnd2Vla2x5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA2MDQ4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNTE4NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiBmYWxzZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy01JyxcbiAgICBuYW1lOiAnT3JhY2xlXHU0RjAxXHU0RTFBXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzME9yYWNsZVx1NEYwMVx1NEUxQVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ29yYWNsZScsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xNTAnLFxuICAgIHBvcnQ6IDE1MjEsXG4gICAgZGF0YWJhc2U6ICdlbnRlcnByaXNlX2RiJyxcbiAgICB1c2VybmFtZTogJ3N5c3RlbScsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxMDM2ODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH1cbl07XG5cbi8vIFx1NkEyMVx1NjJERlx1NTE0M1x1NjU3MFx1NjM2RVxuZXhwb3J0IGNvbnN0IG1vY2tNZXRhZGF0YSA9IHtcbiAgdGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogJ3VzZXJzJyxcbiAgICAgIHNjaGVtYTogJ3B1YmxpYycsXG4gICAgICB0eXBlOiAnVEFCTEUnLFxuICAgICAgZGVzY3JpcHRpb246ICdcdTc1MjhcdTYyMzdcdTg4NjgnLFxuICAgICAgcm93Q291bnQ6IDEwMDAwLFxuICAgICAgdG90YWxTaXplOiAyMDQ4MDAwLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNTE4NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNvbHVtbnM6IFtcbiAgICAgICAgeyBuYW1lOiAnaWQnLCB0eXBlOiAnSU5UJywgbnVsbGFibGU6IGZhbHNlLCBwcmltYXJ5OiB0cnVlLCBkZXNjcmlwdGlvbjogJ1x1NzUyOFx1NjIzN0lEJyB9LFxuICAgICAgICB7IG5hbWU6ICd1c2VybmFtZScsIHR5cGU6ICdWQVJDSEFSKDUwKScsIG51bGxhYmxlOiBmYWxzZSwgZGVzY3JpcHRpb246ICdcdTc1MjhcdTYyMzdcdTU0MEQnIH0sXG4gICAgICAgIHsgbmFtZTogJ2VtYWlsJywgdHlwZTogJ1ZBUkNIQVIoMTAwKScsIG51bGxhYmxlOiBmYWxzZSwgZGVzY3JpcHRpb246ICdcdTc1MzVcdTVCNTBcdTkwQUVcdTRFRjYnIH0sXG4gICAgICAgIHsgbmFtZTogJ2NyZWF0ZWRfYXQnLCB0eXBlOiAnVElNRVNUQU1QJywgbnVsbGFibGU6IGZhbHNlLCBkZXNjcmlwdGlvbjogJ1x1NTIxQlx1NUVGQVx1NjVGNlx1OTVGNCcgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ29yZGVycycsXG4gICAgICBzY2hlbWE6ICdwdWJsaWMnLFxuICAgICAgdHlwZTogJ1RBQkxFJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4QkEyXHU1MzU1XHU4ODY4JyxcbiAgICAgIHJvd0NvdW50OiA1MDAwMCxcbiAgICAgIHRvdGFsU2l6ZTogODE5MjAwMCxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDQ3NTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjb2x1bW5zOiBbXG4gICAgICAgIHsgbmFtZTogJ2lkJywgdHlwZTogJ0lOVCcsIG51bGxhYmxlOiBmYWxzZSwgcHJpbWFyeTogdHJ1ZSwgZGVzY3JpcHRpb246ICdcdThCQTJcdTUzNTVJRCcgfSxcbiAgICAgICAgeyBuYW1lOiAndXNlcl9pZCcsIHR5cGU6ICdJTlQnLCBudWxsYWJsZTogZmFsc2UsIGRlc2NyaXB0aW9uOiAnXHU3NTI4XHU2MjM3SUQnIH0sXG4gICAgICAgIHsgbmFtZTogJ2Ftb3VudCcsIHR5cGU6ICdERUNJTUFMKDEwLDIpJywgbnVsbGFibGU6IGZhbHNlLCBkZXNjcmlwdGlvbjogJ1x1OEJBMlx1NTM1NVx1OTFEMVx1OTg5RCcgfSxcbiAgICAgICAgeyBuYW1lOiAnY3JlYXRlZF9hdCcsIHR5cGU6ICdUSU1FU1RBTVAnLCBudWxsYWJsZTogZmFsc2UsIGRlc2NyaXB0aW9uOiAnXHU1MjFCXHU1RUZBXHU2NUY2XHU5NUY0JyB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAncHJvZHVjdHMnLFxuICAgICAgc2NoZW1hOiAncHVibGljJyxcbiAgICAgIHR5cGU6ICdUQUJMRScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NEVBN1x1NTRDMVx1ODg2OCcsXG4gICAgICByb3dDb3VudDogNTAwMCxcbiAgICAgIHRvdGFsU2l6ZTogMTAyNDAwMCxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDQzMjAwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjb2x1bW5zOiBbXG4gICAgICAgIHsgbmFtZTogJ2lkJywgdHlwZTogJ0lOVCcsIG51bGxhYmxlOiBmYWxzZSwgcHJpbWFyeTogdHJ1ZSwgZGVzY3JpcHRpb246ICdcdTRFQTdcdTU0QzFJRCcgfSxcbiAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGU6ICdWQVJDSEFSKDEwMCknLCBudWxsYWJsZTogZmFsc2UsIGRlc2NyaXB0aW9uOiAnXHU0RUE3XHU1NEMxXHU1NDBEXHU3OUYwJyB9LFxuICAgICAgICB7IG5hbWU6ICdwcmljZScsIHR5cGU6ICdERUNJTUFMKDEwLDIpJywgbnVsbGFibGU6IGZhbHNlLCBkZXNjcmlwdGlvbjogJ1x1NEVBN1x1NTRDMVx1NEVGN1x1NjgzQycgfSxcbiAgICAgICAgeyBuYW1lOiAnc3RvY2snLCB0eXBlOiAnSU5UJywgbnVsbGFibGU6IGZhbHNlLCBkZXNjcmlwdGlvbjogJ1x1NUU5M1x1NUI1OFx1NjU3MFx1OTFDRicgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcblxuLy8gXHU2QTIxXHU2MkRGXHU2N0U1XHU4QkUyXG5leHBvcnQgY29uc3QgbW9ja1F1ZXJpZXM6IFF1ZXJ5W10gPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT4ge1xuICBjb25zdCBpZCA9IGBxdWVyeS0ke2kgKyAxfWA7XG4gIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCk7XG4gIFxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIG5hbWU6IGBcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX1gLFxuICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyICR7aSArIDF9IFx1NzY4NFx1NjNDRlx1OEZGMGAsXG4gICAgZm9sZGVySWQ6IGkgJSAzID09PSAwID8gJ2ZvbGRlci0xJyA6IChpICUgMyA9PT0gMSA/ICdmb2xkZXItMicgOiAnZm9sZGVyLTMnKSxcbiAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgZGF0YVNvdXJjZU5hbWU6IG1vY2tEYXRhU291cmNlc1soaSAlIDUpXS5uYW1lLFxuICAgIHF1ZXJ5VHlwZTogKGkgJSAyID09PSAwID8gJ1NRTCcgOiAnTkFUVVJBTF9MQU5HVUFHRScpIGFzIFF1ZXJ5VHlwZSxcbiAgICBxdWVyeVRleHQ6IGkgJSAyID09PSAwID8gXG4gICAgICBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCA6IFxuICAgICAgYFx1NjdFNVx1NjI3RVx1NjcwMFx1OEZEMTEwXHU2NzYxJHtpICUgMiA9PT0gMCA/ICdcdThCQTJcdTUzNTUnIDogJ1x1NzUyOFx1NjIzNyd9XHU4QkIwXHU1RjU1YCxcbiAgICBzdGF0dXM6IChpICUgNCA9PT0gMCA/ICdEUkFGVCcgOiAoaSAlIDQgPT09IDEgPyAnUFVCTElTSEVEJyA6IChpICUgNCA9PT0gMiA/ICdERVBSRUNBVEVEJyA6ICdBUkNISVZFRCcpKSkgYXMgUXVlcnlTdGF0dXMsXG4gICAgc2VydmljZVN0YXR1czogKGkgJSAyID09PSAwID8gJ0VOQUJMRUQnIDogJ0RJU0FCTEVEJykgYXMgUXVlcnlTZXJ2aWNlU3RhdHVzLFxuICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgdXBkYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgIGV4ZWN1dGlvbkNvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCksXG4gICAgaXNGYXZvcml0ZTogaSAlIDMgPT09IDAsXG4gICAgaXNBY3RpdmU6IGkgJSA1ICE9PSAwLFxuICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMCkudG9JU09TdHJpbmcoKSxcbiAgICByZXN1bHRDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgIGV4ZWN1dGlvblRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkgKyAxMCxcbiAgICB0YWdzOiBbYFx1NjgwN1x1N0I3RSR7aSsxfWAsIGBcdTdDN0JcdTU3OEIke2kgJSAzfWBdLFxuICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfSxcbiAgICB2ZXJzaW9uczogW3tcbiAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgcXVlcnlJZDogaWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9XVxuICB9O1xufSk7XG5cbi8vIFx1NkEyMVx1NjJERlx1OTZDNlx1NjIxMFxuZXhwb3J0IGNvbnN0IG1vY2tJbnRlZ3JhdGlvbnMgPSBbXG4gIHtcbiAgICBpZDogJ2ludGVncmF0aW9uLTEnLFxuICAgIG5hbWU6ICdcdTc5M0FcdTRGOEJSRVNUIEFQSScsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTc5M0FcdTRGOEJSRVNUIEFQSVx1NjcwRFx1NTJBMScsXG4gICAgdHlwZTogJ1JFU1QnLFxuICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS5leGFtcGxlLmNvbS92MScsXG4gICAgYXV0aFR5cGU6ICdCQVNJQycsXG4gICAgdXNlcm5hbWU6ICdhcGlfdXNlcicsXG4gICAgcGFzc3dvcmQ6ICcqKioqKioqKicsXG4gICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBlbmRwb2ludHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC0xJyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NzUyOFx1NjIzN1x1NTIxN1x1ODg2OCcsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvdXNlcnMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjI0MFx1NjcwOVx1NzUyOFx1NjIzN1x1NzY4NFx1NTIxN1x1ODg2OCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtMicsXG4gICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTc1MjhcdTYyMzcnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXRoOiAnL3VzZXJzL3tpZH0nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NjgzOVx1NjM2RUlEXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU3NTI4XHU2MjM3J1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAnaW50ZWdyYXRpb24tMicsXG4gICAgbmFtZTogJ1x1NTkyOVx1NkMxNEFQSScsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTVBUEknLFxuICAgIHR5cGU6ICdSRVNUJyxcbiAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkud2VhdGhlci5jb20nLFxuICAgIGF1dGhUeXBlOiAnQVBJX0tFWScsXG4gICAgYXBpS2V5OiAnKioqKioqKionLFxuICAgIHN0YXR1czogJ0FDVElWRScsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA0MzIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgZW5kcG9pbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtMycsXG4gICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERcdTU5MjlcdTZDMTQnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXRoOiAnL2N1cnJlbnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjMwN1x1NUI5QVx1NEY0RFx1N0Y2RVx1NzY4NFx1NUY1M1x1NTI0RFx1NTkyOVx1NkMxNCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtNCcsXG4gICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTUnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXRoOiAnL2ZvcmVjYXN0JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTY3MkFcdTY3NjU3XHU1OTI5XHU3Njg0XHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1J1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAnaW50ZWdyYXRpb24tMycsXG4gICAgbmFtZTogJ1x1NjUyRlx1NEVEOFx1N0Y1MVx1NTE3MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY1MkZcdTRFRDhcdTU5MDRcdTc0MDZBUEknLFxuICAgIHR5cGU6ICdSRVNUJyxcbiAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkucGF5bWVudC5jb20nLFxuICAgIGF1dGhUeXBlOiAnT0FVVEgyJyxcbiAgICBjbGllbnRJZDogJ2NsaWVudDEyMycsXG4gICAgY2xpZW50U2VjcmV0OiAnKioqKioqKionLFxuICAgIHN0YXR1czogJ0lOQUNUSVZFJyxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGVuZHBvaW50czogW1xuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTUnLFxuICAgICAgICBuYW1lOiAnXHU1MjFCXHU1RUZBXHU2NTJGXHU0RUQ4JyxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHBhdGg6ICcvcGF5bWVudHMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NFx1NjUyRlx1NEVEOFx1OEJGN1x1NkM0MidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtNicsXG4gICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTY1MkZcdTRFRDhcdTcyQjZcdTYwMDEnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NjhDMFx1NjdFNVx1NjUyRlx1NEVEOFx1NzJCNlx1NjAwMSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtNycsXG4gICAgICAgIG5hbWU6ICdcdTkwMDBcdTZCM0UnLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgcGF0aDogJy9wYXltZW50cy97aWR9L3JlZnVuZCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU1OTA0XHU3NDA2XHU5MDAwXHU2QjNFXHU4QkY3XHU2QzQyJ1xuICAgICAgfVxuICAgIF1cbiAgfVxuXTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9wbHVnaW5zL3NlcnZlck1vY2sudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9wbHVnaW5zL3NlcnZlck1vY2sudHNcIjtpbXBvcnQgeyBtb2NrUXVlcmllcywgbW9ja0RhdGFTb3VyY2VzIH0gZnJvbSAnLi9tb2NrRGF0YSc7XG5pbXBvcnQgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU0RTAwXHU0RTJBVml0ZVx1NjcwRFx1NTJBMVx1NTY2OFx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1NTkwNFx1NzQwNkFQSVx1OEJGN1x1NkM0MlxuICogXHU0RTNCXHU4OTgxXHU5NDg4XHU1QkY5Y3VybFx1N0I0OVx1NTkxNlx1OTBFOFx1NURFNVx1NTE3N1x1NTNEMVx1OTAwMVx1NzY4NFx1OEJGN1x1NkM0Mlx1RkYwQ1x1OEZENFx1NTZERUpTT05cdTgwMENcdTRFMERcdTY2MkZIVE1MXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrU2VydmVyTWlkZGxld2FyZSgpOiBDb25uZWN0Lk5leHRIYW5kbGVGdW5jdGlvbiB7XG4gIGNvbnNvbGUubG9nKCdbU2VydmVyXSBcdTUyMUJcdTVFRkFNb2NrXHU2NzBEXHU1MkExXHU1NjY4XHU0RTJEXHU5NUY0XHU0RUY2Jyk7XG4gIFxuICAvLyBcdTVGM0FcdTUyMzZcdTc5ODFcdTc1MjhNb2NrIEFQSVxuICBjb25zdCB1c2VNb2NrQXBpID0gZmFsc2U7XG4gIFxuICBjb25zb2xlLmxvZygnW1NlcnZlcl0gTW9jayBBUElcdTcyQjZcdTYwMDE6JywgdXNlTW9ja0FwaSA/ICdcdTU0MkZcdTc1MjgnIDogJ1x1Nzk4MVx1NzUyOCcpO1xuICBcbiAgLy8gXHU1OTgyXHU2NzlDXHU2NzJBXHU1NDJGXHU3NTI4XHVGRjBDXHU1MjE5XHU0RTBEXHU1OTA0XHU3NDA2XHU0RUZCXHU0RjU1XHU4QkY3XHU2QzQyXG4gIGlmICghdXNlTW9ja0FwaSkge1xuICAgIGNvbnNvbGUubG9nKCdbU2VydmVyXSBNb2NrXHU2NzBEXHU1MkExXHU1NjY4XHU1REYyXHU3OTgxXHU3NTI4XHVGRjBDXHU2MjQwXHU2NzA5XHU4QkY3XHU2QzQyXHU1QzA2XHU3NkY0XHU2M0E1XHU0RjIwXHU5MDEyXHU1MjMwXHU1NDBFXHU3QUVGJyk7XG4gICAgcmV0dXJuIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgbmV4dCgpO1xuICAgIH07XG4gIH1cbiAgXG4gIC8vIFx1NjI1M1x1NTM3MG1vY2tEYXRhU291cmNlc1x1NTE4NVx1NUJCOVx1RkYwQ1x1NEVFNVx1NEZCRlx1OEMwM1x1OEJENVxuICBjb25zb2xlLmxvZygnW1NlcnZlcl0gbW9ja0RhdGFTb3VyY2VzXHU5NTdGXHU1RUE2OicsIG1vY2tEYXRhU291cmNlcyA/IG1vY2tEYXRhU291cmNlcy5sZW5ndGggOiAndW5kZWZpbmVkJyk7XG4gIGlmIChtb2NrRGF0YVNvdXJjZXMgJiYgbW9ja0RhdGFTb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zb2xlLmxvZygnW1NlcnZlcl0gXHU3QjJDXHU0RTAwXHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXHU3OTNBXHU0RjhCOicsIEpTT04uc3RyaW5naWZ5KG1vY2tEYXRhU291cmNlc1swXSwgbnVsbCwgMikpO1xuICB9XG4gIFxuICByZXR1cm4gYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgLy8gXHU1OTgyXHU2NzlDXHU4QkY3XHU2QzQyVVJMXHU1MzA1XHU1NDJCL2FwaS9cdTRGNDZcdTRFMERcdTY2MkZBUElcdThCRjdcdTZDNDJcdUZGMENcdTc2RjRcdTYzQTVcdTRGMjBcdTkwMTJcbiAgICBpZiAoIXVzZU1vY2tBcGkgfHwgIXJlcS51cmw/LmluY2x1ZGVzKCcvYXBpLycpKSB7XG4gICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUzRUFcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDJcbiAgICBpZiAocmVxLnVybD8uaW5jbHVkZXMoJy9hcGkvJykpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdbU2VydmVyIE1vY2tdIFx1NjJFNlx1NjIyQUFQSVx1OEJGN1x1NkM0MjonLCByZXEudXJsLCByZXEubWV0aG9kKTtcbiAgICAgIFxuICAgICAgLy8gXHU3ODZFXHU0RkREcmVxLm1ldGhvZFx1NUI1OFx1NTcyOFx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQUdFVFxuICAgICAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZCB8fCAnR0VUJztcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyOiBHRVQgL2FwaS9xdWVyaWVzL3tpZH1cbiAgICAgICAgY29uc3Qgc2luZ2xlUXVlcnlNYXRjaCA9IHJlcS51cmwubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8oW15cXC9cXD9dKykkLyk7XG4gICAgICAgIGlmIChzaW5nbGVRdWVyeU1hdGNoICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgICAgICBjb25zdCBxdWVyeUlkID0gc2luZ2xlUXVlcnlNYXRjaFsxXTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW1NlcnZlciBNb2NrXSBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTI6JywgcXVlcnlJZCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgICAgICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbU2VydmVyIE1vY2tdIFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMlx1RkYwQ1x1OEZENFx1NTZERVx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NGApO1xuICAgICAgICAgICAgLy8gXHU4RkQ0XHU1NkRFNDA0XHU5NTE5XHU4QkVGXG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLCBcbiAgICAgICAgICAgICAgbWVzc2FnZTogYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmAsXG4gICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgY29kZTogJ05PVF9GT1VORCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBjb25zb2xlLmxvZygnW1NlcnZlciBNb2NrXSBcdThGRDRcdTU2REVcdTY3RTVcdThCRTJcdThCRTZcdTYwQzU6JywgcXVlcnkuaWQsIHF1ZXJ5Lm5hbWUpO1xuICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHF1ZXJ5IH0pKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2ODogR0VUIC9hcGkvcXVlcmllc1xuICAgICAgICBpZiAocmVxLnVybC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllcyhcXD8uKik/JC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW1NlcnZlciBNb2NrXSBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjgnKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTg5RTNcdTY3OTBcdTY3RTVcdThCRTJcdTUzQzJcdTY1NzBcbiAgICAgICAgICBjb25zdCB1cmxPYmogPSBuZXcgVVJMKGBodHRwOi8vbG9jYWxob3N0JHtyZXEudXJsfWApO1xuICAgICAgICAgIGNvbnN0IHBhZ2UgPSBwYXJzZUludCh1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgncGFnZScpIHx8ICcxJywgMTApO1xuICAgICAgICAgIGNvbnN0IHNpemUgPSBwYXJzZUludCh1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgnc2l6ZScpIHx8ICcxMCcsIDEwKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgICAgICAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICAgICAgICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgc2l6ZTtcbiAgICAgICAgICBjb25zdCBwYWdpbmF0ZWRRdWVyaWVzID0gbW9ja1F1ZXJpZXMuc2xpY2Uoc3RhcnQsIE1hdGgubWluKGVuZCwgbW9ja1F1ZXJpZXMubGVuZ3RoKSk7XG4gICAgICAgICAgXG4gICAgICAgICAgY29uc29sZS5sb2coYFtTZXJ2ZXIgTW9ja10gXHU4RkQ0XHU1NkRFJHtwYWdpbmF0ZWRRdWVyaWVzLmxlbmd0aH1cdTRFMkFcdTY3RTVcdThCRTJgKTtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsIFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBpdGVtczogcGFnaW5hdGVkUXVlcmllcyxcbiAgICAgICAgICAgICAgdG90YWw6IG1vY2tRdWVyaWVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgcGFnZTogcGFnZSxcbiAgICAgICAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKG1vY2tRdWVyaWVzLmxlbmd0aCAvIHNpemUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4OiBHRVQgL2FwaS9kYXRhc291cmNlc1xuICAgICAgICBpZiAocmVxLnVybC5tYXRjaCgvXFwvYXBpXFwvZGF0YXNvdXJjZXMoXFw/LiopPyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tTZXJ2ZXIgTW9ja10gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4Jyk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU3QjgwXHU1MzE2XHU1NENEXHU1RTk0XHVGRjBDXHU0RTBEXHU4RkRCXHU4ODRDXHU0RUZCXHU0RjU1XHU1OTBEXHU2NzQyXHU5MDNCXHU4RjkxXG4gICAgICAgICAgY29uc3QgbW9ja0l0ZW1zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogJ2RzLXRlc3QtMScsXG4gICAgICAgICAgICAgIG5hbWU6ICdcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTAgMScsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU3QjgwXHU1MzE2XHU3MjQ4XHU2RDRCXHU4QkQ1XHU2NTcwXHU2MzZFXHU2RTkwJyxcbiAgICAgICAgICAgICAgdHlwZTogJ215c3FsJyxcbiAgICAgICAgICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICAgICAgICAgIHBvcnQ6IDMzMDYsXG4gICAgICAgICAgICAgIGRhdGFiYXNlOiAndGVzdF9kYicsXG4gICAgICAgICAgICAgIHVzZXJuYW1lOiAndXNlcicsXG4gICAgICAgICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgICAgICAgICAgIHN5bmNGcmVxdWVuY3k6ICdtYW51YWwnLFxuICAgICAgICAgICAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF07XG4gICAgICAgICAgXG4gICAgICAgICAgY29uc29sZS5sb2coJ1tTZXJ2ZXIgTW9ja10gXHU4RkQ0XHU1NkRFXHU3QjgwXHU1MzE2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4Jyk7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgXG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLCBcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgaXRlbXM6IG1vY2tJdGVtcyxcbiAgICAgICAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgICAgICAgIHRvdGFsOiBtb2NrSXRlbXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHRvdGFsUGFnZXM6IDEsXG4gICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICBzaXplOiAxMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gXHU2REZCXHU1MkEwXHU2NTcwXHU2MzZFXHU2RTkwXHU3MkI2XHU2MDAxXHU2OEMwXHU2N0U1XHU3QUVGXHU3MEI5OiBHRVQgL2FwaS9kYXRhc291cmNlcy97aWR9L2NoZWNrLXN0YXR1c1xuICAgICAgICBjb25zdCBjaGVja1N0YXR1c01hdGNoID0gcmVxLnVybC5tYXRjaCgvXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC8oW15cXC9cXD9dKylcXC9jaGVjay1zdGF0dXMvKTtcbiAgICAgICAgaWYgKGNoZWNrU3RhdHVzTWF0Y2ggJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgICAgICAgIGNvbnN0IGRhdGFTb3VyY2VJZCA9IGNoZWNrU3RhdHVzTWF0Y2hbMV07XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tTZXJ2ZXIgTW9ja10gXHU2OEMwXHU2N0U1XHU2NTcwXHU2MzZFXHU2RTkwXHU3MkI2XHU2MDAxOicsIGRhdGFTb3VyY2VJZCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU2N0U1XHU2MjdFXHU2NTcwXHU2MzZFXHU2RTkwXG4gICAgICAgICAgY29uc3QgZGF0YVNvdXJjZSA9IG1vY2tEYXRhU291cmNlcy5maW5kKGRzID0+IGRzLmlkID09PSBkYXRhU291cmNlSWQpO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmICghZGF0YVNvdXJjZSkge1xuICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IFxuICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXG4gICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7ZGF0YVNvdXJjZUlkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGAsXG4gICAgICAgICAgICAgICAgY29kZTogJ05PVF9GT1VORCcsXG4gICAgICAgICAgICAgICAgZGV0YWlsczogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1OEZENFx1NTZERVx1NzJCNlx1NjAwMVx1NjhDMFx1NjdFNVx1N0VEM1x1Njc5Q1xuICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IFxuICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSwgXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGlkOiBkYXRhU291cmNlLmlkLFxuICAgICAgICAgICAgICBzdGF0dXM6IGRhdGFTb3VyY2Uuc3RhdHVzLFxuICAgICAgICAgICAgICBpc0FjdGl2ZTogZGF0YVNvdXJjZS5pc0FjdGl2ZSxcbiAgICAgICAgICAgICAgbGFzdENoZWNrZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBkYXRhU291cmNlLnN0YXR1cyA9PT0gJ2Vycm9yJyA/ICdcdThGREVcdTYzQTVcdTU5MzFcdThEMjUnIDogJ1x1OEZERVx1NjNBNVx1NkI2M1x1NUUzOCcsXG4gICAgICAgICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICAgICAgICByZXNwb25zZVRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyAxMCxcbiAgICAgICAgICAgICAgICBhY3RpdmVDb25uZWN0aW9uczogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSkgKyAxLFxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb25Qb29sU2l6ZTogMTBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NTE0M1x1NjU3MFx1NjM2RVx1NTQwQ1x1NkI2NVx1N0FFRlx1NzBCOTogUE9TVCAvYXBpL21ldGFkYXRhL2RhdGFzb3VyY2VzL3tkYXRhU291cmNlSWR9L3N5bmNcbiAgICAgICAgY29uc3QgbWV0YWRhdGFTeW5jTWF0Y2ggPSByZXEudXJsLm1hdGNoKC9cXC9hcGlcXC9tZXRhZGF0YVxcL2RhdGFzb3VyY2VzXFwvKFteXFwvXFw/XSspXFwvc3luYy8pO1xuICAgICAgICBpZiAobWV0YWRhdGFTeW5jTWF0Y2ggJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgICAgICBjb25zdCBkYXRhU291cmNlSWQgPSBtZXRhZGF0YVN5bmNNYXRjaFsxXTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW1NlcnZlciBNb2NrXSBcdTU0MENcdTZCNjVcdTY1NzBcdTYzNkVcdTZFOTBcdTUxNDNcdTY1NzBcdTYzNkU6JywgZGF0YVNvdXJjZUlkKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTY3RTVcdTYyN0VcdTY1NzBcdTYzNkVcdTZFOTBcbiAgICAgICAgICBjb25zdCBkYXRhU291cmNlID0gbW9ja0RhdGFTb3VyY2VzLmZpbmQoZHMgPT4gZHMuaWQgPT09IGRhdGFTb3VyY2VJZCk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKCFkYXRhU291cmNlKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLCBcbiAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtkYXRhU291cmNlSWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCxcbiAgICAgICAgICAgICAgICBjb2RlOiAnTk9UX0ZPVU5EJyxcbiAgICAgICAgICAgICAgICBkZXRhaWxzOiBudWxsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU4M0I3XHU1M0Q2XHU4QkY3XHU2QzQyXHU2NTcwXHU2MzZFXG4gICAgICAgICAgbGV0IHJlcXVlc3RCb2R5ID0gJyc7XG4gICAgICAgICAgcmVxLm9uKCdkYXRhJywgKGNodW5rKSA9PiB7XG4gICAgICAgICAgICByZXF1ZXN0Qm9keSArPSBjaHVuay50b1N0cmluZygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIHJlcS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZpbHRlcnMgPSB7fTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChyZXF1ZXN0Qm9keSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHJlcXVlc3RCb2R5KTtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzID0gZGF0YS5maWx0ZXJzIHx8IHt9O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbU2VydmVyIE1vY2tdIFx1NTQwQ1x1NkI2NVx1NTE0M1x1NjU3MFx1NjM2RVx1OEZDN1x1NkVFNFx1NTY2ODonLCBmaWx0ZXJzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbU2VydmVyIE1vY2tdIFx1ODlFM1x1Njc5MFx1NTQwQ1x1NkI2NVx1NTNDMlx1NjU3MFx1NTkzMVx1OEQyNTonLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU4RkQ0XHU1NkRFXHU1NDBDXHU2QjY1XHU3RUQzXHU2NzlDXG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsIFxuICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzeW5jSWQ6IGBzeW5jLSR7RGF0ZS5ub3coKX1gLFxuICAgICAgICAgICAgICAgIGRhdGFTb3VyY2VJZDogZGF0YVNvdXJjZS5pZCxcbiAgICAgICAgICAgICAgICBzdGFydFRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBlbmRUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpICsgNTAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICB0YWJsZXNDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjApICsgNSxcbiAgICAgICAgICAgICAgICB2aWV3c0NvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxLFxuICAgICAgICAgICAgICAgIHN5bmNEdXJhdGlvbjogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTAwMCkgKyAxMDAwLFxuICAgICAgICAgICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ1x1NTQwQ1x1NkI2NVx1NUI4Q1x1NjIxMCcsXG4gICAgICAgICAgICAgICAgZXJyb3JzOiBbXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBcdTZERkJcdTUyQTBcdTY1NzBcdTYzNkVcdTZFOTBcdTdFREZcdThCQTFcdTRGRTFcdTYwNkZcdTdBRUZcdTcwQjk6IEdFVCAvYXBpL2RhdGFzb3VyY2VzL3tpZH0vc3RhdHNcbiAgICAgICAgY29uc3Qgc3RhdHNNYXRjaCA9IHJlcS51cmwubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvKFteXFwvXFw/XSspXFwvc3RhdHMvKTtcbiAgICAgICAgaWYgKHN0YXRzTWF0Y2ggJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgICAgICAgIGNvbnN0IGRhdGFTb3VyY2VJZCA9IHN0YXRzTWF0Y2hbMV07XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tTZXJ2ZXIgTW9ja10gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU3RURGXHU4QkExXHU0RkUxXHU2MDZGOicsIGRhdGFTb3VyY2VJZCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU2N0U1XHU2MjdFXHU2NTcwXHU2MzZFXHU2RTkwXG4gICAgICAgICAgY29uc3QgZGF0YVNvdXJjZSA9IG1vY2tEYXRhU291cmNlcy5maW5kKGRzID0+IGRzLmlkID09PSBkYXRhU291cmNlSWQpO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmICghZGF0YVNvdXJjZSkge1xuICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IFxuICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXG4gICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7ZGF0YVNvdXJjZUlkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGAsXG4gICAgICAgICAgICAgICAgY29kZTogJ05PVF9GT1VORCcsXG4gICAgICAgICAgICAgICAgZGV0YWlsczogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1OEZENFx1NTZERVx1N0VERlx1OEJBMVx1NEZFMVx1NjA2RlxuICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IFxuICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSwgXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGRhdGFTb3VyY2VJZDogZGF0YVNvdXJjZS5pZCxcbiAgICAgICAgICAgICAgdGFibGVzQ291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSArIDUsXG4gICAgICAgICAgICAgIHZpZXdzQ291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDEsXG4gICAgICAgICAgICAgIHRvdGFsUm93czogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCkgKyAxMDAwLFxuICAgICAgICAgICAgICB0b3RhbFNpemU6IGAkeyhNYXRoLnJhbmRvbSgpICogMTAwICsgMTApLnRvRml4ZWQoMil9IE1CYCxcbiAgICAgICAgICAgICAgbGFzdFVwZGF0ZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICBxdWVyaWVzQ291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkgKyAxMCxcbiAgICAgICAgICAgICAgY29ubmVjdGlvblBvb2xTaXplOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyA1LFxuICAgICAgICAgICAgICBhY3RpdmVDb25uZWN0aW9uczogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSkgKyAxLFxuICAgICAgICAgICAgICBhdmdRdWVyeVRpbWU6IGAkeyhNYXRoLnJhbmRvbSgpICogMTAwICsgMTApLnRvRml4ZWQoMil9bXNgLFxuICAgICAgICAgICAgICB0b3RhbFRhYmxlczogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApICsgNSxcbiAgICAgICAgICAgICAgdG90YWxWaWV3czogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMSxcbiAgICAgICAgICAgICAgdG90YWxRdWVyaWVzOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDApICsgMTAsXG4gICAgICAgICAgICAgIGF2Z1Jlc3BvbnNlVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgICAgICAgICAgICBwZWFrQ29ubmVjdGlvbnM6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIwKSArIDVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTI6IFBPU1QgL2FwaS9xdWVyaWVzL3tpZH0vZXhlY3V0ZVxuICAgICAgICBjb25zdCBleGVjdXRlUXVlcnlNYXRjaCA9IHJlcS51cmwubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8oW15cXC9cXD9dKylcXC9leGVjdXRlLyk7XG4gICAgICAgIGlmIChleGVjdXRlUXVlcnlNYXRjaCAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgICAgIGNvbnN0IHF1ZXJ5SWQgPSBleGVjdXRlUXVlcnlNYXRjaFsxXTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW1NlcnZlciBNb2NrXSBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTI6JywgcXVlcnlJZCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU4RkQ0XHU1NkRFXHU2QTIxXHU2MkRGXHU2N0U1XHU4QkUyXHU3RUQzXHU2NzlDXG4gICAgICAgICAgY29uc3QgbW9ja1Jlc3VsdCA9IHtcbiAgICAgICAgICAgIGlkOiBgcmVzdWx0LSR7RGF0ZS5ub3coKX1gLFxuICAgICAgICAgICAgcXVlcnlJZDogcXVlcnlJZCxcbiAgICAgICAgICAgIHN0YXR1czogJ0NPTVBMRVRFRCcsXG4gICAgICAgICAgICBleGVjdXRpb25UaW1lOiAyNTMsXG4gICAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgIHJvd0NvdW50OiAyMCxcbiAgICAgICAgICAgIGNvbHVtbnM6IFsnaWQnLCAnbmFtZScsICdlbWFpbCcsICdhZ2UnLCAnc3RhdHVzJywgJ2NyZWF0ZWRfYXQnXSxcbiAgICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgICB7IG5hbWU6ICdpZCcsIHR5cGU6ICdpbnRlZ2VyJywgZGlzcGxheU5hbWU6ICdJRCcgfSxcbiAgICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGU6ICdzdHJpbmcnLCBkaXNwbGF5TmFtZTogJ1x1NTQwRFx1NzlGMCcgfSxcbiAgICAgICAgICAgICAgeyBuYW1lOiAnZW1haWwnLCB0eXBlOiAnc3RyaW5nJywgZGlzcGxheU5hbWU6ICdcdTkwQUVcdTdCQjEnIH0sXG4gICAgICAgICAgICAgIHsgbmFtZTogJ2FnZScsIHR5cGU6ICdpbnRlZ2VyJywgZGlzcGxheU5hbWU6ICdcdTVFNzRcdTlGODQnIH0sXG4gICAgICAgICAgICAgIHsgbmFtZTogJ3N0YXR1cycsIHR5cGU6ICdzdHJpbmcnLCBkaXNwbGF5TmFtZTogJ1x1NzJCNlx1NjAwMScgfSxcbiAgICAgICAgICAgICAgeyBuYW1lOiAnY3JlYXRlZF9hdCcsIHR5cGU6ICd0aW1lc3RhbXAnLCBkaXNwbGF5TmFtZTogJ1x1NTIxQlx1NUVGQVx1NjVGNlx1OTVGNCcgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJvd3M6IEFycmF5LmZyb20oeyBsZW5ndGg6IDIwIH0sIChfLCBpKSA9PiAoe1xuICAgICAgICAgICAgICBpZDogaSArIDEsXG4gICAgICAgICAgICAgIG5hbWU6IGBcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcgJHtpICsgMX1gLFxuICAgICAgICAgICAgICBlbWFpbDogYHVzZXIke2kgKyAxfUBleGFtcGxlLmNvbWAsXG4gICAgICAgICAgICAgIGFnZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApICsgMTgsXG4gICAgICAgICAgICAgIHN0YXR1czogaSAlIDMgPT09IDAgPyAnYWN0aXZlJyA6IChpICUgMyA9PT0gMSA/ICdwZW5kaW5nJyA6ICdpbmFjdGl2ZScpLFxuICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICB9O1xuICAgICAgICAgIFxuICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IG1vY2tSZXN1bHQgfSkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gXHU1MTc2XHU0RUQ2QVBJXHU4QkY3XHU2QzQyXHU4RkQ0XHU1NkRFXHU5MDFBXHU3NTI4XHU2MjEwXHU1MjlGXHU1NENEXHU1RTk0XG4gICAgICAgIGNvbnNvbGUubG9nKGBbU2VydmVyIE1vY2tdIFx1OTAxQVx1NzUyOFx1NTkwNFx1NzQwNjogJHtyZXEudXJsfWApO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IFxuICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsIFxuICAgICAgICAgIGRhdGE6IHsgbWVzc2FnZTogYEFQSVx1OEJGN1x1NkM0Mlx1NTkwNFx1NzQwNlx1NjIxMFx1NTI5RjogJHtyZXEudXJsfWAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gXHU1OTA0XHU3NDA2XHU0RUZCXHU0RjU1XHU1M0VGXHU4MEZEXHU1M0QxXHU3NTFGXHU3Njg0XHU5NTE5XHU4QkVGXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tTZXJ2ZXIgTW9ja10gXHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyXHU2NUY2XHU1MUZBXHU5NTE5OicsIGVycm9yKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignW1NlcnZlciBNb2NrXSBcdTk1MTlcdThCRUZcdTU4MDZcdTY4MDg6JywgZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLnN0YWNrIDogJ05vIHN0YWNrIHRyYWNlJyk7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgXG4gICAgICAgICAgc3VjY2VzczogZmFsc2UsIFxuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA1MDAsXG4gICAgICAgICAgICBjb2RlOiAnSU5URVJOQUxfRVJST1InLFxuICAgICAgICAgICAgbWVzc2FnZTogYFx1NTkwNFx1NzQwNkFQSVx1OEJGN1x1NkM0Mlx1NjVGNlx1NTNEMVx1NzUxRlx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRjogJHtlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcil9YCxcbiAgICAgICAgICAgIGRldGFpbHM6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5zdGFjayA6IHVuZGVmaW5lZFxuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTRFMERcdTY2MkZBUElcdThCRjdcdTZDNDJcdUZGMENcdTRFQTRcdTdFRDlcdTRFMEJcdTRFMDBcdTRFMkFcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcbiAgICBuZXh0KCk7XG4gIH07XG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTRFM0JcdTUxNjVcdTUzRTNcdTZBMjFcdTU3NTdcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0TW9ja1x1NjcwRFx1NTJBMVx1NTIxRFx1NTlDQlx1NTMxNlx1NTQ4Q1x1OTE0RFx1N0Y2RVx1NjNBNVx1NTNFM1xuICovXG5cbmltcG9ydCB7IG1vY2tDb25maWcsIGlzTW9ja0VuYWJsZWQsIGlzTW9kdWxlRW5hYmxlZCwgbG9nTW9jayB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBpbnRlcmNlcHRvcnMgZnJvbSAnLi9pbnRlcmNlcHRvcnMnO1xuaW1wb3J0IGNyZWF0ZU1vY2tQbHVnaW4gZnJvbSAnLi92aXRlLmNvbmZpZyc7XG5pbXBvcnQgeyBjcmVhdGVDb21wYXRpYmxlTW9ja01pZGRsZXdhcmUgfSBmcm9tICcuL21pZGRsZXdhcmUnO1xuXG4vLyBcdTVCRkNcdTUxRkFcdTkxNERcdTdGNkVcdTU0OENcdTVERTVcdTUxNzdcbmV4cG9ydCB7XG4gIG1vY2tDb25maWcsXG4gIGlzTW9ja0VuYWJsZWQsXG4gIGlzTW9kdWxlRW5hYmxlZCxcbiAgbG9nTW9ja1xufTtcblxuLyoqXG4gKiBcdTUyMURcdTU5Q0JcdTUzMTZNb2NrXHU2NzBEXHU1MkExXG4gKiBcdTRGN0ZcdTc1MjhcdTZCNjRcdTUxRkRcdTY1NzBcdTY2M0VcdTVGMEZcdTUyMURcdTU5Q0JcdTUzMTZcdTYyNDBcdTY3MDlNb2NrXHU2NzBEXHU1MkExXHU3RUM0XHU0RUY2XG4gKiBAcmV0dXJucyBcdTY2MkZcdTU0MjZcdTYyMTBcdTUyOUZcdTUyMURcdTU5Q0JcdTUzMTZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldHVwTW9ja1NlcnZpY2UoKTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgaWYgKCFpc01vY2tFbmFibGVkKCkpIHtcbiAgICAgIGxvZ01vY2soJ2luZm8nLCAnTW9ja1x1NjcwRFx1NTJBMVx1NURGMlx1Nzk4MVx1NzUyOFx1RkYwQ1x1OERGM1x1OEZDN1x1NTIxRFx1NTlDQlx1NTMxNicpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxvZ01vY2soJ2luZm8nLCAnXHU1MjFEXHU1OUNCXHU1MzE2TW9ja1x1NjcwRFx1NTJBMScpO1xuICAgIFxuICAgIC8vIFx1OEY5M1x1NTFGQVx1OEJFNlx1N0VDNlx1NzY4NFx1OTE0RFx1N0Y2RVx1NzJCNlx1NjAwMVxuICAgIGxvZ01vY2soJ2RlYnVnJywgJ1x1NUY1M1x1NTI0RE1vY2tcdTkxNERcdTdGNkU6JywgbW9ja0NvbmZpZyk7XG4gICAgXG4gICAgLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHU2MkU2XHU2MjJBXHU1NjY4XG4gICAgaW50ZXJjZXB0b3JzLnNldHVwSW50ZXJjZXB0b3JzKCk7XG4gICAgXG4gICAgLy8gXHU4RjkzXHU1MUZBXHU2MjEwXHU1MjlGXHU0RkUxXHU2MDZGXG4gICAgbG9nTW9jaygnaW5mbycsICdNb2NrXHU2NzBEXHU1MkExXHU1MjFEXHU1OUNCXHU1MzE2XHU1QjhDXHU2MjEwJyk7XG4gICAgXG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nTW9jaygnZXJyb3InLCAnXHU1MjFEXHU1OUNCXHU1MzE2TW9ja1x1NjcwRFx1NTJBMVx1NTkzMVx1OEQyNTonLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogXHU3OTgxXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICogXHU3OUZCXHU5NjY0XHU2MjQwXHU2NzA5XHU2MkU2XHU2MjJBXHU1NjY4XHU1NDhDTW9ja1x1NTI5Rlx1ODBGRFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzYWJsZU1vY2tTZXJ2aWNlKCk6IHZvaWQge1xuICB0cnkge1xuICAgIGxvZ01vY2soJ2luZm8nLCAnXHU3OTgxXHU3NTI4TW9ja1x1NjcwRFx1NTJBMScpO1xuICAgIFxuICAgIC8vIFx1NzlGQlx1OTY2NFx1NjJFNlx1NjIyQVx1NTY2OFxuICAgIGludGVyY2VwdG9ycy5yZW1vdmVJbnRlcmNlcHRvcnMoKTtcbiAgICBcbiAgICBsb2dNb2NrKCdpbmZvJywgJ01vY2tcdTY3MERcdTUyQTFcdTVERjJcdTc5ODFcdTc1MjgnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dNb2NrKCdlcnJvcicsICdcdTc5ODFcdTc1MjhNb2NrXHU2NzBEXHU1MkExXHU1OTMxXHU4RDI1OicsIGVycm9yKTtcbiAgfVxufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTYyRTZcdTYyMkFcdTU2NjhcbmV4cG9ydCB7IGludGVyY2VwdG9ycyB9O1xuXG4vLyBcdTVCRkNcdTUxRkFcdTY3MERcdTUyQTFcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2VydmljZXMgfSBmcm9tICcuL3NlcnZpY2VzJztcblxuLy8gXHU1QkZDXHU1MUZBXHU0RTJEXHU5NUY0XHU0RUY2XG5leHBvcnQge1xuICBjcmVhdGVDb21wYXRpYmxlTW9ja01pZGRsZXdhcmVcbn07XG5cbi8vIFx1NUJGQ1x1NTFGQVZpdGVcdTYzRDJcdTRFRjZcbmV4cG9ydCB7XG4gIGNyZWF0ZU1vY2tQbHVnaW5cbn07XG5cbi8vIFx1NjNEMFx1NEY5Qlx1OUVEOFx1OEJBNFx1NzY4NE1vY2tcdTY3MERcdTUyQTFcdTUxNjVcdTUzRTNcbmNvbnN0IG1vY2tTZXJ2aWNlID0ge1xuICAvLyBcdTkxNERcdTdGNkVcdTU0OENcdTcyQjZcdTYwMDFcbiAgY29uZmlnOiBtb2NrQ29uZmlnLFxuICBpc0VuYWJsZWQ6IGlzTW9ja0VuYWJsZWQsXG4gIFxuICAvLyBcdTYyRTZcdTYyMkFcdTU2NjhcdTdCQTFcdTc0MDZcbiAgaW50ZXJjZXB0b3JzLFxuICBcbiAgLy8gXHU2NzBEXHU1MkExXHU1QkZDXHU1MUZBXG4gIHNlcnZpY2VzOiByZXF1aXJlKCcuL3NlcnZpY2VzJykuZGVmYXVsdCxcbiAgXG4gIC8vIFZpdGVcdTYzRDJcdTRFRjZcbiAgY3JlYXRlVml0ZVBsdWdpbjogY3JlYXRlTW9ja1BsdWdpbixcbiAgXG4gIC8vIFx1NEUyRFx1OTVGNFx1NEVGNlxuICBjcmVhdGVNaWRkbGV3YXJlOiBjcmVhdGVDb21wYXRpYmxlTW9ja01pZGRsZXdhcmUsXG4gIFxuICAvLyBcdTU0MkZcdTc1MjgvXHU3OTgxXHU3NTI4XG4gIHNldHVwOiBzZXR1cE1vY2tTZXJ2aWNlLFxuICBkaXNhYmxlOiBkaXNhYmxlTW9ja1NlcnZpY2UsXG4gIFxuICAvLyBcdTUyMURcdTU5Q0JcdTUzMTZcdTUxRkRcdTY1NzBcdUZGMENcdTUzRUZcdTU3MjhcdTVFOTRcdTc1MjhcdTU0MkZcdTUyQThcdTY1RjZcdThDMDNcdTc1MjhcbiAgaW5pdCgpIHtcbiAgICBpZiAoaXNNb2NrRW5hYmxlZCgpKSB7XG4gICAgICBsb2dNb2NrKCdpbmZvJywgJ1x1ODFFQVx1NTJBOFx1NTIxRFx1NTlDQlx1NTMxNk1vY2tcdTY3MERcdTUyQTEnKTtcbiAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgJ1x1NUY1M1x1NTI0RE1vY2tcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDE6IFx1NURGMlx1NTQyRlx1NzUyOCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dNb2NrKCdpbmZvJywgJ01vY2tcdTY3MERcdTUyQTFcdTVERjJcdTc5ODFcdTc1MjhcdUZGMENcdThERjNcdThGQzdcdTUyMURcdTU5Q0JcdTUzMTYnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbi8vIFx1OUVEOFx1OEJBNFx1NUJGQ1x1NTFGQU1vY2tcdTY3MERcdTUyQTFcbmV4cG9ydCBkZWZhdWx0IG1vY2tTZXJ2aWNlOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9pbnRlcmNlcHRvcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9pbnRlcmNlcHRvcnMvZmV0Y2gudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2ludGVyY2VwdG9ycy9mZXRjaC50c1wiOy8qKlxuICogRmV0Y2hcdTYyRTZcdTYyMkFcdTU2NjhcdTVCOUVcdTczQjBcbiAqIFxuICogXHU2MkU2XHU2MjJBRmV0Y2hcdThCRjdcdTZDNDJcdUZGMENcdTY4MzlcdTYzNkVVUkxcdTUzMzlcdTkxNERcdUZGMENcdThGRDRcdTU2REVcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTYyMTZcdThGNkNcdTUzRDFcdTUyMzBcdTc3MUZcdTVCOUVcdTU0MEVcdTdBRUZcbiAqL1xuXG5pbXBvcnQgc2VydmljZXMgZnJvbSAnLi4vc2VydmljZXMnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZywgbG9nTW9jayB9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSB9IGZyb20gJy4uL3NlcnZpY2VzL3V0aWxzJztcblxuLy8gXHU2MkU2XHU2MjJBXHU1MUZEXHU2NTcwXHU3QzdCXHU1NzhCXHU1QjlBXHU0RTQ5XG50eXBlIEludGVyY2VwdG9ySGFuZGxlciA9ICh1cmw6IHN0cmluZywgb3B0aW9uczogUmVxdWVzdEluaXQpID0+IFByb21pc2U8UmVzcG9uc2UgfCBudWxsPjtcblxuLy8gQVBJXHU4REVGXHU1Rjg0XHU2NjIwXHU1QzA0XG5jb25zdCBBUElfTUFQUElOR1M6IFJlY29yZDxzdHJpbmcsIFBhcnRpYWw8UmVjb3JkPHN0cmluZywgSW50ZXJjZXB0b3JIYW5kbGVyPj4+ID0ge1xuICAvLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTc2RjhcdTUxNzNBUElcbiAgJy9hcGkvZGF0YXNvdXJjZXMnOiB7XG4gICAgR0VUOiBoYW5kbGVHZXREYXRhU291cmNlcyxcbiAgICBQT1NUOiBoYW5kbGVDcmVhdGVEYXRhU291cmNlXG4gIH0sXG4gICcvYXBpL2RhdGFzb3VyY2VzL3Rlc3QnOiB7XG4gICAgUE9TVDogaGFuZGxlVGVzdENvbm5lY3Rpb25cbiAgfVxufTtcblxuLy8gXHU1QjU4XHU1MEE4XHU1MzlGXHU1OUNCZmV0Y2hcbmxldCBvcmlnaW5hbEZldGNoOiB0eXBlb2YgZmV0Y2ggfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogXHU4QkJFXHU3RjZFZmV0Y2hcdTYyRTZcdTYyMkFcdTU2NjhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldHVwRmV0Y2hJbnRlcmNlcHRvcigpOiB2b2lkIHtcbiAgLy8gXHU1OTgyXHU2NzlDXHU0RTBEXHU1NDJGXHU3NTI4bW9ja1x1RkYwQ1x1NzZGNFx1NjNBNVx1OEZENFx1NTZERVxuICBpZiAoIW1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgLy8gXHU1REYyXHU3RUNGXHU4QkJFXHU3RjZFXHU4RkM3XHVGRjBDXHU0RTBEXHU5MUNEXHU1OTBEXHU4QkJFXHU3RjZFXG4gIGlmIChvcmlnaW5hbEZldGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICAvLyBcdTRGRERcdTVCNThcdTUzOUZcdTU5Q0JmZXRjaFxuICBvcmlnaW5hbEZldGNoID0gd2luZG93LmZldGNoO1xuICBcbiAgLy8gXHU2NkZGXHU2MzYyZmV0Y2hcbiAgd2luZG93LmZldGNoID0gYXN5bmMgZnVuY3Rpb24oaW5wdXQ6IFJlcXVlc3RJbmZvIHwgVVJMLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1OEY2Q1x1NjM2Mlx1OEY5M1x1NTE2NVx1NEUzQVVSTFx1NTQ4Q1x1OTAwOVx1OTg3OVxuICAgICAgY29uc3QgdXJsID0gaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0ID8gaW5wdXQudXJsIDogaW5wdXQudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QgXG4gICAgICAgID8geyBtZXRob2Q6IGlucHV0Lm1ldGhvZCwgaGVhZGVyczogaW5wdXQuaGVhZGVycywgYm9keTogaW5wdXQuYm9keSB9XG4gICAgICAgIDogaW5pdCB8fCB7fTtcbiAgICAgIFxuICAgICAgLy8gXHU4QzAzXHU3NTI4XHU2MkU2XHU2MjJBXHU1OTA0XHU3NDA2XG4gICAgICBjb25zdCBtb2NrUmVzcG9uc2UgPSBhd2FpdCBoYW5kbGVJbnRlcmNlcHRpb24odXJsLCBvcHRpb25zKTtcbiAgICAgIFxuICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2NzA5XHU2QTIxXHU2MkRGXHU1NENEXHU1RTk0XHVGRjBDXHU4RkQ0XHU1NkRFXHU2QTIxXHU2MkRGXHU1NENEXHU1RTk0XG4gICAgICBpZiAobW9ja1Jlc3BvbnNlKSB7XG4gICAgICAgIC8vIFx1OEJCMFx1NUY1NVx1NjJFNlx1NjIyQVx1NzY4NFx1OEJGN1x1NkM0MlxuICAgICAgICBsb2dNb2NrKCdpbmZvJywgYEludGVyY2VwdGVkOiAke29wdGlvbnMubWV0aG9kIHx8ICdHRVQnfSAke3VybH1gKTtcbiAgICAgICAgcmV0dXJuIG1vY2tSZXNwb25zZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU1NDI2XHU1MjE5XHU4QzAzXHU3NTI4XHU1MzlGXHU1OUNCZmV0Y2hcbiAgICAgIGlmIChvcmlnaW5hbEZldGNoKSB7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbEZldGNoKGlucHV0LCBpbml0KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU1OTgyXHU2NzlDb3JpZ2luYWxGZXRjaFx1NEUzQXVuZGVmaW5lZFx1RkYwQ1x1NjI5Qlx1NTFGQVx1OTUxOVx1OEJFRlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcdTUzOUZcdTU5Q0JmZXRjaFx1NjcyQVx1NUI5QVx1NEU0OVx1RkYwQ1x1NjJFNlx1NjIyQVx1NTY2OFx1NTNFRlx1ODBGRFx1OTE0RFx1N0Y2RVx1OTUxOVx1OEJFRicpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dNb2NrKCdlcnJvcicsICdJbnRlcmNlcHRvciBlcnJvcjonLCBlcnJvcik7XG4gICAgICBcbiAgICAgIC8vIFx1NTNEMVx1NzUxRlx1OTUxOVx1OEJFRlx1NjVGNlx1OEZENFx1NTZERVx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICAgICAgY29uc3QgZXJyb3JEYXRhID0gY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UoXG4gICAgICAgIGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3IgaW4gbW9jayBpbnRlcmNlcHRvcicsXG4gICAgICAgICdNT0NLX0lOVEVSQ0VQVE9SX0VSUk9SJ1xuICAgICAgKTtcbiAgICAgIFxuICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeShlcnJvckRhdGEpLCB7XG4gICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBcbiAgbG9nTW9jaygnaW5mbycsICdGZXRjaCBpbnRlcmNlcHRvciBlbmFibGVkJyk7XG59XG5cbi8qKlxuICogXHU3OUZCXHU5NjY0ZmV0Y2hcdTYyRTZcdTYyMkFcdTU2NjhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZldGNoSW50ZXJjZXB0b3IoKTogdm9pZCB7XG4gIGlmIChvcmlnaW5hbEZldGNoKSB7XG4gICAgd2luZG93LmZldGNoID0gb3JpZ2luYWxGZXRjaDtcbiAgICBvcmlnaW5hbEZldGNoID0gdW5kZWZpbmVkO1xuICAgIFxuICAgIGxvZ01vY2soJ2luZm8nLCAnRmV0Y2ggaW50ZXJjZXB0b3IgcmVtb3ZlZCcpO1xuICB9XG59XG5cbi8qKlxuICogXHU1OTA0XHU3NDA2XHU2MkU2XHU2MjJBXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUludGVyY2VwdGlvbih1cmw6IHN0cmluZywgb3B0aW9uczogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlIHwgbnVsbD4ge1xuICAvLyBcdTU5ODJcdTY3OUNcdTRFMERcdTU0MkZcdTc1Mjhtb2NrXHVGRjBDXHU3NkY0XHU2M0E1XHU4REYzXHU4RkM3XG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgXG4gIHRyeSB7XG4gICAgLy8gXHU0RUNFVVJMXHU0RTJEXHU2M0QwXHU1M0Q2XHU4REVGXHU1Rjg0XG4gICAgY29uc3QgdXJsT2JqID0gbmV3IFVSTCh1cmwsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xuICAgIGNvbnN0IHBhdGggPSB1cmxPYmoucGF0aG5hbWU7XG4gICAgY29uc3QgbWV0aG9kID0gKG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpO1xuICAgIFxuICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NjcwOVx1NTMzOVx1OTE0RFx1NzY4NFx1NTkwNFx1NzQwNlx1N0EwQlx1NUU4RlxuICAgIGZvciAoY29uc3QgW3BhdHRlcm4sIGhhbmRsZXJzXSBvZiBPYmplY3QuZW50cmllcyhBUElfTUFQUElOR1MpKSB7XG4gICAgICBpZiAocGF0aC5zdGFydHNXaXRoKHBhdHRlcm4pIHx8IHBhdGggPT09IHBhdHRlcm4pIHtcbiAgICAgICAgLy8gXHU0RjdGXHU3NTI4XHU3RDIyXHU1RjE1XHU4QkJGXHU5NUVFXHU2NENEXHU0RjVDXHU3QjI2XHU1RTc2XHU2OEMwXHU2N0U1XHU2NUI5XHU2Q0Q1XHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBtZXRob2QgaW4gaGFuZGxlcnMgPyBoYW5kbGVyc1ttZXRob2RdIDogdW5kZWZpbmVkO1xuICAgICAgICBcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIodXJsLCBvcHRpb25zKTtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU2Q0ExXHU2NzA5XHU2MjdFXHU1MjMwXHU1OTA0XHU3NDA2XHU3QTBCXHU1RThGXG4gICAgcmV0dXJuIG51bGw7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nTW9jaygnZXJyb3InLCAnSW50ZXJjZXB0aW9uIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NTRDRFx1NUU5NFxuICovXG5mdW5jdGlvbiBjcmVhdGVSZXNwb25zZShkYXRhOiBhbnksIHN0YXR1cyA9IDIwMCk6IFJlc3BvbnNlIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeShkYXRhKSwge1xuICAgIHN0YXR1cyxcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlR2V0RGF0YVNvdXJjZXModXJsOiBzdHJpbmcsIG9wdGlvbnM6IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZSB8IG51bGw+IHtcbiAgLy8gXHU4OUUzXHU2NzkwVVJMXHU1M0MyXHU2NTcwXG4gIGNvbnN0IHVybE9iaiA9IG5ldyBVUkwodXJsLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKTtcbiAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCdwYWdlJykgfHwgJzEnKTtcbiAgY29uc3Qgc2l6ZSA9IHBhcnNlSW50KHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCdzaXplJykgfHwgJzEwJyk7XG4gIGNvbnN0IG5hbWUgPSB1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgnbmFtZScpIHx8IHVuZGVmaW5lZDtcbiAgY29uc3QgdHlwZSA9IHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCd0eXBlJykgfHwgdW5kZWZpbmVkO1xuICBjb25zdCBzdGF0dXMgPSB1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgnc3RhdHVzJykgfHwgdW5kZWZpbmVkO1xuICBcbiAgLy8gXHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXHU1OTA0XHU3NDA2XG4gIGNvbnN0IHBhdGhQYXJ0cyA9IHVybE9iai5wYXRobmFtZS5zcGxpdCgnLycpLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKHBhdGhQYXJ0cy5sZW5ndGggPT09IDIgJiYgcGF0aFBhcnRzWzBdID09PSAnYXBpJyAmJiBwYXRoUGFydHNbMV0gPT09ICdkYXRhc291cmNlcycpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS5nZXREYXRhU291cmNlcyh7XG4gICAgICAgIHBhZ2UsIHNpemUsIG5hbWUsIHR5cGUsIHN0YXR1c1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gY3JlYXRlUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHQgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBjcmVhdGVSZXNwb25zZSh7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogeyBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJyB9XG4gICAgICB9LCA1MDApO1xuICAgIH1cbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXHU4QkU2XHU2MEM1XG4gIGlmIChwYXRoUGFydHMubGVuZ3RoID09PSAzICYmIHBhdGhQYXJ0c1swXSA9PT0gJ2FwaScgJiYgcGF0aFBhcnRzWzFdID09PSAnZGF0YXNvdXJjZXMnKSB7XG4gICAgY29uc3QgaWQgPSBwYXRoUGFydHNbMl07XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNlcnZpY2VzLmRhdGFTb3VyY2UuZ2V0RGF0YVNvdXJjZShpZCk7XG4gICAgICByZXR1cm4gY3JlYXRlUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHQgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBjcmVhdGVSZXNwb25zZSh7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogeyBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJyB9XG4gICAgICB9LCA0MDQpO1xuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUNyZWF0ZURhdGFTb3VyY2UodXJsOiBzdHJpbmcsIG9wdGlvbnM6IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZSB8IG51bGw+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gb3B0aW9ucy5ib2R5ID8gSlNPTi5wYXJzZShvcHRpb25zLmJvZHkgYXMgc3RyaW5nKSA6IHt9O1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNlcnZpY2VzLmRhdGFTb3VyY2UuY3JlYXRlRGF0YVNvdXJjZShib2R5KTtcbiAgICByZXR1cm4gY3JlYXRlUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHQgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVJlc3BvbnNlKHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6IHsgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcicgfVxuICAgIH0sIDQwMCk7XG4gIH1cbn1cblxuLyoqXG4gKiBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlVGVzdENvbm5lY3Rpb24odXJsOiBzdHJpbmcsIG9wdGlvbnM6IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZSB8IG51bGw+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gb3B0aW9ucy5ib2R5ID8gSlNPTi5wYXJzZShvcHRpb25zLmJvZHkgYXMgc3RyaW5nKSA6IHt9O1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNlcnZpY2VzLmRhdGFTb3VyY2UudGVzdENvbm5lY3Rpb24oYm9keSk7XG4gICAgcmV0dXJuIGNyZWF0ZVJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzdWx0IH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBjcmVhdGVSZXNwb25zZSh7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiB7IG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InIH1cbiAgICB9LCA0MDApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2V0dXBGZXRjaEludGVyY2VwdG9yLFxuICByZW1vdmVGZXRjaEludGVyY2VwdG9yXG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9pbnRlcmNlcHRvcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9pbnRlcmNlcHRvcnMvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2ludGVyY2VwdG9ycy9pbmRleC50c1wiOy8qKlxuICogXHU2MkU2XHU2MjJBXHU1NjY4XHU2QTIxXHU1NzU3XHU3RDIyXHU1RjE1XHU2NTg3XHU0RUY2XG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1N0VERlx1NEUwMFx1NzY4NFx1OEJGN1x1NkM0Mlx1NjJFNlx1NjIyQVx1NTY2OFx1NTE2NVx1NTNFM1x1NzBCOVxuICovXG5cbmltcG9ydCBmZXRjaEludGVyY2VwdG9yIGZyb20gJy4vZmV0Y2gnO1xuXG4vKipcbiAqIFx1NTIxRFx1NTlDQlx1NTMxNlx1NjI0MFx1NjcwOVx1NjJFNlx1NjIyQVx1NTY2OFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBJbnRlcmNlcHRvcnMoKSB7XG4gIC8vIFx1OEJCRVx1N0Y2RWZldGNoXHU2MkU2XHU2MjJBXHU1NjY4XG4gIGZldGNoSW50ZXJjZXB0b3Iuc2V0dXBGZXRjaEludGVyY2VwdG9yKCk7XG59XG5cbi8qKlxuICogXHU3OUZCXHU5NjY0XHU2MjQwXHU2NzA5XHU2MkU2XHU2MjJBXHU1NjY4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVJbnRlcmNlcHRvcnMoKSB7XG4gIC8vIFx1NzlGQlx1OTY2NGZldGNoXHU2MkU2XHU2MjJBXHU1NjY4XG4gIGZldGNoSW50ZXJjZXB0b3IucmVtb3ZlRmV0Y2hJbnRlcmNlcHRvcigpO1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTU0MDRcdTYyRTZcdTYyMkFcdTU2NjhcdTZBMjFcdTU3NTdcbmV4cG9ydCB7IGZldGNoSW50ZXJjZXB0b3IgfTtcblxuLy8gXHU5RUQ4XHU4QkE0XHU1QkZDXHU1MUZBXG5leHBvcnQgZGVmYXVsdCB7XG4gIHNldHVwSW50ZXJjZXB0b3JzLFxuICByZW1vdmVJbnRlcmNlcHRvcnMsXG4gIGZldGNoOiBmZXRjaEludGVyY2VwdG9yXG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1N0JBMVx1NzQwNlx1NkEyMVx1NTc1N1xuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRIVFRQXHU4QkY3XHU2QzQyXHU2MkU2XHU2MjJBXHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU3NTI4XHU0RThFXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XG4gKiBcdThEMUZcdThEMjNcdTdCQTFcdTc0MDZcdTU0OENcdTUyMDZcdTUzRDFcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTUyMzBcdTVCRjlcdTVFOTRcdTc2ODRcdTY3MERcdTUyQTFcdTU5MDRcdTc0MDZcdTUxRkRcdTY1NzBcbiAqL1xuXG5pbXBvcnQgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgKiBhcyBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IHsgaXNNb2NrRW5hYmxlZCwgbG9nTW9jaywgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgc2VydmljZXMgZnJvbSAnLi4vc2VydmljZXMnO1xuaW1wb3J0IHsgY3JlYXRlTW9ja1Jlc3BvbnNlIH0gZnJvbSAnLi4vc2VydmljZXMvdXRpbHMnO1xuXG4vKipcbiAqIFx1OEY4NVx1NTJBOVx1NTFGRFx1NjU3MFx1N0M3Qlx1NTc4Qlx1NUI5QVx1NEU0OVxuICovXG5pbnRlcmZhY2UgUmVxdWVzdENvbnRleHQge1xuICByZXE6IENvbm5lY3QuSW5jb21pbmdNZXNzYWdlO1xuICByZXM6IGh0dHAuU2VydmVyUmVzcG9uc2U7XG4gIHBhdGg6IHN0cmluZztcbiAgbWV0aG9kOiBzdHJpbmc7XG4gIHF1ZXJ5UGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBib2R5OiBhbnk7XG4gIHVybFBhcnRzOiBzdHJpbmdbXTtcbiAgbm9ybWFsaXplZFVybDogc3RyaW5nO1xuICBwYWdpbmF0aW9uOiB7XG4gICAgcGFnZTogbnVtYmVyO1xuICAgIHNpemU6IG51bWJlcjtcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTYzRDBcdTUzRDZcdThCRjdcdTZDNDJcdTRGNTNcdTc2ODRcdThGODVcdTUyQTlcdTUxRkRcdTY1NzBcbiAqL1xuY29uc3QgZXh0cmFjdFJlcXVlc3RCb2R5ID0gYXN5bmMgKHJlcTogQ29ubmVjdC5JbmNvbWluZ01lc3NhZ2UpOiBQcm9taXNlPGFueT4gPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCBjaHVua3M6IEJ1ZmZlcltdID0gW107XG4gICAgXG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rOiBCdWZmZXIpID0+IHtcbiAgICAgIGNodW5rcy5wdXNoKGNodW5rKTtcbiAgICB9KTtcbiAgICBcbiAgICByZXEub24oJ2VuZCcsICgpID0+IHtcbiAgICAgIGlmIChjaHVua3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJlc29sdmUoe30pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGJvZHlTdHIgPSBCdWZmZXIuY29uY2F0KGNodW5rcykudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3QgYm9keSA9IGJvZHlTdHIgJiYgYm9keVN0ci50cmltKCkgIT09ICcnID8gSlNPTi5wYXJzZShib2R5U3RyKSA6IHt9O1xuICAgICAgICByZXNvbHZlKGJvZHkpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nTW9jaygnd2FybicsICdcdTg5RTNcdTY3OTBcdThCRjdcdTZDNDJcdTRGNTNcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFx1OEZENFx1NTZERVx1NjgwN1x1NTFDNlx1NTRDRFx1NUU5NFx1NzY4NFx1OEY4NVx1NTJBOVx1NTFGRFx1NjU3MFxuICovXG5jb25zdCBzZW5kSnNvblJlc3BvbnNlID0gKHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSwgc3RhdHVzQ29kZTogbnVtYmVyLCBkYXRhOiBhbnkpOiB2b2lkID0+IHtcbiAgcmVzLnN0YXR1c0NvZGUgPSBzdGF0dXNDb2RlO1xuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn07XG5cbi8qKlxuICogXHU1OTA0XHU3NDA2XHU5NTE5XHU4QkVGXHU3Njg0XHU4Rjg1XHU1MkE5XHU1MUZEXHU2NTcwXG4gKi9cbmNvbnN0IGhhbmRsZUVycm9yID0gKHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSwgZXJyb3I6IGFueSwgc3RhdHVzQ29kZSA9IDUwMCk6IHZvaWQgPT4ge1xuICBsb2dNb2NrKCdlcnJvcicsICdcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTUxRkFcdTk1MTk6JywgZXJyb3IpO1xuICBcbiAgc2VuZEpzb25SZXNwb25zZShyZXMsIHN0YXR1c0NvZGUsIHtcbiAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICBlcnJvcjoge1xuICAgICAgc3RhdHVzQ29kZSxcbiAgICAgIGNvZGU6IGVycm9yLmNvZGUgfHwgJ01PQ0tfRVJST1InLFxuICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgZGV0YWlsczogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLnN0YWNrIDogdW5kZWZpbmVkXG4gICAgfVxuICB9KTtcbn07XG5cbi8qKlxuICogXHU2REZCXHU1MkEwXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXHU3Njg0XHU4Rjg1XHU1MkE5XHU1MUZEXHU2NTcwXG4gKi9cbmNvbnN0IGFkZERlbGF5ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICBjb25zdCB7IGRlbGF5IH0gPSBtb2NrQ29uZmlnO1xuICBcbiAgaWYgKHR5cGVvZiBkZWxheSA9PT0gJ251bWJlcicgJiYgZGVsYXkgPiAwKSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gIH0gZWxzZSBpZiAoZGVsYXkgJiYgdHlwZW9mIGRlbGF5ID09PSAnb2JqZWN0Jykge1xuICAgIGNvbnN0IHsgbWluLCBtYXggfSA9IGRlbGF5O1xuICAgIGNvbnN0IHJhbmRvbURlbGF5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgcmFuZG9tRGVsYXkpKTtcbiAgfVxufTtcblxuLyoqXG4gKiBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTRFMEFcdTRFMEJcdTY1ODdcdTc2ODRcdThGODVcdTUyQTlcdTUxRkRcdTY1NzBcbiAqL1xuY29uc3QgY3JlYXRlUmVxdWVzdENvbnRleHQgPSBhc3luYyAoXG4gIHJlcTogQ29ubmVjdC5JbmNvbWluZ01lc3NhZ2UsIFxuICByZXM6IGh0dHAuU2VydmVyUmVzcG9uc2Vcbik6IFByb21pc2U8UmVxdWVzdENvbnRleHQ+ID0+IHtcbiAgLy8gXHU2ODA3XHU1MUM2XHU1MzE2VVJMIChcdTc5RkJcdTk2NjRcdTUzRUZcdTgwRkRcdTc2ODRcdTkxQ0RcdTU5MEQvYXBpXHU1MjREXHU3RjAwKVxuICBjb25zdCBub3JtYWxpemVkVXJsID0gcmVxLnVybD8ucmVwbGFjZSgvXFwvYXBpXFwvYXBpXFwvLywgJy9hcGkvJykgfHwgJy9hcGkvJztcbiAgXG4gIC8vIFx1NjJDNlx1NTIwNlx1OERFRlx1NUY4NFx1OTBFOFx1NTIwNlx1NTQ4Q1x1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MFxuICBjb25zdCB1cmxQYXJ0cyA9IG5vcm1hbGl6ZWRVcmwuc3BsaXQoJz8nKTtcbiAgY29uc3QgcGF0aCA9IHVybFBhcnRzWzBdO1xuICBcbiAgLy8gXHU4OUUzXHU2NzkwXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwXG4gIGNvbnN0IHF1ZXJ5UGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGlmICh1cmxQYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgdXJsT2JqID0gbmV3IFVSTChgaHR0cDovL2xvY2FsaG9zdCR7bm9ybWFsaXplZFVybH1gKTtcbiAgICB1cmxPYmouc2VhcmNoUGFyYW1zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHF1ZXJ5UGFyYW1zW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gXHU2M0QwXHU1M0Q2XHU1MjA2XHU5ODc1XHU1M0MyXHU2NTcwXG4gIGNvbnN0IHBhZ2UgPSBwYXJzZUludChxdWVyeVBhcmFtcy5wYWdlIHx8ICcxJywgMTApO1xuICBjb25zdCBzaXplID0gcGFyc2VJbnQocXVlcnlQYXJhbXMuc2l6ZSB8fCAnMTAnLCAxMCk7XG4gIFxuICAvLyBcdTYzRDBcdTUzRDZcdThCRjdcdTZDNDJcdTRGNTNcbiAgY29uc3QgYm9keSA9IGF3YWl0IGV4dHJhY3RSZXF1ZXN0Qm9keShyZXEpO1xuICBcbiAgcmV0dXJuIHtcbiAgICByZXEsXG4gICAgcmVzLFxuICAgIHBhdGgsXG4gICAgbWV0aG9kOiByZXEubWV0aG9kIHx8ICdHRVQnLFxuICAgIHF1ZXJ5UGFyYW1zLFxuICAgIGJvZHksXG4gICAgdXJsUGFydHMsXG4gICAgbm9ybWFsaXplZFVybCxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICBwYWdlLFxuICAgICAgc2l6ZVxuICAgIH1cbiAgfTtcbn07XG5cbi8qKlxuICogXHU4REVGXHU3NTMxXHU1OTA0XHU3NDA2XHU1NjY4XHU3QzdCXHU1NzhCXHU1QjlBXHU0RTQ5XG4gKi9cbnR5cGUgUm91dGVIYW5kbGVyID0gKGNvbnRleHQ6IFJlcXVlc3RDb250ZXh0KSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuXG4vKipcbiAqIFx1OERFRlx1NzUzMVx1NTkwNFx1NzQwNlx1NTY2OFx1OTZDNlx1NTQwOFxuICovXG5jb25zdCByb3V0ZUhhbmRsZXJzOiBSZWNvcmQ8c3RyaW5nLCBSb3V0ZUhhbmRsZXI+ID0ge1xuICAvLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTc2RjhcdTUxNzNcdTU5MDRcdTc0MDZcdTU2NjhcbiAgYXN5bmMgaGFuZGxlRGF0YVNvdXJjZVJvdXRlcyhjb250ZXh0OiBSZXF1ZXN0Q29udGV4dCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHsgcGF0aCwgbWV0aG9kLCBib2R5LCBwYWdpbmF0aW9uLCByZXMgfSA9IGNvbnRleHQ7XG4gICAgY29uc3QgeyBwYWdlLCBzaXplIH0gPSBwYWdpbmF0aW9uO1xuICAgIFxuICAgIC8vIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjU3MFx1NjM2RVx1NkU5MFxuICAgIGNvbnN0IHNpbmdsZU1hdGNoID0gcGF0aC5tYXRjaCgvXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKHNpbmdsZU1hdGNoICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gc2luZ2xlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTA6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS5nZXREYXRhU291cmNlKGlkKTtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXNwb25zZSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBoYW5kbGVFcnJvcihyZXMsIGVycm9yLCA0MDQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gICAgaWYgKHBhdGgubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvPyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsICdcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjgnKTtcbiAgICAgIGNvbnN0IHsgbmFtZSwgdHlwZSwgc3RhdHVzIH0gPSBjb250ZXh0LnF1ZXJ5UGFyYW1zO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLmRhdGFTb3VyY2UuZ2V0RGF0YVNvdXJjZXMoeyBcbiAgICAgICAgICBwYWdlLCBcbiAgICAgICAgICBzaXplLFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICBzdGF0dXNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3BvbnNlIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGhhbmRsZUVycm9yKHJlcywgZXJyb3IpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXG4gICAgaWYgKHBhdGgubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvPyQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgbG9nTW9jaygnZGVidWcnLCAnXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwJyk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS5jcmVhdGVEYXRhU291cmNlKGJvZHkpO1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3BvbnNlIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGhhbmRsZUVycm9yKHJlcywgZXJyb3IpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gICAgY29uc3QgdXBkYXRlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9kYXRhc291cmNlc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAodXBkYXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgICAgY29uc3QgaWQgPSB1cGRhdGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MDogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5kYXRhU291cmNlLnVwZGF0ZURhdGFTb3VyY2UoaWQsIGJvZHkpO1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3BvbnNlIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGhhbmRsZUVycm9yKHJlcywgZXJyb3IpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gICAgY29uc3QgZGVsZXRlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9kYXRhc291cmNlc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAoZGVsZXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgICAgY29uc3QgaWQgPSBkZWxldGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MDogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS5kZWxldGVEYXRhU291cmNlKGlkKTtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IGlkLCBkZWxldGVkOiB0cnVlIH0gfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaGFuZGxlRXJyb3IocmVzLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTY3MkFcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLy8gXHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczXHU1OTA0XHU3NDA2XHU1NjY4XG4gIGFzeW5jIGhhbmRsZVF1ZXJ5Um91dGVzKGNvbnRleHQ6IFJlcXVlc3RDb250ZXh0KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgeyBwYXRoLCBtZXRob2QsIGJvZHksIHBhZ2luYXRpb24sIHJlcyB9ID0gY29udGV4dDtcbiAgICBjb25zdCB7IHBhZ2UsIHNpemUgfSA9IHBhZ2luYXRpb247XG4gICAgXG4gICAgLy8gXHU3ODZFXHU0RkREXHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExXHU1QjU4XHU1NzI4XG4gICAgaWYgKCFzZXJ2aWNlcy5xdWVyeSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICBjb25zdCBzaW5nbGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKHNpbmdsZU1hdGNoICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gc2luZ2xlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTI6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMucXVlcnkuZ2V0UXVlcnkoaWQpO1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3BvbnNlIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGhhbmRsZUVycm9yKHJlcywgZXJyb3IsIDQwNCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgICBpZiAocGF0aC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllc1xcLz8kLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgICAgbG9nTW9jaygnZGVidWcnLCAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4Jyk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMucXVlcnkuZ2V0UXVlcmllcyh7IHBhZ2UsIHNpemUgfSk7XG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzcG9uc2UgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaGFuZGxlRXJyb3IocmVzLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgICBpZiAocGF0aC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllc1xcLz8kLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgJ1x1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMicpO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LmNyZWF0ZVF1ZXJ5KGJvZHkpO1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3BvbnNlIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGhhbmRsZUVycm9yKHJlcywgZXJyb3IpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgdXBkYXRlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9xdWVyaWVzXFwvKFteXFwvXSspJC8pO1xuICAgIGlmICh1cGRhdGVNYXRjaCAmJiBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgICBjb25zdCBpZCA9IHVwZGF0ZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyOiAke2lkfWApO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LnVwZGF0ZVF1ZXJ5KGlkLCBib2R5KTtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXNwb25zZSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBoYW5kbGVFcnJvcihyZXMsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGRlbGV0ZU1hdGNoID0gcGF0aC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAoZGVsZXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgICAgY29uc3QgaWQgPSBkZWxldGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMjogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc2VydmljZXMucXVlcnkuZGVsZXRlUXVlcnkoaWQpO1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgaWQsIGRlbGV0ZWQ6IHRydWUgfSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBoYW5kbGVFcnJvcihyZXMsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGV4ZWN1dGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8oW15cXC9dKylcXC9leGVjdXRlJC8pO1xuICAgIGlmIChleGVjdXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gZXhlY3V0ZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyOiAke2lkfWApO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LmV4ZWN1dGVRdWVyeShpZCwgYm9keSk7XG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzcG9uc2UgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaGFuZGxlRXJyb3IocmVzLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTY3MkFcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIFxuICAvLyBcdTkwMUFcdTc1MjhcdTU0Q0RcdTVFOTRcdTU5MDRcdTc0MDZcdTU2NjggLSBcdTVFOTRcdThCRTVcdTY1M0VcdTU3MjhcdTY3MDBcdTU0MEVcdTU5MDRcdTc0MDZcbiAgYXN5bmMgaGFuZGxlR2VuZXJpY1JvdXRlcyhjb250ZXh0OiBSZXF1ZXN0Q29udGV4dCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHsgbm9ybWFsaXplZFVybCwgbWV0aG9kLCByZXMgfSA9IGNvbnRleHQ7XG4gICAgXG4gICAgLy8gXHU1QkY5XHU0RThFXHU2NzJBXHU4MEZEXHU1MzM5XHU5MTREXHU3Njg0QVBJXHU4QkY3XHU2QzQyXHVGRjBDXHU4RkQ0XHU1NkRFXHU5MDFBXHU3NTI4XHU1NENEXHU1RTk0XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU5MDFBXHU3NTI4XHU1OTA0XHU3NDA2OiAke25vcm1hbGl6ZWRVcmx9YCk7XG4gICAgXG4gICAgY29uc3QgbW9ja0RhdGEgPSBjcmVhdGVNb2NrUmVzcG9uc2Uoe1xuICAgICAgbWVzc2FnZTogYFx1NkEyMVx1NjJERlx1NTRDRFx1NUU5NDogJHttZXRob2R9ICR7bm9ybWFsaXplZFVybH1gLFxuICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9KTtcbiAgICBcbiAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IG1vY2tEYXRhIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQU1vY2tcdTY3MERcdTUyQTFcdTRFMkRcdTk1RjRcdTRFRjZcbiAqIEByZXR1cm5zIFZpdGVcdTRFMkRcdTk1RjRcdTRFRjZcdTUxRkRcdTY1NzBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCk6IENvbm5lY3QuTmV4dEhhbmRsZUZ1bmN0aW9uIHtcbiAgbG9nTW9jaygnaW5mbycsICdcdTUyMUJcdTVFRkFNb2NrXHU2NzBEXHU1MkExXHU0RTJEXHU5NUY0XHU0RUY2Jyk7XG4gIFxuICAvLyBcdTY4QzBcdTY3RTVNb2NrXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XG4gIGNvbnN0IGVuYWJsZWQgPSBpc01vY2tFbmFibGVkKCk7XG4gIGxvZ01vY2soJ2luZm8nLCBgTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1NzJCNlx1NjAwMTogJHtlbmFibGVkID8gJ1x1NURGMlx1NTQyRlx1NzUyOCcgOiAnXHU1REYyXHU3OTgxXHU3NTI4J31gKTtcbiAgXG4gIC8vIFx1NTk4Mlx1Njc5Q1x1NjcyQVx1NTQyRlx1NzUyOFx1RkYwQ1x1NTIxOVx1NEUwRFx1NTkwNFx1NzQwNlx1NEVGQlx1NEY1NVx1OEJGN1x1NkM0MlxuICBpZiAoIWVuYWJsZWQpIHtcbiAgICBsb2dNb2NrKCdpbmZvJywgJ1x1NEUyRFx1OTVGNFx1NEVGNlx1NURGMlx1Nzk4MVx1NzUyOFx1RkYwQ1x1NjI0MFx1NjcwOVx1OEJGN1x1NkM0Mlx1NUMwNlx1NzZGNFx1NjNBNVx1NEYyMFx1OTAxMlx1NTIzMFx1NTQwRVx1N0FFRicpO1xuICAgIHJldHVybiAocmVxLCByZXMsIG5leHQpID0+IG5leHQoKTtcbiAgfVxuICBcbiAgLy8gXHU0RTNCXHU0RTJEXHU5NUY0XHU0RUY2XHU1MUZEXHU2NTcwXG4gIHJldHVybiBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAvLyBcdTRFQzVcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDJcbiAgICBpZiAoIXJlcS51cmw/LmluY2x1ZGVzKCcvYXBpLycpKSB7XG4gICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdThCQjBcdTVGNTVcdTYyRTZcdTYyMkFcdTc2ODRBUElcdThCRjdcdTZDNDJcbiAgICBsb2dNb2NrKCdpbmZvJywgYFx1NjJFNlx1NjIyQUFQSVx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3JlcS51cmx9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICAgICAgYXdhaXQgYWRkRGVsYXkoKTtcbiAgICAgIFxuICAgICAgLy8gXHU1MjFCXHU1RUZBXHU4QkY3XHU2QzQyXHU0RTBBXHU0RTBCXHU2NTg3XG4gICAgICBjb25zdCBjb250ZXh0ID0gYXdhaXQgY3JlYXRlUmVxdWVzdENvbnRleHQocmVxLCByZXMgYXMgaHR0cC5TZXJ2ZXJSZXNwb25zZSk7XG4gICAgICBcbiAgICAgIC8vIFx1NTkwNFx1NzQwNlx1OERFRlx1NzUzMVxuICAgICAgY29uc3QgaGFuZGxlcnMgPSBbXG4gICAgICAgIHJvdXRlSGFuZGxlcnMuaGFuZGxlRGF0YVNvdXJjZVJvdXRlcyxcbiAgICAgICAgcm91dGVIYW5kbGVycy5oYW5kbGVRdWVyeVJvdXRlcyxcbiAgICAgICAgcm91dGVIYW5kbGVycy5oYW5kbGVHZW5lcmljUm91dGVzXG4gICAgICBdO1xuICAgICAgXG4gICAgICAvLyBcdTRGOURcdTZCMjFcdTVDMURcdThCRDVcdTZCQ0ZcdTRFMkFcdTU5MDRcdTc0MDZcdTU2NjhcbiAgICAgIGZvciAoY29uc3QgaGFuZGxlciBvZiBoYW5kbGVycykge1xuICAgICAgICBjb25zdCBoYW5kbGVkID0gYXdhaXQgaGFuZGxlcihjb250ZXh0KTtcbiAgICAgICAgaWYgKGhhbmRsZWQpIHtcbiAgICAgICAgICByZXR1cm47IC8vIFx1OEJGN1x1NkM0Mlx1NURGMlx1NTkwNFx1NzQwNlx1RkYwQ1x1NTA1Q1x1NkI2Mlx1OEZEQlx1NEUwMFx1NkI2NVx1NTkwNFx1NzQwNlxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjI0MFx1NjcwOVx1NTkwNFx1NzQwNlx1NTY2OFx1OTBGRFx1NkNBMVx1NjcwOVx1NTkwNFx1NzQwNlx1OEJFNVx1OEJGN1x1NkM0Mlx1RkYwQ1x1NEYyMFx1OTAxMlx1N0VEOVx1NTQwRVx1N0VFRFx1NEUyRFx1OTVGNFx1NEVGNlxuICAgICAgbmV4dCgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBoYW5kbGVFcnJvcihyZXMgYXMgaHR0cC5TZXJ2ZXJSZXNwb25zZSwgZXJyb3IpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBcdTRFM0FcdTUxN0NcdTVCQjlcdTYwMjdcdTVCRkNcdTUxRkFcdTY1RTdcdTcyNDhcdTRFMkRcdTk1RjRcdTRFRjZcbiAqL1xuaW1wb3J0IHsgY3JlYXRlTW9ja1NlcnZlck1pZGRsZXdhcmUgYXMgbGVnYWN5Q3JlYXRlTW9ja1NlcnZlck1pZGRsZXdhcmUgfSBmcm9tICcuLi8uLi9wbHVnaW5zL3NlcnZlck1vY2snO1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NTE3Q1x1NUJCOVx1NzY4NFx1NEUyRFx1OTVGNFx1NEVGNlx1NTFGRFx1NjU3MFxuICogXHU2ODM5XHU2MzZFXHU5MTREXHU3RjZFXHU1MUIzXHU1QjlBXHU0RjdGXHU3NTI4XHU2NUIwXHU3MjQ4XHU4RkQ4XHU2NjJGXHU2NUU3XHU3MjQ4XHU0RTJEXHU5NUY0XHU0RUY2XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb21wYXRpYmxlTW9ja01pZGRsZXdhcmUoKTogQ29ubmVjdC5OZXh0SGFuZGxlRnVuY3Rpb24ge1xuICAvLyBcdTVGM0FcdTUyMzZcdTRGN0ZcdTc1MjhcdTY1QjBcdTRFMkRcdTk1RjRcdTRFRjZcbiAgY29uc3QgdXNlTmV3TWlkZGxld2FyZSA9IHRydWU7XG4gIFxuICBpZiAodXNlTmV3TWlkZGxld2FyZSkge1xuICAgIGxvZ01vY2soJ2luZm8nLCAnXHU0RjdGXHU3NTI4XHU2NUIwXHU3MjQ4TW9ja1x1NEUyRFx1OTVGNFx1NEVGNicpO1xuICAgIHJldHVybiBjcmVhdGVNb2NrTWlkZGxld2FyZSgpO1xuICB9IGVsc2Uge1xuICAgIGxvZ01vY2soJ2luZm8nLCAnXHU0RjdGXHU3NTI4XHU2NUU3XHU3MjQ4KFx1NTE3Q1x1NUJCOSlcdTRFMkRcdTk1RjRcdTRFRjYnKTtcbiAgICByZXR1cm4gbGVnYWN5Q3JlYXRlTW9ja1NlcnZlck1pZGRsZXdhcmUoKTtcbiAgfVxufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTlFRDhcdThCQTRcdTRFMkRcdTk1RjRcdTRFRjZcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvbXBhdGlibGVNb2NrTWlkZGxld2FyZTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svdml0ZS5jb25maWcudHNcIjsvKipcbiAqIFZpdGVcdTYzRDJcdTRFRjZcdTkxNERcdTdGNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCVml0ZVx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1NzY4NE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTYzRDJcdTRFRjZcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgY3JlYXRlQ29tcGF0aWJsZU1vY2tNaWRkbGV3YXJlIH0gZnJvbSAnLi9taWRkbGV3YXJlJztcbmltcG9ydCB7IGlzTW9ja0VuYWJsZWQsIGxvZ01vY2ssIG1vY2tDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlZpdGVcdTYzRDJcdTRFRjZcbiAqIEByZXR1cm5zIFZpdGVcdTYzRDJcdTRFRjZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tQbHVnaW4oKTogUGx1Z2luIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZTptb2NrLW1pZGRsZXdhcmUnLFxuICAgIGVuZm9yY2U6ICdwcmUnLCAvLyBcdTc4NkVcdTRGRERcdTU3MjhcdTUxNzZcdTRFRDZcdTRFMkRcdTk1RjRcdTRFRjZcdTRFNEJcdTUyNERcdTYyNjdcdTg4NENcbiAgICBcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAvLyBcdTY4QzBcdTY3RTVNb2NrXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxXG4gICAgICBjb25zdCBtb2NrRW5hYmxlZCA9IGlzTW9ja0VuYWJsZWQoKTtcbiAgICAgIFxuICAgICAgLy8gXHU4RjkzXHU1MUZBXHU4QkU2XHU3RUM2XHU3Njg0XHU5MTREXHU3RjZFXHU3MkI2XHU2MDAxXG4gICAgICBjb25zb2xlLmxvZygnPT09PSBNb2NrXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFID09PT0nKTtcbiAgICAgIGNvbnNvbGUubG9nKCdcdTU0MkZcdTc1MjhcdTcyQjZcdTYwMDE6JywgbW9ja0VuYWJsZWQpO1xuICAgICAgY29uc29sZS5sb2coJ1x1OTE0RFx1N0Y2RVx1OEJFNlx1NjBDNTonLCB7XG4gICAgICAgIGVuYWJsZWQ6IG1vY2tDb25maWcuZW5hYmxlZCxcbiAgICAgICAgbG9nTGV2ZWw6IG1vY2tDb25maWcubG9nTGV2ZWwsXG4gICAgICAgIG1vZHVsZXM6IG1vY2tDb25maWcubW9kdWxlc1xuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZygnPT09PT09PT09PT09PT09PT09PT0nKTtcbiAgICAgIFxuICAgICAgLy8gXHU0RUM1XHU1NzI4XHU1NDJGXHU3NTI4XHU2NUY2XHU2Q0U4XHU1MThDXHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgICBpZiAobW9ja0VuYWJsZWQpIHtcbiAgICAgICAgbG9nTW9jaygnaW5mbycsICdWaXRlXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU2Q0U4XHU1MThDTW9ja1x1NEUyRFx1OTVGNFx1NEVGNicpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1MjFCXHU1RUZBXHU0RTJEXHU5NUY0XHU0RUY2XHU1QjlFXHU0RjhCXG4gICAgICAgIGNvbnN0IG1pZGRsZXdhcmUgPSBjcmVhdGVDb21wYXRpYmxlTW9ja01pZGRsZXdhcmUoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NkNFOFx1NTE4Q1x1NTIzMFx1NjcwRFx1NTJBMVx1NTY2OFx1RkYwQ1x1Nzg2RVx1NEZERFx1NTcyOFx1NTI0RFx1OTc2Mlx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0MlxuICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgIC8vIFx1OEJCMFx1NUY1NVx1OEJGN1x1NkM0Mlx1NjVFNVx1NUZEN1xuICAgICAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NjUzNlx1NTIzMFx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3JlcS51cmx9YCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU1OTA0XHU3NDA2XHU1NENEXHU1RTk0XHU3RUQzXHU2NzVGXHU0RThCXHU0RUY2XG4gICAgICAgICAgcmVzLm9uKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgICAgICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU0Q0RcdTVFOTRcdTVCOENcdTYyMTA6ICR7cmVxLm1ldGhvZH0gJHtyZXEudXJsfSwgXHU3MkI2XHU2MDAxOiAke3Jlcy5zdGF0dXNDb2RlfWApO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1NEYyMFx1OTAxMlx1N0VEOU1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcbiAgICAgICAgICBtaWRkbGV3YXJlKHJlcSwgcmVzLCBuZXh0KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dNb2NrKCdpbmZvJywgJ01vY2tcdTY3MERcdTUyQTFcdTVERjJcdTc5ODFcdTc1MjhcdUZGMENcdTRFMERcdTZDRThcdTUxOENcdTRFMkRcdTk1RjRcdTRFRjYnKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1OUVEOFx1OEJBNFx1NjNEMlx1NEVGNlxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTW9ja1BsdWdpbjsgIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlFTyxTQUFTLGdCQUF5QjtBQUV2QyxTQUFPLFdBQVc7QUFDcEI7QUFZTyxTQUFTLFFBQVEsT0FBaUIsWUFBb0IsTUFBbUI7QUFDOUUsUUFBTSxjQUFjLFdBQVc7QUFHL0IsUUFBTSxTQUFtQztBQUFBLElBQ3ZDLFFBQVE7QUFBQSxJQUNSLFNBQVM7QUFBQSxJQUNULFFBQVE7QUFBQSxJ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QUNDLFVBQVM7QUFDakIsc0JBQVEsSUFBSSx5Q0FBV0EsS0FBSTtBQUUzQixrQkFBSUEsTUFBSyxXQUFXLFdBQVcsR0FBRztBQUNoQyx1QkFBT0EsTUFBSyxRQUFRLGFBQWEsT0FBTztBQUFBLGNBQzFDO0FBQ0EscUJBQU9BO0FBQUEsWUFDVDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUztBQUFBO0FBQUEsUUFFUCwyQkFBMkI7QUFBQSxNQUM3QjtBQUFBLE1BQ0EsT0FBTztBQUFBO0FBQUEsUUFFTCxZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxNQUNSLFdBQVc7QUFBQTtBQUFBLE1BRVgsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsZUFBZTtBQUFBLFFBQ2pCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsibW9ja0RhdGFTb3VyY2VzIiwgImRlbGF5IiwgIm1vY2tEYXRhU291cmNlcyIsICJpbml0X2RhdGFzb3VyY2UiLCAiaW5pdF9kYXRhc291cmNlIiwgInBhdGgiLCAiZGVsYXkiLCAicGF0aCIsICJ2aXRlX2NvbmZpZ19kZWZhdWx0IiwgInBhdGgiXQp9Cg==
