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
      console.log("[Mock] \u8FD4\u56DE\u67E5\u8BE2\u5217\u8868\u6570\u636E\u683C\u5F0F:", {
        data: `Array[${result.items.length}]`,
        pagination: result.pagination,
        success: true
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
  if (urlPath.match(/^\/api\/queries\/query-\d+\/execute$/) && method === "POST") {
    const id = urlPath.split("/")[3] || "";
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42(\u67E5\u8BE2ID\u683C\u5F0F): ${urlPath}, \u67E5\u8BE2ID: ${id}`);
    try {
      const body = await parseRequestBody(req);
      const numericId = id.replace("query-", "");
      const result = await queryService2.executeQuery(numericId, body);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50cyIsICJzcmMvbW9jay9jb25maWcudHMiLCAic3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHMiLCAic3JjL21vY2svc2VydmljZXMvdXRpbHMudHMiLCAic3JjL21vY2svc2VydmljZXMvcXVlcnkudHMiLCAic3JjL21vY2svZGF0YS9pbnRlZ3JhdGlvbi50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9pbnRlZ3JhdGlvbi50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50cyIsICJzcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiwgUGx1Z2luLCBDb25uZWN0IH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcydcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJ1xuaW1wb3J0IGNyZWF0ZU1vY2tNaWRkbGV3YXJlIGZyb20gJy4vc3JjL21vY2svbWlkZGxld2FyZSdcbmltcG9ydCB7IGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUgfSBmcm9tICcuL3NyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHsgU2VydmVyUmVzcG9uc2UgfSBmcm9tICdodHRwJ1xuXG4vLyBcdTVGM0FcdTUyMzZcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTNcdTUxRkRcdTY1NzBcbmZ1bmN0aW9uIGtpbGxQb3J0KHBvcnQ6IG51bWJlcikge1xuICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjhDMFx1NjdFNVx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NTM2MFx1NzUyOFx1NjBDNVx1NTFCNWApO1xuICB0cnkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBleGVjU3luYyhgbmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fWApO1xuICAgICAgZXhlY1N5bmMoYHRhc2traWxsIC9GIC9waWQgJChuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9IHwgYXdrICd7cHJpbnQgJDV9JylgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4ZWNTeW5jKGBsc29mIC1pIDoke3BvcnR9IC10IHwgeGFyZ3Mga2lsbCAtOWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTMgJHtwb3J0fWApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTY3MkFcdTg4QUJcdTUzNjBcdTc1MjhcdTYyMTZcdTY1RTBcdTZDRDVcdTkxQ0FcdTY1M0VgKTtcbiAgfVxufVxuXG4vLyBcdTVGM0FcdTUyMzZcdTZFMDVcdTc0MDZWaXRlXHU3RjEzXHU1QjU4XG5mdW5jdGlvbiBjbGVhblZpdGVDYWNoZSgpIHtcbiAgY29uc29sZS5sb2coJ1tWaXRlXSBcdTZFMDVcdTc0MDZcdTRGOURcdThENTZcdTdGMTNcdTVCNTgnKTtcbiAgY29uc3QgY2FjaGVQYXRocyA9IFtcbiAgICAnLi9ub2RlX21vZHVsZXMvLnZpdGUnLFxuICAgICcuL25vZGVfbW9kdWxlcy8udml0ZV8qJyxcbiAgICAnLi8udml0ZScsXG4gICAgJy4vZGlzdCcsXG4gICAgJy4vdG1wJyxcbiAgICAnLi8udGVtcCdcbiAgXTtcbiAgXG4gIGNhY2hlUGF0aHMuZm9yRWFjaChjYWNoZVBhdGggPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhjYWNoZVBhdGgpKSB7XG4gICAgICAgIGlmIChmcy5sc3RhdFN5bmMoY2FjaGVQYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgZXhlY1N5bmMoYHJtIC1yZiAke2NhY2hlUGF0aH1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy51bmxpbmtTeW5jKGNhY2hlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTUyMjBcdTk2NjQ6ICR7Y2FjaGVQYXRofWApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2NUUwXHU2Q0Q1XHU1MjIwXHU5NjY0OiAke2NhY2hlUGF0aH1gLCBlKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBcdTZFMDVcdTc0MDZWaXRlXHU3RjEzXHU1QjU4XG5jbGVhblZpdGVDYWNoZSgpO1xuXG4vLyBcdTVDMURcdThCRDVcdTkxQ0FcdTY1M0VcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTdBRUZcdTUzRTNcbmtpbGxQb3J0KDgwODApO1xuXG4vLyBcdTUyMUJcdTVFRkFNb2NrIEFQSVx1NjNEMlx1NEVGNlxuZnVuY3Rpb24gY3JlYXRlTW9ja0FwaVBsdWdpbih1c2VNb2NrOiBib29sZWFuLCB1c2VTaW1wbGVNb2NrOiBib29sZWFuKTogUGx1Z2luIHwgbnVsbCB7XG4gIGlmICghdXNlTW9jayAmJiAhdXNlU2ltcGxlTW9jaykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIFxuICAvLyBcdTUyQTBcdThGN0RcdTRFMkRcdTk1RjRcdTRFRjZcbiAgY29uc3QgbW9ja01pZGRsZXdhcmUgPSB1c2VNb2NrID8gY3JlYXRlTW9ja01pZGRsZXdhcmUoKSA6IG51bGw7XG4gIGNvbnN0IHNpbXBsZU1pZGRsZXdhcmUgPSB1c2VTaW1wbGVNb2NrID8gY3JlYXRlU2ltcGxlTWlkZGxld2FyZSgpIDogbnVsbDtcbiAgXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZpdGUtcGx1Z2luLW1vY2stYXBpJyxcbiAgICAvLyBcdTUxNzNcdTk1MkVcdTcwQjlcdUZGMUFcdTRGN0ZcdTc1MjggcHJlIFx1Nzg2RVx1NEZERFx1NkI2NFx1NjNEMlx1NEVGNlx1NTE0OFx1NEU4RVx1NTE4NVx1N0Y2RVx1NjNEMlx1NEVGNlx1NjI2N1x1ODg0Q1xuICAgIGVuZm9yY2U6ICdwcmUnIGFzIGNvbnN0LFxuICAgIC8vIFx1NTcyOFx1NjcwRFx1NTJBMVx1NTY2OFx1NTIxQlx1NUVGQVx1NEU0Qlx1NTI0RFx1OTE0RFx1N0Y2RVxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIC8vIFx1NjZGRlx1NjM2Mlx1NTM5Rlx1NTlDQlx1OEJGN1x1NkM0Mlx1NTkwNFx1NzQwNlx1NTY2OFx1RkYwQ1x1NEY3Rlx1NjIxMVx1NEVFQ1x1NzY4NFx1NEUyRFx1OTVGNFx1NEVGNlx1NTE3N1x1NjcwOVx1NjcwMFx1OUFEOFx1NEYxOFx1NTE0OFx1N0VBN1xuICAgICAgY29uc3Qgb3JpZ2luYWxIYW5kbGVyID0gc2VydmVyLm1pZGRsZXdhcmVzLmhhbmRsZTtcbiAgICAgIFxuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLmhhbmRsZSA9IGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTUzRUFcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTY4QzBcdTZENEJcdTUyMzBBUElcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHt1cmx9YCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU0RjE4XHU1MTQ4XHU1OTA0XHU3NDA2XHU3Mjc5XHU1QjlBXHU2RDRCXHU4QkQ1QVBJXG4gICAgICAgICAgaWYgKHVzZVNpbXBsZU1vY2sgJiYgc2ltcGxlTWlkZGxld2FyZSAmJiB1cmwuc3RhcnRzV2l0aCgnL2FwaS90ZXN0JykpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU0RjdGXHU3NTI4XHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2OiAke3VybH1gKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU4QkJFXHU3RjZFXHU0RTAwXHU0RTJBXHU2ODA3XHU4QkIwXHVGRjBDXHU5NjMyXHU2QjYyXHU1MTc2XHU0RUQ2XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyXG4gICAgICAgICAgICAocmVxIGFzIGFueSkuX21vY2tIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHNpbXBsZU1pZGRsZXdhcmUocmVxLCByZXMsIChlcnI/OiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW01vY2tcdTYzRDJcdTRFRjZdIFx1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NTFGQVx1OTUxOTpgLCBlcnIpO1xuICAgICAgICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghKHJlcyBhcyBTZXJ2ZXJSZXNwb25zZSkud3JpdGFibGVFbmRlZCkge1xuICAgICAgICAgICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NTRDRFx1NUU5NFx1NkNBMVx1NjcwOVx1N0VEM1x1Njc1Rlx1RkYwQ1x1N0VFN1x1N0VFRFx1NTkwNFx1NzQwNlxuICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1NTkwNFx1NzQwNlx1NTE3Nlx1NEVENkFQSVx1OEJGN1x1NkM0MlxuICAgICAgICAgIGlmICh1c2VNb2NrICYmIG1vY2tNaWRkbGV3YXJlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTYzRDJcdTRFRjZdIFx1NEY3Rlx1NzUyOE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDY6ICR7dXJsfWApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdThCQkVcdTdGNkVcdTRFMDBcdTRFMkFcdTY4MDdcdThCQjBcdUZGMENcdTk2MzJcdTZCNjJcdTUxNzZcdTRFRDZcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTZCNjRcdThCRjdcdTZDNDJcbiAgICAgICAgICAgIChyZXEgYXMgYW55KS5fbW9ja0hhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gbW9ja01pZGRsZXdhcmUocmVxLCByZXMsIChlcnI/OiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW01vY2tcdTYzRDJcdTRFRjZdIE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTUxRkFcdTk1MTk6YCwgZXJyKTtcbiAgICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIShyZXMgYXMgU2VydmVyUmVzcG9uc2UpLndyaXRhYmxlRW5kZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTU0Q0RcdTVFOTRcdTZDQTFcdTY3MDlcdTdFRDNcdTY3NUZcdUZGMENcdTdFRTdcdTdFRURcdTU5MDRcdTc0MDZcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gXHU1QkY5XHU0RThFXHU5NzVFQVBJXHU4QkY3XHU2QzQyXHVGRjBDXHU0RjdGXHU3NTI4XHU1MzlGXHU1OUNCXHU1OTA0XHU3NDA2XHU1NjY4XG4gICAgICAgIHJldHVybiBvcmlnaW5hbEhhbmRsZXIuY2FsbChzZXJ2ZXIubWlkZGxld2FyZXMsIHJlcSwgcmVzLCBuZXh0KTtcbiAgICAgIH07XG4gICAgfVxuICB9O1xufVxuXG4vLyBcdTU3RkFcdTY3MkNcdTkxNERcdTdGNkVcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHU1MkEwXHU4RjdEXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG4gIHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID0gcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgfHwgJ2ZhbHNlJztcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrIEFQSSAtIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1OEJGQlx1NTNENlxuICBjb25zdCB1c2VNb2NrQXBpID0gcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJztcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1Nzk4MVx1NzUyOEhNUiAtIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1OEJGQlx1NTNENlxuICBjb25zdCBkaXNhYmxlSG1yID0gcHJvY2Vzcy5lbnYuVklURV9ESVNBQkxFX0hNUiA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU0RjdGXHU3NTI4XHU3QjgwXHU1MzU1XHU2RDRCXHU4QkQ1XHU2QTIxXHU2MkRGQVBJXG4gIGNvbnN0IHVzZVNpbXBsZU1vY2sgPSB0cnVlO1xuICBcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdThGRDBcdTg4NENcdTZBMjFcdTVGMEY6ICR7bW9kZX1gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBNb2NrIEFQSTogJHt1c2VNb2NrQXBpID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdTdCODBcdTUzNTVNb2NrXHU2RDRCXHU4QkQ1OiAke3VzZVNpbXBsZU1vY2sgPyAnXHU1NDJGXHU3NTI4JyA6ICdcdTc5ODFcdTc1MjgnfWApO1xuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIEhNUjogJHtkaXNhYmxlSG1yID8gJ1x1Nzk4MVx1NzUyOCcgOiAnXHU1NDJGXHU3NTI4J31gKTtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQU1vY2tcdTYzRDJcdTRFRjZcbiAgY29uc3QgbW9ja1BsdWdpbiA9IGNyZWF0ZU1vY2tBcGlQbHVnaW4odXNlTW9ja0FwaSwgdXNlU2ltcGxlTW9jayk7XG4gIFxuICAvLyBcdTkxNERcdTdGNkVcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAvLyBcdTZERkJcdTUyQTBNb2NrXHU2M0QyXHU0RUY2XHVGRjA4XHU1OTgyXHU2NzlDXHU1NDJGXHU3NTI4XHVGRjA5XG4gICAgICAuLi4obW9ja1BsdWdpbiA/IFttb2NrUGx1Z2luXSA6IFtdKSxcbiAgICAgIHZ1ZSgpLFxuICAgIF0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICAvLyBITVJcdTkxNERcdTdGNkVcbiAgICAgIGhtcjogZGlzYWJsZUhtciA/IGZhbHNlIDoge1xuICAgICAgICBwcm90b2NvbDogJ3dzJyxcbiAgICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICAgIHBvcnQ6IDgwODAsXG4gICAgICAgIGNsaWVudFBvcnQ6IDgwODAsXG4gICAgICB9LFxuICAgICAgLy8gXHU3OTgxXHU3NTI4XHU0RUUzXHU3NDA2XHVGRjBDXHU4QkE5XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU2MjQwXHU2NzA5XHU4QkY3XHU2QzQyXG4gICAgICBwcm94eToge31cbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MsIGF1dG9wcmVmaXhlcl0sXG4gICAgICB9LFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIC8vIFx1NTMwNVx1NTQyQlx1NTdGQVx1NjcyQ1x1NEY5RFx1OEQ1NlxuICAgICAgaW5jbHVkZTogW1xuICAgICAgICAndnVlJywgXG4gICAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICAgJ3BpbmlhJyxcbiAgICAgICAgJ2F4aW9zJyxcbiAgICAgICAgJ2RheWpzJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlL2VzL2xvY2FsZS96aF9DTidcbiAgICAgIF0sXG4gICAgICAvLyBcdTYzOTJcdTk2NjRcdTcyNzlcdTVCOUFcdTRGOURcdThENTZcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgLy8gXHU2MzkyXHU5NjY0XHU2M0QyXHU0RUY2XHU0RTJEXHU3Njg0XHU2NzBEXHU1MkExXHU1NjY4TW9ja1xuICAgICAgICAnc3JjL3BsdWdpbnMvc2VydmVyTW9jay50cycsXG4gICAgICAgIC8vIFx1NjM5Mlx1OTY2NGZzZXZlbnRzXHU2NzJDXHU1NzMwXHU2QTIxXHU1NzU3XHVGRjBDXHU5MDdGXHU1MTREXHU2Nzg0XHU1RUZBXHU5NTE5XHU4QkVGXG4gICAgICAgICdmc2V2ZW50cydcbiAgICAgIF0sXG4gICAgICAvLyBcdTc4NkVcdTRGRERcdTRGOURcdThENTZcdTk4ODRcdTY3ODRcdTVFRkFcdTZCNjNcdTc4NkVcdTVCOENcdTYyMTBcbiAgICAgIGZvcmNlOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gXHU0RjdGXHU3NTI4XHU1MzU1XHU3MkVDXHU3Njg0XHU3RjEzXHU1QjU4XHU3NkVFXHU1RjU1XG4gICAgY2FjaGVEaXI6ICdub2RlX21vZHVsZXMvLnZpdGVfY2FjaGUnLFxuICAgIC8vIFx1OTYzMlx1NkI2Mlx1NTgwNlx1NjgwOFx1NkVBMlx1NTFGQVxuICAgIGVzYnVpbGQ6IHtcbiAgICAgIGxvZ092ZXJyaWRlOiB7XG4gICAgICAgICd0aGlzLWlzLXVuZGVmaW5lZC1pbi1lc20nOiAnc2lsZW50J1xuICAgICAgfSxcbiAgICB9XG4gIH1cbn0pOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzXCI7LyoqXG4gKiBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU3QkExXHU3NDA2XHU2QTIxXHU1NzU3XG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1N0VERlx1NEUwMFx1NzY4NEhUVFBcdThCRjdcdTZDNDJcdTYyRTZcdTYyMkFcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTc1MjhcdTRFOEVcdTZBMjFcdTYyREZBUElcdTU0Q0RcdTVFOTRcbiAqIFx1OEQxRlx1OEQyM1x1N0JBMVx1NzQwNlx1NTQ4Q1x1NTIwNlx1NTNEMVx1NjI0MFx1NjcwOUFQSVx1OEJGN1x1NkM0Mlx1NTIzMFx1NUJGOVx1NUU5NFx1NzY4NFx1NjcwRFx1NTJBMVx1NTkwNFx1NzQwNlx1NTFGRFx1NjU3MFxuICovXG5cbmltcG9ydCB0eXBlIHsgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgSW5jb21pbmdNZXNzYWdlLCBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gJ2h0dHAnO1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICd1cmwnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZywgc2hvdWxkTW9ja1JlcXVlc3QsIGxvZ01vY2sgfSBmcm9tICcuLi9jb25maWcnO1xuXG4vLyBcdTVCRkNcdTUxNjVcdTY3MERcdTUyQTFcbmltcG9ydCB7IGRhdGFTb3VyY2VTZXJ2aWNlLCBxdWVyeVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcyc7XG5pbXBvcnQgaW50ZWdyYXRpb25TZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL2ludGVncmF0aW9uJztcblxuLy8gXHU1OTA0XHU3NDA2Q09SU1x1OEJGN1x1NkM0MlxuZnVuY3Rpb24gaGFuZGxlQ29ycyhyZXM6IFNlcnZlclJlc3BvbnNlKSB7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbiwgWC1Nb2NrLUVuYWJsZWQnKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtTWF4LUFnZScsICc4NjQwMCcpO1xufVxuXG4vLyBcdTUzRDFcdTkwMDFKU09OXHU1NENEXHU1RTk0XG5mdW5jdGlvbiBzZW5kSnNvblJlc3BvbnNlKHJlczogU2VydmVyUmVzcG9uc2UsIHN0YXR1czogbnVtYmVyLCBkYXRhOiBhbnkpIHtcbiAgcmVzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG4vLyBcdTVFRjZcdThGREZcdTYyNjdcdTg4NENcbmZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vLyBcdTg5RTNcdTY3OTBcdThCRjdcdTZDNDJcdTRGNTNcbmFzeW5jIGZ1bmN0aW9uIHBhcnNlUmVxdWVzdEJvZHkocmVxOiBJbmNvbWluZ01lc3NhZ2UpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsZXQgYm9keSA9ICcnO1xuICAgIHJlcS5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgICAgYm9keSArPSBjaHVuay50b1N0cmluZygpO1xuICAgIH0pO1xuICAgIHJlcS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZShib2R5ID8gSlNPTi5wYXJzZShib2R5KSA6IHt9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVzb2x2ZSh7fSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY1NzBcdTYzNkVcdTZFOTBBUElcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZURhdGFzb3VyY2VzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcsIHVybFF1ZXJ5OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6IC9hcGkvZGF0YXNvdXJjZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU2NzBEXHU1MkExXHU1QzQyXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XHVGRjBDXHU2NTJGXHU2MzAxXHU1MjA2XHU5ODc1XHU1NDhDXHU4RkM3XHU2RUU0XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5nZXREYXRhU291cmNlcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nLFxuICAgICAgICB0eXBlOiB1cmxRdWVyeS50eXBlIGFzIHN0cmluZyxcbiAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcmVzdWx0Lml0ZW1zLCBcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhc291cmNlID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuZ2V0RGF0YVNvdXJjZShpZCk7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiBkYXRhc291cmNlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlIFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzJyAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6IC9hcGkvZGF0YXNvdXJjZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IG5ld0RhdGFTb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5jcmVhdGVEYXRhU291cmNlKGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7XG4gICAgICAgIGRhdGE6IG5ld0RhdGFTb3VyY2UsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMUJcdTVFRkFcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQVVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgdXBkYXRlZERhdGFTb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS51cGRhdGVEYXRhU291cmNlKGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB1cGRhdGVkRGF0YVNvdXJjZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkRFTEVURVx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmRlbGV0ZURhdGFTb3VyY2UoaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIG1lc3NhZ2U6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMjBcdTk2NjRcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2RDRCXHU4QkQ1XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkRFXHU2M0E1XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcy90ZXN0LWNvbm5lY3Rpb24nICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlcy90ZXN0LWNvbm5lY3Rpb25gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLnRlc3RDb25uZWN0aW9uKGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTZENEJcdThCRDVcdThGREVcdTYzQTVcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gXHU1OTA0XHU3NDA2XHU2N0U1XHU4QkUyQVBJXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVRdWVyaWVzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcsIHVybFF1ZXJ5OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIC8vIFx1NjhDMFx1NjdFNVVSTFx1NjYyRlx1NTQyNlx1NTMzOVx1OTE0RFx1NjdFNVx1OEJFMkFQSVxuICBjb25zdCBpc1F1ZXJpZXNQYXRoID0gdXJsUGF0aC5pbmNsdWRlcygnL3F1ZXJpZXMnKTtcbiAgXG4gIC8vIFx1NjI1M1x1NTM3MFx1NjI0MFx1NjcwOVx1NjdFNVx1OEJFMlx1NzZGOFx1NTE3M1x1OEJGN1x1NkM0Mlx1NEVFNVx1NEZCRlx1OEMwM1x1OEJENVxuICBpZiAoaXNRdWVyaWVzUGF0aCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU2OEMwXHU2RDRCXHU1MjMwXHU2N0U1XHU4QkUyQVBJXHU4QkY3XHU2QzQyOiAke21ldGhvZH0gJHt1cmxQYXRofWAsIHVybFF1ZXJ5KTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9xdWVyaWVzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXNgKTtcbiAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NTkwNFx1NzQwNlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1OEJGN1x1NkM0MiwgXHU1M0MyXHU2NTcwOicsIHVybFF1ZXJ5KTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU2NzBEXHU1MkExXHU1QzQyXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHVGRjBDXHU2NTJGXHU2MzAxXHU1MjA2XHU5ODc1XHU1NDhDXHU4RkM3XHU2RUU0XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcmllcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nLFxuICAgICAgICBkYXRhU291cmNlSWQ6IHVybFF1ZXJ5LmRhdGFTb3VyY2VJZCBhcyBzdHJpbmcsXG4gICAgICAgIHN0YXR1czogdXJsUXVlcnkuc3RhdHVzIGFzIHN0cmluZyxcbiAgICAgICAgcXVlcnlUeXBlOiB1cmxRdWVyeS5xdWVyeVR5cGUgYXMgc3RyaW5nLFxuICAgICAgICBpc0Zhdm9yaXRlOiB1cmxRdWVyeS5pc0Zhdm9yaXRlID09PSAndHJ1ZSdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1N0VEM1x1Njc5QzonLCB7XG4gICAgICAgIGl0ZW1zQ291bnQ6IHJlc3VsdC5pdGVtcy5sZW5ndGgsXG4gICAgICAgIHBhZ2luYXRpb246IHJlc3VsdC5wYWdpbmF0aW9uXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdThGRDRcdTU2REVcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTY1NzBcdTYzNkVcdTY4M0NcdTVGMEY6JywgeyBcbiAgICAgICAgZGF0YTogYEFycmF5WyR7cmVzdWx0Lml0ZW1zLmxlbmd0aH1dYCwgXG4gICAgICAgIHBhZ2luYXRpb246IHJlc3VsdC5wYWdpbmF0aW9uLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcmVzdWx0Lml0ZW1zLCBcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTW9ja10gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1OicsIGVycm9yKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY1MzZcdTg1Q0ZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMvZmF2b3JpdGVzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXMvZmF2b3JpdGVzYCk7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTU5MDRcdTc0MDZcdTY1MzZcdTg1Q0ZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdThCRjdcdTZDNDIsIFx1NTNDMlx1NjU3MDonLCB1cmxRdWVyeSk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NjcwRFx1NTJBMVx1NUM0Mlx1ODNCN1x1NTNENlx1NjUzNlx1ODVDRlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldEZhdm9yaXRlUXVlcmllcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nIHx8IHVybFF1ZXJ5LnNlYXJjaCBhcyBzdHJpbmcsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogdXJsUXVlcnkuZGF0YVNvdXJjZUlkIGFzIHN0cmluZyxcbiAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY1MzZcdTg1Q0ZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTdFRDNcdTY3OUM6Jywge1xuICAgICAgICBpdGVtc0NvdW50OiByZXN1bHQuaXRlbXMubGVuZ3RoLFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvblxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IHJlc3VsdC5pdGVtcywgXG4gICAgICAgIHBhZ2luYXRpb246IHJlc3VsdC5wYWdpbmF0aW9uLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignW01vY2tdIFx1ODNCN1x1NTNENlx1NjUzNlx1ODVDRlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNTonLCBlcnJvcik7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjUzNlx1ODVDRlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJ5KGlkKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IHF1ZXJ5LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY3RTVcdThCRTJcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlIFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9xdWVyaWVzYCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCBuZXdRdWVyeSA9IGF3YWl0IHF1ZXJ5U2VydmljZS5jcmVhdGVRdWVyeShib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMSwge1xuICAgICAgICBkYXRhOiBuZXdRdWVyeSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjdFNVx1OEJFMlx1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UFVUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHVwZGF0ZWRRdWVyeSA9IGF3YWl0IHF1ZXJ5U2VydmljZS51cGRhdGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogdXBkYXRlZFF1ZXJ5LFxuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0RFTEVURScpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZERUxFVEVcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBxdWVyeVNlcnZpY2UuZGVsZXRlUXVlcnkoaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTUyMjBcdTk2NjRcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC9ydW4kLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKVszXSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5leGVjdXRlUXVlcnkoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlx1RkYwOFx1NTE3Q1x1NUJCOWV4ZWN1dGVcdThERUZcdTVGODRcdUZGMDlcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL2V4ZWN1dGUkLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKVszXSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5leGVjdXRlUXVlcnkoaWQsIGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjUyRlx1NjMwMVx1NjdFNVx1OEJFMklEXHU2ODNDXHU1RjBGXHU0RTNBcXVlcnktMDAxXHU1RjYyXHU1RjBGXHU3Njg0XHU2MjY3XHU4ODRDXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL3F1ZXJ5LVxcZCtcXC9leGVjdXRlJC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJylbM10gfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MihcdTY3RTVcdThCRTJJRFx1NjgzQ1x1NUYwRik6ICR7dXJsUGF0aH0sIFx1NjdFNVx1OEJFMklEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgLy8gXHU0RUNFcXVlcnktMDAxXHU0RTJEXHU2M0QwXHU1M0Q2XHU2NTcwXHU1QjU3XHU5MEU4XHU1MjA2XHU0RjVDXHU0RTNBXHU2N0U1XHU4QkUySURcbiAgICAgIGNvbnN0IG51bWVyaWNJZCA9IGlkLnJlcGxhY2UoJ3F1ZXJ5LScsICcnKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5leGVjdXRlUXVlcnkobnVtZXJpY0lkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMDdcdTYzNjJcdTY3RTVcdThCRTJcdTY1MzZcdTg1Q0ZcdTcyQjZcdTYwMDFcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL2Zhdm9yaXRlJC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJylbM10gfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UudG9nZ2xlRmF2b3JpdGUoaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY2RjRcdTY1QjBcdTY1MzZcdTg1Q0ZcdTcyQjZcdTYwMDFcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvdmVyc2lvbnMkLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpWzNdIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHZlcnNpb25zID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJ5VmVyc2lvbnMoaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHZlcnNpb25zLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3Mjc5XHU1QjlBXHU3MjQ4XHU2NzJDXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC92ZXJzaW9uc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IHBhcnRzID0gdXJsUGF0aC5zcGxpdCgnLycpO1xuICAgIGNvbnN0IHF1ZXJ5SWQgPSBwYXJ0c1szXSB8fCAnJztcbiAgICBjb25zdCB2ZXJzaW9uSWQgPSBwYXJ0c1s1XSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIFx1NjdFNVx1OEJFMklEOiAke3F1ZXJ5SWR9LCBcdTcyNDhcdTY3MkNJRDogJHt2ZXJzaW9uSWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHZlcnNpb25zID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJ5VmVyc2lvbnMocXVlcnlJZCk7XG4gICAgICBjb25zdCB2ZXJzaW9uID0gdmVyc2lvbnMuZmluZCgodjogYW55KSA9PiB2LmlkID09PSB2ZXJzaW9uSWQpO1xuICAgICAgXG4gICAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7dmVyc2lvbklkfVx1NzY4NFx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ2ApO1xuICAgICAgfVxuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHZlcnNpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1OTZDNlx1NjIxMEFQSVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSW50ZWdyYXRpb25BcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZywgdXJsUXVlcnk6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgLy8gXHU2OEMwXHU2N0U1VVJMXHU2NjJGXHU1NDI2XHU1MzM5XHU5MTREXHU5NkM2XHU2MjEwQVBJXG4gIGNvbnN0IGlzSW50ZWdyYXRpb25QYXRoID0gdXJsUGF0aC5pbmNsdWRlcygnL2xvdy1jb2RlL2FwaXMnKTtcbiAgXG4gIC8vIFx1NjI1M1x1NTM3MFx1NjI0MFx1NjcwOVx1OTZDNlx1NjIxMFx1NzZGOFx1NTE3M1x1OEJGN1x1NkM0Mlx1NEVFNVx1NEZCRlx1OEMwM1x1OEJENVxuICBpZiAoaXNJbnRlZ3JhdGlvblBhdGgpIHtcbiAgICBjb25zb2xlLmxvZyhgW01vY2tdIFx1NjhDMFx1NkQ0Qlx1NTIzMFx1OTZDNlx1NjIxMEFQSVx1OEJGN1x1NkM0MjogJHttZXRob2R9ICR7dXJsUGF0aH1gLCB1cmxRdWVyeSk7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1OTZDNlx1NjIxMFx1NTIxN1x1ODg2OFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvbG93LWNvZGUvYXBpcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9sb3ctY29kZS9hcGlzYCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5nZXRJbnRlZ3JhdGlvbnMoe1xuICAgICAgICBwYWdlOiBwYXJzZUludCh1cmxRdWVyeS5wYWdlIGFzIHN0cmluZykgfHwgMSxcbiAgICAgICAgc2l6ZTogcGFyc2VJbnQodXJsUXVlcnkuc2l6ZSBhcyBzdHJpbmcpIHx8IDEwLFxuICAgICAgICBuYW1lOiB1cmxRdWVyeS5uYW1lIGFzIHN0cmluZyxcbiAgICAgICAgdHlwZTogdXJsUXVlcnkudHlwZSBhcyBzdHJpbmcsXG4gICAgICAgIHN0YXR1czogdXJsUXVlcnkuc3RhdHVzIGFzIHN0cmluZ1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IHJlc3VsdC5pdGVtcywgXG4gICAgICAgIHBhZ2luYXRpb246IHJlc3VsdC5wYWdpbmF0aW9uLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDUwMCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTgzQjdcdTUzRDZcdTk2QzZcdTYyMTBcdTUyMTdcdTg4NjhcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1OTZDNlx1NjIxMFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2xvdy1jb2RlXFwvYXBpc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGludGVncmF0aW9uID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmdldEludGVncmF0aW9uKGlkKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IGludGVncmF0aW9uLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTk2QzZcdTYyMTBcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlIFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTk2QzZcdTYyMTBcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2xvdy1jb2RlL2FwaXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9sb3ctY29kZS9hcGlzYCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCBuZXdJbnRlZ3JhdGlvbiA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5jcmVhdGVJbnRlZ3JhdGlvbihib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMSwge1xuICAgICAgICBkYXRhOiBuZXdJbnRlZ3JhdGlvbixcbiAgICAgICAgbWVzc2FnZTogJ1x1OTZDNlx1NjIxMFx1NTIxQlx1NUVGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU1MjFCXHU1RUZBXHU5NkM2XHU2MjEwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTk2QzZcdTYyMTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9sb3ctY29kZVxcL2FwaXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQVVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgdXBkYXRlZEludGVncmF0aW9uID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLnVwZGF0ZUludGVncmF0aW9uKGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB1cGRhdGVkSW50ZWdyYXRpb24sXG4gICAgICAgIG1lc3NhZ2U6ICdcdTk2QzZcdTYyMTBcdTY2RjRcdTY1QjBcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NjZGNFx1NjVCMFx1OTZDNlx1NjIxMFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjIwXHU5NjY0XHU5NkM2XHU2MjEwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvbG93LWNvZGVcXC9hcGlzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2REVMRVRFXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmRlbGV0ZUludGVncmF0aW9uKGlkKTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBtZXNzYWdlOiAnXHU5NkM2XHU2MjEwXHU1MjIwXHU5NjY0XHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTUyMjBcdTk2NjRcdTk2QzZcdTYyMTBcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NkQ0Qlx1OEJENVx1OTZDNlx1NjIxMCAtIFx1NEZFRVx1NkI2M1VSTFx1NTMzOVx1OTE0RFx1NkEyMVx1NUYwRlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2xvdy1jb2RlXFwvYXBpc1xcL1teXFwvXStcXC90ZXN0JC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgLy8gXHU0RUNFVVJMXHU0RTJEXHU2M0QwXHU1M0Q2XHU5NkM2XHU2MjEwSUQgLSBcdTRGRUVcdTZCNjNJRFx1NjNEMFx1NTNENlx1NjVCOVx1NUYwRlxuICAgIGNvbnN0IHNlZ21lbnRzID0gdXJsUGF0aC5zcGxpdCgnLycpO1xuICAgIGNvbnN0IGlkSW5kZXggPSBzZWdtZW50cy5maW5kSW5kZXgocyA9PiBzID09PSAnYXBpcycpICsgMTtcbiAgICBjb25zdCBpZCA9IGlkSW5kZXggPCBzZWdtZW50cy5sZW5ndGggPyBzZWdtZW50c1tpZEluZGV4XSA6ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIFx1OTZDNlx1NjIxMElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLnRlc3RJbnRlZ3JhdGlvbihpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NkQ0Qlx1OEJENVx1OTZDNlx1NjIxMFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2MjY3XHU4ODRDXHU5NkM2XHU2MjEwXHU2N0U1XHU4QkUyIC0gXHU0RkVFXHU2QjYzVVJMXHU1MzM5XHU5MTREXHU2QTIxXHU1RjBGXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvbG93LWNvZGVcXC9hcGlzXFwvW15cXC9dK1xcL3F1ZXJ5JC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgLy8gXHU0RUNFVVJMXHU0RTJEXHU2M0QwXHU1M0Q2XHU5NkM2XHU2MjEwSUQgLSBcdTRGRUVcdTZCNjNJRFx1NjNEMFx1NTNENlx1NjVCOVx1NUYwRlxuICAgIGNvbnN0IHNlZ21lbnRzID0gdXJsUGF0aC5zcGxpdCgnLycpO1xuICAgIGNvbnN0IGlkSW5kZXggPSBzZWdtZW50cy5maW5kSW5kZXgocyA9PiBzID09PSAnYXBpcycpICsgMTtcbiAgICBjb25zdCBpZCA9IGlkSW5kZXggPCBzZWdtZW50cy5sZW5ndGggPyBzZWdtZW50c1tpZEluZGV4XSA6ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIFx1OTZDNlx1NjIxMElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmV4ZWN1dGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTUyMUJcdTVFRkFcdTRFMkRcdTk1RjRcdTRFRjZcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCk6IENvbm5lY3QuTmV4dEhhbmRsZUZ1bmN0aW9uIHtcbiAgLy8gXHU1OTgyXHU2NzlDTW9ja1x1NjcwRFx1NTJBMVx1ODhBQlx1Nzk4MVx1NzUyOFx1RkYwQ1x1OEZENFx1NTZERVx1N0E3QVx1NEUyRFx1OTVGNFx1NEVGNlxuICBpZiAoIW1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU2NzBEXHU1MkExXHU1REYyXHU3OTgxXHU3NTI4XHVGRjBDXHU4RkQ0XHU1NkRFXHU3QTdBXHU0RTJEXHU5NUY0XHU0RUY2Jyk7XG4gICAgcmV0dXJuIChyZXEsIHJlcywgbmV4dCkgPT4gbmV4dCgpO1xuICB9XG4gIFxuICBjb25zb2xlLmxvZygnW01vY2tdIFx1NTIxQlx1NUVGQVx1NEUyRFx1OTVGNFx1NEVGNiwgXHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyJyk7XG4gIFxuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbW9ja01pZGRsZXdhcmUoXG4gICAgcmVxOiBDb25uZWN0LkluY29taW5nTWVzc2FnZSxcbiAgICByZXM6IFNlcnZlclJlc3BvbnNlLFxuICAgIG5leHQ6IENvbm5lY3QuTmV4dEZ1bmN0aW9uXG4gICkge1xuICAgIHRyeSB7XG4gICAgICAvLyBcdTg5RTNcdTY3OTBVUkxcbiAgICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgICBcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgaWYgKCF1cmwuaW5jbHVkZXMoJy9hcGkvJykpIHtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU1ODlFXHU1RjNBXHU1OTA0XHU3NDA2XHU5MUNEXHU1OTBEXHU3Njg0QVBJXHU4REVGXHU1Rjg0XG4gICAgICBsZXQgcHJvY2Vzc2VkVXJsID0gdXJsO1xuICAgICAgaWYgKHVybC5pbmNsdWRlcygnL2FwaS9hcGkvJykpIHtcbiAgICAgICAgcHJvY2Vzc2VkVXJsID0gdXJsLnJlcGxhY2UoL1xcL2FwaVxcL2FwaVxcLy9nLCAnL2FwaS8nKTtcbiAgICAgICAgbG9nTW9jaygnZGVidWcnLCBgXHU2OEMwXHU2RDRCXHU1MjMwXHU5MUNEXHU1OTBEXHU3Njg0QVBJXHU4REVGXHU1Rjg0XHVGRjBDXHU1REYyXHU0RkVFXHU2QjYzOiAke3VybH0gLT4gJHtwcm9jZXNzZWRVcmx9YCk7XG4gICAgICAgIC8vIFx1NEZFRVx1NjUzOVx1NTM5Rlx1NTlDQlx1OEJGN1x1NkM0Mlx1NzY4NFVSTFx1RkYwQ1x1Nzg2RVx1NEZERFx1NTQwRVx1N0VFRFx1NTkwNFx1NzQwNlx1ODBGRFx1NkI2M1x1Nzg2RVx1OEJDNlx1NTIyQlxuICAgICAgICByZXEudXJsID0gcHJvY2Vzc2VkVXJsO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTZENEJcdThCRDVcdUZGMUFcdTYyNTNcdTUzNzBcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTRFRTVcdTRGQkZcdThDMDNcdThCRDVcbiAgICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7cHJvY2Vzc2VkVXJsfWApO1xuICAgICAgXG4gICAgICBjb25zdCBwYXJzZWRVcmwgPSBwYXJzZShwcm9jZXNzZWRVcmwsIHRydWUpO1xuICAgICAgY29uc3QgdXJsUGF0aCA9IHBhcnNlZFVybC5wYXRobmFtZSB8fCAnJztcbiAgICAgIGNvbnN0IHVybFF1ZXJ5ID0gcGFyc2VkVXJsLnF1ZXJ5IHx8IHt9O1xuICAgICAgXG4gICAgICAvLyBcdTUxOERcdTZCMjFcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTU5MDRcdTc0MDZcdTZCNjRcdThCRjdcdTZDNDJcdUZGMDhcdTRGN0ZcdTc1MjhcdTU5MDRcdTc0MDZcdTU0MEVcdTc2ODRVUkxcdUZGMDlcbiAgICAgIGlmICghc2hvdWxkTW9ja1JlcXVlc3QocHJvY2Vzc2VkVXJsKSkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTY1MzZcdTUyMzBcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHt1cmxQYXRofWApO1xuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZDT1JTXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTZERkJcdTUyQTBDT1JTXHU1OTM0XG4gICAgICBoYW5kbGVDb3JzKHJlcyk7XG4gICAgICBcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1N0Y1MVx1N0VEQ1x1NUVGNlx1OEZERlxuICAgICAgaWYgKG1vY2tDb25maWcuZGVsYXkgPiAwKSB7XG4gICAgICAgIGF3YWl0IGRlbGF5KG1vY2tDb25maWcuZGVsYXkpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZcdTRFMERcdTU0MENcdTc2ODRBUElcdTdBRUZcdTcwQjlcbiAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XG4gICAgICBcbiAgICAgIC8vIFx1NjMwOVx1OTg3QVx1NUU4Rlx1NUMxRFx1OEJENVx1NEUwRFx1NTQwQ1x1NzY4NEFQSVx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gYXdhaXQgaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxLCByZXMsIHVybFBhdGgsIHVybFF1ZXJ5KTtcbiAgICAgIGlmICghaGFuZGxlZCkgaGFuZGxlZCA9IGF3YWl0IGhhbmRsZVF1ZXJpZXNBcGkocmVxLCByZXMsIHVybFBhdGgsIHVybFF1ZXJ5KTtcbiAgICAgIGlmICghaGFuZGxlZCkgaGFuZGxlZCA9IGF3YWl0IGhhbmRsZUludGVncmF0aW9uQXBpKHJlcSwgcmVzLCB1cmxQYXRoLCB1cmxRdWVyeSk7XG4gICAgICBcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkNBMVx1NjcwOVx1NTkwNFx1NzQwNlx1RkYwQ1x1OEZENFx1NTZERTQwNFxuICAgICAgaWYgKCFoYW5kbGVkKSB7XG4gICAgICAgIGxvZ01vY2soJ2luZm8nLCBgXHU2NzJBXHU1QjlFXHU3M0IwXHU3Njg0QVBJXHU4REVGXHU1Rjg0OiAke3JlcS5tZXRob2R9ICR7dXJsUGF0aH1gKTtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgICBlcnJvcjogJ1x1NjcyQVx1NjI3RVx1NTIzMEFQSVx1N0FFRlx1NzBCOScsXG4gICAgICAgICAgbWVzc2FnZTogYEFQSVx1N0FFRlx1NzBCOSAke3VybFBhdGh9IFx1NjcyQVx1NjI3RVx1NTIzMFx1NjIxNlx1NjcyQVx1NUI5RVx1NzNCMGAsXG4gICAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ01vY2soJ2Vycm9yJywgYFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NTFGQVx1OTUxOTpgLCBlcnJvcik7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0gIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxuICogXG4gKiBcdTYzQTdcdTUyMzZNb2NrXHU2NzBEXHU1MkExXHU3Njg0XHU1NDJGXHU3NTI4L1x1Nzk4MVx1NzUyOFx1NzJCNlx1NjAwMVx1MzAwMVx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQlx1N0I0OVxuICovXG5cbi8vIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NjIxNlx1NTE2OFx1NUM0MFx1OEJCRVx1N0Y2RVx1NEUyRFx1ODNCN1x1NTNENlx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbmV4cG9ydCBmdW5jdGlvbiBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgLy8gXHU1NzI4Tm9kZS5qc1x1NzNBRlx1NTg4M1x1NEUyRFxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzXHU0RTJEXG4gICAgaWYgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52KSB7XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU2OEMwXHU2N0U1bG9jYWxTdG9yYWdlIChcdTRFQzVcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODMpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIGNvbnN0IGxvY2FsU3RvcmFnZVZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1VTRV9NT0NLX0FQSScpO1xuICAgICAgaWYgKGxvY2FsU3RvcmFnZVZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAobG9jYWxTdG9yYWdlVmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTlFRDhcdThCQTRcdTYwQzVcdTUxQjVcdUZGMUFcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEJcdTU0MkZcdTc1MjhcdUZGMENcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTc5ODFcdTc1MjhcbiAgICBjb25zdCBpc0RldmVsb3BtZW50ID0gXG4gICAgICAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB8fFxuICAgICAgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52ICYmIGltcG9ydC5tZXRhLmVudi5ERVYgPT09IHRydWUpO1xuICAgIFxuICAgIHJldHVybiBpc0RldmVsb3BtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIFx1NTFGQVx1OTUxOVx1NjVGNlx1NzY4NFx1NUI4OVx1NTE2OFx1NTZERVx1OTAwMFxuICAgIGNvbnNvbGUud2FybignW01vY2tdIFx1NjhDMFx1NjdFNVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NTFGQVx1OTUxOVx1RkYwQ1x1OUVEOFx1OEJBNFx1Nzk4MVx1NzUyOE1vY2tcdTY3MERcdTUyQTEnLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1NTQxMVx1NTQwRVx1NTE3Q1x1NUJCOVx1NjVFN1x1NEVFM1x1NzgwMVx1NzY4NFx1NTFGRFx1NjU3MFxuZXhwb3J0IGZ1bmN0aW9uIGlzTW9ja0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0VuYWJsZWQoKTtcbn1cblxuLy8gTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVxuZXhwb3J0IGNvbnN0IG1vY2tDb25maWcgPSB7XG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgZW5hYmxlZDogaXNFbmFibGVkKCksXG4gIFxuICAvLyBcdThCRjdcdTZDNDJcdTVFRjZcdThGREZcdUZGMDhcdTZCRUJcdTc5RDJcdUZGMDlcbiAgZGVsYXk6IDMwMCxcbiAgXG4gIC8vIEFQSVx1NTdGQVx1Nzg0MFx1OERFRlx1NUY4NFx1RkYwQ1x1NzUyOFx1NEU4RVx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1OTcwMFx1ODk4MVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuICBhcGlCYXNlUGF0aDogJy9hcGknLFxuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCOiAnbm9uZScsICdlcnJvcicsICdpbmZvJywgJ2RlYnVnJ1xuICBsb2dMZXZlbDogJ2RlYnVnJyxcbiAgXG4gIC8vIFx1NTQyRlx1NzUyOFx1NzY4NFx1NkEyMVx1NTc1N1xuICBtb2R1bGVzOiB7XG4gICAgZGF0YXNvdXJjZXM6IHRydWUsXG4gICAgcXVlcmllczogdHJ1ZSxcbiAgICB1c2VyczogdHJ1ZSxcbiAgICB2aXN1YWxpemF0aW9uczogdHJ1ZVxuICB9XG59O1xuXG4vLyBcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRNb2NrUmVxdWVzdCh1cmw6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBcdTVGQzVcdTk4N0JcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdTVGQzVcdTk4N0JcdTY2MkZBUElcdThCRjdcdTZDNDJcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aChtb2NrQ29uZmlnLmFwaUJhc2VQYXRoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU4REVGXHU1Rjg0XHU2OEMwXHU2N0U1XHU5MDFBXHU4RkM3XHVGRjBDXHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBcdThCQjBcdTVGNTVcdTY1RTVcdTVGRDdcbmV4cG9ydCBmdW5jdGlvbiBsb2dNb2NrKGxldmVsOiAnZXJyb3InIHwgJ2luZm8nIHwgJ2RlYnVnJywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgY29uc3QgeyBsb2dMZXZlbCB9ID0gbW9ja0NvbmZpZztcbiAgXG4gIGlmIChsb2dMZXZlbCA9PT0gJ25vbmUnKSByZXR1cm47XG4gIFxuICBpZiAobGV2ZWwgPT09ICdlcnJvcicgJiYgWydlcnJvcicsICdpbmZvJywgJ2RlYnVnJ10uaW5jbHVkZXMobG9nTGV2ZWwpKSB7XG4gICAgY29uc29sZS5lcnJvcignW01vY2sgRVJST1JdJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdpbmZvJyAmJiBbJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmluZm8oJ1tNb2NrIElORk9dJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdkZWJ1ZycgJiYgbG9nTGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2sgREVCVUddJywgLi4uYXJncyk7XG4gIH1cbn1cblxuLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHU2NUY2XHU4RjkzXHU1MUZBTW9ja1x1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMVxudHJ5IHtcbiAgY29uc29sZS5sb2coYFtNb2NrXSBcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDE6ICR7bW9ja0NvbmZpZy5lbmFibGVkID8gJ1x1NURGMlx1NTQyRlx1NzUyOCcgOiAnXHU1REYyXHU3OTgxXHU3NTI4J31gKTtcbiAgaWYgKG1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU5MTREXHU3RjZFOmAsIHtcbiAgICAgIGRlbGF5OiBtb2NrQ29uZmlnLmRlbGF5LFxuICAgICAgYXBpQmFzZVBhdGg6IG1vY2tDb25maWcuYXBpQmFzZVBhdGgsXG4gICAgICBsb2dMZXZlbDogbW9ja0NvbmZpZy5sb2dMZXZlbCxcbiAgICAgIGVuYWJsZWRNb2R1bGVzOiBPYmplY3QuZW50cmllcyhtb2NrQ29uZmlnLm1vZHVsZXMpXG4gICAgICAgIC5maWx0ZXIoKFtfLCBlbmFibGVkXSkgPT4gZW5hYmxlZClcbiAgICAgICAgLm1hcCgoW25hbWVdKSA9PiBuYW1lKVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdThGOTNcdTUxRkFcdTkxNERcdTdGNkVcdTRGRTFcdTYwNkZcdTUxRkFcdTk1MTknLCBlcnJvcik7XG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzXCI7LyoqXG4gKiBcdTY1NzBcdTYzNkVcdTZFOTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2NTcwXHU2MzZFXHU2RTkwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHVGRjBDXHU3NTI4XHU0RThFXHU1RjAwXHU1M0QxXHU1NDhDXHU2RDRCXHU4QkQ1XG4gKi9cblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU3QzdCXHU1NzhCXG5leHBvcnQgdHlwZSBEYXRhU291cmNlVHlwZSA9ICdteXNxbCcgfCAncG9zdGdyZXNxbCcgfCAnb3JhY2xlJyB8ICdzcWxzZXJ2ZXInIHwgJ3NxbGl0ZSc7XG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NzJCNlx1NjAwMVxuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZVN0YXR1cyA9ICdhY3RpdmUnIHwgJ2luYWN0aXZlJyB8ICdlcnJvcicgfCAncGVuZGluZyc7XG5cbi8vIFx1NTQwQ1x1NkI2NVx1OTg5MVx1NzM4N1xuZXhwb3J0IHR5cGUgU3luY0ZyZXF1ZW5jeSA9ICdtYW51YWwnIHwgJ2hvdXJseScgfCAnZGFpbHknIHwgJ3dlZWtseScgfCAnbW9udGhseSc7XG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjNBNVx1NTNFM1xuZXhwb3J0IGludGVyZmFjZSBEYXRhU291cmNlIHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgdHlwZTogRGF0YVNvdXJjZVR5cGU7XG4gIGhvc3Q/OiBzdHJpbmc7XG4gIHBvcnQ/OiBudW1iZXI7XG4gIGRhdGFiYXNlTmFtZT86IHN0cmluZztcbiAgdXNlcm5hbWU/OiBzdHJpbmc7XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xuICBzdGF0dXM6IERhdGFTb3VyY2VTdGF0dXM7XG4gIHN5bmNGcmVxdWVuY3k/OiBTeW5jRnJlcXVlbmN5O1xuICBsYXN0U3luY1RpbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjcmVhdGVkQXQ6IHN0cmluZztcbiAgdXBkYXRlZEF0OiBzdHJpbmc7XG4gIGlzQWN0aXZlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICovXG5leHBvcnQgY29uc3QgbW9ja0RhdGFTb3VyY2VzOiBEYXRhU291cmNlW10gPSBbXG4gIHtcbiAgICBpZDogJ2RzLTEnLFxuICAgIG5hbWU6ICdNeVNRTFx1NzkzQVx1NEY4Qlx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTc5M0FcdTRGOEJNeVNRTFx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ215c3FsJyxcbiAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICBwb3J0OiAzMzA2LFxuICAgIGRhdGFiYXNlTmFtZTogJ2V4YW1wbGVfZGInLFxuICAgIHVzZXJuYW1lOiAndXNlcicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTInLFxuICAgIG5hbWU6ICdQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFBvc3RncmVTUUxcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdwb3N0Z3Jlc3FsJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjEwMCcsXG4gICAgcG9ydDogNTQzMixcbiAgICBkYXRhYmFzZU5hbWU6ICdwcm9kdWN0aW9uX2RiJyxcbiAgICB1c2VybmFtZTogJ2FkbWluJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdob3VybHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNzc3NjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMycsXG4gICAgbmFtZTogJ1NRTGl0ZVx1NjcyQ1x1NTczMFx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY3MkNcdTU3MzBTUUxpdGVcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdzcWxpdGUnLFxuICAgIGRhdGFiYXNlTmFtZTogJy9wYXRoL3RvL2xvY2FsLmRiJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdtYW51YWwnLFxuICAgIGxhc3RTeW5jVGltZTogbnVsbCxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM0NTYwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy00JyxcbiAgICBuYW1lOiAnU1FMIFNlcnZlclx1NkQ0Qlx1OEJENVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU3M0FGXHU1ODgzJyxcbiAgICB0eXBlOiAnc3Fsc2VydmVyJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjIwMCcsXG4gICAgcG9ydDogMTQzMyxcbiAgICBkYXRhYmFzZU5hbWU6ICd0ZXN0X2RiJyxcbiAgICB1c2VybmFtZTogJ3Rlc3RlcicsXG4gICAgc3RhdHVzOiAnaW5hY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICd3ZWVrbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDYwNDgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA1MTg0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IGZhbHNlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTUnLFxuICAgIG5hbWU6ICdPcmFjbGVcdTRGMDFcdTRFMUFcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwT3JhY2xlXHU0RjAxXHU0RTFBXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnb3JhY2xlJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjE1MCcsXG4gICAgcG9ydDogMTUyMSxcbiAgICBkYXRhYmFzZU5hbWU6ICdlbnRlcnByaXNlX2RiJyxcbiAgICB1c2VybmFtZTogJ3N5c3RlbScsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxMDM2ODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH1cbl07XG5cbi8qKlxuICogXHU3NTFGXHU2MjEwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gY291bnQgXHU3NTFGXHU2MjEwXHU2NTcwXHU5MUNGXG4gKiBAcmV0dXJucyBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTdFQzRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTW9ja0RhdGFTb3VyY2VzKGNvdW50OiBudW1iZXIgPSA1KTogRGF0YVNvdXJjZVtdIHtcbiAgY29uc3QgdHlwZXM6IERhdGFTb3VyY2VUeXBlW10gPSBbJ215c3FsJywgJ3Bvc3RncmVzcWwnLCAnb3JhY2xlJywgJ3NxbHNlcnZlcicsICdzcWxpdGUnXTtcbiAgY29uc3Qgc3RhdHVzZXM6IERhdGFTb3VyY2VTdGF0dXNbXSA9IFsnYWN0aXZlJywgJ2luYWN0aXZlJywgJ2Vycm9yJywgJ3BlbmRpbmcnXTtcbiAgY29uc3Qgc3luY0ZyZXFzOiBTeW5jRnJlcXVlbmN5W10gPSBbJ21hbnVhbCcsICdob3VybHknLCAnZGFpbHknLCAnd2Vla2x5JywgJ21vbnRobHknXTtcbiAgXG4gIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9LCAoXywgaSkgPT4ge1xuICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpICUgdHlwZXMubGVuZ3RoXTtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICBpZDogYGRzLWdlbi0ke2kgKyAxfWAsXG4gICAgICBuYW1lOiBgXHU3NTFGXHU2MjEwXHU3Njg0JHt0eXBlfVx1NjU3MFx1NjM2RVx1NkU5MCAke2kgKyAxfWAsXG4gICAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1NzY4NCR7dHlwZX1cdTdDN0JcdTU3OEJcdTY1NzBcdTYzNkVcdTZFOTAgJHtpICsgMX1gLFxuICAgICAgdHlwZSxcbiAgICAgIGhvc3Q6IHR5cGUgIT09ICdzcWxpdGUnID8gJ2xvY2FsaG9zdCcgOiB1bmRlZmluZWQsXG4gICAgICBwb3J0OiB0eXBlICE9PSAnc3FsaXRlJyA/ICgzMzA2ICsgaSkgOiB1bmRlZmluZWQsXG4gICAgICBkYXRhYmFzZU5hbWU6IHR5cGUgPT09ICdzcWxpdGUnID8gYC9wYXRoL3RvL2RiXyR7aX0uZGJgIDogYGV4YW1wbGVfZGJfJHtpfWAsXG4gICAgICB1c2VybmFtZTogdHlwZSAhPT0gJ3NxbGl0ZScgPyBgdXNlcl8ke2l9YCA6IHVuZGVmaW5lZCxcbiAgICAgIHN0YXR1czogc3RhdHVzZXNbaSAlIHN0YXR1c2VzLmxlbmd0aF0sXG4gICAgICBzeW5jRnJlcXVlbmN5OiBzeW5jRnJlcXNbaSAlIHN5bmNGcmVxcy5sZW5ndGhdLFxuICAgICAgbGFzdFN5bmNUaW1lOiBpICUgMyA9PT0gMCA/IG51bGwgOiBuZXcgRGF0ZShub3cgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKG5vdyAtIChpICsgMTApICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKG5vdyAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGlzQWN0aXZlOiBpICUgNCAhPT0gMFxuICAgIH07XG4gIH0pO1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTlFRDhcdThCQTRcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbmV4cG9ydCBkZWZhdWx0IG1vY2tEYXRhU291cmNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzXCI7LyoqXG4gKiBcdTY1NzBcdTYzNkVcdTZFOTBNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjU3MFx1NjM2RVx1NkU5MFx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IG1vY2tEYXRhU291cmNlcyB9IGZyb20gJy4uL2RhdGEvZGF0YXNvdXJjZSc7XG5pbXBvcnQgdHlwZSB7IERhdGFTb3VyY2UgfSBmcm9tICcuLi9kYXRhL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NEUzNFx1NjVGNlx1NUI1OFx1NTBBOFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1RkYwQ1x1NTE0MVx1OEJCOFx1NkEyMVx1NjJERlx1NTg5RVx1NTIyMFx1NjUzOVx1NjRDRFx1NEY1Q1xubGV0IGRhdGFTb3VyY2VzID0gWy4uLm1vY2tEYXRhU291cmNlc107XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNpbXVsYXRlRGVsYXkoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRlbGF5ID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xufVxuXG4vKipcbiAqIFx1OTFDRFx1N0Y2RVx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1NjM2RVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzZXREYXRhU291cmNlcygpOiB2b2lkIHtcbiAgZGF0YVNvdXJjZXMgPSBbLi4ubW9ja0RhdGFTb3VyY2VzXTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqIEBwYXJhbSBwYXJhbXMgXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwXG4gKiBAcmV0dXJucyBcdTUyMDZcdTk4NzVcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFTb3VyY2VzKHBhcmFtcz86IHtcbiAgcGFnZT86IG51bWJlcjtcbiAgc2l6ZT86IG51bWJlcjtcbiAgbmFtZT86IHN0cmluZztcbiAgdHlwZT86IHN0cmluZztcbiAgc3RhdHVzPzogc3RyaW5nO1xufSk6IFByb21pc2U8e1xuICBpdGVtczogRGF0YVNvdXJjZVtdO1xuICBwYWdpbmF0aW9uOiB7XG4gICAgdG90YWw6IG51bWJlcjtcbiAgICBwYWdlOiBudW1iZXI7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIHRvdGFsUGFnZXM6IG51bWJlcjtcbiAgfTtcbn0+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgXG4gIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICBsZXQgZmlsdGVyZWRJdGVtcyA9IFsuLi5kYXRhU291cmNlc107XG4gIFxuICAvLyBcdTYzMDlcdTU0MERcdTc5RjBcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgIGNvbnN0IGtleXdvcmQgPSBwYXJhbXMubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBcbiAgICAgIGRzLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgIChkcy5kZXNjcmlwdGlvbiAmJiBkcy5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICk7XG4gIH1cbiAgXG4gIC8vIFx1NjMwOVx1N0M3Qlx1NTc4Qlx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy50eXBlKSB7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IGRzLnR5cGUgPT09IHBhcmFtcy50eXBlKTtcbiAgfVxuICBcbiAgLy8gXHU2MzA5XHU3MkI2XHU2MDAxXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBkcy5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICB9XG4gIFxuICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5zbGljZShzdGFydCwgZW5kKTtcbiAgXG4gIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICByZXR1cm4ge1xuICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0b3RhbDogZmlsdGVyZWRJdGVtcy5sZW5ndGgsXG4gICAgICBwYWdlLFxuICAgICAgc2l6ZSxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmaWx0ZXJlZEl0ZW1zLmxlbmd0aCAvIHNpemUpXG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKiBAcmV0dXJucyBcdTY1NzBcdTYzNkVcdTZFOTBcdThCRTZcdTYwQzVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFTb3VyY2UoaWQ6IHN0cmluZyk6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2N0U1XHU2MjdFXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IGRhdGFTb3VyY2UgPSBkYXRhU291cmNlcy5maW5kKGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoIWRhdGFTb3VyY2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgcmV0dXJuIGRhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gZGF0YSBcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTYzNkVcbiAqIEByZXR1cm5zIFx1NTIxQlx1NUVGQVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlRGF0YVNvdXJjZShkYXRhOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBJRFxuICBjb25zdCBuZXdJZCA9IGBkcy0ke0RhdGUubm93KCl9YDtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCBuZXdEYXRhU291cmNlOiBEYXRhU291cmNlID0ge1xuICAgIGlkOiBuZXdJZCxcbiAgICBuYW1lOiBkYXRhLm5hbWUgfHwgJ05ldyBEYXRhIFNvdXJjZScsXG4gICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgdHlwZTogZGF0YS50eXBlIHx8ICdteXNxbCcsXG4gICAgaG9zdDogZGF0YS5ob3N0LFxuICAgIHBvcnQ6IGRhdGEucG9ydCxcbiAgICBkYXRhYmFzZU5hbWU6IGRhdGEuZGF0YWJhc2VOYW1lLFxuICAgIHVzZXJuYW1lOiBkYXRhLnVzZXJuYW1lLFxuICAgIHN0YXR1czogZGF0YS5zdGF0dXMgfHwgJ3BlbmRpbmcnLFxuICAgIHN5bmNGcmVxdWVuY3k6IGRhdGEuc3luY0ZyZXF1ZW5jeSB8fCAnbWFudWFsJyxcbiAgICBsYXN0U3luY1RpbWU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfTtcbiAgXG4gIC8vIFx1NkRGQlx1NTJBMFx1NTIzMFx1NTIxN1x1ODg2OFxuICBkYXRhU291cmNlcy5wdXNoKG5ld0RhdGFTb3VyY2UpO1xuICBcbiAgcmV0dXJuIG5ld0RhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqIEBwYXJhbSBkYXRhIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVxuICogQHJldHVybnMgXHU2NkY0XHU2NUIwXHU1NDBFXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVEYXRhU291cmNlKGlkOiBzdHJpbmcsIGRhdGE6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjI3RVx1NTIzMFx1ODk4MVx1NjZGNFx1NjVCMFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFx1N0QyMlx1NUYxNVxuICBjb25zdCBpbmRleCA9IGRhdGFTb3VyY2VzLmZpbmRJbmRleChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgdXBkYXRlZERhdGFTb3VyY2U6IERhdGFTb3VyY2UgPSB7XG4gICAgLi4uZGF0YVNvdXJjZXNbaW5kZXhdLFxuICAgIC4uLmRhdGEsXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgfTtcbiAgXG4gIC8vIFx1NjZGRlx1NjM2Mlx1NjU3MFx1NjM2RVx1NkU5MFxuICBkYXRhU291cmNlc1tpbmRleF0gPSB1cGRhdGVkRGF0YVNvdXJjZTtcbiAgXG4gIHJldHVybiB1cGRhdGVkRGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlRGF0YVNvdXJjZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTYyN0VcdTUyMzBcdTg5ODFcdTUyMjBcdTk2NjRcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcdTdEMjJcdTVGMTVcbiAgY29uc3QgaW5kZXggPSBkYXRhU291cmNlcy5maW5kSW5kZXgoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgLy8gXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGRhdGFTb3VyY2VzLnNwbGljZShpbmRleCwgMSk7XG59XG5cbi8qKlxuICogXHU2RDRCXHU4QkQ1XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkRFXHU2M0E1XG4gKiBAcGFyYW0gcGFyYW1zIFx1OEZERVx1NjNBNVx1NTNDMlx1NjU3MFxuICogQHJldHVybnMgXHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU3RUQzXHU2NzlDXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0Q29ubmVjdGlvbihwYXJhbXM6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPHtcbiAgc3VjY2VzczogYm9vbGVhbjtcbiAgbWVzc2FnZT86IHN0cmluZztcbiAgZGV0YWlscz86IGFueTtcbn0+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NUI5RVx1OTY0NVx1NEY3Rlx1NzUyOFx1NjVGNlx1NTNFRlx1ODBGRFx1NEYxQVx1NjcwOVx1NjZGNFx1NTkwRFx1Njc0Mlx1NzY4NFx1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1OTAzQlx1OEY5MVxuICAvLyBcdThGRDlcdTkxQ0NcdTdCODBcdTUzNTVcdTZBMjFcdTYyREZcdTYyMTBcdTUyOUYvXHU1OTMxXHU4RDI1XG4gIGNvbnN0IHN1Y2Nlc3MgPSBNYXRoLnJhbmRvbSgpID4gMC4yOyAvLyA4MCVcdTYyMTBcdTUyOUZcdTczODdcbiAgXG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBtZXNzYWdlOiBzdWNjZXNzID8gJ1x1OEZERVx1NjNBNVx1NjIxMFx1NTI5RicgOiAnXHU4RkRFXHU2M0E1XHU1OTMxXHU4RDI1OiBcdTY1RTBcdTZDRDVcdThGREVcdTYzQTVcdTUyMzBcdTY1NzBcdTYzNkVcdTVFOTNcdTY3MERcdTUyQTFcdTU2NjgnLFxuICAgIGRldGFpbHM6IHN1Y2Nlc3MgPyB7XG4gICAgICByZXNwb25zZVRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSArIDEwLFxuICAgICAgdmVyc2lvbjogJzguMC4yOCcsXG4gICAgICBjb25uZWN0aW9uSWQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKSArIDEwMDBcbiAgICB9IDoge1xuICAgICAgZXJyb3JDb2RlOiAnQ09OTkVDVElPTl9SRUZVU0VEJyxcbiAgICAgIGVycm9yRGV0YWlsczogJ1x1NjVFMFx1NkNENVx1NUVGQVx1N0FDQlx1NTIzMFx1NjcwRFx1NTJBMVx1NTY2OFx1NzY4NFx1OEZERVx1NjNBNVx1RkYwQ1x1OEJGN1x1NjhDMFx1NjdFNVx1N0Y1MVx1N0VEQ1x1OEJCRVx1N0Y2RVx1NTQ4Q1x1NTFFRFx1NjM2RSdcbiAgICB9XG4gIH07XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXREYXRhU291cmNlcyxcbiAgZ2V0RGF0YVNvdXJjZSxcbiAgY3JlYXRlRGF0YVNvdXJjZSxcbiAgdXBkYXRlRGF0YVNvdXJjZSxcbiAgZGVsZXRlRGF0YVNvdXJjZSxcbiAgdGVzdENvbm5lY3Rpb24sXG4gIHJlc2V0RGF0YVNvdXJjZXNcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvdXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5MDFBXHU3NTI4XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NTIxQlx1NUVGQVx1N0VERlx1NEUwMFx1NjgzQ1x1NUYwRlx1NTRDRFx1NUU5NFx1NzY4NFx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuICovXG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2QTIxXHU2MkRGQVBJXHU2MjEwXHU1MjlGXHU1NENEXHU1RTk0XG4gKiBAcGFyYW0gZGF0YSBcdTU0Q0RcdTVFOTRcdTY1NzBcdTYzNkVcbiAqIEBwYXJhbSBzdWNjZXNzIFx1NjIxMFx1NTI5Rlx1NzJCNlx1NjAwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQXRydWVcbiAqIEBwYXJhbSBtZXNzYWdlIFx1NTNFRlx1OTAwOVx1NkQ4OFx1NjA2RlxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHU3Njg0QVBJXHU1NENEXHU1RTk0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrUmVzcG9uc2U8VD4oXG4gIGRhdGE6IFQsIFxuICBzdWNjZXNzOiBib29sZWFuID0gdHJ1ZSwgXG4gIG1lc3NhZ2U/OiBzdHJpbmdcbikge1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3MsXG4gICAgZGF0YSxcbiAgICBtZXNzYWdlLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIG1vY2tSZXNwb25zZTogdHJ1ZSAvLyBcdTY4MDdcdThCQjBcdTRFM0FcdTZBMjFcdTYyREZcdTU0Q0RcdTVFOTRcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTZBMjFcdTYyREZBUElcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqIEBwYXJhbSBtZXNzYWdlIFx1OTUxOVx1OEJFRlx1NkQ4OFx1NjA2RlxuICogQHBhcmFtIGNvZGUgXHU5NTE5XHU4QkVGXHU0RUUzXHU3ODAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBJ01PQ0tfRVJST1InXG4gKiBAcGFyYW0gc3RhdHVzIEhUVFBcdTcyQjZcdTYwMDFcdTc4MDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0E1MDBcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NjgzQ1x1NUYwRlx1NzY4NFx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UoXG4gIG1lc3NhZ2U6IHN0cmluZywgXG4gIGNvZGU6IHN0cmluZyA9ICdNT0NLX0VSUk9SJywgXG4gIHN0YXR1czogbnVtYmVyID0gNTAwXG4pIHtcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICBlcnJvcjoge1xuICAgICAgbWVzc2FnZSxcbiAgICAgIGNvZGUsXG4gICAgICBzdGF0dXNDb2RlOiBzdGF0dXNcbiAgICB9LFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIG1vY2tSZXNwb25zZTogdHJ1ZVxuICB9O1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NFx1N0VEM1x1Njc4NFxuICogQHBhcmFtIGl0ZW1zIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzY4NFx1OTg3OVx1NzZFRVx1NTIxN1x1ODg2OFxuICogQHBhcmFtIHRvdGFsSXRlbXMgXHU2MDNCXHU5ODc5XHU3NkVFXHU2NTcwXG4gKiBAcGFyYW0gcGFnZSBcdTVGNTNcdTUyNERcdTk4NzVcdTc4MDFcbiAqIEBwYXJhbSBzaXplIFx1NkJDRlx1OTg3NVx1NTkyN1x1NUMwRlxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU1MjA2XHU5ODc1XHU1NENEXHU1RTk0XHU3RUQzXHU2Nzg0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2U8VD4oXG4gIGl0ZW1zOiBUW10sXG4gIHRvdGFsSXRlbXM6IG51bWJlcixcbiAgcGFnZTogbnVtYmVyID0gMSxcbiAgc2l6ZTogbnVtYmVyID0gMTBcbikge1xuICByZXR1cm4gY3JlYXRlTW9ja1Jlc3BvbnNlKHtcbiAgICBpdGVtcyxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0b3RhbDogdG90YWxJdGVtcyxcbiAgICAgIHBhZ2UsXG4gICAgICBzaXplLFxuICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsSXRlbXMgLyBzaXplKSxcbiAgICAgIGhhc01vcmU6IHBhZ2UgKiBzaXplIDwgdG90YWxJdGVtc1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XHU1RUY2XHU4RkRGXG4gKiBAcGFyYW0gbXMgXHU1RUY2XHU4RkRGXHU2QkVCXHU3OUQyXHU2NTcwXHVGRjBDXHU5RUQ4XHU4QkE0MzAwbXNcbiAqIEByZXR1cm5zIFByb21pc2VcdTVCRjlcdThDNjFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIgPSAzMDApOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvcXVlcnkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3F1ZXJ5LnRzXCI7LyoqXG4gKiBcdTY3RTVcdThCRTJNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjdFNVx1OEJFMlx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IGRlbGF5LCBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsIGNyZWF0ZU1vY2tSZXNwb25zZSwgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuXG4vLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbmNvbnN0IG1vY2tRdWVyaWVzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+IHtcbiAgY29uc3QgaWQgPSBgcXVlcnktJHtpICsgMX1gO1xuICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpO1xuICBcbiAgcmV0dXJuIHtcbiAgICBpZCxcbiAgICBuYW1lOiBgXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyICR7aSArIDF9YCxcbiAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfSBcdTc2ODRcdTYzQ0ZcdThGRjBgLFxuICAgIGZvbGRlcklkOiBpICUgMyA9PT0gMCA/ICdmb2xkZXItMScgOiAoaSAlIDMgPT09IDEgPyAnZm9sZGVyLTInIDogJ2ZvbGRlci0zJyksXG4gICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgIGRhdGFTb3VyY2VOYW1lOiBgXHU2NTcwXHU2MzZFXHU2RTkwICR7KGkgJSA1KSArIDF9YCxcbiAgICBxdWVyeVR5cGU6IGkgJSAyID09PSAwID8gJ1NRTCcgOiAnTkFUVVJBTF9MQU5HVUFHRScsXG4gICAgcXVlcnlUZXh0OiBpICUgMiA9PT0gMCA/IFxuICAgICAgYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAgOiBcbiAgICAgIGBcdTY3RTVcdTYyN0VcdTY3MDBcdThGRDExMFx1Njc2MSR7aSAlIDIgPT09IDAgPyAnXHU4QkEyXHU1MzU1JyA6ICdcdTc1MjhcdTYyMzcnfVx1OEJCMFx1NUY1NWAsXG4gICAgc3RhdHVzOiBpICUgNCA9PT0gMCA/ICdEUkFGVCcgOiAoaSAlIDQgPT09IDEgPyAnUFVCTElTSEVEJyA6IChpICUgNCA9PT0gMiA/ICdERVBSRUNBVEVEJyA6ICdBUkNISVZFRCcpKSxcbiAgICBzZXJ2aWNlU3RhdHVzOiBpICUgMiA9PT0gMCA/ICdFTkFCTEVEJyA6ICdESVNBQkxFRCcsXG4gICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRCeTogeyBpZDogJ3VzZXIxJywgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NzUyOFx1NjIzNycgfSxcbiAgICB1cGRhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgZXhlY3V0aW9uQ291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSxcbiAgICBpc0Zhdm9yaXRlOiBpICUgMyA9PT0gMCxcbiAgICBpc0FjdGl2ZTogaSAlIDUgIT09IDAsXG4gICAgbGFzdEV4ZWN1dGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogNDMyMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHJlc3VsdENvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApICsgMTAsXG4gICAgZXhlY3V0aW9uVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTAwKSArIDEwLFxuICAgIHRhZ3M6IFtgXHU2ODA3XHU3QjdFJHtpKzF9YCwgYFx1N0M3Qlx1NTc4QiR7aSAlIDN9YF0sXG4gICAgY3VycmVudFZlcnNpb246IHtcbiAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgcXVlcnlJZDogaWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9LFxuICAgIHZlcnNpb25zOiBbe1xuICAgICAgaWQ6IGB2ZXItJHtpZH0tMWAsXG4gICAgICBxdWVyeUlkOiBpZCxcbiAgICAgIHZlcnNpb25OdW1iZXI6IDEsXG4gICAgICBuYW1lOiAnXHU1RjUzXHU1MjREXHU3MjQ4XHU2NzJDJyxcbiAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICBzdGF0dXM6ICdQVUJMSVNIRUQnLFxuICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH1dXG4gIH07XG59KTtcblxuLy8gXHU5MUNEXHU3RjZFXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRRdWVyaWVzKCk6IHZvaWQge1xuICAvLyBcdTRGRERcdTc1NTlcdTVGMTVcdTc1MjhcdUZGMENcdTUzRUFcdTkxQ0RcdTdGNkVcdTUxODVcdTVCQjlcbiAgd2hpbGUgKG1vY2tRdWVyaWVzLmxlbmd0aCA+IDApIHtcbiAgICBtb2NrUXVlcmllcy5wb3AoKTtcbiAgfVxuICBcbiAgLy8gXHU5MUNEXHU2NUIwXHU3NTFGXHU2MjEwXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXG4gIEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiB7XG4gICAgY29uc3QgaWQgPSBgcXVlcnktJHtpICsgMX1gO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgbW9ja1F1ZXJpZXMucHVzaCh7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6IGBcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX1gLFxuICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX0gXHU3Njg0XHU2M0NGXHU4RkYwYCxcbiAgICAgIGZvbGRlcklkOiBpICUgMyA9PT0gMCA/ICdmb2xkZXItMScgOiAoaSAlIDMgPT09IDEgPyAnZm9sZGVyLTInIDogJ2ZvbGRlci0zJyksXG4gICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICBkYXRhU291cmNlTmFtZTogYFx1NjU3MFx1NjM2RVx1NkU5MCAkeyhpICUgNSkgKyAxfWAsXG4gICAgICBxdWVyeVR5cGU6IGkgJSAyID09PSAwID8gJ1NRTCcgOiAnTkFUVVJBTF9MQU5HVUFHRScsXG4gICAgICBxdWVyeVRleHQ6IGkgJSAyID09PSAwID8gXG4gICAgICAgIGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgIDogXG4gICAgICAgIGBcdTY3RTVcdTYyN0VcdTY3MDBcdThGRDExMFx1Njc2MSR7aSAlIDIgPT09IDAgPyAnXHU4QkEyXHU1MzU1JyA6ICdcdTc1MjhcdTYyMzcnfVx1OEJCMFx1NUY1NWAsXG4gICAgICBzdGF0dXM6IGkgJSA0ID09PSAwID8gJ0RSQUZUJyA6IChpICUgNCA9PT0gMSA/ICdQVUJMSVNIRUQnIDogKGkgJSA0ID09PSAyID8gJ0RFUFJFQ0FURUQnIDogJ0FSQ0hJVkVEJykpLFxuICAgICAgc2VydmljZVN0YXR1czogaSAlIDIgPT09IDAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjcmVhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICB1cGRhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICBleGVjdXRpb25Db3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApLFxuICAgICAgaXNGYXZvcml0ZTogaSAlIDMgPT09IDAsXG4gICAgICBpc0FjdGl2ZTogaSAlIDUgIT09IDAsXG4gICAgICBsYXN0RXhlY3V0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICByZXN1bHRDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTAwKSArIDEwLFxuICAgICAgdGFnczogW2BcdTY4MDdcdTdCN0Uke2krMX1gLCBgXHU3QzdCXHU1NzhCJHtpICUgM31gXSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9LFxuICAgICAgdmVyc2lvbnM6IFt7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9XVxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXlUaW1lID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIGRlbGF5KGRlbGF5VGltZSk7XG59XG5cbi8qKlxuICogXHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IHF1ZXJ5U2VydmljZSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcmllcyhwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdThGQzdcdTZFRTRcbiAgICBsZXQgZmlsdGVyZWRJdGVtcyA9IFsuLi5tb2NrUXVlcmllc107XG4gICAgXG4gICAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBcbiAgICAgICAgcS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAgIChxLmRlc2NyaXB0aW9uICYmIHEuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NjU3MFx1NjM2RVx1NkU5MFx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LmRhdGFTb3VyY2VJZCkge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5kYXRhU291cmNlSWQgPT09IHBhcmFtcy5kYXRhU291cmNlSWQpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU3QzdCXHU1NzhCXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8ucXVlcnlUeXBlKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLnF1ZXJ5VHlwZSA9PT0gcGFyYW1zLnF1ZXJ5VHlwZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NjUzNlx1ODVDRlx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LmlzRmF2b3JpdGUpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEuaXNGYXZvcml0ZSA9PT0gdHJ1ZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjUzNlx1ODVDRlx1NzY4NFx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0RmF2b3JpdGVRdWVyaWVzKHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1OEZDN1x1NkVFNFx1NTFGQVx1NjUzNlx1ODVDRlx1NzY4NFx1NjdFNVx1OEJFMlxuICAgIGxldCBmYXZvcml0ZVF1ZXJpZXMgPSBtb2NrUXVlcmllcy5maWx0ZXIocSA9PiBxLmlzRmF2b3JpdGUgPT09IHRydWUpO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTE3Nlx1NEVENlx1OEZDN1x1NkVFNFx1Njc2MVx1NEVGNlxuICAgIGlmIChwYXJhbXM/Lm5hbWUgfHwgcGFyYW1zPy5zZWFyY2gpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSAocGFyYW1zLm5hbWUgfHwgcGFyYW1zLnNlYXJjaCB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZhdm9yaXRlUXVlcmllcyA9IGZhdm9yaXRlUXVlcmllcy5maWx0ZXIocSA9PiBcbiAgICAgICAgcS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAgIChxLmRlc2NyaXB0aW9uICYmIHEuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIGlmIChwYXJhbXM/LmRhdGFTb3VyY2VJZCkge1xuICAgICAgZmF2b3JpdGVRdWVyaWVzID0gZmF2b3JpdGVRdWVyaWVzLmZpbHRlcihxID0+IHEuZGF0YVNvdXJjZUlkID09PSBwYXJhbXMuZGF0YVNvdXJjZUlkKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgICBmYXZvcml0ZVF1ZXJpZXMgPSBmYXZvcml0ZVF1ZXJpZXMuZmlsdGVyKHEgPT4gcS5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmF2b3JpdGVRdWVyaWVzLmxlbmd0aCk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmYXZvcml0ZVF1ZXJpZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IGZhdm9yaXRlUXVlcmllcy5sZW5ndGgsXG4gICAgICAgIHBhZ2UsXG4gICAgICAgIHNpemUsXG4gICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmYXZvcml0ZVF1ZXJpZXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnkoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXMuZmluZChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHF1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnkoZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwSURcdUZGMENcdTY4M0NcdTVGMEZcdTRFMEVcdTczQjBcdTY3MDlJRFx1NEUwMFx1ODFGNFxuICAgIGNvbnN0IGlkID0gYHF1ZXJ5LSR7bW9ja1F1ZXJpZXMubGVuZ3RoICsgMX1gO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTY3RTVcdThCRTJcbiAgICBjb25zdCBuZXdRdWVyeSA9IHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogZGF0YS5uYW1lIHx8IGBcdTY1QjBcdTY3RTVcdThCRTIgJHtpZH1gLFxuICAgICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgICBmb2xkZXJJZDogZGF0YS5mb2xkZXJJZCB8fCBudWxsLFxuICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCxcbiAgICAgIGRhdGFTb3VyY2VOYW1lOiBkYXRhLmRhdGFTb3VyY2VOYW1lIHx8IGBcdTY1NzBcdTYzNkVcdTZFOTAgJHtkYXRhLmRhdGFTb3VyY2VJZH1gLFxuICAgICAgcXVlcnlUeXBlOiBkYXRhLnF1ZXJ5VHlwZSB8fCAnU1FMJyxcbiAgICAgIHF1ZXJ5VGV4dDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzIHx8ICdEUkFGVCcsXG4gICAgICBzZXJ2aWNlU3RhdHVzOiBkYXRhLnNlcnZpY2VTdGF0dXMgfHwgJ0RJU0FCTEVEJyxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICBjcmVhdGVkQnk6IGRhdGEuY3JlYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICB1cGRhdGVkQnk6IGRhdGEudXBkYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICBleGVjdXRpb25Db3VudDogMCxcbiAgICAgIGlzRmF2b3JpdGU6IGRhdGEuaXNGYXZvcml0ZSB8fCBmYWxzZSxcbiAgICAgIGlzQWN0aXZlOiBkYXRhLmlzQWN0aXZlIHx8IHRydWUsXG4gICAgICBsYXN0RXhlY3V0ZWRBdDogbnVsbCxcbiAgICAgIHJlc3VsdENvdW50OiAwLFxuICAgICAgZXhlY3V0aW9uVGltZTogMCxcbiAgICAgIHRhZ3M6IGRhdGEudGFncyB8fCBbXSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NTIxRFx1NTlDQlx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQsXG4gICAgICAgIHN0YXR1czogJ0RSQUZUJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9LFxuICAgICAgdmVyc2lvbnM6IFt7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NTIxRFx1NTlDQlx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQsXG4gICAgICAgIHN0YXR1czogJ0RSQUZUJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9XVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU1MjE3XHU4ODY4XG4gICAgbW9ja1F1ZXJpZXMucHVzaChuZXdRdWVyeSk7XG4gICAgXG4gICAgcmV0dXJuIG5ld1F1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgdXBkYXRlUXVlcnkoaWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU4OTgxXHU2NkY0XHU2NUIwXHU3Njg0XHU2N0U1XHU4QkUyXHU3RDIyXHU1RjE1XG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHVwZGF0ZWRRdWVyeSA9IHtcbiAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRCeTogZGF0YS51cGRhdGVkQnkgfHwgbW9ja1F1ZXJpZXNbaW5kZXhdLnVwZGF0ZWRCeSB8fCB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9XG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY2RkZcdTYzNjJcdTY3RTVcdThCRTJcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB1cGRhdGVkUXVlcnk7XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRRdWVyeTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGRlbGV0ZVF1ZXJ5KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU4OTgxXHU1MjIwXHU5NjY0XHU3Njg0XHU2N0U1XHU4QkUyXHU3RDIyXHU1RjE1XG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgIG1vY2tRdWVyaWVzLnNwbGljZShpbmRleCwgMSk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBleGVjdXRlUXVlcnkoaWQ6IHN0cmluZywgcGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTdFRDNcdTY3OUNcbiAgICBjb25zdCBjb2x1bW5zID0gWydpZCcsICduYW1lJywgJ2VtYWlsJywgJ3N0YXR1cycsICdjcmVhdGVkX2F0J107XG4gICAgY29uc3Qgcm93cyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiAoe1xuICAgICAgaWQ6IGkgKyAxLFxuICAgICAgbmFtZTogYFx1NzUyOFx1NjIzNyAke2kgKyAxfWAsXG4gICAgICBlbWFpbDogYHVzZXIke2kgKyAxfUBleGFtcGxlLmNvbWAsXG4gICAgICBzdGF0dXM6IGkgJSAyID09PSAwID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnLFxuICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKVxuICAgIH0pKTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTYyNjdcdTg4NENcdTdFREZcdThCQTFcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgICAgZXhlY3V0aW9uQ291bnQ6IChtb2NrUXVlcmllc1tpbmRleF0uZXhlY3V0aW9uQ291bnQgfHwgMCkgKyAxLFxuICAgICAgICBsYXN0RXhlY3V0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICByZXN1bHRDb3VudDogcm93cy5sZW5ndGhcbiAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBjb2x1bW5zLFxuICAgICAgcm93cyxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIGV4ZWN1dGlvblRpbWU6IE1hdGgucmFuZG9tKCkgKiAwLjUgKyAwLjEsXG4gICAgICAgIHJvd0NvdW50OiByb3dzLmxlbmd0aCxcbiAgICAgICAgdG90YWxQYWdlczogMVxuICAgICAgfSxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGlkOiBxdWVyeS5pZCxcbiAgICAgICAgbmFtZTogcXVlcnkubmFtZSxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBxdWVyeS5kYXRhU291cmNlSWRcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIwN1x1NjM2Mlx1NjdFNVx1OEJFMlx1NjUzNlx1ODVDRlx1NzJCNlx1NjAwMVxuICAgKi9cbiAgYXN5bmMgdG9nZ2xlRmF2b3JpdGUoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMDdcdTYzNjJcdTY1MzZcdTg1Q0ZcdTcyQjZcdTYwMDFcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAuLi5tb2NrUXVlcmllc1tpbmRleF0sXG4gICAgICBpc0Zhdm9yaXRlOiAhbW9ja1F1ZXJpZXNbaW5kZXhdLmlzRmF2b3JpdGUsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIG1vY2tRdWVyaWVzW2luZGV4XTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUzODZcdTUzRjJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5SGlzdG9yeShwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTUzODZcdTUzRjJcdThCQjBcdTVGNTVcbiAgICBjb25zdCB0b3RhbEl0ZW1zID0gMjA7XG4gICAgY29uc3QgaGlzdG9yaWVzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogdG90YWxJdGVtcyB9LCAoXywgaSkgPT4ge1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiAzNjAwMDAwKS50b0lTT1N0cmluZygpO1xuICAgICAgY29uc3QgcXVlcnlJbmRleCA9IGkgJSBtb2NrUXVlcmllcy5sZW5ndGg7XG4gICAgICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBgaGlzdC0ke2kgKyAxfWAsXG4gICAgICAgIHF1ZXJ5SWQ6IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdLmlkLFxuICAgICAgICBxdWVyeU5hbWU6IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdLm5hbWUsXG4gICAgICAgIGV4ZWN1dGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5yYW5kb20oKSAqIDAuNSArIDAuMSxcbiAgICAgICAgcm93Q291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyAxLFxuICAgICAgICB1c2VySWQ6ICd1c2VyMScsXG4gICAgICAgIHVzZXJOYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyxcbiAgICAgICAgc3RhdHVzOiBpICUgOCA9PT0gMCA/ICdGQUlMRUQnIDogJ1NVQ0NFU1MnLFxuICAgICAgICBlcnJvck1lc3NhZ2U6IGkgJSA4ID09PSAwID8gJ1x1NjdFNVx1OEJFMlx1NjI2N1x1ODg0Q1x1OEQ4NVx1NjVGNicgOiBudWxsXG4gICAgICB9O1xuICAgIH0pO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCB0b3RhbEl0ZW1zKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGhpc3Rvcmllcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICB0b3RhbDogdG90YWxJdGVtcyxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsSXRlbXMgLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyeVZlcnNpb25zKHF1ZXJ5SWQ6IHN0cmluZywgcGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgXG4gICAgaWYgKCFxdWVyeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7cXVlcnlJZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XG4gICAgcmV0dXJuIHF1ZXJ5LnZlcnNpb25zIHx8IFtdO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBxdWVyeUlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTcyNDhcdTY3MkNcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzW2luZGV4XTtcbiAgICBjb25zdCBuZXdWZXJzaW9uTnVtYmVyID0gKHF1ZXJ5LnZlcnNpb25zPy5sZW5ndGggfHwgMCkgKyAxO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICBjb25zdCBuZXdWZXJzaW9uID0ge1xuICAgICAgaWQ6IGB2ZXItJHtxdWVyeUlkfS0ke25ld1ZlcnNpb25OdW1iZXJ9YCxcbiAgICAgIHF1ZXJ5SWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiBuZXdWZXJzaW9uTnVtYmVyLFxuICAgICAgbmFtZTogZGF0YS5uYW1lIHx8IGBcdTcyNDhcdTY3MkMgJHtuZXdWZXJzaW9uTnVtYmVyfWAsXG4gICAgICBzcWw6IGRhdGEuc3FsIHx8IHF1ZXJ5LnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQgfHwgcXVlcnkuZGF0YVNvdXJjZUlkLFxuICAgICAgc3RhdHVzOiAnRFJBRlQnLFxuICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU0RTRCXHU1MjREXHU3MjQ4XHU2NzJDXHU3Njg0aXNMYXRlc3RcdTY4MDdcdTVGRDdcbiAgICBpZiAocXVlcnkudmVyc2lvbnMgJiYgcXVlcnkudmVyc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgcXVlcnkudmVyc2lvbnMgPSBxdWVyeS52ZXJzaW9ucy5tYXAodiA9PiAoe1xuICAgICAgICAuLi52LFxuICAgICAgICBpc0xhdGVzdDogZmFsc2VcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU2NUIwXHU3MjQ4XHU2NzJDXG4gICAgaWYgKCFxdWVyeS52ZXJzaW9ucykge1xuICAgICAgcXVlcnkudmVyc2lvbnMgPSBbXTtcbiAgICB9XG4gICAgcXVlcnkudmVyc2lvbnMucHVzaChuZXdWZXJzaW9uKTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkNcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiBuZXdWZXJzaW9uLFxuICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBuZXdWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTNEMVx1NUUwM1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgcHVibGlzaFF1ZXJ5VmVyc2lvbih2ZXJzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NTMwNVx1NTQyQlx1NkI2NFx1NzI0OFx1NjcyQ1x1NzY4NFx1NjdFNVx1OEJFMlxuICAgIGxldCBxdWVyeSA9IG51bGw7XG4gICAgbGV0IHZlcnNpb25JbmRleCA9IC0xO1xuICAgIGxldCBxdWVyeUluZGV4ID0gLTE7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2NrUXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zKSB7XG4gICAgICAgIGNvbnN0IHZJbmRleCA9IG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zLmZpbmRJbmRleCh2ID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgICAgIGlmICh2SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgcXVlcnkgPSBtb2NrUXVlcmllc1tpXTtcbiAgICAgICAgICB2ZXJzaW9uSW5kZXggPSB2SW5kZXg7XG4gICAgICAgICAgcXVlcnlJbmRleCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKCFxdWVyeSB8fCB2ZXJzaW9uSW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHt2ZXJzaW9uSWR9XHU3Njg0XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NzI0OFx1NjcyQ1x1NzJCNlx1NjAwMVxuICAgIGNvbnN0IHVwZGF0ZWRWZXJzaW9uID0ge1xuICAgICAgLi4ucXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBwdWJsaXNoZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdID0gdXBkYXRlZFZlcnNpb247XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU3MkI2XHU2MDAxXG4gICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBjdXJyZW50VmVyc2lvbjogdXBkYXRlZFZlcnNpb24sXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NUU5Rlx1NUYwM1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgZGVwcmVjYXRlUXVlcnlWZXJzaW9uKHZlcnNpb25JZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU1MzA1XHU1NDJCXHU2QjY0XHU3MjQ4XHU2NzJDXHU3Njg0XHU2N0U1XHU4QkUyXG4gICAgbGV0IHF1ZXJ5ID0gbnVsbDtcbiAgICBsZXQgdmVyc2lvbkluZGV4ID0gLTE7XG4gICAgbGV0IHF1ZXJ5SW5kZXggPSAtMTtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vY2tRdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMpIHtcbiAgICAgICAgY29uc3QgdkluZGV4ID0gbW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMuZmluZEluZGV4KHYgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICAgICAgaWYgKHZJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBxdWVyeSA9IG1vY2tRdWVyaWVzW2ldO1xuICAgICAgICAgIHZlcnNpb25JbmRleCA9IHZJbmRleDtcbiAgICAgICAgICBxdWVyeUluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoIXF1ZXJ5IHx8IHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU3MjQ4XHU2NzJDXHU3MkI2XHU2MDAxXG4gICAgY29uc3QgdXBkYXRlZFZlcnNpb24gPSB7XG4gICAgICAuLi5xdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdLFxuICAgICAgc3RhdHVzOiAnREVQUkVDQVRFRCcsXG4gICAgICBkZXByZWNhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSA9IHVwZGF0ZWRWZXJzaW9uO1xuICAgIFxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NUU5Rlx1NUYwM1x1NzY4NFx1NjYyRlx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1x1RkYwQ1x1NTIxOVx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NzJCNlx1NjAwMVxuICAgIGlmIChxdWVyeS5jdXJyZW50VmVyc2lvbiAmJiBxdWVyeS5jdXJyZW50VmVyc2lvbi5pZCA9PT0gdmVyc2lvbklkKSB7XG4gICAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgICAgLi4ucXVlcnksXG4gICAgICAgIHN0YXR1czogJ0RFUFJFQ0FURUQnLFxuICAgICAgICBjdXJyZW50VmVyc2lvbjogdXBkYXRlZFZlcnNpb24sXG4gICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgICAgLi4ucXVlcnksXG4gICAgICAgIHZlcnNpb25zOiBxdWVyeS52ZXJzaW9ucyxcbiAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB1cGRhdGVkVmVyc2lvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTZGQzBcdTZEM0JcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgICovXG4gIGFzeW5jIGFjdGl2YXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQ6IHN0cmluZywgdmVyc2lvbklkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeUluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgXG4gICAgaWYgKHF1ZXJ5SW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NzI0OFx1NjcyQ1xuICAgIGlmICghcXVlcnkudmVyc2lvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2N0U1XHU4QkUyICR7cXVlcnlJZH0gXHU2Q0ExXHU2NzA5XHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHZlcnNpb25JbmRleCA9IHF1ZXJ5LnZlcnNpb25zLmZpbmRJbmRleCh2ID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgXG4gICAgaWYgKHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU4OTgxXHU2RkMwXHU2RDNCXHU3Njg0XHU3MjQ4XHU2NzJDXG4gICAgY29uc3QgdmVyc2lvblRvQWN0aXZhdGUgPSBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1x1NTQ4Q1x1NjdFNVx1OEJFMlx1NzJCNlx1NjAwMVxuICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgLi4ucXVlcnksXG4gICAgICBjdXJyZW50VmVyc2lvbjogdmVyc2lvblRvQWN0aXZhdGUsXG4gICAgICBzdGF0dXM6IHZlcnNpb25Ub0FjdGl2YXRlLnN0YXR1cyxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdmVyc2lvblRvQWN0aXZhdGU7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHF1ZXJ5U2VydmljZTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvaW50ZWdyYXRpb24udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvaW50ZWdyYXRpb24udHNcIjsvKipcbiAqIFx1OTZDNlx1NjIxMFx1NjcwRFx1NTJBMU1vY2tcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU5NkM2XHU2MjEwQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKi9cblxuLy8gXHU2QTIxXHU2MkRGXHU5NkM2XHU2MjEwXG5leHBvcnQgY29uc3QgbW9ja0ludGVncmF0aW9ucyA9IFtcbiAge1xuICAgIGlkOiAnaW50ZWdyYXRpb24tMScsXG4gICAgbmFtZTogJ1x1NzkzQVx1NEY4QlJFU1QgQVBJJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4QlJFU1QgQVBJXHU2NzBEXHU1MkExJyxcbiAgICB0eXBlOiAnUkVTVCcsXG4gICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tL3YxJyxcbiAgICBhdXRoVHlwZTogJ0JBU0lDJyxcbiAgICB1c2VybmFtZTogJ2FwaV91c2VyJyxcbiAgICBwYXNzd29yZDogJyoqKioqKioqJyxcbiAgICBzdGF0dXM6ICdBQ1RJVkUnLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGVuZHBvaW50czogW1xuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTEnLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU3NTI4XHU2MjM3XHU1MjE3XHU4ODY4JyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy91c2VycycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MjQwXHU2NzA5XHU3NTI4XHU2MjM3XHU3Njg0XHU1MjE3XHU4ODY4J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC0yJyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NzUyOFx1NjIzNycsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvdXNlcnMve2lkfScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2ODM5XHU2MzZFSURcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTc1MjhcdTYyMzcnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgaWQ6ICdpbnRlZ3JhdGlvbi0yJyxcbiAgICBuYW1lOiAnXHU1OTI5XHU2QzE0QVBJJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNUFQSScsXG4gICAgdHlwZTogJ1JFU1QnLFxuICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS53ZWF0aGVyLmNvbScsXG4gICAgYXV0aFR5cGU6ICdBUElfS0VZJyxcbiAgICBhcGlLZXk6ICcqKioqKioqKicsXG4gICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDQzMjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBlbmRwb2ludHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC0zJyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NTkyOVx1NkMxNCcsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvY3VycmVudCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MzA3XHU1QjlBXHU0RjREXHU3RjZFXHU3Njg0XHU1RjUzXHU1MjREXHU1OTI5XHU2QzE0J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC00JyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNScsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvZm9yZWNhc3QnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjcyQVx1Njc2NTdcdTU5MjlcdTc2ODRcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgaWQ6ICdpbnRlZ3JhdGlvbi0zJyxcbiAgICBuYW1lOiAnXHU2NTJGXHU0RUQ4XHU3RjUxXHU1MTczJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NjUyRlx1NEVEOFx1NTkwNFx1NzQwNkFQSScsXG4gICAgdHlwZTogJ1JFU1QnLFxuICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS5wYXltZW50LmNvbScsXG4gICAgYXV0aFR5cGU6ICdPQVVUSDInLFxuICAgIGNsaWVudElkOiAnY2xpZW50MTIzJyxcbiAgICBjbGllbnRTZWNyZXQ6ICcqKioqKioqKicsXG4gICAgc3RhdHVzOiAnSU5BQ1RJVkUnLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgZW5kcG9pbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtNScsXG4gICAgICAgIG5hbWU6ICdcdTUyMUJcdTVFRkFcdTY1MkZcdTRFRDgnLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgcGF0aDogJy9wYXltZW50cycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU1MjFCXHU1RUZBXHU2NUIwXHU3Njg0XHU2NTJGXHU0RUQ4XHU4QkY3XHU2QzQyJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC02JyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NjUyRlx1NEVEOFx1NzJCNlx1NjAwMScsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvcGF5bWVudHMve2lkfScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2OEMwXHU2N0U1XHU2NTJGXHU0RUQ4XHU3MkI2XHU2MDAxJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC03JyxcbiAgICAgICAgbmFtZTogJ1x1OTAwMFx1NkIzRScsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0vcmVmdW5kJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTU5MDRcdTc0MDZcdTkwMDBcdTZCM0VcdThCRjdcdTZDNDInXG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xuXG4vLyBcdTkxQ0RcdTdGNkVcdTk2QzZcdTYyMTBcdTY1NzBcdTYzNkVcbmV4cG9ydCBmdW5jdGlvbiByZXNldEludGVncmF0aW9ucygpOiB2b2lkIHtcbiAgLy8gXHU0RkREXHU3NTU5XHU1RjE1XHU3NTI4XHVGRjBDXHU1M0VBXHU5MUNEXHU3RjZFXHU1MTg1XHU1QkI5XG4gIHdoaWxlIChtb2NrSW50ZWdyYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICBtb2NrSW50ZWdyYXRpb25zLnBvcCgpO1xuICB9XG4gIFxuICAvLyBcdTkxQ0RcdTY1QjBcdTc1MUZcdTYyMTBcdTk2QzZcdTYyMTBcdTY1NzBcdTYzNkVcbiAgW1xuICAgIHtcbiAgICAgIGlkOiAnaW50ZWdyYXRpb24tMScsXG4gICAgICBuYW1lOiAnXHU3OTNBXHU0RjhCUkVTVCBBUEknLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTc5M0FcdTRGOEJSRVNUIEFQSVx1NjcwRFx1NTJBMScsXG4gICAgICB0eXBlOiAnUkVTVCcsXG4gICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20vdjEnLFxuICAgICAgYXV0aFR5cGU6ICdCQVNJQycsXG4gICAgICB1c2VybmFtZTogJ2FwaV91c2VyJyxcbiAgICAgIHBhc3N3b3JkOiAnKioqKioqKionLFxuICAgICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmRwb2ludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtMScsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NzUyOFx1NjIzN1x1NTIxN1x1ODg2OCcsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL3VzZXJzJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjI0MFx1NjcwOVx1NzUyOFx1NjIzN1x1NzY4NFx1NTIxN1x1ODg2OCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtMicsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NzUyOFx1NjIzNycsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL3VzZXJzL3tpZH0nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2ODM5XHU2MzZFSURcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTc1MjhcdTYyMzcnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnaW50ZWdyYXRpb24tMicsXG4gICAgICBuYW1lOiAnXHU1OTI5XHU2QzE0QVBJJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1QVBJJyxcbiAgICAgIHR5cGU6ICdSRVNUJyxcbiAgICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS53ZWF0aGVyLmNvbScsXG4gICAgICBhdXRoVHlwZTogJ0FQSV9LRVknLFxuICAgICAgYXBpS2V5OiAnKioqKioqKionLFxuICAgICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA0MzIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmRwb2ludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtMycsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NTkyOVx1NkMxNCcsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL2N1cnJlbnQnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MzA3XHU1QjlBXHU0RjREXHU3RjZFXHU3Njg0XHU1RjUzXHU1MjREXHU1OTI5XHU2QzE0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC00JyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1JyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvZm9yZWNhc3QnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2NzJBXHU2NzY1N1x1NTkyOVx1NzY4NFx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdpbnRlZ3JhdGlvbi0zJyxcbiAgICAgIG5hbWU6ICdcdTY1MkZcdTRFRDhcdTdGNTFcdTUxNzMnLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY1MkZcdTRFRDhcdTU5MDRcdTc0MDZBUEknLFxuICAgICAgdHlwZTogJ1JFU1QnLFxuICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLnBheW1lbnQuY29tJyxcbiAgICAgIGF1dGhUeXBlOiAnT0FVVEgyJyxcbiAgICAgIGNsaWVudElkOiAnY2xpZW50MTIzJyxcbiAgICAgIGNsaWVudFNlY3JldDogJyoqKioqKioqJyxcbiAgICAgIHN0YXR1czogJ0lOQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZHBvaW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC01JyxcbiAgICAgICAgICBuYW1lOiAnXHU1MjFCXHU1RUZBXHU2NTJGXHU0RUQ4JyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBwYXRoOiAnL3BheW1lbnRzJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NFx1NjUyRlx1NEVEOFx1OEJGN1x1NkM0MidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtNicsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NjUyRlx1NEVEOFx1NzJCNlx1NjAwMScsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2OEMwXHU2N0U1XHU2NTJGXHU0RUQ4XHU3MkI2XHU2MDAxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC03JyxcbiAgICAgICAgICBuYW1lOiAnXHU5MDAwXHU2QjNFJyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0vcmVmdW5kJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTkwNFx1NzQwNlx1OTAwMFx1NkIzRVx1OEJGN1x1NkM0MidcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXS5mb3JFYWNoKGl0ZW0gPT4gbW9ja0ludGVncmF0aW9ucy5wdXNoKGl0ZW0pKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbW9ja0ludGVncmF0aW9uczsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2ludGVncmF0aW9uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbnRlZ3JhdGlvbi50c1wiOy8qKlxuICogXHU5NkM2XHU2MjEwTW9ja1x1NjcwRFx1NTJBMVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTk2QzZcdTYyMTBcdTc2RjhcdTUxNzNBUElcdTc2ODRcdTZBMjFcdTYyREZcdTVCOUVcdTczQjBcbiAqL1xuXG5pbXBvcnQgeyBkZWxheSwgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLCBjcmVhdGVNb2NrUmVzcG9uc2UsIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IG1vY2tJbnRlZ3JhdGlvbnMgfSBmcm9tICcuLi9kYXRhL2ludGVncmF0aW9uJztcblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXlUaW1lID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIGRlbGF5KGRlbGF5VGltZSk7XG59XG5cbi8qKlxuICogXHU5NkM2XHU2MjEwXHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IGludGVncmF0aW9uU2VydmljZSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1OTZDNlx1NjIxMFx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0SW50ZWdyYXRpb25zKHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICAgIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLm1vY2tJbnRlZ3JhdGlvbnNdO1xuICAgIFxuICAgIC8vIFx1NjMwOVx1NTQwRFx1NzlGMFx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/Lm5hbWUpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSBwYXJhbXMubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGkgPT4gXG4gICAgICAgIGkubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgICAoaS5kZXNjcmlwdGlvbiAmJiBpLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy50eXBlKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiBpLnR5cGUgPT09IHBhcmFtcy50eXBlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU3MkI2XHU2MDAxXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiBpLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgZ2V0SW50ZWdyYXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IGludGVncmF0aW9uID0gbW9ja0ludGVncmF0aW9ucy5maW5kKGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghaW50ZWdyYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1OTZDNlx1NjIxMGApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gaW50ZWdyYXRpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU5NkM2XHU2MjEwXG4gICAqL1xuICBhc3luYyBjcmVhdGVJbnRlZ3JhdGlvbihkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBuZXdJZCA9IGBpbnRlZ3JhdGlvbi0ke0RhdGUubm93KCl9YDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgY29uc3QgbmV3SW50ZWdyYXRpb24gPSB7XG4gICAgICBpZDogbmV3SWQsXG4gICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgJ1x1NjVCMFx1OTZDNlx1NjIxMCcsXG4gICAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICAgIHR5cGU6IGRhdGEudHlwZSB8fCAnUkVTVCcsXG4gICAgICBiYXNlVXJsOiBkYXRhLmJhc2VVcmwgfHwgJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tJyxcbiAgICAgIGF1dGhUeXBlOiBkYXRhLmF1dGhUeXBlIHx8ICdOT05FJyxcbiAgICAgIHN0YXR1czogJ0FDVElWRScsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgZW5kcG9pbnRzOiBkYXRhLmVuZHBvaW50cyB8fCBbXVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2ODM5XHU2MzZFXHU4QkE0XHU4QkMxXHU3QzdCXHU1NzhCXHU2REZCXHU1MkEwXHU3NkY4XHU1RTk0XHU1QjU3XHU2QkI1XG4gICAgaWYgKGRhdGEuYXV0aFR5cGUgPT09ICdCQVNJQycpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obmV3SW50ZWdyYXRpb24sIHtcbiAgICAgICAgdXNlcm5hbWU6IGRhdGEudXNlcm5hbWUgfHwgJ3VzZXInLFxuICAgICAgICBwYXNzd29yZDogZGF0YS5wYXNzd29yZCB8fCAnKioqKioqKionXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGRhdGEuYXV0aFR5cGUgPT09ICdBUElfS0VZJykge1xuICAgICAgT2JqZWN0LmFzc2lnbihuZXdJbnRlZ3JhdGlvbiwge1xuICAgICAgICBhcGlLZXk6IGRhdGEuYXBpS2V5IHx8ICcqKioqKioqKidcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5hdXRoVHlwZSA9PT0gJ09BVVRIMicpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obmV3SW50ZWdyYXRpb24sIHtcbiAgICAgICAgY2xpZW50SWQ6IGRhdGEuY2xpZW50SWQgfHwgJ2NsaWVudCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogZGF0YS5jbGllbnRTZWNyZXQgfHwgJyoqKioqKioqJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NkRGQlx1NTJBMFx1NTIzMFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVxuICAgIG1vY2tJbnRlZ3JhdGlvbnMucHVzaChuZXdJbnRlZ3JhdGlvbik7XG4gICAgXG4gICAgcmV0dXJuIG5ld0ludGVncmF0aW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgdXBkYXRlSW50ZWdyYXRpb24oaWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW5kZXggPSBtb2NrSW50ZWdyYXRpb25zLmZpbmRJbmRleChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXG4gICAgY29uc3QgdXBkYXRlZEludGVncmF0aW9uID0ge1xuICAgICAgLi4ubW9ja0ludGVncmF0aW9uc1tpbmRleF0sXG4gICAgICAuLi5kYXRhLFxuICAgICAgaWQsIC8vIFx1Nzg2RVx1NEZERElEXHU0RTBEXHU1M0Q4XG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gICAgbW9ja0ludGVncmF0aW9uc1tpbmRleF0gPSB1cGRhdGVkSW50ZWdyYXRpb247XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRJbnRlZ3JhdGlvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTk2QzZcdTYyMTBcbiAgICovXG4gIGFzeW5jIGRlbGV0ZUludGVncmF0aW9uKGlkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW5kZXggPSBtb2NrSW50ZWdyYXRpb25zLmZpbmRJbmRleChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU0RUNFXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU0RTJEXHU1MjIwXHU5NjY0XG4gICAgbW9ja0ludGVncmF0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIFxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NkQ0Qlx1OEJENVx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgdGVzdEludGVncmF0aW9uKGlkOiBzdHJpbmcsIHBhcmFtczogYW55ID0ge30pOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG1vY2tJbnRlZ3JhdGlvbnMuZmluZChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIWludGVncmF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU2QTIxXHU2MkRGXHU2RDRCXHU4QkQ1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICByZXN1bHRUeXBlOiAnSlNPTicsXG4gICAgICBqc29uUmVzcG9uc2U6IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6ICdcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTYyMTBcdTUyOUYnLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIHJlc3BvbnNlVGltZTogTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwKSArIDUwLFxuICAgICAgICAgIHNlcnZlckluZm86ICdNb2NrIFNlcnZlciB2MS4wJyxcbiAgICAgICAgICBlbmRwb2ludDogcGFyYW1zLmVuZHBvaW50IHx8IGludGVncmF0aW9uLmVuZHBvaW50c1swXT8ucGF0aCB8fCAnLydcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogQXJyYXkuZnJvbSh7IGxlbmd0aDogMyB9LCAoXywgaSkgPT4gKHtcbiAgICAgICAgICBpZDogaSArIDEsXG4gICAgICAgICAgbmFtZTogYFx1NjgzN1x1NjcyQ1x1NjU3MFx1NjM2RSAke2kgKyAxfWAsXG4gICAgICAgICAgdmFsdWU6IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDApIC8gMTBcbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTk2QzZcdTYyMTBcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM6IGFueSA9IHt9KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW50ZWdyYXRpb24gPSBtb2NrSW50ZWdyYXRpb25zLmZpbmQoaSA9PiBpLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFpbnRlZ3JhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU5NkM2XHU2MjEwYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NkEyMVx1NjJERlx1NjI2N1x1ODg0Q1x1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgcmVzdWx0VHlwZTogJ0pTT04nLFxuICAgICAganNvblJlc3BvbnNlOiB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgcXVlcnk6IHBhcmFtcy5xdWVyeSB8fCAnXHU5RUQ4XHU4QkE0XHU2N0U1XHU4QkUyJyxcbiAgICAgICAgZGF0YTogQXJyYXkuZnJvbSh7IGxlbmd0aDogNSB9LCAoXywgaSkgPT4gKHtcbiAgICAgICAgICBpZDogYHJlY29yZC0ke2kgKyAxfWAsXG4gICAgICAgICAgbmFtZTogYFx1OEJCMFx1NUY1NSAke2kgKyAxfWAsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTY3RTVcdThCRTJcdThGRDRcdTU2REVcdTc2ODRcdThCQjBcdTVGNTUgJHtpICsgMX1gLFxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICB0eXBlOiBpICUgMiA9PT0gMCA/ICdBJyA6ICdCJyxcbiAgICAgICAgICAgIHZhbHVlOiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDApLFxuICAgICAgICAgICAgYWN0aXZlOiBpICUgMyAhPT0gMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgaW50ZWdyYXRpb25TZXJ2aWNlOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5NkM2XHU0RTJEXHU1QkZDXHU1MUZBXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1N0VERlx1NEUwMFx1NzY4NEFQSSBNb2NrXHU2NzBEXHU1MkExXHU1MTY1XHU1M0UzXHU3MEI5XG4gKi9cblxuLy8gXHU1QkZDXHU1MTY1XHU2NTcwXHU2MzZFXHU2RTkwXHU2NzBEXHU1MkExXG5pbXBvcnQgZGF0YVNvdXJjZSBmcm9tICcuL2RhdGFzb3VyY2UnO1xuLy8gXHU1QkZDXHU1MTY1XHU1QjhDXHU2NTc0XHU3Njg0XHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExXHU1QjlFXHU3M0IwXG5pbXBvcnQgcXVlcnlTZXJ2aWNlSW1wbGVtZW50YXRpb24gZnJvbSAnLi9xdWVyeSc7XG4vLyBcdTVCRkNcdTUxNjVcdTk2QzZcdTYyMTBcdTY3MERcdTUyQTFcbmltcG9ydCBpbnRlZ3JhdGlvblNlcnZpY2VJbXBsZW1lbnRhdGlvbiBmcm9tICcuL2ludGVncmF0aW9uJztcblxuLy8gXHU1QkZDXHU1MTY1XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG5pbXBvcnQgeyBcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLCBcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsIFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5IFxufSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFNb2NrXG4gKiBAZGVwcmVjYXRlZCBcdTRGN0ZcdTc1MjhcdTRFQ0UgJy4vcXVlcnknIFx1NUJGQ1x1NTE2NVx1NzY4NFx1NUI4Q1x1NjU3NFx1NUI5RVx1NzNCMFx1NEVFM1x1NjZGRlxuICovXG5jb25zdCBxdWVyeSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcmllcyhwYXJhbXM6IHsgcGFnZTogbnVtYmVyOyBzaXplOiBudW1iZXI7IH0pIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2Uoe1xuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBpZDogJ3ExJywgbmFtZTogJ1x1NzUyOFx1NjIzN1x1NTIwNlx1Njc5MFx1NjdFNVx1OEJFMicsIGRlc2NyaXB0aW9uOiAnXHU2MzA5XHU1NzMwXHU1MzNBXHU3RURGXHU4QkExXHU3NTI4XHU2MjM3XHU2Q0U4XHU1MThDXHU2NTcwXHU2MzZFJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgICAgeyBpZDogJ3EyJywgbmFtZTogJ1x1OTUwMFx1NTUyRVx1NEUxQVx1N0VFOVx1NjdFNVx1OEJFMicsIGRlc2NyaXB0aW9uOiAnXHU2MzA5XHU2NzA4XHU3RURGXHU4QkExXHU5NTAwXHU1NTJFXHU5ODlEJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgICAgeyBpZDogJ3EzJywgbmFtZTogJ1x1NUU5M1x1NUI1OFx1NTIwNlx1Njc5MCcsIGRlc2NyaXB0aW9uOiAnXHU3NkQxXHU2M0E3XHU1RTkzXHU1QjU4XHU2QzM0XHU1RTczJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgIF0sXG4gICAgICB0b3RhbDogMyxcbiAgICAgIHBhZ2U6IHBhcmFtcy5wYWdlLFxuICAgICAgc2l6ZTogcGFyYW1zLnNpemVcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBnZXRRdWVyeShpZDogc3RyaW5nKSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQsXG4gICAgICBuYW1lOiAnXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyJyxcbiAgICAgIHNxbDogJ1NFTEVDVCAqIEZST00gdXNlcnMgV0hFUkUgc3RhdHVzID0gJDEnLFxuICAgICAgcGFyYW1ldGVyczogWydhY3RpdmUnXSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGNyZWF0ZVF1ZXJ5KGRhdGE6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBgcXVlcnktJHtEYXRlLm5vdygpfWAsXG4gICAgICAuLi5kYXRhLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgdXBkYXRlUXVlcnkoaWQ6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQsXG4gICAgICAuLi5kYXRhLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGRlbGV0ZVF1ZXJ5KGlkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBleGVjdXRlUXVlcnkoaWQ6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBjb2x1bW5zOiBbJ2lkJywgJ25hbWUnLCAnZW1haWwnLCAnc3RhdHVzJ10sXG4gICAgICByb3dzOiBbXG4gICAgICAgIHsgaWQ6IDEsIG5hbWU6ICdcdTVGMjBcdTRFMDknLCBlbWFpbDogJ3poYW5nQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICAgICAgICB7IGlkOiAyLCBuYW1lOiAnXHU2NzRFXHU1NkRCJywgZW1haWw6ICdsaUBleGFtcGxlLmNvbScsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgICAgICAgeyBpZDogMywgbmFtZTogJ1x1NzM4Qlx1NEU5NCcsIGVtYWlsOiAnd2FuZ0BleGFtcGxlLmNvbScsIHN0YXR1czogJ2luYWN0aXZlJyB9LFxuICAgICAgXSxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIGV4ZWN1dGlvblRpbWU6IDAuMjM1LFxuICAgICAgICByb3dDb3VudDogMyxcbiAgICAgICAgdG90YWxQYWdlczogMVxuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG5cbi8qKlxuICogXHU1QkZDXHU1MUZBXHU2MjQwXHU2NzA5XHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IHNlcnZpY2VzID0ge1xuICBkYXRhU291cmNlLFxuICBxdWVyeTogcXVlcnlTZXJ2aWNlSW1wbGVtZW50YXRpb24sXG4gIGludGVncmF0aW9uOiBpbnRlZ3JhdGlvblNlcnZpY2VJbXBsZW1lbnRhdGlvblxufTtcblxuLy8gXHU1QkZDXHU1MUZBbW9jayBzZXJ2aWNlXHU1REU1XHU1MTc3XG5leHBvcnQge1xuICBjcmVhdGVNb2NrUmVzcG9uc2UsXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5XG59O1xuXG4vLyBcdTVCRkNcdTUxRkFcdTU0MDRcdTRFMkFcdTY3MERcdTUyQTFcbmV4cG9ydCBjb25zdCBkYXRhU291cmNlU2VydmljZSA9IHNlcnZpY2VzLmRhdGFTb3VyY2U7XG5leHBvcnQgY29uc3QgcXVlcnlTZXJ2aWNlID0gc2VydmljZXMucXVlcnk7XG5leHBvcnQgY29uc3QgaW50ZWdyYXRpb25TZXJ2aWNlID0gc2VydmljZXMuaW50ZWdyYXRpb247XG5cbi8vIFx1OUVEOFx1OEJBNFx1NUJGQ1x1NTFGQVx1NjI0MFx1NjcwOVx1NjcwRFx1NTJBMVxuZXhwb3J0IGRlZmF1bHQgc2VydmljZXM7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHNcIjtpbXBvcnQgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgKiBhcyBodHRwIGZyb20gJ2h0dHAnO1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NEUwMFx1NEUyQVx1N0I4MFx1NTM1NVx1NzY4NFx1NkQ0Qlx1OEJENVx1NEUyRFx1OTVGNFx1NEVGNlxuICogXHU1M0VBXHU1OTA0XHU3NDA2L2FwaS90ZXN0XHU4REVGXHU1Rjg0XHVGRjBDXHU3NTI4XHU0RThFXHU2RDRCXHU4QkQ1TW9ja1x1N0NGQlx1N0VERlx1NjYyRlx1NTQyNlx1NkI2M1x1NUUzOFx1NURFNVx1NEY1Q1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2ltcGxlTWlkZGxld2FyZSgpIHtcbiAgY29uc29sZS5sb2coJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NURGMlx1NTIxQlx1NUVGQVx1NkQ0Qlx1OEJENVx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NUMwNlx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFx1NzY4NFx1OEJGN1x1NkM0MicpO1xuICBcbiAgcmV0dXJuIGZ1bmN0aW9uIHNpbXBsZU1pZGRsZXdhcmUoXG4gICAgcmVxOiBodHRwLkluY29taW5nTWVzc2FnZSxcbiAgICByZXM6IGh0dHAuU2VydmVyUmVzcG9uc2UsXG4gICAgbmV4dDogQ29ubmVjdC5OZXh0RnVuY3Rpb25cbiAgKSB7XG4gICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kIHx8ICdVTktOT1dOJztcbiAgICBcbiAgICAvLyBcdTUzRUFcdTU5MDRcdTc0MDYvYXBpL3Rlc3RcdThERUZcdTVGODRcbiAgICBpZiAodXJsID09PSAnL2FwaS90ZXN0Jykge1xuICAgICAgY29uc29sZS5sb2coYFtcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NjUzNlx1NTIzMFx1NkQ0Qlx1OEJENVx1OEJGN1x1NkM0MjogJHttZXRob2R9ICR7dXJsfWApO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICAvLyBcdThCQkVcdTdGNkVDT1JTXHU1OTM0XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbicpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1OTA0XHU3NDA2T1BUSU9OU1x1OTg4NFx1NjhDMFx1OEJGN1x1NkM0MlxuICAgICAgICBpZiAobWV0aG9kID09PSAnT1BUSU9OUycpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1OTA0XHU3NDA2T1BUSU9OU1x1OTg4NFx1NjhDMFx1OEJGN1x1NkM0MicpO1xuICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjA0O1xuICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1Nzg2RVx1NEZERFx1ODk4Nlx1NzZENlx1NjM4OVx1NjI0MFx1NjcwOVx1NURGMlx1NjcwOVx1NzY4NENvbnRlbnQtVHlwZVx1RkYwQ1x1OTA3Rlx1NTE0RFx1ODhBQlx1NTQwRVx1N0VFRFx1NEUyRFx1OTVGNFx1NEVGNlx1NjZGNFx1NjUzOVxuICAgICAgICByZXMucmVtb3ZlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTUxQzZcdTU5MDdcdTU0Q0RcdTVFOTRcdTY1NzBcdTYzNkVcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogJ1x1N0I4MFx1NTM1NVx1NkQ0Qlx1OEJENVx1NEUyRFx1OTVGNFx1NEVGNlx1NTRDRFx1NUU5NFx1NjIxMFx1NTI5RicsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzLFxuICAgICAgICAgICAgcGFyYW1zOiB1cmwuaW5jbHVkZXMoJz8nKSA/IHVybC5zcGxpdCgnPycpWzFdIDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTNEMVx1OTAwMVx1NTRDRFx1NUU5NFx1NTI0RFx1Nzg2RVx1NEZERFx1NEUyRFx1NjVBRFx1OEJGN1x1NkM0Mlx1OTRGRVxuICAgICAgICBjb25zb2xlLmxvZygnW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1M0QxXHU5MDAxXHU2RDRCXHU4QkQ1XHU1NENEXHU1RTk0Jyk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VEYXRhLCBudWxsLCAyKSk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTRFMERcdThDMDNcdTc1MjhuZXh0KClcdUZGMENcdTc4NkVcdTRGRERcdThCRjdcdTZDNDJcdTUyMzBcdTZCNjRcdTdFRDNcdTY3NUZcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gXHU1OTA0XHU3NDA2XHU5NTE5XHU4QkVGXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NjVGNlx1NTFGQVx1OTUxOTonLCBlcnJvcik7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTZFMDVcdTk2NjRcdTVERjJcdTY3MDlcdTc2ODRcdTU5MzRcdUZGMENcdTkwN0ZcdTUxNERDb250ZW50LVR5cGVcdTg4QUJcdTY2RjRcdTY1MzlcbiAgICAgICAgcmVzLnJlbW92ZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiAnXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU2NUY2XHU1MUZBXHU5NTE5JyxcbiAgICAgICAgICBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpXG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NEUwRFx1OEMwM1x1NzUyOG5leHQoKVx1RkYwQ1x1Nzg2RVx1NEZERFx1OEJGN1x1NkM0Mlx1NTIzMFx1NkI2NFx1N0VEM1x1Njc1RlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NEUwRFx1NTkwNFx1NzQwNlx1NzY4NFx1OEJGN1x1NkM0Mlx1NEVBNFx1N0VEOVx1NEUwQlx1NEUwMFx1NEUyQVx1NEUyRFx1OTVGNFx1NEVGNlxuICAgIG5leHQoKTtcbiAgfTtcbn0gIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwWSxTQUFTLGNBQWMsZUFBZ0M7QUFDamMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGdCQUFnQjtBQUN6QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGtCQUFrQjs7O0FDSXpCLFNBQVMsYUFBYTs7O0FDRmYsU0FBUyxZQUFxQjtBQUNuQyxNQUFJO0FBRUYsUUFBSSxPQUFPLFlBQVksZUFBZSxRQUFRLEtBQUs7QUFDakQsVUFBSSxRQUFRLElBQUksc0JBQXNCLFFBQVE7QUFDNUMsZUFBTztBQUFBLE1BQ1Q7QUFDQSxVQUFJLFFBQVEsSUFBSSxzQkFBc0IsU0FBUztBQUM3QyxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFHQSxRQUFJLE9BQU8sZ0JBQWdCLGVBQWUsWUFBWSxLQUFLO0FBQ3pELFVBQUksWUFBWSxJQUFJLHNCQUFzQixRQUFRO0FBQ2hELGVBQU87QUFBQSxNQUNUO0FBQ0EsVUFBSSxZQUFZLElBQUksc0JBQXNCLFNBQVM7QUFDakQsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBR0EsUUFBSSxPQUFPLFdBQVcsZUFBZSxPQUFPLGNBQWM7QUFDeEQsWUFBTSxvQkFBb0IsYUFBYSxRQUFRLGNBQWM7QUFDN0QsVUFBSSxzQkFBc0IsUUFBUTtBQUNoQyxlQUFPO0FBQUEsTUFDVDtBQUNBLFVBQUksc0JBQXNCLFNBQVM7QUFDakMsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBR0EsVUFBTSxnQkFDSCxPQUFPLFlBQVksZUFBZSxRQUFRLE9BQU8sUUFBUSxJQUFJLGFBQWEsaUJBQzFFLE9BQU8sZ0JBQWdCLGVBQWUsWUFBWSxPQUFPLFlBQVksSUFBSSxRQUFRO0FBRXBGLFdBQU87QUFBQSxFQUNULFNBQVMsT0FBTztBQUVkLFlBQVEsS0FBSyx5R0FBOEIsS0FBSztBQUNoRCxXQUFPO0FBQUEsRUFDVDtBQUNGO0FBUU8sSUFBTSxhQUFhO0FBQUE7QUFBQSxFQUV4QixTQUFTLFVBQVU7QUFBQTtBQUFBLEVBR25CLE9BQU87QUFBQTtBQUFBLEVBR1AsYUFBYTtBQUFBO0FBQUEsRUFHYixVQUFVO0FBQUE7QUFBQSxFQUdWLFNBQVM7QUFBQSxJQUNQLGFBQWE7QUFBQSxJQUNiLFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUNQLGdCQUFnQjtBQUFBLEVBQ2xCO0FBQ0Y7QUFHTyxTQUFTLGtCQUFrQixLQUFzQjtBQUV0RCxNQUFJLENBQUMsV0FBVyxTQUFTO0FBQ3ZCLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxDQUFDLElBQUksV0FBVyxXQUFXLFdBQVcsR0FBRztBQUMzQyxXQUFPO0FBQUEsRUFDVDtBQUdBLFNBQU87QUFDVDtBQUdPLFNBQVMsUUFBUSxVQUFzQyxNQUFtQjtBQUMvRSxRQUFNLEVBQUUsU0FBUyxJQUFJO0FBRXJCLE1BQUksYUFBYTtBQUFRO0FBRXpCLE1BQUksVUFBVSxXQUFXLENBQUMsU0FBUyxRQUFRLE9BQU8sRUFBRSxTQUFTLFFBQVEsR0FBRztBQUN0RSxZQUFRLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSTtBQUFBLEVBQ3ZDLFdBQVcsVUFBVSxVQUFVLENBQUMsUUFBUSxPQUFPLEVBQUUsU0FBUyxRQUFRLEdBQUc7QUFDbkUsWUFBUSxLQUFLLGVBQWUsR0FBRyxJQUFJO0FBQUEsRUFDckMsV0FBVyxVQUFVLFdBQVcsYUFBYSxTQUFTO0FBQ3BELFlBQVEsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJO0FBQUEsRUFDckM7QUFDRjtBQUdBLElBQUk7QUFDRixVQUFRLElBQUksb0NBQWdCLFdBQVcsVUFBVSx1QkFBUSxvQkFBSyxFQUFFO0FBQ2hFLE1BQUksV0FBVyxTQUFTO0FBQ3RCLFlBQVEsSUFBSSx3QkFBYztBQUFBLE1BQ3hCLE9BQU8sV0FBVztBQUFBLE1BQ2xCLGFBQWEsV0FBVztBQUFBLE1BQ3hCLFVBQVUsV0FBVztBQUFBLE1BQ3JCLGdCQUFnQixPQUFPLFFBQVEsV0FBVyxPQUFPLEVBQzlDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTyxNQUFNLE9BQU8sRUFDaEMsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUk7QUFBQSxJQUN6QixDQUFDO0FBQUEsRUFDSDtBQUNGLFNBQVMsT0FBTztBQUNkLFVBQVEsS0FBSywyREFBbUIsS0FBSztBQUN2Qzs7O0FDMUZPLElBQU0sa0JBQWdDO0FBQUEsRUFDM0M7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxJQUNmLGNBQWMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQVEsRUFBRSxZQUFZO0FBQUEsSUFDMUQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFTLEVBQUUsWUFBWTtBQUFBLElBQ3hELFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sY0FBYztBQUFBLElBQ2QsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLElBQ2YsY0FBYyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksSUFBTyxFQUFFLFlBQVk7QUFBQSxJQUN6RCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFVLEVBQUUsWUFBWTtBQUFBLElBQ3pELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVMsRUFBRSxZQUFZO0FBQUEsSUFDeEQsVUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsSUFDZixjQUFjO0FBQUEsSUFDZCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFVLEVBQUUsWUFBWTtBQUFBLElBQ3pELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVMsRUFBRSxZQUFZO0FBQUEsSUFDeEQsVUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsSUFDZixjQUFjLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFTLEVBQUUsWUFBWTtBQUFBLElBQzNELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVUsRUFBRSxZQUFZO0FBQUEsSUFDekQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxVQUFVO0FBQUEsRUFDWjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxJQUNmLGNBQWMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVMsRUFBRSxZQUFZO0FBQUEsSUFDM0QsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksT0FBVyxFQUFFLFlBQVk7QUFBQSxJQUMxRCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFVLEVBQUUsWUFBWTtBQUFBLElBQ3pELFVBQVU7QUFBQSxFQUNaO0FBQ0Y7OztBQ3hHQSxJQUFJLGNBQWMsQ0FBQyxHQUFHLGVBQWU7QUFLckMsZUFBZSxnQkFBK0I7QUFDNUMsUUFBTUEsU0FBUSxPQUFPLFdBQVcsVUFBVSxXQUFXLFdBQVcsUUFBUTtBQUN4RSxTQUFPLElBQUksUUFBUSxhQUFXLFdBQVcsU0FBU0EsTUFBSyxDQUFDO0FBQzFEO0FBS08sU0FBUyxtQkFBeUI7QUFDdkMsZ0JBQWMsQ0FBQyxHQUFHLGVBQWU7QUFDbkM7QUFPQSxlQUFzQixlQUFlLFFBY2xDO0FBRUQsUUFBTSxjQUFjO0FBRXBCLFFBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBQzdCLFFBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBRzdCLE1BQUksZ0JBQWdCLENBQUMsR0FBRyxXQUFXO0FBR25DLE1BQUksaUNBQVEsTUFBTTtBQUNoQixVQUFNLFVBQVUsT0FBTyxLQUFLLFlBQVk7QUFDeEMsb0JBQWdCLGNBQWM7QUFBQSxNQUFPLFFBQ25DLEdBQUcsS0FBSyxZQUFZLEVBQUUsU0FBUyxPQUFPLEtBQ3JDLEdBQUcsZUFBZSxHQUFHLFlBQVksWUFBWSxFQUFFLFNBQVMsT0FBTztBQUFBLElBQ2xFO0FBQUEsRUFDRjtBQUdBLE1BQUksaUNBQVEsTUFBTTtBQUNoQixvQkFBZ0IsY0FBYyxPQUFPLFFBQU0sR0FBRyxTQUFTLE9BQU8sSUFBSTtBQUFBLEVBQ3BFO0FBR0EsTUFBSSxpQ0FBUSxRQUFRO0FBQ2xCLG9CQUFnQixjQUFjLE9BQU8sUUFBTSxHQUFHLFdBQVcsT0FBTyxNQUFNO0FBQUEsRUFDeEU7QUFHQSxRQUFNLFNBQVMsT0FBTyxLQUFLO0FBQzNCLFFBQU0sTUFBTSxLQUFLLElBQUksUUFBUSxNQUFNLGNBQWMsTUFBTTtBQUN2RCxRQUFNLGlCQUFpQixjQUFjLE1BQU0sT0FBTyxHQUFHO0FBR3JELFNBQU87QUFBQSxJQUNMLE9BQU87QUFBQSxJQUNQLFlBQVk7QUFBQSxNQUNWLE9BQU8sY0FBYztBQUFBLE1BQ3JCO0FBQUEsTUFDQTtBQUFBLE1BQ0EsWUFBWSxLQUFLLEtBQUssY0FBYyxTQUFTLElBQUk7QUFBQSxJQUNuRDtBQUFBLEVBQ0Y7QUFDRjtBQU9BLGVBQXNCLGNBQWMsSUFBaUM7QUFFbkUsUUFBTSxjQUFjO0FBR3BCLFFBQU0sYUFBYSxZQUFZLEtBQUssUUFBTSxHQUFHLE9BQU8sRUFBRTtBQUV0RCxNQUFJLENBQUMsWUFBWTtBQUNmLFVBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsMEJBQU07QUFBQSxFQUNuQztBQUVBLFNBQU87QUFDVDtBQU9BLGVBQXNCLGlCQUFpQixNQUFnRDtBQUVyRixRQUFNLGNBQWM7QUFHcEIsUUFBTSxRQUFRLE1BQU0sS0FBSyxJQUFJLENBQUM7QUFHOUIsUUFBTSxnQkFBNEI7QUFBQSxJQUNoQyxJQUFJO0FBQUEsSUFDSixNQUFNLEtBQUssUUFBUTtBQUFBLElBQ25CLGFBQWEsS0FBSyxlQUFlO0FBQUEsSUFDakMsTUFBTSxLQUFLLFFBQVE7QUFBQSxJQUNuQixNQUFNLEtBQUs7QUFBQSxJQUNYLE1BQU0sS0FBSztBQUFBLElBQ1gsY0FBYyxLQUFLO0FBQUEsSUFDbkIsVUFBVSxLQUFLO0FBQUEsSUFDZixRQUFRLEtBQUssVUFBVTtBQUFBLElBQ3ZCLGVBQWUsS0FBSyxpQkFBaUI7QUFBQSxJQUNyQyxjQUFjO0FBQUEsSUFDZCxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDbEMsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ2xDLFVBQVU7QUFBQSxFQUNaO0FBR0EsY0FBWSxLQUFLLGFBQWE7QUFFOUIsU0FBTztBQUNUO0FBUUEsZUFBc0IsaUJBQWlCLElBQVksTUFBZ0Q7QUFFakcsUUFBTSxjQUFjO0FBR3BCLFFBQU0sUUFBUSxZQUFZLFVBQVUsUUFBTSxHQUFHLE9BQU8sRUFBRTtBQUV0RCxNQUFJLFVBQVUsSUFBSTtBQUNoQixVQUFNLElBQUksTUFBTSw2QkFBUyxFQUFFLDBCQUFNO0FBQUEsRUFDbkM7QUFHQSxRQUFNLG9CQUFnQztBQUFBLElBQ3BDLEdBQUcsWUFBWSxLQUFLO0FBQUEsSUFDcEIsR0FBRztBQUFBLElBQ0gsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLEVBQ3BDO0FBR0EsY0FBWSxLQUFLLElBQUk7QUFFckIsU0FBTztBQUNUO0FBTUEsZUFBc0IsaUJBQWlCLElBQTJCO0FBRWhFLFFBQU0sY0FBYztBQUdwQixRQUFNLFFBQVEsWUFBWSxVQUFVLFFBQU0sR0FBRyxPQUFPLEVBQUU7QUFFdEQsTUFBSSxVQUFVLElBQUk7QUFDaEIsVUFBTSxJQUFJLE1BQU0sNkJBQVMsRUFBRSwwQkFBTTtBQUFBLEVBQ25DO0FBR0EsY0FBWSxPQUFPLE9BQU8sQ0FBQztBQUM3QjtBQU9BLGVBQXNCLGVBQWUsUUFJbEM7QUFFRCxRQUFNLGNBQWM7QUFJcEIsUUFBTSxVQUFVLEtBQUssT0FBTyxJQUFJO0FBRWhDLFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQSxTQUFTLFVBQVUsNkJBQVM7QUFBQSxJQUM1QixTQUFTLFVBQVU7QUFBQSxNQUNqQixjQUFjLEtBQUssTUFBTSxLQUFLLE9BQU8sSUFBSSxFQUFFLElBQUk7QUFBQSxNQUMvQyxTQUFTO0FBQUEsTUFDVCxjQUFjLEtBQUssTUFBTSxLQUFLLE9BQU8sSUFBSSxHQUFLLElBQUk7QUFBQSxJQUNwRCxJQUFJO0FBQUEsTUFDRixXQUFXO0FBQUEsTUFDWCxjQUFjO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQ0Y7QUFHQSxJQUFPLHFCQUFRO0FBQUEsRUFDYjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGOzs7QUMzSk8sU0FBUyxNQUFNLEtBQWEsS0FBb0I7QUFDckQsU0FBTyxJQUFJLFFBQVEsYUFBVyxXQUFXLFNBQVMsRUFBRSxDQUFDO0FBQ3ZEOzs7QUMxRUEsSUFBTSxjQUFjLE1BQU0sS0FBSyxFQUFFLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNO0FBQ3ZELFFBQU0sS0FBSyxTQUFTLElBQUksQ0FBQztBQUN6QixRQUFNLFlBQVksSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksS0FBUSxFQUFFLFlBQVk7QUFFbEUsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBLE1BQU0sNEJBQVEsSUFBSSxDQUFDO0FBQUEsSUFDbkIsYUFBYSx3Q0FBVSxJQUFJLENBQUM7QUFBQSxJQUM1QixVQUFVLElBQUksTUFBTSxJQUFJLGFBQWMsSUFBSSxNQUFNLElBQUksYUFBYTtBQUFBLElBQ2pFLGNBQWMsTUFBTyxJQUFJLElBQUssQ0FBQztBQUFBLElBQy9CLGdCQUFnQixzQkFBUSxJQUFJLElBQUssQ0FBQztBQUFBLElBQ2xDLFdBQVcsSUFBSSxNQUFNLElBQUksUUFBUTtBQUFBLElBQ2pDLFdBQVcsSUFBSSxNQUFNLElBQ25CLDBDQUEwQyxDQUFDLDRCQUMzQyxtQ0FBVSxJQUFJLE1BQU0sSUFBSSxpQkFBTyxjQUFJO0FBQUEsSUFDckMsUUFBUSxJQUFJLE1BQU0sSUFBSSxVQUFXLElBQUksTUFBTSxJQUFJLGNBQWUsSUFBSSxNQUFNLElBQUksZUFBZTtBQUFBLElBQzNGLGVBQWUsSUFBSSxNQUFNLElBQUksWUFBWTtBQUFBLElBQ3pDLFdBQVc7QUFBQSxJQUNYLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksS0FBUSxFQUFFLFlBQVk7QUFBQSxJQUMzRCxXQUFXLEVBQUUsSUFBSSxTQUFTLE1BQU0sMkJBQU87QUFBQSxJQUN2QyxXQUFXLEVBQUUsSUFBSSxTQUFTLE1BQU0sMkJBQU87QUFBQSxJQUN2QyxnQkFBZ0IsS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEVBQUU7QUFBQSxJQUM3QyxZQUFZLElBQUksTUFBTTtBQUFBLElBQ3RCLFVBQVUsSUFBSSxNQUFNO0FBQUEsSUFDcEIsZ0JBQWdCLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQU0sRUFBRSxZQUFZO0FBQUEsSUFDOUQsYUFBYSxLQUFLLE1BQU0sS0FBSyxPQUFPLElBQUksR0FBRyxJQUFJO0FBQUEsSUFDL0MsZUFBZSxLQUFLLE1BQU0sS0FBSyxPQUFPLElBQUksR0FBRyxJQUFJO0FBQUEsSUFDakQsTUFBTSxDQUFDLGVBQUssSUFBRSxDQUFDLElBQUksZUFBSyxJQUFJLENBQUMsRUFBRTtBQUFBLElBQy9CLGdCQUFnQjtBQUFBLE1BQ2QsSUFBSSxPQUFPLEVBQUU7QUFBQSxNQUNiLFNBQVM7QUFBQSxNQUNULGVBQWU7QUFBQSxNQUNmLE1BQU07QUFBQSxNQUNOLEtBQUssMENBQTBDLENBQUM7QUFBQSxNQUNoRCxjQUFjLE1BQU8sSUFBSSxJQUFLLENBQUM7QUFBQSxNQUMvQixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsTUFDVixXQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0EsVUFBVSxDQUFDO0FBQUEsTUFDVCxJQUFJLE9BQU8sRUFBRTtBQUFBLE1BQ2IsU0FBUztBQUFBLE1BQ1QsZUFBZTtBQUFBLE1BQ2YsTUFBTTtBQUFBLE1BQ04sS0FBSywwQ0FBMEMsQ0FBQztBQUFBLE1BQ2hELGNBQWMsTUFBTyxJQUFJLElBQUssQ0FBQztBQUFBLE1BQy9CLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLFdBQVc7QUFBQSxJQUNiLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQztBQW1FRCxlQUFlQyxpQkFBK0I7QUFDNUMsUUFBTSxZQUFZLE9BQU8sV0FBVyxVQUFVLFdBQVcsV0FBVyxRQUFRO0FBQzVFLFNBQU8sTUFBTSxTQUFTO0FBQ3hCO0FBS0EsSUFBTSxlQUFlO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFJbkIsTUFBTSxXQUFXLFFBQTRCO0FBQzNDLFVBQU1BLGVBQWM7QUFFcEIsVUFBTSxRQUFPLGlDQUFRLFNBQVE7QUFDN0IsVUFBTSxRQUFPLGlDQUFRLFNBQVE7QUFHN0IsUUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLFdBQVc7QUFHbkMsUUFBSSxpQ0FBUSxNQUFNO0FBQ2hCLFlBQU0sVUFBVSxPQUFPLEtBQUssWUFBWTtBQUN4QyxzQkFBZ0IsY0FBYztBQUFBLFFBQU8sT0FDbkMsRUFBRSxLQUFLLFlBQVksRUFBRSxTQUFTLE9BQU8sS0FDcEMsRUFBRSxlQUFlLEVBQUUsWUFBWSxZQUFZLEVBQUUsU0FBUyxPQUFPO0FBQUEsTUFDaEU7QUFBQSxJQUNGO0FBR0EsUUFBSSxpQ0FBUSxjQUFjO0FBQ3hCLHNCQUFnQixjQUFjLE9BQU8sT0FBSyxFQUFFLGlCQUFpQixPQUFPLFlBQVk7QUFBQSxJQUNsRjtBQUdBLFFBQUksaUNBQVEsUUFBUTtBQUNsQixzQkFBZ0IsY0FBYyxPQUFPLE9BQUssRUFBRSxXQUFXLE9BQU8sTUFBTTtBQUFBLElBQ3RFO0FBR0EsUUFBSSxpQ0FBUSxXQUFXO0FBQ3JCLHNCQUFnQixjQUFjLE9BQU8sT0FBSyxFQUFFLGNBQWMsT0FBTyxTQUFTO0FBQUEsSUFDNUU7QUFHQSxRQUFJLGlDQUFRLFlBQVk7QUFDdEIsc0JBQWdCLGNBQWMsT0FBTyxPQUFLLEVBQUUsZUFBZSxJQUFJO0FBQUEsSUFDakU7QUFHQSxVQUFNLFNBQVMsT0FBTyxLQUFLO0FBQzNCLFVBQU0sTUFBTSxLQUFLLElBQUksUUFBUSxNQUFNLGNBQWMsTUFBTTtBQUN2RCxVQUFNLGlCQUFpQixjQUFjLE1BQU0sT0FBTyxHQUFHO0FBR3JELFdBQU87QUFBQSxNQUNMLE9BQU87QUFBQSxNQUNQLFlBQVk7QUFBQSxRQUNWLE9BQU8sY0FBYztBQUFBLFFBQ3JCO0FBQUEsUUFDQTtBQUFBLFFBQ0EsWUFBWSxLQUFLLEtBQUssY0FBYyxTQUFTLElBQUk7QUFBQSxNQUNuRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLG1CQUFtQixRQUE0QjtBQUNuRCxVQUFNQSxlQUFjO0FBRXBCLFVBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBQzdCLFVBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBRzdCLFFBQUksa0JBQWtCLFlBQVksT0FBTyxPQUFLLEVBQUUsZUFBZSxJQUFJO0FBR25FLFNBQUksaUNBQVEsVUFBUSxpQ0FBUSxTQUFRO0FBQ2xDLFlBQU0sV0FBVyxPQUFPLFFBQVEsT0FBTyxVQUFVLElBQUksWUFBWTtBQUNqRSx3QkFBa0IsZ0JBQWdCO0FBQUEsUUFBTyxPQUN2QyxFQUFFLEtBQUssWUFBWSxFQUFFLFNBQVMsT0FBTyxLQUNwQyxFQUFFLGVBQWUsRUFBRSxZQUFZLFlBQVksRUFBRSxTQUFTLE9BQU87QUFBQSxNQUNoRTtBQUFBLElBQ0Y7QUFFQSxRQUFJLGlDQUFRLGNBQWM7QUFDeEIsd0JBQWtCLGdCQUFnQixPQUFPLE9BQUssRUFBRSxpQkFBaUIsT0FBTyxZQUFZO0FBQUEsSUFDdEY7QUFFQSxRQUFJLGlDQUFRLFFBQVE7QUFDbEIsd0JBQWtCLGdCQUFnQixPQUFPLE9BQUssRUFBRSxXQUFXLE9BQU8sTUFBTTtBQUFBLElBQzFFO0FBR0EsVUFBTSxTQUFTLE9BQU8sS0FBSztBQUMzQixVQUFNLE1BQU0sS0FBSyxJQUFJLFFBQVEsTUFBTSxnQkFBZ0IsTUFBTTtBQUN6RCxVQUFNLGlCQUFpQixnQkFBZ0IsTUFBTSxPQUFPLEdBQUc7QUFHdkQsV0FBTztBQUFBLE1BQ0wsT0FBTztBQUFBLE1BQ1AsWUFBWTtBQUFBLFFBQ1YsT0FBTyxnQkFBZ0I7QUFBQSxRQUN2QjtBQUFBLFFBQ0E7QUFBQSxRQUNBLFlBQVksS0FBSyxLQUFLLGdCQUFnQixTQUFTLElBQUk7QUFBQSxNQUNyRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLFNBQVMsSUFBMEI7QUFDdkMsVUFBTUEsZUFBYztBQUdwQixVQUFNLFFBQVEsWUFBWSxLQUFLLE9BQUssRUFBRSxPQUFPLEVBQUU7QUFFL0MsUUFBSSxDQUFDLE9BQU87QUFDVixZQUFNLElBQUksTUFBTSw2QkFBUyxFQUFFLG9CQUFLO0FBQUEsSUFDbEM7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxZQUFZLE1BQXlCO0FBQ3pDLFVBQU1BLGVBQWM7QUFHcEIsVUFBTSxLQUFLLFNBQVMsWUFBWSxTQUFTLENBQUM7QUFDMUMsVUFBTSxhQUFZLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBR3pDLFVBQU0sV0FBVztBQUFBLE1BQ2Y7QUFBQSxNQUNBLE1BQU0sS0FBSyxRQUFRLHNCQUFPLEVBQUU7QUFBQSxNQUM1QixhQUFhLEtBQUssZUFBZTtBQUFBLE1BQ2pDLFVBQVUsS0FBSyxZQUFZO0FBQUEsTUFDM0IsY0FBYyxLQUFLO0FBQUEsTUFDbkIsZ0JBQWdCLEtBQUssa0JBQWtCLHNCQUFPLEtBQUssWUFBWTtBQUFBLE1BQy9ELFdBQVcsS0FBSyxhQUFhO0FBQUEsTUFDN0IsV0FBVyxLQUFLLGFBQWE7QUFBQSxNQUM3QixRQUFRLEtBQUssVUFBVTtBQUFBLE1BQ3ZCLGVBQWUsS0FBSyxpQkFBaUI7QUFBQSxNQUNyQyxXQUFXO0FBQUEsTUFDWCxXQUFXO0FBQUEsTUFDWCxXQUFXLEtBQUssYUFBYSxFQUFFLElBQUksU0FBUyxNQUFNLDJCQUFPO0FBQUEsTUFDekQsV0FBVyxLQUFLLGFBQWEsRUFBRSxJQUFJLFNBQVMsTUFBTSwyQkFBTztBQUFBLE1BQ3pELGdCQUFnQjtBQUFBLE1BQ2hCLFlBQVksS0FBSyxjQUFjO0FBQUEsTUFDL0IsVUFBVSxLQUFLLFlBQVk7QUFBQSxNQUMzQixnQkFBZ0I7QUFBQSxNQUNoQixhQUFhO0FBQUEsTUFDYixlQUFlO0FBQUEsTUFDZixNQUFNLEtBQUssUUFBUSxDQUFDO0FBQUEsTUFDcEIsZ0JBQWdCO0FBQUEsUUFDZCxJQUFJLE9BQU8sRUFBRTtBQUFBLFFBQ2IsU0FBUztBQUFBLFFBQ1QsZUFBZTtBQUFBLFFBQ2YsTUFBTTtBQUFBLFFBQ04sS0FBSyxLQUFLLGFBQWE7QUFBQSxRQUN2QixjQUFjLEtBQUs7QUFBQSxRQUNuQixRQUFRO0FBQUEsUUFDUixVQUFVO0FBQUEsUUFDVixXQUFXO0FBQUEsTUFDYjtBQUFBLE1BQ0EsVUFBVSxDQUFDO0FBQUEsUUFDVCxJQUFJLE9BQU8sRUFBRTtBQUFBLFFBQ2IsU0FBUztBQUFBLFFBQ1QsZUFBZTtBQUFBLFFBQ2YsTUFBTTtBQUFBLFFBQ04sS0FBSyxLQUFLLGFBQWE7QUFBQSxRQUN2QixjQUFjLEtBQUs7QUFBQSxRQUNuQixRQUFRO0FBQUEsUUFDUixVQUFVO0FBQUEsUUFDVixXQUFXO0FBQUEsTUFDYixDQUFDO0FBQUEsSUFDSDtBQUdBLGdCQUFZLEtBQUssUUFBUTtBQUV6QixXQUFPO0FBQUEsRUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxZQUFZLElBQVksTUFBeUI7QUFDckQsVUFBTUEsZUFBYztBQUdwQixVQUFNLFFBQVEsWUFBWSxVQUFVLE9BQUssRUFBRSxPQUFPLEVBQUU7QUFFcEQsUUFBSSxVQUFVLElBQUk7QUFDaEIsWUFBTSxJQUFJLE1BQU0sNkJBQVMsRUFBRSxvQkFBSztBQUFBLElBQ2xDO0FBR0EsVUFBTSxlQUFlO0FBQUEsTUFDbkIsR0FBRyxZQUFZLEtBQUs7QUFBQSxNQUNwQixHQUFHO0FBQUEsTUFDSCxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsTUFDbEMsV0FBVyxLQUFLLGFBQWEsWUFBWSxLQUFLLEVBQUUsYUFBYSxFQUFFLElBQUksU0FBUyxNQUFNLDJCQUFPO0FBQUEsSUFDM0Y7QUFHQSxnQkFBWSxLQUFLLElBQUk7QUFFckIsV0FBTztBQUFBLEVBQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sWUFBWSxJQUEyQjtBQUMzQyxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sUUFBUSxZQUFZLFVBQVUsT0FBSyxFQUFFLE9BQU8sRUFBRTtBQUVwRCxRQUFJLFVBQVUsSUFBSTtBQUNoQixZQUFNLElBQUksTUFBTSw2QkFBUyxFQUFFLG9CQUFLO0FBQUEsSUFDbEM7QUFHQSxnQkFBWSxPQUFPLE9BQU8sQ0FBQztBQUFBLEVBQzdCO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLGFBQWEsSUFBWSxRQUE0QjtBQUN6RCxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sUUFBUSxZQUFZLEtBQUssT0FBSyxFQUFFLE9BQU8sRUFBRTtBQUUvQyxRQUFJLENBQUMsT0FBTztBQUNWLFlBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsb0JBQUs7QUFBQSxJQUNsQztBQUdBLFVBQU0sVUFBVSxDQUFDLE1BQU0sUUFBUSxTQUFTLFVBQVUsWUFBWTtBQUM5RCxVQUFNLE9BQU8sTUFBTSxLQUFLLEVBQUUsUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLE9BQU87QUFBQSxNQUNqRCxJQUFJLElBQUk7QUFBQSxNQUNSLE1BQU0sZ0JBQU0sSUFBSSxDQUFDO0FBQUEsTUFDakIsT0FBTyxPQUFPLElBQUksQ0FBQztBQUFBLE1BQ25CLFFBQVEsSUFBSSxNQUFNLElBQUksV0FBVztBQUFBLE1BQ2pDLFlBQVksSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksS0FBUSxFQUFFLFlBQVk7QUFBQSxJQUM5RCxFQUFFO0FBR0YsVUFBTSxRQUFRLFlBQVksVUFBVSxPQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ3BELFFBQUksVUFBVSxJQUFJO0FBQ2hCLGtCQUFZLEtBQUssSUFBSTtBQUFBLFFBQ25CLEdBQUcsWUFBWSxLQUFLO0FBQUEsUUFDcEIsaUJBQWlCLFlBQVksS0FBSyxFQUFFLGtCQUFrQixLQUFLO0FBQUEsUUFDM0QsaUJBQWdCLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsUUFDdkMsYUFBYSxLQUFLO0FBQUEsTUFDcEI7QUFBQSxJQUNGO0FBR0EsV0FBTztBQUFBLE1BQ0w7QUFBQSxNQUNBO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDUixlQUFlLEtBQUssT0FBTyxJQUFJLE1BQU07QUFBQSxRQUNyQyxVQUFVLEtBQUs7QUFBQSxRQUNmLFlBQVk7QUFBQSxNQUNkO0FBQUEsTUFDQSxPQUFPO0FBQUEsUUFDTCxJQUFJLE1BQU07QUFBQSxRQUNWLE1BQU0sTUFBTTtBQUFBLFFBQ1osY0FBYyxNQUFNO0FBQUEsTUFDdEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxlQUFlLElBQTBCO0FBQzdDLFVBQU1BLGVBQWM7QUFHcEIsVUFBTSxRQUFRLFlBQVksVUFBVSxPQUFLLEVBQUUsT0FBTyxFQUFFO0FBRXBELFFBQUksVUFBVSxJQUFJO0FBQ2hCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsb0JBQUs7QUFBQSxJQUNsQztBQUdBLGdCQUFZLEtBQUssSUFBSTtBQUFBLE1BQ25CLEdBQUcsWUFBWSxLQUFLO0FBQUEsTUFDcEIsWUFBWSxDQUFDLFlBQVksS0FBSyxFQUFFO0FBQUEsTUFDaEMsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ3BDO0FBRUEsV0FBTyxZQUFZLEtBQUs7QUFBQSxFQUMxQjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxnQkFBZ0IsUUFBNEI7QUFDaEQsVUFBTUEsZUFBYztBQUVwQixVQUFNLFFBQU8saUNBQVEsU0FBUTtBQUM3QixVQUFNLFFBQU8saUNBQVEsU0FBUTtBQUc3QixVQUFNLGFBQWE7QUFDbkIsVUFBTSxZQUFZLE1BQU0sS0FBSyxFQUFFLFFBQVEsV0FBVyxHQUFHLENBQUMsR0FBRyxNQUFNO0FBQzdELFlBQU0sWUFBWSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxJQUFPLEVBQUUsWUFBWTtBQUNqRSxZQUFNLGFBQWEsSUFBSSxZQUFZO0FBRW5DLGFBQU87QUFBQSxRQUNMLElBQUksUUFBUSxJQUFJLENBQUM7QUFBQSxRQUNqQixTQUFTLFlBQVksVUFBVSxFQUFFO0FBQUEsUUFDakMsV0FBVyxZQUFZLFVBQVUsRUFBRTtBQUFBLFFBQ25DLFlBQVk7QUFBQSxRQUNaLGVBQWUsS0FBSyxPQUFPLElBQUksTUFBTTtBQUFBLFFBQ3JDLFVBQVUsS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUFBLFFBQzVDLFFBQVE7QUFBQSxRQUNSLFVBQVU7QUFBQSxRQUNWLFFBQVEsSUFBSSxNQUFNLElBQUksV0FBVztBQUFBLFFBQ2pDLGNBQWMsSUFBSSxNQUFNLElBQUkseUNBQVc7QUFBQSxNQUN6QztBQUFBLElBQ0YsQ0FBQztBQUdELFVBQU0sU0FBUyxPQUFPLEtBQUs7QUFDM0IsVUFBTSxNQUFNLEtBQUssSUFBSSxRQUFRLE1BQU0sVUFBVTtBQUM3QyxVQUFNLGlCQUFpQixVQUFVLE1BQU0sT0FBTyxHQUFHO0FBR2pELFdBQU87QUFBQSxNQUNMLE9BQU87QUFBQSxNQUNQLFlBQVk7QUFBQSxRQUNWLE9BQU87QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0EsWUFBWSxLQUFLLEtBQUssYUFBYSxJQUFJO0FBQUEsTUFDekM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxpQkFBaUIsU0FBaUIsUUFBNEI7QUFDbEUsVUFBTUEsZUFBYztBQUdwQixVQUFNLFFBQVEsWUFBWSxLQUFLLE9BQUssRUFBRSxPQUFPLE9BQU87QUFFcEQsUUFBSSxDQUFDLE9BQU87QUFDVixZQUFNLElBQUksTUFBTSw2QkFBUyxPQUFPLG9CQUFLO0FBQUEsSUFDdkM7QUFHQSxXQUFPLE1BQU0sWUFBWSxDQUFDO0FBQUEsRUFDNUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sbUJBQW1CLFNBQWlCLE1BQXlCO0FBeGZyRTtBQXlmSSxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sUUFBUSxZQUFZLFVBQVUsT0FBSyxFQUFFLE9BQU8sT0FBTztBQUV6RCxRQUFJLFVBQVUsSUFBSTtBQUNoQixZQUFNLElBQUksTUFBTSw2QkFBUyxPQUFPLG9CQUFLO0FBQUEsSUFDdkM7QUFHQSxVQUFNLFFBQVEsWUFBWSxLQUFLO0FBQy9CLFVBQU0sc0JBQW9CLFdBQU0sYUFBTixtQkFBZ0IsV0FBVSxLQUFLO0FBQ3pELFVBQU0sYUFBWSxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUV6QyxVQUFNLGFBQWE7QUFBQSxNQUNqQixJQUFJLE9BQU8sT0FBTyxJQUFJLGdCQUFnQjtBQUFBLE1BQ3RDO0FBQUEsTUFDQSxlQUFlO0FBQUEsTUFDZixNQUFNLEtBQUssUUFBUSxnQkFBTSxnQkFBZ0I7QUFBQSxNQUN6QyxLQUFLLEtBQUssT0FBTyxNQUFNLGFBQWE7QUFBQSxNQUNwQyxjQUFjLEtBQUssZ0JBQWdCLE1BQU07QUFBQSxNQUN6QyxRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsTUFDVixXQUFXO0FBQUEsSUFDYjtBQUdBLFFBQUksTUFBTSxZQUFZLE1BQU0sU0FBUyxTQUFTLEdBQUc7QUFDL0MsWUFBTSxXQUFXLE1BQU0sU0FBUyxJQUFJLFFBQU07QUFBQSxRQUN4QyxHQUFHO0FBQUEsUUFDSCxVQUFVO0FBQUEsTUFDWixFQUFFO0FBQUEsSUFDSjtBQUdBLFFBQUksQ0FBQyxNQUFNLFVBQVU7QUFDbkIsWUFBTSxXQUFXLENBQUM7QUFBQSxJQUNwQjtBQUNBLFVBQU0sU0FBUyxLQUFLLFVBQVU7QUFHOUIsZ0JBQVksS0FBSyxJQUFJO0FBQUEsTUFDbkIsR0FBRztBQUFBLE1BQ0gsZ0JBQWdCO0FBQUEsTUFDaEIsV0FBVztBQUFBLElBQ2I7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxvQkFBb0IsV0FBaUM7QUFDekQsVUFBTUEsZUFBYztBQUdwQixRQUFJLFFBQVE7QUFDWixRQUFJLGVBQWU7QUFDbkIsUUFBSSxhQUFhO0FBRWpCLGFBQVMsSUFBSSxHQUFHLElBQUksWUFBWSxRQUFRLEtBQUs7QUFDM0MsVUFBSSxZQUFZLENBQUMsRUFBRSxVQUFVO0FBQzNCLGNBQU0sU0FBUyxZQUFZLENBQUMsRUFBRSxTQUFTLFVBQVUsT0FBSyxFQUFFLE9BQU8sU0FBUztBQUN4RSxZQUFJLFdBQVcsSUFBSTtBQUNqQixrQkFBUSxZQUFZLENBQUM7QUFDckIseUJBQWU7QUFDZix1QkFBYTtBQUNiO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBRUEsUUFBSSxDQUFDLFNBQVMsaUJBQWlCLElBQUk7QUFDakMsWUFBTSxJQUFJLE1BQU0sNkJBQVMsU0FBUyxnQ0FBTztBQUFBLElBQzNDO0FBR0EsVUFBTSxpQkFBaUI7QUFBQSxNQUNyQixHQUFHLE1BQU0sU0FBUyxZQUFZO0FBQUEsTUFDOUIsUUFBUTtBQUFBLE1BQ1IsY0FBYSxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ3RDO0FBRUEsVUFBTSxTQUFTLFlBQVksSUFBSTtBQUcvQixnQkFBWSxVQUFVLElBQUk7QUFBQSxNQUN4QixHQUFHO0FBQUEsTUFDSCxRQUFRO0FBQUEsTUFDUixnQkFBZ0I7QUFBQSxNQUNoQixZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDcEM7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxzQkFBc0IsV0FBaUM7QUFDM0QsVUFBTUEsZUFBYztBQUdwQixRQUFJLFFBQVE7QUFDWixRQUFJLGVBQWU7QUFDbkIsUUFBSSxhQUFhO0FBRWpCLGFBQVMsSUFBSSxHQUFHLElBQUksWUFBWSxRQUFRLEtBQUs7QUFDM0MsVUFBSSxZQUFZLENBQUMsRUFBRSxVQUFVO0FBQzNCLGNBQU0sU0FBUyxZQUFZLENBQUMsRUFBRSxTQUFTLFVBQVUsT0FBSyxFQUFFLE9BQU8sU0FBUztBQUN4RSxZQUFJLFdBQVcsSUFBSTtBQUNqQixrQkFBUSxZQUFZLENBQUM7QUFDckIseUJBQWU7QUFDZix1QkFBYTtBQUNiO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBRUEsUUFBSSxDQUFDLFNBQVMsaUJBQWlCLElBQUk7QUFDakMsWUFBTSxJQUFJLE1BQU0sNkJBQVMsU0FBUyxnQ0FBTztBQUFBLElBQzNDO0FBR0EsVUFBTSxpQkFBaUI7QUFBQSxNQUNyQixHQUFHLE1BQU0sU0FBUyxZQUFZO0FBQUEsTUFDOUIsUUFBUTtBQUFBLE1BQ1IsZUFBYyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ3ZDO0FBRUEsVUFBTSxTQUFTLFlBQVksSUFBSTtBQUcvQixRQUFJLE1BQU0sa0JBQWtCLE1BQU0sZUFBZSxPQUFPLFdBQVc7QUFDakUsa0JBQVksVUFBVSxJQUFJO0FBQUEsUUFDeEIsR0FBRztBQUFBLFFBQ0gsUUFBUTtBQUFBLFFBQ1IsZ0JBQWdCO0FBQUEsUUFDaEIsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLE1BQ3BDO0FBQUEsSUFDRixPQUFPO0FBQ0wsa0JBQVksVUFBVSxJQUFJO0FBQUEsUUFDeEIsR0FBRztBQUFBLFFBQ0gsVUFBVSxNQUFNO0FBQUEsUUFDaEIsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLE1BQ3BDO0FBQUEsSUFDRjtBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLHFCQUFxQixTQUFpQixXQUFpQztBQUMzRSxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sYUFBYSxZQUFZLFVBQVUsT0FBSyxFQUFFLE9BQU8sT0FBTztBQUU5RCxRQUFJLGVBQWUsSUFBSTtBQUNyQixZQUFNLElBQUksTUFBTSw2QkFBUyxPQUFPLG9CQUFLO0FBQUEsSUFDdkM7QUFFQSxVQUFNLFFBQVEsWUFBWSxVQUFVO0FBR3BDLFFBQUksQ0FBQyxNQUFNLFVBQVU7QUFDbkIsWUFBTSxJQUFJLE1BQU0sZ0JBQU0sT0FBTywyQkFBTztBQUFBLElBQ3RDO0FBRUEsVUFBTSxlQUFlLE1BQU0sU0FBUyxVQUFVLE9BQUssRUFBRSxPQUFPLFNBQVM7QUFFckUsUUFBSSxpQkFBaUIsSUFBSTtBQUN2QixZQUFNLElBQUksTUFBTSw2QkFBUyxTQUFTLGdDQUFPO0FBQUEsSUFDM0M7QUFHQSxVQUFNLG9CQUFvQixNQUFNLFNBQVMsWUFBWTtBQUdyRCxnQkFBWSxVQUFVLElBQUk7QUFBQSxNQUN4QixHQUFHO0FBQUEsTUFDSCxnQkFBZ0I7QUFBQSxNQUNoQixRQUFRLGtCQUFrQjtBQUFBLE1BQzFCLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxJQUNwQztBQUVBLFdBQU87QUFBQSxFQUNUO0FBQ0Y7QUFFQSxJQUFPLGdCQUFROzs7QUNuckJSLElBQU0sbUJBQW1CO0FBQUEsRUFDOUI7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVUsRUFBRSxZQUFZO0FBQUEsSUFDekQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBUyxFQUFFLFlBQVk7QUFBQSxJQUN4RCxXQUFXO0FBQUEsTUFDVDtBQUFBLFFBQ0UsSUFBSTtBQUFBLFFBQ0osTUFBTTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxJQUFJO0FBQUEsUUFDSixNQUFNO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFTLEVBQUUsWUFBWTtBQUFBLElBQ3hELFdBQVc7QUFBQSxNQUNUO0FBQUEsUUFDRSxJQUFJO0FBQUEsUUFDSixNQUFNO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0E7QUFBQSxRQUNFLElBQUk7QUFBQSxRQUNKLE1BQU07QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLGFBQWE7QUFBQSxNQUNmO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixjQUFjO0FBQUEsSUFDZCxRQUFRO0FBQUEsSUFDUixXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFTLEVBQUUsWUFBWTtBQUFBLElBQ3hELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVMsRUFBRSxZQUFZO0FBQUEsSUFDeEQsV0FBVztBQUFBLE1BQ1Q7QUFBQSxRQUNFLElBQUk7QUFBQSxRQUNKLE1BQU07QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLGFBQWE7QUFBQSxNQUNmO0FBQUEsTUFDQTtBQUFBLFFBQ0UsSUFBSTtBQUFBLFFBQ0osTUFBTTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxJQUFJO0FBQUEsUUFDSixNQUFNO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBQ3hGQSxlQUFlQyxpQkFBK0I7QUFDNUMsUUFBTSxZQUFZLE9BQU8sV0FBVyxVQUFVLFdBQVcsV0FBVyxRQUFRO0FBQzVFLFNBQU8sTUFBTSxTQUFTO0FBQ3hCO0FBS0EsSUFBTSxxQkFBcUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUl6QixNQUFNLGdCQUFnQixRQUE0QjtBQUNoRCxVQUFNQSxlQUFjO0FBRXBCLFVBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBQzdCLFVBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBRzdCLFFBQUksZ0JBQWdCLENBQUMsR0FBRyxnQkFBZ0I7QUFHeEMsUUFBSSxpQ0FBUSxNQUFNO0FBQ2hCLFlBQU0sVUFBVSxPQUFPLEtBQUssWUFBWTtBQUN4QyxzQkFBZ0IsY0FBYztBQUFBLFFBQU8sT0FDbkMsRUFBRSxLQUFLLFlBQVksRUFBRSxTQUFTLE9BQU8sS0FDcEMsRUFBRSxlQUFlLEVBQUUsWUFBWSxZQUFZLEVBQUUsU0FBUyxPQUFPO0FBQUEsTUFDaEU7QUFBQSxJQUNGO0FBR0EsUUFBSSxpQ0FBUSxNQUFNO0FBQ2hCLHNCQUFnQixjQUFjLE9BQU8sT0FBSyxFQUFFLFNBQVMsT0FBTyxJQUFJO0FBQUEsSUFDbEU7QUFHQSxRQUFJLGlDQUFRLFFBQVE7QUFDbEIsc0JBQWdCLGNBQWMsT0FBTyxPQUFLLEVBQUUsV0FBVyxPQUFPLE1BQU07QUFBQSxJQUN0RTtBQUdBLFVBQU0sU0FBUyxPQUFPLEtBQUs7QUFDM0IsVUFBTSxNQUFNLEtBQUssSUFBSSxRQUFRLE1BQU0sY0FBYyxNQUFNO0FBQ3ZELFVBQU0saUJBQWlCLGNBQWMsTUFBTSxPQUFPLEdBQUc7QUFHckQsV0FBTztBQUFBLE1BQ0wsT0FBTztBQUFBLE1BQ1AsWUFBWTtBQUFBLFFBQ1YsT0FBTyxjQUFjO0FBQUEsUUFDckI7QUFBQSxRQUNBO0FBQUEsUUFDQSxZQUFZLEtBQUssS0FBSyxjQUFjLFNBQVMsSUFBSTtBQUFBLE1BQ25EO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sZUFBZSxJQUEwQjtBQUM3QyxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sY0FBYyxpQkFBaUIsS0FBSyxPQUFLLEVBQUUsT0FBTyxFQUFFO0FBRTFELFFBQUksQ0FBQyxhQUFhO0FBQ2hCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsb0JBQUs7QUFBQSxJQUNsQztBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLGtCQUFrQixNQUF5QjtBQUMvQyxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sUUFBUSxlQUFlLEtBQUssSUFBSSxDQUFDO0FBQ3ZDLFVBQU0sYUFBWSxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUV6QyxVQUFNLGlCQUFpQjtBQUFBLE1BQ3JCLElBQUk7QUFBQSxNQUNKLE1BQU0sS0FBSyxRQUFRO0FBQUEsTUFDbkIsYUFBYSxLQUFLLGVBQWU7QUFBQSxNQUNqQyxNQUFNLEtBQUssUUFBUTtBQUFBLE1BQ25CLFNBQVMsS0FBSyxXQUFXO0FBQUEsTUFDekIsVUFBVSxLQUFLLFlBQVk7QUFBQSxNQUMzQixRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxXQUFXO0FBQUEsTUFDWCxXQUFXLEtBQUssYUFBYSxDQUFDO0FBQUEsSUFDaEM7QUFHQSxRQUFJLEtBQUssYUFBYSxTQUFTO0FBQzdCLGFBQU8sT0FBTyxnQkFBZ0I7QUFBQSxRQUM1QixVQUFVLEtBQUssWUFBWTtBQUFBLFFBQzNCLFVBQVUsS0FBSyxZQUFZO0FBQUEsTUFDN0IsQ0FBQztBQUFBLElBQ0gsV0FBVyxLQUFLLGFBQWEsV0FBVztBQUN0QyxhQUFPLE9BQU8sZ0JBQWdCO0FBQUEsUUFDNUIsUUFBUSxLQUFLLFVBQVU7QUFBQSxNQUN6QixDQUFDO0FBQUEsSUFDSCxXQUFXLEtBQUssYUFBYSxVQUFVO0FBQ3JDLGFBQU8sT0FBTyxnQkFBZ0I7QUFBQSxRQUM1QixVQUFVLEtBQUssWUFBWTtBQUFBLFFBQzNCLGNBQWMsS0FBSyxnQkFBZ0I7QUFBQSxNQUNyQyxDQUFDO0FBQUEsSUFDSDtBQUdBLHFCQUFpQixLQUFLLGNBQWM7QUFFcEMsV0FBTztBQUFBLEVBQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sa0JBQWtCLElBQVksTUFBeUI7QUFDM0QsVUFBTUEsZUFBYztBQUdwQixVQUFNLFFBQVEsaUJBQWlCLFVBQVUsT0FBSyxFQUFFLE9BQU8sRUFBRTtBQUV6RCxRQUFJLFVBQVUsSUFBSTtBQUNoQixZQUFNLElBQUksTUFBTSw2QkFBUyxFQUFFLG9CQUFLO0FBQUEsSUFDbEM7QUFHQSxVQUFNLHFCQUFxQjtBQUFBLE1BQ3pCLEdBQUcsaUJBQWlCLEtBQUs7QUFBQSxNQUN6QixHQUFHO0FBQUEsTUFDSDtBQUFBO0FBQUEsTUFDQSxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDcEM7QUFHQSxxQkFBaUIsS0FBSyxJQUFJO0FBRTFCLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLGtCQUFrQixJQUE4QjtBQUNwRCxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sUUFBUSxpQkFBaUIsVUFBVSxPQUFLLEVBQUUsT0FBTyxFQUFFO0FBRXpELFFBQUksVUFBVSxJQUFJO0FBQ2hCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsb0JBQUs7QUFBQSxJQUNsQztBQUdBLHFCQUFpQixPQUFPLE9BQU8sQ0FBQztBQUVoQyxXQUFPO0FBQUEsRUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxnQkFBZ0IsSUFBWSxTQUFjLENBQUMsR0FBaUI7QUFyTHBFO0FBc0xJLFVBQU1BLGVBQWM7QUFHcEIsVUFBTSxjQUFjLGlCQUFpQixLQUFLLE9BQUssRUFBRSxPQUFPLEVBQUU7QUFFMUQsUUFBSSxDQUFDLGFBQWE7QUFDaEIsWUFBTSxJQUFJLE1BQU0sNkJBQVMsRUFBRSxvQkFBSztBQUFBLElBQ2xDO0FBR0EsV0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLE1BQ1QsWUFBWTtBQUFBLE1BQ1osY0FBYztBQUFBLFFBQ1osUUFBUTtBQUFBLFFBQ1IsU0FBUztBQUFBLFFBQ1QsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLFFBQ2xDLFNBQVM7QUFBQSxVQUNQLGNBQWMsS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUFBLFVBQ2hELFlBQVk7QUFBQSxVQUNaLFVBQVUsT0FBTyxjQUFZLGlCQUFZLFVBQVUsQ0FBQyxNQUF2QixtQkFBMEIsU0FBUTtBQUFBLFFBQ2pFO0FBQUEsUUFDQSxNQUFNLE1BQU0sS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsR0FBRyxPQUFPO0FBQUEsVUFDekMsSUFBSSxJQUFJO0FBQUEsVUFDUixNQUFNLDRCQUFRLElBQUksQ0FBQztBQUFBLFVBQ25CLE9BQU8sS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEdBQUksSUFBSTtBQUFBLFFBQzVDLEVBQUU7QUFBQSxNQUNKO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sYUFBYSxJQUFZLFNBQWMsQ0FBQyxHQUFpQjtBQUM3RCxVQUFNQSxlQUFjO0FBR3BCLFVBQU0sY0FBYyxpQkFBaUIsS0FBSyxPQUFLLEVBQUUsT0FBTyxFQUFFO0FBRTFELFFBQUksQ0FBQyxhQUFhO0FBQ2hCLFlBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsb0JBQUs7QUFBQSxJQUNsQztBQUdBLFdBQU87QUFBQSxNQUNMLFNBQVM7QUFBQSxNQUNULFlBQVk7QUFBQSxNQUNaLGNBQWM7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxRQUNsQyxPQUFPLE9BQU8sU0FBUztBQUFBLFFBQ3ZCLE1BQU0sTUFBTSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxHQUFHLE9BQU87QUFBQSxVQUN6QyxJQUFJLFVBQVUsSUFBSSxDQUFDO0FBQUEsVUFDbkIsTUFBTSxnQkFBTSxJQUFJLENBQUM7QUFBQSxVQUNqQixhQUFhLDBEQUFhLElBQUksQ0FBQztBQUFBLFVBQy9CLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksS0FBUSxFQUFFLFlBQVk7QUFBQSxVQUMzRCxZQUFZO0FBQUEsWUFDVixNQUFNLElBQUksTUFBTSxJQUFJLE1BQU07QUFBQSxZQUMxQixPQUFPLEtBQUssTUFBTSxLQUFLLE9BQU8sSUFBSSxHQUFHO0FBQUEsWUFDckMsUUFBUSxJQUFJLE1BQU07QUFBQSxVQUNwQjtBQUFBLFFBQ0YsRUFBRTtBQUFBLE1BQ0o7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTyxzQkFBUTs7O0FDdElmLElBQU0sV0FBVztBQUFBLEVBQ2Y7QUFBQSxFQUNBLE9BQU87QUFBQSxFQUNQLGFBQWE7QUFDZjtBQVdPLElBQU0sb0JBQW9CLFNBQVM7QUFDbkMsSUFBTUMsZ0JBQWUsU0FBUztBQUM5QixJQUFNQyxzQkFBcUIsU0FBUzs7O0FScEgzQyxTQUFTLFdBQVcsS0FBcUI7QUFDdkMsTUFBSSxVQUFVLCtCQUErQixHQUFHO0FBQ2hELE1BQUksVUFBVSxnQ0FBZ0MsaUNBQWlDO0FBQy9FLE1BQUksVUFBVSxnQ0FBZ0MsNkNBQTZDO0FBQzNGLE1BQUksVUFBVSwwQkFBMEIsT0FBTztBQUNqRDtBQUdBLFNBQVMsaUJBQWlCLEtBQXFCLFFBQWdCLE1BQVc7QUFDeEUsTUFBSSxhQUFhO0FBQ2pCLE1BQUksVUFBVSxnQkFBZ0Isa0JBQWtCO0FBQ2hELE1BQUksSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUFDO0FBQzlCO0FBR0EsU0FBU0MsT0FBTSxJQUEyQjtBQUN4QyxTQUFPLElBQUksUUFBUSxhQUFXLFdBQVcsU0FBUyxFQUFFLENBQUM7QUFDdkQ7QUFHQSxlQUFlLGlCQUFpQixLQUFvQztBQUNsRSxTQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDOUIsUUFBSSxPQUFPO0FBQ1gsUUFBSSxHQUFHLFFBQVEsQ0FBQyxVQUFVO0FBQ3hCLGNBQVEsTUFBTSxTQUFTO0FBQUEsSUFDekIsQ0FBQztBQUNELFFBQUksR0FBRyxPQUFPLE1BQU07QUFDbEIsVUFBSTtBQUNGLGdCQUFRLE9BQU8sS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUM7QUFBQSxNQUN0QyxTQUFTLEdBQUc7QUFDVixnQkFBUSxDQUFDLENBQUM7QUFBQSxNQUNaO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxDQUFDO0FBQ0g7QUFHQSxlQUFlLHFCQUFxQixLQUFzQixLQUFxQixTQUFpQixVQUFpQztBQXREakk7QUF1REUsUUFBTSxVQUFTLFNBQUksV0FBSixtQkFBWTtBQUczQixNQUFJLFlBQVksc0JBQXNCLFdBQVcsT0FBTztBQUN0RCxZQUFRLFNBQVMsK0NBQTJCO0FBRTVDLFFBQUk7QUFFRixZQUFNLFNBQVMsTUFBTSxrQkFBa0IsZUFBZTtBQUFBLFFBQ3BELE1BQU0sU0FBUyxTQUFTLElBQWMsS0FBSztBQUFBLFFBQzNDLE1BQU0sU0FBUyxTQUFTLElBQWMsS0FBSztBQUFBLFFBQzNDLE1BQU0sU0FBUztBQUFBLFFBQ2YsTUFBTSxTQUFTO0FBQUEsUUFDZixRQUFRLFNBQVM7QUFBQSxNQUNuQixDQUFDO0FBRUQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU0sT0FBTztBQUFBLFFBQ2IsWUFBWSxPQUFPO0FBQUEsUUFDbkIsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0gsU0FBUyxPQUFPO0FBQ2QsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE9BQU87QUFBQSxRQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFFBQzlELFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFHQSxNQUFJLFFBQVEsTUFBTSw4QkFBOEIsS0FBSyxXQUFXLE9BQU87QUFDckUsVUFBTSxLQUFLLFFBQVEsTUFBTSxHQUFHLEVBQUUsSUFBSSxLQUFLO0FBRXZDLFlBQVEsU0FBUyxnQ0FBWSxPQUFPLFNBQVMsRUFBRSxFQUFFO0FBRWpELFFBQUk7QUFDRixZQUFNLGFBQWEsTUFBTSxrQkFBa0IsY0FBYyxFQUFFO0FBQzNELHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksWUFBWSxzQkFBc0IsV0FBVyxRQUFRO0FBQ3ZELFlBQVEsU0FBUyxnREFBNEI7QUFFN0MsUUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLGlCQUFpQixHQUFHO0FBQ3ZDLFlBQU0sZ0JBQWdCLE1BQU0sa0JBQWtCLGlCQUFpQixJQUFJO0FBRW5FLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksUUFBUSxNQUFNLDhCQUE4QixLQUFLLFdBQVcsT0FBTztBQUNyRSxVQUFNLEtBQUssUUFBUSxNQUFNLEdBQUcsRUFBRSxJQUFJLEtBQUs7QUFFdkMsWUFBUSxTQUFTLGdDQUFZLE9BQU8sU0FBUyxFQUFFLEVBQUU7QUFFakQsUUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLGlCQUFpQixHQUFHO0FBQ3ZDLFlBQU0sb0JBQW9CLE1BQU0sa0JBQWtCLGlCQUFpQixJQUFJLElBQUk7QUFFM0UsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sOEJBQThCLEtBQUssV0FBVyxVQUFVO0FBQ3hFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLElBQUksS0FBSztBQUV2QyxZQUFRLFNBQVMsbUNBQWUsT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVwRCxRQUFJO0FBQ0YsWUFBTSxrQkFBa0IsaUJBQWlCLEVBQUU7QUFFM0MsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxZQUFZLHNDQUFzQyxXQUFXLFFBQVE7QUFDdkUsWUFBUSxTQUFTLGdFQUE0QztBQUU3RCxRQUFJO0FBQ0YsWUFBTSxPQUFPLE1BQU0saUJBQWlCLEdBQUc7QUFDdkMsWUFBTSxTQUFTLE1BQU0sa0JBQWtCLGVBQWUsSUFBSTtBQUUxRCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0gsU0FBUyxPQUFPO0FBQ2QsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE9BQU87QUFBQSxRQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFFBQzlELFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFFQSxTQUFPO0FBQ1Q7QUFHQSxlQUFlLGlCQUFpQixLQUFzQixLQUFxQixTQUFpQixVQUFpQztBQTdNN0g7QUE4TUUsUUFBTSxVQUFTLFNBQUksV0FBSixtQkFBWTtBQUczQixRQUFNLGdCQUFnQixRQUFRLFNBQVMsVUFBVTtBQUdqRCxNQUFJLGVBQWU7QUFDakIsWUFBUSxJQUFJLHlEQUFzQixNQUFNLElBQUksT0FBTyxJQUFJLFFBQVE7QUFBQSxFQUNqRTtBQUdBLE1BQUksWUFBWSxrQkFBa0IsV0FBVyxPQUFPO0FBQ2xELFlBQVEsU0FBUywyQ0FBdUI7QUFDeEMsWUFBUSxJQUFJLDBFQUF3QixRQUFRO0FBRTVDLFFBQUk7QUFFRixZQUFNLFNBQVMsTUFBTUMsY0FBYSxXQUFXO0FBQUEsUUFDM0MsTUFBTSxTQUFTLFNBQVMsSUFBYyxLQUFLO0FBQUEsUUFDM0MsTUFBTSxTQUFTLFNBQVMsSUFBYyxLQUFLO0FBQUEsUUFDM0MsTUFBTSxTQUFTO0FBQUEsUUFDZixjQUFjLFNBQVM7QUFBQSxRQUN2QixRQUFRLFNBQVM7QUFBQSxRQUNqQixXQUFXLFNBQVM7QUFBQSxRQUNwQixZQUFZLFNBQVMsZUFBZTtBQUFBLE1BQ3RDLENBQUM7QUFFRCxjQUFRLElBQUksZ0RBQWtCO0FBQUEsUUFDNUIsWUFBWSxPQUFPLE1BQU07QUFBQSxRQUN6QixZQUFZLE9BQU87QUFBQSxNQUNyQixDQUFDO0FBRUQsY0FBUSxJQUFJLHdFQUFzQjtBQUFBLFFBQ2hDLE1BQU0sU0FBUyxPQUFPLE1BQU0sTUFBTTtBQUFBLFFBQ2xDLFlBQVksT0FBTztBQUFBLFFBQ25CLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFFRCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsTUFBTSxPQUFPO0FBQUEsUUFDYixZQUFZLE9BQU87QUFBQSxRQUNuQixTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCxjQUFRLE1BQU0sNERBQW9CLEtBQUs7QUFDdkMsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE9BQU87QUFBQSxRQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFFBQzlELFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFHQSxNQUFJLFlBQVksNEJBQTRCLFdBQVcsT0FBTztBQUM1RCxZQUFRLFNBQVMscURBQWlDO0FBQ2xELFlBQVEsSUFBSSxzRkFBMEIsUUFBUTtBQUU5QyxRQUFJO0FBRUYsWUFBTSxTQUFTLE1BQU1BLGNBQWEsbUJBQW1CO0FBQUEsUUFDbkQsTUFBTSxTQUFTLFNBQVMsSUFBYyxLQUFLO0FBQUEsUUFDM0MsTUFBTSxTQUFTLFNBQVMsSUFBYyxLQUFLO0FBQUEsUUFDM0MsTUFBTSxTQUFTLFFBQWtCLFNBQVM7QUFBQSxRQUMxQyxjQUFjLFNBQVM7QUFBQSxRQUN2QixRQUFRLFNBQVM7QUFBQSxNQUNuQixDQUFDO0FBRUQsY0FBUSxJQUFJLDREQUFvQjtBQUFBLFFBQzlCLFlBQVksT0FBTyxNQUFNO0FBQUEsUUFDekIsWUFBWSxPQUFPO0FBQUEsTUFDckIsQ0FBQztBQUVELHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNLE9BQU87QUFBQSxRQUNiLFlBQVksT0FBTztBQUFBLFFBQ25CLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLGNBQVEsTUFBTSx3RUFBc0IsS0FBSztBQUN6Qyx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksUUFBUSxNQUFNLDBCQUEwQixLQUFLLFdBQVcsT0FBTztBQUNqRSxVQUFNLEtBQUssUUFBUSxNQUFNLEdBQUcsRUFBRSxJQUFJLEtBQUs7QUFFdkMsWUFBUSxTQUFTLGdDQUFZLE9BQU8sU0FBUyxFQUFFLEVBQUU7QUFFakQsUUFBSTtBQUNGLFlBQU0sUUFBUSxNQUFNQSxjQUFhLFNBQVMsRUFBRTtBQUM1Qyx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0gsU0FBUyxPQUFPO0FBQ2QsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE9BQU87QUFBQSxRQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFFBQzlELFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFHQSxNQUFJLFlBQVksa0JBQWtCLFdBQVcsUUFBUTtBQUNuRCxZQUFRLFNBQVMsNENBQXdCO0FBRXpDLFFBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxpQkFBaUIsR0FBRztBQUN2QyxZQUFNLFdBQVcsTUFBTUEsY0FBYSxZQUFZLElBQUk7QUFFcEQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sMEJBQTBCLEtBQUssV0FBVyxPQUFPO0FBQ2pFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLElBQUksS0FBSztBQUV2QyxZQUFRLFNBQVMsZ0NBQVksT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVqRCxRQUFJO0FBQ0YsWUFBTSxPQUFPLE1BQU0saUJBQWlCLEdBQUc7QUFDdkMsWUFBTSxlQUFlLE1BQU1BLGNBQWEsWUFBWSxJQUFJLElBQUk7QUFFNUQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sMEJBQTBCLEtBQUssV0FBVyxVQUFVO0FBQ3BFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLElBQUksS0FBSztBQUV2QyxZQUFRLFNBQVMsbUNBQWUsT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVwRCxRQUFJO0FBQ0YsWUFBTUEsY0FBYSxZQUFZLEVBQUU7QUFFakMsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sK0JBQStCLEtBQUssV0FBVyxRQUFRO0FBQ3ZFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSztBQUVwQyxZQUFRLFNBQVMsaUNBQWEsT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVsRCxRQUFJO0FBQ0YsWUFBTSxPQUFPLE1BQU0saUJBQWlCLEdBQUc7QUFDdkMsWUFBTSxTQUFTLE1BQU1BLGNBQWEsYUFBYSxJQUFJLElBQUk7QUFFdkQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sbUNBQW1DLEtBQUssV0FBVyxRQUFRO0FBQzNFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSztBQUVwQyxZQUFRLFNBQVMsaUNBQWEsT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVsRCxRQUFJO0FBQ0YsWUFBTSxPQUFPLE1BQU0saUJBQWlCLEdBQUc7QUFDdkMsWUFBTSxTQUFTLE1BQU1BLGNBQWEsYUFBYSxJQUFJLElBQUk7QUFFdkQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sc0NBQXNDLEtBQUssV0FBVyxRQUFRO0FBQzlFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSztBQUVwQyxZQUFRLFNBQVMsNkRBQXFCLE9BQU8scUJBQVcsRUFBRSxFQUFFO0FBRTVELFFBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxpQkFBaUIsR0FBRztBQUV2QyxZQUFNLFlBQVksR0FBRyxRQUFRLFVBQVUsRUFBRTtBQUN6QyxZQUFNLFNBQVMsTUFBTUEsY0FBYSxhQUFhLFdBQVcsSUFBSTtBQUU5RCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0gsU0FBUyxPQUFPO0FBQ2QsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE9BQU87QUFBQSxRQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFFBQzlELFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFHQSxNQUFJLFFBQVEsTUFBTSxvQ0FBb0MsS0FBSyxXQUFXLFFBQVE7QUFDNUUsVUFBTSxLQUFLLFFBQVEsTUFBTSxHQUFHLEVBQUUsQ0FBQyxLQUFLO0FBRXBDLFlBQVEsU0FBUyxpQ0FBYSxPQUFPLFNBQVMsRUFBRSxFQUFFO0FBRWxELFFBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxpQkFBaUIsR0FBRztBQUN2QyxZQUFNLFNBQVMsTUFBTUEsY0FBYSxlQUFlLEVBQUU7QUFFbkQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sb0NBQW9DLEtBQUssV0FBVyxPQUFPO0FBQzNFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSztBQUVwQyxZQUFRLFNBQVMsZ0NBQVksT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVqRCxRQUFJO0FBQ0YsWUFBTSxXQUFXLE1BQU1BLGNBQWEsaUJBQWlCLEVBQUU7QUFFdkQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sNENBQTRDLEtBQUssV0FBVyxPQUFPO0FBQ25GLFVBQU0sUUFBUSxRQUFRLE1BQU0sR0FBRztBQUMvQixVQUFNLFVBQVUsTUFBTSxDQUFDLEtBQUs7QUFDNUIsVUFBTSxZQUFZLE1BQU0sQ0FBQyxLQUFLO0FBRTlCLFlBQVEsU0FBUyxnQ0FBWSxPQUFPLHFCQUFXLE9BQU8scUJBQVcsU0FBUyxFQUFFO0FBRTVFLFFBQUk7QUFDRixZQUFNLFdBQVcsTUFBTUEsY0FBYSxpQkFBaUIsT0FBTztBQUM1RCxZQUFNLFVBQVUsU0FBUyxLQUFLLENBQUMsTUFBVyxFQUFFLE9BQU8sU0FBUztBQUU1RCxVQUFJLENBQUMsU0FBUztBQUNaLGNBQU0sSUFBSSxNQUFNLDZCQUFTLFNBQVMsZ0NBQU87QUFBQSxNQUMzQztBQUVBLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUVBLFNBQU87QUFDVDtBQUdBLGVBQWUscUJBQXFCLEtBQXNCLEtBQXFCLFNBQWlCLFVBQWlDO0FBaGlCakk7QUFpaUJFLFFBQU0sVUFBUyxTQUFJLFdBQUosbUJBQVk7QUFHM0IsUUFBTSxvQkFBb0IsUUFBUSxTQUFTLGdCQUFnQjtBQUczRCxNQUFJLG1CQUFtQjtBQUNyQixZQUFRLElBQUkseURBQXNCLE1BQU0sSUFBSSxPQUFPLElBQUksUUFBUTtBQUFBLEVBQ2pFO0FBR0EsTUFBSSxZQUFZLHdCQUF3QixXQUFXLE9BQU87QUFDeEQsWUFBUSxTQUFTLGlEQUE2QjtBQUU5QyxRQUFJO0FBQ0YsWUFBTSxTQUFTLE1BQU0sb0JBQW1CLGdCQUFnQjtBQUFBLFFBQ3RELE1BQU0sU0FBUyxTQUFTLElBQWMsS0FBSztBQUFBLFFBQzNDLE1BQU0sU0FBUyxTQUFTLElBQWMsS0FBSztBQUFBLFFBQzNDLE1BQU0sU0FBUztBQUFBLFFBQ2YsTUFBTSxTQUFTO0FBQUEsUUFDZixRQUFRLFNBQVM7QUFBQSxNQUNuQixDQUFDO0FBRUQsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU0sT0FBTztBQUFBLFFBQ2IsWUFBWSxPQUFPO0FBQUEsUUFDbkIsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0gsU0FBUyxPQUFPO0FBQ2QsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE9BQU87QUFBQSxRQUNQLFNBQVMsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLFFBQzlELFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFHQSxNQUFJLFFBQVEsTUFBTSxpQ0FBaUMsS0FBSyxXQUFXLE9BQU87QUFDeEUsVUFBTSxLQUFLLFFBQVEsTUFBTSxHQUFHLEVBQUUsSUFBSSxLQUFLO0FBRXZDLFlBQVEsU0FBUyxnQ0FBWSxPQUFPLFNBQVMsRUFBRSxFQUFFO0FBRWpELFFBQUk7QUFDRixZQUFNLGNBQWMsTUFBTSxvQkFBbUIsZUFBZSxFQUFFO0FBQzlELHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksWUFBWSx3QkFBd0IsV0FBVyxRQUFRO0FBQ3pELFlBQVEsU0FBUyxrREFBOEI7QUFFL0MsUUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLGlCQUFpQixHQUFHO0FBQ3ZDLFlBQU0saUJBQWlCLE1BQU0sb0JBQW1CLGtCQUFrQixJQUFJO0FBRXRFLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUdBLE1BQUksUUFBUSxNQUFNLGlDQUFpQyxLQUFLLFdBQVcsT0FBTztBQUN4RSxVQUFNLEtBQUssUUFBUSxNQUFNLEdBQUcsRUFBRSxJQUFJLEtBQUs7QUFFdkMsWUFBUSxTQUFTLGdDQUFZLE9BQU8sU0FBUyxFQUFFLEVBQUU7QUFFakQsUUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLGlCQUFpQixHQUFHO0FBQ3ZDLFlBQU0scUJBQXFCLE1BQU0sb0JBQW1CLGtCQUFrQixJQUFJLElBQUk7QUFFOUUsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0saUNBQWlDLEtBQUssV0FBVyxVQUFVO0FBQzNFLFVBQU0sS0FBSyxRQUFRLE1BQU0sR0FBRyxFQUFFLElBQUksS0FBSztBQUV2QyxZQUFRLFNBQVMsbUNBQWUsT0FBTyxTQUFTLEVBQUUsRUFBRTtBQUVwRCxRQUFJO0FBQ0YsWUFBTSxvQkFBbUIsa0JBQWtCLEVBQUU7QUFFN0MsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sdUNBQXVDLEtBQUssV0FBVyxRQUFRO0FBRS9FLFVBQU0sV0FBVyxRQUFRLE1BQU0sR0FBRztBQUNsQyxVQUFNLFVBQVUsU0FBUyxVQUFVLE9BQUssTUFBTSxNQUFNLElBQUk7QUFDeEQsVUFBTSxLQUFLLFVBQVUsU0FBUyxTQUFTLFNBQVMsT0FBTyxJQUFJO0FBRTNELFlBQVEsU0FBUyxpQ0FBYSxPQUFPLHFCQUFXLEVBQUUsRUFBRTtBQUVwRCxRQUFJO0FBQ0YsWUFBTSxPQUFPLE1BQU0saUJBQWlCLEdBQUc7QUFDdkMsWUFBTSxTQUFTLE1BQU0sb0JBQW1CLGdCQUFnQixJQUFJLElBQUk7QUFFaEUsdUJBQWlCLEtBQUssS0FBSztBQUFBLFFBQ3pCLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILFNBQVMsT0FBTztBQUNkLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBR0EsTUFBSSxRQUFRLE1BQU0sd0NBQXdDLEtBQUssV0FBVyxRQUFRO0FBRWhGLFVBQU0sV0FBVyxRQUFRLE1BQU0sR0FBRztBQUNsQyxVQUFNLFVBQVUsU0FBUyxVQUFVLE9BQUssTUFBTSxNQUFNLElBQUk7QUFDeEQsVUFBTSxLQUFLLFVBQVUsU0FBUyxTQUFTLFNBQVMsT0FBTyxJQUFJO0FBRTNELFlBQVEsU0FBUyxpQ0FBYSxPQUFPLHFCQUFXLEVBQUUsRUFBRTtBQUVwRCxRQUFJO0FBQ0YsWUFBTSxPQUFPLE1BQU0saUJBQWlCLEdBQUc7QUFDdkMsWUFBTSxTQUFTLE1BQU0sb0JBQW1CLGFBQWEsSUFBSSxJQUFJO0FBRTdELHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSCxTQUFTLE9BQU87QUFDZCx1QkFBaUIsS0FBSyxLQUFLO0FBQUEsUUFDekIsT0FBTztBQUFBLFFBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUVBLFNBQU87QUFDVDtBQUdlLFNBQVIsdUJBQW9FO0FBRXpFLE1BQUksQ0FBQyxXQUFXLFNBQVM7QUFDdkIsWUFBUSxJQUFJLGlGQUFxQjtBQUNqQyxXQUFPLENBQUMsS0FBSyxLQUFLLFNBQVMsS0FBSztBQUFBLEVBQ2xDO0FBRUEsVUFBUSxJQUFJLG9FQUF1QjtBQUVuQyxTQUFPLGVBQWUsZUFDcEIsS0FDQSxLQUNBLE1BQ0E7QUFDQSxRQUFJO0FBRUYsWUFBTSxNQUFNLElBQUksT0FBTztBQUd2QixVQUFJLENBQUMsSUFBSSxTQUFTLE9BQU8sR0FBRztBQUMxQixlQUFPLEtBQUs7QUFBQSxNQUNkO0FBR0EsVUFBSSxlQUFlO0FBQ25CLFVBQUksSUFBSSxTQUFTLFdBQVcsR0FBRztBQUM3Qix1QkFBZSxJQUFJLFFBQVEsaUJBQWlCLE9BQU87QUFDbkQsZ0JBQVEsU0FBUyxnRkFBb0IsR0FBRyxPQUFPLFlBQVksRUFBRTtBQUU3RCxZQUFJLE1BQU07QUFBQSxNQUNaO0FBR0EsY0FBUSxJQUFJLHVDQUFtQixJQUFJLE1BQU0sSUFBSSxZQUFZLEVBQUU7QUFFM0QsWUFBTSxZQUFZLE1BQU0sY0FBYyxJQUFJO0FBQzFDLFlBQU0sVUFBVSxVQUFVLFlBQVk7QUFDdEMsWUFBTSxXQUFXLFVBQVUsU0FBUyxDQUFDO0FBR3JDLFVBQUksQ0FBQyxrQkFBa0IsWUFBWSxHQUFHO0FBQ3BDLGVBQU8sS0FBSztBQUFBLE1BQ2Q7QUFFQSxjQUFRLFNBQVMsNkJBQVMsSUFBSSxNQUFNLElBQUksT0FBTyxFQUFFO0FBR2pELFVBQUksSUFBSSxXQUFXLFdBQVc7QUFDNUIsbUJBQVcsR0FBRztBQUNkLFlBQUksYUFBYTtBQUNqQixZQUFJLElBQUk7QUFDUjtBQUFBLE1BQ0Y7QUFHQSxpQkFBVyxHQUFHO0FBR2QsVUFBSSxXQUFXLFFBQVEsR0FBRztBQUN4QixjQUFNRCxPQUFNLFdBQVcsS0FBSztBQUFBLE1BQzlCO0FBR0EsVUFBSSxVQUFVO0FBR2QsVUFBSSxDQUFDO0FBQVMsa0JBQVUsTUFBTSxxQkFBcUIsS0FBSyxLQUFLLFNBQVMsUUFBUTtBQUM5RSxVQUFJLENBQUM7QUFBUyxrQkFBVSxNQUFNLGlCQUFpQixLQUFLLEtBQUssU0FBUyxRQUFRO0FBQzFFLFVBQUksQ0FBQztBQUFTLGtCQUFVLE1BQU0scUJBQXFCLEtBQUssS0FBSyxTQUFTLFFBQVE7QUFHOUUsVUFBSSxDQUFDLFNBQVM7QUFDWixnQkFBUSxRQUFRLDRDQUFjLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUNyRCx5QkFBaUIsS0FBSyxLQUFLO0FBQUEsVUFDekIsT0FBTztBQUFBLFVBQ1AsU0FBUyxtQkFBUyxPQUFPO0FBQUEsVUFDekIsU0FBUztBQUFBLFFBQ1gsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLFNBQVMsT0FBTztBQUNkLGNBQVEsU0FBUyx5Q0FBVyxLQUFLO0FBQ2pDLHVCQUFpQixLQUFLLEtBQUs7QUFBQSxRQUN6QixPQUFPO0FBQUEsUUFDUCxTQUFTLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFBQSxRQUM5RCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFDRjs7O0FTL3lCTyxTQUFTLHlCQUF5QjtBQUN2QyxVQUFRLElBQUksa0pBQW9DO0FBRWhELFNBQU8sU0FBUyxpQkFDZCxLQUNBLEtBQ0EsTUFDQTtBQUNBLFVBQU0sTUFBTSxJQUFJLE9BQU87QUFDdkIsVUFBTSxTQUFTLElBQUksVUFBVTtBQUc3QixRQUFJLFFBQVEsYUFBYTtBQUN2QixjQUFRLElBQUksMEVBQW1CLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFFOUMsVUFBSTtBQUVGLFlBQUksVUFBVSwrQkFBK0IsR0FBRztBQUNoRCxZQUFJLFVBQVUsZ0NBQWdDLGlDQUFpQztBQUMvRSxZQUFJLFVBQVUsZ0NBQWdDLDZCQUE2QjtBQUczRSxZQUFJLFdBQVcsV0FBVztBQUN4QixrQkFBUSxJQUFJLDhFQUF1QjtBQUNuQyxjQUFJLGFBQWE7QUFDakIsY0FBSSxJQUFJO0FBQ1I7QUFBQSxRQUNGO0FBR0EsWUFBSSxhQUFhLGNBQWM7QUFDL0IsWUFBSSxVQUFVLGdCQUFnQixpQ0FBaUM7QUFDL0QsWUFBSSxhQUFhO0FBR2pCLGNBQU0sZUFBZTtBQUFBLFVBQ25CLFNBQVM7QUFBQSxVQUNULFNBQVM7QUFBQSxVQUNULE1BQU07QUFBQSxZQUNKLE9BQU0sb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxZQUM3QjtBQUFBLFlBQ0E7QUFBQSxZQUNBLFNBQVMsSUFBSTtBQUFBLFlBQ2IsUUFBUSxJQUFJLFNBQVMsR0FBRyxJQUFJLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQUEsVUFDbEQ7QUFBQSxRQUNGO0FBR0EsZ0JBQVEsSUFBSSx1RUFBZ0I7QUFDNUIsWUFBSSxJQUFJLEtBQUssVUFBVSxjQUFjLE1BQU0sQ0FBQyxDQUFDO0FBRzdDO0FBQUEsTUFDRixTQUFTLE9BQU87QUFFZCxnQkFBUSxNQUFNLGdGQUFvQixLQUFLO0FBR3ZDLFlBQUksYUFBYSxjQUFjO0FBQy9CLFlBQUksYUFBYTtBQUNqQixZQUFJLFVBQVUsZ0JBQWdCLGlDQUFpQztBQUMvRCxZQUFJLElBQUksS0FBSyxVQUFVO0FBQUEsVUFDckIsU0FBUztBQUFBLFVBQ1QsU0FBUztBQUFBLFVBQ1QsT0FBTyxpQkFBaUIsUUFBUSxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBQUEsUUFDOUQsQ0FBQyxDQUFDO0FBR0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUdBLFNBQUs7QUFBQSxFQUNQO0FBQ0Y7OztBVjFFQSxPQUFPLFFBQVE7QUFSZixJQUFNLG1DQUFtQztBQVl6QyxTQUFTLFNBQVMsTUFBYztBQUM5QixVQUFRLElBQUksbUNBQWUsSUFBSSwyQkFBTztBQUN0QyxNQUFJO0FBQ0YsUUFBSSxRQUFRLGFBQWEsU0FBUztBQUNoQyxlQUFTLDJCQUEyQixJQUFJLEVBQUU7QUFDMUMsZUFBUyw4Q0FBOEMsSUFBSSx3QkFBd0IsRUFBRSxPQUFPLFVBQVUsQ0FBQztBQUFBLElBQ3pHLE9BQU87QUFDTCxlQUFTLFlBQVksSUFBSSx1QkFBdUIsRUFBRSxPQUFPLFVBQVUsQ0FBQztBQUFBLElBQ3RFO0FBQ0EsWUFBUSxJQUFJLHlDQUFnQixJQUFJLEVBQUU7QUFBQSxFQUNwQyxTQUFTLEdBQUc7QUFDVixZQUFRLElBQUksdUJBQWEsSUFBSSx5REFBWTtBQUFBLEVBQzNDO0FBQ0Y7QUFHQSxTQUFTLGlCQUFpQjtBQUN4QixVQUFRLElBQUksNkNBQWU7QUFDM0IsUUFBTSxhQUFhO0FBQUEsSUFDakI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFFQSxhQUFXLFFBQVEsZUFBYTtBQUM5QixRQUFJO0FBQ0YsVUFBSSxHQUFHLFdBQVcsU0FBUyxHQUFHO0FBQzVCLFlBQUksR0FBRyxVQUFVLFNBQVMsRUFBRSxZQUFZLEdBQUc7QUFDekMsbUJBQVMsVUFBVSxTQUFTLEVBQUU7QUFBQSxRQUNoQyxPQUFPO0FBQ0wsYUFBRyxXQUFXLFNBQVM7QUFBQSxRQUN6QjtBQUNBLGdCQUFRLElBQUksOEJBQWUsU0FBUyxFQUFFO0FBQUEsTUFDeEM7QUFBQSxJQUNGLFNBQVMsR0FBRztBQUNWLGNBQVEsSUFBSSxvQ0FBZ0IsU0FBUyxJQUFJLENBQUM7QUFBQSxJQUM1QztBQUFBLEVBQ0YsQ0FBQztBQUNIO0FBR0EsZUFBZTtBQUdmLFNBQVMsSUFBSTtBQUdiLFNBQVMsb0JBQW9CLFNBQWtCLGVBQXVDO0FBQ3BGLE1BQUksQ0FBQyxXQUFXLENBQUMsZUFBZTtBQUM5QixXQUFPO0FBQUEsRUFDVDtBQUdBLFFBQU0saUJBQWlCLFVBQVUscUJBQXFCLElBQUk7QUFDMUQsUUFBTSxtQkFBbUIsZ0JBQWdCLHVCQUF1QixJQUFJO0FBRXBFLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQTtBQUFBLElBRU4sU0FBUztBQUFBO0FBQUEsSUFFVCxnQkFBZ0IsUUFBUTtBQUV0QixZQUFNLGtCQUFrQixPQUFPLFlBQVk7QUFFM0MsYUFBTyxZQUFZLFNBQVMsU0FBUyxLQUFLLEtBQUssTUFBTTtBQUNuRCxjQUFNLE1BQU0sSUFBSSxPQUFPO0FBR3ZCLFlBQUksSUFBSSxXQUFXLE9BQU8sR0FBRztBQUMzQixrQkFBUSxJQUFJLHlEQUFzQixJQUFJLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFHckQsY0FBSSxpQkFBaUIsb0JBQW9CLElBQUksV0FBVyxXQUFXLEdBQUc7QUFDcEUsb0JBQVEsSUFBSSw4RUFBdUIsR0FBRyxFQUFFO0FBR3hDLFlBQUMsSUFBWSxlQUFlO0FBRTVCLG1CQUFPLGlCQUFpQixLQUFLLEtBQUssQ0FBQyxRQUFnQjtBQUNqRCxrQkFBSSxLQUFLO0FBQ1Asd0JBQVEsTUFBTSw4RUFBdUIsR0FBRztBQUN4QyxxQkFBSyxHQUFHO0FBQUEsY0FDVixXQUFXLENBQUUsSUFBdUIsZUFBZTtBQUVqRCxxQkFBSztBQUFBLGNBQ1A7QUFBQSxZQUNGLENBQUM7QUFBQSxVQUNIO0FBR0EsY0FBSSxXQUFXLGdCQUFnQjtBQUM3QixvQkFBUSxJQUFJLHNFQUF5QixHQUFHLEVBQUU7QUFHMUMsWUFBQyxJQUFZLGVBQWU7QUFFNUIsbUJBQU8sZUFBZSxLQUFLLEtBQUssQ0FBQyxRQUFnQjtBQUMvQyxrQkFBSSxLQUFLO0FBQ1Asd0JBQVEsTUFBTSxzRUFBeUIsR0FBRztBQUMxQyxxQkFBSyxHQUFHO0FBQUEsY0FDVixXQUFXLENBQUUsSUFBdUIsZUFBZTtBQUVqRCxxQkFBSztBQUFBLGNBQ1A7QUFBQSxZQUNGLENBQUM7QUFBQSxVQUNIO0FBQUEsUUFDRjtBQUdBLGVBQU8sZ0JBQWdCLEtBQUssT0FBTyxhQUFhLEtBQUssS0FBSyxJQUFJO0FBQUEsTUFDaEU7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFFeEMsVUFBUSxJQUFJLG9CQUFvQixRQUFRLElBQUkscUJBQXFCO0FBQ2pFLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUczQyxRQUFNLGFBQWEsUUFBUSxJQUFJLHNCQUFzQjtBQUdyRCxRQUFNLGFBQWEsUUFBUSxJQUFJLHFCQUFxQjtBQUdwRCxRQUFNLGdCQUFnQjtBQUV0QixVQUFRLElBQUksZ0RBQWtCLElBQUksRUFBRTtBQUNwQyxVQUFRLElBQUksZ0NBQXNCLGFBQWEsaUJBQU8sY0FBSSxFQUFFO0FBQzVELFVBQVEsSUFBSSxvREFBc0IsZ0JBQWdCLGlCQUFPLGNBQUksRUFBRTtBQUMvRCxVQUFRLElBQUksMkJBQWlCLGFBQWEsaUJBQU8sY0FBSSxFQUFFO0FBR3ZELFFBQU0sYUFBYSxvQkFBb0IsWUFBWSxhQUFhO0FBR2hFLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQTtBQUFBLE1BRVAsR0FBSSxhQUFhLENBQUMsVUFBVSxJQUFJLENBQUM7QUFBQSxNQUNqQyxJQUFJO0FBQUEsSUFDTjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFFTixLQUFLLGFBQWEsUUFBUTtBQUFBLFFBQ3hCLFVBQVU7QUFBQSxRQUNWLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxNQUNkO0FBQUE7QUFBQSxNQUVBLE9BQU8sQ0FBQztBQUFBLElBQ1Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxRQUNQLFNBQVMsQ0FBQyxhQUFhLFlBQVk7QUFBQSxNQUNyQztBQUFBLE1BQ0EscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osbUJBQW1CO0FBQUEsUUFDckI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsYUFBYTtBQUFBLE1BQ2IsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsZUFBZTtBQUFBLFFBQ2pCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQTtBQUFBLE1BRVosU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLFNBQVM7QUFBQTtBQUFBLFFBRVA7QUFBQTtBQUFBLFFBRUE7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLE9BQU87QUFBQSxJQUNUO0FBQUE7QUFBQSxJQUVBLFVBQVU7QUFBQTtBQUFBLElBRVYsU0FBUztBQUFBLE1BQ1AsYUFBYTtBQUFBLFFBQ1gsNEJBQTRCO0FBQUEsTUFDOUI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbImRlbGF5IiwgInNpbXVsYXRlRGVsYXkiLCAic2ltdWxhdGVEZWxheSIsICJxdWVyeVNlcnZpY2UiLCAiaW50ZWdyYXRpb25TZXJ2aWNlIiwgImRlbGF5IiwgInF1ZXJ5U2VydmljZSJdCn0K
