/**
 * 初始化真实数据库连接的测试数据脚本
 * 此脚本用于创建与Docker Compose环境中数据库的连接
 */

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// 初始化Prisma客户端
const prisma = new PrismaClient();

/**
 * 创建数据源连接
 */
async function createDockerDbConnections() {
  console.log('开始创建Docker环境数据库连接...');
  
  try {
    // 创建MySQL数据库连接
    const mysqlDatasource = await prisma.dataSource.create({
      data: {
        id: 'mysql-' + uuidv4(),
        name: 'Docker MySQL',
        description: '连接到Docker MySQL数据库的测试连接',
        type: 'MYSQL',
        hostname: 'datascope-mysql', // 这与docker-compose.yml中的服务名称匹配
        port: 3306,
        username: 'datascope',
        password: 'datascope123',
        database: 'datascope',
        options: JSON.stringify({
          connectionLimit: 10,
          connectTimeout: 10000
        })
      }
    });
    console.log('创建MySQL数据源成功:', mysqlDatasource.name);

    // 创建PostgreSQL数据库连接
    const postgresDatasource = await prisma.dataSource.create({
      data: {
        id: 'postgres-' + uuidv4(),
        name: 'Docker PostgreSQL',
        description: '连接到Docker PostgreSQL数据库的测试连接',
        type: 'POSTGRESQL',
        hostname: 'datascope-postgres', // 这与docker-compose.yml中的服务名称匹配
        port: 5432,
        username: 'datascope',
        password: 'datascope123',
        database: 'datascope',
        options: JSON.stringify({
          connectionLimit: 10,
          connectTimeout: 10000
        })
      }
    });
    console.log('创建PostgreSQL数据源成功:', postgresDatasource.name);

    // 创建MariaDB数据库连接
    const mariadbDatasource = await prisma.dataSource.create({
      data: {
        id: 'mariadb-' + uuidv4(),
        name: 'Docker MariaDB',
        description: '连接到Docker MariaDB数据库的测试连接',
        type: 'MYSQL', // 使用MySQL类型，因为MariaDB兼容MySQL
        hostname: 'datascope-mariadb', // 这与docker-compose.yml中的服务名称匹配
        port: 3307,
        username: 'datascope',
        password: 'datascope123',
        database: 'datascope',
        options: JSON.stringify({
          connectionLimit: 10,
          connectTimeout: 10000
        })
      }
    });
    console.log('创建MariaDB数据源成功:', mariadbDatasource.name);

    return {
      mysql: mysqlDatasource,
      postgres: postgresDatasource,
      mariadb: mariadbDatasource
    };
  } catch (error) {
    console.error('创建数据源失败:', error);
    throw error;
  }
}

/**
 * 创建示例查询
 */
async function createSampleQueries(dataSources: any) {
  console.log('开始创建示例查询...');

  try {
    // MySQL示例查询
    const mysqlQueries = [
      {
        name: 'MySQL - 用户列表查询',
        query: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 10;',
        description: '查询最近创建的10个用户',
        dataSourceId: dataSources.mysql.id
      },
      {
        name: 'MySQL - 产品销售统计',
        query: `SELECT p.name AS product_name, 
                COUNT(oi.id) AS order_count, 
                SUM(oi.quantity) AS total_quantity,
                SUM(oi.price * oi.quantity) AS total_revenue
                FROM products p
                JOIN order_items oi ON p.id = oi.product_id
                GROUP BY p.id
                ORDER BY total_revenue DESC;`,
        description: '各产品销售统计与收入分析',
        dataSourceId: dataSources.mysql.id
      },
      {
        name: 'MySQL - 系统性能分析',
        query: `SELECT 
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') AS time_period,
                AVG(cpu_usage) AS avg_cpu,
                MAX(cpu_usage) AS max_cpu,
                AVG(memory_usage) AS avg_memory,
                MAX(memory_usage) AS max_memory
                FROM system_metrics
                WHERE timestamp >= NOW() - INTERVAL 1 DAY
                GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i')
                ORDER BY time_period;`,
        description: '过去24小时内的系统性能指标分析',
        dataSourceId: dataSources.mysql.id
      }
    ];

    // PostgreSQL示例查询
    const postgresQueries = [
      {
        name: 'PostgreSQL - 用户活跃度分析',
        query: `SELECT 
                u.username,
                COUNT(pv.id) AS visit_count,
                COUNT(DISTINCT pv.visit_date) AS active_days
                FROM users u
                LEFT JOIN page_visits pv ON u.id = pv.user_id
                GROUP BY u.id
                ORDER BY active_days DESC, visit_count DESC;`,
        description: '分析用户活跃度和页面访问情况',
        dataSourceId: dataSources.postgres.id
      },
      {
        name: 'PostgreSQL - 类别销售分析',
        query: `SELECT 
                c.category_name,
                COUNT(DISTINCT o.id) AS order_count,
                SUM(oi.price * oi.quantity) AS total_revenue
                FROM categories c
                JOIN products p ON c.id = p.category_id
                JOIN order_items oi ON p.id = oi.product_id
                JOIN orders o ON oi.order_id = o.id
                GROUP BY c.id
                ORDER BY total_revenue DESC;`,
        description: '各产品类别的订单数量和收入分析',
        dataSourceId: dataSources.postgres.id
      }
    ];

    // MariaDB示例查询
    const mariadbQueries = [
      {
        name: 'MariaDB - 用户购买行为分析',
        query: `SELECT 
                u.username,
                COUNT(o.id) AS order_count,
                SUM(o.total_amount) AS total_spent,
                MIN(o.created_at) AS first_purchase,
                MAX(o.created_at) AS last_purchase
                FROM users u
                JOIN orders o ON u.id = o.user_id
                GROUP BY u.id
                ORDER BY total_spent DESC;`,
        description: '分析用户购买行为和消费金额',
        dataSourceId: dataSources.mariadb.id
      },
      {
        name: 'MariaDB - 页面访问趋势',
        query: `SELECT 
                page_url,
                COUNT(*) AS visit_count,
                COUNT(DISTINCT user_id) AS unique_visitors,
                COUNT(DISTINCT ip_address) AS unique_ips
                FROM page_visits
                GROUP BY page_url
                ORDER BY visit_count DESC;`,
        description: '分析页面访问量和独立访客数',
        dataSourceId: dataSources.mariadb.id
      }
    ];

    // 合并所有查询
    const allQueries = [...mysqlQueries, ...postgresQueries, ...mariadbQueries];

    // 创建所有查询
    for (const queryData of allQueries) {
      const createdQuery = await prisma.query.create({
        data: {
          name: queryData.name,
          query: queryData.query,
          description: queryData.description,
          dataSourceId: queryData.dataSourceId
        }
      });
      console.log(`创建查询成功: ${createdQuery.name}`);
    }

    console.log(`共创建了 ${allQueries.length} 个示例查询`);
  } catch (error) {
    console.error('创建示例查询失败:', error);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('开始初始化Docker环境数据库连接...');
    
    // 创建数据库连接
    const dataSources = await createDockerDbConnections();
    
    // 创建示例查询
    await createSampleQueries(dataSources);
    
    console.log('Docker环境数据源和示例查询初始化完成！');
  } catch (error) {
    console.error('初始化失败:', error);
  } finally {
    // 关闭Prisma连接
    await prisma.$disconnect();
  }
}

// 执行主函数
main();