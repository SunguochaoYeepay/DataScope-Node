/**
 * DataScope数据库种子脚本
 * 
 * 这个脚本用于向数据库添加示例数据，包括：
 * - 示例数据源
 * - 示例查询
 * - 示例查询历史
 * - 示例查询文件夹
 * 
 * 使用方法: npx ts-node scripts/seed.ts
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

/**
 * 清空所有数据
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
  
  // 如果查询文件夹表存在，清除它们
  try {
    // @ts-ignore - 模型可能在一些环境中不存在
    await prisma.savedQuery?.deleteMany({});
    // @ts-ignore - 模型可能在一些环境中不存在
    await prisma.queryFolder?.deleteMany({});
  } catch (error) {
    console.log('注意: 一些表可能不存在，已跳过');
  }
  
  console.log('✅ 数据清理完成');
}

/**
 * 创建示例数据源
 */
async function createSampleDataSources() {
  console.log('🔌 创建示例数据源...');
  
  // 创建本地MySQL示例数据源
  const localMySQLSalt = generateSalt();
  const { encrypted: localMySQLPassword } = encrypt('password', localMySQLSalt);
  
  await prisma.dataSource.create({
    data: {
      name: '本地MySQL示例',
      description: '用于开发和测试的本地MySQL数据库',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      passwordEncrypted: localMySQLPassword,
      passwordSalt: localMySQLSalt,
      databaseName: 'example_db',
      status: 'ACTIVE',
      syncFrequency: 'MANUAL',
      connectionParams: {},
    }
  });
  
  // 创建示例PostgreSQL数据源
  const pgSalt = generateSalt();
  const { encrypted: pgPassword } = encrypt('postgres', pgSalt);
  
  await prisma.dataSource.create({
    data: {
      name: 'PostgreSQL示例',
      description: '示例PostgreSQL数据库连接',
      type: 'postgresql',
      host: 'postgres.example.com',
      port: 5432,
      username: 'postgres',
      passwordEncrypted: pgPassword,
      passwordSalt: pgSalt,
      databaseName: 'example_postgres',
      status: 'INACTIVE', // 非活动状态
      syncFrequency: 'DAILY',
      connectionParams: {},
    }
  });
  
  console.log('✅ 示例数据源创建完成');
}

/**
 * 创建示例查询
 */
async function createSampleQueries() {
  console.log('🔍 创建示例查询...');
  
  // 获取第一个数据源ID
  const firstDataSource = await prisma.dataSource.findFirst({
    where: { status: 'ACTIVE' }
  });
  
  if (!firstDataSource) {
    console.log('❌ 没有找到活动的数据源，跳过查询创建');
    return;
  }
  
  // 创建示例查询1
  const query1 = await prisma.query.create({
    data: {
      name: '用户分析查询',
      description: '分析用户注册和活跃情况',
      dataSourceId: firstDataSource.id,
      sqlContent: 'SELECT DATE(created_at) as date, COUNT(*) as count FROM users GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30',
      status: 'PUBLISHED',
      queryType: 'SQL',
      isFavorite: true,
      tags: 'users,analytics,dashboard',
    }
  });
  
  // 创建示例查询2
  const query2 = await prisma.query.create({
    data: {
      name: '销售报表',
      description: '按产品类别统计销售额',
      dataSourceId: firstDataSource.id,
      sqlContent: 'SELECT c.name as category, SUM(p.price * o.quantity) as total_sales FROM orders o JOIN products p ON o.product_id = p.id JOIN categories c ON p.category_id = c.id GROUP BY c.name ORDER BY total_sales DESC',
      status: 'PUBLISHED',
      queryType: 'SQL',
      isFavorite: false,
      tags: 'sales,report,monthly',
    }
  });
  
  // 创建查询历史
  await prisma.queryHistory.create({
    data: {
      queryId: query1.id,
      dataSourceId: firstDataSource.id,
      sqlContent: query1.sqlContent,
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 3600000), // 1小时前
      endTime: new Date(Date.now() - 3599000), // 1小时前结束
      duration: 1000,
      rowCount: 30,
    }
  });
  
  await prisma.queryHistory.create({
    data: {
      queryId: query2.id,
      dataSourceId: firstDataSource.id,
      sqlContent: query2.sqlContent + ' LIMIT 10',
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 1800000), // 30分钟前
      endTime: new Date(Date.now() - 1795000), // 30分钟前结束
      duration: 5000,
      rowCount: 10,
    }
  });
  
  // 创建一个失败的查询历史
  await prisma.queryHistory.create({
    data: {
      dataSourceId: firstDataSource.id,
      sqlContent: 'SELECT * FROM non_existent_table',
      status: 'FAILED',
      startTime: new Date(Date.now() - 600000), // 10分钟前
      endTime: new Date(Date.now() - 599000), // 10分钟前结束
      duration: 1000,
      errorMessage: '表 non_existent_table 不存在',
    }
  });
  
  // 创建查询显示配置
  await prisma.displayConfig.create({
    data: {
      queryId: query1.id,
      displayType: 'CHART',
      chartType: 'LINE',
      title: '用户注册趋势',
      description: '过去30天用户注册数量趋势',
      config: {
        xAxis: 'date',
        yAxis: 'count',
        showLegend: true,
        colors: ['#4CAF50']
      },
      isDefault: true,
    }
  });
  
  await prisma.displayConfig.create({
    data: {
      queryId: query2.id,
      displayType: 'CHART',
      chartType: 'BAR',
      title: '销售额分类',
      description: '按产品类别统计的销售额',
      config: {
        xAxis: 'category',
        yAxis: 'total_sales',
        showLegend: false,
        colors: ['#2196F3']
      },
      isDefault: true,
    }
  });
  
  console.log('✅ 示例查询创建完成');
}

/**
 * 创建示例查询文件夹
 */
async function createSampleFolders() {
  console.log('📁 创建示例文件夹...');
  
  try {
    // 检查QueryFolder表是否存在
    // @ts-ignore - 模型可能在一些环境中不存在
    if (!prisma.queryFolder) {
      console.log('⚠️ QueryFolder表不存在，跳过文件夹创建');
      return;
    }
    
    // 创建根文件夹
    // @ts-ignore
    const reportsFolder = await prisma.queryFolder.create({
      data: {
        name: '报表',
        description: '所有报表查询',
      }
    });
    
    // @ts-ignore
    const analyticsFolder = await prisma.queryFolder.create({
      data: {
        name: '分析',
        description: '数据分析查询',
      }
    });
    
    // 创建子文件夹
    // @ts-ignore
    await prisma.queryFolder.create({
      data: {
        name: '月度报表',
        description: '每月生成的报表',
        parentId: reportsFolder.id,
      }
    });
    
    // @ts-ignore
    await prisma.queryFolder.create({
      data: {
        name: '用户分析',
        description: '用户行为分析',
        parentId: analyticsFolder.id,
      }
    });
    
    console.log('✅ 示例文件夹创建完成');
  } catch (error) {
    console.log('⚠️ 创建文件夹失败，可能是模型不存在:', error);
  }
}

/**
 * 运行种子脚本
 */
async function runSeed() {
  try {
    rl.question('警告: 此操作将清空所有现有数据并添加示例数据。继续操作? (y/n) ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('🚀 开始运行种子脚本...');
        
        // 执行数据加载流程
        await clearAll();
        await createSampleDataSources();
        await createSampleQueries();
        await createSampleFolders();
        
        console.log('🎉 种子数据加载完成!');
      } else {
        console.log('❌ 操作已取消');
      }
      
      // 关闭资源
      await prisma.$disconnect();
      rl.close();
    });
  } catch (error) {
    console.error('❌ 种子脚本执行失败:', error);
    await prisma.$disconnect();
    rl.close();
    process.exit(1);
  }
}

// 执行种子脚本
runSeed(); 