// vite.config.ts
import { defineConfig, loadEnv } from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { execSync } from "child_process";
import tailwindcss from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/autoprefixer/lib/autoprefixer.js";

// src/mock/config.ts
var isEnabled = () => {
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
var mockConfig = {
  // 是否启用模拟服务（唯一开关）
  enabled: isEnabled(),
  // 请求延迟配置（毫秒）
  delay: {
    min: 100,
    max: 300
  },
  // 请求处理配置
  api: {
    // 基础URL
    baseUrl: "http://localhost:8080/api",
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
console.info("[Mock\u914D\u7F6E] Mock\u670D\u52A1\u72B6\u6001:", mockConfig.enabled ? "\u5DF2\u542F\u7528" : "\u5DF2\u7981\u7528");
console.info("[Mock\u914D\u7F6E] API\u57FA\u7840URL:", mockConfig.api.baseUrl);
console.info("[Mock\u914D\u7F6E] \u65E5\u5FD7\u7EA7\u522B:", mockConfig.logLevel);

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
  const delay2 = typeof mockConfig.delay === "number" ? mockConfig.delay : 300;
  return new Promise((resolve) => setTimeout(resolve, delay2));
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
var services_default = services;

// src/mock/middleware/index.ts
function createMockMiddleware() {
  return async function mockMiddleware(req, res, next) {
    var _a;
    if (!isMockEnabled()) {
      return next();
    }
    const url = req.url || "";
    if (!url.startsWith("/api/")) {
      return next();
    }
    logMock("info", `[Mock] \u62E6\u622AAPI\u8BF7\u6C42: ${req.method} ${url}`);
    try {
      if (req.method === "OPTIONS") {
        handleOptionsRequest(res);
        return;
      }
      const reqBody = await parseRequestBody(req);
      logMock("debug", `[Mock] \u8BF7\u6C42\u4F53:`, reqBody);
      const path2 = url;
      const method = ((_a = req.method) == null ? void 0 : _a.toUpperCase()) || "GET";
      await addDelay();
      switch (true) {
        case path2.includes("/api/datasources"):
          await handleDataSourceRequest(path2, method, reqBody, res);
          break;
        case path2.includes("/api/queries"):
          await handleQueryRequest(path2, method, reqBody, res);
          break;
        default:
          logMock("warn", `[Mock] \u672A\u5339\u914D\u7684API: ${method} ${path2}`);
          sendJson(res, 200, createMockResponse({
            message: `Mock response for ${method} ${path2}`,
            path: path2,
            method,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }));
      }
    } catch (error) {
      logMock("error", `[Mock] \u5904\u7406\u8BF7\u6C42\u51FA\u9519:`, error);
      handleError(res, error);
    }
  };
}
async function handleDataSourceRequest(path2, method, body, res) {
  try {
    logMock("info", `[Mock] \u5904\u7406\u6570\u636E\u6E90\u8BF7\u6C42: ${method} ${path2}`);
    const singleMatch = path2.match(/\/api\/datasources\/([^\/]+)$/);
    if (singleMatch && method === "GET") {
      const id = singleMatch[1];
      logMock("debug", `[Mock] \u83B7\u53D6\u6570\u636E\u6E90: ${id}`);
      const response = await services_default.dataSource.getDataSource(id);
      sendJson(res, 200, createMockResponse(response));
      return;
    }
    if (path2.match(/\/api\/datasources\/?$/) && method === "GET") {
      logMock("debug", `[Mock] \u83B7\u53D6\u6570\u636E\u6E90\u5217\u8868`);
      const urlObj = new URL(`http://localhost${path2}`);
      const page = parseInt(urlObj.searchParams.get("page") || "1", 10);
      const size = parseInt(urlObj.searchParams.get("size") || "10", 10);
      const name = urlObj.searchParams.get("name") || void 0;
      const type = urlObj.searchParams.get("type") || void 0;
      const status = urlObj.searchParams.get("status") || void 0;
      const params = {
        page,
        size,
        name,
        type,
        status
      };
      logMock("debug", `[Mock] \u6570\u636E\u6E90\u67E5\u8BE2\u53C2\u6570:`, params);
      const response = await services_default.dataSource.getDataSources(params);
      sendJson(res, 200, createMockResponse(response));
      return;
    }
    if (path2.match(/\/api\/datasources\/?$/) && method === "POST") {
      logMock("debug", `[Mock] \u521B\u5EFA\u6570\u636E\u6E90:`, body);
      const response = await services_default.dataSource.createDataSource(body);
      sendJson(res, 201, createMockResponse(response));
      return;
    }
    const updateMatch = path2.match(/\/api\/datasources\/([^\/]+)$/);
    if (updateMatch && method === "PUT") {
      const id = updateMatch[1];
      logMock("debug", `[Mock] \u66F4\u65B0\u6570\u636E\u6E90: ${id}`, body);
      const response = await services_default.dataSource.updateDataSource(id, body);
      sendJson(res, 200, createMockResponse(response));
      return;
    }
    const deleteMatch = path2.match(/\/api\/datasources\/([^\/]+)$/);
    if (deleteMatch && method === "DELETE") {
      const id = deleteMatch[1];
      logMock("debug", `[Mock] \u5220\u9664\u6570\u636E\u6E90: ${id}`);
      await services_default.dataSource.deleteDataSource(id);
      sendJson(res, 200, createMockResponse({ success: true, id }));
      return;
    }
    logMock("warn", `[Mock] \u672A\u77E5\u7684\u6570\u636E\u6E90API: ${method} ${path2}`);
    sendJson(res, 404, createMockErrorResponse("Not Found", "RESOURCE_NOT_FOUND", 404));
  } catch (error) {
    logMock("error", `[Mock] \u6570\u636E\u6E90\u8BF7\u6C42\u5904\u7406\u9519\u8BEF:`, error);
    handleError(res, error);
  }
}
async function handleQueryRequest(path2, method, body, res) {
  try {
    logMock("info", `[Mock] \u5904\u7406\u67E5\u8BE2\u8BF7\u6C42: ${method} ${path2}`);
    const singleMatch = path2.match(/\/api\/queries\/([^\/]+)$/);
    if (singleMatch && method === "GET") {
      const id = singleMatch[1];
      logMock("debug", `[Mock] \u83B7\u53D6\u67E5\u8BE2: ${id}`);
      const response = await services_default.query.getQuery(id);
      sendJson(res, 200, createMockResponse(response));
      return;
    }
    if (path2.match(/\/api\/queries\/?$/) && method === "GET") {
      logMock("debug", `[Mock] \u83B7\u53D6\u67E5\u8BE2\u5217\u8868`);
      const urlObj = new URL(`http://localhost${path2}`);
      const page = parseInt(urlObj.searchParams.get("page") || "1", 10);
      const size = parseInt(urlObj.searchParams.get("size") || "10", 10);
      const params = { page, size };
      const response = await services_default.query.getQueries(params);
      sendJson(res, 200, createMockResponse(response));
      return;
    }
    if (path2.match(/\/api\/queries\/?$/) && method === "POST") {
      logMock("debug", `[Mock] \u521B\u5EFA\u67E5\u8BE2:`, body);
      const response = await services_default.query.createQuery(body);
      sendJson(res, 201, createMockResponse(response));
      return;
    }
    const updateMatch = path2.match(/\/api\/queries\/([^\/]+)$/);
    if (updateMatch && method === "PUT") {
      const id = updateMatch[1];
      logMock("debug", `[Mock] \u66F4\u65B0\u67E5\u8BE2: ${id}`, body);
      const response = await services_default.query.updateQuery(id, body);
      sendJson(res, 200, createMockResponse(response));
      return;
    }
    const deleteMatch = path2.match(/\/api\/queries\/([^\/]+)$/);
    if (deleteMatch && method === "DELETE") {
      const id = deleteMatch[1];
      logMock("debug", `[Mock] \u5220\u9664\u67E5\u8BE2: ${id}`);
      await services_default.query.deleteQuery(id);
      sendJson(res, 200, createMockResponse({ success: true, id }));
      return;
    }
    const executeMatch = path2.match(/\/api\/queries\/([^\/]+)\/execute$/);
    if (executeMatch && method === "POST") {
      const id = executeMatch[1];
      logMock("debug", `[Mock] \u6267\u884C\u67E5\u8BE2: ${id}`, body);
      const response = await services_default.query.executeQuery(id, body);
      sendJson(res, 200, createMockResponse(response));
      return;
    }
    logMock("warn", `[Mock] \u672A\u77E5\u7684\u67E5\u8BE2API: ${method} ${path2}`);
    sendJson(res, 404, createMockErrorResponse("Not Found", "RESOURCE_NOT_FOUND", 404));
  } catch (error) {
    logMock("error", `[Mock] \u67E5\u8BE2\u8BF7\u6C42\u5904\u7406\u9519\u8BEF:`, error);
    handleError(res, error);
  }
}
async function parseRequestBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0)
        return resolve({});
      try {
        const bodyStr = Buffer.concat(chunks).toString();
        const body = bodyStr && bodyStr.trim() ? JSON.parse(bodyStr) : {};
        return resolve(body);
      } catch (error) {
        logMock("warn", `[Mock] \u8BF7\u6C42\u4F53\u89E3\u6790\u5931\u8D25:`, error);
        return resolve({});
      }
    });
  });
}
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Mock-Enabled");
  res.setHeader("X-Powered-By", "DataScope-Mock");
  if (typeof data === "object" && data !== null) {
    data.mockResponse = true;
  }
  const responseData = JSON.stringify(data);
  res.end(responseData);
  logMock("debug", `[Mock] \u53D1\u9001\u54CD\u5E94: [${statusCode}] ${responseData.slice(0, 200)}${responseData.length > 200 ? "..." : ""}`);
}
function handleError(res, error, statusCode = 500) {
  const message = error instanceof Error ? error.message : String(error);
  const code = error.code || "INTERNAL_ERROR";
  logMock("error", `[Mock] \u9519\u8BEF\u54CD\u5E94: ${statusCode} ${code} ${message}`);
  const errorResponse = createMockErrorResponse(message, code, statusCode);
  sendJson(res, statusCode, errorResponse);
}
function handleOptionsRequest(res) {
  res.statusCode = 204;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Mock-Enabled");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.end();
  logMock("debug", `[Mock] \u5904\u7406OPTIONS\u9884\u68C0\u8BF7\u6C42`);
}
async function addDelay() {
  const { delay: delay2 } = mockConfig;
  let delayMs = 0;
  if (typeof delay2 === "number" && delay2 > 0) {
    delayMs = delay2;
    logMock("debug", `[Mock] \u6DFB\u52A0\u56FA\u5B9A\u5EF6\u8FDF: ${delayMs}ms`);
  } else if (delay2 && typeof delay2 === "object") {
    const { min, max } = delay2;
    delayMs = Math.floor(Math.random() * (max - min + 1)) + min;
    logMock("debug", `[Mock] \u6DFB\u52A0\u968F\u673A\u5EF6\u8FDF: ${delayMs}ms (\u8303\u56F4: ${min}-${max}ms)`);
  }
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

// vite.config.ts
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
killPort(8080);
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const useMockApi = env.VITE_USE_MOCK_API === "true";
  const disableHmr = env.VITE_DISABLE_HMR === "true";
  console.log(`[Vite\u914D\u7F6E] \u8FD0\u884C\u6A21\u5F0F: ${mode}`);
  console.log(`[Vite\u914D\u7F6E] Mock API: ${useMockApi ? "\u542F\u7528" : "\u7981\u7528"}`);
  console.log(`[Vite\u914D\u7F6E] HMR: ${disableHmr ? "\u7981\u7528" : "\u542F\u7528"}`);
  return {
    plugins: [
      vue()
    ],
    server: {
      port: 8080,
      strictPort: true,
      host: "localhost",
      open: false,
      // 配置HMR
      hmr: disableHmr ? false : true,
      // 配置代理
      proxy: {
        // 将API请求转发到后端服务
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false
        }
      },
      // 配置中间件
      middlewareMode: false,
      // 使用Mock中间件拦截API请求
      configureServer: useMockApi ? (server) => {
        console.log("[Vite\u914D\u7F6E] \u6DFB\u52A0Mock\u4E2D\u95F4\u4EF6");
        server.middlewares.use(createMockMiddleware());
      } : void 0,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
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
    optimizeDeps: {
      exclude: ["fsevents"]
    },
    build: {
      emptyOutDir: true,
      target: "es2015",
      sourcemap: true,
      // 清除console和debugger
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    cacheDir: "node_modules/.vite_cache"
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svY29uZmlnLnRzIiwgInNyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzIiwgInNyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuXG4vLyBcdTVGM0FcdTUyMzZcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTNcdTUxRkRcdTY1NzBcbmZ1bmN0aW9uIGtpbGxQb3J0KHBvcnQ6IG51bWJlcikge1xuICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjhDMFx1NjdFNVx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NTM2MFx1NzUyOFx1NjBDNVx1NTFCNWApO1xuICB0cnkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBleGVjU3luYyhgbmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fWApO1xuICAgICAgZXhlY1N5bmMoYHRhc2traWxsIC9GIC9waWQgJChuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9IHwgYXdrICd7cHJpbnQgJDV9JylgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4ZWNTeW5jKGBsc29mIC1pIDoke3BvcnR9IC10IHwgeGFyZ3Mga2lsbCAtOWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTMgJHtwb3J0fWApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTY3MkFcdTg4QUJcdTUzNjBcdTc1MjhcdTYyMTZcdTY1RTBcdTZDRDVcdTkxQ0FcdTY1M0VgKTtcbiAgfVxufVxuXG4vLyBcdTVDMURcdThCRDVcdTkxQ0FcdTY1M0VcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTdBRUZcdTUzRTNcbmtpbGxQb3J0KDgwODApO1xuXG4vLyBcdTU3RkFcdTY3MkNcdTkxNERcdTdGNkVcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHU1MkEwXHU4RjdEXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9jayBBUElcbiAgY29uc3QgdXNlTW9ja0FwaSA9IGVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU3OTgxXHU3NTI4SE1SXG4gIGNvbnN0IGRpc2FibGVIbXIgPSBlbnYuVklURV9ESVNBQkxFX0hNUiA9PT0gJ3RydWUnO1xuICBcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdThGRDBcdTg4NENcdTZBMjFcdTVGMEY6ICR7bW9kZX1gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBNb2NrIEFQSTogJHt1c2VNb2NrQXBpID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgIF0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICAvLyBcdTkxNERcdTdGNkVITVJcbiAgICAgIGhtcjogZGlzYWJsZUhtciA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1NEVFM1x1NzQwNlxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gXHU1QzA2QVBJXHU4QkY3XHU2QzQyXHU4RjZDXHU1M0QxXHU1MjMwXHU1NDBFXHU3QUVGXHU2NzBEXHU1MkExXG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gXHU5MTREXHU3RjZFXHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgICBtaWRkbGV3YXJlTW9kZTogZmFsc2UsXG4gICAgICAvLyBcdTRGN0ZcdTc1MjhNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyXG4gICAgICBjb25maWd1cmVTZXJ2ZXI6IHVzZU1vY2tBcGkgXG4gICAgICAgID8gKHNlcnZlcikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWaXRlXHU5MTREXHU3RjZFXSBcdTZERkJcdTUyQTBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2Jyk7XG4gICAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCkpO1xuICAgICAgICAgIH0gXG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZSwgbm8tc3RvcmUsIG11c3QtcmV2YWxpZGF0ZScsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIGxlc3M6IHtcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZXhjbHVkZTogWydmc2V2ZW50cyddLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIC8vIFx1NkUwNVx1OTY2NGNvbnNvbGVcdTU0OENkZWJ1Z2dlclxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjYWNoZURpcjogJ25vZGVfbW9kdWxlcy8udml0ZV9jYWNoZScsXG4gIH1cbn0pIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiOy8qKlxuICogXHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXG4gKiBcdTk2QzZcdTRFMkRcdTdCQTFcdTc0MDZcdTYyNDBcdTY3MDlcdTZBMjFcdTYyREZcdTY3MERcdTUyQTFcdTc2RjhcdTUxNzNcdTc2ODRcdTkxNERcdTdGNkVcdUZGMENcdTRGNUNcdTRFM0FcdTUzNTVcdTRFMDBcdTc3MUZcdTc2RjhcdTY3NjVcdTZFOTBcbiAqL1xuXG4vLyBcdTY4QzBcdTY3RTVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTU0OENcdTUxNjhcdTVDNDBcdThCQkVcdTdGNkVcbmNvbnN0IGlzRW5hYmxlZCA9ICgpID0+IHtcbiAgLy8gXHU2OEMwXHU2N0U1XHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHVGRjA4XHU4RkQwXHU4ODRDXHU2NUY2XHVGRjA5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgaWYgKCh3aW5kb3cgYXMgYW55KS5fX1VTRV9NT0NLX0FQSSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLl9fQVBJX01PQ0tfRElTQUJMRUQgPT09IHRydWUpIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU2OEMwXHU2N0U1XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHVGRjA4XHU3RjE2XHU4QkQxXHU2NUY2XHVGRjA5XG4gIC8vIFx1NTk4Mlx1Njc5Q1x1NjYwRVx1Nzg2RVx1OEJCRVx1N0Y2RVx1NEUzQWZhbHNlXHVGRjBDXHU1MjE5XHU3OTgxXHU3NTI4XG4gIGlmIChpbXBvcnQubWV0YT8uZW52Py5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gXCJmYWxzZVwiKSByZXR1cm4gZmFsc2U7XG4gIFxuICAvLyBcdTU5ODJcdTY3OUNcdTY2MEVcdTc4NkVcdThCQkVcdTdGNkVcdTRFM0F0cnVlXHVGRjBDXHU1MjE5XHU1NDJGXHU3NTI4XG4gIGlmIChpbXBvcnQubWV0YT8uZW52Py5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gXCJ0cnVlXCIpIHJldHVybiB0cnVlO1xuICBcbiAgLy8gXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBCXHU5RUQ4XHU4QkE0XHU1NDJGXHU3NTI4XHVGRjBDXHU1MTc2XHU0RUQ2XHU3M0FGXHU1ODgzXHU5RUQ4XHU4QkE0XHU3OTgxXHU3NTI4XG4gIGNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBpbXBvcnQubWV0YT8uZW52Py5NT0RFID09PSBcImRldmVsb3BtZW50XCI7XG4gIFxuICAvLyBcdTVGM0FcdTUyMzZcdTVGMDBcdTU0MkZNb2NrXHU2NzBEXHU1MkExXHU3NTI4XHU0RThFXHU2RDRCXHU4QkQ1XG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gXHU1QjlBXHU0RTQ5XHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCXHU3QzdCXHU1NzhCXG5leHBvcnQgdHlwZSBMb2dMZXZlbCA9ICdub25lJyB8ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbycgfCAnZGVidWcnO1xuXG5leHBvcnQgY29uc3QgbW9ja0NvbmZpZyA9IHtcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHVGRjA4XHU1NTJGXHU0RTAwXHU1RjAwXHU1MTczXHVGRjA5XG4gIGVuYWJsZWQ6IGlzRW5hYmxlZCgpLFxuICBcbiAgLy8gXHU4QkY3XHU2QzQyXHU1RUY2XHU4RkRGXHU5MTREXHU3RjZFXHVGRjA4XHU2QkVCXHU3OUQyXHVGRjA5XG4gIGRlbGF5OiB7XG4gICAgbWluOiAxMDAsXG4gICAgbWF4OiAzMDBcbiAgfSxcbiAgXG4gIC8vIFx1OEJGN1x1NkM0Mlx1NTkwNFx1NzQwNlx1OTE0RFx1N0Y2RVxuICBhcGk6IHtcbiAgICAvLyBcdTU3RkFcdTc4NDBVUkxcbiAgICBiYXNlVXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGlcIixcbiAgICBcbiAgICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhcdTgxRUFcdTUyQThcdTZBMjFcdTYyREZcdUZGMDhcdTVGNTNcdTU0MEVcdTdBRUZcdTY3MERcdTUyQTFcdTRFMERcdTUzRUZcdTc1MjhcdTY1RjZcdTgxRUFcdTUyQThcdTUyMDdcdTYzNjJcdTUyMzBcdTZBMjFcdTYyREZcdTZBMjFcdTVGMEZcdUZGMDlcbiAgICBhdXRvTW9jazogdHJ1ZVxuICB9LFxuICBcbiAgLy8gXHU2QTIxXHU1NzU3XHU1NDJGXHU3NTI4XHU5MTREXHU3RjZFXG4gIG1vZHVsZXM6IHtcbiAgICBkYXRhc291cmNlOiB0cnVlLFxuICAgIHF1ZXJ5OiB0cnVlLFxuICAgIGludGVncmF0aW9uOiB0cnVlLFxuICAgIHZlcnNpb246IHRydWUsXG4gICAgbWV0YWRhdGE6IHRydWVcbiAgfSxcbiAgXG4gIC8vIFx1NjVFNVx1NUZEN1x1OTE0RFx1N0Y2RVxuICBsb2dnaW5nOiB7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICBsZXZlbDogXCJkZWJ1Z1wiIC8vIGRlYnVnLCBpbmZvLCB3YXJuLCBlcnJvciwgbm9uZVxuICB9LFxuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCIC0gXHU0RkJGXHU0RThFXHU3NkY0XHU2M0E1XHU4QkJGXHU5NUVFXG4gIGdldCBsb2dMZXZlbCgpOiBMb2dMZXZlbCB7XG4gICAgcmV0dXJuIHRoaXMubG9nZ2luZy5lbmFibGVkID8gKHRoaXMubG9nZ2luZy5sZXZlbCBhcyBMb2dMZXZlbCkgOiAnbm9uZSc7XG4gIH1cbn07XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc01vY2tFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAvLyBcdTc4NkVcdTRGRERcdThGRDRcdTU2REV0cnVlXHU0RUU1XHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICByZXR1cm4gbW9ja0NvbmZpZy5lbmFibGVkO1xufVxuXG4vKipcbiAqIFx1NjhDMFx1NjdFNVx1NzI3OVx1NUI5QVx1NkEyMVx1NTc1N1x1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOFx1NkEyMVx1NjJERlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNNb2R1bGVFbmFibGVkKG1vZHVsZU5hbWU6IGtleW9mIHR5cGVvZiBtb2NrQ29uZmlnLm1vZHVsZXMpOiBib29sZWFuIHtcbiAgcmV0dXJuIG1vY2tDb25maWcuZW5hYmxlZCAmJiBtb2NrQ29uZmlnLm1vZHVsZXNbbW9kdWxlTmFtZV07XG59XG5cbi8qKlxuICogXHU4QkIwXHU1RjU1XHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHU3NkY4XHU1MTczXHU2NUU1XHU1RkQ3XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2dNb2NrKGxldmVsOiBMb2dMZXZlbCwgbWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICBjb25zdCBjb25maWdMZXZlbCA9IG1vY2tDb25maWcubG9nTGV2ZWw7XG4gIFxuICAvLyBcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkJcdTRGMThcdTUxNDhcdTdFQTc6IG5vbmUgPCBlcnJvciA8IHdhcm4gPCBpbmZvIDwgZGVidWdcbiAgY29uc3QgbGV2ZWxzOiBSZWNvcmQ8TG9nTGV2ZWwsIG51bWJlcj4gPSB7XG4gICAgJ25vbmUnOiAwLFxuICAgICdlcnJvcic6IDEsXG4gICAgJ3dhcm4nOiAyLFxuICAgICdpbmZvJzogMyxcbiAgICAnZGVidWcnOiA0XG4gIH07XG4gIFxuICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTVFOTRcdThCQjBcdTVGNTVcdTZCNjRcdTdFQTdcdTUyMkJcdTc2ODRcdTY1RTVcdTVGRDdcbiAgaWYgKGxldmVsc1tjb25maWdMZXZlbF0gPj0gbGV2ZWxzW2xldmVsXSkge1xuICAgIGNvbnN0IHByZWZpeCA9IGBbTW9jayAke2xldmVsLnRvVXBwZXJDYXNlKCl9XWA7XG4gICAgXG4gICAgc3dpdGNoIChsZXZlbCkge1xuICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICBjb25zb2xlLmVycm9yKHByZWZpeCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2Fybic6XG4gICAgICAgIGNvbnNvbGUud2FybihwcmVmaXgsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICBjb25zb2xlLmluZm8ocHJlZml4LCBtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZWJ1Zyc6XG4gICAgICAgIGNvbnNvbGUuZGVidWcocHJlZml4LCBtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjRETW9ja1x1OTE0RFx1N0Y2RVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW9ja0NvbmZpZygpIHtcbiAgcmV0dXJuIHsgLi4ubW9ja0NvbmZpZyB9O1xufVxuXG4vKipcbiAqIFx1NUYzQVx1NTIzNlx1NjI1M1x1NTM3MFx1NUY1M1x1NTI0RFx1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMVx1RkYwQ1x1NjVCOVx1NEZCRlx1OEMwM1x1OEJENVxuICovXG5jb25zb2xlLmluZm8oJ1tNb2NrXHU5MTREXHU3RjZFXSBNb2NrXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxOicsIG1vY2tDb25maWcuZW5hYmxlZCA/ICdcdTVERjJcdTU0MkZcdTc1MjgnIDogJ1x1NURGMlx1Nzk4MVx1NzUyOCcpO1xuY29uc29sZS5pbmZvKCdbTW9ja1x1OTE0RFx1N0Y2RV0gQVBJXHU1N0ZBXHU3ODQwVVJMOicsIG1vY2tDb25maWcuYXBpLmJhc2VVcmwpO1xuY29uc29sZS5pbmZvKCdbTW9ja1x1OTE0RFx1N0Y2RV0gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCOicsIG1vY2tDb25maWcubG9nTGV2ZWwpOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50c1wiOy8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjU3MFx1NjM2RVx1NkU5MFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1RkYwQ1x1NzUyOFx1NEU4RVx1NUYwMFx1NTNEMVx1NTQ4Q1x1NkQ0Qlx1OEJENVxuICovXG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1N0M3Qlx1NTc4QlxuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZVR5cGUgPSAnbXlzcWwnIHwgJ3Bvc3RncmVzcWwnIHwgJ29yYWNsZScgfCAnc3Fsc2VydmVyJyB8ICdzcWxpdGUnO1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTcyQjZcdTYwMDFcbmV4cG9ydCB0eXBlIERhdGFTb3VyY2VTdGF0dXMgPSAnYWN0aXZlJyB8ICdpbmFjdGl2ZScgfCAnZXJyb3InIHwgJ3BlbmRpbmcnO1xuXG4vLyBcdTU0MENcdTZCNjVcdTk4OTFcdTczODdcbmV4cG9ydCB0eXBlIFN5bmNGcmVxdWVuY3kgPSAnbWFudWFsJyB8ICdob3VybHknIHwgJ2RhaWx5JyB8ICd3ZWVrbHknIHwgJ21vbnRobHknO1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTYzQTVcdTUzRTNcbmV4cG9ydCBpbnRlcmZhY2UgRGF0YVNvdXJjZSB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHR5cGU6IERhdGFTb3VyY2VUeXBlO1xuICBob3N0Pzogc3RyaW5nO1xuICBwb3J0PzogbnVtYmVyO1xuICBkYXRhYmFzZU5hbWU/OiBzdHJpbmc7XG4gIHVzZXJuYW1lPzogc3RyaW5nO1xuICBwYXNzd29yZD86IHN0cmluZztcbiAgc3RhdHVzOiBEYXRhU291cmNlU3RhdHVzO1xuICBzeW5jRnJlcXVlbmN5PzogU3luY0ZyZXF1ZW5jeTtcbiAgbGFzdFN5bmNUaW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgY3JlYXRlZEF0OiBzdHJpbmc7XG4gIHVwZGF0ZWRBdDogc3RyaW5nO1xuICBpc0FjdGl2ZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuZXhwb3J0IGNvbnN0IG1vY2tEYXRhU291cmNlczogRGF0YVNvdXJjZVtdID0gW1xuICB7XG4gICAgaWQ6ICdkcy0xJyxcbiAgICBuYW1lOiAnTXlTUUxcdTc5M0FcdTRGOEJcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU3OTNBXHU0RjhCTXlTUUxcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdteXNxbCcsXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgcG9ydDogMzMwNixcbiAgICBkYXRhYmFzZU5hbWU6ICdleGFtcGxlX2RiJyxcbiAgICB1c2VybmFtZTogJ3VzZXInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0yJyxcbiAgICBuYW1lOiAnUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAncG9zdGdyZXNxbCcsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xMDAnLFxuICAgIHBvcnQ6IDU0MzIsXG4gICAgZGF0YWJhc2VOYW1lOiAncHJvZHVjdGlvbl9kYicsXG4gICAgdXNlcm5hbWU6ICdhZG1pbicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnaG91cmx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzNjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDc3NzYwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTMnLFxuICAgIG5hbWU6ICdTUUxpdGVcdTY3MkNcdTU3MzBcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU2NzJDXHU1NzMwU1FMaXRlXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnc3FsaXRlJyxcbiAgICBkYXRhYmFzZU5hbWU6ICcvcGF0aC90by9sb2NhbC5kYicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnbWFudWFsJyxcbiAgICBsYXN0U3luY1RpbWU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzNDU2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtNCcsXG4gICAgbmFtZTogJ1NRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwU1FMIFNlcnZlclx1NkQ0Qlx1OEJENVx1NzNBRlx1NTg4MycsXG4gICAgdHlwZTogJ3NxbHNlcnZlcicsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4yMDAnLFxuICAgIHBvcnQ6IDE0MzMsXG4gICAgZGF0YWJhc2VOYW1lOiAndGVzdF9kYicsXG4gICAgdXNlcm5hbWU6ICd0ZXN0ZXInLFxuICAgIHN0YXR1czogJ2luYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnd2Vla2x5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA2MDQ4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNTE4NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiBmYWxzZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy01JyxcbiAgICBuYW1lOiAnT3JhY2xlXHU0RjAxXHU0RTFBXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzME9yYWNsZVx1NEYwMVx1NEUxQVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ29yYWNsZScsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xNTAnLFxuICAgIHBvcnQ6IDE1MjEsXG4gICAgZGF0YWJhc2VOYW1lOiAnZW50ZXJwcmlzZV9kYicsXG4gICAgdXNlcm5hbWU6ICdzeXN0ZW0nLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTAzNjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9XG5dO1xuXG4vKipcbiAqIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGNvdW50IFx1NzUxRlx1NjIxMFx1NjU3MFx1OTFDRlxuICogQHJldHVybnMgXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU3RUM0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1vY2tEYXRhU291cmNlcyhjb3VudDogbnVtYmVyID0gNSk6IERhdGFTb3VyY2VbXSB7XG4gIGNvbnN0IHR5cGVzOiBEYXRhU291cmNlVHlwZVtdID0gWydteXNxbCcsICdwb3N0Z3Jlc3FsJywgJ29yYWNsZScsICdzcWxzZXJ2ZXInLCAnc3FsaXRlJ107XG4gIGNvbnN0IHN0YXR1c2VzOiBEYXRhU291cmNlU3RhdHVzW10gPSBbJ2FjdGl2ZScsICdpbmFjdGl2ZScsICdlcnJvcicsICdwZW5kaW5nJ107XG4gIGNvbnN0IHN5bmNGcmVxczogU3luY0ZyZXF1ZW5jeVtdID0gWydtYW51YWwnLCAnaG91cmx5JywgJ2RhaWx5JywgJ3dlZWtseScsICdtb250aGx5J107XG4gIFxuICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogY291bnQgfSwgKF8sIGkpID0+IHtcbiAgICBjb25zdCB0eXBlID0gdHlwZXNbaSAlIHR5cGVzLmxlbmd0aF07XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBkcy1nZW4tJHtpICsgMX1gLFxuICAgICAgbmFtZTogYFx1NzUxRlx1NjIxMFx1NzY4NCR7dHlwZX1cdTY1NzBcdTYzNkVcdTZFOTAgJHtpICsgMX1gLFxuICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTc2ODQke3R5cGV9XHU3QzdCXHU1NzhCXHU2NTcwXHU2MzZFXHU2RTkwICR7aSArIDF9YCxcbiAgICAgIHR5cGUsXG4gICAgICBob3N0OiB0eXBlICE9PSAnc3FsaXRlJyA/ICdsb2NhbGhvc3QnIDogdW5kZWZpbmVkLFxuICAgICAgcG9ydDogdHlwZSAhPT0gJ3NxbGl0ZScgPyAoMzMwNiArIGkpIDogdW5kZWZpbmVkLFxuICAgICAgZGF0YWJhc2VOYW1lOiB0eXBlID09PSAnc3FsaXRlJyA/IGAvcGF0aC90by9kYl8ke2l9LmRiYCA6IGBleGFtcGxlX2RiXyR7aX1gLFxuICAgICAgdXNlcm5hbWU6IHR5cGUgIT09ICdzcWxpdGUnID8gYHVzZXJfJHtpfWAgOiB1bmRlZmluZWQsXG4gICAgICBzdGF0dXM6IHN0YXR1c2VzW2kgJSBzdGF0dXNlcy5sZW5ndGhdLFxuICAgICAgc3luY0ZyZXF1ZW5jeTogc3luY0ZyZXFzW2kgJSBzeW5jRnJlcXMubGVuZ3RoXSxcbiAgICAgIGxhc3RTeW5jVGltZTogaSAlIDMgPT09IDAgPyBudWxsIDogbmV3IERhdGUobm93IC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShub3cgLSAoaSArIDEwKSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShub3cgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBpc0FjdGl2ZTogaSAlIDQgIT09IDBcbiAgICB9O1xuICB9KTtcbn1cblxuLy8gXHU1QkZDXHU1MUZBXHU5RUQ4XHU4QkE0XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG5leHBvcnQgZGVmYXVsdCBtb2NrRGF0YVNvdXJjZXM7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50c1wiOy8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwTW9ja1x1NjcwRFx1NTJBMVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY1NzBcdTYzNkVcdTZFOTBcdTc2RjhcdTUxNzNBUElcdTc2ODRcdTZBMjFcdTYyREZcdTVCOUVcdTczQjBcbiAqL1xuXG5pbXBvcnQgeyBtb2NrRGF0YVNvdXJjZXMgfSBmcm9tICcuLi9kYXRhL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlIH0gZnJvbSAnLi4vZGF0YS9kYXRhc291cmNlJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuXG4vLyBcdTRFMzRcdTY1RjZcdTVCNThcdTUwQThcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdUZGMENcdTUxNDFcdThCQjhcdTZBMjFcdTYyREZcdTU4OUVcdTUyMjBcdTY1MzlcdTY0Q0RcdTRGNUNcbmxldCBkYXRhU291cmNlcyA9IFsuLi5tb2NrRGF0YVNvdXJjZXNdO1xuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZURlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkZWxheSA9IHR5cGVvZiBtb2NrQ29uZmlnLmRlbGF5ID09PSAnbnVtYmVyJyA/IG1vY2tDb25maWcuZGVsYXkgOiAzMDA7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbn1cblxuLyoqXG4gKiBcdTkxQ0RcdTdGNkVcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTYzNkVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0RGF0YVNvdXJjZXMoKTogdm9pZCB7XG4gIGRhdGFTb3VyY2VzID0gWy4uLm1vY2tEYXRhU291cmNlc107XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKiBAcGFyYW0gcGFyYW1zIFx1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MFxuICogQHJldHVybnMgXHU1MjA2XHU5ODc1XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYXRhU291cmNlcyhwYXJhbXM/OiB7XG4gIHBhZ2U/OiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHR5cGU/OiBzdHJpbmc7XG4gIHN0YXR1cz86IHN0cmluZztcbn0pOiBQcm9taXNlPHtcbiAgaXRlbXM6IERhdGFTb3VyY2VbXTtcbiAgcGFnaW5hdGlvbjoge1xuICAgIHRvdGFsOiBudW1iZXI7XG4gICAgcGFnZTogbnVtYmVyO1xuICAgIHNpemU6IG51bWJlcjtcbiAgICB0b3RhbFBhZ2VzOiBudW1iZXI7XG4gIH07XG59PiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gIFxuICAvLyBcdTVFOTRcdTc1MjhcdThGQzdcdTZFRTRcbiAgbGV0IGZpbHRlcmVkSXRlbXMgPSBbLi4uZGF0YVNvdXJjZXNdO1xuICBcbiAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/Lm5hbWUpIHtcbiAgICBjb25zdCBrZXl3b3JkID0gcGFyYW1zLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gXG4gICAgICBkcy5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAoZHMuZGVzY3JpcHRpb24gJiYgZHMuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICApO1xuICB9XG4gIFxuICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8udHlwZSkge1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBkcy50eXBlID09PSBwYXJhbXMudHlwZSk7XG4gIH1cbiAgXG4gIC8vIFx1NjMwOVx1NzJCNlx1NjAwMVx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gZHMuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgfVxuICBcbiAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmlsdGVyZWRJdGVtcy5sZW5ndGgpO1xuICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gIFxuICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgcmV0dXJuIHtcbiAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdG90YWw6IGZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgcGFnZSxcbiAgICAgIHNpemUsXG4gICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmlsdGVyZWRJdGVtcy5sZW5ndGggLyBzaXplKVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICogQHJldHVybnMgXHU2NTcwXHU2MzZFXHU2RTkwXHU4QkU2XHU2MEM1XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYXRhU291cmNlKGlkOiBzdHJpbmcpOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjdFNVx1NjI3RVx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCBkYXRhU291cmNlID0gZGF0YVNvdXJjZXMuZmluZChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKCFkYXRhU291cmNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIHJldHVybiBkYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGRhdGEgXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU2MzZFXG4gKiBAcmV0dXJucyBcdTUyMUJcdTVFRkFcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZURhdGFTb3VyY2UoZGF0YTogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwSURcbiAgY29uc3QgbmV3SWQgPSBgZHMtJHtEYXRlLm5vdygpfWA7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgbmV3RGF0YVNvdXJjZTogRGF0YVNvdXJjZSA9IHtcbiAgICBpZDogbmV3SWQsXG4gICAgbmFtZTogZGF0YS5uYW1lIHx8ICdOZXcgRGF0YSBTb3VyY2UnLFxuICAgIGRlc2NyaXB0aW9uOiBkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgIHR5cGU6IGRhdGEudHlwZSB8fCAnbXlzcWwnLFxuICAgIGhvc3Q6IGRhdGEuaG9zdCxcbiAgICBwb3J0OiBkYXRhLnBvcnQsXG4gICAgZGF0YWJhc2VOYW1lOiBkYXRhLmRhdGFiYXNlTmFtZSxcbiAgICB1c2VybmFtZTogZGF0YS51c2VybmFtZSxcbiAgICBzdGF0dXM6IGRhdGEuc3RhdHVzIHx8ICdwZW5kaW5nJyxcbiAgICBzeW5jRnJlcXVlbmN5OiBkYXRhLnN5bmNGcmVxdWVuY3kgfHwgJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH07XG4gIFxuICAvLyBcdTZERkJcdTUyQTBcdTUyMzBcdTUyMTdcdTg4NjhcbiAgZGF0YVNvdXJjZXMucHVzaChuZXdEYXRhU291cmNlKTtcbiAgXG4gIHJldHVybiBuZXdEYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKiBAcGFyYW0gZGF0YSBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcbiAqIEByZXR1cm5zIFx1NjZGNFx1NjVCMFx1NTQwRVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlRGF0YVNvdXJjZShpZDogc3RyaW5nLCBkYXRhOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTYyN0VcdTUyMzBcdTg5ODFcdTY2RjRcdTY1QjBcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcdTdEMjJcdTVGMTVcbiAgY29uc3QgaW5kZXggPSBkYXRhU291cmNlcy5maW5kSW5kZXgoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IHVwZGF0ZWREYXRhU291cmNlOiBEYXRhU291cmNlID0ge1xuICAgIC4uLmRhdGFTb3VyY2VzW2luZGV4XSxcbiAgICAuLi5kYXRhLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gIH07XG4gIFxuICAvLyBcdTY2RkZcdTYzNjJcdTY1NzBcdTYzNkVcdTZFOTBcbiAgZGF0YVNvdXJjZXNbaW5kZXhdID0gdXBkYXRlZERhdGFTb3VyY2U7XG4gIFxuICByZXR1cm4gdXBkYXRlZERhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZURhdGFTb3VyY2UoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2MjdFXHU1MjMwXHU4OTgxXHU1MjIwXHU5NjY0XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXHU3RDIyXHU1RjE1XG4gIGNvbnN0IGluZGV4ID0gZGF0YVNvdXJjZXMuZmluZEluZGV4KGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBkYXRhU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIFx1NkQ0Qlx1OEJENVx1NjU3MFx1NjM2RVx1NkU5MFx1OEZERVx1NjNBNVxuICogQHBhcmFtIHBhcmFtcyBcdThGREVcdTYzQTVcdTUzQzJcdTY1NzBcbiAqIEByZXR1cm5zIFx1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1N0VEM1x1Njc5Q1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdENvbm5lY3Rpb24ocGFyYW1zOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTx7XG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIG1lc3NhZ2U/OiBzdHJpbmc7XG4gIGRldGFpbHM/OiBhbnk7XG59PiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTVCOUVcdTk2NDVcdTRGN0ZcdTc1MjhcdTY1RjZcdTUzRUZcdTgwRkRcdTRGMUFcdTY3MDlcdTY2RjRcdTU5MERcdTY3NDJcdTc2ODRcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTkwM0JcdThGOTFcbiAgLy8gXHU4RkQ5XHU5MUNDXHU3QjgwXHU1MzU1XHU2QTIxXHU2MkRGXHU2MjEwXHU1MjlGL1x1NTkzMVx1OEQyNVxuICBjb25zdCBzdWNjZXNzID0gTWF0aC5yYW5kb20oKSA+IDAuMjsgLy8gODAlXHU2MjEwXHU1MjlGXHU3Mzg3XG4gIFxuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3MsXG4gICAgbWVzc2FnZTogc3VjY2VzcyA/ICdcdThGREVcdTYzQTVcdTYyMTBcdTUyOUYnIDogJ1x1OEZERVx1NjNBNVx1NTkzMVx1OEQyNTogXHU2NUUwXHU2Q0Q1XHU4RkRFXHU2M0E1XHU1MjMwXHU2NTcwXHU2MzZFXHU1RTkzXHU2NzBEXHU1MkExXHU1NjY4JyxcbiAgICBkZXRhaWxzOiBzdWNjZXNzID8ge1xuICAgICAgcmVzcG9uc2VUaW1lOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCkgKyAxMCxcbiAgICAgIHZlcnNpb246ICc4LjAuMjgnLFxuICAgICAgY29ubmVjdGlvbklkOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkgKyAxMDAwXG4gICAgfSA6IHtcbiAgICAgIGVycm9yQ29kZTogJ0NPTk5FQ1RJT05fUkVGVVNFRCcsXG4gICAgICBlcnJvckRldGFpbHM6ICdcdTY1RTBcdTZDRDVcdTVFRkFcdTdBQ0JcdTUyMzBcdTY3MERcdTUyQTFcdTU2NjhcdTc2ODRcdThGREVcdTYzQTVcdUZGMENcdThCRjdcdTY4QzBcdTY3RTVcdTdGNTFcdTdFRENcdThCQkVcdTdGNkVcdTU0OENcdTUxRURcdTYzNkUnXG4gICAgfVxuICB9O1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTY3MERcdTUyQTFcbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0RGF0YVNvdXJjZXMsXG4gIGdldERhdGFTb3VyY2UsXG4gIGNyZWF0ZURhdGFTb3VyY2UsXG4gIHVwZGF0ZURhdGFTb3VyY2UsXG4gIGRlbGV0ZURhdGFTb3VyY2UsXG4gIHRlc3RDb25uZWN0aW9uLFxuICByZXNldERhdGFTb3VyY2VzXG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy91dGlscy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTAxQVx1NzUyOFx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTUyMUJcdTVFRkFcdTdFREZcdTRFMDBcdTY4M0NcdTVGMEZcdTU0Q0RcdTVFOTRcdTc2ODRcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbiAqL1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NkEyMVx1NjJERkFQSVx1NjIxMFx1NTI5Rlx1NTRDRFx1NUU5NFxuICogQHBhcmFtIGRhdGEgXHU1NENEXHU1RTk0XHU2NTcwXHU2MzZFXG4gKiBAcGFyYW0gc3VjY2VzcyBcdTYyMTBcdTUyOUZcdTcyQjZcdTYwMDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0F0cnVlXG4gKiBAcGFyYW0gbWVzc2FnZSBcdTUzRUZcdTkwMDlcdTZEODhcdTYwNkZcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NjgzQ1x1NUYwRlx1NzY4NEFQSVx1NTRDRFx1NUU5NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja1Jlc3BvbnNlPFQ+KFxuICBkYXRhOiBULCBcbiAgc3VjY2VzczogYm9vbGVhbiA9IHRydWUsIFxuICBtZXNzYWdlPzogc3RyaW5nXG4pIHtcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzLFxuICAgIGRhdGEsXG4gICAgbWVzc2FnZSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBtb2NrUmVzcG9uc2U6IHRydWUgLy8gXHU2ODA3XHU4QkIwXHU0RTNBXHU2QTIxXHU2MkRGXHU1NENEXHU1RTk0XG4gIH07XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2QTIxXHU2MkRGQVBJXHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKiBAcGFyYW0gbWVzc2FnZSBcdTk1MTlcdThCRUZcdTZEODhcdTYwNkZcbiAqIEBwYXJhbSBjb2RlIFx1OTUxOVx1OEJFRlx1NEVFM1x1NzgwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQSdNT0NLX0VSUk9SJ1xuICogQHBhcmFtIHN0YXR1cyBIVFRQXHU3MkI2XHU2MDAxXHU3ODAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBNTAwXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTY4M0NcdTVGMEZcdTc2ODRcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlKFxuICBtZXNzYWdlOiBzdHJpbmcsIFxuICBjb2RlOiBzdHJpbmcgPSAnTU9DS19FUlJPUicsIFxuICBzdGF0dXM6IG51bWJlciA9IDUwMFxuKSB7XG4gIHJldHVybiB7XG4gICAgc3VjY2VzczogZmFsc2UsXG4gICAgZXJyb3I6IHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBjb2RlLFxuICAgICAgc3RhdHVzQ29kZTogc3RhdHVzXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBtb2NrUmVzcG9uc2U6IHRydWVcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTUyMDZcdTk4NzVcdTU0Q0RcdTVFOTRcdTdFRDNcdTY3ODRcbiAqIEBwYXJhbSBpdGVtcyBcdTVGNTNcdTUyNERcdTk4NzVcdTc2ODRcdTk4NzlcdTc2RUVcdTUyMTdcdTg4NjhcbiAqIEBwYXJhbSB0b3RhbEl0ZW1zIFx1NjAzQlx1OTg3OVx1NzZFRVx1NjU3MFxuICogQHBhcmFtIHBhZ2UgXHU1RjUzXHU1MjREXHU5ODc1XHU3ODAxXG4gKiBAcGFyYW0gc2l6ZSBcdTZCQ0ZcdTk4NzVcdTU5MjdcdTVDMEZcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NFx1N0VEM1x1Njc4NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlPFQ+KFxuICBpdGVtczogVFtdLFxuICB0b3RhbEl0ZW1zOiBudW1iZXIsXG4gIHBhZ2U6IG51bWJlciA9IDEsXG4gIHNpemU6IG51bWJlciA9IDEwXG4pIHtcbiAgcmV0dXJuIGNyZWF0ZU1vY2tSZXNwb25zZSh7XG4gICAgaXRlbXMsXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdG90YWw6IHRvdGFsSXRlbXMsXG4gICAgICBwYWdlLFxuICAgICAgc2l6ZSxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCh0b3RhbEl0ZW1zIC8gc2l6ZSksXG4gICAgICBoYXNNb3JlOiBwYWdlICogc2l6ZSA8IHRvdGFsSXRlbXNcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFx1NUVGNlx1OEZERlxuICogQHBhcmFtIG1zIFx1NUVGNlx1OEZERlx1NkJFQlx1NzlEMlx1NjU3MFx1RkYwQ1x1OUVEOFx1OEJBNDMwMG1zXG4gKiBAcmV0dXJucyBQcm9taXNlXHU1QkY5XHU4QzYxXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxheShtczogbnVtYmVyID0gMzAwKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjcmVhdGVNb2NrUmVzcG9uc2UsXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5XG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTZDNlx1NEUyRFx1NUJGQ1x1NTFGQVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRBUEkgTW9ja1x1NjcwRFx1NTJBMVx1NTE2NVx1NTNFM1x1NzBCOVxuICovXG5cbi8vIFx1NUJGQ1x1NTE2NVx1NjU3MFx1NjM2RVx1NkU5MFx1NjcwRFx1NTJBMVxuaW1wb3J0IGRhdGFTb3VyY2UgZnJvbSAnLi9kYXRhc291cmNlJztcblxuLy8gXHU1QkZDXHU1MTY1XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG5pbXBvcnQgeyBcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLCBcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsIFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5IFxufSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFNb2NrXG4gKi9cbmNvbnN0IHF1ZXJ5ID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyaWVzKHBhcmFtczogeyBwYWdlOiBudW1iZXI7IHNpemU6IG51bWJlcjsgfSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSh7XG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGlkOiAncTEnLCBuYW1lOiAnXHU3NTI4XHU2MjM3XHU1MjA2XHU2NzkwXHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTU3MzBcdTUzM0FcdTdFREZcdThCQTFcdTc1MjhcdTYyMzdcdTZDRThcdTUxOENcdTY1NzBcdTYzNkUnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTInLCBuYW1lOiAnXHU5NTAwXHU1NTJFXHU0RTFBXHU3RUU5XHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTY3MDhcdTdFREZcdThCQTFcdTk1MDBcdTU1MkVcdTk4OUQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTMnLCBuYW1lOiAnXHU1RTkzXHU1QjU4XHU1MjA2XHU2NzkwJywgZGVzY3JpcHRpb246ICdcdTc2RDFcdTYzQTdcdTVFOTNcdTVCNThcdTZDMzRcdTVFNzMnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgXSxcbiAgICAgIHRvdGFsOiAzLFxuICAgICAgcGFnZTogcGFyYW1zLnBhZ2UsXG4gICAgICBzaXplOiBwYXJhbXMuc2l6ZVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5KGlkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6ICdcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgc3FsOiAnU0VMRUNUICogRlJPTSB1c2VycyBXSEVSRSBzdGF0dXMgPSAkMScsXG4gICAgICBwYXJhbWV0ZXJzOiBbJ2FjdGl2ZSddLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnkoZGF0YTogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBxdWVyeS0ke0RhdGUubm93KCl9YCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyB1cGRhdGVRdWVyeShpZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlUXVlcnkoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnM6IFsnaWQnLCAnbmFtZScsICdlbWFpbCcsICdzdGF0dXMnXSxcbiAgICAgIHJvd3M6IFtcbiAgICAgICAgeyBpZDogMSwgbmFtZTogJ1x1NUYyMFx1NEUwOScsIGVtYWlsOiAnemhhbmdAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIG5hbWU6ICdcdTY3NEVcdTU2REInLCBlbWFpbDogJ2xpQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICAgICAgICB7IGlkOiAzLCBuYW1lOiAnXHU3MzhCXHU0RTk0JywgZW1haWw6ICd3YW5nQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnaW5hY3RpdmUnIH0sXG4gICAgICBdLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgZXhlY3V0aW9uVGltZTogMC4yMzUsXG4gICAgICAgIHJvd0NvdW50OiAzLFxuICAgICAgICB0b3RhbFBhZ2VzOiAxXG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcblxuLyoqXG4gKiBcdTVCRkNcdTUxRkFcdTYyNDBcdTY3MDlcdTY3MERcdTUyQTFcbiAqL1xuY29uc3Qgc2VydmljZXMgPSB7XG4gIGRhdGFTb3VyY2UsXG4gIHF1ZXJ5XG59O1xuXG4vLyBcdTVCRkNcdTUxRkFtb2NrIHNlcnZpY2VcdTVERTVcdTUxNzdcbmV4cG9ydCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NTQwNFx1NEUyQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGNvbnN0IGRhdGFTb3VyY2VTZXJ2aWNlID0gc2VydmljZXMuZGF0YVNvdXJjZTtcbmV4cG9ydCBjb25zdCBxdWVyeVNlcnZpY2UgPSBzZXJ2aWNlcy5xdWVyeTtcblxuLy8gXHU5RUQ4XHU4QkE0XHU1QkZDXHU1MUZBXHU2MjQwXHU2NzA5XHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCBzZXJ2aWNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTdCQTFcdTc0MDZcdTZBMjFcdTU3NTdcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0SFRUUFx1OEJGN1x1NkM0Mlx1NjJFNlx1NjIyQVx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFxuICogXHU4RDFGXHU4RDIzXHU3QkExXHU3NDA2XHU1NDhDXHU1MjA2XHU1M0QxXHU2MjQwXHU2NzA5QVBJXHU4QkY3XHU2QzQyXHU1MjMwXHU1QkY5XHU1RTk0XHU3Njg0XHU2NzBEXHU1MkExXHU1OTA0XHU3NDA2XHU1MUZEXHU2NTcwXG4gKi9cblxuaW1wb3J0IHsgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCB7IGlzTW9ja0VuYWJsZWQsIGxvZ01vY2ssIG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHNlcnZpY2VzIGZyb20gJy4uL3NlcnZpY2VzJztcbmltcG9ydCB7IGNyZWF0ZU1vY2tSZXNwb25zZSwgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UgfSBmcm9tICcuLi9zZXJ2aWNlcy91dGlscyc7XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlxuICogXG4gKiBcdTZCNjRcdTRFMkRcdTk1RjRcdTRFRjZcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDJcdTVFNzZcdTYzRDBcdTRGOUJcdTZBMjFcdTYyREZcdTU0Q0RcdTVFOTRcbiAqIFx1NTNFQVx1NTkwNFx1NzQwNi9hcGlcdTVGMDBcdTU5MzRcdTc2ODRcdThCRjdcdTZDNDJcdUZGMENcdTUxNzZcdTRFRDZcdThCRjdcdTZDNDJcdTc2RjRcdTYzQTVcdTY1M0VcdTg4NENcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlTW9ja01pZGRsZXdhcmUoKTogQ29ubmVjdC5OZXh0SGFuZGxlRnVuY3Rpb24ge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbW9ja01pZGRsZXdhcmUoXG4gICAgcmVxOiBDb25uZWN0LkluY29taW5nTWVzc2FnZSwgXG4gICAgcmVzOiBodHRwLlNlcnZlclJlc3BvbnNlLCBcbiAgICBuZXh0OiBDb25uZWN0Lk5leHRGdW5jdGlvblxuICApIHtcbiAgICAvLyBcdTY4QzBcdTY3RTVNb2NrXHU2NzBEXHU1MkExXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XG4gICAgaWYgKCFpc01vY2tFbmFibGVkKCkpIHtcbiAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTNFQVx1NjJFNlx1NjIyQS9hcGlcdTVGMDBcdTU5MzRcdTc2ODRcdThCRjdcdTZDNDJcdUZGMENcdTUxNzZcdTRFRDZcdThCRjdcdTZDNDJcdTc2RjRcdTYzQTVcdTY1M0VcdTg4NENcbiAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgIGlmICghdXJsLnN0YXJ0c1dpdGgoJy9hcGkvJykpIHtcbiAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgfVxuICAgIFxuICAgIGxvZ01vY2soJ2luZm8nLCBgW01vY2tdIFx1NjJFNlx1NjIyQUFQSVx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3VybH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gXHU1OTA0XHU3NDA2T1BUSU9OU1x1OTg4NFx1NjhDMFx1OEJGN1x1NkM0MlxuICAgICAgaWYgKHJlcS5tZXRob2QgPT09ICdPUFRJT05TJykge1xuICAgICAgICBoYW5kbGVPcHRpb25zUmVxdWVzdChyZXMpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1ODlFM1x1Njc5MFx1OEJGN1x1NkM0Mlx1NjU3MFx1NjM2RVxuICAgICAgY29uc3QgcmVxQm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdThCRjdcdTZDNDJcdTRGNTM6YCwgcmVxQm9keSk7XG4gICAgICBcbiAgICAgIC8vIFx1ODNCN1x1NTNENlx1OEJGN1x1NkM0Mlx1OERFRlx1NUY4NFx1NTQ4Q1x1NjVCOVx1NkNENVxuICAgICAgY29uc3QgcGF0aCA9IHVybDtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2Q/LnRvVXBwZXJDYXNlKCkgfHwgJ0dFVCc7XG4gICAgICBcbiAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NUVGNlx1OEZERlx1NkEyMVx1NjJERlx1N0Y1MVx1N0VEQ1x1NUVGNlx1OEZERlxuICAgICAgYXdhaXQgYWRkRGVsYXkoKTtcbiAgICAgIFxuICAgICAgLy8gXHU4REVGXHU3NTMxXHU1MjA2XHU1M0QxXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXG4gICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgLy8gXHU2NTcwXHU2MzZFXHU2RTkwQVBJXG4gICAgICAgIGNhc2UgcGF0aC5pbmNsdWRlcygnL2FwaS9kYXRhc291cmNlcycpOlxuICAgICAgICAgIGF3YWl0IGhhbmRsZURhdGFTb3VyY2VSZXF1ZXN0KHBhdGgsIG1ldGhvZCwgcmVxQm9keSwgcmVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NjdFNVx1OEJFMkFQSVxuICAgICAgICBjYXNlIHBhdGguaW5jbHVkZXMoJy9hcGkvcXVlcmllcycpOlxuICAgICAgICAgIGF3YWl0IGhhbmRsZVF1ZXJ5UmVxdWVzdChwYXRoLCBtZXRob2QsIHJlcUJvZHksIHJlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTUxNzZcdTRFRDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBcdTc1MUZcdTYyMTBcdTRFMDBcdTRFMkFcdTkwMUFcdTc1MjhcdTU0Q0RcdTVFOTRcbiAgICAgICAgICBsb2dNb2NrKCd3YXJuJywgYFtNb2NrXSBcdTY3MkFcdTUzMzlcdTkxNERcdTc2ODRBUEk6ICR7bWV0aG9kfSAke3BhdGh9YCk7XG4gICAgICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZSh7XG4gICAgICAgICAgICBtZXNzYWdlOiBgTW9jayByZXNwb25zZSBmb3IgJHttZXRob2R9ICR7cGF0aH1gLFxuICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dNb2NrKCdlcnJvcicsIGBbTW9ja10gXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU1MUZBXHU5NTE5OmAsIGVycm9yKTtcbiAgICAgIGhhbmRsZUVycm9yKHJlcywgZXJyb3IpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBcdTU5MDRcdTc0MDZcdTY1NzBcdTYzNkVcdTZFOTBcdTc2RjhcdTUxNzNcdThCRjdcdTZDNDJcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlRGF0YVNvdXJjZVJlcXVlc3QoXG4gIHBhdGg6IHN0cmluZywgXG4gIG1ldGhvZDogc3RyaW5nLCBcbiAgYm9keTogYW55LCBcbiAgcmVzOiBodHRwLlNlcnZlclJlc3BvbnNlXG4pIHtcbiAgdHJ5IHtcbiAgICBsb2dNb2NrKCdpbmZvJywgYFtNb2NrXSBcdTU5MDRcdTc0MDZcdTY1NzBcdTYzNkVcdTZFOTBcdThCRjdcdTZDNDI6ICR7bWV0aG9kfSAke3BhdGh9YCk7XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXG4gICAgY29uc3Qgc2luZ2xlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9kYXRhc291cmNlc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAoc2luZ2xlTWF0Y2ggJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgICAgY29uc3QgaWQgPSBzaW5nbGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTA6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS5nZXREYXRhU291cmNlKGlkKTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gICAgaWYgKHBhdGgubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvPyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4YCk7XG4gICAgICBcbiAgICAgIC8vIFx1ODlFM1x1Njc5MFx1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MFxuICAgICAgY29uc3QgdXJsT2JqID0gbmV3IFVSTChgaHR0cDovL2xvY2FsaG9zdCR7cGF0aH1gKTtcbiAgICAgIGNvbnN0IHBhZ2UgPSBwYXJzZUludCh1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgncGFnZScpIHx8ICcxJywgMTApO1xuICAgICAgY29uc3Qgc2l6ZSA9IHBhcnNlSW50KHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCdzaXplJykgfHwgJzEwJywgMTApO1xuICAgICAgY29uc3QgbmFtZSA9IHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCduYW1lJykgfHwgdW5kZWZpbmVkO1xuICAgICAgY29uc3QgdHlwZSA9IHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCd0eXBlJykgfHwgdW5kZWZpbmVkO1xuICAgICAgY29uc3Qgc3RhdHVzID0gdXJsT2JqLnNlYXJjaFBhcmFtcy5nZXQoJ3N0YXR1cycpIHx8IHVuZGVmaW5lZDtcbiAgICAgIFxuICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICBwYWdlLFxuICAgICAgICBzaXplLFxuICAgICAgICBuYW1lLFxuICAgICAgICB0eXBlLFxuICAgICAgICBzdGF0dXNcbiAgICAgIH07XG4gICAgICBcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTY1NzBcdTYzNkVcdTZFOTBcdTY3RTVcdThCRTJcdTUzQzJcdTY1NzA6YCwgcGFyYW1zKTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5kYXRhU291cmNlLmdldERhdGFTb3VyY2VzKHBhcmFtcyk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICAgIGlmIChwYXRoLm1hdGNoKC9cXC9hcGlcXC9kYXRhc291cmNlc1xcLz8kLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTA6YCwgYm9keSk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS5jcmVhdGVEYXRhU291cmNlKGJvZHkpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDEsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgICBjb25zdCB1cGRhdGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvKFteXFwvXSspJC8pO1xuICAgIGlmICh1cGRhdGVNYXRjaCAmJiBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgICBjb25zdCBpZCA9IHVwZGF0ZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MDogJHtpZH1gLCBib2R5KTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5kYXRhU291cmNlLnVwZGF0ZURhdGFTb3VyY2UoaWQsIGJvZHkpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgICBjb25zdCBkZWxldGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvKFteXFwvXSspJC8pO1xuICAgIGlmIChkZWxldGVNYXRjaCAmJiBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgICBjb25zdCBpZCA9IGRlbGV0ZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MDogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS5kZWxldGVEYXRhU291cmNlKGlkKTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCBpZCB9KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkNBMVx1NjcwOVx1NTMzOVx1OTE0RFx1NzY4NFx1OERFRlx1NzUzMVx1RkYwQ1x1OEZENFx1NTZERTQwNFxuICAgIGxvZ01vY2soJ3dhcm4nLCBgW01vY2tdIFx1NjcyQVx1NzdFNVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MEFQSTogJHttZXRob2R9ICR7cGF0aH1gKTtcbiAgICBzZW5kSnNvbihyZXMsIDQwNCwgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UoJ05vdCBGb3VuZCcsICdSRVNPVVJDRV9OT1RfRk9VTkQnLCA0MDQpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dNb2NrKCdlcnJvcicsIGBbTW9ja10gXHU2NTcwXHU2MzZFXHU2RTkwXHU4QkY3XHU2QzQyXHU1OTA0XHU3NDA2XHU5NTE5XHU4QkVGOmAsIGVycm9yKTtcbiAgICBoYW5kbGVFcnJvcihyZXMsIGVycm9yKTtcbiAgfVxufVxuXG4vKipcbiAqIFx1NTkwNFx1NzQwNlx1NjdFNVx1OEJFMlx1NzZGOFx1NTE3M1x1OEJGN1x1NkM0MlxuICovXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVRdWVyeVJlcXVlc3QoXG4gIHBhdGg6IHN0cmluZywgXG4gIG1ldGhvZDogc3RyaW5nLCBcbiAgYm9keTogYW55LCBcbiAgcmVzOiBodHRwLlNlcnZlclJlc3BvbnNlXG4pIHtcbiAgdHJ5IHtcbiAgICBsb2dNb2NrKCdpbmZvJywgYFtNb2NrXSBcdTU5MDRcdTc0MDZcdTY3RTVcdThCRTJcdThCRjdcdTZDNDI6ICR7bWV0aG9kfSAke3BhdGh9YCk7XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gICAgY29uc3Qgc2luZ2xlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9xdWVyaWVzXFwvKFteXFwvXSspJC8pO1xuICAgIGlmIChzaW5nbGVNYXRjaCAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICBjb25zdCBpZCA9IHNpbmdsZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMjogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5xdWVyeS5nZXRRdWVyeShpZCk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgIGlmIChwYXRoLm1hdGNoKC9cXC9hcGlcXC9xdWVyaWVzXFwvPyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4YCk7XG4gICAgICBcbiAgICAgIC8vIFx1ODlFM1x1Njc5MFx1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MFxuICAgICAgY29uc3QgdXJsT2JqID0gbmV3IFVSTChgaHR0cDovL2xvY2FsaG9zdCR7cGF0aH1gKTtcbiAgICAgIGNvbnN0IHBhZ2UgPSBwYXJzZUludCh1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgncGFnZScpIHx8ICcxJywgMTApO1xuICAgICAgY29uc3Qgc2l6ZSA9IHBhcnNlSW50KHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCdzaXplJykgfHwgJzEwJywgMTApO1xuICAgICAgXG4gICAgICBjb25zdCBwYXJhbXMgPSB7IHBhZ2UsIHNpemUgfTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMucXVlcnkuZ2V0UXVlcmllcyhwYXJhbXMpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgICBpZiAocGF0aC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllc1xcLz8kLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTI6YCwgYm9keSk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMucXVlcnkuY3JlYXRlUXVlcnkoYm9keSk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMSwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHVwZGF0ZU1hdGNoID0gcGF0aC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAodXBkYXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgICAgY29uc3QgaWQgPSB1cGRhdGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTI6ICR7aWR9YCwgYm9keSk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMucXVlcnkudXBkYXRlUXVlcnkoaWQsIGJvZHkpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICBjb25zdCBkZWxldGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKGRlbGV0ZU1hdGNoICYmIG1ldGhvZCA9PT0gJ0RFTEVURScpIHtcbiAgICAgIGNvbnN0IGlkID0gZGVsZXRlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyOiAke2lkfWApO1xuICAgICAgXG4gICAgICBhd2FpdCBzZXJ2aWNlcy5xdWVyeS5kZWxldGVRdWVyeShpZCk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSwgaWQgfSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICBjb25zdCBleGVjdXRlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9xdWVyaWVzXFwvKFteXFwvXSspXFwvZXhlY3V0ZSQvKTtcbiAgICBpZiAoZXhlY3V0ZU1hdGNoICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICBjb25zdCBpZCA9IGV4ZWN1dGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTI6ICR7aWR9YCwgYm9keSk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMucXVlcnkuZXhlY3V0ZVF1ZXJ5KGlkLCBib2R5KTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1OTgyXHU2NzlDXHU2Q0ExXHU2NzA5XHU1MzM5XHU5MTREXHU3Njg0XHU4REVGXHU3NTMxXHVGRjBDXHU4RkQ0XHU1NkRFNDA0XG4gICAgbG9nTW9jaygnd2FybicsIGBbTW9ja10gXHU2NzJBXHU3N0U1XHU3Njg0XHU2N0U1XHU4QkUyQVBJOiAke21ldGhvZH0gJHtwYXRofWApO1xuICAgIHNlbmRKc29uKHJlcywgNDA0LCBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSgnTm90IEZvdW5kJywgJ1JFU09VUkNFX05PVF9GT1VORCcsIDQwNCkpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZ01vY2soJ2Vycm9yJywgYFtNb2NrXSBcdTY3RTVcdThCRTJcdThCRjdcdTZDNDJcdTU5MDRcdTc0MDZcdTk1MTlcdThCRUY6YCwgZXJyb3IpO1xuICAgIGhhbmRsZUVycm9yKHJlcywgZXJyb3IpO1xuICB9XG59XG5cbi8qKlxuICogXHU2M0QwXHU1M0Q2XHU1NDhDXHU4OUUzXHU2NzkwXHU4QkY3XHU2QzQyXHU0RjUzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlUmVxdWVzdEJvZHkocmVxOiBDb25uZWN0LkluY29taW5nTWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IGNodW5rczogQnVmZmVyW10gPSBbXTtcbiAgICBcbiAgICByZXEub24oJ2RhdGEnLCAoY2h1bms6IEJ1ZmZlcikgPT4gY2h1bmtzLnB1c2goY2h1bmspKTtcbiAgICBcbiAgICByZXEub24oJ2VuZCcsICgpID0+IHtcbiAgICAgIGlmIChjaHVua3MubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzb2x2ZSh7fSk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGJvZHlTdHIgPSBCdWZmZXIuY29uY2F0KGNodW5rcykudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3QgYm9keSA9IGJvZHlTdHIgJiYgYm9keVN0ci50cmltKCkgPyBKU09OLnBhcnNlKGJvZHlTdHIpIDoge307XG4gICAgICAgIHJldHVybiByZXNvbHZlKGJvZHkpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nTW9jaygnd2FybicsIGBbTW9ja10gXHU4QkY3XHU2QzQyXHU0RjUzXHU4OUUzXHU2NzkwXHU1OTMxXHU4RDI1OmAsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoe30pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBcdTUzRDFcdTkwMDFKU09OXHU1NENEXHU1RTk0XG4gKi9cbmZ1bmN0aW9uIHNlbmRKc29uKHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSwgc3RhdHVzQ29kZTogbnVtYmVyLCBkYXRhOiBhbnkpOiB2b2lkIHtcbiAgcmVzLnN0YXR1c0NvZGUgPSBzdGF0dXNDb2RlO1xuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIE9QVElPTlMnKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycycsICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24sIFgtTW9jay1FbmFibGVkJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ1gtUG93ZXJlZC1CeScsICdEYXRhU2NvcGUtTW9jaycpO1xuICBcbiAgLy8gXHU2REZCXHU1MkEwTW9ja1x1NjgwN1x1OEJCMFxuICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmIGRhdGEgIT09IG51bGwpIHtcbiAgICBkYXRhLm1vY2tSZXNwb25zZSA9IHRydWU7XG4gIH1cbiAgXG4gIGNvbnN0IHJlc3BvbnNlRGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICByZXMuZW5kKHJlc3BvbnNlRGF0YSk7XG4gIFxuICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU1M0QxXHU5MDAxXHU1NENEXHU1RTk0OiBbJHtzdGF0dXNDb2RlfV0gJHtyZXNwb25zZURhdGEuc2xpY2UoMCwgMjAwKX0ke3Jlc3BvbnNlRGF0YS5sZW5ndGggPiAyMDAgPyAnLi4uJyA6ICcnfWApO1xufVxuXG4vKipcbiAqIFx1NTkwNFx1NzQwNlx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICovXG5mdW5jdGlvbiBoYW5kbGVFcnJvcihyZXM6IGh0dHAuU2VydmVyUmVzcG9uc2UsIGVycm9yOiBhbnksIHN0YXR1c0NvZGUgPSA1MDApOiB2b2lkIHtcbiAgY29uc3QgbWVzc2FnZSA9IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKTtcbiAgY29uc3QgY29kZSA9IChlcnJvciBhcyBhbnkpLmNvZGUgfHwgJ0lOVEVSTkFMX0VSUk9SJztcbiAgXG4gIGxvZ01vY2soJ2Vycm9yJywgYFtNb2NrXSBcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTQ6ICR7c3RhdHVzQ29kZX0gJHtjb2RlfSAke21lc3NhZ2V9YCk7XG4gIFxuICBjb25zdCBlcnJvclJlc3BvbnNlID0gY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UobWVzc2FnZSwgY29kZSwgc3RhdHVzQ29kZSk7XG4gIHNlbmRKc29uKHJlcywgc3RhdHVzQ29kZSwgZXJyb3JSZXNwb25zZSk7XG59XG5cbi8qKlxuICogXHU1OTA0XHU3NDA2T1BUSU9OU1x1OEJGN1x1NkM0Mlx1RkYwOENPUlNcdTk4ODRcdTY4QzBcdUZGMDlcbiAqL1xuZnVuY3Rpb24gaGFuZGxlT3B0aW9uc1JlcXVlc3QocmVzOiBodHRwLlNlcnZlclJlc3BvbnNlKTogdm9pZCB7XG4gIHJlcy5zdGF0dXNDb2RlID0gMjA0O1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIE9QVElPTlMnKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycycsICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24sIFgtTW9jay1FbmFibGVkJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLU1heC1BZ2UnLCAnODY0MDAnKTsgLy8gMjRcdTVDMEZcdTY1RjZcbiAgcmVzLmVuZCgpO1xuICBcbiAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NTkwNFx1NzQwNk9QVElPTlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDJgKTtcbn1cblxuLyoqXG4gKiBcdTZERkJcdTUyQTBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gYWRkRGVsYXkoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHsgZGVsYXkgfSA9IG1vY2tDb25maWc7XG4gIFxuICBsZXQgZGVsYXlNcyA9IDA7XG4gIGlmICh0eXBlb2YgZGVsYXkgPT09ICdudW1iZXInICYmIGRlbGF5ID4gMCkge1xuICAgIGRlbGF5TXMgPSBkZWxheTtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU2REZCXHU1MkEwXHU1NkZBXHU1QjlBXHU1RUY2XHU4RkRGOiAke2RlbGF5TXN9bXNgKTtcbiAgfSBlbHNlIGlmIChkZWxheSAmJiB0eXBlb2YgZGVsYXkgPT09ICdvYmplY3QnKSB7XG4gICAgY29uc3QgeyBtaW4sIG1heCB9ID0gZGVsYXk7XG4gICAgZGVsYXlNcyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG4gICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NkRGQlx1NTJBMFx1OTY4Rlx1NjczQVx1NUVGNlx1OEZERjogJHtkZWxheU1zfW1zIChcdTgzMDNcdTU2RjQ6ICR7bWlufS0ke21heH1tcylgKTtcbiAgfVxuICBcbiAgaWYgKGRlbGF5TXMgPiAwKSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5TXMpKTtcbiAgfVxufSAiXSwKICAibWFwcGluZ3MiOiAiO0FBQTBZLFNBQVMsY0FBYyxlQUFlO0FBQ2hiLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsU0FBUyxnQkFBZ0I7QUFDekIsT0FBTyxp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
