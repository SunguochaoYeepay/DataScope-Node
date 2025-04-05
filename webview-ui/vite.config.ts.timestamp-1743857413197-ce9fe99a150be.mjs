var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

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
function shouldMockRequest(req) {
  if (!mockConfig.enabled) {
    return false;
  }
  const url = (req == null ? void 0 : req.url) || "";
  if (typeof url !== "string") {
    console.error("[Mock] \u6536\u5230\u975E\u5B57\u7B26\u4E32URL:", url);
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
var mockConfig;
var init_config = __esm({
  "src/mock/config.ts"() {
    mockConfig = {
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
  }
});

// src/mock/data/datasource.ts
var mockDataSources;
var init_datasource = __esm({
  "src/mock/data/datasource.ts"() {
    mockDataSources = [
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
  }
});

// src/mock/services/datasource.ts
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
var dataSources, datasource_default;
var init_datasource2 = __esm({
  "src/mock/services/datasource.ts"() {
    init_datasource();
    init_config();
    dataSources = [...mockDataSources];
    datasource_default = {
      getDataSources,
      getDataSource,
      createDataSource,
      updateDataSource,
      deleteDataSource,
      testConnection,
      resetDataSources
    };
  }
});

// src/mock/services/utils.ts
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var init_utils = __esm({
  "src/mock/services/utils.ts"() {
  }
});

// src/mock/data/query.ts
var query_exports = {};
__export(query_exports, {
  default: () => query_default,
  mockQueries: () => mockQueries
});
var mockQueries, query_default;
var init_query = __esm({
  "src/mock/data/query.ts"() {
    mockQueries = Array.from({ length: 10 }, (_, i) => {
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
    query_default = mockQueries;
  }
});

// src/mock/services/query.ts
async function simulateDelay2() {
  const delayTime = typeof mockConfig.delay === "number" ? mockConfig.delay : 300;
  return delay(delayTime);
}
var queryService, query_default2;
var init_query2 = __esm({
  "src/mock/services/query.ts"() {
    init_utils();
    init_config();
    init_query();
    queryService = {
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
    query_default2 = queryService;
  }
});

// src/mock/data/integration.ts
var mockIntegrations;
var init_integration = __esm({
  "src/mock/data/integration.ts"() {
    mockIntegrations = [
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
  }
});

// src/mock/services/integration.ts
async function simulateDelay3() {
  const delayTime = typeof mockConfig.delay === "number" ? mockConfig.delay : 300;
  return delay(delayTime);
}
var integrationService, getMockIntegrations, getMockIntegration, createMockIntegration, updateMockIntegration, deleteMockIntegration, executeMockQuery, integration_default;
var init_integration2 = __esm({
  "src/mock/services/integration.ts"() {
    init_utils();
    init_config();
    init_integration();
    integrationService = {
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
      },
      // 兼容旧的接口, 直接调用新的实现
      async getMockIntegrations() {
        const result = await integrationService.getIntegrations({});
        return result.items;
      },
      async getMockIntegration(id) {
        try {
          const integration = await integrationService.getIntegration(id);
          return integration;
        } catch (error) {
          console.error("\u83B7\u53D6\u96C6\u6210\u5931\u8D25:", error);
          return null;
        }
      },
      async createMockIntegration(data) {
        return integrationService.createIntegration(data);
      },
      async updateMockIntegration(id, updates) {
        return integrationService.updateIntegration(id, updates);
      },
      async deleteMockIntegration(id) {
        try {
          return await integrationService.deleteIntegration(id);
        } catch (error) {
          console.error("\u5220\u9664\u96C6\u6210\u5931\u8D25:", error);
          return false;
        }
      },
      async executeMockQuery(integrationId, query) {
        try {
          const result = await integrationService.executeQuery(integrationId, query);
          return {
            success: true,
            data: result.jsonResponse.data
          };
        } catch (error) {
          console.error("\u6267\u884C\u67E5\u8BE2\u5931\u8D25:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
          };
        }
      }
    };
    getMockIntegrations = integrationService.getMockIntegrations;
    getMockIntegration = integrationService.getMockIntegration;
    createMockIntegration = integrationService.createMockIntegration;
    updateMockIntegration = integrationService.updateMockIntegration;
    deleteMockIntegration = integrationService.deleteMockIntegration;
    executeMockQuery = integrationService.executeMockQuery;
    integration_default = integrationService;
  }
});

// src/mock/services/index.ts
var services, dataSourceService, queryService2, integrationService2;
var init_services = __esm({
  "src/mock/services/index.ts"() {
    init_datasource2();
    init_query2();
    init_integration2();
    init_utils();
    services = {
      dataSource: datasource_default,
      query: query_default2,
      integration: integration_default
    };
    dataSourceService = services.dataSource;
    queryService2 = services.query;
    integrationService2 = services.integration;
  }
});

// src/mock/middleware/index.ts
var middleware_exports = {};
__export(middleware_exports, {
  createMockMiddleware: () => createMockMiddleware,
  default: () => middleware_default,
  handleRequest: () => handleRequest
});
import { parse } from "url";
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
      if (result.items.length === 0) {
        try {
          const mockQueryData = await Promise.resolve().then(() => (init_query(), query_exports));
          const mockQueries2 = mockQueryData.mockQueries || [];
          if (mockQueries2.length > 0) {
            console.log("[Mock] \u67E5\u8BE2\u5217\u8868\u4E3A\u7A7A\uFF0C\u4F7F\u7528\u6A21\u62DF\u6570\u636E:", mockQueries2.length);
            const page = parseInt(urlQuery.page) || 1;
            const size = parseInt(urlQuery.size) || 10;
            const start = (page - 1) * size;
            const end = Math.min(start + size, mockQueries2.length);
            const paginatedItems = mockQueries2.slice(start, end);
            const pagination = {
              total: mockQueries2.length,
              page,
              size,
              totalPages: Math.ceil(mockQueries2.length / size)
            };
            sendJsonResponse(res, 200, {
              data: paginatedItems,
              pagination,
              success: true
            });
            return true;
          }
        } catch (error) {
          console.error("[Mock] \u5BFC\u5165\u67E5\u8BE2\u6A21\u62DF\u6570\u636E\u5931\u8D25:", error);
        }
      }
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
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/execute$/) && method === "POST") {
    const id = urlPath.split("/")[3];
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
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions$/) && method === "POST") {
    const queryId = urlPath.split("/")[3];
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, \u67E5\u8BE2ID: ${queryId}`);
    try {
      const body = await parseRequestBody(req);
      const result = await queryService2.createQueryVersion(queryId, body);
      sendJsonResponse(res, 201, {
        data: result,
        success: true,
        message: "\u67E5\u8BE2\u7248\u672C\u521B\u5EFA\u6210\u529F"
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u521B\u5EFA\u67E5\u8BE2\u7248\u672C\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions$/) && method === "GET") {
    const queryId = urlPath.split("/")[3];
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, \u67E5\u8BE2ID: ${queryId}`);
    try {
      const versions = await queryService2.getQueryVersions(queryId);
      sendJsonResponse(res, 200, {
        data: versions,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u83B7\u53D6\u67E5\u8BE2\u7248\u672C\u5217\u8868\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/versions\/[^\/]+\/publish$/) && method === "POST") {
    const versionId = urlPath.split("/")[4];
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, \u7248\u672CID: ${versionId}`);
    try {
      const result = await queryService2.publishQueryVersion(versionId);
      sendJsonResponse(res, 200, {
        data: result,
        success: true,
        message: "\u67E5\u8BE2\u7248\u672C\u53D1\u5E03\u6210\u529F"
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u53D1\u5E03\u67E5\u8BE2\u7248\u672C\u5931\u8D25",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions\/[^\/]+\/activate$/) && method === "POST") {
    const urlParts = urlPath.split("/");
    const queryId = urlParts[3];
    const versionId = urlParts[5];
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, \u67E5\u8BE2ID: ${queryId}, \u7248\u672CID: ${versionId}`);
    try {
      const result = await queryService2.activateQueryVersion(queryId, versionId);
      sendJsonResponse(res, 200, {
        data: result,
        success: true,
        message: "\u67E5\u8BE2\u7248\u672C\u6FC0\u6D3B\u6210\u529F"
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: "\u6FC0\u6D3B\u67E5\u8BE2\u7248\u672C\u5931\u8D25",
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
  const isLowCodeApisPath = urlPath.includes("/api/low-code/apis");
  if (isLowCodeApisPath) {
    console.log("[Mock] \u68C0\u6D4B\u5230\u96C6\u6210API\u8BF7\u6C42:", method, urlPath, urlQuery);
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
        const responseData = result.items;
        sendJsonResponse(res, 200, responseData);
      } catch (error) {
        sendJsonResponse(res, 500, {
          error: "\u83B7\u53D6\u96C6\u6210\u5217\u8868\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    const singleIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)$/);
    if (singleIntegrationMatch && method === "GET") {
      const id = singleIntegrationMatch[1];
      logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
      try {
        const integration = await integration_default.getIntegration(id);
        sendJsonResponse(res, 200, integration);
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
        sendJsonResponse(res, 201, newIntegration);
      } catch (error) {
        sendJsonResponse(res, 400, {
          error: "\u521B\u5EFA\u96C6\u6210\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    const updateIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)$/);
    if (updateIntegrationMatch && method === "PUT") {
      const id = updateIntegrationMatch[1];
      logMock("debug", `\u5904\u7406PUT\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
      try {
        const body = await parseRequestBody(req);
        const updatedIntegration = await integration_default.updateIntegration(id, body);
        sendJsonResponse(res, 200, updatedIntegration);
      } catch (error) {
        sendJsonResponse(res, 404, {
          error: "\u66F4\u65B0\u96C6\u6210\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    const deleteIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)$/);
    if (deleteIntegrationMatch && method === "DELETE") {
      const id = deleteIntegrationMatch[1];
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
    const testIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)\/test$/);
    if (testIntegrationMatch && method === "POST") {
      const id = testIntegrationMatch[1];
      logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
      try {
        const body = await parseRequestBody(req);
        const result = await integration_default.testIntegration(id, body);
        sendJsonResponse(res, 200, result);
      } catch (error) {
        sendJsonResponse(res, 400, {
          error: "\u6D4B\u8BD5\u96C6\u6210\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    const executeQueryMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)\/execute$/);
    if (executeQueryMatch && method === "POST") {
      const id = executeQueryMatch[1];
      logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
      try {
        const body = await parseRequestBody(req);
        const result = await integration_default.executeQuery(id, body);
        sendJsonResponse(res, 200, result);
      } catch (error) {
        sendJsonResponse(res, 400, {
          error: "\u6267\u884C\u96C6\u6210\u67E5\u8BE2\u5931\u8D25",
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
  }
  return false;
}
async function handleRequest(req, res, urlPath, urlQuery) {
  try {
    const normalizedPath = normalizeApiPath(urlPath);
    if (urlPath !== normalizedPath) {
      console.log(`[Mock\u4E2D\u95F4\u4EF6] \u4FEE\u6B63API\u8DEF\u5F84: ${urlPath} => ${normalizedPath}`);
    }
    let handled = false;
    if (normalizedPath.includes("/low-code/apis")) {
      console.log("[Mock] \u68C0\u6D4B\u5230\u96C6\u6210API\u8BF7\u6C42:", req.method, normalizedPath, urlQuery);
      handled = await handleIntegrationApi(req, res, normalizedPath, urlQuery);
      if (handled)
        return;
    }
    if (normalizedPath.includes("/datasources")) {
      handled = await handleDatasourcesApi(req, res, normalizedPath, urlQuery);
      if (handled)
        return;
    }
    if (normalizedPath.includes("/queries")) {
      handled = await handleQueriesApi(req, res, normalizedPath, urlQuery);
      if (handled)
        return;
    }
    if (!handled) {
      sendJsonResponse(res, 404, {
        error: "\u672A\u627E\u5230\u8BF7\u6C42\u7684API",
        message: `\u672A\u627E\u5230\u8DEF\u5F84: ${normalizedPath}`,
        success: false
      });
    }
  } catch (error) {
    console.error("[Mock] \u5904\u7406\u8BF7\u6C42\u65F6\u51FA\u9519:", error);
    sendJsonResponse(res, 500, {
      error: "\u5904\u7406\u8BF7\u6C42\u65F6\u51FA\u9519",
      message: error instanceof Error ? error.message : String(error),
      success: false
    });
  }
}
function createMockMiddleware() {
  return async function mockMiddleware(req, res, next) {
    var _a;
    if (!shouldMockRequest(req)) {
      return next();
    }
    const url = parse(req.url || "", true);
    const urlPath = url.pathname || "";
    const urlQuery = url.query || {};
    logMock("debug", `\u6536\u5230\u8BF7\u6C42: ${req.method} ${urlPath}`);
    if (((_a = req.method) == null ? void 0 : _a.toUpperCase()) === "OPTIONS") {
      handleCors(res);
      res.statusCode = 204;
      res.end();
      return;
    }
    handleCors(res);
    if (mockConfig.delay > 0) {
      await delay2(mockConfig.delay);
    }
    try {
      await handleRequest(req, res, urlPath, urlQuery);
    } catch (error) {
      console.error("[Mock] \u5904\u7406\u8BF7\u6C42\u65F6\u53D1\u751F\u9519\u8BEF:", error);
      sendJsonResponse(res, 500, {
        error: "\u670D\u52A1\u5668\u9519\u8BEF",
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
  };
}
var normalizeApiPath, middleware_default;
var init_middleware = __esm({
  "src/mock/middleware/index.ts"() {
    init_config();
    init_services();
    init_integration2();
    normalizeApiPath = (url) => {
      console.log(`[Mock\u4E2D\u95F4\u4EF6] \u5904\u7406\u8BF7\u6C42\u8DEF\u5F84: ${url}`);
      if (url.startsWith("/api/api/")) {
        const fixedUrl = url.replace("/api/api/", "/api/");
        console.log(`[Mock\u4E2D\u95F4\u4EF6] \u4FEE\u6B63\u91CD\u590D\u7684API\u8DEF\u5F84: ${url} => ${fixedUrl}`);
        return fixedUrl;
      }
      if (url.includes("//")) {
        console.warn(`[Mock\u4E2D\u95F4\u4EF6] \u68C0\u6D4B\u5230URL\u4E2D\u6709\u8FDE\u7EED\u659C\u6760: ${url}`);
      }
      return url;
    };
    middleware_default = createMockMiddleware;
  }
});

// vite.config.ts
import { defineConfig, loadEnv } from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { execSync } from "child_process";
import tailwindcss from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///Users/sunguochao/Documents/Development/cursor/DataScope-Node/webview-ui/node_modules/autoprefixer/lib/autoprefixer.js";
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
function createMockApi() {
  console.log("[Vite\u914D\u7F6E] \u51C6\u5907\u521B\u5EFAMock API\u63D2\u4EF6");
  const isMockEnabled = process.env.VITE_USE_MOCK_API === "true";
  console.log(`[Vite\u914D\u7F6E] Mock API\u73AF\u5883\u53D8\u91CF\u503C: VITE_USE_MOCK_API = ${process.env.VITE_USE_MOCK_API}`);
  console.log(`[Vite\u914D\u7F6E] Mock API: ${isMockEnabled ? "\u542F\u7528" : "\u7981\u7528"}`);
  const mockConfig2 = {
    delay: 300,
    apiBasePath: "/api",
    logLevel: "debug",
    enabledModules: ["datasources", "queries", "users", "visualizations"]
  };
  if (isMockEnabled) {
    console.log("[Mock] \u914D\u7F6E:", mockConfig2);
    console.log("[Mock] \u670D\u52A1\u72B6\u6001: \u5DF2\u542F\u7528");
    return {
      name: "mock-api",
      configureServer(server) {
        const createMockMiddleware2 = (init_middleware(), __toCommonJS(middleware_exports)).default;
        const middleware = createMockMiddleware2(mockConfig2);
        server.middlewares.use(middleware);
        console.log("[Mock] \u4E2D\u95F4\u4EF6\u5DF2\u52A0\u8F7D");
      }
    };
  } else {
    console.log("[Mock] \u670D\u52A1\u72B6\u6001: \u5DF2\u7981\u7528");
    return null;
  }
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
  const mockPlugin = createMockApi();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svY29uZmlnLnRzIiwgInNyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzIiwgInNyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzIiwgInNyYy9tb2NrL2RhdGEvcXVlcnkudHMiLCAic3JjL21vY2svc2VydmljZXMvcXVlcnkudHMiLCAic3JjL21vY2svZGF0YS9pbnRlZ3JhdGlvbi50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9pbnRlZ3JhdGlvbi50cyIsICJzcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50cyIsICJzcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjsvKipcbiAqIE1vY2tcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcbiAqIFxuICogXHU2M0E3XHU1MjM2TW9ja1x1NjcwRFx1NTJBMVx1NzY4NFx1NTQyRlx1NzUyOC9cdTc5ODFcdTc1MjhcdTcyQjZcdTYwMDFcdTMwMDFcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkJcdTdCNDlcbiAqL1xuXG4vLyBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTYyMTZcdTUxNjhcdTVDNDBcdThCQkVcdTdGNkVcdTRFMkRcdTgzQjdcdTUzRDZcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG5leHBvcnQgZnVuY3Rpb24gaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIC8vIFx1NTcyOE5vZGUuanNcdTczQUZcdTU4ODNcdTRFMkRcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52KSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTcyOFx1NkQ0Rlx1ODlDOFx1NTY2OFx1NzNBRlx1NTg4M1x1NEUyRFxuICAgIGlmICh0eXBlb2YgaW1wb3J0Lm1ldGEgIT09ICd1bmRlZmluZWQnICYmIGltcG9ydC5tZXRhLmVudikge1xuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjhDMFx1NjdFNWxvY2FsU3RvcmFnZSAoXHU0RUM1XHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzKVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICBjb25zdCBsb2NhbFN0b3JhZ2VWYWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdVU0VfTU9DS19BUEknKTtcbiAgICAgIGlmIChsb2NhbFN0b3JhZ2VWYWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGxvY2FsU3RvcmFnZVZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU5RUQ4XHU4QkE0XHU2MEM1XHU1MUI1XHVGRjFBXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBCXHU1NDJGXHU3NTI4XHVGRjBDXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU3OTgxXHU3NTI4XG4gICAgY29uc3QgaXNEZXZlbG9wbWVudCA9IFxuICAgICAgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudiAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgfHxcbiAgICAgICh0eXBlb2YgaW1wb3J0Lm1ldGEgIT09ICd1bmRlZmluZWQnICYmIGltcG9ydC5tZXRhLmVudiAmJiBpbXBvcnQubWV0YS5lbnYuREVWID09PSB0cnVlKTtcbiAgICBcbiAgICByZXR1cm4gaXNEZXZlbG9wbWVudDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBcdTUxRkFcdTk1MTlcdTY1RjZcdTc2ODRcdTVCODlcdTUxNjhcdTU2REVcdTkwMDBcbiAgICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdTY4QzBcdTY3RTVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTUxRkFcdTk1MTlcdUZGMENcdTlFRDhcdThCQTRcdTc5ODFcdTc1MjhNb2NrXHU2NzBEXHU1MkExJywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBcdTU0MTFcdTU0MEVcdTUxN0NcdTVCQjlcdTY1RTdcdTRFRTNcdTc4MDFcdTc2ODRcdTUxRkRcdTY1NzBcbmV4cG9ydCBmdW5jdGlvbiBpc01vY2tFbmFibGVkKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNFbmFibGVkKCk7XG59XG5cbi8vIE1vY2tcdTY3MERcdTUyQTFcdTkxNERcdTdGNkVcbmV4cG9ydCBjb25zdCBtb2NrQ29uZmlnID0ge1xuICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIGVuYWJsZWQ6IGlzRW5hYmxlZCgpLFxuICBcbiAgLy8gXHU4QkY3XHU2QzQyXHU1RUY2XHU4RkRGXHVGRjA4XHU2QkVCXHU3OUQyXHVGRjA5XG4gIGRlbGF5OiAzMDAsXG4gIFxuICAvLyBBUElcdTU3RkFcdTc4NDBcdThERUZcdTVGODRcdUZGMENcdTc1MjhcdTRFOEVcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTk3MDBcdTg5ODFcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbiAgYXBpQmFzZVBhdGg6ICcvYXBpJyxcbiAgXG4gIC8vIFx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQjogJ25vbmUnLCAnZXJyb3InLCAnaW5mbycsICdkZWJ1ZydcbiAgbG9nTGV2ZWw6ICdkZWJ1ZycsXG4gIFxuICAvLyBcdTU0MkZcdTc1MjhcdTc2ODRcdTZBMjFcdTU3NTdcbiAgbW9kdWxlczoge1xuICAgIGRhdGFzb3VyY2VzOiB0cnVlLFxuICAgIHF1ZXJpZXM6IHRydWUsXG4gICAgdXNlcnM6IHRydWUsXG4gICAgdmlzdWFsaXphdGlvbnM6IHRydWVcbiAgfVxufTtcblxuLy8gXHU1MjI0XHU2NUFEXHU2NjJGXHU1NDI2XHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkTW9ja1JlcXVlc3QocmVxOiBhbnkpOiBib29sZWFuIHtcbiAgLy8gXHU1RkM1XHU5ODdCXHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICBpZiAoIW1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2VVJMXHVGRjBDXHU3ODZFXHU0RkREdXJsXHU2NjJGXHU1QjU3XHU3QjI2XHU0RTMyXG4gIGNvbnN0IHVybCA9IHJlcT8udXJsIHx8ICcnO1xuICBpZiAodHlwZW9mIHVybCAhPT0gJ3N0cmluZycpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTW9ja10gXHU2NTM2XHU1MjMwXHU5NzVFXHU1QjU3XHU3QjI2XHU0RTMyVVJMOicsIHVybCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdTVGQzVcdTk4N0JcdTY2MkZBUElcdThCRjdcdTZDNDJcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aChtb2NrQ29uZmlnLmFwaUJhc2VQYXRoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU4REVGXHU1Rjg0XHU2OEMwXHU2N0U1XHU5MDFBXHU4RkM3XHVGRjBDXHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBcdThCQjBcdTVGNTVcdTY1RTVcdTVGRDdcbmV4cG9ydCBmdW5jdGlvbiBsb2dNb2NrKGxldmVsOiAnZXJyb3InIHwgJ2luZm8nIHwgJ2RlYnVnJywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgY29uc3QgeyBsb2dMZXZlbCB9ID0gbW9ja0NvbmZpZztcbiAgXG4gIGlmIChsb2dMZXZlbCA9PT0gJ25vbmUnKSByZXR1cm47XG4gIFxuICBpZiAobGV2ZWwgPT09ICdlcnJvcicgJiYgWydlcnJvcicsICdpbmZvJywgJ2RlYnVnJ10uaW5jbHVkZXMobG9nTGV2ZWwpKSB7XG4gICAgY29uc29sZS5lcnJvcignW01vY2sgRVJST1JdJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdpbmZvJyAmJiBbJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmluZm8oJ1tNb2NrIElORk9dJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdkZWJ1ZycgJiYgbG9nTGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2sgREVCVUddJywgLi4uYXJncyk7XG4gIH1cbn1cblxuLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHU2NUY2XHU4RjkzXHU1MUZBTW9ja1x1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMVxudHJ5IHtcbiAgY29uc29sZS5sb2coYFtNb2NrXSBcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDE6ICR7bW9ja0NvbmZpZy5lbmFibGVkID8gJ1x1NURGMlx1NTQyRlx1NzUyOCcgOiAnXHU1REYyXHU3OTgxXHU3NTI4J31gKTtcbiAgaWYgKG1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU5MTREXHU3RjZFOmAsIHtcbiAgICAgIGRlbGF5OiBtb2NrQ29uZmlnLmRlbGF5LFxuICAgICAgYXBpQmFzZVBhdGg6IG1vY2tDb25maWcuYXBpQmFzZVBhdGgsXG4gICAgICBsb2dMZXZlbDogbW9ja0NvbmZpZy5sb2dMZXZlbCxcbiAgICAgIGVuYWJsZWRNb2R1bGVzOiBPYmplY3QuZW50cmllcyhtb2NrQ29uZmlnLm1vZHVsZXMpXG4gICAgICAgIC5maWx0ZXIoKFtfLCBlbmFibGVkXSkgPT4gZW5hYmxlZClcbiAgICAgICAgLm1hcCgoW25hbWVdKSA9PiBuYW1lKVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdThGOTNcdTUxRkFcdTkxNERcdTdGNkVcdTRGRTFcdTYwNkZcdTUxRkFcdTk1MTknLCBlcnJvcik7XG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvZGF0YXNvdXJjZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YS9kYXRhc291cmNlLnRzXCI7LyoqXG4gKiBcdTY1NzBcdTYzNkVcdTZFOTBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2NTcwXHU2MzZFXHU2RTkwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHVGRjBDXHU3NTI4XHU0RThFXHU1RjAwXHU1M0QxXHU1NDhDXHU2RDRCXHU4QkQ1XG4gKi9cblxuLy8gXHU2NTcwXHU2MzZFXHU2RTkwXHU3QzdCXHU1NzhCXG5leHBvcnQgdHlwZSBEYXRhU291cmNlVHlwZSA9ICdteXNxbCcgfCAncG9zdGdyZXNxbCcgfCAnb3JhY2xlJyB8ICdzcWxzZXJ2ZXInIHwgJ3NxbGl0ZSc7XG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NzJCNlx1NjAwMVxuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZVN0YXR1cyA9ICdhY3RpdmUnIHwgJ2luYWN0aXZlJyB8ICdlcnJvcicgfCAncGVuZGluZyc7XG5cbi8vIFx1NTQwQ1x1NkI2NVx1OTg5MVx1NzM4N1xuZXhwb3J0IHR5cGUgU3luY0ZyZXF1ZW5jeSA9ICdtYW51YWwnIHwgJ2hvdXJseScgfCAnZGFpbHknIHwgJ3dlZWtseScgfCAnbW9udGhseSc7XG5cbi8vIFx1NjU3MFx1NjM2RVx1NkU5MFx1NjNBNVx1NTNFM1xuZXhwb3J0IGludGVyZmFjZSBEYXRhU291cmNlIHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgdHlwZTogRGF0YVNvdXJjZVR5cGU7XG4gIGhvc3Q/OiBzdHJpbmc7XG4gIHBvcnQ/OiBudW1iZXI7XG4gIGRhdGFiYXNlTmFtZT86IHN0cmluZztcbiAgdXNlcm5hbWU/OiBzdHJpbmc7XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xuICBzdGF0dXM6IERhdGFTb3VyY2VTdGF0dXM7XG4gIHN5bmNGcmVxdWVuY3k/OiBTeW5jRnJlcXVlbmN5O1xuICBsYXN0U3luY1RpbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjcmVhdGVkQXQ6IHN0cmluZztcbiAgdXBkYXRlZEF0OiBzdHJpbmc7XG4gIGlzQWN0aXZlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuICovXG5leHBvcnQgY29uc3QgbW9ja0RhdGFTb3VyY2VzOiBEYXRhU291cmNlW10gPSBbXG4gIHtcbiAgICBpZDogJ2RzLTEnLFxuICAgIG5hbWU6ICdNeVNRTFx1NzkzQVx1NEY4Qlx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTc5M0FcdTRGOEJNeVNRTFx1NjU3MFx1NjM2RVx1NUU5MycsXG4gICAgdHlwZTogJ215c3FsJyxcbiAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICBwb3J0OiAzMzA2LFxuICAgIGRhdGFiYXNlTmFtZTogJ2V4YW1wbGVfZGInLFxuICAgIHVzZXJuYW1lOiAndXNlcicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTInLFxuICAgIG5hbWU6ICdQb3N0Z3JlU1FMXHU3NTFGXHU0RUE3XHU1RTkzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFBvc3RncmVTUUxcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdwb3N0Z3Jlc3FsJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjEwMCcsXG4gICAgcG9ydDogNTQzMixcbiAgICBkYXRhYmFzZU5hbWU6ICdwcm9kdWN0aW9uX2RiJyxcbiAgICB1c2VybmFtZTogJ2FkbWluJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdob3VybHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gNzc3NjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIGlkOiAnZHMtMycsXG4gICAgbmFtZTogJ1NRTGl0ZVx1NjcyQ1x1NTczMFx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY3MkNcdTU3MzBTUUxpdGVcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgIHR5cGU6ICdzcWxpdGUnLFxuICAgIGRhdGFiYXNlTmFtZTogJy9wYXRoL3RvL2xvY2FsLmRiJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICdtYW51YWwnLFxuICAgIGxhc3RTeW5jVGltZTogbnVsbCxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDM0NTYwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBpc0FjdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6ICdkcy00JyxcbiAgICBuYW1lOiAnU1FMIFNlcnZlclx1NkQ0Qlx1OEJENVx1NUU5MycsXG4gICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBTUUwgU2VydmVyXHU2RDRCXHU4QkQ1XHU3M0FGXHU1ODgzJyxcbiAgICB0eXBlOiAnc3Fsc2VydmVyJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjIwMCcsXG4gICAgcG9ydDogMTQzMyxcbiAgICBkYXRhYmFzZU5hbWU6ICd0ZXN0X2RiJyxcbiAgICB1c2VybmFtZTogJ3Rlc3RlcicsXG4gICAgc3RhdHVzOiAnaW5hY3RpdmUnLFxuICAgIHN5bmNGcmVxdWVuY3k6ICd3ZWVrbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDYwNDgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA1MTg0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IGZhbHNlXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RzLTUnLFxuICAgIG5hbWU6ICdPcmFjbGVcdTRGMDFcdTRFMUFcdTVFOTMnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwT3JhY2xlXHU0RjAxXHU0RTFBXHU2NTcwXHU2MzZFXHU1RTkzJyxcbiAgICB0eXBlOiAnb3JhY2xlJyxcbiAgICBob3N0OiAnMTkyLjE2OC4xLjE1MCcsXG4gICAgcG9ydDogMTUyMSxcbiAgICBkYXRhYmFzZU5hbWU6ICdlbnRlcnByaXNlX2RiJyxcbiAgICB1c2VybmFtZTogJ3N5c3RlbScsXG4gICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICBzeW5jRnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxMDM2ODAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGlzQWN0aXZlOiB0cnVlXG4gIH1cbl07XG5cbi8qKlxuICogXHU3NTFGXHU2MjEwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gY291bnQgXHU3NTFGXHU2MjEwXHU2NTcwXHU5MUNGXG4gKiBAcmV0dXJucyBcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTdFQzRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTW9ja0RhdGFTb3VyY2VzKGNvdW50OiBudW1iZXIgPSA1KTogRGF0YVNvdXJjZVtdIHtcbiAgY29uc3QgdHlwZXM6IERhdGFTb3VyY2VUeXBlW10gPSBbJ215c3FsJywgJ3Bvc3RncmVzcWwnLCAnb3JhY2xlJywgJ3NxbHNlcnZlcicsICdzcWxpdGUnXTtcbiAgY29uc3Qgc3RhdHVzZXM6IERhdGFTb3VyY2VTdGF0dXNbXSA9IFsnYWN0aXZlJywgJ2luYWN0aXZlJywgJ2Vycm9yJywgJ3BlbmRpbmcnXTtcbiAgY29uc3Qgc3luY0ZyZXFzOiBTeW5jRnJlcXVlbmN5W10gPSBbJ21hbnVhbCcsICdob3VybHknLCAnZGFpbHknLCAnd2Vla2x5JywgJ21vbnRobHknXTtcbiAgXG4gIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9LCAoXywgaSkgPT4ge1xuICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpICUgdHlwZXMubGVuZ3RoXTtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICBpZDogYGRzLWdlbi0ke2kgKyAxfWAsXG4gICAgICBuYW1lOiBgXHU3NTFGXHU2MjEwXHU3Njg0JHt0eXBlfVx1NjU3MFx1NjM2RVx1NkU5MCAke2kgKyAxfWAsXG4gICAgICBkZXNjcmlwdGlvbjogYFx1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1NzY4NCR7dHlwZX1cdTdDN0JcdTU3OEJcdTY1NzBcdTYzNkVcdTZFOTAgJHtpICsgMX1gLFxuICAgICAgdHlwZSxcbiAgICAgIGhvc3Q6IHR5cGUgIT09ICdzcWxpdGUnID8gJ2xvY2FsaG9zdCcgOiB1bmRlZmluZWQsXG4gICAgICBwb3J0OiB0eXBlICE9PSAnc3FsaXRlJyA/ICgzMzA2ICsgaSkgOiB1bmRlZmluZWQsXG4gICAgICBkYXRhYmFzZU5hbWU6IHR5cGUgPT09ICdzcWxpdGUnID8gYC9wYXRoL3RvL2RiXyR7aX0uZGJgIDogYGV4YW1wbGVfZGJfJHtpfWAsXG4gICAgICB1c2VybmFtZTogdHlwZSAhPT0gJ3NxbGl0ZScgPyBgdXNlcl8ke2l9YCA6IHVuZGVmaW5lZCxcbiAgICAgIHN0YXR1czogc3RhdHVzZXNbaSAlIHN0YXR1c2VzLmxlbmd0aF0sXG4gICAgICBzeW5jRnJlcXVlbmN5OiBzeW5jRnJlcXNbaSAlIHN5bmNGcmVxcy5sZW5ndGhdLFxuICAgICAgbGFzdFN5bmNUaW1lOiBpICUgMyA9PT0gMCA/IG51bGwgOiBuZXcgRGF0ZShub3cgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKG5vdyAtIChpICsgMTApICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKG5vdyAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGlzQWN0aXZlOiBpICUgNCAhPT0gMFxuICAgIH07XG4gIH0pO1xufVxuXG4vLyBcdTVCRkNcdTUxRkFcdTlFRDhcdThCQTRcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbmV4cG9ydCBkZWZhdWx0IG1vY2tEYXRhU291cmNlczsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9kYXRhc291cmNlLnRzXCI7LyoqXG4gKiBcdTY1NzBcdTYzNkVcdTZFOTBNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjU3MFx1NjM2RVx1NkU5MFx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IG1vY2tEYXRhU291cmNlcyB9IGZyb20gJy4uL2RhdGEvZGF0YXNvdXJjZSc7XG5pbXBvcnQgdHlwZSB7IERhdGFTb3VyY2UgfSBmcm9tICcuLi9kYXRhL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHsgbW9ja0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NEUzNFx1NjVGNlx1NUI1OFx1NTBBOFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1RkYwQ1x1NTE0MVx1OEJCOFx1NkEyMVx1NjJERlx1NTg5RVx1NTIyMFx1NjUzOVx1NjRDRFx1NEY1Q1xubGV0IGRhdGFTb3VyY2VzID0gWy4uLm1vY2tEYXRhU291cmNlc107XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNpbXVsYXRlRGVsYXkoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRlbGF5ID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xufVxuXG4vKipcbiAqIFx1OTFDRFx1N0Y2RVx1NjU3MFx1NjM2RVx1NkU5MFx1NjU3MFx1NjM2RVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzZXREYXRhU291cmNlcygpOiB2b2lkIHtcbiAgZGF0YVNvdXJjZXMgPSBbLi4ubW9ja0RhdGFTb3VyY2VzXTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqIEBwYXJhbSBwYXJhbXMgXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwXG4gKiBAcmV0dXJucyBcdTUyMDZcdTk4NzVcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFTb3VyY2VzKHBhcmFtcz86IHtcbiAgcGFnZT86IG51bWJlcjtcbiAgc2l6ZT86IG51bWJlcjtcbiAgbmFtZT86IHN0cmluZztcbiAgdHlwZT86IHN0cmluZztcbiAgc3RhdHVzPzogc3RyaW5nO1xufSk6IFByb21pc2U8e1xuICBpdGVtczogRGF0YVNvdXJjZVtdO1xuICBwYWdpbmF0aW9uOiB7XG4gICAgdG90YWw6IG51bWJlcjtcbiAgICBwYWdlOiBudW1iZXI7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIHRvdGFsUGFnZXM6IG51bWJlcjtcbiAgfTtcbn0+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgXG4gIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICBsZXQgZmlsdGVyZWRJdGVtcyA9IFsuLi5kYXRhU291cmNlc107XG4gIFxuICAvLyBcdTYzMDlcdTU0MERcdTc5RjBcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgIGNvbnN0IGtleXdvcmQgPSBwYXJhbXMubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBcbiAgICAgIGRzLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fCBcbiAgICAgIChkcy5kZXNjcmlwdGlvbiAmJiBkcy5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICk7XG4gIH1cbiAgXG4gIC8vIFx1NjMwOVx1N0M3Qlx1NTc4Qlx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zPy50eXBlKSB7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGRzID0+IGRzLnR5cGUgPT09IHBhcmFtcy50eXBlKTtcbiAgfVxuICBcbiAgLy8gXHU2MzA5XHU3MkI2XHU2MDAxXHU4RkM3XHU2RUU0XG4gIGlmIChwYXJhbXM/LnN0YXR1cykge1xuICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihkcyA9PiBkcy5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICB9XG4gIFxuICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gIGNvbnN0IHBhZ2luYXRlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5zbGljZShzdGFydCwgZW5kKTtcbiAgXG4gIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICByZXR1cm4ge1xuICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0b3RhbDogZmlsdGVyZWRJdGVtcy5sZW5ndGgsXG4gICAgICBwYWdlLFxuICAgICAgc2l6ZSxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmaWx0ZXJlZEl0ZW1zLmxlbmd0aCAvIHNpemUpXG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjU3MFx1NjM2RVx1NkU5MFxuICogQHBhcmFtIGlkIFx1NjU3MFx1NjM2RVx1NkU5MElEXG4gKiBAcmV0dXJucyBcdTY1NzBcdTYzNkVcdTZFOTBcdThCRTZcdTYwQzVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFTb3VyY2UoaWQ6IHN0cmluZyk6IFByb21pc2U8RGF0YVNvdXJjZT4ge1xuICAvLyBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICBcbiAgLy8gXHU2N0U1XHU2MjdFXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGNvbnN0IGRhdGFTb3VyY2UgPSBkYXRhU291cmNlcy5maW5kKGRzID0+IGRzLmlkID09PSBpZCk7XG4gIFxuICBpZiAoIWRhdGFTb3VyY2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgcmV0dXJuIGRhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gZGF0YSBcdTY1NzBcdTYzNkVcdTZFOTBcdTY1NzBcdTYzNkVcbiAqIEByZXR1cm5zIFx1NTIxQlx1NUVGQVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlRGF0YVNvdXJjZShkYXRhOiBQYXJ0aWFsPERhdGFTb3VyY2U+KTogUHJvbWlzZTxEYXRhU291cmNlPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBJRFxuICBjb25zdCBuZXdJZCA9IGBkcy0ke0RhdGUubm93KCl9YDtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFxuICBjb25zdCBuZXdEYXRhU291cmNlOiBEYXRhU291cmNlID0ge1xuICAgIGlkOiBuZXdJZCxcbiAgICBuYW1lOiBkYXRhLm5hbWUgfHwgJ05ldyBEYXRhIFNvdXJjZScsXG4gICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgdHlwZTogZGF0YS50eXBlIHx8ICdteXNxbCcsXG4gICAgaG9zdDogZGF0YS5ob3N0LFxuICAgIHBvcnQ6IGRhdGEucG9ydCxcbiAgICBkYXRhYmFzZU5hbWU6IGRhdGEuZGF0YWJhc2VOYW1lLFxuICAgIHVzZXJuYW1lOiBkYXRhLnVzZXJuYW1lLFxuICAgIHN0YXR1czogZGF0YS5zdGF0dXMgfHwgJ3BlbmRpbmcnLFxuICAgIHN5bmNGcmVxdWVuY3k6IGRhdGEuc3luY0ZyZXF1ZW5jeSB8fCAnbWFudWFsJyxcbiAgICBsYXN0U3luY1RpbWU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgaXNBY3RpdmU6IHRydWVcbiAgfTtcbiAgXG4gIC8vIFx1NkRGQlx1NTJBMFx1NTIzMFx1NTIxN1x1ODg2OFxuICBkYXRhU291cmNlcy5wdXNoKG5ld0RhdGFTb3VyY2UpO1xuICBcbiAgcmV0dXJuIG5ld0RhdGFTb3VyY2U7XG59XG5cbi8qKlxuICogXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXHU2RTkwXG4gKiBAcGFyYW0gaWQgXHU2NTcwXHU2MzZFXHU2RTkwSURcbiAqIEBwYXJhbSBkYXRhIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVxuICogQHJldHVybnMgXHU2NkY0XHU2NUIwXHU1NDBFXHU3Njg0XHU2NTcwXHU2MzZFXHU2RTkwXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVEYXRhU291cmNlKGlkOiBzdHJpbmcsIGRhdGE6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPERhdGFTb3VyY2U+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NjI3RVx1NTIzMFx1ODk4MVx1NjZGNFx1NjVCMFx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MFx1N0QyMlx1NUYxNVxuICBjb25zdCBpbmRleCA9IGRhdGFTb3VyY2VzLmZpbmRJbmRleChkcyA9PiBkcy5pZCA9PT0gaWQpO1xuICBcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjU3MFx1NjM2RVx1NkU5MGApO1xuICB9XG4gIFxuICAvLyBcdTY2RjRcdTY1QjBcdTY1NzBcdTYzNkVcdTZFOTBcbiAgY29uc3QgdXBkYXRlZERhdGFTb3VyY2U6IERhdGFTb3VyY2UgPSB7XG4gICAgLi4uZGF0YVNvdXJjZXNbaW5kZXhdLFxuICAgIC4uLmRhdGEsXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgfTtcbiAgXG4gIC8vIFx1NjZGRlx1NjM2Mlx1NjU3MFx1NjM2RVx1NkU5MFxuICBkYXRhU291cmNlc1tpbmRleF0gPSB1cGRhdGVkRGF0YVNvdXJjZTtcbiAgXG4gIHJldHVybiB1cGRhdGVkRGF0YVNvdXJjZTtcbn1cblxuLyoqXG4gKiBcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcbiAqIEBwYXJhbSBpZCBcdTY1NzBcdTYzNkVcdTZFOTBJRFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlRGF0YVNvdXJjZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIFx1NkEyMVx1NjJERlx1NUVGNlx1OEZERlxuICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gIFxuICAvLyBcdTYyN0VcdTUyMzBcdTg5ODFcdTUyMjBcdTk2NjRcdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBcdTdEMjJcdTVGMTVcbiAgY29uc3QgaW5kZXggPSBkYXRhU291cmNlcy5maW5kSW5kZXgoZHMgPT4gZHMuaWQgPT09IGlkKTtcbiAgXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY1NzBcdTYzNkVcdTZFOTBgKTtcbiAgfVxuICBcbiAgLy8gXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGRhdGFTb3VyY2VzLnNwbGljZShpbmRleCwgMSk7XG59XG5cbi8qKlxuICogXHU2RDRCXHU4QkQ1XHU2NTcwXHU2MzZFXHU2RTkwXHU4RkRFXHU2M0E1XG4gKiBAcGFyYW0gcGFyYW1zIFx1OEZERVx1NjNBNVx1NTNDMlx1NjU3MFxuICogQHJldHVybnMgXHU4RkRFXHU2M0E1XHU2RDRCXHU4QkQ1XHU3RUQzXHU2NzlDXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0Q29ubmVjdGlvbihwYXJhbXM6IFBhcnRpYWw8RGF0YVNvdXJjZT4pOiBQcm9taXNlPHtcbiAgc3VjY2VzczogYm9vbGVhbjtcbiAgbWVzc2FnZT86IHN0cmluZztcbiAgZGV0YWlscz86IGFueTtcbn0+IHtcbiAgLy8gXHU2QTIxXHU2MkRGXHU1RUY2XHU4RkRGXG4gIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgXG4gIC8vIFx1NUI5RVx1OTY0NVx1NEY3Rlx1NzUyOFx1NjVGNlx1NTNFRlx1ODBGRFx1NEYxQVx1NjcwOVx1NjZGNFx1NTkwRFx1Njc0Mlx1NzY4NFx1OEZERVx1NjNBNVx1NkQ0Qlx1OEJENVx1OTAzQlx1OEY5MVxuICAvLyBcdThGRDlcdTkxQ0NcdTdCODBcdTUzNTVcdTZBMjFcdTYyREZcdTYyMTBcdTUyOUYvXHU1OTMxXHU4RDI1XG4gIGNvbnN0IHN1Y2Nlc3MgPSBNYXRoLnJhbmRvbSgpID4gMC4yOyAvLyA4MCVcdTYyMTBcdTUyOUZcdTczODdcbiAgXG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBtZXNzYWdlOiBzdWNjZXNzID8gJ1x1OEZERVx1NjNBNVx1NjIxMFx1NTI5RicgOiAnXHU4RkRFXHU2M0E1XHU1OTMxXHU4RDI1OiBcdTY1RTBcdTZDRDVcdThGREVcdTYzQTVcdTUyMzBcdTY1NzBcdTYzNkVcdTVFOTNcdTY3MERcdTUyQTFcdTU2NjgnLFxuICAgIGRldGFpbHM6IHN1Y2Nlc3MgPyB7XG4gICAgICByZXNwb25zZVRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSArIDEwLFxuICAgICAgdmVyc2lvbjogJzguMC4yOCcsXG4gICAgICBjb25uZWN0aW9uSWQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKSArIDEwMDBcbiAgICB9IDoge1xuICAgICAgZXJyb3JDb2RlOiAnQ09OTkVDVElPTl9SRUZVU0VEJyxcbiAgICAgIGVycm9yRGV0YWlsczogJ1x1NjVFMFx1NkNENVx1NUVGQVx1N0FDQlx1NTIzMFx1NjcwRFx1NTJBMVx1NTY2OFx1NzY4NFx1OEZERVx1NjNBNVx1RkYwQ1x1OEJGN1x1NjhDMFx1NjdFNVx1N0Y1MVx1N0VEQ1x1OEJCRVx1N0Y2RVx1NTQ4Q1x1NTFFRFx1NjM2RSdcbiAgICB9XG4gIH07XG59XG5cbi8vIFx1NUJGQ1x1NTFGQVx1NjcwRFx1NTJBMVxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXREYXRhU291cmNlcyxcbiAgZ2V0RGF0YVNvdXJjZSxcbiAgY3JlYXRlRGF0YVNvdXJjZSxcbiAgdXBkYXRlRGF0YVNvdXJjZSxcbiAgZGVsZXRlRGF0YVNvdXJjZSxcbiAgdGVzdENvbm5lY3Rpb24sXG4gIHJlc2V0RGF0YVNvdXJjZXNcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvdXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3V0aWxzLnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5MDFBXHU3NTI4XHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NTIxQlx1NUVGQVx1N0VERlx1NEUwMFx1NjgzQ1x1NUYwRlx1NTRDRFx1NUU5NFx1NzY4NFx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuICovXG5cbi8qKlxuICogXHU1MjFCXHU1RUZBXHU2QTIxXHU2MkRGQVBJXHU2MjEwXHU1MjlGXHU1NENEXHU1RTk0XG4gKiBAcGFyYW0gZGF0YSBcdTU0Q0RcdTVFOTRcdTY1NzBcdTYzNkVcbiAqIEBwYXJhbSBzdWNjZXNzIFx1NjIxMFx1NTI5Rlx1NzJCNlx1NjAwMVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQXRydWVcbiAqIEBwYXJhbSBtZXNzYWdlIFx1NTNFRlx1OTAwOVx1NkQ4OFx1NjA2RlxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHU3Njg0QVBJXHU1NENEXHU1RTk0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrUmVzcG9uc2U8VD4oXG4gIGRhdGE6IFQsIFxuICBzdWNjZXNzOiBib29sZWFuID0gdHJ1ZSwgXG4gIG1lc3NhZ2U/OiBzdHJpbmdcbikge1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3MsXG4gICAgZGF0YSxcbiAgICBtZXNzYWdlLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIG1vY2tSZXNwb25zZTogdHJ1ZSAvLyBcdTY4MDdcdThCQjBcdTRFM0FcdTZBMjFcdTYyREZcdTU0Q0RcdTVFOTRcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTZBMjFcdTYyREZBUElcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAqIEBwYXJhbSBtZXNzYWdlIFx1OTUxOVx1OEJFRlx1NkQ4OFx1NjA2RlxuICogQHBhcmFtIGNvZGUgXHU5NTE5XHU4QkVGXHU0RUUzXHU3ODAxXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBJ01PQ0tfRVJST1InXG4gKiBAcGFyYW0gc3RhdHVzIEhUVFBcdTcyQjZcdTYwMDFcdTc4MDFcdUZGMENcdTlFRDhcdThCQTRcdTRFM0E1MDBcbiAqIEByZXR1cm5zIFx1NjgwN1x1NTFDNlx1NjgzQ1x1NUYwRlx1NzY4NFx1OTUxOVx1OEJFRlx1NTRDRFx1NUU5NFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UoXG4gIG1lc3NhZ2U6IHN0cmluZywgXG4gIGNvZGU6IHN0cmluZyA9ICdNT0NLX0VSUk9SJywgXG4gIHN0YXR1czogbnVtYmVyID0gNTAwXG4pIHtcbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICBlcnJvcjoge1xuICAgICAgbWVzc2FnZSxcbiAgICAgIGNvZGUsXG4gICAgICBzdGF0dXNDb2RlOiBzdGF0dXNcbiAgICB9LFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIG1vY2tSZXNwb25zZTogdHJ1ZVxuICB9O1xufVxuXG4vKipcbiAqIFx1NTIxQlx1NUVGQVx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NFx1N0VEM1x1Njc4NFxuICogQHBhcmFtIGl0ZW1zIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzY4NFx1OTg3OVx1NzZFRVx1NTIxN1x1ODg2OFxuICogQHBhcmFtIHRvdGFsSXRlbXMgXHU2MDNCXHU5ODc5XHU3NkVFXHU2NTcwXG4gKiBAcGFyYW0gcGFnZSBcdTVGNTNcdTUyNERcdTk4NzVcdTc4MDFcbiAqIEBwYXJhbSBzaXplIFx1NkJDRlx1OTg3NVx1NTkyN1x1NUMwRlxuICogQHJldHVybnMgXHU2ODA3XHU1MUM2XHU1MjA2XHU5ODc1XHU1NENEXHU1RTk0XHU3RUQzXHU2Nzg0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2U8VD4oXG4gIGl0ZW1zOiBUW10sXG4gIHRvdGFsSXRlbXM6IG51bWJlcixcbiAgcGFnZTogbnVtYmVyID0gMSxcbiAgc2l6ZTogbnVtYmVyID0gMTBcbikge1xuICByZXR1cm4gY3JlYXRlTW9ja1Jlc3BvbnNlKHtcbiAgICBpdGVtcyxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0b3RhbDogdG90YWxJdGVtcyxcbiAgICAgIHBhZ2UsXG4gICAgICBzaXplLFxuICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsSXRlbXMgLyBzaXplKSxcbiAgICAgIGhhc01vcmU6IHBhZ2UgKiBzaXplIDwgdG90YWxJdGVtc1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XHU1RUY2XHU4RkRGXG4gKiBAcGFyYW0gbXMgXHU1RUY2XHU4RkRGXHU2QkVCXHU3OUQyXHU2NTcwXHVGRjBDXHU5RUQ4XHU4QkE0MzAwbXNcbiAqIEByZXR1cm5zIFByb21pc2VcdTVCRjlcdThDNjFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIgPSAzMDApOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNyZWF0ZU1vY2tSZXNwb25zZSxcbiAgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UsXG4gIGNyZWF0ZVBhZ2luYXRpb25SZXNwb25zZSxcbiAgZGVsYXlcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL3F1ZXJ5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9kYXRhL3F1ZXJ5LnRzXCI7LyoqXG4gKiBcdTY3RTVcdThCRTJcdTZBMjFcdTYyREZcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU2N0U1XHU4QkUyXHU3NkY4XHU1MTczXHU3Njg0XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBRdWVyeSB9IGZyb20gJ0AvdHlwZXMvcXVlcnknO1xuXG4vLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcbmV4cG9ydCBjb25zdCBtb2NrUXVlcmllczogUXVlcnlbXSA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiB7XG4gIGNvbnN0IGlkID0gYHF1ZXJ5LSR7aSArIDF9YDtcbiAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKTtcbiAgXG4gIHJldHVybiB7XG4gICAgaWQsXG4gICAgbmFtZTogYFx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMiAke2kgKyAxfWAsXG4gICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX0gXHU3Njg0XHU2M0NGXHU4RkYwYCxcbiAgICBmb2xkZXJJZDogaSAlIDMgPT09IDAgPyAnZm9sZGVyLTEnIDogKGkgJSAzID09PSAxID8gJ2ZvbGRlci0yJyA6ICdmb2xkZXItMycpLFxuICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICBkYXRhU291cmNlTmFtZTogYFx1NjU3MFx1NjM2RVx1NkU5MCAkeyhpICUgNSkgKyAxfWAsXG4gICAgcXVlcnlUeXBlOiBpICUgMiA9PT0gMCA/ICdTUUwnIDogJ05BVFVSQUxfTEFOR1VBR0UnLFxuICAgIHF1ZXJ5VGV4dDogaSAlIDIgPT09IDAgPyBcbiAgICAgIGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgIDogXG4gICAgICBgXHU2N0U1XHU2MjdFXHU2NzAwXHU4RkQxMTBcdTY3NjEke2kgJSAyID09PSAwID8gJ1x1OEJBMlx1NTM1NScgOiAnXHU3NTI4XHU2MjM3J31cdThCQjBcdTVGNTVgLFxuICAgIHN0YXR1czogaSAlIDQgPT09IDAgPyAnRFJBRlQnIDogKGkgJSA0ID09PSAxID8gJ1BVQkxJU0hFRCcgOiAoaSAlIDQgPT09IDIgPyAnREVQUkVDQVRFRCcgOiAnQVJDSElWRUQnKSksXG4gICAgc2VydmljZVN0YXR1czogaSAlIDIgPT09IDAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBjcmVhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgdXBkYXRlZEJ5OiB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9LFxuICAgIGV4ZWN1dGlvbkNvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCksXG4gICAgaXNGYXZvcml0ZTogaSAlIDMgPT09IDAsXG4gICAgaXNBY3RpdmU6IGkgJSA1ICE9PSAwLFxuICAgIGxhc3RFeGVjdXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDQzMjAwMCkudG9JU09TdHJpbmcoKSxcbiAgICByZXN1bHRDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgIGV4ZWN1dGlvblRpbWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkgKyAxMCxcbiAgICB0YWdzOiBbYFx1NjgwN1x1N0I3RSR7aSsxfWAsIGBcdTdDN0JcdTU3OEIke2kgJSAzfWBdLFxuICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICBpZDogYHZlci0ke2lkfS0xYCxcbiAgICAgIHF1ZXJ5SWQ6IGlkLFxuICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgIG5hbWU6ICdcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkMnLFxuICAgICAgc3FsOiBgU0VMRUNUICogRlJPTSBleGFtcGxlX3RhYmxlIFdIRVJFIGlkID4gJHtpfSBPUkRFUiBCWSBuYW1lIExJTUlUIDEwYCxcbiAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBpc0xhdGVzdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgfSxcbiAgICB2ZXJzaW9uczogW3tcbiAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgcXVlcnlJZDogaWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAxLFxuICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgLFxuICAgICAgZGF0YVNvdXJjZUlkOiBgZHMtJHsoaSAlIDUpICsgMX1gLFxuICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgIGlzTGF0ZXN0OiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9XVxuICB9O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1vY2tRdWVyaWVzOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svc2VydmljZXMvcXVlcnkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL3F1ZXJ5LnRzXCI7LyoqXG4gKiBcdTY3RTVcdThCRTJNb2NrXHU2NzBEXHU1MkExXG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1NjdFNVx1OEJFMlx1NzZGOFx1NTE3M0FQSVx1NzY4NFx1NkEyMVx1NjJERlx1NUI5RVx1NzNCMFxuICovXG5cbmltcG9ydCB7IGRlbGF5LCBjcmVhdGVQYWdpbmF0aW9uUmVzcG9uc2UsIGNyZWF0ZU1vY2tSZXNwb25zZSwgY3JlYXRlTW9ja0Vycm9yUmVzcG9uc2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IG1vY2tDb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHsgbW9ja1F1ZXJpZXMgfSBmcm9tICcuLi9kYXRhL3F1ZXJ5JztcblxuLy8gXHU5MUNEXHU3RjZFXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRRdWVyaWVzKCk6IHZvaWQge1xuICAvLyBcdTRGRERcdTc1NTlcdTVGMTVcdTc1MjhcdUZGMENcdTUzRUFcdTkxQ0RcdTdGNkVcdTUxODVcdTVCQjlcbiAgd2hpbGUgKG1vY2tRdWVyaWVzLmxlbmd0aCA+IDApIHtcbiAgICBtb2NrUXVlcmllcy5wb3AoKTtcbiAgfVxuICBcbiAgLy8gXHU5MUNEXHU2NUIwXHU3NTFGXHU2MjEwXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXG4gIEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiB7XG4gICAgY29uc3QgaWQgPSBgcXVlcnktJHtpICsgMX1gO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgbW9ja1F1ZXJpZXMucHVzaCh7XG4gICAgICBpZCxcbiAgICAgIG5hbWU6IGBcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX1gLFxuICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTc5M0FcdTRGOEJcdTY3RTVcdThCRTIgJHtpICsgMX0gXHU3Njg0XHU2M0NGXHU4RkYwYCxcbiAgICAgIGZvbGRlcklkOiBpICUgMyA9PT0gMCA/ICdmb2xkZXItMScgOiAoaSAlIDMgPT09IDEgPyAnZm9sZGVyLTInIDogJ2ZvbGRlci0zJyksXG4gICAgICBkYXRhU291cmNlSWQ6IGBkcy0keyhpICUgNSkgKyAxfWAsXG4gICAgICBkYXRhU291cmNlTmFtZTogYFx1NjU3MFx1NjM2RVx1NkU5MCAkeyhpICUgNSkgKyAxfWAsXG4gICAgICBxdWVyeVR5cGU6IGkgJSAyID09PSAwID8gJ1NRTCcgOiAnTkFUVVJBTF9MQU5HVUFHRScsXG4gICAgICBxdWVyeVRleHQ6IGkgJSAyID09PSAwID8gXG4gICAgICAgIGBTRUxFQ1QgKiBGUk9NIGV4YW1wbGVfdGFibGUgV0hFUkUgaWQgPiAke2l9IE9SREVSIEJZIG5hbWUgTElNSVQgMTBgIDogXG4gICAgICAgIGBcdTY3RTVcdTYyN0VcdTY3MDBcdThGRDExMFx1Njc2MSR7aSAlIDIgPT09IDAgPyAnXHU4QkEyXHU1MzU1JyA6ICdcdTc1MjhcdTYyMzcnfVx1OEJCMFx1NUY1NWAsXG4gICAgICBzdGF0dXM6IGkgJSA0ID09PSAwID8gJ0RSQUZUJyA6IChpICUgNCA9PT0gMSA/ICdQVUJMSVNIRUQnIDogKGkgJSA0ID09PSAyID8gJ0RFUFJFQ0FURUQnIDogJ0FSQ0hJVkVEJykpLFxuICAgICAgc2VydmljZVN0YXR1czogaSAlIDIgPT09IDAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSBpICogNDMyMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBjcmVhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICB1cGRhdGVkQnk6IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICBleGVjdXRpb25Db3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApLFxuICAgICAgaXNGYXZvcml0ZTogaSAlIDMgPT09IDAsXG4gICAgICBpc0FjdGl2ZTogaSAlIDUgIT09IDAsXG4gICAgICBsYXN0RXhlY3V0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA0MzIwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICByZXN1bHRDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEwLFxuICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTAwKSArIDEwLFxuICAgICAgdGFnczogW2BcdTY4MDdcdTdCN0Uke2krMX1gLCBgXHU3QzdCXHU1NzhCJHtpICUgM31gXSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9LFxuICAgICAgdmVyc2lvbnM6IFt7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogYFNFTEVDVCAqIEZST00gZXhhbXBsZV90YWJsZSBXSEVSRSBpZCA+ICR7aX0gT1JERVIgQlkgbmFtZSBMSU1JVCAxMGAsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogYGRzLSR7KGkgJSA1KSArIDF9YCxcbiAgICAgICAgc3RhdHVzOiAnUFVCTElTSEVEJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9XVxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXlUaW1lID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIGRlbGF5KGRlbGF5VGltZSk7XG59XG5cbi8qKlxuICogXHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IHF1ZXJ5U2VydmljZSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcmllcyhwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdThGQzdcdTZFRTRcbiAgICBsZXQgZmlsdGVyZWRJdGVtcyA9IFsuLi5tb2NrUXVlcmllc107XG4gICAgXG4gICAgLy8gXHU2MzA5XHU1NDBEXHU3OUYwXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8ubmFtZSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHBhcmFtcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBcbiAgICAgICAgcS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAgIChxLmRlc2NyaXB0aW9uICYmIHEuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NjU3MFx1NjM2RVx1NkU5MFx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LmRhdGFTb3VyY2VJZCkge1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKHEgPT4gcS5kYXRhU291cmNlSWQgPT09IHBhcmFtcy5kYXRhU291cmNlSWQpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTcyQjZcdTYwMDFcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy5zdGF0dXMpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEuc3RhdHVzID09PSBwYXJhbXMuc3RhdHVzKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU3QzdCXHU1NzhCXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8ucXVlcnlUeXBlKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIocSA9PiBxLnF1ZXJ5VHlwZSA9PT0gcGFyYW1zLnF1ZXJ5VHlwZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjMwOVx1NjUzNlx1ODVDRlx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/LmlzRmF2b3JpdGUpIHtcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihxID0+IHEuaXNGYXZvcml0ZSA9PT0gdHJ1ZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NjUzNlx1ODVDRlx1NzY4NFx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0RmF2b3JpdGVRdWVyaWVzKHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1OEZDN1x1NkVFNFx1NTFGQVx1NjUzNlx1ODVDRlx1NzY4NFx1NjdFNVx1OEJFMlxuICAgIGxldCBmYXZvcml0ZVF1ZXJpZXMgPSBtb2NrUXVlcmllcy5maWx0ZXIocSA9PiBxLmlzRmF2b3JpdGUgPT09IHRydWUpO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTE3Nlx1NEVENlx1OEZDN1x1NkVFNFx1Njc2MVx1NEVGNlxuICAgIGlmIChwYXJhbXM/Lm5hbWUgfHwgcGFyYW1zPy5zZWFyY2gpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSAocGFyYW1zLm5hbWUgfHwgcGFyYW1zLnNlYXJjaCB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZhdm9yaXRlUXVlcmllcyA9IGZhdm9yaXRlUXVlcmllcy5maWx0ZXIocSA9PiBcbiAgICAgICAgcS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHwgXG4gICAgICAgIChxLmRlc2NyaXB0aW9uICYmIHEuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIGlmIChwYXJhbXM/LmRhdGFTb3VyY2VJZCkge1xuICAgICAgZmF2b3JpdGVRdWVyaWVzID0gZmF2b3JpdGVRdWVyaWVzLmZpbHRlcihxID0+IHEuZGF0YVNvdXJjZUlkID09PSBwYXJhbXMuZGF0YVNvdXJjZUlkKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgICBmYXZvcml0ZVF1ZXJpZXMgPSBmYXZvcml0ZVF1ZXJpZXMuZmlsdGVyKHEgPT4gcS5zdGF0dXMgPT09IHBhcmFtcy5zdGF0dXMpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTVFOTRcdTc1MjhcdTUyMDZcdTk4NzVcbiAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBzaXplO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgZmF2b3JpdGVRdWVyaWVzLmxlbmd0aCk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmYXZvcml0ZVF1ZXJpZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU1MjA2XHU5ODc1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IGZhdm9yaXRlUXVlcmllcy5sZW5ndGgsXG4gICAgICAgIHBhZ2UsXG4gICAgICAgIHNpemUsXG4gICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChmYXZvcml0ZVF1ZXJpZXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnkoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHF1ZXJ5ID0gbW9ja1F1ZXJpZXMuZmluZChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHF1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnkoZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2NUIwSURcdUZGMENcdTY4M0NcdTVGMEZcdTRFMEVcdTczQjBcdTY3MDlJRFx1NEUwMFx1ODFGNFxuICAgIGNvbnN0IGlkID0gYHF1ZXJ5LSR7bW9ja1F1ZXJpZXMubGVuZ3RoICsgMX1gO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTY3RTVcdThCRTJcbiAgICBjb25zdCBuZXdRdWVyeSA9IHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogZGF0YS5uYW1lIHx8IGBcdTY1QjBcdTY3RTVcdThCRTIgJHtpZH1gLFxuICAgICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgICBmb2xkZXJJZDogZGF0YS5mb2xkZXJJZCB8fCBudWxsLFxuICAgICAgZGF0YVNvdXJjZUlkOiBkYXRhLmRhdGFTb3VyY2VJZCxcbiAgICAgIGRhdGFTb3VyY2VOYW1lOiBkYXRhLmRhdGFTb3VyY2VOYW1lIHx8IGBcdTY1NzBcdTYzNkVcdTZFOTAgJHtkYXRhLmRhdGFTb3VyY2VJZH1gLFxuICAgICAgcXVlcnlUeXBlOiBkYXRhLnF1ZXJ5VHlwZSB8fCAnU1FMJyxcbiAgICAgIHF1ZXJ5VGV4dDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzIHx8ICdEUkFGVCcsXG4gICAgICBzZXJ2aWNlU3RhdHVzOiBkYXRhLnNlcnZpY2VTdGF0dXMgfHwgJ0RJU0FCTEVEJyxcbiAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICBjcmVhdGVkQnk6IGRhdGEuY3JlYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICB1cGRhdGVkQnk6IGRhdGEudXBkYXRlZEJ5IHx8IHsgaWQ6ICd1c2VyMScsIG5hbWU6ICdcdTZENEJcdThCRDVcdTc1MjhcdTYyMzcnIH0sXG4gICAgICBleGVjdXRpb25Db3VudDogMCxcbiAgICAgIGlzRmF2b3JpdGU6IGRhdGEuaXNGYXZvcml0ZSB8fCBmYWxzZSxcbiAgICAgIGlzQWN0aXZlOiBkYXRhLmlzQWN0aXZlIHx8IHRydWUsXG4gICAgICBsYXN0RXhlY3V0ZWRBdDogbnVsbCxcbiAgICAgIHJlc3VsdENvdW50OiAwLFxuICAgICAgZXhlY3V0aW9uVGltZTogMCxcbiAgICAgIHRhZ3M6IGRhdGEudGFncyB8fCBbXSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiB7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NTIxRFx1NTlDQlx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQsXG4gICAgICAgIHN0YXR1czogJ0RSQUZUJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9LFxuICAgICAgdmVyc2lvbnM6IFt7XG4gICAgICAgIGlkOiBgdmVyLSR7aWR9LTFgLFxuICAgICAgICBxdWVyeUlkOiBpZCxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogMSxcbiAgICAgICAgbmFtZTogJ1x1NTIxRFx1NTlDQlx1NzI0OFx1NjcyQycsXG4gICAgICAgIHNxbDogZGF0YS5xdWVyeVRleHQgfHwgJycsXG4gICAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQsXG4gICAgICAgIHN0YXR1czogJ0RSQUZUJyxcbiAgICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICAgIGNyZWF0ZWRBdDogdGltZXN0YW1wXG4gICAgICB9XVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU1MjMwXHU1MjE3XHU4ODY4XG4gICAgbW9ja1F1ZXJpZXMucHVzaChuZXdRdWVyeSk7XG4gICAgXG4gICAgcmV0dXJuIG5ld1F1ZXJ5O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgdXBkYXRlUXVlcnkoaWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU4OTgxXHU2NkY0XHU2NUIwXHU3Njg0XHU2N0U1XHU4QkUyXHU3RDIyXHU1RjE1XG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IHVwZGF0ZWRRdWVyeSA9IHtcbiAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRCeTogZGF0YS51cGRhdGVkQnkgfHwgbW9ja1F1ZXJpZXNbaW5kZXhdLnVwZGF0ZWRCeSB8fCB7IGlkOiAndXNlcjEnLCBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyB9XG4gICAgfTtcbiAgICBcbiAgICAvLyBcdTY2RkZcdTYzNjJcdTY3RTVcdThCRTJcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB1cGRhdGVkUXVlcnk7XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRRdWVyeTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGRlbGV0ZVF1ZXJ5KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU4OTgxXHU1MjIwXHU5NjY0XHU3Njg0XHU2N0U1XHU4QkUyXHU3RDIyXHU1RjE1XG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU2N0U1XHU4QkUyYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTIyMFx1OTY2NFx1NjdFNVx1OEJFMlxuICAgIG1vY2tRdWVyaWVzLnNwbGljZShpbmRleCwgMSk7XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBleGVjdXRlUXVlcnkoaWQ6IHN0cmluZywgcGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTdFRDNcdTY3OUNcbiAgICBjb25zdCBjb2x1bW5zID0gWydpZCcsICduYW1lJywgJ2VtYWlsJywgJ3N0YXR1cycsICdjcmVhdGVkX2F0J107XG4gICAgY29uc3Qgcm93cyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiAoe1xuICAgICAgaWQ6IGkgKyAxLFxuICAgICAgbmFtZTogYFx1NzUyOFx1NjIzNyAke2kgKyAxfWAsXG4gICAgICBlbWFpbDogYHVzZXIke2kgKyAxfUBleGFtcGxlLmNvbWAsXG4gICAgICBzdGF0dXM6IGkgJSAyID09PSAwID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnLFxuICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKVxuICAgIH0pKTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcdTYyNjdcdTg4NENcdTdFREZcdThCQTFcbiAgICBjb25zdCBpbmRleCA9IG1vY2tRdWVyaWVzLmZpbmRJbmRleChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAgIC4uLm1vY2tRdWVyaWVzW2luZGV4XSxcbiAgICAgICAgZXhlY3V0aW9uQ291bnQ6IChtb2NrUXVlcmllc1tpbmRleF0uZXhlY3V0aW9uQ291bnQgfHwgMCkgKyAxLFxuICAgICAgICBsYXN0RXhlY3V0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICByZXN1bHRDb3VudDogcm93cy5sZW5ndGhcbiAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBjb2x1bW5zLFxuICAgICAgcm93cyxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIGV4ZWN1dGlvblRpbWU6IE1hdGgucmFuZG9tKCkgKiAwLjUgKyAwLjEsXG4gICAgICAgIHJvd0NvdW50OiByb3dzLmxlbmd0aCxcbiAgICAgICAgdG90YWxQYWdlczogMVxuICAgICAgfSxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGlkOiBxdWVyeS5pZCxcbiAgICAgICAgbmFtZTogcXVlcnkubmFtZSxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiBxdWVyeS5kYXRhU291cmNlSWRcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIwN1x1NjM2Mlx1NjdFNVx1OEJFMlx1NjUzNlx1ODVDRlx1NzJCNlx1NjAwMVxuICAgKi9cbiAgYXN5bmMgdG9nZ2xlRmF2b3JpdGUoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMDdcdTYzNjJcdTY1MzZcdTg1Q0ZcdTcyQjZcdTYwMDFcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAuLi5tb2NrUXVlcmllc1tpbmRleF0sXG4gICAgICBpc0Zhdm9yaXRlOiAhbW9ja1F1ZXJpZXNbaW5kZXhdLmlzRmF2b3JpdGUsXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIG1vY2tRdWVyaWVzW2luZGV4XTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUzODZcdTUzRjJcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJ5SGlzdG9yeShwYXJhbXM/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3Qgc2l6ZSA9IHBhcmFtcz8uc2l6ZSB8fCAxMDtcbiAgICBcbiAgICAvLyBcdTc1MUZcdTYyMTBcdTZBMjFcdTYyREZcdTUzODZcdTUzRjJcdThCQjBcdTVGNTVcbiAgICBjb25zdCB0b3RhbEl0ZW1zID0gMjA7XG4gICAgY29uc3QgaGlzdG9yaWVzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogdG90YWxJdGVtcyB9LCAoXywgaSkgPT4ge1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiAzNjAwMDAwKS50b0lTT1N0cmluZygpO1xuICAgICAgY29uc3QgcXVlcnlJbmRleCA9IGkgJSBtb2NrUXVlcmllcy5sZW5ndGg7XG4gICAgICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBgaGlzdC0ke2kgKyAxfWAsXG4gICAgICAgIHF1ZXJ5SWQ6IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdLmlkLFxuICAgICAgICBxdWVyeU5hbWU6IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdLm5hbWUsXG4gICAgICAgIGV4ZWN1dGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgICAgZXhlY3V0aW9uVGltZTogTWF0aC5yYW5kb20oKSAqIDAuNSArIDAuMSxcbiAgICAgICAgcm93Q291bnQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkgKyAxLFxuICAgICAgICB1c2VySWQ6ICd1c2VyMScsXG4gICAgICAgIHVzZXJOYW1lOiAnXHU2RDRCXHU4QkQ1XHU3NTI4XHU2MjM3JyxcbiAgICAgICAgc3RhdHVzOiBpICUgOCA9PT0gMCA/ICdGQUlMRUQnIDogJ1NVQ0NFU1MnLFxuICAgICAgICBlcnJvck1lc3NhZ2U6IGkgJSA4ID09PSAwID8gJ1x1NjdFNVx1OEJFMlx1NjI2N1x1ODg0Q1x1OEQ4NVx1NjVGNicgOiBudWxsXG4gICAgICB9O1xuICAgIH0pO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCB0b3RhbEl0ZW1zKTtcbiAgICBjb25zdCBwYWdpbmF0ZWRJdGVtcyA9IGhpc3Rvcmllcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICBcbiAgICAvLyBcdThGRDRcdTU2REVcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IHBhZ2luYXRlZEl0ZW1zLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICB0b3RhbDogdG90YWxJdGVtcyxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsSXRlbXMgLyBzaXplKVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XG4gICAqL1xuICBhc3luYyBnZXRRdWVyeVZlcnNpb25zKHF1ZXJ5SWQ6IHN0cmluZywgcGFyYW1zPzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgcXVlcnkgPSBtb2NrUXVlcmllcy5maW5kKHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgXG4gICAgaWYgKCFxdWVyeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7cXVlcnlJZH1cdTc2ODRcdTY3RTVcdThCRTJgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU3MjQ4XHU2NzJDXHU1MjE3XHU4ODY4XG4gICAgcmV0dXJuIHF1ZXJ5LnZlcnNpb25zIHx8IFtdO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgY3JlYXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU2N0U1XHU4QkUyXG4gICAgY29uc3QgaW5kZXggPSBtb2NrUXVlcmllcy5maW5kSW5kZXgocSA9PiBxLmlkID09PSBxdWVyeUlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTcyNDhcdTY3MkNcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzW2luZGV4XTtcbiAgICBjb25zdCBuZXdWZXJzaW9uTnVtYmVyID0gKHF1ZXJ5LnZlcnNpb25zPy5sZW5ndGggfHwgMCkgKyAxO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICBjb25zdCBuZXdWZXJzaW9uID0ge1xuICAgICAgaWQ6IGB2ZXItJHtxdWVyeUlkfS0ke25ld1ZlcnNpb25OdW1iZXJ9YCxcbiAgICAgIHF1ZXJ5SWQsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiBuZXdWZXJzaW9uTnVtYmVyLFxuICAgICAgbmFtZTogZGF0YS5uYW1lIHx8IGBcdTcyNDhcdTY3MkMgJHtuZXdWZXJzaW9uTnVtYmVyfWAsXG4gICAgICBzcWw6IGRhdGEuc3FsIHx8IHF1ZXJ5LnF1ZXJ5VGV4dCB8fCAnJyxcbiAgICAgIGRhdGFTb3VyY2VJZDogZGF0YS5kYXRhU291cmNlSWQgfHwgcXVlcnkuZGF0YVNvdXJjZUlkLFxuICAgICAgc3RhdHVzOiAnRFJBRlQnLFxuICAgICAgaXNMYXRlc3Q6IHRydWUsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU0RTRCXHU1MjREXHU3MjQ4XHU2NzJDXHU3Njg0aXNMYXRlc3RcdTY4MDdcdTVGRDdcbiAgICBpZiAocXVlcnkudmVyc2lvbnMgJiYgcXVlcnkudmVyc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgcXVlcnkudmVyc2lvbnMgPSBxdWVyeS52ZXJzaW9ucy5tYXAodiA9PiAoe1xuICAgICAgICAuLi52LFxuICAgICAgICBpc0xhdGVzdDogZmFsc2VcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU2NUIwXHU3MjQ4XHU2NzJDXG4gICAgaWYgKCFxdWVyeS52ZXJzaW9ucykge1xuICAgICAgcXVlcnkudmVyc2lvbnMgPSBbXTtcbiAgICB9XG4gICAgcXVlcnkudmVyc2lvbnMucHVzaChuZXdWZXJzaW9uKTtcbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTVGNTNcdTUyNERcdTcyNDhcdTY3MkNcbiAgICBtb2NrUXVlcmllc1tpbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIGN1cnJlbnRWZXJzaW9uOiBuZXdWZXJzaW9uLFxuICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXBcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBuZXdWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NTNEMVx1NUUwM1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgcHVibGlzaFF1ZXJ5VmVyc2lvbih2ZXJzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NTMwNVx1NTQyQlx1NkI2NFx1NzI0OFx1NjcyQ1x1NzY4NFx1NjdFNVx1OEJFMlxuICAgIGxldCBxdWVyeSA9IG51bGw7XG4gICAgbGV0IHZlcnNpb25JbmRleCA9IC0xO1xuICAgIGxldCBxdWVyeUluZGV4ID0gLTE7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2NrUXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zKSB7XG4gICAgICAgIGNvbnN0IHZJbmRleCA9IG1vY2tRdWVyaWVzW2ldLnZlcnNpb25zLmZpbmRJbmRleCh2ID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgICAgIGlmICh2SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgcXVlcnkgPSBtb2NrUXVlcmllc1tpXTtcbiAgICAgICAgICB2ZXJzaW9uSW5kZXggPSB2SW5kZXg7XG4gICAgICAgICAgcXVlcnlJbmRleCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKCFxdWVyeSB8fCB2ZXJzaW9uSW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHt2ZXJzaW9uSWR9XHU3Njg0XHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NzI0OFx1NjcyQ1x1NzJCNlx1NjAwMVxuICAgIGNvbnN0IHVwZGF0ZWRWZXJzaW9uID0ge1xuICAgICAgLi4ucXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBwdWJsaXNoZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdID0gdXBkYXRlZFZlcnNpb247XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2N0U1XHU4QkUyXHU3MkI2XHU2MDAxXG4gICAgbW9ja1F1ZXJpZXNbcXVlcnlJbmRleF0gPSB7XG4gICAgICAuLi5xdWVyeSxcbiAgICAgIHN0YXR1czogJ1BVQkxJU0hFRCcsXG4gICAgICBjdXJyZW50VmVyc2lvbjogdXBkYXRlZFZlcnNpb24sXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRWZXJzaW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NUU5Rlx1NUYwM1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICAgKi9cbiAgYXN5bmMgZGVwcmVjYXRlUXVlcnlWZXJzaW9uKHZlcnNpb25JZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU1MzA1XHU1NDJCXHU2QjY0XHU3MjQ4XHU2NzJDXHU3Njg0XHU2N0U1XHU4QkUyXG4gICAgbGV0IHF1ZXJ5ID0gbnVsbDtcbiAgICBsZXQgdmVyc2lvbkluZGV4ID0gLTE7XG4gICAgbGV0IHF1ZXJ5SW5kZXggPSAtMTtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vY2tRdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMpIHtcbiAgICAgICAgY29uc3QgdkluZGV4ID0gbW9ja1F1ZXJpZXNbaV0udmVyc2lvbnMuZmluZEluZGV4KHYgPT4gdi5pZCA9PT0gdmVyc2lvbklkKTtcbiAgICAgICAgaWYgKHZJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBxdWVyeSA9IG1vY2tRdWVyaWVzW2ldO1xuICAgICAgICAgIHZlcnNpb25JbmRleCA9IHZJbmRleDtcbiAgICAgICAgICBxdWVyeUluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoIXF1ZXJ5IHx8IHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU3MjQ4XHU2NzJDXHU3MkI2XHU2MDAxXG4gICAgY29uc3QgdXBkYXRlZFZlcnNpb24gPSB7XG4gICAgICAuLi5xdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdLFxuICAgICAgc3RhdHVzOiAnREVQUkVDQVRFRCcsXG4gICAgICBkZXByZWNhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgcXVlcnkudmVyc2lvbnNbdmVyc2lvbkluZGV4XSA9IHVwZGF0ZWRWZXJzaW9uO1xuICAgIFxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NUU5Rlx1NUYwM1x1NzY4NFx1NjYyRlx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1x1RkYwQ1x1NTIxOVx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NzJCNlx1NjAwMVxuICAgIGlmIChxdWVyeS5jdXJyZW50VmVyc2lvbiAmJiBxdWVyeS5jdXJyZW50VmVyc2lvbi5pZCA9PT0gdmVyc2lvbklkKSB7XG4gICAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgICAgLi4ucXVlcnksXG4gICAgICAgIHN0YXR1czogJ0RFUFJFQ0FURUQnLFxuICAgICAgICBjdXJyZW50VmVyc2lvbjogdXBkYXRlZFZlcnNpb24sXG4gICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2NrUXVlcmllc1txdWVyeUluZGV4XSA9IHtcbiAgICAgICAgLi4ucXVlcnksXG4gICAgICAgIHZlcnNpb25zOiBxdWVyeS52ZXJzaW9ucyxcbiAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB1cGRhdGVkVmVyc2lvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTZGQzBcdTZEM0JcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgICovXG4gIGFzeW5jIGFjdGl2YXRlUXVlcnlWZXJzaW9uKHF1ZXJ5SWQ6IHN0cmluZywgdmVyc2lvbklkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTY3RTVcdThCRTJcbiAgICBjb25zdCBxdWVyeUluZGV4ID0gbW9ja1F1ZXJpZXMuZmluZEluZGV4KHEgPT4gcS5pZCA9PT0gcXVlcnlJZCk7XG4gICAgXG4gICAgaWYgKHF1ZXJ5SW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtxdWVyeUlkfVx1NzY4NFx1NjdFNVx1OEJFMmApO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBxdWVyeSA9IG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1NzI0OFx1NjcyQ1xuICAgIGlmICghcXVlcnkudmVyc2lvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2N0U1XHU4QkUyICR7cXVlcnlJZH0gXHU2Q0ExXHU2NzA5XHU3MjQ4XHU2NzJDYCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHZlcnNpb25JbmRleCA9IHF1ZXJ5LnZlcnNpb25zLmZpbmRJbmRleCh2ID0+IHYuaWQgPT09IHZlcnNpb25JZCk7XG4gICAgXG4gICAgaWYgKHZlcnNpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke3ZlcnNpb25JZH1cdTc2ODRcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU4OTgxXHU2RkMwXHU2RDNCXHU3Njg0XHU3MjQ4XHU2NzJDXG4gICAgY29uc3QgdmVyc2lvblRvQWN0aXZhdGUgPSBxdWVyeS52ZXJzaW9uc1t2ZXJzaW9uSW5kZXhdO1xuICAgIFxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NUY1M1x1NTI0RFx1NzI0OFx1NjcyQ1x1NTQ4Q1x1NjdFNVx1OEJFMlx1NzJCNlx1NjAwMVxuICAgIG1vY2tRdWVyaWVzW3F1ZXJ5SW5kZXhdID0ge1xuICAgICAgLi4ucXVlcnksXG4gICAgICBjdXJyZW50VmVyc2lvbjogdmVyc2lvblRvQWN0aXZhdGUsXG4gICAgICBzdGF0dXM6IHZlcnNpb25Ub0FjdGl2YXRlLnN0YXR1cyxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdmVyc2lvblRvQWN0aXZhdGU7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHF1ZXJ5U2VydmljZTsgIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svZGF0YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvaW50ZWdyYXRpb24udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2RhdGEvaW50ZWdyYXRpb24udHNcIjsvKipcbiAqIFx1OTZDNlx1NjIxMFx1NjcwRFx1NTJBMU1vY2tcdTY1NzBcdTYzNkVcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU5NkM2XHU2MjEwQVBJXHU3Njg0XHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gKi9cblxuLy8gXHU2QTIxXHU2MkRGXHU5NkM2XHU2MjEwXG5leHBvcnQgY29uc3QgbW9ja0ludGVncmF0aW9ucyA9IFtcbiAge1xuICAgIGlkOiAnaW50ZWdyYXRpb24tMScsXG4gICAgbmFtZTogJ1x1NzkzQVx1NEY4QlJFU1QgQVBJJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NzkzQVx1NEY4QlJFU1QgQVBJXHU2NzBEXHU1MkExJyxcbiAgICB0eXBlOiAnUkVTVCcsXG4gICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tL3YxJyxcbiAgICBhdXRoVHlwZTogJ0JBU0lDJyxcbiAgICB1c2VybmFtZTogJ2FwaV91c2VyJyxcbiAgICBwYXNzd29yZDogJyoqKioqKioqJyxcbiAgICBzdGF0dXM6ICdBQ1RJVkUnLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gODY0MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIGVuZHBvaW50czogW1xuICAgICAge1xuICAgICAgICBpZDogJ2VuZHBvaW50LTEnLFxuICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU3NTI4XHU2MjM3XHU1MjE3XHU4ODY4JyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy91c2VycycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MjQwXHU2NzA5XHU3NTI4XHU2MjM3XHU3Njg0XHU1MjE3XHU4ODY4J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC0yJyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NzUyOFx1NjIzNycsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvdXNlcnMve2lkfScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2ODM5XHU2MzZFSURcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTc1MjhcdTYyMzcnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgaWQ6ICdpbnRlZ3JhdGlvbi0yJyxcbiAgICBuYW1lOiAnXHU1OTI5XHU2QzE0QVBJJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNUFQSScsXG4gICAgdHlwZTogJ1JFU1QnLFxuICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS53ZWF0aGVyLmNvbScsXG4gICAgYXV0aFR5cGU6ICdBUElfS0VZJyxcbiAgICBhcGlLZXk6ICcqKioqKioqKicsXG4gICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDAwKS50b0lTT1N0cmluZygpLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDQzMjAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICBlbmRwb2ludHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC0zJyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NTkyOVx1NkMxNCcsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvY3VycmVudCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MzA3XHU1QjlBXHU0RjREXHU3RjZFXHU3Njg0XHU1RjUzXHU1MjREXHU1OTI5XHU2QzE0J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC00JyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNScsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvZm9yZWNhc3QnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjcyQVx1Njc2NTdcdTU5MjlcdTc2ODRcdTU5MjlcdTZDMTRcdTk4ODRcdTYyQTUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgaWQ6ICdpbnRlZ3JhdGlvbi0zJyxcbiAgICBuYW1lOiAnXHU2NTJGXHU0RUQ4XHU3RjUxXHU1MTczJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZERVx1NjNBNVx1NTIzMFx1NjUyRlx1NEVEOFx1NTkwNFx1NzQwNkFQSScsXG4gICAgdHlwZTogJ1JFU1QnLFxuICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS5wYXltZW50LmNvbScsXG4gICAgYXV0aFR5cGU6ICdPQVVUSDInLFxuICAgIGNsaWVudElkOiAnY2xpZW50MTIzJyxcbiAgICBjbGllbnRTZWNyZXQ6ICcqKioqKioqKicsXG4gICAgc3RhdHVzOiAnSU5BQ1RJVkUnLFxuICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxNzI4MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgZW5kcG9pbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnZW5kcG9pbnQtNScsXG4gICAgICAgIG5hbWU6ICdcdTUyMUJcdTVFRkFcdTY1MkZcdTRFRDgnLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgcGF0aDogJy9wYXltZW50cycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU1MjFCXHU1RUZBXHU2NUIwXHU3Njg0XHU2NTJGXHU0RUQ4XHU4QkY3XHU2QzQyJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC02JyxcbiAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NjUyRlx1NEVEOFx1NzJCNlx1NjAwMScsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHBhdGg6ICcvcGF5bWVudHMve2lkfScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2OEMwXHU2N0U1XHU2NTJGXHU0RUQ4XHU3MkI2XHU2MDAxJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlbmRwb2ludC03JyxcbiAgICAgICAgbmFtZTogJ1x1OTAwMFx1NkIzRScsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0vcmVmdW5kJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTU5MDRcdTc0MDZcdTkwMDBcdTZCM0VcdThCRjdcdTZDNDInXG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xuXG4vLyBcdTkxQ0RcdTdGNkVcdTk2QzZcdTYyMTBcdTY1NzBcdTYzNkVcbmV4cG9ydCBmdW5jdGlvbiByZXNldEludGVncmF0aW9ucygpOiB2b2lkIHtcbiAgLy8gXHU0RkREXHU3NTU5XHU1RjE1XHU3NTI4XHVGRjBDXHU1M0VBXHU5MUNEXHU3RjZFXHU1MTg1XHU1QkI5XG4gIHdoaWxlIChtb2NrSW50ZWdyYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICBtb2NrSW50ZWdyYXRpb25zLnBvcCgpO1xuICB9XG4gIFxuICAvLyBcdTkxQ0RcdTY1QjBcdTc1MUZcdTYyMTBcdTk2QzZcdTYyMTBcdTY1NzBcdTYzNkVcbiAgW1xuICAgIHtcbiAgICAgIGlkOiAnaW50ZWdyYXRpb24tMScsXG4gICAgICBuYW1lOiAnXHU3OTNBXHU0RjhCUkVTVCBBUEknLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTc5M0FcdTRGOEJSRVNUIEFQSVx1NjcwRFx1NTJBMScsXG4gICAgICB0eXBlOiAnUkVTVCcsXG4gICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20vdjEnLFxuICAgICAgYXV0aFR5cGU6ICdCQVNJQycsXG4gICAgICB1c2VybmFtZTogJ2FwaV91c2VyJyxcbiAgICAgIHBhc3N3b3JkOiAnKioqKioqKionLFxuICAgICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDI1OTIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA4NjQwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmRwb2ludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtMScsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NzUyOFx1NjIzN1x1NTIxN1x1ODg2OCcsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL3VzZXJzJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1ODNCN1x1NTNENlx1NjI0MFx1NjcwOVx1NzUyOFx1NjIzN1x1NzY4NFx1NTIxN1x1ODg2OCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtMicsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NzUyOFx1NjIzNycsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL3VzZXJzL3tpZH0nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2ODM5XHU2MzZFSURcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTc1MjhcdTYyMzcnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnaW50ZWdyYXRpb24tMicsXG4gICAgICBuYW1lOiAnXHU1OTI5XHU2QzE0QVBJJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4RkRFXHU2M0E1XHU1MjMwXHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1QVBJJyxcbiAgICAgIHR5cGU6ICdSRVNUJyxcbiAgICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS53ZWF0aGVyLmNvbScsXG4gICAgICBhdXRoVHlwZTogJ0FQSV9LRVknLFxuICAgICAgYXBpS2V5OiAnKioqKioqKionLFxuICAgICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSA0MzIwMDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmRwb2ludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtMycsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NTkyOVx1NkMxNCcsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL2N1cnJlbnQnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2MzA3XHU1QjlBXHU0RjREXHU3RjZFXHU3Njg0XHU1RjUzXHU1MjREXHU1OTI5XHU2QzE0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC00JyxcbiAgICAgICAgICBuYW1lOiAnXHU4M0I3XHU1M0Q2XHU1OTI5XHU2QzE0XHU5ODg0XHU2MkE1JyxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHBhdGg6ICcvZm9yZWNhc3QnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU4M0I3XHU1M0Q2XHU2NzJBXHU2NzY1N1x1NTkyOVx1NzY4NFx1NTkyOVx1NkMxNFx1OTg4NFx1NjJBNSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdpbnRlZ3JhdGlvbi0zJyxcbiAgICAgIG5hbWU6ICdcdTY1MkZcdTRFRDhcdTdGNTFcdTUxNzMnLFxuICAgICAgZGVzY3JpcHRpb246ICdcdThGREVcdTYzQTVcdTUyMzBcdTY1MkZcdTRFRDhcdTU5MDRcdTc0MDZBUEknLFxuICAgICAgdHlwZTogJ1JFU1QnLFxuICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLnBheW1lbnQuY29tJyxcbiAgICAgIGF1dGhUeXBlOiAnT0FVVEgyJyxcbiAgICAgIGNsaWVudElkOiAnY2xpZW50MTIzJyxcbiAgICAgIGNsaWVudFNlY3JldDogJyoqKioqKioqJyxcbiAgICAgIHN0YXR1czogJ0lOQUNUSVZFJyxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDg2NDAwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDE3MjgwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZHBvaW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC01JyxcbiAgICAgICAgICBuYW1lOiAnXHU1MjFCXHU1RUZBXHU2NTJGXHU0RUQ4JyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBwYXRoOiAnL3BheW1lbnRzJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NFx1NjUyRlx1NEVEOFx1OEJGN1x1NkM0MidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZW5kcG9pbnQtNicsXG4gICAgICAgICAgbmFtZTogJ1x1ODNCN1x1NTNENlx1NjUyRlx1NEVEOFx1NzJCNlx1NjAwMScsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2OEMwXHU2N0U1XHU2NTJGXHU0RUQ4XHU3MkI2XHU2MDAxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdlbmRwb2ludC03JyxcbiAgICAgICAgICBuYW1lOiAnXHU5MDAwXHU2QjNFJyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBwYXRoOiAnL3BheW1lbnRzL3tpZH0vcmVmdW5kJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTkwNFx1NzQwNlx1OTAwMFx1NkIzRVx1OEJGN1x1NkM0MidcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXS5mb3JFYWNoKGl0ZW0gPT4gbW9ja0ludGVncmF0aW9ucy5wdXNoKGl0ZW0pKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbW9ja0ludGVncmF0aW9uczsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2ludGVncmF0aW9uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbnRlZ3JhdGlvbi50c1wiOy8qKlxuICogXHU5NkM2XHU2MjEwTW9ja1x1NjcwRFx1NTJBMVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTk2QzZcdTYyMTBcdTc2RjhcdTUxNzNBUElcdTc2ODRcdTZBMjFcdTYyREZcdTVCOUVcdTczQjBcbiAqL1xuXG5pbXBvcnQgeyBkZWxheSwgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLCBjcmVhdGVNb2NrUmVzcG9uc2UsIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IG1vY2tJbnRlZ3JhdGlvbnMgfSBmcm9tICcuLi9kYXRhL2ludGVncmF0aW9uJztcblxuLyoqXG4gKiBcdTZBMjFcdTYyREZcdTVFRjZcdThGREZcbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVEZWxheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVsYXlUaW1lID0gdHlwZW9mIG1vY2tDb25maWcuZGVsYXkgPT09ICdudW1iZXInID8gbW9ja0NvbmZpZy5kZWxheSA6IDMwMDtcbiAgcmV0dXJuIGRlbGF5KGRlbGF5VGltZSk7XG59XG5cbi8qKlxuICogXHU5NkM2XHU2MjEwXHU2NzBEXHU1MkExXG4gKi9cbmNvbnN0IGludGVncmF0aW9uU2VydmljZSA9IHtcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1OTZDNlx1NjIxMFx1NTIxN1x1ODg2OFxuICAgKi9cbiAgYXN5bmMgZ2V0SW50ZWdyYXRpb25zKHBhcmFtcz86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBzaXplID0gcGFyYW1zPy5zaXplIHx8IDEwO1xuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1OEZDN1x1NkVFNFxuICAgIGxldCBmaWx0ZXJlZEl0ZW1zID0gWy4uLm1vY2tJbnRlZ3JhdGlvbnNdO1xuICAgIFxuICAgIC8vIFx1NjMwOVx1NTQwRFx1NzlGMFx1OEZDN1x1NkVFNFxuICAgIGlmIChwYXJhbXM/Lm5hbWUpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSBwYXJhbXMubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGkgPT4gXG4gICAgICAgIGkubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8IFxuICAgICAgICAoaS5kZXNjcmlwdGlvbiAmJiBpLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTYzMDlcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgICBpZiAocGFyYW1zPy50eXBlKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiBpLnR5cGUgPT09IHBhcmFtcy50eXBlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2MzA5XHU3MkI2XHU2MDAxXHU4RkM3XHU2RUU0XG4gICAgaWYgKHBhcmFtcz8uc3RhdHVzKSB7XG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiBpLnN0YXR1cyA9PT0gcGFyYW1zLnN0YXR1cyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NUU5NFx1NzUyOFx1NTIwNlx1OTg3NVxuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHNpemU7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBzaXplLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCk7XG4gICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NTIwNlx1OTg3NVx1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogcGFnaW5hdGVkSXRlbXMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHRvdGFsOiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKGZpbHRlcmVkSXRlbXMubGVuZ3RoIC8gc2l6ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgZ2V0SW50ZWdyYXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgc2ltdWxhdGVEZWxheSgpO1xuICAgIFxuICAgIC8vIFx1NjdFNVx1NjI3RVx1OTZDNlx1NjIxMFxuICAgIGNvbnN0IGludGVncmF0aW9uID0gbW9ja0ludGVncmF0aW9ucy5maW5kKGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmICghaW50ZWdyYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXHU2NzJBXHU2MjdFXHU1MjMwSURcdTRFM0Eke2lkfVx1NzY4NFx1OTZDNlx1NjIxMGApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gaW50ZWdyYXRpb247XG4gIH0sXG4gIFxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU5NkM2XHU2MjEwXG4gICAqL1xuICBhc3luYyBjcmVhdGVJbnRlZ3JhdGlvbihkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTY1QjBcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBuZXdJZCA9IGBpbnRlZ3JhdGlvbi0ke0RhdGUubm93KCl9YDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgXG4gICAgY29uc3QgbmV3SW50ZWdyYXRpb24gPSB7XG4gICAgICBpZDogbmV3SWQsXG4gICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgJ1x1NjVCMFx1OTZDNlx1NjIxMCcsXG4gICAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICAgIHR5cGU6IGRhdGEudHlwZSB8fCAnUkVTVCcsXG4gICAgICBiYXNlVXJsOiBkYXRhLmJhc2VVcmwgfHwgJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tJyxcbiAgICAgIGF1dGhUeXBlOiBkYXRhLmF1dGhUeXBlIHx8ICdOT05FJyxcbiAgICAgIHN0YXR1czogJ0FDVElWRScsXG4gICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgZW5kcG9pbnRzOiBkYXRhLmVuZHBvaW50cyB8fCBbXVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2ODM5XHU2MzZFXHU4QkE0XHU4QkMxXHU3QzdCXHU1NzhCXHU2REZCXHU1MkEwXHU3NkY4XHU1RTk0XHU1QjU3XHU2QkI1XG4gICAgaWYgKGRhdGEuYXV0aFR5cGUgPT09ICdCQVNJQycpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obmV3SW50ZWdyYXRpb24sIHtcbiAgICAgICAgdXNlcm5hbWU6IGRhdGEudXNlcm5hbWUgfHwgJ3VzZXInLFxuICAgICAgICBwYXNzd29yZDogZGF0YS5wYXNzd29yZCB8fCAnKioqKioqKionXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGRhdGEuYXV0aFR5cGUgPT09ICdBUElfS0VZJykge1xuICAgICAgT2JqZWN0LmFzc2lnbihuZXdJbnRlZ3JhdGlvbiwge1xuICAgICAgICBhcGlLZXk6IGRhdGEuYXBpS2V5IHx8ICcqKioqKioqKidcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5hdXRoVHlwZSA9PT0gJ09BVVRIMicpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obmV3SW50ZWdyYXRpb24sIHtcbiAgICAgICAgY2xpZW50SWQ6IGRhdGEuY2xpZW50SWQgfHwgJ2NsaWVudCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogZGF0YS5jbGllbnRTZWNyZXQgfHwgJyoqKioqKioqJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NkRGQlx1NTJBMFx1NTIzMFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVxuICAgIG1vY2tJbnRlZ3JhdGlvbnMucHVzaChuZXdJbnRlZ3JhdGlvbik7XG4gICAgXG4gICAgcmV0dXJuIG5ld0ludGVncmF0aW9uO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NjZGNFx1NjVCMFx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgdXBkYXRlSW50ZWdyYXRpb24oaWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW5kZXggPSBtb2NrSW50ZWdyYXRpb25zLmZpbmRJbmRleChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2NTcwXHU2MzZFXG4gICAgY29uc3QgdXBkYXRlZEludGVncmF0aW9uID0ge1xuICAgICAgLi4ubW9ja0ludGVncmF0aW9uc1tpbmRleF0sXG4gICAgICAuLi5kYXRhLFxuICAgICAgaWQsIC8vIFx1Nzg2RVx1NEZERElEXHU0RTBEXHU1M0Q4XG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG4gICAgXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXG4gICAgbW9ja0ludGVncmF0aW9uc1tpbmRleF0gPSB1cGRhdGVkSW50ZWdyYXRpb247XG4gICAgXG4gICAgcmV0dXJuIHVwZGF0ZWRJbnRlZ3JhdGlvbjtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTUyMjBcdTk2NjRcdTk2QzZcdTYyMTBcbiAgICovXG4gIGFzeW5jIGRlbGV0ZUludGVncmF0aW9uKGlkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW5kZXggPSBtb2NrSW50ZWdyYXRpb25zLmZpbmRJbmRleChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU0RUNFXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU0RTJEXHU1MjIwXHU5NjY0XG4gICAgbW9ja0ludGVncmF0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIFxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBcbiAgLyoqXG4gICAqIFx1NkQ0Qlx1OEJENVx1OTZDNlx1NjIxMFxuICAgKi9cbiAgYXN5bmMgdGVzdEludGVncmF0aW9uKGlkOiBzdHJpbmcsIHBhcmFtczogYW55ID0ge30pOiBQcm9taXNlPGFueT4ge1xuICAgIGF3YWl0IHNpbXVsYXRlRGVsYXkoKTtcbiAgICBcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTk2QzZcdTYyMTBcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG1vY2tJbnRlZ3JhdGlvbnMuZmluZChpID0+IGkuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoIWludGVncmF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1NjcyQVx1NjI3RVx1NTIzMElEXHU0RTNBJHtpZH1cdTc2ODRcdTk2QzZcdTYyMTBgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU2QTIxXHU2MkRGXHU2RDRCXHU4QkQ1XHU3RUQzXHU2NzlDXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICByZXN1bHRUeXBlOiAnSlNPTicsXG4gICAgICBqc29uUmVzcG9uc2U6IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6ICdcdThGREVcdTYzQTVcdTZENEJcdThCRDVcdTYyMTBcdTUyOUYnLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIHJlc3BvbnNlVGltZTogTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwKSArIDUwLFxuICAgICAgICAgIHNlcnZlckluZm86ICdNb2NrIFNlcnZlciB2MS4wJyxcbiAgICAgICAgICBlbmRwb2ludDogcGFyYW1zLmVuZHBvaW50IHx8IGludGVncmF0aW9uLmVuZHBvaW50c1swXT8ucGF0aCB8fCAnLydcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogQXJyYXkuZnJvbSh7IGxlbmd0aDogMyB9LCAoXywgaSkgPT4gKHtcbiAgICAgICAgICBpZDogaSArIDEsXG4gICAgICAgICAgbmFtZTogYFx1NjgzN1x1NjcyQ1x1NjU3MFx1NjM2RSAke2kgKyAxfWAsXG4gICAgICAgICAgdmFsdWU6IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDApIC8gMTBcbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8qKlxuICAgKiBcdTYyNjdcdTg4NENcdTk2QzZcdTYyMTBcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVRdWVyeShpZDogc3RyaW5nLCBwYXJhbXM6IGFueSA9IHt9KTogUHJvbWlzZTxhbnk+IHtcbiAgICBhd2FpdCBzaW11bGF0ZURlbGF5KCk7XG4gICAgXG4gICAgLy8gXHU2N0U1XHU2MjdFXHU5NkM2XHU2MjEwXG4gICAgY29uc3QgaW50ZWdyYXRpb24gPSBtb2NrSW50ZWdyYXRpb25zLmZpbmQoaSA9PiBpLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKCFpbnRlZ3JhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcdTY3MkFcdTYyN0VcdTUyMzBJRFx1NEUzQSR7aWR9XHU3Njg0XHU5NkM2XHU2MjEwYCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OEZENFx1NTZERVx1NkEyMVx1NjJERlx1NjI2N1x1ODg0Q1x1N0VEM1x1Njc5Q1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgcmVzdWx0VHlwZTogJ0pTT04nLFxuICAgICAganNvblJlc3BvbnNlOiB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgcXVlcnk6IHBhcmFtcy5xdWVyeSB8fCAnXHU5RUQ4XHU4QkE0XHU2N0U1XHU4QkUyJyxcbiAgICAgICAgZGF0YTogQXJyYXkuZnJvbSh7IGxlbmd0aDogNSB9LCAoXywgaSkgPT4gKHtcbiAgICAgICAgICBpZDogYHJlY29yZC0ke2kgKyAxfWAsXG4gICAgICAgICAgbmFtZTogYFx1OEJCMFx1NUY1NSAke2kgKyAxfWAsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTY3RTVcdThCRTJcdThGRDRcdTU2REVcdTc2ODRcdThCQjBcdTVGNTUgJHtpICsgMX1gLFxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGkgKiA4NjQwMDAwMCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICB0eXBlOiBpICUgMiA9PT0gMCA/ICdBJyA6ICdCJyxcbiAgICAgICAgICAgIHZhbHVlOiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDApLFxuICAgICAgICAgICAgYWN0aXZlOiBpICUgMyAhPT0gMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgXG4gIC8vIFx1NTE3Q1x1NUJCOVx1NjVFN1x1NzY4NFx1NjNBNVx1NTNFMywgXHU3NkY0XHU2M0E1XHU4QzAzXHU3NTI4XHU2NUIwXHU3Njg0XHU1QjlFXHU3M0IwXG4gIGFzeW5jIGdldE1vY2tJbnRlZ3JhdGlvbnMoKTogUHJvbWlzZTxhbnlbXT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5nZXRJbnRlZ3JhdGlvbnMoe30pO1xuICAgIHJldHVybiByZXN1bHQuaXRlbXM7XG4gIH0sXG4gIFxuICBhc3luYyBnZXRNb2NrSW50ZWdyYXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgbnVsbD4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5nZXRJbnRlZ3JhdGlvbihpZCk7XG4gICAgICByZXR1cm4gaW50ZWdyYXRpb247XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1x1ODNCN1x1NTNENlx1OTZDNlx1NjIxMFx1NTkzMVx1OEQyNTonLCBlcnJvcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sXG4gIFxuICBhc3luYyBjcmVhdGVNb2NrSW50ZWdyYXRpb24oZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gaW50ZWdyYXRpb25TZXJ2aWNlLmNyZWF0ZUludGVncmF0aW9uKGRhdGEpO1xuICB9LFxuICBcbiAgYXN5bmMgdXBkYXRlTW9ja0ludGVncmF0aW9uKGlkOiBzdHJpbmcsIHVwZGF0ZXM6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIGludGVncmF0aW9uU2VydmljZS51cGRhdGVJbnRlZ3JhdGlvbihpZCwgdXBkYXRlcyk7XG4gIH0sXG4gIFxuICBhc3luYyBkZWxldGVNb2NrSW50ZWdyYXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmRlbGV0ZUludGVncmF0aW9uKGlkKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignXHU1MjIwXHU5NjY0XHU5NkM2XHU2MjEwXHU1OTMxXHU4RDI1OicsIGVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG4gIFxuICBhc3luYyBleGVjdXRlTW9ja1F1ZXJ5KGludGVncmF0aW9uSWQ6IHN0cmluZywgcXVlcnk6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5leGVjdXRlUXVlcnkoaW50ZWdyYXRpb25JZCwgcXVlcnkpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgZGF0YTogcmVzdWx0Lmpzb25SZXNwb25zZS5kYXRhXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdcdTYyNjdcdTg4NENcdTY3RTVcdThCRTJcdTU5MzFcdThEMjU6JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcilcbiAgICAgIH07XG4gICAgfVxuICB9XG59O1xuXG4vLyBcdTZERkJcdTUyQTBcdTUxN0NcdTVCQjlcdTY1RTdBUElcdTc2ODRcdTVCRkNcdTUxRkFcbmV4cG9ydCBjb25zdCBnZXRNb2NrSW50ZWdyYXRpb25zID0gaW50ZWdyYXRpb25TZXJ2aWNlLmdldE1vY2tJbnRlZ3JhdGlvbnM7XG5leHBvcnQgY29uc3QgZ2V0TW9ja0ludGVncmF0aW9uID0gaW50ZWdyYXRpb25TZXJ2aWNlLmdldE1vY2tJbnRlZ3JhdGlvbjtcbmV4cG9ydCBjb25zdCBjcmVhdGVNb2NrSW50ZWdyYXRpb24gPSBpbnRlZ3JhdGlvblNlcnZpY2UuY3JlYXRlTW9ja0ludGVncmF0aW9uO1xuZXhwb3J0IGNvbnN0IHVwZGF0ZU1vY2tJbnRlZ3JhdGlvbiA9IGludGVncmF0aW9uU2VydmljZS51cGRhdGVNb2NrSW50ZWdyYXRpb247XG5leHBvcnQgY29uc3QgZGVsZXRlTW9ja0ludGVncmF0aW9uID0gaW50ZWdyYXRpb25TZXJ2aWNlLmRlbGV0ZU1vY2tJbnRlZ3JhdGlvbjtcbmV4cG9ydCBjb25zdCBleGVjdXRlTW9ja1F1ZXJ5ID0gaW50ZWdyYXRpb25TZXJ2aWNlLmV4ZWN1dGVNb2NrUXVlcnk7XG5cbmV4cG9ydCBkZWZhdWx0IGludGVncmF0aW9uU2VydmljZTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL3NlcnZpY2VzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9zZXJ2aWNlcy9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTZDNlx1NEUyRFx1NUJGQ1x1NTFGQVxuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRBUEkgTW9ja1x1NjcwRFx1NTJBMVx1NTE2NVx1NTNFM1x1NzBCOVxuICovXG5cbi8vIFx1NUJGQ1x1NTE2NVx1NjU3MFx1NjM2RVx1NkU5MFx1NjcwRFx1NTJBMVxuaW1wb3J0IGRhdGFTb3VyY2UgZnJvbSAnLi9kYXRhc291cmNlJztcbi8vIFx1NUJGQ1x1NTE2NVx1NUI4Q1x1NjU3NFx1NzY4NFx1NjdFNVx1OEJFMlx1NjcwRFx1NTJBMVx1NUI5RVx1NzNCMFxuaW1wb3J0IHF1ZXJ5U2VydmljZUltcGxlbWVudGF0aW9uIGZyb20gJy4vcXVlcnknO1xuLy8gXHU1QkZDXHU1MTY1XHU5NkM2XHU2MjEwXHU2NzBEXHU1MkExXG5pbXBvcnQgaW50ZWdyYXRpb25TZXJ2aWNlSW1wbGVtZW50YXRpb24gZnJvbSAnLi9pbnRlZ3JhdGlvbic7XG5cbi8vIFx1NUJGQ1x1NTE2NVx1NURFNVx1NTE3N1x1NTFGRFx1NjU3MFxuaW1wb3J0IHsgXG4gIGNyZWF0ZU1vY2tSZXNwb25zZSwgXG4gIGNyZWF0ZU1vY2tFcnJvclJlc3BvbnNlLCBcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheSBcbn0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogXHU2N0U1XHU4QkUyXHU2NzBEXHU1MkExTW9ja1xuICogQGRlcHJlY2F0ZWQgXHU0RjdGXHU3NTI4XHU0RUNFICcuL3F1ZXJ5JyBcdTVCRkNcdTUxNjVcdTc2ODRcdTVCOENcdTY1NzRcdTVCOUVcdTczQjBcdTRFRTNcdTY2RkZcbiAqL1xuY29uc3QgcXVlcnkgPSB7XG4gIC8qKlxuICAgKiBcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbiAgICovXG4gIGFzeW5jIGdldFF1ZXJpZXMocGFyYW1zOiB7IHBhZ2U6IG51bWJlcjsgc2l6ZTogbnVtYmVyOyB9KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4gY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlKHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgaWQ6ICdxMScsIG5hbWU6ICdcdTc1MjhcdTYyMzdcdTUyMDZcdTY3OTBcdTY3RTVcdThCRTInLCBkZXNjcmlwdGlvbjogJ1x1NjMwOVx1NTczMFx1NTMzQVx1N0VERlx1OEJBMVx1NzUyOFx1NjIzN1x1NkNFOFx1NTE4Q1x1NjU3MFx1NjM2RScsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICAgIHsgaWQ6ICdxMicsIG5hbWU6ICdcdTk1MDBcdTU1MkVcdTRFMUFcdTdFRTlcdTY3RTVcdThCRTInLCBkZXNjcmlwdGlvbjogJ1x1NjMwOVx1NjcwOFx1N0VERlx1OEJBMVx1OTUwMFx1NTUyRVx1OTg5RCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICAgIHsgaWQ6ICdxMycsIG5hbWU6ICdcdTVFOTNcdTVCNThcdTUyMDZcdTY3OTAnLCBkZXNjcmlwdGlvbjogJ1x1NzZEMVx1NjNBN1x1NUU5M1x1NUI1OFx1NkMzNFx1NUU3MycsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgICBdLFxuICAgICAgdG90YWw6IDMsXG4gICAgICBwYWdlOiBwYXJhbXMucGFnZSxcbiAgICAgIHNpemU6IHBhcmFtcy5zaXplXG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZ2V0UXVlcnkoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkLFxuICAgICAgbmFtZTogJ1x1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1NzkzQVx1NEY4Qlx1NjdFNVx1OEJFMicsXG4gICAgICBzcWw6ICdTRUxFQ1QgKiBGUk9NIHVzZXJzIFdIRVJFIHN0YXR1cyA9ICQxJyxcbiAgICAgIHBhcmFtZXRlcnM6IFsnYWN0aXZlJ10sXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU1MjFCXHU1RUZBXHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBjcmVhdGVRdWVyeShkYXRhOiBhbnkpIHtcbiAgICBhd2FpdCBkZWxheSgpO1xuICAgIHJldHVybiB7XG4gICAgICBpZDogYHF1ZXJ5LSR7RGF0ZS5ub3coKX1gLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBcdTY2RjRcdTY1QjBcdTY3RTVcdThCRTJcbiAgICovXG4gIGFzeW5jIHVwZGF0ZVF1ZXJ5KGlkOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGF3YWl0IGRlbGF5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogXHU1MjIwXHU5NjY0XHU2N0U1XHU4QkUyXG4gICAqL1xuICBhc3luYyBkZWxldGVRdWVyeShpZDogc3RyaW5nKSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFx1NjI2N1x1ODg0Q1x1NjdFNVx1OEJFMlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZVF1ZXJ5KGlkOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgY29sdW1uczogWydpZCcsICduYW1lJywgJ2VtYWlsJywgJ3N0YXR1cyddLFxuICAgICAgcm93czogW1xuICAgICAgICB7IGlkOiAxLCBuYW1lOiAnXHU1RjIwXHU0RTA5JywgZW1haWw6ICd6aGFuZ0BleGFtcGxlLmNvbScsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgICAgICAgeyBpZDogMiwgbmFtZTogJ1x1Njc0RVx1NTZEQicsIGVtYWlsOiAnbGlAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIG5hbWU6ICdcdTczOEJcdTRFOTQnLCBlbWFpbDogJ3dhbmdAZXhhbXBsZS5jb20nLCBzdGF0dXM6ICdpbmFjdGl2ZScgfSxcbiAgICAgIF0sXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBleGVjdXRpb25UaW1lOiAwLjIzNSxcbiAgICAgICAgcm93Q291bnQ6IDMsXG4gICAgICAgIHRvdGFsUGFnZXM6IDFcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIFx1NUJGQ1x1NTFGQVx1NjI0MFx1NjcwOVx1NjcwRFx1NTJBMVxuICovXG5jb25zdCBzZXJ2aWNlcyA9IHtcbiAgZGF0YVNvdXJjZSxcbiAgcXVlcnk6IHF1ZXJ5U2VydmljZUltcGxlbWVudGF0aW9uLFxuICBpbnRlZ3JhdGlvbjogaW50ZWdyYXRpb25TZXJ2aWNlSW1wbGVtZW50YXRpb25cbn07XG5cbi8vIFx1NUJGQ1x1NTFGQW1vY2sgc2VydmljZVx1NURFNVx1NTE3N1xuZXhwb3J0IHtcbiAgY3JlYXRlTW9ja1Jlc3BvbnNlLFxuICBjcmVhdGVNb2NrRXJyb3JSZXNwb25zZSxcbiAgY3JlYXRlUGFnaW5hdGlvblJlc3BvbnNlLFxuICBkZWxheVxufTtcblxuLy8gXHU1QkZDXHU1MUZBXHU1NDA0XHU0RTJBXHU2NzBEXHU1MkExXG5leHBvcnQgY29uc3QgZGF0YVNvdXJjZVNlcnZpY2UgPSBzZXJ2aWNlcy5kYXRhU291cmNlO1xuZXhwb3J0IGNvbnN0IHF1ZXJ5U2VydmljZSA9IHNlcnZpY2VzLnF1ZXJ5O1xuZXhwb3J0IGNvbnN0IGludGVncmF0aW9uU2VydmljZSA9IHNlcnZpY2VzLmludGVncmF0aW9uO1xuXG4vLyBcdTlFRDhcdThCQTRcdTVCRkNcdTUxRkFcdTYyNDBcdTY3MDlcdTY3MERcdTUyQTFcbmV4cG9ydCBkZWZhdWx0IHNlcnZpY2VzOyAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1N0JBMVx1NzQwNlx1NkEyMVx1NTc1N1xuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRIVFRQXHU4QkY3XHU2QzQyXHU2MkU2XHU2MjJBXHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU3NTI4XHU0RThFXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XG4gKiBcdThEMUZcdThEMjNcdTdCQTFcdTc0MDZcdTU0OENcdTUyMDZcdTUzRDFcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTUyMzBcdTVCRjlcdTVFOTRcdTc2ODRcdTY3MERcdTUyQTFcdTU5MDRcdTc0MDZcdTUxRkRcdTY1NzBcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IEluY29taW5nTWVzc2FnZSwgU2VydmVyUmVzcG9uc2UgfSBmcm9tICdodHRwJztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IG1vY2tDb25maWcsIHNob3VsZE1vY2tSZXF1ZXN0LCBsb2dNb2NrIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU1QkZDXHU1MTY1XHU2NzBEXHU1MkExXG5pbXBvcnQgeyBkYXRhU291cmNlU2VydmljZSwgcXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMnO1xuaW1wb3J0IGludGVncmF0aW9uU2VydmljZSBmcm9tICcuLi9zZXJ2aWNlcy9pbnRlZ3JhdGlvbic7XG5cbi8vIFx1NTkwNFx1NzQwNkNPUlNcdThCRjdcdTZDNDJcbmZ1bmN0aW9uIGhhbmRsZUNvcnMocmVzOiBTZXJ2ZXJSZXNwb25zZSkge1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIE9QVElPTlMnKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycycsICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24sIFgtTW9jay1FbmFibGVkJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLU1heC1BZ2UnLCAnODY0MDAnKTtcbn1cblxuLy8gXHU1M0QxXHU5MDAxSlNPTlx1NTRDRFx1NUU5NFxuZnVuY3Rpb24gc2VuZEpzb25SZXNwb25zZShyZXM6IFNlcnZlclJlc3BvbnNlLCBzdGF0dXM6IG51bWJlciwgZGF0YTogYW55KSB7XG4gIHJlcy5zdGF0dXNDb2RlID0gc3RhdHVzO1xuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cblxuLy8gXHU1RUY2XHU4RkRGXHU2MjY3XHU4ODRDXG5mdW5jdGlvbiBkZWxheShtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuLy8gXHU4OUUzXHU2NzkwXHU4QkY3XHU2QzQyXHU0RjUzXG5hc3luYyBmdW5jdGlvbiBwYXJzZVJlcXVlc3RCb2R5KHJlcTogSW5jb21pbmdNZXNzYWdlKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IGJvZHkgPSAnJztcbiAgICByZXEub24oJ2RhdGEnLCAoY2h1bmspID0+IHtcbiAgICAgIGJvZHkgKz0gY2h1bmsudG9TdHJpbmcoKTtcbiAgICB9KTtcbiAgICByZXEub24oJ2VuZCcsICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc29sdmUoYm9keSA/IEpTT04ucGFyc2UoYm9keSkgOiB7fSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlc29sdmUoe30pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBcdTY4QzBcdTY3RTVcdTVFNzZcdTRGRUVcdTZCNjNcdThCRjdcdTZDNDJcdThERUZcdTVGODRcdUZGMENcdTU5MDRcdTc0MDZcdTUzRUZcdTgwRkRcdTVCNThcdTU3MjhcdTc2ODRcdTkxQ0RcdTU5MEQvYXBpXHU1MjREXHU3RjAwXG4gKiBAcGFyYW0gdXJsIFx1NTM5Rlx1NTlDQlx1OEJGN1x1NkM0MlVSTFxuICogQHJldHVybnMgXHU0RkVFXHU2QjYzXHU1NDBFXHU3Njg0VVJMXG4gKi9cbmNvbnN0IG5vcm1hbGl6ZUFwaVBhdGggPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAvLyBcdThCQjBcdTVGNTVcdTYyNDBcdTY3MDlcdThCRjdcdTZDNDJcdThERUZcdTVGODRcdUZGMENcdTY1QjlcdTRGQkZcdThDMDNcdThCRDVcbiAgY29uc29sZS5sb2coYFtNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XSBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdThERUZcdTVGODQ6ICR7dXJsfWApO1xuICBcbiAgLy8gXHU3OUZCXHU5NjY0VVJMXHU0RTJEXHU1M0VGXHU4MEZEXHU1QjU4XHU1NzI4XHU3Njg0XHU5MUNEXHU1OTBEXHU3Njg0L2FwaVx1NTI0RFx1N0YwMFxuICBpZiAodXJsLnN0YXJ0c1dpdGgoJy9hcGkvYXBpLycpKSB7XG4gICAgY29uc3QgZml4ZWRVcmwgPSB1cmwucmVwbGFjZSgnL2FwaS9hcGkvJywgJy9hcGkvJyk7XG4gICAgY29uc29sZS5sb2coYFtNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XSBcdTRGRUVcdTZCNjNcdTkxQ0RcdTU5MERcdTc2ODRBUElcdThERUZcdTVGODQ6ICR7dXJsfSA9PiAke2ZpeGVkVXJsfWApO1xuICAgIHJldHVybiBmaXhlZFVybDtcbiAgfVxuICBcbiAgLy8gXHU2N0U1XHU2MjdFXHU1MTc2XHU0RUQ2XHU1M0VGXHU4MEZEXHU3Njg0XHU4REVGXHU1Rjg0XHU5NUVFXHU5ODk4XG4gIGlmICh1cmwuaW5jbHVkZXMoJy8vJykpIHtcbiAgICBjb25zb2xlLndhcm4oYFtNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XSBcdTY4QzBcdTZENEJcdTUyMzBVUkxcdTRFMkRcdTY3MDlcdThGREVcdTdFRURcdTY1OUNcdTY3NjA6ICR7dXJsfWApO1xuICB9XG4gIFxuICByZXR1cm4gdXJsO1xufTtcblxuLy8gXHU1OTA0XHU3NDA2XHU2NTcwXHU2MzZFXHU2RTkwQVBJXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVEYXRhc291cmNlc0FwaShyZXE6IEluY29taW5nTWVzc2FnZSwgcmVzOiBTZXJ2ZXJSZXNwb25zZSwgdXJsUGF0aDogc3RyaW5nLCB1cmxRdWVyeTogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2Q/LnRvVXBwZXJDYXNlKCk7XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL2RhdGFzb3VyY2VzYCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NjcwRFx1NTJBMVx1NUM0Mlx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFx1RkYwQ1x1NjUyRlx1NjMwMVx1NTIwNlx1OTg3NVx1NTQ4Q1x1OEZDN1x1NkVFNFxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuZ2V0RGF0YVNvdXJjZXMoe1xuICAgICAgICBwYWdlOiBwYXJzZUludCh1cmxRdWVyeS5wYWdlIGFzIHN0cmluZykgfHwgMSxcbiAgICAgICAgc2l6ZTogcGFyc2VJbnQodXJsUXVlcnkuc2l6ZSBhcyBzdHJpbmcpIHx8IDEwLFxuICAgICAgICBuYW1lOiB1cmxRdWVyeS5uYW1lIGFzIHN0cmluZyxcbiAgICAgICAgdHlwZTogdXJsUXVlcnkudHlwZSBhcyBzdHJpbmcsXG4gICAgICAgIHN0YXR1czogdXJsUXVlcnkuc3RhdHVzIGFzIHN0cmluZ1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IHJlc3VsdC5pdGVtcywgXG4gICAgICAgIHBhZ2luYXRpb246IHJlc3VsdC5wYWdpbmF0aW9uLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDUwMCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTZFOTBcdTUyMTdcdTg4NjhcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NTM1NVx1NEUyQVx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2RhdGFzb3VyY2VzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGF0YXNvdXJjZSA9IGF3YWl0IGRhdGFTb3VyY2VTZXJ2aWNlLmdldERhdGFTb3VyY2UoaWQpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogZGF0YXNvdXJjZSxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHsgXG4gICAgICAgIGVycm9yOiAnXHU2NTcwXHU2MzZFXHU2RTkwXHU0RTBEXHU1QjU4XHU1NzI4JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZSBcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjFCXHU1RUZBXHU2NTcwXHU2MzZFXHU2RTkwXG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcycgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL2RhdGFzb3VyY2VzYCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCBuZXdEYXRhU291cmNlID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UuY3JlYXRlRGF0YVNvdXJjZShib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMSwge1xuICAgICAgICBkYXRhOiBuZXdEYXRhU291cmNlLFxuICAgICAgICBtZXNzYWdlOiAnXHU2NTcwXHU2MzZFXHU2RTkwXHU1MjFCXHU1RUZBXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTUyMUJcdTVFRkFcdTY1NzBcdTYzNkVcdTZFOTBcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2RhdGFzb3VyY2VzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UFVUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhU291cmNlID0gYXdhaXQgZGF0YVNvdXJjZVNlcnZpY2UudXBkYXRlRGF0YVNvdXJjZShpZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogdXBkYXRlZERhdGFTb3VyY2UsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTY2RjRcdTY1QjBcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NjZGNFx1NjVCMFx1NjU3MFx1NjM2RVx1NkU5MFx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU1MjIwXHU5NjY0XHU2NTcwXHU2MzZFXHU2RTkwXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvZGF0YXNvdXJjZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ0RFTEVURScpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZERUxFVEVcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkYXRhU291cmNlU2VydmljZS5kZWxldGVEYXRhU291cmNlKGlkKTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBtZXNzYWdlOiAnXHU2NTcwXHU2MzZFXHU2RTkwXHU1MjIwXHU5NjY0XHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTUyMjBcdTk2NjRcdTY1NzBcdTYzNkVcdTZFOTBcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NkQ0Qlx1OEJENVx1NjU3MFx1NjM2RVx1NkU5MFx1OEZERVx1NjNBNVxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMvdGVzdC1jb25uZWN0aW9uJyAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6IC9hcGkvZGF0YXNvdXJjZXMvdGVzdC1jb25uZWN0aW9uYCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkYXRhU291cmNlU2VydmljZS50ZXN0Q29ubmVjdGlvbihib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU2RDRCXHU4QkQ1XHU4RkRFXHU2M0E1XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1NjdFNVx1OEJFMkFQSVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUXVlcmllc0FwaShyZXE6IEluY29taW5nTWVzc2FnZSwgcmVzOiBTZXJ2ZXJSZXNwb25zZSwgdXJsUGF0aDogc3RyaW5nLCB1cmxRdWVyeTogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2Q/LnRvVXBwZXJDYXNlKCk7XG4gIFxuICAvLyBcdTY4QzBcdTY3RTVVUkxcdTY2MkZcdTU0MjZcdTUzMzlcdTkxNERcdTY3RTVcdThCRTJBUElcbiAgY29uc3QgaXNRdWVyaWVzUGF0aCA9IHVybFBhdGguaW5jbHVkZXMoJy9xdWVyaWVzJyk7XG4gIFxuICAvLyBcdTYyNTNcdTUzNzBcdTYyNDBcdTY3MDlcdTY3RTVcdThCRTJcdTc2RjhcdTUxNzNcdThCRjdcdTZDNDJcdTRFRTVcdTRGQkZcdThDMDNcdThCRDVcbiAgaWYgKGlzUXVlcmllc1BhdGgpIHtcbiAgICBjb25zb2xlLmxvZyhgW01vY2tdIFx1NjhDMFx1NkQ0Qlx1NTIzMFx1NjdFNVx1OEJFMkFQSVx1OEJGN1x1NkM0MjogJHttZXRob2R9ICR7dXJsUGF0aH1gLCB1cmxRdWVyeSk7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvcXVlcmllcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9xdWVyaWVzYCk7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTU5MDRcdTc0MDZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdThCRjdcdTZDNDIsIFx1NTNDMlx1NjU3MDonLCB1cmxRdWVyeSk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NjcwRFx1NTJBMVx1NUM0Mlx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1RkYwQ1x1NjUyRlx1NjMwMVx1NTIwNlx1OTg3NVx1NTQ4Q1x1OEZDN1x1NkVFNFxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmdldFF1ZXJpZXMoe1xuICAgICAgICBwYWdlOiBwYXJzZUludCh1cmxRdWVyeS5wYWdlIGFzIHN0cmluZykgfHwgMSxcbiAgICAgICAgc2l6ZTogcGFyc2VJbnQodXJsUXVlcnkuc2l6ZSBhcyBzdHJpbmcpIHx8IDEwLFxuICAgICAgICBuYW1lOiB1cmxRdWVyeS5uYW1lIGFzIHN0cmluZyxcbiAgICAgICAgZGF0YVNvdXJjZUlkOiB1cmxRdWVyeS5kYXRhU291cmNlSWQgYXMgc3RyaW5nLFxuICAgICAgICBzdGF0dXM6IHVybFF1ZXJ5LnN0YXR1cyBhcyBzdHJpbmcsXG4gICAgICAgIHF1ZXJ5VHlwZTogdXJsUXVlcnkucXVlcnlUeXBlIGFzIHN0cmluZyxcbiAgICAgICAgaXNGYXZvcml0ZTogdXJsUXVlcnkuaXNGYXZvcml0ZSA9PT0gJ3RydWUnXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcdTdFRDNcdTY3OUM6Jywge1xuICAgICAgICBpdGVtc0NvdW50OiByZXN1bHQuaXRlbXMubGVuZ3RoLFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvblxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU4RkQ0XHU1NkRFXHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU2NTcwXHU2MzZFXHU2ODNDXHU1RjBGOicsIHsgXG4gICAgICAgIGRhdGE6IGBBcnJheVske3Jlc3VsdC5pdGVtcy5sZW5ndGh9XWAsIFxuICAgICAgICBwYWdpbmF0aW9uOiByZXN1bHQucGFnaW5hdGlvbixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIC8vIFx1NjhDMFx1NjdFNXJlc3VsdC5pdGVtc1x1NjYyRlx1NTQyNlx1NTMwNVx1NTQyQlx1NjU3MFx1NjM2RVx1RkYwQ1x1NTk4Mlx1Njc5Q1x1NEUzQVx1N0E3QVx1NTIxOVx1NEVDRVx1NUJGQ1x1NTE2NVx1NzY4NFx1NkEyMVx1NTc1N1x1NEUyRFx1ODNCN1x1NTNENlxuICAgICAgaWYgKHJlc3VsdC5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBcdTRGN0ZcdTc1MjhcdTUyQThcdTYwMDFcdTVCRkNcdTUxNjVcdTY1QjlcdTVGMEZcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTY1NzBcdTYzNkVcdUZGMENcdTkwN0ZcdTUxNERcdTVGQUFcdTczQUZcdTRGOURcdThENTZcbiAgICAgICAgICBjb25zdCBtb2NrUXVlcnlEYXRhID0gYXdhaXQgaW1wb3J0KCcuLi9kYXRhL3F1ZXJ5Jyk7XG4gICAgICAgICAgY29uc3QgbW9ja1F1ZXJpZXMgPSBtb2NrUXVlcnlEYXRhLm1vY2tRdWVyaWVzIHx8IFtdO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmIChtb2NrUXVlcmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1NEUzQVx1N0E3QVx1RkYwQ1x1NEY3Rlx1NzUyOFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RTonLCBtb2NrUXVlcmllcy5sZW5ndGgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQodXJsUXVlcnkucGFnZSBhcyBzdHJpbmcpIHx8IDE7XG4gICAgICAgICAgICBjb25zdCBzaXplID0gcGFyc2VJbnQodXJsUXVlcnkuc2l6ZSBhcyBzdHJpbmcpIHx8IDEwO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogc2l6ZTtcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgc2l6ZSwgbW9ja1F1ZXJpZXMubGVuZ3RoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcGFnaW5hdGVkSXRlbXMgPSBtb2NrUXVlcmllcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2luYXRpb24gPSB7XG4gICAgICAgICAgICAgIHRvdGFsOiBtb2NrUXVlcmllcy5sZW5ndGgsXG4gICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgIHNpemUsXG4gICAgICAgICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbChtb2NrUXVlcmllcy5sZW5ndGggLyBzaXplKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICAgICAgICBkYXRhOiBwYWdpbmF0ZWRJdGVtcyxcbiAgICAgICAgICAgICAgcGFnaW5hdGlvbixcbiAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignW01vY2tdIFx1NUJGQ1x1NTE2NVx1NjdFNVx1OEJFMlx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NTkzMVx1OEQyNTonLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQuaXRlbXMsXG4gICAgICAgIHBhZ2luYXRpb246IHJlc3VsdC5wYWdpbmF0aW9uLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignW01vY2tdIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NTIxN1x1ODg2OFx1NTkzMVx1OEQyNTonLCBlcnJvcik7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTUzNTVcdTRFMkFcdTY3RTVcdThCRTJcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dKyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgcXVlcnkgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcnkoaWQpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiBxdWVyeSxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTY3RTVcdThCRTJcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTIxQlx1NUVGQVx1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvcXVlcmllcycgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL3F1ZXJpZXNgKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IG5ld1F1ZXJ5ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLmNyZWF0ZVF1ZXJ5KGJvZHkpO1xuICAgICAgXG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCB7XG4gICAgICAgIGRhdGE6IG5ld1F1ZXJ5LFxuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU1MjFCXHU1RUZBXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgZXJyb3I6ICdcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rJC8pICYmIG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICBjb25zdCBpZCA9IHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQVVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcGFyc2VSZXF1ZXN0Qm9keShyZXEpO1xuICAgICAgY29uc3QgdXBkYXRlZFF1ZXJ5ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLnVwZGF0ZVF1ZXJ5KGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB1cGRhdGVkUXVlcnksXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTY2RjRcdTY1QjBcdTYyMTBcdTUyOUYnLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NjZGNFx1NjVCMFx1NjdFNVx1OEJFMlx1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC9leGVjdXRlJC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgY29uc3QgaWQgPSB1cmxQYXRoLnNwbGl0KCcvJylbM107IC8vIFx1NjNEMFx1NTNENklEOiAvYXBpL3F1ZXJpZXMve2lkfS9leGVjdXRlXG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KGlkLCBib2R5KTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgIGVycm9yOiAnXHU2MjY3XHU4ODRDXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvW15cXC9dK1xcL3ZlcnNpb25zJC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgY29uc3QgcXVlcnlJZCA9IHVybFBhdGguc3BsaXQoJy8nKVszXTsgLy8gXHU2M0QwXHU1M0Q2XHU2N0U1XHU4QkUySUQ6IC9hcGkvcXVlcmllcy97aWR9L3ZlcnNpb25zXG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgXHU2N0U1XHU4QkUySUQ6ICR7cXVlcnlJZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5U2VydmljZS5jcmVhdGVRdWVyeVZlcnNpb24ocXVlcnlJZCwgYm9keSk7XG4gICAgICBcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDEsIHtcbiAgICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiAnXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXHU1MjFCXHU1RUZBXHU2MjEwXHU1MjlGJ1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTUyMUJcdTVFRkFcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTIxN1x1ODg2OFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9bXlxcL10rXFwvdmVyc2lvbnMkLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IHF1ZXJ5SWQgPSB1cmxQYXRoLnNwbGl0KCcvJylbM107IC8vIFx1NjNEMFx1NTNENlx1NjdFNVx1OEJFMklEOiAvYXBpL3F1ZXJpZXMve2lkfS92ZXJzaW9uc1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgXHU2N0U1XHU4QkUySUQ6ICR7cXVlcnlJZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgdmVyc2lvbnMgPSBhd2FpdCBxdWVyeVNlcnZpY2UuZ2V0UXVlcnlWZXJzaW9ucyhxdWVyeUlkKTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiB2ZXJzaW9ucyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHtcbiAgICAgICAgZXJyb3I6ICdcdTgzQjdcdTUzRDZcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTUyMTdcdTg4NjhcdTU5MzFcdThEMjUnLFxuICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIC8vIFx1NTNEMVx1NUUwM1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1xuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC92ZXJzaW9uc1xcL1teXFwvXStcXC9wdWJsaXNoJC8pICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgY29uc3QgdmVyc2lvbklkID0gdXJsUGF0aC5zcGxpdCgnLycpWzRdOyAvLyBcdTYzRDBcdTUzRDZcdTcyNDhcdTY3MkNJRDogL2FwaS9xdWVyaWVzL3ZlcnNpb25zL3tpZH0vcHVibGlzaFxuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBPU1RcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIFx1NzI0OFx1NjcyQ0lEOiAke3ZlcnNpb25JZH1gKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnlTZXJ2aWNlLnB1Ymxpc2hRdWVyeVZlcnNpb24odmVyc2lvbklkKTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTUzRDFcdTVFMDNcdTYyMTBcdTUyOUYnXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NTNEMVx1NUUwM1x1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgLy8gXHU2RkMwXHU2RDNCXHU2N0U1XHU4QkUyXHU3MjQ4XHU2NzJDXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1teXFwvXStcXC92ZXJzaW9uc1xcL1teXFwvXStcXC9hY3RpdmF0ZSQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IHVybFBhcnRzID0gdXJsUGF0aC5zcGxpdCgnLycpO1xuICAgIGNvbnN0IHF1ZXJ5SWQgPSB1cmxQYXJ0c1szXTsgLy8gXHU2M0QwXHU1M0Q2XHU2N0U1XHU4QkUySUQ6IC9hcGkvcXVlcmllcy97cXVlcnlJZH0vdmVyc2lvbnMve3ZlcnNpb25JZH0vYWN0aXZhdGVcbiAgICBjb25zdCB2ZXJzaW9uSWQgPSB1cmxQYXJ0c1s1XTsgLy8gXHU2M0QwXHU1M0Q2XHU3MjQ4XHU2NzJDSURcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBcdTY3RTVcdThCRTJJRDogJHtxdWVyeUlkfSwgXHU3MjQ4XHU2NzJDSUQ6ICR7dmVyc2lvbklkfWApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeVNlcnZpY2UuYWN0aXZhdGVRdWVyeVZlcnNpb24ocXVlcnlJZCwgdmVyc2lvbklkKTtcbiAgICAgIFxuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTcyNDhcdTY3MkNcdTZGQzBcdTZEM0JcdTYyMTBcdTUyOUYnXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NkZDMFx1NkQzQlx1NjdFNVx1OEJFMlx1NzI0OFx1NjcyQ1x1NTkzMVx1OEQyNScsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTk2QzZcdTYyMTBBUElcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUludGVncmF0aW9uQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcsIHVybFF1ZXJ5OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIC8vIFx1NjhDMFx1NjdFNVx1OTZDNlx1NjIxMEFQSVx1OERFRlx1NUY4NFxuICBjb25zdCBpc0xvd0NvZGVBcGlzUGF0aCA9IHVybFBhdGguaW5jbHVkZXMoJy9hcGkvbG93LWNvZGUvYXBpcycpO1xuICBcbiAgaWYgKGlzTG93Q29kZUFwaXNQYXRoKSB7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY4QzBcdTZENEJcdTUyMzBcdTk2QzZcdTYyMTBBUElcdThCRjdcdTZDNDI6JywgbWV0aG9kLCB1cmxQYXRoLCB1cmxRdWVyeSk7XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU5NkM2XHU2MjEwXHU1MjE3XHU4ODY4XG4gICAgaWYgKHVybFBhdGggPT09ICcvYXBpL2xvdy1jb2RlL2FwaXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9sb3ctY29kZS9hcGlzYCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NjcwRFx1NTJBMVx1NUM0Mlx1ODNCN1x1NTNENlx1OTZDNlx1NjIxMFx1NTIxN1x1ODg2OFxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuZ2V0SW50ZWdyYXRpb25zKHtcbiAgICAgICAgICBwYWdlOiBwYXJzZUludCh1cmxRdWVyeS5wYWdlIGFzIHN0cmluZykgfHwgMSxcbiAgICAgICAgICBzaXplOiBwYXJzZUludCh1cmxRdWVyeS5zaXplIGFzIHN0cmluZykgfHwgMTAsXG4gICAgICAgICAgbmFtZTogdXJsUXVlcnkubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgICAgdHlwZTogdXJsUXVlcnkudHlwZSBhcyBzdHJpbmcsXG4gICAgICAgICAgc3RhdHVzOiB1cmxRdWVyeS5zdGF0dXMgYXMgc3RyaW5nXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU4OTgxXHU1MTdDXHU1QkI5XHU2NUU3XHU3MjQ4XHU2ODNDXHU1RjBGXHVGRjBDXHU3NkY0XHU2M0E1XHU4RkQ0XHU1NkRFXHU2NTcwXHU3RUM0XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHJlc3VsdC5pdGVtcztcbiAgICAgICAgXG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHJlc3BvbnNlRGF0YSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICAgIGVycm9yOiAnXHU4M0I3XHU1M0Q2XHU5NkM2XHU2MjEwXHU1MjE3XHU4ODY4XHU1OTMxXHU4RDI1JyxcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU5NkM2XHU2MjEwXG4gICAgY29uc3Qgc2luZ2xlSW50ZWdyYXRpb25NYXRjaCA9IHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9sb3ctY29kZVxcL2FwaXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKHNpbmdsZUludGVncmF0aW9uTWF0Y2ggJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgICAgY29uc3QgaWQgPSBzaW5nbGVJbnRlZ3JhdGlvbk1hdGNoWzFdO1xuICAgICAgXG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS5nZXRJbnRlZ3JhdGlvbihpZCk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTc2RjRcdTYzQTVcdThGRDRcdTU2REVcdTk2QzZcdTYyMTBcdTVCRjlcdThDNjFcdUZGMENcdTRFMERcdTUzMDVcdTg4QzVcdTU3MjhkYXRhXHU0RTJEXG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIGludGVncmF0aW9uKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHsgXG4gICAgICAgICAgZXJyb3I6ICdcdTk2QzZcdTYyMTBcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZSBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU5NkM2XHU2MjEwXG4gICAgaWYgKHVybFBhdGggPT09ICcvYXBpL2xvdy1jb2RlL2FwaXMnICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAvYXBpL2xvdy1jb2RlL2FwaXNgKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgICAgY29uc3QgbmV3SW50ZWdyYXRpb24gPSBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuY3JlYXRlSW50ZWdyYXRpb24oYm9keSk7XG4gICAgICAgIFxuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAxLCBuZXdJbnRlZ3JhdGlvbik7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDAwLCB7XG4gICAgICAgICAgZXJyb3I6ICdcdTUyMUJcdTVFRkFcdTk2QzZcdTYyMTBcdTU5MzFcdThEMjUnLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTk2QzZcdTYyMTBcbiAgICBjb25zdCB1cGRhdGVJbnRlZ3JhdGlvbk1hdGNoID0gdXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2xvdy1jb2RlXFwvYXBpc1xcLyhbXlxcL10rKSQvKTtcbiAgICBpZiAodXBkYXRlSW50ZWdyYXRpb25NYXRjaCAmJiBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgICBjb25zdCBpZCA9IHVwZGF0ZUludGVncmF0aW9uTWF0Y2hbMV07XG4gICAgICBcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNlBVVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWRJbnRlZ3JhdGlvbiA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS51cGRhdGVJbnRlZ3JhdGlvbihpZCwgYm9keSk7XG4gICAgICAgIFxuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB1cGRhdGVkSW50ZWdyYXRpb24pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICAgIGVycm9yOiAnXHU2NkY0XHU2NUIwXHU5NkM2XHU2MjEwXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU1MjIwXHU5NjY0XHU5NkM2XHU2MjEwXG4gICAgY29uc3QgZGVsZXRlSW50ZWdyYXRpb25NYXRjaCA9IHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9sb3ctY29kZVxcL2FwaXNcXC8oW15cXC9dKykkLyk7XG4gICAgaWYgKGRlbGV0ZUludGVncmF0aW9uTWF0Y2ggJiYgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgICAgY29uc3QgaWQgPSBkZWxldGVJbnRlZ3JhdGlvbk1hdGNoWzFdO1xuICAgICAgXG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZERUxFVEVcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBpbnRlZ3JhdGlvblNlcnZpY2UuZGVsZXRlSW50ZWdyYXRpb24oaWQpO1xuICAgICAgICBcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICAgIG1lc3NhZ2U6ICdcdTk2QzZcdTYyMTBcdTUyMjBcdTk2NjRcdTYyMTBcdTUyOUYnLFxuICAgICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7XG4gICAgICAgICAgZXJyb3I6ICdcdTUyMjBcdTk2NjRcdTk2QzZcdTYyMTBcdTU5MzFcdThEMjUnLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTZENEJcdThCRDVcdTk2QzZcdTYyMTBcdThGREVcdTYzQTVcbiAgICBjb25zdCB0ZXN0SW50ZWdyYXRpb25NYXRjaCA9IHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9sb3ctY29kZVxcL2FwaXNcXC8oW15cXC9dKylcXC90ZXN0JC8pO1xuICAgIGlmICh0ZXN0SW50ZWdyYXRpb25NYXRjaCAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgY29uc3QgaWQgPSB0ZXN0SW50ZWdyYXRpb25NYXRjaFsxXTtcbiAgICAgIFxuICAgICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBwYXJzZVJlcXVlc3RCb2R5KHJlcSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGludGVncmF0aW9uU2VydmljZS50ZXN0SW50ZWdyYXRpb24oaWQsIGJvZHkpO1xuICAgICAgICBcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgcmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDAsIHtcbiAgICAgICAgICBlcnJvcjogJ1x1NkQ0Qlx1OEJENVx1OTZDNlx1NjIxMFx1NTkzMVx1OEQyNScsXG4gICAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjI2N1x1ODg0Q1x1OTZDNlx1NjIxMFx1NjdFNVx1OEJFMlxuICAgIGNvbnN0IGV4ZWN1dGVRdWVyeU1hdGNoID0gdXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2xvdy1jb2RlXFwvYXBpc1xcLyhbXlxcL10rKVxcL2V4ZWN1dGUkLyk7XG4gICAgaWYgKGV4ZWN1dGVRdWVyeU1hdGNoICYmIG1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICBjb25zdCBpZCA9IGV4ZWN1dGVRdWVyeU1hdGNoWzFdO1xuICAgICAgXG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHBhcnNlUmVxdWVzdEJvZHkocmVxKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaW50ZWdyYXRpb25TZXJ2aWNlLmV4ZWN1dGVRdWVyeShpZCwgYm9keSk7XG4gICAgICAgIFxuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCByZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwMCwge1xuICAgICAgICAgIGVycm9yOiAnXHU2MjY3XHU4ODRDXHU5NkM2XHU2MjEwXHU2N0U1XHU4QkUyXHU1OTMxXHU4RDI1JyxcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcbiAqIEBwYXJhbSByZXEgXHU4QkY3XHU2QzQyXHU1QkY5XHU4QzYxXG4gKiBAcGFyYW0gcmVzIFx1NTRDRFx1NUU5NFx1NUJGOVx1OEM2MVxuICogQHBhcmFtIHVybFBhdGggVVJMXHU4REVGXHU1Rjg0XG4gKiBAcGFyYW0gdXJsUXVlcnkgVVJMXHU2N0U1XHU4QkUyXHU1M0MyXHU2NTcwXHU1QkY5XHU4QzYxXHU2MjE2XHU2N0U1XHU4QkUyXHU1QjU3XHU3QjI2XHU0RTMyXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVSZXF1ZXN0KHJlcTogYW55LCByZXM6IGFueSwgdXJsUGF0aDogc3RyaW5nLCB1cmxRdWVyeTogYW55KSB7XG4gIHRyeSB7XG4gICAgLy8gXHU0RjdGXHU3NTI4bm9ybWFsaXplQXBpUGF0aFx1NEZFRVx1NkI2M1x1OERFRlx1NUY4NFxuICAgIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gbm9ybWFsaXplQXBpUGF0aCh1cmxQYXRoKTtcbiAgICBcbiAgICAvLyBcdTU5ODJcdTY3OUNcdThERUZcdTVGODRcdTRFMERcdTU0MENcdUZGMENcdTg4NjhcdTc5M0FcdTVERjJcdTRGRUVcdTZCNjNcdTkxQ0RcdTU5MERcdTc2ODQvYXBpXG4gICAgaWYgKHVybFBhdGggIT09IG5vcm1hbGl6ZWRQYXRoKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NEZFRVx1NkI2M0FQSVx1OERFRlx1NUY4NDogJHt1cmxQYXRofSA9PiAke25vcm1hbGl6ZWRQYXRofWApO1xuICAgIH1cblxuICAgIC8vIFx1NTdGQVx1NEU4RVx1NEZFRVx1NkI2M1x1NTQwRVx1NzY4NFx1OERFRlx1NUY4NFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0MlxuICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XG4gICAgXG4gICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU2NjJGXHU5NkM2XHU2MjEwQVBJIC0gXHU0RjE4XHU1MTQ4XHU1OTA0XHU3NDA2XHU0RUU1XHU5MDdGXHU1MTREXHU1MUIyXHU3QTgxXG4gICAgaWYgKG5vcm1hbGl6ZWRQYXRoLmluY2x1ZGVzKCcvbG93LWNvZGUvYXBpcycpKSB7XG4gICAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NjhDMFx1NkQ0Qlx1NTIzMFx1OTZDNlx1NjIxMEFQSVx1OEJGN1x1NkM0MjonLCByZXEubWV0aG9kLCBub3JtYWxpemVkUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgaGFuZGxlZCA9IGF3YWl0IGhhbmRsZUludGVncmF0aW9uQXBpKHJlcSwgcmVzLCBub3JtYWxpemVkUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgaWYgKGhhbmRsZWQpIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU2NjJGXHU2NTcwXHU2MzZFXHU2RTkwQVBJXG4gICAgaWYgKG5vcm1hbGl6ZWRQYXRoLmluY2x1ZGVzKCcvZGF0YXNvdXJjZXMnKSkge1xuICAgICAgaGFuZGxlZCA9IGF3YWl0IGhhbmRsZURhdGFzb3VyY2VzQXBpKHJlcSwgcmVzLCBub3JtYWxpemVkUGF0aCwgdXJsUXVlcnkpO1xuICAgICAgaWYgKGhhbmRsZWQpIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU2NjJGXHU2N0U1XHU4QkUyQVBJXG4gICAgaWYgKG5vcm1hbGl6ZWRQYXRoLmluY2x1ZGVzKCcvcXVlcmllcycpKSB7XG4gICAgICBoYW5kbGVkID0gYXdhaXQgaGFuZGxlUXVlcmllc0FwaShyZXEsIHJlcywgbm9ybWFsaXplZFBhdGgsIHVybFF1ZXJ5KTtcbiAgICAgIGlmIChoYW5kbGVkKSByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkNBMVx1NjcwOVx1ODhBQlx1NTkwNFx1NzQwNlx1RkYwQ1x1NTIxOVx1OEZENFx1NTZERTQwNFxuICAgIGlmICghaGFuZGxlZCkge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwge1xuICAgICAgICBlcnJvcjogJ1x1NjcyQVx1NjI3RVx1NTIzMFx1OEJGN1x1NkM0Mlx1NzY4NEFQSScsXG4gICAgICAgIG1lc3NhZ2U6IGBcdTY3MkFcdTYyN0VcdTUyMzBcdThERUZcdTVGODQ6ICR7bm9ybWFsaXplZFBhdGh9YCxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTW9ja10gXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU2NUY2XHU1MUZBXHU5NTE5OicsIGVycm9yKTtcbiAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7XG4gICAgICBlcnJvcjogJ1x1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NjVGNlx1NTFGQVx1OTUxOScsXG4gICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG4gICAgICBzdWNjZXNzOiBmYWxzZVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlxuICogQHJldHVybnMgVml0ZVx1NEUyRFx1OTVGNFx1NEVGNlx1NTFGRFx1NjU3MFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja01pZGRsZXdhcmUoKTogQ29ubmVjdC5OZXh0SGFuZGxlRnVuY3Rpb24ge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbW9ja01pZGRsZXdhcmUocmVxOiBDb25uZWN0LkluY29taW5nTWVzc2FnZSwgcmVzOiBTZXJ2ZXJSZXNwb25zZSwgbmV4dDogQ29ubmVjdC5OZXh0RnVuY3Rpb24pIHtcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTY3MkFcdTU0MkZcdTc1MjhNb2NrXHU2MjE2XHU4QkY3XHU2QzQyXHU0RTBEXHU5MDAyXHU1NDA4TW9ja1x1RkYwQ1x1NzZGNFx1NjNBNVx1NEYyMFx1OTAxMlx1N0VEOVx1NEUwQlx1NEUwMFx1NEUyQVx1NEUyRFx1OTVGNFx1NEVGNlxuICAgIGlmICghc2hvdWxkTW9ja1JlcXVlc3QocmVxKSkge1xuICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgdXJsID0gcGFyc2UocmVxLnVybCB8fCAnJywgdHJ1ZSk7XG4gICAgY29uc3QgdXJsUGF0aCA9IHVybC5wYXRobmFtZSB8fCAnJztcbiAgICBjb25zdCB1cmxRdWVyeSA9IHVybC5xdWVyeSB8fCB7fTtcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTY1MzZcdTUyMzBcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHt1cmxQYXRofWApO1xuICAgIFxuICAgIC8vIFx1NTkwNFx1NzQwNk9QVElPTlNcdThCRjdcdTZDNDJcbiAgICBpZiAocmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKSA9PT0gJ09QVElPTlMnKSB7XG4gICAgICBoYW5kbGVDb3JzKHJlcyk7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwNDtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU0RTNBXHU2MjQwXHU2NzA5XHU1NENEXHU1RTk0XHU2REZCXHU1MkEwQ09SU1x1NTkzNFxuICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICBcbiAgICAvLyBcdTZBMjFcdTYyREZcdTdGNTFcdTdFRENcdTVFRjZcdThGREZcbiAgICBpZiAobW9ja0NvbmZpZy5kZWxheSA+IDApIHtcbiAgICAgIGF3YWl0IGRlbGF5KG1vY2tDb25maWcuZGVsYXkpO1xuICAgIH1cbiAgICBcbiAgICB0cnkge1xuICAgICAgYXdhaXQgaGFuZGxlUmVxdWVzdChyZXEsIHJlcywgdXJsUGF0aCwgdXJsUXVlcnkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBcdTU5MDRcdTc0MDZcdTYyNDBcdTY3MDlcdTY3MkFcdTYzNTVcdTgzQjdcdTc2ODRcdTk1MTlcdThCRUZcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrXSBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTY1RjZcdTUzRDFcdTc1MUZcdTk1MTlcdThCRUY6JywgZXJyb3IpO1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDUwMCwge1xuICAgICAgICBlcnJvcjogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1OTUxOVx1OEJFRicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTW9ja01pZGRsZXdhcmU7ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCBQbHVnaW4sIENvbm5lY3QgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuaW1wb3J0IHsgY3JlYXRlU2ltcGxlTWlkZGxld2FyZSB9IGZyb20gJy4vc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgeyBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gJ2h0dHAnXG5cbi8vIFx1NUYzQVx1NTIzNlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFM1x1NTFGRFx1NjU3MFxuZnVuY3Rpb24ga2lsbFBvcnQocG9ydDogbnVtYmVyKSB7XG4gIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2OEMwXHU2N0U1XHU3QUVGXHU1M0UzICR7cG9ydH0gXHU1MzYwXHU3NTI4XHU2MEM1XHU1MUI1YCk7XG4gIHRyeSB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgIGV4ZWNTeW5jKGBuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9YCk7XG4gICAgICBleGVjU3luYyhgdGFza2tpbGwgL0YgL3BpZCAkKG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH0gfCBhd2sgJ3twcmludCAkNX0nKWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhlY1N5bmMoYGxzb2YgLWkgOiR7cG9ydH0gLXQgfCB4YXJncyBraWxsIC05YCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NURGMlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFMyAke3BvcnR9YCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NjcyQVx1ODhBQlx1NTM2MFx1NzUyOFx1NjIxNlx1NjVFMFx1NkNENVx1OTFDQVx1NjUzRWApO1xuICB9XG59XG5cbi8vIFx1NUYzQVx1NTIzNlx1NkUwNVx1NzQwNlZpdGVcdTdGMTNcdTVCNThcbmZ1bmN0aW9uIGNsZWFuVml0ZUNhY2hlKCkge1xuICBjb25zb2xlLmxvZygnW1ZpdGVdIFx1NkUwNVx1NzQwNlx1NEY5RFx1OEQ1Nlx1N0YxM1x1NUI1OCcpO1xuICBjb25zdCBjYWNoZVBhdGhzID0gW1xuICAgICcuL25vZGVfbW9kdWxlcy8udml0ZScsXG4gICAgJy4vbm9kZV9tb2R1bGVzLy52aXRlXyonLFxuICAgICcuLy52aXRlJyxcbiAgICAnLi9kaXN0JyxcbiAgICAnLi90bXAnLFxuICAgICcuLy50ZW1wJ1xuICBdO1xuICBcbiAgY2FjaGVQYXRocy5mb3JFYWNoKGNhY2hlUGF0aCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGNhY2hlUGF0aCkpIHtcbiAgICAgICAgaWYgKGZzLmxzdGF0U3luYyhjYWNoZVBhdGgpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBleGVjU3luYyhgcm0gLXJmICR7Y2FjaGVQYXRofWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLnVubGlua1N5bmMoY2FjaGVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NURGMlx1NTIyMFx1OTY2NDogJHtjYWNoZVBhdGh9YCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTY1RTBcdTZDRDVcdTUyMjBcdTk2NjQ6ICR7Y2FjaGVQYXRofWAsIGUpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIFx1NkUwNVx1NzQwNlZpdGVcdTdGMTNcdTVCNThcbmNsZWFuVml0ZUNhY2hlKCk7XG5cbi8vIFx1NUMxRFx1OEJENVx1OTFDQVx1NjUzRVx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1N0FFRlx1NTNFM1xua2lsbFBvcnQoODA4MCk7XG5cbi8vIFx1NTIxQlx1NUVGQU1vY2sgQVBJXHU2M0QyXHU0RUY2XG5mdW5jdGlvbiBjcmVhdGVNb2NrQXBpKCkge1xuICBjb25zb2xlLmxvZygnW1ZpdGVcdTkxNERcdTdGNkVdIFx1NTFDNlx1NTkwN1x1NTIxQlx1NUVGQU1vY2sgQVBJXHU2M0QyXHU0RUY2Jyk7XG4gIFxuICAvLyBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrXG4gIGNvbnN0IGlzTW9ja0VuYWJsZWQgPSBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIE1vY2sgQVBJXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU1MDNDOiBWSVRFX1VTRV9NT0NLX0FQSSA9ICR7cHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEl9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gTW9jayBBUEk6ICR7aXNNb2NrRW5hYmxlZCA/ICdcdTU0MkZcdTc1MjgnIDogJ1x1Nzk4MVx1NzUyOCd9YCk7XG4gIFxuICBjb25zdCBtb2NrQ29uZmlnID0ge1xuICAgIGRlbGF5OiAzMDAsXG4gICAgYXBpQmFzZVBhdGg6ICcvYXBpJyxcbiAgICBsb2dMZXZlbDogJ2RlYnVnJyxcbiAgICBlbmFibGVkTW9kdWxlczogWydkYXRhc291cmNlcycsICdxdWVyaWVzJywgJ3VzZXJzJywgJ3Zpc3VhbGl6YXRpb25zJ11cbiAgfTtcbiAgXG4gIGlmIChpc01vY2tFbmFibGVkKSB7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTkxNERcdTdGNkU6JywgbW9ja0NvbmZpZyk7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDE6IFx1NURGMlx1NTQyRlx1NzUyOCcpO1xuICAgIFxuICAgIC8vIFx1OEZEOVx1OTFDQ1x1OEZENFx1NTZERVx1NUI5RVx1OTY0NVx1NzY4NG1vY2tcdTYzRDJcdTRFRjZcdTVCOUVcdTczQjBcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ21vY2stYXBpJyxcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgLy8gXHU1QkZDXHU1MTY1XHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgICAgIGNvbnN0IGNyZWF0ZU1vY2tNaWRkbGV3YXJlID0gcmVxdWlyZSgnLi9zcmMvbW9jay9taWRkbGV3YXJlJykuZGVmYXVsdDtcbiAgICAgICAgY29uc3QgbWlkZGxld2FyZSA9IGNyZWF0ZU1vY2tNaWRkbGV3YXJlKG1vY2tDb25maWcpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU0RjdGXHU3NTI4XHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UobWlkZGxld2FyZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbTW9ja10gXHU0RTJEXHU5NUY0XHU0RUY2XHU1REYyXHU1MkEwXHU4RjdEJyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMTogXHU1REYyXHU3OTgxXHU3NTI4Jyk7XG4gICAgcmV0dXJuIG51bGw7IC8vIFx1Nzk4MVx1NzUyOFx1NjVGNlx1OEZENFx1NTZERW51bGxcbiAgfVxufVxuXG4vLyBcdTU3RkFcdTY3MkNcdTkxNERcdTdGNkVcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHU1MkEwXHU4RjdEXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG4gIHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID0gcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgfHwgJ2ZhbHNlJztcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrIEFQSSAtIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1OEJGQlx1NTNENlxuICBjb25zdCB1c2VNb2NrQXBpID0gcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJztcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1Nzk4MVx1NzUyOEhNUiAtIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1OEJGQlx1NTNENlxuICBjb25zdCBkaXNhYmxlSG1yID0gcHJvY2Vzcy5lbnYuVklURV9ESVNBQkxFX0hNUiA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU0RjdGXHU3NTI4XHU3QjgwXHU1MzU1XHU2RDRCXHU4QkQ1XHU2QTIxXHU2MkRGQVBJXG4gIGNvbnN0IHVzZVNpbXBsZU1vY2sgPSB0cnVlO1xuICBcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdThGRDBcdTg4NENcdTZBMjFcdTVGMEY6ICR7bW9kZX1gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBNb2NrIEFQSTogJHt1c2VNb2NrQXBpID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdTdCODBcdTUzNTVNb2NrXHU2RDRCXHU4QkQ1OiAke3VzZVNpbXBsZU1vY2sgPyAnXHU1NDJGXHU3NTI4JyA6ICdcdTc5ODFcdTc1MjgnfWApO1xuICBjb25zb2xlLmxvZyhgW1ZpdGVcdTkxNERcdTdGNkVdIEhNUjogJHtkaXNhYmxlSG1yID8gJ1x1Nzk4MVx1NzUyOCcgOiAnXHU1NDJGXHU3NTI4J31gKTtcbiAgXG4gIC8vIFx1NTIxQlx1NUVGQU1vY2tcdTYzRDJcdTRFRjZcbiAgY29uc3QgbW9ja1BsdWdpbiA9IGNyZWF0ZU1vY2tBcGkoKTtcbiAgXG4gIC8vIFx1OTE0RFx1N0Y2RVxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIC8vIFx1NkRGQlx1NTJBME1vY2tcdTYzRDJcdTRFRjZcdUZGMDhcdTU5ODJcdTY3OUNcdTU0MkZcdTc1MjhcdUZGMDlcbiAgICAgIC4uLihtb2NrUGx1Z2luID8gW21vY2tQbHVnaW5dIDogW10pLFxuICAgICAgdnVlKCksXG4gICAgXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IDgwODAsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICBvcGVuOiBmYWxzZSxcbiAgICAgIC8vIEhNUlx1OTE0RFx1N0Y2RVxuICAgICAgaG1yOiBkaXNhYmxlSG1yID8gZmFsc2UgOiB7XG4gICAgICAgIHByb3RvY29sOiAnd3MnLFxuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgICAgY2xpZW50UG9ydDogODA4MCxcbiAgICAgIH0sXG4gICAgICAvLyBcdTc5ODFcdTc1MjhcdTRFRTNcdTc0MDZcdUZGMENcdThCQTlcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTYyNDBcdTY3MDlcdThCRjdcdTZDNDJcbiAgICAgIHByb3h5OiB7fVxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIGxlc3M6IHtcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICAgIHRhcmdldDogJ2VzMjAxNScsXG4gICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgLy8gXHU1MzA1XHU1NDJCXHU1N0ZBXHU2NzJDXHU0RjlEXHU4RDU2XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgICd2dWUnLCBcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAncGluaWEnLFxuICAgICAgICAnYXhpb3MnLFxuICAgICAgICAnZGF5anMnLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUnLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL3poX0NOJ1xuICAgICAgXSxcbiAgICAgIC8vIFx1NjM5Mlx1OTY2NFx1NzI3OVx1NUI5QVx1NEY5RFx1OEQ1NlxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAvLyBcdTYzOTJcdTk2NjRcdTYzRDJcdTRFRjZcdTRFMkRcdTc2ODRcdTY3MERcdTUyQTFcdTU2NjhNb2NrXG4gICAgICAgICdzcmMvcGx1Z2lucy9zZXJ2ZXJNb2NrLnRzJyxcbiAgICAgICAgLy8gXHU2MzkyXHU5NjY0ZnNldmVudHNcdTY3MkNcdTU3MzBcdTZBMjFcdTU3NTdcdUZGMENcdTkwN0ZcdTUxNERcdTY3ODRcdTVFRkFcdTk1MTlcdThCRUZcbiAgICAgICAgJ2ZzZXZlbnRzJ1xuICAgICAgXSxcbiAgICAgIC8vIFx1Nzg2RVx1NEZERFx1NEY5RFx1OEQ1Nlx1OTg4NFx1Njc4NFx1NUVGQVx1NkI2M1x1Nzg2RVx1NUI4Q1x1NjIxMFxuICAgICAgZm9yY2U6IHRydWUsXG4gICAgfSxcbiAgICAvLyBcdTRGN0ZcdTc1MjhcdTUzNTVcdTcyRUNcdTc2ODRcdTdGMTNcdTVCNThcdTc2RUVcdTVGNTVcbiAgICBjYWNoZURpcjogJ25vZGVfbW9kdWxlcy8udml0ZV9jYWNoZScsXG4gICAgLy8gXHU5NjMyXHU2QjYyXHU1ODA2XHU2ODA4XHU2RUEyXHU1MUZBXG4gICAgZXNidWlsZDoge1xuICAgICAgbG9nT3ZlcnJpZGU6IHtcbiAgICAgICAgJ3RoaXMtaXMtdW5kZWZpbmVkLWluLWVzbSc6ICdzaWxlbnQnXG4gICAgICB9LFxuICAgIH1cbiAgfVxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9PLFNBQVMsWUFBcUI7QUFDbkMsTUFBSTtBQUVGLFFBQUksT0FBTyxZQUFZLGVBQWUsUUFBUSxLQUFLO0FBQ2pELFVBQUksUUFBUSxJQUFJLHNCQUFzQixRQUFRO0FBQzVDLGVBQU87QUFBQSxNQUNUO0FBQ0EsVUFBSSxRQUFRLElBQUksc0JBQXNCLFNBQVM7QUFDN0MsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBR0EsUUFBSSxPQUFPLGdCQUFnQixlQUFlLFlBQVksS0FBSztBQUN6RCxVQUFJLFlBQVksSUFBSSxzQkFBc0IsUUFBUTtBQUNoRCxlQUFPO0FBQUEsTUFDVDtBQUNBLFVBQUksWUFBWSxJQUFJLHNCQUFzQixTQUFTO0FBQ2pELGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFFBQUksT0FBTyxXQUFXLGVBQWUsT0FBTyxjQUFjO0FBQ3hELFlBQU0sb0JBQW9CLGFBQWEsUUFBUSxjQUFjO0FBQzdELFVBQUksc0JBQXNCLFFBQVE7QUFDaEMsZUFBTztBQUFBLE1BQ1Q7QUFDQSxVQUFJLHNCQUFzQixTQUFTO0FBQ2pDLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFVBQU0sZ0JBQ0gsT0FBTyxZQUFZ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O0FBQUEsTUFFQSxPQUFPO0FBQUEsSUFDVDtBQUFBO0FBQUEsSUFFQSxVQUFVO0FBQUE7QUFBQSxJQUVWLFNBQVM7QUFBQSxNQUNQLGFBQWE7QUFBQSxRQUNYLDRCQUE0QjtBQUFBLE1BQzlCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJkZWxheSIsICJpbml0X2RhdGFzb3VyY2UiLCAic2ltdWxhdGVEZWxheSIsICJxdWVyeV9kZWZhdWx0IiwgImluaXRfcXVlcnkiLCAic2ltdWxhdGVEZWxheSIsICJpbml0X2ludGVncmF0aW9uIiwgInF1ZXJ5U2VydmljZSIsICJpbnRlZ3JhdGlvblNlcnZpY2UiLCAiaW5pdF9kYXRhc291cmNlIiwgImluaXRfcXVlcnkiLCAiaW5pdF9pbnRlZ3JhdGlvbiIsICJxdWVyeV9kZWZhdWx0IiwgImRlbGF5IiwgInF1ZXJ5U2VydmljZSIsICJtb2NrUXVlcmllcyIsICJpbml0X2ludGVncmF0aW9uIiwgIm1vY2tDb25maWciLCAiY3JlYXRlTW9ja01pZGRsZXdhcmUiXQp9Cg==
