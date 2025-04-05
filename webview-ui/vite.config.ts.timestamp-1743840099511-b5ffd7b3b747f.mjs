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
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
    sendJsonResponse(res, 200, { data: MOCK_DATASOURCES, total: MOCK_DATASOURCES.length });
    return true;
  }
  if (urlPath.match(/^\/api\/datasources\/\d+$/) && method === "GET") {
    const id = parseInt(urlPath.split("/").pop() || "0");
    const datasource = MOCK_DATASOURCES.find((d) => d.id === id);
    if (datasource) {
      sendJsonResponse(res, 200, { data: datasource });
    } else {
      sendJsonResponse(res, 404, { error: "\u6570\u636E\u6E90\u4E0D\u5B58\u5728" });
    }
    return true;
  }
  return false;
}
function handleQueriesApi(req, res, urlPath) {
  var _a;
  const method = (_a = req.method) == null ? void 0 : _a.toUpperCase();
  if (urlPath === "/api/queries" && method === "GET") {
    sendJsonResponse(res, 200, { data: MOCK_QUERIES, total: MOCK_QUERIES.length });
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/\d+$/) && method === "GET") {
    const id = parseInt(urlPath.split("/").pop() || "0");
    const query = MOCK_QUERIES.find((q) => q.id === id);
    if (query) {
      sendJsonResponse(res, 200, { data: query });
    } else {
      sendJsonResponse(res, 404, { error: "\u67E5\u8BE2\u4E0D\u5B58\u5728" });
    }
    return true;
  }
  if (urlPath.match(/^\/api\/queries\/\d+\/run$/) && method === "POST") {
    const id = parseInt(urlPath.split("/")[3] || "0");
    const query = MOCK_QUERIES.find((q) => q.id === id);
    if (query) {
      sendJsonResponse(res, 200, {
        data: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
          { id: 3, name: "Bob Johnson", email: "bob@example.com" }
        ],
        columns: ["id", "name", "email"],
        rows: 3,
        execution_time: 0.123
      });
    } else {
      sendJsonResponse(res, 404, { error: "\u67E5\u8BE2\u4E0D\u5B58\u5728" });
    }
    return true;
  }
  return false;
}
function createMockMiddleware() {
  return async function mockMiddleware(req, res, next) {
    if (!mockConfig.enabled) {
      console.log("[Mock] \u670D\u52A1\u5DF2\u7981\u7528\uFF0C\u8DF3\u8FC7\u8BF7\u6C42:", req.url);
      return next();
    }
    const parsedUrl = parse(req.url || "", true);
    const urlPath = parsedUrl.pathname || "";
    if (mockConfig.logLevel === "debug") {
      console.log(`[Mock DEBUG] \u6536\u5230\u8BF7\u6C42: ${req.method} ${urlPath}`);
    }
    if (!shouldMockRequest(urlPath)) {
      if (mockConfig.logLevel === "debug") {
        console.log(`[Mock DEBUG] \u4E0D\u5904\u7406\u6B64\u8BF7\u6C42 (\u975EAPI\u8DEF\u5F84): ${urlPath}`);
      }
      return next();
    }
    if (req.method === "OPTIONS") {
      handleCors(res);
      res.statusCode = 204;
      res.end();
      return;
    }
    handleCors(res);
    try {
      if (mockConfig.delay > 0) {
        await delay(mockConfig.delay);
      }
      let handled = false;
      if (!handled)
        handled = handleDatasourcesApi(req, res, urlPath);
      if (!handled)
        handled = handleQueriesApi(req, res, urlPath);
      if (!handled) {
        console.log(`[Mock] \u672A\u5B9E\u73B0\u7684API\u8DEF\u5F84: ${req.method} ${urlPath}`);
        sendJsonResponse(res, 404, { error: "\u672A\u627E\u5230API\u7AEF\u70B9" });
      }
    } catch (error) {
      console.error("[Mock ERROR]", error);
      sendJsonResponse(res, 500, { error: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF" });
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
      // 配置中间件
      middlewareMode: false,
      // 使用Mock中间件拦截API请求
      configureServer: (server) => {
        server.middlewares.use((req, res, next) => {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
          next();
        });
        if (useMockApi) {
          console.log("[Vite\u914D\u7F6E] \u6DFB\u52A0Mock\u4E2D\u95F4\u4EF6\uFF0C\u4EC5\u7528\u4E8E\u5904\u7406API\u8BF7\u6C42");
          const middleware = createMockMiddleware();
          server.middlewares.use((req, res, next) => {
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
    cacheDir: "node_modules/.vite_cache"
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21vY2svbWlkZGxld2FyZS9pbmRleC50cyIsICJzcmMvbW9jay9jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlTW9ja01pZGRsZXdhcmUgZnJvbSAnLi9zcmMvbW9jay9taWRkbGV3YXJlJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG4vLyBcdTVGM0FcdTUyMzZcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTNcdTUxRkRcdTY1NzBcbmZ1bmN0aW9uIGtpbGxQb3J0KHBvcnQ6IG51bWJlcikge1xuICBjb25zb2xlLmxvZyhgW1ZpdGVdIFx1NjhDMFx1NjdFNVx1N0FFRlx1NTNFMyAke3BvcnR9IFx1NTM2MFx1NzUyOFx1NjBDNVx1NTFCNWApO1xuICB0cnkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBleGVjU3luYyhgbmV0c3RhdCAtYW5vIHwgZmluZHN0ciA6JHtwb3J0fWApO1xuICAgICAgZXhlY1N5bmMoYHRhc2traWxsIC9GIC9waWQgJChuZXRzdGF0IC1hbm8gfCBmaW5kc3RyIDoke3BvcnR9IHwgYXdrICd7cHJpbnQgJDV9JylgLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4ZWNTeW5jKGBsc29mIC1pIDoke3BvcnR9IC10IHwgeGFyZ3Mga2lsbCAtOWAsIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTkxQ0FcdTY1M0VcdTdBRUZcdTUzRTMgJHtwb3J0fWApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTdBRUZcdTUzRTMgJHtwb3J0fSBcdTY3MkFcdTg4QUJcdTUzNjBcdTc1MjhcdTYyMTZcdTY1RTBcdTZDRDVcdTkxQ0FcdTY1M0VgKTtcbiAgfVxufVxuXG4vLyBcdTVGM0FcdTUyMzZcdTZFMDVcdTc0MDZWaXRlXHU3RjEzXHU1QjU4XG5mdW5jdGlvbiBjbGVhblZpdGVDYWNoZSgpIHtcbiAgY29uc29sZS5sb2coJ1tWaXRlXSBcdTZFMDVcdTc0MDZcdTRGOURcdThENTZcdTdGMTNcdTVCNTgnKTtcbiAgY29uc3QgY2FjaGVQYXRocyA9IFtcbiAgICAnLi9ub2RlX21vZHVsZXMvLnZpdGUnLFxuICAgICcuL25vZGVfbW9kdWxlcy8udml0ZV8qJyxcbiAgICAnLi8udml0ZScsXG4gICAgJy4vZGlzdCcsXG4gICAgJy4vdG1wJyxcbiAgICAnLi8udGVtcCdcbiAgXTtcbiAgXG4gIGNhY2hlUGF0aHMuZm9yRWFjaChjYWNoZVBhdGggPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhjYWNoZVBhdGgpKSB7XG4gICAgICAgIGlmIChmcy5sc3RhdFN5bmMoY2FjaGVQYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgZXhlY1N5bmMoYHJtIC1yZiAke2NhY2hlUGF0aH1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy51bmxpbmtTeW5jKGNhY2hlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYFtWaXRlXSBcdTVERjJcdTUyMjBcdTk2NjQ6ICR7Y2FjaGVQYXRofWApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbVml0ZV0gXHU2NUUwXHU2Q0Q1XHU1MjIwXHU5NjY0OiAke2NhY2hlUGF0aH1gLCBlKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBcdTZFMDVcdTc0MDZWaXRlXHU3RjEzXHU1QjU4XG5jbGVhblZpdGVDYWNoZSgpO1xuXG4vLyBcdTVDMURcdThCRDVcdTkxQ0FcdTY1M0VcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTdBRUZcdTUzRTNcbmtpbGxQb3J0KDgwODApO1xuXG4vLyBcdTU3RkFcdTY3MkNcdTkxNERcdTdGNkVcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHU1MkEwXHU4RjdEXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4TW9jayBBUEkgLSBcdTRFQ0VcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdThCRkJcdTUzRDZcbiAgY29uc3QgdXNlTW9ja0FwaSA9IGVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnO1xuICBcbiAgLy8gXHU2NjJGXHU1NDI2XHU3OTgxXHU3NTI4SE1SIC0gXHU0RUNFXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU4QkZCXHU1M0Q2XG4gIGNvbnN0IGRpc2FibGVIbXIgPSBlbnYuVklURV9ESVNBQkxFX0hNUiA9PT0gJ3RydWUnO1xuICBcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBcdThGRDBcdTg4NENcdTZBMjFcdTVGMEY6ICR7bW9kZX1gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBNb2NrIEFQSTogJHt1c2VNb2NrQXBpID8gJ1x1NTQyRlx1NzUyOCcgOiAnXHU3OTgxXHU3NTI4J31gKTtcbiAgY29uc29sZS5sb2coYFtWaXRlXHU5MTREXHU3RjZFXSBITVI6ICR7ZGlzYWJsZUhtciA/ICdcdTc5ODFcdTc1MjgnIDogJ1x1NTQyRlx1NzUyOCd9YCk7XG4gIFxuICAvLyBcdTkxNERcdTdGNkVcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICB2dWUoKSxcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogODA4MCxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgLy8gSE1SXHU5MTREXHU3RjZFXG4gICAgICBobXI6IGRpc2FibGVIbXIgPyBmYWxzZSA6IHtcbiAgICAgICAgcHJvdG9jb2w6ICd3cycsXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBjbGllbnRQb3J0OiA4MDgwLFxuICAgICAgfSxcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1NEVFM1x1NzQwNlxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gXHU1QzA2QVBJXHU4QkY3XHU2QzQyXHU4RjZDXHU1M0QxXHU1MjMwXHU1NDBFXHU3QUVGXHU2NzBEXHU1MkExXG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgICAgYnlwYXNzOiAocmVxKSA9PiB7XG4gICAgICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTU0MkZcdTc1MjhcdTRFODZNb2NrIEFQSVx1RkYwQ1x1NTIxOVx1NEUwRFx1NEVFM1x1NzQwNkFQSVx1OEJGN1x1NkM0MlxuICAgICAgICAgICAgaWYgKHVzZU1vY2tBcGkgJiYgcmVxLnVybD8uc3RhcnRzV2l0aCgnL2FwaS8nKSkge1xuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gXHU5MTREXHU3RjZFXHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgICBtaWRkbGV3YXJlTW9kZTogZmFsc2UsXG4gICAgICBcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOE1vY2tcdTRFMkRcdTk1RjRcdTRFRjZcdTYyRTZcdTYyMkFBUElcdThCRjdcdTZDNDJcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcjogKHNlcnZlcikgPT4ge1xuICAgICAgICAvLyBcdTZERkJcdTUyQTBcdTUxNjhcdTVDNDBcdTdGMTNcdTVCNThcdTYzQTdcdTUyMzZcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDYWNoZS1Db250cm9sJywgJ25vLXN0b3JlLCBuby1jYWNoZSwgbXVzdC1yZXZhbGlkYXRlJyk7XG4gICAgICAgICAgcmVzLnNldEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XG4gICAgICAgICAgcmVzLnNldEhlYWRlcignRXhwaXJlcycsICcwJyk7XG4gICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NTQyRlx1NzUyOFx1NEU4Nk1vY2sgQVBJXHVGRjBDXHU2REZCXHU1MkEwTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1NTkwNFx1NzQwNkFQSVx1OEJGN1x1NkM0MlxuICAgICAgICBpZiAodXNlTW9ja0FwaSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbVml0ZVx1OTE0RFx1N0Y2RV0gXHU2REZCXHU1MkEwTW9ja1x1NEUyRFx1OTVGNFx1NEVGNlx1RkYwQ1x1NEVDNVx1NzUyOFx1NEU4RVx1NTkwNFx1NzQwNkFQSVx1OEJGN1x1NkM0MicpO1xuICAgICAgICAgIGNvbnN0IG1pZGRsZXdhcmUgPSBjcmVhdGVNb2NrTWlkZGxld2FyZSgpO1xuICAgICAgICAgIFxuICAgICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgICAgICAvLyBcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDIgLSBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU1MTg1XHU5MEU4XHU0RjFBXHU2OEMwXHU2N0U1VVJMXHU2NjJGXHU1NDI2XHU0RUU1L2FwaS9cdTVGMDBcdTU5MzRcbiAgICAgICAgICAgIG1pZGRsZXdhcmUocmVxLCByZXMsIG5leHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbVml0ZVx1OTE0RFx1N0Y2RV0gTW9jayBBUElcdTVERjJcdTc5ODFcdTc1MjhcdUZGMENcdTYyNDBcdTY3MDlBUElcdThCRjdcdTZDNDJcdTVDMDZcdThGNkNcdTUzRDFcdTUyMzBcdTU0MEVcdTdBRUYnKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MsIGF1dG9wcmVmaXhlcl0sXG4gICAgICB9LFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIC8vIFx1NTMwNVx1NTQyQlx1NTdGQVx1NjcyQ1x1NEY5RFx1OEQ1NlxuICAgICAgaW5jbHVkZTogW1xuICAgICAgICAndnVlJywgXG4gICAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICAgJ3BpbmlhJyxcbiAgICAgICAgJ2F4aW9zJyxcbiAgICAgICAgJ2RheWpzJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlL2VzL2xvY2FsZS96aF9DTidcbiAgICAgIF0sXG4gICAgICAvLyBcdTYzOTJcdTk2NjRcdTcyNzlcdTVCOUFcdTRGOURcdThENTZcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgLy8gXHU2MzkyXHU5NjY0XHU2M0QyXHU0RUY2XHU0RTJEXHU3Njg0XHU2NzBEXHU1MkExXHU1NjY4TW9ja1xuICAgICAgICAnc3JjL3BsdWdpbnMvc2VydmVyTW9jay50cycsXG4gICAgICAgIC8vIFx1NjM5Mlx1OTY2NGZzZXZlbnRzXHU2NzJDXHU1NzMwXHU2QTIxXHU1NzU3XHVGRjBDXHU5MDdGXHU1MTREXHU2Nzg0XHU1RUZBXHU5NTE5XHU4QkVGXG4gICAgICAgICdmc2V2ZW50cydcbiAgICAgIF0sXG4gICAgICAvLyBcdTc4NkVcdTRGRERcdTRGOURcdThENTZcdTk4ODRcdTY3ODRcdTVFRkFcdTZCNjNcdTc4NkVcdTVCOENcdTYyMTBcbiAgICAgIGZvcmNlOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gXHU0RjdGXHU3NTI4XHU1MzU1XHU3MkVDXHU3Njg0XHU3RjEzXHU1QjU4XHU3NkVFXHU1RjU1XG4gICAgY2FjaGVEaXI6ICdub2RlX21vZHVsZXMvLnZpdGVfY2FjaGUnLFxuICB9XG59KSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL21pZGRsZXdhcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9taWRkbGV3YXJlL2luZGV4LnRzXCI7LyoqXG4gKiBNb2NrXHU0RTJEXHU5NUY0XHU0RUY2XHU3QkExXHU3NDA2XHU2QTIxXHU1NzU3XG4gKiBcbiAqIFx1NjNEMFx1NEY5Qlx1N0VERlx1NEUwMFx1NzY4NEhUVFBcdThCRjdcdTZDNDJcdTYyRTZcdTYyMkFcdTRFMkRcdTk1RjRcdTRFRjZcdUZGMENcdTc1MjhcdTRFOEVcdTZBMjFcdTYyREZBUElcdTU0Q0RcdTVFOTRcbiAqIFx1OEQxRlx1OEQyM1x1N0JBMVx1NzQwNlx1NTQ4Q1x1NTIwNlx1NTNEMVx1NjI0MFx1NjcwOUFQSVx1OEJGN1x1NkM0Mlx1NTIzMFx1NUJGOVx1NUU5NFx1NzY4NFx1NjcwRFx1NTJBMVx1NTkwNFx1NzQwNlx1NTFGRFx1NjU3MFxuICovXG5cbmltcG9ydCB7IEluY29taW5nTWVzc2FnZSwgU2VydmVyUmVzcG9uc2UgfSBmcm9tICdodHRwJztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IG1vY2tDb25maWcsIHNob3VsZE1vY2tSZXF1ZXN0IH0gZnJvbSAnLi4vY29uZmlnJztcblxuLy8gXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHU2RTkwXHU1MjE3XHU4ODY4XG5jb25zdCBNT0NLX0RBVEFTT1VSQ0VTID0gW1xuICB7IGlkOiAxLCBuYW1lOiAnXHU2NTcwXHU2MzZFXHU2RTkwMScsIHR5cGU6ICdteXNxbCcsIGhvc3Q6ICdsb2NhbGhvc3QnLCBwb3J0OiAzMzA2LCB1c2VybmFtZTogJ3Jvb3QnLCBkYXRhYmFzZTogJ3Rlc3RfZGIxJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICB7IGlkOiAyLCBuYW1lOiAnXHU2NTcwXHU2MzZFXHU2RTkwMicsIHR5cGU6ICdwb3N0Z3JlcycsIGhvc3Q6ICdkYi5leGFtcGxlLmNvbScsIHBvcnQ6IDU0MzIsIHVzZXJuYW1lOiAnYWRtaW4nLCBkYXRhYmFzZTogJ3Rlc3RfZGIyJywgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICB7IGlkOiAzLCBuYW1lOiAnXHU2NTcwXHU2MzZFXHU2RTkwMycsIHR5cGU6ICdtb25nb2RiJywgaG9zdDogJzE5Mi4xNjguMS4xMDAnLCBwb3J0OiAyNzAxNywgdXNlcm5hbWU6ICdtb25nb2RiJywgZGF0YWJhc2U6ICd0ZXN0X2RiMycsIHN0YXR1czogJ2luYWN0aXZlJyB9XG5dO1xuXG4vLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTUyMTdcdTg4NjhcbmNvbnN0IE1PQ0tfUVVFUklFUyA9IFtcbiAgeyBpZDogMSwgbmFtZTogJ1x1NjdFNVx1OEJFMjEnLCBzcWw6ICdTRUxFQ1QgKiBGUk9NIHVzZXJzJywgZGF0YXNvdXJjZV9pZDogMSwgY3JlYXRlZF9hdDogJzIwMjMtMDEtMDFUMDA6MDA6MDBaJywgdXBkYXRlZF9hdDogJzIwMjMtMDEtMDJUMTA6MzA6MDBaJyB9LFxuICB7IGlkOiAyLCBuYW1lOiAnXHU2N0U1XHU4QkUyMicsIHNxbDogJ1NFTEVDVCBjb3VudCgqKSBGUk9NIG9yZGVycycsIGRhdGFzb3VyY2VfaWQ6IDIsIGNyZWF0ZWRfYXQ6ICcyMDIzLTAxLTAzVDAwOjAwOjAwWicsIHVwZGF0ZWRfYXQ6ICcyMDIzLTAxLTA1VDE0OjIwOjAwWicgfSxcbiAgeyBpZDogMywgbmFtZTogJ1x1NTkwRFx1Njc0Mlx1NjdFNVx1OEJFMicsIHNxbDogJ1NFTEVDVCB1LmlkLCB1Lm5hbWUsIENPVU5UKG8uaWQpIGFzIG9yZGVyX2NvdW50IEZST00gdXNlcnMgdSBKT0lOIG9yZGVycyBvIE9OIHUuaWQgPSBvLnVzZXJfaWQgR1JPVVAgQlkgdS5pZCwgdS5uYW1lJywgZGF0YXNvdXJjZV9pZDogMSwgY3JlYXRlZF9hdDogJzIwMjMtMDEtMTBUMDA6MDA6MDBaJywgdXBkYXRlZF9hdDogJzIwMjMtMDEtMTJUMDk6MTU6MDBaJyB9XG5dO1xuXG4vLyBcdTU5MDRcdTc0MDZDT1JTXHU4QkY3XHU2QzQyXG5mdW5jdGlvbiBoYW5kbGVDb3JzKHJlczogU2VydmVyUmVzcG9uc2UpIHtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLU1heC1BZ2UnLCAnODY0MDAnKTtcbn1cblxuLy8gXHU1M0QxXHU5MDAxSlNPTlx1NTRDRFx1NUU5NFxuZnVuY3Rpb24gc2VuZEpzb25SZXNwb25zZShyZXM6IFNlcnZlclJlc3BvbnNlLCBzdGF0dXM6IG51bWJlciwgZGF0YTogYW55KSB7XG4gIHJlcy5zdGF0dXNDb2RlID0gc3RhdHVzO1xuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cblxuLy8gXHU1RUY2XHU4RkRGXHU2MjY3XHU4ODRDXG5mdW5jdGlvbiBkZWxheShtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuLy8gXHU1OTA0XHU3NDA2XHU2NTcwXHU2MzZFXHU2RTkwQVBJXG5mdW5jdGlvbiBoYW5kbGVEYXRhc291cmNlc0FwaShyZXE6IEluY29taW5nTWVzc2FnZSwgcmVzOiBTZXJ2ZXJSZXNwb25zZSwgdXJsUGF0aDogc3RyaW5nKSB7XG4gIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2Q/LnRvVXBwZXJDYXNlKCk7XG4gIFxuICBpZiAodXJsUGF0aCA9PT0gJy9hcGkvZGF0YXNvdXJjZXMnICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IGRhdGE6IE1PQ0tfREFUQVNPVVJDRVMsIHRvdGFsOiBNT0NLX0RBVEFTT1VSQ0VTLmxlbmd0aCB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgaWYgKHVybFBhdGgubWF0Y2goL15cXC9hcGlcXC9kYXRhc291cmNlc1xcL1xcZCskLykgJiYgbWV0aG9kID09PSAnR0VUJykge1xuICAgIGNvbnN0IGlkID0gcGFyc2VJbnQodXJsUGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcwJyk7XG4gICAgY29uc3QgZGF0YXNvdXJjZSA9IE1PQ0tfREFUQVNPVVJDRVMuZmluZChkID0+IGQuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoZGF0YXNvdXJjZSkge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBkYXRhOiBkYXRhc291cmNlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IGVycm9yOiAnXHU2NTcwXHU2MzZFXHU2RTkwXHU0RTBEXHU1QjU4XHU1NzI4JyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gXHU1OTA0XHU3NDA2XHU2N0U1XHU4QkUyQVBJXG5mdW5jdGlvbiBoYW5kbGVRdWVyaWVzQXBpKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCB1cmxQYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZD8udG9VcHBlckNhc2UoKTtcbiAgXG4gIGlmICh1cmxQYXRoID09PSAnL2FwaS9xdWVyaWVzJyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDIwMCwgeyBkYXRhOiBNT0NLX1FVRVJJRVMsIHRvdGFsOiBNT0NLX1FVRVJJRVMubGVuZ3RoIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICBpZiAodXJsUGF0aC5tYXRjaCgvXlxcL2FwaVxcL3F1ZXJpZXNcXC9cXGQrJC8pICYmIG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCBpZCA9IHBhcnNlSW50KHVybFBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnMCcpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gTU9DS19RVUVSSUVTLmZpbmQocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKHF1ZXJ5KSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgMjAwLCB7IGRhdGE6IHF1ZXJ5IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kSnNvblJlc3BvbnNlKHJlcywgNDA0LCB7IGVycm9yOiAnXHU2N0U1XHU4QkUyXHU0RTBEXHU1QjU4XHU1NzI4JyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIGlmICh1cmxQYXRoLm1hdGNoKC9eXFwvYXBpXFwvcXVlcmllc1xcL1xcZCtcXC9ydW4kLykgJiYgbWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCBpZCA9IHBhcnNlSW50KHVybFBhdGguc3BsaXQoJy8nKVszXSB8fCAnMCcpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gTU9DS19RVUVSSUVTLmZpbmQocSA9PiBxLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKHF1ZXJ5KSB7XG4gICAgICAvLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTYyNjdcdTg4NENcdTdFRDNcdTY3OUNcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCAyMDAsIHtcbiAgICAgICAgZGF0YTogW1xuICAgICAgICAgIHsgaWQ6IDEsIG5hbWU6ICdKb2huIERvZScsIGVtYWlsOiAnam9obkBleGFtcGxlLmNvbScgfSxcbiAgICAgICAgICB7IGlkOiAyLCBuYW1lOiAnSmFuZSBTbWl0aCcsIGVtYWlsOiAnamFuZUBleGFtcGxlLmNvbScgfSxcbiAgICAgICAgICB7IGlkOiAzLCBuYW1lOiAnQm9iIEpvaG5zb24nLCBlbWFpbDogJ2JvYkBleGFtcGxlLmNvbScgfVxuICAgICAgICBdLFxuICAgICAgICBjb2x1bW5zOiBbJ2lkJywgJ25hbWUnLCAnZW1haWwnXSxcbiAgICAgICAgcm93czogMyxcbiAgICAgICAgZXhlY3V0aW9uX3RpbWU6IDAuMTIzXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBlcnJvcjogJ1x1NjdFNVx1OEJFMlx1NEUwRFx1NUI1OFx1NTcyOCcgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFx1NTIxQlx1NUVGQVx1NEUyRFx1OTVGNFx1NEVGNlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlTW9ja01pZGRsZXdhcmUoKSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBtb2NrTWlkZGxld2FyZShyZXE6IEluY29taW5nTWVzc2FnZSwgcmVzOiBTZXJ2ZXJSZXNwb25zZSwgbmV4dDogKCkgPT4gdm9pZCkge1xuICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOFx1NEU4Nk1vY2tcdTY3MERcdTUyQTFcbiAgICBpZiAoIW1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgICAgY29uc29sZS5sb2coJ1tNb2NrXSBcdTY3MERcdTUyQTFcdTVERjJcdTc5ODFcdTc1MjhcdUZGMENcdThERjNcdThGQzdcdThCRjdcdTZDNDI6JywgcmVxLnVybCk7XG4gICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTg5RTNcdTY3OTBVUkxcbiAgICBjb25zdCBwYXJzZWRVcmwgPSBwYXJzZShyZXEudXJsIHx8ICcnLCB0cnVlKTtcbiAgICBjb25zdCB1cmxQYXRoID0gcGFyc2VkVXJsLnBhdGhuYW1lIHx8ICcnO1xuICAgIFxuICAgIC8vIFx1NjVFNVx1NUZEN1xuICAgIGlmIChtb2NrQ29uZmlnLmxvZ0xldmVsID09PSAnZGVidWcnKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW01vY2sgREVCVUddIFx1NjUzNlx1NTIzMFx1OEJGN1x1NkM0MjogJHtyZXEubWV0aG9kfSAke3VybFBhdGh9YCk7XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NTkwNFx1NzQwNlx1NkI2NFx1OEJGN1x1NkM0MlxuICAgIGlmICghc2hvdWxkTW9ja1JlcXVlc3QodXJsUGF0aCkpIHtcbiAgICAgIGlmIChtb2NrQ29uZmlnLmxvZ0xldmVsID09PSAnZGVidWcnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbTW9jayBERUJVR10gXHU0RTBEXHU1OTA0XHU3NDA2XHU2QjY0XHU4QkY3XHU2QzQyIChcdTk3NUVBUElcdThERUZcdTVGODQpOiAke3VybFBhdGh9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cbiAgICBcbiAgICAvLyBcdTU5MDRcdTc0MDZDT1JTXHU5ODg0XHU2OEMwXHU4QkY3XHU2QzQyXG4gICAgaWYgKHJlcS5tZXRob2QgPT09ICdPUFRJT05TJykge1xuICAgICAgaGFuZGxlQ29ycyhyZXMpO1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFx1NEUzQVx1NjI0MFx1NjcwOVx1NTRDRFx1NUU5NFx1NkRGQlx1NTJBMENPUlNcdTU5MzRcbiAgICBoYW5kbGVDb3JzKHJlcyk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1N0Y1MVx1N0VEQ1x1NUVGNlx1OEZERlxuICAgICAgaWYgKG1vY2tDb25maWcuZGVsYXkgPiAwKSB7XG4gICAgICAgIGF3YWl0IGRlbGF5KG1vY2tDb25maWcuZGVsYXkpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTU5MDRcdTc0MDZcdTRFMERcdTU0MENcdTc2ODRBUElcdTdBRUZcdTcwQjlcbiAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XG4gICAgICBcbiAgICAgIC8vIFx1NjMwOVx1OTg3QVx1NUU4Rlx1NUMxRFx1OEJENVx1NEUwRFx1NTQwQ1x1NzY4NEFQSVx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gaGFuZGxlRGF0YXNvdXJjZXNBcGkocmVxLCByZXMsIHVybFBhdGgpO1xuICAgICAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkID0gaGFuZGxlUXVlcmllc0FwaShyZXEsIHJlcywgdXJsUGF0aCk7XG4gICAgICBcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkNBMVx1NjcwOVx1NTkwNFx1NzQwNlx1RkYwQ1x1OEZENFx1NTZERTQwNFxuICAgICAgaWYgKCFoYW5kbGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU2NzJBXHU1QjlFXHU3M0IwXHU3Njg0QVBJXHU4REVGXHU1Rjg0OiAke3JlcS5tZXRob2R9ICR7dXJsUGF0aH1gKTtcbiAgICAgICAgc2VuZEpzb25SZXNwb25zZShyZXMsIDQwNCwgeyBlcnJvcjogJ1x1NjcyQVx1NjI3RVx1NTIzMEFQSVx1N0FFRlx1NzBCOScgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tNb2NrIEVSUk9SXScsIGVycm9yKTtcbiAgICAgIHNlbmRKc29uUmVzcG9uc2UocmVzLCA1MDAsIHsgZXJyb3I6ICdcdTY3MERcdTUyQTFcdTU2NjhcdTUxODVcdTkwRThcdTk1MTlcdThCRUYnIH0pO1xuICAgIH1cbiAgfTtcbn0gIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuZ3VvY2hhby9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvY3Vyc29yL0RhdGFTY29wZS1Ob2RlL3dlYnZpZXctdWkvc3JjL21vY2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5ndW9jaGFvL0RvY3VtZW50cy9EZXZlbG9wbWVudC9jdXJzb3IvRGF0YVNjb3BlLU5vZGUvd2Vidmlldy11aS9zcmMvbW9jay9jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1bmd1b2NoYW8vRG9jdW1lbnRzL0RldmVsb3BtZW50L2N1cnNvci9EYXRhU2NvcGUtTm9kZS93ZWJ2aWV3LXVpL3NyYy9tb2NrL2NvbmZpZy50c1wiOy8qKlxuICogTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxuICogXG4gKiBcdTYzQTdcdTUyMzZNb2NrXHU2NzBEXHU1MkExXHU3Njg0XHU1NDJGXHU3NTI4L1x1Nzk4MVx1NzUyOFx1NzJCNlx1NjAwMVx1MzAwMVx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQlx1N0I0OVxuICovXG5cbi8vIFx1NEVDRVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NjIxNlx1NTE2OFx1NUM0MFx1OEJCRVx1N0Y2RVx1NEUyRFx1ODNCN1x1NTNENlx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbmV4cG9ydCBmdW5jdGlvbiBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgLy8gXHU1NzI4Tm9kZS5qc1x1NzNBRlx1NTg4M1x1NEUyRFxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5WSVRFX1VTRV9NT0NLX0FQSSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHByb2Nlc3MuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzXHU0RTJEXG4gICAgaWYgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52KSB7XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVVNFX01PQ0tfQVBJID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gXHU2OEMwXHU2N0U1bG9jYWxTdG9yYWdlIChcdTRFQzVcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODMpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIGNvbnN0IGxvY2FsU3RvcmFnZVZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1VTRV9NT0NLX0FQSScpO1xuICAgICAgaWYgKGxvY2FsU3RvcmFnZVZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAobG9jYWxTdG9yYWdlVmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBcdTlFRDhcdThCQTRcdTYwQzVcdTUxQjVcdUZGMUFcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEJcdTU0MkZcdTc1MjhcdUZGMENcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTc5ODFcdTc1MjhcbiAgICBjb25zdCBpc0RldmVsb3BtZW50ID0gXG4gICAgICAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB8fFxuICAgICAgKHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52ICYmIGltcG9ydC5tZXRhLmVudi5ERVYgPT09IHRydWUpO1xuICAgIFxuICAgIHJldHVybiBpc0RldmVsb3BtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIFx1NTFGQVx1OTUxOVx1NjVGNlx1NzY4NFx1NUI4OVx1NTE2OFx1NTZERVx1OTAwMFxuICAgIGNvbnNvbGUud2FybignW01vY2tdIFx1NjhDMFx1NjdFNVx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NTFGQVx1OTUxOVx1RkYwQ1x1OUVEOFx1OEJBNFx1Nzk4MVx1NzUyOE1vY2tcdTY3MERcdTUyQTEnLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1NTQxMVx1NTQwRVx1NTE3Q1x1NUJCOVx1NjVFN1x1NEVFM1x1NzgwMVx1NzY4NFx1NTFGRFx1NjU3MFxuZXhwb3J0IGZ1bmN0aW9uIGlzTW9ja0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0VuYWJsZWQoKTtcbn1cblxuLy8gTW9ja1x1NjcwRFx1NTJBMVx1OTE0RFx1N0Y2RVxuZXhwb3J0IGNvbnN0IG1vY2tDb25maWcgPSB7XG4gIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOE1vY2tcdTY3MERcdTUyQTFcbiAgZW5hYmxlZDogaXNFbmFibGVkKCksXG4gIFxuICAvLyBcdThCRjdcdTZDNDJcdTVFRjZcdThGREZcdUZGMDhcdTZCRUJcdTc5RDJcdUZGMDlcbiAgZGVsYXk6IDMwMCxcbiAgXG4gIC8vIEFQSVx1NTdGQVx1Nzg0MFx1OERFRlx1NUY4NFx1RkYwQ1x1NzUyOFx1NEU4RVx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1OTcwMFx1ODk4MVx1NjJFNlx1NjIyQVx1OEJGN1x1NkM0MlxuICBhcGlCYXNlUGF0aDogJy9hcGknLFxuICBcbiAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCOiAnbm9uZScsICdlcnJvcicsICdpbmZvJywgJ2RlYnVnJ1xuICBsb2dMZXZlbDogJ2RlYnVnJyxcbiAgXG4gIC8vIFx1NTQyRlx1NzUyOFx1NzY4NFx1NkEyMVx1NTc1N1xuICBtb2R1bGVzOiB7XG4gICAgZGF0YXNvdXJjZXM6IHRydWUsXG4gICAgcXVlcmllczogdHJ1ZSxcbiAgICB1c2VyczogdHJ1ZSxcbiAgICB2aXN1YWxpemF0aW9uczogdHJ1ZVxuICB9XG59O1xuXG4vLyBcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTVFOTRcdThCRTVcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRNb2NrUmVxdWVzdCh1cmw6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBcdTVGQzVcdTk4N0JcdTU0MkZcdTc1MjhNb2NrXHU2NzBEXHU1MkExXG4gIGlmICghbW9ja0NvbmZpZy5lbmFibGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvLyBcdTVGQzVcdTk4N0JcdTY2MkZBUElcdThCRjdcdTZDNDJcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aChtb2NrQ29uZmlnLmFwaUJhc2VQYXRoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLy8gXHU4REVGXHU1Rjg0XHU2OEMwXHU2N0U1XHU5MDFBXHU4RkM3XHVGRjBDXHU1RTk0XHU4QkU1XHU2MkU2XHU2MjJBXHU4QkY3XHU2QzQyXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBcdThCQjBcdTVGNTVcdTY1RTVcdTVGRDdcbmV4cG9ydCBmdW5jdGlvbiBsb2dNb2NrKGxldmVsOiAnZXJyb3InIHwgJ2luZm8nIHwgJ2RlYnVnJywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgY29uc3QgeyBsb2dMZXZlbCB9ID0gbW9ja0NvbmZpZztcbiAgXG4gIGlmIChsb2dMZXZlbCA9PT0gJ25vbmUnKSByZXR1cm47XG4gIFxuICBpZiAobGV2ZWwgPT09ICdlcnJvcicgJiYgWydlcnJvcicsICdpbmZvJywgJ2RlYnVnJ10uaW5jbHVkZXMobG9nTGV2ZWwpKSB7XG4gICAgY29uc29sZS5lcnJvcignW01vY2sgRVJST1JdJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdpbmZvJyAmJiBbJ2luZm8nLCAnZGVidWcnXS5pbmNsdWRlcyhsb2dMZXZlbCkpIHtcbiAgICBjb25zb2xlLmluZm8oJ1tNb2NrIElORk9dJywgLi4uYXJncyk7XG4gIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdkZWJ1ZycgJiYgbG9nTGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICBjb25zb2xlLmxvZygnW01vY2sgREVCVUddJywgLi4uYXJncyk7XG4gIH1cbn1cblxuLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHU2NUY2XHU4RjkzXHU1MUZBTW9ja1x1NjcwRFx1NTJBMVx1NzJCNlx1NjAwMVxudHJ5IHtcbiAgY29uc29sZS5sb2coYFtNb2NrXSBcdTY3MERcdTUyQTFcdTcyQjZcdTYwMDE6ICR7bW9ja0NvbmZpZy5lbmFibGVkID8gJ1x1NURGMlx1NTQyRlx1NzUyOCcgOiAnXHU1REYyXHU3OTgxXHU3NTI4J31gKTtcbiAgaWYgKG1vY2tDb25maWcuZW5hYmxlZCkge1xuICAgIGNvbnNvbGUubG9nKGBbTW9ja10gXHU5MTREXHU3RjZFOmAsIHtcbiAgICAgIGRlbGF5OiBtb2NrQ29uZmlnLmRlbGF5LFxuICAgICAgYXBpQmFzZVBhdGg6IG1vY2tDb25maWcuYXBpQmFzZVBhdGgsXG4gICAgICBsb2dMZXZlbDogbW9ja0NvbmZpZy5sb2dMZXZlbCxcbiAgICAgIGVuYWJsZWRNb2R1bGVzOiBPYmplY3QuZW50cmllcyhtb2NrQ29uZmlnLm1vZHVsZXMpXG4gICAgICAgIC5maWx0ZXIoKFtfLCBlbmFibGVkXSkgPT4gZW5hYmxlZClcbiAgICAgICAgLm1hcCgoW25hbWVdKSA9PiBuYW1lKVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBjb25zb2xlLndhcm4oJ1tNb2NrXSBcdThGOTNcdTUxRkFcdTkxNERcdTdGNkVcdTRGRTFcdTYwNkZcdTUxRkFcdTk1MTknLCBlcnJvcik7XG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUEwWSxTQUFTLGNBQWMsZUFBZTtBQUNoYixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZ0JBQWdCO0FBQ3pCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCOzs7QUNHekIsU0FBUyxhQUFhOzs7QUNEZixTQUFTLFlBQXFCO0FBQ25DLE1B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QUE7QUFBQSxNQUVBLGdCQUFnQjtBQUFBO0FBQUEsTUFHaEIsaUJBQWlCLENBQUMsV0FBVztBQUUzQixlQUFPLFlBQVksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO0FBQ3pDLGNBQUksVUFBVSxpQkFBaUIscUNBQXFDO0FBQ3BFLGNBQUksVUFBVSxVQUFVLFVBQVU7QUFDbEMsY0FBSSxVQUFVLFdBQVcsR0FBRztBQUM1QixlQUFLO0FBQUEsUUFDUCxDQUFDO0FBR0QsWUFBSSxZQUFZO0FBQ2Qsa0JBQVEsSUFBSSwwR0FBK0I7QUFDM0MsZ0JBQU0sYUFBYSxxQkFBcUI7QUFFeEMsaUJBQU8sWUFBWSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7QUFFekMsdUJBQVcsS0FBSyxLQUFLLElBQUk7QUFBQSxVQUMzQixDQUFDO0FBQUEsUUFDSCxPQUFPO0FBQ0wsa0JBQVEsSUFBSSxvSEFBb0M7QUFBQSxRQUNsRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsUUFDUCxTQUFTLENBQUMsYUFBYSxZQUFZO0FBQUEsTUFDckM7QUFBQSxNQUNBLHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLG1CQUFtQjtBQUFBLFFBQ3JCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLGFBQWE7QUFBQSxNQUNiLFFBQVE7QUFBQSxNQUNSLFdBQVc7QUFBQSxNQUNYLFFBQVE7QUFBQSxNQUNSLGVBQWU7QUFBQSxRQUNiLFVBQVU7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLGVBQWU7QUFBQSxRQUNqQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxjQUFjO0FBQUE7QUFBQSxNQUVaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxTQUFTO0FBQUE7QUFBQSxRQUVQO0FBQUE7QUFBQSxRQUVBO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxPQUFPO0FBQUEsSUFDVDtBQUFBO0FBQUEsSUFFQSxVQUFVO0FBQUEsRUFDWjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
