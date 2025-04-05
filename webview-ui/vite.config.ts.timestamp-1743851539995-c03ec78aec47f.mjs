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
  }
};
var integration_default = integrationService;

// src/mock/services/index.ts
var services = {
  dataSource: datasource_default,
  query: query_default,
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
  if (urlPath === "/api/queries/favorites" && method === "GET") {
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: /api/queries/favorites`);
    console.log("[Mock] \u5904\u7406\u6536\u85CF\u67E5\u8BE2\u5217\u8868\u8BF7\u6C42, \u53C2\u6570:", urlQuery);
    try {
      const result = await queryService2.getFavoriteQueries({
        page: parseInt(urlQuery.page) || 1,
        size: parseInt(urlQuery.size) || 10,
        name: urlQuery.name || urlQuery.search,
        dataSourceId: urlQuery.dataSourceId,
        status: urlQuery.status
      });
      console.log("[Mock] \u6536\u85CF\u67E5\u8BE2\u5217\u8868\u7ED3\u679C:", {
        itemsCount: result.items.length,
        pagination: result.pagination
      });
      sendJsonResponse(res, 200, {
        data: result.items,
        pagination: result.pagination,
        success: true
      });
    } catch (error) {
      console.error("[Mock] \u83B7\u53D6\u6536\u85CF\u67E5\u8BE2\u5217\u8868\u5931\u8D25:", error);
      sendJsonResponse(res, 500, {
        error: "\u83B7\u53D6\u6536\u85CF\u67E5\u8BE2\u5217\u8868\u5931\u8D25",
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
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/execute$/) && method === "POST") {
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
async function handleIntegrationApi(req, res, urlPath, urlQuery) {
  var _a;
  const method = (_a = req.method) == null ? void 0 : _a.toUpperCase();
  const isIntegrationPath = urlPath.includes("/low-code/apis");
  if (isIntegrationPath) {
    console.log(`[Mock] \u68C0\u6D4B\u5230\u96C6\u6210API\u8BF7\u6C42: ${method} ${urlPath}`, urlQuery);
  }
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
      sendJsonResponse(res, 200, {
        data: result.items,
        pagination: result.pagination,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 500, {
        error: "\u83B7\u53D6\u96C6\u6210\u5217\u8868\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/low-code\/apis\/[^\/]+$/) && method === "GET") {
    const id = urlPath.split("/").pop() || "";
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      const integration = await integration_default.getIntegration(id);
      sendJsonResponse(res, 200, {
        data: integration,
        success: true
      });
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
      sendJsonResponse(res, 201, {
        data: newIntegration,
        message: "\u96C6\u6210\u521B\u5EFA\u6210\u529F",
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: "\u521B\u5EFA\u96C6\u6210\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/low-code\/apis\/[^\/]+$/) && method === "PUT") {
    const id = urlPath.split("/").pop() || "";
    logMock("debug", `\u5904\u7406PUT\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    try {
      const body = await parseRequestBody(req);
      const updatedIntegration = await integration_default.updateIntegration(id, body);
      sendJsonResponse(res, 200, {
        data: updatedIntegration,
        message: "\u96C6\u6210\u66F4\u65B0\u6210\u529F",
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u66F4\u65B0\u96C6\u6210\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/low-code\/apis\/[^\/]+$/) && method === "DELETE") {
    const id = urlPath.split("/").pop() || "";
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
  if (urlPath.match(/^\/api\/low-code\/apis\/[^\/]+\/test$/) && method === "POST") {
    const segments = urlPath.split("/");
    const idIndex = segments.findIndex((s) => s === "apis") + 1;
    const id = idIndex < segments.length ? segments[idIndex] : "";
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, \u96C6\u6210ID: ${id}`);
    try {
      const body = await parseRequestBody(req);
      const result = await integration_default.testIntegration(id, body);
      sendJsonResponse(res, 200, {
        data: result,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: "\u6D4B\u8BD5\u96C6\u6210\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/low-code\/apis\/[^\/]+\/query$/) && method === "POST") {
    const segments = urlPath.split("/");
    const idIndex = segments.findIndex((s) => s === "apis") + 1;
    const id = idIndex < segments.length ? segments[idIndex] : "";
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, \u96C6\u6210ID: ${id}`);
    try {
      const body = await parseRequestBody(req);
      const result = await integration_default.executeQuery(id, body);
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
      if (!handled)
        handled = await handleIntegrationApi(req, res, urlPath, urlQuery);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50cyIsICJzcmMvbW9jay9jb25maWcudHMiLCAic3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHMiLCAic3JjL21vY2svc2VydmljZXMvdXRpbHMudHMiLCAic3JjL21vY2svc2VydmljZXMvcXVlcnkudHMiLCAic3JjL21vY2svZGF0YS9pbnRlZ3JhdGlvbi50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9pbnRlZ3JhdGlvbi50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50cyIsICJzcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiwgUGx1Z2luLCBDb25uZWN0IH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcydcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJ1xuaW1wb3J0IGNyZWF0ZU1vY2tNaWRkbGV3YXJlIGZyb20gJy4vc3JjL21vY2svbWlkZGxld2FyZSdcbmltcG9ydCB7IGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUgfSBmcm9tICcuL3NyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHsgU2VydmVyUmVzcG9uc2UgfSBmcm9tICdodHRwJ1xuXG4vLyBcdTVGM0FcdTUyMzZcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTNcdTUxRkRcdTY1NzBcbmZ1bmN0aW9uIGtpbGxQb3J0KHBvcnQ6IG51bWJlcikge1xuICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjhDMFx1NjdFNVx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NTM2MFx1NzUyOFx1NjBDNVx1NTFCNWApO1xuICB0cnkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBleGVjU3luYyhgbmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fWApO1xuICAgICAgZXhlY1N5bmMoYHRhc2traWxsIC9GIC9waWQgJChuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9IHwgYXdrICd7cHJpbnQgJDV9JylgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4ZWNTeW5jKGBsc29mIC1pIDoke3BvcnR9IC10IHwgeGFyZ3Mga2lsbCAtOWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTMgJHtwb3J0fWApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTY3MkFcdTg4QUJcdTUzNjBcdTc1MjhcdTYyMTZcdTY1RTBcdTZDRDVcdTkxQ0FcdTY1M0VgKTtcbiAgfVxufVxuXG4vLyBcdTVGM0FcdTUyMzZcdTZFMDVcdTc0MDZWaXRlXHU3RjEzXHU1QjU4XG5mdW5jdGlvbiBjbGVhblZpdGVDYWNoZSgpIHtcbiAgY29uc29sZS5sb2coJ1tWaXRlXSBcdTZFMDVcdTc0MDZcdTRGOURcdThENTZcdTdGMTNcdTVCNTgnKTtcbiAgY29uc3QgY2FjaGVQYXRocyA9IFtcbiAgICAnLi9ub2RlX21vZHVsZXMvLnZpdGUnLFxuICAgICcuL25vZGVfbW9kdWxlcy8udml0ZV8qJyxcbiAgICAnLi8udml0ZScsXG4gICAgJy4vZGlzdCcsXG4gICAgJy4vdG1wJyxcbiAgICAnLi8udGVtcCdcbiAgXTtcbiAgXG4gIGNhY2hlUGF0aHMuZm9yRWFjaChjYWNoZVBhdGggPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhjYWNoZVBhdGgpKSB7XG4gICAgICAgIGlmIChmcy5sc3RhdFN5bmMoY2FjaGVQYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgZXhlY1N5bmMoYHJtIC1yZiAke2NhY2hlUGF0aH1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy51bmxpbmtTeW5jKGNhY2hlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTUyMjBcdTk2NjQ6ICR7Y2FjaGVQYXRofWApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2NUUwXHU2Q0Q1XHU1MjIwXHU5NjY0OiAke2NhY2hlUGF0aH1gLCBlKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBcdTZFMDVcdTc0MDZWaXRlXHU3RjEzXHU1QjU4XG5jbGVhblZpdGVDYWNoZSgpO1xuXG4vLyBcdTVDMURcdThCRDVcdTkxQ0FcdTY1M0VcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTdBRUZcdTUzRTNcbmtpbGxQb3J0KDgwODApO1xuXG4vLyBcdTUyMUJcdTVFRkFNb2NrIEFQSVx1NjNEMlx1NEVGNlxuZnVuY3Rpb24gY3JlYXRlTW9ja0FwaVBsdWdpbih1c2VNb2NrOiBib29sZWFuLCB1c2VTaW1wbGVNb2NrOiBib29sZWFuKTogUGx1Z2luIHwgbnVsbCB7XG4gIGlmICghdXNlTW9jayAmJiAhdXNlU2ltcGxlTW9jaykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIFxuICAvLyBcdTUyQTBcdThGN0RcdTRFMkRcdTk1RjRcdTRFRjZcbiAgY29uc3QgbW9ja01pZGRsZXdhcmUgPSB1c2VNb2NrID8gY3JlYXRlTW9ja01pZGRsZXdhcmUoKSA6IG51bGw7XG4gIGNvbnN0IHNpbXBsZU1pZGRsZXdhcmUgPSB1c2VTaW1wbGVNb2NrID8gY3JlYXRlU2ltcGxlTWlkZGxld2FyZSgpIDogbnVsbDtcbiAgXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZpdGUtcGx1Z2luLW1vY2stYXBpJyxcbiAgICAvLyBcdTUxNzNcdTk1MkVcdTcwQjlcdUZGMUFcdTRGN0ZcdTc1MjggcHJlIFx1Nzg2RVx1NEZERFx1NkI2NFx1NjNEMlx1NEVGNlx1NTE0OFx1NEU4RVx1NTE4NVx1N0Y2RVx1NjNEMlx1NEVGNlx1NjI2N1x1ODg0Q1xuICAgIGVuZm9yY2U6ICdwcmUnIGFzIGNvbnN0LFxuICAgIC8vIFx1NTcyOFx1NjcwRFx1NTJBMVx1NTY2OFx1NTIxQlx1NUVGQVx1NEU0Qlx1NTI0RFx1OTE0RFx1N0Y2RVxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIC8vIFx1NjZGRlx1NjM2Mlx1NTM5Rlx1NTlDQlx1OEJGN1x1NkM0Mlx1NTkwNFx1NzQwNlx1NTY2OFx1RkYwQ1x1NEY3Rlx1NjIxMVx1NEVFQ1x1NzY4NFx1NEUyRFx1OTVGNFx1NEVGNlx1NTE3N1x1NjcwOVx1NjcwMFx1OUFEOFx1NEYxOFx1NTE0OFx1N0VBN1xuICAgICAgY29uc3Qgb3JpZ2luYWxIYW5kbGVyID0gc2VydmVyLm1pZGRsZXdhcmVzLmhhbmRsZTtcbiAgICAgIFxuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLmhhbmRsZSA9IGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTUzRUFcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTY4QzBcdTZENEJcdTUyMzBBUElcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHt1cmx9YCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU0RjE4XHU1MTQ4XHU1OTA0XHU3NDA2XHU3Mjc5XHU1QjlBXHU2RDRCXHU4QkQ1QVBJXG4gICAgICAgICAgaWYgKHVzZVNpbXBsZU1vY2sgJiYgc2ltcGxlTWlkZGxld2FyZSAmJiB1cmwuc3RhcnRzV2l0aCgnL2FwaS90ZXN0JykpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU0RjdGXHU3NTI4XHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2OiAke3VybH1gKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU4QkJFXHU3RjZFXHU0RTAwXHU0RTJBXHU2ODA3XHU4QkIwXHVGRjBDXHU5NjMyXHU2QjYyXHU1MTc2XHU0RUQ2XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyXG4gICAgICAgICAgICAocmVxIGFzIGFueSkuX21vY2tIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHNpbXBsZU1pZGRsZXdhcmUocmVxLCByZXMsIChlcnI/OiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW01vY2tcdTYzRDJcdTRFRjZdIFx1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NTFGQVx1OTUxOTpgLCBlcnIpO1xuICAgICAgICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghKHJlcyBhcyBTZXJ2ZXJSZXNwb25zZSkud3JpdGFibGVFbmRlZCkge1xuICAgICAgICAgICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NTRDRFx1NUU5NFx1NkNBMVx1NjcwOVx1N0VEM1x1Njc1Rlx1RkYwQ1x1N0VFN1x1N0VFRFx1NTkwNFx1NzQwNlxuICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1NTkwNFx1NzQwNlx1NTE3Nlx1NEVENkFQSVx1OEJGN1x1NkM0MlxuICAgICAgICAgIGlmICh1c2VNb2NrICYmIG1vY2tNaWRkbGV3YXJlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTYzRDJcdTRFRjZdIFx1NEY3Rlx1NzUyOE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDY6ICR7dXJsfWApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdThCQkVcdTdGNkVcdTRFMDBcdTRFMkFcdTY4MDdcdThCQjBcdUZGMENcdTk2MzJcdTZCNjJcdTUxNzZcdTRFRDZcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTZCNjRcdThCRjdcdTZDNDJcbiAgICAgICAgICAgIChyZXEgYXMgYW55KS5fbW9ja0hhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gbW9ja01pZGRsZXdhcmUocmVxLCByZXMsIChlcnI/OiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW01vY2tcdTYzRDJcdTRFRjZdIE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTUxRkFcdTk1MTk6YCwgZXJyKTtcbiAgICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIShyZXMgYXMgU2VydmVyUmVzcG9uc2UpLndyaXRhYmxlRW5kZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTU0Q0RcdTVFOTRcdTZDQTFcdTY3MDlcdTdFRDNcdTY3NUZcdUZGMENcdTdFRTdcdTdFRURcdTU5MDRcdTc0MDZcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gXHU1QkY5XHU0RThFXHU5NzVFQVBJXHU4QkY3XHU2QzQyXHVGRjBDXHU0RjdGXHU3NTI4XHU1MzlGXHU1OUNCXHU1OTA0XHU3NDA2XHU1NjY4XG4gICAgICAgIHJldHVybiBvcmlnaW5hbEhhbmRsZXIuY2FsbChzZXJ2ZXIubWlkZGxld2FyZXMsIHJlcSwgcmVzLCBuZXh0KTtcbiAgICAgIH07XG4gICAgfVxuICB9O1xufVxuXG4vLyBcdTU3RkFcdTY3MkNcdTkxNERcdTdGNkVcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHU1MkEwXHU4RjdEXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG4gIHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID0gcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgfHwgJ2ZhbHNlJztcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrIEFQSSAtIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1OEJGQlx1NTNENlxuICBjb25zdCB1c2VNb2NrQXBpID0gcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJztcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1Nzk4MVx1NzUyOEhNUiAtIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1OEJGQlx1NTNENlxuICBjb25zdCBkaXNhYmxlSG1yID0gcHJvY2Vzcy5lbnYuVklURV9ESVNBQkxFX0hNUiA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU0RjdGXHU3NTI4XHU3QjgwXHU1MzU1XHU2RDRCXHU4QkQ1XHU2QTIxXHU2MkRGQVBJXG4gIGNvbnN0IHVzZVNpbXBsZU1vY2sgPSB0cnVlO1xuICBcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdThGRDBcdTg4NENcdTZBMjFcdTVGMEY6ICR7bW9kZX1gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBNb2NrIEFQSTogJHt1c2VNb2NrQXBpID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdTdCODBcdTUzNTVNb2NrXHU2RDRCXHU4QkQ1OiAke3VzZVNpbXBsZU1vY2sgPyAnXHU1NDJGXHU3NTI4JyA6ICdcdTc5ODFcdTc1MjgnfWApO1xuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIEhNUjogJHtkaXNhYmxlSG1yID8gJ1x1Nzk4MVx1NzUyOCcgOiAnXHU1NDJGXHU3NTI4J31gKTtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQU1vY2tcdTYzRDJcdTRFRjZcbiAgY29uc3QgbW9ja1BsdWdpbiA9IGNyZWF0ZU1vY2tBcGlQbHVnaW4odXNlTW9ja0FwaSwgdXNlU2ltcGxlTW9jayk7XG4gIFxuICAvLyBcdTkxNERcdTdGNkVcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAvLyBcdTZERkJcdTUyQTBNb2NrXHU2M0QyXHU0RUY2XHVGRjA4XHU1OTgyXHU2NzlDXHU1NDJGXHU3NTI4XHVGRjA5XG4gICAgICAuLi4obW9ja1BsdWdpbiA/IFttb2NrUGx1Z2luXSA6IFtdKSxcbiAgICAgIHZ1ZSgpLFxuICAgIF0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICAvLyBITVJcdTkxNERcdTdGNkVcbiAgICAgIGhtcjogZGlzYWJsZUhtciA/IGZhbHNlIDoge1xuICAgICAgICBwcm90b2NvbDogJ3dzJyxcbiAgICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICAgIHBvcnQ6IDgwODAsXG4gICAgICAgIGNsaWVudFBvcnQ6IDgwODAsXG4gICAgICB9LFxuICAgICAgLy8gXHU3OTgxXHU3NTI4XHU0RUUzXHU3NDA2XHVGRjBDXHU4QkE5XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU2MjQwXHU2NzA5XHU4QkY3XHU2QzQyXG4gICAgICBwcm94eToge31cbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MsIGF1dG9wcmVmaXhlcl0sXG4gICAgICB9LFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIC8vIFx1NTMwNVx1NTQyQlx1NTdGQVx1NjcyQ1x1NEY5RFx1OEQ1NlxuICAgICAgaW5jbHVkZTogW1xuICAgICAgICAndnVlJywgXG4gICAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICAgJ3BpbmlhJyxcbiAgICAgICAgJ2F4aW9zJyxcbiAgICAgICAgJ2RheWpzJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlL2VzL2xvY2FsZS96aF9DTidcbiAgICAgIF0sXG4gICAgICAvLyBcdTYzOTJcdTk2NjRcdTcyNzlcdTVCOUFcdTRGOURcdThENTZcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgLy8gXHU2MzkyXHU5NjY0XHU2M0QyXHU0RUY2XHU0RTJEXHU3Njg0XHU2NzBEXHU1MkExXHU1NjY4TW9ja1xuICAgICAgICAnc3JjL3BsdWdpbnMvc2VydmVyTW9jay50cycsXG4gICAgICAgIC8vIFx1NjM5Mlx1OTY2NGZzZXZlbnRzXHU2NzJDXHU1NzMwXHU2QTIxXHU1NzU3XHVGRjBDXHU5MDdGXHU1MTREXHU2Nzg0XHU1RUZBXHU5NTE5XHU4QkVGXG4gICAgICAgICdmc2V2ZW50cydcbiAgICAgIF0sXG4gICAgICAvLyBcdTc4NkVcdTRGRERcdTRGOURcdThENTZcdTk4ODRcdTY3ODRcdTVFRkFcdTZCNjNcdTc4NkVcdTVCOENcdTYyMTBcbiAgICAgIGZvcmNlOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gXHU0RjdGXHU3NTI4XHU1MzU1XHU3MkVDXHU3Njg0XHU3RjEzXHU1QjU4XHU3NkVFXHU1RjU1XG4gICAgY2FjaGVEaXI6ICdub2RlX21vZHVsZXMvLnZpdGVfY2FjaGUnLFxuICAgIC8vIFx1OTYzMlx1NkI2Mlx1NTgwNlx1NjgwOFx1NkVBMlx1NTFGQVxuICAgIGVzYnVpbGQ6IHtcbiAgICAgIGxvZ092ZXJyaWRlOiB7XG4gICAgICAgICd0aGlzLWlzLXVuZGVmaW5lZC1pbi1lc20nOiAnc2lsZW50J1xuICAgICAgfSxcbiAgICB9XG4gIH1cbn0pOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzXCI7LyoqXG4gKiBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU3QkExXHU3NDA2XHU2QTIxXHU1NzU3XG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1N0VERlx1NEUwMFx1NzY4NEhUVFBcdThCRjdcdTZDNDJcdTYyRTZcdTYyMkFcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTc1MjhcdTRFOEVcdTZBMjFcdTYyREZBUElcdTU0Q0RcdTVFOTRcbiAqIFx1OEQxRlx1OEQyM1x1N0JBMVx1NzQwNlx1NTQ4Q1x1NTIwNlx1NTNEMVx1NjI0MFx1NjcwOUFQSVx1OEJGN1x1NkM0Mlx1NTIzMFx1NUJGOVx1NUU5NFx1NzY4NFx1NjcwRFx1NTJBMVx1NTkwNFx1NzQwNlx1NTFGRFx1NjU3MFxuICovXG5cbmltcG9ydCB0eXBlIHsgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgSW5jb21pbmdNZXNzYWdlLCBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gJ2h0dHAnO1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICd1cmwnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZywgc2hvdWxkTW9ja1JlcXVlc3QsIGxvZ01vY2sgfSBmcm9tICcuLi9jb25maWcnO1xuXG4vLyBcdTVCRkNcdTUxNjVcdTY3MERcdTUyQTFcbmltcG9ydCB7IGRhdGFTb3VyY2VTZXJ2aWNlLCBxdWVyeVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcyc7XG5pbXBvcnQgaW50ZWdyYXRpb25TZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL2ludGVncmF0aW9uJztcblxuLy8gXHU1OTA0XHU3NDA2Q09SU1x1OEJGN1x1NkM0MlxuZnVuY3Rpb24gaGFuZGxlQ29ycyhyZXM6IFNlcnZlclJlc3BvbnNlKSB7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbiwgWC1Nb2NrLUVuYWJsZWQnKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtTWF4LUFnZScsICc4NjQwMCcpO1xufVxuXG4vLyBcdTUzRDFcdTkwMDFKU09OXHU1NENEXHU1RTk0XG5mdW5jdGlvbiBzZW5kSnNvblJlc3BvbnNlKHJlczogU2VydmVyUmVzcG9uc2UsIHN0YXR1czogbnVtYmVyLCBkYXRhOiBhbnkpIHtcbiAgcmVzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG4vLyBcdTVFRjZcdThGREZcdTYyNjdcdTg4NENcbmZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vLyBcdTg5RTNcdTY3OTBcdThCRjdcdTZDNDJcdTRGNTNcbmFzeW5jIGZ1bmN0aW9uIHBhcnNlUmVxdWVzdEJvZHkocmVxOiBJbmNvbWluZ01lc3NhZ2UpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsZXQgYm9keSA9ICcnO1xuICAgIHJlcS5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgICAgYm9keSArPSBjaHVuay50b1N0cmluZygpO1xuICAgIH0pO1xuICAgIHJlcS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZShib2R5ID8gSlNPTi5wYXJzZShib2R5KSA6IHt9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVzb2x2ZSh7fSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY1NzBcdTYzNkVcdTZFOTBBUElcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZURhdGFzb3VyY2VzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcsIHVybFF1ZXJ5OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6IC9hcGkvZGF0YXNvdXJjZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU2NzBEXHU1MkExXHU1QzQyXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XHVGRjBDXHU2NTJGXHU2MzAxXHU1MjA2XHU5ODc1XHU1NDhDXHU4RkM3XHU2RUU0XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5nZXREYXRhU291cmNlcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nLFxuICAgICAgICB0eXBlOiB1cmxRdWVyeS50eXBlIGFzIHN0cmluZyxcbiAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcmVzdWx0Lml0ZW1zLCBcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhc291cmNlID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuZ2V0RGF0YVNvdXJjZShpZCk7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiBkYXRhc291cmNlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlIFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzJyAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6IC9hcGkvZGF0YXNvdXJjZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IG5ld0RhdGFTb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5jcmVhdGVEYXRhU291cmNlKGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7XG4gICAgICAgIGRhdGE6IG5ld0RhdGFTb3VyY2UsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMUJcdTVFRkFcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQVVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgdXBkYXRlZERhdGFTb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS51cGRhdGVEYXRhU291cmNlKGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB1cGRhdGVkRGF0YVNvdXJjZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkRFTEVURVx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmRlbGV0ZURhdGFTb3VyY2UoaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIG1lc3NhZ2U6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMjBcdTk2NjRcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2RDRCXHU4QkQ1XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkRFXHU2M0E1XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcy90ZXN0LWNvbm5lY3Rpb24nICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlcy90ZXN0LWNvbm5lY3Rpb25gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLnRlc3RDb25uZWN0aW9uKGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTZENEJcdThCRDVcdThGREVcdTYzQTVcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gXHU1OTA0XHU3NDA2XHU2N0U1XHU4QkUyQVBJXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVRdWVyaWVzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcsIHVybFF1ZXJ5OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIC8vIFx1NjhDMFx1NjdFNVVSTFx1NjYyRlx1NTQyNlx1NTMzOVx1OTE0RFx1NjdFNVx1OEJFMkFQSVxuICBjb25zdCBpc1F1ZXJpZXNQYXRoID0gdXJsUGF0aC5pbmNsdWRlcygnL3F1ZXJpZXMnKTtcbiAgXG4gIC8vIFx1NjI1M1x1NTM3MFx1NjI0MFx1NjcwOVx1NjdFNVx1OEJFMlx1NzZGOFx1NTE3M1x1OEJGN1x1NkM0Mlx1NEVFNVx1NEZCRlx1OEMwM1x1OEJENVxuICBpZiAoaXNRdWVyaWVzUGF0aCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU2OEMwXHU2RDRCXHU1MjMwXHU2N0U1XHU4QkUyQVBJXHU4QkY3XHU2QzQyOiAke21ldGhvZH0gJHt1cmxQYXRofWAsIHVybFF1ZXJ5KTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9xdWVyaWVzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXNgKTtcbiAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NTkwNFx1NzQwNlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1OEJGN1x1NkM0MiwgXHU1M0MyXHU2NTcwOicsIHVybFF1ZXJ5KTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU2NzBEXHU1MkExXHU1QzQyXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHVGRjBDXHU2NTJGXHU2MzAxXHU1MjA2XHU5ODc1XHU1NDhDXHU4RkM3XHU2RUU0XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcmllcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nLFxuICAgICAgICBkYXRhU291cmNlSWQ6IHVybFF1ZXJ5LmRhdGFTb3VyY2VJZCBhcyBzdHJpbmcsXG4gICAgICAgIHN0YXR1czogdXJsUXVlcnkuc3RhdHVzIGFzIHN0cmluZyxcbiAgICAgICAgcXVlcnlUeXBlOiB1cmxRdWVyeS5xdWVyeVR5cGUgYXMgc3RyaW5nLFxuICAgICAgICBpc0Zhdm9yaXRlOiB1cmxRdWVyeS5pc0Zhdm9yaXRlID09PSAndHJ1ZSdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1N0VEM1x1Njc5QzonLCB7XG4gICAgICAgIGl0ZW1zQ291bnQ6IHJlc3VsdC5pdGVtcy5sZW5ndGgsXG4gICAgICAgIHBhZ2luYXRpb246IHJlc3VsdC5wYWdpbmF0aW9uXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcmVzdWx0Lml0ZW1zLCBcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTW9ja10gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1OicsIGVycm9yKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY1MzZcdTg1Q0ZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMvZmF2b3JpdGVzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXMvZmF2b3JpdGVzYCk7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTU5MDRcdTc0MDZcdTY1MzZcdTg1Q0ZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdThCRjdcdTZDNDIsIFx1NTNDMlx1NjU3MDonLCB1cmxRdWVyeSk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NjcwRFx1NTJBMVx1NUM0Mlx1ODNCN1x1NTNENlx1NjUzNlx1ODVDRlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldEZhdm9yaXRlUXVlcmllcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nIHx8IHVybFF1ZXJ5LnNlYXJjaCBhcyBzdHJpbmcsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogdXJsUXVlcnkuZGF0YVNvdXJjZUlkIGFzIHN0cmluZyxcbiAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY1MzZcdTg1Q0ZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTdFRDNcdTY3OUM6Jywge1xuICAgICAgICBpdGVtc0NvdW50OiByZXN1bHQuaXRlbXMubGVuZ3RoLFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvblxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IHJlc3VsdC5pdGVtcywgXG4gICAgICAgIHBhZ2luYXRpb246IHJlc3VsdC5wYWdpbmF0aW9uLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignW01vY2tdIFx1ODNCN1x1NTNENlx1NjUzNlx1ODVDRlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNTonLCBlcnJvcik7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjUzNlx1ODVDRlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJ5KGlkKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IHF1ZXJ5LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY3RTVcdThCRTJcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlIFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9xdWVyaWVzYCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCBuZXdRdWVyeSA9IGF3YWl0IHF1ZXJ5U2VydmljZS5jcmVhdGVRdWVyeShib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMSwge1xuICAgICAgICBkYXRhOiBuZXdRdWVyeSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UFVUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHVwZGF0ZWRRdWVyeSA9IGF3YWl0IHF1ZXJ5U2VydmljZS51cGRhdGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogdXBkYXRlZFF1ZXJ5LFxuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0RFTEVURScpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZERUxFVEVcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBxdWVyeVNlcnZpY2UuZGVsZXRlUXVlcnkoaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTUyMjBcdTk2NjRcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC9ydW4kLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKVszXSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5leGVjdXRlUXVlcnkoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlx1RkYwOFx1NTE3Q1x1NUJCOWV4ZWN1dGVcdThERUZcdTVGODRcdUZGMDlcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL2V4ZWN1dGUkLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKVszXSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5leGVjdXRlUXVlcnkoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIwN1x1NjM2Mlx1NjdFNVx1OEJFMlx1NjUzNlx1ODVDRlx1NzJCNlx1NjAwMVxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvZmF2b3JpdGUkLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKVszXSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS50b2dnbGVGYXZvcml0ZShpZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NjZGNFx1NjVCMFx1NjUzNlx1ODVDRlx1NzJCNlx1NjAwMVx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC92ZXJzaW9ucyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJylbM10gfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgdmVyc2lvbnMgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcnlWZXJzaW9ucyhpZCk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogdmVyc2lvbnMsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNzlcdTVCOUFcdTcyNDhcdTY3MkNcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL3ZlcnNpb25zXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgY29uc3QgcGFydHMgPSB1cmxQYXRoLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgcXVlcnlJZCA9IHBhcnRzWzNdIHx8ICcnO1xuICAgIGNvbnN0IHZlcnNpb25JZCA9IHBhcnRzWzVdIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgXHU2N0U1XHU4QkUySUQ6ICR7cXVlcnlJZH0sIFx1NzI0OFx1NjcyQ0lEOiAke3ZlcnNpb25JZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgdmVyc2lvbnMgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcnlWZXJzaW9ucyhxdWVyeUlkKTtcbiAgICAgIGNvbnN0IHZlcnNpb24gPSB2ZXJzaW9ucy5maW5kKCh2OiBhbnkpID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgICBcbiAgICAgIGlmICghdmVyc2lvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHt2ZXJzaW9uSWR9XHU3Njg0XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDYCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogdmVyc2lvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gXHU1OTA0XHU3NDA2XHU5NkM2XHU2MjEwQVBJXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVJbnRlZ3JhdGlvbkFwaShyZXE6IEluY29taW5nTWVzc2FnZSwgcmVzOiBTZXJ2ZXJSZXNwb25zZSwgdXJsUGF0aDogc3RyaW5nLCB1cmxRdWVyeTogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2Q/LnRvVXBwZXJDYXNlKCk7XG4gIFxuICAvLyBcdTY4QzBcdTY3RTVVUkxcdTY2MkZcdTU0MjZcdTUzMzlcdTkxNERcdTk2QzZcdTYyMTBBUElcbiAgY29uc3QgaXNJbnRlZ3JhdGlvblBhdGggPSB1cmxQYXRoLmluY2x1ZGVzKCcvbG93LWNvZGUvYXBpcycpO1xuICBcbiAgLy8gXHU2MjUzXHU1MzcwXHU2MjQwXHU2NzA5XHU5NkM2XHU2MjEwXHU3NkY4XHU1MTczXHU4QkY3XHU2QzQyXHU0RUU1XHU0RkJGXHU4QzAzXHU4QkQ1XG4gIGlmIChpc0ludGVncmF0aW9uUGF0aCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU2OEMwXHU2RDRCXHU1MjMwXHU5NkM2XHU2MjEwQVBJXHU4QkY3XHU2QzQyOiAke21ldGhvZH0gJHt1cmxQYXRofWAsIHVybFF1ZXJ5KTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU5NkM2XHU2MjEwXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9sb3ctY29kZS9hcGlzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL2xvdy1jb2RlL2FwaXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmdldEludGVncmF0aW9ucyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nLFxuICAgICAgICB0eXBlOiB1cmxRdWVyeS50eXBlIGFzIHN0cmluZyxcbiAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcmVzdWx0Lml0ZW1zLCBcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1OTZDNlx1NjIxMFx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU5NkM2XHU2MjEwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvbG93LWNvZGVcXC9hcGlzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgaW50ZWdyYXRpb24gPSBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuZ2V0SW50ZWdyYXRpb24oaWQpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogaW50ZWdyYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1OTZDNlx1NjIxMFx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2UgXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1OTZDNlx1NjIxMFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvbG93LWNvZGUvYXBpcycgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL2xvdy1jb2RlL2FwaXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IG5ld0ludGVncmF0aW9uID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmNyZWF0ZUludGVncmF0aW9uKGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7XG4gICAgICAgIGRhdGE6IG5ld0ludGVncmF0aW9uLFxuICAgICAgICBtZXNzYWdlOiAnXHU5NkM2XHU2MjEwXHU1MjFCXHU1RUZBXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTUyMUJcdTVFRkFcdTk2QzZcdTYyMTBcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjZGNFx1NjVCMFx1OTZDNlx1NjIxMFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2xvdy1jb2RlXFwvYXBpc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBVVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCB1cGRhdGVkSW50ZWdyYXRpb24gPSBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UudXBkYXRlSW50ZWdyYXRpb24oaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHVwZGF0ZWRJbnRlZ3JhdGlvbixcbiAgICAgICAgbWVzc2FnZTogJ1x1OTZDNlx1NjIxMFx1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2NkY0XHU2NUIwXHU5NkM2XHU2MjEwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTk2QzZcdTYyMTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9sb3ctY29kZVxcL2FwaXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0RFTEVURScpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZERUxFVEVcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuZGVsZXRlSW50ZWdyYXRpb24oaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIG1lc3NhZ2U6ICdcdTk2QzZcdTYyMTBcdTUyMjBcdTk2NjRcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIyMFx1OTY2NFx1OTZDNlx1NjIxMFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2RDRCXHU4QkQ1XHU5NkM2XHU2MjEwIC0gXHU0RkVFXHU2QjYzVVJMXHU1MzM5XHU5MTREXHU2QTIxXHU1RjBGXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvbG93LWNvZGVcXC9hcGlzXFwvW15cXC9dK1xcL3Rlc3QkLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAvLyBcdTRFQ0VVUkxcdTRFMkRcdTYzRDBcdTUzRDZcdTk2QzZcdTYyMTBJRCAtIFx1NEZFRVx1NkI2M0lEXHU2M0QwXHU1M0Q2XHU2NUI5XHU1RjBGXG4gICAgY29uc3Qgc2VnbWVudHMgPSB1cmxQYXRoLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgaWRJbmRleCA9IHNlZ21lbnRzLmZpbmRJbmRleChzID0+IHMgPT09ICdhcGlzJykgKyAxO1xuICAgIGNvbnN0IGlkID0gaWRJbmRleCA8IHNlZ21lbnRzLmxlbmd0aCA/IHNlZ21lbnRzW2lkSW5kZXhdIDogJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgXHU5NkM2XHU2MjEwSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UudGVzdEludGVncmF0aW9uKGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU2RDRCXHU4QkQ1XHU5NkM2XHU2MjEwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTYyNjdcdTg4NENcdTk2QzZcdTYyMTBcdTY3RTVcdThCRTIgLSBcdTRGRUVcdTZCNjNVUkxcdTUzMzlcdTkxNERcdTZBMjFcdTVGMEZcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9sb3ctY29kZVxcL2FwaXNcXC9bXlxcL10rXFwvcXVlcnkkLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAvLyBcdTRFQ0VVUkxcdTRFMkRcdTYzRDBcdTUzRDZcdTk2QzZcdTYyMTBJRCAtIFx1NEZFRVx1NkI2M0lEXHU2M0QwXHU1M0Q2XHU2NUI5XHU1RjBGXG4gICAgY29uc3Qgc2VnbWVudHMgPSB1cmxQYXRoLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgaWRJbmRleCA9IHNlZ21lbnRzLmZpbmRJbmRleChzID0+IHMgPT09ICdhcGlzJykgKyAxO1xuICAgIGNvbnN0IGlkID0gaWRJbmRleCA8IHNlZ21lbnRzLmxlbmd0aCA/IHNlZ21lbnRzW2lkSW5kZXhdIDogJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgXHU5NkM2XHU2MjEwSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFx1NTIxQlx1NUVGQVx1NEUyRFx1OTVGNFx1NEVGNlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlTW9ja01pZGRsZXdhcmUoKTogQ29ubmVjdC5OZXh0SGFuZGxlRnVuY3Rpb24ge1xuICAvLyBcdTU5ODJcdTY3OUNNb2NrXHU2NzBEXHU1MkExXHU4OEFCXHU3OTgxXHU3NTI4XHVGRjBDXHU4RkQ0XHU1NkRFXHU3QTdBXHU0RTJEXHU5NUY0XHU0RUY2XG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY3MERcdTUyQTFcdTVERjJcdTc5ODFcdTc1MjhcdUZGMENcdThGRDRcdTU2REVcdTdBN0FcdTRFMkRcdTk1RjRcdTRFRjYnKTtcbiAgICByZXR1cm4gKHJlcSwgcmVzLCBuZXh0KSA9PiBuZXh0KCk7XG4gIH1cbiAgXG4gIGNvbnNvbGUubG9nKCdbTW9ja10gXHU1MjFCXHU1RUZBXHU0RTJEXHU5NUY0XHU0RUY2LCBcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDInKTtcbiAgXG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBtb2NrTWlkZGxld2FyZShcbiAgICByZXE6IENvbm5lY3QuSW5jb21pbmdNZXNzYWdlLFxuICAgIHJlczogU2VydmVyUmVzcG9uc2UsXG4gICAgbmV4dDogQ29ubmVjdC5OZXh0RnVuY3Rpb25cbiAgKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1ODlFM1x1Njc5MFVSTFxuICAgICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICAgIFxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1RTk0XHU4QkU1XHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyXG4gICAgICBpZiAoIXVybC5pbmNsdWRlcygnL2FwaS8nKSkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTU4OUVcdTVGM0FcdTU5MDRcdTc0MDZcdTkxQ0RcdTU5MERcdTc2ODRBUElcdThERUZcdTVGODRcbiAgICAgIGxldCBwcm9jZXNzZWRVcmwgPSB1cmw7XG4gICAgICBpZiAodXJsLmluY2x1ZGVzKCcvYXBpL2FwaS8nKSkge1xuICAgICAgICBwcm9jZXNzZWRVcmwgPSB1cmwucmVwbGFjZSgvXFwvYXBpXFwvYXBpXFwvL2csICcvYXBpLycpO1xuICAgICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTY4QzBcdTZENEJcdTUyMzBcdTkxQ0RcdTU5MERcdTc2ODRBUElcdThERUZcdTVGODRcdUZGMENcdTVERjJcdTRGRUVcdTZCNjM6ICR7dXJsfSAtPiAke3Byb2Nlc3NlZFVybH1gKTtcbiAgICAgICAgLy8gXHU0RkVFXHU2NTM5XHU1MzlGXHU1OUNCXHU4QkY3XHU2QzQyXHU3Njg0VVJMXHVGRjBDXHU3ODZFXHU0RkREXHU1NDBFXHU3RUVEXHU1OTA0XHU3NDA2XHU4MEZEXHU2QjYzXHU3ODZFXHU4QkM2XHU1MjJCXG4gICAgICAgIHJlcS51cmwgPSBwcm9jZXNzZWRVcmw7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NkQ0Qlx1OEJENVx1RkYxQVx1NjI1M1x1NTM3MFx1NjI0MFx1NjcwOUFQSVx1OEJGN1x1NkM0Mlx1NEVFNVx1NEZCRlx1OEMwM1x1OEJENVxuICAgICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHtwcm9jZXNzZWRVcmx9YCk7XG4gICAgICBcbiAgICAgIGNvbnN0IHBhcnNlZFVybCA9IHBhcnNlKHByb2Nlc3NlZFVybCwgdHJ1ZSk7XG4gICAgICBjb25zdCB1cmxQYXRoID0gcGFyc2VkVXJsLnBhdGhuYW1lIHx8ICcnO1xuICAgICAgY29uc3QgdXJsUXVlcnkgPSBwYXJzZWRVcmwucXVlcnkgfHwge307XG4gICAgICBcbiAgICAgIC8vIFx1NTE4RFx1NkIyMVx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0Mlx1RkYwOFx1NEY3Rlx1NzUyOFx1NTkwNFx1NzQwNlx1NTQwRVx1NzY4NFVSTFx1RkYwOVxuICAgICAgaWYgKCFzaG91bGRNb2NrUmVxdWVzdChwcm9jZXNzZWRVcmwpKSB7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NjUzNlx1NTIzMFx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3VybFBhdGh9YCk7XG4gICAgICBcbiAgICAgIC8vIFx1NTkwNFx1NzQwNkNPUlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDJcbiAgICAgIGlmIChyZXEubWV0aG9kID09PSAnT1BUSU9OUycpIHtcbiAgICAgICAgaGFuZGxlQ29ycyhyZXMpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwNDtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NkRGQlx1NTJBMENPUlNcdTU5MzRcbiAgICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICAgIFxuICAgICAgLy8gXHU2QTIxXHU2MkRGXHU3RjUxXHU3RURDXHU1RUY2XHU4RkRGXG4gICAgICBpZiAobW9ja0NvbmZpZy5kZWxheSA+IDApIHtcbiAgICAgICAgYXdhaXQgZGVsYXkobW9ja0NvbmZpZy5kZWxheSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NTkwNFx1NzQwNlx1NEUwRFx1NTQwQ1x1NzY4NEFQSVx1N0FFRlx1NzBCOVxuICAgICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcbiAgICAgIFxuICAgICAgLy8gXHU2MzA5XHU5ODdBXHU1RThGXHU1QzFEXHU4QkQ1XHU0RTBEXHU1NDBDXHU3Njg0QVBJXHU1OTA0XHU3NDA2XHU1NjY4XG4gICAgICBpZiAoIWhhbmRsZWQpIGhhbmRsZWQgPSBhd2FpdCBoYW5kbGVEYXRhc291cmNlc0FwaShyZXEsIHJlcywgdXJsUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gYXdhaXQgaGFuZGxlUXVlcmllc0FwaShyZXEsIHJlcywgdXJsUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gYXdhaXQgaGFuZGxlSW50ZWdyYXRpb25BcGkocmVxLCByZXMsIHVybFBhdGgsIHVybFF1ZXJ5KTtcbiAgICAgIFxuICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2Q0ExXHU2NzA5XHU1OTA0XHU3NDA2XHVGRjBDXHU4RkQ0XHU1NkRFNDA0XG4gICAgICBpZiAoIWhhbmRsZWQpIHtcbiAgICAgICAgbG9nTW9jaygnaW5mbycsIGBcdTY3MkFcdTVCOUVcdTczQjBcdTc2ODRBUElcdThERUZcdTVGODQ6ICR7cmVxLm1ldGhvZH0gJHt1cmxQYXRofWApO1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICAgIGVycm9yOiAnXHU2NzJBXHU2MjdFXHU1MjMwQVBJXHU3QUVGXHU3MEI5JyxcbiAgICAgICAgICBtZXNzYWdlOiBgQVBJXHU3QUVGXHU3MEI5ICR7dXJsUGF0aH0gXHU2NzJBXHU2MjdFXHU1MjMwXHU2MjE2XHU2NzJBXHU1QjlFXHU3M0IwYCxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nTW9jaygnZXJyb3InLCBgXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU1MUZBXHU5NTE5OmAsIGVycm9yKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU2NzBEXHU1MkExXHU1NjY4XHU1MTg1XHU5MEU4XHU5NTE5XHU4QkVGJyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9ja1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XG4gKiBcbiAqIFx1NjNBN1x1NTIzNk1vY2tcdTY3MERcdTUyQTFcdTc2ODRcdTU0MkZcdTc1MjgvXHU3OTgxXHU3NTI4XHU3MkI2XHU2MDAxXHUzMDAxXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCXHU3QjQ5XG4gKi9cblxuLy8gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU2MjE2XHU1MTY4XHU1QzQwXHU4QkJFXHU3RjZFXHU0RTJEXHU4M0I3XHU1M0Q2XHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuZXhwb3J0IGZ1bmN0aW9uIGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgdHJ5IHtcbiAgICAvLyBcdTU3MjhOb2RlLmpzXHU3M0FGXHU1ODgzXHU0RTJEXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudikge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODNcdTRFMkRcbiAgICBpZiAodHlwZW9mIGltcG9ydC5tZXRhICE9PSAndW5kZWZpbmVkJyAmJiBpbXBvcnQubWV0YS5lbnYpIHtcbiAgICAgIGlmIChpbXBvcnQubWV0YS5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChpbXBvcnQubWV0YS5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTY4QzBcdTY3RTVsb2NhbFN0b3JhZ2UgKFx1NEVDNVx1NTcyOFx1NkQ0Rlx1ODlDOFx1NTY2OFx1NzNBRlx1NTg4MylcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgY29uc3QgbG9jYWxTdG9yYWdlVmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnVVNFX01PQ0tfQVBJJyk7XG4gICAgICBpZiAobG9jYWxTdG9yYWdlVmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChsb2NhbFN0b3JhZ2VWYWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OUVEOFx1OEJBNFx1NjBDNVx1NTFCNVx1RkYxQVx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NEUwQlx1NTQyRlx1NzUyOFx1RkYwQ1x1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1Nzk4MVx1NzUyOFxuICAgIGNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBcbiAgICAgICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHx8XG4gICAgICAodHlwZW9mIGltcG9ydC5tZXRhICE9PSAndW5kZWZpbmVkJyAmJiBpbXBvcnQubWV0YS5lbnYgJiYgaW1wb3J0Lm1ldGEuZW52LkRFViA9PT0gdHJ1ZSk7XG4gICAgXG4gICAgcmV0dXJuIGlzRGV2ZWxvcG1lbnQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gXHU1MUZBXHU5NTE5XHU2NUY2XHU3Njg0XHU1Qjg5XHU1MTY4XHU1NkRFXHU5MDAwXG4gICAgY29uc29sZS53YXJuKCdbTW9ja10gXHU2OEMwXHU2N0U1XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU1MUZBXHU5NTE5XHVGRjBDXHU5RUQ4XHU4QkE0XHU3OTgxXHU3NTI4TW9ja1x1NjcwRFx1NTJBMScsIGVycm9yKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gXHU1NDExXHU1NDBFXHU1MTdDXHU1QkI5XHU2NUU3XHU0RUUzXHU3ODAxXHU3Njg0XHU1MUZEXHU2NTcwXG5leHBvcnQgZnVuY3Rpb24gaXNNb2NrRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzRW5hYmxlZCgpO1xufVxuXG4vLyBNb2NrXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXG5leHBvcnQgY29uc3QgbW9ja0NvbmZpZyA9IHtcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICBlbmFibGVkOiBpc0VuYWJsZWQoKSxcbiAgXG4gIC8vIFx1OEJGN1x1NkM0Mlx1NUVGNlx1OEZERlx1RkYwOFx1NkJFQlx1NzlEMlx1RkYwOVxuICBkZWxheTogMzAwLFxuICBcbiAgLy8gQVBJXHU1N0ZBXHU3ODQwXHU4REVGXHU1Rjg0XHVGRjBDXHU3NTI4XHU0RThFXHU1MjI0XHU2NUFEXHU2NjJGXHU1NDI2XHU5NzAwXHU4OTgxXHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIGFwaUJhc2VQYXRoOiAnL2FwaScsXG4gIFxuICAvLyBcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkI6ICdub25lJywgJ2Vycm9yJywgJ2luZm8nLCAnZGVidWcnXG4gIGxvZ0xldmVsOiAnZGVidWcnLFxuICBcbiAgLy8gXHU1NDJGXHU3NTI4XHU3Njg0XHU2QTIxXHU1NzU3XG4gIG1vZHVsZXM6IHtcbiAgICBkYXRhc291cmNlczogdHJ1ZSxcbiAgICBxdWVyaWVzOiB0cnVlLFxuICAgIHVzZXJzOiB0cnVlLFxuICAgIHZpc3VhbGl6YXRpb25zOiB0cnVlXG4gIH1cbn07XG5cbi8vIFx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE1vY2tSZXF1ZXN0KHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFx1NUZDNVx1OTg3Qlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgaWYgKCFtb2NrQ29uZmlnLmVuYWJsZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFx1NUZDNVx1OTg3Qlx1NjYyRkFQSVx1OEJGN1x1NkM0MlxuICBpZiAoIXVybC5zdGFydHNXaXRoKG1vY2tDb25maWcuYXBpQmFzZVBhdGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdThERUZcdTVGODRcdTY4QzBcdTY3RTVcdTkwMUFcdThGQzdcdUZGMENcdTVFOTRcdThCRTVcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFx1OEJCMFx1NUY1NVx1NjVFNVx1NUZEN1xuZXhwb3J0IGZ1bmN0aW9uIGxvZ01vY2sobGV2ZWw6ICdlcnJvcicgfCAnaW5mbycgfCAnZGVidWcnLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICBjb25zdCB7IGxvZ0xldmVsIH0gPSBtb2NrQ29uZmlnO1xuICBcbiAgaWYgKGxvZ0xldmVsID09PSAnbm9uZScpIHJldHVybjtcbiAgXG4gIGlmIChsZXZlbCA9PT0gJ2Vycm9yJyAmJiBbJ2Vycm9yJywgJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTW9jayBFUlJPUl0nLCAuLi5hcmdzKTtcbiAgfSBlbHNlIGlmIChsZXZlbCA9PT0gJ2luZm8nICYmIFsnaW5mbycsICdkZWJ1ZyddLmluY2x1ZGVzKGxvZ0xldmVsKSkge1xuICAgIGNvbnNvbGUuaW5mbygnW01vY2sgSU5GT10nLCAuLi5hcmdzKTtcbiAgfSBlbHNlIGlmIChsZXZlbCA9PT0gJ2RlYnVnJyAmJiBsb2dMZXZlbCA9PT0gJ2RlYnVnJykge1xuICAgIGNvbnNvbGUubG9nKCdbTW9jayBERUJVR10nLCAuLi5hcmdzKTtcbiAgfVxufVxuXG4vLyBcdTUyMURcdTU5Q0JcdTUzMTZcdTY1RjZcdThGOTNcdTUxRkFNb2NrXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxXG50cnkge1xuICBjb25zb2xlLmxvZyhgW01vY2tdIFx1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMTogJHttb2NrQ29uZmlnLmVuYWJsZWQgPyAnXHU1REYyXHU1NDJGXHU3NTI4JyA6ICdcdTVERjJcdTc5ODFcdTc1MjgnfWApO1xuICBpZiAobW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTkxNERcdTdGNkU6YCwge1xuICAgICAgZGVsYXk6IG1vY2tDb25maWcuZGVsYXksXG4gICAgICBhcGlCYXNlUGF0aDogbW9ja0NvbmZpZy5hcGlCYXNlUGF0aCxcbiAgICAgIGxvZ0xldmVsOiBtb2NrQ29uZmlnLmxvZ0xldmVsLFxuICAgICAgZW5hYmxlZE1vZHVsZXM6IE9iamVjdC5lbnRyaWVzKG1vY2tDb25maWcubW9kdWxlcylcbiAgICAgICAgLmZpbHRlcigoW18sIGVuYWJsZWRdKSA9PiBlbmFibGVkKVxuICAgICAgICAubWFwKChbbmFtZV0pID0+IG5hbWUpXG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGNvbnNvbGUud2FybignW01vY2tdIFx1OEY5M1x1NTFGQVx1OTE0RFx1N0Y2RVx1NEZFMVx1NjA2Rlx1NTFGQVx1OTUxOScsIGVycm9yKTtcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHNcIjsvKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5MFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY1NzBcdTYzNkVcdTZFOTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdUZGMENcdTc1MjhcdTRFOEVcdTVGMDBcdTUzRDFcdTU0OENcdTZENEJcdThCRDVcbiAqL1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTdDN0JcdTU3OEJcbmV4cG9ydCB0eXBlIERhdGFTb3VyY2VUeXBlID0gJ215c3FsJyB8ICdwb3N0Z3Jlc3FsJyB8ICdvcmFjbGUnIHwgJ3NxbHNlcnZlcicgfCAnc3FsaXRlJztcblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU3MkI2XHU2MDAxXG5leHBvcnQgdHlwZSBEYXRhU291cmNlU3RhdHVzID0gJ2FjdGl2ZScgfCAnaW5hY3RpdmUnIHwgJ2Vycm9yJyB8ICdwZW5kaW5nJztcblxuLy8gXHU1NDBDXHU2QjY1XHU5ODkxXHU3Mzg3XG5leHBvcnQgdHlwZSBTeW5jRnJlcXVlbmN5ID0gJ21hbnVhbCcgfCAnaG91cmx5JyB8ICdkYWlseScgfCAnd2Vla2x5JyB8ICdtb250aGx5JztcblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU2M0E1XHU1M0UzXG5leHBvcnQgaW50ZXJmYWNlIERhdGFTb3VyY2Uge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICB0eXBlOiBEYXRhU291cmNlVHlwZTtcbiAgaG9zdD86IHN0cmluZztcbiAgcG9ydD86IG51bWJlcjtcbiAgZGF0YWJhc2VOYW1lPzogc3RyaW5nO1xuICB1c2VybmFtZT86IHN0cmluZztcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gIHN0YXR1czogRGF0YVNvdXJjZVN0YXR1cztcbiAgc3luY0ZyZXF1ZW5jeT86IFN5bmNGcmVxdWVuY3k7XG4gIGxhc3RTeW5jVGltZT86IHN0cmluZyB8IG51bGw7XG4gIGNyZWF0ZWRBdDogc3RyaW5nO1xuICB1cGRhdGVkQXQ6IHN0cmluZztcbiAgaXNBY3RpdmU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKi9cbmV4cG9ydCBjb25zdCBtb2NrRGF0YVNvdXJjZXM6IERhdGFTb3VyY2VbXSA9IFtcbiAge1xuICAgIGlkOiAnZHMtMScsXG4gICAgbmFtZTogJ015U1FMXHU3OTNBXHU0RjhCXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4Qk15U1FMXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnbXlzcWwnLFxuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHBvcnQ6IDMzMDYsXG4gICAgZGF0YWJhc2VOYW1lOiAnZXhhbXBsZV9kYicsXG4gICAgdXNlcm5hbWU6ICd1c2VyJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdkYWlseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMicsXG4gICAgbmFtZTogJ1Bvc3RncmVTUUxcdTc1MUZcdTRFQTdcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ3Bvc3RncmVzcWwnLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMTAwJyxcbiAgICBwb3J0OiA1NDMyLFxuICAgIGRhdGFiYXNlTmFtZTogJ3Byb2R1Y3Rpb25fZGInLFxuICAgIHVzZXJuYW1lOiAnYWRtaW4nLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2hvdXJseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzYwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA3Nzc2MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0zJyxcbiAgICBuYW1lOiAnU1FMaXRlXHU2NzJDXHU1NzMwXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NjcyQ1x1NTczMFNRTGl0ZVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ3NxbGl0ZScsXG4gICAgZGF0YWJhc2VOYW1lOiAnL3BhdGgvdG8vbG9jYWwuZGInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzQ1NjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTQnLFxuICAgIG5hbWU6ICdTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFNRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTczQUZcdTU4ODMnLFxuICAgIHR5cGU6ICdzcWxzZXJ2ZXInLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMjAwJyxcbiAgICBwb3J0OiAxNDMzLFxuICAgIGRhdGFiYXNlTmFtZTogJ3Rlc3RfZGInLFxuICAgIHVzZXJuYW1lOiAndGVzdGVyJyxcbiAgICBzdGF0dXM6ICdpbmFjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ3dlZWtseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNjA0ODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDUxODQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogZmFsc2VcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtNScsXG4gICAgbmFtZTogJ09yYWNsZVx1NEYwMVx1NEUxQVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBPcmFjbGVcdTRGMDFcdTRFMUFcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdvcmFjbGUnLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMTUwJyxcbiAgICBwb3J0OiAxNTIxLFxuICAgIGRhdGFiYXNlTmFtZTogJ2VudGVycHJpc2VfZGInLFxuICAgIHVzZXJuYW1lOiAnc3lzdGVtJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdkYWlseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDEwMzY4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfVxuXTtcblxuLyoqXG4gKiBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBjb3VudCBcdTc1MUZcdTYyMTBcdTY1NzBcdTkxQ0ZcbiAqIEByZXR1cm5zIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1N0VDNFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVNb2NrRGF0YVNvdXJjZXMoY291bnQ6IG51bWJlciA9IDUpOiBEYXRhU291cmNlW10ge1xuICBjb25zdCB0eXBlczogRGF0YVNvdXJjZVR5cGVbXSA9IFsnbXlzcWwnLCAncG9zdGdyZXNxbCcsICdvcmFjbGUnLCAnc3Fsc2VydmVyJywgJ3NxbGl0ZSddO1xuICBjb25zdCBzdGF0dXNlczogRGF0YVNvdXJjZVN0YXR1c1tdID0gWydhY3RpdmUnLCAnaW5hY3RpdmUnLCAnZXJyb3InLCAncGVuZGluZyddO1xuICBjb25zdCBzeW5jRnJlcXM6IFN5bmNGcmVxdWVuY3lbXSA9IFsnbWFudWFsJywgJ2hvdXJseScsICdkYWlseScsICd3ZWVrbHknLCAnbW9udGhseSddO1xuICBcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVzW2kgJSB0eXBlcy5sZW5ndGhdO1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBgZHMtZ2VuLSR7aSArIDF9YCxcbiAgICAgIG5hbWU6IGBcdTc1MUZcdTYyMTBcdTc2ODQke3R5cGV9XHU2NTcwXHU2MzZFXHU2RTkwICR7aSArIDF9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU3Njg0JHt0eXBlfVx1N0M3Qlx1NTc4Qlx1NjU3MFx1NjM2RVx1NkU5MCAke2kgKyAxfWAsXG4gICAgICB0eXBlLFxuICAgICAgaG9zdDogdHlwZSAhPT0gJ3NxbGl0ZScgPyAnbG9jYWxob3N0JyA6IHVuZGVmaW5lZCxcbiAgICAgIHBvcnQ6IHR5cGUgIT09ICdzcWxpdGUnID8gKDMzMDYgKyBpKSA6IHVuZGVmaW5lZCxcbiAgICAgIGRhdGFiYXNlTmFtZTogdHlwZSA9PT0gJ3NxbGl0ZScgPyBgL3BhdGgvdG8vZGJfJHtpfS5kYmAgOiBgZXhhbXBsZV9kYl8ke2l9YCxcbiAgICAgIHVzZXJuYW1lOiB0eXBlICE9PSAnc3FsaXRlJyA/IGB1c2VyXyR7aX1gIDogdW5kZWZpbmVkLFxuICAgICAgc3RhdHVzOiBzdGF0dXNlc1tpICUgc3RhdHVzZXMubGVuZ3RoXSxcbiAgICAgIHN5bmNGcmVxdWVuY3k6IHN5bmNGcmVxc1tpICUgc3luY0ZyZXFzLmxlbmd0aF0sXG4gICAgICBsYXN0U3luY1RpbWU6IGkgJSAzID09PSAwID8gbnVsbCA6IG5ldyBEYXRlKG5vdyAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUobm93IC0gKGkgKyAxMCkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUobm93IC0gaSAqIDQzMjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgaXNBY3RpdmU6IGkgJSA0ICE9PSAwXG4gICAgfTtcbiAgfSk7XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1OUVEOFx1OEJBNFx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuZXhwb3J0IGRlZmF1bHQgbW9ja0RhdGFTb3VyY2VzOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHNcIjsvKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5ME1vY2tcdTY3MERcdTUyQTFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2NTcwXHU2MzZFXHU2RTkwXHU3NkY4XHU1MTczQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU1QjlFXHU3M0IwXG4gKi9cblxuaW1wb3J0IHsgbW9ja0RhdGFTb3VyY2VzIH0gZnJvbSAnLi4vZGF0YS9kYXRhc291cmNlJztcbmltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZSB9IGZyb20gJy4uL2RhdGEvZGF0YXNvdXJjZSc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU0RTM0XHU2NUY2XHU1QjU4XHU1MEE4XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHVGRjBDXHU1MTQxXHU4QkI4XHU2QTIxXHU2MkRGXHU1ODlFXHU1MjIwXHU2NTM5XHU2NENEXHU0RjVDXG5sZXQgZGF0YVNvdXJjZXMgPSBbLi4ubW9ja0RhdGFTb3VyY2VzXTtcblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXkgPSB0eXBlb2YgbW9ja0NvbmZpZy5kZWxheSA9PT0gJ251bWJlcicgPyBtb2NrQ29uZmlnLmRlbGF5IDogMzAwO1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG59XG5cbi8qKlxuICogXHU5MUNEXHU3RjZFXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU2MzZFXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldERhdGFTb3VyY2VzKCk6IHZvaWQge1xuICBkYXRhU291cmNlcyA9IFsuLi5tb2NrRGF0YVNvdXJjZXNdO1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICogQHBhcmFtIHBhcmFtcyBcdTY3RTVcdThCRTJcdTUzQzJcdTY1NzBcbiAqIEByZXR1cm5zIFx1NTIwNlx1OTg3NVx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YVNvdXJjZXMocGFyYW1zPzoge1xuICBwYWdlPzogbnVtYmVyO1xuICBzaXplPzogbnVtYmVyO1xuICBuYW1lPzogc3RyaW5nO1xuICB0eXBlPzogc3RyaW5nO1xuICBzdGF0dXM/OiBzdHJpbmc7XG59KTogUHJvbWlzZTx7XG4gIGl0ZW1zOiBEYXRhU291cmNlW107XG4gIHBhZ2luYXRpb246IHtcbiAgICB0b3RhbDogbnVtYmVyO1xuICAgIHBhZ2U6IG51bWJlcjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgdG90YWxQYWdlczogbnVtYmVyO1xuICB9O1xufT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICBcbiAgLy8gXHU1RTk0XHU3NTI4XHU4RkM3XHU2RUU0XG4gIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLmRhdGFTb3VyY2VzXTtcbiAgXG4gIC8vIFx1NjMwOVx1NTQwRFx1NzlGMFx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy5uYW1lKSB7XG4gICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IFxuICAgICAgZHMubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgKGRzLmRlc2NyaXB0aW9uICYmIGRzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgKTtcbiAgfVxuICBcbiAgLy8gXHU2MzA5XHU3QzdCXHU1NzhCXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/LnR5cGUpIHtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gZHMudHlwZSA9PT0gcGFyYW1zLnR5cGUpO1xuICB9XG4gIFxuICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IGRzLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gIH1cbiAgXG4gIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKTtcbiAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICBcbiAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gIHJldHVybiB7XG4gICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgIHBhZ2UsXG4gICAgICBzaXplLFxuICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqIEByZXR1cm5zIFx1NjU3MFx1NjM2RVx1NkU5MFx1OEJFNlx1NjBDNVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YVNvdXJjZShpZDogc3RyaW5nKTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTY3RTVcdTYyN0VcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2VzLmZpbmQoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmICghZGF0YVNvdXJjZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICByZXR1cm4gZGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBkYXRhIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1NjM2RVxuICogQHJldHVybnMgXHU1MjFCXHU1RUZBXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVEYXRhU291cmNlKGRhdGE6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMElEXG4gIGNvbnN0IG5ld0lkID0gYGRzLSR7RGF0ZS5ub3coKX1gO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IG5ld0RhdGFTb3VyY2U6IERhdGFTb3VyY2UgPSB7XG4gICAgaWQ6IG5ld0lkLFxuICAgIG5hbWU6IGRhdGEubmFtZSB8fCAnTmV3IERhdGEgU291cmNlJyxcbiAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICB0eXBlOiBkYXRhLnR5cGUgfHwgJ215c3FsJyxcbiAgICBob3N0OiBkYXRhLmhvc3QsXG4gICAgcG9ydDogZGF0YS5wb3J0LFxuICAgIGRhdGFiYXNlTmFtZTogZGF0YS5kYXRhYmFzZU5hbWUsXG4gICAgdXNlcm5hbWU6IGRhdGEudXNlcm5hbWUsXG4gICAgc3RhdHVzOiBkYXRhLnN0YXR1cyB8fCAncGVuZGluZycsXG4gICAgc3luY0ZyZXF1ZW5jeTogZGF0YS5zeW5jRnJlcXVlbmN5IHx8ICdtYW51YWwnLFxuICAgIGxhc3RTeW5jVGltZTogbnVsbCxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9O1xuICBcbiAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU1MjE3XHU4ODY4XG4gIGRhdGFTb3VyY2VzLnB1c2gobmV3RGF0YVNvdXJjZSk7XG4gIFxuICByZXR1cm4gbmV3RGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICogQHBhcmFtIGRhdGEgXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXG4gKiBAcmV0dXJucyBcdTY2RjRcdTY1QjBcdTU0MEVcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZURhdGFTb3VyY2UoaWQ6IHN0cmluZywgZGF0YTogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2MjdFXHU1MjMwXHU4OTgxXHU2NkY0XHU2NUIwXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXHU3RDIyXHU1RjE1XG4gIGNvbnN0IGluZGV4ID0gZGF0YVNvdXJjZXMuZmluZEluZGV4KGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIC8vIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCB1cGRhdGVkRGF0YVNvdXJjZTogRGF0YVNvdXJjZSA9IHtcbiAgICAuLi5kYXRhU291cmNlc1tpbmRleF0sXG4gICAgLi4uZGF0YSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICB9O1xuICBcbiAgLy8gXHU2NkZGXHU2MzYyXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGRhdGFTb3VyY2VzW2luZGV4XSA9IHVwZGF0ZWREYXRhU291cmNlO1xuICBcbiAgcmV0dXJuIHVwZGF0ZWREYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVEYXRhU291cmNlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjI3RVx1NTIzMFx1ODk4MVx1NTIyMFx1OTY2NFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFx1N0QyMlx1NUYxNVxuICBjb25zdCBpbmRleCA9IGRhdGFTb3VyY2VzLmZpbmRJbmRleChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgZGF0YVNvdXJjZXMuc3BsaWNlKGluZGV4LCAxKTtcbn1cblxuLyoqXG4gKiBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAqIEBwYXJhbSBwYXJhbXMgXHU4RkRFXHU2M0E1XHU1M0MyXHU2NTcwXG4gKiBAcmV0dXJucyBcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTdFRDNcdTY3OUNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3RDb25uZWN0aW9uKHBhcmFtczogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8e1xuICBzdWNjZXNzOiBib29sZWFuO1xuICBtZXNzYWdlPzogc3RyaW5nO1xuICBkZXRhaWxzPzogYW55O1xufT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU1QjlFXHU5NjQ1XHU0RjdGXHU3NTI4XHU2NUY2XHU1M0VGXHU4MEZEXHU0RjFBXHU2NzA5XHU2NkY0XHU1OTBEXHU2NzQyXHU3Njg0XHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU5MDNCXHU4RjkxXG4gIC8vIFx1OEZEOVx1OTFDQ1x1N0I4MFx1NTM1NVx1NkEyMVx1NjJERlx1NjIxMFx1NTI5Ri9cdTU5MzFcdThEMjVcbiAgY29uc3Qgc3VjY2VzcyA9IE1hdGgucmFuZG9tKCkgPiAwLjI7IC8vIDgwJVx1NjIxMFx1NTI5Rlx1NzM4N1xuICBcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzLFxuICAgIG1lc3NhZ2U6IHN1Y2Nlc3MgPyAnXHU4RkRFXHU2M0E1XHU2MjEwXHU1MjlGJyA6ICdcdThGREVcdTYzQTVcdTU5MzFcdThEMjU6IFx1NjVFMFx1NkNENVx1OEZERVx1NjNBNVx1NTIzMFx1NjU3MFx1NjM2RVx1NUU5M1x1NjcwRFx1NTJBMVx1NTY2OCcsXG4gICAgZGV0YWlsczogc3VjY2VzcyA/IHtcbiAgICAgIHJlc3BvbnNlVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApICsgMTAsXG4gICAgICB2ZXJzaW9uOiAnOC4wLjI4JyxcbiAgICAgIGNvbm5lY3Rpb25JZDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApICsgMTAwMFxuICAgIH0gOiB7XG4gICAgICBlcnJvckNvZGU6ICdDT05ORUNUSU9OX1JFRlVTRUQnLFxuICAgICAgZXJyb3JEZXRhaWxzOiAnXHU2NUUwXHU2Q0Q1XHU1RUZBXHU3QUNCXHU1MjMwXHU2NzBEXHU1MkExXHU1NjY4XHU3Njg0XHU4RkRFXHU2M0E1XHVGRjBDXHU4QkY3XHU2OEMwXHU2N0U1XHU3RjUxXHU3RURDXHU4QkJFXHU3RjZFXHU1NDhDXHU1MUVEXHU2MzZFJ1xuICAgIH1cbiAgfTtcbn1cblxuLy8gXHU1QkZDXHU1MUZBXHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldERhdGFTb3VyY2VzLFxuICBnZXREYXRhU291cmNlLFxuICBjcmVhdGVEYXRhU291cmNlLFxuICB1cGRhdGVEYXRhU291cmNlLFxuICBkZWxldGVEYXRhU291cmNlLFxuICB0ZXN0Q29ubmVjdGlvbixcbiAgcmVzZXREYXRhU291cmNlc1xufTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy91dGlscy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvdXRpbHMudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTkwMUFcdTc1MjhcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU1MjFCXHU1RUZBXHU3RURGXHU0RTAwXHU2ODNDXHU1RjBGXHU1NENEXHU1RTk0XHU3Njg0XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG4gKi9cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTZBMjFcdTYyREZBUElcdTYyMTBcdTUyOUZcdTU0Q0RcdTVFOTRcbiAqIEBwYXJhbSBkYXRhIFx1NTRDRFx1NUU5NFx1NjU3MFx1NjM2RVxuICogQHBhcmFtIHN1Y2Nlc3MgXHU2MjEwXHU1MjlGXHU3MkI2XHU2MDAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBdHJ1ZVxuICogQHBhcmFtIG1lc3NhZ2UgXHU1M0VGXHU5MDA5XHU2RDg4XHU2MDZGXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTY4M0NcdTVGMEZcdTc2ODRBUElcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tSZXNwb25zZTxUPihcbiAgZGF0YTogVCwgXG4gIHN1Y2Nlc3M6IGJvb2xlYW4gPSB0cnVlLCBcbiAgbWVzc2FnZT86IHN0cmluZ1xuKSB7XG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBkYXRhLFxuICAgIG1lc3NhZ2UsXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgbW9ja1Jlc3BvbnNlOiB0cnVlIC8vIFx1NjgwN1x1OEJCMFx1NEUzQVx1NkEyMVx1NjJERlx1NTRDRFx1NUU5NFxuICB9O1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NkEyMVx1NjJERkFQSVx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICogQHBhcmFtIG1lc3NhZ2UgXHU5NTE5XHU4QkVGXHU2RDg4XHU2MDZGXG4gKiBAcGFyYW0gY29kZSBcdTk1MTlcdThCRUZcdTRFRTNcdTc4MDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0EnTU9DS19FUlJPUidcbiAqIEBwYXJhbSBzdGF0dXMgSFRUUFx1NzJCNlx1NjAwMVx1NzgwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQTUwMFxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHU3Njg0XHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZShcbiAgbWVzc2FnZTogc3RyaW5nLCBcbiAgY29kZTogc3RyaW5nID0gJ01PQ0tfRVJST1InLCBcbiAgc3RhdHVzOiBudW1iZXIgPSA1MDBcbikge1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgIGVycm9yOiB7XG4gICAgICBtZXNzYWdlLFxuICAgICAgY29kZSxcbiAgICAgIHN0YXR1c0NvZGU6IHN0YXR1c1xuICAgIH0sXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgbW9ja1Jlc3BvbnNlOiB0cnVlXG4gIH07XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU1MjA2XHU5ODc1XHU1NENEXHU1RTk0XHU3RUQzXHU2Nzg0XG4gKiBAcGFyYW0gaXRlbXMgXHU1RjUzXHU1MjREXHU5ODc1XHU3Njg0XHU5ODc5XHU3NkVFXHU1MjE3XHU4ODY4XG4gKiBAcGFyYW0gdG90YWxJdGVtcyBcdTYwM0JcdTk4NzlcdTc2RUVcdTY1NzBcbiAqIEBwYXJhbSBwYWdlIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzgwMVxuICogQHBhcmFtIHNpemUgXHU2QkNGXHU5ODc1XHU1OTI3XHU1QzBGXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTUyMDZcdTk4NzVcdTU0Q0RcdTVFOTRcdTdFRDNcdTY3ODRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZTxUPihcbiAgaXRlbXM6IFRbXSxcbiAgdG90YWxJdGVtczogbnVtYmVyLFxuICBwYWdlOiBudW1iZXIgPSAxLFxuICBzaXplOiBudW1iZXIgPSAxMFxuKSB7XG4gIHJldHVybiBjcmVhdGVNb2NrUmVzcG9uc2Uoe1xuICAgIGl0ZW1zLFxuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIHRvdGFsOiB0b3RhbEl0ZW1zLFxuICAgICAgcGFnZSxcbiAgICAgIHNpemUsXG4gICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwodG90YWxJdGVtcyAvIHNpemUpLFxuICAgICAgaGFzTW9yZTogcGFnZSAqIHNpemUgPCB0b3RhbEl0ZW1zXG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZBUElcdTU0Q0RcdTVFOTRcdTVFRjZcdThGREZcbiAqIEBwYXJhbSBtcyBcdTVFRjZcdThGREZcdTZCRUJcdTc5RDJcdTY1NzBcdUZGMENcdTlFRDhcdThCQTQzMDBtc1xuICogQHJldHVybnMgUHJvbWlzZVx1NUJGOVx1OEM2MVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlciA9IDMwMCk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSxcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheVxufTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9xdWVyeS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvcXVlcnkudHNcIjsvKipcbiAqIFx1NjdFNVx1OEJFMk1vY2tcdTY3MERcdTUyQTFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU1QjlFXHU3M0IwXG4gKi9cblxuaW1wb3J0IHsgZGVsYXksIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSwgY3JlYXRlTW9ja1Jlc3BvbnNlLCBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NkEyMVx1NjJERlx1NjdFNVx1OEJFMlx1NjU3MFx1NjM2RVxuY29uc3QgbW9ja1F1ZXJpZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT4ge1xuICBjb25zdCBpZCA9IGBxdWVyeS0ke2kgKyAxfWA7XG4gIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCk7XG4gIFxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIG5hbWU6IGBcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX1gLFxuICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyICR7aSArIDF9IFx1NzY4NFx1NjNDRlx1OEZGMGAsXG4gICAgZm9sZGVySWQ6IGkgJSAzID09PSAwID8gJ2ZvbGRlci0xJyA6IChpICUgMyA9PT0gMSA/ICdmb2xkZXItMicgOiAnZm9sZGVyLTMnKSxcbiAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgZGF0YVNvdXJjZU5hbWU6IGBcdTY1NzBcdTYzNkVcdTZFOTAgJHsoaSAlIDUpICsgMX1gLFxuICAgIHF1ZXJ5VHlwZTogaSAlIDIgPT09IDAgPyAnU1FMJyA6ICdOQVRVUkFMX0xBTkdVQUdFJyxcbiAgICBxdWVyeVRleHQ6IGkgJSAyID09PSAwID8gXG4gICAgICBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCA6IFxuICAgICAgYFx1NjdFNVx1NjI3RVx1NjcwMFx1OEZEMTEwXHU2NzYxJHtpICUgMiA9PT0gMCA/ICdcdThCQTJcdTUzNTUnIDogJ1x1NzUyOFx1NjIzNyd9XHU4QkIwXHU1RjU1YCxcbiAgICBzdGF0dXM6IGkgJSA0ID09PSAwID8gJ0RSQUZUJyA6IChpICUgNCA9PT0gMSA/ICdQVUJMSVNIRUQnIDogKGkgJSA0ID09PSAyID8gJ0RFUFJFQ0FURUQnIDogJ0FSQ0hJVkVEJykpLFxuICAgIHNlcnZpY2VTdGF0dXM6IGkgJSAyID09PSAwID8gJ0VOQUJMRUQnIDogJ0RJU0FCTEVEJyxcbiAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgIHVwZGF0ZWRCeTogeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICBleGVjdXRpb25Db3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApLFxuICAgIGlzRmF2b3JpdGU6IGkgJSAzID09PSAwLFxuICAgIGlzQWN0aXZlOiBpICUgNSAhPT0gMCxcbiAgICBsYXN0RXhlY3V0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgcmVzdWx0Q291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyAxMCxcbiAgICBleGVjdXRpb25UaW1lOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDApICsgMTAsXG4gICAgdGFnczogW2BcdTY4MDdcdTdCN0Uke2krMX1gLCBgXHU3QzdCXHU1NzhCJHtpICUgM31gXSxcbiAgICBjdXJyZW50VmVyc2lvbjoge1xuICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICBxdWVyeUlkOiBpZCxcbiAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICBuYW1lOiAnXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDJyxcbiAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH0sXG4gICAgdmVyc2lvbnM6IFt7XG4gICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfV1cbiAgfTtcbn0pO1xuXG4vLyBcdTkxQ0RcdTdGNkVcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbmV4cG9ydCBmdW5jdGlvbiByZXNldFF1ZXJpZXMoKTogdm9pZCB7XG4gIC8vIFx1NEZERFx1NzU1OVx1NUYxNVx1NzUyOFx1RkYwQ1x1NTNFQVx1OTFDRFx1N0Y2RVx1NTE4NVx1NUJCOVxuICB3aGlsZSAobW9ja1F1ZXJpZXMubGVuZ3RoID4gMCkge1xuICAgIG1vY2tRdWVyaWVzLnBvcCgpO1xuICB9XG4gIFxuICAvLyBcdTkxQ0RcdTY1QjBcdTc1MUZcdTYyMTBcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbiAgQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+IHtcbiAgICBjb25zdCBpZCA9IGBxdWVyeS0ke2kgKyAxfWA7XG4gICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICBtb2NrUXVlcmllcy5wdXNoKHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogYFx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfWAsXG4gICAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfSBcdTc2ODRcdTYzQ0ZcdThGRjBgLFxuICAgICAgZm9sZGVySWQ6IGkgJSAzID09PSAwID8gJ2ZvbGRlci0xJyA6IChpICUgMyA9PT0gMSA/ICdmb2xkZXItMicgOiAnZm9sZGVyLTMnKSxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIGRhdGFTb3VyY2VOYW1lOiBgXHU2NTcwXHU2MzZFXHU2RTkwICR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHF1ZXJ5VHlwZTogaSAlIDIgPT09IDAgPyAnU1FMJyA6ICdOQVRVUkFMX0xBTkdVQUdFJyxcbiAgICAgIHF1ZXJ5VGV4dDogaSAlIDIgPT09IDAgPyBcbiAgICAgICAgYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAgOiBcbiAgICAgICAgYFx1NjdFNVx1NjI3RVx1NjcwMFx1OEZEMTEwXHU2NzYxJHtpICUgMiA9PT0gMCA/ICdcdThCQTJcdTUzNTUnIDogJ1x1NzUyOFx1NjIzNyd9XHU4QkIwXHU1RjU1YCxcbiAgICAgIHN0YXR1czogaSAlIDQgPT09IDAgPyAnRFJBRlQnIDogKGkgJSA0ID09PSAxID8gJ1BVQkxJU0hFRCcgOiAoaSAlIDQgPT09IDIgPyAnREVQUkVDQVRFRCcgOiAnQVJDSElWRUQnKSksXG4gICAgICBzZXJ2aWNlU3RhdHVzOiBpICUgMiA9PT0gMCA/ICdFTkFCTEVEJyA6ICdESVNBQkxFRCcsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNyZWF0ZWRCeTogeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIHVwZGF0ZWRCeTogeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIGV4ZWN1dGlvbkNvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCksXG4gICAgICBpc0Zhdm9yaXRlOiBpICUgMyA9PT0gMCxcbiAgICAgIGlzQWN0aXZlOiBpICUgNSAhPT0gMCxcbiAgICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHJlc3VsdENvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApICsgMTAsXG4gICAgICBleGVjdXRpb25UaW1lOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDApICsgMTAsXG4gICAgICB0YWdzOiBbYFx1NjgwN1x1N0I3RSR7aSsxfWAsIGBcdTdDN0JcdTU3OEIke2kgJSAzfWBdLFxuICAgICAgY3VycmVudFZlcnNpb246IHtcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH0sXG4gICAgICB2ZXJzaW9uczogW3tcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH1dXG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZURlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkZWxheVRpbWUgPSB0eXBlb2YgbW9ja0NvbmZpZy5kZWxheSA9PT0gJ251bWJlcicgPyBtb2NrQ29uZmlnLmRlbGF5IDogMzAwO1xuICByZXR1cm4gZGVsYXkoZGVsYXlUaW1lKTtcbn1cblxuLyoqXG4gKiBcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFcbiAqL1xuY29uc3QgcXVlcnlTZXJ2aWNlID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyaWVzKHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICAgIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLm1vY2tRdWVyaWVzXTtcbiAgICBcbiAgICAvLyBcdTYzMDlcdTU0MERcdTc5RjBcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5uYW1lKSB7XG4gICAgICBjb25zdCBrZXl3b3JkID0gcGFyYW1zLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IFxuICAgICAgICBxLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgICAgKHEuZGVzY3JpcHRpb24gJiYgcS5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uZGF0YVNvdXJjZUlkKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLmRhdGFTb3VyY2VJZCA9PT0gcGFyYW1zLmRhdGFTb3VyY2VJZCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NzJCNlx1NjAwMVx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5xdWVyeVR5cGUpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEucXVlcnlUeXBlID09PSBwYXJhbXMucXVlcnlUeXBlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU2NTM2XHU4NUNGXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uaXNGYXZvcml0ZSkge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5pc0Zhdm9yaXRlID09PSB0cnVlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IGZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmlsdGVyZWRJdGVtcy5sZW5ndGggLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2NTM2XHU4NUNGXHU3Njg0XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRGYXZvcml0ZVF1ZXJpZXMocGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICAgIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gICAgXG4gICAgLy8gXHU4RkM3XHU2RUU0XHU1MUZBXHU2NTM2XHU4NUNGXHU3Njg0XHU2N0U1XHU4QkUyXG4gICAgbGV0IGZhdm9yaXRlUXVlcmllcyA9IG1vY2tRdWVyaWVzLmZpbHRlcihxID0+IHEuaXNGYXZvcml0ZSA9PT0gdHJ1ZSk7XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MTc2XHU0RUQ2XHU4RkM3XHU2RUU0XHU2NzYxXHU0RUY2XG4gICAgaWYgKHBhcmFtcz8ubmFtZSB8fCBwYXJhbXM/LnNlYXJjaCkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IChwYXJhbXMubmFtZSB8fCBwYXJhbXMuc2VhcmNoIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmF2b3JpdGVRdWVyaWVzID0gZmF2b3JpdGVRdWVyaWVzLmZpbHRlcihxID0+IFxuICAgICAgICBxLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgICAgKHEuZGVzY3JpcHRpb24gJiYgcS5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHBhcmFtcz8uZGF0YVNvdXJjZUlkKSB7XG4gICAgICBmYXZvcml0ZVF1ZXJpZXMgPSBmYXZvcml0ZVF1ZXJpZXMuZmlsdGVyKHEgPT4gcS5kYXRhU291cmNlSWQgPT09IHBhcmFtcy5kYXRhU291cmNlSWQpO1xuICAgIH1cbiAgICBcbiAgICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICAgIGZhdm9yaXRlUXVlcmllcyA9IGZhdm9yaXRlUXVlcmllcy5maWx0ZXIocSA9PiBxLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmYXZvcml0ZVF1ZXJpZXMubGVuZ3RoKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZhdm9yaXRlUXVlcmllcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICB0b3RhbDogZmF2b3JpdGVRdWVyaWVzLmxlbmd0aCxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZhdm9yaXRlUXVlcmllcy5sZW5ndGggLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBnZXRRdWVyeShpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gcXVlcnk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBjcmVhdGVRdWVyeShkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBJRFx1RkYwQ1x1NjgzQ1x1NUYwRlx1NEUwRVx1NzNCMFx1NjcwOUlEXHU0RTAwXHU4MUY0XG4gICAgY29uc3QgaWQgPSBgcXVlcnktJHttb2NrUXVlcmllcy5sZW5ndGggKyAxfWA7XG4gICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IG5ld1F1ZXJ5ID0ge1xuICAgICAgaWQsXG4gICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgYFx1NjVCMFx1NjdFNVx1OEJFMiAke2lkfWAsXG4gICAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICAgIGZvbGRlcklkOiBkYXRhLmZvbGRlcklkIHx8IG51bGwsXG4gICAgICBkYXRhU291cmNlSWQ6IGRhdGEuZGF0YVNvdXJjZUlkLFxuICAgICAgZGF0YVNvdXJjZU5hbWU6IGRhdGEuZGF0YVNvdXJjZU5hbWUgfHwgYFx1NjU3MFx1NjM2RVx1NkU5MCAke2RhdGEuZGF0YVNvdXJjZUlkfWAsXG4gICAgICBxdWVyeVR5cGU6IGRhdGEucXVlcnlUeXBlIHx8ICdTUUwnLFxuICAgICAgcXVlcnlUZXh0OiBkYXRhLnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMgfHwgJ0RSQUZUJyxcbiAgICAgIHNlcnZpY2VTdGF0dXM6IGRhdGEuc2VydmljZVN0YXR1cyB8fCAnRElTQUJMRUQnLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIGNyZWF0ZWRCeTogZGF0YS5jcmVhdGVkQnkgfHwgeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIHVwZGF0ZWRCeTogZGF0YS51cGRhdGVkQnkgfHwgeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICAgIGV4ZWN1dGlvbkNvdW50OiAwLFxuICAgICAgaXNGYXZvcml0ZTogZGF0YS5pc0Zhdm9yaXRlIHx8IGZhbHNlLFxuICAgICAgaXNBY3RpdmU6IGRhdGEuaXNBY3RpdmUgfHwgdHJ1ZSxcbiAgICAgIGxhc3RFeGVjdXRlZEF0OiBudWxsLFxuICAgICAgcmVzdWx0Q291bnQ6IDAsXG4gICAgICBleGVjdXRpb25UaW1lOiAwLFxuICAgICAgdGFnczogZGF0YS50YWdzIHx8IFtdLFxuICAgICAgY3VycmVudFZlcnNpb246IHtcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1MjFEXHU1OUNCXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBkYXRhLnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCxcbiAgICAgICAgc3RhdHVzOiAnRFJBRlQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH0sXG4gICAgICB2ZXJzaW9uczogW3tcbiAgICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgICBuYW1lOiAnXHU1MjFEXHU1OUNCXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgc3FsOiBkYXRhLnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCxcbiAgICAgICAgc3RhdHVzOiAnRFJBRlQnLFxuICAgICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICAgIH1dXG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTZERkJcdTUyQTBcdTUyMzBcdTUyMTdcdTg4NjhcbiAgICBtb2NrUXVlcmllcy5wdXNoKG5ld1F1ZXJ5KTtcbiAgICBcbiAgICByZXR1cm4gbmV3UXVlcnk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyB1cGRhdGVRdWVyeShpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTg5ODFcdTY2RjRcdTY1QjBcdTc2ODRcdTY3RTVcdThCRTJcdTdEMjJcdTVGMTVcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgdXBkYXRlZFF1ZXJ5ID0ge1xuICAgICAgLi4ubW9ja1F1ZXJpZXNbaW5kZXhdLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEJ5OiBkYXRhLnVwZGF0ZWRCeSB8fCBtb2NrUXVlcmllc1tpbmRleF0udXBkYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH1cbiAgICB9O1xuICAgIFxuICAgIC8vIFx1NjZGRlx1NjM2Mlx1NjdFNVx1OEJFMlxuICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHVwZGF0ZWRRdWVyeTtcbiAgICBcbiAgICByZXR1cm4gdXBkYXRlZFF1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlUXVlcnkoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTg5ODFcdTUyMjBcdTk2NjRcdTc2ODRcdTY3RTVcdThCRTJcdTdEMjJcdTVGMTVcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gICAgbW9ja1F1ZXJpZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzLmZpbmQocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFxdWVyeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1N0VEM1x1Njc5Q1xuICAgIGNvbnN0IGNvbHVtbnMgPSBbJ2lkJywgJ25hbWUnLCAnZW1haWwnLCAnc3RhdHVzJywgJ2NyZWF0ZWRfYXQnXTtcbiAgICBjb25zdCByb3dzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+ICh7XG4gICAgICBpZDogaSArIDEsXG4gICAgICBuYW1lOiBgXHU3NTI4XHU2MjM3ICR7aSArIDF9YCxcbiAgICAgIGVtYWlsOiBgdXNlciR7aSArIDF9QGV4YW1wbGUuY29tYCxcbiAgICAgIHN0YXR1czogaSAlIDIgPT09IDAgPyAnYWN0aXZlJyA6ICdpbmFjdGl2ZScsXG4gICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpXG4gICAgfSkpO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NjI2N1x1ODg0Q1x1N0VERlx1OEJBMVxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHtcbiAgICAgICAgLi4ubW9ja1F1ZXJpZXNbaW5kZXhdLFxuICAgICAgICBleGVjdXRpb25Db3VudDogKG1vY2tRdWVyaWVzW2luZGV4XS5leGVjdXRpb25Db3VudCB8fCAwKSArIDEsXG4gICAgICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHJlc3VsdENvdW50OiByb3dzLmxlbmd0aFxuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnMsXG4gICAgICByb3dzLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5yYW5kb20oKSAqIDAuNSArIDAuMSxcbiAgICAgICAgcm93Q291bnQ6IHJvd3MubGVuZ3RoLFxuICAgICAgICB0b3RhbFBhZ2VzOiAxXG4gICAgICB9LFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgaWQ6IHF1ZXJ5LmlkLFxuICAgICAgICBuYW1lOiBxdWVyeS5uYW1lLFxuICAgICAgICBkYXRhU291cmNlSWQ6IHF1ZXJ5LmRhdGFTb3VyY2VJZFxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjA3XHU2MzYyXHU2N0U1XHU4QkUyXHU2NTM2XHU4NUNGXHU3MkI2XHU2MDAxXG4gICAqL1xuICBhc3luYyB0b2dnbGVGYXZvcml0ZShpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIwN1x1NjM2Mlx1NjUzNlx1ODVDRlx1NzJCNlx1NjAwMVxuICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHtcbiAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgIGlzRmF2b3JpdGU6ICFtb2NrUXVlcmllc1tpbmRleF0uaXNGYXZvcml0ZSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gbW9ja1F1ZXJpZXNbaW5kZXhdO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTM4Nlx1NTNGMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnlIaXN0b3J5KHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVxuICAgIGNvbnN0IHRvdGFsSXRlbXMgPSAyMDtcbiAgICBjb25zdCBoaXN0b3JpZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiB0b3RhbEl0ZW1zIH0sIChfLCBpKSA9PiB7XG4gICAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDM2MDAwMDApLnRvSVNPU3RyaW5nKCk7XG4gICAgICBjb25zdCBxdWVyeUluZGV4ID0gaSAlIG1vY2tRdWVyaWVzLmxlbmd0aDtcbiAgICAgIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGBoaXN0LSR7aSArIDF9YCxcbiAgICAgICAgcXVlcnlJZDogbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0uaWQsXG4gICAgICAgIHF1ZXJ5TmFtZTogbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0ubmFtZSxcbiAgICAgICAgZXhlY3V0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgICBleGVjdXRpb25UaW1lOiBNYXRoLnJhbmRvbSgpICogMC41ICsgMC4xLFxuICAgICAgICByb3dDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEsXG4gICAgICAgIHVzZXJJZDogJ3VzZXIxJyxcbiAgICAgICAgdXNlck5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnLFxuICAgICAgICBzdGF0dXM6IGkgJSA4ID09PSAwID8gJ0ZBSUxFRCcgOiAnU1VDQ0VTUycsXG4gICAgICAgIGVycm9yTWVzc2FnZTogaSAlIDggPT09IDAgPyAnXHU2N0U1XHU4QkUyXHU2MjY3XHU4ODRDXHU4RDg1XHU2NUY2JyA6IG51bGxcbiAgICAgIH07XG4gICAgfSk7XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIHRvdGFsSXRlbXMpO1xuICAgIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gaGlzdG9yaWVzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiB0b3RhbEl0ZW1zLFxuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwodG90YWxJdGVtcyAvIHNpemUpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5VmVyc2lvbnMocXVlcnlJZDogc3RyaW5nLCBwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzLmZpbmQocSA9PiBxLmlkID09PSBxdWVyeUlkKTtcbiAgICBcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTcyNDhcdTY3MkNcdTUyMTdcdTg4NjhcbiAgICByZXR1cm4gcXVlcnkudmVyc2lvbnMgfHwgW107XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBjcmVhdGVRdWVyeVZlcnNpb24ocXVlcnlJZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IHF1ZXJ5SWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3F1ZXJ5SWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NzI0OFx1NjcyQ1xuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbaW5kZXhdO1xuICAgIGNvbnN0IG5ld1ZlcnNpb25OdW1iZXIgPSAocXVlcnkudmVyc2lvbnM/Lmxlbmd0aCB8fCAwKSArIDE7XG4gICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgIFxuICAgIGNvbnN0IG5ld1ZlcnNpb24gPSB7XG4gICAgICBpZDogYHZlci0ke3F1ZXJ5SWR9LSR7bmV3VmVyc2lvbk51bWJlcn1gLFxuICAgICAgcXVlcnlJZCxcbiAgICAgIHZlcnNpb25OdW1iZXI6IG5ld1ZlcnNpb25OdW1iZXIsXG4gICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgYFx1NzI0OFx1NjcyQyAke25ld1ZlcnNpb25OdW1iZXJ9YCxcbiAgICAgIHNxbDogZGF0YS5zcWwgfHwgcXVlcnkucXVlcnlUZXh0IHx8ICcnLFxuICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCB8fCBxdWVyeS5kYXRhU291cmNlSWQsXG4gICAgICBzdGF0dXM6ICdEUkFGVCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTRFNEJcdTUyNERcdTcyNDhcdTY3MkNcdTc2ODRpc0xhdGVzdFx1NjgwN1x1NUZEN1xuICAgIGlmIChxdWVyeS52ZXJzaW9ucyAmJiBxdWVyeS52ZXJzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBxdWVyeS52ZXJzaW9ucyA9IHF1ZXJ5LnZlcnNpb25zLm1hcCh2ID0+ICh7XG4gICAgICAgIC4uLnYsXG4gICAgICAgIGlzTGF0ZXN0OiBmYWxzZVxuICAgICAgfSkpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTZERkJcdTUyQTBcdTY1QjBcdTcyNDhcdTY3MkNcbiAgICBpZiAoIXF1ZXJ5LnZlcnNpb25zKSB7XG4gICAgICBxdWVyeS52ZXJzaW9ucyA9IFtdO1xuICAgIH1cbiAgICBxdWVyeS52ZXJzaW9ucy5wdXNoKG5ld1ZlcnNpb24pO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1xuICAgIG1vY2tRdWVyaWVzW2luZGV4XSA9IHtcbiAgICAgIC4uLnF1ZXJ5LFxuICAgICAgY3VycmVudFZlcnNpb246IG5ld1ZlcnNpb24sXG4gICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIG5ld1ZlcnNpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1M0QxXHU1RTAzXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBwdWJsaXNoUXVlcnlWZXJzaW9uKHZlcnNpb25JZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU1MzA1XHU1NDJCXHU2QjY0XHU3MjQ4XHU2NzJDXHU3Njg0XHU2N0U1XHU4QkUyXG4gICAgbGV0IHF1ZXJ5ID0gbnVsbDtcbiAgICBsZXQgdmVyc2lvbkluZGV4ID0gLTE7XG4gICAgbGV0IHF1ZXJ5SW5kZXggPSAtMTtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vY2tRdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMpIHtcbiAgICAgICAgY29uc3QgdkluZGV4ID0gbW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMuZmluZEluZGV4KHYgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICAgICAgaWYgKHZJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBxdWVyeSA9IG1vY2tRdWVyaWVzW2ldO1xuICAgICAgICAgIHZlcnNpb25JbmRleCA9IHZJbmRleDtcbiAgICAgICAgICBxdWVyeUluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoIXF1ZXJ5IHx8IHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU3MjQ4XHU2NzJDXHU3MkI2XHU2MDAxXG4gICAgY29uc3QgdXBkYXRlZFZlcnNpb24gPSB7XG4gICAgICAuLi5xdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIHB1Ymxpc2hlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF0gPSB1cGRhdGVkVmVyc2lvbjtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTcyQjZcdTYwMDFcbiAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgIC4uLnF1ZXJ5LFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB1cGRhdGVkVmVyc2lvbixcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdXBkYXRlZFZlcnNpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1RTlGXHU1RjAzXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gICAqL1xuICBhc3luYyBkZXByZWNhdGVRdWVyeVZlcnNpb24odmVyc2lvbklkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTUzMDVcdTU0MkJcdTZCNjRcdTcyNDhcdTY3MkNcdTc2ODRcdTY3RTVcdThCRTJcbiAgICBsZXQgcXVlcnkgPSBudWxsO1xuICAgIGxldCB2ZXJzaW9uSW5kZXggPSAtMTtcbiAgICBsZXQgcXVlcnlJbmRleCA9IC0xO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9ja1F1ZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtb2NrUXVlcmllc1tpXS52ZXJzaW9ucykge1xuICAgICAgICBjb25zdCB2SW5kZXggPSBtb2NrUXVlcmllc1tpXS52ZXJzaW9ucy5maW5kSW5kZXgodiA9PiB2LmlkID09PSB2ZXJzaW9uSWQpO1xuICAgICAgICBpZiAodkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbaV07XG4gICAgICAgICAgdmVyc2lvbkluZGV4ID0gdkluZGV4O1xuICAgICAgICAgIHF1ZXJ5SW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmICghcXVlcnkgfHwgdmVyc2lvbkluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7dmVyc2lvbklkfVx1NzY4NFx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ2ApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTcyNDhcdTY3MkNcdTcyQjZcdTYwMDFcbiAgICBjb25zdCB1cGRhdGVkVmVyc2lvbiA9IHtcbiAgICAgIC4uLnF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF0sXG4gICAgICBzdGF0dXM6ICdERVBSRUNBVEVEJyxcbiAgICAgIGRlcHJlY2F0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdID0gdXBkYXRlZFZlcnNpb247XG4gICAgXG4gICAgLy8gXHU1OTgyXHU2NzlDXHU1RTlGXHU1RjAzXHU3Njg0XHU2NjJGXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDXHVGRjBDXHU1MjE5XHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU3MkI2XHU2MDAxXG4gICAgaWYgKHF1ZXJ5LmN1cnJlbnRWZXJzaW9uICYmIHF1ZXJ5LmN1cnJlbnRWZXJzaW9uLmlkID09PSB2ZXJzaW9uSWQpIHtcbiAgICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgICAuLi5xdWVyeSxcbiAgICAgICAgc3RhdHVzOiAnREVQUkVDQVRFRCcsXG4gICAgICAgIGN1cnJlbnRWZXJzaW9uOiB1cGRhdGVkVmVyc2lvbixcbiAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgICAuLi5xdWVyeSxcbiAgICAgICAgdmVyc2lvbnM6IHF1ZXJ5LnZlcnNpb25zLFxuICAgICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NkZDMFx1NkQzQlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgYWN0aXZhdGVRdWVyeVZlcnNpb24ocXVlcnlJZDogc3RyaW5nLCB2ZXJzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5SW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBxdWVyeUlkKTtcbiAgICBcbiAgICBpZiAocXVlcnlJbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3F1ZXJ5SWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF07XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU3MjQ4XHU2NzJDXG4gICAgaWYgKCFxdWVyeS52ZXJzaW9ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3RTVcdThCRTIgJHtxdWVyeUlkfSBcdTZDQTFcdTY3MDlcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgdmVyc2lvbkluZGV4ID0gcXVlcnkudmVyc2lvbnMuZmluZEluZGV4KHYgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICBcbiAgICBpZiAodmVyc2lvbkluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7dmVyc2lvbklkfVx1NzY4NFx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ2ApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTg5ODFcdTZGQzBcdTZEM0JcdTc2ODRcdTcyNDhcdTY3MkNcbiAgICBjb25zdCB2ZXJzaW9uVG9BY3RpdmF0ZSA9IHF1ZXJ5LnZlcnNpb25zW3ZlcnNpb25JbmRleF07XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDXHU1NDhDXHU2N0U1XHU4QkUyXHU3MkI2XHU2MDAxXG4gICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB2ZXJzaW9uVG9BY3RpdmF0ZSxcbiAgICAgIHN0YXR1czogdmVyc2lvblRvQWN0aXZhdGUuc3RhdHVzLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiB2ZXJzaW9uVG9BY3RpdmF0ZTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcXVlcnlTZXJ2aWNlOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9pbnRlZ3JhdGlvbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9pbnRlZ3JhdGlvbi50c1wiOy8qKlxuICogXHU5NkM2XHU2MjEwXHU2NzBEXHU1MkExTW9ja1x1NjU3MFx1NjM2RVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTk2QzZcdTYyMTBBUElcdTc2ODRcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqL1xuXG4vLyBcdTZBMjFcdTYyREZcdTk2QzZcdTYyMTBcbmV4cG9ydCBjb25zdCBtb2NrSW50ZWdyYXRpb25zID0gW1xuICB7XG4gICAgaWQ6ICdpbnRlZ3JhdGlvbi0xJyxcbiAgICBuYW1lOiAnXHU3OTNBXHU0RjhCUkVTVCBBUEknLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU3OTNBXHU0RjhCUkVTVCBBUElcdTY3MERcdTUyQTEnLFxuICAgIHR5cGU6ICdSRVNUJyxcbiAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20vdjEnLFxuICAgIGF1dGhUeXBlOiAnQkFTSUMnLFxuICAgIHVzZXJuYW1lOiAnYXBpX3VzZXInLFxuICAgIHBhc3N3b3JkOiAnKioqKioqKionLFxuICAgIHN0YXR1czogJ0FDVElWRScsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgZW5kcG9pbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtMScsXG4gICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTc1MjhcdTYyMzdcdTUyMTdcdTg4NjgnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXRoOiAnL3VzZXJzJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTYyNDBcdTY3MDlcdTc1MjhcdTYyMzdcdTc2ODRcdTUyMTdcdTg4NjgnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTInLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU3NTI4XHU2MjM3JyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy91c2Vycy97aWR9JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTY4MzlcdTYzNkVJRFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NzUyOFx1NjIzNydcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ludGVncmF0aW9uLTInLFxuICAgIG5hbWU6ICdcdTU5MjlcdTZDMTRBUEknLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1QVBJJyxcbiAgICB0eXBlOiAnUkVTVCcsXG4gICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLndlYXRoZXIuY29tJyxcbiAgICBhdXRoVHlwZTogJ0FQSV9LRVknLFxuICAgIGFwaUtleTogJyoqKioqKioqJyxcbiAgICBzdGF0dXM6ICdBQ1RJVkUnLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNDMyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGVuZHBvaW50czogW1xuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTMnLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU1OTI5XHU2QzE0JyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy9jdXJyZW50JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTYzMDdcdTVCOUFcdTRGNERcdTdGNkVcdTc2ODRcdTVGNTNcdTUyNERcdTU5MjlcdTZDMTQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTQnLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1JyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy9mb3JlY2FzdCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2NzJBXHU2NzY1N1x1NTkyOVx1NzY4NFx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ludGVncmF0aW9uLTMnLFxuICAgIG5hbWU6ICdcdTY1MkZcdTRFRDhcdTdGNTFcdTUxNzMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU2NTJGXHU0RUQ4XHU1OTA0XHU3NDA2QVBJJyxcbiAgICB0eXBlOiAnUkVTVCcsXG4gICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLnBheW1lbnQuY29tJyxcbiAgICBhdXRoVHlwZTogJ09BVVRIMicsXG4gICAgY2xpZW50SWQ6ICdjbGllbnQxMjMnLFxuICAgIGNsaWVudFNlY3JldDogJyoqKioqKioqJyxcbiAgICBzdGF0dXM6ICdJTkFDVElWRScsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBlbmRwb2ludHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC01JyxcbiAgICAgICAgbmFtZTogJ1x1NTIxQlx1NUVGQVx1NjUyRlx1NEVEOCcsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBwYXRoOiAnL3BheW1lbnRzJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTUyMUJcdTVFRkFcdTY1QjBcdTc2ODRcdTY1MkZcdTRFRDhcdThCRjdcdTZDNDInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTYnLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU2NTJGXHU0RUQ4XHU3MkI2XHU2MDAxJyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy9wYXltZW50cy97aWR9JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTY4QzBcdTY3RTVcdTY1MkZcdTRFRDhcdTcyQjZcdTYwMDEnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTcnLFxuICAgICAgICBuYW1lOiAnXHU5MDAwXHU2QjNFJyxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHBhdGg6ICcvcGF5bWVudHMve2lkfS9yZWZ1bmQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTkwNFx1NzQwNlx1OTAwMFx1NkIzRVx1OEJGN1x1NkM0MidcbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG5cbi8vIFx1OTFDRFx1N0Y2RVx1OTZDNlx1NjIxMFx1NjU3MFx1NjM2RVxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SW50ZWdyYXRpb25zKCk6IHZvaWQge1xuICAvLyBcdTRGRERcdTc1NTlcdTVGMTVcdTc1MjhcdUZGMENcdTUzRUFcdTkxQ0RcdTdGNkVcdTUxODVcdTVCQjlcbiAgd2hpbGUgKG1vY2tJbnRlZ3JhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgIG1vY2tJbnRlZ3JhdGlvbnMucG9wKCk7XG4gIH1cbiAgXG4gIC8vIFx1OTFDRFx1NjVCMFx1NzUxRlx1NjIxMFx1OTZDNlx1NjIxMFx1NjU3MFx1NjM2RVxuICBbXG4gICAge1xuICAgICAgaWQ6ICdpbnRlZ3JhdGlvbi0xJyxcbiAgICAgIG5hbWU6ICdcdTc5M0FcdTRGOEJSRVNUIEFQSScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4QlJFU1QgQVBJXHU2NzBEXHU1MkExJyxcbiAgICAgIHR5cGU6ICdSRVNUJyxcbiAgICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS5leGFtcGxlLmNvbS92MScsXG4gICAgICBhdXRoVHlwZTogJ0JBU0lDJyxcbiAgICAgIHVzZXJuYW1lOiAnYXBpX3VzZXInLFxuICAgICAgcGFzc3dvcmQ6ICcqKioqKioqKicsXG4gICAgICBzdGF0dXM6ICdBQ1RJVkUnLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZHBvaW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC0xJyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU3NTI4XHU2MjM3XHU1MjE3XHU4ODY4JyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvdXNlcnMnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MjQwXHU2NzA5XHU3NTI4XHU2MjM3XHU3Njg0XHU1MjE3XHU4ODY4J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC0yJyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU3NTI4XHU2MjM3JyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvdXNlcnMve2lkfScsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTY4MzlcdTYzNkVJRFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NzUyOFx1NjIzNydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdpbnRlZ3JhdGlvbi0yJyxcbiAgICAgIG5hbWU6ICdcdTU5MjlcdTZDMTRBUEknLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTVBUEknLFxuICAgICAgdHlwZTogJ1JFU1QnLFxuICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLndlYXRoZXIuY29tJyxcbiAgICAgIGF1dGhUeXBlOiAnQVBJX0tFWScsXG4gICAgICBhcGlLZXk6ICcqKioqKioqKicsXG4gICAgICBzdGF0dXM6ICdBQ1RJVkUnLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDQzMjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZHBvaW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC0zJyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU1OTI5XHU2QzE0JyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvY3VycmVudCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTYzMDdcdTVCOUFcdTRGNERcdTdGNkVcdTc2ODRcdTVGNTNcdTUyNERcdTU5MjlcdTZDMTQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2VuZHBvaW50LTQnLFxuICAgICAgICAgIG5hbWU6ICdcdTgzQjdcdTUzRDZcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTUnLFxuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgcGF0aDogJy9mb3JlY2FzdCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTgzQjdcdTUzRDZcdTY3MkFcdTY3NjU3XHU1OTI5XHU3Njg0XHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1J1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2ludGVncmF0aW9uLTMnLFxuICAgICAgbmFtZTogJ1x1NjUyRlx1NEVEOFx1N0Y1MVx1NTE3MycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NjUyRlx1NEVEOFx1NTkwNFx1NzQwNkFQSScsXG4gICAgICB0eXBlOiAnUkVTVCcsXG4gICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkucGF5bWVudC5jb20nLFxuICAgICAgYXV0aFR5cGU6ICdPQVVUSDInLFxuICAgICAgY2xpZW50SWQ6ICdjbGllbnQxMjMnLFxuICAgICAgY2xpZW50U2VjcmV0OiAnKioqKioqKionLFxuICAgICAgc3RhdHVzOiAnSU5BQ1RJVkUnLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgZW5kcG9pbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2VuZHBvaW50LTUnLFxuICAgICAgICAgIG5hbWU6ICdcdTUyMUJcdTVFRkFcdTY1MkZcdTRFRDgnLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIHBhdGg6ICcvcGF5bWVudHMnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU1MjFCXHU1RUZBXHU2NUIwXHU3Njg0XHU2NTJGXHU0RUQ4XHU4QkY3XHU2QzQyJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC02JyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU2NTJGXHU0RUQ4XHU3MkI2XHU2MDAxJyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvcGF5bWVudHMve2lkfScsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTY4QzBcdTY3RTVcdTY1MkZcdTRFRDhcdTcyQjZcdTYwMDEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2VuZHBvaW50LTcnLFxuICAgICAgICAgIG5hbWU6ICdcdTkwMDBcdTZCM0UnLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIHBhdGg6ICcvcGF5bWVudHMve2lkfS9yZWZ1bmQnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU1OTA0XHU3NDA2XHU5MDAwXHU2QjNFXHU4QkY3XHU2QzQyJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdLmZvckVhY2goaXRlbSA9PiBtb2NrSW50ZWdyYXRpb25zLnB1c2goaXRlbSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtb2NrSW50ZWdyYXRpb25zOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW50ZWdyYXRpb24udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2ludGVncmF0aW9uLnRzXCI7LyoqXG4gKiBcdTk2QzZcdTYyMTBNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1OTZDNlx1NjIxMFx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IGRlbGF5LCBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsIGNyZWF0ZU1vY2tSZXNwb25zZSwgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHsgbW9ja0ludGVncmF0aW9ucyB9IGZyb20gJy4uL2RhdGEvaW50ZWdyYXRpb24nO1xuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZURlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkZWxheVRpbWUgPSB0eXBlb2YgbW9ja0NvbmZpZy5kZWxheSA9PT0gJ251bWJlcicgPyBtb2NrQ29uZmlnLmRlbGF5IDogMzAwO1xuICByZXR1cm4gZGVsYXkoZGVsYXlUaW1lKTtcbn1cblxuLyoqXG4gKiBcdTk2QzZcdTYyMTBcdTY3MERcdTUyQTFcbiAqL1xuY29uc3QgaW50ZWdyYXRpb25TZXJ2aWNlID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU5NkM2XHU2MjEwXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRJbnRlZ3JhdGlvbnMocGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICAgIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU4RkM3XHU2RUU0XG4gICAgbGV0IGZpbHRlcmVkSXRlbXMgPSBbLi4ubW9ja0ludGVncmF0aW9uc107XG4gICAgXG4gICAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiBcbiAgICAgICAgaS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAgIChpLmRlc2NyaXB0aW9uICYmIGkuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1N0M3Qlx1NTc4Qlx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LnR5cGUpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihpID0+IGkudHlwZSA9PT0gcGFyYW1zLnR5cGUpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihpID0+IGkuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IGZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmlsdGVyZWRJdGVtcy5sZW5ndGggLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU5NkM2XHU2MjEwXG4gICAqL1xuICBhc3luYyBnZXRJbnRlZ3JhdGlvbihpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW50ZWdyYXRpb24gPSBtb2NrSW50ZWdyYXRpb25zLmZpbmQoaSA9PiBpLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFpbnRlZ3JhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU5NkM2XHU2MjEwYCk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBpbnRlZ3JhdGlvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMUJcdTVFRkFcdTk2QzZcdTYyMTBcbiAgICovXG4gIGFzeW5jIGNyZWF0ZUludGVncmF0aW9uKGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IG5ld0lkID0gYGludGVncmF0aW9uLSR7RGF0ZS5ub3coKX1gO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICBjb25zdCBuZXdJbnRlZ3JhdGlvbiA9IHtcbiAgICAgIGlkOiBuZXdJZCxcbiAgICAgIG5hbWU6IGRhdGEubmFtZSB8fCAnXHU2NUIwXHU5NkM2XHU2MjEwJyxcbiAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgICAgdHlwZTogZGF0YS50eXBlIHx8ICdSRVNUJyxcbiAgICAgIGJhc2VVcmw6IGRhdGEuYmFzZVVybCB8fCAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20nLFxuICAgICAgYXV0aFR5cGU6IGRhdGEuYXV0aFR5cGUgfHwgJ05PTkUnLFxuICAgICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICBlbmRwb2ludHM6IGRhdGEuZW5kcG9pbnRzIHx8IFtdXG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY4MzlcdTYzNkVcdThCQTRcdThCQzFcdTdDN0JcdTU3OEJcdTZERkJcdTUyQTBcdTc2RjhcdTVFOTRcdTVCNTdcdTZCQjVcbiAgICBpZiAoZGF0YS5hdXRoVHlwZSA9PT0gJ0JBU0lDJykge1xuICAgICAgT2JqZWN0LmFzc2lnbihuZXdJbnRlZ3JhdGlvbiwge1xuICAgICAgICB1c2VybmFtZTogZGF0YS51c2VybmFtZSB8fCAndXNlcicsXG4gICAgICAgIHBhc3N3b3JkOiBkYXRhLnBhc3N3b3JkIHx8ICcqKioqKioqKidcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5hdXRoVHlwZSA9PT0gJ0FQSV9LRVknKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG5ld0ludGVncmF0aW9uLCB7XG4gICAgICAgIGFwaUtleTogZGF0YS5hcGlLZXkgfHwgJyoqKioqKioqJ1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmF1dGhUeXBlID09PSAnT0FVVEgyJykge1xuICAgICAgT2JqZWN0LmFzc2lnbihuZXdJbnRlZ3JhdGlvbiwge1xuICAgICAgICBjbGllbnRJZDogZGF0YS5jbGllbnRJZCB8fCAnY2xpZW50JyxcbiAgICAgICAgY2xpZW50U2VjcmV0OiBkYXRhLmNsaWVudFNlY3JldCB8fCAnKioqKioqKionXG4gICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gICAgbW9ja0ludGVncmF0aW9ucy5wdXNoKG5ld0ludGVncmF0aW9uKTtcbiAgICBcbiAgICByZXR1cm4gbmV3SW50ZWdyYXRpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU5NkM2XHU2MjEwXG4gICAqL1xuICBhc3luYyB1cGRhdGVJbnRlZ3JhdGlvbihpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBpbmRleCA9IG1vY2tJbnRlZ3JhdGlvbnMuZmluZEluZGV4KGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1OTZDNlx1NjIxMGApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcbiAgICBjb25zdCB1cGRhdGVkSW50ZWdyYXRpb24gPSB7XG4gICAgICAuLi5tb2NrSW50ZWdyYXRpb25zW2luZGV4XSxcbiAgICAgIC4uLmRhdGEsXG4gICAgICBpZCwgLy8gXHU3ODZFXHU0RkRESURcdTRFMERcdTUzRDhcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAgICBtb2NrSW50ZWdyYXRpb25zW2luZGV4XSA9IHVwZGF0ZWRJbnRlZ3JhdGlvbjtcbiAgICBcbiAgICByZXR1cm4gdXBkYXRlZEludGVncmF0aW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgZGVsZXRlSW50ZWdyYXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBpbmRleCA9IG1vY2tJbnRlZ3JhdGlvbnMuZmluZEluZGV4KGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1OTZDNlx1NjIxMGApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTRFQ0VcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTRFMkRcdTUyMjBcdTk2NjRcbiAgICBtb2NrSW50ZWdyYXRpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2RDRCXHU4QkQ1XHU5NkM2XHU2MjEwXG4gICAqL1xuICBhc3luYyB0ZXN0SW50ZWdyYXRpb24oaWQ6IHN0cmluZywgcGFyYW1zOiBhbnkgPSB7fSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IGludGVncmF0aW9uID0gbW9ja0ludGVncmF0aW9ucy5maW5kKGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghaW50ZWdyYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1OTZDNlx1NjIxMGApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTZBMjFcdTYyREZcdTZENEJcdThCRDVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIHJlc3VsdFR5cGU6ICdKU09OJyxcbiAgICAgIGpzb25SZXNwb25zZToge1xuICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogJ1x1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICBkZXRhaWxzOiB7XG4gICAgICAgICAgcmVzcG9uc2VUaW1lOiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDApICsgNTAsXG4gICAgICAgICAgc2VydmVySW5mbzogJ01vY2sgU2VydmVyIHYxLjAnLFxuICAgICAgICAgIGVuZHBvaW50OiBwYXJhbXMuZW5kcG9pbnQgfHwgaW50ZWdyYXRpb24uZW5kcG9pbnRzWzBdPy5wYXRoIHx8ICcvJ1xuICAgICAgICB9LFxuICAgICAgICBkYXRhOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAzIH0sIChfLCBpKSA9PiAoe1xuICAgICAgICAgIGlkOiBpICsgMSxcbiAgICAgICAgICBuYW1lOiBgXHU2ODM3XHU2NzJDXHU2NTcwXHU2MzZFICR7aSArIDF9YCxcbiAgICAgICAgICB2YWx1ZTogTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMCkgLyAxMFxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjI2N1x1ODg0Q1x1OTZDNlx1NjIxMFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZVF1ZXJ5KGlkOiBzdHJpbmcsIHBhcmFtczogYW55ID0ge30pOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG1vY2tJbnRlZ3JhdGlvbnMuZmluZChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIWludGVncmF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU2QTIxXHU2MkRGXHU2MjY3XHU4ODRDXHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICByZXN1bHRUeXBlOiAnSlNPTicsXG4gICAgICBqc29uUmVzcG9uc2U6IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICBxdWVyeTogcGFyYW1zLnF1ZXJ5IHx8ICdcdTlFRDhcdThCQTRcdTY3RTVcdThCRTInLFxuICAgICAgICBkYXRhOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiA1IH0sIChfLCBpKSA9PiAoe1xuICAgICAgICAgIGlkOiBgcmVjb3JkLSR7aSArIDF9YCxcbiAgICAgICAgICBuYW1lOiBgXHU4QkIwXHU1RjU1ICR7aSArIDF9YCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NjdFNVx1OEJFMlx1OEZENFx1NTZERVx1NzY4NFx1OEJCMFx1NUY1NSAke2kgKyAxfWAsXG4gICAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IGkgJSAyID09PSAwID8gJ0EnIDogJ0InLFxuICAgICAgICAgICAgdmFsdWU6IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMCksXG4gICAgICAgICAgICBhY3RpdmU6IGkgJSAzICE9PSAwXG4gICAgICAgICAgfVxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbnRlZ3JhdGlvblNlcnZpY2U7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTk2QzZcdTRFMkRcdTVCRkNcdTUxRkFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0QVBJIE1vY2tcdTY3MERcdTUyQTFcdTUxNjVcdTUzRTNcdTcwQjlcbiAqL1xuXG4vLyBcdTVCRkNcdTUxNjVcdTY1NzBcdTYzNkVcdTZFOTBcdTY3MERcdTUyQTFcbmltcG9ydCBkYXRhU291cmNlIGZyb20gJy4vZGF0YXNvdXJjZSc7XG4vLyBcdTVCRkNcdTUxNjVcdTVCOENcdTY1NzRcdTc2ODRcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFcdTVCOUVcdTczQjBcbmltcG9ydCBxdWVyeVNlcnZpY2VJbXBsZW1lbnRhdGlvbiBmcm9tICcuL3F1ZXJ5Jztcbi8vIFx1NUJGQ1x1NTE2NVx1OTZDNlx1NjIxMFx1NjcwRFx1NTJBMVxuaW1wb3J0IGludGVncmF0aW9uU2VydmljZUltcGxlbWVudGF0aW9uIGZyb20gJy4vaW50ZWdyYXRpb24nO1xuXG4vLyBcdTVCRkNcdTUxNjVcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbmltcG9ydCB7IFxuICBjcmVhdGVNb2NrUmVzcG9uc2UsIFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSwgXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXkgXG59IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMU1vY2tcbiAqIEBkZXByZWNhdGVkIFx1NEY3Rlx1NzUyOFx1NEVDRSAnLi9xdWVyeScgXHU1QkZDXHU1MTY1XHU3Njg0XHU1QjhDXHU2NTc0XHU1QjlFXHU3M0IwXHU0RUUzXHU2NkZGXG4gKi9cbmNvbnN0IHF1ZXJ5ID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyaWVzKHBhcmFtczogeyBwYWdlOiBudW1iZXI7IHNpemU6IG51bWJlcjsgfSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSh7XG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGlkOiAncTEnLCBuYW1lOiAnXHU3NTI4XHU2MjM3XHU1MjA2XHU2NzkwXHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTU3MzBcdTUzM0FcdTdFREZcdThCQTFcdTc1MjhcdTYyMzdcdTZDRThcdTUxOENcdTY1NzBcdTYzNkUnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTInLCBuYW1lOiAnXHU5NTAwXHU1NTJFXHU0RTFBXHU3RUU5XHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTY3MDhcdTdFREZcdThCQTFcdTk1MDBcdTU1MkVcdTk4OUQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTMnLCBuYW1lOiAnXHU1RTkzXHU1QjU4XHU1MjA2XHU2NzkwJywgZGVzY3JpcHRpb246ICdcdTc2RDFcdTYzQTdcdTVFOTNcdTVCNThcdTZDMzRcdTVFNzMnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgXSxcbiAgICAgIHRvdGFsOiAzLFxuICAgICAgcGFnZTogcGFyYW1zLnBhZ2UsXG4gICAgICBzaXplOiBwYXJhbXMuc2l6ZVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5KGlkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6ICdcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgc3FsOiAnU0VMRUNUICogRlJPTSB1c2VycyBXSEVSRSBzdGF0dXMgPSAkMScsXG4gICAgICBwYXJhbWV0ZXJzOiBbJ2FjdGl2ZSddLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnkoZGF0YTogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBxdWVyeS0ke0RhdGUubm93KCl9YCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyB1cGRhdGVRdWVyeShpZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlUXVlcnkoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnM6IFsnaWQnLCAnbmFtZScsICdlbWFpbCcsICdzdGF0dXMnXSxcbiAgICAgIHJvd3M6IFtcbiAgICAgICAgeyBpZDogMSwgbmFtZTogJ1x1NUYyMFx1NEUwOScsIGVtYWlsOiAnemhhbmdAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIG5hbWU6ICdcdTY3NEVcdTU2REInLCBlbWFpbDogJ2xpQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICAgICAgICB7IGlkOiAzLCBuYW1lOiAnXHU3MzhCXHU0RTk0JywgZW1haWw6ICd3YW5nQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnaW5hY3RpdmUnIH0sXG4gICAgICBdLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgZXhlY3V0aW9uVGltZTogMC4yMzUsXG4gICAgICAgIHJvd0NvdW50OiAzLFxuICAgICAgICB0b3RhbFBhZ2VzOiAxXG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcblxuLyoqXG4gKiBcdTVCRkNcdTUxRkFcdTYyNDBcdTY3MDlcdTY3MERcdTUyQTFcbiAqL1xuY29uc3Qgc2VydmljZXMgPSB7XG4gIGRhdGFTb3VyY2UsXG4gIHF1ZXJ5OiBxdWVyeVNlcnZpY2VJbXBsZW1lbnRhdGlvbixcbiAgaW50ZWdyYXRpb246IGludGVncmF0aW9uU2VydmljZUltcGxlbWVudGF0aW9uXG59O1xuXG4vLyBcdTVCRkNcdTUxRkFtb2NrIHNlcnZpY2VcdTVERTVcdTUxNzdcbmV4cG9ydCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NTQwNFx1NEUyQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGNvbnN0IGRhdGFTb3VyY2VTZXJ2aWNlID0gc2VydmljZXMuZGF0YVNvdXJjZTtcbmV4cG9ydCBjb25zdCBxdWVyeVNlcnZpY2UgPSBzZXJ2aWNlcy5xdWVyeTtcbmV4cG9ydCBjb25zdCBpbnRlZ3JhdGlvblNlcnZpY2UgPSBzZXJ2aWNlcy5pbnRlZ3JhdGlvbjtcblxuLy8gXHU5RUQ4XHU4QkE0XHU1QkZDXHU1MUZBXHU2MjQwXHU2NzA5XHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCBzZXJ2aWNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZS50c1wiO2ltcG9ydCB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCAqIGFzIGh0dHAgZnJvbSAnaHR0cCc7XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU0RTAwXHU0RTJBXHU3QjgwXHU1MzU1XHU3Njg0XHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XG4gKiBcdTUzRUFcdTU5MDRcdTc0MDYvYXBpL3Rlc3RcdThERUZcdTVGODRcdUZGMENcdTc1MjhcdTRFOEVcdTZENEJcdThCRDVNb2NrXHU3Q0ZCXHU3RURGXHU2NjJGXHU1NDI2XHU2QjYzXHU1RTM4XHU1REU1XHU0RjVDXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlKCkge1xuICBjb25zb2xlLmxvZygnW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1REYyXHU1MjFCXHU1RUZBXHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU1QzA2XHU1OTA0XHU3NDA2L2FwaS90ZXN0XHU4REVGXHU1Rjg0XHU3Njg0XHU4QkY3XHU2QzQyJyk7XG4gIFxuICByZXR1cm4gZnVuY3Rpb24gc2ltcGxlTWlkZGxld2FyZShcbiAgICByZXE6IGh0dHAuSW5jb21pbmdNZXNzYWdlLFxuICAgIHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSxcbiAgICBuZXh0OiBDb25uZWN0Lk5leHRGdW5jdGlvblxuICApIHtcbiAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2QgfHwgJ1VOS05PV04nO1xuICAgIFxuICAgIC8vIFx1NTNFQVx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFxuICAgIGlmICh1cmwgPT09ICcvYXBpL3Rlc3QnKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU2NTM2XHU1MjMwXHU2RDRCXHU4QkQ1XHU4QkY3XHU2QzQyOiAke21ldGhvZH0gJHt1cmx9YCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFx1OEJCRVx1N0Y2RUNPUlNcdTU5MzRcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uJyk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmIChtZXRob2QgPT09ICdPUFRJT05TJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyJyk7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU3ODZFXHU0RkREXHU4OTg2XHU3NkQ2XHU2Mzg5XHU2MjQwXHU2NzA5XHU1REYyXHU2NzA5XHU3Njg0Q29udGVudC1UeXBlXHVGRjBDXHU5MDdGXHU1MTREXHU4OEFCXHU1NDBFXHU3RUVEXHU0RTJEXHU5NUY0XHU0RUY2XHU2NkY0XHU2NTM5XG4gICAgICAgIHJlcy5yZW1vdmVIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTFDNlx1NTkwN1x1NTRDRFx1NUU5NFx1NjU3MFx1NjM2RVxuICAgICAgICBjb25zdCByZXNwb25zZURhdGEgPSB7XG4gICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiAnXHU3QjgwXHU1MzU1XHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XHU1NENEXHU1RTk0XHU2MjEwXHU1MjlGJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMsXG4gICAgICAgICAgICBwYXJhbXM6IHVybC5pbmNsdWRlcygnPycpID8gdXJsLnNwbGl0KCc/JylbMV0gOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1M0QxXHU5MDAxXHU1NENEXHU1RTk0XHU1MjREXHU3ODZFXHU0RkREXHU0RTJEXHU2NUFEXHU4QkY3XHU2QzQyXHU5NEZFXG4gICAgICAgIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTUzRDFcdTkwMDFcdTZENEJcdThCRDVcdTU0Q0RcdTVFOTQnKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwb25zZURhdGEsIG51bGwsIDIpKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NEUwRFx1OEMwM1x1NzUyOG5leHQoKVx1RkYwQ1x1Nzg2RVx1NEZERFx1OEJGN1x1NkM0Mlx1NTIzMFx1NkI2NFx1N0VEM1x1Njc1RlxuICAgICAgICByZXR1cm47XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTk1MTlcdThCRUZcbiAgICAgICAgY29uc29sZS5lcnJvcignW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU2NUY2XHU1MUZBXHU5NTE5OicsIGVycm9yKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NkUwNVx1OTY2NFx1NURGMlx1NjcwOVx1NzY4NFx1NTkzNFx1RkYwQ1x1OTA3Rlx1NTE0RENvbnRlbnQtVHlwZVx1ODhBQlx1NjZGNFx1NjUzOVxuICAgICAgICByZXMucmVtb3ZlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTY1RjZcdTUxRkFcdTk1MTknLFxuICAgICAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcilcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU0RTBEXHU4QzAzXHU3NTI4bmV4dCgpXHVGRjBDXHU3ODZFXHU0RkREXHU4QkY3XHU2QzQyXHU1MjMwXHU2QjY0XHU3RUQzXHU2NzVGXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU0RTBEXHU1OTA0XHU3NDA2XHU3Njg0XHU4QkY3XHU2QzQyXHU0RUE0XHU3RUQ5XHU0RTBCXHU0RTAwXHU0RTJBXHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgbmV4dCgpO1xuICB9O1xufSAiXSwKICAibWFwcGluZ3MiOiAiO0FBQTBZLFNBQVMsY0FBYyxlQUFnQztBQUNqYyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZ0JBQWdCO0FBQ3pCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCOzs7QUNJekIsU0FBUyxhQUFhOzs7QUNGZixTQUFTLFlBQXFCO0FBQ25DLE1BQUk7QUFFRixRQUFJLE9BQU8sWUFBWSxlQUFlLFFBQVEsS0FBSztBQUNqRCxVQUFJLFFBQVEsSUFBSSxzQkFBc0IsUUFBUTtBQUM1QyxlQUFPO0FBQUEsTUFDVDtBQUNBLFVBQUksUUFBUSxJQUFJLHNCQUFzQixTQUFTO0FBQzdDLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFFBQUksT0FBTyxnQkFBZ0IsZUFBZSxZQUFZLEtBQUs7QUFDekQsVUFBSSxZQUFZLElBQUksc0JBQXNCLFFBQVE7QUFDaEQsZUFBTztBQUFBLE1BQ1Q7QUFDQSxVQUFJLFlBQVksSUFBSSxzQkFBc0IsU0FBUztBQUNqRCxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFHQSxRQUFJLE9BQU8sV0FBVyxlQUFlLE9BQU8sY0FBYztBQUN4RCxZQUFNLG9CQUFvQixhQUFhLFFBQVEsY0FBYztBQUM3RCxVQUFJLHNCQUFzQixRQUFRO0FBQ2hDLGVBQU87QUFBQSxNQUNUO0FBQ0EsVUFBSSxzQkFBc0IsU0FBUztBQUNqQyxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFHQSxVQUFNLGdCQUNILE9BQU8sWUFBWSxlQUFlLFFBQVEsT0FBTyxRQUFRLElBQUksYUFBYSxpQkFDMUUsT0FBTyxnQkFBZ0IsZUFBZSxZQUFZLE9BQU8sWUFBWSxJQUFJLFFBQVE7QUFFcEYsV0FBTztBQUFBLEVBQ1QsU0FBUyxPQUFPO0FBRWQsWUFBUSxLQUFLLHlHQUE4QixLQUFLO0FBQ2hELFdB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
