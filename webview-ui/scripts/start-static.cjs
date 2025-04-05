/**
 * 简单的静态文件服务器
 * 
 * 完全避免使用Vite的HMR功能，解决变量重复声明问题
 */

const express = require('express');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

// 端口
const PORT = 8080;

// 强制释放端口
function forceReleasePort(port) {
  try {
    if (process.platform === 'win32') {
      // Windows平台
      execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { stdio: 'pipe' })
        .toString()
        .trim()
        .split('\n')
        .forEach(line => {
          const match = line.match(/\s+(\d+)$/);
          if (match && match[1]) {
            try {
              execSync(`taskkill /F /PID ${match[1]}`, { stdio: 'pipe' });
              console.log(`已关闭占用端口 ${port} 的进程 PID: ${match[1]}`);
            } catch (e) {
              // 忽略错误
            }
          }
        });
    } else {
      // macOS/Linux平台
      try {
        const pids = execSync(`lsof -i:${port} -t`, { stdio: 'pipe' }).toString().trim();
        if (pids) {
          execSync(`kill -9 ${pids}`, { stdio: 'pipe' });
          console.log(`已关闭占用端口 ${port} 的进程 PID: ${pids}`);
        }
      } catch (e) {
        // 忽略错误，可能是查找命令失败
      }
    }
  } catch (e) {
    // 忽略错误，可能是端口没被占用
    console.log(`端口 ${port} 未被占用或无法关闭进程`);
  }
}

// 清理Vite缓存
console.log('清理Vite缓存...');
try {
  execSync('rm -rf node_modules/.vite* node_modules/.vite_* .vite* dist tmp .temp', { stdio: 'inherit' });
} catch (e) {
  console.error('清理Vite缓存失败:', e.message);
}

// 释放端口
forceReleasePort(PORT);

// 创建一个Express应用
const app = express();

// 获取项目根目录
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// 添加CORS和缓存控制头
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// 提供静态文件服务
app.use(express.static(rootDir, {
  etag: false,
  lastModified: false
}));

// 提供node_modules静态服务
app.use('/node_modules', express.static(path.join(rootDir, 'node_modules'), {
  etag: false,
  lastModified: false
}));

// API代理 - 重定向到Mock服务
app.use('/api', (req, res) => {
  console.log('API请求:', req.method, req.url);
  
  // 创建一个简单的模拟响应
  const mockResponse = {
    success: true,
    data: {
      message: `这是一个Mock响应: ${req.method} ${req.url}`,
      timestamp: new Date().toISOString()
    },
    mockResponse: true
  };
  
  // 模拟延迟
  setTimeout(() => {
    res.json(mockResponse);
  }, 200);
});

// 对所有HTML请求返回index.html
app.get('*', (req, res) => {
  if (req.path.endsWith('.html') || !req.path.includes('.')) {
    // 读取并修改index.html
    let htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    
    // 注入脚本以防止HMR变量声明问题
    const injectScript = `
    <script>
      // 检查并清除已存在的变量，避免重复声明错误
      if (window.__vite__injectQuery) delete window.__vite__injectQuery;
      if (window.__vite__injectMode) delete window.__vite__injectMode;
      if (window.__vite__baseUrl) delete window.__vite__baseUrl;
      
      // 主动设置这些变量，避免Vite客户端再次声明它们
      window.__vite__injectQuery = '';
      window.__vite__injectMode = '';
      window.__vite__baseUrl = '';
      
      // 完全禁用HMR
      window.HMR_WEBSOCKET_CLIENT = { enabled: false };
      
      // 防止Vite客户端尝试重连
      window.__vite__retry = false;
      window.__vite__connect = false;
    </script>
    `;
    
    // 检查HTML中是否已经有这个脚本，如果没有则添加
    if (!htmlContent.includes('window.__vite__injectQuery')) {
      htmlContent = htmlContent.replace('</head>', `${injectScript}</head>`);
    }
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
    return;
  }
  
  // 对于其他请求，继续到下一个处理函数
  next();
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
  ===================================
   静态文件服务器启动成功!
   
   🚀 服务器地址: http://localhost:${PORT}
   📂 服务目录: ${rootDir}
   🌐 CORS: 已启用 (允许所有来源)
   🔒 缓存: 已禁用 (no-store)
  ===================================
  `);
});
