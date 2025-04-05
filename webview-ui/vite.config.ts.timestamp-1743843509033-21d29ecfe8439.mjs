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
      if (!url.includes("/api/")) {
        return next();
      }
      let processedUrl = url;
      if (url.includes("/api/api/")) {
        processedUrl = url.replace(/\/api\/api\//g, "/api/");
        logMock("debug", `\u68C0\u6D4B\u5230\u91CD\u590D\u7684API\u8DEF\u5F84\uFF0C\u5DF2\u4FEE\u6B63: ${url} -> ${processedUrl}`);
        req.url = processedUrl;
      }
      console.log(`[Mock] \u5904\u7406API\u8BF7\u6C42: ${req.method} ${processedUrl}`);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50cyIsICJzcmMvbW9jay9jb25maWcudHMiLCAic3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHMiLCAic3JjL21vY2svc2VydmljZXMvdXRpbHMudHMiLCAic3JjL21vY2svc2VydmljZXMvcXVlcnkudHMiLCAic3JjL21vY2svc2VydmljZXMvaW5kZXgudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYsIFBsdWdpbiwgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAndGFpbHdpbmRjc3MnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcbmltcG9ydCBjcmVhdGVNb2NrTWlkZGxld2FyZSBmcm9tICcuL3NyYy9tb2NrL21pZGRsZXdhcmUnXG5pbXBvcnQgeyBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlIH0gZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZSdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCdcblxuLy8gXHU1RjNBXHU1MjM2XHU5MUNBXHU2NTNFXHU3QUVGXHU1M0UzXHU1MUZEXHU2NTcwXG5mdW5jdGlvbiBraWxsUG9ydChwb3J0OiBudW1iZXIpIHtcbiAgY29uc29sZS5sb2coYFtWaXRlXSBcdTY4QzBcdTY3RTVcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTUzNjBcdTc1MjhcdTYwQzVcdTUxQjVgKTtcbiAgdHJ5IHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgZXhlY1N5bmMoYG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH1gKTtcbiAgICAgIGV4ZWNTeW5jKGB0YXNra2lsbCAvRiAvcGlkICQobmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fSB8IGF3ayAne3ByaW50ICQ1fScpYCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBleGVjU3luYyhgbHNvZiAtaSA6JHtwb3J0fSAtdCB8IHhhcmdzIGtpbGwgLTlgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU1REYyXHU5MUNBXHU2NTNFXHU3QUVGXHU1M0UzICR7cG9ydH1gKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU3QUVGXHU1M0UzICR7cG9ydH0gXHU2NzJBXHU4OEFCXHU1MzYwXHU3NTI4XHU2MjE2XHU2NUUwXHU2Q0Q1XHU5MUNBXHU2NTNFYCk7XG4gIH1cbn1cblxuLy8gXHU1RjNBXHU1MjM2XHU2RTA1XHU3NDA2Vml0ZVx1N0YxM1x1NUI1OFxuZnVuY3Rpb24gY2xlYW5WaXRlQ2FjaGUoKSB7XG4gIGNvbnNvbGUubG9nKCdbVml0ZV0gXHU2RTA1XHU3NDA2XHU0RjlEXHU4RDU2XHU3RjEzXHU1QjU4Jyk7XG4gIGNvbnN0IGNhY2hlUGF0aHMgPSBbXG4gICAgJy4vbm9kZV9tb2R1bGVzLy52aXRlJyxcbiAgICAnLi9ub2RlX21vZHVsZXMvLnZpdGVfKicsXG4gICAgJy4vLnZpdGUnLFxuICAgICcuL2Rpc3QnLFxuICAgICcuL3RtcCcsXG4gICAgJy4vLnRlbXAnXG4gIF07XG4gIFxuICBjYWNoZVBhdGhzLmZvckVhY2goY2FjaGVQYXRoID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoY2FjaGVQYXRoKSkge1xuICAgICAgICBpZiAoZnMubHN0YXRTeW5jKGNhY2hlUGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgIGV4ZWNTeW5jKGBybSAtcmYgJHtjYWNoZVBhdGh9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMudW5saW5rU3luYyhjYWNoZVBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU1REYyXHU1MjIwXHU5NjY0OiAke2NhY2hlUGF0aH1gKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjVFMFx1NkNENVx1NTIyMFx1OTY2NDogJHtjYWNoZVBhdGh9YCwgZSk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gXHU2RTA1XHU3NDA2Vml0ZVx1N0YxM1x1NUI1OFxuY2xlYW5WaXRlQ2FjaGUoKTtcblxuLy8gXHU1QzFEXHU4QkQ1XHU5MUNBXHU2NTNFXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU3QUVGXHU1M0UzXG5raWxsUG9ydCg4MDgwKTtcblxuLy8gXHU1MjFCXHU1RUZBTW9jayBBUElcdTYzRDJcdTRFRjZcbmZ1bmN0aW9uIGNyZWF0ZU1vY2tBcGlQbHVnaW4odXNlTW9jazogYm9vbGVhbiwgdXNlU2ltcGxlTW9jazogYm9vbGVhbik6IFBsdWdpbiB8IG51bGwge1xuICBpZiAoIXVzZU1vY2sgJiYgIXVzZVNpbXBsZU1vY2spIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBcbiAgLy8gXHU1MkEwXHU4RjdEXHU0RTJEXHU5NUY0XHU0RUY2XG4gIGNvbnN0IG1vY2tNaWRkbGV3YXJlID0gdXNlTW9jayA/IGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCkgOiBudWxsO1xuICBjb25zdCBzaW1wbGVNaWRkbGV3YXJlID0gdXNlU2ltcGxlTW9jayA/IGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUoKSA6IG51bGw7XG4gIFxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLXBsdWdpbi1tb2NrLWFwaScsXG4gICAgLy8gXHU1MTczXHU5NTJFXHU3MEI5XHVGRjFBXHU0RjdGXHU3NTI4IHByZSBcdTc4NkVcdTRGRERcdTZCNjRcdTYzRDJcdTRFRjZcdTUxNDhcdTRFOEVcdTUxODVcdTdGNkVcdTYzRDJcdTRFRjZcdTYyNjdcdTg4NENcbiAgICBlbmZvcmNlOiAncHJlJyBhcyBjb25zdCxcbiAgICAvLyBcdTU3MjhcdTY3MERcdTUyQTFcdTU2NjhcdTUyMUJcdTVFRkFcdTRFNEJcdTUyNERcdTkxNERcdTdGNkVcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAvLyBcdTY2RkZcdTYzNjJcdTUzOUZcdTU5Q0JcdThCRjdcdTZDNDJcdTU5MDRcdTc0MDZcdTU2NjhcdUZGMENcdTRGN0ZcdTYyMTFcdTRFRUNcdTc2ODRcdTRFMkRcdTk1RjRcdTRFRjZcdTUxNzdcdTY3MDlcdTY3MDBcdTlBRDhcdTRGMThcdTUxNDhcdTdFQTdcbiAgICAgIGNvbnN0IG9yaWdpbmFsSGFuZGxlciA9IHNlcnZlci5taWRkbGV3YXJlcy5oYW5kbGU7XG4gICAgICBcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy5oYW5kbGUgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1M0VBXHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aCgnL2FwaS8nKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU2OEMwXHU2RDRCXHU1MjMwQVBJXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsfWApO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1NEYxOFx1NTE0OFx1NTkwNFx1NzQwNlx1NzI3OVx1NUI5QVx1NkQ0Qlx1OEJENUFQSVxuICAgICAgICAgIGlmICh1c2VTaW1wbGVNb2NrICYmIHNpbXBsZU1pZGRsZXdhcmUgJiYgdXJsLnN0YXJ0c1dpdGgoJy9hcGkvdGVzdCcpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTYzRDJcdTRFRjZdIFx1NEY3Rlx1NzUyOFx1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNjogJHt1cmx9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFx1OEJCRVx1N0Y2RVx1NEUwMFx1NEUyQVx1NjgwN1x1OEJCMFx1RkYwQ1x1OTYzMlx1NkI2Mlx1NTE3Nlx1NEVENlx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgKHJlcSBhcyBhbnkpLl9tb2NrSGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBzaW1wbGVNaWRkbGV3YXJlKHJlcSwgcmVzLCAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTUxRkFcdTk1MTk6YCwgZXJyKTtcbiAgICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIShyZXMgYXMgU2VydmVyUmVzcG9uc2UpLndyaXRhYmxlRW5kZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTU0Q0RcdTVFOTRcdTZDQTFcdTY3MDlcdTdFRDNcdTY3NUZcdUZGMENcdTdFRTdcdTdFRURcdTU5MDRcdTc0MDZcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTUxNzZcdTRFRDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgICBpZiAodXNlTW9jayAmJiBtb2NrTWlkZGxld2FyZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTRGN0ZcdTc1MjhNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2OiAke3VybH1gKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU4QkJFXHU3RjZFXHU0RTAwXHU0RTJBXHU2ODA3XHU4QkIwXHVGRjBDXHU5NjMyXHU2QjYyXHU1MTc2XHU0RUQ2XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyXG4gICAgICAgICAgICAocmVxIGFzIGFueSkuX21vY2tIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG1vY2tNaWRkbGV3YXJlKHJlcSwgcmVzLCAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtNb2NrXHU2M0QyXHU0RUY2XSBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU1MUZBXHU5NTE5OmAsIGVycik7XG4gICAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEocmVzIGFzIFNlcnZlclJlc3BvbnNlKS53cml0YWJsZUVuZGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NENEXHU1RTk0XHU2Q0ExXHU2NzA5XHU3RUQzXHU2NzVGXHVGRjBDXHU3RUU3XHU3RUVEXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1NUJGOVx1NEU4RVx1OTc1RUFQSVx1OEJGN1x1NkM0Mlx1RkYwQ1x1NEY3Rlx1NzUyOFx1NTM5Rlx1NTlDQlx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgICByZXR1cm4gb3JpZ2luYWxIYW5kbGVyLmNhbGwoc2VydmVyLm1pZGRsZXdhcmVzLCByZXEsIHJlcywgbmV4dCk7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxuLy8gXHU1N0ZBXHU2NzJDXHU5MTREXHU3RjZFXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIC8vIFx1NTJBMFx1OEY3RFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxuICBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJIHx8ICdmYWxzZSc7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9jayBBUEkgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgdXNlTW9ja0FwaSA9IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZSc7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTc5ODFcdTc1MjhITVIgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgZGlzYWJsZUhtciA9IHByb2Nlc3MuZW52LlZJVEVfRElTQUJMRV9ITVIgPT09ICd0cnVlJztcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1NEY3Rlx1NzUyOFx1N0I4MFx1NTM1NVx1NkQ0Qlx1OEJENVx1NkEyMVx1NjJERkFQSVxuICBjb25zdCB1c2VTaW1wbGVNb2NrID0gdHJ1ZTtcbiAgXG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gXHU4RkQwXHU4ODRDXHU2QTIxXHU1RjBGOiAke21vZGV9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gTW9jayBBUEk6ICR7dXNlTW9ja0FwaSA/ICdcdTU0MkZcdTc1MjgnIDogJ1x1Nzk4MVx1NzUyOCd9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gXHU3QjgwXHU1MzU1TW9ja1x1NkQ0Qlx1OEJENTogJHt1c2VTaW1wbGVNb2NrID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFNb2NrXHU2M0QyXHU0RUY2XG4gIGNvbnN0IG1vY2tQbHVnaW4gPSBjcmVhdGVNb2NrQXBpUGx1Z2luKHVzZU1vY2tBcGksIHVzZVNpbXBsZU1vY2spO1xuICBcbiAgLy8gXHU5MTREXHU3RjZFXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgLy8gXHU2REZCXHU1MkEwTW9ja1x1NjNEMlx1NEVGNlx1RkYwOFx1NTk4Mlx1Njc5Q1x1NTQyRlx1NzUyOFx1RkYwOVxuICAgICAgLi4uKG1vY2tQbHVnaW4gPyBbbW9ja1BsdWdpbl0gOiBbXSksXG4gICAgICB2dWUoKSxcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogODA4MCxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgLy8gSE1SXHU5MTREXHU3RjZFXG4gICAgICBobXI6IGRpc2FibGVIbXIgPyBmYWxzZSA6IHtcbiAgICAgICAgcHJvdG9jb2w6ICd3cycsXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBjbGllbnRQb3J0OiA4MDgwLFxuICAgICAgfSxcbiAgICAgIC8vIFx1Nzk4MVx1NzUyOFx1NEVFM1x1NzQwNlx1RkYwQ1x1OEJBOVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NjI0MFx1NjcwOVx1OEJGN1x1NkM0MlxuICAgICAgcHJveHk6IHt9XG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzLCBhdXRvcHJlZml4ZXJdLFxuICAgICAgfSxcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgbGVzczoge1xuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAvLyBcdTUzMDVcdTU0MkJcdTU3RkFcdTY3MkNcdTRGOURcdThENTZcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ3Z1ZScsIFxuICAgICAgICAndnVlLXJvdXRlcicsXG4gICAgICAgICdwaW5pYScsXG4gICAgICAgICdheGlvcycsXG4gICAgICAgICdkYXlqcycsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZScsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZS9lcy9sb2NhbGUvemhfQ04nXG4gICAgICBdLFxuICAgICAgLy8gXHU2MzkyXHU5NjY0XHU3Mjc5XHU1QjlBXHU0RjlEXHU4RDU2XG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgIC8vIFx1NjM5Mlx1OTY2NFx1NjNEMlx1NEVGNlx1NEUyRFx1NzY4NFx1NjcwRFx1NTJBMVx1NTY2OE1vY2tcbiAgICAgICAgJ3NyYy9wbHVnaW5zL3NlcnZlck1vY2sudHMnLFxuICAgICAgICAvLyBcdTYzOTJcdTk2NjRmc2V2ZW50c1x1NjcyQ1x1NTczMFx1NkEyMVx1NTc1N1x1RkYwQ1x1OTA3Rlx1NTE0RFx1Njc4NFx1NUVGQVx1OTUxOVx1OEJFRlxuICAgICAgICAnZnNldmVudHMnXG4gICAgICBdLFxuICAgICAgLy8gXHU3ODZFXHU0RkREXHU0RjlEXHU4RDU2XHU5ODg0XHU2Nzg0XHU1RUZBXHU2QjYzXHU3ODZFXHU1QjhDXHU2MjEwXG4gICAgICBmb3JjZTogdHJ1ZSxcbiAgICB9LFxuICAgIC8vIFx1NEY3Rlx1NzUyOFx1NTM1NVx1NzJFQ1x1NzY4NFx1N0YxM1x1NUI1OFx1NzZFRVx1NUY1NVxuICAgIGNhY2hlRGlyOiAnbm9kZV9tb2R1bGVzLy52aXRlX2NhY2hlJyxcbiAgICAvLyBcdTk2MzJcdTZCNjJcdTU4MDZcdTY4MDhcdTZFQTJcdTUxRkFcbiAgICBlc2J1aWxkOiB7XG4gICAgICBsb2dPdmVycmlkZToge1xuICAgICAgICAndGhpcy1pcy11bmRlZmluZWQtaW4tZXNtJzogJ3NpbGVudCdcbiAgICAgIH0sXG4gICAgfVxuICB9XG59KTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1N0JBMVx1NzQwNlx1NkEyMVx1NTc1N1xuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRIVFRQXHU4QkY3XHU2QzQyXHU2MkU2XHU2MjJBXHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU3NTI4XHU0RThFXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XG4gKiBcdThEMUZcdThEMjNcdTdCQTFcdTc0MDZcdTU0OENcdTUyMDZcdTUzRDFcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTUyMzBcdTVCRjlcdTVFOTRcdTc2ODRcdTY3MERcdTUyQTFcdTU5MDRcdTc0MDZcdTUxRkRcdTY1NzBcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IEluY29taW5nTWVzc2FnZSwgU2VydmVyUmVzcG9uc2UgfSBmcm9tICdodHRwJztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IG1vY2tDb25maWcsIHNob3VsZE1vY2tSZXF1ZXN0LCBsb2dNb2NrIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU1QkZDXHU1MTY1XHU2NzBEXHU1MkExXG5pbXBvcnQgeyBkYXRhU291cmNlU2VydmljZSwgcXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMnO1xuXG4vLyBcdTU5MDRcdTc0MDZDT1JTXHU4QkY3XHU2QzQyXG5mdW5jdGlvbiBoYW5kbGVDb3JzKHJlczogU2VydmVyUmVzcG9uc2UpIHtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uLCBYLU1vY2stRW5hYmxlZCcpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1NYXgtQWdlJywgJzg2NDAwJyk7XG59XG5cbi8vIFx1NTNEMVx1OTAwMUpTT05cdTU0Q0RcdTVFOTRcbmZ1bmN0aW9uIHNlbmRKc29uUmVzcG9uc2UocmVzOiBTZXJ2ZXJSZXNwb25zZSwgc3RhdHVzOiBudW1iZXIsIGRhdGE6IGFueSkge1xuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbi8vIFx1NUVGNlx1OEZERlx1NjI2N1x1ODg0Q1xuZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8vIFx1ODlFM1x1Njc5MFx1OEJGN1x1NkM0Mlx1NEY1M1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VSZXF1ZXN0Qm9keShyZXE6IEluY29taW5nTWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBib2R5ID0gJyc7XG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rKSA9PiB7XG4gICAgICBib2R5ICs9IGNodW5rLnRvU3RyaW5nKCk7XG4gICAgfSk7XG4gICAgcmVxLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlKGJvZHkgPyBKU09OLnBhcnNlKGJvZHkpIDoge30pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1NjU3MFx1NjM2RVx1NkU5MEFQSVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY3MERcdTUyQTFcdTVDNDJcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcdUZGMENcdTY1MkZcdTYzMDFcdTUyMDZcdTk4NzVcdTU0OENcdThGQzdcdTZFRTRcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmdldERhdGFTb3VyY2VzKHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQodXJsUXVlcnkucGFnZSBhcyBzdHJpbmcpIHx8IDEsXG4gICAgICAgIHNpemU6IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMCxcbiAgICAgICAgbmFtZTogdXJsUXVlcnkubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgIHR5cGU6IHVybFF1ZXJ5LnR5cGUgYXMgc3RyaW5nLFxuICAgICAgICBzdGF0dXM6IHVybFF1ZXJ5LnN0YXR1cyBhcyBzdHJpbmdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiByZXN1bHQuaXRlbXMsIFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGFzb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5nZXREYXRhU291cmNlKGlkKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IGRhdGFzb3VyY2UsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2UgXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgbmV3RGF0YVNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmNyZWF0ZURhdGFTb3VyY2UoYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDEsIHtcbiAgICAgICAgZGF0YTogbmV3RGF0YVNvdXJjZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBVVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YVNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLnVwZGF0ZURhdGFTb3VyY2UoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHVwZGF0ZWREYXRhU291cmNlLFxuICAgICAgICBtZXNzYWdlOiAnXHU2NTcwXHU2MzZFXHU2RTkwXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2RhdGFzb3VyY2VzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2REVMRVRFXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuZGVsZXRlRGF0YVNvdXJjZShpZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzL3Rlc3QtY29ubmVjdGlvbicgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL2RhdGFzb3VyY2VzL3Rlc3QtY29ubmVjdGlvbmApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UudGVzdENvbm5lY3Rpb24oYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NkQ0Qlx1OEJENVx1OEZERVx1NjNBNVx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY3RTVcdThCRTJBUElcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVF1ZXJpZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9xdWVyaWVzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU2NzBEXHU1MkExXHU1QzQyXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHVGRjBDXHU2NTJGXHU2MzAxXHU1MjA2XHU5ODc1XHU1NDhDXHU4RkM3XHU2RUU0XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcmllcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nLFxuICAgICAgICBkYXRhU291cmNlSWQ6IHVybFF1ZXJ5LmRhdGFTb3VyY2VJZCBhcyBzdHJpbmcsXG4gICAgICAgIHN0YXR1czogdXJsUXVlcnkuc3RhdHVzIGFzIHN0cmluZyxcbiAgICAgICAgcXVlcnlUeXBlOiB1cmxRdWVyeS5xdWVyeVR5cGUgYXMgc3RyaW5nLFxuICAgICAgICBpc0Zhdm9yaXRlOiB1cmxRdWVyeS5pc0Zhdm9yaXRlID09PSAndHJ1ZSdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiByZXN1bHQuaXRlbXMsIFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgcXVlcnkgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcnkoaWQpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcXVlcnksXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjdFNVx1OEJFMlx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2UgXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvcXVlcmllcycgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IG5ld1F1ZXJ5ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmNyZWF0ZVF1ZXJ5KGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7XG4gICAgICAgIGRhdGE6IG5ld1F1ZXJ5LFxuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU1MjFCXHU1RUZBXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQVVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgdXBkYXRlZFF1ZXJ5ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLnVwZGF0ZVF1ZXJ5KGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB1cGRhdGVkUXVlcnksXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTY2RjRcdTY1QjBcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkRFTEVURVx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHF1ZXJ5U2VydmljZS5kZWxldGVRdWVyeShpZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL3J1biQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmV4ZWN1dGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjA3XHU2MzYyXHU2N0U1XHU4QkUyXHU2NTM2XHU4NUNGXHU3MkI2XHU2MDAxXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC9mYXZvcml0ZSQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLnRvZ2dsZUZhdm9yaXRlKGlkKTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2NkY0XHU2NUIwXHU2NTM2XHU4NUNGXHU3MkI2XHU2MDAxXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL3ZlcnNpb25zJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKVszXSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCB2ZXJzaW9ucyA9IGF3YWl0IHF1ZXJ5U2VydmljZS5nZXRRdWVyeVZlcnNpb25zKGlkKTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB2ZXJzaW9ucyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI3OVx1NUI5QVx1NzI0OFx1NjcyQ1xuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvdmVyc2lvbnNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHVybFBhdGguc3BsaXQoJy8nKTtcbiAgICBjb25zdCBxdWVyeUlkID0gcGFydHNbM10gfHwgJyc7XG4gICAgY29uc3QgdmVyc2lvbklkID0gcGFydHNbNV0gfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBcdTY3RTVcdThCRTJJRDogJHtxdWVyeUlkfSwgXHU3MjQ4XHU2NzJDSUQ6ICR7dmVyc2lvbklkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCB2ZXJzaW9ucyA9IGF3YWl0IHF1ZXJ5U2VydmljZS5nZXRRdWVyeVZlcnNpb25zKHF1ZXJ5SWQpO1xuICAgICAgY29uc3QgdmVyc2lvbiA9IHZlcnNpb25zLmZpbmQoKHY6IGFueSkgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICAgIFxuICAgICAgaWYgKCF2ZXJzaW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB2ZXJzaW9uLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTUyMUJcdTVFRkFcdTRFMkRcdTk1RjRcdTRFRjZcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCk6IENvbm5lY3QuTmV4dEhhbmRsZUZ1bmN0aW9uIHtcbiAgLy8gXHU1OTgyXHU2NzlDTW9ja1x1NjcwRFx1NTJBMVx1ODhBQlx1Nzk4MVx1NzUyOFx1RkYwQ1x1OEZENFx1NTZERVx1N0E3QVx1NEUyRFx1OTVGNFx1NEVGNlxuICBpZiAoIW1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU2NzBEXHU1MkExXHU1REYyXHU3OTgxXHU3NTI4XHVGRjBDXHU4RkQ0XHU1NkRFXHU3QTdBXHU0RTJEXHU5NUY0XHU0RUY2Jyk7XG4gICAgcmV0dXJuIChyZXEsIHJlcywgbmV4dCkgPT4gbmV4dCgpO1xuICB9XG4gIFxuICBjb25zb2xlLmxvZygnW01vY2tdIFx1NTIxQlx1NUVGQVx1NEUyRFx1OTVGNFx1NEVGNiwgXHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyJyk7XG4gIFxuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbW9ja01pZGRsZXdhcmUoXG4gICAgcmVxOiBDb25uZWN0LkluY29taW5nTWVzc2FnZSxcbiAgICByZXM6IFNlcnZlclJlc3BvbnNlLFxuICAgIG5leHQ6IENvbm5lY3QuTmV4dEZ1bmN0aW9uXG4gICkge1xuICAgIHRyeSB7XG4gICAgICAvLyBcdTg5RTNcdTY3OTBVUkxcbiAgICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgICBcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgaWYgKCF1cmwuaW5jbHVkZXMoJy9hcGkvJykpIHtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU1ODlFXHU1RjNBXHU1OTA0XHU3NDA2XHU5MUNEXHU1OTBEXHU3Njg0QVBJXHU4REVGXHU1Rjg0XG4gICAgICBsZXQgcHJvY2Vzc2VkVXJsID0gdXJsO1xuICAgICAgaWYgKHVybC5pbmNsdWRlcygnL2FwaS9hcGkvJykpIHtcbiAgICAgICAgcHJvY2Vzc2VkVXJsID0gdXJsLnJlcGxhY2UoL1xcL2FwaVxcL2FwaVxcLy9nLCAnL2FwaS8nKTtcbiAgICAgICAgbG9nTW9jaygnZGVidWcnLCBgXHU2OEMwXHU2RDRCXHU1MjMwXHU5MUNEXHU1OTBEXHU3Njg0QVBJXHU4REVGXHU1Rjg0XHVGRjBDXHU1REYyXHU0RkVFXHU2QjYzOiAke3VybH0gLT4gJHtwcm9jZXNzZWRVcmx9YCk7XG4gICAgICAgIC8vIFx1NEZFRVx1NjUzOVx1NTM5Rlx1NTlDQlx1OEJGN1x1NkM0Mlx1NzY4NFVSTFx1RkYwQ1x1Nzg2RVx1NEZERFx1NTQwRVx1N0VFRFx1NTkwNFx1NzQwNlx1ODBGRFx1NkI2M1x1Nzg2RVx1OEJDNlx1NTIyQlxuICAgICAgICByZXEudXJsID0gcHJvY2Vzc2VkVXJsO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTZENEJcdThCRDVcdUZGMUFcdTYyNTNcdTUzNzBcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTRFRTVcdTRGQkZcdThDMDNcdThCRDVcbiAgICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7cHJvY2Vzc2VkVXJsfWApO1xuICAgICAgXG4gICAgICBjb25zdCBwYXJzZWRVcmwgPSBwYXJzZShwcm9jZXNzZWRVcmwsIHRydWUpO1xuICAgICAgY29uc3QgdXJsUGF0aCA9IHBhcnNlZFVybC5wYXRobmFtZSB8fCAnJztcbiAgICAgIGNvbnN0IHVybFF1ZXJ5ID0gcGFyc2VkVXJsLnF1ZXJ5IHx8IHt9O1xuICAgICAgXG4gICAgICAvLyBcdTUxOERcdTZCMjFcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTU5MDRcdTc0MDZcdTZCNjRcdThCRjdcdTZDNDJcdUZGMDhcdTRGN0ZcdTc1MjhcdTU5MDRcdTc0MDZcdTU0MEVcdTc2ODRVUkxcdUZGMDlcbiAgICAgIGlmICghc2hvdWxkTW9ja1JlcXVlc3QocHJvY2Vzc2VkVXJsKSkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTY1MzZcdTUyMzBcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHt1cmxQYXRofWApO1xuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZDT1JTXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTZERkJcdTUyQTBDT1JTXHU1OTM0XG4gICAgICBoYW5kbGVDb3JzKHJlcyk7XG4gICAgICBcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1N0Y1MVx1N0VEQ1x1NUVGNlx1OEZERlxuICAgICAgaWYgKG1vY2tDb25maWcuZGVsYXkgPiAwKSB7XG4gICAgICAgIGF3YWl0IGRlbGF5KG1vY2tDb25maWcuZGVsYXkpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZcdTRFMERcdTU0MENcdTc2ODRBUElcdTdBRUZcdTcwQjlcbiAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XG4gICAgICBcbiAgICAgIC8vIFx1NjMwOVx1OTg3QVx1NUU4Rlx1NUMxRFx1OEJENVx1NEUwRFx1NTQwQ1x1NzY4NEFQSVx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gYXdhaXQgaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxLCByZXMsIHVybFBhdGgsIHVybFF1ZXJ5KTtcbiAgICAgIGlmICghaGFuZGxlZCkgaGFuZGxlZCA9IGF3YWl0IGhhbmRsZVF1ZXJpZXNBcGkocmVxLCByZXMsIHVybFBhdGgsIHVybFF1ZXJ5KTtcbiAgICAgIFxuICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2Q0ExXHU2NzA5XHU1OTA0XHU3NDA2XHVGRjBDXHU4RkQ0XHU1NkRFNDA0XG4gICAgICBpZiAoIWhhbmRsZWQpIHtcbiAgICAgICAgbG9nTW9jaygnaW5mbycsIGBcdTY3MkFcdTVCOUVcdTczQjBcdTc2ODRBUElcdThERUZcdTVGODQ6ICR7cmVxLm1ldGhvZH0gJHt1cmxQYXRofWApO1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICAgIGVycm9yOiAnXHU2NzJBXHU2MjdFXHU1MjMwQVBJXHU3QUVGXHU3MEI5JyxcbiAgICAgICAgICBtZXNzYWdlOiBgQVBJXHU3QUVGXHU3MEI5ICR7dXJsUGF0aH0gXHU2NzJBXHU2MjdFXHU1MjMwXHU2MjE2XHU2NzJBXHU1QjlFXHU3M0IwYCxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nTW9jaygnZXJyb3InLCBgXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU1MUZBXHU5NTE5OmAsIGVycm9yKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU2NzBEXHU1MkExXHU1NjY4XHU1MTg1XHU5MEU4XHU5NTE5XHU4QkVGJyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9ja1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XG4gKiBcbiAqIFx1NjNBN1x1NTIzNk1vY2tcdTY3MERcdTUyQTFcdTc2ODRcdTU0MkZcdTc1MjgvXHU3OTgxXHU3NTI4XHU3MkI2XHU2MDAxXHUzMDAxXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCXHU3QjQ5XG4gKi9cblxuLy8gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU2MjE2XHU1MTY4XHU1QzQwXHU4QkJFXHU3RjZFXHU0RTJEXHU4M0I3XHU1M0Q2XHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuZXhwb3J0IGZ1bmN0aW9uIGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgdHJ5IHtcbiAgICAvLyBcdTU3MjhOb2RlLmpzXHU3M0FGXHU1ODgzXHU0RTJEXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudikge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODNcdTRFMkRcbiAgICBpZiAodHlwZW9mIGltcG9ydC5tZXRhICE9PSAndW5kZWZpbmVkJyAmJiBpbXBvcnQubWV0YS5lbnYpIHtcbiAgICAgIGlmIChpbXBvcnQubWV0YS5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChpbXBvcnQubWV0YS5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTY4QzBcdTY3RTVsb2NhbFN0b3JhZ2UgKFx1NEVDNVx1NTcyOFx1NkQ0Rlx1ODlDOFx1NTY2OFx1NzNBRlx1NTg4MylcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgY29uc3QgbG9jYWxTdG9yYWdlVmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnVVNFX01PQ0tfQVBJJyk7XG4gICAgICBpZiAobG9jYWxTdG9yYWdlVmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChsb2NhbFN0b3JhZ2VWYWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OUVEOFx1OEJBNFx1NjBDNVx1NTFCNVx1RkYxQVx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NEUwQlx1NTQyRlx1NzUyOFx1RkYwQ1x1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1Nzk4MVx1NzUyOFxuICAgIGNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBcbiAgICAgICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHx8XG4gICAgICAodHlwZW9mIGltcG9ydC5tZXRhICE9PSAndW5kZWZpbmVkJyAmJiBpbXBvcnQubWV0YS5lbnYgJiYgaW1wb3J0Lm1ldGEuZW52LkRFViA9PT0gdHJ1ZSk7XG4gICAgXG4gICAgcmV0dXJuIGlzRGV2ZWxvcG1lbnQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gXHU1MUZBXHU5NTE5XHU2NUY2XHU3Njg0XHU1Qjg5XHU1MTY4XHU1NkRFXHU5MDAwXG4gICAgY29uc29sZS53YXJuKCdbTW9ja10gXHU2OEMwXHU2N0U1XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU1MUZBXHU5NTE5XHVGRjBDXHU5RUQ4XHU4QkE0XHU3OTgxXHU3NTI4TW9ja1x1NjcwRFx1NTJBMScsIGVycm9yKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gXHU1NDExXHU1NDBFXHU1MTdDXHU1QkI5XHU2NUU3XHU0RUUzXHU3ODAxXHU3Njg0XHU1MUZEXHU2NTcwXG5leHBvcnQgZnVuY3Rpb24gaXNNb2NrRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzRW5hYmxlZCgpO1xufVxuXG4vLyBNb2NrXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXG5leHBvcnQgY29uc3QgbW9ja0NvbmZpZyA9IHtcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICBlbmFibGVkOiBpc0VuYWJsZWQoKSxcbiAgXG4gIC8vIFx1OEJGN1x1NkM0Mlx1NUVGNlx1OEZERlx1RkYwOFx1NkJFQlx1NzlEMlx1RkYwOVxuICBkZWxheTogMzAwLFxuICBcbiAgLy8gQVBJXHU1N0ZBXHU3ODQwXHU4REVGXHU1Rjg0XHVGRjBDXHU3NTI4XHU0RThFXHU1MjI0XHU2NUFEXHU2NjJGXHU1NDI2XHU5NzAwXHU4OTgxXHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIGFwaUJhc2VQYXRoOiAnL2FwaScsXG4gIFxuICAvLyBcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkI6ICdub25lJywgJ2Vycm9yJywgJ2luZm8nLCAnZGVidWcnXG4gIGxvZ0xldmVsOiAnZGVidWcnLFxuICBcbiAgLy8gXHU1NDJGXHU3NTI4XHU3Njg0XHU2QTIxXHU1NzU3XG4gIG1vZHVsZXM6IHtcbiAgICBkYXRhc291cmNlczogdHJ1ZSxcbiAgICBxdWVyaWVzOiB0cnVlLFxuICAgIHVzZXJzOiB0cnVlLFxuICAgIHZpc3VhbGl6YXRpb25zOiB0cnVlXG4gIH1cbn07XG5cbi8vIFx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE1vY2tSZXF1ZXN0KHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFx1NUZDNVx1OTg3Qlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgaWYgKCFtb2NrQ29uZmlnLmVuYWJsZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFx1NUZDNVx1OTg3Qlx1NjYyRkFQSVx1OEJGN1x1NkM0MlxuICBpZiAoIXVybC5zdGFydHNXaXRoKG1vY2tDb25maWcuYXBpQmFzZVBhdGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdThERUZcdTVGODRcdTY4QzBcdTY3RTVcdTkwMUFcdThGQzdcdUZGMENcdTVFOTRcdThCRTVcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFx1OEJCMFx1NUY1NVx1NjVFNVx1NUZEN1xuZXhwb3J0IGZ1bmN0aW9uIGxvZ01vY2sobGV2ZWw6ICdlcnJvcicgfCAnaW5mbycgfCAnZGVidWcnLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICBjb25zdCB7IGxvZ0xldmVsIH0gPSBtb2NrQ29uZmlnO1xuICBcbiAgaWYgKGxvZ0xldmVsID09PSAnbm9uZScpIHJldHVybjtcbiAgXG4gIGlmIChsZXZlbCA9PT0gJ2Vycm9yJyAmJiBbJ2Vycm9yJywgJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTW9jayBFUlJPUl0nLCAuLi5hcmdzKTtcbiAgfSBlbHNlIGlmIChsZXZlbCA9PT0gJ2luZm8nICYmIFsnaW5mbycsICdkZWJ1ZyddLmluY2x1ZGVzKGxvZ0xldmVsKSkge1xuICAgIGNvbnNvbGUuaW5mbygnW01vY2sgSU5GT10nLCAuLi5hcmdzKTtcbiAgfSBlbHNlIGlmIChsZXZlbCA9PT0gJ2RlYnVnJyAmJiBsb2dMZXZlbCA9PT0gJ2RlYnVnJykge1xuICAgIGNvbnNvbGUubG9nKCdbTW9jayBERUJVR10nLCAuLi5hcmdzKTtcbiAgfVxufVxuXG4vLyBcdTUyMURcdTU5Q0JcdTUzMTZcdTY1RjZcdThGOTNcdTUxRkFNb2NrXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxXG50cnkge1xuICBjb25zb2xlLmxvZyhgW01vY2tdIFx1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMTogJHttb2NrQ29uZmlnLmVuYWJsZWQgPyAnXHU1REYyXHU1NDJGXHU3NTI4JyA6ICdcdTVERjJcdTc5ODFcdTc1MjgnfWApO1xuICBpZiAobW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTkxNERcdTdGNkU6YCwge1xuICAgICAgZGVsYXk6IG1vY2tDb25maWcuZGVsYXksXG4gICAgICBhcGlCYXNlUGF0aDogbW9ja0NvbmZpZy5hcGlCYXNlUGF0aCxcbiAgICAgIGxvZ0xldmVsOiBtb2NrQ29uZmlnLmxvZ0xldmVsLFxuICAgICAgZW5hYmxlZE1vZHVsZXM6IE9iamVjdC5lbnRyaWVzKG1vY2tDb25maWcubW9kdWxlcylcbiAgICAgICAgLmZpbHRlcigoW18sIGVuYWJsZWRdKSA9PiBlbmFibGVkKVxuICAgICAgICAubWFwKChbbmFtZV0pID0+IG5hbWUpXG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGNvbnNvbGUud2FybignW01vY2tdIFx1OEY5M1x1NTFGQVx1OTE0RFx1N0Y2RVx1NEZFMVx1NjA2Rlx1NTFGQVx1OTUxOScsIGVycm9yKTtcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHNcIjsvKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5MFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY1NzBcdTYzNkVcdTZFOTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdUZGMENcdTc1MjhcdTRFOEVcdTVGMDBcdTUzRDFcdTU0OENcdTZENEJcdThCRDVcbiAqL1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTdDN0JcdTU3OEJcbmV4cG9ydCB0eXBlIERhdGFTb3VyY2VUeXBlID0gJ215c3FsJyB8ICdwb3N0Z3Jlc3FsJyB8ICdvcmFjbGUnIHwgJ3NxbHNlcnZlcicgfCAnc3FsaXRlJztcblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU3MkI2XHU2MDAxXG5leHBvcnQgdHlwZSBEYXRhU291cmNlU3RhdHVzID0gJ2FjdGl2ZScgfCAnaW5hY3RpdmUnIHwgJ2Vycm9yJyB8ICdwZW5kaW5nJztcblxuLy8gXHU1NDBDXHU2QjY1XHU5ODkxXHU3Mzg3XG5leHBvcnQgdHlwZSBTeW5jRnJlcXVlbmN5ID0gJ21hbnVhbCcgfCAnaG91cmx5JyB8ICdkYWlseScgfCAnd2Vla2x5JyB8ICdtb250aGx5JztcblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU2M0E1XHU1M0UzXG5leHBvcnQgaW50ZXJmYWNlIERhdGFTb3VyY2Uge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICB0eXBlOiBEYXRhU291cmNlVHlwZTtcbiAgaG9zdD86IHN0cmluZztcbiAgcG9ydD86IG51bWJlcjtcbiAgZGF0YWJhc2VOYW1lPzogc3RyaW5nO1xuICB1c2VybmFtZT86IHN0cmluZztcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gIHN0YXR1czogRGF0YVNvdXJjZVN0YXR1cztcbiAgc3luY0ZyZXF1ZW5jeT86IFN5bmNGcmVxdWVuY3k7XG4gIGxhc3RTeW5jVGltZT86IHN0cmluZyB8IG51bGw7XG4gIGNyZWF0ZWRBdDogc3RyaW5nO1xuICB1cGRhdGVkQXQ6IHN0cmluZztcbiAgaXNBY3RpdmU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKi9cbmV4cG9ydCBjb25zdCBtb2NrRGF0YVNvdXJjZXM6IERhdGFTb3VyY2VbXSA9IFtcbiAge1xuICAgIGlkOiAnZHMtMScsXG4gICAgbmFtZTogJ015U1FMXHU3OTNBXHU0RjhCXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4Qk15U1FMXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnbXlzcWwnLFxuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHBvcnQ6IDMzMDYsXG4gICAgZGF0YWJhc2VOYW1lOiAnZXhhbXBsZV9kYicsXG4gICAgdXNlcm5hbWU6ICd1c2VyJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdkYWlseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMicsXG4gICAgbmFtZTogJ1Bvc3RncmVTUUxcdTc1MUZcdTRFQTdcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ3Bvc3RncmVzcWwnLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMTAwJyxcbiAgICBwb3J0OiA1NDMyLFxuICAgIGRhdGFiYXNlTmFtZTogJ3Byb2R1Y3Rpb25fZGInLFxuICAgIHVzZXJuYW1lOiAnYWRtaW4nLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2hvdXJseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzYwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA3Nzc2MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0zJyxcbiAgICBuYW1lOiAnU1FMaXRlXHU2NzJDXHU1NzMwXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NjcyQ1x1NTczMFNRTGl0ZVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ3NxbGl0ZScsXG4gICAgZGF0YWJhc2VOYW1lOiAnL3BhdGgvdG8vbG9jYWwuZGInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzQ1NjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTQnLFxuICAgIG5hbWU6ICdTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFNRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTczQUZcdTU4ODMnLFxuICAgIHR5cGU6ICdzcWxzZXJ2ZXInLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMjAwJyxcbiAgICBwb3J0OiAxNDMzLFxuICAgIGRhdGFiYXNlTmFtZTogJ3Rlc3RfZGInLFxuICAgIHVzZXJuYW1lOiAndGVzdGVyJyxcbiAgICBzdGF0dXM6ICdpbmFjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ3dlZWtseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNjA0ODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDUxODQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogZmFsc2VcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtNScsXG4gICAgbmFtZTogJ09yYWNsZVx1NEYwMVx1NEUxQVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBPcmFjbGVcdTRGMDFcdTRFMUFcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdvcmFjbGUnLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMTUwJyxcbiAgICBwb3J0OiAxNTIxLFxuICAgIGRhdGFiYXNlTmFtZTogJ2VudGVycHJpc2VfZGInLFxuICAgIHVzZXJuYW1lOiAnc3lzdGVtJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdkYWlseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDEwMzY4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfVxuXTtcblxuLyoqXG4gKiBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBjb3VudCBcdTc1MUZcdTYyMTBcdTY1NzBcdTkxQ0ZcbiAqIEByZXR1cm5zIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1N0VDNFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVNb2NrRGF0YVNvdXJjZXMoY291bnQ6IG51bWJlciA9IDUpOiBEYXRhU291cmNlW10ge1xuICBjb25zdCB0eXBlczogRGF0YVNvdXJjZVR5cGVbXSA9IFsnbXlzcWwnLCAncG9zdGdyZXNxbCcsICdvcmFjbGUnLCAnc3Fsc2VydmVyJywgJ3NxbGl0ZSddO1xuICBjb25zdCBzdGF0dXNlczogRGF0YVNvdXJjZVN0YXR1c1tdID0gWydhY3RpdmUnLCAnaW5hY3RpdmUnLCAnZXJyb3InLCAncGVuZGluZyddO1xuICBjb25zdCBzeW5jRnJlcXM6IFN5bmNGcmVxdWVuY3lbXSA9IFsnbWFudWFsJywgJ2hvdXJseScsICdkYWlseScsICd3ZWVrbHknLCAnbW9udGhseSddO1xuICBcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVzW2kgJSB0eXBlcy5sZW5ndGhdO1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBgZHMtZ2VuLSR7aSArIDF9YCxcbiAgICAgIG5hbWU6IGBcdTc1MUZcdTYyMTBcdTc2ODQke3R5cGV9XHU2NTcwXHU2MzZFXHU2RTkwICR7aSArIDF9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU3Njg0JHt0eXBlfVx1N0M3Qlx1NTc4Qlx1NjU3MFx1NjM2RVx1NkU5MCAke2kgKyAxfWAsXG4gICAgICB0eXBlLFxuICAgICAgaG9zdDogdHlwZSAhPT0gJ3NxbGl0ZScgPyAnbG9jYWxob3N0JyA6IHVuZGVmaW5lZCxcbiAgICAgIHBvcnQ6IHR5cGUgIT09ICdzcWxpdGUnID8gKDMzMDYgKyBpKSA6IHVuZGVmaW5lZCxcbiAgICAgIGRhdGFiYXNlTmFtZTogdHlwZSA9PT0gJ3NxbGl0ZScgPyBgL3BhdGgvdG8vZGJfJHtpfS5kYmAgOiBgZXhhbXBsZV9kYl8ke2l9YCxcbiAgICAgIHVzZXJuYW1lOiB0eXBlICE9PSAnc3FsaXRlJyA/IGB1c2VyXyR7aX1gIDogdW5kZWZpbmVkLFxuICAgICAgc3RhdHVzOiBzdGF0dXNlc1tpICUgc3RhdHVzZXMubGVuZ3RoXSxcbiAgICAgIHN5bmNGcmVxdWVuY3k6IHN5bmNGcmVxc1tpICUgc3luY0ZyZXFzLmxlbmd0aF0sXG4gICAgICBsYXN0U3luY1RpbWU6IGkgJSAzID09PSAwID8gbnVsbCA6IG5ldyBEYXRlKG5vdyAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUobm93IC0gKGkgKyAxMCkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUobm93IC0gaSAqIDQzMjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgaXNBY3RpdmU6IGkgJSA0ICE9PSAwXG4gICAgfTtcbiAgfSk7XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1OUVEOFx1OEJBNFx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuZXhwb3J0IGRlZmF1bHQgbW9ja0RhdGFTb3VyY2VzOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHNcIjsvKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5ME1vY2tcdTY3MERcdTUyQTFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2NTcwXHU2MzZFXHU2RTkwXHU3NkY4XHU1MTczQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU1QjlFXHU3M0IwXG4gKi9cblxuaW1wb3J0IHsgbW9ja0RhdGFTb3VyY2VzIH0gZnJvbSAnLi4vZGF0YS9kYXRhc291cmNlJztcbmltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZSB9IGZyb20gJy4uL2RhdGEvZGF0YXNvdXJjZSc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU0RTM0XHU2NUY2XHU1QjU4XHU1MEE4XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHVGRjBDXHU1MTQxXHU4QkI4XHU2QTIxXHU2MkRGXHU1ODlFXHU1MjIwXHU2NTM5XHU2NENEXHU0RjVDXG5sZXQgZGF0YVNvdXJjZXMgPSBbLi4ubW9ja0RhdGFTb3VyY2VzXTtcblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXkgPSB0eXBlb2YgbW9ja0NvbmZpZy5kZWxheSA9PT0gJ251bWJlcicgPyBtb2NrQ29uZmlnLmRlbGF5IDogMzAwO1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG59XG5cbi8qKlxuICogXHU5MUNEXHU3RjZFXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU2MzZFXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldERhdGFTb3VyY2VzKCk6IHZvaWQge1xuICBkYXRhU291cmNlcyA9IFsuLi5tb2NrRGF0YVNvdXJjZXNdO1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICogQHBhcmFtIHBhcmFtcyBcdTY3RTVcdThCRTJcdTUzQzJcdTY1NzBcbiAqIEByZXR1cm5zIFx1NTIwNlx1OTg3NVx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YVNvdXJjZXMocGFyYW1zPzoge1xuICBwYWdlPzogbnVtYmVyO1xuICBzaXplPzogbnVtYmVyO1xuICBuYW1lPzogc3RyaW5nO1xuICB0eXBlPzogc3RyaW5nO1xuICBzdGF0dXM/OiBzdHJpbmc7XG59KTogUHJvbWlzZTx7XG4gIGl0ZW1zOiBEYXRhU291cmNlW107XG4gIHBhZ2luYXRpb246IHtcbiAgICB0b3RhbDogbnVtYmVyO1xuICAgIHBhZ2U6IG51bWJlcjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgdG90YWxQYWdlczogbnVtYmVyO1xuICB9O1xufT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICBcbiAgLy8gXHU1RTk0XHU3NTI4XHU4RkM3XHU2RUU0XG4gIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLmRhdGFTb3VyY2VzXTtcbiAgXG4gIC8vIFx1NjMwOVx1NTQwRFx1NzlGMFx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy5uYW1lKSB7XG4gICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IFxuICAgICAgZHMubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgKGRzLmRlc2NyaXB0aW9uICYmIGRzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgKTtcbiAgfVxuICBcbiAgLy8gXHU2MzA5XHU3QzdCXHU1NzhCXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/LnR5cGUpIHtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gZHMudHlwZSA9PT0gcGFyYW1zLnR5cGUpO1xuICB9XG4gIFxuICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IGRzLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gIH1cbiAgXG4gIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKTtcbiAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICBcbiAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gIHJldHVybiB7XG4gICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgIHBhZ2UsXG4gICAgICBzaXplLFxuICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqIEByZXR1cm5zIFx1NjU3MFx1NjM2RVx1NkU5MFx1OEJFNlx1NjBDNVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YVNvdXJjZShpZDogc3RyaW5nKTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTY3RTVcdTYyN0VcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2VzLmZpbmQoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmICghZGF0YVNvdXJjZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICByZXR1cm4gZGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBkYXRhIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1NjM2RVxuICogQHJldHVybnMgXHU1MjFCXHU1RUZBXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVEYXRhU291cmNlKGRhdGE6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMElEXG4gIGNvbnN0IG5ld0lkID0gYGRzLSR7RGF0ZS5ub3coKX1gO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IG5ld0RhdGFTb3VyY2U6IERhdGFTb3VyY2UgPSB7XG4gICAgaWQ6IG5ld0lkLFxuICAgIG5hbWU6IGRhdGEubmFtZSB8fCAnTmV3IERhdGEgU291cmNlJyxcbiAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICB0eXBlOiBkYXRhLnR5cGUgfHwgJ215c3FsJyxcbiAgICBob3N0OiBkYXRhLmhvc3QsXG4gICAgcG9ydDogZGF0YS5wb3J0LFxuICAgIGRhdGFiYXNlTmFtZTogZGF0YS5kYXRhYmFzZU5hbWUsXG4gICAgdXNlcm5hbWU6IGRhdGEudXNlcm5hbWUsXG4gICAgc3RhdHVzOiBkYXRhLnN0YXR1cyB8fCAncGVuZGluZycsXG4gICAgc3luY0ZyZXF1ZW5jeTogZGF0YS5zeW5jRnJlcXVlbmN5IHx8ICdtYW51YWwnLFxuICAgIGxhc3RTeW5jVGltZTogbnVsbCxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9O1xuICBcbiAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU1MjE3XHU4ODY4XG4gIGRhdGFTb3VyY2VzLnB1c2gobmV3RGF0YVNvdXJjZSk7XG4gIFxuICByZXR1cm4gbmV3RGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICogQHBhcmFtIGRhdGEgXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXG4gKiBAcmV0dXJucyBcdTY2RjRcdTY1QjBcdTU0MEVcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZURhdGFTb3VyY2UoaWQ6IHN0cmluZywgZGF0YTogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2MjdFXHU1MjMwXHU4OTgxXHU2NkY0XHU2NUIwXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXHU3RDIyXHU1RjE1XG4gIGNvbnN0IGluZGV4ID0gZGF0YVNvdXJjZXMuZmluZEluZGV4KGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIC8vIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCB1cGRhdGVkRGF0YVNvdXJjZTogRGF0YVNvdXJjZSA9IHtcbiAgICAuLi5kYXRhU291cmNlc1tpbmRleF0sXG4gICAgLi4uZGF0YSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICB9O1xuICBcbiAgLy8gXHU2NkZGXHU2MzYyXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGRhdGFTb3VyY2VzW2luZGV4XSA9IHVwZGF0ZWREYXRhU291cmNlO1xuICBcbiAgcmV0dXJuIHVwZGF0ZWREYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVEYXRhU291cmNlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjI3RVx1NTIzMFx1ODk4MVx1NTIyMFx1OTY2NFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFx1N0QyMlx1NUYxNVxuICBjb25zdCBpbmRleCA9IGRhdGFTb3VyY2VzLmZpbmRJbmRleChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgZGF0YVNvdXJjZXMuc3BsaWNlKGluZGV4LCAxKTtcbn1cblxuLyoqXG4gKiBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAqIEBwYXJhbSBwYXJhbXMgXHU4RkRFXHU2M0E1XHU1M0MyXHU2NTcwXG4gKiBAcmV0dXJucyBcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTdFRDNcdTY3OUNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3RDb25uZWN0aW9uKHBhcmFtczogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8e1xuICBzdWNjZXNzOiBib29sZWFuO1xuICBtZXNzYWdlPzogc3RyaW5nO1xuICBkZXRhaWxzPzogYW55O1xufT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU1QjlFXHU5NjQ1XHU0RjdGXHU3NTI4XHU2NUY2XHU1M0VGXHU4MEZEXHU0RjFBXHU2NzA5XHU2NkY0XHU1OTBEXHU2NzQyXHU3Njg0XHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU5MDNCXHU4RjkxXG4gIC8vIFx1OEZEOVx1OTFDQ1x1N0I4MFx1NTM1NVx1NkEyMVx1NjJERlx1NjIxMFx1NTI5Ri9cdTU5MzFcdThEMjVcbiAgY29uc3Qgc3VjY2VzcyA9IE1hdGgucmFuZG9tKCkgPiAwLjI7IC8vIDgwJVx1NjIxMFx1NTI5Rlx1NzM4N1xuICBcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzLFxuICAgIG1lc3NhZ2U6IHN1Y2Nlc3MgPyAnXHU4RkRFXHU2M0E1XHU2MjEwXHU1MjlGJyA6ICdcdThGREVcdTYzQTVcdTU5MzFcdThEMjU6IFx1NjVFMFx1NkNENVx1OEZERVx1NjNBNVx1NTIzMFx1NjU3MFx1NjM2RVx1NUU5M1x1NjcwRFx1NTJBMVx1NTY2OCcsXG4gICAgZGV0YWlsczogc3VjY2VzcyA/IHtcbiAgICAgIHJlc3BvbnNlVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApICsgMTAsXG4gICAgICB2ZXJzaW9uOiAnOC4wLjI4JyxcbiAgICAgIGNvbm5lY3Rpb25JZDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApICsgMTAwMFxuICAgIH0gOiB7XG4gICAgICBlcnJvckNvZGU6ICdDT05ORUNUSU9OX1JFRlVTRUQnLFxuICAgICAgZXJyb3JEZXRhaWxzOiAnXHU2NUUwXHU2Q0Q1XHU1RUZBXHU3QUNCXHU1MjMwXHU2NzBEXHU1MkExXHU1NjY4XHU3Njg0XHU4RkRFXHU2M0E1XHVGRjBDXHU4QkY3XHU2OEMwXHU2N0U1XHU3RjUxXHU3RURDXHU4QkJFXHU3RjZFXHU1NDhDXHU1MUVEXHU2MzZFJ1xuICAgIH1cbiAgfTtcbn1cblxuLy8gXHU1QkZDXHU1MUZBXHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldERhdGFTb3VyY2VzLFxuICBnZXREYXRhU291cmNlLFxuICBjcmVhdGVEYXRhU291cmNlLFxuICB1cGRhdGVEYXRhU291cmNlLFxuICBkZWxldGVEYXRhU291cmNlLFxuICB0ZXN0Q29ubmVjdGlvbixcbiAgcmVzZXREYXRhU291cmNlc1xufTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy91dGlscy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvdXRpbHMudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTkwMUFcdTc1MjhcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU1MjFCXHU1RUZBXHU3RURGXHU0RTAwXHU2ODNDXHU1RjBGXHU1NENEXHU1RTk0XHU3Njg0XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG4gKi9cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTZBMjFcdTYyREZBUElcdTYyMTBcdTUyOUZcdTU0Q0RcdTVFOTRcbiAqIEBwYXJhbSBkYXRhIFx1NTRDRFx1NUU5NFx1NjU3MFx1NjM2RVxuICogQHBhcmFtIHN1Y2Nlc3MgXHU2MjEwXHU1MjlGXHU3MkI2XHU2MDAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBdHJ1ZVxuICogQHBhcmFtIG1lc3NhZ2UgXHU1M0VGXHU5MDA5XHU2RDg4XHU2MDZGXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTY4M0NcdTVGMEZcdTc2ODRBUElcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tSZXNwb25zZTxUPihcbiAgZGF0YTogVCwgXG4gIHN1Y2Nlc3M6IGJvb2xlYW4gPSB0cnVlLCBcbiAgbWVzc2FnZT86IHN0cmluZ1xuKSB7XG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBkYXRhLFxuICAgIG1lc3NhZ2UsXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgbW9ja1Jlc3BvbnNlOiB0cnVlIC8vIFx1NjgwN1x1OEJCMFx1NEUzQVx1NkEyMVx1NjJERlx1NTRDRFx1NUU5NFxuICB9O1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NkEyMVx1NjJERkFQSVx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICogQHBhcmFtIG1lc3NhZ2UgXHU5NTE5XHU4QkVGXHU2RDg4XHU2MDZGXG4gKiBAcGFyYW0gY29kZSBcdTk1MTlcdThCRUZcdTRFRTNcdTc4MDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0EnTU9DS19FUlJPUidcbiAqIEBwYXJhbSBzdGF0dXMgSFRUUFx1NzJCNlx1NjAwMVx1NzgwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQTUwMFxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHU3Njg0XHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZShcbiAgbWVzc2FnZTogc3RyaW5nLCBcbiAgY29kZTogc3RyaW5nID0gJ01PQ0tfRVJST1InLCBcbiAgc3RhdHVzOiBudW1iZXIgPSA1MDBcbikge1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgIGVycm9yOiB7XG4gICAgICBtZXNzYWdlLFxuICAgICAgY29kZSxcbiAgICAgIHN0YXR1c0NvZGU6IHN0YXR1c1xuICAgIH0sXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgbW9ja1Jlc3BvbnNlOiB0cnVlXG4gIH07XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU1MjA2XHU5ODc1XHU1NENEXHU1RTk0XHU3RUQzXHU2Nzg0XG4gKiBAcGFyYW0gaXRlbXMgXHU1RjUzXHU1MjREXHU5ODc1XHU3Njg0XHU5ODc5XHU3NkVFXHU1MjE3XHU4ODY4XG4gKiBAcGFyYW0gdG90YWxJdGVtcyBcdTYwM0JcdTk4NzlcdTc2RUVcdTY1NzBcbiAqIEBwYXJhbSBwYWdlIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzgwMVxuICogQHBhcmFtIHNpemUgXHU2QkNGXHU5ODc1XHU1OTI3XHU1QzBGXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTUyMDZcdTk4NzVcdTU0Q0RcdTVFOTRcdTdFRDNcdTY3ODRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZTxUPihcbiAgaXRlbXM6IFRbXSxcbiAgdG90YWxJdGVtczogbnVtYmVyLFxuICBwYWdlOiBudW1iZXIgPSAxLFxuICBzaXplOiBudW1iZXIgPSAxMFxuKSB7XG4gIHJldHVybiBjcmVhdGVNb2NrUmVzcG9uc2Uoe1xuICAgIGl0ZW1zLFxuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIHRvdGFsOiB0b3RhbEl0ZW1zLFxuICAgICAgcGFnZSxcbiAgICAgIHNpemUsXG4gICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwodG90YWxJdGVtcyAvIHNpemUpLFxuICAgICAgaGFzTW9yZTogcGFnZSAqIHNpemUgPCB0b3RhbEl0ZW1zXG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZBUElcdTU0Q0RcdTVFOTRcdTVFRjZcdThGREZcbiAqIEBwYXJhbSBtcyBcdTVFRjZcdThGREZcdTZCRUJcdTc5RDJcdTY1NzBcdUZGMENcdTlFRDhcdThCQTQzMDBtc1xuICogQHJldHVybnMgUHJvbWlzZVx1NUJGOVx1OEM2MVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlciA9IDMwMCk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSxcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheVxufTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9xdWVyeS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvcXVlcnkudHNcIjsvKipcbiAqIFx1NjdFNVx1OEJFMk1vY2tcdTY3MERcdTUyQTFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU1QjlFXHU3M0IwXG4gKi9cblxuaW1wb3J0IHsgZGVsYXksIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSwgY3JlYXRlTW9ja1Jlc3BvbnNlLCBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NkEyMVx1NjJERlx1NjdFNVx1OEJFMlx1NjU3MFx1NjM2RVxuY29uc3QgbW9ja1F1ZXJpZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT4ge1xuICBjb25zdCBpZCA9IGBxdWVyeS0ke2kgKyAxfWA7XG4gIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCk7XG4gIFxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIG5hbWU6IGBcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX1gLFxuICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyICR7aSArIDF9IFx1NzY4NFx1NjNDRlx1OEZGMGAsXG4gICAgZm9sZGVySWQ6IGkgJSAzID09PSAwID8gJ2ZvbGRlci0xJyA6IChpICUgMyA9PT0gMSA/ICdmb2xkZXItMicgOiAnZm9sZGVyLTMnKSxcbiAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgZGF0YVNvdXJjZU5hbWU6IGBcdTY1NzBcdTYzNkVcdTZFOTAgJHsoaSAlIDUpICsgMX1gLFxuICAgIHF1ZXJ5VHlwZTogaSAlIDIgPT09IDAgPyAnU1FMJyA6ICdOQVRVUkFMX0xBTkdVQUdFJyxcbiAgICBxdWVyeVRleHQ6IGkgJSAyID09PSAwID8gXG4gICAgICBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCA6IFxuICAgICAgYFx1NjdFNVx1NjI3RVx1NjcwMFx1OEZEMTEwXHU2NzYxJHtpICUgMiA9PT0gMCA/ICdcdThCQTJcdTUzNTUnIDogJ1x1NzUyOFx1NjIzNyd9XHU4QkIwXHU1RjU1YCxcbiAgICBzdGF0dXM6IGkgJSA0ID09PSAwID8gJ0RSQUZUJyA6IChpICUgNCA9PT0gMSA/ICdQVUJMSVNIRUQnIDogKGkgJSA0ID09PSAyID8gJ0RFUFJFQ0FURUQnIDogJ0FSQ0hJVkVEJykpLFxuICAgIHNlcnZpY2VTdGF0dXM6IGkgJSAyID09PSAwID8gJ0VOQUJMRUQnIDogJ0RJU0FCTEVEJyxcbiAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgIHVwZGF0ZWRCeTogeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICBleGVjdXRpb25Db3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApLFxuICAgIGlzRmF2b3JpdGU6IGkgJSAzID09PSAwLFxuICAgIGlzQWN0aXZlOiBpICUgNSAhPT0gMCxcbiAgICBsYXN0RXhlY3V0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgcmVzdWx0Q291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyAxMCxcbiAgICBleGVjdXRpb25UaW1lOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDApICsgMTAsXG4gICAgdGFnczogW2BcdTY4MDdcdTdCN0Uke2krMX1gLCBgXHU3QzdCXHU1NzhCJHtpICUgM31gXSxcbiAgICBjdXJyZW50VmVyc2lvbjoge1xuICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICBxdWVyeUlkOiBpZCxcbiAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICBuYW1lOiAnXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDJyxcbiAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH0sXG4gICAgdmVyc2lvbnM6IFt7XG4gICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfV1cbiAgfTtcbn0pO1xuXG4vLyBcdTkxQ0RcdTdGNkVcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbmV4cG9ydCBmdW5jdGlvbiByZXNldFF1ZXJpZXMoKTogdm9pZCB7XG4gIC8vIFx1NEZERFx1NzU1OVx1NUYxNVx1NzUyOFx1RkYwQ1x1NTNFQVx1OTFDRFx1N0Y2RVx1NTE4NVx1NUJCOVxuICB3aGlsZSAobW9ja1F1ZXJpZXMubGVuZ3RoID4gMCkge1xuICAgIG1vY2tRdWVyaWVzLnBvcCgpO1xuICB9XG4gIFxuICAvLyBcdTkxQ0RcdTY1QjBcdTc1MUZcdTYyMTBcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbiAgQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+IHtcbiAgICBjb25zdCBpZCA9IGBxdWVyeS0ke2kgKyAxfWA7XG4gICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICBtb2NrUXVlcmllcy5wdXNoKHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogYFx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfWAsXG4gICAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfSBcdTc2ODRcdTYzQ0ZcdThGRjBgLFxuICAgICAgZm9sZGVySWQ6IGkgJSAzID09PSAwID8gJ2ZvbGRlci0xJyA6IChpICUgMyA9PT0gMSA/ICdmb2xkZXItMicgOiAnZm9sZGVyLTMnKSxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIGRhdGFTb3VyY2VOYW1lOiBgXHU2NTcwXHU2MzZFXHU2RTkwICR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHF1ZXJ5VHlwZTogaSAlIDIgPT09IDAgPyAnU1FMJyA6ICdOQVRVUkFMX0xBTkdVQUdFJyxcbiAgICAgIHF1ZXJ5VGV4dDogaSAlIDIgPT09IDAgPyBcbiAgICAgICAgYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAgOiBcbiAgICAgICAgYFx1NjdFNVx1NjI3RVx1NjcwMFx1OEZEMTEwXHU2NzYxJHtpICUgMiA9PT0gMCA/ICdcdThCQTJcdTUzNTUnIDogJ1x1NzUyOFx1NjIzNyd9XHU4QkIwXHU1RjU1YCxcbiAgICAgIHN0YXR1czogaSAlIDQgPT09IDAgPyAnRFJBRlQnIDogKGkgJSA0ID09PSAxID8gJ1BVQkxJU0hFRCcgOiAoaSAlIDQgPT09IDIgPyAnREVQUkVDQVRFRCcgOiAnQVJDSElWRUQnKSksXG4gICAgICBzZXJ2aWNlU3RhdHVzOiBpICUgMiA9PT0gMCA/ICdFTkFCTEVEJyA6ICdESVNBQkxFRCcsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNyZWF0ZWRCeTogeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIHVwZGF0ZWRCeTogeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIGV4ZWN1dGlvbkNvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCksXG4gICAgICBpc0Zhdm9yaXRlOiBpICUgMyA9PT0gMCxcbiAgICAgIGlzQWN0aXZlOiBpICUgNSAhPT0gMCxcbiAgICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHJlc3VsdENvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApICsgMTAsXG4gICAgICBleGVjdXRpb25UaW1lOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDApICsgMTAsXG4gICAgICB0YWdzOiBbYFx1NjgwN1x1N0I3RSR7aSsxfWAsIGBcdTdDN0JcdTU3OEIke2kgJSAzfWBdLFxuICAgICAgY3VycmVudFZlcnNpb246IHtcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH0sXG4gICAgICB2ZXJzaW9uczogW3tcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH1dXG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZURlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkZWxheVRpbWUgPSB0eXBlb2YgbW9ja0NvbmZpZy5kZWxheSA9PT0gJ251bWJlcicgPyBtb2NrQ29uZmlnLmRlbGF5IDogMzAwO1xuICByZXR1cm4gZGVsYXkoZGVsYXlUaW1lKTtcbn1cblxuLyoqXG4gKiBcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFcbiAqL1xuY29uc3QgcXVlcnlTZXJ2aWNlID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyaWVzKHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICAgIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLm1vY2tRdWVyaWVzXTtcbiAgICBcbiAgICAvLyBcdTYzMDlcdTU0MERcdTc5RjBcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5uYW1lKSB7XG4gICAgICBjb25zdCBrZXl3b3JkID0gcGFyYW1zLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IFxuICAgICAgICBxLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgICAgKHEuZGVzY3JpcHRpb24gJiYgcS5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uZGF0YVNvdXJjZUlkKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLmRhdGFTb3VyY2VJZCA9PT0gcGFyYW1zLmRhdGFTb3VyY2VJZCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NzJCNlx1NjAwMVx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5xdWVyeVR5cGUpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEucXVlcnlUeXBlID09PSBwYXJhbXMucXVlcnlUeXBlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU2NTM2XHU4NUNGXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uaXNGYXZvcml0ZSkge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5pc0Zhdm9yaXRlID09PSB0cnVlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IGZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmlsdGVyZWRJdGVtcy5sZW5ndGggLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBnZXRRdWVyeShpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gcXVlcnk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBjcmVhdGVRdWVyeShkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBJRFx1RkYwQ1x1NjgzQ1x1NUYwRlx1NEUwRVx1NzNCMFx1NjcwOUlEXHU0RTAwXHU4MUY0XG4gICAgY29uc3QgaWQgPSBgcXVlcnktJHttb2NrUXVlcmllcy5sZW5ndGggKyAxfWA7XG4gICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IG5ld1F1ZXJ5ID0ge1xuICAgICAgaWQsXG4gICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgYFx1NjVCMFx1NjdFNVx1OEJFMiAke2lkfWAsXG4gICAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICAgIGZvbGRlcklkOiBkYXRhLmZvbGRlcklkIHx8IG51bGwsXG4gICAgICBkYXRhU291cmNlSWQ6IGRhdGEuZGF0YVNvdXJjZUlkLFxuICAgICAgZGF0YVNvdXJjZU5hbWU6IGRhdGEuZGF0YVNvdXJjZU5hbWUgfHwgYFx1NjU3MFx1NjM2RVx1NkU5MCAke2RhdGEuZGF0YVNvdXJjZUlkfWAsXG4gICAgICBxdWVyeVR5cGU6IGRhdGEucXVlcnlUeXBlIHx8ICdTUUwnLFxuICAgICAgcXVlcnlUZXh0OiBkYXRhLnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMgfHwgJ0RSQUZUJyxcbiAgICAgIHNlcnZpY2VTdGF0dXM6IGRhdGEuc2VydmljZVN0YXR1cyB8fCAnRElTQUJMRUQnLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIGNyZWF0ZWRCeTogZGF0YS5jcmVhdGVkQnkgfHwgeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIHVwZGF0ZWRCeTogZGF0YS51cGRhdGVkQnkgfHwgeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIGV4ZWN1dGlvbkNvdW50OiAwLFxuICAgICAgaXNGYXZvcml0ZTogZGF0YS5pc0Zhdm9yaXRlIHx8IGZhbHNlLFxuICAgICAgaXNBY3RpdmU6IGRhdGEuaXNBY3RpdmUgfHwgdHJ1ZSxcbiAgICAgIGxhc3RFeGVjdXRlZEF0OiBudWxsLFxuICAgICAgcmVzdWx0Q291bnQ6IDAsXG4gICAgICBleGVjdXRpb25UaW1lOiAwLFxuICAgICAgdGFnczogZGF0YS50YWdzIHx8IFtdLFxuICAgICAgY3VycmVudFZlcnNpb246IHtcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1MjFEXHU1OUNCXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBkYXRhLnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCxcbiAgICAgICAgc3RhdHVzOiAnRFJBRlQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH0sXG4gICAgICB2ZXJzaW9uczogW3tcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1MjFEXHU1OUNCXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBkYXRhLnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCxcbiAgICAgICAgc3RhdHVzOiAnRFJBRlQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH1dXG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTZERkJcdTUyQTBcdTUyMzBcdTUyMTdcdTg4NjhcbiAgICBtb2NrUXVlcmllcy5wdXNoKG5ld1F1ZXJ5KTtcbiAgICBcbiAgICByZXR1cm4gbmV3UXVlcnk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyB1cGRhdGVRdWVyeShpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTg5ODFcdTY2RjRcdTY1QjBcdTc2ODRcdTY3RTVcdThCRTJcdTdEMjJcdTVGMTVcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgdXBkYXRlZFF1ZXJ5ID0ge1xuICAgICAgLi4ubW9ja1F1ZXJpZXNbaW5kZXhdLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEJ5OiBkYXRhLnVwZGF0ZWRCeSB8fCBtb2NrUXVlcmllc1tpbmRleF0udXBkYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH1cbiAgICB9O1xuICAgIFxuICAgIC8vIFx1NjZGRlx1NjM2Mlx1NjdFNVx1OEJFMlxuICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHVwZGF0ZWRRdWVyeTtcbiAgICBcbiAgICByZXR1cm4gdXBkYXRlZFF1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlUXVlcnkoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTg5ODFcdTUyMjBcdTk2NjRcdTc2ODRcdTY3RTVcdThCRTJcdTdEMjJcdTVGMTVcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gICAgbW9ja1F1ZXJpZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzLmZpbmQocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFxdWVyeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1N0VEM1x1Njc5Q1xuICAgIGNvbnN0IGNvbHVtbnMgPSBbJ2lkJywgJ25hbWUnLCAnZW1haWwnLCAnc3RhdHVzJywgJ2NyZWF0ZWRfYXQnXTtcbiAgICBjb25zdCByb3dzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+ICh7XG4gICAgICBpZDogaSArIDEsXG4gICAgICBuYW1lOiBgXHU3NTI4XHU2MjM3ICR7aSArIDF9YCxcbiAgICAgIGVtYWlsOiBgdXNlciR7aSArIDF9QGV4YW1wbGUuY29tYCxcbiAgICAgIHN0YXR1czogaSAlIDIgPT09IDAgPyAnYWN0aXZlJyA6ICdpbmFjdGl2ZScsXG4gICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpXG4gICAgfSkpO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NjI2N1x1ODg0Q1x1N0VERlx1OEJBMVxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHtcbiAgICAgICAgLi4ubW9ja1F1ZXJpZXNbaW5kZXhdLFxuICAgICAgICBleGVjdXRpb25Db3VudDogKG1vY2tRdWVyaWVzW2luZGV4XS5leGVjdXRpb25Db3VudCB8fCAwKSArIDEsXG4gICAgICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHJlc3VsdENvdW50OiByb3dzLmxlbmd0aFxuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnMsXG4gICAgICByb3dzLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5yYW5kb20oKSAqIDAuNSArIDAuMSxcbiAgICAgICAgcm93Q291bnQ6IHJvd3MubGVuZ3RoLFxuICAgICAgICB0b3RhbFBhZ2VzOiAxXG4gICAgICB9LFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgaWQ6IHF1ZXJ5LmlkLFxuICAgICAgICBuYW1lOiBxdWVyeS5uYW1lLFxuICAgICAgICBkYXRhU291cmNlSWQ6IHF1ZXJ5LmRhdGFTb3VyY2VJZFxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjA3XHU2MzYyXHU2N0U1XHU4QkUyXHU2NTM2XHU4NUNGXHU3MkI2XHU2MDAxXG4gICAqL1xuICBhc3luYyB0b2dnbGVGYXZvcml0ZShpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIwN1x1NjM2Mlx1NjUzNlx1ODVDRlx1NzJCNlx1NjAwMVxuICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHtcbiAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgIGlzRmF2b3JpdGU6ICFtb2NrUXVlcmllc1tpbmRleF0uaXNGYXZvcml0ZSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gbW9ja1F1ZXJpZXNbaW5kZXhdO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTM4Nlx1NTNGMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnlIaXN0b3J5KHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVxuICAgIGNvbnN0IHRvdGFsSXRlbXMgPSAyMDtcbiAgICBjb25zdCBoaXN0b3JpZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiB0b3RhbEl0ZW1zIH0sIChfLCBpKSA9PiB7XG4gICAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDM2MDAwMDApLnRvSVNPU3RyaW5nKCk7XG4gICAgICBjb25zdCBxdWVyeUluZGV4ID0gaSAlIG1vY2tRdWVyaWVzLmxlbmd0aDtcbiAgICAgIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGBoaXN0LSR7aSArIDF9YCxcbiAgICAgICAgcXVlcnlJZDogbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0uaWQsXG4gICAgICAgIHF1ZXJ5TmFtZTogbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0ubmFtZSxcbiAgICAgICAgZXhlY3V0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgICBleGVjdXRpb25UaW1lOiBNYXRoLnJhbmRvbSgpICogMC41ICsgMC4xLFxuICAgICAgICByb3dDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEsXG4gICAgICAgIHVzZXJJZDogJ3VzZXIxJyxcbiAgICAgICAgdXNlck5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnLFxuICAgICAgICBzdGF0dXM6IGkgJSA4ID09PSAwID8gJ0ZBSUxFRCcgOiAnU1VDQ0VTUycsXG4gICAgICAgIGVycm9yTWVzc2FnZTogaSAlIDggPT09IDAgPyAnXHU2N0U1XHU4QkUyXHU2MjY3XHU4ODRDXHU4RDg1XHU2NUY2JyA6IG51bGxcbiAgICAgIH07XG4gICAgfSk7XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIHRvdGFsSXRlbXMpO1xuICAgIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gaGlzdG9yaWVzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiB0b3RhbEl0ZW1zLFxuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwodG90YWxJdGVtcyAvIHNpemUpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5VmVyc2lvbnMocXVlcnlJZDogc3RyaW5nLCBwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzLmZpbmQocSA9PiBxLmlkID09PSBxdWVyeUlkKTtcbiAgICBcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTcyNDhcdTY3MkNcdTUyMTdcdTg4NjhcbiAgICByZXR1cm4gcXVlcnkudmVyc2lvbnMgfHwgW107XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBjcmVhdGVRdWVyeVZlcnNpb24ocXVlcnlJZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IHF1ZXJ5SWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3F1ZXJ5SWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NzI0OFx1NjcyQ1xuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbaW5kZXhdO1xuICAgIGNvbnN0IG5ld1ZlcnNpb25OdW1iZXIgPSAocXVlcnkudmVyc2lvbnM/Lmxlbmd0aCB8fCAwKSArIDE7XG4gICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgIFxuICAgIGNvbnN0IG5ld1ZlcnNpb24gPSB7XG4gICAgICBpZDogYHZlci0ke3F1ZXJ5SWR9LSR7bmV3VmVyc2lvbk51bWJlcn1gLFxuICAgICAgcXVlcnlJZCxcbiAgICAgIHZlcnNpb25OdW1iZXI6IG5ld1ZlcnNpb25OdW1iZXIsXG4gICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgYFx1NzI0OFx1NjcyQyAke25ld1ZlcnNpb25OdW1iZXJ9YCxcbiAgICAgIHNxbDogZGF0YS5zcWwgfHwgcXVlcnkucXVlcnlUZXh0IHx8ICcnLFxuICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCB8fCBxdWVyeS5kYXRhU291cmNlSWQsXG4gICAgICBzdGF0dXM6ICdEUkFGVCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTRFNEJcdTUyNERcdTcyNDhcdTY3MkNcdTc2ODRpc0xhdGVzdFx1NjgwN1x1NUZEN1xuICAgIGlmIChxdWVyeS52ZXJzaW9ucyAmJiBxdWVyeS52ZXJzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBxdWVyeS52ZXJzaW9ucyA9IHF1ZXJ5LnZlcnNpb25zLm1hcCh2ID0+ICh7XG4gICAgICAgIC4uLnYsXG4gICAgICAgIGlzTGF0ZXN0OiBmYWxzZVxuICAgICAgfSkpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTZERkJcdTUyQTBcdTY1QjBcdTcyNDhcdTY3MkNcbiAgICBpZiAoIXF1ZXJ5LnZlcnNpb25zKSB7XG4gICAgICBxdWVyeS52ZXJzaW9ucyA9IFtdO1xuICAgIH1cbiAgICBxdWVyeS52ZXJzaW9ucy5wdXNoKG5ld1ZlcnNpb24pO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1xuICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHtcbiAgICAgIC4uLnF1ZXJ5LFxuICAgICAgY3VycmVudFZlcnNpb246IG5ld1ZlcnNpb24sXG4gICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIG5ld1ZlcnNpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1M0QxXHU1RTAzXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBwdWJsaXNoUXVlcnlWZXJzaW9uKHZlcnNpb25JZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU1MzA1XHU1NDJCXHU2QjY0XHU3MjQ4XHU2NzJDXHU3Njg0XHU2N0U1XHU4QkUyXG4gICAgbGV0IHF1ZXJ5ID0gbnVsbDtcbiAgICBsZXQgdmVyc2lvbkluZGV4ID0gLTE7XG4gICAgbGV0IHF1ZXJ5SW5kZXggPSAtMTtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vY2tRdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMpIHtcbiAgICAgICAgY29uc3QgdkluZGV4ID0gbW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMuZmluZEluZGV4KHYgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICAgICAgaWYgKHZJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBxdWVyeSA9IG1vY2tRdWVyaWVzW2ldO1xuICAgICAgICAgIHZlcnNpb25JbmRleCA9IHZJbmRleDtcbiAgICAgICAgICBxdWVyeUluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoIXF1ZXJ5IHx8IHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU3MjQ4XHU2NzJDXHU3MkI2XHU2MDAxXG4gICAgY29uc3QgdXBkYXRlZFZlcnNpb24gPSB7XG4gICAgICAuLi5xdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIHB1Ymxpc2hlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF0gPSB1cGRhdGVkVmVyc2lvbjtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTcyQjZcdTYwMDFcbiAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgIC4uLnF1ZXJ5LFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB1cGRhdGVkVmVyc2lvbixcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdXBkYXRlZFZlcnNpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1RTlGXHU1RjAzXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBkZXByZWNhdGVRdWVyeVZlcnNpb24odmVyc2lvbklkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTUzMDVcdTU0MkJcdTZCNjRcdTcyNDhcdTY3MkNcdTc2ODRcdTY3RTVcdThCRTJcbiAgICBsZXQgcXVlcnkgPSBudWxsO1xuICAgIGxldCB2ZXJzaW9uSW5kZXggPSAtMTtcbiAgICBsZXQgcXVlcnlJbmRleCA9IC0xO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9ja1F1ZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtb2NrUXVlcmllc1tpXS52ZXJzaW9ucykge1xuICAgICAgICBjb25zdCB2SW5kZXggPSBtb2NrUXVlcmllc1tpXS52ZXJzaW9ucy5maW5kSW5kZXgodiA9PiB2LmlkID09PSB2ZXJzaW9uSWQpO1xuICAgICAgICBpZiAodkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbaV07XG4gICAgICAgICAgdmVyc2lvbkluZGV4ID0gdkluZGV4O1xuICAgICAgICAgIHF1ZXJ5SW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmICghcXVlcnkgfHwgdmVyc2lvbkluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7dmVyc2lvbklkfVx1NzY4NFx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ2ApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTcyNDhcdTY3MkNcdTcyQjZcdTYwMDFcbiAgICBjb25zdCB1cGRhdGVkVmVyc2lvbiA9IHtcbiAgICAgIC4uLnF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF0sXG4gICAgICBzdGF0dXM6ICdERVBSRUNBVEVEJyxcbiAgICAgIGRlcHJlY2F0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdID0gdXBkYXRlZFZlcnNpb247XG4gICAgXG4gICAgLy8gXHU1OTgyXHU2NzlDXHU1RTlGXHU1RjAzXHU3Njg0XHU2NjJGXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDXHVGRjBDXHU1MjE5XHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU3MkI2XHU2MDAxXG4gICAgaWYgKHF1ZXJ5LmN1cnJlbnRWZXJzaW9uICYmIHF1ZXJ5LmN1cnJlbnRWZXJzaW9uLmlkID09PSB2ZXJzaW9uSWQpIHtcbiAgICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgICAuLi5xdWVyeSxcbiAgICAgICAgc3RhdHVzOiAnREVQUkVDQVRFRCcsXG4gICAgICAgIGN1cnJlbnRWZXJzaW9uOiB1cGRhdGVkVmVyc2lvbixcbiAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgICAuLi5xdWVyeSxcbiAgICAgICAgdmVyc2lvbnM6IHF1ZXJ5LnZlcnNpb25zLFxuICAgICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NkZDMFx1NkQzQlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgYWN0aXZhdGVRdWVyeVZlcnNpb24ocXVlcnlJZDogc3RyaW5nLCB2ZXJzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5SW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBxdWVyeUlkKTtcbiAgICBcbiAgICBpZiAocXVlcnlJbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3F1ZXJ5SWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF07XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU3MjQ4XHU2NzJDXG4gICAgaWYgKCFxdWVyeS52ZXJzaW9ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3RTVcdThCRTIgJHtxdWVyeUlkfSBcdTZDQTFcdTY3MDlcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgdmVyc2lvbkluZGV4ID0gcXVlcnkudmVyc2lvbnMuZmluZEluZGV4KHYgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICBcbiAgICBpZiAodmVyc2lvbkluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7dmVyc2lvbklkfVx1NzY4NFx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ2ApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTg5ODFcdTZGQzBcdTZEM0JcdTc2ODRcdTcyNDhcdTY3MkNcbiAgICBjb25zdCB2ZXJzaW9uVG9BY3RpdmF0ZSA9IHF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF07XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDXHU1NDhDXHU2N0U1XHU4QkUyXHU3MkI2XHU2MDAxXG4gICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB2ZXJzaW9uVG9BY3RpdmF0ZSxcbiAgICAgIHN0YXR1czogdmVyc2lvblRvQWN0aXZhdGUuc3RhdHVzLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiB2ZXJzaW9uVG9BY3RpdmF0ZTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcXVlcnlTZXJ2aWNlOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTZDNlx1NEUyRFx1NUJGQ1x1NTFGQVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRBUEkgTW9ja1x1NjcwRFx1NTJBMVx1NTE2NVx1NTNFM1x1NzBCOVxuICovXG5cbi8vIFx1NUJGQ1x1NTE2NVx1NjU3MFx1NjM2RVx1NkU5MFx1NjcwRFx1NTJBMVxuaW1wb3J0IGRhdGFTb3VyY2UgZnJvbSAnLi9kYXRhc291cmNlJztcbi8vIFx1NUJGQ1x1NTE2NVx1NUI4Q1x1NjU3NFx1NzY4NFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMVx1NUI5RVx1NzNCMFxuaW1wb3J0IHF1ZXJ5U2VydmljZUltcGxlbWVudGF0aW9uIGZyb20gJy4vcXVlcnknO1xuXG4vLyBcdTVCRkNcdTUxNjVcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbmltcG9ydCB7IFxuICBjcmVhdGVNb2NrUmVzcG9uc2UsIFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSwgXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXkgXG59IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMU1vY2tcbiAqIEBkZXByZWNhdGVkIFx1NEY3Rlx1NzUyOFx1NEVDRSAnLi9xdWVyeScgXHU1QkZDXHU1MTY1XHU3Njg0XHU1QjhDXHU2NTc0XHU1QjlFXHU3M0IwXHU0RUUzXHU2NkZGXG4gKi9cbmNvbnN0IHF1ZXJ5ID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyaWVzKHBhcmFtczogeyBwYWdlOiBudW1iZXI7IHNpemU6IG51bWJlcjsgfSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSh7XG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGlkOiAncTEnLCBuYW1lOiAnXHU3NTI4XHU2MjM3XHU1MjA2XHU2NzkwXHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTU3MzBcdTUzM0FcdTdFREZcdThCQTFcdTc1MjhcdTYyMzdcdTZDRThcdTUxOENcdTY1NzBcdTYzNkUnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTInLCBuYW1lOiAnXHU5NTAwXHU1NTJFXHU0RTFBXHU3RUU5XHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTY3MDhcdTdFREZcdThCQTFcdTk1MDBcdTU1MkVcdTk4OUQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTMnLCBuYW1lOiAnXHU1RTkzXHU1QjU4XHU1MjA2XHU2NzkwJywgZGVzY3JpcHRpb246ICdcdTc2RDFcdTYzQTdcdTVFOTNcdTVCNThcdTZDMzRcdTVFNzMnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgXSxcbiAgICAgIHRvdGFsOiAzLFxuICAgICAgcGFnZTogcGFyYW1zLnBhZ2UsXG4gICAgICBzaXplOiBwYXJhbXMuc2l6ZVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5KGlkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6ICdcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgc3FsOiAnU0VMRUNUICogRlJPTSB1c2VycyBXSEVSRSBzdGF0dXMgPSAkMScsXG4gICAgICBwYXJhbWV0ZXJzOiBbJ2FjdGl2ZSddLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnkoZGF0YTogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBxdWVyeS0ke0RhdGUubm93KCl9YCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyB1cGRhdGVRdWVyeShpZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlUXVlcnkoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnM6IFsnaWQnLCAnbmFtZScsICdlbWFpbCcsICdzdGF0dXMnXSxcbiAgICAgIHJvd3M6IFtcbiAgICAgICAgeyBpZDogMSwgbmFtZTogJ1x1NUYyMFx1NEUwOScsIGVtYWlsOiAnemhhbmdAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIG5hbWU6ICdcdTY3NEVcdTU2REInLCBlbWFpbDogJ2xpQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICAgICAgICB7IGlkOiAzLCBuYW1lOiAnXHU3MzhCXHU0RTk0JywgZW1haWw6ICd3YW5nQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnaW5hY3RpdmUnIH0sXG4gICAgICBdLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgZXhlY3V0aW9uVGltZTogMC4yMzUsXG4gICAgICAgIHJvd0NvdW50OiAzLFxuICAgICAgICB0b3RhbFBhZ2VzOiAxXG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcblxuLyoqXG4gKiBcdTVCRkNcdTUxRkFcdTYyNDBcdTY3MDlcdTY3MERcdTUyQTFcbiAqL1xuY29uc3Qgc2VydmljZXMgPSB7XG4gIGRhdGFTb3VyY2UsXG4gIHF1ZXJ5OiBxdWVyeVNlcnZpY2VJbXBsZW1lbnRhdGlvblxufTtcblxuLy8gXHU1QkZDXHU1MUZBbW9jayBzZXJ2aWNlXHU1REU1XHU1MTc3XG5leHBvcnQge1xuICBjcmVhdGVNb2NrUmVzcG9uc2UsXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5XG59O1xuXG4vLyBcdTVCRkNcdTUxRkFcdTU0MDRcdTRFMkFcdTY3MERcdTUyQTFcbmV4cG9ydCBjb25zdCBkYXRhU291cmNlU2VydmljZSA9IHNlcnZpY2VzLmRhdGFTb3VyY2U7XG5leHBvcnQgY29uc3QgcXVlcnlTZXJ2aWNlID0gc2VydmljZXMucXVlcnk7XG5cbi8vIFx1OUVEOFx1OEJBNFx1NUJGQ1x1NTFGQVx1NjI0MFx1NjcwOVx1NjcwRFx1NTJBMVxuZXhwb3J0IGRlZmF1bHQgc2VydmljZXM7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHNcIjtpbXBvcnQgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgKiBhcyBodHRwIGZyb20gJ2h0dHAnO1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NEUwMFx1NEUyQVx1N0I4MFx1NTM1NVx1NzY4NFx1NkQ0Qlx1OEJENVx1NEUyRFx1OTVGNFx1NEVGNlxuICogXHU1M0VBXHU1OTA0XHU3NDA2L2FwaS90ZXN0XHU4REVGXHU1Rjg0XHVGRjBDXHU3NTI4XHU0RThFXHU2RDRCXHU4QkQ1TW9ja1x1N0NGQlx1N0VERlx1NjYyRlx1NTQyNlx1NkI2M1x1NUUzOFx1NURFNVx1NEY1Q1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2ltcGxlTWlkZGxld2FyZSgpIHtcbiAgY29uc29sZS5sb2coJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NURGMlx1NTIxQlx1NUVGQVx1NkQ0Qlx1OEJENVx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NUMwNlx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFx1NzY4NFx1OEJGN1x1NkM0MicpO1xuICBcbiAgcmV0dXJuIGZ1bmN0aW9uIHNpbXBsZU1pZGRsZXdhcmUoXG4gICAgcmVxOiBodHRwLkluY29taW5nTWVzc2FnZSxcbiAgICByZXM6IGh0dHAuU2VydmVyUmVzcG9uc2UsXG4gICAgbmV4dDogQ29ubmVjdC5OZXh0RnVuY3Rpb25cbiAgKSB7XG4gICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kIHx8ICdVTktOT1dOJztcbiAgICBcbiAgICAvLyBcdTUzRUFcdTU5MDRcdTc0MDYvYXBpL3Rlc3RcdThERUZcdTVGODRcbiAgICBpZiAodXJsID09PSAnL2FwaS90ZXN0Jykge1xuICAgICAgY29uc29sZS5sb2coYFtcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NjUzNlx1NTIzMFx1NkQ0Qlx1OEJENVx1OEJGN1x1NkM0MjogJHttZXRob2R9ICR7dXJsfWApO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICAvLyBcdThCQkVcdTdGNkVDT1JTXHU1OTM0XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbicpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1OTA0XHU3NDA2T1BUSU9OU1x1OTg4NFx1NjhDMFx1OEJGN1x1NkM0MlxuICAgICAgICBpZiAobWV0aG9kID09PSAnT1BUSU9OUycpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1OTA0XHU3NDA2T1BUSU9OU1x1OTg4NFx1NjhDMFx1OEJGN1x1NkM0MicpO1xuICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjA0O1xuICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1Nzg2RVx1NEZERFx1ODk4Nlx1NzZENlx1NjM4OVx1NjI0MFx1NjcwOVx1NURGMlx1NjcwOVx1NzY4NENvbnRlbnQtVHlwZVx1RkYwQ1x1OTA3Rlx1NTE0RFx1ODhBQlx1NTQwRVx1N0VFRFx1NEUyRFx1OTVGNFx1NEVGNlx1NjZGNFx1NjUzOVxuICAgICAgICByZXMucmVtb3ZlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTUxQzZcdTU5MDdcdTU0Q0RcdTVFOTRcdTY1NzBcdTYzNkVcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogJ1x1N0I4MFx1NTM1NVx1NkQ0Qlx1OEJENVx1NEUyRFx1OTVGNFx1NEVGNlx1NTRDRFx1NUU5NFx1NjIxMFx1NTI5RicsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzLFxuICAgICAgICAgICAgcGFyYW1zOiB1cmwuaW5jbHVkZXMoJz8nKSA/IHVybC5zcGxpdCgnPycpWzFdIDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTNEMVx1OTAwMVx1NTRDRFx1NUU5NFx1NTI0RFx1Nzg2RVx1NEZERFx1NEUyRFx1NjVBRFx1OEJGN1x1NkM0Mlx1OTRGRVxuICAgICAgICBjb25zb2xlLmxvZygnW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1M0QxXHU5MDAxXHU2RDRCXHU4QkQ1XHU1NENEXHU1RTk0Jyk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VEYXRhLCBudWxsLCAyKSk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTRFMERcdThDMDNcdTc1MjhuZXh0KClcdUZGMENcdTc4NkVcdTRGRERcdThCRjdcdTZDNDJcdTUyMzBcdTZCNjRcdTdFRDNcdTY3NUZcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gXHU1OTA0XHU3NDA2XHU5NTE5XHU4QkVGXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NjVGNlx1NTFGQVx1OTUxOTonLCBlcnJvcik7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTZFMDVcdTk2NjRcdTVERjJcdTY3MDlcdTc2ODRcdTU5MzRcdUZGMENcdTkwN0ZcdTUxNERDb250ZW50LVR5cGVcdTg4QUJcdTY2RjRcdTY1MzlcbiAgICAgICAgcmVzLnJlbW92ZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiAnXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU2NUY2XHU1MUZBXHU5NTE5JyxcbiAgICAgICAgICBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpXG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NEUwRFx1OEMwM1x1NzUyOG5leHQoKVx1RkYwQ1x1Nzg2RVx1NEZERFx1OEJGN1x1NkM0Mlx1NTIzMFx1NkI2NFx1N0VEM1x1Njc1RlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NEUwRFx1NTkwNFx1NzQwNlx1NzY4NFx1OEJGN1x1NkM0Mlx1NEVBNFx1N0VEOVx1NEUwQlx1NEUwMFx1NEUyQVx1NEUyRFx1OTVGNFx1NEVGNlxuICAgIG5leHQoKTtcbiAgfTtcbn0gIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwWSxTQUFTLGNBQWMsZUFBZ0M7QUFDamMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGdCQUFnQjtBQUN6QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGtCQUFrQjs7O0FD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cUJBQXFCO0FBR3BELFFBQU0sZ0JBQWdCO0FBRXRCLFVBQVEsSUFBSSxnREFBa0IsSUFBSSxFQUFFO0FBQ3BDLFVBQVEsSUFBSSxnQ0FBc0IsYUFBYSxpQkFBTyxjQUFJLEVBQUU7QUFDNUQsVUFBUSxJQUFJLG9EQUFzQixnQkFBZ0IsaUJBQU8sY0FBSSxFQUFFO0FBQy9ELFVBQVEsSUFBSSwyQkFBaUIsYUFBYSxpQkFBTyxjQUFJLEVBQUU7QUFHdkQsUUFBTSxhQUFhLG9CQUFvQixZQUFZLGFBQWE7QUFHaEUsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBO0FBQUEsTUFFUCxHQUFJLGFBQWEsQ0FBQyxVQUFVLElBQUksQ0FBQztBQUFBLE1BQ2pDLElBQUk7QUFBQSxJQUNOO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQSxNQUVOLEtBQUssYUFBYSxRQUFRO0FBQUEsUUFDeEIsVUFBVTtBQUFBLFFBQ1YsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLE1BQ2Q7QUFBQTtBQUFBLE1BRUEsT0FBTyxDQUFDO0FBQUEsSUFDVjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1AsU0FBUyxDQUFDLGFBQWEsWUFBWTtBQUFBLE1BQ3JDO0FBQUEsTUFDQSxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixtQkFBbUI7QUFBQSxRQUNyQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxlQUFlO0FBQUEsUUFDakI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBO0FBQUEsTUFFWixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsU0FBUztBQUFBO0FBQUEsUUFFUDtBQUFBO0FBQUEsUUFFQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsT0FBTztBQUFBLElBQ1Q7QUFBQTtBQUFBLElBRUEsVUFBVTtBQUFBO0FBQUEsSUFFVixTQUFTO0FBQUEsTUFDUCxhQUFhO0FBQUEsUUFDWCw0QkFBNEI7QUFBQSxNQUM5QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsiZGVsYXkiLCAic2ltdWxhdGVEZWxheSIsICJxdWVyeVNlcnZpY2UiLCAiZGVsYXkiLCAicXVlcnlTZXJ2aWNlIl0KfQo=
