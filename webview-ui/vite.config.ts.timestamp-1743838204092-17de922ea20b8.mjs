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
    min: 200,
    max: 600
  },
  // 请求处理配置
  api: {
    // 基础URL
    baseUrl: "http://localhost:5000/api",
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
var parseRequestBody = async (req) => {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0)
        return resolve({});
      try {
        const bodyStr = Buffer.concat(chunks).toString();
        const body = bodyStr && bodyStr.trim() ? JSON.parse(bodyStr) : {};
        logMock("debug", "\u89E3\u6790\u8BF7\u6C42\u4F53\u6210\u529F:", body);
        resolve(body);
      } catch (error) {
        logMock("warn", "\u8BF7\u6C42\u4F53\u89E3\u6790\u5931\u8D25:", error);
        resolve({});
      }
    });
  });
};
var sendJson = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.end(JSON.stringify(data));
  logMock("debug", `\u53D1\u9001\u54CD\u5E94: \u72B6\u6001\u7801=${statusCode}`, typeof data === "object" ? JSON.stringify(data).substring(0, 100) + "..." : data);
};
var handleError = (res, error, statusCode = 500) => {
  logMock("error", "\u5904\u7406\u8BF7\u6C42\u51FA\u9519:", error);
  const errorResponse = createMockErrorResponse(
    error instanceof Error ? error.message : String(error),
    error.code || "MOCK_ERROR",
    statusCode
  );
  sendJson(res, statusCode, errorResponse);
};
var addDelay = async () => {
  const { delay: delay2 } = mockConfig;
  if (typeof delay2 === "number" && delay2 > 0) {
    const delayMs = delay2;
    logMock("debug", `\u6DFB\u52A0\u56FA\u5B9A\u5EF6\u8FDF: ${delayMs}ms`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  } else if (delay2 && typeof delay2 === "object") {
    const { min, max } = delay2;
    const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;
    logMock("debug", `\u6DFB\u52A0\u968F\u673A\u5EF6\u8FDF: ${randomDelay}ms (\u8303\u56F4: ${min}-${max}ms)`);
    await new Promise((resolve) => setTimeout(resolve, randomDelay));
  }
};
var handleOptionsRequest = (res) => {
  res.statusCode = 204;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.end();
  logMock("debug", "\u5904\u7406OPTIONS\u9884\u68C0\u8BF7\u6C42");
};
var createContext = async (req, res) => {
  const url = req.url || "/";
  const normalizedUrl = url.replace(/\/api\/api\//, "/api/");
  const urlObj = new URL(`http://localhost${normalizedUrl}`);
  const path2 = urlObj.pathname;
  const apiPrefix = path2.startsWith("/api") ? "/api" : "";
  const queryParams = {};
  urlObj.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  const page = parseInt(queryParams.page || "1", 10);
  const size = parseInt(queryParams.size || "10", 10);
  const body = await parseRequestBody(req);
  const context = {
    req,
    res,
    path: path2,
    method: req.method || "GET",
    queryParams,
    body,
    normalized: {
      url: normalizedUrl,
      path: path2,
      prefix: apiPrefix
    },
    pagination: {
      page,
      size
    }
  };
  logMock("debug", "\u8BF7\u6C42\u4E0A\u4E0B\u6587\u521B\u5EFA\u5B8C\u6210:", {
    url: normalizedUrl,
    path: path2,
    method: context.method,
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : "\u65E0",
    bodySize: typeof body === "object" ? Object.keys(body).length : "\u975E\u5BF9\u8C61"
  });
  return context;
};
var handleDataSourceRoutes = async (context) => {
  const { path: path2, method, body, pagination, res } = context;
  try {
    const singleMatch = path2.match(/\/api\/datasources\/([^\/]+)$/);
    if (singleMatch && method === "GET") {
      const id = singleMatch[1];
      logMock("info", `\u83B7\u53D6\u6570\u636E\u6E90: ${id}`);
      const response = await services_default.dataSource.getDataSource(id);
      await addDelay();
      sendJson(res, 200, createMockResponse(response));
      return true;
    }
    if (path2.match(/\/api\/datasources\/?$/) && method === "GET") {
      logMock("info", "\u83B7\u53D6\u6570\u636E\u6E90\u5217\u8868", pagination);
      const params = {
        page: pagination.page,
        size: pagination.size,
        name: context.queryParams.name,
        type: context.queryParams.type,
        status: context.queryParams.status
      };
      const response = await services_default.dataSource.getDataSources(params);
      await addDelay();
      sendJson(res, 200, createMockResponse(response));
      return true;
    }
    if (path2.match(/\/api\/datasources\/?$/) && method === "POST") {
      logMock("info", "\u521B\u5EFA\u6570\u636E\u6E90", body);
      const response = await services_default.dataSource.createDataSource(body);
      await addDelay();
      sendJson(res, 201, createMockResponse(response));
      return true;
    }
    const updateMatch = path2.match(/\/api\/datasources\/([^\/]+)$/);
    if (updateMatch && method === "PUT") {
      const id = updateMatch[1];
      logMock("info", `\u66F4\u65B0\u6570\u636E\u6E90: ${id}`, body);
      const response = await services_default.dataSource.updateDataSource(id, body);
      await addDelay();
      sendJson(res, 200, createMockResponse(response));
      return true;
    }
    const deleteMatch = path2.match(/\/api\/datasources\/([^\/]+)$/);
    if (deleteMatch && method === "DELETE") {
      const id = deleteMatch[1];
      logMock("info", `\u5220\u9664\u6570\u636E\u6E90: ${id}`);
      await services_default.dataSource.deleteDataSource(id);
      await addDelay();
      sendJson(res, 200, createMockResponse({ id, deleted: true }));
      return true;
    }
  } catch (error) {
    handleError(res, error);
    return true;
  }
  return false;
};
var handleQueryRoutes = async (context) => {
  const { path: path2, method, body, pagination, res } = context;
  try {
    const singleMatch = path2.match(/\/api\/queries\/([^\/]+)$/);
    if (singleMatch && method === "GET") {
      const id = singleMatch[1];
      logMock("info", `\u83B7\u53D6\u67E5\u8BE2: ${id}`);
      const response = await services_default.query.getQuery(id);
      await addDelay();
      sendJson(res, 200, createMockResponse(response));
      return true;
    }
    if (path2.match(/\/api\/queries\/?$/) && method === "GET") {
      logMock("info", "\u83B7\u53D6\u67E5\u8BE2\u5217\u8868", pagination);
      const params = {
        page: pagination.page,
        size: pagination.size
      };
      const response = await services_default.query.getQueries(params);
      await addDelay();
      sendJson(res, 200, createMockResponse(response));
      return true;
    }
    if (path2.match(/\/api\/queries\/?$/) && method === "POST") {
      logMock("info", "\u521B\u5EFA\u67E5\u8BE2", body);
      const response = await services_default.query.createQuery(body);
      await addDelay();
      sendJson(res, 201, createMockResponse(response));
      return true;
    }
    const updateMatch = path2.match(/\/api\/queries\/([^\/]+)$/);
    if (updateMatch && method === "PUT") {
      const id = updateMatch[1];
      logMock("info", `\u66F4\u65B0\u67E5\u8BE2: ${id}`, body);
      const response = await services_default.query.updateQuery(id, body);
      await addDelay();
      sendJson(res, 200, createMockResponse(response));
      return true;
    }
    const deleteMatch = path2.match(/\/api\/queries\/([^\/]+)$/);
    if (deleteMatch && method === "DELETE") {
      const id = deleteMatch[1];
      logMock("info", `\u5220\u9664\u67E5\u8BE2: ${id}`);
      await services_default.query.deleteQuery(id);
      await addDelay();
      sendJson(res, 200, createMockResponse({ id, deleted: true }));
      return true;
    }
    const executeMatch = path2.match(/\/api\/queries\/([^\/]+)\/execute$/);
    if (executeMatch && method === "POST") {
      const id = executeMatch[1];
      logMock("info", `\u6267\u884C\u67E5\u8BE2: ${id}`, body);
      const response = await services_default.query.executeQuery(id, body);
      await addDelay();
      sendJson(res, 200, createMockResponse(response));
      return true;
    }
  } catch (error) {
    handleError(res, error);
    return true;
  }
  return false;
};
var handleGenericRoutes = async (context) => {
  const { path: path2, method, res } = context;
  try {
    logMock("warn", `\u672A\u5339\u914D\u7684API\u8BF7\u6C42: ${method} ${path2}`);
    if (path2.startsWith("/api/")) {
      await addDelay();
      if (method === "GET") {
        const isListEndpoint = path2.match(/\/api\/[a-zA-Z0-9_-]+\/?$/);
        const responseData = isListEndpoint ? { items: [], total: 0, page: 1, size: 10 } : { id: "12345", name: "Generic Item" };
        sendJson(res, 200, createMockResponse(responseData));
        return true;
      } else if (method === "POST") {
        sendJson(res, 201, createMockResponse({ id: "12345", created: true }));
        return true;
      } else if (method === "PUT") {
        sendJson(res, 200, createMockResponse({ id: "12345", updated: true }));
        return true;
      } else if (method === "DELETE") {
        sendJson(res, 200, createMockResponse({ deleted: true }));
        return true;
      }
    }
  } catch (error) {
    handleError(res, error);
    return true;
  }
  return false;
};
function createMockMiddleware() {
  return async function mockMiddleware(req, res, next) {
    if (!isMockEnabled()) {
      logMock("debug", "Mock\u670D\u52A1\u672A\u542F\u7528\uFF0C\u8DF3\u8FC7\u8BF7\u6C42", req.url);
      return next();
    }
    const url = req.url || "";
    if (!url.startsWith("/api/")) {
      logMock("debug", "\u975EAPI\u8BF7\u6C42\uFF0C\u8DF3\u8FC7\u62E6\u622A", url);
      return next();
    }
    logMock("info", `\u62E6\u622A\u8BF7\u6C42: ${req.method} ${url}`);
    try {
      if (req.method === "OPTIONS" && url.startsWith("/api/")) {
        handleOptionsRequest(res);
        return;
      }
      const context = await createContext(req, res);
      await addDelay();
      const handlers = [
        handleDataSourceRoutes,
        handleQueryRoutes,
        handleGenericRoutes
      ];
      for (const handler of handlers) {
        const handled = await handler(context);
        if (handled)
          return;
      }
      logMock("warn", `\u65E0\u6CD5\u5904\u7406\u7684API\u8BF7\u6C42\uFF0C\u4F20\u9012\u7ED9\u4E0B\u4E00\u4E2A\u4E2D\u95F4\u4EF6: ${req.method} ${url}`);
      next();
    } catch (error) {
      logMock("error", "\u4E2D\u95F4\u4EF6\u5904\u7406\u51FA\u9519:", error);
      handleError(res, error);
    }
  };
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svY29uZmlnLnRzIiwgInNyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzIiwgInNyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuXG4vLyBcdTVGM0FcdTUyMzZcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTNcdTUxRkRcdTY1NzBcbmZ1bmN0aW9uIGtpbGxQb3J0KHBvcnQ6IG51bWJlcikge1xuICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjhDMFx1NjdFNVx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NTM2MFx1NzUyOFx1NjBDNVx1NTFCNWApO1xuICB0cnkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBleGVjU3luYyhgbmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fWApO1xuICAgICAgZXhlY1N5bmMoYHRhc2traWxsIC9GIC9waWQgJChuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9IHwgYXdrICd7cHJpbnQgJDV9JylgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4ZWNTeW5jKGBsc29mIC1pIDoke3BvcnR9IC10IHwgeGFyZ3Mga2lsbCAtOWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTMgJHtwb3J0fWApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTY3MkFcdTg4QUJcdTUzNjBcdTc1MjhcdTYyMTZcdTY1RTBcdTZDRDVcdTkxQ0FcdTY1M0VgKTtcbiAgfVxufVxuXG4vLyBcdTVDMURcdThCRDVcdTkxQ0FcdTY1M0VcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTdBRUZcdTUzRTNcbmtpbGxQb3J0KDgwODApO1xuXG4vLyBcdTU3RkFcdTY3MkNcdTkxNERcdTdGNkVcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHU1MkEwXHU4RjdEXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9jayBBUElcbiAgY29uc3QgdXNlTW9ja0FwaSA9IGVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU3OTgxXHU3NTI4SE1SXG4gIGNvbnN0IGRpc2FibGVIbXIgPSBlbnYuVklURV9ESVNBQkxFX0hNUiA9PT0gJ3RydWUnO1xuICBcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdThGRDBcdTg4NENcdTZBMjFcdTVGMEY6ICR7bW9kZX1gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBNb2NrIEFQSTogJHt1c2VNb2NrQXBpID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgIF0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICAvLyBcdTkxNERcdTdGNkVITVJcbiAgICAgIGhtcjogZGlzYWJsZUhtciA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1NEVFM1x1NzQwNlxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gXHU1QzA2QVBJXHU4QkY3XHU2QzQyXHU4RjZDXHU1M0QxXHU1MjMwXHU1NDBFXHU3QUVGXHU2NzBEXHU1MkExXG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gXHU5MTREXHU3RjZFXHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgICBtaWRkbGV3YXJlTW9kZTogZmFsc2UsXG4gICAgICAvLyBcdTRGN0ZcdTc1MjhNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyXG4gICAgICBjb25maWd1cmVTZXJ2ZXI6IHVzZU1vY2tBcGkgXG4gICAgICAgID8gKHNlcnZlcikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWaXRlXHU5MTREXHU3RjZFXSBcdTZERkJcdTUyQTBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2Jyk7XG4gICAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCkpO1xuICAgICAgICAgIH0gXG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZSwgbm8tc3RvcmUsIG11c3QtcmV2YWxpZGF0ZScsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIGxlc3M6IHtcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZXhjbHVkZTogWydmc2V2ZW50cyddLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIC8vIFx1NkUwNVx1OTY2NGNvbnNvbGVcdTU0OENkZWJ1Z2dlclxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjYWNoZURpcjogJ25vZGVfbW9kdWxlcy8udml0ZV9jYWNoZScsXG4gIH1cbn0pIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiOy8qKlxuICogXHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXG4gKiBcdTk2QzZcdTRFMkRcdTdCQTFcdTc0MDZcdTYyNDBcdTY3MDlcdTZBMjFcdTYyREZcdTY3MERcdTUyQTFcdTc2RjhcdTUxNzNcdTc2ODRcdTkxNERcdTdGNkVcdUZGMENcdTRGNUNcdTRFM0FcdTUzNTVcdTRFMDBcdTc3MUZcdTc2RjhcdTY3NjVcdTZFOTBcbiAqL1xuXG4vLyBcdTY4QzBcdTY3RTVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTU0OENcdTUxNjhcdTVDNDBcdThCQkVcdTdGNkVcbmNvbnN0IGlzRW5hYmxlZCA9ICgpID0+IHtcbiAgLy8gXHU2OEMwXHU2N0U1XHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHVGRjA4XHU4RkQwXHU4ODRDXHU2NUY2XHVGRjA5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgaWYgKCh3aW5kb3cgYXMgYW55KS5fX1VTRV9NT0NLX0FQSSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLl9fQVBJX01PQ0tfRElTQUJMRUQgPT09IHRydWUpIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU2OEMwXHU2N0U1XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHVGRjA4XHU3RjE2XHU4QkQxXHU2NUY2XHVGRjA5XG4gIC8vIFx1NTk4Mlx1Njc5Q1x1NjYwRVx1Nzg2RVx1OEJCRVx1N0Y2RVx1NEUzQWZhbHNlXHVGRjBDXHU1MjE5XHU3OTgxXHU3NTI4XG4gIGlmIChpbXBvcnQubWV0YT8uZW52Py5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gXCJmYWxzZVwiKSByZXR1cm4gZmFsc2U7XG4gIFxuICAvLyBcdTU5ODJcdTY3OUNcdTY2MEVcdTc4NkVcdThCQkVcdTdGNkVcdTRFM0F0cnVlXHVGRjBDXHU1MjE5XHU1NDJGXHU3NTI4XG4gIGlmIChpbXBvcnQubWV0YT8uZW52Py5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gXCJ0cnVlXCIpIHJldHVybiB0cnVlO1xuICBcbiAgLy8gXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBCXHU5RUQ4XHU4QkE0XHU1NDJGXHU3NTI4XHVGRjBDXHU1MTc2XHU0RUQ2XHU3M0FGXHU1ODgzXHU5RUQ4XHU4QkE0XHU3OTgxXHU3NTI4XG4gIGNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBpbXBvcnQubWV0YT8uZW52Py5NT0RFID09PSBcImRldmVsb3BtZW50XCI7XG4gIFxuICAvLyBcdTVGM0FcdTUyMzZcdTVGMDBcdTU0MkZNb2NrXHU2NzBEXHU1MkExXHU3NTI4XHU0RThFXHU2RDRCXHU4QkQ1XG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gXHU1QjlBXHU0RTQ5XHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCXHU3QzdCXHU1NzhCXG5leHBvcnQgdHlwZSBMb2dMZXZlbCA9ICdub25lJyB8ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbycgfCAnZGVidWcnO1xuXG5leHBvcnQgY29uc3QgbW9ja0NvbmZpZyA9IHtcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHVGRjA4XHU1NTJGXHU0RTAwXHU1RjAwXHU1MTczXHVGRjA5XG4gIGVuYWJsZWQ6IGlzRW5hYmxlZCgpLFxuICBcbiAgLy8gXHU4QkY3XHU2QzQyXHU1RUY2XHU4RkRGXHU5MTREXHU3RjZFXHVGRjA4XHU2QkVCXHU3OUQyXHVGRjA5XG4gIGRlbGF5OiB7XG4gICAgbWluOiAyMDAsXG4gICAgbWF4OiA2MDBcbiAgfSxcbiAgXG4gIC8vIFx1OEJGN1x1NkM0Mlx1NTkwNFx1NzQwNlx1OTE0RFx1N0Y2RVxuICBhcGk6IHtcbiAgICAvLyBcdTU3RkFcdTc4NDBVUkxcbiAgICBiYXNlVXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9hcGlcIixcbiAgICBcbiAgICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhcdTgxRUFcdTUyQThcdTZBMjFcdTYyREZcdUZGMDhcdTVGNTNcdTU0MEVcdTdBRUZcdTY3MERcdTUyQTFcdTRFMERcdTUzRUZcdTc1MjhcdTY1RjZcdTgxRUFcdTUyQThcdTUyMDdcdTYzNjJcdTUyMzBcdTZBMjFcdTYyREZcdTZBMjFcdTVGMEZcdUZGMDlcbiAgICBhdXRvTW9jazogdHJ1ZVxuICB9LFxuICBcbiAgLy8gXHU2QTIxXHU1NzU3XHU1NDJGXHU3NTI4XHU5MTREXHU3RjZFXG4gIG1vZHVsZXM6IHtcbiAgICBkYXRhc291cmNlOiB0cnVlLFxuICAgIHF1ZXJ5OiB0cnVlLFxuICAgIGludGVncmF0aW9uOiB0cnVlLFxuICAgIHZlcnNpb246IHRydWUsXG4gICAgbWV0YWRhdGE6IHRydWVcbiAgfSxcbiAgXG4gIC8vIFx1NjVFNVx1NUZEN1x1OTE0RFx1N0Y2RVxuICBsb2dnaW5nOiB7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICBsZXZlbDogXCJkZWJ1Z1wiIC8vIGRlYnVnLCBpbmZvLCB3YXJuLCBlcnJvciwgbm9uZVxuICB9LFxuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCIC0gXHU0RkJGXHU0RThFXHU3NkY0XHU2M0E1XHU4QkJGXHU5NUVFXG4gIGdldCBsb2dMZXZlbCgpOiBMb2dMZXZlbCB7XG4gICAgcmV0dXJuIHRoaXMubG9nZ2luZy5lbmFibGVkID8gKHRoaXMubG9nZ2luZy5sZXZlbCBhcyBMb2dMZXZlbCkgOiAnbm9uZSc7XG4gIH1cbn07XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc01vY2tFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAvLyBcdTc4NkVcdTRGRERcdThGRDRcdTU2REV0cnVlXHU0RUU1XHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICByZXR1cm4gbW9ja0NvbmZpZy5lbmFibGVkO1xufVxuXG4vKipcbiAqIFx1NjhDMFx1NjdFNVx1NzI3OVx1NUI5QVx1NkEyMVx1NTc1N1x1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOFx1NkEyMVx1NjJERlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNNb2R1bGVFbmFibGVkKG1vZHVsZU5hbWU6IGtleW9mIHR5cGVvZiBtb2NrQ29uZmlnLm1vZHVsZXMpOiBib29sZWFuIHtcbiAgcmV0dXJuIG1vY2tDb25maWcuZW5hYmxlZCAmJiBtb2NrQ29uZmlnLm1vZHVsZXNbbW9kdWxlTmFtZV07XG59XG5cbi8qKlxuICogXHU4QkIwXHU1RjU1XHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHU3NkY4XHU1MTczXHU2NUU1XHU1RkQ3XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2dNb2NrKGxldmVsOiBMb2dMZXZlbCwgbWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICBjb25zdCBjb25maWdMZXZlbCA9IG1vY2tDb25maWcubG9nTGV2ZWw7XG4gIFxuICAvLyBcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkJcdTRGMThcdTUxNDhcdTdFQTc6IG5vbmUgPCBlcnJvciA8IHdhcm4gPCBpbmZvIDwgZGVidWdcbiAgY29uc3QgbGV2ZWxzOiBSZWNvcmQ8TG9nTGV2ZWwsIG51bWJlcj4gPSB7XG4gICAgJ25vbmUnOiAwLFxuICAgICdlcnJvcic6IDEsXG4gICAgJ3dhcm4nOiAyLFxuICAgICdpbmZvJzogMyxcbiAgICAnZGVidWcnOiA0XG4gIH07XG4gIFxuICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTVFOTRcdThCQjBcdTVGNTVcdTZCNjRcdTdFQTdcdTUyMkJcdTc2ODRcdTY1RTVcdTVGRDdcbiAgaWYgKGxldmVsc1tjb25maWdMZXZlbF0gPj0gbGV2ZWxzW2xldmVsXSkge1xuICAgIGNvbnN0IHByZWZpeCA9IGBbTW9jayAke2xldmVsLnRvVXBwZXJDYXNlKCl9XWA7XG4gICAgXG4gICAgc3dpdGNoIChsZXZlbCkge1xuICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICBjb25zb2xlLmVycm9yKHByZWZpeCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2Fybic6XG4gICAgICAgIGNvbnNvbGUud2FybihwcmVmaXgsIG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICBjb25zb2xlLmluZm8ocHJlZml4LCBtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZWJ1Zyc6XG4gICAgICAgIGNvbnNvbGUuZGVidWcocHJlZml4LCBtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjRETW9ja1x1OTE0RFx1N0Y2RVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW9ja0NvbmZpZygpIHtcbiAgcmV0dXJuIHsgLi4ubW9ja0NvbmZpZyB9O1xufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL2RhdGFzb3VyY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50c1wiOy8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjU3MFx1NjM2RVx1NkU5MFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1RkYwQ1x1NzUyOFx1NEU4RVx1NUYwMFx1NTNEMVx1NTQ4Q1x1NkQ0Qlx1OEJENVxuICovXG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1N0M3Qlx1NTc4QlxuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZVR5cGUgPSAnbXlzcWwnIHwgJ3Bvc3RncmVzcWwnIHwgJ29yYWNsZScgfCAnc3Fsc2VydmVyJyB8ICdzcWxpdGUnO1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTcyQjZcdTYwMDFcbmV4cG9ydCB0eXBlIERhdGFTb3VyY2VTdGF0dXMgPSAnYWN0aXZlJyB8ICdpbmFjdGl2ZScgfCAnZXJyb3InIHwgJ3BlbmRpbmcnO1xuXG4vLyBcdTU0MENcdTZCNjVcdTk4OTFcdTczODdcbmV4cG9ydCB0eXBlIFN5bmNGcmVxdWVuY3kgPSAnbWFudWFsJyB8ICdob3VybHknIHwgJ2RhaWx5JyB8ICd3ZWVrbHknIHwgJ21vbnRobHknO1xuXG4vLyBcdTY1NzBcdTYzNkVcdTZFOTBcdTYzQTVcdTUzRTNcbmV4cG9ydCBpbnRlcmZhY2UgRGF0YVNvdXJjZSB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHR5cGU6IERhdGFTb3VyY2VUeXBlO1xuICBob3N0Pzogc3RyaW5nO1xuICBwb3J0PzogbnVtYmVyO1xuICBkYXRhYmFzZU5hbWU/OiBzdHJpbmc7XG4gIHVzZXJuYW1lPzogc3RyaW5nO1xuICBwYXNzd29yZD86IHN0cmluZztcbiAgc3RhdHVzOiBEYXRhU291cmNlU3RhdHVzO1xuICBzeW5jRnJlcXVlbmN5PzogU3luY0ZyZXF1ZW5jeTtcbiAgbGFzdFN5bmNUaW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgY3JlYXRlZEF0OiBzdHJpbmc7XG4gIHVwZGF0ZWRBdDogc3RyaW5nO1xuICBpc0FjdGl2ZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuZXhwb3J0IGNvbnN0IG1vY2tEYXRhU291cmNlczogRGF0YVNvdXJjZVtdID0gW1xuICB7XG4gICAgaWQ6ICdkcy0xJyxcbiAgICBuYW1lOiAnTXlTUUxcdTc5M0FcdTRGOEJcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU3OTNBXHU0RjhCTXlTUUxcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdteXNxbCcsXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgcG9ydDogMzMwNixcbiAgICBkYXRhYmFzZU5hbWU6ICdleGFtcGxlX2RiJyxcbiAgICB1c2VybmFtZTogJ3VzZXInLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy0yJyxcbiAgICBuYW1lOiAnUG9zdGdyZVNRTFx1NzUxRlx1NEVBN1x1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAncG9zdGdyZXNxbCcsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xMDAnLFxuICAgIHBvcnQ6IDU0MzIsXG4gICAgZGF0YWJhc2VOYW1lOiAncHJvZHVjdGlvbl9kYicsXG4gICAgdXNlcm5hbWU6ICdhZG1pbicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnaG91cmx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzNjAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDc3NzYwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTMnLFxuICAgIG5hbWU6ICdTUUxpdGVcdTY3MkNcdTU3MzBcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU2NzJDXHU1NzMwU1FMaXRlXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnc3FsaXRlJyxcbiAgICBkYXRhYmFzZU5hbWU6ICcvcGF0aC90by9sb2NhbC5kYicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnbWFudWFsJyxcbiAgICBsYXN0U3luY1RpbWU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzNDU2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtNCcsXG4gICAgbmFtZTogJ1NRTCBTZXJ2ZXJcdTZENEJcdThCRDVcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwU1FMIFNlcnZlclx1NkQ0Qlx1OEJENVx1NzNBRlx1NTg4MycsXG4gICAgdHlwZTogJ3NxbHNlcnZlcicsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4yMDAnLFxuICAgIHBvcnQ6IDE0MzMsXG4gICAgZGF0YWJhc2VOYW1lOiAndGVzdF9kYicsXG4gICAgdXNlcm5hbWU6ICd0ZXN0ZXInLFxuICAgIHN0YXR1czogJ2luYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnd2Vla2x5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSA2MDQ4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNTE4NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNTkyMDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiBmYWxzZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy01JyxcbiAgICBuYW1lOiAnT3JhY2xlXHU0RjAxXHU0RTFBXHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzME9yYWNsZVx1NEYwMVx1NEUxQVx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ29yYWNsZScsXG4gICAgaG9zdDogJzE5Mi4xNjguMS4xNTAnLFxuICAgIHBvcnQ6IDE1MjEsXG4gICAgZGF0YWJhc2VOYW1lOiAnZW50ZXJwcmlzZV9kYicsXG4gICAgdXNlcm5hbWU6ICdzeXN0ZW0nLFxuICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgc3luY0ZyZXF1ZW5jeTogJ2RhaWx5JyxcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTAzNjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTcyODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9XG5dO1xuXG4vKipcbiAqIFx1NzUxRlx1NjIxMFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGNvdW50IFx1NzUxRlx1NjIxMFx1NjU3MFx1OTFDRlxuICogQHJldHVybnMgXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU3RUM0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1vY2tEYXRhU291cmNlcyhjb3VudDogbnVtYmVyID0gNSk6IERhdGFTb3VyY2VbXSB7XG4gIGNvbnN0IHR5cGVzOiBEYXRhU291cmNlVHlwZVtdID0gWydteXNxbCcsICdwb3N0Z3Jlc3FsJywgJ29yYWNsZScsICdzcWxzZXJ2ZXInLCAnc3FsaXRlJ107XG4gIGNvbnN0IHN0YXR1c2VzOiBEYXRhU291cmNlU3RhdHVzW10gPSBbJ2FjdGl2ZScsICdpbmFjdGl2ZScsICdlcnJvcicsICdwZW5kaW5nJ107XG4gIGNvbnN0IHN5bmNGcmVxczogU3luY0ZyZXF1ZW5jeVtdID0gWydtYW51YWwnLCAnaG91cmx5JywgJ2RhaWx5JywgJ3dlZWtseScsICdtb250aGx5J107XG4gIFxuICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogY291bnQgfSwgKF8sIGkpID0+IHtcbiAgICBjb25zdCB0eXBlID0gdHlwZXNbaSAlIHR5cGVzLmxlbmd0aF07XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBkcy1nZW4tJHtpICsgMX1gLFxuICAgICAgbmFtZTogYFx1NzUxRlx1NjIxMFx1NzY4NCR7dHlwZX1cdTY1NzBcdTYzNkVcdTZFOTAgJHtpICsgMX1gLFxuICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTc2ODQke3R5cGV9XHU3QzdCXHU1NzhCXHU2NTcwXHU2MzZFXHU2RTkwICR7aSArIDF9YCxcbiAgICAgIHR5cGUsXG4gICAgICBob3N0OiB0eXBlICE9PSAnc3FsaXRlJyA/ICdsb2NhbGhvc3QnIDogdW5kZWZpbmVkLFxuICAgICAgcG9ydDogdHlwZSAhPT0gJ3NxbGl0ZScgPyAoMzMwNiArIGkpIDogdW5kZWZpbmVkLFxuICAgICAgZGF0YWJhc2VOYW1lOiB0eXBlID09PSAnc3FsaXRlJyA/IGAvcGF0aC90by9kYl8ke2l9LmRiYCA6IGBleGFtcGxlX2RiXyR7aX1gLFxuICAgICAgdXNlcm5hbWU6IHR5cGUgIT09ICdzcWxpdGUnID8gYHVzZXJfJHtpfWAgOiB1bmRlZmluZWQsXG4gICAgICBzdGF0dXM6IHN0YXR1c2VzW2kgJSBzdGF0dXNlcy5sZW5ndGhdLFxuICAgICAgc3luY0ZyZXF1ZW5jeTogc3luY0ZyZXFzW2kgJSBzeW5jRnJlcXMubGVuZ3RoXSxcbiAgICAgIGxhc3RTeW5jVGltZTogaSAlIDMgPT09IDAgPyBudWxsIDogbmV3IERhdGUobm93IC0gaSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShub3cgLSAoaSArIDEwKSAqIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShub3cgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBpc0FjdGl2ZTogaSAlIDQgIT09IDBcbiAgICB9O1xuICB9KTtcbn1cblxuLy8gXHU1QkZDXHU1MUZBXHU5RUQ4XHU4QkE0XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG5leHBvcnQgZGVmYXVsdCBtb2NrRGF0YVNvdXJjZXM7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvZGF0YXNvdXJjZS50c1wiOy8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwTW9ja1x1NjcwRFx1NTJBMVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTY1NzBcdTYzNkVcdTZFOTBcdTc2RjhcdTUxNzNBUElcdTc2ODRcdTZBMjFcdTYyREZcdTVCOUVcdTczQjBcbiAqL1xuXG5pbXBvcnQgeyBtb2NrRGF0YVNvdXJjZXMgfSBmcm9tICcuLi9kYXRhL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlIH0gZnJvbSAnLi4vZGF0YS9kYXRhc291cmNlJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuXG4vLyBcdTRFMzRcdTY1RjZcdTVCNThcdTUwQThcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdUZGMENcdTUxNDFcdThCQjhcdTZBMjFcdTYyREZcdTU4OUVcdTUyMjBcdTY1MzlcdTY0Q0RcdTRGNUNcbmxldCBkYXRhU291cmNlcyA9IFsuLi5tb2NrRGF0YVNvdXJjZXNdO1xuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICovXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZURlbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkZWxheSA9IHR5cGVvZiBtb2NrQ29uZmlnLmRlbGF5ID09PSAnbnVtYmVyJyA/IG1vY2tDb25maWcuZGVsYXkgOiAzMDA7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbn1cblxuLyoqXG4gKiBcdTkxQ0RcdTdGNkVcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTYzNkVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0RGF0YVNvdXJjZXMoKTogdm9pZCB7XG4gIGRhdGFTb3VyY2VzID0gWy4uLm1vY2tEYXRhU291cmNlc107XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKiBAcGFyYW0gcGFyYW1zIFx1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MFxuICogQHJldHVybnMgXHU1MjA2XHU5ODc1XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYXRhU291cmNlcyhwYXJhbXM/OiB7XG4gIHBhZ2U/OiBudW1iZXI7XG4gIHNpemU/OiBudW1iZXI7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHR5cGU/OiBzdHJpbmc7XG4gIHN0YXR1cz86IHN0cmluZztcbn0pOiBQcm9taXNlPHtcbiAgaXRlbXM6IERhdGFTb3VyY2VbXTtcbiAgcGFnaW5hdGlvbjoge1xuICAgIHRvdGFsOiBudW1iZXI7XG4gICAgcGFnZTogbnVtYmVyO1xuICAgIHNpemU6IG51bWJlcjtcbiAgICB0b3RhbFBhZ2VzOiBudW1iZXI7XG4gIH07XG59PiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gIGNvbnN0IHNpemUgPSBwYXJhbXM/LnNpemUgfHwgMTA7XG4gIFxuICAvLyBcdTVFOTRcdTc1MjhcdThGQzdcdTZFRTRcbiAgbGV0IGZpbHRlcmVkSXRlbXMgPSBbLi4uZGF0YVNvdXJjZXNdO1xuICBcbiAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/Lm5hbWUpIHtcbiAgICBjb25zdCBrZXl3b3JkID0gcGFyYW1zLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gXG4gICAgICBkcy5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAoZHMuZGVzY3JpcHRpb24gJiYgZHMuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICApO1xuICB9XG4gIFxuICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8udHlwZSkge1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBkcy50eXBlID09PSBwYXJhbXMudHlwZSk7XG4gIH1cbiAgXG4gIC8vIFx1NjMwOVx1NzJCNlx1NjAwMVx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoZHMgPT4gZHMuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgfVxuICBcbiAgLy8gXHU1RTk0XHU3NTI4XHU1MjA2XHU5ODc1XG4gIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmlsdGVyZWRJdGVtcy5sZW5ndGgpO1xuICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gIFxuICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgcmV0dXJuIHtcbiAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdG90YWw6IGZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgcGFnZSxcbiAgICAgIHNpemUsXG4gICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoZmlsdGVyZWRJdGVtcy5sZW5ndGggLyBzaXplKVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICogQHJldHVybnMgXHU2NTcwXHU2MzZFXHU2RTkwXHU4QkU2XHU2MEM1XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYXRhU291cmNlKGlkOiBzdHJpbmcpOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjdFNVx1NjI3RVx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCBkYXRhU291cmNlID0gZGF0YVNvdXJjZXMuZmluZChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKCFkYXRhU291cmNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIHJldHVybiBkYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGRhdGEgXHU2NTcwXHU2MzZFXHU2RTkwXHU2NTcwXHU2MzZFXG4gKiBAcmV0dXJucyBcdTUyMUJcdTVFRkFcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZURhdGFTb3VyY2UoZGF0YTogUGFydGlhbDxEYXRhU291cmNlPik6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwSURcbiAgY29uc3QgbmV3SWQgPSBgZHMtJHtEYXRlLm5vdygpfWA7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgbmV3RGF0YVNvdXJjZTogRGF0YVNvdXJjZSA9IHtcbiAgICBpZDogbmV3SWQsXG4gICAgbmFtZTogZGF0YS5uYW1lIHx8ICdOZXcgRGF0YSBTb3VyY2UnLFxuICAgIGRlc2NyaXB0aW9uOiBkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgIHR5cGU6IGRhdGEudHlwZSB8fCAnbXlzcWwnLFxuICAgIGhvc3Q6IGRhdGEuaG9zdCxcbiAgICBwb3J0OiBkYXRhLnBvcnQsXG4gICAgZGF0YWJhc2VOYW1lOiBkYXRhLmRhdGFiYXNlTmFtZSxcbiAgICB1c2VybmFtZTogZGF0YS51c2VybmFtZSxcbiAgICBzdGF0dXM6IGRhdGEuc3RhdHVzIHx8ICdwZW5kaW5nJyxcbiAgICBzeW5jRnJlcXVlbmN5OiBkYXRhLnN5bmNGcmVxdWVuY3kgfHwgJ21hbnVhbCcsXG4gICAgbGFzdFN5bmNUaW1lOiBudWxsLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH07XG4gIFxuICAvLyBcdTZERkJcdTUyQTBcdTUyMzBcdTUyMTdcdTg4NjhcbiAgZGF0YVNvdXJjZXMucHVzaChuZXdEYXRhU291cmNlKTtcbiAgXG4gIHJldHVybiBuZXdEYXRhU291cmNlO1xufVxuXG4vKipcbiAqIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKiBAcGFyYW0gZGF0YSBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcbiAqIEByZXR1cm5zIFx1NjZGNFx1NjVCMFx1NTQwRVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlRGF0YVNvdXJjZShpZDogc3RyaW5nLCBkYXRhOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTYyN0VcdTUyMzBcdTg5ODFcdTY2RjRcdTY1QjBcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcdTdEMjJcdTVGMTVcbiAgY29uc3QgaW5kZXggPSBkYXRhU291cmNlcy5maW5kSW5kZXgoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IHVwZGF0ZWREYXRhU291cmNlOiBEYXRhU291cmNlID0ge1xuICAgIC4uLmRhdGFTb3VyY2VzW2luZGV4XSxcbiAgICAuLi5kYXRhLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gIH07XG4gIFxuICAvLyBcdTY2RkZcdTYzNjJcdTY1NzBcdTYzNkVcdTZFOTBcbiAgZGF0YVNvdXJjZXNbaW5kZXhdID0gdXBkYXRlZERhdGFTb3VyY2U7XG4gIFxuICByZXR1cm4gdXBkYXRlZERhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZURhdGFTb3VyY2UoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2MjdFXHU1MjMwXHU4OTgxXHU1MjIwXHU5NjY0XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXHU3RDIyXHU1RjE1XG4gIGNvbnN0IGluZGV4ID0gZGF0YVNvdXJjZXMuZmluZEluZGV4KGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwYCk7XG4gIH1cbiAgXG4gIC8vIFx1NTIyMFx1OTY2NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBkYXRhU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIFx1NkQ0Qlx1OEJENVx1NjU3MFx1NjM2RVx1NkU5MFx1OEZERVx1NjNBNVxuICogQHBhcmFtIHBhcmFtcyBcdThGREVcdTYzQTVcdTUzQzJcdTY1NzBcbiAqIEByZXR1cm5zIFx1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1N0VEM1x1Njc5Q1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdENvbm5lY3Rpb24ocGFyYW1zOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTx7XG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIG1lc3NhZ2U/OiBzdHJpbmc7XG4gIGRldGFpbHM/OiBhbnk7XG59PiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTVCOUVcdTk2NDVcdTRGN0ZcdTc1MjhcdTY1RjZcdTUzRUZcdTgwRkRcdTRGMUFcdTY3MDlcdTY2RjRcdTU5MERcdTY3NDJcdTc2ODRcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTkwM0JcdThGOTFcbiAgLy8gXHU4RkQ5XHU5MUNDXHU3QjgwXHU1MzU1XHU2QTIxXHU2MkRGXHU2MjEwXHU1MjlGL1x1NTkzMVx1OEQyNVxuICBjb25zdCBzdWNjZXNzID0gTWF0aC5yYW5kb20oKSA+IDAuMjsgLy8gODAlXHU2MjEwXHU1MjlGXHU3Mzg3XG4gIFxuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3MsXG4gICAgbWVzc2FnZTogc3VjY2VzcyA/ICdcdThGREVcdTYzQTVcdTYyMTBcdTUyOUYnIDogJ1x1OEZERVx1NjNBNVx1NTkzMVx1OEQyNTogXHU2NUUwXHU2Q0Q1XHU4RkRFXHU2M0E1XHU1MjMwXHU2NTcwXHU2MzZFXHU1RTkzXHU2NzBEXHU1MkExXHU1NjY4JyxcbiAgICBkZXRhaWxzOiBzdWNjZXNzID8ge1xuICAgICAgcmVzcG9uc2VUaW1lOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCkgKyAxMCxcbiAgICAgIHZlcnNpb246ICc4LjAuMjgnLFxuICAgICAgY29ubmVjdGlvbklkOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkgKyAxMDAwXG4gICAgfSA6IHtcbiAgICAgIGVycm9yQ29kZTogJ0NPTk5FQ1RJT05fUkVGVVNFRCcsXG4gICAgICBlcnJvckRldGFpbHM6ICdcdTY1RTBcdTZDRDVcdTVFRkFcdTdBQ0JcdTUyMzBcdTY3MERcdTUyQTFcdTU2NjhcdTc2ODRcdThGREVcdTYzQTVcdUZGMENcdThCRjdcdTY4QzBcdTY3RTVcdTdGNTFcdTdFRENcdThCQkVcdTdGNkVcdTU0OENcdTUxRURcdTYzNkUnXG4gICAgfVxuICB9O1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTY3MERcdTUyQTFcbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0RGF0YVNvdXJjZXMsXG4gIGdldERhdGFTb3VyY2UsXG4gIGNyZWF0ZURhdGFTb3VyY2UsXG4gIHVwZGF0ZURhdGFTb3VyY2UsXG4gIGRlbGV0ZURhdGFTb3VyY2UsXG4gIHRlc3RDb25uZWN0aW9uLFxuICByZXNldERhdGFTb3VyY2VzXG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy91dGlscy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTAxQVx1NzUyOFx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTUyMUJcdTVFRkFcdTdFREZcdTRFMDBcdTY4M0NcdTVGMEZcdTU0Q0RcdTVFOTRcdTc2ODRcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzBcbiAqL1xuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NkEyMVx1NjJERkFQSVx1NjIxMFx1NTI5Rlx1NTRDRFx1NUU5NFxuICogQHBhcmFtIGRhdGEgXHU1NENEXHU1RTk0XHU2NTcwXHU2MzZFXG4gKiBAcGFyYW0gc3VjY2VzcyBcdTYyMTBcdTUyOUZcdTcyQjZcdTYwMDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0F0cnVlXG4gKiBAcGFyYW0gbWVzc2FnZSBcdTUzRUZcdTkwMDlcdTZEODhcdTYwNkZcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NjgzQ1x1NUYwRlx1NzY4NEFQSVx1NTRDRFx1NUU5NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja1Jlc3BvbnNlPFQ+KFxuICBkYXRhOiBULCBcbiAgc3VjY2VzczogYm9vbGVhbiA9IHRydWUsIFxuICBtZXNzYWdlPzogc3RyaW5nXG4pIHtcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzLFxuICAgIGRhdGEsXG4gICAgbWVzc2FnZSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBtb2NrUmVzcG9uc2U6IHRydWUgLy8gXHU2ODA3XHU4QkIwXHU0RTNBXHU2QTIxXHU2MkRGXHU1NENEXHU1RTk0XG4gIH07XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2QTIxXHU2MkRGQVBJXHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKiBAcGFyYW0gbWVzc2FnZSBcdTk1MTlcdThCRUZcdTZEODhcdTYwNkZcbiAqIEBwYXJhbSBjb2RlIFx1OTUxOVx1OEJFRlx1NEVFM1x1NzgwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQSdNT0NLX0VSUk9SJ1xuICogQHBhcmFtIHN0YXR1cyBIVFRQXHU3MkI2XHU2MDAxXHU3ODAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBNTAwXG4gKiBAcmV0dXJucyBcdTY4MDdcdTUxQzZcdTY4M0NcdTVGMEZcdTc2ODRcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlKFxuICBtZXNzYWdlOiBzdHJpbmcsIFxuICBjb2RlOiBzdHJpbmcgPSAnTU9DS19FUlJPUicsIFxuICBzdGF0dXM6IG51bWJlciA9IDUwMFxuKSB7XG4gIHJldHVybiB7XG4gICAgc3VjY2VzczogZmFsc2UsXG4gICAgZXJyb3I6IHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBjb2RlLFxuICAgICAgc3RhdHVzQ29kZTogc3RhdHVzXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICBtb2NrUmVzcG9uc2U6IHRydWVcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTUyMDZcdTk4NzVcdTU0Q0RcdTVFOTRcdTdFRDNcdTY3ODRcbiAqIEBwYXJhbSBpdGVtcyBcdTVGNTNcdTUyNERcdTk4NzVcdTc2ODRcdTk4NzlcdTc2RUVcdTUyMTdcdTg4NjhcbiAqIEBwYXJhbSB0b3RhbEl0ZW1zIFx1NjAzQlx1OTg3OVx1NzZFRVx1NjU3MFxuICogQHBhcmFtIHBhZ2UgXHU1RjUzXHU1MjREXHU5ODc1XHU3ODAxXG4gKiBAcGFyYW0gc2l6ZSBcdTZCQ0ZcdTk4NzVcdTU5MjdcdTVDMEZcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NFx1N0VEM1x1Njc4NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlPFQ+KFxuICBpdGVtczogVFtdLFxuICB0b3RhbEl0ZW1zOiBudW1iZXIsXG4gIHBhZ2U6IG51bWJlciA9IDEsXG4gIHNpemU6IG51bWJlciA9IDEwXG4pIHtcbiAgcmV0dXJuIGNyZWF0ZU1vY2tSZXNwb25zZSh7XG4gICAgaXRlbXMsXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdG90YWw6IHRvdGFsSXRlbXMsXG4gICAgICBwYWdlLFxuICAgICAgc2l6ZSxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCh0b3RhbEl0ZW1zIC8gc2l6ZSksXG4gICAgICBoYXNNb3JlOiBwYWdlICogc2l6ZSA8IHRvdGFsSXRlbXNcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFx1NUVGNlx1OEZERlxuICogQHBhcmFtIG1zIFx1NUVGNlx1OEZERlx1NkJFQlx1NzlEMlx1NjU3MFx1RkYwQ1x1OUVEOFx1OEJBNDMwMG1zXG4gKiBAcmV0dXJucyBQcm9taXNlXHU1QkY5XHU4QzYxXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxheShtczogbnVtYmVyID0gMzAwKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjcmVhdGVNb2NrUmVzcG9uc2UsXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5XG59OyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTZDNlx1NEUyRFx1NUJGQ1x1NTFGQVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRBUEkgTW9ja1x1NjcwRFx1NTJBMVx1NTE2NVx1NTNFM1x1NzBCOVxuICovXG5cbi8vIFx1NUJGQ1x1NTE2NVx1NjU3MFx1NjM2RVx1NkU5MFx1NjcwRFx1NTJBMVxuaW1wb3J0IGRhdGFTb3VyY2UgZnJvbSAnLi9kYXRhc291cmNlJztcblxuLy8gXHU1QkZDXHU1MTY1XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG5pbXBvcnQgeyBcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLCBcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsIFxuICBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsXG4gIGRlbGF5IFxufSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBcdTY3RTVcdThCRTJcdTY3MERcdTUyQTFNb2NrXG4gKi9cbmNvbnN0IHF1ZXJ5ID0ge1xuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyaWVzKHBhcmFtczogeyBwYWdlOiBudW1iZXI7IHNpemU6IG51bWJlcjsgfSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSh7XG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGlkOiAncTEnLCBuYW1lOiAnXHU3NTI4XHU2MjM3XHU1MjA2XHU2NzkwXHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTU3MzBcdTUzM0FcdTdFREZcdThCQTFcdTc1MjhcdTYyMzdcdTZDRThcdTUxOENcdTY1NzBcdTYzNkUnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTInLCBuYW1lOiAnXHU5NTAwXHU1NTJFXHU0RTFBXHU3RUU5XHU2N0U1XHU4QkUyJywgZGVzY3JpcHRpb246ICdcdTYzMDlcdTY3MDhcdTdFREZcdThCQTFcdTk1MDBcdTU1MkVcdTk4OUQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgICB7IGlkOiAncTMnLCBuYW1lOiAnXHU1RTkzXHU1QjU4XHU1MjA2XHU2NzkwJywgZGVzY3JpcHRpb246ICdcdTc2RDFcdTYzQTdcdTVFOTNcdTVCNThcdTZDMzRcdTVFNzMnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LFxuICAgICAgXSxcbiAgICAgIHRvdGFsOiAzLFxuICAgICAgcGFnZTogcGFyYW1zLnBhZ2UsXG4gICAgICBzaXplOiBwYXJhbXMuc2l6ZVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5KGlkOiBzdHJpbmcpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6ICdcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTInLFxuICAgICAgc3FsOiAnU0VMRUNUICogRlJPTSB1c2VycyBXSEVSRSBzdGF0dXMgPSAkMScsXG4gICAgICBwYXJhbWV0ZXJzOiBbJ2FjdGl2ZSddLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnkoZGF0YTogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGBxdWVyeS0ke0RhdGUubm93KCl9YCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyB1cGRhdGVRdWVyeShpZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlUXVlcnkoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnM6IFsnaWQnLCAnbmFtZScsICdlbWFpbCcsICdzdGF0dXMnXSxcbiAgICAgIHJvd3M6IFtcbiAgICAgICAgeyBpZDogMSwgbmFtZTogJ1x1NUYyMFx1NEUwOScsIGVtYWlsOiAnemhhbmdAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIG5hbWU6ICdcdTY3NEVcdTU2REInLCBlbWFpbDogJ2xpQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICAgICAgICB7IGlkOiAzLCBuYW1lOiAnXHU3MzhCXHU0RTk0JywgZW1haWw6ICd3YW5nQGV4YW1wbGUuY29tJywgc3RhdHVzOiAnaW5hY3RpdmUnIH0sXG4gICAgICBdLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgZXhlY3V0aW9uVGltZTogMC4yMzUsXG4gICAgICAgIHJvd0NvdW50OiAzLFxuICAgICAgICB0b3RhbFBhZ2VzOiAxXG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcblxuLyoqXG4gKiBcdTVCRkNcdTUxRkFcdTYyNDBcdTY3MDlcdTY3MERcdTUyQTFcbiAqL1xuY29uc3Qgc2VydmljZXMgPSB7XG4gIGRhdGFTb3VyY2UsXG4gIHF1ZXJ5XG59O1xuXG4vLyBcdTVCRkNcdTUxRkFtb2NrIHNlcnZpY2VcdTVERTVcdTUxNzdcbmV4cG9ydCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NTQwNFx1NEUyQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGNvbnN0IGRhdGFTb3VyY2VTZXJ2aWNlID0gc2VydmljZXMuZGF0YVNvdXJjZTtcbmV4cG9ydCBjb25zdCBxdWVyeVNlcnZpY2UgPSBzZXJ2aWNlcy5xdWVyeTtcblxuLy8gXHU5RUQ4XHU4QkE0XHU1QkZDXHU1MUZBXHU2MjQwXHU2NzA5XHU2NzBEXHU1MkExXG5leHBvcnQgZGVmYXVsdCBzZXJ2aWNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTdCQTFcdTc0MDZcdTZBMjFcdTU3NTdcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0SFRUUFx1OEJGN1x1NkM0Mlx1NjJFNlx1NjIyQVx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFxuICogXHU4RDFGXHU4RDIzXHU3QkExXHU3NDA2XHU1NDhDXHU1MjA2XHU1M0QxXHU2MjQwXHU2NzA5QVBJXHU4QkY3XHU2QzQyXHU1MjMwXHU1QkY5XHU1RTk0XHU3Njg0XHU2NzBEXHU1MkExXHU1OTA0XHU3NDA2XHU1MUZEXHU2NTcwXG4gKi9cblxuaW1wb3J0IHsgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCB7IGlzTW9ja0VuYWJsZWQsIGxvZ01vY2ssIG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHNlcnZpY2VzIGZyb20gJy4uL3NlcnZpY2VzJztcbmltcG9ydCB7IGNyZWF0ZU1vY2tSZXNwb25zZSwgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UgfSBmcm9tICcuLi9zZXJ2aWNlcy91dGlscyc7XG5cbi8qKlxuICogXHU4QkY3XHU2QzQyXHU0RTBBXHU0RTBCXHU2NTg3XHU3QzdCXHU1NzhCXHU1QjlBXHU0RTQ5XG4gKi9cbmludGVyZmFjZSBSZXF1ZXN0Q29udGV4dCB7XG4gIHJlcTogQ29ubmVjdC5JbmNvbWluZ01lc3NhZ2U7XG4gIHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZTtcbiAgcGF0aDogc3RyaW5nO1xuICBtZXRob2Q6IHN0cmluZztcbiAgcXVlcnlQYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGJvZHk6IGFueTtcbiAgbm9ybWFsaXplZDoge1xuICAgIHVybDogc3RyaW5nO1xuICAgIHBhdGg6IHN0cmluZztcbiAgICBwcmVmaXg6IHN0cmluZztcbiAgfTtcbiAgcGFnaW5hdGlvbjoge1xuICAgIHBhZ2U6IG51bWJlcjtcbiAgICBzaXplOiBudW1iZXI7XG4gIH07XG59XG5cbi8qKlxuICogXHU2NTcwXHU2MzZFXHU2RTkwXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwXG4gKi9cbmludGVyZmFjZSBEYXRhU291cmNlUXVlcnlQYXJhbXMge1xuICBwYWdlOiBudW1iZXI7XG4gIHNpemU6IG51bWJlcjtcbiAgbmFtZT86IHN0cmluZztcbiAgdHlwZT86IHN0cmluZztcbiAgc3RhdHVzPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFx1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MFxuICovXG5pbnRlcmZhY2UgUXVlcnlQYXJhbXMge1xuICBwYWdlOiBudW1iZXI7XG4gIHNpemU6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBcdTYzRDBcdTUzRDZcdTU0OENcdTg5RTNcdTY3OTBcdThCRjdcdTZDNDJcdTRGNTNcbiAqL1xuY29uc3QgcGFyc2VSZXF1ZXN0Qm9keSA9IGFzeW5jIChyZXE6IENvbm5lY3QuSW5jb21pbmdNZXNzYWdlKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3QgY2h1bmtzOiBCdWZmZXJbXSA9IFtdO1xuICAgIFxuICAgIHJlcS5vbignZGF0YScsIChjaHVuazogQnVmZmVyKSA9PiBjaHVua3MucHVzaChjaHVuaykpO1xuICAgIFxuICAgIHJlcS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgaWYgKGNodW5rcy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKHt9KTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYm9keVN0ciA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZygpO1xuICAgICAgICBjb25zdCBib2R5ID0gYm9keVN0ciAmJiBib2R5U3RyLnRyaW0oKSA/IEpTT04ucGFyc2UoYm9keVN0cikgOiB7fTtcbiAgICAgICAgbG9nTW9jaygnZGVidWcnLCAnXHU4OUUzXHU2NzkwXHU4QkY3XHU2QzQyXHU0RjUzXHU2MjEwXHU1MjlGOicsIGJvZHkpO1xuICAgICAgICByZXNvbHZlKGJvZHkpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nTW9jaygnd2FybicsICdcdThCRjdcdTZDNDJcdTRGNTNcdTg5RTNcdTY3OTBcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFx1NTNEMVx1OTAwMUpTT05cdTU0Q0RcdTVFOTRcbiAqL1xuY29uc3Qgc2VuZEpzb24gPSAocmVzOiBodHRwLlNlcnZlclJlc3BvbnNlLCBzdGF0dXNDb2RlOiBudW1iZXIsIGRhdGE6IGFueSk6IHZvaWQgPT4ge1xuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1c0NvZGU7XG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbiwgWC1SZXF1ZXN0ZWQtV2l0aCcpO1xuICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgbG9nTW9jaygnZGVidWcnLCBgXHU1M0QxXHU5MDAxXHU1NENEXHU1RTk0OiBcdTcyQjZcdTYwMDFcdTc4MDE9JHtzdGF0dXNDb2RlfWAsIHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IEpTT04uc3RyaW5naWZ5KGRhdGEpLnN1YnN0cmluZygwLCAxMDApICsgJy4uLicgOiBkYXRhKTtcbn07XG5cbi8qKlxuICogXHU1OTA0XHU3NDA2XHU5NTE5XHU4QkVGXHU1NENEXHU1RTk0XG4gKi9cbmNvbnN0IGhhbmRsZUVycm9yID0gKHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZSwgZXJyb3I6IGFueSwgc3RhdHVzQ29kZSA9IDUwMCk6IHZvaWQgPT4ge1xuICBsb2dNb2NrKCdlcnJvcicsICdcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTUxRkFcdTk1MTk6JywgZXJyb3IpO1xuICBcbiAgY29uc3QgZXJyb3JSZXNwb25zZSA9IGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlKFxuICAgIGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICBlcnJvci5jb2RlIHx8ICdNT0NLX0VSUk9SJyxcbiAgICBzdGF0dXNDb2RlXG4gICk7XG4gIFxuICBzZW5kSnNvbihyZXMsIHN0YXR1c0NvZGUsIGVycm9yUmVzcG9uc2UpO1xufTtcblxuLyoqXG4gKiBcdTZERkJcdTUyQTBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuY29uc3QgYWRkRGVsYXkgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IHsgZGVsYXkgfSA9IG1vY2tDb25maWc7XG4gIFxuICBpZiAodHlwZW9mIGRlbGF5ID09PSAnbnVtYmVyJyAmJiBkZWxheSA+IDApIHtcbiAgICBjb25zdCBkZWxheU1zID0gZGVsYXk7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU2REZCXHU1MkEwXHU1NkZBXHU1QjlBXHU1RUY2XHU4RkRGOiAke2RlbGF5TXN9bXNgKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXlNcykpO1xuICB9IGVsc2UgaWYgKGRlbGF5ICYmIHR5cGVvZiBkZWxheSA9PT0gJ29iamVjdCcpIHtcbiAgICBjb25zdCB7IG1pbiwgbWF4IH0gPSBkZWxheTtcbiAgICBjb25zdCByYW5kb21EZWxheSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU2REZCXHU1MkEwXHU5NjhGXHU2NzNBXHU1RUY2XHU4RkRGOiAke3JhbmRvbURlbGF5fW1zIChcdTgzMDNcdTU2RjQ6ICR7bWlufS0ke21heH1tcylgKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgcmFuZG9tRGVsYXkpKTtcbiAgfVxufTtcblxuLyoqXG4gKiBcdTU5MDRcdTc0MDZPUFRJT05TXHU4QkY3XHU2QzQyXHVGRjA4Q09SU1x1OTg4NFx1NjhDMFx1RkYwOVxuICovXG5jb25zdCBoYW5kbGVPcHRpb25zUmVxdWVzdCA9IChyZXM6IGh0dHAuU2VydmVyUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbiwgWC1SZXF1ZXN0ZWQtV2l0aCcpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1NYXgtQWdlJywgJzg2NDAwJyk7IC8vIDI0XHU1QzBGXHU2NUY2XG4gIHJlcy5lbmQoKTtcbiAgbG9nTW9jaygnZGVidWcnLCAnXHU1OTA0XHU3NDA2T1BUSU9OU1x1OTg4NFx1NjhDMFx1OEJGN1x1NkM0MicpO1xufTtcblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdThCRjdcdTZDNDJcdTRFMEFcdTRFMEJcdTY1ODdcbiAqL1xuY29uc3QgY3JlYXRlQ29udGV4dCA9IGFzeW5jIChcbiAgcmVxOiBDb25uZWN0LkluY29taW5nTWVzc2FnZSwgXG4gIHJlczogaHR0cC5TZXJ2ZXJSZXNwb25zZVxuKTogUHJvbWlzZTxSZXF1ZXN0Q29udGV4dD4gPT4ge1xuICAvLyBcdTY4MDdcdTUxQzZcdTUzMTZVUkwgKFx1NzlGQlx1OTY2NFx1NTNFRlx1ODBGRFx1NzY4NFx1OTFDRFx1NTkwRC9hcGlcdTUyNERcdTdGMDApXG4gIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJy8nO1xuICBjb25zdCBub3JtYWxpemVkVXJsID0gdXJsLnJlcGxhY2UoL1xcL2FwaVxcL2FwaVxcLy8sICcvYXBpLycpO1xuICBcbiAgLy8gXHU4OUUzXHU2NzkwVVJMXG4gIGNvbnN0IHVybE9iaiA9IG5ldyBVUkwoYGh0dHA6Ly9sb2NhbGhvc3Qke25vcm1hbGl6ZWRVcmx9YCk7XG4gIGNvbnN0IHBhdGggPSB1cmxPYmoucGF0aG5hbWU7XG4gIFxuICAvLyBcdTYzRDBcdTUzRDZBUElcdTUyNERcdTdGMDBcbiAgY29uc3QgYXBpUHJlZml4ID0gcGF0aC5zdGFydHNXaXRoKCcvYXBpJykgPyAnL2FwaScgOiAnJztcbiAgXG4gIC8vIFx1ODlFM1x1Njc5MFx1NjdFNVx1OEJFMlx1NTNDMlx1NjU3MFxuICBjb25zdCBxdWVyeVBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICB1cmxPYmouc2VhcmNoUGFyYW1zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICBxdWVyeVBhcmFtc1trZXldID0gdmFsdWU7XG4gIH0pO1xuICBcbiAgLy8gXHU2M0QwXHU1M0Q2XHU1MjA2XHU5ODc1XHU1M0MyXHU2NTcwXG4gIGNvbnN0IHBhZ2UgPSBwYXJzZUludChxdWVyeVBhcmFtcy5wYWdlIHx8ICcxJywgMTApO1xuICBjb25zdCBzaXplID0gcGFyc2VJbnQocXVlcnlQYXJhbXMuc2l6ZSB8fCAnMTAnLCAxMCk7XG4gIFxuICAvLyBcdTYzRDBcdTUzRDZcdThCRjdcdTZDNDJcdTRGNTNcbiAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgXG4gIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgcmVxLFxuICAgIHJlcyxcbiAgICBwYXRoLFxuICAgIG1ldGhvZDogcmVxLm1ldGhvZCB8fCAnR0VUJyxcbiAgICBxdWVyeVBhcmFtcyxcbiAgICBib2R5LFxuICAgIG5vcm1hbGl6ZWQ6IHtcbiAgICAgIHVybDogbm9ybWFsaXplZFVybCxcbiAgICAgIHBhdGgsXG4gICAgICBwcmVmaXg6IGFwaVByZWZpeFxuICAgIH0sXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgcGFnZSxcbiAgICAgIHNpemVcbiAgICB9XG4gIH07XG4gIFxuICBsb2dNb2NrKCdkZWJ1ZycsICdcdThCRjdcdTZDNDJcdTRFMEFcdTRFMEJcdTY1ODdcdTUyMUJcdTVFRkFcdTVCOENcdTYyMTA6Jywge1xuICAgIHVybDogbm9ybWFsaXplZFVybCxcbiAgICBwYXRoLFxuICAgIG1ldGhvZDogY29udGV4dC5tZXRob2QsXG4gICAgcXVlcnlQYXJhbXM6IE9iamVjdC5rZXlzKHF1ZXJ5UGFyYW1zKS5sZW5ndGggPiAwID8gcXVlcnlQYXJhbXMgOiAnXHU2NUUwJyxcbiAgICBib2R5U2l6ZTogdHlwZW9mIGJvZHkgPT09ICdvYmplY3QnID8gT2JqZWN0LmtleXMoYm9keSkubGVuZ3RoIDogJ1x1OTc1RVx1NUJGOVx1OEM2MSdcbiAgfSk7XG4gIFxuICByZXR1cm4gY29udGV4dDtcbn07XG5cbi8qKlxuICogXHU4REVGXHU3NTMxXHU1OTA0XHU3NDA2XHU1NjY4XHU3QzdCXHU1NzhCXG4gKi9cbnR5cGUgUm91dGVIYW5kbGVyID0gKGNvbnRleHQ6IFJlcXVlc3RDb250ZXh0KSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuXG4vKipcbiAqIFx1NjU3MFx1NjM2RVx1NkU5MFx1OERFRlx1NzUzMVx1NTkwNFx1NzQwNlx1NTY2OFxuICovXG5jb25zdCBoYW5kbGVEYXRhU291cmNlUm91dGVzOiBSb3V0ZUhhbmRsZXIgPSBhc3luYyAoY29udGV4dCkgPT4ge1xuICBjb25zdCB7IHBhdGgsIG1ldGhvZCwgYm9keSwgcGFnaW5hdGlvbiwgcmVzIH0gPSBjb250ZXh0O1xuICBcbiAgdHJ5IHtcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY1NzBcdTYzNkVcdTZFOTBcbiAgICBjb25zdCBzaW5nbGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvKFteXFwvXSspJC8pO1xuICAgIGlmIChzaW5nbGVNYXRjaCAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICBjb25zdCBpZCA9IHNpbmdsZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnaW5mbycsIGBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTA6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS5nZXREYXRhU291cmNlKGlkKTtcbiAgICAgIGF3YWl0IGFkZERlbGF5KCk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG4gICAgaWYgKHBhdGgubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvPyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICBsb2dNb2NrKCdpbmZvJywgJ1x1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OCcsIHBhZ2luYXRpb24pO1xuICAgICAgXG4gICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIHBhZ2U6IHBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgc2l6ZTogcGFnaW5hdGlvbi5zaXplLFxuICAgICAgICBuYW1lOiBjb250ZXh0LnF1ZXJ5UGFyYW1zLm5hbWUsXG4gICAgICAgIHR5cGU6IGNvbnRleHQucXVlcnlQYXJhbXMudHlwZSxcbiAgICAgICAgc3RhdHVzOiBjb250ZXh0LnF1ZXJ5UGFyYW1zLnN0YXR1c1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5kYXRhU291cmNlLmdldERhdGFTb3VyY2VzKHBhcmFtcyk7XG4gICAgICBhd2FpdCBhZGREZWxheSgpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NjU3MFx1NjM2RVx1NkU5MFxuICAgIGlmIChwYXRoLm1hdGNoKC9cXC9hcGlcXC9kYXRhc291cmNlc1xcLz8kLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgIGxvZ01vY2soJ2luZm8nLCAnXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwJywgYm9keSk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS5jcmVhdGVEYXRhU291cmNlKGJvZHkpO1xuICAgICAgYXdhaXQgYWRkRGVsYXkoKTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAxLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgICBjb25zdCB1cGRhdGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL2RhdGFzb3VyY2VzXFwvKFteXFwvXSspJC8pO1xuICAgIGlmICh1cGRhdGVNYXRjaCAmJiBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgICBjb25zdCBpZCA9IHVwZGF0ZU1hdGNoWzFdO1xuICAgICAgbG9nTW9jaygnaW5mbycsIGBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTA6ICR7aWR9YCwgYm9keSk7XG4gICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmljZXMuZGF0YVNvdXJjZS51cGRhdGVEYXRhU291cmNlKGlkLCBib2R5KTtcbiAgICAgIGF3YWl0IGFkZERlbGF5KCk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gICAgY29uc3QgZGVsZXRlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9kYXRhc291cmNlc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAoZGVsZXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgICAgY29uc3QgaWQgPSBkZWxldGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2luZm8nLCBgXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwOiAke2lkfWApO1xuICAgICAgXG4gICAgICBhd2FpdCBzZXJ2aWNlcy5kYXRhU291cmNlLmRlbGV0ZURhdGFTb3VyY2UoaWQpO1xuICAgICAgYXdhaXQgYWRkRGVsYXkoKTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UoeyBpZCwgZGVsZXRlZDogdHJ1ZSB9KSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaGFuZGxlRXJyb3IocmVzLCBlcnJvcik7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogXHU2N0U1XHU4QkUyXHU4REVGXHU3NTMxXHU1OTA0XHU3NDA2XHU1NjY4XG4gKi9cbmNvbnN0IGhhbmRsZVF1ZXJ5Um91dGVzOiBSb3V0ZUhhbmRsZXIgPSBhc3luYyAoY29udGV4dCkgPT4ge1xuICBjb25zdCB7IHBhdGgsIG1ldGhvZCwgYm9keSwgcGFnaW5hdGlvbiwgcmVzIH0gPSBjb250ZXh0O1xuICBcbiAgdHJ5IHtcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgICBjb25zdCBzaW5nbGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKHNpbmdsZU1hdGNoICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gc2luZ2xlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdpbmZvJywgYFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMjogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5xdWVyeS5nZXRRdWVyeShpZCk7XG4gICAgICBhd2FpdCBhZGREZWxheSgpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgIGlmIChwYXRoLm1hdGNoKC9cXC9hcGlcXC9xdWVyaWVzXFwvPyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICBsb2dNb2NrKCdpbmZvJywgJ1x1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OCcsIHBhZ2luYXRpb24pO1xuICAgICAgXG4gICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIHBhZ2U6IHBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgc2l6ZTogcGFnaW5hdGlvbi5zaXplXG4gICAgICB9O1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LmdldFF1ZXJpZXMocGFyYW1zKTtcbiAgICAgIGF3YWl0IGFkZERlbGF5KCk7XG4gICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHJlc3BvbnNlKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gICAgaWYgKHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8/JC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICBsb2dNb2NrKCdpbmZvJywgJ1x1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMicsIGJvZHkpO1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LmNyZWF0ZVF1ZXJ5KGJvZHkpO1xuICAgICAgYXdhaXQgYWRkRGVsYXkoKTtcbiAgICAgIHNlbmRKc29uKHJlcywgMjAxLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2UpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgICBjb25zdCB1cGRhdGVNYXRjaCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL3F1ZXJpZXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKHVwZGF0ZU1hdGNoICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICAgIGNvbnN0IGlkID0gdXBkYXRlTWF0Y2hbMV07XG4gICAgICBsb2dNb2NrKCdpbmZvJywgYFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMjogJHtpZH1gLCBib2R5KTtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlcy5xdWVyeS51cGRhdGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBhd2FpdCBhZGREZWxheSgpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGRlbGV0ZU1hdGNoID0gcGF0aC5tYXRjaCgvXFwvYXBpXFwvcXVlcmllc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAoZGVsZXRlTWF0Y2ggJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgICAgY29uc3QgaWQgPSBkZWxldGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2luZm8nLCBgXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyOiAke2lkfWApO1xuICAgICAgXG4gICAgICBhd2FpdCBzZXJ2aWNlcy5xdWVyeS5kZWxldGVRdWVyeShpZCk7XG4gICAgICBhd2FpdCBhZGREZWxheSgpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZSh7IGlkLCBkZWxldGVkOiB0cnVlIH0pKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcbiAgICBjb25zdCBleGVjdXRlTWF0Y2ggPSBwYXRoLm1hdGNoKC9cXC9hcGlcXC9xdWVyaWVzXFwvKFteXFwvXSspXFwvZXhlY3V0ZSQvKTtcbiAgICBpZiAoZXhlY3V0ZU1hdGNoICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICBjb25zdCBpZCA9IGV4ZWN1dGVNYXRjaFsxXTtcbiAgICAgIGxvZ01vY2soJ2luZm8nLCBgXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyOiAke2lkfWAsIGJvZHkpO1xuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VzLnF1ZXJ5LmV4ZWN1dGVRdWVyeShpZCwgYm9keSk7XG4gICAgICBhd2FpdCBhZGREZWxheSgpO1xuICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGhhbmRsZUVycm9yKHJlcywgZXJyb3IpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIFx1OTAxQVx1NzUyOFx1NTRDRFx1NUU5NFx1NzUxRlx1NjIxMFx1NTY2OFx1RkYwQ1x1NTkwNFx1NzQwNlx1NjcyQVx1NTMzOVx1OTE0RFx1NzY4NEFQSVx1OEJGN1x1NkM0MlxuICovXG5jb25zdCBoYW5kbGVHZW5lcmljUm91dGVzOiBSb3V0ZUhhbmRsZXIgPSBhc3luYyAoY29udGV4dCkgPT4ge1xuICBjb25zdCB7IHBhdGgsIG1ldGhvZCwgcmVzIH0gPSBjb250ZXh0O1xuICBcbiAgdHJ5IHtcbiAgICBsb2dNb2NrKCd3YXJuJywgYFx1NjcyQVx1NTMzOVx1OTE0RFx1NzY4NEFQSVx1OEJGN1x1NkM0MjogJHttZXRob2R9ICR7cGF0aH1gKTtcbiAgICBcbiAgICAvLyBcdTU5ODJcdTY3OUNcdThERUZcdTVGODRcdTRFRTUvYXBpL1x1NUYwMFx1NTkzNFx1RkYwQ1x1NzUxRlx1NjIxMFx1OTAxQVx1NzUyOFx1NTRDRFx1NUU5NFxuICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoJy9hcGkvJykpIHtcbiAgICAgIGF3YWl0IGFkZERlbGF5KCk7XG4gICAgICBcbiAgICAgIGlmIChtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICAgIC8vIEdFVFx1OEJGN1x1NkM0Mlx1OEZENFx1NTZERVx1N0E3QVx1NjU3MFx1N0VDNFx1NjIxNlx1N0E3QVx1NUJGOVx1OEM2MVxuICAgICAgICBjb25zdCBpc0xpc3RFbmRwb2ludCA9IHBhdGgubWF0Y2goL1xcL2FwaVxcL1thLXpBLVowLTlfLV0rXFwvPyQvKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0gaXNMaXN0RW5kcG9pbnQgXG4gICAgICAgICAgPyB7IGl0ZW1zOiBbXSwgdG90YWw6IDAsIHBhZ2U6IDEsIHNpemU6IDEwIH1cbiAgICAgICAgICA6IHsgaWQ6ICcxMjM0NScsIG5hbWU6ICdHZW5lcmljIEl0ZW0nIH07XG4gICAgICAgICAgXG4gICAgICAgIHNlbmRKc29uKHJlcywgMjAwLCBjcmVhdGVNb2NrUmVzcG9uc2UocmVzcG9uc2VEYXRhKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgICAvLyBQT1NUXHU4QkY3XHU2QzQyXHU4RkQ0XHU1NkRFXHU2MjEwXHU1MjlGXHU1MjFCXHU1RUZBXHU1NENEXHU1RTk0XG4gICAgICAgIHNlbmRKc29uKHJlcywgMjAxLCBjcmVhdGVNb2NrUmVzcG9uc2UoeyBpZDogJzEyMzQ1JywgY3JlYXRlZDogdHJ1ZSB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgICAgIC8vIFBVVFx1OEJGN1x1NkM0Mlx1OEZENFx1NTZERVx1NjIxMFx1NTI5Rlx1NjZGNFx1NjVCMFx1NTRDRFx1NUU5NFxuICAgICAgICBzZW5kSnNvbihyZXMsIDIwMCwgY3JlYXRlTW9ja1Jlc3BvbnNlKHsgaWQ6ICcxMjM0NScsIHVwZGF0ZWQ6IHRydWUgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSAnREVMRVRFJykge1xuICAgICAgICAvLyBERUxFVEVcdThCRjdcdTZDNDJcdThGRDRcdTU2REVcdTYyMTBcdTUyOUZcdTUyMjBcdTk2NjRcdTU0Q0RcdTVFOTRcbiAgICAgICAgc2VuZEpzb24ocmVzLCAyMDAsIGNyZWF0ZU1vY2tSZXNwb25zZSh7IGRlbGV0ZWQ6IHRydWUgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaGFuZGxlRXJyb3IocmVzLCBlcnJvcik7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlxuICogXG4gKiBcdTZCNjRcdTRFMkRcdTk1RjRcdTRFRjZcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDJcdTVFNzZcdTYzRDBcdTRGOUJcdTZBMjFcdTYyREZcdTU0Q0RcdTVFOTRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlTW9ja01pZGRsZXdhcmUoKTogQ29ubmVjdC5OZXh0SGFuZGxlRnVuY3Rpb24ge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbW9ja01pZGRsZXdhcmUoXG4gICAgcmVxOiBDb25uZWN0LkluY29taW5nTWVzc2FnZSwgXG4gICAgcmVzOiBodHRwLlNlcnZlclJlc3BvbnNlLCBcbiAgICBuZXh0OiBDb25uZWN0Lk5leHRGdW5jdGlvblxuICApIHtcbiAgICAvLyBcdTY4QzBcdTY3RTVNb2NrXHU2NzBEXHU1MkExXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XG4gICAgaWYgKCFpc01vY2tFbmFibGVkKCkpIHtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgJ01vY2tcdTY3MERcdTUyQTFcdTY3MkFcdTU0MkZcdTc1MjhcdUZGMENcdThERjNcdThGQzdcdThCRjdcdTZDNDInLCByZXEudXJsKTtcbiAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTNFQVx1NTkwNFx1NzQwNkFQSVx1OEJGN1x1NkM0Mlx1RkYwQ1x1NTE3Nlx1NEVENlx1OEJGN1x1NkM0Mlx1NzZGNFx1NjNBNVx1NjUzRVx1ODg0Q1xuICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgaWYgKCF1cmwuc3RhcnRzV2l0aCgnL2FwaS8nKSkge1xuICAgICAgbG9nTW9jaygnZGVidWcnLCAnXHU5NzVFQVBJXHU4QkY3XHU2QzQyXHVGRjBDXHU4REYzXHU4RkM3XHU2MkU2XHU2MjJBJywgdXJsKTtcbiAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgfVxuICAgIFxuICAgIGxvZ01vY2soJ2luZm8nLCBgXHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBcdTU5MDRcdTc0MDZPUFRJT05TXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnICYmIHVybC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgIGhhbmRsZU9wdGlvbnNSZXF1ZXN0KHJlcyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU1MjFCXHU1RUZBXHU4QkY3XHU2QzQyXHU0RTBBXHU0RTBCXHU2NTg3XG4gICAgICBjb25zdCBjb250ZXh0ID0gYXdhaXQgY3JlYXRlQ29udGV4dChyZXEsIHJlcyk7XG4gICAgICBcbiAgICAgIC8vIFx1NUMxRFx1OEJENVx1NjMwOVx1OERFRlx1NzUzMVx1N0M3Qlx1NTc4Qlx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0MlxuICAgICAgYXdhaXQgYWRkRGVsYXkoKTtcbiAgICAgIFxuICAgICAgY29uc3QgaGFuZGxlcnM6IFJvdXRlSGFuZGxlcltdID0gW1xuICAgICAgICBoYW5kbGVEYXRhU291cmNlUm91dGVzLFxuICAgICAgICBoYW5kbGVRdWVyeVJvdXRlcyxcbiAgICAgICAgaGFuZGxlR2VuZXJpY1JvdXRlc1xuICAgICAgXTtcbiAgICAgIFxuICAgICAgLy8gXHU0RjlEXHU2QjIxXHU1QzFEXHU4QkQ1XHU2QkNGXHU0RTJBXHU1OTA0XHU3NDA2XHU1NjY4XG4gICAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgaGFuZGxlcnMpIHtcbiAgICAgICAgY29uc3QgaGFuZGxlZCA9IGF3YWl0IGhhbmRsZXIoY29udGV4dCk7XG4gICAgICAgIGlmIChoYW5kbGVkKSByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NkNBMVx1NjcwOVx1NTkwNFx1NzQwNlx1NTY2OFx1ODBGRFx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0Mlx1RkYwQ1x1N0VFN1x1N0VFRFx1NEVBNFx1N0VEOVx1NEUwQlx1NEUwMFx1NEUyQVx1NEUyRFx1OTVGNFx1NEVGNlxuICAgICAgbG9nTW9jaygnd2FybicsIGBcdTY1RTBcdTZDRDVcdTU5MDRcdTc0MDZcdTc2ODRBUElcdThCRjdcdTZDNDJcdUZGMENcdTRGMjBcdTkwMTJcdTdFRDlcdTRFMEJcdTRFMDBcdTRFMkFcdTRFMkRcdTk1RjRcdTRFRjY6ICR7cmVxLm1ldGhvZH0gJHt1cmx9YCk7XG4gICAgICBuZXh0KCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ01vY2soJ2Vycm9yJywgJ1x1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NTFGQVx1OTUxOTonLCBlcnJvcik7XG4gICAgICBoYW5kbGVFcnJvcihyZXMsIGVycm9yKTtcbiAgICB9XG4gIH07XG59ICJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFksU0FBUyxjQUFjLGVBQWU7QUFDaGIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGdCQUFnQjtBQUN6QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGtCQUFrQjs7O0FDQ3pCLElBQU0sWUFBWSxNQUFNO0FBTnhCO0FBUUUsTUFBSSxPQUFPLFdBQVcsYUFBYTtBQUNqQyxRQUFLLE9BQWUsbUJBQW1CO0FBQU8sYUFBTztBQUNyRCxRQUFLLE9BQWUsd0JBQXdCO0FBQU0sYUFBTztBQUFBLEVBQzNEO0FBSUEsUUFBSSw4Q0FBYSxRQUFiLG1CQUFrQix1QkFBc0I7QUFBUyxXQUFPO0FBRzVELFFBQUksOENBQWEsUUFBYixtQkFBa0IsdUJBQXNCO0FBQVEsV0FBTztBQUczRCxRQUFNLGtCQUFnQiw4Q0FBYSxRQUFiLG1CQUFrQixVQUFTO0FBR2pELFNBQU87QUFDVDtBQUtPLElBQU0sYUFBYTtBQUFBO0FBQUEsRUFFeEIsU0FBUyxVQUFVO0FBQUE7QUFBQSxFQUduQixPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsRUFDUDtBQUFBO0FBQUEsRUFHQSxLQUFLO0FBQUE7QUFBQSxJQUVILFNBQVM7QUFBQTtBQUFBLElBR1QsVUFBVTtBQUFBLEVBQ1o7QUFBQTtBQUFBLEVBR0EsU0FBUztBQUFBLElBQ1AsWUFBWTtBQUFBLElBQ1osT0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLElBQ2IsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLEVBQ1o7QUFBQTtBQUFBLEVBR0EsU0FBUztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBO0FBQUEsRUFDVDtBQUFBO0FBQUEsRUFHQSxJQUFJLFdBQXFCO0FBQ3ZCLFdBQU8sS0FBSyxRQUFRLFVBQVcsS0FBSyxRQUFRLFFBQXFCO0FBQUEsRUFDbkU7QUFDRjtBQUtPLFNBQVMsZ0JBQXlCO0FBRXZDLFNBQU8sV0FBVztBQUNwQjtBQVlPLFNBQVMsUUFBUSxPQUFpQixZQUFvQixNQUFtQjtBQUM5RSxRQUFNLGNBQWMsV0FBVztBQUcvQixRQUFNLFNBQW1DO0FBQUEsSUFDdkMsUUFBUTtBQUFBLElBQ1IsU0FBUztBQUFBLElBQ1QsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsU0FBUztBQUFBLEVBQ1g7QUFHQSxNQUFJLE9BQU8sV0FBVyxLQUFLLE9BQU8sS0FBSyxHQUFHO0FBQ3hDLFVBQU0sU0FBUyxTQUFTLE1BQU0sWUFBWSxDQUFDO0FBRTNDLFlBQVEsT0FBTztBQUFBLE1BQ2IsS0FBSztBQUNILGdCQUFRLE1BQU0sUUFBUSxTQUFTLEdBQUcsSUFBSTtBQUN0QztBQUFBLE1BQ0YsS0FBSztBQUNILGdCQUFRLEtBQUssUUFBUSxTQUFTLEdBQUcsSUFBSTtBQUNyQztBQUFBLE1BQ0YsS0FBSztBQUNILGdCQUFRLEtBQUssUUFBUSxTQUFTLEdBQUcsSUFBSTtBQUNyQztBQUFBLE1BQ0YsS0FBSztBQUNILGdCQUFRLE1BQU0sUUFBUSxTQUFTLEdBQUcsSUFBSTtBQUN0QztBQUFBLElBQ0o7QUFBQSxFQUNGO0FBQ0Y7OztBQ2xGTyxJQUFNLGtCQUFnQztBQUFBLEVBQzNDO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsSUFDZixjQUFjLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFRLEVBQUUsWUFBWTtBQUFBLElBQzFELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVUsRUFBRSxZQUFZO0FBQUEsSUFDekQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBUyxFQUFFLFlBQVk7QUFBQSxJQUN4RCxVQUFVO0FBQUEsRUFDWjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxJQUNmLGNBQWMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQU8sRUFBRSxZQUFZO0FBQUEsSUFDekQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFTLEVBQUUsWUFBWTtBQUFBLElBQ3hELFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sY0FBYztBQUFBLElBQ2QsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLElBQ2YsY0FBYztBQUFBLElBQ2QsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFTLEVBQUUsWUFBWTtBQUFBLElBQ3hELFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sY0FBYztBQUFBLElBQ2QsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLElBQ2YsY0FBYyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBUyxFQUFFLFlBQVk7QUFBQSxJQUMzRCxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFVLEVBQUUsWUFBWTtBQUFBLElBQ3pELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQVUsRUFBRSxZQUFZO0FBQUEsSUFDekQsVUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsSUFDZixjQUFjLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxNQUFTLEVBQUUsWUFBWTtBQUFBLElBQzNELFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE9BQVcsRUFBRSxZQUFZO0FBQUEsSUFDMUQsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksTUFBVSxFQUFFLFlBQVk7QUFBQSxJQUN6RCxVQUFVO0FBQUEsRUFDWjtBQUNGOzs7QUN4R0EsSUFBSSxjQUFjLENBQUMsR0FBRyxlQUFlO0FBS3JDLGVBQWUsZ0JBQStCO0FBQzVDLFFBQU1BLFNBQVEsT0FBTyxXQUFXLFVBQVUsV0FBVyxXQUFXLFFBQVE7QUFDeEUsU0FBTyxJQUFJLFFBQVEsYUFBVyxXQUFXLFNBQVNBLE1BQUssQ0FBQztBQUMxRDtBQUtPLFNBQVMsbUJBQXlCO0FBQ3ZDLGdCQUFjLENBQUMsR0FBRyxlQUFlO0FBQ25DO0FBT0EsZUFBc0IsZUFBZSxRQWNsQztBQUVELFFBQU0sY0FBYztBQUVwQixRQUFNLFFBQU8saUNBQVEsU0FBUTtBQUM3QixRQUFNLFFBQU8saUNBQVEsU0FBUTtBQUc3QixNQUFJLGdCQUFnQixDQUFDLEdBQUcsV0FBVztBQUduQyxNQUFJLGlDQUFRLE1BQU07QUFDaEIsVUFBTSxVQUFVLE9BQU8sS0FBSyxZQUFZO0FBQ3hDLG9CQUFnQixjQUFjO0FBQUEsTUFBTyxRQUNuQyxHQUFHLEtBQUssWUFBWSxFQUFFLFNBQVMsT0FBTyxLQUNyQyxHQUFHLGVBQWUsR0FBRyxZQUFZLFlBQVksRUFBRSxTQUFTLE9BQU87QUFBQSxJQUNsRTtBQUFBLEVBQ0Y7QUFHQSxNQUFJLGlDQUFRLE1BQU07QUFDaEIsb0JBQWdCLGNBQWMsT0FBTyxRQUFNLEdBQUcsU0FBUyxPQUFPLElBQUk7QUFBQSxFQUNwRTtBQUdBLE1BQUksaUNBQVEsUUFBUTtBQUNsQixvQkFBZ0IsY0FBYyxPQUFPLFFBQU0sR0FBRyxXQUFXLE9BQU8sTUFBTTtBQUFBLEVBQ3hFO0FBR0EsUUFBTSxTQUFTLE9BQU8sS0FBSztBQUMzQixRQUFNLE1BQU0sS0FBSyxJQUFJLFFBQVEsTUFBTSxjQUFjLE1BQU07QUFDdkQsUUFBTSxpQkFBaUIsY0FBYyxNQUFNLE9BQU8sR0FBRztBQUdyRCxTQUFPO0FBQUEsSUFDTCxPQUFPO0FBQUEsSUFDUCxZQUFZO0FBQUEsTUFDVixPQUFPLGNBQWM7QUFBQSxNQUNyQjtBQUFBLE1BQ0E7QUFBQSxNQUNBLFlBQVksS0FBSyxLQUFLLGNBQWMsU0FBUyxJQUFJO0FBQUEsSUFDbkQ7QUFBQSxFQUNGO0FBQ0Y7QUFPQSxlQUFzQixjQUFjLElBQWlDO0FBRW5FLFFBQU0sY0FBYztBQUdwQixRQUFNLGFBQWEsWUFBWSxLQUFLLFFBQU0sR0FBRyxPQUFPLEVBQUU7QUFFdEQsTUFBSSxDQUFDLFlBQVk7QUFDZixVQUFNLElBQUksTUFBTSw2QkFBUyxFQUFFLDBCQUFNO0FBQUEsRUFDbkM7QUFFQSxTQUFPO0FBQ1Q7QUFPQSxlQUFzQixpQkFBaUIsTUFBZ0Q7QUFFckYsUUFBTSxjQUFjO0FBR3BCLFFBQU0sUUFBUSxNQUFNLEtBQUssSUFBSSxDQUFDO0FBRzlCLFFBQU0sZ0JBQTRCO0FBQUEsSUFDaEMsSUFBSTtBQUFBLElBQ0osTUFBTSxLQUFLLFFBQVE7QUFBQSxJQUNuQixhQUFhLEtBQUssZUFBZTtBQUFBLElBQ2pDLE1BQU0sS0FBSyxRQUFRO0FBQUEsSUFDbkIsTUFBTSxLQUFLO0FBQUEsSUFDWCxNQUFNLEtBQUs7QUFBQSxJQUNYLGNBQWMsS0FBSztBQUFBLElBQ25CLFVBQVUsS0FBSztBQUFBLElBQ2YsUUFBUSxLQUFLLFVBQVU7QUFBQSxJQUN2QixlQUFlLEtBQUssaUJBQWlCO0FBQUEsSUFDckMsY0FBYztBQUFBLElBQ2QsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ2xDLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxJQUNsQyxVQUFVO0FBQUEsRUFDWjtBQUdBLGNBQVksS0FBSyxhQUFhO0FBRTlCLFNBQU87QUFDVDtBQVFBLGVBQXNCLGlCQUFpQixJQUFZLE1BQWdEO0FBRWpHLFFBQU0sY0FBYztBQUdwQixRQUFNLFFBQVEsWUFBWSxVQUFVLFFBQU0sR0FBRyxPQUFPLEVBQUU7QUFFdEQsTUFBSSxVQUFVLElBQUk7QUFDaEIsVUFBTSxJQUFJLE1BQU0sNkJBQVMsRUFBRSwwQkFBTTtBQUFBLEVBQ25DO0FBR0EsUUFBTSxvQkFBZ0M7QUFBQSxJQUNwQyxHQUFHLFlBQVksS0FBSztBQUFBLElBQ3BCLEdBQUc7QUFBQSxJQUNILFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxFQUNwQztBQUdBLGNBQVksS0FBSyxJQUFJO0FBRXJCLFNBQU87QUFDVDtBQU1BLGVBQXNCLGlCQUFpQixJQUEyQjtBQUVoRSxRQUFNLGNBQWM7QUFHcEIsUUFBTSxRQUFRLFlBQVksVUFBVSxRQUFNLEdBQUcsT0FBTyxFQUFFO0FBRXRELE1BQUksVUFBVSxJQUFJO0FBQ2hCLFVBQU0sSUFBSSxNQUFNLDZCQUFTLEVBQUUsMEJBQU07QUFBQSxFQUNuQztBQUdBLGNBQVksT0FBTyxPQUFPLENBQUM7QUFDN0I7QUFPQSxlQUFzQixlQUFlLFFBSWxDO0FBRUQsUUFBTSxjQUFjO0FBSXBCLFFBQU0sVUFBVSxLQUFLLE9BQU8sSUFBSTtBQUVoQyxTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0EsU0FBUyxVQUFVLDZCQUFTO0FBQUEsSUFDNUIsU0FBUyxVQUFVO0FBQUEsTUFDakIsY0FBYyxLQUFLLE1BQU0sS0FBSyxPQUFPLElBQUksRUFBRSxJQUFJO0FBQUEsTUFDL0MsU0FBUztBQUFBLE1BQ1QsY0FBYyxLQUFLLE1BQU0sS0FBSyxPQUFPLElBQUksR0FBSyxJQUFJO0FBQUEsSUFDcEQsSUFBSTtBQUFBLE1BQ0YsV0FBVztBQUFBLE1BQ1gsY0FBYztBQUFBLElBQ2hCO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxxQkFBUTtBQUFBLEVBQ2I7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjs7O0FDaE9PLFNBQVMsbUJBQ2QsTUFDQSxVQUFtQixNQUNuQixTQUNBO0FBQ0EsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0EsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ2xDLGNBQWM7QUFBQTtBQUFBLEVBQ2hCO0FBQ0Y7QUFTTyxTQUFTLHdCQUNkLFNBQ0EsT0FBZSxjQUNmLFNBQWlCLEtBQ2pCO0FBQ0EsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLE1BQ0w7QUFBQSxNQUNBO0FBQUEsTUFDQSxZQUFZO0FBQUEsSUFDZDtBQUFBLElBQ0EsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ2xDLGNBQWM7QUFBQSxFQUNoQjtBQUNGO0FBVU8sU0FBUyx5QkFDZCxPQUNBLFlBQ0EsT0FBZSxHQUNmLE9BQWUsSUFDZjtBQUNBLFNBQU8sbUJBQW1CO0FBQUEsSUFDeEI7QUFBQSxJQUNBLFlBQVk7QUFBQSxNQUNWLE9BQU87QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0EsWUFBWSxLQUFLLEtBQUssYUFBYSxJQUFJO0FBQUEsTUFDdkMsU0FBUyxPQUFPLE9BQU87QUFBQSxJQUN6QjtBQUFBLEVBQ0YsQ0FBQztBQUNIO0FBT08sU0FBUyxNQUFNLEtBQWEsS0FBb0I7QUFDckQsU0FBTyxJQUFJLFFBQVEsYUFBVyxXQUFXLFNBQVMsRUFBRSxDQUFDO0FBQ3ZEOzs7QUNoRUEsSUFBTSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFJWixNQUFNLFdBQVcsUUFBeUM7QUFDeEQsVUFBTSxNQUFNO0FBQ1osV0FBTyx5QkFBeUI7QUFBQSxNQUM5QixPQUFPO0FBQUEsUUFDTCxFQUFFLElBQUksTUFBTSxNQUFNLHdDQUFVLGFBQWEsc0VBQWUsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWSxFQUFFO0FBQUEsUUFDNUYsRUFBRSxJQUFJLE1BQU0sTUFBTSx3Q0FBVSxhQUFhLDhDQUFXLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVksRUFBRTtBQUFBLFFBQ3hGLEVBQUUsSUFBSSxNQUFNLE1BQU0sNEJBQVEsYUFBYSx3Q0FBVSxZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZLEVBQUU7QUFBQSxNQUN2RjtBQUFBLE1BQ0EsT0FBTztBQUFBLE1BQ1AsTUFBTSxPQUFPO0FBQUEsTUFDYixNQUFNLE9BQU87QUFBQSxJQUNmLENBQUM7QUFBQSxFQUNIO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLFNBQVMsSUFBWTtBQUN6QixVQUFNLE1BQU07QUFDWixXQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0EsTUFBTTtBQUFBLE1BQ04sYUFBYTtBQUFBLE1BQ2IsS0FBSztBQUFBLE1BQ0wsWUFBWSxDQUFDLFFBQVE7QUFBQSxNQUNyQixZQUFXLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsTUFDbEMsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxZQUFZLE1BQVc7QUFDM0IsVUFBTSxNQUFNO0FBQ1osV0FBTztBQUFBLE1BQ0wsSUFBSSxTQUFTLEtBQUssSUFBSSxDQUFDO0FBQUEsTUFDdkIsR0FBRztBQUFBLE1BQ0gsWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLE1BQ2xDLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sWUFBWSxJQUFZLE1BQVc7QUFDdkMsVUFBTSxNQUFNO0FBQ1osV0FBTztBQUFBLE1BQ0w7QUFBQSxNQUNBLEdBQUc7QUFBQSxNQUNILFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sWUFBWSxJQUFZO0FBQzVCLFVBQU0sTUFBTTtBQUNaLFdBQU8sRUFBRSxTQUFTLEtBQUs7QUFBQSxFQUN6QjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxhQUFhLElBQVksUUFBYTtBQUMxQyxVQUFNLE1BQU07QUFDWixXQUFPO0FBQUEsTUFDTCxTQUFTLENBQUMsTUFBTSxRQUFRLFNBQVMsUUFBUTtBQUFBLE1BQ3pDLE1BQU07QUFBQSxRQUNKLEVBQUUsSUFBSSxHQUFHLE1BQU0sZ0JBQU0sT0FBTyxxQkFBcUIsUUFBUSxTQUFTO0FBQUEsUUFDbEUsRUFBRSxJQUFJLEdBQUcsTUFBTSxnQkFBTSxPQUFPLGtCQUFrQixRQUFRLFNBQVM7QUFBQSxRQUMvRCxFQUFFLElBQUksR0FBRyxNQUFNLGdCQUFNLE9BQU8sb0JBQW9CLFFBQVEsV0FBVztBQUFBLE1BQ3JFO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDUixlQUFlO0FBQUEsUUFDZixVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFLQSxJQUFNLFdBQVc7QUFBQSxFQUNmO0FBQUEsRUFDQTtBQUNGO0FBV08sSUFBTSxvQkFBb0IsU0FBUztBQUNuQyxJQUFNLGVBQWUsU0FBUztBQUdyQyxJQUFPLG1CQUFROzs7QUN6RWYsSUFBTSxtQkFBbUIsT0FBTyxRQUErQztBQUM3RSxTQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDOUIsVUFBTSxTQUFtQixDQUFDO0FBRTFCLFFBQUksR0FBRyxRQUFRLENBQUMsVUFBa0IsT0FBTyxLQUFLLEtBQUssQ0FBQztBQUVwRCxRQUFJLEdBQUcsT0FBTyxNQUFNO0FBQ2xCLFVBQUksT0FBTyxXQUFXO0FBQUcsZUFBTyxRQUFRLENBQUMsQ0FBQztBQUUxQyxVQUFJO0FBQ0YsY0FBTSxVQUFVLE9BQU8sT0FBTyxNQUFNLEVBQUUsU0FBUztBQUMvQyxjQUFNLE9BQU8sV0FBVyxRQUFRLEtBQUssSUFBSSxLQUFLLE1BQU0sT0FBTyxJQUFJLENBQUM7QUFDaEUsZ0JBQVEsU0FBUywrQ0FBWSxJQUFJO0FBQ2pDLGdCQUFRLElBQUk7QUFBQSxNQUNkLFNBQVMsT0FBTztBQUNkLGdCQUFRLFFBQVEsK0NBQVksS0FBSztBQUNqQyxnQkFBUSxDQUFDLENBQUM7QUFBQSxNQUNaO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxDQUFDO0FBQ0g7QUFLQSxJQUFNLFdBQVcsQ0FBQyxLQUEwQixZQUFvQixTQUFvQjtBQUNsRixNQUFJLGFBQWE7QUFDakIsTUFBSSxVQUFVLGdCQUFnQixrQkFBa0I7QUFDaEQsTUFBSSxVQUFVLCtCQUErQixHQUFHO0FBQ2hELE1BQUksVUFBVSxnQ0FBZ0MsaUNBQWlDO0FBQy9FLE1BQUksVUFBVSxnQ0FBZ0MsK0NBQStDO0FBQzdGLE1BQUksSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUFDO0FBQzVCLFVBQVEsU0FBUyxnREFBYSxVQUFVLElBQUksT0FBTyxTQUFTLFdBQVcsS0FBSyxVQUFVLElBQUksRUFBRSxVQUFVLEdBQUcsR0FBRyxJQUFJLFFBQVEsSUFBSTtBQUM5SDtBQUtBLElBQU0sY0FBYyxDQUFDLEtBQTBCLE9BQVksYUFBYSxRQUFjO0FBQ3BGLFVBQVEsU0FBUyx5Q0FBVyxLQUFLO0FBRWpDLFFBQU0sZ0JBQWdCO0FBQUEsSUFDcEIsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSztBQUFBLElBQ3JELE1BQU0sUUFBUTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBRUEsV0FBUyxLQUFLLFlBQVksYUFBYTtBQUN6QztBQUtBLElBQU0sV0FBVyxZQUEyQjtBQUMxQyxRQUFNLEVBQUUsT0FBQUMsT0FBTSxJQUFJO0FBRWxCLE1BQUksT0FBT0EsV0FBVSxZQUFZQSxTQUFRLEdBQUc7QUFDMUMsVUFBTSxVQUFVQTtBQUNoQixZQUFRLFNBQVMseUNBQVcsT0FBTyxJQUFJO0FBQ3ZDLFVBQU0sSUFBSSxRQUFRLGFBQVcsV0FBVyxTQUFTLE9BQU8sQ0FBQztBQUFBLEVBQzNELFdBQVdBLFVBQVMsT0FBT0EsV0FBVSxVQUFVO0FBQzdDLFVBQU0sRUFBRSxLQUFLLElBQUksSUFBSUE7QUFDckIsVUFBTSxjQUFjLEtBQUssTUFBTSxLQUFLLE9BQU8sS0FBSyxNQUFNLE1BQU0sRUFBRSxJQUFJO0FBQ2xFLFlBQVEsU0FBUyx5Q0FBVyxXQUFXLHFCQUFXLEdBQUcsSUFBSSxHQUFHLEtBQUs7QUFDakUsVUFBTSxJQUFJLFFBQVEsYUFBVyxXQUFXLFNBQVMsV0FBVyxDQUFDO0FBQUEsRUFDL0Q7QUFDRjtBQUtBLElBQU0sdUJBQXVCLENBQUMsUUFBbUM7QUFDL0QsTUFBSSxhQUFhO0FBQ2pCLE1BQUksVUFBVSwrQkFBK0IsR0FBRztBQUNoRCxNQUFJLFVBQVUsZ0NBQWdDLGlDQUFpQztBQUMvRSxNQUFJLFVBQVUsZ0NBQWdDLCtDQUErQztBQUM3RixNQUFJLFVBQVUsMEJBQTBCLE9BQU87QUFDL0MsTUFBSSxJQUFJO0FBQ1IsVUFBUSxTQUFTLDZDQUFlO0FBQ2xDO0FBS0EsSUFBTSxnQkFBZ0IsT0FDcEIsS0FDQSxRQUM0QjtBQUU1QixRQUFNLE1BQU0sSUFBSSxPQUFPO0FBQ3ZCLFFBQU0sZ0JBQWdCLElBQUksUUFBUSxnQkFBZ0IsT0FBTztBQUd6RCxRQUFNLFNBQVMsSUFBSSxJQUFJLG1CQUFtQixhQUFhLEVBQUU7QUFDekQsUUFBTUMsUUFBTyxPQUFPO0FBR3BCLFFBQU0sWUFBWUEsTUFBSyxXQUFXLE1BQU0sSUFBSSxTQUFTO0FBR3JELFFBQU0sY0FBc0MsQ0FBQztBQUM3QyxTQUFPLGFBQWEsUUFBUSxDQUFDLE9BQU8sUUFBUTtBQUMxQyxnQkFBWSxHQUFHLElBQUk7QUFBQSxFQUNyQixDQUFDO0FBR0QsUUFBTSxPQUFPLFNBQVMsWUFBWSxRQUFRLEtBQUssRUFBRTtBQUNqRCxRQUFNLE9BQU8sU0FBUyxZQUFZLFFBQVEsTUFBTSxFQUFFO0FBR2xELFFBQU0sT0FBTyxNQUFNLGlCQUFpQixHQUFHO0FBRXZDLFFBQU0sVUFBVTtBQUFBLElBQ2Q7QUFBQSxJQUNBO0FBQUEsSUFDQSxNQUFBQTtBQUFBLElBQ0EsUUFBUSxJQUFJLFVBQVU7QUFBQSxJQUN0QjtBQUFBLElBQ0E7QUFBQSxJQUNBLFlBQVk7QUFBQSxNQUNWLEtBQUs7QUFBQSxNQUNMLE1BQUFBO0FBQUEsTUFDQSxRQUFRO0FBQUEsSUFDVjtBQUFBLElBQ0EsWUFBWTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxVQUFRLFNBQVMsMkRBQWM7QUFBQSxJQUM3QixLQUFLO0FBQUEsSUFDTCxNQUFBQTtBQUFBLElBQ0EsUUFBUSxRQUFRO0FBQUEsSUFDaEIsYUFBYSxPQUFPLEtBQUssV0FBVyxFQUFFLFNBQVMsSUFBSSxjQUFjO0FBQUEsSUFDakUsVUFBVSxPQUFPLFNBQVMsV0FBVyxPQUFPLEtBQUssSUFBSSxFQUFFLFNBQVM7QUFBQSxFQUNsRSxDQUFDO0FBRUQsU0FBTztBQUNUO0FBVUEsSUFBTSx5QkFBdUMsT0FBTyxZQUFZO0FBQzlELFFBQU0sRUFBRSxNQUFBQSxPQUFNLFFBQVEsTUFBTSxZQUFZLElBQUksSUFBSTtBQUVoRCxNQUFJO0FBRUYsVUFBTSxjQUFjQSxNQUFLLE1BQU0sK0JBQStCO0FBQzlELFFBQUksZUFBZSxXQUFXLE9BQU87QUFDbkMsWUFBTSxLQUFLLFlBQVksQ0FBQztBQUN4QixjQUFRLFFBQVEsbUNBQVUsRUFBRSxFQUFFO0FBRTlCLFlBQU0sV0FBVyxNQUFNLGlCQUFTLFdBQVcsY0FBYyxFQUFFO0FBQzNELFlBQU0sU0FBUztBQUNmLGVBQVMsS0FBSyxLQUFLLG1CQUFtQixRQUFRLENBQUM7QUFDL0MsYUFBTztBQUFBLElBQ1Q7QUFHQSxRQUFJQSxNQUFLLE1BQU0sd0JBQXdCLEtBQUssV0FBVyxPQUFPO0FBQzVELGNBQVEsUUFBUSw4Q0FBVyxVQUFVO0FBRXJDLFlBQU0sU0FBUztBQUFBLFFBQ2IsTUFBTSxXQUFXO0FBQUEsUUFDakIsTUFBTSxXQUFXO0FBQUEsUUFDakIsTUFBTSxRQUFRLFlBQVk7QUFBQSxRQUMxQixNQUFNLFFBQVEsWUFBWTtBQUFBLFFBQzFCLFFBQVEsUUFBUSxZQUFZO0FBQUEsTUFDOUI7QUFFQSxZQUFNLFdBQVcsTUFBTSxpQkFBUyxXQUFXLGVBQWUsTUFBTTtBQUNoRSxZQUFNLFNBQVM7QUFDZixlQUFTLEtBQUssS0FBSyxtQkFBbUIsUUFBUSxDQUFDO0FBQy9DLGFBQU87QUFBQSxJQUNUO0FBR0EsUUFBSUEsTUFBSyxNQUFNLHdCQUF3QixLQUFLLFdBQVcsUUFBUTtBQUM3RCxjQUFRLFFBQVEsa0NBQVMsSUFBSTtBQUU3QixZQUFNLFdBQVcsTUFBTSxpQkFBUyxXQUFXLGlCQUFpQixJQUFJO0FBQ2hFLFlBQU0sU0FBUztBQUNmLGVBQVMsS0FBSyxLQUFLLG1CQUFtQixRQUFRLENBQUM7QUFDL0MsYUFBTztBQUFBLElBQ1Q7QUFHQSxVQUFNLGNBQWNBLE1BQUssTUFBTSwrQkFBK0I7QUFDOUQsUUFBSSxlQUFlLFdBQVcsT0FBTztBQUNuQyxZQUFNLEtBQUssWUFBWSxDQUFDO0FBQ3hCLGNBQVEsUUFBUSxtQ0FBVSxFQUFFLElBQUksSUFBSTtBQUVwQyxZQUFNLFdBQVcsTUFBTSxpQkFBUyxXQUFXLGlCQUFpQixJQUFJLElBQUk7QUFDcEUsWUFBTSxTQUFTO0FBQ2YsZUFBUyxLQUFLLEtBQUssbUJBQW1CLFFBQVEsQ0FBQztBQUMvQyxhQUFPO0FBQUEsSUFDVDtBQUdBLFVBQU0sY0FBY0EsTUFBSyxNQUFNLCtCQUErQjtBQUM5RCxRQUFJLGVBQWUsV0FBVyxVQUFVO0FBQ3RDLFlBQU0sS0FBSyxZQUFZLENBQUM7QUFDeEIsY0FBUSxRQUFRLG1DQUFVLEVBQUUsRUFBRTtBQUU5QixZQUFNLGlCQUFTLFdBQVcsaUJBQWlCLEVBQUU7QUFDN0MsWUFBTSxTQUFTO0FBQ2YsZUFBUyxLQUFLLEtBQUssbUJBQW1CLEVBQUUsSUFBSSxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQzVELGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixTQUFTLE9BQU87QUFDZCxnQkFBWSxLQUFLLEtBQUs7QUFDdEIsV0FBTztBQUFBLEVBQ1Q7QUFFQSxTQUFPO0FBQ1Q7QUFLQSxJQUFNLG9CQUFrQyxPQUFPLFlBQVk7QUFDekQsUUFBTSxFQUFFLE1BQUFBLE9BQU0sUUFBUSxNQUFNLFlBQVksSUFBSSxJQUFJO0FBRWhELE1BQUk7QUFFRixVQUFNLGNBQWNBLE1BQUssTUFBTSwyQkFBMkI7QUFDMUQsUUFBSSxlQUFlLFdBQVcsT0FBTztBQUNuQyxZQUFNLEtBQUssWUFBWSxDQUFDO0FBQ3hCLGNBQVEsUUFBUSw2QkFBUyxFQUFFLEVBQUU7QUFFN0IsWUFBTSxXQUFXLE1BQU0saUJBQVMsTUFBTSxTQUFTLEVBQUU7QUFDakQsWUFBTSxTQUFTO0FBQ2YsZUFBUyxLQUFLLEtBQUssbUJBQW1CLFFBQVEsQ0FBQztBQUMvQyxhQUFPO0FBQUEsSUFDVDtBQUdBLFFBQUlBLE1BQUssTUFBTSxvQkFBb0IsS0FBSyxXQUFXLE9BQU87QUFDeEQsY0FBUSxRQUFRLHdDQUFVLFVBQVU7QUFFcEMsWUFBTSxTQUFTO0FBQUEsUUFDYixNQUFNLFdBQVc7QUFBQSxRQUNqQixNQUFNLFdBQVc7QUFBQSxNQUNuQjtBQUVBLFlBQU0sV0FBVyxNQUFNLGlCQUFTLE1BQU0sV0FBVyxNQUFNO0FBQ3ZELFlBQU0sU0FBUztBQUNmLGVBQVMsS0FBSyxLQUFLLG1CQUFtQixRQUFRLENBQUM7QUFDL0MsYUFBTztBQUFBLElBQ1Q7QUFHQSxRQUFJQSxNQUFLLE1BQU0sb0JBQW9CLEtBQUssV0FBVyxRQUFRO0FBQ3pELGNBQVEsUUFBUSw0QkFBUSxJQUFJO0FBRTVCLFlBQU0sV0FBVyxNQUFNLGlCQUFTLE1BQU0sWUFBWSxJQUFJO0FBQ3RELFlBQU0sU0FBUztBQUNmLGVBQVMsS0FBSyxLQUFLLG1CQUFtQixRQUFRLENBQUM7QUFDL0MsYUFBTztBQUFBLElBQ1Q7QUFHQSxVQUFNLGNBQWNBLE1BQUssTUFBTSwyQkFBMkI7QUFDMUQsUUFBSSxlQUFlLFdBQVcsT0FBTztBQUNuQyxZQUFNLEtBQUssWUFBWSxDQUFDO0FBQ3hCLGNBQVEsUUFBUSw2QkFBUyxFQUFFLElBQUksSUFBSTtBQUVuQyxZQUFNLFdBQVcsTUFBTSxpQkFBUyxNQUFNLFlBQVksSUFBSSxJQUFJO0FBQzFELFlBQU0sU0FBUztBQUNmLGVBQVMsS0FBSyxLQUFLLG1CQUFtQixRQUFRLENBQUM7QUFDL0MsYUFBTztBQUFBLElBQ1Q7QUFHQSxVQUFNLGNBQWNBLE1BQUssTUFBTSwyQkFBMkI7QUFDMUQsUUFBSSxlQUFlLFdBQVcsVUFBVTtBQUN0QyxZQUFNLEtBQUssWUFBWSxDQUFDO0FBQ3hCLGNBQVEsUUFBUSw2QkFBUyxFQUFFLEVBQUU7QUFFN0IsWUFBTSxpQkFBUyxNQUFNLFlBQVksRUFBRTtBQUNuQyxZQUFNLFNBQVM7QUFDZixlQUFTLEtBQUssS0FBSyxtQkFBbUIsRUFBRSxJQUFJLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDNUQsYUFBTztBQUFBLElBQ1Q7QUFHQSxVQUFNLGVBQWVBLE1BQUssTUFBTSxvQ0FBb0M7QUFDcEUsUUFBSSxnQkFBZ0IsV0FBVyxRQUFRO0FBQ3JDLFlBQU0sS0FBSyxhQUFhLENBQUM7QUFDekIsY0FBUSxRQUFRLDZCQUFTLEVBQUUsSUFBSSxJQUFJO0FBRW5DLFlBQU0sV0FBVyxNQUFNLGlCQUFTLE1BQU0sYUFBYSxJQUFJLElBQUk7QUFDM0QsWUFBTSxTQUFTO0FBQ2YsZUFBUyxLQUFLLEtBQUssbUJBQW1CLFFBQVEsQ0FBQztBQUMvQyxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsU0FBUyxPQUFPO0FBQ2QsZ0JBQVksS0FBSyxLQUFLO0FBQ3RCLFdBQU87QUFBQSxFQUNUO0FBRUEsU0FBTztBQUNUO0FBS0EsSUFBTSxzQkFBb0MsT0FBTyxZQUFZO0FBQzNELFFBQU0sRUFBRSxNQUFBQSxPQUFNLFFBQVEsSUFBSSxJQUFJO0FBRTlCLE1BQUk7QUFDRixZQUFRLFFBQVEsNENBQWMsTUFBTSxJQUFJQSxLQUFJLEVBQUU7QUFHOUMsUUFBSUEsTUFBSyxXQUFXLE9BQU8sR0FBRztBQUM1QixZQUFNLFNBQVM7QUFFZixVQUFJLFdBQVcsT0FBTztBQUVwQixjQUFNLGlCQUFpQkEsTUFBSyxNQUFNLDJCQUEyQjtBQUM3RCxjQUFNLGVBQWUsaUJBQ2pCLEVBQUUsT0FBTyxDQUFDLEdBQUcsT0FBTyxHQUFHLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFDekMsRUFBRSxJQUFJLFNBQVMsTUFBTSxlQUFlO0FBRXhDLGlCQUFTLEtBQUssS0FBSyxtQkFBbUIsWUFBWSxDQUFDO0FBQ25ELGVBQU87QUFBQSxNQUNULFdBQVcsV0FBVyxRQUFRO0FBRTVCLGlCQUFTLEtBQUssS0FBSyxtQkFBbUIsRUFBRSxJQUFJLFNBQVMsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUNyRSxlQUFPO0FBQUEsTUFDVCxXQUFXLFdBQVcsT0FBTztBQUUzQixpQkFBUyxLQUFLLEtBQUssbUJBQW1CLEVBQUUsSUFBSSxTQUFTLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDckUsZUFBTztBQUFBLE1BQ1QsV0FBVyxXQUFXLFVBQVU7QUFFOUIsaUJBQVMsS0FBSyxLQUFLLG1CQUFtQixFQUFFLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDeEQsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBQUEsRUFDRixTQUFTLE9BQU87QUFDZCxnQkFBWSxLQUFLLEtBQUs7QUFDdEIsV0FBTztBQUFBLEVBQ1Q7QUFFQSxTQUFPO0FBQ1Q7QUFPZSxTQUFSLHVCQUFvRTtBQUN6RSxTQUFPLGVBQWUsZUFDcEIsS0FDQSxLQUNBLE1BQ0E7QUFFQSxRQUFJLENBQUMsY0FBYyxHQUFHO0FBQ3BCLGNBQVEsU0FBUyxvRUFBa0IsSUFBSSxHQUFHO0FBQzFDLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFHQSxVQUFNLE1BQU0sSUFBSSxPQUFPO0FBQ3ZCLFFBQUksQ0FBQyxJQUFJLFdBQVcsT0FBTyxHQUFHO0FBQzVCLGNBQVEsU0FBUyx1REFBZSxHQUFHO0FBQ25DLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFFQSxZQUFRLFFBQVEsNkJBQVMsSUFBSSxNQUFNLElBQUksR0FBRyxFQUFFO0FBRTVDLFFBQUk7QUFFRixVQUFJLElBQUksV0FBVyxhQUFhLElBQUksV0FBVyxPQUFPLEdBQUc7QUFDdkQsNkJBQXFCLEdBQUc7QUFDeEI7QUFBQSxNQUNGO0FBR0EsWUFBTSxVQUFVLE1BQU0sY0FBYyxLQUFLLEdBQUc7QUFHNUMsWUFBTSxTQUFTO0FBRWYsWUFBTSxXQUEyQjtBQUFBLFFBQy9CO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBR0EsaUJBQVcsV0FBVyxVQUFVO0FBQzlCLGNBQU0sVUFBVSxNQUFNLFFBQVEsT0FBTztBQUNyQyxZQUFJO0FBQVM7QUFBQSxNQUNmO0FBR0EsY0FBUSxRQUFRLDhHQUF5QixJQUFJLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDNUQsV0FBSztBQUFBLElBQ1AsU0FBUyxPQUFPO0FBQ2QsY0FBUSxTQUFTLCtDQUFZLEtBQUs7QUFDbEMsa0JBQVksS0FBSyxLQUFLO0FBQUEsSUFDeEI7QUFBQSxFQUNGO0FBQ0Y7OztBTnRkQSxJQUFNLG1DQUFtQztBQVN6QyxTQUFTLFNBQVMsTUFBYztBQUM5QixVQUFRLElBQUksbUNBQWUsSUFBSSwyQkFBTztBQUN0QyxNQUFJO0FBQ0YsUUFBSSxRQUFRLGFBQWEsU0FBUztBQUNoQyxlQUFTLDJCQUEyQixJQUFJLEVBQUU7QUFDMUMsZUFBUyw4Q0FBOEMsSUFBSSx3QkFBd0IsRUFBRSxPQUFPLFVBQVUsQ0FBQztBQUFBLElBQ3pHLE9BQU87QUFDTCxlQUFTLFlBQVksSUFBSSx1QkFBdUIsRUFBRSxPQUFPLFVBQVUsQ0FBQztBQUFBLElBQ3RFO0FBQ0EsWUFBUSxJQUFJLHlDQUFnQixJQUFJLEVBQUU7QUFBQSxFQUNwQyxTQUFTLEdBQUc7QUFDVixZQUFRLElBQUksdUJBQWEsSUFBSSx5REFBWTtBQUFBLEVBQzNDO0FBQ0Y7QUFHQSxTQUFTLElBQUk7QUFHYixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFHM0MsUUFBTSxhQUFhLElBQUksc0JBQXNCO0FBRzdDLFFBQU0sYUFBYSxJQUFJLHFCQUFxQjtBQUU1QyxVQUFRLElBQUksZ0RBQWtCLElBQUksRUFBRTtBQUNwQyxVQUFRLElBQUksZ0NBQXNCLGFBQWEsaUJBQU8sY0FBSSxFQUFFO0FBQzVELFVBQVEsSUFBSSwyQkFBaUIsYUFBYSxpQkFBTyxjQUFJLEVBQUU7QUFFdkQsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLElBQ047QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BRU4sS0FBSyxhQUFhLFFBQVE7QUFBQTtBQUFBLE1BRTFCLE9BQU87QUFBQTtBQUFBLFFBRUwsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLGdCQUFnQjtBQUFBO0FBQUEsTUFFaEIsaUJBQWlCLGFBQ2IsQ0FBQyxXQUFXO0FBQ1YsZ0JBQVEsSUFBSSx1REFBb0I7QUFDaEMsZUFBTyxZQUFZLElBQUkscUJBQXFCLENBQUM7QUFBQSxNQUMvQyxJQUNBO0FBQUEsTUFDSixTQUFTO0FBQUEsUUFDUCxpQkFBaUI7QUFBQSxNQUNuQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxRQUNQLFNBQVMsQ0FBQyxhQUFhLFlBQVk7QUFBQSxNQUNyQztBQUFBLE1BQ0EscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osbUJBQW1CO0FBQUEsUUFDckI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDLFVBQVU7QUFBQSxJQUN0QjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsYUFBYTtBQUFBLE1BQ2IsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBO0FBQUEsTUFFWCxRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxlQUFlO0FBQUEsUUFDakI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsVUFBVTtBQUFBLEVBQ1o7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJkZWxheSIsICJkZWxheSIsICJwYXRoIl0KfQo=
