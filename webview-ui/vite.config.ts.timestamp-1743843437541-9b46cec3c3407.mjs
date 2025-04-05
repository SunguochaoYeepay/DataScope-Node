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
function shouldMockRequest(url) {
  if (!mockConfig.enabled) {
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
var mockQueries = Array.from({ length: 10 }, (_, i) => {
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
var query_default = queryService;

// src/mock/services/index.ts
var services = {
  dataSource: datasource_default,
  query: query_default
};
var dataSourceService = services.dataSource;
var queryService2 = services.query;

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
  if (urlPath === "/api/queries" && method === "GET") {
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: /api/queries`);
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
      sendJsonResponse(res, 200, {
        data: result.items,
        pagination: result.pagination,
        success: true
      });
    } catch (error) {
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
  if (urlPath.match(/^\/api\/queries\/[^\/]+$/) && method === "DELETE") {
    const id = urlPath.split("/").pop() || "";
    logMock("debug", `\u5904\u7406DELETE\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      await queryService2.deleteQuery(id);
      sendJsonResponse(res, 200, {
        message: "\u67E5\u8BE2\u5220\u9664\u6210\u529F",
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u5220\u9664\u67E5\u8BE2\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/run$/) && method === "POST") {
    const id = urlPath.split("/")[3] || "";
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
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/favorite$/) && method === "POST") {
    const id = urlPath.split("/")[3] || "";
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      const body = await parseRequestBody(req);
      const result = await queryService2.toggleFavorite(id);
      sendJsonResponse(res, 200, {
        data: result,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u66F4\u65B0\u6536\u85CF\u72B6\u6001\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions$/) && method === "GET") {
    const id = urlPath.split("/")[3] || "";
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      const versions = await queryService2.getQueryVersions(id);
      sendJsonResponse(res, 200, {
        data: versions,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u83B7\u53D6\u67E5\u8BE2\u7248\u672C\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions\/[^\/]+$/) && method === "GET") {
    const parts = urlPath.split("/");
    const queryId = parts[3] || "";
    const versionId = parts[5] || "";
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, \u67E5\u8BE2ID: ${queryId}, \u7248\u672CID: ${versionId}`);
    try {
      const versions = await queryService2.getQueryVersions(queryId);
      const version = versions.find((v) => v.id === versionId);
      if (!version) {
        throw new Error(`\u672A\u627E\u5230ID\u4E3A${versionId}\u7684\u67E5\u8BE2\u7248\u672C`);
      }
      sendJsonResponse(res, 200, {
        data: version,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u83B7\u53D6\u67E5\u8BE2\u7248\u672C\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  return false;
}
function createMockMiddleware() {
  if (!mockConfig.enabled) {
    console.log("[Mock] \u670D\u52A1\u5DF2\u7981\u7528\uFF0C\u8FD4\u56DE\u7A7A\u4E2D\u95F4\u4EF6");
    return (req, res, next) => next();
  }
  console.log("[Mock] \u521B\u5EFA\u4E2D\u95F4\u4EF6, \u62E6\u622AAPI\u8BF7\u6C42");
  return async function mockMiddleware(req, res, next) {
    try {
      const url = req.url || "";
      let processedUrl = url;
      if (url.startsWith("/api/api/")) {
        processedUrl = url.replace("/api/api/", "/api/");
        logMock("debug", `\u68C0\u6D4B\u5230\u91CD\u590D\u7684API\u8DEF\u5F84\uFF0C\u5DF2\u4FEE\u6B63: ${url} -> ${processedUrl}`);
      }
      const parsedUrl = parse(processedUrl, true);
      const urlPath = parsedUrl.pathname || "";
      const urlQuery = parsedUrl.query || {};
      if (!shouldMockRequest(processedUrl)) {
        return next();
      }
      logMock("debug", `\u6536\u5230\u8BF7\u6C42: ${req.method} ${urlPath}`);
      if (req.method === "OPTIONS") {
        handleCors(res);
        res.statusCode = 204;
        res.end();
        return;
      }
      handleCors(res);
      if (mockConfig.delay > 0) {
        await delay2(mockConfig.delay);
      }
      let handled = false;
      if (!handled)
        handled = await handleDatasourcesApi(req, res, urlPath, urlQuery);
      if (!handled)
        handled = await handleQueriesApi(req, res, urlPath, urlQuery);
      if (!handled) {
        logMock("info", `\u672A\u5B9E\u73B0\u7684API\u8DEF\u5F84: ${req.method} ${urlPath}`);
        sendJsonResponse(res, 404, {
          error: "\u672A\u627E\u5230API\u7AEF\u70B9",
          message: `API\u7AEF\u70B9 ${urlPath} \u672A\u627E\u5230\u6216\u672A\u5B9E\u73B0`,
          success: false
        });
      }
    } catch (error) {
      logMock("error", `\u5904\u7406\u8BF7\u6C42\u51FA\u9519:`, error);
      sendJsonResponse(res, 500, {
        error: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
  };
}

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
  const mockMiddleware = useMock ? createMockMiddleware() : null;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50cyIsICJzcmMvbW9jay9jb25maWcudHMiLCAic3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHMiLCAic3JjL21vY2svc2VydmljZXMvdXRpbHMudHMiLCAic3JjL21vY2svc2VydmljZXMvcXVlcnkudHMiLCAic3JjL21vY2svc2VydmljZXMvaW5kZXgudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYsIFBsdWdpbiwgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAndGFpbHdpbmRjc3MnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcbmltcG9ydCBjcmVhdGVNb2NrTWlkZGxld2FyZSBmcm9tICcuL3NyYy9tb2NrL21pZGRsZXdhcmUnXG5pbXBvcnQgeyBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlIH0gZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZSdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCdcblxuLy8gXHU1RjNBXHU1MjM2XHU5MUNBXHU2NTNFXHU3QUVGXHU1M0UzXHU1MUZEXHU2NTcwXG5mdW5jdGlvbiBraWxsUG9ydChwb3J0OiBudW1iZXIpIHtcbiAgY29uc29sZS5sb2coYFtWaXRlXSBcdTY4QzBcdTY3RTVcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTUzNjBcdTc1MjhcdTYwQzVcdTUxQjVgKTtcbiAgdHJ5IHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgZXhlY1N5bmMoYG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH1gKTtcbiAgICAgIGV4ZWNTeW5jKGB0YXNra2lsbCAvRiAvcGlkICQobmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fSB8IGF3ayAne3ByaW50ICQ1fScpYCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBleGVjU3luYyhgbHNvZiAtaSA6JHtwb3J0fSAtdCB8IHhhcmdzIGtpbGwgLTlgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU1REYyXHU5MUNBXHU2NTNFXHU3QUVGXHU1M0UzICR7cG9ydH1gKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU3QUVGXHU1M0UzICR7cG9ydH0gXHU2NzJBXHU4OEFCXHU1MzYwXHU3NTI4XHU2MjE2XHU2NUUwXHU2Q0Q1XHU5MUNBXHU2NTNFYCk7XG4gIH1cbn1cblxuLy8gXHU1RjNBXHU1MjM2XHU2RTA1XHU3NDA2Vml0ZVx1N0YxM1x1NUI1OFxuZnVuY3Rpb24gY2xlYW5WaXRlQ2FjaGUoKSB7XG4gIGNvbnNvbGUubG9nKCdbVml0ZV0gXHU2RTA1XHU3NDA2XHU0RjlEXHU4RDU2XHU3RjEzXHU1QjU4Jyk7XG4gIGNvbnN0IGNhY2hlUGF0aHMgPSBbXG4gICAgJy4vbm9kZV9tb2R1bGVzLy52aXRlJyxcbiAgICAnLi9ub2RlX21vZHVsZXMvLnZpdGVfKicsXG4gICAgJy4vLnZpdGUnLFxuICAgICcuL2Rpc3QnLFxuICAgICcuL3RtcCcsXG4gICAgJy4vLnRlbXAnXG4gIF07XG4gIFxuICBjYWNoZVBhdGhzLmZvckVhY2goY2FjaGVQYXRoID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoY2FjaGVQYXRoKSkge1xuICAgICAgICBpZiAoZnMubHN0YXRTeW5jKGNhY2hlUGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgIGV4ZWNTeW5jKGBybSAtcmYgJHtjYWNoZVBhdGh9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMudW5saW5rU3luYyhjYWNoZVBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU1REYyXHU1MjIwXHU5NjY0OiAke2NhY2hlUGF0aH1gKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjVFMFx1NkNENVx1NTIyMFx1OTY2NDogJHtjYWNoZVBhdGh9YCwgZSk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gXHU2RTA1XHU3NDA2Vml0ZVx1N0YxM1x1NUI1OFxuY2xlYW5WaXRlQ2FjaGUoKTtcblxuLy8gXHU1QzFEXHU4QkQ1XHU5MUNBXHU2NTNFXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU3QUVGXHU1M0UzXG5raWxsUG9ydCg4MDgwKTtcblxuLy8gXHU1MjFCXHU1RUZBTW9jayBBUElcdTYzRDJcdTRFRjZcbmZ1bmN0aW9uIGNyZWF0ZU1vY2tBcGlQbHVnaW4odXNlTW9jazogYm9vbGVhbiwgdXNlU2ltcGxlTW9jazogYm9vbGVhbik6IFBsdWdpbiB8IG51bGwge1xuICBpZiAoIXVzZU1vY2sgJiYgIXVzZVNpbXBsZU1vY2spIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBcbiAgLy8gXHU1MkEwXHU4RjdEXHU0RTJEXHU5NUY0XHU0RUY2XG4gIGNvbnN0IG1vY2tNaWRkbGV3YXJlID0gdXNlTW9jayA/IGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCkgOiBudWxsO1xuICBjb25zdCBzaW1wbGVNaWRkbGV3YXJlID0gdXNlU2ltcGxlTW9jayA/IGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUoKSA6IG51bGw7XG4gIFxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLXBsdWdpbi1tb2NrLWFwaScsXG4gICAgLy8gXHU1MTczXHU5NTJFXHU3MEI5XHVGRjFBXHU0RjdGXHU3NTI4IHByZSBcdTc4NkVcdTRGRERcdTZCNjRcdTYzRDJcdTRFRjZcdTUxNDhcdTRFOEVcdTUxODVcdTdGNkVcdTYzRDJcdTRFRjZcdTYyNjdcdTg4NENcbiAgICBlbmZvcmNlOiAncHJlJyBhcyBjb25zdCxcbiAgICAvLyBcdTU3MjhcdTY3MERcdTUyQTFcdTU2NjhcdTUyMUJcdTVFRkFcdTRFNEJcdTUyNERcdTkxNERcdTdGNkVcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAvLyBcdTY2RkZcdTYzNjJcdTUzOUZcdTU5Q0JcdThCRjdcdTZDNDJcdTU5MDRcdTc0MDZcdTU2NjhcdUZGMENcdTRGN0ZcdTYyMTFcdTRFRUNcdTc2ODRcdTRFMkRcdTk1RjRcdTRFRjZcdTUxNzdcdTY3MDlcdTY3MDBcdTlBRDhcdTRGMThcdTUxNDhcdTdFQTdcbiAgICAgIGNvbnN0IG9yaWdpbmFsSGFuZGxlciA9IHNlcnZlci5taWRkbGV3YXJlcy5oYW5kbGU7XG4gICAgICBcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy5oYW5kbGUgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1M0VBXHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aCgnL2FwaS8nKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU2OEMwXHU2RDRCXHU1MjMwQVBJXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsfWApO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1NEYxOFx1NTE0OFx1NTkwNFx1NzQwNlx1NzI3OVx1NUI5QVx1NkQ0Qlx1OEJENUFQSVxuICAgICAgICAgIGlmICh1c2VTaW1wbGVNb2NrICYmIHNpbXBsZU1pZGRsZXdhcmUgJiYgdXJsLnN0YXJ0c1dpdGgoJy9hcGkvdGVzdCcpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTYzRDJcdTRFRjZdIFx1NEY3Rlx1NzUyOFx1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNjogJHt1cmx9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFx1OEJCRVx1N0Y2RVx1NEUwMFx1NEUyQVx1NjgwN1x1OEJCMFx1RkYwQ1x1OTYzMlx1NkI2Mlx1NTE3Nlx1NEVENlx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgKHJlcSBhcyBhbnkpLl9tb2NrSGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBzaW1wbGVNaWRkbGV3YXJlKHJlcSwgcmVzLCAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTUxRkFcdTk1MTk6YCwgZXJyKTtcbiAgICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIShyZXMgYXMgU2VydmVyUmVzcG9uc2UpLndyaXRhYmxlRW5kZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTU0Q0RcdTVFOTRcdTZDQTFcdTY3MDlcdTdFRDNcdTY3NUZcdUZGMENcdTdFRTdcdTdFRURcdTU5MDRcdTc0MDZcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTUxNzZcdTRFRDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgICBpZiAodXNlTW9jayAmJiBtb2NrTWlkZGxld2FyZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTRGN0ZcdTc1MjhNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2OiAke3VybH1gKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU4QkJFXHU3RjZFXHU0RTAwXHU0RTJBXHU2ODA3XHU4QkIwXHVGRjBDXHU5NjMyXHU2QjYyXHU1MTc2XHU0RUQ2XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyXG4gICAgICAgICAgICAocmVxIGFzIGFueSkuX21vY2tIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG1vY2tNaWRkbGV3YXJlKHJlcSwgcmVzLCAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtNb2NrXHU2M0QyXHU0RUY2XSBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU1MUZBXHU5NTE5OmAsIGVycik7XG4gICAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEocmVzIGFzIFNlcnZlclJlc3BvbnNlKS53cml0YWJsZUVuZGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NENEXHU1RTk0XHU2Q0ExXHU2NzA5XHU3RUQzXHU2NzVGXHVGRjBDXHU3RUU3XHU3RUVEXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1NUJGOVx1NEU4RVx1OTc1RUFQSVx1OEJGN1x1NkM0Mlx1RkYwQ1x1NEY3Rlx1NzUyOFx1NTM5Rlx1NTlDQlx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgICByZXR1cm4gb3JpZ2luYWxIYW5kbGVyLmNhbGwoc2VydmVyLm1pZGRsZXdhcmVzLCByZXEsIHJlcywgbmV4dCk7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxuLy8gXHU1N0ZBXHU2NzJDXHU5MTREXHU3RjZFXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIC8vIFx1NTJBMFx1OEY3RFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxuICBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJIHx8ICdmYWxzZSc7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9jayBBUEkgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgdXNlTW9ja0FwaSA9IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZSc7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTc5ODFcdTc1MjhITVIgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgZGlzYWJsZUhtciA9IHByb2Nlc3MuZW52LlZJVEVfRElTQUJMRV9ITVIgPT09ICd0cnVlJztcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1NEY3Rlx1NzUyOFx1N0I4MFx1NTM1NVx1NkQ0Qlx1OEJENVx1NkEyMVx1NjJERkFQSVxuICBjb25zdCB1c2VTaW1wbGVNb2NrID0gdHJ1ZTtcbiAgXG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gXHU4RkQwXHU4ODRDXHU2QTIxXHU1RjBGOiAke21vZGV9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gTW9jayBBUEk6ICR7dXNlTW9ja0FwaSA/ICdcdTU0MkZcdTc1MjgnIDogJ1x1Nzk4MVx1NzUyOCd9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gXHU3QjgwXHU1MzU1TW9ja1x1NkQ0Qlx1OEJENTogJHt1c2VTaW1wbGVNb2NrID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFNb2NrXHU2M0QyXHU0RUY2XG4gIGNvbnN0IG1vY2tQbHVnaW4gPSBjcmVhdGVNb2NrQXBpUGx1Z2luKHVzZU1vY2tBcGksIHVzZVNpbXBsZU1vY2spO1xuICBcbiAgLy8gXHU5MTREXHU3RjZFXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgLy8gXHU2REZCXHU1MkEwTW9ja1x1NjNEMlx1NEVGNlx1RkYwOFx1NTk4Mlx1Njc5Q1x1NTQyRlx1NzUyOFx1RkYwOVxuICAgICAgLi4uKG1vY2tQbHVnaW4gPyBbbW9ja1BsdWdpbl0gOiBbXSksXG4gICAgICB2dWUoKSxcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogODA4MCxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgLy8gSE1SXHU5MTREXHU3RjZFXG4gICAgICBobXI6IGRpc2FibGVIbXIgPyBmYWxzZSA6IHtcbiAgICAgICAgcHJvdG9jb2w6ICd3cycsXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBjbGllbnRQb3J0OiA4MDgwLFxuICAgICAgfSxcbiAgICAgIC8vIFx1Nzk4MVx1NzUyOFx1NEVFM1x1NzQwNlx1RkYwQ1x1OEJBOVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NjI0MFx1NjcwOVx1OEJGN1x1NkM0MlxuICAgICAgcHJveHk6IHt9XG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzLCBhdXRvcHJlZml4ZXJdLFxuICAgICAgfSxcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgbGVzczoge1xuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAvLyBcdTUzMDVcdTU0MkJcdTU3RkFcdTY3MkNcdTRGOURcdThENTZcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ3Z1ZScsIFxuICAgICAgICAndnVlLXJvdXRlcicsXG4gICAgICAgICdwaW5pYScsXG4gICAgICAgICdheGlvcycsXG4gICAgICAgICdkYXlqcycsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZScsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZS9lcy9sb2NhbGUvemhfQ04nXG4gICAgICBdLFxuICAgICAgLy8gXHU2MzkyXHU5NjY0XHU3Mjc5XHU1QjlBXHU0RjlEXHU4RDU2XG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgIC8vIFx1NjM5Mlx1OTY2NFx1NjNEMlx1NEVGNlx1NEUyRFx1NzY4NFx1NjcwRFx1NTJBMVx1NTY2OE1vY2tcbiAgICAgICAgJ3NyYy9wbHVnaW5zL3NlcnZlck1vY2sudHMnLFxuICAgICAgICAvLyBcdTYzOTJcdTk2NjRmc2V2ZW50c1x1NjcyQ1x1NTczMFx1NkEyMVx1NTc1N1x1RkYwQ1x1OTA3Rlx1NTE0RFx1Njc4NFx1NUVGQVx1OTUxOVx1OEJFRlxuICAgICAgICAnZnNldmVudHMnXG4gICAgICBdLFxuICAgICAgLy8gXHU3ODZFXHU0RkREXHU0RjlEXHU4RDU2XHU5ODg0XHU2Nzg0XHU1RUZBXHU2QjYzXHU3ODZFXHU1QjhDXHU2MjEwXG4gICAgICBmb3JjZTogdHJ1ZSxcbiAgICB9LFxuICAgIC8vIFx1NEY3Rlx1NzUyOFx1NTM1NVx1NzJFQ1x1NzY4NFx1N0YxM1x1NUI1OFx1NzZFRVx1NUY1NVxuICAgIGNhY2hlRGlyOiAnbm9kZV9tb2R1bGVzLy52aXRlX2NhY2hlJyxcbiAgICAvLyBcdTk2MzJcdTZCNjJcdTU4MDZcdTY4MDhcdTZFQTJcdTUxRkFcbiAgICBlc2J1aWxkOiB7XG4gICAgICBsb2dPdmVycmlkZToge1xuICAgICAgICAndGhpcy1pcy11bmRlZmluZWQtaW4tZXNtJzogJ3NpbGVudCdcbiAgICAgIH0sXG4gICAgfVxuICB9XG59KTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1N0JBMVx1NzQwNlx1NkEyMVx1NTc1N1xuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRIVFRQXHU4QkY3XHU2QzQyXHU2MkU2XHU2MjJBXHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU3NTI4XHU0RThFXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XG4gKiBcdThEMUZcdThEMjNcdTdCQTFcdTc0MDZcdTU0OENcdTUyMDZcdTUzRDFcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTUyMzBcdTVCRjlcdTVFOTRcdTc2ODRcdTY3MERcdTUyQTFcdTU5MDRcdTc0MDZcdTUxRkRcdTY1NzBcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IEluY29taW5nTWVzc2FnZSwgU2VydmVyUmVzcG9uc2UgfSBmcm9tICdodHRwJztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IG1vY2tDb25maWcsIHNob3VsZE1vY2tSZXF1ZXN0LCBsb2dNb2NrIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU1QkZDXHU1MTY1XHU2NzBEXHU1MkExXG5pbXBvcnQgeyBkYXRhU291cmNlU2VydmljZSwgcXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMnO1xuXG4vLyBcdTU5MDRcdTc0MDZDT1JTXHU4QkY3XHU2QzQyXG5mdW5jdGlvbiBoYW5kbGVDb3JzKHJlczogU2VydmVyUmVzcG9uc2UpIHtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uLCBYLU1vY2stRW5hYmxlZCcpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1NYXgtQWdlJywgJzg2NDAwJyk7XG59XG5cbi8vIFx1NTNEMVx1OTAwMUpTT05cdTU0Q0RcdTVFOTRcbmZ1bmN0aW9uIHNlbmRKc29uUmVzcG9uc2UocmVzOiBTZXJ2ZXJSZXNwb25zZSwgc3RhdHVzOiBudW1iZXIsIGRhdGE6IGFueSkge1xuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbi8vIFx1NUVGNlx1OEZERlx1NjI2N1x1ODg0Q1xuZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8vIFx1ODlFM1x1Njc5MFx1OEJGN1x1NkM0Mlx1NEY1M1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VSZXF1ZXN0Qm9keShyZXE6IEluY29taW5nTWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBib2R5ID0gJyc7XG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rKSA9PiB7XG4gICAgICBib2R5ICs9IGNodW5rLnRvU3RyaW5nKCk7XG4gICAgfSk7XG4gICAgcmVxLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlKGJvZHkgPyBKU09OLnBhcnNlKGJvZHkpIDoge30pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1NjU3MFx1NjM2RVx1NkU5MEFQSVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY3MERcdTUyQTFcdTVDNDJcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcdUZGMENcdTY1MkZcdTYzMDFcdTUyMDZcdTk4NzVcdTU0OENcdThGQzdcdTZFRTRcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmdldERhdGFTb3VyY2VzKHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQodXJsUXVlcnkucGFnZSBhcyBzdHJpbmcpIHx8IDEsXG4gICAgICAgIHNpemU6IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMCxcbiAgICAgICAgbmFtZTogdXJsUXVlcnkubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgIHR5cGU6IHVybFF1ZXJ5LnR5cGUgYXMgc3RyaW5nLFxuICAgICAgICBzdGF0dXM6IHVybFF1ZXJ5LnN0YXR1cyBhcyBzdHJpbmdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiByZXN1bHQuaXRlbXMsIFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGFzb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5nZXREYXRhU291cmNlKGlkKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IGRhdGFzb3VyY2UsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2UgXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgbmV3RGF0YVNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmNyZWF0ZURhdGFTb3VyY2UoYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDEsIHtcbiAgICAgICAgZGF0YTogbmV3RGF0YVNvdXJjZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBVVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YVNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLnVwZGF0ZURhdGFTb3VyY2UoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHVwZGF0ZWREYXRhU291cmNlLFxuICAgICAgICBtZXNzYWdlOiAnXHU2NTcwXHU2MzZFXHU2RTkwXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2RhdGFzb3VyY2VzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2REVMRVRFXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuZGVsZXRlRGF0YVNvdXJjZShpZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzL3Rlc3QtY29ubmVjdGlvbicgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL2RhdGFzb3VyY2VzL3Rlc3QtY29ubmVjdGlvbmApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UudGVzdENvbm5lY3Rpb24oYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NkQ0Qlx1OEJENVx1OEZERVx1NjNBNVx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY3RTVcdThCRTJBUElcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVF1ZXJpZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9xdWVyaWVzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU2NzBEXHU1MkExXHU1QzQyXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHVGRjBDXHU2NTJGXHU2MzAxXHU1MjA2XHU5ODc1XHU1NDhDXHU4RkM3XHU2RUU0XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcmllcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nLFxuICAgICAgICBkYXRhU291cmNlSWQ6IHVybFF1ZXJ5LmRhdGFTb3VyY2VJZCBhcyBzdHJpbmcsXG4gICAgICAgIHN0YXR1czogdXJsUXVlcnkuc3RhdHVzIGFzIHN0cmluZyxcbiAgICAgICAgcXVlcnlUeXBlOiB1cmxRdWVyeS5xdWVyeVR5cGUgYXMgc3RyaW5nLFxuICAgICAgICBpc0Zhdm9yaXRlOiB1cmxRdWVyeS5pc0Zhdm9yaXRlID09PSAndHJ1ZSdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiByZXN1bHQuaXRlbXMsIFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgcXVlcnkgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcnkoaWQpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcXVlcnksXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjdFNVx1OEJFMlx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2UgXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvcXVlcmllcycgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IG5ld1F1ZXJ5ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmNyZWF0ZVF1ZXJ5KGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7XG4gICAgICAgIGRhdGE6IG5ld1F1ZXJ5LFxuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU1MjFCXHU1RUZBXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQVVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgdXBkYXRlZFF1ZXJ5ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLnVwZGF0ZVF1ZXJ5KGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB1cGRhdGVkUXVlcnksXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTY2RjRcdTY1QjBcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkRFTEVURVx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHF1ZXJ5U2VydmljZS5kZWxldGVRdWVyeShpZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL3J1biQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmV4ZWN1dGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjA3XHU2MzYyXHU2N0U1XHU4QkUyXHU2NTM2XHU4NUNGXHU3MkI2XHU2MDAxXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC9mYXZvcml0ZSQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLnRvZ2dsZUZhdm9yaXRlKGlkKTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2NkY0XHU2NUIwXHU2NTM2XHU4NUNGXHU3MkI2XHU2MDAxXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL3ZlcnNpb25zJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKVszXSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCB2ZXJzaW9ucyA9IGF3YWl0IHF1ZXJ5U2VydmljZS5nZXRRdWVyeVZlcnNpb25zKGlkKTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB2ZXJzaW9ucyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI3OVx1NUI5QVx1NzI0OFx1NjcyQ1xuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvdmVyc2lvbnNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHVybFBhdGguc3BsaXQoJy8nKTtcbiAgICBjb25zdCBxdWVyeUlkID0gcGFydHNbM10gfHwgJyc7XG4gICAgY29uc3QgdmVyc2lvbklkID0gcGFydHNbNV0gfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBcdTY3RTVcdThCRTJJRDogJHtxdWVyeUlkfSwgXHU3MjQ4XHU2NzJDSUQ6ICR7dmVyc2lvbklkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCB2ZXJzaW9ucyA9IGF3YWl0IHF1ZXJ5U2VydmljZS5nZXRRdWVyeVZlcnNpb25zKHF1ZXJ5SWQpO1xuICAgICAgY29uc3QgdmVyc2lvbiA9IHZlcnNpb25zLmZpbmQoKHY6IGFueSkgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICAgIFxuICAgICAgaWYgKCF2ZXJzaW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB2ZXJzaW9uLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTUyMUJcdTVFRkFcdTRFMkRcdTk1RjRcdTRFRjZcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCk6IENvbm5lY3QuTmV4dEhhbmRsZUZ1bmN0aW9uIHtcbiAgLy8gXHU1OTgyXHU2NzlDTW9ja1x1NjcwRFx1NTJBMVx1ODhBQlx1Nzk4MVx1NzUyOFx1RkYwQ1x1OEZENFx1NTZERVx1N0E3QVx1NEUyRFx1OTVGNFx1NEVGNlxuICBpZiAoIW1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU2NzBEXHU1MkExXHU1REYyXHU3OTgxXHU3NTI4XHVGRjBDXHU4RkQ0XHU1NkRFXHU3QTdBXHU0RTJEXHU5NUY0XHU0RUY2Jyk7XG4gICAgcmV0dXJuIChyZXEsIHJlcywgbmV4dCkgPT4gbmV4dCgpO1xuICB9XG4gIFxuICBjb25zb2xlLmxvZygnW01vY2tdIFx1NTIxQlx1NUVGQVx1NEUyRFx1OTVGNFx1NEVGNiwgXHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyJyk7XG4gIFxuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbW9ja01pZGRsZXdhcmUoXG4gICAgcmVxOiBDb25uZWN0LkluY29taW5nTWVzc2FnZSxcbiAgICByZXM6IFNlcnZlclJlc3BvbnNlLFxuICAgIG5leHQ6IENvbm5lY3QuTmV4dEZ1bmN0aW9uXG4gICkge1xuICAgIHRyeSB7XG4gICAgICAvLyBcdTg5RTNcdTY3OTBVUkxcbiAgICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgICBcbiAgICAgIC8vIFx1NTkwNFx1NzQwNlVSTFx1NEUyRFx1NTNFRlx1ODBGRFx1NUI1OFx1NTcyOFx1NzY4NC9hcGkvYXBpL1x1OTFDRFx1NTkwRFx1OTVFRVx1OTg5OFxuICAgICAgbGV0IHByb2Nlc3NlZFVybCA9IHVybDtcbiAgICAgIGlmICh1cmwuc3RhcnRzV2l0aCgnL2FwaS9hcGkvJykpIHtcbiAgICAgICAgcHJvY2Vzc2VkVXJsID0gdXJsLnJlcGxhY2UoJy9hcGkvYXBpLycsICcvYXBpLycpO1xuICAgICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTY4QzBcdTZENEJcdTUyMzBcdTkxQ0RcdTU5MERcdTc2ODRBUElcdThERUZcdTVGODRcdUZGMENcdTVERjJcdTRGRUVcdTZCNjM6ICR7dXJsfSAtPiAke3Byb2Nlc3NlZFVybH1gKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgcGFyc2VkVXJsID0gcGFyc2UocHJvY2Vzc2VkVXJsLCB0cnVlKTtcbiAgICAgIGNvbnN0IHVybFBhdGggPSBwYXJzZWRVcmwucGF0aG5hbWUgfHwgJyc7XG4gICAgICBjb25zdCB1cmxRdWVyeSA9IHBhcnNlZFVybC5xdWVyeSB8fCB7fTtcbiAgICAgIFxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1RTk0XHU4QkU1XHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyXG4gICAgICBpZiAoIXNob3VsZE1vY2tSZXF1ZXN0KHByb2Nlc3NlZFVybCkpIHtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgbG9nTW9jaygnZGVidWcnLCBgXHU2NTM2XHU1MjMwXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsUGF0aH1gKTtcbiAgICAgIFxuICAgICAgLy8gXHU1OTA0XHU3NDA2Q09SU1x1OTg4NFx1NjhDMFx1OEJGN1x1NkM0MlxuICAgICAgaWYgKHJlcS5tZXRob2QgPT09ICdPUFRJT05TJykge1xuICAgICAgICBoYW5kbGVDb3JzKHJlcyk7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjA0O1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU2REZCXHU1MkEwQ09SU1x1NTkzNFxuICAgICAgaGFuZGxlQ29ycyhyZXMpO1xuICAgICAgXG4gICAgICAvLyBcdTZBMjFcdTYyREZcdTdGNTFcdTdFRENcdTVFRjZcdThGREZcbiAgICAgIGlmIChtb2NrQ29uZmlnLmRlbGF5ID4gMCkge1xuICAgICAgICBhd2FpdCBkZWxheShtb2NrQ29uZmlnLmRlbGF5KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU1OTA0XHU3NDA2XHU0RTBEXHU1NDBDXHU3Njg0QVBJXHU3QUVGXHU3MEI5XG4gICAgICBsZXQgaGFuZGxlZCA9IGZhbHNlO1xuICAgICAgXG4gICAgICAvLyBcdTYzMDlcdTk4N0FcdTVFOEZcdTVDMURcdThCRDVcdTRFMERcdTU0MENcdTc2ODRBUElcdTU5MDRcdTc0MDZcdTU2NjhcbiAgICAgIGlmICghaGFuZGxlZCkgaGFuZGxlZCA9IGF3YWl0IGhhbmRsZURhdGFzb3VyY2VzQXBpKHJlcSwgcmVzLCB1cmxQYXRoLCB1cmxRdWVyeSk7XG4gICAgICBpZiAoIWhhbmRsZWQpIGhhbmRsZWQgPSBhd2FpdCBoYW5kbGVRdWVyaWVzQXBpKHJlcSwgcmVzLCB1cmxQYXRoLCB1cmxRdWVyeSk7XG4gICAgICBcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkNBMVx1NjcwOVx1NTkwNFx1NzQwNlx1RkYwQ1x1OEZENFx1NTZERTQwNFxuICAgICAgaWYgKCFoYW5kbGVkKSB7XG4gICAgICAgIGxvZ01vY2soJ2luZm8nLCBgXHU2NzJBXHU1QjlFXHU3M0IwXHU3Njg0QVBJXHU4REVGXHU1Rjg0OiAke3JlcS5tZXRob2R9ICR7dXJsUGF0aH1gKTtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgICBlcnJvcjogJ1x1NjcyQVx1NjI3RVx1NTIzMEFQSVx1N0FFRlx1NzBCOScsXG4gICAgICAgICAgbWVzc2FnZTogYEFQSVx1N0FFRlx1NzBCOSAke3VybFBhdGh9IFx1NjcyQVx1NjI3RVx1NTIzMFx1NjIxNlx1NjcyQVx1NUI5RVx1NzNCMGAsXG4gICAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ01vY2soJ2Vycm9yJywgYFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NTFGQVx1OTUxOTpgLCBlcnJvcik7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0gIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxuICogXG4gKiBcdTYzQTdcdTUyMzZNb2NrXHU2NzBEXHU1MkExXHU3Njg0XHU1NDJGXHU3NTI4L1x1Nzk4MVx1NzUyOFx1NzJCNlx1NjAwMVx1MzAwMVx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQlx1N0I0OVxuICovXG5cbi8vIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NjIxNlx1NTE2OFx1NUM0MFx1OEJCRVx1N0Y2RVx1NEUyRFx1ODNCN1x1NTNENlx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbmV4cG9ydCBmdW5jdGlvbiBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgLy8gXHU1NzI4Tm9kZS5qc1x1NzNBRlx1NTg4M1x1NEUyRFxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzXHU0RTJEXG4gICAgaWYgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52KSB7XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU2OEMwXHU2N0U1bG9jYWxTdG9yYWdlIChcdTRFQzVcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODMpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIGNvbnN0IGxvY2FsU3RvcmFnZVZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1VTRV9NT0NLX0FQSScpO1xuICAgICAgaWYgKGxvY2FsU3RvcmFnZVZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAobG9jYWxTdG9yYWdlVmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTlFRDhcdThCQTRcdTYwQzVcdTUxQjVcdUZGMUFcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEJcdTU0MkZcdTc1MjhcdUZGMENcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTc5ODFcdTc1MjhcbiAgICBjb25zdCBpc0RldmVsb3BtZW50ID0gXG4gICAgICAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB8fFxuICAgICAgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52ICYmIGltcG9ydC5tZXRhLmVudi5ERVYgPT09IHRydWUpO1xuICAgIFxuICAgIHJldHVybiBpc0RldmVsb3BtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIFx1NTFGQVx1OTUxOVx1NjVGNlx1NzY4NFx1NUI4OVx1NTE2OFx1NTZERVx1OTAwMFxuICAgIGNvbnNvbGUud2FybignW01vY2tdIFx1NjhDMFx1NjdFNVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NTFGQVx1OTUxOVx1RkYwQ1x1OUVEOFx1OEJBNFx1Nzk4MVx1NzUyOE1vY2tcdTY3MERcdTUyQTEnLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1NTQxMVx1NTQwRVx1NTE3Q1x1NUJCOVx1NjVFN1x1NEVFM1x1NzgwMVx1NzY4NFx1NTFGRFx1NjU3MFxuZXhwb3J0IGZ1bmN0aW9uIGlzTW9ja0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0VuYWJsZWQoKTtcbn1cblxuLy8gTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVxuZXhwb3J0IGNvbnN0IG1vY2tDb25maWcgPSB7XG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgZW5hYmxlZDogaXNFbmFibGVkKCksXG4gIFxuICAvLyBcdThCRjdcdTZDNDJcdTVFRjZcdThGREZcdUZGMDhcdTZCRUJcdTc5RDJcdUZGMDlcbiAgZGVsYXk6IDMwMCxcbiAgXG4gIC8vIEFQSVx1NTdGQVx1Nzg0MFx1OERFRlx1NUY4NFx1RkYwQ1x1NzUyOFx1NEU4RVx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1OTcwMFx1ODk4MVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuICBhcGlCYXNlUGF0aDogJy9hcGknLFxuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCOiAnbm9uZScsICdlcnJvcicsICdpbmZvJywgJ2RlYnVnJ1xuICBsb2dMZXZlbDogJ2RlYnVnJyxcbiAgXG4gIC8vIFx1NTQyRlx1NzUyOFx1NzY4NFx1NkEyMVx1NTc1N1xuICBtb2R1bGVzOiB7XG4gICAgZGF0YXNvdXJjZXM6IHRydWUsXG4gICAgcXVlcmllczogdHJ1ZSxcbiAgICB1c2VyczogdHJ1ZSxcbiAgICB2aXN1YWxpemF0aW9uczogdHJ1ZVxuICB9XG59O1xuXG4vLyBcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRNb2NrUmVxdWVzdCh1cmw6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBcdTVGQzVcdTk4N0JcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdTVGQzVcdTk4N0JcdTY2MkZBUElcdThCRjdcdTZDNDJcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aChtb2NrQ29uZmlnLmFwaUJhc2VQYXRoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU4REVGXHU1Rjg0XHU2OEMwXHU2N0U1XHU5MDFBXHU4RkM3XHVGRjBDXHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBcdThCQjBcdTVGNTVcdTY1RTVcdTVGRDdcbmV4cG9ydCBmdW5jdGlvbiBsb2dNb2NrKGxldmVsOiAnZXJyb3InIHwgJ2luZm8nIHwgJ2RlYnVnJywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgY29uc3QgeyBsb2dMZXZlbCB9ID0gbW9ja0NvbmZpZztcbiAgXG4gIGlmIChsb2dMZXZlbCA9PT0gJ25vbmUnKSByZXR1cm47XG4gIFxuICBpZiAobGV2ZWwgPT09ICdlcnJvcicgJiYgWydlcnJvcicsICdpbmZvJywgJ2RlYnVnJ10uaW5jbHVkZXMobG9nTGV2ZWwpKSB7XG4gICAgY29uc29sZS5lcnJvcignW01vY2sgRVJST1JdJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdpbmZvJyAmJiBbJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmluZm8oJ1tNb2NrIElORk9dJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdkZWJ1ZycgJiYgbG9nTGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2sgREVCVUddJywgLi4uYXJncyk7XG4gIH1cbn1cblxuLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHU2NUY2XHU4RjkzXHU1MUZBTW9ja1x1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMVxudHJ5IHtcbiAgY29uc29sZS5sb2coYFtNb2NrXSBcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDE6ICR7bW9ja0NvbmZpZy5lbmFibGVkID8gJ1x1NURGMlx1NTQyRlx1NzUyOCcgOiAnXHU1REYyXHU3OTgxXHU3NTI4J31gKTtcbiAgaWYgKG1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU5MTREXHU3RjZFOmAsIHtcbiAgICAgIGRlbGF5OiBtb2NrQ29uZmlnLmRlbGF5LFxuICAgICAgYXBpQmFzZVBhdGg6IG1vY2tDb25maWcuYXBpQmFzZVBhdGgsXG4gICAgICBsb2dMZXZlbDogbW9ja0NvbmZpZy5sb2dMZXZlbCxcbiAgICAgIGVuYWJsZWRNb2R1bGVzOiBPYmplY3QuZW50cmllcyhtb2NrQ29uZmlnLm1vZHVsZXMpXG4gICAgICAgIC5maWx0ZXIoKFtfLCBlbmFibGVkXSkgPT4gZW5hYmxlZClcbiAgICAgICAgLm1hcCgoW25hbWVdKSA9PiBuYW1lKVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdThGOTNcdTUxRkFcdTkxNERcdTdGNkVcdTRGRTFcdTYwNkZcdTUxRkFcdTk1MTknLCBlcnJvcik7XG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzXCI7LyoqXG4gKiBcdTY1NzBcdTYzNkVcdTZFOTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2NTcwXHU2MzZFXHU2RTkwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHVGRjBDXHU3NTI4XHU0RThFXHU1RjAwXHU1M0QxXHU1NDhDXHU2RDRCXHU4QkQ1XG4gKi9cblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU3QzdCXHU1NzhCXG5leHBvcnQgdHlwZSBEYXRhU291cmNlVHlwZSA9ICdteXNxbCcgfCAncG9zdGdyZXNxbCcgfCAnb3JhY2xlJyB8ICdzcWxzZXJ2ZXInIHwgJ3NxbGl0ZSc7XG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NzJCNlx1NjAwMVxuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZVN0YXR1cyA9ICdhY3RpdmUnIHwgJ2luYWN0aXZlJyB8ICdlcnJvcicgfCAncGVuZGluZyc7XG5cbi8vIFx1NTQwQ1x1NkI2NVx1OTg5MVx1NzM4N1xuZXhwb3J0IHR5cGUgU3luY0ZyZXF1ZW5jeSA9ICdtYW51YWwnIHwgJ2hvdXJseScgfCAnZGFpbHknIHwgJ3dlZWtseScgfCAnbW9udGhseSc7XG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjNBNVx1NTNFM1xuZXhwb3J0IGludGVyZmFjZSBEYXRhU291cmNlIHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgdHlwZTogRGF0YVNvdXJjZVR5cGU7XG4gIGhvc3Q/OiBzdHJpbmc7XG4gIHBvcnQ/OiBudW1iZXI7XG4gIGRhdGFiYXNlTmFtZT86IHN0cmluZztcbiAgdXNlcm5hbWU/OiBzdHJpbmc7XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xuICBzdGF0dXM6IERhdGFTb3VyY2VTdGF0dXM7XG4gIHN5bmNGcmVxdWVuY3k/OiBTeW5jRnJlcXVlbmN5O1xuICBsYXN0U3luY1RpbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjcmVhdGVkQXQ6IHN0cmluZztcbiAgdXBkYXRlZEF0OiBzdHJpbmc7XG4gIGlzQWN0aXZlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICovXG5leHBvcnQgY29uc3QgbW9ja0RhdGFTb3VyY2VzOiBEYXRhU291cmNlW10gPSBbXG4gIHtcbiAgICBpZDogJ2RzLTEnLFxuICAgIG5hbWU6ICdNeVNRTFx1NzkzQVx1NEY4Qlx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTc5M0FcdTRGOEJNeVNRTFx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ215c3FsJyxcbiAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICBwb3J0OiAzMzA2LFxuICAgIGRhdGFiYXNlTmFtZTogJ2V4YW1wbGVfZGInLFxuICAgIHVzZXJuYW1lOiAndXNlcicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTInLFxuICAgIG5hbWU6ICdQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFBvc3RncmVTUUxcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdwb3N0Z3Jlc3FsJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjEwMCcsXG4gICAgcG9ydDogNTQzMixcbiAgICBkYXRhYmFzZU5hbWU6ICdwcm9kdWN0aW9uX2RiJyxcbiAgICB1c2VybmFtZTogJ2FkbWluJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdob3VybHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNzc3NjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMycsXG4gICAgbmFtZTogJ1NRTGl0ZVx1NjcyQ1x1NTczMFx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY3MkNcdTU3MzBTUUxpdGVcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdzcWxpdGUnLFxuICAgIGRhdGFiYXNlTmFtZTogJy9wYXRoL3RvL2xvY2FsLmRiJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdtYW51YWwnLFxuICAgIGxhc3RTeW5jVGltZTogbnVsbCxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM0NTYwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy00JyxcbiAgICBuYW1lOiAnU1FMIFNlcnZlclx1NkQ0Qlx1OEJENVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU3M0FGXHU1ODgzJyxcbiAgICB0eXBlOiAnc3Fsc2VydmVyJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjIwMCcsXG4gICAgcG9ydDogMTQzMyxcbiAgICBkYXRhYmFzZU5hbWU6ICd0ZXN0X2RiJyxcbiAgICB1c2VybmFtZTogJ3Rlc3RlcicsXG4gICAgc3RhdHVzOiAnaW5hY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICd3ZWVrbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDYwNDgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA1MTg0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IGZhbHNlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTUnLFxuICAgIG5hbWU6ICdPcmFjbGVcdTRGMDFcdTRFMUFcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwT3JhY2xlXHU0RjAxXHU0RTFBXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnb3JhY2xlJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjE1MCcsXG4gICAgcG9ydDogMTUyMSxcbiAgICBkYXRhYmFzZU5hbWU6ICdlbnRlcnByaXNlX2RiJyxcbiAgICB1c2VybmFtZTogJ3N5c3RlbScsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxMDM2ODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH1cbl07XG5cbi8qKlxuICogXHU3NTFGXHU2MjEwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gY291bnQgXHU3NTFGXHU2MjEwXHU2NTcwXHU5MUNGXG4gKiBAcmV0dXJucyBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTdFQzRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTW9ja0RhdGFTb3VyY2VzKGNvdW50OiBudW1iZXIgPSA1KTogRGF0YVNvdXJjZVtdIHtcbiAgY29uc3QgdHlwZXM6IERhdGFTb3VyY2VUeXBlW10gPSBbJ215c3FsJywgJ3Bvc3RncmVzcWwnLCAnb3JhY2xlJywgJ3NxbHNlcnZlcicsICdzcWxpdGUnXTtcbiAgY29uc3Qgc3RhdHVzZXM6IERhdGFTb3VyY2VTdGF0dXNbXSA9IFsnYWN0aXZlJywgJ2luYWN0aXZlJywgJ2Vycm9yJywgJ3BlbmRpbmcnXTtcbiAgY29uc3Qgc3luY0ZyZXFzOiBTeW5jRnJlcXVlbmN5W10gPSBbJ21hbnVhbCcsICdob3VybHknLCAnZGFpbHknLCAnd2Vla2x5JywgJ21vbnRobHknXTtcbiAgXG4gIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9LCAoXywgaSkgPT4ge1xuICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpICUgdHlwZXMubGVuZ3RoXTtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICBpZDogYGRzLWdlbi0ke2kgKyAxfWAsXG4gICAgICBuYW1lOiBgXHU3NTFGXHU2MjEwXHU3Njg0JHt0eXBlfVx1NjU3MFx1NjM2RVx1NkU5MCAke2kgKyAxfWAsXG4gICAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1NzY4NCR7dHlwZX1cdTdDN0JcdTU3OEJcdTY1NzBcdTYzNkVcdTZFOTAgJHtpICsgMX1gLFxuICAgICAgdHlwZSxcbiAgICAgIGhvc3Q6IHR5cGUgIT09ICdzcWxpdGUnID8gJ2xvY2FsaG9zdCcgOiB1bmRlZmluZWQsXG4gICAgICBwb3J0OiB0eXBlICE9PSAnc3FsaXRlJyA/ICgzMzA2ICsgaSkgOiB1bmRlZmluZWQsXG4gICAgICBkYXRhYmFzZU5hbWU6IHR5cGUgPT09ICdzcWxpdGUnID8gYC9wYXRoL3RvL2RiXyR7aX0uZGJgIDogYGV4YW1wbGVfZGJfJHtpfWAsXG4gICAgICB1c2VybmFtZTogdHlwZSAhPT0gJ3NxbGl0ZScgPyBgdXNlcl8ke2l9YCA6IHVuZGVmaW5lZCxcbiAgICAgIHN0YXR1czogc3RhdHVzZXNbaSAlIHN0YXR1c2VzLmxlbmd0aF0sXG4gICAgICBzeW5jRnJlcXVlbmN5OiBzeW5jRnJlcXNbaSAlIHN5bmNGcmVxcy5sZW5ndGhdLFxuICAgICAgbGFzdFN5bmNUaW1lOiBpICUgMyA9PT0gMCA/IG51bGwgOiBuZXcgRGF0ZShub3cgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKG5vdyAtIChpICsgMTApICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKG5vdyAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGlzQWN0aXZlOiBpICUgNCAhPT0gMFxuICAgIH07XG4gIH0pO1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTlFRDhcdThCQTRcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbmV4cG9ydCBkZWZhdWx0IG1vY2tEYXRhU291cmNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzXCI7LyoqXG4gKiBcdTY1NzBcdTYzNkVcdTZFOTBNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjU3MFx1NjM2RVx1NkU5MFx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IG1vY2tEYXRhU291cmNlcyB9IGZyb20gJy4uL2RhdGEvZGF0YXNvdXJjZSc7XG5pbXBvcnQgdHlwZSB7IERhdGFTb3VyY2UgfSBmcm9tICcuLi9kYXRhL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NEUzNFx1NjVGNlx1NUI1OFx1NTBBOFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1RkYwQ1x1NTE0MVx1OEJCOFx1NkEyMVx1NjJERlx1NTg5RVx1NTIyMFx1NjUzOVx1NjRDRFx1NEY1Q1xubGV0IGRhdGFTb3VyY2VzID0gWy4uLm1vY2tEYXRhU291cmNlc107XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNpbXVsYXRlRGVsYXkoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRlbGF5ID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xufVxuXG4vKipcbiAqIFx1OTFDRFx1N0Y2RVx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1NjM2RVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzZXREYXRhU291cmNlcygpOiB2b2lkIHtcbiAgZGF0YVNvdXJjZXMgPSBbLi4ubW9ja0RhdGFTb3VyY2VzXTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqIEBwYXJhbSBwYXJhbXMgXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwXG4gKiBAcmV0dXJucyBcdTUyMDZcdTk4NzVcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFTb3VyY2VzKHBhcmFtcz86IHtcbiAgcGFnZT86IG51bWJlcjtcbiAgc2l6ZT86IG51bWJlcjtcbiAgbmFtZT86IHN0cmluZztcbiAgdHlwZT86IHN0cmluZztcbiAgc3RhdHVzPzogc3RyaW5nO1xufSk6IFByb21pc2U8e1xuICBpdGVtczogRGF0YVNvdXJjZVtdO1xuICBwYWdpbmF0aW9uOiB7XG4gICAgdG90YWw6IG51bWJlcjtcbiAgICBwYWdlOiBudW1iZXI7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIHRvdGFsUGFnZXM6IG51bWJlcjtcbiAgfTtcbn0+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgXG4gIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICBsZXQgZmlsdGVyZWRJdGVtcyA9IFsuLi5kYXRhU291cmNlc107XG4gIFxuICAvLyBcdTYzMDlcdTU0MERcdTc5RjBcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgIGNvbnN0IGtleXdvcmQgPSBwYXJhbXMubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBcbiAgICAgIGRzLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgIChkcy5kZXNjcmlwdGlvbiAmJiBkcy5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICk7XG4gIH1cbiAgXG4gIC8vIFx1NjMwOVx1N0M3Qlx1NTc4Qlx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy50eXBlKSB7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IGRzLnR5cGUgPT09IHBhcmFtcy50eXBlKTtcbiAgfVxuICBcbiAgLy8gXHU2MzA5XHU3MkI2XHU2MDAxXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBkcy5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICB9XG4gIFxuICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5zbGljZShzdGFydCwgZW5kKTtcbiAgXG4gIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICByZXR1cm4ge1xuICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0b3RhbDogZmlsdGVyZWRJdGVtcy5sZW5ndGgsXG4gICAgICBwYWdlLFxuICAgICAgc2l6ZSxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmaWx0ZXJlZEl0ZW1zLmxlbmd0aCAvIHNpemUpXG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKiBAcmV0dXJucyBcdTY1NzBcdTYzNkVcdTZFOTBcdThCRTZcdTYwQzVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFTb3VyY2UoaWQ6IHN0cmluZyk6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2N0U1XHU2MjdFXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IGRhdGFTb3VyY2UgPSBkYXRhU291cmNlcy5maW5kKGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoIWRhdGFTb3VyY2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgcmV0dXJuIGRhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gZGF0YSBcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTYzNkVcbiAqIEByZXR1cm5zIFx1NTIxQlx1NUVGQVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlRGF0YVNvdXJjZShkYXRhOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBJRFxuICBjb25zdCBuZXdJZCA9IGBkcy0ke0RhdGUubm93KCl9YDtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCBuZXdEYXRhU291cmNlOiBEYXRhU291cmNlID0ge1xuICAgIGlkOiBuZXdJZCxcbiAgICBuYW1lOiBkYXRhLm5hbWUgfHwgJ05ldyBEYXRhIFNvdXJjZScsXG4gICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgdHlwZTogZGF0YS50eXBlIHx8ICdteXNxbCcsXG4gICAgaG9zdDogZGF0YS5ob3N0LFxuICAgIHBvcnQ6IGRhdGEucG9ydCxcbiAgICBkYXRhYmFzZU5hbWU6IGRhdGEuZGF0YWJhc2VOYW1lLFxuICAgIHVzZXJuYW1lOiBkYXRhLnVzZXJuYW1lLFxuICAgIHN0YXR1czogZGF0YS5zdGF0dXMgfHwgJ3BlbmRpbmcnLFxuICAgIHN5bmNGcmVxdWVuY3k6IGRhdGEuc3luY0ZyZXF1ZW5jeSB8fCAnbWFudWFsJyxcbiAgICBsYXN0U3luY1RpbWU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfTtcbiAgXG4gIC8vIFx1NkRGQlx1NTJBMFx1NTIzMFx1NTIxN1x1ODg2OFxuICBkYXRhU291cmNlcy5wdXNoKG5ld0RhdGFTb3VyY2UpO1xuICBcbiAgcmV0dXJuIG5ld0RhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqIEBwYXJhbSBkYXRhIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVxuICogQHJldHVybnMgXHU2NkY0XHU2NUIwXHU1NDBFXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVEYXRhU291cmNlKGlkOiBzdHJpbmcsIGRhdGE6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjI3RVx1NTIzMFx1ODk4MVx1NjZGNFx1NjVCMFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFx1N0QyMlx1NUYxNVxuICBjb25zdCBpbmRleCA9IGRhdGFTb3VyY2VzLmZpbmRJbmRleChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgdXBkYXRlZERhdGFTb3VyY2U6IERhdGFTb3VyY2UgPSB7XG4gICAgLi4uZGF0YVNvdXJjZXNbaW5kZXhdLFxuICAgIC4uLmRhdGEsXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgfTtcbiAgXG4gIC8vIFx1NjZGRlx1NjM2Mlx1NjU3MFx1NjM2RVx1NkU5MFxuICBkYXRhU291cmNlc1tpbmRleF0gPSB1cGRhdGVkRGF0YVNvdXJjZTtcbiAgXG4gIHJldHVybiB1cGRhdGVkRGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlRGF0YVNvdXJjZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTYyN0VcdTUyMzBcdTg5ODFcdTUyMjBcdTk2NjRcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcdTdEMjJcdTVGMTVcbiAgY29uc3QgaW5kZXggPSBkYXRhU291cmNlcy5maW5kSW5kZXgoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgLy8gXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGRhdGFTb3VyY2VzLnNwbGljZShpbmRleCwgMSk7XG59XG5cbi8qKlxuICogXHU2RDRCXHU4QkQ1XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkRFXHU2M0E1XG4gKiBAcGFyYW0gcGFyYW1zIFx1OEZERVx1NjNBNVx1NTNDMlx1NjU3MFxuICogQHJldHVybnMgXHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU3RUQzXHU2NzlDXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0Q29ubmVjdGlvbihwYXJhbXM6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPHtcbiAgc3VjY2VzczogYm9vbGVhbjtcbiAgbWVzc2FnZT86IHN0cmluZztcbiAgZGV0YWlscz86IGFueTtcbn0+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NUI5RVx1OTY0NVx1NEY3Rlx1NzUyOFx1NjVGNlx1NTNFRlx1ODBGRFx1NEYxQVx1NjcwOVx1NjZGNFx1NTkwRFx1Njc0Mlx1NzY4NFx1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1OTAzQlx1OEY5MVxuICAvLyBcdThGRDlcdTkxQ0NcdTdCODBcdTUzNTVcdTZBMjFcdTYyREZcdTYyMTBcdTUyOUYvXHU1OTMxXHU4RDI1XG4gIGNvbnN0IHN1Y2Nlc3MgPSBNYXRoLnJhbmRvbSgpID4gMC4yOyAvLyA4MCVcdTYyMTBcdTUyOUZcdTczODdcbiAgXG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBtZXNzYWdlOiBzdWNjZXNzID8gJ1x1OEZERVx1NjNBNVx1NjIxMFx1NTI5RicgOiAnXHU4RkRFXHU2M0E1XHU1OTMxXHU4RDI1OiBcdTY1RTBcdTZDRDVcdThGREVcdTYzQTVcdTUyMzBcdTY1NzBcdTYzNkVcdTVFOTNcdTY3MERcdTUyQTFcdTU2NjgnLFxuICAgIGRldGFpbHM6IHN1Y2Nlc3MgPyB7XG4gICAgICByZXNwb25zZVRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSArIDEwLFxuICAgICAgdmVyc2lvbjogJzguMC4yOCcsXG4gICAgICBjb25uZWN0aW9uSWQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKSArIDEwMDBcbiAgICB9IDoge1xuICAgICAgZXJyb3JDb2RlOiAnQ09OTkVDVElPTl9SRUZVU0VEJyxcbiAgICAgIGVycm9yRGV0YWlsczogJ1x1NjVFMFx1NkNENVx1NUVGQVx1N0FDQlx1NTIzMFx1NjcwRFx1NTJBMVx1NTY2OFx1NzY4NFx1OEZERVx1NjNBNVx1RkYwQ1x1OEJGN1x1NjhDMFx1NjdFNVx1N0Y1MVx1N0VEQ1x1OEJCRVx1N0Y2RVx1NTQ4Q1x1NTFFRFx1NjM2RSdcbiAgICB9XG4gIH07XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXREYXRhU291cmNlcyxcbiAgZ2V0RGF0YVNvdXJjZSxcbiAgY3JlYXRlRGF0YVNvdXJjZSxcbiAgdXBkYXRlRGF0YVNvdXJjZSxcbiAgZGVsZXRlRGF0YVNvdXJjZSxcbiAgdGVzdENvbm5lY3Rpb24sXG4gIHJlc2V0RGF0YVNvdXJjZXNcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvdXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5MDFBXHU3NTI4XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NTIxQlx1NUVGQVx1N0VERlx1NEUwMFx1NjgzQ1x1NUYwRlx1NTRDRFx1NUU5NFx1NzY4NFx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuICovXG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2QTIxXHU2MkRGQVBJXHU2MjEwXHU1MjlGXHU1NENEXHU1RTk0XG4gKiBAcGFyYW0gZGF0YSBcdTU0Q0RcdTVFOTRcdTY1NzBcdTYzNkVcbiAqIEBwYXJhbSBzdWNjZXNzIFx1NjIxMFx1NTI5Rlx1NzJCNlx1NjAwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQXRydWVcbiAqIEBwYXJhbSBtZXNzYWdlIFx1NTNFRlx1OTAwOVx1NkQ4OFx1NjA2RlxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHU3Njg0QVBJXHU1NENEXHU1RTk0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrUmVzcG9uc2U8VD4oXG4gIGRhdGE6IFQsIFxuICBzdWNjZXNzOiBib29sZWFuID0gdHJ1ZSwgXG4gIG1lc3NhZ2U/OiBzdHJpbmdcbikge1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3MsXG4gICAgZGF0YSxcbiAgICBtZXNzYWdlLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIG1vY2tSZXNwb25zZTogdHJ1ZSAvLyBcdTY4MDdcdThCQjBcdTRFM0FcdTZBMjFcdTYyREZcdTU0Q0RcdTVFOTRcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTZBMjFcdTYyREZBUElcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqIEBwYXJhbSBtZXNzYWdlIFx1OTUxOVx1OEJFRlx1NkQ4OFx1NjA2RlxuICogQHBhcmFtIGNvZGUgXHU5NTE5XHU4QkVGXHU0RUUzXHU3ODAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBJ01PQ0tfRVJST1InXG4gKiBAcGFyYW0gc3RhdHVzIEhUVFBcdTcyQjZcdTYwMDFcdTc4MDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0E1MDBcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NjgzQ1x1NUYwRlx1NzY4NFx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UoXG4gIG1lc3NhZ2U6IHN0cmluZywgXG4gIGNvZGU6IHN0cmluZyA9ICdNT0NLX0VSUk9SJywgXG4gIHN0YXR1czogbnVtYmVyID0gNTAwXG4pIHtcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICBlcnJvcjoge1xuICAgICAgbWVzc2FnZSxcbiAgICAgIGNvZGUsXG4gICAgICBzdGF0dXNDb2RlOiBzdGF0dXNcbiAgICB9LFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIG1vY2tSZXNwb25zZTogdHJ1ZVxuICB9O1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NFx1N0VEM1x1Njc4NFxuICogQHBhcmFtIGl0ZW1zIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzY4NFx1OTg3OVx1NzZFRVx1NTIxN1x1ODg2OFxuICogQHBhcmFtIHRvdGFsSXRlbXMgXHU2MDNCXHU5ODc5XHU3NkVFXHU2NTcwXG4gKiBAcGFyYW0gcGFnZSBcdTVGNTNcdTUyNERcdTk4NzVcdTc4MDFcbiAqIEBwYXJhbSBzaXplIFx1NkJDRlx1OTg3NVx1NTkyN1x1NUMwRlxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU1MjA2XHU5ODc1XHU1NENEXHU1RTk0XHU3RUQzXHU2Nzg0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2U8VD4oXG4gIGl0ZW1zOiBUW10sXG4gIHRvdGFsSXRlbXM6IG51bWJlcixcbiAgcGFnZTogbnVtYmVyID0gMSxcbiAgc2l6ZTogbnVtYmVyID0gMTBcbikge1xuICByZXR1cm4gY3JlYXRlTW9ja1Jlc3BvbnNlKHtcbiAgICBpdGVtcyxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0b3RhbDogdG90YWxJdGVtcyxcbiAgICAgIHBhZ2UsXG4gICAgICBzaXplLFxuICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsSXRlbXMgLyBzaXplKSxcbiAgICAgIGhhc01vcmU6IHBhZ2UgKiBzaXplIDwgdG90YWxJdGVtc1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XHU1RUY2XHU4RkRGXG4gKiBAcGFyYW0gbXMgXHU1RUY2XHU4RkRGXHU2QkVCXHU3OUQyXHU2NTcwXHVGRjBDXHU5RUQ4XHU4QkE0MzAwbXNcbiAqIEByZXR1cm5zIFByb21pc2VcdTVCRjlcdThDNjFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIgPSAzMDApOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvcXVlcnkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3F1ZXJ5LnRzXCI7LyoqXG4gKiBcdTY3RTVcdThCRTJNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjdFNVx1OEJFMlx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IGRlbGF5LCBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsIGNyZWF0ZU1vY2tSZXNwb25zZSwgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuXG4vLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbmNvbnN0IG1vY2tRdWVyaWVzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+IHtcbiAgY29uc3QgaWQgPSBgcXVlcnktJHtpICsgMX1gO1xuICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpO1xuICBcbiAgcmV0dXJuIHtcbiAgICBpZCxcbiAgICBuYW1lOiBgXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyICR7aSArIDF9YCxcbiAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfSBcdTc2ODRcdTYzQ0ZcdThGRjBgLFxuICAgIGZvbGRlcklkOiBpICUgMyA9PT0gMCA/ICdmb2xkZXItMScgOiAoaSAlIDMgPT09IDEgPyAnZm9sZGVyLTInIDogJ2ZvbGRlci0zJyksXG4gICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgIGRhdGFTb3VyY2VOYW1lOiBgXHU2NTcwXHU2MzZFXHU2RTkwICR7KGkgJSA1KSArIDF9YCxcbiAgICBxdWVyeVR5cGU6IGkgJSAyID09PSAwID8gJ1NRTCcgOiAnTkFUVVJBTF9MQU5HVUFHRScsXG4gICAgcXVlcnlUZXh0OiBpICUgMiA9PT0gMCA/IFxuICAgICAgYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAgOiBcbiAgICAgIGBcdTY3RTVcdTYyN0VcdTY3MDBcdThGRDExMFx1Njc2MSR7aSAlIDIgPT09IDAgPyAnXHU4QkEyXHU1MzU1JyA6ICdcdTc1MjhcdTYyMzcnfVx1OEJCMFx1NUY1NWAsXG4gICAgc3RhdHVzOiBpICUgNCA9PT0gMCA/ICdEUkFGVCcgOiAoaSAlIDQgPT09IDEgPyAnUFVCTElTSEVEJyA6IChpICUgNCA9PT0gMiA/ICdERVBSRUNBVEVEJyA6ICdBUkNISVZFRCcpKSxcbiAgICBzZXJ2aWNlU3RhdHVzOiBpICUgMiA9PT0gMCA/ICdFTkFCTEVEJyA6ICdESVNBQkxFRCcsXG4gICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRCeTogeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICB1cGRhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgZXhlY3V0aW9uQ291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSxcbiAgICBpc0Zhdm9yaXRlOiBpICUgMyA9PT0gMCxcbiAgICBpc0FjdGl2ZTogaSAlIDUgIT09IDAsXG4gICAgbGFzdEV4ZWN1dGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogNDMyMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHJlc3VsdENvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApICsgMTAsXG4gICAgZXhlY3V0aW9uVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTAwKSArIDEwLFxuICAgIHRhZ3M6IFtgXHU2ODA3XHU3QjdFJHtpKzF9YCwgYFx1N0M3Qlx1NTc4QiR7aSAlIDN9YF0sXG4gICAgY3VycmVudFZlcnNpb246IHtcbiAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgcXVlcnlJZDogaWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9LFxuICAgIHZlcnNpb25zOiBbe1xuICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICBxdWVyeUlkOiBpZCxcbiAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICBuYW1lOiAnXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDJyxcbiAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH1dXG4gIH07XG59KTtcblxuLy8gXHU5MUNEXHU3RjZFXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRRdWVyaWVzKCk6IHZvaWQge1xuICAvLyBcdTRGRERcdTc1NTlcdTVGMTVcdTc1MjhcdUZGMENcdTUzRUFcdTkxQ0RcdTdGNkVcdTUxODVcdTVCQjlcbiAgd2hpbGUgKG1vY2tRdWVyaWVzLmxlbmd0aCA+IDApIHtcbiAgICBtb2NrUXVlcmllcy5wb3AoKTtcbiAgfVxuICBcbiAgLy8gXHU5MUNEXHU2NUIwXHU3NTFGXHU2MjEwXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXG4gIEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiB7XG4gICAgY29uc3QgaWQgPSBgcXVlcnktJHtpICsgMX1gO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgbW9ja1F1ZXJpZXMucHVzaCh7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6IGBcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX1gLFxuICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX0gXHU3Njg0XHU2M0NGXHU4RkYwYCxcbiAgICAgIGZvbGRlcklkOiBpICUgMyA9PT0gMCA/ICdmb2xkZXItMScgOiAoaSAlIDMgPT09IDEgPyAnZm9sZGVyLTInIDogJ2ZvbGRlci0zJyksXG4gICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICBkYXRhU291cmNlTmFtZTogYFx1NjU3MFx1NjM2RVx1NkU5MCAkeyhpICUgNSkgKyAxfWAsXG4gICAgICBxdWVyeVR5cGU6IGkgJSAyID09PSAwID8gJ1NRTCcgOiAnTkFUVVJBTF9MQU5HVUFHRScsXG4gICAgICBxdWVyeVRleHQ6IGkgJSAyID09PSAwID8gXG4gICAgICAgIGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgIDogXG4gICAgICAgIGBcdTY3RTVcdTYyN0VcdTY3MDBcdThGRDExMFx1Njc2MSR7aSAlIDIgPT09IDAgPyAnXHU4QkEyXHU1MzU1JyA6ICdcdTc1MjhcdTYyMzcnfVx1OEJCMFx1NUY1NWAsXG4gICAgICBzdGF0dXM6IGkgJSA0ID09PSAwID8gJ0RSQUZUJyA6IChpICUgNCA9PT0gMSA/ICdQVUJMSVNIRUQnIDogKGkgJSA0ID09PSAyID8gJ0RFUFJFQ0FURUQnIDogJ0FSQ0hJVkVEJykpLFxuICAgICAgc2VydmljZVN0YXR1czogaSAlIDIgPT09IDAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjcmVhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICB1cGRhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICBleGVjdXRpb25Db3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApLFxuICAgICAgaXNGYXZvcml0ZTogaSAlIDMgPT09IDAsXG4gICAgICBpc0FjdGl2ZTogaSAlIDUgIT09IDAsXG4gICAgICBsYXN0RXhlY3V0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICByZXN1bHRDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTAwKSArIDEwLFxuICAgICAgdGFnczogW2BcdTY4MDdcdTdCN0Uke2krMX1gLCBgXHU3QzdCXHU1NzhCJHtpICUgM31gXSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9LFxuICAgICAgdmVyc2lvbnM6IFt7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9XVxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXlUaW1lID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIGRlbGF5KGRlbGF5VGltZSk7XG59XG5cbi8qKlxuICogXHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IHF1ZXJ5U2VydmljZSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcmllcyhwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdThGQzdcdTZFRTRcbiAgICBsZXQgZmlsdGVyZWRJdGVtcyA9IFsuLi5tb2NrUXVlcmllc107XG4gICAgXG4gICAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBcbiAgICAgICAgcS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAgIChxLmRlc2NyaXB0aW9uICYmIHEuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NjU3MFx1NjM2RVx1NkU5MFx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LmRhdGFTb3VyY2VJZCkge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5kYXRhU291cmNlSWQgPT09IHBhcmFtcy5kYXRhU291cmNlSWQpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU3QzdCXHU1NzhCXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8ucXVlcnlUeXBlKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLnF1ZXJ5VHlwZSA9PT0gcGFyYW1zLnF1ZXJ5VHlwZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NjUzNlx1ODVDRlx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LmlzRmF2b3JpdGUpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEuaXNGYXZvcml0ZSA9PT0gdHJ1ZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnkoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXMuZmluZChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHF1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnkoZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwSURcdUZGMENcdTY4M0NcdTVGMEZcdTRFMEVcdTczQjBcdTY3MDlJRFx1NEUwMFx1ODFGNFxuICAgIGNvbnN0IGlkID0gYHF1ZXJ5LSR7bW9ja1F1ZXJpZXMubGVuZ3RoICsgMX1gO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTY3RTVcdThCRTJcbiAgICBjb25zdCBuZXdRdWVyeSA9IHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogZGF0YS5uYW1lIHx8IGBcdTY1QjBcdTY3RTVcdThCRTIgJHtpZH1gLFxuICAgICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgICBmb2xkZXJJZDogZGF0YS5mb2xkZXJJZCB8fCBudWxsLFxuICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCxcbiAgICAgIGRhdGFTb3VyY2VOYW1lOiBkYXRhLmRhdGFTb3VyY2VOYW1lIHx8IGBcdTY1NzBcdTYzNkVcdTZFOTAgJHtkYXRhLmRhdGFTb3VyY2VJZH1gLFxuICAgICAgcXVlcnlUeXBlOiBkYXRhLnF1ZXJ5VHlwZSB8fCAnU1FMJyxcbiAgICAgIHF1ZXJ5VGV4dDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzIHx8ICdEUkFGVCcsXG4gICAgICBzZXJ2aWNlU3RhdHVzOiBkYXRhLnNlcnZpY2VTdGF0dXMgfHwgJ0RJU0FCTEVEJyxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICBjcmVhdGVkQnk6IGRhdGEuY3JlYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICB1cGRhdGVkQnk6IGRhdGEudXBkYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICBleGVjdXRpb25Db3VudDogMCxcbiAgICAgIGlzRmF2b3JpdGU6IGRhdGEuaXNGYXZvcml0ZSB8fCBmYWxzZSxcbiAgICAgIGlzQWN0aXZlOiBkYXRhLmlzQWN0aXZlIHx8IHRydWUsXG4gICAgICBsYXN0RXhlY3V0ZWRBdDogbnVsbCxcbiAgICAgIHJlc3VsdENvdW50OiAwLFxuICAgICAgZXhlY3V0aW9uVGltZTogMCxcbiAgICAgIHRhZ3M6IGRhdGEudGFncyB8fCBbXSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NTIxRFx1NTlDQlx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQsXG4gICAgICAgIHN0YXR1czogJ0RSQUZUJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9LFxuICAgICAgdmVyc2lvbnM6IFt7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NTIxRFx1NTlDQlx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQsXG4gICAgICAgIHN0YXR1czogJ0RSQUZUJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9XVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU1MjE3XHU4ODY4XG4gICAgbW9ja1F1ZXJpZXMucHVzaChuZXdRdWVyeSk7XG4gICAgXG4gICAgcmV0dXJuIG5ld1F1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgdXBkYXRlUXVlcnkoaWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU4OTgxXHU2NkY0XHU2NUIwXHU3Njg0XHU2N0U1XHU4QkUyXHU3RDIyXHU1RjE1XG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHVwZGF0ZWRRdWVyeSA9IHtcbiAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRCeTogZGF0YS51cGRhdGVkQnkgfHwgbW9ja1F1ZXJpZXNbaW5kZXhdLnVwZGF0ZWRCeSB8fCB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9XG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY2RkZcdTYzNjJcdTY3RTVcdThCRTJcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB1cGRhdGVkUXVlcnk7XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRRdWVyeTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGRlbGV0ZVF1ZXJ5KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU4OTgxXHU1MjIwXHU5NjY0XHU3Njg0XHU2N0U1XHU4QkUyXHU3RDIyXHU1RjE1XG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgIG1vY2tRdWVyaWVzLnNwbGljZShpbmRleCwgMSk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBleGVjdXRlUXVlcnkoaWQ6IHN0cmluZywgcGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTdFRDNcdTY3OUNcbiAgICBjb25zdCBjb2x1bW5zID0gWydpZCcsICduYW1lJywgJ2VtYWlsJywgJ3N0YXR1cycsICdjcmVhdGVkX2F0J107XG4gICAgY29uc3Qgcm93cyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiAoe1xuICAgICAgaWQ6IGkgKyAxLFxuICAgICAgbmFtZTogYFx1NzUyOFx1NjIzNyAke2kgKyAxfWAsXG4gICAgICBlbWFpbDogYHVzZXIke2kgKyAxfUBleGFtcGxlLmNvbWAsXG4gICAgICBzdGF0dXM6IGkgJSAyID09PSAwID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnLFxuICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKVxuICAgIH0pKTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTYyNjdcdTg4NENcdTdFREZcdThCQTFcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgICAgZXhlY3V0aW9uQ291bnQ6IChtb2NrUXVlcmllc1tpbmRleF0uZXhlY3V0aW9uQ291bnQgfHwgMCkgKyAxLFxuICAgICAgICBsYXN0RXhlY3V0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICByZXN1bHRDb3VudDogcm93cy5sZW5ndGhcbiAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBjb2x1bW5zLFxuICAgICAgcm93cyxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIGV4ZWN1dGlvblRpbWU6IE1hdGgucmFuZG9tKCkgKiAwLjUgKyAwLjEsXG4gICAgICAgIHJvd0NvdW50OiByb3dzLmxlbmd0aCxcbiAgICAgICAgdG90YWxQYWdlczogMVxuICAgICAgfSxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGlkOiBxdWVyeS5pZCxcbiAgICAgICAgbmFtZTogcXVlcnkubmFtZSxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBxdWVyeS5kYXRhU291cmNlSWRcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIwN1x1NjM2Mlx1NjdFNVx1OEJFMlx1NjUzNlx1ODVDRlx1NzJCNlx1NjAwMVxuICAgKi9cbiAgYXN5bmMgdG9nZ2xlRmF2b3JpdGUoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMDdcdTYzNjJcdTY1MzZcdTg1Q0ZcdTcyQjZcdTYwMDFcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAuLi5tb2NrUXVlcmllc1tpbmRleF0sXG4gICAgICBpc0Zhdm9yaXRlOiAhbW9ja1F1ZXJpZXNbaW5kZXhdLmlzRmF2b3JpdGUsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIG1vY2tRdWVyaWVzW2luZGV4XTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUzODZcdTUzRjJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5SGlzdG9yeShwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTUzODZcdTUzRjJcdThCQjBcdTVGNTVcbiAgICBjb25zdCB0b3RhbEl0ZW1zID0gMjA7XG4gICAgY29uc3QgaGlzdG9yaWVzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogdG90YWxJdGVtcyB9LCAoXywgaSkgPT4ge1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiAzNjAwMDAwKS50b0lTT1N0cmluZygpO1xuICAgICAgY29uc3QgcXVlcnlJbmRleCA9IGkgJSBtb2NrUXVlcmllcy5sZW5ndGg7XG4gICAgICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBgaGlzdC0ke2kgKyAxfWAsXG4gICAgICAgIHF1ZXJ5SWQ6IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdLmlkLFxuICAgICAgICBxdWVyeU5hbWU6IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdLm5hbWUsXG4gICAgICAgIGV4ZWN1dGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5yYW5kb20oKSAqIDAuNSArIDAuMSxcbiAgICAgICAgcm93Q291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyAxLFxuICAgICAgICB1c2VySWQ6ICd1c2VyMScsXG4gICAgICAgIHVzZXJOYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyxcbiAgICAgICAgc3RhdHVzOiBpICUgOCA9PT0gMCA/ICdGQUlMRUQnIDogJ1NVQ0NFU1MnLFxuICAgICAgICBlcnJvck1lc3NhZ2U6IGkgJSA4ID09PSAwID8gJ1x1NjdFNVx1OEJFMlx1NjI2N1x1ODg0Q1x1OEQ4NVx1NjVGNicgOiBudWxsXG4gICAgICB9O1xuICAgIH0pO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCB0b3RhbEl0ZW1zKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGhpc3Rvcmllcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICB0b3RhbDogdG90YWxJdGVtcyxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsSXRlbXMgLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyeVZlcnNpb25zKHF1ZXJ5SWQ6IHN0cmluZywgcGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgXG4gICAgaWYgKCFxdWVyeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7cXVlcnlJZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XG4gICAgcmV0dXJuIHF1ZXJ5LnZlcnNpb25zIHx8IFtdO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBxdWVyeUlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTcyNDhcdTY3MkNcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzW2luZGV4XTtcbiAgICBjb25zdCBuZXdWZXJzaW9uTnVtYmVyID0gKHF1ZXJ5LnZlcnNpb25zPy5sZW5ndGggfHwgMCkgKyAxO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICBjb25zdCBuZXdWZXJzaW9uID0ge1xuICAgICAgaWQ6IGB2ZXItJHtxdWVyeUlkfS0ke25ld1ZlcnNpb25OdW1iZXJ9YCxcbiAgICAgIHF1ZXJ5SWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiBuZXdWZXJzaW9uTnVtYmVyLFxuICAgICAgbmFtZTogZGF0YS5uYW1lIHx8IGBcdTcyNDhcdTY3MkMgJHtuZXdWZXJzaW9uTnVtYmVyfWAsXG4gICAgICBzcWw6IGRhdGEuc3FsIHx8IHF1ZXJ5LnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQgfHwgcXVlcnkuZGF0YVNvdXJjZUlkLFxuICAgICAgc3RhdHVzOiAnRFJBRlQnLFxuICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU0RTRCXHU1MjREXHU3MjQ4XHU2NzJDXHU3Njg0aXNMYXRlc3RcdTY4MDdcdTVGRDdcbiAgICBpZiAocXVlcnkudmVyc2lvbnMgJiYgcXVlcnkudmVyc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgcXVlcnkudmVyc2lvbnMgPSBxdWVyeS52ZXJzaW9ucy5tYXAodiA9PiAoe1xuICAgICAgICAuLi52LFxuICAgICAgICBpc0xhdGVzdDogZmFsc2VcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU2NUIwXHU3MjQ4XHU2NzJDXG4gICAgaWYgKCFxdWVyeS52ZXJzaW9ucykge1xuICAgICAgcXVlcnkudmVyc2lvbnMgPSBbXTtcbiAgICB9XG4gICAgcXVlcnkudmVyc2lvbnMucHVzaChuZXdWZXJzaW9uKTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkNcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiBuZXdWZXJzaW9uLFxuICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBuZXdWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTNEMVx1NUUwM1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgcHVibGlzaFF1ZXJ5VmVyc2lvbih2ZXJzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NTMwNVx1NTQyQlx1NkI2NFx1NzI0OFx1NjcyQ1x1NzY4NFx1NjdFNVx1OEJFMlxuICAgIGxldCBxdWVyeSA9IG51bGw7XG4gICAgbGV0IHZlcnNpb25JbmRleCA9IC0xO1xuICAgIGxldCBxdWVyeUluZGV4ID0gLTE7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2NrUXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zKSB7XG4gICAgICAgIGNvbnN0IHZJbmRleCA9IG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zLmZpbmRJbmRleCh2ID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgICAgIGlmICh2SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgcXVlcnkgPSBtb2NrUXVlcmllc1tpXTtcbiAgICAgICAgICB2ZXJzaW9uSW5kZXggPSB2SW5kZXg7XG4gICAgICAgICAgcXVlcnlJbmRleCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKCFxdWVyeSB8fCB2ZXJzaW9uSW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHt2ZXJzaW9uSWR9XHU3Njg0XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NzI0OFx1NjcyQ1x1NzJCNlx1NjAwMVxuICAgIGNvbnN0IHVwZGF0ZWRWZXJzaW9uID0ge1xuICAgICAgLi4ucXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBwdWJsaXNoZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdID0gdXBkYXRlZFZlcnNpb247XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU3MkI2XHU2MDAxXG4gICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBjdXJyZW50VmVyc2lvbjogdXBkYXRlZFZlcnNpb24sXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NUU5Rlx1NUYwM1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgZGVwcmVjYXRlUXVlcnlWZXJzaW9uKHZlcnNpb25JZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU1MzA1XHU1NDJCXHU2QjY0XHU3MjQ4XHU2NzJDXHU3Njg0XHU2N0U1XHU4QkUyXG4gICAgbGV0IHF1ZXJ5ID0gbnVsbDtcbiAgICBsZXQgdmVyc2lvbkluZGV4ID0gLTE7XG4gICAgbGV0IHF1ZXJ5SW5kZXggPSAtMTtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vY2tRdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMpIHtcbiAgICAgICAgY29uc3QgdkluZGV4ID0gbW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMuZmluZEluZGV4KHYgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICAgICAgaWYgKHZJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBxdWVyeSA9IG1vY2tRdWVyaWVzW2ldO1xuICAgICAgICAgIHZlcnNpb25JbmRleCA9IHZJbmRleDtcbiAgICAgICAgICBxdWVyeUluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoIXF1ZXJ5IHx8IHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU3MjQ4XHU2NzJDXHU3MkI2XHU2MDAxXG4gICAgY29uc3QgdXBkYXRlZFZlcnNpb24gPSB7XG4gICAgICAuLi5xdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdLFxuICAgICAgc3RhdHVzOiAnREVQUkVDQVRFRCcsXG4gICAgICBkZXByZWNhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSA9IHVwZGF0ZWRWZXJzaW9uO1xuICAgIFxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NUU5Rlx1NUYwM1x1NzY4NFx1NjYyRlx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1x1RkYwQ1x1NTIxOVx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NzJCNlx1NjAwMVxuICAgIGlmIChxdWVyeS5jdXJyZW50VmVyc2lvbiAmJiBxdWVyeS5jdXJyZW50VmVyc2lvbi5pZCA9PT0gdmVyc2lvbklkKSB7XG4gICAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgICAgLi4ucXVlcnksXG4gICAgICAgIHN0YXR1czogJ0RFUFJFQ0FURUQnLFxuICAgICAgICBjdXJyZW50VmVyc2lvbjogdXBkYXRlZFZlcnNpb24sXG4gICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgICAgLi4ucXVlcnksXG4gICAgICAgIHZlcnNpb25zOiBxdWVyeS52ZXJzaW9ucyxcbiAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB1cGRhdGVkVmVyc2lvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTZGQzBcdTZEM0JcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgICovXG4gIGFzeW5jIGFjdGl2YXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQ6IHN0cmluZywgdmVyc2lvbklkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeUluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgXG4gICAgaWYgKHF1ZXJ5SW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NzI0OFx1NjcyQ1xuICAgIGlmICghcXVlcnkudmVyc2lvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2N0U1XHU4QkUyICR7cXVlcnlJZH0gXHU2Q0ExXHU2NzA5XHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHZlcnNpb25JbmRleCA9IHF1ZXJ5LnZlcnNpb25zLmZpbmRJbmRleCh2ID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgXG4gICAgaWYgKHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU4OTgxXHU2RkMwXHU2RDNCXHU3Njg0XHU3MjQ4XHU2NzJDXG4gICAgY29uc3QgdmVyc2lvblRvQWN0aXZhdGUgPSBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1x1NTQ4Q1x1NjdFNVx1OEJFMlx1NzJCNlx1NjAwMVxuICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgLi4ucXVlcnksXG4gICAgICBjdXJyZW50VmVyc2lvbjogdmVyc2lvblRvQWN0aXZhdGUsXG4gICAgICBzdGF0dXM6IHZlcnNpb25Ub0FjdGl2YXRlLnN0YXR1cyxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdmVyc2lvblRvQWN0aXZhdGU7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHF1ZXJ5U2VydmljZTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTk2QzZcdTRFMkRcdTVCRkNcdTUxRkFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0QVBJIE1vY2tcdTY3MERcdTUyQTFcdTUxNjVcdTUzRTNcdTcwQjlcbiAqL1xuXG4vLyBcdTVCRkNcdTUxNjVcdTY1NzBcdTYzNkVcdTZFOTBcdTY3MERcdTUyQTFcbmltcG9ydCBkYXRhU291cmNlIGZyb20gJy4vZGF0YXNvdXJjZSc7XG4vLyBcdTVCRkNcdTUxNjVcdTVCOENcdTY1NzRcdTc2ODRcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFcdTVCOUVcdTczQjBcbmltcG9ydCBxdWVyeVNlcnZpY2VJbXBsZW1lbnRhdGlvbiBmcm9tICcuL3F1ZXJ5JztcblxuLy8gXHU1QkZDXHU1MTY1XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG5pbXBvcnQgeyBcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLCBcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsIFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5IFxufSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFNb2NrXG4gKiBAZGVwcmVjYXRlZCBcdTRGN0ZcdTc1MjhcdTRFQ0UgJy4vcXVlcnknIFx1NUJGQ1x1NTE2NVx1NzY4NFx1NUI4Q1x1NjU3NFx1NUI5RVx1NzNCMFx1NEVFM1x1NjZGRlxuICovXG5jb25zdCBxdWVyeSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcmllcyhwYXJhbXM6IHsgcGFnZTogbnVtYmVyOyBzaXplOiBudW1iZXI7IH0pIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2Uoe1xuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBpZDogJ3ExJywgbmFtZTogJ1x1NzUyOFx1NjIzN1x1NTIwNlx1Njc5MFx1NjdFNVx1OEJFMicsIGRlc2NyaXB0aW9uOiAnXHU2MzA5XHU1NzMwXHU1MzNBXHU3RURGXHU4QkExXHU3NTI4XHU2MjM3XHU2Q0U4XHU1MThDXHU2NTcwXHU2MzZFJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgICAgeyBpZDogJ3EyJywgbmFtZTogJ1x1OTUwMFx1NTUyRVx1NEUxQVx1N0VFOVx1NjdFNVx1OEJFMicsIGRlc2NyaXB0aW9uOiAnXHU2MzA5XHU2NzA4XHU3RURGXHU4QkExXHU5NTAwXHU1NTJFXHU5ODlEJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgICAgeyBpZDogJ3EzJywgbmFtZTogJ1x1NUU5M1x1NUI1OFx1NTIwNlx1Njc5MCcsIGRlc2NyaXB0aW9uOiAnXHU3NkQxXHU2M0E3XHU1RTkzXHU1QjU4XHU2QzM0XHU1RTczJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgIF0sXG4gICAgICB0b3RhbDogMyxcbiAgICAgIHBhZ2U6IHBhcmFtcy5wYWdlLFxuICAgICAgc2l6ZTogcGFyYW1zLnNpemVcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBnZXRRdWVyeShpZDogc3RyaW5nKSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQsXG4gICAgICBuYW1lOiAnXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyJyxcbiAgICAgIHNxbDogJ1NFTEVDVCAqIEZST00gdXNlcnMgV0hFUkUgc3RhdHVzID0gJDEnLFxuICAgICAgcGFyYW1ldGVyczogWydhY3RpdmUnXSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGNyZWF0ZVF1ZXJ5KGRhdGE6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBgcXVlcnktJHtEYXRlLm5vdygpfWAsXG4gICAgICAuLi5kYXRhLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgdXBkYXRlUXVlcnkoaWQ6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQsXG4gICAgICAuLi5kYXRhLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGRlbGV0ZVF1ZXJ5KGlkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBleGVjdXRlUXVlcnkoaWQ6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBjb2x1bW5zOiBbJ2lkJywgJ25hbWUnLCAnZW1haWwnLCAnc3RhdHVzJ10sXG4gICAgICByb3dzOiBbXG4gICAgICAgIHsgaWQ6IDEsIG5hbWU6ICdcdTVGMjBcdTRFMDknLCBlbWFpbDogJ3poYW5nQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICAgICAgICB7IGlkOiAyLCBuYW1lOiAnXHU2NzRFXHU1NkRCJywgZW1haWw6ICdsaUBleGFtcGxlLmNvbScsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgICAgICAgeyBpZDogMywgbmFtZTogJ1x1NzM4Qlx1NEU5NCcsIGVtYWlsOiAnd2FuZ0BleGFtcGxlLmNvbScsIHN0YXR1czogJ2luYWN0aXZlJyB9LFxuICAgICAgXSxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIGV4ZWN1dGlvblRpbWU6IDAuMjM1LFxuICAgICAgICByb3dDb3VudDogMyxcbiAgICAgICAgdG90YWxQYWdlczogMVxuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG5cbi8qKlxuICogXHU1QkZDXHU1MUZBXHU2MjQwXHU2NzA5XHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IHNlcnZpY2VzID0ge1xuICBkYXRhU291cmNlLFxuICBxdWVyeTogcXVlcnlTZXJ2aWNlSW1wbGVtZW50YXRpb25cbn07XG5cbi8vIFx1NUJGQ1x1NTFGQW1vY2sgc2VydmljZVx1NURFNVx1NTE3N1xuZXhwb3J0IHtcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSxcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheVxufTtcblxuLy8gXHU1QkZDXHU1MUZBXHU1NDA0XHU0RTJBXHU2NzBEXHU1MkExXG5leHBvcnQgY29uc3QgZGF0YVNvdXJjZVNlcnZpY2UgPSBzZXJ2aWNlcy5kYXRhU291cmNlO1xuZXhwb3J0IGNvbnN0IHF1ZXJ5U2VydmljZSA9IHNlcnZpY2VzLnF1ZXJ5O1xuXG4vLyBcdTlFRDhcdThCQTRcdTVCRkNcdTUxRkFcdTYyNDBcdTY3MDlcdTY3MERcdTUyQTFcbmV4cG9ydCBkZWZhdWx0IHNlcnZpY2VzOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzXCI7aW1wb3J0IHsgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTRFMDBcdTRFMkFcdTdCODBcdTUzNTVcdTc2ODRcdTZENEJcdThCRDVcdTRFMkRcdTk1RjRcdTRFRjZcbiAqIFx1NTNFQVx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFx1RkYwQ1x1NzUyOFx1NEU4RVx1NkQ0Qlx1OEJENU1vY2tcdTdDRkJcdTdFREZcdTY2MkZcdTU0MjZcdTZCNjNcdTVFMzhcdTVERTVcdTRGNUNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUoKSB7XG4gIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTVERjJcdTUyMUJcdTVFRkFcdTZENEJcdThCRDVcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTVDMDZcdTU5MDRcdTc0MDYvYXBpL3Rlc3RcdThERUZcdTVGODRcdTc2ODRcdThCRjdcdTZDNDInKTtcbiAgXG4gIHJldHVybiBmdW5jdGlvbiBzaW1wbGVNaWRkbGV3YXJlKFxuICAgIHJlcTogaHR0cC5JbmNvbWluZ01lc3NhZ2UsXG4gICAgcmVzOiBodHRwLlNlcnZlclJlc3BvbnNlLFxuICAgIG5leHQ6IENvbm5lY3QuTmV4dEZ1bmN0aW9uXG4gICkge1xuICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZCB8fCAnVU5LTk9XTic7XG4gICAgXG4gICAgLy8gXHU1M0VBXHU1OTA0XHU3NDA2L2FwaS90ZXN0XHU4REVGXHU1Rjg0XG4gICAgaWYgKHVybCA9PT0gJy9hcGkvdGVzdCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTY1MzZcdTUyMzBcdTZENEJcdThCRDVcdThCRjdcdTZDNDI6ICR7bWV0aG9kfSAke3VybH1gKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gXHU4QkJFXHU3RjZFQ09SU1x1NTkzNFxuICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIE9QVElPTlMnKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycycsICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24nKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTkwNFx1NzQwNk9QVElPTlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDJcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NTkwNFx1NzQwNk9QVElPTlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDInKTtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwNDtcbiAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTc4NkVcdTRGRERcdTg5ODZcdTc2RDZcdTYzODlcdTYyNDBcdTY3MDlcdTVERjJcdTY3MDlcdTc2ODRDb250ZW50LVR5cGVcdUZGMENcdTkwN0ZcdTUxNERcdTg4QUJcdTU0MEVcdTdFRURcdTRFMkRcdTk1RjRcdTRFRjZcdTY2RjRcdTY1MzlcbiAgICAgICAgcmVzLnJlbW92ZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1MUM2XHU1OTA3XHU1NENEXHU1RTk0XHU2NTcwXHU2MzZFXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdcdTdCODBcdTUzNTVcdTZENEJcdThCRDVcdTRFMkRcdTk1RjRcdTRFRjZcdTU0Q0RcdTVFOTRcdTYyMTBcdTUyOUYnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICBoZWFkZXJzOiByZXEuaGVhZGVycyxcbiAgICAgICAgICAgIHBhcmFtczogdXJsLmluY2x1ZGVzKCc/JykgPyB1cmwuc3BsaXQoJz8nKVsxXSA6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvLyBcdTUzRDFcdTkwMDFcdTU0Q0RcdTVFOTRcdTUyNERcdTc4NkVcdTRGRERcdTRFMkRcdTY1QURcdThCRjdcdTZDNDJcdTk0RkVcbiAgICAgICAgY29uc29sZS5sb2coJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NTNEMVx1OTAwMVx1NkQ0Qlx1OEJENVx1NTRDRFx1NUU5NCcpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlRGF0YSwgbnVsbCwgMikpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU0RTBEXHU4QzAzXHU3NTI4bmV4dCgpXHVGRjBDXHU3ODZFXHU0RkREXHU4QkY3XHU2QzQyXHU1MjMwXHU2QjY0XHU3RUQzXHU2NzVGXG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIFx1NTkwNFx1NzQwNlx1OTUxOVx1OEJFRlxuICAgICAgICBjb25zb2xlLmVycm9yKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTY1RjZcdTUxRkFcdTk1MTk6JywgZXJyb3IpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU2RTA1XHU5NjY0XHU1REYyXHU2NzA5XHU3Njg0XHU1OTM0XHVGRjBDXHU5MDdGXHU1MTREQ29udGVudC1UeXBlXHU4OEFCXHU2NkY0XHU2NTM5XG4gICAgICAgIHJlcy5yZW1vdmVIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogJ1x1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NjVGNlx1NTFGQVx1OTUxOScsXG4gICAgICAgICAgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKVxuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTRFMERcdThDMDNcdTc1MjhuZXh0KClcdUZGMENcdTc4NkVcdTRGRERcdThCRjdcdTZDNDJcdTUyMzBcdTZCNjRcdTdFRDNcdTY3NUZcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTRFMERcdTU5MDRcdTc0MDZcdTc2ODRcdThCRjdcdTZDNDJcdTRFQTRcdTdFRDlcdTRFMEJcdTRFMDBcdTRFMkFcdTRFMkRcdTk1RjRcdTRFRjZcbiAgICBuZXh0KCk7XG4gIH07XG59ICJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFksU0FBUyxjQUFjLGVBQWdDO0FBQ2pjLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsU0FBUyxnQkFBZ0I7QUFDekIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxrQkFBa0I7OztBQ0l6QixTQUFTLGFBQWE7OztBQ0ZmLFNBQVMsWUFBcUI7QUFDbkMsTUFBSTtBQUVGLFFBQUksT0FBTyxZQUFZLGVBQWUsUUFBUSxLQUFLO0FBQ2pELFVBQUksUUFBUSxJQUFJLHNCQUFzQixRQUFRO0FBQzVDLGVBQU87QUFBQSxNQUNUO0FBQ0EsVUFBSSxRQUFRLElBQUksc0JBQXNCLFNBQVM7QUFDN0MsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBR0EsUUFBSSxPQUFPLGdCQUFnQixlQUFlLFlBQVksS0FBSztBQUN6RCxVQUFJLFlBQVksSUFBSSxzQkFBc0IsUUFBUTtBQUNoRCxlQUFPO0FBQUEsTUFDVDtBQUNBLFVBQUksWUFBWSxJQUFJLHNCQUFzQixTQUFTO0FBQ2pELGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFFBQUksT0FBTyxXQUFXLGVBQWUsT0FBTyxjQUFjO0FBQ3hELFlBQU0sb0JBQW9CLGFBQWEsUUFBUSxjQUFjO0FBQzdELFVBQUksc0JBQXNCLFFBQVE7QUFDaEMsZUFBTztBQUFBLE1BQ1Q7QUFDQSxVQUFJLHNCQUFzQixTQUFTO0FBQ2pDLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFVBQU0sZ0JBQ0gsT0FBTyxZQUFZLGVBQWUsUUFB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QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxlQUFlO0FBQUEsUUFDakI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBO0FBQUEsTUFFWixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsU0FBUztBQUFBO0FBQUEsUUFFUDtBQUFBO0FBQUEsUUFFQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsT0FBTztBQUFBLElBQ1Q7QUFBQTtBQUFBLElBRUEsVUFBVTtBQUFBO0FBQUEsSUFFVixTQUFTO0FBQUEsTUFDUCxhQUFhO0FBQUEsUUFDWCw0QkFBNEI7QUFBQSxNQUM5QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsiZGVsYXkiLCAic2ltdWxhdGVEZWxheSIsICJxdWVyeVNlcnZpY2UiLCAiZGVsYXkiLCAicXVlcnlTZXJ2aWNlIl0KfQo=
