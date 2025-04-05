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
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50cyIsICJzcmMvbW9jay9jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG4vLyBcdTVGM0FcdTUyMzZcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTNcdTUxRkRcdTY1NzBcbmZ1bmN0aW9uIGtpbGxQb3J0KHBvcnQ6IG51bWJlcikge1xuICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjhDMFx1NjdFNVx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NTM2MFx1NzUyOFx1NjBDNVx1NTFCNWApO1xuICB0cnkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBleGVjU3luYyhgbmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fWApO1xuICAgICAgZXhlY1N5bmMoYHRhc2traWxsIC9GIC9waWQgJChuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9IHwgYXdrICd7cHJpbnQgJDV9JylgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4ZWNTeW5jKGBsc29mIC1pIDoke3BvcnR9IC10IHwgeGFyZ3Mga2lsbCAtOWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTMgJHtwb3J0fWApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTY3MkFcdTg4QUJcdTUzNjBcdTc1MjhcdTYyMTZcdTY1RTBcdTZDRDVcdTkxQ0FcdTY1M0VgKTtcbiAgfVxufVxuXG4vLyBcdTVGM0FcdTUyMzZcdTZFMDVcdTc0MDZWaXRlXHU3RjEzXHU1QjU4XG5mdW5jdGlvbiBjbGVhblZpdGVDYWNoZSgpIHtcbiAgY29uc29sZS5sb2coJ1tWaXRlXSBcdTZFMDVcdTc0MDZcdTRGOURcdThENTZcdTdGMTNcdTVCNTgnKTtcbiAgY29uc3QgY2FjaGVQYXRocyA9IFtcbiAgICAnLi9ub2RlX21vZHVsZXMvLnZpdGUnLFxuICAgICcuL25vZGVfbW9kdWxlcy8udml0ZV8qJyxcbiAgICAnLi8udml0ZScsXG4gICAgJy4vZGlzdCcsXG4gICAgJy4vdG1wJyxcbiAgICAnLi8udGVtcCdcbiAgXTtcbiAgXG4gIGNhY2hlUGF0aHMuZm9yRWFjaChjYWNoZVBhdGggPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhjYWNoZVBhdGgpKSB7XG4gICAgICAgIGlmIChmcy5sc3RhdFN5bmMoY2FjaGVQYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgZXhlY1N5bmMoYHJtIC1yZiAke2NhY2hlUGF0aH1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy51bmxpbmtTeW5jKGNhY2hlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTUyMjBcdTk2NjQ6ICR7Y2FjaGVQYXRofWApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2NUUwXHU2Q0Q1XHU1MjIwXHU5NjY0OiAke2NhY2hlUGF0aH1gLCBlKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBcdTZFMDVcdTc0MDZWaXRlXHU3RjEzXHU1QjU4XG5jbGVhblZpdGVDYWNoZSgpO1xuXG4vLyBcdTVDMURcdThCRDVcdTkxQ0FcdTY1M0VcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTdBRUZcdTUzRTNcbmtpbGxQb3J0KDgwODApO1xuXG4vLyBcdTU3RkFcdTY3MkNcdTkxNERcdTdGNkVcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHU1MkEwXHU4RjdEXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG4gIHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID0gcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgfHwgJ2ZhbHNlJztcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIFxuICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhNb2NrIEFQSSAtIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1OEJGQlx1NTNENlxuICBjb25zdCB1c2VNb2NrQXBpID0gcHJvY2Vzcy5lbnYuVklURV9VU0VfTU9DS19BUEkgPT09ICd0cnVlJztcbiAgXG4gIC8vIFx1NjYyRlx1NTQyNlx1Nzk4MVx1NzUyOEhNUiAtIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1OEJGQlx1NTNENlxuICBjb25zdCBkaXNhYmxlSG1yID0gcHJvY2Vzcy5lbnYuVklURV9ESVNBQkxFX0hNUiA9PT0gJ3RydWUnO1xuICBcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdThGRDBcdTg4NENcdTZBMjFcdTVGMEY6ICR7bW9kZX1gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBNb2NrIEFQSTogJHt1c2VNb2NrQXBpID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICAvLyBcdTUxQzZcdTU5MDdcdTRFMkRcdTk1RjRcdTRFRjZcbiAgY29uc3QgbWlkZGxld2FyZSA9IHVzZU1vY2tBcGkgPyBjcmVhdGVNb2NrTWlkZGxld2FyZSgpIDogbnVsbDtcbiAgXG4gIC8vIFx1OTE0RFx1N0Y2RVxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgIF0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICAvLyBITVJcdTkxNERcdTdGNkVcbiAgICAgIGhtcjogZGlzYWJsZUhtciA/IGZhbHNlIDoge1xuICAgICAgICBwcm90b2NvbDogJ3dzJyxcbiAgICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICAgIHBvcnQ6IDgwODAsXG4gICAgICAgIGNsaWVudFBvcnQ6IDgwODAsXG4gICAgICB9LFxuICAgICAgLy8gXHU5MTREXHU3RjZFXHU0RUUzXHU3NDA2XG4gICAgICBwcm94eToge1xuICAgICAgICAvLyBcdTVDMDZBUElcdThCRjdcdTZDNDJcdThGNkNcdTUzRDFcdTUyMzBcdTU0MEVcdTdBRUZcdTY3MERcdTUyQTFcbiAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgICBieXBhc3M6IChyZXEpID0+IHtcbiAgICAgICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NTQyRlx1NzUyOFx1NEU4Nk1vY2sgQVBJXHVGRjBDXHU1MjE5XHU0RTBEXHU0RUUzXHU3NDA2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgICAgICBpZiAodXNlTW9ja0FwaSAmJiByZXEudXJsPy5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1NjcwRFx1NTJBMVx1NTY2OFx1NEUyRFx1OTVGNFx1NEVGNlxuICAgICAgY29uZmlndXJlU2VydmVyOiAoc2VydmVyKSA9PiB7XG4gICAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NTE2OFx1NUM0MFx1N0YxM1x1NUI1OFx1NjNBN1x1NTIzNlxuICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tc3RvcmUsIG5vLWNhY2hlLCBtdXN0LXJldmFsaWRhdGUnKTtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdFeHBpcmVzJywgJzAnKTtcbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NDJGXHU3NTI4XHU0RTg2TW9jayBBUElcdUZGMENcdTZERkJcdTUyQTBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1OTA0XHU3NDA2QVBJXHU4QkY3XHU2QzQyXG4gICAgICAgIGlmICh1c2VNb2NrQXBpICYmIG1pZGRsZXdhcmUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW1ZpdGVcdTkxNERcdTdGNkVdIFx1NkRGQlx1NTJBME1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTRFQzVcdTc1MjhcdTRFOEVcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDInKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTUzRUFcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDJcbiAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU5NzVFQVBJXHU4QkY3XHU2QzQyXHU0RTBEXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICBpZiAoIXVybC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2MkU2XHU2MjJBQVBJXHU4QkY3XHU2QzQyOiAke3JlcS5tZXRob2R9ICR7dXJsfWApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdTRGN0ZcdTc1MjhcdTRFMkRcdTk1RjRcdTRFRjZcdTU5MDRcdTc0MDZBUElcdThCRjdcdTZDNDJcbiAgICAgICAgICAgIG1pZGRsZXdhcmUocmVxLCByZXMsIG5leHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbVml0ZVx1OTE0RFx1N0Y2RV0gTW9jayBBUElcdTVERjJcdTc5ODFcdTc1MjhcdUZGMENcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTVDMDZcdThGNkNcdTUzRDFcdTUyMzBcdTU0MEVcdTdBRUYnKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MsIGF1dG9wcmVmaXhlcl0sXG4gICAgICB9LFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIC8vIFx1NTMwNVx1NTQyQlx1NTdGQVx1NjcyQ1x1NEY5RFx1OEQ1NlxuICAgICAgaW5jbHVkZTogW1xuICAgICAgICAndnVlJywgXG4gICAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICAgJ3BpbmlhJyxcbiAgICAgICAgJ2F4aW9zJyxcbiAgICAgICAgJ2RheWpzJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlL2VzL2xvY2FsZS96aF9DTidcbiAgICAgIF0sXG4gICAgICAvLyBcdTYzOTJcdTk2NjRcdTcyNzlcdTVCOUFcdTRGOURcdThENTZcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgLy8gXHU2MzkyXHU5NjY0XHU2M0QyXHU0RUY2XHU0RTJEXHU3Njg0XHU2NzBEXHU1MkExXHU1NjY4TW9ja1xuICAgICAgICAnc3JjL3BsdWdpbnMvc2VydmVyTW9jay50cycsXG4gICAgICAgIC8vIFx1NjM5Mlx1OTY2NGZzZXZlbnRzXHU2NzJDXHU1NzMwXHU2QTIxXHU1NzU3XHVGRjBDXHU5MDdGXHU1MTREXHU2Nzg0XHU1RUZBXHU5NTE5XHU4QkVGXG4gICAgICAgICdmc2V2ZW50cydcbiAgICAgIF0sXG4gICAgICAvLyBcdTc4NkVcdTRGRERcdTRGOURcdThENTZcdTk4ODRcdTY3ODRcdTVFRkFcdTZCNjNcdTc4NkVcdTVCOENcdTYyMTBcbiAgICAgIGZvcmNlOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gXHU0RjdGXHU3NTI4XHU1MzU1XHU3MkVDXHU3Njg0XHU3RjEzXHU1QjU4XHU3NkVFXHU1RjU1XG4gICAgY2FjaGVEaXI6ICdub2RlX21vZHVsZXMvLnZpdGVfY2FjaGUnLFxuICAgIC8vIFx1OTYzMlx1NkI2Mlx1NTgwNlx1NjgwOFx1NkVBMlx1NTFGQVxuICAgIGVzYnVpbGQ6IHtcbiAgICAgIGxvZ092ZXJyaWRlOiB7XG4gICAgICAgICd0aGlzLWlzLXVuZGVmaW5lZC1pbi1lc20nOiAnc2lsZW50J1xuICAgICAgfSxcbiAgICB9XG4gIH1cbn0pIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2svbWlkZGxld2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmUvaW5kZXgudHNcIjsvKipcbiAqIE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTdCQTFcdTc0MDZcdTZBMjFcdTU3NTdcbiAqIFxuICogXHU2M0QwXHU0RjlCXHU3RURGXHU0RTAwXHU3Njg0SFRUUFx1OEJGN1x1NkM0Mlx1NjJFNlx1NjIyQVx1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1NkEyMVx1NjJERkFQSVx1NTRDRFx1NUU5NFxuICogXHU4RDFGXHU4RDIzXHU3QkExXHU3NDA2XHU1NDhDXHU1MjA2XHU1M0QxXHU2MjQwXHU2NzA5QVBJXHU4QkY3XHU2QzQyXHU1MjMwXHU1QkY5XHU1RTk0XHU3Njg0XHU2NzBEXHU1MkExXHU1OTA0XHU3NDA2XHU1MUZEXHU2NTcwXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBDb25uZWN0IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBtb2NrQ29uZmlnLCBzaG91bGRNb2NrUmVxdWVzdCwgbG9nTW9jayB9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8vIFx1NkEyMVx1NjJERlx1NjU3MFx1NjM2RVx1NkU5MFx1NTIxN1x1ODg2OFxuY29uc3QgTU9DS19EQVRBU09VUkNFUyA9IFtcbiAgeyBpZDogMSwgbmFtZTogJ1x1NjU3MFx1NjM2RVx1NkU5MDEnLCB0eXBlOiAnbXlzcWwnLCBob3N0OiAnbG9jYWxob3N0JywgcG9ydDogMzMwNiwgdXNlcm5hbWU6ICdyb290JywgZGF0YWJhc2U6ICd0ZXN0X2RiMScsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgeyBpZDogMiwgbmFtZTogJ1x1NjU3MFx1NjM2RVx1NkU5MDInLCB0eXBlOiAncG9zdGdyZXMnLCBob3N0OiAnZGIuZXhhbXBsZS5jb20nLCBwb3J0OiA1NDMyLCB1c2VybmFtZTogJ2FkbWluJywgZGF0YWJhc2U6ICd0ZXN0X2RiMicsIHN0YXR1czogJ2FjdGl2ZScgfSxcbiAgeyBpZDogMywgbmFtZTogJ1x1NjU3MFx1NjM2RVx1NkU5MDMnLCB0eXBlOiAnbW9uZ29kYicsIGhvc3Q6ICcxOTIuMTY4LjEuMTAwJywgcG9ydDogMjcwMTcsIHVzZXJuYW1lOiAnbW9uZ29kYicsIGRhdGFiYXNlOiAndGVzdF9kYjMnLCBzdGF0dXM6ICdpbmFjdGl2ZScgfVxuXTtcblxuLy8gXHU2QTIxXHU2MkRGXHU2N0U1XHU4QkUyXHU1MjE3XHU4ODY4XG5jb25zdCBNT0NLX1FVRVJJRVMgPSBbXG4gIHsgaWQ6IDEsIG5hbWU6ICdcdTY3RTVcdThCRTIxJywgc3FsOiAnU0VMRUNUICogRlJPTSB1c2VycycsIGRhdGFzb3VyY2VfaWQ6IDEsIGNyZWF0ZWRfYXQ6ICcyMDIzLTAxLTAxVDAwOjAwOjAwWicsIHVwZGF0ZWRfYXQ6ICcyMDIzLTAxLTAyVDEwOjMwOjAwWicgfSxcbiAgeyBpZDogMiwgbmFtZTogJ1x1NjdFNVx1OEJFMjInLCBzcWw6ICdTRUxFQ1QgY291bnQoKikgRlJPTSBvcmRlcnMnLCBkYXRhc291cmNlX2lkOiAyLCBjcmVhdGVkX2F0OiAnMjAyMy0wMS0wM1QwMDowMDowMFonLCB1cGRhdGVkX2F0OiAnMjAyMy0wMS0wNVQxNDoyMDowMFonIH0sXG4gIHsgaWQ6IDMsIG5hbWU6ICdcdTU5MERcdTY3NDJcdTY3RTVcdThCRTInLCBzcWw6ICdTRUxFQ1QgdS5pZCwgdS5uYW1lLCBDT1VOVChvLmlkKSBhcyBvcmRlcl9jb3VudCBGUk9NIHVzZXJzIHUgSk9JTiBvcmRlcnMgbyBPTiB1LmlkID0gby51c2VyX2lkIEdST1VQIEJZIHUuaWQsIHUubmFtZScsIGRhdGFzb3VyY2VfaWQ6IDEsIGNyZWF0ZWRfYXQ6ICcyMDIzLTAxLTEwVDAwOjAwOjAwWicsIHVwZGF0ZWRfYXQ6ICcyMDIzLTAxLTEyVDA5OjE1OjAwWicgfVxuXTtcblxuLy8gXHU1OTA0XHU3NDA2Q09SU1x1OEJGN1x1NkM0MlxuZnVuY3Rpb24gaGFuZGxlQ29ycyhyZXM6IFNlcnZlclJlc3BvbnNlKSB7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycpO1xuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbiwgWC1Nb2NrLUVuYWJsZWQnKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtTWF4LUFnZScsICc4NjQwMCcpO1xufVxuXG4vLyBcdTUzRDFcdTkwMDFKU09OXHU1NENEXHU1RTk0XG5mdW5jdGlvbiBzZW5kSnNvblJlc3BvbnNlKHJlczogU2VydmVyUmVzcG9uc2UsIHN0YXR1czogbnVtYmVyLCBkYXRhOiBhbnkpIHtcbiAgcmVzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG4vLyBcdTVFRjZcdThGREZcdTYyNjdcdTg4NENcbmZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY1NzBcdTYzNkVcdTZFOTBBUElcbmZ1bmN0aW9uIGhhbmRsZURhdGFzb3VyY2VzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9kYXRhc291cmNlcycgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGxvZ01vY2soJ2RlYnVnJywgYFx1NTkwNFx1NzQwNkdFVFx1OEJGN1x1NkM0MjogL2FwaS9kYXRhc291cmNlc2ApO1xuICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICBkYXRhOiBNT0NLX0RBVEFTT1VSQ0VTLCBcbiAgICAgIHRvdGFsOiBNT0NLX0RBVEFTT1VSQ0VTLmxlbmd0aCxcbiAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1xcZCskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gcGFyc2VJbnQodXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcwJyk7XG4gICAgY29uc3QgZGF0YXNvdXJjZSA9IE1PQ0tfREFUQVNPVVJDRVMuZmluZChkID0+IGQuaWQgPT09IGlkKTtcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIGlmIChkYXRhc291cmNlKSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IFxuICAgICAgICBkYXRhOiBkYXRhc291cmNlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY1NzBcdTYzNkVcdTZFOTBcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZSBcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBcdTU5MDRcdTc0MDZcdTY3RTVcdThCRTJBUElcbmZ1bmN0aW9uIGhhbmRsZVF1ZXJpZXNBcGkocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIHVybFBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kPy50b1VwcGVyQ2FzZSgpO1xuICBcbiAgaWYgKHVybFBhdGggPT09ICcvYXBpL3F1ZXJpZXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6IC9hcGkvcXVlcmllc2ApO1xuICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHsgXG4gICAgICBkYXRhOiBNT0NLX1FVRVJJRVMsIFxuICAgICAgdG90YWw6IE1PQ0tfUVVFUklFUy5sZW5ndGgsXG4gICAgICBzdWNjZXNzOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1xcZCskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gcGFyc2VJbnQodXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcwJyk7XG4gICAgY29uc3QgcXVlcnkgPSBNT0NLX1FVRVJJRVMuZmluZChxID0+IHEuaWQgPT09IGlkKTtcbiAgICBcbiAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTU5MDRcdTc0MDZHRVRcdThCRjdcdTZDNDI6ICR7dXJsUGF0aH0sIElEOiAke2lkfWApO1xuICAgIFxuICAgIGlmIChxdWVyeSkge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBcbiAgICAgICAgZGF0YTogcXVlcnksXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjdFNVx1OEJFMlx1NEUwRFx1NUI1OFx1NTcyOCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1xcZCtcXC9ydW4kLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCBpZCA9IHBhcnNlSW50KHVybFBhdGguc3BsaXQoJy8nKVszXSB8fCAnMCcpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gTU9DS19RVUVSSUVTLmZpbmQocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgbG9nTW9jaygnZGVidWcnLCBgXHU1OTA0XHU3NDA2UE9TVFx1OEJGN1x1NkM0MjogJHt1cmxQYXRofSwgSUQ6ICR7aWR9YCk7XG4gICAgXG4gICAgaWYgKHF1ZXJ5KSB7XG4gICAgICAvLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTYyNjdcdTg4NENcdTdFRDNcdTY3OUNcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogW1xuICAgICAgICAgIHsgaWQ6IDEsIG5hbWU6ICdKb2huIERvZScsIGVtYWlsOiAnam9obkBleGFtcGxlLmNvbScgfSxcbiAgICAgICAgICB7IGlkOiAyLCBuYW1lOiAnSmFuZSBTbWl0aCcsIGVtYWlsOiAnamFuZUBleGFtcGxlLmNvbScgfSxcbiAgICAgICAgICB7IGlkOiAzLCBuYW1lOiAnQm9iIEpvaG5zb24nLCBlbWFpbDogJ2JvYkBleGFtcGxlLmNvbScgfVxuICAgICAgICBdLFxuICAgICAgICBjb2x1bW5zOiBbJ2lkJywgJ25hbWUnLCAnZW1haWwnXSxcbiAgICAgICAgcm93czogMyxcbiAgICAgICAgZXhlY3V0aW9uX3RpbWU6IDAuMTIzLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgZXJyb3I6ICdcdTY3RTVcdThCRTJcdTRFMERcdTVCNThcdTU3MjgnLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFx1NTIxQlx1NUVGQVx1NEUyRFx1OTVGNFx1NEVGNlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlTW9ja01pZGRsZXdhcmUoKTogQ29ubmVjdC5OZXh0SGFuZGxlRnVuY3Rpb24ge1xuICAvLyBcdTU5ODJcdTY3OUNNb2NrXHU2NzBEXHU1MkExXHU4OEFCXHU3OTgxXHU3NTI4XHVGRjBDXHU4RkQ0XHU1NkRFXHU3QTdBXHU0RTJEXHU5NUY0XHU0RUY2XG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY3MERcdTUyQTFcdTVERjJcdTc5ODFcdTc1MjhcdUZGMENcdThGRDRcdTU2REVcdTdBN0FcdTRFMkRcdTk1RjRcdTRFRjYnKTtcbiAgICByZXR1cm4gKHJlcSwgcmVzLCBuZXh0KSA9PiBuZXh0KCk7XG4gIH1cbiAgXG4gIGNvbnNvbGUubG9nKCdbTW9ja10gXHU1MjFCXHU1RUZBXHU0RTJEXHU5NUY0XHU0RUY2LCBcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDInKTtcbiAgXG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBtb2NrTWlkZGxld2FyZShcbiAgICByZXE6IENvbm5lY3QuSW5jb21pbmdNZXNzYWdlLFxuICAgIHJlczogU2VydmVyUmVzcG9uc2UsXG4gICAgbmV4dDogQ29ubmVjdC5OZXh0RnVuY3Rpb25cbiAgKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1ODlFM1x1Njc5MFVSTFxuICAgICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJztcbiAgICAgIGNvbnN0IHBhcnNlZFVybCA9IHBhcnNlKHVybCwgdHJ1ZSk7XG4gICAgICBjb25zdCB1cmxQYXRoID0gcGFyc2VkVXJsLnBhdGhuYW1lIHx8ICcnO1xuICAgICAgXG4gICAgICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTU5MDRcdTc0MDZcdTZCNjRcdThCRjdcdTZDNDJcbiAgICAgIGlmICghc2hvdWxkTW9ja1JlcXVlc3QodXJsKSkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsb2dNb2NrKCdkZWJ1ZycsIGBcdTY1MzZcdTUyMzBcdThCRjdcdTZDNDI6ICR7cmVxLm1ldGhvZH0gJHt1cmxQYXRofWApO1xuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZDT1JTXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgICAgIGhhbmRsZUNvcnMocmVzKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTZERkJcdTUyQTBDT1JTXHU1OTM0XG4gICAgICBoYW5kbGVDb3JzKHJlcyk7XG4gICAgICBcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1N0Y1MVx1N0VEQ1x1NUVGNlx1OEZERlxuICAgICAgaWYgKG1vY2tDb25maWcuZGVsYXkgPiAwKSB7XG4gICAgICAgIGF3YWl0IGRlbGF5KG1vY2tDb25maWcuZGVsYXkpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZcdTRFMERcdTU0MENcdTc2ODRBUElcdTdBRUZcdTcwQjlcbiAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XG4gICAgICBcbiAgICAgIC8vIFx1NjMwOVx1OTg3QVx1NUU4Rlx1NUMxRFx1OEJENVx1NEUwRFx1NTQwQ1x1NzY4NEFQSVx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxLCByZXMsIHVybFBhdGgpO1xuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gaGFuZGxlUXVlcmllc0FwaShyZXEsIHJlcywgdXJsUGF0aCk7XG4gICAgICBcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkNBMVx1NjcwOVx1NTkwNFx1NzQwNlx1RkYwQ1x1OEZENFx1NTZERTQwNFxuICAgICAgaWYgKCFoYW5kbGVkKSB7XG4gICAgICAgIGxvZ01vY2soJ2luZm8nLCBgXHU2NzJBXHU1QjlFXHU3M0IwXHU3Njg0QVBJXHU4REVGXHU1Rjg0OiAke3JlcS5tZXRob2R9ICR7dXJsUGF0aH1gKTtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBcbiAgICAgICAgICBlcnJvcjogJ1x1NjcyQVx1NjI3RVx1NTIzMEFQSVx1N0FFRlx1NzBCOScsXG4gICAgICAgICAgbWVzc2FnZTogYEFQSVx1N0FFRlx1NzBCOSAke3VybFBhdGh9IFx1NjcyQVx1NjI3RVx1NTIzMFx1NjIxNlx1NjcyQVx1NUI5RVx1NzNCMGAsXG4gICAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ01vY2soJ2Vycm9yJywgYFx1NTkwNFx1NzQwNlx1OEJGN1x1NkM0Mlx1NTFGQVx1OTUxOTpgLCBlcnJvcik7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNTAwLCB7IFxuICAgICAgICBlcnJvcjogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0gIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxuICogXG4gKiBcdTYzQTdcdTUyMzZNb2NrXHU2NzBEXHU1MkExXHU3Njg0XHU1NDJGXHU3NTI4L1x1Nzk4MVx1NzUyOFx1NzJCNlx1NjAwMVx1MzAwMVx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQlx1N0I0OVxuICovXG5cbi8vIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NjIxNlx1NTE2OFx1NUM0MFx1OEJCRVx1N0Y2RVx1NEUyRFx1ODNCN1x1NTNENlx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbmV4cG9ydCBmdW5jdGlvbiBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgLy8gXHU1NzI4Tm9kZS5qc1x1NzNBRlx1NTg4M1x1NEUyRFxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzXHU0RTJEXG4gICAgaWYgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52KSB7XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU2OEMwXHU2N0U1bG9jYWxTdG9yYWdlIChcdTRFQzVcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODMpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIGNvbnN0IGxvY2FsU3RvcmFnZVZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1VTRV9NT0NLX0FQSScpO1xuICAgICAgaWYgKGxvY2FsU3RvcmFnZVZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAobG9jYWxTdG9yYWdlVmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTlFRDhcdThCQTRcdTYwQzVcdTUxQjVcdUZGMUFcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEJcdTU0MkZcdTc1MjhcdUZGMENcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTc5ODFcdTc1MjhcbiAgICBjb25zdCBpc0RldmVsb3BtZW50ID0gXG4gICAgICAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB8fFxuICAgICAgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52ICYmIGltcG9ydC5tZXRhLmVudi5ERVYgPT09IHRydWUpO1xuICAgIFxuICAgIHJldHVybiBpc0RldmVsb3BtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIFx1NTFGQVx1OTUxOVx1NjVGNlx1NzY4NFx1NUI4OVx1NTE2OFx1NTZERVx1OTAwMFxuICAgIGNvbnNvbGUud2FybignW01vY2tdIFx1NjhDMFx1NjdFNVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NTFGQVx1OTUxOVx1RkYwQ1x1OUVEOFx1OEJBNFx1Nzk4MVx1NzUyOE1vY2tcdTY3MERcdTUyQTEnLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1NTQxMVx1NTQwRVx1NTE3Q1x1NUJCOVx1NjVFN1x1NEVFM1x1NzgwMVx1NzY4NFx1NTFGRFx1NjU3MFxuZXhwb3J0IGZ1bmN0aW9uIGlzTW9ja0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0VuYWJsZWQoKTtcbn1cblxuLy8gTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVxuZXhwb3J0IGNvbnN0IG1vY2tDb25maWcgPSB7XG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgZW5hYmxlZDogaXNFbmFibGVkKCksXG4gIFxuICAvLyBcdThCRjdcdTZDNDJcdTVFRjZcdThGREZcdUZGMDhcdTZCRUJcdTc5RDJcdUZGMDlcbiAgZGVsYXk6IDMwMCxcbiAgXG4gIC8vIEFQSVx1NTdGQVx1Nzg0MFx1OERFRlx1NUY4NFx1RkYwQ1x1NzUyOFx1NEU4RVx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1OTcwMFx1ODk4MVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuICBhcGlCYXNlUGF0aDogJy9hcGknLFxuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCOiAnbm9uZScsICdlcnJvcicsICdpbmZvJywgJ2RlYnVnJ1xuICBsb2dMZXZlbDogJ2RlYnVnJyxcbiAgXG4gIC8vIFx1NTQyRlx1NzUyOFx1NzY4NFx1NkEyMVx1NTc1N1xuICBtb2R1bGVzOiB7XG4gICAgZGF0YXNvdXJjZXM6IHRydWUsXG4gICAgcXVlcmllczogdHJ1ZSxcbiAgICB1c2VyczogdHJ1ZSxcbiAgICB2aXN1YWxpemF0aW9uczogdHJ1ZVxuICB9XG59O1xuXG4vLyBcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRNb2NrUmVxdWVzdCh1cmw6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBcdTVGQzVcdTk4N0JcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdTVGQzVcdTk4N0JcdTY2MkZBUElcdThCRjdcdTZDNDJcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aChtb2NrQ29uZmlnLmFwaUJhc2VQYXRoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU4REVGXHU1Rjg0XHU2OEMwXHU2N0U1XHU5MDFBXHU4RkM3XHVGRjBDXHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBcdThCQjBcdTVGNTVcdTY1RTVcdTVGRDdcbmV4cG9ydCBmdW5jdGlvbiBsb2dNb2NrKGxldmVsOiAnZXJyb3InIHwgJ2luZm8nIHwgJ2RlYnVnJywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgY29uc3QgeyBsb2dMZXZlbCB9ID0gbW9ja0NvbmZpZztcbiAgXG4gIGlmIChsb2dMZXZlbCA9PT0gJ25vbmUnKSByZXR1cm47XG4gIFxuICBpZiAobGV2ZWwgPT09ICdlcnJvcicgJiYgWydlcnJvcicsICdpbmZvJywgJ2RlYnVnJ10uaW5jbHVkZXMobG9nTGV2ZWwpKSB7XG4gICAgY29uc29sZS5lcnJvcignW01vY2sgRVJST1JdJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdpbmZvJyAmJiBbJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmluZm8oJ1tNb2NrIElORk9dJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdkZWJ1ZycgJiYgbG9nTGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2sgREVCVUddJywgLi4uYXJncyk7XG4gIH1cbn1cblxuLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHU2NUY2XHU4RjkzXHU1MUZBTW9ja1x1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMVxudHJ5IHtcbiAgY29uc29sZS5sb2coYFtNb2NrXSBcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDE6ICR7bW9ja0NvbmZpZy5lbmFibGVkID8gJ1x1NURGMlx1NTQyRlx1NzUyOCcgOiAnXHU1REYyXHU3OTgxXHU3NTI4J31gKTtcbiAgaWYgKG1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU5MTREXHU3RjZFOmAsIHtcbiAgICAgIGRlbGF5OiBtb2NrQ29uZmlnLmRlbGF5LFxuICAgICAgYXBpQmFzZVBhdGg6IG1vY2tDb25maWcuYXBpQmFzZVBhdGgsXG4gICAgICBsb2dMZXZlbDogbW9ja0NvbmZpZy5sb2dMZXZlbCxcbiAgICAgIGVuYWJsZWRNb2R1bGVzOiBPYmplY3QuZW50cmllcyhtb2NrQ29uZmlnLm1vZHVsZXMpXG4gICAgICAgIC5maWx0ZXIoKFtfLCBlbmFibGVkXSkgPT4gZW5hYmxlZClcbiAgICAgICAgLm1hcCgoW25hbWVdKSA9PiBuYW1lKVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdThGOTNcdTUxRkFcdTkxNERcdTdGNkVcdTRGRTFcdTYwNkZcdTUxRkFcdTk1MTknLCBlcnJvcik7XG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUEwWSxTQUFTLGNBQWMsZUFBZTtBQUNoYixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZ0JBQWdCO0FBQ3pCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCOzs7QUNJekIsU0FBUyxhQUFhOzs7QUNGZixTQUFTLFlBQXFCO0FBQ25DLE1BQUk7QUFFRixRQUFJLE9BQU8sWUFBWSxlQUFlLFFBQVEsS0FBSztBQUNqRCxVQUFJLFFBQVEsSUFBSSxzQkFBc0IsUUFBUTtBQUM1QyxlQUFPO0FBQUEsTUFDVDtBQUNBLFVBQUksUUFBUSxJQUFJLHNCQUFzQixTQUFTO0FBQzdDLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUdBLFFBQUksT0FBTyxnQkFBZ0IsZUFBZSxZQUFZLEtBQUs7QUFDekQsVUFBSSxZQUFZLElBQUksc0JBQXNCLFFB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
