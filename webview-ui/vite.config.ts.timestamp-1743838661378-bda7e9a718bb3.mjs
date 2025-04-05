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
      // 完全禁用HMR以解决变量重复声明问题
      hmr: false,
      // 配置代理
      proxy: {
        // 将API请求转发到后端服务
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false,
          bypass: (req) => {
            var _a;
            if (useMockApi && ((_a = req.url) == null ? void 0 : _a.startsWith("/api/"))) {
              return null;
            }
          }
        }
      },
      // 配置中间件
      middlewareMode: false,
      // 使用Mock中间件拦截API请求
      configureServer: useMockApi ? (server) => {
        console.log("[Vite\u914D\u7F6E] \u6DFB\u52A0Mock\u4E2D\u95F4\u4EF6\uFF0C\u4EC5\u7528\u4E8E\u5904\u7406API\u8BF7\u6C42");
        server.middlewares.use((req, res, next) => {
          var _a;
          if (!((_a = req.url) == null ? void 0 : _a.startsWith("/api/"))) {
            return next();
          }
          createMockMiddleware()(req, res, next);
        });
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
    cacheDir: "node_modules/.vite_cache",
    optimizeDeps: {
      exclude: ["src/plugins/serverMock.ts"]
      // 排除serverMock，避免它被加载
    },
    // 完全禁用注入客户端代码，解决变量重复声明问题
    // 这意味着HMR将不可用，但至少应用能正常工作
    define: {
      // 禁用注入客户端 
      __VUE_HMR_RUNTIME__: JSON.stringify({}),
      // 确保不会有额外的HMR客户端代码被注入
      "process.env.__VUE_HMR_RUNTIME__": JSON.stringify({})
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svY29uZmlnLnRzIiwgInNyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzIiwgInNyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuXG4vLyBcdTVGM0FcdTUyMzZcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTNcdTUxRkRcdTY1NzBcbmZ1bmN0aW9uIGtpbGxQb3J0KHBvcnQ6IG51bWJlcikge1xuICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjhDMFx1NjdFNVx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NTM2MFx1NzUyOFx1NjBDNVx1NTFCNWApO1xuICB0cnkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBleGVjU3luYyhgbmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fWApO1xuICAgICAgZXhlY1N5bmMoYHRhc2traWxsIC9GIC9waWQgJChuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9IHwgYXdrICd7cHJpbnQgJDV9JylgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4ZWNTeW5jKGBsc29mIC1pIDoke3BvcnR9IC10IHwgeGFyZ3Mga2lsbCAtOWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTMgJHtwb3J0fWApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTY3MkFcdTg4QUJcdTUzNjBcdTc1MjhcdTYyMTZcdTY1RTBcdTZDRDVcdTkxQ0FcdTY1M0VgKTtcbiAgfVxufVxuXG4vLyBcdTVDMURcdThCRDVcdTkxQ0FcdTY1M0VcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTdBRUZcdTUzRTNcbmtpbGxQb3J0KDgwODApO1xuXG4vLyBcdTU3RkFcdTY3MkNcdTkxNERcdTdGNkVcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHU1MkEwXHU4RjdEXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9jayBBUElcbiAgY29uc3QgdXNlTW9ja0FwaSA9IGVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU3OTgxXHU3NTI4SE1SXG4gIGNvbnN0IGRpc2FibGVIbXIgPSBlbnYuVklURV9ESVNBQkxFX0hNUiA9PT0gJ3RydWUnO1xuICBcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdThGRDBcdTg4NENcdTZBMjFcdTVGMEY6ICR7bW9kZX1gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBNb2NrIEFQSTogJHt1c2VNb2NrQXBpID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgIF0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICAvLyBcdTVCOENcdTUxNjhcdTc5ODFcdTc1MjhITVJcdTRFRTVcdTg5RTNcdTUxQjNcdTUzRDhcdTkxQ0ZcdTkxQ0RcdTU5MERcdTU4RjBcdTY2MEVcdTk1RUVcdTk4OThcbiAgICAgIGhtcjogZmFsc2UsIFxuICAgICAgLy8gXHU5MTREXHU3RjZFXHU0RUUzXHU3NDA2XG4gICAgICBwcm94eToge1xuICAgICAgICAvLyBcdTVDMDZBUElcdThCRjdcdTZDNDJcdThGNkNcdTUzRDFcdTUyMzBcdTU0MEVcdTdBRUZcdTY3MERcdTUyQTFcbiAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgICBieXBhc3M6IChyZXEpID0+IHtcbiAgICAgICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NTQyRlx1NzUyOFx1NEU4Nk1vY2sgQVBJXHVGRjBDXHU1MjE5XHU0RTBEXHU0RUUzXHU3NDA2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgICAgICBpZiAodXNlTW9ja0FwaSAmJiByZXEudXJsPy5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAvLyBcdTkxNERcdTdGNkVcdTRFMkRcdTk1RjRcdTRFRjZcbiAgICAgIG1pZGRsZXdhcmVNb2RlOiBmYWxzZSxcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDJcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcjogdXNlTW9ja0FwaSBcbiAgICAgICAgPyAoc2VydmVyKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW1ZpdGVcdTkxNERcdTdGNkVdIFx1NkRGQlx1NTJBME1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTRFQzVcdTc1MjhcdTRFOEVcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDInKTtcbiAgICAgICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgICAgICAgIC8vIFx1NTNFQVx1NjJFNlx1NjIyQUFQSVx1OEJGN1x1NkM0Mlx1RkYwQ1x1NTE3Nlx1NEVENlx1OEJGN1x1NkM0Mlx1NzZGNFx1NjNBNVx1NjUzRVx1ODg0Q1xuICAgICAgICAgICAgICBpZiAoIXJlcS51cmw/LnN0YXJ0c1dpdGgoJy9hcGkvJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NjIxMVx1NEVFQ1x1NzY4NFx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNkFQSVx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgICBjcmVhdGVNb2NrTWlkZGxld2FyZSgpKHJlcSwgcmVzLCBuZXh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gXG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZSwgbm8tc3RvcmUsIG11c3QtcmV2YWxpZGF0ZScsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIGxlc3M6IHtcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICAgIHRhcmdldDogJ2VzMjAxNScsXG4gICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICAvLyBcdTZFMDVcdTk2NjRjb25zb2xlXHU1NDhDZGVidWdnZXJcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2FjaGVEaXI6ICdub2RlX21vZHVsZXMvLnZpdGVfY2FjaGUnLFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZXhjbHVkZTogWydzcmMvcGx1Z2lucy9zZXJ2ZXJNb2NrLnRzJ10sIC8vIFx1NjM5Mlx1OTY2NHNlcnZlck1vY2tcdUZGMENcdTkwN0ZcdTUxNERcdTVCODNcdTg4QUJcdTUyQTBcdThGN0RcbiAgICB9LFxuICAgIC8vIFx1NUI4Q1x1NTE2OFx1Nzk4MVx1NzUyOFx1NkNFOFx1NTE2NVx1NUJBMlx1NjIzN1x1N0FFRlx1NEVFM1x1NzgwMVx1RkYwQ1x1ODlFM1x1NTFCM1x1NTNEOFx1OTFDRlx1OTFDRFx1NTkwRFx1NThGMFx1NjYwRVx1OTVFRVx1OTg5OFxuICAgIC8vIFx1OEZEOVx1NjEwRlx1NTQ3M1x1Nzc0MEhNUlx1NUMwNlx1NEUwRFx1NTNFRlx1NzUyOFx1RkYwQ1x1NEY0Nlx1ODFGM1x1NUMxMVx1NUU5NFx1NzUyOFx1ODBGRFx1NkI2M1x1NUUzOFx1NURFNVx1NEY1Q1xuICAgIGRlZmluZToge1xuICAgICAgLy8gXHU3OTgxXHU3NTI4XHU2Q0U4XHU1MTY1XHU1QkEyXHU2MjM3XHU3QUVGIFxuICAgICAgX19WVUVfSE1SX1JVTlRJTUVfXzogSlNPTi5zdHJpbmdpZnkoe30pLFxuICAgICAgLy8gXHU3ODZFXHU0RkREXHU0RTBEXHU0RjFBXHU2NzA5XHU5ODlEXHU1OTE2XHU3Njg0SE1SXHU1QkEyXHU2MjM3XHU3QUVGXHU0RUUzXHU3ODAxXHU4OEFCXHU2Q0U4XHU1MTY1XG4gICAgICAncHJvY2Vzcy5lbnYuX19WVUVfSE1SX1JVTlRJTUVfXyc6IEpTT04uc3RyaW5naWZ5KHt9KSxcbiAgICB9LFxuICB9XG59KSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjsvKipcbiAqIFx1NkEyMVx1NjJERlx1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVxuICogXHU5NkM2XHU0RTJEXHU3QkExXHU3NDA2XHU2MjQwXHU2NzA5XHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHU3NkY4XHU1MTczXHU3Njg0XHU5MTREXHU3RjZFXHVGRjBDXHU0RjVDXHU0RTNBXHU1MzU1XHU0RTAwXHU3NzFGXHU3NkY4XHU2NzY1XHU2RTkwXG4gKi9cblxuLy8gXHU2OEMwXHU2N0U1XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU1NDhDXHU1MTY4XHU1QzQwXHU4QkJFXHU3RjZFXG5jb25zdCBpc0VuYWJsZWQgPSAoKSA9PiB7XG4gIC8vIFx1NjhDMFx1NjdFNVx1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1RkYwOFx1OEZEMFx1ODg0Q1x1NjVGNlx1RkYwOVxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGlmICgod2luZG93IGFzIGFueSkuX19VU0VfTU9DS19BUEkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCh3aW5kb3cgYXMgYW55KS5fX0FQSV9NT0NLX0RJU0FCTEVEID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFx1NjhDMFx1NjdFNVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1RkYwOFx1N0YxNlx1OEJEMVx1NjVGNlx1RkYwOVxuICAvLyBcdTU5ODJcdTY3OUNcdTY2MEVcdTc4NkVcdThCQkVcdTdGNkVcdTRFM0FmYWxzZVx1RkYwQ1x1NTIxOVx1Nzk4MVx1NzUyOFxuICBpZiAoaW1wb3J0Lm1ldGE/LmVudj8uVklURV9VU0VfTU9DS19BUEkgPT09IFwiZmFsc2VcIikgcmV0dXJuIGZhbHNlO1xuICBcbiAgLy8gXHU1OTgyXHU2NzlDXHU2NjBFXHU3ODZFXHU4QkJFXHU3RjZFXHU0RTNBdHJ1ZVx1RkYwQ1x1NTIxOVx1NTQyRlx1NzUyOFxuICBpZiAoaW1wb3J0Lm1ldGE/LmVudj8uVklURV9VU0VfTU9DS19BUEkgPT09IFwidHJ1ZVwiKSByZXR1cm4gdHJ1ZTtcbiAgXG4gIC8vIFx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NEUwQlx1OUVEOFx1OEJBNFx1NTQyRlx1NzUyOFx1RkYwQ1x1NTE3Nlx1NEVENlx1NzNBRlx1NTg4M1x1OUVEOFx1OEJBNFx1Nzk4MVx1NzUyOFxuICBjb25zdCBpc0RldmVsb3BtZW50ID0gaW1wb3J0Lm1ldGE/LmVudj8uTU9ERSA9PT0gXCJkZXZlbG9wbWVudFwiO1xuICBcbiAgLy8gXHU1RjNBXHU1MjM2XHU1RjAwXHU1NDJGTW9ja1x1NjcwRFx1NTJBMVx1NzUyOFx1NEU4RVx1NkQ0Qlx1OEJENVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIFx1NUI5QVx1NEU0OVx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQlx1N0M3Qlx1NTc4QlxuZXhwb3J0IHR5cGUgTG9nTGV2ZWwgPSAnbm9uZScgfCAnZXJyb3InIHwgJ3dhcm4nIHwgJ2luZm8nIHwgJ2RlYnVnJztcblxuZXhwb3J0IGNvbnN0IG1vY2tDb25maWcgPSB7XG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOFx1NkEyMVx1NjJERlx1NjcwRFx1NTJBMVx1RkYwOFx1NTUyRlx1NEUwMFx1NUYwMFx1NTE3M1x1RkYwOVxuICBlbmFibGVkOiBpc0VuYWJsZWQoKSxcbiAgXG4gIC8vIFx1OEJGN1x1NkM0Mlx1NUVGNlx1OEZERlx1OTE0RFx1N0Y2RVx1RkYwOFx1NkJFQlx1NzlEMlx1RkYwOVxuICBkZWxheToge1xuICAgIG1pbjogMTAwLFxuICAgIG1heDogMzAwXG4gIH0sXG4gIFxuICAvLyBcdThCRjdcdTZDNDJcdTU5MDRcdTc0MDZcdTkxNERcdTdGNkVcbiAgYXBpOiB7XG4gICAgLy8gXHU1N0ZBXHU3ODQwVVJMXG4gICAgYmFzZVVybDogXCJodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpXCIsXG4gICAgXG4gICAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XHU4MUVBXHU1MkE4XHU2QTIxXHU2MkRGXHVGRjA4XHU1RjUzXHU1NDBFXHU3QUVGXHU2NzBEXHU1MkExXHU0RTBEXHU1M0VGXHU3NTI4XHU2NUY2XHU4MUVBXHU1MkE4XHU1MjA3XHU2MzYyXHU1MjMwXHU2QTIxXHU2MkRGXHU2QTIxXHU1RjBGXHVGRjA5XG4gICAgYXV0b01vY2s6IHRydWVcbiAgfSxcbiAgXG4gIC8vIFx1NkEyMVx1NTc1N1x1NTQyRlx1NzUyOFx1OTE0RFx1N0Y2RVxuICBtb2R1bGVzOiB7XG4gICAgZGF0YXNvdXJjZTogdHJ1ZSxcbiAgICBxdWVyeTogdHJ1ZSxcbiAgICBpbnRlZ3JhdGlvbjogdHJ1ZSxcbiAgICB2ZXJzaW9uOiB0cnVlLFxuICAgIG1ldGFkYXRhOiB0cnVlXG4gIH0sXG4gIFxuICAvLyBcdTY1RTVcdTVGRDdcdTkxNERcdTdGNkVcbiAgbG9nZ2luZzoge1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgbGV2ZWw6IFwiZGVidWdcIiAvLyBkZWJ1ZywgaW5mbywgd2FybiwgZXJyb3IsIG5vbmVcbiAgfSxcbiAgXG4gIC8vIFx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQiAtIFx1NEZCRlx1NEU4RVx1NzZGNFx1NjNBNVx1OEJCRlx1OTVFRVxuICBnZXQgbG9nTGV2ZWwoKTogTG9nTGV2ZWwge1xuICAgIHJldHVybiB0aGlzLmxvZ2dpbmcuZW5hYmxlZCA/ICh0aGlzLmxvZ2dpbmcubGV2ZWwgYXMgTG9nTGV2ZWwpIDogJ25vbmUnO1xuICB9XG59O1xuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NkEyMVx1NjJERlx1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNNb2NrRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgLy8gXHU3ODZFXHU0RkREXHU4RkQ0XHU1NkRFdHJ1ZVx1NEVFNVx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgcmV0dXJuIG1vY2tDb25maWcuZW5hYmxlZDtcbn1cblxuLyoqXG4gKiBcdTY4QzBcdTY3RTVcdTcyNzlcdTVCOUFcdTZBMjFcdTU3NTdcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhcdTZBMjFcdTYyREZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTW9kdWxlRW5hYmxlZChtb2R1bGVOYW1lOiBrZXlvZiB0eXBlb2YgbW9ja0NvbmZpZy5tb2R1bGVzKTogYm9vbGVhbiB7XG4gIHJldHVybiBtb2NrQ29uZmlnLmVuYWJsZWQgJiYgbW9ja0NvbmZpZy5tb2R1bGVzW21vZHVsZU5hbWVdO1xufVxuXG4vKipcbiAqIFx1OEJCMFx1NUY1NVx1NkEyMVx1NjJERlx1NjcwRFx1NTJBMVx1NzZGOFx1NTE3M1x1NjVFNVx1NUZEN1xuICovXG5leHBvcnQgZnVuY3Rpb24gbG9nTW9jayhsZXZlbDogTG9nTGV2ZWwsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgY29uc3QgY29uZmlnTGV2ZWwgPSBtb2NrQ29uZmlnLmxvZ0xldmVsO1xuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCXHU0RjE4XHU1MTQ4XHU3RUE3OiBub25lIDwgZXJyb3IgPCB3YXJuIDwgaW5mbyA8IGRlYnVnXG4gIGNvbnN0IGxldmVsczogUmVjb3JkPExvZ0xldmVsLCBudW1iZXI+ID0ge1xuICAgICdub25lJzogMCxcbiAgICAnZXJyb3InOiAxLFxuICAgICd3YXJuJzogMixcbiAgICAnaW5mbyc6IDMsXG4gICAgJ2RlYnVnJzogNFxuICB9O1xuICBcbiAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1RTk0XHU4QkIwXHU1RjU1XHU2QjY0XHU3RUE3XHU1MjJCXHU3Njg0XHU2NUU1XHU1RkQ3XG4gIGlmIChsZXZlbHNbY29uZmlnTGV2ZWxdID49IGxldmVsc1tsZXZlbF0pIHtcbiAgICBjb25zdCBwcmVmaXggPSBgW01vY2sgJHtsZXZlbC50b1VwcGVyQ2FzZSgpfV1gO1xuICAgIFxuICAgIHN3aXRjaCAobGV2ZWwpIHtcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgY29uc29sZS5lcnJvcihwcmVmaXgsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dhcm4nOlxuICAgICAgICBjb25zb2xlLndhcm4ocHJlZml4LCBtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgY29uc29sZS5pbmZvKHByZWZpeCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGVidWcnOlxuICAgICAgICBjb25zb2xlLmRlYnVnKHByZWZpeCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NUY1M1x1NTI0RE1vY2tcdTkxNERcdTdGNkVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1vY2tDb25maWcoKSB7XG4gIHJldHVybiB7IC4uLm1vY2tDb25maWcgfTtcbn1cblxuLyoqXG4gKiBcdTVGM0FcdTUyMzZcdTYyNTNcdTUzNzBcdTVGNTNcdTUyNERcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDFcdUZGMENcdTY1QjlcdTRGQkZcdThDMDNcdThCRDVcbiAqL1xuY29uc29sZS5pbmZvKCdbTW9ja1x1OTE0RFx1N0Y2RV0gTW9ja1x1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMTonLCBtb2NrQ29uZmlnLmVuYWJsZWQgPyAnXHU1REYyXHU1NDJGXHU3NTI4JyA6ICdcdTVERjJcdTc5ODFcdTc1MjgnKTtcbmNvbnNvbGUuaW5mbygnW01vY2tcdTkxNERcdTdGNkVdIEFQSVx1NTdGQVx1Nzg0MFVSTDonLCBtb2NrQ29uZmlnLmFwaS5iYXNlVXJsKTtcbmNvbnNvbGUuaW5mbygnW01vY2tcdTkxNERcdTdGNkVdIFx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQjonLCBtb2NrQ29uZmlnLmxvZ0xldmVsKTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHNcIjsvKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5MFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY1NzBcdTYzNkVcdTZFOTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdUZGMENcdTc1MjhcdTRFOEVcdTVGMDBcdTUzRDFcdTU0OENcdTZENEJcdThCRDVcbiAqL1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTdDN0JcdTU3OEJcbmV4cG9ydCB0eXBlIERhdGFTb3VyY2VUeXBlID0gJ215c3FsJyB8ICdwb3N0Z3Jlc3FsJyB8ICdvcmFjbGUnIHwgJ3NxbHNlcnZlcicgfCAnc3FsaXRlJztcblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU3MkI2XHU2MDAxXG5leHBvcnQgdHlwZSBEYXRhU291cmNlU3RhdHVzID0gJ2FjdGl2ZScgfCAnaW5hY3RpdmUnIHwgJ2Vycm9yJyB8ICdwZW5kaW5nJztcblxuLy8gXHU1NDBDXHU2QjY1XHU5ODkxXHU3Mzg3XG5leHBvcnQgdHlwZSBTeW5jRnJlcXVlbmN5ID0gJ21hbnVhbCcgfCAnaG91cmx5JyB8ICdkYWlseScgfCAnd2Vla2x5JyB8ICdtb250aGx5JztcblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU2M0E1XHU1M0UzXG5leHBvcnQgaW50ZXJmYWNlIERhdGFTb3VyY2Uge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICB0eXBlOiBEYXRhU291cmNlVHlwZTtcbiAgaG9zdD86IHN0cmluZztcbiAgcG9ydD86IG51bWJlcjtcbiAgZGF0YWJhc2VOYW1lPzogc3RyaW5nO1xuICB1c2VybmFtZT86IHN0cmluZztcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gIHN0YXR1czogRGF0YVNvdXJjZVN0YXR1cztcbiAgc3luY0ZyZXF1ZW5jeT86IFN5bmNGcmVxdWVuY3k7XG4gIGxhc3RTeW5jVGltZT86IHN0cmluZyB8IG51bGw7XG4gIGNyZWF0ZWRBdDogc3RyaW5nO1xuICB1cGRhdGVkQXQ6IHN0cmluZztcbiAgaXNBY3RpdmU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKi9cbmV4cG9ydCBjb25zdCBtb2NrRGF0YVNvdXJjZXM6IERhdGFTb3VyY2VbXSA9IFtcbiAge1xuICAgIGlkOiAnZHMtMScsXG4gICAgbmFtZTogJ015U1FMXHU3OTNBXHU0RjhCXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4Qk15U1FMXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnbXlzcWwnLFxuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHBvcnQ6IDMzMDYsXG4gICAgZGF0YWJhc2VOYW1lOiAnZXhhbXBsZV9kYicsXG4gICAgdXNlcm5hbWU6ICd1c2VyJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdkYWlseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMicsXG4gICAgbmFtZTogJ1Bvc3RncmVTUUxcdTc1MUZcdTRFQTdcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ3Bvc3RncmVzcWwnLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMTAwJyxcbiAgICBwb3J0OiA1NDMyLFxuICAgIGRhdGFiYXNlTmFtZTogJ3Byb2R1Y3Rpb25fZGInLFxuICAgIHVzZXJuYW1lOiAnYWRtaW4nLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2hvdXJseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzYwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA3Nzc2MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0zJyxcbiAgICBuYW1lOiAnU1FMaXRlXHU2NzJDXHU1NzMwXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NjcyQ1x1NTczMFNRTGl0ZVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ3NxbGl0ZScsXG4gICAgZGF0YWJhc2VOYW1lOiAnL3BhdGgvdG8vbG9jYWwuZGInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzQ1NjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTQnLFxuICAgIG5hbWU6ICdTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFNRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTczQUZcdTU4ODMnLFxuICAgIHR5cGU6ICdzcWxzZXJ2ZXInLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMjAwJyxcbiAgICBwb3J0OiAxNDMzLFxuICAgIGRhdGFiYXNlTmFtZTogJ3Rlc3RfZGInLFxuICAgIHVzZXJuYW1lOiAndGVzdGVyJyxcbiAgICBzdGF0dXM6ICdpbmFjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ3dlZWtseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNjA0ODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDUxODQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMjU5MjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogZmFsc2VcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtNScsXG4gICAgbmFtZTogJ09yYWNsZVx1NEYwMVx1NEUxQVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBPcmFjbGVcdTRGMDFcdTRFMUFcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdvcmFjbGUnLFxuICAgIGhvc3Q6ICcxOTIuMTY4LjEuMTUwJyxcbiAgICBwb3J0OiAxNTIxLFxuICAgIGRhdGFiYXNlTmFtZTogJ2VudGVycHJpc2VfZGInLFxuICAgIHVzZXJuYW1lOiAnc3lzdGVtJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdkYWlseScsXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDEwMzY4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfVxuXTtcblxuLyoqXG4gKiBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBjb3VudCBcdTc1MUZcdTYyMTBcdTY1NzBcdTkxQ0ZcbiAqIEByZXR1cm5zIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1N0VDNFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVNb2NrRGF0YVNvdXJjZXMoY291bnQ6IG51bWJlciA9IDUpOiBEYXRhU291cmNlW10ge1xuICBjb25zdCB0eXBlczogRGF0YVNvdXJjZVR5cGVbXSA9IFsnbXlzcWwnLCAncG9zdGdyZXNxbCcsICdvcmFjbGUnLCAnc3Fsc2VydmVyJywgJ3NxbGl0ZSddO1xuICBjb25zdCBzdGF0dXNlczogRGF0YVNvdXJjZVN0YXR1c1tdID0gWydhY3RpdmUnLCAnaW5hY3RpdmUnLCAnZXJyb3InLCAncGVuZGluZyddO1xuICBjb25zdCBzeW5jRnJlcXM6IFN5bmNGcmVxdWVuY3lbXSA9IFsnbWFudWFsJywgJ2hvdXJseScsICdkYWlseScsICd3ZWVrbHknLCAnbW9udGhseSddO1xuICBcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVzW2kgJSB0eXBlcy5sZW5ndGhdO1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBgZHMtZ2VuLSR7aSArIDF9YCxcbiAgICAgIG5hbWU6IGBcdTc1MUZcdTYyMTBcdTc2ODQke3R5cGV9XHU2NTcwXHU2MzZFXHU2RTkwICR7aSArIDF9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU3Njg0JHt0eXBlfVx1N0M3Qlx1NTc4Qlx1NjU3MFx1NjM2RVx1NkU5MCAke2kgKyAxfWAsXG4gICAgICB0eXBlLFxuICAgICAgaG9zdDogdHlwZSAhPT0gJ3NxbGl0ZScgPyAnbG9jYWxob3N0JyA6IHVuZGVmaW5lZCxcbiAgICAgIHBvcnQ6IHR5cGUgIT09ICdzcWxpdGUnID8gKDMzMDYgKyBpKSA6IHVuZGVmaW5lZCxcbiAgICAgIGRhdGFiYXNlTmFtZTogdHlwZSA9PT0gJ3NxbGl0ZScgPyBgL3BhdGgvdG8vZGJfJHtpfS5kYmAgOiBgZXhhbXBsZV9kYl8ke2l9YCxcbiAgICAgIHVzZXJuYW1lOiB0eXBlICE9PSAnc3FsaXRlJyA/IGB1c2VyXyR7aX1gIDogdW5kZWZpbmVkLFxuICAgICAgc3RhdHVzOiBzdGF0dXNlc1tpICUgc3RhdHVzZXMubGVuZ3RoXSxcbiAgICAgIHN5bmNGcmVxdWVuY3k6IHN5bmNGcmVxc1tpICUgc3luY0ZyZXFzLmxlbmd0aF0sXG4gICAgICBsYXN0U3luY1RpbWU6IGkgJSAzID09PSAwID8gbnVsbCA6IG5ldyBEYXRlKG5vdyAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUobm93IC0gKGkgKyAxMCkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUobm93IC0gaSAqIDQzMjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgaXNBY3RpdmU6IGkgJSA0ICE9PSAwXG4gICAgfTtcbiAgfSk7XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1OUVEOFx1OEJBNFx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuZXhwb3J0IGRlZmF1bHQgbW9ja0RhdGFTb3VyY2VzOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2RhdGFzb3VyY2UudHNcIjsvKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5ME1vY2tcdTY3MERcdTUyQTFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2NTcwXHU2MzZFXHU2RTkwXHU3NkY4XHU1MTczQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU1QjlFXHU3M0IwXG4gKi9cblxuaW1wb3J0IHsgbW9ja0RhdGFTb3VyY2VzIH0gZnJvbSAnLi4vZGF0YS9kYXRhc291cmNlJztcbmltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZSB9IGZyb20gJy4uL2RhdGEvZGF0YXNvdXJjZSc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU0RTM0XHU2NUY2XHU1QjU4XHU1MEE4XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHVGRjBDXHU1MTQxXHU4QkI4XHU2QTIxXHU2MkRGXHU1ODlFXHU1MjIwXHU2NTM5XHU2NENEXHU0RjVDXG5sZXQgZGF0YVNvdXJjZXMgPSBbLi4ubW9ja0RhdGFTb3VyY2VzXTtcblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXkgPSB0eXBlb2YgbW9ja0NvbmZpZy5kZWxheSA9PT0gJ251bWJlcicgPyBtb2NrQ29uZmlnLmRlbGF5IDogMzAwO1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG59XG5cbi8qKlxuICogXHU5MUNEXHU3RjZFXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU2MzZFXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldERhdGFTb3VyY2VzKCk6IHZvaWQge1xuICBkYXRhU291cmNlcyA9IFsuLi5tb2NrRGF0YVNvdXJjZXNdO1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICogQHBhcmFtIHBhcmFtcyBcdTY3RTVcdThCRTJcdTUzQzJcdTY1NzBcbiAqIEByZXR1cm5zIFx1NTIwNlx1OTg3NVx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YVNvdXJjZXMocGFyYW1zPzoge1xuICBwYWdlPzogbnVtYmVyO1xuICBzaXplPzogbnVtYmVyO1xuICBuYW1lPzogc3RyaW5nO1xuICB0eXBlPzogc3RyaW5nO1xuICBzdGF0dXM/OiBzdHJpbmc7XG59KTogUHJvbWlzZTx7XG4gIGl0ZW1zOiBEYXRhU291cmNlW107XG4gIHBhZ2luYXRpb246IHtcbiAgICB0b3RhbDogbnVtYmVyO1xuICAgIHBhZ2U6IG51bWJlcjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgdG90YWxQYWdlczogbnVtYmVyO1xuICB9O1xufT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgY29uc3QgcGFnZSA9IHBhcmFtcz8ucGFnZSB8fCAxO1xuICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICBcbiAgLy8gXHU1RTk0XHU3NTI4XHU4RkM3XHU2RUU0XG4gIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLmRhdGFTb3VyY2VzXTtcbiAgXG4gIC8vIFx1NjMwOVx1NTQwRFx1NzlGMFx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy5uYW1lKSB7XG4gICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IFxuICAgICAgZHMubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgKGRzLmRlc2NyaXB0aW9uICYmIGRzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgKTtcbiAgfVxuICBcbiAgLy8gXHU2MzA5XHU3QzdCXHU1NzhCXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/LnR5cGUpIHtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gZHMudHlwZSA9PT0gcGFyYW1zLnR5cGUpO1xuICB9XG4gIFxuICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IGRzLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gIH1cbiAgXG4gIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHNpemUsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKTtcbiAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICBcbiAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gIHJldHVybiB7XG4gICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgIHBhZ2UsXG4gICAgICBzaXplLFxuICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqIEByZXR1cm5zIFx1NjU3MFx1NjM2RVx1NkU5MFx1OEJFNlx1NjBDNVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YVNvdXJjZShpZDogc3RyaW5nKTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTY3RTVcdTYyN0VcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2VzLmZpbmQoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmICghZGF0YVNvdXJjZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICByZXR1cm4gZGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBkYXRhIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1NjM2RVxuICogQHJldHVybnMgXHU1MjFCXHU1RUZBXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVEYXRhU291cmNlKGRhdGE6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMElEXG4gIGNvbnN0IG5ld0lkID0gYGRzLSR7RGF0ZS5ub3coKX1gO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IG5ld0RhdGFTb3VyY2U6IERhdGFTb3VyY2UgPSB7XG4gICAgaWQ6IG5ld0lkLFxuICAgIG5hbWU6IGRhdGEubmFtZSB8fCAnTmV3IERhdGEgU291cmNlJyxcbiAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICB0eXBlOiBkYXRhLnR5cGUgfHwgJ215c3FsJyxcbiAgICBob3N0OiBkYXRhLmhvc3QsXG4gICAgcG9ydDogZGF0YS5wb3J0LFxuICAgIGRhdGFiYXNlTmFtZTogZGF0YS5kYXRhYmFzZU5hbWUsXG4gICAgdXNlcm5hbWU6IGRhdGEudXNlcm5hbWUsXG4gICAgc3RhdHVzOiBkYXRhLnN0YXR1cyB8fCAncGVuZGluZycsXG4gICAgc3luY0ZyZXF1ZW5jeTogZGF0YS5zeW5jRnJlcXVlbmN5IHx8ICdtYW51YWwnLFxuICAgIGxhc3RTeW5jVGltZTogbnVsbCxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9O1xuICBcbiAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU1MjE3XHU4ODY4XG4gIGRhdGFTb3VyY2VzLnB1c2gobmV3RGF0YVNvdXJjZSk7XG4gIFxuICByZXR1cm4gbmV3RGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICogQHBhcmFtIGRhdGEgXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXG4gKiBAcmV0dXJucyBcdTY2RjRcdTY1QjBcdTU0MEVcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZURhdGFTb3VyY2UoaWQ6IHN0cmluZywgZGF0YTogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2MjdFXHU1MjMwXHU4OTgxXHU2NkY0XHU2NUIwXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXHU3RDIyXHU1RjE1XG4gIGNvbnN0IGluZGV4ID0gZGF0YVNvdXJjZXMuZmluZEluZGV4KGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIC8vIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCB1cGRhdGVkRGF0YVNvdXJjZTogRGF0YVNvdXJjZSA9IHtcbiAgICAuLi5kYXRhU291cmNlc1tpbmRleF0sXG4gICAgLi4uZGF0YSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICB9O1xuICBcbiAgLy8gXHU2NkZGXHU2MzYyXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGRhdGFTb3VyY2VzW2luZGV4XSA9IHVwZGF0ZWREYXRhU291cmNlO1xuICBcbiAgcmV0dXJuIHVwZGF0ZWREYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVEYXRhU291cmNlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjI3RVx1NTIzMFx1ODk4MVx1NTIyMFx1OTY2NFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFx1N0QyMlx1NUYxNVxuICBjb25zdCBpbmRleCA9IGRhdGFTb3VyY2VzLmZpbmRJbmRleChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICAvLyBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgZGF0YVNvdXJjZXMuc3BsaWNlKGluZGV4LCAxKTtcbn1cblxuLyoqXG4gKiBcdTZENEJcdThCRDVcdTY1NzBcdTYzNkVcdTZFOTBcdThGREVcdTYzQTVcbiAqIEBwYXJhbSBwYXJhbXMgXHU4RkRFXHU2M0E1XHU1M0MyXHU2NTcwXG4gKiBAcmV0dXJucyBcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTdFRDNcdTY3OUNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3RDb25uZWN0aW9uKHBhcmFtczogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8e1xuICBzdWNjZXNzOiBib29sZWFuO1xuICBtZXNzYWdlPzogc3RyaW5nO1xuICBkZXRhaWxzPzogYW55O1xufT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU1QjlFXHU5NjQ1XHU0RjdGXHU3NTI4XHU2NUY2XHU1M0VGXHU4MEZEXHU0RjFBXHU2NzA5XHU2NkY0XHU1OTBEXHU2NzQyXHU3Njg0XHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU5MDNCXHU4RjkxXG4gIC8vIFx1OEZEOVx1OTFDQ1x1N0I4MFx1NTM1NVx1NkEyMVx1NjJERlx1NjIxMFx1NTI5Ri9cdTU5MzFcdThEMjVcbiAgY29uc3Qgc3VjY2VzcyA9IE1hdGgucmFuZG9tKCkgPiAwLjI7IC8vIDgwJVx1NjIxMFx1NTI5Rlx1NzM4N1xuICBcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzLFxuICAgIG1lc3NhZ2U6IHN1Y2Nlc3MgPyAnXHU4RkRFXHU2M0E1XHU2MjEwXHU1MjlGJyA6ICdcdThGREVcdTYzQTVcdTU5MzFcdThEMjU6IFx1NjVFMFx1NkNENVx1OEZERVx1NjNBNVx1NTIzMFx1NjU3MFx1NjM2RVx1NUU5M1x1NjcwRFx1NTJBMVx1NTY2OCcsXG4gICAgZGV0YWlsczogc3VjY2VzcyA/IHtcbiAgICAgIHJlc3BvbnNlVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApICsgMTAsXG4gICAgICB2ZXJzaW9uOiAnOC4wLjI4JyxcbiAgICAgIGNvbm5lY3Rpb25JZDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApICsgMTAwMFxuICAgIH0gOiB7XG4gICAgICBlcnJvckNvZGU6ICdDT05ORUNUSU9OX1JFRlVTRUQnLFxuICAgICAgZXJyb3JEZXRhaWxzOiAnXHU2NUUwXHU2Q0Q1XHU1RUZBXHU3QUNCXHU1MjMwXHU2NzBEXHU1MkExXHU1NjY4XHU3Njg0XHU4RkRFXHU2M0E1XHVGRjBDXHU4QkY3XHU2OEMwXHU2N0U1XHU3RjUxXHU3RURDXHU4QkJFXHU3RjZFXHU1NDhDXHU1MUVEXHU2MzZFJ1xuICAgIH1cbiAgfTtcbn1cblxuLy8gXHU1QkZDXHU1MUZBXHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldERhdGFTb3VyY2VzLFxuICBnZXREYXRhU291cmNlLFxuICBjcmVhdGVEYXRhU291cmNlLFxuICB1cGRhdGVEYXRhU291cmNlLFxuICBkZWxldGVEYXRhU291cmNlLFxuICB0ZXN0Q29ubmVjdGlvbixcbiAgcmVzZXREYXRhU291cmNlc1xufTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy91dGlscy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvdXRpbHMudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTkwMUFcdTc1MjhcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU1MjFCXHU1RUZBXHU3RURGXHU0RTAwXHU2ODNDXHU1RjBGXHU1NENEXHU1RTk0XHU3Njg0XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG4gKi9cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTZBMjFcdTYyREZBUElcdTYyMTBcdTUyOUZcdTU0Q0RcdTVFOTRcbiAqIEBwYXJhbSBkYXRhIFx1NTRDRFx1NUU5NFx1NjU3MFx1NjM2RVxuICogQHBhcmFtIHN1Y2Nlc3MgXHU2MjEwXHU1MjlGXHU3MkI2XHU2MDAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBdHJ1ZVxuICogQHBhcmFtIG1lc3NhZ2UgXHU1M0VGXHU5MDA5XHU2RDg4XHU2MDZGXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTY4M0NcdTVGMEZcdTc2ODRBUElcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tSZXNwb25zZTxUPihcbiAgZGF0YTogVCwgXG4gIHN1Y2Nlc3M6IGJvb2xlYW4gPSB0cnVlLCBcbiAgbWVzc2FnZT86IHN0cmluZ1xuKSB7XG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBkYXRhLFxuICAgIG1lc3NhZ2UsXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgbW9ja1Jlc3BvbnNlOiB0cnVlIC8vIFx1NjgwN1x1OEJCMFx1NEUzQVx1NkEyMVx1NjJERlx1NTRDRFx1NUU5NFxuICB9O1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NkEyMVx1NjJERkFQSVx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICogQHBhcmFtIG1lc3NhZ2UgXHU5NTE5XHU4QkVGXHU2RDg4XHU2MDZGXG4gKiBAcGFyYW0gY29kZSBcdTk1MTlcdThCRUZcdTRFRTNcdTc4MDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0EnTU9DS19FUlJPUidcbiAqIEBwYXJhbSBzdGF0dXMgSFRUUFx1NzJCNlx1NjAwMVx1NzgwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQTUwMFxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHU3Njg0XHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZShcbiAgbWVzc2FnZTogc3RyaW5nLCBcbiAgY29kZTogc3RyaW5nID0gJ01PQ0tfRVJST1InLCBcbiAgc3RhdHVzOiBudW1iZXIgPSA1MDBcbikge1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgIGVycm9yOiB7XG4gICAgICBtZXNzYWdlLFxuICAgICAgY29kZSxcbiAgICAgIHN0YXR1c0NvZGU6IHN0YXR1c1xuICAgIH0sXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgbW9ja1Jlc3BvbnNlOiB0cnVlXG4gIH07XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU1MjA2XHU5ODc1XHU1NENEXHU1RTk0XHU3RUQzXHU2Nzg0XG4gKiBAcGFyYW0gaXRlbXMgXHU1RjUzXHU1MjREXHU5ODc1XHU3Njg0XHU5ODc5XHU3NkVFXHU1MjE3XHU4ODY4XG4gKiBAcGFyYW0gdG90YWxJdGVtcyBcdTYwM0JcdTk4NzlcdTc2RUVcdTY1NzBcbiAqIEBwYXJhbSBwYWdlIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzgwMVxuICogQHBhcmFtIHNpemUgXHU2QkNGXHU5ODc1XHU1OTI3XHU1QzBGXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTUyMDZcdTk4NzVcdTU0Q0RcdTVFOTRcdTdFRDNcdTY3ODRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZTxUPihcbiAgaXRlbXM6IFRbXSxcbiAgdG90YWxJdGVtczogbnVtYmVyLFxuICBwYWdlOiBudW1iZXIgPSAxLFxuICBzaXplOiBudW1iZXIgPSAxMFxuKSB7XG4gIHJldHVybiBjcmVhdGVNb2NrUmVzcG9uc2Uoe1xuICAgIGl0ZW1zLFxuICAgIHBhZ2luYXRpb246IHtcbiAgICAgIHRvdGFsOiB0b3RhbEl0ZW1zLFxuICAgICAgcGFnZSxcbiAgICAgIHNpemUsXG4gICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwodG90YWxJdGVtcyAvIHNpemUpLFxuICAgICAgaGFzTW9yZTogcGFnZSAqIHNpemUgPCB0b3RhbEl0ZW1zXG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZBUElcdTU0Q0RcdTVFOTRcdTVFRjZcdThGREZcbiAqIEBwYXJhbSBtcyBcdTVFRjZcdThGREZcdTZCRUJcdTc5RDJcdTY1NzBcdUZGMENcdTlFRDhcdThCQTQzMDBtc1xuICogQHJldHVybnMgUHJvbWlzZVx1NUJGOVx1OEM2MVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlciA9IDMwMCk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSxcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheVxufTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTk2QzZcdTRFMkRcdTVCRkNcdTUxRkFcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0QVBJIE1vY2tcdTY3MERcdTUyQTFcdTUxNjVcdTUzRTNcdTcwQjlcbiAqL1xuXG4vLyBcdTVCRkNcdTUxNjVcdTY1NzBcdTYzNkVcdTZFOTBcdTY3MERcdTUyQTFcbmltcG9ydCBkYXRhU291cmNlIGZyb20gJy4vZGF0YXNvdXJjZSc7XG5cbi8vIFx1NUJGQ1x1NTE2NVx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuaW1wb3J0IHsgXG4gIGNyZWF0ZU1vY2tSZXNwb25zZSwgXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLCBcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheSBcbn0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogXHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExTW9ja1xuICovXG5jb25zdCBxdWVyeSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcmllcyhwYXJhbXM6IHsgcGFnZTogbnVtYmVyOyBzaXplOiBudW1iZXI7IH0pIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2Uoe1xuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBpZDogJ3ExJywgbmFtZTogJ1x1NzUyOFx1NjIzN1x1NTIwNlx1Njc5MFx1NjdFNVx1OEJFMicsIGRlc2NyaXB0aW9uOiAnXHU2MzA5XHU1NzMwXHU1MzNBXHU3RURGXHU4QkExXHU3NTI4XHU2MjM3XHU2Q0U4XHU1MThDXHU2NTcwXHU2MzZFJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgICAgeyBpZDogJ3EyJywgbmFtZTogJ1x1OTUwMFx1NTUyRVx1NEUxQVx1N0VFOVx1NjdFNVx1OEJFMicsIGRlc2NyaXB0aW9uOiAnXHU2MzA5XHU2NzA4XHU3RURGXHU4QkExXHU5NTAwXHU1NTJFXHU5ODlEJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgICAgeyBpZDogJ3EzJywgbmFtZTogJ1x1NUU5M1x1NUI1OFx1NTIwNlx1Njc5MCcsIGRlc2NyaXB0aW9uOiAnXHU3NkQxXHU2M0E3XHU1RTkzXHU1QjU4XHU2QzM0XHU1RTczJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgIF0sXG4gICAgICB0b3RhbDogMyxcbiAgICAgIHBhZ2U6IHBhcmFtcy5wYWdlLFxuICAgICAgc2l6ZTogcGFyYW1zLnNpemVcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBnZXRRdWVyeShpZDogc3RyaW5nKSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQsXG4gICAgICBuYW1lOiAnXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4RkQ5XHU2NjJGXHU0RTAwXHU0RTJBXHU3OTNBXHU0RjhCXHU2N0U1XHU4QkUyJyxcbiAgICAgIHNxbDogJ1NFTEVDVCAqIEZST00gdXNlcnMgV0hFUkUgc3RhdHVzID0gJDEnLFxuICAgICAgcGFyYW1ldGVyczogWydhY3RpdmUnXSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGNyZWF0ZVF1ZXJ5KGRhdGE6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBgcXVlcnktJHtEYXRlLm5vdygpfWAsXG4gICAgICAuLi5kYXRhLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgdXBkYXRlUXVlcnkoaWQ6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQsXG4gICAgICAuLi5kYXRhLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGRlbGV0ZVF1ZXJ5KGlkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBleGVjdXRlUXVlcnkoaWQ6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBjb2x1bW5zOiBbJ2lkJywgJ25hbWUnLCAnZW1haWwnLCAnc3RhdHVzJ10sXG4gICAgICByb3dzOiBbXG4gICAgICAgIHsgaWQ6IDEsIG5hbWU6ICdcdTVGMjBcdTRFMDknLCBlbWFpbDogJ3poYW5nQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICAgICAgICB7IGlkOiAyLCBuYW1lOiAnXHU2NzRFXHU1NkRCJywgZW1haWw6ICdsaUBleGFtcGxlLmNvbScsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgICAgICAgeyBpZDogMywgbmFtZTogJ1x1NzM4Qlx1NEU5NCcsIGVtYWlsOiAnd2FuZ0BleGFtcGxlLmNvbScsIHN0YXR1czogJ2luYWN0aXZlJyB9LFxuICAgICAgXSxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIGV4ZWN1dGlvblRpbWU6IDAuMjM1LFxuICAgICAgICByb3dDb3VudDogMyxcbiAgICAgICAgdG90YWxQYWdlczogMVxuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG5cbi8qKlxuICogXHU1QkZDXHU1MUZBXHU2MjQwXHU2NzA5XHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IHNlcnZpY2VzID0ge1xuICBkYXRhU291cmNlLFxuICBxdWVyeVxufTtcblxuLy8gXHU1QkZDXHU1MUZBbW9jayBzZXJ2aWNlXHU1REU1XHU1MTc3XG5leHBvcnQge1xuICBjcmVhdGVNb2NrUmVzcG9uc2UsXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5XG59O1xuXG4vLyBcdTVCRkNcdTUxRkFcdTU0MDRcdTRFMkFcdTY3MERcdTUyQTFcbmV4cG9ydCBjb25zdCBkYXRhU291cmNlU2VydmljZSA9IHNlcnZpY2VzLmRhdGFTb3VyY2U7XG5leHBvcnQgY29uc3QgcXVlcnlTZXJ2aWNlID0gc2VydmljZXMucXVlcnk7XG5cbi8vIFx1OUVEOFx1OEJBNFx1NUJGQ1x1NTFGQVx1NjI0MFx1NjcwOVx1NjcwRFx1NTJBMVxuZXhwb3J0IGRlZmF1bHQgc2VydmljZXM7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzXCI7LyoqXG4gKiBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU3QkExXHU3NDA2XHU2QTIxXHU1NzU3XG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1N0VERlx1NEUwMFx1NzY4NEhUVFBcdThCRjdcdTZDNDJcdTYyRTZcdTYyMkFcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTc1MjhcdTRFOEVcdTZBMjFcdTYyREZBUElcdTU0Q0RcdTVFOTRcbiAqIFx1OEQxRlx1OEQyM1x1N0JBMVx1NzQwNlx1NTQ4Q1x1NTIwNlx1NTNEMVx1NjI0MFx1NjcwOUFQSVx1OEJGN1x1NkM0Mlx1NTIzMFx1NUJGOVx1NUU5NFx1NzY4NFx1NjcwRFx1NTJBMVx1NTkwNFx1NzQwNlx1NTFGRFx1NjU3MFxuICovXG5cbmltcG9ydCB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCAqIGFzIGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgeyBpc01vY2tFbmFibGVkLCBsb2dNb2NrLCBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCBzZXJ2aWNlcyBmcm9tICcuLi9zZXJ2aWNlcyc7XG5pbXBvcnQgeyBjcmVhdGVNb2NrUmVzcG9uc2UsIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlIH0gZnJvbSAnLi4vc2VydmljZXMvdXRpbHMnO1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQU1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcbiAqIFxuICogXHU2QjY0XHU0RTJEXHU5NUY0XHU0RUY2XHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyXHU1RTc2XHU2M0QwXHU0RjlCXHU2QTIxXHU2MkRGXHU1NENEXHU1RTk0XG4gKiBcdTUzRUFcdTU5MDRcdTc0MDYvYXBpXHU1RjAwXHU1OTM0XHU3Njg0XHU4QkY3XHU2QzQyXHVGRjBDXHU1MTc2XHU0RUQ2XHU4QkY3XHU2QzQyXHU3NkY0XHU2M0E1XHU2NTNFXHU4ODRDXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCk6IENvbm5lY3QuTmV4dEhhbmRsZUZ1bmN0aW9uIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIG1vY2tNaWRkbGV3YXJlKFxuICAgIHJlcTogQ29ubmVjdC5JbmNvbWluZ01lc3NhZ2UsIFxuICAgIHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSwgXG4gICAgbmV4dDogQ29ubmVjdC5OZXh0RnVuY3Rpb25cbiAgKSB7XG4gICAgLy8gXHU2OEMwXHU2N0U1TW9ja1x1NjcwRFx1NTJBMVx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOFxuICAgIGlmICghaXNNb2NrRW5hYmxlZCgpKSB7XG4gICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUzRUFcdTYyRTZcdTYyMkEvYXBpXHU1RjAwXHU1OTM0XHU3Njg0XHU4QkY3XHU2QzQyXHVGRjBDXHU1MTc2XHU0RUQ2XHU4QkY3XHU2QzQyXHU3NkY0XHU2M0E1XHU2NTNFXHU4ODRDXG4gICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICBpZiAoIXVybC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cbiAgICBcbiAgICBsb2dNb2NrKCdpbmZvJywgYFtNb2NrXSBcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHt1cmx9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1NTkwNFx1NzQwNk9QVElPTlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDJcbiAgICAgIGlmIChyZXEubWV0aG9kID09PSAnT1BUSU9OUycpIHtcbiAgICAgICAgaGFuZGxlT3B0aW9uc1JlcXVlc3QocmVzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTg5RTNcdTY3OTBcdThCRjdcdTZDNDJcdTY1NzBcdTYzNkVcbiAgICAgIGNvbnN0IHJlcUJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU4QkY3XHU2QzQyXHU0RjUzOmAsIHJlcUJvZHkpO1xuICAgICAgXG4gICAgICAvLyBcdTgzQjdcdTUzRDZcdThCRjdcdTZDNDJcdThERUZcdTVGODRcdTU0OENcdTY1QjlcdTZDRDVcbiAgICAgIGNvbnN0IHBhdGggPSB1cmw7XG4gICAgICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpIHx8ICdHRVQnO1xuICAgICAgXG4gICAgICAvLyBcdTZERkJcdTUyQTBcdTVFRjZcdThGREZcdTZBMjFcdTYyREZcdTdGNTFcdTdFRENcdTVFRjZcdThGREZcbiAgICAgIGF3YWl0IGFkZERlbGF5KCk7XG4gICAgICBcbiAgICAgIC8vIFx1OERFRlx1NzUzMVx1NTIwNlx1NTNEMVx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0MlxuICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgIC8vIFx1NjU3MFx1NjM2RVx1NkU5MEFQSVxuICAgICAgICBjYXNlIHBhdGguaW5jbHVkZXMoJy9hcGkvZGF0YXNvdXJjZXMnKTpcbiAgICAgICAgICBhd2FpdCBoYW5kbGVEYXRhU291cmNlUmVxdWVzdChwYXRoLCBtZXRob2QsIHJlcUJvZHksIHJlcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTY3RTVcdThCRTJBUElcbiAgICAgICAgY2FzZSBwYXRoLmluY2x1ZGVzKCcvYXBpL3F1ZXJpZXMnKTpcbiAgICAgICAgICBhd2FpdCBoYW5kbGVRdWVyeVJlcXVlc3QocGF0aCwgbWV0aG9kLCByZXFCb2R5LCByZXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1MTc2XHU0RUQ2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gXHU3NTFGXHU2MjEwXHU0RTAwXHU0RTJBXHU5MDFBXHU3NTI4XHU1NENEXHU1RTk0XG4gICAgICAgICAgbG9nTW9jaygnd2FybicsIGBbTW9ja10gXHU2NzJBXHU1MzM5XHU5MTREXHU3Njg0QVBJOiAke21ldGhvZH0gJHtwYXRofWApO1xuICAgICAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogYE1vY2sgcmVzcG9uc2UgZm9yICR7bWV0aG9kfSAke3BhdGh9YCxcbiAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nTW9jaygnZXJyb3InLCBgW01vY2tdIFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NTFGQVx1OTUxOTpgLCBlcnJvcik7XG4gICAgICBoYW5kbGVFcnJvcihyZXMsIGVycm9yKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogXHU1OTA0XHU3NDA2XHU2NTcwXHU2MzZFXHU2RTkwXHU3NkY4XHU1MTczXHU4QkY3XHU2QzQyXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZURhdGFTb3VyY2VSZXF1ZXN0KFxuICBwYXRoOiBzdHJpbmcsIFxuICBtZXRob2Q6IHN0cmluZywgXG4gIGJvZHk6IGFueSwgXG4gIHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZVxuKSB7XG4gIHRyeSB7XG4gICAgbG9nTW9jaygnaW5mbycsIGBbTW9ja10gXHU1OTA0XHU3NDA2XHU2NTcwXHU2MzZFXHU2RTkwXHU4QkY3XHU2QzQyOiAke21ldGhvZH0gJHtwYXRofWApO1xuICAgIFxuICAgIC8vIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjU3MFx1NjM2RVx1NkU5MFxuICAgIGNvbnN0IHNpbmdsZU1hdGNoID0gcGF0aC5tYXRjaCgvXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKHNpbmdsZU1hdGNoICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gc2luZ2xlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwOiAke2lkfWApO1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLmRhdGFTb3VyY2UuZ2V0RGF0YVNvdXJjZShpZCk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICAgIGlmIChwYXRoLm1hdGNoKC9cXC9hcGlcXC9kYXRhc291cmNlc1xcLz8kLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OGApO1xuICAgICAgXG4gICAgICAvLyBcdTg5RTNcdTY3OTBcdTY3RTVcdThCRTJcdTUzQzJcdTY1NzBcbiAgICAgIGNvbnN0IHVybE9iaiA9IG5ldyBVUkwoYGh0dHA6Ly9sb2NhbGhvc3Qke3BhdGh9YCk7XG4gICAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQodXJsT2JqLnNlYXJjaFBhcmFtcy5nZXQoJ3BhZ2UnKSB8fCAnMScsIDEwKTtcbiAgICAgIGNvbnN0IHNpemUgPSBwYXJzZUludCh1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgnc2l6ZScpIHx8ICcxMCcsIDEwKTtcbiAgICAgIGNvbnN0IG5hbWUgPSB1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgnbmFtZScpIHx8IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHR5cGUgPSB1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgndHlwZScpIHx8IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCdzdGF0dXMnKSB8fCB1bmRlZmluZWQ7XG4gICAgICBcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgc3RhdHVzXG4gICAgICB9O1xuICAgICAgXG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU2NTcwXHU2MzZFXHU2RTkwXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwOmAsIHBhcmFtcyk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS5nZXREYXRhU291cmNlcyhwYXJhbXMpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgICBpZiAocGF0aC5tYXRjaCgvXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC8/JC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwOmAsIGJvZHkpO1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLmRhdGFTb3VyY2UuY3JlYXRlRGF0YVNvdXJjZShib2R5KTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAxLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gICAgY29uc3QgdXBkYXRlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9kYXRhc291cmNlc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAodXBkYXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnUFVUJykge1xuICAgICAgY29uc3QgaWQgPSB1cGRhdGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTA6ICR7aWR9YCwgYm9keSk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS51cGRhdGVEYXRhU291cmNlKGlkLCBib2R5KTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gICAgY29uc3QgZGVsZXRlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9kYXRhc291cmNlc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAoZGVsZXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgICAgY29uc3QgaWQgPSBkZWxldGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTA6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIGF3YWl0IHNlcnZpY2VzLmRhdGFTb3VyY2UuZGVsZXRlRGF0YVNvdXJjZShpZCk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSwgaWQgfSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTZDQTFcdTY3MDlcdTUzMzlcdTkxNERcdTc2ODRcdThERUZcdTc1MzFcdUZGMENcdThGRDRcdTU2REU0MDRcbiAgICBsb2dNb2NrKCd3YXJuJywgYFtNb2NrXSBcdTY3MkFcdTc3RTVcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBBUEk6ICR7bWV0aG9kfSAke3BhdGh9YCk7XG4gICAgc2VuZEpzb24ocmVzLCA0MDQsIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlKCdOb3QgRm91bmQnLCAnUkVTT1VSQ0VfTk9UX0ZPVU5EJywgNDA0KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nTW9jaygnZXJyb3InLCBgW01vY2tdIFx1NjU3MFx1NjM2RVx1NkU5MFx1OEJGN1x1NkM0Mlx1NTkwNFx1NzQwNlx1OTUxOVx1OEJFRjpgLCBlcnJvcik7XG4gICAgaGFuZGxlRXJyb3IocmVzLCBlcnJvcik7XG4gIH1cbn1cblxuLyoqXG4gKiBcdTU5MDRcdTc0MDZcdTY3RTVcdThCRTJcdTc2RjhcdTUxNzNcdThCRjdcdTZDNDJcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUXVlcnlSZXF1ZXN0KFxuICBwYXRoOiBzdHJpbmcsIFxuICBtZXRob2Q6IHN0cmluZywgXG4gIGJvZHk6IGFueSwgXG4gIHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZVxuKSB7XG4gIHRyeSB7XG4gICAgbG9nTW9jaygnaW5mbycsIGBbTW9ja10gXHU1OTA0XHU3NDA2XHU2N0U1XHU4QkUyXHU4QkY3XHU2QzQyOiAke21ldGhvZH0gJHtwYXRofWApO1xuICAgIFxuICAgIC8vIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHNpbmdsZU1hdGNoID0gcGF0aC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAoc2luZ2xlTWF0Y2ggJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgICAgY29uc3QgaWQgPSBzaW5nbGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTI6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMucXVlcnkuZ2V0UXVlcnkoaWQpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgICBpZiAocGF0aC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllc1xcLz8kLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OGApO1xuICAgICAgXG4gICAgICAvLyBcdTg5RTNcdTY3OTBcdTY3RTVcdThCRTJcdTUzQzJcdTY1NzBcbiAgICAgIGNvbnN0IHVybE9iaiA9IG5ldyBVUkwoYGh0dHA6Ly9sb2NhbGhvc3Qke3BhdGh9YCk7XG4gICAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQodXJsT2JqLnNlYXJjaFBhcmFtcy5nZXQoJ3BhZ2UnKSB8fCAnMScsIDEwKTtcbiAgICAgIGNvbnN0IHNpemUgPSBwYXJzZUludCh1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgnc2l6ZScpIHx8ICcxMCcsIDEwKTtcbiAgICAgIFxuICAgICAgY29uc3QgcGFyYW1zID0geyBwYWdlLCBzaXplIH07XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LmdldFF1ZXJpZXMocGFyYW1zKTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gICAgaWYgKHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8/JC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyOmAsIGJvZHkpO1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LmNyZWF0ZVF1ZXJ5KGJvZHkpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDEsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgICBjb25zdCB1cGRhdGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKHVwZGF0ZU1hdGNoICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gdXBkYXRlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyOiAke2lkfWAsIGJvZHkpO1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LnVwZGF0ZVF1ZXJ5KGlkLCBib2R5KTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gICAgY29uc3QgZGVsZXRlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9xdWVyaWVzXFwvKFteXFwvXSspJC8pO1xuICAgIGlmIChkZWxldGVNYXRjaCAmJiBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgICBjb25zdCBpZCA9IGRlbGV0ZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMjogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgYXdhaXQgc2VydmljZXMucXVlcnkuZGVsZXRlUXVlcnkoaWQpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUsIGlkIH0pKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgZXhlY3V0ZU1hdGNoID0gcGF0aC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllc1xcLyhbXlxcL10rKVxcL2V4ZWN1dGUkLyk7XG4gICAgaWYgKGV4ZWN1dGVNYXRjaCAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgY29uc3QgaWQgPSBleGVjdXRlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyOiAke2lkfWAsIGJvZHkpO1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LmV4ZWN1dGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkNBMVx1NjcwOVx1NTMzOVx1OTE0RFx1NzY4NFx1OERFRlx1NzUzMVx1RkYwQ1x1OEZENFx1NTZERTQwNFxuICAgIGxvZ01vY2soJ3dhcm4nLCBgW01vY2tdIFx1NjcyQVx1NzdFNVx1NzY4NFx1NjdFNVx1OEJFMkFQSTogJHttZXRob2R9ICR7cGF0aH1gKTtcbiAgICBzZW5kSnNvbihyZXMsIDQwNCwgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UoJ05vdCBGb3VuZCcsICdSRVNPVVJDRV9OT1RfRk9VTkQnLCA0MDQpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dNb2NrKCdlcnJvcicsIGBbTW9ja10gXHU2N0U1XHU4QkUyXHU4QkY3XHU2QzQyXHU1OTA0XHU3NDA2XHU5NTE5XHU4QkVGOmAsIGVycm9yKTtcbiAgICBoYW5kbGVFcnJvcihyZXMsIGVycm9yKTtcbiAgfVxufVxuXG4vKipcbiAqIFx1NjNEMFx1NTNENlx1NTQ4Q1x1ODlFM1x1Njc5MFx1OEJGN1x1NkM0Mlx1NEY1M1xuICovXG5hc3luYyBmdW5jdGlvbiBwYXJzZVJlcXVlc3RCb2R5KHJlcTogQ29ubmVjdC5JbmNvbWluZ01lc3NhZ2UpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCBjaHVua3M6IEJ1ZmZlcltdID0gW107XG4gICAgXG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rOiBCdWZmZXIpID0+IGNodW5rcy5wdXNoKGNodW5rKSk7XG4gICAgXG4gICAgcmVxLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJlc29sdmUoe30pO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBib2R5U3RyID0gQnVmZmVyLmNvbmNhdChjaHVua3MpLnRvU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBib2R5U3RyICYmIGJvZHlTdHIudHJpbSgpID8gSlNPTi5wYXJzZShib2R5U3RyKSA6IHt9O1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShib2R5KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZ01vY2soJ3dhcm4nLCBgW01vY2tdIFx1OEJGN1x1NkM0Mlx1NEY1M1x1ODlFM1x1Njc5MFx1NTkzMVx1OEQyNTpgLCBlcnJvcik7XG4gICAgICAgIHJldHVybiByZXNvbHZlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogXHU1M0QxXHU5MDAxSlNPTlx1NTRDRFx1NUU5NFxuICovXG5mdW5jdGlvbiBzZW5kSnNvbihyZXM6IGh0dHAuU2VydmVyUmVzcG9uc2UsIHN0YXR1c0NvZGU6IG51bWJlciwgZGF0YTogYW55KTogdm9pZCB7XG4gIHJlcy5zdGF0dXNDb2RlID0gc3RhdHVzQ29kZTtcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uLCBYLU1vY2stRW5hYmxlZCcpO1xuICByZXMuc2V0SGVhZGVyKCdYLVBvd2VyZWQtQnknLCAnRGF0YVNjb3BlLU1vY2snKTtcbiAgXG4gIC8vIFx1NkRGQlx1NTJBME1vY2tcdTY4MDdcdThCQjBcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyAmJiBkYXRhICE9PSBudWxsKSB7XG4gICAgZGF0YS5tb2NrUmVzcG9uc2UgPSB0cnVlO1xuICB9XG4gIFxuICBjb25zdCByZXNwb25zZURhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgcmVzLmVuZChyZXNwb25zZURhdGEpO1xuICBcbiAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NTNEMVx1OTAwMVx1NTRDRFx1NUU5NDogWyR7c3RhdHVzQ29kZX1dICR7cmVzcG9uc2VEYXRhLnNsaWNlKDAsIDIwMCl9JHtyZXNwb25zZURhdGEubGVuZ3RoID4gMjAwID8gJy4uLicgOiAnJ31gKTtcbn1cblxuLyoqXG4gKiBcdTU5MDRcdTc0MDZcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqL1xuZnVuY3Rpb24gaGFuZGxlRXJyb3IocmVzOiBodHRwLlNlcnZlclJlc3BvbnNlLCBlcnJvcjogYW55LCBzdGF0dXNDb2RlID0gNTAwKTogdm9pZCB7XG4gIGNvbnN0IG1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcik7XG4gIGNvbnN0IGNvZGUgPSAoZXJyb3IgYXMgYW55KS5jb2RlIHx8ICdJTlRFUk5BTF9FUlJPUic7XG4gIFxuICBsb2dNb2NrKCdlcnJvcicsIGBbTW9ja10gXHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0OiAke3N0YXR1c0NvZGV9ICR7Y29kZX0gJHttZXNzYWdlfWApO1xuICBcbiAgY29uc3QgZXJyb3JSZXNwb25zZSA9IGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlKG1lc3NhZ2UsIGNvZGUsIHN0YXR1c0NvZGUpO1xuICBzZW5kSnNvbihyZXMsIHN0YXR1c0NvZGUsIGVycm9yUmVzcG9uc2UpO1xufVxuXG4vKipcbiAqIFx1NTkwNFx1NzQwNk9QVElPTlNcdThCRjdcdTZDNDJcdUZGMDhDT1JTXHU5ODg0XHU2OEMwXHVGRjA5XG4gKi9cbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnNSZXF1ZXN0KHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSk6IHZvaWQge1xuICByZXMuc3RhdHVzQ29kZSA9IDIwNDtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uLCBYLU1vY2stRW5hYmxlZCcpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1NYXgtQWdlJywgJzg2NDAwJyk7IC8vIDI0XHU1QzBGXHU2NUY2XG4gIHJlcy5lbmQoKTtcbiAgXG4gIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyYCk7XG59XG5cbi8qKlxuICogXHU2REZCXHU1MkEwXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFkZERlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IGRlbGF5IH0gPSBtb2NrQ29uZmlnO1xuICBcbiAgbGV0IGRlbGF5TXMgPSAwO1xuICBpZiAodHlwZW9mIGRlbGF5ID09PSAnbnVtYmVyJyAmJiBkZWxheSA+IDApIHtcbiAgICBkZWxheU1zID0gZGVsYXk7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NkRGQlx1NTJBMFx1NTZGQVx1NUI5QVx1NUVGNlx1OEZERjogJHtkZWxheU1zfW1zYCk7XG4gIH0gZWxzZSBpZiAoZGVsYXkgJiYgdHlwZW9mIGRlbGF5ID09PSAnb2JqZWN0Jykge1xuICAgIGNvbnN0IHsgbWluLCBtYXggfSA9IGRlbGF5O1xuICAgIGRlbGF5TXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTZERkJcdTUyQTBcdTk2OEZcdTY3M0FcdTVFRjZcdThGREY6ICR7ZGVsYXlNc31tcyAoXHU4MzAzXHU1NkY0OiAke21pbn0tJHttYXh9bXMpYCk7XG4gIH1cbiAgXG4gIGlmIChkZWxheU1zID4gMCkge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheU1zKSk7XG4gIH1cbn0gIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwWSxTQUFTLGNBQWMsZUFBZTtBQUNoYixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZ0JBQWdCO0FBQ3pCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCOzs7QUNDekIsSUFBTSxZQUFZLE1BQU07QUFOeEI7QUFRRSxNQUFJLE9BQU8sV0FBVyxhQUFhO0FBQ2pDLFFBQUssT0FBZSxtQkFBbUI7QUFBTyxhQUFPO0FBQ3JELFFBQUssT0FBZSx3QkFBd0I7QUFBTSxhQUFPO0FBQUEsRUFDM0Q7QUFJQSxRQUFJLDhDQUFhLFFBQWIsbUJBQWtCLHVCQUFzQjtBQUFTLFdBQU87QUFHNUQsUUFBSSw4Q0FBYSxRQUFiLG1CQUFrQix1QkFBc0I7QUFBUSxXQUFPO0FBRzNELFFBQU0sa0JBQWdCLDhDQUFhLFFBQWIsbUJBQWtCLFVBQVM7QUFHakQsU0FBTztBQUNUO0FBS08sSUFBTSxhQUFhO0FBQUE7QUFBQSxFQUV4QixTQUFTLFVBQVU7QUFBQTtBQUFBLEVBR25CLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxFQUNQO0FBQUE7QUFBQSxFQUdBLEtB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
