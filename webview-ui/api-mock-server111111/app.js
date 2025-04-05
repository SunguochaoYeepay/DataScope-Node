var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');  // 引入API路由

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 启用CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

// 全局禁用响应缓存
app.use((req, res, next) => {
  // 设置禁用缓存的响应头
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
    'X-Server-Time': Date.now().toString()
  });
  
  // 为每个请求生成唯一的ETag，确保浏览器不会使用缓存
  const originalSend = res.send;
  res.send = function(body) {
    // 生成随机ETag
    if (!res.get('ETag')) {
      res.set('ETag', Math.random().toString());
    }
    return originalSend.call(this, body);
  };
  
  next();
});

// 启用请求日志以便调试
app.use((req, res, next) => {
  console.log(`[APP] ${req.method} ${req.url}`);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);  // 使用API路由处理所有/api/请求

// 特殊处理集成API路由
app.get('/api/low-code/apis', (req, res) => {
  console.log('[APP] 直接拦截集成列表请求');
  res.json([
    {
      id: 'integration-1',
      name: '用户列表',
      description: '系统用户数据列表',
      type: 'TABLE',
      status: 'ACTIVE',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      createdBy: 'admin',
      config: {
        dataSourceId: 'ds-1',
        query: 'SELECT * FROM users',
        queryParams: []
      }
    },
    {
      id: 'integration-2',
      name: '销售统计',
      description: '月度销售统计图表',
      type: 'CHART',
      status: 'ACTIVE',
      createTime: new Date(Date.now() - 86400000).toISOString(),
      updateTime: new Date(Date.now() - 86400000).toISOString(),
      createdBy: 'admin',
      config: {
        dataSourceId: 'ds-1',
        query: 'SELECT month, sum(amount) as total FROM sales GROUP BY month',
        queryParams: []
      }
    },
    {
      id: 'integration-3',
      name: '产品库存',
      description: '产品当前库存情况',
      type: 'SIMPLE_TABLE',
      status: 'DRAFT',
      createTime: new Date(Date.now() - 2 * 86400000).toISOString(),
      updateTime: new Date(Date.now() - 2 * 86400000).toISOString(),
      createdBy: 'admin',
      config: {
        dataSourceId: 'ds-2',
        query: 'SELECT product_name, category, stock FROM inventory',
        queryParams: []
      }
    }
  ]);
});

// 捕获404并转发到错误处理程序
app.use(function(req, res, next) {
  res.status(404).json({
    success: false,
    message: '未找到请求的资源',
    error: {
      code: 'NOT_FOUND',
      message: `未找到URL: ${req.originalUrl}`
    }
  });
});

// 错误处理程序
app.use(function(err, req, res, next) {
  console.error('服务器错误:', err);
  
  // 设置响应状态
  res.status(err.status || 500);
  
  // 返回JSON格式的错误信息
  res.json({
    success: false,
    message: '服务器内部错误',
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || '未知错误'
    }
  });
});

module.exports = app;
