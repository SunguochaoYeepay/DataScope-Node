var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/mock/data/query.ts
var query_exports = {};
__export(query_exports, {
  default: () => query_default,
  mockQueries: () => mockQueries
});
var mockQueries, query_default;
var init_query = __esm({
  "src/mock/data/query.ts"() {
    mockQueries = Array.from({ length: 10 }, (_, i) => {
      const id = `query-${i + 1}`;
      const timestamp = new Date(Date.now() - i * 864e5).toISOString();
      return {
        id,
        name: `\u793A\u4F8B\u67E5\u8BE2 ${i + 1}`,
        description: `\u8FD9\u662F\u793A\u4F8B\u67E5\u8BE2 ${i + 1} \u7684\u63CF\u8FF0`,
        folderId: i % 3 === 0 ? "folder-1" : i % 3 === 1 ? "folder-2" : "folder-3",
        dataSourceId: `ds-${i % 5 + 1}`,
        dataSourceName: `\u6570\u636E\u6E90 ${i % 5 + 1}`,
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
    query_default = mockQueries;
  }
});

// vite.config.ts
import { defineConfig, loadEnv } from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { execSync } from "child_process";
import tailwindcss from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/autoprefixer/lib/autoprefixer.js";

// src/mock/middleware/index.ts
import { parse } from "url";

// src/mock/config.ts
function isEnabled() {
  try {
    if (typeof process !== "undefined" && process.env) {
      if (process.env.VITE_USE_MOCK_API === "true") {
        return true;
      }
      if (process.env.VITE_USE_MOCK_API === "false") {
        return false;
      }
    }
    if (typeof import.meta !== "undefined" && import.meta.env) {
      if (import.meta.env.VITE_USE_MOCK_API === "true") {
        return true;
      }
      if (import.meta.env.VITE_USE_MOCK_API === "false") {
        return false;
      }
    }
    if (typeof window !== "undefined" && window.localStorage) {
      const localStorageValue = localStorage.getItem("USE_MOCK_API");
      if (localStorageValue === "true") {
        return true;
      }
      if (localStorageValue === "false") {
        return false;
      }
    }
    const isDevelopment = typeof process !== "undefined" && process.env && process.env.NODE_ENV === "development" || typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV === true;
    return isDevelopment;
  } catch (error) {
    console.warn("[Mock] \u68C0\u67E5\u73AF\u5883\u53D8\u91CF\u51FA\u9519\uFF0C\u9ED8\u8BA4\u7981\u7528Mock\u670D\u52A1", error);
    return false;
  }
}
var mockConfig = {
  // 是否启用Mock服务
  enabled: isEnabled(),
  // 请求延迟（毫秒）
  delay: 300,
  // API基础路径，用于判断是否需要拦截请求
  apiBasePath: "/api",
  // 日志级别: 'none', 'error', 'info', 'debug'
  logLevel: "debug",
  // 启用的模块
  modules: {
    datasources: true,
    queries: true,
    users: true,
    visualizations: true
  }
};
function shouldMockRequest(req) {
  if (!mockConfig.enabled) {
    return false;
  }
  const url = (req == null ? void 0 : req.url) || "";
  if (typeof url !== "string") {
    console.error("[Mock] \u6536\u5230\u975E\u5B57\u7B26\u4E32URL:", url);
    return false;
  }
  if (!url.startsWith(mockConfig.apiBasePath)) {
    return false;
  }
  return true;
}
function logMock(level, ...args) {
  const { logLevel } = mockConfig;
  if (logLevel === "none")
    return;
  if (level === "error" && ["error", "info", "debug"].includes(logLevel)) {
    console.error("[Mock ERROR]", ...args);
  } else if (level === "info" && ["info", "debug"].includes(logLevel)) {
    console.info("[Mock INFO]", ...args);
  } else if (level === "debug" && logLevel === "debug") {
    console.log("[Mock DEBUG]", ...args);
  }
}
try {
  console.log(`[Mock] \u670D\u52A1\u72B6\u6001: ${mockConfig.enabled ? "\u5DF2\u542F\u7528" : "\u5DF2\u7981\u7528"}`);
  if (mockConfig.enabled) {
    console.log(`[Mock] \u914D\u7F6E:`, {
      delay: mockConfig.delay,
      apiBasePath: mockConfig.apiBasePath,
      logLevel: mockConfig.logLevel,
      enabledModules: Object.entries(mockConfig.modules).filter(([_, enabled]) => enabled).map(([name]) => name)
    });
  }
} catch (error) {
  console.warn("[Mock] \u8F93\u51FA\u914D\u7F6E\u4FE1\u606F\u51FA\u9519", error);
}

// src/mock/data/datasource.ts
var mockDataSources = [
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

// src/mock/services/datasource.ts
var dataSources = [...mockDataSources];
async function simulateDelay() {
  const delay3 = typeof mockConfig.delay === "number" ? mockConfig.delay : 300;
  return new Promise((resolve) => setTimeout(resolve, delay3));
}
function resetDataSources() {
  dataSources = [...mockDataSources];
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
var datasource_default = {
  getDataSources,
  getDataSource,
  createDataSource,
  updateDataSource,
  deleteDataSource,
  testConnection,
  resetDataSources
};

// src/mock/services/utils.ts
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/mock/services/query.ts
init_query();
async function simulateDelay2() {
  const delayTime = typeof mockConfig.delay === "number" ? mockConfig.delay : 300;
  return delay(delayTime);
}
var queryService = {
  /**
   * 获取查询列表
   */
  async getQueries(params) {
    await simulateDelay2();
    const page = (params == null ? void 0 : params.page) || 1;
    const size = (params == null ? void 0 : params.size) || 10;
    let filteredItems = [...mockQueries];
    if (params == null ? void 0 : params.name) {
      const keyword = params.name.toLowerCase();
      filteredItems = filteredItems.filter(
        (q) => q.name.toLowerCase().includes(keyword) || q.description && q.description.toLowerCase().includes(keyword)
      );
    }
    if (params == null ? void 0 : params.dataSourceId) {
      filteredItems = filteredItems.filter((q) => q.dataSourceId === params.dataSourceId);
    }
    if (params == null ? void 0 : params.status) {
      filteredItems = filteredItems.filter((q) => q.status === params.status);
    }
    if (params == null ? void 0 : params.queryType) {
      filteredItems = filteredItems.filter((q) => q.queryType === params.queryType);
    }
    if (params == null ? void 0 : params.isFavorite) {
      filteredItems = filteredItems.filter((q) => q.isFavorite === true);
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
  },
  /**
   * 获取收藏的查询列表
   */
  async getFavoriteQueries(params) {
    await simulateDelay2();
    const page = (params == null ? void 0 : params.page) || 1;
    const size = (params == null ? void 0 : params.size) || 10;
    let favoriteQueries = mockQueries.filter((q) => q.isFavorite === true);
    if ((params == null ? void 0 : params.name) || (params == null ? void 0 : params.search)) {
      const keyword = (params.name || params.search || "").toLowerCase();
      favoriteQueries = favoriteQueries.filter(
        (q) => q.name.toLowerCase().includes(keyword) || q.description && q.description.toLowerCase().includes(keyword)
      );
    }
    if (params == null ? void 0 : params.dataSourceId) {
      favoriteQueries = favoriteQueries.filter((q) => q.dataSourceId === params.dataSourceId);
    }
    if (params == null ? void 0 : params.status) {
      favoriteQueries = favoriteQueries.filter((q) => q.status === params.status);
    }
    const start = (page - 1) * size;
    const end = Math.min(start + size, favoriteQueries.length);
    const paginatedItems = favoriteQueries.slice(start, end);
    return {
      items: paginatedItems,
      pagination: {
        total: favoriteQueries.length,
        page,
        size,
        totalPages: Math.ceil(favoriteQueries.length / size)
      }
    };
  },
  /**
   * 获取单个查询
   */
  async getQuery(id) {
    await simulateDelay2();
    const query = mockQueries.find((q) => q.id === id);
    if (!query) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u67E5\u8BE2`);
    }
    return query;
  },
  /**
   * 创建查询
   */
  async createQuery(data) {
    await simulateDelay2();
    const id = `query-${mockQueries.length + 1}`;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const newQuery = {
      id,
      name: data.name || `\u65B0\u67E5\u8BE2 ${id}`,
      description: data.description || "",
      folderId: data.folderId || null,
      dataSourceId: data.dataSourceId,
      dataSourceName: data.dataSourceName || `\u6570\u636E\u6E90 ${data.dataSourceId}`,
      queryType: data.queryType || "SQL",
      queryText: data.queryText || "",
      status: data.status || "DRAFT",
      serviceStatus: data.serviceStatus || "DISABLED",
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: data.createdBy || { id: "user1", name: "\u6D4B\u8BD5\u7528\u6237" },
      updatedBy: data.updatedBy || { id: "user1", name: "\u6D4B\u8BD5\u7528\u6237" },
      executionCount: 0,
      isFavorite: data.isFavorite || false,
      isActive: data.isActive || true,
      lastExecutedAt: null,
      resultCount: 0,
      executionTime: 0,
      tags: data.tags || [],
      currentVersion: {
        id: `ver-${id}-1`,
        queryId: id,
        versionNumber: 1,
        name: "\u521D\u59CB\u7248\u672C",
        sql: data.queryText || "",
        dataSourceId: data.dataSourceId,
        status: "DRAFT",
        isLatest: true,
        createdAt: timestamp
      },
      versions: [{
        id: `ver-${id}-1`,
        queryId: id,
        versionNumber: 1,
        name: "\u521D\u59CB\u7248\u672C",
        sql: data.queryText || "",
        dataSourceId: data.dataSourceId,
        status: "DRAFT",
        isLatest: true,
        createdAt: timestamp
      }]
    };
    mockQueries.push(newQuery);
    return newQuery;
  },
  /**
   * 更新查询
   */
  async updateQuery(id, data) {
    await simulateDelay2();
    const index = mockQueries.findIndex((q) => q.id === id);
    if (index === -1) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u67E5\u8BE2`);
    }
    const updatedQuery = {
      ...mockQueries[index],
      ...data,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedBy: data.updatedBy || mockQueries[index].updatedBy || { id: "user1", name: "\u6D4B\u8BD5\u7528\u6237" }
    };
    mockQueries[index] = updatedQuery;
    return updatedQuery;
  },
  /**
   * 删除查询
   */
  async deleteQuery(id) {
    await simulateDelay2();
    const index = mockQueries.findIndex((q) => q.id === id);
    if (index === -1) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u67E5\u8BE2`);
    }
    mockQueries.splice(index, 1);
  },
  /**
   * 执行查询
   */
  async executeQuery(id, params) {
    await simulateDelay2();
    const query = mockQueries.find((q) => q.id === id);
    if (!query) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u67E5\u8BE2`);
    }
    const columns = ["id", "name", "email", "status", "created_at"];
    const rows = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `\u7528\u6237 ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: i % 2 === 0 ? "active" : "inactive",
      created_at: new Date(Date.now() - i * 864e5).toISOString()
    }));
    const index = mockQueries.findIndex((q) => q.id === id);
    if (index !== -1) {
      mockQueries[index] = {
        ...mockQueries[index],
        executionCount: (mockQueries[index].executionCount || 0) + 1,
        lastExecutedAt: (/* @__PURE__ */ new Date()).toISOString(),
        resultCount: rows.length
      };
    }
    return {
      columns,
      rows,
      metadata: {
        executionTime: Math.random() * 0.5 + 0.1,
        rowCount: rows.length,
        totalPages: 1
      },
      query: {
        id: query.id,
        name: query.name,
        dataSourceId: query.dataSourceId
      }
    };
  },
  /**
   * 切换查询收藏状态
   */
  async toggleFavorite(id) {
    await simulateDelay2();
    const index = mockQueries.findIndex((q) => q.id === id);
    if (index === -1) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u67E5\u8BE2`);
    }
    mockQueries[index] = {
      ...mockQueries[index],
      isFavorite: !mockQueries[index].isFavorite,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return mockQueries[index];
  },
  /**
   * 获取查询历史
   */
  async getQueryHistory(params) {
    await simulateDelay2();
    const page = (params == null ? void 0 : params.page) || 1;
    const size = (params == null ? void 0 : params.size) || 10;
    const totalItems = 20;
    const histories = Array.from({ length: totalItems }, (_, i) => {
      const timestamp = new Date(Date.now() - i * 36e5).toISOString();
      const queryIndex = i % mockQueries.length;
      return {
        id: `hist-${i + 1}`,
        queryId: mockQueries[queryIndex].id,
        queryName: mockQueries[queryIndex].name,
        executedAt: timestamp,
        executionTime: Math.random() * 0.5 + 0.1,
        rowCount: Math.floor(Math.random() * 100) + 1,
        userId: "user1",
        userName: "\u6D4B\u8BD5\u7528\u6237",
        status: i % 8 === 0 ? "FAILED" : "SUCCESS",
        errorMessage: i % 8 === 0 ? "\u67E5\u8BE2\u6267\u884C\u8D85\u65F6" : null
      };
    });
    const start = (page - 1) * size;
    const end = Math.min(start + size, totalItems);
    const paginatedItems = histories.slice(start, end);
    return {
      items: paginatedItems,
      pagination: {
        total: totalItems,
        page,
        size,
        totalPages: Math.ceil(totalItems / size)
      }
    };
  },
  /**
   * 获取查询版本列表
   */
  async getQueryVersions(queryId, params) {
    await simulateDelay2();
    const query = mockQueries.find((q) => q.id === queryId);
    if (!query) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${queryId}\u7684\u67E5\u8BE2`);
    }
    return query.versions || [];
  },
  /**
   * 创建查询版本
   */
  async createQueryVersion(queryId, data) {
    var _a;
    await simulateDelay2();
    const index = mockQueries.findIndex((q) => q.id === queryId);
    if (index === -1) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${queryId}\u7684\u67E5\u8BE2`);
    }
    const query = mockQueries[index];
    const newVersionNumber = (((_a = query.versions) == null ? void 0 : _a.length) || 0) + 1;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const newVersion = {
      id: `ver-${queryId}-${newVersionNumber}`,
      queryId,
      versionNumber: newVersionNumber,
      name: data.name || `\u7248\u672C ${newVersionNumber}`,
      sql: data.sql || query.queryText || "",
      dataSourceId: data.dataSourceId || query.dataSourceId,
      status: "DRAFT",
      isLatest: true,
      createdAt: timestamp
    };
    if (query.versions && query.versions.length > 0) {
      query.versions = query.versions.map((v) => ({
        ...v,
        isLatest: false
      }));
    }
    if (!query.versions) {
      query.versions = [];
    }
    query.versions.push(newVersion);
    mockQueries[index] = {
      ...query,
      currentVersion: newVersion,
      updatedAt: timestamp
    };
    return newVersion;
  },
  /**
   * 发布查询版本
   */
  async publishQueryVersion(versionId) {
    await simulateDelay2();
    let query = null;
    let versionIndex = -1;
    let queryIndex = -1;
    for (let i = 0; i < mockQueries.length; i++) {
      if (mockQueries[i].versions) {
        const vIndex = mockQueries[i].versions.findIndex((v) => v.id === versionId);
        if (vIndex !== -1) {
          query = mockQueries[i];
          versionIndex = vIndex;
          queryIndex = i;
          break;
        }
      }
    }
    if (!query || versionIndex === -1) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${versionId}\u7684\u67E5\u8BE2\u7248\u672C`);
    }
    const updatedVersion = {
      ...query.versions[versionIndex],
      status: "PUBLISHED",
      publishedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    query.versions[versionIndex] = updatedVersion;
    mockQueries[queryIndex] = {
      ...query,
      status: "PUBLISHED",
      currentVersion: updatedVersion,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return updatedVersion;
  },
  /**
   * 废弃查询版本
   */
  async deprecateQueryVersion(versionId) {
    await simulateDelay2();
    let query = null;
    let versionIndex = -1;
    let queryIndex = -1;
    for (let i = 0; i < mockQueries.length; i++) {
      if (mockQueries[i].versions) {
        const vIndex = mockQueries[i].versions.findIndex((v) => v.id === versionId);
        if (vIndex !== -1) {
          query = mockQueries[i];
          versionIndex = vIndex;
          queryIndex = i;
          break;
        }
      }
    }
    if (!query || versionIndex === -1) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${versionId}\u7684\u67E5\u8BE2\u7248\u672C`);
    }
    const updatedVersion = {
      ...query.versions[versionIndex],
      status: "DEPRECATED",
      deprecatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    query.versions[versionIndex] = updatedVersion;
    if (query.currentVersion && query.currentVersion.id === versionId) {
      mockQueries[queryIndex] = {
        ...query,
        status: "DEPRECATED",
        currentVersion: updatedVersion,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    } else {
      mockQueries[queryIndex] = {
        ...query,
        versions: query.versions,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    return updatedVersion;
  },
  /**
   * 激活查询版本
   */
  async activateQueryVersion(queryId, versionId) {
    await simulateDelay2();
    const queryIndex = mockQueries.findIndex((q) => q.id === queryId);
    if (queryIndex === -1) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${queryId}\u7684\u67E5\u8BE2`);
    }
    const query = mockQueries[queryIndex];
    if (!query.versions) {
      throw new Error(`\u67E5\u8BE2 ${queryId} \u6CA1\u6709\u7248\u672C`);
    }
    const versionIndex = query.versions.findIndex((v) => v.id === versionId);
    if (versionIndex === -1) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${versionId}\u7684\u67E5\u8BE2\u7248\u672C`);
    }
    const versionToActivate = query.versions[versionIndex];
    mockQueries[queryIndex] = {
      ...query,
      currentVersion: versionToActivate,
      status: versionToActivate.status,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return versionToActivate;
  }
};
var query_default2 = queryService;

// src/mock/data/integration.ts
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

// src/mock/services/integration.ts
async function simulateDelay3() {
  const delayTime = typeof mockConfig.delay === "number" ? mockConfig.delay : 300;
  return delay(delayTime);
}
var integrationService = {
  /**
   * 获取集成列表
   */
  async getIntegrations(params) {
    await simulateDelay3();
    const page = (params == null ? void 0 : params.page) || 1;
    const size = (params == null ? void 0 : params.size) || 10;
    let filteredItems = [...mockIntegrations];
    if (params == null ? void 0 : params.name) {
      const keyword = params.name.toLowerCase();
      filteredItems = filteredItems.filter(
        (i) => i.name.toLowerCase().includes(keyword) || i.description && i.description.toLowerCase().includes(keyword)
      );
    }
    if (params == null ? void 0 : params.type) {
      filteredItems = filteredItems.filter((i) => i.type === params.type);
    }
    if (params == null ? void 0 : params.status) {
      filteredItems = filteredItems.filter((i) => i.status === params.status);
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
  },
  /**
   * 获取单个集成
   */
  async getIntegration(id) {
    await simulateDelay3();
    const integration = mockIntegrations.find((i) => i.id === id);
    if (!integration) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u96C6\u6210`);
    }
    return integration;
  },
  /**
   * 创建集成
   */
  async createIntegration(data) {
    await simulateDelay3();
    const newId = `integration-${Date.now()}`;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const newIntegration = {
      id: newId,
      name: data.name || "\u65B0\u96C6\u6210",
      description: data.description || "",
      type: data.type || "REST",
      baseUrl: data.baseUrl || "https://api.example.com",
      authType: data.authType || "NONE",
      status: "ACTIVE",
      createdAt: timestamp,
      updatedAt: timestamp,
      endpoints: data.endpoints || []
    };
    if (data.authType === "BASIC") {
      Object.assign(newIntegration, {
        username: data.username || "user",
        password: data.password || "********"
      });
    } else if (data.authType === "API_KEY") {
      Object.assign(newIntegration, {
        apiKey: data.apiKey || "********"
      });
    } else if (data.authType === "OAUTH2") {
      Object.assign(newIntegration, {
        clientId: data.clientId || "client",
        clientSecret: data.clientSecret || "********"
      });
    }
    mockIntegrations.push(newIntegration);
    return newIntegration;
  },
  /**
   * 更新集成
   */
  async updateIntegration(id, data) {
    await simulateDelay3();
    const index = mockIntegrations.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u96C6\u6210`);
    }
    const updatedIntegration = {
      ...mockIntegrations[index],
      ...data,
      id,
      // 确保ID不变
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    mockIntegrations[index] = updatedIntegration;
    return updatedIntegration;
  },
  /**
   * 删除集成
   */
  async deleteIntegration(id) {
    await simulateDelay3();
    const index = mockIntegrations.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u96C6\u6210`);
    }
    mockIntegrations.splice(index, 1);
    return true;
  },
  /**
   * 测试集成
   */
  async testIntegration(id, params = {}) {
    var _a;
    await simulateDelay3();
    const integration = mockIntegrations.find((i) => i.id === id);
    if (!integration) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u96C6\u6210`);
    }
    return {
      success: true,
      resultType: "JSON",
      jsonResponse: {
        status: "success",
        message: "\u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        details: {
          responseTime: Math.round(Math.random() * 100) + 50,
          serverInfo: "Mock Server v1.0",
          endpoint: params.endpoint || ((_a = integration.endpoints[0]) == null ? void 0 : _a.path) || "/"
        },
        data: Array.from({ length: 3 }, (_, i) => ({
          id: i + 1,
          name: `\u6837\u672C\u6570\u636E ${i + 1}`,
          value: Math.round(Math.random() * 1e3) / 10
        }))
      }
    };
  },
  /**
   * 执行集成查询
   */
  async executeQuery(id, params = {}) {
    await simulateDelay3();
    const integration = mockIntegrations.find((i) => i.id === id);
    if (!integration) {
      throw new Error(`\u672A\u627E\u5230ID\u4E3A${id}\u7684\u96C6\u6210`);
    }
    return {
      success: true,
      resultType: "JSON",
      jsonResponse: {
        status: "success",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        query: params.query || "\u9ED8\u8BA4\u67E5\u8BE2",
        data: Array.from({ length: 5 }, (_, i) => ({
          id: `record-${i + 1}`,
          name: `\u8BB0\u5F55 ${i + 1}`,
          description: `\u8FD9\u662F\u67E5\u8BE2\u8FD4\u56DE\u7684\u8BB0\u5F55 ${i + 1}`,
          createdAt: new Date(Date.now() - i * 864e5).toISOString(),
          properties: {
            type: i % 2 === 0 ? "A" : "B",
            value: Math.round(Math.random() * 100),
            active: i % 3 !== 0
          }
        }))
      }
    };
  },
  // 兼容旧的接口, 直接调用新的实现
  async getMockIntegrations() {
    const result = await integrationService.getIntegrations({});
    return result.items;
  },
  async getMockIntegration(id) {
    try {
      const integration = await integrationService.getIntegration(id);
      return integration;
    } catch (error) {
      console.error("\u83B7\u53D6\u96C6\u6210\u5931\u8D25:", error);
      return null;
    }
  },
  async createMockIntegration(data) {
    return integrationService.createIntegration(data);
  },
  async updateMockIntegration(id, updates) {
    return integrationService.updateIntegration(id, updates);
  },
  async deleteMockIntegration(id) {
    try {
      return await integrationService.deleteIntegration(id);
    } catch (error) {
      console.error("\u5220\u9664\u96C6\u6210\u5931\u8D25:", error);
      return false;
    }
  },
  async executeMockQuery(integrationId, query) {
    try {
      const result = await integrationService.executeQuery(integrationId, query);
      return {
        success: true,
        data: result.jsonResponse.data
      };
    } catch (error) {
      console.error("\u6267\u884C\u67E5\u8BE2\u5931\u8D25:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};
var getMockIntegrations = integrationService.getMockIntegrations;
var getMockIntegration = integrationService.getMockIntegration;
var createMockIntegration = integrationService.createMockIntegration;
var updateMockIntegration = integrationService.updateMockIntegration;
var deleteMockIntegration = integrationService.deleteMockIntegration;
var executeMockQuery = integrationService.executeMockQuery;
var integration_default = integrationService;

// src/mock/services/index.ts
var services = {
  dataSource: datasource_default,
  query: query_default2,
  integration: integration_default
};
var dataSourceService = services.dataSource;
var queryService2 = services.query;
var integrationService2 = services.integration;

// src/mock/middleware/index.ts
function handleCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Mock-Enabled");
  res.setHeader("Access-Control-Max-Age", "86400");
}
function sendJsonResponse(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
function delay2(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function parseRequestBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}
async function handleDatasourcesApi(req, res, urlPath, urlQuery) {
  var _a;
  const method = (_a = req.method) == null ? void 0 : _a.toUpperCase();
  if (urlPath === "/api/datasources" && method === "GET") {
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: /api/datasources`);
    try {
      const result = await dataSourceService.getDataSources({
        page: parseInt(urlQuery.page) || 1,
        size: parseInt(urlQuery.size) || 10,
        name: urlQuery.name,
        type: urlQuery.type,
        status: urlQuery.status
      });
      sendJsonResponse(res, 200, {
        data: result.items,
        pagination: result.pagination,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 500, {
        error: "\u83B7\u53D6\u6570\u636E\u6E90\u5217\u8868\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/datasources\/[^\/]+$/) && method === "GET") {
    const id = urlPath.split("/").pop() || "";
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      const datasource = await dataSourceService.getDataSource(id);
      sendJsonResponse(res, 200, {
        data: datasource,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u6570\u636E\u6E90\u4E0D\u5B58\u5728",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath === "/api/datasources" && method === "POST") {
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: /api/datasources`);
    try {
      const body = await parseRequestBody(req);
      const newDataSource = await dataSourceService.createDataSource(body);
      sendJsonResponse(res, 201, {
        data: newDataSource,
        message: "\u6570\u636E\u6E90\u521B\u5EFA\u6210\u529F",
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: "\u521B\u5EFA\u6570\u636E\u6E90\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/datasources\/[^\/]+$/) && method === "PUT") {
    const id = urlPath.split("/").pop() || "";
    logMock("debug", `\u5904\u7406PUT\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      const body = await parseRequestBody(req);
      const updatedDataSource = await dataSourceService.updateDataSource(id, body);
      sendJsonResponse(res, 200, {
        data: updatedDataSource,
        message: "\u6570\u636E\u6E90\u66F4\u65B0\u6210\u529F",
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u66F4\u65B0\u6570\u636E\u6E90\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/datasources\/[^\/]+$/) && method === "DELETE") {
    const id = urlPath.split("/").pop() || "";
    logMock("debug", `\u5904\u7406DELETE\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      await dataSourceService.deleteDataSource(id);
      sendJsonResponse(res, 200, {
        message: "\u6570\u636E\u6E90\u5220\u9664\u6210\u529F",
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u5220\u9664\u6570\u636E\u6E90\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath === "/api/datasources/test-connection" && method === "POST") {
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: /api/datasources/test-connection`);
    try {
      const body = await parseRequestBody(req);
      const result = await dataSourceService.testConnection(body);
      sendJsonResponse(res, 200, {
        data: result,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: "\u6D4B\u8BD5\u8FDE\u63A5\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  return false;
}
async function handleQueriesApi(req, res, urlPath, urlQuery) {
  var _a;
  const method = (_a = req.method) == null ? void 0 : _a.toUpperCase();
  const isQueriesPath = urlPath.includes("/queries");
  if (isQueriesPath) {
    console.log(`[Mock] \u68C0\u6D4B\u5230\u67E5\u8BE2API\u8BF7\u6C42: ${method} ${urlPath}`, urlQuery);
  }
  if (urlPath === "/api/queries" && method === "GET") {
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: /api/queries`);
    console.log("[Mock] \u5904\u7406\u67E5\u8BE2\u5217\u8868\u8BF7\u6C42, \u53C2\u6570:", urlQuery);
    try {
      const result = await queryService2.getQueries({
        page: parseInt(urlQuery.page) || 1,
        size: parseInt(urlQuery.size) || 10,
        name: urlQuery.name,
        dataSourceId: urlQuery.dataSourceId,
        status: urlQuery.status,
        queryType: urlQuery.queryType,
        isFavorite: urlQuery.isFavorite === "true"
      });
      console.log("[Mock] \u67E5\u8BE2\u5217\u8868\u7ED3\u679C:", {
        itemsCount: result.items.length,
        pagination: result.pagination
      });
      console.log("[Mock] \u8FD4\u56DE\u67E5\u8BE2\u5217\u8868\u6570\u636E\u683C\u5F0F:", {
        data: `Array[${result.items.length}]`,
        pagination: result.pagination,
        success: true
      });
      if (result.items.length === 0) {
        try {
          const mockQueryData = await Promise.resolve().then(() => (init_query(), query_exports));
          const mockQueries2 = mockQueryData.mockQueries || [];
          if (mockQueries2.length > 0) {
            console.log("[Mock] \u67E5\u8BE2\u5217\u8868\u4E3A\u7A7A\uFF0C\u4F7F\u7528\u6A21\u62DF\u6570\u636E:", mockQueries2.length);
            const page = parseInt(urlQuery.page) || 1;
            const size = parseInt(urlQuery.size) || 10;
            const start = (page - 1) * size;
            const end = Math.min(start + size, mockQueries2.length);
            const paginatedItems = mockQueries2.slice(start, end);
            const pagination = {
              total: mockQueries2.length,
              page,
              size,
              totalPages: Math.ceil(mockQueries2.length / size)
            };
            sendJsonResponse(res, 200, {
              data: paginatedItems,
              pagination,
              success: true
            });
            return true;
          }
        } catch (error) {
          console.error("[Mock] \u5BFC\u5165\u67E5\u8BE2\u6A21\u62DF\u6570\u636E\u5931\u8D25:", error);
        }
      }
      sendJsonResponse(res, 200, {
        data: result.items,
        pagination: result.pagination,
        success: true
      });
    } catch (error) {
      console.error("[Mock] \u83B7\u53D6\u67E5\u8BE2\u5217\u8868\u5931\u8D25:", error);
      sendJsonResponse(res, 500, {
        error: "\u83B7\u53D6\u67E5\u8BE2\u5217\u8868\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+$/) && method === "GET") {
    const id = urlPath.split("/").pop() || "";
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      const query = await queryService2.getQuery(id);
      sendJsonResponse(res, 200, {
        data: query,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u67E5\u8BE2\u4E0D\u5B58\u5728",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath === "/api/queries" && method === "POST") {
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: /api/queries`);
    try {
      const body = await parseRequestBody(req);
      const newQuery = await queryService2.createQuery(body);
      sendJsonResponse(res, 201, {
        data: newQuery,
        message: "\u67E5\u8BE2\u521B\u5EFA\u6210\u529F",
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: "\u521B\u5EFA\u67E5\u8BE2\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+$/) && method === "PUT") {
    const id = urlPath.split("/").pop() || "";
    logMock("debug", `\u5904\u7406PUT\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      const body = await parseRequestBody(req);
      const updatedQuery = await queryService2.updateQuery(id, body);
      sendJsonResponse(res, 200, {
        data: updatedQuery,
        message: "\u67E5\u8BE2\u66F4\u65B0\u6210\u529F",
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u66F4\u65B0\u67E5\u8BE2\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/execute$/) && method === "POST") {
    const id = urlPath.split("/")[3];
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      const body = await parseRequestBody(req);
      const result = await queryService2.executeQuery(id, body);
      sendJsonResponse(res, 200, {
        data: result,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: "\u6267\u884C\u67E5\u8BE2\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions$/) && method === "POST") {
    const queryId = urlPath.split("/")[3];
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, \u67E5\u8BE2ID: ${queryId}`);
    try {
      const body = await parseRequestBody(req);
      const result = await queryService2.createQueryVersion(queryId, body);
      sendJsonResponse(res, 201, {
        data: result,
        success: true,
        message: "\u67E5\u8BE2\u7248\u672C\u521B\u5EFA\u6210\u529F"
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u521B\u5EFA\u67E5\u8BE2\u7248\u672C\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions$/) && method === "GET") {
    const queryId = urlPath.split("/")[3];
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, \u67E5\u8BE2ID: ${queryId}`);
    try {
      const versions = await queryService2.getQueryVersions(queryId);
      sendJsonResponse(res, 200, {
        data: versions,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u83B7\u53D6\u67E5\u8BE2\u7248\u672C\u5217\u8868\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  return false;
}
async function handleIntegrationApi(req, res, urlPath, urlQuery) {
  var _a;
  const method = (_a = req.method) == null ? void 0 : _a.toUpperCase();
  if (urlPath.includes("/api/low-code/apis")) {
    console.log("[Mock] \u68C0\u6D4B\u5230\u96C6\u6210API\u8BF7\u6C42, \u7531\u65E7\u62E6\u622A\u5668\u5904\u7406:", method, urlPath);
    return true;
  }
  return false;
}
function createMockMiddleware() {
  return async function mockMiddleware(req, res, next) {
    var _a;
    if (!shouldMockRequest(req)) {
      return next();
    }
    const url = parse(req.url || "", true);
    const urlPath = url.pathname || "";
    const urlQuery = url.query || {};
    logMock("debug", `\u6536\u5230\u8BF7\u6C42: ${req.method} ${urlPath}`);
    if (((_a = req.method) == null ? void 0 : _a.toUpperCase()) === "OPTIONS") {
      handleCors(res);
      res.statusCode = 204;
      res.end();
      return;
    }
    handleCors(res);
    if (mockConfig.delay > 0) {
      await delay2(mockConfig.delay);
    }
    try {
      let handled = false;
      if (urlPath.includes("/low-code/apis")) {
        console.log("[Mock] \u68C0\u6D4B\u5230\u96C6\u6210API\u8BF7\u6C42:", req.method, urlPath, urlQuery);
        handled = await handleIntegrationApi(req, res, urlPath, urlQuery);
        if (handled)
          return;
      }
      if (urlPath.includes("/datasources")) {
        handled = await handleDatasourcesApi(req, res, urlPath, urlQuery);
        if (handled)
          return;
      }
      if (urlPath.includes("/queries")) {
        handled = await handleQueriesApi(req, res, urlPath, urlQuery);
        if (handled)
          return;
      }
      if (!handled) {
        sendJsonResponse(res, 404, {
          error: "\u672A\u627E\u5230\u8BF7\u6C42\u7684API",
          message: `\u672A\u627E\u5230\u8DEF\u5F84: ${urlPath}`,
          success: false
        });
      }
    } catch (error) {
      console.error("[Mock] \u5904\u7406\u8BF7\u6C42\u65F6\u53D1\u751F\u9519\u8BEF:", error);
      sendJsonResponse(res, 500, {
        error: "\u670D\u52A1\u5668\u9519\u8BEF",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
  };
}
var middleware_default = createMockMiddleware;

// src/mock/middleware/simple.ts
function createSimpleMiddleware() {
  console.log("[\u7B80\u5355\u4E2D\u95F4\u4EF6] \u5DF2\u521B\u5EFA\u6D4B\u8BD5\u4E2D\u95F4\u4EF6\uFF0C\u5C06\u5904\u7406/api/test\u8DEF\u5F84\u7684\u8BF7\u6C42");
  return function simpleMiddleware(req, res, next) {
    const url = req.url || "";
    const method = req.method || "UNKNOWN";
    if (url === "/api/test") {
      console.log(`[\u7B80\u5355\u4E2D\u95F4\u4EF6] \u6536\u5230\u6D4B\u8BD5\u8BF7\u6C42: ${method} ${url}`);
      try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        if (method === "OPTIONS") {
          console.log("[\u7B80\u5355\u4E2D\u95F4\u4EF6] \u5904\u7406OPTIONS\u9884\u68C0\u8BF7\u6C42");
          res.statusCode = 204;
          res.end();
          return;
        }
        res.removeHeader("Content-Type");
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.statusCode = 200;
        const responseData = {
          success: true,
          message: "\u7B80\u5355\u6D4B\u8BD5\u4E2D\u95F4\u4EF6\u54CD\u5E94\u6210\u529F",
          data: {
            time: (/* @__PURE__ */ new Date()).toISOString(),
            method,
            url,
            headers: req.headers,
            params: url.includes("?") ? url.split("?")[1] : null
          }
        };
        console.log("[\u7B80\u5355\u4E2D\u95F4\u4EF6] \u53D1\u9001\u6D4B\u8BD5\u54CD\u5E94");
        res.end(JSON.stringify(responseData, null, 2));
        return;
      } catch (error) {
        console.error("[\u7B80\u5355\u4E2D\u95F4\u4EF6] \u5904\u7406\u8BF7\u6C42\u65F6\u51FA\u9519:", error);
        res.removeHeader("Content-Type");
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({
          success: false,
          message: "\u5904\u7406\u8BF7\u6C42\u65F6\u51FA\u9519",
          error: error instanceof Error ? error.message : String(error)
        }));
        return;
      }
    }
    next();
  };
}

// vite.config.ts
import fs from "fs";
var __vite_injected_original_dirname = "/Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui";
function killPort(port) {
  console.log(`[Vite] \u68C0\u67E5\u7AEF\u53E3 ${port} \u5360\u7528\u60C5\u51B5`);
  try {
    if (process.platform === "win32") {
      execSync(`netstat -ano | findstr :${port}`);
      execSync(`taskkill /F /pid $(netstat -ano | findstr :${port} | awk '{print $5}')`, { stdio: "inherit" });
    } else {
      execSync(`lsof -i :${port} -t | xargs kill -9`, { stdio: "inherit" });
    }
    console.log(`[Vite] \u5DF2\u91CA\u653E\u7AEF\u53E3 ${port}`);
  } catch (e) {
    console.log(`[Vite] \u7AEF\u53E3 ${port} \u672A\u88AB\u5360\u7528\u6216\u65E0\u6CD5\u91CA\u653E`);
  }
}
function cleanViteCache() {
  console.log("[Vite] \u6E05\u7406\u4F9D\u8D56\u7F13\u5B58");
  const cachePaths = [
    "./node_modules/.vite",
    "./node_modules/.vite_*",
    "./.vite",
    "./dist",
    "./tmp",
    "./.temp"
  ];
  cachePaths.forEach((cachePath) => {
    try {
      if (fs.existsSync(cachePath)) {
        if (fs.lstatSync(cachePath).isDirectory()) {
          execSync(`rm -rf ${cachePath}`);
        } else {
          fs.unlinkSync(cachePath);
        }
        console.log(`[Vite] \u5DF2\u5220\u9664: ${cachePath}`);
      }
    } catch (e) {
      console.log(`[Vite] \u65E0\u6CD5\u5220\u9664: ${cachePath}`, e);
    }
  });
}
cleanViteCache();
killPort(8080);
function createMockApiPlugin(useMock, useSimpleMock) {
  if (!useMock && !useSimpleMock) {
    return null;
  }
  const mockMiddleware = useMock ? middleware_default() : null;
  const simpleMiddleware = useSimpleMock ? createSimpleMiddleware() : null;
  return {
    name: "vite-plugin-mock-api",
    // 关键点：使用 pre 确保此插件先于内置插件执行
    enforce: "pre",
    // 在服务器创建之前配置
    configureServer(server) {
      const originalHandler = server.middlewares.handle;
      server.middlewares.handle = function(req, res, next) {
        const url = req.url || "";
        if (url.startsWith("/api/")) {
          console.log(`[Mock\u63D2\u4EF6] \u68C0\u6D4B\u5230API\u8BF7\u6C42: ${req.method} ${url}`);
          if (useSimpleMock && simpleMiddleware && url.startsWith("/api/test")) {
            console.log(`[Mock\u63D2\u4EF6] \u4F7F\u7528\u7B80\u5355\u4E2D\u95F4\u4EF6\u5904\u7406: ${url}`);
            req._mockHandled = true;
            return simpleMiddleware(req, res, (err) => {
              if (err) {
                console.error(`[Mock\u63D2\u4EF6] \u7B80\u5355\u4E2D\u95F4\u4EF6\u5904\u7406\u51FA\u9519:`, err);
                next(err);
              } else if (!res.writableEnded) {
                next();
              }
            });
          }
          if (useMock && mockMiddleware) {
            console.log(`[Mock\u63D2\u4EF6] \u4F7F\u7528Mock\u4E2D\u95F4\u4EF6\u5904\u7406: ${url}`);
            req._mockHandled = true;
            return mockMiddleware(req, res, (err) => {
              if (err) {
                console.error(`[Mock\u63D2\u4EF6] Mock\u4E2D\u95F4\u4EF6\u5904\u7406\u51FA\u9519:`, err);
                next(err);
              } else if (!res.writableEnded) {
                next();
              }
            });
          }
        }
        return originalHandler.call(server.middlewares, req, res, next);
      };
    }
  };
}
var vite_config_default = defineConfig(({ mode }) => {
  process.env.VITE_USE_MOCK_API = process.env.VITE_USE_MOCK_API || "false";
  const env = loadEnv(mode, process.cwd(), "");
  const useMockApi = process.env.VITE_USE_MOCK_API === "true";
  const disableHmr = process.env.VITE_DISABLE_HMR === "true";
  const useSimpleMock = true;
  console.log(`[Vite\u914D\u7F6E] \u8FD0\u884C\u6A21\u5F0F: ${mode}`);
  console.log(`[Vite\u914D\u7F6E] Mock API: ${useMockApi ? "\u542F\u7528" : "\u7981\u7528"}`);
  console.log(`[Vite\u914D\u7F6E] \u7B80\u5355Mock\u6D4B\u8BD5: ${useSimpleMock ? "\u542F\u7528" : "\u7981\u7528"}`);
  console.log(`[Vite\u914D\u7F6E] HMR: ${disableHmr ? "\u7981\u7528" : "\u542F\u7528"}`);
  const mockPlugin = createMockApiPlugin(useMockApi, useSimpleMock);
  return {
    plugins: [
      // 添加Mock插件（如果启用）
      ...mockPlugin ? [mockPlugin] : [],
      vue()
    ],
    server: {
      port: 8080,
      strictPort: true,
      host: "localhost",
      open: false,
      // HMR配置
      hmr: disableHmr ? false : {
        protocol: "ws",
        host: "localhost",
        port: 8080,
        clientPort: 8080
      },
      // 禁用代理，让中间件处理所有请求
      proxy: {}
    },
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer]
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: {
      emptyOutDir: true,
      target: "es2015",
      sourcemap: true,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    optimizeDeps: {
      // 包含基本依赖
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "dayjs",
        "ant-design-vue",
        "ant-design-vue/es/locale/zh_CN"
      ],
      // 排除特定依赖
      exclude: [
        // 排除插件中的服务器Mock
        "src/plugins/serverMock.ts",
        // 排除fsevents本地模块，避免构建错误
        "fsevents"
      ],
      // 确保依赖预构建正确完成
      force: true
    },
    // 使用单独的缓存目录
    cacheDir: "node_modules/.vite_cache",
    // 防止堆栈溢出
    esbuild: {
      logOverride: {
        "this-is-undefined-in-esm": "silent"
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svZGF0YS9xdWVyeS50cyIsICJ2aXRlLmNvbmZpZy50cyIsICJzcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzIiwgInNyYy9tb2NrL2NvbmZpZy50cyIsICJzcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHMiLCAic3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy91dGlscy50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9xdWVyeS50cyIsICJzcmMvbW9jay9kYXRhL2ludGVncmF0aW9uLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2ludGVncmF0aW9uLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzIiwgInNyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL3F1ZXJ5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL3F1ZXJ5LnRzXCI7LyoqXG4gKiBcdTY3RTVcdThCRTJcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczXHU3Njg0XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBRdWVyeSB9IGZyb20gJ0AvdHlwZXMvcXVlcnknO1xuXG4vLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbmV4cG9ydCBjb25zdCBtb2NrUXVlcmllczogUXVlcnlbXSA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiB7XG4gIGNvbnN0IGlkID0gYHF1ZXJ5LSR7aSArIDF9YDtcbiAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKTtcbiAgXG4gIHJldHVybiB7XG4gICAgaWQsXG4gICAgbmFtZTogYFx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfWAsXG4gICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX0gXHU3Njg0XHU2M0NGXHU4RkYwYCxcbiAgICBmb2xkZXJJZDogaSAlIDMgPT09IDAgPyAnZm9sZGVyLTEnIDogKGkgJSAzID09PSAxID8gJ2ZvbGRlci0yJyA6ICdmb2xkZXItMycpLFxuICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICBkYXRhU291cmNlTmFtZTogYFx1NjU3MFx1NjM2RVx1NkU5MCAkeyhpICUgNSkgKyAxfWAsXG4gICAgcXVlcnlUeXBlOiBpICUgMiA9PT0gMCA/ICdTUUwnIDogJ05BVFVSQUxfTEFOR1VBR0UnLFxuICAgIHF1ZXJ5VGV4dDogaSAlIDIgPT09IDAgPyBcbiAgICAgIGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgIDogXG4gICAgICBgXHU2N0U1XHU2MjdFXHU2NzAwXHU4RkQxMTBcdTY3NjEke2kgJSAyID09PSAwID8gJ1x1OEJBMlx1NTM1NScgOiAnXHU3NTI4XHU2MjM3J31cdThCQjBcdTVGNTVgLFxuICAgIHN0YXR1czogaSAlIDQgPT09IDAgPyAnRFJBRlQnIDogKGkgJSA0ID09PSAxID8gJ1BVQkxJU0hFRCcgOiAoaSAlIDQgPT09IDIgPyAnREVQUkVDQVRFRCcgOiAnQVJDSElWRUQnKSksXG4gICAgc2VydmljZVN0YXR1czogaSAlIDIgPT09IDAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgdXBkYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgIGV4ZWN1dGlvbkNvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCksXG4gICAgaXNGYXZvcml0ZTogaSAlIDMgPT09IDAsXG4gICAgaXNBY3RpdmU6IGkgJSA1ICE9PSAwLFxuICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMCkudG9JU09TdHJpbmcoKSxcbiAgICByZXN1bHRDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgIGV4ZWN1dGlvblRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkgKyAxMCxcbiAgICB0YWdzOiBbYFx1NjgwN1x1N0I3RSR7aSsxfWAsIGBcdTdDN0JcdTU3OEIke2kgJSAzfWBdLFxuICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfSxcbiAgICB2ZXJzaW9uczogW3tcbiAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgcXVlcnlJZDogaWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9XVxuICB9O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1vY2tRdWVyaWVzOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCBQbHVnaW4sIENvbm5lY3QgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuaW1wb3J0IHsgY3JlYXRlU2ltcGxlTWlkZGxld2FyZSB9IGZyb20gJy4vc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgeyBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gJ2h0dHAnXG5cbi8vIFx1NUYzQVx1NTIzNlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFM1x1NTFGRFx1NjU3MFxuZnVuY3Rpb24ga2lsbFBvcnQocG9ydDogbnVtYmVyKSB7XG4gIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2OEMwXHU2N0U1XHU3QUVGXHU1M0UzICR7cG9ydH0gXHU1MzYwXHU3NTI4XHU2MEM1XHU1MUI1YCk7XG4gIHRyeSB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgIGV4ZWNTeW5jKGBuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9YCk7XG4gICAgICBleGVjU3luYyhgdGFza2tpbGwgL0YgL3BpZCAkKG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH0gfCBhd2sgJ3twcmludCAkNX0nKWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhlY1N5bmMoYGxzb2YgLWkgOiR7cG9ydH0gLXQgfCB4YXJncyBraWxsIC05YCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NURGMlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFMyAke3BvcnR9YCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NjcyQVx1ODhBQlx1NTM2MFx1NzUyOFx1NjIxNlx1NjVFMFx1NkNENVx1OTFDQVx1NjUzRWApO1xuICB9XG59XG5cbi8vIFx1NUYzQVx1NTIzNlx1NkUwNVx1NzQwNlZpdGVcdTdGMTNcdTVCNThcbmZ1bmN0aW9uIGNsZWFuVml0ZUNhY2hlKCkge1xuICBjb25zb2xlLmxvZygnW1ZpdGVdIFx1NkUwNVx1NzQwNlx1NEY5RFx1OEQ1Nlx1N0YxM1x1NUI1OCcpO1xuICBjb25zdCBjYWNoZVBhdGhzID0gW1xuICAgICcuL25vZGVfbW9kdWxlcy8udml0ZScsXG4gICAgJy4vbm9kZV9tb2R1bGVzLy52aXRlXyonLFxuICAgICcuLy52aXRlJyxcbiAgICAnLi9kaXN0JyxcbiAgICAnLi90bXAnLFxuICAgICcuLy50ZW1wJ1xuICBdO1xuICBcbiAgY2FjaGVQYXRocy5mb3JFYWNoKGNhY2hlUGF0aCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGNhY2hlUGF0aCkpIHtcbiAgICAgICAgaWYgKGZzLmxzdGF0U3luYyhjYWNoZVBhdGgpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBleGVjU3luYyhgcm0gLXJmICR7Y2FjaGVQYXRofWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLnVubGlua1N5bmMoY2FjaGVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NURGMlx1NTIyMFx1OTY2NDogJHtjYWNoZVBhdGh9YCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTY1RTBcdTZDRDVcdTUyMjBcdTk2NjQ6ICR7Y2FjaGVQYXRofWAsIGUpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIFx1NkUwNVx1NzQwNlZpdGVcdTdGMTNcdTVCNThcbmNsZWFuVml0ZUNhY2hlKCk7XG5cbi8vIFx1NUMxRFx1OEJENVx1OTFDQVx1NjUzRVx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1N0FFRlx1NTNFM1xua2lsbFBvcnQoODA4MCk7XG5cbi8vIFx1NTIxQlx1NUVGQU1vY2sgQVBJXHU2M0QyXHU0RUY2XG5mdW5jdGlvbiBjcmVhdGVNb2NrQXBpUGx1Z2luKHVzZU1vY2s6IGJvb2xlYW4sIHVzZVNpbXBsZU1vY2s6IGJvb2xlYW4pOiBQbHVnaW4gfCBudWxsIHtcbiAgaWYgKCF1c2VNb2NrICYmICF1c2VTaW1wbGVNb2NrKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgXG4gIC8vIFx1NTJBMFx1OEY3RFx1NEUyRFx1OTVGNFx1NEVGNlxuICBjb25zdCBtb2NrTWlkZGxld2FyZSA9IHVzZU1vY2sgPyBjcmVhdGVNb2NrTWlkZGxld2FyZSgpIDogbnVsbDtcbiAgY29uc3Qgc2ltcGxlTWlkZGxld2FyZSA9IHVzZVNpbXBsZU1vY2sgPyBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlKCkgOiBudWxsO1xuICBcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZS1wbHVnaW4tbW9jay1hcGknLFxuICAgIC8vIFx1NTE3M1x1OTUyRVx1NzBCOVx1RkYxQVx1NEY3Rlx1NzUyOCBwcmUgXHU3ODZFXHU0RkREXHU2QjY0XHU2M0QyXHU0RUY2XHU1MTQ4XHU0RThFXHU1MTg1XHU3RjZFXHU2M0QyXHU0RUY2XHU2MjY3XHU4ODRDXG4gICAgZW5mb3JjZTogJ3ByZScgYXMgY29uc3QsXG4gICAgLy8gXHU1NzI4XHU2NzBEXHU1MkExXHU1NjY4XHU1MjFCXHU1RUZBXHU0RTRCXHU1MjREXHU5MTREXHU3RjZFXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgLy8gXHU2NkZGXHU2MzYyXHU1MzlGXHU1OUNCXHU4QkY3XHU2QzQyXHU1OTA0XHU3NDA2XHU1NjY4XHVGRjBDXHU0RjdGXHU2MjExXHU0RUVDXHU3Njg0XHU0RTJEXHU5NUY0XHU0RUY2XHU1MTc3XHU2NzA5XHU2NzAwXHU5QUQ4XHU0RjE4XHU1MTQ4XHU3RUE3XG4gICAgICBjb25zdCBvcmlnaW5hbEhhbmRsZXIgPSBzZXJ2ZXIubWlkZGxld2FyZXMuaGFuZGxlO1xuICAgICAgXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMuaGFuZGxlID0gZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTNFQVx1NTkwNFx1NzQwNkFQSVx1OEJGN1x1NkM0MlxuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJy9hcGkvJykpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTYzRDJcdTRFRjZdIFx1NjhDMFx1NkQ0Qlx1NTIzMEFQSVx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3VybH1gKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTRGMThcdTUxNDhcdTU5MDRcdTc0MDZcdTcyNzlcdTVCOUFcdTZENEJcdThCRDVBUElcbiAgICAgICAgICBpZiAodXNlU2ltcGxlTW9jayAmJiBzaW1wbGVNaWRkbGV3YXJlICYmIHVybC5zdGFydHNXaXRoKCcvYXBpL3Rlc3QnKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTRGN0ZcdTc1MjhcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDY6ICR7dXJsfWApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdThCQkVcdTdGNkVcdTRFMDBcdTRFMkFcdTY4MDdcdThCQjBcdUZGMENcdTk2MzJcdTZCNjJcdTUxNzZcdTRFRDZcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTZCNjRcdThCRjdcdTZDNDJcbiAgICAgICAgICAgIChyZXEgYXMgYW55KS5fbW9ja0hhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gc2ltcGxlTWlkZGxld2FyZShyZXEsIHJlcywgKGVycj86IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU1MUZBXHU5NTE5OmAsIGVycik7XG4gICAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEocmVzIGFzIFNlcnZlclJlc3BvbnNlKS53cml0YWJsZUVuZGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NENEXHU1RTk0XHU2Q0ExXHU2NzA5XHU3RUQzXHU2NzVGXHVGRjBDXHU3RUU3XHU3RUVEXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU1OTA0XHU3NDA2XHU1MTc2XHU0RUQ2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgICAgaWYgKHVzZU1vY2sgJiYgbW9ja01pZGRsZXdhcmUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU0RjdGXHU3NTI4TW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNjogJHt1cmx9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFx1OEJCRVx1N0Y2RVx1NEUwMFx1NEUyQVx1NjgwN1x1OEJCMFx1RkYwQ1x1OTYzMlx1NkI2Mlx1NTE3Nlx1NEVENlx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgKHJlcSBhcyBhbnkpLl9tb2NrSGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBtb2NrTWlkZGxld2FyZShyZXEsIHJlcywgKGVycj86IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbTW9ja1x1NjNEMlx1NEVGNl0gTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NTFGQVx1OTUxOTpgLCBlcnIpO1xuICAgICAgICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghKHJlcyBhcyBTZXJ2ZXJSZXNwb25zZSkud3JpdGFibGVFbmRlZCkge1xuICAgICAgICAgICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NTRDRFx1NUU5NFx1NkNBMVx1NjcwOVx1N0VEM1x1Njc1Rlx1RkYwQ1x1N0VFN1x1N0VFRFx1NTkwNFx1NzQwNlxuICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBcdTVCRjlcdTRFOEVcdTk3NUVBUElcdThCRjdcdTZDNDJcdUZGMENcdTRGN0ZcdTc1MjhcdTUzOUZcdTU5Q0JcdTU5MDRcdTc0MDZcdTU2NjhcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsSGFuZGxlci5jYWxsKHNlcnZlci5taWRkbGV3YXJlcywgcmVxLCByZXMsIG5leHQpO1xuICAgICAgfTtcbiAgICB9XG4gIH07XG59XG5cbi8vIFx1NTdGQVx1NjcyQ1x1OTE0RFx1N0Y2RVxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAvLyBcdTUyQTBcdThGN0RcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcbiAgcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPSBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSB8fCAnZmFsc2UnO1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2sgQVBJIC0gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU4QkZCXHU1M0Q2XG4gIGNvbnN0IHVzZU1vY2tBcGkgPSBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU3OTgxXHU3NTI4SE1SIC0gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU4QkZCXHU1M0Q2XG4gIGNvbnN0IGRpc2FibGVIbXIgPSBwcm9jZXNzLmVudi5WSVRFX0RJU0FCTEVfSE1SID09PSAndHJ1ZSc7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTRGN0ZcdTc1MjhcdTdCODBcdTUzNTVcdTZENEJcdThCRDVcdTZBMjFcdTYyREZBUElcbiAgY29uc3QgdXNlU2ltcGxlTW9jayA9IHRydWU7XG4gIFxuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIFx1OEZEMFx1ODg0Q1x1NkEyMVx1NUYwRjogJHttb2RlfWApO1xuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIE1vY2sgQVBJOiAke3VzZU1vY2tBcGkgPyAnXHU1NDJGXHU3NTI4JyA6ICdcdTc5ODFcdTc1MjgnfWApO1xuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIFx1N0I4MFx1NTM1NU1vY2tcdTZENEJcdThCRDU6ICR7dXNlU2ltcGxlTW9jayA/ICdcdTU0MkZcdTc1MjgnIDogJ1x1Nzk4MVx1NzUyOCd9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gSE1SOiAke2Rpc2FibGVIbXIgPyAnXHU3OTgxXHU3NTI4JyA6ICdcdTU0MkZcdTc1MjgnfWApO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBTW9ja1x1NjNEMlx1NEVGNlxuICBjb25zdCBtb2NrUGx1Z2luID0gY3JlYXRlTW9ja0FwaVBsdWdpbih1c2VNb2NrQXBpLCB1c2VTaW1wbGVNb2NrKTtcbiAgXG4gIC8vIFx1OTE0RFx1N0Y2RVxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIC8vIFx1NkRGQlx1NTJBME1vY2tcdTYzRDJcdTRFRjZcdUZGMDhcdTU5ODJcdTY3OUNcdTU0MkZcdTc1MjhcdUZGMDlcbiAgICAgIC4uLihtb2NrUGx1Z2luID8gW21vY2tQbHVnaW5dIDogW10pLFxuICAgICAgdnVlKCksXG4gICAgXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IDgwODAsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICBvcGVuOiBmYWxzZSxcbiAgICAgIC8vIEhNUlx1OTE0RFx1N0Y2RVxuICAgICAgaG1yOiBkaXNhYmxlSG1yID8gZmFsc2UgOiB7XG4gICAgICAgIHByb3RvY29sOiAnd3MnLFxuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgICAgY2xpZW50UG9ydDogODA4MCxcbiAgICAgIH0sXG4gICAgICAvLyBcdTc5ODFcdTc1MjhcdTRFRTNcdTc0MDZcdUZGMENcdThCQTlcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTYyNDBcdTY3MDlcdThCRjdcdTZDNDJcbiAgICAgIHByb3h5OiB7fVxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIGxlc3M6IHtcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICAgIHRhcmdldDogJ2VzMjAxNScsXG4gICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgLy8gXHU1MzA1XHU1NDJCXHU1N0ZBXHU2NzJDXHU0RjlEXHU4RDU2XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgICd2dWUnLCBcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAncGluaWEnLFxuICAgICAgICAnYXhpb3MnLFxuICAgICAgICAnZGF5anMnLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUnLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL3poX0NOJ1xuICAgICAgXSxcbiAgICAgIC8vIFx1NjM5Mlx1OTY2NFx1NzI3OVx1NUI5QVx1NEY5RFx1OEQ1NlxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAvLyBcdTYzOTJcdTk2NjRcdTYzRDJcdTRFRjZcdTRFMkRcdTc2ODRcdTY3MERcdTUyQTFcdTU2NjhNb2NrXG4gICAgICAgICdzcmMvcGx1Z2lucy9zZXJ2ZXJNb2NrLnRzJyxcbiAgICAgICAgLy8gXHU2MzkyXHU5NjY0ZnNldmVudHNcdTY3MkNcdTU3MzBcdTZBMjFcdTU3NTdcdUZGMENcdTkwN0ZcdTUxNERcdTY3ODRcdTVFRkFcdTk1MTlcdThCRUZcbiAgICAgICAgJ2ZzZXZlbnRzJ1xuICAgICAgXSxcbiAgICAgIC8vIFx1Nzg2RVx1NEZERFx1NEY5RFx1OEQ1Nlx1OTg4NFx1Njc4NFx1NUVGQVx1NkI2M1x1Nzg2RVx1NUI4Q1x1NjIxMFxuICAgICAgZm9yY2U6IHRydWUsXG4gICAgfSxcbiAgICAvLyBcdTRGN0ZcdTc1MjhcdTUzNTVcdTcyRUNcdTc2ODRcdTdGMTNcdTVCNThcdTc2RUVcdTVGNTVcbiAgICBjYWNoZURpcjogJ25vZGVfbW9kdWxlcy8udml0ZV9jYWNoZScsXG4gICAgLy8gXHU5NjMyXHU2QjYyXHU1ODA2XHU2ODA4XHU2RUEyXHU1MUZBXG4gICAgZXNidWlsZDoge1xuICAgICAgbG9nT3ZlcnJpZGU6IHtcbiAgICAgICAgJ3RoaXMtaXMtdW5kZWZpbmVkLWluLWVzbSc6ICdzaWxlbnQnXG4gICAgICB9LFxuICAgIH1cbiAgfVxufSk7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTdCQTFcdTc0MDZcdTZBMjFcdTU3NTdcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0SFRUUFx1OEJGN1x1NkM0Mlx1NjJFNlx1NjIyQVx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFxuICogXHU4RDFGXHU4RDIzXHU3QkExXHU3NDA2XHU1NDhDXHU1MjA2XHU1M0QxXHU2MjQwXHU2NzA5QVBJXHU4QkY3XHU2QzQyXHU1MjMwXHU1QkY5XHU1RTk0XHU3Njg0XHU2NzBEXHU1MkExXHU1OTA0XHU3NDA2XHU1MUZEXHU2NTcwXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnLCBzaG91bGRNb2NrUmVxdWVzdCwgbG9nTW9jayB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NUJGQ1x1NTE2NVx1NjcwRFx1NTJBMVxuaW1wb3J0IHsgZGF0YVNvdXJjZVNlcnZpY2UsIHF1ZXJ5U2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzJztcbmltcG9ydCBpbnRlZ3JhdGlvblNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvaW50ZWdyYXRpb24nO1xuXG4vLyBcdTU5MDRcdTc0MDZDT1JTXHU4QkY3XHU2QzQyXG5mdW5jdGlvbiBoYW5kbGVDb3JzKHJlczogU2VydmVyUmVzcG9uc2UpIHtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uLCBYLU1vY2stRW5hYmxlZCcpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1NYXgtQWdlJywgJzg2NDAwJyk7XG59XG5cbi8vIFx1NTNEMVx1OTAwMUpTT05cdTU0Q0RcdTVFOTRcbmZ1bmN0aW9uIHNlbmRKc29uUmVzcG9uc2UocmVzOiBTZXJ2ZXJSZXNwb25zZSwgc3RhdHVzOiBudW1iZXIsIGRhdGE6IGFueSkge1xuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbi8vIFx1NUVGNlx1OEZERlx1NjI2N1x1ODg0Q1xuZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8vIFx1ODlFM1x1Njc5MFx1OEJGN1x1NkM0Mlx1NEY1M1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VSZXF1ZXN0Qm9keShyZXE6IEluY29taW5nTWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBib2R5ID0gJyc7XG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rKSA9PiB7XG4gICAgICBib2R5ICs9IGNodW5rLnRvU3RyaW5nKCk7XG4gICAgfSk7XG4gICAgcmVxLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlKGJvZHkgPyBKU09OLnBhcnNlKGJvZHkpIDoge30pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1NjU3MFx1NjM2RVx1NkU5MEFQSVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY3MERcdTUyQTFcdTVDNDJcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcdUZGMENcdTY1MkZcdTYzMDFcdTUyMDZcdTk4NzVcdTU0OENcdThGQzdcdTZFRTRcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmdldERhdGFTb3VyY2VzKHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQodXJsUXVlcnkucGFnZSBhcyBzdHJpbmcpIHx8IDEsXG4gICAgICAgIHNpemU6IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMCxcbiAgICAgICAgbmFtZTogdXJsUXVlcnkubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgIHR5cGU6IHVybFF1ZXJ5LnR5cGUgYXMgc3RyaW5nLFxuICAgICAgICBzdGF0dXM6IHVybFF1ZXJ5LnN0YXR1cyBhcyBzdHJpbmdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiByZXN1bHQuaXRlbXMsIFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGFzb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5nZXREYXRhU291cmNlKGlkKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IGRhdGFzb3VyY2UsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2UgXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgbmV3RGF0YVNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmNyZWF0ZURhdGFTb3VyY2UoYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDEsIHtcbiAgICAgICAgZGF0YTogbmV3RGF0YVNvdXJjZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBVVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YVNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLnVwZGF0ZURhdGFTb3VyY2UoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHVwZGF0ZWREYXRhU291cmNlLFxuICAgICAgICBtZXNzYWdlOiAnXHU2NTcwXHU2MzZFXHU2RTkwXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2RhdGFzb3VyY2VzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2REVMRVRFXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuZGVsZXRlRGF0YVNvdXJjZShpZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzL3Rlc3QtY29ubmVjdGlvbicgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL2RhdGFzb3VyY2VzL3Rlc3QtY29ubmVjdGlvbmApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UudGVzdENvbm5lY3Rpb24oYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NkQ0Qlx1OEJENVx1OEZERVx1NjNBNVx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY3RTVcdThCRTJBUElcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVF1ZXJpZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU2OEMwXHU2N0U1VVJMXHU2NjJGXHU1NDI2XHU1MzM5XHU5MTREXHU2N0U1XHU4QkUyQVBJXG4gIGNvbnN0IGlzUXVlcmllc1BhdGggPSB1cmxQYXRoLmluY2x1ZGVzKCcvcXVlcmllcycpO1xuICBcbiAgLy8gXHU2MjUzXHU1MzcwXHU2MjQwXHU2NzA5XHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczXHU4QkY3XHU2QzQyXHU0RUU1XHU0RkJGXHU4QzAzXHU4QkQ1XG4gIGlmIChpc1F1ZXJpZXNQYXRoKSB7XG4gICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTY4QzBcdTZENEJcdTUyMzBcdTY3RTVcdThCRTJBUElcdThCRjdcdTZDNDI6ICR7bWV0aG9kfSAke3VybFBhdGh9YCwgdXJsUXVlcnkpO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6IC9hcGkvcXVlcmllc2ApO1xuICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU1OTA0XHU3NDA2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU4QkY3XHU2QzQyLCBcdTUzQzJcdTY1NzA6JywgdXJsUXVlcnkpO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY3MERcdTUyQTFcdTVDNDJcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdUZGMENcdTY1MkZcdTYzMDFcdTUyMDZcdTk4NzVcdTU0OENcdThGQzdcdTZFRTRcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5nZXRRdWVyaWVzKHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQodXJsUXVlcnkucGFnZSBhcyBzdHJpbmcpIHx8IDEsXG4gICAgICAgIHNpemU6IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMCxcbiAgICAgICAgbmFtZTogdXJsUXVlcnkubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogdXJsUXVlcnkuZGF0YVNvdXJjZUlkIGFzIHN0cmluZyxcbiAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nLFxuICAgICAgICBxdWVyeVR5cGU6IHVybFF1ZXJ5LnF1ZXJ5VHlwZSBhcyBzdHJpbmcsXG4gICAgICAgIGlzRmF2b3JpdGU6IHVybFF1ZXJ5LmlzRmF2b3JpdGUgPT09ICd0cnVlJ1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU3RUQzXHU2NzlDOicsIHtcbiAgICAgICAgaXRlbXNDb3VudDogcmVzdWx0Lml0ZW1zLmxlbmd0aCxcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb25cbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1OEZENFx1NTZERVx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1NjU3MFx1NjM2RVx1NjgzQ1x1NUYwRjonLCB7IFxuICAgICAgICBkYXRhOiBgQXJyYXlbJHtyZXN1bHQuaXRlbXMubGVuZ3RofV1gLCBcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICAvLyBcdTY4QzBcdTY3RTVyZXN1bHQuaXRlbXNcdTY2MkZcdTU0MjZcdTUzMDVcdTU0MkJcdTY1NzBcdTYzNkVcdUZGMENcdTU5ODJcdTY3OUNcdTRFM0FcdTdBN0FcdTUyMTlcdTRFQ0VcdTVCRkNcdTUxNjVcdTc2ODRcdTZBMjFcdTU3NTdcdTRFMkRcdTgzQjdcdTUzRDZcbiAgICAgIGlmIChyZXN1bHQuaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gXHU0RjdGXHU3NTI4XHU1MkE4XHU2MDAxXHU1QkZDXHU1MTY1XHU2NUI5XHU1RjBGXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXHVGRjBDXHU5MDdGXHU1MTREXHU1RkFBXHU3M0FGXHU0RjlEXHU4RDU2XG4gICAgICAgICAgY29uc3QgbW9ja1F1ZXJ5RGF0YSA9IGF3YWl0IGltcG9ydCgnLi4vZGF0YS9xdWVyeScpO1xuICAgICAgICAgIGNvbnN0IG1vY2tRdWVyaWVzID0gbW9ja1F1ZXJ5RGF0YS5tb2NrUXVlcmllcyB8fCBbXTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAobW9ja1F1ZXJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTRFM0FcdTdBN0FcdUZGMENcdTRGN0ZcdTc1MjhcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkU6JywgbW9ja1F1ZXJpZXMubGVuZ3RoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxO1xuICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMDtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgICAgICAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIG1vY2tRdWVyaWVzLmxlbmd0aCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gbW9ja1F1ZXJpZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgICAgICAgICBjb25zdCBwYWdpbmF0aW9uID0ge1xuICAgICAgICAgICAgICB0b3RhbDogbW9ja1F1ZXJpZXMubGVuZ3RoLFxuICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICBzaXplLFxuICAgICAgICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwobW9ja1F1ZXJpZXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgICAgICAgZGF0YTogcGFnaW5hdGVkSXRlbXMsXG4gICAgICAgICAgICAgIHBhZ2luYXRpb24sXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrXSBcdTVCRkNcdTUxNjVcdTY3RTVcdThCRTJcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0Lml0ZW1zLFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrXSBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDUwMCwge1xuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJ5KGlkKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcXVlcnksXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2N0U1XHU4QkUyXHU0RTBEXHU1QjU4XHU1NzI4JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9xdWVyaWVzYCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCBuZXdRdWVyeSA9IGF3YWl0IHF1ZXJ5U2VydmljZS5jcmVhdGVRdWVyeShib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMSwge1xuICAgICAgICBkYXRhOiBuZXdRdWVyeSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UFVUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHVwZGF0ZWRRdWVyeSA9IGF3YWl0IHF1ZXJ5U2VydmljZS51cGRhdGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogdXBkYXRlZFF1ZXJ5LFxuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvZXhlY3V0ZSQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdOyAvLyBcdTYzRDBcdTUzRDZJRDogL2FwaS9xdWVyaWVzL3tpZH0vZXhlY3V0ZVxuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmV4ZWN1dGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC92ZXJzaW9ucyQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IHF1ZXJ5SWQgPSB1cmxQYXRoLnNwbGl0KCcvJylbM107IC8vIFx1NjNEMFx1NTNENlx1NjdFNVx1OEJFMklEOiAvYXBpL3F1ZXJpZXMve2lkfS92ZXJzaW9uc1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIFx1NjdFNVx1OEJFMklEOiAke3F1ZXJ5SWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UuY3JlYXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RidcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTUyMTdcdTg4NjhcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL3ZlcnNpb25zJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBxdWVyeUlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdOyAvLyBcdTYzRDBcdTUzRDZcdTY3RTVcdThCRTJJRDogL2FwaS9xdWVyaWVzL3tpZH0vdmVyc2lvbnNcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIFx1NjdFNVx1OEJFMklEOiAke3F1ZXJ5SWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHZlcnNpb25zID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJ5VmVyc2lvbnMocXVlcnlJZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogdmVyc2lvbnMsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1OTZDNlx1NjIxMEFQSVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSW50ZWdyYXRpb25BcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU2NjJGXHU5NkM2XHU2MjEwQVBJXHU4REVGXHU1Rjg0IC0gXHU5NzAwXHU4OTgxXHU5MDdGXHU1MTREXHU0RTBFXHU2NUU3XHU3Njg0XHU2MkU2XHU2MjJBXHU1NjY4XHU1MUIyXHU3QTgxXHU3Njg0XHU4REVGXHU1Rjg0XG4gIGlmICh1cmxQYXRoLmluY2x1ZGVzKCcvYXBpL2xvdy1jb2RlL2FwaXMnKSkge1xuICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU2OEMwXHU2RDRCXHU1MjMwXHU5NkM2XHU2MjEwQVBJXHU4QkY3XHU2QzQyLCBcdTc1MzFcdTY1RTdcdTYyRTZcdTYyMkFcdTU2NjhcdTU5MDRcdTc0MDY6JywgbWV0aG9kLCB1cmxQYXRoKTtcbiAgICAvLyBcdTc2RjRcdTYzQTVcdThGRDRcdTU2REV0cnVlXHVGRjBDXHU4ODY4XHU3OTNBXHU2QjY0XHU4QkY3XHU2QzQyXHU1REYyXHU4OEFCXHU1OTA0XHU3NDA2XHVGRjA4XHU1QjlFXHU5NjQ1XHU0RTBBXHU2NjJGXHU0RUE0XHU3RUQ5XHU2NUU3XHU2MkU2XHU2MjJBXHU1NjY4XHU1OTA0XHU3NDA2XHVGRjA5XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XG4gKiBAcmV0dXJucyBWaXRlXHU0RTJEXHU5NUY0XHU0RUY2XHU1MUZEXHU2NTcwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrTWlkZGxld2FyZSgpOiBDb25uZWN0Lk5leHRIYW5kbGVGdW5jdGlvbiB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBtb2NrTWlkZGxld2FyZShyZXE6IENvbm5lY3QuSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCBuZXh0OiBDb25uZWN0Lk5leHRGdW5jdGlvbikge1xuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjcyQVx1NTQyRlx1NzUyOE1vY2tcdTYyMTZcdThCRjdcdTZDNDJcdTRFMERcdTkwMDJcdTU0MDhNb2NrXHVGRjBDXHU3NkY0XHU2M0E1XHU0RjIwXHU5MDEyXHU3RUQ5XHU0RTBCXHU0RTAwXHU0RTJBXHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgaWYgKCFzaG91bGRNb2NrUmVxdWVzdChyZXEpKSB7XG4gICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCB1cmwgPSBwYXJzZShyZXEudXJsIHx8ICcnLCB0cnVlKTtcbiAgICBjb25zdCB1cmxQYXRoID0gdXJsLnBhdGhuYW1lIHx8ICcnO1xuICAgIGNvbnN0IHVybFF1ZXJ5ID0gdXJsLnF1ZXJ5IHx8IHt9O1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NjUzNlx1NTIzMFx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3VybFBhdGh9YCk7XG4gICAgXG4gICAgLy8gXHU1OTA0XHU3NDA2T1BUSU9OU1x1OEJGN1x1NkM0MlxuICAgIGlmIChyZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpID09PSAnT1BUSU9OUycpIHtcbiAgICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjA0O1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTRFM0FcdTYyNDBcdTY3MDlcdTU0Q0RcdTVFOTRcdTZERkJcdTUyQTBDT1JTXHU1OTM0XG4gICAgaGFuZGxlQ29ycyhyZXMpO1xuICAgIFxuICAgIC8vIFx1NkEyMVx1NjJERlx1N0Y1MVx1N0VEQ1x1NUVGNlx1OEZERlxuICAgIGlmIChtb2NrQ29uZmlnLmRlbGF5ID4gMCkge1xuICAgICAgYXdhaXQgZGVsYXkobW9ja0NvbmZpZy5kZWxheSk7XG4gICAgfVxuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTYzMDlBUElcdTdDN0JcdTU3OEJcdTUyMDZcdTUzRDFcdTU5MDRcdTc0MDZcbiAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XG4gICAgICBcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NjYyRlx1OTZDNlx1NjIxMEFQSSAtIFx1NEYxOFx1NTE0OFx1NTkwNFx1NzQwNlx1NEVFNVx1OTA3Rlx1NTE0RFx1NTFCMlx1N0E4MVxuICAgICAgaWYgKHVybFBhdGguaW5jbHVkZXMoJy9sb3ctY29kZS9hcGlzJykpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY4QzBcdTZENEJcdTUyMzBcdTk2QzZcdTYyMTBBUElcdThCRjdcdTZDNDI6JywgcmVxLm1ldGhvZCwgdXJsUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgICBoYW5kbGVkID0gYXdhaXQgaGFuZGxlSW50ZWdyYXRpb25BcGkocmVxLCByZXMsIHVybFBhdGgsIHVybFF1ZXJ5KTtcbiAgICAgICAgaWYgKGhhbmRsZWQpIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU2NjJGXHU2NTcwXHU2MzZFXHU2RTkwQVBJXG4gICAgICBpZiAodXJsUGF0aC5pbmNsdWRlcygnL2RhdGFzb3VyY2VzJykpIHtcbiAgICAgICAgaGFuZGxlZCA9IGF3YWl0IGhhbmRsZURhdGFzb3VyY2VzQXBpKHJlcSwgcmVzLCB1cmxQYXRoLCB1cmxRdWVyeSk7XG4gICAgICAgIGlmIChoYW5kbGVkKSByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NjYyRlx1NjdFNVx1OEJFMkFQSVxuICAgICAgaWYgKHVybFBhdGguaW5jbHVkZXMoJy9xdWVyaWVzJykpIHtcbiAgICAgICAgaGFuZGxlZCA9IGF3YWl0IGhhbmRsZVF1ZXJpZXNBcGkocmVxLCByZXMsIHVybFBhdGgsIHVybFF1ZXJ5KTtcbiAgICAgICAgaWYgKGhhbmRsZWQpIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2Q0ExXHU2NzA5XHU4OEFCXHU1OTA0XHU3NDA2XHVGRjBDXHU1MjE5XHU4RkQ0XHU1NkRFNDA0XG4gICAgICBpZiAoIWhhbmRsZWQpIHtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICAgIGVycm9yOiAnXHU2NzJBXHU2MjdFXHU1MjMwXHU4QkY3XHU2QzQyXHU3Njg0QVBJJyxcbiAgICAgICAgICBtZXNzYWdlOiBgXHU2NzJBXHU2MjdFXHU1MjMwXHU4REVGXHU1Rjg0OiAke3VybFBhdGh9YCxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gXHU1OTA0XHU3NDA2XHU2MjQwXHU2NzA5XHU2NzJBXHU2MzU1XHU4M0I3XHU3Njg0XHU5NTE5XHU4QkVGXG4gICAgICBjb25zb2xlLmVycm9yKCdbTW9ja10gXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU2NUY2XHU1M0QxXHU3NTFGXHU5NTE5XHU4QkVGOicsIGVycm9yKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY3MERcdTUyQTFcdTU2NjhcdTk1MTlcdThCRUYnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZU1vY2tNaWRkbGV3YXJlOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9ja1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XG4gKiBcbiAqIFx1NjNBN1x1NTIzNk1vY2tcdTY3MERcdTUyQTFcdTc2ODRcdTU0MkZcdTc1MjgvXHU3OTgxXHU3NTI4XHU3MkI2XHU2MDAxXHUzMDAxXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCXHU3QjQ5XG4gKi9cblxuLy8gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU2MjE2XHU1MTY4XHU1QzQwXHU4QkJFXHU3RjZFXHU0RTJEXHU4M0I3XHU1M0Q2XHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuZXhwb3J0IGZ1bmN0aW9uIGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgdHJ5IHtcbiAgICAvLyBcdTU3MjhOb2RlLmpzXHU3M0FGXHU1ODgzXHU0RTJEXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudikge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODNcdTRFMkRcbiAgICBpZiAodHlwZW9mIGltcG9ydC5tZXRhICE9PSAndW5kZWZpbmVkJyAmJiBpbXBvcnQubWV0YS5lbnYpIHtcbiAgICAgIGlmIChpbXBvcnQubWV0YS5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChpbXBvcnQubWV0YS5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTY4QzBcdTY3RTVsb2NhbFN0b3JhZ2UgKFx1NEVDNVx1NTcyOFx1NkQ0Rlx1ODlDOFx1NTY2OFx1NzNBRlx1NTg4MylcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgY29uc3QgbG9jYWxTdG9yYWdlVmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnVVNFX01PQ0tfQVBJJyk7XG4gICAgICBpZiAobG9jYWxTdG9yYWdlVmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChsb2NhbFN0b3JhZ2VWYWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OUVEOFx1OEJBNFx1NjBDNVx1NTFCNVx1RkYxQVx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NEUwQlx1NTQyRlx1NzUyOFx1RkYwQ1x1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1Nzk4MVx1NzUyOFxuICAgIGNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBcbiAgICAgICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHx8XG4gICAgICAodHlwZW9mIGltcG9ydC5tZXRhICE9PSAndW5kZWZpbmVkJyAmJiBpbXBvcnQubWV0YS5lbnYgJiYgaW1wb3J0Lm1ldGEuZW52LkRFViA9PT0gdHJ1ZSk7XG4gICAgXG4gICAgcmV0dXJuIGlzRGV2ZWxvcG1lbnQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gXHU1MUZBXHU5NTE5XHU2NUY2XHU3Njg0XHU1Qjg5XHU1MTY4XHU1NkRFXHU5MDAwXG4gICAgY29uc29sZS53YXJuKCdbTW9ja10gXHU2OEMwXHU2N0U1XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU1MUZBXHU5NTE5XHVGRjBDXHU5RUQ4XHU4QkE0XHU3OTgxXHU3NTI4TW9ja1x1NjcwRFx1NTJBMScsIGVycm9yKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gXHU1NDExXHU1NDBFXHU1MTdDXHU1QkI5XHU2NUU3XHU0RUUzXHU3ODAxXHU3Njg0XHU1MUZEXHU2NTcwXG5leHBvcnQgZnVuY3Rpb24gaXNNb2NrRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzRW5hYmxlZCgpO1xufVxuXG4vLyBNb2NrXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXG5leHBvcnQgY29uc3QgbW9ja0NvbmZpZyA9IHtcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICBlbmFibGVkOiBpc0VuYWJsZWQoKSxcbiAgXG4gIC8vIFx1OEJGN1x1NkM0Mlx1NUVGNlx1OEZERlx1RkYwOFx1NkJFQlx1NzlEMlx1RkYwOVxuICBkZWxheTogMzAwLFxuICBcbiAgLy8gQVBJXHU1N0ZBXHU3ODQwXHU4REVGXHU1Rjg0XHVGRjBDXHU3NTI4XHU0RThFXHU1MjI0XHU2NUFEXHU2NjJGXHU1NDI2XHU5NzAwXHU4OTgxXHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIGFwaUJhc2VQYXRoOiAnL2FwaScsXG4gIFxuICAvLyBcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkI6ICdub25lJywgJ2Vycm9yJywgJ2luZm8nLCAnZGVidWcnXG4gIGxvZ0xldmVsOiAnZGVidWcnLFxuICBcbiAgLy8gXHU1NDJGXHU3NTI4XHU3Njg0XHU2QTIxXHU1NzU3XG4gIG1vZHVsZXM6IHtcbiAgICBkYXRhc291cmNlczogdHJ1ZSxcbiAgICBxdWVyaWVzOiB0cnVlLFxuICAgIHVzZXJzOiB0cnVlLFxuICAgIHZpc3VhbGl6YXRpb25zOiB0cnVlXG4gIH1cbn07XG5cbi8vIFx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE1vY2tSZXF1ZXN0KHJlcTogYW55KTogYm9vbGVhbiB7XG4gIC8vIFx1NUZDNVx1OTg3Qlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgaWYgKCFtb2NrQ29uZmlnLmVuYWJsZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlVSTFx1RkYwQ1x1Nzg2RVx1NEZERHVybFx1NjYyRlx1NUI1N1x1N0IyNlx1NEUzMlxuICBjb25zdCB1cmwgPSByZXE/LnVybCB8fCAnJztcbiAgaWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB7XG4gICAgY29uc29sZS5lcnJvcignW01vY2tdIFx1NjUzNlx1NTIzMFx1OTc1RVx1NUI1N1x1N0IyNlx1NEUzMlVSTDonLCB1cmwpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU1RkM1XHU5ODdCXHU2NjJGQVBJXHU4QkY3XHU2QzQyXG4gIGlmICghdXJsLnN0YXJ0c1dpdGgobW9ja0NvbmZpZy5hcGlCYXNlUGF0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFx1OERFRlx1NUY4NFx1NjhDMFx1NjdFNVx1OTAxQVx1OEZDN1x1RkYwQ1x1NUU5NFx1OEJFNVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gXHU4QkIwXHU1RjU1XHU2NUU1XHU1RkQ3XG5leHBvcnQgZnVuY3Rpb24gbG9nTW9jayhsZXZlbDogJ2Vycm9yJyB8ICdpbmZvJyB8ICdkZWJ1ZycsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gIGNvbnN0IHsgbG9nTGV2ZWwgfSA9IG1vY2tDb25maWc7XG4gIFxuICBpZiAobG9nTGV2ZWwgPT09ICdub25lJykgcmV0dXJuO1xuICBcbiAgaWYgKGxldmVsID09PSAnZXJyb3InICYmIFsnZXJyb3InLCAnaW5mbycsICdkZWJ1ZyddLmluY2x1ZGVzKGxvZ0xldmVsKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrIEVSUk9SXScsIC4uLmFyZ3MpO1xuICB9IGVsc2UgaWYgKGxldmVsID09PSAnaW5mbycgJiYgWydpbmZvJywgJ2RlYnVnJ10uaW5jbHVkZXMobG9nTGV2ZWwpKSB7XG4gICAgY29uc29sZS5pbmZvKCdbTW9jayBJTkZPXScsIC4uLmFyZ3MpO1xuICB9IGVsc2UgaWYgKGxldmVsID09PSAnZGVidWcnICYmIGxvZ0xldmVsID09PSAnZGVidWcnKSB7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrIERFQlVHXScsIC4uLmFyZ3MpO1xuICB9XG59XG5cbi8vIFx1NTIxRFx1NTlDQlx1NTMxNlx1NjVGNlx1OEY5M1x1NTFGQU1vY2tcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDFcbnRyeSB7XG4gIGNvbnNvbGUubG9nKGBbTW9ja10gXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxOiAke21vY2tDb25maWcuZW5hYmxlZCA/ICdcdTVERjJcdTU0MkZcdTc1MjgnIDogJ1x1NURGMlx1Nzk4MVx1NzUyOCd9YCk7XG4gIGlmIChtb2NrQ29uZmlnLmVuYWJsZWQpIHtcbiAgICBjb25zb2xlLmxvZyhgW01vY2tdIFx1OTE0RFx1N0Y2RTpgLCB7XG4gICAgICBkZWxheTogbW9ja0NvbmZpZy5kZWxheSxcbiAgICAgIGFwaUJhc2VQYXRoOiBtb2NrQ29uZmlnLmFwaUJhc2VQYXRoLFxuICAgICAgbG9nTGV2ZWw6IG1vY2tDb25maWcubG9nTGV2ZWwsXG4gICAgICBlbmFibGVkTW9kdWxlczogT2JqZWN0LmVudHJpZXMobW9ja0NvbmZpZy5tb2R1bGVzKVxuICAgICAgICAuZmlsdGVyKChbXywgZW5hYmxlZF0pID0+IGVuYWJsZWQpXG4gICAgICAgIC5tYXAoKFtuYW1lXSkgPT4gbmFtZSlcbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgY29uc29sZS53YXJuKCdbTW9ja10gXHU4RjkzXHU1MUZBXHU5MTREXHU3RjZFXHU0RkUxXHU2MDZGXHU1MUZBXHU5NTE5JywgZXJyb3IpO1xufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50c1wiOy8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjU3MFx1NjM2RVx1NkU5MFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1RkYwQ1x1NzUyOFx1NEU4RVx1NUYwMFx1NTNEMVx1NTQ4Q1x1NkQ0Qlx1OEJENVxuICovXG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1N0M3Qlx1NTc4QlxuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZVR5cGUgPSAnbXlzcWwnIHwgJ3Bvc3RncmVzcWwnIHwgJ29yYWNsZScgfCAnc3Fsc2VydmVyJyB8ICdzcWxpdGUnO1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTcyQjZcdTYwMDFcbmV4cG9ydCB0eXBlIERhdGFTb3VyY2VTdGF0dXMgPSAnYWN0aXZlJyB8ICdpbmFjdGl2ZScgfCAnZXJyb3InIHwgJ3BlbmRpbmcnO1xuXG4vLyBcdTU0MENcdTZCNjVcdTk4OTFcdTczODdcbmV4cG9ydCB0eXBlIFN5bmNGcmVxdWVuY3kgPSAnbWFudWFsJyB8ICdob3VybHknIHwgJ2RhaWx5JyB8ICd3ZWVrbHknIHwgJ21vbnRobHknO1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTYzQTVcdTUzRTNcbmV4cG9ydCBpbnRlcmZhY2UgRGF0YVNvdXJjZSB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHR5cGU6IERhdGFTb3VyY2VUeXBlO1xuICBob3N0Pzogc3RyaW5nO1xuICBwb3J0PzogbnVtYmVyO1xuICBkYXRhYmFzZU5hbWU/OiBzdHJpbmc7XG4gIHVzZXJuYW1lPzogc3RyaW5nO1xuICBwYXNzd29yZD86IHN0cmluZztcbiAgc3RhdHVzOiBEYXRhU291cmNlU3RhdHVzO1xuICBzeW5jRnJlcXVlbmN5PzogU3luY0ZyZXF1ZW5jeTtcbiAgbGFzdFN5bmNUaW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgY3JlYXRlZEF0OiBzdHJpbmc7XG4gIHVwZGF0ZWRBdDogc3RyaW5nO1xuICBpc0FjdGl2ZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuZXhwb3J0IGNvbnN0IG1vY2tEYXRhU291cmNlczogRGF0YVNvdXJjZVtdID0gW1xuICB7XG4gICAgaWQ6ICdkcy0xJyxcbiAgICBuYW1lOiAnTXlTUUxcdTc5M0FcdTRGOEJcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU3OTNBXHU0RjhCTXlTUUxcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdteXNxbCcsXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgcG9ydDogMzMwNixcbiAgICBkYXRhYmFzZU5hbWU6ICdleGFtcGxlX2RiJyxcbiAgICB1c2VybmFtZTogJ3VzZXInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0yJyxcbiAgICBuYW1lOiAnUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAncG9zdGdyZXNxbCcsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xMDAnLFxuICAgIHBvcnQ6IDU0MzIsXG4gICAgZGF0YWJhc2VOYW1lOiAncHJvZHVjdGlvbl9kYicsXG4gICAgdXNlcm5hbWU6ICdhZG1pbicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnaG91cmx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzNjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDc3NzYwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTMnLFxuICAgIG5hbWU6ICdTUUxpdGVcdTY3MkNcdTU3MzBcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU2NzJDXHU1NzMwU1FMaXRlXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnc3FsaXRlJyxcbiAgICBkYXRhYmFzZU5hbWU6ICcvcGF0aC90by9sb2NhbC5kYicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnbWFudWFsJyxcbiAgICBsYXN0U3luY1RpbWU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzNDU2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtNCcsXG4gICAgbmFtZTogJ1NRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwU1FMIFNlcnZlclx1NkQ0Qlx1OEJENVx1NzNBRlx1NTg4MycsXG4gICAgdHlwZTogJ3NxbHNlcnZlcicsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4yMDAnLFxuICAgIHBvcnQ6IDE0MzMsXG4gICAgZGF0YWJhc2VOYW1lOiAndGVzdF9kYicsXG4gICAgdXNlcm5hbWU6ICd0ZXN0ZXInLFxuICAgIHN0YXR1czogJ2luYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnd2Vla2x5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA2MDQ4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNTE4NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiBmYWxzZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy01JyxcbiAgICBuYW1lOiAnT3JhY2xlXHU0RjAxXHU0RTFBXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzME9yYWNsZVx1NEYwMVx1NEUxQVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ29yYWNsZScsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xNTAnLFxuICAgIHBvcnQ6IDE1MjEsXG4gICAgZGF0YWJhc2VOYW1lOiAnZW50ZXJwcmlzZV9kYicsXG4gICAgdXNlcm5hbWU6ICdzeXN0ZW0nLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTAzNjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9XG5dO1xuXG4vKipcbiAqIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGNvdW50IFx1NzUxRlx1NjIxMFx1NjU3MFx1OTFDRlxuICogQHJldHVybnMgXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU3RUM0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1vY2tEYXRhU291cmNlcyhjb3VudDogbnVtYmVyID0gNSk6IERhdGFTb3VyY2VbXSB7XG4gIGNvbnN0IHR5cGVzOiBEYXRhU291cmNlVHlwZVtdID0gWydteXNxbCcsICdwb3N0Z3Jlc3FsJywgJ29yYWNsZScsICdzcWxzZXJ2ZXInLCAnc3FsaXRlJ107XG4gIGNvbnN0IHN0YXR1c2VzOiBEYXRhU291cmNlU3RhdHVzW10gPSBbJ2FjdGl2ZScsICdpbmFjdGl2ZScsICdlcnJvcicsICdwZW5kaW5nJ107XG4gIGNvbnN0IHN5bmNGcmVxczogU3luY0ZyZXF1ZW5jeVtdID0gWydtYW51YWwnLCAnaG91cmx5JywgJ2RhaWx5JywgJ3dlZWtseScsICdtb250aGx5J107XG4gIFxuICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogY291bnQgfSwgKF8sIGkpID0+IHtcbiAgICBjb25zdCB0eXBlID0gdHlwZXNbaSAlIHR5cGVzLmxlbmd0aF07XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBkcy1nZW4tJHtpICsgMX1gLFxuICAgICAgbmFtZTogYFx1NzUxRlx1NjIxMFx1NzY4NCR7dHlwZX1cdTY1NzBcdTYzNkVcdTZFOTAgJHtpICsgMX1gLFxuICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTc2ODQke3R5cGV9XHU3QzdCXHU1NzhCXHU2NTcwXHU2MzZFXHU2RTkwICR7aSArIDF9YCxcbiAgICAgIHR5cGUsXG4gICAgICBob3N0OiB0eXBlICE9PSAnc3FsaXRlJyA/ICdsb2NhbGhvc3QnIDogdW5kZWZpbmVkLFxuICAgICAgcG9ydDogdHlwZSAhPT0gJ3NxbGl0ZScgPyAoMzMwNiArIGkpIDogdW5kZWZpbmVkLFxuICAgICAgZGF0YWJhc2VOYW1lOiB0eXBlID09PSAnc3FsaXRlJyA/IGAvcGF0aC90by9kYl8ke2l9LmRiYCA6IGBleGFtcGxlX2RiXyR7aX1gLFxuICAgICAgdXNlcm5hbWU6IHR5cGUgIT09ICdzcWxpdGUnID8gYHVzZXJfJHtpfWAgOiB1bmRlZmluZWQsXG4gICAgICBzdGF0dXM6IHN0YXR1c2VzW2kgJSBzdGF0dXNlcy5sZW5ndGhdLFxuICAgICAgc3luY0ZyZXF1ZW5jeTogc3luY0ZyZXFzW2kgJSBzeW5jRnJlcXMubGVuZ3RoXSxcbiAgICAgIGxhc3RTeW5jVGltZTogaSAlIDMgPT09IDAgPyBudWxsIDogbmV3IERhdGUobm93IC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShub3cgLSAoaSArIDEwKSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShub3cgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBpc0FjdGl2ZTogaSAlIDQgIT09IDBcbiAgICB9O1xuICB9KTtcbn1cblxuLy8gXHU1QkZDXHU1MUZBXHU5RUQ4XHU4QkE0XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG5leHBvcnQgZGVmYXVsdCBtb2NrRGF0YVNvdXJjZXM7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50c1wiOy8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwTW9ja1x1NjcwRFx1NTJBMVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY1NzBcdTYzNkVcdTZFOTBcdTc2RjhcdTUxNzNBUElcdTc2ODRcdTZBMjFcdTYyREZcdTVCOUVcdTczQjBcbiAqL1xuXG5pbXBvcnQgeyBtb2NrRGF0YVNvdXJjZXMgfSBmcm9tICcuLi9kYXRhL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlIH0gZnJvbSAnLi4vZGF0YS9kYXRhc291cmNlJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuXG4vLyBcdTRFMzRcdTY1RjZcdTVCNThcdTUwQThcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdUZGMENcdTUxNDFcdThCQjhcdTZBMjFcdTYyREZcdTU4OUVcdTUyMjBcdTY1MzlcdTY0Q0RcdTRGNUNcbmxldCBkYXRhU291cmNlcyA9IFsuLi5tb2NrRGF0YVNvdXJjZXNdO1xuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZURlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkZWxheSA9IHR5cGVvZiBtb2NrQ29uZmlnLmRlbGF5ID09PSAnbnVtYmVyJyA/IG1vY2tDb25maWcuZGVsYXkgOiAzMDA7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbn1cblxuLyoqXG4gKiBcdTkxQ0RcdTdGNkVcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTYzNkVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0RGF0YVNvdXJjZXMoKTogdm9pZCB7XG4gIGRhdGFTb3VyY2VzID0gWy4uLm1vY2tEYXRhU291cmNlc107XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKiBAcGFyYW0gcGFyYW1zIFx1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MFxuICogQHJldHVybnMgXHU1MjA2XHU5ODc1XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYXRhU291cmNlcyhwYXJhbXM/OiB7XG4gIHBhZ2U/OiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHR5cGU/OiBzdHJpbmc7XG4gIHN0YXR1cz86IHN0cmluZztcbn0pOiBQcm9taXNlPHtcbiAgaXRlbXM6IERhdGFTb3VyY2VbXTtcbiAgcGFnaW5hdGlvbjoge1xuICAgIHRvdGFsOiBudW1iZXI7XG4gICAgcGFnZTogbnVtYmVyO1xuICAgIHNpemU6IG51bWJlcjtcbiAgICB0b3RhbFBhZ2VzOiBudW1iZXI7XG4gIH07XG59PiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gIFxuICAvLyBcdTVFOTRcdTc1MjhcdThGQzdcdTZFRTRcbiAgbGV0IGZpbHRlcmVkSXRlbXMgPSBbLi4uZGF0YVNvdXJjZXNdO1xuICBcbiAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/Lm5hbWUpIHtcbiAgICBjb25zdCBrZXl3b3JkID0gcGFyYW1zLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gXG4gICAgICBkcy5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAoZHMuZGVzY3JpcHRpb24gJiYgZHMuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICApO1xuICB9XG4gIFxuICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8udHlwZSkge1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBkcy50eXBlID09PSBwYXJhbXMudHlwZSk7XG4gIH1cbiAgXG4gIC8vIFx1NjMwOVx1NzJCNlx1NjAwMVx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gZHMuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgfVxuICBcbiAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmlsdGVyZWRJdGVtcy5sZW5ndGgpO1xuICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gIFxuICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgcmV0dXJuIHtcbiAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdG90YWw6IGZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgcGFnZSxcbiAgICAgIHNpemUsXG4gICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmlsdGVyZWRJdGVtcy5sZW5ndGggLyBzaXplKVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICogQHJldHVybnMgXHU2NTcwXHU2MzZFXHU2RTkwXHU4QkU2XHU2MEM1XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYXRhU291cmNlKGlkOiBzdHJpbmcpOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjdFNVx1NjI3RVx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCBkYXRhU291cmNlID0gZGF0YVNvdXJjZXMuZmluZChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKCFkYXRhU291cmNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIHJldHVybiBkYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGRhdGEgXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU2MzZFXG4gKiBAcmV0dXJucyBcdTUyMUJcdTVFRkFcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZURhdGFTb3VyY2UoZGF0YTogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwSURcbiAgY29uc3QgbmV3SWQgPSBgZHMtJHtEYXRlLm5vdygpfWA7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgbmV3RGF0YVNvdXJjZTogRGF0YVNvdXJjZSA9IHtcbiAgICBpZDogbmV3SWQsXG4gICAgbmFtZTogZGF0YS5uYW1lIHx8ICdOZXcgRGF0YSBTb3VyY2UnLFxuICAgIGRlc2NyaXB0aW9uOiBkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgIHR5cGU6IGRhdGEudHlwZSB8fCAnbXlzcWwnLFxuICAgIGhvc3Q6IGRhdGEuaG9zdCxcbiAgICBwb3J0OiBkYXRhLnBvcnQsXG4gICAgZGF0YWJhc2VOYW1lOiBkYXRhLmRhdGFiYXNlTmFtZSxcbiAgICB1c2VybmFtZTogZGF0YS51c2VybmFtZSxcbiAgICBzdGF0dXM6IGRhdGEuc3RhdHVzIHx8ICdwZW5kaW5nJyxcbiAgICBzeW5jRnJlcXVlbmN5OiBkYXRhLnN5bmNGcmVxdWVuY3kgfHwgJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH07XG4gIFxuICAvLyBcdTZERkJcdTUyQTBcdTUyMzBcdTUyMTdcdTg4NjhcbiAgZGF0YVNvdXJjZXMucHVzaChuZXdEYXRhU291cmNlKTtcbiAgXG4gIHJldHVybiBuZXdEYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKiBAcGFyYW0gZGF0YSBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcbiAqIEByZXR1cm5zIFx1NjZGNFx1NjVCMFx1NTQwRVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlRGF0YVNvdXJjZShpZDogc3RyaW5nLCBkYXRhOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTYyN0VcdTUyMzBcdTg5ODFcdTY2RjRcdTY1QjBcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcdTdEMjJcdTVGMTVcbiAgY29uc3QgaW5kZXggPSBkYXRhU291cmNlcy5maW5kSW5kZXgoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IHVwZGF0ZWREYXRhU291cmNlOiBEYXRhU291cmNlID0ge1xuICAgIC4uLmRhdGFTb3VyY2VzW2luZGV4XSxcbiAgICAuLi5kYXRhLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gIH07XG4gIFxuICAvLyBcdTY2RkZcdTYzNjJcdTY1NzBcdTYzNkVcdTZFOTBcbiAgZGF0YVNvdXJjZXNbaW5kZXhdID0gdXBkYXRlZERhdGFTb3VyY2U7XG4gIFxuICByZXR1cm4gdXBkYXRlZERhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZURhdGFTb3VyY2UoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2MjdFXHU1MjMwXHU4OTgxXHU1MjIwXHU5NjY0XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXHU3RDIyXHU1RjE1XG4gIGNvbnN0IGluZGV4ID0gZGF0YVNvdXJjZXMuZmluZEluZGV4KGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBkYXRhU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIFx1NkQ0Qlx1OEJENVx1NjU3MFx1NjM2RVx1NkU5MFx1OEZERVx1NjNBNVxuICogQHBhcmFtIHBhcmFtcyBcdThGREVcdTYzQTVcdTUzQzJcdTY1NzBcbiAqIEByZXR1cm5zIFx1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1N0VEM1x1Njc5Q1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdENvbm5lY3Rpb24ocGFyYW1zOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTx7XG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIG1lc3NhZ2U/OiBzdHJpbmc7XG4gIGRldGFpbHM/OiBhbnk7XG59PiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTVCOUVcdTk2NDVcdTRGN0ZcdTc1MjhcdTY1RjZcdTUzRUZcdTgwRkRcdTRGMUFcdTY3MDlcdTY2RjRcdTU5MERcdTY3NDJcdTc2ODRcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTkwM0JcdThGOTFcbiAgLy8gXHU4RkQ5XHU5MUNDXHU3QjgwXHU1MzU1XHU2QTIxXHU2MkRGXHU2MjEwXHU1MjlGL1x1NTkzMVx1OEQyNVxuICBjb25zdCBzdWNjZXNzID0gTWF0aC5yYW5kb20oKSA+IDAuMjsgLy8gODAlXHU2MjEwXHU1MjlGXHU3Mzg3XG4gIFxuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3MsXG4gICAgbWVzc2FnZTogc3VjY2VzcyA/ICdcdThGREVcdTYzQTVcdTYyMTBcdTUyOUYnIDogJ1x1OEZERVx1NjNBNVx1NTkzMVx1OEQyNTogXHU2NUUwXHU2Q0Q1XHU4RkRFXHU2M0E1XHU1MjMwXHU2NTcwXHU2MzZFXHU1RTkzXHU2NzBEXHU1MkExXHU1NjY4JyxcbiAgICBkZXRhaWxzOiBzdWNjZXNzID8ge1xuICAgICAgcmVzcG9uc2VUaW1lOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCkgKyAxMCxcbiAgICAgIHZlcnNpb246ICc4LjAuMjgnLFxuICAgICAgY29ubmVjdGlvbklkOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkgKyAxMDAwXG4gICAgfSA6IHtcbiAgICAgIGVycm9yQ29kZTogJ0NPTk5FQ1RJT05fUkVGVVNFRCcsXG4gICAgICBlcnJvckRldGFpbHM6ICdcdTY1RTBcdTZDRDVcdTVFRkFcdTdBQ0JcdTUyMzBcdTY3MERcdTUyQTFcdTU2NjhcdTc2ODRcdThGREVcdTYzQTVcdUZGMENcdThCRjdcdTY4QzBcdTY3RTVcdTdGNTFcdTdFRENcdThCQkVcdTdGNkVcdTU0OENcdTUxRURcdTYzNkUnXG4gICAgfVxuICB9O1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTY3MERcdTUyQTFcbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0RGF0YVNvdXJjZXMsXG4gIGdldERhdGFTb3VyY2UsXG4gIGNyZWF0ZURhdGFTb3VyY2UsXG4gIHVwZGF0ZURhdGFTb3VyY2UsXG4gIGRlbGV0ZURhdGFTb3VyY2UsXG4gIHRlc3RDb25uZWN0aW9uLFxuICByZXNldERhdGFTb3VyY2VzXG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy91dGlscy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTAxQVx1NzUyOFx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTUyMUJcdTVFRkFcdTdFREZcdTRFMDBcdTY4M0NcdTVGMEZcdTU0Q0RcdTVFOTRcdTc2ODRcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbiAqL1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NkEyMVx1NjJERkFQSVx1NjIxMFx1NTI5Rlx1NTRDRFx1NUU5NFxuICogQHBhcmFtIGRhdGEgXHU1NENEXHU1RTk0XHU2NTcwXHU2MzZFXG4gKiBAcGFyYW0gc3VjY2VzcyBcdTYyMTBcdTUyOUZcdTcyQjZcdTYwMDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0F0cnVlXG4gKiBAcGFyYW0gbWVzc2FnZSBcdTUzRUZcdTkwMDlcdTZEODhcdTYwNkZcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NjgzQ1x1NUYwRlx1NzY4NEFQSVx1NTRDRFx1NUU5NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja1Jlc3BvbnNlPFQ+KFxuICBkYXRhOiBULCBcbiAgc3VjY2VzczogYm9vbGVhbiA9IHRydWUsIFxuICBtZXNzYWdlPzogc3RyaW5nXG4pIHtcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzLFxuICAgIGRhdGEsXG4gICAgbWVzc2FnZSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBtb2NrUmVzcG9uc2U6IHRydWUgLy8gXHU2ODA3XHU4QkIwXHU0RTNBXHU2QTIxXHU2MkRGXHU1NENEXHU1RTk0XG4gIH07XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2QTIxXHU2MkRGQVBJXHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKiBAcGFyYW0gbWVzc2FnZSBcdTk1MTlcdThCRUZcdTZEODhcdTYwNkZcbiAqIEBwYXJhbSBjb2RlIFx1OTUxOVx1OEJFRlx1NEVFM1x1NzgwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQSdNT0NLX0VSUk9SJ1xuICogQHBhcmFtIHN0YXR1cyBIVFRQXHU3MkI2XHU2MDAxXHU3ODAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBNTAwXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTY4M0NcdTVGMEZcdTc2ODRcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlKFxuICBtZXNzYWdlOiBzdHJpbmcsIFxuICBjb2RlOiBzdHJpbmcgPSAnTU9DS19FUlJPUicsIFxuICBzdGF0dXM6IG51bWJlciA9IDUwMFxuKSB7XG4gIHJldHVybiB7XG4gICAgc3VjY2VzczogZmFsc2UsXG4gICAgZXJyb3I6IHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBjb2RlLFxuICAgICAgc3RhdHVzQ29kZTogc3RhdHVzXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBtb2NrUmVzcG9uc2U6IHRydWVcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTUyMDZcdTk4NzVcdTU0Q0RcdTVFOTRcdTdFRDNcdTY3ODRcbiAqIEBwYXJhbSBpdGVtcyBcdTVGNTNcdTUyNERcdTk4NzVcdTc2ODRcdTk4NzlcdTc2RUVcdTUyMTdcdTg4NjhcbiAqIEBwYXJhbSB0b3RhbEl0ZW1zIFx1NjAzQlx1OTg3OVx1NzZFRVx1NjU3MFxuICogQHBhcmFtIHBhZ2UgXHU1RjUzXHU1MjREXHU5ODc1XHU3ODAxXG4gKiBAcGFyYW0gc2l6ZSBcdTZCQ0ZcdTk4NzVcdTU5MjdcdTVDMEZcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NFx1N0VEM1x1Njc4NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlPFQ+KFxuICBpdGVtczogVFtdLFxuICB0b3RhbEl0ZW1zOiBudW1iZXIsXG4gIHBhZ2U6IG51bWJlciA9IDEsXG4gIHNpemU6IG51bWJlciA9IDEwXG4pIHtcbiAgcmV0dXJuIGNyZWF0ZU1vY2tSZXNwb25zZSh7XG4gICAgaXRlbXMsXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdG90YWw6IHRvdGFsSXRlbXMsXG4gICAgICBwYWdlLFxuICAgICAgc2l6ZSxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCh0b3RhbEl0ZW1zIC8gc2l6ZSksXG4gICAgICBoYXNNb3JlOiBwYWdlICogc2l6ZSA8IHRvdGFsSXRlbXNcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFx1NUVGNlx1OEZERlxuICogQHBhcmFtIG1zIFx1NUVGNlx1OEZERlx1NkJFQlx1NzlEMlx1NjU3MFx1RkYwQ1x1OUVEOFx1OEJBNDMwMG1zXG4gKiBAcmV0dXJucyBQcm9taXNlXHU1QkY5XHU4QzYxXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxheShtczogbnVtYmVyID0gMzAwKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjcmVhdGVNb2NrUmVzcG9uc2UsXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5XG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3F1ZXJ5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9xdWVyeS50c1wiOy8qKlxuICogXHU2N0U1XHU4QkUyTW9ja1x1NjcwRFx1NTJBMVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY3RTVcdThCRTJcdTc2RjhcdTUxNzNBUElcdTc2ODRcdTZBMjFcdTYyREZcdTVCOUVcdTczQjBcbiAqL1xuXG5pbXBvcnQgeyBkZWxheSwgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLCBjcmVhdGVNb2NrUmVzcG9uc2UsIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IG1vY2tRdWVyaWVzIH0gZnJvbSAnLi4vZGF0YS9xdWVyeSc7XG5cbi8vIFx1OTFDRFx1N0Y2RVx1NjdFNVx1OEJFMlx1NjU3MFx1NjM2RVxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0UXVlcmllcygpOiB2b2lkIHtcbiAgLy8gXHU0RkREXHU3NTU5XHU1RjE1XHU3NTI4XHVGRjBDXHU1M0VBXHU5MUNEXHU3RjZFXHU1MTg1XHU1QkI5XG4gIHdoaWxlIChtb2NrUXVlcmllcy5sZW5ndGggPiAwKSB7XG4gICAgbW9ja1F1ZXJpZXMucG9wKCk7XG4gIH1cbiAgXG4gIC8vIFx1OTFDRFx1NjVCMFx1NzUxRlx1NjIxMFx1NjdFNVx1OEJFMlx1NjU3MFx1NjM2RVxuICBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT4ge1xuICAgIGNvbnN0IGlkID0gYHF1ZXJ5LSR7aSArIDF9YDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpO1xuICAgIFxuICAgIG1vY2tRdWVyaWVzLnB1c2goe1xuICAgICAgaWQsXG4gICAgICBuYW1lOiBgXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyICR7aSArIDF9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyICR7aSArIDF9IFx1NzY4NFx1NjNDRlx1OEZGMGAsXG4gICAgICBmb2xkZXJJZDogaSAlIDMgPT09IDAgPyAnZm9sZGVyLTEnIDogKGkgJSAzID09PSAxID8gJ2ZvbGRlci0yJyA6ICdmb2xkZXItMycpLFxuICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgZGF0YVNvdXJjZU5hbWU6IGBcdTY1NzBcdTYzNkVcdTZFOTAgJHsoaSAlIDUpICsgMX1gLFxuICAgICAgcXVlcnlUeXBlOiBpICUgMiA9PT0gMCA/ICdTUUwnIDogJ05BVFVSQUxfTEFOR1VBR0UnLFxuICAgICAgcXVlcnlUZXh0OiBpICUgMiA9PT0gMCA/IFxuICAgICAgICBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCA6IFxuICAgICAgICBgXHU2N0U1XHU2MjdFXHU2NzAwXHU4RkQxMTBcdTY3NjEke2kgJSAyID09PSAwID8gJ1x1OEJBMlx1NTM1NScgOiAnXHU3NTI4XHU2MjM3J31cdThCQjBcdTVGNTVgLFxuICAgICAgc3RhdHVzOiBpICUgNCA9PT0gMCA/ICdEUkFGVCcgOiAoaSAlIDQgPT09IDEgPyAnUFVCTElTSEVEJyA6IChpICUgNCA9PT0gMiA/ICdERVBSRUNBVEVEJyA6ICdBUkNISVZFRCcpKSxcbiAgICAgIHNlcnZpY2VTdGF0dXM6IGkgJSAyID09PSAwID8gJ0VOQUJMRUQnIDogJ0RJU0FCTEVEJyxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgY3JlYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgICAgdXBkYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgICAgZXhlY3V0aW9uQ291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSxcbiAgICAgIGlzRmF2b3JpdGU6IGkgJSAzID09PSAwLFxuICAgICAgaXNBY3RpdmU6IGkgJSA1ICE9PSAwLFxuICAgICAgbGFzdEV4ZWN1dGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogNDMyMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgcmVzdWx0Q291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyAxMCxcbiAgICAgIGV4ZWN1dGlvblRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkgKyAxMCxcbiAgICAgIHRhZ3M6IFtgXHU2ODA3XHU3QjdFJHtpKzF9YCwgYFx1N0M3Qlx1NTc4QiR7aSAlIDN9YF0sXG4gICAgICBjdXJyZW50VmVyc2lvbjoge1xuICAgICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgICAgcXVlcnlJZDogaWQsXG4gICAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgICAgfSxcbiAgICAgIHZlcnNpb25zOiBbe1xuICAgICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgICAgcXVlcnlJZDogaWQsXG4gICAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgICAgfV1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNpbXVsYXRlRGVsYXkoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRlbGF5VGltZSA9IHR5cGVvZiBtb2NrQ29uZmlnLmRlbGF5ID09PSAnbnVtYmVyJyA/IG1vY2tDb25maWcuZGVsYXkgOiAzMDA7XG4gIHJldHVybiBkZWxheShkZWxheVRpbWUpO1xufVxuXG4vKipcbiAqIFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMVxuICovXG5jb25zdCBxdWVyeVNlcnZpY2UgPSB7XG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJpZXMocGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICAgIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU4RkM3XHU2RUU0XG4gICAgbGV0IGZpbHRlcmVkSXRlbXMgPSBbLi4ubW9ja1F1ZXJpZXNdO1xuICAgIFxuICAgIC8vIFx1NjMwOVx1NTQwRFx1NzlGMFx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/Lm5hbWUpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSBwYXJhbXMubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gXG4gICAgICAgIHEubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgICAocS5kZXNjcmlwdGlvbiAmJiBxLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTY1NzBcdTYzNkVcdTZFOTBcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5kYXRhU291cmNlSWQpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEuZGF0YVNvdXJjZUlkID09PSBwYXJhbXMuZGF0YVNvdXJjZUlkKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU3MkI2XHU2MDAxXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1N0M3Qlx1NTc4Qlx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LnF1ZXJ5VHlwZSkge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5xdWVyeVR5cGUgPT09IHBhcmFtcy5xdWVyeVR5cGUpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTY1MzZcdTg1Q0ZcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5pc0Zhdm9yaXRlKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLmlzRmF2b3JpdGUgPT09IHRydWUpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmlsdGVyZWRJdGVtcy5sZW5ndGgpO1xuICAgIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICB0b3RhbDogZmlsdGVyZWRJdGVtcy5sZW5ndGgsXG4gICAgICAgIHBhZ2UsXG4gICAgICAgIHNpemUsXG4gICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmaWx0ZXJlZEl0ZW1zLmxlbmd0aCAvIHNpemUpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY1MzZcdTg1Q0ZcdTc2ODRcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldEZhdm9yaXRlUXVlcmllcyhwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdThGQzdcdTZFRTRcdTUxRkFcdTY1MzZcdTg1Q0ZcdTc2ODRcdTY3RTVcdThCRTJcbiAgICBsZXQgZmF2b3JpdGVRdWVyaWVzID0gbW9ja1F1ZXJpZXMuZmlsdGVyKHEgPT4gcS5pc0Zhdm9yaXRlID09PSB0cnVlKTtcbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdTUxNzZcdTRFRDZcdThGQzdcdTZFRTRcdTY3NjFcdTRFRjZcbiAgICBpZiAocGFyYW1zPy5uYW1lIHx8IHBhcmFtcz8uc2VhcmNoKSB7XG4gICAgICBjb25zdCBrZXl3b3JkID0gKHBhcmFtcy5uYW1lIHx8IHBhcmFtcy5zZWFyY2ggfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmYXZvcml0ZVF1ZXJpZXMgPSBmYXZvcml0ZVF1ZXJpZXMuZmlsdGVyKHEgPT4gXG4gICAgICAgIHEubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgICAocS5kZXNjcmlwdGlvbiAmJiBxLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICBpZiAocGFyYW1zPy5kYXRhU291cmNlSWQpIHtcbiAgICAgIGZhdm9yaXRlUXVlcmllcyA9IGZhdm9yaXRlUXVlcmllcy5maWx0ZXIocSA9PiBxLmRhdGFTb3VyY2VJZCA9PT0gcGFyYW1zLmRhdGFTb3VyY2VJZCk7XG4gICAgfVxuICAgIFxuICAgIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgICAgZmF2b3JpdGVRdWVyaWVzID0gZmF2b3JpdGVRdWVyaWVzLmZpbHRlcihxID0+IHEuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZhdm9yaXRlUXVlcmllcy5sZW5ndGgpO1xuICAgIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gZmF2b3JpdGVRdWVyaWVzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiBmYXZvcml0ZVF1ZXJpZXMubGVuZ3RoLFxuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmF2b3JpdGVRdWVyaWVzLmxlbmd0aCAvIHNpemUpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5KGlkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzLmZpbmQocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFxdWVyeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBxdWVyeTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGNyZWF0ZVF1ZXJ5KGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjVCMElEXHVGRjBDXHU2ODNDXHU1RjBGXHU0RTBFXHU3M0IwXHU2NzA5SURcdTRFMDBcdTgxRjRcbiAgICBjb25zdCBpZCA9IGBxdWVyeS0ke21vY2tRdWVyaWVzLmxlbmd0aCArIDF9YDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgbmV3UXVlcnkgPSB7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6IGRhdGEubmFtZSB8fCBgXHU2NUIwXHU2N0U1XHU4QkUyICR7aWR9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgICAgZm9sZGVySWQ6IGRhdGEuZm9sZGVySWQgfHwgbnVsbCxcbiAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQsXG4gICAgICBkYXRhU291cmNlTmFtZTogZGF0YS5kYXRhU291cmNlTmFtZSB8fCBgXHU2NTcwXHU2MzZFXHU2RTkwICR7ZGF0YS5kYXRhU291cmNlSWR9YCxcbiAgICAgIHF1ZXJ5VHlwZTogZGF0YS5xdWVyeVR5cGUgfHwgJ1NRTCcsXG4gICAgICBxdWVyeVRleHQ6IGRhdGEucXVlcnlUZXh0IHx8ICcnLFxuICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyB8fCAnRFJBRlQnLFxuICAgICAgc2VydmljZVN0YXR1czogZGF0YS5zZXJ2aWNlU3RhdHVzIHx8ICdESVNBQkxFRCcsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgY3JlYXRlZEJ5OiBkYXRhLmNyZWF0ZWRCeSB8fCB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgICAgdXBkYXRlZEJ5OiBkYXRhLnVwZGF0ZWRCeSB8fCB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgICAgZXhlY3V0aW9uQ291bnQ6IDAsXG4gICAgICBpc0Zhdm9yaXRlOiBkYXRhLmlzRmF2b3JpdGUgfHwgZmFsc2UsXG4gICAgICBpc0FjdGl2ZTogZGF0YS5pc0FjdGl2ZSB8fCB0cnVlLFxuICAgICAgbGFzdEV4ZWN1dGVkQXQ6IG51bGwsXG4gICAgICByZXN1bHRDb3VudDogMCxcbiAgICAgIGV4ZWN1dGlvblRpbWU6IDAsXG4gICAgICB0YWdzOiBkYXRhLnRhZ3MgfHwgW10sXG4gICAgICBjdXJyZW50VmVyc2lvbjoge1xuICAgICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgICAgcXVlcnlJZDogaWQsXG4gICAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICAgIG5hbWU6ICdcdTUyMURcdTU5Q0JcdTcyNDhcdTY3MkMnLFxuICAgICAgICBzcWw6IGRhdGEucXVlcnlUZXh0IHx8ICcnLFxuICAgICAgICBkYXRhU291cmNlSWQ6IGRhdGEuZGF0YVNvdXJjZUlkLFxuICAgICAgICBzdGF0dXM6ICdEUkFGVCcsXG4gICAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgICAgfSxcbiAgICAgIHZlcnNpb25zOiBbe1xuICAgICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgICAgcXVlcnlJZDogaWQsXG4gICAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICAgIG5hbWU6ICdcdTUyMURcdTU5Q0JcdTcyNDhcdTY3MkMnLFxuICAgICAgICBzcWw6IGRhdGEucXVlcnlUZXh0IHx8ICcnLFxuICAgICAgICBkYXRhU291cmNlSWQ6IGRhdGEuZGF0YVNvdXJjZUlkLFxuICAgICAgICBzdGF0dXM6ICdEUkFGVCcsXG4gICAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgICAgfV1cbiAgICB9O1xuICAgIFxuICAgIC8vIFx1NkRGQlx1NTJBMFx1NTIzMFx1NTIxN1x1ODg2OFxuICAgIG1vY2tRdWVyaWVzLnB1c2gobmV3UXVlcnkpO1xuICAgIFxuICAgIHJldHVybiBuZXdRdWVyeTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIHVwZGF0ZVF1ZXJ5KGlkOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1ODk4MVx1NjZGNFx1NjVCMFx1NzY4NFx1NjdFNVx1OEJFMlx1N0QyMlx1NUYxNVxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgICBjb25zdCB1cGRhdGVkUXVlcnkgPSB7XG4gICAgICAuLi5tb2NrUXVlcmllc1tpbmRleF0sXG4gICAgICAuLi5kYXRhLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQnk6IGRhdGEudXBkYXRlZEJ5IHx8IG1vY2tRdWVyaWVzW2luZGV4XS51cGRhdGVkQnkgfHwgeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2NkZGXHU2MzYyXHU2N0U1XHU4QkUyXG4gICAgbW9ja1F1ZXJpZXNbaW5kZXhdID0gdXBkYXRlZFF1ZXJ5O1xuICAgIFxuICAgIHJldHVybiB1cGRhdGVkUXVlcnk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBkZWxldGVRdWVyeShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1ODk4MVx1NTIyMFx1OTY2NFx1NzY4NFx1NjdFNVx1OEJFMlx1N0QyMlx1NUYxNVxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICBtb2NrUXVlcmllcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZVF1ZXJ5KGlkOiBzdHJpbmcsIHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXMuZmluZChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU3NTFGXHU2MjEwXHU2QTIxXHU2MkRGXHU3RUQzXHU2NzlDXG4gICAgY29uc3QgY29sdW1ucyA9IFsnaWQnLCAnbmFtZScsICdlbWFpbCcsICdzdGF0dXMnLCAnY3JlYXRlZF9hdCddO1xuICAgIGNvbnN0IHJvd3MgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT4gKHtcbiAgICAgIGlkOiBpICsgMSxcbiAgICAgIG5hbWU6IGBcdTc1MjhcdTYyMzcgJHtpICsgMX1gLFxuICAgICAgZW1haWw6IGB1c2VyJHtpICsgMX1AZXhhbXBsZS5jb21gLFxuICAgICAgc3RhdHVzOiBpICUgMiA9PT0gMCA/ICdhY3RpdmUnIDogJ2luYWN0aXZlJyxcbiAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKClcbiAgICB9KSk7XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU2MjY3XHU4ODRDXHU3RURGXHU4QkExXG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgbW9ja1F1ZXJpZXNbaW5kZXhdID0ge1xuICAgICAgICAuLi5tb2NrUXVlcmllc1tpbmRleF0sXG4gICAgICAgIGV4ZWN1dGlvbkNvdW50OiAobW9ja1F1ZXJpZXNbaW5kZXhdLmV4ZWN1dGlvbkNvdW50IHx8IDApICsgMSxcbiAgICAgICAgbGFzdEV4ZWN1dGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgcmVzdWx0Q291bnQ6IHJvd3MubGVuZ3RoXG4gICAgICB9O1xuICAgIH1cbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgY29sdW1ucyxcbiAgICAgIHJvd3MsXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBleGVjdXRpb25UaW1lOiBNYXRoLnJhbmRvbSgpICogMC41ICsgMC4xLFxuICAgICAgICByb3dDb3VudDogcm93cy5sZW5ndGgsXG4gICAgICAgIHRvdGFsUGFnZXM6IDFcbiAgICAgIH0sXG4gICAgICBxdWVyeToge1xuICAgICAgICBpZDogcXVlcnkuaWQsXG4gICAgICAgIG5hbWU6IHF1ZXJ5Lm5hbWUsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogcXVlcnkuZGF0YVNvdXJjZUlkXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMDdcdTYzNjJcdTY3RTVcdThCRTJcdTY1MzZcdTg1Q0ZcdTcyQjZcdTYwMDFcbiAgICovXG4gIGFzeW5jIHRvZ2dsZUZhdm9yaXRlKGlkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjA3XHU2MzYyXHU2NTM2XHU4NUNGXHU3MkI2XHU2MDAxXG4gICAgbW9ja1F1ZXJpZXNbaW5kZXhdID0ge1xuICAgICAgLi4ubW9ja1F1ZXJpZXNbaW5kZXhdLFxuICAgICAgaXNGYXZvcml0ZTogIW1vY2tRdWVyaWVzW2luZGV4XS5pc0Zhdm9yaXRlLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBtb2NrUXVlcmllc1tpbmRleF07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1Mzg2XHU1M0YyXG4gICAqL1xuICBhc3luYyBnZXRRdWVyeUhpc3RvcnkocGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICAgIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gICAgXG4gICAgLy8gXHU3NTFGXHU2MjEwXHU2QTIxXHU2MkRGXHU1Mzg2XHU1M0YyXHU4QkIwXHU1RjU1XG4gICAgY29uc3QgdG90YWxJdGVtcyA9IDIwO1xuICAgIGNvbnN0IGhpc3RvcmllcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHRvdGFsSXRlbXMgfSwgKF8sIGkpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogMzYwMDAwMCkudG9JU09TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHF1ZXJ5SW5kZXggPSBpICUgbW9ja1F1ZXJpZXMubGVuZ3RoO1xuICAgICAgXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogYGhpc3QtJHtpICsgMX1gLFxuICAgICAgICBxdWVyeUlkOiBtb2NrUXVlcmllc1txdWVyeUluZGV4XS5pZCxcbiAgICAgICAgcXVlcnlOYW1lOiBtb2NrUXVlcmllc1txdWVyeUluZGV4XS5uYW1lLFxuICAgICAgICBleGVjdXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICAgIGV4ZWN1dGlvblRpbWU6IE1hdGgucmFuZG9tKCkgKiAwLjUgKyAwLjEsXG4gICAgICAgIHJvd0NvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApICsgMSxcbiAgICAgICAgdXNlcklkOiAndXNlcjEnLFxuICAgICAgICB1c2VyTmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycsXG4gICAgICAgIHN0YXR1czogaSAlIDggPT09IDAgPyAnRkFJTEVEJyA6ICdTVUNDRVNTJyxcbiAgICAgICAgZXJyb3JNZXNzYWdlOiBpICUgOCA9PT0gMCA/ICdcdTY3RTVcdThCRTJcdTYyNjdcdTg4NENcdThEODVcdTY1RjYnIDogbnVsbFxuICAgICAgfTtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgdG90YWxJdGVtcyk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBoaXN0b3JpZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IHRvdGFsSXRlbXMsXG4gICAgICAgIHBhZ2UsXG4gICAgICAgIHNpemUsXG4gICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCh0b3RhbEl0ZW1zIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnlWZXJzaW9ucyhxdWVyeUlkOiBzdHJpbmcsIHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXMuZmluZChxID0+IHEuaWQgPT09IHF1ZXJ5SWQpO1xuICAgIFxuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3F1ZXJ5SWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NzI0OFx1NjcyQ1x1NTIxN1x1ODg2OFxuICAgIHJldHVybiBxdWVyeS52ZXJzaW9ucyB8fCBbXTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgICovXG4gIGFzeW5jIGNyZWF0ZVF1ZXJ5VmVyc2lvbihxdWVyeUlkOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7cXVlcnlJZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwXHU3MjQ4XHU2NzJDXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllc1tpbmRleF07XG4gICAgY29uc3QgbmV3VmVyc2lvbk51bWJlciA9IChxdWVyeS52ZXJzaW9ucz8ubGVuZ3RoIHx8IDApICsgMTtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgY29uc3QgbmV3VmVyc2lvbiA9IHtcbiAgICAgIGlkOiBgdmVyLSR7cXVlcnlJZH0tJHtuZXdWZXJzaW9uTnVtYmVyfWAsXG4gICAgICBxdWVyeUlkLFxuICAgICAgdmVyc2lvbk51bWJlcjogbmV3VmVyc2lvbk51bWJlcixcbiAgICAgIG5hbWU6IGRhdGEubmFtZSB8fCBgXHU3MjQ4XHU2NzJDICR7bmV3VmVyc2lvbk51bWJlcn1gLFxuICAgICAgc3FsOiBkYXRhLnNxbCB8fCBxdWVyeS5xdWVyeVRleHQgfHwgJycsXG4gICAgICBkYXRhU291cmNlSWQ6IGRhdGEuZGF0YVNvdXJjZUlkIHx8IHF1ZXJ5LmRhdGFTb3VyY2VJZCxcbiAgICAgIHN0YXR1czogJ0RSQUZUJyxcbiAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9O1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NEU0Qlx1NTI0RFx1NzI0OFx1NjcyQ1x1NzY4NGlzTGF0ZXN0XHU2ODA3XHU1RkQ3XG4gICAgaWYgKHF1ZXJ5LnZlcnNpb25zICYmIHF1ZXJ5LnZlcnNpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIHF1ZXJ5LnZlcnNpb25zID0gcXVlcnkudmVyc2lvbnMubWFwKHYgPT4gKHtcbiAgICAgICAgLi4udixcbiAgICAgICAgaXNMYXRlc3Q6IGZhbHNlXG4gICAgICB9KSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NkRGQlx1NTJBMFx1NjVCMFx1NzI0OFx1NjcyQ1xuICAgIGlmICghcXVlcnkudmVyc2lvbnMpIHtcbiAgICAgIHF1ZXJ5LnZlcnNpb25zID0gW107XG4gICAgfVxuICAgIHF1ZXJ5LnZlcnNpb25zLnB1c2gobmV3VmVyc2lvbik7XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDXG4gICAgbW9ja1F1ZXJpZXNbaW5kZXhdID0ge1xuICAgICAgLi4ucXVlcnksXG4gICAgICBjdXJyZW50VmVyc2lvbjogbmV3VmVyc2lvbixcbiAgICAgIHVwZGF0ZWRBdDogdGltZXN0YW1wXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gbmV3VmVyc2lvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUzRDFcdTVFMDNcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgICovXG4gIGFzeW5jIHB1Ymxpc2hRdWVyeVZlcnNpb24odmVyc2lvbklkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTUzMDVcdTU0MkJcdTZCNjRcdTcyNDhcdTY3MkNcdTc2ODRcdTY3RTVcdThCRTJcbiAgICBsZXQgcXVlcnkgPSBudWxsO1xuICAgIGxldCB2ZXJzaW9uSW5kZXggPSAtMTtcbiAgICBsZXQgcXVlcnlJbmRleCA9IC0xO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9ja1F1ZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtb2NrUXVlcmllc1tpXS52ZXJzaW9ucykge1xuICAgICAgICBjb25zdCB2SW5kZXggPSBtb2NrUXVlcmllc1tpXS52ZXJzaW9ucy5maW5kSW5kZXgodiA9PiB2LmlkID09PSB2ZXJzaW9uSWQpO1xuICAgICAgICBpZiAodkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbaV07XG4gICAgICAgICAgdmVyc2lvbkluZGV4ID0gdkluZGV4O1xuICAgICAgICAgIHF1ZXJ5SW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmICghcXVlcnkgfHwgdmVyc2lvbkluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7dmVyc2lvbklkfVx1NzY4NFx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ2ApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTcyNDhcdTY3MkNcdTcyQjZcdTYwMDFcbiAgICBjb25zdCB1cGRhdGVkVmVyc2lvbiA9IHtcbiAgICAgIC4uLnF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF0sXG4gICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgcHVibGlzaGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSA9IHVwZGF0ZWRWZXJzaW9uO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NzJCNlx1NjAwMVxuICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgLi4ucXVlcnksXG4gICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgY3VycmVudFZlcnNpb246IHVwZGF0ZWRWZXJzaW9uLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiB1cGRhdGVkVmVyc2lvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTVFOUZcdTVGMDNcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgICovXG4gIGFzeW5jIGRlcHJlY2F0ZVF1ZXJ5VmVyc2lvbih2ZXJzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NTMwNVx1NTQyQlx1NkI2NFx1NzI0OFx1NjcyQ1x1NzY4NFx1NjdFNVx1OEJFMlxuICAgIGxldCBxdWVyeSA9IG51bGw7XG4gICAgbGV0IHZlcnNpb25JbmRleCA9IC0xO1xuICAgIGxldCBxdWVyeUluZGV4ID0gLTE7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2NrUXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zKSB7XG4gICAgICAgIGNvbnN0IHZJbmRleCA9IG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zLmZpbmRJbmRleCh2ID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgICAgIGlmICh2SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgcXVlcnkgPSBtb2NrUXVlcmllc1tpXTtcbiAgICAgICAgICB2ZXJzaW9uSW5kZXggPSB2SW5kZXg7XG4gICAgICAgICAgcXVlcnlJbmRleCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKCFxdWVyeSB8fCB2ZXJzaW9uSW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHt2ZXJzaW9uSWR9XHU3Njg0XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NzI0OFx1NjcyQ1x1NzJCNlx1NjAwMVxuICAgIGNvbnN0IHVwZGF0ZWRWZXJzaW9uID0ge1xuICAgICAgLi4ucXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSxcbiAgICAgIHN0YXR1czogJ0RFUFJFQ0FURUQnLFxuICAgICAgZGVwcmVjYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF0gPSB1cGRhdGVkVmVyc2lvbjtcbiAgICBcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTVFOUZcdTVGMDNcdTc2ODRcdTY2MkZcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkNcdUZGMENcdTUyMTlcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTcyQjZcdTYwMDFcbiAgICBpZiAocXVlcnkuY3VycmVudFZlcnNpb24gJiYgcXVlcnkuY3VycmVudFZlcnNpb24uaWQgPT09IHZlcnNpb25JZCkge1xuICAgICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAgIC4uLnF1ZXJ5LFxuICAgICAgICBzdGF0dXM6ICdERVBSRUNBVEVEJyxcbiAgICAgICAgY3VycmVudFZlcnNpb246IHVwZGF0ZWRWZXJzaW9uLFxuICAgICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAgIC4uLnF1ZXJ5LFxuICAgICAgICB2ZXJzaW9uczogcXVlcnkudmVyc2lvbnMsXG4gICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICB9O1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdXBkYXRlZFZlcnNpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2RkMwXHU2RDNCXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBhY3RpdmF0ZVF1ZXJ5VmVyc2lvbihxdWVyeUlkOiBzdHJpbmcsIHZlcnNpb25JZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnlJbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IHF1ZXJ5SWQpO1xuICAgIFxuICAgIGlmIChxdWVyeUluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7cXVlcnlJZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllc1txdWVyeUluZGV4XTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTcyNDhcdTY3MkNcbiAgICBpZiAoIXF1ZXJ5LnZlcnNpb25zKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjdFNVx1OEJFMiAke3F1ZXJ5SWR9IFx1NkNBMVx1NjcwOVx1NzI0OFx1NjcyQ2ApO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCB2ZXJzaW9uSW5kZXggPSBxdWVyeS52ZXJzaW9ucy5maW5kSW5kZXgodiA9PiB2LmlkID09PSB2ZXJzaW9uSWQpO1xuICAgIFxuICAgIGlmICh2ZXJzaW9uSW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHt2ZXJzaW9uSWR9XHU3Njg0XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1ODNCN1x1NTNENlx1ODk4MVx1NkZDMFx1NkQzQlx1NzY4NFx1NzI0OFx1NjcyQ1xuICAgIGNvbnN0IHZlcnNpb25Ub0FjdGl2YXRlID0gcXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkNcdTU0OENcdTY3RTVcdThCRTJcdTcyQjZcdTYwMDFcbiAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgIC4uLnF1ZXJ5LFxuICAgICAgY3VycmVudFZlcnNpb246IHZlcnNpb25Ub0FjdGl2YXRlLFxuICAgICAgc3RhdHVzOiB2ZXJzaW9uVG9BY3RpdmF0ZS5zdGF0dXMsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHZlcnNpb25Ub0FjdGl2YXRlO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBxdWVyeVNlcnZpY2U7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2ludGVncmF0aW9uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2ludGVncmF0aW9uLnRzXCI7LyoqXG4gKiBcdTk2QzZcdTYyMTBcdTY3MERcdTUyQTFNb2NrXHU2NTcwXHU2MzZFXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1OTZDNlx1NjIxMEFQSVx1NzY4NFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVxuICovXG5cbi8vIFx1NkEyMVx1NjJERlx1OTZDNlx1NjIxMFxuZXhwb3J0IGNvbnN0IG1vY2tJbnRlZ3JhdGlvbnMgPSBbXG4gIHtcbiAgICBpZDogJ2ludGVncmF0aW9uLTEnLFxuICAgIG5hbWU6ICdcdTc5M0FcdTRGOEJSRVNUIEFQSScsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTc5M0FcdTRGOEJSRVNUIEFQSVx1NjcwRFx1NTJBMScsXG4gICAgdHlwZTogJ1JFU1QnLFxuICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS5leGFtcGxlLmNvbS92MScsXG4gICAgYXV0aFR5cGU6ICdCQVNJQycsXG4gICAgdXNlcm5hbWU6ICdhcGlfdXNlcicsXG4gICAgcGFzc3dvcmQ6ICcqKioqKioqKicsXG4gICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBlbmRwb2ludHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC0xJyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NzUyOFx1NjIzN1x1NTIxN1x1ODg2OCcsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvdXNlcnMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjI0MFx1NjcwOVx1NzUyOFx1NjIzN1x1NzY4NFx1NTIxN1x1ODg2OCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtMicsXG4gICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTc1MjhcdTYyMzcnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXRoOiAnL3VzZXJzL3tpZH0nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NjgzOVx1NjM2RUlEXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU3NTI4XHU2MjM3J1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAnaW50ZWdyYXRpb24tMicsXG4gICAgbmFtZTogJ1x1NTkyOVx1NkMxNEFQSScsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTVBUEknLFxuICAgIHR5cGU6ICdSRVNUJyxcbiAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkud2VhdGhlci5jb20nLFxuICAgIGF1dGhUeXBlOiAnQVBJX0tFWScsXG4gICAgYXBpS2V5OiAnKioqKioqKionLFxuICAgIHN0YXR1czogJ0FDVElWRScsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA0MzIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgZW5kcG9pbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtMycsXG4gICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERcdTU5MjlcdTZDMTQnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXRoOiAnL2N1cnJlbnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjMwN1x1NUI5QVx1NEY0RFx1N0Y2RVx1NzY4NFx1NUY1M1x1NTI0RFx1NTkyOVx1NkMxNCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtNCcsXG4gICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTUnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXRoOiAnL2ZvcmVjYXN0JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTY3MkFcdTY3NjU3XHU1OTI5XHU3Njg0XHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1J1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAnaW50ZWdyYXRpb24tMycsXG4gICAgbmFtZTogJ1x1NjUyRlx1NEVEOFx1N0Y1MVx1NTE3MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY1MkZcdTRFRDhcdTU5MDRcdTc0MDZBUEknLFxuICAgIHR5cGU6ICdSRVNUJyxcbiAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkucGF5bWVudC5jb20nLFxuICAgIGF1dGhUeXBlOiAnT0FVVEgyJyxcbiAgICBjbGllbnRJZDogJ2NsaWVudDEyMycsXG4gICAgY2xpZW50U2VjcmV0OiAnKioqKioqKionLFxuICAgIHN0YXR1czogJ0lOQUNUSVZFJyxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGVuZHBvaW50czogW1xuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTUnLFxuICAgICAgICBuYW1lOiAnXHU1MjFCXHU1RUZBXHU2NTJGXHU0RUQ4JyxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHBhdGg6ICcvcGF5bWVudHMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NFx1NjUyRlx1NEVEOFx1OEJGN1x1NkM0MidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtNicsXG4gICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTY1MkZcdTRFRDhcdTcyQjZcdTYwMDEnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NjhDMFx1NjdFNVx1NjUyRlx1NEVEOFx1NzJCNlx1NjAwMSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtNycsXG4gICAgICAgIG5hbWU6ICdcdTkwMDBcdTZCM0UnLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgcGF0aDogJy9wYXltZW50cy97aWR9L3JlZnVuZCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU1OTA0XHU3NDA2XHU5MDAwXHU2QjNFXHU4QkY3XHU2QzQyJ1xuICAgICAgfVxuICAgIF1cbiAgfVxuXTtcblxuLy8gXHU5MUNEXHU3RjZFXHU5NkM2XHU2MjEwXHU2NTcwXHU2MzZFXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRJbnRlZ3JhdGlvbnMoKTogdm9pZCB7XG4gIC8vIFx1NEZERFx1NzU1OVx1NUYxNVx1NzUyOFx1RkYwQ1x1NTNFQVx1OTFDRFx1N0Y2RVx1NTE4NVx1NUJCOVxuICB3aGlsZSAobW9ja0ludGVncmF0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgbW9ja0ludGVncmF0aW9ucy5wb3AoKTtcbiAgfVxuICBcbiAgLy8gXHU5MUNEXHU2NUIwXHU3NTFGXHU2MjEwXHU5NkM2XHU2MjEwXHU2NTcwXHU2MzZFXG4gIFtcbiAgICB7XG4gICAgICBpZDogJ2ludGVncmF0aW9uLTEnLFxuICAgICAgbmFtZTogJ1x1NzkzQVx1NEY4QlJFU1QgQVBJJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU3OTNBXHU0RjhCUkVTVCBBUElcdTY3MERcdTUyQTEnLFxuICAgICAgdHlwZTogJ1JFU1QnLFxuICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tL3YxJyxcbiAgICAgIGF1dGhUeXBlOiAnQkFTSUMnLFxuICAgICAgdXNlcm5hbWU6ICdhcGlfdXNlcicsXG4gICAgICBwYXNzd29yZDogJyoqKioqKioqJyxcbiAgICAgIHN0YXR1czogJ0FDVElWRScsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgZW5kcG9pbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2VuZHBvaW50LTEnLFxuICAgICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTc1MjhcdTYyMzdcdTUyMTdcdTg4NjgnLFxuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgcGF0aDogJy91c2VycycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTYyNDBcdTY3MDlcdTc1MjhcdTYyMzdcdTc2ODRcdTUyMTdcdTg4NjgnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2VuZHBvaW50LTInLFxuICAgICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTc1MjhcdTYyMzcnLFxuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgcGF0aDogJy91c2Vycy97aWR9JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NjgzOVx1NjM2RUlEXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU3NTI4XHU2MjM3J1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2ludGVncmF0aW9uLTInLFxuICAgICAgbmFtZTogJ1x1NTkyOVx1NkMxNEFQSScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNUFQSScsXG4gICAgICB0eXBlOiAnUkVTVCcsXG4gICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkud2VhdGhlci5jb20nLFxuICAgICAgYXV0aFR5cGU6ICdBUElfS0VZJyxcbiAgICAgIGFwaUtleTogJyoqKioqKioqJyxcbiAgICAgIHN0YXR1czogJ0FDVElWRScsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNDMyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgZW5kcG9pbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2VuZHBvaW50LTMnLFxuICAgICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERcdTU5MjlcdTZDMTQnLFxuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgcGF0aDogJy9jdXJyZW50JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjMwN1x1NUI5QVx1NEY0RFx1N0Y2RVx1NzY4NFx1NUY1M1x1NTI0RFx1NTkyOVx1NkMxNCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtNCcsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNScsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL2ZvcmVjYXN0JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjcyQVx1Njc2NTdcdTU5MjlcdTc2ODRcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTUnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnaW50ZWdyYXRpb24tMycsXG4gICAgICBuYW1lOiAnXHU2NTJGXHU0RUQ4XHU3RjUxXHU1MTczJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU2NTJGXHU0RUQ4XHU1OTA0XHU3NDA2QVBJJyxcbiAgICAgIHR5cGU6ICdSRVNUJyxcbiAgICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS5wYXltZW50LmNvbScsXG4gICAgICBhdXRoVHlwZTogJ09BVVRIMicsXG4gICAgICBjbGllbnRJZDogJ2NsaWVudDEyMycsXG4gICAgICBjbGllbnRTZWNyZXQ6ICcqKioqKioqKicsXG4gICAgICBzdGF0dXM6ICdJTkFDVElWRScsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmRwb2ludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtNScsXG4gICAgICAgICAgbmFtZTogJ1x1NTIxQlx1NUVGQVx1NjUyRlx1NEVEOCcsXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgcGF0aDogJy9wYXltZW50cycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTUyMUJcdTVFRkFcdTY1QjBcdTc2ODRcdTY1MkZcdTRFRDhcdThCRjdcdTZDNDInXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2VuZHBvaW50LTYnLFxuICAgICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTY1MkZcdTRFRDhcdTcyQjZcdTYwMDEnLFxuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgcGF0aDogJy9wYXltZW50cy97aWR9JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NjhDMFx1NjdFNVx1NjUyRlx1NEVEOFx1NzJCNlx1NjAwMSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtNycsXG4gICAgICAgICAgbmFtZTogJ1x1OTAwMFx1NkIzRScsXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgcGF0aDogJy9wYXltZW50cy97aWR9L3JlZnVuZCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTU5MDRcdTc0MDZcdTkwMDBcdTZCM0VcdThCRjdcdTZDNDInXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF0uZm9yRWFjaChpdGVtID0+IG1vY2tJbnRlZ3JhdGlvbnMucHVzaChpdGVtKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1vY2tJbnRlZ3JhdGlvbnM7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbnRlZ3JhdGlvbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW50ZWdyYXRpb24udHNcIjsvKipcbiAqIFx1OTZDNlx1NjIxME1vY2tcdTY3MERcdTUyQTFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU5NkM2XHU2MjEwXHU3NkY4XHU1MTczQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU1QjlFXHU3M0IwXG4gKi9cblxuaW1wb3J0IHsgZGVsYXksIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSwgY3JlYXRlTW9ja1Jlc3BvbnNlLCBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBtb2NrSW50ZWdyYXRpb25zIH0gZnJvbSAnLi4vZGF0YS9pbnRlZ3JhdGlvbic7XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNpbXVsYXRlRGVsYXkoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRlbGF5VGltZSA9IHR5cGVvZiBtb2NrQ29uZmlnLmRlbGF5ID09PSAnbnVtYmVyJyA/IG1vY2tDb25maWcuZGVsYXkgOiAzMDA7XG4gIHJldHVybiBkZWxheShkZWxheVRpbWUpO1xufVxuXG4vKipcbiAqIFx1OTZDNlx1NjIxMFx1NjcwRFx1NTJBMVxuICovXG5jb25zdCBpbnRlZ3JhdGlvblNlcnZpY2UgPSB7XG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTk2QzZcdTYyMTBcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldEludGVncmF0aW9ucyhwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdThGQzdcdTZFRTRcbiAgICBsZXQgZmlsdGVyZWRJdGVtcyA9IFsuLi5tb2NrSW50ZWdyYXRpb25zXTtcbiAgICBcbiAgICAvLyBcdTYzMDlcdTU0MERcdTc5RjBcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5uYW1lKSB7XG4gICAgICBjb25zdCBrZXl3b3JkID0gcGFyYW1zLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihpID0+IFxuICAgICAgICBpLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgICAgKGkuZGVzY3JpcHRpb24gJiYgaS5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU3QzdCXHU1NzhCXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8udHlwZSkge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGkgPT4gaS50eXBlID09PSBwYXJhbXMudHlwZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NzJCNlx1NjAwMVx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGkgPT4gaS5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmlsdGVyZWRJdGVtcy5sZW5ndGgpO1xuICAgIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICB0b3RhbDogZmlsdGVyZWRJdGVtcy5sZW5ndGgsXG4gICAgICAgIHBhZ2UsXG4gICAgICAgIHNpemUsXG4gICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmaWx0ZXJlZEl0ZW1zLmxlbmd0aCAvIHNpemUpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTk2QzZcdTYyMTBcbiAgICovXG4gIGFzeW5jIGdldEludGVncmF0aW9uKGlkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG1vY2tJbnRlZ3JhdGlvbnMuZmluZChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIWludGVncmF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGludGVncmF0aW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgY3JlYXRlSW50ZWdyYXRpb24oZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgbmV3SWQgPSBgaW50ZWdyYXRpb24tJHtEYXRlLm5vdygpfWA7XG4gICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgIFxuICAgIGNvbnN0IG5ld0ludGVncmF0aW9uID0ge1xuICAgICAgaWQ6IG5ld0lkLFxuICAgICAgbmFtZTogZGF0YS5uYW1lIHx8ICdcdTY1QjBcdTk2QzZcdTYyMTAnLFxuICAgICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgICB0eXBlOiBkYXRhLnR5cGUgfHwgJ1JFU1QnLFxuICAgICAgYmFzZVVybDogZGF0YS5iYXNlVXJsIHx8ICdodHRwczovL2FwaS5leGFtcGxlLmNvbScsXG4gICAgICBhdXRoVHlwZTogZGF0YS5hdXRoVHlwZSB8fCAnTk9ORScsXG4gICAgICBzdGF0dXM6ICdBQ1RJVkUnLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIGVuZHBvaW50czogZGF0YS5lbmRwb2ludHMgfHwgW11cbiAgICB9O1xuICAgIFxuICAgIC8vIFx1NjgzOVx1NjM2RVx1OEJBNFx1OEJDMVx1N0M3Qlx1NTc4Qlx1NkRGQlx1NTJBMFx1NzZGOFx1NUU5NFx1NUI1N1x1NkJCNVxuICAgIGlmIChkYXRhLmF1dGhUeXBlID09PSAnQkFTSUMnKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG5ld0ludGVncmF0aW9uLCB7XG4gICAgICAgIHVzZXJuYW1lOiBkYXRhLnVzZXJuYW1lIHx8ICd1c2VyJyxcbiAgICAgICAgcGFzc3dvcmQ6IGRhdGEucGFzc3dvcmQgfHwgJyoqKioqKioqJ1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmF1dGhUeXBlID09PSAnQVBJX0tFWScpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obmV3SW50ZWdyYXRpb24sIHtcbiAgICAgICAgYXBpS2V5OiBkYXRhLmFwaUtleSB8fCAnKioqKioqKionXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGRhdGEuYXV0aFR5cGUgPT09ICdPQVVUSDInKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG5ld0ludGVncmF0aW9uLCB7XG4gICAgICAgIGNsaWVudElkOiBkYXRhLmNsaWVudElkIHx8ICdjbGllbnQnLFxuICAgICAgICBjbGllbnRTZWNyZXQ6IGRhdGEuY2xpZW50U2VjcmV0IHx8ICcqKioqKioqKidcbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTZERkJcdTUyQTBcdTUyMzBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAgICBtb2NrSW50ZWdyYXRpb25zLnB1c2gobmV3SW50ZWdyYXRpb24pO1xuICAgIFxuICAgIHJldHVybiBuZXdJbnRlZ3JhdGlvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTY2RjRcdTY1QjBcdTk2QzZcdTYyMTBcbiAgICovXG4gIGFzeW5jIHVwZGF0ZUludGVncmF0aW9uKGlkOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IGluZGV4ID0gbW9ja0ludGVncmF0aW9ucy5maW5kSW5kZXgoaSA9PiBpLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU5NkM2XHU2MjEwYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVxuICAgIGNvbnN0IHVwZGF0ZWRJbnRlZ3JhdGlvbiA9IHtcbiAgICAgIC4uLm1vY2tJbnRlZ3JhdGlvbnNbaW5kZXhdLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIGlkLCAvLyBcdTc4NkVcdTRGRERJRFx1NEUwRFx1NTNEOFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVxuICAgIG1vY2tJbnRlZ3JhdGlvbnNbaW5kZXhdID0gdXBkYXRlZEludGVncmF0aW9uO1xuICAgIFxuICAgIHJldHVybiB1cGRhdGVkSW50ZWdyYXRpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjIwXHU5NjY0XHU5NkM2XHU2MjEwXG4gICAqL1xuICBhc3luYyBkZWxldGVJbnRlZ3JhdGlvbihpZDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IGluZGV4ID0gbW9ja0ludGVncmF0aW9ucy5maW5kSW5kZXgoaSA9PiBpLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU5NkM2XHU2MjEwYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NEVDRVx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NEUyRFx1NTIyMFx1OTY2NFxuICAgIG1vY2tJbnRlZ3JhdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICBcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTZENEJcdThCRDVcdTk2QzZcdTYyMTBcbiAgICovXG4gIGFzeW5jIHRlc3RJbnRlZ3JhdGlvbihpZDogc3RyaW5nLCBwYXJhbXM6IGFueSA9IHt9KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW50ZWdyYXRpb24gPSBtb2NrSW50ZWdyYXRpb25zLmZpbmQoaSA9PiBpLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFpbnRlZ3JhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU5NkM2XHU2MjEwYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NkEyMVx1NjJERlx1NkQ0Qlx1OEJENVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgcmVzdWx0VHlwZTogJ0pTT04nLFxuICAgICAganNvblJlc3BvbnNlOiB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICBtZXNzYWdlOiAnXHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU2MjEwXHU1MjlGJyxcbiAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICByZXNwb25zZVRpbWU6IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyA1MCxcbiAgICAgICAgICBzZXJ2ZXJJbmZvOiAnTW9jayBTZXJ2ZXIgdjEuMCcsXG4gICAgICAgICAgZW5kcG9pbnQ6IHBhcmFtcy5lbmRwb2ludCB8fCBpbnRlZ3JhdGlvbi5lbmRwb2ludHNbMF0/LnBhdGggfHwgJy8nXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IEFycmF5LmZyb20oeyBsZW5ndGg6IDMgfSwgKF8sIGkpID0+ICh7XG4gICAgICAgICAgaWQ6IGkgKyAxLFxuICAgICAgICAgIG5hbWU6IGBcdTY4MzdcdTY3MkNcdTY1NzBcdTYzNkUgJHtpICsgMX1gLFxuICAgICAgICAgIHZhbHVlOiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwKSAvIDEwXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2MjY3XHU4ODRDXHU5NkM2XHU2MjEwXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBleGVjdXRlUXVlcnkoaWQ6IHN0cmluZywgcGFyYW1zOiBhbnkgPSB7fSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IGludGVncmF0aW9uID0gbW9ja0ludGVncmF0aW9ucy5maW5kKGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghaW50ZWdyYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1OTZDNlx1NjIxMGApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTZBMjFcdTYyREZcdTYyNjdcdTg4NENcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIHJlc3VsdFR5cGU6ICdKU09OJyxcbiAgICAgIGpzb25SZXNwb25zZToge1xuICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHF1ZXJ5OiBwYXJhbXMucXVlcnkgfHwgJ1x1OUVEOFx1OEJBNFx1NjdFNVx1OEJFMicsXG4gICAgICAgIGRhdGE6IEFycmF5LmZyb20oeyBsZW5ndGg6IDUgfSwgKF8sIGkpID0+ICh7XG4gICAgICAgICAgaWQ6IGByZWNvcmQtJHtpICsgMX1gLFxuICAgICAgICAgIG5hbWU6IGBcdThCQjBcdTVGNTUgJHtpICsgMX1gLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU2N0U1XHU4QkUyXHU4RkQ0XHU1NkRFXHU3Njg0XHU4QkIwXHU1RjU1ICR7aSArIDF9YCxcbiAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgdHlwZTogaSAlIDIgPT09IDAgPyAnQScgOiAnQicsXG4gICAgICAgICAgICB2YWx1ZTogTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwKSxcbiAgICAgICAgICAgIGFjdGl2ZTogaSAlIDMgIT09IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvLyBcdTUxN0NcdTVCQjlcdTY1RTdcdTc2ODRcdTYzQTVcdTUzRTMsIFx1NzZGNFx1NjNBNVx1OEMwM1x1NzUyOFx1NjVCMFx1NzY4NFx1NUI5RVx1NzNCMFxuICBhc3luYyBnZXRNb2NrSW50ZWdyYXRpb25zKCk6IFByb21pc2U8YW55W10+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuZ2V0SW50ZWdyYXRpb25zKHt9KTtcbiAgICByZXR1cm4gcmVzdWx0Lml0ZW1zO1xuICB9LFxuICBcbiAgYXN5bmMgZ2V0TW9ja0ludGVncmF0aW9uKGlkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IG51bGw+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaW50ZWdyYXRpb24gPSBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuZ2V0SW50ZWdyYXRpb24oaWQpO1xuICAgICAgcmV0dXJuIGludGVncmF0aW9uO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdcdTgzQjdcdTUzRDZcdTk2QzZcdTYyMTBcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LFxuICBcbiAgYXN5bmMgY3JlYXRlTW9ja0ludGVncmF0aW9uKGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGludGVncmF0aW9uU2VydmljZS5jcmVhdGVJbnRlZ3JhdGlvbihkYXRhKTtcbiAgfSxcbiAgXG4gIGFzeW5jIHVwZGF0ZU1vY2tJbnRlZ3JhdGlvbihpZDogc3RyaW5nLCB1cGRhdGVzOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBpbnRlZ3JhdGlvblNlcnZpY2UudXBkYXRlSW50ZWdyYXRpb24oaWQsIHVwZGF0ZXMpO1xuICB9LFxuICBcbiAgYXN5bmMgZGVsZXRlTW9ja0ludGVncmF0aW9uKGlkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGludGVncmF0aW9uU2VydmljZS5kZWxldGVJbnRlZ3JhdGlvbihpZCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1x1NTIyMFx1OTY2NFx1OTZDNlx1NjIxMFx1NTkzMVx1OEQyNTonLCBlcnJvcik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuICBcbiAgYXN5bmMgZXhlY3V0ZU1vY2tRdWVyeShpbnRlZ3JhdGlvbklkOiBzdHJpbmcsIHF1ZXJ5OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KGludGVncmF0aW9uSWQsIHF1ZXJ5KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGRhdGE6IHJlc3VsdC5qc29uUmVzcG9uc2UuZGF0YVxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1OicsIGVycm9yKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpXG4gICAgICB9O1xuICAgIH1cbiAgfVxufTtcblxuLy8gXHU2REZCXHU1MkEwXHU1MTdDXHU1QkI5XHU2NUU3QVBJXHU3Njg0XHU1QkZDXHU1MUZBXG5leHBvcnQgY29uc3QgZ2V0TW9ja0ludGVncmF0aW9ucyA9IGludGVncmF0aW9uU2VydmljZS5nZXRNb2NrSW50ZWdyYXRpb25zO1xuZXhwb3J0IGNvbnN0IGdldE1vY2tJbnRlZ3JhdGlvbiA9IGludGVncmF0aW9uU2VydmljZS5nZXRNb2NrSW50ZWdyYXRpb247XG5leHBvcnQgY29uc3QgY3JlYXRlTW9ja0ludGVncmF0aW9uID0gaW50ZWdyYXRpb25TZXJ2aWNlLmNyZWF0ZU1vY2tJbnRlZ3JhdGlvbjtcbmV4cG9ydCBjb25zdCB1cGRhdGVNb2NrSW50ZWdyYXRpb24gPSBpbnRlZ3JhdGlvblNlcnZpY2UudXBkYXRlTW9ja0ludGVncmF0aW9uO1xuZXhwb3J0IGNvbnN0IGRlbGV0ZU1vY2tJbnRlZ3JhdGlvbiA9IGludGVncmF0aW9uU2VydmljZS5kZWxldGVNb2NrSW50ZWdyYXRpb247XG5leHBvcnQgY29uc3QgZXhlY3V0ZU1vY2tRdWVyeSA9IGludGVncmF0aW9uU2VydmljZS5leGVjdXRlTW9ja1F1ZXJ5O1xuXG5leHBvcnQgZGVmYXVsdCBpbnRlZ3JhdGlvblNlcnZpY2U7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTk2QzZcdTRFMkRcdTVCRkNcdTUxRkFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0QVBJIE1vY2tcdTY3MERcdTUyQTFcdTUxNjVcdTUzRTNcdTcwQjlcbiAqL1xuXG4vLyBcdTVCRkNcdTUxNjVcdTY1NzBcdTYzNkVcdTZFOTBcdTY3MERcdTUyQTFcbmltcG9ydCBkYXRhU291cmNlIGZyb20gJy4vZGF0YXNvdXJjZSc7XG4vLyBcdTVCRkNcdTUxNjVcdTVCOENcdTY1NzRcdTc2ODRcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFcdTVCOUVcdTczQjBcbmltcG9ydCBxdWVyeVNlcnZpY2VJbXBsZW1lbnRhdGlvbiBmcm9tICcuL3F1ZXJ5Jztcbi8vIFx1NUJGQ1x1NTE2NVx1OTZDNlx1NjIxMFx1NjcwRFx1NTJBMVxuaW1wb3J0IGludGVncmF0aW9uU2VydmljZUltcGxlbWVudGF0aW9uIGZyb20gJy4vaW50ZWdyYXRpb24nO1xuXG4vLyBcdTVCRkNcdTUxNjVcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbmltcG9ydCB7IFxuICBjcmVhdGVNb2NrUmVzcG9uc2UsIFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSwgXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXkgXG59IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMU1vY2tcbiAqIEBkZXByZWNhdGVkIFx1NEY3Rlx1NzUyOFx1NEVDRSAnLi9xdWVyeScgXHU1QkZDXHU1MTY1XHU3Njg0XHU1QjhDXHU2NTc0XHU1QjlFXHU3M0IwXHU0RUUzXHU2NkZGXG4gKi9cbmNvbnN0IHF1ZXJ5ID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyaWVzKHBhcmFtczogeyBwYWdlOiBudW1iZXI7IHNpemU6IG51bWJlcjsgfSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSh7XG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGlkOiAncTEnLCBuYW1lOiAnXHU3NTI4XHU2MjM3XHU1MjA2XHU2NzkwXHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTU3MzBcdTUzM0FcdTdFREZcdThCQTFcdTc1MjhcdTYyMzdcdTZDRThcdTUxOENcdTY1NzBcdTYzNkUnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTInLCBuYW1lOiAnXHU5NTAwXHU1NTJFXHU0RTFBXHU3RUU5XHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTY3MDhcdTdFREZcdThCQTFcdTk1MDBcdTU1MkVcdTk4OUQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTMnLCBuYW1lOiAnXHU1RTkzXHU1QjU4XHU1MjA2XHU2NzkwJywgZGVzY3JpcHRpb246ICdcdTc2RDFcdTYzQTdcdTVFOTNcdTVCNThcdTZDMzRcdTVFNzMnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgXSxcbiAgICAgIHRvdGFsOiAzLFxuICAgICAgcGFnZTogcGFyYW1zLnBhZ2UsXG4gICAgICBzaXplOiBwYXJhbXMuc2l6ZVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5KGlkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6ICdcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgc3FsOiAnU0VMRUNUICogRlJPTSB1c2VycyBXSEVSRSBzdGF0dXMgPSAkMScsXG4gICAgICBwYXJhbWV0ZXJzOiBbJ2FjdGl2ZSddLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnkoZGF0YTogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBxdWVyeS0ke0RhdGUubm93KCl9YCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyB1cGRhdGVRdWVyeShpZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlUXVlcnkoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnM6IFsnaWQnLCAnbmFtZScsICdlbWFpbCcsICdzdGF0dXMnXSxcbiAgICAgIHJvd3M6IFtcbiAgICAgICAgeyBpZDogMSwgbmFtZTogJ1x1NUYyMFx1NEUwOScsIGVtYWlsOiAnemhhbmdAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIG5hbWU6ICdcdTY3NEVcdTU2REInLCBlbWFpbDogJ2xpQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICAgICAgICB7IGlkOiAzLCBuYW1lOiAnXHU3MzhCXHU0RTk0JywgZW1haWw6ICd3YW5nQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnaW5hY3RpdmUnIH0sXG4gICAgICBdLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgZXhlY3V0aW9uVGltZTogMC4yMzUsXG4gICAgICAgIHJvd0NvdW50OiAzLFxuICAgICAgICB0b3RhbFBhZ2VzOiAxXG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcblxuLyoqXG4gKiBcdTVCRkNcdTUxRkFcdTYyNDBcdTY3MDlcdTY3MERcdTUyQTFcbiAqL1xuY29uc3Qgc2VydmljZXMgPSB7XG4gIGRhdGFTb3VyY2UsXG4gIHF1ZXJ5OiBxdWVyeVNlcnZpY2VJbXBsZW1lbnRhdGlvbixcbiAgaW50ZWdyYXRpb246IGludGVncmF0aW9uU2VydmljZUltcGxlbWVudGF0aW9uXG59O1xuXG4vLyBcdTVCRkNcdTUxRkFtb2NrIHNlcnZpY2VcdTVERTVcdTUxNzdcbmV4cG9ydCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NTQwNFx1NEUyQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGNvbnN0IGRhdGFTb3VyY2VTZXJ2aWNlID0gc2VydmljZXMuZGF0YVNvdXJjZTtcbmV4cG9ydCBjb25zdCBxdWVyeVNlcnZpY2UgPSBzZXJ2aWNlcy5xdWVyeTtcbmV4cG9ydCBjb25zdCBpbnRlZ3JhdGlvblNlcnZpY2UgPSBzZXJ2aWNlcy5pbnRlZ3JhdGlvbjtcblxuLy8gXHU5RUQ4XHU4QkE0XHU1QkZDXHU1MUZBXHU2MjQwXHU2NzA5XHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCBzZXJ2aWNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZS50c1wiO2ltcG9ydCB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCAqIGFzIGh0dHAgZnJvbSAnaHR0cCc7XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU0RTAwXHU0RTJBXHU3QjgwXHU1MzU1XHU3Njg0XHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XG4gKiBcdTUzRUFcdTU5MDRcdTc0MDYvYXBpL3Rlc3RcdThERUZcdTVGODRcdUZGMENcdTc1MjhcdTRFOEVcdTZENEJcdThCRDVNb2NrXHU3Q0ZCXHU3RURGXHU2NjJGXHU1NDI2XHU2QjYzXHU1RTM4XHU1REU1XHU0RjVDXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlKCkge1xuICBjb25zb2xlLmxvZygnW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1REYyXHU1MjFCXHU1RUZBXHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU1QzA2XHU1OTA0XHU3NDA2L2FwaS90ZXN0XHU4REVGXHU1Rjg0XHU3Njg0XHU4QkY3XHU2QzQyJyk7XG4gIFxuICByZXR1cm4gZnVuY3Rpb24gc2ltcGxlTWlkZGxld2FyZShcbiAgICByZXE6IGh0dHAuSW5jb21pbmdNZXNzYWdlLFxuICAgIHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSxcbiAgICBuZXh0OiBDb25uZWN0Lk5leHRGdW5jdGlvblxuICApIHtcbiAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2QgfHwgJ1VOS05PV04nO1xuICAgIFxuICAgIC8vIFx1NTNFQVx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFxuICAgIGlmICh1cmwgPT09ICcvYXBpL3Rlc3QnKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU2NTM2XHU1MjMwXHU2RDRCXHU4QkQ1XHU4QkY3XHU2QzQyOiAke21ldGhvZH0gJHt1cmx9YCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFx1OEJCRVx1N0Y2RUNPUlNcdTU5MzRcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uJyk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmIChtZXRob2QgPT09ICdPUFRJT05TJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyJyk7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU3ODZFXHU0RkREXHU4OTg2XHU3NkQ2XHU2Mzg5XHU2MjQwXHU2NzA5XHU1REYyXHU2NzA5XHU3Njg0Q29udGVudC1UeXBlXHVGRjBDXHU5MDdGXHU1MTREXHU4OEFCXHU1NDBFXHU3RUVEXHU0RTJEXHU5NUY0XHU0RUY2XHU2NkY0XHU2NTM5XG4gICAgICAgIHJlcy5yZW1vdmVIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTFDNlx1NTkwN1x1NTRDRFx1NUU5NFx1NjU3MFx1NjM2RVxuICAgICAgICBjb25zdCByZXNwb25zZURhdGEgPSB7XG4gICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiAnXHU3QjgwXHU1MzU1XHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XHU1NENEXHU1RTk0XHU2MjEwXHU1MjlGJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMsXG4gICAgICAgICAgICBwYXJhbXM6IHVybC5pbmNsdWRlcygnPycpID8gdXJsLnNwbGl0KCc/JylbMV0gOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1M0QxXHU5MDAxXHU1NENEXHU1RTk0XHU1MjREXHU3ODZFXHU0RkREXHU0RTJEXHU2NUFEXHU4QkY3XHU2QzQyXHU5NEZFXG4gICAgICAgIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTUzRDFcdTkwMDFcdTZENEJcdThCRDVcdTU0Q0RcdTVFOTQnKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwb25zZURhdGEsIG51bGwsIDIpKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NEUwRFx1OEMwM1x1NzUyOG5leHQoKVx1RkYwQ1x1Nzg2RVx1NEZERFx1OEJGN1x1NkM0Mlx1NTIzMFx1NkI2NFx1N0VEM1x1Njc1RlxuICAgICAgICByZXR1cm47XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTk1MTlcdThCRUZcbiAgICAgICAgY29uc29sZS5lcnJvcignW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU2NUY2XHU1MUZBXHU5NTE5OicsIGVycm9yKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NkUwNVx1OTY2NFx1NURGMlx1NjcwOVx1NzY4NFx1NTkzNFx1RkYwQ1x1OTA3Rlx1NTE0RENvbnRlbnQtVHlwZVx1ODhBQlx1NjZGNFx1NjUzOVxuICAgICAgICByZXMucmVtb3ZlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTY1RjZcdTUxRkFcdTk1MTknLFxuICAgICAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcilcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU0RTBEXHU4QzAzXHU3NTI4bmV4dCgpXHVGRjBDXHU3ODZFXHU0RkREXHU4QkY3XHU2QzQyXHU1MjMwXHU2QjY0XHU3RUQzXHU2NzVGXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU0RTBEXHU1OTA0XHU3NDA2XHU3Njg0XHU4QkY3XHU2QzQyXHU0RUE0XHU3RUQ5XHU0RTBCXHU0RTAwXHU0RTJBXHU0RTJE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LFFBQ04sWUFBWTtBQUFBLE1BQ2Q7QUFBQTtBQUFBLE1BRUEsT0FBTyxDQUFDO0FBQUEsSUFDVjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1AsU0FBUyxDQUFDLGFBQWEsWUFBWTtBQUFBLE1BQ3JDO0FBQUEsTUFDQSxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixtQkFBbUI7QUFBQSxRQUNyQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxlQUFlO0FBQUEsUUFDakI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBO0FBQUEsTUFFWixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsU0FBUztBQUFBO0FBQUEsUUFFUDtBQUFBO0FBQUEsUUFFQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsT0FBTztBQUFBLElBQ1Q7QUFBQTtBQUFBLElBRUEsVUFBVTtBQUFBO0FBQUEsSUFFVixTQUFTO0FBQUEsTUFDUCxhQUFhO0FBQUEsUUFDWCw0QkFBNEI7QUFBQSxNQUM5QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsiZGVsYXkiLCAic2ltdWxhdGVEZWxheSIsICJxdWVyeV9kZWZhdWx0IiwgInNpbXVsYXRlRGVsYXkiLCAicXVlcnlfZGVmYXVsdCIsICJxdWVyeVNlcnZpY2UiLCAiaW50ZWdyYXRpb25TZXJ2aWNlIiwgImRlbGF5IiwgInF1ZXJ5U2VydmljZSIsICJtb2NrUXVlcmllcyJdCn0K
