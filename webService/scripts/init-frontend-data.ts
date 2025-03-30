/**
 * 初始化前端开发测试数据
 * 
 * 此脚本创建适合前端开发和测试的示例数据，包括：
 * - 多种类型的数据源连接
 * - 预设SQL查询示例
 * - 查询历史记录
 * 
 * 使用方法: npm run init:frontend
 */

import { PrismaClient } from '@prisma/client';
import { encrypt, generateSalt } from '../src/utils/crypto';
import * as readline from 'readline';

const prisma = new PrismaClient();

// 用于控制台交互的接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 示例数据定义
const SAMPLE_DATA_SOURCES = [
  {
    name: '开发MySQL',
    description: '本地开发环境MySQL数据库',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    databaseName: 'dev_db',
    status: 'ACTIVE'
  },
  {
    name: '测试PostgreSQL',
    description: '测试环境PostgreSQL数据库',
    type: 'postgresql',
    host: 'test-db',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    databaseName: 'test_db',
    status: 'ACTIVE'
  },
  {
    name: '生产MySQL只读',
    description: '生产环境只读MySQL副本',
    type: 'mysql',
    host: 'prod-readonly.example.com',
    port: 3306,
    username: 'readonly',
    password: 'readonly',
    databaseName: 'prod_db',
    status: 'INACTIVE'
  },
  {
    name: 'Docker MySQL',
    description: 'Docker容器中的MySQL',
    type: 'mysql',
    host: 'datascope-mysql',
    port: 3306,
    username: 'root',
    password: 'datascope',
    databaseName: 'datascope',
    status: 'ACTIVE'
  }
];

const SAMPLE_QUERIES = [
  {
    name: '用户增长分析',
    description: '按日期统计新注册用户数',
    sqlContent: 'SELECT DATE(created_at) as date, COUNT(*) as new_users FROM users GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30',
    queryType: 'SQL',
    isFavorite: true,
    tags: '用户,分析,增长'
  },
  {
    name: '产品销售情况',
    description: '按产品类别统计销售数据',
    sqlContent: 'SELECT c.category_name, SUM(oi.quantity * p.price) as revenue FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN categories c ON p.category_id = c.id GROUP BY c.category_name ORDER BY revenue DESC',
    queryType: 'SQL',
    isFavorite: true,
    tags: '销售,产品,收入'
  },
  {
    name: '访问量统计',
    description: '按小时统计网站访问量',
    sqlContent: 'SELECT HOUR(visit_time) as hour, COUNT(*) as visits FROM page_visits WHERE visit_date = CURRENT_DATE() GROUP BY HOUR(visit_time) ORDER BY hour',
    queryType: 'SQL',
    isFavorite: false,
    tags: '访问,统计,小时'
  },
  {
    name: '系统性能监控',
    description: '查询服务器CPU和内存使用情况',
    sqlContent: 'SELECT timestamp, hostname, cpu_usage, memory_usage FROM system_metrics WHERE timestamp > NOW() - INTERVAL 1 DAY ORDER BY timestamp DESC',
    queryType: 'SQL',
    isFavorite: false,
    tags: '系统,监控,性能'
  },
  {
    name: '订单状态分布',
    description: '统计各状态的订单数量',
    sqlContent: 'SELECT status, COUNT(*) as count FROM orders GROUP BY status',
    queryType: 'SQL',
    isFavorite: true,
    tags: '订单,状态,统计'
  },
  {
    name: 'SHOW TABLES',
    description: '显示所有表',
    sqlContent: 'SHOW TABLES',
    queryType: 'SQL',
    isFavorite: true,
    tags: '系统,表'
  },
  {
    name: 'SHOW DATABASES',
    description: '显示所有数据库',
    sqlContent: 'SHOW DATABASES',
    queryType: 'SQL',
    isFavorite: false,
    tags: '系统,数据库'
  }
];

/**
 * 清空所有现有数据
 */
async function clearAll() {
  console.log('🗑️  删除现有数据...');
  
  // 按照外键关系顺序删除
  await prisma.queryHistory.deleteMany({});
  await prisma.displayConfig.deleteMany({});
  await prisma.query.deleteMany({});
  await prisma.columnRelationship.deleteMany({});
  await prisma.tableRelationship.deleteMany({});
  await prisma.column.deleteMany({});
  await prisma.table.deleteMany({});
  await prisma.schema.deleteMany({});
  await prisma.metadataSyncHistory.deleteMany({});
  await prisma.dataSource.deleteMany({});
  
  console.log('✅ 数据清理完成');
}

/**
 * 创建数据源
 */
async function createDataSources() {
  console.log('🔌 创建示例数据源...');
  
  const createdDataSources: any[] = [];
  
  for (const source of SAMPLE_DATA_SOURCES) {
    const salt = generateSalt();
    const { encrypted: encryptedPassword } = encrypt(source.password, salt);
    
    const dataSource = await prisma.dataSource.create({
      data: {
        name: source.name,
        description: source.description,
        type: source.type,
        host: source.host,
        port: source.port,
        username: source.username,
        passwordEncrypted: encryptedPassword,
        passwordSalt: salt,
        databaseName: source.databaseName,
        status: source.status,
        syncFrequency: 'MANUAL',
        connectionParams: {},
      }
    });
    
    createdDataSources.push(dataSource);
    console.log(`  - 创建数据源: ${source.name} (${source.type})`);
  }
  
  console.log('✅ 示例数据源创建完成');
  return createdDataSources;
}

/**
 * 创建查询
 */
async function createQueries(dataSources: any[]) {
  console.log('🔍 创建示例查询...');
  
  const createdQueries: any[] = [];
  
  // 轮流使用不同的数据源
  for (let i = 0; i < SAMPLE_QUERIES.length; i++) {
    const dataSourceIndex = i % dataSources.length;
    const dataSource = dataSources[dataSourceIndex];
    
    const query = SAMPLE_QUERIES[i];
    
    const createdQuery = await prisma.query.create({
      data: {
        name: query.name,
        description: query.description,
        dataSourceId: dataSource.id,
        sqlContent: query.sqlContent,
        status: 'PUBLISHED',
        queryType: query.queryType,
        isFavorite: query.isFavorite,
        tags: query.tags,
      }
    });
    
    createdQueries.push(createdQuery);
    console.log(`  - 创建查询: ${query.name}`);
    
    // 创建查询历史记录 - 成功执行
    await prisma.queryHistory.create({
      data: {
        queryId: createdQuery.id,
        dataSourceId: dataSource.id,
        sqlContent: 'SELECT * FROM users LIMIT 100',
        status: 'COMPLETED',
        startTime: new Date(Date.now() - 3600000), // 1小时前
        endTime: new Date(Date.now() - 3599000),
        duration: 1000,
        rowCount: 100,
      }
    });
    
    // 另一次成功执行
    await prisma.queryHistory.create({
      data: {
        queryId: createdQuery.id,
        dataSourceId: dataSource.id,
        sqlContent: 'SELECT COUNT(*) as user_count FROM users',
        status: 'COMPLETED',
        startTime: new Date(Date.now() - 7200000), // 2小时前
        endTime: new Date(Date.now() - 7199500),
        duration: 500,
        rowCount: 1,
      }
    });
    
    // 失败执行
    await prisma.queryHistory.create({
      data: {
        queryId: createdQuery.id,
        dataSourceId: dataSource.id,
        sqlContent: 'SELECT * FROM non_existent_table',
        status: 'FAILED',
        startTime: new Date(Date.now() - 86400000), // 1天前
        endTime: new Date(Date.now() - 86399000),
        duration: 1000,
        errorMessage: '表 "non_existent_table" 不存在',
      }
    });
  }
  
  console.log('✅ 示例查询和历史记录创建完成');
  return createdQueries;
}

/**
 * 运行初始化脚本
 */
async function runInit() {
  try {
    rl.question('⚠️ 警告: 此操作将清空所有现有数据并添加前端开发测试数据。继续操作? (y/n) ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('🚀 开始初始化前端测试数据...');
        
        await clearAll();
        const dataSources = await createDataSources();
        const queries = await createQueries(dataSources);
        
        console.log('🎉 前端测试数据初始化完成!');
        console.log(`已创建 ${dataSources.length} 个数据源、${queries.length} 个查询`);
        console.log('数据源连接信息：');
        
        dataSources.forEach(ds => {
          console.log(`  - ${ds.name}: ${ds.type}://${ds.username}@${ds.host}:${ds.port}/${ds.databaseName}`);
        });
      } else {
        console.log('❌ 操作已取消');
      }
      
      await prisma.$disconnect();
      rl.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ 初始化脚本执行失败:', error);
    await prisma.$disconnect();
    rl.close();
    process.exit(1);
  }
}

// 执行初始化脚本
runInit(); 