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
  if (urlPath.match(/^\/api\/queries\/versions\/[^\/]+\/publish$/) && method === "POST") {
    const versionId = urlPath.split("/")[4];
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, \u7248\u672CID: ${versionId}`);
    try {
      const result = await queryService2.publishQueryVersion(versionId);
      sendJsonResponse(res, 200, {
        data: result,
        success: true,
        message: "\u67E5\u8BE2\u7248\u672C\u53D1\u5E03\u6210\u529F"
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u53D1\u5E03\u67E5\u8BE2\u7248\u672C\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions\/[^\/]+\/activate$/) && method === "POST") {
    const urlParts = urlPath.split("/");
    const queryId = urlParts[3];
    const versionId = urlParts[5];
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, \u67E5\u8BE2ID: ${queryId}, \u7248\u672CID: ${versionId}`);
    try {
      const result = await queryService2.activateQueryVersion(queryId, versionId);
      sendJsonResponse(res, 200, {
        data: result,
        success: true,
        message: "\u67E5\u8BE2\u7248\u672C\u6FC0\u6D3B\u6210\u529F"
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u6FC0\u6D3B\u67E5\u8BE2\u7248\u672C\u5931\u8D25",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svZGF0YS9xdWVyeS50cyIsICJ2aXRlLmNvbmZpZy50cyIsICJzcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzIiwgInNyYy9tb2NrL2NvbmZpZy50cyIsICJzcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHMiLCAic3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy91dGlscy50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9xdWVyeS50cyIsICJzcmMvbW9jay9kYXRhL2ludGVncmF0aW9uLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2ludGVncmF0aW9uLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzIiwgInNyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL3F1ZXJ5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL3F1ZXJ5LnRzXCI7LyoqXG4gKiBcdTY3RTVcdThCRTJcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczXHU3Njg0XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBRdWVyeSB9IGZyb20gJ0AvdHlwZXMvcXVlcnknO1xuXG4vLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbmV4cG9ydCBjb25zdCBtb2NrUXVlcmllczogUXVlcnlbXSA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiB7XG4gIGNvbnN0IGlkID0gYHF1ZXJ5LSR7aSArIDF9YDtcbiAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKTtcbiAgXG4gIHJldHVybiB7XG4gICAgaWQsXG4gICAgbmFtZTogYFx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfWAsXG4gICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX0gXHU3Njg0XHU2M0NGXHU4RkYwYCxcbiAgICBmb2xkZXJJZDogaSAlIDMgPT09IDAgPyAnZm9sZGVyLTEnIDogKGkgJSAzID09PSAxID8gJ2ZvbGRlci0yJyA6ICdmb2xkZXItMycpLFxuICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICBkYXRhU291cmNlTmFtZTogYFx1NjU3MFx1NjM2RVx1NkU5MCAkeyhpICUgNSkgKyAxfWAsXG4gICAgcXVlcnlUeXBlOiBpICUgMiA9PT0gMCA/ICdTUUwnIDogJ05BVFVSQUxfTEFOR1VBR0UnLFxuICAgIHF1ZXJ5VGV4dDogaSAlIDIgPT09IDAgPyBcbiAgICAgIGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgIDogXG4gICAgICBgXHU2N0U1XHU2MjdFXHU2NzAwXHU4RkQxMTBcdTY3NjEke2kgJSAyID09PSAwID8gJ1x1OEJBMlx1NTM1NScgOiAnXHU3NTI4XHU2MjM3J31cdThCQjBcdTVGNTVgLFxuICAgIHN0YXR1czogaSAlIDQgPT09IDAgPyAnRFJBRlQnIDogKGkgJSA0ID09PSAxID8gJ1BVQkxJU0hFRCcgOiAoaSAlIDQgPT09IDIgPyAnREVQUkVDQVRFRCcgOiAnQVJDSElWRUQnKSksXG4gICAgc2VydmljZVN0YXR1czogaSAlIDIgPT09IDAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgdXBkYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgIGV4ZWN1dGlvbkNvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCksXG4gICAgaXNGYXZvcml0ZTogaSAlIDMgPT09IDAsXG4gICAgaXNBY3RpdmU6IGkgJSA1ICE9PSAwLFxuICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMCkudG9JU09TdHJpbmcoKSxcbiAgICByZXN1bHRDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgIGV4ZWN1dGlvblRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkgKyAxMCxcbiAgICB0YWdzOiBbYFx1NjgwN1x1N0I3RSR7aSsxfWAsIGBcdTdDN0JcdTU3OEIke2kgJSAzfWBdLFxuICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfSxcbiAgICB2ZXJzaW9uczogW3tcbiAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgcXVlcnlJZDogaWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9XVxuICB9O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1vY2tRdWVyaWVzOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCBQbHVnaW4sIENvbm5lY3QgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuaW1wb3J0IHsgY3JlYXRlU2ltcGxlTWlkZGxld2FyZSB9IGZyb20gJy4vc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgeyBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gJ2h0dHAnXG5cbi8vIFx1NUYzQVx1NTIzNlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFM1x1NTFGRFx1NjU3MFxuZnVuY3Rpb24ga2lsbFBvcnQocG9ydDogbnVtYmVyKSB7XG4gIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2OEMwXHU2N0U1XHU3QUVGXHU1M0UzICR7cG9ydH0gXHU1MzYwXHU3NTI4XHU2MEM1XHU1MUI1YCk7XG4gIHRyeSB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgIGV4ZWNTeW5jKGBuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9YCk7XG4gICAgICBleGVjU3luYyhgdGFza2tpbGwgL0YgL3BpZCAkKG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH0gfCBhd2sgJ3twcmludCAkNX0nKWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhlY1N5bmMoYGxzb2YgLWkgOiR7cG9ydH0gLXQgfCB4YXJncyBraWxsIC05YCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NURGMlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFMyAke3BvcnR9YCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NjcyQVx1ODhBQlx1NTM2MFx1NzUyOFx1NjIxNlx1NjVFMFx1NkNENVx1OTFDQVx1NjUzRWApO1xuICB9XG59XG5cbi8vIFx1NUYzQVx1NTIzNlx1NkUwNVx1NzQwNlZpdGVcdTdGMTNcdTVCNThcbmZ1bmN0aW9uIGNsZWFuVml0ZUNhY2hlKCkge1xuICBjb25zb2xlLmxvZygnW1ZpdGVdIFx1NkUwNVx1NzQwNlx1NEY5RFx1OEQ1Nlx1N0YxM1x1NUI1OCcpO1xuICBjb25zdCBjYWNoZVBhdGhzID0gW1xuICAgICcuL25vZGVfbW9kdWxlcy8udml0ZScsXG4gICAgJy4vbm9kZV9tb2R1bGVzLy52aXRlXyonLFxuICAgICcuLy52aXRlJyxcbiAgICAnLi9kaXN0JyxcbiAgICAnLi90bXAnLFxuICAgICcuLy50ZW1wJ1xuICBdO1xuICBcbiAgY2FjaGVQYXRocy5mb3JFYWNoKGNhY2hlUGF0aCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGNhY2hlUGF0aCkpIHtcbiAgICAgICAgaWYgKGZzLmxzdGF0U3luYyhjYWNoZVBhdGgpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBleGVjU3luYyhgcm0gLXJmICR7Y2FjaGVQYXRofWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLnVubGlua1N5bmMoY2FjaGVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NURGMlx1NTIyMFx1OTY2NDogJHtjYWNoZVBhdGh9YCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTY1RTBcdTZDRDVcdTUyMjBcdTk2NjQ6ICR7Y2FjaGVQYXRofWAsIGUpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIFx1NkUwNVx1NzQwNlZpdGVcdTdGMTNcdTVCNThcbmNsZWFuVml0ZUNhY2hlKCk7XG5cbi8vIFx1NUMxRFx1OEJENVx1OTFDQVx1NjUzRVx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1N0FFRlx1NTNFM1xua2lsbFBvcnQoODA4MCk7XG5cbi8vIFx1NTIxQlx1NUVGQU1vY2sgQVBJXHU2M0QyXHU0RUY2XG5mdW5jdGlvbiBjcmVhdGVNb2NrQXBpUGx1Z2luKHVzZU1vY2s6IGJvb2xlYW4sIHVzZVNpbXBsZU1vY2s6IGJvb2xlYW4pOiBQbHVnaW4gfCBudWxsIHtcbiAgaWYgKCF1c2VNb2NrICYmICF1c2VTaW1wbGVNb2NrKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgXG4gIC8vIFx1NTJBMFx1OEY3RFx1NEUyRFx1OTVGNFx1NEVGNlxuICBjb25zdCBtb2NrTWlkZGxld2FyZSA9IHVzZU1vY2sgPyBjcmVhdGVNb2NrTWlkZGxld2FyZSgpIDogbnVsbDtcbiAgY29uc3Qgc2ltcGxlTWlkZGxld2FyZSA9IHVzZVNpbXBsZU1vY2sgPyBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlKCkgOiBudWxsO1xuICBcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZS1wbHVnaW4tbW9jay1hcGknLFxuICAgIC8vIFx1NTE3M1x1OTUyRVx1NzBCOVx1RkYxQVx1NEY3Rlx1NzUyOCBwcmUgXHU3ODZFXHU0RkREXHU2QjY0XHU2M0QyXHU0RUY2XHU1MTQ4XHU0RThFXHU1MTg1XHU3RjZFXHU2M0QyXHU0RUY2XHU2MjY3XHU4ODRDXG4gICAgZW5mb3JjZTogJ3ByZScgYXMgY29uc3QsXG4gICAgLy8gXHU1NzI4XHU2NzBEXHU1MkExXHU1NjY4XHU1MjFCXHU1RUZBXHU0RTRCXHU1MjREXHU5MTREXHU3RjZFXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgLy8gXHU2NkZGXHU2MzYyXHU1MzlGXHU1OUNCXHU4QkY3XHU2QzQyXHU1OTA0XHU3NDA2XHU1NjY4XHVGRjBDXHU0RjdGXHU2MjExXHU0RUVDXHU3Njg0XHU0RTJEXHU5NUY0XHU0RUY2XHU1MTc3XHU2NzA5XHU2NzAwXHU5QUQ4XHU0RjE4XHU1MTQ4XHU3RUE3XG4gICAgICBjb25zdCBvcmlnaW5hbEhhbmRsZXIgPSBzZXJ2ZXIubWlkZGxld2FyZXMuaGFuZGxlO1xuICAgICAgXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMuaGFuZGxlID0gZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTNFQVx1NTkwNFx1NzQwNkFQSVx1OEJGN1x1NkM0MlxuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJy9hcGkvJykpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTYzRDJcdTRFRjZdIFx1NjhDMFx1NkQ0Qlx1NTIzMEFQSVx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3VybH1gKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTRGMThcdTUxNDhcdTU5MDRcdTc0MDZcdTcyNzlcdTVCOUFcdTZENEJcdThCRDVBUElcbiAgICAgICAgICBpZiAodXNlU2ltcGxlTW9jayAmJiBzaW1wbGVNaWRkbGV3YXJlICYmIHVybC5zdGFydHNXaXRoKCcvYXBpL3Rlc3QnKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTRGN0ZcdTc1MjhcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDY6ICR7dXJsfWApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdThCQkVcdTdGNkVcdTRFMDBcdTRFMkFcdTY4MDdcdThCQjBcdUZGMENcdTk2MzJcdTZCNjJcdTUxNzZcdTRFRDZcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTZCNjRcdThCRjdcdTZDNDJcbiAgICAgICAgICAgIChyZXEgYXMgYW55KS5fbW9ja0hhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gc2ltcGxlTWlkZGxld2FyZShyZXEsIHJlcywgKGVycj86IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU1MUZBXHU5NTE5OmAsIGVycik7XG4gICAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEocmVzIGFzIFNlcnZlclJlc3BvbnNlKS53cml0YWJsZUVuZGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NENEXHU1RTk0XHU2Q0ExXHU2NzA5XHU3RUQzXHU2NzVGXHVGRjBDXHU3RUU3XHU3RUVEXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU1OTA0XHU3NDA2XHU1MTc2XHU0RUQ2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgICAgaWYgKHVzZU1vY2sgJiYgbW9ja01pZGRsZXdhcmUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU0RjdGXHU3NTI4TW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNjogJHt1cmx9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFx1OEJCRVx1N0Y2RVx1NEUwMFx1NEUyQVx1NjgwN1x1OEJCMFx1RkYwQ1x1OTYzMlx1NkI2Mlx1NTE3Nlx1NEVENlx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgKHJlcSBhcyBhbnkpLl9tb2NrSGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBtb2NrTWlkZGxld2FyZShyZXEsIHJlcywgKGVycj86IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbTW9ja1x1NjNEMlx1NEVGNl0gTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NTFGQVx1OTUxOTpgLCBlcnIpO1xuICAgICAgICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghKHJlcyBhcyBTZXJ2ZXJSZXNwb25zZSkud3JpdGFibGVFbmRlZCkge1xuICAgICAgICAgICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NTRDRFx1NUU5NFx1NkNBMVx1NjcwOVx1N0VEM1x1Njc1Rlx1RkYwQ1x1N0VFN1x1N0VFRFx1NTkwNFx1NzQwNlxuICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBcdTVCRjlcdTRFOEVcdTk3NUVBUElcdThCRjdcdTZDNDJcdUZGMENcdTRGN0ZcdTc1MjhcdTUzOUZcdTU5Q0JcdTU5MDRcdTc0MDZcdTU2NjhcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsSGFuZGxlci5jYWxsKHNlcnZlci5taWRkbGV3YXJlcywgcmVxLCByZXMsIG5leHQpO1xuICAgICAgfTtcbiAgICB9XG4gIH07XG59XG5cbi8vIFx1NTdGQVx1NjcyQ1x1OTE0RFx1N0Y2RVxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAvLyBcdTUyQTBcdThGN0RcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcbiAgcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPSBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSB8fCAnZmFsc2UnO1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2sgQVBJIC0gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU4QkZCXHU1M0Q2XG4gIGNvbnN0IHVzZU1vY2tBcGkgPSBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU3OTgxXHU3NTI4SE1SIC0gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU4QkZCXHU1M0Q2XG4gIGNvbnN0IGRpc2FibGVIbXIgPSBwcm9jZXNzLmVudi5WSVRFX0RJU0FCTEVfSE1SID09PSAndHJ1ZSc7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTRGN0ZcdTc1MjhcdTdCODBcdTUzNTVcdTZENEJcdThCRDVcdTZBMjFcdTYyREZBUElcbiAgY29uc3QgdXNlU2ltcGxlTW9jayA9IHRydWU7XG4gIFxuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIFx1OEZEMFx1ODg0Q1x1NkEyMVx1NUYwRjogJHttb2RlfWApO1xuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIE1vY2sgQVBJOiAke3VzZU1vY2tBcGkgPyAnXHU1NDJGXHU3NTI4JyA6ICdcdTc5ODFcdTc1MjgnfWApO1xuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIFx1N0I4MFx1NTM1NU1vY2tcdTZENEJcdThCRDU6ICR7dXNlU2ltcGxlTW9jayA/ICdcdTU0MkZcdTc1MjgnIDogJ1x1Nzk4MVx1NzUyOCd9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gSE1SOiAke2Rpc2FibGVIbXIgPyAnXHU3OTgxXHU3NTI4JyA6ICdcdTU0MkZcdTc1MjgnfWApO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBTW9ja1x1NjNEMlx1NEVGNlxuICBjb25zdCBtb2NrUGx1Z2luID0gY3JlYXRlTW9ja0FwaVBsdWdpbih1c2VNb2NrQXBpLCB1c2VTaW1wbGVNb2NrKTtcbiAgXG4gIC8vIFx1OTE0RFx1N0Y2RVxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIC8vIFx1NkRGQlx1NTJBME1vY2tcdTYzRDJcdTRFRjZcdUZGMDhcdTU5ODJcdTY3OUNcdTU0MkZcdTc1MjhcdUZGMDlcbiAgICAgIC4uLihtb2NrUGx1Z2luID8gW21vY2tQbHVnaW5dIDogW10pLFxuICAgICAgdnVlKCksXG4gICAgXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IDgwODAsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICBvcGVuOiBmYWxzZSxcbiAgICAgIC8vIEhNUlx1OTE0RFx1N0Y2RVxuICAgICAgaG1yOiBkaXNhYmxlSG1yID8gZmFsc2UgOiB7XG4gICAgICAgIHByb3RvY29sOiAnd3MnLFxuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgICAgY2xpZW50UG9ydDogODA4MCxcbiAgICAgIH0sXG4gICAgICAvLyBcdTc5ODFcdTc1MjhcdTRFRTNcdTc0MDZcdUZGMENcdThCQTlcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTYyNDBcdTY3MDlcdThCRjdcdTZDNDJcbiAgICAgIHByb3h5OiB7fVxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIGxlc3M6IHtcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICAgIHRhcmdldDogJ2VzMjAxNScsXG4gICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgLy8gXHU1MzA1XHU1NDJCXHU1N0ZBXHU2NzJDXHU0RjlEXHU4RDU2XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgICd2dWUnLCBcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAncGluaWEnLFxuICAgICAgICAnYXhpb3MnLFxuICAgICAgICAnZGF5anMnLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUnLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL3poX0NOJ1xuICAgICAgXSxcbiAgICAgIC8vIFx1NjM5Mlx1OTY2NFx1NzI3OVx1NUI5QVx1NEY5RFx1OEQ1NlxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAvLyBcdTYzOTJcdTk2NjRcdTYzRDJcdTRFRjZcdTRFMkRcdTc2ODRcdTY3MERcdTUyQTFcdTU2NjhNb2NrXG4gICAgICAgICdzcmMvcGx1Z2lucy9zZXJ2ZXJNb2NrLnRzJyxcbiAgICAgICAgLy8gXHU2MzkyXHU5NjY0ZnNldmVudHNcdTY3MkNcdTU3MzBcdTZBMjFcdTU3NTdcdUZGMENcdTkwN0ZcdTUxNERcdTY3ODRcdTVFRkFcdTk1MTlcdThCRUZcbiAgICAgICAgJ2ZzZXZlbnRzJ1xuICAgICAgXSxcbiAgICAgIC8vIFx1Nzg2RVx1NEZERFx1NEY5RFx1OEQ1Nlx1OTg4NFx1Njc4NFx1NUVGQVx1NkI2M1x1Nzg2RVx1NUI4Q1x1NjIxMFxuICAgICAgZm9yY2U6IHRydWUsXG4gICAgfSxcbiAgICAvLyBcdTRGN0ZcdTc1MjhcdTUzNTVcdTcyRUNcdTc2ODRcdTdGMTNcdTVCNThcdTc2RUVcdTVGNTVcbiAgICBjYWNoZURpcjogJ25vZGVfbW9kdWxlcy8udml0ZV9jYWNoZScsXG4gICAgLy8gXHU5NjMyXHU2QjYyXHU1ODA2XHU2ODA4XHU2RUEyXHU1MUZBXG4gICAgZXNidWlsZDoge1xuICAgICAgbG9nT3ZlcnJpZGU6IHtcbiAgICAgICAgJ3RoaXMtaXMtdW5kZWZpbmVkLWluLWVzbSc6ICdzaWxlbnQnXG4gICAgICB9LFxuICAgIH1cbiAgfVxufSk7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTdCQTFcdTc0MDZcdTZBMjFcdTU3NTdcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0SFRUUFx1OEJGN1x1NkM0Mlx1NjJFNlx1NjIyQVx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFxuICogXHU4RDFGXHU4RDIzXHU3QkExXHU3NDA2XHU1NDhDXHU1MjA2XHU1M0QxXHU2MjQwXHU2NzA5QVBJXHU4QkY3XHU2QzQyXHU1MjMwXHU1QkY5XHU1RTk0XHU3Njg0XHU2NzBEXHU1MkExXHU1OTA0XHU3NDA2XHU1MUZEXHU2NTcwXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnLCBzaG91bGRNb2NrUmVxdWVzdCwgbG9nTW9jayB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NUJGQ1x1NTE2NVx1NjcwRFx1NTJBMVxuaW1wb3J0IHsgZGF0YVNvdXJjZVNlcnZpY2UsIHF1ZXJ5U2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzJztcbmltcG9ydCBpbnRlZ3JhdGlvblNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvaW50ZWdyYXRpb24nO1xuXG4vLyBcdTU5MDRcdTc0MDZDT1JTXHU4QkY3XHU2QzQyXG5mdW5jdGlvbiBoYW5kbGVDb3JzKHJlczogU2VydmVyUmVzcG9uc2UpIHtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uLCBYLU1vY2stRW5hYmxlZCcpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1NYXgtQWdlJywgJzg2NDAwJyk7XG59XG5cbi8vIFx1NTNEMVx1OTAwMUpTT05cdTU0Q0RcdTVFOTRcbmZ1bmN0aW9uIHNlbmRKc29uUmVzcG9uc2UocmVzOiBTZXJ2ZXJSZXNwb25zZSwgc3RhdHVzOiBudW1iZXIsIGRhdGE6IGFueSkge1xuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbi8vIFx1NUVGNlx1OEZERlx1NjI2N1x1ODg0Q1xuZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8vIFx1ODlFM1x1Njc5MFx1OEJGN1x1NkM0Mlx1NEY1M1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VSZXF1ZXN0Qm9keShyZXE6IEluY29taW5nTWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBib2R5ID0gJyc7XG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rKSA9PiB7XG4gICAgICBib2R5ICs9IGNodW5rLnRvU3RyaW5nKCk7XG4gICAgfSk7XG4gICAgcmVxLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlKGJvZHkgPyBKU09OLnBhcnNlKGJvZHkpIDoge30pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1NjU3MFx1NjM2RVx1NkU5MEFQSVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY3MERcdTUyQTFcdTVDNDJcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcdUZGMENcdTY1MkZcdTYzMDFcdTUyMDZcdTk4NzVcdTU0OENcdThGQzdcdTZFRTRcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmdldERhdGFTb3VyY2VzKHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQodXJsUXVlcnkucGFnZSBhcyBzdHJpbmcpIHx8IDEsXG4gICAgICAgIHNpemU6IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMCxcbiAgICAgICAgbmFtZTogdXJsUXVlcnkubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgIHR5cGU6IHVybFF1ZXJ5LnR5cGUgYXMgc3RyaW5nLFxuICAgICAgICBzdGF0dXM6IHVybFF1ZXJ5LnN0YXR1cyBhcyBzdHJpbmdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiByZXN1bHQuaXRlbXMsIFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGFzb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5nZXREYXRhU291cmNlKGlkKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IGRhdGFzb3VyY2UsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2UgXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgbmV3RGF0YVNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmNyZWF0ZURhdGFTb3VyY2UoYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDEsIHtcbiAgICAgICAgZGF0YTogbmV3RGF0YVNvdXJjZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBVVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YVNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLnVwZGF0ZURhdGFTb3VyY2UoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHVwZGF0ZWREYXRhU291cmNlLFxuICAgICAgICBtZXNzYWdlOiAnXHU2NTcwXHU2MzZFXHU2RTkwXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2RhdGFzb3VyY2VzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2REVMRVRFXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuZGVsZXRlRGF0YVNvdXJjZShpZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzL3Rlc3QtY29ubmVjdGlvbicgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL2RhdGFzb3VyY2VzL3Rlc3QtY29ubmVjdGlvbmApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UudGVzdENvbm5lY3Rpb24oYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NkQ0Qlx1OEJENVx1OEZERVx1NjNBNVx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY3RTVcdThCRTJBUElcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVF1ZXJpZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU2OEMwXHU2N0U1VVJMXHU2NjJGXHU1NDI2XHU1MzM5XHU5MTREXHU2N0U1XHU4QkUyQVBJXG4gIGNvbnN0IGlzUXVlcmllc1BhdGggPSB1cmxQYXRoLmluY2x1ZGVzKCcvcXVlcmllcycpO1xuICBcbiAgLy8gXHU2MjUzXHU1MzcwXHU2MjQwXHU2NzA5XHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczXHU4QkY3XHU2QzQyXHU0RUU1XHU0RkJGXHU4QzAzXHU4QkQ1XG4gIGlmIChpc1F1ZXJpZXNQYXRoKSB7XG4gICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTY4QzBcdTZENEJcdTUyMzBcdTY3RTVcdThCRTJBUElcdThCRjdcdTZDNDI6ICR7bWV0aG9kfSAke3VybFBhdGh9YCwgdXJsUXVlcnkpO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6IC9hcGkvcXVlcmllc2ApO1xuICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU1OTA0XHU3NDA2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU4QkY3XHU2QzQyLCBcdTUzQzJcdTY1NzA6JywgdXJsUXVlcnkpO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY3MERcdTUyQTFcdTVDNDJcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdUZGMENcdTY1MkZcdTYzMDFcdTUyMDZcdTk4NzVcdTU0OENcdThGQzdcdTZFRTRcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5nZXRRdWVyaWVzKHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQodXJsUXVlcnkucGFnZSBhcyBzdHJpbmcpIHx8IDEsXG4gICAgICAgIHNpemU6IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMCxcbiAgICAgICAgbmFtZTogdXJsUXVlcnkubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogdXJsUXVlcnkuZGF0YVNvdXJjZUlkIGFzIHN0cmluZyxcbiAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nLFxuICAgICAgICBxdWVyeVR5cGU6IHVybFF1ZXJ5LnF1ZXJ5VHlwZSBhcyBzdHJpbmcsXG4gICAgICAgIGlzRmF2b3JpdGU6IHVybFF1ZXJ5LmlzRmF2b3JpdGUgPT09ICd0cnVlJ1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU3RUQzXHU2NzlDOicsIHtcbiAgICAgICAgaXRlbXNDb3VudDogcmVzdWx0Lml0ZW1zLmxlbmd0aCxcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb25cbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1OEZENFx1NTZERVx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1NjU3MFx1NjM2RVx1NjgzQ1x1NUYwRjonLCB7IFxuICAgICAgICBkYXRhOiBgQXJyYXlbJHtyZXN1bHQuaXRlbXMubGVuZ3RofV1gLCBcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICAvLyBcdTY4QzBcdTY3RTVyZXN1bHQuaXRlbXNcdTY2MkZcdTU0MjZcdTUzMDVcdTU0MkJcdTY1NzBcdTYzNkVcdUZGMENcdTU5ODJcdTY3OUNcdTRFM0FcdTdBN0FcdTUyMTlcdTRFQ0VcdTVCRkNcdTUxNjVcdTc2ODRcdTZBMjFcdTU3NTdcdTRFMkRcdTgzQjdcdTUzRDZcbiAgICAgIGlmIChyZXN1bHQuaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gXHU0RjdGXHU3NTI4XHU1MkE4XHU2MDAxXHU1QkZDXHU1MTY1XHU2NUI5XHU1RjBGXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXHVGRjBDXHU5MDdGXHU1MTREXHU1RkFBXHU3M0FGXHU0RjlEXHU4RDU2XG4gICAgICAgICAgY29uc3QgbW9ja1F1ZXJ5RGF0YSA9IGF3YWl0IGltcG9ydCgnLi4vZGF0YS9xdWVyeScpO1xuICAgICAgICAgIGNvbnN0IG1vY2tRdWVyaWVzID0gbW9ja1F1ZXJ5RGF0YS5tb2NrUXVlcmllcyB8fCBbXTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAobW9ja1F1ZXJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTRFM0FcdTdBN0FcdUZGMENcdTRGN0ZcdTc1MjhcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkU6JywgbW9ja1F1ZXJpZXMubGVuZ3RoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxO1xuICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMDtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgICAgICAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIG1vY2tRdWVyaWVzLmxlbmd0aCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gbW9ja1F1ZXJpZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgICAgICAgICBjb25zdCBwYWdpbmF0aW9uID0ge1xuICAgICAgICAgICAgICB0b3RhbDogbW9ja1F1ZXJpZXMubGVuZ3RoLFxuICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICBzaXplLFxuICAgICAgICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwobW9ja1F1ZXJpZXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgICAgICAgZGF0YTogcGFnaW5hdGVkSXRlbXMsXG4gICAgICAgICAgICAgIHBhZ2luYXRpb24sXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrXSBcdTVCRkNcdTUxNjVcdTY3RTVcdThCRTJcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0Lml0ZW1zLFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrXSBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDUwMCwge1xuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJ5KGlkKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcXVlcnksXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2N0U1XHU4QkUyXHU0RTBEXHU1QjU4XHU1NzI4JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9xdWVyaWVzYCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCBuZXdRdWVyeSA9IGF3YWl0IHF1ZXJ5U2VydmljZS5jcmVhdGVRdWVyeShib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMSwge1xuICAgICAgICBkYXRhOiBuZXdRdWVyeSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UFVUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHVwZGF0ZWRRdWVyeSA9IGF3YWl0IHF1ZXJ5U2VydmljZS51cGRhdGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogdXBkYXRlZFF1ZXJ5LFxuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvZXhlY3V0ZSQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdOyAvLyBcdTYzRDBcdTUzRDZJRDogL2FwaS9xdWVyaWVzL3tpZH0vZXhlY3V0ZVxuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmV4ZWN1dGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC92ZXJzaW9ucyQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IHF1ZXJ5SWQgPSB1cmxQYXRoLnNwbGl0KCcvJylbM107IC8vIFx1NjNEMFx1NTNENlx1NjdFNVx1OEJFMklEOiAvYXBpL3F1ZXJpZXMve2lkfS92ZXJzaW9uc1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIFx1NjdFNVx1OEJFMklEOiAke3F1ZXJ5SWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UuY3JlYXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RidcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTUyMTdcdTg4NjhcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL3ZlcnNpb25zJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBxdWVyeUlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdOyAvLyBcdTYzRDBcdTUzRDZcdTY3RTVcdThCRTJJRDogL2FwaS9xdWVyaWVzL3tpZH0vdmVyc2lvbnNcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIFx1NjdFNVx1OEJFMklEOiAke3F1ZXJ5SWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHZlcnNpb25zID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJ5VmVyc2lvbnMocXVlcnlJZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogdmVyc2lvbnMsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUzRDFcdTVFMDNcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvdmVyc2lvbnNcXC9bXlxcL10rXFwvcHVibGlzaCQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IHZlcnNpb25JZCA9IHVybFBhdGguc3BsaXQoJy8nKVs0XTsgLy8gXHU2M0QwXHU1M0Q2XHU3MjQ4XHU2NzJDSUQ6IC9hcGkvcXVlcmllcy92ZXJzaW9ucy97aWR9L3B1Ymxpc2hcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBcdTcyNDhcdTY3MkNJRDogJHt2ZXJzaW9uSWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5wdWJsaXNoUXVlcnlWZXJzaW9uKHZlcnNpb25JZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1M0QxXHU1RTAzXHU2MjEwXHU1MjlGJ1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTUzRDFcdTVFMDNcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NkZDMFx1NkQzQlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvdmVyc2lvbnNcXC9bXlxcL10rXFwvYWN0aXZhdGUkLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCB1cmxQYXJ0cyA9IHVybFBhdGguc3BsaXQoJy8nKTtcbiAgICBjb25zdCBxdWVyeUlkID0gdXJsUGFydHNbM107IC8vIFx1NjNEMFx1NTNENlx1NjdFNVx1OEJFMklEOiAvYXBpL3F1ZXJpZXMve3F1ZXJ5SWR9L3ZlcnNpb25zL3t2ZXJzaW9uSWR9L2FjdGl2YXRlXG4gICAgY29uc3QgdmVyc2lvbklkID0gdXJsUGFydHNbNV07IC8vIFx1NjNEMFx1NTNENlx1NzI0OFx1NjcyQ0lEXG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgXHU2N0U1XHU4QkUySUQ6ICR7cXVlcnlJZH0sIFx1NzI0OFx1NjcyQ0lEOiAke3ZlcnNpb25JZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmFjdGl2YXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQsIHZlcnNpb25JZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU2RkMwXHU2RDNCXHU2MjEwXHU1MjlGJ1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTZGQzBcdTZEM0JcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gXHU1OTA0XHU3NDA2XHU5NkM2XHU2MjEwQVBJXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVJbnRlZ3JhdGlvbkFwaShyZXE6IEluY29taW5nTWVzc2FnZSwgcmVzOiBTZXJ2ZXJSZXNwb25zZSwgdXJsUGF0aDogc3RyaW5nLCB1cmxRdWVyeTogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2Q/LnRvVXBwZXJDYXNlKCk7XG4gIFxuICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTY2MkZcdTk2QzZcdTYyMTBBUElcdThERUZcdTVGODQgLSBcdTk3MDBcdTg5ODFcdTkwN0ZcdTUxNERcdTRFMEVcdTY1RTdcdTc2ODRcdTYyRTZcdTYyMkFcdTU2NjhcdTUxQjJcdTdBODFcdTc2ODRcdThERUZcdTVGODRcbiAgaWYgKHVybFBhdGguaW5jbHVkZXMoJy9hcGkvbG93LWNvZGUvYXBpcycpKSB7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY4QzBcdTZENEJcdTUyMzBcdTk2QzZcdTYyMTBBUElcdThCRjdcdTZDNDIsIFx1NzUzMVx1NjVFN1x1NjJFNlx1NjIyQVx1NTY2OFx1NTkwNFx1NzQwNjonLCBtZXRob2QsIHVybFBhdGgpO1xuICAgIC8vIFx1NzZGNFx1NjNBNVx1OEZENFx1NTZERXRydWVcdUZGMENcdTg4NjhcdTc5M0FcdTZCNjRcdThCRjdcdTZDNDJcdTVERjJcdTg4QUJcdTU5MDRcdTc0MDZcdUZGMDhcdTVCOUVcdTk2NDVcdTRFMEFcdTY2MkZcdTRFQTRcdTdFRDlcdTY1RTdcdTYyRTZcdTYyMkFcdTU2NjhcdTU5MDRcdTc0MDZcdUZGMDlcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQU1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcbiAqIEByZXR1cm5zIFZpdGVcdTRFMkRcdTk1RjRcdTRFRjZcdTUxRkRcdTY1NzBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCk6IENvbm5lY3QuTmV4dEhhbmRsZUZ1bmN0aW9uIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIG1vY2tNaWRkbGV3YXJlKHJlcTogQ29ubmVjdC5JbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIG5leHQ6IENvbm5lY3QuTmV4dEZ1bmN0aW9uKSB7XG4gICAgLy8gXHU1OTgyXHU2NzlDXHU2NzJBXHU1NDJGXHU3NTI4TW9ja1x1NjIxNlx1OEJGN1x1NkM0Mlx1NEUwRFx1OTAwMlx1NTQwOE1vY2tcdUZGMENcdTc2RjRcdTYzQTVcdTRGMjBcdTkwMTJcdTdFRDlcdTRFMEJcdTRFMDBcdTRFMkFcdTRFMkRcdTk1RjRcdTRFRjZcbiAgICBpZiAoIXNob3VsZE1vY2tSZXF1ZXN0KHJlcSkpIHtcbiAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHVybCA9IHBhcnNlKHJlcS51cmwgfHwgJycsIHRydWUpO1xuICAgIGNvbnN0IHVybFBhdGggPSB1cmwucGF0aG5hbWUgfHwgJyc7XG4gICAgY29uc3QgdXJsUXVlcnkgPSB1cmwucXVlcnkgfHwge307XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU2NTM2XHU1MjMwXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsUGF0aH1gKTtcbiAgICBcbiAgICAvLyBcdTU5MDRcdTc0MDZPUFRJT05TXHU4QkY3XHU2QzQyXG4gICAgaWYgKHJlcS5tZXRob2Q/LnRvVXBwZXJDYXNlKCkgPT09ICdPUFRJT05TJykge1xuICAgICAgaGFuZGxlQ29ycyhyZXMpO1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NEUzQVx1NjI0MFx1NjcwOVx1NTRDRFx1NUU5NFx1NkRGQlx1NTJBMENPUlNcdTU5MzRcbiAgICBoYW5kbGVDb3JzKHJlcyk7XG4gICAgXG4gICAgLy8gXHU2QTIxXHU2MkRGXHU3RjUxXHU3RURDXHU1RUY2XHU4RkRGXG4gICAgaWYgKG1vY2tDb25maWcuZGVsYXkgPiAwKSB7XG4gICAgICBhd2FpdCBkZWxheShtb2NrQ29uZmlnLmRlbGF5KTtcbiAgICB9XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1NjMwOUFQSVx1N0M3Qlx1NTc4Qlx1NTIwNlx1NTNEMVx1NTkwNFx1NzQwNlxuICAgICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcbiAgICAgIFxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU2NjJGXHU5NkM2XHU2MjEwQVBJIC0gXHU0RjE4XHU1MTQ4XHU1OTA0XHU3NDA2XHU0RUU1XHU5MDdGXHU1MTREXHU1MUIyXHU3QTgxXG4gICAgICBpZiAodXJsUGF0aC5pbmNsdWRlcygnL2xvdy1jb2RlL2FwaXMnKSkge1xuICAgICAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NjhDMFx1NkQ0Qlx1NTIzMFx1OTZDNlx1NjIxMEFQSVx1OEJGN1x1NkM0MjonLCByZXEubWV0aG9kLCB1cmxQYXRoLCB1cmxRdWVyeSk7XG4gICAgICAgIGhhbmRsZWQgPSBhd2FpdCBoYW5kbGVJbnRlZ3JhdGlvbkFwaShyZXEsIHJlcywgdXJsUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgICBpZiAoaGFuZGxlZCkgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTY2MkZcdTY1NzBcdTYzNkVcdTZFOTBBUElcbiAgICAgIGlmICh1cmxQYXRoLmluY2x1ZGVzKCcvZGF0YXNvdXJjZXMnKSkge1xuICAgICAgICBoYW5kbGVkID0gYXdhaXQgaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxLCByZXMsIHVybFBhdGgsIHVybFF1ZXJ5KTtcbiAgICAgICAgaWYgKGhhbmRsZWQpIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU2NjJGXHU2N0U1XHU4QkUyQVBJXG4gICAgICBpZiAodXJsUGF0aC5pbmNsdWRlcygnL3F1ZXJpZXMnKSkge1xuICAgICAgICBoYW5kbGVkID0gYXdhaXQgaGFuZGxlUXVlcmllc0FwaShyZXEsIHJlcywgdXJsUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgICBpZiAoaGFuZGxlZCkgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTZDQTFcdTY3MDlcdTg4QUJcdTU5MDRcdTc0MDZcdUZGMENcdTUyMTlcdThGRDRcdTU2REU0MDRcbiAgICAgIGlmICghaGFuZGxlZCkge1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgICAgZXJyb3I6ICdcdTY3MkFcdTYyN0VcdTUyMzBcdThCRjdcdTZDNDJcdTc2ODRBUEknLFxuICAgICAgICAgIG1lc3NhZ2U6IGBcdTY3MkFcdTYyN0VcdTUyMzBcdThERUZcdTVGODQ6ICR7dXJsUGF0aH1gLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBcdTU5MDRcdTc0MDZcdTYyNDBcdTY3MDlcdTY3MkFcdTYzNTVcdTgzQjdcdTc2ODRcdTk1MTlcdThCRUZcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrXSBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTY1RjZcdTUzRDFcdTc1MUZcdTk1MTlcdThCRUY6JywgZXJyb3IpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDUwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1OTUxOVx1OEJFRicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTW9ja01pZGRsZXdhcmU7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcbiAqIFxuICogXHU2M0E3XHU1MjM2TW9ja1x1NjcwRFx1NTJBMVx1NzY4NFx1NTQyRlx1NzUyOC9cdTc5ODFcdTc1MjhcdTcyQjZcdTYwMDFcdTMwMDFcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkJcdTdCNDlcbiAqL1xuXG4vLyBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTYyMTZcdTUxNjhcdTVDNDBcdThCQkVcdTdGNkVcdTRFMkRcdTgzQjdcdTUzRDZcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG5leHBvcnQgZnVuY3Rpb24gaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIC8vIFx1NTcyOE5vZGUuanNcdTczQUZcdTU4ODNcdTRFMkRcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52KSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTcyOFx1NkQ0Rlx1ODlDOFx1NTY2OFx1NzNBRlx1NTg4M1x1NEUyRFxuICAgIGlmICh0eXBlb2YgaW1wb3J0Lm1ldGEgIT09ICd1bmRlZmluZWQnICYmIGltcG9ydC5tZXRhLmVudikge1xuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjhDMFx1NjdFNWxvY2FsU3RvcmFnZSAoXHU0RUM1XHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzKVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICBjb25zdCBsb2NhbFN0b3JhZ2VWYWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdVU0VfTU9DS19BUEknKTtcbiAgICAgIGlmIChsb2NhbFN0b3JhZ2VWYWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGxvY2FsU3RvcmFnZVZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU5RUQ4XHU4QkE0XHU2MEM1XHU1MUI1XHVGRjFBXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBCXHU1NDJGXHU3NTI4XHVGRjBDXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU3OTgxXHU3NTI4XG4gICAgY29uc3QgaXNEZXZlbG9wbWVudCA9IFxuICAgICAgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudiAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgfHxcbiAgICAgICh0eXBlb2YgaW1wb3J0Lm1ldGEgIT09ICd1bmRlZmluZWQnICYmIGltcG9ydC5tZXRhLmVudiAmJiBpbXBvcnQubWV0YS5lbnYuREVWID09PSB0cnVlKTtcbiAgICBcbiAgICByZXR1cm4gaXNEZXZlbG9wbWVudDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBcdTUxRkFcdTk1MTlcdTY1RjZcdTc2ODRcdTVCODlcdTUxNjhcdTU2REVcdTkwMDBcbiAgICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdTY4QzBcdTY3RTVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTUxRkFcdTk1MTlcdUZGMENcdTlFRDhcdThCQTRcdTc5ODFcdTc1MjhNb2NrXHU2NzBEXHU1MkExJywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBcdTU0MTFcdTU0MEVcdTUxN0NcdTVCQjlcdTY1RTdcdTRFRTNcdTc4MDFcdTc2ODRcdTUxRkRcdTY1NzBcbmV4cG9ydCBmdW5jdGlvbiBpc01vY2tFbmFibGVkKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNFbmFibGVkKCk7XG59XG5cbi8vIE1vY2tcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcbmV4cG9ydCBjb25zdCBtb2NrQ29uZmlnID0ge1xuICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIGVuYWJsZWQ6IGlzRW5hYmxlZCgpLFxuICBcbiAgLy8gXHU4QkY3XHU2QzQyXHU1RUY2XHU4RkRGXHVGRjA4XHU2QkVCXHU3OUQyXHVGRjA5XG4gIGRlbGF5OiAzMDAsXG4gIFxuICAvLyBBUElcdTU3RkFcdTc4NDBcdThERUZcdTVGODRcdUZGMENcdTc1MjhcdTRFOEVcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTk3MDBcdTg5ODFcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbiAgYXBpQmFzZVBhdGg6ICcvYXBpJyxcbiAgXG4gIC8vIFx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQjogJ25vbmUnLCAnZXJyb3InLCAnaW5mbycsICdkZWJ1ZydcbiAgbG9nTGV2ZWw6ICdkZWJ1ZycsXG4gIFxuICAvLyBcdTU0MkZcdTc1MjhcdTc2ODRcdTZBMjFcdTU3NTdcbiAgbW9kdWxlczoge1xuICAgIGRhdGFzb3VyY2VzOiB0cnVlLFxuICAgIHF1ZXJpZXM6IHRydWUsXG4gICAgdXNlcnM6IHRydWUsXG4gICAgdmlzdWFsaXphdGlvbnM6IHRydWVcbiAgfVxufTtcblxuLy8gXHU1MjI0XHU2NUFEXHU2NjJGXHU1NDI2XHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkTW9ja1JlcXVlc3QocmVxOiBhbnkpOiBib29sZWFuIHtcbiAgLy8gXHU1RkM1XHU5ODdCXHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICBpZiAoIW1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2VVJMXHVGRjBDXHU3ODZFXHU0RkREdXJsXHU2NjJGXHU1QjU3XHU3QjI2XHU0RTMyXG4gIGNvbnN0IHVybCA9IHJlcT8udXJsIHx8ICcnO1xuICBpZiAodHlwZW9mIHVybCAhPT0gJ3N0cmluZycpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTW9ja10gXHU2NTM2XHU1MjMwXHU5NzVFXHU1QjU3XHU3QjI2XHU0RTMyVVJMOicsIHVybCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdTVGQzVcdTk4N0JcdTY2MkZBUElcdThCRjdcdTZDNDJcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aChtb2NrQ29uZmlnLmFwaUJhc2VQYXRoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU4REVGXHU1Rjg0XHU2OEMwXHU2N0U1XHU5MDFBXHU4RkM3XHVGRjBDXHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBcdThCQjBcdTVGNTVcdTY1RTVcdTVGRDdcbmV4cG9ydCBmdW5jdGlvbiBsb2dNb2NrKGxldmVsOiAnZXJyb3InIHwgJ2luZm8nIHwgJ2RlYnVnJywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgY29uc3QgeyBsb2dMZXZlbCB9ID0gbW9ja0NvbmZpZztcbiAgXG4gIGlmIChsb2dMZXZlbCA9PT0gJ25vbmUnKSByZXR1cm47XG4gIFxuICBpZiAobGV2ZWwgPT09ICdlcnJvcicgJiYgWydlcnJvcicsICdpbmZvJywgJ2RlYnVnJ10uaW5jbHVkZXMobG9nTGV2ZWwpKSB7XG4gICAgY29uc29sZS5lcnJvcignW01vY2sgRVJST1JdJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdpbmZvJyAmJiBbJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmluZm8oJ1tNb2NrIElORk9dJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdkZWJ1ZycgJiYgbG9nTGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2sgREVCVUddJywgLi4uYXJncyk7XG4gIH1cbn1cblxuLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHU2NUY2XHU4RjkzXHU1MUZBTW9ja1x1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMVxudHJ5IHtcbiAgY29uc29sZS5sb2coYFtNb2NrXSBcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDE6ICR7bW9ja0NvbmZpZy5lbmFibGVkID8gJ1x1NURGMlx1NTQyRlx1NzUyOCcgOiAnXHU1REYyXHU3OTgxXHU3NTI4J31gKTtcbiAgaWYgKG1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU5MTREXHU3RjZFOmAsIHtcbiAgICAgIGRlbGF5OiBtb2NrQ29uZmlnLmRlbGF5LFxuICAgICAgYXBpQmFzZVBhdGg6IG1vY2tDb25maWcuYXBpQmFzZVBhdGgsXG4gICAgICBsb2dMZXZlbDogbW9ja0NvbmZpZy5sb2dMZXZlbCxcbiAgICAgIGVuYWJsZWRNb2R1bGVzOiBPYmplY3QuZW50cmllcyhtb2NrQ29uZmlnLm1vZHVsZXMpXG4gICAgICAgIC5maWx0ZXIoKFtfLCBlbmFibGVkXSkgPT4gZW5hYmxlZClcbiAgICAgICAgLm1hcCgoW25hbWVdKSA9PiBuYW1lKVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdThGOTNcdTUxRkFcdTkxNERcdTdGNkVcdTRGRTFcdTYwNkZcdTUxRkFcdTk1MTknLCBlcnJvcik7XG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzXCI7LyoqXG4gKiBcdTY1NzBcdTYzNkVcdTZFOTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2NTcwXHU2MzZFXHU2RTkwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHVGRjBDXHU3NTI4XHU0RThFXHU1RjAwXHU1M0QxXHU1NDhDXHU2RDRCXHU4QkQ1XG4gKi9cblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU3QzdCXHU1NzhCXG5leHBvcnQgdHlwZSBEYXRhU291cmNlVHlwZSA9ICdteXNxbCcgfCAncG9zdGdyZXNxbCcgfCAnb3JhY2xlJyB8ICdzcWxzZXJ2ZXInIHwgJ3NxbGl0ZSc7XG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NzJCNlx1NjAwMVxuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZVN0YXR1cyA9ICdhY3RpdmUnIHwgJ2luYWN0aXZlJyB8ICdlcnJvcicgfCAncGVuZGluZyc7XG5cbi8vIFx1NTQwQ1x1NkI2NVx1OTg5MVx1NzM4N1xuZXhwb3J0IHR5cGUgU3luY0ZyZXF1ZW5jeSA9ICdtYW51YWwnIHwgJ2hvdXJseScgfCAnZGFpbHknIHwgJ3dlZWtseScgfCAnbW9udGhseSc7XG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjNBNVx1NTNFM1xuZXhwb3J0IGludGVyZmFjZSBEYXRhU291cmNlIHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgdHlwZTogRGF0YVNvdXJjZVR5cGU7XG4gIGhvc3Q/OiBzdHJpbmc7XG4gIHBvcnQ/OiBudW1iZXI7XG4gIGRhdGFiYXNlTmFtZT86IHN0cmluZztcbiAgdXNlcm5hbWU/OiBzdHJpbmc7XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xuICBzdGF0dXM6IERhdGFTb3VyY2VTdGF0dXM7XG4gIHN5bmNGcmVxdWVuY3k/OiBTeW5jRnJlcXVlbmN5O1xuICBsYXN0U3luY1RpbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjcmVhdGVkQXQ6IHN0cmluZztcbiAgdXBkYXRlZEF0OiBzdHJpbmc7XG4gIGlzQWN0aXZlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICovXG5leHBvcnQgY29uc3QgbW9ja0RhdGFTb3VyY2VzOiBEYXRhU291cmNlW10gPSBbXG4gIHtcbiAgICBpZDogJ2RzLTEnLFxuICAgIG5hbWU6ICdNeVNRTFx1NzkzQVx1NEY4Qlx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTc5M0FcdTRGOEJNeVNRTFx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ215c3FsJyxcbiAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICBwb3J0OiAzMzA2LFxuICAgIGRhdGFiYXNlTmFtZTogJ2V4YW1wbGVfZGInLFxuICAgIHVzZXJuYW1lOiAndXNlcicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTInLFxuICAgIG5hbWU6ICdQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFBvc3RncmVTUUxcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdwb3N0Z3Jlc3FsJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjEwMCcsXG4gICAgcG9ydDogNTQzMixcbiAgICBkYXRhYmFzZU5hbWU6ICdwcm9kdWN0aW9uX2RiJyxcbiAgICB1c2VybmFtZTogJ2FkbWluJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdob3VybHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNzc3NjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMycsXG4gICAgbmFtZTogJ1NRTGl0ZVx1NjcyQ1x1NTczMFx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY3MkNcdTU3MzBTUUxpdGVcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdzcWxpdGUnLFxuICAgIGRhdGFiYXNlTmFtZTogJy9wYXRoL3RvL2xvY2FsLmRiJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdtYW51YWwnLFxuICAgIGxhc3RTeW5jVGltZTogbnVsbCxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM0NTYwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy00JyxcbiAgICBuYW1lOiAnU1FMIFNlcnZlclx1NkQ0Qlx1OEJENVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU3M0FGXHU1ODgzJyxcbiAgICB0eXBlOiAnc3Fsc2VydmVyJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjIwMCcsXG4gICAgcG9ydDogMTQzMyxcbiAgICBkYXRhYmFzZU5hbWU6ICd0ZXN0X2RiJyxcbiAgICB1c2VybmFtZTogJ3Rlc3RlcicsXG4gICAgc3RhdHVzOiAnaW5hY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICd3ZWVrbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDYwNDgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA1MTg0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IGZhbHNlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTUnLFxuICAgIG5hbWU6ICdPcmFjbGVcdTRGMDFcdTRFMUFcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwT3JhY2xlXHU0RjAxXHU0RTFBXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnb3JhY2xlJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjE1MCcsXG4gICAgcG9ydDogMTUyMSxcbiAgICBkYXRhYmFzZU5hbWU6ICdlbnRlcnByaXNlX2RiJyxcbiAgICB1c2VybmFtZTogJ3N5c3RlbScsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxMDM2ODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH1cbl07XG5cbi8qKlxuICogXHU3NTFGXHU2MjEwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gY291bnQgXHU3NTFGXHU2MjEwXHU2NTcwXHU5MUNGXG4gKiBAcmV0dXJucyBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTdFQzRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTW9ja0RhdGFTb3VyY2VzKGNvdW50OiBudW1iZXIgPSA1KTogRGF0YVNvdXJjZVtdIHtcbiAgY29uc3QgdHlwZXM6IERhdGFTb3VyY2VUeXBlW10gPSBbJ215c3FsJywgJ3Bvc3RncmVzcWwnLCAnb3JhY2xlJywgJ3NxbHNlcnZlcicsICdzcWxpdGUnXTtcbiAgY29uc3Qgc3RhdHVzZXM6IERhdGFTb3VyY2VTdGF0dXNbXSA9IFsnYWN0aXZlJywgJ2luYWN0aXZlJywgJ2Vycm9yJywgJ3BlbmRpbmcnXTtcbiAgY29uc3Qgc3luY0ZyZXFzOiBTeW5jRnJlcXVlbmN5W10gPSBbJ21hbnVhbCcsICdob3VybHknLCAnZGFpbHknLCAnd2Vla2x5JywgJ21vbnRobHknXTtcbiAgXG4gIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9LCAoXywgaSkgPT4ge1xuICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpICUgdHlwZXMubGVuZ3RoXTtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICBpZDogYGRzLWdlbi0ke2kgKyAxfWAsXG4gICAgICBuYW1lOiBgXHU3NTFGXHU2MjEwXHU3Njg0JHt0eXBlfVx1NjU3MFx1NjM2RVx1NkU5MCAke2kgKyAxfWAsXG4gICAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1NzY4NCR7dHlwZX1cdTdDN0JcdTU3OEJcdTY1NzBcdTYzNkVcdTZFOTAgJHtpICsgMX1gLFxuICAgICAgdHlwZSxcbiAgICAgIGhvc3Q6IHR5cGUgIT09ICdzcWxpdGUnID8gJ2xvY2FsaG9zdCcgOiB1bmRlZmluZWQsXG4gICAgICBwb3J0OiB0eXBlICE9PSAnc3FsaXRlJyA/ICgzMzA2ICsgaSkgOiB1bmRlZmluZWQsXG4gICAgICBkYXRhYmFzZU5hbWU6IHR5cGUgPT09ICdzcWxpdGUnID8gYC9wYXRoL3RvL2RiXyR7aX0uZGJgIDogYGV4YW1wbGVfZGJfJHtpfWAsXG4gICAgICB1c2VybmFtZTogdHlwZSAhPT0gJ3NxbGl0ZScgPyBgdXNlcl8ke2l9YCA6IHVuZGVmaW5lZCxcbiAgICAgIHN0YXR1czogc3RhdHVzZXNbaSAlIHN0YXR1c2VzLmxlbmd0aF0sXG4gICAgICBzeW5jRnJlcXVlbmN5OiBzeW5jRnJlcXNbaSAlIHN5bmNGcmVxcy5sZW5ndGhdLFxuICAgICAgbGFzdFN5bmNUaW1lOiBpICUgMyA9PT0gMCA/IG51bGwgOiBuZXcgRGF0ZShub3cgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKG5vdyAtIChpICsgMTApICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKG5vdyAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGlzQWN0aXZlOiBpICUgNCAhPT0gMFxuICAgIH07XG4gIH0pO1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTlFRDhcdThCQTRcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbmV4cG9ydCBkZWZhdWx0IG1vY2tEYXRhU291cmNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzXCI7LyoqXG4gKiBcdTY1NzBcdTYzNkVcdTZFOTBNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjU3MFx1NjM2RVx1NkU5MFx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IG1vY2tEYXRhU291cmNlcyB9IGZyb20gJy4uL2RhdGEvZGF0YXNvdXJjZSc7XG5pbXBvcnQgdHlwZSB7IERhdGFTb3VyY2UgfSBmcm9tICcuLi9kYXRhL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NEUzNFx1NjVGNlx1NUI1OFx1NTBBOFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1RkYwQ1x1NTE0MVx1OEJCOFx1NkEyMVx1NjJERlx1NTg5RVx1NTIyMFx1NjUzOVx1NjRDRFx1NEY1Q1xubGV0IGRhdGFTb3VyY2VzID0gWy4uLm1vY2tEYXRhU291cmNlc107XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNpbXVsYXRlRGVsYXkoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRlbGF5ID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xufVxuXG4vKipcbiAqIFx1OTFDRFx1N0Y2RVx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1NjM2RVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzZXREYXRhU291cmNlcygpOiB2b2lkIHtcbiAgZGF0YVNvdXJjZXMgPSBbLi4ubW9ja0RhdGFTb3VyY2VzXTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqIEBwYXJhbSBwYXJhbXMgXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwXG4gKiBAcmV0dXJucyBcdTUyMDZcdTk4NzVcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFTb3VyY2VzKHBhcmFtcz86IHtcbiAgcGFnZT86IG51bWJlcjtcbiAgc2l6ZT86IG51bWJlcjtcbiAgbmFtZT86IHN0cmluZztcbiAgdHlwZT86IHN0cmluZztcbiAgc3RhdHVzPzogc3RyaW5nO1xufSk6IFByb21pc2U8e1xuICBpdGVtczogRGF0YVNvdXJjZVtdO1xuICBwYWdpbmF0aW9uOiB7XG4gICAgdG90YWw6IG51bWJlcjtcbiAgICBwYWdlOiBudW1iZXI7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIHRvdGFsUGFnZXM6IG51bWJlcjtcbiAgfTtcbn0+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgXG4gIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICBsZXQgZmlsdGVyZWRJdGVtcyA9IFsuLi5kYXRhU291cmNlc107XG4gIFxuICAvLyBcdTYzMDlcdTU0MERcdTc5RjBcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgIGNvbnN0IGtleXdvcmQgPSBwYXJhbXMubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBcbiAgICAgIGRzLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgIChkcy5kZXNjcmlwdGlvbiAmJiBkcy5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICk7XG4gIH1cbiAgXG4gIC8vIFx1NjMwOVx1N0M3Qlx1NTc4Qlx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy50eXBlKSB7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IGRzLnR5cGUgPT09IHBhcmFtcy50eXBlKTtcbiAgfVxuICBcbiAgLy8gXHU2MzA5XHU3MkI2XHU2MDAxXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBkcy5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICB9XG4gIFxuICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5zbGljZShzdGFydCwgZW5kKTtcbiAgXG4gIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICByZXR1cm4ge1xuICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0b3RhbDogZmlsdGVyZWRJdGVtcy5sZW5ndGgsXG4gICAgICBwYWdlLFxuICAgICAgc2l6ZSxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmaWx0ZXJlZEl0ZW1zLmxlbmd0aCAvIHNpemUpXG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKiBAcmV0dXJucyBcdTY1NzBcdTYzNkVcdTZFOTBcdThCRTZcdTYwQzVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFTb3VyY2UoaWQ6IHN0cmluZyk6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2N0U1XHU2MjdFXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IGRhdGFTb3VyY2UgPSBkYXRhU291cmNlcy5maW5kKGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoIWRhdGFTb3VyY2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgcmV0dXJuIGRhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gZGF0YSBcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTYzNkVcbiAqIEByZXR1cm5zIFx1NTIxQlx1NUVGQVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlRGF0YVNvdXJjZShkYXRhOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBJRFxuICBjb25zdCBuZXdJZCA9IGBkcy0ke0RhdGUubm93KCl9YDtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCBuZXdEYXRhU291cmNlOiBEYXRhU291cmNlID0ge1xuICAgIGlkOiBuZXdJZCxcbiAgICBuYW1lOiBkYXRhLm5hbWUgfHwgJ05ldyBEYXRhIFNvdXJjZScsXG4gICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgdHlwZTogZGF0YS50eXBlIHx8ICdteXNxbCcsXG4gICAgaG9zdDogZGF0YS5ob3N0LFxuICAgIHBvcnQ6IGRhdGEucG9ydCxcbiAgICBkYXRhYmFzZU5hbWU6IGRhdGEuZGF0YWJhc2VOYW1lLFxuICAgIHVzZXJuYW1lOiBkYXRhLnVzZXJuYW1lLFxuICAgIHN0YXR1czogZGF0YS5zdGF0dXMgfHwgJ3BlbmRpbmcnLFxuICAgIHN5bmNGcmVxdWVuY3k6IGRhdGEuc3luY0ZyZXF1ZW5jeSB8fCAnbWFudWFsJyxcbiAgICBsYXN0U3luY1RpbWU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfTtcbiAgXG4gIC8vIFx1NkRGQlx1NTJBMFx1NTIzMFx1NTIxN1x1ODg2OFxuICBkYXRhU291cmNlcy5wdXNoKG5ld0RhdGFTb3VyY2UpO1xuICBcbiAgcmV0dXJuIG5ld0RhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqIEBwYXJhbSBkYXRhIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVxuICogQHJldHVybnMgXHU2NkY0XHU2NUIwXHU1NDBFXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVEYXRhU291cmNlKGlkOiBzdHJpbmcsIGRhdGE6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjI3RVx1NTIzMFx1ODk4MVx1NjZGNFx1NjVCMFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFx1N0QyMlx1NUYxNVxuICBjb25zdCBpbmRleCA9IGRhdGFTb3VyY2VzLmZpbmRJbmRleChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgdXBkYXRlZERhdGFTb3VyY2U6IERhdGFTb3VyY2UgPSB7XG4gICAgLi4uZGF0YVNvdXJjZXNbaW5kZXhdLFxuICAgIC4uLmRhdGEsXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgfTtcbiAgXG4gIC8vIFx1NjZGRlx1NjM2Mlx1NjU3MFx1NjM2RVx1NkU5MFxuICBkYXRhU291cmNlc1tpbmRleF0gPSB1cGRhdGVkRGF0YVNvdXJjZTtcbiAgXG4gIHJldHVybiB1cGRhdGVkRGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlRGF0YVNvdXJjZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTYyN0VcdTUyMzBcdTg5ODFcdTUyMjBcdTk2NjRcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcdTdEMjJcdTVGMTVcbiAgY29uc3QgaW5kZXggPSBkYXRhU291cmNlcy5maW5kSW5kZXgoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgLy8gXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGRhdGFTb3VyY2VzLnNwbGljZShpbmRleCwgMSk7XG59XG5cbi8qKlxuICogXHU2RDRCXHU4QkQ1XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkRFXHU2M0E1XG4gKiBAcGFyYW0gcGFyYW1zIFx1OEZERVx1NjNBNVx1NTNDMlx1NjU3MFxuICogQHJldHVybnMgXHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU3RUQzXHU2NzlDXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0Q29ubmVjdGlvbihwYXJhbXM6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPHtcbiAgc3VjY2VzczogYm9vbGVhbjtcbiAgbWVzc2FnZT86IHN0cmluZztcbiAgZGV0YWlscz86IGFueTtcbn0+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NUI5RVx1OTY0NVx1NEY3Rlx1NzUyOFx1NjVGNlx1NTNFRlx1ODBGRFx1NEYxQVx1NjcwOVx1NjZGNFx1NTkwRFx1Njc0Mlx1NzY4NFx1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1OTAzQlx1OEY5MVxuICAvLyBcdThGRDlcdTkxQ0NcdTdCODBcdTUzNTVcdTZBMjFcdTYyREZcdTYyMTBcdTUyOUYvXHU1OTMxXHU4RDI1XG4gIGNvbnN0IHN1Y2Nlc3MgPSBNYXRoLnJhbmRvbSgpID4gMC4yOyAvLyA4MCVcdTYyMTBcdTUyOUZcdTczODdcbiAgXG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBtZXNzYWdlOiBzdWNjZXNzID8gJ1x1OEZERVx1NjNBNVx1NjIxMFx1NTI5RicgOiAnXHU4RkRFXHU2M0E1XHU1OTMxXHU4RDI1OiBcdTY1RTBcdTZDRDVcdThGREVcdTYzQTVcdTUyMzBcdTY1NzBcdTYzNkVcdTVFOTNcdTY3MERcdTUyQTFcdTU2NjgnLFxuICAgIGRldGFpbHM6IHN1Y2Nlc3MgPyB7XG4gICAgICByZXNwb25zZVRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSArIDEwLFxuICAgICAgdmVyc2lvbjogJzguMC4yOCcsXG4gICAgICBjb25uZWN0aW9uSWQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKSArIDEwMDBcbiAgICB9IDoge1xuICAgICAgZXJyb3JDb2RlOiAnQ09OTkVDVElPTl9SRUZVU0VEJyxcbiAgICAgIGVycm9yRGV0YWlsczogJ1x1NjVFMFx1NkNENVx1NUVGQVx1N0FDQlx1NTIzMFx1NjcwRFx1NTJBMVx1NTY2OFx1NzY4NFx1OEZERVx1NjNBNVx1RkYwQ1x1OEJGN1x1NjhDMFx1NjdFNVx1N0Y1MVx1N0VEQ1x1OEJCRVx1N0Y2RVx1NTQ4Q1x1NTFFRFx1NjM2RSdcbiAgICB9XG4gIH07XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXREYXRhU291cmNlcyxcbiAgZ2V0RGF0YVNvdXJjZSxcbiAgY3JlYXRlRGF0YVNvdXJjZSxcbiAgdXBkYXRlRGF0YVNvdXJjZSxcbiAgZGVsZXRlRGF0YVNvdXJjZSxcbiAgdGVzdENvbm5lY3Rpb24sXG4gIHJlc2V0RGF0YVNvdXJjZXNcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvdXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5MDFBXHU3NTI4XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NTIxQlx1NUVGQVx1N0VERlx1NEUwMFx1NjgzQ1x1NUYwRlx1NTRDRFx1NUU5NFx1NzY4NFx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuICovXG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2QTIxXHU2MkRGQVBJXHU2MjEwXHU1MjlGXHU1NENEXHU1RTk0XG4gKiBAcGFyYW0gZGF0YSBcdTU0Q0RcdTVFOTRcdTY1NzBcdTYzNkVcbiAqIEBwYXJhbSBzdWNjZXNzIFx1NjIxMFx1NTI5Rlx1NzJCNlx1NjAwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQXRydWVcbiAqIEBwYXJhbSBtZXNzYWdlIFx1NTNFRlx1OTAwOVx1NkQ4OFx1NjA2RlxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHU3Njg0QVBJXHU1NENEXHU1RTk0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrUmVzcG9uc2U8VD4oXG4gIGRhdGE6IFQsIFxuICBzdWNjZXNzOiBib29sZWFuID0gdHJ1ZSwgXG4gIG1lc3NhZ2U/OiBzdHJpbmdcbikge1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3MsXG4gICAgZGF0YSxcbiAgICBtZXNzYWdlLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIG1vY2tSZXNwb25zZTogdHJ1ZSAvLyBcdTY4MDdcdThCQjBcdTRFM0FcdTZBMjFcdTYyREZcdTU0Q0RcdTVFOTRcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTZBMjFcdTYyREZBUElcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqIEBwYXJhbSBtZXNzYWdlIFx1OTUxOVx1OEJFRlx1NkQ4OFx1NjA2RlxuICogQHBhcmFtIGNvZGUgXHU5NTE5XHU4QkVGXHU0RUUzXHU3ODAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBJ01PQ0tfRVJST1InXG4gKiBAcGFyYW0gc3RhdHVzIEhUVFBcdTcyQjZcdTYwMDFcdTc4MDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0E1MDBcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NjgzQ1x1NUYwRlx1NzY4NFx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UoXG4gIG1lc3NhZ2U6IHN0cmluZywgXG4gIGNvZGU6IHN0cmluZyA9ICdNT0NLX0VSUk9SJywgXG4gIHN0YXR1czogbnVtYmVyID0gNTAwXG4pIHtcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICBlcnJvcjoge1xuICAgICAgbWVzc2FnZSxcbiAgICAgIGNvZGUsXG4gICAgICBzdGF0dXNDb2RlOiBzdGF0dXNcbiAgICB9LFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIG1vY2tSZXNwb25zZTogdHJ1ZVxuICB9O1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NFx1N0VEM1x1Njc4NFxuICogQHBhcmFtIGl0ZW1zIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzY4NFx1OTg3OVx1NzZFRVx1NTIxN1x1ODg2OFxuICogQHBhcmFtIHRvdGFsSXRlbXMgXHU2MDNCXHU5ODc5XHU3NkVFXHU2NTcwXG4gKiBAcGFyYW0gcGFnZSBcdTVGNTNcdTUyNERcdTk4NzVcdTc4MDFcbiAqIEBwYXJhbSBzaXplIFx1NkJDRlx1OTg3NVx1NTkyN1x1NUMwRlxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU1MjA2XHU5ODc1XHU1NENEXHU1RTk0XHU3RUQzXHU2Nzg0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2U8VD4oXG4gIGl0ZW1zOiBUW10sXG4gIHRvdGFsSXRlbXM6IG51bWJlcixcbiAgcGFnZTogbnVtYmVyID0gMSxcbiAgc2l6ZTogbnVtYmVyID0gMTBcbikge1xuICByZXR1cm4gY3JlYXRlTW9ja1Jlc3BvbnNlKHtcbiAgICBpdGVtcyxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0b3RhbDogdG90YWxJdGVtcyxcbiAgICAgIHBhZ2UsXG4gICAgICBzaXplLFxuICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsSXRlbXMgLyBzaXplKSxcbiAgICAgIGhhc01vcmU6IHBhZ2UgKiBzaXplIDwgdG90YWxJdGVtc1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XHU1RUY2XHU4RkRGXG4gKiBAcGFyYW0gbXMgXHU1RUY2XHU4RkRGXHU2QkVCXHU3OUQyXHU2NTcwXHVGRjBDXHU5RUQ4XHU4QkE0MzAwbXNcbiAqIEByZXR1cm5zIFByb21pc2VcdTVCRjlcdThDNjFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIgPSAzMDApOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvcXVlcnkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3F1ZXJ5LnRzXCI7LyoqXG4gKiBcdTY3RTVcdThCRTJNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjdFNVx1OEJFMlx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IGRlbGF5LCBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsIGNyZWF0ZU1vY2tSZXNwb25zZSwgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHsgbW9ja1F1ZXJpZXMgfSBmcm9tICcuLi9kYXRhL3F1ZXJ5JztcblxuLy8gXHU5MUNEXHU3RjZFXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRRdWVyaWVzKCk6IHZvaWQge1xuICAvLyBcdTRGRERcdTc1NTlcdTVGMTVcdTc1MjhcdUZGMENcdTUzRUFcdTkxQ0RcdTdGNkVcdTUxODVcdTVCQjlcbiAgd2hpbGUgKG1vY2tRdWVyaWVzLmxlbmd0aCA+IDApIHtcbiAgICBtb2NrUXVlcmllcy5wb3AoKTtcbiAgfVxuICBcbiAgLy8gXHU5MUNEXHU2NUIwXHU3NTFGXHU2MjEwXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXG4gIEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiB7XG4gICAgY29uc3QgaWQgPSBgcXVlcnktJHtpICsgMX1gO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgbW9ja1F1ZXJpZXMucHVzaCh7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6IGBcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX1gLFxuICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX0gXHU3Njg0XHU2M0NGXHU4RkYwYCxcbiAgICAgIGZvbGRlcklkOiBpICUgMyA9PT0gMCA/ICdmb2xkZXItMScgOiAoaSAlIDMgPT09IDEgPyAnZm9sZGVyLTInIDogJ2ZvbGRlci0zJyksXG4gICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICBkYXRhU291cmNlTmFtZTogYFx1NjU3MFx1NjM2RVx1NkU5MCAkeyhpICUgNSkgKyAxfWAsXG4gICAgICBxdWVyeVR5cGU6IGkgJSAyID09PSAwID8gJ1NRTCcgOiAnTkFUVVJBTF9MQU5HVUFHRScsXG4gICAgICBxdWVyeVRleHQ6IGkgJSAyID09PSAwID8gXG4gICAgICAgIGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgIDogXG4gICAgICAgIGBcdTY3RTVcdTYyN0VcdTY3MDBcdThGRDExMFx1Njc2MSR7aSAlIDIgPT09IDAgPyAnXHU4QkEyXHU1MzU1JyA6ICdcdTc1MjhcdTYyMzcnfVx1OEJCMFx1NUY1NWAsXG4gICAgICBzdGF0dXM6IGkgJSA0ID09PSAwID8gJ0RSQUZUJyA6IChpICUgNCA9PT0gMSA/ICdQVUJMSVNIRUQnIDogKGkgJSA0ID09PSAyID8gJ0RFUFJFQ0FURUQnIDogJ0FSQ0hJVkVEJykpLFxuICAgICAgc2VydmljZVN0YXR1czogaSAlIDIgPT09IDAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjcmVhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICB1cGRhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICBleGVjdXRpb25Db3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApLFxuICAgICAgaXNGYXZvcml0ZTogaSAlIDMgPT09IDAsXG4gICAgICBpc0FjdGl2ZTogaSAlIDUgIT09IDAsXG4gICAgICBsYXN0RXhlY3V0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICByZXN1bHRDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTAwKSArIDEwLFxuICAgICAgdGFnczogW2BcdTY4MDdcdTdCN0Uke2krMX1gLCBgXHU3QzdCXHU1NzhCJHtpICUgM31gXSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9LFxuICAgICAgdmVyc2lvbnM6IFt7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9XVxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXlUaW1lID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIGRlbGF5KGRlbGF5VGltZSk7XG59XG5cbi8qKlxuICogXHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IHF1ZXJ5U2VydmljZSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcmllcyhwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdThGQzdcdTZFRTRcbiAgICBsZXQgZmlsdGVyZWRJdGVtcyA9IFsuLi5tb2NrUXVlcmllc107XG4gICAgXG4gICAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBcbiAgICAgICAgcS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAgIChxLmRlc2NyaXB0aW9uICYmIHEuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NjU3MFx1NjM2RVx1NkU5MFx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LmRhdGFTb3VyY2VJZCkge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5kYXRhU291cmNlSWQgPT09IHBhcmFtcy5kYXRhU291cmNlSWQpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU3QzdCXHU1NzhCXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8ucXVlcnlUeXBlKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLnF1ZXJ5VHlwZSA9PT0gcGFyYW1zLnF1ZXJ5VHlwZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NjUzNlx1ODVDRlx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LmlzRmF2b3JpdGUpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEuaXNGYXZvcml0ZSA9PT0gdHJ1ZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjUzNlx1ODVDRlx1NzY4NFx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0RmF2b3JpdGVRdWVyaWVzKHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1OEZDN1x1NkVFNFx1NTFGQVx1NjUzNlx1ODVDRlx1NzY4NFx1NjdFNVx1OEJFMlxuICAgIGxldCBmYXZvcml0ZVF1ZXJpZXMgPSBtb2NrUXVlcmllcy5maWx0ZXIocSA9PiBxLmlzRmF2b3JpdGUgPT09IHRydWUpO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTE3Nlx1NEVENlx1OEZDN1x1NkVFNFx1Njc2MVx1NEVGNlxuICAgIGlmIChwYXJhbXM/Lm5hbWUgfHwgcGFyYW1zPy5zZWFyY2gpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSAocGFyYW1zLm5hbWUgfHwgcGFyYW1zLnNlYXJjaCB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZhdm9yaXRlUXVlcmllcyA9IGZhdm9yaXRlUXVlcmllcy5maWx0ZXIocSA9PiBcbiAgICAgICAgcS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAgIChxLmRlc2NyaXB0aW9uICYmIHEuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIGlmIChwYXJhbXM/LmRhdGFTb3VyY2VJZCkge1xuICAgICAgZmF2b3JpdGVRdWVyaWVzID0gZmF2b3JpdGVRdWVyaWVzLmZpbHRlcihxID0+IHEuZGF0YVNvdXJjZUlkID09PSBwYXJhbXMuZGF0YVNvdXJjZUlkKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgICBmYXZvcml0ZVF1ZXJpZXMgPSBmYXZvcml0ZVF1ZXJpZXMuZmlsdGVyKHEgPT4gcS5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmF2b3JpdGVRdWVyaWVzLmxlbmd0aCk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmYXZvcml0ZVF1ZXJpZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IGZhdm9yaXRlUXVlcmllcy5sZW5ndGgsXG4gICAgICAgIHBhZ2UsXG4gICAgICAgIHNpemUsXG4gICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmYXZvcml0ZVF1ZXJpZXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnkoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXMuZmluZChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHF1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnkoZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwSURcdUZGMENcdTY4M0NcdTVGMEZcdTRFMEVcdTczQjBcdTY3MDlJRFx1NEUwMFx1ODFGNFxuICAgIGNvbnN0IGlkID0gYHF1ZXJ5LSR7bW9ja1F1ZXJpZXMubGVuZ3RoICsgMX1gO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTY3RTVcdThCRTJcbiAgICBjb25zdCBuZXdRdWVyeSA9IHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogZGF0YS5uYW1lIHx8IGBcdTY1QjBcdTY3RTVcdThCRTIgJHtpZH1gLFxuICAgICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgICBmb2xkZXJJZDogZGF0YS5mb2xkZXJJZCB8fCBudWxsLFxuICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCxcbiAgICAgIGRhdGFTb3VyY2VOYW1lOiBkYXRhLmRhdGFTb3VyY2VOYW1lIHx8IGBcdTY1NzBcdTYzNkVcdTZFOTAgJHtkYXRhLmRhdGFTb3VyY2VJZH1gLFxuICAgICAgcXVlcnlUeXBlOiBkYXRhLnF1ZXJ5VHlwZSB8fCAnU1FMJyxcbiAgICAgIHF1ZXJ5VGV4dDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzIHx8ICdEUkFGVCcsXG4gICAgICBzZXJ2aWNlU3RhdHVzOiBkYXRhLnNlcnZpY2VTdGF0dXMgfHwgJ0RJU0FCTEVEJyxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICBjcmVhdGVkQnk6IGRhdGEuY3JlYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICB1cGRhdGVkQnk6IGRhdGEudXBkYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICBleGVjdXRpb25Db3VudDogMCxcbiAgICAgIGlzRmF2b3JpdGU6IGRhdGEuaXNGYXZvcml0ZSB8fCBmYWxzZSxcbiAgICAgIGlzQWN0aXZlOiBkYXRhLmlzQWN0aXZlIHx8IHRydWUsXG4gICAgICBsYXN0RXhlY3V0ZWRBdDogbnVsbCxcbiAgICAgIHJlc3VsdENvdW50OiAwLFxuICAgICAgZXhlY3V0aW9uVGltZTogMCxcbiAgICAgIHRhZ3M6IGRhdGEudGFncyB8fCBbXSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NTIxRFx1NTlDQlx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQsXG4gICAgICAgIHN0YXR1czogJ0RSQUZUJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9LFxuICAgICAgdmVyc2lvbnM6IFt7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NTIxRFx1NTlDQlx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQsXG4gICAgICAgIHN0YXR1czogJ0RSQUZUJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9XVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU1MjE3XHU4ODY4XG4gICAgbW9ja1F1ZXJpZXMucHVzaChuZXdRdWVyeSk7XG4gICAgXG4gICAgcmV0dXJuIG5ld1F1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgdXBkYXRlUXVlcnkoaWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU4OTgxXHU2NkY0XHU2NUIwXHU3Njg0XHU2N0U1XHU4QkUyXHU3RDIyXHU1RjE1XG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHVwZGF0ZWRRdWVyeSA9IHtcbiAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRCeTogZGF0YS51cGRhdGVkQnkgfHwgbW9ja1F1ZXJpZXNbaW5kZXhdLnVwZGF0ZWRCeSB8fCB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9XG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY2RkZcdTYzNjJcdTY3RTVcdThCRTJcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB1cGRhdGVkUXVlcnk7XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRRdWVyeTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGRlbGV0ZVF1ZXJ5KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU4OTgxXHU1MjIwXHU5NjY0XHU3Njg0XHU2N0U1XHU4QkUyXHU3RDIyXHU1RjE1XG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgIG1vY2tRdWVyaWVzLnNwbGljZShpbmRleCwgMSk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBleGVjdXRlUXVlcnkoaWQ6IHN0cmluZywgcGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTdFRDNcdTY3OUNcbiAgICBjb25zdCBjb2x1bW5zID0gWydpZCcsICduYW1lJywgJ2VtYWlsJywgJ3N0YXR1cycsICdjcmVhdGVkX2F0J107XG4gICAgY29uc3Qgcm93cyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiAoe1xuICAgICAgaWQ6IGkgKyAxLFxuICAgICAgbmFtZTogYFx1NzUyOFx1NjIzNyAke2kgKyAxfWAsXG4gICAgICBlbWFpbDogYHVzZXIke2kgKyAxfUBleGFtcGxlLmNvbWAsXG4gICAgICBzdGF0dXM6IGkgJSAyID09PSAwID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnLFxuICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKVxuICAgIH0pKTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTYyNjdcdTg4NENcdTdFREZcdThCQTFcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgICAgZXhlY3V0aW9uQ291bnQ6IChtb2NrUXVlcmllc1tpbmRleF0uZXhlY3V0aW9uQ291bnQgfHwgMCkgKyAxLFxuICAgICAgICBsYXN0RXhlY3V0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICByZXN1bHRDb3VudDogcm93cy5sZW5ndGhcbiAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBjb2x1bW5zLFxuICAgICAgcm93cyxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIGV4ZWN1dGlvblRpbWU6IE1hdGgucmFuZG9tKCkgKiAwLjUgKyAwLjEsXG4gICAgICAgIHJvd0NvdW50OiByb3dzLmxlbmd0aCxcbiAgICAgICAgdG90YWxQYWdlczogMVxuICAgICAgfSxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGlkOiBxdWVyeS5pZCxcbiAgICAgICAgbmFtZTogcXVlcnkubmFtZSxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBxdWVyeS5kYXRhU291cmNlSWRcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIwN1x1NjM2Mlx1NjdFNVx1OEJFMlx1NjUzNlx1ODVDRlx1NzJCNlx1NjAwMVxuICAgKi9cbiAgYXN5bmMgdG9nZ2xlRmF2b3JpdGUoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMDdcdTYzNjJcdTY1MzZcdTg1Q0ZcdTcyQjZcdTYwMDFcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAuLi5tb2NrUXVlcmllc1tpbmRleF0sXG4gICAgICBpc0Zhdm9yaXRlOiAhbW9ja1F1ZXJpZXNbaW5kZXhdLmlzRmF2b3JpdGUsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIG1vY2tRdWVyaWVzW2luZGV4XTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUzODZcdTUzRjJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5SGlzdG9yeShwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTUzODZcdTUzRjJcdThCQjBcdTVGNTVcbiAgICBjb25zdCB0b3RhbEl0ZW1zID0gMjA7XG4gICAgY29uc3QgaGlzdG9yaWVzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogdG90YWxJdGVtcyB9LCAoXywgaSkgPT4ge1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiAzNjAwMDAwKS50b0lTT1N0cmluZygpO1xuICAgICAgY29uc3QgcXVlcnlJbmRleCA9IGkgJSBtb2NrUXVlcmllcy5sZW5ndGg7XG4gICAgICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBgaGlzdC0ke2kgKyAxfWAsXG4gICAgICAgIHF1ZXJ5SWQ6IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdLmlkLFxuICAgICAgICBxdWVyeU5hbWU6IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdLm5hbWUsXG4gICAgICAgIGV4ZWN1dGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5yYW5kb20oKSAqIDAuNSArIDAuMSxcbiAgICAgICAgcm93Q291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyAxLFxuICAgICAgICB1c2VySWQ6ICd1c2VyMScsXG4gICAgICAgIHVzZXJOYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyxcbiAgICAgICAgc3RhdHVzOiBpICUgOCA9PT0gMCA/ICdGQUlMRUQnIDogJ1NVQ0NFU1MnLFxuICAgICAgICBlcnJvck1lc3NhZ2U6IGkgJSA4ID09PSAwID8gJ1x1NjdFNVx1OEJFMlx1NjI2N1x1ODg0Q1x1OEQ4NVx1NjVGNicgOiBudWxsXG4gICAgICB9O1xuICAgIH0pO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCB0b3RhbEl0ZW1zKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGhpc3Rvcmllcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICB0b3RhbDogdG90YWxJdGVtcyxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsSXRlbXMgLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyeVZlcnNpb25zKHF1ZXJ5SWQ6IHN0cmluZywgcGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgXG4gICAgaWYgKCFxdWVyeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7cXVlcnlJZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XG4gICAgcmV0dXJuIHF1ZXJ5LnZlcnNpb25zIHx8IFtdO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBxdWVyeUlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTcyNDhcdTY3MkNcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzW2luZGV4XTtcbiAgICBjb25zdCBuZXdWZXJzaW9uTnVtYmVyID0gKHF1ZXJ5LnZlcnNpb25zPy5sZW5ndGggfHwgMCkgKyAxO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICBjb25zdCBuZXdWZXJzaW9uID0ge1xuICAgICAgaWQ6IGB2ZXItJHtxdWVyeUlkfS0ke25ld1ZlcnNpb25OdW1iZXJ9YCxcbiAgICAgIHF1ZXJ5SWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiBuZXdWZXJzaW9uTnVtYmVyLFxuICAgICAgbmFtZTogZGF0YS5uYW1lIHx8IGBcdTcyNDhcdTY3MkMgJHtuZXdWZXJzaW9uTnVtYmVyfWAsXG4gICAgICBzcWw6IGRhdGEuc3FsIHx8IHF1ZXJ5LnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQgfHwgcXVlcnkuZGF0YVNvdXJjZUlkLFxuICAgICAgc3RhdHVzOiAnRFJBRlQnLFxuICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU0RTRCXHU1MjREXHU3MjQ4XHU2NzJDXHU3Njg0aXNMYXRlc3RcdTY4MDdcdTVGRDdcbiAgICBpZiAocXVlcnkudmVyc2lvbnMgJiYgcXVlcnkudmVyc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgcXVlcnkudmVyc2lvbnMgPSBxdWVyeS52ZXJzaW9ucy5tYXAodiA9PiAoe1xuICAgICAgICAuLi52LFxuICAgICAgICBpc0xhdGVzdDogZmFsc2VcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU2NUIwXHU3MjQ4XHU2NzJDXG4gICAgaWYgKCFxdWVyeS52ZXJzaW9ucykge1xuICAgICAgcXVlcnkudmVyc2lvbnMgPSBbXTtcbiAgICB9XG4gICAgcXVlcnkudmVyc2lvbnMucHVzaChuZXdWZXJzaW9uKTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkNcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiBuZXdWZXJzaW9uLFxuICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBuZXdWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTNEMVx1NUUwM1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgcHVibGlzaFF1ZXJ5VmVyc2lvbih2ZXJzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NTMwNVx1NTQyQlx1NkI2NFx1NzI0OFx1NjcyQ1x1NzY4NFx1NjdFNVx1OEJFMlxuICAgIGxldCBxdWVyeSA9IG51bGw7XG4gICAgbGV0IHZlcnNpb25JbmRleCA9IC0xO1xuICAgIGxldCBxdWVyeUluZGV4ID0gLTE7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2NrUXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zKSB7XG4gICAgICAgIGNvbnN0IHZJbmRleCA9IG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zLmZpbmRJbmRleCh2ID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgICAgIGlmICh2SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgcXVlcnkgPSBtb2NrUXVlcmllc1tpXTtcbiAgICAgICAgICB2ZXJzaW9uSW5kZXggPSB2SW5kZXg7XG4gICAgICAgICAgcXVlcnlJbmRleCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKCFxdWVyeSB8fCB2ZXJzaW9uSW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHt2ZXJzaW9uSWR9XHU3Njg0XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NzI0OFx1NjcyQ1x1NzJCNlx1NjAwMVxuICAgIGNvbnN0IHVwZGF0ZWRWZXJzaW9uID0ge1xuICAgICAgLi4ucXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBwdWJsaXNoZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdID0gdXBkYXRlZFZlcnNpb247XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU3MkI2XHU2MDAxXG4gICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBjdXJyZW50VmVyc2lvbjogdXBkYXRlZFZlcnNpb24sXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NUU5Rlx1NUYwM1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgZGVwcmVjYXRlUXVlcnlWZXJzaW9uKHZlcnNpb25JZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU1MzA1XHU1NDJCXHU2QjY0XHU3MjQ4XHU2NzJDXHU3Njg0XHU2N0U1XHU4QkUyXG4gICAgbGV0IHF1ZXJ5ID0gbnVsbDtcbiAgICBsZXQgdmVyc2lvbkluZGV4ID0gLTE7XG4gICAgbGV0IHF1ZXJ5SW5kZXggPSAtMTtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vY2tRdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMpIHtcbiAgICAgICAgY29uc3QgdkluZGV4ID0gbW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMuZmluZEluZGV4KHYgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICAgICAgaWYgKHZJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBxdWVyeSA9IG1vY2tRdWVyaWVzW2ldO1xuICAgICAgICAgIHZlcnNpb25JbmRleCA9IHZJbmRleDtcbiAgICAgICAgICBxdWVyeUluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoIXF1ZXJ5IHx8IHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU3MjQ4XHU2NzJDXHU3MkI2XHU2MDAxXG4gICAgY29uc3QgdXBkYXRlZFZlcnNpb24gPSB7XG4gICAgICAuLi5xdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdLFxuICAgICAgc3RhdHVzOiAnREVQUkVDQVRFRCcsXG4gICAgICBkZXByZWNhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSA9IHVwZGF0ZWRWZXJzaW9uO1xuICAgIFxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NUU5Rlx1NUYwM1x1NzY4NFx1NjYyRlx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1x1RkYwQ1x1NTIxOVx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NzJCNlx1NjAwMVxuICAgIGlmIChxdWVyeS5jdXJyZW50VmVyc2lvbiAmJiBxdWVyeS5jdXJyZW50VmVyc2lvbi5pZCA9PT0gdmVyc2lvbklkKSB7XG4gICAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgICAgLi4ucXVlcnksXG4gICAgICAgIHN0YXR1czogJ0RFUFJFQ0FURUQnLFxuICAgICAgICBjdXJyZW50VmVyc2lvbjogdXBkYXRlZFZlcnNpb24sXG4gICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgICAgLi4ucXVlcnksXG4gICAgICAgIHZlcnNpb25zOiBxdWVyeS52ZXJzaW9ucyxcbiAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB1cGRhdGVkVmVyc2lvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTZGQzBcdTZEM0JcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgICovXG4gIGFzeW5jIGFjdGl2YXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQ6IHN0cmluZywgdmVyc2lvbklkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeUluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgXG4gICAgaWYgKHF1ZXJ5SW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NzI0OFx1NjcyQ1xuICAgIGlmICghcXVlcnkudmVyc2lvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2N0U1XHU4QkUyICR7cXVlcnlJZH0gXHU2Q0ExXHU2NzA5XHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHZlcnNpb25JbmRleCA9IHF1ZXJ5LnZlcnNpb25zLmZpbmRJbmRleCh2ID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgXG4gICAgaWYgKHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU4OTgxXHU2RkMwXHU2RDNCXHU3Njg0XHU3MjQ4XHU2NzJDXG4gICAgY29uc3QgdmVyc2lvblRvQWN0aXZhdGUgPSBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1x1NTQ4Q1x1NjdFNVx1OEJFMlx1NzJCNlx1NjAwMVxuICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgLi4ucXVlcnksXG4gICAgICBjdXJyZW50VmVyc2lvbjogdmVyc2lvblRvQWN0aXZhdGUsXG4gICAgICBzdGF0dXM6IHZlcnNpb25Ub0FjdGl2YXRlLnN0YXR1cyxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdmVyc2lvblRvQWN0aXZhdGU7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHF1ZXJ5U2VydmljZTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvaW50ZWdyYXRpb24udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvaW50ZWdyYXRpb24udHNcIjsvKipcbiAqIFx1OTZDNlx1NjIxMFx1NjcwRFx1NTJBMU1vY2tcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU5NkM2XHU2MjEwQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKi9cblxuLy8gXHU2QTIxXHU2MkRGXHU5NkM2XHU2MjEwXG5leHBvcnQgY29uc3QgbW9ja0ludGVncmF0aW9ucyA9IFtcbiAge1xuICAgIGlkOiAnaW50ZWdyYXRpb24tMScsXG4gICAgbmFtZTogJ1x1NzkzQVx1NEY4QlJFU1QgQVBJJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4QlJFU1QgQVBJXHU2NzBEXHU1MkExJyxcbiAgICB0eXBlOiAnUkVTVCcsXG4gICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tL3YxJyxcbiAgICBhdXRoVHlwZTogJ0JBU0lDJyxcbiAgICB1c2VybmFtZTogJ2FwaV91c2VyJyxcbiAgICBwYXNzd29yZDogJyoqKioqKioqJyxcbiAgICBzdGF0dXM6ICdBQ1RJVkUnLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGVuZHBvaW50czogW1xuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTEnLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU3NTI4XHU2MjM3XHU1MjE3XHU4ODY4JyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy91c2VycycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MjQwXHU2NzA5XHU3NTI4XHU2MjM3XHU3Njg0XHU1MjE3XHU4ODY4J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC0yJyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NzUyOFx1NjIzNycsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvdXNlcnMve2lkfScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2ODM5XHU2MzZFSURcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTc1MjhcdTYyMzcnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgaWQ6ICdpbnRlZ3JhdGlvbi0yJyxcbiAgICBuYW1lOiAnXHU1OTI5XHU2QzE0QVBJJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNUFQSScsXG4gICAgdHlwZTogJ1JFU1QnLFxuICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS53ZWF0aGVyLmNvbScsXG4gICAgYXV0aFR5cGU6ICdBUElfS0VZJyxcbiAgICBhcGlLZXk6ICcqKioqKioqKicsXG4gICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDQzMjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBlbmRwb2ludHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC0zJyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NTkyOVx1NkMxNCcsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvY3VycmVudCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MzA3XHU1QjlBXHU0RjREXHU3RjZFXHU3Njg0XHU1RjUzXHU1MjREXHU1OTI5XHU2QzE0J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC00JyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNScsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvZm9yZWNhc3QnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjcyQVx1Njc2NTdcdTU5MjlcdTc2ODRcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgaWQ6ICdpbnRlZ3JhdGlvbi0zJyxcbiAgICBuYW1lOiAnXHU2NTJGXHU0RUQ4XHU3RjUxXHU1MTczJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NjUyRlx1NEVEOFx1NTkwNFx1NzQwNkFQSScsXG4gICAgdHlwZTogJ1JFU1QnLFxuICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS5wYXltZW50LmNvbScsXG4gICAgYXV0aFR5cGU6ICdPQVVUSDInLFxuICAgIGNsaWVudElkOiAnY2xpZW50MTIzJyxcbiAgICBjbGllbnRTZWNyZXQ6ICcqKioqKioqKicsXG4gICAgc3RhdHVzOiAnSU5BQ1RJVkUnLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgZW5kcG9pbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtNScsXG4gICAgICAgIG5hbWU6ICdcdTUyMUJcdTVFRkFcdTY1MkZcdTRFRDgnLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgcGF0aDogJy9wYXltZW50cycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU1MjFCXHU1RUZBXHU2NUIwXHU3Njg0XHU2NTJGXHU0RUQ4XHU4QkY3XHU2QzQyJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC02JyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NjUyRlx1NEVEOFx1NzJCNlx1NjAwMScsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvcGF5bWVudHMve2lkfScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2OEMwXHU2N0U1XHU2NTJGXHU0RUQ4XHU3MkI2XHU2MDAxJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC03JyxcbiAgICAgICAgbmFtZTogJ1x1OTAwMFx1NkIzRScsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0vcmVmdW5kJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTU5MDRcdTc0MDZcdTkwMDBcdTZCM0VcdThCRjdcdTZDNDInXG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xuXG4vLyBcdTkxQ0RcdTdGNkVcdTk2QzZcdTYyMTBcdTY1NzBcdTYzNkVcbmV4cG9ydCBmdW5jdGlvbiByZXNldEludGVncmF0aW9ucygpOiB2b2lkIHtcbiAgLy8gXHU0RkREXHU3NTU5XHU1RjE1XHU3NTI4XHVGRjBDXHU1M0VBXHU5MUNEXHU3RjZFXHU1MTg1XHU1QkI5XG4gIHdoaWxlIChtb2NrSW50ZWdyYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICBtb2NrSW50ZWdyYXRpb25zLnBvcCgpO1xuICB9XG4gIFxuICAvLyBcdTkxQ0RcdTY1QjBcdTc1MUZcdTYyMTBcdTk2QzZcdTYyMTBcdTY1NzBcdTYzNkVcbiAgW1xuICAgIHtcbiAgICAgIGlkOiAnaW50ZWdyYXRpb24tMScsXG4gICAgICBuYW1lOiAnXHU3OTNBXHU0RjhCUkVTVCBBUEknLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTc5M0FcdTRGOEJSRVNUIEFQSVx1NjcwRFx1NTJBMScsXG4gICAgICB0eXBlOiAnUkVTVCcsXG4gICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20vdjEnLFxuICAgICAgYXV0aFR5cGU6ICdCQVNJQycsXG4gICAgICB1c2VybmFtZTogJ2FwaV91c2VyJyxcbiAgICAgIHBhc3N3b3JkOiAnKioqKioqKionLFxuICAgICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmRwb2ludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtMScsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NzUyOFx1NjIzN1x1NTIxN1x1ODg2OCcsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL3VzZXJzJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjI0MFx1NjcwOVx1NzUyOFx1NjIzN1x1NzY4NFx1NTIxN1x1ODg2OCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtMicsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NzUyOFx1NjIzNycsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL3VzZXJzL3tpZH0nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2ODM5XHU2MzZFSURcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTc1MjhcdTYyMzcnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnaW50ZWdyYXRpb24tMicsXG4gICAgICBuYW1lOiAnXHU1OTI5XHU2QzE0QVBJJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1QVBJJyxcbiAgICAgIHR5cGU6ICdSRVNUJyxcbiAgICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS53ZWF0aGVyLmNvbScsXG4gICAgICBhdXRoVHlwZTogJ0FQSV9LRVknLFxuICAgICAgYXBpS2V5OiAnKioqKioqKionLFxuICAgICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA0MzIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmRwb2ludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtMycsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NTkyOVx1NkMxNCcsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL2N1cnJlbnQnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MzA3XHU1QjlBXHU0RjREXHU3RjZFXHU3Njg0XHU1RjUzXHU1MjREXHU1OTI5XHU2QzE0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC00JyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1JyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvZm9yZWNhc3QnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2NzJBXHU2NzY1N1x1NTkyOVx1NzY4NFx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdpbnRlZ3JhdGlvbi0zJyxcbiAgICAgIG5hbWU6ICdcdTY1MkZcdTRFRDhcdTdGNTFcdTUxNzMnLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY1MkZcdTRFRDhcdTU5MDRcdTc0MDZBUEknLFxuICAgICAgdHlwZTogJ1JFU1QnLFxuICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLnBheW1lbnQuY29tJyxcbiAgICAgIGF1dGhUeXBlOiAnT0FVVEgyJyxcbiAgICAgIGNsaWVudElkOiAnY2xpZW50MTIzJyxcbiAgICAgIGNsaWVudFNlY3JldDogJyoqKioqKioqJyxcbiAgICAgIHN0YXR1czogJ0lOQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZHBvaW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC01JyxcbiAgICAgICAgICBuYW1lOiAnXHU1MjFCXHU1RUZBXHU2NTJGXHU0RUQ4JyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBwYXRoOiAnL3BheW1lbnRzJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NFx1NjUyRlx1NEVEOFx1OEJGN1x1NkM0MidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtNicsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NjUyRlx1NEVEOFx1NzJCNlx1NjAwMScsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2OEMwXHU2N0U1XHU2NTJGXHU0RUQ4XHU3MkI2XHU2MDAxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC03JyxcbiAgICAgICAgICBuYW1lOiAnXHU5MDAwXHU2QjNFJyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0vcmVmdW5kJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTkwNFx1NzQwNlx1OTAwMFx1NkIzRVx1OEJGN1x1NkM0MidcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXS5mb3JFYWNoKGl0ZW0gPT4gbW9ja0ludGVncmF0aW9ucy5wdXNoKGl0ZW0pKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbW9ja0ludGVncmF0aW9uczsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2ludGVncmF0aW9uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbnRlZ3JhdGlvbi50c1wiOy8qKlxuICogXHU5NkM2XHU2MjEwTW9ja1x1NjcwRFx1NTJBMVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTk2QzZcdTYyMTBcdTc2RjhcdTUxNzNBUElcdTc2ODRcdTZBMjFcdTYyREZcdTVCOUVcdTczQjBcbiAqL1xuXG5pbXBvcnQgeyBkZWxheSwgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLCBjcmVhdGVNb2NrUmVzcG9uc2UsIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IG1vY2tJbnRlZ3JhdGlvbnMgfSBmcm9tICcuLi9kYXRhL2ludGVncmF0aW9uJztcblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXlUaW1lID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIGRlbGF5KGRlbGF5VGltZSk7XG59XG5cbi8qKlxuICogXHU5NkM2XHU2MjEwXHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IGludGVncmF0aW9uU2VydmljZSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1OTZDNlx1NjIxMFx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0SW50ZWdyYXRpb25zKHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICAgIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLm1vY2tJbnRlZ3JhdGlvbnNdO1xuICAgIFxuICAgIC8vIFx1NjMwOVx1NTQwRFx1NzlGMFx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/Lm5hbWUpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSBwYXJhbXMubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGkgPT4gXG4gICAgICAgIGkubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgICAoaS5kZXNjcmlwdGlvbiAmJiBpLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy50eXBlKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiBpLnR5cGUgPT09IHBhcmFtcy50eXBlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU3MkI2XHU2MDAxXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiBpLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgZ2V0SW50ZWdyYXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IGludGVncmF0aW9uID0gbW9ja0ludGVncmF0aW9ucy5maW5kKGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghaW50ZWdyYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1OTZDNlx1NjIxMGApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gaW50ZWdyYXRpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU5NkM2XHU2MjEwXG4gICAqL1xuICBhc3luYyBjcmVhdGVJbnRlZ3JhdGlvbihkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBuZXdJZCA9IGBpbnRlZ3JhdGlvbi0ke0RhdGUubm93KCl9YDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgY29uc3QgbmV3SW50ZWdyYXRpb24gPSB7XG4gICAgICBpZDogbmV3SWQsXG4gICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgJ1x1NjVCMFx1OTZDNlx1NjIxMCcsXG4gICAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICAgIHR5cGU6IGRhdGEudHlwZSB8fCAnUkVTVCcsXG4gICAgICBiYXNlVXJsOiBkYXRhLmJhc2VVcmwgfHwgJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tJyxcbiAgICAgIGF1dGhUeXBlOiBkYXRhLmF1dGhUeXBlIHx8ICdOT05FJyxcbiAgICAgIHN0YXR1czogJ0FDVElWRScsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgZW5kcG9pbnRzOiBkYXRhLmVuZHBvaW50cyB8fCBbXVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2ODM5XHU2MzZFXHU4QkE0XHU4QkMxXHU3QzdCXHU1NzhCXHU2REZCXHU1MkEwXHU3NkY4XHU1RTk0XHU1QjU3XHU2QkI1XG4gICAgaWYgKGRhdGEuYXV0aFR5cGUgPT09ICdCQVNJQycpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obmV3SW50ZWdyYXRpb24sIHtcbiAgICAgICAgdXNlcm5hbWU6IGRhdGEudXNlcm5hbWUgfHwgJ3VzZXInLFxuICAgICAgICBwYXNzd29yZDogZGF0YS5wYXNzd29yZCB8fCAnKioqKioqKionXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGRhdGEuYXV0aFR5cGUgPT09ICdBUElfS0VZJykge1xuICAgICAgT2JqZWN0LmFzc2lnbihuZXdJbnRlZ3JhdGlvbiwge1xuICAgICAgICBhcGlLZXk6IGRhdGEuYXBpS2V5IHx8ICcqKioqKioqKidcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5hdXRoVHlwZSA9PT0gJ09BVVRIMicpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obmV3SW50ZWdyYXRpb24sIHtcbiAgICAgICAgY2xpZW50SWQ6IGRhdGEuY2xpZW50SWQgfHwgJ2NsaWVudCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogZGF0YS5jbGllbnRTZWNyZXQgfHwgJyoqKioqKioqJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NkRGQlx1NTJBMFx1NTIzMFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVxuICAgIG1vY2tJbnRlZ3JhdGlvbnMucHVzaChuZXdJbnRlZ3JhdGlvbik7XG4gICAgXG4gICAgcmV0dXJuIG5ld0ludGVncmF0aW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgdXBkYXRlSW50ZWdyYXRpb24oaWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW5kZXggPSBtb2NrSW50ZWdyYXRpb25zLmZpbmRJbmRleChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXG4gICAgY29uc3QgdXBkYXRlZEludGVncmF0aW9uID0ge1xuICAgICAgLi4ubW9ja0ludGVncmF0aW9uc1tpbmRleF0sXG4gICAgICAuLi5kYXRhLFxuICAgICAgaWQsIC8vIFx1Nzg2RVx1NEZERElEXHU0RTBEXHU1M0Q4XG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gICAgbW9ja0ludGVncmF0aW9uc1tpbmRleF0gPSB1cGRhdGVkSW50ZWdyYXRpb247XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRJbnRlZ3JhdGlvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTk2QzZcdTYyMTBcbiAgICovXG4gIGFzeW5jIGRlbGV0ZUludGVncmF0aW9uKGlkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW5kZXggPSBtb2NrSW50ZWdyYXRpb25zLmZpbmRJbmRleChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU0RUNFXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU0RTJEXHU1MjIwXHU5NjY0XG4gICAgbW9ja0ludGVncmF0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIFxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NkQ0Qlx1OEJENVx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgdGVzdEludGVncmF0aW9uKGlkOiBzdHJpbmcsIHBhcmFtczogYW55ID0ge30pOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG1vY2tJbnRlZ3JhdGlvbnMuZmluZChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIWludGVncmF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU2QTIxXHU2MkRGXHU2RDRCXHU4QkQ1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICByZXN1bHRUeXBlOiAnSlNPTicsXG4gICAgICBqc29uUmVzcG9uc2U6IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6ICdcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTYyMTBcdTUyOUYnLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIHJlc3BvbnNlVGltZTogTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwKSArIDUwLFxuICAgICAgICAgIHNlcnZlckluZm86ICdNb2NrIFNlcnZlciB2MS4wJyxcbiAgICAgICAgICBlbmRwb2ludDogcGFyYW1zLmVuZHBvaW50IHx8IGludGVncmF0aW9uLmVuZHBvaW50c1swXT8ucGF0aCB8fCAnLydcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogQXJyYXkuZnJvbSh7IGxlbmd0aDogMyB9LCAoXywgaSkgPT4gKHtcbiAgICAgICAgICBpZDogaSArIDEsXG4gICAgICAgICAgbmFtZTogYFx1NjgzN1x1NjcyQ1x1NjU3MFx1NjM2RSAke2kgKyAxfWAsXG4gICAgICAgICAgdmFsdWU6IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDApIC8gMTBcbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTk2QzZcdTYyMTBcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM6IGFueSA9IHt9KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW50ZWdyYXRpb24gPSBtb2NrSW50ZWdyYXRpb25zLmZpbmQoaSA9PiBpLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFpbnRlZ3JhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU5NkM2XHU2MjEwYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NkEyMVx1NjJERlx1NjI2N1x1ODg0Q1x1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgcmVzdWx0VHlwZTogJ0pTT04nLFxuICAgICAganNvblJlc3BvbnNlOiB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgcXVlcnk6IHBhcmFtcy5xdWVyeSB8fCAnXHU5RUQ4XHU4QkE0XHU2N0U1XHU4QkUyJyxcbiAgICAgICAgZGF0YTogQXJyYXkuZnJvbSh7IGxlbmd0aDogNSB9LCAoXywgaSkgPT4gKHtcbiAgICAgICAgICBpZDogYHJlY29yZC0ke2kgKyAxfWAsXG4gICAgICAgICAgbmFtZTogYFx1OEJCMFx1NUY1NSAke2kgKyAxfWAsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTY3RTVcdThCRTJcdThGRDRcdTU2REVcdTc2ODRcdThCQjBcdTVGNTUgJHtpICsgMX1gLFxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICB0eXBlOiBpICUgMiA9PT0gMCA/ICdBJyA6ICdCJyxcbiAgICAgICAgICAgIHZhbHVlOiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDApLFxuICAgICAgICAgICAgYWN0aXZlOiBpICUgMyAhPT0gMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8vIFx1NTE3Q1x1NUJCOVx1NjVFN1x1NzY4NFx1NjNBNVx1NTNFMywgXHU3NkY0XHU2M0E1XHU4QzAzXHU3NTI4XHU2NUIwXHU3Njg0XHU1QjlFXHU3M0IwXG4gIGFzeW5jIGdldE1vY2tJbnRlZ3JhdGlvbnMoKTogUHJvbWlzZTxhbnlbXT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5nZXRJbnRlZ3JhdGlvbnMoe30pO1xuICAgIHJldHVybiByZXN1bHQuaXRlbXM7XG4gIH0sXG4gIFxuICBhc3luYyBnZXRNb2NrSW50ZWdyYXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgbnVsbD4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5nZXRJbnRlZ3JhdGlvbihpZCk7XG4gICAgICByZXR1cm4gaW50ZWdyYXRpb247XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1x1ODNCN1x1NTNENlx1OTZDNlx1NjIxMFx1NTkzMVx1OEQyNTonLCBlcnJvcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sXG4gIFxuICBhc3luYyBjcmVhdGVNb2NrSW50ZWdyYXRpb24oZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gaW50ZWdyYXRpb25TZXJ2aWNlLmNyZWF0ZUludGVncmF0aW9uKGRhdGEpO1xuICB9LFxuICBcbiAgYXN5bmMgdXBkYXRlTW9ja0ludGVncmF0aW9uKGlkOiBzdHJpbmcsIHVwZGF0ZXM6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGludGVncmF0aW9uU2VydmljZS51cGRhdGVJbnRlZ3JhdGlvbihpZCwgdXBkYXRlcyk7XG4gIH0sXG4gIFxuICBhc3luYyBkZWxldGVNb2NrSW50ZWdyYXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmRlbGV0ZUludGVncmF0aW9uKGlkKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignXHU1MjIwXHU5NjY0XHU5NkM2XHU2MjEwXHU1OTMxXHU4RDI1OicsIGVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG4gIFxuICBhc3luYyBleGVjdXRlTW9ja1F1ZXJ5KGludGVncmF0aW9uSWQ6IHN0cmluZywgcXVlcnk6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5leGVjdXRlUXVlcnkoaW50ZWdyYXRpb25JZCwgcXVlcnkpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgZGF0YTogcmVzdWx0Lmpzb25SZXNwb25zZS5kYXRhXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcilcbiAgICAgIH07XG4gICAgfVxuICB9XG59O1xuXG4vLyBcdTZERkJcdTUyQTBcdTUxN0NcdTVCQjlcdTY1RTdBUElcdTc2ODRcdTVCRkNcdTUxRkFcbmV4cG9ydCBjb25zdCBnZXRNb2NrSW50ZWdyYXRpb25zID0gaW50ZWdyYXRpb25TZXJ2aWNlLmdldE1vY2tJbnRlZ3JhdGlvbnM7XG5leHBvcnQgY29uc3QgZ2V0TW9ja0ludGVncmF0aW9uID0gaW50ZWdyYXRpb25TZXJ2aWNlLmdldE1vY2tJbnRlZ3JhdGlvbjtcbmV4cG9ydCBjb25zdCBjcmVhdGVNb2NrSW50ZWdyYXRpb24gPSBpbnRlZ3JhdGlvblNlcnZpY2UuY3JlYXRlTW9ja0ludGVncmF0aW9uO1xuZXhwb3J0IGNvbnN0IHVwZGF0ZU1vY2tJbnRlZ3JhdGlvbiA9IGludGVncmF0aW9uU2VydmljZS51cGRhdGVNb2NrSW50ZWdyYXRpb247XG5leHBvcnQgY29uc3QgZGVsZXRlTW9ja0ludGVncmF0aW9uID0gaW50ZWdyYXRpb25TZXJ2aWNlLmRlbGV0ZU1vY2tJbnRlZ3JhdGlvbjtcbmV4cG9ydCBjb25zdCBleGVjdXRlTW9ja1F1ZXJ5ID0gaW50ZWdyYXRpb25TZXJ2aWNlLmV4ZWN1dGVNb2NrUXVlcnk7XG5cbmV4cG9ydCBkZWZhdWx0IGludGVncmF0aW9uU2VydmljZTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTZDNlx1NEUyRFx1NUJGQ1x1NTFGQVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRBUEkgTW9ja1x1NjcwRFx1NTJBMVx1NTE2NVx1NTNFM1x1NzBCOVxuICovXG5cbi8vIFx1NUJGQ1x1NTE2NVx1NjU3MFx1NjM2RVx1NkU5MFx1NjcwRFx1NTJBMVxuaW1wb3J0IGRhdGFTb3VyY2UgZnJvbSAnLi9kYXRhc291cmNlJztcbi8vIFx1NUJGQ1x1NTE2NVx1NUI4Q1x1NjU3NFx1NzY4NFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMVx1NUI5RVx1NzNCMFxuaW1wb3J0IHF1ZXJ5U2VydmljZUltcGxlbWVudGF0aW9uIGZyb20gJy4vcXVlcnknO1xuLy8gXHU1QkZDXHU1MTY1XHU5NkM2XHU2MjEwXHU2NzBEXHU1MkExXG5pbXBvcnQgaW50ZWdyYXRpb25TZXJ2aWNlSW1wbGVtZW50YXRpb24gZnJvbSAnLi9pbnRlZ3JhdGlvbic7XG5cbi8vIFx1NUJGQ1x1NTE2NVx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuaW1wb3J0IHsgXG4gIGNyZWF0ZU1vY2tSZXNwb25zZSwgXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLCBcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheSBcbn0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogXHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExTW9ja1xuICogQGRlcHJlY2F0ZWQgXHU0RjdGXHU3NTI4XHU0RUNFICcuL3F1ZXJ5JyBcdTVCRkNcdTUxNjVcdTc2ODRcdTVCOENcdTY1NzRcdTVCOUVcdTczQjBcdTRFRTNcdTY2RkZcbiAqL1xuY29uc3QgcXVlcnkgPSB7XG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJpZXMocGFyYW1zOiB7IHBhZ2U6IG51bWJlcjsgc2l6ZTogbnVtYmVyOyB9KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4gY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlKHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgaWQ6ICdxMScsIG5hbWU6ICdcdTc1MjhcdTYyMzdcdTUyMDZcdTY3OTBcdTY3RTVcdThCRTInLCBkZXNjcmlwdGlvbjogJ1x1NjMwOVx1NTczMFx1NTMzQVx1N0VERlx1OEJBMVx1NzUyOFx1NjIzN1x1NkNFOFx1NTE4Q1x1NjU3MFx1NjM2RScsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICAgIHsgaWQ6ICdxMicsIG5hbWU6ICdcdTk1MDBcdTU1MkVcdTRFMUFcdTdFRTlcdTY3RTVcdThCRTInLCBkZXNjcmlwdGlvbjogJ1x1NjMwOVx1NjcwOFx1N0VERlx1OEJBMVx1OTUwMFx1NTUyRVx1OTg5RCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICAgIHsgaWQ6ICdxMycsIG5hbWU6ICdcdTVFOTNcdTVCNThcdTUyMDZcdTY3OTAnLCBkZXNjcmlwdGlvbjogJ1x1NzZEMVx1NjNBN1x1NUU5M1x1NUI1OFx1NkMzNFx1NUU3MycsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICBdLFxuICAgICAgdG90YWw6IDMsXG4gICAgICBwYWdlOiBwYXJhbXMucGFnZSxcbiAgICAgIHNpemU6IHBhcmFtcy5zaXplXG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnkoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogJ1x1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMicsXG4gICAgICBzcWw6ICdTRUxFQ1QgKiBGUk9NIHVzZXJzIFdIRVJFIHN0YXR1cyA9ICQxJyxcbiAgICAgIHBhcmFtZXRlcnM6IFsnYWN0aXZlJ10sXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBjcmVhdGVRdWVyeShkYXRhOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZDogYHF1ZXJ5LSR7RGF0ZS5ub3coKX1gLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIHVwZGF0ZVF1ZXJ5KGlkOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBkZWxldGVRdWVyeShpZDogc3RyaW5nKSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZVF1ZXJ5KGlkOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgY29sdW1uczogWydpZCcsICduYW1lJywgJ2VtYWlsJywgJ3N0YXR1cyddLFxuICAgICAgcm93czogW1xuICAgICAgICB7IGlkOiAxLCBuYW1lOiAnXHU1RjIwXHU0RTA5JywgZW1haWw6ICd6aGFuZ0BleGFtcGxlLmNvbScsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgICAgICAgeyBpZDogMiwgbmFtZTogJ1x1Njc0RVx1NTZEQicsIGVtYWlsOiAnbGlAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIG5hbWU6ICdcdTczOEJcdTRFOTQnLCBlbWFpbDogJ3dhbmdAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdpbmFjdGl2ZScgfSxcbiAgICAgIF0sXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBleGVjdXRpb25UaW1lOiAwLjIzNSxcbiAgICAgICAgcm93Q291bnQ6IDMsXG4gICAgICAgIHRvdGFsUGFnZXM6IDFcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIFx1NUJGQ1x1NTFGQVx1NjI0MFx1NjcwOVx1NjcwRFx1NTJBMVxuICovXG5jb25zdCBzZXJ2aWNlcyA9IHtcbiAgZGF0YVNvdXJjZSxcbiAgcXVlcnk6IHF1ZXJ5U2VydmljZUltcGxlbWVudGF0aW9uLFxuICBpbnRlZ3JhdGlvbjogaW50ZWdyYXRpb25TZXJ2aWNlSW1wbGVtZW50YXRpb25cbn07XG5cbi8vIFx1NUJGQ1x1NTFGQW1vY2sgc2VydmljZVx1NURFNVx1NTE3N1xuZXhwb3J0IHtcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSxcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheVxufTtcblxuLy8gXHU1QkZDXHU1MUZBXHU1NDA0XHU0RTJBXHU2NzBEXHU1MkExXG5leHBvcnQgY29uc3QgZGF0YVNvdXJjZVNlcnZpY2UgPSBzZXJ2aWNlcy5kYXRhU291cmNlO1xuZXhwb3J0IGNvbnN0IHF1ZXJ5U2VydmljZSA9IHNlcnZpY2VzLnF1ZXJ5O1xuZXhwb3J0IGNvbnN0IGludGVncmF0aW9uU2VydmljZSA9IHNlcnZpY2VzLmludGVncmF0aW9uO1xuXG4vLyBcdTlFRDhcdThCQTRcdTVCRkNcdTUxRkFcdTYyNDBcdTY3MDlcdTY3MERcdTUyQTFcbmV4cG9ydCBkZWZhdWx0IHNlcnZpY2VzOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzXCI7aW1wb3J0IHsgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTRFMDBcdTRFMkFcdTdCODBcdTUzNTVcdTc2ODRcdTZENEJcdThCRDVcdTRFMkRcdTk1RjRcdTRFRjZcbiAqIFx1NTNFQVx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFx1RkYwQ1x1NzUyOFx1NEU4RVx1NkQ0Qlx1OEJENU1vY2tcdTdDRkJcdTdFREZcdTY2MkZcdTU0MjZcdTZCNjNcdTVFMzhcdTVERTVcdTRGNUNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUoKSB7XG4gIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTVERjJcdTUyMUJcdTVFRkFcdTZENEJcdThCRDVcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTVDMDZcdTU5MDRcdTc0MDYvYXBpL3Rlc3RcdThERUZcdTVGODRcdTc2ODRcdThCRjdcdTZDNDInKTtcbiAgXG4gIHJldHVybiBmdW5jdGlvbiBzaW1wbGVNaWRkbGV3YXJlKFxuICAgIHJlcTogaHR0cC5JbmNvbWluZ01lc3NhZ2UsXG4gICAgcmVzOiBodHRwLlNlcnZlclJlc3BvbnNlLFxuICAgIG5leHQ6IENvbm5lY3QuTmV4dEZ1bmN0aW9uXG4gICkge1xuICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZCB8fCAnVU5LTk9XTic7XG4gICAgXG4gICAgLy8gXHU1M0VBXHU1OTA0XHU3NDA2L2FwaS90ZXN0XHU4REVGXHU1Rjg0XG4gICAgaWYgKHVybCA9PT0gJy9hcGkvdGVzdCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTY1MzZcdTUyMzBcdTZENEJcdThCRDVcdThCRjdcdTZDNDI6ICR7bWV0aG9kfSAke3VybH1gKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gXHU4QkJFXHU3RjZFQ09SU1x1NTkzNFxuICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIE9QVElPTlMnKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycycsICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24nKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTkwNFx1NzQwNk9QVElPTlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDJcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NTkwNFx1NzQwNk9QVElPTlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDInKTtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwNDtcbiAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTc4NkVcdTRGRERcdTg5ODZcdTc2RDZcdTYzODlcdTYyNDBcdTY3MDlcdTVERjJcdTY3MDlcdTc2ODRDb250ZW50LVR5cGVcdUZGMENcdTkwN0ZcdTUxNERcdTg4QUJcdTU0MEVcdTdFRURcdTRFMkRcdTk1RjRcdTRFRjZcdTY2RjRcdTY1MzlcbiAgICAgICAgcmVzLnJlbW92ZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1MUM2XHU1OTA3XHU1NENEXHU1RTk0XHU2NTcwXHU2MzZFXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdcdTdCODBcdTUzNTVcdTZENEJcdThCRDVcdTRFMkRcdTk1RjRcdTRFRjZcdTU0Q0RcdTVFOTRcdTYyMTBcdTUyOUYnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICBoZWFkZXJzOiByZXEuaGVhZGVycyxcbiAgICAgICAgICAgIHBhcmFtczogdXJsLmluY2x1ZGVzKCc/JykgPyB1cmwuc3BsaXQoJz8nKVsxXSA6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvLyBcdTUzRDFcdTkwMDFcdTU0Q0RcdTVFOTRcdTUyNERcdTc4NkVcdTRGRERcdTRFMkRcdTY1QURcdThCRjdcdTZDNDJcdTk0RkVcbiAgICAgICAgY29uc29sZS5sb2coJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NTNEMVx1OTAwMVx1NkQ0Qlx1OEJENVx1NTRDRFx1NUU5NCcpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlRGF0YSwgbnVsbCwgMikpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU0RTBEXHU4QzAzXHU3NTI4bmV4dCgpXHVGRjBDXHU3ODZFXHU0RkREXHU4QkY3XHU2QzQyXHU1MjMwXHU2QjY0XHU3RUQzXHU2NzVGXG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIFx1NTkwNFx1NzQwNlx1OTUxOVx1OEJFRlxuICAgICAgICBjb25zb2xlLmVycm9yKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTY1RjZcdTUxRkFcdTk1MTk6JywgZXJyb3IpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU2RTA1XHU5NjY0XHU1REYyXHU2NzA5XHU3Njg0XHU1OTM0XHVGRjBDXHU5MDdGXHU1MTREQ29udGVudC1UeXBlXHU4OEFCXHU2NkY0XHU2NTM5XG4gICAgICAgIHJlcy5yZW1vdmVIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogJ1x1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NjVGNlx1NTFGQVx1OTUxOScsXG4gICAgICAgICAgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKVxuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTRFMERcdThDMDNcdTc1MjhuZXh0KClcdUZGMENcdTc4NkVcdTRGRERcdThCRjdcdTZDNDJcdTUyMzBcdTZCNjRcdTdFRDNcdTY3NUZcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTRFMERcdTU5MDRcdTc0MDZcdTc2ODRcdThCRjdcdTZDNDJcdTRFQTRcdTdFRDlcdTRFMEJcdTRFMDBcdTRFMkFcdTRFMkRcdTk1RjRcdTRFRjZcbiAgICBuZXh0KCk7XG4gIH07XG59ICJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBU2EsYUFxRE47QUE5RFA7QUFBQTtBQVNPLElBQU0sY0FBdUIsTUFBTSxLQUFLLEVBQUUsUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLE1BQU07QUFDdkUsWUFBTSxLQUFLLFNBQVMsSUFBSSxDQUFDO0FBQ3pCLFlBQU0sWUFBWSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxLQUFRLEVBQUUsWUFBWTtBQUVsRSxhQUFPO0FBQUEsUUFDTDtBQUFBLFFBQ0EsTUFBTSw0QkFBUSxJQUFJLENBQUM7QUFBQSxRQUNuQixhQUFhLHdDQUFVLElBQUksQ0FBQztBQUFBLFFBQzVCLFVBQVUsSUFBSSxNQUFNLElBQUksYUFBYyxJQUFJLE1BQU0sSUFBSSxhQUFhO0FBQUEsUUFDakUsY0FBYyxNQUFPLElBQUksSUFBSyxDQUFDO0FBQUEsUUFDL0IsZ0JBQWdCLHNCQUFRLElBQUksSUFBSyxDQUFDO0FBQUEsUUFDbEMsV0FBVyxJQUFJLE1BQU0sSUFBSSxRQUFRO0FBQUEsUUFDakMsV0FBVyxJQUFJLE1BQU0sSUFDbkIsMENBQTBDLENBQUMsNEJBQzNDLG1DQUFVLElBQUksTUFBTSxJQUFJLGlCQUFPLGNBQUk7QUFBQSxRQUNyQyxRQUFRLElBQUksTUFBTSxJQUFJLFVBQVcsSUFBSSxNQUFNLElBQUksY0FBZSxJQUFJLE1BQU0sSUFBSSxlQUFlO0FBQUEsUUFDM0YsZUFBZSxJQUFJLE1BQU0sSUFBSSxZQUFZO0FBQUEsUUFDekMsV0FBVztBQUFBLFFBQ1gsV0FBVyxJQUFJLEtBQUssS0FBSyxJ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UUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFFTixLQUFLLGFBQWEsUUFBUTtBQUFBLFFBQ3hCLFVBQVU7QUFBQSxRQUNWLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxNQUNkO0FBQUE7QUFBQSxNQUVBLE9BQU8sQ0FBQztBQUFBLElBQ1Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxRQUNQLFNBQVMsQ0FBQyxhQUFhLFlBQVk7QUFBQSxNQUNyQztBQUFBLE1BQ0EscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osbUJBQW1CO0FBQUEsUUFDckI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsYUFBYTtBQUFBLE1BQ2IsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsZUFBZTtBQUFBLFFBQ2pCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQTtBQUFBLE1BRVosU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLFNBQVM7QUFBQTtBQUFBLFFBRVA7QUFBQTtBQUFBLFFBRUE7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLE9BQU87QUFBQSxJQUNUO0FBQUE7QUFBQSxJQUVBLFVBQVU7QUFBQTtBQUFBLElBRVYsU0FBUztBQUFBLE1BQ1AsYUFBYTtBQUFBLFFBQ1gsNEJBQTRCO0FBQUEsTUFDOUI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbImRlbGF5IiwgInNpbXVsYXRlRGVsYXkiLCAicXVlcnlfZGVmYXVsdCIsICJzaW11bGF0ZURlbGF5IiwgInF1ZXJ5X2RlZmF1bHQiLCAicXVlcnlTZXJ2aWNlIiwgImludGVncmF0aW9uU2VydmljZSIsICJkZWxheSIsICJxdWVyeVNlcnZpY2UiLCAibW9ja1F1ZXJpZXMiXQp9Cg==
