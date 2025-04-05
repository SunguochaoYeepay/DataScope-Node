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

// src/mock/middleware/index.ts
var MOCK_DATASOURCES = [
  { id: 1, name: "\u6570\u636E\u6E901", type: "mysql", host: "localhost", port: 3306, username: "root", database: "test_db1", status: "active" },
  { id: 2, name: "\u6570\u636E\u6E902", type: "postgres", host: "db.example.com", port: 5432, username: "admin", database: "test_db2", status: "active" },
  { id: 3, name: "\u6570\u636E\u6E903", type: "mongodb", host: "192.168.1.100", port: 27017, username: "mongodb", database: "test_db3", status: "inactive" }
];
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
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function handleDatasourcesApi(req, res, urlPath) {
  var _a;
  const method = (_a = req.method) == null ? void 0 : _a.toUpperCase();
  if (urlPath === "/api/datasources" && method === "GET") {
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: /api/datasources`);
    sendJsonResponse(res, 200, {
      data: MOCK_DATASOURCES,
      total: MOCK_DATASOURCES.length,
      success: true
    });
    return true;
  }
  if (urlPath.match(/^\/api\/datasources\/\d+$/) && method === "GET") {
    const id = parseInt(urlPath.split("/").pop() || "0");
    const datasource = MOCK_DATASOURCES.find((d) => d.id === id);
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    if (datasource) {
      sendJsonResponse(res, 200, {
        data: datasource,
        success: true
      });
    } else {
      sendJsonResponse(res, 404, {
        error: "\u6570\u636E\u6E90\u4E0D\u5B58\u5728",
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
    const query = MOCK_QUERIES.find((q) => q.id === id);
    logMock("debug", `\u5904\u7406GET\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    if (query) {
      sendJsonResponse(res, 200, {
        data: query,
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
    const query = MOCK_QUERIES.find((q) => q.id === id);
    logMock("debug", `\u5904\u7406POST\u8BF7\u6C42: ${urlPath}, ID: ${id}`);
    if (query) {
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
        await delay(mockConfig.delay);
      }
      let handled = false;
      if (!handled)
        handled = handleDatasourcesApi(req, res, urlPath);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50cyIsICJzcmMvbW9jay9jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYsIFBsdWdpbiwgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAndGFpbHdpbmRjc3MnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcbmltcG9ydCBjcmVhdGVNb2NrTWlkZGxld2FyZSBmcm9tICcuL3NyYy9tb2NrL21pZGRsZXdhcmUnXG5pbXBvcnQgeyBjcmVhdGVTaW1wbGVNaWRkbGV3YXJlIH0gZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZSdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCdcblxuLy8gXHU1RjNBXHU1MjM2XHU5MUNBXHU2NTNFXHU3QUVGXHU1M0UzXHU1MUZEXHU2NTcwXG5mdW5jdGlvbiBraWxsUG9ydChwb3J0OiBudW1iZXIpIHtcbiAgY29uc29sZS5sb2coYFtWaXRlXSBcdTY4QzBcdTY3RTVcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTUzNjBcdTc1MjhcdTYwQzVcdTUxQjVgKTtcbiAgdHJ5IHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgZXhlY1N5bmMoYG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH1gKTtcbiAgICAgIGV4ZWNTeW5jKGB0YXNra2lsbCAvRiAvcGlkICQobmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fSB8IGF3ayAne3ByaW50ICQ1fScpYCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBleGVjU3luYyhgbHNvZiAtaSA6JHtwb3J0fSAtdCB8IHhhcmdzIGtpbGwgLTlgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU1REYyXHU5MUNBXHU2NTNFXHU3QUVGXHU1M0UzICR7cG9ydH1gKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU3QUVGXHU1M0UzICR7cG9ydH0gXHU2NzJBXHU4OEFCXHU1MzYwXHU3NTI4XHU2MjE2XHU2NUUwXHU2Q0Q1XHU5MUNBXHU2NTNFYCk7XG4gIH1cbn1cblxuLy8gXHU1RjNBXHU1MjM2XHU2RTA1XHU3NDA2Vml0ZVx1N0YxM1x1NUI1OFxuZnVuY3Rpb24gY2xlYW5WaXRlQ2FjaGUoKSB7XG4gIGNvbnNvbGUubG9nKCdbVml0ZV0gXHU2RTA1XHU3NDA2XHU0RjlEXHU4RDU2XHU3RjEzXHU1QjU4Jyk7XG4gIGNvbnN0IGNhY2hlUGF0aHMgPSBbXG4gICAgJy4vbm9kZV9tb2R1bGVzLy52aXRlJyxcbiAgICAnLi9ub2RlX21vZHVsZXMvLnZpdGVfKicsXG4gICAgJy4vLnZpdGUnLFxuICAgICcuL2Rpc3QnLFxuICAgICcuL3RtcCcsXG4gICAgJy4vLnRlbXAnXG4gIF07XG4gIFxuICBjYWNoZVBhdGhzLmZvckVhY2goY2FjaGVQYXRoID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoY2FjaGVQYXRoKSkge1xuICAgICAgICBpZiAoZnMubHN0YXRTeW5jKGNhY2hlUGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgIGV4ZWNTeW5jKGBybSAtcmYgJHtjYWNoZVBhdGh9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMudW5saW5rU3luYyhjYWNoZVBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU1REYyXHU1MjIwXHU5NjY0OiAke2NhY2hlUGF0aH1gKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjVFMFx1NkNENVx1NTIyMFx1OTY2NDogJHtjYWNoZVBhdGh9YCwgZSk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gXHU2RTA1XHU3NDA2Vml0ZVx1N0YxM1x1NUI1OFxuY2xlYW5WaXRlQ2FjaGUoKTtcblxuLy8gXHU1QzFEXHU4QkQ1XHU5MUNBXHU2NTNFXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU3QUVGXHU1M0UzXG5raWxsUG9ydCg4MDgwKTtcblxuLy8gXHU1MjFCXHU1RUZBTW9jayBBUElcdTYzRDJcdTRFRjZcbmZ1bmN0aW9uIGNyZWF0ZU1vY2tBcGlQbHVnaW4odXNlTW9jazogYm9vbGVhbiwgdXNlU2ltcGxlTW9jazogYm9vbGVhbik6IFBsdWdpbiB8IG51bGwge1xuICBpZiAoIXVzZU1vY2sgJiYgIXVzZVNpbXBsZU1vY2spIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBcbiAgLy8gXHU1MkEwXHU4RjdEXHU0RTJEXHU5NUY0XHU0RUY2XG4gIGNvbnN0IG1vY2tNaWRkbGV3YXJlID0gdXNlTW9jayA/IGNyZWF0ZU1vY2tNaWRkbGV3YXJlKCkgOiBudWxsO1xuICBjb25zdCBzaW1wbGVNaWRkbGV3YXJlID0gdXNlU2ltcGxlTW9jayA/IGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUoKSA6IG51bGw7XG4gIFxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLXBsdWdpbi1tb2NrLWFwaScsXG4gICAgLy8gXHU1MTczXHU5NTJFXHU3MEI5XHVGRjFBXHU0RjdGXHU3NTI4IHByZSBcdTc4NkVcdTRGRERcdTZCNjRcdTYzRDJcdTRFRjZcdTUxNDhcdTRFOEVcdTUxODVcdTdGNkVcdTYzRDJcdTRFRjZcdTYyNjdcdTg4NENcbiAgICBlbmZvcmNlOiAncHJlJyBhcyBjb25zdCxcbiAgICAvLyBcdTU3MjhcdTY3MERcdTUyQTFcdTU2NjhcdTUyMUJcdTVFRkFcdTRFNEJcdTUyNERcdTkxNERcdTdGNkVcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAvLyBcdTY2RkZcdTYzNjJcdTUzOUZcdTU5Q0JcdThCRjdcdTZDNDJcdTU5MDRcdTc0MDZcdTU2NjhcdUZGMENcdTRGN0ZcdTYyMTFcdTRFRUNcdTc2ODRcdTRFMkRcdTk1RjRcdTRFRjZcdTUxNzdcdTY3MDlcdTY3MDBcdTlBRDhcdTRGMThcdTUxNDhcdTdFQTdcbiAgICAgIGNvbnN0IG9yaWdpbmFsSGFuZGxlciA9IHNlcnZlci5taWRkbGV3YXJlcy5oYW5kbGU7XG4gICAgICBcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy5oYW5kbGUgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1M0VBXHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aCgnL2FwaS8nKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja1x1NjNEMlx1NEVGNl0gXHU2OEMwXHU2RDRCXHU1MjMwQVBJXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsfWApO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1NEYxOFx1NTE0OFx1NTkwNFx1NzQwNlx1NzI3OVx1NUI5QVx1NkQ0Qlx1OEJENUFQSVxuICAgICAgICAgIGlmICh1c2VTaW1wbGVNb2NrICYmIHNpbXBsZU1pZGRsZXdhcmUgJiYgdXJsLnN0YXJ0c1dpdGgoJy9hcGkvdGVzdCcpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW01vY2tcdTYzRDJcdTRFRjZdIFx1NEY3Rlx1NzUyOFx1N0I4MFx1NTM1NVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNjogJHt1cmx9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFx1OEJCRVx1N0Y2RVx1NEUwMFx1NEUyQVx1NjgwN1x1OEJCMFx1RkYwQ1x1OTYzMlx1NkI2Mlx1NTE3Nlx1NEVENlx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgKHJlcSBhcyBhbnkpLl9tb2NrSGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBzaW1wbGVNaWRkbGV3YXJlKHJlcSwgcmVzLCAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZcdTUxRkFcdTk1MTk6YCwgZXJyKTtcbiAgICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIShyZXMgYXMgU2VydmVyUmVzcG9uc2UpLndyaXRhYmxlRW5kZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTU0Q0RcdTVFOTRcdTZDQTFcdTY3MDlcdTdFRDNcdTY3NUZcdUZGMENcdTdFRTdcdTdFRURcdTU5MDRcdTc0MDZcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTUxNzZcdTRFRDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgICBpZiAodXNlTW9jayAmJiBtb2NrTWlkZGxld2FyZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtNb2NrXHU2M0QyXHU0RUY2XSBcdTRGN0ZcdTc1MjhNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2OiAke3VybH1gKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU4QkJFXHU3RjZFXHU0RTAwXHU0RTJBXHU2ODA3XHU4QkIwXHVGRjBDXHU5NjMyXHU2QjYyXHU1MTc2XHU0RUQ2XHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyXG4gICAgICAgICAgICAocmVxIGFzIGFueSkuX21vY2tIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG1vY2tNaWRkbGV3YXJlKHJlcSwgcmVzLCAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtNb2NrXHU2M0QyXHU0RUY2XSBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2XHU1MUZBXHU5NTE5OmAsIGVycik7XG4gICAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEocmVzIGFzIFNlcnZlclJlc3BvbnNlKS53cml0YWJsZUVuZGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NENEXHU1RTk0XHU2Q0ExXHU2NzA5XHU3RUQzXHU2NzVGXHVGRjBDXHU3RUU3XHU3RUVEXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1NUJGOVx1NEU4RVx1OTc1RUFQSVx1OEJGN1x1NkM0Mlx1RkYwQ1x1NEY3Rlx1NzUyOFx1NTM5Rlx1NTlDQlx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgICByZXR1cm4gb3JpZ2luYWxIYW5kbGVyLmNhbGwoc2VydmVyLm1pZGRsZXdhcmVzLCByZXEsIHJlcywgbmV4dCk7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxuLy8gXHU1N0ZBXHU2NzJDXHU5MTREXHU3RjZFXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIC8vIFx1NTJBMFx1OEY3RFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxuICBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJIHx8ICdmYWxzZSc7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9jayBBUEkgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgdXNlTW9ja0FwaSA9IHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZSc7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTc5ODFcdTc1MjhITVIgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgZGlzYWJsZUhtciA9IHByb2Nlc3MuZW52LlZJVEVfRElTQUJMRV9ITVIgPT09ICd0cnVlJztcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1NEY3Rlx1NzUyOFx1N0I4MFx1NTM1NVx1NkQ0Qlx1OEJENVx1NkEyMVx1NjJERkFQSVxuICBjb25zdCB1c2VTaW1wbGVNb2NrID0gdHJ1ZTtcbiAgXG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gXHU4RkQwXHU4ODRDXHU2QTIxXHU1RjBGOiAke21vZGV9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gTW9jayBBUEk6ICR7dXNlTW9ja0FwaSA/ICdcdTU0MkZcdTc1MjgnIDogJ1x1Nzk4MVx1NzUyOCd9YCk7XG4gIGNvbnNvbGUubG9nKGBbVml0ZVx1OTE0RFx1N0Y2RV0gXHU3QjgwXHU1MzU1TW9ja1x1NkQ0Qlx1OEJENTogJHt1c2VTaW1wbGVNb2NrID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICAvLyBcdTUyMUJcdTVFRkFNb2NrXHU2M0QyXHU0RUY2XG4gIGNvbnN0IG1vY2tQbHVnaW4gPSBjcmVhdGVNb2NrQXBpUGx1Z2luKHVzZU1vY2tBcGksIHVzZVNpbXBsZU1vY2spO1xuICBcbiAgLy8gXHU5MTREXHU3RjZFXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgLy8gXHU2REZCXHU1MkEwTW9ja1x1NjNEMlx1NEVGNlx1RkYwOFx1NTk4Mlx1Njc5Q1x1NTQyRlx1NzUyOFx1RkYwOVxuICAgICAgLi4uKG1vY2tQbHVnaW4gPyBbbW9ja1BsdWdpbl0gOiBbXSksXG4gICAgICB2dWUoKSxcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogODA4MCxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgLy8gSE1SXHU5MTREXHU3RjZFXG4gICAgICBobXI6IGRpc2FibGVIbXIgPyBmYWxzZSA6IHtcbiAgICAgICAgcHJvdG9jb2w6ICd3cycsXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBjbGllbnRQb3J0OiA4MDgwLFxuICAgICAgfSxcbiAgICAgIC8vIFx1Nzk4MVx1NzUyOFx1NEVFM1x1NzQwNlx1RkYwQ1x1OEJBOVx1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNlx1NjI0MFx1NjcwOVx1OEJGN1x1NkM0MlxuICAgICAgcHJveHk6IHt9XG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzLCBhdXRvcHJlZml4ZXJdLFxuICAgICAgfSxcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgbGVzczoge1xuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAvLyBcdTUzMDVcdTU0MkJcdTU3RkFcdTY3MkNcdTRGOURcdThENTZcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ3Z1ZScsIFxuICAgICAgICAndnVlLXJvdXRlcicsXG4gICAgICAgICdwaW5pYScsXG4gICAgICAgICdheGlvcycsXG4gICAgICAgICdkYXlqcycsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZScsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZS9lcy9sb2NhbGUvemhfQ04nXG4gICAgICBdLFxuICAgICAgLy8gXHU2MzkyXHU5NjY0XHU3Mjc5XHU1QjlBXHU0RjlEXHU4RDU2XG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgIC8vIFx1NjM5Mlx1OTY2NFx1NjNEMlx1NEVGNlx1NEUyRFx1NzY4NFx1NjcwRFx1NTJBMVx1NTY2OE1vY2tcbiAgICAgICAgJ3NyYy9wbHVnaW5zL3NlcnZlck1vY2sudHMnLFxuICAgICAgICAvLyBcdTYzOTJcdTk2NjRmc2V2ZW50c1x1NjcyQ1x1NTczMFx1NkEyMVx1NTc1N1x1RkYwQ1x1OTA3Rlx1NTE0RFx1Njc4NFx1NUVGQVx1OTUxOVx1OEJFRlxuICAgICAgICAnZnNldmVudHMnXG4gICAgICBdLFxuICAgICAgLy8gXHU3ODZFXHU0RkREXHU0RjlEXHU4RDU2XHU5ODg0XHU2Nzg0XHU1RUZBXHU2QjYzXHU3ODZFXHU1QjhDXHU2MjEwXG4gICAgICBmb3JjZTogdHJ1ZSxcbiAgICB9LFxuICAgIC8vIFx1NEY3Rlx1NzUyOFx1NTM1NVx1NzJFQ1x1NzY4NFx1N0YxM1x1NUI1OFx1NzZFRVx1NUY1NVxuICAgIGNhY2hlRGlyOiAnbm9kZV9tb2R1bGVzLy52aXRlX2NhY2hlJyxcbiAgICAvLyBcdTk2MzJcdTZCNjJcdTU4MDZcdTY4MDhcdTZFQTJcdTUxRkFcbiAgICBlc2J1aWxkOiB7XG4gICAgICBsb2dPdmVycmlkZToge1xuICAgICAgICAndGhpcy1pcy11bmRlZmluZWQtaW4tZXNtJzogJ3NpbGVudCdcbiAgICAgIH0sXG4gICAgfVxuICB9XG59KTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50c1wiOy8qKlxuICogTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1N0JBMVx1NzQwNlx1NkEyMVx1NTc1N1xuICogXG4gKiBcdTYzRDBcdTRGOUJcdTdFREZcdTRFMDBcdTc2ODRIVFRQXHU4QkY3XHU2QzQyXHU2MkU2XHU2MjJBXHU0RTJEXHU5NUY0XHU0RUY2XHVGRjBDXHU3NTI4XHU0RThFXHU2QTIxXHU2MkRGQVBJXHU1NENEXHU1RTk0XG4gKiBcdThEMUZcdThEMjNcdTdCQTFcdTc0MDZcdTU0OENcdTUyMDZcdTUzRDFcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTUyMzBcdTVCRjlcdTVFOTRcdTc2ODRcdTY3MERcdTUyQTFcdTU5MDRcdTc0MDZcdTUxRkRcdTY1NzBcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IEluY29taW5nTWVzc2FnZSwgU2VydmVyUmVzcG9uc2UgfSBmcm9tICdodHRwJztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IG1vY2tDb25maWcsIHNob3VsZE1vY2tSZXF1ZXN0LCBsb2dNb2NrIH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG5jb25zdCBNT0NLX0RBVEFTT1VSQ0VTID0gW1xuICB7IGlkOiAxLCBuYW1lOiAnXHU2NTcwXHU2MzZFXHU2RTkwMScsIHR5cGU6ICdteXNxbCcsIGhvc3Q6ICdsb2NhbGhvc3QnLCBwb3J0OiAzMzA2LCB1c2VybmFtZTogJ3Jvb3QnLCBkYXRhYmFzZTogJ3Rlc3RfZGIxJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICB7IGlkOiAyLCBuYW1lOiAnXHU2NTcwXHU2MzZFXHU2RTkwMicsIHR5cGU6ICdwb3N0Z3JlcycsIGhvc3Q6ICdkYi5leGFtcGxlLmNvbScsIHBvcnQ6IDU0MzIsIHVzZXJuYW1lOiAnYWRtaW4nLCBkYXRhYmFzZTogJ3Rlc3RfZGIyJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICB7IGlkOiAzLCBuYW1lOiAnXHU2NTcwXHU2MzZFXHU2RTkwMycsIHR5cGU6ICdtb25nb2RiJywgaG9zdDogJzE5Mi4xNjguMS4xMDAnLCBwb3J0OiAyNzAxNywgdXNlcm5hbWU6ICdtb25nb2RiJywgZGF0YWJhc2U6ICd0ZXN0X2RiMycsIHN0YXR1czogJ2luYWN0aXZlJyB9XG5dO1xuXG4vLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbmNvbnN0IE1PQ0tfUVVFUklFUyA9IFtcbiAgeyBpZDogMSwgbmFtZTogJ1x1NjdFNVx1OEJFMjEnLCBzcWw6ICdTRUxFQ1QgKiBGUk9NIHVzZXJzJywgZGF0YXNvdXJjZV9pZDogMSwgY3JlYXRlZF9hdDogJzIwMjMtMDEtMDFUMDA6MDA6MDBaJywgdXBkYXRlZF9hdDogJzIwMjMtMDEtMDJUMTA6MzA6MDBaJyB9LFxuICB7IGlkOiAyLCBuYW1lOiAnXHU2N0U1XHU4QkUyMicsIHNxbDogJ1NFTEVDVCBjb3VudCgqKSBGUk9NIG9yZGVycycsIGRhdGFzb3VyY2VfaWQ6IDIsIGNyZWF0ZWRfYXQ6ICcyMDIzLTAxLTAzVDAwOjAwOjAwWicsIHVwZGF0ZWRfYXQ6ICcyMDIzLTAxLTA1VDE0OjIwOjAwWicgfSxcbiAgeyBpZDogMywgbmFtZTogJ1x1NTkwRFx1Njc0Mlx1NjdFNVx1OEJFMicsIHNxbDogJ1NFTEVDVCB1LmlkLCB1Lm5hbWUsIENPVU5UKG8uaWQpIGFzIG9yZGVyX2NvdW50IEZST00gdXNlcnMgdSBKT0lOIG9yZGVycyBvIE9OIHUuaWQgPSBvLnVzZXJfaWQgR1JPVVAgQlkgdS5pZCwgdS5uYW1lJywgZGF0YXNvdXJjZV9pZDogMSwgY3JlYXRlZF9hdDogJzIwMjMtMDEtMTBUMDA6MDA6MDBaJywgdXBkYXRlZF9hdDogJzIwMjMtMDEtMTJUMDk6MTU6MDBaJyB9XG5dO1xuXG4vLyBcdTU5MDRcdTc0MDZDT1JTXHU4QkY3XHU2QzQyXG5mdW5jdGlvbiBoYW5kbGVDb3JzKHJlczogU2VydmVyUmVzcG9uc2UpIHtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uLCBYLU1vY2stRW5hYmxlZCcpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1NYXgtQWdlJywgJzg2NDAwJyk7XG59XG5cbi8vIFx1NTNEMVx1OTAwMUpTT05cdTU0Q0RcdTVFOTRcbmZ1bmN0aW9uIHNlbmRKc29uUmVzcG9uc2UocmVzOiBTZXJ2ZXJSZXNwb25zZSwgc3RhdHVzOiBudW1iZXIsIGRhdGE6IGFueSkge1xuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbi8vIFx1NUVGNlx1OEZERlx1NjI2N1x1ODg0Q1xuZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1NjU3MFx1NjM2RVx1NkU5MEFQSVxuZnVuY3Rpb24gaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL2RhdGFzb3VyY2VzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2R0VUXHU4QkY3XHU2QzQyOiAvYXBpL2RhdGFzb3VyY2VzYCk7XG4gICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgIGRhdGE6IE1PQ0tfREFUQVNPVVJDRVMsIFxuICAgICAgdG90YWw6IE1PQ0tfREFUQVNPVVJDRVMubGVuZ3RoLFxuICAgICAgc3VjY2VzczogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL2RhdGFzb3VyY2VzXFwvXFxkKyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgY29uc3QgaWQgPSBwYXJzZUludCh1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJzAnKTtcbiAgICBjb25zdCBkYXRhc291cmNlID0gTU9DS19EQVRBU09VUkNFUy5maW5kKGQgPT4gZC5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgaWYgKGRhdGFzb3VyY2UpIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICAgIGRhdGE6IGRhdGFzb3VyY2UsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjU3MFx1NjM2RVx1NkU5MFx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlIFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFx1NTkwNFx1NzQwNlx1NjdFNVx1OEJFMkFQSVxuZnVuY3Rpb24gaGFuZGxlUXVlcmllc0FwaShyZXE6IEluY29taW5nTWVzc2FnZSwgcmVzOiBTZXJ2ZXJSZXNwb25zZSwgdXJsUGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2Q/LnRvVXBwZXJDYXNlKCk7XG4gIFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvcXVlcmllcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9xdWVyaWVzYCk7XG4gICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgIGRhdGE6IE1PQ0tfUVVFUklFUywgXG4gICAgICB0b3RhbDogTU9DS19RVUVSSUVTLmxlbmd0aCxcbiAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvXFxkKyQvKSAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgY29uc3QgaWQgPSBwYXJzZUludCh1cmxQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJzAnKTtcbiAgICBjb25zdCBxdWVyeSA9IE1PQ0tfUVVFUklFUy5maW5kKHEgPT4gcS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgaWYgKHF1ZXJ5KSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiBxdWVyeSxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA0MDQsIHsgXG4gICAgICAgIGVycm9yOiAnXHU2N0U1XHU4QkUyXHU0RTBEXHU1QjU4XHU1NzI4JyxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9xdWVyaWVzXFwvXFxkK1xcL3J1biQvKSAmJiBtZXRob2QgPT09ICdQT1NUJykge1xuICAgIGNvbnN0IGlkID0gcGFyc2VJbnQodXJsUGF0aC5zcGxpdCgnLycpWzNdIHx8ICcwJyk7XG4gICAgY29uc3QgcXVlcnkgPSBNT0NLX1FVRVJJRVMuZmluZChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZQT1NUXHU4QkY3XHU2QzQyOiAke3VybFBhdGh9LCBJRDogJHtpZH1gKTtcbiAgICBcbiAgICBpZiAocXVlcnkpIHtcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1NjdFNVx1OEJFMlx1NjI2N1x1ODg0Q1x1N0VEM1x1Njc5Q1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwge1xuICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgeyBpZDogMSwgbmFtZTogJ0pvaG4gRG9lJywgZW1haWw6ICdqb2huQGV4YW1wbGUuY29tJyB9LFxuICAgICAgICAgIHsgaWQ6IDIsIG5hbWU6ICdKYW5lIFNtaXRoJywgZW1haWw6ICdqYW5lQGV4YW1wbGUuY29tJyB9LFxuICAgICAgICAgIHsgaWQ6IDMsIG5hbWU6ICdCb2IgSm9obnNvbicsIGVtYWlsOiAnYm9iQGV4YW1wbGUuY29tJyB9XG4gICAgICAgIF0sXG4gICAgICAgIGNvbHVtbnM6IFsnaWQnLCAnbmFtZScsICdlbWFpbCddLFxuICAgICAgICByb3dzOiAzLFxuICAgICAgICBleGVjdXRpb25fdGltZTogMC4xMjMsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjdFNVx1OEJFMlx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gXHU1MjFCXHU1RUZBXHU0RTJEXHU5NUY0XHU0RUY2XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVNb2NrTWlkZGxld2FyZSgpOiBDb25uZWN0Lk5leHRIYW5kbGVGdW5jdGlvbiB7XG4gIC8vIFx1NTk4Mlx1Njc5Q01vY2tcdTY3MERcdTUyQTFcdTg4QUJcdTc5ODFcdTc1MjhcdUZGMENcdThGRDRcdTU2REVcdTdBN0FcdTRFMkRcdTk1RjRcdTRFRjZcbiAgaWYgKCFtb2NrQ29uZmlnLmVuYWJsZWQpIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2tdIFx1NjcwRFx1NTJBMVx1NURGMlx1Nzk4MVx1NzUyOFx1RkYwQ1x1OEZENFx1NTZERVx1N0E3QVx1NEUyRFx1OTVGNFx1NEVGNicpO1xuICAgIHJldHVybiAocmVxLCByZXMsIG5leHQpID0+IG5leHQoKTtcbiAgfVxuICBcbiAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTUyMUJcdTVFRkFcdTRFMkRcdTk1RjRcdTRFRjYsIFx1NjJFNlx1NjIyQUFQSVx1OEJGN1x1NkM0MicpO1xuICBcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIG1vY2tNaWRkbGV3YXJlKFxuICAgIHJlcTogQ29ubmVjdC5JbmNvbWluZ01lc3NhZ2UsXG4gICAgcmVzOiBTZXJ2ZXJSZXNwb25zZSxcbiAgICBuZXh0OiBDb25uZWN0Lk5leHRGdW5jdGlvblxuICApIHtcbiAgICB0cnkge1xuICAgICAgLy8gXHU4OUUzXHU2NzkwVVJMXG4gICAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnO1xuICAgICAgY29uc3QgcGFyc2VkVXJsID0gcGFyc2UodXJsLCB0cnVlKTtcbiAgICAgIGNvbnN0IHVybFBhdGggPSBwYXJzZWRVcmwucGF0aG5hbWUgfHwgJyc7XG4gICAgICBcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgICAgaWYgKCFzaG91bGRNb2NrUmVxdWVzdCh1cmwpKSB7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NjUzNlx1NTIzMFx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3VybFBhdGh9YCk7XG4gICAgICBcbiAgICAgIC8vIFx1NTkwNFx1NzQwNkNPUlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDJcbiAgICAgIGlmIChyZXEubWV0aG9kID09PSAnT1BUSU9OUycpIHtcbiAgICAgICAgaGFuZGxlQ29ycyhyZXMpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwNDtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NkRGQlx1NTJBMENPUlNcdTU5MzRcbiAgICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICAgIFxuICAgICAgLy8gXHU2QTIxXHU2MkRGXHU3RjUxXHU3RURDXHU1RUY2XHU4RkRGXG4gICAgICBpZiAobW9ja0NvbmZpZy5kZWxheSA+IDApIHtcbiAgICAgICAgYXdhaXQgZGVsYXkobW9ja0NvbmZpZy5kZWxheSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NTkwNFx1NzQwNlx1NEUwRFx1NTQwQ1x1NzY4NEFQSVx1N0FFRlx1NzBCOVxuICAgICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcbiAgICAgIFxuICAgICAgLy8gXHU2MzA5XHU5ODdBXHU1RThGXHU1QzFEXHU4QkQ1XHU0RTBEXHU1NDBDXHU3Njg0QVBJXHU1OTA0XHU3NDA2XHU1NjY4XG4gICAgICBpZiAoIWhhbmRsZWQpIGhhbmRsZWQgPSBoYW5kbGVEYXRhc291cmNlc0FwaShyZXEsIHJlcywgdXJsUGF0aCk7XG4gICAgICBpZiAoIWhhbmRsZWQpIGhhbmRsZWQgPSBoYW5kbGVRdWVyaWVzQXBpKHJlcSwgcmVzLCB1cmxQYXRoKTtcbiAgICAgIFxuICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2Q0ExXHU2NzA5XHU1OTA0XHU3NDA2XHVGRjBDXHU4RkQ0XHU1NkRFNDA0XG4gICAgICBpZiAoIWhhbmRsZWQpIHtcbiAgICAgICAgbG9nTW9jaygnaW5mbycsIGBcdTY3MkFcdTVCOUVcdTczQjBcdTc2ODRBUElcdThERUZcdTVGODQ6ICR7cmVxLm1ldGhvZH0gJHt1cmxQYXRofWApO1xuICAgICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICAgIGVycm9yOiAnXHU2NzJBXHU2MjdFXHU1MjMwQVBJXHU3QUVGXHU3MEI5JyxcbiAgICAgICAgICBtZXNzYWdlOiBgQVBJXHU3QUVGXHU3MEI5ICR7dXJsUGF0aH0gXHU2NzJBXHU2MjdFXHU1MjMwXHU2MjE2XHU2NzJBXHU1QjlFXHU3M0IwYCxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nTW9jaygnZXJyb3InLCBgXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU1MUZBXHU5NTE5OmAsIGVycm9yKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgXG4gICAgICAgIGVycm9yOiAnXHU2NzBEXHU1MkExXHU1NjY4XHU1MTg1XHU5MEU4XHU5NTE5XHU4QkVGJyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSAiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9ja1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svY29uZmlnLnRzXCI7LyoqXG4gKiBNb2NrXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XG4gKiBcbiAqIFx1NjNBN1x1NTIzNk1vY2tcdTY3MERcdTUyQTFcdTc2ODRcdTU0MkZcdTc1MjgvXHU3OTgxXHU3NTI4XHU3MkI2XHU2MDAxXHUzMDAxXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCXHU3QjQ5XG4gKi9cblxuLy8gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU2MjE2XHU1MTY4XHU1QzQwXHU4QkJFXHU3RjZFXHU0RTJEXHU4M0I3XHU1M0Q2XHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuZXhwb3J0IGZ1bmN0aW9uIGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgdHJ5IHtcbiAgICAvLyBcdTU3MjhOb2RlLmpzXHU3M0FGXHU1ODgzXHU0RTJEXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudikge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODNcdTRFMkRcbiAgICBpZiAodHlwZW9mIGltcG9ydC5tZXRhICE9PSAndW5kZWZpbmVkJyAmJiBpbXBvcnQubWV0YS5lbnYpIHtcbiAgICAgIGlmIChpbXBvcnQubWV0YS5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChpbXBvcnQubWV0YS5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTY4QzBcdTY3RTVsb2NhbFN0b3JhZ2UgKFx1NEVDNVx1NTcyOFx1NkQ0Rlx1ODlDOFx1NTY2OFx1NzNBRlx1NTg4MylcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgY29uc3QgbG9jYWxTdG9yYWdlVmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnVVNFX01PQ0tfQVBJJyk7XG4gICAgICBpZiAobG9jYWxTdG9yYWdlVmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChsb2NhbFN0b3JhZ2VWYWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFx1OUVEOFx1OEJBNFx1NjBDNVx1NTFCNVx1RkYxQVx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NEUwQlx1NTQyRlx1NzUyOFx1RkYwQ1x1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1Nzk4MVx1NzUyOFxuICAgIGNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBcbiAgICAgICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHx8XG4gICAgICAodHlwZW9mIGltcG9ydC5tZXRhICE9PSAndW5kZWZpbmVkJyAmJiBpbXBvcnQubWV0YS5lbnYgJiYgaW1wb3J0Lm1ldGEuZW52LkRFViA9PT0gdHJ1ZSk7XG4gICAgXG4gICAgcmV0dXJuIGlzRGV2ZWxvcG1lbnQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gXHU1MUZBXHU5NTE5XHU2NUY2XHU3Njg0XHU1Qjg5XHU1MTY4XHU1NkRFXHU5MDAwXG4gICAgY29uc29sZS53YXJuKCdbTW9ja10gXHU2OEMwXHU2N0U1XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU1MUZBXHU5NTE5XHVGRjBDXHU5RUQ4XHU4QkE0XHU3OTgxXHU3NTI4TW9ja1x1NjcwRFx1NTJBMScsIGVycm9yKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gXHU1NDExXHU1NDBFXHU1MTdDXHU1QkI5XHU2NUU3XHU0RUUzXHU3ODAxXHU3Njg0XHU1MUZEXHU2NTcwXG5leHBvcnQgZnVuY3Rpb24gaXNNb2NrRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzRW5hYmxlZCgpO1xufVxuXG4vLyBNb2NrXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXG5leHBvcnQgY29uc3QgbW9ja0NvbmZpZyA9IHtcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9ja1x1NjcwRFx1NTJBMVxuICBlbmFibGVkOiBpc0VuYWJsZWQoKSxcbiAgXG4gIC8vIFx1OEJGN1x1NkM0Mlx1NUVGNlx1OEZERlx1RkYwOFx1NkJFQlx1NzlEMlx1RkYwOVxuICBkZWxheTogMzAwLFxuICBcbiAgLy8gQVBJXHU1N0ZBXHU3ODQwXHU4REVGXHU1Rjg0XHVGRjBDXHU3NTI4XHU0RThFXHU1MjI0XHU2NUFEXHU2NjJGXHU1NDI2XHU5NzAwXHU4OTgxXHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIGFwaUJhc2VQYXRoOiAnL2FwaScsXG4gIFxuICAvLyBcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkI6ICdub25lJywgJ2Vycm9yJywgJ2luZm8nLCAnZGVidWcnXG4gIGxvZ0xldmVsOiAnZGVidWcnLFxuICBcbiAgLy8gXHU1NDJGXHU3NTI4XHU3Njg0XHU2QTIxXHU1NzU3XG4gIG1vZHVsZXM6IHtcbiAgICBkYXRhc291cmNlczogdHJ1ZSxcbiAgICBxdWVyaWVzOiB0cnVlLFxuICAgIHVzZXJzOiB0cnVlLFxuICAgIHZpc3VhbGl6YXRpb25zOiB0cnVlXG4gIH1cbn07XG5cbi8vIFx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE1vY2tSZXF1ZXN0KHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFx1NUZDNVx1OTg3Qlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgaWYgKCFtb2NrQ29uZmlnLmVuYWJsZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFx1NUZDNVx1OTg3Qlx1NjYyRkFQSVx1OEJGN1x1NkM0MlxuICBpZiAoIXVybC5zdGFydHNXaXRoKG1vY2tDb25maWcuYXBpQmFzZVBhdGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdThERUZcdTVGODRcdTY4QzBcdTY3RTVcdTkwMUFcdThGQzdcdUZGMENcdTVFOTRcdThCRTVcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFx1OEJCMFx1NUY1NVx1NjVFNVx1NUZEN1xuZXhwb3J0IGZ1bmN0aW9uIGxvZ01vY2sobGV2ZWw6ICdlcnJvcicgfCAnaW5mbycgfCAnZGVidWcnLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICBjb25zdCB7IGxvZ0xldmVsIH0gPSBtb2NrQ29uZmlnO1xuICBcbiAgaWYgKGxvZ0xldmVsID09PSAnbm9uZScpIHJldHVybjtcbiAgXG4gIGlmIChsZXZlbCA9PT0gJ2Vycm9yJyAmJiBbJ2Vycm9yJywgJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTW9jayBFUlJPUl0nLCAuLi5hcmdzKTtcbiAgfSBlbHNlIGlmIChsZXZlbCA9PT0gJ2luZm8nICYmIFsnaW5mbycsICdkZWJ1ZyddLmluY2x1ZGVzKGxvZ0xldmVsKSkge1xuICAgIGNvbnNvbGUuaW5mbygnW01vY2sgSU5GT10nLCAuLi5hcmdzKTtcbiAgfSBlbHNlIGlmIChsZXZlbCA9PT0gJ2RlYnVnJyAmJiBsb2dMZXZlbCA9PT0gJ2RlYnVnJykge1xuICAgIGNvbnNvbGUubG9nKCdbTW9jayBERUJVR10nLCAuLi5hcmdzKTtcbiAgfVxufVxuXG4vLyBcdTUyMURcdTU5Q0JcdTUzMTZcdTY1RjZcdThGOTNcdTUxRkFNb2NrXHU2NzBEXHU1MkExXHU3MkI2XHU2MDAxXG50cnkge1xuICBjb25zb2xlLmxvZyhgW01vY2tdIFx1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMTogJHttb2NrQ29uZmlnLmVuYWJsZWQgPyAnXHU1REYyXHU1NDJGXHU3NTI4JyA6ICdcdTVERjJcdTc5ODFcdTc1MjgnfWApO1xuICBpZiAobW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTkxNERcdTdGNkU6YCwge1xuICAgICAgZGVsYXk6IG1vY2tDb25maWcuZGVsYXksXG4gICAgICBhcGlCYXNlUGF0aDogbW9ja0NvbmZpZy5hcGlCYXNlUGF0aCxcbiAgICAgIGxvZ0xldmVsOiBtb2NrQ29uZmlnLmxvZ0xldmVsLFxuICAgICAgZW5hYmxlZE1vZHVsZXM6IE9iamVjdC5lbnRyaWVzKG1vY2tDb25maWcubW9kdWxlcylcbiAgICAgICAgLmZpbHRlcigoW18sIGVuYWJsZWRdKSA9PiBlbmFibGVkKVxuICAgICAgICAubWFwKChbbmFtZV0pID0+IG5hbWUpXG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGNvbnNvbGUud2FybignW01vY2tdIFx1OEY5M1x1NTFGQVx1OTE0RFx1N0Y2RVx1NEZFMVx1NjA2Rlx1NTFGQVx1OTUxOScsIGVycm9yKTtcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzXCI7aW1wb3J0IHsgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTRFMDBcdTRFMkFcdTdCODBcdTUzNTVcdTc2ODRcdTZENEJcdThCRDVcdTRFMkRcdTk1RjRcdTRFRjZcbiAqIFx1NTNFQVx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFx1RkYwQ1x1NzUyOFx1NEU4RVx1NkQ0Qlx1OEJENU1vY2tcdTdDRkJcdTdFREZcdTY2MkZcdTU0MjZcdTZCNjNcdTVFMzhcdTVERTVcdTRGNUNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUoKSB7XG4gIGNvbnNvbGUubG9nKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTVERjJcdTUyMUJcdTVFRkFcdTZENEJcdThCRDVcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTVDMDZcdTU5MDRcdTc0MDYvYXBpL3Rlc3RcdThERUZcdTVGODRcdTc2ODRcdThCRjdcdTZDNDInKTtcbiAgXG4gIHJldHVybiBmdW5jdGlvbiBzaW1wbGVNaWRkbGV3YXJlKFxuICAgIHJlcTogaHR0cC5JbmNvbWluZ01lc3NhZ2UsXG4gICAgcmVzOiBodHRwLlNlcnZlclJlc3BvbnNlLFxuICAgIG5leHQ6IENvbm5lY3QuTmV4dEZ1bmN0aW9uXG4gICkge1xuICAgIGNvbnN0IHVybCA9IHJlcS51cmwgfHwgJyc7XG4gICAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZCB8fCAnVU5LTk9XTic7XG4gICAgXG4gICAgLy8gXHU1M0VBXHU1OTA0XHU3NDA2L2FwaS90ZXN0XHU4REVGXHU1Rjg0XG4gICAgaWYgKHVybCA9PT0gJy9hcGkvdGVzdCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTY1MzZcdTUyMzBcdTZENEJcdThCRDVcdThCRjdcdTZDNDI6ICR7bWV0aG9kfSAke3VybH1gKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gXHU4QkJFXHU3RjZFQ09SU1x1NTkzNFxuICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIE9QVElPTlMnKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycycsICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24nKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTkwNFx1NzQwNk9QVElPTlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDJcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NTkwNFx1NzQwNk9QVElPTlNcdTk4ODRcdTY4QzBcdThCRjdcdTZDNDInKTtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwNDtcbiAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTc4NkVcdTRGRERcdTg5ODZcdTc2RDZcdTYzODlcdTYyNDBcdTY3MDlcdTVERjJcdTY3MDlcdTc2ODRDb250ZW50LVR5cGVcdUZGMENcdTkwN0ZcdTUxNERcdTg4QUJcdTU0MEVcdTdFRURcdTRFMkRcdTk1RjRcdTRFRjZcdTY2RjRcdTY1MzlcbiAgICAgICAgcmVzLnJlbW92ZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1MUM2XHU1OTA3XHU1NENEXHU1RTk0XHU2NTcwXHU2MzZFXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdcdTdCODBcdTUzNTVcdTZENEJcdThCRDVcdTRFMkRcdTk1RjRcdTRFRjZcdTU0Q0RcdTVFOTRcdTYyMTBcdTUyOUYnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICBoZWFkZXJzOiByZXEuaGVhZGVycyxcbiAgICAgICAgICAgIHBhcmFtczogdXJsLmluY2x1ZGVzKCc/JykgPyB1cmwuc3BsaXQoJz8nKVsxXSA6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvLyBcdTUzRDFcdTkwMDFcdTU0Q0RcdTVFOTRcdTUyNERcdTc4NkVcdTRGRERcdTRFMkRcdTY1QURcdThCRjdcdTZDNDJcdTk0RkVcbiAgICAgICAgY29uc29sZS5sb2coJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NTNEMVx1OTAwMVx1NkQ0Qlx1OEJENVx1NTRDRFx1NUU5NCcpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlRGF0YSwgbnVsbCwgMikpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU0RTBEXHU4QzAzXHU3NTI4bmV4dCgpXHVGRjBDXHU3ODZFXHU0RkREXHU4QkY3XHU2QzQyXHU1MjMwXHU2QjY0XHU3RUQzXHU2NzVGXG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIFx1NTkwNFx1NzQwNlx1OTUxOVx1OEJFRlxuICAgICAgICBjb25zb2xlLmVycm9yKCdbXHU3QjgwXHU1MzU1XHU0RTJEXHU5NUY0XHU0RUY2XSBcdTU5MDRcdTc0MDZcdThCRjdcdTZDNDJcdTY1RjZcdTUxRkFcdTk1MTk6JywgZXJyb3IpO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU5MUNEXHU4OTgxXHVGRjAxXHU2RTA1XHU5NjY0XHU1REYyXHU2NzA5XHU3Njg0XHU1OTM0XHVGRjBDXHU5MDdGXHU1MTREQ29udGVudC1UeXBlXHU4OEFCXHU2NkY0XHU2NTM5XG4gICAgICAgIHJlcy5yZW1vdmVIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogJ1x1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NjVGNlx1NTFGQVx1OTUxOScsXG4gICAgICAgICAgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKVxuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTkxQ0RcdTg5ODFcdUZGMDFcdTRFMERcdThDMDNcdTc1MjhuZXh0KClcdUZGMENcdTc4NkVcdTRGRERcdThCRjdcdTZDNDJcdTUyMzBcdTZCNjRcdTdFRDNcdTY3NUZcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTRFMERcdTU5MDRcdTc0MDZcdTc2ODRcdThCRjdcdTZDNDJcdTRFQTRcdTdFRDlcdTRFMEJcdTRFMDBcdTRFMkFcdTRFMkRcdTk1RjRcdTRFRjZcbiAgICBuZXh0KCk7XG4gIH07XG59ICJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFksU0FBUyxjQUFjLGVBQWdDO0FBQ2pjLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsU0FBUyxnQkFBZ0I7QUFDekIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxrQkFBa0I7OztBQ0l6QixTQUFTLGFBQWE7OztBQ0ZmLFNBQVMsWUFBcUI7QUFDbkMsTUFBSTtBQUVGLFFBQUksT0FBTyxZQUFZLGVBQWUsUUFBUSxLQUFLO0FBQ2pELFVBQUksUUFBUSxJQUFJLHNCQUFzQixRQUFRO0FBQzVDLGVBQU87QUFBQSxNQUNUO0FBQ0EsVUFBSSxRQUFRLElBQUksc0JBQXNCLFNBQVM7QUFDN0MsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBR0EsUUFBSSxPQUFPLGdCQUFnQixlQUFlLFlBQVksS0FBSztBQUN6RCxVQUFJLFlBQVksSUFBSSxzQkFBc0IsUUFBUTtBQUNoRCxlQUFPO0FBQUEsTUFDVDtBQUNBLFVBQUksWUFBWSxJQUFJLHNCQUFzQixTQUFTO0FBQ2pELGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFFBQUksT0FBTyxXQUFXLGVBQWUsT0FBTyxjQUFjO0FBQ3hELFlBQU0sb0JBQW9CLGFBQWEsUUFBUSxjQUFjO0FBQzdELFVBQUksc0JBQXNCLFFBQVE7QUFDaEMsZUFBTztBQUFBLE1BQ1Q7QUFDQSxVQUFJLHNCQUFzQixTQUFTO0FBQ2pDLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFVBQU0sZ0JBQ0gsT0FBTyxZQUFZLGVBQWUsUUFBUSxPQUFPLFFBQVEsSUFBSSxhQUFhLGlCQUMxRSxPQUFPLGdCQUFnQixlQUFlLFlBQVksT0FBTyxZQUFZLElBQUksUUFBUTtBQUVwRixXQUFPO0FBQUEs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
