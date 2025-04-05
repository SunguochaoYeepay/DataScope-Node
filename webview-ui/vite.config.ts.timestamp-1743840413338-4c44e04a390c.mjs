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
  return function simpleMiddleware(req, res, next) {
    if (req.url === "/api/test") {
      console.log("[\u7B80\u5355\u4E2D\u95F4\u4EF6] \u5904\u7406\u6D4B\u8BD5\u8BF7\u6C42");
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: "\u6D4B\u8BD5\u6210\u529F",
        data: {
          time: (/* @__PURE__ */ new Date()).toISOString(),
          method: req.method,
          url: req.url
        }
      }));
      return;
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
var vite_config_default = defineConfig(({ mode }) => {
  process.env.VITE_USE_MOCK_API = process.env.VITE_USE_MOCK_API || "false";
  const env = loadEnv(mode, process.cwd(), "");
  const useMockApi = process.env.VITE_USE_MOCK_API === "true";
  const disableHmr = process.env.VITE_DISABLE_HMR === "true";
  const useMockApiTest = true;
  console.log(`[Vite\u914D\u7F6E] \u8FD0\u884C\u6A21\u5F0F: ${mode}`);
  console.log(`[Vite\u914D\u7F6E] Mock API: ${useMockApi ? "\u542F\u7528" : "\u7981\u7528"}`);
  console.log(`[Vite\u914D\u7F6E] HMR: ${disableHmr ? "\u7981\u7528" : "\u542F\u7528"}`);
  const middleware = useMockApi ? createMockMiddleware() : null;
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
        host: "localhost",
        port: 8080,
        clientPort: 8080
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
      // 配置服务器中间件
      configureServer: (server) => {
        server.middlewares.use((req, res, next) => {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
          next();
        });
        if (useMockApi && middleware) {
          console.log("[Vite\u914D\u7F6E] \u6DFB\u52A0Mock\u4E2D\u95F4\u4EF6\uFF0C\u4EC5\u7528\u4E8E\u5904\u7406API\u8BF7\u6C42");
          server.middlewares.use((req, res, next) => {
            const url = req.url || "";
            if (!url.startsWith("/api/")) {
              return next();
            }
            console.log(`[Vite] \u62E6\u622AAPI\u8BF7\u6C42: ${req.method} ${url}`);
            middleware(req, res, next);
          });
        } else {
          console.log("[Vite\u914D\u7F6E] Mock API\u5DF2\u7981\u7528\uFF0C\u6240\u6709API\u8BF7\u6C42\u5C06\u8F6C\u53D1\u5230\u540E\u7AEF");
        }
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
    },
    middlewareMode: "html",
    fs: {
      strict: false
    },
    headers: {
      // ... existing code ...
    },
    watch: {
      usePolling: true
    },
    cors: true,
    // 添加测试中间件
    configureServer: (server) => {
      if (useMockApiTest) {
        server.middlewares.use(createSimpleMiddleware());
        console.log("[\u914D\u7F6E] \u542F\u7528\u4E86\u6D4B\u8BD5Mock API\u4E2D\u95F4\u4EF6");
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50cyIsICJzcmMvbW9jay9jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuaW1wb3J0IHsgY3JlYXRlU2ltcGxlTWlkZGxld2FyZSB9IGZyb20gJy4vc3JjL21vY2svbWlkZGxld2FyZS9zaW1wbGUnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5cbi8vIFx1NUYzQVx1NTIzNlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFM1x1NTFGRFx1NjU3MFxuZnVuY3Rpb24ga2lsbFBvcnQocG9ydDogbnVtYmVyKSB7XG4gIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2OEMwXHU2N0U1XHU3QUVGXHU1M0UzICR7cG9ydH0gXHU1MzYwXHU3NTI4XHU2MEM1XHU1MUI1YCk7XG4gIHRyeSB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgIGV4ZWNTeW5jKGBuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9YCk7XG4gICAgICBleGVjU3luYyhgdGFza2tpbGwgL0YgL3BpZCAkKG5ldHN0YXQgLWFubyB8IGZpbmRzdHIgOiR7cG9ydH0gfCBhd2sgJ3twcmludCAkNX0nKWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhlY1N5bmMoYGxzb2YgLWkgOiR7cG9ydH0gLXQgfCB4YXJncyBraWxsIC05YCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NURGMlx1OTFDQVx1NjUzRVx1N0FFRlx1NTNFMyAke3BvcnR9YCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NjcyQVx1ODhBQlx1NTM2MFx1NzUyOFx1NjIxNlx1NjVFMFx1NkNENVx1OTFDQVx1NjUzRWApO1xuICB9XG59XG5cbi8vIFx1NUYzQVx1NTIzNlx1NkUwNVx1NzQwNlZpdGVcdTdGMTNcdTVCNThcbmZ1bmN0aW9uIGNsZWFuVml0ZUNhY2hlKCkge1xuICBjb25zb2xlLmxvZygnW1ZpdGVdIFx1NkUwNVx1NzQwNlx1NEY5RFx1OEQ1Nlx1N0YxM1x1NUI1OCcpO1xuICBjb25zdCBjYWNoZVBhdGhzID0gW1xuICAgICcuL25vZGVfbW9kdWxlcy8udml0ZScsXG4gICAgJy4vbm9kZV9tb2R1bGVzLy52aXRlXyonLFxuICAgICcuLy52aXRlJyxcbiAgICAnLi9kaXN0JyxcbiAgICAnLi90bXAnLFxuICAgICcuLy50ZW1wJ1xuICBdO1xuICBcbiAgY2FjaGVQYXRocy5mb3JFYWNoKGNhY2hlUGF0aCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGNhY2hlUGF0aCkpIHtcbiAgICAgICAgaWYgKGZzLmxzdGF0U3luYyhjYWNoZVBhdGgpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBleGVjU3luYyhgcm0gLXJmICR7Y2FjaGVQYXRofWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLnVubGlua1N5bmMoY2FjaGVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NURGMlx1NTIyMFx1OTY2NDogJHtjYWNoZVBhdGh9YCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTY1RTBcdTZDRDVcdTUyMjBcdTk2NjQ6ICR7Y2FjaGVQYXRofWAsIGUpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIFx1NkUwNVx1NzQwNlZpdGVcdTdGMTNcdTVCNThcbmNsZWFuVml0ZUNhY2hlKCk7XG5cbi8vIFx1NUMxRFx1OEJENVx1OTFDQVx1NjUzRVx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1N0FFRlx1NTNFM1xua2lsbFBvcnQoODA4MCk7XG5cbi8vIFx1NTdGQVx1NjcyQ1x1OTE0RFx1N0Y2RVxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAvLyBcdTUyQTBcdThGN0RcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcbiAgcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPSBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSB8fCAnZmFsc2UnO1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2sgQVBJIC0gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU4QkZCXHU1M0Q2XG4gIGNvbnN0IHVzZU1vY2tBcGkgPSBwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU3OTgxXHU3NTI4SE1SIC0gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU4QkZCXHU1M0Q2XG4gIGNvbnN0IGRpc2FibGVIbXIgPSBwcm9jZXNzLmVudi5WSVRFX0RJU0FCTEVfSE1SID09PSAndHJ1ZSc7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTRGN0ZcdTc1MjhcdTZBMjFcdTYyREZBUElcbiAgY29uc3QgdXNlTW9ja0FwaVRlc3QgPSB0cnVlO1xuICBcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdThGRDBcdTg4NENcdTZBMjFcdTVGMEY6ICR7bW9kZX1gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBNb2NrIEFQSTogJHt1c2VNb2NrQXBpID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICAvLyBcdTUxQzZcdTU5MDdcdTRFMkRcdTk1RjRcdTRFRjZcbiAgY29uc3QgbWlkZGxld2FyZSA9IHVzZU1vY2tBcGkgPyBjcmVhdGVNb2NrTWlkZGxld2FyZSgpIDogbnVsbDtcbiAgXG4gIC8vIFx1OTE0RFx1N0Y2RVxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgIF0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICAvLyBITVJcdTkxNERcdTdGNkVcbiAgICAgIGhtcjogZGlzYWJsZUhtciA/IGZhbHNlIDoge1xuICAgICAgICBwcm90b2NvbDogJ3dzJyxcbiAgICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICAgIHBvcnQ6IDgwODAsXG4gICAgICAgIGNsaWVudFBvcnQ6IDgwODAsXG4gICAgICB9LFxuICAgICAgLy8gXHU5MTREXHU3RjZFXHU0RUUzXHU3NDA2XG4gICAgICBwcm94eToge1xuICAgICAgICAvLyBcdTVDMDZBUElcdThCRjdcdTZDNDJcdThGNkNcdTUzRDFcdTUyMzBcdTU0MEVcdTdBRUZcdTY3MERcdTUyQTFcbiAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgICBieXBhc3M6IChyZXEpID0+IHtcbiAgICAgICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NTQyRlx1NzUyOFx1NEU4Nk1vY2sgQVBJXHVGRjBDXHU1MjE5XHU0RTBEXHU0RUUzXHU3NDA2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgICAgICBpZiAodXNlTW9ja0FwaSAmJiByZXEudXJsPy5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1NjcwRFx1NTJBMVx1NTY2OFx1NEUyRFx1OTVGNFx1NEVGNlxuICAgICAgY29uZmlndXJlU2VydmVyOiAoc2VydmVyKSA9PiB7XG4gICAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NTE2OFx1NUM0MFx1N0YxM1x1NUI1OFx1NjNBN1x1NTIzNlxuICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tc3RvcmUsIG5vLWNhY2hlLCBtdXN0LXJldmFsaWRhdGUnKTtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdFeHBpcmVzJywgJzAnKTtcbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NDJGXHU3NTI4XHU0RTg2TW9jayBBUElcdUZGMENcdTZERkJcdTUyQTBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmICh1c2VNb2NrQXBpICYmIG1pZGRsZXdhcmUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW1ZpdGVcdTkxNERcdTdGNkVdIFx1NkRGQlx1NTJBME1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTRFQzVcdTc1MjhcdTRFOEVcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDInKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTUzRUFcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDJcbiAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU5NzVFQVBJXHU4QkY3XHU2QzQyXHU0RTBEXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICBpZiAoIXVybC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsfWApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdTRGN0ZcdTc1MjhcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgICAgIG1pZGRsZXdhcmUocmVxLCByZXMsIG5leHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbVml0ZVx1OTE0RFx1N0Y2RV0gTW9jayBBUElcdTVERjJcdTc5ODFcdTc1MjhcdUZGMENcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTVDMDZcdThGNkNcdTUzRDFcdTUyMzBcdTU0MEVcdTdBRUYnKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MsIGF1dG9wcmVmaXhlcl0sXG4gICAgICB9LFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIC8vIFx1NTMwNVx1NTQyQlx1NTdGQVx1NjcyQ1x1NEY5RFx1OEQ1NlxuICAgICAgaW5jbHVkZTogW1xuICAgICAgICAndnVlJywgXG4gICAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICAgJ3BpbmlhJyxcbiAgICAgICAgJ2F4aW9zJyxcbiAgICAgICAgJ2RheWpzJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlL2VzL2xvY2FsZS96aF9DTidcbiAgICAgIF0sXG4gICAgICAvLyBcdTYzOTJcdTk2NjRcdTcyNzlcdTVCOUFcdTRGOURcdThENTZcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgLy8gXHU2MzkyXHU5NjY0XHU2M0QyXHU0RUY2XHU0RTJEXHU3Njg0XHU2NzBEXHU1MkExXHU1NjY4TW9ja1xuICAgICAgICAnc3JjL3BsdWdpbnMvc2VydmVyTW9jay50cycsXG4gICAgICAgIC8vIFx1NjM5Mlx1OTY2NGZzZXZlbnRzXHU2NzJDXHU1NzMwXHU2QTIxXHU1NzU3XHVGRjBDXHU5MDdGXHU1MTREXHU2Nzg0XHU1RUZBXHU5NTE5XHU4QkVGXG4gICAgICAgICdmc2V2ZW50cydcbiAgICAgIF0sXG4gICAgICAvLyBcdTc4NkVcdTRGRERcdTRGOURcdThENTZcdTk4ODRcdTY3ODRcdTVFRkFcdTZCNjNcdTc4NkVcdTVCOENcdTYyMTBcbiAgICAgIGZvcmNlOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gXHU0RjdGXHU3NTI4XHU1MzU1XHU3MkVDXHU3Njg0XHU3RjEzXHU1QjU4XHU3NkVFXHU1RjU1XG4gICAgY2FjaGVEaXI6ICdub2RlX21vZHVsZXMvLnZpdGVfY2FjaGUnLFxuICAgIC8vIFx1OTYzMlx1NkI2Mlx1NTgwNlx1NjgwOFx1NkVBMlx1NTFGQVxuICAgIGVzYnVpbGQ6IHtcbiAgICAgIGxvZ092ZXJyaWRlOiB7XG4gICAgICAgICd0aGlzLWlzLXVuZGVmaW5lZC1pbi1lc20nOiAnc2lsZW50J1xuICAgICAgfSxcbiAgICB9LFxuICAgIG1pZGRsZXdhcmVNb2RlOiAnaHRtbCcsXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgfSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAvLyAuLi4gZXhpc3RpbmcgY29kZSAuLi5cbiAgICB9LFxuICAgIHdhdGNoOiB7XG4gICAgICB1c2VQb2xsaW5nOiB0cnVlLFxuICAgIH0sXG4gICAgY29yczogdHJ1ZSxcbiAgICAvLyBcdTZERkJcdTUyQTBcdTZENEJcdThCRDVcdTRFMkRcdTk1RjRcdTRFRjZcbiAgICBjb25maWd1cmVTZXJ2ZXI6IChzZXJ2ZXIpID0+IHtcbiAgICAgIGlmICh1c2VNb2NrQXBpVGVzdCkge1xuICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUoKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbXHU5MTREXHU3RjZFXSBcdTU0MkZcdTc1MjhcdTRFODZcdTZENEJcdThCRDVNb2NrIEFQSVx1NEUyRFx1OTVGNFx1NEVGNicpO1xuICAgICAgfVxuICAgIH0sXG4gIH1cbn0pIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTdCQTFcdTc0MDZcdTZBMjFcdTU3NTdcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0SFRUUFx1OEJGN1x1NkM0Mlx1NjJFNlx1NjIyQVx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFxuICogXHU4RDFGXHU4RDIzXHU3QkExXHU3NDA2XHU1NDhDXHU1MjA2XHU1M0QxXHU2MjQwXHU2NzA5QVBJXHU4QkY3XHU2QzQyXHU1MjMwXHU1QkY5XHU1RTk0XHU3Njg0XHU2NzBEXHU1MkExXHU1OTA0XHU3NDA2XHU1MUZEXHU2NTcwXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnLCBzaG91bGRNb2NrUmVxdWVzdCwgbG9nTW9jayB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuY29uc3QgTU9DS19EQVRBU09VUkNFUyA9IFtcbiAgeyBpZDogMSwgbmFtZTogJ1x1NjU3MFx1NjM2RVx1NkU5MDEnLCB0eXBlOiAnbXlzcWwnLCBob3N0OiAnbG9jYWxob3N0JywgcG9ydDogMzMwNiwgdXNlcm5hbWU6ICdyb290JywgZGF0YWJhc2U6ICd0ZXN0X2RiMScsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgeyBpZDogMiwgbmFtZTogJ1x1NjU3MFx1NjM2RVx1NkU5MDInLCB0eXBlOiAncG9zdGdyZXMnLCBob3N0OiAnZGIuZXhhbXBsZS5jb20nLCBwb3J0OiA1NDMyLCB1c2VybmFtZTogJ2FkbWluJywgZGF0YWJhc2U6ICd0ZXN0X2RiMicsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgeyBpZDogMywgbmFtZTogJ1x1NjU3MFx1NjM2RVx1NkU5MDMnLCB0eXBlOiAnbW9uZ29kYicsIGhvc3Q6ICcxOTIuMTY4LjEuMTAwJywgcG9ydDogMjcwMTcsIHVzZXJuYW1lOiAnbW9uZ29kYicsIGRhdGFiYXNlOiAndGVzdF9kYjMnLCBzdGF0dXM6ICdpbmFjdGl2ZScgfVxuXTtcblxuLy8gXHU2QTIxXHU2MkRGXHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG5jb25zdCBNT0NLX1FVRVJJRVMgPSBbXG4gIHsgaWQ6IDEsIG5hbWU6ICdcdTY3RTVcdThCRTIxJywgc3FsOiAnU0VMRUNUICogRlJPTSB1c2VycycsIGRhdGFzb3VyY2VfaWQ6IDEsIGNyZWF0ZWRfYXQ6ICcyMDIzLTAxLTAxVDAwOjAwOjAwWicsIHVwZGF0ZWRfYXQ6ICcyMDIzLTAxLTAyVDEwOjMwOjAwWicgfSxcbiAgeyBpZDogMiwgbmFtZTogJ1x1NjdFNVx1OEJFMjInLCBzcWw6ICdTRUxFQ1QgY291bnQoKikgRlJPTSBvcmRlcnMnLCBkYXRhc291cmNlX2lkOiAyLCBjcmVhdGVkX2F0OiAnMjAyMy0wMS0wM1QwMDowMDowMFonLCB1cGRhdGVkX2F0OiAnMjAyMy0wMS0wNVQxNDoyMDowMFonIH0sXG4gIHsgaWQ6IDMsIG5hbWU6ICdcdTU5MERcdTY3NDJcdTY3RTVcdThCRTInLCBzcWw6ICdTRUxFQ1QgdS5pZCwgdS5uYW1lLCBDT1VOVChvLmlkKSBhcyBvcmRlcl9jb3VudCBGUk9NIHVzZXJzIHUgSk9JTiBvcmRlcnMgbyBPTiB1LmlkID0gby51c2VyX2lkIEdST1VQIEJZIHUuaWQsIHUubmFtZScsIGRhdGFzb3VyY2VfaWQ6IDEsIGNyZWF0ZWRfYXQ6ICcyMDIzLTAxLTEwVDAwOjAwOjAwWicsIHVwZGF0ZWRfYXQ6ICcyMDIzLTAxLTEyVDA5OjE1OjAwWicgfVxuXTtcblxuLy8gXHU1OTA0XHU3NDA2Q09SU1x1OEJGN1x1NkM0MlxuZnVuY3Rpb24gaGFuZGxlQ29ycyhyZXM6IFNlcnZlclJlc3BvbnNlKSB7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbiwgWC1Nb2NrLUVuYWJsZWQnKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtTWF4LUFnZScsICc4NjQwMCcpO1xufVxuXG4vLyBcdTUzRDFcdTkwMDFKU09OXHU1NENEXHU1RTk0XG5mdW5jdGlvbiBzZW5kSnNvblJlc3BvbnNlKHJlczogU2VydmVyUmVzcG9uc2UsIHN0YXR1czogbnVtYmVyLCBkYXRhOiBhbnkpIHtcbiAgcmVzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG4vLyBcdTVFRjZcdThGREZcdTYyNjdcdTg4NENcbmZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY1NzBcdTYzNkVcdTZFOTBBUElcbmZ1bmN0aW9uIGhhbmRsZURhdGFzb3VyY2VzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICBkYXRhOiBNT0NLX0RBVEFTT1VSQ0VTLCBcbiAgICAgIHRvdGFsOiBNT0NLX0RBVEFTT1VSQ0VTLmxlbmd0aCxcbiAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1xcZCskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gcGFyc2VJbnQodXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcwJyk7XG4gICAgY29uc3QgZGF0YXNvdXJjZSA9IE1PQ0tfREFUQVNPVVJDRVMuZmluZChkID0+IGQuaWQgPT09IGlkKTtcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIGlmIChkYXRhc291cmNlKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiBkYXRhc291cmNlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZSBcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY3RTVcdThCRTJBUElcbmZ1bmN0aW9uIGhhbmRsZVF1ZXJpZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6IC9hcGkvcXVlcmllc2ApO1xuICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICBkYXRhOiBNT0NLX1FVRVJJRVMsIFxuICAgICAgdG90YWw6IE1PQ0tfUVVFUklFUy5sZW5ndGgsXG4gICAgICBzdWNjZXNzOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1xcZCskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gcGFyc2VJbnQodXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcwJyk7XG4gICAgY29uc3QgcXVlcnkgPSBNT0NLX1FVRVJJRVMuZmluZChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIGlmIChxdWVyeSkge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcXVlcnksXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjdFNVx1OEJFMlx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1xcZCtcXC9ydW4kLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCBpZCA9IHBhcnNlSW50KHVybFBhdGguc3BsaXQoJy8nKVszXSB8fCAnMCcpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gTU9DS19RVUVSSUVTLmZpbmQocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgaWYgKHF1ZXJ5KSB7XG4gICAgICAvLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTYyNjdcdTg4NENcdTdFRDNcdTY3OUNcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogW1xuICAgICAgICAgIHsgaWQ6IDEsIG5hbWU6ICdKb2huIERvZScsIGVtYWlsOiAnam9obkBleGFtcGxlLmNvbScgfSxcbiAgICAgICAgICB7IGlkOiAyLCBuYW1lOiAnSmFuZSBTbWl0aCcsIGVtYWlsOiAnamFuZUBleGFtcGxlLmNvbScgfSxcbiAgICAgICAgICB7IGlkOiAzLCBuYW1lOiAnQm9iIEpvaG5zb24nLCBlbWFpbDogJ2JvYkBleGFtcGxlLmNvbScgfVxuICAgICAgICBdLFxuICAgICAgICBjb2x1bW5zOiBbJ2lkJywgJ25hbWUnLCAnZW1haWwnXSxcbiAgICAgICAgcm93czogMyxcbiAgICAgICAgZXhlY3V0aW9uX3RpbWU6IDAuMTIzLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY3RTVcdThCRTJcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFx1NTIxQlx1NUVGQVx1NEUyRFx1OTVGNFx1NEVGNlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlTW9ja01pZGRsZXdhcmUoKTogQ29ubmVjdC5OZXh0SGFuZGxlRnVuY3Rpb24ge1xuICAvLyBcdTU5ODJcdTY3OUNNb2NrXHU2NzBEXHU1MkExXHU4OEFCXHU3OTgxXHU3NTI4XHVGRjBDXHU4RkQ0XHU1NkRFXHU3QTdBXHU0RTJEXHU5NUY0XHU0RUY2XG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY3MERcdTUyQTFcdTVERjJcdTc5ODFcdTc1MjhcdUZGMENcdThGRDRcdTU2REVcdTdBN0FcdTRFMkRcdTk1RjRcdTRFRjYnKTtcbiAgICByZXR1cm4gKHJlcSwgcmVzLCBuZXh0KSA9PiBuZXh0KCk7XG4gIH1cbiAgXG4gIGNvbnNvbGUubG9nKCdbTW9ja10gXHU1MjFCXHU1RUZBXHU0RTJEXHU5NUY0XHU0RUY2LCBcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDInKTtcbiAgXG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBtb2NrTWlkZGxld2FyZShcbiAgICByZXE6IENvbm5lY3QuSW5jb21pbmdNZXNzYWdlLFxuICAgIHJlczogU2VydmVyUmVzcG9uc2UsXG4gICAgbmV4dDogQ29ubmVjdC5OZXh0RnVuY3Rpb25cbiAgKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1ODlFM1x1Njc5MFVSTFxuICAgICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICAgIGNvbnN0IHBhcnNlZFVybCA9IHBhcnNlKHVybCwgdHJ1ZSk7XG4gICAgICBjb25zdCB1cmxQYXRoID0gcGFyc2VkVXJsLnBhdGhuYW1lIHx8ICcnO1xuICAgICAgXG4gICAgICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTU5MDRcdTc0MDZcdTZCNjRcdThCRjdcdTZDNDJcbiAgICAgIGlmICghc2hvdWxkTW9ja1JlcXVlc3QodXJsKSkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTY1MzZcdTUyMzBcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHt1cmxQYXRofWApO1xuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZDT1JTXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTZERkJcdTUyQTBDT1JTXHU1OTM0XG4gICAgICBoYW5kbGVDb3JzKHJlcyk7XG4gICAgICBcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1N0Y1MVx1N0VEQ1x1NUVGNlx1OEZERlxuICAgICAgaWYgKG1vY2tDb25maWcuZGVsYXkgPiAwKSB7XG4gICAgICAgIGF3YWl0IGRlbGF5KG1vY2tDb25maWcuZGVsYXkpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZcdTRFMERcdTU0MENcdTc2ODRBUElcdTdBRUZcdTcwQjlcbiAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XG4gICAgICBcbiAgICAgIC8vIFx1NjMwOVx1OTg3QVx1NUU4Rlx1NUMxRFx1OEJENVx1NEUwRFx1NTQwQ1x1NzY4NEFQSVx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxLCByZXMsIHVybFBhdGgpO1xuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gaGFuZGxlUXVlcmllc0FwaShyZXEsIHJlcywgdXJsUGF0aCk7XG4gICAgICBcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkNBMVx1NjcwOVx1NTkwNFx1NzQwNlx1RkYwQ1x1OEZENFx1NTZERTQwNFxuICAgICAgaWYgKCFoYW5kbGVkKSB7XG4gICAgICAgIGxvZ01vY2soJ2luZm8nLCBgXHU2NzJBXHU1QjlFXHU3M0IwXHU3Njg0QVBJXHU4REVGXHU1Rjg0OiAke3JlcS5tZXRob2R9ICR7dXJsUGF0aH1gKTtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgICBlcnJvcjogJ1x1NjcyQVx1NjI3RVx1NTIzMEFQSVx1N0FFRlx1NzBCOScsXG4gICAgICAgICAgbWVzc2FnZTogYEFQSVx1N0FFRlx1NzBCOSAke3VybFBhdGh9IFx1NjcyQVx1NjI3RVx1NTIzMFx1NjIxNlx1NjcyQVx1NUI5RVx1NzNCMGAsXG4gICAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ01vY2soJ2Vycm9yJywgYFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NTFGQVx1OTUxOTpgLCBlcnJvcik7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0gIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxuICogXG4gKiBcdTYzQTdcdTUyMzZNb2NrXHU2NzBEXHU1MkExXHU3Njg0XHU1NDJGXHU3NTI4L1x1Nzk4MVx1NzUyOFx1NzJCNlx1NjAwMVx1MzAwMVx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQlx1N0I0OVxuICovXG5cbi8vIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NjIxNlx1NTE2OFx1NUM0MFx1OEJCRVx1N0Y2RVx1NEUyRFx1ODNCN1x1NTNENlx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbmV4cG9ydCBmdW5jdGlvbiBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgLy8gXHU1NzI4Tm9kZS5qc1x1NzNBRlx1NTg4M1x1NEUyRFxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzXHU0RTJEXG4gICAgaWYgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52KSB7XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU2OEMwXHU2N0U1bG9jYWxTdG9yYWdlIChcdTRFQzVcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODMpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIGNvbnN0IGxvY2FsU3RvcmFnZVZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1VTRV9NT0NLX0FQSScpO1xuICAgICAgaWYgKGxvY2FsU3RvcmFnZVZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAobG9jYWxTdG9yYWdlVmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTlFRDhcdThCQTRcdTYwQzVcdTUxQjVcdUZGMUFcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEJcdTU0MkZcdTc1MjhcdUZGMENcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTc5ODFcdTc1MjhcbiAgICBjb25zdCBpc0RldmVsb3BtZW50ID0gXG4gICAgICAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB8fFxuICAgICAgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52ICYmIGltcG9ydC5tZXRhLmVudi5ERVYgPT09IHRydWUpO1xuICAgIFxuICAgIHJldHVybiBpc0RldmVsb3BtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIFx1NTFGQVx1OTUxOVx1NjVGNlx1NzY4NFx1NUI4OVx1NTE2OFx1NTZERVx1OTAwMFxuICAgIGNvbnNvbGUud2FybignW01vY2tdIFx1NjhDMFx1NjdFNVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NTFGQVx1OTUxOVx1RkYwQ1x1OUVEOFx1OEJBNFx1Nzk4MVx1NzUyOE1vY2tcdTY3MERcdTUyQTEnLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1NTQxMVx1NTQwRVx1NTE3Q1x1NUJCOVx1NjVFN1x1NEVFM1x1NzgwMVx1NzY4NFx1NTFGRFx1NjU3MFxuZXhwb3J0IGZ1bmN0aW9uIGlzTW9ja0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0VuYWJsZWQoKTtcbn1cblxuLy8gTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVxuZXhwb3J0IGNvbnN0IG1vY2tDb25maWcgPSB7XG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgZW5hYmxlZDogaXNFbmFibGVkKCksXG4gIFxuICAvLyBcdThCRjdcdTZDNDJcdTVFRjZcdThGREZcdUZGMDhcdTZCRUJcdTc5RDJcdUZGMDlcbiAgZGVsYXk6IDMwMCxcbiAgXG4gIC8vIEFQSVx1NTdGQVx1Nzg0MFx1OERFRlx1NUY4NFx1RkYwQ1x1NzUyOFx1NEU4RVx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1OTcwMFx1ODk4MVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuICBhcGlCYXNlUGF0aDogJy9hcGknLFxuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCOiAnbm9uZScsICdlcnJvcicsICdpbmZvJywgJ2RlYnVnJ1xuICBsb2dMZXZlbDogJ2RlYnVnJyxcbiAgXG4gIC8vIFx1NTQyRlx1NzUyOFx1NzY4NFx1NkEyMVx1NTc1N1xuICBtb2R1bGVzOiB7XG4gICAgZGF0YXNvdXJjZXM6IHRydWUsXG4gICAgcXVlcmllczogdHJ1ZSxcbiAgICB1c2VyczogdHJ1ZSxcbiAgICB2aXN1YWxpemF0aW9uczogdHJ1ZVxuICB9XG59O1xuXG4vLyBcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRNb2NrUmVxdWVzdCh1cmw6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBcdTVGQzVcdTk4N0JcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdTVGQzVcdTk4N0JcdTY2MkZBUElcdThCRjdcdTZDNDJcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aChtb2NrQ29uZmlnLmFwaUJhc2VQYXRoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU4REVGXHU1Rjg0XHU2OEMwXHU2N0U1XHU5MDFBXHU4RkM3XHVGRjBDXHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBcdThCQjBcdTVGNTVcdTY1RTVcdTVGRDdcbmV4cG9ydCBmdW5jdGlvbiBsb2dNb2NrKGxldmVsOiAnZXJyb3InIHwgJ2luZm8nIHwgJ2RlYnVnJywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgY29uc3QgeyBsb2dMZXZlbCB9ID0gbW9ja0NvbmZpZztcbiAgXG4gIGlmIChsb2dMZXZlbCA9PT0gJ25vbmUnKSByZXR1cm47XG4gIFxuICBpZiAobGV2ZWwgPT09ICdlcnJvcicgJiYgWydlcnJvcicsICdpbmZvJywgJ2RlYnVnJ10uaW5jbHVkZXMobG9nTGV2ZWwpKSB7XG4gICAgY29uc29sZS5lcnJvcignW01vY2sgRVJST1JdJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdpbmZvJyAmJiBbJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmluZm8oJ1tNb2NrIElORk9dJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdkZWJ1ZycgJiYgbG9nTGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2sgREVCVUddJywgLi4uYXJncyk7XG4gIH1cbn1cblxuLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHU2NUY2XHU4RjkzXHU1MUZBTW9ja1x1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMVxudHJ5IHtcbiAgY29uc29sZS5sb2coYFtNb2NrXSBcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDE6ICR7bW9ja0NvbmZpZy5lbmFibGVkID8gJ1x1NURGMlx1NTQyRlx1NzUyOCcgOiAnXHU1REYyXHU3OTgxXHU3NTI4J31gKTtcbiAgaWYgKG1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU5MTREXHU3RjZFOmAsIHtcbiAgICAgIGRlbGF5OiBtb2NrQ29uZmlnLmRlbGF5LFxuICAgICAgYXBpQmFzZVBhdGg6IG1vY2tDb25maWcuYXBpQmFzZVBhdGgsXG4gICAgICBsb2dMZXZlbDogbW9ja0NvbmZpZy5sb2dMZXZlbCxcbiAgICAgIGVuYWJsZWRNb2R1bGVzOiBPYmplY3QuZW50cmllcyhtb2NrQ29uZmlnLm1vZHVsZXMpXG4gICAgICAgIC5maWx0ZXIoKFtfLCBlbmFibGVkXSkgPT4gZW5hYmxlZClcbiAgICAgICAgLm1hcCgoW25hbWVdKSA9PiBuYW1lKVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdThGOTNcdTUxRkFcdTkxNERcdTdGNkVcdTRGRTFcdTYwNkZcdTUxRkFcdTk1MTknLCBlcnJvcik7XG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvc2ltcGxlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL3NpbXBsZS50c1wiO2ltcG9ydCB7IENvbm5lY3QgfSBmcm9tICd2aXRlJztcbmltcG9ydCAqIGFzIGh0dHAgZnJvbSAnaHR0cCc7XG5cbi8vIFx1N0I4MFx1NTM1NVx1NzY4NFx1NEUyRFx1OTVGNFx1NEVGNlx1NkQ0Qlx1OEJENVx1NjU4N1x1NEVGNlxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpbXBsZU1pZGRsZXdhcmUoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBzaW1wbGVNaWRkbGV3YXJlKFxuICAgIHJlcTogaHR0cC5JbmNvbWluZ01lc3NhZ2UsXG4gICAgcmVzOiBodHRwLlNlcnZlclJlc3BvbnNlLFxuICAgIG5leHQ6IENvbm5lY3QuTmV4dEZ1bmN0aW9uXG4gICkge1xuICAgIC8vIFx1NTNFQVx1NTkwNFx1NzQwNi9hcGkvdGVzdFx1OERFRlx1NUY4NFxuICAgIGlmIChyZXEudXJsID09PSAnL2FwaS90ZXN0Jykge1xuICAgICAgY29uc29sZS5sb2coJ1tcdTdCODBcdTUzNTVcdTRFMkRcdTk1RjRcdTRFRjZdIFx1NTkwNFx1NzQwNlx1NkQ0Qlx1OEJENVx1OEJGN1x1NkM0MicpO1xuICAgICAgXG4gICAgICAvLyBcdThCQkVcdTdGNkVcdTU0Q0RcdTVFOTRcdTU5MzRcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgIFxuICAgICAgLy8gXHU1M0QxXHU5MDAxXHU1NENEXHU1RTk0XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NkQ0Qlx1OEJENVx1NjIxMFx1NTI5RicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgbWV0aG9kOiByZXEubWV0aG9kLFxuICAgICAgICAgIHVybDogcmVxLnVybFxuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgICBcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gXHU0RTBEXHU1OTA0XHU3NDA2XHU3Njg0XHU4QkY3XHU2QzQyXHU0RUE0XHU3RUQ5XHU0RTBCXHU0RTAwXHU0RTJBXHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgbmV4dCgpO1xuICB9O1xufSAiXSwKICAibWFwcGlu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
