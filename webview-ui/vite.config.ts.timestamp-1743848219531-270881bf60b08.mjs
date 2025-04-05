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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50cyIsICJzcmMvbW9jay9jb25maWcudHMiLCAic3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHMiLCAic3JjL21vY2svc2VydmljZXMvdXRpbHMudHMiLCAic3JjL21vY2svc2VydmljZXMvcXVlcnkudHMiLCAic3JjL21vY2svc2VydmljZXMvaW5kZXgudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYsIFBsdWdpbiwgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAndGFpbHdpbmRjc3MnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcbmltcG9ydCBjcmVhdGVNb2NrTWlkZGxld2FyZSBmcm9tICcuL3NyYy9tb2NrL21pZGRsZXdhcmUnXG5pbXBvcnQgeyBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlIH0gZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZSdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCdcblxuLy8gXHU1RjNBXHU1MjM2XHU5MUNBXHU2NTNFXHU3QUVGXHU1M0UzXHU1MUZEXHU2NTcwXG5mdW5jdGlvbiBraWxsUG9ydChwb3J0OiBudW1iZXIpIHtcbiAgY29uc29sZS5sb2coYFtWaXRlXSBcdTY4QzBcdTY3RTVcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTUzNjBcdTc1MjhcdTYwQzVcdTUxQjVgKTtcbiAgdHJ5IHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgZXhlY1N5bmMoYG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH1gKTtcbiAgICAgIGV4ZWNTeW5jKGB0YXNra2lsbCAvRiAvcGlkICQobmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fSB8IGF3ayAne3ByaW50ICQ1fScpYCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBleGVjU3luYyhgbHNvZiAtaSA6JHtwb3J0fSAtdCB8IHhhcmdzIGtpbGwgLTlgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU1REYyXHU5MUNBXHU2NTNFXHU3QUVGXHU1M0UzICR7cG9ydH1gKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU3QUVGXHU1M0UzICR7cG9ydH0gXHU2NzJBXHU4OEFCXHU1MzYwXHU3NTI4XHU2MjE2XHU2NUUwXHU2Q0Q1XHU5MUNBXHU2NTNFYCk7XG4gIH1cbn1cblxuLy8gXHU1RjNBXHU1MjM2XHU2RTA1XHU3NDA2Vml0ZVx1N0YxM1x1NUI1OFxuZnVuY3Rpb24gY2xlYW5WaXRlQ2FjaGUoKSB7XG4gIGNvbnNvbGUubG9nKCdbVml0ZV0gXHU2RTA1XHU3NDA2XHU0RjlEXHU4RDU2XHU3RjEzXHU1QjU4Jyk7XG4gIGNvbnN0IGNhY2hlUGF0aHMgPSBbXG4gICAgJy4vbm9kZV9tb2R1bGVzLy52aXRlJyxcbiAgICAnLi9ub2RlX21vZHVsZXMvLnZpdGVfKicsXG4gICAgJy4vLnZpdGUnLFxuICAgICcuL2Rpc3QnLFxuICAgICcuL3RtcCcsXG4gICAgJy4vLnRlbXAnXG4gIF07XG4gIFxuICBjYWNoZVBhdGhzLmZvckVhY2goY2FjaGVQYXRoID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoY2FjaGVQYXRoKSkge1xuICAgICAgICBpZiAoZnMubHN0YXRTeW5jKGNhY2hlUGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgIGV4ZWNTeW5jKGBybSAtcmYgJHtjYWNoZVBhdGh9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMudW5saW5rU3luYyhjYWNoZVBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU1REYyXHU1MjIwXHU5NjY0OiAke2NhY2hlUGF0aH1gKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjVFMFx1NkNENVx1NTIyMFx1OTY2NDogJHtjYWNoZVBhdGh9YCwgZSk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gXHU2RTA1XHU3NDA2Vml0ZVx1N0YxM1x1NUI1OFxuY2xlYW5WaXRlQ2FjaGUoKTtcblxuLy8gXHU1QzFEXHU4QkQ1XHU5MUNBXHU2NTNFXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU3QUVGXHU1M0UzXG5raWxsUG9ydCg4MDgwKTtcblxuLy8gXHU1MjFCXHU1RUZBTW9jayBBUElcdTYzRDJcdTRFRjZcbmZ1bmN0aW9uIGNyZWF0ZU1vY2tBcGlQbHVnaW4odXNlTW9jazogYm9vbGVhbiwgdXNlU2ltcGxlTW9jazogYm9vbGVhbik6IFBsdWdpbiB8IG51bGwge1xuICBpZiAoIXVzZU1vY2sgJiYgIXVzZVNpbXBsZU1vY2spIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBcbiAgLy8gXHU1MkEwXHU4RjdEXHU0RTJEXHU5NUY0XHU0RUY2XG4gIGNvbnN0IG1vY2tNaWRkbGV3YXJlID0gdXNlTW9jayA/IGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCkgOiBudWxsO1xuICBjb25zdCBzaW1wbGVNaWRkbGV3YXJlID0gdXNlU2ltcGxlTW9jayA/IGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUoKSA6IG51bGw7XG4gIFxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLXBsdWdpbi1tb2NrLWFwaScsXG4gICAgLy8gXHU1MTczXHU5NTJFXHU3MEI5XHVGRjFBXHU0RjdGXHU3NTI4IHByZSBcdTc4NkVcdTRGRERcdTZCNjRcdTYzRDJcdTRFRjZcdTUxNDhcdTRFOEVcdTUxODVcdTdGNkVcdTYzRDJcdTRFRjZcdTYyNjdcdTg4NENcbiAgICBlbmZvcmNlOiAncHJlJyBhcyBjb25zdCxcbiAgICAvLyBcdTU3MjhcdTY3MERcdTUyQTFcdTU2NjhcdTUyMUJcdTVFRkFcdTRFNEJcdTUyNERcdTkxNERcdTdGNkVcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAvLyBcdTY2RkZcdTYzNjJcdTUzOUZcdTU5Q0JcdThCRjdcdTZDNDJcdTU5MDRcdTc0MDZcdTU2NjhcdUZGMENcdTRGN0ZcdTYyMTFcdTRFRUNcdTc2ODRcdTRFMkRcdTk1RjRcdTRFRjZcdTUxNzdcdTY3MDlcdTY3MDBcdTlBRDhcdTRGMThcdTUxNDhcdTdFQTdcbiAgICAgIGNvbnN0IG9yaWdpbmFsSGFuZGxlciA9IHNlcnZlci5taWRkbGV3YXJlcy5oYW5kbGU7XG4gICAgICBcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy5oYW5kbGUgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1M0VBXHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aCgnL2FwaS8nKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU2OEMwXHU2RDRCXHU1MjMwQVBJXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsfWApO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1NEYxOFx1NTE0OFx1NTkwNFx1NzQwNlx1NzI3OVx1NUI5QVx1NkQ0Qlx1OEJENUFQSVxuICAgICAgICAgIGlmICh1c2VTaW1wbGVNb2NrICYmIHNpbXBsZU1pZGRsZXdhcmUgJiYgdXJsLnN0YXJ0c1dpdGgoJy9hcGkvdGVzdCcpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTYzRDJcdTRFRjZdIFx1NEY3Rlx1NzUyOFx1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNjogJHt1cmx9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFx1OEJCRVx1N0Y2RVx1NEUwMFx1NEUyQVx1NjgwN1x1OEJCMFx1RkYwQ1x1OTYzMlx1NkI2Mlx1NTE3Nlx1NEVENlx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgKHJlcSBhcyBhbnkpLl9tb2NrSGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBzaW1wbGVNaWRkbGV3YXJlKHJlcSwgcmVzLCAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTUxRkFcdTk1MTk6YCwgZXJyKTtcbiAgICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIShyZXMgYXMgU2VydmVyUmVzcG9uc2UpLndyaXRhYmxlRW5kZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTU0Q0RcdTVFOTRcdTZDQTFcdTY3MDlcdTdFRDNcdTY3NUZcdUZGMENcdTdFRTdcdTdFRURcdTU5MDRcdTc0MDZcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTUxNzZcdTRFRDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgICBpZiAodXNlTW9jayAmJiBtb2NrTWlkZGxld2FyZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTRGN0ZcdTc1MjhNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2OiAke3VybH1gKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU4QkJFXHU3RjZFXHU0RTAwXHU0RTJBXHU2ODA3XHU4QkIwXHVGRjBDXHU5NjMyXHU2QjYyXHU1MTc2XHU0RUQ2XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyXG4gICAgICAgICAgICAocmVxIGFzIGFueSkuX21vY2tIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG1vY2tNaWRkbGV3YXJlKHJlcSwgcmVzLCAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtNb2NrXHU2M0QyXHU0RUY2XSBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU1MUZBXHU5NTE5OmAsIGVycik7XG4gICAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEocmVzIGFzIFNlcnZlclJlc3BvbnNlKS53cml0YWJsZUVuZGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NENEXHU1RTk0XHU2Q0ExXHU2NzA5XHU3RUQzXHU2NzVGXHVGRjBDXHU3RUU3XHU3RUVEXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1NUJGOVx1NEU4RVx1OTc1RUFQSVx1OEJGN1x1NkM0Mlx1RkYwQ1x1NEY3Rlx1NzUyOFx1NTM5Rlx1NTlDQlx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgICByZXR1cm4gb3JpZ2luYWxIYW5kbGVyLmNhbGwoc2VydmVyLm1pZGRsZXdhcmVzLCByZXEsIHJlcywgbmV4dCk7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxuLy8gXHU1N0ZBXHU2NzJDXHU5MTREXHU3RjZFXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIC8vIFx1NTJBMFx1OEY3RFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxuICBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJIHx8ICdmYWxzZSc7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9jayBBUEkgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgdXNlTW9ja0FwaSA9IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZSc7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTc5ODFcdTc1MjhITVIgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgZGlzYWJsZUhtciA9IHByb2Nlc3MuZW52LlZJVEVfRElTQUJMRV9ITVIgPT09ICd0cnVlJztcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1NEY3Rlx1NzUyOFx1N0I4MFx1NTM1NVx1NkQ0Qlx1OEJENVx1NkEyMVx1NjJERkFQSVxuICBjb25zdCB1c2VTaW1wbGVNb2NrID0gdHJ1ZTtcbiAgXG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gXHU4RkQwXHU4ODRDXHU2QTIxXHU1RjBGOiAke21vZGV9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gTW9jayBBUEk6ICR7dXNlTW9ja0FwaSA/ICdcdTU0MkZcdTc1MjgnIDogJ1x1Nzk4MVx1NzUyOCd9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gXHU3QjgwXHU1MzU1TW9ja1x1NkQ0Qlx1OEJENTogJHt1c2VTaW1wbGVNb2NrID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFNb2NrXHU2M0QyXHU0RUY2XG4gIGNvbnN0IG1vY2tQbHVnaW4gPSBjcmVhdGVNb2NrQXBpUGx1Z2luKHVzZU1vY2tBcGksIHVzZVNpbXBsZU1vY2spO1xuICBcbiAgLy8gXHU5MTREXHU3RjZFXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgLy8gXHU2REZCXHU1MkEwTW9ja1x1NjNEMlx1NEVGNlx1RkYwOFx1NTk4Mlx1Njc5Q1x1NTQyRlx1NzUyOFx1RkYwOVxuICAgICAgLi4uKG1vY2tQbHVnaW4gPyBbbW9ja1BsdWdpbl0gOiBbXSksXG4gICAgICB2dWUoKSxcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogODA4MCxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgLy8gSE1SXHU5MTREXHU3RjZFXG4gICAgICBobXI6IGRpc2FibGVIbXIgPyBmYWxzZSA6IHtcbiAgICAgICAgcHJvdG9jb2w6ICd3cycsXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBjbGllbnRQb3J0OiA4MDgwLFxuICAgICAgfSxcbiAgICAgIC8vIFx1Nzk4MVx1NzUyOFx1NEVFM1x1NzQwNlx1RkYwQ1x1OEJBOVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NjI0MFx1NjcwOVx1OEJGN1x1NkM0MlxuICAgICAgcHJveHk6IHt9XG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzLCBhdXRvcHJlZml4ZXJdLFxuICAgICAgfSxcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgbGVzczoge1xuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAvLyBcdTUzMDVcdTU0MkJcdTU3RkFcdTY3MkNcdTRGOURcdThENTZcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ3Z1ZScsIFxuICAgICAgICAndnVlLXJvdXRlcicsXG4gICAgICAgICdwaW5pYScsXG4gICAgICAgICdheGlvcycsXG4gICAgICAgICdkYXlqcycsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZScsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZS9lcy9sb2NhbGUvemhfQ04nXG4gICAgICBdLFxuICAgICAgLy8gXHU2MzkyXHU5NjY0XHU3Mjc5XHU1QjlBXHU0RjlEXHU4RDU2XG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgIC8vIFx1NjM5Mlx1OTY2NFx1NjNEMlx1NEVGNlx1NEUyRFx1NzY4NFx1NjcwRFx1NTJBMVx1NTY2OE1vY2tcbiAgICAgICAgJ3NyYy9wbHVnaW5zL3NlcnZlck1vY2sudHMnLFxuICAgICAgICAvLyBcdTYzOTJcdTk2NjRmc2V2ZW50c1x1NjcyQ1x1NTczMFx1NkEyMVx1NTc1N1x1RkYwQ1x1OTA3Rlx1NTE0RFx1Njc4NFx1NUVGQVx1OTUxOVx1OEJFRlxuICAgICAgICAnZnNldmVudHMnXG4gICAgICBdLFxuICAgICAgLy8gXHU3ODZFXHU0RkREXHU0RjlEXHU4RDU2XHU5ODg0XHU2Nzg0XHU1RUZBXHU2QjYzXHU3ODZFXHU1QjhDXHU2MjEwXG4gICAgICBmb3JjZTogdHJ1ZSxcbiAgICB9LFxuICAgIC8vIFx1NEY3Rlx1NzUyOFx1NTM1NVx1NzJFQ1x1NzY4NFx1N0YxM1x1NUI1OFx1NzZFRVx1NUY1NVxuICAgIGNhY2hlRGlyOiAnbm9kZV9tb2R1bGVzLy52aXRlX2NhY2hlJyxcbiAgICAvLyBcdTk2MzJcdTZCNjJcdTU4MDZcdTY4MDhcdTZFQTJcdTUxRkFcbiAgICBlc2J1aWxkOiB7XG4gICAgICBsb2dPdmVycmlkZToge1xuICAgICAgICAndGhpcy1pcy11bmRlZmluZWQtaW4tZXNtJzogJ3NpbGVudCdcbiAgICAgIH0sXG4gICAgfVxuICB9XG59KTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1N0JBMVx1NzQwNlx1NkEyMVx1NTc1N1xuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRIVFRQXHU4QkY3XHU2QzQyXHU2MkU2XHU2MjJBXHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU3NTI4XHU0RThFXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XG4gKiBcdThEMUZcdThEMjNcdTdCQTFcdTc0MDZcdTU0OENcdTUyMDZcdTUzRDFcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTUyMzBcdTVCRjlcdTVFOTRcdTc2ODRcdTY3MERcdTUyQTFcdTU5MDRcdTc0MDZcdTUxRkRcdTY1NzBcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IEluY29taW5nTWVzc2FnZSwgU2VydmVyUmVzcG9uc2UgfSBmcm9tICdodHRwJztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IG1vY2tDb25maWcsIHNob3VsZE1vY2tSZXF1ZXN0LCBsb2dNb2NrIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU1QkZDXHU1MTY1XHU2NzBEXHU1MkExXG5pbXBvcnQgeyBkYXRhU291cmNlU2VydmljZSwgcXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMnO1xuXG4vLyBcdTU5MDRcdTc0MDZDT1JTXHU4QkY3XHU2QzQyXG5mdW5jdGlvbiBoYW5kbGVDb3JzKHJlczogU2VydmVyUmVzcG9uc2UpIHtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uLCBYLU1vY2stRW5hYmxlZCcpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1NYXgtQWdlJywgJzg2NDAwJyk7XG59XG5cbi8vIFx1NTNEMVx1OTAwMUpTT05cdTU0Q0RcdTVFOTRcbmZ1bmN0aW9uIHNlbmRKc29uUmVzcG9uc2UocmVzOiBTZXJ2ZXJSZXNwb25zZSwgc3RhdHVzOiBudW1iZXIsIGRhdGE6IGFueSkge1xuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbi8vIFx1NUVGNlx1OEZERlx1NjI2N1x1ODg0Q1xuZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8vIFx1ODlFM1x1Njc5MFx1OEJGN1x1NkM0Mlx1NEY1M1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VSZXF1ZXN0Qm9keShyZXE6IEluY29taW5nTWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBib2R5ID0gJyc7XG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rKSA9PiB7XG4gICAgICBib2R5ICs9IGNodW5rLnRvU3RyaW5nKCk7XG4gICAgfSk7XG4gICAgcmVxLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlKGJvZHkgPyBKU09OLnBhcnNlKGJvZHkpIDoge30pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1NjU3MFx1NjM2RVx1NkU5MEFQSVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY3MERcdTUyQTFcdTVDNDJcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcdUZGMENcdTY1MkZcdTYzMDFcdTUyMDZcdTk4NzVcdTU0OENcdThGQzdcdTZFRTRcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmdldERhdGFTb3VyY2VzKHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQodXJsUXVlcnkucGFnZSBhcyBzdHJpbmcpIHx8IDEsXG4gICAgICAgIHNpemU6IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMCxcbiAgICAgICAgbmFtZTogdXJsUXVlcnkubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgIHR5cGU6IHVybFF1ZXJ5LnR5cGUgYXMgc3RyaW5nLFxuICAgICAgICBzdGF0dXM6IHVybFF1ZXJ5LnN0YXR1cyBhcyBzdHJpbmdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiByZXN1bHQuaXRlbXMsIFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGFzb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5nZXREYXRhU291cmNlKGlkKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IGRhdGFzb3VyY2UsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2UgXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgbmV3RGF0YVNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmNyZWF0ZURhdGFTb3VyY2UoYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDEsIHtcbiAgICAgICAgZGF0YTogbmV3RGF0YVNvdXJjZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBVVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YVNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLnVwZGF0ZURhdGFTb3VyY2UoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHVwZGF0ZWREYXRhU291cmNlLFxuICAgICAgICBtZXNzYWdlOiAnXHU2NTcwXHU2MzZFXHU2RTkwXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2RhdGFzb3VyY2VzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2REVMRVRFXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuZGVsZXRlRGF0YVNvdXJjZShpZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzL3Rlc3QtY29ubmVjdGlvbicgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL2RhdGFzb3VyY2VzL3Rlc3QtY29ubmVjdGlvbmApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UudGVzdENvbm5lY3Rpb24oYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NkQ0Qlx1OEJENVx1OEZERVx1NjNBNVx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY3RTVcdThCRTJBUElcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVF1ZXJpZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU2OEMwXHU2N0U1VVJMXHU2NjJGXHU1NDI2XHU1MzM5XHU5MTREXHU2N0U1XHU4QkUyQVBJXG4gIGNvbnN0IGlzUXVlcmllc1BhdGggPSB1cmxQYXRoLmluY2x1ZGVzKCcvcXVlcmllcycpO1xuICBcbiAgLy8gXHU2MjUzXHU1MzcwXHU2MjQwXHU2NzA5XHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczXHU4QkY3XHU2QzQyXHU0RUU1XHU0RkJGXHU4QzAzXHU4QkQ1XG4gIGlmIChpc1F1ZXJpZXNQYXRoKSB7XG4gICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTY4QzBcdTZENEJcdTUyMzBcdTY3RTVcdThCRTJBUElcdThCRjdcdTZDNDI6ICR7bWV0aG9kfSAke3VybFBhdGh9YCwgdXJsUXVlcnkpO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6IC9hcGkvcXVlcmllc2ApO1xuICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU1OTA0XHU3NDA2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU4QkY3XHU2QzQyLCBcdTUzQzJcdTY1NzA6JywgdXJsUXVlcnkpO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY3MERcdTUyQTFcdTVDNDJcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdUZGMENcdTY1MkZcdTYzMDFcdTUyMDZcdTk4NzVcdTU0OENcdThGQzdcdTZFRTRcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5nZXRRdWVyaWVzKHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQodXJsUXVlcnkucGFnZSBhcyBzdHJpbmcpIHx8IDEsXG4gICAgICAgIHNpemU6IHBhcnNlSW50KHVybFF1ZXJ5LnNpemUgYXMgc3RyaW5nKSB8fCAxMCxcbiAgICAgICAgbmFtZTogdXJsUXVlcnkubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogdXJsUXVlcnkuZGF0YVNvdXJjZUlkIGFzIHN0cmluZyxcbiAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nLFxuICAgICAgICBxdWVyeVR5cGU6IHVybFF1ZXJ5LnF1ZXJ5VHlwZSBhcyBzdHJpbmcsXG4gICAgICAgIGlzRmF2b3JpdGU6IHVybFF1ZXJ5LmlzRmF2b3JpdGUgPT09ICd0cnVlJ1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU3RUQzXHU2NzlDOicsIHtcbiAgICAgICAgaXRlbXNDb3VudDogcmVzdWx0Lml0ZW1zLmxlbmd0aCxcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb25cbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiByZXN1bHQuaXRlbXMsIFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrXSBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDUwMCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBxdWVyeSA9IGF3YWl0IHF1ZXJ5U2VydmljZS5nZXRRdWVyeShpZCk7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiBxdWVyeSxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHsgXG4gICAgICAgIGVycm9yOiAnXHU2N0U1XHU4QkUyXHU0RTBEXHU1QjU4XHU1NzI4JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZSBcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9xdWVyaWVzJyAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6IC9hcGkvcXVlcmllc2ApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgbmV3UXVlcnkgPSBhd2FpdCBxdWVyeVNlcnZpY2UuY3JlYXRlUXVlcnkoYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDEsIHtcbiAgICAgICAgZGF0YTogbmV3UXVlcnksXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTUyMUJcdTVFRkFcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBVVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCB1cGRhdGVkUXVlcnkgPSBhd2FpdCBxdWVyeVNlcnZpY2UudXBkYXRlUXVlcnkoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHVwZGF0ZWRRdWVyeSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2REVMRVRFXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgYXdhaXQgcXVlcnlTZXJ2aWNlLmRlbGV0ZVF1ZXJ5KGlkKTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU1MjIwXHU5NjY0XHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvcnVuJC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJylbM10gfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMDdcdTYzNjJcdTY3RTVcdThCRTJcdTY1MzZcdTg1Q0ZcdTcyQjZcdTYwMDFcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL2Zhdm9yaXRlJC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJylbM10gfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UudG9nZ2xlRmF2b3JpdGUoaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY1MzZcdTg1Q0ZcdTcyQjZcdTYwMDFcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvdmVyc2lvbnMkLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHZlcnNpb25zID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJ5VmVyc2lvbnMoaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHZlcnNpb25zLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3Mjc5XHU1QjlBXHU3MjQ4XHU2NzJDXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC92ZXJzaW9uc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IHBhcnRzID0gdXJsUGF0aC5zcGxpdCgnLycpO1xuICAgIGNvbnN0IHF1ZXJ5SWQgPSBwYXJ0c1szXSB8fCAnJztcbiAgICBjb25zdCB2ZXJzaW9uSWQgPSBwYXJ0c1s1XSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIFx1NjdFNVx1OEJFMklEOiAke3F1ZXJ5SWR9LCBcdTcyNDhcdTY3MkNJRDogJHt2ZXJzaW9uSWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHZlcnNpb25zID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJ5VmVyc2lvbnMocXVlcnlJZCk7XG4gICAgICBjb25zdCB2ZXJzaW9uID0gdmVyc2lvbnMuZmluZCgodjogYW55KSA9PiB2LmlkID09PSB2ZXJzaW9uSWQpO1xuICAgICAgXG4gICAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7dmVyc2lvbklkfVx1NzY4NFx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ2ApO1xuICAgICAgfVxuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHZlcnNpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFx1NTIxQlx1NUVGQVx1NEUyRFx1OTVGNFx1NEVGNlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlTW9ja01pZGRsZXdhcmUoKTogQ29ubmVjdC5OZXh0SGFuZGxlRnVuY3Rpb24ge1xuICAvLyBcdTU5ODJcdTY3OUNNb2NrXHU2NzBEXHU1MkExXHU4OEFCXHU3OTgxXHU3NTI4XHVGRjBDXHU4RkQ0XHU1NkRFXHU3QTdBXHU0RTJEXHU5NUY0XHU0RUY2XG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY3MERcdTUyQTFcdTVERjJcdTc5ODFcdTc1MjhcdUZGMENcdThGRDRcdTU2REVcdTdBN0FcdTRFMkRcdTk1RjRcdTRFRjYnKTtcbiAgICByZXR1cm4gKHJlcSwgcmVzLCBuZXh0KSA9PiBuZXh0KCk7XG4gIH1cbiAgXG4gIGNvbnNvbGUubG9nKCdbTW9ja10gXHU1MjFCXHU1RUZBXHU0RTJEXHU5NUY0XHU0RUY2LCBcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDInKTtcbiAgXG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBtb2NrTWlkZGxld2FyZShcbiAgICByZXE6IENvbm5lY3QuSW5jb21pbmdNZXNzYWdlLFxuICAgIHJlczogU2VydmVyUmVzcG9uc2UsXG4gICAgbmV4dDogQ29ubmVjdC5OZXh0RnVuY3Rpb25cbiAgKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1ODlFM1x1Njc5MFVSTFxuICAgICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICAgIFxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1RTk0XHU4QkU1XHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyXG4gICAgICBpZiAoIXVybC5pbmNsdWRlcygnL2FwaS8nKSkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTU4OUVcdTVGM0FcdTU5MDRcdTc0MDZcdTkxQ0RcdTU5MERcdTc2ODRBUElcdThERUZcdTVGODRcbiAgICAgIGxldCBwcm9jZXNzZWRVcmwgPSB1cmw7XG4gICAgICBpZiAodXJsLmluY2x1ZGVzKCcvYXBpL2FwaS8nKSkge1xuICAgICAgICBwcm9jZXNzZWRVcmwgPSB1cmwucmVwbGFjZSgvXFwvYXBpXFwvYXBpXFwvL2csICcvYXBpLycpO1xuICAgICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTY4QzBcdTZENEJcdTUyMzBcdTkxQ0RcdTU5MERcdTc2ODRBUElcdThERUZcdTVGODRcdUZGMENcdTVERjJcdTRGRUVcdTZCNjM6ICR7dXJsfSAtPiAke3Byb2Nlc3NlZFVybH1gKTtcbiAgICAgICAgLy8gXHU0RkVFXHU2NTM5XHU1MzlGXHU1OUNCXHU4QkY3XHU2QzQyXHU3Njg0VVJMXHVGRjBDXHU3ODZFXHU0RkREXHU1NDBFXHU3RUVEXHU1OTA0XHU3NDA2XHU4MEZEXHU2QjYzXHU3ODZFXHU4QkM2XHU1MjJCXG4gICAgICAgIHJlcS51cmwgPSBwcm9jZXNzZWRVcmw7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NkQ0Qlx1OEJENVx1RkYxQVx1NjI1M1x1NTM3MFx1NjI0MFx1NjcwOUFQSVx1OEJGN1x1NkM0Mlx1NEVFNVx1NEZCRlx1OEMwM1x1OEJENVxuICAgICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHtwcm9jZXNzZWRVcmx9YCk7XG4gICAgICBcbiAgICAgIGNvbnN0IHBhcnNlZFVybCA9IHBhcnNlKHByb2Nlc3NlZFVybCwgdHJ1ZSk7XG4gICAgICBjb25zdCB1cmxQYXRoID0gcGFyc2VkVXJsLnBhdGhuYW1lIHx8ICcnO1xuICAgICAgY29uc3QgdXJsUXVlcnkgPSBwYXJzZWRVcmwucXVlcnkgfHwge307XG4gICAgICBcbiAgICAgIC8vIFx1NTE4RFx1NkIyMVx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0Mlx1RkYwOFx1NEY3Rlx1NzUyOFx1NTkwNFx1NzQwNlx1NTQwRVx1NzY4NFVSTFx1RkYwOVxuICAgICAgaWYgKCFzaG91bGRNb2NrUmVxdWVzdChwcm9jZXNzZWRVcmwpKSB7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NjUzNlx1NTIzMFx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3VybFBhdGh9YCk7XG4gICAgICBcbiAgICAgIC8vIFx1NTkwNFx1NzQwNkNPUlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDJcbiAgICAgIGlmIChyZXEubWV0aG9kID09PSAnT1BUSU9OUycpIHtcbiAgICAgICAgaGFuZGxlQ29ycyhyZXMpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwNDtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NkRGQlx1NTJBMENPUlNcdTU5MzRcbiAgICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICAgIFxuICAgICAgLy8gXHU2QTIxXHU2MkRGXHU3RjUxXHU3RURDXHU1RUY2XHU4RkRGXG4gICAgICBpZiAobW9ja0NvbmZpZy5kZWxheSA+IDApIHtcbiAgICAgICAgYXdhaXQgZGVsYXkobW9ja0NvbmZpZy5kZWxheSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NTkwNFx1NzQwNlx1NEUwRFx1NTQwQ1x1NzY4NEFQSVx1N0FFRlx1NzBCOVxuICAgICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcbiAgICAgIFxuICAgICAgLy8gXHU2MzA5XHU5ODdBXHU1RThGXHU1QzFEXHU4QkQ1XHU0RTBEXHU1NDBDXHU3Njg0QVBJXHU1OTA0XHU3NDA2XHU1NjY4XG4gICAgICBpZiAoIWhhbmRsZWQpIGhhbmRsZWQgPSBhd2FpdCBoYW5kbGVEYXRhc291cmNlc0FwaShyZXEsIHJlcywgdXJsUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gYXdhaXQgaGFuZGxlUXVlcmllc0FwaShyZXEsIHJlcywgdXJsUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgXG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTZDQTFcdTY3MDlcdTU5MDRcdTc0MDZcdUZGMENcdThGRDRcdTU2REU0MDRcbiAgICAgIGlmICghaGFuZGxlZCkge1xuICAgICAgICBsb2dNb2NrKCdpbmZvJywgYFx1NjcyQVx1NUI5RVx1NzNCMFx1NzY4NEFQSVx1OERFRlx1NUY4NDogJHtyZXEubWV0aG9kfSAke3VybFBhdGh9YCk7XG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHsgXG4gICAgICAgICAgZXJyb3I6ICdcdTY3MkFcdTYyN0VcdTUyMzBBUElcdTdBRUZcdTcwQjknLFxuICAgICAgICAgIG1lc3NhZ2U6IGBBUElcdTdBRUZcdTcwQjkgJHt1cmxQYXRofSBcdTY3MkFcdTYyN0VcdTUyMzBcdTYyMTZcdTY3MkFcdTVCOUVcdTczQjBgLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dNb2NrKCdlcnJvcicsIGBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTUxRkFcdTk1MTk6YCwgZXJyb3IpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDUwMCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY3MERcdTUyQTFcdTU2NjhcdTUxODVcdTkwRThcdTk1MTlcdThCRUYnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcbiAqIFxuICogXHU2M0E3XHU1MjM2TW9ja1x1NjcwRFx1NTJBMVx1NzY4NFx1NTQyRlx1NzUyOC9cdTc5ODFcdTc1MjhcdTcyQjZcdTYwMDFcdTMwMDFcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkJcdTdCNDlcbiAqL1xuXG4vLyBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTYyMTZcdTUxNjhcdTVDNDBcdThCQkVcdTdGNkVcdTRFMkRcdTgzQjdcdTUzRDZcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG5leHBvcnQgZnVuY3Rpb24gaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIC8vIFx1NTcyOE5vZGUuanNcdTczQUZcdTU4ODNcdTRFMkRcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52KSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTcyOFx1NkQ0Rlx1ODlDOFx1NTY2OFx1NzNBRlx1NTg4M1x1NEUyRFxuICAgIGlmICh0eXBlb2YgaW1wb3J0Lm1ldGEgIT09ICd1bmRlZmluZWQnICYmIGltcG9ydC5tZXRhLmVudikge1xuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjhDMFx1NjdFNWxvY2FsU3RvcmFnZSAoXHU0RUM1XHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzKVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICBjb25zdCBsb2NhbFN0b3JhZ2VWYWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdVU0VfTU9DS19BUEknKTtcbiAgICAgIGlmIChsb2NhbFN0b3JhZ2VWYWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGxvY2FsU3RvcmFnZVZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU5RUQ4XHU4QkE0XHU2MEM1XHU1MUI1XHVGRjFBXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBCXHU1NDJGXHU3NTI4XHVGRjBDXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU3OTgxXHU3NTI4XG4gICAgY29uc3QgaXNEZXZlbG9wbWVudCA9IFxuICAgICAgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudiAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgfHxcbiAgICAgICh0eXBlb2YgaW1wb3J0Lm1ldGEgIT09ICd1bmRlZmluZWQnICYmIGltcG9ydC5tZXRhLmVudiAmJiBpbXBvcnQubWV0YS5lbnYuREVWID09PSB0cnVlKTtcbiAgICBcbiAgICByZXR1cm4gaXNEZXZlbG9wbWVudDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBcdTUxRkFcdTk1MTlcdTY1RjZcdTc2ODRcdTVCODlcdTUxNjhcdTU2REVcdTkwMDBcbiAgICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdTY4QzBcdTY3RTVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTUxRkFcdTk1MTlcdUZGMENcdTlFRDhcdThCQTRcdTc5ODFcdTc1MjhNb2NrXHU2NzBEXHU1MkExJywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBcdTU0MTFcdTU0MEVcdTUxN0NcdTVCQjlcdTY1RTdcdTRFRTNcdTc4MDFcdTc2ODRcdTUxRkRcdTY1NzBcbmV4cG9ydCBmdW5jdGlvbiBpc01vY2tFbmFibGVkKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNFbmFibGVkKCk7XG59XG5cbi8vIE1vY2tcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcbmV4cG9ydCBjb25zdCBtb2NrQ29uZmlnID0ge1xuICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIGVuYWJsZWQ6IGlzRW5hYmxlZCgpLFxuICBcbiAgLy8gXHU4QkY3XHU2QzQyXHU1RUY2XHU4RkRGXHVGRjA4XHU2QkVCXHU3OUQyXHVGRjA5XG4gIGRlbGF5OiAzMDAsXG4gIFxuICAvLyBBUElcdTU3RkFcdTc4NDBcdThERUZcdTVGODRcdUZGMENcdTc1MjhcdTRFOEVcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTk3MDBcdTg5ODFcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbiAgYXBpQmFzZVBhdGg6ICcvYXBpJyxcbiAgXG4gIC8vIFx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQjogJ25vbmUnLCAnZXJyb3InLCAnaW5mbycsICdkZWJ1ZydcbiAgbG9nTGV2ZWw6ICdkZWJ1ZycsXG4gIFxuICAvLyBcdTU0MkZcdTc1MjhcdTc2ODRcdTZBMjFcdTU3NTdcbiAgbW9kdWxlczoge1xuICAgIGRhdGFzb3VyY2VzOiB0cnVlLFxuICAgIHF1ZXJpZXM6IHRydWUsXG4gICAgdXNlcnM6IHRydWUsXG4gICAgdmlzdWFsaXphdGlvbnM6IHRydWVcbiAgfVxufTtcblxuLy8gXHU1MjI0XHU2NUFEXHU2NjJGXHU1NDI2XHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkTW9ja1JlcXVlc3QodXJsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgLy8gXHU1RkM1XHU5ODdCXHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICBpZiAoIW1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU1RkM1XHU5ODdCXHU2NjJGQVBJXHU4QkY3XHU2QzQyXG4gIGlmICghdXJsLnN0YXJ0c1dpdGgobW9ja0NvbmZpZy5hcGlCYXNlUGF0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFx1OERFRlx1NUY4NFx1NjhDMFx1NjdFNVx1OTAxQVx1OEZDN1x1RkYwQ1x1NUU5NFx1OEJFNVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gXHU4QkIwXHU1RjU1XHU2NUU1XHU1RkQ3XG5leHBvcnQgZnVuY3Rpb24gbG9nTW9jayhsZXZlbDogJ2Vycm9yJyB8ICdpbmZvJyB8ICdkZWJ1ZycsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gIGNvbnN0IHsgbG9nTGV2ZWwgfSA9IG1vY2tDb25maWc7XG4gIFxuICBpZiAobG9nTGV2ZWwgPT09ICdub25lJykgcmV0dXJuO1xuICBcbiAgaWYgKGxldmVsID09PSAnZXJyb3InICYmIFsnZXJyb3InLCAnaW5mbycsICdkZWJ1ZyddLmluY2x1ZGVzKGxvZ0xldmVsKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrIEVSUk9SXScsIC4uLmFyZ3MpO1xuICB9IGVsc2UgaWYgKGxldmVsID09PSAnaW5mbycgJiYgWydpbmZvJywgJ2RlYnVnJ10uaW5jbHVkZXMobG9nTGV2ZWwpKSB7XG4gICAgY29uc29sZS5pbmZvKCdbTW9jayBJTkZPXScsIC4uLmFyZ3MpO1xuICB9IGVsc2UgaWYgKGxldmVsID09PSAnZGVidWcnICYmIGxvZ0xldmVsID09PSAnZGVidWcnKSB7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrIERFQlVHXScsIC4uLmFyZ3MpO1xuICB9XG59XG5cbi8vIFx1NTIxRFx1NTlDQlx1NTMxNlx1NjVGNlx1OEY5M1x1NTFGQU1vY2tcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDFcbnRyeSB7XG4gIGNvbnNvbGUubG9nKGBbTW9ja10gXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxOiAke21vY2tDb25maWcuZW5hYmxlZCA/ICdcdTVERjJcdTU0MkZcdTc1MjgnIDogJ1x1NURGMlx1Nzk4MVx1NzUyOCd9YCk7XG4gIGlmIChtb2NrQ29uZmlnLmVuYWJsZWQpIHtcbiAgICBjb25zb2xlLmxvZyhgW01vY2tdIFx1OTE0RFx1N0Y2RTpgLCB7XG4gICAgICBkZWxheTogbW9ja0NvbmZpZy5kZWxheSxcbiAgICAgIGFwaUJhc2VQYXRoOiBtb2NrQ29uZmlnLmFwaUJhc2VQYXRoLFxuICAgICAgbG9nTGV2ZWw6IG1vY2tDb25maWcubG9nTGV2ZWwsXG4gICAgICBlbmFibGVkTW9kdWxlczogT2JqZWN0LmVudHJpZXMobW9ja0NvbmZpZy5tb2R1bGVzKVxuICAgICAgICAuZmlsdGVyKChbXywgZW5hYmxlZF0pID0+IGVuYWJsZWQpXG4gICAgICAgIC5tYXAoKFtuYW1lXSkgPT4gbmFtZSlcbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgY29uc29sZS53YXJuKCdbTW9ja10gXHU4RjkzXHU1MUZBXHU5MTREXHU3RjZFXHU0RkUxXHU2MDZGXHU1MUZBXHU5NTE5JywgZXJyb3IpO1xufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50c1wiOy8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjU3MFx1NjM2RVx1NkU5MFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1RkYwQ1x1NzUyOFx1NEU4RVx1NUYwMFx1NTNEMVx1NTQ4Q1x1NkQ0Qlx1OEJENVxuICovXG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1N0M3Qlx1NTc4QlxuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZVR5cGUgPSAnbXlzcWwnIHwgJ3Bvc3RncmVzcWwnIHwgJ29yYWNsZScgfCAnc3Fsc2VydmVyJyB8ICdzcWxpdGUnO1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTcyQjZcdTYwMDFcbmV4cG9ydCB0eXBlIERhdGFTb3VyY2VTdGF0dXMgPSAnYWN0aXZlJyB8ICdpbmFjdGl2ZScgfCAnZXJyb3InIHwgJ3BlbmRpbmcnO1xuXG4vLyBcdTU0MENcdTZCNjVcdTk4OTFcdTczODdcbmV4cG9ydCB0eXBlIFN5bmNGcmVxdWVuY3kgPSAnbWFudWFsJyB8ICdob3VybHknIHwgJ2RhaWx5JyB8ICd3ZWVrbHknIHwgJ21vbnRobHknO1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTYzQTVcdTUzRTNcbmV4cG9ydCBpbnRlcmZhY2UgRGF0YVNvdXJjZSB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHR5cGU6IERhdGFTb3VyY2VUeXBlO1xuICBob3N0Pzogc3RyaW5nO1xuICBwb3J0PzogbnVtYmVyO1xuICBkYXRhYmFzZU5hbWU/OiBzdHJpbmc7XG4gIHVzZXJuYW1lPzogc3RyaW5nO1xuICBwYXNzd29yZD86IHN0cmluZztcbiAgc3RhdHVzOiBEYXRhU291cmNlU3RhdHVzO1xuICBzeW5jRnJlcXVlbmN5PzogU3luY0ZyZXF1ZW5jeTtcbiAgbGFzdFN5bmNUaW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgY3JlYXRlZEF0OiBzdHJpbmc7XG4gIHVwZGF0ZWRBdDogc3RyaW5nO1xuICBpc0FjdGl2ZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuZXhwb3J0IGNvbnN0IG1vY2tEYXRhU291cmNlczogRGF0YVNvdXJjZVtdID0gW1xuICB7XG4gICAgaWQ6ICdkcy0xJyxcbiAgICBuYW1lOiAnTXlTUUxcdTc5M0FcdTRGOEJcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU3OTNBXHU0RjhCTXlTUUxcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdteXNxbCcsXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgcG9ydDogMzMwNixcbiAgICBkYXRhYmFzZU5hbWU6ICdleGFtcGxlX2RiJyxcbiAgICB1c2VybmFtZTogJ3VzZXInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0yJyxcbiAgICBuYW1lOiAnUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAncG9zdGdyZXNxbCcsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xMDAnLFxuICAgIHBvcnQ6IDU0MzIsXG4gICAgZGF0YWJhc2VOYW1lOiAncHJvZHVjdGlvbl9kYicsXG4gICAgdXNlcm5hbWU6ICdhZG1pbicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnaG91cmx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzNjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDc3NzYwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTMnLFxuICAgIG5hbWU6ICdTUUxpdGVcdTY3MkNcdTU3MzBcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU2NzJDXHU1NzMwU1FMaXRlXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnc3FsaXRlJyxcbiAgICBkYXRhYmFzZU5hbWU6ICcvcGF0aC90by9sb2NhbC5kYicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnbWFudWFsJyxcbiAgICBsYXN0U3luY1RpbWU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzNDU2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtNCcsXG4gICAgbmFtZTogJ1NRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwU1FMIFNlcnZlclx1NkQ0Qlx1OEJENVx1NzNBRlx1NTg4MycsXG4gICAgdHlwZTogJ3NxbHNlcnZlcicsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4yMDAnLFxuICAgIHBvcnQ6IDE0MzMsXG4gICAgZGF0YWJhc2VOYW1lOiAndGVzdF9kYicsXG4gICAgdXNlcm5hbWU6ICd0ZXN0ZXInLFxuICAgIHN0YXR1czogJ2luYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnd2Vla2x5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA2MDQ4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNTE4NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiBmYWxzZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy01JyxcbiAgICBuYW1lOiAnT3JhY2xlXHU0RjAxXHU0RTFBXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzME9yYWNsZVx1NEYwMVx1NEUxQVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ29yYWNsZScsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xNTAnLFxuICAgIHBvcnQ6IDE1MjEsXG4gICAgZGF0YWJhc2VOYW1lOiAnZW50ZXJwcmlzZV9kYicsXG4gICAgdXNlcm5hbWU6ICdzeXN0ZW0nLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTAzNjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9XG5dO1xuXG4vKipcbiAqIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGNvdW50IFx1NzUxRlx1NjIxMFx1NjU3MFx1OTFDRlxuICogQHJldHVybnMgXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU3RUM0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1vY2tEYXRhU291cmNlcyhjb3VudDogbnVtYmVyID0gNSk6IERhdGFTb3VyY2VbXSB7XG4gIGNvbnN0IHR5cGVzOiBEYXRhU291cmNlVHlwZVtdID0gWydteXNxbCcsICdwb3N0Z3Jlc3FsJywgJ29yYWNsZScsICdzcWxzZXJ2ZXInLCAnc3FsaXRlJ107XG4gIGNvbnN0IHN0YXR1c2VzOiBEYXRhU291cmNlU3RhdHVzW10gPSBbJ2FjdGl2ZScsICdpbmFjdGl2ZScsICdlcnJvcicsICdwZW5kaW5nJ107XG4gIGNvbnN0IHN5bmNGcmVxczogU3luY0ZyZXF1ZW5jeVtdID0gWydtYW51YWwnLCAnaG91cmx5JywgJ2RhaWx5JywgJ3dlZWtseScsICdtb250aGx5J107XG4gIFxuICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogY291bnQgfSwgKF8sIGkpID0+IHtcbiAgICBjb25zdCB0eXBlID0gdHlwZXNbaSAlIHR5cGVzLmxlbmd0aF07XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBkcy1nZW4tJHtpICsgMX1gLFxuICAgICAgbmFtZTogYFx1NzUxRlx1NjIxMFx1NzY4NCR7dHlwZX1cdTY1NzBcdTYzNkVcdTZFOTAgJHtpICsgMX1gLFxuICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTc2ODQke3R5cGV9XHU3QzdCXHU1NzhCXHU2NTcwXHU2MzZFXHU2RTkwICR7aSArIDF9YCxcbiAgICAgIHR5cGUsXG4gICAgICBob3N0OiB0eXBlICE9PSAnc3FsaXRlJyA/ICdsb2NhbGhvc3QnIDogdW5kZWZpbmVkLFxuICAgICAgcG9ydDogdHlwZSAhPT0gJ3NxbGl0ZScgPyAoMzMwNiArIGkpIDogdW5kZWZpbmVkLFxuICAgICAgZGF0YWJhc2VOYW1lOiB0eXBlID09PSAnc3FsaXRlJyA/IGAvcGF0aC90by9kYl8ke2l9LmRiYCA6IGBleGFtcGxlX2RiXyR7aX1gLFxuICAgICAgdXNlcm5hbWU6IHR5cGUgIT09ICdzcWxpdGUnID8gYHVzZXJfJHtpfWAgOiB1bmRlZmluZWQsXG4gICAgICBzdGF0dXM6IHN0YXR1c2VzW2kgJSBzdGF0dXNlcy5sZW5ndGhdLFxuICAgICAgc3luY0ZyZXF1ZW5jeTogc3luY0ZyZXFzW2kgJSBzeW5jRnJlcXMubGVuZ3RoXSxcbiAgICAgIGxhc3RTeW5jVGltZTogaSAlIDMgPT09IDAgPyBudWxsIDogbmV3IERhdGUobm93IC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShub3cgLSAoaSArIDEwKSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShub3cgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBpc0FjdGl2ZTogaSAlIDQgIT09IDBcbiAgICB9O1xuICB9KTtcbn1cblxuLy8gXHU1QkZDXHU1MUZBXHU5RUQ4XHU4QkE0XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG5leHBvcnQgZGVmYXVsdCBtb2NrRGF0YVNvdXJjZXM7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50c1wiOy8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwTW9ja1x1NjcwRFx1NTJBMVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY1NzBcdTYzNkVcdTZFOTBcdTc2RjhcdTUxNzNBUElcdTc2ODRcdTZBMjFcdTYyREZcdTVCOUVcdTczQjBcbiAqL1xuXG5pbXBvcnQgeyBtb2NrRGF0YVNvdXJjZXMgfSBmcm9tICcuLi9kYXRhL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlIH0gZnJvbSAnLi4vZGF0YS9kYXRhc291cmNlJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuXG4vLyBcdTRFMzRcdTY1RjZcdTVCNThcdTUwQThcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdUZGMENcdTUxNDFcdThCQjhcdTZBMjFcdTYyREZcdTU4OUVcdTUyMjBcdTY1MzlcdTY0Q0RcdTRGNUNcbmxldCBkYXRhU291cmNlcyA9IFsuLi5tb2NrRGF0YVNvdXJjZXNdO1xuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZURlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkZWxheSA9IHR5cGVvZiBtb2NrQ29uZmlnLmRlbGF5ID09PSAnbnVtYmVyJyA/IG1vY2tDb25maWcuZGVsYXkgOiAzMDA7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbn1cblxuLyoqXG4gKiBcdTkxQ0RcdTdGNkVcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTYzNkVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0RGF0YVNvdXJjZXMoKTogdm9pZCB7XG4gIGRhdGFTb3VyY2VzID0gWy4uLm1vY2tEYXRhU291cmNlc107XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKiBAcGFyYW0gcGFyYW1zIFx1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MFxuICogQHJldHVybnMgXHU1MjA2XHU5ODc1XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYXRhU291cmNlcyhwYXJhbXM/OiB7XG4gIHBhZ2U/OiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHR5cGU/OiBzdHJpbmc7XG4gIHN0YXR1cz86IHN0cmluZztcbn0pOiBQcm9taXNlPHtcbiAgaXRlbXM6IERhdGFTb3VyY2VbXTtcbiAgcGFnaW5hdGlvbjoge1xuICAgIHRvdGFsOiBudW1iZXI7XG4gICAgcGFnZTogbnVtYmVyO1xuICAgIHNpemU6IG51bWJlcjtcbiAgICB0b3RhbFBhZ2VzOiBudW1iZXI7XG4gIH07XG59PiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gIFxuICAvLyBcdTVFOTRcdTc1MjhcdThGQzdcdTZFRTRcbiAgbGV0IGZpbHRlcmVkSXRlbXMgPSBbLi4uZGF0YVNvdXJjZXNdO1xuICBcbiAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/Lm5hbWUpIHtcbiAgICBjb25zdCBrZXl3b3JkID0gcGFyYW1zLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gXG4gICAgICBkcy5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAoZHMuZGVzY3JpcHRpb24gJiYgZHMuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICApO1xuICB9XG4gIFxuICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8udHlwZSkge1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBkcy50eXBlID09PSBwYXJhbXMudHlwZSk7XG4gIH1cbiAgXG4gIC8vIFx1NjMwOVx1NzJCNlx1NjAwMVx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gZHMuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgfVxuICBcbiAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmlsdGVyZWRJdGVtcy5sZW5ndGgpO1xuICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gIFxuICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgcmV0dXJuIHtcbiAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdG90YWw6IGZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgcGFnZSxcbiAgICAgIHNpemUsXG4gICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmlsdGVyZWRJdGVtcy5sZW5ndGggLyBzaXplKVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICogQHJldHVybnMgXHU2NTcwXHU2MzZFXHU2RTkwXHU4QkU2XHU2MEM1XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYXRhU291cmNlKGlkOiBzdHJpbmcpOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjdFNVx1NjI3RVx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCBkYXRhU291cmNlID0gZGF0YVNvdXJjZXMuZmluZChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKCFkYXRhU291cmNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIHJldHVybiBkYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGRhdGEgXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU2MzZFXG4gKiBAcmV0dXJucyBcdTUyMUJcdTVFRkFcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZURhdGFTb3VyY2UoZGF0YTogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwSURcbiAgY29uc3QgbmV3SWQgPSBgZHMtJHtEYXRlLm5vdygpfWA7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgbmV3RGF0YVNvdXJjZTogRGF0YVNvdXJjZSA9IHtcbiAgICBpZDogbmV3SWQsXG4gICAgbmFtZTogZGF0YS5uYW1lIHx8ICdOZXcgRGF0YSBTb3VyY2UnLFxuICAgIGRlc2NyaXB0aW9uOiBkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgIHR5cGU6IGRhdGEudHlwZSB8fCAnbXlzcWwnLFxuICAgIGhvc3Q6IGRhdGEuaG9zdCxcbiAgICBwb3J0OiBkYXRhLnBvcnQsXG4gICAgZGF0YWJhc2VOYW1lOiBkYXRhLmRhdGFiYXNlTmFtZSxcbiAgICB1c2VybmFtZTogZGF0YS51c2VybmFtZSxcbiAgICBzdGF0dXM6IGRhdGEuc3RhdHVzIHx8ICdwZW5kaW5nJyxcbiAgICBzeW5jRnJlcXVlbmN5OiBkYXRhLnN5bmNGcmVxdWVuY3kgfHwgJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH07XG4gIFxuICAvLyBcdTZERkJcdTUyQTBcdTUyMzBcdTUyMTdcdTg4NjhcbiAgZGF0YVNvdXJjZXMucHVzaChuZXdEYXRhU291cmNlKTtcbiAgXG4gIHJldHVybiBuZXdEYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKiBAcGFyYW0gZGF0YSBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcbiAqIEByZXR1cm5zIFx1NjZGNFx1NjVCMFx1NTQwRVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlRGF0YVNvdXJjZShpZDogc3RyaW5nLCBkYXRhOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTYyN0VcdTUyMzBcdTg5ODFcdTY2RjRcdTY1QjBcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcdTdEMjJcdTVGMTVcbiAgY29uc3QgaW5kZXggPSBkYXRhU291cmNlcy5maW5kSW5kZXgoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IHVwZGF0ZWREYXRhU291cmNlOiBEYXRhU291cmNlID0ge1xuICAgIC4uLmRhdGFTb3VyY2VzW2luZGV4XSxcbiAgICAuLi5kYXRhLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gIH07XG4gIFxuICAvLyBcdTY2RkZcdTYzNjJcdTY1NzBcdTYzNkVcdTZFOTBcbiAgZGF0YVNvdXJjZXNbaW5kZXhdID0gdXBkYXRlZERhdGFTb3VyY2U7XG4gIFxuICByZXR1cm4gdXBkYXRlZERhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZURhdGFTb3VyY2UoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2MjdFXHU1MjMwXHU4OTgxXHU1MjIwXHU5NjY0XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXHU3RDIyXHU1RjE1XG4gIGNvbnN0IGluZGV4ID0gZGF0YVNvdXJjZXMuZmluZEluZGV4KGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBkYXRhU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIFx1NkQ0Qlx1OEJENVx1NjU3MFx1NjM2RVx1NkU5MFx1OEZERVx1NjNBNVxuICogQHBhcmFtIHBhcmFtcyBcdThGREVcdTYzQTVcdTUzQzJcdTY1NzBcbiAqIEByZXR1cm5zIFx1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1N0VEM1x1Njc5Q1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdENvbm5lY3Rpb24ocGFyYW1zOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTx7XG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIG1lc3NhZ2U/OiBzdHJpbmc7XG4gIGRldGFpbHM/OiBhbnk7XG59PiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTVCOUVcdTk2NDVcdTRGN0ZcdTc1MjhcdTY1RjZcdTUzRUZcdTgwRkRcdTRGMUFcdTY3MDlcdTY2RjRcdTU5MERcdTY3NDJcdTc2ODRcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTkwM0JcdThGOTFcbiAgLy8gXHU4RkQ5XHU5MUNDXHU3QjgwXHU1MzU1XHU2QTIxXHU2MkRGXHU2MjEwXHU1MjlGL1x1NTkzMVx1OEQyNVxuICBjb25zdCBzdWNjZXNzID0gTWF0aC5yYW5kb20oKSA+IDAuMjsgLy8gODAlXHU2MjEwXHU1MjlGXHU3Mzg3XG4gIFxuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3MsXG4gICAgbWVzc2FnZTogc3VjY2VzcyA/ICdcdThGREVcdTYzQTVcdTYyMTBcdTUyOUYnIDogJ1x1OEZERVx1NjNBNVx1NTkzMVx1OEQyNTogXHU2NUUwXHU2Q0Q1XHU4RkRFXHU2M0E1XHU1MjMwXHU2NTcwXHU2MzZFXHU1RTkzXHU2NzBEXHU1MkExXHU1NjY4JyxcbiAgICBkZXRhaWxzOiBzdWNjZXNzID8ge1xuICAgICAgcmVzcG9uc2VUaW1lOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCkgKyAxMCxcbiAgICAgIHZlcnNpb246ICc4LjAuMjgnLFxuICAgICAgY29ubmVjdGlvbklkOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkgKyAxMDAwXG4gICAgfSA6IHtcbiAgICAgIGVycm9yQ29kZTogJ0NPTk5FQ1RJT05fUkVGVVNFRCcsXG4gICAgICBlcnJvckRldGFpbHM6ICdcdTY1RTBcdTZDRDVcdTVFRkFcdTdBQ0JcdTUyMzBcdTY3MERcdTUyQTFcdTU2NjhcdTc2ODRcdThGREVcdTYzQTVcdUZGMENcdThCRjdcdTY4QzBcdTY3RTVcdTdGNTFcdTdFRENcdThCQkVcdTdGNkVcdTU0OENcdTUxRURcdTYzNkUnXG4gICAgfVxuICB9O1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTY3MERcdTUyQTFcbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0RGF0YVNvdXJjZXMsXG4gIGdldERhdGFTb3VyY2UsXG4gIGNyZWF0ZURhdGFTb3VyY2UsXG4gIHVwZGF0ZURhdGFTb3VyY2UsXG4gIGRlbGV0ZURhdGFTb3VyY2UsXG4gIHRlc3RDb25uZWN0aW9uLFxuICByZXNldERhdGFTb3VyY2VzXG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy91dGlscy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTAxQVx1NzUyOFx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTUyMUJcdTVFRkFcdTdFREZcdTRFMDBcdTY4M0NcdTVGMEZcdTU0Q0RcdTVFOTRcdTc2ODRcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbiAqL1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NkEyMVx1NjJERkFQSVx1NjIxMFx1NTI5Rlx1NTRDRFx1NUU5NFxuICogQHBhcmFtIGRhdGEgXHU1NENEXHU1RTk0XHU2NTcwXHU2MzZFXG4gKiBAcGFyYW0gc3VjY2VzcyBcdTYyMTBcdTUyOUZcdTcyQjZcdTYwMDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0F0cnVlXG4gKiBAcGFyYW0gbWVzc2FnZSBcdTUzRUZcdTkwMDlcdTZEODhcdTYwNkZcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NjgzQ1x1NUYwRlx1NzY4NEFQSVx1NTRDRFx1NUU5NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja1Jlc3BvbnNlPFQ+KFxuICBkYXRhOiBULCBcbiAgc3VjY2VzczogYm9vbGVhbiA9IHRydWUsIFxuICBtZXNzYWdlPzogc3RyaW5nXG4pIHtcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzLFxuICAgIGRhdGEsXG4gICAgbWVzc2FnZSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBtb2NrUmVzcG9uc2U6IHRydWUgLy8gXHU2ODA3XHU4QkIwXHU0RTNBXHU2QTIxXHU2MkRGXHU1NENEXHU1RTk0XG4gIH07XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2QTIxXHU2MkRGQVBJXHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKiBAcGFyYW0gbWVzc2FnZSBcdTk1MTlcdThCRUZcdTZEODhcdTYwNkZcbiAqIEBwYXJhbSBjb2RlIFx1OTUxOVx1OEJFRlx1NEVFM1x1NzgwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQSdNT0NLX0VSUk9SJ1xuICogQHBhcmFtIHN0YXR1cyBIVFRQXHU3MkI2XHU2MDAxXHU3ODAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBNTAwXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTY4M0NcdTVGMEZcdTc2ODRcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlKFxuICBtZXNzYWdlOiBzdHJpbmcsIFxuICBjb2RlOiBzdHJpbmcgPSAnTU9DS19FUlJPUicsIFxuICBzdGF0dXM6IG51bWJlciA9IDUwMFxuKSB7XG4gIHJldHVybiB7XG4gICAgc3VjY2VzczogZmFsc2UsXG4gICAgZXJyb3I6IHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBjb2RlLFxuICAgICAgc3RhdHVzQ29kZTogc3RhdHVzXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBtb2NrUmVzcG9uc2U6IHRydWVcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTUyMDZcdTk4NzVcdTU0Q0RcdTVFOTRcdTdFRDNcdTY3ODRcbiAqIEBwYXJhbSBpdGVtcyBcdTVGNTNcdTUyNERcdTk4NzVcdTc2ODRcdTk4NzlcdTc2RUVcdTUyMTdcdTg4NjhcbiAqIEBwYXJhbSB0b3RhbEl0ZW1zIFx1NjAzQlx1OTg3OVx1NzZFRVx1NjU3MFxuICogQHBhcmFtIHBhZ2UgXHU1RjUzXHU1MjREXHU5ODc1XHU3ODAxXG4gKiBAcGFyYW0gc2l6ZSBcdTZCQ0ZcdTk4NzVcdTU5MjdcdTVDMEZcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NFx1N0VEM1x1Njc4NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlPFQ+KFxuICBpdGVtczogVFtdLFxuICB0b3RhbEl0ZW1zOiBudW1iZXIsXG4gIHBhZ2U6IG51bWJlciA9IDEsXG4gIHNpemU6IG51bWJlciA9IDEwXG4pIHtcbiAgcmV0dXJuIGNyZWF0ZU1vY2tSZXNwb25zZSh7XG4gICAgaXRlbXMsXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdG90YWw6IHRvdGFsSXRlbXMsXG4gICAgICBwYWdlLFxuICAgICAgc2l6ZSxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCh0b3RhbEl0ZW1zIC8gc2l6ZSksXG4gICAgICBoYXNNb3JlOiBwYWdlICogc2l6ZSA8IHRvdGFsSXRlbXNcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFx1NUVGNlx1OEZERlxuICogQHBhcmFtIG1zIFx1NUVGNlx1OEZERlx1NkJFQlx1NzlEMlx1NjU3MFx1RkYwQ1x1OUVEOFx1OEJBNDMwMG1zXG4gKiBAcmV0dXJucyBQcm9taXNlXHU1QkY5XHU4QzYxXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxheShtczogbnVtYmVyID0gMzAwKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjcmVhdGVNb2NrUmVzcG9uc2UsXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5XG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3F1ZXJ5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9xdWVyeS50c1wiOy8qKlxuICogXHU2N0U1XHU4QkUyTW9ja1x1NjcwRFx1NTJBMVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY3RTVcdThCRTJcdTc2RjhcdTUxNzNBUElcdTc2ODRcdTZBMjFcdTYyREZcdTVCOUVcdTczQjBcbiAqL1xuXG5pbXBvcnQgeyBkZWxheSwgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLCBjcmVhdGVNb2NrUmVzcG9uc2UsIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU2QTIxXHU2MkRGXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXG5jb25zdCBtb2NrUXVlcmllcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiB7XG4gIGNvbnN0IGlkID0gYHF1ZXJ5LSR7aSArIDF9YDtcbiAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKTtcbiAgXG4gIHJldHVybiB7XG4gICAgaWQsXG4gICAgbmFtZTogYFx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfWAsXG4gICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX0gXHU3Njg0XHU2M0NGXHU4RkYwYCxcbiAgICBmb2xkZXJJZDogaSAlIDMgPT09IDAgPyAnZm9sZGVyLTEnIDogKGkgJSAzID09PSAxID8gJ2ZvbGRlci0yJyA6ICdmb2xkZXItMycpLFxuICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICBkYXRhU291cmNlTmFtZTogYFx1NjU3MFx1NjM2RVx1NkU5MCAkeyhpICUgNSkgKyAxfWAsXG4gICAgcXVlcnlUeXBlOiBpICUgMiA9PT0gMCA/ICdTUUwnIDogJ05BVFVSQUxfTEFOR1VBR0UnLFxuICAgIHF1ZXJ5VGV4dDogaSAlIDIgPT09IDAgPyBcbiAgICAgIGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgIDogXG4gICAgICBgXHU2N0U1XHU2MjdFXHU2NzAwXHU4RkQxMTBcdTY3NjEke2kgJSAyID09PSAwID8gJ1x1OEJBMlx1NTM1NScgOiAnXHU3NTI4XHU2MjM3J31cdThCQjBcdTVGNTVgLFxuICAgIHN0YXR1czogaSAlIDQgPT09IDAgPyAnRFJBRlQnIDogKGkgJSA0ID09PSAxID8gJ1BVQkxJU0hFRCcgOiAoaSAlIDQgPT09IDIgPyAnREVQUkVDQVRFRCcgOiAnQVJDSElWRUQnKSksXG4gICAgc2VydmljZVN0YXR1czogaSAlIDIgPT09IDAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgdXBkYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgIGV4ZWN1dGlvbkNvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCksXG4gICAgaXNGYXZvcml0ZTogaSAlIDMgPT09IDAsXG4gICAgaXNBY3RpdmU6IGkgJSA1ICE9PSAwLFxuICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMCkudG9JU09TdHJpbmcoKSxcbiAgICByZXN1bHRDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgIGV4ZWN1dGlvblRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkgKyAxMCxcbiAgICB0YWdzOiBbYFx1NjgwN1x1N0I3RSR7aSsxfWAsIGBcdTdDN0JcdTU3OEIke2kgJSAzfWBdLFxuICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfSxcbiAgICB2ZXJzaW9uczogW3tcbiAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgcXVlcnlJZDogaWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9XVxuICB9O1xufSk7XG5cbi8vIFx1OTFDRFx1N0Y2RVx1NjdFNVx1OEJFMlx1NjU3MFx1NjM2RVxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0UXVlcmllcygpOiB2b2lkIHtcbiAgLy8gXHU0RkREXHU3NTU5XHU1RjE1XHU3NTI4XHVGRjBDXHU1M0VBXHU5MUNEXHU3RjZFXHU1MTg1XHU1QkI5XG4gIHdoaWxlIChtb2NrUXVlcmllcy5sZW5ndGggPiAwKSB7XG4gICAgbW9ja1F1ZXJpZXMucG9wKCk7XG4gIH1cbiAgXG4gIC8vIFx1OTFDRFx1NjVCMFx1NzUxRlx1NjIxMFx1NjdFNVx1OEJFMlx1NjU3MFx1NjM2RVxuICBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT4ge1xuICAgIGNvbnN0IGlkID0gYHF1ZXJ5LSR7aSArIDF9YDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpO1xuICAgIFxuICAgIG1vY2tRdWVyaWVzLnB1c2goe1xuICAgICAgaWQsXG4gICAgICBuYW1lOiBgXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyICR7aSArIDF9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyICR7aSArIDF9IFx1NzY4NFx1NjNDRlx1OEZGMGAsXG4gICAgICBmb2xkZXJJZDogaSAlIDMgPT09IDAgPyAnZm9sZGVyLTEnIDogKGkgJSAzID09PSAxID8gJ2ZvbGRlci0yJyA6ICdmb2xkZXItMycpLFxuICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgZGF0YVNvdXJjZU5hbWU6IGBcdTY1NzBcdTYzNkVcdTZFOTAgJHsoaSAlIDUpICsgMX1gLFxuICAgICAgcXVlcnlUeXBlOiBpICUgMiA9PT0gMCA/ICdTUUwnIDogJ05BVFVSQUxfTEFOR1VBR0UnLFxuICAgICAgcXVlcnlUZXh0OiBpICUgMiA9PT0gMCA/IFxuICAgICAgICBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCA6IFxuICAgICAgICBgXHU2N0U1XHU2MjdFXHU2NzAwXHU4RkQxMTBcdTY3NjEke2kgJSAyID09PSAwID8gJ1x1OEJBMlx1NTM1NScgOiAnXHU3NTI4XHU2MjM3J31cdThCQjBcdTVGNTVgLFxuICAgICAgc3RhdHVzOiBpICUgNCA9PT0gMCA/ICdEUkFGVCcgOiAoaSAlIDQgPT09IDEgPyAnUFVCTElTSEVEJyA6IChpICUgNCA9PT0gMiA/ICdERVBSRUNBVEVEJyA6ICdBUkNISVZFRCcpKSxcbiAgICAgIHNlcnZpY2VTdGF0dXM6IGkgJSAyID09PSAwID8gJ0VOQUJMRUQnIDogJ0RJU0FCTEVEJyxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgY3JlYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgICAgdXBkYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgICAgZXhlY3V0aW9uQ291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSxcbiAgICAgIGlzRmF2b3JpdGU6IGkgJSAzID09PSAwLFxuICAgICAgaXNBY3RpdmU6IGkgJSA1ICE9PSAwLFxuICAgICAgbGFzdEV4ZWN1dGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogNDMyMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgcmVzdWx0Q291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyAxMCxcbiAgICAgIGV4ZWN1dGlvblRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkgKyAxMCxcbiAgICAgIHRhZ3M6IFtgXHU2ODA3XHU3QjdFJHtpKzF9YCwgYFx1N0M3Qlx1NTc4QiR7aSAlIDN9YF0sXG4gICAgICBjdXJyZW50VmVyc2lvbjoge1xuICAgICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgICAgcXVlcnlJZDogaWQsXG4gICAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgICAgfSxcbiAgICAgIHZlcnNpb25zOiBbe1xuICAgICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgICAgcXVlcnlJZDogaWQsXG4gICAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgICAgfV1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNpbXVsYXRlRGVsYXkoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRlbGF5VGltZSA9IHR5cGVvZiBtb2NrQ29uZmlnLmRlbGF5ID09PSAnbnVtYmVyJyA/IG1vY2tDb25maWcuZGVsYXkgOiAzMDA7XG4gIHJldHVybiBkZWxheShkZWxheVRpbWUpO1xufVxuXG4vKipcbiAqIFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMVxuICovXG5jb25zdCBxdWVyeVNlcnZpY2UgPSB7XG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJpZXMocGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICAgIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU4RkM3XHU2RUU0XG4gICAgbGV0IGZpbHRlcmVkSXRlbXMgPSBbLi4ubW9ja1F1ZXJpZXNdO1xuICAgIFxuICAgIC8vIFx1NjMwOVx1NTQwRFx1NzlGMFx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/Lm5hbWUpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSBwYXJhbXMubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gXG4gICAgICAgIHEubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgICAocS5kZXNjcmlwdGlvbiAmJiBxLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTY1NzBcdTYzNkVcdTZFOTBcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5kYXRhU291cmNlSWQpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEuZGF0YVNvdXJjZUlkID09PSBwYXJhbXMuZGF0YVNvdXJjZUlkKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU3MkI2XHU2MDAxXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1N0M3Qlx1NTc4Qlx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LnF1ZXJ5VHlwZSkge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5xdWVyeVR5cGUgPT09IHBhcmFtcy5xdWVyeVR5cGUpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTY1MzZcdTg1Q0ZcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5pc0Zhdm9yaXRlKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLmlzRmF2b3JpdGUgPT09IHRydWUpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmlsdGVyZWRJdGVtcy5sZW5ndGgpO1xuICAgIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICB0b3RhbDogZmlsdGVyZWRJdGVtcy5sZW5ndGgsXG4gICAgICAgIHBhZ2UsXG4gICAgICAgIHNpemUsXG4gICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmaWx0ZXJlZEl0ZW1zLmxlbmd0aCAvIHNpemUpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY1MzZcdTg1Q0ZcdTc2ODRcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldEZhdm9yaXRlUXVlcmllcyhwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdThGQzdcdTZFRTRcdTUxRkFcdTY1MzZcdTg1Q0ZcdTc2ODRcdTY3RTVcdThCRTJcbiAgICBsZXQgZmF2b3JpdGVRdWVyaWVzID0gbW9ja1F1ZXJpZXMuZmlsdGVyKHEgPT4gcS5pc0Zhdm9yaXRlID09PSB0cnVlKTtcbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdTUxNzZcdTRFRDZcdThGQzdcdTZFRTRcdTY3NjFcdTRFRjZcbiAgICBpZiAocGFyYW1zPy5uYW1lIHx8IHBhcmFtcz8uc2VhcmNoKSB7XG4gICAgICBjb25zdCBrZXl3b3JkID0gKHBhcmFtcy5uYW1lIHx8IHBhcmFtcy5zZWFyY2ggfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmYXZvcml0ZVF1ZXJpZXMgPSBmYXZvcml0ZVF1ZXJpZXMuZmlsdGVyKHEgPT4gXG4gICAgICAgIHEubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgICAocS5kZXNjcmlwdGlvbiAmJiBxLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICBpZiAocGFyYW1zPy5kYXRhU291cmNlSWQpIHtcbiAgICAgIGZhdm9yaXRlUXVlcmllcyA9IGZhdm9yaXRlUXVlcmllcy5maWx0ZXIocSA9PiBxLmRhdGFTb3VyY2VJZCA9PT0gcGFyYW1zLmRhdGFTb3VyY2VJZCk7XG4gICAgfVxuICAgIFxuICAgIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgICAgZmF2b3JpdGVRdWVyaWVzID0gZmF2b3JpdGVRdWVyaWVzLmZpbHRlcihxID0+IHEuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZhdm9yaXRlUXVlcmllcy5sZW5ndGgpO1xuICAgIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gZmF2b3JpdGVRdWVyaWVzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiBmYXZvcml0ZVF1ZXJpZXMubGVuZ3RoLFxuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmF2b3JpdGVRdWVyaWVzLmxlbmd0aCAvIHNpemUpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5KGlkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzLmZpbmQocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFxdWVyeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBxdWVyeTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGNyZWF0ZVF1ZXJ5KGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjVCMElEXHVGRjBDXHU2ODNDXHU1RjBGXHU0RTBFXHU3M0IwXHU2NzA5SURcdTRFMDBcdTgxRjRcbiAgICBjb25zdCBpZCA9IGBxdWVyeS0ke21vY2tRdWVyaWVzLmxlbmd0aCArIDF9YDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgbmV3UXVlcnkgPSB7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6IGRhdGEubmFtZSB8fCBgXHU2NUIwXHU2N0U1XHU4QkUyICR7aWR9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgICAgZm9sZGVySWQ6IGRhdGEuZm9sZGVySWQgfHwgbnVsbCxcbiAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQsXG4gICAgICBkYXRhU291cmNlTmFtZTogZGF0YS5kYXRhU291cmNlTmFtZSB8fCBgXHU2NTcwXHU2MzZFXHU2RTkwICR7ZGF0YS5kYXRhU291cmNlSWR9YCxcbiAgICAgIHF1ZXJ5VHlwZTogZGF0YS5xdWVyeVR5cGUgfHwgJ1NRTCcsXG4gICAgICBxdWVyeVRleHQ6IGRhdGEucXVlcnlUZXh0IHx8ICcnLFxuICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyB8fCAnRFJBRlQnLFxuICAgICAgc2VydmljZVN0YXR1czogZGF0YS5zZXJ2aWNlU3RhdHVzIHx8ICdESVNBQkxFRCcsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgY3JlYXRlZEJ5OiBkYXRhLmNyZWF0ZWRCeSB8fCB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgICAgdXBkYXRlZEJ5OiBkYXRhLnVwZGF0ZWRCeSB8fCB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgICAgZXhlY3V0aW9uQ291bnQ6IDAsXG4gICAgICBpc0Zhdm9yaXRlOiBkYXRhLmlzRmF2b3JpdGUgfHwgZmFsc2UsXG4gICAgICBpc0FjdGl2ZTogZGF0YS5pc0FjdGl2ZSB8fCB0cnVlLFxuICAgICAgbGFzdEV4ZWN1dGVkQXQ6IG51bGwsXG4gICAgICByZXN1bHRDb3VudDogMCxcbiAgICAgIGV4ZWN1dGlvblRpbWU6IDAsXG4gICAgICB0YWdzOiBkYXRhLnRhZ3MgfHwgW10sXG4gICAgICBjdXJyZW50VmVyc2lvbjoge1xuICAgICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgICAgcXVlcnlJZDogaWQsXG4gICAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICAgIG5hbWU6ICdcdTUyMURcdTU5Q0JcdTcyNDhcdTY3MkMnLFxuICAgICAgICBzcWw6IGRhdGEucXVlcnlUZXh0IHx8ICcnLFxuICAgICAgICBkYXRhU291cmNlSWQ6IGRhdGEuZGF0YVNvdXJjZUlkLFxuICAgICAgICBzdGF0dXM6ICdEUkFGVCcsXG4gICAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgICAgfSxcbiAgICAgIHZlcnNpb25zOiBbe1xuICAgICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgICAgcXVlcnlJZDogaWQsXG4gICAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICAgIG5hbWU6ICdcdTUyMURcdTU5Q0JcdTcyNDhcdTY3MkMnLFxuICAgICAgICBzcWw6IGRhdGEucXVlcnlUZXh0IHx8ICcnLFxuICAgICAgICBkYXRhU291cmNlSWQ6IGRhdGEuZGF0YVNvdXJjZUlkLFxuICAgICAgICBzdGF0dXM6ICdEUkFGVCcsXG4gICAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgICAgfV1cbiAgICB9O1xuICAgIFxuICAgIC8vIFx1NkRGQlx1NTJBMFx1NTIzMFx1NTIxN1x1ODg2OFxuICAgIG1vY2tRdWVyaWVzLnB1c2gobmV3UXVlcnkpO1xuICAgIFxuICAgIHJldHVybiBuZXdRdWVyeTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIHVwZGF0ZVF1ZXJ5KGlkOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1ODk4MVx1NjZGNFx1NjVCMFx1NzY4NFx1NjdFNVx1OEJFMlx1N0QyMlx1NUYxNVxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgICBjb25zdCB1cGRhdGVkUXVlcnkgPSB7XG4gICAgICAuLi5tb2NrUXVlcmllc1tpbmRleF0sXG4gICAgICAuLi5kYXRhLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQnk6IGRhdGEudXBkYXRlZEJ5IHx8IG1vY2tRdWVyaWVzW2luZGV4XS51cGRhdGVkQnkgfHwgeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2NkZGXHU2MzYyXHU2N0U1XHU4QkUyXG4gICAgbW9ja1F1ZXJpZXNbaW5kZXhdID0gdXBkYXRlZFF1ZXJ5O1xuICAgIFxuICAgIHJldHVybiB1cGRhdGVkUXVlcnk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBkZWxldGVRdWVyeShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1ODk4MVx1NTIyMFx1OTY2NFx1NzY4NFx1NjdFNVx1OEJFMlx1N0QyMlx1NUYxNVxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICBtb2NrUXVlcmllcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZVF1ZXJ5KGlkOiBzdHJpbmcsIHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXMuZmluZChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU3NTFGXHU2MjEwXHU2QTIxXHU2MkRGXHU3RUQzXHU2NzlDXG4gICAgY29uc3QgY29sdW1ucyA9IFsnaWQnLCAnbmFtZScsICdlbWFpbCcsICdzdGF0dXMnLCAnY3JlYXRlZF9hdCddO1xuICAgIGNvbnN0IHJvd3MgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT4gKHtcbiAgICAgIGlkOiBpICsgMSxcbiAgICAgIG5hbWU6IGBcdTc1MjhcdTYyMzcgJHtpICsgMX1gLFxuICAgICAgZW1haWw6IGB1c2VyJHtpICsgMX1AZXhhbXBsZS5jb21gLFxuICAgICAgc3RhdHVzOiBpICUgMiA9PT0gMCA/ICdhY3RpdmUnIDogJ2luYWN0aXZlJyxcbiAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKClcbiAgICB9KSk7XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU2MjY3XHU4ODRDXHU3RURGXHU4QkExXG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgbW9ja1F1ZXJpZXNbaW5kZXhdID0ge1xuICAgICAgICAuLi5tb2NrUXVlcmllc1tpbmRleF0sXG4gICAgICAgIGV4ZWN1dGlvbkNvdW50OiAobW9ja1F1ZXJpZXNbaW5kZXhdLmV4ZWN1dGlvbkNvdW50IHx8IDApICsgMSxcbiAgICAgICAgbGFzdEV4ZWN1dGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgcmVzdWx0Q291bnQ6IHJvd3MubGVuZ3RoXG4gICAgICB9O1xuICAgIH1cbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgY29sdW1ucyxcbiAgICAgIHJvd3MsXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBleGVjdXRpb25UaW1lOiBNYXRoLnJhbmRvbSgpICogMC41ICsgMC4xLFxuICAgICAgICByb3dDb3VudDogcm93cy5sZW5ndGgsXG4gICAgICAgIHRvdGFsUGFnZXM6IDFcbiAgICAgIH0sXG4gICAgICBxdWVyeToge1xuICAgICAgICBpZDogcXVlcnkuaWQsXG4gICAgICAgIG5hbWU6IHF1ZXJ5Lm5hbWUsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogcXVlcnkuZGF0YVNvdXJjZUlkXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMDdcdTYzNjJcdTY3RTVcdThCRTJcdTY1MzZcdTg1Q0ZcdTcyQjZcdTYwMDFcbiAgICovXG4gIGFzeW5jIHRvZ2dsZUZhdm9yaXRlKGlkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjA3XHU2MzYyXHU2NTM2XHU4NUNGXHU3MkI2XHU2MDAxXG4gICAgbW9ja1F1ZXJpZXNbaW5kZXhdID0ge1xuICAgICAgLi4ubW9ja1F1ZXJpZXNbaW5kZXhdLFxuICAgICAgaXNGYXZvcml0ZTogIW1vY2tRdWVyaWVzW2luZGV4XS5pc0Zhdm9yaXRlLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBtb2NrUXVlcmllc1tpbmRleF07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1Mzg2XHU1M0YyXG4gICAqL1xuICBhc3luYyBnZXRRdWVyeUhpc3RvcnkocGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICAgIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gICAgXG4gICAgLy8gXHU3NTFGXHU2MjEwXHU2QTIxXHU2MkRGXHU1Mzg2XHU1M0YyXHU4QkIwXHU1RjU1XG4gICAgY29uc3QgdG90YWxJdGVtcyA9IDIwO1xuICAgIGNvbnN0IGhpc3RvcmllcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHRvdGFsSXRlbXMgfSwgKF8sIGkpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogMzYwMDAwMCkudG9JU09TdHJpbmcoKTtcbiAgICAgIGNvbnN0IHF1ZXJ5SW5kZXggPSBpICUgbW9ja1F1ZXJpZXMubGVuZ3RoO1xuICAgICAgXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogYGhpc3QtJHtpICsgMX1gLFxuICAgICAgICBxdWVyeUlkOiBtb2NrUXVlcmllc1txdWVyeUluZGV4XS5pZCxcbiAgICAgICAgcXVlcnlOYW1lOiBtb2NrUXVlcmllc1txdWVyeUluZGV4XS5uYW1lLFxuICAgICAgICBleGVjdXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICAgIGV4ZWN1dGlvblRpbWU6IE1hdGgucmFuZG9tKCkgKiAwLjUgKyAwLjEsXG4gICAgICAgIHJvd0NvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApICsgMSxcbiAgICAgICAgdXNlcklkOiAndXNlcjEnLFxuICAgICAgICB1c2VyTmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycsXG4gICAgICAgIHN0YXR1czogaSAlIDggPT09IDAgPyAnRkFJTEVEJyA6ICdTVUNDRVNTJyxcbiAgICAgICAgZXJyb3JNZXNzYWdlOiBpICUgOCA9PT0gMCA/ICdcdTY3RTVcdThCRTJcdTYyNjdcdTg4NENcdThEODVcdTY1RjYnIDogbnVsbFxuICAgICAgfTtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgdG90YWxJdGVtcyk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBoaXN0b3JpZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IHRvdGFsSXRlbXMsXG4gICAgICAgIHBhZ2UsXG4gICAgICAgIHNpemUsXG4gICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCh0b3RhbEl0ZW1zIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnlWZXJzaW9ucyhxdWVyeUlkOiBzdHJpbmcsIHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXMuZmluZChxID0+IHEuaWQgPT09IHF1ZXJ5SWQpO1xuICAgIFxuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3F1ZXJ5SWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NzI0OFx1NjcyQ1x1NTIxN1x1ODg2OFxuICAgIHJldHVybiBxdWVyeS52ZXJzaW9ucyB8fCBbXTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgICovXG4gIGFzeW5jIGNyZWF0ZVF1ZXJ5VmVyc2lvbihxdWVyeUlkOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7cXVlcnlJZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwXHU3MjQ4XHU2NzJDXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllc1tpbmRleF07XG4gICAgY29uc3QgbmV3VmVyc2lvbk51bWJlciA9IChxdWVyeS52ZXJzaW9ucz8ubGVuZ3RoIHx8IDApICsgMTtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgY29uc3QgbmV3VmVyc2lvbiA9IHtcbiAgICAgIGlkOiBgdmVyLSR7cXVlcnlJZH0tJHtuZXdWZXJzaW9uTnVtYmVyfWAsXG4gICAgICBxdWVyeUlkLFxuICAgICAgdmVyc2lvbk51bWJlcjogbmV3VmVyc2lvbk51bWJlcixcbiAgICAgIG5hbWU6IGRhdGEubmFtZSB8fCBgXHU3MjQ4XHU2NzJDICR7bmV3VmVyc2lvbk51bWJlcn1gLFxuICAgICAgc3FsOiBkYXRhLnNxbCB8fCBxdWVyeS5xdWVyeVRleHQgfHwgJycsXG4gICAgICBkYXRhU291cmNlSWQ6IGRhdGEuZGF0YVNvdXJjZUlkIHx8IHF1ZXJ5LmRhdGFTb3VyY2VJZCxcbiAgICAgIHN0YXR1czogJ0RSQUZUJyxcbiAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9O1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NEU0Qlx1NTI0RFx1NzI0OFx1NjcyQ1x1NzY4NGlzTGF0ZXN0XHU2ODA3XHU1RkQ3XG4gICAgaWYgKHF1ZXJ5LnZlcnNpb25zICYmIHF1ZXJ5LnZlcnNpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIHF1ZXJ5LnZlcnNpb25zID0gcXVlcnkudmVyc2lvbnMubWFwKHYgPT4gKHtcbiAgICAgICAgLi4udixcbiAgICAgICAgaXNMYXRlc3Q6IGZhbHNlXG4gICAgICB9KSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NkRGQlx1NTJBMFx1NjVCMFx1NzI0OFx1NjcyQ1xuICAgIGlmICghcXVlcnkudmVyc2lvbnMpIHtcbiAgICAgIHF1ZXJ5LnZlcnNpb25zID0gW107XG4gICAgfVxuICAgIHF1ZXJ5LnZlcnNpb25zLnB1c2gobmV3VmVyc2lvbik7XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDXG4gICAgbW9ja1F1ZXJpZXNbaW5kZXhdID0ge1xuICAgICAgLi4ucXVlcnksXG4gICAgICBjdXJyZW50VmVyc2lvbjogbmV3VmVyc2lvbixcbiAgICAgIHVwZGF0ZWRBdDogdGltZXN0YW1wXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gbmV3VmVyc2lvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUzRDFcdTVFMDNcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgICovXG4gIGFzeW5jIHB1Ymxpc2hRdWVyeVZlcnNpb24odmVyc2lvbklkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTUzMDVcdTU0MkJcdTZCNjRcdTcyNDhcdTY3MkNcdTc2ODRcdTY3RTVcdThCRTJcbiAgICBsZXQgcXVlcnkgPSBudWxsO1xuICAgIGxldCB2ZXJzaW9uSW5kZXggPSAtMTtcbiAgICBsZXQgcXVlcnlJbmRleCA9IC0xO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9ja1F1ZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtb2NrUXVlcmllc1tpXS52ZXJzaW9ucykge1xuICAgICAgICBjb25zdCB2SW5kZXggPSBtb2NrUXVlcmllc1tpXS52ZXJzaW9ucy5maW5kSW5kZXgodiA9PiB2LmlkID09PSB2ZXJzaW9uSWQpO1xuICAgICAgICBpZiAodkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbaV07XG4gICAgICAgICAgdmVyc2lvbkluZGV4ID0gdkluZGV4O1xuICAgICAgICAgIHF1ZXJ5SW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmICghcXVlcnkgfHwgdmVyc2lvbkluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7dmVyc2lvbklkfVx1NzY4NFx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ2ApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTcyNDhcdTY3MkNcdTcyQjZcdTYwMDFcbiAgICBjb25zdCB1cGRhdGVkVmVyc2lvbiA9IHtcbiAgICAgIC4uLnF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF0sXG4gICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgcHVibGlzaGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSA9IHVwZGF0ZWRWZXJzaW9uO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NzJCNlx1NjAwMVxuICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgLi4ucXVlcnksXG4gICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgY3VycmVudFZlcnNpb246IHVwZGF0ZWRWZXJzaW9uLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiB1cGRhdGVkVmVyc2lvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTVFOUZcdTVGMDNcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgICovXG4gIGFzeW5jIGRlcHJlY2F0ZVF1ZXJ5VmVyc2lvbih2ZXJzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NTMwNVx1NTQyQlx1NkI2NFx1NzI0OFx1NjcyQ1x1NzY4NFx1NjdFNVx1OEJFMlxuICAgIGxldCBxdWVyeSA9IG51bGw7XG4gICAgbGV0IHZlcnNpb25JbmRleCA9IC0xO1xuICAgIGxldCBxdWVyeUluZGV4ID0gLTE7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2NrUXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zKSB7XG4gICAgICAgIGNvbnN0IHZJbmRleCA9IG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zLmZpbmRJbmRleCh2ID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgICAgIGlmICh2SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgcXVlcnkgPSBtb2NrUXVlcmllc1tpXTtcbiAgICAgICAgICB2ZXJzaW9uSW5kZXggPSB2SW5kZXg7XG4gICAgICAgICAgcXVlcnlJbmRleCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKCFxdWVyeSB8fCB2ZXJzaW9uSW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHt2ZXJzaW9uSWR9XHU3Njg0XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NzI0OFx1NjcyQ1x1NzJCNlx1NjAwMVxuICAgIGNvbnN0IHVwZGF0ZWRWZXJzaW9uID0ge1xuICAgICAgLi4ucXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSxcbiAgICAgIHN0YXR1czogJ0RFUFJFQ0FURUQnLFxuICAgICAgZGVwcmVjYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF0gPSB1cGRhdGVkVmVyc2lvbjtcbiAgICBcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTVFOUZcdTVGMDNcdTc2ODRcdTY2MkZcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkNcdUZGMENcdTUyMTlcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTcyQjZcdTYwMDFcbiAgICBpZiAocXVlcnkuY3VycmVudFZlcnNpb24gJiYgcXVlcnkuY3VycmVudFZlcnNpb24uaWQgPT09IHZlcnNpb25JZCkge1xuICAgICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAgIC4uLnF1ZXJ5LFxuICAgICAgICBzdGF0dXM6ICdERVBSRUNBVEVEJyxcbiAgICAgICAgY3VycmVudFZlcnNpb246IHVwZGF0ZWRWZXJzaW9uLFxuICAgICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAgIC4uLnF1ZXJ5LFxuICAgICAgICB2ZXJzaW9uczogcXVlcnkudmVyc2lvbnMsXG4gICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICB9O1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdXBkYXRlZFZlcnNpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2RkMwXHU2RDNCXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBhY3RpdmF0ZVF1ZXJ5VmVyc2lvbihxdWVyeUlkOiBzdHJpbmcsIHZlcnNpb25JZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnlJbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IHF1ZXJ5SWQpO1xuICAgIFxuICAgIGlmIChxdWVyeUluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7cXVlcnlJZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllc1txdWVyeUluZGV4XTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTcyNDhcdTY3MkNcbiAgICBpZiAoIXF1ZXJ5LnZlcnNpb25zKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjdFNVx1OEJFMiAke3F1ZXJ5SWR9IFx1NkNBMVx1NjcwOVx1NzI0OFx1NjcyQ2ApO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCB2ZXJzaW9uSW5kZXggPSBxdWVyeS52ZXJzaW9ucy5maW5kSW5kZXgodiA9PiB2LmlkID09PSB2ZXJzaW9uSWQpO1xuICAgIFxuICAgIGlmICh2ZXJzaW9uSW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHt2ZXJzaW9uSWR9XHU3Njg0XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1ODNCN1x1NTNENlx1ODk4MVx1NkZDMFx1NkQzQlx1NzY4NFx1NzI0OFx1NjcyQ1xuICAgIGNvbnN0IHZlcnNpb25Ub0FjdGl2YXRlID0gcXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkNcdTU0OENcdTY3RTVcdThCRTJcdTcyQjZcdTYwMDFcbiAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgIC4uLnF1ZXJ5LFxuICAgICAgY3VycmVudFZlcnNpb246IHZlcnNpb25Ub0FjdGl2YXRlLFxuICAgICAgc3RhdHVzOiB2ZXJzaW9uVG9BY3RpdmF0ZS5zdGF0dXMsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHZlcnNpb25Ub0FjdGl2YXRlO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBxdWVyeVNlcnZpY2U7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5NkM2XHU0RTJEXHU1QkZDXHU1MUZBXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1N0VERlx1NEUwMFx1NzY4NEFQSSBNb2NrXHU2NzBEXHU1MkExXHU1MTY1XHU1M0UzXHU3MEI5XG4gKi9cblxuLy8gXHU1QkZDXHU1MTY1XHU2NTcwXHU2MzZFXHU2RTkwXHU2NzBEXHU1MkExXG5pbXBvcnQgZGF0YVNvdXJjZSBmcm9tICcuL2RhdGFzb3VyY2UnO1xuLy8gXHU1QkZDXHU1MTY1XHU1QjhDXHU2NTc0XHU3Njg0XHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExXHU1QjlFXHU3M0IwXG5pbXBvcnQgcXVlcnlTZXJ2aWNlSW1wbGVtZW50YXRpb24gZnJvbSAnLi9xdWVyeSc7XG5cbi8vIFx1NUJGQ1x1NTE2NVx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuaW1wb3J0IHsgXG4gIGNyZWF0ZU1vY2tSZXNwb25zZSwgXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLCBcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheSBcbn0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogXHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExTW9ja1xuICogQGRlcHJlY2F0ZWQgXHU0RjdGXHU3NTI4XHU0RUNFICcuL3F1ZXJ5JyBcdTVCRkNcdTUxNjVcdTc2ODRcdTVCOENcdTY1NzRcdTVCOUVcdTczQjBcdTRFRTNcdTY2RkZcbiAqL1xuY29uc3QgcXVlcnkgPSB7XG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJpZXMocGFyYW1zOiB7IHBhZ2U6IG51bWJlcjsgc2l6ZTogbnVtYmVyOyB9KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4gY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlKHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgaWQ6ICdxMScsIG5hbWU6ICdcdTc1MjhcdTYyMzdcdTUyMDZcdTY3OTBcdTY3RTVcdThCRTInLCBkZXNjcmlwdGlvbjogJ1x1NjMwOVx1NTczMFx1NTMzQVx1N0VERlx1OEJBMVx1NzUyOFx1NjIzN1x1NkNFOFx1NTE4Q1x1NjU3MFx1NjM2RScsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICAgIHsgaWQ6ICdxMicsIG5hbWU6ICdcdTk1MDBcdTU1MkVcdTRFMUFcdTdFRTlcdTY3RTVcdThCRTInLCBkZXNjcmlwdGlvbjogJ1x1NjMwOVx1NjcwOFx1N0VERlx1OEJBMVx1OTUwMFx1NTUyRVx1OTg5RCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICAgIHsgaWQ6ICdxMycsIG5hbWU6ICdcdTVFOTNcdTVCNThcdTUyMDZcdTY3OTAnLCBkZXNjcmlwdGlvbjogJ1x1NzZEMVx1NjNBN1x1NUU5M1x1NUI1OFx1NkMzNFx1NUU3MycsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICBdLFxuICAgICAgdG90YWw6IDMsXG4gICAgICBwYWdlOiBwYXJhbXMucGFnZSxcbiAgICAgIHNpemU6IHBhcmFtcy5zaXplXG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnkoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogJ1x1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMicsXG4gICAgICBzcWw6ICdTRUxFQ1QgKiBGUk9NIHVzZXJzIFdIRVJFIHN0YXR1cyA9ICQxJyxcbiAgICAgIHBhcmFtZXRlcnM6IFsnYWN0aXZlJ10sXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBjcmVhdGVRdWVyeShkYXRhOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZDogYHF1ZXJ5LSR7RGF0ZS5ub3coKX1gLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIHVwZGF0ZVF1ZXJ5KGlkOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBkZWxldGVRdWVyeShpZDogc3RyaW5nKSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZVF1ZXJ5KGlkOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgY29sdW1uczogWydpZCcsICduYW1lJywgJ2VtYWlsJywgJ3N0YXR1cyddLFxuICAgICAgcm93czogW1xuICAgICAgICB7IGlkOiAxLCBuYW1lOiAnXHU1RjIwXHU0RTA5JywgZW1haWw6ICd6aGFuZ0BleGFtcGxlLmNvbScsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgICAgICAgeyBpZDogMiwgbmFtZTogJ1x1Njc0RVx1NTZEQicsIGVtYWlsOiAnbGlAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIG5hbWU6ICdcdTczOEJcdTRFOTQnLCBlbWFpbDogJ3dhbmdAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdpbmFjdGl2ZScgfSxcbiAgICAgIF0sXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBleGVjdXRpb25UaW1lOiAwLjIzNSxcbiAgICAgICAgcm93Q291bnQ6IDMsXG4gICAgICAgIHRvdGFsUGFnZXM6IDFcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIFx1NUJGQ1x1NTFGQVx1NjI0MFx1NjcwOVx1NjcwRFx1NTJBMVxuICovXG5jb25zdCBzZXJ2aWNlcyA9IHtcbiAgZGF0YVNvdXJjZSxcbiAgcXVlcnk6IHF1ZXJ5U2VydmljZUltcGxlbWVudGF0aW9uXG59O1xuXG4vLyBcdTVCRkNcdTUxRkFtb2NrIHNlcnZpY2VcdTVERTVcdTUxNzdcbmV4cG9ydCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NTQwNFx1NEUyQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGNvbnN0IGRhdGFTb3VyY2VTZXJ2aWNlID0gc2VydmljZXMuZGF0YVNvdXJjZTtcbmV4cG9ydCBjb25zdCBxdWVyeVNlcnZpY2UgPSBzZXJ2aWNlcy5xdWVyeTtcblxuLy8gXHU5RUQ4XHU4QkE0XHU1QkZDXHU1MUZBXHU2MjQwXHU2NzA5XHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCBzZXJ2aWNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZS50c1wiO2ltcG9ydCB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCAqIGFzIGh0dHAgZnJvbSAnaHR0cCc7XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU0RTAwXHU0RTJBXHU3QjgwXHU1MzU1XHU3Njg0XHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XG4gKiBcdTUzRUFcdTU5MDRcdTc0MDYvYXBpL3Rlc3RcdThERUZcdTVGODRcdUZGMENcdTc1MjhcdTRFOEVcdTZENEJcdThCRDVNb2NrXHU3Q0ZCXHU3RURGXHU2NjJGXHU1NDI2XHU2QjYzXHU1RTM4XHU1REU1XHU0RjVDXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlKCkge1xuICBjb25zb2xlLmxvZygnW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1REYyXHU1MjFCXHU1RUZBXHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU1QzA2XHU1OTA0XHU3NDA2L2FwaS90ZXN0XHU4REVGXHU1Rjg0XHU3Njg0XHU4QkY3XHU2QzQyJyk7XG4gIFxuICByZXR1cm4gZnVuY3Rpb24gc2ltcGxlTWlkZGxld2FyZShcbiAgICByZXE6IGh0dHAuSW5jb21pbmdNZXNzYWdlLFxuICAgIHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSxcbiAgICBuZXh0OiBDb25uZWN0Lk5leHRGdW5jdGlvblxuICApIHtcbiAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2QgfHwgJ1VOS05PV04nO1xuICAgIFxuICAgIC8vIFx1NTNFQVx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFxuICAgIGlmICh1cmwgPT09ICcvYXBpL3Rlc3QnKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU2NTM2XHU1MjMwXHU2RDRCXHU4QkQ1XHU4QkY3XHU2QzQyOiAke21ldGhvZH0gJHt1cmx9YCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFx1OEJCRVx1N0Y2RUNPUlNcdTU5MzRcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uJyk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmIChtZXRob2QgPT09ICdPUFRJT05TJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyJyk7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU3ODZFXHU0RkREXHU4OTg2XHU3NkQ2XHU2Mzg5XHU2MjQwXHU2NzA5XHU1REYyXHU2NzA5XHU3Njg0Q29udGVudC1UeXBlXHVGRjBDXHU5MDdGXHU1MTREXHU4OEFCXHU1NDBFXHU3RUVEXHU0RTJEXHU5NUY0XHU0RUY2XHU2NkY0XHU2NTM5XG4gICAgICAgIHJlcy5yZW1vdmVIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTFDNlx1NTkwN1x1NTRDRFx1NUU5NFx1NjU3MFx1NjM2RVxuICAgICAgICBjb25zdCByZXNwb25zZURhdGEgPSB7XG4gICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiAnXHU3QjgwXHU1MzU1XHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XHU1NENEXHU1RTk0XHU2MjEwXHU1MjlGJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMsXG4gICAgICAgICAgICBwYXJhbXM6IHVybC5pbmNsdWRlcygnPycpID8gdXJsLnNwbGl0KCc/JylbMV0gOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1M0QxXHU5MDAxXHU1NENEXHU1RTk0XHU1MjREXHU3ODZFXHU0RkREXHU0RTJEXHU2NUFEXHU4QkY3XHU2QzQyXHU5NEZFXG4gICAgICAgIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTUzRDFcdTkwMDFcdTZENEJcdThCRDVcdTU0Q0RcdTVFOTQnKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwb25zZURhdGEsIG51bGwsIDIpKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NEUwRFx1OEMwM1x1NzUyOG5leHQoKVx1RkYwQ1x1Nzg2RVx1NEZERFx1OEJGN1x1NkM0Mlx1NTIzMFx1NkI2NFx1N0VEM1x1Njc1RlxuICAgICAgICByZXR1cm47XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTk1MTlcdThCRUZcbiAgICAgICAgY29uc29sZS5lcnJvcignW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU2NUY2XHU1MUZBXHU5NTE5OicsIGVycm9yKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NkUwNVx1OTY2NFx1NURGMlx1NjcwOVx1NzY4NFx1NTkzNFx1RkYwQ1x1OTA3Rlx1NTE0RENvbnRlbnQtVHlwZVx1ODhBQlx1NjZGNFx1NjUzOVxuICAgICAgICByZXMucmVtb3ZlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTY1RjZcdTUxRkFcdTk1MTknLFxuICAgICAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcilcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU0RTBEXHU4QzAzXHU3NTI4bmV4dCgpXHVGRjBDXHU3ODZFXHU0RkREXHU4QkY3XHU2QzQyXHU1MjMwXHU2QjY0XHU3RUQzXHU2NzVGXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU0RTBEXHU1OTA0XHU3NDA2XHU3Njg0XHU4QkY3XHU2QzQyXHU0RUE0XHU3RUQ5XHU0RTBCXHU0RTAwXHU0RTJBXHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgbmV4dCgpO1xuICB9O1xufSAiXSwKICAibWFwcGluZ3MiOiAiO0FBQTBZLFNBQVMsY0FBYyxlQUFnQztBQUNqYyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZ0JBQWdCO0FBQ3pCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCOzs7QUNJekIsU0FBUyxhQUFhOzs7QUNGZixTQUFTLFlBQXFCO0FBQ25DLE1BQUk7QUFFRixRQUFJLE9BQU8sWUFBWSxlQUFlLFFBQVEsS0FBSztBQUNqRCxVQUFJLFFBQVEsSUFBSSxzQkFBc0IsUUFBUTtBQUM1QyxlQUFPO0FBQUEsTUFDVDtBQUNBLFVBQUksUUFBUSxJQUFJLHNCQUFzQixTQUFTO0FBQzdDLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFFBQUksT0FBTyxnQkFBZ0IsZUFBZSxZQUFZLEtBQUs7QUFDekQsVUFBSSxZQUFZLElBQUksc0JBQXNCLFFBQVE7QUFDaEQsZUFBTztBQUFBLE1BQ1Q7QUFDQSxVQUFJLFlBQVksSUFBSSxzQkFBc0IsU0FBUztBQUNqRCxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFHQSxRQUFJLE9BQU8sV0FBVyxlQUFlLE9BQU8sY0FBYztBQUN4RCxZQUFNLG9CQUFvQixhQUFhLFFBQVEsY0FBYztBQUM3RCxVQUFJLHNCQUFzQixRQUFRO0FBQ2hDLGVBQU87QUFBQSxNQUNUO0FBQ0EsVUFBSSxzQkFBc0IsU0FBUztBQUNqQyxl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
