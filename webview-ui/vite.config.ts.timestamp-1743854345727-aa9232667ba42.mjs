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
var normalizeApiPath = (url) => {
  if (url.startsWith("/api/api/")) {
    const fixedUrl = url.replace("/api/api/", "/api/");
    console.log(`[Mock\u4E2D\u95F4\u4EF6] \u4FEE\u6B63\u91CD\u590D\u7684API\u8DEF\u5F84: ${url} => ${fixedUrl}`);
    return fixedUrl;
  }
  return url;
};
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
  const isLowCodeApisPath = urlPath.includes("/api/low-code/apis");
  if (isLowCodeApisPath) {
    console.log("[Mock] \u68C0\u6D4B\u5230\u96C6\u6210API\u8BF7\u6C42:", method, urlPath, urlQuery);
    if (urlPath === "/api/low-code/apis" && method === "GET") {
      logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: /api/low-code/apis`);
      try {
        const result = await integration_default.getIntegrations({
          page: parseInt(urlQuery.page) || 1,
          size: parseInt(urlQuery.size) || 10,
          name: urlQuery.name,
          type: urlQuery.type,
          status: urlQuery.status
        });
        const responseData = result.items;
        sendJsonResponse(res, 200, responseData);
      } catch (error) {
        sendJsonResponse(res, 500, {
          error: "\u83B7\u53D6\u96C6\u6210\u5217\u8868\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    const singleIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)$/);
    if (singleIntegrationMatch && method === "GET") {
      const id = singleIntegrationMatch[1];
      logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
      try {
        const integration = await integration_default.getIntegration(id);
        sendJsonResponse(res, 200, integration);
      } catch (error) {
        sendJsonResponse(res, 404, {
          error: "\u96C6\u6210\u4E0D\u5B58\u5728",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    if (urlPath === "/api/low-code/apis" && method === "POST") {
      logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: /api/low-code/apis`);
      try {
        const body = await parseRequestBody(req);
        const newIntegration = await integration_default.createIntegration(body);
        sendJsonResponse(res, 201, newIntegration);
      } catch (error) {
        sendJsonResponse(res, 400, {
          error: "\u521B\u5EFA\u96C6\u6210\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    const updateIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)$/);
    if (updateIntegrationMatch && method === "PUT") {
      const id = updateIntegrationMatch[1];
      logMock("debug", `\u5904\u7406PUT\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
      try {
        const body = await parseRequestBody(req);
        const updatedIntegration = await integration_default.updateIntegration(id, body);
        sendJsonResponse(res, 200, updatedIntegration);
      } catch (error) {
        sendJsonResponse(res, 404, {
          error: "\u66F4\u65B0\u96C6\u6210\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    const deleteIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)$/);
    if (deleteIntegrationMatch && method === "DELETE") {
      const id = deleteIntegrationMatch[1];
      logMock("debug", `\u5904\u7406DELETE\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
      try {
        await integration_default.deleteIntegration(id);
        sendJsonResponse(res, 200, {
          message: "\u96C6\u6210\u5220\u9664\u6210\u529F",
          success: true
        });
      } catch (error) {
        sendJsonResponse(res, 404, {
          error: "\u5220\u9664\u96C6\u6210\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    const testIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)\/test$/);
    if (testIntegrationMatch && method === "POST") {
      const id = testIntegrationMatch[1];
      logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
      try {
        const body = await parseRequestBody(req);
        const result = await integration_default.testIntegration(id, body);
        sendJsonResponse(res, 200, result);
      } catch (error) {
        sendJsonResponse(res, 400, {
          error: "\u6D4B\u8BD5\u96C6\u6210\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    const executeQueryMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)\/execute$/);
    if (executeQueryMatch && method === "POST") {
      const id = executeQueryMatch[1];
      logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
      try {
        const body = await parseRequestBody(req);
        const result = await integration_default.executeQuery(id, body);
        sendJsonResponse(res, 200, result);
      } catch (error) {
        sendJsonResponse(res, 400, {
          error: "\u6267\u884C\u96C6\u6210\u67E5\u8BE2\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
  }
  return false;
}
async function handleRequest(req, res, urlPath, urlQuery) {
  try {
    const normalizedPath = normalizeApiPath(urlPath);
    if (urlPath !== normalizedPath) {
      console.log(`[Mock\u4E2D\u95F4\u4EF6] \u4FEE\u6B63API\u8DEF\u5F84: ${urlPath} => ${normalizedPath}`);
    }
    let handled = false;
    if (normalizedPath.includes("/low-code/apis")) {
      console.log("[Mock] \u68C0\u6D4B\u5230\u96C6\u6210API\u8BF7\u6C42:", req.method, normalizedPath, urlQuery);
      handled = await handleIntegrationApi(req, res, normalizedPath, urlQuery);
      if (handled)
        return;
    }
    if (normalizedPath.includes("/datasources")) {
      handled = await handleDatasourcesApi(req, res, normalizedPath, urlQuery);
      if (handled)
        return;
    }
    if (normalizedPath.includes("/queries")) {
      handled = await handleQueriesApi(req, res, normalizedPath, urlQuery);
      if (handled)
        return;
    }
    if (!handled) {
      sendJsonResponse(res, 404, {
        error: "\u672A\u627E\u5230\u8BF7\u6C42\u7684API",
        message: `\u672A\u627E\u5230\u8DEF\u5F84: ${normalizedPath}`,
        success: false
      });
    }
  } catch (error) {
    console.error("[Mock] \u5904\u7406\u8BF7\u6C42\u65F6\u51FA\u9519:", error);
    sendJsonResponse(res, 500, {
      error: "\u5904\u7406\u8BF7\u6C42\u65F6\u51FA\u9519",
      message: error instanceof Error ? error.message : String(error),
      success: false
    });
  }
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
      await handleRequest(req, res, urlPath, urlQuery);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svZGF0YS9xdWVyeS50cyIsICJ2aXRlLmNvbmZpZy50cyIsICJzcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzIiwgInNyYy9tb2NrL2NvbmZpZy50cyIsICJzcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHMiLCAic3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy91dGlscy50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9xdWVyeS50cyIsICJzcmMvbW9jay9kYXRhL2ludGVncmF0aW9uLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2ludGVncmF0aW9uLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzIiwgInNyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL3F1ZXJ5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL3F1ZXJ5LnRzXCI7LyoqXG4gKiBcdTY3RTVcdThCRTJcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczXHU3Njg0XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBRdWVyeSB9IGZyb20gJ0AvdHlwZXMvcXVlcnknO1xuXG4vLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbmV4cG9ydCBjb25zdCBtb2NrUXVlcmllczogUXVlcnlbXSA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiB7XG4gIGNvbnN0IGlkID0gYHF1ZXJ5LSR7aSArIDF9YDtcbiAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKTtcbiAgXG4gIHJldHVybiB7XG4gICAgaWQsXG4gICAgbmFtZTogYFx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfWAsXG4gICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX0gXHU3Njg0XHU2M0NGXHU4RkYwYCxcbiAgICBmb2xkZXJJZDogaSAlIDMgPT09IDAgPyAnZm9sZGVyLTEnIDogKGkgJSAzID09PSAxID8gJ2ZvbGRlci0yJyA6ICdmb2xkZXItMycpLFxuICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICBkYXRhU291cmNlTmFtZTogYFx1NjU3MFx1NjM2RVx1NkU5MCAkeyhpICUgNSkgKyAxfWAsXG4gICAgcXVlcnlUeXBlOiBpICUgMiA9PT0gMCA/ICdTUUwnIDogJ05BVFVSQUxfTEFOR1VBR0UnLFxuICAgIHF1ZXJ5VGV4dDogaSAlIDIgPT09IDAgPyBcbiAgICAgIGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgIDogXG4gICAgICBgXHU2N0U1XHU2MjdFXHU2NzAwXHU4RkQxMTBcdTY3NjEke2kgJSAyID09PSAwID8gJ1x1OEJBMlx1NTM1NScgOiAnXHU3NTI4XHU2MjM3J31cdThCQjBcdTVGNTVgLFxuICAgIHN0YXR1czogaSAlIDQgPT09IDAgPyAnRFJBRlQnIDogKGkgJSA0ID09PSAxID8gJ1BVQkxJU0hFRCcgOiAoaSAlIDQgPT09IDIgPyAnREVQUkVDQVRFRCcgOiAnQVJDSElWRUQnKSksXG4gICAgc2VydmljZVN0YXR1czogaSAlIDIgPT09IDAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgdXBkYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgIGV4ZWN1dGlvbkNvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCksXG4gICAgaXNGYXZvcml0ZTogaSAlIDMgPT09IDAsXG4gICAgaXNBY3RpdmU6IGkgJSA1ICE9PSAwLFxuICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMCkudG9JU09TdHJpbmcoKSxcbiAgICByZXN1bHRDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgIGV4ZWN1dGlvblRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkgKyAxMCxcbiAgICB0YWdzOiBbYFx1NjgwN1x1N0I3RSR7aSsxfWAsIGBcdTdDN0JcdTU3OEIke2kgJSAzfWBdLFxuICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfSxcbiAgICB2ZXJzaW9uczogW3tcbiAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgcXVlcnlJZDogaWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9XVxuICB9O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1vY2tRdWVyaWVzOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCBQbHVnaW4sIENvbm5lY3QgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuaW1wb3J0IHsgY3JlYXRlU2ltcGxlTWlkZGxld2FyZSB9IGZyb20gJy4vc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgeyBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gJ2h0dHAnXG5cbi8vIFx1NUYzQVx1NTIzNlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFM1x1NTFGRFx1NjU3MFxuZnVuY3Rpb24ga2lsbFBvcnQocG9ydDogbnVtYmVyKSB7XG4gIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2OEMwXHU2N0U1XHU3QUVGXHU1M0UzICR7cG9ydH0gXHU1MzYwXHU3NTI4XHU2MEM1XHU1MUI1YCk7XG4gIHRyeSB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgIGV4ZWNTeW5jKGBuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9YCk7XG4gICAgICBleGVjU3luYyhgdGFza2tpbGwgL0YgL3BpZCAkKG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH0gfCBhd2sgJ3twcmludCAkNX0nKWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhlY1N5bmMoYGxzb2YgLWkgOiR7cG9ydH0gLXQgfCB4YXJncyBraWxsIC05YCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NURGMlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFMyAke3BvcnR9YCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NjcyQVx1ODhBQlx1NTM2MFx1NzUyOFx1NjIxNlx1NjVFMFx1NkNENVx1OTFDQVx1NjUzRWApO1xuICB9XG59XG5cbi8vIFx1NUYzQVx1NTIzNlx1NkUwNVx1NzQwNlZpdGVcdTdGMTNcdTVCNThcbmZ1bmN0aW9uIGNsZWFuVml0ZUNhY2hlKCkge1xuICBjb25zb2xlLmxvZygnW1ZpdGVdIFx1NkUwNVx1NzQwNlx1NEY5RFx1OEQ1Nlx1N0YxM1x1NUI1OCcpO1xuICBjb25zdCBjYWNoZVBhdGhzID0gW1xuICAgICcuL25vZGVfbW9kdWxlcy8udml0ZScsXG4gICAgJy4vbm9kZV9tb2R1bGVzLy52aXRlXyonLFxuICAgICcuLy52aXRlJyxcbiAgICAnLi9kaXN0JyxcbiAgICAnLi90bXAnLFxuICAgICcuLy50ZW1wJ1xuICBdO1xuICBcbiAgY2FjaGVQYXRocy5mb3JFYWNoKGNhY2hlUGF0aCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGNhY2hlUGF0aCkpIHtcbiAgICAgICAgaWYgKGZzLmxzdGF0U3luYyhjYWNoZVBhdGgpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBleGVjU3luYyhgcm0gLXJmICR7Y2FjaGVQYXRofWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLnVubGlua1N5bmMoY2FjaGVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NURGMlx1NTIyMFx1OTY2NDogJHtjYWNoZVBhdGh9YCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTY1RTBcdTZDRDVcdTUyMjBcdTk2NjQ6ICR7Y2FjaGVQYXRofWAsIGUpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIFx1NkUwNVx1NzQwNlZpdGVcdTdGMTNcdTVCNThcbmNsZWFuVml0ZUNhY2hlKCk7XG5cbi8vIFx1NUMxRFx1OEJENVx1OTFDQVx1NjUzRVx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1N0FFRlx1NTNFM1xua2lsbFBvcnQoODA4MCk7XG5cbi8vIFx1NTIxQlx1NUVGQU1vY2sgQVBJXHU2M0QyXHU0RUY2XG5mdW5jdGlvbiBjcmVhdGVNb2NrQXBpUGx1Z2luKHVzZU1vY2s6IGJvb2xlYW4sIHVzZVNpbXBsZU1vY2s6IGJvb2xlYW4pOiBQbHVnaW4gfCBudWxsIHtcbiAgaWYgKCF1c2VNb2NrICYmICF1c2VTaW1wbGVNb2NrKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgXG4gIC8vIFx1NTJBMFx1OEY3RFx1NEUyRFx1OTVGNFx1NEVGNlxuICBjb25zdCBtb2NrTWlkZGxld2FyZSA9IHVzZU1vY2sgPyBjcmVhdGVNb2NrTWlkZGxld2FyZSgpIDogbnVsbDtcbiAgY29uc3Qgc2ltcGxlTWlkZGxld2FyZSA9IHVzZVNpbXBsZU1vY2sgPyBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlKCkgOiBudWxsO1xuICBcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZS1wbHVnaW4tbW9jay1hcGknLFxuICAgIC8vIFx1NTE3M1x1OTUyRVx1NzBCOVx1RkYxQVx1NEY3Rlx1NzUyOCBwcmUgXHU3ODZFXHU0RkREXHU2QjY0XHU2M0QyXHU0RUY2XHU1MTQ4XHU0RThFXHU1MTg1XHU3RjZFXHU2M0QyXHU0RUY2XHU2MjY3XHU4ODRDXG4gICAgZW5mb3JjZTogJ3ByZScgYXMgY29uc3QsXG4gICAgLy8gXHU1NzI4XHU2NzBEXHU1MkExXHU1NjY4XHU1MjFCXHU1RUZBXHU0RTRCXHU1MjREXHU5MTREXHU3RjZFXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgLy8gXHU2NkZGXHU2MzYyXHU1MzlGXHU1OUNCXHU4QkY3XHU2QzQyXHU1OTA0XHU3NDA2XHU1NjY4XHVGRjBDXHU0RjdGXHU2MjExXHU0RUVDXHU3Njg0XHU0RTJEXHU5NUY0XHU0RUY2XHU1MTc3XHU2NzA5XHU2NzAwXHU5QUQ4XHU0RjE4XHU1MTQ4XHU3RUE3XG4gICAgICBjb25zdCBvcmlnaW5hbEhhbmRsZXIgPSBzZXJ2ZXIubWlkZGxld2FyZXMuaGFuZGxlO1xuICAgICAgXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMuaGFuZGxlID0gZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTNFQVx1NTkwNFx1NzQwNkFQSVx1OEJGN1x1NkM0MlxuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJy9hcGkvJykpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTYzRDJcdTRFRjZdIFx1NjhDMFx1NkQ0Qlx1NTIzMEFQSVx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3VybH1gKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTRGMThcdTUxNDhcdTU5MDRcdTc0MDZcdTcyNzlcdTVCOUFcdTZENEJcdThCRDVBUElcbiAgICAgICAgICBpZiAodXNlU2ltcGxlTW9jayAmJiBzaW1wbGVNaWRkbGV3YXJlICYmIHVybC5zdGFydHNXaXRoKCcvYXBpL3Rlc3QnKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTRGN0ZcdTc1MjhcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDY6ICR7dXJsfWApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdThCQkVcdTdGNkVcdTRFMDBcdTRFMkFcdTY4MDdcdThCQjBcdUZGMENcdTk2MzJcdTZCNjJcdTUxNzZcdTRFRDZcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTZCNjRcdThCRjdcdTZDNDJcbiAgICAgICAgICAgIChyZXEgYXMgYW55KS5fbW9ja0hhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gc2ltcGxlTWlkZGxld2FyZShyZXEsIHJlcywgKGVycj86IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU1MUZBXHU5NTE5OmAsIGVycik7XG4gICAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEocmVzIGFzIFNlcnZlclJlc3BvbnNlKS53cml0YWJsZUVuZGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NENEXHU1RTk0XHU2Q0ExXHU2NzA5XHU3RUQzXHU2NzVGXHVGRjBDXHU3RUU3XHU3RUVEXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU1OTA0XHU3NDA2XHU1MTc2XHU0RUQ2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgICAgaWYgKHVzZU1vY2sgJiYgbW9ja01pZGRsZXdhcmUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU0RjdGXHU3NTI4TW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNjogJHt1cmx9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFx1OEJCRVx1N0Y2RVx1NEUwMFx1NEUyQVx1NjgwN1x1OEJCMFx1RkYwQ1x1OTYzMlx1NkI2Mlx1NTE3Nlx1NEVENlx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgKHJlcSBhcyBhbnkpLl9tb2NrSGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBtb2NrTWlkZGxld2FyZShyZXEsIHJlcywgKGVycj86IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbTW9ja1x1NjNEMlx1NEVGNl0gTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NTFGQVx1OTUxOTpgLCBlcnIpO1xuICAgICAgICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghKHJlcyBhcyBTZXJ2ZXJSZXNwb25zZSkud3JpdGFibGVFbmRlZCkge1xuICAgICAgICAgICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NTRDRFx1NUU5NFx1NkNBMVx1NjcwOVx1N0VEM1x1Njc1Rlx1RkYwQ1x1N0VFN1x1N0VFRFx1NTkwNFx1NzQwNlxuICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBcdTVCRjlcdTRFOEVcdTk3NUVBUElcdThCRjdcdTZDNDJcdUZGMENcdTRGN0ZcdTc1MjhcdTUzOUZcdTU5Q0JcdTU5MDRcdTc0MDZcdTU2NjhcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsSGFuZGxlci5jYWxsKHNlcnZlci5taWRkbGV3YXJlcywgcmVxLCByZXMsIG5leHQpO1xuICAgICAgfTtcbiAgICB9XG4gIH07XG59XG5cbi8vIFx1NTdGQVx1NjcyQ1x1OTE0RFx1N0Y2RVxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAvLyBcdTUyQTBcdThGN0RcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcbiAgcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPSBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSB8fCAnZmFsc2UnO1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2sgQVBJIC0gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU4QkZCXHU1M0Q2XG4gIGNvbnN0IHVzZU1vY2tBcGkgPSBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU3OTgxXHU3NTI4SE1SIC0gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU4QkZCXHU1M0Q2XG4gIGNvbnN0IGRpc2FibGVIbXIgPSBwcm9jZXNzLmVudi5WSVRFX0RJU0FCTEVfSE1SID09PSAndHJ1ZSc7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTRGN0ZcdTc1MjhcdTdCODBcdTUzNTVcdTZENEJcdThCRDVcdTZBMjFcdTYyREZBUElcbiAgY29uc3QgdXNlU2ltcGxlTW9jayA9IHRydWU7XG4gIFxuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIFx1OEZEMFx1ODg0Q1x1NkEyMVx1NUYwRjogJHttb2RlfWApO1xuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIE1vY2sgQVBJOiAke3VzZU1vY2tBcGkgPyAnXHU1NDJGXHU3NTI4JyA6ICdcdTc5ODFcdTc1MjgnfWApO1xuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIFx1N0I4MFx1NTM1NU1vY2tcdTZENEJcdThCRDU6ICR7dXNlU2ltcGxlTW9jayA/ICdcdTU0MkZcdTc1MjgnIDogJ1x1Nzk4MVx1NzUyOCd9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gSE1SOiAke2Rpc2FibGVIbXIgPyAnXHU3OTgxXHU3NTI4JyA6ICdcdTU0MkZcdTc1MjgnfWApO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBTW9ja1x1NjNEMlx1NEVGNlxuICBjb25zdCBtb2NrUGx1Z2luID0gY3JlYXRlTW9ja0FwaVBsdWdpbih1c2VNb2NrQXBpLCB1c2VTaW1wbGVNb2NrKTtcbiAgXG4gIC8vIFx1OTE0RFx1N0Y2RVxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIC8vIFx1NkRGQlx1NTJBME1vY2tcdTYzRDJcdTRFRjZcdUZGMDhcdTU5ODJcdTY3OUNcdTU0MkZcdTc1MjhcdUZGMDlcbiAgICAgIC4uLihtb2NrUGx1Z2luID8gW21vY2tQbHVnaW5dIDogW10pLFxuICAgICAgdnVlKCksXG4gICAgXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IDgwODAsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICBvcGVuOiBmYWxzZSxcbiAgICAgIC8vIEhNUlx1OTE0RFx1N0Y2RVxuICAgICAgaG1yOiBkaXNhYmxlSG1yID8gZmFsc2UgOiB7XG4gICAgICAgIHByb3RvY29sOiAnd3MnLFxuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgICAgY2xpZW50UG9ydDogODA4MCxcbiAgICAgIH0sXG4gICAgICAvLyBcdTc5ODFcdTc1MjhcdTRFRTNcdTc0MDZcdUZGMENcdThCQTlcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTYyNDBcdTY3MDlcdThCRjdcdTZDNDJcbiAgICAgIHByb3h5OiB7fVxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIGxlc3M6IHtcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICAgIHRhcmdldDogJ2VzMjAxNScsXG4gICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgLy8gXHU1MzA1XHU1NDJCXHU1N0ZBXHU2NzJDXHU0RjlEXHU4RDU2XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgICd2dWUnLCBcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAncGluaWEnLFxuICAgICAgICAnYXhpb3MnLFxuICAgICAgICAnZGF5anMnLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUnLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL3poX0NOJ1xuICAgICAgXSxcbiAgICAgIC8vIFx1NjM5Mlx1OTY2NFx1NzI3OVx1NUI5QVx1NEY5RFx1OEQ1NlxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAvLyBcdTYzOTJcdTk2NjRcdTYzRDJcdTRFRjZcdTRFMkRcdTc2ODRcdTY3MERcdTUyQTFcdTU2NjhNb2NrXG4gICAgICAgICdzcmMvcGx1Z2lucy9zZXJ2ZXJNb2NrLnRzJyxcbiAgICAgICAgLy8gXHU2MzkyXHU5NjY0ZnNldmVudHNcdTY3MkNcdTU3MzBcdTZBMjFcdTU3NTdcdUZGMENcdTkwN0ZcdTUxNERcdTY3ODRcdTVFRkFcdTk1MTlcdThCRUZcbiAgICAgICAgJ2ZzZXZlbnRzJ1xuICAgICAgXSxcbiAgICAgIC8vIFx1Nzg2RVx1NEZERFx1NEY5RFx1OEQ1Nlx1OTg4NFx1Njc4NFx1NUVGQVx1NkI2M1x1Nzg2RVx1NUI4Q1x1NjIxMFxuICAgICAgZm9yY2U6IHRydWUsXG4gICAgfSxcbiAgICAvLyBcdTRGN0ZcdTc1MjhcdTUzNTVcdTcyRUNcdTc2ODRcdTdGMTNcdTVCNThcdTc2RUVcdTVGNTVcbiAgICBjYWNoZURpcjogJ25vZGVfbW9kdWxlcy8udml0ZV9jYWNoZScsXG4gICAgLy8gXHU5NjMyXHU2QjYyXHU1ODA2XHU2ODA4XHU2RUEyXHU1MUZBXG4gICAgZXNidWlsZDoge1xuICAgICAgbG9nT3ZlcnJpZGU6IHtcbiAgICAgICAgJ3RoaXMtaXMtdW5kZWZpbmVkLWluLWVzbSc6ICdzaWxlbnQnXG4gICAgICB9LFxuICAgIH1cbiAgfVxufSk7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTdCQTFcdTc0MDZcdTZBMjFcdTU3NTdcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0SFRUUFx1OEJGN1x1NkM0Mlx1NjJFNlx1NjIyQVx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFxuICogXHU4RDFGXHU4RDIzXHU3QkExXHU3NDA2XHU1NDhDXHU1MjA2XHU1M0QxXHU2MjQwXHU2NzA5QVBJXHU4QkY3XHU2QzQyXHU1MjMwXHU1QkY5XHU1RTk0XHU3Njg0XHU2NzBEXHU1MkExXHU1OTA0XHU3NDA2XHU1MUZEXHU2NTcwXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnLCBzaG91bGRNb2NrUmVxdWVzdCwgbG9nTW9jayB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NUJGQ1x1NTE2NVx1NjcwRFx1NTJBMVxuaW1wb3J0IHsgZGF0YVNvdXJjZVNlcnZpY2UsIHF1ZXJ5U2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzJztcbmltcG9ydCBpbnRlZ3JhdGlvblNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvaW50ZWdyYXRpb24nO1xuXG4vLyBcdTU5MDRcdTc0MDZDT1JTXHU4QkY3XHU2QzQyXG5mdW5jdGlvbiBoYW5kbGVDb3JzKHJlczogU2VydmVyUmVzcG9uc2UpIHtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uLCBYLU1vY2stRW5hYmxlZCcpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1NYXgtQWdlJywgJzg2NDAwJyk7XG59XG5cbi8vIFx1NTNEMVx1OTAwMUpTT05cdTU0Q0RcdTVFOTRcbmZ1bmN0aW9uIHNlbmRKc29uUmVzcG9uc2UocmVzOiBTZXJ2ZXJSZXNwb25zZSwgc3RhdHVzOiBudW1iZXIsIGRhdGE6IGFueSkge1xuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbi8vIFx1NUVGNlx1OEZERlx1NjI2N1x1ODg0Q1xuZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8vIFx1ODlFM1x1Njc5MFx1OEJGN1x1NkM0Mlx1NEY1M1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VSZXF1ZXN0Qm9keShyZXE6IEluY29taW5nTWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBib2R5ID0gJyc7XG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rKSA9PiB7XG4gICAgICBib2R5ICs9IGNodW5rLnRvU3RyaW5nKCk7XG4gICAgfSk7XG4gICAgcmVxLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlKGJvZHkgPyBKU09OLnBhcnNlKGJvZHkpIDoge30pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIFx1NjhDMFx1NjdFNVx1NUU3Nlx1NEZFRVx1NkI2M1x1OEJGN1x1NkM0Mlx1OERFRlx1NUY4NFx1RkYwQ1x1NTkwNFx1NzQwNlx1NTNFRlx1ODBGRFx1NUI1OFx1NTcyOFx1NzY4NFx1OTFDRFx1NTkwRC9hcGlcdTUyNERcdTdGMDBcbmNvbnN0IG5vcm1hbGl6ZUFwaVBhdGggPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAvLyBcdTc5RkJcdTk2NjRVUkxcdTRFMkRcdTUzRUZcdTgwRkRcdTVCNThcdTU3MjhcdTc2ODRcdTkxQ0RcdTU5MERcdTc2ODQvYXBpXHU1MjREXHU3RjAwXG4gIGlmICh1cmwuc3RhcnRzV2l0aCgnL2FwaS9hcGkvJykpIHtcbiAgICBjb25zdCBmaXhlZFVybCA9IHVybC5yZXBsYWNlKCcvYXBpL2FwaS8nLCAnL2FwaS8nKTtcbiAgICBjb25zb2xlLmxvZyhgW01vY2tcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NEZFRVx1NkI2M1x1OTFDRFx1NTkwRFx1NzY4NEFQSVx1OERFRlx1NUY4NDogJHt1cmx9ID0+ICR7Zml4ZWRVcmx9YCk7XG4gICAgcmV0dXJuIGZpeGVkVXJsO1xuICB9XG4gIHJldHVybiB1cmw7XG59O1xuXG4vLyBcdTU5MDRcdTc0MDZcdTY1NzBcdTYzNkVcdTZFOTBBUElcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZURhdGFzb3VyY2VzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcsIHVybFF1ZXJ5OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6IC9hcGkvZGF0YXNvdXJjZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU2NzBEXHU1MkExXHU1QzQyXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XHVGRjBDXHU2NTJGXHU2MzAxXHU1MjA2XHU5ODc1XHU1NDhDXHU4RkM3XHU2RUU0XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5nZXREYXRhU291cmNlcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nLFxuICAgICAgICB0eXBlOiB1cmxRdWVyeS50eXBlIGFzIHN0cmluZyxcbiAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcmVzdWx0Lml0ZW1zLCBcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhc291cmNlID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuZ2V0RGF0YVNvdXJjZShpZCk7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiBkYXRhc291cmNlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlIFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzJyAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6IC9hcGkvZGF0YXNvdXJjZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IG5ld0RhdGFTb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5jcmVhdGVEYXRhU291cmNlKGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7XG4gICAgICAgIGRhdGE6IG5ld0RhdGFTb3VyY2UsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMUJcdTVFRkFcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQVVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgdXBkYXRlZERhdGFTb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS51cGRhdGVEYXRhU291cmNlKGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB1cGRhdGVkRGF0YVNvdXJjZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkRFTEVURVx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmRlbGV0ZURhdGFTb3VyY2UoaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIG1lc3NhZ2U6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMjBcdTk2NjRcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2RDRCXHU4QkQ1XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkRFXHU2M0E1XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcy90ZXN0LWNvbm5lY3Rpb24nICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlcy90ZXN0LWNvbm5lY3Rpb25gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLnRlc3RDb25uZWN0aW9uKGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTZENEJcdThCRDVcdThGREVcdTYzQTVcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gXHU1OTA0XHU3NDA2XHU2N0U1XHU4QkUyQVBJXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVRdWVyaWVzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcsIHVybFF1ZXJ5OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIC8vIFx1NjhDMFx1NjdFNVVSTFx1NjYyRlx1NTQyNlx1NTMzOVx1OTE0RFx1NjdFNVx1OEJFMkFQSVxuICBjb25zdCBpc1F1ZXJpZXNQYXRoID0gdXJsUGF0aC5pbmNsdWRlcygnL3F1ZXJpZXMnKTtcbiAgXG4gIC8vIFx1NjI1M1x1NTM3MFx1NjI0MFx1NjcwOVx1NjdFNVx1OEJFMlx1NzZGOFx1NTE3M1x1OEJGN1x1NkM0Mlx1NEVFNVx1NEZCRlx1OEMwM1x1OEJENVxuICBpZiAoaXNRdWVyaWVzUGF0aCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU2OEMwXHU2RDRCXHU1MjMwXHU2N0U1XHU4QkUyQVBJXHU4QkY3XHU2QzQyOiAke21ldGhvZH0gJHt1cmxQYXRofWAsIHVybFF1ZXJ5KTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9xdWVyaWVzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXNgKTtcbiAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NTkwNFx1NzQwNlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1OEJGN1x1NkM0MiwgXHU1M0MyXHU2NTcwOicsIHVybFF1ZXJ5KTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU2NzBEXHU1MkExXHU1QzQyXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHVGRjBDXHU2NTJGXHU2MzAxXHU1MjA2XHU5ODc1XHU1NDhDXHU4RkM3XHU2RUU0XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcmllcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nLFxuICAgICAgICBkYXRhU291cmNlSWQ6IHVybFF1ZXJ5LmRhdGFTb3VyY2VJZCBhcyBzdHJpbmcsXG4gICAgICAgIHN0YXR1czogdXJsUXVlcnkuc3RhdHVzIGFzIHN0cmluZyxcbiAgICAgICAgcXVlcnlUeXBlOiB1cmxRdWVyeS5xdWVyeVR5cGUgYXMgc3RyaW5nLFxuICAgICAgICBpc0Zhdm9yaXRlOiB1cmxRdWVyeS5pc0Zhdm9yaXRlID09PSAndHJ1ZSdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1N0VEM1x1Njc5QzonLCB7XG4gICAgICAgIGl0ZW1zQ291bnQ6IHJlc3VsdC5pdGVtcy5sZW5ndGgsXG4gICAgICAgIHBhZ2luYXRpb246IHJlc3VsdC5wYWdpbmF0aW9uXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdThGRDRcdTU2REVcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTY1NzBcdTYzNkVcdTY4M0NcdTVGMEY6JywgeyBcbiAgICAgICAgZGF0YTogYEFycmF5WyR7cmVzdWx0Lml0ZW1zLmxlbmd0aH1dYCwgXG4gICAgICAgIHBhZ2luYXRpb246IHJlc3VsdC5wYWdpbmF0aW9uLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgLy8gXHU2OEMwXHU2N0U1cmVzdWx0Lml0ZW1zXHU2NjJGXHU1NDI2XHU1MzA1XHU1NDJCXHU2NTcwXHU2MzZFXHVGRjBDXHU1OTgyXHU2NzlDXHU0RTNBXHU3QTdBXHU1MjE5XHU0RUNFXHU1QkZDXHU1MTY1XHU3Njg0XHU2QTIxXHU1NzU3XHU0RTJEXHU4M0I3XHU1M0Q2XG4gICAgICBpZiAocmVzdWx0Lml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NTJBOFx1NjAwMVx1NUJGQ1x1NTE2NVx1NjVCOVx1NUYwRlx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NjU3MFx1NjM2RVx1RkYwQ1x1OTA3Rlx1NTE0RFx1NUZBQVx1NzNBRlx1NEY5RFx1OEQ1NlxuICAgICAgICAgIGNvbnN0IG1vY2tRdWVyeURhdGEgPSBhd2FpdCBpbXBvcnQoJy4uL2RhdGEvcXVlcnknKTtcbiAgICAgICAgICBjb25zdCBtb2NrUXVlcmllcyA9IG1vY2tRdWVyeURhdGEubW9ja1F1ZXJpZXMgfHwgW107XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKG1vY2tRdWVyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU0RTNBXHU3QTdBXHVGRjBDXHU0RjdGXHU3NTI4XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFOicsIG1vY2tRdWVyaWVzLmxlbmd0aCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBwYXJzZUludCh1cmxRdWVyeS5wYWdlIGFzIHN0cmluZykgfHwgMTtcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTA7XG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICAgICAgICAgICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBtb2NrUXVlcmllcy5sZW5ndGgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IG1vY2tRdWVyaWVzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgICAgICAgICAgY29uc3QgcGFnaW5hdGlvbiA9IHtcbiAgICAgICAgICAgICAgdG90YWw6IG1vY2tRdWVyaWVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgc2l6ZSxcbiAgICAgICAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKG1vY2tRdWVyaWVzLmxlbmd0aCAvIHNpemUpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgICAgICAgIGRhdGE6IHBhZ2luYXRlZEl0ZW1zLFxuICAgICAgICAgICAgICBwYWdpbmF0aW9uLFxuICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdbTW9ja10gXHU1QkZDXHU1MTY1XHU2N0U1XHU4QkUyXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU1OTMxXHU4RDI1OicsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdC5pdGVtcyxcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTW9ja10gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1OicsIGVycm9yKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBxdWVyeSA9IGF3YWl0IHF1ZXJ5U2VydmljZS5nZXRRdWVyeShpZCk7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHF1ZXJ5LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NjdFNVx1OEJFMlx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9xdWVyaWVzJyAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6IC9hcGkvcXVlcmllc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgbmV3UXVlcnkgPSBhd2FpdCBxdWVyeVNlcnZpY2UuY3JlYXRlUXVlcnkoYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDEsIHtcbiAgICAgICAgZGF0YTogbmV3UXVlcnksXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTUyMUJcdTVFRkFcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBVVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCB1cGRhdGVkUXVlcnkgPSBhd2FpdCBxdWVyeVNlcnZpY2UudXBkYXRlUXVlcnkoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHVwZGF0ZWRRdWVyeSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL2V4ZWN1dGUkLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKVszXTsgLy8gXHU2M0QwXHU1M0Q2SUQ6IC9hcGkvcXVlcmllcy97aWR9L2V4ZWN1dGVcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5leGVjdXRlUXVlcnkoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvdmVyc2lvbnMkLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCBxdWVyeUlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdOyAvLyBcdTYzRDBcdTUzRDZcdTY3RTVcdThCRTJJRDogL2FwaS9xdWVyaWVzL3tpZH0vdmVyc2lvbnNcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBcdTY3RTVcdThCRTJJRDogJHtxdWVyeUlkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmNyZWF0ZVF1ZXJ5VmVyc2lvbihxdWVyeUlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMSwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTUyMUJcdTVFRkFcdTYyMTBcdTUyOUYnXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC92ZXJzaW9ucyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgY29uc3QgcXVlcnlJZCA9IHVybFBhdGguc3BsaXQoJy8nKVszXTsgLy8gXHU2M0QwXHU1M0Q2XHU2N0U1XHU4QkUySUQ6IC9hcGkvcXVlcmllcy97aWR9L3ZlcnNpb25zXG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBcdTY3RTVcdThCRTJJRDogJHtxdWVyeUlkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCB2ZXJzaW9ucyA9IGF3YWl0IHF1ZXJ5U2VydmljZS5nZXRRdWVyeVZlcnNpb25zKHF1ZXJ5SWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHZlcnNpb25zLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1M0QxXHU1RTAzXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL3ZlcnNpb25zXFwvW15cXC9dK1xcL3B1Ymxpc2gkLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCB2ZXJzaW9uSWQgPSB1cmxQYXRoLnNwbGl0KCcvJylbNF07IC8vIFx1NjNEMFx1NTNENlx1NzI0OFx1NjcyQ0lEOiAvYXBpL3F1ZXJpZXMvdmVyc2lvbnMve2lkfS9wdWJsaXNoXG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgXHU3MjQ4XHU2NzJDSUQ6ICR7dmVyc2lvbklkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UucHVibGlzaFF1ZXJ5VmVyc2lvbih2ZXJzaW9uSWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTNEMVx1NUUwM1x1NjIxMFx1NTI5RidcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU1M0QxXHU1RTAzXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTZGQzBcdTZEM0JcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL3ZlcnNpb25zXFwvW15cXC9dK1xcL2FjdGl2YXRlJC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgY29uc3QgdXJsUGFydHMgPSB1cmxQYXRoLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgcXVlcnlJZCA9IHVybFBhcnRzWzNdOyAvLyBcdTYzRDBcdTUzRDZcdTY3RTVcdThCRTJJRDogL2FwaS9xdWVyaWVzL3txdWVyeUlkfS92ZXJzaW9ucy97dmVyc2lvbklkfS9hY3RpdmF0ZVxuICAgIGNvbnN0IHZlcnNpb25JZCA9IHVybFBhcnRzWzVdOyAvLyBcdTYzRDBcdTUzRDZcdTcyNDhcdTY3MkNJRFxuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIFx1NjdFNVx1OEJFMklEOiAke3F1ZXJ5SWR9LCBcdTcyNDhcdTY3MkNJRDogJHt2ZXJzaW9uSWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5hY3RpdmF0ZVF1ZXJ5VmVyc2lvbihxdWVyeUlkLCB2ZXJzaW9uSWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NkZDMFx1NkQzQlx1NjIxMFx1NTI5RidcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2RkMwXHU2RDNCXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1OTZDNlx1NjIxMEFQSVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSW50ZWdyYXRpb25BcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU2OEMwXHU2N0U1XHU5NkM2XHU2MjEwQVBJXHU4REVGXHU1Rjg0XG4gIGNvbnN0IGlzTG93Q29kZUFwaXNQYXRoID0gdXJsUGF0aC5pbmNsdWRlcygnL2FwaS9sb3ctY29kZS9hcGlzJyk7XG4gIFxuICBpZiAoaXNMb3dDb2RlQXBpc1BhdGgpIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NjhDMFx1NkQ0Qlx1NTIzMFx1OTZDNlx1NjIxMEFQSVx1OEJGN1x1NkM0MjonLCBtZXRob2QsIHVybFBhdGgsIHVybFF1ZXJ5KTtcbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTk2QzZcdTYyMTBcdTUyMTdcdTg4NjhcbiAgICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvbG93LWNvZGUvYXBpcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL2xvdy1jb2RlL2FwaXNgKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gXHU0RjdGXHU3NTI4XHU2NzBEXHU1MkExXHU1QzQyXHU4M0I3XHU1M0Q2XHU5NkM2XHU2MjEwXHU1MjE3XHU4ODY4XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5nZXRJbnRlZ3JhdGlvbnMoe1xuICAgICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICAgIHNpemU6IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMCxcbiAgICAgICAgICBuYW1lOiB1cmxRdWVyeS5uYW1lIGFzIHN0cmluZyxcbiAgICAgICAgICB0eXBlOiB1cmxRdWVyeS50eXBlIGFzIHN0cmluZyxcbiAgICAgICAgICBzdGF0dXM6IHVybFF1ZXJ5LnN0YXR1cyBhcyBzdHJpbmdcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTg5ODFcdTUxN0NcdTVCQjlcdTY1RTdcdTcyNDhcdTY4M0NcdTVGMEZcdUZGMENcdTc2RjRcdTYzQTVcdThGRDRcdTU2REVcdTY1NzBcdTdFQzRcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0gcmVzdWx0Lml0ZW1zO1xuICAgICAgICBcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgcmVzcG9uc2VEYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgICAgZXJyb3I6ICdcdTgzQjdcdTUzRDZcdTk2QzZcdTYyMTBcdTUyMTdcdTg4NjhcdTU5MzFcdThEMjUnLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBzaW5nbGVJbnRlZ3JhdGlvbk1hdGNoID0gdXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2xvdy1jb2RlXFwvYXBpc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAoc2luZ2xlSW50ZWdyYXRpb25NYXRjaCAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICBjb25zdCBpZCA9IHNpbmdsZUludGVncmF0aW9uTWF0Y2hbMV07XG4gICAgICBcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGludGVncmF0aW9uID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmdldEludGVncmF0aW9uKGlkKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NzZGNFx1NjNBNVx1OEZENFx1NTZERVx1OTZDNlx1NjIxMFx1NUJGOVx1OEM2MVx1RkYwQ1x1NEUwRFx1NTMwNVx1ODhDNVx1NTcyOGRhdGFcdTRFMkRcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgaW50ZWdyYXRpb24pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgICBlcnJvcjogJ1x1OTZDNlx1NjIxMFx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlIFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTk2QzZcdTYyMTBcbiAgICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvbG93LWNvZGUvYXBpcycgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6IC9hcGkvbG93LWNvZGUvYXBpc2ApO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgICBjb25zdCBuZXdJbnRlZ3JhdGlvbiA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5jcmVhdGVJbnRlZ3JhdGlvbihib2R5KTtcbiAgICAgICAgXG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDEsIG5ld0ludGVncmF0aW9uKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgICBlcnJvcjogJ1x1NTIxQlx1NUVGQVx1OTZDNlx1NjIxMFx1NTkzMVx1OEQyNScsXG4gICAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IHVwZGF0ZUludGVncmF0aW9uTWF0Y2ggPSB1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvbG93LWNvZGVcXC9hcGlzXFwvKFteXFwvXSspJC8pO1xuICAgIGlmICh1cGRhdGVJbnRlZ3JhdGlvbk1hdGNoICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gdXBkYXRlSW50ZWdyYXRpb25NYXRjaFsxXTtcbiAgICAgIFxuICAgICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UFVUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEludGVncmF0aW9uID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLnVwZGF0ZUludGVncmF0aW9uKGlkLCBib2R5KTtcbiAgICAgICAgXG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHVwZGF0ZWRJbnRlZ3JhdGlvbik7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTk2QzZcdTYyMTBcdTU5MzFcdThEMjUnLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMjBcdTk2NjRcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBkZWxldGVJbnRlZ3JhdGlvbk1hdGNoID0gdXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2xvdy1jb2RlXFwvYXBpc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAoZGVsZXRlSW50ZWdyYXRpb25NYXRjaCAmJiBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgICBjb25zdCBpZCA9IGRlbGV0ZUludGVncmF0aW9uTWF0Y2hbMV07XG4gICAgICBcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkRFTEVURVx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGludGVncmF0aW9uU2VydmljZS5kZWxldGVJbnRlZ3JhdGlvbihpZCk7XG4gICAgICAgIFxuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgICAgbWVzc2FnZTogJ1x1OTZDNlx1NjIxMFx1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXG4gICAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgICBlcnJvcjogJ1x1NTIyMFx1OTY2NFx1OTZDNlx1NjIxMFx1NTkzMVx1OEQyNScsXG4gICAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NkQ0Qlx1OEJENVx1OTZDNlx1NjIxMFx1OEZERVx1NjNBNVxuICAgIGNvbnN0IHRlc3RJbnRlZ3JhdGlvbk1hdGNoID0gdXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2xvdy1jb2RlXFwvYXBpc1xcLyhbXlxcL10rKVxcL3Rlc3QkLyk7XG4gICAgaWYgKHRlc3RJbnRlZ3JhdGlvbk1hdGNoICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICBjb25zdCBpZCA9IHRlc3RJbnRlZ3JhdGlvbk1hdGNoWzFdO1xuICAgICAgXG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLnRlc3RJbnRlZ3JhdGlvbihpZCwgYm9keSk7XG4gICAgICAgIFxuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCByZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICAgIGVycm9yOiAnXHU2RDRCXHU4QkQ1XHU5NkM2XHU2MjEwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MjY3XHU4ODRDXHU5NkM2XHU2MjEwXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgZXhlY3V0ZVF1ZXJ5TWF0Y2ggPSB1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvbG93LWNvZGVcXC9hcGlzXFwvKFteXFwvXSspXFwvZXhlY3V0ZSQvKTtcbiAgICBpZiAoZXhlY3V0ZVF1ZXJ5TWF0Y2ggJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gZXhlY3V0ZVF1ZXJ5TWF0Y2hbMV07XG4gICAgICBcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KGlkLCBib2R5KTtcbiAgICAgICAgXG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgICAgZXJyb3I6ICdcdTYyNjdcdTg4NENcdTk2QzZcdTYyMTBcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0MlxuICogQHBhcmFtIHJlcSBcdThCRjdcdTZDNDJcdTVCRjlcdThDNjFcbiAqIEBwYXJhbSByZXMgXHU1NENEXHU1RTk0XHU1QkY5XHU4QzYxXG4gKiBAcGFyYW0gdXJsUGF0aCBVUkxcdThERUZcdTVGODRcbiAqIEBwYXJhbSB1cmxRdWVyeSBVUkxcdTY3RTVcdThCRTJcdTUzQzJcdTY1NzBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZVJlcXVlc3QocmVxOiBhbnksIHJlczogYW55LCB1cmxQYXRoOiBzdHJpbmcsIHVybFF1ZXJ5OiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICAvLyBcdTRGN0ZcdTc1Mjhub3JtYWxpemVBcGlQYXRoXHU0RkVFXHU2QjYzXHU4REVGXHU1Rjg0XG4gICAgY29uc3Qgbm9ybWFsaXplZFBhdGggPSBub3JtYWxpemVBcGlQYXRoKHVybFBhdGgpO1xuICAgIFxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1OERFRlx1NUY4NFx1NEUwRFx1NTQwQ1x1RkYwQ1x1ODg2OFx1NzkzQVx1NURGMlx1NEZFRVx1NkI2M1x1OTFDRFx1NTkwRFx1NzY4NC9hcGlcbiAgICBpZiAodXJsUGF0aCAhPT0gbm9ybWFsaXplZFBhdGgpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NEUyRFx1OTVGNFx1NEVGNl0gXHU0RkVFXHU2QjYzQVBJXHU4REVGXHU1Rjg0OiAke3VybFBhdGh9ID0+ICR7bm9ybWFsaXplZFBhdGh9YCk7XG4gICAgfVxuXG4gICAgLy8gXHU1N0ZBXHU0RThFXHU0RkVFXHU2QjYzXHU1NDBFXHU3Njg0XHU4REVGXHU1Rjg0XHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXG4gICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcbiAgICBcbiAgICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTY2MkZcdTk2QzZcdTYyMTBBUEkgLSBcdTRGMThcdTUxNDhcdTU5MDRcdTc0MDZcdTRFRTVcdTkwN0ZcdTUxNERcdTUxQjJcdTdBODFcbiAgICBpZiAobm9ybWFsaXplZFBhdGguaW5jbHVkZXMoJy9sb3ctY29kZS9hcGlzJykpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU2OEMwXHU2RDRCXHU1MjMwXHU5NkM2XHU2MjEwQVBJXHU4QkY3XHU2QzQyOicsIHJlcS5tZXRob2QsIG5vcm1hbGl6ZWRQYXRoLCB1cmxRdWVyeSk7XG4gICAgICBoYW5kbGVkID0gYXdhaXQgaGFuZGxlSW50ZWdyYXRpb25BcGkocmVxLCByZXMsIG5vcm1hbGl6ZWRQYXRoLCB1cmxRdWVyeSk7XG4gICAgICBpZiAoaGFuZGxlZCkgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTY2MkZcdTY1NzBcdTYzNkVcdTZFOTBBUElcbiAgICBpZiAobm9ybWFsaXplZFBhdGguaW5jbHVkZXMoJy9kYXRhc291cmNlcycpKSB7XG4gICAgICBoYW5kbGVkID0gYXdhaXQgaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxLCByZXMsIG5vcm1hbGl6ZWRQYXRoLCB1cmxRdWVyeSk7XG4gICAgICBpZiAoaGFuZGxlZCkgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTY2MkZcdTY3RTVcdThCRTJBUElcbiAgICBpZiAobm9ybWFsaXplZFBhdGguaW5jbHVkZXMoJy9xdWVyaWVzJykpIHtcbiAgICAgIGhhbmRsZWQgPSBhd2FpdCBoYW5kbGVRdWVyaWVzQXBpKHJlcSwgcmVzLCBub3JtYWxpemVkUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgaWYgKGhhbmRsZWQpIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1OTgyXHU2NzlDXHU2Q0ExXHU2NzA5XHU4OEFCXHU1OTA0XHU3NDA2XHVGRjBDXHU1MjE5XHU4RkQ0XHU1NkRFNDA0XG4gICAgaWYgKCFoYW5kbGVkKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2NzJBXHU2MjdFXHU1MjMwXHU4QkY3XHU2QzQyXHU3Njg0QVBJJyxcbiAgICAgICAgbWVzc2FnZTogYFx1NjcyQVx1NjI3RVx1NTIzMFx1OERFRlx1NUY4NDogJHtub3JtYWxpemVkUGF0aH1gLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrXSBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTY1RjZcdTUxRkFcdTk1MTk6JywgZXJyb3IpO1xuICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHtcbiAgICAgIGVycm9yOiAnXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU2NUY2XHU1MUZBXHU5NTE5JyxcbiAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XG4gKiBAcmV0dXJucyBWaXRlXHU0RTJEXHU5NUY0XHU0RUY2XHU1MUZEXHU2NTcwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrTWlkZGxld2FyZSgpOiBDb25uZWN0Lk5leHRIYW5kbGVGdW5jdGlvbiB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBtb2NrTWlkZGxld2FyZShyZXE6IENvbm5lY3QuSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCBuZXh0OiBDb25uZWN0Lk5leHRGdW5jdGlvbikge1xuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjcyQVx1NTQyRlx1NzUyOE1vY2tcdTYyMTZcdThCRjdcdTZDNDJcdTRFMERcdTkwMDJcdTU0MDhNb2NrXHVGRjBDXHU3NkY0XHU2M0E1XHU0RjIwXHU5MDEyXHU3RUQ5XHU0RTBCXHU0RTAwXHU0RTJBXHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgaWYgKCFzaG91bGRNb2NrUmVxdWVzdChyZXEpKSB7XG4gICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCB1cmwgPSBwYXJzZShyZXEudXJsIHx8ICcnLCB0cnVlKTtcbiAgICBjb25zdCB1cmxQYXRoID0gdXJsLnBhdGhuYW1lIHx8ICcnO1xuICAgIGNvbnN0IHVybFF1ZXJ5ID0gdXJsLnF1ZXJ5IHx8IHt9O1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NjUzNlx1NTIzMFx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3VybFBhdGh9YCk7XG4gICAgXG4gICAgLy8gXHU1OTA0XHU3NDA2T1BUSU9OU1x1OEJGN1x1NkM0MlxuICAgIGlmIChyZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpID09PSAnT1BUSU9OUycpIHtcbiAgICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjA0O1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTRFM0FcdTYyNDBcdTY3MDlcdTU0Q0RcdTVFOTRcdTZERkJcdTUyQTBDT1JTXHU1OTM0XG4gICAgaGFuZGxlQ29ycyhyZXMpO1xuICAgIFxuICAgIC8vIFx1NkEyMVx1NjJERlx1N0Y1MVx1N0VEQ1x1NUVGNlx1OEZERlxuICAgIGlmIChtb2NrQ29uZmlnLmRlbGF5ID4gMCkge1xuICAgICAgYXdhaXQgZGVsYXkobW9ja0NvbmZpZy5kZWxheSk7XG4gICAgfVxuICAgIFxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBoYW5kbGVSZXF1ZXN0KHJlcSwgcmVzLCB1cmxQYXRoLCB1cmxRdWVyeSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIFx1NTkwNFx1NzQwNlx1NjI0MFx1NjcwOVx1NjcyQVx1NjM1NVx1ODNCN1x1NzY4NFx1OTUxOVx1OEJFRlxuICAgICAgY29uc29sZS5lcnJvcignW01vY2tdIFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NjVGNlx1NTNEMVx1NzUxRlx1OTUxOVx1OEJFRjonLCBlcnJvcik7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU2NzBEXHU1MkExXHU1NjY4XHU5NTE5XHU4QkVGJyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVNb2NrTWlkZGxld2FyZTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxuICogXG4gKiBcdTYzQTdcdTUyMzZNb2NrXHU2NzBEXHU1MkExXHU3Njg0XHU1NDJGXHU3NTI4L1x1Nzk4MVx1NzUyOFx1NzJCNlx1NjAwMVx1MzAwMVx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQlx1N0I0OVxuICovXG5cbi8vIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NjIxNlx1NTE2OFx1NUM0MFx1OEJCRVx1N0Y2RVx1NEUyRFx1ODNCN1x1NTNENlx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbmV4cG9ydCBmdW5jdGlvbiBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgLy8gXHU1NzI4Tm9kZS5qc1x1NzNBRlx1NTg4M1x1NEUyRFxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzXHU0RTJEXG4gICAgaWYgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52KSB7XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU2OEMwXHU2N0U1bG9jYWxTdG9yYWdlIChcdTRFQzVcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODMpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIGNvbnN0IGxvY2FsU3RvcmFnZVZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1VTRV9NT0NLX0FQSScpO1xuICAgICAgaWYgKGxvY2FsU3RvcmFnZVZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAobG9jYWxTdG9yYWdlVmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTlFRDhcdThCQTRcdTYwQzVcdTUxQjVcdUZGMUFcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEJcdTU0MkZcdTc1MjhcdUZGMENcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTc5ODFcdTc1MjhcbiAgICBjb25zdCBpc0RldmVsb3BtZW50ID0gXG4gICAgICAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB8fFxuICAgICAgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52ICYmIGltcG9ydC5tZXRhLmVudi5ERVYgPT09IHRydWUpO1xuICAgIFxuICAgIHJldHVybiBpc0RldmVsb3BtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIFx1NTFGQVx1OTUxOVx1NjVGNlx1NzY4NFx1NUI4OVx1NTE2OFx1NTZERVx1OTAwMFxuICAgIGNvbnNvbGUud2FybignW01vY2tdIFx1NjhDMFx1NjdFNVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NTFGQVx1OTUxOVx1RkYwQ1x1OUVEOFx1OEJBNFx1Nzk4MVx1NzUyOE1vY2tcdTY3MERcdTUyQTEnLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1NTQxMVx1NTQwRVx1NTE3Q1x1NUJCOVx1NjVFN1x1NEVFM1x1NzgwMVx1NzY4NFx1NTFGRFx1NjU3MFxuZXhwb3J0IGZ1bmN0aW9uIGlzTW9ja0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0VuYWJsZWQoKTtcbn1cblxuLy8gTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVxuZXhwb3J0IGNvbnN0IG1vY2tDb25maWcgPSB7XG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgZW5hYmxlZDogaXNFbmFibGVkKCksXG4gIFxuICAvLyBcdThCRjdcdTZDNDJcdTVFRjZcdThGREZcdUZGMDhcdTZCRUJcdTc5RDJcdUZGMDlcbiAgZGVsYXk6IDMwMCxcbiAgXG4gIC8vIEFQSVx1NTdGQVx1Nzg0MFx1OERFRlx1NUY4NFx1RkYwQ1x1NzUyOFx1NEU4RVx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1OTcwMFx1ODk4MVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuICBhcGlCYXNlUGF0aDogJy9hcGknLFxuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCOiAnbm9uZScsICdlcnJvcicsICdpbmZvJywgJ2RlYnVnJ1xuICBsb2dMZXZlbDogJ2RlYnVnJyxcbiAgXG4gIC8vIFx1NTQyRlx1NzUyOFx1NzY4NFx1NkEyMVx1NTc1N1xuICBtb2R1bGVzOiB7XG4gICAgZGF0YXNvdXJjZXM6IHRydWUsXG4gICAgcXVlcmllczogdHJ1ZSxcbiAgICB1c2VyczogdHJ1ZSxcbiAgICB2aXN1YWxpemF0aW9uczogdHJ1ZVxuICB9XG59O1xuXG4vLyBcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRNb2NrUmVxdWVzdChyZXE6IGFueSk6IGJvb2xlYW4ge1xuICAvLyBcdTVGQzVcdTk4N0JcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZVUkxcdUZGMENcdTc4NkVcdTRGRER1cmxcdTY2MkZcdTVCNTdcdTdCMjZcdTRFMzJcbiAgY29uc3QgdXJsID0gcmVxPy51cmwgfHwgJyc7XG4gIGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrXSBcdTY1MzZcdTUyMzBcdTk3NUVcdTVCNTdcdTdCMjZcdTRFMzJVUkw6JywgdXJsKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFx1NUZDNVx1OTg3Qlx1NjYyRkFQSVx1OEJGN1x1NkM0MlxuICBpZiAoIXVybC5zdGFydHNXaXRoKG1vY2tDb25maWcuYXBpQmFzZVBhdGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdThERUZcdTVGODRcdTY4QzBcdTY3RTVcdTkwMUFcdThGQzdcdUZGMENcdTVFOTRcdThCRTVcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFx1OEJCMFx1NUY1NVx1NjVFNVx1NUZEN1xuZXhwb3J0IGZ1bmN0aW9uIGxvZ01vY2sobGV2ZWw6ICdlcnJvcicgfCAnaW5mbycgfCAnZGVidWcnLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICBjb25zdCB7IGxvZ0xldmVsIH0gPSBtb2NrQ29uZmlnO1xuICBcbiAgaWYgKGxvZ0xldmVsID09PSAnbm9uZScpIHJldHVybjtcbiAgXG4gIGlmIChsZXZlbCA9PT0gJ2Vycm9yJyAmJiBbJ2Vycm9yJywgJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTW9jayBFUlJPUl0nLCAuLi5hcmdzKTtcbiAgfSBlbHNlIGlmIChsZXZlbCA9PT0gJ2luZm8nICYmIFsnaW5mbycsICdkZWJ1ZyddLmluY2x1ZGVzKGxvZ0xldmVsKSkge1xuICAgIGNvbnNvbGUuaW5mbygnW01vY2sgSU5GT10nLCAuLi5hcmdzKTtcbiAgfSBlbHNlIGlmIChsZXZlbCA9PT0gJ2RlYnVnJyAmJiBsb2dMZXZlbCA9PT0gJ2RlYnVnJykge1xuICAgIGNvbnNvbGUubG9nKCdbTW9jayBERUJVR10nLCAuLi5hcmdzKTtcbiAgfVxufVxuXG4vLyBcdTUyMURcdTU5Q0JcdTUzMTZcdTY1RjZcdThGOTNcdTUxRkFNb2NrXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxXG50cnkge1xuICBjb25zb2xlLmxvZyhgW01vY2tdIFx1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMTogJHttb2NrQ29uZmlnLmVuYWJsZWQgPyAnXHU1REYyXHU1NDJGXHU3NTI4JyA6ICdcdTVERjJcdTc5ODFcdTc1MjgnfWApO1xuICBpZiAobW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTkxNERcdTdGNkU6YCwge1xuICAgICAgZGVsYXk6IG1vY2tDb25maWcuZGVsYXksXG4gICAgICBhcGlCYXNlUGF0aDogbW9ja0NvbmZpZy5hcGlCYXNlUGF0aCxcbiAgICAgIGxvZ0xldmVsOiBtb2NrQ29uZmlnLmxvZ0xldmVsLFxuICAgICAgZW5hYmxlZE1vZHVsZXM6IE9iamVjdC5lbnRyaWVzKG1vY2tDb25maWcubW9kdWxlcylcbiAgICAgICAgLmZpbHRlcigoW18sIGVuYWJsZWRdKSA9PiBlbmFibGVkKVxuICAgICAgICAubWFwKChbbmFtZV0pID0+IG5hbWUpXG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGNvbnNvbGUud2FybignW01vY2tdIFx1OEY5M1x1NTFGQVx1OTE0RFx1N0Y2RVx1NEZFMVx1NjA2Rlx1NTFGQVx1OTUxOScsIGVycm9yKTtcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHNcIjsvKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5MFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY1NzBcdTYzNkVcdTZFOTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdUZGMENcdTc1MjhcdTRFOEVcdTVGMDBcdTUzRDFcdTU0OENcdTZENEJcdThCRDVcbiAqL1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTdDN0JcdTU3OEJcbmV4cG9ydCB0eXBlIERhdGFTb3VyY2VUeXBlID0gJ215c3FsJyB8ICdwb3N0Z3Jlc3FsJyB8ICdvcmFjbGUnIHwgJ3NxbHNlcnZlcicgfCAnc3FsaXRlJztcblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU3MkI2XHU2MDAxXG5leHBvcnQgdHlwZSBEYXRhU291cmNlU3RhdHVzID0gJ2FjdGl2ZScgfCAnaW5hY3RpdmUnIHwgJ2Vycm9yJyB8ICdwZW5kaW5nJztcblxuLy8gXHU1NDBDXHU2QjY1XHU5ODkxXHU3Mzg3XG5leHBvcnQgdHlwZSBTeW5jRnJlcXVlbmN5ID0gJ21hbnVhbCcgfCAnaG91cmx5JyB8ICdkYWlseScgfCAnd2Vla2x5JyB8ICdtb250aGx5JztcblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU2M0E1XHU1M0UzXG5leHBvcnQgaW50ZXJmYWNlIERhdGFTb3VyY2Uge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICB0eXBlOiBEYXRhU291cmNlVHlwZTtcbiAgaG9zdD86IHN0cmluZztcbiAgcG9ydD86IG51bWJlcjtcbiAgZGF0YWJhc2VOYW1lPzogc3RyaW5nO1xuICB1c2VybmFtZT86IHN0cmluZztcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gIHN0YXR1czogRGF0YVNvdXJjZVN0YXR1cztcbiAgc3luY0ZyZXF1ZW5jeT86IFN5bmNGcmVxdWVuY3k7XG4gIGxhc3RTeW5jVGltZT86IHN0cmluZyB8IG51bGw7XG4gIGNyZWF0ZWRBdDogc3RyaW5nO1xuICB1cGRhdGVkQXQ6IHN0cmluZztcbiAgaXNBY3RpdmU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKi9cbmV4cG9ydCBjb25zdCBtb2NrRGF0YVNvdXJjZXM6IERhdGFTb3VyY2VbXSA9IFtcbiAge1xuICAgIGlkOiAnZHMtMScsXG4gICAgbmFtZTogJ015U1FMXHU3OTNBXHU0RjhCXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4Qk15U1FMXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnbXlzcWwnLFxuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHBvcnQ6IDMzMDYsXG4gICAgZGF0YWJhc2VOYW1lOiAnZXhhbXBsZV9kYicsXG4gICAgdXNlcm5hbWU6ICd1c2VyJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdkYWlseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMicsXG4gICAgbmFtZTogJ1Bvc3RncmVTUUxcdTc1MUZcdTRFQTdcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ3Bvc3RncmVzcWwnLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMTAwJyxcbiAgICBwb3J0OiA1NDMyLFxuICAgIGRhdGFiYXNlTmFtZTogJ3Byb2R1Y3Rpb25fZGInLFxuICAgIHVzZXJuYW1lOiAnYWRtaW4nLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2hvdXJseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzYwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA3Nzc2MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0zJyxcbiAgICBuYW1lOiAnU1FMaXRlXHU2NzJDXHU1NzMwXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NjcyQ1x1NTczMFNRTGl0ZVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ3NxbGl0ZScsXG4gICAgZGF0YWJhc2VOYW1lOiAnL3BhdGgvdG8vbG9jYWwuZGInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzQ1NjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTQnLFxuICAgIG5hbWU6ICdTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFNRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTczQUZcdTU4ODMnLFxuICAgIHR5cGU6ICdzcWxzZXJ2ZXInLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMjAwJyxcbiAgICBwb3J0OiAxNDMzLFxuICAgIGRhdGFiYXNlTmFtZTogJ3Rlc3RfZGInLFxuICAgIHVzZXJuYW1lOiAndGVzdGVyJyxcbiAgICBzdGF0dXM6ICdpbmFjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ3dlZWtseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNjA0ODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDUxODQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogZmFsc2VcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtNScsXG4gICAgbmFtZTogJ09yYWNsZVx1NEYwMVx1NEUxQVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBPcmFjbGVcdTRGMDFcdTRFMUFcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdvcmFjbGUnLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMTUwJyxcbiAgICBwb3J0OiAxNTIxLFxuICAgIGRhdGFiYXNlTmFtZTogJ2VudGVycHJpc2VfZGInLFxuICAgIHVzZXJuYW1lOiAnc3lzdGVtJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdkYWlseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDEwMzY4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfVxuXTtcblxuLyoqXG4gKiBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBjb3VudCBcdTc1MUZcdTYyMTBcdTY1NzBcdTkxQ0ZcbiAqIEByZXR1cm5zIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1N0VDNFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVNb2NrRGF0YVNvdXJjZXMoY291bnQ6IG51bWJlciA9IDUpOiBEYXRhU291cmNlW10ge1xuICBjb25zdCB0eXBlczogRGF0YVNvdXJjZVR5cGVbXSA9IFsnbXlzcWwnLCAncG9zdGdyZXNxbCcsICdvcmFjbGUnLCAnc3Fsc2VydmVyJywgJ3NxbGl0ZSddO1xuICBjb25zdCBzdGF0dXNlczogRGF0YVNvdXJjZVN0YXR1c1tdID0gWydhY3RpdmUnLCAnaW5hY3RpdmUnLCAnZXJyb3InLCAncGVuZGluZyddO1xuICBjb25zdCBzeW5jRnJlcXM6IFN5bmNGcmVxdWVuY3lbXSA9IFsnbWFudWFsJywgJ2hvdXJseScsICdkYWlseScsICd3ZWVrbHknLCAnbW9udGhseSddO1xuICBcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVzW2kgJSB0eXBlcy5sZW5ndGhdO1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBgZHMtZ2VuLSR7aSArIDF9YCxcbiAgICAgIG5hbWU6IGBcdTc1MUZcdTYyMTBcdTc2ODQke3R5cGV9XHU2NTcwXHU2MzZFXHU2RTkwICR7aSArIDF9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU3Njg0JHt0eXBlfVx1N0M3Qlx1NTc4Qlx1NjU3MFx1NjM2RVx1NkU5MCAke2kgKyAxfWAsXG4gICAgICB0eXBlLFxuICAgICAgaG9zdDogdHlwZSAhPT0gJ3NxbGl0ZScgPyAnbG9jYWxob3N0JyA6IHVuZGVmaW5lZCxcbiAgICAgIHBvcnQ6IHR5cGUgIT09ICdzcWxpdGUnID8gKDMzMDYgKyBpKSA6IHVuZGVmaW5lZCxcbiAgICAgIGRhdGFiYXNlTmFtZTogdHlwZSA9PT0gJ3NxbGl0ZScgPyBgL3BhdGgvdG8vZGJfJHtpfS5kYmAgOiBgZXhhbXBsZV9kYl8ke2l9YCxcbiAgICAgIHVzZXJuYW1lOiB0eXBlICE9PSAnc3FsaXRlJyA/IGB1c2VyXyR7aX1gIDogdW5kZWZpbmVkLFxuICAgICAgc3RhdHVzOiBzdGF0dXNlc1tpICUgc3RhdHVzZXMubGVuZ3RoXSxcbiAgICAgIHN5bmNGcmVxdWVuY3k6IHN5bmNGcmVxc1tpICUgc3luY0ZyZXFzLmxlbmd0aF0sXG4gICAgICBsYXN0U3luY1RpbWU6IGkgJSAzID09PSAwID8gbnVsbCA6IG5ldyBEYXRlKG5vdyAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUobm93IC0gKGkgKyAxMCkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUobm93IC0gaSAqIDQzMjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgaXNBY3RpdmU6IGkgJSA0ICE9PSAwXG4gICAgfTtcbiAgfSk7XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1OUVEOFx1OEJBNFx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuZXhwb3J0IGRlZmF1bHQgbW9ja0RhdGFTb3VyY2VzOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHNcIjsvKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5ME1vY2tcdTY3MERcdTUyQTFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2NTcwXHU2MzZFXHU2RTkwXHU3NkY4XHU1MTczQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU1QjlFXHU3M0IwXG4gKi9cblxuaW1wb3J0IHsgbW9ja0RhdGFTb3VyY2VzIH0gZnJvbSAnLi4vZGF0YS9kYXRhc291cmNlJztcbmltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZSB9IGZyb20gJy4uL2RhdGEvZGF0YXNvdXJjZSc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU0RTM0XHU2NUY2XHU1QjU4XHU1MEE4XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHVGRjBDXHU1MTQxXHU4QkI4XHU2QTIxXHU2MkRGXHU1ODlFXHU1MjIwXHU2NTM5XHU2NENEXHU0RjVDXG5sZXQgZGF0YVNvdXJjZXMgPSBbLi4ubW9ja0RhdGFTb3VyY2VzXTtcblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXkgPSB0eXBlb2YgbW9ja0NvbmZpZy5kZWxheSA9PT0gJ251bWJlcicgPyBtb2NrQ29uZmlnLmRlbGF5IDogMzAwO1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG59XG5cbi8qKlxuICogXHU5MUNEXHU3RjZFXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU2MzZFXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldERhdGFTb3VyY2VzKCk6IHZvaWQge1xuICBkYXRhU291cmNlcyA9IFsuLi5tb2NrRGF0YVNvdXJjZXNdO1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICogQHBhcmFtIHBhcmFtcyBcdTY3RTVcdThCRTJcdTUzQzJcdTY1NzBcbiAqIEByZXR1cm5zIFx1NTIwNlx1OTg3NVx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YVNvdXJjZXMocGFyYW1zPzoge1xuICBwYWdlPzogbnVtYmVyO1xuICBzaXplPzogbnVtYmVyO1xuICBuYW1lPzogc3RyaW5nO1xuICB0eXBlPzogc3RyaW5nO1xuICBzdGF0dXM/OiBzdHJpbmc7XG59KTogUHJvbWlzZTx7XG4gIGl0ZW1zOiBEYXRhU291cmNlW107XG4gIHBhZ2luYXRpb246IHtcbiAgICB0b3RhbDogbnVtYmVyO1xuICAgIHBhZ2U6IG51bWJlcjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgdG90YWxQYWdlczogbnVtYmVyO1xuICB9O1xufT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICBcbiAgLy8gXHU1RTk0XHU3NTI4XHU4RkM3XHU2RUU0XG4gIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLmRhdGFTb3VyY2VzXTtcbiAgXG4gIC8vIFx1NjMwOVx1NTQwRFx1NzlGMFx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy5uYW1lKSB7XG4gICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IFxuICAgICAgZHMubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgKGRzLmRlc2NyaXB0aW9uICYmIGRzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgKTtcbiAgfVxuICBcbiAgLy8gXHU2MzA5XHU3QzdCXHU1NzhCXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/LnR5cGUpIHtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gZHMudHlwZSA9PT0gcGFyYW1zLnR5cGUpO1xuICB9XG4gIFxuICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IGRzLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gIH1cbiAgXG4gIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKTtcbiAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICBcbiAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gIHJldHVybiB7XG4gICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgIHBhZ2UsXG4gICAgICBzaXplLFxuICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqIEByZXR1cm5zIFx1NjU3MFx1NjM2RVx1NkU5MFx1OEJFNlx1NjBDNVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YVNvdXJjZShpZDogc3RyaW5nKTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTY3RTVcdTYyN0VcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2VzLmZpbmQoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmICghZGF0YVNvdXJjZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICByZXR1cm4gZGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBkYXRhIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1NjM2RVxuICogQHJldHVybnMgXHU1MjFCXHU1RUZBXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVEYXRhU291cmNlKGRhdGE6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMElEXG4gIGNvbnN0IG5ld0lkID0gYGRzLSR7RGF0ZS5ub3coKX1gO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IG5ld0RhdGFTb3VyY2U6IERhdGFTb3VyY2UgPSB7XG4gICAgaWQ6IG5ld0lkLFxuICAgIG5hbWU6IGRhdGEubmFtZSB8fCAnTmV3IERhdGEgU291cmNlJyxcbiAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICB0eXBlOiBkYXRhLnR5cGUgfHwgJ215c3FsJyxcbiAgICBob3N0OiBkYXRhLmhvc3QsXG4gICAgcG9ydDogZGF0YS5wb3J0LFxuICAgIGRhdGFiYXNlTmFtZTogZGF0YS5kYXRhYmFzZU5hbWUsXG4gICAgdXNlcm5hbWU6IGRhdGEudXNlcm5hbWUsXG4gICAgc3RhdHVzOiBkYXRhLnN0YXR1cyB8fCAncGVuZGluZycsXG4gICAgc3luY0ZyZXF1ZW5jeTogZGF0YS5zeW5jRnJlcXVlbmN5IHx8ICdtYW51YWwnLFxuICAgIGxhc3RTeW5jVGltZTogbnVsbCxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9O1xuICBcbiAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU1MjE3XHU4ODY4XG4gIGRhdGFTb3VyY2VzLnB1c2gobmV3RGF0YVNvdXJjZSk7XG4gIFxuICByZXR1cm4gbmV3RGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICogQHBhcmFtIGRhdGEgXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXG4gKiBAcmV0dXJucyBcdTY2RjRcdTY1QjBcdTU0MEVcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZURhdGFTb3VyY2UoaWQ6IHN0cmluZywgZGF0YTogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2MjdFXHU1MjMwXHU4OTgxXHU2NkY0XHU2NUIwXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXHU3RDIyXHU1RjE1XG4gIGNvbnN0IGluZGV4ID0gZGF0YVNvdXJjZXMuZmluZEluZGV4KGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIC8vIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCB1cGRhdGVkRGF0YVNvdXJjZTogRGF0YVNvdXJjZSA9IHtcbiAgICAuLi5kYXRhU291cmNlc1tpbmRleF0sXG4gICAgLi4uZGF0YSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICB9O1xuICBcbiAgLy8gXHU2NkZGXHU2MzYyXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGRhdGFTb3VyY2VzW2luZGV4XSA9IHVwZGF0ZWREYXRhU291cmNlO1xuICBcbiAgcmV0dXJuIHVwZGF0ZWREYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVEYXRhU291cmNlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjI3RVx1NTIzMFx1ODk4MVx1NTIyMFx1OTY2NFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFx1N0QyMlx1NUYxNVxuICBjb25zdCBpbmRleCA9IGRhdGFTb3VyY2VzLmZpbmRJbmRleChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgZGF0YVNvdXJjZXMuc3BsaWNlKGluZGV4LCAxKTtcbn1cblxuLyoqXG4gKiBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAqIEBwYXJhbSBwYXJhbXMgXHU4RkRFXHU2M0E1XHU1M0MyXHU2NTcwXG4gKiBAcmV0dXJucyBcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTdFRDNcdTY3OUNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3RDb25uZWN0aW9uKHBhcmFtczogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8e1xuICBzdWNjZXNzOiBib29sZWFuO1xuICBtZXNzYWdlPzogc3RyaW5nO1xuICBkZXRhaWxzPzogYW55O1xufT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU1QjlFXHU5NjQ1XHU0RjdGXHU3NTI4XHU2NUY2XHU1M0VGXHU4MEZEXHU0RjFBXHU2NzA5XHU2NkY0XHU1OTBEXHU2NzQyXHU3Njg0XHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU5MDNCXHU4RjkxXG4gIC8vIFx1OEZEOVx1OTFDQ1x1N0I4MFx1NTM1NVx1NkEyMVx1NjJERlx1NjIxMFx1NTI5Ri9cdTU5MzFcdThEMjVcbiAgY29uc3Qgc3VjY2VzcyA9IE1hdGgucmFuZG9tKCkgPiAwLjI7IC8vIDgwJVx1NjIxMFx1NTI5Rlx1NzM4N1xuICBcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzLFxuICAgIG1lc3NhZ2U6IHN1Y2Nlc3MgPyAnXHU4RkRFXHU2M0E1XHU2MjEwXHU1MjlGJyA6ICdcdThGREVcdTYzQTVcdTU5MzFcdThEMjU6IFx1NjVFMFx1NkNENVx1OEZERVx1NjNBNVx1NTIzMFx1NjU3MFx1NjM2RVx1NUU5M1x1NjcwRFx1NTJBMVx1NTY2OCcsXG4gICAgZGV0YWlsczogc3VjY2VzcyA/IHtcbiAgICAgIHJlc3BvbnNlVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApICsgMTAsXG4gICAgICB2ZXJzaW9uOiAnOC4wLjI4JyxcbiAgICAgIGNvbm5lY3Rpb25JZDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApICsgMTAwMFxuICAgIH0gOiB7XG4gICAgICBlcnJvckNvZGU6ICdDT05ORUNUSU9OX1JFRlVTRUQnLFxuICAgICAgZXJyb3JEZXRhaWxzOiAnXHU2NUUwXHU2Q0Q1XHU1RUZBXHU3QUNCXHU1MjMwXHU2NzBEXHU1MkExXHU1NjY4XHU3Njg0XHU4RkRFXHU2M0E1XHVGRjBDXHU4QkY3XHU2OEMwXHU2N0U1XHU3RjUxXHU3RURDXHU4QkJFXHU3RjZFXHU1NDhDXHU1MUVEXHU2MzZFJ1xuICAgIH1cbiAgfTtcbn1cblxuLy8gXHU1QkZDXHU1MUZBXHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldERhdGFTb3VyY2VzLFxuICBnZXREYXRhU291cmNlLFxuICBjcmVhdGVEYXRhU291cmNlLFxuICB1cGRhdGVEYXRhU291cmNlLFxuICBkZWxldGVEYXRhU291cmNlLFxuICB0ZXN0Q29ubmVjdGlvbixcbiAgcmVzZXREYXRhU291cmNlc1xufTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy91dGlscy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvdXRpbHMudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTkwMUFcdTc1MjhcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU1MjFCXHU1RUZBXHU3RURGXHU0RTAwXHU2ODNDXHU1RjBGXHU1NENEXHU1RTk0XHU3Njg0XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG4gKi9cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTZBMjFcdTYyREZBUElcdTYyMTBcdTUyOUZcdTU0Q0RcdTVFOTRcbiAqIEBwYXJhbSBkYXRhIFx1NTRDRFx1NUU5NFx1NjU3MFx1NjM2RVxuICogQHBhcmFtIHN1Y2Nlc3MgXHU2MjEwXHU1MjlGXHU3MkI2XHU2MDAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBdHJ1ZVxuICogQHBhcmFtIG1lc3NhZ2UgXHU1M0VGXHU5MDA5XHU2RDg4XHU2MDZGXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTY4M0NcdTVGMEZcdTc2ODRBUElcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tSZXNwb25zZTxUPihcbiAgZGF0YTogVCwgXG4gIHN1Y2Nlc3M6IGJvb2xlYW4gPSB0cnVlLCBcbiAgbWVzc2FnZT86IHN0cmluZ1xuKSB7XG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBkYXRhLFxuICAgIG1lc3NhZ2UsXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgbW9ja1Jlc3BvbnNlOiB0cnVlIC8vIFx1NjgwN1x1OEJCMFx1NEUzQVx1NkEyMVx1NjJERlx1NTRDRFx1NUU5NFxuICB9O1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NkEyMVx1NjJERkFQSVx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICogQHBhcmFtIG1lc3NhZ2UgXHU5NTE5XHU4QkVGXHU2RDg4XHU2MDZGXG4gKiBAcGFyYW0gY29kZSBcdTk1MTlcdThCRUZcdTRFRTNcdTc4MDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0EnTU9DS19FUlJPUidcbiAqIEBwYXJhbSBzdGF0dXMgSFRUUFx1NzJCNlx1NjAwMVx1NzgwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQTUwMFxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHU3Njg0XHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZShcbiAgbWVzc2FnZTogc3RyaW5nLCBcbiAgY29kZTogc3RyaW5nID0gJ01PQ0tfRVJST1InLCBcbiAgc3RhdHVzOiBudW1iZXIgPSA1MDBcbikge1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgIGVycm9yOiB7XG4gICAgICBtZXNzYWdlLFxuICAgICAgY29kZSxcbiAgICAgIHN0YXR1c0NvZGU6IHN0YXR1c1xuICAgIH0sXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgbW9ja1Jlc3BvbnNlOiB0cnVlXG4gIH07XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU1MjA2XHU5ODc1XHU1NENEXHU1RTk0XHU3RUQzXHU2Nzg0XG4gKiBAcGFyYW0gaXRlbXMgXHU1RjUzXHU1MjREXHU5ODc1XHU3Njg0XHU5ODc5XHU3NkVFXHU1MjE3XHU4ODY4XG4gKiBAcGFyYW0gdG90YWxJdGVtcyBcdTYwM0JcdTk4NzlcdTc2RUVcdTY1NzBcbiAqIEBwYXJhbSBwYWdlIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzgwMVxuICogQHBhcmFtIHNpemUgXHU2QkNGXHU5ODc1XHU1OTI3XHU1QzBGXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTUyMDZcdTk4NzVcdTU0Q0RcdTVFOTRcdTdFRDNcdTY3ODRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZTxUPihcbiAgaXRlbXM6IFRbXSxcbiAgdG90YWxJdGVtczogbnVtYmVyLFxuICBwYWdlOiBudW1iZXIgPSAxLFxuICBzaXplOiBudW1iZXIgPSAxMFxuKSB7XG4gIHJldHVybiBjcmVhdGVNb2NrUmVzcG9uc2Uoe1xuICAgIGl0ZW1zLFxuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIHRvdGFsOiB0b3RhbEl0ZW1zLFxuICAgICAgcGFnZSxcbiAgICAgIHNpemUsXG4gICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwodG90YWxJdGVtcyAvIHNpemUpLFxuICAgICAgaGFzTW9yZTogcGFnZSAqIHNpemUgPCB0b3RhbEl0ZW1zXG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZBUElcdTU0Q0RcdTVFOTRcdTVFRjZcdThGREZcbiAqIEBwYXJhbSBtcyBcdTVFRjZcdThGREZcdTZCRUJcdTc5RDJcdTY1NzBcdUZGMENcdTlFRDhcdThCQTQzMDBtc1xuICogQHJldHVybnMgUHJvbWlzZVx1NUJGOVx1OEM2MVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlciA9IDMwMCk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSxcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheVxufTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9xdWVyeS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvcXVlcnkudHNcIjsvKipcbiAqIFx1NjdFNVx1OEJFMk1vY2tcdTY3MERcdTUyQTFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU1QjlFXHU3M0IwXG4gKi9cblxuaW1wb3J0IHsgZGVsYXksIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSwgY3JlYXRlTW9ja1Jlc3BvbnNlLCBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBtb2NrUXVlcmllcyB9IGZyb20gJy4uL2RhdGEvcXVlcnknO1xuXG4vLyBcdTkxQ0RcdTdGNkVcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbmV4cG9ydCBmdW5jdGlvbiByZXNldFF1ZXJpZXMoKTogdm9pZCB7XG4gIC8vIFx1NEZERFx1NzU1OVx1NUYxNVx1NzUyOFx1RkYwQ1x1NTNFQVx1OTFDRFx1N0Y2RVx1NTE4NVx1NUJCOVxuICB3aGlsZSAobW9ja1F1ZXJpZXMubGVuZ3RoID4gMCkge1xuICAgIG1vY2tRdWVyaWVzLnBvcCgpO1xuICB9XG4gIFxuICAvLyBcdTkxQ0RcdTY1QjBcdTc1MUZcdTYyMTBcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbiAgQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+IHtcbiAgICBjb25zdCBpZCA9IGBxdWVyeS0ke2kgKyAxfWA7XG4gICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICBtb2NrUXVlcmllcy5wdXNoKHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogYFx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfWAsXG4gICAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfSBcdTc2ODRcdTYzQ0ZcdThGRjBgLFxuICAgICAgZm9sZGVySWQ6IGkgJSAzID09PSAwID8gJ2ZvbGRlci0xJyA6IChpICUgMyA9PT0gMSA/ICdmb2xkZXItMicgOiAnZm9sZGVyLTMnKSxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIGRhdGFTb3VyY2VOYW1lOiBgXHU2NTcwXHU2MzZFXHU2RTkwICR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHF1ZXJ5VHlwZTogaSAlIDIgPT09IDAgPyAnU1FMJyA6ICdOQVRVUkFMX0xBTkdVQUdFJyxcbiAgICAgIHF1ZXJ5VGV4dDogaSAlIDIgPT09IDAgPyBcbiAgICAgICAgYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAgOiBcbiAgICAgICAgYFx1NjdFNVx1NjI3RVx1NjcwMFx1OEZEMTEwXHU2NzYxJHtpICUgMiA9PT0gMCA/ICdcdThCQTJcdTUzNTUnIDogJ1x1NzUyOFx1NjIzNyd9XHU4QkIwXHU1RjU1YCxcbiAgICAgIHN0YXR1czogaSAlIDQgPT09IDAgPyAnRFJBRlQnIDogKGkgJSA0ID09PSAxID8gJ1BVQkxJU0hFRCcgOiAoaSAlIDQgPT09IDIgPyAnREVQUkVDQVRFRCcgOiAnQVJDSElWRUQnKSksXG4gICAgICBzZXJ2aWNlU3RhdHVzOiBpICUgMiA9PT0gMCA/ICdFTkFCTEVEJyA6ICdESVNBQkxFRCcsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNyZWF0ZWRCeTogeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIHVwZGF0ZWRCeTogeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIGV4ZWN1dGlvbkNvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCksXG4gICAgICBpc0Zhdm9yaXRlOiBpICUgMyA9PT0gMCxcbiAgICAgIGlzQWN0aXZlOiBpICUgNSAhPT0gMCxcbiAgICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHJlc3VsdENvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApICsgMTAsXG4gICAgICBleGVjdXRpb25UaW1lOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDApICsgMTAsXG4gICAgICB0YWdzOiBbYFx1NjgwN1x1N0I3RSR7aSsxfWAsIGBcdTdDN0JcdTU3OEIke2kgJSAzfWBdLFxuICAgICAgY3VycmVudFZlcnNpb246IHtcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH0sXG4gICAgICB2ZXJzaW9uczogW3tcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH1dXG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZURlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkZWxheVRpbWUgPSB0eXBlb2YgbW9ja0NvbmZpZy5kZWxheSA9PT0gJ251bWJlcicgPyBtb2NrQ29uZmlnLmRlbGF5IDogMzAwO1xuICByZXR1cm4gZGVsYXkoZGVsYXlUaW1lKTtcbn1cblxuLyoqXG4gKiBcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFcbiAqL1xuY29uc3QgcXVlcnlTZXJ2aWNlID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyaWVzKHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICAgIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLm1vY2tRdWVyaWVzXTtcbiAgICBcbiAgICAvLyBcdTYzMDlcdTU0MERcdTc5RjBcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5uYW1lKSB7XG4gICAgICBjb25zdCBrZXl3b3JkID0gcGFyYW1zLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IFxuICAgICAgICBxLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgICAgKHEuZGVzY3JpcHRpb24gJiYgcS5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uZGF0YVNvdXJjZUlkKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLmRhdGFTb3VyY2VJZCA9PT0gcGFyYW1zLmRhdGFTb3VyY2VJZCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NzJCNlx1NjAwMVx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5xdWVyeVR5cGUpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEucXVlcnlUeXBlID09PSBwYXJhbXMucXVlcnlUeXBlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU2NTM2XHU4NUNGXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uaXNGYXZvcml0ZSkge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5pc0Zhdm9yaXRlID09PSB0cnVlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IGZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmlsdGVyZWRJdGVtcy5sZW5ndGggLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2NTM2XHU4NUNGXHU3Njg0XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRGYXZvcml0ZVF1ZXJpZXMocGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICAgIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gICAgXG4gICAgLy8gXHU4RkM3XHU2RUU0XHU1MUZBXHU2NTM2XHU4NUNGXHU3Njg0XHU2N0U1XHU4QkUyXG4gICAgbGV0IGZhdm9yaXRlUXVlcmllcyA9IG1vY2tRdWVyaWVzLmZpbHRlcihxID0+IHEuaXNGYXZvcml0ZSA9PT0gdHJ1ZSk7XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MTc2XHU0RUQ2XHU4RkM3XHU2RUU0XHU2NzYxXHU0RUY2XG4gICAgaWYgKHBhcmFtcz8ubmFtZSB8fCBwYXJhbXM/LnNlYXJjaCkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IChwYXJhbXMubmFtZSB8fCBwYXJhbXMuc2VhcmNoIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmF2b3JpdGVRdWVyaWVzID0gZmF2b3JpdGVRdWVyaWVzLmZpbHRlcihxID0+IFxuICAgICAgICBxLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgICAgKHEuZGVzY3JpcHRpb24gJiYgcS5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHBhcmFtcz8uZGF0YVNvdXJjZUlkKSB7XG4gICAgICBmYXZvcml0ZVF1ZXJpZXMgPSBmYXZvcml0ZVF1ZXJpZXMuZmlsdGVyKHEgPT4gcS5kYXRhU291cmNlSWQgPT09IHBhcmFtcy5kYXRhU291cmNlSWQpO1xuICAgIH1cbiAgICBcbiAgICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICAgIGZhdm9yaXRlUXVlcmllcyA9IGZhdm9yaXRlUXVlcmllcy5maWx0ZXIocSA9PiBxLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmYXZvcml0ZVF1ZXJpZXMubGVuZ3RoKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZhdm9yaXRlUXVlcmllcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICB0b3RhbDogZmF2b3JpdGVRdWVyaWVzLmxlbmd0aCxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZhdm9yaXRlUXVlcmllcy5sZW5ndGggLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBnZXRRdWVyeShpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gcXVlcnk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBjcmVhdGVRdWVyeShkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBJRFx1RkYwQ1x1NjgzQ1x1NUYwRlx1NEUwRVx1NzNCMFx1NjcwOUlEXHU0RTAwXHU4MUY0XG4gICAgY29uc3QgaWQgPSBgcXVlcnktJHttb2NrUXVlcmllcy5sZW5ndGggKyAxfWA7XG4gICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IG5ld1F1ZXJ5ID0ge1xuICAgICAgaWQsXG4gICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgYFx1NjVCMFx1NjdFNVx1OEJFMiAke2lkfWAsXG4gICAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICAgIGZvbGRlcklkOiBkYXRhLmZvbGRlcklkIHx8IG51bGwsXG4gICAgICBkYXRhU291cmNlSWQ6IGRhdGEuZGF0YVNvdXJjZUlkLFxuICAgICAgZGF0YVNvdXJjZU5hbWU6IGRhdGEuZGF0YVNvdXJjZU5hbWUgfHwgYFx1NjU3MFx1NjM2RVx1NkU5MCAke2RhdGEuZGF0YVNvdXJjZUlkfWAsXG4gICAgICBxdWVyeVR5cGU6IGRhdGEucXVlcnlUeXBlIHx8ICdTUUwnLFxuICAgICAgcXVlcnlUZXh0OiBkYXRhLnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMgfHwgJ0RSQUZUJyxcbiAgICAgIHNlcnZpY2VTdGF0dXM6IGRhdGEuc2VydmljZVN0YXR1cyB8fCAnRElTQUJMRUQnLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIGNyZWF0ZWRCeTogZGF0YS5jcmVhdGVkQnkgfHwgeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIHVwZGF0ZWRCeTogZGF0YS51cGRhdGVkQnkgfHwgeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIGV4ZWN1dGlvbkNvdW50OiAwLFxuICAgICAgaXNGYXZvcml0ZTogZGF0YS5pc0Zhdm9yaXRlIHx8IGZhbHNlLFxuICAgICAgaXNBY3RpdmU6IGRhdGEuaXNBY3RpdmUgfHwgdHJ1ZSxcbiAgICAgIGxhc3RFeGVjdXRlZEF0OiBudWxsLFxuICAgICAgcmVzdWx0Q291bnQ6IDAsXG4gICAgICBleGVjdXRpb25UaW1lOiAwLFxuICAgICAgdGFnczogZGF0YS50YWdzIHx8IFtdLFxuICAgICAgY3VycmVudFZlcnNpb246IHtcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1MjFEXHU1OUNCXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBkYXRhLnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCxcbiAgICAgICAgc3RhdHVzOiAnRFJBRlQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH0sXG4gICAgICB2ZXJzaW9uczogW3tcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1MjFEXHU1OUNCXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBkYXRhLnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCxcbiAgICAgICAgc3RhdHVzOiAnRFJBRlQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH1dXG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTZERkJcdTUyQTBcdTUyMzBcdTUyMTdcdTg4NjhcbiAgICBtb2NrUXVlcmllcy5wdXNoKG5ld1F1ZXJ5KTtcbiAgICBcbiAgICByZXR1cm4gbmV3UXVlcnk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyB1cGRhdGVRdWVyeShpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTg5ODFcdTY2RjRcdTY1QjBcdTc2ODRcdTY3RTVcdThCRTJcdTdEMjJcdTVGMTVcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgdXBkYXRlZFF1ZXJ5ID0ge1xuICAgICAgLi4ubW9ja1F1ZXJpZXNbaW5kZXhdLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEJ5OiBkYXRhLnVwZGF0ZWRCeSB8fCBtb2NrUXVlcmllc1tpbmRleF0udXBkYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH1cbiAgICB9O1xuICAgIFxuICAgIC8vIFx1NjZGRlx1NjM2Mlx1NjdFNVx1OEJFMlxuICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHVwZGF0ZWRRdWVyeTtcbiAgICBcbiAgICByZXR1cm4gdXBkYXRlZFF1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlUXVlcnkoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTg5ODFcdTUyMjBcdTk2NjRcdTc2ODRcdTY3RTVcdThCRTJcdTdEMjJcdTVGMTVcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gICAgbW9ja1F1ZXJpZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzLmZpbmQocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFxdWVyeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1N0VEM1x1Njc5Q1xuICAgIGNvbnN0IGNvbHVtbnMgPSBbJ2lkJywgJ25hbWUnLCAnZW1haWwnLCAnc3RhdHVzJywgJ2NyZWF0ZWRfYXQnXTtcbiAgICBjb25zdCByb3dzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+ICh7XG4gICAgICBpZDogaSArIDEsXG4gICAgICBuYW1lOiBgXHU3NTI4XHU2MjM3ICR7aSArIDF9YCxcbiAgICAgIGVtYWlsOiBgdXNlciR7aSArIDF9QGV4YW1wbGUuY29tYCxcbiAgICAgIHN0YXR1czogaSAlIDIgPT09IDAgPyAnYWN0aXZlJyA6ICdpbmFjdGl2ZScsXG4gICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpXG4gICAgfSkpO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NjI2N1x1ODg0Q1x1N0VERlx1OEJBMVxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHtcbiAgICAgICAgLi4ubW9ja1F1ZXJpZXNbaW5kZXhdLFxuICAgICAgICBleGVjdXRpb25Db3VudDogKG1vY2tRdWVyaWVzW2luZGV4XS5leGVjdXRpb25Db3VudCB8fCAwKSArIDEsXG4gICAgICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHJlc3VsdENvdW50OiByb3dzLmxlbmd0aFxuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnMsXG4gICAgICByb3dzLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5yYW5kb20oKSAqIDAuNSArIDAuMSxcbiAgICAgICAgcm93Q291bnQ6IHJvd3MubGVuZ3RoLFxuICAgICAgICB0b3RhbFBhZ2VzOiAxXG4gICAgICB9LFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgaWQ6IHF1ZXJ5LmlkLFxuICAgICAgICBuYW1lOiBxdWVyeS5uYW1lLFxuICAgICAgICBkYXRhU291cmNlSWQ6IHF1ZXJ5LmRhdGFTb3VyY2VJZFxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjA3XHU2MzYyXHU2N0U1XHU4QkUyXHU2NTM2XHU4NUNGXHU3MkI2XHU2MDAxXG4gICAqL1xuICBhc3luYyB0b2dnbGVGYXZvcml0ZShpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIwN1x1NjM2Mlx1NjUzNlx1ODVDRlx1NzJCNlx1NjAwMVxuICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHtcbiAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgIGlzRmF2b3JpdGU6ICFtb2NrUXVlcmllc1tpbmRleF0uaXNGYXZvcml0ZSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gbW9ja1F1ZXJpZXNbaW5kZXhdO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTM4Nlx1NTNGMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnlIaXN0b3J5KHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVxuICAgIGNvbnN0IHRvdGFsSXRlbXMgPSAyMDtcbiAgICBjb25zdCBoaXN0b3JpZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiB0b3RhbEl0ZW1zIH0sIChfLCBpKSA9PiB7XG4gICAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDM2MDAwMDApLnRvSVNPU3RyaW5nKCk7XG4gICAgICBjb25zdCBxdWVyeUluZGV4ID0gaSAlIG1vY2tRdWVyaWVzLmxlbmd0aDtcbiAgICAgIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGBoaXN0LSR7aSArIDF9YCxcbiAgICAgICAgcXVlcnlJZDogbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0uaWQsXG4gICAgICAgIHF1ZXJ5TmFtZTogbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0ubmFtZSxcbiAgICAgICAgZXhlY3V0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgICBleGVjdXRpb25UaW1lOiBNYXRoLnJhbmRvbSgpICogMC41ICsgMC4xLFxuICAgICAgICByb3dDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEsXG4gICAgICAgIHVzZXJJZDogJ3VzZXIxJyxcbiAgICAgICAgdXNlck5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnLFxuICAgICAgICBzdGF0dXM6IGkgJSA4ID09PSAwID8gJ0ZBSUxFRCcgOiAnU1VDQ0VTUycsXG4gICAgICAgIGVycm9yTWVzc2FnZTogaSAlIDggPT09IDAgPyAnXHU2N0U1XHU4QkUyXHU2MjY3XHU4ODRDXHU4RDg1XHU2NUY2JyA6IG51bGxcbiAgICAgIH07XG4gICAgfSk7XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIHRvdGFsSXRlbXMpO1xuICAgIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gaGlzdG9yaWVzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiB0b3RhbEl0ZW1zLFxuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwodG90YWxJdGVtcyAvIHNpemUpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5VmVyc2lvbnMocXVlcnlJZDogc3RyaW5nLCBwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzLmZpbmQocSA9PiBxLmlkID09PSBxdWVyeUlkKTtcbiAgICBcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTcyNDhcdTY3MkNcdTUyMTdcdTg4NjhcbiAgICByZXR1cm4gcXVlcnkudmVyc2lvbnMgfHwgW107XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBjcmVhdGVRdWVyeVZlcnNpb24ocXVlcnlJZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IHF1ZXJ5SWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3F1ZXJ5SWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NzI0OFx1NjcyQ1xuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbaW5kZXhdO1xuICAgIGNvbnN0IG5ld1ZlcnNpb25OdW1iZXIgPSAocXVlcnkudmVyc2lvbnM/Lmxlbmd0aCB8fCAwKSArIDE7XG4gICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgIFxuICAgIGNvbnN0IG5ld1ZlcnNpb24gPSB7XG4gICAgICBpZDogYHZlci0ke3F1ZXJ5SWR9LSR7bmV3VmVyc2lvbk51bWJlcn1gLFxuICAgICAgcXVlcnlJZCxcbiAgICAgIHZlcnNpb25OdW1iZXI6IG5ld1ZlcnNpb25OdW1iZXIsXG4gICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgYFx1NzI0OFx1NjcyQyAke25ld1ZlcnNpb25OdW1iZXJ9YCxcbiAgICAgIHNxbDogZGF0YS5zcWwgfHwgcXVlcnkucXVlcnlUZXh0IHx8ICcnLFxuICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCB8fCBxdWVyeS5kYXRhU291cmNlSWQsXG4gICAgICBzdGF0dXM6ICdEUkFGVCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTRFNEJcdTUyNERcdTcyNDhcdTY3MkNcdTc2ODRpc0xhdGVzdFx1NjgwN1x1NUZEN1xuICAgIGlmIChxdWVyeS52ZXJzaW9ucyAmJiBxdWVyeS52ZXJzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBxdWVyeS52ZXJzaW9ucyA9IHF1ZXJ5LnZlcnNpb25zLm1hcCh2ID0+ICh7XG4gICAgICAgIC4uLnYsXG4gICAgICAgIGlzTGF0ZXN0OiBmYWxzZVxuICAgICAgfSkpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTZERkJcdTUyQTBcdTY1QjBcdTcyNDhcdTY3MkNcbiAgICBpZiAoIXF1ZXJ5LnZlcnNpb25zKSB7XG4gICAgICBxdWVyeS52ZXJzaW9ucyA9IFtdO1xuICAgIH1cbiAgICBxdWVyeS52ZXJzaW9ucy5wdXNoKG5ld1ZlcnNpb24pO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1xuICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHtcbiAgICAgIC4uLnF1ZXJ5LFxuICAgICAgY3VycmVudFZlcnNpb246IG5ld1ZlcnNpb24sXG4gICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIG5ld1ZlcnNpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1M0QxXHU1RTAzXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBwdWJsaXNoUXVlcnlWZXJzaW9uKHZlcnNpb25JZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU1MzA1XHU1NDJCXHU2QjY0XHU3MjQ4XHU2NzJDXHU3Njg0XHU2N0U1XHU4QkUyXG4gICAgbGV0IHF1ZXJ5ID0gbnVsbDtcbiAgICBsZXQgdmVyc2lvbkluZGV4ID0gLTE7XG4gICAgbGV0IHF1ZXJ5SW5kZXggPSAtMTtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vY2tRdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMpIHtcbiAgICAgICAgY29uc3QgdkluZGV4ID0gbW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMuZmluZEluZGV4KHYgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICAgICAgaWYgKHZJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBxdWVyeSA9IG1vY2tRdWVyaWVzW2ldO1xuICAgICAgICAgIHZlcnNpb25JbmRleCA9IHZJbmRleDtcbiAgICAgICAgICBxdWVyeUluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoIXF1ZXJ5IHx8IHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU3MjQ4XHU2NzJDXHU3MkI2XHU2MDAxXG4gICAgY29uc3QgdXBkYXRlZFZlcnNpb24gPSB7XG4gICAgICAuLi5xdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIHB1Ymxpc2hlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF0gPSB1cGRhdGVkVmVyc2lvbjtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTcyQjZcdTYwMDFcbiAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgIC4uLnF1ZXJ5LFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB1cGRhdGVkVmVyc2lvbixcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdXBkYXRlZFZlcnNpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1RTlGXHU1RjAzXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBkZXByZWNhdGVRdWVyeVZlcnNpb24odmVyc2lvbklkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTUzMDVcdTU0MkJcdTZCNjRcdTcyNDhcdTY3MkNcdTc2ODRcdTY3RTVcdThCRTJcbiAgICBsZXQgcXVlcnkgPSBudWxsO1xuICAgIGxldCB2ZXJzaW9uSW5kZXggPSAtMTtcbiAgICBsZXQgcXVlcnlJbmRleCA9IC0xO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9ja1F1ZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtb2NrUXVlcmllc1tpXS52ZXJzaW9ucykge1xuICAgICAgICBjb25zdCB2SW5kZXggPSBtb2NrUXVlcmllc1tpXS52ZXJzaW9ucy5maW5kSW5kZXgodiA9PiB2LmlkID09PSB2ZXJzaW9uSWQpO1xuICAgICAgICBpZiAodkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbaV07XG4gICAgICAgICAgdmVyc2lvbkluZGV4ID0gdkluZGV4O1xuICAgICAgICAgIHF1ZXJ5SW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmICghcXVlcnkgfHwgdmVyc2lvbkluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7dmVyc2lvbklkfVx1NzY4NFx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ2ApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTcyNDhcdTY3MkNcdTcyQjZcdTYwMDFcbiAgICBjb25zdCB1cGRhdGVkVmVyc2lvbiA9IHtcbiAgICAgIC4uLnF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF0sXG4gICAgICBzdGF0dXM6ICdERVBSRUNBVEVEJyxcbiAgICAgIGRlcHJlY2F0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdID0gdXBkYXRlZFZlcnNpb247XG4gICAgXG4gICAgLy8gXHU1OTgyXHU2NzlDXHU1RTlGXHU1RjAzXHU3Njg0XHU2NjJGXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDXHVGRjBDXHU1MjE5XHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU3MkI2XHU2MDAxXG4gICAgaWYgKHF1ZXJ5LmN1cnJlbnRWZXJzaW9uICYmIHF1ZXJ5LmN1cnJlbnRWZXJzaW9uLmlkID09PSB2ZXJzaW9uSWQpIHtcbiAgICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgICAuLi5xdWVyeSxcbiAgICAgICAgc3RhdHVzOiAnREVQUkVDQVRFRCcsXG4gICAgICAgIGN1cnJlbnRWZXJzaW9uOiB1cGRhdGVkVmVyc2lvbixcbiAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgICAuLi5xdWVyeSxcbiAgICAgICAgdmVyc2lvbnM6IHF1ZXJ5LnZlcnNpb25zLFxuICAgICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NkZDMFx1NkQzQlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgYWN0aXZhdGVRdWVyeVZlcnNpb24ocXVlcnlJZDogc3RyaW5nLCB2ZXJzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5SW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBxdWVyeUlkKTtcbiAgICBcbiAgICBpZiAocXVlcnlJbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3F1ZXJ5SWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF07XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU3MjQ4XHU2NzJDXG4gICAgaWYgKCFxdWVyeS52ZXJzaW9ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3RTVcdThCRTIgJHtxdWVyeUlkfSBcdTZDQTFcdTY3MDlcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgdmVyc2lvbkluZGV4ID0gcXVlcnkudmVyc2lvbnMuZmluZEluZGV4KHYgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICBcbiAgICBpZiAodmVyc2lvbkluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7dmVyc2lvbklkfVx1NzY4NFx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ2ApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTg5ODFcdTZGQzBcdTZEM0JcdTc2ODRcdTcyNDhcdTY3MkNcbiAgICBjb25zdCB2ZXJzaW9uVG9BY3RpdmF0ZSA9IHF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF07XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDXHU1NDhDXHU2N0U1XHU4QkUyXHU3MkI2XHU2MDAxXG4gICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB2ZXJzaW9uVG9BY3RpdmF0ZSxcbiAgICAgIHN0YXR1czogdmVyc2lvblRvQWN0aXZhdGUuc3RhdHVzLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiB2ZXJzaW9uVG9BY3RpdmF0ZTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcXVlcnlTZXJ2aWNlOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9pbnRlZ3JhdGlvbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9pbnRlZ3JhdGlvbi50c1wiOy8qKlxuICogXHU5NkM2XHU2MjEwXHU2NzBEXHU1MkExTW9ja1x1NjU3MFx1NjM2RVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTk2QzZcdTYyMTBBUElcdTc2ODRcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqL1xuXG4vLyBcdTZBMjFcdTYyREZcdTk2QzZcdTYyMTBcbmV4cG9ydCBjb25zdCBtb2NrSW50ZWdyYXRpb25zID0gW1xuICB7XG4gICAgaWQ6ICdpbnRlZ3JhdGlvbi0xJyxcbiAgICBuYW1lOiAnXHU3OTNBXHU0RjhCUkVTVCBBUEknLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU3OTNBXHU0RjhCUkVTVCBBUElcdTY3MERcdTUyQTEnLFxuICAgIHR5cGU6ICdSRVNUJyxcbiAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20vdjEnLFxuICAgIGF1dGhUeXBlOiAnQkFTSUMnLFxuICAgIHVzZXJuYW1lOiAnYXBpX3VzZXInLFxuICAgIHBhc3N3b3JkOiAnKioqKioqKionLFxuICAgIHN0YXR1czogJ0FDVElWRScsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgZW5kcG9pbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtMScsXG4gICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTc1MjhcdTYyMzdcdTUyMTdcdTg4NjgnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXRoOiAnL3VzZXJzJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTYyNDBcdTY3MDlcdTc1MjhcdTYyMzdcdTc2ODRcdTUyMTdcdTg4NjgnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTInLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU3NTI4XHU2MjM3JyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy91c2Vycy97aWR9JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTY4MzlcdTYzNkVJRFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NzUyOFx1NjIzNydcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ludGVncmF0aW9uLTInLFxuICAgIG5hbWU6ICdcdTU5MjlcdTZDMTRBUEknLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1QVBJJyxcbiAgICB0eXBlOiAnUkVTVCcsXG4gICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLndlYXRoZXIuY29tJyxcbiAgICBhdXRoVHlwZTogJ0FQSV9LRVknLFxuICAgIGFwaUtleTogJyoqKioqKioqJyxcbiAgICBzdGF0dXM6ICdBQ1RJVkUnLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNDMyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGVuZHBvaW50czogW1xuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTMnLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU1OTI5XHU2QzE0JyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy9jdXJyZW50JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTYzMDdcdTVCOUFcdTRGNERcdTdGNkVcdTc2ODRcdTVGNTNcdTUyNERcdTU5MjlcdTZDMTQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTQnLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1JyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy9mb3JlY2FzdCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2NzJBXHU2NzY1N1x1NTkyOVx1NzY4NFx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ludGVncmF0aW9uLTMnLFxuICAgIG5hbWU6ICdcdTY1MkZcdTRFRDhcdTdGNTFcdTUxNzMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU2NTJGXHU0RUQ4XHU1OTA0XHU3NDA2QVBJJyxcbiAgICB0eXBlOiAnUkVTVCcsXG4gICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLnBheW1lbnQuY29tJyxcbiAgICBhdXRoVHlwZTogJ09BVVRIMicsXG4gICAgY2xpZW50SWQ6ICdjbGllbnQxMjMnLFxuICAgIGNsaWVudFNlY3JldDogJyoqKioqKioqJyxcbiAgICBzdGF0dXM6ICdJTkFDVElWRScsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBlbmRwb2ludHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC01JyxcbiAgICAgICAgbmFtZTogJ1x1NTIxQlx1NUVGQVx1NjUyRlx1NEVEOCcsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBwYXRoOiAnL3BheW1lbnRzJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTUyMUJcdTVFRkFcdTY1QjBcdTc2ODRcdTY1MkZcdTRFRDhcdThCRjdcdTZDNDInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTYnLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU2NTJGXHU0RUQ4XHU3MkI2XHU2MDAxJyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy9wYXltZW50cy97aWR9JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTY4QzBcdTY3RTVcdTY1MkZcdTRFRDhcdTcyQjZcdTYwMDEnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTcnLFxuICAgICAgICBuYW1lOiAnXHU5MDAwXHU2QjNFJyxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHBhdGg6ICcvcGF5bWVudHMve2lkfS9yZWZ1bmQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTkwNFx1NzQwNlx1OTAwMFx1NkIzRVx1OEJGN1x1NkM0MidcbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG5cbi8vIFx1OTFDRFx1N0Y2RVx1OTZDNlx1NjIxMFx1NjU3MFx1NjM2RVxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SW50ZWdyYXRpb25zKCk6IHZvaWQge1xuICAvLyBcdTRGRERcdTc1NTlcdTVGMTVcdTc1MjhcdUZGMENcdTUzRUFcdTkxQ0RcdTdGNkVcdTUxODVcdTVCQjlcbiAgd2hpbGUgKG1vY2tJbnRlZ3JhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgIG1vY2tJbnRlZ3JhdGlvbnMucG9wKCk7XG4gIH1cbiAgXG4gIC8vIFx1OTFDRFx1NjVCMFx1NzUxRlx1NjIxMFx1OTZDNlx1NjIxMFx1NjU3MFx1NjM2RVxuICBbXG4gICAge1xuICAgICAgaWQ6ICdpbnRlZ3JhdGlvbi0xJyxcbiAgICAgIG5hbWU6ICdcdTc5M0FcdTRGOEJSRVNUIEFQSScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4QlJFU1QgQVBJXHU2NzBEXHU1MkExJyxcbiAgICAgIHR5cGU6ICdSRVNUJyxcbiAgICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS5leGFtcGxlLmNvbS92MScsXG4gICAgICBhdXRoVHlwZTogJ0JBU0lDJyxcbiAgICAgIHVzZXJuYW1lOiAnYXBpX3VzZXInLFxuICAgICAgcGFzc3dvcmQ6ICcqKioqKioqKicsXG4gICAgICBzdGF0dXM6ICdBQ1RJVkUnLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZHBvaW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC0xJyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU3NTI4XHU2MjM3XHU1MjE3XHU4ODY4JyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvdXNlcnMnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MjQwXHU2NzA5XHU3NTI4XHU2MjM3XHU3Njg0XHU1MjE3XHU4ODY4J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC0yJyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU3NTI4XHU2MjM3JyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvdXNlcnMve2lkfScsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTY4MzlcdTYzNkVJRFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NzUyOFx1NjIzNydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdpbnRlZ3JhdGlvbi0yJyxcbiAgICAgIG5hbWU6ICdcdTU5MjlcdTZDMTRBUEknLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTVBUEknLFxuICAgICAgdHlwZTogJ1JFU1QnLFxuICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLndlYXRoZXIuY29tJyxcbiAgICAgIGF1dGhUeXBlOiAnQVBJX0tFWScsXG4gICAgICBhcGlLZXk6ICcqKioqKioqKicsXG4gICAgICBzdGF0dXM6ICdBQ1RJVkUnLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDQzMjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZHBvaW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC0zJyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU1OTI5XHU2QzE0JyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvY3VycmVudCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTYzMDdcdTVCOUFcdTRGNERcdTdGNkVcdTc2ODRcdTVGNTNcdTUyNERcdTU5MjlcdTZDMTQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2VuZHBvaW50LTQnLFxuICAgICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTUnLFxuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgcGF0aDogJy9mb3JlY2FzdCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTY3MkFcdTY3NjU3XHU1OTI5XHU3Njg0XHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1J1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2ludGVncmF0aW9uLTMnLFxuICAgICAgbmFtZTogJ1x1NjUyRlx1NEVEOFx1N0Y1MVx1NTE3MycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NjUyRlx1NEVEOFx1NTkwNFx1NzQwNkFQSScsXG4gICAgICB0eXBlOiAnUkVTVCcsXG4gICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkucGF5bWVudC5jb20nLFxuICAgICAgYXV0aFR5cGU6ICdPQVVUSDInLFxuICAgICAgY2xpZW50SWQ6ICdjbGllbnQxMjMnLFxuICAgICAgY2xpZW50U2VjcmV0OiAnKioqKioqKionLFxuICAgICAgc3RhdHVzOiAnSU5BQ1RJVkUnLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgZW5kcG9pbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2VuZHBvaW50LTUnLFxuICAgICAgICAgIG5hbWU6ICdcdTUyMUJcdTVFRkFcdTY1MkZcdTRFRDgnLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIHBhdGg6ICcvcGF5bWVudHMnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU1MjFCXHU1RUZBXHU2NUIwXHU3Njg0XHU2NTJGXHU0RUQ4XHU4QkY3XHU2QzQyJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC02JyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU2NTJGXHU0RUQ4XHU3MkI2XHU2MDAxJyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvcGF5bWVudHMve2lkfScsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTY4QzBcdTY3RTVcdTY1MkZcdTRFRDhcdTcyQjZcdTYwMDEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2VuZHBvaW50LTcnLFxuICAgICAgICAgIG5hbWU6ICdcdTkwMDBcdTZCM0UnLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIHBhdGg6ICcvcGF5bWVudHMve2lkfS9yZWZ1bmQnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU1OTA0XHU3NDA2XHU5MDAwXHU2QjNFXHU4QkY3XHU2QzQyJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdLmZvckVhY2goaXRlbSA9PiBtb2NrSW50ZWdyYXRpb25zLnB1c2goaXRlbSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtb2NrSW50ZWdyYXRpb25zOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW50ZWdyYXRpb24udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2ludGVncmF0aW9uLnRzXCI7LyoqXG4gKiBcdTk2QzZcdTYyMTBNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1OTZDNlx1NjIxMFx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IGRlbGF5LCBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsIGNyZWF0ZU1vY2tSZXNwb25zZSwgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHsgbW9ja0ludGVncmF0aW9ucyB9IGZyb20gJy4uL2RhdGEvaW50ZWdyYXRpb24nO1xuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZURlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkZWxheVRpbWUgPSB0eXBlb2YgbW9ja0NvbmZpZy5kZWxheSA9PT0gJ251bWJlcicgPyBtb2NrQ29uZmlnLmRlbGF5IDogMzAwO1xuICByZXR1cm4gZGVsYXkoZGVsYXlUaW1lKTtcbn1cblxuLyoqXG4gKiBcdTk2QzZcdTYyMTBcdTY3MERcdTUyQTFcbiAqL1xuY29uc3QgaW50ZWdyYXRpb25TZXJ2aWNlID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU5NkM2XHU2MjEwXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRJbnRlZ3JhdGlvbnMocGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICAgIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU4RkM3XHU2RUU0XG4gICAgbGV0IGZpbHRlcmVkSXRlbXMgPSBbLi4ubW9ja0ludGVncmF0aW9uc107XG4gICAgXG4gICAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiBcbiAgICAgICAgaS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAgIChpLmRlc2NyaXB0aW9uICYmIGkuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1N0M3Qlx1NTc4Qlx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LnR5cGUpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihpID0+IGkudHlwZSA9PT0gcGFyYW1zLnR5cGUpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihpID0+IGkuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IGZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmlsdGVyZWRJdGVtcy5sZW5ndGggLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU5NkM2XHU2MjEwXG4gICAqL1xuICBhc3luYyBnZXRJbnRlZ3JhdGlvbihpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW50ZWdyYXRpb24gPSBtb2NrSW50ZWdyYXRpb25zLmZpbmQoaSA9PiBpLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFpbnRlZ3JhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU5NkM2XHU2MjEwYCk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBpbnRlZ3JhdGlvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMUJcdTVFRkFcdTk2QzZcdTYyMTBcbiAgICovXG4gIGFzeW5jIGNyZWF0ZUludGVncmF0aW9uKGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IG5ld0lkID0gYGludGVncmF0aW9uLSR7RGF0ZS5ub3coKX1gO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICBjb25zdCBuZXdJbnRlZ3JhdGlvbiA9IHtcbiAgICAgIGlkOiBuZXdJZCxcbiAgICAgIG5hbWU6IGRhdGEubmFtZSB8fCAnXHU2NUIwXHU5NkM2XHU2MjEwJyxcbiAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgICAgdHlwZTogZGF0YS50eXBlIHx8ICdSRVNUJyxcbiAgICAgIGJhc2VVcmw6IGRhdGEuYmFzZVVybCB8fCAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20nLFxuICAgICAgYXV0aFR5cGU6IGRhdGEuYXV0aFR5cGUgfHwgJ05PTkUnLFxuICAgICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICBlbmRwb2ludHM6IGRhdGEuZW5kcG9pbnRzIHx8IFtdXG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY4MzlcdTYzNkVcdThCQTRcdThCQzFcdTdDN0JcdTU3OEJcdTZERkJcdTUyQTBcdTc2RjhcdTVFOTRcdTVCNTdcdTZCQjVcbiAgICBpZiAoZGF0YS5hdXRoVHlwZSA9PT0gJ0JBU0lDJykge1xuICAgICAgT2JqZWN0LmFzc2lnbihuZXdJbnRlZ3JhdGlvbiwge1xuICAgICAgICB1c2VybmFtZTogZGF0YS51c2VybmFtZSB8fCAndXNlcicsXG4gICAgICAgIHBhc3N3b3JkOiBkYXRhLnBhc3N3b3JkIHx8ICcqKioqKioqKidcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5hdXRoVHlwZSA9PT0gJ0FQSV9LRVknKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG5ld0ludGVncmF0aW9uLCB7XG4gICAgICAgIGFwaUtleTogZGF0YS5hcGlLZXkgfHwgJyoqKioqKioqJ1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmF1dGhUeXBlID09PSAnT0FVVEgyJykge1xuICAgICAgT2JqZWN0LmFzc2lnbihuZXdJbnRlZ3JhdGlvbiwge1xuICAgICAgICBjbGllbnRJZDogZGF0YS5jbGllbnRJZCB8fCAnY2xpZW50JyxcbiAgICAgICAgY2xpZW50U2VjcmV0OiBkYXRhLmNsaWVudFNlY3JldCB8fCAnKioqKioqKionXG4gICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gICAgbW9ja0ludGVncmF0aW9ucy5wdXNoKG5ld0ludGVncmF0aW9uKTtcbiAgICBcbiAgICByZXR1cm4gbmV3SW50ZWdyYXRpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU5NkM2XHU2MjEwXG4gICAqL1xuICBhc3luYyB1cGRhdGVJbnRlZ3JhdGlvbihpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBpbmRleCA9IG1vY2tJbnRlZ3JhdGlvbnMuZmluZEluZGV4KGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1OTZDNlx1NjIxMGApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcbiAgICBjb25zdCB1cGRhdGVkSW50ZWdyYXRpb24gPSB7XG4gICAgICAuLi5tb2NrSW50ZWdyYXRpb25zW2luZGV4XSxcbiAgICAgIC4uLmRhdGEsXG4gICAgICBpZCwgLy8gXHU3ODZFXHU0RkRESURcdTRFMERcdTUzRDhcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAgICBtb2NrSW50ZWdyYXRpb25zW2luZGV4XSA9IHVwZGF0ZWRJbnRlZ3JhdGlvbjtcbiAgICBcbiAgICByZXR1cm4gdXBkYXRlZEludGVncmF0aW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgZGVsZXRlSW50ZWdyYXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBpbmRleCA9IG1vY2tJbnRlZ3JhdGlvbnMuZmluZEluZGV4KGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1OTZDNlx1NjIxMGApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTRFQ0VcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTRFMkRcdTUyMjBcdTk2NjRcbiAgICBtb2NrSW50ZWdyYXRpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2RDRCXHU4QkQ1XHU5NkM2XHU2MjEwXG4gICAqL1xuICBhc3luYyB0ZXN0SW50ZWdyYXRpb24oaWQ6IHN0cmluZywgcGFyYW1zOiBhbnkgPSB7fSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IGludGVncmF0aW9uID0gbW9ja0ludGVncmF0aW9ucy5maW5kKGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghaW50ZWdyYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1OTZDNlx1NjIxMGApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTZBMjFcdTYyREZcdTZENEJcdThCRDVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIHJlc3VsdFR5cGU6ICdKU09OJyxcbiAgICAgIGpzb25SZXNwb25zZToge1xuICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogJ1x1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICBkZXRhaWxzOiB7XG4gICAgICAgICAgcmVzcG9uc2VUaW1lOiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDApICsgNTAsXG4gICAgICAgICAgc2VydmVySW5mbzogJ01vY2sgU2VydmVyIHYxLjAnLFxuICAgICAgICAgIGVuZHBvaW50OiBwYXJhbXMuZW5kcG9pbnQgfHwgaW50ZWdyYXRpb24uZW5kcG9pbnRzWzBdPy5wYXRoIHx8ICcvJ1xuICAgICAgICB9LFxuICAgICAgICBkYXRhOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAzIH0sIChfLCBpKSA9PiAoe1xuICAgICAgICAgIGlkOiBpICsgMSxcbiAgICAgICAgICBuYW1lOiBgXHU2ODM3XHU2NzJDXHU2NTcwXHU2MzZFICR7aSArIDF9YCxcbiAgICAgICAgICB2YWx1ZTogTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMCkgLyAxMFxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjI2N1x1ODg0Q1x1OTZDNlx1NjIxMFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZVF1ZXJ5KGlkOiBzdHJpbmcsIHBhcmFtczogYW55ID0ge30pOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG1vY2tJbnRlZ3JhdGlvbnMuZmluZChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIWludGVncmF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU2QTIxXHU2MkRGXHU2MjY3XHU4ODRDXHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICByZXN1bHRUeXBlOiAnSlNPTicsXG4gICAgICBqc29uUmVzcG9uc2U6IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICBxdWVyeTogcGFyYW1zLnF1ZXJ5IHx8ICdcdTlFRDhcdThCQTRcdTY3RTVcdThCRTInLFxuICAgICAgICBkYXRhOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiA1IH0sIChfLCBpKSA9PiAoe1xuICAgICAgICAgIGlkOiBgcmVjb3JkLSR7aSArIDF9YCxcbiAgICAgICAgICBuYW1lOiBgXHU4QkIwXHU1RjU1ICR7aSArIDF9YCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NjdFNVx1OEJFMlx1OEZENFx1NTZERVx1NzY4NFx1OEJCMFx1NUY1NSAke2kgKyAxfWAsXG4gICAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IGkgJSAyID09PSAwID8gJ0EnIDogJ0InLFxuICAgICAgICAgICAgdmFsdWU6IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMCksXG4gICAgICAgICAgICBhY3RpdmU6IGkgJSAzICE9PSAwXG4gICAgICAgICAgfVxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLy8gXHU1MTdDXHU1QkI5XHU2NUU3XHU3Njg0XHU2M0E1XHU1M0UzLCBcdTc2RjRcdTYzQTVcdThDMDNcdTc1MjhcdTY1QjBcdTc2ODRcdTVCOUVcdTczQjBcbiAgYXN5bmMgZ2V0TW9ja0ludGVncmF0aW9ucygpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmdldEludGVncmF0aW9ucyh7fSk7XG4gICAgcmV0dXJuIHJlc3VsdC5pdGVtcztcbiAgfSxcbiAgXG4gIGFzeW5jIGdldE1vY2tJbnRlZ3JhdGlvbihpZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBudWxsPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGludGVncmF0aW9uID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmdldEludGVncmF0aW9uKGlkKTtcbiAgICAgIHJldHVybiBpbnRlZ3JhdGlvbjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignXHU4M0I3XHU1M0Q2XHU5NkM2XHU2MjEwXHU1OTMxXHU4RDI1OicsIGVycm9yKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSxcbiAgXG4gIGFzeW5jIGNyZWF0ZU1vY2tJbnRlZ3JhdGlvbihkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBpbnRlZ3JhdGlvblNlcnZpY2UuY3JlYXRlSW50ZWdyYXRpb24oZGF0YSk7XG4gIH0sXG4gIFxuICBhc3luYyB1cGRhdGVNb2NrSW50ZWdyYXRpb24oaWQ6IHN0cmluZywgdXBkYXRlczogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gaW50ZWdyYXRpb25TZXJ2aWNlLnVwZGF0ZUludGVncmF0aW9uKGlkLCB1cGRhdGVzKTtcbiAgfSxcbiAgXG4gIGFzeW5jIGRlbGV0ZU1vY2tJbnRlZ3JhdGlvbihpZDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuZGVsZXRlSW50ZWdyYXRpb24oaWQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdcdTUyMjBcdTk2NjRcdTk2QzZcdTYyMTBcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgXG4gIGFzeW5jIGV4ZWN1dGVNb2NrUXVlcnkoaW50ZWdyYXRpb25JZDogc3RyaW5nLCBxdWVyeTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmV4ZWN1dGVRdWVyeShpbnRlZ3JhdGlvbklkLCBxdWVyeSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBkYXRhOiByZXN1bHQuanNvblJlc3BvbnNlLmRhdGFcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1x1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNTonLCBlcnJvcik7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKVxuICAgICAgfTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIFx1NkRGQlx1NTJBMFx1NTE3Q1x1NUJCOVx1NjVFN0FQSVx1NzY4NFx1NUJGQ1x1NTFGQVxuZXhwb3J0IGNvbnN0IGdldE1vY2tJbnRlZ3JhdGlvbnMgPSBpbnRlZ3JhdGlvblNlcnZpY2UuZ2V0TW9ja0ludGVncmF0aW9ucztcbmV4cG9ydCBjb25zdCBnZXRNb2NrSW50ZWdyYXRpb24gPSBpbnRlZ3JhdGlvblNlcnZpY2UuZ2V0TW9ja0ludGVncmF0aW9uO1xuZXhwb3J0IGNvbnN0IGNyZWF0ZU1vY2tJbnRlZ3JhdGlvbiA9IGludGVncmF0aW9uU2VydmljZS5jcmVhdGVNb2NrSW50ZWdyYXRpb247XG5leHBvcnQgY29uc3QgdXBkYXRlTW9ja0ludGVncmF0aW9uID0gaW50ZWdyYXRpb25TZXJ2aWNlLnVwZGF0ZU1vY2tJbnRlZ3JhdGlvbjtcbmV4cG9ydCBjb25zdCBkZWxldGVNb2NrSW50ZWdyYXRpb24gPSBpbnRlZ3JhdGlvblNlcnZpY2UuZGVsZXRlTW9ja0ludGVncmF0aW9uO1xuZXhwb3J0IGNvbnN0IGV4ZWN1dGVNb2NrUXVlcnkgPSBpbnRlZ3JhdGlvblNlcnZpY2UuZXhlY3V0ZU1vY2tRdWVyeTtcblxuZXhwb3J0IGRlZmF1bHQgaW50ZWdyYXRpb25TZXJ2aWNlOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5NkM2XHU0RTJEXHU1QkZDXHU1MUZBXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1N0VERlx1NEUwMFx1NzY4NEFQSSBNb2NrXHU2NzBEXHU1MkExXHU1MTY1XHU1M0UzXHU3MEI5XG4gKi9cblxuLy8gXHU1QkZDXHU1MTY1XHU2NTcwXHU2MzZFXHU2RTkwXHU2NzBEXHU1MkExXG5pbXBvcnQgZGF0YVNvdXJjZSBmcm9tICcuL2RhdGFzb3VyY2UnO1xuLy8gXHU1QkZDXHU1MTY1XHU1QjhDXHU2NTc0XHU3Njg0XHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExXHU1QjlFXHU3M0IwXG5pbXBvcnQgcXVlcnlTZXJ2aWNlSW1wbGVtZW50YXRpb24gZnJvbSAnLi9xdWVyeSc7XG4vLyBcdTVCRkNcdTUxNjVcdTk2QzZcdTYyMTBcdTY3MERcdTUyQTFcbmltcG9ydCBpbnRlZ3JhdGlvblNlcnZpY2VJbXBsZW1lbnRhdGlvbiBmcm9tICcuL2ludGVncmF0aW9uJztcblxuLy8gXHU1QkZDXHU1MTY1XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG5pbXBvcnQgeyBcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLCBcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsIFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5IFxufSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFNb2NrXG4gKiBAZGVwcmVjYXRlZCBcdTRGN0ZcdTc1MjhcdTRFQ0UgJy4vcXVlcnknIFx1NUJGQ1x1NTE2NVx1NzY4NFx1NUI4Q1x1NjU3NFx1NUI5RVx1NzNCMFx1NEVFM1x1NjZGRlxuICovXG5jb25zdCBxdWVyeSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcmllcyhwYXJhbXM6IHsgcGFnZTogbnVtYmVyOyBzaXplOiBudW1iZXI7IH0pIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2Uoe1xuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBpZDogJ3ExJywgbmFtZTogJ1x1NzUyOFx1NjIzN1x1NTIwNlx1Njc5MFx1NjdFNVx1OEJFMicsIGRlc2NyaXB0aW9uOiAnXHU2MzA5XHU1NzMwXHU1MzNBXHU3RURGXHU4QkExXHU3NTI4XHU2MjM3XHU2Q0U4XHU1MThDXHU2NTcwXHU2MzZFJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgICAgeyBpZDogJ3EyJywgbmFtZTogJ1x1OTUwMFx1NTUyRVx1NEUxQVx1N0VFOVx1NjdFNVx1OEJFMicsIGRlc2NyaXB0aW9uOiAnXHU2MzA5XHU2NzA4XHU3RURGXHU4QkExXHU5NTAwXHU1NTJFXHU5ODlEJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgICAgeyBpZDogJ3EzJywgbmFtZTogJ1x1NUU5M1x1NUI1OFx1NTIwNlx1Njc5MCcsIGRlc2NyaXB0aW9uOiAnXHU3NkQxXHU2M0E3XHU1RTkzXHU1QjU4XHU2QzM0XHU1RTczJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgIF0sXG4gICAgICB0b3RhbDogMyxcbiAgICAgIHBhZ2U6IHBhcmFtcy5wYWdlLFxuICAgICAgc2l6ZTogcGFyYW1zLnNpemVcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBnZXRRdWVyeShpZDogc3RyaW5nKSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQsXG4gICAgICBuYW1lOiAnXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyJyxcbiAgICAgIHNxbDogJ1NFTEVDVCAqIEZST00gdXNlcnMgV0hFUkUgc3RhdHVzID0gJDEnLFxuICAgICAgcGFyYW1ldGVyczogWydhY3RpdmUnXSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGNyZWF0ZVF1ZXJ5KGRhdGE6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBgcXVlcnktJHtEYXRlLm5vdygpfWAsXG4gICAgICAuLi5kYXRhLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgdXBkYXRlUXVlcnkoaWQ6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQsXG4gICAgICAuLi5kYXRhLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGRlbGV0ZVF1ZXJ5KGlkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBleGVjdXRlUXVlcnkoaWQ6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBjb2x1bW5zOiBbJ2lkJywgJ25hbWUnLCAnZW1haWwnLCAnc3RhdHVzJ10sXG4gICAgICByb3dzOiBbXG4gICAgICAgIHsgaWQ6IDEsIG5hbWU6ICdcdTVGMjBcdTRFMDknLCBlbWFpbDogJ3poYW5nQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICAgICAgICB7IGlkOiAyLCBuYW1lOiAnXHU2NzRFXHU1NkRCJywgZW1haWw6ICdsaUBleGFtcGxlLmNvbScsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgICAgICAgeyBpZDogMywgbmFtZTogJ1x1NzM4Qlx1NEU5NCcsIGVtYWlsOiAnd2FuZ0BleGFtcGxlLmNvbScsIHN0YXR1czogJ2luYWN0aXZlJyB9LFxuICAgICAgXSxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIGV4ZWN1dGlvblRpbWU6IDAuMjM1LFxuICAgICAgICByb3dDb3VudDogMyxcbiAgICAgICAgdG90YWxQYWdlczogMVxuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG5cbi8qKlxuICogXHU1QkZDXHU1MUZBXHU2MjQwXHU2NzA5XHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IHNlcnZpY2VzID0ge1xuICBkYXRhU291cmNlLFxuICBxdWVyeTogcXVlcnlTZXJ2aWNlSW1wbGVtZW50YXRpb24sXG4gIGludGVncmF0aW9uOiBpbnRlZ3JhdGlvblNlcnZpY2VJbXBsZW1lbnRhdGlvblxufTtcblxuLy8gXHU1QkZDXHU1MUZBbW9jayBzZXJ2aWNlXHU1REU1XHU1MTc3XG5leHBvcnQge1xuICBjcmVhdGVNb2NrUmVzcG9uc2UsXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5XG59O1xuXG4vLyBcdTVCRkNcdTUxRkFcdTU0MDRcdTRFMkFcdTY3MERcdTUyQTFcbmV4cG9ydCBjb25zdCBkYXRhU291cmNlU2VydmljZSA9IHNlcnZpY2VzLmRhdGFTb3VyY2U7XG5leHBvcnQgY29uc3QgcXVlcnlTZXJ2aWNlID0gc2VydmljZXMucXVlcnk7XG5leHBvcnQgY29uc3QgaW50ZWdyYXRpb25TZXJ2aWNlID0gc2VydmljZXMuaW50ZWdyYXRpb247XG5cbi8vIFx1OUVEOFx1OEJBNFx1NUJGQ1x1NTFGQVx1NjI0MFx1NjcwOVx1NjcwRFx1NTJBMVxuZXhwb3J0IGRlZmF1bHQgc2VydmljZXM7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHNcIjtpbXBvcnQgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgKiBhcyBodHRwIGZyb20gJ2h0dHAnO1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NEUwMFx1NEUyQVx1N0I4MFx1NTM1NVx1NzY4NFx1NkQ0Qlx1OEJENVx1NEUyRFx1OTVGNFx1NEVGNlxuICogXHU1M0VBXHU1OTA0XHU3NDA2L2FwaS90ZXN0XHU4REVGXHU1Rjg0XHVGRjBDXHU3NTI4XHU0RThFXHU2RDRCXHU4QkQ1TW9ja1x1N0NGQlx1N0VERlx1NjYyRlx1NTQyNlx1NkI2M1x1NUUzOFx1NURFNVx1NEY1Q1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2ltcGxlTWlkZGxld2FyZSgpIHtcbiAgY29uc29sZS5sb2coJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NURGMlx1NTIxQlx1NUVGQVx1NkQ0Qlx1OEJENVx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NUMwNlx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFx1NzY4NFx1OEJGN1x1NkM0MicpO1xuICBcbiAgcmV0dXJuIGZ1bmN0aW9uIHNpbXBsZU1pZGRsZXdhcmUoXG4gICAgcmVxOiBodHRwLkluY29taW5nTWVzc2FnZSxcbiAgICByZXM6IGh0dHAuU2VydmVyUmVzcG9uc2UsXG4gICAgbmV4dDogQ29ubmVjdC5OZXh0RnVuY3Rpb25cbiAgKSB7XG4gICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kIHx8ICdVTktOT1dOJztcbiAgICBcbiAgICAvLyBcdTUzRUFcdTU5MDRcdTc0MDYvYXBpL3Rlc3RcdThERUZcdTVGODRcbiAgICBpZiAodXJsID09PSAnL2FwaS90ZXN0Jykge1xuICAgICAgY29uc29sZS5sb2coYFtcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NjUzNlx1NTIzMFx1NkQ0Qlx1OEJENVx1OEJGN1x1NkM0MjogJHttZXRob2R9ICR7dXJsfWApO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICAvLyBcdThCQkVcdTdGNkVDT1JTXHU1OTM0XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbicpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1OTA0XHU3NDA2T1BUSU9OU1x1OTg4NFx1NjhDMFx1OEJGN1x1NkM0MlxuICAgICAgICBpZiAobWV0aG9kID09PSAnT1BUSU9OUycpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1OTA0XHU3NDA2T1BUSU9OU1x1OTg4NFx1NjhDMFx1OEJGN1x1NkM0MicpO1xuICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjA0O1xuICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1Nzg2RVx1NEZERFx1ODk4Nlx1NzZENlx1NjM4OVx1NjI0MFx1NjcwOVx1NURGMlx1NjcwOVx1NzY4NENvbnRlbnQtVHlwZVx1RkYwQ1x1OTA3Rlx1NTE0RFx1ODhBQlx1NTQwRVx1N0VFRFx1NEUyRFx1OTVGNFx1NEVGNlx1NjZGNFx1NjUzOVxuICAgICAgICByZXMucmVtb3ZlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTUxQzZcdTU5MDdcdTU0Q0RcdTVFOTRcdTY1NzBcdTYzNkVcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogJ1x1N0I4MFx1NTM1NVx1NkQ0Qlx1OEJENVx1NEUyRFx1OTVGNFx1NEVGNlx1NTRDRFx1NUU5NFx1NjIxMFx1NTI5RicsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzLFxuICAgICAgICAgICAgcGFyYW1zOiB1cmwuaW5jbHVkZXMoJz8nKSA/IHVybC5zcGxpdCgnPycpWzFdIDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTNEMVx1OTAwMVx1NTRDRFx1NUU5NFx1NTI0RFx1Nzg2RVx1NEZERFx1NEUyRFx1NjVBRFx1OEJGN1x1NkM0Mlx1OTRGRVxuICAgICAgICBjb25zb2xlLmxvZygnW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1M0QxXHU5MDAxXHU2RDRCXHU4QkQ1XHU1NENEXHU1RTk0Jyk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VEYXRhLCBudWxsLCAyKSk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTRFMERcdThDMDNcdTc1MjhuZXh0KClcdUZGMENcdTc4NkVcdTRGRERcdThCRjdcdTZDNDJcdTUyMzBcdTZCNjRcdTdFRDNcdTY3NUZcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gXHU1OTA0XHU3NDA2XHU5NTE5XHU4QkVGXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NjVGNlx1NTFGQVx1OTUxOTonLCBlcnJvcik7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTZFMDVcdTk2NjRcdTVERjJcdTY3MDlcdTc2ODRcdTU5MzRcdUZGMENcdTkwN0ZcdTUxNERDb250ZW50LVR5cGVcdTg4QUJcdTY2RjRcdTY1MzlcbiAgICAgICAgcmVzLnJlbW92ZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiAnXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU2NUY2XHU1MUZBXHU5NTE5JyxcbiAgICAgICAgICBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpXG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NEUwRFx1OEMwM1x1NzUyOG5leHQoKVx1RkYwQ1x1Nzg2RVx1NEZERFx1OEJGN1x1NkM0Mlx1NTIzMFx1NkI2NFx1N0VEM1x1Njc1RlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NEUwRFx1NTkwNFx1NzQwNlx1NzY4NFx1OEJGN1x1NkM0Mlx1NEVBNFx1N0VEOVx1NEUwQlx1NEUwMFx1NEUyQVx1NEUyRFx1OTVGNFx1NEVGNlxuICAgIG5leHQoKTtcbiAgfTtcbn0gIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFTYSxhQXFETjtBQTlEUDtBQUFBO0FBU08sSUFBTSxjQUF1QixNQUFNLEtBQUssRUFBRSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTTtBQUN2RSxZQUFNLEtBQUssU0FBUyxJQUFJLENBQUM7QUFDekIsWUFBTSxZQUFZLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQVEsRUFBRSxZQUFZO0FBRWxFLGFBQU87QUFBQSxRQUNMO0FBQUEsUUFDQSxNQUFNLDRCQUFRLElBQUksQ0FBQztBQUFBLFFBQ25CLGFBQWEsd0NBQVUsSUFBSSxDQUFDO0FBQUEsUUFDNUIsVUFBVSxJQUFJLE1BQU0sSUFBSSxhQUFjLElBQUksTUFBTSxJQUFJLGFBQWE7QUFBQSxRQUNqRSxjQUFjLE1BQU8sSUFBSSxJQUFLLENBQUM7QUFBQSxRQUMvQixnQkFBZ0Isc0JBQVEsSUFBSSxJQUFLLENBQUM7QUFBQSxRQUNsQyxXQUFXLElBQUksTUFBTSxJQUFJLFFBQVE7QUFBQSxRQUNqQyxXQUFXLElBQUksTUFBTSxJQUNuQiwwQ0FBMEMsQ0FBQyw0QkFDM0MsbUNBQVUsSUFBSSxNQUFNLElBQUksaUJBQU8sY0FBSTtBQUFBLFFBQ3JDLFFBQVEsSUFBSSxNQUFNLElBQUksVUFBVyxJQUFJLE1BQU0sSUFBSSxjQUFlLElBQUksTUFBTSxJQUFJLGVBQWU7QUFBQSxRQUMzRixlQUFlLElBQUksTUFBTSxJQUFJLFlBQVk7QUFBQSxRQUN6QyxXQUFXO0FBQUEsUUFDWCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQVEsRUFBRSxZQUFZO0FBQUEsUUFDM0QsV0FBVyxFQUFFLElBQUksU0FBUyxNQUFNLDJCQUFPO0FBQUEsUUFDdkMsV0FBVyxFQUFFLElBQUksU0FBUyxNQUFNLDJCQUFPO0FBQUEsUUFDdkMsZ0JBQWdCLEtBQUssTUFBTSxLQUFLLE9BQU8sSUFBSSxFQUFFO0FBQUEsUUFDN0MsWUFBWSxJQUFJLE1BQU07QUFBQSxRQUN0QixVQUFVLElBQUksTUFBTTtBQUFBLFFBQ3BCLGdCQUFnQixJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxLQUFNLEVBQUUsWUFBWTtBQUFBLFFBQzlELGFBQWEsS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUFBLFFBQy9DLGVBQWUsS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUFBLFFBQ2pELE1BQU0sQ0FBQyxlQUFLLElBQUUsQ0FBQyxJQUFJLGVBQUssSUFBSSxDQUFDLEVBQUU7QUFBQSxRQUMvQixnQkFBZ0I7QUFBQSxVQUNkLElBQUksT0FBTyxFQUFFO0FBQUEsVUFDYixTQUFTO0FBQUEsVUFDVCxlQUFlO0FBQUEsVUFDZixNQUFNO0FBQUEsVUFDTixLQUFLLDBDQUEwQyxDQUFDO0FBQUEsVUFDaEQsY0FBYyxNQUFPLElBQUksSUFBSyxDQUFDO0FBQUEsVUFDL0IsUUFBUTtBQUFBLFVBQ1IsVUFBVTtBQUFBLFVBQ1YsV0FBVztBQUFBLFFBQ2I7QUFBQSxRQUNBLFVBQVUsQ0FBQztBQUFBLFVBQ1QsSUFBSSxPQUFPLEVBQUU7QUFBQSxVQUNiLFNBQVM7QUFBQSxVQUNULGVBQWU7QUFBQSxVQUNmLE1BQU07QUFBQSxVQUNOLEtBQUssMENBQTBDLENBQUM7QUFBQSxVQUNoRCxjQUFjLE1BQU8sSUFBSSxJQUFLLENBQUM7QUFBQSxVQUMvQixRQUFRO0FBQUEsVUFDUixVQUFVO0FBQUEsVUFDVixXQUFXO0FBQUEsUUFDYixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0YsQ0FBQztBQUVELElBQU8sZ0JBQVE7QUFBQTtBQUFBOzs7QUM5RDJYLFNBQVMsY0FBYyxlQUFnQztBQUNqYyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZ0JBQWdCO0FBQ3pCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCOzs7QUNJekIsU0FBUyxhQUFhOzs7QUNGZixTQUFTLFlBQXFCO0FBQ25DLE1BQUk7QUFFRixRQUFJLE9BQU8sWUFBWSxlQUFlLFFBQVEsS0FBSztBQUNqRCxVQUFJLFFBQVEsSUFBSSxzQkFBc0IsUUFBUTtBQUM1QyxlQUFPO0FBQUEsTUFDVDtBQUNBLFVBQUksUUFBUSxJQUFJLHNCQUFzQixTQUFTO0FBQzdDLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFFBQUksT0FBTyxnQkFBZ0IsZUFBZSxZQUFZLEtBQUs7QUFDekQsVUFBSSxZQUFZLElBQUksc0JBQXNCLFFBQVE7QUFDaEQsZUFBTztBQUFBLE1BQ1Q7QUFDQSxVQUFJLFlBQVksSUFBSSxzQkFBc0IsU0FBUztBQUNqRCxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFHQSxRQUFJLE9BQU8sV0FBVyxlQUFlLE9BQU8sY0FBYztBQUN4RCxZQUFNLG9CQUFvQixhQUFhLFFBQVEsY0FBYztBQUM3RCxVQUFJLHNCQUFzQixRQUFRO0FBQ2hDLGVBQU87QUFBQSxNQUNUO0FBQ0EsVUFBSSxzQkFBc0IsU0FBUztBQUNqQyxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFHQSxVQUFNLGdCQUNILE9BQU8sWUFBWSxlQUFlLFFBQVEsT0FBTyxRQUFRLElBQUksYUFBYSxpQkFDMUUsT0FBTyxnQkFBZ0IsZUFBZSxZQUFZLE9BQU8sWUFBWSxJQUFJLFFBQVE7QUFFcEYsV0FBTztBQUFBLEVBQ1QsU0FBUyxPQUFPO0FBRWQsWUFBUSxLQUFLLHlHQUE4QixLQUFLO0FBQ2hELFdBQU87QUFBQSxFQUNUO0FBQ0Y7QUFRTyxJQUFNLGFBQWE7QUFBQTtBQUFBLEVBRXhCLFNBQVMsVUFBVTtBQUFBO0FBQUEsRUFHbkIsT0FBTztBQUFBO0FBQUEsRUFHUCxhQUFhO0FBQUE7QUFBQSxFQUdiLFVBQVU7QUFBQTtBQUFBLEVBR1YsU0FBUztBQUFBLElBQ1AsYUFBYTtBQUFBLElBQ2IsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLElBQ1AsZ0JBQWdCO0FBQUEsRUFDbEI7QUFDRjtBQUdPLFNBQVMsa0JBQWtCLEtBQW1CO0FBRW5ELE1BQUksQ0FBQyxXQUFXLFNBQVM7QUFDdkIsV0FBTztBQUFBLEVBQ1Q7QUFHQSxRQUFNLE9BQU0sMkJBQUssUUFBTztBQUN4QixNQUFJLE9BQU8sUUFBUSxVQUFVO0FBQzNCLFlBQVEsTUFBTSxtREFBcUIsR0FBRztBQUN0QyxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksQ0FBQyxJQUFJLFdBQVcsV0FBVyxXQUFXLEdBQUc7QUFDM0MsV0FBTztBQUFBLEVBQ1Q7QUFHQSxTQUFPO0FBQ1Q7QUFHTyxTQUFTLFFBQVEsVUFBc0MsTUFBbUI7QUFDL0UsUUFBTSxFQUFFLFNBQVMsSUFBSTtBQUVyQixNQUFJLGFBQWE7QUFBUTtBQUV6QixNQUFJLFVBQVUsV0FBVyxDQUFDLFNBQVMsUUFBUSxPQUFPLEVBQUUsU0FBUyxRQUFRLEdBQUc7QUFDdEUsWUFBUSxNQUFNLGdCQUFnQixHQUFHLElBQUk7QUFBQSxFQUN2QyxXQUFXLFVBQVUsVUFBVSxDQUFDLFFBQVEsT0FBTyxFQUFFLFNBQVMsUUFBUSxHQUFHO0FBQ25FLFlBQVEsS0FBSyxlQUFlLEdBQUcsSUFBSTtBQUFBLEVBQ3JDLFdBQVcsVUFBVSxXQUFXLGFBQWEsU0FBUztBQUNwRCxZQUFRLElBQUksZ0JBQWdCLEdBQUcsSUFBSTtBQUFBLEVBQ3JDO0FBQ0Y7QUFHQSxJQUFJO0FBQ0YsVUFBUSxJQUFJLG9DQUFnQixXQUFXLFVBQVUsdUJBQVEsb0JBQUssRUFBRTtBQUNoRSxNQUFJLFdBQVcsU0FBUztBQUN0QixZQUFRLElBQUksd0JBQWM7QUFBQSxNQUN4QixPQUFPLFdBQVc7QUFBQSxNQUNsQixhQUFhLFdBQVc7QUFBQSxNQUN4QixVQUFVLFdBQVc7QUFBQSxNQUNyQixnQkFBZ0IsT0FBTyxRQUFRLFdBQVcsT0FBTyxFQUM5QyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sTUFBTSxPQUFPLEVBQ2hDLElBQUksQ0FBQyxDQUFDLElBQUksTUFBTSxJQUFJO0FBQUEsSUFDekIsQ0FBQztBQUFBLEVBQ0g7QUFDRixTQUFTLE9BQU87QUFDZCxVQUFRLEtBQUssMkRBQW1CLEtBQUs7QUFDdkM7OztBQ2pHTyxJQUFNLGtCQUFnQztBQUFBLEVBQzNDO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsSUFDZixjQUFjLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFRLEVBQUUsWUFBWTtBQUFBLElBQzFELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVUsRUFBRSxZQUFZO0FBQUEsSUFDekQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBUyxFQUFFLFlBQVk7QUFBQSxJQUN4RCxVQUFVO0FBQUEsRUFDWjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxJQUNmLGNBQWMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQU8sRUFBRSxZQUFZO0FBQUEsSUFDekQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFTLEVBQUUsWUFBWTtBQUFBLElBQ3hELFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sY0FBYztBQUFBLElBQ2QsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLElBQ2YsY0FBYztBQUFBLElBQ2QsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFTLEVBQUUsWUFBWTtBQUFBLElBQ3hELFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sY0FBYztBQUFBLElBQ2QsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLElBQ2YsY0FBYyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBUyxFQUFFLFlBQVk7QUFBQSxJQUMzRCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFVLEVBQUUsWUFBWTtBQUFBLElBQ3pELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVUsRUFBRSxZQUFZO0FBQUEsSUFDekQsVUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsSUFDZixjQUFjLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFTLEVBQUUsWUFBWTtBQUFBLElBQzNELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE9BQVcsRUFBRSxZQUFZO0FBQUEsSUFDMUQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxVQUFVO0FBQUEsRUFDWjtBQUNGOzs7QUN4R0EsSUFBSSxjQUFjLENBQUMsR0FBRyxlQUFlO0FBS3JDLGVBQWUsZ0JBQStCO0FBQzVDLFFBQU1BLFNBQVEsT0FBTyxXQUFXLFVBQVUsV0FBVyxXQUFXLFFBQVE7QUFDeEUsU0FBTyxJQUFJLFFBQVEsYUFBVyxXQUFXLFNBQVNBLE1BQUssQ0FBQztBQUMxRDtBQUtPLFNBQVMsbUJBQXlCO0FBQ3ZDLGdCQUFjLENBQUMsR0FBRyxlQUFlO0FBQ25DO0FBT0EsZUFBc0IsZUFBZSxRQWNsQztBQUVELFFBQU0sY0FBYztBQUVwQixRQUFNLFFBQU8saUNBQVEsU0FBUTtBQUM3QixRQUFNLFFBQU8saUNBQVEsU0FBUTtBQUc3QixNQUFJLGdCQUFnQixDQUFDLEdBQUcsV0FBVztBQUduQyxNQUFJLGlDQUFRLE1BQU07QUFDaEIsVUFBTSxVQUFVLE9BQU8sS0FBSyxZQUFZO0FBQ3hDLG9CQUFnQixjQUFjO0FBQUEsTUFBTyxRQUNuQyxHQUFHLEtBQUssWUFBWSxFQUFFLFNBQVMsT0FBTyxLQUNyQyxHQUFHLGVBQWUsR0FBRyxZQUFZLFlBQVksRUFBRSxTQUFTLE9BQU87QUFBQSxJQUNsRTtBQUFBLEVBQ0Y7QUFHQSxNQUFJLGlDQUFRLE1BQU07QUFDaEIsb0JBQWdCLGNBQWMsT0FBTyxRQUFNLEdBQUcsU0FBUyxPQUFPLElBQUk7QUFBQSxFQUNwRTtBQUdBLE1BQUksaUNBQVEsUUFBUTtBQUNsQixvQkFBZ0IsY0FBYyxPQUFPLFFBQU0sR0FBRyxXQUFXLE9BQU8sTUFBTTtBQUFBLEVBQ3hFO0FBR0EsUUFBTSxTQUFTLE9BQU8sS0FBSztBQUMzQixRQUFNLE1BQU0sS0FBSyxJQUFJLFFBQVEsTUFBTSxjQUFjLE1BQU07QUFDdkQsUUFBTSxpQkFBaUIsY0FBYyxNQUFNLE9BQU8sR0FBRztBQUdyRCxTQUFPO0FBQUEsSUFDTCxPQUFPO0FBQUEsSUFDUCxZQUFZO0FBQUEsTUFDVixPQUFPLGNBQWM7QUFBQSxNQUNyQjtBQUFBLE1BQ0E7QUFBQSxNQUNBLFlBQVksS0FBSyxLQUFLLGNBQWMsU0FBUyxJQUFJO0FBQUEsSUFDbkQ7QUFBQSxFQUNGO0FBQ0Y7QUFPQSxlQUFzQixjQUFjLElBQWlDO0FBRW5FLFFBQU0sY0FBYztBQUdwQixRQUFNLGFBQWEsWUFBWSxLQUFLLFFBQU0sR0FBRyxPQUFPLEVBQUU7QUFFdEQsTUFBSSxDQUFDLFlBQVk7QUFDZixVQUFNLElBQUksTUFBTSw2QkFBUyxFQUFFLDBCQUFNO0FBQUEsRUFDbkM7QUFFQSxTQUFPO0FBQ1Q7QUFPQSxlQUFzQixpQkFBaUIsTUFBZ0Q7QUFFckYsUUFBTSxjQUFjO0FBR3BCLFFBQU0sUUFBUSxNQUFNLEtBQUssSUFBSSxDQUFDO0FBRzlCLFFBQU0sZ0JBQTRCO0FBQUEsSUFDaEMsSUFBSTtBQUFBLElBQ0osTUFBTSxLQUFLLFFBQVE7QUFBQSxJQUNuQixhQUFhLEtBQUssZUFBZTtBQUFBLElBQ2pDLE1BQU0sS0FBSyxRQUFRO0FBQUEsSUFDbkIsTUFBTSxLQUFLO0FBQUEsSUFDWCxNQUFNLEtBQUs7QUFBQSxJQUNYLGNBQWMsS0FBSztBQUFBLElBQ25CLFVBQVUsS0FBSztBQUFBLElBQ2YsUUFBUSxLQUFLLFVBQVU7QUFBQSxJQUN2QixlQUFlLEtBQUssaUJBQWlCO0FBQUEsSUFDckMsY0FBYztBQUFBLElBQ2QsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ2xDLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxJQUNsQyxVQUFVO0FBQUEsRUFDWjtBQUdBLGNBQVksS0FBSyxhQUFhO0FBRTlCLFNBQU87QUFDVDtBQVFBLGVBQXNCLGlCQUFpQixJQUFZLE1BQWdEO0FBRWpHLFFBQU0sY0FBYztBQUdwQixRQUFNLFFBQVEsWUFBWSxVQUFVLFFBQU0sR0FBRyxPQUFPLEVBQUU7QUFFdEQsTUFBSSxVQUFVLElBQUk7QUFDaEIsVUFBTSxJQUFJLE1BQU0sNkJBQVMsRUFBRSwwQkFBTTtBQUFBLEVBQ25DO0FBR0EsUUFBTSxvQkFBZ0M7QUFBQSxJQUNwQyxHQUFHLFlBQVksS0FBSztBQUFBLElBQ3BCLEdBQUc7QUFBQSxJQUNILFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxFQUNwQztBQUdBLGNBQVksS0FBSyxJQUFJO0FBRXJCLFNBQU87QUFDVDtBQU1BLGVBQXNCLGlCQUFpQixJQUEyQjtBQUVoRSxRQUFNLGNBQWM7QUFHcEIsUUFBTSxRQUFRLFlBQVksVUFBVSxRQUFNLEdBQUcsT0FBTyxFQUFFO0FBRXRELE1BQUksVUFBVSxJQUFJO0FBQ2hCLFVBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsMEJBQU07QUFBQSxFQUNuQztBQUdBLGNBQVksT0FBTyxPQUFPLENBQUM7QUFDN0I7QUFPQSxlQUFzQixlQUFlLFFBSWxDO0FBRUQsUUFBTSxjQUFjO0FBSXBCLFFBQU0sVUFBVSxLQUFLLE9BQU8sSUFBSTtBQUVoQyxTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0EsU0FBUyxVQUFVLDZCQUFTO0FBQUEsSUFDNUIsU0FBUyxVQUFVO0FBQUEsTUFDakIsY0FBYyxLQUFLLE1BQU0sS0FBSyxPQUFPLElBQUksRUFBRSxJQUFJO0FBQUEsTUFDL0MsU0FBUztBQUFBLE1BQ1QsY0FBYyxLQUFLLE1BQU0sS0FBSyxPQUFPLElBQUksR0FBSyxJQUFJO0FBQUEsSUFDcEQsSUFBSTtBQUFBLE1BQ0YsV0FBVztBQUFBLE1BQ1gsY0FBYztBQUFBLElBQ2hCO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxxQkFBUTtBQUFBLEVBQ2I7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjs7O0FDM0pPLFNBQVMsTUFBTSxLQUFhLEtBQW9CO0FBQ3JELFNBQU8sSUFBSSxRQUFRLGFBQVcsV0FBVyxTQUFTLEVBQUUsQ0FBQztBQUN2RDs7O0FDNUVBO0FBbUVBLGVBQWVDLGlCQUErQjtBQUM1QyxRQUFNLFlBQVksT0FBTyxXQUFXLFVBQVUsV0FBVyxXQUFXLFFBQVE7QUFDNUUsU0FBTyxNQUFNLFNBQVM7QUFDeEI7QUFLQSxJQUFNLGVBQWU7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUluQixNQUFNLFdBQVcsUUFBNEI7QUFDM0MsVUFBTUEsZUFBYztBQUVwQixVQUFNLFFBQU8saUNBQVEsU0FBUTtBQUM3QixVQUFNLFFBQU8saUNBQVEsU0FBUTtBQUc3QixRQUFJLGdCQUFnQixDQUFDLEdBQUcsV0FBVztBQUduQyxRQUFJLGlDQUFRLE1BQU07QUFDaEIsWUFBTSxVQUFVLE9BQU8sS0FBSyxZQUFZO0FBQ3hDLHNCQUFnQixjQUFjO0FBQUEsUUFBTyxPQUNuQyxFQUFFLEtBQUssWUFBWSxFQUFFLFNBQVMsT0FBTyxLQUNwQyxFQUFFLGVBQWUsRUFBRSxZQUFZLFlBQVksRUFBRSxTQUFTLE9BQU87QUFBQSxNQUNoRTtBQUFBLElBQ0Y7QUFHQSxRQUFJLGlDQUFRLGNBQWM7QUFDeEIsc0JBQWdCLGNBQWMsT0FBTyxPQUFLLEVBQUUsaUJBQWlCLE9BQU8sWUFBWTtBQUFBLElBQ2xGO0FBR0EsUUFBSSxpQ0FBUSxRQUFRO0FBQ2xCLHNCQUFnQixjQUFjLE9BQU8sT0FBSyxFQUFFLFdBQVcsT0FBTyxNQUFNO0FBQUEsSUFDdEU7QUFHQSxRQUFJLGlDQUFRLFdBQVc7QUFDckIsc0JBQWdCLGNBQWMsT0FBTyxPQUFLLEVBQUUsY0FBYyxPQUFPLFNBQVM7QUFBQSxJQUM1RTtBQUdBLFFBQUksaUNBQVEsWUFBWTtBQUN0QixzQkFBZ0IsY0FBYyxPQUFPLE9BQUssRUFBRSxlQUFlLElBQUk7QUFBQSxJQUNqRTtBQUdBLFVBQU0sU0FBUyxPQUFPLEtBQUs7QUFDM0IsVUFBTSxNQUFNLEtBQUssSUFBSSxRQUFRLE1BQU0sY0FBYyxNQUFNO0FBQ3ZELFVBQU0saUJBQWlCLGNBQWMsTUFBTSxPQUFPLEdBQUc7QUFHckQsV0FBTztBQUFBLE1BQ0wsT0FBTztBQUFBLE1BQ1AsWUFBWTtBQUFBLFFBQ1YsT0FBTyxjQUFjO0FBQUEsUUFDckI7QUFBQSxRQUNBO0FBQUEsUUFDQSxZQUFZLEtBQUssS0FBSyxjQUFjLFNBQVMsSUFBSTtBQUFBLE1BQ25EO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sbUJBQW1CLFFBQTRCO0FBQ25ELFVBQU1BLGVBQWM7QUFFcEIsVUFBTSxRQUFPLGlDQUFRLFNBQVE7QUFDN0IsVUFBTSxRQUFPLGlDQUFRLFNBQVE7QUFHN0IsUUFBSSxrQkFBa0IsWUFBWSxPQUFPLE9BQUssRUFBRSxlQUFlLElBQUk7QUFHbkUsU0FBSSxpQ0FBUSxVQUFRLGlDQUFRLFNBQVE7QUFDbEMsWUFBTSxXQUFXLE9BQU8sUUFBUSxPQUFPLFVBQVUsSUFBSSxZQUFZO0FBQ2pFLHdCQUFrQixnQkFBZ0I7QUFBQSxRQUFPLE9BQ3ZDLEVBQUUsS0FBSyxZQUFZLEVBQUUsU0FBUyxPQUFPLEtBQ3BDLEVBQUUsZUFBZSxFQUFFLFlBQVksWUFBWSxFQUFFLFNBQVMsT0FBTztBQUFBLE1BQ2hFO0FBQUEsSUFDRjtBQUVBLFFBQUksaUNBQVEsY0FBYztBQUN4Qix3QkFBa0IsZ0JBQWdCLE9BQU8sT0FBSyxFQUFFLGlCQUFpQixPQUFPLFlBQVk7QUFBQSxJQUN0RjtBQUVBLFFBQUksaUNBQVEsUUFBUTtBQUNsQix3QkFBa0IsZ0JBQWdCLE9BQU8sT0FBSyxFQUFFLFdBQVcsT0FBTyxNQUFNO0FBQUEsSUFDMUU7QUFHQSxVQUFNLFNBQVMsT0FBTyxLQUFLO0FBQzNCLFVBQU0sTUFBTSxLQUFLLElBQUksUUFBUSxNQUFNLGdCQUFnQixNQUFNO0FBQ3pELFVBQU0saUJBQWlCLGdCQUFnQixNQUFNLE9BQU8sR0FBRztBQUd2RCxXQUFPO0FBQUEsTUFDTCxPQUFPO0FBQUEsTUFDUCxZQUFZO0FBQUEsUUFDVixPQUFPLGdCQUFnQjtBQUFBLFFBQ3ZCO0FBQUEsUUFDQTtBQUFBLFFBQ0EsWUFBWSxLQUFLLEtBQUssZ0JBQWdCLFNBQVMsSUFBSTtBQUFBLE1BQ3JEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sU0FBUyxJQUEwQjtBQUN2QyxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sUUFBUSxZQUFZLEtBQUssT0FBSyxFQUFFLE9BQU8sRUFBRTtBQUUvQyxRQUFJLENBQUMsT0FBTztBQUNWLFlBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsb0JBQUs7QUFBQSxJQUNsQztBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLFlBQVksTUFBeUI7QUFDekMsVUFBTUEsZUFBYztBQUdwQixVQUFNLEtBQUssU0FBUyxZQUFZLFNBQVMsQ0FBQztBQUMxQyxVQUFNLGFBQVksb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFHekMsVUFBTSxXQUFXO0FBQUEsTUFDZjtBQUFBLE1BQ0EsTUFBTSxLQUFLLFFBQVEsc0JBQU8sRUFBRTtBQUFBLE1BQzVCLGFBQWEsS0FBSyxlQUFlO0FBQUEsTUFDakMsVUFBVSxLQUFLLFlBQVk7QUFBQSxNQUMzQixjQUFjLEtBQUs7QUFBQSxNQUNuQixnQkFBZ0IsS0FBSyxrQkFBa0Isc0JBQU8sS0FBSyxZQUFZO0FBQUEsTUFDL0QsV0FBVyxLQUFLLGFBQWE7QUFBQSxNQUM3QixXQUFXLEtBQUssYUFBYTtBQUFBLE1BQzdCLFFBQVEsS0FBSyxVQUFVO0FBQUEsTUFDdkIsZUFBZSxLQUFLLGlCQUFpQjtBQUFBLE1BQ3JDLFdBQVc7QUFBQSxNQUNYLFdBQVc7QUFBQSxNQUNYLFdBQVcsS0FBSyxhQUFhLEVBQUUsSUFBSSxTQUFTLE1BQU0sMkJBQU87QUFBQSxNQUN6RCxXQUFXLEtBQUssYUFBYSxFQUFFLElBQUksU0FBUyxNQUFNLDJCQUFPO0FBQUEsTUFDekQsZ0JBQWdCO0FBQUEsTUFDaEIsWUFBWSxLQUFLLGNBQWM7QUFBQSxNQUMvQixVQUFVLEtBQUssWUFBWTtBQUFBLE1BQzNCLGdCQUFnQjtBQUFBLE1BQ2hCLGFBQWE7QUFBQSxNQUNiLGVBQWU7QUFBQSxNQUNmLE1BQU0sS0FBSyxRQUFRLENBQUM7QUFBQSxNQUNwQixnQkFBZ0I7QUFBQSxRQUNkLElBQUksT0FBTyxFQUFFO0FBQUEsUUFDYixTQUFTO0FBQUEsUUFDVCxlQUFlO0FBQUEsUUFDZixNQUFNO0FBQUEsUUFDTixLQUFLLEtBQUssYUFBYTtBQUFBLFFBQ3ZCLGNBQWMsS0FBSztBQUFBLFFBQ25CLFFBQVE7QUFBQSxRQUNSLFVBQVU7QUFBQSxRQUNWLFdBQVc7QUFBQSxNQUNiO0FBQUEsTUFDQSxVQUFVLENBQUM7QUFBQSxRQUNULElBQUksT0FBTyxFQUFFO0FBQUEsUUFDYixTQUFTO0FBQUEsUUFDVCxlQUFlO0FBQUEsUUFDZixNQUFNO0FBQUEsUUFDTixLQUFLLEtBQUssYUFBYTtBQUFBLFFBQ3ZCLGNBQWMsS0FBSztBQUFBLFFBQ25CLFFBQVE7QUFBQSxRQUNSLFVBQVU7QUFBQSxRQUNWLFdBQVc7QUFBQSxNQUNiLENBQUM7QUFBQSxJQUNIO0FBR0EsZ0JBQVksS0FBSyxRQUFRO0FBRXpCLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLFlBQVksSUFBWSxNQUF5QjtBQUNyRCxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sUUFBUSxZQUFZLFVBQVUsT0FBSyxFQUFFLE9BQU8sRUFBRTtBQUVwRCxRQUFJLFVBQVUsSUFBSTtBQUNoQixZQUFNLElBQUksTUFBTSw2QkFBUyxFQUFFLG9CQUFLO0FBQUEsSUFDbEM7QUFHQSxVQUFNLGVBQWU7QUFBQSxNQUNuQixHQUFHLFlBQVksS0FBSztBQUFBLE1BQ3BCLEdBQUc7QUFBQSxNQUNILFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxNQUNsQyxXQUFXLEtBQUssYUFBYSxZQUFZLEtBQUssRUFBRSxhQUFhLEVBQUUsSUFBSSxTQUFTLE1BQU0sMkJBQU87QUFBQSxJQUMzRjtBQUdBLGdCQUFZLEtBQUssSUFBSTtBQUVyQixXQUFPO0FBQUEsRUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxZQUFZLElBQTJCO0FBQzNDLFVBQU1BLGVBQWM7QUFHcEIsVUFBTSxRQUFRLFlBQVksVUFBVSxPQUFLLEVBQUUsT0FBTyxFQUFFO0FBRXBELFFBQUksVUFBVSxJQUFJO0FBQ2hCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsb0JBQUs7QUFBQSxJQUNsQztBQUdBLGdCQUFZLE9BQU8sT0FBTyxDQUFDO0FBQUEsRUFDN0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sYUFBYSxJQUFZLFFBQTRCO0FBQ3pELFVBQU1BLGVBQWM7QUFHcEIsVUFBTSxRQUFRLFlBQVksS0FBSyxPQUFLLEVBQUUsT0FBTyxFQUFFO0FBRS9DLFFBQUksQ0FBQyxPQUFPO0FBQ1YsWUFBTSxJQUFJLE1BQU0sNkJBQVMsRUFBRSxvQkFBSztBQUFBLElBQ2xDO0FBR0EsVUFBTSxVQUFVLENBQUMsTUFBTSxRQUFRLFNBQVMsVUFBVSxZQUFZO0FBQzlELFVBQU0sT0FBTyxNQUFNLEtBQUssRUFBRSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsT0FBTztBQUFBLE1BQ2pELElBQUksSUFBSTtBQUFBLE1BQ1IsTUFBTSxnQkFBTSxJQUFJLENBQUM7QUFBQSxNQUNqQixPQUFPLE9BQU8sSUFBSSxDQUFDO0FBQUEsTUFDbkIsUUFBUSxJQUFJLE1BQU0sSUFBSSxXQUFXO0FBQUEsTUFDakMsWUFBWSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxLQUFRLEVBQUUsWUFBWTtBQUFBLElBQzlELEVBQUU7QUFHRixVQUFNLFFBQVEsWUFBWSxVQUFVLE9BQUssRUFBRSxPQUFPLEVBQUU7QUFDcEQsUUFBSSxVQUFVLElBQUk7QUFDaEIsa0JBQVksS0FBSyxJQUFJO0FBQUEsUUFDbkIsR0FBRyxZQUFZLEtBQUs7QUFBQSxRQUNwQixpQkFBaUIsWUFBWSxLQUFLLEVBQUUsa0JBQWtCLEtBQUs7QUFBQSxRQUMzRCxpQkFBZ0Isb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxRQUN2QyxhQUFhLEtBQUs7QUFBQSxNQUNwQjtBQUFBLElBQ0Y7QUFHQSxXQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0E7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLGVBQWUsS0FBSyxPQUFPLElBQUksTUFBTTtBQUFBLFFBQ3JDLFVBQVUsS0FBSztBQUFBLFFBQ2YsWUFBWTtBQUFBLE1BQ2Q7QUFBQSxNQUNBLE9BQU87QUFBQSxRQUNMLElBQUksTUFBTTtBQUFBLFFBQ1YsTUFBTSxNQUFNO0FBQUEsUUFDWixjQUFjLE1BQU07QUFBQSxNQUN0QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLGVBQWUsSUFBMEI7QUFDN0MsVUFBTUEsZUFBYztBQUdwQixVQUFNLFFBQVEsWUFBWSxVQUFVLE9BQUssRUFBRSxPQUFPLEVBQUU7QUFFcEQsUUFBSSxVQUFVLElBQUk7QUFDaEIsWUFBTSxJQUFJLE1BQU0sNkJBQVMsRUFBRSxvQkFBSztBQUFBLElBQ2xDO0FBR0EsZ0JBQVksS0FBSyxJQUFJO0FBQUEsTUFDbkIsR0FBRyxZQUFZLEtBQUs7QUFBQSxNQUNwQixZQUFZLENBQUMsWUFBWSxLQUFLLEVBQUU7QUFBQSxNQUNoQyxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDcEM7QUFFQSxXQUFPLFlBQVksS0FBSztBQUFBLEVBQzFCO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLGdCQUFnQixRQUE0QjtBQUNoRCxVQUFNQSxlQUFjO0FBRXBCLFVBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBQzdCLFVBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBRzdCLFVBQU0sYUFBYTtBQUNuQixVQUFNLFlBQVksTUFBTSxLQUFLLEVBQUUsUUFBUSxXQUFXLEdBQUcsQ0FBQyxHQUFHLE1BQU07QUFDN0QsWUFBTSxZQUFZLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLElBQU8sRUFBRSxZQUFZO0FBQ2pFLFlBQU0sYUFBYSxJQUFJLFlBQVk7QUFFbkMsYUFBTztBQUFBLFFBQ0wsSUFBSSxRQUFRLElBQUksQ0FBQztBQUFBLFFBQ2pCLFNBQVMsWUFBWSxVQUFVLEVBQUU7QUFBQSxRQUNqQyxXQUFXLFlBQVksVUFBVSxFQUFFO0FBQUEsUUFDbkMsWUFBWTtBQUFBLFFBQ1osZUFBZSxLQUFLLE9BQU8sSUFBSSxNQUFNO0FBQUEsUUFDckMsVUFBVSxLQUFLLE1BQU0sS0FBSyxPQUFPLElBQUksR0FBRyxJQUFJO0FBQUEsUUFDNUMsUUFBUTtBQUFBLFFBQ1IsVUFBVTtBQUFBLFFBQ1YsUUFBUSxJQUFJLE1BQU0sSUFBSSxXQUFXO0FBQUEsUUFDakMsY0FBYyxJQUFJLE1BQU0sSUFBSSx5Q0FBVztBQUFBLE1BQ3pDO0FBQUEsSUFDRixDQUFDO0FBR0QsVUFBTSxTQUFTLE9BQU8sS0FBSztBQUMzQixVQUFNLE1BQU0sS0FBSyxJQUFJLFFBQVEsTUFBTSxVQUFVO0FBQzdDLFVBQU0saUJBQWlCLFVBQVUsTUFBTSxPQUFPLEdBQUc7QUFHakQsV0FBTztBQUFBLE1BQ0wsT0FBTztBQUFBLE1BQ1AsWUFBWTtBQUFBLFFBQ1YsT0FBTztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQSxZQUFZLEtBQUssS0FBSyxhQUFhLElBQUk7QUFBQSxNQUN6QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLGlCQUFpQixTQUFpQixRQUE0QjtBQUNsRSxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sUUFBUSxZQUFZLEtBQUssT0FBSyxFQUFFLE9BQU8sT0FBTztBQUVwRCxRQUFJLENBQUMsT0FBTztBQUNWLFlBQU0sSUFBSSxNQUFNLDZCQUFTLE9BQU8sb0JBQUs7QUFBQSxJQUN2QztBQUdBLFdBQU8sTUFBTSxZQUFZLENBQUM7QUFBQSxFQUM1QjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxtQkFBbUIsU0FBaUIsTUFBeUI7QUFuY3JFO0FBb2NJLFVBQU1BLGVBQWM7QUFHcEIsVUFBTSxRQUFRLFlBQVksVUFBVSxPQUFLLEVBQUUsT0FBTyxPQUFPO0FBRXpELFFBQUksVUFBVSxJQUFJO0FBQ2hCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLE9BQU8sb0JBQUs7QUFBQSxJQUN2QztBQUdBLFVBQU0sUUFBUSxZQUFZLEtBQUs7QUFDL0IsVUFBTSxzQkFBb0IsV0FBTSxhQUFOLG1CQUFnQixXQUFVLEtBQUs7QUFDekQsVUFBTSxhQUFZLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBRXpDLFVBQU0sYUFBYTtBQUFBLE1BQ2pCLElBQUksT0FBTyxPQUFPLElBQUksZ0JBQWdCO0FBQUEsTUFDdEM7QUFBQSxNQUNBLGVBQWU7QUFBQSxNQUNmLE1BQU0sS0FBSyxRQUFRLGdCQUFNLGdCQUFnQjtBQUFBLE1BQ3pDLEtBQUssS0FBSyxPQUFPLE1BQU0sYUFBYTtBQUFBLE1BQ3BDLGNBQWMsS0FBSyxnQkFBZ0IsTUFBTTtBQUFBLE1BQ3pDLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLFdBQVc7QUFBQSxJQUNiO0FBR0EsUUFBSSxNQUFNLFlBQVksTUFBTSxTQUFTLFNBQVMsR0FBRztBQUMvQyxZQUFNLFdBQVcsTUFBTSxTQUFTLElBQUksUUFBTTtBQUFBLFFBQ3hDLEdBQUc7QUFBQSxRQUNILFVBQVU7QUFBQSxNQUNaLEVBQUU7QUFBQSxJQUNKO0FBR0EsUUFBSSxDQUFDLE1BQU0sVUFBVTtBQUNuQixZQUFNLFdBQVcsQ0FBQztBQUFBLElBQ3BCO0FBQ0EsVUFBTSxTQUFTLEtBQUssVUFBVTtBQUc5QixnQkFBWSxLQUFLLElBQUk7QUFBQSxNQUNuQixHQUFHO0FBQUEsTUFDSCxnQkFBZ0I7QUFBQSxNQUNoQixXQUFXO0FBQUEsSUFDYjtBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLG9CQUFvQixXQUFpQztBQUN6RCxVQUFNQSxlQUFjO0FBR3BCLFFBQUksUUFBUTtBQUNaLFFBQUksZUFBZTtBQUNuQixRQUFJLGFBQWE7QUFFakIsYUFBUyxJQUFJLEdBQUcsSUFBSSxZQUFZLFFBQVEsS0FBSztBQUMzQyxVQUFJLFlBQVksQ0FBQyxFQUFFLFVBQVU7QUFDM0IsY0FBTSxTQUFTLFlBQVksQ0FBQyxFQUFFLFNBQVMsVUFBVSxPQUFLLEVBQUUsT0FBTyxTQUFTO0FBQ3hFLFlBQUksV0FBVyxJQUFJO0FBQ2pCLGtCQUFRLFlBQVksQ0FBQztBQUNyQix5QkFBZTtBQUNmLHVCQUFhO0FBQ2I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFFQSxRQUFJLENBQUMsU0FBUyxpQkFBaUIsSUFBSTtBQUNqQyxZQUFNLElBQUksTUFBTSw2QkFBUyxTQUFTLGdDQUFPO0FBQUEsSUFDM0M7QUFHQSxVQUFNLGlCQUFpQjtBQUFBLE1BQ3JCLEdBQUcsTUFBTSxTQUFTLFlBQVk7QUFBQSxNQUM5QixRQUFRO0FBQUEsTUFDUixjQUFhLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDdEM7QUFFQSxVQUFNLFNBQVMsWUFBWSxJQUFJO0FBRy9CLGdCQUFZLFVBQVUsSUFBSTtBQUFBLE1BQ3hCLEdBQUc7QUFBQSxNQUNILFFBQVE7QUFBQSxNQUNSLGdCQUFnQjtBQUFBLE1BQ2hCLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxJQUNwQztBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLHNCQUFzQixXQUFpQztBQUMzRCxVQUFNQSxlQUFjO0FBR3BCLFFBQUksUUFBUTtBQUNaLFFBQUksZUFBZTtBQUNuQixRQUFJLGFBQWE7QUFFakIsYUFBUyxJQUFJLEdBQUcsSUFBSSxZQUFZLFFBQVEsS0FBSztBQUMzQyxVQUFJLFlBQVksQ0FBQyxFQUFFLFVBQVU7QUFDM0IsY0FBTSxTQUFTLFlBQVksQ0FBQyxFQUFFLFNBQVMsVUFBVSxPQUFLLEVBQUUsT0FBTyxTQUFTO0FBQ3hFLFlBQUksV0FBVyxJQUFJO0FBQ2pCLGtCQUFRLFlBQVksQ0FBQztBQUNyQix5QkFBZTtBQUNmLHVCQUFhO0FBQ2I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFFQSxRQUFJLENBQUMsU0FBUyxpQkFBaUIsSUFBSTtBQUNqQyxZQUFNLElBQUksTUFBTSw2QkFBUyxTQUFTLGdDQUFPO0FBQUEsSUFDM0M7QUFHQSxVQUFNLGlCQUFpQjtBQUFBLE1BQ3JCLEdBQUcsTUFBTSxTQUFTLFlBQVk7QUFBQSxNQUM5QixRQUFRO0FBQUEsTUFDUixlQUFjLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDdkM7QUFFQSxVQUFNLFNBQVMsWUFBWSxJQUFJO0FBRy9CLFFBQUksTUFBTSxrQkFBa0IsTUFBTSxlQUFlLE9BQU8sV0FBVztBQUNqRSxrQkFBWSxVQUFVLElBQUk7QUFBQSxRQUN4QixHQUFHO0FBQUEsUUFDSCxRQUFRO0FBQUEsUUFDUixnQkFBZ0I7QUFBQSxRQUNoQixZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsTUFDcEM7QUFBQSxJQUNGLE9BQU87QUFDTCxrQkFBWSxVQUFVLElBQUk7QUFBQSxRQUN4QixHQUFHO0FBQUEsUUFDSCxVQUFVLE1BQU07QUFBQSxRQUNoQixZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsTUFDcEM7QUFBQSxJQUNGO0FBRUEsV0FBTztBQUFBLEVBQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0scUJBQXFCLFNBQWlCLFdBQWlDO0FBQzNFLFVBQU1BLGVBQWM7QUFHcEIsVUFBTSxhQUFhLFlBQVksVUFBVSxPQUFLLEVBQUUsT0FBTyxPQUFPO0FBRTlELFFBQUksZUFBZSxJQUFJO0FBQ3JCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLE9BQU8sb0JBQUs7QUFBQSxJQUN2QztBQUVBLFVBQU0sUUFBUSxZQUFZLFVBQVU7QUFHcEMsUUFBSSxDQUFDLE1BQU0sVUFBVTtBQUNuQixZQUFNLElBQUksTUFBTSxnQkFBTSxPQUFPLDJCQUFPO0FBQUEsSUFDdEM7QUFFQSxVQUFNLGVBQWUsTUFBTSxTQUFTLFVBQVUsT0FBSyxFQUFFLE9BQU8sU0FBUztBQUVyRSxRQUFJLGlCQUFpQixJQUFJO0FBQ3ZCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLFNBQVMsZ0NBQU87QUFBQSxJQUMzQztBQUdBLFVBQU0sb0JBQW9CLE1BQU0sU0FBUyxZQUFZO0FBR3JELGdCQUFZLFVBQVUsSUFBSTtBQUFBLE1BQ3hCLEdBQUc7QUFBQSxNQUNILGdCQUFnQjtBQUFBLE1BQ2hCLFFBQVEsa0JBQWtCO0FBQUEsTUFDMUIsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ3BDO0FBRUEsV0FBTztBQUFBLEVBQ1Q7QUFDRjtBQUVBLElBQU9DLGlCQUFROzs7QUM5bkJSLElBQU0sbUJBQW1CO0FBQUEsRUFDOUI7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVUsRUFBRSxZQUFZO0FBQUEsSUFDekQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBUyxFQUFFLFlBQVk7QUFBQSxJQUN4RCxXQUFXO0FBQUEsTUFDVDtBQUFBLFFBQ0UsSUFBSTtBQUFBLFFBQ0osTUFBTTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxJQUFJO0FBQUEsUUFDSixNQUFNO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFTLEVBQUUsWUFBWTtBQUFBLElBQ3hELFdBQVc7QUFBQSxNQUNUO0FBQUEsUUFDRSxJQUFJO0FBQUEsUUFDSixNQUFNO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0E7QUFBQSxRQUNFLElBQUk7QUFBQSxRQUNKLE1BQU07QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLGFBQWE7QUFBQSxNQUNmO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixjQUFjO0FBQUEsSUFDZCxRQUFRO0FBQUEsSUFDUixXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFTLEVBQUUsWUFBWTtBQUFBLElBQ3hELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVMsRUFBRSxZQUFZO0FBQUEsSUFDeEQsV0FBVztBQUFBLE1BQ1Q7QUFBQSxRQUNFLElBQUk7QUFBQSxRQUNKLE1BQU07QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLGFBQWE7QUFBQSxNQUNmO0FBQUEsTUFDQTtBQUFBLFFBQ0UsSUFBSTtBQUFBLFFBQ0osTUFBTTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxJQUFJO0FBQUEsUUFDSixNQUFNO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBQ3hGQSxlQUFlQyxpQkFBK0I7QUFDNUMsUUFBTSxZQUFZLE9BQU8sV0FBVyxVQUFVLFdBQVcsV0FBVyxRQUFRO0FBQzVFLFNBQU8sTUFBTSxTQUFTO0FBQ3hCO0FBS0EsSUFBTSxxQkFBcUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUl6QixNQUFNLGdCQUFnQixRQUE0QjtBQUNoRCxVQUFNQSxlQUFjO0FBRXBCLFVBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBQzdCLFVBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBRzdCLFFBQUksZ0JBQWdCLENBQUMsR0FBRyxnQkFBZ0I7QUFHeEMsUUFBSSxpQ0FBUSxNQUFNO0FBQ2hCLFlBQU0sVUFBVSxPQUFPLEtBQUssWUFBWTtBQUN4QyxzQkFBZ0IsY0FBYztBQUFBLFFBQU8sT0FDbkMsRUFBRSxLQUFLLFlBQVksRUFBRSxTQUFTLE9BQU8sS0FDcEMsRUFBRSxlQUFlLEVBQUUsWUFBWSxZQUFZLEVBQUUsU0FBUyxPQUFPO0FBQUEsTUFDaEU7QUFBQSxJQUNGO0FBR0EsUUFBSSxpQ0FBUSxNQUFNO0FBQ2hCLHNCQUFnQixjQUFjLE9BQU8sT0FBSyxFQUFFLFNBQVMsT0FBTyxJQUFJO0FBQUEsSUFDbEU7QUFHQSxRQUFJLGlDQUFRLFFBQVE7QUFDbEIsc0JBQWdCLGNBQWMsT0FBTyxPQUFLLEVBQUUsV0FBVyxPQUFPLE1BQU07QUFBQSxJQUN0RTtBQUdBLFVBQU0sU0FBUyxPQUFPLEtBQUs7QUFDM0IsVUFBTSxNQUFNLEtBQUssSUFBSSxRQUFRLE1BQU0sY0FBYyxNQUFNO0FBQ3ZELFVBQU0saUJBQWlCLGNBQWMsTUFBTSxPQUFPLEdBQUc7QUFHckQsV0FBTztBQUFBLE1BQ0wsT0FBTztBQUFBLE1BQ1AsWUFBWTtBQUFBLFFBQ1YsT0FBTyxjQUFjO0FBQUEsUUFDckI7QUFBQSxRQUNBO0FBQUEsUUFDQSxZQUFZLEtBQUssS0FBSyxjQUFjLFNBQVMsSUFBSTtBQUFBLE1BQ25EO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sZUFBZSxJQUEwQjtBQUM3QyxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sY0FBYyxpQkFBaUIsS0FBSyxPQUFLLEVBQUUsT0FBTyxFQUFFO0FBRTFELFFBQUksQ0FBQyxhQUFhO0FBQ2hCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsb0JBQUs7QUFBQSxJQUNsQztBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLGtCQUFrQixNQUF5QjtBQUMvQyxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sUUFBUSxlQUFlLEtBQUssSUFBSSxDQUFDO0FBQ3ZDLFVBQU0sYUFBWSxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUV6QyxVQUFNLGlCQUFpQjtBQUFBLE1BQ3JCLElBQUk7QUFBQSxNQUNKLE1BQU0sS0FBSyxRQUFRO0FBQUEsTUFDbkIsYUFBYSxLQUFLLGVBQWU7QUFBQSxNQUNqQyxNQUFNLEtBQUssUUFBUTtBQUFBLE1BQ25CLFNBQVMsS0FBSyxXQUFXO0FBQUEsTUFDekIsVUFBVSxLQUFLLFlBQVk7QUFBQSxNQUMzQixRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxXQUFXO0FBQUEsTUFDWCxXQUFXLEtBQUssYUFBYSxDQUFDO0FBQUEsSUFDaEM7QUFHQSxRQUFJLEtBQUssYUFBYSxTQUFTO0FBQzdCLGFBQU8sT0FBTyxnQkFBZ0I7QUFBQSxRQUM1QixVQUFVLEtBQUssWUFBWTtBQUFBLFFBQzNCLFVBQVUsS0FBSyxZQUFZO0FBQUEsTUFDN0IsQ0FBQztBQUFBLElBQ0gsV0FBVyxLQUFLLGFBQWEsV0FBVztBQUN0QyxhQUFPLE9BQU8sZ0JBQWdCO0FBQUEsUUFDNUIsUUFBUSxLQUFLLFVBQVU7QUFBQSxNQUN6QixDQUFDO0FBQUEsSUFDSCxXQUFXLEtBQUssYUFBYSxVQUFVO0FBQ3JDLGFBQU8sT0FBTyxnQkFBZ0I7QUFBQSxRQUM1QixVQUFVLEtBQUssWUFBWTtBQUFBLFFBQzNCLGNBQWMsS0FBSyxnQkFBZ0I7QUFBQSxNQUNyQyxDQUFDO0FBQUEsSUFDSDtBQUdBLHFCQUFpQixLQUFLLGNBQWM7QUFFcEMsV0FBTztBQUFBLEVBQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sa0JBQWtCLElBQVksTUFBeUI7QUFDM0QsVUFBTUEsZUFBYztBQUdwQixVQUFNLFFBQVEsaUJBQWlCLFVBQVUsT0FBSyxFQUFFLE9BQU8sRUFBRTtBQUV6RCxRQUFJLFVBQVUsSUFBSTtBQUNoQixZQUFNLElBQUksTUFBTSw2QkFBUyxFQUFFLG9CQUFLO0FBQUEsSUFDbEM7QUFHQSxVQUFNLHFCQUFxQjtBQUFBLE1BQ3pCLEdBQUcsaUJBQWlCLEtBQUs7QUFBQSxNQUN6QixHQUFHO0FBQUEsTUFDSDtBQUFBO0FBQUEsTUFDQSxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDcEM7QUFHQSxxQkFBaUIsS0FBSyxJQUFJO0FBRTFCLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLGtCQUFrQixJQUE4QjtBQUNwRCxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sUUFBUSxpQkFBaUIsVUFBVSxPQUFLLEVBQUUsT0FBTyxFQUFFO0FBRXpELFFBQUksVUFBVSxJQUFJO0FBQ2hCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsb0JBQUs7QUFBQSxJQUNsQztBQUdBLHFCQUFpQixPQUFPLE9BQU8sQ0FBQztBQUVoQyxXQUFPO0FBQUEsRUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxnQkFBZ0IsSUFBWSxTQUFjLENBQUMsR0FBaUI7QUFyTHBFO0FBc0xJLFVBQU1BLGVBQWM7QUFHcEIsVUFBTSxjQUFjLGlCQUFpQixLQUFLLE9BQUssRUFBRSxPQUFPLEVBQUU7QUFFMUQsUUFBSSxDQUFDLGFBQWE7QUFDaEIsWUFBTSxJQUFJLE1BQU0sNkJBQVMsRUFBRSxvQkFBSztBQUFBLElBQ2xDO0FBR0EsV0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLE1BQ1QsWUFBWTtBQUFBLE1BQ1osY0FBYztBQUFBLFFBQ1osUUFBUTtBQUFBLFFBQ1IsU0FBUztBQUFBLFFBQ1QsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLFFBQ2xDLFNBQVM7QUFBQSxVQUNQLGNBQWMsS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUFBLFVBQ2hELFlBQVk7QUFBQSxVQUNaLFVBQVUsT0FBTyxjQUFZLGlCQUFZLFVBQVUsQ0FBQyxNQUF2QixtQkFBMEIsU0FBUTtBQUFBLFFBQ2pFO0FBQUEsUUFDQSxNQUFNLE1BQU0sS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsR0FBRyxPQUFPO0FBQUEsVUFDekMsSUFBSSxJQUFJO0FBQUEsVUFDUixNQUFNLDRCQUFRLElBQUksQ0FBQztBQUFBLFVBQ25CLE9BQU8sS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEdBQUksSUFBSTtBQUFBLFFBQzVDLEVBQUU7QUFBQSxNQUNKO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sYUFBYSxJQUFZLFNBQWMsQ0FBQyxHQUFpQjtBQUM3RCxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sY0FBYyxpQkFBaUIsS0FBSyxPQUFLLEVBQUUsT0FBTyxFQUFFO0FBRTFELFFBQUksQ0FBQyxhQUFhO0FBQ2hCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsb0JBQUs7QUFBQSxJQUNsQztBQUdBLFdBQU87QUFBQSxNQUNMLFNBQVM7QUFBQSxNQUNULFlBQVk7QUFBQSxNQUNaLGNBQWM7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxRQUNsQyxPQUFPLE9BQU8sU0FBUztBQUFBLFFBQ3ZCLE1BQU0sTUFBTSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxHQUFHLE9BQU87QUFBQSxVQUN6QyxJQUFJLFVBQVUsSUFBSSxDQUFDO0FBQUEsVUFDbkIsTUFBTSxnQkFBTSxJQUFJLENBQUM7QUFBQSxVQUNqQixhQUFhLDBEQUFhLElBQUksQ0FBQztBQUFBLFVBQy9CLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksS0FBUSxFQUFFLFlBQVk7QUFBQSxVQUMzRCxZQUFZO0FBQUEsWUFDVixNQUFNLElBQUksTUFBTSxJQUFJLE1BQU07QUFBQSxZQUMxQixPQUFPLEtBQUssTUFBTSxLQUFLLE9BQU8sSUFBSSxHQUFHO0FBQUEsWUFDckMsUUFBUSxJQUFJLE1BQU07QUFBQSxVQUNwQjtBQUFBLFFBQ0YsRUFBRTtBQUFBLE1BQ0o7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHQSxNQUFNLHNCQUFzQztBQUMxQyxVQUFNLFNBQVMsTUFBTSxtQkFBbUIsZ0JBQWdCLENBQUMsQ0FBQztBQUMxRCxXQUFPLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUEsTUFBTSxtQkFBbUIsSUFBaUM7QUFDeEQsUUFBSTtBQUNGLFlBQU0sY0FBYyxNQUFNLG1CQUFtQixlQUFlLEVBQUU7QUFDOUQsYUFBTztBQUFBLElBQ1QsU0FBUyxPQUFPO0FBQ2QsY0FBUSxNQUFNLHlDQUFXLEtBQUs7QUFDOUIsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQUEsRUFFQSxNQUFNLHNCQUFzQixNQUF5QjtBQUNuRCxXQUFPLG1CQUFtQixrQkFBa0IsSUFBSTtBQUFBLEVBQ2xEO0FBQUEsRUFFQSxNQUFNLHNCQUFzQixJQUFZLFNBQTRCO0FBQ2xFLFdBQU8sbUJBQW1CLGtCQUFrQixJQUFJLE9BQU87QUFBQSxFQUN6RDtBQUFBLEVBRUEsTUFBTSxzQkFBc0IsSUFBOEI7QUFDeEQsUUFBSTtBQUNGLGFBQU8sTUFBTSxtQkFBbUIsa0JBQWtCLEVBQUU7QUFBQSxJQUN0RCxTQUFTLE9BQU87QUFDZCxjQUFRLE1BQU0seUNBQVcsS0FBSztBQUM5QixhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFBQSxFQUVBLE1BQU0saUJBQWlCLGVBQXVCLE9BQTBCO0FBQ3RFLFFBQUk7QUFDRixZQUFNLFNBQVMsTUFBTSxtQkFBbUIsYUFBYSxlQUFlLEtBQUs7QUFDekUsYUFBTztBQUFBLFFBQ0wsU0FBUztBQUFBLFFBQ1QsTUFBTSxPQUFPLGFBQWE7QUFBQSxNQUM1QjtBQUFBLElBQ0YsU0FBUyxPQUFPO0FBQ2QsY0FBUSxNQUFNLHlDQUFXLEtBQUs7QUFDOUIsYUFBTztBQUFBLFFBQ0wsU0FBUztBQUFBLFFBQ1QsT0FBTyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsTUFDOUQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBR08sSUFBTSxzQkFBc0IsbUJBQW1CO0FBQy9DLElBQU0scUJBQXFCLG1CQUFtQjtBQUM5QyxJQUFNLHdCQUF3QixtQkFBbUI7QUFDakQsSUFBTSx3QkFBd0IsbUJBQW1CO0FBQ2pELElBQU0sd0JBQXdCLG1CQUFtQjtBQUNqRCxJQUFNLG1CQUFtQixtQkFBbUI7QUFFbkQsSUFBTyxzQkFBUTs7O0FDL0xmLElBQU0sV0FBVztBQUFBLEVBQ2Y7QUFBQSxFQUNBLE9BQU9DO0FBQUEsRUFDUCxhQUFhO0FBQ2Y7QUFXTyxJQUFNLG9CQUFvQixTQUFTO0FBQ25DLElBQU1DLGdCQUFlLFNBQVM7QUFDOUIsSUFBTUMsc0JBQXFCLFNBQVM7OztBUnBIM0MsU0FBUyxXQUFXLEtBQXFCO0FBQ3ZDLE1BQUksVUFBVSwrQkFBK0IsR0FBRztBQUNoRCxNQUFJLFVBQVUsZ0NBQWdDLGlDQUFpQztBQUMvRSxNQUFJLFVBQVUsZ0NBQWdDLDZDQUE2QztBQUMzRixNQUFJLFVBQVUsMEJBQTBCLE9BQU87QUFDakQ7QUFHQSxTQUFTLGlCQUFpQixLQUFxQixRQUFnQixNQUFXO0FBQ3hFLE1BQUksYUFBYTtBQUNqQixNQUFJLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUNoRCxNQUFJLElBQUksS0FBSyxVQUFVLElBQUksQ0FBQztBQUM5QjtBQUdBLFNBQVNDLE9BQU0sSUFBMkI7QUFDeEMsU0FBTyxJQUFJLFFBQVEsYUFBVyxXQUFXLFNBQVMsRUFBRSxDQUFDO0FBQ3ZEO0FBR0EsZUFBZSxpQkFBaUIsS0FBb0M7QUFDbEUsU0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO0FBQzlCLFFBQUksT0FBTztBQUNYLFFBQUksR0FBRyxRQUFRLENBQUMsVUFBVTtBQUN4QixjQUFRLE1BQU0sU0FBUztBQUFBLElBQ3pCLENBQUM7QUFDRCxRQUFJLEdBQUcsT0FBTyxNQUFNO0FBQ2xCLFVBQUk7QUFDRixnQkFBUSxPQUFPLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQUEsTUFDdEMsU0FBUyxHQUFHO0FBQ1YsZ0JBQVEsQ0FBQyxDQUFDO0FBQUEsTUFDWjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0gsQ0FBQztBQUNIO0FBR0EsSUFBTSxtQkFBbUIsQ0FBQyxRQUF3QjtBQUVoRCxNQUFJLElBQUksV0FBVyxXQUFXLEdBQUc7QUFDL0IsVUFBTSxXQUFXLElBQUksUUFBUSxhQUFhLE9BQU87QUFDakQsWUFBUSxJQUFJLDJFQUF5QixHQUFHLE9BQU8sUUFBUSxFQUFFO0FBQ3pELFdBQU87QUFBQSxFQUNUO0FBQ0EsU0FBTztBQUNUO0FBR0EsZUFBZSxxQkFBcUIsS0FBc0IsS0FBcUIsU0FBaUIsVUFBaUM7QUFqRWpJO0FBa0VFLFFBQU0sVUFBUyxTQUFJLFdBQUosbUJBQVk7QUFHM0IsTUFBSSxZQUFZLHNCQUFzQixXQUFXLE9BQU87QUFDdEQsWUFBUSxTQUFTLCtDQUEyQjtBQUU1QyxRQUFJO0FBRUYsWUFBTSxTQUFTLE1BQU0sa0JBQWtCLGVBQWU7QUFBQSxRQUNwRCxNQUFNLFNBQVMsU0FBUyxJQUFjLEtBQUs7QUFBQSxRQUMzQyxNQUFNLFNBQVMsU0FBUyxJQUFjLEtBQUs7QUFBQSxRQUMzQyxNQUFNLFNBQVM7QUFBQSxRQUNmLE1BQU0sU0FBUztBQUFBLFFBQ2YsUUFBUSxTQUFTO0FBQUEsTUFDbkIsQ0FBQztBQUVELHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNLE9BQU87QUFBQSxRQUNiLFlBQVksT0FBTztBQUFBLFFBQ25CLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sOEJBQThCLEtBQUssV0FBVyxPQUFPO0FBQ3JFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLElBQUksS0FBSztBQUV2QyxZQUFRLFNBQVMsZ0NBQVksT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVqRCxRQUFJO0FBQ0YsWUFBTSxhQUFhLE1BQU0sa0JBQWtCLGNBQWMsRUFBRTtBQUMzRCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0gsU0FBUyxPQUFPO0FBQ2QsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE9BQU87QUFBQSxRQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFFBQzlELFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFHQSxNQUFJLFlBQVksc0JBQXNCLFdBQVcsUUFBUTtBQUN2RCxZQUFRLFNBQVMsZ0RBQTRCO0FBRTdDLFFBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxpQkFBaUIsR0FBRztBQUN2QyxZQUFNLGdCQUFnQixNQUFNLGtCQUFrQixpQkFBaUIsSUFBSTtBQUVuRSx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0gsU0FBUyxPQUFPO0FBQ2QsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE9BQU87QUFBQSxRQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFFBQzlELFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFHQSxNQUFJLFFBQVEsTUFBTSw4QkFBOEIsS0FBSyxXQUFXLE9BQU87QUFDckUsVUFBTSxLQUFLLFFBQVEsTUFBTSxHQUFHLEVBQUUsSUFBSSxLQUFLO0FBRXZDLFlBQVEsU0FBUyxnQ0FBWSxPQUFPLFNBQVMsRUFBRSxFQUFFO0FBRWpELFFBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxpQkFBaUIsR0FBRztBQUN2QyxZQUFNLG9CQUFvQixNQUFNLGtCQUFrQixpQkFBaUIsSUFBSSxJQUFJO0FBRTNFLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksUUFBUSxNQUFNLDhCQUE4QixLQUFLLFdBQVcsVUFBVTtBQUN4RSxVQUFNLEtBQUssUUFBUSxNQUFNLEdBQUcsRUFBRSxJQUFJLEtBQUs7QUFFdkMsWUFBUSxTQUFTLG1DQUFlLE9BQU8sU0FBUyxFQUFFLEVBQUU7QUFFcEQsUUFBSTtBQUNGLFlBQU0sa0JBQWtCLGlCQUFpQixFQUFFO0FBRTNDLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksWUFBWSxzQ0FBc0MsV0FBVyxRQUFRO0FBQ3ZFLFlBQVEsU0FBUyxnRUFBNEM7QUFFN0QsUUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLGlCQUFpQixHQUFHO0FBQ3ZDLFlBQU0sU0FBUyxNQUFNLGtCQUFrQixlQUFlLElBQUk7QUFFMUQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBRUEsU0FBTztBQUNUO0FBR0EsZUFBZSxpQkFBaUIsS0FBc0IsS0FBcUIsU0FBaUIsVUFBaUM7QUF4TjdIO0FBeU5FLFFBQU0sVUFBUyxTQUFJLFdBQUosbUJBQVk7QUFHM0IsUUFBTSxnQkFBZ0IsUUFBUSxTQUFTLFVBQVU7QUFHakQsTUFBSSxlQUFlO0FBQ2pCLFlBQVEsSUFBSSx5REFBc0IsTUFBTSxJQUFJLE9BQU8sSUFBSSxRQUFRO0FBQUEsRUFDakU7QUFHQSxNQUFJLFlBQVksa0JBQWtCLFdBQVcsT0FBTztBQUNsRCxZQUFRLFNBQVMsMkNBQXVCO0FBQ3hDLFlBQVEsSUFBSSwwRUFBd0IsUUFBUTtBQUU1QyxRQUFJO0FBRUYsWUFBTSxTQUFTLE1BQU1DLGNBQWEsV0FBVztBQUFBLFFBQzNDLE1BQU0sU0FBUyxTQUFTLElBQWMsS0FBSztBQUFBLFFBQzNDLE1BQU0sU0FBUyxTQUFTLElBQWMsS0FBSztBQUFBLFFBQzNDLE1BQU0sU0FBUztBQUFBLFFBQ2YsY0FBYyxTQUFTO0FBQUEsUUFDdkIsUUFBUSxTQUFTO0FBQUEsUUFDakIsV0FBVyxTQUFTO0FBQUEsUUFDcEIsWUFBWSxTQUFTLGVBQWU7QUFBQSxNQUN0QyxDQUFDO0FBRUQsY0FBUSxJQUFJLGdEQUFrQjtBQUFBLFFBQzVCLFlBQVksT0FBTyxNQUFNO0FBQUEsUUFDekIsWUFBWSxPQUFPO0FBQUEsTUFDckIsQ0FBQztBQUVELGNBQVEsSUFBSSx3RUFBc0I7QUFBQSxRQUNoQyxNQUFNLFNBQVMsT0FBTyxNQUFNLE1BQU07QUFBQSxRQUNsQyxZQUFZLE9BQU87QUFBQSxRQUNuQixTQUFTO0FBQUEsTUFDWCxDQUFDO0FBR0QsVUFBSSxPQUFPLE1BQU0sV0FBVyxHQUFHO0FBQzdCLFlBQUk7QUFFRixnQkFBTSxnQkFBZ0IsTUFBTTtBQUM1QixnQkFBTUMsZUFBYyxjQUFjLGVBQWUsQ0FBQztBQUVsRCxjQUFJQSxhQUFZLFNBQVMsR0FBRztBQUMxQixvQkFBUSxJQUFJLDBGQUF5QkEsYUFBWSxNQUFNO0FBRXZELGtCQUFNLE9BQU8sU0FBUyxTQUFTLElBQWMsS0FBSztBQUNsRCxrQkFBTSxPQUFPLFNBQVMsU0FBUyxJQUFjLEtBQUs7QUFDbEQsa0JBQU0sU0FBUyxPQUFPLEtBQUs7QUFDM0Isa0JBQU0sTUFBTSxLQUFLLElBQUksUUFBUSxNQUFNQSxhQUFZLE1BQU07QUFFckQsa0JBQU0saUJBQWlCQSxhQUFZLE1BQU0sT0FBTyxHQUFHO0FBQ25ELGtCQUFNLGFBQWE7QUFBQSxjQUNqQixPQUFPQSxhQUFZO0FBQUEsY0FDbkI7QUFBQSxjQUNBO0FBQUEsY0FDQSxZQUFZLEtBQUssS0FBS0EsYUFBWSxTQUFTLElBQUk7QUFBQSxZQUNqRDtBQUVBLDZCQUFpQixLQUFLLEtBQUs7QUFBQSxjQUN6QixNQUFNO0FBQUEsY0FDTjtBQUFBLGNBQ0EsU0FBUztBQUFBLFlBQ1gsQ0FBQztBQUNELG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0YsU0FBUyxPQUFPO0FBQ2Qsa0JBQVEsTUFBTSx3RUFBc0IsS0FBSztBQUFBLFFBQzNDO0FBQUEsTUFDRjtBQUVBLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNLE9BQU87QUFBQSxRQUNiLFlBQVksT0FBTztBQUFBLFFBQ25CLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLGNBQVEsTUFBTSw0REFBb0IsS0FBSztBQUN2Qyx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksUUFBUSxNQUFNLDBCQUEwQixLQUFLLFdBQVcsT0FBTztBQUNqRSxVQUFNLEtBQUssUUFBUSxNQUFNLEdBQUcsRUFBRSxJQUFJLEtBQUs7QUFFdkMsWUFBUSxTQUFTLGdDQUFZLE9BQU8sU0FBUyxFQUFFLEVBQUU7QUFFakQsUUFBSTtBQUNGLFlBQU0sUUFBUSxNQUFNRCxjQUFhLFNBQVMsRUFBRTtBQUM1Qyx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0gsU0FBUyxPQUFPO0FBQ2QsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE9BQU87QUFBQSxRQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFFBQzlELFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFHQSxNQUFJLFlBQVksa0JBQWtCLFdBQVcsUUFBUTtBQUNuRCxZQUFRLFNBQVMsNENBQXdCO0FBRXpDLFFBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxpQkFBaUIsR0FBRztBQUN2QyxZQUFNLFdBQVcsTUFBTUEsY0FBYSxZQUFZLElBQUk7QUFFcEQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sMEJBQTBCLEtBQUssV0FBVyxPQUFPO0FBQ2pFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLElBQUksS0FBSztBQUV2QyxZQUFRLFNBQVMsZ0NBQVksT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVqRCxRQUFJO0FBQ0YsWUFBTSxPQUFPLE1BQU0saUJBQWlCLEdBQUc7QUFDdkMsWUFBTSxlQUFlLE1BQU1BLGNBQWEsWUFBWSxJQUFJLElBQUk7QUFFNUQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sbUNBQW1DLEtBQUssV0FBVyxRQUFRO0FBQzNFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFFL0IsWUFBUSxTQUFTLGlDQUFhLE9BQU8sU0FBUyxFQUFFLEVBQUU7QUFFbEQsUUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLGlCQUFpQixHQUFHO0FBQ3ZDLFlBQU0sU0FBUyxNQUFNQSxjQUFhLGFBQWEsSUFBSSxJQUFJO0FBRXZELHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksUUFBUSxNQUFNLG9DQUFvQyxLQUFLLFdBQVcsUUFBUTtBQUM1RSxVQUFNLFVBQVUsUUFBUSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBRXBDLFlBQVEsU0FBUyxpQ0FBYSxPQUFPLHFCQUFXLE9BQU8sRUFBRTtBQUV6RCxRQUFJO0FBQ0YsWUFBTSxPQUFPLE1BQU0saUJBQWlCLEdBQUc7QUFDdkMsWUFBTSxTQUFTLE1BQU1BLGNBQWEsbUJBQW1CLFNBQVMsSUFBSTtBQUVsRSx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0gsU0FBUyxPQUFPO0FBQ2QsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE9BQU87QUFBQSxRQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFFBQzlELFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFHQSxNQUFJLFFBQVEsTUFBTSxvQ0FBb0MsS0FBSyxXQUFXLE9BQU87QUFDM0UsVUFBTSxVQUFVLFFBQVEsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUVwQyxZQUFRLFNBQVMsZ0NBQVksT0FBTyxxQkFBVyxPQUFPLEVBQUU7QUFFeEQsUUFBSTtBQUNGLFlBQU0sV0FBVyxNQUFNQSxjQUFhLGlCQUFpQixPQUFPO0FBRTVELHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksUUFBUSxNQUFNLDZDQUE2QyxLQUFLLFdBQVcsUUFBUTtBQUNyRixVQUFNLFlBQVksUUFBUSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBRXRDLFlBQVEsU0FBUyxpQ0FBYSxPQUFPLHFCQUFXLFNBQVMsRUFBRTtBQUUzRCxRQUFJO0FBQ0YsWUFBTSxTQUFTLE1BQU1BLGNBQWEsb0JBQW9CLFNBQVM7QUFFL0QsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sc0RBQXNELEtBQUssV0FBVyxRQUFRO0FBQzlGLFVBQU0sV0FBVyxRQUFRLE1BQU0sR0FBRztBQUNsQyxVQUFNLFVBQVUsU0FBUyxDQUFDO0FBQzFCLFVBQU0sWUFBWSxTQUFTLENBQUM7QUFFNUIsWUFBUSxTQUFTLGlDQUFhLE9BQU8scUJBQVcsT0FBTyxxQkFBVyxTQUFTLEVBQUU7QUFFN0UsUUFBSTtBQUNGLFlBQU0sU0FBUyxNQUFNQSxjQUFhLHFCQUFxQixTQUFTLFNBQVM7QUFFekUsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBRUEsU0FBTztBQUNUO0FBR0EsZUFBZSxxQkFBcUIsS0FBc0IsS0FBcUIsU0FBaUIsVUFBaUM7QUF0ZmpJO0FBdWZFLFFBQU0sVUFBUyxTQUFJLFdBQUosbUJBQVk7QUFHM0IsUUFBTSxvQkFBb0IsUUFBUSxTQUFTLG9CQUFvQjtBQUUvRCxNQUFJLG1CQUFtQjtBQUNyQixZQUFRLElBQUkseURBQXNCLFFBQVEsU0FBUyxRQUFRO0FBRzNELFFBQUksWUFBWSx3QkFBd0IsV0FBVyxPQUFPO0FBQ3hELGNBQVEsU0FBUyxpREFBNkI7QUFFOUMsVUFBSTtBQUVGLGNBQU0sU0FBUyxNQUFNLG9CQUFtQixnQkFBZ0I7QUFBQSxVQUN0RCxNQUFNLFNBQVMsU0FBUyxJQUFjLEtBQUs7QUFBQSxVQUMzQyxNQUFNLFNBQVMsU0FBUyxJQUFjLEtBQUs7QUFBQSxVQUMzQyxNQUFNLFNBQVM7QUFBQSxVQUNmLE1BQU0sU0FBUztBQUFBLFVBQ2YsUUFBUSxTQUFTO0FBQUEsUUFDbkIsQ0FBQztBQUdELGNBQU0sZUFBZSxPQUFPO0FBRTVCLHlCQUFpQixLQUFLLEtBQUssWUFBWTtBQUFBLE1BQ3pDLFNBQVMsT0FBTztBQUNkLHlCQUFpQixLQUFLLEtBQUs7QUFBQSxVQUN6QixPQUFPO0FBQUEsVUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxVQUM5RCxTQUFTO0FBQUEsUUFDWCxDQUFDO0FBQUEsTUFDSDtBQUNBLGFBQU87QUFBQSxJQUNUO0FBR0EsVUFBTSx5QkFBeUIsUUFBUSxNQUFNLG1DQUFtQztBQUNoRixRQUFJLDBCQUEwQixXQUFXLE9BQU87QUFDOUMsWUFBTSxLQUFLLHVCQUF1QixDQUFDO0FBRW5DLGNBQVEsU0FBUyxnQ0FBWSxPQUFPLFNBQVMsRUFBRSxFQUFFO0FBRWpELFVBQUk7QUFDRixjQUFNLGNBQWMsTUFBTSxvQkFBbUIsZUFBZSxFQUFFO0FBRzlELHlCQUFpQixLQUFLLEtBQUssV0FBVztBQUFBLE1BQ3hDLFNBQVMsT0FBTztBQUNkLHlCQUFpQixLQUFLLEtBQUs7QUFBQSxVQUN6QixPQUFPO0FBQUEsVUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxVQUM5RCxTQUFTO0FBQUEsUUFDWCxDQUFDO0FBQUEsTUFDSDtBQUNBLGFBQU87QUFBQSxJQUNUO0FBR0EsUUFBSSxZQUFZLHdCQUF3QixXQUFXLFFBQVE7QUFDekQsY0FBUSxTQUFTLGtEQUE4QjtBQUUvQyxVQUFJO0FBQ0YsY0FBTSxPQUFPLE1BQU0saUJBQWlCLEdBQUc7QUFDdkMsY0FBTSxpQkFBaUIsTUFBTSxvQkFBbUIsa0JBQWtCLElBQUk7QUFFdEUseUJBQWlCLEtBQUssS0FBSyxjQUFjO0FBQUEsTUFDM0MsU0FBUyxPQUFPO0FBQ2QseUJBQWlCLEtBQUssS0FBSztBQUFBLFVBQ3pCLE9BQU87QUFBQSxVQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFVBQzlELFNBQVM7QUFBQSxRQUNYLENBQUM7QUFBQSxNQUNIO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFHQSxVQUFNLHlCQUF5QixRQUFRLE1BQU0sbUNBQW1DO0FBQ2hGLFFBQUksMEJBQTBCLFdBQVcsT0FBTztBQUM5QyxZQUFNLEtBQUssdUJBQXVCLENBQUM7QUFFbkMsY0FBUSxTQUFTLGdDQUFZLE9BQU8sU0FBUyxFQUFFLEVBQUU7QUFFakQsVUFBSTtBQUNGLGNBQU0sT0FBTyxNQUFNLGlCQUFpQixHQUFHO0FBQ3ZDLGNBQU0scUJBQXFCLE1BQU0sb0JBQW1CLGtCQUFrQixJQUFJLElBQUk7QUFFOUUseUJBQWlCLEtBQUssS0FBSyxrQkFBa0I7QUFBQSxNQUMvQyxTQUFTLE9BQU87QUFDZCx5QkFBaUIsS0FBSyxLQUFLO0FBQUEsVUFDekIsT0FBTztBQUFBLFVBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsVUFDOUQsU0FBUztBQUFBLFFBQ1gsQ0FBQztBQUFBLE1BQ0g7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUdBLFVBQU0seUJBQXlCLFFBQVEsTUFBTSxtQ0FBbUM7QUFDaEYsUUFBSSwwQkFBMEIsV0FBVyxVQUFVO0FBQ2pELFlBQU0sS0FBSyx1QkFBdUIsQ0FBQztBQUVuQyxjQUFRLFNBQVMsbUNBQWUsT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVwRCxVQUFJO0FBQ0YsY0FBTSxvQkFBbUIsa0JBQWtCLEVBQUU7QUFFN0MseUJBQWlCLEtBQUssS0FBSztBQUFBLFVBQ3pCLFNBQVM7QUFBQSxVQUNULFNBQVM7QUFBQSxRQUNYLENBQUM7QUFBQSxNQUNILFNBQVMsT0FBTztBQUNkLHlCQUFpQixLQUFLLEtBQUs7QUFBQSxVQUN6QixPQUFPO0FBQUEsVUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxVQUM5RCxTQUFTO0FBQUEsUUFDWCxDQUFDO0FBQUEsTUFDSDtBQUNBLGFBQU87QUFBQSxJQUNUO0FBR0EsVUFBTSx1QkFBdUIsUUFBUSxNQUFNLHlDQUF5QztBQUNwRixRQUFJLHdCQUF3QixXQUFXLFFBQVE7QUFDN0MsWUFBTSxLQUFLLHFCQUFxQixDQUFDO0FBRWpDLGNBQVEsU0FBUyxpQ0FBYSxPQUFPLFNBQVMsRUFBRSxFQUFFO0FBRWxELFVBQUk7QUFDRixjQUFNLE9BQU8sTUFBTSxpQkFBaUIsR0FBRztBQUN2QyxjQUFNLFNBQVMsTUFBTSxvQkFBbUIsZ0JBQWdCLElBQUksSUFBSTtBQUVoRSx5QkFBaUIsS0FBSyxLQUFLLE1BQU07QUFBQSxNQUNuQyxTQUFTLE9BQU87QUFDZCx5QkFBaUIsS0FBSyxLQUFLO0FBQUEsVUFDekIsT0FBTztBQUFBLFVBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsVUFDOUQsU0FBUztBQUFBLFFBQ1gsQ0FBQztBQUFBLE1BQ0g7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUdBLFVBQU0sb0JBQW9CLFFBQVEsTUFBTSw0Q0FBNEM7QUFDcEYsUUFBSSxxQkFBcUIsV0FBVyxRQUFRO0FBQzFDLFlBQU0sS0FBSyxrQkFBa0IsQ0FBQztBQUU5QixjQUFRLFNBQVMsaUNBQWEsT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVsRCxVQUFJO0FBQ0YsY0FBTSxPQUFPLE1BQU0saUJBQWlCLEdBQUc7QUFDdkMsY0FBTSxTQUFTLE1BQU0sb0JBQW1CLGFBQWEsSUFBSSxJQUFJO0FBRTdELHlCQUFpQixLQUFLLEtBQUssTUFBTTtBQUFBLE1BQ25DLFNBQVMsT0FBTztBQUNkLHlCQUFpQixLQUFLLEtBQUs7QUFBQSxVQUN6QixPQUFPO0FBQUEsVUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxVQUM5RCxTQUFTO0FBQUEsUUFDWCxDQUFDO0FBQUEsTUFDSDtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUVBLFNBQU87QUFDVDtBQVNBLGVBQXNCLGNBQWMsS0FBVSxLQUFVLFNBQWlCLFVBQWtCO0FBQ3pGLE1BQUk7QUFFRixVQUFNLGlCQUFpQixpQkFBaUIsT0FBTztBQUcvQyxRQUFJLFlBQVksZ0JBQWdCO0FBQzlCLGNBQVEsSUFBSSx5REFBc0IsT0FBTyxPQUFPLGNBQWMsRUFBRTtBQUFBLElBQ2xFO0FBR0EsUUFBSSxVQUFVO0FBR2QsUUFBSSxlQUFlLFNBQVMsZ0JBQWdCLEdBQUc7QUFDN0MsY0FBUSxJQUFJLHlEQUFzQixJQUFJLFFBQVEsZ0JBQWdCLFFBQVE7QUFDdEUsZ0JBQVUsTUFBTSxxQkFBcUIsS0FBSyxLQUFLLGdCQUFnQixRQUFRO0FBQ3ZFLFVBQUk7QUFBUztBQUFBLElBQ2Y7QUFHQSxRQUFJLGVBQWUsU0FBUyxjQUFjLEdBQUc7QUFDM0MsZ0JBQVUsTUFBTSxxQkFBcUIsS0FBSyxLQUFLLGdCQUFnQixRQUFRO0FBQ3ZFLFVBQUk7QUFBUztBQUFBLElBQ2Y7QUFHQSxRQUFJLGVBQWUsU0FBUyxVQUFVLEdBQUc7QUFDdkMsZ0JBQVUsTUFBTSxpQkFBaUIsS0FBSyxLQUFLLGdCQUFnQixRQUFRO0FBQ25FLFVBQUk7QUFBUztBQUFBLElBQ2Y7QUFHQSxRQUFJLENBQUMsU0FBUztBQUNaLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLG1DQUFVLGNBQWM7QUFBQSxRQUNqQyxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0YsU0FBUyxPQUFPO0FBQ2QsWUFBUSxNQUFNLHNEQUFtQixLQUFLO0FBQ3RDLHFCQUFpQixLQUFLLEtBQUs7QUFBQSxNQUN6QixPQUFPO0FBQUEsTUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxNQUM5RCxTQUFTO0FBQUEsSUFDWCxDQUFDO0FBQUEsRUFDSDtBQUNGO0FBTU8sU0FBUyx1QkFBbUQ7QUFDakUsU0FBTyxlQUFlLGVBQWUsS0FBOEIsS0FBcUIsTUFBNEI7QUFodUJ0SDtBQWt1QkksUUFBSSxDQUFDLGtCQUFrQixHQUFHLEdBQUc7QUFDM0IsYUFBTyxLQUFLO0FBQUEsSUFDZDtBQUVBLFVBQU0sTUFBTSxNQUFNLElBQUksT0FBTyxJQUFJLElBQUk7QUFDckMsVUFBTSxVQUFVLElBQUksWUFBWTtBQUNoQyxVQUFNLFdBQVcsSUFBSSxTQUFTLENBQUM7QUFFL0IsWUFBUSxTQUFTLDZCQUFTLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUdqRCxVQUFJLFNBQUksV0FBSixtQkFBWSxtQkFBa0IsV0FBVztBQUMzQyxpQkFBVyxHQUFHO0FBQ2QsVUFBSSxhQUFhO0FBQ2pCLFVBQUksSUFBSTtBQUNSO0FBQUEsSUFDRjtBQUdBLGVBQVcsR0FBRztBQUdkLFFBQUksV0FBVyxRQUFRLEdBQUc7QUFDeEIsWUFBTUQsT0FBTSxXQUFXLEtBQUs7QUFBQSxJQUM5QjtBQUVBLFFBQUk7QUFDRixZQUFNLGNBQWMsS0FBSyxLQUFLLFNBQVMsUUFBUTtBQUFBLElBQ2pELFNBQVMsT0FBTztBQUVkLGNBQVEsTUFBTSxrRUFBcUIsS0FBSztBQUN4Qyx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHFCQUFROzs7QVNud0JSLFNBQVMseUJBQXlCO0FBQ3ZDLFVBQVEsSUFBSSxrSkFBb0M7QUFFaEQsU0FBTyxTQUFTLGlCQUNkLEtBQ0EsS0FDQSxNQUNBO0FBQ0EsVUFBTSxNQUFNLElBQUksT0FBTztBQUN2QixVQUFNLFNBQVMsSUFBSSxVQUFVO0FBRzdCLFFBQUksUUFBUSxhQUFhO0FBQ3ZCLGNBQVEsSUFBSSwwRUFBbUIsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUU5QyxVQUFJO0FBRUYsWUFBSSxVQUFVLCtCQUErQixHQUFHO0FBQ2hELFlBQUksVUFBVSxnQ0FBZ0MsaUNBQWlDO0FBQy9FLFlBQUksVUFBVSxnQ0FBZ0MsNkJBQTZCO0FBRzNFLFlBQUksV0FBVyxXQUFXO0FBQ3hCLGtCQUFRLElBQUksOEVBQXVCO0FBQ25DLGNBQUksYUFBYTtBQUNqQixjQUFJLElBQUk7QUFDUjtBQUFBLFFBQ0Y7QUFHQSxZQUFJLGFBQWEsY0FBYztBQUMvQixZQUFJLFVBQVUsZ0JBQWdCLGlDQUFpQztBQUMvRCxZQUFJLGFBQWE7QUFHakIsY0FBTSxlQUFlO0FBQUEsVUFDbkIsU0FBUztBQUFBLFVBQ1QsU0FBUztBQUFBLFVBQ1QsTUFBTTtBQUFBLFlBQ0osT0FBTSxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLFlBQzdCO0FBQUEsWUFDQTtBQUFBLFlBQ0EsU0FBUyxJQUFJO0FBQUEsWUFDYixRQUFRLElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFBQSxVQUNsRDtBQUFBLFFBQ0Y7QUFHQSxnQkFBUSxJQUFJLHVFQUFnQjtBQUM1QixZQUFJLElBQUksS0FBSyxVQUFVLGNBQWMsTUFBTSxDQUFDLENBQUM7QUFHN0M7QUFBQSxNQUNGLFNBQVMsT0FBTztBQUVkLGdCQUFRLE1BQU0sZ0ZBQW9CLEtBQUs7QUFHdkMsWUFBSSxhQUFhLGNBQWM7QUFDL0IsWUFBSSxhQUFhO0FBQ2pCLFlBQUksVUFBVSxnQkFBZ0IsaUNBQWlDO0FBQy9ELFlBQUksSUFBSSxLQUFLLFVBQVU7QUFBQSxVQUNyQixTQUFTO0FBQUEsVUFDVCxTQUFTO0FBQUEsVUFDVCxPQUFPLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxDQUFDLENBQUM7QUFHRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBR0EsU0FBSztBQUFBLEVBQ1A7QUFDRjs7O0FWMUVBLE9BQU8sUUFBUTtBQVJmLElBQU0sbUNBQW1DO0FBWXpDLFNBQVMsU0FBUyxNQUFjO0FBQzlCLFVBQVEsSUFBSSxtQ0FBZSxJQUFJLDJCQUFPO0FBQ3RDLE1BQUk7QUFDRixRQUFJLFFBQVEsYUFBYSxTQUFTO0FBQ2hDLGVBQVMsMkJBQTJCLElBQUksRUFBRTtBQUMxQyxlQUFTLDhDQUE4QyxJQUFJLHdCQUF3QixFQUFFLE9BQU8sVUFBVSxDQUFDO0FBQUEsSUFDekcsT0FBTztBQUNMLGVBQVMsWUFBWSxJQUFJLHVCQUF1QixFQUFFLE9BQU8sVUFBVSxDQUFDO0FBQUEsSUFDdEU7QUFDQSxZQUFRLElBQUkseUNBQWdCLElBQUksRUFBRTtBQUFBLEVBQ3BDLFNBQVMsR0FBRztBQUNWLFlBQVEsSUFBSSx1QkFBYSxJQUFJLHlEQUFZO0FBQUEsRUFDM0M7QUFDRjtBQUdBLFNBQVMsaUJBQWlCO0FBQ3hCLFVBQVEsSUFBSSw2Q0FBZTtBQUMzQixRQUFNLGFBQWE7QUFBQSxJQUNqQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUVBLGFBQVcsUUFBUSxlQUFhO0FBQzlCLFFBQUk7QUFDRixVQUFJLEdBQUcsV0FBVyxTQUFTLEdBQUc7QUFDNUIsWUFBSSxHQUFHLFVBQVUsU0FBUyxFQUFFLFlBQVksR0FBRztBQUN6QyxtQkFBUyxVQUFVLFNBQVMsRUFBRTtBQUFBLFFBQ2hDLE9BQU87QUFDTCxhQUFHLFdBQVcsU0FBUztBQUFBLFFBQ3pCO0FBQ0EsZ0JBQVEsSUFBSSw4QkFBZSxTQUFTLEVBQUU7QUFBQSxNQUN4QztBQUFBLElBQ0YsU0FBUyxHQUFHO0FBQ1YsY0FBUSxJQUFJLG9DQUFnQixTQUFTLElBQUksQ0FBQztBQUFBLElBQzVDO0FBQUEsRUFDRixDQUFDO0FBQ0g7QUFHQSxlQUFlO0FBR2YsU0FBUyxJQUFJO0FBR2IsU0FBUyxvQkFBb0IsU0FBa0IsZUFBdUM7QUFDcEYsTUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlO0FBQzlCLFdBQU87QUFBQSxFQUNUO0FBR0EsUUFBTSxpQkFBaUIsVUFBVSxtQkFBcUIsSUFBSTtBQUMxRCxRQUFNLG1CQUFtQixnQkFBZ0IsdUJBQXVCLElBQUk7QUFFcEUsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBO0FBQUEsSUFFTixTQUFTO0FBQUE7QUFBQSxJQUVULGdCQUFnQixRQUFRO0FBRXRCLFlBQU0sa0JBQWtCLE9BQU8sWUFBWTtBQUUzQyxhQUFPLFlBQVksU0FBUyxTQUFTLEtBQUssS0FBSyxNQUFNO0FBQ25ELGNBQU0sTUFBTSxJQUFJLE9BQU87QUFHdkIsWUFBSSxJQUFJLFdBQVcsT0FBTyxHQUFHO0FBQzNCLGtCQUFRLElBQUkseURBQXNCLElBQUksTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUdyRCxjQUFJLGlCQUFpQixvQkFBb0IsSUFBSSxXQUFXLFdBQVcsR0FBRztBQUNwRSxvQkFBUSxJQUFJLDhFQUF1QixHQUFHLEVBQUU7QUFHeEMsWUFBQyxJQUFZLGVBQWU7QUFFNUIsbUJBQU8saUJBQWlCLEtBQUssS0FBSyxDQUFDLFFBQWdCO0FBQ2pELGtCQUFJLEtBQUs7QUFDUCx3QkFBUSxNQUFNLDhFQUF1QixHQUFHO0FBQ3hDLHFCQUFLLEdBQUc7QUFBQSxjQUNWLFdBQVcsQ0FBRSxJQUF1QixlQUFlO0FBRWpELHFCQUFLO0FBQUEsY0FDUDtBQUFBLFlBQ0YsQ0FBQztBQUFBLFVBQ0g7QUFHQSxjQUFJLFdBQVcsZ0JBQWdCO0FBQzdCLG9CQUFRLElBQUksc0VBQXlCLEdBQUcsRUFBRTtBQUcxQyxZQUFDLElBQVksZUFBZTtBQUU1QixtQkFBTyxlQUFlLEtBQUssS0FBSyxDQUFDLFFBQWdCO0FBQy9DLGtCQUFJLEtBQUs7QUFDUCx3QkFBUSxNQUFNLHNFQUF5QixHQUFHO0FBQzFDLHFCQUFLLEdBQUc7QUFBQSxjQUNWLFdBQVcsQ0FBRSxJQUF1QixlQUFlO0FBRWpELHFCQUFLO0FBQUEsY0FDUDtBQUFBLFlBQ0YsQ0FBQztBQUFBLFVBQ0g7QUFBQSxRQUNGO0FBR0EsZUFBTyxnQkFBZ0IsS0FBSyxPQUFPLGFBQWEsS0FBSyxLQUFLLElBQUk7QUFBQSxNQUNoRTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFHQSxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxVQUFRLElBQUksb0JBQW9CLFFBQVEsSUFBSSxxQkFBcUI7QUFDakUsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRzNDLFFBQU0sYUFBYSxRQUFRLElBQUksc0JBQXNCO0FBR3JELFFBQU0sYUFBYSxRQUFRLElBQUkscUJBQXFCO0FBR3BELFFBQU0sZ0JBQWdCO0FBRXRCLFVBQVEsSUFBSSxnREFBa0IsSUFBSSxFQUFFO0FBQ3BDLFVBQVEsSUFBSSxnQ0FBc0IsYUFBYSxpQkFBTyxjQUFJLEVBQUU7QUFDNUQsVUFBUSxJQUFJLG9EQUFzQixnQkFBZ0IsaUJBQU8sY0FBSSxFQUFFO0FBQy9ELFVBQVEsSUFBSSwyQkFBaUIsYUFBYSxpQkFBTyxjQUFJLEVBQUU7QUFHdkQsUUFBTSxhQUFhLG9CQUFvQixZQUFZLGFBQWE7QUFHaEUsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBO0FBQUEsTUFFUCxHQUFJLGFBQWEsQ0FBQyxVQUFVLElBQUksQ0FBQztBQUFBLE1BQ2pDLElBQUk7QUFBQSxJQUNOO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQSxNQUVOLEtBQUssYUFBYSxRQUFRO0FBQUEsUUFDeEIsVUFBVTtBQUFBLFFBQ1YsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLE1BQ2Q7QUFBQTtBQUFBLE1BRUEsT0FBTyxDQUFDO0FBQUEsSUFDVjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1AsU0FBUyxDQUFDLGFBQWEsWUFBWTtBQUFBLE1BQ3JDO0FBQUEsTUFDQSxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixtQkFBbUI7QUFBQSxRQUNyQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxlQUFlO0FBQUEsUUFDakI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBO0FBQUEsTUFFWixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsU0FBUztBQUFBO0FBQUEsUUFFUDtBQUFBO0FBQUEsUUFFQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsT0FBTztBQUFBLElBQ1Q7QUFBQTtBQUFBLElBRUEsVUFBVTtBQUFBO0FBQUEsSUFFVixTQUFTO0FBQUEsTUFDUCxhQUFhO0FBQUEsUUFDWCw0QkFBNEI7QUFBQSxNQUM5QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsiZGVsYXkiLCAic2ltdWxhdGVEZWxheSIsICJxdWVyeV9kZWZhdWx0IiwgInNpbXVsYXRlRGVsYXkiLCAicXVlcnlfZGVmYXVsdCIsICJxdWVyeVNlcnZpY2UiLCAiaW50ZWdyYXRpb25TZXJ2aWNlIiwgImRlbGF5IiwgInF1ZXJ5U2VydmljZSIsICJtb2NrUXVlcmllcyJdCn0K
