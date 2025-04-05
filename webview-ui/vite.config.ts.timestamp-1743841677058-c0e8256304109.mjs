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

// src/mock/services/index.ts
var query = {
  /**
   * 获取查询列表
   */
  async getQueries(params) {
    await delay();
    return createPaginationResponse({
      items: [
        { id: "q1", name: "\u7528\u6237\u5206\u6790\u67E5\u8BE2", description: "\u6309\u5730\u533A\u7EDF\u8BA1\u7528\u6237\u6CE8\u518C\u6570\u636E", createdAt: (/* @__PURE__ */ new Date()).toISOString() },
        { id: "q2", name: "\u9500\u552E\u4E1A\u7EE9\u67E5\u8BE2", description: "\u6309\u6708\u7EDF\u8BA1\u9500\u552E\u989D", createdAt: (/* @__PURE__ */ new Date()).toISOString() },
        { id: "q3", name: "\u5E93\u5B58\u5206\u6790", description: "\u76D1\u63A7\u5E93\u5B58\u6C34\u5E73", createdAt: (/* @__PURE__ */ new Date()).toISOString() }
      ],
      total: 3,
      page: params.page,
      size: params.size
    });
  },
  /**
   * 获取单个查询
   */
  async getQuery(id) {
    await delay();
    return {
      id,
      name: "\u793A\u4F8B\u67E5\u8BE2",
      description: "\u8FD9\u662F\u4E00\u4E2A\u793A\u4F8B\u67E5\u8BE2",
      sql: "SELECT * FROM users WHERE status = $1",
      parameters: ["active"],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  },
  /**
   * 创建查询
   */
  async createQuery(data) {
    await delay();
    return {
      id: `query-${Date.now()}`,
      ...data,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  },
  /**
   * 更新查询
   */
  async updateQuery(id, data) {
    await delay();
    return {
      id,
      ...data,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  },
  /**
   * 删除查询
   */
  async deleteQuery(id) {
    await delay();
    return { success: true };
  },
  /**
   * 执行查询
   */
  async executeQuery(id, params) {
    await delay();
    return {
      columns: ["id", "name", "email", "status"],
      rows: [
        { id: 1, name: "\u5F20\u4E09", email: "zhang@example.com", status: "active" },
        { id: 2, name: "\u674E\u56DB", email: "li@example.com", status: "active" },
        { id: 3, name: "\u738B\u4E94", email: "wang@example.com", status: "inactive" }
      ],
      metadata: {
        executionTime: 0.235,
        rowCount: 3,
        totalPages: 1
      }
    };
  }
};
var services = {
  dataSource: datasource_default,
  query
};
var dataSourceService = services.dataSource;
var queryService = services.query;

// src/mock/middleware/index.ts
var MOCK_QUERIES = [
  { id: 1, name: "\u67E5\u8BE21", sql: "SELECT * FROM users", datasource_id: 1, created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-02T10:30:00Z" },
  { id: 2, name: "\u67E5\u8BE22", sql: "SELECT count(*) FROM orders", datasource_id: 2, created_at: "2023-01-03T00:00:00Z", updated_at: "2023-01-05T14:20:00Z" },
  { id: 3, name: "\u590D\u6742\u67E5\u8BE2", sql: "SELECT u.id, u.name, COUNT(o.id) as order_count FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name", datasource_id: 1, created_at: "2023-01-10T00:00:00Z", updated_at: "2023-01-12T09:15:00Z" }
];
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
function handleQueriesApi(req, res, urlPath) {
  var _a;
  const method = (_a = req.method) == null ? void 0 : _a.toUpperCase();
  if (urlPath === "/api/queries" && method === "GET") {
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: /api/queries`);
    sendJsonResponse(res, 200, {
      data: MOCK_QUERIES,
      total: MOCK_QUERIES.length,
      success: true
    });
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/\d+$/) && method === "GET") {
    const id = parseInt(urlPath.split("/").pop() || "0");
    const query2 = MOCK_QUERIES.find((q) => q.id === id);
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    if (query2) {
      sendJsonResponse(res, 200, {
        data: query2,
        success: true
      });
    } else {
      sendJsonResponse(res, 404, {
        error: "\u67E5\u8BE2\u4E0D\u5B58\u5728",
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/\d+\/run$/) && method === "POST") {
    const id = parseInt(urlPath.split("/")[3] || "0");
    const query2 = MOCK_QUERIES.find((q) => q.id === id);
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    if (query2) {
      sendJsonResponse(res, 200, {
        data: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
          { id: 3, name: "Bob Johnson", email: "bob@example.com" }
        ],
        columns: ["id", "name", "email"],
        rows: 3,
        execution_time: 0.123,
        success: true
      });
    } else {
      sendJsonResponse(res, 404, {
        error: "\u67E5\u8BE2\u4E0D\u5B58\u5728",
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
      const parsedUrl = parse(url, true);
      const urlPath = parsedUrl.pathname || "";
      const urlQuery = parsedUrl.query || {};
      if (!shouldMockRequest(url)) {
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
        handled = handleQueriesApi(req, res, urlPath);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50cyIsICJzcmMvbW9jay9jb25maWcudHMiLCAic3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHMiLCAic3JjL21vY2svc2VydmljZXMvdXRpbHMudHMiLCAic3JjL21vY2svc2VydmljZXMvaW5kZXgudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYsIFBsdWdpbiwgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAndGFpbHdpbmRjc3MnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcbmltcG9ydCBjcmVhdGVNb2NrTWlkZGxld2FyZSBmcm9tICcuL3NyYy9tb2NrL21pZGRsZXdhcmUnXG5pbXBvcnQgeyBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlIH0gZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZSdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCdcblxuLy8gXHU1RjNBXHU1MjM2XHU5MUNBXHU2NTNFXHU3QUVGXHU1M0UzXHU1MUZEXHU2NTcwXG5mdW5jdGlvbiBraWxsUG9ydChwb3J0OiBudW1iZXIpIHtcbiAgY29uc29sZS5sb2coYFtWaXRlXSBcdTY4QzBcdTY3RTVcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTUzNjBcdTc1MjhcdTYwQzVcdTUxQjVgKTtcbiAgdHJ5IHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgZXhlY1N5bmMoYG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH1gKTtcbiAgICAgIGV4ZWNTeW5jKGB0YXNra2lsbCAvRiAvcGlkICQobmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fSB8IGF3ayAne3ByaW50ICQ1fScpYCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBleGVjU3luYyhgbHNvZiAtaSA6JHtwb3J0fSAtdCB8IHhhcmdzIGtpbGwgLTlgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU1REYyXHU5MUNBXHU2NTNFXHU3QUVGXHU1M0UzICR7cG9ydH1gKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU3QUVGXHU1M0UzICR7cG9ydH0gXHU2NzJBXHU4OEFCXHU1MzYwXHU3NTI4XHU2MjE2XHU2NUUwXHU2Q0Q1XHU5MUNBXHU2NTNFYCk7XG4gIH1cbn1cblxuLy8gXHU1RjNBXHU1MjM2XHU2RTA1XHU3NDA2Vml0ZVx1N0YxM1x1NUI1OFxuZnVuY3Rpb24gY2xlYW5WaXRlQ2FjaGUoKSB7XG4gIGNvbnNvbGUubG9nKCdbVml0ZV0gXHU2RTA1XHU3NDA2XHU0RjlEXHU4RDU2XHU3RjEzXHU1QjU4Jyk7XG4gIGNvbnN0IGNhY2hlUGF0aHMgPSBbXG4gICAgJy4vbm9kZV9tb2R1bGVzLy52aXRlJyxcbiAgICAnLi9ub2RlX21vZHVsZXMvLnZpdGVfKicsXG4gICAgJy4vLnZpdGUnLFxuICAgICcuL2Rpc3QnLFxuICAgICcuL3RtcCcsXG4gICAgJy4vLnRlbXAnXG4gIF07XG4gIFxuICBjYWNoZVBhdGhzLmZvckVhY2goY2FjaGVQYXRoID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoY2FjaGVQYXRoKSkge1xuICAgICAgICBpZiAoZnMubHN0YXRTeW5jKGNhY2hlUGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgIGV4ZWNTeW5jKGBybSAtcmYgJHtjYWNoZVBhdGh9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMudW5saW5rU3luYyhjYWNoZVBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU1REYyXHU1MjIwXHU5NjY0OiAke2NhY2hlUGF0aH1gKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjVFMFx1NkNENVx1NTIyMFx1OTY2NDogJHtjYWNoZVBhdGh9YCwgZSk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gXHU2RTA1XHU3NDA2Vml0ZVx1N0YxM1x1NUI1OFxuY2xlYW5WaXRlQ2FjaGUoKTtcblxuLy8gXHU1QzFEXHU4QkQ1XHU5MUNBXHU2NTNFXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU3QUVGXHU1M0UzXG5raWxsUG9ydCg4MDgwKTtcblxuLy8gXHU1MjFCXHU1RUZBTW9jayBBUElcdTYzRDJcdTRFRjZcbmZ1bmN0aW9uIGNyZWF0ZU1vY2tBcGlQbHVnaW4odXNlTW9jazogYm9vbGVhbiwgdXNlU2ltcGxlTW9jazogYm9vbGVhbik6IFBsdWdpbiB8IG51bGwge1xuICBpZiAoIXVzZU1vY2sgJiYgIXVzZVNpbXBsZU1vY2spIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBcbiAgLy8gXHU1MkEwXHU4RjdEXHU0RTJEXHU5NUY0XHU0RUY2XG4gIGNvbnN0IG1vY2tNaWRkbGV3YXJlID0gdXNlTW9jayA/IGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCkgOiBudWxsO1xuICBjb25zdCBzaW1wbGVNaWRkbGV3YXJlID0gdXNlU2ltcGxlTW9jayA/IGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUoKSA6IG51bGw7XG4gIFxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLXBsdWdpbi1tb2NrLWFwaScsXG4gICAgLy8gXHU1MTczXHU5NTJFXHU3MEI5XHVGRjFBXHU0RjdGXHU3NTI4IHByZSBcdTc4NkVcdTRGRERcdTZCNjRcdTYzRDJcdTRFRjZcdTUxNDhcdTRFOEVcdTUxODVcdTdGNkVcdTYzRDJcdTRFRjZcdTYyNjdcdTg4NENcbiAgICBlbmZvcmNlOiAncHJlJyBhcyBjb25zdCxcbiAgICAvLyBcdTU3MjhcdTY3MERcdTUyQTFcdTU2NjhcdTUyMUJcdTVFRkFcdTRFNEJcdTUyNERcdTkxNERcdTdGNkVcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAvLyBcdTY2RkZcdTYzNjJcdTUzOUZcdTU5Q0JcdThCRjdcdTZDNDJcdTU5MDRcdTc0MDZcdTU2NjhcdUZGMENcdTRGN0ZcdTYyMTFcdTRFRUNcdTc2ODRcdTRFMkRcdTk1RjRcdTRFRjZcdTUxNzdcdTY3MDlcdTY3MDBcdTlBRDhcdTRGMThcdTUxNDhcdTdFQTdcbiAgICAgIGNvbnN0IG9yaWdpbmFsSGFuZGxlciA9IHNlcnZlci5taWRkbGV3YXJlcy5oYW5kbGU7XG4gICAgICBcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy5oYW5kbGUgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1M0VBXHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aCgnL2FwaS8nKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU2OEMwXHU2RDRCXHU1MjMwQVBJXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsfWApO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1NEYxOFx1NTE0OFx1NTkwNFx1NzQwNlx1NzI3OVx1NUI5QVx1NkQ0Qlx1OEJENUFQSVxuICAgICAgICAgIGlmICh1c2VTaW1wbGVNb2NrICYmIHNpbXBsZU1pZGRsZXdhcmUgJiYgdXJsLnN0YXJ0c1dpdGgoJy9hcGkvdGVzdCcpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTYzRDJcdTRFRjZdIFx1NEY3Rlx1NzUyOFx1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNjogJHt1cmx9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFx1OEJCRVx1N0Y2RVx1NEUwMFx1NEUyQVx1NjgwN1x1OEJCMFx1RkYwQ1x1OTYzMlx1NkI2Mlx1NTE3Nlx1NEVENlx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgKHJlcSBhcyBhbnkpLl9tb2NrSGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBzaW1wbGVNaWRkbGV3YXJlKHJlcSwgcmVzLCAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTUxRkFcdTk1MTk6YCwgZXJyKTtcbiAgICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIShyZXMgYXMgU2VydmVyUmVzcG9uc2UpLndyaXRhYmxlRW5kZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTU0Q0RcdTVFOTRcdTZDQTFcdTY3MDlcdTdFRDNcdTY3NUZcdUZGMENcdTdFRTdcdTdFRURcdTU5MDRcdTc0MDZcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTUxNzZcdTRFRDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgICBpZiAodXNlTW9jayAmJiBtb2NrTWlkZGxld2FyZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTRGN0ZcdTc1MjhNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2OiAke3VybH1gKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU4QkJFXHU3RjZFXHU0RTAwXHU0RTJBXHU2ODA3XHU4QkIwXHVGRjBDXHU5NjMyXHU2QjYyXHU1MTc2XHU0RUQ2XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyXG4gICAgICAgICAgICAocmVxIGFzIGFueSkuX21vY2tIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG1vY2tNaWRkbGV3YXJlKHJlcSwgcmVzLCAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtNb2NrXHU2M0QyXHU0RUY2XSBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU1MUZBXHU5NTE5OmAsIGVycik7XG4gICAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEocmVzIGFzIFNlcnZlclJlc3BvbnNlKS53cml0YWJsZUVuZGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NENEXHU1RTk0XHU2Q0ExXHU2NzA5XHU3RUQzXHU2NzVGXHVGRjBDXHU3RUU3XHU3RUVEXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1NUJGOVx1NEU4RVx1OTc1RUFQSVx1OEJGN1x1NkM0Mlx1RkYwQ1x1NEY3Rlx1NzUyOFx1NTM5Rlx1NTlDQlx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgICByZXR1cm4gb3JpZ2luYWxIYW5kbGVyLmNhbGwoc2VydmVyLm1pZGRsZXdhcmVzLCByZXEsIHJlcywgbmV4dCk7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxuLy8gXHU1N0ZBXHU2NzJDXHU5MTREXHU3RjZFXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIC8vIFx1NTJBMFx1OEY3RFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxuICBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJIHx8ICdmYWxzZSc7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9jayBBUEkgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgdXNlTW9ja0FwaSA9IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZSc7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTc5ODFcdTc1MjhITVIgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgZGlzYWJsZUhtciA9IHByb2Nlc3MuZW52LlZJVEVfRElTQUJMRV9ITVIgPT09ICd0cnVlJztcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1NEY3Rlx1NzUyOFx1N0I4MFx1NTM1NVx1NkQ0Qlx1OEJENVx1NkEyMVx1NjJERkFQSVxuICBjb25zdCB1c2VTaW1wbGVNb2NrID0gdHJ1ZTtcbiAgXG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gXHU4RkQwXHU4ODRDXHU2QTIxXHU1RjBGOiAke21vZGV9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gTW9jayBBUEk6ICR7dXNlTW9ja0FwaSA/ICdcdTU0MkZcdTc1MjgnIDogJ1x1Nzk4MVx1NzUyOCd9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gXHU3QjgwXHU1MzU1TW9ja1x1NkQ0Qlx1OEJENTogJHt1c2VTaW1wbGVNb2NrID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFNb2NrXHU2M0QyXHU0RUY2XG4gIGNvbnN0IG1vY2tQbHVnaW4gPSBjcmVhdGVNb2NrQXBpUGx1Z2luKHVzZU1vY2tBcGksIHVzZVNpbXBsZU1vY2spO1xuICBcbiAgLy8gXHU5MTREXHU3RjZFXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgLy8gXHU2REZCXHU1MkEwTW9ja1x1NjNEMlx1NEVGNlx1RkYwOFx1NTk4Mlx1Njc5Q1x1NTQyRlx1NzUyOFx1RkYwOVxuICAgICAgLi4uKG1vY2tQbHVnaW4gPyBbbW9ja1BsdWdpbl0gOiBbXSksXG4gICAgICB2dWUoKSxcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogODA4MCxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgLy8gSE1SXHU5MTREXHU3RjZFXG4gICAgICBobXI6IGRpc2FibGVIbXIgPyBmYWxzZSA6IHtcbiAgICAgICAgcHJvdG9jb2w6ICd3cycsXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBjbGllbnRQb3J0OiA4MDgwLFxuICAgICAgfSxcbiAgICAgIC8vIFx1Nzk4MVx1NzUyOFx1NEVFM1x1NzQwNlx1RkYwQ1x1OEJBOVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NjI0MFx1NjcwOVx1OEJGN1x1NkM0MlxuICAgICAgcHJveHk6IHt9XG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzLCBhdXRvcHJlZml4ZXJdLFxuICAgICAgfSxcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgbGVzczoge1xuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAvLyBcdTUzMDVcdTU0MkJcdTU3RkFcdTY3MkNcdTRGOURcdThENTZcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ3Z1ZScsIFxuICAgICAgICAndnVlLXJvdXRlcicsXG4gICAgICAgICdwaW5pYScsXG4gICAgICAgICdheGlvcycsXG4gICAgICAgICdkYXlqcycsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZScsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZS9lcy9sb2NhbGUvemhfQ04nXG4gICAgICBdLFxuICAgICAgLy8gXHU2MzkyXHU5NjY0XHU3Mjc5XHU1QjlBXHU0RjlEXHU4RDU2XG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgIC8vIFx1NjM5Mlx1OTY2NFx1NjNEMlx1NEVGNlx1NEUyRFx1NzY4NFx1NjcwRFx1NTJBMVx1NTY2OE1vY2tcbiAgICAgICAgJ3NyYy9wbHVnaW5zL3NlcnZlck1vY2sudHMnLFxuICAgICAgICAvLyBcdTYzOTJcdTk2NjRmc2V2ZW50c1x1NjcyQ1x1NTczMFx1NkEyMVx1NTc1N1x1RkYwQ1x1OTA3Rlx1NTE0RFx1Njc4NFx1NUVGQVx1OTUxOVx1OEJFRlxuICAgICAgICAnZnNldmVudHMnXG4gICAgICBdLFxuICAgICAgLy8gXHU3ODZFXHU0RkREXHU0RjlEXHU4RDU2XHU5ODg0XHU2Nzg0XHU1RUZBXHU2QjYzXHU3ODZFXHU1QjhDXHU2MjEwXG4gICAgICBmb3JjZTogdHJ1ZSxcbiAgICB9LFxuICAgIC8vIFx1NEY3Rlx1NzUyOFx1NTM1NVx1NzJFQ1x1NzY4NFx1N0YxM1x1NUI1OFx1NzZFRVx1NUY1NVxuICAgIGNhY2hlRGlyOiAnbm9kZV9tb2R1bGVzLy52aXRlX2NhY2hlJyxcbiAgICAvLyBcdTk2MzJcdTZCNjJcdTU4MDZcdTY4MDhcdTZFQTJcdTUxRkFcbiAgICBlc2J1aWxkOiB7XG4gICAgICBsb2dPdmVycmlkZToge1xuICAgICAgICAndGhpcy1pcy11bmRlZmluZWQtaW4tZXNtJzogJ3NpbGVudCdcbiAgICAgIH0sXG4gICAgfVxuICB9XG59KTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1N0JBMVx1NzQwNlx1NkEyMVx1NTc1N1xuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRIVFRQXHU4QkY3XHU2QzQyXHU2MkU2XHU2MjJBXHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU3NTI4XHU0RThFXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XG4gKiBcdThEMUZcdThEMjNcdTdCQTFcdTc0MDZcdTU0OENcdTUyMDZcdTUzRDFcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTUyMzBcdTVCRjlcdTVFOTRcdTc2ODRcdTY3MERcdTUyQTFcdTU5MDRcdTc0MDZcdTUxRkRcdTY1NzBcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IEluY29taW5nTWVzc2FnZSwgU2VydmVyUmVzcG9uc2UgfSBmcm9tICdodHRwJztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IG1vY2tDb25maWcsIHNob3VsZE1vY2tSZXF1ZXN0LCBsb2dNb2NrIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU1QkZDXHU1MTY1XHU2NzBEXHU1MkExXG5pbXBvcnQgeyBkYXRhU291cmNlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzJztcblxuLy8gXHU2QTIxXHU2MkRGXHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG5jb25zdCBNT0NLX1FVRVJJRVMgPSBbXG4gIHsgaWQ6IDEsIG5hbWU6ICdcdTY3RTVcdThCRTIxJywgc3FsOiAnU0VMRUNUICogRlJPTSB1c2VycycsIGRhdGFzb3VyY2VfaWQ6IDEsIGNyZWF0ZWRfYXQ6ICcyMDIzLTAxLTAxVDAwOjAwOjAwWicsIHVwZGF0ZWRfYXQ6ICcyMDIzLTAxLTAyVDEwOjMwOjAwWicgfSxcbiAgeyBpZDogMiwgbmFtZTogJ1x1NjdFNVx1OEJFMjInLCBzcWw6ICdTRUxFQ1QgY291bnQoKikgRlJPTSBvcmRlcnMnLCBkYXRhc291cmNlX2lkOiAyLCBjcmVhdGVkX2F0OiAnMjAyMy0wMS0wM1QwMDowMDowMFonLCB1cGRhdGVkX2F0OiAnMjAyMy0wMS0wNVQxNDoyMDowMFonIH0sXG4gIHsgaWQ6IDMsIG5hbWU6ICdcdTU5MERcdTY3NDJcdTY3RTVcdThCRTInLCBzcWw6ICdTRUxFQ1QgdS5pZCwgdS5uYW1lLCBDT1VOVChvLmlkKSBhcyBvcmRlcl9jb3VudCBGUk9NIHVzZXJzIHUgSk9JTiBvcmRlcnMgbyBPTiB1LmlkID0gby51c2VyX2lkIEdST1VQIEJZIHUuaWQsIHUubmFtZScsIGRhdGFzb3VyY2VfaWQ6IDEsIGNyZWF0ZWRfYXQ6ICcyMDIzLTAxLTEwVDAwOjAwOjAwWicsIHVwZGF0ZWRfYXQ6ICcyMDIzLTAxLTEyVDA5OjE1OjAwWicgfVxuXTtcblxuLy8gXHU1OTA0XHU3NDA2Q09SU1x1OEJGN1x1NkM0MlxuZnVuY3Rpb24gaGFuZGxlQ29ycyhyZXM6IFNlcnZlclJlc3BvbnNlKSB7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbiwgWC1Nb2NrLUVuYWJsZWQnKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtTWF4LUFnZScsICc4NjQwMCcpO1xufVxuXG4vLyBcdTUzRDFcdTkwMDFKU09OXHU1NENEXHU1RTk0XG5mdW5jdGlvbiBzZW5kSnNvblJlc3BvbnNlKHJlczogU2VydmVyUmVzcG9uc2UsIHN0YXR1czogbnVtYmVyLCBkYXRhOiBhbnkpIHtcbiAgcmVzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG4vLyBcdTVFRjZcdThGREZcdTYyNjdcdTg4NENcbmZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vLyBcdTg5RTNcdTY3OTBcdThCRjdcdTZDNDJcdTRGNTNcbmFzeW5jIGZ1bmN0aW9uIHBhcnNlUmVxdWVzdEJvZHkocmVxOiBJbmNvbWluZ01lc3NhZ2UpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsZXQgYm9keSA9ICcnO1xuICAgIHJlcS5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgICAgYm9keSArPSBjaHVuay50b1N0cmluZygpO1xuICAgIH0pO1xuICAgIHJlcS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZShib2R5ID8gSlNPTi5wYXJzZShib2R5KSA6IHt9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVzb2x2ZSh7fSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY1NzBcdTYzNkVcdTZFOTBBUElcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZURhdGFzb3VyY2VzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcsIHVybFF1ZXJ5OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6IC9hcGkvZGF0YXNvdXJjZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU2NzBEXHU1MkExXHU1QzQyXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XHVGRjBDXHU2NTJGXHU2MzAxXHU1MjA2XHU5ODc1XHU1NDhDXHU4RkM3XHU2RUU0XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5nZXREYXRhU291cmNlcyh7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHVybFF1ZXJ5LnBhZ2UgYXMgc3RyaW5nKSB8fCAxLFxuICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgIG5hbWU6IHVybFF1ZXJ5Lm5hbWUgYXMgc3RyaW5nLFxuICAgICAgICB0eXBlOiB1cmxRdWVyeS50eXBlIGFzIHN0cmluZyxcbiAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcmVzdWx0Lml0ZW1zLCBcbiAgICAgICAgcGFnaW5hdGlvbjogcmVzdWx0LnBhZ2luYXRpb24sXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhc291cmNlID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuZ2V0RGF0YVNvdXJjZShpZCk7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiBkYXRhc291cmNlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlIFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzJyAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6IC9hcGkvZGF0YXNvdXJjZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IG5ld0RhdGFTb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS5jcmVhdGVEYXRhU291cmNlKGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7XG4gICAgICAgIGRhdGE6IG5ld0RhdGFTb3VyY2UsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMUJcdTVFRkFcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQVVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgdXBkYXRlZERhdGFTb3VyY2UgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS51cGRhdGVEYXRhU291cmNlKGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB1cGRhdGVkRGF0YVNvdXJjZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgIGVycm9yOiAnXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1teXFwvXSskLykgJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgIGNvbnN0IGlkID0gdXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkRFTEVURVx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmRlbGV0ZURhdGFTb3VyY2UoaWQpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIG1lc3NhZ2U6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMjBcdTk2NjRcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2RDRCXHU4QkQ1XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkRFXHU2M0E1XG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcy90ZXN0LWNvbm5lY3Rpb24nICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlcy90ZXN0LWNvbm5lY3Rpb25gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLnRlc3RDb25uZWN0aW9uKGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTZENEJcdThCRDVcdThGREVcdTYzQTVcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gXHU1OTA0XHU3NDA2XHU2N0U1XHU4QkUyQVBJXG5mdW5jdGlvbiBoYW5kbGVRdWVyaWVzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9xdWVyaWVzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXNgKTtcbiAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgZGF0YTogTU9DS19RVUVSSUVTLCBcbiAgICAgIHRvdGFsOiBNT0NLX1FVRVJJRVMubGVuZ3RoLFxuICAgICAgc3VjY2VzczogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9cXGQrJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBpZCA9IHBhcnNlSW50KHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnMCcpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gTU9DS19RVUVSSUVTLmZpbmQocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICBpZiAocXVlcnkpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IHF1ZXJ5LFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY3RTVcdThCRTJcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9cXGQrXFwvcnVuJC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgY29uc3QgaWQgPSBwYXJzZUludCh1cmxQYXRoLnNwbGl0KCcvJylbM10gfHwgJzAnKTtcbiAgICBjb25zdCBxdWVyeSA9IE1PQ0tfUVVFUklFUy5maW5kKHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIGlmIChxdWVyeSkge1xuICAgICAgLy8gXHU2QTIxXHU2MkRGXHU2N0U1XHU4QkUyXHU2MjY3XHU4ODRDXHU3RUQzXHU2NzlDXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7XG4gICAgICAgIGRhdGE6IFtcbiAgICAgICAgICB7IGlkOiAxLCBuYW1lOiAnSm9obiBEb2UnLCBlbWFpbDogJ2pvaG5AZXhhbXBsZS5jb20nIH0sXG4gICAgICAgICAgeyBpZDogMiwgbmFtZTogJ0phbmUgU21pdGgnLCBlbWFpbDogJ2phbmVAZXhhbXBsZS5jb20nIH0sXG4gICAgICAgICAgeyBpZDogMywgbmFtZTogJ0JvYiBKb2huc29uJywgZW1haWw6ICdib2JAZXhhbXBsZS5jb20nIH1cbiAgICAgICAgXSxcbiAgICAgICAgY29sdW1uczogWydpZCcsICduYW1lJywgJ2VtYWlsJ10sXG4gICAgICAgIHJvd3M6IDMsXG4gICAgICAgIGV4ZWN1dGlvbl90aW1lOiAwLjEyMyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHsgXG4gICAgICAgIGVycm9yOiAnXHU2N0U1XHU4QkUyXHU0RTBEXHU1QjU4XHU1NzI4JyxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTUyMUJcdTVFRkFcdTRFMkRcdTk1RjRcdTRFRjZcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCk6IENvbm5lY3QuTmV4dEhhbmRsZUZ1bmN0aW9uIHtcbiAgLy8gXHU1OTgyXHU2NzlDTW9ja1x1NjcwRFx1NTJBMVx1ODhBQlx1Nzk4MVx1NzUyOFx1RkYwQ1x1OEZENFx1NTZERVx1N0E3QVx1NEUyRFx1OTVGNFx1NEVGNlxuICBpZiAoIW1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU2NzBEXHU1MkExXHU1REYyXHU3OTgxXHU3NTI4XHVGRjBDXHU4RkQ0XHU1NkRFXHU3QTdBXHU0RTJEXHU5NUY0XHU0RUY2Jyk7XG4gICAgcmV0dXJuIChyZXEsIHJlcywgbmV4dCkgPT4gbmV4dCgpO1xuICB9XG4gIFxuICBjb25zb2xlLmxvZygnW01vY2tdIFx1NTIxQlx1NUVGQVx1NEUyRFx1OTVGNFx1NEVGNiwgXHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyJyk7XG4gIFxuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbW9ja01pZGRsZXdhcmUoXG4gICAgcmVxOiBDb25uZWN0LkluY29taW5nTWVzc2FnZSxcbiAgICByZXM6IFNlcnZlclJlc3BvbnNlLFxuICAgIG5leHQ6IENvbm5lY3QuTmV4dEZ1bmN0aW9uXG4gICkge1xuICAgIHRyeSB7XG4gICAgICAvLyBcdTg5RTNcdTY3OTBVUkxcbiAgICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgICBjb25zdCBwYXJzZWRVcmwgPSBwYXJzZSh1cmwsIHRydWUpO1xuICAgICAgY29uc3QgdXJsUGF0aCA9IHBhcnNlZFVybC5wYXRobmFtZSB8fCAnJztcbiAgICAgIGNvbnN0IHVybFF1ZXJ5ID0gcGFyc2VkVXJsLnF1ZXJ5IHx8IHt9O1xuICAgICAgXG4gICAgICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTU5MDRcdTc0MDZcdTZCNjRcdThCRjdcdTZDNDJcbiAgICAgIGlmICghc2hvdWxkTW9ja1JlcXVlc3QodXJsKSkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTY1MzZcdTUyMzBcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHt1cmxQYXRofWApO1xuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZDT1JTXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTZERkJcdTUyQTBDT1JTXHU1OTM0XG4gICAgICBoYW5kbGVDb3JzKHJlcyk7XG4gICAgICBcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1N0Y1MVx1N0VEQ1x1NUVGNlx1OEZERlxuICAgICAgaWYgKG1vY2tDb25maWcuZGVsYXkgPiAwKSB7XG4gICAgICAgIGF3YWl0IGRlbGF5KG1vY2tDb25maWcuZGVsYXkpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZcdTRFMERcdTU0MENcdTc2ODRBUElcdTdBRUZcdTcwQjlcbiAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XG4gICAgICBcbiAgICAgIC8vIFx1NjMwOVx1OTg3QVx1NUU4Rlx1NUMxRFx1OEJENVx1NEUwRFx1NTQwQ1x1NzY4NEFQSVx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gYXdhaXQgaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxLCByZXMsIHVybFBhdGgsIHVybFF1ZXJ5KTtcbiAgICAgIGlmICghaGFuZGxlZCkgaGFuZGxlZCA9IGhhbmRsZVF1ZXJpZXNBcGkocmVxLCByZXMsIHVybFBhdGgpO1xuICAgICAgXG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTZDQTFcdTY3MDlcdTU5MDRcdTc0MDZcdUZGMENcdThGRDRcdTU2REU0MDRcbiAgICAgIGlmICghaGFuZGxlZCkge1xuICAgICAgICBsb2dNb2NrKCdpbmZvJywgYFx1NjcyQVx1NUI5RVx1NzNCMFx1NzY4NEFQSVx1OERFRlx1NUY4NDogJHtyZXEubWV0aG9kfSAke3VybFBhdGh9YCk7XG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHsgXG4gICAgICAgICAgZXJyb3I6ICdcdTY3MkFcdTYyN0VcdTUyMzBBUElcdTdBRUZcdTcwQjknLFxuICAgICAgICAgIG1lc3NhZ2U6IGBBUElcdTdBRUZcdTcwQjkgJHt1cmxQYXRofSBcdTY3MkFcdTYyN0VcdTUyMzBcdTYyMTZcdTY3MkFcdTVCOUVcdTczQjBgLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dNb2NrKCdlcnJvcicsIGBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTUxRkFcdTk1MTk6YCwgZXJyb3IpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDUwMCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY3MERcdTUyQTFcdTU2NjhcdTUxODVcdTkwRThcdTk1MTlcdThCRUYnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcbiAqIFxuICogXHU2M0E3XHU1MjM2TW9ja1x1NjcwRFx1NTJBMVx1NzY4NFx1NTQyRlx1NzUyOC9cdTc5ODFcdTc1MjhcdTcyQjZcdTYwMDFcdTMwMDFcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkJcdTdCNDlcbiAqL1xuXG4vLyBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTYyMTZcdTUxNjhcdTVDNDBcdThCQkVcdTdGNkVcdTRFMkRcdTgzQjdcdTUzRDZcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG5leHBvcnQgZnVuY3Rpb24gaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIC8vIFx1NTcyOE5vZGUuanNcdTczQUZcdTU4ODNcdTRFMkRcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52KSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTcyOFx1NkQ0Rlx1ODlDOFx1NTY2OFx1NzNBRlx1NTg4M1x1NEUyRFxuICAgIGlmICh0eXBlb2YgaW1wb3J0Lm1ldGEgIT09ICd1bmRlZmluZWQnICYmIGltcG9ydC5tZXRhLmVudikge1xuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjhDMFx1NjdFNWxvY2FsU3RvcmFnZSAoXHU0RUM1XHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzKVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICBjb25zdCBsb2NhbFN0b3JhZ2VWYWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdVU0VfTU9DS19BUEknKTtcbiAgICAgIGlmIChsb2NhbFN0b3JhZ2VWYWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGxvY2FsU3RvcmFnZVZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU5RUQ4XHU4QkE0XHU2MEM1XHU1MUI1XHVGRjFBXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBCXHU1NDJGXHU3NTI4XHVGRjBDXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU3OTgxXHU3NTI4XG4gICAgY29uc3QgaXNEZXZlbG9wbWVudCA9IFxuICAgICAgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudiAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgfHxcbiAgICAgICh0eXBlb2YgaW1wb3J0Lm1ldGEgIT09ICd1bmRlZmluZWQnICYmIGltcG9ydC5tZXRhLmVudiAmJiBpbXBvcnQubWV0YS5lbnYuREVWID09PSB0cnVlKTtcbiAgICBcbiAgICByZXR1cm4gaXNEZXZlbG9wbWVudDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBcdTUxRkFcdTk1MTlcdTY1RjZcdTc2ODRcdTVCODlcdTUxNjhcdTU2REVcdTkwMDBcbiAgICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdTY4QzBcdTY3RTVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTUxRkFcdTk1MTlcdUZGMENcdTlFRDhcdThCQTRcdTc5ODFcdTc1MjhNb2NrXHU2NzBEXHU1MkExJywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBcdTU0MTFcdTU0MEVcdTUxN0NcdTVCQjlcdTY1RTdcdTRFRTNcdTc4MDFcdTc2ODRcdTUxRkRcdTY1NzBcbmV4cG9ydCBmdW5jdGlvbiBpc01vY2tFbmFibGVkKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNFbmFibGVkKCk7XG59XG5cbi8vIE1vY2tcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcbmV4cG9ydCBjb25zdCBtb2NrQ29uZmlnID0ge1xuICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIGVuYWJsZWQ6IGlzRW5hYmxlZCgpLFxuICBcbiAgLy8gXHU4QkY3XHU2QzQyXHU1RUY2XHU4RkRGXHVGRjA4XHU2QkVCXHU3OUQyXHVGRjA5XG4gIGRlbGF5OiAzMDAsXG4gIFxuICAvLyBBUElcdTU3RkFcdTc4NDBcdThERUZcdTVGODRcdUZGMENcdTc1MjhcdTRFOEVcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTk3MDBcdTg5ODFcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbiAgYXBpQmFzZVBhdGg6ICcvYXBpJyxcbiAgXG4gIC8vIFx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQjogJ25vbmUnLCAnZXJyb3InLCAnaW5mbycsICdkZWJ1ZydcbiAgbG9nTGV2ZWw6ICdkZWJ1ZycsXG4gIFxuICAvLyBcdTU0MkZcdTc1MjhcdTc2ODRcdTZBMjFcdTU3NTdcbiAgbW9kdWxlczoge1xuICAgIGRhdGFzb3VyY2VzOiB0cnVlLFxuICAgIHF1ZXJpZXM6IHRydWUsXG4gICAgdXNlcnM6IHRydWUsXG4gICAgdmlzdWFsaXphdGlvbnM6IHRydWVcbiAgfVxufTtcblxuLy8gXHU1MjI0XHU2NUFEXHU2NjJGXHU1NDI2XHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkTW9ja1JlcXVlc3QodXJsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgLy8gXHU1RkM1XHU5ODdCXHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICBpZiAoIW1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU1RkM1XHU5ODdCXHU2NjJGQVBJXHU4QkY3XHU2QzQyXG4gIGlmICghdXJsLnN0YXJ0c1dpdGgobW9ja0NvbmZpZy5hcGlCYXNlUGF0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFx1OERFRlx1NUY4NFx1NjhDMFx1NjdFNVx1OTAxQVx1OEZDN1x1RkYwQ1x1NUU5NFx1OEJFNVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gXHU4QkIwXHU1RjU1XHU2NUU1XHU1RkQ3XG5leHBvcnQgZnVuY3Rpb24gbG9nTW9jayhsZXZlbDogJ2Vycm9yJyB8ICdpbmZvJyB8ICdkZWJ1ZycsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gIGNvbnN0IHsgbG9nTGV2ZWwgfSA9IG1vY2tDb25maWc7XG4gIFxuICBpZiAobG9nTGV2ZWwgPT09ICdub25lJykgcmV0dXJuO1xuICBcbiAgaWYgKGxldmVsID09PSAnZXJyb3InICYmIFsnZXJyb3InLCAnaW5mbycsICdkZWJ1ZyddLmluY2x1ZGVzKGxvZ0xldmVsKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrIEVSUk9SXScsIC4uLmFyZ3MpO1xuICB9IGVsc2UgaWYgKGxldmVsID09PSAnaW5mbycgJiYgWydpbmZvJywgJ2RlYnVnJ10uaW5jbHVkZXMobG9nTGV2ZWwpKSB7XG4gICAgY29uc29sZS5pbmZvKCdbTW9jayBJTkZPXScsIC4uLmFyZ3MpO1xuICB9IGVsc2UgaWYgKGxldmVsID09PSAnZGVidWcnICYmIGxvZ0xldmVsID09PSAnZGVidWcnKSB7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrIERFQlVHXScsIC4uLmFyZ3MpO1xuICB9XG59XG5cbi8vIFx1NTIxRFx1NTlDQlx1NTMxNlx1NjVGNlx1OEY5M1x1NTFGQU1vY2tcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDFcbnRyeSB7XG4gIGNvbnNvbGUubG9nKGBbTW9ja10gXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxOiAke21vY2tDb25maWcuZW5hYmxlZCA/ICdcdTVERjJcdTU0MkZcdTc1MjgnIDogJ1x1NURGMlx1Nzk4MVx1NzUyOCd9YCk7XG4gIGlmIChtb2NrQ29uZmlnLmVuYWJsZWQpIHtcbiAgICBjb25zb2xlLmxvZyhgW01vY2tdIFx1OTE0RFx1N0Y2RTpgLCB7XG4gICAgICBkZWxheTogbW9ja0NvbmZpZy5kZWxheSxcbiAgICAgIGFwaUJhc2VQYXRoOiBtb2NrQ29uZmlnLmFwaUJhc2VQYXRoLFxuICAgICAgbG9nTGV2ZWw6IG1vY2tDb25maWcubG9nTGV2ZWwsXG4gICAgICBlbmFibGVkTW9kdWxlczogT2JqZWN0LmVudHJpZXMobW9ja0NvbmZpZy5tb2R1bGVzKVxuICAgICAgICAuZmlsdGVyKChbXywgZW5hYmxlZF0pID0+IGVuYWJsZWQpXG4gICAgICAgIC5tYXAoKFtuYW1lXSkgPT4gbmFtZSlcbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgY29uc29sZS53YXJuKCdbTW9ja10gXHU4RjkzXHU1MUZBXHU5MTREXHU3RjZFXHU0RkUxXHU2MDZGXHU1MUZBXHU5NTE5JywgZXJyb3IpO1xufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50c1wiOy8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjU3MFx1NjM2RVx1NkU5MFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1RkYwQ1x1NzUyOFx1NEU4RVx1NUYwMFx1NTNEMVx1NTQ4Q1x1NkQ0Qlx1OEJENVxuICovXG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1N0M3Qlx1NTc4QlxuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZVR5cGUgPSAnbXlzcWwnIHwgJ3Bvc3RncmVzcWwnIHwgJ29yYWNsZScgfCAnc3Fsc2VydmVyJyB8ICdzcWxpdGUnO1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTcyQjZcdTYwMDFcbmV4cG9ydCB0eXBlIERhdGFTb3VyY2VTdGF0dXMgPSAnYWN0aXZlJyB8ICdpbmFjdGl2ZScgfCAnZXJyb3InIHwgJ3BlbmRpbmcnO1xuXG4vLyBcdTU0MENcdTZCNjVcdTk4OTFcdTczODdcbmV4cG9ydCB0eXBlIFN5bmNGcmVxdWVuY3kgPSAnbWFudWFsJyB8ICdob3VybHknIHwgJ2RhaWx5JyB8ICd3ZWVrbHknIHwgJ21vbnRobHknO1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTYzQTVcdTUzRTNcbmV4cG9ydCBpbnRlcmZhY2UgRGF0YVNvdXJjZSB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHR5cGU6IERhdGFTb3VyY2VUeXBlO1xuICBob3N0Pzogc3RyaW5nO1xuICBwb3J0PzogbnVtYmVyO1xuICBkYXRhYmFzZU5hbWU/OiBzdHJpbmc7XG4gIHVzZXJuYW1lPzogc3RyaW5nO1xuICBwYXNzd29yZD86IHN0cmluZztcbiAgc3RhdHVzOiBEYXRhU291cmNlU3RhdHVzO1xuICBzeW5jRnJlcXVlbmN5PzogU3luY0ZyZXF1ZW5jeTtcbiAgbGFzdFN5bmNUaW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgY3JlYXRlZEF0OiBzdHJpbmc7XG4gIHVwZGF0ZWRBdDogc3RyaW5nO1xuICBpc0FjdGl2ZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuZXhwb3J0IGNvbnN0IG1vY2tEYXRhU291cmNlczogRGF0YVNvdXJjZVtdID0gW1xuICB7XG4gICAgaWQ6ICdkcy0xJyxcbiAgICBuYW1lOiAnTXlTUUxcdTc5M0FcdTRGOEJcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU3OTNBXHU0RjhCTXlTUUxcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdteXNxbCcsXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgcG9ydDogMzMwNixcbiAgICBkYXRhYmFzZU5hbWU6ICdleGFtcGxlX2RiJyxcbiAgICB1c2VybmFtZTogJ3VzZXInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0yJyxcbiAgICBuYW1lOiAnUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAncG9zdGdyZXNxbCcsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xMDAnLFxuICAgIHBvcnQ6IDU0MzIsXG4gICAgZGF0YWJhc2VOYW1lOiAncHJvZHVjdGlvbl9kYicsXG4gICAgdXNlcm5hbWU6ICdhZG1pbicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnaG91cmx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzNjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDc3NzYwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTMnLFxuICAgIG5hbWU6ICdTUUxpdGVcdTY3MkNcdTU3MzBcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU2NzJDXHU1NzMwU1FMaXRlXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnc3FsaXRlJyxcbiAgICBkYXRhYmFzZU5hbWU6ICcvcGF0aC90by9sb2NhbC5kYicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnbWFudWFsJyxcbiAgICBsYXN0U3luY1RpbWU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzNDU2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtNCcsXG4gICAgbmFtZTogJ1NRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwU1FMIFNlcnZlclx1NkQ0Qlx1OEJENVx1NzNBRlx1NTg4MycsXG4gICAgdHlwZTogJ3NxbHNlcnZlcicsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4yMDAnLFxuICAgIHBvcnQ6IDE0MzMsXG4gICAgZGF0YWJhc2VOYW1lOiAndGVzdF9kYicsXG4gICAgdXNlcm5hbWU6ICd0ZXN0ZXInLFxuICAgIHN0YXR1czogJ2luYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnd2Vla2x5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA2MDQ4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNTE4NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiBmYWxzZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy01JyxcbiAgICBuYW1lOiAnT3JhY2xlXHU0RjAxXHU0RTFBXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzME9yYWNsZVx1NEYwMVx1NEUxQVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ29yYWNsZScsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xNTAnLFxuICAgIHBvcnQ6IDE1MjEsXG4gICAgZGF0YWJhc2VOYW1lOiAnZW50ZXJwcmlzZV9kYicsXG4gICAgdXNlcm5hbWU6ICdzeXN0ZW0nLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTAzNjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9XG5dO1xuXG4vKipcbiAqIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGNvdW50IFx1NzUxRlx1NjIxMFx1NjU3MFx1OTFDRlxuICogQHJldHVybnMgXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU3RUM0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1vY2tEYXRhU291cmNlcyhjb3VudDogbnVtYmVyID0gNSk6IERhdGFTb3VyY2VbXSB7XG4gIGNvbnN0IHR5cGVzOiBEYXRhU291cmNlVHlwZVtdID0gWydteXNxbCcsICdwb3N0Z3Jlc3FsJywgJ29yYWNsZScsICdzcWxzZXJ2ZXInLCAnc3FsaXRlJ107XG4gIGNvbnN0IHN0YXR1c2VzOiBEYXRhU291cmNlU3RhdHVzW10gPSBbJ2FjdGl2ZScsICdpbmFjdGl2ZScsICdlcnJvcicsICdwZW5kaW5nJ107XG4gIGNvbnN0IHN5bmNGcmVxczogU3luY0ZyZXF1ZW5jeVtdID0gWydtYW51YWwnLCAnaG91cmx5JywgJ2RhaWx5JywgJ3dlZWtseScsICdtb250aGx5J107XG4gIFxuICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogY291bnQgfSwgKF8sIGkpID0+IHtcbiAgICBjb25zdCB0eXBlID0gdHlwZXNbaSAlIHR5cGVzLmxlbmd0aF07XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBkcy1nZW4tJHtpICsgMX1gLFxuICAgICAgbmFtZTogYFx1NzUxRlx1NjIxMFx1NzY4NCR7dHlwZX1cdTY1NzBcdTYzNkVcdTZFOTAgJHtpICsgMX1gLFxuICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTc2ODQke3R5cGV9XHU3QzdCXHU1NzhCXHU2NTcwXHU2MzZFXHU2RTkwICR7aSArIDF9YCxcbiAgICAgIHR5cGUsXG4gICAgICBob3N0OiB0eXBlICE9PSAnc3FsaXRlJyA/ICdsb2NhbGhvc3QnIDogdW5kZWZpbmVkLFxuICAgICAgcG9ydDogdHlwZSAhPT0gJ3NxbGl0ZScgPyAoMzMwNiArIGkpIDogdW5kZWZpbmVkLFxuICAgICAgZGF0YWJhc2VOYW1lOiB0eXBlID09PSAnc3FsaXRlJyA/IGAvcGF0aC90by9kYl8ke2l9LmRiYCA6IGBleGFtcGxlX2RiXyR7aX1gLFxuICAgICAgdXNlcm5hbWU6IHR5cGUgIT09ICdzcWxpdGUnID8gYHVzZXJfJHtpfWAgOiB1bmRlZmluZWQsXG4gICAgICBzdGF0dXM6IHN0YXR1c2VzW2kgJSBzdGF0dXNlcy5sZW5ndGhdLFxuICAgICAgc3luY0ZyZXF1ZW5jeTogc3luY0ZyZXFzW2kgJSBzeW5jRnJlcXMubGVuZ3RoXSxcbiAgICAgIGxhc3RTeW5jVGltZTogaSAlIDMgPT09IDAgPyBudWxsIDogbmV3IERhdGUobm93IC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShub3cgLSAoaSArIDEwKSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShub3cgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBpc0FjdGl2ZTogaSAlIDQgIT09IDBcbiAgICB9O1xuICB9KTtcbn1cblxuLy8gXHU1QkZDXHU1MUZBXHU5RUQ4XHU4QkE0XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG5leHBvcnQgZGVmYXVsdCBtb2NrRGF0YVNvdXJjZXM7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50c1wiOy8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwTW9ja1x1NjcwRFx1NTJBMVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY1NzBcdTYzNkVcdTZFOTBcdTc2RjhcdTUxNzNBUElcdTc2ODRcdTZBMjFcdTYyREZcdTVCOUVcdTczQjBcbiAqL1xuXG5pbXBvcnQgeyBtb2NrRGF0YVNvdXJjZXMgfSBmcm9tICcuLi9kYXRhL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlIH0gZnJvbSAnLi4vZGF0YS9kYXRhc291cmNlJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuXG4vLyBcdTRFMzRcdTY1RjZcdTVCNThcdTUwQThcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdUZGMENcdTUxNDFcdThCQjhcdTZBMjFcdTYyREZcdTU4OUVcdTUyMjBcdTY1MzlcdTY0Q0RcdTRGNUNcbmxldCBkYXRhU291cmNlcyA9IFsuLi5tb2NrRGF0YVNvdXJjZXNdO1xuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZURlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkZWxheSA9IHR5cGVvZiBtb2NrQ29uZmlnLmRlbGF5ID09PSAnbnVtYmVyJyA/IG1vY2tDb25maWcuZGVsYXkgOiAzMDA7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbn1cblxuLyoqXG4gKiBcdTkxQ0RcdTdGNkVcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTYzNkVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0RGF0YVNvdXJjZXMoKTogdm9pZCB7XG4gIGRhdGFTb3VyY2VzID0gWy4uLm1vY2tEYXRhU291cmNlc107XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKiBAcGFyYW0gcGFyYW1zIFx1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MFxuICogQHJldHVybnMgXHU1MjA2XHU5ODc1XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYXRhU291cmNlcyhwYXJhbXM/OiB7XG4gIHBhZ2U/OiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHR5cGU/OiBzdHJpbmc7XG4gIHN0YXR1cz86IHN0cmluZztcbn0pOiBQcm9taXNlPHtcbiAgaXRlbXM6IERhdGFTb3VyY2VbXTtcbiAgcGFnaW5hdGlvbjoge1xuICAgIHRvdGFsOiBudW1iZXI7XG4gICAgcGFnZTogbnVtYmVyO1xuICAgIHNpemU6IG51bWJlcjtcbiAgICB0b3RhbFBhZ2VzOiBudW1iZXI7XG4gIH07XG59PiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gIFxuICAvLyBcdTVFOTRcdTc1MjhcdThGQzdcdTZFRTRcbiAgbGV0IGZpbHRlcmVkSXRlbXMgPSBbLi4uZGF0YVNvdXJjZXNdO1xuICBcbiAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/Lm5hbWUpIHtcbiAgICBjb25zdCBrZXl3b3JkID0gcGFyYW1zLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gXG4gICAgICBkcy5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAoZHMuZGVzY3JpcHRpb24gJiYgZHMuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICApO1xuICB9XG4gIFxuICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8udHlwZSkge1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBkcy50eXBlID09PSBwYXJhbXMudHlwZSk7XG4gIH1cbiAgXG4gIC8vIFx1NjMwOVx1NzJCNlx1NjAwMVx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gZHMuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgfVxuICBcbiAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmlsdGVyZWRJdGVtcy5sZW5ndGgpO1xuICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gIFxuICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgcmV0dXJuIHtcbiAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdG90YWw6IGZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgcGFnZSxcbiAgICAgIHNpemUsXG4gICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmlsdGVyZWRJdGVtcy5sZW5ndGggLyBzaXplKVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICogQHJldHVybnMgXHU2NTcwXHU2MzZFXHU2RTkwXHU4QkU2XHU2MEM1XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYXRhU291cmNlKGlkOiBzdHJpbmcpOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjdFNVx1NjI3RVx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCBkYXRhU291cmNlID0gZGF0YVNvdXJjZXMuZmluZChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKCFkYXRhU291cmNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIHJldHVybiBkYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGRhdGEgXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU2MzZFXG4gKiBAcmV0dXJucyBcdTUyMUJcdTVFRkFcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZURhdGFTb3VyY2UoZGF0YTogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwSURcbiAgY29uc3QgbmV3SWQgPSBgZHMtJHtEYXRlLm5vdygpfWA7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgbmV3RGF0YVNvdXJjZTogRGF0YVNvdXJjZSA9IHtcbiAgICBpZDogbmV3SWQsXG4gICAgbmFtZTogZGF0YS5uYW1lIHx8ICdOZXcgRGF0YSBTb3VyY2UnLFxuICAgIGRlc2NyaXB0aW9uOiBkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgIHR5cGU6IGRhdGEudHlwZSB8fCAnbXlzcWwnLFxuICAgIGhvc3Q6IGRhdGEuaG9zdCxcbiAgICBwb3J0OiBkYXRhLnBvcnQsXG4gICAgZGF0YWJhc2VOYW1lOiBkYXRhLmRhdGFiYXNlTmFtZSxcbiAgICB1c2VybmFtZTogZGF0YS51c2VybmFtZSxcbiAgICBzdGF0dXM6IGRhdGEuc3RhdHVzIHx8ICdwZW5kaW5nJyxcbiAgICBzeW5jRnJlcXVlbmN5OiBkYXRhLnN5bmNGcmVxdWVuY3kgfHwgJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH07XG4gIFxuICAvLyBcdTZERkJcdTUyQTBcdTUyMzBcdTUyMTdcdTg4NjhcbiAgZGF0YVNvdXJjZXMucHVzaChuZXdEYXRhU291cmNlKTtcbiAgXG4gIHJldHVybiBuZXdEYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKiBAcGFyYW0gZGF0YSBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcbiAqIEByZXR1cm5zIFx1NjZGNFx1NjVCMFx1NTQwRVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlRGF0YVNvdXJjZShpZDogc3RyaW5nLCBkYXRhOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTYyN0VcdTUyMzBcdTg5ODFcdTY2RjRcdTY1QjBcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcdTdEMjJcdTVGMTVcbiAgY29uc3QgaW5kZXggPSBkYXRhU291cmNlcy5maW5kSW5kZXgoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IHVwZGF0ZWREYXRhU291cmNlOiBEYXRhU291cmNlID0ge1xuICAgIC4uLmRhdGFTb3VyY2VzW2luZGV4XSxcbiAgICAuLi5kYXRhLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gIH07XG4gIFxuICAvLyBcdTY2RkZcdTYzNjJcdTY1NzBcdTYzNkVcdTZFOTBcbiAgZGF0YVNvdXJjZXNbaW5kZXhdID0gdXBkYXRlZERhdGFTb3VyY2U7XG4gIFxuICByZXR1cm4gdXBkYXRlZERhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZURhdGFTb3VyY2UoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2MjdFXHU1MjMwXHU4OTgxXHU1MjIwXHU5NjY0XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXHU3RDIyXHU1RjE1XG4gIGNvbnN0IGluZGV4ID0gZGF0YVNvdXJjZXMuZmluZEluZGV4KGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBkYXRhU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIFx1NkQ0Qlx1OEJENVx1NjU3MFx1NjM2RVx1NkU5MFx1OEZERVx1NjNBNVxuICogQHBhcmFtIHBhcmFtcyBcdThGREVcdTYzQTVcdTUzQzJcdTY1NzBcbiAqIEByZXR1cm5zIFx1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1N0VEM1x1Njc5Q1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdENvbm5lY3Rpb24ocGFyYW1zOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTx7XG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIG1lc3NhZ2U/OiBzdHJpbmc7XG4gIGRldGFpbHM/OiBhbnk7XG59PiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTVCOUVcdTk2NDVcdTRGN0ZcdTc1MjhcdTY1RjZcdTUzRUZcdTgwRkRcdTRGMUFcdTY3MDlcdTY2RjRcdTU5MERcdTY3NDJcdTc2ODRcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTkwM0JcdThGOTFcbiAgLy8gXHU4RkQ5XHU5MUNDXHU3QjgwXHU1MzU1XHU2QTIxXHU2MkRGXHU2MjEwXHU1MjlGL1x1NTkzMVx1OEQyNVxuICBjb25zdCBzdWNjZXNzID0gTWF0aC5yYW5kb20oKSA+IDAuMjsgLy8gODAlXHU2MjEwXHU1MjlGXHU3Mzg3XG4gIFxuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3MsXG4gICAgbWVzc2FnZTogc3VjY2VzcyA/ICdcdThGREVcdTYzQTVcdTYyMTBcdTUyOUYnIDogJ1x1OEZERVx1NjNBNVx1NTkzMVx1OEQyNTogXHU2NUUwXHU2Q0Q1XHU4RkRFXHU2M0E1XHU1MjMwXHU2NTcwXHU2MzZFXHU1RTkzXHU2NzBEXHU1MkExXHU1NjY4JyxcbiAgICBkZXRhaWxzOiBzdWNjZXNzID8ge1xuICAgICAgcmVzcG9uc2VUaW1lOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCkgKyAxMCxcbiAgICAgIHZlcnNpb246ICc4LjAuMjgnLFxuICAgICAgY29ubmVjdGlvbklkOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkgKyAxMDAwXG4gICAgfSA6IHtcbiAgICAgIGVycm9yQ29kZTogJ0NPTk5FQ1RJT05fUkVGVVNFRCcsXG4gICAgICBlcnJvckRldGFpbHM6ICdcdTY1RTBcdTZDRDVcdTVFRkFcdTdBQ0JcdTUyMzBcdTY3MERcdTUyQTFcdTU2NjhcdTc2ODRcdThGREVcdTYzQTVcdUZGMENcdThCRjdcdTY4QzBcdTY3RTVcdTdGNTFcdTdFRENcdThCQkVcdTdGNkVcdTU0OENcdTUxRURcdTYzNkUnXG4gICAgfVxuICB9O1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTY3MERcdTUyQTFcbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0RGF0YVNvdXJjZXMsXG4gIGdldERhdGFTb3VyY2UsXG4gIGNyZWF0ZURhdGFTb3VyY2UsXG4gIHVwZGF0ZURhdGFTb3VyY2UsXG4gIGRlbGV0ZURhdGFTb3VyY2UsXG4gIHRlc3RDb25uZWN0aW9uLFxuICByZXNldERhdGFTb3VyY2VzXG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy91dGlscy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTAxQVx1NzUyOFx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTUyMUJcdTVFRkFcdTdFREZcdTRFMDBcdTY4M0NcdTVGMEZcdTU0Q0RcdTVFOTRcdTc2ODRcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbiAqL1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NkEyMVx1NjJERkFQSVx1NjIxMFx1NTI5Rlx1NTRDRFx1NUU5NFxuICogQHBhcmFtIGRhdGEgXHU1NENEXHU1RTk0XHU2NTcwXHU2MzZFXG4gKiBAcGFyYW0gc3VjY2VzcyBcdTYyMTBcdTUyOUZcdTcyQjZcdTYwMDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0F0cnVlXG4gKiBAcGFyYW0gbWVzc2FnZSBcdTUzRUZcdTkwMDlcdTZEODhcdTYwNkZcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NjgzQ1x1NUYwRlx1NzY4NEFQSVx1NTRDRFx1NUU5NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja1Jlc3BvbnNlPFQ+KFxuICBkYXRhOiBULCBcbiAgc3VjY2VzczogYm9vbGVhbiA9IHRydWUsIFxuICBtZXNzYWdlPzogc3RyaW5nXG4pIHtcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzLFxuICAgIGRhdGEsXG4gICAgbWVzc2FnZSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBtb2NrUmVzcG9uc2U6IHRydWUgLy8gXHU2ODA3XHU4QkIwXHU0RTNBXHU2QTIxXHU2MkRGXHU1NENEXHU1RTk0XG4gIH07XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2QTIxXHU2MkRGQVBJXHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKiBAcGFyYW0gbWVzc2FnZSBcdTk1MTlcdThCRUZcdTZEODhcdTYwNkZcbiAqIEBwYXJhbSBjb2RlIFx1OTUxOVx1OEJFRlx1NEVFM1x1NzgwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQSdNT0NLX0VSUk9SJ1xuICogQHBhcmFtIHN0YXR1cyBIVFRQXHU3MkI2XHU2MDAxXHU3ODAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBNTAwXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTY4M0NcdTVGMEZcdTc2ODRcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlKFxuICBtZXNzYWdlOiBzdHJpbmcsIFxuICBjb2RlOiBzdHJpbmcgPSAnTU9DS19FUlJPUicsIFxuICBzdGF0dXM6IG51bWJlciA9IDUwMFxuKSB7XG4gIHJldHVybiB7XG4gICAgc3VjY2VzczogZmFsc2UsXG4gICAgZXJyb3I6IHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBjb2RlLFxuICAgICAgc3RhdHVzQ29kZTogc3RhdHVzXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBtb2NrUmVzcG9uc2U6IHRydWVcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTUyMDZcdTk4NzVcdTU0Q0RcdTVFOTRcdTdFRDNcdTY3ODRcbiAqIEBwYXJhbSBpdGVtcyBcdTVGNTNcdTUyNERcdTk4NzVcdTc2ODRcdTk4NzlcdTc2RUVcdTUyMTdcdTg4NjhcbiAqIEBwYXJhbSB0b3RhbEl0ZW1zIFx1NjAzQlx1OTg3OVx1NzZFRVx1NjU3MFxuICogQHBhcmFtIHBhZ2UgXHU1RjUzXHU1MjREXHU5ODc1XHU3ODAxXG4gKiBAcGFyYW0gc2l6ZSBcdTZCQ0ZcdTk4NzVcdTU5MjdcdTVDMEZcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NFx1N0VEM1x1Njc4NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlPFQ+KFxuICBpdGVtczogVFtdLFxuICB0b3RhbEl0ZW1zOiBudW1iZXIsXG4gIHBhZ2U6IG51bWJlciA9IDEsXG4gIHNpemU6IG51bWJlciA9IDEwXG4pIHtcbiAgcmV0dXJuIGNyZWF0ZU1vY2tSZXNwb25zZSh7XG4gICAgaXRlbXMsXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdG90YWw6IHRvdGFsSXRlbXMsXG4gICAgICBwYWdlLFxuICAgICAgc2l6ZSxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCh0b3RhbEl0ZW1zIC8gc2l6ZSksXG4gICAgICBoYXNNb3JlOiBwYWdlICogc2l6ZSA8IHRvdGFsSXRlbXNcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFx1NUVGNlx1OEZERlxuICogQHBhcmFtIG1zIFx1NUVGNlx1OEZERlx1NkJFQlx1NzlEMlx1NjU3MFx1RkYwQ1x1OUVEOFx1OEJBNDMwMG1zXG4gKiBAcmV0dXJucyBQcm9taXNlXHU1QkY5XHU4QzYxXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxheShtczogbnVtYmVyID0gMzAwKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjcmVhdGVNb2NrUmVzcG9uc2UsXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5XG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTZDNlx1NEUyRFx1NUJGQ1x1NTFGQVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRBUEkgTW9ja1x1NjcwRFx1NTJBMVx1NTE2NVx1NTNFM1x1NzBCOVxuICovXG5cbi8vIFx1NUJGQ1x1NTE2NVx1NjU3MFx1NjM2RVx1NkU5MFx1NjcwRFx1NTJBMVxuaW1wb3J0IGRhdGFTb3VyY2UgZnJvbSAnLi9kYXRhc291cmNlJztcblxuLy8gXHU1QkZDXHU1MTY1XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG5pbXBvcnQgeyBcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLCBcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsIFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5IFxufSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFNb2NrXG4gKi9cbmNvbnN0IHF1ZXJ5ID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyaWVzKHBhcmFtczogeyBwYWdlOiBudW1iZXI7IHNpemU6IG51bWJlcjsgfSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSh7XG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGlkOiAncTEnLCBuYW1lOiAnXHU3NTI4XHU2MjM3XHU1MjA2XHU2NzkwXHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTU3MzBcdTUzM0FcdTdFREZcdThCQTFcdTc1MjhcdTYyMzdcdTZDRThcdTUxOENcdTY1NzBcdTYzNkUnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTInLCBuYW1lOiAnXHU5NTAwXHU1NTJFXHU0RTFBXHU3RUU5XHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTY3MDhcdTdFREZcdThCQTFcdTk1MDBcdTU1MkVcdTk4OUQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTMnLCBuYW1lOiAnXHU1RTkzXHU1QjU4XHU1MjA2XHU2NzkwJywgZGVzY3JpcHRpb246ICdcdTc2RDFcdTYzQTdcdTVFOTNcdTVCNThcdTZDMzRcdTVFNzMnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgXSxcbiAgICAgIHRvdGFsOiAzLFxuICAgICAgcGFnZTogcGFyYW1zLnBhZ2UsXG4gICAgICBzaXplOiBwYXJhbXMuc2l6ZVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5KGlkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6ICdcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgc3FsOiAnU0VMRUNUICogRlJPTSB1c2VycyBXSEVSRSBzdGF0dXMgPSAkMScsXG4gICAgICBwYXJhbWV0ZXJzOiBbJ2FjdGl2ZSddLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnkoZGF0YTogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBxdWVyeS0ke0RhdGUubm93KCl9YCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyB1cGRhdGVRdWVyeShpZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlUXVlcnkoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnM6IFsnaWQnLCAnbmFtZScsICdlbWFpbCcsICdzdGF0dXMnXSxcbiAgICAgIHJvd3M6IFtcbiAgICAgICAgeyBpZDogMSwgbmFtZTogJ1x1NUYyMFx1NEUwOScsIGVtYWlsOiAnemhhbmdAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIG5hbWU6ICdcdTY3NEVcdTU2REInLCBlbWFpbDogJ2xpQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICAgICAgICB7IGlkOiAzLCBuYW1lOiAnXHU3MzhCXHU0RTk0JywgZW1haWw6ICd3YW5nQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnaW5hY3RpdmUnIH0sXG4gICAgICBdLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgZXhlY3V0aW9uVGltZTogMC4yMzUsXG4gICAgICAgIHJvd0NvdW50OiAzLFxuICAgICAgICB0b3RhbFBhZ2VzOiAxXG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcblxuLyoqXG4gKiBcdTVCRkNcdTUxRkFcdTYyNDBcdTY3MDlcdTY3MERcdTUyQTFcbiAqL1xuY29uc3Qgc2VydmljZXMgPSB7XG4gIGRhdGFTb3VyY2UsXG4gIHF1ZXJ5XG59O1xuXG4vLyBcdTVCRkNcdTUxRkFtb2NrIHNlcnZpY2VcdTVERTVcdTUxNzdcbmV4cG9ydCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NTQwNFx1NEUyQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGNvbnN0IGRhdGFTb3VyY2VTZXJ2aWNlID0gc2VydmljZXMuZGF0YVNvdXJjZTtcbmV4cG9ydCBjb25zdCBxdWVyeVNlcnZpY2UgPSBzZXJ2aWNlcy5xdWVyeTtcblxuLy8gXHU5RUQ4XHU4QkE0XHU1QkZDXHU1MUZBXHU2MjQwXHU2NzA5XHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCBzZXJ2aWNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZS50c1wiO2ltcG9ydCB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCAqIGFzIGh0dHAgZnJvbSAnaHR0cCc7XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU0RTAwXHU0RTJBXHU3QjgwXHU1MzU1XHU3Njg0XHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XG4gKiBcdTUzRUFcdTU5MDRcdTc0MDYvYXBpL3Rlc3RcdThERUZcdTVGODRcdUZGMENcdTc1MjhcdTRFOEVcdTZENEJcdThCRDVNb2NrXHU3Q0ZCXHU3RURGXHU2NjJGXHU1NDI2XHU2QjYzXHU1RTM4XHU1REU1XHU0RjVDXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlKCkge1xuICBjb25zb2xlLmxvZygnW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1REYyXHU1MjFCXHU1RUZBXHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU1QzA2XHU1OTA0XHU3NDA2L2FwaS90ZXN0XHU4REVGXHU1Rjg0XHU3Njg0XHU4QkY3XHU2QzQyJyk7XG4gIFxuICByZXR1cm4gZnVuY3Rpb24gc2ltcGxlTWlkZGxld2FyZShcbiAgICByZXE6IGh0dHAuSW5jb21pbmdNZXNzYWdlLFxuICAgIHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSxcbiAgICBuZXh0OiBDb25uZWN0Lk5leHRGdW5jdGlvblxuICApIHtcbiAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2QgfHwgJ1VOS05PV04nO1xuICAgIFxuICAgIC8vIFx1NTNFQVx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFxuICAgIGlmICh1cmwgPT09ICcvYXBpL3Rlc3QnKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU2NTM2XHU1MjMwXHU2RDRCXHU4QkQ1XHU4QkY3XHU2QzQyOiAke21ldGhvZH0gJHt1cmx9YCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFx1OEJCRVx1N0Y2RUNPUlNcdTU5MzRcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uJyk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmIChtZXRob2QgPT09ICdPUFRJT05TJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyJyk7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU3ODZFXHU0RkREXHU4OTg2XHU3NkQ2XHU2Mzg5XHU2MjQwXHU2NzA5XHU1REYyXHU2NzA5XHU3Njg0Q29udGVudC1UeXBlXHVGRjBDXHU5MDdGXHU1MTREXHU4OEFCXHU1NDBFXHU3RUVEXHU0RTJEXHU5NUY0XHU0RUY2XHU2NkY0XHU2NTM5XG4gICAgICAgIHJlcy5yZW1vdmVIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTFDNlx1NTkwN1x1NTRDRFx1NUU5NFx1NjU3MFx1NjM2RVxuICAgICAgICBjb25zdCByZXNwb25zZURhdGEgPSB7XG4gICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiAnXHU3QjgwXHU1MzU1XHU2RDRCXHU4QkQ1XHU0RTJEXHU5NUY0XHU0RUY2XHU1NENEXHU1RTk0XHU2MjEwXHU1MjlGJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMsXG4gICAgICAgICAgICBwYXJhbXM6IHVybC5pbmNsdWRlcygnPycpID8gdXJsLnNwbGl0KCc/JylbMV0gOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1M0QxXHU5MDAxXHU1NENEXHU1RTk0XHU1MjREXHU3ODZFXHU0RkREXHU0RTJEXHU2NUFEXHU4QkY3XHU2QzQyXHU5NEZFXG4gICAgICAgIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTUzRDFcdTkwMDFcdTZENEJcdThCRDVcdTU0Q0RcdTVFOTQnKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwb25zZURhdGEsIG51bGwsIDIpKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NEUwRFx1OEMwM1x1NzUyOG5leHQoKVx1RkYwQ1x1Nzg2RVx1NEZERFx1OEJGN1x1NkM0Mlx1NTIzMFx1NkI2NFx1N0VEM1x1Njc1RlxuICAgICAgICByZXR1cm47XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTk1MTlcdThCRUZcbiAgICAgICAgY29uc29sZS5lcnJvcignW1x1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNl0gXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU2NUY2XHU1MUZBXHU5NTE5OicsIGVycm9yKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1OTFDRFx1ODk4MVx1RkYwMVx1NkUwNVx1OTY2NFx1NURGMlx1NjcwOVx1NzY4NFx1NTkzNFx1RkYwQ1x1OTA3Rlx1NTE0RENvbnRlbnQtVHlwZVx1ODhBQlx1NjZGNFx1NjUzOVxuICAgICAgICByZXMucmVtb3ZlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTY1RjZcdTUxRkFcdTk1MTknLFxuICAgICAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcilcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU0RTBEXHU4QzAzXHU3NTI4bmV4dCgpXHVGRjBDXHU3ODZFXHU0RkREXHU4QkY3XHU2QzQyXHU1MjMwXHU2QjY0XHU3RUQzXHU2NzVGXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU0RTBEXHU1OTA0XHU3NDA2XHU3Njg0XHU4QkY3XHU2QzQyXHU0RUE0XHU3RUQ5XHU0RTBCXHU0RTAwXHU0RTJBXHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgbmV4dCgpO1xuICB9O1xufSAiXSwKICAibWFwcGluZ3MiOiAiO0FBQTBZLFNBQVMsY0FBYyxlQUFnQztBQUNqYyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZ0JBQWdCO0FBQ3pCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCOzs7QUNJekIsU0FBUyxhQUFhOzs7QUNGZixTQUFTLFlBQXFCO0FBQ25DLE1BQUk7QUFFRixRQUFJLE9BQU8sWUFBWSxlQUFlLFFBQVEsS0FBSztBQUNqRCxVQUFJLFFBQVEsSUFBSSxzQkFBc0IsUUFBUTtBQUM1QyxlQUFPO0FBQUEsTUFDVDtBQUNBLFVBQUksUUFBUSxJQUFJLHNCQUFzQixTQUFTO0FBQzdDLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFFBQUksT0FBTyxnQkFBZ0IsZUFBZSxZQUFZLEtBQUs7QUFDekQsVUFBSSxZQUFZLElBQUksc0JBQXNCLFFBQVE7QUFDaEQsZUFBTztBQUFBLE1BQ1Q7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
