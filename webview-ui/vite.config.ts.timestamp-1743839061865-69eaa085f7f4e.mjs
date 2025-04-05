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
  if (!isMockEnabled()) {
    console.log("[Mock] \u670D\u52A1\u5DF2\u7981\u7528\uFF0C\u6240\u6709\u8BF7\u6C42\u5C06\u76F4\u63A5\u4F20\u9012");
    return (req, res, next) => next();
  }
  console.log("[Mock] \u521B\u5EFA\u4E2D\u95F4\u4EF6\uFF0C\u53EA\u62E6\u622A/api\u5F00\u5934\u7684\u8BF7\u6C42");
  return async function mockMiddleware(req, res, next) {
    var _a;
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
      // HMR配置
      hmr: disableHmr ? false : {
        protocol: "ws",
        port: 8080
      },
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
      // 不使用中间件模式
      middlewareMode: false,
      // 使用Mock中间件拦截API请求
      configureServer: useMockApi ? (server) => {
        console.log("[Vite\u914D\u7F6E] \u6DFB\u52A0Mock\u4E2D\u95F4\u4EF6\uFF0C\u4EC5\u7528\u4E8E\u5904\u7406API\u8BF7\u6C42");
        const middleware = createMockMiddleware();
        server.middlewares.use((req, res, next) => {
          var _a;
          if (!((_a = req.url) == null ? void 0 : _a.startsWith("/api/"))) {
            return next();
          }
          console.log(`[Vite] \u8BF7\u6C42: ${req.method} ${req.url}`);
          middleware(req, res, next);
        });
      } : void 0,
      headers: {
        "Cache-Control": "no-store, max-age=0"
      },
      // 预热优化依赖
      warmup: {
        clientFiles: [
          "./src/main.ts",
          "./index.html"
        ]
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
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        "vue-echarts": path.resolve(__vite_injected_original_dirname, "node_modules/vue-echarts"),
        "echarts": path.resolve(__vite_injected_original_dirname, "node_modules/echarts"),
        "echarts/core": path.resolve(__vite_injected_original_dirname, "node_modules/echarts/core"),
        "echarts/charts": path.resolve(__vite_injected_original_dirname, "node_modules/echarts/charts"),
        "echarts/components": path.resolve(__vite_injected_original_dirname, "node_modules/echarts/components"),
        "echarts/renderers": path.resolve(__vite_injected_original_dirname, "node_modules/echarts/renderers"),
        "vuedraggable": path.resolve(__vite_injected_original_dirname, "node_modules/vuedraggable"),
        "uuid": path.resolve(__vite_injected_original_dirname, "node_modules/uuid")
      },
      dedupe: ["vue", "echarts"]
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
    optimizeDeps: {
      // 强制预构建这些依赖，确保不会出现504错误
      include: [
        "vue",
        "pinia",
        "vue-router",
        "axios",
        "dayjs",
        "ant-design-vue",
        "ant-design-vue/es/locale/zh_CN",
        "vue-echarts",
        "echarts",
        "echarts/core",
        "echarts/charts",
        "echarts/components",
        "echarts/renderers",
        "vuedraggable",
        "uuid"
      ],
      // 排除这些不需要优化的依赖
      exclude: [
        "src/plugins/serverMock.ts",
        "fsevents"
      ],
      // 确保依赖预构建正确完成
      force: true,
      // 优化深度导入
      esbuildOptions: {
        // 避免处理本地模块
        plugins: [
          {
            name: "exclude-node-modules",
            setup(build) {
              build.onLoad({ filter: /\.node$/ }, () => {
                return { contents: "export default {}", loader: "js" };
              });
            }
          }
        ]
      }
    },
    // 使用单独的缓存目录
    cacheDir: "node_modules/.vite_clean_cache"
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svY29uZmlnLnRzIiwgInNyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzIiwgInNyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG4vLyBcdTVGM0FcdTUyMzZcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTNcdTUxRkRcdTY1NzBcbmZ1bmN0aW9uIGtpbGxQb3J0KHBvcnQ6IG51bWJlcikge1xuICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjhDMFx1NjdFNVx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NTM2MFx1NzUyOFx1NjBDNVx1NTFCNWApO1xuICB0cnkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBleGVjU3luYyhgbmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fWApO1xuICAgICAgZXhlY1N5bmMoYHRhc2traWxsIC9GIC9waWQgJChuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9IHwgYXdrICd7cHJpbnQgJDV9JylgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4ZWNTeW5jKGBsc29mIC1pIDoke3BvcnR9IC10IHwgeGFyZ3Mga2lsbCAtOWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTMgJHtwb3J0fWApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTY3MkFcdTg4QUJcdTUzNjBcdTc1MjhcdTYyMTZcdTY1RTBcdTZDRDVcdTkxQ0FcdTY1M0VgKTtcbiAgfVxufVxuXG4vLyBcdTVGM0FcdTUyMzZcdTZFMDVcdTc0MDZWaXRlXHU3RjEzXHU1QjU4XG5mdW5jdGlvbiBjbGVhblZpdGVDYWNoZSgpIHtcbiAgY29uc29sZS5sb2coJ1tWaXRlXSBcdTZFMDVcdTc0MDZcdTRGOURcdThENTZcdTdGMTNcdTVCNTgnKTtcbiAgY29uc3QgY2FjaGVQYXRocyA9IFtcbiAgICAnLi9ub2RlX21vZHVsZXMvLnZpdGUnLFxuICAgICcuL25vZGVfbW9kdWxlcy8udml0ZV8qJyxcbiAgICAnLi8udml0ZScsXG4gICAgJy4vZGlzdCcsXG4gICAgJy4vdG1wJyxcbiAgICAnLi8udGVtcCdcbiAgXTtcbiAgXG4gIGNhY2hlUGF0aHMuZm9yRWFjaChjYWNoZVBhdGggPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhjYWNoZVBhdGgpKSB7XG4gICAgICAgIGlmIChmcy5sc3RhdFN5bmMoY2FjaGVQYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgZXhlY1N5bmMoYHJtIC1yZiAke2NhY2hlUGF0aH1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy51bmxpbmtTeW5jKGNhY2hlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTUyMjBcdTk2NjQ6ICR7Y2FjaGVQYXRofWApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2NUUwXHU2Q0Q1XHU1MjIwXHU5NjY0OiAke2NhY2hlUGF0aH1gLCBlKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBcdTZFMDVcdTc0MDZWaXRlXHU3RjEzXHU1QjU4XG5jbGVhblZpdGVDYWNoZSgpO1xuXG4vLyBcdTVDMURcdThCRDVcdTkxQ0FcdTY1M0VcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTdBRUZcdTUzRTNcbmtpbGxQb3J0KDgwODApO1xuXG4vLyBcdTU3RkFcdTY3MkNcdTkxNERcdTdGNkVcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHU1MkEwXHU4RjdEXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9jayBBUElcbiAgY29uc3QgdXNlTW9ja0FwaSA9IGVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU3OTgxXHU3NTI4SE1SXG4gIGNvbnN0IGRpc2FibGVIbXIgPSBlbnYuVklURV9ESVNBQkxFX0hNUiA9PT0gJ3RydWUnO1xuICBcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdThGRDBcdTg4NENcdTZBMjFcdTVGMEY6ICR7bW9kZX1gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBNb2NrIEFQSTogJHt1c2VNb2NrQXBpID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgIF0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICAvLyBITVJcdTkxNERcdTdGNkVcbiAgICAgIGhtcjogZGlzYWJsZUhtciA/IGZhbHNlIDoge1xuICAgICAgICBwcm90b2NvbDogJ3dzJyxcbiAgICAgICAgcG9ydDogODA4MFxuICAgICAgfSxcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1NEVFM1x1NzQwNlxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gXHU1QzA2QVBJXHU4QkY3XHU2QzQyXHU4RjZDXHU1M0QxXHU1MjMwXHU1NDBFXHU3QUVGXHU2NzBEXHU1MkExXG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgICAgYnlwYXNzOiAocmVxKSA9PiB7XG4gICAgICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTU0MkZcdTc1MjhcdTRFODZNb2NrIEFQSVx1RkYwQ1x1NTIxOVx1NEUwRFx1NEVFM1x1NzQwNkFQSVx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgaWYgKHVzZU1vY2tBcGkgJiYgcmVxLnVybD8uc3RhcnRzV2l0aCgnL2FwaS8nKSkge1xuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gXHU0RTBEXHU0RjdGXHU3NTI4XHU0RTJEXHU5NUY0XHU0RUY2XHU2QTIxXHU1RjBGXG4gICAgICBtaWRkbGV3YXJlTW9kZTogZmFsc2UsXG4gICAgICAvLyBcdTRGN0ZcdTc1MjhNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyXG4gICAgICBjb25maWd1cmVTZXJ2ZXI6IHVzZU1vY2tBcGkgXG4gICAgICAgID8gKHNlcnZlcikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWaXRlXHU5MTREXHU3RjZFXSBcdTZERkJcdTUyQTBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU0RUM1XHU3NTI4XHU0RThFXHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyJyk7XG4gICAgICAgICAgICAvLyBcdTc4NkVcdTRGRERcdTUzRUFcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgICAgIGNvbnN0IG1pZGRsZXdhcmUgPSBjcmVhdGVNb2NrTWlkZGxld2FyZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdTVDMDZcdTRFMkRcdTk1RjRcdTRFRjZcdTZERkJcdTUyQTBcdTUyMzB2aXRlXHU2NzBEXHU1MkExXHU1NjY4XG4gICAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgICAgICAvLyBcdTk3NUVBUElcdThCRjdcdTZDNDJcdTc2RjRcdTYzQTVcdThERjNcdThGQzdcdUZGMDhcdTUzQ0NcdTkxQ0RcdTRGRERcdTk2NjlcdUZGMDlcbiAgICAgICAgICAgICAgaWYgKCFyZXEudXJsPy5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHtyZXEudXJsfWApO1xuICAgICAgICAgICAgICBtaWRkbGV3YXJlKHJlcSwgcmVzLCBuZXh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gXG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1zdG9yZSwgbWF4LWFnZT0wJyxcbiAgICAgIH0sXG4gICAgICAvLyBcdTk4ODRcdTcwRURcdTRGMThcdTUzMTZcdTRGOURcdThENTZcbiAgICAgIHdhcm11cDoge1xuICAgICAgICBjbGllbnRGaWxlczogW1xuICAgICAgICAgICcuL3NyYy9tYWluLnRzJyxcbiAgICAgICAgICAnLi9pbmRleC5odG1sJyxcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MsIGF1dG9wcmVmaXhlcl0sXG4gICAgICB9LFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICAgJ3Z1ZS1lY2hhcnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy92dWUtZWNoYXJ0cycpLFxuICAgICAgICAnZWNoYXJ0cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvZWNoYXJ0cycpLFxuICAgICAgICAnZWNoYXJ0cy9jb3JlJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9lY2hhcnRzL2NvcmUnKSxcbiAgICAgICAgJ2VjaGFydHMvY2hhcnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9lY2hhcnRzL2NoYXJ0cycpLFxuICAgICAgICAnZWNoYXJ0cy9jb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9lY2hhcnRzL2NvbXBvbmVudHMnKSxcbiAgICAgICAgJ2VjaGFydHMvcmVuZGVyZXJzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9lY2hhcnRzL3JlbmRlcmVycycpLFxuICAgICAgICAndnVlZHJhZ2dhYmxlJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy92dWVkcmFnZ2FibGUnKSxcbiAgICAgICAgJ3V1aWQnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzL3V1aWQnKSxcbiAgICAgIH0sXG4gICAgICBkZWR1cGU6IFsndnVlJywgJ2VjaGFydHMnXVxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIC8vIFx1NkUwNVx1OTY2NGNvbnNvbGVcdTU0OENkZWJ1Z2dlclxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIC8vIFx1NUYzQVx1NTIzNlx1OTg4NFx1Njc4NFx1NUVGQVx1OEZEOVx1NEU5Qlx1NEY5RFx1OEQ1Nlx1RkYwQ1x1Nzg2RVx1NEZERFx1NEUwRFx1NEYxQVx1NTFGQVx1NzNCMDUwNFx1OTUxOVx1OEJFRlxuICAgICAgaW5jbHVkZTogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3BpbmlhJyxcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAnYXhpb3MnLFxuICAgICAgICAnZGF5anMnLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUnLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL3poX0NOJyxcbiAgICAgICAgJ3Z1ZS1lY2hhcnRzJyxcbiAgICAgICAgJ2VjaGFydHMnLFxuICAgICAgICAnZWNoYXJ0cy9jb3JlJyxcbiAgICAgICAgJ2VjaGFydHMvY2hhcnRzJyxcbiAgICAgICAgJ2VjaGFydHMvY29tcG9uZW50cycsXG4gICAgICAgICdlY2hhcnRzL3JlbmRlcmVycycsXG4gICAgICAgICd2dWVkcmFnZ2FibGUnLFxuICAgICAgICAndXVpZCdcbiAgICAgIF0sXG4gICAgICAvLyBcdTYzOTJcdTk2NjRcdThGRDlcdTRFOUJcdTRFMERcdTk3MDBcdTg5ODFcdTRGMThcdTUzMTZcdTc2ODRcdTRGOURcdThENTZcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgJ3NyYy9wbHVnaW5zL3NlcnZlck1vY2sudHMnLFxuICAgICAgICAnZnNldmVudHMnXG4gICAgICBdLFxuICAgICAgLy8gXHU3ODZFXHU0RkREXHU0RjlEXHU4RDU2XHU5ODg0XHU2Nzg0XHU1RUZBXHU2QjYzXHU3ODZFXHU1QjhDXHU2MjEwXG4gICAgICBmb3JjZTogdHJ1ZSxcbiAgICAgIC8vIFx1NEYxOFx1NTMxNlx1NkRGMVx1NUVBNlx1NUJGQ1x1NTE2NVxuICAgICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgICAgLy8gXHU5MDdGXHU1MTREXHU1OTA0XHU3NDA2XHU2NzJDXHU1NzMwXHU2QTIxXHU1NzU3XG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnZXhjbHVkZS1ub2RlLW1vZHVsZXMnLFxuICAgICAgICAgICAgc2V0dXAoYnVpbGQpIHtcbiAgICAgICAgICAgICAgYnVpbGQub25Mb2FkKHsgZmlsdGVyOiAvXFwubm9kZSQvIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBjb250ZW50czogJ2V4cG9ydCBkZWZhdWx0IHt9JywgbG9hZGVyOiAnanMnIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIFx1NEY3Rlx1NzUyOFx1NTM1NVx1NzJFQ1x1NzY4NFx1N0YxM1x1NUI1OFx1NzZFRVx1NUY1NVxuICAgIGNhY2hlRGlyOiAnbm9kZV9tb2R1bGVzLy52aXRlX2NsZWFuX2NhY2hlJyxcbiAgfVxufSkiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9ja1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7LyoqXG4gKiBcdTZBMjFcdTYyREZcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcbiAqIFx1OTZDNlx1NEUyRFx1N0JBMVx1NzQwNlx1NjI0MFx1NjcwOVx1NkEyMVx1NjJERlx1NjcwRFx1NTJBMVx1NzZGOFx1NTE3M1x1NzY4NFx1OTE0RFx1N0Y2RVx1RkYwQ1x1NEY1Q1x1NEUzQVx1NTM1NVx1NEUwMFx1NzcxRlx1NzZGOFx1Njc2NVx1NkU5MFxuICovXG5cbi8vIFx1NjhDMFx1NjdFNVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NTQ4Q1x1NTE2OFx1NUM0MFx1OEJCRVx1N0Y2RVxuY29uc3QgaXNFbmFibGVkID0gKCkgPT4ge1xuICAvLyBcdTY4QzBcdTY3RTVcdTUxNjhcdTVDNDBcdTUzRDhcdTkxQ0ZcdUZGMDhcdThGRDBcdTg4NENcdTY1RjZcdUZGMDlcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLl9fVVNFX01PQ0tfQVBJID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICgod2luZG93IGFzIGFueSkuX19BUElfTU9DS19ESVNBQkxFRCA9PT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdTY4QzBcdTY3RTVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdUZGMDhcdTdGMTZcdThCRDFcdTY1RjZcdUZGMDlcbiAgLy8gXHU1OTgyXHU2NzlDXHU2NjBFXHU3ODZFXHU4QkJFXHU3RjZFXHU0RTNBZmFsc2VcdUZGMENcdTUyMTlcdTc5ODFcdTc1MjhcbiAgaWYgKGltcG9ydC5tZXRhPy5lbnY/LlZJVEVfVVNFX01PQ0tfQVBJID09PSBcImZhbHNlXCIpIHJldHVybiBmYWxzZTtcbiAgXG4gIC8vIFx1NTk4Mlx1Njc5Q1x1NjYwRVx1Nzg2RVx1OEJCRVx1N0Y2RVx1NEUzQXRydWVcdUZGMENcdTUyMTlcdTU0MkZcdTc1MjhcbiAgaWYgKGltcG9ydC5tZXRhPy5lbnY/LlZJVEVfVVNFX01PQ0tfQVBJID09PSBcInRydWVcIikgcmV0dXJuIHRydWU7XG4gIFxuICAvLyBcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEJcdTlFRDhcdThCQTRcdTU0MkZcdTc1MjhcdUZGMENcdTUxNzZcdTRFRDZcdTczQUZcdTU4ODNcdTlFRDhcdThCQTRcdTc5ODFcdTc1MjhcbiAgY29uc3QgaXNEZXZlbG9wbWVudCA9IGltcG9ydC5tZXRhPy5lbnY/Lk1PREUgPT09IFwiZGV2ZWxvcG1lbnRcIjtcbiAgXG4gIC8vIFx1NUYzQVx1NTIzNlx1NUYwMFx1NTQyRk1vY2tcdTY3MERcdTUyQTFcdTc1MjhcdTRFOEVcdTZENEJcdThCRDVcbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vLyBcdTVCOUFcdTRFNDlcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkJcdTdDN0JcdTU3OEJcbmV4cG9ydCB0eXBlIExvZ0xldmVsID0gJ25vbmUnIHwgJ2Vycm9yJyB8ICd3YXJuJyB8ICdpbmZvJyB8ICdkZWJ1Zyc7XG5cbmV4cG9ydCBjb25zdCBtb2NrQ29uZmlnID0ge1xuICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhcdTZBMjFcdTYyREZcdTY3MERcdTUyQTFcdUZGMDhcdTU1MkZcdTRFMDBcdTVGMDBcdTUxNzNcdUZGMDlcbiAgZW5hYmxlZDogaXNFbmFibGVkKCksXG4gIFxuICAvLyBcdThCRjdcdTZDNDJcdTVFRjZcdThGREZcdTkxNERcdTdGNkVcdUZGMDhcdTZCRUJcdTc5RDJcdUZGMDlcbiAgZGVsYXk6IHtcbiAgICBtaW46IDEwMCxcbiAgICBtYXg6IDMwMFxuICB9LFxuICBcbiAgLy8gXHU4QkY3XHU2QzQyXHU1OTA0XHU3NDA2XHU5MTREXHU3RjZFXG4gIGFwaToge1xuICAgIC8vIFx1NTdGQVx1Nzg0MFVSTFxuICAgIGJhc2VVcmw6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaVwiLFxuICAgIFxuICAgIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOFx1ODFFQVx1NTJBOFx1NkEyMVx1NjJERlx1RkYwOFx1NUY1M1x1NTQwRVx1N0FFRlx1NjcwRFx1NTJBMVx1NEUwRFx1NTNFRlx1NzUyOFx1NjVGNlx1ODFFQVx1NTJBOFx1NTIwN1x1NjM2Mlx1NTIzMFx1NkEyMVx1NjJERlx1NkEyMVx1NUYwRlx1RkYwOVxuICAgIGF1dG9Nb2NrOiB0cnVlXG4gIH0sXG4gIFxuICAvLyBcdTZBMjFcdTU3NTdcdTU0MkZcdTc1MjhcdTkxNERcdTdGNkVcbiAgbW9kdWxlczoge1xuICAgIGRhdGFzb3VyY2U6IHRydWUsXG4gICAgcXVlcnk6IHRydWUsXG4gICAgaW50ZWdyYXRpb246IHRydWUsXG4gICAgdmVyc2lvbjogdHJ1ZSxcbiAgICBtZXRhZGF0YTogdHJ1ZVxuICB9LFxuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU5MTREXHU3RjZFXG4gIGxvZ2dpbmc6IHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIGxldmVsOiBcImRlYnVnXCIgLy8gZGVidWcsIGluZm8sIHdhcm4sIGVycm9yLCBub25lXG4gIH0sXG4gIFxuICAvLyBcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkIgLSBcdTRGQkZcdTRFOEVcdTc2RjRcdTYzQTVcdThCQkZcdTk1RUVcbiAgZ2V0IGxvZ0xldmVsKCk6IExvZ0xldmVsIHtcbiAgICByZXR1cm4gdGhpcy5sb2dnaW5nLmVuYWJsZWQgPyAodGhpcy5sb2dnaW5nLmxldmVsIGFzIExvZ0xldmVsKSA6ICdub25lJztcbiAgfVxufTtcblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERcdTZBMjFcdTYyREZcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTW9ja0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIC8vIFx1Nzg2RVx1NEZERFx1OEZENFx1NTZERXRydWVcdTRFRTVcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIHJldHVybiBtb2NrQ29uZmlnLmVuYWJsZWQ7XG59XG5cbi8qKlxuICogXHU2OEMwXHU2N0U1XHU3Mjc5XHU1QjlBXHU2QTIxXHU1NzU3XHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XHU2QTIxXHU2MkRGXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc01vZHVsZUVuYWJsZWQobW9kdWxlTmFtZToga2V5b2YgdHlwZW9mIG1vY2tDb25maWcubW9kdWxlcyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbW9ja0NvbmZpZy5lbmFibGVkICYmIG1vY2tDb25maWcubW9kdWxlc1ttb2R1bGVOYW1lXTtcbn1cblxuLyoqXG4gKiBcdThCQjBcdTVGNTVcdTZBMjFcdTYyREZcdTY3MERcdTUyQTFcdTc2RjhcdTUxNzNcdTY1RTVcdTVGRDdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvZ01vY2sobGV2ZWw6IExvZ0xldmVsLCBtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gIGNvbnN0IGNvbmZpZ0xldmVsID0gbW9ja0NvbmZpZy5sb2dMZXZlbDtcbiAgXG4gIC8vIFx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQlx1NEYxOFx1NTE0OFx1N0VBNzogbm9uZSA8IGVycm9yIDwgd2FybiA8IGluZm8gPCBkZWJ1Z1xuICBjb25zdCBsZXZlbHM6IFJlY29yZDxMb2dMZXZlbCwgbnVtYmVyPiA9IHtcbiAgICAnbm9uZSc6IDAsXG4gICAgJ2Vycm9yJzogMSxcbiAgICAnd2Fybic6IDIsXG4gICAgJ2luZm8nOiAzLFxuICAgICdkZWJ1Zyc6IDRcbiAgfTtcbiAgXG4gIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUU5NFx1OEJCMFx1NUY1NVx1NkI2NFx1N0VBN1x1NTIyQlx1NzY4NFx1NjVFNVx1NUZEN1xuICBpZiAobGV2ZWxzW2NvbmZpZ0xldmVsXSA+PSBsZXZlbHNbbGV2ZWxdKSB7XG4gICAgY29uc3QgcHJlZml4ID0gYFtNb2NrICR7bGV2ZWwudG9VcHBlckNhc2UoKX1dYDtcbiAgICBcbiAgICBzd2l0Y2ggKGxldmVsKSB7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIGNvbnNvbGUuZXJyb3IocHJlZml4LCBtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3YXJuJzpcbiAgICAgICAgY29uc29sZS53YXJuKHByZWZpeCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgIGNvbnNvbGUuaW5mbyhwcmVmaXgsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RlYnVnJzpcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhwcmVmaXgsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERNb2NrXHU5MTREXHU3RjZFXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb2NrQ29uZmlnKCkge1xuICByZXR1cm4geyAuLi5tb2NrQ29uZmlnIH07XG59XG5cbi8qKlxuICogXHU1RjNBXHU1MjM2XHU2MjUzXHU1MzcwXHU1RjUzXHU1MjREXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxXHVGRjBDXHU2NUI5XHU0RkJGXHU4QzAzXHU4QkQ1XG4gKi9cbmNvbnNvbGUuaW5mbygnW01vY2tcdTkxNERcdTdGNkVdIE1vY2tcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDE6JywgbW9ja0NvbmZpZy5lbmFibGVkID8gJ1x1NURGMlx1NTQyRlx1NzUyOCcgOiAnXHU1REYyXHU3OTgxXHU3NTI4Jyk7XG5jb25zb2xlLmluZm8oJ1tNb2NrXHU5MTREXHU3RjZFXSBBUElcdTU3RkFcdTc4NDBVUkw6JywgbW9ja0NvbmZpZy5hcGkuYmFzZVVybCk7XG5jb25zb2xlLmluZm8oJ1tNb2NrXHU5MTREXHU3RjZFXSBcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkI6JywgbW9ja0NvbmZpZy5sb2dMZXZlbCk7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzXCI7LyoqXG4gKiBcdTY1NzBcdTYzNkVcdTZFOTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2NTcwXHU2MzZFXHU2RTkwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHVGRjBDXHU3NTI4XHU0RThFXHU1RjAwXHU1M0QxXHU1NDhDXHU2RDRCXHU4QkQ1XG4gKi9cblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU3QzdCXHU1NzhCXG5leHBvcnQgdHlwZSBEYXRhU291cmNlVHlwZSA9ICdteXNxbCcgfCAncG9zdGdyZXNxbCcgfCAnb3JhY2xlJyB8ICdzcWxzZXJ2ZXInIHwgJ3NxbGl0ZSc7XG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NzJCNlx1NjAwMVxuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZVN0YXR1cyA9ICdhY3RpdmUnIHwgJ2luYWN0aXZlJyB8ICdlcnJvcicgfCAncGVuZGluZyc7XG5cbi8vIFx1NTQwQ1x1NkI2NVx1OTg5MVx1NzM4N1xuZXhwb3J0IHR5cGUgU3luY0ZyZXF1ZW5jeSA9ICdtYW51YWwnIHwgJ2hvdXJseScgfCAnZGFpbHknIHwgJ3dlZWtseScgfCAnbW9udGhseSc7XG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjNBNVx1NTNFM1xuZXhwb3J0IGludGVyZmFjZSBEYXRhU291cmNlIHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgdHlwZTogRGF0YVNvdXJjZVR5cGU7XG4gIGhvc3Q/OiBzdHJpbmc7XG4gIHBvcnQ/OiBudW1iZXI7XG4gIGRhdGFiYXNlTmFtZT86IHN0cmluZztcbiAgdXNlcm5hbWU/OiBzdHJpbmc7XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xuICBzdGF0dXM6IERhdGFTb3VyY2VTdGF0dXM7XG4gIHN5bmNGcmVxdWVuY3k/OiBTeW5jRnJlcXVlbmN5O1xuICBsYXN0U3luY1RpbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjcmVhdGVkQXQ6IHN0cmluZztcbiAgdXBkYXRlZEF0OiBzdHJpbmc7XG4gIGlzQWN0aXZlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICovXG5leHBvcnQgY29uc3QgbW9ja0RhdGFTb3VyY2VzOiBEYXRhU291cmNlW10gPSBbXG4gIHtcbiAgICBpZDogJ2RzLTEnLFxuICAgIG5hbWU6ICdNeVNRTFx1NzkzQVx1NEY4Qlx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTc5M0FcdTRGOEJNeVNRTFx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ215c3FsJyxcbiAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICBwb3J0OiAzMzA2LFxuICAgIGRhdGFiYXNlTmFtZTogJ2V4YW1wbGVfZGInLFxuICAgIHVzZXJuYW1lOiAndXNlcicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTInLFxuICAgIG5hbWU6ICdQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFBvc3RncmVTUUxcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdwb3N0Z3Jlc3FsJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjEwMCcsXG4gICAgcG9ydDogNTQzMixcbiAgICBkYXRhYmFzZU5hbWU6ICdwcm9kdWN0aW9uX2RiJyxcbiAgICB1c2VybmFtZTogJ2FkbWluJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdob3VybHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNzc3NjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMycsXG4gICAgbmFtZTogJ1NRTGl0ZVx1NjcyQ1x1NTczMFx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY3MkNcdTU3MzBTUUxpdGVcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdzcWxpdGUnLFxuICAgIGRhdGFiYXNlTmFtZTogJy9wYXRoL3RvL2xvY2FsLmRiJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdtYW51YWwnLFxuICAgIGxhc3RTeW5jVGltZTogbnVsbCxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM0NTYwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy00JyxcbiAgICBuYW1lOiAnU1FMIFNlcnZlclx1NkQ0Qlx1OEJENVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU3M0FGXHU1ODgzJyxcbiAgICB0eXBlOiAnc3Fsc2VydmVyJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjIwMCcsXG4gICAgcG9ydDogMTQzMyxcbiAgICBkYXRhYmFzZU5hbWU6ICd0ZXN0X2RiJyxcbiAgICB1c2VybmFtZTogJ3Rlc3RlcicsXG4gICAgc3RhdHVzOiAnaW5hY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICd3ZWVrbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDYwNDgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA1MTg0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IGZhbHNlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTUnLFxuICAgIG5hbWU6ICdPcmFjbGVcdTRGMDFcdTRFMUFcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwT3JhY2xlXHU0RjAxXHU0RTFBXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnb3JhY2xlJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjE1MCcsXG4gICAgcG9ydDogMTUyMSxcbiAgICBkYXRhYmFzZU5hbWU6ICdlbnRlcnByaXNlX2RiJyxcbiAgICB1c2VybmFtZTogJ3N5c3RlbScsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxMDM2ODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH1cbl07XG5cbi8qKlxuICogXHU3NTFGXHU2MjEwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gY291bnQgXHU3NTFGXHU2MjEwXHU2NTcwXHU5MUNGXG4gKiBAcmV0dXJucyBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTdFQzRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTW9ja0RhdGFTb3VyY2VzKGNvdW50OiBudW1iZXIgPSA1KTogRGF0YVNvdXJjZVtdIHtcbiAgY29uc3QgdHlwZXM6IERhdGFTb3VyY2VUeXBlW10gPSBbJ215c3FsJywgJ3Bvc3RncmVzcWwnLCAnb3JhY2xlJywgJ3NxbHNlcnZlcicsICdzcWxpdGUnXTtcbiAgY29uc3Qgc3RhdHVzZXM6IERhdGFTb3VyY2VTdGF0dXNbXSA9IFsnYWN0aXZlJywgJ2luYWN0aXZlJywgJ2Vycm9yJywgJ3BlbmRpbmcnXTtcbiAgY29uc3Qgc3luY0ZyZXFzOiBTeW5jRnJlcXVlbmN5W10gPSBbJ21hbnVhbCcsICdob3VybHknLCAnZGFpbHknLCAnd2Vla2x5JywgJ21vbnRobHknXTtcbiAgXG4gIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9LCAoXywgaSkgPT4ge1xuICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpICUgdHlwZXMubGVuZ3RoXTtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICBpZDogYGRzLWdlbi0ke2kgKyAxfWAsXG4gICAgICBuYW1lOiBgXHU3NTFGXHU2MjEwXHU3Njg0JHt0eXBlfVx1NjU3MFx1NjM2RVx1NkU5MCAke2kgKyAxfWAsXG4gICAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1NzY4NCR7dHlwZX1cdTdDN0JcdTU3OEJcdTY1NzBcdTYzNkVcdTZFOTAgJHtpICsgMX1gLFxuICAgICAgdHlwZSxcbiAgICAgIGhvc3Q6IHR5cGUgIT09ICdzcWxpdGUnID8gJ2xvY2FsaG9zdCcgOiB1bmRlZmluZWQsXG4gICAgICBwb3J0OiB0eXBlICE9PSAnc3FsaXRlJyA/ICgzMzA2ICsgaSkgOiB1bmRlZmluZWQsXG4gICAgICBkYXRhYmFzZU5hbWU6IHR5cGUgPT09ICdzcWxpdGUnID8gYC9wYXRoL3RvL2RiXyR7aX0uZGJgIDogYGV4YW1wbGVfZGJfJHtpfWAsXG4gICAgICB1c2VybmFtZTogdHlwZSAhPT0gJ3NxbGl0ZScgPyBgdXNlcl8ke2l9YCA6IHVuZGVmaW5lZCxcbiAgICAgIHN0YXR1czogc3RhdHVzZXNbaSAlIHN0YXR1c2VzLmxlbmd0aF0sXG4gICAgICBzeW5jRnJlcXVlbmN5OiBzeW5jRnJlcXNbaSAlIHN5bmNGcmVxcy5sZW5ndGhdLFxuICAgICAgbGFzdFN5bmNUaW1lOiBpICUgMyA9PT0gMCA/IG51bGwgOiBuZXcgRGF0ZShub3cgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKG5vdyAtIChpICsgMTApICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKG5vdyAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGlzQWN0aXZlOiBpICUgNCAhPT0gMFxuICAgIH07XG4gIH0pO1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTlFRDhcdThCQTRcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbmV4cG9ydCBkZWZhdWx0IG1vY2tEYXRhU291cmNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzXCI7LyoqXG4gKiBcdTY1NzBcdTYzNkVcdTZFOTBNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjU3MFx1NjM2RVx1NkU5MFx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IG1vY2tEYXRhU291cmNlcyB9IGZyb20gJy4uL2RhdGEvZGF0YXNvdXJjZSc7XG5pbXBvcnQgdHlwZSB7IERhdGFTb3VyY2UgfSBmcm9tICcuLi9kYXRhL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NEUzNFx1NjVGNlx1NUI1OFx1NTBBOFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1RkYwQ1x1NTE0MVx1OEJCOFx1NkEyMVx1NjJERlx1NTg5RVx1NTIyMFx1NjUzOVx1NjRDRFx1NEY1Q1xubGV0IGRhdGFTb3VyY2VzID0gWy4uLm1vY2tEYXRhU291cmNlc107XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNpbXVsYXRlRGVsYXkoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRlbGF5ID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xufVxuXG4vKipcbiAqIFx1OTFDRFx1N0Y2RVx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1NjM2RVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzZXREYXRhU291cmNlcygpOiB2b2lkIHtcbiAgZGF0YVNvdXJjZXMgPSBbLi4ubW9ja0RhdGFTb3VyY2VzXTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqIEBwYXJhbSBwYXJhbXMgXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwXG4gKiBAcmV0dXJucyBcdTUyMDZcdTk4NzVcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFTb3VyY2VzKHBhcmFtcz86IHtcbiAgcGFnZT86IG51bWJlcjtcbiAgc2l6ZT86IG51bWJlcjtcbiAgbmFtZT86IHN0cmluZztcbiAgdHlwZT86IHN0cmluZztcbiAgc3RhdHVzPzogc3RyaW5nO1xufSk6IFByb21pc2U8e1xuICBpdGVtczogRGF0YVNvdXJjZVtdO1xuICBwYWdpbmF0aW9uOiB7XG4gICAgdG90YWw6IG51bWJlcjtcbiAgICBwYWdlOiBudW1iZXI7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIHRvdGFsUGFnZXM6IG51bWJlcjtcbiAgfTtcbn0+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgXG4gIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICBsZXQgZmlsdGVyZWRJdGVtcyA9IFsuLi5kYXRhU291cmNlc107XG4gIFxuICAvLyBcdTYzMDlcdTU0MERcdTc5RjBcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgIGNvbnN0IGtleXdvcmQgPSBwYXJhbXMubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBcbiAgICAgIGRzLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgIChkcy5kZXNjcmlwdGlvbiAmJiBkcy5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICk7XG4gIH1cbiAgXG4gIC8vIFx1NjMwOVx1N0M3Qlx1NTc4Qlx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy50eXBlKSB7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IGRzLnR5cGUgPT09IHBhcmFtcy50eXBlKTtcbiAgfVxuICBcbiAgLy8gXHU2MzA5XHU3MkI2XHU2MDAxXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBkcy5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICB9XG4gIFxuICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5zbGljZShzdGFydCwgZW5kKTtcbiAgXG4gIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICByZXR1cm4ge1xuICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0b3RhbDogZmlsdGVyZWRJdGVtcy5sZW5ndGgsXG4gICAgICBwYWdlLFxuICAgICAgc2l6ZSxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmaWx0ZXJlZEl0ZW1zLmxlbmd0aCAvIHNpemUpXG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKiBAcmV0dXJucyBcdTY1NzBcdTYzNkVcdTZFOTBcdThCRTZcdTYwQzVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFTb3VyY2UoaWQ6IHN0cmluZyk6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2N0U1XHU2MjdFXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IGRhdGFTb3VyY2UgPSBkYXRhU291cmNlcy5maW5kKGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoIWRhdGFTb3VyY2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgcmV0dXJuIGRhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gZGF0YSBcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTYzNkVcbiAqIEByZXR1cm5zIFx1NTIxQlx1NUVGQVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlRGF0YVNvdXJjZShkYXRhOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBJRFxuICBjb25zdCBuZXdJZCA9IGBkcy0ke0RhdGUubm93KCl9YDtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCBuZXdEYXRhU291cmNlOiBEYXRhU291cmNlID0ge1xuICAgIGlkOiBuZXdJZCxcbiAgICBuYW1lOiBkYXRhLm5hbWUgfHwgJ05ldyBEYXRhIFNvdXJjZScsXG4gICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgdHlwZTogZGF0YS50eXBlIHx8ICdteXNxbCcsXG4gICAgaG9zdDogZGF0YS5ob3N0LFxuICAgIHBvcnQ6IGRhdGEucG9ydCxcbiAgICBkYXRhYmFzZU5hbWU6IGRhdGEuZGF0YWJhc2VOYW1lLFxuICAgIHVzZXJuYW1lOiBkYXRhLnVzZXJuYW1lLFxuICAgIHN0YXR1czogZGF0YS5zdGF0dXMgfHwgJ3BlbmRpbmcnLFxuICAgIHN5bmNGcmVxdWVuY3k6IGRhdGEuc3luY0ZyZXF1ZW5jeSB8fCAnbWFudWFsJyxcbiAgICBsYXN0U3luY1RpbWU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfTtcbiAgXG4gIC8vIFx1NkRGQlx1NTJBMFx1NTIzMFx1NTIxN1x1ODg2OFxuICBkYXRhU291cmNlcy5wdXNoKG5ld0RhdGFTb3VyY2UpO1xuICBcbiAgcmV0dXJuIG5ld0RhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqIEBwYXJhbSBkYXRhIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVxuICogQHJldHVybnMgXHU2NkY0XHU2NUIwXHU1NDBFXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVEYXRhU291cmNlKGlkOiBzdHJpbmcsIGRhdGE6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjI3RVx1NTIzMFx1ODk4MVx1NjZGNFx1NjVCMFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFx1N0QyMlx1NUYxNVxuICBjb25zdCBpbmRleCA9IGRhdGFTb3VyY2VzLmZpbmRJbmRleChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgdXBkYXRlZERhdGFTb3VyY2U6IERhdGFTb3VyY2UgPSB7XG4gICAgLi4uZGF0YVNvdXJjZXNbaW5kZXhdLFxuICAgIC4uLmRhdGEsXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgfTtcbiAgXG4gIC8vIFx1NjZGRlx1NjM2Mlx1NjU3MFx1NjM2RVx1NkU5MFxuICBkYXRhU291cmNlc1tpbmRleF0gPSB1cGRhdGVkRGF0YVNvdXJjZTtcbiAgXG4gIHJldHVybiB1cGRhdGVkRGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlRGF0YVNvdXJjZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTYyN0VcdTUyMzBcdTg5ODFcdTUyMjBcdTk2NjRcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcdTdEMjJcdTVGMTVcbiAgY29uc3QgaW5kZXggPSBkYXRhU291cmNlcy5maW5kSW5kZXgoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgLy8gXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGRhdGFTb3VyY2VzLnNwbGljZShpbmRleCwgMSk7XG59XG5cbi8qKlxuICogXHU2RDRCXHU4QkQ1XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkRFXHU2M0E1XG4gKiBAcGFyYW0gcGFyYW1zIFx1OEZERVx1NjNBNVx1NTNDMlx1NjU3MFxuICogQHJldHVybnMgXHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU3RUQzXHU2NzlDXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0Q29ubmVjdGlvbihwYXJhbXM6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPHtcbiAgc3VjY2VzczogYm9vbGVhbjtcbiAgbWVzc2FnZT86IHN0cmluZztcbiAgZGV0YWlscz86IGFueTtcbn0+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NUI5RVx1OTY0NVx1NEY3Rlx1NzUyOFx1NjVGNlx1NTNFRlx1ODBGRFx1NEYxQVx1NjcwOVx1NjZGNFx1NTkwRFx1Njc0Mlx1NzY4NFx1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1OTAzQlx1OEY5MVxuICAvLyBcdThGRDlcdTkxQ0NcdTdCODBcdTUzNTVcdTZBMjFcdTYyREZcdTYyMTBcdTUyOUYvXHU1OTMxXHU4RDI1XG4gIGNvbnN0IHN1Y2Nlc3MgPSBNYXRoLnJhbmRvbSgpID4gMC4yOyAvLyA4MCVcdTYyMTBcdTUyOUZcdTczODdcbiAgXG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBtZXNzYWdlOiBzdWNjZXNzID8gJ1x1OEZERVx1NjNBNVx1NjIxMFx1NTI5RicgOiAnXHU4RkRFXHU2M0E1XHU1OTMxXHU4RDI1OiBcdTY1RTBcdTZDRDVcdThGREVcdTYzQTVcdTUyMzBcdTY1NzBcdTYzNkVcdTVFOTNcdTY3MERcdTUyQTFcdTU2NjgnLFxuICAgIGRldGFpbHM6IHN1Y2Nlc3MgPyB7XG4gICAgICByZXNwb25zZVRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSArIDEwLFxuICAgICAgdmVyc2lvbjogJzguMC4yOCcsXG4gICAgICBjb25uZWN0aW9uSWQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKSArIDEwMDBcbiAgICB9IDoge1xuICAgICAgZXJyb3JDb2RlOiAnQ09OTkVDVElPTl9SRUZVU0VEJyxcbiAgICAgIGVycm9yRGV0YWlsczogJ1x1NjVFMFx1NkNENVx1NUVGQVx1N0FDQlx1NTIzMFx1NjcwRFx1NTJBMVx1NTY2OFx1NzY4NFx1OEZERVx1NjNBNVx1RkYwQ1x1OEJGN1x1NjhDMFx1NjdFNVx1N0Y1MVx1N0VEQ1x1OEJCRVx1N0Y2RVx1NTQ4Q1x1NTFFRFx1NjM2RSdcbiAgICB9XG4gIH07XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXREYXRhU291cmNlcyxcbiAgZ2V0RGF0YVNvdXJjZSxcbiAgY3JlYXRlRGF0YVNvdXJjZSxcbiAgdXBkYXRlRGF0YVNvdXJjZSxcbiAgZGVsZXRlRGF0YVNvdXJjZSxcbiAgdGVzdENvbm5lY3Rpb24sXG4gIHJlc2V0RGF0YVNvdXJjZXNcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvdXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5MDFBXHU3NTI4XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NTIxQlx1NUVGQVx1N0VERlx1NEUwMFx1NjgzQ1x1NUYwRlx1NTRDRFx1NUU5NFx1NzY4NFx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuICovXG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2QTIxXHU2MkRGQVBJXHU2MjEwXHU1MjlGXHU1NENEXHU1RTk0XG4gKiBAcGFyYW0gZGF0YSBcdTU0Q0RcdTVFOTRcdTY1NzBcdTYzNkVcbiAqIEBwYXJhbSBzdWNjZXNzIFx1NjIxMFx1NTI5Rlx1NzJCNlx1NjAwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQXRydWVcbiAqIEBwYXJhbSBtZXNzYWdlIFx1NTNFRlx1OTAwOVx1NkQ4OFx1NjA2RlxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHU3Njg0QVBJXHU1NENEXHU1RTk0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrUmVzcG9uc2U8VD4oXG4gIGRhdGE6IFQsIFxuICBzdWNjZXNzOiBib29sZWFuID0gdHJ1ZSwgXG4gIG1lc3NhZ2U/OiBzdHJpbmdcbikge1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3MsXG4gICAgZGF0YSxcbiAgICBtZXNzYWdlLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIG1vY2tSZXNwb25zZTogdHJ1ZSAvLyBcdTY4MDdcdThCQjBcdTRFM0FcdTZBMjFcdTYyREZcdTU0Q0RcdTVFOTRcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTZBMjFcdTYyREZBUElcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqIEBwYXJhbSBtZXNzYWdlIFx1OTUxOVx1OEJFRlx1NkQ4OFx1NjA2RlxuICogQHBhcmFtIGNvZGUgXHU5NTE5XHU4QkVGXHU0RUUzXHU3ODAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBJ01PQ0tfRVJST1InXG4gKiBAcGFyYW0gc3RhdHVzIEhUVFBcdTcyQjZcdTYwMDFcdTc4MDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0E1MDBcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NjgzQ1x1NUYwRlx1NzY4NFx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UoXG4gIG1lc3NhZ2U6IHN0cmluZywgXG4gIGNvZGU6IHN0cmluZyA9ICdNT0NLX0VSUk9SJywgXG4gIHN0YXR1czogbnVtYmVyID0gNTAwXG4pIHtcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICBlcnJvcjoge1xuICAgICAgbWVzc2FnZSxcbiAgICAgIGNvZGUsXG4gICAgICBzdGF0dXNDb2RlOiBzdGF0dXNcbiAgICB9LFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIG1vY2tSZXNwb25zZTogdHJ1ZVxuICB9O1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NFx1N0VEM1x1Njc4NFxuICogQHBhcmFtIGl0ZW1zIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzY4NFx1OTg3OVx1NzZFRVx1NTIxN1x1ODg2OFxuICogQHBhcmFtIHRvdGFsSXRlbXMgXHU2MDNCXHU5ODc5XHU3NkVFXHU2NTcwXG4gKiBAcGFyYW0gcGFnZSBcdTVGNTNcdTUyNERcdTk4NzVcdTc4MDFcbiAqIEBwYXJhbSBzaXplIFx1NkJDRlx1OTg3NVx1NTkyN1x1NUMwRlxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU1MjA2XHU5ODc1XHU1NENEXHU1RTk0XHU3RUQzXHU2Nzg0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2U8VD4oXG4gIGl0ZW1zOiBUW10sXG4gIHRvdGFsSXRlbXM6IG51bWJlcixcbiAgcGFnZTogbnVtYmVyID0gMSxcbiAgc2l6ZTogbnVtYmVyID0gMTBcbikge1xuICByZXR1cm4gY3JlYXRlTW9ja1Jlc3BvbnNlKHtcbiAgICBpdGVtcyxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0b3RhbDogdG90YWxJdGVtcyxcbiAgICAgIHBhZ2UsXG4gICAgICBzaXplLFxuICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsSXRlbXMgLyBzaXplKSxcbiAgICAgIGhhc01vcmU6IHBhZ2UgKiBzaXplIDwgdG90YWxJdGVtc1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XHU1RUY2XHU4RkRGXG4gKiBAcGFyYW0gbXMgXHU1RUY2XHU4RkRGXHU2QkVCXHU3OUQyXHU2NTcwXHVGRjBDXHU5RUQ4XHU4QkE0MzAwbXNcbiAqIEByZXR1cm5zIFByb21pc2VcdTVCRjlcdThDNjFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIgPSAzMDApOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5NkM2XHU0RTJEXHU1QkZDXHU1MUZBXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1N0VERlx1NEUwMFx1NzY4NEFQSSBNb2NrXHU2NzBEXHU1MkExXHU1MTY1XHU1M0UzXHU3MEI5XG4gKi9cblxuLy8gXHU1QkZDXHU1MTY1XHU2NTcwXHU2MzZFXHU2RTkwXHU2NzBEXHU1MkExXG5pbXBvcnQgZGF0YVNvdXJjZSBmcm9tICcuL2RhdGFzb3VyY2UnO1xuXG4vLyBcdTVCRkNcdTUxNjVcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbmltcG9ydCB7IFxuICBjcmVhdGVNb2NrUmVzcG9uc2UsIFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSwgXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXkgXG59IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMU1vY2tcbiAqL1xuY29uc3QgcXVlcnkgPSB7XG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJpZXMocGFyYW1zOiB7IHBhZ2U6IG51bWJlcjsgc2l6ZTogbnVtYmVyOyB9KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4gY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlKHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgaWQ6ICdxMScsIG5hbWU6ICdcdTc1MjhcdTYyMzdcdTUyMDZcdTY3OTBcdTY3RTVcdThCRTInLCBkZXNjcmlwdGlvbjogJ1x1NjMwOVx1NTczMFx1NTMzQVx1N0VERlx1OEJBMVx1NzUyOFx1NjIzN1x1NkNFOFx1NTE4Q1x1NjU3MFx1NjM2RScsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICAgIHsgaWQ6ICdxMicsIG5hbWU6ICdcdTk1MDBcdTU1MkVcdTRFMUFcdTdFRTlcdTY3RTVcdThCRTInLCBkZXNjcmlwdGlvbjogJ1x1NjMwOVx1NjcwOFx1N0VERlx1OEJBMVx1OTUwMFx1NTUyRVx1OTg5RCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICAgIHsgaWQ6ICdxMycsIG5hbWU6ICdcdTVFOTNcdTVCNThcdTUyMDZcdTY3OTAnLCBkZXNjcmlwdGlvbjogJ1x1NzZEMVx1NjNBN1x1NUU5M1x1NUI1OFx1NkMzNFx1NUU3MycsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICBdLFxuICAgICAgdG90YWw6IDMsXG4gICAgICBwYWdlOiBwYXJhbXMucGFnZSxcbiAgICAgIHNpemU6IHBhcmFtcy5zaXplXG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnkoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogJ1x1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMicsXG4gICAgICBzcWw6ICdTRUxFQ1QgKiBGUk9NIHVzZXJzIFdIRVJFIHN0YXR1cyA9ICQxJyxcbiAgICAgIHBhcmFtZXRlcnM6IFsnYWN0aXZlJ10sXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBjcmVhdGVRdWVyeShkYXRhOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZDogYHF1ZXJ5LSR7RGF0ZS5ub3coKX1gLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIHVwZGF0ZVF1ZXJ5KGlkOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBkZWxldGVRdWVyeShpZDogc3RyaW5nKSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZVF1ZXJ5KGlkOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgY29sdW1uczogWydpZCcsICduYW1lJywgJ2VtYWlsJywgJ3N0YXR1cyddLFxuICAgICAgcm93czogW1xuICAgICAgICB7IGlkOiAxLCBuYW1lOiAnXHU1RjIwXHU0RTA5JywgZW1haWw6ICd6aGFuZ0BleGFtcGxlLmNvbScsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgICAgICAgeyBpZDogMiwgbmFtZTogJ1x1Njc0RVx1NTZEQicsIGVtYWlsOiAnbGlAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIG5hbWU6ICdcdTczOEJcdTRFOTQnLCBlbWFpbDogJ3dhbmdAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdpbmFjdGl2ZScgfSxcbiAgICAgIF0sXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBleGVjdXRpb25UaW1lOiAwLjIzNSxcbiAgICAgICAgcm93Q291bnQ6IDMsXG4gICAgICAgIHRvdGFsUGFnZXM6IDFcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIFx1NUJGQ1x1NTFGQVx1NjI0MFx1NjcwOVx1NjcwRFx1NTJBMVxuICovXG5jb25zdCBzZXJ2aWNlcyA9IHtcbiAgZGF0YVNvdXJjZSxcbiAgcXVlcnlcbn07XG5cbi8vIFx1NUJGQ1x1NTFGQW1vY2sgc2VydmljZVx1NURFNVx1NTE3N1xuZXhwb3J0IHtcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSxcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheVxufTtcblxuLy8gXHU1QkZDXHU1MUZBXHU1NDA0XHU0RTJBXHU2NzBEXHU1MkExXG5leHBvcnQgY29uc3QgZGF0YVNvdXJjZVNlcnZpY2UgPSBzZXJ2aWNlcy5kYXRhU291cmNlO1xuZXhwb3J0IGNvbnN0IHF1ZXJ5U2VydmljZSA9IHNlcnZpY2VzLnF1ZXJ5O1xuXG4vLyBcdTlFRDhcdThCQTRcdTVCRkNcdTUxRkFcdTYyNDBcdTY3MDlcdTY3MERcdTUyQTFcbmV4cG9ydCBkZWZhdWx0IHNlcnZpY2VzOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1N0JBMVx1NzQwNlx1NkEyMVx1NTc1N1xuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRIVFRQXHU4QkY3XHU2QzQyXHU2MkU2XHU2MjJBXHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU3NTI4XHU0RThFXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XG4gKiBcdThEMUZcdThEMjNcdTdCQTFcdTc0MDZcdTU0OENcdTUyMDZcdTUzRDFcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTUyMzBcdTVCRjlcdTVFOTRcdTc2ODRcdTY3MERcdTUyQTFcdTU5MDRcdTc0MDZcdTUxRkRcdTY1NzBcbiAqL1xuXG5pbXBvcnQgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgKiBhcyBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IHsgaXNNb2NrRW5hYmxlZCwgbG9nTW9jaywgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgc2VydmljZXMgZnJvbSAnLi4vc2VydmljZXMnO1xuaW1wb3J0IHsgY3JlYXRlTW9ja1Jlc3BvbnNlLCBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSB9IGZyb20gJy4uL3NlcnZpY2VzL3V0aWxzJztcblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XG4gKiBcbiAqIFx1NkI2NFx1NEUyRFx1OTVGNFx1NEVGNlx1NjJFNlx1NjIyQUFQSVx1OEJGN1x1NkM0Mlx1NUU3Nlx1NjNEMFx1NEY5Qlx1NkEyMVx1NjJERlx1NTRDRFx1NUU5NFxuICogXHU1M0VBXHU1OTA0XHU3NDA2L2FwaVx1NUYwMFx1NTkzNFx1NzY4NFx1OEJGN1x1NkM0Mlx1RkYwQ1x1NTE3Nlx1NEVENlx1OEJGN1x1NkM0Mlx1NzZGNFx1NjNBNVx1NjUzRVx1ODg0Q1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVNb2NrTWlkZGxld2FyZSgpOiBDb25uZWN0Lk5leHRIYW5kbGVGdW5jdGlvbiB7XG4gIC8vIFx1NTk4Mlx1Njc5Q01vY2tcdTY3MERcdTUyQTFcdTg4QUJcdTc5ODFcdTc1MjhcdUZGMENcdTc2RjRcdTYzQTVcdThGRDRcdTU2REVcdTRFMDBcdTRFMkFcdTRFMERcdTUwNUFcdTRFRkJcdTRGNTVcdTU5MDRcdTc0MDZcdTc2ODRcdTRFMkRcdTk1RjRcdTRFRjZcbiAgaWYgKCFpc01vY2tFbmFibGVkKCkpIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NjcwRFx1NTJBMVx1NURGMlx1Nzk4MVx1NzUyOFx1RkYwQ1x1NjI0MFx1NjcwOVx1OEJGN1x1NkM0Mlx1NUMwNlx1NzZGNFx1NjNBNVx1NEYyMFx1OTAxMicpO1xuICAgIHJldHVybiAocmVxLCByZXMsIG5leHQpID0+IG5leHQoKTtcbiAgfVxuICBcbiAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTUyMUJcdTVFRkFcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTUzRUFcdTYyRTZcdTYyMkEvYXBpXHU1RjAwXHU1OTM0XHU3Njg0XHU4QkY3XHU2QzQyJyk7XG4gIFxuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbW9ja01pZGRsZXdhcmUoXG4gICAgcmVxOiBDb25uZWN0LkluY29taW5nTWVzc2FnZSwgXG4gICAgcmVzOiBodHRwLlNlcnZlclJlc3BvbnNlLCBcbiAgICBuZXh0OiBDb25uZWN0Lk5leHRGdW5jdGlvblxuICApIHtcbiAgICAvLyBcdTUzRUFcdTU5MDRcdTc0MDYvYXBpXHU1RjAwXHU1OTM0XHU3Njg0XHU4QkY3XHU2QzQyXG4gICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICBcbiAgICAvLyBcdTRFMjVcdTY4M0NcdTY4QzBcdTY3RTVVUkxcdTY2MkZcdTU0MjZcdTRFRTUvYXBpL1x1NUYwMFx1NTkzNFx1RkYwQ1x1NEUwRFx1NjYyRlx1NTIxOVx1N0FDQlx1NTM3M1x1NjUzRVx1ODg0Q1xuICAgIGlmICghdXJsLnN0YXJ0c1dpdGgoJy9hcGkvJykpIHtcbiAgICAgIC8vIFx1NEUwRFx1OEJCMFx1NUY1NVx1NjVFNVx1NUZEN1x1NEVFNVx1OTA3Rlx1NTE0RFx1NjVFNVx1NUZEN1x1OEZDN1x1NTkxQVxuICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICB9XG4gICAgXG4gICAgbG9nTW9jaygnaW5mbycsIGBbTW9ja10gXHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgICAgIGhhbmRsZU9wdGlvbnNSZXF1ZXN0KHJlcyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU4OUUzXHU2NzkwXHU4QkY3XHU2QzQyXHU2NTcwXHU2MzZFXG4gICAgICBjb25zdCByZXFCb2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1OEJGN1x1NkM0Mlx1NEY1MzpgLCByZXFCb2R5KTtcbiAgICAgIFxuICAgICAgLy8gXHU4M0I3XHU1M0Q2XHU4QkY3XHU2QzQyXHU4REVGXHU1Rjg0XHU1NDhDXHU2NUI5XHU2Q0Q1XG4gICAgICBjb25zdCBwYXRoID0gdXJsO1xuICAgICAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKSB8fCAnR0VUJztcbiAgICAgIFxuICAgICAgLy8gXHU2REZCXHU1MkEwXHU1RUY2XHU4RkRGXHU2QTIxXHU2MkRGXHU3RjUxXHU3RURDXHU1RUY2XHU4RkRGXG4gICAgICBhd2FpdCBhZGREZWxheSgpO1xuICAgICAgXG4gICAgICAvLyBcdThERUZcdTc1MzFcdTUyMDZcdTUzRDFcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAvLyBcdTY1NzBcdTYzNkVcdTZFOTBBUElcbiAgICAgICAgY2FzZSBwYXRoLmluY2x1ZGVzKCcvYXBpL2RhdGFzb3VyY2VzJyk6XG4gICAgICAgICAgYXdhaXQgaGFuZGxlRGF0YVNvdXJjZVJlcXVlc3QocGF0aCwgbWV0aG9kLCByZXFCb2R5LCByZXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU2N0U1XHU4QkUyQVBJXG4gICAgICAgIGNhc2UgcGF0aC5pbmNsdWRlcygnL2FwaS9xdWVyaWVzJyk6XG4gICAgICAgICAgYXdhaXQgaGFuZGxlUXVlcnlSZXF1ZXN0KHBhdGgsIG1ldGhvZCwgcmVxQm9keSwgcmVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTE3Nlx1NEVENkFQSVx1OEJGN1x1NkM0MlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIFx1NzUxRlx1NjIxMFx1NEUwMFx1NEUyQVx1OTAxQVx1NzUyOFx1NTRDRFx1NUU5NFxuICAgICAgICAgIGxvZ01vY2soJ3dhcm4nLCBgW01vY2tdIFx1NjcyQVx1NTMzOVx1OTE0RFx1NzY4NEFQSTogJHttZXRob2R9ICR7cGF0aH1gKTtcbiAgICAgICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBNb2NrIHJlc3BvbnNlIGZvciAke21ldGhvZH0gJHtwYXRofWAsXG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ01vY2soJ2Vycm9yJywgYFtNb2NrXSBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTUxRkFcdTk1MTk6YCwgZXJyb3IpO1xuICAgICAgaGFuZGxlRXJyb3IocmVzLCBlcnJvcik7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFx1NTkwNFx1NzQwNlx1NjU3MFx1NjM2RVx1NkU5MFx1NzZGOFx1NTE3M1x1OEJGN1x1NkM0MlxuICovXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVEYXRhU291cmNlUmVxdWVzdChcbiAgcGF0aDogc3RyaW5nLCBcbiAgbWV0aG9kOiBzdHJpbmcsIFxuICBib2R5OiBhbnksIFxuICByZXM6IGh0dHAuU2VydmVyUmVzcG9uc2Vcbikge1xuICB0cnkge1xuICAgIGxvZ01vY2soJ2luZm8nLCBgW01vY2tdIFx1NTkwNFx1NzQwNlx1NjU3MFx1NjM2RVx1NkU5MFx1OEJGN1x1NkM0MjogJHttZXRob2R9ICR7cGF0aH1gKTtcbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgICBjb25zdCBzaW5nbGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvKFteXFwvXSspJC8pO1xuICAgIGlmIChzaW5nbGVNYXRjaCAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICBjb25zdCBpZCA9IHNpbmdsZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MDogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5kYXRhU291cmNlLmdldERhdGFTb3VyY2UoaWQpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAgICBpZiAocGF0aC5tYXRjaCgvXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC8/JC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhgKTtcbiAgICAgIFxuICAgICAgLy8gXHU4OUUzXHU2NzkwXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwXG4gICAgICBjb25zdCB1cmxPYmogPSBuZXcgVVJMKGBodHRwOi8vbG9jYWxob3N0JHtwYXRofWApO1xuICAgICAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCdwYWdlJykgfHwgJzEnLCAxMCk7XG4gICAgICBjb25zdCBzaXplID0gcGFyc2VJbnQodXJsT2JqLnNlYXJjaFBhcmFtcy5nZXQoJ3NpemUnKSB8fCAnMTAnLCAxMCk7XG4gICAgICBjb25zdCBuYW1lID0gdXJsT2JqLnNlYXJjaFBhcmFtcy5nZXQoJ25hbWUnKSB8fCB1bmRlZmluZWQ7XG4gICAgICBjb25zdCB0eXBlID0gdXJsT2JqLnNlYXJjaFBhcmFtcy5nZXQoJ3R5cGUnKSB8fCB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBzdGF0dXMgPSB1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgnc3RhdHVzJykgfHwgdW5kZWZpbmVkO1xuICAgICAgXG4gICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIHBhZ2UsXG4gICAgICAgIHNpemUsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHN0YXR1c1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MDpgLCBwYXJhbXMpO1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLmRhdGFTb3VyY2UuZ2V0RGF0YVNvdXJjZXMocGFyYW1zKTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXG4gICAgaWYgKHBhdGgubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvPyQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MDpgLCBib2R5KTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5kYXRhU291cmNlLmNyZWF0ZURhdGFTb3VyY2UoYm9keSk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMSwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICAgIGNvbnN0IHVwZGF0ZU1hdGNoID0gcGF0aC5tYXRjaCgvXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKHVwZGF0ZU1hdGNoICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gdXBkYXRlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwOiAke2lkfWAsIGJvZHkpO1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLmRhdGFTb3VyY2UudXBkYXRlRGF0YVNvdXJjZShpZCwgYm9keSk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICAgIGNvbnN0IGRlbGV0ZU1hdGNoID0gcGF0aC5tYXRjaCgvXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKGRlbGV0ZU1hdGNoICYmIG1ldGhvZCA9PT0gJ0RFTEVURScpIHtcbiAgICAgIGNvbnN0IGlkID0gZGVsZXRlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwOiAke2lkfWApO1xuICAgICAgXG4gICAgICBhd2FpdCBzZXJ2aWNlcy5kYXRhU291cmNlLmRlbGV0ZURhdGFTb3VyY2UoaWQpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUsIGlkIH0pKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1OTgyXHU2NzlDXHU2Q0ExXHU2NzA5XHU1MzM5XHU5MTREXHU3Njg0XHU4REVGXHU3NTMxXHVGRjBDXHU4RkQ0XHU1NkRFNDA0XG4gICAgbG9nTW9jaygnd2FybicsIGBbTW9ja10gXHU2NzJBXHU3N0U1XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwQVBJOiAke21ldGhvZH0gJHtwYXRofWApO1xuICAgIHNlbmRKc29uKHJlcywgNDA0LCBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSgnTm90IEZvdW5kJywgJ1JFU09VUkNFX05PVF9GT1VORCcsIDQwNCkpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZ01vY2soJ2Vycm9yJywgYFtNb2NrXSBcdTY1NzBcdTYzNkVcdTZFOTBcdThCRjdcdTZDNDJcdTU5MDRcdTc0MDZcdTk1MTlcdThCRUY6YCwgZXJyb3IpO1xuICAgIGhhbmRsZUVycm9yKHJlcywgZXJyb3IpO1xuICB9XG59XG5cbi8qKlxuICogXHU1OTA0XHU3NDA2XHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczXHU4QkY3XHU2QzQyXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVF1ZXJ5UmVxdWVzdChcbiAgcGF0aDogc3RyaW5nLCBcbiAgbWV0aG9kOiBzdHJpbmcsIFxuICBib2R5OiBhbnksIFxuICByZXM6IGh0dHAuU2VydmVyUmVzcG9uc2Vcbikge1xuICB0cnkge1xuICAgIGxvZ01vY2soJ2luZm8nLCBgW01vY2tdIFx1NTkwNFx1NzQwNlx1NjdFNVx1OEJFMlx1OEJGN1x1NkM0MjogJHttZXRob2R9ICR7cGF0aH1gKTtcbiAgICBcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICBjb25zdCBzaW5nbGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKHNpbmdsZU1hdGNoICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gc2luZ2xlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyOiAke2lkfWApO1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LmdldFF1ZXJ5KGlkKTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAgaWYgKHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8/JC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhgKTtcbiAgICAgIFxuICAgICAgLy8gXHU4OUUzXHU2NzkwXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwXG4gICAgICBjb25zdCB1cmxPYmogPSBuZXcgVVJMKGBodHRwOi8vbG9jYWxob3N0JHtwYXRofWApO1xuICAgICAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCdwYWdlJykgfHwgJzEnLCAxMCk7XG4gICAgICBjb25zdCBzaXplID0gcGFyc2VJbnQodXJsT2JqLnNlYXJjaFBhcmFtcy5nZXQoJ3NpemUnKSB8fCAnMTAnLCAxMCk7XG4gICAgICBcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHsgcGFnZSwgc2l6ZSB9O1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5xdWVyeS5nZXRRdWVyaWVzKHBhcmFtcyk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgIGlmIChwYXRoLm1hdGNoKC9cXC9hcGlcXC9xdWVyaWVzXFwvPyQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMjpgLCBib2R5KTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5xdWVyeS5jcmVhdGVRdWVyeShib2R5KTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAxLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgdXBkYXRlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9xdWVyaWVzXFwvKFteXFwvXSspJC8pO1xuICAgIGlmICh1cGRhdGVNYXRjaCAmJiBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgICBjb25zdCBpZCA9IHVwZGF0ZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMjogJHtpZH1gLCBib2R5KTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5xdWVyeS51cGRhdGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGRlbGV0ZU1hdGNoID0gcGF0aC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAoZGVsZXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgICAgY29uc3QgaWQgPSBkZWxldGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTI6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LmRlbGV0ZVF1ZXJ5KGlkKTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCBpZCB9KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGV4ZWN1dGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8oW15cXC9dKylcXC9leGVjdXRlJC8pO1xuICAgIGlmIChleGVjdXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gZXhlY3V0ZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnZGVidWcnLCBgW01vY2tdIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMjogJHtpZH1gLCBib2R5KTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5xdWVyeS5leGVjdXRlUXVlcnkoaWQsIGJvZHkpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTZDQTFcdTY3MDlcdTUzMzlcdTkxNERcdTc2ODRcdThERUZcdTc1MzFcdUZGMENcdThGRDRcdTU2REU0MDRcbiAgICBsb2dNb2NrKCd3YXJuJywgYFtNb2NrXSBcdTY3MkFcdTc3RTVcdTc2ODRcdTY3RTVcdThCRTJBUEk6ICR7bWV0aG9kfSAke3BhdGh9YCk7XG4gICAgc2VuZEpzb24ocmVzLCA0MDQsIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlKCdOb3QgRm91bmQnLCAnUkVTT1VSQ0VfTk9UX0ZPVU5EJywgNDA0KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nTW9jaygnZXJyb3InLCBgW01vY2tdIFx1NjdFNVx1OEJFMlx1OEJGN1x1NkM0Mlx1NTkwNFx1NzQwNlx1OTUxOVx1OEJFRjpgLCBlcnJvcik7XG4gICAgaGFuZGxlRXJyb3IocmVzLCBlcnJvcik7XG4gIH1cbn1cblxuLyoqXG4gKiBcdTYzRDBcdTUzRDZcdTU0OENcdTg5RTNcdTY3OTBcdThCRjdcdTZDNDJcdTRGNTNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VSZXF1ZXN0Qm9keShyZXE6IENvbm5lY3QuSW5jb21pbmdNZXNzYWdlKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3QgY2h1bmtzOiBCdWZmZXJbXSA9IFtdO1xuICAgIFxuICAgIHJlcS5vbignZGF0YScsIChjaHVuazogQnVmZmVyKSA9PiBjaHVua3MucHVzaChjaHVuaykpO1xuICAgIFxuICAgIHJlcS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgaWYgKGNodW5rcy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKHt9KTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYm9keVN0ciA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZygpO1xuICAgICAgICBjb25zdCBib2R5ID0gYm9keVN0ciAmJiBib2R5U3RyLnRyaW0oKSA/IEpTT04ucGFyc2UoYm9keVN0cikgOiB7fTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoYm9keSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2dNb2NrKCd3YXJuJywgYFtNb2NrXSBcdThCRjdcdTZDNDJcdTRGNTNcdTg5RTNcdTY3OTBcdTU5MzFcdThEMjU6YCwgZXJyb3IpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSh7fSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFx1NTNEMVx1OTAwMUpTT05cdTU0Q0RcdTVFOTRcbiAqL1xuZnVuY3Rpb24gc2VuZEpzb24ocmVzOiBodHRwLlNlcnZlclJlc3BvbnNlLCBzdGF0dXNDb2RlOiBudW1iZXIsIGRhdGE6IGFueSk6IHZvaWQge1xuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1c0NvZGU7XG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbiwgWC1Nb2NrLUVuYWJsZWQnKTtcbiAgcmVzLnNldEhlYWRlcignWC1Qb3dlcmVkLUJ5JywgJ0RhdGFTY29wZS1Nb2NrJyk7XG4gIFxuICAvLyBcdTZERkJcdTUyQTBNb2NrXHU2ODA3XHU4QkIwXG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiYgZGF0YSAhPT0gbnVsbCkge1xuICAgIGRhdGEubW9ja1Jlc3BvbnNlID0gdHJ1ZTtcbiAgfVxuICBcbiAgY29uc3QgcmVzcG9uc2VEYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gIHJlcy5lbmQocmVzcG9uc2VEYXRhKTtcbiAgXG4gIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTUzRDFcdTkwMDFcdTU0Q0RcdTVFOTQ6IFske3N0YXR1c0NvZGV9XSAke3Jlc3BvbnNlRGF0YS5zbGljZSgwLCAyMDApfSR7cmVzcG9uc2VEYXRhLmxlbmd0aCA+IDIwMCA/ICcuLi4nIDogJyd9YCk7XG59XG5cbi8qKlxuICogXHU1OTA0XHU3NDA2XHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKi9cbmZ1bmN0aW9uIGhhbmRsZUVycm9yKHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSwgZXJyb3I6IGFueSwgc3RhdHVzQ29kZSA9IDUwMCk6IHZvaWQge1xuICBjb25zdCBtZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpO1xuICBjb25zdCBjb2RlID0gKGVycm9yIGFzIGFueSkuY29kZSB8fCAnSU5URVJOQUxfRVJST1InO1xuICBcbiAgbG9nTW9jaygnZXJyb3InLCBgW01vY2tdIFx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NDogJHtzdGF0dXNDb2RlfSAke2NvZGV9ICR7bWVzc2FnZX1gKTtcbiAgXG4gIGNvbnN0IGVycm9yUmVzcG9uc2UgPSBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZShtZXNzYWdlLCBjb2RlLCBzdGF0dXNDb2RlKTtcbiAgc2VuZEpzb24ocmVzLCBzdGF0dXNDb2RlLCBlcnJvclJlc3BvbnNlKTtcbn1cblxuLyoqXG4gKiBcdTU5MDRcdTc0MDZPUFRJT05TXHU4QkY3XHU2QzQyXHVGRjA4Q09SU1x1OTg4NFx1NjhDMFx1RkYwOVxuICovXG5mdW5jdGlvbiBoYW5kbGVPcHRpb25zUmVxdWVzdChyZXM6IGh0dHAuU2VydmVyUmVzcG9uc2UpOiB2b2lkIHtcbiAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbiwgWC1Nb2NrLUVuYWJsZWQnKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtTWF4LUFnZScsICc4NjQwMCcpOyAvLyAyNFx1NUMwRlx1NjVGNlxuICByZXMuZW5kKCk7XG4gIFxuICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU1OTA0XHU3NDA2T1BUSU9OU1x1OTg4NFx1NjhDMFx1OEJGN1x1NkM0MmApO1xufVxuXG4vKipcbiAqIFx1NkRGQlx1NTJBMFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBhZGREZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgeyBkZWxheSB9ID0gbW9ja0NvbmZpZztcbiAgXG4gIGxldCBkZWxheU1zID0gMDtcbiAgaWYgKHR5cGVvZiBkZWxheSA9PT0gJ251bWJlcicgJiYgZGVsYXkgPiAwKSB7XG4gICAgZGVsYXlNcyA9IGRlbGF5O1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFtNb2NrXSBcdTZERkJcdTUyQTBcdTU2RkFcdTVCOUFcdTVFRjZcdThGREY6ICR7ZGVsYXlNc31tc2ApO1xuICB9IGVsc2UgaWYgKGRlbGF5ICYmIHR5cGVvZiBkZWxheSA9PT0gJ29iamVjdCcpIHtcbiAgICBjb25zdCB7IG1pbiwgbWF4IH0gPSBkZWxheTtcbiAgICBkZWxheU1zID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBbTW9ja10gXHU2REZCXHU1MkEwXHU5NjhGXHU2NzNBXHU1RUY2XHU4RkRGOiAke2RlbGF5TXN9bXMgKFx1ODMwM1x1NTZGNDogJHttaW59LSR7bWF4fW1zKWApO1xuICB9XG4gIFxuICBpZiAoZGVsYXlNcyA+IDApIHtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXlNcykpO1xuICB9XG59ICJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFksU0FBUyxjQUFjLGVBQWU7QUFDaGIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGdCQUFnQjtBQUN6QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGtCQUFrQjs7O0FDQ3pCLElBQU0sWUFBWSxNQUFNO0FBTnhCO0FBUUUsTUFBSSxPQUFPLFdBQVcsYUFBYTtBQUNqQyxRQUFLLE9BQWUsbUJBQW1CO0FBQU8sYUFBTztBQUNyRCxRQUFLLE9BQWUsd0JBQXdCO0FBQU0sYUFBTztBQUFBLEVBQzNEO0FBSUEsUUFBSSw4Q0FBYSxRQUFiLG1CQUFrQix1QkFBc0I7QUFBUyxXQUFPO0FBRzVELFFBQUksOENBQWEsUUFBYixtQkFBa0IsdUJBQXNCO0FBQVEsV0FBTztBQUczRCxRQUFNLGtCQUFnQiw4Q0FBYSxRQUFiLG1CQUFrQixVQUFTO0FBR2pELFNBQU87QUFDVDtBQUtPLElBQU0sYUFBYTtBQUFBO0FBQUEsRUFFeEIsU0FBUyxVQUFVO0FBQUE7QUFBQSxFQUduQixPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsRUFDUDtBQUFBO0FBQUEsRUFHQSxLQUFLO0FBQUE7QUFBQSxJQUVILFNBQVM7QUFBQTtBQUFBLElBR1QsVUFBVTtBQUFBLEVBQ1o7QUFBQTtBQUFBLEVBR0EsU0FBUztBQUFBLElBQ1AsWUFBWTtBQUFBLElBQ1osT0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLElBQ2IsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLEVBQ1o7QUFBQTtBQUFBLEVBR0EsU0FBUztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBO0FBQUEsRUFDVDtBQUFBO0FBQUEsRUFHQSxJQUFJLFdBQXFCO0FBQ3ZCLFdBQU8sS0FBSyxRQUFRLFVBQVcsS0FBSyxRQUFRLFFBQXFCO0FBQUEsRUFDbkU7QUFDRjtBQUtPLFNBQVMsZ0JBQXlCO0FBRXZDLFNBQU8sV0FBVztBQUNwQjtBQVlPLFNBQVMsUUFBUSxPQUFpQixZQUFvQixNQUFtQjtBQUM5RSxRQUFNLGNBQWMsV0FBVztBQUcvQixRQUFNLFNBQW1DO0FBQUEsSUFDdkMsUUFBUTtBQUFBLElBQ1IsU0FBUztBQUFBLElBQ1QsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsU0FBUztBQUFBLEVBQ1g7QUFHQSxNQUFJLE9BQU8sV0FBVyxLQUFLLE9BQU8sS0FBSyxHQUFHO0FBQ3hDLFVBQU0sU0FBUyxTQUFTLE1BQU0sWUFBWSxDQUFDO0FBRTNDLFlBQVEsT0FBTztBQUFBLE1BQ2IsS0FBSztBQUNILGdCQUFRLE1BQU0sUUFBUSxTQUFTLEdBQUcsSUFBSTtBQUN0QztBQUFBLE1BQ0YsS0FBSztBQUNILGdCQUFRLEtBQUssUUFBUSxTQUFTLEdBQUcsSUFBSTtBQUNyQztBQUFBLE1BQ0YsS0FBSztBQUNILGdCQUFRLEtBQUssUUFBUSxTQUFTLEdBQUcsSUFBSTtBQUNyQztBQUFBLE1BQ0YsS0FBSztBQUNILGdCQUFRLE1BQU0sUUFBUSxTQUFTLEdBQUcsSUFBSTtBQUN0QztBQUFBLElBQ0o7QUFBQSxFQUNGO0FBQ0Y7QUFZQSxRQUFRLEtBQUssb0RBQXNCLFdBQVcsVUFBVSx1QkFBUSxvQkFBSztBQUNyRSxRQUFRLEtBQUssMENBQXNCLFdBQVcsSUFBSSxPQUFPO0FBQ3pELFFBQVEsS0FBSyxnREFBa0IsV0FBVyxRQUFROzs7QUNoRzNDLElBQU0sa0JBQWdDO0FBQUEsRUFDM0M7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxJQUNmLGNBQWMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQVEsRUFBRSxZQUFZO0FBQUEsSUFDMUQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFTLEVBQUUsWUFBWTtBQUFBLElBQ3hELFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sY0FBYztBQUFBLElBQ2QsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLElBQ2YsY0FBYyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksSUFBTyxFQUFFLFlBQVk7QUFBQSxJQUN6RCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFVLEVBQUUsWUFBWTtBQUFBLElBQ3pELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVMsRUFBRSxZQUFZO0FBQUEsSUFDeEQsVUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsSUFDZixjQUFjO0FBQUEsSUFDZCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFVLEVBQUUsWUFBWTtBQUFBLElBQ3pELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVMsRUFBRSxZQUFZO0FBQUEsSUFDeEQsVUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsSUFDZixjQUFjLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFTLEVBQUUsWUFBWTtBQUFBLElBQzNELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVUsRUFBRSxZQUFZO0FBQUEsSUFDekQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxVQUFVO0FBQUEsRUFDWjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxJQUNmLGNBQWMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVMsRUFBRSxZQUFZO0FBQUEsSUFDM0QsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksT0FBVyxFQUFFLFlBQVk7QUFBQSxJQUMxRCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFVLEVBQUUsWUFBWTtBQUFBLElBQ3pELFVBQVU7QUFBQSxFQUNaO0FBQ0Y7OztBQ3hHQSxJQUFJLGNBQWMsQ0FBQyxHQUFHLGVBQWU7QUFLckMsZUFBZSxnQkFBK0I7QUFDNUMsUUFBTUEsU0FBUSxPQUFPLFdBQVcsVUFBVSxXQUFXLFdBQVcsUUFBUTtBQUN4RSxTQUFPLElBQUksUUFBUSxhQUFXLFdBQVcsU0FBU0EsTUFBSyxDQUFDO0FBQzFEO0FBS08sU0FBUyxtQkFBeUI7QUFDdkMsZ0JBQWMsQ0FBQyxHQUFHLGVBQWU7QUFDbkM7QUFPQSxlQUFzQixlQUFlLFFBY2xDO0FBRUQsUUFBTSxjQUFjO0FBRXBCLFFBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBQzdCLFFBQU0sUUFBTyxpQ0FBUSxTQUFRO0FBRzdCLE1BQUksZ0JBQWdCLENBQUMsR0FBRyxXQUFXO0FBR25DLE1BQUksaUNBQVEsTUFBTTtBQUNoQixVQUFNLFVBQVUsT0FBTyxLQUFLLFlBQVk7QUFDeEMsb0JBQWdCLGNBQWM7QUFBQSxNQUFPLFFBQ25DLEdBQUcsS0FBSyxZQUFZLEVBQUUsU0FBUyxPQUFPLEtBQ3JDLEdBQUcsZUFBZSxHQUFHLFlBQVksWUFBWSxFQUFFLFNBQVMsT0FBTztBQUFBLElBQ2xFO0FBQUEsRUFDRjtBQUdBLE1BQUksaUNBQVEsTUFBTTtBQUNoQixvQkFBZ0IsY0FBYyxPQUFPLFFBQU0sR0FBRyxTQUFTLE9BQU8sSUFBSTtBQUFBLEVBQ3BFO0FBR0EsTUFBSSxpQ0FBUSxRQUFRO0FBQ2xCLG9CQUFnQixjQUFjLE9BQU8sUUFBTSxHQUFHLFdBQVcsT0FBTyxNQUFNO0FBQUEsRUFDeEU7QUFHQSxRQUFNLFNBQVMsT0FBTyxLQUFLO0FBQzNCLFFBQU0sTUFBTSxLQUFLLElBQUksUUFBUSxNQUFNLGNBQWMsTUFBTTtBQUN2RCxRQUFNLGlCQUFpQixjQUFjLE1BQU0sT0FBTyxHQUFHO0FBR3JELFNBQU87QUFBQSxJQUNMLE9BQU87QUFBQSxJQUNQLFlBQVk7QUFBQSxNQUNWLE9BQU8sY0FBYztBQUFBLE1BQ3JCO0FBQUEsTUFDQTtBQUFBLE1BQ0EsWUFBWSxLQUFLLEtBQUssY0FBYyxTQUFTLElBQUk7QUFBQSxJQUNuRDtBQUFBLEVBQ0Y7QUFDRjtBQU9BLGVBQXNCLGNBQWMsSUFBaUM7QUFFbkUsUUFBTSxjQUFjO0FBR3BCLFFBQU0sYUFBYSxZQUFZLEtBQUssUUFBTSxHQUFHLE9BQU8sRUFBRTtBQUV0RCxNQUFJLENBQUMsWUFBWTtBQUNmLFVBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsMEJBQU07QUFBQSxFQUNuQztBQUVBLFNBQU87QUFDVDtBQU9BLGVBQXNCLGlCQUFpQixNQUFnRDtBQUVyRixRQUFNLGNBQWM7QUFHcEIsUUFBTSxRQUFRLE1BQU0sS0FBSyxJQUFJLENBQUM7QUFHOUIsUUFBTSxnQkFBNEI7QUFBQSxJQUNoQyxJQUFJO0FBQUEsSUFDSixNQUFNLEtBQUssUUFBUTtBQUFBLElBQ25CLGFBQWEsS0FBSyxlQUFlO0FBQUEsSUFDakMsTUFBTSxLQUFLLFFBQVE7QUFBQSxJQUNuQixNQUFNLEtBQUs7QUFBQSxJQUNYLE1BQU0sS0FBSztBQUFBLElBQ1gsY0FBYyxLQUFLO0FBQUEsSUFDbkIsVUFBVSxLQUFLO0FBQUEsSUFDZixRQUFRLEtBQUssVUFBVTtBQUFBLElBQ3ZCLGVBQWUsS0FBSyxpQkFBaUI7QUFBQSxJQUNyQyxjQUFjO0FBQUEsSUFDZCxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDbEMsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ2xDLFVBQVU7QUFBQSxFQUNaO0FBR0EsY0FBWSxLQUFLLGFBQWE7QUFFOUIsU0FBTztBQUNUO0FBUUEsZUFBc0IsaUJBQWlCLElBQVksTUFBZ0Q7QUFFakcsUUFBTSxjQUFjO0FBR3BCLFFBQU0sUUFBUSxZQUFZLFVBQVUsUUFBTSxHQUFHLE9BQU8sRUFBRTtBQUV0RCxNQUFJLFVBQVUsSUFBSTtBQUNoQixVQUFNLElBQUksTUFBTSw2QkFBUyxFQUFFLDBCQUFNO0FBQUEsRUFDbkM7QUFHQSxRQUFNLG9CQUFnQztBQUFBLElBQ3BDLEdBQUcsWUFBWSxLQUFLO0FBQUEsSUFDcEIsR0FBRztBQUFBLElBQ0gsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLEVBQ3BDO0FBR0EsY0FBWSxLQUFLLElBQUk7QUFFckIsU0FBTztBQUNUO0FBTUEsZUFBc0IsaUJBQWlCLElBQTJCO0FBRWhFLFFBQU0sY0FBYztBQUdwQixRQUFNLFFBQVEsWUFBWSxVQUFVLFFBQU0sR0FBRyxPQUFPLEVBQUU7QUFFdEQsTUFBSSxVQUFVLElBQUk7QUFDaEIsVUFBTSxJQUFJLE1BQU0sNkJBQVMsRUFBRSwwQkFBTTtBQUFBLEVBQ25DO0FBR0EsY0FBWSxPQUFPLE9BQU8sQ0FBQztBQUM3QjtBQU9BLGVBQXNCLGVBQWUsUUFJbEM7QUFFRCxRQUFNLGNBQWM7QUFJcEIsUUFBTSxVQUFVLEtBQUssT0FBTyxJQUFJO0FBRWhDLFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQSxTQUFTLFVBQVUsNkJBQVM7QUFBQSxJQUM1QixTQUFTLFVBQVU7QUFBQSxNQUNqQixjQUFjLEtBQUssTUFBTSxLQUFLLE9BQU8sSUFBSSxFQUFFLElBQUk7QUFBQSxNQUMvQyxTQUFTO0FBQUEsTUFDVCxjQUFjLEtBQUssTUFBTSxLQUFLLE9BQU8sSUFBSSxHQUFLLElBQUk7QUFBQSxJQUNwRCxJQUFJO0FBQUEsTUFDRixXQUFXO0FBQUEsTUFDWCxjQUFjO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQ0Y7QUFHQSxJQUFPLHFCQUFRO0FBQUEsRUFDYjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGOzs7QUNoT08sU0FBUyxtQkFDZCxNQUNBLFVBQW1CLE1BQ25CLFNBQ0E7QUFDQSxTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDbEMsY0FBYztBQUFBO0FBQUEsRUFDaEI7QUFDRjtBQVNPLFNBQVMsd0JBQ2QsU0FDQSxPQUFlLGNBQ2YsU0FBaUIsS0FDakI7QUFDQSxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0E7QUFBQSxNQUNBLFlBQVk7QUFBQSxJQUNkO0FBQUEsSUFDQSxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDbEMsY0FBYztBQUFBLEVBQ2hCO0FBQ0Y7QUFVTyxTQUFTLHlCQUNkLE9BQ0EsWUFDQSxPQUFlLEdBQ2YsT0FBZSxJQUNmO0FBQ0EsU0FBTyxtQkFBbUI7QUFBQSxJQUN4QjtBQUFBLElBQ0EsWUFBWTtBQUFBLE1BQ1YsT0FBTztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQSxZQUFZLEtBQUssS0FBSyxhQUFhLElBQUk7QUFBQSxNQUN2QyxTQUFTLE9BQU8sT0FBTztBQUFBLElBQ3pCO0FBQUEsRUFDRixDQUFDO0FBQ0g7QUFPTyxTQUFTLE1BQU0sS0FBYSxLQUFvQjtBQUNyRCxTQUFPLElBQUksUUFBUSxhQUFXLFdBQVcsU0FBUyxFQUFFLENBQUM7QUFDdkQ7OztBQ2hFQSxJQUFNLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUlaLE1BQU0sV0FBVyxRQUF5QztBQUN4RCxVQUFNLE1BQU07QUFDWixXQUFPLHlCQUF5QjtBQUFBLE1BQzlCLE9BQU87QUFBQSxRQUNMLEVBQUUsSUFBSSxNQUFNLE1BQU0sd0NBQVUsYUFBYSxzRUFBZSxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZLEVBQUU7QUFBQSxRQUM1RixFQUFFLElBQUksTUFBTSxNQUFNLHdDQUFVLGFBQWEsOENBQVcsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWSxFQUFFO0FBQUEsUUFDeEYsRUFBRSxJQUFJLE1BQU0sTUFBTSw0QkFBUSxhQUFhLHdDQUFVLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVksRUFBRTtBQUFBLE1BQ3ZGO0FBQUEsTUFDQSxPQUFPO0FBQUEsTUFDUCxNQUFNLE9BQU87QUFBQSxNQUNiLE1BQU0sT0FBTztBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sU0FBUyxJQUFZO0FBQ3pCLFVBQU0sTUFBTTtBQUNaLFdBQU87QUFBQSxNQUNMO0FBQUEsTUFDQSxNQUFNO0FBQUEsTUFDTixhQUFhO0FBQUEsTUFDYixLQUFLO0FBQUEsTUFDTCxZQUFZLENBQUMsUUFBUTtBQUFBLE1BQ3JCLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxNQUNsQyxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLFlBQVksTUFBVztBQUMzQixVQUFNLE1BQU07QUFDWixXQUFPO0FBQUEsTUFDTCxJQUFJLFNBQVMsS0FBSyxJQUFJLENBQUM7QUFBQSxNQUN2QixHQUFHO0FBQUEsTUFDSCxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsTUFDbEMsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxZQUFZLElBQVksTUFBVztBQUN2QyxVQUFNLE1BQU07QUFDWixXQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0EsR0FBRztBQUFBLE1BQ0gsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxZQUFZLElBQVk7QUFDNUIsVUFBTSxNQUFNO0FBQ1osV0FBTyxFQUFFLFNBQVMsS0FBSztBQUFBLEVBQ3pCO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLGFBQWEsSUFBWSxRQUFhO0FBQzFDLFVBQU0sTUFBTTtBQUNaLFdBQU87QUFBQSxNQUNMLFNBQVMsQ0FBQyxNQUFNLFFBQVEsU0FBUyxRQUFRO0FBQUEsTUFDekMsTUFBTTtBQUFBLFFBQ0osRUFBRSxJQUFJLEdBQUcsTUFBTSxnQkFBTSxPQUFPLHFCQUFxQixRQUFRLFNBQVM7QUFBQSxRQUNsRSxFQUFFLElBQUksR0FBRyxNQUFNLGdCQUFNLE9BQU8sa0JBQWtCLFFBQVEsU0FBUztBQUFBLFFBQy9ELEVBQUUsSUFBSSxHQUFHLE1BQU0sZ0JBQU0sT0FBTyxvQkFBb0IsUUFBUSxXQUFXO0FBQUEsTUFDckU7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLGVBQWU7QUFBQSxRQUNmLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQUtBLElBQU0sV0FBVztBQUFBLEVBQ2Y7QUFBQSxFQUNBO0FBQ0Y7QUFXTyxJQUFNLG9CQUFvQixTQUFTO0FBQ25DLElBQU0sZUFBZSxTQUFTO0FBR3JDLElBQU8sbUJBQVE7OztBQzlHQSxTQUFSLHVCQUFvRTtBQUV6RSxNQUFJLENBQUMsY0FBYyxHQUFHO0FBQ3BCLFlBQVEsSUFBSSxtR0FBd0I7QUFDcEMsV0FBTyxDQUFDLEtBQUssS0FBSyxTQUFTLEtBQUs7QUFBQSxFQUNsQztBQUVBLFVBQVEsSUFBSSxpR0FBMkI7QUFFdkMsU0FBTyxlQUFlLGVBQ3BCLEtBQ0EsS0FDQSxNQUNBO0FBaENKO0FBa0NJLFVBQU0sTUFBTSxJQUFJLE9BQU87QUFHdkIsUUFBSSxDQUFDLElBQUksV0FBVyxPQUFPLEdBQUc7QUFFNUIsYUFBTyxLQUFLO0FBQUEsSUFDZDtBQUVBLFlBQVEsUUFBUSx1Q0FBbUIsSUFBSSxNQUFNLElBQUksR0FBRyxFQUFFO0FBRXRELFFBQUk7QUFFRixVQUFJLElBQUksV0FBVyxXQUFXO0FBQzVCLDZCQUFxQixHQUFHO0FBQ3hCO0FBQUEsTUFDRjtBQUdBLFlBQU0sVUFBVSxNQUFNLGlCQUFpQixHQUFHO0FBQzFDLGNBQVEsU0FBUyw4QkFBZSxPQUFPO0FBR3ZDLFlBQU1DLFFBQU87QUFDYixZQUFNLFdBQVMsU0FBSSxXQUFKLG1CQUFZLGtCQUFpQjtBQUc1QyxZQUFNLFNBQVM7QUFHZixjQUFRLE1BQU07QUFBQSxRQUVaLEtBQUtBLE1BQUssU0FBUyxrQkFBa0I7QUFDbkMsZ0JBQU0sd0JBQXdCQSxPQUFNLFFBQVEsU0FBUyxHQUFHO0FBQ3hEO0FBQUEsUUFHRixLQUFLQSxNQUFLLFNBQVMsY0FBYztBQUMvQixnQkFBTSxtQkFBbUJBLE9BQU0sUUFBUSxTQUFTLEdBQUc7QUFDbkQ7QUFBQSxRQUdGO0FBRUUsa0JBQVEsUUFBUSx1Q0FBbUIsTUFBTSxJQUFJQSxLQUFJLEVBQUU7QUFDbkQsbUJBQVMsS0FBSyxLQUFLLG1CQUFtQjtBQUFBLFlBQ3BDLFNBQVMscUJBQXFCLE1BQU0sSUFBSUEsS0FBSTtBQUFBLFlBQzVDLE1BQUFBO0FBQUEsWUFDQTtBQUFBLFlBQ0EsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLFVBQ3BDLENBQUMsQ0FBQztBQUFBLE1BQ047QUFBQSxJQUNGLFNBQVMsT0FBTztBQUNkLGNBQVEsU0FBUyxnREFBa0IsS0FBSztBQUN4QyxrQkFBWSxLQUFLLEtBQUs7QUFBQSxJQUN4QjtBQUFBLEVBQ0Y7QUFDRjtBQUtBLGVBQWUsd0JBQ2JBLE9BQ0EsUUFDQSxNQUNBLEtBQ0E7QUFDQSxNQUFJO0FBQ0YsWUFBUSxRQUFRLHNEQUFtQixNQUFNLElBQUlBLEtBQUksRUFBRTtBQUduRCxVQUFNLGNBQWNBLE1BQUssTUFBTSwrQkFBK0I7QUFDOUQsUUFBSSxlQUFlLFdBQVcsT0FBTztBQUNuQyxZQUFNLEtBQUssWUFBWSxDQUFDO0FBQ3hCLGNBQVEsU0FBUywwQ0FBaUIsRUFBRSxFQUFFO0FBRXRDLFlBQU0sV0FBVyxNQUFNLGlCQUFTLFdBQVcsY0FBYyxFQUFFO0FBQzNELGVBQVMsS0FBSyxLQUFLLG1CQUFtQixRQUFRLENBQUM7QUFDL0M7QUFBQSxJQUNGO0FBR0EsUUFBSUEsTUFBSyxNQUFNLHdCQUF3QixLQUFLLFdBQVcsT0FBTztBQUM1RCxjQUFRLFNBQVMsbURBQWdCO0FBR2pDLFlBQU0sU0FBUyxJQUFJLElBQUksbUJBQW1CQSxLQUFJLEVBQUU7QUFDaEQsWUFBTSxPQUFPLFNBQVMsT0FBTyxhQUFhLElBQUksTUFBTSxLQUFLLEtBQUssRUFBRTtBQUNoRSxZQUFNLE9BQU8sU0FBUyxPQUFPLGFBQWEsSUFBSSxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQ2pFLFlBQU0sT0FBTyxPQUFPLGFBQWEsSUFBSSxNQUFNLEtBQUs7QUFDaEQsWUFBTSxPQUFPLE9BQU8sYUFBYSxJQUFJLE1BQU0sS0FBSztBQUNoRCxZQUFNLFNBQVMsT0FBTyxhQUFhLElBQUksUUFBUSxLQUFLO0FBRXBELFlBQU0sU0FBUztBQUFBLFFBQ2I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUVBLGNBQVEsU0FBUyxzREFBbUIsTUFBTTtBQUUxQyxZQUFNLFdBQVcsTUFBTSxpQkFBUyxXQUFXLGVBQWUsTUFBTTtBQUNoRSxlQUFTLEtBQUssS0FBSyxtQkFBbUIsUUFBUSxDQUFDO0FBQy9DO0FBQUEsSUFDRjtBQUdBLFFBQUlBLE1BQUssTUFBTSx3QkFBd0IsS0FBSyxXQUFXLFFBQVE7QUFDN0QsY0FBUSxTQUFTLDBDQUFpQixJQUFJO0FBRXRDLFlBQU0sV0FBVyxNQUFNLGlCQUFTLFdBQVcsaUJBQWlCLElBQUk7QUFDaEUsZUFBUyxLQUFLLEtBQUssbUJBQW1CLFFBQVEsQ0FBQztBQUMvQztBQUFBLElBQ0Y7QUFHQSxVQUFNLGNBQWNBLE1BQUssTUFBTSwrQkFBK0I7QUFDOUQsUUFBSSxlQUFlLFdBQVcsT0FBTztBQUNuQyxZQUFNLEtBQUssWUFBWSxDQUFDO0FBQ3hCLGNBQVEsU0FBUywwQ0FBaUIsRUFBRSxJQUFJLElBQUk7QUFFNUMsWUFBTSxXQUFXLE1BQU0saUJBQVMsV0FBVyxpQkFBaUIsSUFBSSxJQUFJO0FBQ3BFLGVBQVMsS0FBSyxLQUFLLG1CQUFtQixRQUFRLENBQUM7QUFDL0M7QUFBQSxJQUNGO0FBR0EsVUFBTSxjQUFjQSxNQUFLLE1BQU0sK0JBQStCO0FBQzlELFFBQUksZUFBZSxXQUFXLFVBQVU7QUFDdEMsWUFBTSxLQUFLLFlBQVksQ0FBQztBQUN4QixjQUFRLFNBQVMsMENBQWlCLEVBQUUsRUFBRTtBQUV0QyxZQUFNLGlCQUFTLFdBQVcsaUJBQWlCLEVBQUU7QUFDN0MsZUFBUyxLQUFLLEtBQUssbUJBQW1CLEVBQUUsU0FBUyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQzVEO0FBQUEsSUFDRjtBQUdBLFlBQVEsUUFBUSxtREFBcUIsTUFBTSxJQUFJQSxLQUFJLEVBQUU7QUFDckQsYUFBUyxLQUFLLEtBQUssd0JBQXdCLGFBQWEsc0JBQXNCLEdBQUcsQ0FBQztBQUFBLEVBQ3BGLFNBQVMsT0FBTztBQUNkLFlBQVEsU0FBUyxrRUFBcUIsS0FBSztBQUMzQyxnQkFBWSxLQUFLLEtBQUs7QUFBQSxFQUN4QjtBQUNGO0FBS0EsZUFBZSxtQkFDYkEsT0FDQSxRQUNBLE1BQ0EsS0FDQTtBQUNBLE1BQUk7QUFDRixZQUFRLFFBQVEsZ0RBQWtCLE1BQU0sSUFBSUEsS0FBSSxFQUFFO0FBR2xELFVBQU0sY0FBY0EsTUFBSyxNQUFNLDJCQUEyQjtBQUMxRCxRQUFJLGVBQWUsV0FBVyxPQUFPO0FBQ25DLFlBQU0sS0FBSyxZQUFZLENBQUM7QUFDeEIsY0FBUSxTQUFTLG9DQUFnQixFQUFFLEVBQUU7QUFFckMsWUFBTSxXQUFXLE1BQU0saUJBQVMsTUFBTSxTQUFTLEVBQUU7QUFDakQsZUFBUyxLQUFLLEtBQUssbUJBQW1CLFFBQVEsQ0FBQztBQUMvQztBQUFBLElBQ0Y7QUFHQSxRQUFJQSxNQUFLLE1BQU0sb0JBQW9CLEtBQUssV0FBVyxPQUFPO0FBQ3hELGNBQVEsU0FBUyw2Q0FBZTtBQUdoQyxZQUFNLFNBQVMsSUFBSSxJQUFJLG1CQUFtQkEsS0FBSSxFQUFFO0FBQ2hELFlBQU0sT0FBTyxTQUFTLE9BQU8sYUFBYSxJQUFJLE1BQU0sS0FBSyxLQUFLLEVBQUU7QUFDaEUsWUFBTSxPQUFPLFNBQVMsT0FBTyxhQUFhLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUVqRSxZQUFNLFNBQVMsRUFBRSxNQUFNLEtBQUs7QUFDNUIsWUFBTSxXQUFXLE1BQU0saUJBQVMsTUFBTSxXQUFXLE1BQU07QUFDdkQsZUFBUyxLQUFLLEtBQUssbUJBQW1CLFFBQVEsQ0FBQztBQUMvQztBQUFBLElBQ0Y7QUFHQSxRQUFJQSxNQUFLLE1BQU0sb0JBQW9CLEtBQUssV0FBVyxRQUFRO0FBQ3pELGNBQVEsU0FBUyxvQ0FBZ0IsSUFBSTtBQUVyQyxZQUFNLFdBQVcsTUFBTSxpQkFBUyxNQUFNLFlBQVksSUFBSTtBQUN0RCxlQUFTLEtBQUssS0FBSyxtQkFBbUIsUUFBUSxDQUFDO0FBQy9DO0FBQUEsSUFDRjtBQUdBLFVBQU0sY0FBY0EsTUFBSyxNQUFNLDJCQUEyQjtBQUMxRCxRQUFJLGVBQWUsV0FBVyxPQUFPO0FBQ25DLFlBQU0sS0FBSyxZQUFZLENBQUM7QUFDeEIsY0FBUSxTQUFTLG9DQUFnQixFQUFFLElBQUksSUFBSTtBQUUzQyxZQUFNLFdBQVcsTUFBTSxpQkFBUyxNQUFNLFlBQVksSUFBSSxJQUFJO0FBQzFELGVBQVMsS0FBSyxLQUFLLG1CQUFtQixRQUFRLENBQUM7QUFDL0M7QUFBQSxJQUNGO0FBR0EsVUFBTSxjQUFjQSxNQUFLLE1BQU0sMkJBQTJCO0FBQzFELFFBQUksZUFBZSxXQUFXLFVBQVU7QUFDdEMsWUFBTSxLQUFLLFlBQVksQ0FBQztBQUN4QixjQUFRLFNBQVMsb0NBQWdCLEVBQUUsRUFBRTtBQUVyQyxZQUFNLGlCQUFTLE1BQU0sWUFBWSxFQUFFO0FBQ25DLGVBQVMsS0FBSyxLQUFLLG1CQUFtQixFQUFFLFNBQVMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUM1RDtBQUFBLElBQ0Y7QUFHQSxVQUFNLGVBQWVBLE1BQUssTUFBTSxvQ0FBb0M7QUFDcEUsUUFBSSxnQkFBZ0IsV0FBVyxRQUFRO0FBQ3JDLFlBQU0sS0FBSyxhQUFhLENBQUM7QUFDekIsY0FBUSxTQUFTLG9DQUFnQixFQUFFLElBQUksSUFBSTtBQUUzQyxZQUFNLFdBQVcsTUFBTSxpQkFBUyxNQUFNLGFBQWEsSUFBSSxJQUFJO0FBQzNELGVBQVMsS0FBSyxLQUFLLG1CQUFtQixRQUFRLENBQUM7QUFDL0M7QUFBQSxJQUNGO0FBR0EsWUFBUSxRQUFRLDZDQUFvQixNQUFNLElBQUlBLEtBQUksRUFBRTtBQUNwRCxhQUFTLEtBQUssS0FBSyx3QkFBd0IsYUFBYSxzQkFBc0IsR0FBRyxDQUFDO0FBQUEsRUFDcEYsU0FBUyxPQUFPO0FBQ2QsWUFBUSxTQUFTLDREQUFvQixLQUFLO0FBQzFDLGdCQUFZLEtBQUssS0FBSztBQUFBLEVBQ3hCO0FBQ0Y7QUFLQSxlQUFlLGlCQUFpQixLQUE0QztBQUMxRSxTQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDOUIsVUFBTSxTQUFtQixDQUFDO0FBRTFCLFFBQUksR0FBRyxRQUFRLENBQUMsVUFBa0IsT0FBTyxLQUFLLEtBQUssQ0FBQztBQUVwRCxRQUFJLEdBQUcsT0FBTyxNQUFNO0FBQ2xCLFVBQUksT0FBTyxXQUFXO0FBQUcsZUFBTyxRQUFRLENBQUMsQ0FBQztBQUUxQyxVQUFJO0FBQ0YsY0FBTSxVQUFVLE9BQU8sT0FBTyxNQUFNLEVBQUUsU0FBUztBQUMvQyxjQUFNLE9BQU8sV0FBVyxRQUFRLEtBQUssSUFBSSxLQUFLLE1BQU0sT0FBTyxJQUFJLENBQUM7QUFDaEUsZUFBTyxRQUFRLElBQUk7QUFBQSxNQUNyQixTQUFTLE9BQU87QUFDZCxnQkFBUSxRQUFRLHNEQUFtQixLQUFLO0FBQ3hDLGVBQU8sUUFBUSxDQUFDLENBQUM7QUFBQSxNQUNuQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0gsQ0FBQztBQUNIO0FBS0EsU0FBUyxTQUFTLEtBQTBCLFlBQW9CLE1BQWlCO0FBQy9FLE1BQUksYUFBYTtBQUNqQixNQUFJLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUNoRCxNQUFJLFVBQVUsK0JBQStCLEdBQUc7QUFDaEQsTUFBSSxVQUFVLGdDQUFnQyxpQ0FBaUM7QUFDL0UsTUFBSSxVQUFVLGdDQUFnQyw2Q0FBNkM7QUFDM0YsTUFBSSxVQUFVLGdCQUFnQixnQkFBZ0I7QUFHOUMsTUFBSSxPQUFPLFNBQVMsWUFBWSxTQUFTLE1BQU07QUFDN0MsU0FBSyxlQUFlO0FBQUEsRUFDdEI7QUFFQSxRQUFNLGVBQWUsS0FBSyxVQUFVLElBQUk7QUFDeEMsTUFBSSxJQUFJLFlBQVk7QUFFcEIsVUFBUSxTQUFTLHFDQUFpQixVQUFVLEtBQUssYUFBYSxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsYUFBYSxTQUFTLE1BQU0sUUFBUSxFQUFFLEVBQUU7QUFDeEg7QUFLQSxTQUFTLFlBQVksS0FBMEIsT0FBWSxhQUFhLEtBQVc7QUFDakYsUUFBTSxVQUFVLGlCQUFpQixRQUFRLE1BQU0sVUFBVSxPQUFPLEtBQUs7QUFDckUsUUFBTSxPQUFRLE1BQWMsUUFBUTtBQUVwQyxVQUFRLFNBQVMsb0NBQWdCLFVBQVUsSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFO0FBRWhFLFFBQU0sZ0JBQWdCLHdCQUF3QixTQUFTLE1BQU0sVUFBVTtBQUN2RSxXQUFTLEtBQUssWUFBWSxhQUFhO0FBQ3pDO0FBS0EsU0FBUyxxQkFBcUIsS0FBZ0M7QUFDNUQsTUFBSSxhQUFhO0FBQ2pCLE1BQUksVUFBVSwrQkFBK0IsR0FBRztBQUNoRCxNQUFJLFVBQVUsZ0NBQWdDLGlDQUFpQztBQUMvRSxNQUFJLFVBQVUsZ0NBQWdDLDZDQUE2QztBQUMzRixNQUFJLFVBQVUsMEJBQTBCLE9BQU87QUFDL0MsTUFBSSxJQUFJO0FBRVIsVUFBUSxTQUFTLG9EQUFzQjtBQUN6QztBQUtBLGVBQWUsV0FBMEI7QUFDdkMsUUFBTSxFQUFFLE9BQUFDLE9BQU0sSUFBSTtBQUVsQixNQUFJLFVBQVU7QUFDZCxNQUFJLE9BQU9BLFdBQVUsWUFBWUEsU0FBUSxHQUFHO0FBQzFDLGNBQVVBO0FBQ1YsWUFBUSxTQUFTLGdEQUFrQixPQUFPLElBQUk7QUFBQSxFQUNoRCxXQUFXQSxVQUFTLE9BQU9BLFdBQVUsVUFBVTtBQUM3QyxVQUFNLEVBQUUsS0FBSyxJQUFJLElBQUlBO0FBQ3JCLGNBQVUsS0FBSyxNQUFNLEtBQUssT0FBTyxLQUFLLE1BQU0sTUFBTSxFQUFFLElBQUk7QUFDeEQsWUFBUSxTQUFTLGdEQUFrQixPQUFPLHFCQUFXLEdBQUcsSUFBSSxHQUFHLEtBQUs7QUFBQSxFQUN0RTtBQUVBLE1BQUksVUFBVSxHQUFHO0FBQ2YsVUFBTSxJQUFJLFFBQVEsYUFBVyxXQUFXLFNBQVMsT0FBTyxDQUFDO0FBQUEsRUFDM0Q7QUFDRjs7O0FOcFdBLE9BQU8sUUFBUTtBQVBmLElBQU0sbUNBQW1DO0FBVXpDLFNBQVMsU0FBUyxNQUFjO0FBQzlCLFVBQVEsSUFBSSxtQ0FBZSxJQUFJLDJCQUFPO0FBQ3RDLE1BQUk7QUFDRixRQUFJLFFBQVEsYUFBYSxTQUFTO0FBQ2hDLGVBQVMsMkJBQTJCLElBQUksRUFBRTtBQUMxQyxlQUFTLDhDQUE4QyxJQUFJLHdCQUF3QixFQUFFLE9BQU8sVUFBVSxDQUFDO0FBQUEsSUFDekcsT0FBTztBQUNMLGVBQVMsWUFBWSxJQUFJLHVCQUF1QixFQUFFLE9BQU8sVUFBVSxDQUFDO0FBQUEsSUFDdEU7QUFDQSxZQUFRLElBQUkseUNBQWdCLElBQUksRUFBRTtBQUFBLEVBQ3BDLFNBQVMsR0FBRztBQUNWLFlBQVEsSUFBSSx1QkFBYSxJQUFJLHlEQUFZO0FBQUEsRUFDM0M7QUFDRjtBQUdBLFNBQVMsaUJBQWlCO0FBQ3hCLFVBQVEsSUFBSSw2Q0FBZTtBQUMzQixRQUFNLGFBQWE7QUFBQSxJQUNqQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUVBLGFBQVcsUUFBUSxlQUFhO0FBQzlCLFFBQUk7QUFDRixVQUFJLEdBQUcsV0FBVyxTQUFTLEdBQUc7QUFDNUIsWUFBSSxHQUFHLFVBQVUsU0FBUyxFQUFFLFlBQVksR0FBRztBQUN6QyxtQkFBUyxVQUFVLFNBQVMsRUFBRTtBQUFBLFFBQ2hDLE9BQU87QUFDTCxhQUFHLFdBQVcsU0FBUztBQUFBLFFBQ3pCO0FBQ0EsZ0JBQVEsSUFBSSw4QkFBZSxTQUFTLEVBQUU7QUFBQSxNQUN4QztBQUFBLElBQ0YsU0FBUyxHQUFHO0FBQ1YsY0FBUSxJQUFJLG9DQUFnQixTQUFTLElBQUksQ0FBQztBQUFBLElBQzVDO0FBQUEsRUFDRixDQUFDO0FBQ0g7QUFHQSxlQUFlO0FBR2YsU0FBUyxJQUFJO0FBR2IsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFFeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRzNDLFFBQU0sYUFBYSxJQUFJLHNCQUFzQjtBQUc3QyxRQUFNLGFBQWEsSUFBSSxxQkFBcUI7QUFFNUMsVUFBUSxJQUFJLGdEQUFrQixJQUFJLEVBQUU7QUFDcEMsVUFBUSxJQUFJLGdDQUFzQixhQUFhLGlCQUFPLGNBQUksRUFBRTtBQUM1RCxVQUFRLElBQUksMkJBQWlCLGFBQWEsaUJBQU8sY0FBSSxFQUFFO0FBRXZELFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxJQUNOO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQSxNQUVOLEtBQUssYUFBYSxRQUFRO0FBQUEsUUFDeEIsVUFBVTtBQUFBLFFBQ1YsTUFBTTtBQUFBLE1BQ1I7QUFBQTtBQUFBLE1BRUEsT0FBTztBQUFBO0FBQUEsUUFFTCxRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxRQUFRO0FBQUEsVUFDUixRQUFRLENBQUMsUUFBUTtBQS9GM0I7QUFpR1ksZ0JBQUksZ0JBQWMsU0FBSSxRQUFKLG1CQUFTLFdBQVcsV0FBVTtBQUM5QyxxQkFBTztBQUFBLFlBQ1Q7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsZ0JBQWdCO0FBQUE7QUFBQSxNQUVoQixpQkFBaUIsYUFDYixDQUFDLFdBQVc7QUFDVixnQkFBUSxJQUFJLDBHQUErQjtBQUUzQyxjQUFNLGFBQWEscUJBQXFCO0FBR3hDLGVBQU8sWUFBWSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7QUFqSHZEO0FBbUhjLGNBQUksR0FBQyxTQUFJLFFBQUosbUJBQVMsV0FBVyxXQUFVO0FBQ2pDLG1CQUFPLEtBQUs7QUFBQSxVQUNkO0FBRUEsa0JBQVEsSUFBSSx3QkFBYyxJQUFJLE1BQU0sSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUNqRCxxQkFBVyxLQUFLLEtBQUssSUFBSTtBQUFBLFFBQzNCLENBQUM7QUFBQSxNQUNILElBQ0E7QUFBQSxNQUNKLFNBQVM7QUFBQSxRQUNQLGlCQUFpQjtBQUFBLE1BQ25CO0FBQUE7QUFBQSxNQUVBLFFBQVE7QUFBQSxRQUNOLGFBQWE7QUFBQSxVQUNYO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1AsU0FBUyxDQUFDLGFBQWEsWUFBWTtBQUFBLE1BQ3JDO0FBQUEsTUFDQSxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixtQkFBbUI7QUFBQSxRQUNyQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsUUFDcEMsZUFBZSxLQUFLLFFBQVEsa0NBQVcsMEJBQTBCO0FBQUEsUUFDakUsV0FBVyxLQUFLLFFBQVEsa0NBQVcsc0JBQXNCO0FBQUEsUUFDekQsZ0JBQWdCLEtBQUssUUFBUSxrQ0FBVywyQkFBMkI7QUFBQSxRQUNuRSxrQkFBa0IsS0FBSyxRQUFRLGtDQUFXLDZCQUE2QjtBQUFBLFFBQ3ZFLHNCQUFzQixLQUFLLFFBQVEsa0NBQVcsaUNBQWlDO0FBQUEsUUFDL0UscUJBQXFCLEtBQUssUUFBUSxrQ0FBVyxnQ0FBZ0M7QUFBQSxRQUM3RSxnQkFBZ0IsS0FBSyxRQUFRLGtDQUFXLDJCQUEyQjtBQUFBLFFBQ25FLFFBQVEsS0FBSyxRQUFRLGtDQUFXLG1CQUFtQjtBQUFBLE1BQ3JEO0FBQUEsTUFDQSxRQUFRLENBQUMsT0FBTyxTQUFTO0FBQUEsSUFDM0I7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLGFBQWE7QUFBQSxNQUNiLFFBQVE7QUFBQSxNQUNSLFdBQVc7QUFBQTtBQUFBLE1BRVgsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsZUFBZTtBQUFBLFFBQ2pCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQTtBQUFBLE1BRVosU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxPQUFPO0FBQUE7QUFBQSxNQUVQLGdCQUFnQjtBQUFBO0FBQUEsUUFFZCxTQUFTO0FBQUEsVUFDUDtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTSxPQUFPO0FBQ1gsb0JBQU0sT0FBTyxFQUFFLFFBQVEsVUFBVSxHQUFHLE1BQU07QUFDeEMsdUJBQU8sRUFBRSxVQUFVLHFCQUFxQixRQUFRLEtBQUs7QUFBQSxjQUN2RCxDQUFDO0FBQUEsWUFDSDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsVUFBVTtBQUFBLEVBQ1o7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJkZWxheSIsICJwYXRoIiwgImRlbGF5Il0KfQo=
